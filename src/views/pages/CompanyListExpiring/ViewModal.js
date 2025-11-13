import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { DOMAIN_IMG } from "../../../services/Common";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"



// reactstrap components
import {
    Input,
    InputGroup,

} from "reactstrap";

class ViewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            newData: {
                "id": '',
                "year": '',
            },
            activeSubmit: false,
            selectRow: 0,
            year: null,
            price: null
        }
    }

    componentDidMount() {
        const { data, price } = this.props;
        this.setState({ data, price });
        this.handleCheckValidation();
    }

    handleChange = (event) => {
        let { data, } = this.state;
        const ev = event.target;

        if (ev['name'].indexOf('passwordConfirm') > -1) {
            this.setState({ [ev['name']]: ev['value'] });
        }
        else data[ev['name']] = ev['value'];

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleSelect = (value, name) => {
        let { data, price } = this.state;

        if (value === null) value = "";

        data[name] = value;

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }
    handleSelectPrice = (value, name) => {
        const { price, data } = this.state;
        let current = null;

        if (value === null) value = "";
        /*price.filter(item => item.id === value)
            .map(item => {
                current = item
            });*/

        this.handleCheckValidation(value);
    }

    handleCheckValidation = (newData = null) => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data, price } = this.state;
        let current = null;
        if (data === null) {
            this.setState({ activeSubmit: false });
            handleCheckValidation(false);
        }
        else {

            if (newData !== null) {
                this.setState({ activeSubmit: true });

                // Check Validation 
                handleCheckValidation(true);
                price.filter(item => item.id === newData)
                    .map(item => {
                        current = item
                    });
                // Handle New Data
                this.setState({ selectRow: current.amount })

                handleNewData(current);
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
        const { price } = this.props;
        const { data, selectRow } = this.state;

        return (
            data !== null && (
                <div className={classes.formControl}>

                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã doanh nghiệp
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.companyCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Tên doanh nghiệp
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.companyName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã số thuế
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.taxCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Ngành nghề
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.fieldName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col" style={{ padding: '10px 15px 0px 15px' }}
                            >
                                Giới thiệu chung
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} style={{ padding: '10px 12px' }}>
                                {/* <InputGroup className="input-group-alternative"> */}
                                {/* <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.introduce}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                /> */}
                                {/* </InputGroup> */}
                                {/* {data.introduce} */}
                                <div dangerouslySetInnerHTML={{ __html: data.introduce }} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Địa chỉ
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={
                                        data.address + ', ' + data.wardName + ', ' + data.districtName + ', ' + data.pRovinceName
                                    }
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Điện thoại
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.phoneNumber}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Fax
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.fax}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Email
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.email}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Website
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.website}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Người liên hệ
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Điện thoại
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactPhone}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Email
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactEmail}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Vị trí
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.location}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Logo
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                <img src={data.logo ? data.logo : NoImg}
                                    style={{ width: 200, height: 200 }} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Hình ảnh công ty
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                <img src={data.images ? data.images : NoImg}
                                    style={{ width: 500, height: 300 }} />
                            </div>
                        </div>

                    </div>

                </div>
            )
        );
    }
};

export default ViewModal;
