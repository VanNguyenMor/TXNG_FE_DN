import { validPhone } from 'bases/helper';
import { validEmail } from 'bases/helper';
import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import compose from 'recompose/compose';

import { actionCreators } from "../../../actions/UserListActions.js";

import '../../../assets/css/page/forgot_password.css';

import Loading from '../../../components/loading';
import Message, { TYPES } from '../../../components/message';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            phone: '',
            typeSend: 0,
            errors: {}
        }

        this.inputUsername = null;
    }

    focusInput = () => {
        if (this.inputUsername) {
            const timeOut = setTimeout(() => {
                this.inputUsername.focus();

                clearTimeout(timeOut);
            }, 100);
        }
    }

    resetForm = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                username: '',
                email: '',
                phone: '',
                typeSend: 0
            }
        });
    }

    checkValidateForm = () => {
        const { typeSend, email, phone, username } = this.state;
        const _errors = {};

        if (!username) {
            _errors.username = 'Tên đăng nhập không được bỏ trống';
        }

        if (typeSend == 0) {
            if (!email) {
                _errors.email = 'Email không được bỏ trống';
            }

            if (email && !validEmail(email)) {
                _errors.email = 'Email không đúng định dạng';
            }
        }

        if (typeSend == 1) {
            if (!phone) {
                _errors.phone = 'Số điện thoại không được bỏ trống';
            }

            if (phone && !validPhone(phone)) {
                _errors.phone = 'Số điện thoại không đúng định dạng';
            }
        }

        return _errors;
    }

    onChangeValue = name => e => {
        const value = e.target.value;

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        }, () => {
            this.setState(previousState => {
                return {
                    ...previousState,
                    errors: {
                        ...this.checkValidateForm()
                    }
                }
            });
        });
    }

    onChangeCheck = typeSend => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                typeSend,
                errors: {
                    ...previousState.errors,
                    [typeSend == 0 ? 'phone' : 'email']: ''
                }
            }
        });
    }

    onSend = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                errors: {}
            }
        });

        const _errors = this.checkValidateForm();

        this.setState(previousState => {
            return {
                ...previousState,
                errors: _errors
            }
        });

        if (Object.keys(_errors).length > 0) {
            return;
        }

        const { username, phone, email, typeSend } = this.state;
        const { sendForgotPassword } = this.props;

        Loading.show();

        sendForgotPassword({
            userName: username,
            sendTo: typeSend == 0 ? email : phone
        }).then(res => {
            Loading.close();

            if (res.ok) {
                //Message.show(TYPES.SUCCESS, 'Thông báo', 'Gửi tin thành công');
            } else {
                //Message.show(TYPES.ERROR, 'Thông báo', res.error.message || 'Gửi tin thất bại');
            }
        });
    }

    onClose = () => {
        const { onClose } = this.props;

        if (onClose) {
            onClose();
        }
    }

    render() {
        const { errors, typeSend, username, email, phone } = this.state;
        const { setRef } = this.props;

        return (
            <div ref={() => setRef(this)} className='forgot-password'>
                <div className="forgot-password-header">
                    <h5 className="forgot-password-header-title">QUÂN MẬT KHẨU</h5>
                </div>
                <div className="forgot-password-body">
                    <div className="forgot-password-body-check">
                        <div onClick={this.onChangeCheck(0)} className="forgot-password-body-check-item">
                            <input checked={typeSend == 0 ? true : false} className="forgot-password-body-check-item-check" type='radio' />
                            <span className="forgot-password-body-check-item-text">Gửi Email</span>
                        </div>
                        <div onClick={this.onChangeCheck(1)} className="forgot-password-body-check-item">
                            <input checked={typeSend == 1 ? true : false} className="forgot-password-body-check-item-check" type='radio' />
                            <span className="forgot-password-body-check-item-text">Gửi SMS</span>
                        </div>
                    </div>
                    <div className="forgot-password-body-item">
                        <label className='forgot-password-body-item-label' htmlFor='#forgotPasswordUsername'>Tên đăng nhập *</label>
                        <input ref={ref => this.inputUsername = ref} onChange={this.onChangeValue('username')} value={username} className='forgot-password-body-item-input' id='forgotPasswordUsername' />
                        <p className='form-error-message'>{errors.username || ''}</p>
                    </div>
                    <div className="forgot-password-body-item">
                        <label className='forgot-password-body-item-label' htmlFor='#forgotPasswordEmail'>Email *</label>
                        <input onChange={this.onChangeValue('email')} value={email} className='forgot-password-body-item-input' id='forgotPasswordEmail' />
                        <p className='form-error-message'>{errors.email || ''}</p>
                    </div>
                    <div className="forgot-password-body-item">
                        <label className='forgot-password-body-item-label' htmlFor='#forgotPasswordPhone'>Điện thoại *</label>
                        <input onChange={this.onChangeValue('phone')} value={phone} className='forgot-password-body-item-input' id='forgotPasswordPhone' />
                        <p className='form-error-message'>{errors.phone || ''}</p>
                    </div>
                </div>
                <div className="forgot-password-footer">
                    <button onClick={this.onSend} type="button" className="forgot-password-footer-send">
                        GỬI
                    </button>
                    <button onClick={this.onClose} type="button" className="forgot-password-footer-close">
                        ĐÓNG
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionCreators, dispatch)
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ForgotPassword);