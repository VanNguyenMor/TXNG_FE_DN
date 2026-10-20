import {
  PRINT_METHOD,
  toFormData,
  buildRequestFormData,
  validateRequest,
  calcAmount,
  getRowActions,
  getSimpleRowActions,
  getUploadConfig,
  buildPrintQR,
  buildPrintList,
} from "./utils";
import {
  makeFile,
  firstOf,
  valuesOf,
  hasKey,
  listStampOf,
} from "./__fixtures__/stampRequest";
import { ROW_ACTION_CASES } from "./__fixtures__/cases";

const baseForm = (over = {}) => ({
  quantity: 10,
  stampTemplateId: "tpl-1",
  size: "3x3",
  printMethod: PRINT_METHOD.SELF,
  price: null,
  note: "",
  fileUpload: "",
  ...over,
});

const validForm = (over = {}) => ({
  quantity: 10,
  size: "3x3",
  printMethod: PRINT_METHOD.SELF,
  stampRange: "tpl-1",
  ...over,
});

describe("buildRequestFormData", () => {
  test("Tự in: IsPrint = true, Amount = 0", () => {
    const fd = buildRequestFormData(baseForm({ printMethod: PRINT_METHOD.SELF }));
    expect(firstOf(fd, "IsPrint")).toBe("true");
    expect(firstOf(fd, "Amount")).toBe("0");
  });

  test("Yêu cầu in SL 10 giá 500: IsPrint = false, Amount = 5000", () => {
    const fd = buildRequestFormData(baseForm({ printMethod: PRINT_METHOD.REQUEST, price: 500 }));
    expect(firstOf(fd, "IsPrint")).toBe("false");
    expect(firstOf(fd, "Amount")).toBe("5000");
  });

  test("Sửa: có Id và Size = 4x4 (app bỏ sót Size khi sửa)", () => {
    const fd = buildRequestFormData(
      baseForm({ id: "req-1", size: "4x4", printMethod: PRINT_METHOD.REQUEST, price: 500 })
    );
    expect(firstOf(fd, "Id")).toBe("req-1");
    expect(firstOf(fd, "Size")).toBe("4x4");
  });

  test("Không tệp, Note null: không có Files, không có Note", () => {
    const fd = buildRequestFormData(baseForm({ note: null, files: [] }));
    expect(hasKey(fd, "Files")).toBe(false);
    expect(hasKey(fd, "Note")).toBe(false);
  });

  test("2 tệp: trường tệp xuất hiện 2 lần cùng tên", () => {
    const fd = buildRequestFormData(
      baseForm({ files: [makeFile("a.pdf"), makeFile("b.png", "image/png")] })
    );
    expect(valuesOf(fd, "Files")).toHaveLength(2);
  });

  test("tạo mới không gửi Id; không có giá khi Yêu cầu in thì không dựng được dữ liệu", () => {
    expect(hasKey(buildRequestFormData(baseForm()), "Id")).toBe(false);
    expect(() =>
      buildRequestFormData(baseForm({ printMethod: PRINT_METHOD.REQUEST, price: null }))
    ).toThrow();
  });
});

describe("toFormData", () => {
  test("bỏ null/undefined, giữ chuỗi rỗng, bỏ danh sách rỗng", () => {
    const fd = toFormData({ a: null, b: undefined, c: "", d: 0, e: false, f: [] });
    expect(hasKey(fd, "a")).toBe(false);
    expect(hasKey(fd, "b")).toBe(false);
    expect(firstOf(fd, "c")).toBe("");
    expect(firstOf(fd, "d")).toBe("0");
    expect(firstOf(fd, "e")).toBe("false");
    expect(hasKey(fd, "f")).toBe(false);
  });
});

describe("validateRequest", () => {
  test.each([
    ["", "trống"],
    [0, "0"],
    [-5, "-5"],
  ])("Số lượng %s (%s) có lỗi ở số lượng", (quantity) => {
    expect(validateRequest(validForm({ quantity })).quantity).toBeTruthy();
  });

  test("100000 hợp lệ; 100001 lỗi 'Số lượng không được vượt quá 100.000' (app báo 'nhỏ hơn 100000' dù cho nhập 100000)", () => {
    expect(validateRequest(validForm({ quantity: 100000 })).quantity).toBeUndefined();
    expect(validateRequest(validForm({ quantity: 100001 })).quantity).toBe(
      "Số lượng không được vượt quá 100.000"
    );
  });

  test("Thiếu phương thức in: 'Bạn muốn tự in hay yêu cầu in?'", () => {
    expect(validateRequest(validForm({ printMethod: null })).printMethod).toBe(
      "Bạn muốn tự in hay yêu cầu in?"
    );
    expect(validateRequest(validForm({ printMethod: undefined })).printMethod).toBeTruthy();
  });

  test("Thiếu mẫu tem / thiếu kích thước", () => {
    expect(validateRequest(validForm({ stampRange: "" })).stampRange).toBe(
      "Bạn vui lòng chọn mẫu tem"
    );
    expect(validateRequest(validForm({ size: "" })).size).toBe(
      "Kích thước tem không được trống"
    );
  });

  test("form hợp lệ không có lỗi nào; chọn Yêu cầu in (0) vẫn là đã chọn", () => {
    expect(validateRequest(validForm())).toEqual({});
    expect(validateRequest(validForm({ printMethod: PRINT_METHOD.REQUEST }))).toEqual({});
  });

  test("isConfirm = false chỉ kiểm tra số lượng", () => {
    const form = { quantity: 10, size: "", printMethod: null, stampRange: "" };
    expect(validateRequest(form, { isConfirm: false })).toEqual({});
    expect(validateRequest({ ...form, quantity: 0 }, { isConfirm: false }).quantity).toBeTruthy();
  });

  test("số lượng không nguyên bị chặn", () => {
    expect(validateRequest(validForm({ quantity: 1.5 })).quantity).toBeTruthy();
  });
});

