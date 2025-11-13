import React, { Component } from "react";
import { connect } from 'react-redux'
import compose from "recompose/compose";
import { bindActionCreators } from 'redux';
import { Doughnut, Pie } from 'react-chartjs-2';
import { actionCompanyAreaReports } from '../../../../actions/CompanyAreaReportsActions';
import { actionLocationCreators } from '../../../../actions/LocationListAction';
import { LOADING_TIME, COMPANY_REPORTS_PLANNING } from '../../../../helpers/constant'

import { } from 'reactstrap';

class ChartProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            district: null,
            ward: null,
            data: null,
            planningArea: null,
            requestGetArea: null,
            listGetAreaOuterPlanning: null,
            listGetAreaPlanning: null,
            headerTitle: COMPANY_REPORTS_PLANNING,
            totalElement: 0,
            listLength: 0,
            currentPage: 0,
            limit: 10,
            beginItem: 0,
            endItem: 10
        }
        this.redSelect = null;
        this.redSelectDis = null;

    }
    componentDidMount() {
        const { getDistrictList, requestGetArea } = this.props;
        getDistrictList().then(res => {

            if (res.data.status == 200) {
                this.setState({ district: res.data.data })
            }
        })

        requestGetArea().then(res => {
            if (res.data.status == 200) {
                // console.log(res);
                if (res.data.data) {
                    this.setState({ data: res.data.data })
                    this.setState({ planningArea: res.data.data.planningArea })
                    this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
                }
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
        if (this.redSelect) {
            this.redSelect.resetValue();
        }
        const { getWardList, requestGetArea } = this.props;
        if (value == null) { value = '' }
        if (value != '') {
            getWardList(value).then(res => {
                if (res.data.status == 200) {
                    this.setState({ ward: res.data.data })
                }
            });
            requestGetArea('?districtId=' + value).then(res => {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        this.setState({ data: res.data.data })
                        this.setState({ planningArea: res.data.data.planningArea })
                        this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
                    }
                }
            })
        } else if (value == '') {
            requestGetArea().then(res => {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        this.setState({ data: res.data.data })
                        this.setState({ planningArea: res.data.data.planningArea })
                        this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
                    }
                }
            })
        }
        this.setState({ districtId: value })
    }
    handleSelectWar = (value) => {
        const { requestGetArea } = this.props;
        let { districtId } = this.state;
        if (value == null) { value = '' }
        this.setState({ wardId: value })
        if (value != '') {
            requestGetArea('?districtId=' + districtId + '&wardId=' + value).then(res => {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        this.setState({ data: res.data.data })
                        this.setState({ planningArea: res.data.data.planningArea })
                        this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
                    }
                }
            })
        }
        else if (value == '') {
            requestGetArea('?districtId=' + districtId).then(res => {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        this.setState({ data: res.data.data })
                        this.setState({ planningArea: res.data.data.planningArea })
                        this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
                    }
                }
            })
        }
    }
    handlePlanningArea = () => {
        this.setState({ listGetAreaOuterPlanning: null })
        let { districtId, wardId } = this.state;
        const { requestListGetAreaPlanning } = this.props;
        if (!districtId) {
            requestListGetAreaPlanning().then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }
            })
        }
        if (districtId) {
            requestListGetAreaPlanning('?districtId=' + districtId + '&page=' + 0).then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }
            })
        }
        if (wardId) {
            requestListGetAreaPlanning('?districtId=' + districtId + '&wardId=' + wardId + '&page=' + 0).then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }
            })
        }
    }
    handleOuterPlanningArea = () => {
        this.setState({ listGetAreaPlanning: null })
        let { districtId, wardId } = this.state;
        const { requestListGetAreaOuterPlanning } = this.props;
        if (!districtId) {
            requestListGetAreaOuterPlanning().then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaOuterPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }

            })
        }
        if (districtId) {
            requestListGetAreaOuterPlanning('?districtId=' + districtId + '&page=' + 0).then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaOuterPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }
            })
        }
        if (wardId) {
            requestListGetAreaOuterPlanning('?districtId=' + districtId + '&wardId=' + wardId + '&page=' + 0).then(res => {
                if (res.data.status == 200) {
                    this.setState({
                        listGetAreaOuterPlanning: res.data.data,
                        totalPage: Math.ceil(res.data.data.length / 10),
                        listLength: res.data.data.length,
                    })
                }
            })
        }
    }


    render() {
        const {
            planningArea,
            outerPlanningArea,
            district,
            ward,
            listGetAreaPlanning,
            listGetAreaOuterPlanning,
            activeCreateSubmit,
            viewModal,
            totalPage,
            listLength } = this.state;

        const dataa = {
            labels: [
                'Thuộc quy hoạch',
                'Ngoài quy hoạch'
            ],
            datasets: [{
                data: [planningArea, outerPlanningArea],

                backgroundColor: [
                    '#07b151',
                    '#ff0000'
                ],
                hoverBackgroundColor: [
                    '#07b151',
                    '#ff0000'
                ],

            }]
        };
        // console.log(planningArea);
        const option = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                        var total = meta.total;
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                        return currentValue + ' (' + percentage + '%)';
                    },
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                },
            },
            title: {
                text: 'Vùng quy hoạch',
                display: true
            },
            responsive: true,
            legend: {
                position: 'bottom',
                display: true
            },
            animation: {
                animateScale: true,
            }
        }
        return (
            <>
                <Doughnut
                    type={'doughnut'}
                    data={dataa}
                    options={option}


                />
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        location: state.LocationStore,
        companyAreaReport: state.CompanyAreaReportsStore,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionLocationCreators, dispatch),
        ...bindActionCreators(actionCompanyAreaReports, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps)
)(ChartProduct);