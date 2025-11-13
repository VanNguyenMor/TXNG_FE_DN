import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import Select from "components/Select";

// reactstrap components
import {
    Input,
    InputGroup
} from "reactstrap";

class AddNewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                unitName: '',
            },
            checkConfirmPass: '',
            activeSubmit: false
        }
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

    render() {
        const { data } = this.state;
        const { errorInsert, dataMaterial } = this.props;
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
                                autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['unitName'] || ''}</p>
                    </div>
                </div>

            </div>
        );
    }
};

export default AddNewModal;
