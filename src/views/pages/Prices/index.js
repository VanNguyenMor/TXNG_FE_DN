// import React, { Component } from "react";
// import compose from 'recompose/compose';
// import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID,IS_ADMIN } from "../../../services/Common";
// import { PRICES_HEADER } from "../../../helpers/constant";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { actionPriceCreators } from "../../../actions/PricesListActions";
// import classes from './index.module.css';
// import Validate from "react-validate-form";
// import { rules, validations } from "../../../helpers/validation";
// import EditIcon from "../../../assets/img/buttons/edit.svg";
// import DeleteIcon from "../../../assets/img/buttons/delete.png";
// import HeaderChild from "components/Headers/HeaderChild.js";
// import Pagination from "components/Pagination";
// import HeaderTable from "components/HeaderTable";
// import AddNewModal from "./AddNewModal";
// import UpdateModal from "./UpdateModal";
// import UpdatePopup from "../../../components/UpdatePopup";
// import WarningPopup from "../../../components/WarningPopup";
// import HeadTitleTable from "components/HeadTitleTable";
// import { handleCurrencyFormat } from "../../../helpers/common";
// import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
// import MenuButton from "../../../assets/img/buttons/menu.png";
// // reactstrap components
// import {
//   Card,
//   Table,
//   Container,
//   Row,
//   Spinner,
//   ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from "reactstrap";

// class Prices extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: [],
//       detail: null,
//       newDetail: null,
//       update: [],
//       create: [],
//       delete: [],
//       currentRow: [],
//       dataAll: [],
//       isLoaded: null,
//       status: null,
//       open: false,
//       openAddNew: false,
//       message: '',
//       history: [],
//       prices: [],
//       editStatus: true,
//       headerTitle: PRICES_HEADER,
//       limit: LIMIT_ITEM_IN_PAGE,
//       beginItem: 0,
//       endItem: LIMIT_ITEM_IN_PAGE,
//       totalElement: 0,
//       listLength: 0,
//       currentPage: 0,
//       activeCreateSubmit: false,
//       newData: [],
//       deleteItem: null,
//       updateModal: false,
//       warningPopupModal: false,
//       errorUpdate: {},
//       errorInsert: {},
//     };
//   }

//   componentWillReceiveProps(nextProp) {
//     const { price } = nextProp;
//     const { limit, refetch } = this.state;
//     let priceData = null;

//     if (price !== this.state.price) {
//       if (typeof (price) !== 'undefined') {
//         if (typeof (price.data) !== 'undefined') {
//           priceData = price.data;

//           if (typeof (priceData) !== 'undefined') {
//             if (typeof (priceData.prices) !== 'undefined') {
//               if (typeof (priceData.prices.prices) !== 'undefined') {
//                 if (priceData.prices.prices.length > 0) {
//                   priceData.prices.prices.map((item, key) => {
//                     item['index'] = key + 1
//                     item['collapse'] = false
//                   });
//                 }
//               }

//               if (refetch) {
//                 this.setState({
//                   data: priceData.prices.prices,
//                   dataAll: priceData.prices.prices,
//                   listLength: priceData.prices.total,
//                   totalPage: Math.ceil(priceData.prices.prices.length / limit),
//                   isLoaded: false,
//                   refetch: false,
//                   status: priceData.status,
//                   message: PLEASE_CHECK_CONNECT(priceData.message)
//                 });
//               } else {
//                 this.setState({
//                   data: priceData.prices.prices,
//                   dataAll: priceData.prices.prices,
//                   listLength: priceData.prices.total,
//                   totalPage: Math.ceil(priceData.prices.prices.length / limit),
//                   isLoaded: priceData.isLoading,
//                   status: priceData.status,
//                   message: PLEASE_CHECK_CONNECT(priceData.message)
//                 });
//               }
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
//     /* Fetch Summary */
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
//     const { getAllPriceList } = this.props;

//     getAllPriceList(data);
//   }

//   closeStatusModal = () => {
//     const { status } = this.state;

