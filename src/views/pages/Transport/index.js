import React, { Component } from "react";
import moment from "moment";
import classes from "./index.module.css";
import { fetchData } from "helpers/fetchData";
import { TRANSPORT_ORDER, LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { getErrorMessageServer } from "utils/errorMessageServer.js";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import MenuButton from "../../../assets/img/buttons/menu.png";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { generateStyleTableCol } from "../../../bases/controls/helper";
import "../../../assets/css/global/index.css";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import ReactDatetime from "react-datetime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  Modal,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

class Transport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: null,
      status: null,
      message: "",
      headerTitle: TRANSPORT_ORDER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      totalPage: 0,
      // Mặc định lọc 30 ngày gần nhất (giống mobile)
      fromDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      toDate: new Date(),
      collapseList: [],
      // Xóa
      warningPopupModal: false,
      deleteId: null,
      // Khóa
      lockPopupModal: false,
      lockId: null,
      // Chi tiết
      detailModal: false,
      detail: null,
      detailFiles: [],
      detailImages: [],
      popupMessage: false,
      errNoti: "",
    };
  }

  componentWillMount() {
    this.fetchSummary();
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  // react-datetime trả về moment object khi hợp lệ, nhưng trả về CHUỖI khi
  // người dùng gõ tay dở dang/không hợp lệ -> chỉ nhận khi là moment hợp lệ,
  // xoá rỗng khi để trống; bỏ qua chuỗi không hợp lệ để tránh crash.
  onChangeDate = (field) => (value) => {
    if (!value) {
      this.setState({ [field]: "" });
      return;
    }
    if (moment.isMoment(value) && value.isValid()) {
      this.setState({ [field]: value.toDate() });
    }
  };

  // Định dạng an toàn cho payload: chấp nhận Date/moment/chuỗi DD-MM-YYYY.
  formatDateParam = (value) => {
    if (!value) return "";
    const m = moment.isMoment(value)
      ? value
      : moment(value, ["YYYY-MM-DD", "DD-MM-YYYY", moment.ISO_8601], true);
    const parsed = m.isValid() ? m : moment(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };

  buildPayload = () => {
    const { fromDate, toDate } = this.state;
    return {
      init: true,
      search: "",
      filter: "",
      orderBy: "",
      page: 0,
      limit: 1000,
      fromDate: this.formatDateParam(fromDate),
      toDate: this.formatDateParam(toDate),
    };
  };

  fetchSummary = () => {
    const { limit } = this.state;
    this.setState({ isLoaded: true });

    fetchData.transport.getList(this.buildPayload()).then((res) => {
      const transports = ((res || {}).data || {}).transports || [];
      const total = ((res || {}).data || {}).total || transports.length;

      const collapseList = [];
      transports.forEach((item, key) => {
        item["index"] = key + 1;
        collapseList.push({ id: item.id, collapse: false });
      });

      this.setState({
        data: transports,
        listLength: total,
        totalPage: Math.ceil(transports.length / limit),
        isLoaded: false,
        collapseList,
        status: (res || {}).status,
        message: PLEASE_CHECK_CONNECT((res || {}).message),
      });
    });
  };

  closeStatusModal = () => {
    const { status } = this.state;
    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null });
      }, LOADING_TIME);
    }
  };

  toggle = (val) => {
    let { collapseList } = this.state;
    collapseList
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));
    this.setState({ collapseList });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;
    this.state.data.map(
      (item, key) => key >= beginItem && key < endItem && total++
    );

    if (selected > 0) {
      total = selected * limit + total;
    }

    this.setState({
      beginItem,
      endItem,
      currentPage: selected + 1,
      totalElement: total,
    });
  };

  // ===== Xem chi tiết =====
  onOpenDetail = (id) => async () => {
    this.setState({ isLoaded: true });
    const detail = await fetchData.transport.getDetail(id);

    if (!detail) {
      this.setState({ isLoaded: false, errNoti: "Lấy thông tin chi tiết thất bại!" });
      this.toggleModal("popupMessage");
      return;
    }

    const detailFiles = detail.files ? String(detail.files).split(";").filter((x) => x) : [];
    const detailImages = detail.images ? String(detail.images).split(";").filter((x) => x) : [];

    this.setState({
      isLoaded: false,
      detail,
      detailFiles,
      detailImages,
      detailModal: true,
    });
  };

  // ===== Khóa (1 chiều) =====
  onAskLock = (item) => () => {
    if (item.isLocked) {
      this.setState({ errNoti: "Thông tin vận chuyển này đã khóa. Không thể mở khóa." });
      this.toggleModal("popupMessage");
      return;
    }
    this.setState({ lockId: item.id, lockPopupModal: true });
  };

  handleLock = () => {
    const { lockId } = this.state;
    this.setState({ lockPopupModal: false });

    fetchData.transport
      .lock(lockId)
      .then((res) => {
        if (res && res.status === 200) {
          toast.success("Khóa vận đơn thành công!");
          this.fetchSummary();
        } else {
          this.setState({ errNoti: getErrorMessageServer(res) || "Cập nhật trạng thái khóa thất bại" });
          this.toggleModal("popupMessage");
        }
      })
      .catch((err) => {
        this.setState({ errNoti: getErrorMessageServer(err) || "Cập nhật trạng thái khóa thất bại" });
        this.toggleModal("popupMessage");
      });
  };

  // ===== Xóa =====
  onAskDelete = (id) => () => {
    this.setState({ deleteId: id, warningPopupModal: true });
  };

  handleDeleteRow = () => {
    const { deleteId } = this.state;
    this.setState({ warningPopupModal: false });

    fetchData.transport
      .delete(deleteId)
      .then((res) => {
        if (res && res.status === 200) {
          toast.success("Xóa vận đơn thành công!");
          this.fetchSummary();
        } else {
          this.setState({ errNoti: getErrorMessageServer(res) || "Xóa vận đơn thất bại" });
          this.toggleModal("popupMessage");
        }
      })
      .catch((err) => {
        this.setState({ errNoti: getErrorMessageServer(err) || "Xóa vận đơn thất bại" });
        this.toggleModal("popupMessage");
      });
  };

  renderDetailModal = () => {
    const { detailModal, detail, detailFiles, detailImages } = this.state;
    if (!detail) return null;

    const Row_ = ({ label, value }) => (
      <div className={classes.detailRow}>
        <div className={classes.detailLabel}>{label}</div>
        <div className={classes.detailValue}>{value || "—"}</div>
      </div>
    );

    return (
      <Modal isOpen={detailModal} toggle={() => this.toggleModal("detailModal")} size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Thông tin vận đơn</h5>
          <button type="button" className="close" onClick={() => this.toggleModal("detailModal")}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className={classes.detailSection}>Thông tin vận chuyển</div>
          <Row_ label="Mã vận đơn" value={detail.transportCode} />
          <Row_ label="Mã phiếu xuất" value={detail.giCode} />
          {detail.isCompany ? (
            <Row_ label="Mã vận đơn tham chiếu" value={detail.refCode} />
          ) : (
            <Row_ label="Người vận chuyển" value={detail.transportedBy || detail.partnerName} />
          )}
          <Row_
            label="Ngày vận chuyển"
            value={detail.transportDate ? moment(detail.transportDate).format("DD/MM/YYYY HH:mm") : ""}
          />
          <Row_ label="Nơi đi" value={detail.addressFrom} />
          <Row_ label="Nơi đến" value={detail.addressTo} />
          <Row_ label="Ghi chú" value={detail.note} />

          {detail.isCompany && (
            <>
              <div className={classes.detailSection}>Đơn vị vận chuyển</div>
              <div className={classes.thumbWrap}>
                {detail.logo && <img className={classes.thumb} src={detail.logo} alt="logo" />}
                <Row_ label="Tên đơn vị" value={detail.partnerName} />
              </div>
            </>
          )}

          {detailImages.length > 0 && (
            <>
              <div className={classes.detailSection}>Phương tiện vận chuyển</div>
              <div className={classes.thumbWrap}>
                {detailImages.map((src, i) => (
                  <img key={i} className={classes.thumb} src={src} alt={`vehicle-${i}`} />
                ))}
              </div>
            </>
          )}

          {detailFiles.length > 0 && (
            <>
              <div className={classes.detailSection}>Chứng từ liên quan</div>
              {detailFiles.map((src, i) => (
                <a key={i} className={classes.fileLink} href={src} target="_blank" rel="noopener noreferrer">
                  {src.split("/").pop() || src}
                </a>
              ))}
            </>
          )}
        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => this.toggleModal("detailModal")}>
            Đóng
          </Button>
        </div>
      </Modal>
    );
  };

  render() {
    const {
      isLoaded,
      status,
      message,
      data,
      headerTitle,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      fromDate,
      toDate,
      collapseList,
      warningPopupModal,
      lockPopupModal,
      popupMessage,
      errNoti,
    } = this.state;
    const statusPopup = { status: status, message: message };

    // Phân quyền
    let isDisableEdit = true; // dùng cho "Khóa"
    let isDisableDelete = true;
    let isDisableView = true;
    if (JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      isDisableEdit = false;
      isDisableDelete = false;
      isDisableView = false;
    } else {
      const ACCOUNT_CLAIM_FF = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "Transports.View").map(() => (isDisableView = false));
      ACCOUNT_CLAIM_FF.filter((x) => x == "Transports.Edit").map(() => (isDisableEdit = false));
      ACCOUNT_CLAIM_FF.filter((x) => x == "Transports.Delete").map(() => (isDisableDelete = false));
    }

    return (
      <>
        <div className={classes.wrapper}>
          <Container fluid>
            {isLoaded ? (
              <div style={{ display: "table", margin: "auto" }}>
                <Spinner style={{ width: "3rem", height: "3rem" }} />
              </div>
            ) : (
              <Row>
                <div className="col">
                  <HeaderTable
                    dataReload={() => this.fetchSummary()}
                    hideCreate={true}
                    hideSearch={true}
                    handleSubmitSearchForm={() => this.fetchSummary()}
                    typeSearch={
                      <div className="div_flex" style={{ marginBottom: "10px", flexWrap: "wrap" }}>
                        <div className="mg-div-search">
                          <label className="form-control-label">Từ ngày</label>
                          <div>
                            <ReactDatetime
                              inputProps={{ placeholder: "dd/mm/yyyy" }}
                              value={fromDate || ""}
                              timeFormat={false}
                              dateFormat="DD-MM-YYYY"
                              onChange={this.onChangeDate("fromDate")}
                            />
                          </div>
                        </div>
                        <div className="mg-div-search">
                          <label className="form-control-label">Đến ngày</label>
                          <div>
                            <ReactDatetime
                              inputProps={{ placeholder: "dd/mm/yyyy" }}
                              value={toDate || ""}
                              timeFormat={false}
                              dateFormat="DD-MM-YYYY"
                              onChange={this.onChangeDate("toDate")}
                            />
                          </div>
                        </div>
                        <div className="mg-btn">
                          <label className="form-control-label">&nbsp;</label>
                          <Button
                            className="btn-warning-cs"
                            color="default"
                            type="button"
                            size="md"
                            onClick={() => this.fetchSummary()}
                          >
                            <img src={SearchImg} alt="Tìm kiếm" />
                            <span>Tìm kiếm</span>
                          </Button>
                        </div>
                      </div>
                    }
                  />

                  <Card className="shadow">
                    <Table className="align-items-center tablecs" responsive>
                      <HeadTitleTable
                        headerTitle={headerTitle}
                        classHeaderColumns={{ 0: "table-scale-col table-user-col-1" }}
                      />
                      <tbody ref={(ref) => (this.tableBody = ref)}>
                        {Array.isArray(data) &&
                          data
                            .filter((item, key) => key >= beginItem && key < endItem)
                            .map((item, key) => (
                              <tr
                                key={key}
                                style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}
                                className="table-hover-css"
                              >
                                <td className="table-scale-col table-user-col-1">{item.index}</td>
                                <td style={{ textAlign: "center" }}>
                                  <img className={classes.logo} src={item.logo || NoImg} alt="logo" />
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {item.transportedBy || item.partnerName}
                                </td>
                                <td style={{ textAlign: "left" }}>{item.transportCode}</td>
                                <td style={{ textAlign: "left" }}>{item.giCode}</td>
                                <td style={{ textAlign: "left" }}>{item.addressFrom}</td>
                                <td style={{ textAlign: "left" }}>{item.addressTo}</td>
                                <td style={{ textAlign: "left" }}>
                                  {item.transportDate
                                    ? moment(item.transportDate).format("HH:mm DD/MM/YYYY")
                                    : ""}
                                </td>
                                <td>
                                  {collapseList
                                    .filter((c) => c.id === item.id)
                                    .map((ele, k) => (
                                      <ButtonDropdown
                                        key={k}
                                        isOpen={ele.collapse}
                                        toggle={() => this.toggle(item.id)}
                                      >
                                        <DropdownToggle>
                                          <img src={MenuButton} alt="menu" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          {isDisableView == false && (
                                            <DropdownItem onClick={this.onOpenDetail(item.id)}>
                                              Xem chi tiết
                                            </DropdownItem>
                                          )}
                                          {isDisableEdit == false && (
                                            <DropdownItem onClick={this.onAskLock(item)}>
                                              {item.isLocked ? "Đã khóa" : "Khóa"}
                                            </DropdownItem>
                                          )}
                                          {isDisableDelete == false && !item.isLocked && (
                                            <>
                                              <DropdownItem divider />
                                              <DropdownItem onClick={this.onAskDelete(item.id)}>
                                                Xóa
                                              </DropdownItem>
                                            </>
                                          )}
                                        </DropdownMenu>
                                      </ButtonDropdown>
                                    ))}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </Table>
                  </Card>

                  {Array.isArray(data) && data.length > 0 && (
                    <Pagination
                      data={data}
                      listLength={listLength}
                      totalPage={totalPage}
                      totalElement={totalElement}
                      handlePageClick={this.handlePageClick}
                    />
                  )}
                </div>
              </Row>
            )}

            {this.renderDetailModal()}

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý xóa thông tin này?
                </p>
              }
              warningPopupModal={warningPopupModal}
              toggleModal={() => this.setState({ warningPopupModal: false })}
              handleWarning={this.handleDeleteRow}
            />

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn có chắc chắn muốn khóa thông tin này? Sau khi khóa sẽ không thể mở lại.
                </p>
              }
              warningPopupModal={lockPopupModal}
              toggleModal={() => this.setState({ lockPopupModal: false })}
              handleWarning={this.handleLock}
            />

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={errNoti}
              toggleModal={() => this.toggleModal("popupMessage")}
            />

            <ToastContainer position="top-center" autoClose={3000} />

            {setAlertContext(statusPopup)}
            {openAlertContext(statusPopup)}
          </Container>
        </div>
      </>
    );
  }
}

export default Transport;
