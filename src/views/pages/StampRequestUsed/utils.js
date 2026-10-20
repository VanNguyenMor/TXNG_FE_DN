export const MAX_QUANTITY = 100000;
export const PRINT_BLOCK_SIZE = 10;
export const MAX_QR_PRINT = 5000;

export const PRINT_METHOD = { REQUEST: 0, SELF: 1 };

export const ROW_ACTION = {
  VIEW: "view",
  EDIT: "edit",
  DELETE: "delete",
  RESUBMIT: "resubmit",
  REQUEST_PERMISSION: "requestPermission",
  PAYMENT: "payment",
  PRINT: "print",
};

const isBlank = (value) =>
  value === null || value === undefined || String(value).trim() === "";

const REQUEST_FIELDS = [
  "id",
  "quantity",
  "stampTemplateID",
  "size",
  "isPrint",
  "amount",
  "note",
  "status",
  "requestedUsedStatus",
  "requestedDate",
  "deliveryDate",
  "fileUpload",
  "fileUploadUsed",
  "reason",
  "requestedUsedReason",
  "partnerName",
];

export const normalizeRequest = (raw) => {
  const source = (raw && raw.request) || raw || {};
  const out = {};
  REQUEST_FIELDS.forEach((key) => {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1);
    out[key] = source[key] !== undefined ? source[key] : source[pascal];
  });
  return out;
};

export const splitFileNames = (value) =>
  (value || "").split(";").filter((name) => name);

export const formatNumber = (value) =>
  (Number(value) || 0).toLocaleString("de-DE");

export const toFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (typeof value === "object" && !(value instanceof Blob)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const calcAmount = ({ printMethod, quantity, price }) => {
  if (printMethod === PRINT_METHOD.SELF) return { amount: 0, canSave: true };
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return { amount: 0, canSave: false };
  }
  return { amount: (Number(quantity) || 0) * price, canSave: true };
};

export const validateRequest = (form, { isConfirm = true } = {}) => {
  const errors = {};
  const { quantity, size, printMethod, stampRange } = form;

  if (isBlank(quantity) || Number(quantity) <= 0 || Number.isNaN(Number(quantity))) {
    errors.quantity = "Số lượng không được trống và phải lớn hơn 0";
  } else if (!Number.isInteger(Number(quantity))) {
    errors.quantity = "Số lượng phải là số nguyên";
  } else if (Number(quantity) > MAX_QUANTITY) {
    errors.quantity = "Số lượng không được vượt quá 100.000";
  }

  if (!isConfirm) return errors;

  if (isBlank(printMethod)) {
    errors.printMethod = "Bạn muốn tự in hay yêu cầu in?";
  }

  if (isBlank(stampRange)) {
    errors.stampRange = "Bạn vui lòng chọn mẫu tem";
  }

  if (isBlank(size)) {
    errors.size = "Kích thước tem không được trống";
  }

  return errors;
};

export const buildRequestFormData = ({
  id,
  quantity,
  stampTemplateId,
  size,
  printMethod,
  price,
  note,
  fileUpload,
  files,
}) => {
  const { amount, canSave } = calcAmount({ printMethod, quantity, price });
  if (!canSave) throw new Error("PRICE_NOT_READY");

  return toFormData({
    Id: id,
    Quantity: Number(quantity),
    StampTemplateID: stampTemplateId,
    Size: size,
    IsPrint: printMethod === PRINT_METHOD.SELF,
    Amount: amount,
    Note: note,
    FileUpload: fileUpload,
    Files: files,
  });
};

const toStatus = (value) =>
  value === null || value === undefined || value === "" ? NaN : Number(value);

export const getRowActions = ({ status, requestedUsedStatus, isPrint }) => {
  const st = toStatus(status);
  const used = toStatus(requestedUsedStatus);
  const actions = [ROW_ACTION.VIEW];

  if ((st === 0 || st === 3) && used === 0) {
    actions.push(ROW_ACTION.EDIT, ROW_ACTION.DELETE);
  }
  if (st === 3 && used === 0) actions.push(ROW_ACTION.RESUBMIT);
  if (isPrint === true && st === 2 && (used === 0 || used === 3)) {
    actions.push(ROW_ACTION.REQUEST_PERMISSION);
  }
  if (isPrint === false && st === 4) actions.push(ROW_ACTION.PAYMENT);
  if (isPrint === true && st === 2 && used === 2) actions.push(ROW_ACTION.PRINT);

  return actions;
};

export const getSimpleRowActions = ({ status }) => {
  const actions = [ROW_ACTION.VIEW];
  if (toStatus(status) !== 2) actions.push(ROW_ACTION.EDIT, ROW_ACTION.DELETE);
  actions.push(ROW_ACTION.PRINT);
  return actions;
};

export const getUploadConfig = ({ kind, used }) => {
  switch (kind) {
    case "resubmit":
      return {
        api: "updateFilesAgain",
        fileField: "files",
        oldFilesField: "fileUpload",
        keepOldFiles: true,
        instruction: "attachmentStamps",
        showAmount: false,
        title: "Nộp lại hồ sơ yêu cầu cấp tem",
        successMessage: "Nộp lại hồ sơ thành công",
      };
    case "permission":
      return {
        api: Number(used) === 3 ? "updateFilesAgain" : "requestPermission",
        fileField: "fileUploadUsedFiles",
        oldFilesField: "fileUploadUsed",
        keepOldFiles: Number(used) === 3,
        instruction: "attachmentUsed",
        showAmount: false,
        title: "Yêu cầu cấp phép sử dụng tem",
        successMessage: "Gửi yêu cầu cấp phép thành công",
      };
    case "payment":
      return {
        api: "createAfterPayment",
        fileField: "files",
        oldFilesField: "FileUpload",
        keepOldFiles: false,
        instruction: "attachmentStamps",
        showAmount: true,
        title: "Gửi chứng từ thanh toán",
        successMessage: "Gửi chứng từ thanh toán thành công",
      };
    default:
      throw new Error(`Unknown upload kind: ${kind}`);
  }
};

const printTitle = (quantity) => `Danh sách mã tem. Số lượng: ${quantity}`;

const splitStamps = (listStamp) =>
  (listStamp || "").split(";").filter((code) => code !== "");

export const buildPrintList = ({ listStamp, quantity }) => ({
  title: printTitle(quantity),
  lines: splitStamps(listStamp),
});

export const buildPrintQR = ({ listStamp, quantity }) => {
  const codes = splitStamps(listStamp);
  const blocks = [];

  codes.forEach((value, i) => {
    if (i % PRINT_BLOCK_SIZE === 0) blocks.push([]);
    const index = value.indexOf("/?qr=");
    const label = index === -1 ? value : value.slice(index + 5);
    blocks[blocks.length - 1].push({ value, label });
  });

  return { title: printTitle(quantity), blocks, total: codes.length };
};
