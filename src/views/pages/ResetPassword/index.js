/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Spinner,
} from "reactstrap";

import Message, { TYPES } from "../../../components/message";
import { checkLinkForgotPassword, changePasswordForForgotPassword } from "../../../services/resetPasswordService";
import classes from "./index.module.css";
import '../../../assets/css/global/index.css';

const PASSWORD_RULES = [
  { key: "length", label: "Ít nhất 8 ký tự", validator: (v) => v.length >= 8 },
  { key: "uppercase", label: "Có chữ hoa", validator: (v) => /[A-Z]/.test(v) },
  { key: "lowercase", label: "Có chữ thường", validator: (v) => /[a-z]/.test(v) },
  { key: "number", label: "Có số", validator: (v) => /\d/.test(v) },
  { key: "special", label: "Có ký tự đặc biệt", validator: (v) => /[^A-Za-z0-9]/.test(v) },
];

const ResetPassword = () => {
  const history = useHistory();
  const location = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const username = queryParams.get("username") || "";
  const shortLinkId = queryParams.get("shortLinkId") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [linkValid, setLinkValid] = useState(false);

  const passwordRules = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.validator(password) })),
    [password]
  );

  const isPasswordValid = useMemo(() => passwordRules.every((rule) => rule.valid), [passwordRules]);
  const isConfirmValid = password.length > 0 && confirmPassword === password;
  const isMissingParams = !username || !shortLinkId;
  const isSubmitDisabled = isMissingParams || !linkValid || !isPasswordValid || !isConfirmValid || loading || checkingLink;

  useEffect(() => {
    document.title = "Đổi mật khẩu";
  }, []);

  // Kiểm tra link khi component mount
  useEffect(() => {
    const verifyLink = async () => {
      if (!username || !shortLinkId) {
        setCheckingLink(false);
        setIsLinkExpired(true);
        return;
      }

      try {
        setCheckingLink(true);
        const response = await checkLinkForgotPassword(username, shortLinkId);
        if (response.status === 200) {
          setLinkValid(true);
          setIsLinkExpired(false);
        }
      } catch (error) {
        const status = error?.status;
        let message = error?.message || "Không thể kiểm tra link.";

        if (status === 410 || status === 404) {
          message = "Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.";
        } else if (status === 400 || status === 401) {
          message = "Liên kết không hợp lệ hoặc đã được sử dụng.";
        }

        setIsLinkExpired(true);
        setStatusMessage({ type: "error", text: message });
      } finally {
        setCheckingLink(false);
      }
    };

    verifyLink();
  }, [username, shortLinkId]);

  useEffect(() => {
    // Prevent caching to avoid leaking reset tokens in intermediary storage.
    const cacheMeta = document.createElement("meta");
    cacheMeta.httpEquiv = "Cache-Control";
    cacheMeta.content = "no-store";
    document.head.appendChild(cacheMeta);

    return () => {
      document.head.removeChild(cacheMeta);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    setLoading(true);
    setStatusMessage({ type: null, text: "" });

    try {
      const response = await changePasswordForForgotPassword({
        username,
        shortLinkId,
        password: password,
        repeatPassword: confirmPassword,
      });

      const successMessage = response.message || "Đổi mật khẩu thành công";
      Message.show(TYPES.SUCCESS, "Thành công", successMessage);
      setStatusMessage({ type: "success", text: successMessage });

      // Clear sensitive data from memory after successful use.
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => history.push("/nguoi_dung/login"), 1200);
    } catch (error) {
      const status = error?.status;
      let message = error?.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.";

      if (status === 410) {
        message = "Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.";
        setIsLinkExpired(true);
      } else if (status === 400 || status === 401) {
        message = "Liên kết không hợp lệ hoặc đã được sử dụng. Vui lòng yêu cầu link mới.";
        setIsLinkExpired(true);
      } else if (status >= 500) {
        message = "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.";
      }

      Message.show(TYPES.ERROR, "Không thành công", message);
      setStatusMessage({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col lg="5" md="7" sm="10">
          <Card className="bg-secondary shadow border-0">
            <div className={`modal-header ${classes.moduleHeaderArea}`}>
              <h5 className="modal-title">Đổi Mật Khẩu</h5>
            </div>

            <CardBody className="px-lg-5 py-lg-5">
              {checkingLink && (
                <div className="text-center">
                  <Spinner color="info" />
                  <p className="mt-2">Đang kiểm tra liên kết...</p>
                </div>
              )}

              {!checkingLink && isMissingParams && (
                <div className={classes.alertError}>
                  <p>Liên kết không hợp lệ. Vui lòng mở lại link từ email để tiếp tục.</p>
                </div>
              )}

              {!checkingLink && isLinkExpired && (
                <div className={classes.alertWarning}>
                  <p>Liên kết không còn hiệu lực. Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.</p>
                </div>
              )}

              {!checkingLink && linkValid && (
                <Form role="form" onSubmit={handleSubmit} noValidate>
                  <FormGroup className="mb-3">
                    <label className={classes.label}>
                      Mật Khẩu Mới <b style={{ color: 'red' }}>*</b>
                    </label>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Nhập mật khẩu mới"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                        aria-required="true"
                      />
                    </InputGroup>
                    <Button
                      type="button"
                      size="sm"
                      color="link"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ padding: '5px 0', marginTop: '5px' }}
                    >
                      <i className={`ni ni-${showPassword ? 'fat-remove' : 'fat-add'}`} />
                      {showPassword ? " Ẩn" : " Hiện"}
                    </Button>
                    {password.length > 0 && !isPasswordValid && (
                      <p className={classes.error}>Mật khẩu chưa đáp ứng đủ yêu cầu.</p>
                    )}
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <label className={classes.label}>
                      Xác Nhận Mật Khẩu <b style={{ color: 'red' }}>*</b>
                    </label>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Nhập lại mật khẩu mới"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                        aria-required="true"
                      />
                    </InputGroup>
                    <Button
                      type="button"
                      size="sm"
                      color="link"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      style={{ padding: '5px 0', marginTop: '5px' }}
                    >
                      <i className={`ni ni-${showConfirmPassword ? 'fat-remove' : 'fat-add'}`} />
                      {showConfirmPassword ? " Ẩn" : " Hiện"}
                    </Button>
                    {Boolean(confirmPassword) && !isConfirmValid && (
                      <p className={classes.error}>Mật khẩu xác nhận chưa khớp.</p>
                    )}
                  </FormGroup>

                  <div className={classes.ruleBlock}>
                    <p className={classes.ruleTitle}>Mật khẩu cần đáp ứng:</p>
                    <ul className={classes.ruleList}>
                      {passwordRules.map((rule) => (
                        <li key={rule.key} className={rule.valid ? classes.ruleValid : ""}>
                          <i className={`ni ni-${rule.valid ? 'check-bold' : 'fat-add'}`} />
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {statusMessage.text && (
                    <div
                      className={statusMessage.type === "success" ? classes.statusSuccess : classes.statusError}
                      role="status"
                    >
                      {statusMessage.text}
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      color="info"
                      type="submit"
                      className="my-4"
                      disabled={isSubmitDisabled}
                    >
                      {loading ? <Spinner size="sm" /> : "Đổi Mật Khẩu"}
                    </Button>
                  </div>
                </Form>
              )}

              {!checkingLink && linkValid && (
                <Row className="mt-3">
                  <Col xs="12">
                    <a className="text-muted text-center d-block" href="/nguoi_dung/login">
                      <small>← Quay lại đăng nhập</small>
                    </a>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
