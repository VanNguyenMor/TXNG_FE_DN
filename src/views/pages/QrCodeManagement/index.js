import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import "../../../assets/css/page/config_system.css";
import MenuButton from "../../../assets/img/buttons/menu.png";
import "./select-search.css";
import {
  QR_SYSTEM_ARISES,
  QR_SYSTEM_HEADER,
  QR_SYSTEM_LIST,
} from "../../../helpers/constant";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import AddNewQRSystem from "./AddNewQRSystem";
import CreateNewPopup from "../../../components/CreateNewPopup";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import {
  Card,
  Table,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import AddNewQRArises from "./AddNewQRArises";
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import AddNewQRList from "./AddNewQRList";
import { error } from "jquery";
import AddNewQRListHistory from "./AddNewQRListHistory";

class QrCodeManagement extends Component {
  constructor(props) {
    super(props);

    const initialQRSystemData = [
      {
        id: 1,
        image: "",
        productName: "Dép lào",
        code: "TGI020015870000000040",
        warehouseName: "Xưởng 1",
        collapse: false,
      },
      {
        id: 2,
        image: "",
        productName: "Dép lào",
        code: "TGI020015870000000040",
        warehouseName: "Cty NextLab",
        collapse: false,
      },
      {
        id: 3,
        image: "",
        productName: "Dép lào",
        code: "TGI020015870000000040",
        warehouseName: "Xưởng nhà anh",
        collapse: false,
      },
      {
        id: 4,
        image: "",
        productName: "Dép lào",
        code: "TGI020015870000000040",
        warehouseName: "Vùng trồng hoa lan",
        collapse: false,
      },
    ];
    const limitQRSystem = 10;

    const initialQRArisesData = [
      {
        id: 1,
        image: "",
        productName: "Túi xách da",
        shipment: 13,
        approvalDate: "21/11/2025",
        approvalBy: "Công ty Việt Mỹ",
        status: 1,
      },
      {
        id: 2,
        image: "",
        productName: "Giày thể thao A",
        shipment: 12,
        approvalDate: "21/11/2025",
        approvalBy: "Công ty Việt Mỹ",
        status: 1,
      },
      {
        id: 3,
        image: "",
        productName: "Áo sơ mi B",
        shipment: 10,
        approvalDate: "21/11/2025",
        approvalBy: "Công ty Việt Mỹ",
        status: 1,
      },
    ];
    const limitQRArises = 10;

    const initialQRListData = [
      {
        id: 1,
        approvalDate: "21/11/2025",
        quantity: 50,
        shipment: 13,
        temList: "TGI02001580000000271 - TGI02001580000000320",
        useCount: 11,
        availableCount: 38,
        errorCount: 0,
      },
      {
        id: 2,
        approvalDate: "21/11/2025",
        quantity: 50,
        shipment: 13,
        temList: "TGI02001580000000271 - TGI02001580000000320",
        useCount: 11,
        availableCount: 38,
        errorCount: 0,
      },
      {
        id: 3,
        approvalDate: "21/11/2025",
        quantity: 50,
        shipment: 13,
        temList: "TGI02001580000000271 - TGI02001580000000320",
        useCount: 11,
        availableCount: 38,
        errorCount: 0,
      },
    ];
    const limitQRList = 10;

    this.state = {
      currentTab: 0,
      isInsertOrUpdate: false,
      updateId: null,
      dataServer: null,
      dataCompany: null,
      headerQRSystem: QR_SYSTEM_HEADER,
      headerQRArises: QR_SYSTEM_ARISES,
      headerQRList: QR_SYSTEM_LIST,
      createNewModal: false,

      // State cho Tab 0
      limitQRSystem: limitQRSystem,
      beginItemQRSystem: 0,
      endItemQRSystem: limitQRSystem,
      totalElementQRSystem: Math.min(initialQRSystemData.length, limitQRSystem),
      listLengthQRSystem: initialQRSystemData.length,
      currentPageQRSystem: 0,
      insertQRSystem: {},
      idQRSystem: null,
      dataQRSystem: initialQRSystemData,
      warningPopupDelQR: false,
      deleteItemQRSystem: null,
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),

      // State cho Tab 1
      limitQRArises: limitQRArises,
      beginItemQRArises: 0,
      endItemQRArises: limitQRArises,
      totalElementQRArises: Math.min(initialQRArisesData.length, limitQRArises),
      listLengthQRArises: initialQRArisesData.length,
      currentPageQRArises: 0,
      insertQRArises: {},
      idQRArises: null,
      dataQRArises: initialQRArisesData,
      warningPopupDelArises: false,
      deleteItemQRArises: null,

      // State cho Tab 2
      limitQRList: limitQRList,
      beginItemQRList: 0,
      endItemQRList: limitQRList,
      totalElementQRList: Math.min(initialQRListData.length, limitQRList),
      listLengthQRList: initialQRListData.length,
      currentPageQRList: 0,
      insertQRList: {},
      idQRList: null,
      dataQRList: initialQRListData,
      warningPopupDelList: false,
      deleteItemQRList: null,
      typeQRList: null,
      isShowForListHistory: false,
      historyQRListModal: false,

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
      STATUS_OPTIONS: [
        { id: 0, title: "Chưa duyệt" },
        { id: 1, title: "Đã duyệt" },
      ],
      TEMLIST_OPTIONS: [
        {
          id: 1,
          title: "Dải tem 1",
        },
        {
          id: 2,
          title: "Dải tem 2",
        },
      ],
      TEM_HISTORY_DATA: [
        {
          id: 1,
          index: 1,
          actionName: "Tạo mới",
          description: "Khởi tạo dải tem TGI020...40 số lượng 1000 cái",
          performedBy: "Nguyễn Văn Admin",
          performedDate: "20/11/2023 08:30:25",
          status: "Thành công",
        },
        {
          id: 2,
          index: 2,
          actionName: "Gán sản phẩm",
          description: "Gán dải tem cho sản phẩm: Dép lào",
          performedBy: "Trần Thị Kho",
          performedDate: "21/11/2023 09:15:10",
          status: "Thành công",
        },
        {
          id: 3,
          index: 3,
          actionName: "Xuất kho",
          description: "Xuất kho về đại lý Hà Nội",
          performedBy: "Lê Văn Vận Chuyển",
          performedDate: "22/11/2023 14:00:00",
          status: "Đang xử lý",
        },
      ],
    };
  }

  onChooseTab = (tab) => () => {
    this.setState(
      (previousState) => {
        return {
          ...previousState,
          currentTab: tab,
          errorsConfigSystem: {},
          errorsInfoCompany: {},
          errorInserts: {},
          isShowForEdit: false,
          idQRSystem: null,
          idQRArises: null,
          idQRList: null,
          insertQRSystem: {},
          insertQRArises: {},
          insertQRList: {},
        };
      },
      () => {
        if (tab === 0) {
          console.log("Đã chọn Tab: QR HỆ THỐNG.");
        }
        if (tab === 1) {
          console.log("Đã chọn Tab: QR PHÁT SINH. Cần load dữ liệu tương ứng.");
        }
        if (tab === 2) {
          console.log("Đã chọn Tab: QUẢN LÝ MÃ QR.");
        }
      }
    );
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

  toggleModalPopupDeleteQR = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupDelQR: !previousState.warningPopupDelQR,
      };
    });
  };

  handleDeleteQRSystem = () => {
    let { deleteItemQRSystem, dataQRSystem, limitQRSystem } = this.state;

    const updatedQRSystem = dataQRSystem
      .filter((item) => item.index !== deleteItemQRSystem)
      .map((item, key) => ({ ...item, index: key + 1 }));

    this.setState(
      (previousState) => {
        const totalPagesAfterDelete = Math.ceil(
          updatedQRSystem.length / limitQRSystem
        );
        const currentPageAfterDelete =
          previousState.currentPageQRSystem >= totalPagesAfterDelete
            ? Math.max(0, totalPagesAfterDelete - 1)
            : previousState.currentPageQRSystem;

        const newOffset = Math.ceil(currentPageAfterDelete * limitQRSystem);
        const newEndItem = newOffset + limitQRSystem;

        return {
          ...previousState,
          warningPopupDelQR: false,
          dataQRSystem: updatedQRSystem,
          listLengthQRSystem: updatedQRSystem.length,
          currentPageQRSystem: currentPageAfterDelete,
          beginItemQRSystem: newOffset,
          endItemQRSystem: Math.min(newEndItem, updatedQRSystem.length),
          totalElementQRSystem:
            Math.min(newEndItem, updatedQRSystem.length) - newOffset,
        };
      },
      () => {
        toast.success("Xoá thông tin QR Hệ thống thành công!");
      }
    );
  };

  handlePageClickQRSystem = (data) => {
    let { limitQRSystem, dataQRSystem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitQRSystem);

    let beginItemQRSystem = offset;
    let endItemQRSystem = Math.min(offset + limitQRSystem, dataQRSystem.length);
    let totalElementQRSystem = endItemQRSystem - beginItemQRSystem;

    this.setState({
      beginItemQRSystem: beginItemQRSystem,
      endItemQRSystem: endItemQRSystem,
      currentPageQRSystem: selected,
      totalElementQRSystem: totalElementQRSystem,
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
  onConfimQRSystem = async (toggleModal) => {
    const { insertQRSystem, dataQRSystem, limitQRSystem } = this.state;

    if (!insertQRSystem.productName || !insertQRSystem.code) {
      this.setState({
        messageErr: "Tên sản phẩm và Code không được bỏ trống.",
      });
      this.toggleModal("popupMessage");
      return;
    }

    if (insertQRSystem.idQRSystem) {
      const updatedData = dataQRSystem.map((item) =>
        item.index === insertQRSystem.idQRSystem
          ? { ...item, ...insertQRSystem }
          : item
      );
      this.setState({ dataQRSystem: updatedData });
      toast.success("Cập nhật QR Hệ thống thành công!");
    } else {
      const newIndex =
        dataQRSystem.length > 0
          ? dataQRSystem[dataQRSystem.length - 1].index + 1
          : 1;
      const newMockItem = {
        index: newIndex,
        image: insertQRSystem.image || "",
        productName: insertQRSystem.productName,
        code: insertQRSystem.code,
        warehouseName: insertQRSystem.warehouseName || "Unknown",
        collapse: false,
      };

      const newQRData = [...dataQRSystem, newMockItem];

      this.setState((prevState) => {
        const newLength = newQRData.length;
        const newTotalPages = Math.ceil(newLength / limitQRSystem);
        const lastPageIndex = Math.max(0, newTotalPages - 1);

        const newOffset = lastPageIndex * limitQRSystem;
        const newEndItem = Math.min(newOffset + limitQRSystem, newLength);

        return {
          dataQRSystem: newQRData,
          listLengthQRSystem: newLength,
          currentPageQRSystem: lastPageIndex,
          beginItemQRSystem: newOffset,
          endItemQRSystem: newEndItem,
          totalElementQRSystem: newEndItem - newOffset,
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
        idQRSystem: null,
        insertQRSystem: {},
      };
    });
  };

  onEditQRSystem = (id) => () => {
    const itemToEdit = this.state.dataQRSystem.find(
      (item) => item.index === id
    );

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idQRSystem: id,
        insertQRSystem: {
          ...itemToEdit,
          idQRSystem: id,
        },
        errorInserts: {},
      };
    });
  };

  toggleQRSystem = (el, val) => {
    let { dataQRSystem } = this.state;

    dataQRSystem
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataQRSystem, errorInserts: {} });
  };

  onHandleChangeValueQR = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertQRSystem: data,
        errorInserts: {},
      };
    });
  };

  toggleModalPopupDeleteArises = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupDelArises: !previousState.warningPopupDelArises,
      };
    });
  };

  handleDeleteQRArises = () => {
    let { deleteItemQRArises, dataQRArises, limitQRArises } = this.state;

    const updatedQRArises = dataQRArises
      .filter((item) => item.index !== deleteItemQRArises)
      .map((item, key) => ({ ...item, index: key + 1 }));

    this.setState(
      (previousState) => {
        const totalPagesAfterDelete = Math.ceil(
          updatedQRArises.length / limitQRArises
        );
        const currentPageAfterDelete =
          previousState.currentPageQRArises >= totalPagesAfterDelete
            ? Math.max(0, totalPagesAfterDelete - 1)
            : previousState.currentPageQRArises;

        const newOffset = Math.ceil(currentPageAfterDelete * limitQRArises);
        const newEndItem = newOffset + limitQRArises;

        return {
          ...previousState,
          warningPopupDelArises: false,
          dataQRArises: updatedQRArises,
          listLengthQRArises: updatedQRArises.length,
          currentPageQRArises: currentPageAfterDelete,
          beginItemQRArises: newOffset,
          endItemQRArises: Math.min(newEndItem, updatedQRArises.length),
          totalElementQRArises:
            Math.min(newEndItem, updatedQRArises.length) - newOffset,
        };
      },
      () => {
        toast.success("Xoá thông tin QR Phát sinh thành công!");
      }
    );
  };

  handlePageClickQRArises = (data) => {
    let { limitQRArises, dataQRArises } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitQRArises);

    let beginItemQRArises = offset;
    let endItemQRArises = Math.min(offset + limitQRArises, dataQRArises.length);
    let totalElementQRArises = endItemQRArises - beginItemQRArises;

    this.setState({
      beginItemQRArises: beginItemQRArises,
      endItemQRArises: endItemQRArises,
      currentPageQRArises: selected,
      totalElementQRArises: totalElementQRArises,
    });
  };

  onConfimQRArises = async (data, close) => {
    const { insertQRArises, dataQRArises, limitQRArises } = this.state;

    if (!insertQRArises.productName || !insertQRArises.code) {
      this.setState({
        messageErr: "Tên sản phẩm và Code không được bỏ trống.",
      });
      this.toggleModal("popupMessage");
      return;
    }

    if (insertQRArises.idQRArises) {
      const updatedData = dataQRArises.map((item) =>
        item.index === insertQRArises.idQRArises
          ? { ...item, ...insertQRArises }
          : item
      );
      this.setState({ dataQRArises: updatedData });
      toast.success("Cập nhật QR Phát sinh thành công!");
    } else {
      const newIndex =
        dataQRArises.length > 0
          ? dataQRArises[dataQRArises.length - 1].index + 1
          : 1;
      const newMockItem = {
        index: newIndex,
        image: insertQRArises.image || "",
        productName: insertQRArises.productName,
        code: insertQRArises.code,
        warehouseName: insertQRArises.warehouseName || "Unknown",
        collapse: false,
      };

      const newQRData = [...dataQRArises, newMockItem];

      this.setState((prevState) => {
        const newLength = newQRData.length;
        const newTotalPages = Math.ceil(newLength / limitQRArises);
        const lastPageIndex = Math.max(0, newTotalPages - 1);

        const newOffset = lastPageIndex * limitQRArises;
        const newEndItem = Math.min(newOffset + limitQRArises, newLength);

        return {
          dataQRArises: newQRData,
          listLengthQRArises: newLength,
          currentPageQRArises: lastPageIndex,
          beginItemQRArises: newOffset,
          endItemQRArises: newEndItem,
          totalElementQRArises: newEndItem - newOffset,
        };
      });

      toast.success("Thêm mới QR Phát sinh thành công!");
    }

    if (close) {
      close();
    } else {
      this.toggleModal("createNewModal");
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: false,
        idQRArises: null,
        insertQRArises: {},
      };
    });
  };

  onEditQRArises = (id) => () => {
    const itemToEdit = this.state.dataQRArises.find(
      (item) => item.index === id
    );

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        idQRArises: id,
        insertQRArises: {
          ...itemToEdit,
          idQRArises: id,
        },
        errorInserts: {},
      };
    });
  };

  toggleQRArises = (el, val) => {
    let { dataQRArises } = this.state;

    dataQRArises
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataQRArises, errorInserts: {} });
  };

  onHandleChangeValueQRArises = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertQRArises: data,
        errorInserts: {},
      };
    });
  };

  handleSubmitSearchForm = () => {
    console.log("Submit form tìm kiếm với:", {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
    });
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

  toggleModalPopupDeleteList = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupDelList: !previousState.warningPopupDelList,
      };
    });
  };

  handleDeleteQRList = () => {
    let { deleteItemQRList, dataQRList, limitQRList } = this.state;

    const updatedQRList = dataQRList
      .filter((item) => item.index !== deleteItemQRList)
      .map((item, key) => ({ ...item, index: key + 1 }));

    this.setState(
      (previousState) => {
        const totalPagesAfterDelete = Math.ceil(
          updatedQRList.length / limitQRList
        );
        const currentPageAfterDelete =
          previousState.currentPageQRList >= totalPagesAfterDelete
            ? Math.max(0, totalPagesAfterDelete - 1)
            : previousState.currentPageQRList;

        const newOffset = Math.ceil(currentPageAfterDelete * limitQRList);
        const newEndItem = newOffset + limitQRList;

        return {
          ...previousState,
          warningPopupDelList: false,
          dataQRList: updatedQRList,
          listLengthQRList: updatedQRList.length,
          currentPageQRList: currentPageAfterDelete,
          beginItemQRList: newOffset,
          endItemQRList: Math.min(newEndItem, updatedQRList.length),
          totalElementQRList:
            Math.min(newEndItem, updatedQRList.length) - newOffset,
        };
      },
      () => {
        toast.success("Xoá thông tin Mã QR thành công!");
      }
    );
  };

  handlePageClickQRList = (data) => {
    let { limitQRList, dataQRList } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitQRList);

    let beginItemQRList = offset;
    let endItemQRList = Math.min(offset + limitQRList, dataQRList.length);
    let totalElementQRList = endItemQRList - beginItemQRList;

    this.setState({
      beginItemQRList: beginItemQRList,
      endItemQRList: endItemQRList,
      currentPageQRList: selected,
      totalElementQRList: totalElementQRList,
    });
  };

  onConfimQRList = async (data, close) => {
    const { insertQRList, dataQRList, limitQRList } = this.state;

    console.log(insertQRList);

    // if (insertQRList.idQRList) {
    //   // Cập nhật
    //   const updatedData = dataQRList.map((item) =>
    //     item.index === insertQRList.idQRList
    //       ? { ...item, ...insertQRList }
    //       : item
    //   );
    //   this.setState({ dataQRList: updatedData });
    //   toast.success("Cập nhật Mã QR thành công!");
    // } else {
    //   // Thêm mới
    //   const newIndex =
    //     dataQRList.length > 0 ? dataQRList[dataQRList.length - 1].index + 1 : 1;
    //   const newMockItem = {
    //     index: newIndex,
    //     image: insertQRList.image || "",
    //     productName: insertQRList.productName,
    //     code: insertQRList.code,
    //     warehouseName: insertQRList.warehouseName || "Unknown",
    //     collapse: false,
    //   };

    //   const newQRData = [...dataQRList, newMockItem];

    //   this.setState((prevState) => {
    //     const newLength = newQRData.length;
    //     const newTotalPages = Math.ceil(newLength / limitQRList);
    //     const lastPageIndex = Math.max(0, newTotalPages - 1);

    //     const newOffset = lastPageIndex * limitQRList;
    //     const newEndItem = Math.min(newOffset + limitQRList, newLength);

    //     return {
    //       dataQRList: newQRData,
    //       listLengthQRList: newLength,
    //       currentPageQRList: lastPageIndex,
    //       beginItemQRList: newOffset,
    //       endItemQRList: newEndItem,
    //       totalElementQRList: newEndItem - newOffset,
    //     };
    //   });

    //   toast.success("Thêm mới Mã QR thành công!");
    // }

    // Đóng modal
    // if (close) {
    //   close();
    // } else {
    //   this.toggleModal("createNewModal");
    // }

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: false,
        idQRList: null,
        insertQRList: {},
      };
    });
  };

  onEditQRList = (id) => () => {
    const itemToEdit = this.state.dataQRList.find((item) => item.id === id);

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        isShowForListHistory: false,
        idQRList: id,
        insertQRList: {
          ...itemToEdit,
          idQRList: id,
        },
        errorInserts: {},
      };
    });
  };

  onEditQRListHistory = (id) => () => {
    const itemToEdit = this.state.dataQRList.find((item) => item.id === id);
    const historyData = this.state.TEM_HISTORY_DATA;
    this.setState({
      idQRList: id,
      insertQRList: { ...itemToEdit, idQRList: id, historyData: historyData },
      isShowForListHistory: true,
      isShowForEdit: false,
      createNewModal: true,
      errorInserts: {},
    });
  };

  toggleQRList = (el, val) => {
    let { dataQRList } = this.state;

    dataQRList
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ dataQRList, errorInserts: {} });
  };

  onHandleChangeValueQRList = (data) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        insertQRList: data,
        errorInserts: {},
      };
    });
  };

  render() {
    const {
      currentTab,
      // Tab 0
      dataQRSystem,
      headerQRSystem,
      headerQRArises,
      listLengthQRSystem,
      totalElementQRSystem,
      beginItemQRSystem,
      endItemQRSystem,
      limitQRSystem,
      currentPageQRSystem,
      warningPopupDelQR,
      idQRSystem,
      insertQRSystem,

      // Tab 1
      dataQRArises,
      listLengthQRArises,
      totalElementQRArises,
      beginItemQRArises,
      endItemQRArises,
      limitQRArises,
      currentPageQRArises,
      warningPopupDelArises,
      idQRArises,
      insertQRArises,
      fromDate,
      toDate,

      // Tab 2
      dataQRList,
      listLengthQRList,
      totalElementQRList,
      beginItemQRList,
      endItemQRList,
      limitQRList,
      currentPageQRList,
      warningPopupDelList,
      idQRList,
      insertQRList,
      headerQRList,
      typeQRList,
      isShowForListHistory,

      // Dùng chung
      options,
      activeCreateSubmit,
      createNewModal,
      popupMessage,
      messageErr,
      errorInsertAlert,
      errorInserts,
      isShowForEdit,
      PRODUCT_OPTIONS,
      TEMLIST_OPTIONS,
    } = this.state;

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

      ACCOUNT_CLAIM_FF.filter((x) => x == "Configs.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Configs.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Configs.Delete").map(
        (y) => (isDisableDelete = false)
      );
    }

    options.map((option) => {
      if (option) {
        option.name = option.companyName;
        option.value = option.id;
      }
    });

    const totalPageQRSystem = Math.ceil(listLengthQRSystem / limitQRSystem);
    const totalPageQRArises = Math.ceil(listLengthQRArises / limitQRArises);
    const totalPageQRList = Math.ceil(listLengthQRList / limitQRList);

    return (
      <div className="config-system">
        <div className="config-system-tab">
          <div
            onClick={this.onChooseTab(0)}
            className={`config-system-tab-item config-system-tab-item-button ${
              currentTab === 0 ? "active" : ""
            }`}
          >
            QR HỆ THỐNG
          </div>
          <div
            onClick={this.onChooseTab(1)}
            className={`config-system-tab-item config-system-tab-item-button ${
              currentTab === 1 ? "active" : ""
            }`}
          >
            QR PHÁT SINH
          </div>
          <div
            onClick={this.onChooseTab(2)}
            className={`config-system-tab-item config-system-tab-item-button ${
              currentTab === 2 ? "active" : ""
            }`}
          >
            QUẢN LÝ MÃ QR
          </div>
        </div>
        <div className="config-system-content">
          {currentTab === 0 && (
            <div className="config-system-content-config-qr-system">
              <HeaderTable
                hideSearch={true}
                hideCreate={true}
                isReadOnly={true}
                styleCustom={"justifyContentStart"}
                isShowForEdit={isShowForEdit && currentTab === 0}
                moduleTitle={
                  isShowForEdit && currentTab === 0
                    ? "Xem QR hệ thống"
                    : "Thêm mới QR hệ thống"
                }
                moduleBody={
                  <AddNewQRSystem
                    id={idQRSystem}
                    onHandleChangeValue={this.onHandleChangeValueQR}
                    errorInsert={errorInserts}
                    data={insertQRSystem}
                  />
                }
                handleModal={this.handleModal}
                onConfirm={this.onConfimQRSystem}
              />
              <Card className="shadow">
                <Table className="align-items-center tablecs " responsive>
                  <HeadTitleTable
                    headerTitle={headerQRSystem}
                    classHeaderColumns={{
                      0: "table-scale-col table-user-col-1",
                    }}
                  />
                  <tbody
                    ref={(ref) => (this.tableBody = ref)}
                    className="config-system-content-config-server-list-table-body"
                  >
                    {Array.isArray(dataQRSystem) &&
                      dataQRSystem
                        .filter(
                          (item, key) =>
                            key >= beginItemQRSystem && key < endItemQRSystem
                        )
                        .map((item, key) => (
                          <tr key={key}>
                            <td className="table-scale-col table-user-col-1">
                              {key + 1}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span
                                style={{
                                  color: "#1ec6e8",
                                  fontWeight: "bold",
                                  fontSize: 14,
                                }}
                              >
                                {item.productName}
                              </span>
                              <br />
                              <span>
                                Code:&nbsp;
                                {item.code}
                              </span>
                              <br />
                              <span>
                                Vùng sản xuất:&nbsp;
                                {item.warehouseName}
                              </span>
                            </td>
                            <td>
                              <ButtonDropdown
                                isOpen={item.collapse}
                                toggle={() => this.toggleQRSystem(key, item.id)}
                              >
                                <DropdownToggle>
                                  <img src={MenuButton} alt="Menu" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() =>
                                      alert(
                                        "Chuyển sang nhật ký truy xuất của QR này"
                                      )
                                    }
                                  >
                                    Xem nhật ký truy xuất
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={this.onEditQRSystem(item.id)}
                                  >
                                    Xem thông tin QR
                                  </DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem
                                    onClick={() => {
                                      this.toggleModal("warningPopupDelQR");
                                      this.setState({
                                        deleteItemQRSystem: item.id,
                                      });
                                    }}
                                  >
                                    Xoá
                                  </DropdownItem>
                                </DropdownMenu>
                              </ButtonDropdown>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </Table>
              </Card>
              {Array.isArray(dataQRSystem) && listLengthQRSystem > 0 && (
                <Pagination
                  data={dataQRSystem}
                  listLength={listLengthQRSystem}
                  totalPage={totalPageQRSystem}
                  totalElement={totalElementQRSystem}
                  handlePageClick={this.handlePageClickQRSystem}
                  currentPage={currentPageQRSystem}
                />
              )}
              <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle="Thêm mới QR Hệ thống"
                type100={true}
                moduleBody={
                  <AddNewQRSystem
                    id={idQRSystem}
                    errorInsert={errorInsertAlert}
                    onHandleChangeValue={this.onHandleChangeValueQR}
                  />
                }
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                onConfirm={(data, close) => {
                  this.onConfimQRSystem(data, close);
                }}
              />
              <WarningPopup
                moduleTitle="Thông báo"
                moduleBody={
                  <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                    Bạn đồng ý xoá thông tin **QR Hệ thống** này?
                  </p>
                }
                warningPopupModal={warningPopupDelQR}
                toggleModal={this.toggleModalPopupDeleteQR}
                handleWarning={this.handleDeleteQRSystem}
              />
            </div>
          )}

          {currentTab === 1 && (
            <div className="config-system-content-config-qr-generate">
              <HeaderTable
                hideSearch={true}
                hideCreate={true}
                styleCustom={"justifyContentStart"}
                isShowForEdit={isShowForEdit && currentTab === 1}
                moduleTitle={
                  isShowForEdit && currentTab === 1
                    ? "Chỉnh sửa QR Phát sinh"
                    : "Thêm mới QR Phát sinh"
                }
                moduleBody={
                  <AddNewQRArises
                    id={idQRArises}
                    onHandleChangeValue={this.onHandleChangeValueQRArises}
                    errorInsert={errorInserts}
                    data={insertQRArises}
                  />
                }
                handleModal={this.handleModal}
                onConfirm={this.onConfimQRArises}
                typeSearch={
                  <>
                    <div
                      className="div_flex"
                      style={{
                        marginBottom: "30px",
                        flex: "wrap",
                        width: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      <div className="mg-div-search">
                        <label className="form-control-label">Từ ngày</label>
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
                                fromDate: value
                                  ? value.format("DD-MM-YYYY")
                                  : "",
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="mg-div-search">
                        <label className="form-control-label">Đến ngày</label>
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
                                toDate: value ? value.format("DD-MM-YYYY") : "",
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="mg-div-search">
                        <label className="form-control-label">Sản phẩm</label>
                        <div>
                          <Select
                            name="filter"
                            title="Lọc theo sản phẩm"
                            data={PRODUCT_OPTIONS}
                            labelName="title"
                            val="id"
                            handleChange={this.handleChangeSelectFilter}
                          />
                        </div>
                      </div>

                      <div className="mg-btn">
                        <label className="form-control-label">&nbsp;</label>
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
              <Card className="shadow">
                <Table className="align-items-center tablecs " responsive>
                  <HeadTitleTable
                    headerTitle={headerQRArises}
                    classHeaderColumns={{
                      0: "table-scale-col table-user-col-1",
                    }}
                  />
                  <tbody
                    ref={(ref) => (this.tableBodyArises = ref)}
                    className="config-system-content-config-server-list-table-body"
                  >
                    {Array.isArray(dataQRArises) &&
                      dataQRArises
                        .filter(
                          (item, key) =>
                            key >= beginItemQRArises && key < endItemQRArises
                        )
                        .map((item, key) => (
                          <tr key={key}>
                            <td className="table-scale-col table-user-col-1">
                              {key + 1}
                            </td>
                            <td className="table-scale-col">
                              <img
                                style={{ width: 82, height: 82 }}
                                src={item.image ? item.image : NoImg}
                                alt="..."
                              />
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span
                                style={{
                                  color: "#1ec6e8",
                                  fontWeight: "bold",
                                  fontSize: 14,
                                }}
                              >
                                {item.productName}
                              </span>
                              <br />
                              <span>
                                Lô hàng:&nbsp;
                                {item.shipment}
                              </span>
                              <br />
                              <span>
                                Ngày kiểm duyệt:&nbsp;
                                {item.approvalDate}
                              </span>
                              <br />
                              <span>
                                Người kiểm duyệt:&nbsp;
                                {item.approvalBy}
                              </span>
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span>
                                {this.showTitleWithStatus(item.status)}
                              </span>
                            </td>
                            <td>
                              <ButtonDropdown
                                isOpen={item.collapse}
                                toggle={() => this.toggleQRArises(key, item.id)}
                              >
                                <DropdownToggle>
                                  <img src={MenuButton} alt="Menu" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() =>
                                      alert(
                                        "Chuyển sang trang nhật ký truy xuất của QR này"
                                      )
                                    }
                                  >
                                    Chi tiết nhật ký truy xuất
                                  </DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem
                                    onClick={() => {
                                      this.toggleModal("warningPopupDelArises");
                                      this.setState({
                                        deleteItemQRArises: item.id,
                                      });
                                    }}
                                  >
                                    Xoá
                                  </DropdownItem>
                                </DropdownMenu>
                              </ButtonDropdown>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </Table>
              </Card>
              {Array.isArray(dataQRArises) && listLengthQRArises > 0 && (
                <Pagination
                  data={dataQRArises}
                  listLength={listLengthQRArises}
                  totalPage={totalPageQRArises}
                  totalElement={totalElementQRArises}
                  handlePageClick={this.handlePageClickQRArises}
                  currentPage={currentPageQRArises}
                />
              )}
              <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle="Thêm mới QR Phát sinh"
                type100={true}
                moduleBody={
                  <AddNewQRArises
                    id={idQRArises}
                    errorInsert={errorInsertAlert}
                    onHandleChangeValue={this.onHandleChangeValueQRArises}
                  />
                }
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                onConfirm={(data, close) => {
                  this.onConfimQRArises(data, close);
                }}
              />
              <WarningPopup
                moduleTitle="Thông báo"
                moduleBody={
                  <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                    Bạn đồng ý xoá thông tin **QR Phát sinh** này?
                  </p>
                }
                warningPopupModal={warningPopupDelArises}
                toggleModal={this.toggleModalPopupDeleteArises}
                handleWarning={this.handleDeleteQRArises}
              />
            </div>
          )}

          {currentTab === 2 && (
            <div className="config-system-content-config-qr-list">
              <HeaderTable
                hideSearch={true}
                hideCreate={true}
                styleCustom={"justifyContentStart"}
                isShowForEdit={isShowForEdit && currentTab === 2}
                moduleTitle={
                  isShowForEdit && currentTab === 2
                    ? "Tạo yêu cầu hủy tem"
                    : isShowForListHistory && currentTab === 2
                    ? "Thông tin lịch sử dải tem"
                    : "Quản lý Mã QR"
                }
                moduleBody={
                  <div>
                    {isShowForEdit ? (
                      <AddNewQRList
                        id={idQRList}
                        onHandleChangeValue={this.onHandleChangeValueQRList}
                        errorInsert={errorInserts}
                        data={insertQRList}
                        TEMLIST_OPTIONS={TEMLIST_OPTIONS}
                      />
                    ) : isShowForListHistory ? (
                      <AddNewQRListHistory id={idQRList} />
                    ) : null}
                  </div>
                }
                handleModal={this.handleModal}
                onConfirm={this.onConfimQRList}
              />
              <Card className="shadow">
                <Table className="align-items-center tablecs " responsive>
                  <HeadTitleTable
                    headerTitle={headerQRList}
                    classHeaderColumns={{
                      0: "table-scale-col table-user-col-1",
                    }}
                  />
                  <tbody
                    ref={(ref) => (this.tableBodyList = ref)}
                    className="config-system-content-config-server-list-table-body"
                  >
                    {Array.isArray(dataQRList) &&
                      dataQRList
                        .filter(
                          (item, key) =>
                            key >= beginItemQRList && key < endItemQRList
                        )
                        .map((item, key) => (
                          <tr key={key}>
                            <td className="table-scale-col table-user-col-1">
                              {key + 1}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span>Ngày ĐK: {item.approvalDate}</span>
                              <br />
                              <span>Số lượng: {item.quantity}</span>
                              <br />
                              <span>Dải tem: {item.temList}</span>
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span>{item.useCount}</span>
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span>{item.availableCount}</span>
                            </td>
                            <td style={{ textAlign: "left" }}>
                              <span>{item.errorCount}</span>
                            </td>
                            <td>
                              <ButtonDropdown
                                isOpen={item.collapse}
                                toggle={() => this.toggleQRList(key, item.id)}
                              >
                                <DropdownToggle>
                                  <img src={MenuButton} alt="Menu" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={this.onEditQRList(item.id)}
                                  >
                                    Xử lý dải tem
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={this.onEditQRListHistory(item.id)}
                                  >
                                    Xem lịch sử
                                  </DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem
                                    onClick={() => {
                                      this.toggleModal("warningPopupDelList");
                                      this.setState({
                                        deleteItemQRList: item.id,
                                      });
                                    }}
                                  >
                                    Xoá
                                  </DropdownItem>
                                </DropdownMenu>
                              </ButtonDropdown>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </Table>
              </Card>
              {Array.isArray(dataQRList) && listLengthQRList > 0 && (
                <Pagination
                  data={dataQRList}
                  listLength={listLengthQRList}
                  totalPage={totalPageQRList}
                  totalElement={totalElementQRList}
                  handlePageClick={this.handlePageClickQRList}
                  currentPage={currentPageQRList}
                />
              )}
              <CreateNewPopup
                createNewModal={createNewModal}
                // Sửa tiêu đề dựa trên ngữ cảnh
                moduleTitle={
                  isShowForEdit
                    ? idQRList
                      ? "Chỉnh sửa Mã QR"
                      : "Thêm mới Mã QR"
                    : isShowForListHistory
                    ? "Thông tin lịch sử dải tem"
                    : "Thông tin Mã QR"
                }
                type100={true}
                moduleBody={
                  <div>
                    {isShowForEdit && (
                      <AddNewQRList
                        id={idQRList}
                        onHandleChangeValue={this.onHandleChangeValueQRList}
                        errorInsert={errorInserts}
                        TEMLIST_OPTIONS={TEMLIST_OPTIONS}
                        data={insertQRList}
                      />
                    )}
                    {isShowForListHistory && (
                      <AddNewQRListHistory
                        id={idQRList}
                        onHandleChangeValue={this.onHandleChangeValueQRList}
                        errorInsert={errorInserts}
                        data={insertQRList}
                      />
                    )}
                  </div>
                }
                toggleModal={this.toggleModal}
                activeSubmit={isShowForListHistory ? false : activeCreateSubmit}
                onConfirm={(data, close) => {
                  if (!isShowForListHistory) {
                    this.onConfimQRList(data, close);
                  } else {
                    if (close) close();
                    else this.toggleModal("createNewModal");
                  }
                }}
                isShowForEdit={!isShowForListHistory}
              />
              <WarningPopup
                moduleTitle="Thông báo"
                moduleBody={
                  <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                    Bạn đồng ý xoá thông tin **Mã QR** này?
                  </p>
                }
                warningPopupModal={warningPopupDelList}
                toggleModal={this.toggleModalPopupDeleteList}
                handleWarning={this.handleDeleteQRList}
              />
            </div>
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
  QrCodeManagement
);
