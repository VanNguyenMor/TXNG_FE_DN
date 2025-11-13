import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import GoogleMapReact from 'google-map-react';
import { Editor } from '@tinymce/tinymce-react';
import { companyAction } from "../../../actions/CompanyAction";
import { handleGenTree } from "../../../helpers/trees";
import Select from "components/Select";
import SelectTreeMulti from "components/SelectTreeMulti";
import classes from './index.module.css';
import '../../../assets/css/page/insert_or_update_manage_info_company.css';
import IconSave from "../../../assets/img/buttons/btnLuu.png";
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import { validEmail, validPhone, MAX_FILE_IMAGE_SIZE, EXTENSION_FILE_IMAGE, validSize, validExtensionFileImage } from 'bases/helper';
import Message, { TYPES } from '../../../components/message';
import CloseIcon from "../../../assets/img/buttons/DONG.png";
import axios from "axios";
import PopupMessage from "../../../components/PopupMessage";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"

import {
    Button,
    Container
} from "reactstrap";
const LOCATION_DEFAULT = {
    lat: 14.058324,
    lng: 108.277199
}

class InsertOrUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinceName: '',
            provinceId: null,
            districtId: null,
            wardId: null,
            name: '',
            code: '',
            fieldId: '',
            introduce: '',
            address: '',
            phoneNumber: '',
            fax: '',
            email: '',
            website: '',
            contactName: '',
            contactPhoneNumber: '',
            contactEmail: '',
            currentTab: 0,
            errors: {},
            fileLogo: '',
            ArrayFileAdd: '',
            ArrayFileAddGP: '',
            ArrayFileAddGCN: '',
            fileImage: '',
            fileImageGP: '',
            fileImageGCN: '',
            pathLogo: '',
            mfileImg: '',
            mfileImgGP: '',
            mfileImgGCN: '',
            pathImage: '',
            pathImageGP: '',
            pathImageGCN: '',
            pathImageDefaul: '',
            pathImageDefaulGP: '',
            pathImageDefaulGCN: '',
            location: null,
            isShowMapViewLocation: false,
            locationChange: null,
            id: null,
            fields: []
        };

        this.refFileLogo = null;
        this.refFileImage = null;
        this.refFileImageGP = null;
        this.refFileImageGCN = null;
        this.refEditor = null;
        this.redSelect = null;

    }

    componentWillReceiveProps(nextProp) {
        let fieldDataParent = [];

        if (typeof (nextProp.fields) !== 'undefined') {
            fieldDataParent = handleGenTree(nextProp.fields, 'fieldName');

            fieldDataParent.map((item, key) => {
                item['index'] = key + 1
            });

            this.setState({ fields: fieldDataParent });
        }
    }

    async componentDidMount() {
        const { history, getListField, getListProvince, getListDistrictByProvince, getListWardByDistrict, match, getDetailCompany } = this.props;

        if (match) {
            if (match.params) {
                if (match.params.id) {
                    const data = await getDetailCompany({ id: match.params.id });

                    if (data.ok) {
                        const company = (data.data || {}).data || {};

                        let _location = null;

                        if (company.location) {
                            const splitLocation = (company.location || '').split(',');

                            if (splitLocation[0] && splitLocation[1]) {
                                _location = {
                                    lat: parseFloat(splitLocation[0]),
                                    lng: parseFloat(splitLocation[1])
                                }
                            }
                        }
                        if (company.images) {
                            const pIm = company.images;
                            const spl = pIm.split(';')
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    pathImageDefaul: spl
                                }
                            })
                        }

                        if (company.businessLicenses) {
                            const pIm = company.businessLicenses;
                            const spl = pIm.split(';')
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    pathImageDefaulGP: spl
                                }
                            })
                        }

                        if (company.certifications) {
                            const pIm = company.certifications;
                            const spl = pIm.split(';')
                            this.setState(previousState => {
                                return {
                                    ...previousState,
                                    pathImageDefaulGCN: spl
                                }
                            })
                        }
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                id: company.id,
                                name: company.companyName,
                                code: company.taxCode,
                                fieldId: company.fieldID,
                                address: company.address,
                                introduce: company.introduce,
                                phoneNumber: company.phoneNumber,
                                fax: company.fax,
                                email: company.email,
                                website: company.website,
                                contactName: company.contactName,
                                contactEmail: company.contactEmail,
                                contactPhoneNumber: company.contactPhone,
                                location: _location,
                                districtId: company.districtID,
                                districtName: company.districtName,
                                wardId: company.wardID,
                                wardName: company.wardName,
                                fileLogo: company.logo,
                                fileImage: company.images,
                                pathLogo: company.logo,
                                isCompany: company.isCompany,
                            }
                        });
                    } else {
                        history.goBack();
                    }
                }
            }
        }

        getListField({ search: "", "filter": "", "orderBy": "", "page": -1, "limit": 0 });

        getListProvince({ search: "", "filter": "", "orderBy": "", "page": -1, "limit": 0 }).then(res => {
            const data = (res.data || {}).data || null;
            if (data) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        provinceId: data[0].id,
                        provinceName: data[0].provinceName
                    }
                });
            }
        });

        getListDistrictByProvince({});
    }

    onChangeSelect = name => value => {

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        }, () => {
            const { getListWardByDistrict } = this.props;

            if (name === 'districtId') {
                if (this.redSelect) {
                    this.redSelect.resetValue();
                }
                getListWardByDistrict({ id: value });
            }
        });
    }

    onChangeValue = name => e => {
        const value = e.target.value;

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        });
    }

    onChangeTab = tab => () => {
        let { introduce } = this.state;
        if (tab == 1) {
            introduce = (this.refEditor) ? (this.refEditor.getContent()) : introduce;
            this.setState(previousState => {
                return {
                    ...previousState,
                    introduce
                }
            })
        }
        this.setState(previousState => {
            return {
                ...previousState,
                currentTab: tab
            }
        });
    }

    onUpdateFileLogo = () => {
        this.refFileLogo.click();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    onUpdateFileImageGP = () => {
        this.refFileImageGP.click();
    }

    onUpdateFileImageGCN = () => {
        this.refFileImageGCN.click();
    }

    onChangeFileLogo = e => {
        const files = e.target.files || [];

        if (files.length > 0) {
            const file = files[0] || null;

            if (file) {
                const errors = {};

                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });

                if (!validSize(file.size, MAX_FILE_IMAGE_SIZE)) {
                    errors.fileLogo = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
                }

                if (!validExtensionFileImage(file.name)) {
                    errors.fileLogo = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });

                if (Object.keys(errors).length > 0) {
                    return;
                }

                const pathLogo = Array.from(files).map((f) => URL.createObjectURL(f));

                this.setState(previousState => {
                    return {
                        ...previousState,
                        fileLogo: file,
                        pathLogo
                    }
                });
            }
        }
    }

    onChangeEditor = (content) => {
        this.setState({ introduce: content })
    }

    onChangeFileImage = e => {
        const { id, pathImageDefaul } = this.state;
        const files = e.target.files || [];
        // if (this.state.mfileImg != '') {

        //     let _mfileImg = [...this.state.mfileImg];
        //     for (let i = 0; i < files.length; i++) {
        //         _mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
        //     }
        //     this.setState(previousState => {
        //         return {
        //             ...previousState,
        //             mfileImg: _mfileImg
        //         }
        //     })
        // } else {
        //     this.setState({ mfileImg: files })
        // }

        // console.log(files)

        if (files.length > 0) {
            // const file = files[0] || null;
            const file = files || null;
            if (file) {
                const errors = {};

                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });
                for (let i = 0; i < file.length; i++) {
                    if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
                        errors.fileImage = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
                    }
                    if (!validExtensionFileImage(file[i].name)) {
                        errors.fileImage = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
                    }
                }
                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });

                if (Object.keys(errors).length > 0) {
                    return;
                }
                if (this.state.mfileImg != '') {
                    let _mfileImg = [...this.state.mfileImg];
                    for (let i = 0; i < files.length; i++) {
                        _mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
                    }
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            mfileImg: _mfileImg
                        }
                    })
                } else {
                    this.setState({ mfileImg: files })
                }
                const pathImage = Array.from(files).map((ee) => URL.createObjectURL(ee));
                if (this.state.ArrayFileAdd != '') {
                    let _ArrayFileAdd = this.state.ArrayFileAdd;
                    for (let i = 0; i < files.length; i++) {
                        _ArrayFileAdd.push(pathImage[i]);
                    }
                } else {
                    this.setState({ ArrayFileAdd: pathImage })
                }

                if (id) {
                    if (pathImageDefaul) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaul: this.state.pathImageDefaul.concat(pathImage)

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaul: pathImage

                            }
                        });
                    }
                } else {
                    if (pathImageDefaul != "") {
                        pathImageDefaul.push(pathImage)
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaul: pathImageDefaul

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaul: pathImage

                            }
                        });
                    }
                }

            }
        }
    }

    onChangeFileImageGP = e => {
        const { id, pathImageDefaulGP } = this.state;
        const files = e.target.files || [];
        // if (this.state.mfileImg != '') {

        //     let _mfileImg = [...this.state.mfileImg];
        //     for (let i = 0; i < files.length; i++) {
        //         _mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
        //     }
        //     this.setState(previousState => {
        //         return {
        //             ...previousState,
        //             mfileImg: _mfileImg
        //         }
        //     })
        // } else {
        //     this.setState({ mfileImg: files })
        // }

        // console.log(files)

        if (files.length > 0) {
            // const file = files[0] || null;
            const file = files || null;
            if (file) {
                const errors = {};

                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });
                for (let i = 0; i < file.length; i++) {
                    if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
                        errors.fileImage = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
                    }
                    if (!validExtensionFileImage(file[i].name)) {
                        errors.fileImage = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
                    }
                }
                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });

                if (Object.keys(errors).length > 0) {
                    return;
                }
                if (this.state.mfileImgGP != '') {
                    let _mfileImgGP = [...this.state.mfileImgGP];
                    for (let i = 0; i < files.length; i++) {
                        _mfileImgGP.push(new File([files[i]], files[i].name, { type: files[i].type }));
                    }
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            mfileImgGP: _mfileImgGP
                        }
                    })
                } else {
                    this.setState({ mfileImgGP: files })
                }
                const pathImageGP = Array.from(files).map((ee) => URL.createObjectURL(ee));
                if (this.state.ArrayFileAddGP != '') {
                    let _ArrayFileAddGP = this.state.ArrayFileAddGP;
                    for (let i = 0; i < files.length; i++) {
                        _ArrayFileAddGP.push(pathImageGP[i]);
                    }
                } else {
                    this.setState({ ArrayFileAdd: pathImageGP })
                }

                if (id) {
                    if (pathImageDefaulGP) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGP: this.state.pathImageDefaulGP.concat(pathImageGP)

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGP: pathImageGP

                            }
                        });
                    }
                } else {
                    if (pathImageDefaulGP != "") {
                        pathImageDefaulGP.push(pathImageGP)
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGP: pathImageDefaulGP

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGP: pathImageGP

                            }
                        });
                    }
                }

            }
        }
    }

    onChangeFileImageGCN = e => {
        const { id, pathImageDefaulGCN } = this.state;
        const files = e.target.files || [];
        // if (this.state.mfileImgGCN != '') {

        //     let _mfileImgGCN = [...this.state.mfileImgGCN];
        //     for (let i = 0; i < files.length; i++) {
        //         _mfileImgGCN.push(new File([files[i]], files[i].name, { type: files[i].type }));
        //     }
        //     this.setState(previousState => {
        //         return {
        //             ...previousState,
        //             mfileImgGCN: _mfileImgGCN
        //         }
        //     })
        // } else {
        //     this.setState({ mfileImgGCN: files })
        // }

        // console.log(files)

        if (files.length > 0) {
            // const file = files[0] || null;
            const file = files || null;
            if (file) {
                const errors = {};

                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });
                for (let i = 0; i < file.length; i++) {
                    if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
                        errors.fileImage = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
                    }
                    if (!validExtensionFileImage(file[i].name)) {
                        errors.fileImage = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
                    }
                }
                this.setState(previousState => {
                    return {
                        ...previousState,
                        errors
                    }
                });

                if (Object.keys(errors).length > 0) {
                    return;
                }
                if (this.state.mfileImgGCN != '') {
                    let _mfileImgGCN = [...this.state.mfileImgGCN];
                    for (let i = 0; i < files.length; i++) {
                        _mfileImgGCN.push(new File([files[i]], files[i].name, { type: files[i].type }));
                    }
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            mfileImgGCN: _mfileImgGCN
                        }
                    })
                } else {
                    this.setState({ mfileImgGCN: files })
                }
                const pathImageGCN = Array.from(files).map((ee) => URL.createObjectURL(ee));
                if (this.state.ArrayFileAddGCN != '') {
                    let _ArrayFileAddGCN = this.state.ArrayFileAddGCN;
                    for (let i = 0; i < files.length; i++) {
                        _ArrayFileAddGCN.push(pathImageGCN[i]);
                    }
                } else {
                    this.setState({ ArrayFileAddGCN: pathImageGCN })
                }

                if (id) {
                    if (pathImageDefaulGCN) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGCN: this.state.pathImageDefaulGCN.concat(pathImageGCN)

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGCN: pathImageGCN

                            }
                        });
                    }
                } else {
                    if (pathImageDefaulGCN != "") {
                        pathImageDefaulGCN.push(pathImageGCN)
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGCN: pathImageDefaulGCN

                            }
                        });
                    } else {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                //fileImage: file,
                                // pathImage
                                pathImageDefaulGCN: pathImageGCN

                            }
                        });
                    }
                }

            }
        }
    }

    onDeleteFileLogo = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                fileLogo: null,
                pathLogo: ''
            }
        });

        this.refFileLogo.files = null;
    }

    onDeleteFileImage = (e) => {
        const { pathImageDefaul, fileImage, ArrayFileAdd } = this.state;
        var array = [...pathImageDefaul]
        var index = array.indexOf(e);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({
                pathImageDefaul: array,
            });
        }

        let flah = false;
        if (fileImage) {
            const spl = fileImage.split(';')
            Array.from(spl).filter(x => x === e).map(
                item => { flah = true }
            )

            if (flah == true) {
                spl.splice(spl.indexOf(e), 1);
                var fileImageSend = spl.join(';')
                this.setState(previousState => {
                    return {
                        ...previousState,
                        fileImage: fileImageSend
                    }
                })
            }
        }

        let flag = false;
        if (ArrayFileAdd) {
            Array.from(ArrayFileAdd).filter(x => x === e).map(
                item => {
                    flag = true
                }
            )

            if (flag == true) {
                ArrayFileAdd.splice(ArrayFileAdd.indexOf(e), 1);
                let _ArrayFileAdd = [];
                for (let i = 0; i < ArrayFileAdd.length; i++) {
                    // _ArrayFileAdd.push(new File([ArrayFileAdd[i]], `${ArrayFileAdd[i].replace('blob:http://localhost:5000/')}.jpeg`,
                    //     { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    fetch(ArrayFileAdd[i]).then(res => res.blob()).then(blob => {
                        _ArrayFileAdd.push(new File([blob], `${ArrayFileAdd[i].replace('blob:http://localhost:5000/')}.jpeg`,
                            { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    });
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        mfileImg: _ArrayFileAdd
                    }
                })
            }

        }
        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         fileImage: null,
        //         pathImage: ''
        //     }
        // });

        // this.refFileImage.files = null;
    }

    onDeletefileImageGP = (e) => {
        const { pathImageDefaulGP, fileImageGP, ArrayFileAddGP } = this.state;
        var array = [...pathImageDefaulGP]
        var index = array.indexOf(e);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({
                pathImageDefaulGP: array,
            });
        }

        let flah = false;
        if (fileImageGP) {
            const spl = fileImageGP.split(';')
            Array.from(spl).filter(x => x === e).map(
                item => { flah = true }
            )

            if (flah == true) {
                spl.splice(spl.indexOf(e), 1);
                var fileImageGPSend = spl.join(';')
                this.setState(previousState => {
                    return {
                        ...previousState,
                        fileImageGP: fileImageGPSend
                    }
                })
            }
        }

        let flag = false;
        if (ArrayFileAddGP) {
            Array.from(ArrayFileAddGP).filter(x => x === e).map(
                item => {
                    flag = true
                }
            )

            if (flag == true) {
                ArrayFileAddGP.splice(ArrayFileAddGP.indexOf(e), 1);
                let _ArrayFileAddGP = [];
                for (let i = 0; i < ArrayFileAddGP.length; i++) {
                    // _ArrayFileAddGP.push(new File([ArrayFileAddGP[i]], `${ArrayFileAddGP[i].replace('blob:http://localhost:5000/')}.jpeg`,
                    //     { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    fetch(ArrayFileAddGP[i]).then(res => res.blob()).then(blob => {
                        _ArrayFileAddGP.push(new File([blob], `${ArrayFileAddGP[i].replace('blob:http://localhost:5000/')}.jpeg`,
                            { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    });
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        mfileImgGP: _ArrayFileAddGP
                    }
                })
            }

        }
        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         fileImageGP: null,
        //         pathImage: ''
        //     }
        // });

        // this.reffileImageGP.files = null;
    }

    onDeletefileImageGCN = (e) => {
        const { pathImageDefaulGCN, fileImageGCN, ArrayFileAddGCN } = this.state;
        var array = [...pathImageDefaulGCN]
        var index = array.indexOf(e);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({
                pathImageDefaulGCN: array,
            });
        }

        let flah = false;
        if (fileImageGCN) {
            const spl = fileImageGCN.split(';')
            Array.from(spl).filter(x => x === e).map(
                item => { flah = true }
            )

            if (flah == true) {
                spl.splice(spl.indexOf(e), 1);
                var fileImageGCNSend = spl.join(';')
                this.setState(previousState => {
                    return {
                        ...previousState,
                        fileImageGCN: fileImageGCNSend
                    }
                })
            }
        }

        let flag = false;
        if (ArrayFileAddGCN) {
            Array.from(ArrayFileAddGCN).filter(x => x === e).map(
                item => {
                    flag = true
                }
            )

            if (flag == true) {
                ArrayFileAddGCN.splice(ArrayFileAddGCN.indexOf(e), 1);
                let _ArrayFileAddGCN = [];
                for (let i = 0; i < ArrayFileAddGCN.length; i++) {
                    // _ArrayFileAddGCN.push(new File([ArrayFileAddGCN[i]], `${ArrayFileAddGCN[i].replace('blob:http://localhost:5000/')}.jpeg`,
                    //     { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    fetch(ArrayFileAddGCN[i]).then(res => res.blob()).then(blob => {
                        _ArrayFileAddGCN.push(new File([blob], `${ArrayFileAddGCN[i].replace('blob:http://localhost:5000/')}.jpeg`,
                            { lastModified: new Date().getTime(), type: 'image/jpeg' }));
                    });
                }

                this.setState(previousState => {
                    return {
                        ...previousState,
                        mfileImgGCN: _ArrayFileAddGCN
                    }
                })
            }

        }
        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         fileImageGCN: null,
        //         pathImage: ''
        //     }
        // });

        // this.reffileImageGCN.files = null;
    }
    onDeleteFileImageNew = (e) => {
        const { pathImage } = this.state;
        var array = [...pathImage]
        var index = array.indexOf(e)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({
                pathImage: array,
            });
        }
        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         fileImage: null,
        //         pathImage: ''
        //     }
        // });

        // this.refFileImage.files = null;
    }

    onUpdateLocation = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isShowMapViewLocation: true
            }
        });
    }

    onUpdate = () => {
        const {
            id,
            location,
            name,
            code,
            fieldId,
            provinceId,
            districtId,
            wardId,
            address,
            phoneNumber,
            fax,
            website,
            email,
            contactEmail,
            contactName,
            contactPhoneNumber,
            fileImage,
            fileImageGP,
            fileImageGCN,
            mfileImgGP,
            mfileImgGCN,
            mfileImg,
            fileLogo,
            isCompany
        } = this.state;
        const { addCompany, editCompany } = this.props;

        const errors = {};

        this.setState(previousState => {
            return {
                ...previousState,
                errors
            }
        });

        let introduce = '';
        let _fieldId = fieldId.split(',');

        if (this.refEditor) {
            introduce = this.refEditor.getContent();
        }

        if (!name) {
            errors.name = 'Tên doanh nghiệp không được bỏ trống';
        }

        if (name && (name || '').length > 1000) {
            errors.name = 'Tên doanh nghiệp không được nhập quá 1000 ký tự';
        }

        if (!code) {
            errors.code = 'Mã số thuế không được bỏ trống';
        }

        if (code && (code || '').length > 255) {
            errors.code = 'Mã số thuế không được nhập quá 255 ký tự';
        }

        if (!fieldId) {
            errors.fieldId = 'Ngành nghề không được bỏ trống';
        }

        // if (!provinceId) {
        //     errors.provinceId = 'Bạn vui lòng chọn tỉnh/thành';
        // }

        if (!districtId) {
            errors.districtId = 'Bạn vui lòng chọn quận/huyện';
        }

        if (!wardId) {
            errors.wardId = 'Bạn vui lòng chọn phường/xã';
        }

        if (!address) {
            errors.address = 'Địa chỉ không được bỏ trống';
        }

        if (!phoneNumber) {
            errors.phoneNumber = 'Điện thoại không được bỏ trống';
        }

        if (phoneNumber.trim() && !validPhone(phoneNumber.trim())) {
            errors.phoneNumber = 'Điện thoại không đúng định dạng';
        }

        if (fax && (fax || '').length > 255) {
            errors.fax = 'Fax không được nhập quá 255 ký tự';
        }

        if (email && (email || '').length > 255) {
            errors.email = 'Email không được nhập quá 255 ký tự';
        }

        if (email && !validEmail(email)) {
            errors.email = 'Email không đúng định dạng';
        }

        if (website && (website || '').length > 255) {
            errors.website = 'Website không được nhập quá 255 ký tự';
        }

        if (contactName && (contactName || '').length > 255) {
            errors.contactName = 'Người liên hệ không được nhập quá 255 ký tự';
        }

        // if (!contactPhoneNumber) {
        //     errors.contactPhoneNumber = 'Điện thoại Người liên hệ không được bỏ trống';
        // }

        if (contactPhoneNumber && (contactPhoneNumber || '').length > 255) {
            errors.contactPhoneNumber = 'Điện thoại Người liên hệ không được nhập quá 255 ký tự';
        }

        if (contactPhoneNumber.trim() && !validPhone(contactPhoneNumber.trim())) {
            errors.contactPhoneNumber = 'Điện thoại không đúng định dạng';
        }

        if (this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/doanh_nghiep' || isCompany == 0) {
            if (!contactEmail) {
                errors.contactEmail = 'Email người liên hệ không được bỏ trống';
            }

            if (contactEmail && (contactEmail || '').length > 255) {
                errors.contactEmail = 'Email người liên hệ không được nhập quá 255 ký tự';
            }

            if (contactEmail && !validEmail(contactEmail)) {
                errors.contactEmail = 'Email người liên hệ không đúng định dạng';
            }
        }

        this.setState(previousState => {
            return {
                ...previousState,
                errors
            }
        });

        if (Object.keys(errors).length > 0) {
            return;
        }

        let _location = '';

        if (location) {
            _location = `${location.lat},${location.lng}`;
        }
        //console.log(id);
        const formData = new FormData();

        formData.append('ID', id);
        formData.append('CompanyName', name);
        formData.append('TaxCode', code);
        // formData.append('FieldID', _fieldId);
        for (let i = 0; i < _fieldId.length; i++) {
            formData.append(`FieldIDs[${i}]`, _fieldId[i]);
        }
        formData.append('Introduce', introduce);
        formData.append('Address', address);
        formData.append('ProvinceID', provinceId);
        formData.append('DistrictID', districtId);
        formData.append('WardID', wardId);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('Fax', fax);
        formData.append('Images', fileImage);
        formData.append('BusinessLicenses', fileImageGP);
        formData.append('Certifications', fileImageGCN);
        formData.append('Email', email);
        formData.append('Website', website);
        formData.append('ContactName', contactName);
        formData.append('ContactPhone', (this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/ca_nhan' || isCompany == 1) ? phoneNumber : contactPhoneNumber);
        formData.append('ContactEmail', (this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/ca_nhan' || isCompany == 1) ? email : contactEmail);
        formData.append('Location', _location);
        formData.append('IsCompany', this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/doanh_nghiep' ? 0 : 1);
        formData.append('Logofile', (this.refFileLogo && this.refFileLogo.files.length > 0) ? fileLogo : null);
        // formData.append('files', (this.refFileImage && this.refFileImage.files) ? fileImage : null);
        if (mfileImg) {
            for (let i = 0; i < mfileImg.length; i++) {
                formData.append(`files`, (this.refFileImage && this.refFileImage.files) ? mfileImg[i] : null)
            }
        }
        if (mfileImgGP) {
            for (let i = 0; i < mfileImgGP.length; i++) {
                formData.append(`BusinessLicensesFile`, (this.refFileImageGP && this.refFileImageGP.files) ? mfileImgGP[i] : null)
            }
        }
        if (mfileImgGCN) {
            for (let i = 0; i < mfileImgGCN.length; i++) {
                formData.append(`CertificationFile`, (this.refFileImageGCN && this.refFileImageGCN.files) ? mfileImgGCN[i] : null)
            }
        }
        if (id) {
            editCompany(formData).then(res => {
                if (res.ok) {
                    // Message.show(TYPES.SUCCESS, 'Thông báo', 'Sửa doanh nghiệp thành công');

                    const timeOut = setTimeout(() => {
                        document.location.href = '/trang_chu/danh_sach_moi_dang_ky';

                        clearTimeout(timeOut);
                    }, 1000);
                }
                else {
                    //Message.show(TYPES.ERROR, 'Thông báo', res.message || 'Sửa doanh nghiệp thất bại');
                    this.setState({ errNoti: res.message });
                    this.toggleModal("popupMessage");
                    return;
                }
            });
        } else {
            addCompany(formData).then(res => {
                if (res.ok) {
                    // Message.show(TYPES.SUCCESS, 'Thông báo', 'Thêm doanh nghiệp thành công');
                    const timeOut = setTimeout(() => {
                        document.location.href = '/trang_chu/danh_sach_moi_dang_ky';

                        clearTimeout(timeOut);
                    }, 1000);
                }
                // else {
                //     Message.show(TYPES.ERROR, 'Thông báo', res.message || 'Thêm doanh nghiệp thất bại');
                // }
                else {
                    this.setState({ errNoti: res.data.message });
                    this.toggleModal("popupMessage");
                    return;
                }
            });
        }
    }

    toggleModal = (state, type) => {
        if (this.state[state] && type == 1) {
            return;
        } else {
            this.setState({
                [state]: !this.state[state],
                detail: null,
                errorUpdate: {},
                errorInsert: {},

            });
        }
    };

    onCloseMapViewLocation = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isShowMapViewLocation: false
            }
        });
    }

    onChangeLocation = location => {
        this.setState(previousState => {
            return {
                ...previousState,
                locationChange: {
                    lat: location.center.lat,
                    lng: location.center.lng
                }
            }
        });
    }

    onConfirmLocation = () => {
        const locationChange = this.state.locationChange;
        if (locationChange) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    location: locationChange,
                    locationChange: null,
                    isShowMapViewLocation: false
                }
            });
        }
    }

    onDeleteLocation = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                location: LOCATION_DEFAULT
            }
        });
    }

    render() {
        const {
            isShowMapViewLocation,
            location,
            pathLogo,
            pathImage,
            pathImageDefaul,
            pathImageDefaulGP,
            pathImageDefaulGCN,
            fileLogo,
            fileImage,
            errors,
            provinceName,
            currentTab,
            name,
            code,
            fieldId,
            provinceId,
            districtId,
            wardId,
            introduce,
            address,
            phoneNumber,
            fax,
            website,
            email,
            contactEmail,
            contactName,
            contactPhoneNumber,
            districtName,
            wardName,
            popupMessage,
            errNoti,
            provinceData,
            isCompany
        } = this.state;
        const { provinces, districts, wards, hookClass, hookSpacing } = this.props;
        const { fields } = this.state;
        return (
            <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`} style={{ paddingTop: 0 }}>
                <Container fluid className={typeof (hookSpacing) !== 'undefined' && hookSpacing}>
                    {(this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/doanh_nghiep' || isCompany == 0) && (
                        <div className='wrap-manage-company'>
                            <div className='wrap-manage-company-function'>
                                <div className="row" style={{ paddingLeft: 30 }}>
                                    <Button
                                        type="button"
                                        className={`btn-success-cs`}
                                        style={{ margin: "inherit" }}
                                        onClick={this.onUpdate}
                                    >
                                        <img src={SaveIcon1} alt='Lưu lại' />
                                        <span>Lưu lại</span>
                                    </Button>

                                    <Button
                                        color="default"
                                        className={`btn-danger-cs`}
                                        style={{ marginLeft: 30 }}
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() =>
                                            document.location.href = '/trang_chu/danh_sach_moi_dang_ky'
                                        }

                                    >
                                        <img src={CloseIcon} alt='Thoát ra' />
                                        <span>Thoát ra</span>
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-manage-company-header'>
                                <button onClick={this.onChangeTab(0)} className={`wrap-manage-company-header-button ${currentTab == 0 ? 'active' : ''}`}>THÔNG TIN CƠ BẢN</button>
                                <button onClick={this.onChangeTab(1)} className={`wrap-manage-company-header-button ${currentTab == 1 ? 'active' : ''}`}>THÔNG TIN MỞ RỘNG</button>
                            </div>
                            <div className='wrap-manage-company-body'>
                                {currentTab == 0 ? (
                                    <div className='wrap-manage-company-body-section'>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Tên doanh nghiệp&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input autoFocus={true} value={name} onChange={this.onChangeValue('name')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' type='text' />
                                                <p className="form-error-message">{errors.name || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Mã số thuế&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input value={code} onChange={this.onChangeValue('code')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' type='text' />
                                                <p className="form-error-message">{errors.code || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <SelectTreeMulti
                                                    className='wrap-manage-company-body-item-select wrap-manage-company-body-item-box-select'
                                                    name="fieldId"
                                                    title='Chọn ngành nghề'
                                                    data={fields}
                                                    defaultValue={fieldId}
                                                    labelName='fieldName'
                                                    val='id'
                                                    isMulti={true}
                                                    handleChange={this.onChangeSelect('fieldId')}
                                                />
                                                <p className="form-error-message">{errors.fieldId || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-introduce'>Giới thiệu chung</label>
                                            {/* <textarea value={introduce} onChange={this.onChangeValue('introduce')} rows="5" className='wrap-manage-company-body-item-textarea'></textarea> */}
                                            <Editor
                                                onInit={(_, editor) => {
                                                    this.refEditor = editor;
                                                }}
                                                initialValue={introduce}
                                                init={{
                                                    height: 300,
                                                    menubar: false,
                                                    plugins: [
                                                        'advlist autolink lists link image charmap print preview anchor',
                                                        'searchreplace visualblocks code fullscreen',
                                                        'insertdatetime media table paste code help wordcount'
                                                    ],
                                                    toolbar: 'undo redo | formatselect | ' +
                                                        'bold italic backcolor | alignleft aligncenter ' +
                                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                                        'removeformat | help',
                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                }}
                                            // onEditorChange={this.onChangeEditor}
                                            />
                                        </div>
                                        <p className="form-error-message">{errors.introduce || ''}</p>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Địa chỉ&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input value={address} onChange={this.onChangeValue('address')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                <p className="form-error-message">{errors.address || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'></label>
                                            <div className='wrap-manage-company-body-item-group-address'>
                                                <div className='wrap-manage-company-body-item-group-address-item'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'
                                                        style={{
                                                            lineHeight: "41px",
                                                            border: "1px solid #cad1d7",
                                                            borderRadius: "0.375rem",
                                                            webkitBorderRadius: "0.375rem",
                                                            mozBorderRadius: "0.375rem",
                                                            msBorderRradius: "0.375rem",
                                                            oBorderRadius: "0.375rem",
                                                            backgroundColor: "#fff",
                                                            paddingLeft: "10px",

                                                        }}>
                                                        {provinces.length <= 1 ? (
                                                            <div>
                                                                <div>{provinceName}</div>
                                                            </div>
                                                        ) : (
                                                            <Select
                                                                isDisable={true}
                                                                defaultValue={provinceId}
                                                                labelMark={provinceName}
                                                                className='wrap-manage-company-body-item-select'
                                                                name="provinceId"
                                                                title='Chọn Tỉnh/Thành'
                                                                data={provinces}
                                                                labelName='provinceName'
                                                                val='id'
                                                                handleChange={this.onChangeSelect('provinceId')}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="form-error-message">{errors.provinceId || ''}</p>
                                                </div>
                                                <div className='wrap-manage-company-body-item-group-address-item wrap-manage-company-body-item-group-address-item-district'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'>
                                                        <Select
                                                            className='wrap-manage-company-body-item-select'
                                                            name="districtId"
                                                            title='Chọn Quận/Huyện'
                                                            data={districts || []}
                                                            labelName='districtName'
                                                            defaultValue={districtId}
                                                            value={districtId}
                                                            labelMark={districtName}
                                                            val='id'
                                                            handleChange={this.onChangeSelect('districtId')}
                                                        />
                                                    </div>
                                                    <p className="form-error-message">{errors.districtId || ''}</p>
                                                </div>
                                                <div className='wrap-manage-company-body-item-group-address-item'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'>

                                                        <Select
                                                            ref={ref => this.redSelect = ref}
                                                            className='wrap-manage-company-body-item-select'
                                                            name="wardId"
                                                            title='Chọn Phường/Xã'
                                                            data={wards}
                                                            defaultValue={wardId}
                                                            value={wardId}
                                                            labelMark={wardName}
                                                            labelName='wardName'
                                                            val='id'
                                                            handleChange={this.onChangeSelect('wardId')}
                                                        />

                                                    </div>
                                                    <p className="form-error-message">{errors.wardId || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <div className='wrap-manage-company-body-item-1'>
                                                <label className='wrap-manage-company-body-item-label'>Điện thoại&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={phoneNumber} onChange={this.onChangeValue('phoneNumber')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.phoneNumber || ''}</p>
                                                </div>
                                            </div>
                                            <div className='wrap-manage-company-body-item-2' >
                                                <label className='wrap-manage-company-body-item-label'>Fax</label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={fax} onChange={this.onChangeValue('fax')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.fax || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <div className='wrap-manage-company-body-item-1'>
                                                <label className='wrap-manage-company-body-item-label'>Email</label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={email} onChange={this.onChangeValue('email')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.email || ''}</p>
                                                </div>
                                            </div>
                                            <div className='wrap-manage-company-body-item-2'>
                                                <label className='wrap-manage-company-body-item-label'>Website</label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={website} onChange={this.onChangeValue('website')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.website || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Người liên hệ</label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input value={contactName} onChange={this.onChangeValue('contactName')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                <p className="form-error-message">{errors.contactName || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <div className='wrap-manage-company-body-item-1'>
                                                <label className='wrap-manage-company-body-item-label'>Điện thoại&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={contactPhoneNumber} onChange={this.onChangeValue('contactPhoneNumber')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.contactPhoneNumber || ''}</p>
                                                </div>
                                            </div>
                                            <div className='wrap-manage-company-body-item-2'>
                                                <label className='wrap-manage-company-body-item-label'>Email&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={contactEmail} onChange={this.onChangeValue('contactEmail')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.contactEmail || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : <div className='wrap-manage-company-body-section'>
                                    <div className='wrap-manage-company-body-item'>
                                        <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-location'>Vị trí</label>
                                        <div className='wrap-manage-company-body-item-map'>
                                            <div className='wrap-manage-company-body-item-map-view'>
                                                <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyAz1kbpa6CB_NQh5vQNJHfqTCSH_xGZFIU' }}
                                                    defaultCenter={LOCATION_DEFAULT}
                                                    center={location}
                                                    defaultZoom={7} />
                                                <div className='wrap-manage-company-body-item-map-view-drop'></div>
                                            </div>
                                            <div className='wrap-manage-company-body-item-box-function'>
                                                {location ? <button onClick={this.onDeleteLocation} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button> : null}
                                                <button onClick={this.onUpdateLocation} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Cập nhật</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='wrap-manage-company-body-item'>
                                        <input onChange={this.onChangeFileLogo} ref={ref => this.refFileLogo = ref} id='logo' type='file' className='hidden' style={{
                                            display: 'none'
                                        }} />
                                        <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-logo'>Logo</label>
                                        <div className='wrap-manage-company-body-item-box'>
                                            <img className='wrap-manage-company-body-item-image' src={pathLogo ? pathLogo : NoImg} />
                                            <div className='wrap-manage-company-body-item-box-function'>
                                                {fileLogo ? <button onClick={this.onDeleteFileLogo} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button> : null}
                                                <button onClick={this.onUpdateFileLogo} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Cập nhật</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='wrap-manage-company-body-item'>
                                        <input onChange={this.onChangeFileImageGP} ref={ref => this.refFileImageGP = ref} multiple id='image' type='file' className='hidden' style={{
                                            display: 'none'
                                        }} />
                                        <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-image'>Giấy phép</label>
                                        <div className='wrap-manage-company-body-item-box'>
                                            <div className='wrap-manage-company-body-item-box-function' style={{ justifyContent: 'flex-start' }}>
                                                <button onClick={this.onUpdateFileImageGP} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Thêm</button>
                                                <p className="form-error-message" style={{ marginLeft: 5 }}>{errors.fileImageGP || ''}</p>
                                            </div>
                                            <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                                                {pathImageDefaulGP != '' ? (
                                                    pathImageDefaulGP.map((e) => (
                                                        e != "" ?
                                                            (
                                                                <div>
                                                                    <img className='wrap-manage-company-body-item-image' src={e} style={{ padding: 5 }} />
                                                                    <div>
                                                                        <button style={{ margin: 5 }} onClick={() => this.onDeletefileImageGP(e)} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                            : null
                                                    ))
                                                ) : (
                                                    <img className='wrap-manage-company-body-item-image' style={{ padding: 5 }} src={NoImg} />
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className='wrap-manage-company-body-item'>
                                        <input onChange={this.onChangeFileImageGCN} ref={ref => this.refFileImageGCN = ref} multiple id='image' type='file' className='hidden' style={{
                                            display: 'none'
                                        }} />
                                        <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-image'>Giấy chứng nhận</label>
                                        <div className='wrap-manage-company-body-item-box'>
                                            <div className='wrap-manage-company-body-item-box-function' style={{ justifyContent: 'flex-start' }}>
                                                <button onClick={this.onUpdateFileImageGCN} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Thêm</button>
                                                <p className="form-error-message" style={{ marginLeft: 5 }}>{errors.fileImageGCN || ''}</p>
                                            </div>
                                            <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                                                {pathImageDefaulGCN != '' ? (
                                                    pathImageDefaulGCN.map((e) => (
                                                        e != "" ?
                                                            (
                                                                <div>
                                                                    <img className='wrap-manage-company-body-item-image' src={e} style={{ padding: 5 }} />
                                                                    <div>
                                                                        <button style={{ margin: 5 }} onClick={() => this.onDeletefileImageGCN(e)} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                            : null
                                                    ))
                                                ) : (
                                                    <img className='wrap-manage-company-body-item-image' style={{ padding: 5 }} src={NoImg} />
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className='wrap-manage-company-body-item'>
                                        <input onChange={this.onChangeFileImage} ref={ref => this.refFileImage = ref} multiple id='image' type='file' className='hidden' style={{
                                            display: 'none'
                                        }} />
                                        <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-image'>Hình ảnh</label>
                                        <div className='wrap-manage-company-body-item-box'>
                                            <div className='wrap-manage-company-body-item-box-function' style={{ justifyContent: 'flex-start' }}>
                                                {/* {fileImage ? <button onClick={this.onDeleteFileImage} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button> : null} */}
                                                <button onClick={this.onUpdateFileImage} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Thêm</button>
                                                <p className="form-error-message" style={{ marginLeft: 5 }}>{errors.fileImage || ''}</p>
                                            </div>
                                            <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                                                {pathImageDefaul != '' ? (
                                                    pathImageDefaul.map((e) => (
                                                        e != "" ?
                                                            (
                                                                <div>
                                                                    <img className='wrap-manage-company-body-item-image' src={e} style={{ padding: 5 }} />
                                                                    <div>
                                                                        <button style={{ margin: 5 }} onClick={() => this.onDeleteFileImage(e)} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                            : null
                                                    ))
                                                ) : (
                                                    <img className='wrap-manage-company-body-item-image' style={{ padding: 5 }} src={NoImg} />
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>}
                            </div>
                            {isShowMapViewLocation ? (
                                <div className='wrap-manage-company-location'>
                                    <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyAz1kbpa6CB_NQh5vQNJHfqTCSH_xGZFIU' }}
                                        defaultCenter={{
                                            lat: 14.058324,
                                            lng: 108.277199
                                        }}
                                        onChange={this.onChangeLocation}
                                        defaultZoom={7} />
                                    <div className='wrap-manage-company-location-function'>
                                        <button onClick={this.onCloseMapViewLocation}
                                            className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-close'>ĐÓNG</button>
                                        <button onClick={this.onConfirmLocation}
                                            className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-confirm'>CHỌN VỊ TRÍ NÀY</button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )
                    }

                    {
                        (this.props.match.url == '/trang_chu/them_danh_sach_moi_dang_ky/ca_nhan' || isCompany == 1) && (
                            <div className='wrap-manage-company'>
                                <div className='wrap-manage-company-function'>
                                    <div className="row" style={{ paddingLeft: 30 }}>
                                        <Button
                                            type="button"
                                            className={`btn-success-cs`}
                                            style={{ margin: "inherit" }}
                                            onClick={this.onUpdate}
                                        >
                                            <img src={SaveIcon1} alt='Lưu lại' />
                                            <span>Lưu lại</span>
                                        </Button>

                                        <Button
                                            color="default"
                                            className={`btn-danger-cs`}
                                            style={{ marginLeft: 30 }}
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() =>
                                                document.location.href = '/trang_chu/danh_sach_moi_dang_ky'
                                            }

                                        >
                                            <img src={CloseIcon} alt='Thoát ra' />
                                            <span>Thoát ra</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className='wrap-manage-company-body'>

                                    <div className='wrap-manage-company-body-section'>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Họ và tên&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input autoFocus={true} value={name} onChange={this.onChangeValue('name')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' type='text' />
                                                <p className="form-error-message">{errors.name || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Số CMND/CCCD&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input value={code} onChange={this.onChangeValue('code')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' type='text' />
                                                <p className="form-error-message">{errors.code || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <SelectTreeMulti
                                                    className='wrap-manage-company-body-item-select wrap-manage-company-body-item-box-select'
                                                    name="fieldId"
                                                    title='Chọn ngành nghề'
                                                    data={fields}
                                                    defaultValue={fieldId}
                                                    labelName='fieldName'
                                                    val='id'
                                                    isMulti={true}
                                                    handleChange={this.onChangeSelect('fieldId')}
                                                />
                                                <p className="form-error-message">{errors.fieldId || ''}</p>
                                            </div>
                                        </div>

                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'>Địa chỉ&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                            <div className='wrap-manage-company-body-item-box'>
                                                <input value={address} onChange={this.onChangeValue('address')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                <p className="form-error-message">{errors.address || ''}</p>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label'></label>
                                            <div className='wrap-manage-company-body-item-group-address'>
                                                <div className='wrap-manage-company-body-item-group-address-item'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'>
                                                        <Select
                                                            isDisable={true}
                                                            defaultValue={provinceId}
                                                            labelMark={provinceName}
                                                            className='wrap-manage-company-body-item-select'
                                                            name="provinceId"
                                                            title='Chọn Tỉnh/Thành'
                                                            data={provinces}
                                                            labelName='provinceName'
                                                            val='id'
                                                            handleChange={this.onChangeSelect('provinceId')}
                                                        />
                                                    </div>
                                                    <p className="form-error-message">{errors.provinceId || ''}</p>
                                                </div>
                                                <div className='wrap-manage-company-body-item-group-address-item wrap-manage-company-body-item-group-address-item-district'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'>
                                                        <Select
                                                            className='wrap-manage-company-body-item-select'
                                                            name="districtId"
                                                            title='Chọn Quận/Huyện'
                                                            data={districts || []}
                                                            labelName='districtName'
                                                            defaultValue={districtId}
                                                            value={districtId}
                                                            labelMark={districtName}
                                                            val='id'
                                                            handleChange={this.onChangeSelect('districtId')}
                                                        />
                                                    </div>
                                                    <p className="form-error-message">{errors.districtId || ''}</p>
                                                </div>
                                                <div className='wrap-manage-company-body-item-group-address-item'>
                                                    <div className='wrap-manage-company-body-item-group-address-item-box'>

                                                        <Select
                                                            ref={ref => this.redSelect = ref}
                                                            className='wrap-manage-company-body-item-select'
                                                            name="wardId"
                                                            title='Chọn Phường/Xã'
                                                            data={wards}
                                                            defaultValue={wardId}
                                                            value={wardId}
                                                            labelMark={wardName}
                                                            labelName='wardName'
                                                            val='id'
                                                            handleChange={this.onChangeSelect('wardId')}
                                                        />

                                                    </div>
                                                    <p className="form-error-message">{errors.wardId || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='wrap-manage-company-body-item'>
                                            <div className='wrap-manage-company-body-item-1'>
                                                <label className='wrap-manage-company-body-item-label'>Điện thoại&nbsp;<b style={{ color: 'red' }}>*</b></label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={phoneNumber} onChange={this.onChangeValue('phoneNumber')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.phoneNumber || ''}</p>
                                                </div>
                                            </div>
                                            <div className='wrap-manage-company-body-item-2' >
                                                <label className='wrap-manage-company-body-item-label'>Email</label>
                                                <div className='wrap-manage-company-body-item-box'>
                                                    <input value={email} onChange={this.onChangeValue('email')} className='wrap-manage-company-body-item-input wrap-manage-company-body-item-box-input' />
                                                    <p className="form-error-message">{errors.email || ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='wrap-manage-company-body-section'>
                                        <div className='wrap-manage-company-body-item'>
                                            <label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-location'>Vị trí</label>
                                            <div className='wrap-manage-company-body-item-map'>
                                                <div className='wrap-manage-company-body-item-map-view'>
                                                    <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyAz1kbpa6CB_NQh5vQNJHfqTCSH_xGZFIU' }}
                                                        defaultCenter={LOCATION_DEFAULT}
                                                        center={location}
                                                        defaultZoom={7} />
                                                    <div className='wrap-manage-company-body-item-map-view-drop'></div>
                                                </div>
                                                <div className='wrap-manage-company-body-item-box-function'>
                                                    {location ? <button onClick={this.onDeleteLocation} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-delete'>Xóa</button> : null}
                                                    <button onClick={this.onUpdateLocation} className='wrap-manage-company-body-item-box-function-button wrap-manage-company-body-item-box-function-button-update'>Cập nhật</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {isShowMapViewLocation ? (
                                    <div className='wrap-manage-company-location'>
                                        <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyAz1kbpa6CB_NQh5vQNJHfqTCSH_xGZFIU' }}
                                            defaultCenter={{
                                                lat: 14.058324,
                                                lng: 108.277199
                                            }}
                                            onChange={this.onChangeLocation}
                                            defaultZoom={7} />
                                        <div className='wrap-manage-company-location-function'>
                                            <button onClick={this.onCloseMapViewLocation} className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-close'>ĐÓNG</button>
                                            <button onClick={this.onConfirmLocation} className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-confirm'>CHỌN VỊ TRÍ NÀY</button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )
                    }
                    <PopupMessage
                        popupMessage={popupMessage}
                        moduleTitle={'Thông báo'}
                        moduleBody={errNoti}
                        toggleModal={this.toggleModal}
                    />
                </Container >
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.CompanyStore,
        location: state.LocationStore,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(companyAction, dispatch),
        ...bindActionCreators(actionLocationCreators, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InsertOrUpdate);