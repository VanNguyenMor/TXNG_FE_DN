import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { connect } from "react-redux";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";

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
            newData: {
                "ID": "",
                "Name": "",
                "file": "",
            },
            activeSubmit: false,
            fileView: null,
            file: null,
        }
        this.refFileImage = null;
    }

    // async componentDidMount() {
    //     const { id } = this.props;
    //     let { newData } = this.state;
    //     const { requestGetStampPlate } = this.props;
    //     await requestGetStampPlate(id).then((res) => {

    //         if (res.data.status === 200) {
    //             newData = {
    //                 ID: res.data.data.id,
    //                 Name: res.data.data.name,
    //                 Template: res.data.data.template,
    //                 file: ""
    //             }
    //             this.setState({ newData })
    //             this.setState({ file: res.data.data.template })
    //         }
    //     })
    //     this.handleCheckValidation();
    // }

    handleChange = (event) => {
        let { newData } = this.state;
        const ev = event.target;

        newData[ev['name']] = ev['value'];
        this.setState({ newData });
        // Check Validation 
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    handleSelect = (value, name) => {
        let { newData } = this.state;

        if (value === null) value = "";
        newData[name] = value;

        this.setState({ newData });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { newData } = this.state;
        // Check Validation 
        handleCheckValidation(true);
        // Handle New Data
        handleNewData(newData);
    }

    onDeleImg = () => {
        let { newData } = this.state;
        this.setState(previousState => {
            return {
                ...previousState,
                file: null,
                fileView: null,
            }
        }
        )
        this.setState({ newData });
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
        let { newData } = this.state;
        const ev = event.target.files[0];
        newData.file = ev;
        this.setState({ newData });
        this.handleCheckValidation();
    }

    render() {
        const { errorInsert } = this.props;
        const { newData } = this.state;
        return (
            newData !== null && (
                <div className={classes.formControl}>
                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label"
                        >
                            Tên&nbsp;<b style={{ color: 'red' }}>*</b>
                        </label>
                        <div className={classes.inputArea}>
                            <InputGroup className="input-group-alternative">
                                <Input
                                    type="text"
                                    name='Name'
                                    defaultValue={newData.Name}
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                            </InputGroup>
                            <p className='form-error-message margin-bottom-0'>{errorInsert['Name'] || ''}</p>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label"
                        >
                            Hình ảnh&nbsp;<b style={{ color: 'red' }}>*</b>
                        </label>
                        <div className={classes.inputArea}>
                            <InputGroup className="input-group-alternative">
                                <input
                                    ref={ref => this.refFileImage = ref}
                                    type="file"
                                    name='Template'
                                    style={{ display: 'none' }}
                                    required
                                    onChange={this.handleChangeIMG}
                                    accept="image/*"
                                //onKeyUp={(event) => this.handleChangeIMG(event)}
                                />

                                {
                                    this.state.fileView === null ? (
                                        <img
                                            src={this.state.file ? this.state.file : NoImg}
                                            style={{ width: '100%', height: '100%', maxWidth: 320, maxHeight: 320 }} />
                                    ) : (
                                        <img
                                            src={this.state.fileView ? this.state.fileView : NoImg}
                                            style={{ width: '100%', height: '100%', maxWidth: 320, maxHeight: 320 }} />
                                    )
                                }
                                <div className="row" style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }}>
                                    <Button type="button" size="lg" className='btn-primary-cs'
                                        onClick={this.onUpdateFileImage}>
                                        <img src={PlusImg} alt='Thêm mới' />
                                        <span>Chọn hình</span>
                                    </Button>
                                    {this.state.file != null ? (
                                        <Button
                                            color="default"
                                            data-dismiss="modal"
                                            type="button"
                                            className={`btn-danger-cs`}
                                            onClick={this.onDeleImg}
                                        >
                                            <img src={CloseIcon} alt='Thoát ra' />
                                            <span>Xóa hình</span>
                                        </Button>
                                    ) : null}
                                </div>
                            </InputGroup>
                            <p className='form-error-message margin-bottom-0'>{errorInsert['Template'] || ''}</p>
                        </div>

                    </div>
                </div>

            )
        );
    }
};

const mapStateToProps = state => {
    return {
        // ConfigSystemStore: state.ConfigSystemStore,
        // dataCompany: state.CompanyListRegisteredStore,
        stampTemplate: state.StampPlateStore
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //...bindActionCreators(configSystemAction, dispatch),
        //...bindActionCreators(actionCompanyListRegistered, dispatch),
        ...bindActionCreators(actionStampPlate, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(AddNewModal);
