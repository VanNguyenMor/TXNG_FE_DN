/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import BackGroundImg from "../assets/img/BackGround/BackgroundLogin.jpg"
import { getCookie, deleteCookie } from "../helpers/cookie";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Spinner
} from "reactstrap";

import Header from "components/Headers/Header.js";

import compose from 'recompose/compose';
import { PLEASE_CHECK_CONNECT } from "../services/Common";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionDashboardCreators } from "../actions/DashboardActions";
import { actionStampProvideList } from '../actions/StampProvideActions'
import CompanyAwait from "../views/pages/CompanyAwait";
import DashboardReportByMonth from "../views/pages/DashboardReportByMonth";
import DashboardHistory from "../views/pages/DashboardHistory";
import DashboardRegisterList from "../views/pages/DashboardRegisterList";
import DashboardLibilitiesStamp from "../views/pages/DashboardLibilitiesStamp";
import { LOADING_TIME } from "../helpers/constant";
import DashboardBox from "./pages/Dasboard/DashboardBox/DashboardBox";
import DashboardList from "./pages/Dasboard/DashboardList/DashboardList";
import DashboardChart from "./pages/Dasboard/DashboardChart/DashboardChart";

import classes from "./index.module.css";
import axios from "axios";
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      registerList: null,
      stampList: null,
      isLoaded: false,
      status: null,
      message: '',
      infoDashboard: null
    };
  }

  componentWillReceiveProps(nextProp) {

    const { data } = nextProp.dashboard;
    let detail = [];
    let register = [];
    let stamp = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.data) !== 'undefined') {
          if (data.data !== null) {
            data.data.map(item => {
              typeof (item.data) !== 'undefined' && (
                detail.push(item.data.data)
              )
            });

            if (Array.isArray(detail)) {
              register = detail[1];
              stamp = detail[2];
              detail = detail[0];

              if (typeof (detail) !== 'undefined' && typeof (register) !== 'undefined' && typeof (stamp) !== 'undefined') {
                this.setState({
                  data: detail[0],
                  registerList: register,
                  stampList: stamp,
                  isLoaded: data.isLoading,
                  status: data.status,
                  message: PLEASE_CHECK_CONNECT(data.message)
                });
              }
            } else {
              this.setState({ data: null, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
            }
          }
        }
        if (typeof (data.infoDashboard) !== 'undefined') {
          if (data.infoDashboard !== null) {
            this.setState({
              infoDashboard: data.infoDashboard[0],
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({ infoDashboard: null, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          }

        }
      }
    }
  }

  componentWillMount() {
    const { getDashboardDetail, getInfoDashboard, } = this.props;
    getInfoDashboard();
    // getDashboardDetail();
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
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



  render() {
    const { data, registerList, stampList, status, message, isLoaded, infoDashboard } = this.state;
    const statusPopup = { status: status, message: message };
    return (
      <>
        {/* <Header data={data} status={status} message={message} isLoaded={isLoaded} statusPopup={statusPopup} infoDashboard={infoDashboard} /> */}
        {/* Page content */}
        <div style={{ marginTop: 20 }}>
          <Container fluid>
            <DashboardBox
              data={data}
              infoDashboard={infoDashboard}
              status={status}
              message={message}
              isLoaded={isLoaded}
            />
            <DashboardChart />
            <DashboardList />
            {/* <img src={BackGroundImg} className="reponsiveImgIndex" /> */}


            {/* <Row>
              
              <Col className="mb-4 mb-xl-4" xl="6">
                <DashboardReportByMonth data={data} isLoaded={isLoaded} />
              </Col>
              <Col className="mb-4 mb-xl-4" xl="6">
                <Card className={`shadow ${classes.cardArea}`}>
                  <CardHeader className={`bg-primary ${classes.boxHeader}`}>
                    <Row className="align-items-center">
                      <div className="col">
                        <p className={`mb-0 text-white ${classes.title}`}>Danh sách đang chờ duyệt</p>
                      </div>
                    </Row>
                  </CardHeader>

                  <div id="company-await">
                    {
                      isLoaded ? (
                        <div style={{ display: 'table', margin: 'auto' }}>
                          <Spinner style={{ width: '2rem', height: '2rem' }} />
                        </div>
                      ) : (
                        <CompanyAwait 
                          hideTitle={true}
                          hideSearch={true} 
                          hookSpacing={classes.spacing} 
                          hookclassName={classes.companyAwaitHook}
                          hookPagination={false}
                          heightdashboard={true}
                        />
                      )
                    }
                  </div>
                </Card>
              </Col>
              <Col className="mb-4 mb-xl-4" xl="6">
                <DashboardRegisterList data={registerList} isLoaded={isLoaded} />
              </Col>
              <Col className="mb-4 mb-xl-4" xl="6">
                <DashboardHistory data={data} isLoaded={isLoaded} />
              </Col>
              <Col className="mb-4 mb-xl-4" xl="6">
                <DashboardLibilitiesStamp data={stampList} isLoaded={isLoaded} />
              </Col>
            </Row> */}
          </Container>
        </div>
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    dashboard: state.DashboardStore,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionDashboardCreators, dispatch),

  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Index);
