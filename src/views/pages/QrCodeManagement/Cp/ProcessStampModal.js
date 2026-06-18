import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Card,
  Spinner,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
} from "reactstrap";
import moment from "moment";
import ReactDatetime from "react-datetime";
import { toast } from "react-toastify";

import { fetchData } from "helpers/fetchData";
import AddNewQRList from "../AddNewQRList";
import WarningPopup from "components/WarningPopup";

// Trạng thái yêu cầu hủy tem - khớp BAD_STAMP_STATUSES trên app mobile
const BAD_STAMP_STATUS = {
  new: 0,
  verified: 1,
  notVerified: 2,
};

const STATUS_TEXT = {
  [BAD_STAMP_STATUS.new]: "Đang tạo",
  [BAD_STAMP_STATUS.verified]: "Duyệt hủy",
  [BAD_STAMP_STATUS.notVerified]: "Không duyệt",
};

const STATUS_BADGE = {
  [BAD_STAMP_STATUS.new]: "badge-primary",
  [BAD_STAMP_STATUS.verified]: "badge-success",
  [BAD_STAMP_STATUS.notVerified]: "badge-danger",
};

// screen: 'list' | 'create' | 'detail'
class ProcessStampModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: "list",
      badList: [],
      isLoading: false,
      // Mặc định lọc theo hôm nay - giống app mobile
      fromDate: moment(),
      toDate: moment(),
      // create form
      formData: {},
      // detail
      detailLoading: false,
      detailBadStamp: null,
      detailStampRequest: null,
      // delete confirm
      deleteConfirmOpen: false,
      deleteId: null,
    };
  }

  componentDidMount() {
    if (this.props.isOpen && this.props.stampRequest) {
      this.fetchBadList();
    }
  }

  componentDidUpdate(prevProps) {
    // Mở modal cho một dải tem mới -> reset về danh sách và tải lại
    const opened = !prevProps.isOpen && this.props.isOpen;
    const changedItem =
      this.props.stampRequest &&
      prevProps.stampRequest &&
      this.props.stampRequest.id !== prevProps.stampRequest.id;

    if ((opened || changedItem) && this.props.stampRequest) {
      this.setState(
        {
          screen: "list",
          fromDate: moment(),
          toDate: moment(),
          formData: {},
          detailBadStamp: null,
          detailStampRequest: null,
        },
        () => this.fetchBadList()
      );
    }
  }

  get stampRequestId() {
    return this.props.stampRequest ? this.props.stampRequest.id : null;
  }

  formatDate = (value) => {
    if (!value) return "";
    const m = moment.isMoment(value) ? value : moment(value, "DD-MM-YYYY");
    return m.isValid() ? m.format("YYYY-MM-DD") : "";
  };

  fetchBadList = async () => {
    const id = this.stampRequestId;
    if (!id) return;

    this.setState({ isLoading: true });
    try {
      const result = await fetchData.qrCodeManagement.getListManageQRBad(
        id,
        this.formatDate(this.state.fromDate),
        this.formatDate(this.state.toDate)
      );
      const badList = Array.isArray(result?.qrCodes) ? result.qrCodes : [];
      this.setState({ badList, isLoading: false });
    } catch (error) {
      console.error("Fetch bad stamp list error:", error);
      this.setState({ badList: [], isLoading: false });
      toast.error("Lỗi khi lấy danh sách yêu cầu hủy tem!");
    }
  };

  onChangeDate = (name) => (value) => {
    this.setState({ [name]: value }, () => this.fetchBadList());
  };

  // ----- Tạo yêu cầu hủy -----
  onOpenCreate = () => {
    this.setState({ screen: "create", formData: {} });
  };

  onChangeForm = (data) => {
    this.setState({ formData: data });
  };

  onSubmitCreate = async () => {
    const f = this.state.formData || {};

    if (!f.reasonVal) {
      toast.error("Vui lòng nhập lý do hủy");
      return;
    }
    if (!f.stampRequestId) {
      toast.error("Vui lòng chọn dải tem");
      return;
    }
    if (!f.fromVal || !f.toVal) {
      toast.error("Vui lòng nhập số tem từ và đến");
      return;
    }
    if (!f.badStamps || f.badStamps.length === 0) {
      toast.error("Vui lòng thêm dải mã QR");
      return;
    }

    const formData = new FormData();
    // Tên field khớp BadStampJs trên backend (ReasonCancel chứ không phải ReasonVal)
    formData.append("ReasonCancel", f.reasonVal);
    formData.append("StampRequestId", f.stampRequestId);
    formData.append("StartNum", f.fromVal);
    formData.append("EndNum", f.toVal);
    if (f.files && f.files.length > 0) {
      for (let i = 0; i < f.files.length; i++) {
        formData.append("Files", f.files[i]);
      }
    }

    this.setState({ isLoading: true });
    const result = await fetchData.qrCodeManagement.addBadStamp(formData);
    this.setState({ isLoading: false });

    if (result && result.status === 200) {
      toast.success("Tạo yêu cầu hủy tem thành công");
      this.setState({ screen: "list", formData: {} }, () => this.fetchBadList());
      if (this.props.onChanged) this.props.onChanged();
    } else {
      toast.error(result?.message || "Tạo yêu cầu hủy tem thất bại");
    }
  };

  // ----- Chi tiết + Duyệt / Không duyệt -----
  onOpenDetail = async (item) => {
    this.setState({ screen: "detail", detailLoading: true, detailBadStamp: null });
    try {
      const result = await fetchData.qrCodeManagement.getDetailBadStamp(item.id);
      this.setState({
        detailBadStamp: result?.badStamp || null,
        detailStampRequest: result?.stampRequest || null,
        detailLoading: false,
      });
      if (!result?.badStamp) {
        toast.error("Lịch sử hủy tem này không tồn tại");
      }
    } catch (error) {
      console.error("Get detail bad stamp error:", error);
      this.setState({ detailLoading: false });
      toast.error("Lỗi khi tải chi tiết yêu cầu hủy tem!");
    }
  };

  onConfirmBadStamp = async () => {
    const bad = this.state.detailBadStamp;
    if (!bad || !bad.id) return;

    this.setState({ detailLoading: true });
    const result = await fetchData.qrCodeManagement.confirmBadStamp(bad.id);
    this.setState({ detailLoading: false });

    if (result && result.status === 200) {
      toast.success("Duyệt hủy tem thành công");
      this.setState({ screen: "list" }, () => this.fetchBadList());
      if (this.props.onChanged) this.props.onChanged();
    } else {
      toast.error(result?.message || "Duyệt hủy tem thất bại");
    }
  };

  onUnConfirmBadStamp = async () => {
    const bad = this.state.detailBadStamp;
    if (!bad || !bad.id) return;

    this.setState({ detailLoading: true });
    const result = await fetchData.qrCodeManagement.unConfirmBadStamp(bad.id);
    this.setState({ detailLoading: false });

    if (result && result.status === 200) {
      toast.success("Không duyệt hủy tem thành công");
      this.setState({ screen: "list" }, () => this.fetchBadList());
      if (this.props.onChanged) this.props.onChanged();
    } else {
      toast.error(result?.message || "Không duyệt hủy tem thất bại");
    }
  };

  // ----- Xóa -----
  onAskDelete = (id) => {
    this.setState({ deleteConfirmOpen: true, deleteId: id });
  };

  toggleDeleteConfirm = () => {
    this.setState((prev) => ({ deleteConfirmOpen: !prev.deleteConfirmOpen }));
  };

  onConfirmDelete = async () => {
    const id = this.state.deleteId;
    if (!id) return;

    this.setState({ isLoading: true });
    const result = await fetchData.qrCodeManagement.deleteManageQRBad(id);
    this.setState({ isLoading: false, deleteId: null });

    if (result && result.status === 200) {
      toast.success("Xóa yêu cầu hủy tem thành công");
      this.fetchBadList();
      if (this.props.onChanged) this.props.onChanged();
    } else {
      toast.error(result?.message || "Xóa yêu cầu hủy tem thất bại");
    }
  };

  renderStatusBadge = (status) => (
    <span className={`badge ${STATUS_BADGE[status] || "badge-warning"}`}>
      {STATUS_TEXT[status] || "Chưa xác định"}
    </span>
  );

  renderDateFilter = () => {
    const { fromDate, toDate } = this.state;
    return (
      <div
        className="div_flex"
        style={{ gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}
      >
        <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label className="form-control-label">Từ ngày</label>
          <InputGroup className="input-group-alternative css-border-input">
            <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
              <InputGroupText>
                <i className="ni ni-calendar-grid-58" />
              </InputGroupText>
            </InputGroupAddon>
            <ReactDatetime
              inputProps={{ placeholder: "Từ ngày" }}
              value={fromDate}
              timeFormat={false}
              dateFormat="DD-MM-YYYY"
              onChange={this.onChangeDate("fromDate")}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label className="form-control-label">Đến ngày</label>
          <InputGroup className="input-group-alternative css-border-input">
            <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
              <InputGroupText>
                <i className="ni ni-calendar-grid-58" />
              </InputGroupText>
            </InputGroupAddon>
            <ReactDatetime
              inputProps={{ placeholder: "Đến ngày" }}
              value={toDate}
              timeFormat={false}
              dateFormat="DD-MM-YYYY"
              onChange={this.onChangeDate("toDate")}
            />
          </InputGroup>
        </FormGroup>
      </div>
    );
  };

  // Header thông tin dải tem được chọn - giống "Thông tin xử lý dải tem" trên mobile
  renderStampInfoHeader = () => {
    const sr = this.props.stampRequest || {};
    const registeredDate =
      sr.approvalDate || sr.confirmedDate || sr.createdDate || "";
    const dateConvert = registeredDate
      ? moment(registeredDate, [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          moment.ISO_8601,
        ]).format("DD/MM/YYYY")
      : "";
    const temList =
      sr.temList ||
      (sr.startNum && sr.endNum ? `${sr.startNum} - ${sr.endNum}` : "");

    return (
      <Card
        className="shadow-sm"
        style={{ padding: "12px 16px", marginBottom: "12px" }}
      >
        <h5 className="mb-1">Thông tin xử lý dải tem</h5>
        <div>
          Ngày ĐK: <b>{dateConvert}</b> &nbsp;|&nbsp; SL:{" "}
          <b>{sr.quantity || 0}</b>
        </div>
        <div>
          Dải tem: <b>{temList}</b>
        </div>
      </Card>
    );
  };

  renderList = () => {
    const { badList, isLoading } = this.state;

    return (
      <>
        {this.renderStampInfoHeader()}

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginBottom: "10px" }}
        >
          <h4 className="mb-0">Danh sách yêu cầu hủy tem</h4>
          <Button color="primary" size="sm" onClick={this.onOpenCreate}>
            + Tạo yêu cầu hủy
          </Button>
        </div>

        {this.renderDateFilter()}

        {isLoading ? (
          <div className="text-center py-3">
            <Spinner color="primary" />
          </div>
        ) : (
          <Card className="shadow">
            <Table className="align-items-center tablecs" responsive>
              <thead className="thead-light">
                <tr>
                  <th>STT</th>
                  <th>Thông tin</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {badList.length > 0 ? (
                  badList.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{idx + 1}</td>
                      <td
                        style={{ textAlign: "left", cursor: "pointer" }}
                        onClick={() => this.onOpenDetail(item)}
                      >
                        <span className="font-weight-bold">Hủy tem</span>
                        <br />
                        <span>
                          Thời gian:{" "}
                          {item.createdDate
                            ? moment(item.createdDate).format("DD/MM/YYYY HH:mm")
                            : ""}
                        </span>
                        <br />
                        <span>Lý do hủy: {item.reasonCancel || ""}</span>
                        <br />
                        <span>
                          Dải tem hủy: {item.startRange || item.startNum} -{" "}
                          {item.endRange || item.endNum}
                        </span>
                      </td>
                      <td className="text-center">{item.quantity || 0}</td>
                      <td className="text-center">
                        {this.renderStatusBadge(item.status)}
                      </td>
                      <td className="text-center">
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => this.onOpenDetail(item)}
                        >
                          Chi tiết
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => this.onAskDelete(item.id)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-3">
                      Chưa có yêu cầu hủy tem
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </>
    );
  };

  renderCreate = () => {
    return (
      <AddNewQRList
        id={null}
        onHandleChangeValue={this.onChangeForm}
        errorInsert={{}}
        data={this.state.formData}
        TEMLIST_OPTIONS={this.props.TEMLIST_OPTIONS}
      />
    );
  };

  renderDetail = () => {
    const { detailLoading, detailBadStamp, detailStampRequest } = this.state;

    if (detailLoading) {
      return (
        <div className="text-center py-3">
          <Spinner color="primary" />
        </div>
      );
    }

    if (!detailBadStamp) {
      return (
        <p className="text-center text-muted py-3">
          Không có thông tin chi tiết
        </p>
      );
    }

    const range = `${detailBadStamp.startNum || ""} - ${
      detailBadStamp.endNum || ""
    }`;
    const allowedRange = detailStampRequest
      ? `${detailStampRequest.startNum || ""} - ${
          detailStampRequest.endNum || ""
        }`
      : "";

    return (
      <div className="css-system-stamp">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Chi tiết yêu cầu hủy tem</h4>
          {this.renderStatusBadge(detailBadStamp.status)}
        </div>
        <p>
          <b>Lý do hủy:</b> {detailBadStamp.reasonCancel || ""}
        </p>
        <p>
          <b>Số lượng:</b> {detailBadStamp.quantity || 0}
        </p>
        <p>
          <b>Dải tem hủy:</b> {range}
        </p>
        {allowedRange && (
          <p>
            <b>Dải tem gốc:</b> {allowedRange}
          </p>
        )}
        <p>
          <b>Ngày tạo:</b>{" "}
          {detailBadStamp.createdDate
            ? moment(detailBadStamp.createdDate).format("DD/MM/YYYY HH:mm")
            : ""}
        </p>
      </div>
    );
  };

  renderFooter = () => {
    const { screen, detailBadStamp } = this.state;

    if (screen === "create") {
      return (
        <>
          <Button color="primary" onClick={this.onSubmitCreate}>
            Cập nhật
          </Button>
          <Button
            color="secondary"
            onClick={() => this.setState({ screen: "list" })}
          >
            Quay lại
          </Button>
        </>
      );
    }

    if (screen === "detail") {
      const isNew =
        detailBadStamp && detailBadStamp.status === BAD_STAMP_STATUS.new;
      return (
        <>
          {isNew && (
            <>
              <Button color="danger" onClick={this.onUnConfirmBadStamp}>
                Không duyệt
              </Button>
              <Button color="success" onClick={this.onConfirmBadStamp}>
                Duyệt
              </Button>
            </>
          )}
          <Button
            color="secondary"
            onClick={() => this.setState({ screen: "list" })}
          >
            Quay lại
          </Button>
        </>
      );
    }

    return (
      <Button color="secondary" onClick={this.props.onClose}>
        Đóng
      </Button>
    );
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { screen, deleteConfirmOpen } = this.state;

    const title =
      screen === "create"
        ? "Tạo yêu cầu hủy tem"
        : screen === "detail"
        ? "Chi tiết yêu cầu hủy tem"
        : "Xử lý tem";

    return (
      <Modal
        isOpen={isOpen}
        toggle={onClose}
        size="lg"
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={onClose}>{title}</ModalHeader>
        <ModalBody>
          {screen === "list" && this.renderList()}
          {screen === "create" && this.renderCreate()}
          {screen === "detail" && this.renderDetail()}

          <WarningPopup
            moduleTitle="Thông báo"
            moduleBody={
              <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                Bạn đồng ý xóa yêu cầu hủy tem này?
              </p>
            }
            warningPopupModal={deleteConfirmOpen}
            toggleModal={this.toggleDeleteConfirm}
            handleWarning={this.onConfirmDelete}
          />
        </ModalBody>
        <ModalFooter>{this.renderFooter()}</ModalFooter>
      </Modal>
    );
  }
}

export default ProcessStampModal;
