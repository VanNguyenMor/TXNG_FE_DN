import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import {
  DECLARATION_INFORMATION,
  LOGGING_INFORMATION,
  RETRIEVE_INFORMATION,
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
  Modal,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";
import PermissionModal from "./PermissionModal.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { fetchData } from "helpers/fetchData";
import { callApi } from "utils/fetchAllData";

class RetrieveInformation extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        retrieve: "Pha da (Vẽ mẫu trên da)",
        title: "Dùng da bò thật",
        loggingStatus: 1,
        qrStatus: 1,
        htFeedback: 1,
      },
      {
        id: 2,
        retrieve: "Cắt da theo khuôn đã pha",
        title: "Dùng kéo cắt da, kéo đã được vệ sinh sạch sẽ",
        loggingStatus: 1,
        qrStatus: 1,
        htFeedback: 1,
      },
    ];

    this.state = {
      data: dataMock,
      informSelects: [],
      informations: [],
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
      headerTitle: RETRIEVE_INFORMATION,
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
      editData: null,
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
        { id: 0, productName: "Sản phẩm 1" },
        { id: 1, productName: "Sản phẩm 2" },
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
      selectedItems: [],
      selectAll: false,
      // Phân quyền
      permissionModal: false,
      permissionItem: null,
      roleComboBoxs: [],
      traceRoles: [],
      // Sửa STT
      numberModal: false,
      numberItem: null,
      numberValue: "",
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
    this.fetchSummary();

    /* Danh sách nhóm quyền dùng cho phân quyền */
    callApi("post", "role/getall", { page: 0, limit: 100 })
      .then((res) => {
        const roles = (res.data && res.data.roles) || [];
        this.setState({ roleComboBoxs: roles });
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });

    // Fetch job/field options (ngành nghề công ty có quyền truy cập)
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

      // Chịu được cả key thường lẫn PascalCase (id/ID, fieldName/FieldName)
      const options = (dataArray || []).map((item) => ({
        id: item.id != null ? item.id : item.ID,
        title:
          item.name || item.title || item.fieldName || item.FieldName,
      }));

      this.setState({ JOB_OPTIONS: options });

      // Giống mobile setAccess: nếu chỉ có 1 ngành nghề thì tự chọn + nạp sản phẩm
      if (options.length === 1 && options[0].id != null) {
        const onlyFieldId = options[0].id;
        this.setState((prev) => ({
          filter: { ...prev.filter, filter: onlyFieldId, product: "" },
        }));
        this.fetchProductsByField(onlyFieldId);
      }
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
  }

  fetchSummary = () => {
    const { limit, currentPage, filter } = this.state;

    this.setState({ isLoaded: true });

    // Get fieldId and productId from filter
    const fieldId = filter.filter || "";
    const productId = filter.product || "";

    console.log("=== fetchSummary Debug ===");
    console.log("fieldId:", fieldId);
    console.log("productId:", productId);
    console.log("filter state:", filter);

    // Build API URL with parameters
    const apiEndpoint = `processaccess/getgridviewv2?fieldId=${fieldId}&productId=${productId}`;
    console.log("API Endpoint:", apiEndpoint);

    callApi("get", apiEndpoint).then((res) => {
      // Giữ nguyên dữ liệu gốc để áp dụng đúng nghiệp vụ như mobile (setAccess)
      const informSelects = (res.data && res.data.informSelects) || [];
      const informations = (res.data && res.data.informations) || [];

      const newData = this.buildData(informSelects);

      const collapseList = newData.map((item) => ({ id: item.id, collapse: false }));

      const total = newData.length | 0;
      const length = newData.length;

      this.setState({
        informSelects,
        informations,
        data: newData,
        listLength: total,
        totalPage: Math.ceil(length / limit),
        isLoaded: false,
        collapseList: collapseList,
        // Reset phân trang về trang đầu mỗi lần nạp lại để không rơi vào trang trống
        beginItem: 0,
        endItem: limit,
        currentPage: 0,
        totalElement: Math.min(limit, length),
      });
    }).catch((error) => {
      console.error("Error fetching grid view report:", error);
      this.setState({ isLoaded: false });
    });
  };

  // Dựng dữ liệu hiển thị từ informSelects gốc, vẫn giữ lại toàn bộ field gốc
  // (informID, isRequired, isGenerated, isEvaluated, sortOrder...) để xử lý nghiệp vụ.
  buildData = (informSelects) => {
    return (informSelects || []).map((item, key) => ({
      ...item,
      index: key + 1, // STT - tự động đếm
      retrieve: item.name, // TÊN TRUY XUẤT
      loggingStatus: item.isChecked ? 1 : 0, // NHẬT KÝ
      qrStatus: item.isShow ? 1 : 0, // QUÉT MÃ
      htFeedback: item.isShowEvaluated ? 1 : 0, // HT ĐÁNH GIÁ
      parentID: item.parentID === null || item.parentID === undefined ? "" : item.parentID,
      color: "#000",
    }));
  };

  // Bắt buộc chọn ngành nghề + sản phẩm trước khi thao tác (giống mobile)
  requireFieldProduct = () => {
    const { filter } = this.state;
    if (!filter.filter) {
      toast.error("Bạn vui lòng chọn ngành nghề");
      return false;
    }
    if (!filter.product) {
      toast.error("Bạn vui lòng chọn sản phẩm");
      return false;
    }
    return true;
  };

  // NHẬT KÝ (isChecked): toggle isChecked, đồng thời tắt isShow.
  // Không cho bỏ tick nếu là mục bắt buộc (isRequired) và không phải mục tự tạo.
  onToggleDiary = (row) => {
    if (!this.requireFieldProduct()) return;

    const informSelects = this.state.informSelects.map((x) => ({ ...x }));
    const item = informSelects.find((p) => p.id === row.id);
    if (!item) return;

    if (!item.isGenerated) {
      const information = this.state.informations.find((p) => p.id === item.informID);
      if (information && information.isRequired && item.isChecked) {
        return;
      }
    }

    item.isChecked = !item.isChecked;
    item.isShow = false;

    this.setState({ informSelects, data: this.buildData(informSelects) });
  };

  // QUÉT MÃ (isShow): toggle isShow; khi bật thì ép bật Nhật ký (isChecked = true).
  onToggleQRCode = (row) => {
    if (!this.requireFieldProduct()) return;

    const informSelects = this.state.informSelects.map((x) => ({ ...x }));
    const item = informSelects.find((p) => p.id === row.id);
    if (!item) return;

    if (!item.isGenerated) {
      const information = this.state.informations.find((p) => p.id === item.informID);
      if (information && information.isRequired && item.isShow) {
        return;
      }
    }

    item.isShow = !item.isShow;
    if (item.isShow) {
      item.isChecked = true;
    }

    this.setState({ informSelects, data: this.buildData(informSelects) });
  };

  // HT ĐÁNH GIÁ (isShowEvaluated): chỉ áp dụng cho mục có isEvaluated.
  onToggleEvaluated = (row) => {
    if (!this.requireFieldProduct()) return;

    const informSelects = this.state.informSelects.map((x) => ({ ...x }));
    const item = informSelects.find((p) => p.id === row.id);
    if (!item || !item.isEvaluated) return;

    item.isShowEvaluated = !item.isShowEvaluated;

    this.setState({ informSelects, data: this.buildData(informSelects) });
  };

  // Lưu toàn bộ thay đổi truy xuất (giống nút CẬP NHẬT trên mobile -> processaccess/updatev2)
  onUpdate = () => {
    const { filter, informSelects } = this.state;

    if (!this.requireFieldProduct()) return;

    const informationNotIsRequired = informSelects.filter(
      (p) => !p.isRequired || p.isEvaluated
    );

    if (informationNotIsRequired.length <= 0) {
      toast.error("Không có truy xuất để cập nhật");
      return;
    }

    const items = informSelects.filter(
      (p) =>
        informationNotIsRequired.find((t) => t.informID == p.informID) ||
        p.isGenerated
    );

    const body = {
      fieldId: filter.filter,
      productId: filter.product,
      items,
    };

    this.setState({ isLoaded: true });

    callApi("post", "processaccess/updatev2", body)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Cập nhật truy xuất thành công");
          this.fetchSummary();
        } else {
          const message = getErrorMessageServer(res);
          toast.error(message || "Cập nhật truy xuất thất bại");
          this.setState({ isLoaded: false });
        }
      })
      .catch((error) => {
        console.error("Error updating retrieve information:", error);
        toast.error("Cập nhật truy xuất thất bại");
        this.setState({ isLoaded: false });
      });
  };

  // ===== Phân quyền =====
  onOpenPermission = (item) => {
    if (!item || !item.id) {
      toast.error("Bạn vui lòng chọn truy xuất");
      return;
    }

    callApi(
      "get",
      `processaccess/getlisttraceroles?informSelectID=${item.id}`
    )
      .then((res) => {
        const traceRoles = Array.isArray(res.data) ? res.data : res.data || [];
        this.setState({
          permissionItem: item,
          traceRoles: traceRoles || [],
          permissionModal: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching trace roles:", error);
        toast.error("Lấy danh sách phân quyền thất bại");
      });
  };

  togglePermissionModal = () => {
    this.setState((prev) => ({ permissionModal: !prev.permissionModal }));
  };

  onConfirmPermission = (payload) => {
    const { role1s, role2s, isApproveAll } = payload;

    if (!role1s.roles || role1s.roles.length <= 0) {
      toast.error("Bạn vui lòng chọn quyền cho người thực hiện");
      return;
    }
    if (!role2s.roles || role2s.roles.length <= 0) {
      toast.error("Bạn vui lòng chọn quyền cho người đánh giá");
      return;
    }

    this.setState({ isLoaded: true });

    callApi("post", "processaccess/providerole", {
      informRole1: role1s,
      informRole2: role2s,
      isApproveAll,
    })
      .then((res) => {
        this.setState({ isLoaded: false });
        if (res && res.status == 200) {
          toast.success("Phân quyền thành công");
          this.setState({ permissionModal: false });
        } else {
          const message = getErrorMessageServer(res);
          toast.error(message || "Phân quyền thất bại");
        }
      })
      .catch((error) => {
        console.error("Error providing role:", error);
        this.setState({ isLoaded: false });
        toast.error("Phân quyền thất bại");
      });
  };

  // ===== Sửa STT (updateNumber) =====
  onOpenNumberModal = (item) => {
    this.setState({
      numberItem: item,
      numberValue: item && item.sortOrder ? String(item.sortOrder) : "",
      numberModal: true,
    });
  };

  toggleNumberModal = () => {
    this.setState((prev) => ({ numberModal: !prev.numberModal }));
  };

  onConfirmNumber = () => {
    const { numberItem, numberValue } = this.state;

    const sortOrder = parseFloat(numberValue || "0") || 0;

    if (!numberItem || !numberItem.id) {
      toast.error("Bạn vui lòng chọn truy xuất");
      return;
    }
    if (sortOrder <= 0) {
      toast.error("Bạn vui lòng nhập số thứ tự và phải lớn hơn 0");
      return;
    }

    this.setState({ isLoaded: true });

    callApi("post", "processaccess/updateNumber", {
      id: numberItem.id,
      sortOrder,
    })
      .then((res) => {
        if (res && res.status == 200) {
          toast.success("Cập nhật truy xuất thành công");
          this.setState({ numberModal: false });
          this.fetchSummary();
        } else {
          const message = getErrorMessageServer(res);
          toast.error(message || "Cập nhật truy xuất thất bại");
          this.setState({ isLoaded: false });
        }
      })
      .catch((error) => {
        console.error("Error updating sort order:", error);
        toast.error("Cập nhật truy xuất thất bại");
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
      product: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    this.setState({ filter: clearFilter });
  };

  handleChangeSelectFilter = async (value, name) => {
    const fieldID = (value && value.id) || value || "";

    // Chọn sản phẩm: chỉ cập nhật filter.product
    if (name !== "filter") {
      this.setState((prev) => ({
        filter: { ...prev.filter, [name]: value },
      }));
      return;
    }

    // Đổi ngành nghề: cập nhật filter.filter, reset sản phẩm và nạp lại danh sách sản phẩm
    this.setState((prev) => ({
      filter: { ...prev.filter, filter: value, product: "" },
      PRODUCT_OPTIONS: [],
    }));

    if (fieldID) {
      await this.fetchProductsByField(fieldID);
    }
  };

  // Lấy danh sách sản phẩm theo ngành nghề, dùng cho cả bộ lọc và form chi tiết/sửa
  fetchProductsByField = async (fieldID) => {
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
        productName: item.productName || item.name || item.title,
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
      openModal && openModal();
    }

    this.setState({
      isShowForEdit: false,
      isShowForDetail: false,
      isShowForWrite: false,
      editId: null,
      editData: null,
    });
  };

  // Lấy chi tiết 1 mục truy xuất theo id rồi map về dữ liệu cho form
  loadDetail = (id, mode) => {
    callApi("get", `processaccess/getDetailSetAccess?id=${id}`)
      .then((res) => {
        const informSelect = (res.data && res.data.informSelect) || res.data || {};

        const editData = {
          id: informSelect.id,
          jobId: informSelect.fieldID,
          productId: informSelect.productID,
          name: informSelect.name,
          order: informSelect.sortOrder,
          imgUrlVal: informSelect.image,
          isIsolationTest: !!informSelect.isQuarantine,
          // 1: Nhập kho, 2: Đánh giá, 3: Chuyển giao
          typeId: informSelect.isHarvest
            ? 1
            : informSelect.isEvaluated
            ? 2
            : informSelect.isHarvest2
            ? 3
            : null,
        };

        if (informSelect.fieldID) {
          this.fetchProductsByField(informSelect.fieldID);
        }

        this.setState({
          editId: id,
          editData,
          isShowForDetail: mode === "detail",
          isShowForEdit: mode === "edit",
        });
      })
      .catch((error) => {
        console.error("Error fetching retrieve detail:", error);
        toast.error("Lấy thông tin truy xuất thất bại");
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
    const { dataInsert, filter, editId, isShowForDetail } = this.state;

    // Xem chi tiết: chỉ đóng, không gửi gì
    if (isShowForDetail) {
      if (toggleModal) toggleModal();
      return;
    }

    // Ưu tiên ngành nghề/sản phẩm chọn trong form, nếu không có thì lấy theo bộ lọc đang tìm.
    const fieldId = dataInsert.jobId || filter.filter || "";
    const productId = dataInsert.productId || filter.product || "";
    const name = (dataInsert.name || "").trim();

    if (!fieldId) {
      toast.error("Bạn vui lòng chọn ngành nghề");
      return;
    }
    if (!productId) {
      toast.error("Bạn vui lòng chọn sản phẩm");
      return;
    }
    if (!name) {
      toast.error("Tên truy xuất không được bỏ trống");
      return;
    }

    // Khớp contract mobile (processaccess, multipart form-data).
    // Trạng thái xử lý là loại trừ lẫn nhau: 1 = Nhập kho, 2 = Đánh giá, 3 = Chuyển giao.
    const formData = new FormData();
    formData.append("setAccessName", name);
    formData.append("fieldId", fieldId);
    formData.append("productId", productId);
    formData.append("sortOrder", Number(dataInsert.order) || 0);
    // BE đặt tên property là "CheckQuaratine" (thiếu chữ 'n') -> gửi đúng key này.
    // Gửi kèm "checkQuarantine" để an toàn nếu BE được sửa chính tả sau này.
    formData.append("checkQuaratine", dataInsert.isIsolationTest ? true : false);
    formData.append("checkQuarantine", dataInsert.isIsolationTest ? true : false);
    formData.append("checkGoodReceived", dataInsert.typeId === 1);
    formData.append("checkRating", dataInsert.typeId === 2);
    formData.append("checkDelivery", dataInsert.typeId === 3);
    // Ảnh: BE nhận List<IFormFile> qua field "Image" (chỉ gửi khi người dùng chọn ảnh mới)
    if (dataInsert.imageFile) {
      formData.append("Image", dataInsert.imageFile);
    }

    const isEdit = !!editId;
    if (isEdit) {
      formData.append("id", editId);
    }

    const method = isEdit ? "put" : "post";
    const endpoint = isEdit ? "processaccess/update" : "processaccess/create";
    const successMsg = isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!";
    const failMsg = isEdit ? "Cập nhật thất bại" : "Thêm mới thất bại";

    callApi(method, endpoint, formData, true)
      .then((res) => {
        if (res && res.status == 200) {
          toast.success(successMsg);
          this.fetchSummary();
          if (toggleModal) {
            toggleModal();
          }
        } else {
          const message = getErrorMessageServer(res) || failMsg;
          toast.error(message);
        }
      })
      .catch((error) => {
        console.error("Error saving retrieve information:", error);
        toast.error(failMsg);
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

  onEditData = (item) => () => {
    this.loadDetail(item.id, "edit");
  };

  onShowDetail = (item) => () => {
    this.loadDetail(item.id, "detail");
  };

  onShowWrite = (id) => () => {
    this.setState((previousState) => {
      return {
        isShowForWrite: true,
      };
    });
  };

  onDeleteData = (id) => () => {
    this.setState({ deleteId: id, warningPopupModal: true });
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

    callApi("delete", `processaccess/delete?id=${deleteId}`)
      .then((res) => {
        this.setState({ warningPopupModal: false });

        if (res && res.status == 200) {
          toast.success("Xoá dữ liệu thành công!");
          this.fetchSummary();
        } else {
          const message = getErrorMessageServer(res);
          toast.error(message || "Xóa dữ liệu thất bại");
        }
      })
      .catch((error) => {
        console.error("Error deleting retrieve information:", error);
        this.setState({ warningPopupModal: false });
        toast.error("Xóa dữ liệu thất bại");
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
        >
          <td
            className={`className='table-scale-col table-user-col-1' ${renderClass}`}
            style={{ cursor: "pointer", textDecoration: "underline" }}
            title="Bấm để sửa thứ tự"
            onClick={() => this.onOpenNumberModal(e)}
          >
            {autoIndex + 1}
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.retrieve}</span>
          </td>

          {/* NHẬT KÝ (isChecked): checkbox bật/tắt hiển thị trong nhật ký — giống mobile */}
          <td
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => this.onToggleDiary(e)}
          >
            <input
              type="checkbox"
              readOnly
              checked={!!e.loggingStatus}
              style={{ cursor: "pointer", width: 18, height: 18 }}
            />
          </td>
          {/* QUÉT MÃ (isShow): checkbox bật/tắt hiển thị khi quét QR — giống mobile */}
          <td
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => this.onToggleQRCode(e)}
          >
            <input
              type="checkbox"
              readOnly
              checked={!!e.qrStatus}
              style={{ cursor: "pointer", width: 18, height: 18 }}
            />
          </td>
          {/* HT ĐÁNH GIÁ (isShowEvaluated): chỉ hiện checkbox khi mục có isEvaluated */}
          <td
            style={{
              textAlign: "center",
              cursor: e.isEvaluated ? "pointer" : "default",
            }}
            onClick={() => e.isEvaluated && this.onToggleEvaluated(e)}
          >
            {e.isEvaluated ? (
              <input
                type="checkbox"
                readOnly
                checked={!!e.htFeedback}
                style={{ cursor: "pointer", width: 18, height: 18 }}
              />
            ) : null}
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
                        <DropdownItem onClick={this.onShowDetail(e)}>
                          Xem chi tiết
                        </DropdownItem>
                        {isDisableEdit == true || !e.isGenerated ? null : (
                          <DropdownItem onClick={this.onEditData(e)}>
                            Sửa
                          </DropdownItem>
                        )}
                        {isDisableEdit == true || !e.isEvaluated ? null : (
                          <DropdownItem onClick={() => this.onOpenPermission(e)}>
                            Phân quyền
                          </DropdownItem>
                        )}
                        {isDisableDelete == true ? null : (
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
      isShowForDetail,
      isShowForWrite,
      errorInserts,
      status,
      headerTitle,
      data,
      informSelects,
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
        !ACCOUNT_CLAIM_FF.find((x) => x === "RetrieveInformation.Add")
      ) {
        isDisableAdd = true;
      }
      if (
        ACCOUNT_CLAIM_FF.length > 0 &&
        !ACCOUNT_CLAIM_FF.find((x) => x === "RetrieveInformation.Edit")
      ) {
        isDisableEdit = true;
      }
      if (
        ACCOUNT_CLAIM_FF.length > 0 &&
        !ACCOUNT_CLAIM_FF.find((x) => x === "RetrieveInformation.Delete")
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
                    <HeaderTable
                      dataReload={() => this.fetchSummary()}
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      moduleTitle={
                        isShowForDetail
                          ? "Chi tiết truy xuất thông tin"
                          : isShowForEdit
                            ? "Cập nhật truy xuất thông tin"
                            : isShowForWrite
                              ? "Ghi nhật ký truy cập"
                              : "Thêm/Cập nhật truy xuất thông tin"
                      }
                      moduleBody={
                        <InsertOrUpdate
                          id={editId}
                          initialData={this.state.editData}
                          isReadOnly={isShowForDetail}
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
                                  value={this.state.filter.filter || null}
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
                                  value={this.state.filter.product || null}
                                  data={PRODUCT_OPTIONS}
                                  labelName="productName"
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

                    {/* Tiêu đề mô tả khu vực dữ liệu truy xuất — đồng bộ mobile setAccess */}
                    <div style={{ margin: "4px 0 12px" }}>
                      <div style={{ fontWeight: 700, color: "#1f3bb3", fontSize: 16 }}>
                        DỮ LIỆU TRUY XUẤT
                      </div>
                      <div style={{ color: "#6c757d", fontSize: 13 }}>
                        Chọn dữ liệu truy xuất hiển thị ứng với doanh nghiệp của bạn
                      </div>
                    </div>

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className="align-items-center tablecs table-css-planting-zone"
                        responsive
                      >
                        <thead className="thead-dark">
                          <tr>
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

                    {/* Nút lưu thay đổi truy xuất (updatev2) */}
                    {isDisableEdit === false &&
                    Array.isArray(informSelects) &&
                    informSelects.length > 0 &&
                    informSelects.filter((p) => !p.isRequired || p.isGenerated)
                      .length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "15px 0",
                        }}
                      >
                        <Button
                          className="btn-success-cs"
                          color="default"
                          type="button"
                          size="md"
                          onClick={this.onUpdate}
                        >
                          <span>CẬP NHẬT</span>
                        </Button>
                      </div>
                    ) : null}

                    {/* Pagination */}
                    {
                      // Page of Table
                      Array.isArray(data) && data.length > 0 && (
                        <Pagination
                          data={data}
                          listLength={listLength}
                          totalPage={totalPage}
                          totalElement={totalElement}
                          currentPage={
                            this.state.currentPage > 0
                              ? this.state.currentPage - 1
                              : 0
                          }
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

            <PermissionModal
              isOpen={this.state.permissionModal}
              toggle={this.togglePermissionModal}
              item={this.state.permissionItem}
              roleComboBoxs={this.state.roleComboBoxs}
              traceRoles={this.state.traceRoles}
              onConfirm={this.onConfirmPermission}
            />

            {/* Modal sửa thứ tự (STT) */}
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state.numberModal}
              toggle={this.toggleNumberModal}
            >
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa thứ tự</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.toggleNumberModal}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <label className="form-control-label">STT</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={this.state.numberValue}
                  onChange={(ev) =>
                    this.setState({ numberValue: ev.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <Button
                  color="secondary"
                  type="button"
                  onClick={this.toggleNumberModal}
                >
                  Đóng
                </Button>
                <Button
                  className="btn-success-cs"
                  color="default"
                  type="button"
                  onClick={this.onConfirmNumber}
                >
                  CẬP NHẬT
                </Button>
              </div>
            </Modal>

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
  RetrieveInformation
);
