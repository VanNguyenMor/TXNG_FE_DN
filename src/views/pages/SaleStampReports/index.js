import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionSaleStampReports } from "../../../actions/SaleStampReportsActions";
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

import {
    Card,
    Table,
    Container,
    Row,
    Spinner,
    Input,

} from "reactstrap";

class SaleStampReports extends Component {
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
        this.redSelect = null;
        this.redSelectDis = null;
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
        if (this.redSelect) {
            this.redSelect.resetValue();
        }
        const { getWardList } = this.props;
        let { yearM, yearQ, isChecked, dataYear } = this.state;
        if (value == null) { value = '' }
        if (value) {
            getWardList(value);
        }
        this.setState({ districtId: value })
        if (isChecked == 1) {
            this.fetchSummary(yearM + '&districtId=' + value);
        } else if (isChecked == 2) {
            this.fetchSummaryQuarter(yearQ + '&districtId=' + value)
        } else if (isChecked == 3) {
            this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY + '&districtId=' + value)
        }
    }

    handleSelectWar = (value) => {
        let { yearM, yearQ, districtId, isChecked, dataYear } = this.state;
        if (value == null) { value = '' }
        this.setState({ wardId: value })
        if (isChecked == 1) {
            this.fetchSummary(yearM + '&districtId=' + districtId + '&wardId=' + value);
        } else if (isChecked == 2) {
            this.fetchSummaryQuarter(yearQ + '&districtId=' + districtId + '&wardId=' + value);
        } else if (isChecked == 3) {
            this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY + '&districtId=' + districtId + '&wardId=' + value)
        }
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
    handleChange = (event) => {
        let { yearM } = this.state;
        const ev = event.target;
        yearM = ev['value'];
        this.setState({ yearM })
        this.fetchSummary(yearM);
    }
    handleChangeQuarter = (event) => {
        const { requestQuarterReport } = this.props;
        let { yearQ } = this.state;
        const ev = event.target;
        yearQ = ev['value'];
        this.setState({ yearQ })
        requestQuarterReport(yearQ);
    }
    handleChangeYear = (event) => {
        const { requestYearReport } = this.props;
        let { dataYear } = this.state;
        const ev = event.target;
        dataYear[ev['name']] = ev['value'];
        this.setState({ dataYear })
        requestYearReport(dataYear.yearfromY, dataYear.yeartoY);
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
        const { } = this.props;
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
            ward
        } = this.state;

        // const statusPopup = { status: status, message: message };

        return (
            <>
                {
                    <div className={classes.wrapper}>
                        <Container fluid>
                            <Row responsive={1}>
                                <div className="col" >
                                    <div className={classes.filterArea} >
                                        <div>
                                            <Input
                                                type="radio"
                                                name="comp-report"
                                                id="monthcomp"
                                                value="1"
                                                onChange={this.setcheck.bind(this)}
                                                defaultChecked
                                                style={{ position: 'inherit', marginRight: 5 }} />
                                            <label htmlFor="monthcomp">Theo tháng</label>
                                        </div>

                                        <div>
                                            <Input
                                                type="radio"
                                                name="comp-report"
                                                id="quarterlycomp"
                                                value="2"
                                                onChange={this.setcheck.bind(this)}
                                                style={{ position: 'inherit', marginRight: 5 }} />
                                            <label htmlFor="quarterlycomp">Theo quý</label>
                                        </div>
                                        <div>
                                            <Input
                                                type="radio"
                                                name="comp-report"
                                                id="yearcomp"
                                                value="3"
                                                onChange={this.setcheck.bind(this)}
                                                style={{ position: 'inherit', marginRight: 5 }} />
                                            <label htmlFor="yearcomp">Theo năm</label>
                                        </div>
                                        {isChecked == 1 ? (
                                            <div className="row" style={{ flexWrap: 'inherit', }}>
                                                <div>
                                                    <label htmlFor="yearinput">Năm</label>
                                                </div>
                                                <div style={{ marginTop: -4 }}>
                                                    <Input
                                                        type="number"
                                                        name="year"
                                                        id="yearinput"
                                                        defaultValue={yearM}
                                                        // onKeyUp={(event) => this.handleChange(event)}
                                                        style={{
                                                            position: 'inherit',
                                                            height: 30
                                                        }}
                                                        onBlur={(event) => this.handleChange(event)}
                                                        onKeyUp={(event) => {
                                                            if (event.which == 13) {
                                                                this.handleChange(event);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : null
                                        }
                                        {isChecked == 2 ? (
                                            <div className="row" style={{ flexWrap: 'inherit', }}>
                                                <div>
                                                    <label htmlFor="yearinput">Năm</label>
                                                </div>
                                                <div style={{ marginTop: -4 }}>
                                                    <Input
                                                        type="number"
                                                        name="year"
                                                        id="yearinput"
                                                        defaultValue={yearQ}
                                                        // onKeyUp={(event) => this.handleChangeQuarter(event)}
                                                        style={{
                                                            position: 'inherit',
                                                            height: 30
                                                        }}
                                                        onBlur={event => {
                                                            this.handleChangeQuarter(event);
                                                        }}
                                                        onKeyUp={event => {
                                                            if (event.which == 13) {
                                                                this.handleChangeQuarter(event);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : null
                                        }
                                        {isChecked == 3 ? (
                                            <div className="row" style={{ flexWrap: 'inherit', width: 280 }}>
                                                <div>
                                                    <label htmlFor="yearinput">Từ năm</label>
                                                </div>
                                                <div style={{ width: 90, marginRight: 10, marginTop: -4 }}>
                                                    <Input
                                                        type="number"
                                                        name="yearfromY"
                                                        id="yearinput"
                                                        defaultValue={dataYear.yearfromY}
                                                        // onKeyUp={(event) => this.handleChangeYear(event)}
                                                        style={{
                                                            position: 'inherit',
                                                            height: 30,
                                                        }}
                                                        onBlur={event => {
                                                            this.handleChangeYear(event);
                                                        }}
                                                        onKeyUp={event => {
                                                            if (event.which == 13) {
                                                                this.handleChangeYear(event);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="yearinput">Đến năm</label>
                                                </div>
                                                <div style={{ width: 90, marginTop: -4 }}>
                                                    <Input
                                                        type="number"
                                                        name="yeartoY"
                                                        id="yearinput"
                                                        defaultValue={dataYear.yeartoY}
                                                        // onKeyUp={(event) => this.handleChangeYear(event)}
                                                        style={{
                                                            position: 'inherit',
                                                            height: 30
                                                        }}
                                                        onBlur={event => {
                                                            this.handleChangeYear(event);
                                                        }}
                                                        onKeyUp={event => {
                                                            if (event.which == 13) {
                                                                this.handleChangeYear(event);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : null
                                        }
                                    </div>
                                </div>
                                {/* <div>Chọn quận huyện</div> */}
                                <div style={{ marginTop: -4 }}>
                                    <Select
                                        ref={ref => this.redSelectDis = ref}
                                        //name="status"
                                        title='Chọn quận huyện'
                                        data={district}
                                        labelName='districtName'
                                        val='id'
                                        handleChange={this.handleSelectDis}
                                    />
                                </div>
                                {/* <div>Chọn phường xã</div> */}
                                <div style={{ marginTop: -4, marginLeft: 4 }}>
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
                            </Row>
                            {isChecked == 1 ? (
                                <Bar
                                    data={{
                                        labels: displayName,
                                        datasets: [{
                                            label: "Doanh thu",
                                            type: "bar",
                                            borderColor: "#ff9e4f",
                                            borderWidth: 1,
                                            backgroundColor: "#ffff80",
                                            data: number1,
                                            fill: false
                                        },

                                        ]
                                    }}

                                    options={{
                                        responsive: true,
                                        title: {
                                            display: true,
                                            text: 'BIỂU ĐỒ TĂNG TRƯỞNG DOANH THU TIỀN TEM NĂM ' + yearM,
                                            fontSize: 20,
                                            fontColor: 'blue'
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
                            ) : null
                            }
                            {isChecked == 2 ? (
                                <Bar
                                    data={{
                                        labels: displayNameQ,
                                        datasets: [{
                                            label: "Doanh thu",
                                            type: "bar",
                                            borderColor: "#ff9e4f",
                                            borderWidth: 1,
                                            backgroundColor: "#ffff80",
                                            data: number1Q,
                                            fill: false
                                        },


                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        title: {
                                            display: true,
                                            text: 'BIỂU ĐỒ TĂNG TRƯỞNG DOANH THU TIỀN TEM NĂM ' + yearQ,
                                            fontSize: 20,
                                            fontColor: 'blue'
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
                            ) : null
                            }
                            {isChecked == 3 ? (
                                <Bar
                                    data={{
                                        labels: displayNameY,
                                        datasets: [{
                                            label: "Doanh thu",
                                            type: "bar",
                                            borderColor: "#ff9e4f",
                                            borderWidth: 1,
                                            backgroundColor: "#ffff80",
                                            data: number1Y,
                                            fill: false
                                        },

                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        title: {
                                            display: true,
                                            text: 'BIỂU ĐỒ TĂNG TRƯỞNG DOANH THU TIỀN TEM TỪ ' + dataYear.yearfromY + ' ' + 'ĐẾN ' + dataYear.yeartoY,
                                            fontSize: 20,
                                            fontColor: 'blue'
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
                            ) : null
                            }
                            {/* {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              } */}
                        </Container>
                    </div>
                }
            </>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        saleStampReport: state.SaleStampReportsStore,
        location: state.LocationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionSaleStampReports, dispatch),
        ...bindActionCreators(actionLocationCreators, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(SaleStampReports);