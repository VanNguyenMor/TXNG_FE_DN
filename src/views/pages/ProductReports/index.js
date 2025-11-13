import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    Container,
    Row
} from "reactstrap";
import _ from 'lodash';

import compose from 'recompose/compose';
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { actionProductReports } from "../../../actions/ProductReportsActions";
import { actionField } from "../../../actions/FieldActions";
import classes from './index.module.css';
import { LOADING_TIME, COMPANY_REPORTS_PLANNING } from "../../../helpers/constant";
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import Select from "components/Select";
import ViewModal from "./ViewModal";
import ViewPopup from "../../../components/ViewPopup";
import '../../../assets/css/page/product_report.css';
import { handleGenTree } from "../../../helpers/trees";
import SelectTree from "components/SelectTree";

class CompanyAreaReports extends Component {
    constructor(props) {
        super(props);

        const currentDateTime = new Date();

        const year = currentDateTime.getFullYear();
        const month = currentDateTime.getMonth() + 1;
        let precious = '';

        if (month >= 1 && month <= 3) {
            precious = 1;
        } else if (month >= 4 && month <= 6) {
            precious = 2;
        } else if (month >= 7 && month <= 9) {
            precious = 3;
        } else if (month >= 10 && month <= 12) {
            precious = 4;
        }

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
            endItem: 10,
            typeTime: 0,
            fields: [],
            fieldId: '',
            month,
            year,
            precious,
            wardId: null,
            districtId: null,
            productReports: [],
            productReportElement: null,
            productReportByGroupElement: null,
            productReportByTypeElement: null,
            materialGroupId: null,
            productGroupId: null,
            titleProductReportGroup: '',
            titleProductReportType: ''
        }

