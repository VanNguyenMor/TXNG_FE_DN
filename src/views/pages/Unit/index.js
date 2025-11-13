// import React, { Component, useState } from "react";
// import { bindActionCreators } from "redux";
// import compose from 'recompose/compose';
// import { connect } from "react-redux";
// import { actionUnit } from "../../../actions/UnitActions";
// import { actionMaterialGroup } from "../../../actions/MaterialGroupActions";
// import { UNIT } from "../../../helpers/constant";
// import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";
// import moment from 'moment';
// import HeaderTable from "components/HeaderTable";
// import HeadTitleTable from "components/HeadTitleTable";
// import Pagination from "components/Pagination";
// import classes from './index.module.css';
// import SearchModal from "./SearchModal";
// import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
// import WarningPopup from "../../../components/WarningPopup";
// import WarningPopupDel from "../../../components/WarningPopupDel";
// import UpdateModal from "./UpdateModal";
// import UpdatePopup from "../../../components/UpdatePopup";
// import { generateStyleTableCol } from '../../../bases/controls/helper';
// import '../../../assets/css/global/index.css';
// import '../../../assets/css/page/user.css';
// import MenuButton from "../../../assets/img/buttons/menu.png";
// import AddNewModal from "./AddNewModal";
// import PopupMessage from "../../../components/PopupMessage";
// import CreateNewPopup from "../../../components/CreateNewPopup";
// import {
//   Card,
//   Table,
//   Container,
//   Row,
//   Spinner,
//   Input,
//   ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from "reactstrap";

// class ProductsGroups extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//       dataMaterial: [],
//       field: [],
//       province: [],
//       district: [],
//       ward: [],
//       detail: null,
//       update: null,
//       create: null,
//       delete: null,
//       isLoaded: null,
//       status: null,
//       open: false,
//       openCOM: false,
//       openXEM: false,
//       comfirm: null,
//       xem: null,
//       company: null,
//       message: '',
//       history: [],
//       searchData: [],
//       filterList: [],
//       checkAtive: [{}],
//       company: [],
//       typeAlign: [{ type: 'number', position: [3, 4] }],
//       headerTitle: UNIT,
//       limit: LIMIT_ITEM_IN_PAGE,
//       beginItem: 0,
//       endItem: LIMIT_ITEM_IN_PAGE,
//       totalElement: 0,
//       listLength: 0,
//       currentPage: 0,
//       filter: {
//         "search": "",
//         "filter": "",
//         "orderBy": "",
//         "page": null,
//         "limit": null
//       },
//       deleteItem: null,
//       dropdownOpen: false,
//       warningPopupModal: false,
//       activeCreateSubmit: false,
//       newData: [],
//       fetchingUnComfirm: false,
//       errorInsert: {},
//       errorUpdate: {},
//       currentRow: null
//     }
//   }

//   componentWillReceiveProps(nextProp) {
//     let { data } = nextProp.unit;
//     const { limit } = this.state;
//     if (data !== this.state.data) {
//       if (typeof (data) !== 'undefined') {
//         if (typeof (data.list) !== 'undefined') {
//           if (data.list !== null) {
//             if (typeof (data.list.units) !== 'undefined') {
//               data.list.units.map((item, key) => {
//                 item['index'] = key + 1;
//                 item['collapse'] = false;
//               });

//               this.setState({
//                 data: data.list.units,
//                 listLength: data.list.total,
//                 totalPage: Math.ceil(data.list.units.length / limit),
//                 isLoaded: data.isLoading, status: data.status,
//                 message: PLEASE_CHECK_CONNECT(data.message)
//               });
//             } else {
//               this.setState({
//                 data: data.list.units,
//                 isLoaded: data.isLoading,
//                 status: data.status,
//                 message: PLEASE_CHECK_CONNECT(data.message)
//               });
//             }
//           }
//         }
//       }
//     }
//   }

