import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGrowthStampReports } from "../../../actions/GrowthStampReportsActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import moment from 'moment';
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import { Bar } from 'react-chartjs-2';
import Select from "components/Select";
import ReactDatetime from 'react-datetime'
import { REPORT_ZONING_PRODUCT } from "../../../helpers/constant";


import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
} from "reactstrap";

class ReportZoningProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      district: null,
      ward: null,
      headerTitle: REPORT_ZONING_PRODUCT
    }
    this.redSelectWard = null;
    this.redSelectDis = null;
  }

  componentWillReceiveProps(nextProp) {

  }
  componentWillMount() {
    const { getDistrictList } = this.props;
    getDistrictList().then(res => {

      if (((res || {}).data || {}).status == 200) {
        this.setState(previousState => {
          return {
            ...previousState,
            district: (((res || {}).data || {}).data || []),
          }
        })
      }
    })
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handleSelectDis = (value) => {
    if (this.redSelectWard) {
      this.redSelectWard.resetValue();
    }
    const { getWardList } = this.props;
    let { yearM, yearQ, isChecked, dataYear } = this.state;
    if (value == null) { value = '' }
    if (value) {
      getWardList(value).then(res => {

        if (((res || {}).data || {}).status == 200) {
          this.setState(previousState => {
            return {
              ...previousState,
              ward: (((res || {}).data || {}).data || []),
            }
          })
        }
      })
    }
    this.setState({ districtId: value })
    // if (isChecked == 1) {
    //   this.fetchSummary(yearM + '&districtId=' + value);
    // } else if (isChecked == 2) {
    //   this.fetchSummaryQuarter(yearQ + '&districtId=' + value)
    // } else if (isChecked == 3) {
    //   this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY + '&districtId=' + value)
    // }
  }

  handleChangeDate = (name, value) => {
    if (value) {
      this.setState(previousState => {
        return {
          ...previousState,
          [name]: value
        }
      })
    }
  }

  render() {
    const { } = this.props;
    const {
      district,
      ward,
      fromDate,
      toDate,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      data,
      headerTitle
    } = this.state;

    // const statusPopup = { status: status, message: message };

    return (
      <>
        {
          <div className={classes.wrapper}>
            <Container fluid>
              <Row responsive={1}>
                <div className="col-11" >
                  <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <label className="form-control-label" >Từ ngày</label>
                      <div >
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
                              onChange={(e) => this.handleChangeDate('fromDate', e)}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </div>
                    <div>
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
                              onChange={(e) => this.handleChangeDate('toDate', e)}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </div>
                    {/* <div>Chọn quận huyện</div> */}
                    <div>
                      <label className="form-control-label">Quận/Huyện</label>
                      <Select
                        //name="status"
                        title='Chọn quận huyện'
                        ref={ref => this.redSelectDis = ref}
                        data={district}
                        labelName='districtName'
                        val='id'
                        handleChange={this.handleSelectDis}
                      />
                    </div>
                    {/* <div>Chọn phường xã</div> */}
                    <div>
                      <label className="form-control-label">Phường/Xã</label>
                      <Select
                        //name="status"
                        title='Chọn phường xã'
                        isDisable={this.state.districtId ? false : true}
                        ref={ref => this.redSelect = ref}
                        data={ward}
                        labelName='wardName'
                        val='id'
                        handleChange={this.handleSelectWar}
                      />
                    </div>

                  </div>
                  <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <label className="form-control-label">Loại sản phẩm</label>
                      <Select
                        //name="status"
                        title='Chọn quận huyện'
                        ref={ref => this.redSelectDis = ref}
                        data={district}
                        labelName='districtName'
                        val='id'
                        handleChange={this.handleSelectDis}
                      />
                    </div>
                    <div>
                      <label className="form-control-label">Vùng</label>
                      <Select
                        //name="status"
                        title='Chọn quận huyện'
                        ref={ref => this.redSelectDis = ref}
                        data={district}
                        labelName='districtName'
                        val='id'
                        handleChange={this.handleSelectDis}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-1"
                  style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                  <Button style={{ margin: '1px 0px', color: '#fff', backgroundColor: 'rgba(2, 131, 15, 1)' }}>XEM</Button>
                  <Button style={{ margin: '1px 0px', color: '#fff', backgroundColor: '#ed4f2c' }}>IN</Button>
                  <Button style={{ margin: '1px 0px', color: '#fff', backgroundColor: '#11C7EF' }}>EXCEL</Button>
                </div>


              </Row>
              <hr style={{ borderColor: '#000' }} />
              <h3 className={`${classes.text} ${classes.textLable}`}> BÁO CÁO QUY HOẠCH VÙNG SẢN XUẤT THEO LOẠI SẢN PHẨM</h3>
              <div className="row" style={{ justifyContent: 'center' }}>
                <p className={`${classes.text} ${classes.textDate}`}>Từ ngày {moment(fromDate).format("DD/MM/YYYY")}</p>&nbsp; <p className={`${classes.text} ${classes.textDate}`}>Đến ngày {moment(toDate).format("DD/MM/YYYY")}</p>&nbsp;
              </div>

              <Card className="shadow">

                <Table className="align-items-center tablecs table-css-CompanyAwait" responsive style={{ height: 300 }}>
                  <HeadTitleTable headerTitle={headerTitle}
                    classHeaderColumns={{
                      0: 'table-scale-col table-user-col-1'
                    }}
                    hideEdit={true}
                  />

                  <tbody ref={ref => this.tableBody = ref}>
                    {
                      Array.isArray(data) && (
                        data
                          .filter((item, key) => key >= beginItem && key < endItem)
                          .map((item, key) => (
                            <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
                              <td className='table-scale-col table-user-col-1'>{item.index}</td>
                              <td className='table-scale-col' style={{ textAlign: 'center' }}>
                                {item.status === 0 ? (<>
                                  <span className={classes.noActiveStt}>Chưa duyệt</span>
                                </>) : ''}
                                {item.status === 4 ? (<>
                                  <span className={classes.activeStt}>Chờ bổ sung</span>
                                </>) : ''}
                              </td>
                              <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.fieldName}</td>
                              {/* <td style={{ textAlign: 'left' }}>{item.companyName}</td> */}
                              <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                <span><strong>{item.companyName}</strong></span><br />
                                <span style={{ fontStyle: 'italic' }}>{item.address}</span>
                              </td>
                              <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                              <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                            </tr>
                          ))
                      )
                    }
                  </tbody>
                </Table>

              </Card>
            </Container>
          </div>
        }
      </>
    )
  }

}
const mapStateToProps = (state) => {
  return {
    location: state.LocationStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionLocationCreators, dispatch),
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ReportZoningProduct);