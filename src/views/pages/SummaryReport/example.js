import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';

import BoxMainContainer from '../../containers/components/boxMain';

import style from './style';

import _Toast from '../../bases/controls/toast';

import { DEFAULTS, KEY_NAVIGATIONS, PAGINATIONS } from '../../constants/config';

import { ICONS } from '../../../assets/imgs';

import DatePicker from '../../bases/controls/datePicker';

import { ModalSelect } from '../../bases/controls/select';

class ReportBatch extends Component {
    constructor(props) {
        super(props);

        const currentDateTime = new Date();

        const previousDateTime = new Date().setDate(currentDateTime.getDate() - 30);

        this.state = {
            isVisible: false,
            page: 0,
            limit: PAGINATIONS.reportBatch,
            info: {},
            reports: [],
            dateStart: previousDateTime,
            dateEnd: currentDateTime,
            productId: '',
            productName: '',
            products: []
        };

        this.isLoadingReportBatch = false;
        this.scrollYReportBatch = 0;
        this.refToast = null;
        this.refModalSelect = null;
        this.refDatePicker = null;
    }

    componentDidMount() {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        this.props.ProductOperations.getListProductComboBox({}, res2 => {
            const products = ((res2.data || {}).data || {}).products || [];

            this.getListReportBatch(0, true).then(async res => {
                if ((res.data || {}).status != 200) {
                    _Toast.error(
                        'Thông báo',
                        'Lấy danh sách báo cáo lô hảng thất bại',
                        null,
                        true,
                        {},
                        this.refToast,
                    );
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false,
                        products
                    };
                });
            });
        });
    }

    modalSelectSetRef = ref => {
        this.refModalSelect = ref;
    };

    datePickerSetRef = ref => {
        this.refDatePicker = ref;
    };

    toastSetRef = ref => {
        this.refToast = ref;
    };

    getListReportBatch = (page, init = true) => {
        return new Promise(resolve => {
            const { reports: reportOlds, limit, dateStart, dateEnd, productId } = this.state;
            const { ReportOperations } = this.props;

            ReportOperations.getListReportBatchV2({ page, limit, productId, fromDate: dateStart ? moment(dateStart).format('YYYY-MM-DD') : '', toDate: dateEnd ? moment(dateEnd).format('YYYY-MM-DD') : '' }, res => {
                console.log('cacaca', res);

                let reports = [];

                const reportNews = (((res || {}).data || {}).data || {}).reports || [];
                const info = (((res || {}).data || {}).data || {}).info || {};

                if (init == true) {
                    reports = [...reportNews];
                } else {
                    reports = reportOlds.concat(reportNews);
                }

                if (reportNews.length > 0) {
                    this.setState(
                        previousState => {
                            return {
                                ...previousState,
                                page,
                                info,
                                reports
                            };
                        },
                        () => {
                            this.isLoadingReportBatch = false;
                        },
                    );
                } else {
                    this.setState(
                        previousState => {
                            return {
                                ...previousState,
                                info,
                                reports
                            };
                        },
                        () => {
                            this.isLoadingReportBatch = false;
                        },
                    );
                }

                resolve(res);
            });
        });
    };

    keyExtractor = (item, index) => {
        return item.id + index.toString();
    }

    renderItem = ({ item, index }) => {
        return <TouchableOpacity delayPressIn={0} activeOpacity={0.8} onPress={this.onView(item.id)} style={style.tableBodyRow}>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol1]}>
                <ICONS.eyeShow width={16} height={16} />
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol2]}>
                <Text style={style.tableBodyRowColText}>{index + 1}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol3]}>
                <Text style={style.tableBodyRowColText}>{item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY') : ''}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol4]}>
                <Text style={style.tableBodyRowColText}>{item.batchNum}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol5]}>
                <Text style={style.tableBodyRowColText}>{item.usedCount}</Text>
            </View>
        </TouchableOpacity>
    }

    onView = id => () => {
        if (!id) {
            _Toast.error('Thông báo', 'Không có chi tiết để xem');

            return;
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment, {
            id
        });
    }

    onInfinitingBatch = event => {
        if (this.isLoadingReportBatch) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );

        this.scrollYReportBatch = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYReportBatch <= 100) {
            this.isLoadingReportBatch = true;

            this.getListReportBatch(this.state.page + 1, false);
        }
    };

    onPopupDateStart = () => {
        DatePicker.open(
            this.state.dateStart,
            this.onChangeDateStart,
            this.refDatePicker,
        );
    };

    onPopupDateEnd = () => {
        DatePicker.open(
            this.state.dateEnd,
            this.onChangeDateEnd,
            this.refDatePicker,
        );
    }

    onChangeDateStart = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);

            this.setState(
                previousState => {
                    return {
                        ...previousState,
                        dateStart: newDate,
                        page: 0,
                        isVisible: true
                    };
                },
                async () => {
                    const result = await this.getListReportBatch(0, true);

                    if (((result || {}).data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách báo cáo lô hàng thất bại');
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false
                        };
                    });
                },
            );
        }
    };

    onChangeDateEnd = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);

            this.setState(
                previousState => {
                    return {
                        ...previousState,
                        dateEnd: newDate,
                        page: 0,
                        isVisible: true
                    };
                },
                async () => {
                    const result = await this.getListReportBatch(0, true);

                    if (((result || {}).data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách báo cáo lô hàng thất bại');
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false
                        };
                    });
                },
            );
        }
    };

    onPopupProduct = () => {
        const { productId, products } = this.state;

        ModalSelect.open(
            this.onChangeProduct,
            products,
            productId,
            { value: 'id', label: 'productName' },
            'Chọn sản phẩm',
            'Tìm kiếm',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            this.refModalSelect,
            false,
        );
    }

    onChangeProduct = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                productId: item.id,
                productName: item.productName,
                page: 0,
                isVisible: true
            };
        }, async () => {
            const result = await this.getListReportBatch(0, true);

            if (((result || {}).data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách báo cáo lô hàng thất bại');
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false
                };
            });
        });
    }

    render() {
        const {
            isVisible,
            reports,
            dateStart,
            dateEnd,
            productName
        } = this.state;

        return (
            <BoxMainContainer
                modalSelectSetRef={this.modalSelectSetRef}
                datePickerSetRef={this.datePickerSetRef}
                toastSetRef={this.toastSetRef}
                isVisibleLoadingCenter={isVisible}
                isShowBackHeader={true}
                isScrollEnabled={false}
                styleBody={style.boxMainBody}
                isShowInfo={true}
                isShowQRCodeButton={false}
                isShowHeader={true}
                isShowVersion={false}
                isShowVersionName={false}>
                <Text style={style.title}>BÁO CÁO LÔ HÀNG</Text>
                <View style={style.body}>
                    <View style={style.filter}>
                        <View style={style.filterDate}>
                            <View style={style.filterDateItem}>
                                <Text style={style.filterDateItemLabel}>Từ ngày</Text>
                                <TouchableOpacity
                                    onPress={this.onPopupDateStart}
                                    activeOpacity={0.8}
                                    style={style.filterDateItemSelect}>
                                    <Text style={style.filterDateItemSelectLabel}>
                                        {dateStart ? moment(dateStart).format('DD/MM/YYYY') : ''}
                                    </Text>
                                    <ICONS.calendar width={16} height={16} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.filterDateSpace}></View>
                            <View style={style.filterDateItem}>
                                <Text style={style.filterDateItemLabel}>Đến ngày</Text>
                                <TouchableOpacity
                                    onPress={this.onPopupDateEnd}
                                    activeOpacity={0.8}
                                    style={style.filterDateItemSelect}>
                                    <Text style={style.filterDateItemSelectLabel}>
                                        {dateEnd ? moment(dateEnd).format('DD/MM/YYYY') : ''}
                                    </Text>
                                    <ICONS.calendar width={16} height={16} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={style.filterProduct}>
                            <Text style={style.filterProductLabel}>Sản phẩm</Text>
                            <TouchableOpacity
                                onPress={this.onPopupProduct}
                                activeOpacity={0.8}
                                style={style.filterProductSelect}>
                                <Text style={style.filterProductSelectText}>
                                    {productName ? productName : 'Chọn sản phẩm'}
                                </Text>
                                <View style={style.filterProductSelectIcon}>
                                    <ICONS.caretDown2 width={16} height={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.table}>
                        <ScrollView horizontal={true} style={style.tableScroll}>
                            <View style={style.tableScrollBox}>
                                <View style={style.tableHeader}>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol2]}>
                                        <Text style={style.tableHeaderColTitle}>Xem lô hàng</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol1]}>
                                        <Text style={style.tableHeaderColTitle}>STT</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol3]}>
                                        <Text style={style.tableHeaderColTitle}>Ngày</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol4]}>
                                        <Text style={style.tableHeaderColTitle}>Mã lô</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol5]}>
                                        <Text style={style.tableHeaderColTitle}>SL tem</Text>
                                    </View>
                                </View>
                                {reports.length <= 0 ? <Text style={style.tableEmpty}>Chưa có dữ liệu</Text> : null}
                                <FlatList onScroll={this.onInfinitingBatch} data={reports} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </BoxMainContainer>
        );
    }
}

export default ReportBatch;
