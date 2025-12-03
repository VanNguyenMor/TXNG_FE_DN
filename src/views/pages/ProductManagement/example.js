import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Animated,
    Keyboard,
    Dimensions,
    ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _MapView from 'react-native-maps';
import { Guid } from 'guid-typescript';
import RNPickerSelect from 'react-native-picker-select';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

import { ICONS } from '../../../assets/imgs';

import FormDelete from '../../components/formDelete';

import FormQuestion from '../../components/formQuestion';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import { getErrorMessageServer } from '../../utils/errorMessageServer';

import { checkOneClaim } from '../../utils/user';

import style from './style';

import LibraryPicker from '../../bases/controls/libraryPicker';

import {
    getExtensionFile,
    replaceComma,
    replaceUnitValue,
    validExtensionFileImage,
    validSize,
} from '../../bases/helper';

import {
    DELAYS,
    KEY_NAVIGATIONS,
    MAXIMUM_MB_FILE_IMAGE_SIZE,
    MESSAGES,
    PAGINATIONS,
} from '../../constants/config';

import {
    PARTNER_TYPE_TRANSPORT_REVERSES,
    PRODUCT_EXPIRED_TYPE,
    PRODUCT_TYPE_DATES,
    VERIFY_PRODUCTS,
} from '../../constants/data';

import { ModalSelect } from '../../bases/controls/select';

const NoImage = require('../../../assets/imgs/icons/no_image.png');

const NoImage2 = require('../../../assets/imgs/icons/no_image_2.jpg');

import { productConstant } from '../../states/product';

import { numberWithCommas } from '../../bases/helper';

import InsertLinkEditor from '../../bases/controls/insertLinkEditor';

import { COLORS } from '../../constants/theme';

import { getListFieldTreeList } from '../../utils/helpers';

import Image from '../../bases/controls/image';

import { AuthenticateView } from '../../utils/auth';

import { getCompanyId } from '../../utils/user';

import { CLAIMS } from '../../constants/data';

class AddProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            id: '',
            currentTab: 0,
            animationTabHeaderItem1: new Animated.Value(0),
            animationTabHeaderItem2: new Animated.Value(-100),
            animationTabHeaderItem3: new Animated.Value(-200),
            code: '',
            name: '',
            origin: '',
            unitName: '',
            unitId: '',
            weight: '',
            expiredNum: '',
            expireUnit: '',
            avatar: '',
            avatarFile: '',
            introduce: '',
            storage: '',
            usage: '',
            packing: '',
            imageFiles: [],
            checkFiles: [],
            certificateFiles: [],
            expireUnitName: '',
            typeDateId: 0,
            fieldId: '',
            fieldName: '',
            productUnits: [],
            originName: '',
            originId: null,
            barCode: '',
            productionProcess: '',
            productExpiredType: '',
            productTypeId: null,
            productTypes: [],
            pageProductType: 0,
            limitProductType: PAGINATIONS.productType,
            limitMaterial: PAGINATIONS.material,
            isLocked: false,
            barCode: '',
            partnerName: '',
            partnerId: '',
            qualityNum: '',
            isMaterial: false,
            verifiedStatus: null,
            productGroupsId: '',
            productGroupsName: '',
            chooseFields: [],
            chooseFieldReals: [],
            confirmedStatus: -1,
            //
            ingredient: '',
            isCompany: 0,
            claim: true,
            isBelongTo: true,
            companyId: null,
            warningUsage: ''
        };

        this.inputName = null;
        this.inputOrigin = null;
        this.inputWeight = null;
        this.inputExpiredNum = null;
        this.inputStorage = null;
        this.inputUsage = null;
        this.inputPacking = null;
        this.inputBarCode = null;
        this.inputQualityNum = null;

        this.richEditorProductionProcess = React.createRef();
        this.richEditorIntroduce = React.createRef();
        this.richEditorStorage = React.createRef();
        this.richEditorUsage = React.createRef();
        this.richEditorPacking = React.createRef();
        this.richEditorIngredient = React.createRef();
        this.richEditorWarningUsage = React.createRef();

        this.refFormDelete = null;
        this.refLibraryPicker = null;
        this.refMapView = null;
        this.refModalSelect = null;
        this.refInsertLinkEditor = null;
        this.refFormQuestion = null;
        this.isAddPartner = null;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', async () => {
            console.log(this.isAddPartner);

            if (this.isAddPartner) {
                this.props.ProductOperations.getListPartnerComboBox(
                    {
                        partnerType: 4,
                        companyName: '',
                        phone: '',
                        email: '',
                        orderBy: '',
                        page: 0,
                        limit: 1000,
                    },
                    () => {
                        this.isAddPartner = false;
                    },
                );

                return;
            }

            const imageFiles = [
                { id: Guid.create().toString(), name: '', file: '' },
                { id: Guid.create().toString(), name: '', file: '' },
            ];

            const checkFiles = [
                { id: Guid.create().toString(), name: '', file: '' },
                // { id: Guid.create().toString(), name: '', file: '' }
            ];

            const certificateFiles = [
                { id: Guid.create().toString(), name: '', file: '' },
                // { id: Guid.create().toString(), name: '', file: '' }
            ];

            let claim = await checkOneClaim([CLAIMS.partner.edit]);

            const { ProductOperations } = this.props;

            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: true,
                    imageFiles,
                    checkFiles,
                    certificateFiles,
                    claim,
                };
            });

            getCompanyId().then(companyId => {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        companyId,
                    };
                });
            });

            ProductOperations.getListMaterialGroupComboBox(
                {
                    search: '',
                    filter: '1',
                    orderBy: '',
                    page: 0,
                    limit: null,
                },
                result => {
                    ProductOperations.getListUnitComboBox(
                        { search: '', filter: '1', orderBy: '', page: 0, limit: 1000 },
                        res1 => {
                            ProductOperations.getListFieldComboBox(
                                { search: '', filter: '', orderBy: '', page: 0, limit: 1000 },
                                res2 => {
                                    console.log(res2);

                                    ProductOperations.getListNationComboBox({}, res4 => {
                                        ProductOperations.getListPartnerComboBox(
                                            {
                                                partnerType: 4,
                                                companyName: '',
                                                phone: '',
                                                email: '',
                                                orderBy: '',
                                                page: 0,
                                                limit: 1000,
                                            },
                                            async res5 => {
                                                this.setState(previousState => {
                                                    return {
                                                        ...previousState,
                                                        isVisible: false,
                                                    };
                                                });

                                                const { route } = this.props;

                                                if (route.params) {
                                                    if (route.params.id) {
                                                        this.getListProductTypeAddComboBox(0, true).then(
                                                            res3 => {
                                                                const productTypes = [...res3];
                                                                this.getDetailProduct(
                                                                    route.params.id,
                                                                    ((res1.data || {}).data || {}).units || [],
                                                                    ((res2.data || {}).data || {}).fields || [],
                                                                    productTypes,
                                                                    (res4.data || {}).data || [],
                                                                    ((res5.data || {}).data || {}).partners || [],
                                                                    ((result.data || {}).data || {})
                                                                        .materialGroups,
                                                                );
                                                            },
                                                        );
                                                    }
                                                } else {
                                                    this.setState(previousState => {
                                                        return {
                                                            ...previousState,
                                                            isVisible: true,
                                                        };
                                                    });

                                                    const companyId = await getCompanyId();

                                                    if (!companyId) {
                                                        _Toast.error(
                                                            'Thông báo',
                                                            'Lấy thông tin công ty thất bại',
                                                        );
                                                    }

                                                    ProductOperations.getDetailInfoCompany(
                                                        { id: companyId },
                                                        res => {
                                                            const data = (res.data || {}).data || null;
                                                            if (!data) {
                                                                _Toast.error(
                                                                    'Thông báo',
                                                                    'Lấy thông tin công ty thất bại',
                                                                );
                                                            }
                                                            this.setState(previousState => {
                                                                return {
                                                                    ...previousState,
                                                                    isCompany: data.isCompany,
                                                                    isVisible: false,
                                                                };
                                                            });
                                                        },
                                                    );
                                                }
                                            },
                                        );
                                    });
                                },
                            );
                        },
                    );
                },
            );
        });
    }

    onNextInputQualityNum = () => {
        this.inputQualityNum.focus();
    };

    insertLinkEditorSetRef = ref => {
        this.refInsertLinkEditor = null;
    };

    modalSelectSetRef = ref => {
        this.refModalSelect = ref;
    };

    mapViewSetRef = ref => {
        this.refMapView = ref;
    };

    libraryPickerSetRef = ref => {
        this.refLibraryPicker = ref;
    };

    formDeleteSetRef = ref => {
        this.refFormDelete = ref;
    };

    getListProductTypeAddComboBox = (page, init = true) => {
        return new Promise(resolve => {
            const { limitProductType } = this.state;
            const { ProductOperations } = this.props;

            ProductOperations.getListProductTypeAddComboBox(
                {
                    search: '',
                    filter: this.state.productGroupsId,
                    orderBy: '',
                    page,
                    limit: limitProductType,
                },
                res3 => {
                    const newProductTypes =
                        ((res3.data || {}).data || {}).productGroups || [];

                    let productTypes = [...this.state.productTypes];

                    if (newProductTypes.length > 0) {
                        if (!init) {
                            productTypes = productTypes.concat(newProductTypes);
                        } else {
                            productTypes = [...newProductTypes];
                        }

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                pageProductType: page,
                                productTypes,
                            };
                        });
                    } else {
                        if (init) {
                            productTypes = [];

                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    pageProductType: page,
                                    productTypes,
                                };
                            });
                        }
                    }

                    resolve(productTypes);
                },
            );
        });
    };
    //
    getListMaterialGroupComboBox = (page, init = true) => {
        return new Promise(resolve => {
            const { limitMaterial } = this.state;
            const { MaterialOperations } = this.props;

            MaterialOperations.getListMaterialGroupComboBox(
                {
                    search: '',
                    filter: '1',
                    orderBy: '',
                    page,
                    limit: limitMaterial,
                },
                res101 => {
                    // const newProductTypes =
                    //   ((res3.data || {}).data || {}).productGroups || [];
                    const newProductTypes = res101;
                    // let productTypes = [...this.state.productTypes];

                    // if (newProductTypes.length > 0) {
                    //   if (!init) {
                    //     productTypes = productTypes.concat(newProductTypes);
                    //   } else {
                    //     productTypes = [...newProductTypes];
                    //   }

                    //   this.setState(previousState => {
                    //     return {
                    //       ...previousState,
                    //       pageProductType: page,
                    //       productTypes,
                    //     };
                    //   });
                    // }

                    // resolve(productTypes);

                    resolve(newProductTypes);
                },
            );
        });
    };
    //

    getDetailProduct = (
        id,
        units,
        fields,
        productTypes,
        nations,
        partners,
        materials,
    ) => {
        const { ProductOperations, navigation } = this.props;

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        ProductOperations.getDetailProduct({ id }, res => {
            this.setState(previousState => {
                return {
                    ...previousState,
                    isVisible: false,
                };
            });

            const data = res.data;

            if (!data) {
                _Toast.error('Thông báo', 'Lấy thông tin sản phẩm thất bại');

                navigation.goBack();

                return;
            }

            const product = data.product || null;

            const chooseFields = data.productFields || [];

            const productCompany = data.productCompany || null;

            console.log('data', data);

            if (!product) {
                _Toast.error('Thông báo', 'Lấy thông tin sản phẩm thất bại');

                navigation.goBack();

                return;
            }

            const unit = (units || []).find(p => p.id == product.unitID);
            // const field = (fields || []).find(p => p.id == product.fieldID);
            const nation = (nations || []).find(p => p.id == product.origin);
            const material = (materials || []).find(
                p => p.id == product.materialGroupID,
            );
            const avatarFile = product.avatar;
            let images = product.images;
            let certifications = product.certification;
            let accreditations = product.accreditation;
            let productUnits = data.productsUnits || [];

            productUnits = productUnits
                .map(p => {
                    return {
                        ...p,
                        unitId: p.unitID,
                        unitName: (units.find(m => m.id == p.unitID) || {}).unitName,
                        value: numberWithCommas((p.value || '').toString(), ','),
                    };
                })
                .filter(p => p.unitId != product.unitID);

            if (images) {
                const splitImages = (images || '').split(';').filter(p => p);

                images = [];

                for (let i = 0; i < splitImages.length; i++) {
                    if (splitImages[i]) {
                        images.push({
                            id: Guid.create().toString(),
                            uri: splitImages[i],
                            name: '',
                            type: '',
                        });
                    }
                }
            } else {
                images = [];
            }

            for (let i = images.length; i < 2; i++) {
                images.push({
                    id: Guid.create().toString(),
                    name: '',
                    type: '',
                });
            }

            if (certifications) {
                const splitCertifications = (certifications || '')
                    .split(';')
                    .filter(p => p);

                certifications = [];

                for (let i = 0; i < splitCertifications.length; i++) {
                    if (splitCertifications[i]) {
                        certifications.push({
                            id: Guid.create().toString(),
                            uri: splitCertifications[i],
                            name: '',
                            type: '',
                        });
                    }
                }
            } else {
                certifications = [];
            }

            if (certifications.length == 0) {
                certifications = [
                    {
                        id: Guid.create().toString(),
                        name: '',
                        type: '',
                    },
                ];
            }

            if (accreditations) {
                const splitAccreditations = (accreditations || '')
                    .split(';')
                    .filter(p => p);

                accreditations = [];

                for (let i = 0; i < splitAccreditations.length; i++) {
                    if (splitAccreditations[i]) {
                        accreditations.push({
                            id: Guid.create().toString(),
                            uri: splitAccreditations[i],
                            name: '',
                            type: '',
                        });
                    }
                }
            } else {
                accreditations = [];
            }

            if (accreditations.length == 0) {
                accreditations = [
                    {
                        id: Guid.create().toString(),
                        name: '',
                        type: '',
                    },
                ];
            }

            let productTypeName = '';

            const productType = productTypes.find(
                p => p.id == product.productGroupID,
            );

            if (productType) {
                productTypeName = productType.name;
            }

            let partnerName = '';

            const partner = partners.find(p => p.id == product.manufactID);

            if (partner) {
                partnerName = partner.partnerName;
            }

            this.setState(
                previousState => {
                    return {
                        ...previousState,
                        id: product.id,
                        unitId: product.unitID,
                        unitName: unit ? unit.unitName : '',
                        // fieldName: field ? field.fieldName : '',
                        code: product.productCode,
                        name: product.productName,
                        // fieldId: product.fieldID,
                        originId: product.origin,
                        originName: nation ? nation.nationName : 'Chọn xuất xứ',
                        weight: product.weight,
                        expiredNum: (product.expiredNum || '').toString(),
                        typeDateId: product.expiredUnit,
                        introduce: product.introduce,
                        packing: product.packing,
                        usage: product.usage,
                        storage: product.storage,
                        avatarFile,
                        imageFiles: images,
                        checkFiles: accreditations,
                        certificateFiles: certifications,
                        productUnits,
                        barCode: product.barcode,
                        productionProcess: product.productionProcess,
                        productExpiredType: product.expiredType,
                        productTypeId: product.productGroupID,
                        isLocked: product.isLocked,
                        productTypeName,
                        qualityNum: product.qualityNum,
                        partnerId: product.manufactID,
                        partnerName,
                        isMaterial: product.isBoth,
                        verifiedStatus: product.verifiedStatus,
                        productGroupsId: (material || {}).id,
                        productGroupsName: (material || {}).name,
                        chooseFields,
                        chooseFieldReals: chooseFields,
                        confirmedStatus: product.confirmedStatus,
                        ingredient: product.ingredient,
                        isBelongTo: productCompany ? productCompany.isBelongTo : false,
                        warningUsage: product.warningUsage
                    };
                },
                () => {
                    if (this.richEditorProductionProcess) {
                        this.richEditorProductionProcess.current?.setContentHTML(
                            this.state.productionProcess,
                        );
                    }

                    if (this.richEditorIntroduce) {
                        this.richEditorIntroduce.current?.setContentHTML(
                            this.state.introduce,
                        );
                    }

                    if (this.richEditorStorage) {
                        this.richEditorStorage.current?.setContentHTML(this.state.storage);
                    }

                    if (this.richEditorUsage) {
                        this.richEditorUsage.current?.setContentHTML(this.state.usage);
                    }

                    if (this.richEditorPacking) {
                        this.richEditorPacking.current?.setContentHTML(this.state.packing);
                    }

                    if (this.richEditorIngredient) {
                        this.richEditorIngredient.current?.setContentHTML(
                            this.state.ingredient,
                        );
                    }

                    if (this.richEditorWarningUsage) {
                        this.richEditorWarningUsage.current?.setContentHTML(this.state.warningUsage);
                    }
                },
            );
        });
    };

    onChooseTab = tab => () => {
        Animated.parallel([
            Animated.timing(this.state.animationTabHeaderItem1, {
                duration: 250,
                toValue: tab == 0 ? 0 : 100,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.animationTabHeaderItem2, {
                duration: 250,
                toValue: tab == 1 ? 0 : tab == 0 ? -100 : 100,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.animationTabHeaderItem3, {
                duration: 250,
                toValue: tab == 2 ? 0 : -100,
                useNativeDriver: true,
            }),
        ]).start();

        this.setState(previousState => {
            return {
                ...previousState,
                currentTab: tab,
            };
        });

        Keyboard.dismiss();
    };

    onChangeValue = name => value => {
        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value,
            };
        });
    };

    onAddImageFile = () => {
        const imageFiles = [...this.state.imageFiles];

        imageFiles.push({
            id: Guid.create().toString(),
            name: '',
            file: '',
        });

        this.setState(previousState => {
            return {
                ...previousState,
                imageFiles,
            };
        });
    };

    onAddCheckFile = () => {
        const checkFiles = [...this.state.checkFiles];

        checkFiles.push({
            id: Guid.create().toString(),
            name: '',
            file: '',
        });

        this.setState(previousState => {
            return {
                ...previousState,
                checkFiles,
            };
        });
    };

    onAddCertificateFile = () => {
        const certificateFiles = [...this.state.certificateFiles];

        certificateFiles.push({
            id: Guid.create().toString(),
            name: '',
            file: '',
        });

        this.setState(previousState => {
            return {
                ...previousState,
                certificateFiles,
            };
        });
    };

    onChooseImageFile = id => () => {
        LibraryPicker.open(
            result => {
                if (result.assets) {
                    if (result.assets.length > 0) {
                        const image = result.assets[0];

                        if (!validSize(image.fileSize, MAXIMUM_MB_FILE_IMAGE_SIZE)) {
                            _Toast.error('Thông báo', MESSAGES.maximumMBFileImageSize);

                            return;
                        }

                        if (!validExtensionFileImage(image.fileName)) {
                            _Toast.error('Thông báo', MESSAGES.extensionFileImage);

                            return;
                        }

                        const imageFiles = [...this.state.imageFiles];

                        const imageFile = imageFiles.find(p => p.id == id);

                        if (imageFile) {
                            imageFile.file = image.uri;
                            imageFile.name = image.fileName;

                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    imageFiles,
                                };
                            });
                        }
                    }
                }
            },
            {
                mediaType: 'photo',
                includeBase64: false,
                selectionLimit: 1,
            },
            [MESSAGES.maximumMBFileImageSize, MESSAGES.extensionFileImage],
            this.refLibraryPicker,
        );
    };

    onChooseImageAvatar = () => {
        LibraryPicker.open(
            result => {
                if (result.assets) {
                    if (result.assets.length > 0) {
                        const image = result.assets[0];

                        if (!validSize(image.fileSize, MAXIMUM_MB_FILE_IMAGE_SIZE)) {
                            _Toast.error('Thông báo', MESSAGES.maximumMBFileImageSize);

                            return;
                        }

                        if (!validExtensionFileImage(image.fileName)) {
                            _Toast.error('Thông báo', MESSAGES.extensionFileImage);

                            return;
                        }

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                avatar: image.fileName,
                                avatarFile: image.uri,
                            };
                        });
                    }
                }
            },
            {
                mediaType: 'photo',
                includeBase64: false,
                selectionLimit: 1,
            },
            [MESSAGES.maximumMBFileImageSize, MESSAGES.extensionFileImage],
            this.refLibraryPicker,
        );
    };

    onChooseCheckFile = id => () => {
        LibraryPicker.open(
            result => {
                if (result.assets) {
                    if (result.assets.length > 0) {
                        const image = result.assets[0];

                        if (!validSize(image.fileSize, MAXIMUM_MB_FILE_IMAGE_SIZE)) {
                            _Toast.error('Thông báo', MESSAGES.maximumMBFileImageSize);

                            return;
                        }

                        if (!validExtensionFileImage(image.fileName)) {
                            _Toast.error('Thông báo', MESSAGES.extensionFileImage);

                            return;
                        }

                        const checkFiles = [...this.state.checkFiles];

                        const checkFile = checkFiles.find(p => p.id == id);

                        if (checkFile) {
                            checkFile.file = image.uri;
                            checkFile.name = image.fileName;

                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    checkFile,
                                };
                            });
                        }
                    }
                }
            },
            {
                mediaType: 'photo',
                includeBase64: false,
                selectionLimit: 1,
            },
            [MESSAGES.maximumMBFileImageSize, MESSAGES.extensionFileImage],
            this.refLibraryPicker,
        );
    };

    onChooseCertificateFile = id => () => {
        LibraryPicker.open(
            result => {
                if (result.assets) {
                    if (result.assets.length > 0) {
                        const image = result.assets[0];

                        if (!validSize(image.fileSize, MAXIMUM_MB_FILE_IMAGE_SIZE)) {
                            _Toast.error('Thông báo', MESSAGES.maximumMBFileImageSize);

                            return;
                        }

                        if (!validExtensionFileImage(image.fileName)) {
                            _Toast.error('Thông báo', MESSAGES.extensionFileImage);

                            return;
                        }

                        const certificateFiles = [...this.state.certificateFiles];

                        const certificateFile = certificateFiles.find(p => p.id == id);

                        if (certificateFile) {
                            certificateFile.file = image.uri;
                            certificateFile.name = image.fileName;

                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    certificateFiles,
                                };
                            });
                        }
                    }
                }
            },
            {
                mediaType: 'photo',
                includeBase64: false,
                selectionLimit: 1,
            },
            [MESSAGES.maximumMBFileImageSize, MESSAGES.extensionFileImage],
            this.refLibraryPicker,
        );
    };

    onRemoveCheckFile = id => () => {
        let checkFiles = [...this.state.checkFiles];

        const checkFile = checkFiles.find(p => p.id == id);

        if (checkFile) {
            FormDelete.open(result => {
                if (result.result) {
                    // checkFiles = checkFiles.filter(p => p.id != id);

                    checkFile.file = null;
                    checkFile.name = '';
                    checkFile.uri = '';

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            checkFiles,
                        };
                    });
                }
            }, this.refFormDelete);
        }
    };

    onRemoveCertificateFile = id => () => {
        let certificateFiles = [...this.state.certificateFiles];

        const certificateFile = certificateFiles.find(p => p.id == id);

        if (certificateFile) {
            FormDelete.open(result => {
                if (result.result) {
                    // certificateFiles = certificateFiles.filter(p => p.id != id);

                    certificateFile.file = null;
                    certificateFile.name = '';
                    certificateFile.uri = '';

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            certificateFiles,
                        };
                    });
                }
            }, this.refFormDelete);
        }
    };

    onRemoveImageFile = id => () => {
        let imageFiles = [...this.state.imageFiles];

        const imageFile = imageFiles.find(p => p.id == id);

        if (imageFile) {
            FormDelete.open(result => {
                if (result.result) {
                    // imageFiles = imageFiles.filter(p => p.id != id);

                    imageFile.file = null;
                    imageFile.name = '';
                    imageFile.uri = null;

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            imageFiles,
                        };
                    });
                }
            }, this.refFormDelete);
        }
    };

    onRemoveImageAvatar = () => {
        FormDelete.open(result => {
            if (result.result) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        avatar: '',
                        avatarFile: null,
                    };
                });
            }
        }, this.refFormDelete);
    };

    onChangeTypeDate = value => {
        this.setState(previousState => {
            return {
                ...previousState,
                typeDateId: value,
            };
        });
    };

    onNextInputName = () => {
        this.inputName.focus();
    };

    onNextInputOrigin = () => {
        this.inputOrigin.focus();
    };

    onNextInputWeight = () => {
        this.inputWeight.focus();
    };

    onNextInputExpiredNum = () => {
        this.inputExpiredNum.focus();
    };

    onNextInputStorage = () => {
        this.inputStorage.focus();
    };

    onNextInputUsage = () => {
        this.inputUsage.focus();
    };

    onNextInputPacking = () => {
        this.inputPacking.focus();
    };

    onNextInputBarCode = () => {
        this.inputBarCode.focus();
    };

    onPopupUnit = () => {
        const { ProductReducer } = this.props;

        let units = [];

        if (ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS) {
            units = ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS();
        }

        ModalSelect.open(
            this.onChangeUnit,
            units,
            this.state.unitId,
            { value: 'id', label: 'unitName' },
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

    onChangeUnit = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                unitId: item.id,
                unitName: item.unitName,
            };
        });
    };

    formQuestionSetRef = ref => {
        this.refFormQuestion = ref;
    };

    onAdd = () => {
        const { ProductOperations } = this.props;
        const {
            productTypeId,
            productExpiredType,
            originId,
            productUnits,
            id,
            code,
            name,
            unitId,
            weight,
            expiredNum,
            typeDateId,
            avatarFile,
            avatar,
            introduce,
            usage,
            storage,
            packing,
            imageFiles,
            checkFiles,
            certificateFiles,
            fieldId,
            productionProcess,
            barCode,
            qualityNum,
            isMaterial,
            productGroupsId,
            chooseFieldReals,
            partnerId,
            ingredient,
            warningUsage
        } = this.state;

        Keyboard.dismiss();

        const _expiredNum = parseInt(expiredNum);

        // if (!code) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng nhập mã sản phẩm');

        //     return;
        // }

        if (code.length > 255) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập mã sản phẩm nhỏ hơn hoặc bằng 255 kí tự',
            );

            return;
        }

        if (!name) {
            _Toast.error('Thông báo', 'Bạn vui lòng nhập tên sản phẩm');

            return;
        }

        if (name.length > 255) {
            _Toast.error(
                'Thông báo',
                'Bạn vui lòng nhập tên sản phẩm nhỏ hơn hoặc bằng 255 kí tự',
            );

            return;
        }

        // if (!fieldId) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng chọn ngành nghề');

        //     return;
        // }

        if (chooseFieldReals.length <= 0) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn ngành nghề');

            return;
        }

        let checkType = chooseFieldReals.some(item => item.fieldType == 3);

        if (!productGroupsId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn nhóm sản phẩm');

            return;
        }

        if (!productTypeId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn loại sản phẩm');

            return;
        }

        if (!originId) {
            _Toast.error('Thông báo', 'Bạn vui lòng chọn xuất xứ');

            return;
        }

        // if (weight && !unitId) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng chọn đơn vị tính');

        //     return;
        // }
        if (!checkType) {
            if (!_expiredNum) {
                _Toast.error('Thông báo', 'Bạn vui lòng nhập số thời hạn sử dụng');

                return;
            }
            if (!PRODUCT_TYPE_DATES.find(p => p.value == typeDateId)) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn thời hạn sử dụng');

                return;
            }
            if (productExpiredType === '' || productExpiredType === null) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn loại thời hạn sử dụng');

                return;
            }
            if (
                !PRODUCT_EXPIRED_TYPE.find(p => p.value == Number(productExpiredType))
            ) {
                _Toast.error('Thông báo', 'Bạn vui lòng chọn loại thời hạn sử dụng');
                return;
            }
        }

        // if (!productionProcess) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng nhập quy trình sản xuất');

        //     return;
        // }

        // if (!barCode) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng nhập mã BarCode');

        //     return;
        // }

        // if (productUnits.length <= 0) {
        //     _Toast.error('Thông báo', 'Bạn vui lòng chọn đơn vị quy đổi cho sản phẩm');

        //     return;
        // }

        if (productUnits.length > 0) {
            const checkExistProductInitWithUnit =
                productUnits.filter(p => p.unitId == unitId).length > 0 ? true : false;

            if (checkExistProductInitWithUnit) {
                _Toast.error(
                    'Thông báo',
                    'Bạn vui lòng chọn đơn vị quy đổi không trùng với đơn vị chính',
                );

                return;
            }

            const checkValueProductUnit =
                productUnits.filter(p => !p.value).length <= 0 ? true : false;

            if (!checkValueProductUnit) {
                _Toast.error(
                    'Thông báo',
                    'Bạn vui lòng nhập giá trị quy đổi của đơn vị',
                );

                return;
            }

            // const checkIsReportProductUnit = productUnits.find(p => p.isReport)
            //     ? true
            //     : false;

            // if (!checkIsReportProductUnit) {
            //     _Toast.error('Thông báo', 'Bạn vui lòng chọn đơn vị làm báo cáo');

            //     return;
            // }

            const checkCountIsReportProductUnit =
                productUnits.filter(p => p.isReport).length > 1 ? false : true;

            if (!checkCountIsReportProductUnit) {
                _Toast.error('Thông báo', 'Bạn vui lòng chỉ chọn 1 đơn vị làm báo cáo');

                return;
            }
        }

        let _avatarFile = null;
        let _avatar = '';

        if (avatarFile && avatar) {
            _avatarFile = {
                uri: avatarFile,
                name: avatar,
                type: `image/${getExtensionFile(avatar)}`,
            };

            _avatar = avatar;
        } else {
            _avatar = avatarFile;
        }

        if (_avatarFile) {
            _avatarFile = [_avatarFile];
        }

        // let _imageFile = null;

        // if (imageFiles && imageFiles.length > 0) {
        //     _imageFile = {
        //         uri: imageFiles[0].file,
        //         name: imageFiles[0].name,
        //         type: `image/${getExtensionFile(imageFiles[0].name)}`
        //     }
        // }

        // let _checkFile = null;

        // if (checkFiles && checkFiles.length > 0 && checkFiles.filter(p => p.name).length > 0) {
        //     _checkFile = {
        //         uri: checkFiles[0].file,
        //         name: checkFiles[0].name,
        //         type: `image/${getExtensionFile(checkFiles[0].name)}`
        //     }
        // }

        // if (_checkFile) {
        //     _checkFile = [_checkFile];
        // }

        let _checkFileString = '';
        const _checkFiles = [];
        const _checkFileLoops = (checkFiles || []).filter(p => p.file);

        for (let i = 0; i < _checkFileLoops.length; i++) {
            if (_checkFileLoops[i].name) {
                _checkFiles.push({
                    uri: _checkFileLoops[i].file,
                    name: _checkFileLoops[i].name,
                    type: `image/${getExtensionFile(_checkFileLoops[i].name)}`,
                });
            }
        }

        _checkFileString = (checkFiles || [])
            .filter(p => p.uri)
            .map(p => p.uri)
            .join(';');

        // let _certificateFile = null;

        // if (certificateFiles && certificateFiles.length > 0 && certificateFiles.filter(p => p.name).length > 0) {
        //     _certificateFile = {
        //         uri: certificateFiles[0].file,
        //         name: certificateFiles[0].name,
        //         type: `image/${getExtensionFile(certificateFiles[0].name)}`
        //     }
        // }

        // if (_certificateFile) {
        //     _certificateFile = [_certificateFile];
        // }

        let _imageFileString = '';
        const _imageFiles = [];
        const _imageFileLoops = (imageFiles || []).filter(p => p.file);

        for (let i = 0; i < _imageFileLoops.length; i++) {
            if (_imageFileLoops[i].name) {
                _imageFiles.push({
                    uri: _imageFileLoops[i].file,
                    name: _imageFileLoops[i].name,
                    type: `image/${getExtensionFile(_imageFileLoops[i].name)}`,
                });
            }
        }

        _imageFileString = (imageFiles || [])
            .filter(p => p.uri)
            .map(p => p.uri)
            .join(';');

        // const _checkFiles = [];
        // const _checkFileLoops = (checkFiles || []).filter(p => p.file);

        // for (let i = 0; i < _checkFileLoops.length; i++) {
        //     _checkFiles.push({
        //         uri: _checkFileLoops[i].file,
        //         name: _checkFileLoops[i].name,
        //         type: `image/${getExtensionFile(_checkFileLoops[i].name)}`
        //     });
        // }

        let _certificateFileString = '';
        const _certificateFiles = [];
        const _certificateFileLoops = (certificateFiles || []).filter(p => p.file);

        for (let i = 0; i < _certificateFileLoops.length; i++) {
            _certificateFiles.push({
                uri: _certificateFileLoops[i].file,
                name: _certificateFileLoops[i].name,
                type: `image/${getExtensionFile(_certificateFileLoops[i].name)}`,
            });
        }

        _certificateFileString = (certificateFiles || [])
            .filter(p => p.uri)
            .map(p => p.uri)
            .join(';');

        // let newFieldId = chooseFieldReals.map(item => item.id);

        const _chooseFieldReals = chooseFieldReals.map(p => p.id);

        this.setState(previousState => {
            return {
                ...previousState,
                isVisible: true,
            };
        });

        if (id) {
            ProductOperations.editProduct(
                {
                    id,
                    productCode: code,
                    productName: name,
                    fieldId,
                    unitId,
                    origin: originId,
                    weight,
                    expiredNum,
                    expiredUnit: typeDateId,
                    expiredType: productExpiredType,
                    introduce,
                    storage,
                    usage,
                    packing,
                    avatar: _avatar,
                    avatarFile: _avatarFile,
                    images: _imageFileString,
                    accreditation: _checkFileString,
                    certification: _certificateFileString,
                    // accreditationFile: _checkFiles,
                    certificationFile: _certificateFiles,
                    files: _imageFiles,
                    accreditationFile: _checkFiles,
                    // certificationFile: _certificateFile,
                    productUnits: replaceUnitValue(productUnits),
                    productionProcess,
                    barCode,
                    productGroupID: productTypeId,
                    qualityNum,
                    isMaterial,
                    // files: _imageFile
                    fields: _chooseFieldReals,
                    manufactId: partnerId,
                    materialGroupId: productGroupsId,
                    ingredient,
                    warningUsage
                },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });
       
                    if (res.status && (res.status == 200 || res.status == 201)) {
                        _Toast.success('Thông báo', 'Sửa sản phẩm thành công');

                        const timeOut = setTimeout(() => {
                            this.props.navigation.goBack();

                            clearTimeout(timeOut);
                        }, DELAYS.navigationInsertOrUpdateToScreen);
                    } else {
                        const message = getErrorMessageServer(res);

                        if (message == 'Yêu cầu duyệt sản phẩm thành công') {
                            _Toast.success('Thông báo', 'Yêu cầu duyệt sản phẩm thành công');
                            return;
                        }

                        _Toast.error('Thông báo', message || 'Sửa sản phẩm thất bại');
                    }
                },
            );
        } else {
            ProductOperations.addProduct(
                {
                    productCode: code,
                    productName: name,
                    fieldId,
                    unitId,
                    origin: originId,
                    weight,
                    expiredNum,
                    expiredUnit: typeDateId,
                    expiredType: productExpiredType,
                    introduce,
                    storage,
                    usage,
                    packing,
                    avatar,
                    avatarFile: _avatarFile,
                    images: '',
                    accreditation: '',
                    certification: '',
                    // accreditationFile: _checkFiles,
                    certificationFile: _certificateFiles,
                    files: _imageFiles,
                    accreditationFile: _checkFiles,
                    // certificationFile: _certificateFile,
                    productUnits: replaceUnitValue(productUnits),
                    productionProcess,
                    barCode,
                    productGroupID: productTypeId,
                    qualityNum,
                    isMaterial,
                    // files: _imageFile
                    fields: _chooseFieldReals,
                    manufactId: partnerId,
                    materialGroupId: productGroupsId,
                    ingredient,
                    warningUsage
                },
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isVisible: false,
                        };
                    });

                    if (res.status && (res.status == 200 || res.status == 201)) {
                        _Toast.success('Thông báo', 'Thêm sản phẩm thành công');

                        this.setState(
                            previousState => {
                                return {
                                    ...previousState,
                                    code: '',
                                    name: '',
                                    origin: '',
                                    unitName: '',
                                    unitId: '',
                                    weight: '',
                                    expiredNum: '',
                                    expiredUnit: '',
                                    avatar: '',
                                    avatarFile: '',
                                    introduce: '',
                                    storage: '',
                                    usage: '',
                                    packing: '',
                                    imageFiles: [
                                        { id: Guid.create().toString(), name: '', file: '' },
                                        { id: Guid.create().toString(), name: '', file: '' },
                                    ],
                                    checkFiles: [
                                        {
                                            id: Guid.create().toString(),
                                            name: '',
                                            type: '',
                                        },
                                    ],
                                    certificateFiles: [
                                        {
                                            id: Guid.create().toString(),
                                            name: '',
                                            type: '',
                                        },
                                    ],
                                    expireUnitName: '',
                                    typeDateId: 0,
                                    fieldId: '',
                                    fieldName: '',
                                    productUnits: [],
                                    expireUnitName: '',
                                    productionProcess: '',
                                    introduce: '',
                                    storage: '',
                                    usage: '',
                                    packing: '',
                                    productTypeId: '',
                                    chooseFieldReals: [],
                                    productGroupsId: null,
                                    productGroupsName: '',
                                    chooseFields: [],
                                    originId: null,
                                    originName: '',
                                    partnerTypeId: null,
                                    partnerTypeName: '',
                                    partnerName: '',
                                    partnerId: null,
                                    productExpiredType: null,
                                    qualityNum: '',
                                    productTypeId: null,
                                    productTypeName: '',
                                    isMaterial: false,
                                    ingredient: '',
                                    warningUsage: ''
                                };
                            },
                            () => {
                                if (this.richEditorProductionProcess) {
                                    this.richEditorProductionProcess.current?.setContentHTML(
                                        this.state.productionProcess,
                                    );
                                }

                                if (this.richEditorIntroduce) {
                                    this.richEditorIntroduce.current?.setContentHTML(
                                        this.state.introduce,
                                    );
                                }

                                if (this.richEditorStorage) {
                                    this.richEditorStorage.current?.setContentHTML(
                                        this.state.storage,
                                    );
                                }

                                if (this.richEditorUsage) {
                                    this.richEditorUsage.current?.setContentHTML(
                                        this.state.usage,
                                    );
                                }

                                if (this.richEditorPacking) {
                                    this.richEditorPacking.current?.setContentHTML(
                                        this.state.packing,
                                    );
                                }

                                if (this.richEditorIngredient) {
                                    this.richEditorIngredient.current?.setContentHTML(
                                        this.state.ingredient,
                                    );
                                }

                                if (this.richEditorWarningUsage) {
                                    this.richEditorWarningUsage.current?.setContentHTML(
                                        this.state.warningUsage
                                    );
                                }
                            },
                        );
                    } else {
                        const message = getErrorMessageServer(res);

                        if (message == 'Yêu cầu duyệt sản phẩm thành công') {
                            _Toast.success('Thông báo', 'Yêu cầu duyệt sản phẩm thành công');
                            return;
                        }

                        _Toast.error('Thông báo', message || 'Thêm sản phẩm thất bại');
                    }
                },
            );
        }
    };

    onPopupField = () => {
        const { chooseFields } = this.state;
        const { ProductReducer } = this.props;

        let fields = [];

        if (ProductReducer.get(productConstant.KEYS.fieldComboBoxs).toJS) {
            fields = ProductReducer.get(productConstant.KEYS.fieldComboBoxs).toJS();
        }

        console.log(fields);

        let results = [];

        // getListFieldTreeList(fields, results, p => !p.parentID, 0);

        let sympols = [];

        class FieldItem extends Component {
            constructor(props) {
                super(props);

                this.state = {
                    chooseFields: [],
                };
            }

            componentDidMount() {
                const chooseFields = [...this.props.chooseFields];

                this.setState(previousState => {
                    return {
                        ...previousState,
                        chooseFields,
                    };
                });
            }

            onChangeField = item => () => {
                let chooseFields = [...this.state.chooseFields];

                const field = chooseFields.find(p => p.id == item.id);

                if (field) {
                    chooseFields = chooseFields.filter(p => p.id != item.id);
                } else {
                    chooseFields.push(item);
                }

                if (this.props.onChangeField) {
                    this.props.onChangeField(item);
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        chooseFields,
                    };
                });
            };

            render() {
                const { chooseFields } = this.state;
                const {
                    styleRow,
                    item,
                    index,
                    styleDisable,
                    styleActive,
                    sympols,
                    styleRowText,
                } = this.props;

                return (
                    <TouchableOpacity
                        activeOpacity={item.isDisable ? 1 : 0.8}
                        onPress={item.isDisable ? null : this.onChangeField(item)}
                        key={index}
                        style={[
                            styleRow,
                            item.isDisable
                                ? styleDisable
                                : chooseFields.find(p => p.id == item.id) // item.id == this.state.fieldId
                                    ? styleActive
                                    : {},
                        ]}>
                        <Text style={styleRowText}>
                            {sympols}
                            {sympols.length > 0 ? ' ' : ''}
                            {item.fieldName}
                        </Text>
                    </TouchableOpacity>
                );
            }
        }

        ModalSelect.open(
            this.onChangeField,
            // results,
            fields,
            this.state.fieldId,
            { value: 'id', label: 'fieldName' },
            'Chọn ngành nghề',
            'Tìm kiếm',
            false,
            this.onAcceptField,
            null,
            [],
            (item, index, styleRow, styleRowText, styleActive, styleDisable) => {
                sympols = Array.apply(null, Array(item.level || 0)).map(() => {
                    return '----';
                });

                return (
                    <FieldItem
                        chooseFields={this.state.chooseFields}
                        onChangeField={this.onChangeField}
                        sympols={sympols}
                        key={index}
                        item={item}
                        index={index}
                        styleRow={styleRow}
                        styleRowText={styleRowText}
                        styleActive={styleActive}
                        styleDisable={styleDisable}
                    />
                );
            },
            null,
            null,
            null,
            null,
            null,
            this.refModalSelect,
            true,
        );
    };

    onAcceptField = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                chooseFieldReals: this.state.chooseFields,
            };
        });
    };

    onChangeField = item => {
        // ModalSelect.close();

        let chooseFields = [...this.state.chooseFields];

        const field = chooseFields.find(p => p.id == item.id);

        if (field) {
            chooseFields = chooseFields.filter(p => p.id != item.id);
        } else {
            chooseFields.push(item);
        }

        console.log('chooseFields', chooseFields);

        this.setState(previousState => {
            return {
                ...previousState,
                chooseFields,
                // fieldId: item.id,
                // fieldName: item.fieldName,
            };
        });
    };

    onDelete = () => {
        const { id } = this.state;

        if (!id) {
            _Toast.error('Thông báo', 'Sản phẩm không tồn tại');

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

                this.props.ProductOperations.deleteProduct({ id }, res => {
                    if (res.status == 200) {
                        _Toast.success('Thông báo', 'Xóa sản phẩm thành công');

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

                        _Toast.error('Thông báo', message || 'Xóa sản phẩm thất bại');
                    }
                });
            }
        }, this.refFormDelete);
    };

    onChangeProductValue = unitId => value => {
        const productUnits = [...this.state.productUnits];

        const productUnit = productUnits.find(p => p.unitId == unitId);

        if (productUnit) {
            //   value = replaceComma(value || '', '');
            //   productUnit.value = numberWithCommas(value, ',');

            productUnit.value = value;

            this.setState(previousState => {
                return {
                    ...previousState,
                    productUnits,
                };
            });
        }
    };

    onCheckIsReport = unitId => () => {
        const productUnits = [...this.state.productUnits];

        const productUnit = productUnits.find(p => p.unitId == unitId);

        if (productUnit) {
            if (productUnit.isReport) {
                productUnit.isReport = false;
            } else {
                productUnits.map(item => (item.isReport = false));

                productUnit.isReport = true;
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    productUnits,
                };
            });
        }
    };

    onDeleteProductUnit = item => () => {
        const { verifiedStatus, isLocked } = this.state;

        if (
            (verifiedStatus == VERIFY_PRODUCTS.verified || isLocked) &&
            !item.isNew
        ) {
            return;
        }

        const unitId = item.unitId;

        let productUnits = [...this.state.productUnits];

        const productUnit = productUnits.find(p => p.unitId == unitId);

        if (productUnit) {
            productUnits = productUnits.filter(p => p.unitId != unitId);

            this.setState(previousState => {
                return {
                    ...previousState,
                    productUnits,
                };
            });
        }
    };

    onPopupProductUnit = () => {
        const { ProductReducer } = this.props;

        let units = [];

        if (ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS) {
            units = ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS();
        }

        ModalSelect.open(
            this.onAddProductUnit,
            units,
            null,
            { value: 'id', label: 'unitName' },
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
    };

    onAddProductUnit = item => {
        const { verifiedStatus, isLocked, companyId } = this.state;

        let productUnits = [...this.state.productUnits];

        const productUnit = productUnits.find(p => p.unitId == item.id);

        if (!productUnit) {
            productUnits.push({
                unitId: item.id,
                unitName: item.unitName,
                value: '',
                isReport: productUnits.length <= 0 ? true : false,
                isNew: true,
                companyId,
            });

            if (
                productUnits.length == 2 &&
                !(verifiedStatus == VERIFY_PRODUCTS.verified || isLocked)
            ) {
                productUnits = productUnits.map(p => {
                    return {
                        ...p,
                        isReport: false,
                    };
                });
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    productUnits,
                };
            });
        } else {
            _Toast.error('Thông báo', 'Đơn vị tính này đã tồn tại');
        }
    };

    onPopupOrigin = () => {
        const { ProductReducer } = this.props;

        let nations = [];

        if (ProductReducer.get(productConstant.KEYS.nationComboBoxs).toJS) {
            nations = ProductReducer.get(productConstant.KEYS.nationComboBoxs).toJS();
        }

        ModalSelect.open(
            this.onSelectOrigin,
            nations,
            this.state.originId,
            { value: 'id', label: 'nationName' },
            'Chọn xuất xứ',
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

    onSelectOrigin = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                originId: item.id,
                originName: item.nationName,
            };
        });
    };

    onPressAddImageEditor = editor => () => {
        LibraryPicker.open(
            result => {
                if (result.assets) {
                    if (result.assets.length > 0) {
                        const image = result.assets[0];

                        if (!validSize(image.fileSize, MAXIMUM_MB_FILE_IMAGE_SIZE)) {
                            _Toast.error('Thông báo', MESSAGES.maximumMBFileImageSize);

                            return;
                        }

                        if (!validExtensionFileImage(image.fileName)) {
                            _Toast.error('Thông báo', MESSAGES.extensionFileImage);

                            return;
                        }

                        const files = [
                            {
                                uri: image.uri,
                                name: image.fileName,
                                type: `image/${getExtensionFile(image.fileName)}`,
                            },
                        ];

                        this.setState(previousState => {
                            return {
                                ...previousState,
                                isVisible: true,
                            };
                        });

                        this.props.ProductOperations.uploadFile({ files }, res => {
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    isVisible: false,
                                };
                            });

                            const url = ((res || {}).data || {}).data || null;

                            if (url) {
                                editor.current?.insertImage(url);
                            }
                        });
                    }
                }
            },
            {
                mediaType: 'photo',
                includeBase64: false,
                selectionLimit: 1,
            },
            [MESSAGES.maximumMBFileImageSize, MESSAGES.extensionFileImage],
            this.refLibraryPicker,
        );
    };

    onChangeEditor = name => content => {
        this.setState(previousState => {
            return {
                ...previousState,
                [name]: content,
            };
        });
    };

    onInsertLinkEditor = editor => () => {
        InsertLinkEditor.open(result => {
            if (result.result && result.link) {
                editor.current?.insertLink(result.title, result.link);
            }
        }, this.refInsertLinkEditor);
    };

    onChangeExpiredType = value => {
        console.log('onChangeExpiredType', value);
        this.setState(previousState => {
            return {
                ...previousState,
                productExpiredType: value,
            };
        });
    };

    onPopupProductType = () => {
        const { productTypes, productTypeId } = this.state;

        ModalSelect.open(
            this.onAcceptProductType,
            productTypes,
            productTypeId,
            { value: 'id', label: 'name' },
            'Chọn loại sản phẩm',
            'Tìm kiếm',
            false,
            null,
            [],
            null,
            null,
            null,
            null,
            null,
            () => {
                return this.getListProductTypeAddComboBox(
                    this.state.pageProductType + 1,
                    false,
                );
            },
            this.refModalSelect,
            false,
        );
    };

    onPopupMaterialType = () => {
        const { ProductReducer } = this.props;

        let material = [];

        if (ProductReducer.get(productConstant.KEYS.materialComboBoxs).toJS) {
            material = ProductReducer.get(
                productConstant.KEYS.materialComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onAddMaterialType,
            material,
            null,
            { value: 'id', label: 'name' },
            'Chọn nhóm sản phẩm',
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

    onAddMaterialType = item => {
        const { ProductReducer } = this.props;

        let units = [];

        if (ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS) {
            units = ProductReducer.get(productConstant.KEYS.unitComboBoxs).toJS();
        }

        const unit = units.find(p => p.id == item.unitID);

        let unitId = this.state.unitId;
        let unitName = this.state.unitName;

        if (unit) {
            unitId = unit.id;
            unitName = unit.unitName;
        }

        this.setState(
            previousState => {
                return {
                    ...previousState,
                    productGroupsId: item.id,
                    productGroupsName: item.name,
                    unitId,
                    unitName,
                    productTypeId: '',
                    productTypeName: '',
                };
            },
            () => {
                this.getListProductTypeAddComboBox(0, true);
            },
        );
    };

    onAcceptProductType = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                productTypeId: item.id,
                productTypeName: item.name,
            };
        });
    };

    onPopupPartner = () => {
        const { ProductReducer } = this.props;

        let partners = [];

        if (ProductReducer.get(productConstant.KEYS.partnerComboBoxs).toJS) {
            partners = ProductReducer.get(
                productConstant.KEYS.partnerComboBoxs,
            ).toJS();
        }

        ModalSelect.open(
            this.onChangePartner,
            partners,
            this.state.partnerId,
            { value: 'id', label: 'partnerName' },
            'Chọn nhà sản xuất',
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

    onChangePartner = item => {
        this.setState(previousState => {
            return {
                ...previousState,
                partnerId: item.id,
                partnerName: item.partnerName,
            };
        });
    };

    onIsMaterial = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isMaterial: !previousState.isMaterial,
            };
        });
    };

    //
    onClickEdit = () => {
        const { isLocked, verifiedStatus } = this.state;
        let title = '';
        if (isLocked && verifiedStatus != 2) {
            title =
                'Sản phẩm đã được khoá. Bạn vẫn muốn cập nhật thông tin sản phẩm?';
        }
        if (verifiedStatus == 2 || (isLocked && verifiedStatus == 2)) {
            title =
                'Sản phẩm đã được xác thực. Nếu chọn đồng ý, sản phẩm sẽ không còn được xác thực. Bạn vẫn muốn cập nhật thông tin sản phẩm?';
        }
        if (isLocked || verifiedStatus == 2) {
            return new Promise(resolve => {
                FormQuestion.open(
                    result => {
                        if (result.result) {
                            this.onAdd();
                        } else {
                            return resolve(false);
                        }
                    },
                    'THÔNG BÁO',
                    title,
                    this.refFormQuestion,
                );
            });
        } else {
            this.onAdd();
        }
    };

    onAddPartner = () => {
        this.props.navigation.navigate(KEY_NAVIGATIONS.addPartner, {
            screen: KEY_NAVIGATIONS.addProduct,
            type: PARTNER_TYPE_TRANSPORT_REVERSES.nhaSanXuat,
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
                    partnerId: data.id,
                    partnerName: data.partnerName,
                };
            });
        }
    };

    render() {
        const {
            productExpiredType,
            productionProcess,
            originName,
            fieldName,
            typeDateId,
            isVisible,
            id,
            currentTab,
            animationTabHeaderItem1,
            animationTabHeaderItem2,
            animationTabHeaderItem3,
            code,
            name,
            barCode,
            unitName,
            weight,
            expiredNum,
            avatarFile,
            introduce,
            storage,
            usage,
            packing,
            imageFiles,
            checkFiles,
            certificateFiles,
            productUnits,
            productTypeName,
            isLocked,
            partnerName,
            qualityNum,
            isMaterial,
            verifiedStatus,
            productGroupsId,
            productGroupsName,
            chooseFieldReals,
            confirmedStatus,
            //
            ingredient,
            isCompany,
            claim,
            fieldType,
            isBelongTo,
            companyId,
            warningUsage
        } = this.state;

        const interpolationTabItem1 = animationTabHeaderItem1.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
        });

        const interpolationTabItem2 = animationTabHeaderItem2.interpolate({
            inputRange: [-100, 0, 100],
            outputRange: [0, 1, 0],
        });

        const interpolationTabItem3 = animationTabHeaderItem3.interpolate({
            inputRange: [-200, 0],
            outputRange: [0, 1],
        });

        const width = Dimensions.get('window').width;

        const interpolationTabBodyItem1 = animationTabHeaderItem1.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -width],
        });

        const interpolationTabBodyItem2 = animationTabHeaderItem2.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, -width + 46],
        });

        const interpolationTabBodyItem3 = animationTabHeaderItem3.interpolate({
            inputRange: [-200, 0],
            outputRange: [0, -(width * 2) + 92],
        });

        const _fieldName = chooseFieldReals.map(p => p.fieldName).join(', ');

        let checkType = chooseFieldReals.some(item => item.fieldType == 3);

        let company = '';

        switch (isCompany) {
            case 0:
                company = 'Doanh nghiệp';
                break;
            case 1:
                company = 'Cá nhân';
                break;
            case 2:
                company = 'Hợp tác xã';
                break;
        }

        let isEdit = id ? (claim && !isLocked ? true : false) : true;

        let isDisable = !isEdit;

        // companyID

        return (
            <BoxMainContainer
                insertLinkEditorSetRef={this.insertLinkEditorSetRef}
                modalSelectSetRef={this.modalSelectSetRef}
                mapViewSetRef={this.mapViewSetRef}
                libraryPickerSetRef={this.libraryPickerSetRef}
                formDeleteSetRef={this.formDeleteSetRef}
                formQuestionSetRef={this.formQuestionSetRef}
                isVisibleLoadingCenter={isVisible}
                isShowBackHeader={true}
                isScrollEnabled={false}
                styleBody={style.boxMainBody}
                isShowInfo={true}
                isShowQRCodeButton={false}
                isShowHeader={true}
                isShowVersion={false}
                isShowVersionName={false}>
                <Text style={style.title}>SẢN PHẨM</Text>
                <Text style={style.responsibility}>
                    {`${company} tự chịu trách nhiệm với các thông tin kê khai này`}
                </Text>
                <View style={style.tab}>
                    <View style={style.tabHeader}>
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
                                                translateX: animationTabHeaderItem1,
                                            },
                                        ],
                                        opacity: interpolationTabItem1,
                                    },
                                ]}></Animated.View>
                            <Text
                                style={[
                                    style.tabHeaderItemText,
                                    currentTab == 0 ? style.tabHeaderItemTextActive : {},
                                ]}>
                                Thông tin chung
                            </Text>
                        </TouchableOpacity>
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
                                                translateX: animationTabHeaderItem2,
                                            },
                                        ],
                                        opacity: interpolationTabItem2,
                                    },
                                ]}></Animated.View>
                            <Text
                                style={[
                                    style.tabHeaderItemText,
                                    currentTab == 1 ? style.tabHeaderItemTextActive : {},
                                ]}>
                                Thông tin mở rộng
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
                                        opacity: interpolationTabItem3,
                                    },
                                ]}></Animated.View>
                            <Text
                                style={[
                                    style.tabHeaderItemText,
                                    currentTab == 2 ? style.tabHeaderItemTextActive : {},
                                ]}>
                                Hình ảnh
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.tabBody}>
                        <Animated.View
                            style={[
                                style.tabBodyItem,
                                {
                                    transform: [
                                        {
                                            translateX: interpolationTabBodyItem1,
                                        },
                                    ],
                                    opacity: interpolationTabItem1,
                                },
                            ]}>
                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                keyboardDismissMode="interactive"
                                keyboardShouldPersistTaps="handled"
                                style={style.form}>
                                {verifiedStatus == null ? null : verifiedStatus == 2 ? (
                                    <View style={style.accuracy}>
                                        <Text style={style.content}>
                                            Sản phẩm đã được kiểm chứng và xác thực bởi
                                        </Text>
                                        <Text style={style.group}>LACOGROUP</Text>
                                    </View>
                                ) : (
                                    <View style={style.notAccuracy}>
                                        <Text style={style.content}>
                                            Thông tin chưa được kiểm chứng và xác thực
                                        </Text>
                                    </View>
                                )}

                                <View style={[style.formItemMulti]}>
                                    <View style={[style.formItemMultiItem]}>
                                        <Text style={style.formItemLabel}>Hình ảnh đại diện</Text>
                                        <View style={style.formItemItemImage}>
                                            {avatarFile ? (
                                                <Image
                                                    resizeMode="stretch"
                                                    style={style.formInfoScaleItemImage}
                                                    type={0}
                                                    uri={avatarFile}
                                                    center={true}
                                                />
                                            ) : (
                                                <Image
                                                    type={1}
                                                    uri={NoImage2}
                                                    style={style.formInfoScaleItemNoImage}
                                                    resizeMode="stretch"
                                                    center={true}
                                                />
                                            )}
                                            {isBelongTo ? (
                                                <View style={style.formInfoScaleItemWrapButton}>
                                                    {avatarFile ? (
                                                        <TouchableOpacity
                                                            onPress={this.onRemoveImageAvatar}
                                                            activeOpacity={0.8}
                                                            style={style.formInfoScaleItemRemove}>
                                                            <ICONS.trashWhite width={16} height={16} />
                                                        </TouchableOpacity>
                                                    ) : null}
                                                    <TouchableOpacity
                                                        onPress={this.onChooseImageAvatar}
                                                        activeOpacity={0.8}
                                                        style={style.formInfoScaleItemChoose}>
                                                        <ICONS.edit width={16} height={16} />
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                </View>
                                <View style={[style.formItemMulti]}>
                                    <View style={[style.formItemMultiItem]}>
                                        <Text style={style.formItemLabel}>Mã sản phẩm</Text>
                                        <TextInput
                                            editable={false}
                                            onSubmitEditing={this.onNextInputBarCode}
                                            value={code}
                                            onChangeText={this.onChangeValue('code')}
                                            maxLength={255}
                                            blurOnSubmit={false}
                                            returnKeyType="next"
                                            returnKeyLabel="Tiếp tục"
                                            style={[
                                                style.formItemInput,
                                                style.disableBackgroundColor,
                                            ]}
                                        />
                                    </View>
                                    <View style={[style.formItemMultiItem]}>
                                        <Text style={style.formItemLabel}>Mã vạch</Text>
                                        <TextInput
                                            editable={isBelongTo}
                                            onSubmitEditing={this.onNextInputName}
                                            ref={ref => (this.inputBarCode = ref)}
                                            value={barCode}
                                            onChangeText={this.onChangeValue('barCode')}
                                            maxLength={255}
                                            blurOnSubmit={false}
                                            returnKeyType="next"
                                            returnKeyLabel="Tiếp tục"
                                            style={style.formItemInput}
                                        />
                                    </View>
                                    {/* <View style={[style.formItemMultiItem, style.formItemMultiItemWrapQRCode]}>
                                        <Image resizeMode='stretch' style={style.formItemMultiItemQRCode} type={0} uri='https://printgo.vn/uploads/media/790919/tao-ma-qr-code-san-pham-1_1620927223.jpg' />
                                    </View> */}
                                </View>
                                <View style={style.formItem}>
                                    <Text
                                        style={[style.formItemLabel, style.formItemLabelRequired]}>
                                        Tên sản phẩm
                                    </Text>
                                    <TextInput
                                        editable={isBelongTo ? !isLocked : false}
                                        onSubmitEditing={this.onNextInputExpiredNum}
                                        ref={ref => (this.inputName = ref)}
                                        value={name}
                                        onChangeText={this.onChangeValue('name')}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        returnKeyType="next"
                                        returnKeyLabel="Tiếp tục"
                                        style={[
                                            style.formItemInput,
                                            isLocked ? style.disableBackgroundColor : null,
                                        ]}
                                    />
                                </View>
                                <View style={style.formItem}>
                                    <Text
                                        style={[style.formItemLabel, style.formItemLabelRequired]}>
                                        Ngành nghề
                                    </Text>
                                    <TouchableOpacity
                                        disabled={isBelongTo ? isLocked : true}
                                        onPress={this.onPopupField}
                                        activeOpacity={0.8}
                                        style={[
                                            style.formItemSelect,
                                            style.formItemSelectMultiline,
                                            isLocked ? style.disableBackgroundColor : null,
                                        ]}>
                                        <Text style={style.formItemSelectText}>{_fieldName}</Text>
                                        {isLocked ? null : (
                                            <View style={style.formItemSelectIcon}>
                                                <ICONS.caretDown2 width={16} height={16} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={[style.formItemMulti]}>
                                    <View style={[style.formItemMultiItem]}>
                                        <Text
                                            style={[
                                                style.formItemLabel,
                                                style.formItemLabelRequired,
                                            ]}>
                                            Nhóm sản phẩm
                                        </Text>
                                        <TouchableOpacity
                                            disabled={isBelongTo ? isLocked : true}
                                            onPress={this.onPopupMaterialType}
                                            activeOpacity={0.8}
                                            style={[
                                                style.formItemSelect,
                                                isLocked ? style.disableBackgroundColor : null,
                                            ]}>
                                            <Text style={style.formItemSelectText}>
                                                {productGroupsName}
                                            </Text>
                                            {isLocked ? null : (
                                                <View style={style.formItemSelectIcon}>
                                                    <ICONS.caretDown2 width={16} height={16} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[style.formItemMultiItem]}>
                                        <Text
                                            style={[
                                                style.formItemLabel,
                                                style.formItemLabelRequired,
                                            ]}>
                                            Loại sản phẩm
                                        </Text>
                                        <TouchableOpacity
                                            disabled={isBelongTo ? isLocked : true}
                                            onPress={this.onPopupProductType}
                                            activeOpacity={0.8}
                                            style={[
                                                style.formItemSelect,
                                                isLocked ? style.disableBackgroundColor : null,
                                            ]}>
                                            <Text style={style.formItemSelectText}>
                                                {productTypeName}
                                            </Text>
                                            {isLocked ? null : (
                                                <View style={style.formItemSelectIcon}>
                                                    <ICONS.caretDown2 width={16} height={16} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={[style.formItemMultiItem, style.formItemMultiItemWrapQRCode]}>
                                        <Image resizeMode='stretch' style={style.formItemMultiItemQRCode} type={0} uri='https://printgo.vn/uploads/media/790919/tao-ma-qr-code-san-pham-1_1620927223.jpg' />
                                    </View> */}
                                </View>

                                <View style={style.formItem}>
                                    <Text
                                        style={[style.formItemLabel, style.formItemLabelRequired]}>
                                        Nhà sản xuất
                                    </Text>
                                    <View style={style.formItemGroup}>
                                        <TouchableOpacity
                                            disabled={!isBelongTo}
                                            onPress={this.onPopupPartner}
                                            activeOpacity={0.8}
                                            style={style.formItemSelect}>
                                            <Text style={style.formItemSelectText}>
                                                {partnerName}
                                            </Text>
                                            <View style={style.formItemSelectIcon}>
                                                <ICONS.caretDown2 width={16} height={16} />
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.onAddPartner}
                                            activeOpacity={0.8}
                                            style={style.formItemGroupAddButton}>
                                            <ICONS.add width={16} height={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={style.formItem}>
                                    <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Xuất xứ</Text>
                                    <TouchableOpacity
                                        disabled={!isBelongTo}
                                        onPress={this.onPopupOrigin}
                                        activeOpacity={0.8}
                                        style={style.formItemSelect}>
                                        <Text style={style.formItemSelectText}>{originName}</Text>

                                        <View style={style.formItemSelectIcon}>
                                            <ICONS.caretDown2 width={16} height={16} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>Đơn vị tính nhập/xuất</Text>
                                    <TextInput
                                        editable={false}
                                        onSubmitEditing={this.onNextInputBarCode}
                                        value={unitName}
                                        onChangeText={this.onChangeValue('weight')}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        returnKeyType="next"
                                        returnKeyLabel="Tiếp tục"
                                        style={[
                                            style.formItemInput,
                                            {
                                                backgroundColor: COLORS.lightAqua3,
                                            },
                                        ]}
                                    />
                                </View>
                                {checkType ? null : (
                                    <>
                                        <View style={[style.formItemMulti]}>
                                            <View style={[style.formItemMultiItem]}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>
                                                    Thời hạn sử dụng
                                                </Text>
                                                <TextInput
                                                    editable={isBelongTo ? !isLocked : false}
                                                    onSubmitEditing={this.onNextInputQualityNum}
                                                    ref={ref => (this.inputExpiredNum = ref)}
                                                    keyboardType="number-pad"
                                                    value={expiredNum}
                                                    onChangeText={this.onChangeValue('expiredNum')}
                                                    maxLength={255}
                                                    blurOnSubmit={false}
                                                    returnKeyType="next"
                                                    returnKeyLabel="Tiếp tục"
                                                    style={[
                                                        style.formItemInput,
                                                        isLocked ? style.disableBackgroundColor : null,
                                                        {
                                                            height: 35,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <View style={style.formItemMultiItem}>
                                                <Text style={[style.formItemLabel, style.formItemLabelRequired]}>Theo</Text>
                                                <RNPickerSelect
                                                    disabled={isBelongTo ? isLocked : true}
                                                    useNativeAndroidPickerStyle={false}
                                                    fixAndroidTouchableBug={true}
                                                    placeholder={{
                                                        label: 'Chọn loại thời hạn',
                                                        inputLabel: 'Chọn loại thời hạn',
                                                        value: null,
                                                        ...style.filterItemSelectPlaceHolder,
                                                    }}
                                                    value={typeDateId}
                                                    style={{
                                                        inputIOSContainer:
                                                            style.filterItemSelectContainerIOS,
                                                        inputAndroidContainer:
                                                            style.filterItemSelectContainerAndroid,
                                                        inputAndroid: [
                                                            style.filterItemSelectInputAndroid,
                                                            isLocked ? style.disableBackgroundColor : null,
                                                        ],
                                                        inputIOS: [
                                                            style.filterItemSelectInputIOS,
                                                            isLocked ? style.disableBackgroundColor : null,
                                                        ],
                                                        iconContainer: [
                                                            style.filterItemSelectIcon,
                                                            isLocked ? style.disableBackgroundColor : null,
                                                        ],
                                                    }}
                                                    onValueChange={this.onChangeTypeDate}
                                                    items={PRODUCT_TYPE_DATES}
                                                    Icon={() =>
                                                        isLocked ? null : (
                                                            <ICONS.caretDown2 width={16} height={16} />
                                                        )
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View style={style.formItem}>
                                            <Text style={[style.formItemLabel, style.formItemLabelRequired]}>
                                                Loại thời hạn sử dụng
                                            </Text>
                                            <RNPickerSelect
                                                disabled={isBelongTo ? isLocked : true}
                                                useNativeAndroidPickerStyle={false}
                                                fixAndroidTouchableBug={true}
                                                placeholder={{
                                                    label: 'Chọn loại',
                                                    inputLabel: '',
                                                    value: null,
                                                    ...style.filterItemSelectPlaceHolder,
                                                }}
                                                style={{
                                                    inputIOSContainer: style.filterItemSelectContainerIOS,
                                                    inputAndroidContainer:
                                                        style.filterItemSelectContainerAndroid,
                                                    inputAndroid: [
                                                        style.filterItemSelectInputAndroid,
                                                        isLocked ? style.disableBackgroundColor : null,
                                                    ],
                                                    inputIOS: [
                                                        style.filterItemSelectInputIOS,
                                                        isLocked ? style.disableBackgroundColor : null,
                                                    ],
                                                    iconContainer: [
                                                        style.filterItemSelectIcon,
                                                        isLocked ? style.disableBackgroundColor : null,
                                                    ],
                                                }}
                                                value={productExpiredType}
                                                onValueChange={this.onChangeExpiredType}
                                                items={PRODUCT_EXPIRED_TYPE}
                                                Icon={() =>
                                                    isLocked ? null : (
                                                        <ICONS.caretDown2 width={16} height={16} />
                                                    )
                                                }
                                            />
                                        </View>
                                    </>
                                )}
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>Số công bố chất lượng</Text>
                                    <TextInput
                                        editable={isBelongTo ? true : false}
                                        onSubmitEditing={this.onAdd}
                                        ref={ref => (this.inputQualityNum = ref)}
                                        value={qualityNum}
                                        onChangeText={this.onChangeValue('qualityNum')}
                                        maxLength={255}
                                        blurOnSubmit={false}
                                        returnKeyType="done"
                                        returnKeyLabel="Xong"
                                        style={style.formItemInput}
                                    />
                                </View>
                                {/* <View style={style.formItem}>
                                    <TouchableOpacity
                                        disabled={isBelongTo ? isLocked : true}
                                        onPress={this.onIsMaterial}
                                        activeOpacity={0.8}
                                        style={style.formItemCheckItem}>
                                        <View
                                            style={[
                                                style.formItemCheckItemCheck,
                                                isMaterial ? style.formItemCheckItemCheckActive : {},
                                            ]}>
                                            <View
                                                style={[
                                                    style.formItemCheckItemCheckCircle,
                                                    isMaterial
                                                        ? style.formItemCheckItemCheckCircleActive
                                                        : {},
                                                ]}></View>
                                        </View>
                                        <Text style={style.formItemCheckItemText}>
                                            Là sản phẩm kiêm nguyên vật liệu
                                        </Text>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={style.formItemAddWrap}>
                                    <Text style={style.formItemAddTitle}>Đơn vị quy đổi</Text>
                                    <TouchableOpacity
                                        onPress={this.onPopupProductUnit}
                                        activeOpacity={0.8}
                                        style={style.formItemAddButton}>
                                        <ICONS.add width={16} height={16} />
                                    </TouchableOpacity>
                                </View>
                                <View style={style.table}>
                                    <View style={style.tableHeader}>
                                        <View style={style.tableHeaderRow}>
                                            <View
                                                style={[style.tableHeaderItem, style.tableHeaderItem1]}>
                                                <Text style={style.tableHeaderItemText}>Stt</Text>
                                            </View>
                                            <View
                                                style={[style.tableHeaderItem, style.tableHeaderItem2]}>
                                                <Text style={style.tableHeaderItemText}>
                                                    Đơn vị tính
                                                </Text>
                                            </View>
                                            <View
                                                style={[style.tableHeaderItem, style.tableHeaderItem3]}>
                                                <Text style={style.tableHeaderItemText}>Quy đổi</Text>
                                            </View>
                                            <View
                                                style={[style.tableHeaderItem, style.tableHeaderItem4]}>
                                                <Text style={style.tableHeaderItemText}>
                                                    Hiện báo cáo
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    style.tableHeaderItem,
                                                    style.tableHeaderItem5,
                                                ]}></View>
                                        </View>
                                    </View>
                                    <View style={style.tableBody}>
                                        {productUnits.map((item, index) => {
                                            return (
                                                <View key={index} style={style.tableBodyRow}>
                                                    <View
                                                        style={[style.tableBodyItem, style.tableBodyItem1]}>
                                                        <Text style={style.tableBodyItemText}>
                                                            {index + 1}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[style.tableBodyItem, style.tableBodyItem2]}>
                                                        <Text style={style.tableBodyItemText}>
                                                            {item.unitName}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[style.tableBodyItem, style.tableBodyItem3]}>
                                                        <TextInput
                                                            editable={
                                                                item.isNew
                                                                    ? true
                                                                    : (verifiedStatus ==
                                                                        VERIFY_PRODUCTS.verified ||
                                                                        isLocked) &&
                                                                        item.companyId == companyId
                                                                        ? false
                                                                        : true
                                                            }
                                                            onChangeText={this.onChangeProductValue(
                                                                item.unitId,
                                                            )}
                                                            keyboardType="number-pad"
                                                            style={style.tableBodyItemInput}
                                                            value={item.value}></TextInput>
                                                    </View>
                                                    <TouchableOpacity
                                                        disabled={
                                                            verifiedStatus == VERIFY_PRODUCTS.verified ||
                                                                isLocked
                                                                ? true
                                                                : false
                                                        }
                                                        onPress={this.onCheckIsReport(item.unitId)}
                                                        activeOpacity={0.8}
                                                        style={[style.tableBodyItem, style.tableBodyItem4]}>
                                                        <View
                                                            style={[
                                                                style.tableBodyItemCheck,
                                                                item.isReport
                                                                    ? style.tableBodyItemCheckActive
                                                                    : {},
                                                            ]}>
                                                            <View
                                                                style={[
                                                                    style.tableBodyItemCheckCircle,
                                                                    item.isReport
                                                                        ? style.tableBodyItemCheckCircleActive
                                                                        : {},
                                                                ]}></View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {item.isNew ||
                                                        !(
                                                            (verifiedStatus == VERIFY_PRODUCTS.verified ||
                                                                isLocked) &&
                                                            item.companyId == companyId
                                                        ) ? (
                                                        <View
                                                            style={[
                                                                style.tableBodyItem,
                                                                style.tableBodyItem5,
                                                            ]}>
                                                            <TouchableOpacity
                                                                onPress={this.onDeleteProductUnit(item)}
                                                                activeOpacity={0.8}
                                                                style={style.tableBodyItemRemove}>
                                                                <ICONS.trash width={16} height={16} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ) : (
                                                        <View
                                                            style={[
                                                                style.tableBodyItem,
                                                                style.tableBodyItem5,
                                                            ]}></View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </Animated.View>
                        <Animated.View
                            style={[
                                style.tabBodyItem,
                                {
                                    transform: [
                                        {
                                            translateX: interpolationTabBodyItem2,
                                        },
                                    ],
                                    opacity: interpolationTabItem2,
                                },
                            ]}>
                            <KeyboardAwareScrollView
                                overScrollMode="never"
                                scrollEnabled={true}
                                enableOnAndroid={true}
                                showsVerticalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                keyboardDismissMode="interactive"
                                keyboardShouldPersistTaps="handled"
                                style={style.form}>
                                <View style={style.formItem}>
                                    <Text style={style.formItemLabel}>Giới thiệu</Text>
                                    <ScrollView
                                        keyboardDismissMode={'none'}
                                        nestedScrollEnabled={true}
                                        scrollEventThrottle={20}>
                                        <RichToolbar
                                            selectedIconTint={COLORS.primary}
                                            style={style.formItemToolBar}
                                            editor={this.richEditorIntroduce}
                                            disabled={false}
                                            onPressAddImage={this.onPressAddImageEditor(
                                                this.richEditorIntroduce,
                                            )}
                                            onInsertLink={this.onInsertLinkEditor(
                                                this.richEditorIntroduce,
                                            )}
                                            actions={[
                                                actions.undo,
                                                actions.redo,
                                                actions.setBold,
                                                actions.setItalic,
                                                actions.setUnderline,
                                                actions.alignLeft,
                                                actions.alignCenter,
                                                actions.alignRight,
                                                actions.insertBulletsList,
                                                actions.insertLink,
                                                actions.insertOrderedList,
                                                actions.insertBulletsList,
                                                actions.setStrikethrough,
                                                actions.checkboxList,
                                                actions.blockquote,
                                                actions.code,
                                                actions.line,
                                                actions.keyboard,
                                                actions.removeFormat,
                                            ]}
                                        />
                                    </ScrollView>
                                    <RichEditor
                                        containerStyle={style.formItemEditor}
                                        actions={[
                                            actions.undo,
                                            actions.redo,
                                            actions.heading1,
                                            actions.heading4,
                                            actions.setBold,
                                            actions.setItalic,
                                            actions.setUnderline,
                                            actions.foreColor,
                                            actions.hiliteColor,
                                            actions.alignLeft,
                                            actions.alignCenter,
                                            actions.alignRight,
                                            actions.insertBulletsList,
                                            actions.insertLink,
                                            actions.insertOrderedList,
                                            actions.insertBulletsList,
                                            actions.setStrikethrough,
                                            actions.checkboxList,
                                            actions.blockquote,
                                            actions.code,
                                            actions.line,
                                            actions.keyboard,
                                            actions.removeFormat,
                                        ]}
                                        onChange={this.onChangeEditor('introduce')}
                                        initialHeight={100}
                                        ref={this.richEditorIntroduce}
                                        initialContentHTML={introduce}
                                    />
                                </View>
                                <View style={[style.formItem]}>
                                    <Text style={style.formItemLabel}>Quy trình sản xuất</Text>
                                    <ScrollView
                                        keyboardDismissMode={'none'}
                                        nestedScrollEnabled={true}
                                        scrollEventThrottle={20}>
                                        <RichToolbar
                                            selectedIconTint={COLORS.primary}
                                            style={style.formItemToolBar}
                                            editor={this.richEditorProductionProcess}
                                            disabled={false}
                                            onInsertLink={this.onInsertLinkEditor(
                                                this.richEditorProductionProcess,
                                            )}
                                            actions={[
                                                actions.undo,
                                                actions.redo,
                                                actions.setBold,
                                                actions.setItalic,
                                                actions.setUnderline,
                                                actions.alignLeft,
                                                actions.alignCenter,
                                                actions.alignRight,
                                                actions.insertBulletsList,
                                                actions.insertLink,
                                                actions.insertOrderedList,
                                                actions.insertBulletsList,
                                                actions.setStrikethrough,
                                                actions.checkboxList,
                                                actions.blockquote,
                                                actions.code,
                                                actions.line,
                                                actions.keyboard,
                                                actions.removeFormat,
                                            ]}
                                        />
                                    </ScrollView>
                                    <RichEditor
                                        containerStyle={style.formItemEditor}
                                        actions={[
                                            actions.undo,
                                            actions.redo,
                                            actions.heading1,
                                            actions.heading4,
                                            actions.setBold,
                                            actions.setItalic,
                                            actions.setUnderline,
                                            actions.foreColor,
                                            actions.hiliteColor,
                                            actions.alignLeft,
                                            actions.alignCenter,
                                            actions.alignRight,
                                            actions.insertBulletsList,
                                            actions.insertLink,
                                            actions.insertOrderedList,
                                            actions.insertBulletsList,
                                            actions.setStrikethrough,
                                            actions.checkboxList,
                                            actions.blockquote,
                                            actions.code,
                                            actions.line,
                                            actions.keyboard,
                                            actions.removeFormat,
                                        ]}
                                        onChange={this.onChangeEditor('productionProcess')}
                                        initialHeight={100}
                                        ref={this.richEditorProductionProcess}
                                        initialContentHTML={productionProcess}
                                    />
                                </View>
                                {/*  */}
                                <View style={[style.formItem]}>
                                    <Text style={style.formItemLabel}>Thành phần</Text>
                                    <ScrollView
                                        keyboardDismissMode={'none'}
                                        nestedScrollEnabled={true}
                                        scrollEventThrottle={20}>
                                        <RichToolbar
                                            selectedIconTint={COLORS.primary}
                                            style={style.formItemToolBar}
                                            editor={this.richEditorIngredient}
                                            disabled={false}
                                            onInsertLink={this.onInsertLinkEditor(
                                                this.richEditorIngredient,
                                            )}
                                            actions={[
                                                actions.undo,
                                                actions.redo,
                                                actions.setBold,
                                                actions.setItalic,
                                                actions.setUnderline,
                                                actions.alignLeft,
                                                actions.alignCenter,
                                                actions.alignRight,
                                                actions.insertBulletsList,
                                                actions.insertLink,
                                                actions.insertOrderedList,
                                                actions.insertBulletsList,
                                                actions.setStrikethrough,
                                                actions.checkboxList,
                                                actions.blockquote,
                                                actions.code,
                                                actions.line,
                                                actions.keyboard,
                                                actions.removeFormat,
                                            ]}
                                        />
                                    </ScrollView>
                                    <RichEditor
                                        containerStyle={style.formItemEditor}
                                        actions={[
                                            actions.undo,
                                            actions.redo,
                                            actions.heading1,
                                            actions.heading4,
                                            actions.setBold,
                                            actions.setItalic,
                                            actions.setUnderline,
                                            actions.foreColor,
                                            actions.hiliteColor,
                                            actions.alignLeft,
                                            actions.alignCenter,
                                            actions.alignRight,
                                            actions.insertBulletsList,
                                            actions.insertLink,
                                            actions.insertOrderedList,
                                            actions.insertBulletsList,
                                            actions.setStrikethrough,
                                            actions.checkboxList,
                                            actions.blockquote,
                                            actions.code,
                                            actions.line,
                                            actions.keyboard,
                                            actions.removeFormat,
                                        ]}
                                        onChange={this.onChangeEditor('ingredient')}
                                        initialHeight={100}
                                        ref={this.richEditorIngredient}
                                        initialContentHTML={ingredient}
                                    />
                                </View>
                                {checkType ? null : (
                                    <>
                                        <View style={style.formItem}>
                                            <Text style={style.formItemLabel}>
                                                Hướng dẫn bảo quản
                                            </Text>
                                            <ScrollView
                                                keyboardDismissMode={'none'}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={20}>
                                                <RichToolbar
                                                    selectedIconTint={COLORS.primary}
                                                    style={style.formItemToolBar}
                                                    editor={this.richEditorStorage}
                                                    disabled={false}
                                                    onPressAddImage={this.onPressAddImageEditor(
                                                        this.richEditorStorage,
                                                    )}
                                                    onInsertLink={this.onInsertLinkEditor(
                                                        this.richEditorStorage,
                                                    )}
                                                    actions={[
                                                        actions.undo,
                                                        actions.redo,
                                                        actions.setBold,
                                                        actions.setItalic,
                                                        actions.setUnderline,
                                                        actions.alignLeft,
                                                        actions.alignCenter,
                                                        actions.alignRight,
                                                        actions.insertBulletsList,
                                                        actions.insertImage,
                                                        actions.insertLink,
                                                        actions.insertVideo,
                                                        actions.insertOrderedList,
                                                        actions.insertBulletsList,
                                                        actions.setStrikethrough,
                                                        actions.checkboxList,
                                                        actions.blockquote,
                                                        actions.code,
                                                        actions.line,
                                                        actions.keyboard,
                                                        actions.removeFormat,
                                                    ]}
                                                />
                                            </ScrollView>
                                            <RichEditor
                                                containerStyle={style.formItemEditor}
                                                actions={[
                                                    actions.undo,
                                                    actions.redo,
                                                    actions.heading1,
                                                    actions.heading4,
                                                    actions.setBold,
                                                    actions.setItalic,
                                                    actions.setUnderline,
                                                    actions.foreColor,
                                                    actions.hiliteColor,
                                                    actions.alignLeft,
                                                    actions.alignCenter,
                                                    actions.alignRight,
                                                    actions.insertBulletsList,
                                                    actions.insertImage,
                                                    actions.insertLink,
                                                    actions.insertVideo,
                                                    actions.insertOrderedList,
                                                    actions.insertBulletsList,
                                                    actions.setStrikethrough,
                                                    actions.checkboxList,
                                                    actions.blockquote,
                                                    actions.code,
                                                    actions.line,
                                                    actions.keyboard,
                                                    actions.removeFormat,
                                                ]}
                                                onChange={this.onChangeEditor('storage')}
                                                initialHeight={100}
                                                ref={this.richEditorStorage}
                                                initialContentHTML={storage}
                                            />
                                        </View>
                                        <View style={style.formItem}>
                                            <Text style={style.formItemLabel}>Hướng dẫn sử dụng</Text>
                                            <ScrollView
                                                overScrollMode="never"
                                                keyboardDismissMode={'none'}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={20}>
                                                <RichToolbar
                                                    selectedIconTint={COLORS.primary}
                                                    style={style.formItemToolBar}
                                                    editor={this.richEditorUsage}
                                                    disabled={false}
                                                    onPressAddImage={this.onPressAddImageEditor(
                                                        this.richEditorUsage,
                                                    )}
                                                    onInsertLink={this.onInsertLinkEditor(
                                                        this.richEditorUsage,
                                                    )}
                                                    actions={[
                                                        actions.undo,
                                                        actions.redo,
                                                        actions.setBold,
                                                        actions.setItalic,
                                                        actions.setUnderline,
                                                        actions.alignLeft,
                                                        actions.alignCenter,
                                                        actions.alignRight,
                                                        actions.insertBulletsList,
                                                        actions.insertImage,
                                                        actions.insertLink,
                                                        actions.insertVideo,
                                                        actions.insertOrderedList,
                                                        actions.insertBulletsList,
                                                        actions.setStrikethrough,
                                                        actions.checkboxList,
                                                        actions.blockquote,
                                                        actions.code,
                                                        actions.line,
                                                        actions.keyboard,
                                                        actions.removeFormat,
                                                    ]}
                                                />
                                            </ScrollView>
                                            <RichEditor
                                                containerStyle={style.formItemEditor}
                                                actions={[
                                                    actions.undo,
                                                    actions.redo,
                                                    actions.heading1,
                                                    actions.heading4,
                                                    actions.setBold,
                                                    actions.setItalic,
                                                    actions.setUnderline,
                                                    actions.foreColor,
                                                    actions.hiliteColor,
                                                    actions.alignLeft,
                                                    actions.alignCenter,
                                                    actions.alignRight,
                                                    actions.insertBulletsList,
                                                    actions.insertImage,
                                                    actions.insertLink,
                                                    actions.insertVideo,
                                                    actions.insertOrderedList,
                                                    actions.insertBulletsList,
                                                    actions.setStrikethrough,
                                                    actions.checkboxList,
                                                    actions.blockquote,
                                                    actions.code,
                                                    actions.line,
                                                    actions.keyboard,
                                                    actions.removeFormat,
                                                ]}
                                                onChange={this.onChangeEditor('usage')}
                                                initialHeight={100}
                                                ref={this.richEditorUsage}
                                                initialContentHTML={usage}
                                            />
                                        </View>
                                        <View style={style.formItem}>
                                            <Text style={style.formItemLabel}>Cảnh báo sử dụng</Text>
                                            <ScrollView
                                                overScrollMode="never"
                                                keyboardDismissMode={'none'}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={20}>
                                                <RichToolbar
                                                    selectedIconTint={COLORS.primary}
                                                    style={style.formItemToolBar}
                                                    editor={this.richEditorWarningUsage}
                                                    disabled={false}
                                                    onPressAddImage={this.onPressAddImageEditor(
                                                        this.richEditorWarningUsage,
                                                    )}
                                                    onInsertLink={this.onInsertLinkEditor(
                                                        this.richEditorWarningUsage,
                                                    )}
                                                    actions={[
                                                        actions.undo,
                                                        actions.redo,
                                                        actions.setBold,
                                                        actions.setItalic,
                                                        actions.setUnderline,
                                                        actions.alignLeft,
                                                        actions.alignCenter,
                                                        actions.alignRight,
                                                        actions.insertBulletsList,
                                                        actions.insertImage,
                                                        actions.insertLink,
                                                        actions.insertVideo,
                                                        actions.insertOrderedList,
                                                        actions.insertBulletsList,
                                                        actions.setStrikethrough,
                                                        actions.checkboxList,
                                                        actions.blockquote,
                                                        actions.code,
                                                        actions.line,
                                                        actions.keyboard,
                                                        actions.removeFormat,
                                                    ]}
                                                />
                                            </ScrollView>
                                            <RichEditor
                                                containerStyle={style.formItemEditor}
                                                actions={[
                                                    actions.undo,
                                                    actions.redo,
                                                    actions.heading1,
                                                    actions.heading4,
                                                    actions.setBold,
                                                    actions.setItalic,
                                                    actions.setUnderline,
                                                    actions.foreColor,
                                                    actions.hiliteColor,
                                                    actions.alignLeft,
                                                    actions.alignCenter,
                                                    actions.alignRight,
                                                    actions.insertBulletsList,
                                                    actions.insertImage,
                                                    actions.insertLink,
                                                    actions.insertVideo,
                                                    actions.insertOrderedList,
                                                    actions.insertBulletsList,
                                                    actions.setStrikethrough,
                                                    actions.checkboxList,
                                                    actions.blockquote,
                                                    actions.code,
                                                    actions.line,
                                                    actions.keyboard,
                                                    actions.removeFormat,
                                                ]}
                                                onChange={this.onChangeEditor('warningUsage')}
                                                initialHeight={100}
                                                ref={this.richEditorWarningUsage}
                                                initialContentHTML={warningUsage}
                                            />
                                        </View>
                                        <View style={style.formItem}>
                                            <Text style={style.formItemLabel}>Quy cách đóng gói</Text>
                                            <ScrollView
                                                overScrollMode="never"
                                                keyboardDismissMode={'none'}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={20}>
                                                <RichToolbar
                                                    selectedIconTint={COLORS.primary}
                                                    style={style.formItemToolBar}
                                                    editor={this.richEditorPacking}
                                                    disabled={false}
                                                    onPressAddImage={this.onPressAddImageEditor(
                                                        this.richEditorPacking,
                                                    )}
                                                    onInsertLink={this.onInsertLinkEditor(
                                                        this.richEditorPacking,
                                                    )}
                                                    actions={[
                                                        actions.undo,
                                                        actions.redo,
                                                        actions.setBold,
                                                        actions.setItalic,
                                                        actions.setUnderline,
                                                        actions.alignLeft,
                                                        actions.alignCenter,
                                                        actions.alignRight,
                                                        actions.insertBulletsList,
                                                        actions.insertImage,
                                                        actions.insertLink,
                                                        actions.insertVideo,
                                                        actions.insertOrderedList,
                                                        actions.insertBulletsList,
                                                        actions.setStrikethrough,
                                                        actions.checkboxList,
                                                        actions.blockquote,
                                                        actions.code,
                                                        actions.line,
                                                        actions.keyboard,
                                                        actions.removeFormat,
                                                    ]}
                                                />
                                            </ScrollView>
                                            <RichEditor
                                                containerStyle={style.formItemEditor}
                                                actions={[
                                                    actions.undo,
                                                    actions.redo,
                                                    actions.heading1,
                                                    actions.heading4,
                                                    actions.setBold,
                                                    actions.setItalic,
                                                    actions.setUnderline,
                                                    actions.foreColor,
                                                    actions.hiliteColor,
                                                    actions.alignLeft,
                                                    actions.alignCenter,
                                                    actions.alignRight,
                                                    actions.insertBulletsList,
                                                    actions.insertImage,
                                                    actions.insertLink,
                                                    actions.insertVideo,
                                                    actions.insertOrderedList,
                                                    actions.insertBulletsList,
                                                    actions.setStrikethrough,
                                                    actions.checkboxList,
                                                    actions.blockquote,
                                                    actions.code,
                                                    actions.line,
                                                    actions.keyboard,
                                                    actions.removeFormat,
                                                ]}
                                                onChange={this.onChangeEditor('packing')}
                                                initialHeight={100}
                                                ref={this.richEditorPacking}
                                                initialContentHTML={packing}
                                            />
                                        </View>
                                    </>
                                )}
                            </KeyboardAwareScrollView>
                        </Animated.View>
                        <Animated.View
                            style={[
                                style.tabBodyItem,
                                {
                                    transform: [
                                        {
                                            translateX: interpolationTabBodyItem3,
                                        },
                                    ],
                                    opacity: interpolationTabItem3,
                                },
                            ]}>
                            <KeyboardAwareScrollView
                                overScrollMode="never"
                                showsVerticalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                keyboardDismissMode="interactive"
                                keyboardShouldPersistTaps="handled"
                                style={style.form}>
                                <View style={style.formItemSectionImage}>
                                    <Text style={style.formItemLabel}>Hình ảnh sản phẩm</Text>
                                    <View style={style.formItemSectionImageContent}>
                                        <View style={style.formItemWrapImageList}>
                                            {imageFiles.map(item => {
                                                return (
                                                    <View key={item.id} style={style.formItemWrapImage}>
                                                        <Image
                                                            style={style.formItemImage}
                                                            resizeMode="stretch"
                                                            type={item.file || item.uri ? 0 : 1}
                                                            uri={
                                                                item.file || item.uri
                                                                    ? item.file || item.uri
                                                                    : NoImage2
                                                            }
                                                        />
                                                        <View style={style.formItemFunction}>
                                                            {item.file || item.uri ? (
                                                                <TouchableOpacity
                                                                    onPress={this.onRemoveImageFile(item.id)}
                                                                    activeOpacity={0.8}
                                                                    style={style.formItemFunctionRemove}>
                                                                    <ICONS.trashWhite width={16} height={16} />
                                                                </TouchableOpacity>
                                                            ) : null}
                                                            <TouchableOpacity
                                                                onPress={this.onChooseImageFile(item.id)}
                                                                activeOpacity={0.8}
                                                                style={style.formItemFunctionChoose}>
                                                                <ICONS.edit width={16} height={16} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        <TouchableOpacity
                                            onPress={this.onAddImageFile}
                                            activeOpacity={0.8}
                                            style={style.formItemAddImage}>
                                            <ICONS.add width={16} height={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={style.formItemSectionImage}>
                                    <Text style={style.formItemLabel}>Thông tin kiểm định</Text>
                                    <View style={style.formItemSectionImageContent}>
                                        <View style={style.formItemWrapImageList}>
                                            {checkFiles.map(item => {
                                                return (
                                                    <View key={item.id} style={style.formItemWrapImage}>
                                                        <Image
                                                            style={style.formItemImage}
                                                            resizeMode="stretch"
                                                            type={item.file || item.uri ? 0 : 1}
                                                            uri={
                                                                item.file || item.uri
                                                                    ? item.file || item.uri
                                                                    : NoImage2
                                                            }
                                                        />
                                                        <View style={style.formItemFunction}>
                                                            {item.file || item.uri ? (
                                                                <TouchableOpacity
                                                                    onPress={this.onRemoveCheckFile(item.id)}
                                                                    activeOpacity={0.8}
                                                                    style={style.formItemFunctionRemove}>
                                                                    <ICONS.trashWhite width={16} height={16} />
                                                                </TouchableOpacity>
                                                            ) : null}
                                                            <TouchableOpacity
                                                                onPress={this.onChooseCheckFile(item.id)}
                                                                activeOpacity={0.8}
                                                                style={style.formItemFunctionChoose}>
                                                                <ICONS.edit width={16} height={16} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        <TouchableOpacity
                                            onPress={this.onAddCheckFile}
                                            activeOpacity={0.8}
                                            style={style.formItemAddImage}>
                                            <ICONS.add width={16} height={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={style.formItemSectionImage}>
                                    <Text style={style.formItemLabel}>Thông tin chứng nhận</Text>
                                    <View style={style.formItemSectionImageContent}>
                                        <View style={style.formItemWrapImageList}>
                                            {certificateFiles.map(item => {
                                                return (
                                                    <View key={item.id} style={style.formItemWrapImage}>
                                                        <Image
                                                            style={style.formItemImage}
                                                            resizeMode="stretch"
                                                            type={item.file || item.uri ? 0 : 1}
                                                            uri={
                                                                item.file || item.uri
                                                                    ? item.file || item.uri
                                                                    : NoImage2
                                                            }
                                                        />
                                                        <View style={style.formItemFunction}>
                                                            {item.file || item.uri ? (
                                                                <TouchableOpacity
                                                                    onPress={this.onRemoveCertificateFile(
                                                                        item.id,
                                                                    )}
                                                                    activeOpacity={0.8}
                                                                    style={style.formItemFunctionRemove}>
                                                                    <ICONS.trashWhite width={16} height={16} />
                                                                </TouchableOpacity>
                                                            ) : null}
                                                            <TouchableOpacity
                                                                onPress={this.onChooseCertificateFile(item.id)}
                                                                activeOpacity={0.8}
                                                                style={style.formItemFunctionChoose}>
                                                                <ICONS.edit width={16} height={16} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        <TouchableOpacity
                                            onPress={this.onAddCertificateFile}
                                            activeOpacity={0.8}
                                            style={style.formItemAddImage}>
                                            <ICONS.add width={16} height={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </Animated.View>
                    </View>
                </View>
                <View style={style.function}>
                    {id ? (
                        <>
                            <AuthenticateView claims={[CLAIMS.product.edit]} checkType={0}>
                                <TouchableOpacity
                                    onPress={this.onClickEdit}
                                    activeOpacity={0.8}
                                    style={style.functionUpdate}>
                                    <ICONS.save width={18} height={18} />
                                    <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                                </TouchableOpacity>
                            </AuthenticateView>
                            {/* )}
                </>
              )} */}
                        </>
                    ) : (
                        <AuthenticateView claims={[CLAIMS.product.add]} checkType={0}>
                            <TouchableOpacity
                                onPress={this.onAdd}
                                activeOpacity={0.8}
                                style={style.functionUpdate}>
                                <ICONS.save width={18} height={18} />
                                <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                            </TouchableOpacity>
                        </AuthenticateView>
                    )}
                </View>
            </BoxMainContainer>
        );
    }
}

export default AddProduct;
