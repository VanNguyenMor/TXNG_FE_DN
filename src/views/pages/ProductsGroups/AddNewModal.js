import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import Select from "components/Select";
import SelectParent from "components/SelectParent";
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
                "materialGroupID": '',
                "name": '',
                "note": '',
                "files": '',
            },
            checkConfirmPass: '',
            activeSubmit: false,
            fileView: null,
            file: null,
        }
        this.refFileImage = null;
    }

    componentDidMount() {
        const { onHandleChangeValue } = this.props
        this.setState({
            data: {
                "materialGroupID": '',
                "name": '',
                "note": '',
                "files": '',
            }
        }, () => {
            if (onHandleChangeValue) {
                onHandleChangeValue(this.state);
            }
        })
        this.handleCheckValidation();
    }

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;
        data[ev['name']] = ev['value'];
        this.setState({
            data
        });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleSelect = (value, name) => {
        let { data } = this.state;

        if (value === null) value = "";
        data[name] = value;

        this.setState({ data }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;

        if (Number(data.quantity) > 0) {
            this.setState({ activeSubmit: true });

            // Check Validation 
            handleCheckValidation(true);


            // Handle New Data
            handleNewData(data);
        } else {
            this.setState({ activeSubmit: false });
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
        }
        )
    }

    render() {
        const { data } = this.state;
        const { errorInsert, dataMaterial } = this.props;
        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Nhóm sản phẩm &nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <SelectParent
                                name="materialGroupID"
                                //defaultValue={filter.fieldID}
                                title='Chọn nhóm sản phẩm'
                                data={dataMaterial}
                                labelName='name'
                                parentId='fieldID'
                                parentName='fieldName'
                                val='id'
                                handleChange={this.handleSelect}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['materialGroupID'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tên loại &nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='name'
                                //placeholder='Số lượng'
                                //defaultValue={data.quantity}
                                //required
                                autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['name'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Ghi chú
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='note'
                                type='textarea'
                                //placeholder='Số lượng'
                                //defaultValue={data.quantity}
                                //required
                                //autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                    </div>

                </div>
                <div className={`${classes.rowItem} `} style={{ marginTop: 15 }}>
                    <label
                        className="form-control-label"
                    >
                        Hình ảnh
                    </label>
                    <div className={classes.inputArea}>
                        <div style={{ position: 'relative' }}>
                            <InputGroup className="input-group-alternative css-border-input " style={{ width: 82, }}>
                                <input
                                    type="file"
                                    name='files'
                                    style={{ display: 'none' }}
                                    //value={data.ThumbnailFile}
                                    required
                                    ref={ref => this.refFileImage = ref}
                                    onChange={this.handleChangeIMG}
                                    accept="image/*"
                                //onKeyUp={(event) => this.handleChangeIMG(event)}
                                />
                                <img
                                    src={this.state.fileView ? this.state.fileView : NoImg}
                                    style={{ width: '100%', height: '100%', maxWidth: 320, maxHeight: 320 }} />
                            </InputGroup>
                            <div className="css-button-product-group">
                                <Button type="button" size="lg" className='btn-primary-cs'
                                    onClick={this.onUpdateFileImage}>
                                    <img src={Imgbt} alt='Thêm mới' />
                                    <span>Chọn hình</span>
                                </Button>
                                {this.state.file != null ? (
                                    <div style={{ position: 'absolute', top: "-12px", left: 72 }}>
                                        <Button
                                            color="default"
                                            data-dismiss="modal"
                                            type="button"
                                            className={`css-icon-button-product-group`}
                                            onClick={this.onDeleImg}
                                        >
                                            {/* <img src={delImg} alt='Thoát ra' /> */}
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
