import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { DATA_SORTODER_LIST } from "../../../helpers/constant";


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
			newData: {
				id: '',
				menuName: '',
				parentID: '',
				content: '',
				sortOrder: ''
			},
			activeSubmit: false,
			dataSortOder: DATA_SORTODER_LIST,
		}
	}

	async componentDidMount() {
		const { data } = this.props;
		const { newData } = this.state;

		newData.id = data.id;
		newData.menuName = data.menuName;
		newData.parentID = data.parentID;
		newData.content = data.content;
		newData.sortOrder = data.sortOrder;

		this.setState({ newData });

		this.handleCheckValidation();
	}

	handleChange = (event) => {
		let { newData } = this.state;
		const ev = event.target;

		newData[ev['name']] = ev['value'];
		this.setState({ newData });
		// Check Validation 
		this.handleCheckValidation();
	}

	handleSelect = (value, name) => {
		let { newData } = this.state;

		if (value === null) value = "";


		if (name === 'sortOrder') {
			let valsortOrder = value;
			if (valsortOrder == null) {
				this.setState({ sortOrderChange: null })
			}
		}

		newData[name] = value;

		this.setState({ newData });

		// Check Validation 
		this.handleCheckValidation();
	}

	handleCheckValidation = () => {
		const { handleCheckValidation, handleNewDetail } = this.props;
		let { newData } = this.state;
		// Check Validation 
		handleCheckValidation(true);
		// Handle New Data
		handleNewDetail(newData);

	}

	render() {
		const { menu, errorUpdate } = this.props;
		const { data, newData, dataSortOder, sortOrderChange } = this.state;

		let _dataSortOder
		let _dataSortOderName

		if (newData.sortOrder) {

			_dataSortOder = dataSortOder.filter(x => newData.sortOrder == x.number)
			if (sortOrderChange === null) {
				_dataSortOderName = null
			} else {
				_dataSortOderName = _dataSortOder[0].number
			}
		}

		return (
			newData !== null && (
				<div className={classes.formControl}>

					<div className={classes.rowItem}>
						<label
							className="form-control-label"
						>
							Tên menu&nbsp;<b style={{ color: 'red' }}>*</b>
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
											name='menuName'
											//placeholder='Tên ngành nghề'
											defaultValue={newData.menuName}

											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>

									<p className='form-error-message margin-bottom-0'>{errorUpdate['menuName'] || ''}</p>
								</div>
							)}
						</Validate>
					</div>
					<div className={classes.rowItem}>
						<label
							className="form-control-label"
						>
							Sắp xếp&nbsp;<b style={{ color: 'red' }}>*</b>
						</label>
						<div className={classes.inputArea}>
							<Select
								name='sortOrder'
								labelName='number'
								data={dataSortOder}
								defaultValue={newData.sortOrder}
								labelMark={_dataSortOderName}
								val='number'
								title='Chọn'
								handleChange={this.handleSelect}
							/>
							<p className='form-error-message margin-bottom-0'>{errorUpdate['sortOrder'] || ''}</p>
						</div>
					</div>
					<div className={classes.rowItem}>
						<label
							className="form-control-label"
						>
							Thuộc menu
						</label>

						<SelectTree
							id="field-select"
							name="parentID"
							title='Chọn menu'
							data={menu}
							labelName='menuName'
							fieldName='menuName'
							selected={newData.parentID}
							val='id'
							handleChange={this.handleSelect}
						/>

					</div>
					<div className={classes.rowItem}>
						<label
							className="form-control-label"
						>
							Nội dung
						</label>

						<Validate
							validations={validations}
							rules={rules}
						>
							{({ validate, errorMessages }) => (
								<div className={classes.inputArea}>
									<InputGroup className="input-group-alternative css-border-input">
										<Input
											type="textarea"
											name='content'
											//placeholder='Tên menu'
											defaultValue={newData.content}

											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>

									{/* <p className={classes.error}>{errorMessages.menuName}</p> */}
								</div>
							)}
						</Validate>
					</div>
				</div>
			)
		);
	}
};

export default AddNewModal;
