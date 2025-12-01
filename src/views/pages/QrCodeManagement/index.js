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
      limitQRArises,
      beginItemQRArises: 0,
      endItemQRArises: limitQRArises,
      totalElementQRArises: 0,
      listLengthQRArises: 0,
      currentPageQRArises: 0,
      dataQRArises: [],
      insertQRArises: {},
      idQRArises: null,
      warningPopupDelArises: false,
      deleteItemQRArises: null,
      headerQRArises: QR_SYSTEM_ARISES,
      isLoadedQRArises: false,

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
    };
  }

  componentDidMount() {
    this.fetchQRSystem();
  }

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
      console.log(result);

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
          dataQRArises: mappedData,
          listLengthQRArises: mappedData.length,
          totalElementQRArises:
            totalElements !== undefined ? totalElements : mappedData.length,
          endItemQRArises:
            currentPageQRArises * limitQRArises + mappedData.length,
          isLoadedQRArises: false,
        });
      } else {
        this.setState({
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
        // Khi chọn tab 1 (QR Phát sinh) thì fetch dữ liệu
        if (tab === 1 && this.state.dataQRArises.length === 0) {
          this.fetchQRArises();
        }
      }
    );
  };

  /** Pagination tab QR System */
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

  /** Pagination tab QR Arises */
  handlePageClickQRArises = (data) => {
    const { limitQRArises, dataQRArises } = this.state;
    const selected = data.selected;
    const beginItemQRArises = selected * limitQRArises;
    const endItemQRArises = Math.min(
      beginItemQRArises + limitQRArises,
      dataQRArises.length
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

  handleSubmitSearchForm = () => {
    const { fromDate, toDate, dataQRArises } = this.state;

    const filtered = dataQRArises.filter((item) => {
      const created = item.createdDate ? new Date(item.createdDate) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (!created) return false;
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });

    this.setState({
      dataQRArises: filtered,
      beginItemQRArises: 0,
      endItemQRArises: filtered.length,
      listLengthQRArises: filtered.length,
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
      dataQRArises,
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
      dataQRArises,
      isShowForEdit,
      beginItemQRArises,
      endItemQRArises,
      listLengthQRArises,
      totalPageQRArises,
      totalElementQRArises,
      currentPageQRArises,
      handlePageClickQRArises: this.handlePageClickQRArises,
      showTitleWithStatus: this.showTitleWithStatus,
      setDeleteItem: (id) => this.setState({ deleteItemQRArises: id }),
      setState: (newState) => this.setState(newState),
      handleSubmitSearchForm: this.handleSubmitSearchForm,
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
