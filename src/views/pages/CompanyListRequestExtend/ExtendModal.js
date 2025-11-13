import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";

// reactstrap components
import {
    Input,
    InputGroup,

} from "reactstrap";

class ExtendModal extends Component {
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
            priceData: null,
            valueDate: null
        }

    }

    componentDidMount() {
        const { data, price } = this.props;
        let { priceData } = this.state;
        priceData = price[0]
        if (data !== null) {
            this.setState({ year: moment(data.expiredDate).add(price[0].year, 'year').format('DD-MM-YYYY') });
            this.setState({ data });
            this.setState({ selectRow: price[0].amount })
            this.setState({ priceData })
        }

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
        const { price, data, handleNewData } = this.props;
        let { priceData } = this.state;
        if (value != null) {
            price.filter(item => item.id === value)
                .map(item => {
                    priceData = item
                });
            handleNewData(priceData)
            this.setState({ priceData })
            this.setState({ year: moment(data.expiredDate).add(priceData.year, 'year').format('DD-MM-YYYY') });
            this.setState({ selectRow: priceData.amount })
        }
        this.handleCheckValidation();
    }
    handleCheckValidation = (newData = null) => {
        const { handleCheckValidation, handleNewData, price } = this.props;
        let { priceData } = this.state;
        if (priceData == null) {
            priceData = price[0]
            handleNewData(priceData);
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
        const { data, selectRow, year, valueDate } = this.state;
        // console.log(this);
        return (
            data !== null && (
                <div className={classes.formControl}>

                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Số năm
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Select
                                name="year"
                                //title='Chọn số năm'
                                data={price}
                                isHideSelectAll
                                isHideDefault
                                notActiveRoot
                                defaultValue={price[0].id}
                                labelName='year'
                                val='id'
                                handleChange={this.handleSelectPrice}
                            />
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Số tiền
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Validate
                                validations={validations}
                                rules={rules}
                            >
                                {({ validate, errorMessages }) => (
                                    <div className={classes.inputArea}>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                type="text"
                                                value={handleCurrencyFormat(selectRow)}
                                                readOnly
                                                onKeyUp={(event) => this.handleChange(event)}
                                            />
                                        </InputGroup>
                                        <p className={classes.error}>{errorMessages.reason}</p>
                                    </div>
                                )}
                            </Validate>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Ngày hết hạn
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        color: 'red',
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0
                                    }}
                                    type="text"
                                    value={year}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    }
};

export default ExtendModal;
