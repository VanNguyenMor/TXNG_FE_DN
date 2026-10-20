import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import QRCode from "qrcode.react";

export const PRINT_CSS = `
  @media print { @page { margin: 0; } }
  .stamp-print { padding: 4mm; color: #000; font-family: Arial, Helvetica, sans-serif; }
  .stamp-print * { box-sizing: border-box; }
  .stamp-print .sp-item-title { font-size: 40px; color: #e67e22; word-break: break-all; width: 100%; margin: 10px 0 20px 0; }
  .stamp-print .sp-item-image { display: block; width: auto; max-width: 300px; max-height: 200px; height: auto; margin-bottom: 20px; }
  .stamp-print .sp-item-link { font-size: 25px; color: #000; word-break: break-all; width: 100%; margin: 0 0 15px 0; }
  .stamp-print .sp-page-break { width: 100%; display: flex; align-items: center; flex-direction: row; flex-wrap: wrap; }
  .stamp-print .sp-page-item { width: 16mm; height: auto; margin: 2mm; display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center; }
  .stamp-print .sp-page-item-image { width: 16mm; height: 16mm; }
  .stamp-print .sp-page-item-image svg { width: 100%; height: 100%; display: block; }
  .stamp-print .sp-page-item-title { font-size: 1.5mm; color: #000; text-align: center; word-break: break-all; margin: 1mm 0 0 0; }
`;

export const escapeHtml = (value) =>
  String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const qrSvg = (value) =>
  renderToStaticMarkup(
    <QRCode value={value} size={256} level="H" renderAs="svg" />
  );

const renderHead = ({ template, title }) => {
  const image = template
    ? `<p class="sp-item-title">Mẫu tem</p><img class="sp-item-image" src="${escapeHtml(template)}" />`
    : "";
  return `${image}<p class="sp-item-title">${escapeHtml(title)}</p>`;
};

const renderBlock = (block) =>
  `<div class="sp-page-break">${block
    .map(
      (item) =>
        `<div class="sp-page-item"><div class="sp-page-item-image">${qrSvg(
          item.value
        )}</div><p class="sp-page-item-title">${escapeHtml(item.label)}</p></div>`
    )
    .join("")}</div>`;

const renderList = (lines) =>
  `<p class="sp-item-link">${lines.map(escapeHtml).join("<br/>")}</p>`;

export const buildPrintHtml = (data, { maxBlocks } = {}) => {
  const head = renderHead(data);
  if (data.blocks) {
    const blocks = maxBlocks ? data.blocks.slice(0, maxBlocks) : data.blocks;
    return `<div class="stamp-print">${head}<div>${blocks.map(renderBlock).join("")}</div></div>`;
  }
  return `<div class="stamp-print">${head}${renderList(data.lines || [])}</div>`;
};

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

export const buildPrintHtmlAsync = async (data, { onProgress, chunk = 20 } = {}) => {
  if (!data.blocks) return buildPrintHtml(data);

  const parts = [];
  for (let i = 0; i < data.blocks.length; i++) {
    parts.push(renderBlock(data.blocks[i]));
    if ((i + 1) % chunk === 0) {
      onProgress && onProgress(i + 1, data.blocks.length);
      await tick();
    }
  }
  onProgress && onProgress(data.blocks.length, data.blocks.length);
  return `<div class="stamp-print">${renderHead(data)}<div>${parts.join("")}</div></div>`;
};