//     if (status || !status) {
//       setTimeout(() => {
//         this.setState({ status: null, isLoaded: false });
//       }, LOADING_TIME);
//     }
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
//     let { filter } = this.state;
//     // const { getAllRoleList } = this.props;

//     // filter.search = filter.roleName;
//     // getAllRoleList(JSON.stringify(filter));
//   }

//   renderCreateModal = () => {
//     return (
//       <AddNewModal
//         handleCheckValidation={this.handleCheckValidation}
//         handleNewData={this.handleNewData}
//         errorInsert={this.state.errorInsert}
//       />
//     );
//   }

//   handleCheckValidation = (status) => {
//     this.setState({ activeCreateSubmit: status });
//   }

//   handleNewData = (data) => {
//     this.setState({ newData: data });
//   }

//   handleNewDetail = (name, data) => {
//     const { detail } = this.state;
//     let newDetail = {
//       ...detail
//     };

//     if (name !== null) {
//       newDetail[name] = data;
//       this.setState({ newDetail });
//     }
//   }
//   closeForm = () => {
//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorInsert: {},
//         newData: []
//         //errorUpdate: {},
//       }
//     });

//     this.setState({ newData: [] });
//   }
//   handleCreateInfoData = (value, closeForm) => {
//     const { createNewPrice } = this.props;
//     const priceTotal = this.state.data.length + 1;
//     let { dataAll } = this.state;
//     const errorInsert = {};
//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorInsert
//       }
//     });
//     value.id = priceTotal;
//     value.year = parseInt(value.year);
//     if (!value.amount) {
//       errorInsert['amount'] = 'Số tiền không được bỏ trống';
//     }

//     if (value.amount < 0 || value.amount == 0) {
//       errorInsert['amount'] = 'Số tiền phải lớn hơn 0';
//     }

//     if (value.year < 0 || value.year == 0) {
//       errorInsert['year'] = 'Số năm phải lớn hơn 0';
//     }

//     if (!value.year) {
//       errorInsert['year'] = 'Số năm không được bỏ trống';
//     }

//     if (value.year) {

//       let flag = false;
//       dataAll.filter(item => String(item.year).trim() === String(value.year).trim())
//         .map(item => flag = true);
//       if (flag == true) {
//         errorInsert['year'] = 'Số năm cho bảng giá này đã có';
//       }
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

//     if (closeForm) {
//       closeForm();
//     }
//     createNewPrice(JSON.stringify(value))
//       .then(res => (
//         res.status === 200 ? (
//           this.setState({ create: res.data, isLoading: false, status: true, message: PLEASE_CHECK_CONNECT(res.message) }),

//           /* Fetch Summary */
//           this.setState({ data: [] }),
//           this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null })),
//           this.handleOpenAddNew(false)
//         ) : this.setState({ create: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(res.message) })
//       ))
//       .catch(err => (
//         this.setState({ create: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(err.message) })
//       ));
//   }

//   handleOpenEdit = (id) => {
//     const { data } = this.state;

//     this.setState({ detail: data[id] });
//   }

//   // toggleModal = (state) => {
//   //   this.setState({
//   //     [state]: !this.state[state],
//   //     detail: null
//   //   });
//   // }
//   toggleModal = (state, type) => {
//     if (this.state[state] && type == 1) {
//       return;
//     } else {
//       this.setState({
//         [state]: !this.state[state],
//         detail: null,
//         errorUpdate: {},
//         errorInsert: {},
//       });
//     }
//   };

//   handleUpdateInfoData = (value) => {
//     const { newDetail, dataAll, currentRow } = this.state;
//     const { updatePriceInfo } = this.props;
//     const updateData = { ...newDetail }

//     const errorUpdate = {};

//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorUpdate
//       }
//     });

//     if (!updateData.amount) {
//       errorUpdate['amount'] = 'Số tiền không được bỏ trống';
//     }

//     if (updateData.amount < 0 || updateData.amount == 0) {
//       errorUpdate['amount'] = 'Số tiền phải lớn hơn 0';
//     }

