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
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg"
import { handleCurrencyFormat } from "../../../helpers/common"
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";
const numberWithCommas = (value, coma) => {
    value = value || '';
    coma = coma || ',';

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
};

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: { amount: 0 },
            activeSubmit: false,
            file: null,
            fileView: null,
        }
        this.refFileImage = null;
    }

    async componentWillMount() {



        this.handleCheckValidation();
    }

    handleChange = (event) => {
        let { data } = this.state;
        
        const ev = event.target;
        data[ev['name']] = Number(ev['value'].replaceAll('.', ''));
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


        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Số tiền
                    </label>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='amount'
                                type='number'
                                //placeholder='Số lượng'
                                //value={numberWithCommas(data.amount)}
                                //required
                                autoFocus={true}
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

    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UpdateModal);
