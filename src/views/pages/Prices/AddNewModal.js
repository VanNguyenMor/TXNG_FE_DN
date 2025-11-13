import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

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
				"id": "",
				"year": 0,
				"amount": 0
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

	handleChangeNum = (event) => {
		let { data } = this.state;
		const ev = event.target;

		data[ev['name']] = Number(ev['value'].replaceAll('.', ''));
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

		if (Number(data.year) > 0 && Number(data.amount) > 0) {
			this.setState({ activeSubmit: true });

			// Check Validation 
			handleCheckValidation(true);


			// Handle New Data
			handleNewData(data);
		}
		else {
			this.setState({ activeSubmit: false });
			handleCheckValidation(false);

			// Handle New Data
			handleNewData(data);
		}
	}

	render() {
		const { data } = this.state;
		const { errorInsert } = this.props;
		
		return (
			<div className={classes.formControl}>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Số năm&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<Validate
						validations={validations}
						rules={rules}
					>
						{({ validate, errorMessages }) => (
							<div className={classes.inputArea}>
								<InputGroup className="input-group-alternative">
									<Input
										type="number"
										name='year'
										//placeholder='Số năm'
										defaultValue={data.year}
										required
										onChange={validate}
										autoFocus={true}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								<p className='form-error-message margin-bottom-0'>{errorInsert['year'] || ''}</p>
							</div>
						)}
					</Validate>
				</div>

				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Số tiền&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative">
							<InputCurrency
								name='amount'
								//placeholder='Số tiền'
								defaultValue={data.amount}
								required
								onKeyUp={(event) => this.handleChangeNum(event)}
							/>
						</InputGroup>
						<p className='form-error-message margin-bottom-0'>{errorInsert['amount'] || ''}</p>
					</div>
				</div>
			</div>
		);
	}
};

export default AddNewModal;
