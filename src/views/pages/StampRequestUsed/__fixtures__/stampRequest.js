export const makeFile = (name, type = "application/pdf") =>
  new File(["x"], name, { type });

const entriesOf = (formData) => {
  const out = [];
  for (const [key, value] of formData.entries()) {
    out.push([key.toLowerCase(), value]);
  }
  return out;
};

export const valuesOf = (formData, key) =>
  entriesOf(formData)
    .filter(([k]) => k === key.toLowerCase())
    .map(([, v]) => v);

export const firstOf = (formData, key) => valuesOf(formData, key)[0];

export const hasKey = (formData, key) => valuesOf(formData, key).length > 0;

const toPascal = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v])
  );

export const detailCamel = (overrides = {}) => ({
  id: "req-1",
  quantity: 10,
  stampTemplateID: "tpl-1",
  size: "3x3",
  isPrint: false,
  amount: 5000,
  note: "ghi chu",
  status: 0,
  requestedUsedStatus: 0,
  requestedDate: "2026-10-01T08:00:00",
  deliveryDate: null,
  fileUpload: "a.pdf;b.png",
  fileUploadUsed: "",
  reason: "",
  requestedUsedReason: "",
  partnerName: "",
  ...overrides,
});

export const detailPascal = (overrides = {}) =>
  toPascal(detailCamel(overrides));

export const detailWrapped = (detail) => ({ request: detail });

export const listStampOf = (codes) =>
  codes.map((c) => `https://x/?qr=${c}`).join(";");

export const printStampResponse = ({
  listStamp,
  quantity,
  template = { template: "https://img/tpl.png", size: "2x2" },
}) => ({ listStamp, template, quantity });

export const configResponse = ({ isConfirm = true } = {}) => ({
  isConfirm,
  attachmentStamps: "<p>Đơn xin cấp tem</p>",
  attachmentUsed: "<p>Hồ sơ cấp phép</p>",
});

export const flushPromises = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
};
