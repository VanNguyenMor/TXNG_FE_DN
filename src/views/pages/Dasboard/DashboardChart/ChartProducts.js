import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { handleGenTree } from '../../../../helpers/trees'
import compose from "recompose/compose";
import { actionLocationCreators } from '../../../../actions/LocationListAction';
import { actionProductReports } from '../../../../actions/ProductReportsActions';
import { LOADING_TIME, COMPANY_REPORTS_PLANNING } from '../../../../helpers/constant'

import { } from 'reactstrap'

class ChartPProducts extends Component {
    constructor(props) {
        super(props)
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

    }
    componentDidMount() {
        const { getDistrictList, requestGetArea, getListFieldComboBox } = this.props;

        getListFieldComboBox({
            search: '',
            filter: '',
            orderBy: '',
            page: null,
            limit: 1000
        }).then(res => {
            const fields = ((res.data || {}).data || {}).fields || [];
            let fieldDataParent = [];
            let haveRoot = false;

            fields
                .filter(item => item.parentID === null)
                .map(item => haveRoot = true);
            if (haveRoot) {
                fieldDataParent = handleGenTree(fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                    item['index'] = key + 1
                });
            } else {
                // Search Element in tree
                fields.map((item, key, array) => (
                    key === 0 && (item.parentID = null)
                ));

                fieldDataParent = handleGenTree(fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                    item['index'] = key + 1
                });
            }
            this.setState(previousState => {
                return {
                    ...previousState,
                    fields,
                    fieldDataParent: fieldDataParent,
                }
            });
        });

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
                reportFilterType: typeTime,
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
                reportFilterType: typeTime,
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
        return (
            <>
                <div className="product-report-list-empty"><p className="product-report-list-empty-text">Hiện chưa có dữ liệu</p></div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        location: state.LocationStore,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionLocationCreators, dispatch),
        ...bindActionCreators(actionProductReports, dispatch)
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ChartPProducts)

