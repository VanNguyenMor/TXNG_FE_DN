import React, { Component } from 'react'
import compose from 'recompose/compose';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { actionStampProvideList } from '../../../../../actions/StampProvideActions';
import { platingZoneAction } from '../../../../../actions/PlantingZoneAction';
import moment from 'moment';
import { PLEASE_CHECK_CONNECT } from '../../../../../services/Common';
import { LOADING_TIME } from '../../../../../helpers/constant'
import NoImg from '../../../../../assets/img/NoImg/NoImg.jpg';
import classes from '../index.module.css'
import { Container, Row, Spinner, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class ListBoxStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      limit: 10,
      isLoaded: null,
      fetching: false,
      statusList: [
        { name: 'Chờ duyệt', status: 1 },
        { name: 'Đã duyệt', status: 2 },
        { name: 'Không duyệt', status: 3 }
      ],
      statusPrint: [
        { name: 'Chưa in', printStatus: 0 },
        { name: 'Đã in', printStatus: 1 },
        { name: 'Đã giao', printStatus: 2 }
      ],
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    const { data } = nextProps.stampProvide;
    const { limit, fetching } = this.state
    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.stampprovide) !== 'undefined') {
          if (data.stampprovide !== null) {
            if (typeof (data.stampprovide.stamps) !== 'undefined') {
              data.stampprovide.stamps.map((item, key) => {
                if (item.status == 1) {
                  item['statusName'] = 'Chờ duyệt'

                } else if (item.status == 2) {
                  item['statusName'] = 'Đã duyệt'
                } else if (item.status == 3) {
                  item['statusName'] = 'Không duyệt'
                };
                item['index'] = key + 1;
                item['collapse'] = false;
                item['requestedDate'] = item.requestedDate ? moment(item.requestedDate).format('DD/MM/YYYY') : '';
                item['confirmedDate'] = item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYY') : '';

              });
              this.setState({
                data: data.stampprovide.stamps,
                history: data.stampprovide.stamps,
                listLength: data.stampprovide.total,
                totalPage: Math.ceil(data.stampprovide.stamps.length / limit),
                isLoaded: data.isLoading,
                totalElement: data.stampprovide.total > limit ? limit : data.stampprovide.total,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                history: data.stampprovide.stamps,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        // if (typeof (data.confirm) !== 'undefined') {
        //     if (fetching) {
        //         this.setState({ data: [] });
        //         this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "Status ASC, RequestedDate DESC", "page": null, "limit": null }));
        //         this.setState({ fetching: false });
        //     }

        //     setTimeout(() => {
        //         this.setState({
        //             isLoaded: false,
        //             status: data.status,
        //             message: PLEASE_CHECK_CONNECT(data.message)
        //         });
        //     }, 500);
        // }

        // if (typeof (data.unconfirm) !== 'undefined') {
        //     if (fetching) {
        //         this.setState({ data: [] });
        //         this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "Status ASC, RequestedDate DESC", "page": null, "limit": null }));
        //         this.setState({ fetching: false });
        //     }

        //     setTimeout(() => {
        //         this.setState({
        //             isLoaded: false,
        //             status: data.status,
        //             message: PLEASE_CHECK_CONNECT(data.message)
        //         });
        //     }, 500);
        // }
      }
    }

  }
  componentDidMount() {
    // const { requestStampProvideList } = this.state
    const { stampProvide, requestStampProvideList, getListPlantingZone } = this.props;
    

    requestStampProvideList(JSON.stringify(
      {
        "status": null,
        "printStatus": null,
        "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
        "toDate": new Date(),
        "fieldId": "",
        "companyName": "",
        "taxCode": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }
    )).then(res => {
      // console.log(res);
    })
  }
  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }
  andleStyleStatus = (status) => {
    if (status === 1) {
      return classes.notYesStt;
    }
    if (status == 2) {
      return classes.activeSta;
    }
    if (status == 3) {
      return classes.noActiveSta;
    };
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }
  render() {
    const { data, isLoaded } = this.state
    return (
      <>
        {
          isLoaded ? (<div style={{ display: 'table', margin: 'auto' }}>
            <Spinner style={{ width: '2rem', height: '2rem' }} />
          </div>) : (
          <>
            <div className='body-box-list'>
              <table className='table-box-list'>
                <thead>
                  <tr className='table-tr-box-list'>
                    <th>Doanh nghiệp</th>
                    <th>Thông tin</th>

                    <th>Ghi chú</th>
                  </tr>

                </thead>
                <tbody>
                  {
                    Array.isArray(data) && (
                      data.map((item, key) => (
                        <tr key={key} className="table-hover-css">
                          <td className='text-algin-text'>
                            <p className='text-td '>
                              {item.companyName}
                            </p>
                            <i className='text-td' style={{ fontSize: 12 }}>{item.address}</i>
                          </td>
                          <td className='text-td text-algin-text'>
                            Số lượng mã QR:&nbsp;{item.requested}<br />
                            Số lượng mỗi mã QR:&nbsp;{item.quantity}<br />
                            Ngày yêu cầu:&nbsp;{item.requestedDate}
                          </td>

                          <td className='text-td'>
                            <p className={`${this.andleStyleStatus(item.status)} text-center-status`}>
                              {item.statusName}
                            </p>
                          </td>
                        </tr>
                      ))
                    )
                  }

                </tbody>
              </table>
            </div>

          </>)
        }
        <div className='footer-box-list'>
          <NavLink to='/trang_chu/quan_ly_cap_phat_tem'>Xem thêm</NavLink>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    stampProvide: state.StampProvideStore,
    plantingZone: state.PlantingZoneStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionStampProvideList, dispatch),
    ...bindActionCreators(platingZoneAction, dispatch)
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ListBoxStamp)