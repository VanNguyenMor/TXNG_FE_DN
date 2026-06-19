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
import React, { Component, useState } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, BASE_URL, CLIENT_ID, CLIENT_SECRET, SCOPE, GRANT_TYPE } from "../../../services/Common";
import { LOADING_TIME } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../../actions/AuthenActions";
import classes from './index.module.css';
import '../../../assets/css/global/index.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import LoginImg from "../../../assets/img/buttons/logout.svg"
import axios from 'axios';
import qs from 'qs';
import { deleteCookie, getCookie, setCookie } from "../../../helpers/cookie.js";
import Loading from '../../../components/loading';
import { getHeader } from "../../../services/Dataservice";
import { generateCaptchaText, DEFAULTS } from '../../../helpers/capcha';
import refreshIcon from '../../../assets/img/icons/common/refresh-button.png';
import { splitMulti } from "../../../helpers/splitMulti";
import eye from "../../../assets/img/icons/common/eye.png"
import eyeOff from "../../../assets/img/icons/common/eye-off.png"
// import Modal from '../../../components/modal';
// import ForgotPassword from '../../pages/forgotPassword';

import { USER_LOGIN } from '../../../apis'
import { USER, DOMAIN, API } from '../../../services/Common'

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
  Spinner,
  Container
} from "reactstrap";

import Message, { TYPES } from "../../../components/message";
import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { functions } from "lodash";
import { getUrlCompanyAPI } from "../../../utils/service.js";

const LOGIN_ISSUE_STATUSES = [300, 301, 302, 303, 304, 305];

const parseLoginClaims = (claims) => {
  try {
    return JSON.parse(claims || "[]") || [];
  } catch (error) {
    return [];
  }
};

const buildLoginAuthData = (tokenResult, tokenAccount, company, infoData) => ({
  id: tokenAccount.id,
  userName: tokenAccount.userName,
  fullName: tokenAccount.fullName,
  companyID: tokenAccount.companyID,
  isAdmin: tokenAccount.isAdmin,
  claims: parseLoginClaims(tokenAccount.claims),
  companyCode: company.companyCode,
  expires: tokenResult.data.expires_in,
  token: tokenResult.data.access_token,
  refreshToken: tokenResult.data.refresh_token,
  loginStatus: infoData.status,
  loginMessage: infoData.message || "",
});

const completeLogin = (tokenResult, infoData, callBack, redirect) => {
  const tokenAccount = (infoData.data || {}).token || {};
  const company = (infoData.data || {}).company || {};

  if (localStorage.getItem("TOKEN") != null) {
    deleteCookie("AUTHEN_INFO");
  }

  const data = buildLoginAuthData(tokenResult, tokenAccount, company, infoData);
  setCookie("AUTHEN_INFO", JSON.stringify(data));

  if (
    infoData.message &&
    LOGIN_ISSUE_STATUSES.includes(infoData.status)
  ) {
    sessionStorage.setItem("LOGIN_MESSAGE", infoData.message);
  }

  if (callBack) {
    callBack();
  }

  redirect(data);
};

class Login extends Component {
  constructor(props) {
    super(props);
    const { originalCaptcha, displayCaptcha } = generateCaptchaText(DEFAULTS.lengthCaptcha, ' ');
    this.state = {
      data: [],
      isLoaded: false,
      status: null,
      username: '',
      password: '',
      message: '',
      errUsername: null,
      errPassWord: null,
      errLock: null,
      errSys: null,
      errSpam: null,
      errUsernameOrPassword: null,
      originalCaptcha,
      displayCaptcha,
      captcha: '',
      showPass: false
    };

    this.refModal = null;
    this.refForgotPassword = null;
    this.inputCaptcha = null;
  }

  componentDidMount() {
    deleteCookie('AUTHEN_INFO');
  }

  componentWillReceiveProps(nextProp) {
    const { account } = nextProp;
    this.setState({
      data: account.data.data,

      status: account.data.status,
      message: PLEASE_CHECK_CONNECT(account.data.message)
    });
  }

  componentDidUpdate() {
    // This method is called when the route parameters change

    this.closeStatusModal();
  }


  handleDetectDevice = () => {
    const userAgent = navigator.userAgent;

    return userAgent;
  }

  handleAccount = (event) => {
    const ev = event.target;
    this.setState({
      errUsername: null,
      errPassWord: null,
      errLock: null,
      errSpam: null,
      errUsernameOrPassword: null,
      errCatpcha: null,
    });


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

  getStateError = data => {
    if ((typeof (data.response) == 'undefined') || data.response.status == 500) {
      this.setState({ errLock: 'Lỗi hệ thống!' })
    } else if (data.response.status == 429) {
      this.setState({ errSpam: 'Tài khoản bị khóa 5 phút vì gửi yêu cầu quá nhiều lần!' })
    } else if (data.response.status == 400) {
      this.setState({ errUsernameOrPassword: 'Sai tên tài khoản hoặc mật khẩu!' })
    } else {
      this.setState({ errLock: 'Lỗi hệ thống!' })
    }
  }

  onKeyDownMain = e => {
    if (e.keyCode == 13) {
      const { username, password } = this.state;
      const { onUserLogin } = this.props;
      this.onCheckInput(() => {
        getAccessToken(username, password, onUserLogin, this.getStateError, this.props.loginSuccess, this.onOpenSpiner, this.onLoginFailed);
      })
    }
  }

  onOpenSpiner = (val) => {
    if (val) {
      this.setState({ isLoaded: true })
    } else {
      this.setState({ isLoaded: false })
    }
  }

  onLoginFailed = (message) => {
    this.setState({
      errSys: message || "Đăng nhập thất bại.",
      isLoaded: false,
    });
  }

  onNextInputCatpcha = () => {
    this.inputCaptcha.focus();
  }

  onCheckInput = (submit) => {

    const { captcha, originalCaptcha, username, password } = this.state;
    if (!username) {
      this.setState({ errUsername: 'Bạn vui lòng nhập tên đăng nhập' })
      return;
    }

    if (!password) {
      this.setState({ errPassWord: 'Bạn vui lòng nhập mật khẩu' })
      return;
    }

    if (!captcha) {
      this.setState({ errCatpcha: 'Bạn vui lòng nhập mã captcha' });
      return;
    }

    if (captcha != originalCaptcha) {
      this.setState({ errCatpcha: 'Mã captcha không đúng' });
      return;
    }

    if (submit) { submit() }
  }

  onPressCaptcha = () => {
    const { originalCaptcha, displayCaptcha } = generateCaptchaText(DEFAULTS.lengthCaptcha, ' ');

    this.setState(previousState => {
      return {
        ...previousState,
        displayCaptcha,
        originalCaptcha
      }
    });
  }

  onClickShowPass = () => {
    let { showPass } = this.state;
    this.setState({ showPass: !showPass })
  }

  render() {
    const { status, username, password, message, isLoaded, errUsernameOrPassword,
      isModalForgotPassword, errUsername, errPassWord, errLock, errSys, errSpam,
      displayCaptcha, captcha, errCatpcha, showPass
    } = this.state;
    const statusPopup = { status: status, message: message };

    return (
      isLoaded ? (
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      ) : (
        <div
          style={{
            display: 'flex'
          }}
          tabindex="0" onKeyDown={this.onKeyDownMain}>
          <Container>
            <Row xs="1" sm="1" lg="4" style={{ margin: 0 }}>
              {/* <Col lg="2" sm="0" xs="0"></Col> */}
              <Col lg="5" sm="12" xs="12">
                <div className="header py-3 py-lg-4 col-12">
                  <Container>
                    <div className="header-body text-center mb-3">
                      <div><h1 style={{ color: "#5fc2ff" }}><b>TRACE CENTER</b></h1></div>
                      <div><h3 style={{ color: "#000" }}>Đăng nhập hệ thống</h3></div>
                    </div>
                  </Container>
                </div>
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form">
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
                                  autoComplete="new-password"
                                  type="text"
                                  onChange={(e, _, __) => {
                                    this.handleAccount(e);
                                  }}
                                // onKeyUp={(event) => this.handleAccount(event)}
                                />
                              </InputGroup>
                              <p className={classes.error}>{errUsername}</p>
                            </div>
                          )}
                        </Validate>
                      </FormGroup>

                      <FormGroup>
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
                            <div>
                              <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="ni ni-lock-circle-open" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type={showPass ? "text" : "password"}
                                  name="password"
                                  defaultValue={password}
                                  placeholder='Mật khẩu'

                                  autoComplete="new-password"
                                  onChange={(e, _, __) => {
                                    this.handleAccount(e);
                                  }}
                                // onKeyUp={(event) => this.handleAccount(event)}
                                />
                                <img
                                  src={showPass ? eyeOff : eye}
                                  width={25}
                                  height={25}
                                  style={{
                                    cursor: 'pointer',
                                    alignSelf: 'center',
                                    marginLeft: 5
                                  }}
                                  onClick={this.onClickShowPass} />
                              </InputGroup>
                              <p className={classes.error}>{errPassWord}</p>
                              <p className={classes.error}>{errLock}</p>
                              <p className={classes.error}>{errSys}</p>
                              <p className={classes.error}>{errUsernameOrPassword}</p>
                              <p className={classes.error}>{errSpam}</p>
                            </div>
                          )}
                        </Validate>
                      </FormGroup>
                      <FormGroup>
                        <label
                          className="form-control-label"
                        >
                          Mã capcha&nbsp;<b style={{ color: 'red' }}>*</b>
                        </label>
                        <InputGroup className="input-group-alternative">
                          {/* <InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="ni ni-lock-circle-open" />
													</InputGroupText>
												</InputGroupAddon> */}
                          <Input
                            name="captcha"
                            value={captcha}
                            onChange={(e, _, __) => {
                              this.handleAccount(e);
                            }}
                            // onSubmitEditing={this.onSignIn}
                            // blurOnSubmit={false}
                            ref={input => this.inputCaptcha = input}
                            returnKeyType='go'
                            returnKeyLabel='Xong'
                            placeholder='Mã captcha'

