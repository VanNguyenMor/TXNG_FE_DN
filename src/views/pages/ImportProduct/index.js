import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import {
  IMPORT_PRODUCT,
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
  Modal,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class ImportProduct extends Component {
  constructor(props) {
    super(props);

    const dataMock = [
      {
        id: 1,
        receiptNumber: "N001",
        creationDate: "2025-11-17",
        supplier: "Công ty A",
        importer: "Nguyễn A",
        status: 1,
      },
      {
        id: 2,
        receiptNumber: "N002",
        creationDate: "2025-11-16",
        supplier: "Công ty B",
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
      headerTitle: IMPORT_PRODUCT,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      fromDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      toDate: new Date(),
      currentPage: 0,
      filter: {
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
      dataInsert: {
        receiptNumber: "",
        creationDate: new Date(),
        supplier: "",
        importer: "",
        importerId: "",
        note: "",
        status: 0,
      },
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      approveWarningPopupModal: false,
      approveId: null,
      lockPopupModal: false,
      lockId: null,
      requireConfirmPopupModal: false,
      requireConfirmId: null,
      unConfirmPopupModal: false,
      unConfirmId: null,
      unConfirmReason: "",
      unConfirmContent1: "",
      confirmGR: false,
      popupMessage: null,
      STATUS_OPTIONS: [
        { id: 0, name: "Mới tạo" },
        { id: 1, name: "Chờ duyệt" },
        { id: 2, name: "Đã duyệt" },
        { id: 3, name: "Không duyệt" },
        { id: 4, name: "Chờ duyệt lại" },
      ],
      SUPPLIER_LIST: [],
      USER_LIST: [],
      INGREDIENT_LIST: [],
      PRODUCT_LIST: [],
      WAREHOUSE_LIST: [],
      UNIT_LIST: [
        { id: 1, name: "Cái" },
        { id: 2, name: "Chiếc" },
      ],
    };

    // Store suppliers in instance variable for quick access
    this.loadedSuppliers = [];
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
    this.fetchSummary();

    /* Load suppliers */
    this.loadSuppliers();

    /* Load materials */
    this.loadMaterials();

    /* Load warehouses */
    this.loadWarehouses();

    /* Load products */
    this.loadProducts();

    /* Load company config (confirmGR) */
    this.loadCompanyConfig();

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

  loadCompanyConfig = async () => {
    try {
      const config = await fetchData.companyConfig.get();
      this.setState({ confirmGR: config?.confirmGR || false });
    } catch (error) {
      this.setState({ confirmGR: false });
    }
  };

  loadSuppliers = async () => {
    try {
      const suppliers = await fetchData.partner.getList({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      });

      let supplierList = [];
      if (suppliers && Array.isArray(suppliers)) {
        supplierList = suppliers.map((item) => {
          const supplierId =
            item.id || item.ID || item.partnerID || item.partner_id || "";
          return {
            id: String(supplierId),
            name: item.partnerName || item.PartnerName || item.name || "",
          };
        });
      }

      this.loadedSuppliers = supplierList;

      this.setState({
        SUPPLIER_LIST:
          supplierList.length > 0 ? supplierList : this.state.SUPPLIER_LIST,
      });
    } catch (error) {}
  };

  loadMaterials = async () => {
    try {
      const response = await fetchData.materialManagement.getAll();

      let materialList = [];
      // Handle API response structure: { data: { materials: [...] } }
      let materials = [];
      
      if (response && response.data && Array.isArray(response.data.materials)) {
        materials = response.data.materials;
      } else if (response && Array.isArray(response)) {
        materials = response;
      } else if (response && response.materials && Array.isArray(response.materials)) {
        materials = response.materials;
      }

      if (materials && Array.isArray(materials)) {
        materialList = materials.map((item) => ({
          id: String(item.id || item.ID || ""),
          name:
            item.materialName ||
            item.name ||
            item.MaterialName ||
            item.groupName ||
            "",
          unit: item.unitName || item.unit || item.Unit || "",
          unitId: String(item.unitID || item.unitId || item.UnitID || ""),
        }));
      }

      this.setState({
        INGREDIENT_LIST:
          materialList.length > 0 ? materialList : this.state.INGREDIENT_LIST,
      });
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };

  loadWarehouses = async () => {
    try {
      const warehouses = await fetchData.warehouse.getList({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      });

      let warehouseList = [];
      if (warehouses && Array.isArray(warehouses)) {
        warehouseList = warehouses.map((item) => ({
          id: String(item.id || item.ID || ""),
          name: item.warehouseName || item.WarehouseName || item.name || "",
        }));
      }

      this.setState({
        WAREHOUSE_LIST:
          warehouseList.length > 0 ? warehouseList : this.state.WAREHOUSE_LIST,
      });
    } catch (error) {}
  };

  loadProducts = async () => {
    try {
      const products = await fetchData.product.getListComboBox({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      });

      let productList = [];
      if (products && Array.isArray(products)) {
        productList = products.map((item) => ({
          id: String(item.id || item.ID || ""),
          name: item.productName || item.ProductName || item.name || "",
          unit: item.unitName || item.unit || item.Unit || "",
          unitId: String(item.unitId || item.UnitID || item.unitID || ""),
        }));
      }

      this.setState({
        PRODUCT_LIST:
          productList.length > 0 ? productList : this.state.PRODUCT_LIST,
      });
    } catch (error) {}
  };

  fetchSummary = async (data) => {
    this.setState({ isLoaded: true });

    try {
      const { limit, fromDate, toDate, filter } = this.state;

      let fromDateString = "";
      let toDateString = "";

      if (fromDate && moment(fromDate).isValid()) {
        fromDateString = moment(fromDate).format("YYYY-MM-DD");
      }

      if (toDate && moment(toDate).isValid()) {
        toDateString = moment(toDate).format("YYYY-MM-DD");
      }

      const payload = {
        fromDate: fromDateString,
        toDate: toDateString,
        status: filter?.filter ? parseInt(filter.filter) : null,
        search: filter?.search || "",
        filter: filter?.filter || "",
        orderBy: filter?.orderBy || "",
        page: 0,
        limit: limit,
        init: true,
      };

      const res = await fetchData.goodReceived.getList(payload);

      if (!res) {
        this.setState({ isLoaded: false, data: [], collapseList: [] });
        return;
      }

      let goodReceivedList = [];

      if (
        res?.data?.data?.goodsReceipts &&
        Array.isArray(res.data.data.goodsReceipts)
      ) {
        goodReceivedList = res.data.data.goodsReceipts;
      } else if (res?.goodsReceipts && Array.isArray(res.goodsReceipts)) {
        goodReceivedList = res.goodsReceipts;
      } else if (
        res?.data?.goodsReceipts &&
        Array.isArray(res.data.goodsReceipts)
      ) {
        goodReceivedList = res.data.goodsReceipts;
      } else if (res?.data && Array.isArray(res.data)) {
        goodReceivedList = res.data;
      } else if (Array.isArray(res)) {
        goodReceivedList = res;
      }

      let collapseList = [];

      let tableData = goodReceivedList.map((item, index) => ({
        id: item.id || item.ID,
        receiptNumber:
          item.grCode || item.ReceiptNumber || item.receiptNumber || "",
        creationDate: item.grTime
          ? moment(item.grTime).format("DD/MM/YYYY")
          : item.creationDate
          ? moment(item.creationDate).format("DD/MM/YYYY")
          : "",
        supplier: item.partnerName || item.Supplier || item.supplier || "",
        importer: item.confirmedByName || item.Importer || item.importer || "",
        status: item.status || item.Status || 0,
        parentID: "",
        index: index + 1,
        color: "",
      }));

      tableData.forEach((item, key) => {
        collapseList.push({ id: item.id, collapse: false });
      });

      const total = tableData.length | 0;
      const beginItem = 0;
      const endItem = Math.min(limit, total);

      this.setState({
        data: tableData,
        listLength: total,
        totalElement: endItem,
        beginItem: beginItem,
        endItem: endItem,
        currentPage: 0,
        totalPage: Math.ceil(total / limit),
        collapseList: collapseList,
        isLoaded: false,
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nhập hàng!");
      this.setState({ isLoaded: false, data: [], collapseList: [] });
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

  handleFromDateChange = (date) => {
    this.setState({ fromDate: date });
  };

  handleToDateChange = (date) => {
    this.setState({ toDate: date });
  };

  handleDataReload = () => {
    // Reset all filters
    const today = new Date();
    const fromDateValue = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    
    this.setState(
      {
        fromDate: fromDateValue,
        toDate: new Date(),
        filter: {
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        },
      },
      () => {
        // Reload data after state reset
        this.fetchSummary();
      }
    );
  };

  handleSubmitSearchForm = () => {
    const { fromDate, toDate, filter } = this.state;

    // Show alert if no filters selected
    if (!fromDate && !toDate && (!filter.filter || filter.filter === "")) {
      toast.warning("Vui lòng chọn ít nhất một bộ lọc!");
      return;
    }

    // Call fetchSummary which will use the current state
    this.fetchSummary();
  };

  handleModal = async (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
      // Reset form data when closing modal
      this.setState((previousState) => {
        return {
          ...previousState,
          isShowForEdit: false,
          editId: null,
          dataInsert: {
            receiptNumber: "",
            creationDate: new Date(),
            supplier: "",
            importer: "",
            importerId: "",
            note: "",
            status: 0,
            importTypeId: null,
            ingredientId: null,
            supplierId: null,
            productId: null,
            warehouseId: null,
            file: "",
            files: [],
            existingFiles: [],
            unit: "",
            quantity: 0,
            vat: 0,
            price: 0,
            grDetails: [],
          },
          errorInserts: {},
        };
      });
    } else {
      const resCurrentCompany = await fetchData.account.getCurrentCompany();
      const currentUserId = resCurrentCompany?.company?.id || "";
      const currentUserName = resCurrentCompany?.company?.companyName || "";
      console.log(resCurrentCompany, "currentUserName=======")
     
      this.setState((previousState) => {
        return {
          ...previousState,
          dataInsert: {
            ...previousState.dataInsert,
            importer: currentUserName,
            importerId: currentUserId,
          },
        };
      });

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

    if (!dataInsert.supplier || String(dataInsert.supplier).trim() === "") {
      errorInserts.supplier = "Nhà cung cấp không được bỏ trống";
    }

    if (!dataInsert.importer || String(dataInsert.importer).trim() === "") {
      errorInserts.importer = "Người nhập không được bỏ trống";
    }

    return errorInserts;
  };

  onConfirm = async (toggleModal, closePopup) => {
    const formData = this.formRef?.state || this.state.dataInsert;
    const { editId } = this.state;
    
    const importerId = formData.importerId || this.state.dataInsert.importerId || "";
    
    const errorInserts = {};
    
    if (!formData.supplier || String(formData.supplier).trim() === "") {
      errorInserts.supplier = "Nhà cung cấp không được bỏ trống";
    }

    if (!formData.importer || String(formData.importer).trim() === "") {
      errorInserts.importer = "Người nhập không được bỏ trống";
    }
    
    console.log("formData:", formData);
    console.log("importerId:", importerId);
    
    // Check validation
    if (Object.keys(errorInserts).length > 0) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate GRDetails is not empty
    if (!formData.grDetails || formData.grDetails.length === 0) {
      toast.error("Vui lòng thêm chi tiết phiếu nhập!");
      return;
    }

    this.setState({ isLoaded: true });

    try {
      let res;

      const formPayload = new FormData();
      console.log(formData.importer, "formData.importer=======");
      // Add simple fields
      formPayload.append("GRTime", moment(formData.creationDate).toISOString());
      formPayload.append("PartnerID", formData.supplierId || "");
      formPayload.append("ReceiptPerson", importerId || "");
      formPayload.append("ReceiptPersonName", formData.importer || "");
      formPayload.append("Note", formData.note || "");
      formPayload.append("GRType", formData.importTypeId ? parseInt(formData.importTypeId) : 0);
      
      // Add GRDetails as JSON string
      formPayload.append("GRDetails", JSON.stringify(
        (formData.grDetails || []).map(detail => ({
          ID: detail.id || "",
          MaterialID: detail.ingredientId || detail.productId || "",
          UnitID: detail.unit || "",
          Quantity: detail.quantity || 0,
          UnitPrice: detail.price || 0,
          PerVAT: detail.vat || 0,
          WarehouseID: detail.warehouseId || "",
          RefQRCode: detail.refQRCode || "",
        }))
      ));

      // StrFile: danh sách chứng từ đã có được GIỮ LẠI (nối bằng ";"). Backend
      // gán Files = StrFile, nên nếu không gửi thì các chứng từ cũ sẽ bị xóa.
      const keptFiles = Array.isArray(formData.existingFiles)
        ? formData.existingFiles.map((f) => f.url).filter(Boolean)
        : [];
      formPayload.append("StrFile", keptFiles.join(";"));

      // FilesFiles: các tệp mới chọn để upload
      if (
        formData.files &&
        Array.isArray(formData.files) &&
        formData.files.length > 0
      ) {
        formData.files.forEach((file) => {
          formPayload.append(`FilesFiles`, file);
        });
      }

      console.log("formPayload:", formPayload);

      if (editId) {
        // Update - add ID
        formPayload.append("ID", editId);
        res = await fetchData.goodReceived.edit(formPayload);
      } else {
        // Create
        res = await fetchData.goodReceived.add(formPayload);
      }

      if (res && res.status === 200) {
        toast.success(
          editId ? "Cập nhật dữ liệu thành công!" : "Thêm dữ liệu thành công!"
        );

        if (toggleModal) {
          toggleModal();
        }

        // Reset form
        this.setState({
          dataInsert: {},
          isShowForEdit: false,
          editId: null,
          isLoaded: false,
        });

        // Reload data
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Thao tác thất bại!");
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      console.error("❌ Error saving good received:", error);
      toast.error("Thao tác thất bại!");
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

  onEditData = (item) => async () => {
    if (!item || !item.id) return;

    this.setState({ isLoaded: true });

    try {
      const detailResponse = await fetchData.goodReceived.getDetail(item.id);

      if (detailResponse) {
        const detailData = detailResponse.goodsReceipt || detailResponse;

        let supplierId = "";

        const supplierList =
          this.loadedSuppliers && this.loadedSuppliers.length > 0
            ? this.loadedSuppliers
            : this.state.SUPPLIER_LIST;

        if (supplierList && supplierList.length > 0) {
          let matchedSupplier = supplierList.find(
            (s) =>
              String(s.id).toLowerCase() ===
              String(detailData.partnerID).toLowerCase()
          );

          if (!matchedSupplier && detailData.receiptPersonName) {
            matchedSupplier = supplierList.find(
              (s) =>
                s.name &&
                s.name.toLowerCase().trim() ===
                  detailData.receiptPersonName.toLowerCase().trim()
            );
          }

          if (!matchedSupplier && detailData.receiptPersonName) {
            const searchName = detailData.receiptPersonName
              .toLowerCase()
              .trim();
            matchedSupplier = supplierList.find(
              (s) => s.name && s.name.toLowerCase().includes(searchName)
            );
          }

          if (!matchedSupplier && detailData.receiptPersonName) {
            const searchName = detailData.receiptPersonName
              .toLowerCase()
              .trim();
            matchedSupplier = supplierList.find(
              (s) => s.name && searchName.includes(s.name.toLowerCase())
            );
          }

          if (matchedSupplier) {
            supplierId = String(matchedSupplier.id);
          } else {
          }
        }

        const importTypeId = detailData.grType === 0 ? "2" : "1";

        let grDetails = [];
        if (detailData.grMores && Array.isArray(detailData.grMores)) {
          grDetails = detailData.grMores.map((item, index) => {
            let warehouseName = "";
            if (this.state.WAREHOUSE_LIST && this.state.WAREHOUSE_LIST.length > 0) {
              const warehouse = this.state.WAREHOUSE_LIST.find(w => String(w.id) === String(item.warehouseID));
              warehouseName = warehouse ? warehouse.name : "";
            }

            return {
              id: item.id || `detail_${Date.now()}_${index}`,
              ingredientId: item.materialID || "",
              productId: item.materialID || "",
              warehouseId: item.warehouseID || "",
              quantity: item.quantity || 0,
              price: item.unitPrice || 0,
              vat: item.perVAT || 0,
              unit: item.unitID || "",
              unitName: item.unitName || "",
              amount: item.amount || 0,
              ingredientName: item.materialName || "",
              productName: item.materialName || "",
              warehouseName: warehouseName || "",
              refQRCode: item.refQRCode || "",
            };
          });

          // Resolve unit name from the materialUnits list returned by the detail
          // API (the GRDetail row only stores unitID, so its joined UnitName can
          // be empty). Match each line's unitID against materialUnits, mirroring
          // the mobile app. materialUnits comes alongside goodsReceipt in the
          // detail response.
          const materialUnits = Array.isArray(detailResponse.materialUnits)
            ? detailResponse.materialUnits
            : [];

          grDetails.forEach((detail) => {
            if (detail.unitName) return;

            const materialID = detail.ingredientId || detail.productId;

            // Prefer matching by both material and unit, fall back to unitID only.
            const matchedUnit =
              materialUnits.find(
                (u) =>
                  String(u.unitID) === String(detail.unit) &&
                  (String(u.productID) === String(materialID) ||
                    String(u.materialID) === String(materialID))
              ) ||
              materialUnits.find(
                (u) => String(u.unitID) === String(detail.unit)
              );

            if (matchedUnit) {
              detail.unitName = matchedUnit.unitName || "";
            }
          });
        }

        const initialData = {
          id: item.id,
          importTypeId: importTypeId,
          receiptNumber: detailData.grCode || item.receiptNumber || "",
          creationDate: detailData.grTime
            ? moment(detailData.grTime).toDate()
            : new Date(),
          supplierId: detailData.partnerID,
          supplier: detailData.receiptPersonName || item.supplier || "",
          importerId: detailData.confirmedByID || detailData.receiptPerson || "",
          importer:
            detailData.confirmedByName ||
            detailData.receiptPerson ||
            item.importer ||
            "",
          note: detailData.note || "",
          status: detailData.status || item.status || 0,
          grDetails: grDetails,
          // Chứng từ đã đính kèm: chuỗi URL nối bằng ";" -> mảng { name, url }
          existingFiles: (detailData.files || "")
            .split(";")
            .filter(Boolean)
            .map((url) => {
              const parts = url.split("/");
              return {
                url,
                name: decodeURIComponent(parts[parts.length - 1] || url),
              };
            }),
          files: [], // Tệp mới chọn để upload
        };

        this.setState(
          {
            isShowForEdit: true,
            editId: item.id,
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
    this.setState({
      deleteId: id,
      warningPopupModal: true,
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

  handleDeleteRow = async () => {
    const { deleteId } = this.state;

    try {
      const res = await fetchData.goodReceived.delete(deleteId);

      if (res && res.status === 200) {
        this.setState({
          warningPopupModal: false,
        });

        toast.success("Xoá dữ liệu thành công!");

        // Reload data
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Xóa dữ liệu thất bại!");
        this.setState({ warningPopupModal: false });
      }
    } catch (error) {
      console.error("❌ Error deleting good received:", error);
      toast.error("Xóa dữ liệu thất bại!");
      this.setState({ warningPopupModal: false });
    }
  };

  onApproveData = (id) => () => {
    this.setState({
      approveId: id,
      approveWarningPopupModal: true,
    });
  };

  toggleModalPopupApprove = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        approveWarningPopupModal: false,
      };
    });
  };

  handleApproveRow = async () => {
    const { approveId } = this.state;

    try {
      const res = await fetchData.goodReceived.requestConfirm(approveId);

      if (res && res.status === 200) {
        this.setState({
          approveWarningPopupModal: false,
        });

        toast.success("Duyệt lô hàng thành công!");

        // Reload data
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Duyệt lô hàng thất bại!");
        this.setState({ approveWarningPopupModal: false });
      }
    } catch (error) {
      console.error("❌ Error approving good received:", error);
      toast.error("Duyệt lô hàng thất bại!");
      this.setState({ approveWarningPopupModal: false });
    }
  };

  // ===== Khóa phiếu (status 0, khi công ty không bật duyệt -> chốt status 2) =====
  onLockData = (id) => () => {
    this.setState({
      lockId: id,
      lockPopupModal: true,
    });
  };

  toggleModalPopupLock = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        lockPopupModal: false,
      };
    });
  };

  handleLockRow = async () => {
    const { lockId } = this.state;

    try {
      const res = await fetchData.goodReceived.lock(lockId);

      if (res && res.status === 200) {
        this.setState({ lockPopupModal: false });
        toast.success("Khóa phiếu nhập thành công!");
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Khóa phiếu nhập thất bại!");
        this.setState({ lockPopupModal: false });
      }
    } catch (error) {
      console.error("❌ Error locking good received:", error);
      toast.error("Khóa phiếu nhập thất bại!");
      this.setState({ lockPopupModal: false });
    }
  };

  // ===== Yêu cầu duyệt (status 0/3 -> 1) =====
  onRequireConfirm = (id) => () => {
    this.setState({
      requireConfirmId: id,
      requireConfirmPopupModal: true,
    });
  };

  toggleModalPopupRequireConfirm = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        requireConfirmPopupModal: false,
      };
    });
  };

  handleRequireConfirmRow = async () => {
    const { requireConfirmId } = this.state;

    try {
      const res = await fetchData.goodReceived.requireConfirm(requireConfirmId);

      if (res && res.status === 200) {
        this.setState({ requireConfirmPopupModal: false });
        toast.success("Yêu cầu duyệt lô hàng thành công!");
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Yêu cầu duyệt lô hàng thất bại!");
        this.setState({ requireConfirmPopupModal: false });
      }
    } catch (error) {
      console.error("❌ Error requiring confirm good received:", error);
      toast.error("Yêu cầu duyệt lô hàng thất bại!");
      this.setState({ requireConfirmPopupModal: false });
    }
  };

  // ===== Không duyệt (status 0/1/4 -> 3) =====
  onUnConfirm = (id) => () => {
    this.setState({
      unConfirmId: id,
      unConfirmReason: "",
      unConfirmContent1: "",
      unConfirmPopupModal: true,
    });
  };

  toggleModalPopupUnConfirm = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        unConfirmPopupModal: false,
      };
    });
  };

  handleUnConfirmRow = async () => {
    const { unConfirmId, unConfirmReason, unConfirmContent1 } = this.state;

    if (!unConfirmReason || unConfirmReason.trim() === "") {
      toast.error("Vui lòng nhập lý do không duyệt!");
      return;
    }

    try {
      const res = await fetchData.goodReceived.requestUnConfirm(
        unConfirmId,
        unConfirmReason,
        unConfirmContent1
      );

      if (res && res.status === 200) {
        this.setState({ unConfirmPopupModal: false });
        toast.success("Không duyệt lô hàng thành công!");
        this.fetchSummary();
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Không duyệt lô hàng thất bại!");
        this.setState({ unConfirmPopupModal: false });
      }
    } catch (error) {
      console.error("❌ Error un-confirming good received:", error);
      toast.error("Không duyệt lô hàng thất bại!");
      this.setState({ unConfirmPopupModal: false });
    }
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

  renderTable = (
    data,
    isDisableEdit,
    isDisableDelete,
    STATUS_OPTIONS,
    canConfirm,
    canUnConfirm,
    canRequireConfirm,
    canLock
  ) => {
    const { beginItem, endItem, collapseList, confirmGR } = this.state;
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

      // Approve workflow actions available for this row, based on status + claims.
      // Status: 0 = Mới tạo, 1 = Chờ duyệt, 2 = Đã duyệt, 3 = Không duyệt, 4 = Chờ duyệt lại
      const showRequireConfirm =
        confirmGR && canRequireConfirm && (e.status === 0 || e.status === 3);
      const showConfirm =
        canConfirm && (e.status === 1 || e.status === 4);
      const showUnConfirm =
        canUnConfirm && (e.status === 1 || e.status === 4);
      // Khóa phiếu: chỉ khi công ty KHÔNG bật duyệt và phiếu đang ở trạng thái mới tạo
      const showLock = !confirmGR && canLock && e.status === 0;
      const hasApproveAction =
        showRequireConfirm || showConfirm || showUnConfirm || showLock;

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
            <span style={{ color: `${e.color}` }}>{e.supplier}</span>
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span style={{ color: `${e.color}` }}>
              {STATUS_OPTIONS.find((opt) => opt.id === e.status)?.name ||
                "Không xác định"}
            </span>
          </td>
          <td>
            {collapseList
              .filter((item) => item.id === e.id)
              .map((ele, key) => (
                <div key={key}>
                  {isDisableEdit == true &&
                  isDisableDelete == true &&
                  !hasApproveAction ? null : (
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
                        {showLock ? (
                          <DropdownItem onClick={this.onLockData(e.id)}>
                            Khóa phiếu
                          </DropdownItem>
                        ) : null}
                        {showRequireConfirm ? (
                          <DropdownItem onClick={this.onRequireConfirm(e.id)}>
                            Yêu cầu duyệt
                          </DropdownItem>
                        ) : null}
                        {showConfirm ? (
                          <DropdownItem onClick={this.onApproveData(e.id)}>
                            Duyệt
                          </DropdownItem>
                        ) : null}
                        {showUnConfirm ? (
                          <DropdownItem onClick={this.onUnConfirm(e.id)}>
                            Không duyệt
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

    pageData.forEach(cb);
    return list;
  };

  render() {
    const {
      warningPopupModal,
      approveWarningPopupModal,
      lockPopupModal,
      requireConfirmPopupModal,
      unConfirmPopupModal,
      unConfirmReason,
      unConfirmContent1,
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
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      STATUS_OPTIONS,
      SUPPLIER_LIST,
      INGREDIENT_LIST,
      PRODUCT_LIST,
      WAREHOUSE_LIST,
      UNIT_LIST,
      fromDate,
      toDate,
      dataInsert,
    } = this.state;

    const statusPopup = { status: status, message: message };
    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    // Approve workflow claims (match backend GoodReceipts.* claims)
    let canConfirm = false;
    let canUnConfirm = false;
    let canRequireConfirm = false;
    let canLock = false;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
      canConfirm = true;
      canUnConfirm = true;
      canLock = true;
    } else {
      ACCOUNT_CLAIM_FF = localStorage
        .getItem("ACCOUNT_CLAIM_FF")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.Delete").map(
        (y) => (isDisableDelete = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.Confirm").map(
        (y) => (canConfirm = true)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.UnConfirm").map(
        (y) => (canUnConfirm = true)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "GoodReceipts.Lock").map(
        (y) => (canLock = true)
      );
    }

    // Yêu cầu duyệt yêu cầu quyền tạo phiếu (backend RequireConfirm dùng quyền
    // Create, tương ứng claim "GoodReceipts.Add")
    canRequireConfirm = !isDisableAdd;

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
                      dataReload={() => this.handleDataReload()}
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      isReadOnly={dataInsert.status === 2}
                      moduleTitle={
                        isShowForEdit ? "Sửa phiếu nhập" : "Thêm phiếu nhập"
                      }
                      moduleBody={
                        <InsertOrUpdate
                          ref={(ref) => (this.formRef = ref)}
                          id={editId}
                          dataInsert={dataInsert}
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
                                      fromDate: value && value._isAMomentObject
                                        ? value.toDate()
                                        : value || "",
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
                                      toDate: value && value._isAMomentObject
                                        ? value.toDate()
                                        : value || "",
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
                              isDisableDelete,
                              STATUS_OPTIONS,
                              canConfirm,
                              canUnConfirm,
                              canRequireConfirm,
                              canLock
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

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn có chắc muốn duyệt lô hàng này?
                </p>
              }
              warningPopupModal={approveWarningPopupModal}
              toggleModal={this.toggleModalPopupApprove}
              handleWarning={this.handleApproveRow}
            />

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn có chắc muốn yêu cầu duyệt lô hàng này?
                </p>
              }
              warningPopupModal={requireConfirmPopupModal}
              toggleModal={this.toggleModalPopupRequireConfirm}
              handleWarning={this.handleRequireConfirmRow}
            />

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn có chắc muốn khóa phiếu nhập này?
                </p>
              }
              warningPopupModal={lockPopupModal}
              toggleModal={this.toggleModalPopupLock}
              handleWarning={this.handleLockRow}
            />

            <Modal
              className="modal-dialog-centered"
              isOpen={unConfirmPopupModal}
              autoFocus={false}
            >
              <div className="modal-header">
                <h5 className="modal-title text-default-custom">Không duyệt</h5>
              </div>
              <div className="modal-body text-default-custom">
                <div style={{ marginBottom: "12px" }}>
                  <label className="form-control-label">
                    Lý do không duyệt <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="textarea"
                    rows="2"
                    value={unConfirmReason || ""}
                    placeholder="Nhập lý do không duyệt"
                    onChange={(e) =>
                      this.setState({ unConfirmReason: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="form-control-label">
                    Nội dung cần thực hiện lại
                  </label>
                  <Input
                    type="textarea"
                    rows="2"
                    value={unConfirmContent1 || ""}
                    placeholder="Nhập nội dung cần thực hiện lại"
                    onChange={(e) =>
                      this.setState({ unConfirmContent1: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  color="default"
                  className="btn-success-cs"
                  type="button"
                  onClick={this.handleUnConfirmRow}
                >
                  <span>Đồng ý</span>
                </Button>
                <Button
                  color="default"
                  className="btn-danger-cs"
                  type="button"
                  onClick={this.toggleModalPopupUnConfirm}
                >
                  <span>Thoát ra</span>
                </Button>
              </div>
            </Modal>

            <CreateNewPopup
              createNewModal={createNewModal}
              moduleTitle="Thêm dữ liệu"
              type100={true}
              moduleBody={
                <InsertOrUpdate
                  id={editId}
                  dataInsert={dataInsert}
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
  ImportProduct
);
