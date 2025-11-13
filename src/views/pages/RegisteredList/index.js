import React, { Component, useState } from "react";
import moment from 'moment';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import HeaderTable from "components/HeaderTable";
import { actionRegisteredFee } from "../../../actions/RegisteredListActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import compose from 'recompose/compose';
import { PLEASE_CHECK_CONNECT,  } from "../../../services/Common";
import { REGISTERED_FEE_LIST_HEADER } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import ActyIcon from "../../../assets/img/buttons/XACTHUC.png";
import PrintIcon from "../../../assets/img/buttons/print.svg";
import Pagination from "components/Pagination";
import { handleCurrencyFormat } from "../../../helpers/common";
import HeaderTableCustom from "components/HeaderTableCustom";
import HeadTitleTable from "components/HeadTitleTable";
import DefaultForm from "components/PrintForms/DefaultForms";
import Select from "components/Select";
import PrintPopup from "components/PrintPopup";
import WarningPopup from "../../../components/WarningPopup";
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import classes from './index.module.css';
import "./custom.css";
import MenuButton from "../../../assets/img/buttons/menu.png";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class RegisteredList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      message: '',
      history: [],
      field: [],
      fetching: false,
      dataMaping: [
        'index', 'status', 'amount', 'registeredDate', 'expiredDate', 'companyName', 'fieldName', 'createdDate', 'createdBy'
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{
        name: 'status', compare: 'status'
      }],
      fromDate: new Date(),
      toDate: new Date(),
      headerTitle: REGISTERED_FEE_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "status": 0,
        "startDate": "",
        "endDate": "",
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
        "limit": null
      },
      statusList: [
        { name: 'Đã xác thực', status: 1 },
        { name: 'Chưa xác thực', status: 0 },
      ],
      province: [],
      district: [],
      ward: [],
      startDate: new Date(),
      endDate: new Date(),
      warningPopupModal: false,
      activeItem: null,
      printModal: false,
      printInfo: null
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.registered;
    let fieldData = nextProp.field.data;
    let locationData = nextProp.location.data;
    const { limit, fetching } = this.state;

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
        if (typeof (data.registered) !== 'undefined') {
          if (data.registered !== null) {
            if (typeof (data.registered.informations) !== 'undefined') {
              data.registered.informations.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                item['createdDate'] = moment(item.createdDate).format('DD/MM/YYYY');
                item['registeredDate'] = moment(item.registeredDate).format('DD/MM/YYYY');
                item['expiredDate'] = moment(item.expiredDate).format('DD/MM/YYYY');
                if (item.status == 0) {
                  item['statusName'] = 'Chưa thu'
                } else if (item.status == 1) {
                  item['statusName'] = 'Đã thu'
                };
              });

              this.setState({ data: [] });
              this.setState({
                history: data.registered.informations,
                data: data.registered.informations,
                listLength: data.registered.total,
                totalPage: Math.ceil(data.registered.informations.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({ data: data.registered.informations, history: data.registered.informations, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
            }
          }
        }

        if (typeof (data.update) !== 'undefined') {
          if (fetching) {
            this.setState({ data: [] });
            this.fetchSummary(JSON.stringify({
              "startDate": "",
              "endDate": "",
              "search": "",
              "filter": "",
              "orderBy": "",
              "page": null,
              "limit": null
            }));
            this.setState({ fetching: false });
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
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  clearDay = () => {
    this.setState({ data: [] })
  }

  fromDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }

  toDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }
  getId = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryComfirm(
        value.id,
      )
    }

  }
  fetchSummaryComfirm = (id) => {
    const { requestComfirm } = this.props;

    requestComfirm(id);
  }

  handleSelectWard = (value, name) => {
    let { filter } = this.state;
    const { getWardList } = this.props;
    filter[name] = value;

    this.setState({ filter });
    getWardList(filter.districtID)
  }

  componentWillMount() {
    const { getProvinceList, getDistrictList, requestFieldStore } = this.props;
    const { fromDate, toDate } = this.state;

    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      // "startDate": this.fromDate(fromDate),
      "startDate": "1900-01-01",
      "endDate": this.toDate(toDate),
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));

    // Request Field
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

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestRegisteredFee } = this.props;

    requestRegisteredFee(data);
  }

  closeStatusModal = () => {
    const { status, fetching } = this.state;

    if (status || !status && fetching) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handleSelect = (value, name) => {
    this.fetchSummary(JSON.stringify({
      "status": Number(value),
      "roleIDs": "",
      "userName": "",
      "fullName": "",
      "phone": "",
      "email": "",
      "position": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
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

  handleChangeStartDate = (e) => {
    let { filter } = this.state;

    filter['startDate'] = new Date(e);
    this.setState({ filter, startDate: new Date(e) });
  }

  handleChangeEndDate = (e) => {
    let { filter } = this.state;

    filter['endDate'] = new Date(e);
    this.setState({ filter, endDate: new Date(e) });
  }

  handleStatus = (event) => {
    for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
      document.getElementsByClassName('checkbox-status')[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  }

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  handleSelectCS = (value, name) => {
    let { filter } = this.state;

    if (value === null) value = "";

    filter[name] = value;
    this.setState({ filter });
  }

  handleSubmitSearchForm = () => {
    const { filter } = this.state;

    this.fetchSummary(JSON.stringify(filter));
  }


  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  handleActive = () => {
    const { requestComfirm } = this.props;
    const { activeItem } = this.state;

    requestComfirm(activeItem);
    this.setState({ fetching: true, isLoaded: true, status: null });
  }

  handleSubmitSearchForm = () => {
    const { filter } = this.state;

    this.fetchSummary(JSON.stringify(filter));
  }

  render() {
    const { isLoaded,
      status,
      message,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      statusList,
      filter,
      field,
      district,
      province,
      ward,
      printModal,
      printInfo,
      warningPopupModal,
      toDate
    } = this.state;
    const statusPopup = { status: status, message: message };

    let isDisableConfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
      
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "RegisteredFees.Confirm").map(y => isDisableConfirm = false)
    }

    return (
      <>
        {
          <div id="registered-list-id" className={classes.wrapper}>
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
                            // "startDate": this.fromDate(fromDate),
                            "startDate": "1900-01-01",
                            "endDate": this.toDate(toDate),
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
                            handleSelectCS={this.handleSelectCS}
                            handleSelectWard={this.handleSelectWard}
                            handleChangeStartDate={this.handleChangeStartDate}
                            handleChangeEndDate={this.handleChangeEndDate}
                          />
                        }
                        customComponent={
                          <div className={classes.filterArea}
                            style={{
                              width: 310,
                              padding: 3,
                            }}
                          >
                            <label
                              className="form-control-label"
                              style={{
                                marginRight: 5,
                                width: 100
                              }}
                            >
                              Trạng thái
                            </label>

                            <Select
                              name="status"
                              title='Chọn trạng thái'
                              data={statusList}
                              labelName='name'
                              val='status'
                              handleChange={this.handleSelect}
                            />
                          </div>
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs" responsive>
                          <HeadTitleTable headerTitle={headerTitle} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key}>
                                      <td>{item.index}</td>
                                      <td style={{ textAlign: 'center' }} className={`table-scale-col cursor-unset`}>
                                        <span className={item.status === 1 ? classes.activeStt : classes.noActiveStt}>
                                          {item.statusName}
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'right' }}>{handleCurrencyFormat(item.amount)}</td>
                                      <td style={{ textAlign: 'center' }}>{item.registeredDate}</td>
                                      <td style={{ textAlign: 'center' }}>{item.expiredDate}</td>
                                      <td style={{ textAlign: 'left' }}>{item.companyName}</td>
                                      <td style={{ textAlign: 'left' }}>{item.fieldName}</td>
                                      <td style={{ textAlign: 'center' }}>{item.createdDate}</td>
                                      <td style={{ textAlign: 'left' }}>{item.createdBy}</td>
                                      <td>
                                        <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                          <DropdownToggle>
                                            <img src={MenuButton} />
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem
                                              onClick={() => {
                                                this.toggleModal('printModal');
                                                this.setState({ printInfo: item });
                                              }}
                                            >
                                              In
                                            </DropdownItem>
                                            {item.status !== 0 || isDisableConfirm == true ? null : (
                                              <DropdownItem divider />
                                            )}
                                            {item.status !== 0 || isDisableConfirm == true ? null : (
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('warningPopupModal');
                                                  this.setState({ activeItem: item.id });
                                                }}
                                              >
                                                Xác thực
                                              </DropdownItem>
                                            )}
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
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>

            <WarningPopup
              moduleTitle='Thông báo'
              moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn muốn xác nhận phiếu thu này?</p>}
              warningPopupModal={warningPopupModal}
              toggleModal={this.toggleModal}
              handleWarning={this.handleActive}
            />

            {
              printInfo !== null && (
                <PrintPopup
                  printModal={printModal}
                  moduleBody={
                    <div id="printarea">
                      <DefaultForm data={printInfo} />
                    </div>
                  }
                  id='printarea'
                  toggleModal={this.toggleModal}
                />
              )
            }
          </div>
        }
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    registered: state.RegisteredListStore,
    field: state.FieldStore,
    location: state.LocationStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionRegisteredFee, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch)
  }
}

export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RegisteredList);