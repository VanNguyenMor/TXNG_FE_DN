import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionCompanyAreaReports } from "../../../actions/CompanyAreaReportsActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import classes from './index.module.css';
import { LOADING_TIME, COMPANY_REPORTS_PLANNING } from "../../../helpers/constant";
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import { Pie } from 'react-chartjs-2';
import Select from "components/Select";
import ViewModal from "./ViewModal";
import ViewPopup from "../../../components/ViewPopup";

import {
    Card,
    Table,
    Container,
    Row,
    Spinner,
    Input,

} from "reactstrap";

class CompanyAreaReports extends Component {
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

    toggleModal = (state) => {
        this.setState({
            [state]: !this.state[state],

        });
    };

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
            listLength
        } = this.state;
        const dataa = {
            labels: [
                'Thuộc quy hoạch',
                'Ngoài quy hoạch'
            ],
            datasets: [{
                data: [planningArea, outerPlanningArea],

                backgroundColor: [
                    '#00a85a',
                    '#c5002e'
                ],
                hoverBackgroundColor: [
                    '#00a85a',
                    '#c5002e'
                ],

            }]
        };

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
            }
        }
        return (
            <>
                {
                    <div className={classes.wrapper}>
                        <Container fluid>
                            <Row responsive={1} style={{ marginBottom: 20 }}>
                                <div style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>Quận/Huyện</div>
                                <div style={{ marginTop: -4, marginRight: 8 }}>
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
                                <div style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>Phường/Xã</div>
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
                            <Row responsive={1} style={{ marginBottom: 20 }}>
                                <div className="col-6">
                                    <Pie
                                        data={dataa}
                                        options={option}
                                        width={200}
                                    />
                                </div>
                                <div className="col-6" style={{ marginTop: 40 }}>
                                    <div style={{ display: 'flex', marginBottom: 20 }}>
                                        <div style={{ width: 40, height: 40, backgroundColor: '#00a85a', marginRight: 20 }}></div>
                                        <p onClick={() => {
                                            this.handlePlanningArea();
                                            this.toggleModal('viewModal')
                                        }}
                                            className={classes.cssTextLink}>
                                            <u>Thuộc quy hoạch</u></p>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ width: 40, height: 40, backgroundColor: '#c5002e', marginRight: 20 }}></div>
                                        <p onClick={() => {
                                            this.handleOuterPlanningArea();
                                            this.toggleModal('viewModal')
                                        }} className={classes.cssTextLink}><u>Ngoài quy hoạch</u></p>
                                    </div>
                                </div>
                            </Row>
                            {
                                <ViewPopup
                                    moduleTitle={listGetAreaPlanning ?
                                        'Danh sách doanh nghiệp/cá nhân thuộc quy hoạch' :
                                        'Danh sách doanh nghiệp/cá nhân ngoài quy hoạch'}
                                    moduleBody={
                                        <ViewModal
                                            planningArea={planningArea}
                                            listGetAreaPlanning={listGetAreaPlanning}
                                            listGetAreaOuterPlanning={listGetAreaOuterPlanning}
                                            outerPlanningArea={outerPlanningArea}
                                            totalPage={totalPage}
                                            listLength={listLength}
                                        />}
                                    viewModal={viewModal}
                                    toggleModal={this.toggleModal}
                                    activeSubmit={activeCreateSubmit}
                                    handleUpdateInfoData={this.componentExtend}
                                />
                            }
                        </Container>
                    </div>
                }
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        companyAreaReport: state.CompanyAreaReportsStore,
        location: state.LocationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionCompanyAreaReports, dispatch),
        ...bindActionCreators(actionLocationCreators, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CompanyAreaReports);