//   toggle = (el, val) => {
//     let { data } = this.state;

//     data.filter(item => item.id === val)
//       .map(item => item.collapse = !item.collapse);

//     this.setState({ data });
//   }

//   componentWillMount() {


//     this.fetchSummary(JSON.stringify({
//       "search": "",
//       "filter": "",
//       "orderBy": "",
//       "page": null,
//       "limit": null
//     }));
//   }

//   componentDidUpdate() {
//     // This method is called when the route parameters change
//     this.closeStatusModal();
//   }

//   fetchSummary = (data) => {
//     const { requestListUnit } = this.props;
//     requestListUnit(data);
//   }

//   handleClose = (value) => {
//     const { open } = this.state;

//     this.setState({ open: value });
//   }

//   searchTable = (event) => {
//     let { data, history } = this.state;
//     let value = event.target.value.trim();

//     if (value.length === 0) {
//       data = data.filter(item => item['companyName'] !== null);
//     }
//     else {
//       data = data.filter(item =>
//         item['companyName'] !== null && item['companyName'].toLowerCase().includes(value)
//       );
//     }

//     this.setState({ searchData: data });
//   }

//   handleDeleteRow = () => {
//     const { requestDeleteUnit, requestListUnit } = this.props;
//     let { data, deleteItem } = this.state;
//     let newData = data.filter(item => item.id === deleteItem).map((item, key) => {
//       item.status = 0
//     });

//     requestDeleteUnit(deleteItem)
//       .then(res => (
//         res.status === 200 ? (
//           requestListUnit(JSON.stringify({
//             "search": "",
//             "filter": "",
//             "orderBy": "",
//             "page": null,
//             "limit": null
//           }))
//         ) : this.setState({
//           delete: [],
//           isLoading: true,
//           status: false,
//           message: PLEASE_CHECK_CONNECT(res.message)
//         })
//       ))
//       .catch(err => (
//         this.setState({
//           comfirm: [],
//           isLoading: true,
//           status: false,
//           message: PLEASE_CHECK_CONNECT(err.message)
//         })
//       ));
//   }

//   handleChange = (event) => {
//     let { data } = this.state;
//     const ev = event.target;

//     data[ev['name']] = ev['value'];
//     //console.log(data);
//     this.setState({ data });
//   }

//   closeStatusModal = () => {
//     const { status } = this.state;

//     if (status || !status) {
//       setTimeout(() => {
//         this.setState({ status: null, isLoaded: false });
//       }, LOADING_TIME);
//     }
//   }


//   handleNewData = (data) => {
//     this.setState({ newData: data });
//   }

//   toggleModal = (state, type) => {
//     if (this.state[state] && type == 1) {
//       return;
//     } else {
//       this.setState({
//         [state]: !this.state[state],
//         detail: null,
//         errorUpdate: {},
//         errorInsert: {},
//         currentRow: null,
//       });
//     }
//   };

//   clearFilter = () => {
//     const { filter } = this.state;
//     let clearFilter = {
//       "search": "",
//       "filter": "",
//       "orderBy": "",
//       "page": null,
//       "limit": null
//     }
//     this.setState({ filter: clearFilter })
//   }

//   handleStatus = (event) => {
//     for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
//       document.getElementsByClassName('checkbox-status')[i].checked = false;
//     }

//     event.target.checked = true;
//     this.handleChangeFilter(event);
//   }

//   handleCheckValidation = (status) => {
//     this.setState({ activeCreateSubmit: status });
//   }

//   handlePageClick = (data) => {
//     let { limit, beginItem, endItem } = this.state;
//     let selected = data.selected;
//     let offset = Math.ceil(selected * limit);
//     let total = 0;

//     beginItem = offset;
//     endItem = offset + limit;
//     this.state.data.map((item, key) => (
//       key >= beginItem && key < endItem && total++
//     ));

//     if (selected > 0) {
//       total = (selected * limit) + total;
//     } else total = total;

