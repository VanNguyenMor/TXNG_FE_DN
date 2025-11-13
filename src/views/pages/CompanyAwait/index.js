// import React, { Component, useState } from "react";

// import { bindActionCreators } from "redux";
// import PopupMessage from "../../../components/PopupMessage";
// import compose from 'recompose/compose';
// import { connect } from "react-redux";
// import { actionGetListCompanyAwait } from "../../../actions/CompanyAwaitActions";
// import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
// import { actionField } from "../../../actions/FieldActions.js";
// import { actionLocationCreators } from "../../../actions/LocationListAction";
// import { COMPANY_AWAIT_HEADER } from "../../../helpers/constant";
// import Kduyet from "assets/img/buttons/KoDuyet.svg";
// import Duyet from "assets/img/buttons/Duyet.svg";
// import ViewModal from "./ViewModal";

// import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// // import Loader from "../../../components/Loader/Loader";
// //import Table from "../../../components/Table/Table";
// import ConfirmButton from "../../../assets/img/buttons/confirm.png";
// import UnConfirmButton from "../../../assets/img/buttons/unconfirm.png";
// import XEM from "../../../assets/img/buttons/XEM.png";
// //import Button from '@material-ui/core/Button';
// import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";
// //import Select from "../../../components/Select";
// import moment from 'moment';
// //import UnComfirmCompany from './UnComfirmCompany';
// //import Comfirm from "./ComfirmCompany.js";
// //import Details from "./Details";
// import HeaderTable from "components/HeaderTable";
// import HeadTitleTable from "components/HeadTitleTable";
// import HeaderChild from "components/Headers/HeaderChild.js";
// import EditIcon from "../../../assets/img/buttons/edit.svg";
// import DeleteIcon from "../../../assets/img/buttons/delete.png";
// import ViewIcon from "../../../assets/img/buttons/XEM.png";
// import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
// import UnComfirmIcon from "../../../assets/img/buttons/unconfirm.png";
// import Pagination from "components/Pagination";
// import classes from './index.module.css';
// import SearchModal from "./SearchModal";
// import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
// import WarningPopup from "../../../components/WarningPopup";
// import UnComfirmModal from "./UnComfirmModal";
// import UpdatePopup from "../../../components/UpdatePopup";
// import { generateStyleTableCol } from '../../../bases/controls/helper';
// import '../../../assets/css/global/index.css';
// import '../../../assets/css/page/user.css';
// import MenuButton from "../../../assets/img/buttons/menu.png";
// import ViewPopup from "../../../components/ViewPopup";

// import {
//   Card,
//   Table,
//   Container,
//   Row,
//   Spinner,
//   Input,
//   Button,
//   ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from "reactstrap";

// class CompanyAwait extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//       fileUpdate: [],
//       field: [],
//       province: [],
//       district: [],
//       ward: [],
//       errorMessagesUn: {},
//       detail: null,
//       detailView: null,
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
//       //openUnComfirm: false,
//       message: '',
//       history: [],
//       // dataMaping: [
//       //   'index', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address',
//       // ],
//       searchData: [],
//       filterList: [],
//       checkAtive: [{}],
//       company: [],
//       typeAlign: [{ type: 'number', position: [3, 4] }],
//       headerTitle: COMPANY_AWAIT_HEADER,
//       limit: LIMIT_ITEM_IN_PAGE,
//       beginItem: 0,
//       endItem: LIMIT_ITEM_IN_PAGE,
//       totalElement: 0,
//       listLength: 0,
//       currentPage: 0,
//       filter: {
//         "fieldID": "",
//         "comapanyName": "",
//         "taxCode": "",
//         "phone": "",
//         "email": "",
//         "provinceID": "",
//         "districtID": "",
//         "wardID": "",
//         "orderBy": "",
//         "page": null,
//         "limit": null,

//       },
//       comfirmItem: null,
//       dropdownOpen: false,
//       warningPopupModal: false,
//       activeCreateSubmit: false,
//       newData: [],
//       fetchingUnComfirm: false
//     }
//   }

//   componentWillReceiveProps(nextProp) {
//     let { data } = nextProp.company;
//     const { fetchingUnComfirm } = this.state;
//     const { requestCompanyAwaitListStore } = nextProp;

//     let fieldData = nextProp.field.data;
//     let detailsData = nextProp.details.data;

//     let locationData = nextProp.location.data;
//     const { limit } = this.state;

//     if (data !== this.state.data) {
//       if (typeof (data) !== 'undefined') {
//         if (typeof (data.company) !== 'undefined') {
//           if (data.company !== null) {
//             if (typeof (data.company.companies) !== 'undefined') {
//               data.company.companies.map((item, key) => {
//                 item['index'] = key + 1
//                 item['collapse'] = false
//                 // item['confirmedDate']=moment(item.confirmedDate).format('DD/MM/YYYY')
//               });

//               this.setState({
//                 data: data.company.companies,
//                 company: data.company.companies,
//                 listLength: data.company.companies.length,
//                 totalPage: Math.ceil(data.company.companies.length / limit),
//                 isLoaded: data.isLoading, status: data.status,
//                 message: PLEASE_CHECK_CONNECT(data.message)
//               });
//             } else {
//               this.setState({
//                 data: data.company.companies,
//                 company: data.company.companies,
//                 isLoaded: data.isLoading,
//                 status: data.status,
//                 message: PLEASE_CHECK_CONNECT(data.message)
//               });
//             }
//           }
//         }

//       }
//     }

//     if (typeof (detailsData) !== 'undefined') {
//       if (detailsData.details !== null) {
//         if (typeof (detailsData.details) !== 'undefined') {
//           this.setState({
//             xem: detailsData.details,
//             detail: detailsData.details,
//             detailView: detailsData.details,
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         } else {
//           this.setState({
//             xem: detailsData.details,
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         }
//       }
//       // if (detailsData.fileUpdate !== null) {
//       //   if (typeof (detailsData.fileUpdate) !== 'undefined') {
//       //     this.setState({
//       //       fileUpdate: detailsData.fileUpdate,
//       //       isLoaded: false,
//       //       status: data.status,
//       //       message: PLEASE_CHECK_CONNECT(data.message)
//       //     });
//       //   } else {
//       //     this.setState({
//       //       fileUpdate: detailsData.fileUpdate,
//       //       isLoaded: false,
//       //       status: data.status,
//       //       message: PLEASE_CHECK_CONNECT(data.message)
//       //     });
//       //   }
//       // }
//     }


//     if (typeof (data.uncomfirm) !== 'undefined') {
//       //console.log(data.uncomfirm)

//       if (data.status && !fetchingUnComfirm) {
//         this.setState({ data: [] });
//         requestCompanyAwaitListStore(JSON.stringify({
//           "fieldID": "",
//           "comapanyName": "",
//           "taxCode": "",
//           "phone": "",
//           "email": "",
//           "provinceID": "",
//           "districtID": "",
//           "wardID": "",
//           "orderBy": "",
//           "page": null,
//           "limit": null,
//         }))
//         this.setState({ fetchingUnComfirm: true });
//       }

//     }

//     if (typeof (data.detail) !== 'undefined') {
//       if (data.detail !== null) {
//         if (data.status) {
//           this.setState({ xem: null });
//           this.setState({
//             xem: data.detail,
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         } else {
//           this.setState({
//             xem: [],
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         }
//       }
//     }


//     if (fieldData !== this.state.field) {
//       if (typeof (fieldData) !== 'undefined') {
//         if (fieldData.field !== null) {
//           if (typeof (fieldData.field) !== 'undefined') {
//             this.setState({
//               field: fieldData.field.fields,
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           } else {
//             this.setState({
//               field: fieldData.field,
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           }
//         }
//       }
//     }
//     if (locationData !== this.state.province) {
//       if (typeof (locationData) !== 'undefined') {
//         if (typeof (locationData.province) !== 'undefined') {

