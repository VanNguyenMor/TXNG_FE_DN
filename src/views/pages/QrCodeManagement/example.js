import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    FlatList,
    Image,
    ScrollView,
} from 'react-native';

import moment from 'moment';

import { ModalSelect } from '../../bases/controls/select';

import DatePicker from '../../bases/controls/datePicker';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import { ICONS } from '../../../assets/imgs';

import style from './style';
import { BAD_STAMP_STATUSES, BAD_STAMP_STATUS_COLORS, BAD_STAMP_STATUS_TEXTS, CLAIMS, STAMP_REQUEST_HISTORY_TYPES, STATUS_IMPORT_EXPORT } from '../../constants/data';

import { DEFAULTS, KEY_NAVIGATIONS, PAGINATIONS } from '../../constants/config';

import { AuthenticateView } from '../../utils/auth';
import FormDelete from '../../components/formDelete';
import { getErrorMessageServer } from '../../utils/errorMessageServer';

class ManageQRBadItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animationTranslateX: new Animated.Value(0)
        };

        this.isDelete = false;
        this.pageXStart = 0;
        this.pageXEnd = 0;
        this.pageYStart = 0;
        this.pageYEnd = 0;
        this.increase = 0;
    }

    renderBadStampStatus = item => {
        let text = '';
        let color = '';

        if (item.status == BAD_STAMP_STATUSES.new) {
            text = BAD_STAMP_STATUS_TEXTS.new;
            color = BAD_STAMP_STATUS_COLORS.new;
        } else if (item.status == BAD_STAMP_STATUSES.notVerfied) {
            text = BAD_STAMP_STATUS_TEXTS.notVerfied;
            color = BAD_STAMP_STATUS_COLORS.notVerfied;
        } else if (item.status == BAD_STAMP_STATUSES.verifed) {
            text = BAD_STAMP_STATUS_TEXTS.verifed;
            color = BAD_STAMP_STATUS_COLORS.verifed;
        }

        return { text, color };
    }

    onTouchStart = e => {
        this.pageXStart = e.nativeEvent.pageX;
        this.pageXEnd = 0;
        this.pageYStart = e.nativeEvent.pageY;
        this.pageYEnd = 0;
        this.increase = 0;
        this.isDelete = false;
    };

    onTouchMove = e => {
        const pageXEndOld = this.pageXEnd;

        if (pageXEndOld != 0 && Math.abs(pageXEndOld - e.nativeEvent.pageX) <= 2) {
            return;
        }

        this.pageXEnd = e.nativeEvent.pageX;
        this.pageYEnd = e.nativeEvent.pageY;

        if (Math.abs(this.pageXStart - this.pageXEnd) > DEFAULTS.offSetMinSwipe) {
            const listManageQRBadRef = this.props.listManageQRBadRef;

            if (listManageQRBadRef) {
                listManageQRBadRef.setNativeProps({ scrollEnabled: false });
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

    onTouchEnd = id => e => {
        if (this.isDelete) {
            return;
        }

        this.pageXEnd = e.nativeEvent.pageX;
        this.pageYEnd = e.nativeEvent.pageY;

        if (
            Math.abs(this.pageXStart - this.pageXEnd) <=
            DEFAULTS.offSetMinSwipeEdit &&
            Math.abs(this.pageYStart - this.pageYEnd) <= DEFAULTS.offSetMinSwipeEdit
        ) {
            this.props.onEdit(id);

            this.increase = 0;
            this.pageXStart = 0;
            this.pageYStart = 0;
            this.pageYEnd = 0;
            this.pageXEnd = 0;
            this.isDelete = false;

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
            const listManageQRBadRef = this.props.listManageQRBadRef;

            if (listManageQRBadRef) {
                listManageQRBadRef.setNativeProps({ scrollEnabled: true });
            }
        });

        this.increase = 0;
        this.pageXStart = 0;
        this.pageYStart = 0;
        this.pageYEnd = 0;
        this.pageXEnd = 0;
        this.isDelete = false;
    };

    onDelete = id => () => {
        this.isDelete = true;

        this.props.onDelete(id).then(() => {
            this.isDelete = false;
        });
    };

    render() {
        const { item } = this.props;
        const { text, color } = this.renderBadStampStatus(item);

        return (
            <View
                onTouchEnd={this.onTouchEnd(item.id)}
                onTouchMove={this.onTouchMove}
                onTouchStart={this.onTouchStart}
                style={style.bodyItem4}>
                <Animated.View style={[style.bodyItem4Box, {
                    transform: [
                        {
                            translateX: this.state.animationTranslateX,
                        },
                    ],
                }]}>
                    <View style={style.bodyItem4Info}>
                        <Text style={style.bodyItem3InfoTitle}>Huỷ tem</Text>
                        <Text style={style.bodyItem3InfoQuantity}>Số lượng: {item.quantity || 0}</Text>
                        <Text style={style.bodyItem3InfoDate}>Thời gian: {item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY HH:mm') : ''}</Text>
                        <Text style={style.bodyItem3InfoReasonCancel}>Lý do huỷ: {item.reasonCancel}</Text>
                        <Text style={style.bodyItem3InfoRange}>Dải tem huỷ: {item.startRange} - {item.endRange}</Text>
                    </View>
                    <View style={style.bodyItem4Status}>
                        <Text style={[style.bodyItem4StatusTitle, { color }]}>{text}</Text>
                    </View>
                </Animated.View>
                <AuthenticateView claims={[CLAIMS.manageQR.delete]} checkType={0}>
                    <View style={style.bodyItemDeleteWrap}>
                        <TouchableOpacity
                            onPress={this.onDelete(item.id)}
                            activeOpacity={0.8}
                            style={style.bodyItemDelete}>
                            <ICONS.trashWhite width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </AuthenticateView>
            </View>
        );
    }
}

class ManageQR extends Component {
    constructor(props) {
        super(props);
        const currentDateTime = new Date();

        const temp = new Date().setDate(currentDateTime.getDate() - 30);

        const previousDateTime = moment(temp);

        this.state = {
            isVisible: false,
            currentTab: 1,
            animationTabHeaderItem1: new Animated.Value(0),
            animationTabHeaderItem2: new Animated.Value(-110),
            animationTabHeaderItem3: new Animated.Value(-220),
            pageSystem: 0,
            pageIncurred: 0,
            limit: PAGINATIONS.manageQR,
            dateStart: previousDateTime,
            dateEnd: currentDateTime,
            productName: '',
            productID: '',
            dataSystem: [],
            totalSystem: 0,
            dataIncurred: [],
            totalIncurred: 0,
            products: [],
            qrCodes: [],
            page: 0,
            stampRequestIdHandle: null,
            stampRequest: null,
            screenStampRequest: -1
        };

        this.isLoadingManageQR = false;
        this.listManageQRBadRef = null;
        this.refFormDelete = null;
        this.listManageQRHistoryRef = null;
    }

    componentDidMount() {
        // this.props.navigation.addListener('focus', () => {
        //     this.onChooseTab(1)();
        // });
    }

    formDeleteSetRef = ref => {
        this.refFormDelete = ref;
    };

    getListManageQR = async () => {
        const { currentTab } = this.state;
        if (currentTab == 1) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    dataSystem: [],
                };
            });
            setTimeout(() => {
                this.getListManageQRSystem(0);
            }, 0);
        } else if (currentTab == 0) {
            this.getProduct();
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                };
            });

            const res = await this.getListManageQRIncurred(0);

            if (res.status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách tem thất bại');
            }
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false,
                };
            });
        } else if (currentTab == 2) {
            const result = await this.getListManageQRRequest(0, true);

            if ((result.data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách tem thất bại');
            }
        }
    };

    getListManageQRIncurred = (page, id = '') => {
        return new Promise(resolve => {
            const { ManageQROperations } = this.props;
            const { limit, dateStart, dateEnd, productID, dataIncurred } = this.state;
            ManageQROperations.getListManageQRIncurred(
                {
                    startDate: dateStart,
                    endDate: dateEnd,
                    fieldID: '',
                    productID: id ? id : productID,
                    batchNum: '',
                    qrCode: '',
                    orderBy: '',
                    page,
                    limit,
                },
                res => {
                    let result = ((res.data || {}).data || {}).batches || [];

                    let totalIncurred = ((res.data || {}).data || {}).total || 0;
                    let temp = dataIncurred;
                    const length = dataIncurred.length;
                    if (length < totalIncurred && page != 0) {
                        temp = dataIncurred.concat(result);
                    } else {
                        temp = result;
                    }
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            totalIncurred,
                            pageIncurred: page,
                            dataIncurred: temp,
                        };
                    });
                    resolve(res);
                },
            );
        });
    };

    getListManageQRSystem = page => {
        const { ManageQROperations } = this.props;
        const { limit, dataSystem } = this.state;

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        ManageQROperations.getListManageQRSystem(
            {
                search: '',
                filter: '',
                orderBy: '',
                page,
                limit,
            },
            res => {
                if (res.status != 200) {
                    _Toast.error('Thông báo', 'Lấy danh sách mã QR thất bại');
                }
                let result = ((res.data || {}).data || {}).qRCodes || [];
                let totalSystem = ((res.data || {}).data || {}).total || 0;
                let temp = dataSystem;
                const length = dataSystem.length;
                if (length < totalSystem) {
                    temp = dataSystem.concat(result);
                }
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false,
                        totalSystem,
                        pageSystem: page,
                        dataSystem: temp,
                    };
                });
            },
        );
    };

    getListManageQRRequest = (page, init = true) => {
        return new Promise(resolve => {
            const { ManageQROperations } = this.props;
            const { limit, qrCodes, page: pageOld } = this.state;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true
                }
            });

            ManageQROperations.getListManageQRRequest(
                {
                    page,
                    limit
                },
                res => {
                    console.log(res);

                    const _qrCodes = ((res.data || {}).data || {}).qrCodes || [];
                    let qrCodeNews = [];
                    let _page = 0;

                    if (init) {
                        qrCodeNews = _qrCodes ? [..._qrCodes] : [];
                    } else {
                        qrCodeNews = (qrCodes ? [...qrCodes] : []).concat(_qrCodes);
                    }

                    if (_qrCodes.length <= 0) {
                        _page = pageOld;
                    } else {
                        _page = page;
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            qrCodes: qrCodeNews,
                            page: _page,
                            isVisible: false
                        }
                    }, () => {
                        this.isLoadingManageQR = false;

                        resolve(res);
                    });
                },
            );
        });
    }

    getListManageQRBad = (page, init = true) => {
        return new Promise(resolve => {
            const { ManageQROperations } = this.props;
            const { limit, qrCodes, page: pageOld, stampRequestIdHandle, dateStart, dateEnd } = this.state;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true
                }
            });

            ManageQROperations.getListManageQRBad(
                {
                    page,
                    limit,
                    stampRequestId: stampRequestIdHandle,
                    fromDate: dateStart ? moment(dateStart).format('YYYY-MM-DD') : '',
                    toDate: dateEnd ? moment(dateEnd).format('YYYY-MM-DD') : ''
                },
                res => {
                    const _qrCodes = ((res.data || {}).data || {}).qrCodes || [];
                    let qrCodeNews = [];
                    let _page = 0;

                    if (init) {
                        qrCodeNews = _qrCodes ? [..._qrCodes] : [];
                    } else {
                        qrCodeNews = (qrCodes ? [...qrCodes] : []).concat(_qrCodes);
                    }

                    if (_qrCodes.length <= 0) {
                        _page = pageOld;
                    } else {
                        _page = page;
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            qrCodes: qrCodeNews,
                            page: _page,
                            isVisible: false
                        }
                    }, () => {
                        this.isLoadingManageQR = false;

                        resolve(res);
                    });
                },
            );
        });
    }

    getListManageQRHistory = (page, init = true) => {
        return new Promise(resolve => {
            const { ManageQROperations } = this.props;
            const { limit, qrCodes, page: pageOld, stampRequestIdHandle, dateStart, dateEnd } = this.state;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true
                }
            });

            ManageQROperations.getListManageQRHistory(
                {
                    page,
                    limit,
                    stampRequestId: stampRequestIdHandle,
                    fromDate: dateStart ? moment(dateStart).format('YYYY-MM-DD') : '',
                    toDate: dateEnd ? moment(dateEnd).format('YYYY-MM-DD') : ''
                },
                res => {
                    console.log('cacacaca', res);

                    const _qrCodes = ((res.data || {}).data || {}).qrCodes || [];
                    let qrCodeNews = [];
                    let _page = 0;

                    if (init) {
                        qrCodeNews = _qrCodes ? [..._qrCodes] : [];
                    } else {
                        qrCodeNews = (qrCodes ? [...qrCodes] : []).concat(_qrCodes);
                    }

                    if (_qrCodes.length <= 0) {
                        _page = pageOld;
                    } else {
                        _page = page;
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            qrCodes: qrCodeNews,
                            page: _page,
                            isVisible: false
                        }
                    }, () => {
                        this.isLoadingManageQR = false;

                        resolve(res);
                    });
                },
            );
        });
    }

    //
    getProduct = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        const { ManageQROperations } = this.props;

        ManageQROperations.getListProductComboBox(
            {
                fieldID: '',
                productCode: '',
                productName: '',
                orderBy: ' A.ProductName ',
                page: null,
                limit: null,
            },
            res => {
                const products = ((res.data || {}).data || {}).products || [];
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false,
                        products,
                    };
                });
            },
        );
    };

    onChooseTab = tab => () => {
        Animated.parallel([
            Animated.timing(this.state.animationTabHeaderItem1, {
                duration: 250,
                toValue: tab == 1 ? 0 : 110,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.animationTabHeaderItem2, {
                duration: 250,
                toValue: tab == 0 ? 0 : (tab == 2 ? 110 : -110),
                useNativeDriver: true,
            }),
            Animated.timing(this.state.animationTabHeaderItem3, {
                duration: 250,
                toValue: tab == 2 ? 0 : -220,
                useNativeDriver: true,
            }),
        ]).start();

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    currentTab: tab,
                    page: 0,
                    qrCodes: [],
                    stampRequestIdHandle: null,
                    screenStampRequest: -1
                };
            },
            () => this.getListManageQR(),
        );
    };

    onDetailSystem = id => () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.listDiary, { id });
    };

    onDetailIncurred = item => () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.detailDiary, {
            id: item.traceID,
            fieldType: item.fieldType,
        });
    };

    onPrintQRCodeIndividual = item => () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.printManageQR, { item });
    };

    onPopupDateStart = () => {
        DatePicker.open(
            this.state.dateStart,
            this.onChangeDateStart,
            this.refDatePicker,
        );
    };

    onChangeDateStart = (result, year, month, day) => {
        if (result) {
            const { stampRequestIdHandle } = this.state;

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

                    if (stampRequestIdHandle) {
                        const result = await this.getListManageQRBad(0, true);

                        if ((result.data || {}).status != 200) {
                            _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
                        }
                    } else {
                        const res = await this.getListManageQRIncurred(0);

                        if (res.status != 200) {
                            _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
                        }
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
            const { stampRequestIdHandle } = this.state;

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

                    if (stampRequestIdHandle) {
                        const result = await this.getListManageQRBad(0, true);

                        if ((result.data || {}).status != 200) {
                            _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
                        }
                    } else {
                        const res = await this.getListManageQRIncurred(0);

                        if (res.status != 200) {
                            _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
                        }
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

    onPopupProduct = () => {
        ModalSelect.open(
            this.onChangeProduct,
            this.state.products,
            this.state.productID,
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
    };

    onChangeProduct = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                productID: item.id,
                productName: item.productName,
                isVisible: true,
            };
        });

        this.getListManageQRIncurred(0, item.id).then(res => {
            if (res.status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false,
                };
            });
        });
    };

    onInfinitingManageQRRequest = event => {
        if (this.isLoadingManageQR) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );
        this.scrollYAccount = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYAccount <= DEFAULTS.offSetScrollInfinite) {
            this.isLoadingManageQR = true;

            this.getListManageQRRequest(this.state.page + 1, false);
        }
    }

    onInfinitingManageQRBad = event => {
        if (this.isLoadingManageQR) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );
        this.scrollYAccount = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYAccount <= DEFAULTS.offSetScrollInfinite) {
            this.isLoadingManageQR = true;

            this.getListManageQRBad(this.state.page + 1, false);
        }
    }

    onInfinitingManageQRHistory = event => {
        if (this.isLoadingManageQR) {
            return;
        }

        const height = Math.ceil(
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        );
        this.scrollYAccount = Math.ceil(event.nativeEvent.contentOffset.y);

        if (height - this.scrollYAccount <= DEFAULTS.offSetScrollInfinite) {
            this.isLoadingManageQR = true;

            this.getListManageQRHistory(this.state.page + 1, false);
        }
    }

    onHandleStampRequest = item => () => {
        if (!item) {
            _Toast.error('Thông báo', 'Dải tem này không hợp lệ');

            return;
        }

        if (!item.id) {
            _Toast.error('Thông báo', 'Dải tem này không hợp lệ');

            return;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                stampRequestIdHandle: item.id,
                page: 0,
                dateStart: new Date(),
                dateEnd: new Date(),
                stampRequest: item,
                screenStampRequest: 0
            }
        }, async () => {
            const result = await this.getListManageQRBad(0, true);

            if ((result.data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
            }
        });
    }

    onHistoryStampRequest = item => () => {
        if (!item) {
            _Toast.error('Thông báo', 'Dải tem này không hợp lệ');

            return;
        }

        if (!item.id) {
            _Toast.error('Thông báo', 'Dải tem này không hợp lệ');

            return;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                stampRequestIdHandle: item.id,
                page: 0,
                dateStart: new Date(),
                dateEnd: new Date(),
                stampRequest: item,
                screenStampRequest: 1
            }
        }, async () => {
            const result = await this.getListManageQRHistory(0, true);

            if ((result.data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
            }
        });
    }

    handleBackScreenBadStamp = () => {
        const { stampRequestIdHandle, stampRequest, screenStampRequest } = this.state;

        this.setState(previousState => {
            return {
                ...previousState,
                stampRequestIdHandle,
                page: 0,
                dateStart: new Date(),
                dateEnd: new Date(),
                stampRequest,
                screenStampRequest
            }
        }, async () => {
            const result = await this.getListManageQRBad(0, true);

            if ((result.data || {}).status != 200) {
                _Toast.error('Thông báo', 'Lấy danh sách QR thất bại');
            }
        });
    }

    onAddBadStamp = () => {
        const { stampRequestIdHandle, stampRequest, screenStampRequest } = this.state;

        const data = {
            stampRequestIdHandle,
            stampRequest,
            screenStampRequest
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.addBadStamp, {
            stampRequestId: stampRequestIdHandle,
            handleBackScreenBadStamp: this.handleBackScreenBadStamp
        });
    }

    onDeleteManageQRBad = id => {
        return new Promise(resolve => {
            if (!id) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn lịch sử tem muốn xóa');

                return resolve(false);
            }

            FormDelete.open(() => {
                this.props.ManageQROperations.deleteManageQRBad({ id }, res => {
                    const status = (res.data || {}).status;

                    if (status == 200) {
                        _Toast.success('Thông báo', 'Xóa lịch sử tem thành công');

                        this.getListManageQRBad(0, true);

                        resolve(true);
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Xóa lịch sử tem thất bại');

                        resolve(false);
                    }
                });
            }, this.refFormDelete);
        });
    }

    onEditManageQRBad = id => {
        return new Promise(resolve => {
            if (!id) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn lịch sử tem muốn sửa');

                return resolve(false);
            }

            this.props.navigation.navigate(KEY_NAVIGATIONS.addBadStamp, {
                id
            });
        });
    }

    renderTitleManageQRHistoryItem = item => {
        let title = '';

        let metaData = {};

        if (item.metaData) {
            try {
                metaData = JSON.parse(item.metaData);
            } catch { }
        }

        if (item.type == STAMP_REQUEST_HISTORY_TYPES.batch) {
            title = 'Lô hàng: ' + (metaData || {}).BatchNum;
        } else if (item.type == STAMP_REQUEST_HISTORY_TYPES.cancel) {
            title = 'Hủy tem';
        }

        return title;
    }

    renderManageQRBadItem = ({ item }) => {
        return <ManageQRBadItem item={item} listManageQRBadRef={this.listManageQRBadRef} onDelete={this.onDeleteManageQRBad} onEdit={this.onEditManageQRBad} />;
    }

    renderReasonCancelManageQRHistoryItem = item => {
        let reasonCancel = '';

        let metaData = {};

        if (item.metaData) {
            try {
                metaData = JSON.parse(item.metaData);
            } catch { }
        }

        reasonCancel = (metaData || {}).ReasonCancel;

        return reasonCancel;
    }

    onViewManageQRHistory = item => () => {
        if (!item) {
            _Toast.error('Thông báo', 'Lịch sử của dải tem này không tồn tại');

            return;
        }

        if (!item.id) {
            _Toast.error('Thông báo', 'Lịch sử của dải tem này không tồn tại');

            return;
        }

        let metaData = {};

        if (item.metaData) {
            try {
                metaData = JSON.parse(item.metaData);
            } catch { }
        }

        if (!metaData) {
            _Toast.error('Thông báo', 'Không có thông tin chi tiết để xem');

            return;
        }

        if (!metaData.ID) {
            _Toast.error('Thông báo', 'Không có thông tin chi tiết để xem');

            return;
        }

        if (item.type == STAMP_REQUEST_HISTORY_TYPES.batch) {
            this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment, {
                id: metaData.ID
            });
        } else if (item.type == STAMP_REQUEST_HISTORY_TYPES.cancel) {
            this.props.navigation.navigate(KEY_NAVIGATIONS.addBadStamp, {
                id: metaData.ID
            });
        }
    }

    renderManageQRHistoryItem = ({ item }) => {
        return <TouchableOpacity style={style.bodyItem5} delayPressIn={0} activeOpacity={0.8} onPress={this.onViewManageQRHistory(item)}>
            <Text style={style.bodyItem5Title}>{this.renderTitleManageQRHistoryItem(item)}</Text>
            <Text style={style.bodyItem5Quantity}>Số lượng: {item.quantity || 0}</Text>
            <Text style={style.bodyItem5Date}>Thời gian: {item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY') : ''}</Text>
            {item.type == STAMP_REQUEST_HISTORY_TYPES.cancel ? <Text style={style.bodyItem5ReasonCancel}>Lý do: {this.renderReasonCancelManageQRHistoryItem(item)}</Text> : null}
            <Text style={style.bodyItem5Range}>Dải tem: {item.startRange} - {item.endRange}</Text>
        </TouchableOpacity>;
    }

    render() {
        // const {ManageQRReducer} = this.props;
        const {
            animationTabHeaderItem1,
            animationTabHeaderItem2,
            animationTabHeaderItem3,
            currentTab,
            isVisible,
            dateStart,
            dateEnd,
            productName,
            pageSystem,
            pageIncurred,
            dataSystem,
            totalSystem,
            dataIncurred,
            totalIncurred,
            qrCodes,
            stampRequest,
            screenStampRequest
        } = this.state;

        const lengthSystem = dataSystem.length;
        const lengthIncurred = dataIncurred.length;

        // let manageQRs = [];

        // if ((ManageQRReducer.get(manageQRConstant.KEYS.manageQRs) || {}).toJS) {
        //   manageQRs = ManageQRReducer.get(manageQRConstant.KEYS.manageQRs).toJS();
        // }

        const interpolationTabItem1 = animationTabHeaderItem1.interpolate({
            inputRange: [0, 110],
            outputRange: [1, 0],
        });

        const interpolationTabItem2 = animationTabHeaderItem2.interpolate({
            inputRange: [-110, 0],
            outputRange: [0, 1],
        });

        const interpolationTabItem3 = animationTabHeaderItem3.interpolate({
            inputRange: [-220, 0],
            outputRange: [0, 1],
        });

        // const width = Dimensions.get('window').width;

        // const interpolationTabBodyItem1 = animationTabHeaderItem1.interpolate({
        //     inputRange: [0, 110],
        //     outputRange: [0, -width],
        // });

        // const interpolationTabBodyItem2 = animationTabHeaderItem2.interpolate({
        //     inputRange: [-110, 0, 110],
        //     outputRange: [0, -width + 46, -width + 46 - width + 46],
        // });

        // const interpolationTabBodyItem3 = animationTabHeaderItem3.interpolate({
        //     inputRange: [-220, 0],
        //     outputRange: [0, -width + 46 - width + 46],
        // });

        return (
            <BoxMainContainer
                formDeleteSetRef={this.formDeleteSetRef}
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
                    <Text style={style.title}>QUẢN LÝ MÃ QR</Text>
                </View>
                <View style={style.tab}>
                    <View style={style.tabHeader}>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            <TouchableOpacity
                                onPress={this.onChooseTab(1)}
                                activeOpacity={0.8}
                                style={[
                                    style.tabHeaderItem,
                                    currentTab == 1 ? style.tabHeaderItemActive : {},
                                ]}>
                                <Animated.View
                                    style={[
                                        style.tabHeaderItemMask,
                                        {
                                            transform: [
                                                {
                                                    translateX: animationTabHeaderItem1,
                                                },
                                            ],
                                            opacity: interpolationTabItem1,
                                        },
                                    ]}></Animated.View>
                                <Text
                                    style={[
                                        style.tabHeaderItemText,
                                        currentTab == 1 ? style.tabHeaderItemTextActive : {},
                                    ]}>
                                    QR Hệ thống
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onChooseTab(0)}
                                activeOpacity={0.8}
                                style={[
                                    style.tabHeaderItem,
                                    currentTab == 0 ? style.tabHeaderItemActive : {},
                                ]}>
                                <Animated.View
                                    style={[
                                        style.tabHeaderItemMask,
                                        {
                                            transform: [
                                                {
                                                    translateX: animationTabHeaderItem2,
                                                },
                                            ],
                                            opacity: interpolationTabItem2,
                                        },
                                    ]}></Animated.View>
                                <Text
                                    style={[
                                        style.tabHeaderItemText,
                                        currentTab == 0 ? style.tabHeaderItemTextActive : {},
                                    ]}>
                                    QR Phát sinh
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onChooseTab(2)}
                                activeOpacity={0.8}
                                style={[
                                    style.tabHeaderItem,
                                    currentTab == 2 ? style.tabHeaderItemActive : {},
                                ]}>
                                <Animated.View
                                    style={[
                                        style.tabHeaderItemMask,
                                        {
                                            transform: [
                                                {
                                                    translateX: animationTabHeaderItem3,
                                                },
                                            ],
                                            opacity: interpolationTabItem3
                                        },
                                    ]}></Animated.View>
                                <Text
                                    style={[
                                        style.tabHeaderItemText,
                                        currentTab == 2 ? style.tabHeaderItemTextActive : {},
                                    ]}>
                                    Quản lý mã QR
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={style.tabBody}>
                        {currentTab == 1 ? <View
                            style={[
                                style.tabBodyItem,
                                // {
                                //     transform: [
                                //         {
                                //             translateX: interpolationTabBodyItem1,
                                //         },
                                //     ],
                                //     opacity: interpolationTabItem1,
                                // },
                            ]}>
                            <Text style={style.italic2}>
                                Ghi nhật ký cho sản phẩm theo vùng sản xuất
                            </Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={<View style={style.blockBottom} />}
                                data={dataSystem}
                                style={style.bodyWrap}
                                keyExtractor={(item, index) => item.id + index}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => {
                                    if (lengthSystem < totalSystem) {
                                        this.getListManageQRSystem(pageSystem + 1);
                                    }
                                }}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={style.bodyItem}>
                                            <View style={style.bodyItemQRCode}>
                                                <Image
                                                    resizeMode="stretch"
                                                    style={style.bodyItemQRCodeImage}
                                                    source={
                                                        item.avatar
                                                            ? {
                                                                uri: item.avatar,
                                                            }
                                                            : ICONS.noImage
                                                    }
                                                />
                                            </View>
                                            <View style={style.bodyItemInfo}>
                                                <Text style={style.bodyItemInfoDescription3}>
                                                    {item.productName}
                                                </Text>
                                                <Text style={style.bodyItemInfoDescription}>
                                                    {item.nameCode}
                                                </Text>
                                                <Text style={style.bodyItemInfoDescription2}>
                                                    {item.plantingZoneName}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={this.onPrintQRCodeIndividual(item)}
                                                style={style.bodyItemFunction}>
                                                <ICONS.saveBlue width={24} height={24} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this.onDetailSystem(item.traceID)}
                                                activeOpacity={0.8}
                                                style={style.bodyItemFunction2}>
                                                <ICONS.right2 width={24} height={24} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                            />
                        </View> : null}
                        {currentTab == 0 ? <View
                            style={[
                                style.tabBodyItem,
                                // {
                                //     transform: [
                                //         {
                                //             translateX: interpolationTabBodyItem2,
                                //         },
                                //     ],
                                //     opacity: interpolationTabItem2,
                                // },
                            ]}>
                            <View style={style.filter}>
                                <View style={style.filterDate}>
                                    <View style={[style.filterDateItem]}>
                                        <Text style={style.filterDateItemLabel}>Từ ngày</Text>
                                        <TouchableOpacity
                                            onPress={this.onPopupDateStart}
                                            activeOpacity={0.8}
                                            style={style.filterDateItemSelect}>
                                            <Text style={style.filterDateItemSelectLabel}>
                                                {dateStart
                                                    ? moment(dateStart).format('DD/MM/YYYY')
                                                    : ''}
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
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>Sản phẩm</Text>
                                    <TouchableOpacity
                                        onPress={this.onPopupProduct}
                                        activeOpacity={0.8}
                                        style={style.formItemSelect}>
                                        <Text style={style.formItemSelectText}>
                                            {productName === '' ? 'Chọn sản phẩm' : productName}
                                        </Text>
                                        <View style={style.formItemSelectIcon}>
                                            <ICONS.caretDown2 width={16} height={16} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={<View style={style.blockBottom} />}
                                data={dataIncurred}
                                style={style.bodyWrap}
                                keyExtractor={(item, index) => item.id + index}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => {
                                    if (lengthIncurred < totalIncurred) {
                                        this.getListManageQRIncurred(pageIncurred + 1);
                                    }
                                }}
                                renderItem={({ item }) => {
                                    let titleButton =
                                        STATUS_IMPORT_EXPORT[item?.status || 0].title;
                                    let colorButton =
                                        STATUS_IMPORT_EXPORT[item?.status || 0].color;
                                    let styleColor = { color: colorButton };
                                    let borderColor = { borderColor: colorButton };
                                    return (
                                        <TouchableOpacity
                                            onPress={this.onDetailIncurred(item)}
                                            activeOpacity={0.8}
                                            style={style.bodyItem2}>
                                            <View style={style.top}>
                                                <View style={style.bodyItemQRCode}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={style.bodyItemQRCodeImage}
                                                        source={
                                                            item.avatar
                                                                ? {
                                                                    uri: item.avatar,
                                                                }
                                                                : ICONS.noImage
                                                        }
                                                    />
                                                </View>
                                                <View style={style.bodyItemInfo2}>
                                                    <Text style={style.bodyItemInfoName1}>
                                                        Lô hàng: {item.batchNum}
                                                    </Text>
                                                    <Text
                                                        style={[style.bodyItemInfoName2, style.marginTop]}>
                                                        {item.productName}
                                                    </Text>
                                                    <Text style={style.bodyItemInfoName3}>
                                                        {item.plantingZoneName}
                                                    </Text>
                                                </View>
                                                <View style={[style.wrapStatus, { ...borderColor }]}>
                                                    <Text style={[style.textStatus, { ...styleColor }]}>
                                                        {titleButton}
                                                    </Text>
                                                </View>
                                            </View>
                                            {item.status == 1 && (
                                                <Text style={style.content}>
                                                    Ngày yêu cầu:{' '}
                                                    <Text style={style.italic}>
                                                        {' '}
                                                        {item.requestedDate
                                                            ? moment(item.requestedDate).format(
                                                                'HH:mm DD/MM/YYYY',
                                                            )
                                                            : ''}
                                                    </Text>
                                                </Text>
                                            )}
                                            {item.status == 3 && (
                                                <Text style={style.content}>
                                                    Lý do:{' '}
                                                    <Text style={style.italic}>
                                                        {item.confirmedReason}
                                                    </Text>
                                                </Text>
                                            )}
                                            {item.status == 2 || item.status == 3 ? (
                                                <>
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
                                                        <Text style={style.italic}>
                                                            {item.confirmedByName}
                                                        </Text>
                                                    </Text>
                                                </>
                                            ) : null}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View> : null}
                        {currentTab == 2 ? <View
                            style={[
                                style.tabBodyItem,
                                // {
                                //     transform: [
                                //         {
                                //             translateX: interpolationTabBodyItem3,
                                //         },
                                //     ],
                                //     opacity: interpolationTabItem3
                                // },
                            ]}>
                            {screenStampRequest == 1 ? <>
                                <View style={style.badStampHeader}>
                                    <Text style={style.badStampHeaderTitle}>Thông tin lịch sử dải tem</Text>
                                    <Text style={style.badStampHeaderDate}>Ngày ĐK: {(stampRequest || {}).confirmedDate ? moment((stampRequest || {}).confirmedDate).format('DD/MM/YYYY') : ''} | <Text style={style.badStampHeaderQuantity}>SL: {(stampRequest || {}).quantity || 0}</Text></Text>
                                    <Text style={style.badStampHeaderRange}>Dải tem: {(stampRequest || {}).startRange || 0} - {(stampRequest || {}).endRange || 0}</Text>
                                </View>
                                <View style={style.filter2}>
                                    <View style={style.filterDate2}>
                                        <View style={[style.filterDateItem]}>
                                            <Text style={style.filterDateItemLabel}>Từ ngày</Text>
                                            <TouchableOpacity
                                                onPress={this.onPopupDateStart}
                                                activeOpacity={0.8}
                                                style={style.filterDateItemSelect}>
                                                <Text style={style.filterDateItemSelectLabel}>
                                                    {dateStart
                                                        ? moment(dateStart).format('DD/MM/YYYY')
                                                        : ''}
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
                                </View>
                                <FlatList
                                    ref={ref => (this.listManageQRHistoryRef = ref)}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={<View style={style.blockBottom} />}
                                    data={qrCodes}
                                    style={style.bodyWrap}
                                    keyExtractor={(item, index) => item.id + index}
                                    onScroll={this.onInfinitingManageQRHistory}
                                    renderItem={this.renderManageQRHistoryItem}
                                />
                            </> : null}
                            {screenStampRequest == 0 ? <>
                                <View style={style.badStampHeader}>
                                    <Text style={style.badStampHeaderTitle}>Thông tin xử lý dải tem</Text>
                                    <Text style={style.badStampHeaderDate}>Ngày ĐK: {(stampRequest || {}).confirmedDate ? moment((stampRequest || {}).confirmedDate).format('DD/MM/YYYY') : ''} | <Text style={style.badStampHeaderQuantity}>SL: {(stampRequest || {}).quantity || 0}</Text></Text>
                                    <Text style={style.badStampHeaderRange}>Dải tem: {(stampRequest || {}).startRange || 0} - {(stampRequest || {}).endRange || 0}</Text>
                                </View>
                                <View style={style.filter2}>
                                    <View style={style.filterDate2}>
                                        <View style={[style.filterDateItem]}>
                                            <Text style={style.filterDateItemLabel}>Từ ngày</Text>
                                            <TouchableOpacity
                                                onPress={this.onPopupDateStart}
                                                activeOpacity={0.8}
                                                style={style.filterDateItemSelect}>
                                                <Text style={style.filterDateItemSelectLabel}>
                                                    {dateStart
                                                        ? moment(dateStart).format('DD/MM/YYYY')
                                                        : ''}
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
                                    <View style={style.filter2Add}>
                                        <TouchableOpacity
                                            onPress={this.onAddBadStamp}
                                            delayPressIn={0}
                                            activeOpacity={0.8}
                                            style={style.filter2AddButton}>
                                            <ICONS.add width={16} height={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <FlatList
                                    ref={ref => (this.listManageQRBadRef = ref)}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={<View style={style.blockBottom} />}
                                    data={qrCodes}
                                    style={style.bodyWrap}
                                    keyExtractor={(item, index) => item.id + index}
                                    onScroll={this.onInfinitingManageQRBad}
                                    renderItem={this.renderManageQRBadItem}
                                /></> : null}
                            {(screenStampRequest != 1 && screenStampRequest != 0) ? <FlatList
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={<View style={style.blockBottom} />}
                                data={qrCodes}
                                style={style.bodyWrap}
                                keyExtractor={(item, index) => item.id + index}
                                onScroll={this.onInfinitingManageQRRequest}
                                renderItem={({ item }) => {
                                    return (
                                        <View
                                            style={style.bodyItem3}>
                                            <View style={style.bodyItem3Info}>
                                                <Text style={style.bodyItem3InfoDate}>Ngày ĐK: {item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYY') : ''}</Text>
                                                <Text style={style.bodyItem3InfoQuantity}>Số lượng: {item.quantity || 0}</Text>
                                                <Text style={style.bodyItem3InfoRange}>Dải tem: {item.startRange} - {item.endRange}</Text>
                                            </View>
                                            <View style={style.bodyItem3Detail}>
                                                <Text style={style.bodyItem3DetailUsed}>Sử dụng: {item.usedCount || 0} tem</Text>
                                                <Text style={[style.bodyItem3DetailRemain, (item.remainCount || 0) <= 0 ? style.bodyItem3DetailRemainDisable : {}]}>{item.remainCount <= 0 ? `Hết tem` : `Còn: ${item.remainCount || 0} tem`}</Text>
                                                <Text style={style.bodyItem3DetailBad}>Hư: {item.badCount || 0} tem</Text>
                                                <TouchableOpacity style={style.bodyItem3DetailHistory} activeOpacity={0.8} delayPressIn={0} onPress={this.onHistoryStampRequest(item)}>
                                                    <Text style={style.bodyItem3DetailHistoryTitle}>Xem lịch sử</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={style.bodyItem3Function}>
                                                <TouchableOpacity activeOpacity={0.8} delayPressIn={0} onPress={this.onHandleStampRequest(item)} style={[style.bodyItem3FunctionHandle, (item.remainCount || 0) <= 0 ? style.bodyItem3FunctionHandleDisable : {}]}>
                                                    <Text style={style.bodyItem3FunctionHandleTitle}>XỬ LÝ TEM</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }}
                            /> : null}
                        </View> : null}
                    </View>
                </View>
            </BoxMainContainer >
        );
    }
}

export default ManageQR;
