import React, { Component } from "react";
import Select from "components/Select";
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
			data: null,
			newData: null,
			activeSubmit: false
		}
	}

	componentDidMount() {
		const { data } = this.props;

		this.setState({ data, newData: data });
		this.handleCheckValidation();
	}

	handleChange = (event) => {
		let { data } = this.state;
		const ev = event.target;

		// data[ev['name']] = ev['value'];
		// this.setState({ data });

		// Check Validation 
		this.handleCheckValidation(ev['name'], ev['value']);
	}

	handleChangeNum = (event) => {
		let { data } = this.state;
		const ev = event.target;

		ev['value'] = Number(ev['value'].replaceAll('.', ''));

		// Check Validation 
		this.handleCheckValidation(ev['name'], ev['value']);
	}

	handleSelect = (value, name) => {
		let { data } = this.state;

		if (value === null) value = "";
		// data[name] = value;

		// this.setState({ data });

		// Check Validation 
		this.handleCheckValidation([name], value);
	}

	handleCheckValidation = (name = null, value = null) => {
		const { handleCheckValidation, handleNewDetail } = this.props;
		let { data } = this.state;

		if (data !== null) {
			if (Number(data.year) > 0 && Number(data.amount) > 0) {
				this.setState({ activeSubmit: true });

				// Check Validation 
				handleCheckValidation(true);

				// Handle New Data
				handleNewDetail(name, value);
			} else {
				this.setState({ activeSubmit: false });
				handleCheckValidation(false);

				// Handle New Data
				handleNewDetail(name, value);
			}
		}
	}

	render() {
		const { data } = this.state;
		const { errorUpdate } = this.props;
		return (
			data !== null && (
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
											disabled={data.year == 1 ? true : false}
											onChange={validate}
											autoFocus={true}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className='form-error-message margin-bottom-0'>{errorUpdate['year'] || ''}</p>
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
							<p className='form-error-message margin-bottom-0'>{errorUpdate['amount'] || ''}</p>
						</div>
					</div>
				</div>
			)
		);
	}
};

export default AddNewModal;
