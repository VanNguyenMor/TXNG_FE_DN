import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRSystemTab from "./Cp/QRSystemTab";
import QRArisesTab from "./Cp/QRArisesTab";
import QRListTab from "./Cp/QRListTab";
import PopupMessage from "../../../components/PopupMessage";
import {
  QR_SYSTEM_HEADER,
  QR_SYSTEM_ARISES,
  QR_SYSTEM_LIST,
} from "../../../helpers/constant";
import { fetchData } from "helpers/fetchData";

class QrCodeManagement extends Component {
  constructor(props) {
    super(props);

    const limitQRSystem = 10;
    const limitQRArises = 10;
    const limitQRList = 10;

    this.state = {
      currentTab: 0,

      // Tab 0 - QR System
      limitQRSystem,
      beginItemQRSystem: 0,
      endItemQRSystem: limitQRSystem,
      totalElementQRSystem: 0,
      listLengthQRSystem: 0,
      currentPageQRSystem: 0,
      dataQRSystem: [],
      insertQRSystem: {},
      idQRSystem: null,
      warningPopupDelQR: false,
      deleteItemQRSystem: null,
      headerQRSystem: QR_SYSTEM_HEADER,
      isLoadedQRSystem: false,

      // Tab 1 - QR Arises
      dataQRArisesOriginal: [],
      dataQRArisesFiltered: [],
      dataQRArises: [],
      limitQRArises,
      beginItemQRArises: 0,
      endItemQRArises: limitQRArises,
      totalElementQRArises: 0,
      listLengthQRArises: 0,
      currentPageQRArises: 0,
      insertQRArises: {},
      idQRArises: null,
      warningPopupDelArises: false,
      deleteItemQRArises: null,
      headerQRArises: QR_SYSTEM_ARISES,
      isLoadedQRArises: false,
      fromDate: null,
      toDate: null,
      selectedProductId: null, // thêm để filter theo sản phẩm

      // Tab 2 - QR List
      limitQRList,
      beginItemQRList: 0,
      endItemQRList: limitQRList,
      totalElementQRList: 0,
      listLengthQRList: 0,
      currentPageQRList: 0,
      dataQRList: [],
      insertQRList: {},
      idQRList: null,
      warningPopupDelList: false,
      deleteItemQRList: null,
      headerQRList: QR_SYSTEM_LIST,

      // Dùng chung
      popupMessage: false,
      messageErr: "",
      errorInserts: {},
      isShowForEdit: false,
      isShowForListHistory: false,
      createNewModal: false,
      PRODUCT_OPTIONS: [],
    };
  }

