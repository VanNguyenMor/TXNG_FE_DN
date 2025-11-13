import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionListRequestExtend } from "../../../actions/CompanyListRequestExtendActions";
import { actionField } from "../../../actions/FieldActions.js";
import { COMPANY_LIST_REQUEST_EXTEND_HEADER, COMPANY_LIST_REQUEST_EXTEND_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
// import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID,IS_ADMIN } from "../../../services/Common";
//import { addDays } from "../../../helpers/common";
import moment from 'moment';
// import Extend from "./Extend.js";
import { actionPriceCreators } from "../../../actions/PricesListActions";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
// import UnComfirmCompany from "./UnComfirmCompany.js";
// import Confirm from "../../../assets/images/buttons/confirm.png";
// import UnConfirm from "../../../assets/images/buttons/unconfirm.png";
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
import ExtendPopup from "../../../components/ExtendPopup";
import UnComfirmModal from "./UnComfirmModal";
import ExtendModal from "./ExtendModal";
import MenuButton from "../../../assets/img/buttons/menu.png";
import Kduyet from "assets/img/buttons/KoDuyet.svg";
import Duyet from "assets/img/buttons/Duyet.svg";
import ViewModal from "./ViewModal";
import ViewPopup from "../../../components/ViewPopup";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyListRequestExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fileUpdate: [],
      field: [],
      price: [],
      detail: null,
      detailView: null,
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
        'index', 'expiredDate', 'requestExtendDate', 'fieldName', 'companyName', 'taxCode', 'phoneNumber',
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
          type: 'date', position: [1, 2]
        },
        {
          type: 'hours', position: []
        }
      ],
      headerTitle: COMPANY_LIST_REQUEST_EXTEND_HEADER,
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
      fetchingExtend: false,
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
    let priceDate = nextProp.price.data;
    const { limit } = this.state;
    const { fetchingUnComfirm, fetchingExtend } = this.state;
    const { requestListRequestExtend } = nextProp;
    let detailsData = nextProp.details.data;

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
                // item['requestExtendDate'] = moment(item.requestExtendDate).format('DD/MM/YYYY');
                // item['expiredDate'] = moment(item.expiredDate).format('DD/MM/YYYY');
                //item['expiredDays'] = moment(addDays(ngayhethan, item['daysLeft'])).format('DD/MM/YYYY')
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
              this.setState({
                data: data.company.companies,
                history: data.company.companies,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }


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
    if (typeof (data.uncomfirm) !== 'undefined') {
      //console.log(data.uncomfirm)

      if (data.status && !fetchingUnComfirm) {
        this.setState({ data: [] });
        requestListRequestExtend(JSON.stringify({
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

    if (typeof (data.extend) !== 'undefined') {
      if (data.status && !fetchingExtend) {
        this.setState({ data: [] });
        requestListRequestExtend(JSON.stringify({
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
  componentUnComfirmMount = (value) => {
    let { data, idRow } = this.state;
    const { requestUnComfirmRequestExtend } = this.props;
    const createData = JSON.stringify({
      id: idRow,
      reason: value.reason
    })
    //this.handleCloseUN(true);
    requestUnComfirmRequestExtend(createData);
    //window.location.reload(true);
  }
  componentWillMount() {
    const { requestFieldStore, getAllPriceList } = this.props;

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
    const { requestListRequestExtend } = this.props;

    requestListRequestExtend(data);
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
    const { requestComfirmRequestExtend } = this.props;
    const createData = JSON.stringify({
      id: detail.id,
      year: value.year
    });


    requestComfirmRequestExtend(createData);
    this.setState({ fetchingUnExtend: false })
  }
  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
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
  //       <div className='edit-item'
  //         onClick={() => {
  //           this.handleCloseUN(true);
  //           this.setState({ uncomfirmCom: ele });
  //         }}

  //         open={openUN}
  //       >
  //         <img src={UnConfirm} alt='khong duyet' title='Không duyệt' />
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
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
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
  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }
  handleNewData = (data) => {
    this.setState({ newData: data });
  }

  handleOpenEdit = (id) => {
    const { requestCompanyGetDetails, requestCompanyGetFileUpdate } = this.props;
    requestCompanyGetFileUpdate(id).then((res) => {
      if (res.data.status === 200) {
        let listXXX = res.data.data;
        listXXX.map(list => {
          if (list.uploadDate) {
            list.sorted_file = list.uploadDate;
          } else {
            list.sorted_file = list.expiredDate;
          }
        })
        let sorted_file = listXXX.sort((a, b) => {
          return new Date(a.sorted_file).getTime() -
            new Date(b.sorted_file).getTime()
        }).reverse();
        this.setState({ fileUpdate: sorted_file })
      }
    })
    requestCompanyGetDetails(id);
    this.setState({ idRow: id })
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        detailView: null,
        errorUpdate: {},
        idRow: null
      });
    }
  };


  handleOpenExten = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }
  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination } = this.props;
    const {
      isLoaded,
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
      typeAlign,
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
      extendModal,
      newData,
      viewModal,
      fileUpdate,
      detailView
    } = this.state;
    const statusPopup = { status: status, message: message };
    let isDisableConfirm = true;
    let isDisableUnconfirm = true;
    if (IS_ADMIN) {
      isDisableConfirm = false;
      isDisableUnconfirm = false;
    } else {
      ACCOUNT_CLAIM_FF.filter(x => x == "RequestExtendCompanies.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "RequestExtendCompanies.Unconfirm").map(y => isDisableUnconfirm = false)
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
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.expiredDate ? moment(item.expiredDate).format('DD/MM/YYYY') : null}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.requestExtendDate ? moment(item.requestExtendDate).format('DD/MM/YYYY') : null}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.companyName}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>

                                      {/* <td>
                                        <div className={classes.editArea}>
                                          
                                          <div className={classes.item}><img src={ViewIcon} alt="Xem" title="Xem" width="25" height="25" /></div>
                                          <div className={classes.item}
                                            onClick={() => {
                                              this.toggleModal('extendModal');
                                              this.handleOpenExten(item.id);
                                            }}
                                          >
                                            <img src={ComfirmIcon} alt="Duyệt" title="Duyệt" />
                                          </div>
                                          <div className={classes.item}
                                            onClick={() => {
                                              this.toggleModal('updateModal');
                                              this.handleOpenEdit(item.id);
                                              this.setState({ detail: item });
                                            }}
                                          >
                                            <img src={UnComfirmIcon} alt="Không duyệt" title="Không duyệt" />
                                          </div>
                                        </div>
                                      </td> */}
                                      <td>
                                        <ButtonDropdown isOpen={item.collapse} toggle={() => {
                                          this.toggle(key, item.id);
                                          this.setState({ itemIdView: item.id })
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
                                            {isDisableConfirm == true || isDisableUnconfirm == true ? null : (
                                              <DropdownItem divider />
                                            )}
                                            {isDisableConfirm == false ? (
                                              <DropdownItem
                                                onClick={() => {
                                                  this.toggleModal('extendModal');
                                                  this.handleOpenExten(item.id);
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
                                                  this.setState({ detail: item });
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

              {
                detailView !== null && (
                  <ViewPopup
                    moduleTitle='Xem thông tin'
                    moduleBody={
                      <ViewModal
                        data={detail}
                        fileUpdate={fileUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    viewModal={viewModal}
                    componentFooter={
                      <div className="modal-footer" style={{ marginRight: '-20px' }}>
                        <div>
                          <Button
                            color="success"
                            type="button"
                            className={`btn-success-cs`}
                            style={{ marginRight: '26px !important', }}
                            onClick={() => {
                              this.toggleModal('extendModal');
                              this.handleOpenExten(this.state.itemIdView);
                              this.toggleModal('viewModal');
                            }}
                          >
                            <img src={Duyet} alt='Duyệt' />
                            <span>Duyệt</span>
                          </Button>
                        </div>
                        <div>
                          <Button
                            color="default"
                            type="button"
                            style={{ backgroundColor: '#FF3333' }}
                            className={`btn-danger-cs`}
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
                      </div>
                    }
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
                  />
                )
              }

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
      // <div className="userAccountPage-container">
      //   {isLoaded ? (
      //     <div className="content-container">
      //       <Table
      //         data={data}
      //         value={COMPANY_LIST_REQUEST_EXTEND_HEADER}
      //         dataMaping={dataMaping}
      //         searchTitle={COMPANY_LIST_REQUEST_EXTEND_HEADER_SEARCH}
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
    company: state.CompanyListRequestExtendStore,
    field: state.FieldStore,
    price: state.PriceStore,
    details: state.CompanyGetDetailsStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionListRequestExtend, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionPriceCreators, dispatch),
    ...bindActionCreators(actionCompanyGetDetails, dispatch),
  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyListRequestExtend);