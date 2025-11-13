import React, { Component, useState } from "react";
import moment from 'moment';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactDatetime from "react-datetime";
import { actionStampFee } from "../../../actions/StampFeeListActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import compose from 'recompose/compose';
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { STAMP_FEE_LIST_HEADER } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import ActyIcon from "../../../assets/img/buttons/XACTHUC.png";
import PrintIcon from "../../../assets/img/buttons/print.svg";
import Pagination from "components/Pagination";
import HeaderTableCustom from "components/HeaderTableCustom";
import HeadTitleTable from "components/HeadTitleTable";
import DefaultForm from "components/PrintForms/DefaultForms";
import Select from "components/Select";
import PrintPopup from "components/PrintPopup";
import WarningPopup from "../../../components/WarningPopup";
import UpdatePopup from "../../../components/UpdatePopup";
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { handleCurrencyFormat } from "../../../helpers/common";
import SearchImg from "../../../assets/img/buttons/searchig.svg";

import classes from './index.module.css';
import "./custom.css";
import MenuButton from "../../../assets/img/buttons/menu.png";
import HeaderTable from "components/HeaderTable";
import { configSystemAction } from "../../../actions/ConfigSystemAction";

import UpdateModal from "./UpdateModal";

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";



class StampFeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      isLoadedList: null,
      status: null,
      open: false,
      message: '',
      infoCompany: null,
      history: [],
      field: [],
      fetching: false,
      headerTitle: STAMP_FEE_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "status": null,
        "startDate": moment().subtract(30, 'days'),
        "endDate": new Date(),
        "orderBy": "",
        "page": null,
        "limit": null
      },
      province: [],
      district: [],
      ward: [],
      statusList: [
        { name: 'Đã thu', status: 1 },
        { name: 'Chưa thu', status: 0 },
        { name: 'Chưa thu hết', status: 2 },

      ],
      startDate: new Date(),
      endDate: new Date(),
      warningPopupModal: false,
      activeItem: null,
      printModal: false,
      printInfo: null
    };
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.stamp;
    let fieldData = nextProp.field.data;
    let locationData = nextProp.location.data;
    let ConfigSystemStoreData = nextProp.ConfigSystemStore;
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
        if (typeof (data.stamp) !== 'undefined') {
          if (data.stamp !== null) {
            if (typeof (data.stamp.informations) !== 'undefined') {
              data.stamp.informations.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                // item['createdDate'] = moment(item.createdDate).format('DD/MM/YYYY');
                // item['registeredDate'] = moment(item.registeredDate).format('DD/MM/YYYY');
                // item['expiredDate'] = moment(item.expiredDate).format('DD/MM/YYYY');
                if (item.status == 0) {
                  item['statusName'] = 'Chưa thu'
                } else if (item.status == 1) {
                  item['statusName'] = 'Đã thu'
                } else if (item.status == 2) {
                  item['statusName'] = 'Chưa thu hết'
                };
              });

              this.setState({ data: [] });
              this.setState({
                data: data.stamp.informations,
                listLength: data.stamp.total,
                totalPage: Math.ceil(data.stamp.informations.length / limit),
                isLoaded: data.isLoading,
                isLoadedList: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.stamp.informations,
                isLoaded: data.isLoading,
                isLoadedList: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.update) !== 'undefined') {
          if (fetching) {
            this.setState({ data: [] });
            this.fetchSummary(JSON.stringify({
              "startDate": null,
              "endDate": null,
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

    // if (ConfigSystemStoreData !== this.state.infoCompany) {

    // 	if (typeof (ConfigSystemStoreData) !== 'undefined') {
    // 		if (typeof (ConfigSystemStoreData.configSystem) !== 'undefined') {
    // 			if (ConfigSystemStoreData.configSystem !== null) {
    // 				this.setState({
    // 					infoCompany: ConfigSystemStoreData,
    // 					isLoaded: false,
    // 					status: data.status,
    // 					message: PLEASE_CHECK_CONNECT(data.message)
    // 				});
    // 			} else {
    // 				this.setState({
    // 					infoCompany: [],
    // 					isLoaded: false,
    // 					status: data.status,
    // 					message: PLEASE_CHECK_CONNECT(data.message)
    // 				});
    // 			}
    // 		}
    // 	}
    // }

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

  clearDay = () => {
    this.setState({ data: [] })
  }

  fromDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    return date;
  }

  toDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    return date;
  }

  handleSelectWard = (value, name) => {
    let { filter } = this.state;
    const { getWardList } = this.props;
    filter[name] = value;

    this.setState({ filter });
    getWardList(filter.districtID)
  }

  componentWillMount() {
    const { filter } = this.state;
    console.log(filter);
    const { getProvinceList, getDistrictList, requestFieldStore, getInfoCompany } = this.props;

    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "startDate": moment(filter.startDate).format('YYYY-MM-DD'),
      "endDate": moment(filter.endDate).format('YYYY-MM-DD'),
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
    getInfoCompany().then(res => {
      if (res.data.status == 200) {
        this.setState({
          infoCompany: res.data.data
        })
      }
    })


  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestStampFee } = this.props;

    requestStampFee(data);
  }

  closeStatusModal = () => {
    const { status, fetching } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false, isLoadedList: false });
      }, LOADING_TIME);
    }
  }

  handleSelect = (value, name) => {
    // if (value) {
    //   this.fetchSummary(JSON.stringify({
    //     "status": Number(value),
    //     "orderBy": "",
    //     "page": null,
    //     "limit": null
    //   }));
    // }
    let { filter } = this.state;
    filter['status'] = Number(value)
    this.setState({ filter, currentSelect: value })
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
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.fetchSummary(JSON.stringify(filter));
    //this.clearFilter();
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  handleActive = () => {
    const { requestComfirm } = this.props;
    const { activeItem, newData } = this.state;
    // 20230104 _ coment 
    // requestComfirm(activeItem);
    // this.setState({ fetching: true, isLoaded: true, status: null });
    requestComfirm(activeItem + "&amount=" + newData.amount).then(res => {
      if (((res || {}).data || {}).status == 200) {
        this.fetchSummary(
          JSON.stringify({
            "startDate": moment().subtract(30, 'days'),
            "endDate": new Date(),
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })
        );
        this.toggleModal('updateModal')
      }
    })
  }

  clearFilter = () => {
    this.setState({
      filter: {
        "status": null,
        "startDate": moment().subtract(30, 'days'),
        "endDate": new Date(),
        "orderBy": "",
        "page": null,
        "limit": null
      },
    })
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleNewData = (data) => {
    this.setState({ newData: data, errorInsert: {}, errorUpdate: {} });
  }

  render() {
    // const { classes, requestStampFee } = this.props;
    const {
      isLoaded,
      isLoadedList,
      status,
      message,
      data,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      statusList,
      filter,
      field,
      district,
      province,
      ward,
      printModal,
      printInfo,
      warningPopupModal,
      infoCompany,
      updateModal
    } = this.state;
    const statusPopup = { status: status, message: message };
    // console.log(data);
    let isDisableConfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "StampFees.Confirm").map(y => isDisableConfirm = false)
    }

    return (
      <>
        {
          <div id="fee-list-id" className={classes.wrapper}>
            <Container fluid>
              {
                isLoadedList ? (
                  <div style={{ display: 'table', margin: 'auto' }}>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                  </div>
                ) : (
                  <Row>
                    <div className="col">
                      {/* Header */}
                      <HeaderTable
                        dataReload={() => {
                          this.fetchSummary(
                            JSON.stringify({
                              "startDate": moment().subtract(30, 'days'),
                              "endDate": new Date(),
                              "search": "",
                              "filter": "",
                              "orderBy": "",
                              "page": null,
                              "limit": null
                            })
                          );
                          this.clearFilter()
                        }}
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
                        hideSearch={true}
                        typeSearch={
                          <>
                            <div className="div_flex w_div_100">
                              <div className="mg-div-search">
                                <label className="form-control-label">Từ ngày</label>
                                <div>
                                  <FormGroup >
                                    <InputGroup className="input-group-alternative css-border-input ">
                                      <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                                        <InputGroupText>
                                          <i className="ni ni-calendar-grid-58" />
                                        </InputGroupText>
                                      </InputGroupAddon>
                                      <ReactDatetime

                                        inputProps={{
                                          placeholder: "Từ ngày"
                                        }}
                                        name='startDate'
                                        value={filter.startDate ? moment(filter.startDate).format('DD/MM/YYYY') : ""}
                                        timeFormat={false}
                                        onChange={(e) => this.handleChangeStartDate(e)}
                                      />
                                    </InputGroup>
                                  </FormGroup>
                                </div>
                              </div>
                              <div className="mg-div-search">
                                <label className="form-control-label">Đến ngày</label>
                                <div>
                                  <FormGroup >
                                    <InputGroup className="input-group-alternative css-border-input">
                                      <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                                        <InputGroupText>
                                          <i className="ni ni-calendar-grid-58" />
                                        </InputGroupText>
                                      </InputGroupAddon>
                                      <ReactDatetime
                                        inputProps={{
                                          placeholder: "Đến ngày"
                                        }}
                                        name='endDate'
                                        value={filter.endDate ? moment(filter.endDate).format('DD/MM/YYYY') : ""}
                                        timeFormat={false}
                                        onChange={(e) => this.handleChangeEndDate(e)}
                                      />
                                    </InputGroup>
                                  </FormGroup>
                                </div>
                              </div>
                              <div className="mg-div-search ">
                                <label className="form-control-label">
                                  Trạng thái
                                </label>
                                <div>
                                  <Select
                                    name="status"
                                    title='Chọn trạng thái'
                                    data={statusList}
                                    defaultValue={this.state.currentSelect}
                                    labelName='name'
                                    val='status'
                                    handleChange={this.handleSelect}
                                  />
                                </div>
                              </div>
                              <div className="mg-btn">
                                <label
                                  className="form-control-label"
                                >&nbsp;</label>
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
                        // customComponent={
                        // 	<div className={classes.filterArea}
                        // 		style={{
                        // 			width: 310,
                        // 			padding: 3,
                        // 		}}>
                        // 		<label
                        // 			className="form-control-label"
                        // 			style={{
                        // 				marginRight: 5,
                        // 				width: 100
                        // 			}}
                        // 		>
                        // 			Trạng thái
                        // 		</label>

                        // 		<Select
                        // 			name="status"
                        // 			title='Chọn trạng thái'
                        // 			data={statusList}
                        // 			defaultValue={this.state.currentSelect}
                        // 			labelName='name'
                        // 			val='status'
                        // 			handleChange={this.handleSelect}
                        // 		/>
                        // 	</div>
                        // }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-stampFeeList" responsive>
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key} className="table-hover-css">
                                      <td className="table-scale-col table-user-col-1">{item.index}</td>
                                      <td style={{ textAlign: 'center' }} className={`table-scale-col cursor-unset`}>
                                        <span className={item.status === 1 ? classes.activeStt : (item.status == 2 ? classes.chuathuhetStt : classes.noActiveStt)}>
                                          {item.statusName}
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'right' }}>{handleCurrencyFormat(item.amount)}</td>{/* amount la so tien */}
                                      <td style={{ textAlign: 'right' }}>{handleCurrencyFormat(item.collectedPayment)}</td>{/* amount la so tien */}
                                      <td style={{ textAlign: 'right' }}>{handleCurrencyFormat(item.remainedPayment)}</td>{/* amount la so tien */}
                                      <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                      {/* <td style={{ textAlign: 'center' }}>{item.registeredDate ? (moment(item.registeredDate).format('DD/MM/YYYY')) : null}</td>
																			<td style={{ textAlign: 'center' }}>{item.expiredDate ? (moment(item.expiredDate).format('DD/MM/YYYY')) : null}</td> */}
                                      <td style={{ textAlign: 'left' }}>{item.companyName}</td>
                                      {/* <td style={{ textAlign: 'left' }}>{item.fieldName}</td> */}
                                      <td style={{ textAlign: 'center' }}>{item.confirmedDate ? (moment(item.confirmedDate).format('DD/MM/YYYY')) : null}</td>
                                      <td style={{ textAlign: 'left' }}>{item.confirmedBy}</td>
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
                                            {/* {item.status == 1 || isDisableConfirm == true ? null : (
                                              
                                            )} */}
                                            {item.status == 1 || isDisableConfirm == true ? null : (
                                              <>
                                                <DropdownItem divider />
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal('updateModal');
                                                    this.setState({ activeItem: item.id });
                                                  }}
                                                >
                                                  Xác thực
                                                </DropdownItem>
                                              </>
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
            <UpdatePopup
              moduleTitle='Xác thực thu tiền'
              moduleBody={
                <UpdateModal
                  // dataMaterial={dataMaterial}
                  // data={detail}
                  // id={this.state.editId}
                  handleCheckValidation={this.handleCheckValidation}
                  handleNewData={this.handleNewData}
                // errorUpdate={this.state.errorUpdate}
                />}
              // newData={newData}
              updateModal={updateModal}
              toggleModal={this.toggleModal}
              // activeSubmit={activeCreateSubmit}
              handleUpdateInfoData={this.handleActive}
            />

            {
              printInfo !== null && (
                <PrintPopup
                  printModal={printModal}
                  formA5
                  moduleBody={
                    <div id="printarea">
                      <DefaultForm
                        infoCompany={infoCompany}
                        data={printInfo} />
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
    stamp: state.StampFeeListStore,
    field: state.FieldStore,
    location: state.LocationStore,
    ConfigSystemStore: state.ConfigSystemStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionStampFee, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch),
    ...bindActionCreators(configSystemAction, dispatch),
  }
}

export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StampFeeList);