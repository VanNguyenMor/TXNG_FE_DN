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
      // fromDate và toDate init là empty
      fromDate: "",
      toDate: "",
      collapseList: [],

      STATUS_OPTIONS: [
        { id: 0, title: "Mới tạo" },
        { id: 1, title: "Chờ duyệt" },
        { id: 2, title: "Đã duyệt" },
        { id: 3, title: "Không duyệt" },
        { id: 4, title: "Chờ duyệt lại" },
      ],
      DIARY_OPTIONS: [], // Sẽ được load từ API batch/gettraces
      CLASSIFY_OPTIONS: [], // Sẽ được load từ API batch/getbatchcategories
      TEM_OPTIONS: [], // Sẽ được load từ API stamptemplate/getall
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

  componentDidMount() {
    console.log("🚀 Product Component Mounted");
    const { getListTypeZoneProperty } = this.props;
    
    /* Fetch Summary - load all data without date filter */
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

    // Fetch danh sách nhật ký (traces)
    console.log("📞 Gọi fetchDiaryOptions()");
    this.fetchDiaryOptions();

    // Fetch danh sách phân loại (categories)
    console.log("📞 Gọi fetchClassifyOptions()");
    this.fetchClassifyOptions();

    // Fetch danh sách dải tem (stamp templates)
    console.log("📞 Gọi fetchStampTemplateOptions()");
    this.fetchStampTemplateOptions();
  }

  fetchDiaryOptions = async () => {
    try {
      console.log("🔄 Bắt đầu fetch danh sách nhật ký từ API: batch/gettraces");
      const result = await fetchData.consignments.getListDiaryComboBox();
      console.log("📥 API Response nhật ký:", result);
      
      if (result && Array.isArray(result)) {
        console.log("✅ Có dữ liệu, đang format...");
        // Format dữ liệu từ API thành DIARY_OPTIONS
        const formattedDiaries = result.map((item) => ({
          id: item.id || item.ID,
          title: item.traceName || item.name || item.title || "",
          traceName: item.traceName || "",
          createdAt: item.createdDate || item.CreatedDate || "",
          quantity: item.quantity || item.Quantity || 0,
          location: item.planZoneName || item.location || "",
          product: item.productName || item.product || "",
          unit: item.unitName || item.unit || "",
        }));
        
        console.log("📋 Formatted DIARY_OPTIONS:", formattedDiaries);
        this.setState((previousState) => ({
          ...previousState,
          DIARY_OPTIONS: formattedDiaries,
        }), () => {
          console.log("✨ State DIARY_OPTIONS updated:", this.state.DIARY_OPTIONS);
        });
      } else {
        console.warn("⚠️ API trả về data không phải array hoặc rỗng:", result);
      }
    } catch (error) {
      console.error("❌ Lỗi fetch danh sách nhật ký:", error);
    }
  }

  fetchClassifyOptions = async () => {
    try {
      console.log("🔄 Bắt đầu fetch danh sách phân loại từ API: batch/getbatchcategories");
      const result = await fetchData.consignments.getListClassifyComboBox();
      console.log("📥 API Response phân loại:", result);
      
      if (result && Array.isArray(result)) {
        console.log("✅ Có dữ liệu phân loại, đang format...");
        // Format dữ liệu từ API thành CLASSIFY_OPTIONS
        // API trả về { id, description }
        const formattedClassifies = result.map((item) => ({
          id: item.id || item.ID,
          title: item.description || item.name || item.title || item.categoryName || "",
        }));
        
        console.log("📋 Formatted CLASSIFY_OPTIONS:", formattedClassifies);
        this.setState((previousState) => ({
          ...previousState,
          CLASSIFY_OPTIONS: formattedClassifies,
        }), () => {
          console.log("✨ State CLASSIFY_OPTIONS updated:", this.state.CLASSIFY_OPTIONS);
        });
      } else {
        console.warn("⚠️ API phân loại trả về data không phải array hoặc rỗng:", result);
      }
    } catch (error) {
      console.error("❌ Lỗi fetch danh sách phân loại:", error);
    }
  }

  fetchStampTemplateOptions = async () => {
    try {
      console.log("🔄 Bắt đầu fetch danh sách dải tem từ API: stampranges/getstamprange");
      const result = await fetchData.consignments.getListStampTemplate();
      console.log("📥 API Response dải tem:", result);
      
      // API returns { status, message, data: { stampRanges: [...] } }
      let stampRanges = [];
      
      if (result && result.stampRanges && Array.isArray(result.stampRanges)) {
        stampRanges = result.stampRanges;
      } else if (result && result.data && result.data.stampRanges && Array.isArray(result.data.stampRanges)) {
        stampRanges = result.data.stampRanges;
      } else if (Array.isArray(result)) {
        stampRanges = result;
      }
      
      if (stampRanges && stampRanges.length > 0) {
        console.log("✅ Có dữ liệu dải tem, đang format...", stampRanges);
        // Format dữ liệu từ API thành TEM_OPTIONS
        // Mỗi dải tem hiển thị: "startNum - endNum" (ví dụ: "281 - 281" hoặc "277 - 278")
        const formattedStamps = stampRanges.map((stamp) => ({
          id: stamp.id,
          title: `${stamp.startNum} - ${stamp.endNum}`,
        }));
        
        console.log("📋 Formatted TEM_OPTIONS:", formattedStamps);
        this.setState((previousState) => ({
          ...previousState,
          TEM_OPTIONS: formattedStamps,
        }), () => {
          console.log("✨ State TEM_OPTIONS updated:", this.state.TEM_OPTIONS);
        });
      } else {
        console.warn("⚠️ API dải tem trả về data không phải array hoặc rỗng:", result);
        this.setState((previousState) => ({
          ...previousState,
          TEM_OPTIONS: [],
        }));
      }
    } catch (error) {
      console.error("❌ Lỗi fetch danh sách dải tem:", error);
      this.setState((previousState) => ({
        ...previousState,
        TEM_OPTIONS: [],
      }));
    }
  }

  fetchSummary = (data) => {
    this.setState({ isLoaded: true });

    const { limit } = this.state;
    
    // Parse filter parameters from data
    let filterParams = {
      page: 0,
      limit: limit,
      search: "",
      filter: "",
      orderBy: "",
    };

    if (data) {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        filterParams = {
          page: parsedData.page || 0,
          limit: parsedData.limit || limit,
          search: parsedData.search || "",
          filter: parsedData.filter || "",
          orderBy: parsedData.orderBy || "",
          fromDate: parsedData.fromDate,
          toDate: parsedData.toDate,
        };
      } catch (e) {
        console.error("Error parsing filter params:", e);
      }
    }

    // Call Consignment API (batch/getlist)
    fetchData.consignments
      .getListConsignment(filterParams)
      .then((res) => {
        // Handle null/undefined response
        if (!res) {
          this.setState({ isLoaded: false, data: [], collapseList: [] });
          return;
        }

        // API returns { batchs: [...] }
        let reports = res?.batchs || [];
        
        // Ensure reports is an array
        if (!Array.isArray(reports)) {
          reports = [];
        }

        // Apply client-side filtering if needed
        if (filterParams.filter && reports.length > 0) {
          reports = reports.filter((item) => {
            return item.Status === parseInt(filterParams.filter);
          });
        }

        // Apply date filtering
        if ((filterParams.fromDate || filterParams.toDate) && reports.length > 0) {
          reports = reports.filter((item) => {
            // Use RequestedDate instead of CreatedDate
            if (!item.RequestedDate) return true;
            
            // Parse item.RequestedDate (format: 2025-11-19T15:19:26.813)
            const requestedDate = moment(item.RequestedDate);
            
            // Parse fromDate (format: "DD-MM-YYYY" string)
            let fromDate = null;
            if (filterParams.fromDate) {
              fromDate = moment(filterParams.fromDate, "DD-MM-YYYY");
            }
            
            // Parse toDate (format: "DD-MM-YYYY" string)
            let toDate = null;
            if (filterParams.toDate) {
              toDate = moment(filterParams.toDate, "DD-MM-YYYY");
            }

            let isValid = true;
            if (fromDate && fromDate.isValid()) {
              isValid = isValid && requestedDate.isSameOrAfter(fromDate, "day");
            }
            if (toDate && toDate.isValid()) {
              isValid = isValid && requestedDate.isSameOrBefore(toDate, "day");
            }
            return isValid;
          });
        }

        let collapseList = [];
        if (Array.isArray(reports)) {
          reports.forEach((item) => {
            collapseList.push({ id: item.ID, collapse: false });
          });
        }

        const total = reports.length | 0;
        const length = reports.length;

        // Transform API data to match table format
        const tableData = reports.map((item, index) => ({
          id: item.ID,
          batchNumber: item.BatchNum,
          productId: item.ProductName,
          quantity: item.Quantity || 0,
          unit: item.UnitName || "kg",
          requestDate: item.RequestedDate
            ? moment(item.RequestedDate).format("DD/MM/YYYY HH:mm")
            : "",
          status: item.Status || 0,
          parentID: "",
          index: index + 1,
          color: "",
        }));

        this.setState({
          data: tableData,
          listLength: total,
          totalPage: Math.ceil(length / limit),
          isLoaded: false,
          collapseList: collapseList,
          totalElement: total,
          beginItem: 0,
          endItem: limit,
          currentPage: 1,
        });
      })
      .catch((error) => {
        console.error("Lỗi fetch dữ liệu:", error);
        this.setState({ isLoaded: false });
        toast.error("Lỗi khi tải dữ liệu");
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

  applyFilters = () => {
    const { fromDate, toDate, filter } = this.state;
    
    // If all filters are empty, reset and reload all
    if (!fromDate && !toDate && (!filter || !filter.filter)) {
      this.handleSubmitSearchForm();
      return;
    }
    
    this.fetchSummary(
      JSON.stringify({
        search: "",
        filter: filter && filter.filter ? filter.filter : "",
        fromDate,
        toDate,
        orderBy: "",
        page: null,
        limit: null,
      })
    );
  };

  handleSubmitSearchForm = () => {
    // Reset filters to default
    this.setState({
      fromDate: "",
      toDate: "",
      filter: {
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
    }, () => {
      // After state updated, fetch all data
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    });
  };

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      this.onCloseModal();
      closeModal();
    } else {
      openModal();
    }
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

    // Validate required fields
    if (!dataInsert.batchNumber) {
      errorInserts.batchNumber = "Số lô hàng không được bỏ trống";
    }

    if (!dataInsert.diaryId) {
      errorInserts.diaryId = "Vui lòng chọn nhật ký";
    }

    if (!dataInsert.quantity || dataInsert.quantity < 1) {
      errorInserts.quantity = "Số lượng phải lớn hơn 0";
    }

    if (!dataInsert.classifyId) {
      errorInserts.classifyId = "Vui lòng chọn phân loại";
    }

    if (!dataInsert.temId) {
      errorInserts.temId = "Vui lòng chọn dải tem";
    }

    if (!dataInsert.fromVal && dataInsert.fromVal !== 0) {
      errorInserts.fromVal = "Vui lòng nhập dải tem từ";
    }

    if (!dataInsert.toVal && dataInsert.toVal !== 0) {
      errorInserts.toVal = "Vui lòng nhập dải tem đến";
    }

    // Validate market selection
    if (!dataInsert.marketId || (dataInsert.marketId !== 1 && dataInsert.marketId !== 2)) {
      errorInserts.marketId = "Vui lòng chọn thị trường";
    }

    // Validate province/country based on market selection
    if (dataInsert.marketId === 1 && !dataInsert.provinceId) {
      errorInserts.provinceId = "Vui lòng chọn tỉnh/thành phố";
    }

    if (dataInsert.marketId === 2 && !dataInsert.countryId) {
      errorInserts.countryId = "Vui lòng chọn nước";
    }

    return errorInserts;
  };

  onConfirm = async (toggleModal, closePopup) => {
    const { dataInsert, editId } = this.state;

    // Validate data
    const errorInserts = this.checkDataInsert(true);
    if (Object.keys(errorInserts).length > 0) {
      this.setState({ errorInserts });
      return;
    }

    this.setState({ isLoaded: true });

    try {
      const formData = new FormData();

      // Add ID if editing
      if (dataInsert.id) {
        formData.append("Id", dataInsert.id);
      }

      // Append form data
      formData.append("BatchNum", dataInsert.batchNumber || "");
      formData.append("DiaryID", dataInsert.diaryId || "");
      formData.append("ClassifyID", dataInsert.classifyId || "");
      formData.append("TemID", dataInsert.temId || "");
      formData.append("Quantity", dataInsert.quantity || 1);
      formData.append("Location", dataInsert.placeVal || "");
      formData.append("ProductName", dataInsert.productVal || "");
      formData.append("Notes", dataInsert.noteVal || "");
      formData.append("UnitID", dataInsert.unitVal || "");
      formData.append("FromValue", dataInsert.fromVal || "");
      formData.append("ToValue", dataInsert.toVal || "");
      formData.append("MarketID", dataInsert.marketId || null);
      formData.append("ProvinceID", dataInsert.provinceId || null);
      formData.append("CountryID", dataInsert.countryId || null);
      formData.append("WarehouseID", dataInsert.warehouseId || null);

      // Append file if exists
      if (dataInsert.file && dataInsert.file instanceof File) {
        formData.append("File", dataInsert.file);
      }

      // Call API
      let result;
      if (dataInsert.id) {
        // Update
        result = await fetchData.consignments.editConsignment(formData);
      } else {
        // Create
        result = await fetchData.consignments.addConsignment(formData);
      }

      if (result) {
        const message = dataInsert.id
          ? "Cập nhật lô hàng thành công!"
          : "Thêm lô hàng thành công!";
        toast.success(message);

        // Close modal and refresh data
        if (toggleModal) {
          toggleModal();
        }

        // Reset form
        this.setState({
          isShowForEdit: false,
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
      } else {
        toast.error(
          dataInsert.id
            ? "Cập nhật lô hàng thất bại!"
            : "Thêm lô hàng thất bại!"
        );
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      console.error("Lỗi khi lưu lô hàng:", error);
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
      isShowForEdit: false,
      editId: null,
      dataInsert: {},
      errorInserts: {},
    });
  };

  onEditData = (item) => async () => {
    if (!item || !item.id) return;

    this.setState({ isLoaded: true });

    try {
      // Load detail data from API
      const detailData = await fetchData.consignments.getDetailConsignment(item.id);

      if (detailData) {
        const batch = detailData.batch || detailData;
        const initialData = {
          id: item.id,
          batchId: batch.batchID || batch.BatchID || "",
          diaryId: batch.diaryID || batch.DiaryID || null,
          classifyId: batch.classifyID || batch.ClassifyID || null,
          temId: batch.temID || batch.TemID || null,
          batchNumber: batch.batchNumber || batch.BatchNum || "",
          placeVal: batch.location || batch.Location || "",
          productVal: batch.productName || batch.ProductName || "",
          noteVal: batch.notes || batch.Notes || "",
          unitVal: batch.unitID || batch.UnitID || batch.unitName || batch.UnitName || "",
          quantity: batch.quantity || batch.Quantity || 1,
          fromVal: batch.fromValue || batch.FromValue || "",
          toVal: batch.toValue || batch.ToValue || "",
          marketId: batch.marketID || batch.MarketID || null,
          provinceId: batch.provinceID || batch.ProvinceID || null,
          countryId: batch.countryID || batch.CountryID || null,
          warehouseId: batch.warehouseID || batch.WarehouseID || null,
        };

        this.setState({
          isShowForEdit: true,
          editId: item.id,
          dataInsert: initialData,
          isLoaded: false,
        });
      } else {
        toast.error("Không tải được dữ liệu chi tiết!");
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết lô hàng:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      this.setState({ isLoaded: false });
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

  renderTreeLine = (nodelv) => {
    let line = "";

    for (let i = 0; i < nodelv; i++) {
      line += "-";
    }

    return line;
  };

  showTitleWithStatus = (id) => {
    const { STATUS_OPTIONS } = this.state;

    let queue = Array.isArray(STATUS_OPTIONS) ? [...STATUS_OPTIONS] : [];

    while (queue && queue.length > 0) {
      const status = queue.shift();

      if (status && status.id === id) {
        return status.title;
      }

      if (status && status.children && Array.isArray(status.children) && status.children.length > 0) {
        queue.push(...status.children);
      }
    }

    return "";
  };

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = [];
    }
    if (!Array.isArray(collapseList)) {
      return [];
    }
    
    let list = [];
    let parentid = [];
    let autoIndex = 0;

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach((e) => parentid.push(e.id));

    const cb = (e, key, array) => {
      const renderClass =
        (!e.parentID || e.parentID.length === 0)
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
      if (e.children && Array.isArray(e.children)) {
        e.children.forEach(cb);
      }
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
                    {/* Header */}
                    <HeaderTable
                      dataReload={() => {
                        this.setState({
                          fromDate: "",
                          toDate: "",
                          filter: {
                            search: "",
                            filter: "",
                            orderBy: "",
                            page: null,
                            limit: null,
                          },
                        }, () => {
                          this.fetchSummary(
                            JSON.stringify({
                              search: "",
                              filter: "",
                              orderBy: "",
                              page: null,
                              limit: null,
                            })
                          );
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
                          initialData={isShowForEdit ? this.state.dataInsert : null}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          onLoadDetailData={(data) => {
                            this.setState({ dataInsert: data });
                          }}
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
                                    placeholder: "dd/mm/yyyy",
                                    to: "fromDate",
                                  }}
                                  value={fromDate || ""}
                                  timeFormat={false}
                                  dateFormat="DD-MM-YYYY"
                                  onChange={(value) => {
                                    const newFromDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    this.setState({ fromDate: newFromDate });
                                  }}
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
                                  onChange={(value) => {
                                    const newToDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    this.setState({ toDate: newToDate });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Trạng thái
                              </label>
                              <div>
                                <Select
                                  key={filter && filter.filter ? filter.filter : "empty"}
                                  name="filter"
                                  title="Lọc theo trạng thái"
                                  data={STATUS_OPTIONS}
                                  labelName="title"
                                  val="id"
                                  defaultValue={filter && filter.filter ? filter.filter : null}
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
                                  this.applyFilters();
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
                  initialData={null}
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
