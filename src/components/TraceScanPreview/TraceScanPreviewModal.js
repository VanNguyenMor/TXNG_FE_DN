import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

/**
 * Preview nội dung rich-text theo khung gần với trang quét tem (mobile).
 * type: "company" | "product"
 */
const TraceScanPreviewModal = ({
  isOpen,
  toggle,
  type = "company",
  title,
  subtitle,
  logoUrl,
  html,
  contact = {},
}) => {
  const sectionTitle =
    type === "product" ? "GIỚI THIỆU SẢN PHẨM" : "GIỚI THIỆU";
  const headerTitle =
    type === "product" ? "XEM TRƯỚC TRANG QUÉT TEM — SẢN PHẨM" : "XEM TRƯỚC TRANG QUÉT TEM — DOANH NGHIỆP";

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>{headerTitle}</ModalHeader>
      <ModalBody
        style={{
          background: "#f3f4f6",
          display: "flex",
          justifyContent: "center",
          padding: "16px 12px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 390,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              background: "#f97316",
              color: "#fff",
              padding: "12px 16px",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: 14,
            }}
          >
            {type === "product" ? "Thông tin sản phẩm" : "Thông tin doanh nghiệp"}
          </div>

          <div style={{ padding: 16 }}>
            {logoUrl ? (
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img
                  src={logoUrl}
                  alt=""
                  style={{
                    maxWidth: 220,
                    maxHeight: 160,
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : null}

            {title ? (
              <h5
                style={{
                  textTransform: "uppercase",
                  color: "#ea580c",
                  marginBottom: 12,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {title}
              </h5>
            ) : null}

            {subtitle ? (
              <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>
                {subtitle}
              </p>
            ) : null}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                gap: 6,
              }}
            >
              <span style={{ color: "#a5c422", fontWeight: 700, fontSize: 15 }}>
                {sectionTitle}
              </span>
            </div>

            <div
              className="trace-scan-preview-html"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "#111827",
                wordBreak: "break-word",
                minHeight: 80,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  html && String(html).trim()
                    ? html
                    : "<p style='color:#9ca3af'><i>Chưa có nội dung giới thiệu</i></p>",
              }}
            />

            {type === "company" &&
            (contact.phone || contact.email || contact.taxCode || contact.address) ? (
              <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                <div style={{ color: "#a5c422", fontWeight: 700, marginBottom: 8 }}>
                  LIÊN HỆ
                </div>
                {contact.phone ? (
                  <div style={{ fontSize: 13, marginBottom: 4 }}>{contact.phone}</div>
                ) : null}
                {contact.taxCode ? (
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    MST: {contact.taxCode}
                  </div>
                ) : null}
                {contact.email ? (
                  <div style={{ fontSize: 13, marginBottom: 4 }}>{contact.email}</div>
                ) : null}
                {contact.address ? (
                  <div style={{ fontSize: 13 }}>{contact.address}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <small className="text-muted mr-auto">
          Khung ~390px (điện thoại). Chỉnh nội dung trong editor rồi xem lại trước khi
          khóa sản phẩm.
        </small>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
      <style>{`
        .trace-scan-preview-html img { max-width: 100% !important; height: auto !important; }
        .trace-scan-preview-html table { max-width: 100% !important; }
        .trace-scan-preview-html iframe { max-width: 100% !important; }
      `}</style>
    </Modal>
  );
};

export default TraceScanPreviewModal;
