import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";

// reactstrap components
import {
	Input,
	InputGroup
} from "reactstrap";
import { actionField } from "actions/FieldActions";
import { connect } from "react-redux";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { handleGenTree } from "helpers/trees";

class AddNewModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null,
			newData: null,
			activeSubmit: false,
			fields: [],
			fieldTypeName: ''
		}
	}

	componentDidMount() {
		const { data } = this.props;

		let newData = { ...data };

		this.handleCheckValidation();

		const { fieldTypes } = this.props;

		const _fieldTypes = ((fieldTypes.data || {}).fieldTypes || {}).fieldTypes || [];

		const fieldTypeId = (newData.fieldType || '').toString();

		const parentId = newData.parentID;

		newData.fieldTypeId = fieldTypeId;

		const fieldType = _fieldTypes.find(p => p.id == fieldTypeId);

		// console.log(newData);

		this.setState(previousState => {
			return {
				...previousState,
				fieldTypes: _fieldTypes,
				fieldTypeName: fieldType ? fieldType.name : '',
				newData,
				data: newData
			}
		}, () => this.getFieldByFieldType(fieldTypeId, parentId));
	}

	handleChange = (event) => {
		let { data } = this.state;
		const ev = event.target;

		// data[ev['name']] = ev['value'];

		// Check Validation 
		this.handleCheckValidation(ev['name'], ev['value']);
	}

	getFieldByFieldType = (fieldTypeId, parentId) => {
		const { fieldTypes } = this.state;

		this.setState(previousState => {
			return {
				...previousState,
				fields: []
			}
		});

		const fieldType = fieldTypes.find(p => p.id == fieldTypeId);

		if (fieldType) {
			this.setState(previousState => {
				return {
					...previousState,
					fieldTypeName: fieldType.name
				}
			}, () => {
				this.props.requestFieldMinLevelStore({ filter: fieldTypeId }).then(res => {
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
					}, () => {
						if (parentId) {
							const selectField = document.getElementById('field-select');

							if (selectField) {
								selectField.value = parentId;
							}
						}
					});
				});
			});
		}
	}

	handleSelect = (value, name) => {
		let { data, fieldTypes } = this.state;

		if (value === null) value = "";
		// data[name] = value;

		// this.setState({ data });

		// Check Validation 
		this.handleCheckValidation([name], value);

		if (name == 'fieldTypeId') {
			this.getFieldByFieldType(value);
		}
	}

	handleCheckValidation = (name = null, value = null) => {
		const { handleCheckValidation, handleNewDetail } = this.props;
		let { data } = this.state;

		if (data !== null) {
			if (data.fieldName.length > 0 && data.fieldName.length < 255) {
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
		const { field, errorUpdate, handleOpenSelectTree } = this.props;
		const { data, fields, fieldTypes, fieldTypeName } = this.state;
		return (
			data !== null && (
				<div className={classes.formControl}>
					<div className={classes.rowItem}>
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
									defaultValue={data.fieldCode}
									placeholder='Mã ngành nghề'
									autoFocus={true}
									onKeyUp={(event) => this.handleChange(event)}
									disabled
									readOnly
								/>
							</InputGroup>
							<p className='form-error-message margin-bottom-0'>{errorUpdate['fieldCode'] || ''}</p>
						</div>
					</div>
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
					<div className={classes.rowItem}>
						<label
							className="form-control-label"
						>
							Thuộc ngành nghề<b style={{ color: 'red' }}>*</b>
						</label>
						<SelectTree
							id="field-select"
							name="parentID"
							title='Chọn ngành nghề'
							data={fields}
							labelName='fieldName'
							fieldName='fieldName'
							selected={data.parentID}
							val='id'
							handleChange={this.handleSelect}
							handleOpenSelectTree={handleOpenSelectTree}
						/>
					</div>
					<p className='form-error-message margin-bottom-0'>{errorUpdate['parentID'] || ''}</p>
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
									<p className='form-error-message margin-bottom-0'>{errorUpdate['fieldName'] || ''}</p>
								</div>
							)}
						</Validate>
					</div>
				</div>
			)
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