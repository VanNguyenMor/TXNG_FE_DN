import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import {
  MATERIAL_MANAGEMENT,
  PRODUCT_MANAGEMENT,
} from "../../../helpers/constant";
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
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import ShowHistoryData from "./ShowHistoryData.js";
import ShowEditData from "./ShowEditData.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class MaterialManagement extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        img: "",
        title: "Dép Crosss",
        tradeName: "Dép Crosss 2",
        materialGroupId: "Nhóm 2",
        unit: "Kg",
        status: 1,
        typeId: 1,
        authentic: 1,
      },
      {
        id: 2,
        img: "",
        title: "Sứ Emax",
        tradeName: "Dép Crosss 2",
        materialGroupId: "Nhóm 3",
        unit: "Kg",
        status: 1,
        typeId: 2,
        authentic: 0,
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
      tableTitle: "",
      history: [],
      roles: [],
      zones: [],
      editStatus: true,
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: MATERIAL_MANAGEMENT,
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
      isShowForHistoryList: false,
      isShowForDetail: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      warningBlockProductModal: false,
      blockProductId: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Chưa khóa" },
        { id: 1, title: "Đã khóa" },
      ],
      AUTHENTIC_OPTIONS: [
        { id: 0, title: "Chưa xác thực" },
        { id: 1, title: "Đã xác thực" },
      ],
      HISTORY_DATA: [
        {
          time: "15:02",
          date: "02/10/2025",
          action: "Xuất kho để sử dụng ghi nhật ký",
          details: {
            "Số lượng": "20 Đôi",
            "Kho hàng": "Kho hàng 1",
            "Người thực hiện": "Công ty Việt Mỹ",
          },
        },
        {
          time: "14:32",
          date: "24/09/2025",
          action: "Lưu kho từ nhật ký: TGI02001587000000012",
          details: {
            "Số lô": "Test24092025",
            "Số lượng": "30.00 Đôi",
            "Kho hàng": "Kho hàng 1",
            "Người xuất kho": "Công ty Việt Mỹ",
          },
        },
      ],
      MATERIAL_TYPE_DATA: [
        {
          id: 1,
          title: "Loại thông thường",
        },
        {
          id: 2,
          title: "Loại đặc biệt",
        },
      ],
      MATERIAL_GROUP_DATA: [
        {
          id: 1,
          title: "Bugi",
          unit: "cái (pcs)",
        },
        {
          id: 2,
          title: "Bao bì",
          unit: "kg",
        },
      ],
      UNITS_DATA: [
        { id: 1, title: "Cái" },
        { id: 2, title: "Đôi" },
        { id: 3, title: "Thùng" },
        { id: 4, title: "Hộp" },
        { id: 5, title: "Bộ" },
      ],
      ORIGIN_DATA: [
        { id: 1, title: "Việt Nam" },
        { id: 2, title: "Trung Quốc" },
        { id: 3, title: "Hàn Quốc" },
        { id: 4, title: "Nhật Bản" },
        { id: 5, title: "Thái Lan" },
        { id: 6, title: "Mỹ" },
        { id: 7, title: "EU" },
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

  fetchSummary = (data) => {
    const { getListPlantingZone } = this.props;

    this.setState({ isLoaded: true });

    getListPlantingZone(data).then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const data = (res.data || {}).data || {};

      let newData = [...this.state.data];

      newData.forEach((item, key) => {
        collapseList.push({ id: item.id, collapse: false });
        item["parentID"] = item.parentID === null ? "" : item.parentID;
      });

      newData = handleGenTree(newData, "name");

      newData.forEach((item, key) => {
        item["index"] = key + 1;
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
    const { fromDate, toDate, filter } = this.state;
    this.fetchSummary(
      JSON.stringify({
        search: "",
        filter,
        fromDate,
        toDate,
        orderBy: "",
        page: null,
        limit: null,
      })
    );
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

  onShowHistoryModal = (e) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForHistoryList: true,
        editId: e.id,
        tableTitle: "NGUYÊN VẬT LIỆU",
        currentHistoryData: this.state.HISTORY_DATA,
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
  showTitleWithAuthentic = (id) => {
    const { AUTHENTIC_OPTIONS } = this.state;

    let queue = AUTHENTIC_OPTIONS ? [...AUTHENTIC_OPTIONS] : [];

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
  showTitleWithType = (id) => {
    const { MATERIAL_TYPE_DATA } = this.state;

    let queue = MATERIAL_TYPE_DATA ? [...MATERIAL_TYPE_DATA] : [];

    while (queue.length > 0) {
      const type = queue.shift();

      if (type && type.id === id) {
        return type.title;
      }

      if (type && type.children && type.children.length > 0) {
        queue.push(...type.children);
      }
    }

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
            <img
              style={{ width: 82, height: 82 }}
              src={e.icon ? e.icon : NoImg}
              alt="..."
            />
          </td>
          <td className="table-scale-col" style={{ textAlign: "left" }}>
            <span style={{ color: `${e.color}`, fontSize: "14px" }}>
              Tên nguyên vật liệu: {e.title}
            </span>
            <br></br>
            <span style={{ color: `${e.color}`, fontSize: "14px" }}>
              Tên thương phẩm: {e.tradeName}
            </span>
            <br></br>
            <span style={{ color: `${e.color}`, fontSize: "14px" }}>
              Thuộc nhóm: {e.materialGroupId}
            </span>
            <br></br>
            <span style={{ color: `${e.color}`, fontSize: "14px" }}>
              Đơn vị tính: {e.unit}
            </span>
          </td>

          <td className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {this.showTitleWithStatus(e.status)}
            </span>
          </td>
          <td className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {this.showTitleWithAuthentic(e.authentic)}
            </span>
          </td>
          <td className="table-scale-col" style={{ textAlign: "left" }}>
            <span style={{ color: `${e.color}`, fontSize: "14px" }}>
              {this.showTitleWithType(e.typeId)}
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
                          <DropdownItem onClick={this.onShowDetail(e)}>
                            Xem chi tiết
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onShowHistoryModal(e)}>
                            Xem lịch sử
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem
                            onClick={this.onShowBlockProductModal(e)}
                          >
                            Khóa vật liệu
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

  handleBlockProduct = () => {
    const { blockProductId, blockProductTitle } = this.state;

    this.toggleBlockProductModal();

    console.log(`Đang tiến hành khóa nguyên vật liệu ID: ${blockProductId}`);
    alert(`Khóa nguyên vật liệu "${blockProductTitle}" thành công`);
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
      popupMessage,
      currentHistoryData,
      STATUS_OPTIONS,
      MATERIAL_GROUP_DATA,
      ORIGIN_DATA,
      UNITS_DATA,
      MATERIAL_TYPE_DATA,
      tableTitle,
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
                            limit: null
                          })
                        )
                      }
                      readOnly={isShowForHistoryList}
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      moduleTitle={
                        isShowForDetail
                          ? "Chi tiết nguyên vật liệu"
                          : isShowForHistoryList
                          ? "Lịch sử nguyên vật liệu"
                          : "Thêm mới nguyên vật liệu"
                      }
                      isReadOnly={isShowForHistoryList}
                      moduleBody={
                        <div>
                          {isShowForDetail ? (
                            <ShowEditData
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              isShowForDetail={isShowForDetail}
                              MATERIAL_GROUP_DATA={MATERIAL_GROUP_DATA}
                              ORIGIN_DATA={ORIGIN_DATA}
                              UNITS_DATA={UNITS_DATA}
                              MATERIAL_TYPE_DATA={MATERIAL_TYPE_DATA}
                            />
                          ) : isShowForHistoryList ? (
                            <ShowHistoryData
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              historyData={currentHistoryData}
                              tableTitle={tableTitle}
                            />
                          ) : (
                            <ShowEditData
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              MATERIAL_GROUP_DATA={MATERIAL_GROUP_DATA}
                              ORIGIN_DATA={ORIGIN_DATA}
                              UNITS_DATA={UNITS_DATA}
                              MATERIAL_TYPE_DATA={MATERIAL_TYPE_DATA}
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

            <WarningPopup
              moduleTitle="Xác nhận Khóa nguyên vật liệu"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn có chắc chắn muốn **Khóa nguyên vật liệu:{" "}
                  {this.state.blockProductTitle}** không?
                </p>
              }
              warningPopupModal={this.state.warningBlockProductModal}
              toggleModal={this.toggleBlockProductModal}
              handleWarning={this.handleBlockProduct}
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
  MaterialManagement
);