//           if (locationData.province !== null) {
//             //console.log(locationData.province.data)
//             this.setState({
//               province: locationData.province,
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           } else {
//             this.setState({
//               province: [],
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           }
//         }
//       }
//     }

//     if (locationData !== this.state.district) {
//       if (typeof (locationData) !== 'undefined') {
//         if (typeof (locationData.district) !== 'undefined') {
//           if (locationData.district !== null) {
//             this.setState({
//               district: locationData.district,
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           } else {
//             this.setState({
//               district: [],
//               isLoaded: false,
//               status: data.status,
//               message: PLEASE_CHECK_CONNECT(data.message)
//             });
//           }
//         }
//       }
//     }

//     if (locationData !== this.state.ward) {

//       if (typeof (locationData) !== 'undefined') {

//         // if (typeof (locationData.ward) !== 'undefined') {
//         if (locationData.ward !== null) {

//           this.setState({ ward: [] })
//           this.setState({
//             ward: locationData.ward,
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         } else {
//           this.setState({
//             ward: [],
//             isLoaded: false,
//             status: data.status,
//             message: PLEASE_CHECK_CONNECT(data.message)
//           });
//         }
//         //}
//       }
//     }
//   }

//   getId = (value) => {
//     if (typeof (value.id) !== 'undefined') {
//       this.fetchSummaryComfirm(
//         value.id,
//       )
//     }
//     //window.location.reload(true);

//   }
//   getIdXem = (value) => {
//     if (typeof (value.id) !== 'undefined') {
//       this.fetchSummaryXem(
//         value.id,
//       )
//     }
//     //window.location.reload(true);

//   }

//   toggle = (el, val) => {
//     let { data } = this.state;

//     data.filter(item => item.id === val)
//       .map(item => item.collapse = !item.collapse);

//     this.setState({ data });
//   }

//   componentWillMount() {
//     const { requestFieldStore } = this.props;
//     const { getProvinceList } = this.props;
//     const { getDistrictList } = this.props;
//     //const { requestCompanyGetDetails } = this.props;
//     //const { getWardList } = this.props;
//     const { filter } = this.state;

//     requestFieldStore(JSON.stringify({
//       "search": "",
//       "filter": "",
//       "orderBy": "",
//       "page": null,
//       "limit": null
//     }));

//     getProvinceList();
//     getDistrictList();
//     //getWardList('558');
//     // requestCompanyGetDetails('54.b1bb9c62-f001-4641-93d1-72899e63c6f4');
//   }

//   componentUnComfirmMount = (value) => {
//     let { data } = this.state;
//     const { requestCompanyUnComfirmStore } = this.props;

//     const errorMessagesUn = {};

//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorMessagesUn
//       }
//     });
//     const createData = JSON.stringify({
//       id: value.id,
//       reason: value.reason
//     })
//     this.handleClose(true);
//     // this.toggleModal('updateModal')
//     console.log(value)
//     if (!value.reason) {
//       errorMessagesUn['reason'] = 'Lý do không được để trống';
//     }

//     if (Object.keys(errorMessagesUn).length > 0) {
//       this.setState(previousState => {
//         return {
//           ...previousState,
//           errorMessagesUn
//         }
//       });
//       return;
//     }

//     this.setState(previousState => {
//       return {
//         ...previousState,
//         errorUpdate: {},
//         errorMessagesUn: {},
//         detail: null,
//         updateModal: false
//       }
//     });

//     requestCompanyUnComfirmStore(createData)
//     this.setState({ fetchingUnComfirm: false })


//     //window.location.reload(true);
//   }

//   componentDidMount() {
//     // This method is called when the component is first added to the document
//     //this.filterMapKey();

//     /* Fetch Summary */

//     this.fetchSummary(JSON.stringify({
//       "fieldID": "",
//       "comapanyName": "",
//       "taxCode": "",
//       "phone": "",
//       "email": "",
//       "provinceID": "",
//       "districtID": "",
//       "wardID": "",
//       "orderBy": "",
//       "page": null,
//       "limit": null,
//     }));
//   }

//   componentDidUpdate() {
//     // This method is called when the route parameters change
//     this.closeStatusModal();
//   }

//   fetchSummary = (data) => {
//     const { requestCompanyAwaitListStore, requestFieldStore } = this.props;

//     requestCompanyAwaitListStore(data);
//     requestFieldStore(data);
//   }

//   fetchSummaryComfirm = (id) => {
//     const { requestCompanyComfirmStore } = this.props;

//     requestCompanyComfirmStore(id);
//   }

//   fetchSummaryXem = (id) => {
//     const { requestCompanyGetDetails } = this.props;

//     requestCompanyGetDetails(id);
//   }

//   handleClose = (value) => {
//     const { open } = this.state;

//     this.setState({ open: value });
//   }
//   // filterMapKey = () => {
//   //   let { dataMaping, filterList } = this.state;
//   //   let newFilterMap = [];

//   //   dataMaping.filter((item, key) => {
//   //     typeof (filterList[key]) !== 'undefined' && (
//   //       newFilterMap.push({ index: key, value: filterList[key] })
//   //     )
//   //   });

//   //   filterList = [];
//   //   this.setState({ filterList: newFilterMap });
//   // }
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

//   handleComfirmRow = () => {
//     const { requestCompanyComfirmStore, requestCompanyAwaitListStore } = this.props;
//     let { data, comfirmItem } = this.state;
//     let newData = data.filter(item => item.id === comfirmItem).map((item, key) => {
//       item.status = 0
//     });

//     requestCompanyComfirmStore(comfirmItem)
//       .then(res => (
//         res.status === 200 ? (
//           // this.setState({
//           //   comfirm: res.data,
//           //   isLoading: true,
//           //   status: true,
//           //   message: PLEASE_CHECK_CONNECT(res.message)
//           // }),
//           //this.setState({ data: newData }),

//           //this.fetchSummary()
//           requestCompanyAwaitListStore(JSON.stringify({
//             "fieldID": "",
//             "comapanyName": "",
//             "taxCode": "",
//             "phone": "",
//             "email": "",
//             "provinceID": "",
//             "districtID": "",
//             "wardID": "",
//             "orderBy": "",
//             "page": null,
//             "limit": null,
//           }))
//         ) : (
//           this.setState({
//             comfirm: [],
//             isLoading: true,
//             status: false,
//             message: PLEASE_CHECK_CONNECT(res.message),
//             errmessage: PLEASE_CHECK_CONNECT(res.message)
//           }),
//           this.toggleModal('popupMessage')
//         )
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
//   // buttonAcitveArea = (ele) => {
//   //   const { classes } = this.props;
//   //   const { open, openCOM, openXEM, xem } = this.state;
//   //   //console.log(ele.id)
//   //   return (
//   //     <div className={classes.editArea}>

//   //       <div className='edit-item' onClick={() => {

//   //         this.getIdXem(ele.id);
//   //         this.handleCloseXEM(true);
//   //         //this.setState({ xem: ele });
//   //         //console.log(this.state.xem)
//   //       }}
//   //         open={openXEM}
//   //       >
//   //         <img src={XEM} alt='xem' title='Xem' style={{ with: 25, height: 25 }} />
//   //       </div>

//   //       <div className='edit-item' onClick={() => {
//   //         this.handleCloseCOM(true);
//   //         this.setState({ comfirm: ele });

//   //       }}
//   //         open={openCOM}
//   //       >
//   //         <img src={ConfirmButton} alt='duyet' title='Duyệt' />
//   //       </div>

//   //       <div className='edit-item' onClick={() => {
//   //         this.handleClose(true);
//   //         this.setState({ detail: ele });
//   //       }}
//   //       >
//   //         <img src={UnConfirmButton} alt='khong duyet' title='Không duyệt' />
//   //       </div>
//   //     </div>
//   //   );
//   // }
//   // toggleModal = (state) => {
//   //   this.setState({
//   //     [state]: !this.state[state],
//   //     detail: null
//   //   });
//   // };
//   toggleModal = (state, type) => {
//     if (this.state[state] && type == 1) {
//       return;
//     } else {
//       this.setState({
//         [state]: !this.state[state],
//         detail: null,
//         errorUpdate: {},
//         detailView: null,
//         errorMessagesUn: {},
//       });
//     }
//   };

//   clearFilter = () => {
//     const { filter } = this.state;
//     let clearFilter = {
//       "fieldID": "",
//       "comapanyName": "",
//       "taxCode": "",
//       "phone": "",
//       "email": "",
//       "provinceID": "",
//       "districtID": "",
//       "wardID": "",
//       "orderBy": "",
//       "page": null,
//       "limit": null,
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

//   handleSelect = (value, name) => {
//     let { filter } = this.state;
//     //const { getWardList } = this.props;
//     filter[name] = value;
//     this.setState({ filter });
//     //getWardList(filter.districtID)

//   }

//   handleSelectWard = (value, name) => {
//     let { filter } = this.state;
//     const { getWardList } = this.props;
//     filter[name] = value;

//     this.setState({ filter });
//     getWardList(filter.districtID);
//   }

//   handleCloseXEM = (value) => {
//     const { openXEM } = this.state;

//     this.setState({ openXEM: value });
//   }

//   handleCloseCOM = (value) => {
//     const { openCOM } = this.state;

//     this.setState({ openCOM: value });
//   }

//   handleSelectJob = (event) => {
//     let { data, field, company } = this.state;
//     let fieldNameCurrent = null;

//     // Get all
//     if (Number(event.target.value) === -1) {
//       data = company;
//     } else {
//       field.filter(item => item.id === event.target.value)
//         .map(item => (
//           fieldNameCurrent = item.fieldName
//         ));

//       Array.isArray(company) ? (
//         data = company.filter(item =>
//           item.fieldName === fieldNameCurrent
//         ).map(item => item = item)
//       ) : (
//         data = company
//       )
//     }

//     this.setState({ data });
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
//   handleOpenEdit = (id) => {
//     let { fileUpdate } = this.state;
//     const { requestCompanyGetDetails, requestCompanyGetFileUpdate } = this.props;
//     requestCompanyGetFileUpdate(id).then((res) => {
//       if (res.data.status === 200) {
//         let listXXX = res.data.data;
//         listXXX.map(list => {
//           if (list.uploadDate) {
//             list.sorted_file = list.uploadDate;
//           } else {
//             list.sorted_file = list.registeredDate;
//           }
//         })
//         let sorted_file = listXXX.sort((a, b) => {
//           return new Date(a.sorted_file).getTime() -
//             new Date(b.sorted_file).getTime()
//         }).reverse();
//         this.setState({ fileUpdate: sorted_file })
//       }
//     })
//     requestCompanyGetDetails(id);
//   }

//   handleSubmitSearchForm = () => {
//     const { filter } = this.state;
//     this.clearFilter();
//     this.fetchSummary(JSON.stringify(filter));
//   }
//   render() {
//     const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle, heightdashboard } = this.props;
//     const {
//       isLoaded,
//       status,
//       message,
//       data,
//       searchData,
//       filterList,
//       dataMaping,
//       checkAtive,
//       open,
//       detail,
//       field,
//       openCOM,
//       comfirm,
//       openXEM,
//       xem,
//       headerTitle,
//       typeAlign,
//       beginItem,
//       endItem,
//       listLength,
//       totalPage,
//       totalElement,
//       filter,
//       province,
//       district,
//       ward,
//       warningPopupModal,
//       activeCreateSubmit,
//       newData,
//       updateModal,
//       detailView,
//       viewModal,
//       popupMessage,
//       errmessage,
//       errorMessagesUn,
//       fileUpdate
//     } = this.state;
//     const statusPopup = { status: status, message: message };
//     let isDisableConfirm = true;
//     let isDisableUnConfirm = true;
//     if (IS_ADMIN) {
//       isDisableConfirm = false;
//       isDisableUnConfirm = false;
//     } else {
//       ACCOUNT_CLAIM_FF.filter(x => x == "ConfirmingCompanies.Confirm").map(y => isDisableConfirm = false)
//       ACCOUNT_CLAIM_FF.filter(x => x == "ConfirmingCompanies.Unconfirm").map(y => isDisableUnConfirm = false)
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
//                             "fieldID": "",
//                             "comapanyName": "",
//                             "taxCode": "",
//                             "phone": "",
//                             "email": "",
//                             "provinceID": "",
//                             "districtID": "",
//                             "wardID": "",
//                             "orderBy": "",
//                             "page": null,
//                             "limit": null,
//                           }))}
//                         hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
//                         hideCreate={true}
//                         hideSearch={
//                           typeof (hideSearch) !== 'undefined' && (
//                             hideSearch && true
//                           )
//                         }
//                         searchForm={
//                           <SearchModal
//                             filter={filter}
//                             field={field}
//                             district={district}
//                             province={province}
//                             ward={ward}
//                             handleChangeFilter={this.handleChangeFilter}
//                             handleStatus={this.handleStatus}
//                             handleSelect={this.handleSelect}
//                             handleSelectWard={this.handleSelectWard}
//                           />
//                         }
//                         handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
//                       />

//                       {/* Table */}
//                       <Card className="shadow">
//                         {heightdashboard == true ? (
//                           <Table className="align-items-center tablecs" responsive style={{ height: 300 }}>
//                             <HeadTitleTable headerTitle={headerTitle}
//                               classHeaderColumns={{
//                                 0: 'table-scale-col table-user-col-1'
//                               }}
//                             />

//                             <tbody ref={ref => this.tableBody = ref}>
//                               {
//                                 Array.isArray(data) && (
//                                   data
//                                     .filter((item, key) => key >= beginItem && key < endItem)
//                                     .map((item, key) => (
//                                       <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
//                                         <td className='table-scale-col table-user-col-1'>{item.index}</td>
//                                         <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
//                                         {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
//                                         <td style={{ textAlign: 'left' }} className='table-scale-col'>
//                                           <span><strong>{item.companyName}</strong></span><br />
//                                           <span style={{ fontStyle: 'italic' }}>{item.address}</span>
//                                         </td>
//                                         <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
//                                         <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>

//                                         <td>
//                                           <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
//                                             <DropdownToggle>
//                                               <img src={MenuButton} />
//                                             </DropdownToggle>
//                                             <DropdownMenu>
//                                               <DropdownItem
//                                                 onClick={() => {
//                                                   this.toggleModal('viewModal');
//                                                   this.handleOpenEdit(item.id);
//                                                 }}
//                                               >
//                                                 Xem
//                                               </DropdownItem>
//                                               <DropdownItem divider />
//                                               <DropdownItem
//                                                 onClick={() => {
//                                                   this.toggleModal('warningPopupModal');
//                                                   this.setState({ comfirmItem: item.id });
//                                                 }}
//                                               >
//                                                 Duyệt
//                                               </DropdownItem>
//                                               <DropdownItem divider />
//                                               <DropdownItem
//                                                 onClick={() => {
//                                                   this.toggleModal('updateModal');
//                                                   this.handleOpenEdit(item.id);
//                                                 }}
//                                               >
//                                                 Không duyệt
//                                               </DropdownItem>
//                                             </DropdownMenu>
//                                           </ButtonDropdown>
//                                         </td>
//                                       </tr>
//                                     ))
//                                 )
//                               }
//                             </tbody>
//                           </Table>) : (
//                           <Table className="align-items-center tablecs" responsive style={{}}>
//                             <HeadTitleTable headerTitle={headerTitle}
//                               classHeaderColumns={{
//                                 0: 'table-scale-col table-user-col-1'
//                               }}
//                             />
//                             <tbody ref={ref => this.tableBody = ref}>
//                               {
//                                 Array.isArray(data) && (
//                                   data
//                                     .filter((item, key) => key >= beginItem && key < endItem)
//                                     .map((item, key) => (
//                                       <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length), height: totalPage == 1 ? 75 : 'auto' }}>
//                                         <td className='table-scale-col table-user-col-1'>{item.index}</td>
//                                         <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
//                                         {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
//                                         <td style={{ textAlign: 'left' }} className='table-scale-col'>
//                                           <span><strong>{item.companyName}</strong></span><br />
//                                           <span style={{ fontStyle: 'italic' }}>{item.address}</span>
//                                         </td>
//                                         <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
//                                         <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
//                                         {/* <td style={{ textAlign: 'left' }}>{item.address}</td> */}
//                                         {/* <td>
//                                         <div className={classes.editArea}>
//                                           <div className={classes.item}><img src={ViewIcon} alt="Xem" title="Xem" width="25" height="25" /></div>

//                                           <div className={classes.item}
//                                             onClick={() => {
//                                               this.toggleModal('warningPopupModal');
//                                               this.setState({ comfirmItem: item.id });
//                                             }}
//                                           >
//                                             <img src={ComfirmIcon} alt="Duyệt" title="Duyệt" />
//                                           </div>

//                                           <div className={classes.item}
//                                             onClick={() => {
//                                               this.toggleModal('updateModal');
//                                               this.handleOpenEdit(item.id);
//                                             }}
//                                           >
//                                             <img src={UnComfirmIcon} alt="Không duyệt" title="Không duyệt" />
//                                           </div>
//                                         </div>
//                                       </td> */}
//                                         <td>
//                                           {isDisableConfirm == true && isDisableUnConfirm == true ? null : (
//                                             <ButtonDropdown isOpen={item.collapse}
//                                               toggle={() => {
//                                                 this.toggle(key, item.id);
//                                                 this.setState({ itemIdView: item.id })
//                                               }}>
//                                               <DropdownToggle>
//                                                 <img src={MenuButton} />
//                                               </DropdownToggle>
//                                               <DropdownMenu>

//                                                 <DropdownItem
//                                                   onClick={() => {
//                                                     this.toggleModal('viewModal');
//                                                     this.handleOpenEdit(item.id);
//                                                   }}
//                                                 >
//                                                   Xem
//                                                 </DropdownItem>
//                                                 {isDisableConfirm == true && isDisableUnConfirm == true ? null : (
//                                                   <DropdownItem divider />
//                                                 )}
//                                                 {isDisableConfirm == false ? (
//                                                   <DropdownItem
//                                                     onClick={() => {
//                                                       this.toggleModal('warningPopupModal');
//                                                       this.setState({ comfirmItem: item.id });
//                                                     }}
//                                                   >
//                                                     Duyệt
//                                                   </DropdownItem>
//                                                 ) : null}
//                                                 {isDisableConfirm == true || isDisableUnConfirm == true ? null : (
//                                                   <DropdownItem divider />
//                                                 )
//                                                 }
//                                                 {isDisableUnConfirm == false ? (
//                                                   <DropdownItem
//                                                     onClick={() => {

//                                                       this.toggleModal('updateModal');
//                                                       this.handleOpenEdit(item.id);
//                                                     }}
//                                                   >
//                                                     Không duyệt
//                                                   </DropdownItem>
//                                                 ) : null}
//                                               </DropdownMenu>
//                                             </ButtonDropdown>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))
//                                 )
//                               }
//                             </tbody>
//                           </Table>
//                         )}
//                       </Card>

//                       {/* Pagination */}
//                       {/* { 
//                         typeof(hookPagination) === 'undefined' ? (
//                           // Page of Table
//                           Array.isArray(data) (
//                             <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
//                           )
//                         ) : (
//                           hookPagination && (
//                             // Page of Table
//                             Array.isArray(data) (
//                               <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
//                             )
//                           )
//                         )
//                       } */}
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
//               <WarningPopup
//                 moduleTitle='Thông báo'
//                 moduleBody={
//                   <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
//                     Bạn đồng ý duyệt thông tin này?
//                   </p>}
//                 warningPopupModal={warningPopupModal}
//                 toggleModal={this.toggleModal}
//                 handleWarning={this.handleComfirmRow}
//               />
//               {
//                 detail !== null && (
//                   <UpdatePopup
//                     moduleTitle='Thông báo'
//                     moduleBody={
//                       <UnComfirmModal
//                         data={detail}
//                         errorMessagesUn={errorMessagesUn}
//                         handleCheckValidation={this.handleCheckValidation}
//                         handleNewData={this.handleNewData}
//                       />}
//                     newData={newData}
//                     updateModal={updateModal}
//                     toggleModal={this.toggleModal}
//                     activeSubmit={activeCreateSubmit}
//                     handleUpdateInfoData={this.componentUnComfirmMount}
//                   />
//                 )
//               }
//               {
//                 detailView !== null && (
//                   <ViewPopup
//                     moduleTitle='Xem thông tin'
//                     moduleBody={
//                       <ViewModal
//                         data={detail}
//                         fileUpdate={fileUpdate}
//                         handleCheckValidation={this.handleCheckValidation}
//                         handleNewData={this.handleNewData}
//                       />}
//                     newData={newData}
//                     viewModal={viewModal}
//                     componentFooter={
//                       <div className="modal-footer" style={{ marginRight: '-20px' }}>
//                         <div>
//                           <Button
//                             color="success"
//                             type="button"
//                             className={`btn-success-cs`}
//                             style={{ marginRight: '26px !important', }}
//                             onClick={() => {
//                               this.toggleModal('warningPopupModal');
//                               this.setState({ comfirmItem: this.state.itemIdView })
//                             }}
//                           >
//                             <img src={Duyet} alt='Duyệt' />
//                             <span>Duyệt</span>
//                           </Button>
//                         </div>
//                         <div>
//                           <Button
//                             color="default"
//                             type="button"
//                             style={{ backgroundColor: '#FF3333' }}
//                             className={`btn-danger-cs`}
//                             onClick={() => {
//                               this.toggleModal('updateModal');
//                               this.handleOpenEdit(this.state.itemIdView);
//                               this.toggleModal('viewModal');
//                             }}
//                           >
//                             <img src={Kduyet} alt='Không duyệt' />
//                             <span>Không duyệt</span>
//                           </Button>
//                         </div>
//                       </div>
//                     }
//                     toggleModal={this.toggleModal}
//                     activeSubmit={activeCreateSubmit}
//                     handleUpdateInfoData={this.componentExtend}
//                   />
//                 )
//               }
//               {errmessage != '' ? (
//                 <PopupMessage
//                   popupMessage={popupMessage}
//                   moduleTitle={'Thông báo'}
//                   moduleBody={message}
//                   toggleModal={this.toggleModal}
//                 />
//               ) : null}
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
//     company: state.CompanyAwaitStore,
//     field: state.FieldStore,
//     details: state.CompanyGetDetailsStore,
//     location: state.LocationStore,
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     ...bindActionCreators(actionGetListCompanyAwait, dispatch),
//     ...bindActionCreators(actionField, dispatch),
//     ...bindActionCreators(actionCompanyGetDetails, dispatch),
//     ...bindActionCreators(actionLocationCreators, dispatch)
//   }
// }
// export default compose(
//   // withStyles(useStyles),
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )
// )(CompanyAwait);

