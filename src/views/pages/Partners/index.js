import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { actionPartner } from "../../../actions/PartnerActions";
import {
  PARTNER_DOI_TAC,
  PARTNER_TYPES,
  LIMIT_ITEM_IN_PAGE,
  LOADING_TIME,
} from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { fetchData } from "../../../helpers/fetchData";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from "./index.module.css";
import "../Partner/partner.css";
import SearchModal from "./SearchModal";
import WarningPopupDel from "../../../components/WarningPopupDel";
import UpdateModal from "./UpdateModal";
import AddNewModal from "./AddNewModal";
import UpdatePopup from "../../../components/UpdatePopup";
import CreateNewPopup from "../../../components/CreateNewPopup";
import PopupMessage from "../../../components/PopupMessage";
import { generateStyleTableCol } from "../../../bases/controls/helper";
import "../../../assets/css/global/index.css";
import "../../../assets/css/page/user.css";
import MenuButton from "../../../assets/img/buttons/menu.png";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const FILE_KEYS_AS_URL = [
  "BusinessLicenses",
  "Certification",
  "Images",
  "License",
];

class Partners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nations: [],
      companyId: "",
      currentTab: 0, // partnerType đang chọn
      detail: null,
      isLoaded: null,
      status: null,
      message: "",
      editId: null,
      currentRow: null,
      deleteItem: null,
      errNoti: "",
      popupMessage: false,
      warningPopupDelModal: false,
      updateModal: false,
      createNewModal: false,
      activeCreateSubmit: false,
      newData: [],
      newDataUpdate: [],
      errorInsert: {},
      errorUpdate: {},
      filter: {
        companyName: "",
        phone: "",
        taxCode: "",
        email: "",
      },
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      totalPage: 0,
      currentPage: 0,
    };
  }

  async componentWillMount() {
    this.fetchSummary();
  }

  async componentDidMount() {
    // Danh sách quốc gia + companyId (cho tra cứu LACO)
    try {
      const nations = await fetchData.productManagement.getListNationComboBox();
      this.setState({ nations: nations || [] });
    } catch (e) {
      this.setState({ nations: [] });
    }
    try {
      const resCompany = await fetchData.account.getCurrentCompany();
      const id = ((resCompany || {}).company || {}).id || "";
      this.setState({ companyId: id });
    } catch (e) {
      /* ignore */
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.partner;
    const { limit } = this.state;
    if (data !== this.state.data) {
      if (typeof data !== "undefined") {
        if (typeof data.list !== "undefined") {
          if (data.list !== null) {
            if (typeof data.list.partners !== "undefined") {
              data.list.partners.map((item, key) => {
                item["index"] = key + 1;
                item["collapse"] = false;
                item["thumbnail"] = (
                  <img
                    src={item.logo ? item.logo : NoImg}
                    style={{ width: 60, height: 60 }}
                  />
                );
              });

              this.setState({
                data: data.list.partners,
                listLength: data.list.total,
                totalPage: Math.ceil(data.list.total / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message),
              });
            }
          }
        }
      }
    }
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  buildFilter = () => {
    const { filter, currentTab } = this.state;
    return JSON.stringify({
      partnerType: currentTab,
      companyName: filter.companyName || "",
      phone: filter.phone || "",
      taxCode: filter.taxCode || "",
      email: filter.email || "",
      orderBy: "",
      page: null,
      limit: null,
    });
  };

  fetchSummary = () => {
    const { requestListPartner } = this.props;
    requestListPartner(this.buildFilter());
  };

  onChooseTab = (tabId) => () => {
    if (this.state.currentTab === tabId) return;
    this.setState(
      {
        currentTab: tabId,
        beginItem: 0,
        endItem: this.state.limit,
        currentPage: 0,
        data: [],
      },
      this.fetchSummary
    );
  };

  closeStatusModal = () => {
    const { status } = this.state;
    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        errorInsert: {},
        currentRow: null,
      });
    }
  };

  handleNewData = (data) => this.setState({ newData: data });
  handleNewDataUpdate = (data) => this.setState({ newDataUpdate: data });
  handleCheckValidation = (status) =>
    this.setState({ activeCreateSubmit: status });

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;
    filter[ev["name"]] = ev["value"];
    this.setState({ filter });
  };

  handleSubmitSearchForm = () => {
    this.setState({ beginItem: 0, endItem: this.state.limit, currentPage: 0 });
    this.fetchSummary();
  };

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;
    this.state.data.map((item, key) => key >= beginItem && key < endItem && total++);

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

  // Build FormData từ object form
  buildFormData = (value, isUpdate) => {
    const bodyFormData = new FormData();
    const append = (k, v) =>
      bodyFormData.append(k, v === null || typeof v === "undefined" ? "" : v);

    if (isUpdate) append("ID", value.ID || "");
    append("PartnerType", value.PartnerType);
    append("PartnerName", value.PartnerName || "");
    append("TaxCode", value.TaxCode || "");
    append("NationID", value.NationID || "");
    append("Address", value.Address || "");
    append("PhoneNumber", value.PhoneNumber || "");
    append("Fax", value.Fax || "");
    append("Email", value.Email || "");
    append("Website", value.Website || "");
    append("ContactName", value.ContactName || "");
    append("ContactPhone", value.ContactPhone || "");
    append("ContactEmail", value.ContactEmail || "");
    append("Location", value.Location || "");
    append("PlantingZoneName", value.PlantingZoneName || "");
    // Area/AreaUnit là số - chỉ gửi khi có giá trị để tránh lỗi parse phía backend
    if (value.Area !== "" && value.Area !== null && typeof value.Area !== "undefined") {
      bodyFormData.append("Area", value.Area);
    }
    if (
      value.AreaUnit !== "" &&
      value.AreaUnit !== null &&
      typeof value.AreaUnit !== "undefined"
    ) {
      bodyFormData.append("AreaUnit", value.AreaUnit);
    }
    append("IsBelongTo", value.IsBelongTo ? true : false);
    append("IsLaco", value.IsLaco ? true : false);
    append("LacoId", value.LacoId || "");

    FILE_KEYS_AS_URL.forEach((k) => append(k, value[k] || ""));

    // Logo: nếu có file mới -> gửi LogoFile + Logo='', ngược lại giữ Logo cũ
    append("Logo", value.LogoFile ? "" : value.Logo || "");
    if (value.LogoFile) {
      bodyFormData.append("LogoFile", value.LogoFile);
    }

    return bodyFormData;
  };

  renderCreateModal = () => {
    return (
      <AddNewModal
        partnerType={this.state.currentTab}
        nations={this.state.nations}
        companyId={this.state.companyId}
        requestListPartnerLACO={this.props.requestListPartnerLACO}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
        errorInsert={this.state.errorInsert}
      />
    );
  };

  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { requestCreatePartner } = this.props;
    const { data } = this.state;
    const errorInsert = {};

    if (!value.PartnerName) {
      errorInsert["PartnerName"] = "Tên đối tác không được bỏ trống";
    }
    if ((value.PartnerName || "").length > 255) {
      errorInsert["PartnerName"] = "Tên đối tác nhập tối đa 255 ký tự";
    }
    if (value.PartnerName) {
      let flag = false;
      (data || [])
        .filter(
          (item) =>
            (item.partnerName || "").trim().toUpperCase() ===
            value.PartnerName.trim().toUpperCase()
        )
        .map(() => (flag = true));
      if (flag) errorInsert["PartnerName"] = "Tên đối tác này đã có";
    }

    if (Object.keys(errorInsert).length > 0) {
      this.setState({ errorInsert });
      return;
    }
    this.setState({ errorInsert: {} });

    if (closeForm) closeForm();

    const bodyFormData = this.buildFormData(value, false);

    requestCreatePartner(bodyFormData).then((res) => {
      if (res.data && res.data.status == 200) {
        if (closePopup != "closePopup") {
          this.toggleModal("createNewModal");
        }
        toast.success("Thêm đối tác thành công!");
        this.fetchSummary();
      } else {
        this.setState({ errNoti: (res.data || {}).message });
        this.toggleModal("popupMessage");
      }
    });
  };

  handleUpdateInfoData = (value) => {
    const { requestUpdatePartner } = this.props;
    const { data, newDataUpdate, currentRow } = this.state;
    const errorUpdate = {};
    const _value = newDataUpdate;

    if (!_value.PartnerName) {
      errorUpdate["PartnerName"] = "Tên đối tác không được bỏ trống";
    }
    if ((_value.PartnerName || "").length > 255) {
      errorUpdate["PartnerName"] = "Tên đối tác nhập tối đa 255 ký tự";
    }
    if (_value.PartnerName && currentRow) {
      let flag = false;
      if (
        _value.PartnerName.trim().toUpperCase() !==
        (currentRow.partnerName || "").trim().toUpperCase()
      ) {
        (data || [])
          .filter(
            (item) =>
              (item.partnerName || "").trim().toUpperCase() ===
              _value.PartnerName.trim().toUpperCase()
          )
          .map(() => (flag = true));
      }
      if (flag) errorUpdate["PartnerName"] = "Tên đối tác này đã có";
    }

    if (Object.keys(errorUpdate).length > 0) {
      this.setState({ errorUpdate });
      return;
    }
    this.setState({ errorUpdate: {}, updateModal: false });

    const bodyFormData = this.buildFormData(_value, true);

    requestUpdatePartner(bodyFormData).then((res) => {
      if (res.data && res.data.status == 200) {
        toast.success("Cập nhật đối tác thành công!");
        this.fetchSummary();
      } else {
        this.setState({ errNoti: (res.data || {}).message });
        this.toggleModal("popupMessage");
      }
    });
  };

  handleOpenEdit = (id) => {
    this.toggleModal("updateModal");
    this.setState({ editId: id });
  };

  handleDeleteRow = () => {
    const { requestDeletePartner } = this.props;
    const { deleteItem } = this.state;

    requestDeletePartner(deleteItem).then((res) => {
      if (res.data && res.data.status === 200) {
        this.fetchSummary();
        toast.success("Xoá đối tác thành công!");
      } else {
        this.setState({ errNoti: (res.data || {}).message });
        this.toggleModal("popupMessage");
      }
    });
  };

  toggle = (el, val) => {
    let { data } = this.state;
    data
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));
    this.setState({ data });
  };

  render() {
    const {
      isLoaded,
      status,
      message,
      data,
      detail,
      currentTab,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      warningPopupDelModal,
      activeCreateSubmit,
      newData,
      updateModal,
      popupMessage,
      errNoti,
      createNewModal,
      nations,
    } = this.state;
    const statusPopup = { status: status, message: message };

    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "Partner.Add").map(
        () => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Partner.Edit").map(
        () => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Partner.Delete").map(
        () => (isDisableDelete = false)
      );
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
                  {/* Tab nhóm đối tác */}
                  <div className={classes.typeTabBar}>
                    {PARTNER_TYPES.map((t) => (
                      <div
                        key={t.id}
                        className={`${classes.typeTabItem} ${
                          currentTab === t.id ? classes.typeTabActive : ""
                        }`}
                        onClick={this.onChooseTab(t.id)}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>

                  <HeaderTable
                    dataReload={() => this.fetchSummary()}
                    hideCreate={isDisableAdd == false ? false : true}
                    searchForm={
                      <SearchModal
                        filter={filter}
                        handleChangeFilter={this.handleChangeFilter}
                      />
                    }
                    handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                    moduleTitle="Thêm đối tác"
                    moduleBody={this.renderCreateModal()}
                    activeSubmit={activeCreateSubmit}
                    newData={newData}
                    handleCreateInfoData={this.handleCreateInfoData}
                  />

                  <Card className="shadow">
                    <Table
                      className="align-items-center tablecs table-css-partner"
                      responsive
                    >
                      <HeadTitleTable
                        headerTitle={PARTNER_DOI_TAC}
                        classHeaderColumns={{
                          0: "table-scale-col table-user-col-1",
                        }}
                      />
                      <tbody ref={(ref) => (this.tableBody = ref)}>
                        {Array.isArray(data) &&
                          data
                            .filter((item, key) => key >= beginItem && key < endItem)
                            .map((item, key) => (
                              <tr
                                key={key}
                                style={{
                                  ...generateStyleTableCol(
                                    this.tableBody,
                                    (data || []).length
                                  ),
                                }}
                                className="table-hover-css"
                              >
                                <td className="table-scale-col table-user-col-1">
                                  {item.index}
                                </td>
                                <td
                                  style={{ textAlign: "center" }}
                                  className="table-scale-col css-img-partner"
                                >
                                  {item.thumbnail}
                                </td>
                                <td
                                  style={{ textAlign: "left" }}
                                  className="table-scale-col"
                                >
                                  <strong>{item.partnerName}</strong>
                                  {item.verifiedStatus === 2 && (
                                    <span className={classes.verifiedBadge}>
                                      Đã xác thực LACOGROUP
                                    </span>
                                  )}
                                  <br />
                                  <span>Địa chỉ:&nbsp;{item.address}</span>
                                  <br />
                                  <span>Điện thoại:&nbsp;{item.phoneNumber}</span>
                                  <br />
                                  <span>Email:&nbsp;{item.email}</span>
                                </td>
                                <td>
                                  {isDisableEdit == true &&
                                  isDisableDelete == true ? null : (
                                    <ButtonDropdown
                                      isOpen={item.collapse}
                                      toggle={() => this.toggle(key, item.id)}
                                    >
                                      <DropdownToggle>
                                        <img src={MenuButton} />
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        {isDisableEdit == false ? (
                                          <DropdownItem
                                            onClick={() => {
                                              this.handleOpenEdit(item.id);
                                              this.setState({ currentRow: item });
                                            }}
                                          >
                                            Sửa
                                          </DropdownItem>
                                        ) : null}
                                        {isDisableEdit == true ||
                                        isDisableDelete == true ? null : (
                                          <DropdownItem divider />
                                        )}
                                        {isDisableDelete == false ? (
                                          <DropdownItem
                                            onClick={() => {
                                              this.toggleModal(
                                                "warningPopupDelModal"
                                              );
                                              this.setState({
                                                deleteItem: item.id,
                                              });
                                            }}
                                          >
                                            Xóa
                                          </DropdownItem>
                                        ) : null}
                                      </DropdownMenu>
                                    </ButtonDropdown>
                                  )}
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

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={errNoti}
              toggleModal={this.toggleModal}
            />

            <WarningPopupDel
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý xóa thông tin này?
                </p>
              }
              warningPopupDelModal={warningPopupDelModal}
              toggleModal={this.toggleModal}
              handleWarning={this.handleDeleteRow}
            />

            {updateModal && (
              <UpdatePopup
                moduleTitle="Sửa đối tác"
                moduleBody={
                  <UpdateModal
                    id={this.state.editId}
                    nations={nations}
                    requestGetPartner={this.props.requestGetPartner}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataUpdate}
                    errorUpdate={this.state.errorUpdate}
                  />
                }
                newData={this.state.newDataUpdate}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleUpdateInfoData}
              />
            )}

            <CreateNewPopup
              newData={newData}
              createNewModal={createNewModal}
              moduleTitle="Thêm đối tác"
              type100={true}
              moduleBody={this.renderCreateModal()}
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              handleCreateInfoData={(data, beta, close) => {
                this.handleCreateInfoData(
                  data,
                  () => {
                    this.setState({ createNewModal: false });
                  },
                  close
                );
              }}
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

const mapStateToProps = (state) => {
  return {
    partner: state.PartnerStore,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionPartner, dispatch),
  };
};
export default compose(connect(mapStateToProps, mapDispatchToProps))(Partners);
