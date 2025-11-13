import React, { Component } from "react";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";

// reactstrap components
import {
	Input,
	InputGroup
} from "reactstrap";

class UpdateModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null,
			newData: null,
			checkConfirmPass: '',
			activeSubmit: false
		}
	}

	componentDidMount() {
		const { data } = this.props;
		this.setState({ data, newData: data });
	}

	handleChange = (event) => {
		let { data } = this.state;
		const ev = event.target;

		// data[ev['name']] = ev['value'];
		// this.setState({ data });

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
			if (data.reason !== null) {
				if (data.reason.length > 0) {
					this.setState({ activeSubmit: true });

					// Check Validation 
					handleCheckValidation(true);


					// Handle New Data
					handleNewDetail(name, value);
				} else {
					this.setState({ activeSubmit: false });
					handleCheckValidation(false);

					// Handle New Data
					handleNewDetail(name, data);
				}
			} else {
				this.setState({ activeSubmit: false });
				handleCheckValidation(false);

				// Handle New Data
				handleNewDetail(name, value);
			}
		}
	}

	render() {
		const { data } = this.props;

		return (
			<div className={classes.formControl}>
				<div className={`${classes.rowItem} ${classes.alignTop}`}>
					<label
						className="form-control-label"
					>
						Lý do không duyệt&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

			
					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative">
							<Input
								type="textarea"
								name='reason'
								placeholder='Lý do không duyệt'
								//defaultValue={data.reason}
								required
								// onChange={validate}
								onKeyUp={(event) => this.handleChange(event)}
							/>
						</InputGroup>

						{/* <div className={classes.error}>{errorMessages.reason}</div> */}
					</div>


				</div>
			</div>
		);
	}
};

export default UpdateModal;