import React, { Component, useState } from "react";

import { bindActionCreators } from "redux";
import PopupMessage from "../../../components/PopupMessage";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGetListCompanyAwait } from "../../../actions/CompanyAwaitActions";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { COMPANY_AWAIT_HEADER, COMPANY_AWAIT_HEADER_SEARCH } from "../../../helpers/constant";
import Kduyet from "assets/img/buttons/KhongDuyet.svg";
import Duyet from "assets/img/buttons/duyetbt.svg";
import ViewModal from "./ViewModal";
import './companyAwait.css';
import Select from "components/Select";
import { actionGetListNewly } from "../../../actions/NewRegBusAction"
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
//import Table from "../../../components/Table/Table";
import ConfirmButton from "../../../assets/img/buttons/confirm.png";
import UnConfirmButton from "../../../assets/img/buttons/unconfirm.png";
import XEM from "../../../assets/img/buttons/XEM.png";
//import Button from '@material-ui/core/Button';
import { PLEASE_CHECK_CONNECT, ACCOUNT_ID } from "../../../services/Common";
//import Select from "../../../components/Select";
import moment from 'moment';
//import UnComfirmCompany from './UnComfirmCompany';
//import Comfirm from "./ComfirmCompany.js";
//import Details from "./Details";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import HeaderChild from "components/Headers/HeaderChild.js";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
import UnComfirmIcon from "../../../assets/img/buttons/unconfirm.png";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import SearchModal from "./SearchModal";
import DeleteConfirm from "./DeleteConfirm";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import WarningPopup from "../../../components/WarningPopup";