//     if (updateData.year < 0 || updateData.year == 0) {
//       errorUpdate['year'] = 'Số năm phải lớn hơn 0';
//     }

//     if (!updateData.year) {
//       errorUpdate['year'] = 'Số năm không được bỏ trống';
//     }
//     let flag = false;
//     if (updateData.year) {

//       if (String(updateData.year).trim().indexOf(String(currentRow.year).trim()) === -1) {
//         dataAll.filter(item => String(item.year).trim() === String(updateData.year).trim())
//           .map(item => flag = true);
//       } else {
//         flag = false;
//       }
//       if (flag == true) {
//         errorUpdate['year'] = 'Số năm cho bảng giá này đã có';
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
//         errorUpdate: {},
//         detail: null,
//         updateModal: false
//       }
//     });
//     // Call update
//     updatePriceInfo(JSON.stringify(newDetail))
//       .then(res => {
//         if (res.status === 200) {
//           this.setState({ refetch: true });
//           this.setState({ update: res.data, isLoading: false, status: true, message: PLEASE_CHECK_CONNECT(res.message) });

//           // Fetch List
//           setTimeout(() => {
//             this.fetchSummary(JSON.stringify({
//               "search": "",
//               "filter": "",
//               "orderBy": "",
//               "page": null,
//               "limit": null
//             }));
//           }, 500);
//         } else {
//           this.setState({ update: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(res.message) });
//         }
//       })
//       .catch(err => {
//         this.setState({ update: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(err.message) })
//       });
//   }

//   handleDeleteRow = () => {
//     const { deletePriceInfo } = this.props;
//     let { deleteItem } = this.state;

//     deletePriceInfo(deleteItem)
//       .then(res => (
//         res.status === 200 ? (
//           this.setState({ delete: res.data, isLoading: false, status: true, message: PLEASE_CHECK_CONNECT(res.message) }),

//           // Fetch List
//           setTimeout(() => {
//             this.fetchSummary(JSON.stringify({
//               "search": "",
//               "filter": "",
//               "orderBy": "",
//               "page": null,
//               "limit": null
//             }));
//           }, 500)
//         ) : this.setState({ delete: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(res.message) })
//       ))
//       .catch(err => (
//         this.setState({ delete: [], isLoading: false, status: false, message: PLEASE_CHECK_CONNECT(err.message) })
//       ))
//   }

//   render() {
//     const {
//       status,
//       headerTitle,
//       data,
//       detail,
//       message,
//       isLoaded,
//       beginItem,
//       endItem,
//       listLength,
//       totalPage,
//       totalElement,
//       errorInsert,
//       errorUpdate,
//       activeCreateSubmit,
//       newData,
//       updateModal,
//       warningPopupModal } = this.state;
//     const statusPopup = { status: status, message: message };
//     let isDisableAdd = true;
//     let isDisableEdit = true;
//     let isDisableDelete = true;
//     if (IS_ADMIN) {
//       isDisableAdd = false;
//       isDisableEdit = false;
//       isDisableDelete = false;
//     } else {
//       ACCOUNT_CLAIM_FF.filter(x => x == "Prices.Add").map(y => isDisableAdd = false)
//       ACCOUNT_CLAIM_FF.filter(x => x == "Prices.Edit").map(y => isDisableEdit = false)
//       ACCOUNT_CLAIM_FF.filter(x => x == "Prices.Delete").map(y => isDisableDelete = false)
//     }
//     return (
//       <>
//         {
//           <div className={classes.wrapper}>
//             <Container fluid>
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
//                         hideSearch={true}
//                         hideCreate={isDisableAdd == false ? false : true}
//                         handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
//                         moduleTitle='Thêm bảng giá'
//                         moduleBody={this.renderCreateModal()}
//                         activeSubmit={activeCreateSubmit}
//                         newData={newData}
//                         errorInsert={errorInsert}
//                         handleCreateInfoData={this.handleCreateInfoData}
//                         isPreventForm={true}
//                         closeForm={this.closeForm}
//                       />

