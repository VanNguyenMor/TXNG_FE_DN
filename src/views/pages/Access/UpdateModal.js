import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import classes from './index.module.css';
import Validate from "react-validate-form";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import { rules, validations, checkFieldName, checkFieldNameBool } from "../../../helpers/validation";
import { DATA_SORTODER_LIST } from "../../../helpers/constant";
import Select from "components/Select";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"

import compose from 'recompose/compose';
import { actionAccess } from "../../../actions/AccessActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { handleGenTree } from "../../../helpers/trees";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { actionField } from "../../../actions/FieldActions.js";

// reactstrap components
import {
	Input,
	InputGroup,
	Button
} from "reactstrap";

class UpdateModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newData: {
				"ID": "",
				"FieldID": "",
				"InformID": "",
				"Name": "",
				"files": "",
				"isRequired": true,
				"isQuarantine": false,
				"isHarvest": false,
				"isHarvest2": false,
				"isEvaluated": false
			},
			activeSubmit: false,
			checkFieldName: '',
			fileView: null,
			file: null,
			dataSortOder: DATA_SORTODER_LIST,
			dataInPopup: [],
			field: [],
			dataAllFromUpdate: [],
			fieldTypes: [],
			fieldTypeName: '',
			fieldName: '',
			fields: []
		}
		// this.handleChangeIMG = this.handleChangeIMG.bind(this);
		this.refEditor = null;
		this.refFileImage = null;
	}

	componentDidMount() {
		const { detail, fieldType } = this.props;
		let { newData } = this.state;

		const fieldId = detail.fieldID || detail.FieldID;

		const _fieldType = detail.fieldType || detail.FieldType;

		const fieldTypes = ((fieldType.data || {}).fieldTypes || {}).fieldTypes || [];

		const fieldTypeSelect = fieldTypes.find(p => p.id == _fieldType);

		if (fieldTypeSelect) {
			const { requestFieldChildrenEndStore } = this.props;

			requestFieldChildrenEndStore(JSON.stringify({
				"search": "",
				"filter": fieldTypeSelect.id,
				"orderBy": "",
				"page": null,
				"limit": null
			})).then(res => {
				const fields = ((res.data || {}).data || {}).fields || [];

				let fieldName = '';
				const field = fields.find(p => p.id == fieldId);

				if (field) {
					fieldName = field.name || '';
				}

				this.setState(previousState => {
					return {
						...previousState,
						fields,
						fieldName
					}
				});
			});

			this.setState(previousState => {
				return {
					...previousState,
					fieldTypeName: fieldTypeSelect.name
				}
			});
		}

		newData = {
			"ID": detail.id,
			"FieldID": fieldId,
			"InformID": detail.informID,
			"Name": detail.name,
			"files": "",
			"Image": detail.image,
			"sortOrder": detail.sortOrder === null ? '' : detail.sortOrder,
			"isRequired": detail.isRequired === null ? false : detail.isRequired,
			"isQuarantine": detail.isQuarantine === null ? false : detail.isQuarantine,
			"isHarvest": detail.isHarvest === null ? false : detail.isHarvest,
			"isHarvest2": detail.isHarvest2 === null ? false : detail.isHarvest2,
			"isEvaluated": detail.isEvaluated === null ? false : detail.isEvaluated,
		}

		this.setState({ newData, file: detail.image });
		this.handleCheckValidation();
	}

	componentWillReceiveProps(nextProp) {
		let { data } = nextProp.access;
		const fieldTypes = (((nextProp.fieldType || {}).data || {}).fieldTypes || {}).fieldTypes || [];
		let { dataAllFromUpdate } = this.state
		let newData = [];
		let collapseList = [];
		if (data !== this.state.dataInPopup) {
			if (data.accessPopup !== null) {
				if (typeof (data) !== 'undefined') {
					if (typeof (data.accessPopup) !== 'undefined') {
						if (data.accessPopup !== null) {
							if (typeof (data.accessPopup.informations) !== 'undefined') {
								newData = data.accessPopup.informations;
								dataAllFromUpdate = data.accessPopup.informations;
								newData.map(item => (
									collapseList.push({ id: item.id, collapse: false })
								));
								newData.map((item, key) => {
									item['parentID'] = item.informID === null ? '' : item.informID
								});

								newData = handleGenTree(data.accessPopup.informations, 'name');
								newData.map((item, key) => {
									item['index'] = key + 1
								});

								this.setState({ data: [] });
								this.setState({
									dataInPopup: newData,
									collapseList: collapseList,
									dataAllFromUpdate: data.accessPopup.informations,
									listLength: newData.length,
									isLoaded: false,
									status: data.status,
									message: PLEASE_CHECK_CONNECT(data.message),
									fieldTypes
								});
							} else {
								this.setState({
									dataInPopup: [],
									isLoaded: data.isLoading,
									status: data.status,
									message: PLEASE_CHECK_CONNECT(data.message),
									fieldTypes
								});
							}
						}
					}
				}
			}
		}
		this.handleCheckValidation(dataAllFromUpdate);
	}

	componentWillMount() {
		const { field, currentFilter } = this.props;
		this.setState({ field, currentFilter })
		const { requestAccessPopupStore } = this.props;
		requestAccessPopupStore(JSON.stringify({
			"search": "",
			"filter": currentFilter == "" ? 0 : currentFilter,
			"orderBy": "",
			"page": null,
			"limit": null
		}))
	}

	handleChangeIMG = event => {

		if (event.target.files[0] != undefined) {
			this.setState({
				fileView: URL.createObjectURL(event.target.files[0]),
				file: event.target.files[0],
			})
		} else {
			this.setState({
				fileView: null,
				file: null,
			})
		}
		let { newData } = this.state;
		const ev = event.target.files[0];
		newData.files = ev;
		this.setState({ newData });
		this.handleCheckValidation();
	}

	onUpdateFileImage = () => {
		this.refFileImage.click();
	}

	onDeleImg = () => {
		this.setState(previousState => {
			return {
				...previousState,
				file: null,
				fileView: null
			}
		}
		)
	}

	handleChange = (event) => {
		let { newData } = this.state;
		let { field } = this.props;
		const ev = event.target;
		newData[ev['name']] = ev['value'];
		this.setState({ newData });

		// Check Validation 
		this.handleCheckValidation();
	}

	handleSelect = (value, name) => {
		const { handleSelect } = this.props;
		let { newData } = this.state;
		if (name == 'FieldID') {
			this.setState({ currentFilter: value });
		}
		if (name == 'FieldID') {
			this.setState({ dataAllFromUpdate: [] })
			if (value == "") { value = null }
			const { requestAccessPopupStore } = this.props;
			requestAccessPopupStore(JSON.stringify({
				"search": "",
				"filter": value == "" ? 0 : value,
				"orderBy": "",
				"page": null,
				"limit": null
			}))
		}

		if (name === 'sortOrder') {
			let valsortOrder = value;
			if (valsortOrder == null) {
				this.setState({ sortOrderChange: null })
			}
		}

		if (value === null) value = "";
		newData[name] = value;

		this.setState({ newData });

		// Check Validation 
		this.handleCheckValidation();

		// handleSelect(value, name);
	}

	handleStatus = (event) => {
		let { newData } = this.state;
		const ev = event.target;

		newData[ev['name']] = ev['checked'];
		this.setState({ newData });
	}

	handleCheckValidation = (dataVl = null) => {
		const { handleCheckValidation, handleNewData } = this.props;
		let { newData, dataAllFromUpdate } = this.state;
		let { field } = this.props;
		if (dataVl !== null) { dataAllFromUpdate = dataVl };
		// Check Validation 
		handleCheckValidation(true);
		// Handle New Data
		handleNewData(newData, dataAllFromUpdate);
	}

	onChangeSelect = name => value => {
		if (name == 'FieldTypeID') {
			const fieldType = this.state.fieldTypes.find(p => p.id == value);

			if (fieldType) {
				const { requestFieldChildrenEndStore } = this.props;

				requestFieldChildrenEndStore(JSON.stringify({
					"search": "",
					"filter": fieldType.id,
					"orderBy": "",
					"page": null,
					"limit": null
				})).then(res => {
					const fields = ((res.data || {}).data || {}).fields || [];

					this.setState(previousState => {
						return {
							...previousState,
							fields
						}
					});
				});

				this.setState(previousState => {
					return {
						...previousState,
						fieldTypeName: fieldType.name
					}
				});
			}
		} else if (name == 'FieldID') {
			const field = this.state.fields.find(p => p.id == value);

			if (field) {
				this.setState(previousState => {
					return {
						...previousState,
						fieldName: field.fieldName,
						newData: {
							...previousState.newData,
							[name]: value
						}
					}
				});
			}
		}
	}

	render() {
		const { detail, informData, handleOpenSelectTree, errorUpdate, fieldAll } = this.props;
		const { fields, fieldName: _fieldName, fieldTypeName, fieldTypes, newData, dataSortOder, sortOrderChange, field, dataInPopup, currentFilter } = this.state;

		let _dataSortOder
		let _dataSortOderName

		if (newData.sortOrder) {
			_dataSortOder = dataSortOder.filter(x => newData.sortOrder == x.number)
			if (sortOrderChange === null) {
				_dataSortOderName = null
			} else {
				_dataSortOderName = (_dataSortOder[0] || {}).number
			}
		}

		let fieldName = _fieldName || '';
		let dataMapth = [];

		// if (currentFilter) {
		// 	fieldName = fieldAll.filter(item => item.id == currentFilter)
		// }

		if (currentFilter) {
			// dataMapth = dataInPopup.filter((item) =>
			// 	(item.fieldName.trim().toUpperCase() == fieldName[0].fieldName.trim().toUpperCase()))

			dataMapth = dataInPopup.filter((item) =>
				(item.name.trim().toUpperCase() == fieldName.trim().toUpperCase()))
		}

		return (
			<div className={classes.formControl}>
				<div className={`${classes.rowItem} Access_margin`}>
					<label
						className="form-control-label"
					>
						Nhóm ngành&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					<div className={classes.inputArea}>
						<Select
							labelMark={fieldTypeName}
							name="FieldTypeID"
							title='Chọn nhóm ngành'
							data={fieldTypes}
							labelName='name'
							val='id'
							handleChange={this.onChangeSelect('FieldTypeID')}
						/>
						<p className='form-error-message margin-bottom-0'>{errorUpdate['FieldTypeID'] || ''}</p>
					</div>
				</div>
				<div className={`${classes.rowItem} Access_margin`}>
					<label
						className="form-control-label"
					>
						Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					<div className={classes.inputArea}>
						{/* <SelectTree
							name="FieldID"
							title='Chọn ngành nghề'
							data={field}
							// selected={detail.fieldID}
							selected={currentFilter}
							labelName='fieldName'
							fieldName='fieldName'
							val='id'
							handleChange={this.handleSelect}
							handleOpenSelectTree={handleOpenSelectTree}

						/> */}
						<Select
							labelMark={fieldName}
							name="FieldID"
							title='Chọn ngành nghề'
							data={fields}
							labelName='name'
							val='id'
							handleChange={this.onChangeSelect('FieldID')}
						/>
						<p className='form-error-message margin-bottom-0'>{errorUpdate['FieldID'] || ''}</p>
					</div>
				</div>

				{/* <div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Thuộc truy xuất
					</label>

					<SelectTree
						name="InformID"
						title='Chọn truy xuất'
						data={dataMapth}
						selected={detail.informID}
						labelName='name'
						fieldName='name'
						val='id'
						handleChange={this.handleSelect}
						handleOpenSelectTree={handleOpenSelectTree}
					/>
				</div> */}

				<div className={`${classes.rowItem} Access_margin`}>
					<label
						className="form-control-label"
					>
						Tên truy xuất&nbsp;<b style={{ color: 'red' }}>*</b>
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
										name='Name'
										defaultValue={detail.name}
										placeholder='Tên truy xuất'
										required
										onChange={validate}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								<p className='form-error-message margin-bottom-0'>{errorUpdate['Name'] || ''}</p>
							</div>
						)}
					</Validate>
				</div>
				<div className={`${classes.rowItem} Access_margin`}>
					<label
						className="form-control-label"
					>
						Sắp xếp
					</label>
					<div className={classes.inputArea}>
						<Select
							name='sortOrder'
							labelName='number'
							data={dataSortOder}
							defaultValue={detail.sortOrder}
							labelMark={_dataSortOderName}
							val='number'
							title='Chọn'
							handleChange={this.handleSelect}
						/>
						{/* <p className='form-error-message margin-bottom-0'>{errorInsert['sortOrder'] || ''}</p> */}
					</div>
				</div>
				<div className={`${classes.rowItem} Access_margin`}>
					<label
						className="form-control-label"
					>
						Hình ảnh
					</label>
					<div className={classes.inputArea}>
						<div style={{ position: 'relative' }}>
							<InputGroup className="input-group-alternative css-border-input" style={{ width: 82, }}>
								<input
									ref={ref => this.refFileImage = ref}
									type="file"
									name='files'
									style={{ display: 'none' }}
									required
									onChange={this.handleChangeIMG}
									accept="image/*"
								//onKeyUp={(event) => this.handleChangeIMG(event)}
								/>

								{
									this.state.fileView === null ? (
										<img
											src={this.state.file ? this.state.file : NoImg}
											style={{ width: '82px', height: '82px', maxWidth: 320, maxHeight: 320 }} />
									) : (
										<img
											src={this.state.fileView ? this.state.fileView : NoImg}
											style={{ width: '82px', height: '82px', maxWidth: 320, maxHeight: 320 }} />
									)
								}
							</InputGroup>
							<div className="css-button-access">
								<Button type="button" size="lg" className='btn-primary-cs'
									onClick={this.onUpdateFileImage}>
									<img src={PlusImg} alt='Thêm mới' />
									<span>Chọn hình</span>
								</Button>
								{this.state.file != null ? (
									<div style={{ position: 'absolute', top: "-12px", left: 72 }}>
										<Button
											color="default"
											data-dismiss="modal"
											type="button"
											className={`css-icon-button-access`}
											onClick={this.onDeleImg}
										>
											{/* <img src={CloseIcon} alt='Thoát ra' /> */}
											<span>X</span>
										</Button>
									</div>
								) : null}
							</div>

						</div>
					</div>

				</div>
				<div className={`${classes.rowItem} ${classes.checkboxItem} update-css-check row`} style={{ marginTop: 10, marginLeft: 130, justifyContent: 'flex-start' }}>
					<div className="row col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
						<input
							name="isRequired"
							type="checkbox"
							checked={newData.isRequired}
							className="checkbox-status"
							onClick={(event) => this.handleStatus(event)}
						/>
						<label style={{ width: 'auto' }}>Bắt buộc</label>
					</div>
					<div className="row  col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
						<input
							name="isQuarantine"
							type="checkbox"
							checked={newData.isQuarantine}
							className="checkbox-status"
							onClick={(event) => this.handleStatus(event)}
						/>
						<label style={{ width: 'auto' }}>Kiểm tra cách ly</label>
					</div>
					<div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
						<input
							name="isHarvest"
							type="checkbox"
							checked={newData.isHarvest}
							disabled={newData.isEvaluated || newData.isHarvest2 ? true : false}
							className="checkbox-status"
							onClick={(event) => this.handleStatus(event)}
						/>
						<label style={{ width: 'auto' }}>Nhập kho </label>
					</div>
					<div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
						<input
							name="isEvaluated"
							type="checkbox"
							disabled={newData.isHarvest || newData.isHarvest2 ? true : false}
							checked={newData.isEvaluated}
							className="checkbox-status"
							onClick={(event) => this.handleStatus(event)}
						/>
						<label style={{ width: 'auto' }}>Đánh giá</label>
					</div>
					<div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
						<input
							name="isHarvest2"
							type="checkbox"
							checked={newData.isHarvest2}
							className="checkbox-status"
							disabled={newData.isEvaluated || newData.isHarvest ? true : false}
							onClick={(event) => this.handleStatus(event)}
						/>
						<label style={{ width: 'auto' }}>Chuyển giao</label>
					</div>
				</div>
			</div>
		);
	}
};

// export default UpdateModal;
const mapStateToProps = (state) => {
	return {
		access: state.AccessStore,
		field: state.FieldStore,
		fieldType: state.FieldTypeStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionAccess, dispatch),
		...bindActionCreators(actionField, dispatch)
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(UpdateModal);
