import React, { Component } from "react";
import classes from './index.module.css';
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
				"id": "",
				"name": "",
				"description": "",
				"companyID": "",
				"isDisabled": true,
				"createdBy": "",
				"createdDate": new Date(),
				"modifiedBy": "",
				"modifiedDate": new Date()
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

		if (data.name.length > 0 && data.name.length < 255) {
			this.setState({ activeSubmit: true });

			// Check Validation 
			handleCheckValidation(true);


			// Handle New Data
			handleNewData(data);
		} else {
			this.setState({ activeSubmit: false });
			handleCheckValidation(false);

			// Handle New Data
			handleNewData(data);
		}
	}

	render() {
		const { data, errorInsert } = this.props;

		return (
			<div className={classes.formControl}>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Nhóm quyền&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<Validate
						validations={validations}
						rules={rules}
					>
						{({ validate, errorMessages }) => (
							<div className={classes.inputArea}>
								<InputGroup className="input-group-alternative css-border-input">
									<Input
										type="text"
										name='name'
										placeholder='Nhóm quyền'
										value={data.name}
										required
										onChange={validate}
										autoFocus={true}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								<p className='form-error-message margin-bottom-0'>{errorInsert.name || ''}</p>
							</div>
						)}
					</Validate>
				</div>

				<div className={`${classes.rowItem} ${classes.alignTop}`}>
					<label
						className="form-control-label"
					>
						Diễn giải
					</label>

					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative css-border-input">
							<Input
								type="textarea"
								name='description'
								placeholder='Diễn giải'
								value={data.description}
								required
								onChange={(event) => this.handleChange(event)}
							/>
						</InputGroup>
						<p className='form-error-message margin-bottom-0'>{errorInsert.description || ''}</p>
					</div>
				</div>
			</div>
		);
	}
};

export default AddNewModal;
