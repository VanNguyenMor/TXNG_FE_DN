import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { LOGGING_INFORMATION } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { actionTrace } from "../../../actions/TraceActions";
import { areaDataAction } from "../../../actions/AreaDataAction";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { handleGenTree } from "../../../helpers/trees";
import Select from "../../../components/Select";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import ReactDatetime from "react-datetime";

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";
import DetailLogging from "./DetailLogging.js";
import WriteLogging from "./WriteLogging.js";

import ViewModal from "./ViewModal.js";
import ViewPopup from "../../../components/ViewPopup";

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class LoggingInformation extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        img: "",
        title: "Dép Cross",
        code: "AKDASKDASP12913I9312KĐQ0D",
        plantingZoneId: 1,
        status: 1,
      },
      {
        id: 2,
        img: "",
        title: "Sứ Emax",
        code: "AKDASKDASP12913I9312KĐQ0D",
        plantingZoneId: 2,
        status: 1,
      },
    ];

    this.state = {
      viewModal: false,
      dataTrace: {},
      dataTraceInforms: [],
      data: dataMock,
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: "",
      history: [],
      roles: [],
      zones: [],
      editStatus: true,
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: LOGGING_INFORMATION,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      createNewModal: false,
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      currentPage: 0,
      filter: {
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      isShowForDetail: false,
      isShowForWrite: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Kết thúc" },
        { id: 1, title: "Đang diễn ra" },
      ],
      JOB_OPTIONS: [
        { id: 0, title: "Ngành nghề 1" },
        { id: 1, title: "Ngành nghề 2" },
      ],
      PRODUCT_OPTIONS: [
        { id: 0, title: "Sản phẩm 1" },
        { id: 1, title: "Sản phẩm 2" },
      ],
      PLANTINGZONE_OPTIONS: [
        {
          id: 0,
          title: "Vùng trồng 1",
        },
        {
          id: 1,
          title: "Vùng trồng 2",
        },
      ],
      LOGGING_OPTIONS: [
        {
          id: 0,
          title: "Thiết kế tạo mẫu",
        },
        {
          id: 1,
          title: "Chọn nguyên liệu",
        },
      ],
    };
  }

  componentWillMount() {
    const { requestGetListFieldComboBox } = this.props;
    /* Fetch Summary */
    this.fetchSummary(
      JSON.stringify({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        endDate: new Date().toISOString(),
        status: null,
        field: "",
        product: "",
        orderBy: "",
        page: 0,
        limit: LIMIT_ITEM_IN_PAGE,
        init: true
      })
    );

    requestGetListFieldComboBox({}).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          JOB_OPTIONS: ((res.data || {}).data || {}).fields || [],
        };
      });
    });
  }

  fetchSummary = (data) => {
    const { requestListTrace } = this.props;

    this.setState({ isLoaded: true });

    requestListTrace(data).then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const data = (res.data || {}).data || {};
      const traces = data.traces || [];

      let newData = traces.map(item => ({
        ...item,
        id: item.ID,
        title: item.ProductName,
        code: item.NameCode,
        plantingZoneId: item.PlantingZone,
        icon: item.Avatar,
        status: item.IsCompleted,
        // Map other fields if necessary
      }));

      const total = newData.length | 0; // Or better if API returns total count
      const length = newData.length;

      this.setState({
        data: newData,
        listLength: total,
        totalPage: Math.ceil(length / limit), // Usually API returns total elements to calculate page
        isLoaded: false,
        collapseList: collapseList,
      });
    });
  };

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
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
    } else total = total;

    this.setState({
      beginItem: beginItem,
      endItem: endItem,
      currentPage: selected + 1,
      totalElement: total,
    });
  };

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev["name"]] = ev["value"];
    this.setState({ filter });
  };

  clearFilter = () => {
    let clearFilter = {
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    this.setState({ filter: clearFilter });
  };

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  };

  handleSubmitSearchForm = () => {
    const { fromDate, toDate, filter, limit } = this.state;
    this.fetchSummary(
      JSON.stringify({
        startDate: fromDate ? new Date(fromDate).toISOString() : null,
        endDate: toDate ? new Date(toDate).toISOString() : null,
        status: null,
        field: filter.field || "",
        product: filter.product || "",
        orderBy: "",
        page: 0,
        limit: limit,
        init: false
      })
    );
  };

  handleModal = (status, openModal, closeModal) => {
    if (
      status ||
      this.state.isShowForEdit ||
      this.state.isShowForDetail ||
      this.state.isShowForWrite
    ) {
      closeModal && closeModal();
    } else {
      openModal && openModal();
    }

    this.setState({
      isShowForEdit: false,
      isShowForDetail: false,
      isShowForWrite: false,
      editId: null,
    });
  };

  toggle = (el, val) => {
    let { collapseList } = this.state;

    collapseList
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ collapseList });
  };
  checkDataInsert = (isCheck) => {
    if (!isCheck) {
      return {};
    }
    const { dataInsert, data, editId, currentRow } = this.state;
    const title = dataInsert.title;

    const errorInserts = {};

    if (!title) {
      errorInserts.title = "Số phiếu không được bỏ trống";
    }

    return errorInserts;
  };

  onConfirm = (toggleModal, closePopup) => {
    const { dataInsert } = this.state;
    const formData = new FormData();
    console.log(dataInsert);
    alert("Thao tác thành công");
    if (toggleModal) {
      toggleModal();
    }
  };

  onHandleChangeValue = (data) => {
    this.setState(
      (previousState) => {
        return {
          ...previousState,
          dataInsert: data,
        };
      },
      () => {
        const errorInserts = this.checkDataInsert();

        this.setState((previousState) => {
          return {
            ...previousState,
            errorInserts,
          };
        });
      }
    );
  };

  onEditData = (id) => () => {
    this.setState((previousState) => {
      return {
        isShowForEdit: true,
      };
    });
  };

  onHandleGet = (item) => {
    const { requestGetTrace, requestGetHistoryTrace } = this.props;
    // 1. Gọi API lấy thông tin chi tiết
    const traceID = item.id || item.ID;
    const companyID = item.CompanyID || item.companyId;

    requestGetTrace(traceID + '&companyId=' + companyID).then(res => {
      if (res.data && res.data.status === 200) {
        this.setState({
          dataTrace: res.data.data.trace || {}
        });
      }
    });
    // 2. Gọi API lấy lịch sử
    const reqHistoryPayload = {
      "companyID": companyID,
      "traceID": traceID,
      "page": 0,
      "limit": 200
    };
    requestGetHistoryTrace(reqHistoryPayload).then(res => {
      if (res.data && res.data.status === 200) {
        this.setState({
          dataTraceInforms: res.data.data.traceInforms || []
        });
      }
    });
    this.setState({ viewModal: true });
  }

  onShowDetail = (id) => () => {
    this.setState((previousState) => {
      return {
        isShowForDetail: true,
      };
    });
  };

  onShowWrite = (id) => () => {
    this.setState((previousState) => {
      return {
        isShowForWrite: true,
      };
    });
  };

  onDeleteData = (id) => () => {
    alert("Xóa thành công");
  };

  toggleModalPopupDelete = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupModal: false,
      };
    });
  };

  handleDeleteRow = () => {
    this.props.requestDeleteTrace(this.state.deleteId).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          warningPopupModal: false,
        };
      });

      const data = res.data;

      if (data.status == 200) {
        this.handleSubmitSearchForm();

        this.setState({ message: "Xóa dữ liệu thành công" });
        toast.success("Xoá dữ liệu thành công!");
      } else {
        const message = getErrorMessageServer(res);

        this.setState({ message: message || "Xóa dữ liệu thất bại" });
        this.toggleModal("popupMessage");
      }
    });
  };

  toggleModal = (state, type) => {
    if (type == 1) {
      this.setState({ [state]: false });
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
      });
    }
  };

  renderTreeLine = (nodelv) => {
    let line = "";

    for (let i = 0; i < nodelv; i++) {
      line += "-";
    }

    return line;
  };

  showTitleWithPlantingZoneId = (id) => {
    const { PLANTINGZONE_OPTIONS } = this.state;

    let queue = PLANTINGZONE_OPTIONS ? [...PLANTINGZONE_OPTIONS] : [];

    while (queue.length > 0) {
      const zone = queue.shift();

      if (zone && zone.id === id) {
        return zone.title;
      }

      if (zone && zone.children && zone.children.length > 0) {
        queue.push(...zone.children);
      }
    }
    return "Không tìm thấy vùng trồng trọt";
  };

  showTitleWithStatus = (id) => {
    const { STATUS_OPTIONS } = this.state;

    let queue = STATUS_OPTIONS ? [...STATUS_OPTIONS] : [];

    while (queue.length > 0) {
      const status = queue.shift();

      if (status && status.id === id) {
        return status.title;
      }

      if (status && status.children && status.children.length > 0) {
        queue.push(...status.children);
      }
    }

    // Trả về chuỗi rỗng nếu không tìm thấy
    return "";
  };

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let parentid = [];
    let autoIndex = 0;

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach((e) => parentid.push(e.id));

    const cb = (e, key, array) => {
      const renderClass =
        !e.parentID || e.parentID.length === 0
          ? `${classes.treeParent}`
          : `${classes.treeChild}${parentid.includes(e.parentID)
            ? ` ${classes.childs}`
            : ` ${classes.childsItem}`
          }`;
      list.push(
        <tr
          key={autoIndex}
          parentid={e.parentID}
          currentid={e.id}
          index={autoIndex}
          className="table-hover-css"
          onClick={() => this.onHandleGet(e)}
          style={{ cursor: "pointer" }}
        >
          <td
            className={`className='table-scale-col table-user-col-1' ${renderClass}`}
          >
            {autoIndex + 1}
          </td>
          <td className="table-scale-col">
            <img
              style={{ width: 82, height: 82 }}
              src={e.icon ? e.icon : NoImg}
              alt="..."
            />
          </td>
          <td className="table-scale-col">
            <span style={{ color: `${e.color}` }}>{e.title}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.code}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {this.showTitleWithPlantingZoneId(e.plantingZoneId)}
            </span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {this.showTitleWithStatus(e.status)}
            </span>
          </td>
          <td>
            {collapseList
              .filter((item) => item.id === e.id)
              .map((ele, key) => (
                <div key={key}>
                  {isDisableEdit == true && isDisableDelete == true ? null : (
                    <ButtonDropdown
                      isOpen={ele.collapse}
                      toggle={() => this.toggle(key, e.id)}
                    >
                      <DropdownToggle>
                        <img src={MenuButton} />
                      </DropdownToggle>
                      <DropdownMenu>
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onEditData(e)}>
                            Sửa
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onShowDetail(e)}>
                            Chi tiết
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onShowWrite(e)}>
                            Ghi nhật ký
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ||
                          isDisableDelete == true ? null : (
                          <DropdownItem divider />
                        )}
                        {isDisableDelete == true ? null : (
                          <DropdownItem onClick={this.onDeleteData(e.id)}>
                            Xoá
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </ButtonDropdown>
                  )}
                </div>
              ))}
          </td>
        </tr>
      );
      autoIndex++;
      e.children && e.children.forEach(cb);
    };

    data.forEach(cb);
    return list;
  };

  render() {
    const {
      warningPopupModal,
      editId,
      isShowForEdit,
      isShowForDetail,
      isShowForWrite,
      errorInserts,
      status,
      headerTitle,
      data,
      fromDate,
      toDate,
      message,
      isLoaded,
      listLength,
      totalPage,
      totalElement,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      STATUS_OPTIONS,
      JOB_OPTIONS,
      PRODUCT_OPTIONS,
      PLANTINGZONE_OPTIONS,
      LOGGING_OPTIONS,
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
      ACCOUNT_CLAIM_FF = localStorage
        .getItem("ACCOUNT_CLAIM_FF")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Delete").map(
        (y) => (isDisableDelete = false)
      );
    }

    return (
      <>
        {
          <div className={classes.wrapper}>
            <Container fluid>
              {isLoaded ? (
                <div style={{ display: "table", margin: "auto" }}>
                  <Spinner style={{ width: "3rem", height: "3rem" }} />
                </div>
              ) : (
                <Row>
                  <div className="col">
                    {/* Header */}
                    <HeaderTable
                      dataReload={() =>
                        this.fetchSummary(
                          JSON.stringify({
                            search: "",
                            filter: "",
                            orderBy: "",
                            page: null,
                            limit: null,
                          })
                        )
                      }
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      moduleTitle={
                        isShowForDetail
                          ? "Chi tiết nhật ký truy xuất"
                          : isShowForEdit
                            ? "Cập nhật nhật ký truy xuất"
                            : isShowForWrite
                              ? "Ghi nhật ký truy cập"
                              : "Thêm/Cập nhật nhật ký truy xuất"
                      }
                      moduleBody={
                        <div>
                          {isShowForDetail ? (
                            <DetailLogging
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              STATUS_OPTIONS={STATUS_OPTIONS}
                              JOB_OPTIONS={JOB_OPTIONS}
                              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
                              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                            />
                          ) : isShowForWrite ? (
                            <WriteLogging
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              STATUS_OPTIONS={STATUS_OPTIONS}
                              JOB_OPTIONS={JOB_OPTIONS}
                              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
                              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                              LOGGING_OPTIONS={LOGGING_OPTIONS}
                            />
                          ) : (
                            <InsertOrUpdate
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              STATUS_OPTIONS={STATUS_OPTIONS}
                              JOB_OPTIONS={JOB_OPTIONS}
                              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
                              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                            />
                          )}
                        </div>
                      }
                      isShowForEdit={
                        isShowForEdit || isShowForDetail || isShowForWrite
                      }
                      handleModal={this.handleModal}
                      isReadOnly={isShowForDetail}
                      onConfirm={this.onConfirm}
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
                      }
                      typeSearch={
                        <>
                          <div
                            className="div_flex"
                            style={{ marginBottom: "10px", flex: "wrap" }}
                          >
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Từ ngày
                              </label>
                              <div>
                                <ReactDatetime
                                  inputProps={{
                                    placeholder: "dd/mm/yyyy",
                                    to: "fromDate",
                                  }}
                                  value={fromDate || ""}
                                  timeFormat={false}
                                  dateFormat="DD-MM-YYYY"
                                  onChange={(value) =>
                                    this.setState({
                                      fromDate: value
                                        ? value.format("DD-MM-YYYY")
                                        : "",
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Đến ngày
                              </label>
                              <div>
                                <ReactDatetime
                                  inputProps={{
                                    placeholder: "dd/mm/yyyy",
                                    name: "toDate",
                                  }}
                                  value={toDate || ""}
                                  timeFormat={false}
                                  dateFormat="DD-MM-YYYY"
                                  onChange={(value) =>
                                    this.setState({
                                      toDate: value
                                        ? value.format("DD-MM-YYYY")
                                        : "",
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Ngành nghề
                              </label>
                              <div>
                                <Select
                                  name="filter"
                                  title="Ngành nghề"
                                  data={JOB_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Sản phẩm
                              </label>
                              <div>
                                <Select
                                  name="filter"
                                  title="Sản phẩm"
                                  data={PRODUCT_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
                            <div className="mg-btn">
                              <label className="form-control-label">
                                &nbsp;
                              </label>
                              <Button
                                className="btn-warning-cs"
                                color="default"
                                type="button"
                                size="md"
                                onClick={() => {
                                  this.handleSubmitSearchForm();
                                }}
                              >
                                <img src={SearchImg} alt="Tìm kiếm" />
                                <span>Tìm kiếm</span>
                              </Button>
                            </div>
                          </div>
                        </>
                      }
                    />

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className="align-items-center tablecs table-css-planting-zone"
                        responsive
                      >
                        <HeadTitleTable
                          headerTitle={headerTitle}
                          classHeaderColumns={{
                            0: "table-scale-col table-user-col-1",
                          }}
                        />
                        <tbody>
                          {Array.isArray(data) &&
                            this.renderTable(
                              data,
                              isDisableEdit,
                              isDisableDelete
                            )}
                        </tbody>
                      </Table>
                    </Card>

                    {/* Pagination */}
                    {
                      // Page of Table
                      Array.isArray(data) > 0 && (
                        <Pagination
                          data={data}
                          listLength={listLength}
                          totalPage={totalPage}
                          totalElement={totalElement}
                          handlePageClick={this.handlePageClick}
                        />
                      )
                    }
                  </div>
                </Row>
              )}

              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý xóa thông tin này?
                </p>
              }
              warningPopupModal={warningPopupModal}
              toggleModal={this.toggleModalPopupDelete}
              handleWarning={this.handleDeleteRow}
            />

            <CreateNewPopup
              createNewModal={createNewModal}
              moduleTitle="Thêm dữ liệu"
              type100={true}
              moduleBody={
                <>
                  <InsertOrUpdate
                    id={editId}
                    errors={errorInserts}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />
                  <DetailLogging
                    id={editId}
                    errors={errorInserts}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />
                  <WriteLogging
                    id={editId}
                    errors={errorInserts}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />
                </>
              }
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              onConfirm={(data, close) => {
                this.onConfirm(data, close);
              }}
            />

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={message}
              toggleModal={this.toggleModal}
            />

            <ViewPopup
              moduleTitle='Xem nhật ký'
              viewModal={this.state.viewModal}
              toggleModal={this.toggleModal}
              moduleBody={
                <ViewModal
                  dataTrace={this.state.dataTrace}
                  dataTraceInforms={this.state.dataTraceInforms}
                />
              }
            />

            <ToastContainer position="top-center" autoClose={3000} />
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    zone: state.ZoneStore,
    PlantingZoneStore: state.PlantingZoneStore,
    TypeZoneProperty: state.TypeZonePropertyStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionZoneCreators, dispatch),
    ...bindActionCreators(typeZonePropertyAction, dispatch),
    ...bindActionCreators(areaDataAction, dispatch),
    ...bindActionCreators(actionTrace, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  LoggingInformation
);
