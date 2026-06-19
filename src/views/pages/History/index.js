import React, { Component } from "react";
import moment from 'moment';
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { HISTORY_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionGetListDate } from "../../../actions/SearchDateHistoryAction";
import { actionCreators } from "../../../actions/UserListActions";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import SearchModal from "./SearchModal";
import ReactDatetime from 'react-datetime'
import { generateStyleTableCol } from '../../../bases/helper';
import { removeDuplicates } from "../../../helpers/common";
import "react-datetime/css/react-datetime.css";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import Select from "components/Select";
import classes from './index.module.css';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import './custom.css';

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Button
} from "reactstrap";

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      user: [],
      dataDefault: null,
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: '',
      history: [],
      fromDate: new Date(),
      toDate: new Date(),
      editStatus: true,
      headerTitle: HISTORY_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "startDate": this.fromDate(new Date()),
        "endDate": this.toDate(new Date()),
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }
    };
    this.refSelect = null;
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.log;
    let { limit, user } = this.state;

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.log) !== 'undefined') {
          if (data.log !== null) {
            if (typeof (data.log.logs) !== 'undefined') {
              data.log.logs.map((item, key) => (
                item['index'] = key + 1,
                item['date'] = moment(item.logTime).format('DD/MM/YYYY'),
                item['hours'] = moment(item.logTime).format('HH:mm'),
                user.push({ id: item['userID'], username: item['userName'] })
              ));

              this.setState({ data: [] });
              this.setState({
                data: data.log.logs,
                user: removeDuplicates(user, item => item.id),
                listLength: data.log.total,
                totalPage: Math.ceil(data.log.logs.length / limit),
                totalElement: Math.min(limit, data.log.logs.length),
                isLoaded: data.isLoading, status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });

            } else {
              this.setState({
                data: data.log.logs,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }
  }

  componentWillMount() {
    const { fromDate, toDate } = this.state;
    const { requestUserListStore } = this.props;
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "startDate": this.fromDate(fromDate),
      "endDate": this.toDate(toDate),
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
    requestUserListStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (res.data.status == 200) {
        this.setState({
          dataUsers: res.data.data.users
        })
      }
    })
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestLogListStore } = this.props;

    requestLogListStore(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
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

  /**
   * handleSelect: Handle Select
   * @param {*} value: value 
   * @param {*} name: name of value 
   */
  handleSelect = (value, name) => {
    let { filter, dataDefault } = this.state;

    filter[name] = value;



    this.setState({ filter, dataDefault: value });
  }

  handleChangeFromDate = (event) => {
    this.setState({
      fromDate: new Date(event)
    });
  }

  handleChangeToDate = (event) => {
    this.setState({
      toDate: new Date(event)
    });
  }
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }
  handleSubmitSearchForm = () => {
    let { filter, fromDate, toDate } = this.state;
    const { requestLogListStore } = this.props;

    filter.startDate = fromDate
    filter.endDate = toDate
    this.setState({ filter })

    requestLogListStore(JSON.stringify(filter));


  }
  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      "startDate": moment(new Date()).format('YYYY-MM-DD'),
      "endDate": moment(new Date()).format('YYYY-MM-DD'),
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }
    this.setState({ filter: clearFilter })

  }
  render() {
    const {
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      user,
      fromDate,
      toDate,
      dataDefault,
      dataUsers
    } = this.state;
    const statusPopup = { status: status, message: message };

    return (
      <>
        {
          <div id="history" className={classes.wrapper}>
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
                        dataReload={() => {
                          this.fetchSummary(
                            JSON.stringify({
                              "startDate": this.fromDate(fromDate),
                              "endDate": this.toDate(toDate),
                              "search": "",
                              "filter": "",
                              "orderBy": "",
                              "page": null,
                              "limit": null
                            })
                          );
                          this.clearFilter();
                          this.setState({ dataDefault: null })
                          this.refSelect.resetValue();
                        }}
                        hideCreate={true}
                        hideSearch={true}
                        typeSearch={
                          <>
                            <div className="div_flex">
                              <div className="mg-div-search">
                                <label className="form-control-label">Từ ngày</label>
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
                                          placeholder: "Từ ngày"
                                        }}
                                        name='fromDate'
                                        value={fromDate}
                                        timeFormat={false}
                                        onChange={(e) => this.handleChangeFromDate(e)}
                                      />
                                    </InputGroup>
                                  </FormGroup>
                                </div>
                              </div>
                              <div className="mg-div-search">
                                <label className="form-control-label">Đến ngày</label>
                                <div>
                                  <FormGroup>
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
                                        name='toDate'
                                        value={toDate}
                                        timeFormat={false}
                                        onChange={(e) => this.handleChangeToDate(e)}
                                      />
                                    </InputGroup>
                                  </FormGroup>
                                </div>
                              </div>
                              <div className="mg-div-search">
                                <label className="form-control-label">Người dùng</label>
                                <div>
                                  <Select
                                    ref={ref => this.refSelect = ref}
                                    name="filter"
                                    title='Chọn người dùng'
                                    defaultValue={dataDefault}
                                    data={dataUsers}
                                    labelName='fullName'
                                    val='id'
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
                        searchForm={
                          <SearchModal
                            filter={filter}
                            data={user}
                            dataDefault={dataDefault}
                            handleChangeFromDate={this.handleChangeFromDate}
                            handleChangeToDate={this.handleChangeToDate}
                            handleChangeFilter={this.handleChangeFilter}
                            handleSelect={this.handleSelect}
                            fromDate={fromDate}
                            toDate={toDate}
                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center table-css-history" responsive>
                          <HeadTitleTable headerTitle={headerTitle} hideEdit={true}
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
                                      <td style={{ textAlign: 'center' }} className='table-scale-col color-black'>
                                        <span className="css-table-date">
                                          {item.hours}
                                        </span>&nbsp;
                                        <span>{item.date}</span>
                                      </td>
                                      {/* <td style={{ textAlign: 'center' }} className='table-scale-col color-black'></td> */}
                                      <td style={{ textAlign: 'left' }} className='table-scale-col color-black'>{item.userName}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col color-black'>{item.actions}</td>
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
                          <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
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
          </div>
        }
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    log: state.SearchDateHistory,
    user: state.UserListStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionGetListDate, dispatch),
    ...bindActionCreators(actionCreators, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(History);
