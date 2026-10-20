import { fetchData } from "helpers/fetchData";
import {
  PRINT_METHOD,
  MAX_QUANTITY,
  normalizeRequest,
  validateRequest,
  buildRequestFormData,
  toFormData,
  buildPrintQR,
  buildPrintList,
} from "./utils";

const api = () => fetchData.stampRequest;

const GENERIC_UPLOAD_ERROR = "Thêm chứng từ thất bại!";

export const loadConfig = async () => {
  let data = null;
  try {
    data = await api().getConfig();
  } catch (error) {
    data = null;
  }
  const ok = Boolean(data);
  data = data || {};
  return {
    ok,
    isConfirm: Boolean(data.isConfirm !== undefined ? data.isConfirm : data.IsConfirm),
    attachmentStamps: data.attachmentStamps || data.AttachmentStamps || "",
    attachmentUsed: data.attachmentUsed || data.AttachmentUsed || "",
  };
};

export const loadDetail = async (id) => {
  try {
    const raw = await api().getDetail(id);
    if (!raw) {
      return { ok: false, level: "error", message: "Không tải được dữ liệu chi tiết!" };
    }
    return { ok: true, detail: normalizeRequest(raw) };
  } catch (error) {
    return { ok: false, level: "error", message: "Có lỗi xảy ra khi tải dữ liệu!" };
  }
};

const isValidQuantity = (quantity) => {
  if (quantity === "" || quantity === null || quantity === undefined) return false;
  const n = Number(quantity);
  return Number.isInteger(n) && n > 0 && n <= MAX_QUANTITY;
};

export const createPriceTracker = ({ delay = 300, onChange } = {}) => {
  let timer = null;
  let sequence = 0;
  const state = { price: null, loading: false };

  const notify = () => onChange && onChange({ ...state });

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const run = async (quantity) => {
    const mine = ++sequence;
    let price = null;
    try {
      price = await api().getPrice(quantity);
    } catch (error) {
      price = null;
    }
    if (mine !== sequence) return;
    state.price = typeof price === "number" && Number.isFinite(price) ? price : null;
    state.loading = false;
    notify();
  };

  const reset = () => {
    clearTimer();
    sequence++;
    state.price = null;
    state.loading = false;
    notify();
  };

  return {
    get price() {
      return state.price;
    },
    get loading() {
      return state.loading;
    },
    request(quantity) {
      clearTimer();
      if (!isValidQuantity(quantity)) return reset();
      sequence++;
      state.price = null;
      state.loading = true;
      notify();
      timer = setTimeout(() => {
        timer = null;
        run(quantity);
      }, delay);
    },
    fetchNow(quantity) {
      clearTimer();
      if (!isValidQuantity(quantity)) return Promise.resolve(reset());
      state.price = null;
      state.loading = true;
      notify();
      return run(quantity);
    },
    cancel: reset,
  };
};

export const openEditRequest = async (id, tracker) => {
  const loaded = await loadDetail(id);
  if (!loaded.ok) return loaded;

  const detail = loaded.detail;
  const form = {
    id: detail.id !== undefined && detail.id !== null ? detail.id : id,
    quantity: Number(detail.quantity) || 0,
    stampRange: detail.stampTemplateID || "",
    size: detail.size || "",
    printMethod: detail.isPrint === true ? PRINT_METHOD.SELF : PRINT_METHOD.REQUEST,
    notes: detail.note || "",
    status: detail.status || 0,
    fileUpload: detail.fileUpload || "",
  };

  if (form.printMethod === PRINT_METHOD.REQUEST && tracker) {
    await tracker.fetchNow(form.quantity);
  }

  return { ok: true, form, detail };
};

export const saveRequest = async ({ form, isConfirm, price, priceLoading }) => {
  const errors = validateRequest(form, { isConfirm });
  if (Object.keys(errors).length > 0) return { ok: false, reason: "INVALID", errors };

  const isEdit = Boolean(form.id);

  try {
    let result;

    if (!isConfirm && !isEdit) {
      result = await api().createNotRegister({ quantity: Number(form.quantity) });
    } else {
      if (form.printMethod === PRINT_METHOD.REQUEST) {
        if (priceLoading) {
          return { ok: false, reason: "PRICE_LOADING", message: "Đang lấy đơn giá, vui lòng đợi giây lát" };
        }
        if (typeof price !== "number" || !Number.isFinite(price)) {
          return { ok: false, reason: "PRICE_UNKNOWN", message: "Chưa lấy được đơn giá, vui lòng thử lại" };
        }
      }

      const formData = buildRequestFormData({
        id: isEdit ? form.id : undefined,
        quantity: form.quantity,
        stampTemplateId: form.stampRange,
        size: form.size,
        printMethod: form.printMethod,
        price,
        note: form.notes,
        fileUpload: isEdit ? form.fileUpload : "",
      });
      result = isEdit
        ? await api().editFormData(formData)
        : await api().addFormData(formData);
    }

    if (result && result.status === 200) {
      return {
        ok: true,
        message: isEdit ? "Cập nhật xin cấp tem thành công!" : "Thêm xin cấp tem thành công!",
      };
    }
    return {
      ok: false,
      message: isEdit ? "Cập nhật xin cấp tem thất bại!" : "Thêm xin cấp tem thất bại!",
    };
  } catch (error) {
    return { ok: false, message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

export const submitUpload = async ({ config, id, newFiles, keptNames }) => {
  const kept = config.keepOldFiles ? keptNames : [];

  if (newFiles.length + kept.length === 0) {
    return { ok: false, message: "Bạn vui lòng chọn chứng từ!" };
  }

  const formData = toFormData({
    id,
    [config.fileField]: newFiles,
    [config.oldFilesField]: kept.join(";"),
  });

  try {
    const result = await api()[config.api](formData);
    if (result && result.status === 200) {
      return { ok: true, message: config.successMessage };
    }
    return { ok: false, message: (result && result.message) || GENERIC_UPLOAD_ERROR };
  } catch (error) {
    return { ok: false, message: GENERIC_UPLOAD_ERROR };
  }
};

const getTemplateUrl = (template) => {
  if (typeof template === "string") return template;
  return (template && typeof template.template === "string" && template.template) || "";
};

export const loadPrintData = async (id, mode) => {
  try {
    const data = await api().printStamp(id);
    if (!data) return { ok: false, message: "Không lấy được dữ liệu in tem" };

    const input = { listStamp: data.listStamp, quantity: data.quantity };
    const built = mode === "qr" ? buildPrintQR(input) : buildPrintList(input);
    return { ok: true, template: getTemplateUrl(data.template), quantity: data.quantity, ...built };
  } catch (error) {
    return { ok: false, message: "Có lỗi xảy ra khi lấy dữ liệu in tem" };
  }
};
