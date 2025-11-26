import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { USER_ACCOUNT_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../actions/UserListActions.js";
import { actionRoleCreators } from "../../../actions/RoleListActions.js";
import classes from "./index.module.css";
import MenuButton from "../../../assets/img/buttons/menu.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import SearchModal from "./SearchModal";
import UpdatePopup from "../../../components/UpdatePopup";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";
import CreateNewPopup from "../../../components/CreateNewPopup";
import "./table.css";
import PlusImg from "../../../assets/img/buttons/plus.svg";
import ExcelJS from "exceljs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";

import { generateStyleTableCol, isUpper } from "../../../bases/helper";
import "../../../assets/css/global/index.css";
import "../../../assets/css/page/user.css";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { CSVLink } from "react-csv";
import { actionAccountCreatorsNew } from "actions/AccountNewActions.js";

class UserAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      detail: null,
      detail1: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: "",
      accounts: [],
      history: [],
      roles: [],
      headerTitle: USER_ACCOUNT_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        status: 1,
        roleIDs: "",
        userName: "",
        fullName: "",
        phone: "",
        email: "",
        position: "",
        orderBy: "",
        page: null,
        limit: null,
      },
      activeCreateSubmit: false,
      newData: [],
      deleteItem: null,
      updateModal: false,
      warningPopupModal: false,
      errorInsert: {},
      errorUpdate: {},
      popupMessage: null,
    };

    this.tableBody = null;
  }

  componentWillReceiveProps(nextProp) {
    const { requestUserListStore } = this.props;
    let { data } = nextProp.account;
    const { role } = nextProp;
    const { limit } = this.state;
    let roleData = null;
    // let dataExport = [];
    // let itemDataExport = {}
    if (role !== this.state.role) {
      if (typeof role !== "undefined") {
        if (typeof role.data !== "undefined") {
          roleData = role.data;

          if (typeof roleData.roles !== "undefined") {
            this.setState({
              roles: roleData.roles.roles,
              status: roleData.status,
              message: PLEASE_CHECK_CONNECT(roleData.message),
            });
          }
        }
      }
    }

    if (data !== this.state.data) {
      if (typeof data !== "undefined") {
        if (typeof data.data !== "undefined") {
          if (data.data !== null) {
            if (typeof data.data.users !== "undefined") {
              data.data.users.map((item, key) => {
                item["index"] = key + 1;
                item["collapse"] = false;
              });

              // data.data.users.map((item, key) => {
              //   itemDataExport = {
              //     'STT': key,
              //     'Tên': item.fullName,
              //     'Tên đăng nhập': item.userName,
              //     'Địa chỉ': item.address,
              //     'Số điện thoại': item.phone,
              //     'Nhóm quyền': item.roleName,
              //     'Chi tiết nhóm quyền': item.roleDescription
              //   }
              //   dataExport.push(itemDataExport)
              // })

              this.setState({
                data: data.data.users,
                listLength: data.data.total,
                totalPage: Math.ceil(data.data.users.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message),
              });
            }
          }
        }

        // Set State - After Open Detail
        if (typeof data.detail !== "undefined") {
          this.setState({
            detail: data.detail,
            dfPasswordHash: data.detail.PasswordHash,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message),
          });
        }
      }
    }
  }

  componentWillMount() {
    const { getAllAccountListNew } = this.props;
    const accountPayload = {
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    getAllAccountListNew(accountPayload).then((res) => {
      if (res.status) {
        console.log("✅ Dữ liệu Accounts mới (RESOLVE):", res.data);
        this.setState({ accounts: res.data.data || [] });
      } else {
        console.error(
          "❌ Lỗi lấy Accounts mới:",
          res.error || res.data.message
        );
      }
    });
    /* Fetch Summary */
    this.fetchSummary(
      JSON.stringify({
        status: 1,
        roleIDs: "",
        userName: "",
        fullName: "",
        phone: "",
        email: "",
        position: "",
        orderBy: "",
        page: null,
        limit: null,
      })
    );
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestUserListStore, getAllRoleList } = this.props;
    requestUserListStore(data);
    getAllRoleList(data);
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

  /**
   * handleSelect: Handle Select
   * @param {*} value: value
   * @param {*} name: name of value
   */
  handleSelect = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  };

  handleSubmitSearchForm = () => {
    const { filter } = this.state;

    this.fetchSummary(JSON.stringify(filter));
  };

  renderCreateModal = () => {
    const { roles } = this.state;

    return (
      <AddNewModal
        data={roles}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewDataCreate}
        errorInsert={this.state.errorInsert}
      />
    );
  };

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  };

  handleNewData = (data) => {
    this.setState({ newData: data });
  };

  handleNewDataCreate = (value) => {
    const userTotal = this.state.data.length + 1;
    let aacc = [];
    let bbb = [];

    if (value.roleID) {
      aacc = value.roleID.split(",");
      bbb = aacc.filter((x) => x != "");
    }
    const updateData = {
      id: `${userTotal}`,
      fullName: value.fullName || "",
      phoneNumber: value.phoneNumber || "",
      position: value.position || "",
      department: value.department || "",
      roleID: bbb.join() || "",
      userName: value.userName || "",
      email: value.email || "",
      passwordHash: value.passwordHash || "",
      passwordConfirm: value.passwordConfirm || "",
      avatarFile: value.avatarFile || null,
    };

    this.setState((previousState) => {
      return {
        ...previousState,
        updateData,
      };
    });
  };

  /**
   * handleCreateInfoData: Handle Create Info Data
   * @param {*} value
   */
  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { createUserInfo } = this.props;

    const formData = new FormData();
    const { updateData } = this.state;
    const errorInsert = {};

    // this.setState(previousState => {
    // 	return {
    // 		...previousState,
    // 		errorInsert
    // 	}
    // });

    if (!updateData.fullName) {
      errorInsert["fullName"] = "Họ và tên không được bỏ trống";
    }

    if ((updateData.fullName || "").length > 255) {
      errorInsert["fullName"] = "Họ và tên nhập tối đa 255 ký tự";
    }

    if (!updateData.roleID) {
      errorInsert["roleID"] = "Chưa chọn Nhóm quyền";
    }

    if (!updateData.userName) {
      errorInsert["userName"] = "Tên đăng nhập không được bỏ trống";
    }

    if ((updateData.userName || "").length > 255) {
      errorInsert["userName"] = "Tên đăng nhập nhập tối đa 255 ký tự";
    }

    if (updateData.userName && (updateData.userName || "").length < 6) {
      errorInsert["userName"] = "Tên đăng nhập phải có ít nhất 6 kí tự";
    }

    if (!updateData.passwordHash) {
      errorInsert["passwordHash"] = "Mật khẩu không được bỏ trống";
    }

    if (
      updateData.passwordHash &&
      ((updateData.passwordHash || "").length < 6 ||
        !isUpper(updateData.passwordHash))
    ) {
      errorInsert["passwordHash"] =
        "Mật khẩu phải có ít nhất 6 kí tự và 1 kí tự viết hoa";
    }

    if (updateData.passwordHash) {
      var strongRegex = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
      );
      var test = strongRegex.test(updateData.passwordHash);
      if (test) {
      } else {
        errorInsert["passwordHash"] =
          "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, viết thường và một số";
      }

      if (updateData.passwordConfirm != updateData.passwordHash) {
        errorInsert["passwordConfirm"] = "Mật khẩu không trùng";
      }
    }

    // if (!updateData.phoneNumber) {
    // 	errorInsert['phoneNumber'] = 'Điện thoại không được bỏ trống';
    // }

    // if ((updateData.phoneNumber || '').length > 255) {
    // 	errorInsert['phoneNumber'] = 'Điện thoại không được nhập quá 255 ký tự';
    // }

    // if (updateData.phoneNumber && !validPhone(updateData.phoneNumber)) {
    // 	errorInsert['phoneNumber'] = 'Điện thoại không đúng định dạng';
    // }

    // if (!updateData.email) {
    // 	errorInsert['email'] = 'Email không được bỏ trống';
    // }

    // if ((updateData.email || '').length > 255) {
    // 	errorInsert['email'] = 'Email không được nhập quá 255 ký tự';
    // }

    // if (updateData.email && !validEmail(updateData.email)) {
    // 	errorInsert['email'] = 'Email không đúng định dạng';
    //}

    if (updateData.position && (updateData.position || "").length > 255) {
      errorInsert["position"] = "Chức vụ nhập tối đa 255 ký tự";
    }

    if (updateData.department && (updateData.department || "").length > 255) {
      errorInsert["department"] = "Phòng ban nhập tối đa 255 ký tự";
    }

    if (Object.keys(errorInsert).length > 0) {
      this.setState((previousState) => {
        return {
          ...previousState,
          errorInsert,
        };
      });

      return;
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        errorInsert: {},
      };
    });

    formData.append("ID", updateData.id ? updateData.id : "");
    formData.append("FullName", updateData.fullName ? updateData.fullName : "");
    formData.append(
      "PhoneNumber",
      updateData.phoneNumber ? updateData.phoneNumber : ""
    );
    formData.append("Position", updateData.position ? updateData.position : "");
    formData.append(
      "Department",
      updateData.department ? updateData.department : ""
    );
    formData.append("RoleID", updateData.roleID ? updateData.roleID : "");
    formData.append("UserName", updateData.userName ? updateData.userName : "");
    formData.append("Email", updateData.email ? updateData.email : "");
    formData.append(
      "PasswordHash",
      updateData.passwordHash ? updateData.passwordHash : ""
    );
    formData.append(
      "PasswordConfirm",
      updateData.passwordConfirm ? updateData.passwordConfirm : ""
    );
    formData.append(
      "AvatarFile",
      updateData.avatarFile ? updateData.avatarFile : ""
    );

    if (closeForm) {
      closeForm();
    }
    // console.log(updateData.avatarFile);
    createUserInfo(formData).then((res) => {
      this.setState({ isLoaded: true });
      if (res.data.status == 404) {
        const message = getErrorMessageServer(res);

        if (message) {
          this.setState((previousState) => {
            return {
              ...previousState,
              errorInsert: {
                global: message,
              },
            };
          });
        }

        this.setState({
          errNoti: res.data.message || "Thêm tài khoản thất bại",
          isLoaded: false,
        });

        this.toggleModal("popupMessage");
        this.setState({ isLoaded: false });
        return;
      } else if (res.data.status == 200) {
        this.fetchSummary(
          JSON.stringify({
            status: 1,
            roleIDs: "",
            userName: "",
            fullName: "",
            phone: "",
            email: "",
            position: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );
        if (closePopup != "closePopup") {
          this.toggleModal("createNewModal");
        }
        this.setState({ isLoaded: false });
      }
    });
  };

  // Handle Update User Account
  handleUpdateInfoData = (value) => {
    const { updateUserInfo } = this.props;
    const updateData = { ...value };
    const formData = new FormData();

    let aacc = updateData.RoleID ? updateData.RoleID.split(",") : "";
    let bbb = aacc.filter((x) => x != "");

    const errorUpdate = {};

    this.setState((previousState) => {
      return {
        ...previousState,
        errorUpdate,
      };
    });

    if (!updateData.FullName) {
      errorUpdate["fullName"] = "Họ và tên không được bỏ trống";
    }

    if ((updateData.FullName || "").length > 255) {
      errorUpdate["fullName"] = "Họ và tên nhập tối đa 255 ký tự";
    }

    if (!updateData.RoleID) {
      errorUpdate["roleID"] = "Chưa chọn Nhóm quyền";
    }

    if (!updateData.UserName) {
      errorUpdate["userName"] = "Tên đăng nhập không được bỏ trống";
    }

    if (updateData.UserName && (updateData.UserName || "").length < 6) {
      errorUpdate["userName"] = "Tên đăng nhập phải có ít nhất 6 kí tự";
    }

    if ((updateData.UserName || "").length > 255) {
      errorUpdate["userName"] = "Tên đăng nhập nhập tối đa 255 ký tự ";
    }

    // if (!updateData.PasswordHash) {
    // 	errorUpdate['passwordHash'] = 'Mật khẩu không được bỏ trống';
    // }

    if (updateData.PasswordHash) {
      if (
        (updateData.PasswordHash || "").trim().toUpperCase() !=
        (this.state.dfPasswordHash || "").trim().toUpperCase()
      ) {
        var strongRegex = new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        );
        var test = strongRegex.test(updateData.PasswordHash);
        if (test) {
        } else {
          errorUpdate["passwordHash"] =
            "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, viết thường và một số";
        }

        if (updateData.passwordConfirm != updateData.PasswordHash) {
          errorUpdate["passwordConfirm"] = "Mật khẩu không trùng";
        }
      }
    }

    // if (!updateData.PhoneNumber) {
    // 	errorUpdate['phoneNumber'] = 'Điện thoại không được bỏ trống';
    // }

    // if ((updateData.PhoneNumber || '').length > 255) {
    // 	errorUpdate['phoneNumber'] = 'Điện thoại không được nhập quá 255 ký tự';
    // }

    // if (updateData.PhoneNumber && !validPhone(updateData.PhoneNumber)) {
    // 	errorUpdate['phoneNumber'] = 'Điện thoại không đúng định dạng';
    // }

    // if (!updateData.Email) {
    // 	errorUpdate['email'] = 'Email không được bỏ trống';
    // }

    // if ((updateData.Email || '').length > 255) {
    // 	errorUpdate['email'] = 'Email không được nhập quá 255 ký tự';
    // }

    // if (updateData.Email && !validEmail(updateData.Email)) {
    // 	errorUpdate['email'] = 'Email không đúng định dạng';
    // }

    if (updateData.Position && (updateData.Position || "").length > 255) {
      errorUpdate["position"] = "Chức vụ nhập tối đa 255 ký tự";
    }

    if (updateData.Department && (updateData.Department || "").length > 255) {
      errorUpdate["department"] = "Phòng ban nhập tối đa 255 ký tự";
    }

    if (Object.keys(errorUpdate).length > 0) {
      this.setState((previousState) => {
        return {
          ...previousState,
          errorUpdate,
        };
      });

      return;
    }
    this.setState((previousState) => {
      return {
        ...previousState,
        errorUpdate: {},
        detail: null,
        updateModal: false,
      };
    });

    formData.append("ID", updateData.ID ? updateData.ID : "");
    formData.append("FullName", updateData.FullName ? updateData.FullName : "");
    formData.append(
      "PhoneNumber",
      updateData.PhoneNumber ? updateData.PhoneNumber : ""
    );
    formData.append("Position", updateData.Position ? updateData.Position : "");
    formData.append(
      "Department",
      updateData.Department ? updateData.Department : ""
    );
    formData.append("RoleID", bbb.join());
    formData.append("UserName", updateData.UserName ? updateData.UserName : "");
    formData.append(
      "Email",
      updateData.Email == null || updateData.Email == "null"
        ? ""
        : updateData.Email
    );
    formData.append(
      "PasswordHash",
      updateData.PasswordHash ? updateData.PasswordHash : ""
    );
    if (typeof updateData.passwordConfirm !== "undefined") {
      // console.log('TH1')
      formData.append(
        "PasswordConfirm",
        updateData.passwordConfirm ? updateData.passwordConfirm : ""
      );
    } else {
      // console.log('TH2')
      formData.append("PasswordConfirm", "");
    }

    if (typeof updateData.avatarFile !== "undefined") {
      formData.append("AvatarFile", updateData.avatarFile);
    } else {
      formData.append("Avatar", updateData.Avatar ?? "");
    }

    // Call update
    updateUserInfo(formData).then((res) => {
      this.setState({ isLoaded: true });
      if (res.data.status == 404) {
        this.setState({ isLoaded: false });
        this.setState({ errNoti: res.data.message, isLoaded: false });
        this.toggleModal("popupMessage");
        return;
      } else if (res.data.status == 200) {
        this.setState({ isLoaded: false });
        this.fetchSummary(
          JSON.stringify({
            status: 1,
            roleIDs: "",
            userName: "",
            fullName: "",
            phone: "",
            email: "",
            position: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );
      }
    });
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
      });
    }
  };

  handleOpenEdit = (id) => {
    const { getUserInfo } = this.props;

    getUserInfo(id);
  };

  handleDeleteRow = () => {
    const { deleteUserInfo, requestUserListStore } = this.props;
    let { data, deleteItem } = this.state;
    let newData = data
      .filter((item) => item.id === deleteItem)
      .map((item, key) => {
        item.status = 0;
      });

    deleteUserInfo(deleteItem).then((res) => {
      if (res.data.status == 200) {
        this.fetchSummary(
          JSON.stringify({
            status: 1,
            roleIDs: "",
            userName: "",
            fullName: "",
            phone: "",
            email: "",
            position: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );
        toast.success("Xoá tài khoản thành công!");
      }
    });
  };

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev["name"]] = ev["value"];

    this.setState({ filter });
  };

  handleStatus = (event) => {
    for (
      let i = 0;
      i < document.getElementsByClassName("checkbox-status").length;
      i++
    ) {
      document.getElementsByClassName("checkbox-status")[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  };

  closeForm = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        errorInsert: {},
      };
    });
  };

  toggle = (el, val) => {
    let { data } = this.state;

    data
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ data });
  };

  customers = () => {
    let { data } = this.state;
    let dataExport = [];
    let itemDataExport = {
      STT: "",
    };

    data.data.users.map((item, key) => {
      item["index"] = key + 1;
      item["collapse"] = false;
    });

    // dataExport.push(itemDataExport)

    this.setState({ dataExport: itemDataExport });
  };

  render() {
    const {
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      activeCreateSubmit,
      newData,
      roles,
      updateModal,
      detail,
      filter,
      warningPopupModal,
      errNoti,
      errorUpdate,
      popupMessage,
      createNewModal,
      dataExport,
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

      ACCOUNT_CLAIM_FF.filter((x) => x == "Users.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Users.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Users.Delete").map(
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
                      screen="account"
                      dataReload={() => {
                        this.setState((previousState) => {
                          return {
                            ...previousState,
                            filter: {},
                          };
                        });

                        this.fetchSummary(
                          JSON.stringify({
                            status: 1,
                            roleIDs: "",
                            userName: "",
                            fullName: "",
                            phone: "",
                            email: "",
                            position: "",
                            orderBy: "",
                            page: null,
                            limit: null,
                          })
                        );
                      }}
                      hideCreate={isDisableAdd == false ? false : true}
                      searchForm={
                        <SearchModal
                          filter={filter}
                          roles={roles}
                          handleChangeFilter={this.handleChangeFilter}
                          handleStatus={this.handleStatus}
                          handleSelect={this.handleSelect}
                        />
                      }
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
                      }
                      moduleTitle="Thêm tài khoản người dùng"
                      moduleBody={this.renderCreateModal()}
                      activeSubmit={activeCreateSubmit}
                      newData={newData}
                      handleCreateInfoData={this.handleCreateInfoData}
                      isPreventForm={true}
                      closeForm={this.closeForm}
                    />

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className="align-items-center tablecs table-class-css"
                        responsive
                      >
                        {dataExport && (
                          <CSVLink data={dataExport} filename={"AX"}>
                            Export XX
                          </CSVLink>
                        )}
                        <HeadTitleTable
                          headerTitle={headerTitle}
                          classHeaderColumns={{
                            0: "table-scale-col table-user-col-1",
                          }}
                        />
                        <tbody ref={(ref) => (this.tableBody = ref)}>
                          {Array.isArray(data) &&
                            data
                              .filter(
                                (item, key) => key >= beginItem && key < endItem
                              )
                              .map((item, key) => (
                                <tr
                                  key={key}
                                  style={{
                                    ...generateStyleTableCol(
                                      this.tableBody,
                                      (data || []).length
                                    ),
                                  }}
                                  className="table-hover-css"
                                >
                                  <td className="table-scale-col table-user-col-1">
                                    {item.index}
                                  </td>
                                  {/* <td style={{ textAlign: 'center' }} className={`table-scale-col cursor-unset`}>
																				<span className={`${item.status === 0 || item.status === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}</span>
																			</td> */}
                                  <td>
                                    {item.avatar !== null ? (
                                      <div
                                        style={{
                                          background: `url(${item.avatar})`,
                                        }}
                                        className={classes.ava}
                                      />
                                    ) : (
                                      <div
                                        style={{ background: `url(${Noimg})` }}
                                        className={classes.ava}
                                      />
                                    )}
                                  </td>
                                  <td
                                    style={{ textAlign: "left" }}
                                    className="table-scale-col color-black"
                                  >
                                    {item.roleName}
                                  </td>
                                  <td
                                    style={{ textAlign: "left" }}
                                    className="table-scale-col color-black"
                                  >
                                    {item.fullName}
                                  </td>
                                  <td
                                    style={{ textAlign: "left" }}
                                    className="table-scale-col color-black"
                                  >
                                    {item.userName}
                                  </td>
                                  <td>
                                    {isDisableEdit == true &&
                                    isDisableDelete == true ? null : (
                                      <ButtonDropdown
                                        isOpen={item.collapse}
                                        toggle={() => this.toggle(key, item.id)}
                                      >
                                        <DropdownToggle>
                                          <img src={MenuButton} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          {isDisableEdit == false ? (
                                            <DropdownItem
                                              onClick={() => {
                                                this.toggleModal("updateModal");
                                                this.handleOpenEdit(item.id);
                                              }}
                                            >
                                              Sửa
                                            </DropdownItem>
                                          ) : null}
                                          {isDisableEdit == true ||
                                          isDisableDelete == true ? null : (
                                            <div>
                                              {item.status == 0 ? null : (
                                                <DropdownItem divider />
                                              )}
                                            </div>
                                          )}
                                          {isDisableDelete == false ? (
                                            <div>
                                              {item.status == 0 ? null : (
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal(
                                                      "warningPopupModal"
                                                    );
                                                    this.setState({
                                                      deleteItem: item.id,
                                                    });
                                                  }}
                                                >
                                                  Xoá
                                                </DropdownItem>
                                              )}
                                            </div>
                                          ) : null}
                                        </DropdownMenu>
                                      </ButtonDropdown>
                                    )}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </Table>
                    </Card>

                    {/* Pagination */}
                    {
                      // Page of Table
                      Array.isArray(data) && (
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

              {/* Update */}
              {detail !== null && (
                <UpdatePopup
                  moduleTitle="Cập nhật thông tin"
                  moduleBody={
                    <UpdateModal
                      data={detail}
                      handleCheckValidation={this.handleCheckValidation}
                      handleNewData={this.handleNewData}
                      roles={roles}
                      errorUpdate={errorUpdate}
                    />
                  }
                  newData={newData}
                  updateModal={updateModal}
                  toggleModal={this.toggleModal}
                  activeSubmit={activeCreateSubmit}
                  handleUpdateInfoData={this.handleUpdateInfoData}
                />
              )}
              <CreateNewPopup
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle="Thêm tài khoản người dùng"
                type100={true}
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleCreateInfoData={(data, beta, close) => {
                  this.handleCreateInfoData(
                    data,
                    () => {
                      this.setState({
                        createNewModal: false,
                      });
                    },
                    close
                  );
                }}
              />

              <WarningPopup
                moduleTitle="Thông báo"
                moduleBody={
                  <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                    Bạn đồng ý xoá thông tin này?
                  </p>
                }
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
              />
              {message ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={"Thông báo"}
                  moduleBody={message}
                  toggleModal={this.toggleModal}
                />
              ) : null}
              {errNoti ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={"Thông báo"}
                  moduleBody={errNoti}
                  toggleModal={this.toggleModal}
                />
              ) : null}

              <ToastContainer position="top-center" autoClose={3000} />

              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.UserListStore,
    role: state.RoleStore,
    accountNewState: state.accountStateNew,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionRoleCreators, dispatch),
    ...bindActionCreators(actionCreators, dispatch),
    ...bindActionCreators(actionAccountCreatorsNew, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  UserAccount
);
