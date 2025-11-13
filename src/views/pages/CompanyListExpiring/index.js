import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionCompanyListAwaitExpired } from "../../../actions/CompanyListAwaitExpiredAction";
import { actionField } from "../../../actions/FieldActions.js";
import { actionPriceCreators } from "../../../actions/PricesListActions";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { COMPANY_LIST_AWAIT_EXPIRED_HEADER, COMPANY_LIST_AWAIT_EXPIRED_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
// import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID,IS_ADMIN } from "../../../services/Common";
//import { addDays } from "../../../helpers/common";
import moment from 'moment';
// import Extend from "./Extend.js";
// //import Popup from "../../../components/Popup";
// import GIAHAN from "../../../assets/images/buttons/GIAHAN.png";
import ExprringIcon from "../../../assets/img/buttons/GIAHAN.png";
import UnComfirmIcon from "../../../assets/img/buttons/unconfirm.png";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import WarningPopup from "../../../components/WarningPopup";
import ExtendModal from "./ExtendModal";
import ExtendPopup from "../../../components/ExtendPopup";
import ViewModal from "./ViewModal";
import ViewPopup from "../../../components/ViewPopup";
import MenuButton from "../../../assets/img/buttons/menu.png";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyListExpiring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      price: [],
      province: [],
      district: [],
      ward: [],
      newData: [],
      extendData: [],
      detail: null,
      detailView: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'registeredDate', 'daysLeft', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address',
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      ngayhethan: new Date(),
      typeAlign: [
        {
          type: 'number', position: [2, 5, 6]
        },
        {
          type: 'date', position: [1]
        },
        {
          type: 'hours', position: []
        }
      ],
      headerTitle: COMPANY_LIST_AWAIT_EXPIRED_HEADER,
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
      fetchingUnExtend: false
    }
  }

  componentWillReceiveProps(nextProp) {
    //console.log(nextProp);
    let { ngayhethan } = this.state;
    let { data } = nextProp.company;
    let fieldData = nextProp.field.data;
    let priceDate = nextProp.price.data;
    let detailsData = nextProp.details.data;
    const { limit } = this.state;
    let locationData = nextProp.location.data;
    const { fetchingUnExtend } = this.state;
    const { requestCompanyListAwaitExpired } = nextProp;

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
                // item['registeredDate'] = moment(item.registeredDate).format('DD/MM/YYYY');
                // item['expiredDays'] = moment(item.expiredDate).format('DD/MM/YYYY');
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

    if (typeof (data.extend) !== 'undefined') {
      if (data.status && !fetchingUnExtend) {
        this.setState({ data: [] });
        requestCompanyListAwaitExpired(JSON.stringify({
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
        this.setState({ fetchingUnExtend: true });
      }
    }

    if (typeof (detailsData) !== 'undefined') {
      if (detailsData.details !== null) {
        if (typeof (detailsData.details) !== 'undefined') {
          this.setState({
            xem: detailsData.details,
            detail: detailsData.details,
            detailView: detailsData.details,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        } else {
          this.setState({
            xem: detailsData.details,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        }
      }
    }

    if (locationData !== this.state.province) {
      if (typeof (locationData) !== 'undefined') {
        if (typeof (locationData.province) !== 'undefined') {

          if (locationData.province !== null) {
            //console.log(locationData.province.data)
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

    if (priceDate !== this.state.price) {
      if (typeof (priceDate) !== 'undefined') {
        if (typeof (priceDate.prices) !== 'undefined') {
          if (priceDate.prices !== null) {
            this.setState({
              price: priceDate.prices.prices,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              price: [],
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

  }

  componentWillMount() {
    const { requestFieldStore, getAllPriceList } = this.props;
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    // Get field store
    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));

    // Get All Prices
    getAllPriceList(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
    getProvinceList();
    getDistrictList();
  }

  componentPropsMount() {
    // const { getAllPriceList } = this.props;

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
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }
  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }
  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }
  fetchSummary = (data) => {
    const { requestCompanyListAwaitExpired } = this.props;

    requestCompanyListAwaitExpired(data);
  }
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
      detail: null,
      detailView: null
    });
  };
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
    getWardList(filter.districtID)

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
  componentExtend = (value) => {
    let { detail } = this.state;
    //console.log(value)
    const { requestCompanyExtend } = this.props;

    const createData = JSON.stringify({
      id: detail.id,
      year: value.year
    });


    requestCompanyExtend(createData);
    this.setState({ fetchingUnExtend: false })

  }
  // buttonAcitveArea = (ele) => {
  //   const { classes } = this.props;
  //   const { open } = this.state;

  //   return (
  //     <div>
  //       <div className={classes.editArea}

  //         onClick={() => {
  //           this.handleClose(true);
  //           this.setState({ detail: ele });
  //         }}
  //         open={open}
  //       >
  //         <img src={GIAHAN} alt='gia han' title='Gia hạn' />
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
  handleOpenEdit = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }
  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }
  handleNewData = (data) => {
    this.setState({ newData: data });
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  render() {
    // const { classes } = this.props;
    const { isLoaded,
      status,
      message,
      detail,
      data,
      open,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      field,
      price,
      typeAlign,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      filter,
      province,
      district,
      ward,
      warningPopupModal,
      activeCreateSubmit,
      extendModal,
      newData,
      extendData,
      detailView,
      viewModal
    } = this.state;
    const statusPopup = { status: status, message: message };
    let isDisableExtend = true;
    if (IS_ADMIN) {
      isDisableExtend = false;
    } else {
      ACCOUNT_CLAIM_FF.filter(x => x == "ExpiringCompanies.Extend").map(y => isDisableExtend = false)
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
                        <Table className="align-items-center tablecs" responsive>
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
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
                                      <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                      {/* <td className={`${item.status === 0 || item.status === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}</td> */}
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{moment(item.registeredDate).format('DD/MM/YYYY')}</td>
                                      <td style={{ textAlign: 'center', color: 'red' }} className='table-scale-col'><strong>{item.daysLeft} ngày</strong></td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                        <span><strong>{item.companyName}</strong></span><br />
                                        <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                      </td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                      {/* <td style={{ textAlign: 'left' }}>{item.address}</td> */}

                                      {/* <td >
                                        <div className={classes.editArea}>

                                          <div className={classes.item}>
                                            <img src={ViewIcon} alt="Xem" title="Xem" width="25" height="25"
                                              onClick={() => {
                                                this.toggleModal('viewModal');
                                                this.handleOpenEdit(item.id);
                                              }}
                                            />
                                          </div>
                                          <div className={classes.item}
                                            onClick={() => {
                                              this.toggleModal('extendModal');
                                              this.handleOpenEdit(item.id);
                                            }}
                                          >
                                            <img src={ExprringIcon} alt="Gia hạn" title="Gia hạn" />
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
                                              onClick={() => {
                                                this.toggleModal('viewModal');
                                                this.handleOpenEdit(item.id);
                                              }}
                                            >
                                              Xem
                                            </DropdownItem>
                                            {isDisableExtend == false ? (
                                              <DropdownItem divider />
                                            ) : null}
                                            {isDisableExtend == false ? (
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('extendModal');
                                                  this.handleOpenEdit(item.id);
                                                }}
                                              >
                                                Gia hạn
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
              {
                detail !== null && (
                  <ExtendPopup
                    moduleTitle='Thông báo'
                    moduleBody={
                      <ExtendModal
                        data={detail}
                        price={price}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    extendModal={extendModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
                  />
                )
              }
              {
                detailView !== null && (
                  <ViewPopup
                    moduleTitle='Xem thông tin'
                    moduleBody={
                      <ViewModal
                        data={detail}
                        price={price}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    viewModal={viewModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
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
      // <div className="userAccountPage-container">
      //   {isLoaded ? (
      //     <div className="content-container">
      //       <Table
      //         data={data}
      //         value={COMPANY_LIST_AWAIT_EXPIRED_HEADER}
      //         dataMaping={dataMaping}
      //         searchTitle={COMPANY_LIST_AWAIT_EXPIRED_HEADER_SEARCH}
      //         searchTable={this.searchTable}
      //         searchData={searchData}
      //         filterList={filterList}
      //         checkAtive={checkAtive}
      //         typeAlign={typeAlign}
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
      //       <Extend
      //         open={open}
      //         data={detail}
      //         price={price}
      //         handleClose={this.handleClose}
      //         handleUpdateInfoData={this.componentExtend}
      //       />
      //       {/* <Popup 
      //         open={open}
      //         handleClose={this.handleClose}
      //         // handleCancel={}
      //         // handleSubmit={}
      //         title='title'
      //       /> */}
      //     </div>) : <Loader />
      //   }
      // </div>

    )
  }

}
const mapStateToProps = (state) => {
  return {
    company: state.CompanyListAwaitExpiredStore,
    field: state.FieldStore,
    price: state.PriceStore,
    location: state.LocationStore,
    details: state.CompanyGetDetailsStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionCompanyListAwaitExpired, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionPriceCreators, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch),
    ...bindActionCreators(actionCompanyGetDetails, dispatch),
  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyListExpiring);