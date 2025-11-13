import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { actionRoleCreators } from "../../../actions/RoleListActions.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// reactstrap components
import {

} from "reactstrap";

class InsertOrUpdateAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: {
                "id": "",
                "roleID": "",
                "alertTypeIDs": [],
            },
        }
    }
    // componentWillUnmount() {
    //     this.setState(previousState => {
    //         return {
    //             ...previousState,
    //             newData: {
    //                 "id": "",
    //                 "roleID": "",
    //                 "alertTypeIDs": [],
    //             },
    //         }
    //     });
    // }
    async componentWillMount() {
        const { getAllAlertBySelect, getAllRolesBySelect, getAllRoleList, id, currentRowAlert } = this.props;
        let { newData } = this.state;
        await getAllRoleList(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
        })).then(res => {
            if (res.data.status == 200) {
                this.setState({ dataRolesAll: res.data.data.roles })
            }
        })
        await getAllAlertBySelect().then(res => {
            if (res.data.status == 200) {
                this.setState({
                    dataAlertSelect: res.data.data.listAlertRoles
                })
            }
        })
        await getAllRolesBySelect().then(res => {
            if (res.data.status == 200) {
                this.setState({
                    dataRoleSelect: res.data.data.listRoles
                })
            }
        })


        if (id) {
            // console.log(currentRowAlert);
            newData = {
                id: id,
                roleID: currentRowAlert && ((currentRowAlert || {}).roleID),
                alertTypeIDs: currentRowAlert && ((currentRowAlert || {}).alertTypeID)
            }
            this.setState({ newData }, () => {
                if (this.props.onHandleChangeValue) {
                    this.props.onHandleChangeValue(this.state);
                }
            })
        }

    }

    handleSelect = (value, name) => {
        let { newData } = this.state;

        if (value === null) value = "";
        newData[name] = value;

        this.setState({ newData }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
    }

    render() {
        const { errors } = this.props;
        const { newData, dataAlertSelect, dataRoleSelect, dataRolesAll } = this.state;
        let RoleName = '';
        if (dataRolesAll) {
            if (newData) {
                if (newData.roleID) {
                    RoleName = (dataRolesAll.filter(dR => dR.id == newData.roleID)[0] || {}).name || ''

                }
            }
        }

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
                                labelMark={RoleName}
                                data={dataRoleSelect}
                                labelName={'name'}
                                title={'Chọn nhóm người dùng'}
                                defaultValue={newData && newData.roleID}
                                val='id'
                                handleChange={this.handleSelect}
                            />
                            <p className='form-error-message margin-bottom-0'>{(errors || {})['roleID'] || ''}</p>
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
                                // defaultValue={newData.alertTypeIDs}
                                isHideSelectAll={true}
                                isMulti={true}
                                handleChange={this.handleSelect}
                            />
                            <p className='form-error-message margin-bottom-0'>{(errors || {})['alertTypeIDs'] || ''}</p>
                        </div>
                    </div>
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                    />
                </div>

            )
        );
    }
};

const mapStateToProps = state => {
    return {
        ConfigSystemStore: state.ConfigSystemStore,
        role: state.RoleStore
    }
}

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(configSystemAction, dispatch),
        ...bindActionCreators(actionRoleCreators, dispatch)
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InsertOrUpdateAlert);
