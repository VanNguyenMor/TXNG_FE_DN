import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { LOADING_TIME } from "../../../helpers/constant";
import { PLEASE_CHECK_CONNECT, PLEASE_CHECK_CONNECT_SUCCESS } from "../../../services/Common";
import { PERMISSION_AWAIT_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionRoleCreators } from "../../../actions/RoleListActions.js";
import { actionPermissionList } from "../../../actions/PermissionActions";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { removeDuplicates } from "../../../helpers/common";
import Select from "components/Select";
import './Permission.css';

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner
} from "reactstrap";

class Permission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      roles: [],
      dataAllFilter: [],
      datapermission: [],
      dataCheck: [],
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
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
      headerTitle: PERMISSION_AWAIT_HEADER
    };
  }

  componentWillReceiveProps(nextProp) {
    // let dataRole = nextProp.role;
    let { data } = nextProp.permission;

    // if (dataRole !== this.state.roles) {
    //   if (typeof (dataRole) !== 'undefined') {
    //     if (typeof (dataRole.data) !== 'undefined') {
    //       if (typeof (dataRole.data.roles) !== 'undefined') {
    //         if (!dataRole.data.roles.roles || dataRole.data.roles.roles.length <= 0) {
    //           this.setState({ notiNotRoles: 'KHÔNG THỂ PHÂN QUYỀN VÌ CHƯA CÓ NHÓM QUYỀN NÀO ĐƯỢC TẠO' })
    //         }
    //         this.setState({
    //           roles: dataRole.data.roles.roles,
    //           isLoaded: false,
    //           status: dataRole.data.status,
    //           message: PLEASE_CHECK_CONNECT_SUCCESS(dataRole.data.message)
    //         });
    //       } else {
    //         this.setState({
    //           roles: [],
    //           isLoaded: dataRole.data.isLoading,
    //           status: dataRole.data.status,
    //           message: PLEASE_CHECK_CONNECT(dataRole.data.message)
    //         });
    //       }
    //     }
    //   }
    // }

    let datagridView = [];
    let datapermission = [];
    let dataAllFilter = [];
    let dataOneLine = [];
    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.data) !== 'undefined') {
          if (data.data !== null) {
            if (typeof (data.data.gridView) !== 'undefined') {
              data.data.gridView.map((item, key) => {
                item['index'] = key + 1
              });
              datagridView = data.data.gridView;
              datapermission = data.data.permission;
              removeDuplicates(data.data.gridView, item => item.functionID).map((item) => {
                data.data.gridView.filter(x => x.functionID == item.functionID).map((item1) => {
                  datapermission.filter(x => item1.functionID == x.functionID && item1.actionID == x.actionID).map(itemXXX => {
                    if (itemXXX.actionID === "01") {
                      item.actionIDViewStatus = true;
                    }
                    if (itemXXX.actionID === "02") {
                      item.actionIDAddStatus = true;
                    }
                    if (itemXXX.actionID === "03") {
                      item.actionIDEditStatus = true;
                    }
                    if (itemXXX.actionID === "04") {
                      item.actionIDDeleteStatus = true;
                    }
                    if (itemXXX.actionID === "05") {
                      item.actionIDConfirmStatus = true;
                    }
                    if (itemXXX.actionID === "06") {
                      item.actionIDUnconfirmStatus = true;
                    }
                    if (itemXXX.actionID === "07") {
                      item.actionIDVerifyStatus = true;
                    }
                    if (itemXXX.actionID === "08") {
                      item.actionIDExtendStatus = true;
                    }
                    if (itemXXX.actionID === "09") {
                      item.actionIDLockStatus = true;
                    }
                    if (itemXXX.actionID === "10") {
                      item.actionIDUnlockStatus = true;
                    }
                    if (itemXXX.actionID === "12") {
                      item.actionIDUploadStatus = true;
                    }
                  }
                  )

                  if (item1.actionID == "01") {
                    item.actionIDView = item1.actionID;
                    item.actionIDViewID = item1.id;
                  } else if (item1.actionID == "02") {
                    item.actionIDAdd = item1.actionID;
                    item.actionIDAddID = item1.id;
                  } else if (item1.actionID == "03") {
                    item.actionIDEdit = item1.actionID;
                    item.actionIDEditID = item1.id;
                  } else if (item1.actionID == "04") {
                    item.actionIDDelete = item1.actionID;
                    item.actionIDDeleteID = item1.id;
                  } else if (item1.actionID == "05") {
                    item.actionIDConfirm = item1.actionID;
                    item.actionIDConfirmID = item1.id;
                  } else if (item1.actionID == "06") {
                    item.actionIDUnconfirm = item1.actionID;
                    item.actionIDUnconfirmID = item1.id;
                  } else if (item1.actionID == "07") {
                    item.actionIDVerify = item1.actionID;
                    item.actionIDVerifyID = item1.id;
                  } else if (item1.actionID == "08") {
                    item.actionIDExtend = item1.actionID;
                    item.actionIDExtendID = item1.id;
                  } else if (item1.actionID == "09") {
                    item.actionIDLock = item1.actionID;
                    item.actionIDLockID = item1.id;
                  } else if (item1.actionID == "10") {
                    item.actionIDUnlock = item1.actionID;
                    item.actionIDUnlockID = item1.id;
                  } else if (item1.actionID == "12") {
                    item.actionIDUpload = item1.actionID;
                    item.actionIDUploadID = item1.id;
                  }

                  dataOneLine.push(item)
                })
              })
              dataAllFilter = removeDuplicates(dataOneLine, item => item.functionID)
              // Get GridView
              this.setState({
                dataAllFilter: dataAllFilter,
                data: data.data.gridView,
                // isLoaded: data.isLoading,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT_SUCCESS(data.message)
              });
            } else {
              this.setState({
                data: data.data.gridView,
                // isLoaded: data.isLoading,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
            let dataCheck = [];
            // datapermission = data.data.permission;
            // if (datapermission) {
            // 	datapermission.filter(x => {
            // 		datagridView.filter(y =>
            // 			y.functionID == x.functionID && y.actionID == x.actionID
            // 			// ).map(item => dataCheck.push(item));
            // 		).map(item => {
            // 			console.log(item);
            // 			if (item.actionID == "01") {
            // 				dataOneLine.actionIDViewStatus = true;
            // 			}
            // 		});
            // 	})
            // }

            // console.log(dataAllFilter)
            this.setState({
              datapermission: data.data.permission,
              dataCheck: dataCheck
            })


            // dataCheck.filter(x =>{dataAllFilter.filter(el => { x.actionID == el.actionIDView })}).map((itemV) => console.log(itemV))




            // Get Permission
            if (typeof (data.data.permission) !== 'undefined') {
              this.setState({ permission: data.data.permission });
            }
          }
        }

        // Update 
        if (typeof (data.update) !== 'undefined') {
          this.setState({
            data: data.update,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT_SUCCESS(data.message)
          });
        }
      }
    }
  }

  componentWillMount() {
    const { getAllRoleList } = this.props;
    /* Fetch Summary */
    this.fetchSummary(localStorage.getItem('ACCOUNT_ID'));

    getAllRoleList(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (((res || {}).data || {}).status == 200) {
        this.setState({ roles: res.data.data.roles })
      };
    });
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestPermissionListByID, getAllRoleList } = this.props;


    requestPermissionListByID(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handleSelect = (value) => {

    this.setState({ roleId: null })
    if (value != null) { this.setState({ roleId: value }) }
    const { requestPermissionListByID } = this.props;
    if (value != null) {
      this.setState({ dataRoleChange: value })

      requestPermissionListByID(value);
    }
    if (value == null) {
      this.setState({ dataRoleChange: null })
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

  handleStatus = (event, id) => {
    //console.log(event.target.checked);
    let { roleId } = this.state;
    const { updatePermission, requestPermissionListByID } = this.props;
    if (id) {
      updatePermission(JSON.stringify({
        id,
        roleId
      })).then((res) => {
        if (res.data.status == 200) {
          requestPermissionListByID(roleId);
        }
      })
    }
  }

  render() {
    const {
      status, headerTitle, data, message, isLoaded, alphabet,
      roles, dataRoleChange, dataAllFilter, roleId, dataCheck,
      permission, notiNotRoles
    } = this.state;
    const statusPopup = { status: status, message: message };
    let crrRoles
    let crrRolesName

    // if (dataAllFilter && roles) {
    //   if (dataAllFilter.length > 0) {
    if (roles) {
      if (!dataRoleChange) {
        crrRoles = (roles || []).filter(x => localStorage.getItem('ACCOUNT_ID') == x.id)
        crrRolesName = (roles[0] || {}).name
      } else {
        crrRoles = (roles || []).filter(x => dataRoleChange == x.id)
        crrRolesName = (crrRoles[0] || {}).name
      }
    }

    let isDisableAdd = true;
    let isDisableDelete = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableAdd = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "Permissions.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Permissions.Delete").map(y => isDisableDelete = false)
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
                        hideSearch={true}
                        hideCreate={true}
                        hideReload={true}
                        typeSearch={
                          <>
                            <div className="w_input">
                              <label
                                className="form-control-label"
                              >
                                Nhóm quyền
                              </label> &ensp;
                              <div >
                                <Select
                                  //hidenTitle={true}
                                  name='name'
                                  labelName='name'
                                  //defaultValue={localStorage.getItem('ACCOUNT_ID')}
                                  data={roles && roles}
                                  val='id'
                                  title='Danh sách nhóm quyền'
                                  //lableMark={crrRolesName}
                                  handleChange={this.handleSelect}
                                />
                              </div>
                            </div>
                          </>
                        }
                      // customComponent={
                      // 	<div className="row" style={{
                      // 		alignItems: 'center',
                      // 		margin: '0'
                      // 	}}>
                      // 		<div>
                      // 			<label
                      // 				className="form-control-label"
                      // 			>
                      // 				Nhóm quyền
                      // 			</label> &ensp;
                      // 		</div>
                      // 		<div style={{ width: 235 }}>
                      // 			<Select
                      // 				//hidenTitle={true}
                      // 				name='name'
                      // 				labelName='name'
                      // 				//defaultValue={localStorage.getItem('ACCOUNT_ID')}
                      // 				data={roles}
                      // 				val='id'
                      // 				title='Danh sách nhóm quyền'
                      // 				//lableMark={crrRolesName}
                      // 				handleChange={this.handleSelect}
                      // 			/>
                      // 		</div>
                      // 	</div>
                      // }
                      />
                      {/* Table */}
                      <Card className="shadow">

                        <Table className={`align-items-center ${classes.table} table-css-permission`} responsive>
                          <HeadTitleTable headerTitle={headerTitle} hideEdit={true} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />
                          {
                            Array.isArray(data) && (
                              removeDuplicates(data, item => item.groupName)
                                .map((item, key) => (
                                  <tbody key={key}>
                                    <tr className={classes.rowParent}>
                                      <td>{alphabet.split("")[key]}</td>
                                      <td colSpan='12'>{item.groupName}</td>
                                    </tr>
                                    {
                                      // removeDuplicates(data, item => item.functionName).filter(el => el.parentID.indexOf(item.parentID) > -1)
                                      dataAllFilter.filter(el => el.parentID.indexOf(item.parentID) > -1)
                                        .map((el, index) => {
                                          return (
                                            (
                                              <tr key={index} className="table-hover-css permission-css-check">
                                                <td className='table-scale-col '>{alphabet.split("")[key] + (index + 1)}</td>
                                                <td className="">{el.functionName}</td>
                                                <td>
                                                  {/* XEM */}
                                                  {el.actionIDView ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDViewStatus == true ? true : false}
                                                      onChange={(event) => this.handleStatus(event, el.actionIDViewID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDViewStatus && isDisableAdd == true)
                                                        || (el.actionIDViewStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* THÊM */}
                                                  {el.actionIDAdd ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDAddStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDAddID)}
                                                      disabled={
                                                        roleId == null
                                                          || (isDisableAdd == true && isDisableDelete == true)
                                                          || (!el.actionIDAddStatus && isDisableAdd == true)
                                                          || (el.actionIDAddStatus && isDisableDelete == true)
                                                          ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* SỬA */}
                                                  {el.actionIDEdit ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDEditStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDEditID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDEditStatus && isDisableAdd == true)
                                                        || (el.actionIDEditStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* XÓA */}
                                                  {el.actionIDDelete ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDDeleteStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDDeleteID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDDeleteStatus && isDisableAdd == true)
                                                        || (el.actionIDDeleteStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* DUYỆT */}
                                                  {el.actionIDConfirm ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDConfirmStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDConfirmID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDConfirmStatus && isDisableAdd == true)
                                                        || (el.actionIDConfirmStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* KHÔNG DUYỆT */}
                                                  {el.actionIDUnconfirm ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDUnconfirmStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDUnconfirmID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDUnconfirmStatus && isDisableAdd == true)
                                                        || (el.actionIDUnconfirmStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* XÁC THỰC */}
                                                  {el.actionIDVerify ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDVerifyStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDVerifyID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDVerifyStatus && isDisableAdd == true)
                                                        || (el.actionIDVerifyStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* GIA HẠN */}
                                                  {el.actionIDExtend ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDExtendStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDExtendID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDExtendStatus && isDisableAdd == true)
                                                        || (el.actionIDExtendStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* KHOÁ */}
                                                  {el.actionIDLock ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDLockStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDLockID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDLockStatus && isDisableAdd == true)
                                                        || (el.actionIDLockStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* MỞ KHOÁ */}
                                                  {el.actionIDUnlock ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDUnlockStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDUnlockID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDUnlockStatus && isDisableAdd == true)
                                                        || (el.actionIDUnlockStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                                <td>
                                                  {/* UPLOAD */}
                                                  {el.actionIDUpload ? (
                                                    <input
                                                      type="checkbox"
                                                      checked={el.actionIDUploadStatus == true ? true : false}
                                                      onClick={(event) => this.handleStatus(event, el.actionIDUploadID)}
                                                      disabled={roleId == null
                                                        || (isDisableAdd == true && isDisableDelete == true)
                                                        || (!el.actionIDUploadStatus && isDisableAdd == true)
                                                        || (el.actionIDUploadStatus && isDisableDelete == true)
                                                        ? true : false}
                                                    />
                                                  ) : null}
                                                </td>
                                              </tr>
                                            )
                                          )
                                        }
                                        )
                                    }
                                  </tbody>
                                )
                                )
                            )
                          }
                        </Table>
                      </Card>
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
          </div>
        }
      </> || <h1>{notiNotRoles}</h1>
    );

    //   } else {
    //     return (
    //       <>
    //         <h1>KHÔNG THỂ PHÂN QUYỀN VÌ CHƯA CÓ NHÓM QUYỀN NÀO ĐƯỢC TẠO</h1>
    //       </>
    //     )
    //   }
    // }

  }
};

const mapStateToProps = (state) => {
  return {
    role: state.RoleStore,
    permission: state.PermissionStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionRoleCreators, dispatch),
    ...bindActionCreators(actionPermissionList, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Permission);