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
      selectedProductId: null,

      // Tab 1b - QR Incurred (separate state as requested)
      dataQRIncurredOriginal: [],
      dataQRIncurredFiltered: [],
      dataQRIncurred: [],
      limitQRIncurred: limitQRArises,
      beginItemQRIncurred: 0,
      endItemQRIncurred: limitQRArises,
      totalElementQRIncurred: 0,
      listLengthQRIncurred: 0,
      currentPageQRIncurred: 0,
      insertQRIncurred: {},
      idQRIncurred: null,
      warningPopupDelIncurred: false,
      deleteItemQRIncurred: null,
      headerQRIncurred: "QR INCURRED",
      isLoadedQRIncurred: false,

      // Tab 2 - QR List
      limitQRList,
      beginItemQRList: 0,
      endItemQRList: limitQRList,
      totalElementQRList: 0,
      listLengthQRList: 0,
      currentPageQRList: 0,
      isLoadedQRList: false,
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

  fetchQRSystem = async () => {
    this.setState({ isLoadedQRSystem: true });
    try {
      const result = await fetchData.qrCodeManagement.getListManageQRSystem();
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

  fetchQRArises = async () => {
    this.setState({ isLoadedQRArises: true });
    try {
      const { currentPageQRArises, limitQRArises } = this.state;
      const result = await fetchData.qrCodeManagement.getListManageQRIncurred();

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
        if (tab === 2 && this.state.dataQRList.length === 0) {
          this.fetchQRList();
        }
      }
    );
  };

  fetchQRList = async () => {
    this.setState({ isLoadedQRList: true });
    try {
      const { currentPageQRList, limitQRList } = this.state;
      const result = await fetchData.qrCodeManagement.getListManageQRRequest(
        currentPageQRList,
        limitQRList
      );

      // normalize different possible response shapes; backend returns { data: { qrCodes: [...] } }
      const items =
        (result && (result.qrCodes || result.items || result.data || result.list)) ||
        (Array.isArray(result) ? result : []);
      const total =
        result &&
        (result.total || result.totalCount || result.count || (Array.isArray(items) ? items.length : 0));

      if (items && Array.isArray(items)) {
        const mappedData = items.map((item, idx) => ({
          ...item,
          collapse: false,
          code: item.code || item.nameCode || item.batchCode || item.id,
          approvalDate: item.approvalDate || item.confirmedDate || item.approvalDate,
          temList:
            item.temList ||
            (item.startRange && item.endRange
              ? `${item.startRange} - ${item.endRange}`
              : item.temList || ""),
          useCount: item.useCount !== undefined ? item.useCount : item.usedCount,
          availableCount:
            item.availableCount !== undefined ? item.availableCount : item.remainCount,
          errorCount: item.errorCount !== undefined ? item.errorCount : item.badCount,
          quantity: item.quantity,
          index: currentPageQRList * limitQRList + idx + 1,
        }));

        this.setState({
          dataQRList: mappedData,
          listLengthQRList: mappedData.length,
          totalElementQRList: total !== undefined ? total : mappedData.length,
          endItemQRList: Math.min(limitQRList, mappedData.length),
          isLoadedQRList: false,
        });
      } else {
        this.setState({
          dataQRList: [],
          listLengthQRList: 0,
          totalElementQRList: 0,
          endItemQRList: 0,
          isLoadedQRList: false,
        });
        toast.error("Không có dữ liệu QR Request!");
      }
    } catch (error) {
      console.error("Fetch QRList error:", error);
      this.setState({ isLoadedQRList: false });
      toast.error("Lỗi khi load dữ liệu QR Request!");
    }
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

  handlePageClickQRList = (data) => {
    const { limitQRList, dataQRList } = this.state;
    const selected = data.selected;
    const beginItemQRList = selected * limitQRList;
    const endItemQRList = Math.min(
      beginItemQRList + limitQRList,
      dataQRList.length
    );
    this.setState({
      beginItemQRList,
      endItemQRList,
      currentPageQRList: selected,
      totalElementQRList: endItemQRList - beginItemQRList,
    });
  };

  toggleQRSystem = (idx, id) => {
    this.setState((prev) => {
      const data = Array.isArray(prev.dataQRSystem)
        ? prev.dataQRSystem.slice()
        : [];
      let i = typeof idx === "number" ? idx : data.findIndex((d) => d.id === id);
      if (i >= 0 && data[i]) {
        data[i] = { ...data[i], collapse: !data[i].collapse };
      }
      return { dataQRSystem: data };
    });
  };

  toggleQRArises = (idx, id) => {
    this.setState((prev) => {
      const filtered = Array.isArray(prev.dataQRArisesFiltered)
        ? prev.dataQRArisesFiltered.slice()
        : [];
      const original = Array.isArray(prev.dataQRArisesOriginal)
        ? prev.dataQRArisesOriginal.slice()
        : [];
      let i = typeof idx === "number" ? idx : filtered.findIndex((d) => d.id === id);
      if (i >= 0 && filtered[i]) {
        filtered[i] = { ...filtered[i], collapse: !filtered[i].collapse };
      }
      // also toggle in original if possible
      const j = original.findIndex((d) => d.id === id);
      if (j >= 0 && original[j]) {
        original[j] = { ...original[j], collapse: !original[j].collapse };
      }
      return {
        dataQRArisesFiltered: filtered,
        dataQRArisesOriginal: original,
      };
    });
  };

  toggleQRList = (idx, id) => {
    this.setState((prev) => {
      const data = Array.isArray(prev.dataQRList) ? prev.dataQRList.slice() : [];
      let i = typeof idx === "number" ? idx : data.findIndex((d) => d.id === id);
      if (i >= 0 && data[i]) {
        data[i] = { ...data[i], collapse: !data[i].collapse };
      }
      return { dataQRList: data };
    });
  };

  onEditQRSystem = (id) => async () => {
    const item = (this.state.dataQRSystem || []).find((d) => d.id === id) || {};
    console.log("onEditQRSystem selected item:", item);
    
    // fetch full QR details using the qrCode value from the table row
    if (item.qrCode) {
      try {
        const payload = { qrCode: item.qrCode };
        const fullData = await fetchData.scanQR.scanQRCodePrivate(payload);
        console.log("scanQRCodePrivate result:", fullData);
        
        if (fullData) {
          // merge table data with API response for complete information
          const mergedItem = { ...item, ...fullData };
          this.setState({ isShowForEdit: true, idQRSystem: id, insertQRSystem: mergedItem, createNewModal: true });
        } else {
          // fallback to table data if API call fails
          this.setState({ isShowForEdit: true, idQRSystem: id, insertQRSystem: item, createNewModal: true });
        }
      } catch (error) {
        console.error("Error fetching QR details:", error);
        // fallback to table data
        this.setState({ isShowForEdit: true, idQRSystem: id, insertQRSystem: item, createNewModal: true });
      }
    } else {
      // if no qrCode in table data, just use what we have
      this.setState({ isShowForEdit: true, idQRSystem: id, insertQRSystem: item, createNewModal: true });
    }
  };

  onEditQRList = (id) => () => {
    const item = (this.state.dataQRList || []).find((d) => d.id === id) || {};
    this.setState({ isShowForEdit: true, idQRList: id, insertQRList: item, createNewModal: true });
  };

  onEditQRListHistory = (id) => () => {
    this.setState({ isShowForListHistory: true, idQRList: id, createNewModal: true });
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

  onHandleChangeValueQR = (data) => {
    this.setState({ insertQRSystem: data });
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
      listLengthQRList,
      limitQRList,
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
    const totalPageQRList = Math.ceil(listLengthQRList / limitQRList);

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
      errorInserts: this.state.errorInserts,
      onHandleChangeValueQR: this.onHandleChangeValueQR,
      handlePageClickQRSystem: this.handlePageClickQRSystem,
      toggleQRSystem: this.toggleQRSystem,
      onEditQRSystem: this.onEditQRSystem,
      toggleModalPopupDeleteQR: () => this.toggleModal("warningPopupDelQR"),
      setDeleteItem: (id) => this.setState({ deleteItemQRSystem: id }),
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
      toggleQRArises: this.toggleQRArises,
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
      beginItemQRList: this.state.beginItemQRList,
      endItemQRList: this.state.endItemQRList,
      listLengthQRList: this.state.listLengthQRList,
      limitQRList: this.state.limitQRList,
      totalPageQRList,
      totalElementQRList: this.state.totalElementQRList,
      currentPageQRList: this.state.currentPageQRList,
      handlePageClickQRList: this.handlePageClickQRList,
      toggleModal: this.toggleModal,
      toggleQRList: this.toggleQRList,
      onEditQRList: this.onEditQRList,
      onEditQRListHistory: this.onEditQRListHistory,
      toggleModalPopupDeleteList: () => this.toggleModal("warningPopupDelList"),
      setDeleteItem: (id) => this.setState({ deleteItemQRList: id }),
      warningPopupDelList: this.state.warningPopupDelList,
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
