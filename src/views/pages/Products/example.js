<<<<<<< HEAD
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import { Guid } from 'guid-typescript';

import { ICONS } from '../../../assets/imgs';

import FormDelete from '../../components/formDelete';

import FormQuestion from '../../components/formQuestion';
=======
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
>>>>>>> d7d300a (init)

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

<<<<<<< HEAD
import { getErrorMessageServer } from '../../utils/errorMessageServer';

import { consignmentConstant } from '../../states/consignment';

import { ModalSelect } from '../../bases/controls/select';

import DatePicker from '../../bases/controls/datePicker';

import { STAMPING_FORMS, FIELD_TYPES, CLAIMS } from '../../constants/data';

import style from './style';

import {
    getParameterUrlByName,
    numberWithCommas,
    replaceComma
} from '../../bases/helper';

import { getListFieldTreeList } from '../../utils/helpers';

import { DELAYS, KEY_NAVIGATIONS } from '../../constants/config';

import Image from '../../bases/controls/image';

import { AuthenticateView } from '../../utils/auth';
import { checkClaims, getCompanyCode, getUserId } from '../../utils/user';
import FileUpload from '../../components/fileUpload';
import { padStart } from 'lodash';
import { COLORS } from '../../constants/theme';

class AddConsignment extends Component {
    constructor(props) {
        super(props);

        const dateStart = new Date();

        this.state = {
            isVisible: false,
            id: '',
            name: '',
            quantity: '',
            productName: '',
            productId: '',
            dateStart,
            dateEnd: null,
            note: '',
            fieldId: '',
            fieldName: '',
            dateExpire: null,
            qrCode: '',
            stampingName: '',
            stampingId: null,
            plantingZoneId: null,
            plantingZoneName: '',
            unitId: null,
            unitName: '',
            fieldType: null,
            individuals: [],
            individualId: null,
            inidividualName: null,
            files: [],
            traces: [],
            traceId: null,
            isHaveItem: false,
            isLocked: false,
            createdDate: new Date(),
            productName: '',
            batchNum: '',
            batchCode: '',
            traceInformId: null,
            quantityRemain: 0,
            reason: '',
            wareHouseName: '',
            wareHouseId: '',
            isShowConfirm: false,
            isShowUnConfirm: false,
            listQRCodes: [],
            isScan: false,
            stampRanges: [],
            stampRangeName: '',
            stampRangeId: '',
            startNum: '',
            endNum: '',
            numberFrom: '',
            numberTo: '',
            productCode: '',
            status: 0,
            confirmBatch: false,
            companyCode: '',
            isReUsed: true,
            batchCategories: [],
            batchCategoryDescription: '',
            batchCategoryId: '',
            confirmedReason: '',
            confirmedByName: '',
            confirmedDate: '',
            isReused: false,
            content1: '',
            content2: '',
            contentRemake: '',
            exportType: 0,
            batchExports: [],
            residentName: ''
        };

        this.inputQuantity = null;
        this.inputNote = null;
        this.inputQRCode = null;
        this.inputNumberFrom = null;
        this.inputNumberTo = null;
        this.inputBatchNum = null;
        this.toastRef = null;

        this.refModalSelect = null;
        this.refFormDelete = null;
        this.refDatePicker = null;
        this.formQuestionRef = null;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', async () => {
            const companyCode = await getCompanyCode();

            const { ConsignmentOperations } = this.props;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                    companyCode,
                };
            });

            this.props.ConsignmentOperations.getListNationComboBox({}, res => {
                const nations = (res.data || {}).data || [];

                this.setState(previousState => {
                    return {
                        ...previousState,
                        nations
                    }
                });
            });

            this.props.ConsignmentOperations.getListProvinceComboBox({}, res => {
                const provinces = (res.data || {}).data || [];

                this.setState(previousState => {
                    return {
                        ...previousState,
                        provinces
                    }
                });
            });

            this.props.ConsignmentOperations.getBatchCategories(
                {},
                resBatchCategories => {
                    const batchCategories =
                        (resBatchCategories.data || {}).batchCategories || [];

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            batchCategories,
                        };
                    });

                    this.getListStampRange().then(stampRanges => {
                        ConsignmentOperations.getCompanyConfig(config => {
                            let data = (config.data || {}).data || {};
                            let isScan = data?.isScan;
                            let confirmBatch = data?.confirmBatch;

                            ConsignmentOperations.getListTraceHarvestForAddConsignment(
                                {},
                                res => {
                                    this.setState(previousState => {
                                        return {
                                            ...previousState,
                                            isVisible: false,
                                        };
                                    });

                                    const tempTraces = (res.data || {}).traces || [];

                                    const traces = tempTraces.map(item => {
                                        return {
                                            ...item,
                                            Name: item.Name + ' - SL: ' + item.QuantityRemain,
                                        };
                                    });

                                    this.setState(previousState => {
                                        return {
                                            ...previousState,
                                            traces,
                                            isScan,
                                            stampRanges,
                                            confirmBatch,
                                        };
                                    });

                                    const { route } = this.props;

                                    if (route.params) {
                                        if (route.params.id) {
                                            this.getDetailConsignment(
                                                route.params.id,
                                                route.params.plantingZoneName,
                                                traces,
                                                batchCategories,
                                            );
                                        }
                                    }
                                },
                            );
                        });
                    });
                },
            );
        });
    }

    getListStampRange = () => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getStampRange(range => {
                let tempStampRanges = range?.data?.data?.stampRanges || [];
                console.log(tempStampRanges);
                
                tempStampRanges.sort((a, b) => b.startNum - a.startNum);

                let stampRanges = tempStampRanges.map(item => {
                    let name =
                        numberWithCommas(item.startNum) +
                        ' - ' +
                        numberWithCommas(item.endNum);
                    return {
                        ...item,
                        name,
                    };
                });

                resolve(stampRanges);
            });
        });
    };

    datePickerSetRef = ref => {
        this.refDatePicker = ref;
    };

    formDeleteSetRef = ref => {
        this.refFormDelete = ref;
    };

    modalSelectSetRef = ref => {
        this.refModalSelect = ref;
    };

    toastSetRef = ref => {
        this.toastRef = ref;
    };

    formQuestionSetRef = ref => {
        this.formQuestionRef = ref;
    };

    getListFieldComboBox = () => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getListFieldComboBox(
                { filter: '', search: '', orderBy: '', page: -1, limit: 1 },
                res => {
                    const fields = ((res.data || {}).data || {}).fields || [];

                    resolve(fields);
                },
            );
        });
    };

    getItemNameByTraceInform = traceInformId => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getItemNameByTraceInform(
                { traceInformId },
                res => {
                    const itemName = (res.data || {}).itemName || '';

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            individualName: itemName,
                        };
                    });

                    resolve((((res.data || {}).data || {}).data || {}).itemName || '');
                },
            );
        });
    };

    getUnitNameByTraceInform = traceInformId => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getUnitNameByTraceInform(
                { traceInformId },
                res => {
                    const unitName = (res.data || {}).unitName || '';
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            unitName,
                        };
                    });
                    resolve((res.data || {}).unitName || '');
                },
            );
        });
    };

    getListPlantingZoneComboBox = traceInformId => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getListPlantingZoneComboBox(
                { traceInformId },
                res => {
                    const plantingZones =
                        ((res.data || {}).data || {}).plantingZones || [];

                    if (plantingZones.length == 1) {
                        const plantingZone = plantingZones[0] || {};

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                plantingZoneId: plantingZone.id,
                                plantingZoneName: plantingZone.name,
                            };
                        });
                    }

                    resolve(((res.data || {}).data || {}).planZones || []);
                },
            );
        });
    };

    getListIndividualComboBox = (search, fieldId, productId, plantingZoneId) => {
        search = search || '';

        return new Promise(resolve => {
            this.props.IndividualOperations.getListIndividualComboBoxForInsertOrUpdateConsignment(
                { search, fieldId, productId, plantingZoneId, page: 0, limit: 100 },
                res => {
                    const data = (res.data || {}).data || [];

                    resolve(data);
                },
            );
        });
    };

    getListUnitComboBox = productId => {
        return new Promise(resolve => {
            this.props.ConsignmentOperations.getListUnitComboBox({ productId }, res => {
                resolve(((res.data || {}).data || {}).productsUnits || []);
            });
        });
    };

    getDetailConsignment = (id, plantingZoneName, traces, batchCategories) => {
        const { ConsignmentOperations } = this.props;

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        ConsignmentOperations.getDetailConsignment({ id }, async res => {
            this.props.ConsignmentOperations.getListWarehouseForUpdate(
                {},
                async res2 => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    let warehouses = ((res2.data || {}).data || {}).wareHouses || [];
                    const data = (res.data || {}).batch;
                    const batchExports = ((res.data || {}).batchExports || []).map(p => {
                        return {
                            id: p.residentID,
                            provinceName: p.name,
                            nationName: p.name
                        }
                    });

                    const residentName = batchExports.map(p => p.provinceName || p.nationName).join(',');

                    console.log('res.data', res.data);

                    const qrCodes = (res.data || {}).qrCodes;

                    let listQRCodes = qrCodes.map(item => {
                        return {
                            id: Guid.create().toString(),
                            name: item,
                        };
                    });

                    if (!data) {
                        _Toast.success('Thông báo', 'Lấy thông tin lô hàng thất bại');

                        const timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);

                        return;
                    }

                    const userId = await getUserId();

                    // let isShowConfirm = false;
                    // let isShowUnConfirm = false;

                    // if (data.createdBy != userId) {
                    //   const checks = await checkClaims([
                    //     CLAIMS.batch.confirm,
                    //     CLAIMS.batch.unConfirm,
                    //   ]);
                    //   isShowConfirm =
                    //     checks.find(p => p.key == CLAIMS.batch.confirm).checked || false;
                    //   isShowUnConfirm =
                    //     checks.find(p => p.key == CLAIMS.batch.unConfirm).checked ||
                    //     false;
                    // } else {
                    //   if (data.status == 1) {
                    //     isShowConfirm = true;
                    //     isShowUnConfirm = true;
                    //   }
                    // }

                    const _files = (data.files || '').split(';').filter(p => p);

                    const files = _files.map(p => {
                        return {
                            id: Guid.create().toString(),
                            name: p,
                            uri: p,
                        };
                    });

                    const trace = traces.find(
                        p => p.TraceInformID == data.tracesInformID,
                    );

                    let traceId = '';
                    let traceName = '';
                    let traceInformId = '';
                    let productId = '';
                    let fieldId = '';
                    let quantityRemain = '';
                    let productName = '';

                    let isShowPlantingZone = false;

                    if (trace) {
                        traceId = trace.ID;
                        traceName = trace.Name;
                        traceInformId = trace.traceInformID;
                        productId = trace.productID;
                        fieldId = trace.fieldID;
                        quantityRemain = trace.quantityRemain;
                        productName = trace.productName;

                        if (
                            FIELD_TYPES.trongTrot == trace.FieldType ||
                            FIELD_TYPES.chanNuoi == trace.FieldType
                        ) {
                            isShowPlantingZone = true;
                        }
                    }

                    // let plantingZoneName = '';

                    // if (traceId) {
                    //   const plantingZones = await this.getListPlantingZoneComboBox(traceId);
                    //   console.log('plantingZones', plantingZones);
                    //   const plantingZone = plantingZones.find(
                    //     p => p.ID == data.plantingZoneID,
                    //   );

                    //   if (plantingZone) {
                    //     plantingZoneName = plantingZone.Name;
                    //   }
                    // }

                    if (traceInformId) {
                        this.getItemNameByTraceInform(this.state.traceInformId);
                        this.getUnitNameByTraceInform(this.state.traceInformId);
                    }

                    let batchCategoryDescription = '';

                    if (data.categoryId) {
                        const batchCategory = batchCategories.find(
                            p => p.id == data.categoryId,
                        );

                        if (batchCategory) {
                            batchCategoryDescription = batchCategory.description;
                        }
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            id: data.id,
                            files,
                            isShowPlantingZone,
                            // isShowConfirm,
                            // isShowUnConfirm,
                            traceId,
                            batchNum: data.batchNum,
                            batchCode: data.batchCode,
                            createdDate: data.createdDate,
                            quantity: (data.quantity || '').toString(),
                            note: data.note,
                            qrCode: data.stampID,
                            traceInformId: data.tracesInformID,
                            productId,
                            fieldId,
                            plantingZoneId: data.plantingZoneID,
                            productName: data.productName,
                            plantingZoneName,
                            warehouses,
                            listQRCodes,
                            unitName: data.unitName,
                            numberFrom:
                                data.status == 3 && !data.isReused
                                    ? ''
                                    : numberWithCommas(data.startNum),
                            numberTo:
                                data.status == 3 && !data.isReused
                                    ? ''
                                    : numberWithCommas(data.endNum),
                            traceName: data.traceName,
                            status: data.status,
                            batchCategoryId: data.categoryId,
                            batchCategoryDescription,
                            confirmedReason: data.confirmedReason,
                            confirmedByName: data.confirmedByName,
                            confirmedDate: data.confirmedDate,
                            isReused: data.isReused,
                            content1: data.content1,
                            content2: data.status == 3 ? '' : data.content2,
                            exportType: data.exportType,
                            batchExports,
                            residentName
                        };
                    });
                },
            );
        });
    };

    getListProductByFieldId = fieldId => {
        return new Promise(resolve => {
            const { ConsignmentOperations } = this.props;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                    productId: '',
                    productName: '',
                };
            });

            ConsignmentOperations.getListProductComboBox(
                {
                    productCode: '',
                    productName: '',
                    fieldID: fieldId,
                    page: -1,
                    limit: 1,
                },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    resolve(((res.data || {}).data || {}).products || []);
                },
            );
        });
    };

    onPopupField = () => {
        const { ConsignmentReducer } = this.props;

        let fields = [];

        if (ConsignmentReducer.get(consignmentConstant.KEYS.fieldComboBoxs).toJS) {
            fields = ConsignmentReducer.get(
                consignmentConstant.KEYS.fieldComboBoxs,
            ).toJS();
        }

        let results = [];

        getListFieldTreeList(
            fields,
            results,
            p => p.FieldID || !p.ParentID,
            0,
            'ParentID',
            'FieldID',
        );

        let sympols = [];

        ModalSelect.open(
            this.onChangeField,
            results,
            this.state.fieldId,
            { value: 'FieldID', label: 'FieldName' },
            'Chọn ngành nghề',
            'Tìm kiếm',
            false,
            null,
            null,
            [],
            (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                sympols = Array.apply(null, Array(item.level || 0)).map(() => {
                    return '----';
                });

                return (
                    <TouchableOpacity
                        activeOpacity={item.isDisable ? 1 : 0.8}
                        onPress={item.isDisable ? null : this.onChangeField(item)}
                        key={index}
                        style={[
                            styleRow,
                            item.isDisable
                                ? styleDisable
                                : item.FieldID == this.state.fieldId
                                    ? styleActive
                                    : {},
                        ]}>
                        <Text style={styleRowText}>
                            {sympols}
                            {sympols.length > 0 ? ' ' : ''}
                            {item.FieldName}
                        </Text>
                    </TouchableOpacity>
                );
            },
            null,
            null,
            null,
            null,
            this.refModalSelect,
        );
    };

    onChangeField = item => () => {
        ModalSelect.close();

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    fieldId: item.FieldID,
                    fieldName: item.FieldName,
                    fieldType: item.FieldType,
                    productId: '',
                    productName: '',
                    plantingZoneId: '',
                    plantingZoneName: '',
                    unitId: '',
                    unitName: '',
                };
            },
            () => {
                this.getListProductByFieldId(item.FieldID);
            },
        );
    };

    onPopupProduct = () => {
        const { ConsignmentReducer } = this.props;

        let products = [];

        if (
            ConsignmentReducer.get(consignmentConstant.KEYS.productComboBoxs).toJS
        ) {
            products = ConsignmentReducer.get(
                consignmentConstant.KEYS.productComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onChangeProduct,
            products,
            this.state.productId,
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
        );
    };

    onChangeProduct = item => {
        this.setState(
            previousState => {
                return {
                    ...previousState,
                    productId: item.id,
                    productName: item.productName,
                    plantingZoneId: '',
                    plantingZoneName: '',
                    unitName: '',
                    unitId: '',
                };
            },
            () => {
                this.getListPlantingZoneComboBox(this.state.traceInformId);
            },
        );
    };

    onPopupPlantingZone = () => {
        const { ConsignmentReducer } = this.props;

        let plantingZones = [];

        if (
            ConsignmentReducer.get(consignmentConstant.KEYS.plantingZoneComboBoxs)
                .toJS
        ) {
            plantingZones = ConsignmentReducer.get(
                consignmentConstant.KEYS.plantingZoneComboBoxs,
            ).toJS();
        }

        if (this.refModalSelect) {
            this.refModalSelect.init(
                this.onChangePlantingZone,
                plantingZones,
                this.state.plantingZoneId,
                { value: 'ID', label: 'Name' },
                'Chọn vùng sản xuất',
                'Tìm kiếm',
            );

            const timeOut = setTimeout(() => {
                this.refModalSelect.show();

                clearTimeout(timeOut);
            }, 100);
        } else {
            ModalSelect.open(
                this.onChangePlantingZone,
                plantingZones,
                this.state.plantingZoneId,
                { value: 'ID', label: 'Name' },
                'Chọn vùng sản xuất',
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
        }
    };

    onChangePlantingZone = item => {
        ModalSelect.close();

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    plantingZoneId: item.ID,
                    plantingZoneName: item.Name,
                };
            },
            async () => {
                const data = await this.getListIndividualComboBox(
                    '',
                    this.state.fieldId,
                    this.state.productId,
                    this.state.plantingZoneId,
                );

                this.setState(previousState => {
                    return {
                        ...previousState,
                        individuals: data,
                    };
                });
            },
        );
    };

    onPopupUnit = () => {
        const { ConsignmentReducer } = this.props;

        let units = [];

        if (ConsignmentReducer.get(consignmentConstant.KEYS.unitComboBoxs).toJS) {
            units = ConsignmentReducer.get(
                consignmentConstant.KEYS.unitComboBoxs,
            ).toJS();
        }

        if (this.refModalSelect) {
            this.refModalSelect.init(
                this.onChangeUnit,
                units,
                this.state.unitId,
                { value: 'unitID', label: 'unitName' },
                'Chọn đơn vị',
                'Tìm kiếm',
            );

            const timeOut = setTimeout(() => {
                this.refModalSelect.show();

                clearTimeout(timeOut);
            }, 100);
        } else {
            ModalSelect.open(
                this.onChangeUnit,
                units,
                this.state.unitId,
                { value: 'unitID', label: 'unitName' },
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
            );
        }
    };

    onChangeUnit = item => {
        ModalSelect.close();

        this.setState(previousState => {
            return {
                ...previousState,
                unitId: item.unitID,
                unitName: item.unitName,
            };
        });
    };

    onPopupDatePickerStart = () => {
        DatePicker.open(
            this.state.dateStart,
            this.onConfirmDateStart,
            this.refDatePicker,
        );
    };

    onConfirmDateStart = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);

            this.setState(previousState => {
                return {
                    ...previousState,
                    dateStart: newDate,
                };
            });
        }
    };

    onPopupDatePickerExpire = () => {
        DatePicker.open(
            this.state.dateExpire,
            this.onConfirmDateExpire,
            this.refDatePicker,
        );
    };

    onConfirmDateExpire = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);

            this.setState(previousState => {
                return {
                    ...previousState,
                    dateExpire: newDate,
                };
            });
        }
    };

    onPopupDatePickerEnd = () => {
        DatePicker.open(
            this.state.dateEnd,
            this.onConfirmDateEnd,
            this.refDatePicker,
        );
    };

    onConfirmDateEnd = (result, year, month, day) => {
        if (result) {
            const newDate = new Date(year, month, day);

            this.setState(previousState => {
                return {
                    ...previousState,
                    dateEnd: newDate,
                };
            });
        }
    };

    onNextInputQRCode = () => {
        this.inputQRCode.focus();
    };

    onNextInputQuantity = () => {
        this.inputQuantity.focus();
    };

    onNextInputNote = () => {
        this.inputNote.focus();
    };

    onNextInputNumberFrom = () => {
        this.inputNumberFrom.focus();
    };
    onNextInputNumberTo = () => {
        this.inputNumberTo.focus();
    };
    setFiles = value => {
        this.setState(previousState => {
            return {
                ...previousState,
                files: value,
            };
        });
    };
    onAdd = () => {
        const { ConsignmentOperations, ConsignmentReducer } = this.props;
        const {
            traceInformId,
            createdDate,
            quantityRemain,
            traceId,
            fieldType,
            plantingZoneId,
            unitId,
            id,
            name,
            quantity,
            fieldId,
            productId,
            dateStart,
            note,
            qrCode,
            individuals,
            individualId,
            files,
            batchCode,
            listQRCodes,
            batchNum,
            numberFrom,
            numberTo,
            stampRangeId,
            batchCategoryId,
            batchExports
        } = this.state;

        let plantingZones = [];

        if (
            ConsignmentReducer.get(consignmentConstant.KEYS.plantingZoneComboBoxs)
                .toJS
        ) {
            plantingZones = ConsignmentReducer.get(
                consignmentConstant.KEYS.plantingZoneComboBoxs,
            ).toJS();
        }

        Keyboard.dismiss();

        const _quantity = parseFloat(replaceComma(quantity, ''));
        const _quantityRemain = parseFloat(replaceComma(_quantityRemain, ''));

        if (!batchNum) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lô hàng!',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!traceId) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn nhật ký',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!traceId) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn nhật ký',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!traceInformId) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn nhật ký để có truy xuất',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!productId) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn nhật ký để có sản phẩm',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (plantingZones.length > 1) {
            if (!plantingZoneId) {
                _Toast.error(
                    'Thông báo',
                    'Bạn vui lòng chọn vị trí',
                    null,
                    true,
                    {},
                    this.toastRef,
                );

                return;
            }
        }
        if (!_quantity) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (_quantity <= 0) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng lớn hơn 0',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        // if (_quantity > _quantityRemain) {
        //   _Toast.error(
        //     'Thông báo',
        //     'Bạn vui lòng nhập số lượng không lớn hơn số lượng còn lại',
        //     null,
        //     true,
        //     {},
        //     this.toastRef,
        //   );

        //   return;
        // }

        if (listQRCodes.length <= 0) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập mã QR',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        // if (!qrCode) {
        //   _Toast.error(
        //     'Thông báo',
        //     'Bạn vui lòng nhập mã QR',
        //     null,
        //     true,
        //     {},
        //     this.toastRef,
        //   );

        //   return;
        // }

        const stringFiles = files
            .filter(p => p.name)
            .map(p => p.name)
            .join(',');

        const _files = files.filter(p => p.name && p.uri && p.type);

        let qrCodes = listQRCodes.map(item => item.name);

        const _batchExports = batchExports.map(p => p.id);

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        if (id) {
            ConsignmentOperations.editConsignment(
                {
                    id,
                    traceInformId,
                    plantingZoneId,
                    // stampId: qrCode,
                    quantity,
                    files: stringFiles,
                    fileFiles: _files,
                    note,
                    traceInformId,
                    createdDate: moment(createdDate).format('YYYY-MM-DD'),
                    qrCodes: listQRCodes,
                    batchCode,
                    startNum: replaceComma(numberFrom, ''),
                    endNum: replaceComma(numberTo, ''),
                    stampRangeId,
                    categoryId: batchCategoryId,
                    batchExports: _batchExports
                },
                res => {
                    if (res.status && res.status == 200) {
                        _Toast.success(
                            'Thông báo',
                            'Sửa lô hàng thành công',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );

                        const timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error(
                            'Thông báo',
                            message || 'Sửa lô hàng thất bại',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );
                    }

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });
                },
            );
        } else {
            ConsignmentOperations.addConsignment(
                {
                    // traceID: traceId,
                    // traceInformId,
                    // plantingZoneId,
                    // batchNum,
                    // // stampId: qrCode,
                    // quantity,
                    // files: stringFiles,
                    // fileFiles: _files,
                    // note,
                    // createdDate: moment(createdDate).format('YYYY-MM-DD'),
                    // qrCodes,
                    // batchCode,
                    traceId,
                    plantingZoneId,
                    batchNum,
                    quantity,
                    note,
                    files: _files,
                    stampQuantity: '',
                    traceInformId,
                    createdDate: moment(createdDate).format('YYYY-MM-DD'),
                    qrCodes,
                    startNum: replaceComma(numberFrom, ''),
                    endNum: replaceComma(numberTo, ''),
                    stampRangeId,
                    categoryId: batchCategoryId,
                    batchExports: _batchExports
                },
                res => {
                    if (res.status && res.status == 200) {
                        _Toast.success(
                            'Thông báo',
                            'Thêm lô hàng thành công',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );

                        this.getListStampRange().then(stampRanges => {
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    stampRanges,
                                };
                            });
                        });

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                fieldId: '',
                                fieldName: '',
                                productId: '',
                                productName: '',
                                name: '',
                                quantity: '',
                                note: '',
                                dateStart: null,
                                dateEnd: null,
                                plantingZoneId: '',
                                plantingZoneName: '',
                                unitName: '',
                                unitId: '',
                                qrCode: '',
                                traceId: '',
                                traceName: '',
                                createdDate: new Date(),
                                inidividualName: '',
                                files: [],
                                traceInformId: null,
                                listQRCodes: [],
                                batchNum: '',
                                stampRangeName: '',
                                stampRangeId: '',
                                startNum: '',
                                endNum: '',
                                numberFrom: '',
                                numberTo: '',
                                productCode: '',
                                batchCategoryId: '',
                                batchCategoryDescription: '',
                            };
                        });
                    } else {
                        const message = getErrorMessageServer(res);

                        _Toast.error(
                            'Thông báo',
                            message || 'Thêm lô hàng thất bại',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );
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
        // ConsignmentOperations.checkStampIDValid(
        //   {stampId: qrCode, productId},
        //   res => {

        //     const checkStampId = ((res.data || {}).data || {}).isCheck || false;

        //     if (!checkStampId) {
        //       _Toast.error(
        //         'Thông báo',
        //         'Mã QRCode không hợp lệ',
        //         null,
        //         true,
        //         {},
        //         this.toastRef,
        //       );

        //       return;
        //     }

        //     if (id) {
        //       ConsignmentOperations.editConsignment(
        //         {
        //           id,
        //           traceInformId,
        //           plantingZoneId,
        //           stampId: qrCode,
        //           quantity,
        //           files: stringFiles,
        //           fileFiles: _files,
        //           note,
        //           createdDate: moment(createdDate).format('YYYY-MM-DD'),
        //           qrCodes: listQRCodes,
        //           batchCode,
        //         },
        //         res => {
        //           if (res.status && res.status == 200) {
        //             _Toast.success(
        //               'Thông báo',
        //               'Sửa lô hàng thành công',
        //               null,
        //               true,
        //               {},
        //               this.toastRef,
        //             );

        //             const timeOut = setTimeout(() => {
        //               this.props.navigation.goBack();

        //               clearTimeout(timeOut);
        //             }, DELAYS.navigationInsertOrUpdateToScreen);
        //           } else {
        //             const message = getErrorMessageServer(res);

        //             _Toast.error(
        //               'Thông báo',
        //               message || 'Sửa lô hàng thất bại',
        //               null,
        //               true,
        //               {},
        //               this.toastRef,
        //             );
        //           }

        //           this.setState(previousState => {
        //             return {
        //               ...previousState,
        //               isVisible: false,
        //             };
        //           });
        //         },
        //       );
        //     } else {
        //       ConsignmentOperations.addConsignment(
        //         {
        //           traceInformId,
        //           plantingZoneId,
        //           stampId: qrCode,
        //           quantity,
        //           files: stringFiles,
        //           fileFiles: _files,
        //           note,
        //           createdDate: moment(createdDate).format('YYYY-MM-DD'),
        //           qrCodes: listQRCodes,
        //           batchCode,
        //         },
        //         res => {
        //           if (res.status && res.status == 200) {
        //             _Toast.success(
        //               'Thông báo',
        //               'Thêm lô hàng thành công',
        //               null,
        //               true,
        //               {},
        //               this.toastRef,
        //             );

        //             this.setState(previousState => {
        //               return {
        //                 ...previousState,
        //                 fieldId: '',
        //                 fieldName: '',
        //                 productId: '',
        //                 productName: '',
        //                 name: '',
        //                 quantity: '',
        //                 note: '',
        //                 dateStart: null,
        //                 dateEnd: null,
        //                 plantingZoneId: '',
        //                 plantingZoneName: '',
        //                 unitName: '',
        //                 unitId: '',
        //                 qrCode: '',
        //                 traceId: '',
        //                 traceName: '',
        //                 createdDate: new Date(),
        //                 inidividualName: '',
        //                 files: [],
        //                 traceInformId: null,
        //                 listQRCodes: [],
        //               };
        //             });
        //           } else {
        //             const message = getErrorMessageServer(res);

        //             _Toast.error(
        //               'Thông báo',
        //               message || 'Thêm lô hàng thất bại',
        //               null,
        //               true,
        //               {},
        //               this.toastRef,
        //             );
        //           }

        //           this.setState(previousState => {
        //             return {
        //               ...previousState,
        //               isVisible: false,
        //             };
        //           });
        //         },
        //       );
        //     }
        //   },
        // );
    };

    onUpdate = () => {
        const { ConsignmentOperations, ConsignmentReducer } = this.props;
        const {
            traceInformId,
            createdDate,
            quantityRemain,
            traceId,
            fieldType,
            plantingZoneId,
            unitId,
            id,
            name,
            quantity,
            fieldId,
            productId,
            dateStart,
            note,
            qrCode,
            individuals,
            individualId,
            files,
            batchCode,
            listQRCodes,
            batchNum,
            numberFrom,
            numberTo,
            stampRangeId,
            batchCategoryId,
            content2,
            contentRemake,
            CategoryID,
        } = this.state;

        let plantingZones = [];

        if (
            ConsignmentReducer.get(consignmentConstant.KEYS.plantingZoneComboBoxs)
                .toJS
        ) {
            plantingZones = ConsignmentReducer.get(
                consignmentConstant.KEYS.plantingZoneComboBoxs,
            ).toJS();
        }

        Keyboard.dismiss();

        const _quantity = parseFloat(replaceComma(quantity, ''));
        const _quantityRemain = parseFloat(replaceComma(_quantityRemain, ''));

        if (!batchNum) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lô hàng!',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!_quantity) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (_quantity <= 0) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số lượng lớn hơn 0',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (listQRCodes.length <= 0) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập mã QR',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        if (!content2) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập nội dung đã thực hiện lại',
                null,
                true,
                {},
                this.toastRef,
            );

            return;
        }

        const stringFiles = files
            .filter(p => p.name)
            .map(p => p.name)
            .join(',');

        const _files = files.filter(p => p.name && p.uri && p.type);

        let qrCodes = listQRCodes.map(item => item.name);

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        ConsignmentOperations.updateConsignment(
            {
                id,
                traceId,
                traceInformId,
                plantingZoneId,
                quantity,
                files: stringFiles,
                fileFiles: _files,
                note,
                createdDate: moment(createdDate).format('YYYY-MM-DD'),
                qrCodes,
                batchNum,
                startNum: replaceComma(numberFrom, ''),
                endNum: replaceComma(numberTo, ''),
                stampRangeId,
                categoryId: batchCategoryId,
                content2,
            },
            res => {
                if (res.status && res.status == 200) {
                    _Toast.success(
                        'Thông báo',
                        'Sửa lô hàng thành công',
                        null,
                        true,
                        {},
                        this.toastRef,
                    );

                    const timeOut = setTimeout(() => {
                        this.props.navigation.goBack();

                        clearTimeout(timeOut);
                    }, 500);
                } else {
                    const message = getErrorMessageServer(res);

                    _Toast.error(
                        'Thông báo',
                        message || 'Sửa lô hàng thất bại',
                        null,
                        true,
                        {},
                        this.toastRef,
                    );
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        isVisible: false,
                    };
                });
            },
        );
    };

    onChangeValue = name => value => {
        if (name == 'quantity' || name == 'numberTo' || name == 'numberFrom') {
            value = replaceComma(value, '');
        }
        this.setState(previousState => {
            return {
                ...previousState,
                [name]:
                    name == 'quantity' || name == 'numberTo' || name == 'numberFrom'
                        ? numberWithCommas(value, ',')
                        : value,
            };
        });

        if (name == 'numberFrom') {
            const number = Number(value) + Number(this.state.batchNum);
            this.setState(previousState => {
            return {
                ...previousState,
                numberTo: numberWithCommas(number, '')
            };
        });
        }
    };

    onDelete = () => {
        const { id } = this.state;

        if (!id) {
            _Toast.error('Thông báo', 'Lô hàng không tồn tại');

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

                this.props.ConsignmentOperations.deleteConsignment({ id }, res => {
                    if (res.status == 200) {
                        _Toast.success('Thông báo', 'Xóa lô hàng thành công');

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

                        _Toast.error('Thông báo', message || 'Xóa lô hàng thất bại');
                    }
                });
            }
        }, this.refFormDelete);
    };

    onPopupStampingForm = () => {
        ModalSelect.open(
            this.onChangeStampingForm,
            STAMPING_FORMS,
            this.state.stampingId,
            { value: 'ID', label: 'ProductName' },
            'Chọn hình thức dán tem',
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

    onChangeStampingForm = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                stampingId: item.key,
                stampingName: item.display,
            };
        });
    };

    onScanQRCode = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.scan, {
            onScan: data => this.onScan(data),
        });
    };

    onScanAddQRCode = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.scan, {
            onScan: data => this.onAddQRCode(data),
        });
    };
    onAddStampRange = () => {
        const {
            traceId,
            stampRangeName,
            numberFrom,
            numberTo,
            startNum,
            endNum,
            batchNum,
            productCode,
            companyCode,
        } = this.state;
        let _numberFrom = Number(replaceComma(numberFrom, ''));
        let _numberTo = Number(replaceComma(numberTo, ''));

        if (!stampRangeName) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng chọn dải tem!',
                null,
                true,
                {},
                this.toastRef,
            );
            return;
        }
        if (!numberFrom || !numberTo) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập số từ/đến của dải tem!',
                null,
                true,
                {},
                this.toastRef,
            );
            return;
        }
        if (
            _numberFrom < startNum ||
            _numberFrom > endNum ||
            _numberTo < startNum ||
            _numberTo > endNum
        ) {
            _Toast.error(
                'Thông báo',
                'Ngoài phạm vi của dải tem!',
                null,
                true,
                {},
                this.toastRef,
            );
            return;
        }
        let newListQRCodes = [];
        for (let i = _numberFrom; i <= _numberTo; i++) {
            let name = companyCode + i.toString().padStart(10, '0');
            newListQRCodes.push({
                id: Guid.create().toString(),
                name,
            });
        }
        this.setState(previousState => {
            return {
                ...previousState,
                listQRCodes: newListQRCodes,
            };
        });
    };

    onAddQRCode = data => {
        const { ConsignmentOperations } = this.props;

        const qrCode = data.data || '';

        let _qrCode = '';

        if (qrCode.indexOf('http') > -1 || stampId.indexOf('https') > -1) {
            _qrCode = getParameterUrlByName(qrCode, 'qr');
        }

        if (!_qrCode) {
            _Toast.error('Thông báo', 'Mã QR không hợp lệ');

            return;
        }

        ConsignmentOperations.checkValidIdStamp(JSON.stringify([_qrCode]), res => {
            if (res.status != 200) {
                _Toast.error(
                    'Thông báo',
                    'Mã tem không hợp lệ',
                    null,
                    true,
                    {},
                    this.toastRef,
                );
            } else {
                const isCheck = ((res.data || {}).data || {}).isCheck;

                if (!isCheck) {
                    const qrCodeStampUsed =
                        ((res.data || {}).data || {}).qrCodeStampUsed || [];

                    if (qrCodeStampUsed.length > 0) {
                        _Toast.error(
                            'Thông báo',
                            'Mã tem đã được sử dụng',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );
                    } else {
                        _Toast.error(
                            'Thông báo',
                            'Mã tem không hợp lệ',
                            null,
                            true,
                            {},
                            this.toastRef,
                        );
                    }

                    return;
                }

                const newListQRCodes = [...this.state.listQRCodes];

                newListQRCodes.push({
                    id: Guid.create().toString(),
                    name: _qrCode,
                });

                this.setState(previousState => {
                    return {
                        ...previousState,
                        listQRCodes: newListQRCodes,
                    };
                });
            }
        });
    };
    onRemoveQRCode = id => () => {
        let temp = [...this.state.listQRCodes];
        let listQRCodes = temp.filter(item => item.id != id);
        this.setState(previousState => {
            return {
                ...previousState,
                listQRCodes,
            };
        });
    };
    onScan = data => {
        this.setState(previousState => {
            return {
                ...previousState,
                qrCode: getParameterUrlByName((data || {}).data || '', 'qr'),
            };
        });
    };

    onPopupIndividual = () => {
        const { individuals, individualId, fieldId, productId, plantingZoneId } =
            this.state;

        ModalSelect.open(
            this.onChangeIndividual,
            individuals,
            individualId,
            { value: 'ID', label: 'Name' },
            'Chọn cá thể',
            'Tìm kiếm',
            false,
            null,
            null,
            [],
            (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                return (
                    <TouchableOpacity
                        activeOpacity={item.isDisable ? 1 : 0.8}
                        onPress={item.isDisable ? null : this.onChangeIndividual(item)}
                        key={item.ID}
                        style={[
                            styleRow,
                            item.isDisable
                                ? styleDisable
                                : item.ID == individualId
                                    ? styleActive
                                    : {},
                        ]}>
                        <Text style={styleRowText}>
                            {item.Name} - {item.Code}
                        </Text>
                    </TouchableOpacity>
                );
            },
            null,
            true,
            search =>
                this.getListIndividualComboBox(
                    search,
                    fieldId,
                    productId,
                    plantingZoneId,
                ),
            null,
            this.refModalSelect,
        );
    };

    onChangeIndividual = item => () => {
        ModalSelect.close();

        this.setState(previousState => {
            return {
                ...previousState,
                individualId: item.ID,
                individualName: item.Name + ' - ' + item.Code,
            };
        });
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

    onPopupTrace = () => {
        const { traceInformId, traces } = this.state;

        if (this.refModalSelect) {
            this.refModalSelect.init(
                this.onChangeTrace,
                traces,
                traceInformId,
                { value: 'TraceInformID', label: 'Name' },
                'Chọn nhật ký',
                'Tìm kiếm',
                false,
                null,
                [],
                null,
                (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={item.isDisable ? 1 : 0.8}
                            onPress={item.isDisable ? null : this.onChangeTrace(item)}
                            key={index}
                            style={[
                                styleRow,
                                item.isDisable
                                    ? styleDisable
                                    : item.TraceInformID == traceInformId
                                        ? styleActive
                                        : {},
                            ]}>
                            <Text style={styleRowText}>{item.Name}</Text>
                        </TouchableOpacity>
                    );
                },
            );

            const timeOut = setTimeout(() => {
                this.refModalSelect.show();

                clearTimeout(timeOut);
            }, 100);
        } else {
            ModalSelect.open(
                this.onChangeTrace,
                traces,
                traceId,
                { value: 'TraceInformID', label: 'Name' },
                'Chọn nhật ký',
                'Tìm kiếm',
                false,
                null,
                null,
                [],
                (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={item.isDisable ? 1 : 0.8}
                            onPress={item.isDisable ? null : this.onChangeTrace(item)}
                            key={index}
                            style={[
                                styleRow,
                                item.isDisable
                                    ? styleDisable
                                    : item.TraceInformID == traceInformId
                                        ? styleActive
                                        : {},
                            ]}>
                            <Text style={styleRowText}>{item.Name}</Text>
                        </TouchableOpacity>
                    );
                },
                null,
                null,
                null,
                null,
                null,
                this.refModalSelect,
            );
        }
    };

    onChangeTrace = data => () => {
        ModalSelect.close();

        const id = data.ID;
        const name = data.Name;
        const isHaveItem = data.HaveItem;
        const fieldId = data.FieldID;
        const productId = data.ProductID;
        const fieldType = data.FieldType;
        const traceInformId = data.TraceInformID;
        const productName = data.ProductName;
        const quantityRemain = data.QuantityRemain;
        const quantity = data.QuantityRemain;
        const productCode = data.ProductCode;

        let isShowPlantingZone = true;

        // if (FIELD_TYPES.chanNuoi == fieldType || FIELD_TYPES.trongTrot == fieldType) {
        //     isShowPlantingZone = true;
        // }

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    traceId: id,
                    traceName: name,
                    fieldId,
                    productId,
                    isHaveItem,
                    isShowPlantingZone,
                    traceInformId,
                    productName,
                    quantityRemain,
                    // quantity,
                    productCode,
                };
            },
            () => {
                this.getListPlantingZoneComboBox(this.state.traceInformId);

                this.getItemNameByTraceInform(this.state.traceInformId);

                this.getUnitNameByTraceInform(this.state.traceInformId);

                // this.getListUnitComboBox(productId);
            },
        );
    };

    onPopupWarehouse = () => {
        const { warehouses } = this.state;
        if (this.refModalSelect) {
            this.refModalSelect.init(
                this.onChangeWarehouse,
                warehouses,
                this.state.wareHouseId,
                { value: 'ID', label: 'name' },
                'Chọn kho hàng',
                'Tìm kiếm',
            );

            const timeOut = setTimeout(() => {
                this.refModalSelect.show();

                clearTimeout(timeOut);
            }, 100);
        } else {
            ModalSelect.open(
                this.onChangeWarehouse,
                warehouses,
                this.state.wareHouseId,
                { value: 'ID', label: 'name' },
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
            );
        }
    };

    onChangeWarehouse = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                wareHouseId: item.id,
                wareHouseName: item.name,
            };
        });
    };

    onConfirm = () => {
        const { navigation, ConsignmentOperations } = this.props;
        const { wareHouseId, id } = this.state;
        return new Promise(resolve => {
            if (!wareHouseId) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn kho hàng');

                resolve(false);

                return;
            }

            FormQuestion.open(
                result => {
                    if (result.result) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                isVisible: true,
                            };
                        });

                        ConsignmentOperations.confirm({ id, wareHouseId }, res => {
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    isVisible: false,
                                };
                            });
                            if (res.status == 200) {
                                _Toast.success('Thông báo', 'Duyệt lô hàng thành công');

                                setTimeout(() => {
                                    navigation.goBack();
                                }, 500);

                                resolve(true);
                            } else {
                                const message = getErrorMessageServer(res);

                                _Toast.error('Thông báo', message || 'Duyệt lô hàng thất bại');

                                this.setState(previousState => {
                                    return {
                                        ...previousState,
                                        isVisible: false,
                                    };
                                });

                                resolve(false);
                            }
                        });
                    } else {
                        resolve(false);
                    }
                },
                'THÔNG BÁO',
                'Bạn có chắc chắn muốn duyệt lô hàng này ?',
                this.refFormQuestion,
            );
        });
    };

    onUnConfirm = () => {
        const { navigation, ConsignmentOperations } = this.props;
        const { reason, id, contentRemake, isReUsed } = this.state;
        let type = isReUsed ? 1 : 0;
        return new Promise(resolve => {
            if (!reason) {
                _Toast.error('Thông báo', 'Bạn vui lòng nhập lý do');

                resolve(false);

                return;
            }
            if (!contentRemake) {
                _Toast.error(
                    'Thông báo',
                    'Bạn vui lòng nhập nội dung cần thực hiện lại',
                );

                resolve(false);

                return;
            }
            FormQuestion.open(
                result => {
                    if (result.result) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                isVisible: true,
                            };
                        });

                        ConsignmentOperations.unConfirm(
                            { id, reason, content1: contentRemake, type },
                            res => {
                                this.setState(previousState => {
                                    return {
                                        ...previousState,
                                        isVisible: false,
                                    };
                                });
                                if (res.status == 200) {
                                    _Toast.success('Thông báo', 'Không duyệt thành công');

                                    setTimeout(() => {
                                        navigation.goBack();
                                    }, 500);

                                    resolve(true);
                                } else {
                                    const message = getErrorMessageServer(res);

                                    _Toast.error('Thông báo', message || 'Không duyệt thất bại');

                                    this.setState(previousState => {
                                        return {
                                            ...previousState,
                                            isVisible: false,
                                        };
                                    });

                                    resolve(false);
                                }
                            },
                        );
                    } else {
                        resolve(false);
                    }
                },
                'THÔNG BÁO',
                'Bạn có chắc chắn không duyệt lô hàng này?',
                this.refFormQuestion,
            );
        });
    };

    onPopupStampRange = () => {
        const { stampRanges, stampRangeId } = this.state;
        ModalSelect.open(
            this.onChangeStampRange,
            stampRanges,
            stampRangeId,
            { value: 'id', label: 'name' },
            'Chọn dải tem',
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

    onChangeStampRange = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                stampRangeId: item.id,
                stampRangeName: item.name,
                startNum: item.startNum,
                endNum: item.endNum,
                numberFrom: '',
                numberTo: '',
            };
        });
    };

    onSelectCheckbox = value => {
        this.setState(previousState => {
            return {
                ...previousState,
                isReUsed: value,
            };
        });
    };

    onPopupBatchCategory = () => {
        const { batchCategories, batchCategoryId } = this.state;

        ModalSelect.open(
            this.onChangeBatchCategory,
            batchCategories,
            batchCategoryId,
            { value: 'id', label: 'description' },
            'Chọn phân loại',
            'Tìm kiếm',
            false,
            null,
            [],
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

    onChangeBatchCategory = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                batchCategoryId: item.id,
                batchCategoryDescription: item.description,
            };
        });
    };

    onViewDiary = () => {
        const { traceId } = this.state;

        if (!traceId) {
            _Toast.error('Thông báo', 'Không có nhật ký để xem');

            return;
        }

        this.props.navigation.navigate(KEY_NAVIGATIONS.detailDiary, {
            id: traceId
        })
    }

    onCheckExportType = exportType => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                exportType,
                batchExports: [],
                residentName: ''
            };
        });
    };

    onPopupResident = () => {
        const { exportType, provinces, nations } = this.state;

        ModalSelect.open(
            null,
            exportType == 0 ? provinces : nations,
            null,
            { value: 'id', label: exportType == 0 ? 'provinceName' : 'nationName' },
            exportType == 0 ? 'Chọn danh sách tỉnh/thành' : 'Chọn danh sách nước',
            'Tìm kiếm',
            true,
            this.onAcceptResident,
            this.state.batchExports,
            null,
            null,
            null,
            null,
            null,
            this.refModalSelect,
        );
    }

    onAcceptResident = items => {
        this.setState(previousState => {
            return {
                ...previousState,
                batchExports: items,
                residentName: items.map(p => p.provinceName || p.nationName).join(',')
            };
        });
    }

    render() {
        const {
            id,
            // isShowConfirm,
            // isShowUnConfirm,
            wareHouseName,
            reason,
            productName,
            isHaveItem,
            traceName,
            qrCode,
            plantingZoneName,
            unitName,
            quantity,
            note,
            isVisible,
            individualName,
            files,
            batchNum,
            batchCode,
            createdDate,
            listQRCodes,
            isScan,
            stampRangeName,
            numberFrom,
            numberTo,
            status,
            confirmBatch,
            isReUsed,
            batchCategoryDescription,
            confirmedReason,
            confirmedByName,
            confirmedDate,
            isReused,
            content1,
            content2,
            traceId,
            contentRemake,
            exportType,
            residentName
        } = this.state;
        const { ConsignmentReducer } = this.props;

        let plantingZones = [];

        if (
            ConsignmentReducer.get(consignmentConstant.KEYS.plantingZoneComboBoxs)
                .toJS
        ) {
            plantingZones = ConsignmentReducer.get(
                consignmentConstant.KEYS.plantingZoneComboBoxs,
            ).toJS();
        }
        let disable = id ? true : false;

        let checkStatusUnconfirm = status == 3;

        let disableStatusUnconfirm = checkStatusUnconfirm ? false : disable;

        let isShowConfirm =
            (confirmBatch && status == 1) || (confirmBatch && status == 4);

        const CustomCheckbox = ({ value, title, isReUse }) => {
            let styleTrue = {
                backgroundColor: isReUsed ? COLORS.primary : COLORS.white,
            };
            let styleFalse = {
                backgroundColor: isReUsed ? COLORS.white : COLORS.primary,
            };
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={style.checkbox}
                    onPress={() => this.onSelectCheckbox(value)}>
                    <View style={style.outCheckbox}>
                        <View
                            style={[style.inCheckbox, isReUse ? styleTrue : styleFalse]}
                        />
                    </View>
                    <Text>{title}</Text>
                </TouchableOpacity>
            );
        };

        return (
            <BoxMainContainer
                datePickerSetRef={this.datePickerSetRef}
                formDeleteSetRef={this.formDeleteSetRef}
                modalSelectSetRef={this.modalSelectSetRef}
                formQuestionSetRef={this.formQuestionSetRef}
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
                <View style={style.header}>
                    <Text style={style.title}>{id ? 'LÔ HÀNG' : 'TẠO LÔ HÀNG'}</Text>
                    {(id && traceId) ? <TouchableOpacity activeOpacity={0.8} delayPressIn={0} onPress={this.onViewDiary} style={style.headerViewDiaryButton}>
                        <ICONS.clock_2 style={style.headerViewDiaryButtonIcon} />
                        <Text style={style.headerViewDiaryButtonTitle}>Xem nhật ký</Text>
                    </TouchableOpacity> : null}
                </View>
                <View style={style.body}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="handled"
                        style={style.form}>
                        {/* <View style={style.formItem}>
                        <Text style={style.formItemLabel}>Lô hàng</Text>
                        <TextInput onChangeText={this.onChangeValue('name')} value={name} maxLength={255} onSubmitEditing={this.onNextInputQuantity} blurOnSubmit={false} returnKeyType='next' returnKeyLabel='Tiếp tục' style={style.formItemInput} />
                    </View> */}
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Mã lô hàng</Text>
                            <TextInput
                                editable={false}
                                value={batchCode}
                                style={[style.formItemInput, style.formItemInputDisable]}
                            />
                        </View>
                        <View style={style.formItemMulti}>
                            <View style={style.formItemMultiItem}>
                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Số lô hàng</Text>
                                <TextInput
                                    value={batchNum}
                                    style={[
                                        style.formItemInput,
                                        disableStatusUnconfirm ? style.formItemInputDisable : null,
                                    ]}
                                    onChangeText={this.onChangeValue('batchNum')}
                                    onSubmitEditing={this.onNextInputQuantity}
                                    blurOnSubmit={false}
                                    returnKeyType="next"
                                    returnKeyLabel="Tiếp tục"
                                    editable={!disableStatusUnconfirm}
                                />
                            </View>
                            <View style={style.formItemMultiItem}>
                                <Text style={style.formItemLabel}>Ngày tạo</Text>
                                <TextInput
                                    editable={false}
                                    value={
                                        createdDate ? moment(createdDate).format('DD/MM/YYYY') : ''
                                    }
                                    style={[style.formItemInput, style.formItemInputDisable]}
                                />
                            </View>
                        </View>
                        <View style={style.formItem}>
                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Từ nhật ký</Text>
                            <TouchableOpacity
                                disabled={disable}
                                onPress={this.onPopupTrace}
                                activeOpacity={0.8}
                                style={[
                                    style.formItemSelect,
                                    disable ? style.formItemInputDisable : null,
                                ]}>
                                <Text style={style.formItemSelectText}>{traceName}</Text>
                                {!disable && (
                                    <View style={style.formItemSelectIcon}>
                                        <ICONS.caretDown2 width={16} height={16} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        {/* {isShowPlantingZone && <View style={style.formItem}>
                        <Text style={style.formItemLabel}>Vị trí</Text>
                        <TouchableOpacity onPress={this.onPopupPlantingZone} activeOpacity={0.8} style={style.formItemSelect}>
                            <Text style={style.formItemSelectText}>{plantingZoneName}</Text>
                            <View style={style.formItemSelectIcon}>
                                <ICONS.caretDown2 width={16} height={16} />
                            </View>
                        </TouchableOpacity>
                    </View>} */}
                        {plantingZones.length <= 0 ? null : (
                            <View style={style.formItem}>
                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Vị trí</Text>
                                {plantingZones.length == 1 ? (
                                    <TextInput
                                        editable={false}
                                        value={plantingZoneName}
                                        style={[style.formItemInput, style.formItemInputDisable]}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        disabled={disable}
                                        onPress={this.onPopupPlantingZone}
                                        activeOpacity={0.8}
                                        style={[
                                            style.formItemSelect,
                                            disable ? style.formItemInputDisable : null,
                                        ]}>
                                        <Text style={style.formItemSelectText}>
                                            {plantingZoneName}
                                        </Text>
                                        {!disable && (
                                            <View style={style.formItemSelectIcon}>
                                                <ICONS.caretDown2 width={16} height={16} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        {isHaveItem ? (
                            <View style={style.formItem}>
                                <Text style={style.formItemLabel}>Cá thể</Text>
                                <TextInput
                                    editable={false}
                                    value={individualName}
                                    style={[style.formItemInput, style.formItemInputDisable]}
                                />
                            </View>
                        ) : null}
                        <View style={style.formItem}>
                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Sản phẩm</Text>
                            <TextInput
                                editable={false}
                                value={productName}
                                style={[style.formItemInput, style.formItemInputDisable]}
                            />
                        </View>
                        <View style={style.formItemMulti}>
                            <View style={style.formItemMultiItem}>
                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Số lượng</Text>
                                <TextInput
                                    editable={!disableStatusUnconfirm}
                                    onChangeText={this.onChangeValue('quantity')}
                                    value={quantity}
                                    keyboardType="number-pad"
                                    onSubmitEditing={this.onNextInputNote}
                                    maxLength={255}
                                    ref={input => (this.inputQuantity = input)}
                                    blurOnSubmit={false}
                                    returnKeyType="next"
                                    returnKeyLabel="Tiếp tục"
                                    style={[
                                        style.formItemInput,
                                        disableStatusUnconfirm ? style.formItemInputDisable : null,
                                    ]}
                                />
                            </View>
                            <View style={style.formItemMultiItem}>
                                <Text style={style.formItemLabel}>Đơn vị tính</Text>
                                <TextInput
                                    editable={false}
                                    value={unitName}
                                    keyboardType="number-pad"
                                    style={[style.formItemInput, style.formItemInputDisable]}
                                />
                            </View>
                        </View>
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Phân loại</Text>
                            <TouchableOpacity
                                disabled={disableStatusUnconfirm}
                                onPress={this.onPopupBatchCategory}
                                activeOpacity={0.8}
                                style={[
                                    style.formItemSelect,
                                    disableStatusUnconfirm ? style.formItemInputDisable : null,
                                ]}>
                                <Text style={style.formItemSelectText}>
                                    {batchCategoryDescription}
                                </Text>
                                {!disableStatusUnconfirm && (
                                    <View style={style.formItemSelectIcon}>
                                        <ICONS.caretDown2 width={16} height={16} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        {/* <View style={style.formItem}>
              <Text style={style.formItemLabel}>Mã QR</Text>
              <View style={style.formItemQRCode}>
                <TextInput
                  onChangeText={this.onChangeValue('qrCode')}
                  value={qrCode}
                  maxLength={255}
                  onSubmitEditing={this.onNextInputNote}
                  ref={ref => (this.inputQRCode = ref)}
                  blurOnSubmit={false}
                  style={[
                    style.formItemQRCodeInput,
                    disable ? style.formItemInputDisable : null,
                  ]}
                  returnKeyType="next"
                  returnKeyLabel="Tiếp tục"
                />
                {!disable && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    delayPressIn={0}
                    onPress={this.onScanQRCode}>
                    <ICONS.qrCodeBlue
                      // style={style.formItemQRCodeIcon}
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View> */}
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Ghi chú</Text>
                            <TextInput
                                editable={!disableStatusUnconfirm}
                                multiline={true}
                                ref={input => (this.inputNote = input)}
                                onChangeText={this.onChangeValue('note')}
                                value={note}
                                maxLength={255}
                                blurOnSubmit={false}
                                style={[
                                    style.formItemTextarea,
                                    disableStatusUnconfirm ? style.formItemInputDisable : null,
                                ]}
                                onSubmitEditing={this.onNextInputNumberFrom}
                                returnKeyType="next"
                                returnKeyLabel="Tiếp tục"
                            />
                        </View>
                        {/* Thanh */}
                        {isScan ? null : (
                            <>
                                {!id && (
                                    <>
                                        <View style={style.formItem}>
                                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Chọn dải tem</Text>
                                            <TouchableOpacity
                                                disabled={disable}
                                                onPress={this.onPopupStampRange}
                                                activeOpacity={0.8}
                                                style={[
                                                    style.formItemSelect,
                                                    disable ? style.formItemInputDisable : null,
                                                ]}>
                                                <Text style={style.formItemSelectText}>
                                                    {stampRangeName ? stampRangeName : ''}
                                                </Text>
                                                {!disable && (
                                                    <View style={style.formItemSelectIcon}>
                                                        <ICONS.caretDown2 width={16} height={16} />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={style.formItemMulti}>
                                            <View style={style.formItemMultiItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>
                                                    {id ? 'Dải tem từ' : 'Từ'}
                                                </Text>
                                                <TextInput
                                                    editable={!disable}
                                                    onChangeText={this.onChangeValue('numberFrom')}
                                                    value={numberFrom}
                                                    keyboardType="number-pad"
                                                    onSubmitEditing={this.onNextInputNumberTo}
                                                    maxLength={255}
                                                    ref={input => (this.inputNumberFrom = input)}
                                                    blurOnSubmit={false}
                                                    returnKeyType="next"
                                                    returnKeyLabel="Tiếp tục"
                                                    style={[
                                                        style.formItemInput,
                                                        disable ? style.formItemInputDisable : null,
                                                    ]}
                                                />
                                            </View>
                                            <View style={style.formItemMultiItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Đến</Text>
                                                <TextInput
                                                    editable={!disable}
                                                    onChangeText={this.onChangeValue('numberTo')}
                                                    value={numberTo}
                                                    keyboardType="number-pad"
                                                    maxLength={255}
                                                    ref={input => (this.inputNumberTo = input)}
                                                    blurOnSubmit={false}
                                                    style={[
                                                        style.formItemInput,
                                                        disable ? style.formItemInputDisable : null,
                                                    ]}
                                                    onSubmitEditing={this.onAdd}
                                                    returnKeyType="done"
                                                    returnKeyLabel="Xong"
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}
                            </>
                        )}
                        {isScan ? null : (
                            <>
                                {checkStatusUnconfirm && !isReused && (
                                    <>
                                        <View style={style.formItem}>
                                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Chọn dải tem</Text>
                                            <TouchableOpacity
                                                onPress={this.onPopupStampRange}
                                                activeOpacity={0.8}
                                                style={[style.formItemSelect]}>
                                                <Text style={style.formItemSelectText}>
                                                    {stampRangeName ? stampRangeName : ''}
                                                </Text>

                                                <View style={style.formItemSelectIcon}>
                                                    <ICONS.caretDown2 width={16} height={16} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={style.formItemMulti}>
                                            <View style={style.formItemMultiItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Từ</Text>
                                                <TextInput
                                                    onChangeText={this.onChangeValue('numberFrom')}
                                                    value={numberFrom}
                                                    keyboardType="number-pad"
                                                    onSubmitEditing={this.onNextInputNumberTo}
                                                    maxLength={255}
                                                    ref={input => (this.inputNumberFrom = input)}
                                                    blurOnSubmit={false}
                                                    returnKeyType="next"
                                                    returnKeyLabel="Tiếp tục"
                                                    style={[style.formItemInput]}
                                                />
                                            </View>
                                            <View style={style.formItemMultiItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Đến</Text>
                                                <TextInput
                                                    onChangeText={this.onChangeValue('numberTo')}
                                                    value={numberTo}
                                                    keyboardType="number-pad"
                                                    maxLength={255}
                                                    ref={input => (this.inputNumberTo = input)}
                                                    blurOnSubmit={false}
                                                    style={[style.formItemInput]}
                                                    onSubmitEditing={this.onAdd}
                                                    returnKeyType="done"
                                                    returnKeyLabel="Xong"
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}
                            </>
                        )}
                        {/* {id != '' && !isScan  ? (
              <View style={style.formItemMulti}>
                <View style={style.formItemMultiItem}>
                  <Text style={style.formItemLabel}>Dải tem từ</Text>
                  <TextInput
                    editable={!disable}
                    onChangeText={this.onChangeValue('numberFrom')}
                    value={numberFrom}
                    keyboardType="number-pad"
                    onSubmitEditing={this.onNextInputNumberTo}
                    maxLength={255}
                    ref={input => (this.inputNumberFrom = input)}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    returnKeyLabel="Tiếp tục"
                    style={[
                      style.formItemInput,
                      disable ? style.formItemInputDisable : null,
                    ]}
                  />
                </View>
                <View style={style.formItemMultiItem}>
                  <Text style={style.formItemLabel}>Đến</Text>
                  <TextInput
                    editable={!disable}
                    onChangeText={this.onChangeValue('numberTo')}
                    value={numberTo}
                    keyboardType="number-pad"
                    maxLength={255}
                    ref={input => (this.inputNumberTo = input)}
                    blurOnSubmit={false}
                    style={[
                      style.formItemInput,
                      disable ? style.formItemInputDisable : null,
                    ]}
                    onSubmitEditing={this.onAdd}
                    returnKeyType="done"
                    returnKeyLabel="Xong"
                  />
                </View>
              </View>
            ) : null} */}
                        <View style={style.formItemFile}>
                            <Text style={[style.formItemFileLabel, style.formItemLabelRequired]}>Danh sách mã QR</Text>

                            {!disable && (
                                <TouchableOpacity
                                    onPress={isScan ? this.onScanAddQRCode : this.onAddStampRange}
                                    activeOpacity={0.8}
                                    style={style.formItemFileAddButton}>
                                    {isScan ? (
                                        <ICONS.qrCode width={16} height={16} />
                                    ) : (
                                        <ICONS.add width={16} height={16} />
                                    )}
                                </TouchableOpacity>
                            )}

                            {checkStatusUnconfirm && !isReused && (
                                <TouchableOpacity
                                    onPress={isScan ? this.onScanAddQRCode : this.onAddStampRange}
                                    activeOpacity={0.8}
                                    style={style.formItemFileAddButton}>
                                    {isScan ? (
                                        <ICONS.qrCode width={16} height={16} />
                                    ) : (
                                        <ICONS.add width={16} height={16} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* Thanh */}
                        <View
                            style={[
                                style.contentQR,
                                {
                                    height: listQRCodes.length > 0 ? null : 75,
                                },
                            ]}>
                            {listQRCodes.map(item => {
                                return (
                                    <View key={item.id}>
                                        <View style={style.itemQR}>
                                            <Text style={style.txtItemQR}>{item.name}</Text>
                                        </View>
                                        {!disable && isScan && (
                                            <TouchableOpacity
                                                style={style.closeButton}
                                                activeOpacity={0.8}
                                                onPress={this.onRemoveQRCode(item.id)}>
                                                <ICONS.close width={10} height={10} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                        <View style={style.formItem}>
                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Thị trường</Text>
                            <View style={style.formItemCheck}>
                                <TouchableOpacity
                                    disabled={disable}
                                    onPress={this.onCheckExportType(0)}
                                    activeOpacity={0.8}
                                    style={style.formItemCheckItem}>
                                    <View
                                        style={[
                                            style.formItemCheckItemCheck,
                                            exportType == 0 ? style.formItemCheckItemCheckActive : {},
                                        ]}>
                                        <View
                                            style={[
                                                style.formItemCheckItemCheckCircle,
                                                exportType == 0 ? style.formItemCheckItemCheckCircleActive : {},
                                            ]}></View>
                                    </View>
                                    <Text style={style.formItemCheckItemText}>Trong nước</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={disable}
                                    onPress={this.onCheckExportType(1)}
                                    activeOpacity={0.8}
                                    style={style.formItemCheckItem}>
                                    <View
                                        style={[
                                            style.formItemCheckItemCheck,
                                            exportType == 1 ? style.formItemCheckItemCheckActive : {},
                                        ]}>
                                        <View
                                            style={[
                                                style.formItemCheckItemCheckCircle,
                                                exportType == 1 ? style.formItemCheckItemCheckCircleActive : {},
                                            ]}></View>
                                    </View>
                                    <Text style={style.formItemCheckItemText}>Nước ngoài</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                disabled={disable}
                                onPress={this.onPopupResident}
                                activeOpacity={0.8}
                                style={[
                                    style.formItemSelect,
                                    disable ? style.formItemInputDisable : {},
                                ]}>
                                <Text style={style.formItemSelectText}>{residentName || (exportType == 0 ? 'Chọn danh sách tỉnh/thành' : 'Chọn danh sách nước')}</Text>
                                <View style={style.formItemSelectIcon}>
                                    <ICONS.caretDown2 width={16} height={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {disableStatusUnconfirm && (
                            <View style={style.formItemFile}>
                                <Text style={style.formItemFileLabel}>Chứng từ liên quan</Text>
                            </View>
                        )}
                        <FileUpload
                            files={files}
                            setFiles={this.setFiles}
                            onChooseFile={this.onChooseFile}
                            onRemoveFile={this.onRemoveFile}
                            isHide={disableStatusUnconfirm}
                        />
                        {status == 3 || status == 4 ? (
                            <>
                                <View style={style.formItemFile}>
                                    <Text style={style.formItemFileLabel}>
                                        Thông tin kiểm duyệt
                                    </Text>
                                </View>
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>Lý do không duyệt</Text>
                                    <TextInput
                                        editable={false}
                                        multiline={true}
                                        // ref={input => (this.inputNote = input)}
                                        // onChangeText={this.onChangeValue('reasonUnConfirm')}
                                        value={confirmedReason}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        style={[style.formItemTextarea, style.formItemInputDisable]}
                                        // onSubmitEditing={this.onNextInputNumberFrom}
                                        returnKeyType="next"
                                        returnKeyLabel="Tiếp tục"
                                    />
                                </View>
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>
                                        Nội dung cần thực hiện lại
                                    </Text>
                                    <TextInput
                                        editable={false}
                                        multiline={true}
                                        // ref={input => (this.inputNote = input)}
                                        // onChangeText={this.onChangeValue('contentNeedRemake')}
                                        value={content1}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        style={[style.formItemTextarea, style.formItemInputDisable]}
                                        // onSubmitEditing={this.onNextInputNumberFrom}
                                        returnKeyType="next"
                                        returnKeyLabel="Tiếp tục"
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
                                        <View style={style.formItem}>
                                            <Text style={style.formItemLabel}>
                                                Ghi chú:{' '}
                                                <Text
                                                    style={[style.formItemLabel, style.formItemLabelRed]}>
                                                    {isReused
                                                        ? 'Sử dụng lại tem'
                                                        : 'Không sử dụng lại tem'}
                                                </Text>
                                            </Text>
                                        </View>
                                    </>
                                )}
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>
                                        Nội dung đã thực hiện lại
                                    </Text>
                                    <TextInput
                                        multiline={true}
                                        editable={status == 4 ? false : true}
                                        // ref={input => (this.inputNote = input)}
                                        onChangeText={this.onChangeValue('content2')}
                                        value={content2}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        style={[
                                            style.formItemTextarea,
                                            status == 4 ? style.formItemInputDisable : {},
                                        ]}
                                        // onSubmitEditing={this.onNextInputNumberFrom}
                                        returnKeyType="next"
                                        returnKeyLabel="Tiếp tục"
                                    />
                                </View>
                            </>
                        ) : null}
                    </KeyboardAwareScrollView>
                </View>
                <View style={style.function}>
                    {!id ? (
                        <TouchableOpacity
                            onPress={this.onAdd}
                            activeOpacity={0.8}
                            style={style.functionUpdate}>
                            <ICONS.save width={18} height={18} />
                            <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                        </TouchableOpacity>
                    ) : null}
                    {status == 3 ? (
                        <TouchableOpacity
                            onPress={this.onUpdate}
                            activeOpacity={0.8}
                            style={style.functionUpdate}>
                            <ICONS.save width={18} height={18} />
                            <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                {isShowConfirm && (
                    <View style={style.confirm}>
                        <Text style={style.formItemLabel}>Kho hàng</Text>
                        <TouchableOpacity
                            onPress={this.onPopupWarehouse}
                            activeOpacity={0.8}
                            style={style.formItemSelect}>
                            <Text style={style.formItemSelectText}>{wareHouseName}</Text>
                            <View style={style.formItemSelectIcon}>
                                <ICONS.caretDown2 width={16} height={16} />
                            </View>
                        </TouchableOpacity>
                        <AuthenticateView claims={[CLAIMS.batch.confirm]} checkType={0}>
                            <TouchableOpacity
                                onPress={this.onConfirm}
                                activeOpacity={0.8}
                                style={[
                                    style.confirmFunctionItem,
                                    style.confirmFunctionItemConfirm,
                                ]}>
                                <Text style={style.confirmFunctionItemText}>DUYỆT</Text>
                            </TouchableOpacity>
                        </AuthenticateView>
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>Lý do không duyệt</Text>
                            <TextInput
                                multiline={true}
                                onChangeText={this.onChangeValue('reason')}
                                value={reason}
                                maxLength={255}
                                style={style.formItemTextarea}
                            />
                        </View>
                        <View style={style.formItem}>
                            <Text style={style.formItemLabel}>
                                Nội dung cần thực hiện lại
                            </Text>
                            <TextInput
                                multiline={true}
                                onChangeText={this.onChangeValue('contentRemake')}
                                value={contentRemake}
                                maxLength={255}
                                style={style.formItemTextarea}
                            />
                        </View>
                        <View style={style.checkbox}>
                            <CustomCheckbox
                                title="Sử dụng lại tem"
                                isReUse={true}
                                value={true}
                            />
                            <CustomCheckbox
                                title="Không sử dụng lại tem"
                                isReUse={false}
                                value={false}
                            />
                        </View>
                        <AuthenticateView claims={[CLAIMS.batch.unConfirm]} checkType={0}>
                            <TouchableOpacity
                                onPress={this.onUnConfirm}
                                activeOpacity={0.8}
                                style={[
                                    style.confirmFunctionItem,
                                    style.confirmFunctionItemUnConfirm,
                                ]}>
                                <Text style={style.confirmFunctionItemText}>KHÔNG DUYỆT</Text>
                            </TouchableOpacity>
                        </AuthenticateView>
                    </View>
                )}
            </BoxMainContainer>
        );
    }
}

export default AddConsignment;
=======
import {ICONS} from '../../../assets/imgs';

import style from './style';

import {KEY_NAVIGATIONS, DEFAULTS, PAGINATIONS} from '../../constants/config';

import {consignmentConstant} from '../../states/consignment';

import {getErrorMessageServer} from '../../utils/errorMessageServer';

import FormQuestion from '../../components/formQuestion';

import FormDelete from '../../components/formDelete';

import DatePicker from '../../bases/controls/datePicker';

import {
  BATCH_LIST_STATUSES,
  BATCH_STATUSES,
  BATCH_STATUS_COLORS,
  BATCH_STATUS_TEXTS,
  STATUS_IMPORT_EXPORT,
} from '../../constants/data';

import ModalComponent from '../../components/modal';

class ChooseWarehouse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warehouses: [],
      warehouseId: null,
      batchId: null,
    };
  }

  componentDidMount() {
    const warehouses = [...this.props.warehouses];
    const batchId = this.props.batchId;

    this.setState(previousState => {
      return {
        ...previousState,
        warehouses,
        batchId,
      };
    });
  }

  onAccept = () => {
    const {warehouseId, batchId} = this.state;

    if (!warehouseId) {
      if (Platform.OS == 'ios') {
        Alert.alert('Thông báo', 'Bạn vui lòng chọn kho hàng');
      } else {
        ToastAndroid.show('Bạn vui lòng chọn kho hàng', ToastAndroid.SHORT);
      }

      return;
    }

    this.props.onAccept(batchId, warehouseId);
  };

  onClose = () => {
    this.props.onClose();
  };

  onChangeWarehouse = value => {
    this.setState(previousState => {
      return {
        ...previousState,
        warehouseId: value,
      };
    });
  };

  render() {
    const {warehouses, warehouseId} = this.state;

    return (
      <View style={style.chooseWareHouse}>
        <View style={style.chooseWareHouseBody}>
          <Text style={style.chooseWareHouseLabel}>Chọn kho hàng để nhập</Text>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            placeholder={{
              label: 'Chọn kho hàng',
              inputLabel: '',
              value: null,
              ...style.filterItemSelectPlaceHolder,
            }}
            style={{
              inputIOSContainer: style.filterItemSelectContainerIOS,
              inputAndroidContainer: style.filterItemSelectContainerAndroid,
              inputAndroid: style.filterItemSelectInputAndroid,
              inputIOS: style.filterItemSelectInputIOS,
              iconContainer: style.filterItemSelectIcon,
            }}
            value={warehouseId}
            onValueChange={this.onChangeWarehouse}
            items={warehouses}
            Icon={() => <ICONS.caretDown2 width={16} height={16} />}
          />
        </View>
        <View style={style.chooseWareHouseFooter}>
          <TouchableOpacity
            delayPressIn={0}
            activeOpacity={0.8}
            onPress={this.onAccept}
            style={style.chooseWareHouseFooterAccept}>
            <Text style={style.chooseWareHouseFooterAcceptText}>Đồng ý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            delayPressIn={0}
            activeOpacity={0.8}
            onPress={this.onClose}
            style={style.chooseWareHouseFooterClose}>
            <Text style={style.chooseWareHouseFooterCloseText}>Thoát ra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ConsignmentItem extends Component {
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
    this.isLock = false;
    this.isDelete = false;
    this.isRequest = false;
  }

  // handleShowAction = item => {
  //   const {confirmBatch} = this.props;

  //   let isShowDelete = false;
  //   let isShowLocked = false;

  //   if (confirmBatch) {
  //     if (
  //       item.Status == BATCH_STATUSES.moiTao ||
  //       item.Status == BATCH_STATUSES.khongDuyet
  //     ) {
  //       isShowDelete = true;
  //     }
  //   } else {
  //     if (item.Status == BATCH_STATUSES.moiTao) {
  //       isShowDelete = true;
  //       isShowLocked = true;
  //     }
  //   }

  //   return {
  //     isShowDelete,
  //     isShowLocked,
  //   };
  // };

  onTouchStart = e => {
    this.pageXStart = e.nativeEvent.pageX;
    this.pageXEnd = 0;
    this.pageYStart = e.nativeEvent.pageY;
    this.pageYEnd = 0;
    this.increase = 0;
    this.isDelete = false;
    this.isLock = false;
    this.isRequest = false;
  };

  onTouchMove = e => {
    const pageXEndOld = this.pageXEnd;

    if (pageXEndOld != 0 && Math.abs(pageXEndOld - e.nativeEvent.pageX) <= 2) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (Math.abs(this.pageXStart - this.pageXEnd) > DEFAULTS.offSetMinSwipe) {
      const listConsignmentRef = this.props.listConsignmentRef;

      if (listConsignmentRef) {
        listConsignmentRef.setNativeProps({scrollEnabled: false});
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

  onTouchEnd = (id, plantingZoneName) => e => {
    if (this.isDelete || this.isLock || this.isRequest) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (
      Math.abs(this.pageXStart - this.pageXEnd) <=
        DEFAULTS.offSetMinSwipeEdit &&
      Math.abs(this.pageYStart - this.pageYEnd) <= DEFAULTS.offSetMinSwipeEdit
    ) {
      this.props.onEdit(id, plantingZoneName);

      this.increase = 0;
      this.pageXStart = 0;
      this.pageYStart = 0;
      this.pageYEnd = 0;
      this.pageXEnd = 0;
      this.isDelete = false;
      this.isLock = false;
      this.isRequest = false;

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
      const listConsignmentRef = this.props.listConsignmentRef;

      if (listConsignmentRef) {
        listConsignmentRef.setNativeProps({scrollEnabled: true});
      }
    });

    this.increase = 0;
    this.pageXStart = 0;
    this.pageYStart = 0;
    this.pageYEnd = 0;
    this.pageXEnd = 0;
    this.isDelete = false;
    this.isLock = false;
    this.isRequest = false;
  };

  onDelete = id => () => {
    this.isDelete = true;

    this.props.onDelete(id).then(() => {
      this.isDelete = false;
    });
  };

  onLock = item => () => {
    this.isLock = true;

    this.props.onLock(item).then(() => {
      this.isLock = false;
    });
  };

  onRequest = item => () => {
    this.isRequest = true;
    this.props.onRequest(item).then(() => {
      this.isRequest = false;
    });
  };

  render() {
    const {item, confirmBatch} = this.props;

    // const {isShowDelete, isShowLocked} = this.handleShowAction(item);

    let titleButton = STATUS_IMPORT_EXPORT[item?.Status || 0].title;
    let colorButton = STATUS_IMPORT_EXPORT[item?.Status || 0].color;
    let styleColor = {color: colorButton};
    let borderColor = {borderColor: colorButton};

    let isShowRequest = confirmBatch && item?.Status == 0;
    let isShowDelete = item?.Status == 0 || (confirmBatch && item?.Status == 3);
    let isShowLocked = !confirmBatch && item?.Status == 0;

    return (
      <View
        onTouchEnd={this.onTouchEnd(item.ID, item.PlantingZoneName)}
        onTouchMove={isShowDelete ? this.onTouchMove : null}
        onTouchStart={this.onTouchStart}
        key={item.ID}
        style={style.bodyItem}>
        <Animated.View
          style={[
            style.bodyItemAnimate,
            {
              transform: [
                {
                  translateX: this.state.animationTranslateX,
                },
              ],
            },
          ]}>
          <View style={style.bodyItemContent}>
            <View style={style.bodyItemImageWrap}>
              {item.Avatar ? (
                <Image
                  resizeMode="stretch"
                  style={style.bodyItemImage}
                  source={{uri: item.Avatar}}
                />
              ) : (
                <Image
                  resizeMode="stretch"
                  style={style.bodyItemImage}
                  source={ICONS.noImage}
                />
              )}
            </View>
            <View style={style.bodyItemInfoWrap}>
              <View style={style.bodyItemInfoWrapContent}>
                <View style={style.bodyItemInfo}>
                  <Text style={style.bodyItemInfoName}>
                    Số lô: {item.BatchNum}
                  </Text>
                  <Text style={style.bodyItemInfoProductName}>
                    {item.ProductName}
                  </Text>
                  <View style={style.bodyItemDescription}>
                    <Text
                      numberOfLines={1}
                      style={style.bodyItemInfoDescription}></Text>
                    <Text
                      numberOfLines={1}
                      style={style.bodyItemInfoDescription}>
                      {item.Quantity || 0} {item.UnitName}
                      {item.PlantingZoneName
                        ? ` - ${item.PlantingZoneName}`
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={style.bodyItemInfoWrapStatus}>
                <View style={[style.borderButton, {...borderColor}]}>
                  <Text style={[style.titleButton, {...styleColor}]}>
                    {titleButton}
                  </Text>
                </View>
                {isShowLocked && (
                  <TouchableOpacity
                    onPress={this.onLock(item)}
                    activeOpacity={0.8}
                    style={style.bodyItemFunction}>
                    {item.Status == BATCH_STATUSES.duyet ? (
                      <ICONS.lockClose width={24} height={24} />
                    ) : (
                      <ICONS.lockOpen width={24} height={24} />
                    )}
                  </TouchableOpacity>
                )}
                {isShowRequest && (
                  <TouchableOpacity
                    onPress={this.onRequest(item)}
                    style={style.bodyItemFunction}
                    activeOpacity={0.8}>
                    <ICONS.requestConfirm width={24} height={24} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={style.bodyItemConfirm}>
            {item.RequestedDate ? (
              <View style={style.bodyItemConfirmItem}>
                <Text style={style.bodyItemConfirmItemLabel}>
                  Ngày yêu cầu:
                </Text>
                <Text style={style.bodyItemConfirmItemValue}>
                  {item.RequestedDate
                    ? moment(item.RequestedDate).format('HH:mm DD/MM/YYYY')
                    : ''}
                </Text>
              </View>
            ) : null}
            {item.Status == BATCH_STATUSES.khongDuyet ? (
              <View style={style.bodyItemConfirmItem}>
                <Text style={style.bodyItemConfirmItemLabel}>Lý do:</Text>
                <Text style={style.bodyItemConfirmItemValue}>
                  {item.ConfirmedReason}
                </Text>
              </View>
            ) : null}
            {!confirmBatch && item.Status == BATCH_STATUSES.duyet ? null : (
              <>
                {item.Status == BATCH_STATUSES.duyet ||
                item.Status == BATCH_STATUSES.khongDuyet ? (
                  <>
                    <View style={style.bodyItemConfirmItem}>
                      <Text style={style.bodyItemConfirmItemLabel}>
                        Người kiểm duyệt:
                      </Text>
                      <Text style={style.bodyItemConfirmItemValue}>
                        {item.ConfirmedBy}
                      </Text>
                    </View>
                    <View style={style.bodyItemConfirmItem}>
                      <Text style={style.bodyItemConfirmItemLabel}>
                        Ngày kiểm duyệt:
                      </Text>
                      <Text style={style.bodyItemConfirmItemValue}>
                        {item.ConfirmedDate
                          ? moment(item.RequestedDate).format(
                              'HH:mm DD/MM/YYYY',
                            )
                          : ''}
                      </Text>
                    </View>
                  </>
                ) : null}
              </>
            )}
          </View>
        </Animated.View>
        {isShowDelete ? (
          <View style={style.bodyItemDeleteWrap}>
            <TouchableOpacity
              onPress={this.onDelete(item.ID)}
              activeOpacity={0.8}
              style={style.bodyItemDelete}>
              <ICONS.trashWhite width={24} height={24} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

class Consignment extends Component {
  constructor(props) {
    super(props);

    const currentDateTime = new Date();

    const previousDateTime = new Date().setDate(currentDateTime.getDate() - 30);

    this.state = {
      isVisible: false,
      page: 0,
      limit: PAGINATIONS.consignment,
      dateStart: previousDateTime,
      dateEnd: currentDateTime,
      statusId: null,
      confirmBatch: false,
    };

    this.formQuestionRef = null;
    this.listConsignmentRef = null;
    this.scrollYConsignment = 0;
    this.isLoadingConsignment = false;
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: true,
        };
      });

      this.props.SettingOperations.companyConfig(res => {
        this.setState(previousState => {
          return {
            ...previousState,
            isVisible: false,
          };
        });

        const confirmBatch =
          ((res.data || {}).data || {}).confirmBatch || false;

        this.setState(
          previousState => {
            return {
              ...previousState,
              confirmBatch,
            };
          },
          async () => {
            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: true,
              };
            });

            const res = await this.getListConsignment(0, true);

            if (res.status != 200) {
              _Toast.error('Thông báo', 'Lấy danh sách lô hàng thất bại');
            }

            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });
          },
        );
      });
    });
  }

  modalSetRef = ref => {
    this.refModalComponentRef = ref;
  };

  datePickerSetRef = ref => {
    this.refDatePicker = ref;
  };

  formQuestionSetRef = ref => {
    this.formQuestionRef = ref;
  };

  getListConsignment = (page, init = true) => {
    return new Promise(resolve => {
      if (this.isLoadingConsignment) {
        return resolve({
          status: 200,
        });
      }
      this.isLoadingConsignment = true;

      const {limit, dateStart, dateEnd, statusId} = this.state;
      const {ConsignmentOperations} = this.props;

      let _dateStart = null;
      let _dateEnd = null;

      if (dateStart && dateEnd) {
        _dateStart = moment(dateStart).format('YYYY-MM-DD');
        _dateEnd = moment(dateEnd).format('YYYY-MM-DD');
      }

      ConsignmentOperations.getListConsignment(
        {
          startDate: _dateStart,
          endDate: _dateEnd,
          search: '',
          filter: '',
          orderBy: '',
          page,
          limit,
          init,
          status: statusId,
        },
        res => {
          const consignments = ((res.data || {}).data || {}).batchs || [];

          if (consignments.length > 0) {
            this.setState(
              previousState => {
                return {
                  ...previousState,
                  page,
                };
              },
              () => {
                this.isLoadingConsignment = false;
              },
            );
          } else {
            this.isLoadingConsignment = false;
          }

          resolve(res);
        },
      );
    });
  };

  onAdd = () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment);
  };

  onEdit = (id, plantingZoneName) => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment, {
      id,
      plantingZoneName,
    });
  };

  onLock = item => {
    return new Promise(resolve => {
      if (!item) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        resolve(false);

        return;
      }

      if (!item.ID) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        resolve(false);

        return;
      }

      if (item.Status == BATCH_STATUSES.duyet) {
        _Toast.error(
          'Thông báo',
          'Lô hàng này đã khóa/đã duyệt. Không thể mở khóa',
        );

        resolve(false);

        return;
      }

      this.props.ConsignmentOperations.getListWarehouseForUpdate({}, res => {
        const warehouses = ((res.data || {}).data || {}).wareHouses || [];

        const _warehouses = warehouses.map(p => {
          return {
            value: p.id,
            label: p.name,
          };
        });

        ModalComponent.open(
          <ChooseWarehouse
            warehouses={_warehouses}
            batchId={item.ID}
            onClose={this.onCloseLocked}
            onAccept={this.onAcceptLocked}
          />,
          'Thông báo',
          this.refModalComponentRef,
          () => {},
        );
      });

      // FormQuestion.open(result => {
      //     if (result.result) {
      //         this.setState(previousState => {
      //             return {
      //                 ...previousState,
      //                 isVisible: true
      //             }
      //         });

      //         this.props.ConsignmentOperations.updateLock({ id: item.id }, res => {
      //             if (res.status == 200) {
      //                 _Toast.success('Thông báo', 'Cập nhật trạng thái khóa thành công');

      //                 this.getListConsignment();

      //                 this.setState(previousState => {
      //                     return {
      //                         ...previousState,
      //                         isVisible: false
      //                     }
      //                 });

      //                 resolve(true);
      //             } else {
      //                 const message = getErrorMessageServer(res);

      //                 _Toast.error('Thông báo', message || 'Cập nhật trạng thái khóa thất bại');

      //                 this.setState(previousState => {
      //                     return {
      //                         ...previousState,
      //                         isVisible: false
      //                     }
      //                 });

      //                 resolve(false);
      //             }
      //         });
      //     } else {
      //         resolve(false);
      //     }
      // }, 'THÔNG BÁO', 'Bạn có chắc chắn muốn khóa thông tin này ?', this.formQuestionRef);
    });
  };

  onCloseLocked = () => {
    ModalComponent.close();
  };

  onAcceptLocked = (batchId, warehouseId) => {
    console.log('batchId', batchId, warehouseId);
    ModalComponent.close();

    return new Promise(resolve => {
      if (!batchId) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      if (!warehouseId) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy kho hàng này');

        return resolve(false);
      }
      this.props.ConsignmentOperations.updateLock(
        {id: batchId, warehouseId},
        res => {
          if (res.status == 200) {
            this.getListConsignment(0, true);

            return resolve(true);
          } else {
            const message = getErrorMessageServer(res);

            _Toast.error(
              'Thông báo',
              message || 'Cập nhật trạng thái khóa thất bại',
            );

            return resolve(false);
          }
        },
      );
      // FormQuestion.open(
      //   result => {
      //     if (result.result) {
      //       this.props.ConsignmentOperations.updateLock(
      //         {id: batchId, warehouseId},
      //         res => {
      //           if (res.status == 200) {
      //             this.getListConsignment(0, true);

      //             return resolve(true);
      //           } else {
      //             const message = getErrorMessageServer(res);

      //             _Toast.error(
      //               'Thông báo',
      //               message || 'Cập nhật trạng thái khóa thất bại',
      //             );

      //             return resolve(false);
      //           }
      //         },
      //       );
      //     } else {
      //       return resolve(false);
      //     }
      //   },
      //   'THÔNG BÁO',
      //   'Bạn có chắc chắn muốn khóa thông tin này ?',
      //   this.refFormQuestion,
      // );
    });
  };

  onDelete = id => {
    return new Promise(resolve => {
      if (!id) {
        _Toast.error('Thông báo', 'Lô hàng không tồn tại');

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

          this.props.ConsignmentOperations.deleteConsignment({id}, res => {
            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });

            if (res.status == 200) {
              _Toast.success('Thông báo', 'Xóa lô hàng thành công');

              this.getListConsignment(0, true);

              resolve(true);
            } else {
              const message = getErrorMessageServer(res);

              _Toast.error('Thông báo', message || 'Xóa lô hàng thất bại');

              this.setState(previousState => {
                return {
                  ...previousState,
                  isVisible: false,
                };
              });

              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  };
  onRequest = item => {
    console.log('item', item);
    return new Promise(resolve => {
      if (!item) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      if (!item.ID) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      FormQuestion.open(
        result => {
          if (result.result) {
            this.props.ConsignmentOperations.requireConfirm(
              {id: item.ID},
              res => {
                const status = (res || {}).status;

                if (status == 200) {
                  this.isLoadingConsignment = false;

                  this.getListConsignment(0, true);

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
        'Bạn có chắc chắn muốn yêu cầu duyệt lô hàng này ?',
        this.refFormQuestion,
      );
    });
  };

  onInfinitingConsignment = event => {
    if (this.isLoadingConsignment) {
      return;
    }

    const height = Math.ceil(
      event.nativeEvent.contentSize.height -
        event.nativeEvent.layoutMeasurement.height,
    );
    this.scrollYConsignment = Math.ceil(event.nativeEvent.contentOffset.y);

    if (height - this.scrollYConsignment <= DEFAULTS.offSetScrollInfinite) {
      this.isLoadingConsignment = false;

      this.getListConsignment(this.state.page + 1, false);
    }
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

          const res = await this.getListConsignment(0, true);

          if (res.status != 200) {
            _Toast.error('Thông báo', 'Lây danh sách lô hàng thất bại');
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

          const res = await this.getListConsignment(0, true);

          if (res.status != 200) {
            _Toast.error('Thông báo', 'Lây danh sách lô hàng thất bại');
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

  onChangeStatus = value => {
    this.setState(
      previousState => {
        return {
          ...previousState,
          statusId: value,
        };
      },
      () => {
        this.getListConsignment(0, true);
      },
    );
  };

  render() {
    const {ConsignmentReducer} = this.props;
    const {isVisible, dateStart, dateEnd, statusId, confirmBatch} = this.state;

    let consignments = [];

    if (ConsignmentReducer.get(consignmentConstant.KEYS.consignments).toJS) {
      consignments = ConsignmentReducer.get(
        consignmentConstant.KEYS.consignments,
      ).toJS();
    }

    // console.log('consignments', consignments);
    return (
      <BoxMainContainer
        modalSetRef={this.modalSetRef}
        datePickerSetRef={this.datePickerSetRef}
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
          <Text style={style.title}>QUẢN LÝ LÔ HÀNG</Text>
          {/* <TouchableOpacity activeOpacity={0.8} style={style.searchButton}>
                        <ICONS.search width={24} height={24} />
                    </TouchableOpacity> */}
          <TouchableOpacity
            onPress={this.onAdd}
            activeOpacity={0.8}
            style={style.addButton}>
            <ICONS.add width={24} height={24} />
          </TouchableOpacity>
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
          <View style={style.filterData}>
            <View style={[style.filterDataItem]}>
              <Text style={style.filterDataItemLabel}>Trạng thái</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: 'Chọn trạng thái',
                  inputLabel: '',
                  value: null,
                  ...style.filterItemSelectPlaceHolder,
                }}
                style={{
                  inputIOSContainer: style.filterItemSelectContainerIOS,
                  inputAndroidContainer: style.filterItemSelectContainerAndroid,
                  inputAndroid: style.filterItemSelectInputAndroid,
                  inputIOS: style.filterItemSelectInputIOS,
                  iconContainer: style.filterItemSelectIcon,
                }}
                value={statusId}
                onValueChange={this.onChangeStatus}
                items={BATCH_LIST_STATUSES}
                Icon={() => <ICONS.caretDown2 width={16} height={16} />}
              />
            </View>
          </View>
        </View>
        <View style={style.line}></View>
        <View style={style.body}>
          <ScrollView
            onScroll={this.onInfinitingConsignment}
            ref={ref => (this.listConsignmentRef = ref)}
            showsVerticalScrollIndicator={false}>
            <View style={style.bodyWrap}>
              {consignments.map((item, index) => {
                return (
                  <ConsignmentItem
                    confirmBatch={confirmBatch}
                    listConsignmentRef={this.listConsignmentRef}
                    key={index}
                    onEdit={this.onEdit}
                    onLock={this.onLock}
                    onDelete={this.onDelete}
                    onRequest={this.onRequest}
                    item={item}
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

export default Consignment;
>>>>>>> d7d300a (init)
