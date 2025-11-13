import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionProductGroup } from "../../../actions/ProductGroupActions";
import Select from "components/Select";
import SelectParent from "components/SelectParent";
// reactstrap components
import {
    Input,
    InputGroup
} from "reactstrap";

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            activeSubmit: false
        }
    }

    async componentWillMount() {
        const { requestGetProductGroup, id } = this.props;

        if (id) {
            await requestGetProductGroup(id).then(
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            data: res.data
                        }
                    });
                }
            )
        }
        this.handleCheckValidation();
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

    render() {
        const { data } = this.state;
        const { errorUpdate, dataMaterial } = this.props;
        let _materialGroupID
        if (data.materialGroupID != null) {
            dataMaterial.filter(y => y.id === data.materialGroupID).map(ul => {
                _materialGroupID = ul.name
            })
        }
        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tên nhóm NVL&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <SelectParent
                                name="materialGroupID"
                                defaultValue={data.materialGroupID}
                                title='Chọn nhóm NVL'
                                data={dataMaterial}
                                labelMark={_materialGroupID}
                                parentId='fieldID'
                                parentName='fieldName'
                                labelName='name'
                                val='id'
                                handleChange={this.handleSelect}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorUpdate['name'] || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tên loại &nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                name='name'
                                type='text'
                                defaultValue={data.name}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorUpdate['name'] || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Ghi chú
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                name='note'
                                type='textarea'
                                //placeholder='Số lượng'
                                defaultValue={data.note}
                                //required
                                //autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                    </div>

                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        productGroup: state.ProductGroupStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionProductGroup, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UpdateModal);