                          //style={[style.formItemInput, style.formItemInputCaptcha]} 
                          />
                          <Input
                            value={displayCaptcha}
                            disabled
                            style={{
                              backgroundColor: 'rgb(95, 194, 255)',
                              color: '#fff',
                              textAlign: 'center',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              borderRadius: 5
                            }}
                          />
                          <img
                            src={refreshIcon}
                            width={25}
                            height={25}
                            style={{
                              cursor: 'pointer',
                              alignSelf: 'center',
                              marginLeft: 5
                            }}
                            onClick={this.onPressCaptcha} />
                        </InputGroup>
                        <p className={classes.error}>{errCatpcha}</p>

                      </FormGroup>
                      <Row>
                        <Col lg="6">
                          <div className="custom-control custom-control-alternative custom-checkbox">
                          </div>
                        </Col>
                        {/* <Col lg="6" style={{ textAlign: "right" }}>
                        <div>
                          <a
                            // className="text-white"
                            href="/nguoi_dung/quen_mat_khau"
                            style={{ color: '#000' }}
                          >
                            <small>Quên mật khẩu?</small>
                          </a>
                        </div>
                      </Col> */}
                        <div className="lineBlack"></div>
                      </Row>
                      <div className="text-center">
                        <Button
                          type='button'
                          className={`my-4 btn-primary-cs auto-center`}
                          //disabled={username.trim().length > 0 && password.trim().length > 0 ? false : true}
                          color='primary'
                          onClick={(event) => {
                            this.onNextInputCatpcha();
                            this.onCheckInput(() => {
                              getAccessToken(username, password, this.props.onUserLogin, this.getStateError, this.props.loginSuccess, this.onOpenSpiner, this.onLoginFailed);
                            })
                          }
                          }>
                          <img src={LoginImg} alt="Đăng nhập" />
                          Đăng nhập
                        </Button>
                      </div>
                    </Form>
                    <div>
                      <h3 style={{
                        textAlign: 'center',
                        color: '#f3a833'
                      }}>LACOGROUP</h3>
                      <p style={{
                        textAlign: 'center',
                        color: '#f3a833',
                        fontWeight: 800,
                        fontSize: 10,
                        marginTop: "-10px"
                      }}>Version 1.0.0.0001 - 2021</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="7" sm="12" xs="12"
                className={classes.textIntro}
              >
                <h1 className="text-white">Chào mừng đến với TRACE CENTER</h1>
                <br />
                <p className="text-white" style={{ fontSize: 15 }}>
                  Tất cả các loại hàng hóa trong siêu thị, cửa hàng tiện lợi,... hiện nay đều được định danh bởi một mã số, tương tự với một mã vạch. Bên cạnh đó, một số hàng hóa như nông sản, thực phẩm,... còn có thêm các mã QR. Để tìm hiểu về thông tin, nguồn gốc sản phẩm, người tiêu dùng chỉ cần mở chức năng quét mã QR trên smartphone (chức năng này cũng có thể quét được mã vạch). Nếu doanh nghiệp đã đăng ký truy xuất, thông tin sản phẩm, nguồn gốc sẽ lập tức được trả về trên một website. Điều này cho phép khách hàng hiểu nhiều hơn về sản phẩm, nhà sản xuất mà không bị giới hạn trong những nội dung trên bao bì.</p>
              </Col>
              {/* <Col lg="1" sm="0" xs="0"></Col> */}
            </Row>
          </Container>
          {
            //Set Alert Context
            setAlertContext(statusPopup)
          }

