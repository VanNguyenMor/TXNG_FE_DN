import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionUnit } from "../../../actions/UnitActions";
import { TRACE } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, IS_ADMIN } from "../../../services/Common";
import moment from 'moment';
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import PopupMessage from "../../../components/PopupMessage";
import ViewPopup from "../../../components/ViewPopup";
import ViewModal from "./ViewModal";
import SelectSearch, { fuzzySearch } from "react-select-search";
import SelectTree from "components/SelectTree";
import { handleGenTree } from "../../../helpers/trees";
import SelectParent from "components/SelectParent";
import './trace.css'
import { actionField } from "../../../actions/FieldActions.js";
import { actionProductGroup } from "../../../actions/ProductGroupActions";
import { actionTrace } from "../../../actions/TraceActions";
import { actionCompanyListRegistered } from "../../../actions/CompanyListRegisteredActions";
import SearchModal from './SearchModal';
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import ReactDatetime from "react-datetime";


import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup
} from "reactstrap";

class Trace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      product: [],
      field: [],
      detail: null,
      isLoaded: null,
      status: null,
      open: false,
      message: '',
      searchData: [],
      company: [],
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),

      toDate: new Date(),
      headerTitle: TRACE,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      deleteItem: null,
      dropdownOpen: false,
      warningPopupModal: false,
      options: [],
      filter: {
        "companyID": "",
        "startDate": new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        "endDate": new Date(),
        "status": null,
        "field": "",
        "product": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.trace;
    const { limit } = this.state;
    let fieldData = nextProp.field.data;
    let haveRoot = false;
    let fieldDataParent = [];
    let productData = nextProp.productGroup.data;

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.list) !== 'undefined') {
          if (data.list !== null) {
            if (typeof (data.list.traces) !== 'undefined') {
              data.list.traces.map((item, key) => {
                item['index'] = key + 1;
                item['thumbnail'] = <img src={item.Avatar ? item.Avatar : NoImg} style={{ width: 450, height: 300 }} />
              })

              this.setState({
                data: data.list.traces,
                listLength: data.list.traces.length,
                totalPage: Math.ceil(data.list.traces.length / limit),
                isLoaded: data.isLoading, status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });

            } else {
              this.setState({
                data: data.list.traces,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }

    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {
            if (typeof (fieldData.field.fields) !== 'undefined') {
              fieldData.field.fields
                .filter(item => item.parentID === null)
                .map(item => haveRoot = true);

              if (haveRoot) {
                fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1;

                });
              } else {
                // Search Element in tree
                fieldData.field.fields.map(
                  (item, key, array) => (
                    key === 0 && (item.parentID = null)
                  ));

                fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1
                });
              }
            }

            this.setState({
              field: fieldDataParent,
              fieldAll: fieldData.field.fields,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              field: [],
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }
    if (productData != this.state.product) {
      if (typeof (productData) !== 'undefined') {
        if (productData.list !== null) {
          if (typeof (productData.list) !== 'undefined') {
            if (typeof (productData.list.productGroups) !== 'undefined') {
              this.setState({
                product: productData.list.productGroups,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              })
            }
          }
        }
      }
    }
  }

  componentWillMount() {
    const { requestCompanyAll, requestFieldStore, requestListProductGroup, } = this.props;
    const { fromDate, toDate } = this.state;
    const dataCompany = {
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
    }
    requestCompanyAll(dataCompany).then(res => {
      if (res.status == true) {
        const data = (res.data || {}).data || [];
        let oppss = [{
          address: "",
          companyName: "--- Chọn Doanh nghiệp/Người sản xuất ---",
          fieldName: "",
          id: "",
          //isCertified: false,
          phoneNumber: "",
          registeredDate: "",
          taxCode: "",
        }]
        let ccopps = oppss.concat(data.companies)
        if (data) {
          this.setState(previousState => {
            return {
              ...previousState,
              dataCompany: data.companies,
              //valueDr: data.companies,
              options: ccopps,
            }
          });
        }
      }
    })

    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      // this.setState({ currentFilter: res.data.data.fields[16].id })
      //this.setState({ currentFilter: res.data.data.fields[16].id })
      this.fetchSummary(JSON.stringify({
        "search": "",
        // "filter": res.data.data.fields[16].id,
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }));
    })

    requestListProductGroup(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }))

    this.fetchSummary(JSON.stringify({
      "companyID": "",
      "startDate": fromDate,
      "endDate": toDate,
      "status": null,
      "field": "",
      "product": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }))

  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestListTrace } = this.props;
    requestListTrace(data);
  }

  searchTable = (event) => {
    let { data } = this.state;
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

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
      });
    }
  };

  clearFilter = () => {
    const { fromDate, toDate } = this.state;
    let clearFilter = {
      "companyID": "",
      "startDate": fromDate,
      "endDate": toDate,
      "status": null,
      "field": "",
      "product": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }
    this.setState({ filter: clearFilter })
  }

  handleChangeFilter = (event) => {

    let { filter } = this.state;
    const ev = event.target;
    // console.log(ev, 1111);
    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }
  handleSubmitSearchForm = () => {
    let { filter, fromDate, toDate } = this.state;
    const { requestListTrace } = this.props;

    filter.startDate = fromDate
    filter.endDate = toDate
    this.setState({ filter })

    requestListTrace(JSON.stringify(filter));
    this.clearFilter();

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

  onSelectChange = (value, name) => {
    let { filter } = this.state;
    if (name == 'startDate') { filter['startDate'] = new Date(value); this.setState({ fromDate: new Date(value) }) }
    if (name == 'endDate') { filter['endDate'] = new Date(value); this.setState({ toDate: new Date(value) }) }
    if (value === null) value = "";
    filter[name] = value;

    this.setState({ filter });

  }
  onComfirmSearch = () => {
    const { filter } = this.state;
    this.fetchSummary(JSON.stringify(filter));
  }

  onHandleGet = (item) => {
    const { requestGetTrace, requestGetHistoryTrace } = this.props;
    requestGetTrace(item.ID + '&companyId=' + item.CompanyID).then(res => {
      if (res.data.status == 200) {
        let data = res.data.data || {};
        let dataInformSelects = data.informSelects || [];
        let dataTrace = data.trace || {};
        this.setState(previousState => {
          return {
            ...previousState,
            dataInformSelects,
            dataTrace
          }
        })

      }

      let reqGetHis = {
        "companyID": item.CompanyID,
        "traceID": item.ID,
        "page": 0,
        "limit": 200
      }

      requestGetHistoryTrace(reqGetHis).then((res) => {
        if (res.data.status == 200) {
          let data = res.data.data || {};
          let dataTraceInforms = data.traceInforms;
          this.setState(previousState => {
            return {
              ...previousState,
              dataTraceInforms
            }
          })
          //let contents = [];
          // dataTraceInforms.map((item, key) => {
          //   contents = JSON.parse(item.contents || '[]') || [];
          // })
          // this.setState(previousState => {
          //   return {
          //     ...previousState,
          //     contents
          //   }
          // })
        }
      })
    })
  }

  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      headerTitle,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      popupMessage,
      errNoti,
      options,
      field,
      fieldAll,
      currentFilter,
      product,
      fromDate,
      toDate,
      viewModal
    } = this.state;
    const statusPopup = { status: status, message: message };

    options.map(option => {
      option.name = option.companyName;
      option.value = option.id;
    })

    return (
      <>
        {
          <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
            <Container fluid className={typeof (hookSpacing) !== 'undefined' ? hookSpacing : ''}>
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
                            "companyID": "",
                            "startDate": fromDate,
                            "endDate": toDate,
                            "status": null,
                            "field": "",
                            "product": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null
                          }))}
                        hideCreate={true}
                        hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
                        searchForm={
                          <SearchModal
                            filter={filter}
                            handleChangeFilter={this.handleChangeFilter}
                            
                            onSelectChange={this.onSelectChange}
                            product={product}
                            options={options}
                            field={field}
                            fieldAll={fieldAll}
                            selected={currentFilter}
                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}

                      />

                      {/* Table */}
                      {/* <div className="row">
                        <div className="col-3">
                          <label className="form-control-label" >Từ ngày</label>
                          <FormGroup>
                            <InputGroup className="input-group-alternative css-border-input">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <ReactDatetime
                                inputProps={{
                                  placeholder: "Từ ngày"
                                }}
                                name='fromDate'
                                value={fromDate}
                                timeFormat={false}
                                onChange={(e) => this.onSelectChange(e, 'startDate')}
                              />
                            </InputGroup>
                          </FormGroup>
                        </div>
                        <div className="col-3">
                          <label className="form-control-label" >Đến ngày</label>
                          <FormGroup>
                            <InputGroup className="input-group-alternative css-border-input">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <ReactDatetime
                                inputProps={{
                                  placeholder: "Đến ngày"
                                }}
                                name='toDate'
                                value={toDate}
                                timeFormat={false}
                                onChange={(e) => this.onSelectChange(e, 'endDate')}
                              />
                            </InputGroup>
                          </FormGroup>
                        </div>
                      </div> */}
                      {/* <div className="row" style={{ marginBottom: 15 }}>
                        <div className="col-3">
                          <label className="form-control-label" >Doanh nghiệp/Người sản xuất</label>
                          <div style={{ width: '100%', }}>
                            <SelectSearch
                              options={options}
                              value={options.id}
                              name='companyID'
                              //className={`${classes.selectSearchBox} select-search-box`}
                              onChange={(value) => this.onSelectChange(value, 'companyID')}
                              search
                              filterOptions={fuzzySearch}
                              placeholder="Tìm kiếm..."
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <label
                            className="form-control-label"
                          >
                            Ngành nghề
                          </label>
                          <div>
                            <SelectTree
                              //hidenTitle={true}
                              title='Chọn ngành nghề'
                              data={field}
                              dataAll={fieldAll}
                              name='field'
                              // disableParent={true}
                              selected={currentFilter}
                              labelName='fieldName'
                              fieldName='fieldName'
                              val='id'
                              handleChange={this.onSelectChange}
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <label
                            className="form-control-label"
                          >
                            Sản phẩm
                          </label>
                          <div>

                            <SelectParent
                              labelName='name'
                              data={product}
                              val='id'
                              name='product'
                              parentId='materialGroupID'
                              parentName='materialGroupName'
                              title='Chọn sản phẩm'
                              handleChange={this.onSelectChange}
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <label
                            className="form-control-label"
                          >&nbsp;</label>
                          <Button
                            style={{ margin: 0 }}
                            className='btn-warning-cs'
                            color="default" type="button" size="md"
                            onClick={() => this.onComfirmSearch()
                            }
                          >
                            <img src={SearchImg} alt='Tìm kiếm' />
                            <span>Tìm kiếm</span>
                          </Button>
                        </div>
                      </div> */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-trace" responsive>
                          <HeadTitleTable headerTitle={headerTitle} hideEdit
                            classHeaderColumns={{
                              0: 'table-scale-col table-user-col-1'
                            }}
                          />
                          <tbody ref={ref => this.tableBody = ref}>
                            <>
                              {
                                Array.isArray(data) && (
                                  data
                                    .filter((item, key) => key >= beginItem && key < endItem)
                                    .map((item, key) => (
                                      <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css" >
                                        <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                        <td style={{ textAlign: 'center' }} className='table-scale-col img-trace'>{item.thumbnail}</td>
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                          <span
                                            onClick={() => {
                                              this.onHandleGet(item);
                                              this.toggleModal('viewModal')
                                            }}
                                            style={{ fontWeight: 'bold', color: '#09b2fd', cursor: 'pointer' }}>
                                            {item.ProductName}
                                          </span><br />
                                          <span>Mã sản phẩm: {item.ProductName}</span><br />
                                          <span>BarCode: {item.BarCode}</span><br />
                                          <span>Xuất xứ: {item.NationName}</span>
                                        </td>
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                          {item.CompanyName}<br />
                                          <i>{item.address}</i>
                                        </td>
                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                          <span
                                            onClick={() => {
                                              this.onHandleGet(item);
                                              this.toggleModal('viewModal')
                                            }}
                                            style={{ fontWeight: 'bold', color: '#09b2fd', cursor: 'pointer' }}>
                                            {item.NameCode}
                                          </span><br />
                                          <span>Ngày bắt đầu: {moment(item.CreatedDate).format('DD/MM/YYYY')}</span><br />
                                          <span>Vị trí: {item.PlantingZone}</span>
                                        </td>
                                      </tr>
                                    ))
                                )
                              }
                            </>
                          </tbody>
                        </Table>
                      </Card>
                      {
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
              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={errNoti}
                toggleModal={this.toggleModal}
              />

              <ViewPopup
                moduleTitle='Xem nhật ký'
                moduleBody={
                  <ViewModal
                    dataTrace={this.state.dataTrace}
                    dataTraceInforms={this.state.dataTraceInforms}
                  />}
                viewModal={viewModal}
                toggleModal={this.toggleModal}
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
    )
  }

}
const mapStateToProps = (state) => {
  return {
    unit: state.UnitStore,
    dataCompany: state.CompanyListRegisteredStore,
    field: state.FieldStore,
    productGroup: state.ProductGroupStore,
    trace: state.TraceStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionUnit, dispatch),
    ...bindActionCreators(actionCompanyListRegistered, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionProductGroup, dispatch),
    ...bindActionCreators(actionTrace, dispatch),
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Trace);