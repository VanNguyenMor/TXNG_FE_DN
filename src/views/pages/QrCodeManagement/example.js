import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Keyboard, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { Guid } from 'guid-typescript';
import DocumentPicker from 'react-native-document-picker';

import { ICONS } from '../../../assets/imgs';

import FormDelete from '../../components/formDelete';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import { getErrorMessageServer } from '../../utils/errorMessageServer';

import style from './style';

import { DELAYS, INIT_KEY_NAVIGATION, KEY_NAVIGATIONS } from '../../constants/config';

import { AuthenticateView } from '../../utils/auth';

import { BAD_STAMP_STATUSES, BAD_STAMP_STATUS_COLORS, BAD_STAMP_STATUS_TEXTS, CLAIMS } from '../../constants/data';

import { checkOneClaim, getCompanyCode } from '../../utils/user';

import { ModalSelect } from '../../bases/controls/select';

import { numberWithCommas } from '../../bases/helper';

import FileUpload from '../../components/fileUpload';
import FormQuestion from '../../components/formQuestion';

class AddBadStamp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reasonCancel: '',
            stampRequestId: '',
            stampRequestName: '',
            startNum: '',
            endNum: '',
            badStamps: [],
            files: [],
            isVisible: false,
            stampRequests: [],
            minStamp: 0,
            maxStamp: 0,
            companyCode: '',
            id: null,
            status: null
        };

        this.refModalSelect = null;
        this.formQuestionRef = null;
    }

    async componentDidMount() {
        const { route } = this.props;

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true
            };
        });

        this.props.ManageQROperations.getListStampRequestComboBox({}, async res => {
            const stampRequests = ((res.data || {}).data || {}).stampRequests || [];

            const companyCode = await getCompanyCode();

            this.setState(previousState => {
                return {
                    ...previousState,
                    stampRequests,
                    companyCode,
                    isVisible: false
                }
            });

            const id = ((route || {}).params || {}).id;

            if (id) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: true
                    }
                }, async () => {
                    const result = await this.getDetailBadStamp(id);

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false
                        }
                    });

                    if (((result || {}).data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lịch sử hủy tem này không tồn tại');
                    }
                });
            }
        });
    }

    formQuestionSetRef = ref => {
        this.formQuestionRef = ref;
    };

    getDetailBadStamp = id => {
        return new Promise(resolve => {
            const { companyCode } = this.state;

            this.props.ManageQROperations.getDetailBadStamp({ id }, res => {
                const badStamp = ((res.data || {}).data || {}).badStamp || {};
                const stampRequest = ((res.data || {}).data || {}).stampRequest || {};

                const fileStrings = (badStamp.files || '').split(';').filter(p => p);

                const files = fileStrings.map(p => {
                    return {
                        id: Guid.create().toString(),
                        uri: p,
                        name: p
                    }
                });

                const _startNum = parseInt(badStamp.startNum || 0);
                const _endNum = parseInt(badStamp.endNum || 0);

                let qrCode = '';
                const badStamps = [];

                for (let i = _startNum; i <= _endNum; i++) {
                    qrCode = companyCode + i.toString().padStart(10, '0');

                    badStamps.push({
                        id: Guid.create().toString(),
                        qrCode,
                    });
                }

                if (badStamp) {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            id,
                            stampRequestId: badStamp.stampRequestID,
                            reasonCancel: badStamp.reasonCancel,
                            startNum: (badStamp.startNum || '').toString(),
                            endNum: (badStamp.endNum || '').toString(),
                            files,
                            badStamps,
                            minStamp: parseInt(stampRequest.startNum),
                            maxStamp: parseInt(stampRequest.endNum),
                            stampRequestName: `${numberWithCommas(stampRequest.startNum, ',')} - ${numberWithCommas(stampRequest.endNum, ',')} (SL: ${stampRequest.quantity} | Ngày ĐK: ${stampRequest.confirmedDate ? moment(stampRequest.confirmedDate).format('DD/MM/YYYYY') : ''})`,
                            status: badStamp.status
                        }
                    });
                }

                resolve(res);
            });
        });
    }

    modalSelectSetRef = ref => {
        this.refModalSelect = ref;
    };

    onConfirm = () => {
        const { id } = this.state;

        if (!id) {
            _Toast.error('Thông báo', 'Mã tem này không tồn tại');

            return resolve(false);
        }

        FormQuestion.open(result => {
            if (result.result) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: true
                    }
                });

                this.props.ManageQROperations.confirmBadStamp({ id }, res => {
                    console.log('41d1', res);

                    const status = (res.data || {}).status;

                    if (status == 200) {
                        _Toast.success('Thông báo', 'Duyệt hủy tem thành công');

                        let timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            timeOut = null;

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Duyệt hủy tem thất bại');
                    }
                });
            }
        }, 'Thông báo', 'Bạn có chắc chắn muốn duyệt hủy tem này ?', this.formQuestionRef);
    }

    onUnConfirm = () => {
        const { id } = this.state;

        if (!id) {
            _Toast.error('Thông báo', 'Mã tem này không tồn tại');

            return resolve(false);
        }

        FormQuestion.open(result => {
            if (result.result) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: true
                    }
                });

                this.props.ManageQROperations.unConfirmBadStamp({ id }, res => {
                    const status = (res.data || {}).status;

                    if (status == 200) {
                        _Toast.success('Thông báo', 'Không duyệt hủy tem thành công');

                        let timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            timeOut = null;

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Không duyệt hủy tem thất bại');
                    }
                });
            }
        }, 'Thông báo', 'Bạn có chắc chắn muốn duyệt hủy tem này ?', this.formQuestionRef);
    }

    onAddBadStamp = () => {
        const { reasonCancel, stampRequestId, startNum, endNum, files } = this.state;
        const { route } = this.props;

        const handleBackScreenBadStamp = (route.params || {}).handleBackScreenBadStamp;

        Keyboard.dismiss();

        if (!reasonCancel) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập lý do huỷ');

            return;
        }

        if (!stampRequestId) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn dải tem muốn huỷ',
            );

            return;
        }

        if (!startNum) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số tem bắt đầu huỷ',
            );

            return;
        }

        if (!endNum) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số tem kết thúc huỷ',
            );

            return;
        }

        const _files = files.filter(p => p.type);

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        this.props.ManageQROperations.addBadStamp(
            {
                reasonCancel,
                stampRequestId,
                startNum,
                endNum,
                files: _files
            },
            res => {
                const status = (res.data || {}).status;

                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false
                    };
                });

                if (status && status == 200) {
                    _Toast.success('Thông báo', 'Tạo yêu cầu huỷ tem thành công');

                    if (handleBackScreenBadStamp) {
                        handleBackScreenBadStamp();
                    }

                    const timeOut = setTimeout(() => {
                        this.props.navigation.goBack();

                        clearTimeout(timeOut);
                    }, DELAYS.navigationInsertOrUpdateToScreen);
                } else {
                    const message = getErrorMessageServer(res);

                    _Toast.error('Thông báo', message || 'Tạo yêu cầu huỷ tem thất bại');
                }
            },
        );
    };

    onChangeValue = name => value => {
        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value,
            };
        });
    };

    onPopupStampRequest = () => {
        const { stampRequests, stampRequestId } = this.state;

        ModalSelect.open(
            this.onChangeStampRequest,
            stampRequests,
            stampRequestId,
            { value: 'id', label: 'name' },
            'Chọn dải tem',
            'Tìm kiếm',
            null,
            null,
            null,
            null,
            (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this.onChangeStampRequest(item)}
                        key={index}
                        style={[
                            styleRow
                        ]}>
                        <Text style={styleRowText}>
                            {numberWithCommas(item.startNum, ',')} - {numberWithCommas(item.endNum, ',')} (SL: {item.quantity} | Ngày ĐK: {item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYYY') : ''})
                        </Text>
                    </TouchableOpacity>
                );
            },
            null,
            null,
            null,
            null,
            this.refModalSelect,
            false,
        );
    }

    onChangeStampRequest = item => () => {
        ModalSelect.close(this.refModalSelect);

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
                stampRequestName: `${numberWithCommas(item.startNum, ',')} - ${numberWithCommas(item.endNum, ',')} (SL: ${item.quantity} | Ngày ĐK: ${item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYYY') : ''})`,
                stampRequestId: item.id,
                startNum: '',
                endNum: '',
                minStamp: parseInt(item.startNum || 0),
                maxStamp: parseInt(item.endNum || 0)
            }
        });
    }

    onAddStampRequest = () => {
        const { stampRequestId, startNum, endNum, minStamp, maxStamp, companyCode } = this.state;

        const _startNum = parseInt(startNum || 0);
        const _endNum = parseInt(endNum || 0);

        if (!stampRequestId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn dải tem');

            return;
        }

        if (!_startNum) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập số tem bắt đầu');

            return;
        }

        if (!_endNum) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập số tem kết thúc');

            return;
        }

        if (_startNum > _endNum) {
            _Toast.error('Thông báo', 'Số tem bắt đầu không được lớn hơn số tem kết thúc');

            return;
        }

        if (_endNum < _startNum) {
            _Toast.error('Thông báo', 'Số tem kết thúc không được nhỏ hơn số tem bắt đầu');

            return;
        }

        if (_startNum < minStamp || _startNum > maxStamp) {
            _Toast.error('Thông báo', 'Số tem bắt đầu phải nằm trong khoảng cho phép từ ' + minStamp.toString() + ' đến ' + maxStamp.toString());

            return;
        }

        if (_endNum < minStamp || _endNum > maxStamp) {
            _Toast.error('Thông báo', 'Số tem bắt đầu phải nằm trong khoảng cho phép từ ' + minStamp.toString() + ' đến ' + maxStamp.toString());

            return;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                badStamps: []
            }
        });

        let qrCode = '';
        const badStamps = [];

        for (let i = _startNum; i <= _endNum; i++) {
            qrCode = companyCode + i.toString().padStart(10, '0');

            badStamps.push({
                id: Guid.create().toString(),
                qrCode,
            });
        }

        this.setState(previousState => {
            return {
                ...previousState,
                badStamps: [...badStamps]
            };
        });
    }

    setFiles = value => {
        this.setState(previousState => {
            return {
                ...previousState,
                files: value
            };
        });
    };

    renderStatus = () => {
        const { status } = this.state;
        let text = '';
        let color = '';

        if (status == BAD_STAMP_STATUSES.new) {
            text = BAD_STAMP_STATUS_TEXTS.new;
            color = BAD_STAMP_STATUS_COLORS.new;
        } else if (status == BAD_STAMP_STATUSES.notVerfied) {
            text = BAD_STAMP_STATUS_TEXTS.notVerfied;
            color = BAD_STAMP_STATUS_COLORS.notVerfied;
        } else if (status == BAD_STAMP_STATUSES.verifed) {
            text = BAD_STAMP_STATUS_TEXTS.verifed;
            color = BAD_STAMP_STATUS_COLORS.verifed;
        }

        return <View style={style.functionStatus}>
            <Text style={[style.functionStatusText, { color }]}>{text}</Text>
        </View>;
    }

    onChooseFile = () => {
        DocumentPicker.pickMultiple({
            allowMultiSelection: true,
            type: DocumentPicker.types.allFiles,
            presentationStyle: 'fullScreen',
            mode: 'open',
        })
            .then(res => {
                const data = res || [];

                if (data.length > 0) {
                    const files = [...this.state.files];

                    for (let i = 0; i < data.length; i++) {
                        files.push({
                            id: Guid.create().toString(),
                            uri: data[i].uri,
                            type: data[i].type,
                            name: data[i].name,
                        });
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            files,
                        };
                    });
                }
            })
            .catch(err => {
                if (DocumentPicker.isCancel(err)) {
                }
            });
    };

    onRemoveFile = id => () => {
        let files = [...this.state.files];

        files = files.filter(p => p.id != id);

        this.setState(previousState => {
            return {
                ...previousState,
                files,
            };
        });
    };

    render() {
        const { id, status, stampRequestId, reasonCancel, isVisible, stampRequestName, files, startNum, endNum, badStamps } = this.state;

        return (
            <BoxMainContainer
                formQuestionSetRef={this.formQuestionSetRef}
                isVisibleLoadingCenter={isVisible}
                isShowBackHeader={true}
                isScrollEnabled={false}
                styleBody={style.boxMainBody}
                isShowInfo={true}
                isShowQRCodeButton={false}
                isShowHeader={true}
                isShowVersion={false}
                isShowVersionName={false}
                modalSelectSetRef={this.modalSelectSetRef}>
                <Text style={style.title}>TẠO YÊU CẦU HUỶ TEM</Text>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    style={style.form}>
                    <View style={style.formItem}>
                        <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Lý do huỷ</Text>
                        <TextInput
                            multiline={true}
                            onChangeText={this.onChangeValue('reasonCancel')}
                            value={reasonCancel}
                            maxLength={255}
                            blurOnSubmit={false}
                            returnKeyType="next"
                            returnKeyLabel="Tiếp tục"
                            style={[style.formItemTextArea]}
                        />
                    </View>
                    <View style={style.formItem}>
                        <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Chọn dải tem</Text>
                        <TouchableOpacity
                            onPress={this.onPopupStampRequest}
                            activeOpacity={0.8}
                            style={[
                                style.formItemSelect
                            ]}>
                            <Text style={style.formItemSelectText}>
                                {stampRequestName ? stampRequestName : ''}
                            </Text>
                            <View style={style.formItemSelectIcon}>
                                <ICONS.caretDown2 width={16} height={16} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {stampRequestId ? <View style={style.formItemMulti}>
                        <View style={style.formItemMultiItem}>
                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Từ</Text>
                            <TextInput
                                onChangeText={this.onChangeValue('startNum')}
                                value={startNum}
                                keyboardType="number-pad"
                                maxLength={255}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                returnKeyLabel="Tiếp tục"
                                style={[style.formItemInput]}
                            />
                        </View>
                        <View style={style.formItemMultiItem}>
                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Đến</Text>
                            <TextInput
                                onChangeText={this.onChangeValue('endNum')}
                                value={endNum}
                                keyboardType="number-pad"
                                maxLength={255}
                                blurOnSubmit={false}
                                style={[style.formItemInput]}
                                returnKeyType="next"
                                returnKeyLabel="Tiếp tục"
                            />
                        </View>
                    </View> : null}
                    {stampRequestId ? <>
                        <View style={style.formItemFile}>
                            <Text style={[style.formItemFileLabel, style.formItemLabelRequired]}>Danh sách mã QR</Text>
                            <TouchableOpacity
                                onPress={this.onAddStampRequest}
                                activeOpacity={0.8}
                                style={style.formItemFileAddButton}>
                                <ICONS.add width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                        {badStamps.length > 0 ? <View
                            style={[
                                style.contentQR
                            ]}>
                            {badStamps.map(item => {
                                return (
                                    <View key={item.id}>
                                        <View style={style.itemQR}>
                                            <Text style={style.txtItemQR}>{item.qrCode}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View> : <View style={style.badStampEmpty}>
                            <Text style={style.badStampEmptyTitle}>Chưa có tem</Text></View>}
                    </> : null}
                    <FileUpload
                        files={files}
                        setFiles={this.setFiles}
                        onChooseFile={this.onChooseFile}
                        onRemoveFile={this.onRemoveFile}
                        isHide={false}
                    />
                </KeyboardAwareScrollView>
                <View style={style.function}>
                    {id ? <>
                        {status == BAD_STAMP_STATUSES.new ? <>
                            <TouchableOpacity
                                onPress={this.onUnConfirm}
                                activeOpacity={0.8}
                                style={style.functionUnConfirm}>
                                <Text style={style.functionUnConfirmText}>KHÔNG DUYỆT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onConfirm}
                                activeOpacity={0.8}
                                style={style.functionConfirm}>
                                <Text style={style.functionConfirmText}>DUYỆT</Text>
                            </TouchableOpacity>
                        </> : this.renderStatus()}
                    </> : <AuthenticateView claims={[CLAIMS.manageQR.add]} checkType={0}>
                        <TouchableOpacity
                            onPress={this.onAddBadStamp}
                            activeOpacity={0.8}
                            style={style.functionUpdate}>
                            <ICONS.save width={18} height={18} />
                            <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                        </TouchableOpacity>
                    </AuthenticateView>}
                </View>
            </BoxMainContainer>
        );
    }
}

export default AddBadStamp;