import UnComfirmModal from "./UnComfirmModal";
import UpdatePopup from "../../../components/UpdatePopup";
import UpdatePopup2 from "../../../components/UpdatePopup2";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import WarningPopupDel from "../../../components/WarningPopupDel";
import MenuButton from "../../../assets/img/buttons/menu.png";
import ViewPopup from "../../../components/ViewPopup";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  Button,
  InputGroup,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";


class CompanyAwait extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fileUpdate: [],
      field: [],
      province: [],
      district: [],
      ward: [],
      errorMessagesUn: {},
      detail: null,
      detailView: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openCOM: false,
      openXEM: false,
      comfirm: null,
      xem: null,
      company: null,
      //openUnComfirm: false,
      message: '',
      history: [],
      // dataMaping: [
      //   'index', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address',
      // ],
      searchData: [],

      filterList: [],
      checkAtive: [{}],
      company: [],
      typeAlign: [{ type: 'number', position: [3, 4] }],
      headerTitle: COMPANY_AWAIT_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "fieldID": "",
        "comapanyName": "",
        "taxCode": "",
        "phone": "",
        "email": "",
        "provinceID": "",
        "districtID": "",
        "wardID": "",
        "orderBy": "",
        "page": null,
        "limit": null,

      },
      comfirmItem: null,
      dropdownOpen: false,
      warningPopupModal: false,
      activeCreateSubmit: false,
      newData: [],
      fetchingUnComfirm: false,
      deleteConfirm: false
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    const { fetchingUnComfirm } = this.state;
    const { requestCompanyAwaitListStore } = nextProp;

    let fieldData = nextProp.field.data;
    let detailsData = nextProp.details.data;

    let locationData = nextProp.location.data;
    const { limit } = this.state;

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.company) !== 'undefined') {
          if (data.company !== null) {
            if (typeof (data.company.companies) !== 'undefined') {
              data.company.companies.map((item, key) => {
                item['index'] = key + 1
                item['collapse'] = false
                // item['confirmedDate']=moment(item.confirmedDate).format('DD/MM/YYYY')

              });
              let totalElement = 0;

              if (data.company.companies.length > limit) {
                totalElement = limit;
              } else {
                totalElement = data.company.companies.length;
              }

              this.setState({
                totalElement,
                data: data.company.companies,
                company: data.company.companies,
                listLength: data.company.companies.length,
                totalPage: Math.ceil(data.company.companies.length / limit),
                isLoaded: data.isLoading, status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.company.companies,
                company: data.company.companies,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

      }
    }


    // if (typeof (detailsData) !== 'undefined') {
    //   if (detailsData.details !== null) {
    //     if (typeof (detailsData.details) !== 'undefined') {
    //       this.setState({
    //         xem: detailsData.details,
    //         detail: detailsData.details,
    //         detailView: detailsData.details,
    //         isLoaded: false,
    //         status: data.status,
    //         message: PLEASE_CHECK_CONNECT(data.message)
    //       });
    //     } else {
    //       this.setState({
    //         xem: detailsData.details,
    //         isLoaded: false,
    //         status: data.status,
    //         message: PLEASE_CHECK_CONNECT(data.message)
    //       });
    //     }
    //   }


    // if (detailsData.fileUpdate !== null) {
    //   if (typeof (detailsData.fileUpdate) !== 'undefined') {
    //     this.setState({
    //       fileUpdate: detailsData.fileUpdate,
    //       isLoaded: false,
    //       status: data.status,
    //       message: PLEASE_CHECK_CONNECT(data.message)
    //     });
    //   } else {
    //     this.setState({
    //       fileUpdate: detailsData.fileUpdate,
    //       isLoaded: false,
    //       status: data.status,
    //       message: PLEASE_CHECK_CONNECT(data.message)
    //     });
    //   }
    // }
    // }


    if (typeof (data.uncomfirm) !== 'undefined') {

      if (data.status && !fetchingUnComfirm) {
        this.setState({ data: [] });
        requestCompanyAwaitListStore(JSON.stringify({
          "fieldID": "",
          "comapanyName": "",
          "taxCode": "",
          "phone": "",
          "email": "",
          "provinceID": "",
          "districtID": "",
          "wardID": "",
          "orderBy": "",
          "page": null,
          "limit": null,
        }))
        this.setState({ fetchingUnComfirm: true });
      }

    }

    // if (typeof (data.detail) !== 'undefined') {
    //   if (data.detail !== null) {
    //     if (data.status) {
    //       this.setState({ xem: null });
    //       this.setState({
    //         xem: data.detail,
    //         isLoaded: false,
    //         status: data.status,
    //         message: PLEASE_CHECK_CONNECT(data.message)
    //       });
    //     } else {
    //       this.setState({
    //         xem: [],
    //         isLoaded: false,
    //         status: data.status,
    //         message: PLEASE_CHECK_CONNECT(data.message)
    //       });
    //     }
    //   }
    // }


    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.fieldCompanyAwait !== null) {
          if (typeof (fieldData.fieldCompanyAwait) !== 'undefined') {
            this.setState({
              field: fieldData.fieldCompanyAwait.fields,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              field: fieldData.fieldCompanyAwait,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }
    if (locationData !== this.state.province) {
      if (typeof (locationData) !== 'undefined') {
        if (typeof (locationData.province) !== 'undefined') {

          if (locationData.province !== null) {

            this.setState({
              province: locationData.province,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              province: [],
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (locationData !== this.state.district) {
      if (typeof (locationData) !== 'undefined') {
        if (typeof (locationData.district) !== 'undefined') {
          if (locationData.district !== null) {
            this.setState({
              district: locationData.district,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              district: [],
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (locationData !== this.state.ward) {

      if (typeof (locationData) !== 'undefined') {

        // if (typeof (locationData.ward) !== 'undefined') {
        if (locationData.ward !== null) {

          this.setState({ ward: [] })
          this.setState({
            ward: locationData.ward,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        } else {
          this.setState({
            ward: [],
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        }
        //}
      }
    }
  }

  getId = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryComfirm(
        value.id,
      )
    }
    //window.location.reload(true);

  }
  getIdXem = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryXem(
        value.id,
      )
    }
    //window.location.reload(true);

  }

  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  componentWillMount() {
    const { requestFieldCompanyAwaitStore } = this.props;
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    //const { requestCompanyGetDetails } = this.props;
    //const { getWardList } = this.props;
    const { filter } = this.state;

    // requestFieldCompanyAwaitStore(JSON.stringify({
    //   "search": "",
    //   "filter": "",
    //   "orderBy": "",
    //   "page": null,
    //   "limit": null
    // }));

    getProvinceList();
    getDistrictList();
    //getWardList('558');
    // requestCompanyGetDetails('54.b1bb9c62-f001-4641-93d1-72899e63c6f4');
  }

  componentUnComfirmMount = (value) => {
    let { data } = this.state;
    const { requestCompanyUnComfirmStore } = this.props;

    const errorMessagesUn = {};

    this.setState(previousState => {
      return {
        ...previousState,
        errorMessagesUn
      }
    });
    const createData = JSON.stringify({
      id: value.id,
      reason: value.reason
    })
    this.handleClose(true);
    // this.toggleModal('updateModal')

    if (!value.reason) {
      errorMessagesUn['reason'] = 'Lý do không được để trống';
    }

    if (Object.keys(errorMessagesUn).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorMessagesUn
        }
      });
      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate: {},
        errorMessagesUn: {},
        detail: null,
        updateModal: false
      }
    });

    requestCompanyUnComfirmStore(createData)
    this.setState({ fetchingUnComfirm: false })


    //window.location.reload(true);
  }

  componentDidMount() {
    // This method is called when the component is first added to the document
    //this.filterMapKey();

    /* Fetch Summary */

    this.fetchSummary(JSON.stringify({
      "fieldID": "",
      "comapanyName": "",
      "taxCode": "",
      "phone": "",
      "email": "",
      "provinceID": "",
      "districtID": "",
      "wardID": "",
      "orderBy": "",
      "page": null,
      "limit": null,
    }));
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestCompanyAwaitListStore } = this.props;

    requestCompanyAwaitListStore(data);

  }

  fetchSummaryComfirm = (id) => {
    const { requestCompanyComfirmStore } = this.props;

    requestCompanyComfirmStore(id);
  }

  fetchSummaryXem = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }

  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }
  // filterMapKey = () => {
  //   let { dataMaping, filterList } = this.state;
  //   let newFilterMap = [];

  //   dataMaping.filter((item, key) => {
  //     typeof (filterList[key]) !== 'undefined' && (
  //       newFilterMap.push({ index: key, value: filterList[key] })
  //     )
  //   });

  //   filterList = [];
  //   this.setState({ filterList: newFilterMap });
  // }
  searchTable = (event) => {
    let { data, history } = this.state;
    let value = event.target.value.trim();

    if (value.length === 0) {
      data = data.filter(item => item['companyName'] !== null);
    }
    else {
      data = data.filter(item =>
        item['companyName'] !== null && item['companyName'].toLowerCase().includes(value)
      );
    }

    this.setState({ searchData: data });
  }

  handleComfirmRow = () => {
    const { requestCompanyComfirmStore, requestCompanyAwaitListStore } = this.props;
    let { data, comfirmItem } = this.state;
    let newData = data.filter(item => item.id === comfirmItem).map((item, key) => {
      item.status = 0
    });

    requestCompanyComfirmStore(comfirmItem)
      .then(res => {
        if (res.status == 200) {
          requestCompanyAwaitListStore(JSON.stringify({
            "fieldID": "",
            "comapanyName": "",
            "taxCode": "",
            "phone": "",
            "email": "",
            "provinceID": "",
            "districtID": "",
            "wardID": "",
            "orderBy": "",
            "page": null,
            "limit": null,
          }))
          this.toggleModal('viewModal')
        } else {
          this.setState({
            comfirm: [],
            isLoading: true,
            status: false,
            message: PLEASE_CHECK_CONNECT(res.message) || 'Duyệt công ty thất bại',
            errmessage: PLEASE_CHECK_CONNECT(res.message) || 'Duyệt công ty thất bại'
          });
          this.toggleModal('popupMessage')
        }
      })
      .catch(err => (
        this.setState({
          comfirm: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message) || 'Duyệt công ty thất bại'
        })
      ));
  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev['name']] = ev['value'];

    this.setState({ data });
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handleNewData = (data) => {
    this.setState({ newData: data });
  }
  // buttonAcitveArea = (ele) => {
  //   const { classes } = this.props;
  //   const { open, openCOM, openXEM, xem } = this.state;
  //   
  //   return (
  //     <div className={classes.editArea}>

  //       <div className='edit-item' onClick={() => {

  //         this.getIdXem(ele.id);
  //         this.handleCloseXEM(true);
  //         //this.setState({ xem: ele });
  //       }}
  //         open={openXEM}
  //       >
  //         <img src={XEM} alt='xem' title='Xem' style={{ with: 25, height: 25 }} />
  //       </div>

  //       <div className='edit-item' onClick={() => {
  //         this.handleCloseCOM(true);
  //         this.setState({ comfirm: ele });

  //       }}
  //         open={openCOM}
  //       >
  //         <img src={ConfirmButton} alt='duyet' title='Duyệt' />
  //       </div>

  //       <div className='edit-item' onClick={() => {
  //         this.handleClose(true);
  //         this.setState({ detail: ele });
  //       }}
  //       >
  //         <img src={UnConfirmButton} alt='khong duyet' title='Không duyệt' />
  //       </div>
  //     </div>
  //   );
  // }
  // toggleModal = (state) => {
  //   this.setState({
  //     [state]: !this.state[state],
  //     detail: null
  //   });
  // };
  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        detailView: null,
        errorMessagesUn: {},
        newData: {},
        mfileImg: '',
        fileImage: '',
        xem: null
      });
    }
  };

  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      "fieldID": "",
      "comapanyName": "",
      "taxCode": "",
      "phone": "",
      "email": "",
      "provinceID": "",
      "districtID": "",
      "wardID": "",
      "orderBy": "",
      "page": null,
      "limit": null,
    }
    this.setState({ filter: clearFilter })
  }

  handleStatus = (event) => {
    for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
      document.getElementsByClassName('checkbox-status')[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  }

  handleSelect = (value, name) => {
    let { filter } = this.state;
    //const { getWardList } = this.props;
    filter[name] = value;
    this.setState({ filter });
    //getWardList(filter.districtID)

  }

  handleSelectWard = (value, name) => {
    let { filter } = this.state;
    const { getWardList } = this.props;
    filter[name] = value;

    this.setState({ filter });
    getWardList(filter.districtID);
  }

  handleCloseXEM = (value) => {
    const { openXEM } = this.state;

    this.setState({ openXEM: value });
  }

  handleCloseCOM = (value) => {
    const { openCOM } = this.state;

    this.setState({ openCOM: value });
  }

  handleSelectJob = (event) => {
    let { data, field, company } = this.state;
    let fieldNameCurrent = null;

    // Get all
    if (Number(event.target.value) === -1) {
      data = company;
    } else {
      field.filter(item => item.id === event.target.value)
        .map(item => (
          fieldNameCurrent = item.fieldName
        ));

      Array.isArray(company) ? (
        data = company.filter(item =>
          item.fieldName === fieldNameCurrent
        ).map(item => item = item)
      ) : (
        data = company
      )
    }

    this.setState({ data });
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
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

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }
  handleOpenEdit = (id) => {
    let { fileUpdate } = this.state;
    this.setState({ xem: null })
    const { requestCompanyGetDetails, requestCompanyGetFileUpdate } = this.props;
    requestCompanyGetFileUpdate(id).then((res) => {
      if (((res || {}).data || {}).status === 200) {
        let listXXX = res.data.data;
        listXXX.map(list => {
          if (list.uploadDate) {
            list.sorted_file = list.uploadDate;
          } else {
            list.sorted_file = list.registeredDate;
          }
        })
        let sorted_file = listXXX.sort((a, b) => {
          return new Date(a.sorted_file).getTime() -
            new Date(b.sorted_file).getTime()
        }).reverse();
        this.setState({ fileUpdate: sorted_file })
      }
    })
    requestCompanyGetDetails(id).then(res => {
      if (res.data.status == 200) {
        this.setState({
          xem: res.data.data,
          detail: res.data.data,
          detailView: res.data.data,
          isLoaded: false,
        })
      }
      // if (typeof (detailsData) !== 'undefined') {
      //   if (detailsData.details !== null) {
      //     if (typeof (detailsData.details) !== 'undefined') {
      //       this.setState({
      //         xem: detailsData.details,
      //         detail: detailsData.details,
      //         detailView: detailsData.details,
      //         isLoaded: false,
      //         status: data.status,
      //         message: PLEASE_CHECK_CONNECT(data.message)
      //       });
      //     } else {
      //       this.setState({
      //         xem: detailsData.details,
      //         isLoaded: false,
      //         status: data.status,
      //         message: PLEASE_CHECK_CONNECT(data.message)
      //       });
      //     }
      //   }
      // }
    });
  }

  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.clearFilter();
    this.fetchSummary(JSON.stringify(filter));
  }

  handleNewDataDelete = (data, mfileImg, fileImage) => {

    this.setState({ newData: data, mfileImg: mfileImg, fileImage: fileImage });
  }

  handleDeleteCompanyAwait = () => {
    const { idDelete, newData, mfileImg, fileImage } = this.state;
    const { deleteCompayAwait } = this.props;
    const formData = new FormData();
    const errorUpdate = {};

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });

    if (((mfileImg || []).length <= 0 || mfileImg == null) && ((fileImage || []).length <= 0 || fileImage == null)) {
      errorUpdate.file = 'Hồ sơ không được bỏ trống'
    }
    if (!newData.ReasonDeleted) {
      errorUpdate.ReasonDeleted = 'Lý do  không được bỏ trống'
    }

    formData.append('ID', idDelete);
    formData.append('ReasonDeleted', newData.ReasonDeleted ? newData.ReasonDeleted : '');
    formData.append('FileDeleted', fileImage ? fileImage : '');
    if (mfileImg) {
      for (let i = 0; i < mfileImg.length; i++) {
        formData.append(`FileDeletedFiles`, mfileImg[i])
      }
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

    if (idDelete) {
      deleteCompayAwait(formData).then(res => {

        if (res.data.status == 200) {
          this.fetchSummary(JSON.stringify({
            "fieldID": "",
            "comapanyName": "",
            "taxCode": "",
            "phone": "",
            "email": "",
            "provinceID": "",
            "districtID": "",
            "wardID": "",
            "orderBy": "",
            "page": null,
            "limit": null,
          }));
          this.toggleModal('updateModal2');
        } else {
          this.setState({ message: res.data.message });
          this.toggleModal('popupMessage')
        }
      })
    }
  }

  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle, heightdashboard } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      open,
      detail,
      field,
      openCOM,
      comfirm,
      openXEM,
      xem,
      headerTitle,
      typeAlign,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      province,
      district,
      ward,
      warningPopupModal,
      activeCreateSubmit,
      newData,
      updateModal,
      detailView,
      viewModal,
      popupMessage,
      errmessage,
      errorMessagesUn,
      fileUpdate,
      warningPopupDelModal,
      itemDataView,
      updateModal2,
      errorUpdate
    } = this.state;
    const statusPopup = { status: status, message: message };
    let isDisableConfirm = true;
    let isDisableUnConfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
      isDisableUnConfirm = false;

    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "ConfirmingCompanies.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "ConfirmingCompanies.Unconfirm").map(y => isDisableUnConfirm = false)
    }

    return (
      <>
        {
          <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
            <Container fluid className={typeof (hookSpacing) !== 'undefined' && hookSpacing}>
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
                            "fieldID": "",
                            "comapanyName": "",
                            "taxCode": "",
                            "phone": "",
                            "email": "",
                            "provinceID": "",
                            "districtID": "",
                            "wardID": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null,
                          }))}
                        hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
                        hideCreate={true}
                        hideSearch={true
                          // typeof (hideSearch) !== 'undefined' && (
                          //   hideSearch && true
                          // )
                        }
                        typeSearch={
                          <>
                            <div className="div_flex w_div_100 flex-div_search margin_right_div_search" >
                              <div className="mg-div-search w_input ">
                                <label className="form-control-label">Ngành nghề</label>
                                <div>
                                  <Select
                                    name="fieldID"
                                    defaultValue={filter.fieldID}
                                    title='Chọn ngành nghề'
                                    data={field}
                                    labelName='fieldName'
                                    val='id'
                                    handleChange={this.handleSelect}
                                  />
                                </div>
                              </div>
                              <div className="mg-div-search w_input ">
                                <label className="form-control-label">Tên doanh nghiệp</label>
                                <div>
                                  <InputGroup className="input-group-alternative css-border-input">
                                    <Input
                                      placeholder="Tên doanh nghiệp"
                                      name="comapanyName"
                                      value={filter.comapanyName}
                                      onChange={(event) => this.handleChangeFilter(event)}
                                      type="text"
                                    />
                                  </InputGroup>
                                </div>
                              </div>
                              <div className="mg-div-search w_input ">
                                <label className="form-control-label">Mã số thuế</label>
                                <div>
                                  <InputGroup className="input-group-alternative css-border-input">
                                    <Input
                                      placeholder="Mã số thuế"
                                      type="number"
                                      name="taxCode"
                                      value={filter.taxCode}
                                      onChange={(event) => this.handleChangeFilter(event)}
                                    />
                                  </InputGroup>
                                </div>
                              </div>
                              <div className="mg-btn">
                                <label className="form-control-label">&nbsp;</label>
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
                            </div>
                          </>
                        }
                        searchForm={
                          <SearchModal
                            filter={filter}
                            field={field}
                            district={district}
                            province={province}
                            ward={ward}
                            handleChangeFilter={this.handleChangeFilter}
                            handleStatus={this.handleStatus}
                            handleSelect={this.handleSelect}
                            handleSelectWard={this.handleSelectWard}
                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        {heightdashboard == true ? (
                          <Table className="align-items-center tablecs table-css-CompanyAwait" responsive style={{ height: 300 }}>
                            <HeadTitleTable headerTitle={headerTitle}
                              classHeaderColumns={{
                                0: 'table-scale-col table-user-col-1'
                              }}
                            />

                            <tbody ref={ref => this.tableBody = ref}>
                              {
                                Array.isArray(data) && (
                                  data
                                    .filter((item, key) => key >= beginItem && key < endItem)
                                    .map((item, key) => (
                                      <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
                                        <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                        <td className='table-scale-col' style={{ textAlign: 'center' }}>
                                          {item.status === 0 ? (<>
                                            <span className={classes.noActiveStt}>Chưa duyệt</span>
                                          </>) : ''}
                                          {item.status === 4 ? (<>
                                            <span className={classes.activeStt}>Chờ bổ sung</span>
                                          </>) : ''}
                                        </td>
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                        {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                          <span><strong>{item.companyName}</strong></span><br />
                                          <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                        <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>

                                        <td>
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('viewModal');
                                                  this.handleOpenEdit(item.id);
                                                }}
                                              >
                                                Xem
                                              </DropdownItem>
                                              <DropdownItem divider />
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('warningPopupModal');
                                                  this.setState({ comfirmItem: item.id });
                                                }}
                                              >
                                                Duyệt
                                              </DropdownItem>
                                              <DropdownItem divider />
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('updateModal');
                                                  this.handleOpenEdit(item.id);
                                                }}
                                              >
                                                Không duyệt
                                              </DropdownItem>
                                            </DropdownMenu>
                                          </ButtonDropdown>
                                        </td>
                                      </tr>
                                    ))
                                )
                              }
                            </tbody>
                          </Table>) : (
                          <Table className="align-items-center tablecs table-css-companyAwait" responsive style={{}}>
                            <HeadTitleTable headerTitle={headerTitle}
                              classHeaderColumns={{
                                0: 'table-scale-col table-user-col-1'
                              }}
                            />
                            <tbody ref={ref => this.tableBody = ref}>
                              {
                                Array.isArray(data) && (
                                  data
                                    .filter((item, key) => key >= beginItem && key < endItem)
                                    .map((item, key) => (
                                      <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length), height: totalPage == 1 ? 75 : 'auto' }} className="table-hover-css">
                                        <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                        <td className='table-scale-col' style={{ textAlign: 'center' }}>
                                          {item.status === 0 ? (<>
                                            <span className={classes.noActiveStt}>Chờ duyệt</span>
                                          </>) : ''}
                                          {item.status === 4 ? (<>
                                            <span className={classes.activeStt}>Chờ bổ sung</span>
                                          </>) : ''}

                                        </td>
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                        {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                          <span><strong>{item.companyName}</strong></span><br />
                                          <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                        <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                        {/* <td style={{ textAlign: 'left' }}>{item.address}</td> */}
                                        {/* <td>
                                        <div className={classes.editArea}>
                                          <div className={classes.item}><img src={ViewIcon} alt="Xem" title="Xem" width="25" height="25" /></div>

                                          <div className={classes.item}
                                            onClick={() => {
                                              this.toggleModal('warningPopupModal');
                                              this.setState({ comfirmItem: item.id });
                                            }}
                                          >
                                            <img src={ComfirmIcon} alt="Duyệt" title="Duyệt" />
                                          </div>

                                          <div className={classes.item}
                                            onClick={() => {
                                              this.toggleModal('updateModal');
                                              this.handleOpenEdit(item.id);
                                            }}
                                          >
                                            <img src={UnComfirmIcon} alt="Không duyệt" title="Không duyệt" />
                                          </div>
                                        </div>
                                      </td> */}
                                        <td>
                                          {isDisableConfirm == true && isDisableUnConfirm == true ? null : (
                                            <ButtonDropdown isOpen={item.collapse}
                                              toggle={() => {
                                                this.toggle(key, item.id);
                                                this.setState({ itemIdView: item.id, itemDataView: item })
                                              }}>
                                              <DropdownToggle>
                                                <img src={MenuButton} />
                                              </DropdownToggle>
                                              <DropdownMenu>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal('viewModal');
                                                    this.handleOpenEdit(item.id);
                                                  }}
                                                >
                                                  Xem
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal('updateModal2');
                                                    this.setState({ idDelete: item.id })
                                                  }}
                                                >
                                                  Xóa
                                                </DropdownItem>

                                                {/* {isDisableConfirm == true && isDisableUnConfirm == true ? null : (
                                                  <DropdownItem divider />
                                                )}
                                                {isDisableConfirm == false ? (
                                                  <DropdownItem
                                                    onClick={() => {
                                                      this.toggleModal('warningPopupModal');
                                                      this.setState({ comfirmItem: item.id });
                                                    }}
                                                  >
                                                    Duyệt
                                                  </DropdownItem>
                                                ) : null}
                                                {isDisableConfirm == true || isDisableUnConfirm == true ? null : (
                                                  <DropdownItem divider />
                                                )
                                                }
                                                {isDisableUnConfirm == false ? (
                                                  <DropdownItem
                                                    onClick={() => {

                                                      this.toggleModal('updateModal');
                                                      this.handleOpenEdit(item.id);
                                                    }}
                                                  >
                                                    Không duyệt
                                                  </DropdownItem>
                                                ) : null}*/}
                                              </DropdownMenu>
                                            </ButtonDropdown>
                                          )}
                                        </td>
                                      </tr>
                                    ))
                                )
                              }
                            </tbody>
                          </Table>
                        )}
                      </Card>

                      {/* Pagination */}
                      {/* { 
                        typeof(hookPagination) === 'undefined' ? (
                          // Page of Table
                          Array.isArray(data) (
                            <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
                          )
                        ) : (
                          hookPagination && (
                            // Page of Table
                            Array.isArray(data) (
                              <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
                            )
                          )
                        )
                      } */}
                      {
                        // Page of Table
                        Array.isArray(data) && (
                          data.length > 0 && (
                            <Pagination
                              data={data}
                              listLength={listLength}
                              totalPage={totalPage}
                              totalElement={totalElement}
                              handlePageClick={this.handlePageClick}
                            />
                          )
                        )
                      }
                    </div>
                  </Row>
                )
              }
              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    Bạn đồng ý duyệt thông tin này?
                  </p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleComfirmRow}
              />

              <UpdatePopup2
                moduleTitle='Xác nhận xoá'
                resize="md"
                moduleBody={
                  <DeleteConfirm
                    errorUpdate={errorUpdate}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataDelete}
                  />}
                newData={newData}
                updateModal2={updateModal2}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleDeleteCompanyAwait}
              />

              {
                detail !== null && (
                  <UpdatePopup
                    moduleTitle='Thông báo'
                    moduleBody={
                      <UnComfirmModal
                        data={detail}
                        errorMessagesUn={errorMessagesUn}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    updateModal={updateModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentUnComfirmMount}
                  />
                )
              }
              {
                (detailView) && (
                  <ViewPopup
                    moduleTitle='Xem thông tin'
                    moduleBody={
                      <ViewModal
                        itemDataView={itemDataView}
                        data={detail}
                        fileUpdate={fileUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    viewModal={viewModal}
                    componentFooter={
                      <div>{(isDisableConfirm == false && isDisableUnConfirm == false) ? (
                        <div className="modal-footer" style={{ marginRight: '-20px' }}>
                          {xem && (
                            <>
                              {isDisableConfirm == false && xem.status != 4 ? (
                                <div>
                                  <Button
                                    color="success"
                                    type="button"
                                    className={`btn-success-cs`}
                                    style={{ marginRight: '26px !important', }}
                                    onClick={() => {
                                      this.toggleModal('warningPopupModal');
                                      this.setState({ comfirmItem: this.state.itemIdView })
                                    }}
                                  >
                                    <img src={Duyet} alt='Duyệt' />
                                    <span>Duyệt</span>
                                  </Button>
                                </div>
                              ) : null}
                              {isDisableUnConfirm == false && xem.status != 4 ? (
                                <div>
                                  <Button
                                    color="default"
                                    type="button"

                                    className={`btn-notyet-cs`}
                                    onClick={() => {
                                      this.toggleModal('updateModal');
                                      this.handleOpenEdit(this.state.itemIdView);
                                      this.toggleModal('viewModal');
                                    }}
                                  >
                                    <img src={Kduyet} alt='Không duyệt' />
                                    <span>Không duyệt</span>
                                  </Button>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      ) : null}</div>
                    }
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
                  />
                )
              }
              {message != '' ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={message}
                  toggleModal={this.toggleModal}
                />
              ) : null}
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


    )
  }

}
const mapStateToProps = (state) => {
  return {
    company: state.CompanyAwaitStore,
    field: state.FieldStore,
    details: state.CompanyGetDetailsStore,
    location: state.LocationStore,
    newregbug: state.NewRegBusStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {

    ...bindActionCreators(actionGetListNewly, dispatch),
    ...bindActionCreators(actionGetListCompanyAwait, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionCompanyGetDetails, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch)
  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyAwait);