import {
  PRINT_METHOD,
  getUploadConfig,
  buildPrintQR,
  buildPrintList,
} from "./utils";
import {
  loadConfig,
  openEditRequest,
  createPriceTracker,
  saveRequest,
  submitUpload,
  loadDetail,
  loadPrintData,
} from "./services";
import {
  makeFile,
  firstOf,
  valuesOf,
  hasKey,
  detailCamel,
  detailPascal,
  detailWrapped,
  listStampOf,
  printStampResponse,
  configResponse,
  flushPromises,
} from "./__fixtures__/stampRequest";
import { fetchData } from "helpers/fetchData";

jest.mock("helpers/fetchData", () => ({
  fetchData: {
    stampRequest: {
      getConfig: jest.fn(),
      getDetail: jest.fn(),
      getPrice: jest.fn(),
      addFormData: jest.fn(),
      editFormData: jest.fn(),
      createNotRegister: jest.fn(),
      updateFilesAgain: jest.fn(),
      requestPermission: jest.fn(),
      createAfterPayment: jest.fn(),
      printStamp: jest.fn(),
    },
  },
}));

const api = fetchData.stampRequest;

const form = (over = {}) => ({
  quantity: 10,
  size: "3x3",
  printMethod: PRINT_METHOD.SELF,
  stampRange: "tpl-1",
  notes: "ghi chu",
  ...over,
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("loadConfig", () => {
  test("đọc isConfirm và hai đoạn hướng dẫn hồ sơ", async () => {
    api.getConfig.mockResolvedValue(configResponse({ isConfirm: false }));
    expect(await loadConfig()).toEqual({
      ok: true,
      isConfirm: false,
      attachmentStamps: "<p>Đơn xin cấp tem</p>",
      attachmentUsed: "<p>Hồ sơ cấp phép</p>",
    });
  });

  test("lỗi hoặc thiếu cấu hình: ok = false để màn hình không lưu cấu hình và thử lại", async () => {
    api.getConfig.mockResolvedValue(null);
    expect((await loadConfig()).ok).toBe(false);
    api.getConfig.mockRejectedValue(new Error("x"));
    expect((await loadConfig()).ok).toBe(false);
  });
});

describe("saveRequest", () => {
  test("Tạo Tự in: gọi addFormData 1 lần, IsPrint = true, Amount = 0, có Size, không gọi getPrice", async () => {
    api.addFormData.mockResolvedValue({ status: 200 });
    const res = await saveRequest({ form: form(), isConfirm: true, price: null, priceLoading: false });
    expect(res.ok).toBe(true);
    expect(res.message).toBe("Thêm xin cấp tem thành công!");
    expect(api.addFormData).toHaveBeenCalledTimes(1);
    expect(api.getPrice).not.toHaveBeenCalled();
    const fd = api.addFormData.mock.calls[0][0];
    expect(firstOf(fd, "IsPrint")).toBe("true");
    expect(firstOf(fd, "Amount")).toBe("0");
    expect(firstOf(fd, "Size")).toBe("3x3");
    expect(hasKey(fd, "Files")).toBe(false);
    expect(hasKey(fd, "Id")).toBe(false);
    expect(firstOf(fd, "FileUpload")).toBe("");
  });

  test("Tạo Yêu cầu in: IsPrint = false, Amount = SL × giá", async () => {
    api.getPrice.mockResolvedValue(500);
    api.addFormData.mockResolvedValue({ status: 200 });
    const tracker = createPriceTracker();
    await tracker.fetchNow(10);
    await saveRequest({
      form: form({ printMethod: PRINT_METHOD.REQUEST }),
      isConfirm: true,
      price: tracker.price,
      priceLoading: tracker.loading,
    });
    const fd = api.addFormData.mock.calls[0][0];
    expect(firstOf(fd, "IsPrint")).toBe("false");
    expect(firstOf(fd, "Amount")).toBe("5000");
  });

  test("Mở form sửa Yêu cầu in: getPrice gọi ngay với SL 10; lưu không đổi gì thì Amount = 5000, không phải 0 (app không lấy giá khi mở form sửa nên gửi 0)", async () => {
    api.getDetail.mockResolvedValue(
      detailWrapped(detailCamel({ id: "req-1", quantity: 10, isPrint: false, amount: 5000 }))
    );
    api.getPrice.mockResolvedValue(500);
    api.editFormData.mockResolvedValue({ status: 200 });
    const tracker = createPriceTracker();

    const opened = await openEditRequest("req-1", tracker);
    expect(api.getPrice).toHaveBeenCalledTimes(1);
    expect(api.getPrice).toHaveBeenCalledWith(10);
    expect(opened.ok).toBe(true);
    expect(opened.form.printMethod).toBe(PRINT_METHOD.REQUEST);

    const res = await saveRequest({
      form: opened.form,
      isConfirm: true,
      price: tracker.price,
      priceLoading: tracker.loading,
    });
    expect(res.ok).toBe(true);
    expect(res.message).toBe("Cập nhật xin cấp tem thành công!");
    expect(api.addFormData).not.toHaveBeenCalled();
    const fd = api.editFormData.mock.calls[0][0];
    expect(firstOf(fd, "Id")).toBe("req-1");
    expect(firstOf(fd, "Amount")).toBe("5000");
    expect(firstOf(fd, "FileUpload")).toBe("a.pdf;b.png");
    expect(firstOf(fd, "Size")).toBe("3x3");
  });

  test("Mở form sửa Tự in (tên trường PascalCase): không gọi getPrice", async () => {
    api.getDetail.mockResolvedValue(detailPascal({ id: "req-2", isPrint: true }));
    const tracker = createPriceTracker();
    const opened = await openEditRequest("req-2", tracker);
    expect(opened.ok).toBe(true);
    expect(opened.form.printMethod).toBe(PRINT_METHOD.SELF);
    expect(opened.form.id).toBe("req-2");
    expect(api.getPrice).not.toHaveBeenCalled();
  });

  test("Debounce: 1 → 12 → 120 trong 300 ms, getPrice gọi 1 lần với 120 sau 300 ms", async () => {
    api.getPrice.mockResolvedValue(500);
    const tracker = createPriceTracker({ delay: 300 });
    tracker.request(1);
    jest.advanceTimersByTime(100);
    tracker.request(12);
    jest.advanceTimersByTime(100);
    tracker.request(120);
    jest.advanceTimersByTime(299);
    expect(api.getPrice).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(api.getPrice).toHaveBeenCalledTimes(1);
    expect(api.getPrice).toHaveBeenCalledWith(120);
    await flushPromises();
    expect(tracker.price).toBe(500);
    expect(tracker.loading).toBe(false);
  });

  test("Kết quả của lần gọi cũ bị bỏ khi đã có lần gọi mới", async () => {
    let resolveOld;
    api.getPrice
      .mockReturnValueOnce(new Promise((r) => (resolveOld = r)))
      .mockResolvedValueOnce(700);
    const tracker = createPriceTracker({ delay: 300 });
    tracker.request(1);
    jest.advanceTimersByTime(300);
    tracker.request(2);
    jest.advanceTimersByTime(300);
    await flushPromises();
    expect(tracker.price).toBe(700);
    resolveOld(111);
    await flushPromises();
    expect(tracker.price).toBe(700);
    expect(tracker.loading).toBe(false);
  });

  test("cancel huỷ luôn lần lấy giá đang chờ debounce", async () => {
    api.getPrice.mockResolvedValue(500);
    const tracker = createPriceTracker({ delay: 300 });
    tracker.request(500);
    tracker.cancel();
    jest.advanceTimersByTime(300);
    await flushPromises();
    expect(api.getPrice).not.toHaveBeenCalled();
    expect(tracker.price).toBe(null);
    expect(tracker.loading).toBe(false);
  });

  test("số lượng không hợp lệ: không gọi getPrice, không treo trạng thái chờ", () => {
    const tracker = createPriceTracker({ delay: 300 });
    tracker.request(0);
    tracker.request(100001);
    jest.advanceTimersByTime(300);
    expect(api.getPrice).not.toHaveBeenCalled();
    expect(tracker.loading).toBe(false);
  });

  test("Đang chờ giá: không cho lưu; có giá rồi mới lưu với số tiền mới (app không chặn, gửi Amount = 0)", async () => {
    let resolvePrice;
    api.getPrice.mockReturnValue(new Promise((r) => (resolvePrice = r)));
    api.addFormData.mockResolvedValue({ status: 200 });
    const tracker = createPriceTracker({ delay: 300 });
    const request = form({ printMethod: PRINT_METHOD.REQUEST, quantity: 20 });

    tracker.request(20);
    expect(tracker.loading).toBe(true);
    jest.advanceTimersByTime(300);
    expect(tracker.loading).toBe(true);

    const blocked = await saveRequest({
      form: request,
      isConfirm: true,
      price: tracker.price,
      priceLoading: tracker.loading,
    });
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe("PRICE_LOADING");
    expect(api.addFormData).not.toHaveBeenCalled();

    resolvePrice(500);
    await flushPromises();
    expect(tracker.loading).toBe(false);

    const saved = await saveRequest({
      form: request,
      isConfirm: true,
      price: tracker.price,
      priceLoading: tracker.loading,
    });
    expect(saved.ok).toBe(true);
    expect(firstOf(api.addFormData.mock.calls[0][0], "Amount")).toBe("10000");
  });

  test("lấy giá thất bại: không cho lưu Yêu cầu in (không gửi Amount sai)", async () => {
    api.getPrice.mockRejectedValue(new Error("net"));
    const tracker = createPriceTracker();
    await tracker.fetchNow(10);
    expect(tracker.price).toBeNull();
    expect(tracker.loading).toBe(false);
    const res = await saveRequest({
      form: form({ printMethod: PRINT_METHOD.REQUEST }),
      isConfirm: true,
      price: tracker.price,
      priceLoading: tracker.loading,
    });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("PRICE_UNKNOWN");
    expect(api.addFormData).not.toHaveBeenCalled();
  });

  test("dữ liệu không hợp lệ: không gọi API, trả lỗi theo trường", async () => {
    const res = await saveRequest({
      form: form({ printMethod: null, quantity: 100001 }),
      isConfirm: true,
      price: null,
      priceLoading: false,
    });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("INVALID");
    expect(res.errors.printMethod).toBe("Bạn muốn tự in hay yêu cầu in?");
    expect(res.errors.quantity).toBe("Số lượng không được vượt quá 100.000");
    expect(api.addFormData).not.toHaveBeenCalled();
  });

  test("server trả lỗi: ok = false, giữ câu thất bại của web", async () => {
    api.addFormData.mockResolvedValue({ status: 400, message: "x" });
    const res = await saveRequest({ form: form(), isConfirm: true, price: null, priceLoading: false });
    expect(res.ok).toBe(false);
    expect(res.message).toBe("Thêm xin cấp tem thất bại!");
  });

  test("isConfirm = false: gọi createNotRegister chỉ với quantity, không gọi addFormData", async () => {
    api.createNotRegister.mockResolvedValue({ status: 200 });
    const res = await saveRequest({
      form: { quantity: 10, size: "", printMethod: null, stampRange: "" },
      isConfirm: false,
      price: null,
      priceLoading: false,
    });
    expect(res.ok).toBe(true);
    expect(api.createNotRegister).toHaveBeenCalledTimes(1);
    expect(api.createNotRegister).toHaveBeenCalledWith({ quantity: 10 });
    expect(api.addFormData).not.toHaveBeenCalled();
  });
});

describe("submitUpload", () => {
  test("Nộp lại hồ sơ: files lặp theo số tệp, fileUpload là tên tệp cũ nối ';'", async () => {
    api.updateFilesAgain.mockResolvedValue({ status: 200 });
    const res = await submitUpload({
      config: getUploadConfig({ kind: "resubmit" }),
      id: "req-1",
      newFiles: [makeFile("n1.pdf"), makeFile("n2.png", "image/png")],
      keptNames: ["old1.pdf", "old2.pdf"],
    });
    expect(res).toEqual({ ok: true, message: "Nộp lại hồ sơ thành công" });
    const fd = api.updateFilesAgain.mock.calls[0][0];
    expect(firstOf(fd, "id")).toBe("req-1");
    expect(valuesOf(fd, "files")).toHaveLength(2);
    expect(firstOf(fd, "fileUpload")).toBe("old1.pdf;old2.pdf");
  });

  test("Nộp lại: chỉ giữ tệp cũ, không thêm tệp mới vẫn hợp lệ (như app)", async () => {
    api.updateFilesAgain.mockResolvedValue({ status: 200 });
    const res = await submitUpload({
      config: getUploadConfig({ kind: "resubmit" }),
      id: "req-1",
      newFiles: [],
      keptNames: ["old1.pdf"],
    });
    expect(res.ok).toBe(true);
    const fd = api.updateFilesAgain.mock.calls[0][0];
    expect(hasKey(fd, "files")).toBe(false);
    expect(firstOf(fd, "fileUpload")).toBe("old1.pdf");
  });

  test("Xin cấp phép lần đầu: requestPermission với fileUploadUsedFiles, fileUploadUsed rỗng", async () => {
    api.requestPermission.mockResolvedValue({ status: 200 });
    const res = await submitUpload({
      config: getUploadConfig({ kind: "permission", used: 0 }),
      id: "req-1",
      newFiles: [makeFile("a.pdf")],
      keptNames: [],
    });
    expect(res).toEqual({ ok: true, message: "Gửi yêu cầu cấp phép thành công" });
    expect(api.requestPermission).toHaveBeenCalledTimes(1);
    expect(api.updateFilesAgain).not.toHaveBeenCalled();
    const fd = api.requestPermission.mock.calls[0][0];
    expect(valuesOf(fd, "fileUploadUsedFiles")).toHaveLength(1);
    expect(firstOf(fd, "fileUploadUsed")).toBe("");
  });

  test("Xin cấp phép lại (used = 3): updateFilesAgain với fileUploadUsedFiles và fileUploadUsed", async () => {
    api.updateFilesAgain.mockResolvedValue({ status: 200 });
    await submitUpload({
      config: getUploadConfig({ kind: "permission", used: 3 }),
      id: "req-1",
      newFiles: [makeFile("new.pdf")],
      keptNames: ["x.pdf"],
    });
    expect(api.requestPermission).not.toHaveBeenCalled();
    const fd = api.updateFilesAgain.mock.calls[0][0];
    expect(valuesOf(fd, "fileUploadUsedFiles")).toHaveLength(1);
    expect(firstOf(fd, "fileUploadUsed")).toBe("x.pdf");
  });

  test("Gửi chứng từ thanh toán: createAfterPayment với id, files, FileUpload rỗng", async () => {
    api.createAfterPayment.mockResolvedValue({ status: 200 });
    const res = await submitUpload({
      config: getUploadConfig({ kind: "payment" }),
      id: "req-1",
      newFiles: [makeFile("bl.pdf")],
      keptNames: [],
    });
    expect(res).toEqual({ ok: true, message: "Gửi chứng từ thanh toán thành công" });
    const fd = api.createAfterPayment.mock.calls[0][0];
    expect(firstOf(fd, "id")).toBe("req-1");
    expect(valuesOf(fd, "files")).toHaveLength(1);
    expect(firstOf(fd, "FileUpload")).toBe("");
  });

  test.each([
    ["resubmit", {}],
    ["permission", { used: 0 }],
    ["payment", {}],
  ])("Không có tệp (%s): không gọi API, báo 'Bạn vui lòng chọn chứng từ!'", async (kind, extra) => {
    const res = await submitUpload({
      config: getUploadConfig({ kind, ...extra }),
      id: "req-1",
      newFiles: [],
      keptNames: [],
    });
    expect(res).toEqual({ ok: false, message: "Bạn vui lòng chọn chứng từ!" });
    Object.values(api).forEach((fn) => expect(fn).not.toHaveBeenCalled());
  });

  test("Server báo lỗi: hiện lỗi server nếu có, không thì câu chung (app luôn dùng câu chung)", async () => {
    api.createAfterPayment.mockResolvedValueOnce({ status: 400, message: "Lỗi từ server" });
    api.createAfterPayment.mockResolvedValueOnce({ status: 400 });
    api.createAfterPayment.mockRejectedValueOnce(new Error("net"));
    const input = {
      config: getUploadConfig({ kind: "payment" }),
      id: "req-1",
      newFiles: [makeFile("a.pdf")],
      keptNames: [],
    };
    expect(await submitUpload(input)).toEqual({ ok: false, message: "Lỗi từ server" });
    expect(await submitUpload(input)).toEqual({ ok: false, message: "Thêm chứng từ thất bại!" });
    expect(await submitUpload(input)).toEqual({ ok: false, message: "Thêm chứng từ thất bại!" });
  });
});

describe("loadDetail", () => {
  test("đọc được chi tiết dù bọc trong `request` hay để phẳng, camelCase hay PascalCase", async () => {
    api.getDetail.mockResolvedValueOnce(detailWrapped(detailCamel({ id: "a" })));
    expect((await loadDetail("a")).detail.id).toBe("a");
    api.getDetail.mockResolvedValueOnce(detailPascal({ id: "b", isPrint: true, fileUploadUsed: "u.pdf" }));
    const res = await loadDetail("b");
    expect(res.detail).toMatchObject({ id: "b", isPrint: true, fileUploadUsed: "u.pdf" });
  });

  test("Lỗi tải chi tiết: kết quả loại lỗi, không phải thành công (app báo bằng toast thành công)", async () => {
    api.getDetail.mockRejectedValue(new Error("net"));
    let res = await loadDetail("req-1");
    expect(res.ok).toBe(false);
    expect(res.level).toBe("error");
    api.getDetail.mockResolvedValue(null);
    res = await loadDetail("req-1");
    expect(res.ok).toBe(false);
    expect(res.level).toBe("error");
  });
});

describe("loadPrintData", () => {
  const payload = printStampResponse({ listStamp: listStampOf(["A", "B", "C"]), quantity: 3 });

  test("Gọi printStamp đúng id, truyền đủ listStamp/template/quantity sang hàm dựng bản in", async () => {
    api.printStamp.mockResolvedValue(payload);
    const qr = await loadPrintData("req-1", "qr");
    expect(api.printStamp).toHaveBeenCalledWith("req-1");
    expect(qr).toEqual({
      ok: true,
      template: "https://img/tpl.png",
      quantity: 3,
      ...buildPrintQR({ listStamp: payload.listStamp, quantity: 3 }),
    });
    const list = await loadPrintData("req-1", "list");
    expect(list).toEqual({
      ok: true,
      template: "https://img/tpl.png",
      quantity: 3,
      ...buildPrintList({ listStamp: payload.listStamp, quantity: 3 }),
    });
  });

  test("không lấy được dữ liệu in: ok = false", async () => {
    api.printStamp.mockResolvedValue(null);
    expect((await loadPrintData("req-1", "qr")).ok).toBe(false);
    api.printStamp.mockRejectedValue(new Error("net"));
    expect((await loadPrintData("req-1", "list")).ok).toBe(false);
  });
});