        this.redSelect = null;
        this.redSelectDis = null;
        this.selectField = null;
        this.barChart = null;
    }

    componentDidMount() {
        const { getDistrictList, requestGetArea, getListFieldComboBox, requestFieldByProducts } = this.props;

        // getListFieldComboBox({
        //     search: '',
        //     filter: '',
        //     orderBy: '',
        //     page: null,
        //     limit: 1000
        // }).then(res => {
        //     const fields = ((res.data || {}).data || {}).fields || [];
        //     let fieldDataParent = [];
        //     let haveRoot = false;

        //     fields
        //         .filter(item => item.parentID === null)
        //         .map(item => haveRoot = true);
        //     if (haveRoot) {
        //         fieldDataParent = handleGenTree(fields, 'fieldName');

        //         fieldDataParent.map((item, key) => {
        //             item['index'] = key + 1
        //         });
        //     } else {
        //         // Search Element in tree
        //         fields.map((item, key, array) => (
        //             key === 0 && (item.parentID = null)
        //         ));

        //         fieldDataParent = handleGenTree(fields, 'fieldName');

        //         fieldDataParent.map((item, key) => {
        //             item['index'] = key + 1
        //         });
        //     }
        //     this.setState(previousState => {
        //         return {
        //             ...previousState,
        //             fields,
        //             fieldDataParent: fieldDataParent,
        //         }
        //     });
        // });
        requestFieldByProducts({
            search: '',
            filter: '',
            orderBy: '',
            page: null,
            limit: null
        }).then(res => {
            const fields = ((res || {}).data || {}).fields || [];

            this.setState(previousState => {
                return {
                    ...previousState,
                    fields,

                }
            });



        })

        getDistrictList().then(res => {
            if (res.data.status == 200) {
                this.setState({ district: res.data.data })
            }
        })

        // requestGetArea().then(res => {
        //     if (res.data.status == 200) {
        //         if (res.data.data) {
        //             this.setState({ data: res.data.data })
        //             this.setState({ planningArea: res.data.data.planningArea })
        //             this.setState({ outerPlanningArea: res.data.data.outerPlanningArea })
        //         }
        //     }
        // })
    }

    getProductReport = () => {
        const { getListProductReport } = this.props;
        const { districtId, wardId, fieldId, year, month, precious, typeTime } = this.state;

        if (typeTime == 0) {
            if (!month || !year) {
                return;
            }
        } else if (typeTime == 1) {
            if (!precious || !year) {
                return;
            }
        } else if (typeTime == 2) {
            if (!year) {
                return;
            }
        }

        getListProductReport({
            reportFilterType: parseInt(typeTime),
            month,
            quarter: precious,
            year,
            fieldId,
            districtId,
            wardId,
            page: 0,
            limit: 1000
        }).then(res => {
            const productReports = (res.data || {}).data || [];

            const productReportElement = this.renderHorizontalBarChar(productReports)

            this.setState(previousState => {
                return {
                    ...previousState,
                    productReports,
                    productReportElement
                }
            });
        });
    }

    getListProductReportByGroup = data => {
        const { getListProductReportByGroup, getListProductReportByType } = this.props;
        const { districtId, wardId, fieldId, year, month, precious, typeTime, materialGroupId, productGroupId } = this.state;

        const id = data.id;
        const displayName = data.name;

        if (!materialGroupId) {
            if (typeTime == 0) {
                if (!month || !year) {
                    return;
                }
            } else if (typeTime == 1) {
                if (!precious || !year) {
                    return;
                }
            } else if (typeTime == 2) {
                if (!year) {
                    return;
                }
            }

            getListProductReportByGroup({
                reportFilterType: parseInt(typeTime),
                month,
                quarter: precious,
                year,
                fieldId,
                districtId,
                wardId,
                page: 0,
                limit: 1000,
                materialGroupId: id
            }).then(res => {
                const productReportByGroups = ((res.data || {}).data || {}).reports || [];
                const unit = ((res.data || {}).data || {}).unit || {};

                const productReportByGroupElement = this.renderHorizontalBarChar(productReportByGroups, unit);

                this.setState(previousState => {
                    return {
                        ...previousState,
                        productReportByGroupElement,
                        materialGroupId: id,
                        titleProductReportGroup: displayName
                    }
                });

                // const productReportByGroups = (res.data || {}).data || [];

                // const categories = productReports.map(p => p.displayName);

                // const data = productReports.map(p => p.quantity);

                // const optionBarCharts = {
                //     ...this.state.optionBarCharts,
                //     xaxis: {
                //         categories
                //     }
                // };

                // this.setState(previousState => {
                //     return {
                //         ...previousState,
                //         barChartSeries: [{
                //             data
                //         }],
                //         optionBarCharts
                //     }
                // });
            });
        } else if (!productGroupId) {
            if (typeTime == 0) {
                if (!month || !year) {
                    return;
                }
            } else if (typeTime == 1) {
                if (!precious || !year) {
                    return;
                }
            } else if (typeTime == 2) {
                if (!year) {
                    return;
                }
            }

            getListProductReportByType({
                reportFilterType: parseInt(typeTime),
                month,
                quarter: precious,
                year,
                fieldId,
                districtId,
                wardId,
                page: 0,
                limit: 1000,
                materialGroupId: this.state.materialGroupId,
                productGroupId: id
            }).then(res => {
                const productReportByTypes = ((res.data || {}).data || {}).reports || [];
                const unit = ((res.data || {}).data || {}).unit || {};

                const productReportByTypeElement = this.renderHorizontalBarChar(productReportByTypes, unit);

                this.setState(previousState => {
                    return {
                        ...previousState,
                        productGroupId: id,
                        productReportByTypeElement,
                        titleProductReportType: displayName
                    }
                });
            });
        }
    }

    componentDidUpdate() {
        // this.closeStatusModal();
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

    handleSelectField = (value) => {
        // if (this.selectField) {
        //     this.selectField.resetValue();
        // }

        this.setState(previousState => {
            return {
                ...previousState,
                fieldId: value
            }
        }, () => {
            this.onFilter();
        });
    }

    handleSelectDis = (value) => {
        const { getWardList } = this.props;
        if (this.redSelect) {
            this.redSelect.resetValue();
        }

        if (value) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    districtId: value
                }
            }, () => {
                this.onFilter();
            });
            getWardList(value).then(res => {
                if (res.data.status == 200) {
                    this.setState({ ward: res.data.data })
                }
            });
        }
    }

    handleSelectWar = (value) => {
        if (value) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    wardId: value
                }
            }, () => {
                this.onFilter();
            });
        }

    }

    onChangeTypeTime = e => {
        const value = e.target.value;

        this.setState(previousState => {
            return {
                ...previousState,
                typeTime: value,
                month: null,
                year: null,
                precious: null
            }
        });
    }

    onChangeValueTypeTime = name => e => {
        let value = parseInt(e.target.value || '');

        const _value = parseInt(e.target.value);

        if (name == 'month') {
            if ((_value >= 1 && _value <= 12) || (!_value && _value != 0)) {

            } else {
                value = this.state[name];
            }
        } else if (name == 'precious') {
            if ((_value >= 1 && _value <= 4) || (!_value && _value != 0)) {

            } else {
                value = this.state[name];
            }
        }

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: isNaN(value) ? '' : value
            }
        });
    }

    onFilter = () => {
        this.getProductReport();
    }

    onProductReportDetail = item => () => {
        const id = item.id;

        if (!id) {
            return;
        }

        this.getListProductReportByGroup({
            id: item.id,
            name: item.displayName
        });
    }

    renderHorizontalBarChar = (data, unit) => {
        data = data || [];

        if (data.length <= 0) {
            return null;
        }

        const min = 0;

        let values = [min];

        for (let i = 0; i < data.length; i++) {
            if (!values.find(p => p == data[i].quantity)) {
                values.push(data[i].quantity);
            }
        }

        values = _.orderBy(values, [], ['asc']);

        const max = values[values.length - 1];

        let maxValue = max;

        if (maxValue > 10 && maxValue % 10 != 0) {
            maxValue = maxValue + (maxValue % 10);
        }

        const valuePerItem = maxValue / 5;

        const heightItem = 30;
        const offsetTop = 5;

        const animationHorizontalBarCharBodyItem = (element, width) => {
            if (element) {
                const timeOut = setTimeout(() => {
                    element.style.width = width;

                    clearTimeout(timeOut);
                }, 50);
            }
        }

        const renderColumn = (min, max, valuePerItem) => {
            const elements = [];

            const widthPerItem = 100 / 5;

            for (let i = min; i <= max; i += valuePerItem) {
                elements.push(<div key={`horizontal-bar-chart-column-${i}`} className="horizontal-bar-chart-body-column" style={{
                    width: `${widthPerItem}%`
                }}>
                    <p className="horizontal-bar-chart-body-column-text" style={i == min ? {
                        left: -2
                    } : {}}>{i.toFixed(2)}</p>
                    {max == i ? <p className="horizontal-bar-chart-body-column-text" style={{
                        left: 'auto',
                        right: 0
                    }}>{(i + valuePerItem).toFixed(2)}</p> : null}
                </div>);
            }

            return elements;
        }

        return <div className="horizontal-bar-chart">
            {(unit || {}).unitName && <p className="horizontal-bar-chart-unit">Đơn vị tính: {(unit || {}).unitName}</p>}
            <div className="horizontal-bar-chart-header" style={{
                height: (data.length * heightItem) + (data.length * offsetTop)
            }}>
                {data.map((itemLabel, indexLabel) => {
                    return <div key={`horizontal-bar-chart-header-item-${indexLabel}`} className="horizontal-bar-chart-header-item" style={{
                        top: (indexLabel * heightItem) + (indexLabel == 0 ? 0 : offsetTop),
                        height: heightItem
                    }}>
                        <p className="horizontal-bar-chart-header-item-title">{itemLabel.displayName}</p>
                    </div>
                })}
            </div>
            <div className="horizontal-bar-chart-body" style={{
                height: (data.length * heightItem) + (data.length * offsetTop)
            }}>
                {data.map((itemValue, indexValue) => {
                    const element = <div ref={ref => {
                        animationHorizontalBarCharBodyItem(ref, `${(itemValue.quantity || 0) * 100 / (max + valuePerItem)}%`);
                    }} key={`horizontal-bar-chart-body-item-${indexValue}`} onClick={this.onProductReportDetail(itemValue)} className="horizontal-bar-chart-body-item" style={{
                        top: (indexValue * heightItem) + (indexValue == 0 ? 0 : offsetTop),
                        width: 0,
                        height: heightItem
                    }}>
                        <div className="horizontal-bar-chart-body-item-content">
                            <p className="horizontal-bar-chart-body-item-content-text">{(itemValue.quantity || 0)}</p>
                        </div>
                    </div>;

                    return element;
                })}
                {renderColumn(min, maxValue, valuePerItem)}
            </div>
        </div>;
    }

    onBackProductReport = () => {
        const { materialGroupId, productGroupId } = this.state;

        if (productGroupId) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    productGroupId: null,
                    productReportByTypeElement: null,
                    titleProductReportType: ''
                }
            });
        } else if (materialGroupId) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    materialGroupId: null,
                    productReportByGroupElement: null,
                    titleProductReportGroup: ''
                }
            });
        }
    }

    onKeyUp = e => {
        if (e.which == 13) {
            this.onFilter();
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
            listLength,
            typeTime,
            fields,
            month,
            year,
            precious,
            productReportElement,
            productReportByGroupElement,
            productGroupId,
            materialGroupId,
            productReportByTypeElement,
            titleProductReportType,
            titleProductReportGroup,
            fieldDataParent
        } = this.state;

        const dataa = {
            labels: [
                'Thuộc quy hoạch',
                'Ngoài quy hoạch'
            ],
            datasets: [{
                data: [planningArea, outerPlanningArea],

                backgroundColor: [
                    '#c5002e',
                    '#00a85a'
                ],
                hoverBackgroundColor: [
                    '#c5002e',
                    '#00a85a'
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

        let titleProductReport = '';

        if (titleProductReportType && titleProductReportGroup) {
            titleProductReport = titleProductReportGroup + ' - ' + titleProductReportType;
        } else if (titleProductReportType) {
            titleProductReport = titleProductReportType;
        } else if (titleProductReportGroup) {
            titleProductReport = titleProductReportGroup;
        }

        return (
            <>
                {
                    <div className={classes.wrapper}>
                        <Container fluid>
                            <div className="product-report-filter-wrap">
                                <div className="product-report-filter">
                                    <div className="product-report-filter-item">
                                        <input onChange={this.onChangeTypeTime} value={0} id="month" name="time" type='radio' checked={typeTime == 0} />
                                        <label className="product-report-filter-item-label" htmlFor="month">Theo tháng</label>
                                    </div>
                                    <div className="product-report-filter-item">
                                        <input onChange={this.onChangeTypeTime} value={1} id="precious" name="time" type='radio' checked={typeTime == 1} />
                                        <label className="product-report-filter-item-label" htmlFor="precious">Theo quý</label>
                                    </div>
                                    <div className="product-report-filter-item">
                                        <input onChange={this.onChangeTypeTime} value={2} id="year" name="time" type='radio' checked={typeTime == 2} />
                                        <label className="product-report-filter-item-label" htmlFor="year">Theo năm</label>
                                    </div>
                                </div>
                                <div className="product-report-filter-result">
                                    {typeTime == 0 ? <div className="product-report-filter-result-month">
                                        <div className="product-report-filter-result-item">
                                            <label className="product-report-filter-result-item-label">Tháng</label>
                                            <input
                                                value={month}
                                                onKeyUp={this.onKeyUp}
                                                onChange={this.onChangeValueTypeTime('month')}
                                                onBlur={this.onFilter} className="product-report-filter-result-item-input" />
                                        </div>
                                        <div className="product-report-filter-result-item">
                                            <label className="product-report-filter-result-item-label">Năm</label>
                                            <input
                                                value={year}
                                                onKeyUp={this.onKeyUp}
                                                onBlur={this.onFilter}
                                                onChange={this.onChangeValueTypeTime('year')}
                                                className="product-report-filter-result-item-input" />
                                        </div>
                                    </div> : null}
                                    {typeTime == 1 ? <div className="product-report-filter-result-precious">
                                        <div className="product-report-filter-result-item">
                                            <label className="product-report-filter-result-item-label">Quý</label>
                                            <input
                                                onKeyUp={this.onKeyUp}
                                                onChange={this.onChangeValueTypeTime('precious')}
                                                onBlur={this.onFilter}
                                                value={precious}
                                                className="product-report-filter-result-item-input" />
                                        </div>
                                        <div className="product-report-filter-result-item">
                                            <label className="product-report-filter-result-item-label">Năm</label>
                                            <input
                                                value={year}
                                                onKeyUp={this.onKeyUp}
                                                onBlur={this.onFilter}
                                                onChange={this.onChangeValueTypeTime('year')} className="product-report-filter-result-item-input" />
                                        </div>
                                    </div> : null}
                                    {typeTime == 2 ? <div className="product-report-filter-result-year">
                                        <div className="product-report-filter-result-item">
                                            <label className="product-report-filter-result-item-label">Năm</label>
                                            <input
                                                onBlur={this.onFilter}
                                                onKeyUp={this.onKeyUp}
                                                onChange={this.onChangeValueTypeTime('year')} className="product-report-filter-result-item-input" />
                                        </div>
                                    </div> : null}
                                </div>
                            </div>
                            <Row responsive={1} style={{ marginBottom: 20, marginTop: 10 }}>
                                <div style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>Ngành nghề</div>
                                <div style={{ marginTop: -4, marginRight: 8 }}>
                                    {/* <Select
                                        ref={ref => this.selectFied = ref}
                                        //name="status"
                                        title='Chọn ngành nghề'
                                        data={fields}
                                        labelName='fieldName'
                                        val='id'
                                        handleChange={this.handleSelectField}
                                    /> */}
                                    {/* <SelectTree
                                        ref={ref => this.selectField = ref}
                                        title='Chọn ngành nghề'
                                        data={fieldDataParent}
                                        dataAll={fields}
                                        // disableParent={true}
                                        // selected={currentFilter}
                                        labelName='fieldName'
                                        fieldName='fieldName'
                                        val='id'
                                        handleChange={this.handleSelectField}
                                    /> */}

                                    <Select
                                        
                                        ref={ref => this.selectField = ref}
                                        name="FieldID"
                                        title='Chọn ngành nghề'
                                        data={fields}
                                        labelName='fieldName'
                                        val='id'
                                        
                                        handleChange={this.handleSelectField}
                                    />
                                </div>
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
                            <div className="product-report-function">
                                <div className="product-report-function-back">
                                    {(materialGroupId || productGroupId) && <button type="button" className="btn-warning-cs btn btn-default btn-lg product-report-filter-submit product-report-back-button" onClick={this.onBackProductReport}>
                                        Quay về
                                    </button>}
                                </div>
                                {/* <div className="product-report-function-view">
                                    <button onClick={this.onFilter} type="button" className="btn-warning-cs btn btn-default btn-lg product-report-filter-submit product-report-view-button"><span>Xem</span></button>
                                </div> */}
                            </div>
                            {/* <h5 className="product-report-title">THỐNG KÊ SẢN PHẨM THEO NHÓM</h5>
                            <h5 className="product-report-address">TT.BẾN LỨC, H. BẾN LỨC, TỈNH LONG AN</h5>
                            <h6 className="product-report-time">THÁNG 02/2022</h6>
                            <h6 className="product-report-field">NGÀNH: TRỒNG TRỌT - CHĂN NUÔI</h6> */}
                            <h5 className="product-report-title">{titleProductReport}</h5>
                            <Row responsive={1} style={{ marginBottom: 20 }}>
                                {/* <div className="col-6">
                                    <ReactApexCharts options={this.state.optionBarCharts} series={this.state.barChartSeries} type="bar" width={500} height={350} />
                                </div> */}
                                {(!materialGroupId && !productGroupId) ? (productReportElement ? productReportElement : <div className="product-report-list-empty"><p className="product-report-list-empty-text">Hiện không có dữ liệu báo cáo</p></div>) : null}
                                {(materialGroupId && !productGroupId) ? (productReportByGroupElement ? productReportByGroupElement : <div className="product-report-list-empty"><p className="product-report-list-empty-text">Hiện không có dữ liệu báo cáo</p></div>) : null}
                                {(materialGroupId && productGroupId) ? (productReportByTypeElement ? productReportByTypeElement : <div className="product-report-list-empty"><p className="product-report-list-empty-text">Hiện không có dữ liệu báo cáo</p></div>) : null}

                            </Row>

                        </Container>
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        location: state.LocationStore,
        field: state.FieldStore
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionLocationCreators, dispatch),
        ...bindActionCreators(actionProductReports, dispatch),
        ...bindActionCreators(actionField, dispatch)
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CompanyAreaReports);