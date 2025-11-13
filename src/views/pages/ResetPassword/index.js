/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { LOADING_TIME } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../actions/AuthenActions";
import classes from './index.module.css';
import '../../../assets/css/global/index.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import LoginImg from "../../../assets/img/buttons/logout.svg"

// import Modal from '../../../components/modal';
// import ForgotPassword from '../../pages/forgotPassword';

// reactstrap components
import {
	Button,
	Card,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Col,
	Spinner
} from "reactstrap";

import Message, { TYPES } from "../../../components/message";
import { getErrorMessageServer } from "utils/errorMessageServer.js";

class ResetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			isLoaded: null,
			status: null,
			username: '',
			email: '',
			numberphone: '',
			message: '',
			type: 1
		};
	}

	componentWillReceiveProps(nextProp) {
		const { account } = nextProp;

		this.setState({
			data: account.data.data,
			isLoaded: account.data.isLoading,
			status: account.data.status,
			message: PLEASE_CHECK_CONNECT(account.data.message)
		});
	}

	componentDidUpdate() {
		// This method is called when the route parameters change
		this.closeStatusModal();
	}

	handleUserLogin = (event) => {
		const { onUserLogin } = this.props;
		const { username, email, numberphone } = this.state;

		event.preventDefault();

		if (username.trim().length > 0 && (email.trim().length > 0 || numberphone.trim().length > 0)) {

			this.setState({ isLoaded: true });

			onUserLogin(JSON.stringify({
				username: username,
				email: email,
			}), res => {
				this.setState({ isLoaded: false });

				const data = res || {};

				if (data.status == 200) {
				} else {
					const message = getErrorMessageServer(res);

					//Message.show(TYPES.ERROR, 'Thông báo', message || 'Sai tên tài khoản hoặc mật khẩu');
				}
			});
		}
	}

	handleAccount = (event) => {
		const ev = event.target;

		this.setState({ [ev['name']]: ev['value'] });
	}

	closeStatusModal = () => {
		const { status } = this.state;

		if (status !== null) {
			this.handleGoToHome();

			setTimeout(() => {
				this.setState({ status: null });
			}, LOADING_TIME);
		}
	}

	/**
	 * handleGoToHome: Handle Go To Home
	 */
	handleGoToHome = () => {
		const { status } = this.state;

		if (status) window.location.href = '/';
	}

	onForgotPassword = e => {
		// 
	}

	onCloseModal = () => {
		if (this.refModal) {
			this.refModal.close();

			if (this.refForgotPassword) {
				this.refForgotPassword.resetForm();
			}
		}
	}

	setRefForgotPassword = ref => {
		this.refForgotPassword = ref;
	}

	handleSelectType = (val) => {
		this.setState({ type: val });
	}

	render() {
		const { status, username, email, numberphone, message, isLoaded, type } = this.state;
		const statusPopup = { status: status, message: message };

		return (
			isLoaded ? (
				<Spinner style={{ width: '3rem', height: '3rem' }} />
			) : (
				<>
					<Col lg="5" md="7">
						<Card className="bg-secondary shadow border-0">
							<div className={`modal-header ${classes.moduleHeaderArea}`}>
								<h5 className="modal-title">
									Quên mật khẩu
								</h5>
							</div>

							<CardBody className="px-lg-5 py-lg-5">
								<Form role="form">
									<FormGroup className={`mb-3 ${classes.type}`}>
										<input type="radio" value={1} checked={type === 1 && true} onClick={() => this.handleSelectType(1)} />
									  <label htmlFor="html">Gửi Email</label>

									  <input type="radio" value={0} checked={type === 0 && true} onClick={() => this.handleSelectType(0)} />
									  <label htmlFor="css">Gửi SMS</label>
									</FormGroup>

									<FormGroup className="mb-3">
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
												<div>
													<InputGroup className="input-group-alternative">
														<InputGroupAddon addonType="prepend">
															<InputGroupText>
																<i className="ni ni-circle-08" />
															</InputGroupText>
														</InputGroupAddon>
														<Input
															name='username'
															defaultValue={username}
															placeholder="Tên đăng nhập"
															required
															type="text"
															onChange={validate}
															onKeyUp={(event) => this.handleAccount(event)}
														/>
													</InputGroup>
													<p className={classes.error}>{errorMessages.username}</p>
												</div>
											)}
										</Validate>
									</FormGroup>

									<FormGroup className="mb-3">
										<label
											className="form-control-label"
										>
											Email&nbsp;<b style={{ color: 'red' }}>*</b>
										</label>
										<Validate
											validations={validations}
											rules={rules}
										>
											{({ validate, errorMessages }) => (
												<div>
													<InputGroup className="input-group-alternative">
														<Input
															type="email"
															name="email"
															defaultValue={email}
															placeholder='Email'
															required
															onChange={validate}
															onKeyUp={(event) => this.handleAccount(event)}
														/>
													</InputGroup>
													<p className={classes.error}>{errorMessages.email}</p>
												</div>
											)}
										</Validate>
									</FormGroup>
									
									<FormGroup className="mb-3">
										<label
											className="form-control-label"
										>
											Điện thoại&nbsp;<b style={{ color: 'red' }}>*</b>
										</label>
										<Validate
											validations={validations}
											rules={rules}
										>
											{({ validate, errorMessages }) => (
												<div>
													<InputGroup className="input-group-alternative">
														<Input
															type="number"
															name="numberphone"
															defaultValue={numberphone}
															placeholder='Điện thoại'
															required
															onChange={validate}
															onKeyUp={(event) => this.handleAccount(event)}
														/>
													</InputGroup>
													<p className={classes.error}>{errorMessages.numberphone}</p>
												</div>
											)}
										</Validate>
									</FormGroup>

									<div className="text-center">
										<Button
											type='submit'
											// className={`my-4 btn-primary-cs auto-center ${username.trim().length > 0 && password.trim().length > 0 ? '' : 'disbale-btn-cs'}`}
											className={`my-4 btn-success-cs auto-center`}
											disabled={username.trim().length > 0 && (type === 1 && email.trim().length > 0 || type === 0 && numberphone.trim().length > 0) ? false : true}
											onClick={(event) => this.onForgotPassword(event)}
										>
											<img src={LoginImg} alt="Gửi" />
											Gửi
										</Button>
									</div>
								</Form>
							</CardBody>
						</Card>
						<Row className="mt-3">
							<Col xs="6">
								<a
									className="text-white"
									href="/nguoi_dung/login"
								>
									<small>{`< Đăng nhập`}</small>
								</a>
							</Col>
						</Row>
					</Col>
					{/* <Modal excludes='text-light' ref={ref => this.refModal = ref}>
						<ForgotPassword onClose={this.onCloseModal} setRef={this.setRefForgotPassword} />
					</Modal> */}
					{
						//Set Alert Context
						setAlertContext(statusPopup)
					}

					{
						//Open Alert Context
						openAlertContext(statusPopup)
					}
				</>
			)
		);
	}
};

const mapStateToProps = (state) => {
	return {
		account: state.AuthenStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onUserLogin: bindActionCreators(actionCreators.userLogin, dispatch)
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(ResetPassword);
