import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
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
import moment from "moment";
import { fetchData } from "../../../helpers/fetchData";

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { PRODUCTS } from "../../../helpers/constant";
import { fetchData } from "helpers/fetchData.js";
import moment from "moment";

class Product extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        batchNumber: "12",
        productId: "Giày bata",
        status: 1,
        quantity: 12,
        unit: "kg",
        requestDate: "17:31 13/11/2025",
      },
      {
        id: 2,
        batchNumber: "12",
        productId: "Giày bata",
        status: 1,
        quantity: 15,
        unit: "kg",
        requestDate: "17:31 14/11/2025",
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
      headerTitle: PRODUCTS,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
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
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      // Date filters for batch management
      fromDate: moment().subtract(30, "days").format("DD/MM/YYYY"),
      toDate: moment().format("DD/MM/YYYY"),
      // Status filter (0-4) - empty string means all statuses
      statusId: "",
      isLoadingBatches: false,
      // Batch form modal
      showFormModal: false,
      editingBatchId: null,

      STATUS_OPTIONS: [
        { id: 0, title: "Mới tạo" },
        { id: 1, title: "Chờ duyệt" },
        { id: 2, title: "Đã duyệt" },
        { id: 3, title: "Không duyệt" },
        { id: 4, title: "Chờ duyệt lại" },
      ],
      DIARY_OPTIONS: [
        {
          id: 1,
          title: "Nhật ký 1",
          createdAt: "23/06/2025",
          quantity: 50,
          location: "Kho A",
          product: "Phân bón NPK",
          unit: "kg",
        },
        {
          id: 2,
          title: "Nhật ký 2",
          createdAt: "21/06/2025",
          quantity: 20,
          location: "Kho B",
          product: "Phân bón NPKS",
          unit: "tấn",
        },
      ],
      CLASSIFY_OPTIONS: [
        {
          id: 1,
          title: "Phân loại 1",
        },
        {
          id: 2,
          title: "Phân loại 2",
        },
      ],
      TEM_OPTIONS: [
        {
          id: 1,
          title: "Dải tem 1",
        },
        {
          id: 2,
          title: "Dải tem 2",
        },
      ],
      PROVINCE_OPTIONS: [
        { id: 1, title: "Hà Nội" },
        { id: 2, title: "Hồ Chí Minh" },
        { id: 3, title: "Hải Phòng" },
        { id: 4, title: "Đà Nẵng" },
        { id: 5, title: "Cần Thơ" },
        { id: 6, title: "Hà Giang" },
        { id: 7, title: "Cao Bằng" },
        { id: 8, title: "Lào Cai" },
        { id: 9, title: "Yên Bái" },
        { id: 10, title: "Tuyên Quang" },
        { id: 11, title: "Lạng Sơn" },
        { id: 12, title: "Quảng Ninh" },
        { id: 13, title: "Thái Nguyên" },
        { id: 14, title: "Bắc Giang" },
        { id: 15, title: "Phú Thọ" },
        { id: 16, title: "Vĩnh Phúc" },
        { id: 17, title: "Bắc Ninh" },
        { id: 18, title: "Hải Dương" },
        { id: 19, title: "Hưng Yên" },
        { id: 20, title: "Thái Bình" },
        { id: 21, title: "Nam Định" },
        { id: 22, title: "Ninh Bình" },
        { id: 23, title: "Thanh Hóa" },
        { id: 24, title: "Nghệ An" },
        { id: 25, title: "Hà Tĩnh" },
        { id: 26, title: "Quảng Bình" },
        { id: 27, title: "Quảng Trị" },
        { id: 28, title: "Thừa Thiên Huế" },
        { id: 29, title: "Quảng Nam" },
        { id: 30, title: "Quảng Ngãi" },
        { id: 31, title: "Bình Định" },
        { id: 32, title: "Phú Yên" },
        { id: 33, title: "Khánh Hòa" },
        { id: 34, title: "Đắk Lắk" },
        { id: 35, title: "Lâm Đồng" },
        { id: 36, title: "Đồng Nai" },
        { id: 37, title: "Bình Dương" },
        { id: 38, title: "Bà Rịa - Vũng Tàu" },
        { id: 39, title: "Tây Ninh" },
        { id: 40, title: "Long An" },
        { id: 41, title: "Tiền Giang" },
        { id: 42, title: "Bến Tre" },
        { id: 43, title: "Vĩnh Long" },
        { id: 44, title: "Đồng Tháp" },
        { id: 45, title: "An Giang" },
        { id: 46, title: "Kiên Giang" },
        { id: 47, title: "Sóc Trăng" },
        { id: 48, title: "Cà Mau" },
      ],
      COUNTRY_OPTIONS: [
        { id: "VN", title: "Việt Nam" },
        { id: "CN", title: "Trung Quốc" },
        { id: "JP", title: "Nhật Bản" },
        { id: "KR", title: "Hàn Quốc" },
        { id: "SG", title: "Singapore" },
        { id: "TH", title: "Thái Lan" },
        { id: "ID", title: "Indonesia" },
        { id: "MY", title: "Malaysia" },

        { id: "DE", title: "Đức" },
        { id: "FR", title: "Pháp" },
        { id: "GB", title: "Vương quốc Anh" },
        { id: "IT", title: "Ý" },
        { id: "ES", title: "Tây Ban Nha" },

        { id: "US", title: "Hoa Kỳ" },
        { id: "CA", title: "Canada" },
        { id: "BR", title: "Brazil" },
        { id: "MX", title: "Mexico" },

        { id: "AU", title: "Úc" },
        { id: "NZ", title: "New Zealand" },

        { id: "ZA", title: "Nam Phi" },
      ],
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
    };
  }

  componentWillMount() {
    // Load batch/consignment data with filters
    this.fetchBatches(0);

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

    // Load batch/consignment data with filters
    this.fetchBatches(0);

    // Load batch dropdown data (Diary, Classifications, Stamp Ranges, etc.)
    this.fetchBatchDropdownData();
  }

  // Fetch batch list with filters
  fetchBatches = async (page = 0) => {
    try {
      this.setState({ isLoadingBatches: true });

      const { limit, fromDate, toDate, statusId } = this.state;

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDate
        ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDate
        ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.consignments.getListConsignment(
        page,
        limit,
        fromDateAPI,
        toDateAPI,
        statusId || ""
      );

      if (result) {
        // API returns: { batchs: [...] }
        const batchList = Array.isArray(result) 
          ? result 
          : (result.batchs || result.batches || result.data || []);
        
        const mappedData = batchList.map((item, index) => ({
          id: item.ID || item.id || "",
          index: index + 1,
          batchNumber: item.BatchNum || item.batchNumber || "",
          productId: item.ProductName || item.productName || "",
          status: item.Status || item.status || 0,
          quantity: item.Quantity || item.quantity || 0,
          unit: item.UnitName || item.unitName || "",
          requestDate: item.RequestedDate 
            ? moment(item.RequestedDate).format("DD/MM/YYYY HH:mm")
            : (item.CreatedDate
              ? moment(item.CreatedDate).format("DD/MM/YYYY HH:mm")
              : ""),
          ...item,
        }));

        // Create collapseList for batch data
        const collapseList = mappedData.map((item) => ({
          id: item.id,
          collapse: false,
        }));

        this.setState({
          data: mappedData,
          listLength: mappedData.length,
          totalPage: Math.ceil(mappedData.length / limit),
          currentPage: page,
          collapseList: collapseList,
          isLoadingBatches: false,
        });
      } else {
        this.setState({
          data: [],
          collapseList: [],
          isLoadingBatches: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lô hàng:", error);
      this.setState({
        data: [],
        isLoadingBatches: false,
      });
    }
  };

  // Handle date filter change
  handleDateChange = (name) => (value) => {
    const formatted = moment.isMoment(value)
      ? value.format("DD/MM/YYYY")
      : value;
    
    this.setState({ [name]: formatted }, () => {
      this.fetchBatches(0);
    });
  };

  // Handle status filter change
  handleStatusChange = (value) => {
    this.setState({ statusId: value }, () => {
      this.fetchBatches(0);
    });
  };

  // Fetch dropdown data for batch form
  fetchBatchDropdownData = async () => {
    console.log("========== FETCH BATCH DROPDOWN DATA ==========");
    try {
      // Fetch Diary/Traces
      const diaryResponse = await fetchData.consignments.getListTraceComboBox();
      console.log("🔹 DIARY_OPTIONS từ API:", diaryResponse);
      const diaryData = diaryResponse?.fields || diaryResponse || [];
      const diaryOptions = Array.isArray(diaryData) 
        ? diaryData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.TraceName || "",
            location: item.Location || item.location || "",
            product: item.Product || item.product || item.ItemName || "",
            unit: item.Unit || item.unit || item.UnitName || "",
          }))
        : [];
      console.log("✅ DIARY_OPTIONS sau mapping:", diaryOptions);

      // Fetch Batch Categories (Phân loại)
      const categoriesResponse = await fetchData.consignments.getBatchCategories();
      console.log("🔹 CLASSIFY_OPTIONS từ API:", categoriesResponse);
      const categoriesData = categoriesResponse?.batchCategories || categoriesResponse || [];
      const classifyOptions = Array.isArray(categoriesData)
        ? categoriesData.map(item => ({
            id: item.id || item.ID,
            title: item.description || item.Description || item.Title || item.title || item.Name || "",
          }))
        : [];
      console.log("✅ CLASSIFY_OPTIONS sau mapping:", classifyOptions);

      // Fetch Stamp Ranges (Dải tem)
      const stampRangeResponse = await fetchData.consignments.getStampRange();
      console.log("🔹 TEM_OPTIONS từ API:", stampRangeResponse);
      const stampRangeData = stampRangeResponse?.stampRanges || stampRangeResponse || [];
      const temOptions = Array.isArray(stampRangeData)
        ? stampRangeData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.StampRangeName || `${item.FromStamp || ""} - ${item.ToStamp || ""}`,
          }))
        : [];
      console.log("✅ TEM_OPTIONS sau mapping:", temOptions);

      // Fetch Warehouse data
      const warehouseData = await fetchData.consignments.getListWarehouseForUpdate();
      console.log("🔹 WAREHOUSE_OPTIONS từ API:", warehouseData);
      const warehouseOptions = Array.isArray(warehouseData)
        ? warehouseData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.WarehouseName || "",
          }))
        : [];
      console.log("✅ WAREHOUSE_OPTIONS sau mapping:", warehouseOptions);

      // Fetch Provinces
      const provinceData = await fetchData.consignments.getProvinceComboBox();
      console.log("🔹 PROVINCE_OPTIONS từ API:", provinceData);
      const provinceOptions = Array.isArray(provinceData)
        ? provinceData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.ProvinceName || "",
          }))
        : [];
      console.log("✅ PROVINCE_OPTIONS sau mapping:", provinceOptions);

      // Fetch Countries
      const countryData = await fetchData.consignments.getNationComboBox();
      console.log("🔹 COUNTRY_OPTIONS từ API:", countryData);
      const countryOptions = Array.isArray(countryData)
        ? countryData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.CountryName || "",
          }))
        : [];
      console.log("✅ COUNTRY_OPTIONS sau mapping:", countryOptions);

      console.log("📌 FINAL STATE TO SET:", {
        DIARY_OPTIONS: diaryOptions,
        CLASSIFY_OPTIONS: classifyOptions,
        TEM_OPTIONS: temOptions,
        WAREHOUSE_OPTIONS: warehouseOptions,
        PROVINCE_OPTIONS: provinceOptions,
        COUNTRY_OPTIONS: countryOptions,
      });

      this.setState({
        DIARY_OPTIONS: diaryOptions,
        CLASSIFY_OPTIONS: classifyOptions,
        TEM_OPTIONS: temOptions,
        WAREHOUSE_OPTIONS: warehouseOptions,
        PROVINCE_OPTIONS: provinceOptions,
        COUNTRY_OPTIONS: countryOptions,
      });

      console.log("========== FETCH BATCH DROPDOWN DATA DONE ==========");
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu dropdown cho lô hàng:", error);
      // Keep using mock data if API fails
    }
  };

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

  // Fetch batch list with filters
  fetchBatches = async (page = 0) => {
    try {
      this.setState({ isLoadingBatches: true });

      const { limit, fromDate, toDate, statusId } = this.state;

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDate
        ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDate
        ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.consignments.getListConsignment(
        page,
        limit,
        fromDateAPI,
        toDateAPI,
        statusId || ""
      );

      if (result) {
        // API returns: { batchs: [...] } or direct array
        const batchList = Array.isArray(result) 
          ? result 
          : (result.batchs || result.batches || result.data || []);
        
        const mappedData = batchList.map((item, index) => ({
          id: item.ID || item.id || "",
          index: index + 1,
          batchNumber: item.BatchNum || item.batchNumber || "",
          productId: item.ProductName || item.productName || "",
          status: item.Status || item.status || 0,
          quantity: item.Quantity || item.quantity || 0,
          unit: item.UnitName || item.unitName || "",
          requestDate: item.RequestedDate 
            ? moment(item.RequestedDate).format("DD/MM/YYYY HH:mm")
            : (item.CreatedDate
              ? moment(item.CreatedDate).format("DD/MM/YYYY HH:mm")
              : ""),
          ...item,
        }));

        // Create collapseList for batch data
        const collapseList = mappedData.map((item) => ({
          id: item.id,
          collapse: false,
        }));

        this.setState({
          data: mappedData,
          listLength: mappedData.length,
          totalPage: Math.ceil(mappedData.length / limit),
          currentPage: page,
          collapseList: collapseList,
          isLoadingBatches: false,
        });
      } else {
        this.setState({
          data: [],
          collapseList: [],
          isLoadingBatches: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lô hàng:", error);
      this.setState({
        data: [],
        isLoadingBatches: false,
      });
    }
  };

  // Handle date filter change
  handleDateChange = (name) => (value) => {
    const formatted = moment.isMoment(value)
      ? value.format("DD/MM/YYYY")
      : value;
    
    this.setState({ [name]: formatted }, () => {
      this.fetchBatches(0);
    });
  };

  // Handle status filter change
  handleStatusChange = (value) => {
    this.setState({ statusId: value }, () => {
      this.fetchBatches(0);
    });
  };

  // Fetch dropdown data for batch form
  fetchBatchDropdownData = async () => {
    try {
      // Fetch Diary/Traces
      const diaryResponse = await fetchData.consignments.getListTraceComboBox();
      const diaryData = diaryResponse?.fields || diaryResponse || [];
      const diaryOptions = Array.isArray(diaryData) 
        ? diaryData.map(item => ({
            id: item.ID || item.id,
            title: item.NameCode || item.nameCode || item.ProductName || item.productName || "",
            location: item.PlantingZoneName || item.plantingZoneName || item.Location || item.location || "",
            product: item.ProductName || item.productName || item.Product || item.product || "",
            unit: item.Unit || item.unit || item.UnitName || "",
          }))
        : [];

      // Fetch Batch Categories (Phân loại)
      const categoriesResponse = await fetchData.consignments.getBatchCategories();
      const categoriesData = categoriesResponse?.batchCategories || categoriesResponse || [];
      const classifyOptions = Array.isArray(categoriesData)
        ? categoriesData.map(item => ({
            id: item.id || item.ID,
            title: item.description || item.Description || item.Title || item.title || item.Name || "",
          }))
        : [];

      // Fetch Stamp Ranges (Dải tem)
      const stampRangeResponse = await fetchData.consignments.getStampRange();
      const stampRangeData = stampRangeResponse?.stampRanges || stampRangeResponse || [];
      const temOptions = Array.isArray(stampRangeData)
        ? stampRangeData.map(item => ({
            id: item.id || item.ID,
            title: `${item.startNum || item.StartNum || ""} - ${item.endNum || item.EndNum || ""}` || item.Title || item.title || item.StampRangeName || "",
          }))
        : [];

      // Fetch Warehouse data
      const warehouseData = await fetchData.consignments.getListWarehouseForUpdate();
      const warehouseOptions = Array.isArray(warehouseData)
        ? warehouseData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.WarehouseName || "",
          }))
        : [];

      // Fetch Provinces
      const provinceData = await fetchData.consignments.getProvinceComboBox();
      const provinceOptions = Array.isArray(provinceData)
        ? provinceData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.ProvinceName || "",
          }))
        : [];

      // Fetch Countries
      const countryData = await fetchData.consignments.getNationComboBox();
      const countryOptions = Array.isArray(countryData)
        ? countryData.map(item => ({
            id: item.ID || item.id,
            title: item.Title || item.title || item.CountryName || "",
          }))
        : [];

      this.setState({
        DIARY_OPTIONS: diaryOptions,
        CLASSIFY_OPTIONS: classifyOptions,
        TEM_OPTIONS: temOptions,
        WAREHOUSE_OPTIONS: warehouseOptions,
        PROVINCE_OPTIONS: provinceOptions,
        COUNTRY_OPTIONS: countryOptions,
      });

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dropdown cho form batch:", error);
    }
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
      this.openBatchFormModal();
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
    const batchNumber = dataInsert.batchNumber;

    const errorInserts = {};

    if (!batchNumber) {
      errorInserts.batchNumber = "Số phiếu không được bỏ trống";
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

  onEditData = (rowData) => () => {
    // rowData could be ID or entire row object from batch table
    const batchId = typeof rowData === 'object' ? rowData.id || rowData.ID : rowData;
    
    // Check if this is batch data (has batchNumber property)
    if (typeof rowData === 'object' && rowData.batchNumber) {
      // Open batch form modal for editing
      this.openBatchFormModal(batchId);
    } else {
      // Old zone/legacy behavior
      this.setState((previousState) => {
        return {
          isShowForEdit: true,
        };
      });
    }
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
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
      });
    }
  };

  // Batch form methods
  openBatchFormModal = (batchId = null) => {
    this.setState({
      showFormModal: true,
      editingBatchId: batchId,
    });
  };

  closeBatchFormModal = () => {
    this.setState({
      showFormModal: false,
      editingBatchId: null,
    });
  };

  handleBatchFormSaveSuccess = () => {
    // Close modal and reload batch list
    this.closeBatchFormModal();
    // Reload batch list with current filters
    this.fetchBatches(0);
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

  renderBatchTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let autoIndex = 0;

    // Filter data for pagination
    const paginatedData = data.filter((item, key) => key >= beginItem && key < endItem);

    paginatedData.forEach((e, index) => {
      list.push(
        <tr
          key={autoIndex}
          index={autoIndex}
          className="table-hover-css"
        >
          <td className="table-scale-col table-user-col-1">
            {autoIndex + beginItem + 1}
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{e.batchNumber || ""}</span>
          </td>
          <td style={{ textAlign: "left" }}>
            <span>{e.productId || ""}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{(e.quantity || 0) + " " + (e.unit || "")}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{e.requestDate || ""}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{this.showTitleWithStatus(e.status)}</span>
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
    });

    return list;
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
          <td style={{ textAlign: "center" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.batchNumber}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.productId}</span>
          </td>
          <td style={{ textAlign: "center" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {e.quantity + " " + e.unit}
            </span>
          </td>
          <td style={{ textAlign: "center" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>{e.requestDate}</span>
          </td>
          <td style={{ textAlign: "center" }} className={renderClass}>
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

  renderBatchTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let autoIndex = 0;

    // Validate data
    if (!Array.isArray(data) || data.length === 0) {
      return list;
    }

    // Filter data for pagination
    const paginatedData = data.filter((item, key) => key >= beginItem && key < endItem);

    paginatedData.forEach((e, index) => {
      list.push(
        <tr
          key={autoIndex}
          index={autoIndex}
          className="table-hover-css"
        >
          <td className="table-scale-col table-user-col-1">
            {autoIndex + beginItem + 1}
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{e.batchNumber || ""}</span>
          </td>
          <td style={{ textAlign: "left" }}>
            <span>{e.productId || ""}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{(e.quantity || 0) + " " + (e.unit || "")}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{e.requestDate || ""}</span>
          </td>
          <td style={{ textAlign: "center" }}>
            <span>{this.showTitleWithStatus(e.status)}</span>
          </td>
          <td>
            {(collapseList || [])
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
    });

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
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      STATUS_OPTIONS,
      DIARY_OPTIONS,
      CLASSIFY_OPTIONS,
      TEM_OPTIONS,
      COUNTRY_OPTIONS,
      PROVINCE_OPTIONS,
      WAREHOUSE_OPTIONS,
      fromDate,
      toDate,
      showFormModal,
      editingBatchId,
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
                      dataReload={() => {
                        const fromDefault = moment().subtract(30, "days").format("DD/MM/YYYY");
                        const toDefault = moment().format("DD/MM/YYYY");
                        this.setState({
                          fromDate: fromDefault,
                          toDate: toDefault,
                          statusId: "",
                        }, () => {
                          this.fetchBatches(0);
                        });
                      }}
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      moduleTitle={
                        isShowForEdit ? "Sửa phiếu nhập" : "Thêm phiếu nhập"
                      }
                      moduleBody={
                        <InsertOrUpdate
                          id={editId}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          STATUS_OPTIONS={STATUS_OPTIONS}
                          DIARY_OPTIONS={DIARY_OPTIONS}
                          CLASSIFY_OPTIONS={CLASSIFY_OPTIONS}
                          TEM_OPTIONS={TEM_OPTIONS}
                          COUNTRY_OPTIONS={COUNTRY_OPTIONS}
                          WAREHOUSE_OPTIONS={WAREHOUSE_OPTIONS}
                          PROVINCE_OPTIONS={PROVINCE_OPTIONS}
                          isShowForEdit={isShowForEdit}
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
                                    placeholder: "DD/MM/YYYY",
                                  }}
                                  value={fromDate ? moment(fromDate, "DD/MM/YYYY") : ""}
                                  timeFormat={false}
                                  dateFormat="DD/MM/YYYY"
                                  onChange={this.handleDateChange("fromDate")}
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
                                    placeholder: "DD/MM/YYYY",
                                  }}
                                  value={toDate ? moment(toDate, "DD/MM/YYYY") : ""}
                                  timeFormat={false}
                                  dateFormat="DD/MM/YYYY"
                                  onChange={this.handleDateChange("toDate")}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Trạng thái
                              </label>
                              <div>
                                <Select
                                  name="statusId"
                                  val="id"
                                  title="Chọn trạng thái"
                                  data={STATUS_OPTIONS}
                                  labelName="title"
                                  defaultValue={this.state.statusId || ""}
                                  handleChange={(value) =>
                                    this.handleStatusChange(value)
                                  }
                                />
                              </div>
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
                            (data.length > 0 && data[0].batchNumber !== undefined
                              ? this.renderBatchTable(
                                  data,
                                  isDisableEdit,
                                  isDisableDelete
                                )
                              : this.renderTable(
                                  data,
                                  isDisableEdit,
                                  isDisableDelete
                                ))}
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
                  DIARY_OPTIONS={DIARY_OPTIONS}
                  CLASSIFY_OPTIONS={CLASSIFY_OPTIONS}
                  TEM_OPTIONS={TEM_OPTIONS}
                  COUNTRY_OPTIONS={COUNTRY_OPTIONS}
                  WAREHOUSE_OPTIONS={WAREHOUSE_OPTIONS}
                  PROVINCE_OPTIONS={PROVINCE_OPTIONS}
                  isShowForEdit={isShowForEdit}
                />
              }
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              onConfirm={(data, close) => {
                this.onConfirm(data, close);
              }}
            />

            {/* Batch Form Modal */}
            <Modal
              isOpen={this.state.showFormModal}
              toggle={this.closeBatchFormModal}
              size="lg"
              scrollable={true}
            >
              <ModalHeader toggle={this.closeBatchFormModal}>
                {this.state.editingBatchId ? "Cập nhật lô hàng" : "Thêm mới lô hàng"}
              </ModalHeader>
              <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <InsertOrUpdate
                  batchId={this.state.editingBatchId}
                  errors={this.state.errorInserts || {}}
                  DIARY_OPTIONS={this.state.DIARY_OPTIONS || []}
                  CLASSIFY_OPTIONS={this.state.CLASSIFY_OPTIONS || []}
                  TEM_OPTIONS={this.state.TEM_OPTIONS || []}
                  WAREHOUSE_OPTIONS={this.state.WAREHOUSE_OPTIONS || []}
                  PROVINCE_OPTIONS={this.state.PROVINCE_OPTIONS || []}
                  COUNTRY_OPTIONS={this.state.COUNTRY_OPTIONS || []}
                  STATUS_OPTIONS={STATUS_OPTIONS}
                  onSaveSuccess={this.handleBatchFormSaveSuccess}
                  onCancel={this.closeBatchFormModal}
                />
              </ModalBody>
            </Modal>

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Product);

const inventoryDataMock = [
  {
    stt: 1,
    warehouse: "Kho hàng 1",
    itemName: "Dép Cross",
    unit: "Đôi",
    beginningBalance: 10,
    inPeriod: 0,
    endingBalance: 10,
  },
  {
    stt: 2,
    warehouse: "Kho hàng 1",
    itemName: "Giày công sở",
    unit: "kg",
    beginningBalance: 10500000,
    inPeriod: 0,
    endingBalance: 10500000,
  },
  {
    stt: 3,
    warehouse: "Kho hàng 1",
    itemName: "Giày lười",
    unit: "kg",
    beginningBalance: 10,
    inPeriod: 0,
    endingBalance: 10,
  },
];
