import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, } from "../../../services/Common";
import { MENU_LIST_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classes from './index.module.css';
import './MenuList.css';
import { handleGenTree } from "../../../helpers/trees";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import UpdatePopup from "../../../components/UpdatePopup";
import WarningPopup from "../../../components/WarningPopup";
import WarningPopupDel from "../../../components/WarningPopupDel";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { actionMenuList } from "../../../actions/MenuListAcrions";
import MenuButton from "../../../assets/img/buttons/menu.png";
import PopupMessage from "../../../components/PopupMessage";
import CreateNewPopup from "../../../components/CreateNewPopup";
import SearchImg from "../../../assets/img/buttons/searchig.svg";


// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  InputGroup,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class MenuList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      dataAll: [],
      detail: null,
      newDetail: null,
      detailUpdate: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: '',
      messageDel: '',
      history: [],
      errorInsert: {},
      errorUpdate: {},
      headerTitle: MENU_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      selected: [],
      fetching: false,
      fetchingUpdate: false,
      fetchingDelete: false,
      activeCreateSubmit: false,
      newData: [],
      deleteItem: null,
      updateModal: false,
      warningPopupModal: false,
      currentRow: [],
      collapseList: [],
      filter: {
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }
    };
  }

  componentWillReceiveProps(nextProp) {
    const { fetching, fetchingUpdate, fetchingDelete, limit } = this.state;
    let { data } = nextProp.menu;
    let newData = [];
    let haveRoot = false;
    let collapseList = [];

    if (data !== this.state.data) {

      if (typeof (data) !== 'undefined') {

        if (typeof (data.menu) !== 'undefined') {

          if (data.menu !== null) {
            if (typeof (data.menu.menus) !== 'undefined') {
              // if(data.menu.menus.parentID==0){data.menu.menus.parentID=""}

              // data.menu.menus
              //   .filter(item => item.parentID === 0)
              //   .map(item => haveRoot = true);

              // if (haveRoot) {

              //   newData = handleGenTree(data.menu.menus, 'menuName');

              //   newData.map((item, key) => {
              //     item['index'] = key + 1;
              //     item['collapse'] = false
              //   });
              // } else {
              //   // Search Element in tree
              //   data.menu.menus.map((item, key, array) => (
              //     key === 0 && (item.parentID ="")
              //   ));
              //   newData = handleGenTree(data.menu.menus, 'menuName');
              //   newData.map((item, key) => {
              //     item['index'] = key + 1;
              //     item['collapse'] = false
              //   });
              // }

              // console.log(newData);
              newData = data.menu.menus;
              newData.map(item => (
                collapseList.push({ id: item.id, collapse: false })
              ));

              newData.map((item, key) => {
                item['parentID'] = item.parentID === 0 ? '' : item.parentID;
              });

              // if (haveDataRoot) {
              newData = handleGenTree(data.menu.menus, 'menuName');
              newData.map((item, key) => {
                item['index'] = key + 1;
              });

              this.setState({ data: [] });
              this.setState({
                data: newData,
                dataAll: data.menu.menus,
                selected: data.menu.menus,
                collapseList: collapseList,
                listLength: newData.length,
                totalPage: Math.ceil(newData.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({ data: [], isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
            }
          }
        }

        if (typeof (data.create) !== 'undefined') {
          if (data.create !== null) {
            if (data.status && !fetching) {
              /* Fetch Summary */
              this.setState({ data: [] });
              this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
              this.setState({ fetching: true });
            }

            this.setState({ create: data.create, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          }
        }

        if (typeof (data.update) !== 'undefined') {
          if (data.update !== null) {
            if (data.status && !fetchingUpdate) {
              setTimeout(() => {
                /* Fetch Summary */
                this.setState({ data: [], fetchingUpdate: true });
                this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
              }, 1000);
            }

            this.setState({ update: data.update, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          }
        }

        // if (typeof (data.delete) !== 'undefined') {

        //   if (data.status && !fetchingDelete) {

        //     setTimeout(() => {
        //       /* Fetch Summary */
        //       this.setState({ data: [] });
        //       this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
        //       this.setState({ fetchingDelete: true });
        //     }, 1000);
        //   }

        //   this.setState({ delete: data.delete, isLoaded: false, status: data.status });
        //   if (data.status != true) {
        //     this.toggleModal('warningPopupModalDel')
        //     this.setState({ messageDel: PLEASE_CHECK_CONNECT(data.message) })
        //   }
        // }
      }
    }
  }
  toggle = (el, val) => {
    let { data, collapseList } = this.state;

    collapseList.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ collapseList });
  }
  componentWillMount() {
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestMenuList } = this.props;

    requestMenuList(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;

    this.state.data.map((item, key) => (
      key >= beginItem && key < endItem && total++
    ));

    if (selected > 0) {
      total = (selected * limit) + total;
    } else total = total;

    this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
  };

  clearDay = () => {
    this.setState({ data: [] })
  }

  renderTreeLine = (nodelv) => {
    let line = '';

    for (let i = 0; i < nodelv; i++) {
      line += '-';
    }

    return line;
  }

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let parentid = [];
    let autoIndex = 0;

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach(e => parentid.push(e.id));

    // const cb = (e, key, array) => {

    //   const renderClass = e.parentID.length === 0 ? (
    //     `${classes.treeParent}`
    //   ) : (
    //     `${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
    //   );
    const cb = (e, key, array) => {
      const renderClass = e.parentID.length === 0 ? (
        `${classes.treeParent}`
      ) : (
        `${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
      );

      list.push(
        <tr
          key={autoIndex}
          parentid={e.parentID}
          currentid={e.id} index={autoIndex}
          className="table-hover-css"
        >
          <td className={`table-scale-col table-user-col-1 ${renderClass}`}>{e.index}</td>
          <td style={{ textAlign: 'left' }} className={renderClass}>
            <span>{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}</span>
            <span>{e.menuName}</span>
          </td>
          {/* <td>
            <div className={classes.editArea}>
              <div
                className={classes.item}
                onClick={() => {
                  this.toggleModal('updateModal');
                  this.setState({ currentRow: e });
                  this.handleOpenEdit(e);
                }}
              >
                <img src={EditIcon} alt="Sửa" title="Sửa" />
              </div>

              <div
                className={classes.item}
                onClick={() => {
                  this.toggleModal('warningPopupModal');
                  this.toggleModal('warningPopupDelModal');
                  this.setState({ deleteItem: e.id });
                }}
              >
                <img src={DeleteIcon} alt="Xoá" title="Xoá" />
              </div>
            </div>
          </td> */}
          {
            collapseList.filter(item => item.id === e.id)
              .map((ele, key) => (
                <td key={key}>
                  {(isDisableEdit == true && isDisableDelete == true) ? null : (
                    <ButtonDropdown isOpen={ele.collapse} toggle={() => this.toggle(key, e.id)}>
                      <DropdownToggle>
                        <img src={MenuButton} />
                      </DropdownToggle>
                      <DropdownMenu>
                        {isDisableEdit == true ? null : (
                          <DropdownItem
                            onClick={() => {
                              this.toggleModal('updateModal');
                              this.setState({ currentRow: e });
                              this.handleOpenEdit(e);
                            }}
                          >
                            Sửa
                          </DropdownItem>
                        )}
                        {isDisableEdit == true || isDisableDelete == true ? null : (
                          <DropdownItem divider />
                        )}
                        {isDisableDelete == true ? null : (
                          <DropdownItem
                            onClick={() => {
                              this.toggleModal('warningPopupModal');
                              //this.toggleModal('warningPopupDelModal');
                              this.setState({ deleteItem: e.id });
                            }}
                          >
                            Xoá
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </ButtonDropdown>
                  )}
                </td>
              ))
          }
        </tr>
      );

      autoIndex++;
      e.children && e.children.forEach(cb);
    }

    data.forEach(cb);
    return list;
  }

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  clearFilter = () => {
    this.setState({
      filter: {
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }
    })
  }

  handleSubmitSearchForm = () => {
    let { filter } = this.state;
    const { requestMenuList } = this.props;

    filter.search = filter.menuName;
    requestMenuList(JSON.stringify(filter));
    this.clearFilter();
  }

  renderCreateModal = () => {
    const { data, dataAll } = this.state;

    return (
      <AddNewModal
        menu={data}
        menuAll={dataAll}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
        handleOpenSelectTree={this.handleOpenSelectTree}
        errorInsert={this.state.errorInsert}
      />
    );
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleNewData = (data) => {

    this.setState({ newData: data });
  }

  handleNewDetail = (value) => {
    if (value) {
      let newDetail = {
        id: value.id,
        menuName: value.menuName,
        parentID: value.parentID,
        content: value.content,
        sortOrder: value.sortOrder
      };

      this.setState({ newDetail });
    }
  }

  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { requestCreateMenu } = this.props;
    const { dataAll } = this.state;
    const errorInsert = {};
    const updateData = {
      menuName: value.menuName,
      parentID: value.parentID,
      content: value.content,
      sortOrder: value.sortOrder
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });
    if (!updateData.sortOrder) {
      errorInsert['sortOrder'] = 'Sắp xếp không được bỏ trống';
    }

    if (!updateData.menuName) {
      errorInsert['menuName'] = 'Tên menu không được bỏ trống';
    }
    //console.log(updateData.menuName)
    let dataFilter = []
    let dataFilterChild = []
    if (updateData.parentID) {
      dataAll.filter(x => x.id == updateData.parentID).map(
        item => {
          dataFilter.push(item)
        }
      )
      if (dataFilter != []) {
        if (dataFilter[0].parentID == "") {
          dataAll.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item);
              dataFilterChild.push(item);
            }
          )
          if (dataFilterChild != []) {
            for (let i = 0; i < dataFilterChild.length; i++) {
              dataAll.filter(x => x.parentID == dataFilterChild[i].id || x.id == dataFilterChild[i].parentID).map(
                item => {
                  dataFilter.push(item);
                }
              )
            }
          }
        } else {
          dataAll.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        }
      }
    }
    if (updateData.menuName) {
      let flag = false;

      dataFilter.filter(item => item.menuName.trim().toUpperCase() === updateData.menuName.trim().toUpperCase())
        .map(item => flag = true);

      if (flag == true) {
        errorInsert['menuName'] = 'Tên menu này đã có';
      }
    }

    if ((updateData.fullName || '').length > 255) {
      errorInsert['menuName'] = 'Nhập tối đa 255 ký tự';
    }

    // if (!updateData.isNew) {
    //   errorInsert['isNew'] = 'Vui lòng chọn loại bài viết';
    // }

    // if (!updateData.content) {
    //   errorInsert['content'] = 'Vui lòng nhập nội dung';
    // }
    //console.log(updateData);

    if (Object.keys(errorInsert).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorInsert
        }
      });

      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {}
      }
    });

    if (closeForm) {
      closeForm();
    }
    requestCreateMenu(JSON.stringify(updateData)).then(res => {
      if (res.data.status == 200) {
        if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
      } else {
        this.setState({ messageDel: res.data.message });
        this.toggleModal('popupMessage');
      }
    })
    this.setState({ fetching: false });
  }

  handleDeleteRow = () => {
    const { requestDeleteMenu } = this.props;
    const { deleteItem } = this.state;

    this.setState({ fetchingDelete: false });
    requestDeleteMenu(deleteItem).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
      } else {
        this.setState({ messageDel: res.data.message });
        this.toggleModal('popupMessage');
      }
    })
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        detailUpdate: null,
        newData: [],
        errorUpdate: {}
      });
    }
  };

  handleUpdateInfoData = () => {
    const { newDetail, dataAll, currentRow } = this.state;
    const { requestUpdateMenu } = this.props;
    const updateData = { ...newDetail };
    const errorUpdate = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    if (!updateData.menuName) {
      errorUpdate['menuName'] = 'Tên menu không được bỏ trống';
    }
    if (!updateData.sortOrder) {
      errorUpdate['sortOrder'] = 'Sắp xếp không được bỏ trống';
    }
    //console.log(updateData.menuName)
    let dataFilter = []
    let dataFilterChild = []
    if (updateData.parentID) {
      dataAll.filter(x => x.id == updateData.parentID).map(
        item => {
          dataFilter.push(item)
        }
      )
      if (dataFilter != []) {
        if (dataFilter[0].parentID == "") {
          dataAll.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item);
              dataFilterChild.push(item);
            }
          )
          if (dataFilterChild != []) {
            for (let i = 0; i < dataFilterChild.length; i++) {
              dataAll.filter(x => x.parentID == dataFilterChild[i].id || x.id == dataFilterChild[i].parentID).map(
                item => {
                  dataFilter.push(item);
                }
              )
            }
          }
        } else {
          dataAll.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        }
      }
    }
    let flag = false;
    if (updateData.menuName) {
      if (updateData.menuName.trim().toUpperCase().indexOf(currentRow.menuName.trim().toUpperCase()) === -1) {
        dataFilter.filter(item => item.menuName.trim().toUpperCase() === updateData.menuName.trim().toUpperCase())
          .map(item => flag = true);
      } else {
        flag = false;
      }
      if (flag == true) {
        errorUpdate['menuName'] = 'Tên menu này đã có';
      }
    }
    if ((updateData.menuName || '').length > 255) {
      errorUpdate['menuName'] = 'Nhập tối đa 255 ký tự';
    }


    if (Object.keys(errorUpdate).length > 0) {

      this.setState(previousState => {
        return {
          ...previousState,
          errorUpdate,
        }
      });

      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate: {},
        detail: null,
        updateModal: false
      }
    });

    this.setState({ fetchingUpdate: false });
    requestUpdateMenu(JSON.stringify(updateData));
  }

  handleOpenEdit = (value) => {
    const { data } = this.state;
    const { requestGetMenu } = this.props;

    requestGetMenu(value.id).then(res => {
      if (res.data.status == 200) {
        this.setState({ detailUpdate: res.data.data });
      }
    })
    this.setState({ detail: value });
  }

  handleOpenSelectTree = (flag) => {
    //console.log(flag);
  }

  closeForm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {},
        newData: []
        //errorUpdate: {},
      }
    });

    this.setState({ newData: [] });
  }

  render() {
    const {
      status,
      headerTitle,
      data,
      message,
      messageDel,
      isLoaded,
      detail,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      newData,
      activeCreateSubmit,
      warningPopupModal,
      warningPopupDelModal,
      updateModal,
      errorUpdate,
      detailUpdate,
      popupMessage,
      createNewModal
    } = this.state;
    const statusPopup = { status: status, message: message };

    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "Menus.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Menus.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Menus.Delete").map(y => isDisableDelete = false)
    }

    return (
      <>
        {
          <div id='field-area' className={classes.wrapper}>
            <Container fluid>
              {
                isLoaded ? (
                  <div style={{ display: 'table', margin: 'auto' }}>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                  </div>
                ) : (
                  <Row>
                    <div className="col">
                      {/* Header */}
                      <HeaderTable
                        dataReload={() => this.fetchSummary(
                          JSON.stringify({
                            "search": "",
                            "filter": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null
                          })
                        )}
                        screen='menu'
                        hideCreate={isDisableAdd == false ? false : true}
                        hideSearch={true}
                        typeSearch={
                          <>
                            <div className="w_input">
                              <label className="form-control-label">Tên menu</label>
                              <div>
                                <InputGroup className="input-group-alternative css-border-input">
                                  <Input
                                    name="menuName"
                                    value={filter.menuName}
                                    placeholder="Tên menu..."
                                    type="text"
                                    autoFocus={true}
                                    onChange={(event) => this.handleChangeFilter(event)}
                                  />
                                </InputGroup>
                              </div>
                            </div>
                            <div className="mg-btn">
                              <label
                                className="form-control-label"
                              >&nbsp;</label>
                              <Button
                                // style={{ margin: 0 }}
                                className='btn-warning-cs'
                                color="default" type="button" size="md"
                                onClick={() => {
                                  this.handleSubmitSearchForm();
                                  // this.onComfirmSearch()
                                }
                                }
                              >
                                <img src={SearchImg} alt='Tìm kiếm' />
                                <span>Tìm kiếm</span>
                              </Button>
                            </div>
                          </>
                        }
                        searchForm={
                          <SearchModal
                            filter={filter}
                            handleChangeFilter={this.handleChangeFilter}
                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        moduleTitle='Thêm menu'
                        moduleBody={this.renderCreateModal()}
                        activeSubmit={activeCreateSubmit}
                        newData={newData}
                        handleCreateInfoData={this.handleCreateInfoData}
                        isPreventForm={true}
                        closeForm={this.closeForm}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs" responsive>
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                this.renderTable(data, isDisableEdit, isDisableDelete)
                              )
                            }
                          </tbody>
                        </Table>
                      </Card>

                      {/* Pagination */}
                      {
                        // Page of Table
                        Array.isArray(data) && (
                          <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
                        )
                      }
                    </div>
                  </Row>
                )
              }

              {
                detailUpdate && (
                  <UpdatePopup
                    moduleTitle='Cập nhật menu'
                    moduleBody={
                      <UpdateModal
                        menu={data}
                        data={detailUpdate}
                        errorUpdate={errorUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                        handleNewDetail={this.handleNewDetail}
                      />}
                    newData={newData}
                    updateModal={updateModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.handleUpdateInfoData}

                  />
                )
              }

              <CreateNewPopup
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle='Thêm menu'
                type100={true}
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleCreateInfoData={(data, beta, close) => {
                  this.handleCreateInfoData(data, () => {
                    this.setState({
                      createNewModal: false
                    });
                  }, close);
                }}
              />

              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
              />
              {messageDel ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={messageDel}
                  toggleModal={this.toggleModal}
                />
              ) : null}
              {messageDel && (
                <WarningPopupDel
                  moduleTitle='Thông báo'
                  moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>{messageDel}</p>}
                  warningPopupDelModal={warningPopupDelModal}
                  toggleModal={this.toggleModal}
                  handleWarning={this.handleDeleteRow}
                />
              )
              }

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
};

const mapStateToProps = (state) => {
  return {

    menu: state.MenuListStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    ...bindActionCreators(actionMenuList, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MenuList);