  componentDidMount() {
    this.fetchQRSystem();
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const result = await fetchData.productManagement.getAll();
      if (result && Array.isArray(result.products)) {
        const mappedProducts = result.products.map((item) => ({
          id: item.id,
          title: item.productName,
          code: item.productCode,
          unit: item.unitNameReport || item.unitName,
          avatar: item.avatar || null,
          isLocked: item.islocked,
          verifiedStatus: item.verifiedStatus,
        }));
        this.setState({ PRODUCT_OPTIONS: mappedProducts });
      }
    } catch (error) {
      console.error("Fetch Products error:", error);
    }
  };

  /** FETCH QR SYSTEM */
  fetchQRSystem = async () => {
    this.setState({ isLoadedQRSystem: true });
    try {
      const result = await fetchData.qrManagement.getListManageQRSystem();
      if (result && Array.isArray(result.qRCodes)) {
        const { currentPageQRSystem, limitQRSystem } = this.state;
        const mappedData = result.qRCodes.map((item, idx) => ({
          ...item,
          collapse: false,
          code: item.nameCode,
          index: currentPageQRSystem * limitQRSystem + idx + 1,
        }));
        this.setState({
          dataQRSystem: mappedData,
          listLengthQRSystem: mappedData.length,
          totalElementQRSystem: Math.min(limitQRSystem, mappedData.length),
          endItemQRSystem: Math.min(limitQRSystem, mappedData.length),
          isLoadedQRSystem: false,
        });
      } else {
        toast.error("Không có dữ liệu QR System!");
        this.setState({ isLoadedQRSystem: false });
      }
    } catch (error) {
      console.error("Fetch QRSystem error:", error);
      this.setState({ isLoadedQRSystem: false });
      toast.error("Lỗi khi load dữ liệu QR System!");
    }
  };

  /** FETCH QR ARISES */
  fetchQRArises = async () => {
    this.setState({ isLoadedQRArises: true });
    try {
      const { currentPageQRArises, limitQRArises } = this.state;
      const result = await fetchData.qrManagement.getListManageQRIncurred();

      const qrData = result && result.batches;
      const totalElements = result && result.total;

      if (qrData && Array.isArray(qrData)) {
        const mappedData = qrData.map((item, idx) => ({
          ...item,
          collapse: false,
          code: item.batchCode || item.batchNum,
          index: currentPageQRArises * limitQRArises + idx + 1,
        }));

        this.setState({
          dataQRArisesOriginal: mappedData,
          dataQRArisesFiltered: mappedData,
          dataQRArises: mappedData,
          listLengthQRArises: mappedData.length,
          totalElementQRArises:
            totalElements !== undefined ? totalElements : mappedData.length,
          endItemQRArises:
            currentPageQRArises * limitQRArises +
            Math.min(mappedData.length, limitQRArises),
          isLoadedQRArises: false,
        });
      } else {
        this.setState({
          dataQRArisesOriginal: [],
          dataQRArisesFiltered: [],
          dataQRArises: [],
          listLengthQRArises: 0,
          totalElementQRArises: 0,
          endItemQRArises: 0,
          isLoadedQRArises: false,
        });
        toast.error("Không có dữ liệu QR Phát sinh!");
      }
    } catch (error) {
      console.error("Fetch QRArises error:", error);
      this.setState({ isLoadedQRArises: false });
      toast.error("Lỗi khi load dữ liệu QR Phát sinh!");
    }
  };

  onChooseTab = (tab) => () => {
    this.setState(
      {
        currentTab: tab,
        isShowForEdit: false,
        isShowForListHistory: false,
        idQRSystem: null,
        idQRArises: null,
        idQRList: null,
        insertQRSystem: {},
        insertQRArises: {},
        insertQRList: {},
        errorInserts: {},
      },
      () => {
        if (tab === 1 && this.state.dataQRArises.length === 0) {
          this.fetchQRArises();
        }
      }
    );
  };

  handlePageClickQRSystem = (data) => {
    const { limitQRSystem, dataQRSystem } = this.state;
    const selected = data.selected;
    const beginItemQRSystem = selected * limitQRSystem;
    const endItemQRSystem = Math.min(
      beginItemQRSystem + limitQRSystem,
      dataQRSystem.length
    );
    this.setState({
      beginItemQRSystem,
      endItemQRSystem,
      currentPageQRSystem: selected,
      totalElementQRSystem: endItemQRSystem - beginItemQRSystem,
    });
  };

  handlePageClickQRArises = (data) => {
    const { limitQRArises, dataQRArisesFiltered } = this.state;
    const selected = data.selected;
    const beginItemQRArises = selected * limitQRArises;
    const endItemQRArises = Math.min(
      beginItemQRArises + limitQRArises,
      dataQRArisesFiltered.length
    );
    this.setState({
      beginItemQRArises,
      endItemQRArises,
      currentPageQRArises: selected,
      totalElementQRArises: endItemQRArises - beginItemQRArises,
    });
  };

  toggleModal = (state) => {
    this.setState((prevState) => ({
      [state]: !prevState[state],
      isShowForEdit: false,
      isShowForListHistory: false,
      insertQRSystem: {},
      insertQRArises: {},
      insertQRList: {},
      errorInserts: {},
    }));
  };

  showTitleWithStatus = (status) => {
    switch (status) {
      case 1:
      case "1":
      case true:
        return "Đang hoạt động";
      case 0:
      case "0":
      case false:
        return "Ngưng hoạt động";
      default:
        return "Chưa xác định";
    }
  };

  handleChangeSelectFilter = (value) => {
    this.setState({ selectedProductId: value });
  };

  handleSubmitSearchForm = () => {
    const {
      fromDate,
      toDate,
      dataQRArisesOriginal,
      limitQRArises,
      selectedProductId,
    } = this.state;

    const filtered = (dataQRArisesOriginal || []).filter((item) => {
      const created = item.createdDate ? new Date(item.createdDate) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (!created) return false;
      if (from && created < from) return false;
      if (to && created > to) return false;

      if (selectedProductId && item.productId !== selectedProductId)
        return false;

      return true;
    });

    this.setState({
      dataQRArisesFiltered: filtered,
      beginItemQRArises: 0,
      endItemQRArises: Math.min(filtered.length, limitQRArises),
      currentPageQRArises: 0,
      listLengthQRArises: filtered.length,
      totalElementQRArises: Math.min(filtered.length, limitQRArises),
    });
  };

  render() {
    const {
      currentTab,
      dataQRSystem,
      beginItemQRSystem,
      endItemQRSystem,
      listLengthQRSystem,
      totalElementQRSystem,
      limitQRSystem,
      currentPageQRSystem,
      insertQRSystem,
      idQRSystem,
      headerQRSystem,
      dataQRArisesFiltered,
      beginItemQRArises,
      endItemQRArises,
      listLengthQRArises,
      totalElementQRArises,
      limitQRArises,
      currentPageQRArises,
      headerQRArises,
      dataQRList,
      headerQRList,
      isShowForEdit,
      popupMessage,
      messageErr,
      createNewModal,
      warningPopupDelQR,
      isShowForListHistory,
      PRODUCT_OPTIONS,
    } = this.state;

    const totalPageQRSystem = Math.ceil(listLengthQRSystem / limitQRSystem);
    const totalPageQRArises = Math.ceil(listLengthQRArises / limitQRArises);

    const propsForQRSystem = {
      isShowForEdit,
      headerQRSystem,
      dataQRSystem,
      beginItemQRSystem,
      endItemQRSystem,
      listLengthQRSystem,
      totalPageQRSystem,
      totalElementQRSystem,
      currentPageQRSystem,
      idQRSystem,
      insertQRSystem,
      createNewModal,
      warningPopupDelQR,
      toggleModal: this.toggleModal,
      handlePageClickQRSystem: this.handlePageClickQRSystem,
    };

    const propsForQRArises = {
      headerQRArises,
      dataQRArises: dataQRArisesFiltered,
      isShowForEdit,
      beginItemQRArises,
      endItemQRArises,
      listLengthQRArises,
      limitQRArises,
      totalPageQRArises,
      totalElementQRArises,
      PRODUCT_OPTIONS,
      currentPageQRArises,
      handlePageClickQRArises: this.handlePageClickQRArises,
      showTitleWithStatus: this.showTitleWithStatus,
      setDeleteItem: (id) => this.setState({ deleteItemQRArises: id }),
      setState: (newState) => this.setState(newState),
      handleSubmitSearchForm: this.handleSubmitSearchForm,
      handleChangeSelectFilter: this.handleChangeSelectFilter,
    };

    const propsForQRList = {
      headerQRList,
      dataQRList,
      isShowForEdit,
      isShowForListHistory,
    };

    return (
      <div className="config-system">
        <div className="config-system-tab">
          <div
            onClick={this.onChooseTab(0)}
            className={`config-system-tab-item ${
              currentTab === 0 ? "active" : ""
            }`}
          >
            QR HỆ THỐNG
          </div>
          <div
            onClick={this.onChooseTab(1)}
            className={`config-system-tab-item ${
              currentTab === 1 ? "active" : ""
            }`}
          >
            QR PHÁT SINH
          </div>
          <div
            onClick={this.onChooseTab(2)}
            className={`config-system-tab-item ${
              currentTab === 2 ? "active" : ""
            }`}
          >
            QUẢN LÝ MÃ QR
          </div>
        </div>
        <div className="config-system-content">
          {currentTab === 0 && <QRSystemTab {...propsForQRSystem} />}
          {currentTab === 1 && <QRArisesTab {...propsForQRArises} />}
          {currentTab === 2 && <QRListTab {...propsForQRList} />}
        </div>
        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle="Thông báo"
          moduleBody={messageErr}
          toggleModal={this.toggleModal}
        />
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }
}

export default QrCodeManagement;
