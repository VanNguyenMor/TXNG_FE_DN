import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionUnit } from "../../../actions/UnitActions";
import Select from "components/Select";
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
        const { requestGetUnit, id } = this.props;

        if (id) {
            await requestGetUnit(id).then(
                res => {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            data: res.data.data
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
        const { errorUpdate } = this.props;
        
        return (
            <div className={classes.formControl}>
                

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tên đơn vị tính &nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                name='unitName'
                                type='text'
                                defaultValue={data.unitName}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>

                        <p className='form-error-message margin-bottom-0'>{errorUpdate['unitName'] || ''}</p>
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
        ...bindActionCreators(actionUnit, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UpdateModal);
