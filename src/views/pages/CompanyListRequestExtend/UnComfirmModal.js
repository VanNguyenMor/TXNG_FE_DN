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
                "reason": '',
            },
            activeSubmit: false,

        }
    }

    componentDidMount() {
        //const { data } = this.props;

        
        //this.setState({ data });
        this.handleCheckValidation();
    }

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;

        if (ev['name'].indexOf('passwordConfirm') > -1) {
            this.setState({ [ev['name']]: ev['value'] });
        }
        else data[ev['name']] = ev['value'];

        this.setState({ data });
        //console.log(data)
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

        if (data === null) {
            this.setState({ activeSubmit: false });
            handleCheckValidation(false);
        }
        else {
            if (data.reason.length > 0) {
                this.setState({ activeSubmit: true });

                // Check Validation 
                handleCheckValidation(true);

                // Handle New Data
                handleNewData(data);
            } else {

                handleCheckValidation(false);
            }
        }
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
            // data !== null && (
            <div className={classes.formControl}>


                {/* <div className={classes.rowItem}> */}
                <label
                    className="form-control-label"
                    style={{ width: '100%' }}
                >
                    Lý do không duyệt&nbsp;<b style={{ color: 'red' }}>*</b>
                </label>

                <Validate
                    validations={validations}
                    rules={rules}
                >
                    {({ validate, errorMessages }) => (
                        <div className={classes.inputArea} style={{ width: '100%' }}>
                            <InputGroup className="input-group-alternative">
                                <Input
                                    type="textarea"
                                    name='reason'
                                    //defaultValue={data.reason}
                                    required
                                    onChange={validate}
                                    autoFocus={true}
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                            </InputGroup>
                            <p className={classes.error}>{errorMessages.reason}</p>
                        </div>
                    )}
                </Validate>
                {/* </div> */}


            </div>
            //  )
        );
    }
};

export default UnComfirmModal;
