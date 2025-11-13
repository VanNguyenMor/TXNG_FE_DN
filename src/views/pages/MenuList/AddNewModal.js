import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { DATA_SORTODER_LIST } from "../../../helpers/constant";

import { rules, validations, checkMenuName, checkMenuNameBool, } from "../../../helpers/validation";
import Select from "components/Select";
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
				"menuName": '',
				"parentID": 0,
				"content": '',
				"sortOrder": 0
				//"isNew": false
			},
			activeSubmit: false,
			checkMenuName: '',
			dataSortOder: DATA_SORTODER_LIST,
		}
	}

	componentDidMount() {

	}

	handleChange = (event) => {
		let { data } = this.state;
		let { menu, menuAll } = this.props;
		//console.log(menuAll)
		const ev = event.target;

		data[ev['name']] = ev['value'];
		this.setState({ data });

		// Check Validation 
		this.handleCheckValidation();


		// this.setState({
		// 	checkMenuName: checkMenuName(data.menuName, menuAll)
		// });
	}

	handleSelect = (value, name) => {
		let { data } = this.state;
		if (value === null) value = "";

		if (name == 'parentID') {
			data['parentID'] = parseInt(value)
		}
		data[name] = value;


		this.setState({ data });
		// Check Validation 
		this.handleCheckValidation();
	}

	clearData = () => {
		this.state = {
			data: {
				"menuName": '',
				"parentID": 0,
				"content": '',
				"sortOrder": 0
				//"isNew": false
			},
		}
	}

	handleCheckValidation = () => {
		const { handleCheckValidation, handleNewData } = this.props;
		let { data } = this.state;
		let { menu } = this.props;
		this.setState({ activeSubmit: true });
		// Check Validation 
		handleCheckValidation(true);
		// Handle New Data
		handleNewData(data);

	}

	setIsNews(event) {
		let { data } = this.state;
		const ev = event.target.value === 'false' ? false : true;
		data.isNew = ev;
		this.setState({ data });
		this.handleCheckValidation();
	}
	render() {
		const { menu, handleOpenSelectTree, errorInsert } = this.props;
		const { data, checkMenuName, dataSortOder } = this.state;

		return (
			<div className={classes.formControl}>
				{/* <div className={classes.rowItem} style={{ marginBottom: 0 }}>
					<label
						className="form-control-label"
					>

					</label>
					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative"
							style={{
								boxShadow: 'none'
							}}
						>
							<div className={classes.rowItem} style={{ marginBottom: 0 }}>
								<div className="col">
									<Input
										type="radio"
										value={false}
										name="isNews"
										onChange={this.setIsNews.bind(this)}
										defaultChecked
									/>Tin tức
								</div>
								<div className="col">
									<Input
										type="radio"
										value={true}
										name="isNews"
										onChange={this.setIsNews.bind(this)}
									/>Bài viết
								</div>
								<p className='form-error-message margin-bottom-0'>{errorInsert['isNews'] || ''}</p>
							</div>
						</InputGroup>
					</div>
				</div> */}
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
										placeholder='Tên menu'
										//defaultValue={data.menuName}

										onChange={validate}
										autoFocus={true}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								{
									typeof (checkMenuName) !== 'undefined' && (
										checkMenuName.length > 0 && (
											<p className={classes.error}>{checkMenuName}</p>
										)
									)
								}
								<p className={classes.error}>{errorMessages.menuName}</p>
								<p className='form-error-message margin-bottom-0'>{errorInsert['menuName'] || ''}</p>
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
							val='number'
							title='Chọn'
							handleChange={this.handleSelect}
						/>
						<p className='form-error-message margin-bottom-0'>{errorInsert['sortOrder'] || ''}</p>
					</div>
				</div>
				<div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Thuộc menu
					</label>
					<div className={classes.inputArea}>
						{/* <InputGroup className="input-group-alternative css-border-input"> */}
						<SelectTree
							name="parentID"
							title='Chọn menu'
							data={menu}
							labelName='menuName'
							fieldName='menuName'
							val='id'
							handleChange={this.handleSelect}
							handleOpenSelectTree={handleOpenSelectTree}
						/>
						{/* </InputGroup> */}
					</div>
					<p className='form-error-message margin-bottom-0'>{errorInsert['parentID'] || ''}</p>
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
										placeholder='Nội dung'
										//defaultValue={data.menuName}

										onChange={validate}
										onKeyUp={(event) => this.handleChange(event)}
									/>
								</InputGroup>
								{/* {
									typeof (checkMenuName) !== 'undefined' && (
										checkMenuName.length > 0 && (
											<p className={classes.error}>{checkMenuName}</p>
										)
									)
								} */}
								<p className={classes.error}>{errorMessages.content}</p>
							</div>
						)}
					</Validate>
				</div>
			</div>
		);
	}
};

export default AddNewModal;
