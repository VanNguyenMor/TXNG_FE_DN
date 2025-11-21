import React, { Component } from "react";
import compose from "recompose/compose";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { ROLE_ACCOUNT_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionRoleCreators } from "../../../actions/RoleListActions.js";
import classes from "./index.module.css";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import UpdatePopup from "../../../components/UpdatePopup";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import CreateNewPopup from "../../../components/CreateNewPopup";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import "./roleList.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// reactstrap components
import {
  Card,
  Table,
  Container,
  Input,
  Button,
  Row,
  Spinner,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "../../../assets/css/global/index.css";

class RoleList extends Component {
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
      history: [],
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      detail: null,
      newDetail: null,
      dataAll: [],
      update: [],
      create: [],
      delete: [],
      currentRow: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: "",
      erormessage: "",
      errorUpdate: {},
      errorInsert: {},
      history: [],
      roles: [],
      activeCreateSubmit: false,
      newData: [],
      headerTitle: ROLE_ACCOUNT_HEADER,
      deleteItem: null,
      updateModal: false,
      warningPopupModal: false,
      popupMessage: null,
      filter: {
        search: "",
        name: "",
        description: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
    };
  }

  componentWillReceiveProps(nextProp) {
    const { role } = nextProp;
    const { limit, refetch } = this.state;
    let roleData = null;
    if (role !== this.state.role) {
      if (typeof role !== "undefined") {
        if (typeof role.data !== "undefined") {
          roleData = role.data;

          if (typeof roleData !== "undefined") {
            if (typeof roleData.roles !== "undefined") {
              if (typeof roleData.roles.roles !== "undefined") {
                if (roleData?.roles?.roles?.length > 0) {
                  roleData.roles.roles.map((item, key) => {
                    item["index"] = key + 1;
                    item["collapse"] = false;
                  });
                }
              }
              let totalElement = 0;

              if (roleData?.roles?.roles?.length > limit) {
                totalElement = limit;
              } else {
                totalElement = roleData?.roles?.roles?.length;
              }

              if (refetch) {
                this.setState({
                  totalElement,
                  data: roleData.roles.roles,
                  dataAll: roleData.roles.roles,
                  history: roleData.roles.roles,
                  listLength: roleData.roles.total,
                  totalPage: Math.ceil(roleData?.roles?.roles?.length / limit),
                  isLoaded: roleData.isLoading,
                  refetch: false,
                  status: roleData.status,
                  message: PLEASE_CHECK_CONNECT(roleData.message),
                });
              } else {
                this.setState({
                  totalElement,
                  data: roleData.roles.roles,
                  dataAll: roleData.roles.roles,
                  history: roleData.roles.roles,
                  listLength: roleData.roles.total,
                  totalPage: Math.ceil(roleData?.roles?.roles?.length / limit),
                  isLoaded: false,
                  status: roleData.status,
                  message: PLEASE_CHECK_CONNECT(roleData.message),
                });
              }
            }

            if (typeof roleData.detail !== "undefined") {
              this.setState({
                detail: roleData.detail,
                isLoaded: roleData.isLoaded,
                status: roleData.status,
                message: PLEASE_CHECK_CONNECT(roleData.message),
              });
            }
          }
        }
      }
    }
  }

  componentDidMount() {
    const { limit } = this.state;
    /* Fetch Summary */
    this.fetchSummary(
      JSON.stringify({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      })
    );
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { getAllRoleList } = this.props;
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
  toggle = (el, val) => {
    let { data } = this.state;

    data
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ data });
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

  handleSubmitSearchForm = () => {
    let { filter } = this.state;
    const { getAllRoleList } = this.props;
    filter.search = filter.name;
    getAllRoleList(JSON.stringify(filter));
    this.clearFilter();
  };
  // onComfirmSearch = () => {
  //   const { filter } = this.state;

  //   if (filter.name) {
  //     this.fetchSummary(JSON.stringify(filter));
  //   }
  //   this.fetchSummary(JSON.stringify(filter));
  // }

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev["name"]] = ev["value"];

    this.setState({ filter });
  };

  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      search: "",
      name: "",
      description: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    };

    this.setState({ filter: clearFilter });
  };

  renderCreateModal = () => {
    const { roles } = this.state;

    return (
      <AddNewModal
        data={roles}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
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

  handleNewDetail = (name, data) => {
    const { detail } = this.state;
    let newDetail = {
      ...detail,
    };
    this.setState({ newDetail: newDetail });
    if (name !== null) {
      newDetail[name] = data;
      this.setState({ newDetail });
    }
  };

  handleOpenEdit = (id) => {
    const { data } = this.state;
    const { getAllRoleListByID } = this.props;
    getAllRoleListByID(id).then((res) => {
      if (res.data.status == 200) {
        this.setState({ detail: res.data.data, isLoaded: false });
      }
    });

    //this.setState({ detail: data[id] });
  };

  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { createNewRole } = this.props;
    let { dataAll } = this.state;
    const roleTotal = this.state?.data?.length + 1;
    const errorInsert = {};
    this.setState((previousState) => {
      return {
        ...previousState,
        errorInsert,
      };
    });
    value.id = `${roleTotal}`;
    if (!value.name) {
      errorInsert.name = "Nhóm quyền không được bỏ trống";
    }

    if ((value.name || "").length > 255) {
      errorInsert.name = "Nhập tối đa 255 ký tự";
    }
    // if (!value.description) {
    //   errorInsert.description = "Diễn giải không được bỏ trống"
    // }

    if (value.name) {
      let flag = false;
      dataAll
        .filter(
          (item) =>
            (item.name.toString().toLowerCase().trim() || "") ===
              value.name.toString().toLowerCase().trim() || ""
        )
        .map((item) => (flag = true));
      if (flag == true) {
        errorInsert.name = "Nhóm quyền này đã có";
      }
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

    if (closeForm) {
      closeForm();
    }

    createNewRole(JSON.stringify({ ...value })).then((res) => {
      this.setState({ isLoaded: true });
      if (res.status === 200) {
        this.setState({ isLoaded: false });
        this.setState({ refetch: true });
        this.setState({
          create: res.data,
          isLoading: false,
          status: true,
          message: PLEASE_CHECK_CONNECT(res.message),
        });

        // /* Fetch Summary */
        this.setState({ data: [] });
        this.fetchSummary(
          JSON.stringify({
            search: "",
            filter: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );

        if (closePopup != "closePopup") {
          this.toggleModal("createNewModal");
        }
      } else {
        this.setState({ isLoaded: false });
        this.setState({
          create: [],
          isLoaded: false,
          status: false,
          message: PLEASE_CHECK_CONNECT(res.message),
        });
        this.toggleModal("popupMessage");
      }
    });
    // .catch(err => {
    //   this.toggleModal('popupMessage');
    //   this.setState({ create: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(err.message) })
    // });
  };
  closeForm = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        errorInsert: {},
        newData: [],
        //errorUpdate: {},
      };
    });

    this.setState({ newData: [] });
  };
  // Handle Update Role
  handleUpdateInfoData = (value) => {
    const { newDetail, dataAll, currentRow, detail } = this.state;

    const { updateRoleInfo } = this.props;

    const updateData = { ...(newDetail || detail) };
    const errorUpdate = {};

    this.setState((previousState) => {
      return {
        ...previousState,
        errorUpdate,
      };
    });
    if (!updateData.name) {
      errorUpdate["name"] = "Nhóm quyền không được bỏ trống";
    }

    if ((updateData.name || "").length > 255) {
      errorUpdate["name"] = "Nhập tối đa 255 ký tự";
    }

    let flag = false;
    if (updateData.name) {
      if (updateData.name.trim().indexOf(currentRow.name.trim()) === -1) {
        dataAll
          .filter((item) => item.name === updateData.name.trim())
          .map((item) => (flag = true));
      } else {
        flag = false;
      }
      if (flag == true) {
        errorUpdate["name"] = "Nhóm quyền này đã có";
      }
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

    // Call update
    updateRoleInfo(JSON.stringify(updateData))
      .then((res) => {
        this.setState({ isLoaded: true });
        if (res.status === 200) {
          this.setState({ isLoaded: false });
          this.setState({ refetch: true });
          this.setState({
            update: res.data,
            isLoading: false,
            status: true,
            message: PLEASE_CHECK_CONNECT(res.message),
          });

          // Fetch List
          setTimeout(() => {
            this.fetchSummary(
              JSON.stringify({
                search: "",
                filter: "",
                orderBy: "",
                page: null,
                limit: null,
              })
            );
          }, 500);
        } else {
          this.setState({ isLoaded: false });
          this.toggleModal("popupMessage");
          this.setState({
            update: [],
            isLoading: false,
            status: false,
            message: PLEASE_CHECK_CONNECT(res.message),
            erormessage: PLEASE_CHECK_CONNECT(res.message),
          });
        }
      })
      .catch((err) => {
        this.toggleModal("popupMessage");
        this.setState({
          update: [],
          isLoading: false,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message),
          erormessage: PLEASE_CHECK_CONNECT(err.message),
        });
      });
  };

  handleDeleteRow = () => {
    const { deleteRoleInfo } = this.props;
    let { deleteItem } = this.state;
    this.setState({ refetch: true });

    deleteRoleInfo(deleteItem)
      .then((res) =>
        res.status === 200
          ? (this.setState({
              delete: res.data,
              isLoaded: true,
              status: true,
              message: PLEASE_CHECK_CONNECT(res.message),
            }),
            // Fetch List

            this.fetchSummary(
              JSON.stringify({
                search: "",
                filter: "",
                orderBy: "",
                page: null,
                limit: null,
              })
            ),
            toast.success("Xoá nhóm quyền thành công!"))
          : (this.toggleModal("popupMessage"),
            this.setState({
              delete: [],
              isLoading: true,
              status: false,
              message: PLEASE_CHECK_CONNECT(res.message),
            }))
      )
      .catch(
        (err) => (
          this.toggleModal("popupMessage"),
          this.setState({
            delete: [],
            isLoading: true,
            status: false,
            message: PLEASE_CHECK_CONNECT(err.message),
          })
        )
      );
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
      });
    }
  };

  render() {
    const {
      status,
      headerTitle,
      data,
      detail,
      message,
      erormessage,
      isLoaded,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      activeCreateSubmit,
      newData,
      errorUpdate,
      errorInsert,
      updateModal,
      warningPopupModal,
      popupMessage,
      limit,
      createNewModal,
    } = this.state;
    // console.log(data);
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

      ACCOUNT_CLAIM_FF.filter((x) => x == "Roles.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Roles.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "Roles.Delete").map(
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
                      dataReload={() =>
                        this.fetchSummary(
                          JSON.stringify({
                            search: "",
                            filter: "",
                            orderBy: "",
                            page: null,
                            limit: limit,
                          })
                        )
                      }
                      hideCreate={isDisableAdd == false ? false : true}
                      hideSearch={true}
                      searchForm={
                        <SearchModal
                          filter={filter}
                          handleChangeFilter={this.handleChangeFilter}
                        />
                      }
                      typeSearch={
                        <>
                          <div className="w_input">
                            <label className="form-control-label">
                              Nhóm quyền
                            </label>
                            <div>
                              <Input
                                className="css-search-input"
                                name="name"
                                value={filter.name}
                                placeholder="Nhập tiêu đề nhóm quyền"
                                type="text"
                                autoFocus={true}
                                onChange={(event) =>
                                  this.handleChangeFilter(event)
                                }
                              />
                            </div>
                          </div>
                          <div className="mg-btn">
                            {/* <label
                                className="form-control-label"
                              >&nbsp;</label> */}
                            <Button
                              // style={{ marginLeft: 10, marginRight: 10 }}
                              className="btn-warning-cs btn"
                              color="default"
                              type="button"
                              size="md"
                              onClick={() => {
                                this.handleSubmitSearchForm();
                                // this.onComfirmSearch()
                              }}
                            >
                              <img src={SearchImg} alt="Tìm kiếm" />
                              <span>Tìm kiếm</span>
                            </Button>
                          </div>
                        </>
                      }
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
                      }
                      moduleTitle="Thêm nhóm quyền"
                      moduleBody={this.renderCreateModal()}
                      activeSubmit={activeCreateSubmit}
                      newData={newData}
                      errorInsert={errorInsert}
                      handleCreateInfoData={this.handleCreateInfoData}
                      isPreventForm={true}
                      closeForm={this.closeForm}
                    />

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className="align-items-center tablecs table-css-roleList"
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
                            data
                              .filter(
                                (item, key) => key >= beginItem && key < endItem
                              )
                              .map((item, key) => (
                                <tr key={key} className="table-hover-css">
                                  <td className="table-scale-col table-user-col-1">
                                    {item.index}
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "left",
                                      whiteSpace: "break-spaces",
                                    }}
                                  >
                                    <strong>{item.name}</strong>
                                    <br></br>
                                    <i>{item.description}</i>
                                  </td>
                                  {/* <td style={{ textAlign: 'left', whiteSpace: 'break-spaces' }}>{item.description}</td> */}
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
                                                this.setState({
                                                  currentRow: item,
                                                });
                                                this.handleOpenEdit(item.id);
                                              }}
                                            >
                                              Sửa
                                            </DropdownItem>
                                          ) : null}
                                          {isDisableEdit == true ||
                                          isDisableDelete == true ? null : (
                                            <DropdownItem divider />
                                          )}
                                          {isDisableDelete == false ? (
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
                      Array.isArray(data) && data.length > 0 && (
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
              {detail !== null && (
                <UpdatePopup
                  moduleTitle="Cập nhật nhóm quyền"
                  moduleBody={
                    <UpdateModal
                      data={detail}
                      message={erormessage}
                      errorUpdate={errorUpdate}
                      handleCheckValidation={this.handleCheckValidation}
                      handleNewData={this.handleNewData}
                      handleNewDetail={this.handleNewDetail}
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
                moduleTitle="Thêm nhóm quyền"
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

              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={"Thông báo"}
                moduleBody={message}
                toggleModal={this.toggleModal}
              />
              <ToastContainer position="top-center" autoClose={3000} />
            </Container>
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionRoleCreators, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(RoleList);
