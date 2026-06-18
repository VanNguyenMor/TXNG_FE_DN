import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import {
  DECLARATION_INFORMATION,
  LOGGING_INFORMATION,
} from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
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

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { getUrlCompanyAPI } from "utils/service.js";
import axios from "axios";
import { getCookie } from "helpers/cookie.js";
import { fetchData } from "helpers/fetchData";
import { callApi } from "utils/fetchAllData";

class DeclarationInformations extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        retrieve: "Pha da (Vẽ mẫu trên da)",
        title: "Dùng da bò thật",
        loggingStatus: 1,
        qrStatus: 1,
      },
      {
        id: 2,
        retrieve: "Cắt da theo khuôn đã pha",
        title: "Dùng kéo cắt da, kéo đã được vệ sinh sạch sẽ",
        loggingStatus: 1,
        qrStatus: 1,
      },
    ];

    this.state = {
      data: dataMock,
      detail: [],
      update: [],
      create: [],
      delete: [],
      roles: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: "",
      history: [],
      zones: [],
      editStatus: true,
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: DECLARATION_INFORMATION,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      createNewModal: false,
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
        { id: 0, title: "False" },
        { id: 1, title: "True" },
      ],
      JOB_OPTIONS: [
        { id: 0, title: "Ngành nghề 1" },
        { id: 1, title: "Ngành nghề 2" },
      ],
      RETRIEVE_OPTIONS: [
        { id: 0, title: "Truy xuất 1" },
        { id: 1, title: "Truy xuất 2" },
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
      REFERENCE_LIST: [
        {
          id: 0,
          title: "Danh sách tham chiếu 1",
        },
        {
          id: 1,
          title: "Danh sách tham chiếu 2",
        },
      ],
      LOGGING_DATA_TYPES: [
        {
          id: "text_options",
          title: "Văn bản",
          childInputs: [
            {
              name: "reference_select",
              label: "Danh sách tham chiếu",
              type: "select_input",
              required: true,
              dataSource: "REFERENCE_LIST",
              placeholder: "Chọn danh sách tham chiếu...",
            },
          ],
        },
        {
          id: "yes_no_options",
          title: "Có/Không",
          childInputs: [
            {
              name: "case_yes",
              label: "Trường hợp Có",
              type: "text",
              required: true,
            },
            {
              name: "case_no",
              label: "Trường hợp Không",
              type: "text",
              required: true,
            },
          ],
        },
        { id: "number", title: "Nhập số", childInputs: [] },
        { id: "time", title: "Chọn thời gian", childInputs: [] },
        { id: "image", title: "Hình ảnh", childInputs: [] },
        { id: "location", title: "Định vị", childInputs: [] },
      ],
      selectedItems: [],
      selectAll: false,
    };
  }

  componentDidMount() {}

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

    // Fetch job/field options from API
    fetchData.infoCompany.getFieldByCompanyHaveAccess({}).then(res => {
      // Handle different response structures
      let dataArray = [];
      if (Array.isArray(res)) {
        dataArray = res;
      } else if (res && Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res && res.fields && Array.isArray(res.fields)) {
        dataArray = res.fields;
      } else if (res && res.data && Array.isArray(res.data.fields)) {
        dataArray = res.data.fields;
      }
      
      const options = (dataArray || []).map(item => ({ 
        id: item.id, 
        title: item.name || item.title || item.fieldName 
      }));
      this.setState({ JOB_OPTIONS: options });
    }).catch(error => {
      console.error("Error fetching job options:", error);
    });

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

    const rolePayload = {
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
  }

  fetchSummary = (data) => {
    const { limit, filter } = this.state;

    this.setState({ isLoaded: true });

    // Get fieldId and productId from filter
    const fieldId = filter.filter || "";
    const productId = filter.product || "";

    // Build API URL with parameters
    const apiEndpoint = `informationaccess/getgridviewv2?fieldId=${fieldId}&productId=${productId}`;

    callApi("get", apiEndpoint).then((res) => {
      let collapseList = [];
      
      // Extract informSelectParents array from response
      const informSelectParents = (res.data && res.data.informSelectParents) || [];

      // Map informSelectParents to table data structure
      let newData = informSelectParents.map((item, key) => ({
        id: item.id,
        index: key + 1, // STT - tự động đếm
        retrieve: item.name, // TÊN TRUY XUẤT
        title: item.name,
        loggingStatus: item.isChecked ? 1 : 0, // NHẬT KÝ
        qrStatus: item.isShow ? 1 : 0, // QUÉT MÃ
        parentID: item.parentID === null ? "" : item.parentID,
        color: "#000",
      }));

      newData.forEach((item) => {
        collapseList.push({ id: item.id, collapse: false });
      });

      const total = newData.length | 0;
      const length = newData.length;

      this.setState({
        data: newData,
        listLength: total,
        totalPage: Math.ceil(length / limit),
        isLoaded: false,
        collapseList: collapseList,
      });
    }).catch((error) => {
      console.error("Error fetching information access:", error);
      this.setState({ isLoaded: false });
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

  handleChangeSelectFilter = async (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });

    // When field (ngành nghề) is selected, fetch products
    if (name !== "filter") {
      return;
    }

    const fieldID = (value && value.id) || value || "";
    if (!fieldID) {
      this.setState({ PRODUCT_OPTIONS: [] });
      return;
    }

    const payload = {
      fieldID: fieldID,
      productCode: "",
      productName: "",
      orderBy: "",
      page: 0,
      limit: 1000,
    };

    try {
      const res = await fetchData.product.getAllLock(payload);
      console.log("Fetched products:", res);
      let dataArray = [];
      if (Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res && res.products && Array.isArray(res.products)) {
        dataArray = res.products;
      } else if (res && res.data && Array.isArray(res.data.products)) {
        dataArray = res.data.products;
      }

      const options = (dataArray || []).map((item) => ({
        id: item.id,
        title: item.productName || item.name || item.title,
      }));
      this.setState({ PRODUCT_OPTIONS: options });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleSubmitSearchForm = () => {
    this.fetchSummary();
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
      // Fetch RETRIEVE_OPTIONS when opening modal
      const { filter } = this.state;
      const fieldId = filter.filter || "";
      const productId = filter.product || "";

      console.log("=== handleModal Debug ===");
      console.log("fieldId:", fieldId);
      console.log("productId:", productId);

      if (fieldId && productId) {
        const apiEndpoint = `informationaccess/getListProcessAccessForAdd?fieldId=${fieldId}&productId=${productId}`;
        console.log("API Endpoint:", apiEndpoint);
        
        callApi("get", apiEndpoint).then((res) => {
          console.log("API Response:", res);
          console.log("res.data:", res.data);
          
          const dataArray = (res.data && res.data.data) || res.data || [];
          console.log("dataArray:", dataArray);
          
          const options = (Array.isArray(dataArray) ? dataArray : []).map((item) => ({
            id: item.id,
            title: item.name || item.title,
          }));
          console.log("RETRIEVE_OPTIONS mapped:", options);
          
          this.setState({ RETRIEVE_OPTIONS: options });
        }).catch((error) => {
          console.error("Error fetching retrieve options:", error);
        });
      } else {
        console.log("fieldId or productId is missing, cannot fetch retrieve options");
      }

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
    const { dataInsert, filter } = this.state;

    const name = (dataInsert.name || "").trim();
    if (!name) {
      toast.error("Tên kê khai không được bỏ trống");
      return;
    }

    // Prepare payload for API
    const payload = {
      fieldID: filter.filter || "",
      productID: filter.product || "",
      informID: dataInsert.retrieveId || "",
      name: name,
      sortOrder: Number(dataInsert.order) || 0,
      isChecked: false,
      isShow: false,
    };

    // Call API
    callApi("post", "informationaccess/create", payload)
      .then((res) => {
        if (res.status === 200 || (res.data && res.data.status === 200)) {
          toast.success("Thêm mới thành công!");

          // Refresh data
          this.fetchSummary();

          // Close modal
          if (toggleModal) {
            toggleModal();
          }
        } else {
          const message = (res.data && res.data.message) || "Thêm mới thất bại";
          toast.error(message);
        }
      })
      .catch((error) => {
        console.error("Error creating information access:", error);
        const message = (error.response && error.response.data && error.response.data.message) || "Thêm mới thất bại";
        toast.error(message);
      });
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

  handleSelectItem = (id) => {
    this.setState((prevState) => {
      const { selectedItems } = prevState;
      const exists = selectedItems.includes(id);
      const newSelected = exists
        ? selectedItems.filter((itemId) => itemId !== id)
        : [...selectedItems, id];
      return { selectedItems: newSelected, selectAll: newSelected.length === prevState.data.length };
    });
  };

  handleSelectAll = () => {
    this.setState((prevState) => {
      const { selectAll, data } = prevState;
      if (selectAll) {
        return { selectAll: false, selectedItems: [] };
      } else {
        return { selectAll: true, selectedItems: data.map((item) => item.id) };
      }
    });
  };

  onEditData = (id) => () => {
    this.setState((previousState) => {
      return {
        isShowForEdit: true,
      };
    });
  };

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
    this.props.deletePlantingZone({ id: this.state.deleteId }).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          warningPopupModal: false,
        };
      });

      const data = res.data;

      if (data.status == 200) {
        this.fetchSummary(
          JSON.stringify({
            search: "",
            filter: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );

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

  handleClickStatus = (item, type) => {
    alert(`Đã thao tác ${type} cho STT: ${item.stt}`);
  };

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList, selectedItems } = this.state;
    let list = [];
    let parentid = [];
    let autoIndex = 0;

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach((e) => parentid.push(e.id));

    const cb = (e, key, array) => {
      const renderClass =
        e.parentID.length === 0
          ? `${classes.treeParent}`
          : `${classes.treeChild}${
              parentid.includes(e.parentID)
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
        >
          <td style={{ textAlign: "center", width: "40px" }}>
            <input
              type="checkbox"
              checked={selectedItems.includes(e.id)}
              onChange={() => this.handleSelectItem(e.id)}
            />
          </td>
          <td
            className={`className='table-scale-col table-user-col-1' ${renderClass}`}
          >
            {autoIndex + 1}
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.retrieve}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.title}</span>
          </td>
          <td
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => this.handleClickStatus(e, "loggingStatus")}
          >
            <span
              className={
                e.loggingStatus ? "badge badge-success" : "badge badge-danger"
              }
              style={{ minWidth: "50px" }}
            >
              {e.loggingStatus ? "Đã Ghi" : "Chưa Ghi"}
            </span>
          </td>
          <td
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => this.handleClickStatus(e, "qrStatus")}
          >
            <span
              className={
                e.qrStatus ? "badge badge-success" : "badge badge-danger"
              }
              style={{ minWidth: "50px" }}
            >
              {e.qrStatus ? "Đã Quét" : "Chưa Quét"}
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
      RETRIEVE_OPTIONS,
      PRODUCT_OPTIONS,
      PLANTINGZONE_OPTIONS,
      LOGGING_OPTIONS,
      LOGGING_DATA_TYPES,
      REFERENCE_LIST,
      selectedItems,
      selectAll,
    } = this.state;

    const statusPopup = { status: status, message: message };
    let isDisableAdd = false;
    let isDisableEdit = false;
    let isDisableDelete = false;
    let ACCOUNT_CLAIM_FF = [];
    if (!JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      ACCOUNT_CLAIM_FF = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "")
        .split(",")
        .filter((x) => x != "");
      if (
        ACCOUNT_CLAIM_FF.length > 0 &&
        !ACCOUNT_CLAIM_FF.find((x) => x === "DeclarationInformations.Add")
      ) {
        isDisableAdd = true;
      }
      if (
        ACCOUNT_CLAIM_FF.length > 0 &&
        !ACCOUNT_CLAIM_FF.find((x) => x === "DeclarationInformations.Edit")
      ) {
        isDisableEdit = true;
      }
      if (
        ACCOUNT_CLAIM_FF.length > 0 &&
        !ACCOUNT_CLAIM_FF.find((x) => x === "DeclarationInformations.Delete")
      ) {
        isDisableDelete = true;
      }
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
                        <InsertOrUpdate
                          id={editId}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          STATUS_OPTIONS={STATUS_OPTIONS}
                          JOB_OPTIONS={JOB_OPTIONS}
                          RETRIEVE_OPTIONS={RETRIEVE_OPTIONS}
                          PRODUCT_OPTIONS={PRODUCT_OPTIONS}
                          PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                          LOGGING_DATA_TYPES={LOGGING_DATA_TYPES}
                          REFERENCE_LIST={REFERENCE_LIST}
                        />
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
                                  name="product"
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
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col" style={{ textAlign: "center", width: "40px" }}>
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={this.handleSelectAll}
                                title="Chọn tất cả"
                              />
                            </th>
                            {headerTitle.map((item, key) => (
                              <th
                                scope="col"
                                key={key}
                                style={{ whiteSpace: "normal" }}
                                className={`${key === 0 ? "table-scale-col table-user-col-1" : ""} font-bold font-size-15px`}
                              >
                                {item}
                              </th>
                            ))}
                            <th scope="col" className="font-bold font-size-15px"></th>
                          </tr>
                        </thead>
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
  DeclarationInformations
);
