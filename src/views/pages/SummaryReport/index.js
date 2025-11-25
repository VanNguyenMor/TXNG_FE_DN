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

import SummaryReportTemUseConfig from "./CpTable/SummaryReportTemUseConfig";
import SummaryReportShipment from "./CpTable/SummaryReportShipment";
import SummaryReportOutput from "./CpTable/SummaryReportOutput";
import SummaryReportRegion from "./CpTable/SummaryReportRegion";
import SummaryReportSell from "./CpTable/SummaryReportSell";
import { Col, Row } from "reactstrap";

class SummaryReport extends Component {
  constructor(props) {
    super(props);

    const initialSummaryReportTemUse = [
      {
        stt: 1,
        id: 1,
        date: "13/11/2025",
        productName: "Dép lào",
        temRangeOriginal: "271 - 320",
        quantityUsed: 2,
        temRangeUsed: "279 - 280",
      },
    ];
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

      // State cho Tab 0
      limitSummaryReportTemUse: limitSummaryReportTemUse,
      beginItemSummaryReportTemUse: 0,
      endItemSummaryReportTemUse: limitSummaryReportTemUse,
      totalElementItemSummaryReportTemUse: Math.min(
        initialSummaryReportTemUse.length,
        limitSummaryReportTemUse
      ),
      listLengthSummaryReportTemUse: initialSummaryReportTemUse.length,
      currentPageSummaryReportTemUse: 0,
      insertSummaryReportTemUse: {},
      idSummaryReportTemUse: null,
      dataSummaryReportTemUse: initialSummaryReportTemUse,
      fromDateSummaryReportTemUse: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      toDateSummaryReportTemUse: new Date(),

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
      fromDateShipment: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      toDateShipment: new Date(),

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
      fromDateOutput: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      toDateOutput: new Date(),

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
      fromDateRegion: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      toDateRegion: new Date(),

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
      fromDateSell: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      toDateSell: new Date(),

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

  // Method summary report tem use

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
    console.log("Submit form tìm kiếm với:", {
      fromDateShipment: this.state.fromDateShipment,
      toDateShipment: this.state.toDateShipment,
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
              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
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
              formDate={fromDateShipment}
              toDate={toDateShipment}
              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
              handleSubmitSearchFormShipment={
                this.handleSubmitSearchFormShipment
              }
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
              formDate={fromDateOutput}
              toDate={toDateOutput}
              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
              handleSubmitSearchFormOutput={this.handleSubmitSearchFormOutput}
            />
          )}

          {currentTab === 3 && (
            <SummaryReportRegion
              id={idRegion}
              onHandleChangeValue={this.onHandleChangeValueRegion}
              errorInserts={errorInserts}
              insert={insertRegion}
              handleModal={this.handleModal}
              onConfirm={this.onConfirmRegion}
              header={headerRegion}
              data={dataRegion}
              beginItem={beginItemRegion}
              endItem={endItemRegion}
              toggle={this.toggleRegion}
              onEdit={this.onEditRegion}
              toggleModal={this.toggleModal}
              setState={this.setState.bind(this)}
              listLength={listLengthRegion}
              totalPage={totalPageRegion}
              totalElementItem={totalElementItemRegion}
              handlePageClick={this.handlePageClickRegion}
              currentPage={currentPageRegion}
              formDate={fromDateRegion}
              toDate={toDateRegion}
              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
              handleSubmitSearchFormRegion={this.handleSubmitSearchFormRegion}
              PLANTINGZONE_OPTIONS={PLANTINGZONE_OPTIONS}
            />
          )}

          {currentTab === 4 && (
            <SummaryReportSell
              id={idSell}
              onHandleChangeValue={this.onHandleChangeValueSell}
              errorInserts={errorInserts}
              insert={insertSell}
              handleModal={this.handleModal}
              onConfirm={this.onConfirmSell}
              header={headerSell}
              data={dataSell}
              beginItem={beginItemSell}
              endItem={endItemSell}
              toggle={this.toggleSell}
              onEdit={this.onEditSell}
              toggleModal={this.toggleModal}
              setState={this.setState.bind(this)}
              listLength={listLengthSell}
              totalPage={totalPageSell}
              totalElementItem={totalElementItemSell}
              handlePageClick={this.handlePageClickSell}
              currentPage={currentPageSell}
              formDate={fromDateSell}
              toDate={toDateSell}
              PRODUCT_OPTIONS={PRODUCT_OPTIONS}
              handleSubmitSearchFormSell={this.handleSubmitSearchFormSell}
              CUSTOMER_OPTIONS={CUSTOMER_OPTIONS}
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

const mapStateToProps = (state) => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  SummaryReport
);
