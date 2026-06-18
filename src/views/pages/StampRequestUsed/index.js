import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PRODUCT_MANAGEMENT, QRCODE_USED } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from "../../../components/WarningPopup";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import PopupMessage from "../../../components/PopupMessage";
import { handleGenTree } from "../../../helpers/trees";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import { fetchData } from "helpers/fetchData";
import moment from "moment";

// reactstrap components
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
  Button,
} from "reactstrap";

import ShowHistoryData from "./ShowHistoryData.js";
import ShowEditData from "./ShowEditData.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import Select from "components/Select/index.js";

class BusinessInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      tableTitle: "",
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
      headerTitle: QRCODE_USED,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      createNewModal: false,
      currentPage: 0,
      collapseList: [],
      totalPage: 0,
      filter: {
        search: "",
        statusFilter: "",
        effectFilter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
      dataInsert: {},
      errorInserts: {},
      isShowForHistoryList: false,
      isShowForDetail: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      warningBlockProductModal: false,
      blockProductId: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Mới tạo" },
        { id: 1, title: "Chờ duyệt" },
        { id: 2, title: "Đã duyệt" },
        { id: 3, title: "Không duyệt" },
        { id: 4, title: "Đã duyệt yêu cầu" },
      ],
      EFFECT_OPTIONS: [
        { id: 0, title: "Chưa hiệu lực" },
        { id: 1, title: "Chờ cấp phép" },
        { id: 2, title: "Có hiệu lực" },
        { id: 3, title: "Không cấp phép" },
      ],
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
    this.fetchSummary(
      JSON.stringify({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      })
    );

    getListTypeZoneProperty({
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    }).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          dataTypeZone: ((res.data || {}).data || {}).plantingTypes || [],
        };
      });
    });
  }

  fetchSummary = async (data) => {
    this.setState({ isLoaded: true });

    try {
      const payload = data ? JSON.parse(data) : {};
      
      
      const res = await fetchData.stampRequest.getList(payload);
      
      
      if (!res) {
        this.setState({ isLoaded: false, data: [], collapseList: [] });
        return;
      }

      let stampRequests = [];
      
      if (res.data && res.data.stamps && Array.isArray(res.data.stamps)) {
        stampRequests = res.data.stamps;
      } else if (res.stamps && Array.isArray(res.stamps)) {
        stampRequests = res.stamps;
      } else if (Array.isArray(res)) {
        stampRequests = res;
      } else if (res.data && Array.isArray(res.data)) {
        stampRequests = res.data;
      }

      const { limit } = this.state;
      let collapseList = [];

      let tableData = stampRequests.map((item, index) => ({
        id: item.id || item.ID,
        requestDate: item.requestedDate 
          ? moment(item.requestedDate).format("DD/MM/YYYY") 
          : "",
        totalRequestedQuantity: item.quantity || item.Quantity || 0,
        stampRange: item.startNum && item.endNum 
          ? `${item.startNum} - ${item.endNum}` 
          : item.stampRange || item.StampRange || "-",
        printMethod: item.isPrint === true ? "Tự in" : "Yêu cầu in",
        effect: item.requestedUsedStatus || item.RequestedUsedStatus || 0,
        currentStatus: item.status || item.Status || 0,
        parentID: "",
        index: index + 1,
        color: "",
      }));

      if (payload.status !== null && payload.status !== undefined) {
        tableData = tableData.filter(item => item.currentStatus === payload.status);
      }

      if (payload.requestedUsedStatus !== null && payload.requestedUsedStatus !== undefined) {
        tableData = tableData.filter(item => item.effect === payload.requestedUsedStatus);
      }

      tableData.forEach((item) => {
        collapseList.push({ id: item.id, collapse: false });
      });

      const total = tableData.length;
      const apiTotal = (res.data && (res.data.total || res.data.totalRows || res.data.totalCount)) || total;

      this.setState({
        data: tableData,
        listLength: apiTotal,
        totalElement: apiTotal,
        totalPage: Math.ceil(apiTotal / limit),
        isLoaded: false,
        collapseList: collapseList,
      });

    } catch (error) {
      toast.error("Lỗi khi tải danh sách xin cấp tem");
      this.setState({ isLoaded: false });
    }
  };

  onEditData = (item) => async () => {
    if (!item || !item.id) return;

    this.setState({ isLoaded: true });

    try {
      // Load detail data from API
      const detailData = await fetchData.stampRequest.getDetail(item.id);

      if (detailData) {
        const request = detailData.request || detailData;
        console.log("Detail data from API:", request);
        const initialData = {
          id: item.id,
          quantity: request.quantity || request.Quantity || 0,
          stampRange: request.stampTemplateID || request.StampTemplateID || "",
          size: request.size || request.Size || "",
          printMethod: request.isPrint === true ? 1 : 0,
          notes: request.note || request.Note || "",
          status: request.status || request.Status || 0,
        };
        console.log("Initialized data:", initialData);

        this.setState({
          isShowForDetail: true,
          editId: item.id,
          dataInsert: initialData,
          isLoaded: false,
        });
      } else {
        toast.error("Không tải được dữ liệu chi tiết!");
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết xin cấp tem:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      this.setState({ isLoaded: false });
    }
  };

  onConfirm = async (toggleModal, closePopup) => {
    const { dataInsert, editId } = this.state;

    const errorInserts = this.checkDataInsert(true);
    if (Object.keys(errorInserts).length > 0) {
      this.setState({ errorInserts });
      return;
    }

    this.setState({ isLoaded: true });

    try {
      // Parse quantity to ensure it's a valid number
      const parsedQuantity = parseInt(dataInsert.quantity) || 0;
      
      // Build FormData instead of JSON
      const formData = new FormData();
      formData.append("Id", dataInsert.id || "");
      formData.append("Quantity", parsedQuantity);
      formData.append("StampTemplateID", dataInsert.stampRange || "");
      formData.append("Size", dataInsert.size || "");
      formData.append("IsPrint", "false");
      formData.append("Note", dataInsert.notes || "");
      formData.append("FileUpload", "");
      formData.append("Files", "[]");
      formData.append("Amount", 0);


      // Call API
      let result;
      if (dataInsert.id) {
        // Update
        result = await fetchData.stampRequest.editFormData(formData);
        if (result && result.status === 200) {
          toast.success("Cập nhật xin cấp tem thành công!");
        } else {
          toast.error("Cập nhật xin cấp tem thất bại!");
          this.setState({ isLoaded: false });
          return;
        }
      } else {
        // Create
        result = await fetchData.stampRequest.addFormData(formData);
        if (result && result.status === 200) {
          toast.success("Thêm xin cấp tem thành công!");
        } else {
          toast.error("Thêm xin cấp tem thất bại!");
          this.setState({ isLoaded: false });
          return;
        }
      }

      // Close modal and refresh data
      if (toggleModal) {
        toggleModal();
      }

      // Reset form
      this.setState({
        isShowForDetail: false,
        editId: null,
        dataInsert: {},
        errorInserts: {},
        isLoaded: false,
      });

      // Reload data
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    } catch (error) {
      console.error("Lỗi khi lưu xin cấp tem:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      this.setState({ isLoaded: false });
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
        const errorInserts = this.checkDataInsert(false);

        this.setState((previousState) => {
          return {
            ...previousState,
            errorInserts,
          };
        });
      }
    );
  };

  onCloseModal = () => {
    this.setState({
      isShowForDetail: false,
      editId: null,
      dataInsert: {},
      errorInserts: {},
    });
  };

  checkDataInsert = (isSubmit = false) => {
    const { dataInsert } = this.state;
    let errors = {};

    // Validate quantity
    if (!dataInsert.quantity || dataInsert.quantity <= 0) {
      errors.quantity = "Số lượng không được trống và phải lớn hơn 0";
    }

    // Validate stamp size
    if (!dataInsert.size || String(dataInsert.size).trim() === "") {
      errors.size = "Kích thước tem không được trống";
    }

    // Validate stamp template
    if (!dataInsert.stampRange) {
      errors.stampRange = "Vui lòng chọn mẫu in tem";
    }

    return errors;
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
    let { limit } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);

    let beginItem = offset;
    let endItem = offset + limit;

    this.setState({
      beginItem: beginItem,
      endItem: endItem,
      currentPage: selected,
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
      statusFilter: "",
      effectFilter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    this.setState({ filter: clearFilter });
  };

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value ? String(value) : "";
    this.setState({ filter });
  };

  handleDataReload = () => {
    const resetFilter = {
      search: "",
      statusFilter: "",
      effectFilter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    
    this.setState({ filter: resetFilter }, () => {
      this.fetchSummary(JSON.stringify({
        search: "",
        orderBy: "",
        page: null,
        limit: null,
      }));
    });
  };

  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    
    if (!filter.statusFilter && !filter.effectFilter) {
      alert("Vui lòng chọn ít nhất một tiêu chí tìm kiếm!");
      return;
    }
    
    const payload = {
      search: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    
    if (filter.statusFilter !== null && filter.statusFilter !== undefined && filter.statusFilter !== "") {
      payload.status = parseInt(filter.statusFilter);
    }
    
    if (filter.effectFilter !== null && filter.effectFilter !== undefined && filter.effectFilter !== "") {
      payload.requestedUsedStatus = parseInt(filter.effectFilter);
    }
    
    this.fetchSummary(JSON.stringify(payload));
  };

  handleModal = (status, openModal, closeModal) => {
    if (
      status ||
      this.state.isShowForHistoryList ||
      this.state.isShowForDetail
    ) {
      closeModal && closeModal();
    } else {
      openModal && openModal();
    }

    this.setState({
      isShowForHistoryList: false,
      isShowForDetail: false,
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

  onShowHistoryModal = (e) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForHistoryList: true,
        editId: e.id,
        tableTitle: "LỊCH SỬ NGUYÊN VẬT LIỆU",
        currentHistoryData: this.state.HISTORY_DATA,
      };
    });
  };

  onShowDetail = (item) => () => {
    this.setState({
      isShowForHistoryList: true,
      isShowForDetail: false,
      editId: item.id,
      tableTitle: "CHI TIẾT YÊU CẦU CẤP TEM",
    });
  };

  onDeleteData = (id) => () => {
    this.setState({
      warningPopupModal: true,
      deleteId: id,
    });
  };

  toggleModalPopupDelete = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupModal: false,
      };
    });
  };

  onAddNew = () => {
    this.setState({
      isShowForDetail: true,
      editId: null,
      dataInsert: {
        id: null,
        quantity: 0,
        size: "",
        stampRange: "",
        printMethod: 0,
        notes: "",
      },
      errorInserts: {},
    });
  };

  handleDeleteRow = async () => {
    const { deleteId } = this.state;

    if (!deleteId) {
      this.setState({ warningPopupModal: false });
      return;
    }

    this.setState({ isLoaded: true });

    try {
      const result = await fetchData.stampRequest.delete(deleteId);

      if (result && result.status === 200) {
        this.setState({
          warningPopupModal: false,
          message: "Xóa dữ liệu thành công",
          isLoaded: false,
        });
        toast.success("Xóa dữ liệu thành công!");

        // Reload list
        this.fetchSummary(
          JSON.stringify({
            search: "",
            filter: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );
      } else {
        this.setState({
          warningPopupModal: false,
          message: "Xóa dữ liệu thất bại",
          isLoaded: false,
        });
        toast.error("Xóa dữ liệu thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi xóa xin cấp tem:", error);
      this.setState({
        warningPopupModal: false,
        message: "Có lỗi xảy ra khi xóa",
        isLoaded: false,
      });
      toast.error("Có lỗi xảy ra!");
    }
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

  showTitleWithEffect = (id) => {
    const { EFFECT_OPTIONS } = this.state;

    let queue = EFFECT_OPTIONS ? [...EFFECT_OPTIONS] : [];

    while (queue.length > 0) {
      const authentic = queue.shift();

      if (authentic && authentic.id === id) {
        return authentic.title;
      }

      if (authentic && authentic.children && authentic.children.length > 0) {
        queue.push(...authentic.children);
      }
    }

    return "";
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

    return "";
  };

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let autoIndex = 0;

    // Lọc dữ liệu theo pagination
    const filteredData = Array.isArray(data) 
      ? data.filter((item, key) => key >= beginItem && key < endItem)
      : [];

    // Render từng dòng của bảng
    filteredData.forEach((e, index) => {
      list.push(
        <tr
          key={`row-${e.id}`}
          currentid={e.id}
          index={index}
          className="table-hover-css"
        >
          <td className="table-scale-col table-user-col-1">
            {beginItem + index + 1}
          </td>
          <td className="table-scale-col" style={{ textAlign: "left" }}>
            <span style={{ fontSize: "14px" }}>
              {e.requestDate}
            </span>
          </td>

          <td className="table-scale-col" style={{ textAlign: "left" }}>
            <span style={{ fontSize: "14px" }}>
              {e.totalRequestedQuantity}
            </span>
          </td>

          <td className="table-scale-col">
            <span style={{ fontSize: "14px" }}>
              {e.stampRange ?? "-"}
            </span>
          </td>
          <td className="table-scale-col">
            <span>{e.printMethod}</span>
          </td>
          <td className="table-scale-col">
            <span>
              {this.showTitleWithStatus(e.currentStatus)}
            </span>
          </td>
          <td className="table-scale-col">
            <span>
              {this.showTitleWithEffect(e.effect)}
            </span>
          </td>
          <td className="table-scale-col">
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
                          <DropdownItem onClick={this.onShowDetail(e)}>
                            Xem chi tiết
                          </DropdownItem>
                        )}

                        {isDisableEdit == true || e.currentStatus == 2 || e.currentStatus == 4 ? null : (
                          <>
                            <DropdownItem divider />
                            <DropdownItem onClick={this.onEditData(e)}>
                              Chỉnh sửa
                            </DropdownItem>
                          </>
                        )}

                        {isDisableDelete == true ||
                        e.currentStatus == 2 ||
                        e.currentStatus == 4 ? null : (
                          <>
                            <DropdownItem divider />
                            <DropdownItem onClick={this.onDeleteData(e.id)}>
                              Xoá
                            </DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </ButtonDropdown>
                  )}
                </div>
              ))}
          </td>
        </tr>
      );
    });

    return list;
  };

  onShowBlockProductModal = (product) => () => {
    this.setState({
      warningBlockProductModal: true,
      blockProductId: product.id,
      blockProductTitle: product.title,
    });
  };

  toggleBlockProductModal = () => {
    this.setState({
      warningBlockProductModal: false,
      blockProductId: null,
      blockProductTitle: null,
    });
  };

  render() {
    const {
      warningPopupModal,
      editId,
      isShowForDetail,
      isShowForHistoryList,
      errorInserts,
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      listLength,
      totalPage,
      totalElement,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      currentHistoryData,
      STATUS_OPTIONS,
      EFFECT_OPTIONS,
      filter,
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
                    <HeaderTable
                      dataReload={this.handleDataReload}
                      readOnly={isShowForHistoryList}
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      moduleTitle={
                        isShowForDetail
                          ? "Chi tiết yêu cầu cấp tem"
                          : isShowForHistoryList
                          ? "Chi tiết yêu cầu cấp tem"
                          : "Quản lý tem"
                      }
                      typeSearch={
                        <>
                          <div
                            className="div_flex"
                            style={{
                              marginBottom: "30px",
                              flex: "wrap",
                              width: "100%",
                              flexWrap: "wrap",
                            }}
                          >
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Trạng thái duyệt
                              </label>
                              <div>
                                <Select
                                  name="statusFilter"
                                  title="Lọc theo trạng thái"
                                  data={STATUS_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  value={filter.statusFilter ? parseInt(filter.statusFilter) : null}
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>

                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Trạng thái cấp phép
                              </label>
                              <div>
                                <Select
                                  name="effectFilter"
                                  title="Lọc theo cấp phép"
                                  data={EFFECT_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  value={filter.effectFilter ? parseInt(filter.effectFilter) : null}
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
                      isReadOnly={isShowForHistoryList}
                      moduleBody={
                        <div>
                          {isShowForDetail ? (
                            <ShowEditData
                              dataInsert={this.state.dataInsert}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                            />
                          ) : isShowForHistoryList ? (
                            <ShowHistoryData
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              historyData={currentHistoryData}
                            />
                          ) : (
                            <ShowEditData
                              dataInsert={{}}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                            />
                          )}
                        </div>
                      }
                      isShowForEdit={isShowForHistoryList || isShowForDetail}
                      handleModal={this.handleModal}
                      onConfirm={this.onConfirm}
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
                      }
                    />

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className={`align-items-center tablecs table-css-planting-zone ${classes.scrollTable}`}
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
                      Array.isArray(data) && data.length > 0 && (
                        <Pagination
                          data={data}
                          listLength={listLength}
                          totalPage={totalPage}
                          totalElement={totalElement}
                          handlePageClick={this.handlePageClick}
                        />
                      )
                    }
                    {/* <WarningPopup
                      moduleTitle="Thông báo"
                      moduleBody={
                        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                          Bạn đồng ý xoá thông tin này?
                        </p>
                      }
                      warningPopupModal={warningPopupDelQR}
                      toggleModal={this.toggleModalPopupDeleteQR}
                      handleWarning={this.handleDeleteQRSystem}
                    /> */}
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

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={message}
              toggleModal={this.toggleModal}
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
    ...bindActionCreators(platingZoneAction, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  BusinessInformation
);
