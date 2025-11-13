import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionCompanyListLock } from "../../../actions/CompanyListLockActions";
import { actionField } from "../../../actions/FieldActions.js";
import { COMPANY_LIST_LOCK_HEADER, COMPANY_LIST_LOCK_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
// import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT, ACCOUNT_ID, ACCOUNT_CLAIM_FF,IS_ADMIN } from "../../../services/Common";
import moment from 'moment';
// import Extend from "./Extend.js";
import { actionPriceCreators } from "../../../actions/PricesListActions";
// import { addDays } from "../../../helpers/common";
// import Comfirm from "./ComfirmCompany.js";
// import GIAHAN from "../../../assets/images/buttons/GIAHAN.png";
// import MOKHOA from "../../../assets/images/buttons/MOKHOA.png";
import UnlockIcon from "../../../assets/img/buttons/MOKHOA.png";
import EntendIcon from "../../../assets/img/buttons/GIAHAN.png";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import WarningPopup from "../../../components/WarningPopup";
import ExtendPopup from "../../../components/ExtendPopup";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import SearchModal from "./SearchModal";
import ExtendModal from "./ExtendModal";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import MenuButton from "../../../assets/img/buttons/menu.png";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyListLock extends Component {
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
      detail: null,
      comfirm: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openCOM: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'lockedDate', 'lockedBy', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address',
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      ngayhethan: new Date(),
      typeAlign: [
        {
          type: 'number', position: [5, 6]
        },
        {
          type: 'date', position: [1]
        },
        {
          type: 'hours', position: []
        }
      ],
      headerTitle: COMPANY_LIST_LOCK_HEADER,
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
      activeCreateSubmit: false,
      fetchingExtend: false,
      warningPopupModal: false,
      unlockItem: null,
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    let fieldData = nextProp.field.data;
    let { ngayhethan } = this.state;
    let priceDate = nextProp.price.data;
    const { limit } = this.state;
    let locationData = nextProp.location.data;
    let detailsData = nextProp.details.data;
    const { requestCompanyListLock } = nextProp;
    let { fetchingExtend } = this.state;

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

    if (typeof (detailsData) !== 'undefined') {
      if (detailsData.details !== null) {
        if (typeof (detailsData.details) !== 'undefined') {
          this.setState({
            xem: detailsData.details,
            detail: detailsData.details,
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

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.company) !== 'undefined') {
          if (data.company !== null) {
            if (typeof (data.company.companies) !== 'undefined') {
              data.company.companies.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                // item['lockedDate'] = moment(item.lockedDate).format('DD/MM/YYYY');
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
    if (typeof (data.extend) !== 'undefined') {
      if (data.status && !fetchingExtend) {
        this.setState({ data: [] });
        requestCompanyListLock(JSON.stringify({
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
        this.setState({ fetchingExtend: true });
      }
    }

  }

  componentWillMount() {
    const { requestFieldStore, getAllPriceList } = this.props;
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
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
  getId = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryUnLock(
        value.id,
      )
    }
    window.location.reload(true);
  }
  fetchSummaryUnLock = (id) => {
    const { requestCompanyUnLock } = this.props;

    requestCompanyUnLock(id);
  }
  fetchSummary = (data) => {
    const { requestCompanyListLock } = this.props;

    requestCompanyListLock(data);
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
    const { requestCompanyExtend } = this.props;
    const createData = JSON.stringify({
      id: detail.id,
      year: value.year
    });

    requestCompanyExtend(createData);
    this.setState({ fetchingExtend: false })
  }


  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }
  handleCloseCOM = (value) => {
    const { openCOM } = this.state;

    this.setState({ openCOM: value });
  }
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
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
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
  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }
  handleNewData = (data) => {
    this.setState({ newData: data });
  }
  handleOpenExten = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
      detail: null,
      idRow: null
    });
  };
  handleUnLockRow = () => {
    const { requestCompanyUnLock, requestCompanyListLock } = this.props;
    let { data, unlockItem } = this.state;
    let newData = data.filter(item => item.id === unlockItem).map((item, key) => {
      item.status = 0
    });

    requestCompanyUnLock(unlockItem)
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
          requestCompanyListLock(JSON.stringify({
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
          unlockItem: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(res.message)
        })
      ))
      .catch(err => (
        this.setState({
          unlockItem: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message)
        })
      ));
  }
  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination } = this.props;
    const {
      isLoaded,
      status,
      message,
      openCOM,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      field,
      open,
      detail,
      price,
      comfirm,
      typeAlign,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      province,
      district,
      ward,
      filter,
      activeCreateSubmit,
      extendModal,
      newData,
      warningPopupModal
    } = this.state;
    let isDisableUnlock = true;
    const statusPopup = { status: status, message: message };
    if (IS_ADMIN) {
      isDisableUnlock = false;
    } else {
      ACCOUNT_CLAIM_FF.filter(x => x == "LockingCompanies.Unlock").map(y => isDisableUnlock = false)
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
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{moment(item.lockedDate).format('DD/MM/YYYY')}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.lockedBy}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                        <span><strong>{item.companyName}</strong></span><br />
                                        <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                      </td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                      <td>
                                        {isDisableUnlock == true ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>

                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('warningPopupModal');
                                                  this.setState({ unlockItem: item.id });
                                                }}
                                              >
                                                Mở khóa
                                              </DropdownItem>
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
                handleWarning={this.handleUnLockRow}
              />
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
    company: state.CompanyListLockStore,
    field: state.FieldStore,
    price: state.PriceStore,
    location: state.LocationStore,
    details: state.CompanyGetDetailsStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionCompanyListLock, dispatch),
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
)(CompanyListLock);