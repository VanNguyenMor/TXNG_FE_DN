import { buildPrintHtml, buildPrintHtmlAsync, escapeHtml } from "./printHtml";
import { buildPrintQR, buildPrintList } from "./utils";
import { listStampOf } from "./__fixtures__/stampRequest";

const count = (text, pattern) => (text.match(pattern) || []).length;

describe("buildPrintHtml", () => {
  const codes = Array.from({ length: 25 }, (_, i) => `C${i}`);
  const qr = {
    template: "https://img/tpl.png",
    ...buildPrintQR({ listStamp: listStampOf(codes), quantity: 25 }),
  };

  test("in QR: 25 mã thì có 25 ảnh QR chia 3 khối, nhãn là phần sau '/?qr='", () => {
    const html = buildPrintHtml(qr);
    expect(count(html, /<svg/g)).toBe(25);
    expect(count(html, /class="sp-page-break"/g)).toBe(3);
    expect(html).toContain(">C0</p>");
    expect(html).toContain(">C24</p>");
    expect(html).not.toContain("https://x/?qr=C0</p>");
  });

  test("có ảnh mẫu tem và tiêu đề 'Danh sách mã tem' (app ghi nhầm 'mẫu tem')", () => {
    const html = buildPrintHtml(qr);
    expect(html).toContain('src="https://img/tpl.png"');
    expect(html).toContain("Danh sách mã tem. Số lượng: 25");
    expect(html).not.toContain("mẫu tem. Số lượng");
  });

  test("giá trị QR là nguyên chuỗi mã (khác nhau giữa các QR)", () => {
    const html = buildPrintHtml({ ...qr, blocks: [qr.blocks[0].slice(0, 2)] });
    const svgs = html.match(/<svg[\s\S]*?<\/svg>/g);
    expect(svgs).toHaveLength(2);
    expect(svgs[0]).not.toBe(svgs[1]);
  });

  test("xem trước chỉ dựng số khối đầu", () => {
    const html = buildPrintHtml(qr, { maxBlocks: 1 });
    expect(count(html, /<svg/g)).toBe(10);
  });

  test("không có mẫu tem thì không in ảnh mẫu", () => {
    const html = buildPrintHtml({ ...qr, template: "" });
    expect(html).not.toContain("<img");
  });

  test("in danh sách mã tem: mỗi mã một dòng, không dòng trống", () => {
    const list = {
      template: "https://img/tpl.png",
      ...buildPrintList({ listStamp: "A;B;;C", quantity: 3 }),
    };
    const html = buildPrintHtml(list);
    expect(html).toContain("Danh sách mã tem. Số lượng: 3");
    expect(html).toContain("A<br/>B<br/>C");
    expect(html).not.toContain("<br/><br/>");
    expect(count(html, /<svg/g)).toBe(0);
  });

  test("thoát ký tự HTML trong mã và địa chỉ ảnh", () => {
    expect(escapeHtml('<a href="x">&')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;");
    const html = buildPrintHtml({
      ...buildPrintList({ listStamp: "<b>x</b>", quantity: 1 }),
      template: 'a" onerror="x',
    });
    expect(html).not.toContain("<b>x</b>");
    expect(html).not.toContain('onerror="x"');
  });
});

describe("buildPrintHtmlAsync", () => {
  test("cho kết quả giống bản đồng bộ và báo tiến độ", async () => {
    const codes = Array.from({ length: 45 }, (_, i) => `C${i}`);
    const data = {
      template: "",
      ...buildPrintQR({ listStamp: listStampOf(codes), quantity: 45 }),
    };
    const progress = [];
    const html = await buildPrintHtmlAsync(data, {
      chunk: 2,
      onProgress: (done, total) => progress.push([done, total]),
    });
    expect(html).toBe(buildPrintHtml(data));
    expect(progress[progress.length - 1]).toEqual([5, 5]);
  });
});
