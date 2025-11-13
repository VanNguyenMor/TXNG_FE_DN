import React, { Component } from "react";
import compose from 'recompose/compose';
import ReactHtmlParser from 'react-html-parser';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT,   } from "../../../services/Common";
import { ZONE_ROLE_ACCOUNT_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { actionZoneRoleCreators } from "../../../actions/ZoneRoleActions.js";
import { areaRoleAction } from "../../../actions/AreaRoleAction";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import PopupMessage from "../../../components/PopupMessage";

import InsertOrUpdate from "./InsertOrUpdate.js";
import MenuButton from "../../../assets/img/buttons/menu.png";
import Message, { TYPES } from '../../../components/message';

import WarningPopup from '../../../components/WarningPopup';

import { getErrorMessageServer } from "utils/errorMessageServer.js";

import CreateNewPopup from "../../../components/CreateNewPopup";

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class RoleZoneList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: '',
      history: [],
      zones: [],
      headerTitle: ZONE_ROLE_ACCOUNT_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      warningPopupModal: false,
      isShowForEdit: false,
      editId: null,
      errorInserts: {}
    };
  }

  componentWillReceiveProps(nextProp) {
    const { getZoneDetail } = this.props;
    const { role, zone } = nextProp;
    const { data, getZone, limit } = this.state;
    let roleData = null;
    let zoneData = null;
    let zoneList = [];

    if (role !== this.state.role) {
      if (typeof (role) !== 'undefined') {
        if (typeof (role.data) !== 'undefined') {
          roleData = role.data;

          if (typeof (roleData) !== 'undefined') {
            if (typeof (roleData.zonerole) !== 'undefined') {
              if (typeof (roleData.zonerole.roleZones) !== 'undefined') {
                if (roleData.zonerole.roleZones.length > 0) {
                  if (Array.isArray(roleData.zonerole.roleZones)) {
                    roleData.zonerole.roleZones.map((item, key) => (
                      item['index'] = key + 1,
                      item['zoneName'] = null,
                      item['collapse'] = false,
                      item['description'] = item.description.split(';')
                    ));

                    this.setState({ getZone: true });
                  }
                }
              }

              this.setState({ data: roleData.zonerole.roleZones, listLength: roleData.zonerole.total, totalPage: Math.ceil(roleData.zonerole.roleZones.length / limit), isLoaded: roleData.isLoading, status: roleData.status, message: PLEASE_CHECK_CONNECT(roleData.message) });
            }

            if (typeof (roleData.detail) !== 'undefined') {
              this.setState({ detail: roleData.detail, isLoaded: roleData.isLoading, status: roleData.status, message: PLEASE_CHECK_CONNECT(roleData.message) });
            } else {
              this.setState({ detail: roleData, isLoaded: roleData.isLoading, status: roleData.status, message: PLEASE_CHECK_CONNECT(roleData.message) });
            }
          }
        }
      }
    }
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

    const { getListRole } = this.props
    getListRole({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }).then(res => {
      // console.log(res, 1111);
    })
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { getAllZoneRoleList } = this.props;

    getAllZoneRoleList(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, 3000);
    }
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
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

  toggleModalPopupDelete = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        warningPopupModal: false
      }
    });
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        errorInserts: {}
      });
    }
  };

  handleDeleteRow = () => {
    this.props.deleteArea({ id: this.state.deleteId }).then(res => {
      this.setState(previousState => {
        return {
          ...previousState,
          warningPopupModal: false
        }
      });

      const data = res.data;

      if (data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }));

        // Message.show(TYPES.SUCCESS, 'Thông báo', 'Xóa vùng dữ liệu thành công');
      } else {
        const message = getErrorMessageServer(res);
        this.setState({ messageErr: message });
        this.toggleModal('popupMessage')
        // Message.show(TYPES.ERROR, 'Thông báo', message || 'Xóa vùng dữ liệu thất bại');

      }
    });
  }

  onDeleteZone = id => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        warningPopupModal: true,
        deleteId: id
      }
    });
  }

  checkDataInsert = isCheck => {
    if (!isCheck) {
      return {};
    }

    const { dataInsert } = this.state;

    const typeManage = dataInsert.typeManage;
    const roleId = dataInsert.roleId;
    const zoneId = dataInsert.zoneId;
    const zones = dataInsert.zones;

    const errorInserts = {};

    if (typeManage != -1 && ![1, 2, 3].includes(typeManage)) {
      errorInserts.manage = 'Bạn vui lòng chọn cấp quản lý';
    }

    if (!roleId) {
      errorInserts.roleId = 'Bạn vui lòng chọn nhóm quyền';
    }

    // if (!zoneId) {
    // 	errorInserts.zoneId = 'Bạn vui lòng chọn vùng dữ liệu';
    // }


    if ((zones || []).length <= 0) {
      errorInserts.zone = 'Bạn vui lòng chọn vùng được chọn';
    }

    return errorInserts;
  }

  onHandleChangeValue = data => {
    this.setState(previousState => {
      return {
        ...previousState,
        dataInsert: data
      }
    }, () => {
      const errorInserts = this.checkDataInsert();

      this.setState(previousState => {
        return {
          ...previousState,
          errorInserts
        }
      });
    });
  }

  onEditZone = id => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: true,
        editId: id
      }
    });
  }

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
    } else {
      openModal();
    }

    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: false,
        editId: null
      }
    });
  }

  onConfirm = (toggleModal, closePopup) => {
    const { dataInsert } = this.state;

    const roleId = dataInsert.roleId;
    const typeManage = dataInsert.typeManage;
    const zones = dataInsert.zones || [];
    const zoneId = dataInsert.zoneId;
    const id = dataInsert.id;

    const errorInserts = this.checkDataInsert(true);

    this.setState(previousState => {
      return {
        ...previousState,
        errorInserts
      }
    });

    if (Object.keys(errorInserts).length > 0) {
      return;
    }

    let zoneIds = zones.map(p => p.zoneId).join(',');
    let zoneNames = zones.map(p => p.zoneName).join(';');

    if (id) {
      this.props.editArea({ id, roleID: roleId, level: typeManage, zoneIDs: zoneIds, zoneNames }).then(res => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));

          if (toggleModal) {
            toggleModal();
          }

          this.setState(previousState => {
            return {
              ...previousState,
              isShowForEdit: false,
              editId: null,
              message: 'Sửa phân quyền vùng quản lý thành công'
            }
          });

          // Message.show(TYPES.SUCCESS, 'Thông báo', 'Sửa quyền dữ liệu thành công');
        } else {
          const message = getErrorMessageServer(res);
          this.setState({ messageErr: data.message || 'Sửa phân quyền vùng quản lý thất bại' });
          this.toggleModal('popupMessage')
          //Message.show(TYPES.ERROR, 'Thông báo', message || 'Sửa quyền dữ liệu thất bại');
        }
      });
    } else {
      this.props.addArea({ id, roleID: roleId, level: typeManage, zoneIDs: zoneIds, zoneNames }).then(res => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));

          if (toggleModal) {
            toggleModal();
          }

          if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
          // Message.show(TYPES.SUCCESS, 'Thông báo', 'Thêm quyền dữ liệu thành công');
        } else {
          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message });
          this.toggleModal('popupMessage')
          // Message.show(TYPES.ERROR, 'Thông báo', message || 'Thêm quyền dữ liệu thất bại');
        }
      });
    }
  }

  render() {
    const {
      errorInserts,
      editId,
      isShowForEdit,
      warningPopupModal,
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
      createNewModal,
      activeCreateSubmit,
      popupMessage,
      messageErr
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

      ACCOUNT_CLAIM_FF.filter(x => x == "RoleZones.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "RoleZones.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "RoleZones.Delete").map(y => isDisableDelete = false)
    }

    return (
      <>
        {
          <div className={classes.wrapper}>
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
                          }))}
                        hideSearch={true}
                        hideCreate={isDisableAdd == false ? false : true}
                        moduleTitle={isShowForEdit ? 'Sửa phân quyền vùng quản lý' : 'Thêm phân quyền vùng quản lý'}
                        moduleBody={
                          <InsertOrUpdate
                            id={editId}
                            data={this.state.data}
                            errors={errorInserts}
                            onHandleChangeValue={this.onHandleChangeValue}
                          />}
                        isShowForEdit={isShowForEdit}
                        handleModal={this.handleModal}
                        onConfirm={this.onConfirm}
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
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => {

                                    return (
                                      <tr key={key} className="table-hover-css">
                                        <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                        <td style={{ textAlign: 'left' }}>
                                          <strong>{item.roleName}</strong><br />
                                          {item.description.map((item1, key) => (
                                            <i>{item1}<br /></i>
                                          ))}
                                        </td>
                                        {/* <td style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{
																					__html: (item.description || '').replace(/\\n/g, '<br />') || ''
																				}} ></td> */}
                                        {/* <td style={{ textAlign: 'left' }}>{item.description}</td> */}
                                        {/* <td style={{ textAlign: 'left' }}>
                                          {item.description.map((item1, key) => (
                                            <span>{item1}<br /></span>
                                          ))}
                                        </td> */}
                                        <td>
                                          {isDisableEdit == true && isDisableDelete == true ? null : (
                                            <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                              <DropdownToggle>
                                                <img src={MenuButton} />
                                              </DropdownToggle>
                                              <DropdownMenu>
                                                {isDisableEdit == false ? (
                                                  <DropdownItem
                                                    onClick={this.onEditZone(item.id)}
                                                  >
                                                    Sửa
                                                  </DropdownItem>
                                                ) : null}
                                                {isDisableEdit == true || isDisableDelete == true ? null : (
                                                  <DropdownItem divider />
                                                )
                                                }
                                                {isDisableDelete == false ? (
                                                  <DropdownItem
                                                    onClick={this.onDeleteZone(item.id)}
                                                  >
                                                    Xoá
                                                  </DropdownItem>
                                                ) : null}
                                              </DropdownMenu>
                                            </ButtonDropdown>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })
                              )
                            }
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
                            handlePageClick={this.handlePageClick} />
                        )
                      }
                    </div>
                  </Row>
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
            <CreateNewPopup
              createNewModal={createNewModal}
              moduleTitle='Thêm phân quyền vùng dữ liệu'
              type100={true}
              moduleBody={
                <InsertOrUpdate
                  id={editId}
                  errors={errorInserts}
                  onHandleChangeValue={this.onHandleChangeValue}
                />}
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              onConfirm={(data, close) => {
                this.onConfirm(data, close);
              }}
            />
            <WarningPopup
              moduleTitle='Thông báo'
              moduleBody={
                <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  Bạn đồng ý xóa thông tin này?
                </p>}
              warningPopupModal={warningPopupModal}
              toggleModal={this.toggleModalPopupDelete}
              handleWarning={this.handleDeleteRow}
            />
            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={'Thông báo'}
              moduleBody={messageErr}
              toggleModal={this.toggleModal}
            />
          </div>
        }
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    role: state.ZoneRoleStore,
    zone: state.ZoneStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionZoneCreators, dispatch),
    ...bindActionCreators(actionZoneRoleCreators, dispatch),
    ...bindActionCreators(areaRoleAction, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RoleZoneList);
