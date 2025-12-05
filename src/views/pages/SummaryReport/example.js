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

import { numberWithCommas } from '../../bases/helper';

class ReportSell extends Component {
    constructor(props) {
        super(props);

        const currentDateTime = new Date();

        const previousDateTime = new Date().setDate(currentDateTime.getDate() - 30);

        this.state = {
            isVisible: false,
            page: 0,
            limit: PAGINATIONS.reportSell,
            info: {},
            reports: [],
            dateStart: previousDateTime,
            dateEnd: currentDateTime,
            productId: '',
            productName: '',
            products: [],
            partnerId: '',
            partnerName: '',
            partners: []
        };

        this.isLoadingReportSell = false;
        this.scrollYReportSell = 0;
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

            this.props.PartnerOperations.getListPartnerComboBox({}, res3 => {
                console.log('cx1ur141', res3);

                const partners = (res3.data || {}).partners || [];

                this.getListReportSell(0, true).then(async res => {
                    if ((res.data || {}).status != 200) {
                        _Toast.error(
                            'Thông báo',
                            'Lấy danh sách báo cáo bán hàng thất bại',
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
                            products,
                            partners
                        };
                    });
                });
            })
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

    getListReportSell = (page, init = true) => {
        return new Promise(resolve => {
            const { reports: reportOlds, limit, dateStart, dateEnd, productId, partnerId } = this.state;
            const { ReportOperations } = this.props;

            ReportOperations.getListReportSellV2({ page, limit, productId, fromDate: dateStart ? moment(dateStart).format('YYYY-MM-DD') : '', toDate: dateEnd ? moment(dateEnd).format('YYYY-MM-DD') : '', partnerId }, res => {
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
                            this.isLoadingReportSell = false;
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
                            this.isLoadingReportSell = false;
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
        return <TouchableOpacity delayPressIn={0} activeOpacity={0.8} onPress={this.onView(item.giid)} style={style.tableBodyRow}>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol1]}>
                <ICONS.eyeShow width={16} height={16} />
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol2]}>
                <Text style={style.tableBodyRowColText}>{index + 1}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol3]}>
                <Text style={style.tableBodyRowColText}>{item.partnerName}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol4]}>
                <Text style={style.tableBodyRowColText}>{item.productName}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol5]}>
                <Text style={style.tableBodyRowColText}>{item.unitName}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol6]}>
                <Text style={style.tableBodyRowColText}>{numberWithCommas(item.reportQuantity)}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol7]}>
                <Text style={style.tableBodyRowColText}>{numberWithCommas(item.unitPrice)}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol8]}>
                <Text style={style.tableBodyRowColText}>{numberWithCommas(item.perVAT)}%</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol9]}>
                <Text style={style.tableBodyRowColText}>{numberWithCommas(item.amount)}</Text>
            </View>
            <View style={[style.tableBodyRowCol, style.tableBodyRowCol10]}>
                <Text style={style.tableBodyRowColText}>{item.fullName}</Text>
            </View>
        </TouchableOpacity>
    }

    onView = id => () => {
        if (!id) {
            _Toast.error('Thông báo', 'Không có chi tiết để xem');

            return;
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.addGoodDelivery, {
            id
        });
    }

    onInfinitingQuantityProductByPlantingZone = event => {
        if (this.isLoadingReportSell) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );

        this.scrollYReportSell = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYFeedBack <= 100) {
            this.isLoadingReportSell = true;

            this.getListReportSell(this.state.page + 1, false);
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
                    const result = await this.getListReportSell(0, true);

                    if (((result || {}).data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách báo cáo bán hàng thất bại');
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
                    const result = await this.getListReportSell(0, true);

                    if (((result || {}).data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách báo cáo bán hàng thất bại');
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

    onPopupPartner = () => {
        const { partnerId, partners } = this.state;

        ModalSelect.open(
            this.onChangePartner,
            partners,
            partnerId,
            { value: 'id', label: 'partnerName' },
            'Chọn khách hàng',
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
                productName: item.productName
            };
        }, async () => {
            const result = await this.getListReportSell(0, true);

            if (((result || {}).data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách báo cáo bán hàng thất bại');
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false
                };
            });
        });
    }

    onChangePartner = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                partnerId: item.id,
                partnerName: item.partnerName
            };
        }, async () => {
            const result = await this.getListReportSell(0, true);

            if (((result || {}).data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách báo cáo bán hàng thất bại');
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
            productName,
            partnerName
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
                <Text style={style.title}>BÁO CÁO BÁN HÀNG</Text>
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
                        <View style={style.filterPlantingZone}>
                            <Text style={style.filterPlantingZoneLabel}>Khách hàng</Text>
                            <TouchableOpacity
                                onPress={this.onPopupPartner}
                                activeOpacity={0.8}
                                style={style.filterPlantingZoneSelect}>
                                <Text style={style.filterPlantingZoneSelectText}>
                                    {partnerName ? partnerName : 'Chọn khách hàng'}
                                </Text>
                                <View style={style.filterPlantingZoneSelectIcon}>
                                    <ICONS.caretDown2 width={16} height={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.table}>
                        <ScrollView horizontal={true} style={style.tableScroll}>
                            <View style={style.tableScrollBox}>
                                <View style={style.tableHeader}>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol1]}>
                                        <Text style={style.tableHeaderColTitle}>Xem phiếu xuất</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol2]}>
                                        <Text style={style.tableHeaderColTitle}>STT</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol3]}>
                                        <Text style={style.tableHeaderColTitle}>Khách hàng</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol4]}>
                                        <Text style={style.tableHeaderColTitle}>Sản phẩm</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol5]}>
                                        <Text style={style.tableHeaderColTitle}>ĐVT</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol6]}>
                                        <Text style={style.tableHeaderColTitle}>SL</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol7]}>
                                        <Text style={style.tableHeaderColTitle}>ĐG</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol8]}>
                                        <Text style={style.tableHeaderColTitle}>VAT (%)</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol9]}>
                                        <Text style={style.tableHeaderColTitle}>TT</Text>
                                    </View>
                                    <View style={[style.tableHeaderCol, style.tableHeaderCol10]}>
                                        <Text style={style.tableHeaderColTitle}>Người thực hiện</Text>
                                    </View>
                                </View>
                                {reports.length <= 0 ? <Text style={style.tableEmpty}>Chưa có dữ liệu</Text> : null}
                                <FlatList showsVerticalScrollIndicator={false} onScroll={this.onInfinitingQuantityProductByPlantingZone} data={reports} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </BoxMainContainer>
        );
    }
}

export default ReportSell;