import React, { Component } from "react";
import { bindActionCreators } from 'redux'
import compose from "recompose/compose";
import { connect } from 'react-redux';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { PLEASE_CHECK_CONNECT } from '../../../../services/Common'
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from '../../../../helpers/constant'
import { actionGrowthStampReports } from '../../../../actions/GrowthStampReportsActions';
import { actionLocationCreators } from '../../../../actions/LocationListAction';

import { Input } from 'reactstrap';

class ChartStamp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            newData: [],
            month: [],
            quarter: [],
            yearY: [],
            isLoaded: null,
            status: null,
            message: '',
            checkAtive: [{}],
            company: [],
            limit: LIMIT_ITEM_IN_PAGE,
            beginItem: 0,
            endItem: LIMIT_ITEM_IN_PAGE,
            totalElement: 0,
            listLength: 0,
            currentPage: 0,
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
            isChecked: 1

        }

    }
    componentWillReceiveProps(nextProp) {
        let { data } = nextProp.growthStampReport;
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

        if (data !== this.state.data) {
            if (typeof (data) !== 'undefined') {
                if (typeof (data.month) !== 'undefined') {
                    //console.log(data.month)
                    if (data.month !== null) {
                        if (typeof (data.month) !== 'undefined') {
                            data.month = data.month.sort((a, b) => a['displayName'] - b['displayName']);

                            let dataMonth = null;

                            for (let i = 1; i <= 12; i++) {
                                displayName.push('Tháng ' + i.toString());

                                dataMonth = data.month.find(p => p.displayName == i) || {};

                                number1.push(parseInt(dataMonth.number1 || 0));
                                number2.push(parseInt(dataMonth.number2 || 0));
                                number3.push(parseInt(dataMonth.number3 || 0));
                            }

                            // for (const dataMap of data.month) {
                            //     displayName.push('Tháng ' + parseInt(dataMap.displayName));
                            //     number1.push(parseInt(dataMap.number1));
                            //     number2.push(parseInt(dataMap.number2));
                            //     number3.push(parseInt(dataMap.number3));
                            // }

                            this.setState({
                                displayName: displayName,
                                number1: number1,
                                number2: number2,
                                number3: number3,
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
                            // for (const dataMap of data.quarter) {
                            //     displayNameQ.push('Quý ' + parseInt(dataMap.displayName));
                            //     number1Q.push(parseInt(dataMap.number1));
                            //     number2Q.push(parseInt(dataMap.number2));
                            //     number3Q.push(parseInt(dataMap.number3));
                            // }

                            let dataQuarter = null;

                            for (let i = 1; i <= 4; i++) {
                                displayNameQ.push('Quý ' + i.toString());

                                dataQuarter = data.quarter.find(p => p.displayName == i) || {};

                                number1Q.push(parseInt(dataQuarter.number1 || 0));
                                number2Q.push(parseInt(dataQuarter.number2 || 0));
                                number3Q.push(parseInt(dataQuarter.number3 || 0));
                            }

                            this.setState({
                                displayNameQ: displayNameQ,
                                number1Q: number1Q,
                                number2Q: number2Q,
                                number3Q: number3Q,
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
                                    number2Y.push(parseInt(_dataYear.number2 || 0));
                                    number3Y.push(parseInt(_dataYear.number3 || 0));
                                }
                            }

                            // for (const dataMap of data.year) {
                            //     displayNameY.push(parseInt(dataMap.displayName));
                            //     number1Y.push(parseInt(dataMap.number1));
                            //     number2Y.push(parseInt(dataMap.number2));
                            //     number3Y.push(parseInt(dataMap.number3));
                            // }

                            this.setState({
                                displayNameY: displayNameY,
                                number1Y: number1Y,
                                number2Y: number2Y,
                                number3Y: number3Y,
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
    componentWillMount() {

    }
    componentDidMount() {
        const { getDistrictList } = this.props;
        let { yearM, yearQ, yearfromY, yeartoY } = this.state;
        getDistrictList();
        this.fetchSummary(yearM);
        // this.fetchSummaryQuarter(yearQ);
        // this.fetchSummaryYear(yearfromY, yeartoY)


    }
    fetchSummary = (data) => {
        const { requestMonthReport } = this.props;

        requestMonthReport(data);
    }
    fetchSummaryQuarter = (data) => {
        const { requestQuarterReport } = this.props;

        requestQuarterReport(data);
    }
    fetchSummaryYear = (fromYear, toYear) => {
        const { requestYearReport } = this.props;

        requestYearReport(fromYear, toYear);
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
    handleChange = (event) => {
        let { yearM } = this.state;
        const ev = event.target;
        yearM = ev['value'];
        this.setState({ yearM })
        this.fetchSummary(yearM);
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
        const {
            data,
            dataChart,
            beginItem,
            endItem,
            displayName,
            number1,
            number2,
            number3,
            displayNameQ,
            number1Q,
            number2Q,
            number3Q,
            displayNameY,
            number1Y,
            number2Y,
            number3Y,
            yearM,
            yearQ,
            dataYear,
            isChecked,
            district,
            ward } = this.state;

        // console.log(number2);
        const datas = {
            labels: [
                "Đã cấp", "Đã dùng", "Chưa dùng"
            ],
            datasets: [{
                data: [number2, number1, number3],
                backgroundColor: [
                    '#ffeb3b', '#4caf50', '#f44336'
                ],
                hoverBackgroundColor: [
                    '#ffeb3b', '#4caf50', '#f44336'
                ]
            }]
        }
        const option = {
            title: {
                display: true,
                text: 'BIỂU ĐỒ TĂNG TRƯỞNG TEM NĂM ' + yearM,
                // fontSize: 20,
                // fontColor: 'blue'
            },
            egend: {
                position: 'bottom',
                display: true
            },
            responsive: true,
            animation: {
                animateScale: true,
            }
        }

        return (
            <>
                <div className="chart-stamp">
                    <Input
                        type="number"
                        name="year"
                        defaultValue={yearM}
                        onBlur={(event) => this.handleChange(event)}
                        onKeyUp={(event) => {
                            if (event.which == 13) {
                                this.handleChange(event)
                            }
                        }}
                    />
                </div>
                {
                    displayName ? (<>
                        <Bar
                            type={'bar'}
                            data={{
                                labels: displayName,
                                datasets: [
                                    {
                                        label: "Đã cấp",
                                        type: "bar",
                                        borderColor: "#ffeb3b",
                                        backgroundColor: "#ffeb3b",
                                        data: number2,
                                        fill: false
                                    },
                                    {
                                        label: "Đã dùng",
                                        type: "bar",
                                        borderColor: "#4caf50",
                                        backgroundColor: "#4caf50",

                                        data: number1,
                                        fill: false
                                    },
                                    {
                                        label: "Chưa dùng",
                                        type: "bar",
                                        borderColor: "#f44336",
                                        backgroundColor: "#f44336",

                                        data: number3,
                                        fill: false
                                    },
                                ]
                            }}

                            options={{
                                responsive: true,
                                title: {
                                    display: true,
                                    text: 'BIỂU ĐỒ TĂNG TRƯỞNG TEM TRONG NĂM ' + yearM,
                                    // fontSize: 20,
                                    // fontColor: 'blue'
                                },
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                scales: {
                                    yAxes: [{
                                        display: true,
                                        ticks: {
                                            suggestedMin: 0,
                                        }
                                    }]
                                }
                            }}
                        />
                    </>) : (<><div className="product-report-list-empty"><p className="product-report-list-empty-text">Hiện chưa có dữ liệu</p></div></>)
                }
            </>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        growthStampReport: state.GrowthStampReportsStore,
        location: state.LocationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionGrowthStampReports, dispatch),
        ...bindActionCreators(actionLocationCreators, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ChartStamp)