//                       {/* Table */}
//                       <Card className="shadow">
//                         <Table className="align-items-center tablecs" responsive>
//                           <HeadTitleTable headerTitle={headerTitle} />

//                           <tbody>
//                             {
//                               Array.isArray(data) && (
//                                 data
//                                   .filter((item, key) => key >= beginItem && key < endItem)
//                                   .map((item, key) => (
//                                     <tr key={key}>
//                                       <td>{item.index}</td>
//                                       <td style={{ textAlign: 'right' }}>{item.year}</td>
//                                       <td style={{ textAlign: 'right' }}>{handleCurrencyFormat(item.amount)}</td>
//                                       {/* <td>
//                                         <div className={classes.editArea}>
//                                           <div 
//                                             className={classes.item}
//                                             onClick={() => {
//                                               this.toggleModal('updateModal');
//                                               this.handleOpenEdit(key);
//                                             }}
//                                           >
//                                             <img src={EditIcon} alt="Sửa" title="Sửa" />
//                                           </div>
//                                           {
//                                             item.year === 1 ? (
//                                               <div className={classes.emptyitem}></div>
//                                             ) : (
//                                               <div 
//                                                 className={classes.item}
//                                                 onClick={() => {
//                                                   this.toggleModal('warningPopupModal');
//                                                   this.setState({ deleteItem: item.id });
//                                                 }}
//                                               >
//                                                 <img src={DeleteIcon} alt="Xoá" title="Xoá" />
//                                               </div>
//                                             )
//                                           }
//                                         </div>
//                                       </td> */}
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
//                                                     this.setState({ currentRow: item })
//                                                     this.handleOpenEdit(key);
//                                                   }}
//                                                 >
//                                                   Sửa
//                                                 </DropdownItem>
//                                               ) : null}
//                                               {
//                                                 (item.year === 1 || isDisableEdit == true || isDisableDelete == true) ? null : (
//                                                   <DropdownItem divider />
//                                                 )}
//                                               {
//                                                 item.year === 1 || isDisableDelete == true ? (
//                                                   <div className={classes.emptyitem}></div>
//                                                 ) : (
//                                                   <DropdownItem
//                                                     onClick={() => {
//                                                       this.toggleModal('warningPopupModal');
//                                                       this.setState({ deleteItem: item.id });
//                                                     }}
//                                                   >
//                                                     Xoá
//                                                   </DropdownItem>
//                                                 )
//                                               }
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

//                       {/* Pagination */}
//                       {
//                         // Page of Table
//                         Array.isArray(data) && (
//                           <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
//                         )
//                       }
//                     </div>
//                   </Row>
//                 )
//               }

//               {
//                 //Set Alert Context
//                 setAlertContext(statusPopup)
//               }

//               {
//                 //Open Alert Context
//                 openAlertContext(statusPopup)
//               }

//               {
//                 detail !== null && (
//                   <UpdatePopup
//                     moduleTitle='Cập nhật bảng giá'
//                     moduleBody={
//                       <UpdateModal
//                         data={detail}
//                         errorUpdate={errorUpdate}
//                         handleCheckValidation={this.handleCheckValidation}
//                         handleNewData={this.handleNewData}
//                         handleNewDetail={this.handleNewDetail}
//                       />}
//                     newData={newData}
//                     updateModal={updateModal}
//                     toggleModal={this.toggleModal}
//                     activeSubmit={activeCreateSubmit}
//                     handleUpdateInfoData={this.handleUpdateInfoData}
//                   />
//                 )
//               }

//               <WarningPopup
//                 moduleTitle='Thông báo'
//                 moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
//                 warningPopupModal={warningPopupModal}
//                 toggleModal={this.toggleModal}
//                 handleWarning={this.handleDeleteRow}
//               />
//             </Container>
//           </div>
//         }
//       </>
//     );
//   }
// };

// const mapStateToProps = (state) => {
//   return {
//     price: state.PriceStore
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     ...bindActionCreators(actionPriceCreators, dispatch)
//   }
// }

// export default compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )
// )(Prices);
