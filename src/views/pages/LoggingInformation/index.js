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

    this.state = {
      viewModal: false,
      dataTrace: {},
      dataTraceInforms: [],
      currentViewItem: null,
      // Quyền đánh giá theo trace (thông tin truy xuất của sản phẩm):
      // isEvalAdmin = admin được đánh giá tất cả; permissionTraces = danh sách quyền
      // theo từng hạng mục (informSelectID + isExecuted) trả về từ gettracerole.
      isEvalAdmin: false,
      permissionTraces: [],
      data: [],
      traceIdToOpen: null,
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
      // Bug #35 fix: store as Date objects so toISOString() works correctly
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      currentPage: 0,
      filter: {
        search: "",
        filter: "",
        field: "",
        product: "",
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
      currentItem: null,
      // Bản ghi nhật ký được chọn để sao chép (mở form ghi nhật ký prefill sẵn)
      copyItem: null,
      warningPopupModal: false,
      lockWarningPopupModal: false,
      deleteId: null,
      lockId: null,
      popupMessage: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Kết thúc" },
        { id: 1, title: "Đang diễn ra" },
      ],
      JOB_OPTIONS: [],
      PRODUCT_OPTIONS: [],
      PLANTINGZONE_OPTIONS: [],
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
    const {
      requestGetListFieldComboBox,
      requestGetListFieldForAddComboBox,
      requestGetListProductForAddComboBox,
      requestGetListPlantingZoneForAddComboBox,
    } = this.props;

    const locationState = this.props.location && this.props.location.state;
    if (locationState && locationState.traceId) {
      this.setState({ traceIdToOpen: locationState.traceId });
    }

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
        limit: 10000,
        init: true
      })
    );

    // Bug #36 fix: fetch fields for search filter dropdown
    // Select dùng labelName="title"/val="id" nên phải map field (ID/FieldName) sang {id, title}
    requestGetListFieldComboBox({}).then((res) => {
      const fields = ((res.data || {}).data || {}).fields || [];
      const mapped = fields.map((f) => ({
        id: f.ID || f.id,
        title: f.FieldName || f.fieldName || f.title,
      }));
      this.setState((previousState) => {
        return {
          ...previousState,
          JOB_OPTIONS: mapped,
        };
      });
    });

    // Bug #36 fix: fetch fields for add-new form (different endpoint, dùng POST có body)
    requestGetListFieldForAddComboBox(
      JSON.stringify({ search: "", filter: "", orderBy: "", page: null, limit: null })
    ).then((res) => {
      const fields = ((res.data || {}).data || {}).fields || [];
      const mapped = fields.map((f) => ({
        id: f.ID || f.id,
        title: f.FieldName || f.fieldName || f.title,
      }));
      this.setState({ ADD_JOB_OPTIONS: mapped });
    });

    // Bug #36 fix: fetch products for add-new form
    // Product (id/productName) cũng phải map sang {id, title} cho Select
    requestGetListProductForAddComboBox().then((res) => {
      const products = ((res.data || {}).data || {}).products || [];
      const mapped = products.map((p) => ({
        id: p.id || p.ID,
        title: p.productName || p.ProductName || p.title,
      }));
      this.setState({ PRODUCT_OPTIONS: mapped });
    });

    // Bug #36 fix: fetch planting zones for add-new form
    requestGetListPlantingZoneForAddComboBox(
      JSON.stringify({ search: "", filter: "", orderBy: "", page: null, limit: null })
    ).then((res) => {
      const zones = ((res.data || {}).data || {}).plantingZones || [];
      const mapped = zones.map((z) => ({ id: z.id || z.ID, title: z.name || z.Name || z.title }));
      this.setState({ PLANTINGZONE_OPTIONS: mapped });
    });
  }

  fetchSummary = (data) => {
    const { requestListTrace } = this.props;

    this.setState({ isLoaded: true });

    requestListTrace(data).then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const resData = (res.data || {}).data || {};
      const traces = resData.traces || [];

      let newData = traces.map(item => ({
        ...item,
        id: item.ID,
        title: item.ProductName,
        code: item.NameCode,
        // list trả về tên vị trí ở PlantingZone, id thật ở PlantingZoneID
        plantingZoneId: item.PlantingZoneID,
        plantingZoneName: item.PlantingZone,
        icon: item.Avatar,
        status: item.IsCompleted,
      }));

      // Bug #35 fix: use total from API response, not items.length
      const total = resData.total || resData.totalRows || newData.length;

      newData.forEach((item) => {
        collapseList.push({ id: item.id, collapse: false });
      });

      this.setState(
        {
          data: newData,
          listLength: total,
          totalElement: Math.min(limit, total),
          totalPage: Math.ceil(total / limit),
          isLoaded: false,
          collapseList: collapseList,
          beginItem: 0,
          endItem: limit,
          currentPage: 0,
        },
        () => {
          const { traceIdToOpen } = this.state;
          if (traceIdToOpen) {
            const traceItem = newData.find(
              (item) => item.id === traceIdToOpen || item.ID === traceIdToOpen
            );
            if (traceItem) {
              this.setState({ traceIdToOpen: null });
              this.onHandleGet(traceItem);
            }
          }
        }
      );
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
      field: "",
      product: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    this.setState({ filter: clearFilter });
  };

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;

    // Khi đổi ngành nghề: nạp lại danh sách sản phẩm theo field (đối chiếu mobile getbytrace)
    if (name === "field") {
      filter.product = "";
      const { requestGetListProductComboBox } = this.props;
      if (requestGetListProductComboBox && value) {
        requestGetListProductComboBox(value).then((res) => {
          const products = ((res.data || {}).data || {}).products || [];
          const mapped = products.map((p) => ({
            id: p.id || p.ID,
            title: p.productName || p.ProductName || p.title || p.Name,
          }));
          this.setState({ PRODUCT_OPTIONS: mapped });
        });
      }
    }

    this.setState({ filter });
  };

  handleSubmitSearchForm = () => {
    const { fromDate, toDate, filter, limit } = this.state;

    // Bug #35 fix: convert fromDate/toDate properly to ISO strings
    let startDateISO = null;
    let endDateISO = null;

    if (fromDate) {
      // fromDate can be a moment object or a Date object
      if (fromDate && typeof fromDate.toISOString === "function") {
        startDateISO = fromDate.toISOString();
      } else if (fromDate && typeof fromDate.toDate === "function") {
        startDateISO = fromDate.toDate().toISOString();
      } else {
        startDateISO = new Date(fromDate).toISOString();
      }
    }

    if (toDate) {
      if (toDate && typeof toDate.toISOString === "function") {
        endDateISO = toDate.toISOString();
      } else if (toDate && typeof toDate.toDate === "function") {
        endDateISO = toDate.toDate().toISOString();
      } else {
        endDateISO = new Date(toDate).toISOString();
      }
    }

    this.fetchSummary(
      JSON.stringify({
        startDate: startDateISO,
        endDate: endDateISO,
        status: null,
        field: filter.field || "",
        product: filter.product || "",
        orderBy: "",
        page: 0,
        limit: 10000,
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
      currentItem: null,
      copyItem: null,
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
    const { dataInsert } = this.state;
    const errorInserts = {};

    if (!dataInsert.jobId) {
      errorInserts.jobId = "Ngành nghề không được bỏ trống";
    }

    return errorInserts;
  };

  // Bug #37/38 fix: actually call the create API instead of alerting
  onConfirm = (toggleModal, closePopup) => {
    // Chế độ "Ghi nhật ký" dùng luồng riêng (writeTrace), không tạo trace mới
    if (this.state.isShowForWrite) {
      if (this.writeLoggingRef && this.writeLoggingRef.handleSubmit) {
        this.writeLoggingRef.handleSubmit(toggleModal);
      }
      return;
    }

    const { dataInsert } = this.state;
    const { requestCreateTrace } = this.props;

    const errorInserts = this.checkDataInsert(true);

    if (Object.keys(errorInserts).length > 0) {
      this.setState({ errorInserts });
      return;
    }

    const payload = {
      fieldId: dataInsert.jobId || null,
      productId: dataInsert.productId || null,
      plantingZoneId: dataInsert.zoneId || null,
    };

    requestCreateTrace(JSON.stringify(payload)).then((res) => {
      const data = res.data;

      if (data && data.status === 200) {
        toast.success("Thêm dữ liệu thành công!");
        this.handleSubmitSearchForm();
        if (toggleModal) {
          toggleModal();
        }
      } else {
        const message = getErrorMessageServer(res);
        this.setState({ message: message || "Thêm dữ liệu thất bại" });
        toast.error(message || "Thêm dữ liệu thất bại");
      }
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

  onEditData = (item) => () => {
    this.setState({
      isShowForEdit: true,
      editId: item.id || item.ID,
      currentItem: item,
    });
  };

  onHandleGet = (item) => {
    // Lưu lại item đang xem để refresh sau khi đánh giá/làm lại/xóa bản ghi
    this.setState({ currentViewItem: item });
    this.loadViewData(item);

    // Phân quyền đánh giá: admin luôn được; còn lại dựa vào gettracerole.
    // gettracerole trả về data.data = mảng quyền theo từng hạng mục nhật ký
    // (mỗi phần tử có informSelectID + isExecuted); được đánh giá hạng mục nào
    // khi tồn tại quyền khớp informSelectID và còn isExecuted = false.
    const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN") || "false");
    if (isAdmin) {
      this.setState({ isEvalAdmin: true, permissionTraces: [] });
    } else {
      const traceID = item.id || item.ID;
      const { requestGetTraceRole } = this.props;
      if (requestGetTraceRole) {
        requestGetTraceRole(traceID).then((res) => {
          const permissionTraces = ((res.data || {}).data || []);
          this.setState({
            isEvalAdmin: false,
            permissionTraces: Array.isArray(permissionTraces) ? permissionTraces : [],
          });
        });
      } else {
        this.setState({ isEvalAdmin: false, permissionTraces: [] });
      }
    }

    this.setState({ viewModal: true });
  }

  // Tải lại trace + lịch sử bản ghi (dùng cho refresh sau thao tác)
  loadViewData = (item) => {
    const { requestGetTrace, requestGetHistoryTrace } = this.props;
    const traceID = item.id || item.ID;
    const companyID = item.CompanyID || item.companyId;

    requestGetTrace(traceID + '&companyId=' + companyID).then(res => {
      if (res.data && res.data.status === 200) {
        this.setState({
          dataTrace: res.data.data.trace || {}
        });
      }
    });

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
  }

  refreshViewData = () => {
    if (this.state.currentViewItem) {
      this.loadViewData(this.state.currentViewItem);
    }
  }

  // Bug #39 fix: store the current item so DetailLogging can display it
  onShowDetail = (item) => () => {
    this.setState({
      isShowForDetail: true,
      editId: item.id || item.ID,
      currentItem: item,
    });
  };

  onShowWrite = (item) => () => {
    this.setState({
      isShowForWrite: true,
      editId: item.id || item.ID,
      currentItem: item,
      copyItem: null,
    });
  };

  // Sao chép một bản ghi nhật ký: đóng modal xem, mở form ghi nhật ký với dữ
  // liệu được chép sẵn từ bản ghi (đối chiếu app mobile - onCopyTrace/copyItem).
  onCopyTrace = (record) => {
    const trace = this.state.currentViewItem;
    if (!trace || !record) return;

    this.setState({
      viewModal: false,
      isShowForWrite: true,
      editId: trace.id || trace.ID,
      currentItem: trace,
      copyItem: record,
    });
  };

  onDeleteData = (id) => () => {
    this.setState({
      warningPopupModal: true,
      deleteId: id,
    });
  };

  // Bug #40: handler to show lock confirmation popup
  onLockData = (id) => (e) => {
    e.stopPropagation();
    this.setState({
      lockWarningPopupModal: true,
      lockId: id,
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

  // Bug #40: toggle lock popup
  toggleModalPopupLock = () => {
    this.setState({ lockWarningPopupModal: false });
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

  // Bug #40: lock row handler using requestCompletedTrace
  handleLockRow = () => {
    const { requestCompletedTrace } = this.props;
    const { lockId } = this.state;

    requestCompletedTrace(lockId).then((res) => {
      this.setState({ lockWarningPopupModal: false });

      const data = res.data;

      if (data && data.status === 200) {
        this.handleSubmitSearchForm();
        toast.success("Khoá nhật ký thành công!");
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Khoá nhật ký thất bại");
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
    let parentid = [];
    let autoIndex = beginItem;
    const pageData = data.filter((item, key) => key >= beginItem && key < endItem);

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
              {e.plantingZoneName || this.showTitleWithPlantingZoneId(e.plantingZoneId)}
            </span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {/* IsCompleted là boolean: true = Kết thúc, false = Đang diễn ra (đối chiếu mobile) */}
              {e.status ? "Kết thúc" : "Đang diễn ra"}
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
                      toggle={(ev) => { ev && ev.stopPropagation && ev.stopPropagation(); this.toggle(key, e.id); }}
                    >
                      <DropdownToggle onClick={(ev) => ev.stopPropagation()}>
                        <img src={MenuButton} />
                      </DropdownToggle>
                      <DropdownMenu>
                        {/* Bỏ "Sửa" trace: app mobile không có flow cập nhật trace
                            (chỉ tạo mới + ghi nhật ký) và backend không có endpoint update */}
                        {isDisableEdit == true ? null : (
                          // Bug #39 fix: pass item to onShowDetail
                          <DropdownItem onClick={(ev) => { ev.stopPropagation(); this.onShowDetail(e)(); }}>
                            Chi tiết
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={(ev) => { ev.stopPropagation(); this.onShowWrite(e)(); }}>
                            Ghi nhật ký
                          </DropdownItem>
                        )}
                        {/* Bug #40: Khoá nhật ký button */}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onLockData(e.id || e.ID)}>
                            Khoá nhật ký
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ||
                          isDisableDelete == true ? null : (
                          <DropdownItem divider />
                        )}
                        {isDisableDelete == true ? null : (
                          <DropdownItem onClick={(ev) => { ev.stopPropagation(); this.onDeleteData(e.id)(); }}>
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
      lockWarningPopupModal,
      editId,
      currentItem,
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
      ADD_JOB_OPTIONS,
      PRODUCT_OPTIONS,
      PLANTINGZONE_OPTIONS,
      LOGGING_OPTIONS,
      currentPage,
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
                            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
                            endDate: new Date().toISOString(),
                            status: null,
                            field: "",
                            product: "",
                            orderBy: "",
                            page: 0,
                            limit: 10000,
                            init: true
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
                            // Bug #39 fix: pass currentItem to DetailLogging
                            <DetailLogging
                              id={editId}
                              item={currentItem}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              STATUS_OPTIONS={STATUS_OPTIONS}
                              JOB_OPTIONS={ADD_JOB_OPTIONS || JOB_OPTIONS}
                              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
                              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                              requestGetHistoryTrace={this.props.requestGetHistoryTrace}
                            />
                          ) : isShowForWrite ? (
                            <WriteLogging
                              ref={(r) => (this.writeLoggingRef = r)}
                              id={editId}
                              item={currentItem}
                              copyItem={this.state.copyItem}
                              errors={errorInserts}
                              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
                              requestGetInformSelect={this.props.requestGetInformSelect}
                              requestGetPlanZoneByTrace={this.props.requestGetPlanZoneByTrace}
                              requestGetAttribute={this.props.requestGetAttribute}
                              requestWriteTrace={this.props.requestWriteTrace}
                              requestRDCustomerList={this.props.requestRDCustomerList}
                              requestRDProviderList={this.props.requestRDProviderList}
                              requestRDEmployeeList={this.props.requestRDEmployeeList}
                              requestRDMaterialList={this.props.requestRDMaterialList}
                              requestRDMaterialUnitList={this.props.requestRDMaterialUnitList}
                              requestRDWarehouseList={this.props.requestRDWarehouseList}
                              requestRDVehicleList={this.props.requestRDVehicleList}
                              requestRDFactoryList={this.props.requestRDFactoryList}
                              requestRDToolList={this.props.requestRDToolList}
                              requestRDTransportUnitList={this.props.requestRDTransportUnitList}
                              requestGetGoodReceipt={this.props.requestGetGoodReceipt}
                              requestGetDetailGoodReceipt={this.props.requestGetDetailGoodReceipt}
                              requestCheckInventoryMulti={this.props.requestCheckInventoryMulti}
                              requestGetInventoryByMaterial={this.props.requestGetInventoryByMaterial}
                              requestUploadTraceFile={this.props.requestUploadTraceFile}
                              requestCheckItemValid={this.props.requestCheckItemValid}
                              onWriteSuccess={() => this.handleSubmitSearchForm()}
                            />
                          ) : (
                            // Bug #37/38 fix: pass fetched dropdown data to InsertOrUpdate
                            <InsertOrUpdate
                              id={editId}
                              errors={errorInserts}
                              onHandleChangeValue={this.onHandleChangeValue}
                              STATUS_OPTIONS={STATUS_OPTIONS}
                              JOB_OPTIONS={ADD_JOB_OPTIONS || JOB_OPTIONS}
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
                                {/* Bug #35 fix: store moment object directly */}
                                <ReactDatetime
                                  inputProps={{
                                    placeholder: "dd/mm/yyyy",
                                    name: "fromDate",
                                  }}
                                  value={fromDate || ""}
                                  timeFormat={false}
                                  dateFormat="DD-MM-YYYY"
                                  onChange={(value) =>
                                    this.setState({ fromDate: value || null })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Đến ngày
                              </label>
                              <div>
                                {/* Bug #35 fix: store moment object directly */}
                                <ReactDatetime
                                  inputProps={{
                                    placeholder: "dd/mm/yyyy",
                                    name: "toDate",
                                  }}
                                  value={toDate || ""}
                                  timeFormat={false}
                                  dateFormat="DD-MM-YYYY"
                                  onChange={(value) =>
                                    this.setState({ toDate: value || null })
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
                                  name="field"
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
                      Array.isArray(data) && data.length > 0 && (
                        <Pagination
                          data={data}
                          listLength={listLength}
                          totalPage={totalPage}
                          totalElement={totalElement}
                          handlePageClick={this.handlePageClick}
                          currentPage={currentPage > 0 ? currentPage - 1 : 0}
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

            {/* Delete confirmation popup */}
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

            {/* Bug #40: Lock confirmation popup */}
            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý khoá nhật ký này?
                </p>
              }
              warningPopupModal={lockWarningPopupModal}
              toggleModal={this.toggleModalPopupLock}
              handleWarning={this.handleLockRow}
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
                  isEvalAdmin={this.state.isEvalAdmin}
                  permissionTraces={this.state.permissionTraces}
                  canCopy={!isDisableAdd}
                  onCopyTrace={this.onCopyTrace}
                  requestEvaluateDiary={this.props.requestEvaluateDiary}
                  requestMadeAgainDiary={this.props.requestMadeAgainDiary}
                  requestDeleteWriteTrace={this.props.requestDeleteWriteTrace}
                  onRefresh={this.refreshViewData}
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