//     this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
//   };

//   handleChangeFilter = (event) => {
//     let { filter } = this.state;
//     const ev = event.target;

//     filter[ev['name']] = ev['value'];

//     this.setState({ filter });
//   }

//   handleSubmitSearchForm = () => {
//     const { filter } = this.state;
//     this.clearFilter();
//     this.fetchSummary(JSON.stringify(filter));
//   }

//   renderCreateModal = () => {
//     let { dataMaterial } = this.state;
//     return (
//       <AddNewModal
//         dataMaterial={dataMaterial}
//         handleCheckValidation={this.handleCheckValidation}
//         handleNewData={this.handleNewData}
//         errorInsert={this.state.errorInsert}
//       />
//     );
//   }

//   handleCreateInfoData = (value, closeForm) => {
//     const { requestCreateUnit } = this.props;
//     const { data } = this.state;
//     const errorInsert = {};
//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorInsert
//       }
//     });

//     if (!value.unitName) {
//       errorInsert['unitName'] = 'Tên đơn vị tính không được bỏ trống';
//     }

//     if ((value.name || '').length > 255) {
//       errorInsert['unitName'] = 'Tên đơn vị tính nhập tối đa 255 ký tự';
//     }

//     if (value.unitName) {
//       let flag = false;
//       data.filter(item => item.unitName === value.unitName.trim())
//         .map(item => flag = true);
//       if (flag == true) {
//         errorInsert['unitName'] = 'Tên đơn vị tính này đã có';
//       }
//     }

//     if (closeForm) {
//       closeForm();
//     }

//     if (Object.keys(errorInsert).length > 0) {
//       this.setState(previousState => {
//         return {
//           ...previousState,
//           errorInsert
//         }
//       });

//       return;
//     }

//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorInsert: {}
//       }
//     });

//     this.setState({ fetching: true, isLoaded: true, status: null });
//     requestCreateUnit(JSON.stringify(value)).then(res => {
//       if (res.data.status == 200) {
//         this.fetchSummary(JSON.stringify({
//           "search": "",
//           "filter": "",
//           "orderBy": "",
//           "page": null,
//           "limit": null
//         }));
//         this.toggleModal('createNewModal');
//       } else {
//         this.setState({ errNoti: res.data.message })
//         this.toggleModal('popupMessage')
//       }
//     })
//   }

//   handleUpdateInfoData = (value, closeForm) => {
//     const { requestUpdateUnit } = this.props;
//     const { data, newData, currentRow } = this.state;
//     const errorUpdate = {};
//     let newDataUpdate = {
//       id: newData.id,
//       unitName: newData.unitName,
//     };
//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorUpdate
//       }
//     });
//     if (!newDataUpdate.unitName) {
//       errorUpdate['unitName'] = 'Tên đơn vị tính không được bỏ trống';
//     }

//     if ((newDataUpdate.unitName || '').length > 255) {
//       errorUpdate['unitName'] = 'Tên đơn vị tính nhập tối đa 255 ký tự';
//     }



//     let flag = false;
//     if (newDataUpdate.unitName) {
//       if (newDataUpdate.unitName.trim().indexOf(currentRow.unitName.trim()) === -1) {
//         data.filter(item => item.unitName.trim() === newDataUpdate.unitName.trim())
//           .map(item => flag = true);
//       } else {
//         flag = false;
//       }
//       if (flag == true) {
//         errorUpdate['unitName'] = 'Tên đơn vị tính này đã có';
//       }
//     }

//     if (Object.keys(errorUpdate).length > 0) {
//       this.setState(previousState => {
//         return {
//           ...previousState,
//           errorUpdate
//         }
//       });

//       return;
//     }

//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorUpdate: {}
//       }
//     });
//     this.toggleModal('updateModal')
//     this.setState({ fetching: true, isLoaded: true, status: null });