          {
            //Open Alert Context
            openAlertContext(statusPopup)
          }
        </div>
      )
    );
  }
};
export const getAccessToken = async (username, password, redirect, getStateError, callBack, onOpenSpiner, onLoginFailed) => {
  const axiosConfig = {
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const requestData = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'password',
    username: username,
    password: password,
    scope: SCOPE,
  };

  onOpenSpiner(true);

  try {
    const result = await axios.post('/connect/token', qs.stringify(requestData), axiosConfig);

    if (result.status != 200) {
      getStateError(result);
      onOpenSpiner(false);
      return;
    }

    const token = ((result || {}).data || {}).access_token || null;

    if (!token) {
      getStateError(result);
      onOpenSpiner(false);
      return;
    }

    const url = getUrlCompanyAPI("user/login");
    const info = await axios.get(url, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    const infoData = info.data || {};
    const status = infoData.status;

    if (status == 200 || LOGIN_ISSUE_STATUSES.includes(status)) {
      completeLogin(result, infoData, callBack, redirect);
      return;
    }

    onOpenSpiner(false);
    if (onLoginFailed) {
      onLoginFailed(infoData.message || "Đăng nhập thất bại.");
    }
  } catch (err) {
    getStateError(err);
    onOpenSpiner(false);
  }
}

export const getRefreshToken = (redirect, callBack) => {

  return new Promise(async (resolve, reject) => {

    //const currentUser = JSON.parse(getCookie('AUTHEN_INFO') || '{}');
    const currentUser = JSON.parse(getCookie('AUTHEN_INFO') || '{}');

    const refreshToken = currentUser.refreshToken;

    if (!refreshToken) {
      return resolve(false);
    }

    const axiosConfig = {
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const requestData = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: GRANT_TYPE,
      refresh_token: refreshToken,
      scope: SCOPE,
    };

    try {
      await axios.post('/connect/token', qs.stringify(requestData), axiosConfig).then(async result => {
        if (result.status == 200) {
          const token = ((result || {}).data || {}).access_token || null;
          const refreshToken = ((result || {}).data || {}).refresh_token || "";

          if (token) {
            const url = getUrlCompanyAPI("user/login");

            const info = await axios.get(url, {
              headers: {
                authorization: "Bearer " + token,
              },
            });
            const infoData = info.data || {};

            if (infoData.status == 200 || LOGIN_ISSUE_STATUSES.includes(infoData.status)) {
              completeLogin(result, infoData, null, redirect);
              window.location.reload();
              resolve(true);
            } else {
              resolve(false);
            }
          }
        } else {
          resolve(false);
        }
      })
    } catch (error) {
      resolve(false);
    }
  });
}

const mapStateToProps = (state) => {
  return {
    account: state.AuthenStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUserLogin: bindActionCreators(actionCreators.userLogin, dispatch),
    loginSuccess: bindActionCreators(actionCreators.loginSuccess, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Login);
