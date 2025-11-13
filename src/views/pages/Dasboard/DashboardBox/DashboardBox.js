import React, { Component } from 'react';
import './DashboardBox.css';
import { Container, Row, Spinner, Col } from 'reactstrap';

class DashboardBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            infoDashboard: null
        }

    }
    componentWillReceiveProps(nextProp) {

        const { data, isLoaded, infoDashboard } = nextProp;
        this.setState({ isLoaded, infoDashboard });
    }

    render() {
        const { isLoaded, infoDashboard } = this.state
        return (
            <>
                {/* <Container fluid> */}
                {/* <section> */}
                <Row >
                    <Col >
                        <div className='div-dashboard-box border-dashboard-box mr-b-5'>
                            {
                                isLoaded ? (<div style={{ display: 'table', margin: 'auto' }}>
                                    <Spinner style={{ width: '2rem', height: '2rem' }} />
                                </div>) : (
                                    <Row className='row-align-item'>
                                        <div className='col-3 icon-css-box icon-user-color'>
                                            <i className="fas fa-users" />
                                        </div>
                                        <div className='col-9 text-css-box'>
                                            <span className='info-box-text'>Doanh nghiệp đăng ký sử dụng</span>
                                            <span className='info-box-number font-weight-bold mb-0'>
                                                {infoDashboard && infoDashboard.CompanyRegister ? infoDashboard.CompanyRegister : 0}
                                            </span>
                                        </div>
                                    </Row>
                                )
                            }
                        </div>
                    </Col>
                    <Col >
                        <div className='div-dashboard-box border-dashboard-box mr-b-5'>
                            {
                                isLoaded ? (<div style={{ display: 'table', margin: 'auto' }}>
                                    <Spinner style={{ width: '2rem', height: '2rem' }} />
                                </div>) : (
                                    <Row className='row-align-item'>
                                        <div className='col-3 icon-css-box icon-box-open-color'>
                                            <i className="fas fa-box-open" />
                                        </div>
                                        <div className='col-9 text-css-box'>
                                            <span className='info-box-text'>Sản phẩm được đăng ký</span>
                                            <span className="info-box-number font-weight-bold mb-0">
                                                {infoDashboard && infoDashboard.ProductRegister ? infoDashboard.ProductRegister : 0}
                                            </span>
                                        </div>
                                    </Row>
                                )
                            }
                        </div>
                    </Col>
                    <Col >
                        <div className='div-dashboard-box border-dashboard-box mr-b-5'>
                            {
                                isLoaded ? (<div style={{ display: 'table', margin: 'auto' }}>
                                    <Spinner style={{ width: '2rem', height: '2rem' }} />
                                </div>) : (
                                    <Row className='row-align-item'>
                                        <div className='col-3 icon-css-box icon-search-color'>
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <div className='col-9 text-css-box'>
                                            <span className='info-box-text'>Số lượt check hàng hóa</span>
                                            <span className="info-box-number font-weight-bold mb-0">
                                                {infoDashboard && infoDashboard.ProductsCheck ? infoDashboard.ProductsCheck : 0}
                                            </span>
                                        </div>
                                    </Row>
                                )
                            }
                        </div>
                    </Col>
                </Row>
                {/* </section> */}
                {/* </Container> */}
            </>
        )
    }
}

export default DashboardBox;
