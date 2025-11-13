import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import { actionCompanyListCertified } from "../../../actions/CompanyListCertifiedActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { COMPANY_LIST_CERTIFIED_HEADER, COMPANY_LIST_REGISTER_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID,IS_ADMIN } from "../../../services/Common";
import moment from 'moment';
import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
import ActivityIcon from "../../../assets/img/buttons/XACTHUC.png";
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
import MenuButton from "../../../assets/img/buttons/menu.png";
import ViewModal from "./ViewModal";
import ViewPopup from "../../../components/ViewPopup";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyListCertified extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      statusCom: [],
      province: [],
      district: [],
      ward: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      comfirm: null,
      acty: null,
      isLoaded: null,
      status: null,
      open: false,
      openCOM: false,
      message: '',
      history: [],
      company: [],
      dataMaping: [
        'index', 'status', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address', 'confirmedDate',
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{
        name: 'status', compare: 'isCertified'
      }],
      statusList: [
        { name: 'Đã xác thực', isCertified: true },
        { name: 'Chưa xác thực', isCertified: false }
      ],
      typeAlign: [
        {
          type: 'number', position: [4, 5]
        },
        {
          type: 'date', position: [7]
        },
        {
          type: 'hours', position: []
        }
      ],
      headerTitle: COMPANY_LIST_CERTIFIED_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "status": "",
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
      actyItem: null,
      warningPopupModal: false,
      activeCreateSubmit: false,
      newData: [],
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    let fieldData = nextProp.field.data;
    const { limit } = this.state;
    let locationData = nextProp.location.data;
    let detailsData = nextProp.details.data;

    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {
            this.setState({ field: fieldData.field.fields, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          } else {
            this.setState({ field: fieldData.field, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
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

              });
              this.setState({
                data: data.company.companies,
                statusCom: ['status'],
                company: data.company.companies,
                listLength: data.company.companies.length,
                totalPage: Math.ceil(data.company.companies.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.company.companies,
                statusCom: ['status'],
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

  }
  getVerify = (value) => {
    let { data } = this.state;

    if (typeof (value.id) !== 'undefined') {
      if (!value.isCertified) {
        if (Array.isArray(data)) {
          data.filter(item => item.id === value.id)
            .map(item => item.isCertified = true)

          this.setState({ data });
        }

        this.fetchSummaryVerify(
          value.id,
        );
      }
    }
    window.location.reload(true);
  }
  handleCloseCOM = (value) => {
    const { openCOM } = this.state;

    this.setState({ openCOM: value });
  }
  componentWillMount() {
    const { requestFieldStore } = this.props;
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "status": null,
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
      "limit": null,
      "status": "",
    }));
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestCompanyListCertified } = this.props;

    requestCompanyListCertified(data);
  }
  fetchSummaryVerify = (id) => {
    const { requestVerfyCompany } = this.props;

    requestVerfyCompany(id);
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
      data = data.filter(item => item['fieldName'] !== null);
    }
    else {
      data = data.filter(item =>
        item['fieldName'] !== null && item['fieldName'].toLowerCase().includes(value)
      );
    }

    this.setState({ searchData: data });
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

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
  // buttonAcitveArea = (ele) => {
  //   const { classes } = this.props;
  //   let { data, openCOM, open } = this.state;

  //   return (
  //     <div className={classes.editArea}>
  //       {ele.isCertified == false ? (
  //         <div className='edit-item'

  //           onClick={() => {

  //             this.handleCloseCOM(true);
  //             this.setState({ comfirm: ele });

  //           }}
  //           open={openCOM}
  //         >
  //           <img src={XACTHUC} alt='xac thuc' title='Xác thực' />
  //         </div>
  //       ) : null
  //       }
  //     </div>
  //   );
  // }
  handleSelectJob = (event) => {
    let { data, field, company } = this.state;
    let fieldNameCurrent = null;

    // Remove Select Status
    document.getElementById('select-status').selectedIndex = 0;

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

  handleSelectStatus = (event) => {
    let { data, statusList, company } = this.state;
    let currentIsCertified = null;

    // Remove Select Major
    document.getElementById('select-major').selectedIndex = 0;

    // Get all
    if (Number(event.target.value) === -1) {
      data = company;
    } else {
      statusList
        .filter(item => String(item.isCertified).indexOf(event.target.value) > -1)
        .map(item => (
          currentIsCertified = item.isCertified
        ));

      Array.isArray(company) ? (
        data = company.filter(item =>
          String(item.isCertified).indexOf(event.target.value) > -1
        ).map(item => item = item)
      ) : (
        data = company
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
  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.clearFilter();
    this.fetchSummary(JSON.stringify(filter));
  }
  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      "status": "",
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
  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        detailView: null
      });
    }
  };
  handleOpenEdit = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }
  handleActyRow = () => {
    const { requestVerfyCompany, requestCompanyListRegistered } = this.props;
    let { data, actyItem } = this.state;
    let newData = data.filter(item => item.id === actyItem).map((item, key) => {
      item.status = 0
    });

    requestVerfyCompany(actyItem)
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
          requestCompanyListRegistered(JSON.stringify({
            "status": 0,
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
          acty: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(res.message)
        })
      ))
      .catch(err => (
        this.setState({
          acty: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message)
        })
      ));
  }
  render() {
    // const { classes } = this.props;
    const { isLoaded,
      status,
      message,
      data,
      searchData,
      openCOM,
      filterList,
      dataMaping,
      checkAtive,
      field,
      statusCom,
      statusList,
      typeAlign,
      comfirm,
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
      actyItem,
      detailView,
      detail,
      newData,
      viewModal,
      activeCreateSubmit
    } = this.state;
    const statusPopup = { status: status, message: message };

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
                            "limit": null,
                            "status": "",
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
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                        <span><strong>{item.companyName}</strong></span><br />
                                        <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                      </td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.registeredDate ? moment(item.registeredDate).format('DD/MM/YYYY') : null}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.certifiedDate ? moment(item.certifiedDate).format('DD/MM/YYYY') : null}</td>
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
                    Bạn muốn xác thực doanh nghiệp này?
                  </p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleActyRow}
              />
              {
                detailView !== null && (
                  <ViewPopup
                    moduleTitle='Xem thông tin'
                    moduleBody={
                      <ViewModal
                        data={detail}
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

    )
  }

}
const mapStateToProps = (state) => {
  return {
    company: state.CompanyListCertifiedStore,
    field: state.FieldStore,
    location: state.LocationStore,
    details: state.CompanyGetDetailsStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionCompanyListCertified, dispatch),
    ...bindActionCreators(actionField, dispatch),
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
)(CompanyListCertified);