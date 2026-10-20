import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import { Printd } from "printd";
import { loadPrintData } from "./services";
import { MAX_QR_PRINT, PRINT_BLOCK_SIZE, formatNumber } from "./utils";
import {
  PRINT_CSS,
  buildPrintHtml,
  buildPrintHtmlAsync,
} from "./printHtml";

const MODES = [
  { value: "list", label: "Danh sách mã tem" },
  { value: "qr", label: `Danh sách mã QR (tối đa ${formatNumber(MAX_QR_PRINT)} mã)` },
];

const PREVIEW_BLOCKS = 5;

class PrintStampModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState = () => ({
    step: "choose",
    mode: "list",
    data: null,
    printing: false,
    progress: null,
  });

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.loadSeq = (this.loadSeq || 0) + 1;
      this.setState(this.initialState());
    }
  }

  onAgree = async () => {
    const { requestId } = this.props;
    const { mode } = this.state;

    const seq = (this.loadSeq = (this.loadSeq || 0) + 1);
    this.setState({ step: "loading" });
    const res = await loadPrintData(requestId, mode);
    if (seq !== this.loadSeq || !this.props.isOpen) return;
    if (!res.ok) {
      toast.error(res.message);
      this.setState({ step: "choose" });
      return;
    }
    if (res.blocks && res.total > MAX_QR_PRINT) {
      toast.error(
        `Chỉ in được tối đa ${formatNumber(MAX_QR_PRINT)} mã QR mỗi lần. Vui lòng chọn in Danh sách mã tem.`
      );
      this.setState({ step: "choose" });
      return;
    }
    this.setState({ step: "preview", data: res });
  };

  onPrint = async () => {
    const { data } = this.state;
    this.setState({ printing: true, progress: null });

    try {
      const html = await buildPrintHtmlAsync(data, {
        onProgress: (done, total) => this.setState({ progress: { done, total } }),
      });

      const container = document.createElement("div");
      container.innerHTML = html;
      const base = document.createElement("base");
      new Printd({ headElements: [base] }).print(container, [PRINT_CSS]);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo bản in");
    } finally {
      this.setState({ printing: false, progress: null });
    }
  };

  renderChoose() {
    const { mode } = this.state;
    return (
      <div>
        {MODES.map((item) => (
          <div className="custom-control custom-radio mb-2" key={item.value}>
            <input
              className="custom-control-input"
              id={`printMode-${item.value}`}
              type="radio"
              name="printMode"
              value={item.value}
              checked={mode === item.value}
              onChange={() => this.setState({ mode: item.value })}
            />
            <label className="custom-control-label" htmlFor={`printMode-${item.value}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    );
  }

  renderPreview() {
    const { data, printing, progress } = this.state;
    const previewHtml = buildPrintHtml(data, { maxBlocks: PREVIEW_BLOCKS });
    const shown = data.blocks ? Math.min(PREVIEW_BLOCKS, data.blocks.length) : 0;
    const truncated = data.blocks && data.blocks.length > shown;

    return (
      <>
        <style>{PRINT_CSS}</style>
        {truncated ? (
          <p className="text-muted">
            Xem trước {Math.min(shown * PRINT_BLOCK_SIZE, data.total)} / {data.total} mã. Bản in có đủ {data.total} mã.
          </p>
        ) : null}
        {printing && progress ? (
          <p className="text-muted">
            Đang tạo bản in... {progress.done} / {progress.total}
          </p>
        ) : null}
        <div
          style={{ maxHeight: "60vh", overflow: "auto", background: "#fff" }}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </>
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { step, printing } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onClose} centered size={step === "preview" ? "xl" : "md"}>
        <ModalHeader toggle={onClose}>
          {step === "preview" ? "Bản xem trước in tem" : "Chọn hình thức in tem"}
        </ModalHeader>
        <ModalBody>
          {step === "loading" ? (
            <div className="text-center p-4">
              <Spinner />
            </div>
          ) : step === "preview" ? (
            this.renderPreview()
          ) : (
            this.renderChoose()
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose} disabled={printing}>
            Đóng
          </Button>
          {step === "preview" ? (
            <Button color="primary" onClick={this.onPrint} disabled={printing}>
              {printing ? "Đang tạo bản in..." : "In"}
            </Button>
          ) : (
            <Button color="primary" onClick={this.onAgree} disabled={step === "loading"}>
              Đồng ý
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

export default PrintStampModal;