//     requestUpdateUnit(JSON.stringify(newDataUpdate)).then(res => {
//       if (res.data.status == 200) {
//         this.fetchSummary(JSON.stringify({
//           "search": "",
//           "filter": "",
//           "orderBy": "",
//           "page": null,
//           "limit": null
//         }));
//       } else {
//         this.setState({ errNoti: res.data.message })
//         this.toggleModal('popupMessage')
//       }
//     })
//   }

//   handleOpenEdit = (id) => {
//     this.toggleModal('updateModal')
//     this.setState(previousState => {
//       return {
//         ...previousState,
//         // isShowForEdit: true,
//         editId: id
//       }
//     });
//   }
//   render() {
//     const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle } = this.props;
//     const {
//       isLoaded,
//       status,
//       message,
//       data,
//       detail,
//       headerTitle,
//       beginItem,
//       endItem,
//       listLength,
//       totalPage,
//       totalElement,
//       filter,
//       warningPopupModal,
//       warningPopupDelModal,
//       activeCreateSubmit,
//       newData,
//       updateModal,
//       dataMaterial,
//       popupMessage,
//       errNoti,
//       createNewModal
//     } = this.state;
//     const statusPopup = { status: status, message: message };

//     let isDisableAdd = true;
//     let isDisableEdit = true;
//     let isDisableDelete = true;
//     if (IS_ADMIN) {
//       isDisableAdd = false;
//       isDisableEdit = false;
//       isDisableDelete = false;
//     } else {
//       ACCOUNT_CLAIM_FF.filter(x => x == "Units.Add").map(y => isDisableAdd = false)
//       ACCOUNT_CLAIM_FF.filter(x => x == "Units.Edit").map(y => isDisableEdit = false)
//       ACCOUNT_CLAIM_FF.filter(x => x == "Units.Delete").map(y => isDisableDelete = false)
//     }

//     return (
//       <>
//         {
//           <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
//             <Container fluid className={typeof (hookSpacing) !== 'undefined' && hookSpacing}>
//               {
//                 isLoaded ? (
//                   <div style={{ display: 'table', margin: 'auto' }}>
//                     <Spinner style={{ width: '3rem', height: '3rem' }} />
//                   </div>
//                 ) : (
//                   <Row>
//                     <div className="col">
//                       {/* Header */}
//                       <HeaderTable
//                         dataReload={() => this.fetchSummary(
//                           JSON.stringify({
//                             "search": "",
//                             "filter": "",
//                             "orderBy": "",
//                             "page": null,
//                             "limit": null
//                           }))}
//                         hideCreate={isDisableAdd == false ? false : true}
//                         hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
//                         hideSearch={
//                           typeof (hideSearch) !== 'undefined' && (
//                             hideSearch && true
//                           )
//                         }
//                         searchForm={
//                           <SearchModal
//                             filter={filter}
//                             handleChangeFilter={this.handleChangeFilter}
//                           />
//                         }
//                         handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
//                         moduleTitle='Thêm đơn vị tính'
//                         moduleBody={this.renderCreateModal()}
//                         activeSubmit={activeCreateSubmit}
//                         newData={newData}
//                         handleCreateInfoData={this.handleCreateInfoData}
//                       />

//                       {/* Table */}
//                       <Card className="shadow">
//                         <Table className="align-items-center tablecs" responsive>
//                           <HeadTitleTable headerTitle={headerTitle}
//                             classHeaderColumns={{
//                               0: 'table-scale-col table-user-col-1'
//                             }}
//                           />
//                           <tbody ref={ref => this.tableBody = ref}>
//                             {
//                               Array.isArray(data) && (
//                                 data
//                                   .filter((item, key) => key >= beginItem && key < endItem)
//                                   .map((item, key) => (

