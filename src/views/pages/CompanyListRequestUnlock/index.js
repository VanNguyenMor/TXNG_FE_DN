import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionListRequestUnlock } from "../../../actions/CompanyListRequestUnlockActions";
import { actionField } from "../../../actions/FieldActions.js";
import { COMPANY_LIST_REQUEST_UNLOCK_HEADER, COMPANY_LIST_REQUEST_UNLOCK_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
//import Loader from "../../../components/Loader/Loader";
//import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";
import { addDays } from "../../../helpers/common";
import moment from 'moment';
//import Comfirm from "./ComfirmCompany.js";
import MenuButton from "../../../assets/img/buttons/menu.png";
import { actionPriceCreators } from "../../../actions/PricesListActions";
// import UnComfirmCompany from "./UnComfirmCompany.js";
// import Confirm from "../../../assets/images/buttons/confirm.png";
// import Unconfirm from "../../../assets/images/buttons/unconfirm.png";
import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
import UnComfirmIcon from "../../../assets/img/buttons/unconfirm.png";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import SearchModal from "./SearchModal";
import WarningPopup from "../../../components/WarningPopup";
import UpdatePopup from "../../../components/UpdatePopup";
import UnComfirmModal from "./UnComfirmModal";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyListRequestUnlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      price: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      uncomfirmCom: null,
      isLoaded: null,
      status: null,
      open: false,
      openUN: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'lockedDate', 'requestLockDate', 'fieldName', 'companyName', 'taxCode', 'phoneNumber',
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      ngayhethan: new Date(),
      headerTitle: COMPANY_LIST_REQUEST_UNLOCK_HEADER,
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
      fetchingUnComfirm: false,
      comfirm: null,
      activeCreateSubmit: false,
      newData: [],
      idRow: null
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    let fieldData = nextProp.field.data;
    let { ngayhethan } = this.state;
    const { limit } = this.state;
    //let priceDate = nextProp.price.data;
    const { requestListRequestUnlock } = nextProp;
    const { fetchingUnComfirm } = this.state;

    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {
            this.setState({
              field: fieldData.field.fields,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              field: fieldData.field,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.company) !== 'undefined') {
          if (data.company !== null) {
            if (typeof (data.company.companies) !== 'undefined') {
              data.company.companies.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                // item['lockedDate'] = moment(item.lockedDate).format('DD/MM/YYYY');
                // item['requestLockDate'] = moment(item.requestLockDate).format('DD/MM/YYYY');
                // //item['expiredDays'] = moment(addDays(ngayhethan, item['daysLeft'])).format('DD/MM/YYYY')
                // item['expiredDays'] = moment(item.expiredDate).format('DD/MM/YYYY')
              });
              this.setState({
                data: data.company.companies,
                history: data.company.companies,
                listLength: data.company.companies.length,
                totalPage: Math.ceil(data.company.companies.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({ data: data.company.companies, history: data.company.companies, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
            }
          }
        }
      }
    }

    if (typeof (data.uncomfirm) !== 'undefined') {
      //console.log(data.uncomfirm)

      if (data.status && !fetchingUnComfirm) {
        this.setState({ data: [] });
        requestListRequestUnlock(JSON.stringify({
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

    // if (priceDate !== this.state.price) {
    //   if (typeof (priceDate) !== 'undefined') {
    //     if (typeof (priceDate.prices) !== 'undefined') {
    //       if (priceDate.prices !== null) {
    //         this.setState({ price: priceDate.prices.prices, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //       } else {
    //         this.setState({ price: [], isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //       }
    //     }
    //   }
    // }
  }
  componentUnComfirmMount = (value) => {
    let { data, idRow } = this.state;
    const { requestUnComfirmRequestUnlock } = this.props;
    const createData = JSON.stringify({
      id: idRow,
      reason: value.reason
    })
    //this.handleCloseUN(true);
    requestUnComfirmRequestUnlock(createData);
    //window.location.reload(true);
  }
  componentWillMount() {
    const { requestFieldStore } = this.props;

    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
    // getAllPriceList(JSON.stringify({
    //   "search": "",
    //   "filter": "",
    //   "orderBy": "",
    //   "page": null,
    //   "limit": null
    // }));
  }

  componentDidMount() {
    // This method is called when the component is first added to the document
    this.filterMapKey();

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
    const { requestListRequestUnlock } = this.props;

    requestListRequestUnlock(data);
  }

  filterMapKey = () => {
    let { dataMaping, filterList } = this.state;
    let newFilterMap = [];

    dataMaping.filter((item, key) => {
      typeof (filterList[key]) !== 'undefined' && (
        newFilterMap.push({ index: key, value: filterList[key] })
      )
    });

    filterList = [];
    this.setState({ filterList: newFilterMap });
  }
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
  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }
  // componentExtend = (value, row) => {
  //   let { data } = this.state;

  //   const { requestComfirmRequestExtend } = this.props;


  //   const createData = JSON.stringify({
  //     id: value.id,
  //     year: row
  //   });

  //   this.handleClose(true);
  //   requestComfirmRequest-+(createData);
  //   console.log(createData);
  //   console.log(value);
  //   console.log(row);
  // }
  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }
  getId = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryComfirm(
        value.id,
      )
    }
    window.location.reload(true);
  }
  fetchSummaryComfirm = (id) => {
    const { requestComfirmRequestUnlock } = this.props;

    requestComfirmRequestUnlock(id);
  }
  handleCloseUN = (value) => {
    const { openUN } = this.state;

    this.setState({ openUN: value });
  }
  // buttonAcitveArea = (ele) => {
  //   const { classes } = this.props;
  //   const { open, openUN } = this.state;

  //   return (
  //     <div className={classes.editArea}>
  //       <div className='edit-item'

  //         onClick={() => {
  //           this.handleClose(true);
  //           this.setState({ detail: ele });
  //         }}
  //         open={open}
  //       >
  //         <img src={Confirm} alt='duyet' title='Duyệt' />
  //       </div>

  //       {/* <Button
  //         variant="contained"
  //         className={classes.btnSubmitActive}
  //         onClick={() => {
  //           if (window.confirm('Duyệt công ty này?')) {
  //             this.getId(ele)
  //           }
  //         }}
  //         open={open}
  //       >
  //         duyệt yêu cầu
  //       </Button> */}
  //       <div className='edit-item'
  //         onClick={() => {
  //           this.handleCloseUN(true);
  //           this.setState({ uncomfirmCom: ele });
  //         }}

  //         open={openUN}
  //       >
  //         <img src={Unconfirm} alt='khong duyet' title='Không duyệt' />
  //       </div>
  //     </div>
  //   );
  // }
  handleSelectJob = (event) => {
    let { data, field, history } = this.state;
    let fieldNameCurrent = null;

    // Get all
    if (Number(event.target.value) === -1) {
      data = history;
    } else {
      field.filter(item => item.id === event.target.value)
        .map(item => (
          fieldNameCurrent = item.fieldName
        ));

      Array.isArray(history) ? (
        data = history.filter(item =>
          item.fieldName === fieldNameCurrent
        ).map(item => item = item)
      ) : (
        data = history
      )
    }

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
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });

  }
  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.clearFilter();
    this.fetchSummary(JSON.stringify(filter));
  }
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
    getWardList(filter.districtID)

  }
  handleStatus = (event) => {
    for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
      document.getElementsByClassName('checkbox-status')[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  }
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
        errorUpdate: {}
      });
    }
  };
  handleComfirmRow = () => {
    const { requestComfirmRequestUnlock, requestListRequestUnlock } = this.props;
    let { data, comfirmItem } = this.state;
    let newData = data.filter(item => item.id === comfirmItem).map((item, key) => {
      item.status = 0
    });

    requestComfirmRequestUnlock(comfirmItem)
      .then(res => (
        res.status === 200 ? (
          // this.setState({
          //   comfirm: res.data,
          //   isLoading: true,
          //   status: true,
          //   message: PLEASE_CHECK_CONNECT(res.message)
          // }),
          //this.setState({ data: newData }),

          //this.fetchSummary()
          requestListRequestUnlock(JSON.stringify({
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
        ) : this.setState({
          comfirm: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(res.message)
        })
      ))
      .catch(err => (
        this.setState({
          comfirm: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message)
        })
      ));
  }
  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }
  handleNewData = (data) => {
    this.setState({ newData: data });
  }
  handleOpenEdit = (id) => {
    // const { requestCompanyGetDetails } = this.props;
    // requestCompanyGetDetails(id);
    this.setState({ idRow: id })
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination } = this.props;
    const { isLoaded,
      status,
      message,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      field,
      price,
      open,
      openUN,
      detail,
      uncomfirmCom,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      filter,
      warningPopupModal,
      activeCreateSubmit,
      updateModal,
      newData
    } = this.state;
    const statusPopup = { status: status, message: message };
    let isDisableConfirm = true;
    let isDisableUnconfirm = true;
    if (IS_ADMIN) {
      isDisableConfirm = false;
      isDisableUnconfirm = false;
    } else {
      ACCOUNT_CLAIM_FF.filter(x => x == "RequestUnlockCompanies.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "RequestUnlockCompanies.Unconfirm").map(y => isDisableUnconfirm = false)
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
                          })
                        )}
                        hideCreate={true}
                        hideSearch={
                          typeof (hideSearch) !== 'undefined' && (
                            hideSearch && true
                          )
                        }
                        searchForm={
                          <SearchModal
                            filter={filter}
                            field={field}

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
                        <Table className="align-items-center tablecs" responsive>
                          <HeadTitleTable
                            headerTitle={headerTitle}

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
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
                                      <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                      {/* <td className={`${item.status === 0 || item.status === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}</td> */}
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{moment(item.lockedDate).format('DD/MM/YYYY')}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{moment(item.requestLockDate).format('DD/MM/YYYY')}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.companyName}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>

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
                                        <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                          <DropdownToggle>
                                            <img src={MenuButton} />
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem

                                            >
                                              Xem
                                            </DropdownItem>
                                            {isDisableConfirm == true || isDisableUnconfirm == true ? null : (
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
                                            {isDisableConfirm == true || isDisableUnconfirm == true ? null : (
                                              <DropdownItem divider />
                                            )}
                                            {isDisableUnconfirm == false ? (
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('updateModal');
                                                  this.handleOpenEdit(item.id);
                                                }}
                                              >
                                                Không duyệt
                                              </DropdownItem>
                                            ) : null}
                                          </DropdownMenu>
                                        </ButtonDropdown>
                                      </td>
                                    </tr>
                                  ))
                              )
                            }
                          </tbody>
                        </Table>
                      </Card>

                      {/* Pagination */}
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
                    Bạn đồng ý mở khóa doanh nghiệp này?
                  </p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleComfirmRow}
              />
              <UpdatePopup
                moduleTitle='Thông báo'
                moduleBody={
                  <UnComfirmModal
                    data={detail}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewData}
                  />}
                newData={newData}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.componentUnComfirmMount}
              />
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
      // <div className="userAccountPage-container">
      //   {isLoaded ? (
      //     <div className="content-container">
      //       <Table
      //         data={data}
      //         value={COMPANY_LIST_REQUEST_UNLOCK_HEADER}
      //         dataMaping={dataMaping}
      //         searchTitle={COMPANY_LIST_REQUEST_UNLOCK_HEADER_SEARCH}
      //         searchTable={this.searchTable}
      //         searchData={searchData}
      //         filterList={filterList}
      //         checkAtive={checkAtive}
      //         customHeader={
      //           <div className={classes.selectArea}>
      //             <label className='label'>Ngành nghề</label>
      //             <Select
      //               name='fieldName'
      //               itemName='fieldName'
      //               keyActive='id'
      //               value={field}
      //               placeholder='Chọn ngành nghề'
      //               onChange={this.handleSelectJob}
      //             />
      //           </div>
      //         }
      //         customButtonRowItem={(ele) => this.buttonAcitveArea(ele)}
      //       />
      //       {
      //         //Set Alert Context
      //         setAlertContext(statusPopup)
      //       }
      //       {
      //         //Open Alert Context
      //         openAlertContext(statusPopup)
      //       }
      //       <Comfirm
      //         open={open}
      //         data={detail}
      //         handleClose={this.handleClose}
      //         handleUpdateInfoData={(ele) => this.getId(ele)}
      //       />
      //       <UnComfirmCompany
      //         open={openUN}
      //         data={uncomfirmCom}
      //         handleCloseUN={this.handleCloseUN}
      //         handleUpdateInfoData={this.componentUnComfirmMount} />
      //     </div>) : <Loader />
      //   }
      // </div>

    )
  }

}
const mapStateToProps = (state) => {
  return {
    company: state.CompanyListRequestUnlockStore,
    field: state.FieldStore,
    //price: state.PriceStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionListRequestUnlock, dispatch),
    ...bindActionCreators(actionField, dispatch),
    // ...bindActionCreators(actionPriceCreators, dispatch)

  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyListRequestUnlock);