import React, { Component } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { actionSaleStampReports } from '../../../../actions/SaleStampReportsActions';
import { actionLocationCreators } from '../../../../actions/LocationListAction';
import { actionMaterialGroup } from '../../../../actions/MaterialGroupActions'
import './DashboardChart.css';
import { PLEASE_CHECK_CONNECT } from '../../../../services/Common';
import ChartZone from './ChartZone';
import ChartStamp from './ChartStamp';
import ChartProducts from './ChartProducts';
import { Row, Nav, NavItem, Input, Col } from 'reactstrap'


class DashboardChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            isChecked: 1,
            yearM: new Date().getFullYear(),
            yearQ: new Date().getFullYear(),
            dataYear: {
                "yearfromY": new Date().getFullYear() - 4,
                "yeartoY": new Date().getFullYear(),
            },
            displayName: [],
            displayNameQ: [],
            displayNameY: [],
            number1: [],
            number2: [],
            number3: [],
            number1Q: [],
            number2Q: [],
            number3Q: [],
            number1Y: [],
            number2Y: [],
            number3Y: [],
        }
    }

    componentWillReceiveProps(nextProp) {
        let { data } = nextProp.saleStampReport;
        const { limit, dataYear } = this.state;
        let displayName = [];
        let number1 = [];
        let number2 = [];
        let number3 = [];
        let displayNameQ = [];
        let number1Q = [];
        let number2Q = [];
        let number3Q = [];
        let displayNameY = [];
        let number1Y = [];
        let number2Y = [];
        let number3Y = [];

        let locationData = nextProp.location.data;

        // console.log(data);

        if (data !== this.state.data) {
            if (typeof (data) !== 'undefined') {
                if (typeof (data.month) !== 'undefined') {
                    //console.log(data.month)
                    if (data.month !== null) {
                        if (typeof (data.month) !== 'undefined') {
                            data.month = data.month.sort((a, b) => a['displayName'] - b['displayName']);

                            let dataMonth = 0;

                            for (let i = 1; i <= 12; i++) {
                                displayName.push('Tháng ' + i.toString());

                                dataMonth = data.month.find(p => p.displayName == i) || {};

                                number1.push(parseInt(dataMonth.number1 || 0));
                            }

                            // for (const dataMap of data.month) {
                            //     displayName.push('Tháng ' + parseInt(dataMap.displayName));
                            //     number1.push(parseInt(dataMap.number1));

                            // }

                            this.setState({
                                displayName: displayName,
                                number1: number1,

                            });

                            this.setState({
                                data: data.month,
                                month: data.month,
                                listLength: data.month.total,
                                totalPage: Math.ceil(data.month.length / limit),
                                isLoaded: data.isLoading, status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });

                        } else {
                            this.setState({
                                data: data.month,
                                month: data.month,
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        }
                    }
                }
                if (typeof (data.quarter) !== 'undefined') {
                    //console.log(data.month)
                    if (data.quarter !== null) {
                        if (typeof (data.quarter) !== 'undefined') {
                            data.quarter = data.quarter.sort((a, b) => a['displayName'] - b['displayName']);

                            let dataQuarter = 0;

                            for (let i = 1; i <= 4; i++) {
                                displayNameQ.push('Quý ' + i.toString());

                                dataQuarter = data.quarter.find(p => p.displayName == i) || {};

                                number1Q.push(parseInt(dataQuarter.number1 || 0));
                            }

                            // for (const dataMap of data.quarter) {
                            //     displayNameQ.push('Quý ' + parseInt(dataMap.displayName));
                            //     number1Q.push(parseInt(dataMap.number1));

                            // }

                            this.setState({
                                displayNameQ: displayNameQ,
                                number1Q: number1Q,

                            });

                            this.setState({
                                //data: data.quarter,
                                quarter: data.quarter,
                                listLength: data.quarter.total,
                                totalPage: Math.ceil(data.quarter.length / limit),
                                isLoaded: data.isLoading, status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });

                        } else {
                            this.setState({
                                //data: data.quarter,
                                quarter: data.quarter,
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        }
                    }
                }
                if (typeof (data.year) !== 'undefined') {
                    //console.log(data.month)
                    if (data.year !== null) {
                        if (typeof (data.year) !== 'undefined') {
                            data.year = data.year.sort((a, b) => a['displayName'] - b['displayName']);

                            const fromYear = parseInt((dataYear || {}).yearfromY || 0);
                            const toYear = parseInt((dataYear || {}).yeartoY || 0);

                            let _dataYear = null;

                            if (data.year.length > 0) {
                                for (let i = fromYear; i <= toYear; i++) {
                                    displayNameY.push(i.toString());

                                    _dataYear = data.year.find(p => p.displayName == i) || {};

                                    number1Y.push(parseInt(_dataYear.number1 || 0));
                                }
                            }

                            // for (const dataMap of data.year) {
                            //     displayNameY.push(parseInt(dataMap.displayName));
                            //     number1Y.push(parseInt(dataMap.number1));

                            // }

                            this.setState({
                                displayNameY: displayNameY,
                                number1Y: number1Y,

                            });

                            this.setState({

                                yearY: data.year,
                                listLength: data.year.total,
                                totalPage: Math.ceil(data.year.length / limit),
                                isLoaded: data.isLoading, status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });

                        } else {
                            this.setState({

                                yearY: data.year,
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        }
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
                        });
                    } else {
                        this.setState({
                            district: [],
                            isLoaded: false,
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
                    });
                } else {
                    this.setState({
                        ward: [],
                        isLoaded: false,
                    });
                }
                //}
            }
        }
    }

    componentDidMount() {
        // console.log();
        const { getDistrictList, requestListMaterialGroup } = this.props;
        let { yearM, yearQ, yearfromY, yeartoY } = this.state;
        let isDisableChart = true;
        let ACCOUNT_CLAIM_FF = [];

        if (JSON.parse(localStorage.getItem('IS_ADMIN')) == true) {
            isDisableChart = false;
        } else {
            ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");
            ACCOUNT_CLAIM_FF.filter(x => x == "StampRequests.View").map(y => isDisableChart = false)
        }
        if (isDisableChart === false) {
            this.fetchSummary(yearM);
            getDistrictList();
            requestListMaterialGroup(JSON.stringify({
                "search": "",
                "filter": "",
                "orderBy": "",
                "page": null,
                "limit": null
            })).then(res => { }

            )
        }
        this.setState({ isDisableChart })
    }
    fetchSummary = (data) => {
        const { requestMonthReport } = this.props;

        requestMonthReport(data);
    }
    fetchSummaryYear = (fromYear, toYear) => {
        const { requestYearReport } = this.props;

        requestYearReport(fromYear, toYear);
    }
    fetchSummaryYear = (fromYear, toYear) => {
        const { requestYearReport } = this.props;

        requestYearReport(fromYear, toYear);
    }
    handleChangeQuarter = (event) => {
        const { requestQuarterReport } = this.props;
        let { yearQ } = this.state;
        const ev = event.target;
        yearQ = ev['value'];
        this.setState({ yearQ })
        requestQuarterReport(yearQ);
    }
    handleChange = (event) => {
        let { yearM } = this.state;
        const ev = event.target;
        yearM = ev['value'];
        this.setState({ yearM })
        this.fetchSummary(yearM);
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

    setcheck(event) {
        let { isChecked, yearQ, yearM, dataYear } = this.state;
        const ev = event.target.value;
        isChecked = ev;
        this.setState({ isChecked })
        this.setState({
            yearM: new Date().getFullYear(),
            yearQ: new Date().getFullYear(),
            dataYear: {
                yearfromY: new Date().getFullYear() - 4,
                yeartoY: new Date().getFullYear(),
            }

        })
        if (isChecked == 1) {
            this.setState({ districtId: '' })
            if (this.redSelectDis) {
                this.redSelectDis.resetValue();
            }
            if (this.redSelect) {
                this.redSelect.resetValue();
            }
            this.fetchSummary(yearM);
        } else if (isChecked == 2) {
            this.setState({ districtId: '' })
            if (this.redSelectDis) {
                this.redSelectDis.resetValue();
            }
            if (this.redSelect) {
                this.redSelect.resetValue();
            }
            this.fetchSummaryQuarter(yearQ)
        } else if (isChecked == 3) {
            this.setState({ districtId: '' })
            if (this.redSelectDis) {
                this.redSelectDis.resetValue();
            }
            if (this.redSelect) {
                this.redSelect.resetValue();
            }
            this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY)
        }
    }

    render() {
        const { currentTab, displayName, displayNameQ, number1, yearM, yearQ, mapStateToProps, materialGroup, isDisableChart } = this.state;
        // let namePro = materialGroup.name || '';
        // console.log(isDisableChart);
        const numberWithCommas = (value, coma) => {
            value = value || '';
            coma = coma || ',';

            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
        };

        return (
            <>
                <section >
                    <Row>
                        {
                            isDisableChart === false && (<Col xl='6' lg='12' xs='12' className='mr-t-box '>
                                <div className='box-list mr-b-5 '>

                                    <div className='header-box-list box-list-border display-box'>
                                        <h4>Doanh thu tiền tem</h4>
                                        <Input
                                            type='number'
                                            name='year'
                                            defaultValue={yearQ}
                                            onBlur={event => {
                                                this.handleChange(event);
                                            }}
                                            onKeyUp={event => {
                                                if (event.which == 13) {
                                                    this.handleChange(event);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ padding: 10 }}>
                                        {
                                            displayName ? (<></>) : null
                                        }
                                        <Line
                                            data={{
                                                labels: displayName,
                                                datasets: [{
                                                    label: "Doanh thu",
                                                    type: 'line',
                                                    backgroundColor: '',
                                                    borderColor: '#60C3FF',
                                                    data: number1,
                                                    fill: false
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                title: {
                                                    display: true,
                                                    text: 'DOANH THU TIỀN TEM NĂM ' + yearM,
                                                },
                                                legend: {
                                                    display: true,
                                                    position: 'bottom'
                                                },
                                                transitions: {
                                                    show: {
                                                        animations: {
                                                            x: {
                                                                from: 0
                                                            },
                                                            y: {
                                                                from: 0
                                                            }
                                                        }
                                                    },
                                                    hide: {
                                                        animations: {
                                                            x: {
                                                                to: 0
                                                            },
                                                            y: {
                                                                to: 0
                                                            }
                                                        }
                                                    }
                                                }
                                            }}

                                        />
                                    </div>

                                </div>
                            </Col>

                            )
                        }
                        {
                            isDisableChart === false && (<Col xl='6' lg='12' xs='12' className='mr-t-box '>
                                <div className='box-list mr-b-5 '>
                                    {/* <div className='header-box-list box-list-border'>
                                    <h4>Doanh thu tiền tem</h4>
                                </div>
                                <div style={{ padding: 10 }}>
                                    <Doughnut />
                                </div> */}
                                    <div className='config-system-chart'>
                                        <div className='config-system-tab'>
                                            <div onClick={this.onChooseTab(0)} className={`chart-tab-item ${currentTab === 0 ? 'active' : ""}`}>Vùng sản xuất</div>
                                            <div onClick={this.onChooseTab(1)} className={`chart-tab-item ${currentTab === 1 ? 'active' : ""}`}>Tăng trưởng tem</div>
                                            <div onClick={this.onChooseTab(2)} className={`chart-tab-item ${currentTab === 2 ? 'active' : ""}`}>Sản phẩm</div>
                                        </div>
                                        <div className='config-system-content'>
                                            {
                                                currentTab === 0 ? (<>
                                                    <div className='chart-item-info'>
                                                        <div>
                                                            <ChartZone />
                                                            {/* <Doughnut /> */}
                                                        </div>
                                                    </div>
                                                </>) : null
                                            }
                                            {
                                                currentTab === 1 ? (<>
                                                    <div className='chart-item-info'>
                                                        <div>
                                                            <ChartStamp />
                                                        </div>

                                                    </div>
                                                </>) : null
                                            }
                                            {
                                                currentTab === 2 ? (<>
                                                    <div className='chart-item-info'>
                                                        <div>
                                                            <ChartProducts />
                                                        </div>
                                                    </div>
                                                </>) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>)
                        }

                    </Row>
                </section>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        saleStampReport: state.SaleStampReportsStore,
        location: state.LocationStore,
        productGroups: state.ProductGroupStore
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionSaleStampReports, dispatch),
        ...bindActionCreators(actionLocationCreators, dispatch),
        ...bindActionCreators(actionMaterialGroup, dispatch)
    }
}

export default compose(connect(
    mapStateToProps,
    mapDispatchToProps
))(DashboardChart);