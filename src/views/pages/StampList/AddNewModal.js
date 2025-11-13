import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";

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
				quantity: 0
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

		// Check Confirm Password
		this.setState({
			checkConfirmPass: checkPasswordConfirm(data.passwordHash, data.passwordConfirm)
		});
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
			this.setState({ activeSubmit: false});
			handleCheckValidation(false);

            // Handle New Data
				handleNewData(data);
		} 
	}

	handleChangeNum = (event) => {
    let { data } = this.state;
    const ev = event.target;

		data[ev['name']] = Number(ev['value'].replaceAll('.',''));
		this.setState({ data });

		// Check Validation 
		this.handleCheckValidation();
  }

  render() {
    const { data } = this.state;

    return (
			<div className={classes.formControl}>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Số lượng&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative">
							<InputCurrency 
								name='quantity'
								placeholder='Số lượng'
								defaultValue={data.quantity}
								required
								autoFocus={true}
								onKeyUp={(event) => this.handleChangeNum(event)}  
							/>
						</InputGroup>
					</div>
				</div>
			</div>
    );
  }
};

export default AddNewModal;