//                                     <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
//                                       <td className='table-scale-col table-user-col-1'>{item.index}</td>
//                                       <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.unitName}</td>
//                                       <td>
//                                         {isDisableEdit == true && isDisableDelete == true ? null : (
//                                           <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
//                                             <DropdownToggle>
//                                               <img src={MenuButton} />
//                                             </DropdownToggle>
//                                             <DropdownMenu>
//                                               {isDisableEdit == false ? (
//                                                 <DropdownItem
//                                                   onClick={() => {
//                                                     this.toggleModal('updateModal');
//                                                     this.handleOpenEdit(item.id);
//                                                     this.setState({ currentRow: item })
//                                                   }}
//                                                 >
//                                                   Sửa
//                                                 </DropdownItem>
//                                               ) : null}
//                                               {isDisableEdit == true || isDisableDelete == true ? null : (
//                                                 <DropdownItem divider />
//                                               )
//                                               }
//                                               {isDisableDelete == false ? (
//                                                 <DropdownItem

//                                                   onClick={() => {
//                                                     this.toggleModal('warningPopupDelModal');
//                                                     this.setState({ deleteItem: item.id });
//                                                   }}
//                                                 >
//                                                   Xóa
//                                                 </DropdownItem>
//                                               ) : null}
//                                             </DropdownMenu>
//                                           </ButtonDropdown>
//                                         )}
//                                       </td>
//                                     </tr>
//                                   ))
//                               )
//                             }
//                           </tbody>
//                         </Table>
//                       </Card>
//                       {
//                         // Page of Table
//                         Array.isArray(data) && (
//                           data.length > 0 && (
//                             <Pagination
//                               data={data}
//                               listLength={listLength}
//                               totalPage={totalPage}
//                               totalElement={totalElement}
//                               handlePageClick={this.handlePageClick}
//                             />
//                           )
//                         )
//                       }
//                     </div>
//                   </Row>
//                 )
//               }
//               <PopupMessage
//                 popupMessage={popupMessage}
//                 moduleTitle={'Thông báo'}
//                 moduleBody={errNoti}
//                 toggleModal={this.toggleModal}
//               />

//               <WarningPopupDel
//                 moduleTitle='Thông báo'
//                 moduleBody={
//                   <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
//                     Bạn đồng ý xóa thông tin này?
//                   </p>}
//                 warningPopupDelModal={warningPopupDelModal}
//                 toggleModal={this.toggleModal}
//                 handleWarning={this.handleDeleteRow}
//               />

//               {
//                 <UpdatePopup
//                   moduleTitle='Sửa đơn vị tính'
//                   moduleBody={
//                     <UpdateModal
//                       dataMaterial={dataMaterial}
//                       data={detail}
//                       id={this.state.editId}
//                       handleCheckValidation={this.handleCheckValidation}
//                       handleNewData={this.handleNewData}
//                       errorUpdate={this.state.errorUpdate}
//                     />}
//                   newData={newData}
//                   updateModal={updateModal}
//                   toggleModal={this.toggleModal}
//                   activeSubmit={activeCreateSubmit}
//                   handleUpdateInfoData={this.handleUpdateInfoData}
//                 />

//               }

//               <CreateNewPopup
//                 newData={newData}
//                 createNewModal={createNewModal}
//                 moduleTitle='Thêm kê khai'
//                 type100={true}
//                 moduleBody={this.renderCreateModal()}
//                 toggleModal={this.toggleModal}
//                 activeSubmit={activeCreateSubmit}
//                 handleCreateInfoData={this.handleCreateInfoData}
//               />

//               {
//                 //Set Alert Context
//                 setAlertContext(statusPopup)
//               }

//               {
//                 //Open Alert Context
//                 openAlertContext(statusPopup)
//               }
//             </Container>
//           </div>
//         }
//       </>

//     )
//   }

// }
// const mapStateToProps = (state) => {
//   return {
//     unit: state.UnitStore,
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     ...bindActionCreators(actionUnit, dispatch),

//   }
// }
// export default compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )
// )(ProductsGroups);