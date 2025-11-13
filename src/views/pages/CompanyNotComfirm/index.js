import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionCompanyNotComfirm } from "../../../actions/CompanyNotComfirmActions";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { COMPANY_NOT_COMFIRM_HEADER, COMPANY_NOT_COMFIRM_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
//import Loader from "../../../components/Loader/Loader";
//import Table from "../../../components/Table/Table";
//import Button from '@material-ui/core/Button';
//import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import moment from 'moment';
import EditIcon from "../../../assets/img/buttons/edit.svg";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import SearchModal from "./SearchModal";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import ViewPopup from "../../../components/ViewPopup";
import ViewModal from "./ViewModal";
import Duyet from "assets/img/buttons/Duyet.svg";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class CompanyNotComfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      province: [],
      district: [],
      ward: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'reason', 'fieldName', 'companyName', 'taxCode', 'phoneNumber', 'address', 'confirmedDate', 'confirmedBy',
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
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
      headerTitle: COMPANY_NOT_COMFIRM_HEADER,
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
                // item['confirmedDate'] = moment(item.confirmedDate).format('DD/MM/YYYY')
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

  componentWillMount() {
    const { requestFieldStore } = this.props;
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
    getProvinceList();
    getDistrictList();
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

  handleOpenEdit = (id) => {
    const { requestCompanyGetDetails } = this.props;

    requestCompanyGetDetails(id);
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestCompanyNotComfrim } = this.props;

    requestCompanyNotComfrim(data);
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
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        detailView: null
      });
    }
  };

  handleComfirmRow = () => {
    const { requestCompanyComfirmStore, requestCompanyNotComfrim } = this.props;
    let { data, comfirmItem } = this.state;
    let newData = data.filter(item => item.id === comfirmItem).map((item, key) => {
      item.status = 0
    });

    requestCompanyComfirmStore(comfirmItem)
      .then(res => (
        res.status === 200 ? (
          requestCompanyNotComfrim(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })),
          this.toggleModal('viewModal')
        ) : (
          this.setState({
            comfirm: [],
            isLoading: true,
            status: false,
            message: PLEASE_CHECK_CONNECT(res.message),
            errmessage: PLEASE_CHECK_CONNECT(res.message)
          }),
          this.toggleModal('popupMessage')
        )
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

  render() {
    // const { classes } = this.props;
    const { isLoaded,
      status,
      message,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      field,
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
      detailView,
      viewModal,
      errmessage,
      popupMessage
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
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody ref={ref => this.tableBody = ref}>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
                                      <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                      {/* <td className={`${item.status === 0 || item.status === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}</td> */}
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.reason}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                                      {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                        <span><strong>{item.companyName}</strong></span><br />
                                        <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                                      </td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                      {/* <td style={{ textAlign: 'left' }}>{item.address}</td> */}
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>{moment(item.confirmedDate).format('DD/MM/YYYY')}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.confirmedBy}</td>
                                      {/* <td>
                                        <div className={classes.editArea}>
                                          
                                          <div className={classes.item}><img src={ViewIcon} alt="Xem" title="Xem" width="25" height="25" /></div>
                                        </div>
                                      </td> */}
                                      <td>
                                        <ButtonDropdown
                                          isOpen={item.collapse}
                                          toggle={() => {
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
                        data={detailView}
                      />
                    }
                    componentFooter={
                      <div className="modal-footer" style={{ marginRight: '-20px' }}>
                        <div>
                          <Button
                            color="success"
                            type="button"
                            className={`btn-success-cs`}
                            style={{ marginRight: '26px !important' }}
                            onClick={() => {
                              this.toggleModal('warningPopupModal');
                              this.setState({ comfirmItem: this.state.itemIdView })
                            }}
                          >
                            <img src={Duyet} alt='Duyệt' />
                            <span>Duyệt</span>
                          </Button>
                        </div>
                      </div>
                    }
                    viewModal={viewModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
                  />
                )
              }
              {
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
              }
              {errmessage != '' ? (
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
    company: state.CompanyNotComfirmStore,
    field: state.FieldStore,
    location: state.LocationStore,
    details: state.CompanyGetDetailsStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionCompanyNotComfirm, dispatch),
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
)(CompanyNotComfirm);