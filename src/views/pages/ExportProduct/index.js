import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import {
  EXPORT_PRODUCT,
  IMPORT_EXPORT_PRODUCT_STATUS,
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
import Select from "../../../components/Select";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDatetime from "react-datetime";

import { fetchData } from "helpers/fetchData";
import moment from "moment";

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
import CreateTransportTicketModal from "./CreateTransportTicketModal.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";

// Trạng thái phiếu xuất (đồng bộ mobile): 0..4
const GD_STATUS = [
  { id: 0, name: "Mới tạo", color: "#7F7F7F" },
  { id: 1, name: "Chờ duyệt", color: "#1B11DE" },
  { id: 2, name: "Đã duyệt", color: "#00B050" },
  { id: 3, name: "Không duyệt", color: "#F00000" },
  { id: 4, name: "Chờ duyệt lại", color: "#00B0F0" },
];

class ExportProduct extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        receiptNumber: "N001",
        creationDate: "2025-11-17",
        customer: "Khách hàng A",
        importer: "Nguyễn A",
        status: 1,
      },
      {
        id: 2,
        receiptNumber: "N002",
        creationDate: "2025-11-16",
        customer: "Khách hàng B",
        importer: "Trần B",
        status: 1,
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
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: EXPORT_PRODUCT,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        FromDate: "2025-01-01",
        ToDate: "2025-12-31",
        Status: 1,
        Page: 1,
        Limit: 20,
      },
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      // Tạo vận đơn
      transportTicketModal: false,
      transportTicketItem: null,
      STATUS_OPTIONS: GD_STATUS,
      SUPPLIER_LIST: [
        { id: 1, name: "Khách hàng A" },
        { id: 2, name: "Khách hàng B" },
      ],
      INGREDIENT_LIST: [
        {
          id: 1,
          name: "Lô hàng A",
          unit: 1,
          quantity: 20,
          warehouseId: 1,
        },
        {
          id: 2,
          name: "Lô hàng B",
          unit: 1,
          quantity: 1,
          warehouseId: 2,
        },
      ],
      PRODUCT_LIST: [
        { id: 1, name: "Sản phẩm A" },
        { id: 2, name: "Sản phẩm B" },
      ],
      WAREHOUSE_LIST: [
        { id: 1, name: "Kho hàng A" },
        { id: 2, name: "Kho hàng B" },
      ],
      UNIT_LIST: [
        { id: 1, name: "Cái" },
        { id: 2, name: "Chiếc" },
      ],
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
    this.fetchSummary(this.state.filter);

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
    const { getListGoodDeliveryNote } = this.props;

    this.setState({ isLoaded: true });

    // Truyền payload trực tiếp thay vì JSON.stringify
    getListGoodDeliveryNote(data).then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const responseData = (res.data || {}).data || {};

      // Lấy danh sách goods delivery notes từ response
      let goodsDeliveryNotes = responseData.goodsDeliveryNotes || responseData.goodsDelivery || [];
      
      // Map dữ liệu thành format phù hợp với table
      let newData = goodsDeliveryNotes.map((item, index) => ({
        id: item.id,
        receiptNumber: item.giCode || item.grCode || item.code || `GDN${index + 1}`,
        creationDate: item.giTime
          ? moment(item.giTime).format("DD/MM/YYYY HH:mm")
          : item.grTime || item.createdDate,
        supplier: item.partnerName || item.supplier || "",
        importer: item.confirmedByName || item.importer || "",
        status: item.status != null ? item.status : 0,
        giType: item.giType,
        traceInformID: item.traceInformID,
        // Thêm các field khác nếu cần
      }));

      newData.forEach((item, key) => {
        collapseList.push({ id: item.id, collapse: false });
        item["parentID"] = item.parentID === null ? "" : item.parentID;
      });

      // Nếu không phải tree structure, bỏ handleGenTree
      // newData = handleGenTree(newData, "name");

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
    const receiptNumber = dataInsert.receiptNumber;

    const errorInserts = {};

    if (!receiptNumber) {
      errorInserts.receiptNumber = "Số phiếu không được bỏ trống";
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

  onEditData = (id) => async () => {
    if (!id) return;

    this.setState({ isLoaded: true });

    try {
      // Gọi API goodsdeliverynote/get để lấy dữ liệu chi tiết
      const detailResponse = await fetchData.goodDelivery.getDetail(id);

      if (detailResponse) {
        const detailData = detailResponse.goodsDelivery || detailResponse;

        // Map dữ liệu vào initialData theo response goodsdeliverynote/get
        const initialData = {
          id: id,
          receiptNumber: detailData.giCode || detailData.code || "",
          creationDate: detailData.giTime ? moment(detailData.giTime).toDate() : new Date(),
          supplier: detailData.partnerName || detailData.supplier || "",
          importer: detailData.confirmedByName || detailData.importer || "",
          note: detailData.note || "",
          status: detailData.status || 0,
          // Thêm các field khác nếu cần
        };

        this.setState(
          {
            isShowForEdit: true,
            editId: id,
            dataInsert: initialData,
            isLoaded: false,
          },
          () => {}
        );
      } else {
        toast.error("Không tải được dữ liệu chi tiết!");
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      this.setState({ isLoaded: false });
    }
  };

  onDeleteData = (id) => () => {
    this.setState({ deleteId: id, warningPopupModal: true });
  };

  // Mở modal tạo vận đơn cho phiếu xuất đã duyệt (status = 2)
  onCreateTransportTicket = (item) => () => {
    this.setState({ transportTicketItem: item, transportTicketModal: true });
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
    const { deleteId } = this.state;
    this.setState({ warningPopupModal: false });

    fetchData.goodDelivery
      .delete(deleteId)
      .then((res) => {
        if (res && res.status === 200) {
          this.fetchSummary(this.state.filter);
          toast.success("Xoá phiếu xuất thành công!");
        } else {
          this.setState({ message: getErrorMessageServer(res) || "Xóa phiếu xuất thất bại" });
          this.toggleModal("popupMessage");
        }
      })
      .catch((err) => {
        this.setState({ message: getErrorMessageServer(err) || "Xóa phiếu xuất thất bại" });
        this.toggleModal("popupMessage");
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
            <span style={{ color: `${e.color}` }}>{e.receiptNumber}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.creationDate}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span>{e.supplier}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            {(() => {
              const st = GD_STATUS.find((s) => s.id === e.status);
              return <span style={{ color: st ? st.color : "#000" }}>{st ? st.name : ""}</span>;
            })()}
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
                        {e.status === 2 ? (
                          <DropdownItem onClick={this.onCreateTransportTicket(e)}>
                            Tạo vận đơn
                          </DropdownItem>
                        ) : null}
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
      errorInserts,
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      listLength,
      totalPage,
      totalElement,
      fromDate,
      toDate,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      STATUS_OPTIONS,
      SUPPLIER_LIST,
      INGREDIENT_LIST,
      PRODUCT_LIST,
      WAREHOUSE_LIST,
      UNIT_LIST,
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
      ACCOUNT_CLAIM_FF.filter((x) => x == "ExportProducts.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "ExportProducts.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "ExportProducts.Delete").map(
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
                        isShowForEdit ? "Sửa phiếu xuất" : "Thêm phiếu xuất"
                      }
                      moduleBody={
                        <InsertOrUpdate
                          id={editId}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          STATUS_OPTIONS={STATUS_OPTIONS}
                          SUPPLIER_LIST={SUPPLIER_LIST}
                          INGREDIENT_LIST={INGREDIENT_LIST}
                          PRODUCT_LIST={PRODUCT_LIST}
                          WAREHOUSE_LIST={WAREHOUSE_LIST}
                          UNIT_LIST={UNIT_LIST}
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
                                Trạng thái
                              </label>
                              <div>
                                <Select
                                  name="filter"
                                  title="Lọc theo trạng thái"
                                  data={STATUS_OPTIONS}
                                  labelName="name"
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
                <InsertOrUpdate
                  id={editId}
                  errors={errorInserts}
                  onHandleChangeValue={this.onHandleChangeValue}
                  STATUS_OPTIONS={STATUS_OPTIONS}
                  SUPPLIER_LIST={SUPPLIER_LIST}
                  INGREDIENT_LIST={INGREDIENT_LIST}
                  PRODUCT_LIST={PRODUCT_LIST}
                  WAREHOUSE_LIST={WAREHOUSE_LIST}
                  UNIT_LIST={UNIT_LIST}
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

            {this.state.transportTicketModal && (
              <CreateTransportTicketModal
                isOpen={this.state.transportTicketModal}
                goodDelivery={this.state.transportTicketItem}
                onClose={() => this.setState({ transportTicketModal: false, transportTicketItem: null })}
                onSuccess={() => this.fetchSummary(this.state.filter)}
              />
            )}

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
  ExportProduct
);
