import React, { Component } from "react";
import classes from './index.module.css';
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionTransportation } from "../../../actions/TransportationActions";

// reactstrap components
import {
    Input,
    InputGroup,
} from "reactstrap";

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                'ID': '',
                'TransportName': '',
                'TransportType': '',
                'PhoneNumber': '',
                'Email': '',
                'Address': '',
                'Note': '',
            },
            activeSubmit: false,
        }
    }

    async componentWillMount() {
        const { requestGetTransportation, id } = this.props;

        if (id) {
            await requestGetTransportation(id).then(
                res => {
                    if (res.data && res.data.data) {
                        this.setState(previousState => {
                            return {
                                ...previousState,
                                data: {
                                    ID: id,
                                    TransportName: res.data.data.transportName || '',
                                    TransportType: res.data.data.transportType || '',
                                    PhoneNumber: res.data.data.phoneNumber || '',
                                    Email: res.data.data.email || '',
                                    Address: res.data.data.address || '',
                                    Note: res.data.data.note || '',
                                }
                            }
                        });
                    }
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
                    <label className="form-control-label">
                        Tên vận chuyển&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='TransportName'
                                type='text'
                                defaultValue={data.TransportName}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['TransportName']) || ''}</p>
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
                                type='text'
                                defaultValue={data.TransportType}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['TransportType']) || ''}</p>
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
                                type='text'
                                defaultValue={data.PhoneNumber}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['PhoneNumber']) || ''}</p>
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
                                type='text'
                                defaultValue={data.Email}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['Email']) || ''}</p>
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
                                type='text'
                                defaultValue={data.Address}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['Address']) || ''}</p>
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
                                type='textarea'
                                defaultValue={data.Note}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{(errorUpdate && errorUpdate['Note']) || ''}</p>
                    </div>
                </div>

            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        transportation: state.TransportationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionTransportation, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UpdateModal);
