import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkFieldName, checkFieldNameBool } from "../../../helpers/validation";
import { DATA_TYPE_FIELD_LIST } from "../../../helpers/constant";
import Select from "components/Select";
import { actionField } from "../../../actions/FieldActions";
import { handleGenTree } from "helpers/trees";

// reactstrap components
import {
	Input,
	InputGroup
} from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";

class AddNewModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				"id": "",
				"fieldCode": "",
				"fieldName": "",
				"parentID": ""
			},
			activeSubmit: false,
			checkFieldName: '',
			fields: [],
			fieldTypes: [],
			fieldTypeName: ''
		}
	}

	componentDidMount() {
		const { fieldTypes } = this.props;

		const _fieldTypes = ((fieldTypes.data || {}).fieldTypes || {}).fieldTypes || [];

		this.setState(previousState => {
			return {
				...previousState,
				fieldTypes: _fieldTypes
			}
		});
	}

	handleChange = (event) => {
		let { data } = this.state;
		let { field } = this.props;
		const ev = event.target;

		data[ev['name']] = ev['value'];
		this.setState({ data });

		// Check Validation 
		this.handleCheckValidation();

		// Check Confirm Password
		this.setState({
			checkFieldName: checkFieldName(data.fieldName, field)
		});
	}

	handleSelect = (value, name) => {
		let { data, fieldTypes } = this.state;

		if (value === null) {
			value = "";
		}

		data[name] = value;

		this.setState({ data });

		// Check Validation 
		this.handleCheckValidation();

		if (name == 'fieldTypeId') {
			this.setState(previousState => {
				return {
					...previousState,
					fields: []
				}
			});

			const fieldType = fieldTypes.find(p => p.id == value);

			if (fieldType) {
				this.setState(previousState => {
					return {
						...previousState,
						fieldTypeName: fieldType.name
					}
				}, () => {
					this.props.requestFieldMinLevelStore({ filter: value }).then(res => {
						const fields = (res.data || {}).fields || [];

						const collapseList = [];
						let newData = [];
						let treeLevel = [];

						fields.map(item => {
							collapseList.push({ id: item.id, collapse: false });

							if (!fields.find(p => p.id == item.parentID)) {
								item.parentID = null;
							}
						});

						newData = handleGenTree(fields, 'fieldName');

						newData.map((item, key) => (
							item['index'] = key + 1
						));

						const cb = (e, key, array) => {
							treeLevel.push(e.nodelv);

							e.children && e.children.forEach(cb);
						}

						newData.forEach(cb);

						treeLevel = [...new Set(treeLevel)];

						this.setState(previousState => {
							return {
								...previousState,
								fields: newData
							}
						});
					});
				});
			}
		}
	}

	handleCheckValidation = () => {
		const { handleCheckValidation, handleNewData } = this.props;
		let { data } = this.state;
		let { field } = this.props;

		// console.log(checkFieldNameBool(data.fieldName, field));
		if (data.fieldName.length > 0 && data.fieldName.length < 255 && !checkFieldNameBool(data.fieldName, field) === true) {
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
		const { handleOpenSelectTree, errorInsert } = this.props;
		const { data, fields, fieldTypeName, fieldTypes } = this.state;

		return (
			<div className={classes.formControl}>
				{/* <div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Mã ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative">
							<Input
								type="text"
								name='fieldCode'
								placeholder='Mã ngành nghề'
								autoFocus={true}
								onKeyUp={(event) => this.handleChange(event)}
							/>
						</InputGroup>
						<p className='form-error-message margin-bottom-0'>{errorInsert['fieldCode'] || ''}</p>
					</div>
				</div> */}
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Nhóm ngành nghề<b style={{ color: 'red' }}>*</b>
					</label>
					<Select
						labelMark={fieldTypeName}
						name="fieldTypeId"
						title='Chọn nhóm ngành nghề'
						data={fieldTypes}
						labelName='name'
						fieldName='name'
						val='id'
						handleChange={this.handleSelect}
					/>
				</div>
				<p className='form-error-message margin-bottom-0'>{errorInsert['fieldTypeId'] || ''}</p>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Thuộc ngành nghề<b style={{ color: 'red' }}>*</b>
					</label>
					<SelectTree
						name="parentID"
						title='Chọn ngành nghề'
						data={fields}
						labelName='fieldName'
						fieldName='fieldName'
						val='id'
						handleChange={this.handleSelect}
						handleOpenSelectTree={handleOpenSelectTree}
					/>
				</div>
				<p className='form-error-message margin-bottom-0'>{errorInsert['parentID'] || ''}</p>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Tên ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>

					<Validate
						validations={validations}
						rules={rules}
					>
						{({ validate, errorMessages }) => (
							<div className={classes.inputArea}>
								<InputGroup className="input-group-alternative">
									<Input
										type="text"
										name='fieldName'
										placeholder='Tên ngành nghề'
										defaultValue={data.fieldName}
										required
										onChange={validate}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								<p className='form-error-message margin-bottom-0'>{errorInsert['fieldName'] || ''}</p>

							</div>
						)}
					</Validate>
				</div>
				{/* <div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Loại ngành nghề<b style={{ color: 'red' }}>*</b>
					</label>
					<Select
						name="fieldType"
						title='Chọn loại ngành nghề'
						data={DATA_TYPE_FIELD_LIST}
						labelName='name'
						val='fieldType'
						handleChange={this.handleSelect}
					/>
				</div>
				<p className='form-error-message margin-bottom-0'>{errorInsert['fieldType'] || ''}</p> */}
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		fieldTypes: state.FieldTypeStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionField, dispatch)
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(AddNewModal);