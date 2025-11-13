import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";

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
			data: null,
			activeSubmit: false,
			passwordConfirm: '',
			checkPasswordConfirm: ''
		}
	}

	componentDidMount() {
		const { data, handleNewData } = this.props;

		let dataUpdate = data;
		dataUpdate.PasswordHash = "";
		this.setState({ data: dataUpdate });

		if (handleNewData) {
			handleNewData(data);
		}
		// console.log(dataUpdate)
		this.handleCheckValidation();
	}

	handleChange = (event) => {
		let { data } = this.state;
		const ev = event.target;

		// if (ev['name'].indexOf('passwordConfirm') > -1) {
		// 	this.setState({ [ev['name']]: ev['value'] });
		// }
		// else data[ev['name']] = ev['value'];
		data[ev['name']] = ev['value'];
		this.setState({ data });

		// Check Validation 
		this.handleCheckValidation();

		// Check Confirm Password
		// this.setState({
		// 	checkConfirmPass: checkPasswordConfirm(data.PasswordHash, this.state.passwordConfirm)
		// });
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
		// Check Validation 
		handleCheckValidation(true);

		// Handle New Data
		handleNewData(data);
	}

	handleClear = () => {
		this.setState({
			data: null,
			activeSubmit: false,
			passwordConfirm: ''
		})
	}

	handleUploadFile = (event) => {
		const { data } = this.state;
		let output = event.target.files[0];

		document.getElementById('blah').src = window.URL.createObjectURL(event.target.files[0]);
		data['avatarFile'] = output;

		this.setState({ uploadImg: true, data });

		// Check Validation 
		this.handleCheckValidation();
	}

	render() {
		const { roles, errorUpdate } = this.props;
		const { data, checkConfirmPass } = this.state;
		return (
			data !== null && (
				<div className={classes.formControl}>
					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Họ và tên&nbsp;<b style={{ color: 'red' }}>*</b>
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
											name='FullName'
											placeholder='Họ và tên'
											defaultValue={data.FullName}
											required
											onChange={validate}
											autoFocus={true}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.FullName}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['fullName'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Điện thoại&nbsp;
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
											name='PhoneNumber'
											placeholder='Điện thoại'
											defaultValue={data.PhoneNumber}
											required
											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.PhoneNumber}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['phoneNumber'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Email&nbsp;
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
											name='Email'
											placeholder='Email'
											defaultValue={data.Email}
											required
											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.Email}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['email'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Chức vụ
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
											name='Position'
											defaultValue={data.Position}
											placeholder='Chức vụ'
											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.Position}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['position'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Phòng ban
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
											name='Department'
											placeholder='Phòng ban'
											defaultValue={data.Department}
											required
											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.Department}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['department'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Nhóm quyền&nbsp;<b style={{ color: 'red' }}>*</b>
						</label>
						<div className={classes.inputArea}>
							<Select
								name="RoleID"
								title='Chọn nhóm quyền'
								data={roles}
								defaultValue={data.RoleID}
								labelName='name'
								val='id'
								isHideSelectAll={true}
								isMulti={true}
								handleChange={this.handleSelect}
							/>
							<p className='form-error-message margin-bottom-0'>{errorUpdate['roleID'] || ''}</p>
						</div>
					</div>


					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Tên đăng nhập&nbsp;<b style={{ color: 'red' }}>*</b>
						</label>

						<Validate
							validations={validations}
							rules={rules}
						>
							{({ validate, errorMessages }) => (
								<div className={classes.inputArea}>
									<InputGroup className="input-group-alternative css-border-input">
										<Input
											readOnly
											disabled
											type="text"
											name='UserName'
											placeholder='Tên đăng nhập'
											defaultValue={data.UserName}
											required
											onChange={validate}
											onKeyUp={(event) => this.handleChange(event)}
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.UserName}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['userName'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Mật khẩu&nbsp;<b style={{ color: 'red' }}>*</b>
						</label>

						<Validate
							validations={validations}
							rules={rules}
						>
							{({ validate, errorMessages }) => (
								<div className={classes.inputArea}>
									<InputGroup className="input-group-alternative css-border-input">
										<Input
											type="password"
											name='PasswordHash'
											placeholder='Mật khẩu'
											required
											defaultValue={data.PasswordHash}
											onKeyUp={(event) => this.handleChange(event)}
											onChange={validate}
											autoComplete="new-password"
										/>
									</InputGroup>
									<p className={classes.error}>{errorMessages.PasswordHash}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['passwordHash'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
						>
							Nhắc lại&nbsp;<b style={{ color: 'red' }}>*</b>
						</label>

						<Validate
							validations={validations}
							rules={rules}
						>
							{({ validate, errorMessages }) => (
								<div className={classes.inputArea}>
									<InputGroup className="input-group-alternative css-border-input">
										<Input
											type="password"
											name='passwordConfirm'
											placeholder='Nhắc lại mật khẩu'
											defaultValue={this.state.passwordConfirm}
											required
											onKeyUp={(event) => this.handleChange(event)}
											onChange={validate}
										/>
									</InputGroup>
									{
										typeof (checkConfirmPass) !== 'undefined' && (
											checkConfirmPass.length > 0 && (
												<p className={classes.error}>{checkConfirmPass}</p>
											)
										)
									}

									<p className={classes.error}>{errorMessages.passwordConfirm}</p>
									{/* <p className='form-error-message margin-bottom-0'>{errorUpdate['passwordConfirm'] || ''}</p> */}
								</div>
							)}
						</Validate>
					</div>

					<div className={`${classes.rowItem} mr-b-0 `}>
						<label
							className="form-control-label"
							style={{ height: 30 }}
						>
							Hình đại diện
						</label>

						<div className={classes.inputArea}>
							<div className={classes.inputArea}>
								<img id="blah" src={data.Avatar ? data.Avatar : Noimg} alt="Ảnh đại diện" width="100" height="100" className={classes.ava} />
							</div>
							<div className="upload-btn-wrapper">
								<Button type="button" size="lg" className={`btn-primary-cs ${classes.buttonUpload}`}>
									Cập nhật hình ảnh
								</Button>
								<input type="file" accept="image/*" onChange={(event) => this.handleUploadFile(event)} />
							</div>
						</div>
					</div>

					{
						<div className={classes.rowItem}>
							<label
								className="form-control-label"
							>
							</label>


						</div>
					}
				</div>
			)
		);
	}
};

export default UpdateModal;
