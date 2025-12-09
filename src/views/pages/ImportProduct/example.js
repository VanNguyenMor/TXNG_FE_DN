import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Alert,
    FlatList,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { Guid } from 'guid-typescript';
import DocumentPicker from 'react-native-document-picker';

import { AuthenticateView } from '../../utils/auth';

import DatePicker from '../../bases/controls/datePicker';

import { ModalSelect } from '../../bases/controls/select';

import FileUpload from '../../components/fileUpload';

import FormDelete from '../../components/formDelete';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import { getErrorMessageServer } from '../../utils/errorMessageServer';

import { CLAIMS, GR_TYPES, PARTNER_TYPES } from '../../constants/data';

import { ICONS } from '../../../assets/imgs';

import {
    getParameterUrlByName,
    numberWithCommas,
    replaceComma,
} from '../../bases/helper';

import style from './style';

import { goodReceivedConstant } from '../../states/goodReceived';

import { getCurrentUser } from '../../utils/user';

import { DELAYS, KEY_NAVIGATIONS } from '../../constants/config';

import Modal from '../../components/modal';

class AddUnit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {},
        };
    }

    componentDidMount() {
        const item = { ...(this.props.data || {}) };

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    }

    onChangeQRCodeGRDetail = value => {
        const item = { ...(this.state.item || {}) };

        item.refQRCode = value;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onScanQRCode = data => () => {
        const item = { ...(this.state.item || {}) };

        item.refQRCode =
            getParameterUrlByName((data || {}).data || '', 'qr') ||
            (data || {}).data ||
            '';

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onScanQRCodeGRDetail = () => {
        if (this.props.isLocked) {
            return;
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.scan, {
            onScan: data => this.onScanQRCode(data),
        });
    };

    onChangeQuantityGRDetail = value => {
        value = replaceComma((value || '').toString(), '') || 0;

        const item = { ...(this.state.item || {}) };

        item.quantity = value;

        const quantity = parseFloat(value);

        let grAmount = quantity * parseFloat(item.unitPrice || 0);

        grAmount = grAmount + (grAmount * parseFloat(item.perVAT || 0)) / 100;

        item.amount = grAmount;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onPopupUnitGRDetail = () => {
        const item = { ...(this.state.item || {}) };

        const units = item.units || [];

        ModalSelect.open(
            this.onChangeUnitGRDetail,
            units,
            item.unitId,
            { label: 'unitName', value: 'unitID' },
            'Chọn đơn vị',
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
            this.props.refModalSelect,
            false,
        );
    };

    onChangeUnitGRDetail = data => {
        const item = { ...(this.state.item || {}) };

        item.unitId = data.unitID;
        item.unitName = data.unitName;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onChangeUnitPriceGRDetail = value => {
        value = replaceComma((value || '').toString(), '') || 0;

        const item = { ...(this.state.item || {}) };

        item.unitPrice = Number(value) || 0;

        const unitPrice = parseFloat(value);

        let grAmount = parseFloat(item.quantity || 0) * unitPrice;

        grAmount = grAmount + (grAmount * parseFloat(item.perVAT || 0)) / 100;

        item.amount = grAmount;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onChangeVATGRDetail = value => {
        const item = { ...(this.state.item || {}) };

        if (value == '') {
            item.perVAT = 0;
        } else {
            item.perVAT = value;
        }
        const perVAT = parseFloat(item.perVAT);

        let grAmount =
            parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);

        grAmount = grAmount + (grAmount * perVAT) / 100;

        item.amount = grAmount;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onChoosePlantingZoneGRDetail = () => {
        if (this.props.isLocked) {
            return;
        }

        const item = { ...(this.state.item || {}) };

        let plantingZones = [];

        if (
            (
                this.props.goodReceivedReducer.get(
                    goodReceivedConstant.KEYS.plantingZoneComboBoxs,
                ) || {}
            ).toJS
        ) {
            plantingZones = this.props.goodReceivedReducer
                .get(goodReceivedConstant.KEYS.plantingZoneComboBoxs)
                .toJS();
        }

        ModalSelect.open(
            this.onSelectPlantingZoneGRDetail,
            plantingZones,
            item.plantingZoneId,
            { label: 'name', value: 'id' },
            'Chọn vùng',
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
            this.props.refModalSelect,
        );
    };

    onChooseWareHouseGRDetail = () => {
        if (this.props.isLocked) {
            return;
        }

        const item = { ...(this.state.item || {}) };

        let wareHouses = [];

        if (
            (
                this.props.goodReceivedReducer.get(
                    goodReceivedConstant.KEYS.wareHouseComboBoxs,
                ) || {}
            ).toJS
        ) {
            wareHouses = this.props.goodReceivedReducer
                .get(goodReceivedConstant.KEYS.wareHouseComboBoxs)
                .toJS();
        }

        ModalSelect.open(
            this.onSelectWareHouseGRDetail,
            wareHouses,
            item.wareHouseId,
            { label: 'name', value: 'id' },
            'Chọn kho hàng',
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
            this.props.refModalSelect,
            false,
        );
    };

    onSelectPlantingZoneGRDetail = data => {
        const item = { ...(this.state.item || {}) };

        item.plantingZoneId = data.id;
        item.plantingZoneName = data.name;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onSelectWareHouseGRDetail = data => {
        const item = { ...(this.state.item || {}) };

        item.wareHouseId = data.id;
        item.wareHouseName = data.name;

        this.setState(previousState => {
            return {
                ...previousState,
                item,
            };
        });
    };

    onAdd = () => {
        const item = { ...(this.state.item || {}) };

        if (!item.wareHouseName) {
            Alert.alert('Thông báo', 'Bạn vui lòng chọn kho hàng');

            return;
        }
        if (
            item.quantity == null ||
            item.quantity == '' ||
            parseFloat(item.quantity || 0) <= 0 ||
            !item.quantity
        ) {
            Alert.alert(
                'Thông báo',
                'Bạn vui lòng nhập số lượng và số lượng phải lớn hơn 0',
            );

            return;
        }

        this.props.onAccept(item);
    };

    render() {
        const { isLocked, type } = this.props;
        const { item } = this.state;

        return (
            <View style={style.addUnit}>
                <View style={style.addUnitBox}>
                    <View style={style.wrapInput}>
                        <Text style={style.addUnitItemLabel}>
                            {' '}
                            Tên{' '}
                            {type == 0 ? 'Sản phẩm' : type == 1 ? 'Nguyên liệu' : 'Lô hàng'}
                        </Text>
                        <TextInput
                            editable={false}
                            keyboardType="numeric"
                            value={item.materialName}
                            style={[style.addUnitItemInput2, style.formItemInputDisable]}
                        />
                    </View>
                    <View style={style.wrapInput}>
                        <Text style={style.addUnitItemLabel}>Kho hàng</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            delayPressIn={0}
                            onPress={this.onChooseWareHouseGRDetail}
                            style={style.wareHouse}>
                            <Text numberOfLines={1} style={style.addUnitItemSelectText}>
                                {item.wareHouseName ? item.wareHouseName : 'Chọn kho hàng'}
                            </Text>
                            <View style={style.addUnitItemSelectIcon}>
                                <ICONS.caretDown2 width={16} height={16} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={style.wrapTwoInput}>
                        <View style={style.wrapOneInput}>
                            <Text style={style.addUnitItemLabel}>Số lượng</Text>
                            <TextInput
                                editable={type == 2 ? false : !isLocked}
                                onChangeText={this.onChangeQuantityGRDetail}
                                keyboardType="numeric"
                                value={numberWithCommas(item.quantity)}
                                style={[
                                    style.addUnitItemInput2,
                                    type == 2 ? style.formItemInputDisable : {},
                                ]}
                            />
                        </View>
                        <View style={style.wrapOneInput}>
                            <Text style={style.addUnitItemLabel}>Đơn vị tính</Text>
                            <TouchableOpacity
                                disabled={type == 2}
                                activeOpacity={0.8}
                                delayPressIn={0}
                                onPress={this.onPopupUnitGRDetail}
                                style={[
                                    style.wrapUnit,
                                    type == 2 ? style.wrapUnitDisable : {},
                                ]}>
                                <Text numberOfLines={1} style={style.addUnitItemSelectText}>
                                    {item.unitName}
                                </Text>
                                <ICONS.caretDown2 width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.wrapTwoInput}>
                        <View style={style.wrapOneInput}>
                            <Text style={style.addUnitItemLabel}>Giá</Text>
                            <TextInput
                                editable={!isLocked}
                                onChangeText={this.onChangeUnitPriceGRDetail}
                                keyboardType="numeric"
                                value={numberWithCommas(item.unitPrice)}
                                style={style.addUnitItemInput2}
                            />
                        </View>
                        <View style={style.wrapOneInput}>
                            <Text style={style.addUnitItemLabel}>VAT ( % )</Text>
                            <TextInput
                                editable={!isLocked}
                                value={item.perVAT}
                                onChangeText={this.onChangeVATGRDetail}
                                keyboardType="numeric"
                                style={style.addUnitItemInput2}
                            />
                        </View>
                    </View>
                    <View style={style.wrapInput}>
                        <Text style={style.addUnitItemLabel}>Thành tiền</Text>
                        <TextInput
                            editable={false}
                            keyboardType="numeric"
                            value={numberWithCommas(item.amount)}
                            style={[style.addUnitItemInput2, style.formItemInputDisable]}
                        />
                    </View>
                </View>
                <View style={style.addUnitFunction}>
                    <TouchableOpacity
                        onPress={this.onAdd}
                        activeOpacity={0.8}
                        style={style.addUnitFunctionUpdate}>
                        <ICONS.save width={18} height={18} />
                        <Text style={style.addUnitFunctionUpdateText}>CẬP NHẬT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class AddGoodDeliveryForBatch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            batchCompanies: [],
        };
    }

    componentDidMount() {
        this.getListBatchCompany();
    }

    getListBatchCompany = () => {
        this.props.goodReceivedOperations.getListBatchCompany({}, res => {
            const batchCompanies = (res.data || {}).batchCompanies || [];

            console.log('batchCompanies', batchCompanies);

            this.setState(previousState => {
                return {
                    ...previousState,
                    batchCompanies,
                };
            });
        });
    };

    onChooseWareHouse = item => () => {
        let wareHouses = [];

        if (
            (
                this.props.goodReceivedReducer.get(
                    goodReceivedConstant.KEYS.wareHouseComboBoxs,
                ) || {}
            ).toJS
        ) {
            wareHouses = this.props.goodReceivedReducer
                .get(goodReceivedConstant.KEYS.wareHouseComboBoxs)
                .toJS();
        }

        ModalSelect.open(
            this.onSelectWareHouse(item),
            wareHouses,
            item.wareHouseId,
            { label: 'name', value: 'id' },
            'Chọn kho hàng',
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
            this.props.refModalSelect,
            false,
        );
    };

    calculatorAmount = item => {
        const quantityType = parseFloat(item.quantityType || 0) || 0;
        const price = parseFloat(item.price || 0) || 0;
        const vat = parseFloat(item.vat || 0) || 0;

        const priceAmount = quantityType * price;
        const priceVAT = (vat * priceAmount) / 100;

        return numberWithCommas((priceAmount + priceVAT).toString(), ',');
    };

    onSelectWareHouse = item => data => {
        const batchCompanies = [...this.state.batchCompanies];

        const batchCompany = batchCompanies.find(
            p => p.GoodIssueID == item.GoodIssueID,
        );

        if (batchCompany) {
            batchCompany.wareHouseName = data.name;
            batchCompany.wareHouseId = data.id;

            this.setState(previousState => {
                return {
                    ...previousState,
                    batchCompanies,
                };
            });
        }
    };

    keyExtractor = (item, index) => {
        return item.GoodIssueID + index.toString();
    };

    onChangeVAT = item => value => {
        const batchCompanies = [...this.state.batchCompanies];

        const batchCompany = batchCompanies.find(
            p => p.GoodIssueID == item.GoodIssueID,
        );

        if (batchCompany) {
            const valueFormat = replaceComma(value, '');

            console.log(valueFormat);

            batchCompany.vat = valueFormat;

            this.setState(previousState => {
                return {
                    ...previousState,
                    batchCompanies,
                };
            });
        }
    };

    onChangePrice = item => value => {
        const batchCompanies = [...this.state.batchCompanies];

        const batchCompany = batchCompanies.find(
            p => p.GoodIssueID == item.GoodIssueID,
        );

        if (batchCompany) {
            const valueFormat = replaceComma(value, '');

            batchCompany.price = valueFormat;

            this.setState(previousState => {
                return {
                    ...previousState,
                    batchCompanies,
                };
            });
        }
    };

    onChangeQuantity = item => value => {
        const batchCompanies = [...this.state.batchCompanies];

        const batchCompany = batchCompanies.find(
            p => p.GoodIssueID == item.GoodIssueID,
        );

        if (batchCompany) {
            const valueFormat = replaceComma(value, '');

            batchCompany.quantityType = valueFormat;

            this.setState(previousState => {
                return {
                    ...previousState,
                    batchCompanies,
                };
            });
        }
    };

    onUpdate = item => () => {
        const quantityRemain = parseFloat(item.QuantityRemain || 0) || 0;
        const quantityType = parseFloat(item.quantityType || 0) || 0;
        const price = parseFloat(item.price || 0) || 0;
        const vat = parseFloat(item.vat || 0) || 0;

        if (!item) {
            _Toast.error('Thông báo', 'Phiếu xuất này không tồn tại');

            return;
        }

        if (!item.GoodIssueID) {
            _Toast.error('Thông báo', 'Phiếu xuất này không tồn tại');

            return;
        }

        if (!item.wareHouseId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn kho hàng');

            return;
        }

        if (!quantityType) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng');

            return;
        }

        if (quantityType > quantityRemain) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng nhỏ hơn số lượng phiếu xuất là ' +
                quantityRemain.toString(),
            );

            return;
        }

        if (!price) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập giá');

            return;
        }

        const grDetailJs = [
            {
                materialId: item.MaterialID,
                unitId: item.UnitID || '1',
                quantity: quantityType,
                unitPrice: price,
                perVAT: vat,
                refQRCode: '',
                wareHouseId: item.wareHouseId,
                materialName: item.MaterialName,
                unitName: item.UnitName,
                batchId: item.BatchID,
                giId: item.GoodIssueID,
            },
        ];

        this.props.goodReceivedOperations.updateGoodReceivedFromGoodDelivery(
            {
                partnerId: item.CompanyID2,
                productId: item.MaterialID,
                batchId: item.BatchID,
                grDetailJs,
                giId: item.GoodIssueID,
            },
            res => {
                const status = (res || {}).status;

                if (status == 200) {
                    _Toast.success('Thông báo', 'Nhập hàng từ phiếu xuất thành công');

                    this.getListBatchCompany();
                } else {
                    const message = getErrorMessageServer(res);

                    _Toast.error(
                        'Thông báo',
                        message || 'Nhập hàng từ phiếu xuất thất bại',
                    );
                }
            },
        );
    };

    renderItem = ({ item }) => {
        return (
            <View style={style.typeGoodDeliveryListItem}>
                <Text style={style.typeGoodDeliveryListItemCompanyName}>
                    {item.CompanyName2}
                </Text>
                <View style={style.typeGoodDeliveryListItemBatches}>
                    <View style={style.typeGoodDeliveryListItemBatchesItem}>
                        <Text style={style.typeGoodDeliveryListItemBatchesItemName}>
                            {item.BatchNum} - SL: {item.Quantity} - SL Còn lại: {item.QuantityRemain}
                        </Text>
                        <Text style={style.typeGoodDeliveryListItemBatchesItemCreatedDate}>
                            {item.CreatedDate
                                ? moment(item.CreatedDate).format('DD/MM/YYYY HH:mm')
                                : ''}
                        </Text>
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Tên sản phẩm</Text>
                            <TextInput
                                editable={false}
                                value={item.MaterialName}
                                style={[style.formItemInput, style.formItemInputDisable]}
                            />
                        </View>
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Kho hàng</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                delayPressIn={0}
                                onPress={this.onChooseWareHouse(item)}
                                style={style.wareHouse}>
                                <Text numberOfLines={1} style={style.addUnitItemSelectText}>
                                    {item.wareHouseName || 'Chọn kho hàng'}
                                </Text>
                                <View style={style.addUnitItemSelectIcon}>
                                    <ICONS.caretDown2 width={16} height={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={style.formItemMulti}>
                            <View style={[style.formItem, style.formItemPercent1]}>
                                <Text style={style.formItemLabel}>Số lượng</Text>
                                <TextInput
                                    onChangeText={this.onChangeQuantity(item)}
                                    keyboardType="numeric"
                                    value={numberWithCommas(item.quantityType, ',')}
                                    style={[style.formItemInput]}
                                />
                            </View>
                            <View style={[style.formItem, style.formItemPercent1]}>
                                <Text style={style.formItemLabel}>ĐVT</Text>
                                <TextInput
                                    editable={false}
                                    value={item.UnitName}
                                    style={[style.formItemInput, style.formItemInputDisable]}
                                />
                            </View>
                        </View>
                        <View style={style.formItemMulti}>
                            <View style={[style.formItem, style.formItemPercent1]}>
                                <Text style={style.formItemLabel}>Giá</Text>
                                <TextInput
                                    onChangeText={this.onChangePrice(item)}
                                    keyboardType="numeric"
                                    value={numberWithCommas(item.price, ',')}
                                    style={[style.formItemInput]}
                                />
                            </View>
                            <View style={[style.formItem, style.formItemPercent1]}>
                                <Text style={style.formItemLabel}>VAT</Text>
                                <TextInput
                                    onChangeText={this.onChangeVAT(item)}
                                    keyboardType="numeric"
                                    value={numberWithCommas(item.vat, ',')}
                                    style={[style.formItemInput]}
                                />
                            </View>
                        </View>
                        <View style={[style.formItem]}>
                            <Text style={style.formItemLabel}>Thành tiền</Text>
                            <TextInput
                                editable={false}
                                value={this.calculatorAmount(item)}
                                style={[style.formItemInput, style.formItemInputDisable]}
                            />
                        </View>
                    </View>
                </View>
                <View style={style.typeGoodDeliveryListItemFunction}>
                    <TouchableOpacity
                        onPress={this.onUpdate(item)}
                        activeOpacity={0.8}
                        delayPressIn={0}
                        style={style.typeGoodDeliveryListItemFunctionButton}>
                        <Text style={style.typeGoodDeliveryListItemFunctionButtonText}>
                            Cập nhật
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    render() {
        const { batchCompanies } = this.state;

        return (
            <View style={style.typeGoodDeliveryList}>
                {batchCompanies.length <= 0 ? (
                    <Text style={style.typeGoodDeliveryListEmpty}>Chưa có dữ liệu</Text>
                ) : null}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={batchCompanies}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

class AddGoodReceived extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            id: '',
            partnerType: '',
            partner: '',
            partnerName: 'Chọn nhà cung cấp',
            grTime: moment(),
            grDetails: [],
            vat: 0,
            amount: 0,
            total: 0,
            note: '',
            receiptPersonId: null,
            receiptPersonName: '',
            grCode: '',
            type: 0,
            isLocked: false,
            files: [],
            currentUser: {},
            isTransport: false,
            reason: '',
            status: '',
            confirmGR: false,
            receiptPerson: '',
            batch: {},
            isAddBatch: false,
            batchId: '',
            typeGoodDelivery: -1,
            content: '',
            confirmedReason: '',
            content1: '',
            content2: '',
            confirmedByName: '',
            confirmedDate: '',
        };

        this.inputNote = null;
        this.inputReceiptPerson = null;
        this.modalSelectPartner = null;
        this.refFormDelete = null;
        this.refDatePicker = null;
        this.refModalSelect = null;
        this.isRender = true;
        this.refModal = null;
        this.isAddPartner = false;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            if (!this.isRender) {
                this.isRender = true;

                return;
            }

            if (this.isAddPartner) {
                this.getPartnerByPartnerType(1).then(() => {
                    this.isAddPartner = false;
                });

                return;
            }

            const { route } = this.props;

            const partnerType = PARTNER_TYPES[0];

            if (partnerType) {
                const id = (route.params || {}).id;

                // id ? null : partnerType.value

                this.getPartnerByPartnerType(1).then(res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            partnerType: partnerType.value,
                        };
                    });

                    this.getListUserComboBox().then(async resUser => {
                        const currentUser = await getCurrentUser();
                        this.props.GoodReceivedOperations.getCompanyConfig(result => {
                            let data = (result.data || {}).data || {};
                            if (id) {
                                this.getDetailGoodReceived(
                                    route.params.id,
                                    ((res.data || {}).data || {}).partners || [],
                                    ((resUser.data || {}).data || {}).users || [],
                                    route.params.confirmedByName,
                                );

                                this.setState(previousState => {
                                    return {
                                        ...previousState,
                                        currentUser,
                                        confirmGR: data?.confirmGR || false,
                                    };
                                });
                            } else {
                                this.setState(previousState => {
                                    return {
                                        ...previousState,
                                        receiptPersonId: currentUser.id,
                                        receiptPersonName: currentUser.fullName,
                                        currentUser,
                                        confirmGR: data?.confirmGR || false,
                                    };
                                });
                            }
                        });
                    });
                });

                this.getListPlantingZone();

                this.getListWareHouse();
            }
        });
    }

    toastSetRef = ref => {
        this.refToast = ref;
    };

    modalSetRef = ref => {
        this.refModal = ref;
    };

    modalSelectSetRef = ref => {
        this.refModalSelect = ref;
    };

    datePickerSetRef = ref => {
        this.refDatePicker = ref;
    };

    formDeleteSetRef = ref => {
        this.refFormDelete = ref;
    };

    getListUserComboBox = () => {
        return new Promise(resolve => {
            this.props.GoodReceivedOperations.getListUserComboBox(
                {
                    status: 1,
                    roleIDs: '',
                    userName: '',
                    fullName: '',
                    phone: '',
                    email: '',
                    position: '',
                    orderBy: '',
                    page: null,
                    limit: 1000,
                },
                res => {
                    resolve(res);
                },
            );
        });
    };

    getListWareHouse = () => {
        this.props.GoodReceivedOperations.getListWareHouseComboBox({
            search: '',
            filter: '',
            orderBy: '',
            page: 0,
            limit: 1000,
        });
    };

    getListPlantingZone = () => {
        this.props.GoodReceivedOperations.getListPlantingZoneComboBox({
            plantingTypeID: '',
            name: '',
            isBelongTo: null,
            orderBy: '',
            page: 0,
            limit: 1000,
        });
    };

    getMaterial = () => {
        return new Promise(resolve => {
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                };
            });

            const { GoodReceivedOperations } = this.props;

            GoodReceivedOperations.getListMaterialComboBox(
                { search: '', filter: '', orderBy: '  ', page: 0, limit: 1000 },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    resolve(res);
                },
            );
        });
    };

    getProduct = () => {
        return new Promise(resolve => {
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                };
            });

            const { GoodReceivedOperations } = this.props;

            GoodReceivedOperations.getListProductComboBox(
                {
                    fieldID: '',
                    productCode: '',
                    productName: '',
                    orderBy: ' A.ProductName ',
                    page: 0,
                    limit: 1000,
                },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    resolve(res);
                },
            );
        });
    };

    getPartnerByPartnerType = type => {
        return new Promise(resolve => {
            const { GoodReceivedOperations } = this.props;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                };
            });

            GoodReceivedOperations.getListPartnerComboBox(
                {
                    partnerType: type,
                    companyName: '',
                    phone: '',
                    email: '',
                    orderBy: '',
                    page: 0,
                    limit: 1000,
                },
                res => {
                    if ((res.data || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy danh sách đối tác thất bại');
                    }

                    if (this.isAddPartner) {
                        this.isAddPartner = false;

                        this.setState(
                            previousState => {
                                return {
                                    ...previousState,
                                    isVisible: false,
                                };
                            },
                            () => {
                                resolve(res);
                            },
                        );
                    } else {
                        this.setState(
                            previousState => {
                                return {
                                    ...previousState,
                                    isVisible: false,
                                    partner: '',
                                    partnerName: '',
                                };
                            },
                            () => {
                                resolve(res);
                            },
                        );
                    }
                },
            );
        });
    };

    getDetailGoodReceived = (id, partners, users, confirmedByName) => {
        const { GoodReceivedOperations, navigation, GoodReceivedReducer } =
            this.props;

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        GoodReceivedOperations.getDetailGoodReceived({ id }, async res => {
            this.getListWareHouse();

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false,
                };
            });

            if (res.status != 200) {
                _Toast.error('Thông báo', 'Lấy thông tin nhập hàng thất bại');

                navigation.goBack();

                return;
            }

            const goodReceived = (res.data || {}).goodsReceipt || {};

            const partner = partners.find(p => p.id == goodReceived.partnerID);

            let user = users.find(p => p.id == goodReceived.receiptPerson);

            if (!user) {
                const currentUser = await getCurrentUser();

                if (currentUser.id == goodReceived.receiptPerson) {
                    user = {
                        fullName: currentUser.fullName,
                    };
                }
            }

            const grDetails = goodReceived.grMores || [];

            let wareHouses = [];
            if (
                (
                    GoodReceivedReducer.get(
                        goodReceivedConstant.KEYS.wareHouseComboBoxs,
                    ) || {}
                ).toJS
            ) {
                wareHouses = GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.wareHouseComboBoxs,
                ).toJS();
            }

            const grDetailClones = grDetails.map(item => {
                const temp = wareHouses.find(element => element.id == item.warehouseID);

                return {
                    id: item.id,
                    materialName: item.materialName,
                    quantity: (item.quantity || '').toString(),
                    unitPrice: item.unitPrice,
                    amount: (item.amount || '').toString(),
                    unitId: item.unitID,
                    materialId: item.materialID,
                    unitName: item.unitName,
                    perVAT: (item.perVAT || '').toString(),
                    plantingZoneName: item.plantingZoneName,
                    plantingZoneId: item.plantingZoneID,
                    refQRCode: item.refQRCode,
                    inStore: item.inStore,
                    isTransport: goodReceived.isTransport,
                    wareHouseID: item.warehouseID,
                    wareHouseName: temp?.name || '',
                };
            });

            const goodReceivedFiles = (goodReceived.files || '')
                .split(';')
                .filter(p => p);

            const files = goodReceivedFiles.map(p => {
                return {
                    id: Guid.create().toString(),
                    name: p,
                    uri: p,
                };
            });

            const { amount, total, vat } = this.calculatorInfo(grDetailClones);

            console.log(goodReceived);

            this.setState(
                previousState => {
                    return {
                        ...previousState,
                        partnerType: goodReceived.partnerType,
                    };
                },
                () => {
                    const timeOut = setTimeout(() => {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                id: goodReceived.id,
                                type: goodReceived.grType,
                                partner: goodReceived.partnerID,
                                grTime: goodReceived.grTime
                                    ? new Date(goodReceived.grTime)
                                    : null,
                                grDetails: grDetailClones,
                                vat,
                                amount,
                                total,
                                note: goodReceived.note,
                                grCode: goodReceived.grCode,
                                partnerName: partner
                                    ? partner.partnerName
                                    : 'Chọn nhà cung cấp',
                                receiptPersonId: goodReceived.receiptPerson,
                                // receiptPersonName: user ? user.fullName : 'Chọn người nhập',
                                receiptPersonName: goodReceived.receiptPersonName,
                                isLocked: goodReceived.isLocked,
                                files,
                                status: goodReceived.status,
                                receiptPerson: goodReceived.receiptPerson,
                                batchId: goodReceived.batchID,
                                typeGoodDelivery: goodReceived.grType == 2 ? -2 : 1,
                                confirmedReason: goodReceived.confirmedReason,
                                content1: goodReceived.content1,
                                content2: goodReceived.status == 3 ? '' : goodReceived.content2,
                                confirmedByName: goodReceived.confirmedByName,
                                confirmedDate: goodReceived.confirmedDate,
                            };
                        });

                        clearTimeout(timeOut);
                    }, 100);
                },
            );
        });
    };

    calculatorInfo = grDetails => {
        grDetails = grDetails || [...this.state.grDetails];

        const vat = 0;

        if (!grDetails) {
            return {
                amount: 0,
                vat,
                total: 0,
            };
        }

        const amount = grDetails.reduce((a, b) => {
            return a + (parseFloat(b.amount) || 0);
        }, 0);

        const total = amount + (vat * amount) / 100;

        return {
            amount,
            vat,
            total,
        };
    };

    onNextInputNote = () => {
        this.inputNote.focus();
    };

    onNextInputReceiptPerson = () => {
        this.inputReceiptPerson.focus();
    };

    onAdd = () => {
        const {
            isLocked,
            files,
            type,
            id,
            grDetails,
            grCode,
            grTime,
            receiptPersonId,
            partnerType,
            partner,
            note,
            isTransport,
            batch,
            currentUser,
            batchId,
            status,
            content1,
            content2,
        } = this.state;
        const { GoodReceivedOperations } = this.props;

        Keyboard.dismiss();

        if (isLocked) {
            return;
        }

        let _type = type;

        if ((batch || {}).ID) {
            _type = 2;
        }

        if (!grTime) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn ngày phiếu');

            return;
        }

        if (!receiptPersonId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn người nhập');

            return;
        }

        if (!partner) {
            _Toast.error('Thông báo', 'Nhà cung cấp không được bỏ trống');

            return;
        }

        if (grDetails.length <= 0) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn chi tiết phiếu nhập');

            return;
        }

        const checkQuantity = grDetails.filter(
            p =>
                p.quantity == null ||
                p.quantity == '' ||
                parseFloat(p.quantity || 0) <= 0 ||
                !p.quantity,
        );

        if (checkQuantity.length > 0) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng và số lượng phải lớn hơn 0',
            );

            return;
        }

        if (status == 3 && !content2) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập nội dung đã thực hiện lại');

            return;
        }

        const checkUnitPrice = grDetails.filter(
            p =>
                p.unitPrice == null ||
                p.unitPrice == '' ||
                parseFloat(p.unitPrice || 0) <= 0 ||
                !p.unitPrice,
        );

        const checkVAT = grDetails.filter(
            p =>
                p.perVAT == null ||
                p.perVAT == '' ||
                parseFloat(p.perVAT || 0) < 0 ||
                parseFloat(p.perVAT || 0) > 100,
        );

        const _grDetails = grDetails.map(p => {
            const item = { ...p };

            if (item.unitPrice == '') {
                item.unitPrice = 0;
            }

            if (item.perVAT == '') {
                item.perVAT = 0;
            }

            delete item.id;
            delete item.plantingZoneName;
            delete item.amount;
            delete item.units;

            return {
                batchId: item.batchId || item.BatchID || batchId,
                materialId: item.materialId || item.MaterialID,
                materialName: item.materialName || item.MaterialName,
                perVAT: item.perVAT || item.PerVAT,
                quantity: item.quantity || item.Quantity,
                type: item.type || item.Type,
                unitId: item.unitId || item.UnitID,
                unitName: item.unitName || item.UnitName,
                unitPrice: item.unitPrice || item.UnitPrice,
                wareHouseId:
                    item.wareHouseId ||
                    item.WarehouseID ||
                    item.WareHouseId ||
                    item.warehouseID ||
                    item.wareHouseID,
                wareHouseName: item.wareHouseName || item.WarehouseName,
                traceId: item.traceId || item.TraceID,
            };
        });

        const stringFiles = files
            .filter(p => p.name)
            .map(p => p.name)
            .join(',');

        const _files = files.filter(p => p.name && p.uri && p.type);

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        if (id) {
            console.log({
                id,
                grType: _type,
                // grCode,
                // grTime: moment(grTime)._d.toISOString(),
                grTime: moment(grTime).format('YYYY-MM-DD HH:mm:ss'),
                receiptPerson: receiptPersonId,
                partnerType: partnerType,
                partnerId: partner,
                note,
                grDetails: _grDetails,
                strFile: stringFiles,
                filesFiles: _files,
                // isTransport,
            });

            GoodReceivedOperations.editGoodReceived(
                {
                    id,
                    grType: _type,
                    // grCode,
                    // grTime: moment(grTime)._d.toISOString(),
                    grTime: moment(grTime).format('YYYY-MM-DD HH:mm:ss'),
                    receiptPerson: receiptPersonId,
                    partnerType: partnerType,
                    partnerId: partner,
                    note,
                    grDetails: _grDetails,
                    strFile: stringFiles,
                    filesFiles: _files,
                    content1,
                    content2,
                    // isTransport,
                },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    if (res.status && res.status == 200) {
                        _Toast.success('Thông báo', 'Sửa nhập hàng thành công');

                        const timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Sửa nhập hàng thất bại');
                    }
                },
            );
        } else {
            GoodReceivedOperations.addGoodReceived(
                {
                    grType: _type,
                    grTime: moment(grTime).format('YYYY-MM-DD HH:mm:ss'),
                    receiptPerson: currentUser.id,
                    partnerType: partnerType,
                    partnerId: partner,
                    note,
                    grDetails: _grDetails,
                    strFile: stringFiles,
                    filesFiles: _files,
                },
                res => {
                    console.log(res);

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    if (res.status && res.status == 200) {
                        _Toast.success('Thông báo', 'Thêm nhập hàng thành công');

                        const { amount, total, vat } = this.calculatorInfo([]);

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                grCode: '',
                                grTime: new Date(),
                                receiptPerson: '',
                                note: '',
                                grDetails: [],
                                amount,
                                total,
                                vat,
                                partner: '',
                                partnerName: 'Chọn nhà cung cấp',
                                files: [],
                                batch: {},
                            };
                        });
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Thêm nhập hàng thất bại');
                    }
                },
            );
        }
    };

    onChangeValue = name => value => {
        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value,
            };
        });
    };

    onChangePartnerType = value => {
        this.setState(
            previousState => {
                return {
                    ...previousState,
                    partnerType: value,
                };
            },
            () => {
                if (value != 0 && value != 1) {
                    return;
                }

                this.getPartnerByPartnerType(value);
            },
        );
    };

    onChangePartner = value => {
        if (value) {
            const { GoodReceivedReducer } = this.props;

            let partners = [];

            if (
                GoodReceivedReducer.get(goodReceivedConstant.KEYS.partnerComboBoxs).toJS
            ) {
                partners = GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.partnerComboBoxs,
                ).toJS();
            }

            const partner = partners.find(p => p.id == value.id);

            if (partner) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        partner: value.id,
                        partnerName: partner.partnerName,
                    };
                });
            }
        }
    };

    onPopupPartner = () => {
        if (this.state.isLocked) {
            return;
        }

        const { GoodReceivedReducer } = this.props;

        let partners = [];

        if (
            GoodReceivedReducer.get(goodReceivedConstant.KEYS.partnerComboBoxs).toJS
        ) {
            partners = GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.partnerComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onChangePartner,
            partners,
            this.state.partner,
            { label: 'partnerName', value: 'id' },
            'Chọn nhà cung cấp',
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

    onPopupGRTime = () => {
        if (this.state.isLocked) {
            return;
        }

        DatePicker.open(
            this.state.grTime,
            this.onConfirmGRTime,
            this.refDatePicker,
        );
    };

    onConfirmGRTime = (result, year, month, date) => {
        if (result) {
            const newDate = new Date(year, month, date);

            this.setState(previousState => {
                return {
                    ...previousState,
                    grTime: newDate,
                };
            });
        }
    };

    onChangeProduct = item => {
        if (item.id) {
            const grDetails = [...this.state.grDetails];

            const checkExist = grDetails.find(p => p.materialId == item.id);

            if (checkExist) {
                _Toast.error(
                    'Thông báo',
                    'Sản phẩm đã tồn tại',
                    null,
                    true,
                    {},
                    this.props.refToast,
                );
            }

            const { GoodReceivedOperations } = this.props;

            GoodReceivedOperations.getDetailProduct({ id: item.id }, res => {
                if ((res || {}).status != 200) {
                    _Toast.error('Thông báo', 'Lấy thông tin sản phẩm thất bại');

                    return;
                }

                const product = (res.data || {}).product;

                let productUnits = [];

                GoodReceivedOperations.getListByProduct({ id: product.id }, result => {
                    if ((result || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy thông tin đơn vị tính thất bại');
                        return;
                    }

                    productUnits = result.data || [];

                    const unitName =
                        (productUnits.find(p => p.unitID == product.unitID) || {})
                            .unitName || '';

                    const data = {
                        id: null,
                        materialName: product.productName,
                        unitName,
                        materialId: product.id,
                        unitId: product.unitID,
                        quantity: '',
                        unitPrice: '',
                        amount: '',
                        perVAT: '',
                        units: productUnits,
                        refQRCode: '',
                        isExpand: false,
                    };

                    Modal.open(
                        <AddUnit
                            refToast={this.refToast}
                            onAccept={this.onAcceptUnit}
                            goodReceivedReducer={this.props.GoodReceivedReducer}
                            refModalSelect={this.refModalSelect}
                            navigation={this.props.navigation}
                            type={this.state.type}
                            isLocked={this.state.isLocked}
                            data={data}
                        />,
                        'Chi tiết phiếu nhập',
                        this.refModal,
                    );
                });
            });
        }
    };

    onChangeMaterial = item => {
        if (item.id) {
            const grDetails = [...this.state.grDetails];

            const checkExist = grDetails.find(p => p.materialId == item.id);

            if (checkExist) {
                _Toast.error(
                    'Thông báo',
                    'Nguyên vật đã tồn tại',
                    null,
                    true,
                    {},
                    this.props.refToast,
                );
            }

            const { GoodReceivedOperations } = this.props;

            GoodReceivedOperations.getDetailMaterial({ id: item.id }, res => {
                if ((res || {}).status != 200) {
                    _Toast.error('Thông báo', 'Lấy thông tin nguyên liệu thất bại');

                    return;
                }

                const material = (res.data || {}).material;
                // const materialUnits = (res.data || {}).materialUnits;

                let materialUnits = [];

                GoodReceivedOperations.getListByMaterial({ id: material.id }, result => {
                    if ((result || {}).status != 200) {
                        _Toast.error('Thông báo', 'Lấy thông tin đơn vị tính thất bại');
                        return;
                    }

                    materialUnits = result?.data || [];

                    const unitName =
                        (materialUnits.find(p => p.unitID == material.unitID) || {})
                            .unitName || '';

                    const data = {
                        id: null,
                        materialName: material.materialName,
                        unitName,
                        materialId: material.id,
                        unitId: material.unitID,
                        quantity: '',
                        unitPrice: '',
                        amount: '',
                        perVAT: '',
                        units: materialUnits,
                        refQRCode: '',
                        isExpand: true,
                    };

                    Modal.open(
                        <AddUnit
                            refToast={this.refToast}
                            onAccept={this.onAcceptUnit}
                            goodReceivedReducer={this.props.GoodReceivedReducer}
                            refModalSelect={this.refModalSelect}
                            navigation={this.props.navigation}
                            type={this.state.type}
                            isLocked={this.state.isLocked}
                            data={data}
                        />,
                        'Chi tiết phiếu nhập',
                        this.refModal,
                    );
                });
            });
        }
    };

    onRemoveGRDetail = item => () => {
        if (this.state.isLocked) {
            return;
        }

        let grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == item.id);

        if (grDetail) {
            FormDelete.open(result => {
                if (result.result) {
                    grDetails = grDetails.filter(p => p.id != item.id);

                    const { amount, total, vat } = this.calculatorInfo(grDetails);

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            grDetails,
                            amount,
                            vat,
                            total,
                            isAddBatch: false,
                        };
                    });
                }
            }, this.refFormDelete);
        }
    };

    onChangeQuantityGRDetail = id => value => {
        value = replaceComma((value || '').toString(), '') || 0;

        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.quantity = value;

            const quantity = parseFloat(value);

            let grAmount = quantity * parseFloat(grDetail.unitPrice || 0);

            grAmount = grAmount + (grAmount * parseFloat(grDetail.perVAT || 0)) / 100;

            grDetail.amount = grAmount;

            const { amount, total, vat } = this.calculatorInfo(grDetails);

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                    amount,
                    vat,
                    total,
                };
            });
        }
    };

    onChangeUnitPriceGRDetail = id => value => {
        value = replaceComma((value || '').toString(), '') || 0;

        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.unitPrice = value;

            const unitPrice = parseFloat(value);

            let grAmount = parseFloat(grDetail.quantity || 0) * unitPrice;

            grAmount = grAmount + (grAmount * parseFloat(grDetail.perVAT || 0)) / 100;

            grDetail.amount = grAmount;

            const { amount, total, vat } = this.calculatorInfo(grDetails);

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                    amount,
                    vat,
                    total,
                };
            });
        }
    };

    onDelete = () => {
        if (this.state.isLocked) {
            return;
        }

        const { id } = this.state;

        if (!id) {
            _Toast.error('Thông báo', 'Nhập hàng không tồn tại');

            const timeOut = setTimeout(() => {
                this.props.navigation.goBack();

                clearTimeout(timeOut);
            }, DELAYS.navigationInsertOrUpdateToScreen);

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
                    if (res.status == 200) {
                        _Toast.success('Thông báo', 'Xóa nhập hàng thành công');

                        const timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                isVisible: false,
                            };
                        });

                        const message = getErrorMessageServer(res);

                        _Toast.error('Thông báo', message || 'Xóa nhập hàng thất bại');
                    }
                });
            }
        }, this.refFormDelete);
    };

    onCheckType = type => () => {
        if (this.state.isLocked) {
            return;
        }

        const { amount, total, vat } = this.calculatorInfo([]);

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    grCode: '',
                    grTime: new Date(),
                    receiptPerson: '',
                    note: '',
                    grDetails: [],
                    amount,
                    total,
                    vat,
                    type,
                };
            },
            () => {
                if (type == 0) {
                    this.getListPlantingZone();
                }
            },
        );
    };

    onChoosePlantingZoneGRDetail = item => () => {
        if (this.state.isLocked) {
            return;
        }

        let plantingZones = [];

        if (
            (
                this.props.GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.plantingZoneComboBoxs,
                ) || {}
            ).toJS
        ) {
            plantingZones = this.props.GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.plantingZoneComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onSelectPlantingZoneGRDetail(item),
            plantingZones,
            item.plantingZoneId,
            { label: 'name', value: 'id' },
            'Chọn vùng',
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
        );
    };

    onChooseWareHouseGRDetail = item => () => {
        if (this.state.isLocked) {
            return;
        }

        let wareHouses = [];

        if (
            (
                this.props.GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.wareHouseComboBoxs,
                ) || {}
            ).toJS
        ) {
            wareHouses = this.props.GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.wareHouseComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onSelectWareHouseGRDetail(item),
            wareHouses,
            item.plantingZoneId,
            { label: 'name', value: 'id' },
            'Chọn kho hàng',
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

    onSelectWareHouseGRDetail = item => selectItem => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == item.id);

        if (grDetail) {
            grDetail.plantingZoneId = selectItem.id;
            grDetail.plantingZoneName = selectItem.name;

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

    onSelectPlantingZoneGRDetail = item => selectItem => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == item.id);

        if (grDetail) {
            grDetail.plantingZoneId = selectItem.id;
            grDetail.plantingZoneName = selectItem.name;

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

    onChangeVATGRDetail = id => value => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.perVAT = value;

            const perVAT = parseFloat(grDetail.perVAT);

            let grAmount =
                parseFloat(grDetail.quantity || 0) *
                parseFloat(grDetail.unitPrice || 0);

            grAmount = grAmount + (grAmount * perVAT) / 100;

            grDetail.amount = grAmount;

            const { amount, total, vat } = this.calculatorInfo(grDetails);

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                    amount,
                    total,
                    vat,
                };
            });
        }
    };

    onChangeQRCodeGRDetail = id => value => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.refQRCode = value;

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

    onPopupReceiptPerson = async () => {
        if (this.state.isLocked) {
            return;
        }

        let users = [];

        if (
            (
                this.props.GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.userComboBoxs,
                ) || {}
            ).toJS
        ) {
            users = this.props.GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.userComboBoxs,
            ).toJS();
        }

        const currentUser = await getCurrentUser();

        if (currentUser) {
            if (currentUser.isAdmin) {
                users.unshift({
                    fullName: currentUser.fullName,
                    id: currentUser.id,
                });
            }
        }

        ModalSelect.open(
            this.onSelectUser,
            users,
            this.state.receiptPersonId,
            { label: 'fullName', value: 'id' },
            'Chọn người nhập',
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

    onSelectUser = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                receiptPersonId: item.id,
                receiptPersonName: item.fullName,
            };
        });
    };

    onScanQRCodeGRDetail = id => () => {
        if (this.state.isLocked) {
            return;
        }

        if (!id) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn chi tiết phiếu nhập cần quét mã QRCode',
            );

            return;
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.scan, {
            onScan: data => this.onScanQRCode(id, data),
        });
    };

    onScanQRCode = (id, data) => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.refQRCode =
                getParameterUrlByName((data || {}).data || '', 'qr') ||
                (data || {}).data ||
                '';

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

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
                console.log(err);

                if (DocumentPicker.isCancel(err)) {
                }
            });
    };
    setFiles = value => {
        this.setState(previousState => {
            return {
                ...previousState,
                files: value,
            };
        });
    };

    onChangePartner = value => {
        if (value) {
            const { GoodReceivedReducer } = this.props;

            let partners = [];

            if (
                GoodReceivedReducer.get(goodReceivedConstant.KEYS.partnerComboBoxs).toJS
            ) {
                partners = GoodReceivedReducer.get(
                    goodReceivedConstant.KEYS.partnerComboBoxs,
                ).toJS();
            }

            const partner = partners.find(p => p.id == value.id);

            if (partner) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        partner: value.id,
                        partnerName: partner.partnerName,
                    };
                });
            }
        }
    };

    onPopupPartner = () => {
        if (this.state.isLocked) {
            return;
        }

        const { GoodReceivedReducer } = this.props;

        let partners = [];

        if (
            GoodReceivedReducer.get(goodReceivedConstant.KEYS.partnerComboBoxs).toJS
        ) {
            partners = GoodReceivedReducer.get(
                goodReceivedConstant.KEYS.partnerComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onChangePartner,
            partners,
            this.state.partner,
            { label: 'partnerName', value: 'id' },
            'Chọn nhà cung cấp',
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

    onPopupGRTime = () => {
        if (this.state.isLocked) {
            return;
        }

        DatePicker.open(
            this.state.grTime,
            this.onConfirmGRTime,
            this.refDatePicker,
        );
    };

    onConfirmGRTime = (result, year, month, date) => {
        if (result) {
            const newDate = new Date(year, month, date);

            this.setState(previousState => {
                return {
                    ...previousState,
                    grTime: newDate,
                };
            });
        }
    };

    onPopupUnit = () => {
        const { batch, isLocked, type } = this.state;

        if (isLocked) {
            return;
        }

        let _type = type;

        if ((batch || {}).ID) {
            _type = 2;

            Modal.open(
                <AddUnit
                    refToast={this.refToast}
                    onAccept={this.onAcceptUnit}
                    goodReceivedReducer={this.props.GoodReceivedReducer}
                    refModalSelect={this.refModalSelect}
                    navigation={this.props.navigation}
                    type={_type}
                    isLocked={isLocked}
                    data={{
                        ...batch,
                        materialName: batch.ProductName,
                        wareHouseName: '',
                        wareHouseId: '',
                        quantity: batch.Quantity || '',
                        unitName: batch.UnitName,
                        unitId: batch.UnitID,
                        unitPrice: '',
                        perVAT: '',
                        type: _type,
                        batchId: batch.ID,
                        materialId: batch.ProductID,
                    }}
                />,
                'Chọn sản phẩm',
                this.refModal,
            );

            return;
        }

        if (_type == 0) {
            this.getProduct().then(res => {
                if ((res.data || {}).status != 200) {
                    _Toast.error('Thông báo', 'Lấy danh sách sản phẩm thất bại');

                    return;
                }

                const temp = ((res.data || {}).data || {}).products || [];
                const grDetailIDs = this.state.grDetails.map(e => e.materialId);
                const products = temp.filter(item => !grDetailIDs.includes(item.id));

                ModalSelect.open(
                    this.onChangeProduct,
                    products,
                    null,
                    { label: 'productName', value: 'id' },
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
            });
        } else {
            this.getMaterial().then(res => {
                if ((res.data || {}).status != 200) {
                    _Toast.error('Thông báo', 'Lấy danh sách nguyên liệu thất bại');

                    return;
                }

                const temp = ((res.data || {}).data || {}).materials || [];
                const grDetailIDs = this.state.grDetails.map(e => e.materialId);
                const materials = temp.filter(item => !grDetailIDs.includes(item.id));

                ModalSelect.open(
                    this.onChangeMaterial,
                    materials,
                    null,
                    { label: 'materialName', value: 'id' },
                    'Chọn nguyên liệu',
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
            });
        }
    };

    onAcceptUnit = item => {
        const grDetails = [...this.state.grDetails];

        let check = false;

        check = grDetails.some(element => element.materialId == item.materialId);

        if (check && grDetails.length > 1) {
            // _Toast.error(
            //   'Thông báo',
            //   'Sản phẩm/nguyên vật liệu bị trùng',
            //   null,
            //   true,
            //   {},
            //   this.props.refToast,
            // );
            Alert.alert('Thông báo', 'Sản phẩm/nguyên vật liệu bị trùng');
            return;
        }

        const _item = { ...item };

        if (_item.id) {
            let grDetail = grDetails.find(p => p.id == _item.id);

            if (grDetail) {
                grDetail.quantity = _item.quantity;
                grDetail.amount = _item.amount;
                grDetail.isExpand = _item.isExpand;
                grDetail.materialId = _item.materialId;
                grDetail.materialName = _item.materialName;
                grDetail.perVAT = _item.perVAT;
                grDetail.refQRCode = _item.refQRCode;
                grDetail.unitId = _item.unitId;
                grDetail.unitName = _item.unitName;
                grDetail.unitPrice = _item.unitPrice;
                grDetail.units = _item.units;
                grDetail.wareHouseId = _item.wareHouseId;
                grDetail.wareHouseName = _item.wareHouseName;
            }
        } else {
            _item.id = Guid.create().toString();

            grDetails.unshift(_item);
        }

        const { amount, total, vat } = this.calculatorInfo(grDetails);

        let isAddBatch = false;

        if (item.type == 2) {
            isAddBatch = true;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                grDetails,
                amount,
                vat,
                total,
                isAddBatch,
            };
        });

        Modal.close();
    };

    onAcceptUnitEdit = item => {
        const grDetails = [...this.state.grDetails];

        const _item = { ...item };

        if (_item.id) {
            let grDetail = grDetails.find(p => p.id == _item.id);

            if (grDetail) {
                grDetail.quantity = _item.quantity;
                grDetail.amount = _item.amount;
                grDetail.isExpand = _item.isExpand;
                grDetail.materialId = _item.materialId;
                grDetail.materialName = _item.materialName;
                grDetail.perVAT = _item.perVAT;
                grDetail.refQRCode = _item.refQRCode;
                grDetail.unitId = _item.unitId;
                grDetail.unitName = _item.unitName;
                grDetail.unitPrice = _item.unitPrice;
                grDetail.units = _item.units;
                grDetail.wareHouseId = _item.wareHouseId;
                grDetail.wareHouseName = _item.wareHouseName;
            }
        } else {
            _item.id = Guid.create().toString();

            grDetails.unshift(_item);
        }
        const { amount, total, vat } = this.calculatorInfo(grDetails);

        this.setState(previousState => {
            return {
                ...previousState,
                grDetails,
                amount,
                vat,
                total,
            };
        });

        Modal.close();
    };

    onRemoveFile = id => () => {
        if (this.state.isLocked) {
            return;
        }

        let files = [...this.state.files];

        files = files.filter(p => p.id != id);

        this.setState(previousState => {
            return {
                ...previousState,
                files,
            };
        });
    };

    onPopupUnitGRDetail = item => () => {
        const units = item.units || [];

        ModalSelect.open(
            this.onChangeUnitGRDetail(item),
            units,
            item.unitId,
            { label: 'unitName', value: 'unitID' },
            'Chọn đơn vị',
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

    onChangeUnitGRDetail = item => data => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == item.id);

        if (grDetail) {
            grDetail.unitId = data.unitID;
            grDetail.unitName = data.unitName;

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

    onToggleExpandUnit = id => () => {
        const grDetails = [...this.state.grDetails];

        const grDetail = grDetails.find(p => p.id == id);

        if (grDetail) {
            grDetail.isExpand = !grDetail.isExpand;

            this.setState(previousState => {
                return {
                    ...previousState,
                    grDetails,
                };
            });
        }
    };

    onEditUnit = item => () => {
        const { type, batch } = this.state;

        let _type = type;

        let _item = { ...item };

        if ((batch || {}).ID) {
            _type = 2;

            _item = {
                ..._item,
                type: _type,
            };
        }

        Modal.open(
            <AddUnit
                refToast={this.refToast}
                onAccept={this.onAcceptUnitEdit}
                goodReceivedReducer={this.props.GoodReceivedReducer}
                refModalSelect={this.refModalSelect}
                navigation={this.props.navigation}
                type={_type}
                isLocked={this.state.isLocked}
                data={_item}
            />,
            _item.materialName,
            this.refModal,
        );
    };

    onCheckIsTransport = isTransport => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isTransport,
            };
        });
    };

    requestConfirm = id => () => {
        this.props.GoodReceivedOperations.requestConfirm({ id }, res => {
            const status = (res || {}).status;
            if (status == 200) {
                _Toast.success('Thông báo', 'Duyệt phiếu nhập thành công');
                const timeOut = setTimeout(() => {
                    this.props.navigation.goBack();

                    clearTimeout(timeOut);
                }, DELAYS.navigationInsertOrUpdateToScreen);
            } else {
                const message = getErrorMessageServer(res);
                _Toast.error('Thông báo', message || 'Yêu cầu duyệt thất bại');
            }
        });
    };
    requestUnConfirm = id => () => {
        const { reason, content } = this.state;
        if (!reason) {
            _Toast.error('Thông báo', 'Vui lòng nhập lý do');
            return;
        }
        if (!content) {
            _Toast.error('Thông báo', 'Vui lòng nhập nội dung cần thực hiện lại');
            return;
        }
        this.props.GoodReceivedOperations.requestUnConfirm(
            { id, reason, content1: content },
            res => {
                const status = (res || {}).status;
                if (status == 200) {
                    _Toast.success('Thông báo', 'Không duyệt phiếu nhập thành công');
                    const timeOut = setTimeout(() => {
                        this.props.navigation.goBack();

                        clearTimeout(timeOut);
                    }, DELAYS.navigationInsertOrUpdateToScreen);
                } else {
                    const message = getErrorMessageServer(res);
                    _Toast.error('Thông báo', message || 'Yêu cầu không duyệt thất bại');
                }
            },
        );
    };

    onShowFile = url => () => {
        let check = url.startsWith('https://');
        if (check) {
            let extension = url.split(/[#?]/)[0].split('.').pop().trim();
            const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;
            const options = {
                fromUrl: url,
                toFile: localFile,
            };
            RNFS.downloadFile(options)
                .promise.then(() => FileViewer.open(localFile))
                .then(() => {
                    // console.log('Success');
                })
                .catch(error => {
                    // console.log('Error');
                });
        } else {
            FileViewer.open(url);
        }
    };

    onScanBatch = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.scan, {
            onScan: data => this.onScanBatchHandle(data),
        });
    };

    onScanBatchHandle = data => {
        this.isRender = false;

        const stampId = data.data || {} || '';

        if (!stampId) {
            _Toast.error('Thông báo', 'Mã QR không hợp lệ');

            return;
        }

        let _stampId = stampId;

        if (stampId.indexOf('http') > -1 || stampId.indexOf('https') > -1) {
            _stampId = getParameterUrlByName(stampId, 'qr');
        }

        if (!_stampId) {
            _Toast.error('Thông báo', 'Mã QR không hợp lệ');

            return;
        }

        this.props.GoodReceivedOperations.checkBatchByStamp(
            { stampId: _stampId },
            res => {
                const batch = (res.data || {} || {}).batch || null;

                if (!batch) {
                    _Toast.error('Thông báo', 'Mã QR không hợp lệ');

                    return;
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        batch,
                    };
                });
            },
        );
    };

    onAddPartner = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.addPartner, {
            screen: KEY_NAVIGATIONS.addGoodReceived,
            handleBack: this.handleBackAddPartner,
        });
    };

    handleBackAddPartner = data => {
        console.log(data);

        if (data) {
            this.isAddPartner = true;

            this.setState(previousState => {
                return {
                    ...previousState,
                    partner: data.id,
                    partnerName: data.partnerName,
                };
            });
        }
    };

    onChooseTypeGoodDelivery = typeGoodDelivery => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                typeGoodDelivery,
                type: typeGoodDelivery == 1 ? 1 : typeGoodDelivery == 2 ? 0 : null,
            };
        });
    };

    render() {
        const {
            files,
            isLocked,
            type,
            receiptPersonName,
            note,
            grCode,
            total,
            amount,
            vat,
            grDetails,
            grTime,
            partnerName,
            partnerType,
            id,
            isVisible,
            currentUser,
            isTransport,
            reason,
            confirmGR,
            status,
            receiptPerson,
            batch,
            isAddBatch,
            typeGoodDelivery,
            content,
            confirmedReason,
            content1,
            content2,
            confirmedByName,
            confirmedDate,
        } = this.state;

        const { id: currentId, isAdmin } = currentUser;

        let check = status == 0 || (status == 3 && confirmGR);

        let isUpdate = currentUser.id == receiptPerson && check;

        let disabled = status == 1 || status == 2 || (status == 3 && !confirmGR);

        return (
            <BoxMainContainer
                toastSetRef={this.toastSetRef}
                modalSetRef={this.modalSetRef}
                modalSelectSetRef={this.modalSelectSetRef}
                datePickerSetRef={this.datePickerSetRef}
                formDeleteSetRef={this.formDeleteSetRef}
                isVisibleLoadingCenter={isVisible}
                isShowBackHeader={true}
                isScrollEnabled={false}
                styleBody={style.boxMainBody}
                isShowInfo={true}
                isShowQRCodeButton={false}
                isShowHeader={true}
                isShowVersion={false}
                isShowVersionName={false}>
                <Text style={style.title}>NHẬP HÀNG</Text>
                {typeGoodDelivery == -1 ? (
                    <View style={style.typeGoodDelivery}>
                        <View style={style.typeGoodDeliveryModal}>
                            <View style={style.typeGoodDeliveryModalBody}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    delayPressIn={0}
                                    onPress={this.onChooseTypeGoodDelivery(0)}
                                    style={style.typeGoodDeliveryModalBodyItem}>
                                    <View style={style.typeGoodDeliveryModalBodyItemBox}>
                                        <View style={style.typeGoodDeliveryModalBodyItemBoxCheck}>
                                            {typeGoodDelivery == 0 ? (
                                                <View
                                                    style={
                                                        style.typeGoodDeliveryModalBodyItemBoxCheckCircle
                                                    }></View>
                                            ) : null}
                                        </View>
                                        <Text style={style.typeGoodDeliveryModalBodyItemBoxLabel}>
                                            Từ phiếu xuất
                                        </Text>
                                    </View>
                                    <Text style={style.typeGoodDeliveryModalBodyItemDescription}>
                                        Nhập từ phiếu xuất hàng của công ty cùng hệ thống Trace
                                        Center
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    delayPressIn={0}
                                    onPress={this.onChooseTypeGoodDelivery(1)}
                                    style={style.typeGoodDeliveryModalBodyItem}>
                                    <View style={style.typeGoodDeliveryModalBodyItemBox}>
                                        <View style={style.typeGoodDeliveryModalBodyItemBoxCheck}>
                                            {typeGoodDelivery == 1 ? (
                                                <View
                                                    style={
                                                        style.typeGoodDeliveryModalBodyItemBoxCheckCircle
                                                    }></View>
                                            ) : null}
                                        </View>
                                        <Text style={style.typeGoodDeliveryModalBodyItemBoxLabel}>
                                            Nguyên vật liệu
                                        </Text>
                                    </View>
                                    <Text style={style.typeGoodDeliveryModalBodyItemDescription}>
                                        Nhập nguyên vật liệu để sử dụng cho sản xuất
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    delayPressIn={0}
                                    onPress={this.onChooseTypeGoodDelivery(2)}
                                    style={style.typeGoodDeliveryModalBodyItem}>
                                    <View style={style.typeGoodDeliveryModalBodyItemBox}>
                                        <View style={style.typeGoodDeliveryModalBodyItemBoxCheck}>
                                            {typeGoodDelivery == 2 ? (
                                                <View
                                                    style={
                                                        style.typeGoodDeliveryModalBodyItemBoxCheckCircle
                                                    }></View>
                                            ) : null}
                                        </View>
                                        <Text style={style.typeGoodDeliveryModalBodyItemBoxLabel}>
                                            Sản phẩm
                                        </Text>
                                    </View>
                                    <Text style={style.typeGoodDeliveryModalBodyItemDescription}>
                                        Nhập sản phẩm để bán
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        {typeGoodDelivery == 0 ? (
                            <AddGoodDeliveryForBatch
                                refModalSelect={this.refModalSelect}
                                goodReceivedReducer={this.props.GoodReceivedReducer}
                                goodReceivedOperations={this.props.GoodReceivedOperations}
                            />
                        ) : (
                            <>
                                <KeyboardAwareScrollView
                                    showsVerticalScrollIndicator={false}
                                    automaticallyAdjustContentInsets={false}
                                    keyboardDismissMode="interactive"
                                    keyboardShouldPersistTaps="handled"
                                    style={style.form}>
                                    {typeGoodDelivery == -2 ? null : (
                                        <View style={style.formItemCheck}>
                                            <TouchableOpacity
                                                disabled={disabled}
                                                onPress={this.onCheckType(0)}
                                                activeOpacity={0.8}
                                                style={style.formItemCheckItem}>
                                                <View
                                                    style={[
                                                        style.formItemCheckItemCheck,
                                                        type == 0 ? style.formItemCheckItemCheckActive : {},
                                                    ]}>
                                                    <View
                                                        style={[
                                                            style.formItemCheckItemCheckCircle,
                                                            type == 0
                                                                ? style.formItemCheckItemCheckCircleActive
                                                                : {},
                                                        ]}></View>
                                                </View>
                                                <Text style={style.formItemCheckItemText}>
                                                    Sản phẩm
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                disabled={disabled}
                                                onPress={this.onCheckType(1)}
                                                activeOpacity={0.8}
                                                style={style.formItemCheckItem}>
                                                <View
                                                    style={[
                                                        style.formItemCheckItemCheck,
                                                        type == 1 ? style.formItemCheckItemCheckActive : {},
                                                    ]}>
                                                    <View
                                                        style={[
                                                            style.formItemCheckItemCheckCircle,
                                                            type == 1
                                                                ? style.formItemCheckItemCheckCircleActive
                                                                : {},
                                                        ]}></View>
                                                </View>
                                                <Text style={style.formItemCheckItemText}>
                                                    Nguyên vật liệu
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <View style={style.formItemMulti}>
                                        <View style={[style.formItem, style.formItemPercent1]}>
                                            <Text style={style.formItemLabel}>Số phiếu</Text>
                                            <TextInput
                                                editable={false}
                                                value={grCode}
                                                onSubmitEditing={this.onNextInputNote}
                                                onChangeText={this.onChangeValue('grCode')}
                                                maxLength={255}
                                                blurOnSubmit={false}
                                                returnKeyType="next"
                                                returnKeyLabel="Tiếp tục"
                                                style={[
                                                    style.formItemInput,
                                                    style.formItemInputDisable,
                                                ]}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            disabled={disabled}
                                            activeOpacity={0.8}
                                            onPress={this.onPopupGRTime}
                                            style={[style.formItem, style.formItemPercent2]}>
                                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>
                                                Ngày lập phiếu
                                            </Text>
                                            <View
                                                style={[
                                                    style.newDate1111,
                                                    disabled ? style.formItemInputDisable : null,
                                                ]}>
                                                <Text style={[style.formItemValue, style.newDate2222]}>
                                                    {grTime ? moment(grTime).format('DD/MM/YYYY') : ''}
                                                </Text>
                                                {disabled ? null : (
                                                    <View
                                                        style={[style.formItemSelectIcon, style.newIcon]}>
                                                        <ICONS.caretDown2 width={16} height={16} />
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={style.formItem}>
                                        <View style={style.formItemWrap}>
                                            <View style={style.formItemWrapItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Nhà cung cấp</Text>
                                                <View style={style.formItemGroup}>
                                                    <TouchableOpacity
                                                        disabled={disabled}
                                                        onPress={this.onPopupPartner}
                                                        activeOpacity={0.8}
                                                        style={[
                                                            style.formItemSelect,
                                                            disabled ? style.formItemInputDisable : null,
                                                        ]}>
                                                        <Text style={style.formItemSelectText}>
                                                            {partnerName}
                                                        </Text>
                                                        {disabled ? null : (
                                                            <View style={style.formItemSelectIcon}>
                                                                <ICONS.caretDown2 width={16} height={16} />
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                    {!disabled && (
                                                        <TouchableOpacity
                                                            onPress={this.onAddPartner}
                                                            activeOpacity={0.8}
                                                            style={style.formItemGroupAddButton}>
                                                            <ICONS.add width={16} height={16} />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={style.formItem}>
                                        <View style={style.formItemWrapItem}>
                                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Người nhập</Text>
                                            <View
                                                style={[
                                                    style.formItemSelect,
                                                    style.formItemInputDisable,
                                                ]}>
                                                <Text style={style.formItemSelectText}>
                                                    {receiptPersonName
                                                        ? receiptPersonName
                                                        : currentUser.fullName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={style.formItem}>
                                        <Text style={style.formItemLabel}>Ghi chú</Text>
                                        <TextInput
                                            editable={!disabled}
                                            value={note}
                                            ref={ref => (this.inputNote = ref)}
                                            onChangeText={this.onChangeValue('note')}
                                            maxLength={255}
                                            blurOnSubmit={false}
                                            returnKeyType="done"
                                            returnKeyLabel="Xong"
                                            style={[
                                                style.formItemInput,
                                                disabled ? style.formItemInputDisable : {},
                                            ]}
                                        />
                                    </View>
                                    <FileUpload
                                        files={files}
                                        setFiles={this.setFiles}
                                        onChooseFile={this.onChooseFile}
                                        onRemoveFile={this.onRemoveFile}
                                        isHide={disabled}
                                    />
                                    {isLocked && grDetails.length <= 0 ? (
                                        <Text style={style.emptyText}>Chưa có chi tiết</Text>
                                    ) : (
                                        <>
                                            <View style={style.formItemAddWrap}>
                                                <Text style={[style.formItemAddTitle, style.formItemLabelRequired]}>
                                                    Chi tiết phiếu nhập
                                                </Text>
                                                {disabled || isAddBatch ? null : (
                                                    <TouchableOpacity
                                                        onPress={this.onPopupUnit}
                                                        activeOpacity={0.8}
                                                        style={style.formItemAddButton}>
                                                        <ICONS.add width={16} height={16} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            {grDetails.length <= 0 ? (
                                                <Text style={style.emptyText}>Chưa có chi tiết</Text>
                                            ) : null}
                                        </>
                                    )}
                                    <View style={style.table}>
                                        <View style={style.tableBody}>
                                            {grDetails.map((item, index) => {
                                                return (
                                                    <View
                                                        key={`u-${index}`}
                                                        style={style.tableBodyRowMain}>
                                                        <TouchableOpacity
                                                            disabled={disabled}
                                                            delayPressIn={0}
                                                            activeOpacity={0.8}
                                                            onPress={this.onEditUnit(item)}
                                                            style={style.tableBodyRowWrap2}>
                                                            <View style={style.tableBodyRowWrap2Name}>
                                                                <Text style={style.tableBodyRowWrap2NameText}>
                                                                    {item.materialName}
                                                                </Text>
                                                            </View>
                                                            <View style={style.tableBodyRowWrap2Name}>
                                                                <Text style={style.tableBodyRowWrap2NameText}>
                                                                    {item.wareHouseName}
                                                                </Text>
                                                            </View>
                                                            <View style={style.tableBodyRowWrap2Price}>
                                                                <View style={style.item}>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemLabel
                                                                        }>
                                                                        ĐG:
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemText
                                                                        }>
                                                                        {numberWithCommas(item.unitPrice)}
                                                                    </Text>
                                                                </View>
                                                                <View style={[style.item, style.center]}>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemLabel
                                                                        }>
                                                                        SL:
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemText
                                                                        }>
                                                                        {numberWithCommas(item.quantity)}
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap3PriceItemLabel
                                                                        }>
                                                                        {' '}
                                                                        {item.unitName}
                                                                    </Text>
                                                                </View>
                                                                <View style={[style.item, style.end]}>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemLabel
                                                                        }>
                                                                        TT:
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            style.tableBodyRowWrap2PriceItemText
                                                                        }>
                                                                        {numberWithCommas(item.amount)}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                        {disabled ? null : (
                                                            <View style={style.tableBodyRowFunction}>
                                                                <View style={style.tableBodyRowEdit}>
                                                                    <TouchableOpacity
                                                                        onPress={this.onEditUnit(item)}
                                                                        activeOpacity={0.8}
                                                                        style={style.tableBodyRowEditButton}>
                                                                        <ICONS.edit width={16} height={16} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={style.tableBodyRowRemove}>
                                                                    <TouchableOpacity
                                                                        onPress={this.onRemoveGRDetail(item)}
                                                                        activeOpacity={0.8}
                                                                        style={style.tableBodyRowRemoveButton}>
                                                                        <ICONS.trash width={24} height={24} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    <View style={style.info}>
                                        <View style={style.infoBox}>
                                            <View style={style.infoItem}>
                                                <Text style={style.infoItemLabel}>Tổng cộng</Text>
                                                <Text style={style.infoItemValue}>
                                                    {numberWithCommas(total)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {status == 3 || status == 4 ? (
                                        <>
                                            <View style={style.formItemAddWrap}>
                                                <Text style={style.formItemAddTitle}>
                                                    Thông tin kiểm duyệt
                                                </Text>
                                            </View>
                                            <View style={style.formItem}>
                                                <Text style={style.formItemLabel}>
                                                    Lý do không duyệt
                                                </Text>
                                                <TextInput
                                                    editable={false}
                                                    value={confirmedReason}
                                                    maxLength={255}
                                                    blurOnSubmit={false}
                                                    returnKeyType="done"
                                                    returnKeyLabel="Xong"
                                                    style={[style.reason, style.formItemInputDisable]}
                                                />
                                            </View>
                                            <View style={style.formItem}>
                                                <Text style={style.formItemLabel}>
                                                    Nội dung cần thực hiện lại
                                                </Text>
                                                <TextInput
                                                    editable={false}
                                                    value={content1}
                                                    maxLength={255}
                                                    blurOnSubmit={false}
                                                    returnKeyType="done"
                                                    returnKeyLabel="Xong"
                                                    style={[style.reason, style.formItemInputDisable]}
                                                />
                                            </View>
                                            {status == 3 && (
                                                <>
                                                    <View style={style.formItem}>
                                                        <Text style={style.formItemLabel}>
                                                            Người xử lý:{' '}
                                                            <Text
                                                                style={[
                                                                    style.formItemLabel,
                                                                    style.formItemLabelBold,
                                                                ]}>
                                                                {confirmedByName}
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                    <View style={style.formItem}>
                                                        <Text style={style.formItemLabel}>
                                                            Ngày xử lý:{' '}
                                                            <Text
                                                                style={[
                                                                    style.formItemLabel,
                                                                    style.formItemLabelBold,
                                                                ]}>
                                                                {moment(confirmedDate).format('DD/MM/YYYY')}
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                </>
                                            )}
                                            <View style={style.formItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>
                                                    Nội dung đã thực hiện lại
                                                </Text>
                                                <TextInput
                                                    editable={status == 4 ? false : true}
                                                    value={content2}
                                                    onChangeText={this.onChangeValue('content2')}
                                                    maxLength={255}
                                                    blurOnSubmit={false}
                                                    returnKeyType="done"
                                                    returnKeyLabel="Xong"
                                                    style={[
                                                        style.reason,
                                                        status == 4 ? style.formItemInputDisable : {},
                                                    ]}
                                                />
                                            </View>
                                        </>
                                    ) : null}
                                </KeyboardAwareScrollView>
                                {id ? (
                                    <>
                                        {((confirmGR && status == 1) || (confirmGR && status == 4)) ? (
                                            <AuthenticateView
                                                claims={[
                                                    CLAIMS.goodReceipt.confirm,
                                                    CLAIMS.goodReceipt.unconfirm,
                                                ]}
                                                checkType={0}>
                                                <TouchableOpacity
                                                    onPress={this.requestConfirm(id)}
                                                    activeOpacity={0.8}
                                                    style={style.buttonOk}>
                                                    <Text style={style.textButton}>DUYỆT</Text>
                                                </TouchableOpacity>
                                                <View style={style.formItem}>
                                                    <Text style={style.formItemLabel}>
                                                        Lý do không duyệt
                                                    </Text>
                                                    <TextInput
                                                        multiline={true}
                                                        value={reason}
                                                        onChangeText={this.onChangeValue('reason')}
                                                        maxLength={255}
                                                        blurOnSubmit={false}
                                                        returnKeyType="done"
                                                        returnKeyLabel="Xong"
                                                        style={style.reason}
                                                    />
                                                </View>

                                                <View style={style.formItem}>
                                                    <Text style={style.formItemLabel}>
                                                        Nội dung cần thực hiện lại
                                                    </Text>
                                                    <TextInput
                                                        multiline={true}
                                                        value={content}
                                                        onChangeText={this.onChangeValue('content')}
                                                        maxLength={255}
                                                        blurOnSubmit={false}
                                                        returnKeyType="done"
                                                        returnKeyLabel="Xong"
                                                        style={style.reason}
                                                    />
                                                </View>
                                                <View style={style.wrapButton}>
                                                    <TouchableOpacity
                                                        onPress={this.requestUnConfirm(id)}
                                                        activeOpacity={0.8}
                                                        style={style.buttonNotOk}>
                                                        <Text style={style.textButton}>KHÔNG DUYỆT</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </AuthenticateView>
                                        ) : (type == GR_TYPES.batch ? null : (
                                            <>
                                                {isUpdate && (
                                                    <View style={style.function}>
                                                        <AuthenticateView
                                                            claims={[CLAIMS.goodReceipt.edit]}
                                                            checkType={0}>
                                                            <TouchableOpacity
                                                                onPress={this.onAdd}
                                                                activeOpacity={0.8}
                                                                style={style.functionUpdate}>
                                                                <ICONS.save width={18} height={18} />
                                                                <Text style={style.functionUpdateText}>
                                                                    CẬP NHẬT
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </AuthenticateView>
                                                    </View>
                                                )}
                                            </>
                                        ))}
                                    </>
                                ) : type == GR_TYPES.batch ? null : (
                                    <View style={style.function}>
                                        <AuthenticateView
                                            claims={[CLAIMS.goodReceipt.add]}
                                            checkType={0}>
                                            <TouchableOpacity
                                                onPress={this.onAdd}
                                                activeOpacity={0.8}
                                                style={style.functionUpdate}>
                                                <ICONS.save width={18} height={18} />
                                                <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                                            </TouchableOpacity>
                                        </AuthenticateView>
                                    </View>
                                )}
                            </>
                        )}
                    </>
                )}
            </BoxMainContainer>
        );
    }
}

export default AddGoodReceived;