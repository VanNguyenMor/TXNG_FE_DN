import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import Select from "components/Select";
import SelectTree from "components/SelectTree";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import Imgbt from "../../../assets/img/buttons/chonhinh.svg";
import delImg from "../../../assets/img/buttons/xoahinh.svg";

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
                name: '',
                note: '',
                unitID: '',
                fieldID: '',
                files: '',
                isProduct: true
            },
            fileView: null,
            file: null,
            checkConfirmPass: '',
            activeSubmit: false
        }
        this.refFileImage = null;
    }

    componentWillMount() {
        this.setState(previousState => {
            return {
                ...previousState,
                data: {
                    name: '',
                    note: '',
                    unitID: '',
                    fieldID: '',
                    files: '',
                    isProduct: true
                },
            }
        }, () => this.handleCheckValidation())
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
        if (data.name.length > 0 && data.unitID.length > 0) {
            this.setState({ activeSubmit: true });
            // Check Validation 
            handleCheckValidation(true);
            // Handle New Data
            handleNewData(data);
        } else {
            this.setState({ activeSubmit: false });
            // Check Validation 
            handleCheckValidation(false);
            // Handle New Data
            handleNewData(data);
        }

    }

    handleChangeNum = (event) => {
        let { data } = this.state;
        const ev = event.target;

        data[ev['name']] = Number(ev['value'].replaceAll('.', ''));
        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
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

        data.files = ev;
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
        });

    }

    onChangeIsProduct = value => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                data: {
                    ...previousState.data,
                    isProduct: value
                }
            }
        });
        this.handleCheckValidation();
    }

    render() {
        const { data } = this.state;

        const { errorInsert, dataUnit, fieldData, handleOpenSelectTree } = this.props;

        // console.log(errorInsert);
        return (
            <div className={classes.formControl}>
                {/* <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <SelectTree
                            name="fieldID"
                            title='Chọn ngành nghề'
                            data={fieldData}
                            labelName='fieldName'
                            fieldName='fieldName'
                            val='id'
                            handleChange={this.handleSelect}
                            handleOpenSelectTree={handleOpenSelectTree}
                        />
                        <p className='form-error-message margin-bottom-0'>{errorInsert['fieldID'] || ''}</p>
                    </div>
                </div> */}

                {/* <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                    </label>
                    <div className={classes.inputArea}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1
                            }}>
                                <input onClick={this.onChangeIsProduct(true)} checked={data.isProduct ? true : false} id="isProductTrue" name='isProduct' type="radio" />
                                <label htmlFor="isProductTrue" style={{
                                    width: 'auto',
                                    marginLeft: 5,
                                    fontSize: '0.8rem'
                                }}>Nhóm sản phẩm</label>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1
                            }}>
                                <input onClick={this.onChangeIsProduct(false)} checked={data.isProduct ? false : true} id="isProductFalse" name='isProduct' type="radio" />
                                <label htmlFor="isProductFalse" style={{
                                    width: 'auto',
                                    marginLeft: 5,
                                    fontSize: '0.8rem'
                                }}>Nhóm nguyên vật liệu</label>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label width-add-label-material-group"
                    >
                        Tên nhóm&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='name'
                                placeholder='Tên nhóm nguyên vật liệu'
                                //defaultValue={data.quantity}
                                //required
                                autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert.name || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label width-add-label-material-group"
                    >
                        ĐVT&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <Select
                            name='unitID'
                            labelName='unitName'
                            data={dataUnit}
                            val='id'
                            title='Chọn ĐVT'
                            handleChange={this.handleSelect}
                        />
                        <p className='form-error-message margin-bottom-0'>{errorInsert['unitID'] || ''}</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default AddNewModal;
