import React, { Component } from "react";
import classes from './index.module.css';

// reactstrap components
import {
    Input,
    InputGroup,
} from "reactstrap";

class AddNewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                'TransportName': '',
                'TransportType': '',
                'PhoneNumber': '',
                'Email': '',
                'Address': '',
                'Note': '',
            },
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
        const { errorInsert } = this.props;
        return (
            <div className={classes.formControl}>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Tên vận chuyển&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='TransportName'
                                placeholder="Tên vận chuyển"
                                autoFocus={true}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['TransportName']) || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Loại vận chuyển
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='TransportType'
                                placeholder="Loại vận chuyển"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['TransportType']) || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Điện thoại
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='PhoneNumber'
                                placeholder="Điện thoại"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['PhoneNumber']) || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Email
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Email'
                                placeholder="Email"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['Email']) || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Địa chỉ
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Address'
                                placeholder="Địa chỉ"
                                type='text'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['Address']) || ''}</p>
                    </div>
                </div>

                <div className={classes.rowItem}>
                    <label className="form-control-label">
                        Ghi chú
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='Note'
                                placeholder="Ghi chú"
                                type='textarea'
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorInsert && errorInsert['Note']) || ''}</p>
                    </div>
                </div>

            </div>
        );
    }
};

export default AddNewModal;
