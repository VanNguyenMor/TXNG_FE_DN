import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

// reactstrap components
import {
    Input,
    InputGroup,

} from "reactstrap";

class UnComfirmModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                "limit": '',
                "page": '',
            },
            activeSubmit: false,

        }
    }



    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;
        data[ev['name']] = ev['value'];
        this.setState({ data });
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
        handleNewData(data);
        handleCheckValidation(true);

    }

    handleClear = () => {
        this.setState({
            data: null,
            activeSubmit: false,
        })
    }

    render() {
        const { roles } = this.props;
        const { data } = this.state;

        return (
            data !== null && (
                <div className={classes.formControl}>
                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label"
                        >
                            Từ
                        </label>
                        <div className={classes.inputArea}>
                            <InputGroup className="input-group-alternative">
                                <Input
                                    type="number"
                                    name='page'
                                    //defaultValue={data.reason}
                                    required
                                    onChange={(event) => this.handleChange(event)}
                                />
                            </InputGroup>
                        </div>
                    </div>

                    <div className={classes.rowItem}>
                        <label
                            className="form-control-label"
                        >
                            Đến
                        </label>
                        <div className={classes.inputArea}>
                            <InputGroup className="input-group-alternative">
                                <Input
                                    type="number"
                                    name='limit'
                                    //defaultValue={data.reason}
                                    required
                                    onChange={(event) => this.handleChange(event)}
                                />
                            </InputGroup>
                        </div>


                    </div>


                </div>
            )
        );
    }
};

export default UnComfirmModal;
