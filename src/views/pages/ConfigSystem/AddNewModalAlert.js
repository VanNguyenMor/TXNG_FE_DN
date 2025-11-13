import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { actionRoleCreators } from "../../../actions/RoleListActions.js";
import { connect } from "react-redux";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import './select-search.css'

// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class AddNewModalAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: {
                "ID": "",
                "roleID": "",
                "alertTypeIDs": [],
            },
            activeSubmit: false,

        }
    }


    async componentWillMount() {
        const { getAllAlertBySelect, getAllRoleList } = this.props;
        await getAllAlertBySelect().then(res => {
            if (res.data.status == 200) {
                this.setState({
                    dataAlertSelect: res.data.data.listAlertRoles
                })
            }
        })
        await getAllRoleList(JSON.stringify({
            page: null,
            limit: null
        })).then(res => {
            if (res.data.status == 200) {
                this.setState({
                    dataRoleSelect: res.data.data.roles
                })
            }
        })
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

    render() {
        const { errorInsert } = this.props;
        const { newData, dataAlertSelect, dataRoleSelect } = this.state;
        return (
            newData !== null && (
                <div className={classes.formControl}>
                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label width-label-config-system"
                        >
                            Nhóm người dùng&nbsp;<b style={{ color: 'red' }}>*</b>
                        </label>
                        <div className={classes.inputArea}>
                            <Select
                                name='roleID'
                                data={dataRoleSelect}
                                labelName={'name'}
                                title='Chọn nhóm người dùng'
                                val='id'
                                onChange={this.handleSelect}
                            />
                            <p className='form-error-message margin-bottom-0'>{(errorInsert || {})['Name'] || ''}</p>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label width-label-config-system"
                        >
                            Loại thông báo&nbsp;<b style={{ color: 'red' }}>*</b>
                        </label>
                        <div className={classes.inputArea}>

                            <Select
                                className="css-select-border"
                                name="alertTypeIDs"
                                title='Chọn loại thông báo'
                                data={dataAlertSelect}
                                labelName='description'
                                val='id'
                                isHideSelectAll={true}
                                isMulti={true}
                                handleChange={this.handleSelect}
                            />
                            <p className='form-error-message margin-bottom-0'>{(errorInsert || {})['Name'] || ''}</p>
                        </div>
                    </div>
                </div>

            )
        );
    }
};

const mapStateToProps = state => {
    return {
        ConfigSystemStore: state.ConfigSystemStore,
        stampTemplate: state.StampPlateStore,
        role: state.RoleStore
    }
}

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(configSystemAction, dispatch),
        ...bindActionCreators(actionStampPlate, dispatch),
        ...bindActionCreators(actionRoleCreators, dispatch)
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(AddNewModalAlert);
