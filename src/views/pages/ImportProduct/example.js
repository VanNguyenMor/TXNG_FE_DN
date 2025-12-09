import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Easing,
} from 'react-native';
import moment from 'moment';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import { ICONS } from '../../../assets/imgs';

import RNPickerSelect from 'react-native-picker-select';

import style from './style';

import { KEY_NAVIGATIONS, PAGINATIONS, DEFAULTS } from '../../constants/config';

import { goodReceivedConstant } from '../../states/goodReceived';

import { getErrorMessageServer } from '../../utils/errorMessageServer';

import FormQuestion from '../../components/formQuestion';

import FormDelete from '../../components/formDelete';

import DatePicker from '../../bases/controls/datePicker';

import {
    GOOD_RECEIVED,
    CLAIMS,
    STATUS_IMPORT_EXPORT,
} from '../../constants/data';

import { AuthenticateView } from '../../utils/auth';

import { COLORS } from '../../constants/theme';

class GoodReceivedItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animationTranslateX: new Animated.Value(0),
        };

        this.pageXStart = 0;
        this.pageXEnd = 0;
        this.pageYStart = 0;
        this.pageYEnd = 0;
        this.increase = 0;
        this.isDelete = false;
        this.isRequestConfirm = false;
        this.isLock = false;
    }

    onTouchStart = e => {
        this.pageXStart = e.nativeEvent.pageX;
        this.pageXEnd = 0;
        this.pageYStart = e.nativeEvent.pageY;
        this.pageYEnd = 0;
        this.increase = 0;
        this.isDelete = false;
        this.isRequestConfirm = false;
        this.isLock = false;
    };

    onTouchMove = e => {
        const pageXEndOld = this.pageXEnd;

        if (pageXEndOld != 0 && Math.abs(pageXEndOld - e.nativeEvent.pageX) <= 2) {
            return;
        }

        this.pageXEnd = e.nativeEvent.pageX;
        this.pageYEnd = e.nativeEvent.pageY;

        if (Math.abs(this.pageXStart - this.pageXEnd) > DEFAULTS.offSetMinSwipe) {
            const listGoodReceivedRef = this.props.listGoodReceivedRef;

            if (listGoodReceivedRef) {
                listGoodReceivedRef.setNativeProps({ scrollEnabled: false });
            }

            if (pageXEndOld > this.pageXEnd) {
                this.increase -= DEFAULTS.offSetIncreaseSwipe;
            } else {
                this.increase += DEFAULTS.offSetIncreaseSwipe;
            }

            Animated.timing(this.state.animationTranslateX, {
                toValue: this.increase,
                duration: 5,
                delay: 0,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();

            if (this.increase < -66 || this.increase > 0) {
                Animated.timing(this.state.animationTranslateX, {
                    toValue: this.increase < -66 ? -66 : 0,
                    duration: 5,
                    delay: 0,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    onTouchEnd = (id, confirmedByName) => e => {
        if (this.isDelete || this.isRequestConfirm || this.isLock) {
            return;
        }

        this.pageXEnd = e.nativeEvent.pageX;
        this.pageYEnd = e.nativeEvent.pageY;
        if (
            Math.abs(this.pageXStart - this.pageXEnd) <=
            DEFAULTS.offSetMinSwipeEdit &&
            Math.abs(this.pageYStart - this.pageYEnd) <= DEFAULTS.offSetMinSwipeEdit
        ) {
            this.props.onEdit(id, confirmedByName);

            this.increase = 0;
            this.pageXStart = 0;
            this.pageYStart = 0;
            this.pageYEnd = 0;
            this.pageXEnd = 0;
            this.isDelete = false;
            this.isRequestConfirm = false;
            this.isLock = false;

            return;
        }

        if (this.increase <= DEFAULTS.offSetMinSwipeExpand) {
            this.increase = -66;
        } else {
            this.increase = 0;
        }

        Animated.timing(this.state.animationTranslateX, {
            toValue: this.increase,
            duration: 5,
            delay: 0,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            const listGoodReceivedRef = this.props.listGoodReceivedRef;

            if (listGoodReceivedRef) {
                listGoodReceivedRef.setNativeProps({ scrollEnabled: true });
            }
        });

        this.increase = 0;
        this.pageXStart = 0;
        this.pageYStart = 0;
        this.pageYEnd = 0;
        this.pageXEnd = 0;
        this.isDelete = false;
        this.isRequestConfirm = false;
        this.isLock = false;
    };

    onDelete = id => () => {
        this.isDelete = true;
        this.props.onDelete(id).then(() => {
            this.isDelete = false;
        });
    };

    onRequestConfirm = item => () => {
        this.isRequestConfirm = true;

        this.props.onRequestConfirm(item).then(() => {
            this.isRequestConfirm = false;
        });
    };

    onLock = item => () => {
        this.isLock = true;

        this.props.onLock(item).then(() => {
            this.isLock = false;
        });
    };

    render() {
        const { item, confirmGR } = this.props;
        let titleButton = STATUS_IMPORT_EXPORT[item?.status || 0].title;
        let colorButton = STATUS_IMPORT_EXPORT[item?.status || 0].color;
        let styleColor = { color: colorButton };
        let borderColor = { borderColor: colorButton };
        return (
            <View
                onTouchEnd={this.onTouchEnd(item.id, item.confirmedByName)}
                onTouchMove={
                    item.status == 0 || (item.status == 3 && confirmGR)
                        ? this.onTouchMove
                        : null
                }
                onTouchStart={this.onTouchStart}
                style={style.bodyItem}>
                <Animated.View
                    style={[
                        style.bodyItemInfo,
                        {
                            transform: [
                                {
                                    translateX: this.state.animationTranslateX,
                                },
                            ],
                        },
                    ]}>
                    <View style={style.bodyItemInfoWrap}>
                        <View style={style.bodyItemInfoTitle}>
                            <Text numberOfLines={1} style={style.code}>
                                {item.grCode}
                            </Text>
                            <View style={[style.borderButton, { ...borderColor }]}>
                                <Text style={[style.titleButton, { ...styleColor }]}>
                                    {titleButton}
                                </Text>
                            </View>
                        </View>
                        <View style={style.bodyItemInfoTitle}>
                            <View style={style.txtItem}>
                                <Text style={style.content}>
                                    Thời gian:{' '}
                                    <Text style={style.italic}>
                                        {item.grTime
                                            ? moment(item.grTime).format('HH:mm DD/MM/YYYY')
                                            : ''}
                                    </Text>
                                </Text>
                                <Text style={style.content}>
                                    Nhà cung cấp:{' '}
                                    <Text style={style.italic} numberOfLines={1}>
                                        {item.partnerName}
                                    </Text>
                                </Text>
                                {item.status == 1 && (
                                    <Text style={style.content}>
                                        Ngày yêu cầu:{' '}
                                        <Text style={style.italic}>
                                            {item.requestedDate
                                                ? moment(item.requestedDate).format('HH:mm DD/MM/YYYY')
                                                : ''}
                                        </Text>
                                    </Text>
                                )}
                                {item.status == 2 && confirmGR && (
                                    <>
                                        <Text style={style.content}>
                                            Ngày kiểm duyệt:{' '}
                                            <Text style={style.italic}>
                                                {item.confirmedDate
                                                    ? moment(item.confirmedDate).format(
                                                        'HH:mm DD/MM/YYYY',
                                                    )
                                                    : ''}
                                            </Text>
                                        </Text>
                                        <Text style={style.content}>
                                            Người kiểm duyệt:{' '}
                                            <Text style={style.italic}>{item.confirmedByName}</Text>
                                        </Text>
                                    </>
                                )}
                                {item.status == 3 && (
                                    <>
                                        <Text style={style.content}>
                                            Lý do:{' '}
                                            <Text style={style.italic}>{item.confirmedReason}</Text>
                                        </Text>
                                        <Text style={style.content}>
                                            Ngày kiểm duyệt:{' '}
                                            <Text style={style.italic}>
                                                {' '}
                                                {item.confirmedDate
                                                    ? moment(item.confirmedDate).format(
                                                        'HH:mm DD/MM/YYYY',
                                                    )
                                                    : ''}
                                            </Text>
                                        </Text>
                                        <Text style={style.content}>
                                            Người kiểm duyệt:{' '}
                                            <Text style={style.italic}>{item.confirmedByName}</Text>
                                        </Text>
                                    </>
                                )}
                            </View>
                            {confirmGR && item.status == 0 && (
                                <TouchableOpacity activeOpacity={0.8}>
                                    <ICONS.airPlane
                                        onPress={this.onRequestConfirm(item)}
                                        width={24}
                                        height={24}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            )}
                            {item.status == 0 && !confirmGR && (
                                <AuthenticateView
                                    claims={[CLAIMS.goodReceipt.lock]}
                                    checkType={0}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={this.onLock(item)}>
                                        {item.islocked ? (
                                            <ICONS.lockClose width={24} height={24} />
                                        ) : (
                                            <ICONS.lockOpen width={24} height={24} />
                                        )}
                                    </TouchableOpacity>
                                </AuthenticateView>
                            )}
                        </View>
                    </View>
                </Animated.View>
                <View style={style.bodyItemFunction}>
                    <AuthenticateView claims={[CLAIMS.goodReceipt.delete]} checkType={0}>
                        <TouchableOpacity
                            onPress={this.onDelete(item.id)}
                            activeOpacity={0.8}
                            style={style.bodyItemDelete}>
                            <ICONS.trashWhite width={24} height={24} />
                        </TouchableOpacity>
                    </AuthenticateView>
                </View>
            </View>
        );
    }
}

class GoodReceived extends Component {
    constructor(props) {
        super(props);
        const currentDateTime = new Date();

        const temp = new Date().setDate(currentDateTime.getDate() - 30);

        const previousDateTime = moment(temp);

        this.state = {
            isVisible: false,
            page: 0,
            limit: PAGINATIONS.goodReceived,
            dateStart: previousDateTime.toDate(),
            dateEnd: currentDateTime,
            status: null,
            confirmGR: false,
        };
        this.listGoodReceivedRef = null;
        this.refFormDelete = null;
        this.refFormQuestion = null;
        this.isLoadingGoodReceived = false;
        this.scrollYGoodReceived = 0;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', async () => {
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                };
            });

            const { GoodReceivedOperations } = this.props;

            GoodReceivedOperations.getCompanyConfig(async result => {
                let data = (result.data || {}).data || {};

                this.isLoadingGoodReceived = false;

                const res = await this.getListGoodReceived(0, true);

                if (res.status != 200) {
                    _Toast.error('Thông báo', 'Lấy danh sách nhập hàng thất bại');
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false,
                        confirmGR: data?.confirmGR || false,
                    };
                });
            });
        });
    }

    formDeleteSetRef = ref => {
        this.refFormDelete = ref;
    };

    formQuestionSetRef = ref => {
        this.refFormQuestion = ref;
    };

    getListGoodReceived = (page, init = true) => {
        return new Promise(resolve => {
            this.isLoadingGoodReceived = true;

            const { limit, dateStart, dateEnd, status } = this.state;

            const { GoodReceivedOperations } = this.props;

            let _dateStartString = '';
            let _dateEndString = '';

            if (dateStart) {
                _dateStartString = moment(dateStart).format('YYYY-MM-DD');
            }

            if (dateEnd) {
                _dateEndString = moment(dateEnd).format('YYYY-MM-DD');
            }

            GoodReceivedOperations.getListGoodReceived(
                {
                    fromDate: _dateStartString,
                    toDate: _dateEndString,
                    status: status,
                    search: '',
                    filter: '',
                    orderBy: '',
                    page,
                    limit,
                    init,
                },
                res => {
                    const goodReceiveds =
                        ((res.data || {}).data || {}).goodsReceipts || [];

                    if (goodReceiveds.length > 0) {
                        this.setState(
                            previousState => {
                                return {
                                    ...previousState,
                                    page,
                                };
                            },
                            () => {
                                this.isLoadingGoodReceived = false;
                            },
                        );
                    } else {
                        this.isLoadingGoodReceived = false;
                    }

                    resolve(res);
                },
            );
        });
    };

    onAdd = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.addGoodReceived);
    };

    onEdit = (id, confirmedByName) => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.addGoodReceived, {
            id,
            confirmedByName,
        });
    };

    onLock = item => {
        return new Promise(resolve => {
            if (!item) {
                _Toast.error(
                    'Thông báo',
                    'Hệ thống không tìm thấy nguyên phiếu nhập này',
                );

                return resolve(false);
            }

            if (!item.id) {
                _Toast.error(
                    'Thông báo',
                    'Hệ thống không tìm thấy nguyên phiếu nhập này',
                );

                return resolve(false);
            }

            if (item.islocked) {
                _Toast.error(
                    'Thông báo',
                    'Nguyên phiếu nhập này đã khóa. Không thể mở khóa',
                );

                return resolve(false);
            }

            FormQuestion.open(
                result => {
                    if (result.result) {
                        this.props.GoodReceivedOperations.updateLock({ id: item.id }, res => {
                            if (res.status == 200) {
                                this.isLoadingGoodReceived = false;
                                this.getListGoodReceived(0, true);

                                return resolve(true);
                            } else {
                                const message = getErrorMessageServer(res);

                                _Toast.error(
                                    'Thông báo',
                                    message || 'Cập nhật trạng thái khóa thất bại',
                                );

                                return resolve(false);
                            }
                        });
                    } else {
                        return resolve(false);
                    }
                },
                'THÔNG BÁO',
                'Bạn có chắc chắn muốn khóa thông tin này ?',
                this.refFormQuestion,
            );
        });
    };

    //
    onRequestConfirm = item => {
        return new Promise(resolve => {
            if (!item) {
                _Toast.error('Thông báo', 'Hệ thống không tìm thấy phiếu nhập này');

                return resolve(false);
            }

            if (!item.id) {
                _Toast.error('Thông báo', 'Hệ thống không tìm thấy phiếu nhập này');

                return resolve(false);
            }

            if (item.status != 0) {
                _Toast.error(
                    'Thông báo',
                    'Phiếu nhập này không thuộc trạng thái cho phép yêu cầu duyệt',
                );

                return resolve(false);
            }

            FormQuestion.open(
                result => {
                    if (result.result) {
                        this.props.GoodReceivedOperations.requireConfirm(
                            { id: item.id },
                            res => {
                                const status = (res || {}).status;

                                if (status == 200) {
                                    this.isLoadingGoodReceived = false;
                                    this.getListGoodReceived(0, true);
                                    return resolve(true);
                                } else {
                                    const message = getErrorMessageServer(res);
                                    _Toast.error(
                                        'Thông báo',
                                        message || 'Yêu cầu duyệt thất bại',
                                    );

                                    return resolve(false);
                                }
                            },
                        );
                    } else {
                        return resolve(false);
                    }
                },
                'THÔNG BÁO',
                'Bạn muốn gửi yêu cầu duyệt phiếu nhập này?',
                this.refFormQuestion,
            );
        });
    };

    onDelete = id => {
        return new Promise(resolve => {
            if (!id) {
                _Toast.error('Thông báo', 'Phiếu nhập không tồn tại');

                resolve(false);

                return;
            }

            FormDelete.open(result => {
                if (result.result) {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: true,
                        };
                    });

                    this.props.GoodReceivedOperations.deleteGoodReceived({ id }, res => {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                isVisible: false,
                            };
                        });

                        if (res.status == 200) {
                            _Toast.success('Thông báo', 'Xóa phiếu nhập thành công');
                            this.isLoadingGoodReceived = false;
                            this.getListGoodReceived(0, true);

                            resolve(true);
                        } else {
                            const message = getErrorMessageServer(res);

                            _Toast.error('Thông báo', message || 'Xóa phiếu nhập thất bại');

                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            }, this.refFormDelete);
        });
    };
    //

    onInfinitingGoodReceived = event => {
        if (this.isLoadingGoodReceived) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );
        this.scrollYGoodReceived = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYGoodReceived <= DEFAULTS.offSetScrollInfinite) {
            this.isLoadingGoodReceived = true;

            this.getListGoodReceived(this.state.page + 1, false);
        }
    };
    //
    onChangeStatus = value => {
        this.setState(
            previousState => {
                return {
                    ...previousState,
                    status: value,
                    page: 0,
                };
            },
            () => {
                this.getListGoodReceived(this.state.page, true);
            },
        );
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
                    };
                },
                async () => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: true,
                        };
                    });

                    const res = await this.getListGoodReceived(this.state.page, true);

                    if (res.status != 200) {
                        _Toast.error('Thông báo', 'Lây danh sách nhập hàng thất bại');
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });
                },
            );
        }
    };

    onChangeDateStart = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);
            this.setState(
                previousState => {
                    return {
                        ...previousState,
                        dateStart: newDate,
                        page: 0,
                    };
                },
                async () => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: true,
                        };
                    });

                    const res = await this.getListGoodReceived(this.state.page, true);

                    if (res.status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách nhập hàng thất bại');
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });
                },
            );
        }
    };

    onPopupDateEnd = () => {
        DatePicker.open(
            this.state.dateEnd,
            this.onChangeDateEnd,
            this.refDatePicker,
        );
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
                    };
                },
                async () => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: true,
                        };
                    });

                    const res = await this.getListGoodReceived(this.state.page, true);

                    if (res.status != 200) {
                        _Toast.error('Thông báo', 'Lây danh sách nhập hàng thất bại');
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });
                },
            );
        }
    };

    render() {
        const { GoodReceivedReducer } = this.props;
        const { isVisible, dateStart, dateEnd, status, confirmGR } = this.state;

        let goodReceiveds = [];

        if (GoodReceivedReducer.get(goodReceivedConstant.KEYS.goodReceiveds).toJS) {
            goodReceiveds = GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.goodReceiveds,
            ).toJS();
        }
        // console.log('goodReceiveds', goodReceiveds);
        return (
            <BoxMainContainer
                formDeleteSetRef={this.formDeleteSetRef}
                formQuestionSetRef={this.formQuestionSetRef}
                isVisibleLoadingCenter={isVisible}
                isShowBackHeader={true}
                isScrollEnabled={false}
                styleBody={style.boxMainBody}
                isShowInfo={true}
                isShowQRCodeButton={true}
                isShowHeader={true}
                isShowVersion={true}
                isShowVersionName={true}>
                <View style={style.header}>
                    <Text style={style.title}>NHẬP HÀNG</Text>
                    {/* <TouchableOpacity activeOpacity={0.8} style={style.searchButton}>
            <ICONS.search width={24} height={24} />
          </TouchableOpacity> */}
                    <AuthenticateView claims={[CLAIMS.goodReceipt.add]} checkType={0}>
                        <TouchableOpacity
                            onPress={this.onAdd}
                            activeOpacity={0.8}
                            style={style.addButton}>
                            <ICONS.add width={24} height={24} />
                        </TouchableOpacity>
                    </AuthenticateView>
                </View>
                <View style={style.filter}>
                    <View style={style.filterDate}>
                        <View style={[style.filterDateItem]}>
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
                        <View style={style.block} />
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
                    <View style={style.filterStatus}>
                        <Text style={style.filterStatusLabel}>Trạng thái</Text>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                            placeholder={{
                                label: 'Chọn trạng thái',
                                inputLabel: 'Chọn trạng thái',
                                value: null,
                                ...style.filterItemSelectPlaceHolder,
                            }}
                            value={status}
                            style={{
                                inputIOSContainer: style.filterItemSelectContainerIOS,
                                inputAndroidContainer: style.filterItemSelectContainerAndroid,
                                inputAndroid: style.filterItemSelectInputAndroid,
                                inputIOS: style.filterItemSelectInputIOS,
                                iconContainer: style.filterItemSelectIcon,
                            }}
                            onValueChange={this.onChangeStatus}
                            items={GOOD_RECEIVED}
                            Icon={() => <ICONS.caretDown2 width={16} height={16} />}
                        />
                    </View>
                </View>
                <View style={style.body}>
                    <ScrollView
                        onScroll={this.onInfinitingGoodReceived}
                        ref={ref => (this.listGoodReceivedRef = ref)}
                        showsVerticalScrollIndicator={false}>
                        <View style={style.bodyWrap}>
                            {goodReceiveds.map((item, index) => {
                                return (
                                    <GoodReceivedItem
                                        key={index}
                                        item={item}
                                        listGoodReceivedRef={this.listGoodReceivedRef}
                                        confirmGR={confirmGR}
                                        onEdit={this.onEdit}
                                        onRequestConfirm={this.onRequestConfirm}
                                        onLock={this.onLock}
                                        onDelete={this.onDelete}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            </BoxMainContainer>
        );
    }
}

export default GoodReceived;
