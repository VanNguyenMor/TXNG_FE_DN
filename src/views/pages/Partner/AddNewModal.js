import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import Select from "components/Select";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";

// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class AddNewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                'PartnerName': '',
                'TaxCode': '',
                'NationID': '',
                'Address': '',
                'PhoneNumber': '',
                'Website': '',
                'Email': '',
                'LogoFile': '',
                'PartnerType': 5
            },
            file: null,
            fileView: null,
            checkConfirmPass: '',
            activeSubmit: false
        }
        this.refFileImage = null;
    }

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;
        data[ev['name']] = ev['value'];
        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleSelect = (value, name) => {
        let { data } = this.state;

        if (value === null) value = "";
        data[name] = value;

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;
        this.setState({ activeSubmit: true });
        // Check Validation 
        handleCheckValidation(true);
        // Handle New Data
        handleNewData(data);
    }

    handleChangeIMG = event => {
        if (event.target.files[0] != undefined) {
            this.setState({
                fileView: URL.createObjectURL(event.target.files[0]),
                file: event.target.files[0],
            })
        } else {
            this.setState({
                fileView: null,
                file: null,
            })
        }
        let { data } = this.state;
        const ev = event.target.files[0];

        data.LogoFile = ev;
        this.setState({ data });

        //console.log(event.target.files[0])
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    onDeleImg = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                file: null,
                fileView: null
            }
        }
        )
    }

    render() {
        const { data } = this.state;
        const { errorInsert } = this.props;
        return (
            <div className={classes.formControl}>

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tên đơn vị&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='PartnerName'
                                placeholder="Tên đơn vị"
                                autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['PartnerName'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Địa chỉ
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Address'
                                placeholder="Địa chỉ"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorInsert['Address'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Mã số thuế
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='TaxCode'
                                placeholder="Mã số thuế"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorInsert['TaxCode'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Điện thoại
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='PhoneNumber'
                                placeholder="Điện thoại"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorInsert['PhoneNumber'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Website
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Website'
                                placeholder="Website"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorInsert['Website'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Email
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Email'
                                placeholder="Email"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorInsert['Email'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem} style={{ width: '100%', justifyContent: 'left' }}>
                    <label
                        className="form-control-label"
                    >
                        Logo
                    </label>
                    <div className={classes.inputArea} >
                        <div style={{ position: 'relative' }}>
                            <InputGroup className="input-group-alternative css-border-input" style={{ width: 82, }}>
                                <input
                                    ref={ref => this.refFileImage = ref}
                                    type="file"
                                    name='LogoFile'
                                    style={{ display: 'none' }}
                                    required
                                    onChange={this.handleChangeIMG}
                                    accept="image/*"
                                //onKeyUp={(event) => this.handleChangeIMG(event)}
                                />
                                {
                                    this.state.fileView === null ? (
                                        <div >
                                            <img
                                                src={this.state.file ? this.state.file : NoImg}
                                                style={{ width: '82px', height: '82px', maxWidth: 320, maxHeight: 320 }} />
                                        </div>

                                    ) : (
                                        <img
                                            src={this.state.fileView ? this.state.fileView : NoImg}
                                            style={{ width: '82px', height: '82px', maxWidth: 320, maxHeight: 320 }} />
                                    )
                                }
                            </InputGroup>
                            <div className="css-button-partner">
                                <Button type="button" size="lg" className='btn-primary-cs'
                                    onClick={this.onUpdateFileImage}>
                                    <img src={PlusImg} alt='Thêm mới' />
                                    <span>Chọn hình</span>
                                </Button>
                                {this.state.file != null ? (
                                    <div style={{ position: 'absolute', top: "-12px", left: 72 }}>
                                        <Button
                                            color="default"
                                            data-dismiss="modal"
                                            type="button"
                                            className="css-icon-button-partner"
                                            onClick={this.onDeleImg}
                                        >
                                            {/* <img src={CloseIcon} alt='Thoát ra' /> */}
                                            <span>X</span>
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>


                    </div>

                </div>

            </div>
        );
    }
};

export default AddNewModal;
