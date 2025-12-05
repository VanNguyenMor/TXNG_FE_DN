import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import "../../../assets/css/page/config_system.css";
import "./select-search.css";
import {
  QR_SYSTEM_ARISES,
  QR_SYSTEM_LIST,
  SUMMARY_REPORT_PRODUCT_OUTPUT,
  SUMMARY_REPORT_PRODUCT_REGION,
  SUMMARY_REPORT_PRODUCT_SELL,
  SUMMARY_REPORT_SHIPMENT,
  SUMMARY_REPORT_TEM_USE,
} from "../../../helpers/constant";
import PopupMessage from "../../../components/PopupMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { fetchData } from "helpers/fetchData";

import SummaryReportTemUseConfig from "./CpTable/SummaryReportTemUseConfig";
import SummaryReportShipment from "./CpTable/SummaryReportShipment";
import SummaryReportOutput from "./CpTable/SummaryReportOutput";
import SummaryReportRegion from "./CpTable/SummaryReportRegion";
import SummaryReportSell from "./CpTable/SummaryReportSell";
import { Col, Row } from "reactstrap";

class SummaryReport extends Component {
  constructor(props) {
    super(props);

    const limitSummaryReportTemUse = 10;

    const initialShipment = [
      {
        id: 1,
        stt: 1,
        date: "21/11/2025",
        shipmentCode: 13,
        stampQuantity: 2,
      },
    ];
    const limitShipment = 10;

    const initialOutput = [
      {
        stt: 1,
        id: 1,
        product: "Giày bata",
        unit: "kg",
        quantity: 360,
      },
    ];
    const limitOutput = 10;

    const initialRegion = [
      {
        stt: 1,
        id: 1,
        region: "Cty NextLab",
        product: "Giày bata",
        unit: "kg",
        quantity: 360,
      },
    ];
    const limitRegion = 10;

    const initialSell = [
      {
        stt: 1,
        id: 1,
        customer: "Bình Đông",
        product: "Giày Tây Nam",
        unit: "Đôi",
        quantity: 30,
        unitPrice: 1200000,
        vat: "0%",
        totalAmount: 36000000,
        executor: "Công ty Việt Mỹ",
      },
    ];
    const limitSell = 10;

    this.state = {
      currentTab: 0,
      isInsertOrUpdate: false,
      updateId: null,
      dataServer: null,
      dataCompany: null,
      headerSummaryReportTemUse: SUMMARY_REPORT_TEM_USE,
      headerShipment: SUMMARY_REPORT_SHIPMENT,
      headerOutput: SUMMARY_REPORT_PRODUCT_OUTPUT,
      headerRegion: SUMMARY_REPORT_PRODUCT_REGION,
      headerSell: SUMMARY_REPORT_PRODUCT_SELL,
      createNewModal: false,

      // State cho Tab 0 - Báo cáo tem sử dụng
      limitSummaryReportTemUse: limitSummaryReportTemUse,
      beginItemSummaryReportTemUse: 0,
      endItemSummaryReportTemUse: limitSummaryReportTemUse,
      totalElementItemSummaryReportTemUse: 0,
      listLengthSummaryReportTemUse: 0,
      currentPageSummaryReportTemUse: 0,
      insertSummaryReportTemUse: {},
      idSummaryReportTemUse: null,
      dataSummaryReportTemUse: [],
      summaryReportTemUseInfo: {
        totalCount: 0,
        usedCount: 0,
        remainCount: 0,
        badCount: 0,
      },
      fromDateSummaryReportTemUse: moment()
        .subtract(30, "days")
        .format("DD/MM/YYYY"),
      toDateSummaryReportTemUse: moment().format("DD/MM/YYYY"),
      productIdTemUse: "",
      productsTemUse: [],
      isLoadingTemUse: false,

      // State cho Tab 1
      limitShipment: limitShipment,
      beginItemShipment: 0,
      endItemShipment: limitShipment,
      totalElementItemShipment: Math.min(initialShipment.length, limitShipment),
      listLengthShipment: initialShipment.length,
      currentPageShipment: 0,
      insertShipment: {},
      idShipment: null,
      dataShipment: initialShipment,
      fromDateShipment: moment().subtract(30, "days").format("DD/MM/YYYY"),
      toDateShipment: moment().format("DD/MM/YYYY"),
      productIdShipment: "",
      productsShipment: [],
      summaryShipmentInfo: {
        totalCount: 0,
        shipmentCount: 0,
      },
      isLoadingShipment: false,

      // State cho Tab 2
      limitOutput: limitOutput,
      beginItemOutput: 0,
      endItemOutput: limitOutput,
      totalElementItemOutput: Math.min(initialOutput.length, limitOutput),
      listLengthOutput: initialOutput.length,
      currentPageOutput: 0,
      insertOutput: {},
      idOutput: null,
      dataOutput: initialOutput,
      fromDateOutput: moment().subtract(30, "days").format("DD/MM/YYYY"),
      toDateOutput: moment().format("DD/MM/YYYY"),
      productIdOutput: "",
      productsOutput: [],
      isLoadingOutput: false,

      // State cho Tab 3
      limitRegion: limitRegion,
      beginItemRegion: 0,
      endItemRegion: limitRegion,
      totalElementItemRegion: Math.min(initialRegion.length, limitRegion),
      listLengthRegion: initialRegion.length,
      currentPageRegion: 0,
      insertRegion: {},
      idRegion: null,
      dataRegion: initialRegion,
      fromDateRegion: moment().subtract(30, "days").format("DD/MM/YYYY"),
      toDateRegion: moment().format("DD/MM/YYYY"),
      productIdRegion: "",
      plantingZoneIdRegion: "",
      productsRegion: [],
      plantingZonesRegion: [],
      isLoadingRegion: false,

      // State cho Tab 4
      limitSell: limitSell,
      beginItemSell: 0,
      endItemSell: limitSell,
      totalElementItemSell: Math.min(initialSell.length, limitSell),
      listLengthSell: initialSell.length,
      currentPageSell: 0,
      insertSell: {},
      idSell: null,
      dataSell: initialSell,
      fromDateSell: moment().subtract(30, "days").format("DD/MM/YYYY"),
      toDateSell: moment().format("DD/MM/YYYY"),
      productIdSell: "",
      partnerIdSell: "",
      productsSell: [],
      partnersSell: [],
      isLoadingSell: false,

      errorUpdate: {},
      errorInsert: {},
      errorInserts: {},
      errorsInfoCompany: {},
      errorsConfigSystem: {},
      isOpen: false,
      options: [],
      isShowForEdit: false,
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
      CUSTOMER_OPTIONS: [
        {
          id: 1,
          title: "Khách hàng 1",
        },
        {
          id: 2,
          title: "Khách hàng 2",
        },
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
    };
  }

  componentDidMount() {
    this.fetchProductsTemUse();
    this.fetchReportUsedStamp(0);
    // Load Shipment data on mount
    this.fetchProductsShipment();
    this.fetchReportShipment(0);
    // Load Output data on mount
    this.fetchProductsOutput();
    this.fetchReportOutput(0);
    // Load Region data on mount
    this.fetchProductsRegion();
    this.fetchPlantingZonesRegion();
    this.fetchReportRegion(0);
    // Load Sell data on mount
    this.fetchProductsSell();
    this.fetchPartnersSell();
    this.fetchReportSell(0);
  }

  // Fetch products for filter
  fetchProductsTemUse = async () => {
    try {
      const result = await fetchData.summaryReport.getListProductComboBox();
      if (result && Array.isArray(result.products)) {
        const products = result.products.map((item) => ({
          id: item.id,
          title: item.productName,
          productName: item.productName,
        }));
        this.setState({ productsTemUse: products });
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  // Fetch report used stamp data
  fetchReportUsedStamp = async (page = 0) => {
    try {
      this.setState({ isLoadingTemUse: true });
      const {
        limitSummaryReportTemUse,
        fromDateSummaryReportTemUse,
        toDateSummaryReportTemUse,
        productIdTemUse,
      } = this.state;

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDateSummaryReportTemUse
        ? moment(fromDateSummaryReportTemUse, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDateSummaryReportTemUse
        ? moment(toDateSummaryReportTemUse, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.summaryReport.getListReportUsedStampV2(
        page,
        limitSummaryReportTemUse,
        fromDateAPI,
        toDateAPI,
        productIdTemUse
      );

      if (result) {
        const reports = result.reports || [];
        const info = result.info || {
          totalCount: 0,
          usedCount: 0,
          remainCount: 0,
          badCount: 0,
        };

        this.setState({
          dataSummaryReportTemUse: reports,
          summaryReportTemUseInfo: info,
          listLengthSummaryReportTemUse: reports.length,
          totalElementItemSummaryReportTemUse: reports.length,
          currentPageSummaryReportTemUse: page,
          beginItemSummaryReportTemUse: 0,
          endItemSummaryReportTemUse: Math.min(
            limitSummaryReportTemUse,
            reports.length
          ),
          isLoadingTemUse: false,
        });
      }
    } catch (error) {
      console.error("Fetch report error:", error);
      this.setState({ isLoadingTemUse: false });
    }
  };

  // Handle filter change
  handleChangeFilterTemUse = (name) => (value) => {
    this.setState({ [name]: value });
  };

  // Handle reload - reset filters and fetch fresh data
  handleReloadTemUse = () => {
    this.setState(
      {
        productIdTemUse: "",
        fromDateSummaryReportTemUse: moment()
          .subtract(30, "days")
          .format("DD/MM/YYYY"),
        toDateSummaryReportTemUse: moment().format("DD/MM/YYYY"),
        currentPageSummaryReportTemUse: 0,
      },
      () => {
        this.fetchReportUsedStamp(0);
      }
    );
  };

  // Handle search button click
  handleSearchTemUse = () => {
    this.fetchReportUsedStamp(0);
  };

  fetchProductsShipment = async () => {
    try {
      const result = await fetchData.summaryReport.getListProductComboBox();
      if (result && Array.isArray(result.products)) {
        const products = result.products.map((item) => ({
          id: item.id,
          title: item.productName,
          productName: item.productName,
        }));
        console.log("Products Shipment transformed:", products);
        this.setState({ productsShipment: products });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  fetchReportShipment = async (page = 0) => {
    try {
      this.setState({ isLoadingShipment: true });

      const {
        limitShipment,
        fromDateShipment,
        toDateShipment,
        productIdShipment,
      } = this.state;

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDateShipment
        ? moment(fromDateShipment, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDateShipment
        ? moment(toDateShipment, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.summaryReport.getListReportBatchV2(
        page,
        limitShipment,
        fromDateAPI,
        toDateAPI,
        productIdShipment,
      );
      const reports = result?.reports || [];
      const info = result?.info || {
        totalCount: 0,
        shipmentCount: 0,
      };

      const listLength = reports.length;
      const beginItem = page * limitShipment;
      const endItem = Math.min(beginItem + limitShipment, listLength);

      this.setState({
        dataShipment: reports.map((item, index) => ({
          id: item.id,
          stt: index + 1,
          date: item.createdDate
            ? moment(item.createdDate).format("DD/MM/YYYY")
            : "",
          shipmentCode: item.batchNum,
          stampQuantity: item.usedCount,
          collapse: false,
        })),
        summaryShipmentInfo: info,
        listLengthShipment: listLength,
        beginItemShipment: beginItem,
        endItemShipment: endItem,
        totalElementItemShipment: endItem - beginItem,
        currentPageShipment: page,
        isLoadingShipment: false,
      });
    } catch (error) {
      console.error("Lỗi fetch shipment:", error);
      this.setState({ isLoadingShipment: false });
    }
  };

  handleChangeFilterShipment = (name) => (value) => {
    const normalized =
      value && typeof value === "object" && moment.isMoment(value)
        ? value.format("DD/MM/YYYY")
        : value;
    this.setState({ [name]: normalized });
  };

  handleReloadShipment = () => {
    const fromDefault = moment().subtract(30, "days").format("DD/MM/YYYY");
    const toDefault = moment().format("DD/MM/YYYY");

    this.setState(
      {
        productIdShipment: "",
        fromDateShipment: fromDefault,
        toDateShipment: toDefault,
        currentPageShipment: 0,
        isLoadingShipment: true,
      },
      async () => {
        await this.fetchProductsShipment();

        this.fetchReportShipment(0);
      }
    );
  };

  handleSearchShipment = () => {
    this.fetchReportShipment(0);
  };

  // Methods for Tab 2 - Báo cáo sản lượng hàng hóa (Output)
  fetchProductsOutput = async () => {
    try {
      const result = await fetchData.summaryReport.getListProductComboBox();
      if (result && Array.isArray(result.products)) {
        const products = result.products.map((item) => ({
          id: item.id,
          title: item.productName,
          productName: item.productName,
        }));
        console.log("Products Output transformed:", products);
        this.setState({ productsOutput: products });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  fetchReportOutput = async (page = 0) => {
    try {
      this.setState({ isLoadingOutput: true });

      const {
        limitOutput,
        fromDateOutput,
        toDateOutput,
        productIdOutput,
      } = this.state;

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDateOutput
        ? moment(fromDateOutput, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDateOutput
        ? moment(toDateOutput, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.summaryReport.getListReportQuantityProductV2(
        page,
        limitOutput,
        fromDateAPI,
        toDateAPI,
        productIdOutput,
      );
      const reports = result?.reports || [];

      const listLength = reports.length;
      const beginItem = page * limitOutput;
      const endItem = Math.min(beginItem + limitOutput, listLength);

      this.setState({
        dataOutput: reports.map((item, index) => ({
          id: item.id,
          stt: index + 1,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD/MM/YYYY")
            : "",
          productName: item.productName,
          unitName: item.unitName,
          quantity: item.quantity,
          collapse: false,
        })),
        listLengthOutput: listLength,
        beginItemOutput: beginItem,
        endItemOutput: endItem,
        totalElementItemOutput: endItem - beginItem,
        currentPageOutput: page,
        isLoadingOutput: false,
      });
    } catch (error) {
      console.error("Lỗi fetch output:", error);
      this.setState({ isLoadingOutput: false });
    }
  };

  handleChangeFilterOutput = (name) => (value) => {
    const normalized =
      value && typeof value === "object" && moment.isMoment(value)
        ? value.format("DD/MM/YYYY")
        : value;
    this.setState({ [name]: normalized });
  };

  handleReloadOutput = () => {
    const fromDefault = moment().subtract(30, "days").format("DD/MM/YYYY");
    const toDefault = moment().format("DD/MM/YYYY");

    this.setState(
      {
        productIdOutput: "",
        fromDateOutput: fromDefault,
        toDateOutput: toDefault,
        currentPageOutput: 0,
        isLoadingOutput: true,
      },
      async () => {
        await this.fetchProductsOutput();

        this.fetchReportOutput(0);
      }
    );
  };

  handleSearchOutput = () => {
    this.fetchReportOutput(0);
  };

  // Tab 3 - Region Methods
  fetchProductsRegion = async () => {
    try {
      const result = await fetchData.summaryReport.getListProductComboBox();
      
      let productsData = [];
      
      // Handle different response structures
      if (result && Array.isArray(result)) {
        productsData = result;
      } else if (result && Array.isArray(result.products)) {
        productsData = result.products;
      } else if (result && Array.isArray(result.data)) {
        productsData = result.data;
      }
      
      if (productsData.length > 0) {
        const products = productsData.map((item) => ({
          id: item.id,
          title: item.productName,
          productName: item.productName,
        }));
        this.setState({ productsRegion: products });
      } else {
        this.setState({ productsRegion: [] });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      this.setState({ productsRegion: [] });
    }
  };

  fetchPlantingZonesRegion = async () => {
    try {
      const result = await fetchData.summaryReport.getListPlantingZoneComboBox();
      
      let zonesData = [];
      
      // Handle different response structures
      if (result && Array.isArray(result)) {
        zonesData = result;
      } else if (result && Array.isArray(result.plantingZones)) {
        zonesData = result.plantingZones;
      } else if (result && Array.isArray(result.data)) {
        zonesData = result.data;
      }
      
      if (zonesData.length > 0) {
        const zones = zonesData.map((item) => ({
          id: item.id,
          title: item.name,
          name: item.name,
        }));
        this.setState({ plantingZonesRegion: zones });
      } else {
        this.setState({ plantingZonesRegion: [] });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vùng trồng:", error);
      this.setState({ plantingZonesRegion: [] });
    }
  };

  fetchReportRegion = async (page = 0) => {
    try {
      const {
        productIdRegion,
        plantingZoneIdRegion,
        fromDateRegion,
        toDateRegion,
        limitRegion,
      } = this.state;

      this.setState({ isLoadingRegion: true });

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDateRegion
        ? moment(fromDateRegion, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDateRegion
        ? moment(toDateRegion, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.summaryReport.getListReportQuantityProductByPlantingZoneV2(
        page,
        limitRegion,
        fromDateAPI,
        toDateAPI,
        productIdRegion || "",
        plantingZoneIdRegion || ""
      );

      if (result && result.reports && Array.isArray(result.reports)) {
        const reports = result.reports.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        this.setState({
          dataRegion: reports,
          currentPageRegion: page,
          isLoadingRegion: false,
          listLengthRegion: reports.length,
        });
      } else {
        this.setState({
          dataRegion: [],
          isLoadingRegion: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
      this.setState({
        dataRegion: [],
        isLoadingRegion: false,
      });
    }
  };

  handleChangeFilterRegion = (name) => (value) => {
    console.log(`Filter change - ${name}:`, value);
    if (name === "fromDateRegion" || name === "toDateRegion") {
      const momentValue = moment(value);
      const formattedValue = momentValue.isValid()
        ? momentValue.format("DD/MM/YYYY")
        : "";
      this.setState({ [name]: formattedValue });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleReloadRegion = () => {
    const fromDefault = moment().subtract(30, "days").format("DD/MM/YYYY");
    const toDefault = moment().format("DD/MM/YYYY");

    this.setState(
      {
        productIdRegion: "",
        plantingZoneIdRegion: "",
        fromDateRegion: fromDefault,
        toDateRegion: toDefault,
        currentPageRegion: 0,
        isLoadingRegion: true,
      },
      async () => {
        await this.fetchProductsRegion();
        await this.fetchPlantingZonesRegion();

        this.fetchReportRegion(0);
      }
    );
  };

  handleSearchRegion = () => {
    this.fetchReportRegion(0);
  };

  // Tab 4 - Sell Methods
  fetchProductsSell = async () => {
    try {
      const result = await fetchData.summaryReport.getListProductComboBox();
      
      let productsData = [];
      
      if (result && Array.isArray(result)) {
        productsData = result;
      } else if (result && Array.isArray(result.products)) {
        productsData = result.products;
      } else if (result && Array.isArray(result.data)) {
        productsData = result.data;
      }
      
      if (productsData.length > 0) {
        const products = productsData.map((item) => ({
          id: item.id,
          title: item.productName,
          productName: item.productName,
        }));
        this.setState({ productsSell: products });
      } else {
        this.setState({ productsSell: [] });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      this.setState({ productsSell: [] });
    }
  };

  fetchPartnersSell = async () => {
    try {
      const result = await fetchData.summaryReport.getListPartnerComboBox();
      
      let partnersData = [];
      
      if (result && Array.isArray(result)) {
        partnersData = result;
      } else if (result && Array.isArray(result.partners)) {
        partnersData = result.partners;
      } else if (result && Array.isArray(result.data)) {
        partnersData = result.data;
      }
      
      if (partnersData.length > 0) {
        const partners = partnersData.map((item) => ({
          id: item.id,
          title: item.partnerName,
          partnerName: item.partnerName,
        }));
        this.setState({ partnersSell: partners });
      } else {
        this.setState({ partnersSell: [] });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đối tác:", error);
      this.setState({ partnersSell: [] });
    }
  };

  fetchReportSell = async (page = 0) => {
    try {
      const {
        productIdSell,
        partnerIdSell,
        fromDateSell,
        toDateSell,
        limitSell,
      } = this.state;

      this.setState({ isLoadingSell: true });

      // Convert DD/MM/YYYY to YYYY-MM-DD for API
      const fromDateAPI = fromDateSell
        ? moment(fromDateSell, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
      const toDateAPI = toDateSell
        ? moment(toDateSell, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";

      const result = await fetchData.summaryReport.getListReportSellV2(
        page,
        limitSell,
        fromDateAPI,
        toDateAPI,
        productIdSell || "",
        partnerIdSell || ""
      );

      if (result && result.reports && Array.isArray(result.reports)) {
        const reports = result.reports.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));

        this.setState({
          dataSell: reports,
          currentPageSell: page,
          isLoadingSell: false,
          listLengthSell: reports.length,
        });
      } else {
        this.setState({
          dataSell: [],
          isLoadingSell: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
      this.setState({
        dataSell: [],
        isLoadingSell: false,
      });
    }
  };

  handleChangeFilterSell = (name) => (value) => {
    console.log(`Filter change - ${name}:`, value);
    if (name === "fromDateSell" || name === "toDateSell") {
      const momentValue = moment(value);
      const formattedValue = momentValue.isValid()
        ? momentValue.format("DD/MM/YYYY")
        : "";
      this.setState({ [name]: formattedValue });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleReloadSell = () => {
    const fromDefault = moment().subtract(30, "days").format("DD/MM/YYYY");
    const toDefault = moment().format("DD/MM/YYYY");

    this.setState(
      {
        productIdSell: "",
        partnerIdSell: "",
        fromDateSell: fromDefault,
        toDateSell: toDefault,
        currentPageSell: 0,
        isLoadingSell: true,
      },
      async () => {
        await this.fetchProductsSell();
        await this.fetchPartnersSell();

        this.fetchReportSell(0);
      }
    );
  };

  handleSearchSell = () => {
    this.fetchReportSell(0);
  };

  handlePageClickSummaryReportTemUse = (data) => {
    let { limitSummaryReportTemUse, dataSummaryReportTemUse } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitSummaryReportTemUse);

    let beginItemSummaryReportTemUse = offset;
    let endItemSummaryReportTemUse = Math.min(
      offset + limitSummaryReportTemUse,
      dataSummaryReportTemUse.length
    );
    let totalElementItemSummaryReportTemUse =
      endItemSummaryReportTemUse - beginItemSummaryReportTemUse;

    this.setState({
      beginItemSummaryReportTemUse: beginItemSummaryReportTemUse,
      endItemSummaryReportTemUse: endItemSummaryReportTemUse,
      currentPageSummaryReportTemUse: selected,
      totalElementItemSummaryReportTemUse: totalElementItemSummaryReportTemUse,
    });
  };

  onConfirmSummaryReportTemUse = async (toggleModal) => {
    const {
      insertSummaryReportTemUse,
      dataSummaryReportTemUse,
      limitSummaryReportTemUse,
    } = this.state;

    if (
      !insertSummaryReportTemUse.productName ||
      !insertSummaryReportTemUse.code
    ) {
      this.setState({
        messageErr: "Tên sản phẩm và Code không được bỏ trống.",
      });
      this.toggleModal("popupMessage");
      return;
    }

    if (insertSummaryReportTemUse.idSummaryReportTemUse) {
      const updatedData = dataSummaryReportTemUse.map((item) =>
        item.index === insertSummaryReportTemUse.idSummaryReportTemUse
          ? { ...item, ...insertSummaryReportTemUse }
          : item
      );
      this.setState({ dataSummaryReportTemUse: updatedData });
      toast.success("Cập nhật QR Hệ thống thành công!");
    } else {
      const newIndex =
        dataSummaryReportTemUse.length > 0
          ? dataSummaryReportTemUse[dataSummaryReportTemUse.length - 1].index +
            1
          : 1;
      const newMockItem = {
        index: newIndex,
        image: insertSummaryReportTemUse.image || "",
        productName: insertSummaryReportTemUse.productName,
        code: insertSummaryReportTemUse.code,
        warehouseName: insertSummaryReportTemUse.warehouseName || "Unknown",
        collapse: false,
      };

      const newQRData = [...dataSummaryReportTemUse, newMockItem];

      this.setState((prevState) => {
        const newLength = newQRData.length;
        const newTotalPages = Math.ceil(newLength / limitSummaryReportTemUse);
        const lastPageIndex = Math.max(0, newTotalPages - 1);

        const newOffset = lastPageIndex * limitSummaryReportTemUse;
        const newEndItem = Math.min(
          newOffset + limitSummaryReportTemUse,
          newLength
        );

        return {
          dataSummaryReportTemUse: newQRData,
          listLengthSummaryReportTemUse: newLength,
          currentPageSummaryReportTemUse: lastPageIndex,
          beginItemSummaryReportTemUse: newOffset,
          endItemSummaryReportTemUse: newEndItem,
          totalElementItemSummaryReportTemUse: newEndItem - newOffset,
        };
      });

      toast.success("Thêm mới QR Hệ thống thành công!");
    }

    if (toggleModal) {
      toggleModal();
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: false,
        idSummaryReportTemUse: null,
        insertSummaryReportTemUse: {},
      };
    });
  };

  onEditSummaryReportTemUse = (id) => () => {
    const itemToEdit = this.state.dataSummaryReportTemUse.find(
      (item) => item.index === id
    );

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idSummaryReportTemUse: id,
        insertSummaryReportTemUse: {
          ...itemToEdit,
          idSummaryReportTemUse: id,
        },
        errorInserts: {},
      };
    });
  };

  onHandleChangeValueSummaryReportTemUseList = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertQRList: data,
        errorInserts: {},
      };
    });
  };

  toggleSummaryReportTemUse = (el, val) => {
    let { dataSummaryReportTemUse } = this.state;

    dataSummaryReportTemUse
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataSummaryReportTemUse, errorInserts: {} });
  };

  onHandleChangeValueSummaryReportTemUse = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertSummaryReportTemUse: data,
        errorInserts: {},
      };
    });
  };

  handleSubmitSearchFormSummaryReportTemUse = () => {
    console.log("Submit form tìm kiếm với:", {
      fromDateSummaryReportTemUse: this.state.fromDateSummaryReportTemUse,
      toDateSummaryReportTemUse: this.state.toDateSummaryReportTemUse,
    });
  };

  // Method shipment

  handlePageClickShipment = (data) => {
    let { limitShipment, dataShipment } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitShipment);

    let beginItemShipment = offset;
    let endItemShipment = Math.min(offset + limitShipment, dataShipment.length);
    let totalElementItemShipment = endItemShipment - beginItemShipment;

    this.setState({
      beginItemShipment: beginItemShipment,
      endItemShipment: endItemShipment,
      currentPageShipment: selected,
      totalElementItemShipment: totalElementItemShipment,
    });
  };

  onEditShipment = (id) => () => {
    const itemToEdit = this.state.dataShipment.find((item) => item.id === id);

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idShipment: id,
        insertShipment: {
          ...itemToEdit,
          idShipment: id,
        },
        errorInserts: {},
      };
    });
  };

  onHandleChangeValueShipment = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertShipment: data,
        errorInserts: {},
      };
    });
  };

  onConfirmShipment = async (toggleModal) => {
    console.log("Xác nhận thêm/sửa lô hàng:", this.state.insertShipment);

    if (toggleModal) {
      toggleModal();
    }

    this.setState({
      isShowForEdit: false,
      idShipment: null,
      insertShipment: {},
    });
    toast.success("Xử lý Lô hàng thành công!");
  };

  toggleShipment = (el, val) => {
    let { dataShipment } = this.state;

    dataShipment
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataShipment, errorInserts: {} });
  };

  handleSubmitSearchFormShipment = () => {
    this.setState({ currentPageShipment: 0 }, () => {
      this.fetchReportShipment(0);
    });
  };
  // Method output

  handlePageClickOutput = (data) => {
    let { limitOutput, dataOutput } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitOutput);

    let beginItemOutput = offset;
    let endItemOutput = Math.min(offset + limitOutput, dataOutput.length);
    let totalElementItemOutput = endItemOutput - beginItemOutput;

    this.setState({
      beginItemOutput: beginItemOutput,
      endItemOutput: endItemOutput,
      currentPageOutput: selected,
      totalElementItemOutput: totalElementItemOutput,
    });
  };

  onEditOutput = (id) => () => {
    const itemToEdit = this.state.dataOutput.find((item) => item.id === id);

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idOutput: id,
        insertOutput: {
          ...itemToEdit,
          idOutput: id,
        },
        errorInserts: {},
      };
    });
  };

  onHandleChangeValueOutput = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertOutput: data,
        errorInserts: {},
      };
    });
  };

  onConfirmOutput = async (toggleModal) => {
    console.log("Xác nhận thêm/sửa lô hàng:", this.state.insertOutput);

    if (toggleModal) {
      toggleModal();
    }

    this.setState({
      isShowForEdit: false,
      idOutput: null,
      insertOutput: {},
    });
    toast.success("Xử lý Lô hàng thành công!");
  };

  toggleOutput = (el, val) => {
    let { dataOutput } = this.state;

    dataOutput
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataOutput, errorInserts: {} });
  };

  handleSubmitSearchFormOutput = () => {
    console.log("Submit form tìm kiếm với:", {
      fromDateOutput: this.state.fromDateOutput,
      toDateOutput: this.state.toDateOutput,
    });
  };

  // Method region

  handlePageClickRegion = (data) => {
    let { limitRegion, dataRegion } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitRegion);

    let beginItemRegion = offset;
    let endItemRegion = Math.min(offset + limitRegion, dataRegion.length);
    let totalElementItemRegion = endItemRegion - beginItemRegion;

    this.setState({
      beginItemRegion: beginItemRegion,
      endItemRegion: endItemRegion,
      currentPageRegion: selected,
      totalElementItemRegion: totalElementItemRegion,
    });
  };

  onEditRegion = (id) => () => {
    const itemToEdit = this.state.dataRegion.find((item) => item.id === id);

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idRegion: id,
        insertRegion: {
          ...itemToEdit,
          idRegion: id,
        },
        errorInserts: {},
      };
    });
  };

  onHandleChangeValueRegion = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertRegion: data,
        errorInserts: {},
      };
    });
  };

  onConfirmRegion = async (toggleModal) => {
    console.log("Xác nhận thêm/sửa lô hàng:", this.state.insertRegion);

    if (toggleModal) {
      toggleModal();
    }

    this.setState({
      isShowForEdit: false,
      idRegion: null,
      insertRegion: {},
    });
    toast.success("Xử lý Lô hàng thành công!");
  };

  toggleRegion = (el, val) => {
    let { dataRegion } = this.state;

    dataRegion
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataRegion, errorInserts: {} });
  };

  handleSubmitSearchFormRegion = () => {
    console.log("Submit form tìm kiếm với:", {
      fromDateRegion: this.state.fromDateRegion,
      toDateRegion: this.state.toDateRegion,
    });
  };

  // Method sell

  handlePageClickSell = (data) => {
    let { limitSell, dataSell } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitSell);

    let beginItemSell = offset;
    let endItemSell = Math.min(offset + limitSell, dataSell.length);
    let totalElementItemSell = endItemSell - beginItemSell;

    this.setState({
      beginItemSell: beginItemSell,
      endItemSell: endItemSell,
      currentPageSell: selected,
      totalElementItemSell: totalElementItemSell,
    });
  };

  onEditSell = (id) => () => {
    const itemToEdit = this.state.dataSell.find((item) => item.id === id);

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idSell: id,
        insertSell: {
          ...itemToEdit,
          idSell: id,
        },
        errorInserts: {},
      };
    });
  };

  onHandleChangeValueSell = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertSell: data,
        errorInserts: {},
      };
    });
  };

  onConfirmSell = async (toggleModal) => {
    console.log("Xác nhận thêm/sửa lô hàng:", this.state.insertSell);

    if (toggleModal) {
      toggleModal();
    }

    this.setState({
      isShowForEdit: false,
      idSell: null,
      insertSell: {},
    });
    toast.success("Xử lý Lô hàng thành công!");
  };

  toggleSell = (el, val) => {
    let { dataSell } = this.state;

    dataSell
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataSell, errorInserts: {} });
  };

  handleSubmitSearchFormSell = () => {
    console.log("Submit form tìm kiếm với:", {
      fromDateSell: this.state.fromDateSell,
      toDateSell: this.state.toDateSell,
    });
  };

  // Method all

  onChooseTab = (tab) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        currentTab: tab,
        errorsConfigSystem: {},
        errorsInfoCompany: {},
        errorInserts: {},
        isShowForEdit: false,
        idSummaryReportTemUse: null,
        idQRArises: null,
        idQRList: null,
        insertSummaryReportTemUse: {},
        insertQRArises: {},
        insertQRList: {},
      };
    });
  };

  toggleModal = (state, type) => {
    this.setState((prevState) => {
      const nextState = {
        [state]: !prevState[state],
        newDataIn: null,
        newData: null,
        errorInsert: {},
        errorUpdate: {},
      };

      if (prevState[state] === true) {
        nextState.isShowForEdit = false;
        nextState.isShowForListHistory = false;
        nextState.idQRList = null;
      }

      return nextState;
    });
  };

  onConfirm = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isInsertOrUpdate: false,
        updateId: null,
      };
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

  render() {
    const {
      currentTab,
      // Tab 0
      dataSummaryReportTemUse,
      headerSummaryReportTemUse,
      listLengthSummaryReportTemUse,
      totalElementItemSummaryReportTemUse,
      beginItemSummaryReportTemUse,
      endItemSummaryReportTemUse,
      limitSummaryReportTemUse,
      currentPageSummaryReportTemUse,
      idSummaryReportTemUse,
      insertSummaryReportTemUse,
      fromDateSummaryReportTemUse,
      toDateSummaryReportTemUse,

      // Tab 1
      limitShipment,
      beginItemShipment,
      endItemShipment,
      totalElementItemShipment,
      listLengthShipment,
      currentPageShipment,
      insertShipment,
      headerShipment,
      idShipment,
      dataShipment,
      fromDateShipment,
      toDateShipment,
      productIdShipment,
      productsShipment,
      summaryShipmentInfo,
      isLoadingShipment,

      // Tab 2
      headerOutput,
      limitOutput,
      beginItemOutput,
      endItemOutput,
      totalElementItemOutput,
      listLengthOutput,
      currentPageOutput,
      insertOutput,
      idOutput,
      dataOutput,
      fromDateOutput,
      toDateOutput,
      productIdOutput,
      productsOutput,
      isLoadingOutput,

      // Tab 3
      headerRegion,
      limitRegion,
      beginItemRegion,
      endItemRegion,
      totalElementItemRegion,
      listLengthRegion,
      currentPageRegion,
      insertRegion,
      idRegion,
      dataRegion,
      fromDateRegion,
      toDateRegion,
      productIdRegion,
      plantingZoneIdRegion,
      productsRegion,
      plantingZonesRegion,
      isLoadingRegion,

      // Tab 4
      headerSell,
      limitSell,
      beginItemSell,
      endItemSell,
      totalElementItemSell,
      listLengthSell,
      currentPageSell,
      insertSell,
      idSell,
      dataSell,
      fromDateSell,
      toDateSell,
      productIdSell,
      partnerIdSell,
      productsSell,
      partnersSell,
      isLoadingSell,

      // Tab 0 - Báo cáo tem sử dụng
      summaryReportTemUseInfo,
      isLoadingTemUse,
      productIdTemUse,
      productsTemUse,

      // Dùng chung
      options,
      popupMessage,
      messageErr,
      errorInserts,
      isShowForEdit,
      PRODUCT_OPTIONS,
      PLANTINGZONE_OPTIONS,
      CUSTOMER_OPTIONS,
    } = this.state;

    options.map((option) => {
      if (option) {
        option.name = option.companyName;
        option.value = option.id;
      }
    });

    const totalPageSummaryReportTemUse = Math.ceil(
      listLengthSummaryReportTemUse / limitSummaryReportTemUse
    );

    const totalPageShipment = Math.ceil(listLengthShipment / limitShipment);
    const totalPageOutput = Math.ceil(listLengthOutput / limitOutput);
    const totalPageRegion = Math.ceil(listLengthRegion / limitRegion);
    const totalPageSell = Math.ceil(listLengthSell / limitSell);

    return (
      <div className="config-system">
        <div className="config-system-tab">
          <Row
            className="config-system-tab"
            style={{ width: "100%", margin: "0" }}
          >
            <Col
              xs="12"
              md="auto"
              className={`config-system-tab-item config-system-tab-item-button ${
                currentTab === 0 ? "active" : ""
              }`}
              onClick={this.onChooseTab(0)}
            >
              BÁO CÁO TEM SỬ DỤNG
            </Col>

            <Col
              xs="12"
              md="auto"
              className={`config-system-tab-item config-system-tab-item-button ${
                currentTab === 1 ? "active" : ""
              }`}
              onClick={this.onChooseTab(1)}
            >
              BÁO CÁO LÔ HÀNG
            </Col>

            <Col
              xs="12"
              md="auto"
              className={`config-system-tab-item config-system-tab-item-button ${
                currentTab === 2 ? "active" : ""
              }`}
              onClick={this.onChooseTab(2)}
            >
              BÁO CÁO SẢN LƯỢNG HÀNG HÓA
            </Col>

            <Col
              xs="12"
              md="auto"
              className={`config-system-tab-item config-system-tab-item-button ${
                currentTab === 3 ? "active" : ""
              }`}
              onClick={this.onChooseTab(3)}
            >
              BÁO CÁO SẢN LƯỢNG HÀNG THEO VÙNG
            </Col>

            <Col
              xs="12"
              md="auto"
              className={`config-system-tab-item config-system-tab-item-button ${
                currentTab === 4 ? "active" : ""
              }`}
              onClick={this.onChooseTab(4)}
            >
              BÁO CÁO BÁN HÀNG
            </Col>
          </Row>
        </div>
        <div className="config-system-content">
          {currentTab === 0 && (
            <SummaryReportTemUseConfig
              id={idSummaryReportTemUse}
              onHandleChangeValue={this.onHandleChangeValueSummaryReportTemUse}
              errorInserts={errorInserts}
              insert={insertSummaryReportTemUse}
              handleModal={this.handleModal}
              onConfirm={this.onConfirmSummaryReportTemUse}
              header={headerSummaryReportTemUse}
              data={dataSummaryReportTemUse}
              beginItem={beginItemSummaryReportTemUse}
              endItem={endItemSummaryReportTemUse}
              toggle={this.toggleSummaryReportTemUse}
              onEdit={this.onEditSummaryReportTemUse}
              toggleModal={this.toggleModal}
              setState={this.setState.bind(this)}
              listLength={listLengthSummaryReportTemUse}
              totalPage={totalPageSummaryReportTemUse}
              totalElementItem={totalElementItemSummaryReportTemUse}
              handlePageClick={this.handlePageClickSummaryReportTemUse}
              currentPage={currentPageSummaryReportTemUse}
              fromDate={fromDateSummaryReportTemUse}
              toDate={toDateSummaryReportTemUse}
              productId={productIdTemUse}
              products={productsTemUse}
              summaryInfo={summaryReportTemUseInfo}
              isLoading={isLoadingTemUse}
              onChangeFilter={this.handleChangeFilterTemUse}
              onSearch={this.handleSearchTemUse}
              dataReload={this.handleReloadTemUse}
            />
          )}

          {currentTab === 1 && (
            <SummaryReportShipment
              id={idShipment}
              onHandleChangeValue={this.onHandleChangeValueShipment}
              errorInserts={errorInserts}
              insert={insertShipment}
              handleModal={this.handleModal}
              onConfirm={this.onConfirmShipment}
              header={headerShipment}
              data={dataShipment}
              beginItem={beginItemShipment}
              endItem={endItemShipment}
              toggle={this.toggleShipment}
              onEdit={this.onEditShipment}
              toggleModal={this.toggleModal}
              setState={this.setState.bind(this)}
              listLength={listLengthShipment}
              totalPage={totalPageShipment}
              totalElementItem={totalElementItemShipment}
              handlePageClick={this.handlePageClickShipment}
              currentPage={currentPageShipment}
              fromDate={fromDateShipment}
              toDate={toDateShipment}
              productId={productIdShipment}
              products={productsShipment}
              summaryInfo={summaryShipmentInfo}
              isLoading={isLoadingShipment}
              onChangeFilter={this.handleChangeFilterShipment}
              onSearch={this.handleSearchShipment}
              dataReload={this.handleReloadShipment}
            />
          )}

          {currentTab === 2 && (
            <SummaryReportOutput
              id={idOutput}
              onHandleChangeValue={this.onHandleChangeValueOutput}
              errorInserts={errorInserts}
              insert={insertOutput}
              handleModal={this.handleModal}
              onConfirm={this.onConfirmOutput}
              header={headerOutput}
              data={dataOutput}
              beginItem={beginItemOutput}
              endItem={endItemOutput}
              toggle={this.toggleOutput}
              onEdit={this.onEditOutput}
              toggleModal={this.toggleModal}
              setState={this.setState.bind(this)}
              listLength={listLengthOutput}
              totalPage={totalPageOutput}
              totalElementItem={totalElementItemOutput}
              handlePageClick={this.handlePageClickOutput}
              currentPage={currentPageOutput}
              fromDate={fromDateOutput}
              toDate={toDateOutput}
              productId={productIdOutput}
              products={productsOutput}
              isLoading={isLoadingOutput}
              onChangeFilter={this.handleChangeFilterOutput}
              onSearch={this.handleSearchOutput}
              dataReload={this.handleReloadOutput}
            />
          )}

          {currentTab === 3 && (
            <SummaryReportRegion
              data={dataRegion}
              beginItem={beginItemRegion}
              endItem={endItemRegion}
              listLength={listLengthRegion}
              totalPage={totalPageRegion}
              totalElementItem={totalElementItemRegion}
              handlePageClick={this.handlePageClickRegion}
              currentPage={currentPageRegion}
              fromDate={fromDateRegion}
              header={headerRegion}
              toDate={toDateRegion}
              productId={productIdRegion}
              plantingZoneId={plantingZoneIdRegion}
              products={productsRegion}
              plantingZones={plantingZonesRegion}
              isLoading={isLoadingRegion}
              onChangeFilter={this.handleChangeFilterRegion}
              onSearch={this.handleSearchRegion}
              dataReload={this.handleReloadRegion}
            />
          )}

          {currentTab === 4 && (
            <SummaryReportSell
              data={dataSell}
              beginItem={beginItemSell}
              endItem={endItemSell}
              listLength={listLengthSell}
              totalPage={totalPageSell}
              totalElementItem={totalElementItemSell}
              handlePageClick={this.handlePageClickSell}
              currentPage={currentPageSell}
              fromDate={fromDateSell}
              toDate={toDateSell}
              productId={productIdSell}
              partnerId={partnerIdSell}
              products={productsSell}
              partners={partnersSell}
              isLoading={isLoadingSell}
              onChangeFilter={this.handleChangeFilterSell}
              onSearch={this.handleSearchSell}
              dataReload={this.handleReloadSell}
            />
          )}
        </div>
        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={messageErr}
          toggleModal={this.toggleModal}
        />
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }
}

export default SummaryReport;
