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
import CreateNewPopup from "../../../components/CreateNewPopup";
import "./table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";

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
} from "reactstrap";

import "../../../assets/css/global/index.css";
import "../../../assets/css/page/user.css";

import { getErrorMessageServer } from "utils/errorMessageServer.js";

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
  getDefaultFilter = () => ({
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
  });
  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.account;
    const { role } = nextProp;
    const { limit } = this.state;
    let roleData = null;
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
    this.fetchSummary(JSON.stringify(this.getDefaultFilter()));
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

  getField = (obj, name) => {
    if (!obj) return undefined;
    if (obj[name] !== undefined) return obj[name];
    const lower = name.toLowerCase();
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase() === lower) return obj[k];
    }
    return undefined;
  };

  strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  normalize = (raw) => {
    return {
      id: this.getField(raw, "ID") ?? this.getField(raw, "id") ?? "",
      fullName:
        this.getField(raw, "FullName") ?? this.getField(raw, "fullName") ?? "",
      phoneNumber:
        this.getField(raw, "PhoneNumber") ??
        this.getField(raw, "phoneNumber") ??
        "",
      position:
        this.getField(raw, "Position") ?? this.getField(raw, "position") ?? "",
      department:
        this.getField(raw, "Department") ??
        this.getField(raw, "department") ??
        "",
      roleID:
        this.getField(raw, "RoleID") ?? this.getField(raw, "roleID") ?? "",
      userName:
        this.getField(raw, "UserName") ?? this.getField(raw, "userName") ?? "",
      email: this.getField(raw, "Email") ?? this.getField(raw, "email") ?? "",
      passwordHash:
        this.getField(raw, "PasswordHash") ??
        this.getField(raw, "passwordHash") ??
        "",
      passwordConfirm:
        this.getField(raw, "PasswordConfirm") ??
        this.getField(raw, "passwordConfirm") ??
        undefined,
      avatarFile:
        this.getField(raw, "AvatarFile") ?? this.getField(raw, "avatarFile"),
      avatar:
        this.getField(raw, "Avatar") ?? this.getField(raw, "avatar") ?? "",
      raw,
    };
  };

  validateUserData = ({ data, isUpdate = false, dfPasswordHash = "" }) => {
    const err = {};
    if (!data.fullName) err.fullName = "Họ và tên không được bỏ trống";
    else if (data.fullName.length > 255)
      err.fullName = "Họ và tên nhập tối đa 255 ký tự";

    if (!data.roleID) err.roleID = "Chưa chọn Nhóm quyền";

    if (!data.userName) err.userName = "Tên đăng nhập không được bỏ trống";
    else if (data.userName.length < 6)
      err.userName = "Tên đăng nhập phải có ít nhất 6 kí tự";
    else if (data.userName.length > 255)
      err.userName = "Tên đăng nhập nhập tối đa 255 ký tự";
    if (data.position && data.position.length > 255)
      err.position = "Chức vụ nhập tối đa 255 ký tự";
    if (data.department && data.department.length > 255)
      err.department = "Phòng ban nhập tối đa 255 ký tự";

    if (!isUpdate) {
      if (!data.passwordHash) {
        err.passwordHash = "Mật khẩu không được bỏ trống";
      } else if (!this.strongPasswordRegex.test(data.passwordHash)) {
        err.passwordHash =
          "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, viết thường và một số";
      }
      if (data.passwordHash && data.passwordConfirm !== data.passwordHash) {
        err.passwordConfirm = "Mật khẩu không trùng";
      }
    } else {
      const newPass = data.passwordHash;
      if (
        newPass &&
        newPass.trim().toUpperCase() !==
          (dfPasswordHash || "").trim().toUpperCase()
      ) {
        if (!this.strongPasswordRegex.test(newPass)) {
          err.passwordHash =
            "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, viết thường và một số";
        }
        if (data.passwordConfirm !== newPass) {
          err.passwordConfirm = "Mật khẩu không trùng";
        }
      }
    }

    return err;
  };

  buildFormData = ({ data, isUpdate = false, processedRoleID = null }) => {
    const fd = new FormData();
    fd.append("ID", data.id || "");
    fd.append("FullName", data.fullName || "");
    fd.append("PhoneNumber", data.phoneNumber || "");
    fd.append("Position", data.position || "");
    fd.append("Department", data.department || "");
    fd.append(
      "RoleID",
      processedRoleID !== null ? processedRoleID : data.roleID || ""
    );
    fd.append("UserName", data.userName || "");
    fd.append("Email", data.email ?? "");
    fd.append("PasswordHash", data.passwordHash || "");
    fd.append(
      "PasswordConfirm",
      typeof data.passwordConfirm !== "undefined"
        ? data.passwordConfirm || ""
        : ""
    );
    if (
      typeof data.avatarFile !== "undefined" &&
      data.avatarFile !== null &&
      data.avatarFile !== ""
    ) {
      fd.append("AvatarFile", data.avatarFile);
    } else if (isUpdate) {
      fd.append("Avatar", data.avatar || "");
    } else {
      fd.append("AvatarFile", "");
    }
    return fd;
  };

  handleCreateInfoData = async (value, closeForm, closePopup) => {
    const { createUserInfo } = this.props;
    const raw = this.state.updateData || value || {};
    const data = this.normalize(raw);

    const errorInsert = this.validateUserData({ data, isUpdate: false });

    if (Object.keys(errorInsert).length > 0) {
      this.setState((prev) => ({ ...prev, errorInsert }));
      return;
    }

    this.setState((prev) => ({ ...prev, errorInsert: {} }));

    const formData = this.buildFormData({ data, isUpdate: false });

    if (closeForm) closeForm();

    try {
      this.setState({ isLoaded: true });
      const res = await createUserInfo(formData);
      this.setState({ isLoaded: false });

      if (res?.data?.status == 404) {
        const message = getErrorMessageServer(res);
        if (message) {
          this.setState((prev) => ({
            ...prev,
            errorInsert: { global: message },
          }));
        }
        this.setState({
          errNoti: res.data.message || "Thêm tài khoản thất bại",
        });
        this.toggleModal("popupMessage");
        return;
      }

      if (res?.data?.status == 200) {
        toast.success("Thêm mới tài khoản thành công!");
        this.fetchSummary(JSON.stringify(this.getDefaultFilter()));
        if (closePopup !== "closePopup") {
          this.toggleModal("createNewModal");
        }
      }
    } catch (err) {
      this.setState({
        isLoaded: false,
        errNoti: err.message || "Thêm tài khoản thất bại",
      });
      this.toggleModal("popupMessage");
    }
  };

  handleUpdateInfoData = async (value) => {
    const { updateUserInfo } = this.props;
    const updateDataRaw = { ...value };
    const data = this.normalize(updateDataRaw);

    let roleIDs = data.roleID;
    if (typeof roleIDs === "string") {
      roleIDs = roleIDs
        .split(",")
        .map((x) => x.trim())
        .filter((x) => x !== "")
        .join(",");
    }

    const dfPasswordHash = this.state.dfPasswordHash || "";

    const errorUpdate = this.validateUserData({
      data,
      isUpdate: true,
      dfPasswordHash,
    });

    if (Object.keys(errorUpdate).length > 0) {
      this.setState((prev) => ({ ...prev, errorUpdate }));
      return;
    }

    this.setState((prev) => ({
      ...prev,
      errorUpdate: {},
      detail: null,
      updateModal: false,
    }));

    const formData = this.buildFormData({
      data,
      isUpdate: true,
      processedRoleID: roleIDs,
    });

    try {
      this.setState({ isLoaded: true });
      const res = await updateUserInfo(formData);
      this.setState({ isLoaded: false });

      if (res?.data?.status == 404) {
        this.setState({ errNoti: res.data.message || "Cập nhật thất bại" });
        this.toggleModal("popupMessage");
        return;
      }

      if (res?.data?.status == 200) {
        toast.success("Cập nhật tài khoản thành công!");
        this.fetchSummary(JSON.stringify(this.getDefaultFilter()));
      }
    } catch (err) {
      this.setState({
        isLoaded: false,
        errNoti: err.message || "Cập nhật thất bại",
      });
      this.toggleModal("popupMessage");
    }
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
        this.fetchSummary(JSON.stringify(this.getDefaultFilter()));
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

    this.setState({ dataExport: itemDataExport });
  };

  renderTable = () => {
    const { data, beginItem, endItem, isDisableEdit, isDisableDelete, headerTitle } =
      this.state;

    return (
      <Card className="shadow">
        <Table
          className="align-items-center tablecs table-class-css"
          responsive
        >
          <HeadTitleTable headerTitle={headerTitle} />
          <tbody ref={(ref) => (this.tableBody = ref)}>
            {Array.isArray(data) &&
              data.slice(beginItem, endItem).map((item, key) => (
                <tr key={key} className="table-hover-css">
                  <td>{item.index}</td>
                  <td>{item.roleName}</td>
                  <td>{item.fullName}</td>
                  <td>{item.userName}</td>
                  <td>
                    {(!isDisableEdit || !isDisableDelete) && (
                      <ButtonDropdown
                        isOpen={item.collapse}
                        toggle={() => this.toggle(key, item.id)}
                      >
                        <DropdownToggle>
                          <img src={MenuButton} />
                        </DropdownToggle>
                        <DropdownMenu>
                          {!isDisableEdit && (
                            <DropdownItem
                              onClick={() => {
                                this.toggleModal("updateModal");
                                this.handleOpenEdit(item.id);
                              }}
                            >
                              Sửa
                            </DropdownItem>
                          )}
                          {!isDisableDelete && item.status !== 0 && (
                            <>
                              <DropdownItem divider />
                              <DropdownItem
                                onClick={() => {
                                  this.toggleModal("warningPopupModal");
                                  this.setState({ deleteItem: item.id });
                                }}
                              >
                                Xoá
                              </DropdownItem>
                            </>
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    );
  };

  render() {
    const {
      status,
      data,
      message,
      isLoaded,
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
                          JSON.stringify(this.getDefaultFilter())
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

                    {this.renderTable()}

                    {Array.isArray(data) && (
                      <Pagination
                        data={data}
                        listLength={listLength}
                        totalPage={totalPage}
                        totalElement={totalElement}
                        handlePageClick={this.handlePageClick}
                      />
                    )}
                  </div>
                </Row>
              )}

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

              {setAlertContext(statusPopup)}

              {openAlertContext(statusPopup)}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionRoleCreators, dispatch),
    ...bindActionCreators(actionCreators, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  UserAccount
);
