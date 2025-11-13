import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import Select from "components/Select";
import classes from './index.module.css';
import ButtonClose from "../../../assets/img/buttons/btnDongLocBui.png";
import ButtonSave from "../../../assets/img/buttons/btnLuuLocBui.png";
import CloseIcon from "../../../assets/img/buttons/DONG.png";
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import '../../../assets/css/page/insert_or_update_config_server.css';
import {
    Button,
} from "reactstrap";
import { data } from 'jquery';
class InsertOrUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {

            "id": '',
            'companyID': '',
            'companyName': '',
            'serverInfo': '',

            'ftp': '',
            'port': '',
            'ftpUserName': '',
            'ftpPassword': '',
            'limitedStore': '',
            'isUsed': 0,
            errorInserts: {}
        }
    }

    async componentDidMount() {

        const {
            id,
            getFtp,
            dataHandele
        } = this.props;
        //console.log(id)
        if (id) {
            const result = await getFtp({ id });
            const data = ((result || {}).data || {}).data || null;
            this.setState(previousState => {
                return {
                    ...previousState,
                    id: id,
                    companyID: data.companyID,
                    companyName: data.companyName,
                    serverInfo: data.serverInfo,
                    ftp: data.ftp,
                    port: data.port,
                    ftpUserName: data.ftpUserName,
                    ftpPassword: data.ftpPassword,
                    limitedStore: data.limitedStore,
                    isUsed: data.isUsed,
                    dataInsert: {
                        id: id,
                        companyID: data.companyID,
                        companyName: data.companyName,
                        serverInfo: data.serverInfo,
                        ftp: data.ftp,
                        port: data.port,
                        ftpUserName: data.ftpUserName,
                        ftpPassword: data.ftpPassword,
                        limitedStore: data.limitedStore,
                        isUsed: data.isUsed,
                    }
                }
            }
            )

        }
    }



    onChangeValue = name => e => {
        const value = e.target.value;

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        },
            () => {
                if (this.onHandleChangeValue) {
                    this.onHandleChangeValue(this.state);
                }
            }
        );
    }

    onChangeSelect = name => value => {
        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        }, () => {
            if (this.onHandleChangeValue) {
                this.onHandleChangeValue(this.state);
            }
        }
        );
    }

    onConfirm = () => {
        const { onConfirm, id, companyIdValue, dataHandele } = this.props;
        const {
            companyName,
            companyID,
            serverInfo,
            ftp,
            port,
            ftpUserName,
            ftpPassword,
            limitedStore,
            isUsed
        } = this.state;

        const errorInserts = this.checkDataInsert(true);
        this.setState(previousState => {
            return {
                ...previousState,
                errorInserts
            }
        });

        if (Object.keys(errorInserts).length > 0) {
            return;
        }
        //console.log(companyIdValue)
        if (id) {
            this.props.updateFtp({
                id: id,
                companyID: companyID,
                serverInfo: serverInfo,
                ftp: ftp,
                port: port,
                ftpUserName: ftpUserName,
                ftpPassword: ftpPassword,
                limitedStore: limitedStore,
                isUsed: isUsed
            }).then(res => {
                const data = (res || {}).data || {};
                dataHandele(data.status)
                this.setState({
                    dataStt: data.status
                }
                )
            }
            )
        } else {
            this.props.createFtp({
                companyID: companyID,
                serverInfo: serverInfo,
                ftp: ftp,
                port: port,
                ftpUserName: ftpUserName,
                ftpPassword: ftpPassword,
                limitedStore: limitedStore,
                isUsed: isUsed
            }).then(res => {
                const data = (res || {}).data || {};
                dataHandele(data.status)
                this.setState({
                    dataStt: data.status
                }
                )
            })
        }
        if (onConfirm) {
            onConfirm();
        }
    }

    onClose = () => {
        const { onClose } = this.props;

        if (onClose) {
            onClose();
        }
    }

    onHandleChangeValue = data => {

        this.setState(previousState => {
            return {
                ...previousState,
                dataInsert: data
            }
        }, () => {
            const errorInserts = this.checkDataInsert();

            this.setState(previousState => {
                return {
                    ...previousState,
                    errorInserts
                }
            });
        });
    }

    checkDataInsert = isCheck => {
        if (!isCheck) {
            return {};
        }

        const { dataInsert } = this.state;


        const companyID = dataInsert.companyID;
        const companyName = dataInsert.companyName;
        const serverInfo = dataInsert.serverInfo;
        const ftp = dataInsert.ftp;
        const port = dataInsert.port;
        const ftpUserName = dataInsert.ftpUserName;
        const ftpPassword = dataInsert.ftpPassword;
        const limitedStore = dataInsert.limitedStore;
        const isUsed = dataInsert.isUsed;

        const errorInserts = {};

        if (!companyID) {
            errorInserts.companyID = 'Chưa chọn doanh nghiệp/cá nhân';
        }

        if (!serverInfo) {
            errorInserts.serverInfo = 'Server không được bỏ trống';
        }

        if (!ftp) {
            errorInserts.ftp = 'FTP không được bỏ trống';
        }

        if (!ftpUserName) {
            errorInserts.ftpUserName = 'User name không được bỏ trống';
        }

        if (!ftpPassword) {
            errorInserts.ftpPassword = 'Mật khẩu không được bỏ trống';
        }

        if (!limitedStore) {
            errorInserts.limitedStore = 'Dung lượng không được bỏ trống';
        }
        return errorInserts;
    }

    render() {
        const { errors, dataCompany } = this.props;

        const _errors = errors || {};

        const {
            companyName,
            companyID,
            serverInfo,
            ftp,
            port,
            ftpUserName,
            ftpPassword,
            limitedStore,
            isUsed,
            errorInserts
        } = this.state;


        return (
            <div className='config-system-insert-or-update'>
                <div className='config-system-insert-or-update-form'>
                    <div className='config-system-insert-or-update-form-box'>
                        <div className='config-system-insert-or-update-form-box-header'>
                            THÊM FTP
                        </div>
                        <div className='config-system-insert-or-update-form-box-list'>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Doanh nghiệp/Cá nhân</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <Select
                                        className='config-system-insert-or-update-form-box-item-box-select'
                                        name="companyID"
                                        title='Chọn Doanh nghiệp/Cá nhân'
                                        data={dataCompany}
                                        labelName='companyName'
                                        val='id'
                                        labelMark={companyName}
                                        defaultValue={companyID}
                                        handleChange={this.onChangeSelect('companyID')}
                                    />
                                    <p className='form-error-message'>{errorInserts.companyID || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Server (Host/Domain)</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='text' className='config-system-insert-or-update-form-box-item-input'
                                        value={serverInfo} onChange={this.onChangeValue('serverInfo')}
                                    />
                                    <p className='form-error-message'>{errorInserts.serverInfo || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>FTP</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='text' className='config-system-insert-or-update-form-box-item-input'
                                        value={ftp} onChange={this.onChangeValue('ftp')}
                                    />
                                    <p className='form-error-message'>{errorInserts.ftp || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Port</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='text' className='config-system-insert-or-update-form-box-item-input'
                                        value={port} onChange={this.onChangeValue('port')}
                                    />
                                    <p className='form-error-message'>{_errors.port || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Username</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='text' className='config-system-insert-or-update-form-box-item-input'
                                        value={ftpUserName} onChange={this.onChangeValue('ftpUserName')}
                                    />
                                    <p className='form-error-message'>{errorInserts.ftpUserName || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Mật khẩu</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='password' className='config-system-insert-or-update-form-box-item-input'
                                        value={ftpPassword} onChange={this.onChangeValue('ftpPassword')}
                                    />
                                    <p className='form-error-message'>{errorInserts.ftpPassword || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'>Dung lượng tối đa (MB)</label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='text' className='config-system-insert-or-update-form-box-item-input'
                                        value={limitedStore} onChange={this.onChangeValue('limitedStore')}
                                    />
                                    <p className='form-error-message'>{errorInserts.limitedStore || ''}</p>
                                </div>
                            </div>
                            <div className='config-system-insert-or-update-form-box-item'>
                                <label className='config-system-insert-or-update-form-box-item-label'></label>
                                <div className='config-system-insert-or-update-form-box-item-box'>
                                    <input type='checkbox' className='config-system-insert-or-update-form-box-item-checkbox-input'
                                        value={isUsed}
                                    />
                                    <span className='config-system-insert-or-update-form-box-item-chekbox-label'>Đang sử dụng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='config-system-insert-or-update-form-function'> */}
                    <div className={`modal-footer ${classes.modalButtonArea}`}>
                        {/* <button onClick={this.onConfirm} className='config-system-insert-or-update-form-function-button'>
                            <img className='config-system-insert-or-update-form-function-button-icon' src={ButtonSave} />
                        </button> */}
                        <Button
                            color="default"
                            type="button"
                            className={`btn-success-cs`}
                            onClick={this.onConfirm}
                        >
                            <img src={SaveIcon1} alt='Lưu lại' />
                            <span>Lưu lại</span>
                        </Button>
                        {/* <button onClick={this.onClose} className='config-system-insert-or-update-form-function-button'>
                            <img className='config-system-insert-or-update-form-function-button-icon' src={ButtonClose} />
                        </button> */}
                        <Button
                            color="default"
                            // data-dismiss="modal"
                            type="button"
                            className={`btn-danger-cs`}
                            onClick={this.onClose}
                        >
                            <img src={CloseIcon} alt='Thoát ra' />
                            <span>Thoát ra</span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.ConfigSystemStore }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(configSystemAction, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InsertOrUpdate);