import React, { Component } from "react";
import classes from './index.module.css';
import ReactDatetime from "react-datetime";
import moment from 'moment';

// reactstrap components
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	FormGroup
} from "reactstrap";

class UpdateModal2 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				// deliveryDate: moment(new Date()).format('DD/MM/YYYY')
				deliveryDate: new Date()
			},
			activeSubmit: false,
		}
	}

	componentWillMount() {
		const { dataPopupDetail } = this.props;

		let _deliveryDate = new Date()
		if (dataPopupDetail) {
			if (dataPopupDetail.DeliveryDate) {
				this.setState({
					// data: { deliveryDate: moment(dataPopupDetail.DeliveryDate).format('DD/MM/YYYY'), }
					data: { deliveryDate: dataPopupDetail.DeliveryDate }
				}, () => {
					this.handleCheckValidation();
				});
			} else {
				this.setState({
					// data: { deliveryDate: moment(_deliveryDate).format('DD/MM/YYYY'), }
					data: { deliveryDate: _deliveryDate }
				}, () => {
					this.handleCheckValidation();
				});
			}
		}
		// console.log(dataPopupDetail);
	}



	handleChangeFromDate = (event) => {

		let _deliveryDate = event ? new Date(event) : ''

		this.setState({
			data: { deliveryDate: _deliveryDate },

		}, () => {
			this.handleCheckValidation();
		});
	}


	handleCheckValidation = () => {
		const { handleCheckValidation, handleNewDetail } = this.props;
		let { data } = this.state;
		this.setState({ activeSubmit: true });
		// Check Validation 
		handleCheckValidation(true);
		// Handle New Data
		handleNewDetail(data);
	}

	render() {
		const { errorUpdate } = this.props;
		const { data } = this.state;

		let dateConvert = data && moment(data.deliveryDate).format('DD-MM-YYYY')

		return (
			<div className={classes.formControl}>
				<div className={`${classes.rowItem} ${classes.alignTop}`} style={{ height: 330 }}>
					<label
						className="form-control-label"
					>
						Ngày trả tem&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<div className={classes.inputArea}>
						<FormGroup>
							<InputGroup className="input-group-alternative css-border-input">
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<i className="ni ni-calendar-grid-58" />
									</InputGroupText>
								</InputGroupAddon>
								<ReactDatetime
									inputProps={{
										placeholder: "Ngày trả tem"
									}}
									value={dateConvert}
									timeFormat={false}
									dateFormat="DD-MM-YYYY"
									onChange={(e) => this.handleChangeFromDate(e)}
								/>
							</InputGroup>
							{/* <p className='form-error-message margin-bottom-0'>{!(data.deliveryDate || {}) ? ("Ngày trả tem không đươc bỏ trống") : null}</p> */}
							<p className='form-error-message margin-bottom-0'>{(errorUpdate || {}).deliveryDate || ''}</p>
						</FormGroup>
					</div>
				</div>

			</div>
		);
	}
};

export default UpdateModal2;
