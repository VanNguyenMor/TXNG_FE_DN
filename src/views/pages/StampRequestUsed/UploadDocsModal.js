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
import { loadDetail, submitUpload } from "./services";
import { splitFileNames, formatNumber } from "./utils";

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.bmp,.webp";

const displayName = (name) =>
  name.startsWith("http") ? name.split("/").pop() : name;

class UploadDocsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submitting: false,
      keptNames: [],
      newFiles: [],
      amount: 0,
    };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    if (this.props.isOpen) this.loadInitial();
  }

  componentDidUpdate(prevProps) {
    const { isOpen, requestId } = this.props;
    if (isOpen && (!prevProps.isOpen || requestId !== prevProps.requestId)) {
      this.loadInitial();
    }
  }

  loadInitial = async () => {
    const { requestId, config, onClose } = this.props;
    const seq = (this.loadSeq = (this.loadSeq || 0) + 1);
    this.setState({ loading: true, keptNames: [], newFiles: [], amount: 0 });

    const res = await loadDetail(requestId);
    if (seq !== this.loadSeq || !this.props.isOpen) return;
    if (!res.ok) {
      toast.error(res.message);
      this.setState({ loading: false });
      onClose && onClose();
      return;
    }

    const keptNames = config.keepOldFiles
      ? splitFileNames(res.detail[config.oldFilesField])
      : [];
    this.setState({
      loading: false,
      keptNames,
      amount: Number(res.detail.amount) || 0,
    });
  };

  onChooseFiles = (event) => {
    const chosen = Array.from(event.target.files || []);
    if (chosen.length > 0) {
      this.setState((prev) => ({ newFiles: [...prev.newFiles, ...chosen] }));
    }
    event.target.value = "";
  };

  removeKept = (index) => () => {
    this.setState((prev) => ({
      keptNames: prev.keptNames.filter((_, i) => i !== index),
    }));
  };

  removeNew = (index) => () => {
    this.setState((prev) => ({
      newFiles: prev.newFiles.filter((_, i) => i !== index),
    }));
  };

  onSubmit = async () => {
    const { requestId, config, onSuccess } = this.props;
    const { newFiles, keptNames } = this.state;

    this.setState({ submitting: true });
    const res = await submitUpload({ config, id: requestId, newFiles, keptNames });
    this.setState({ submitting: false });

    if (res.ok) {
      toast.success(res.message);
      onSuccess && onSuccess();
    } else {
      toast.error(res.message);
    }
  };

  renderKept = (name, index) => (
    <li key={`kept-${index}`} className="d-flex align-items-center mb-1">
      {name.startsWith("http") ? (
        <a href={name} target="_blank" rel="noopener noreferrer">
          {displayName(name)}
        </a>
      ) : (
        <span>{displayName(name)}</span>
      )}
      <Button
        type="button"
        size="sm"
        color="link"
        className="text-danger ml-2 p-0"
        onClick={this.removeKept(index)}
      >
        Xoá
      </Button>
    </li>
  );

  renderNew = (file, index) => (
    <li key={`new-${index}`} className="d-flex align-items-center mb-1">
      <span>{file.name}</span>
      <Button
        type="button"
        size="sm"
        color="link"
        className="text-danger ml-2 p-0"
        onClick={this.removeNew(index)}
      >
        Xoá
      </Button>
    </li>
  );

  render() {
    const { isOpen, config, instructionHtml, onClose } = this.props;
    const { loading, submitting, keptNames, newFiles, amount } = this.state;

    if (!config) return null;

    return (
      <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
        <ModalHeader toggle={onClose}>{config.title}</ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="text-center p-4">
              <Spinner />
            </div>
          ) : (
            <>
              {config.showAmount ? (
                <p>
                  Số tiền phải thanh toán:{" "}
                  <b>{formatNumber(amount)} đ</b>
                </p>
              ) : null}

              <p className="font-weight-bold mb-1">Chứng từ liên quan:</p>
              <div
                className="mb-3"
                dangerouslySetInnerHTML={{ __html: instructionHtml || "" }}
              />

              <div className="mb-2">
                <Button
                  type="button"
                  color="primary"
                  size="sm"
                  onClick={() => this.fileInput.current && this.fileInput.current.click()}
                >
                  Chọn tệp
                </Button>
                <input
                  ref={this.fileInput}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  style={{ display: "none" }}
                  onChange={this.onChooseFiles}
                />
              </div>

              {keptNames.length + newFiles.length === 0 ? (
                <p className="text-muted mb-0">Chưa chọn tệp nào.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {keptNames.map(this.renderKept)}
                  {newFiles.map(this.renderNew)}
                </ul>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose} disabled={submitting}>
            Đóng
          </Button>
          <Button color="primary" onClick={this.onSubmit} disabled={loading || submitting}>
            {submitting ? "Đang gửi..." : "Cập nhật"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default UploadDocsModal;
