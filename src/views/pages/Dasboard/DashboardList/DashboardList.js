import React, { Component } from 'react'
import compose from 'recompose/compose';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { actionStampProvideList } from '../../../../actions/StampProvideActions';
import { platingZoneAction } from '../../../../actions/PlantingZoneAction';
import './DashboardList.css'
import moment from 'moment';
import classes from './index.module.css'
import { PLEASE_CHECK_CONNECT } from '../../../../services/Common';
import { LOADING_TIME } from '../../../../helpers/constant'
import NoImg from '../../../../assets/img/NoImg/NoImg.jpg';
import ListBoxStamp from './ListBox/ListBoxStamp';
import ListBoxProduct from './ListBox/ListBoxProduct';
import { Container, Row, Spinner, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class DashboardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
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
    let isDisableViewPlantingZone = true;
    let isDisableViewStamp = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN')) == true) {
      isDisableViewPlantingZone = false;
      isDisableViewStamp = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");
      ACCOUNT_CLAIM_FF.filter(x => x == "StampRequests.View").map(y => isDisableViewStamp = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "PlantingZones.View").map(y => isDisableViewPlantingZone = false)
    }
    if (isDisableViewPlantingZone == false) {
      getListPlantingZone(JSON.stringify
        ({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        })).then(res => {
          // console.log(res.data.data.plantingZones);
          this.setState({ dataPlanting: res.data.data.plantingZones })
        })
    }
    if (isDisableViewStamp == false) {
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
    this.setState({ isDisableViewPlantingZone, isDisableViewStamp })
  }
  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }
  andleStyleStatus = (status) => {
    if (status === 1) {
      return classes.notyetStt;
    }
    if (status == 2) {
      return classes.activeStt;
    }
    if (status == 3) {
      return classes.noActiveStt;
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
  onChooseTab = tab => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        currentTab: tab
      }
    }, () => {
      if (tab == 0) {
        // this.onChangeLogoInfoCompany();
        // this.getInfoCompany();
        // this.onSaveInfoCompany()
      } else if (tab == 1) {
        // this.getInfoCompany();
      }
      // } else if (tab == 2) {
      //     this.getListConfigServer();
      // } else if (tab == 3) {
      //     this.getListStampTemplate();
      // }
      else if (tab == 4) {
        // this.getListAlert();
      }
    });
  }

  render() {
    const { isDisableViewPlantingZone, isDisableViewStamp } = this.state;
    const { data, isLoaded, dataPlanting, currentTab } = this.state

    return (
      <>
        <section style={{ marginBottom: 100 }}>
          <Row>
            {isDisableViewStamp == false && (
              <Col xs='12' xl='8' lg='8' className='mr-t-box'>
                <div className='box-list mr-b-5 '>
                  <div className='header-box-list box-list-border'>
                    <h4>Danh sách </h4>
                  </div>
                  <div className='config-system-chart'>
                    <div className='config-system-tab'>

                      <div onClick={this.onChooseTab(0)} className={`chart-tab-item ${currentTab === 0 ? 'active' : ""}`}>Cấp phát tem</div>

                      {/* <div onClick={this.onChooseTab(1)} className={`chart-tab-item ${currentTab === 1 ? 'active' : ""}`}>Danh sách sản phẩm chờ duyệt</div> */}

                    </div>
                    <div className='config-system-content'>
                      {
                        isDisableViewStamp == false &&
                          currentTab === 0 ? (<>
                            <div className='chart-item-info'>
                              <div>
                                <ListBoxStamp />
                              </div>
                            </div>
                          </>) : null
                      }
                      {
                        currentTab === 1 ? (<>
                          <div className='chart-item-info'>
                            <div>
                              {/* <ListBoxProduct /> */}
                            </div>
                          </div>
                        </>) : null
                      }
                    </div>
                  </div>
                </div>
              </Col>
            )}

            {isDisableViewPlantingZone == false && (
              <Col xs='12' xl='4' lg='4' className='mr-t-box '>
                <div className='box-list mr-b-5 '>
                  <div className='header-box-list box-list-border'>
                    <h4>Vùng sản xuất được thêm gần đây</h4>
                  </div>
                  {
                    isLoaded ? (<>
                      <div style={{ display: 'table', margin: 'auto' }}>
                        <Spinner style={{ width: '2rem', height: '2rem' }} />
                      </div>
                    </>) : (
                      <>
                        <div className='body-box-list'>
                          {
                            Array.isArray(dataPlanting) && (
                              dataPlanting.map((item, key) => (
                                <div key={key} className=' mrg-10 mr-bottom'>
                                  <Row key={key} className=" mrg-10">
                                    <div className='col-3 '>
                                      <img src={item.icon ? item.icon : NoImg} alt="..." style={{ width: 60, height: 60 }} />
                                    </div>
                                    <div className='col-9'>
                                      <div className='box-text'>
                                        <span className='info-box-text' style={{ fontWeight: 600 }}>{item.name}</span>
                                        <span className='info-box-text'>thuộc: <i>{item.plantingTypeName}</i></span>
                                      </div>

                                    </div>
                                  </Row>
                                </div>
                              ))
                            )
                          }
                        </div>
                      </>
                    )
                  }
                  <div className='footer-box-list'>
                    <NavLink to='/trang_chu/vung_trong'>Xem thêm</NavLink>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </section>
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
)(DashboardList)