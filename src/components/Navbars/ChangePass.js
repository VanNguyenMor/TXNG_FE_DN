import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../helpers/validation";
import { Editor } from '@tinymce/tinymce-react';
import PlusImg from "../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../assets/img/buttons/xoahinh.svg";
import SelectTree from "components/SelectTree";
import NoImg from "../../assets/img/NoImg/NoImg.jpg"
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class ChangePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                'passwordOld': '',
                'passwordNew': '',
                "repeatPassword": ""
            },

        }
    }

    componentDidMount() {

    }

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;
        data[ev['name']] = ev['value'];
        this.setState({ data });
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;
        // Check Validation 
        handleCheckValidation(true);
        // Handle New Data
        handleNewData(data);
    }

    render() {
        const { errorUpdate } = this.props;
        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Mật khẩu cũ&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                type="password"
                                name='passwordOld'
                                autoFocus={true}
                                onChange={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['passwordOld'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Mật khẩu mới&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                type="password"
                                name='passwordNew'
                                //placeholder='Số năm'
                                onChange={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['passwordNew'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Nhắc lại&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                type="password"
                                name='repeatPassword'
                                onChange={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['repeatPassword'] || ''}</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChangePass;