describe("calcAmount", () => {
  test("Tự in = 0; Yêu cầu in = SL × giá; giá chưa có thì không cho lưu (app vẫn lưu với Amount = 0)", () => {
    expect(calcAmount({ printMethod: PRINT_METHOD.SELF, quantity: 10, price: 500 })).toEqual({
      amount: 0,
      canSave: true,
    });
    expect(calcAmount({ printMethod: PRINT_METHOD.REQUEST, quantity: 10, price: 500 })).toEqual({
      amount: 5000,
      canSave: true,
    });
    expect(calcAmount({ printMethod: PRINT_METHOD.REQUEST, quantity: 10, price: null }).canSave).toBe(false);
    expect(calcAmount({ printMethod: PRINT_METHOD.REQUEST, quantity: 10, price: undefined }).canSave).toBe(false);
    expect(calcAmount({ printMethod: PRINT_METHOD.SELF, quantity: 10, price: null }).canSave).toBe(true);
  });
});

describe("getRowActions", () => {
  test.each(ROW_ACTION_CASES)("%s", (_desc, item, expected) => {
    expect(getRowActions(item)).toEqual(expected);
  });
});

describe("getSimpleRowActions (isConfirm = false)", () => {
  test.each([
    [0, ["view", "edit", "delete", "print"]],
    [1, ["view", "edit", "delete", "print"]],
    [2, ["view", "print"]],
    [3, ["view", "edit", "delete", "print"]],
  ])("status %i", (status, expected) => {
    expect(getSimpleRowActions({ status })).toEqual(expected);
  });
});

describe("getUploadConfig", () => {
  test("Nộp lại hồ sơ", () => {
    expect(getUploadConfig({ kind: "resubmit" })).toMatchObject({
      api: "updateFilesAgain",
      fileField: "files",
      oldFilesField: "fileUpload",
      keepOldFiles: true,
      instruction: "attachmentStamps",
      showAmount: false,
      title: "Nộp lại hồ sơ yêu cầu cấp tem",
      successMessage: "Nộp lại hồ sơ thành công",
    });
  });

  test("Xin cấp phép lần đầu (used = 0)", () => {
    expect(getUploadConfig({ kind: "permission", used: 0 })).toMatchObject({
      api: "requestPermission",
      fileField: "fileUploadUsedFiles",
      oldFilesField: "fileUploadUsed",
      keepOldFiles: false,
      instruction: "attachmentUsed",
      title: "Yêu cầu cấp phép sử dụng tem",
      successMessage: "Gửi yêu cầu cấp phép thành công",
    });
  });

  test("Xin cấp phép lại (used = 3)", () => {
    expect(getUploadConfig({ kind: "permission", used: 3 })).toMatchObject({
      api: "updateFilesAgain",
      fileField: "fileUploadUsedFiles",
      oldFilesField: "fileUploadUsed",
      keepOldFiles: true,
    });
  });

  test("Gửi chứng từ thanh toán", () => {
    expect(getUploadConfig({ kind: "payment" })).toMatchObject({
      api: "createAfterPayment",
      fileField: "files",
      oldFilesField: "FileUpload",
      keepOldFiles: false,
      instruction: "attachmentStamps",
      showAmount: true,
      title: "Gửi chứng từ thanh toán",
      successMessage: "Gửi chứng từ thanh toán thành công",
    });
  });
});

describe("in tem", () => {
  test("In QR: 3 mã, bỏ phần tử rỗng, nhãn là phần sau '/?qr='", () => {
    const r = buildPrintQR({
      listStamp: "https://x/?qr=A;https://x/?qr=B;;https://x/?qr=C",
      quantity: 3,
    });
    expect(r.total).toBe(3);
    expect(r.blocks).toHaveLength(1);
    expect(r.blocks[0]).toEqual([
      { value: "https://x/?qr=A", label: "A" },
      { value: "https://x/?qr=B", label: "B" },
      { value: "https://x/?qr=C", label: "C" },
    ]);
  });

  test("In QR: mã không có '/?qr=' thì nhãn giữ nguyên mã", () => {
    const r = buildPrintQR({ listStamp: "TX0001234;https://x/?qr=B", quantity: 2 });
    expect(r.blocks[0]).toEqual([
      { value: "TX0001234", label: "TX0001234" },
      { value: "https://x/?qr=B", label: "B" },
    ]);
  });

  test("In QR: 25 mã chia 3 khối 10, 10, 5", () => {
    const codes = Array.from({ length: 25 }, (_, i) => `C${i}`);
    const r = buildPrintQR({ listStamp: listStampOf(codes), quantity: 25 });
    expect(r.blocks.map((b) => b.length)).toEqual([10, 10, 5]);
    expect(r.total).toBe(25);
  });

  test("Danh sách mã tem: tiêu đề 'mã tem' (app ghi nhầm 'mẫu tem'), bỏ dòng rỗng (app giữ)", () => {
    const r = buildPrintList({ listStamp: "A;B;;C", quantity: 3 });
    expect(r.title).toBe("Danh sách mã tem. Số lượng: 3");
    expect(r.lines).toEqual(["A", "B", "C"]);
  });

  test("listStamp rỗng hoặc thiếu: không lỗi, không có QR", () => {
    expect(buildPrintQR({ listStamp: "", quantity: 0 }).total).toBe(0);
    expect(buildPrintQR({ quantity: 0 }).blocks).toEqual([]);
    expect(buildPrintList({ quantity: 0 }).lines).toEqual([]);
  });
});
