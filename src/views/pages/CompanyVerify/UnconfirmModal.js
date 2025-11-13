import React, { Component } from "react";
import classes from './index.module.css';

// reactstrap components
import {
    Input,
    InputGroup
} from "reactstrap";

class UnconfirmModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: {
                reason: ''
            },
        }
    }

    handleChange = (event) => {
        let { newData } = this.state;
        const ev = event.target;
        newData[ev['name']] = ev['value'];
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
        const { errorUpdate } = this.props;
        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label
                        className="form-control-label"
                    >
                        Lý do không duyệt&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                type="textarea"
                                name='reason'
                                placeholder='Lý do không duyệt'
                                required
                                onChange={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['reason'] || ''}</p>
                    </div>
                </div>
            </div>
        );
    }
};


export default UnconfirmModal
