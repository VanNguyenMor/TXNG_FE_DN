import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { INVENTORY_MANAGEMENT } from "../../../helpers/constant";
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
import PopupMessage from "../../../components/PopupMessage";
import { handleGenTree } from "../../../helpers/trees";
import Select from "../../../components/Select";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDatetime from "react-datetime";

import { fetchData } from "helpers/fetchData";

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

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class InventoryManagement extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        warehouse: "Kho hàng 1",
        itemName: "Dép Cross",
        unit: "kg",
        beginningBalance: 10,
        inPeriod: 0,
        endingBalance: 10,
      },
      {
        id: 2,
        warehouse: "Kho hàng 1",
        itemName: "Giày công sở",
        unit: "kg",
        beginningBalance: 10500000,
        inPeriod: 0,
        endingBalance: 10,
      },
      {
        id: 3,
        warehouse: "Kho hàng 1",
        itemName: "Giày lười",
        unit: "kg",
        beginningBalance: 10,
        inPeriod: 0,
        endingBalance: 10,
      },
    ];

    this.state = {
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
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: INVENTORY_MANAGEMENT,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        search: "",
        warehouseId: "",
        itemId: "",
        orderBy: "",
        page: null,
        limit: null,
        typeof: 1, // Mặc định chọn sản phẩm
      },
      selectedWarehouseId: null, // Biến tạm lưu warehouseId khi chọn
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      WAREHOUSE_OPTIONS: [
        {
          id: 1,
          title: "Kho hàng 1",
        },
        {
          id: 2,
          title: "Kho hàng 2",
        },
      ],
      TYPEOF_OPTIONS: [
        {
          id: 1,
          title: "Sản phẩm",
        },
        {
          id: 2,
          title: "Nguyên vật liệu",
        },
      ],
      PRODUCT_OPTIONS: [
        {
          id: 1,
          title: "Sản phẩm 1",
        },
        {
          id: 2,
          title: "Sản phẩm 2",
        },
      ],
      INGREDIENT_OPTIONS: [
        {
          id: 1,
          title: "Nguyên liệu 1",
        },
        {
          id: 2,
          title: "Nguyên liệu 2",
        },
      ],
      LOGGING_DATA: [
        {
          stt: 1,
          thoiGian: "2023-11-20 08:00",
          loai: "Thiết kế tạo mẫu",
          soLuong: 50,
          dvt: "Sản phẩm",
          nguoiThucHien: "Nguyễn Văn A",
        },
        {
          stt: 2,
          thoiGian: "2023-11-20 09:30",
          loai: "Chọn nguyên liệu",
          soLuong: 100,
          dvt: "kg",
          nguoiThucHien: "Trần Thị B",
        },
      ],
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
    this.fetchSummary({
      search: "",
      warehouseId: "",
      itemId: "",
      orderBy: "",
      page: null,
      limit: null,
    });

    // Fetch warehouse options
    fetchData.warehouse.getListComboBox({}).then(res => {
      const options = (res || []).map(item => ({ id: item.id, title: item.name || item.title || item.warehouseName }));
      this.setState({ WAREHOUSE_OPTIONS: options });
    });

    // Fetch product options
    fetchData.product.getListComboBox({}).then(res => {
      const options = (res || []).map(item => ({ id: item.id, title: item.name || item.title || item.productName }));
      this.setState({ PRODUCT_OPTIONS: options });
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
  }

  fetchSummary = (params) => {
    const { getListPlantingZone } = this.props;
    const { filter } = this.state;

    this.setState({ isLoaded: true });

    // Chuẩn bị params cho API
    const apiParams = {
      page: params.page || filter.page || 1,
      limit: params.limit || filter.limit || 10,
      fromDate: params.fromDate || this.state.fromDate,
      toDate: params.toDate || this.state.toDate,
    };

    // Chỉ thêm warehouseId nếu có giá trị
    const warehouseId = params.warehouseId || filter.warehouseId;
    if (warehouseId !== undefined && warehouseId !== null && warehouseId !== "") {
      apiParams.warehouseId = warehouseId;
    }

    // Chỉ thêm productId/materialId nếu có giá trị
    const itemId = params.itemId || filter.itemId;
    if (itemId !== undefined && itemId !== null && itemId !== "") {
      apiParams[filter.typeof === 1 ? 'productId' : 'materialId'] = itemId;
    }

    // Kiểm tra typeof để gọi API tương ứng
    let apiCall;
    if (filter.typeof === 1) {
      // Sản phẩm
      apiCall = fetchData.report.getListReportInventoryWarehouseProductV2(apiParams);
    } else if (filter.typeof === 2) {
      // Nguyên vật liệu
      apiCall = fetchData.report.getListReportInventoryWarehouseMaterialV2(apiParams);
    } else {
      // Mặc định gọi API sản phẩm nếu typeof không hợp lệ
      apiCall = fetchData.report.getListReportInventoryWarehouseProductV2(apiParams);
    }

    apiCall.then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const responseData = (res.data || {}).data || {};

      // Xử lý dữ liệu theo API được gọi
      let newData;
      if (filter.typeof === 1 || filter.typeof === 2) {
        // Xử lý response từ report APIs
        const inventoryData = responseData.inventoryItems || responseData.items || [];
        newData = inventoryData.map((item, index) => ({
          id: item.id || index + 1,
          warehouse: item.warehouseName || item.warehouse || "",
          itemName: item.productName || item.materialName || item.itemName || "",
          unit: item.unitName || item.unit || "",
          beginningBalance: item.beginningBalance || item.openingBalance || 0,
          inPeriod: item.inPeriod || item.receipt || 0,
          endingBalance: item.endingBalance || item.closingBalance || 0,
        }));
      } else {
        // Xử lý dữ liệu planting zone (giữ nguyên logic cũ)
        newData = [...this.state.data];
        newData.forEach((item, key) => {
          collapseList.push({ id: item.id, collapse: false });
          item["parentID"] = item.parentID === null ? "" : item.parentID;
        });
        newData = handleGenTree(newData, "name");
      }

      newData.forEach((item, key) => {
        item["index"] = key + 1;
      });

      const total = newData.length | 0;
      const length = newData.length;

      this.setState({
        data: newData,
        listLength: total,
        totalPage: Math.ceil(length / limit),
        totalElement: Math.min(limit, length),
        // Reset phân trang về trang đầu mỗi lần nạp lại để không rơi vào trang trống
        beginItem: 0,
        endItem: limit,
        currentPage: 0,
        isLoaded: false,
        collapseList: collapseList,
      });
    }).catch((error) => {
      console.error("Error fetching data:", error);
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

  clearFilter = () => {
    let clearFilter = {
      search: "",
      warehouseId: "",
      itemId: "",
      orderBy: "",
      page: null,
      limit: null,
      typeof: 1,
    };
    this.setState({ filter: clearFilter, selectedWarehouseId: null });
  };

  handleChangeSelectFilter = (value, name) => {
    console.log("name", name, "value", value, "type", typeof value);
    if (name === "warehouseId") {
      // Lưu vào biến tạm selectedWarehouseId, đảm bảo là number hoặc null
      const parsedValue = value && !isNaN(parseInt(value)) ? parseInt(value) : null;
      this.setState({ selectedWarehouseId: parsedValue });
    } else if (name === "typeof") {
      // Khi chọn loại, cập nhật options cho combobox sản phẩm/nguyên liệu
      const parsedValue = value && !isNaN(parseInt(value)) ? parseInt(value) : null;
      let { filter } = this.state;
      filter[name] = parsedValue;
      this.setState({ filter });

      // Fetch options dựa trên loại
      if (parsedValue === 1) {
        // Sản phẩm
        fetchData.product.getListComboBox({}).then(res => {
          const options = (res || []).map(item => ({ id: item.id, title: item.name || item.title || item.productName }));
          this.setState({ PRODUCT_OPTIONS: options });
        });
      } else if (parsedValue === 2) {
        // Nguyên vật liệu
        fetchData.material.getListComboBox({}).then(res => {
          const options = (res || []).map(item => ({ id: item.id, title: item.name || item.title || item.materialName }));
          this.setState({ PRODUCT_OPTIONS: options });
        });
      }
    } else if (name === "itemId") {
      // Giữ nguyên value là string cho itemId
      let { filter } = this.state;
      filter[name] = value;
      this.setState({ filter });
    } else {
      let { filter } = this.state;
      filter[name] = parseInt(value); // Đảm bảo value là number cho các trường khác
      this.setState({ filter });
    }
  };

  handleSubmitSearchForm = () => {
    const { fromDate, toDate, filter, selectedWarehouseId } = this.state;
    console.log("kho", selectedWarehouseId);
    this.fetchSummary({
      search: "",
      warehouseId: selectedWarehouseId,
      itemId: filter.itemId,
      fromDate,
      toDate,
      orderBy: "",
      page: null,
      limit: null,
    });
  };

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
    } else {
      openModal();
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: false,
        editId: null,
      };
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
    const warehouse = dataInsert.warehouse;

    const errorInserts = {};

    if (!warehouse) {
      errorInserts.warehouse = "Số phiếu không được bỏ trống";
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
          {
            search: "",
            warehouseId: "",
            itemId: "",
            orderBy: "",
            page: null,
            limit: null,
          }
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
    if (this.state[state] && type == 1) {
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

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let parentid = [];
    // STT chạy liên tục giữa các trang -> bắt đầu từ beginItem
    let autoIndex = beginItem;

    // Chỉ render dữ liệu của trang hiện tại (phân trang thực sự)
    const pageData = data.filter((item, key) => key >= beginItem && key < endItem);
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
          <td
            className={`className='table-scale-col table-user-col-1' ${renderClass}`}
          >
            {autoIndex + 1}
          </td>
          <td className="table-scale-col">
            <span style={{ color: `${e.color}` }}>{e.warehouse}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.itemName}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.unit}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.beginningBalance}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.inPeriod}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.endingBalance}</span>
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
                            Xem chi tiết
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

    pageData.forEach(cb);
    return list;
  };

  render() {
    const {
      warningPopupModal,
      editId,
      isShowForEdit,
      errorInserts,
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      listLength,
      totalPage,
      totalElement,
      currentPage,
      fromDate,
      toDate,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      WAREHOUSE_OPTIONS,
      TYPEOF_OPTIONS,
      PRODUCT_OPTIONS,
      LOGGING_DATA,
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
                        this.fetchSummary({
                          search: "",
                          warehouseId: "",
                          itemId: "",
                          orderBy: "",
                          page: null,
                          limit: null,
                        })
                      }
                      hideSearch={true}
                      hideCreate={true}
                      moduleTitle={isShowForEdit ? "Báo cáo tồn kho" : ""}
                      isReadOnly={true}
                      moduleBody={
                        <InsertOrUpdate
                          id={editId}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          LOGGING_DATA={LOGGING_DATA}
                        />
                      }
                      isShowForEdit={isShowForEdit}
                      handleModal={this.handleModal}
                      onConfirm={this.onConfirm}
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
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
                                Kho hàng
                              </label>
                              <div>
                                <Select
                                  name="warehouseId"
                                  title="Lọc theo kho hàng"
                                  data={WAREHOUSE_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Loại (SP/NVL)
                              </label>
                              <div>
                                <Select
                                  name="typeof"
                                  title="Lọc theo loại"
                                  data={TYPEOF_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Nguyên liệu/sản phẩm
                              </label>
                              <div>
                                <Select
                                  name="itemId"
                                  title="Lọc theo nguyên liệu/sản phẩm"
                                  data={PRODUCT_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
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
                          currentPage={currentPage > 0 ? currentPage - 1 : 0}
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
                <InsertOrUpdate
                  id={editId}
                  errors={errorInserts}
                  onHandleChangeValue={this.onHandleChangeValue}
                  LOGGING_DATA={LOGGING_DATA}
                />
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
  InventoryManagement
);
