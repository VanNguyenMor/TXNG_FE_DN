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

// reactstrap components
import React, { Component } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import classes from "./index.module.css";

import {
  Spinner
} from "reactstrap";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoaded: false,
      status: null,
      message: '',
      statusPopup: { status: false, message: '' },
      infoDashboard: null
    };
  }

  componentWillReceiveProps(nextProp) {
    const { data, status, message, isLoaded, statusPopup, infoDashboard } = nextProp;

    this.setState({ data, status, message, isLoaded, statusPopup, infoDashboard });
  }

  render() {
    const { data, isLoaded, infoDashboard } = this.state;

    return (
      <>
        <div className="header bg-gradient-info pb-4 pt-4 pt-md-4">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="8" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <CardTitle
                        tag="p"
                        className={`text-uppercase text-muted mb-0 ${classes.boxTitle}`}
                      >
                        Doanh nghiệp đăng ký sử dụng
                      </CardTitle>
                      {
                        isLoaded ? (
                          <div style={{ display: 'table', margin: 'auto' }}>
                            <Spinner style={{ width: '2rem', height: '2rem' }} />
                          </div>
                        ) : (
                          <Row>
                            <div className="col">
                              <span className="h1 font-weight-bold mb-0">
                                {infoDashboard && infoDashboard.CompanyRegister ? infoDashboard.CompanyRegister : 0}
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                                <i className="fas fa-users" />
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="8" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <CardTitle
                        tag="p"
                        className={`text-uppercase text-muted mb-0 ${classes.boxTitle}`}
                      >
                        Sản phẩm được đăng ký
                      </CardTitle>
                      {
                        isLoaded ? (
                          <div style={{ display: 'table', margin: 'auto' }}>
                            <Spinner style={{ width: '2rem', height: '2rem' }} />
                          </div>
                        ) : (
                          <Row>
                            <div className="col">
                              <span className="h1 font-weight-bold mb-0">
                                {infoDashboard && infoDashboard.ProductRegister ? infoDashboard.ProductRegister : 0}
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                <i className="fas fa-box-open" />
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="8" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <CardTitle
                        tag="p"
                        className={`text-uppercase text-muted mb-0 ${classes.boxTitle}`}
                      >
                        Số lượt check hàng hóa
                      </CardTitle>
                      {
                        isLoaded ? (
                          <div style={{ display: 'table', margin: 'auto' }}>
                            <Spinner style={{ width: '2rem', height: '2rem' }} />
                          </div>
                        ) : (
                          <Row>
                            <div className="col">
                              <span className="h1 font-weight-bold mb-0">
                                {infoDashboard && infoDashboard.ProductsCheck ? infoDashboard.ProductsCheck : 0}
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="fas fa-search"></i>
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </CardBody>
                  </Card>
                </Col>
                {/* <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <CardTitle
                        tag="p"
                        className={`text-uppercase text-muted mb-0 ${classes.boxTitle}`}
                      >
                        Số lượt tải ứng dụng
                         
                      </CardTitle>
                      {
                        isLoaded ? (
                          <div style={{ display: 'table', margin: 'auto' }}>
                            <Spinner style={{ width: '2rem', height: '2rem' }} />
                          </div>
                        ) : (
                          <Row>
                            <div className="col">
                              <span className="h1 font-weight-bold mb-0">310</span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                <i className="fas fa-mobile-alt"/>
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </CardBody>
                  </Card>
                </Col> */}
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
};

export default Header;
