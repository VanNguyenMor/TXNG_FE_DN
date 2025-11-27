import React, { Component } from "react";
import DefaultAva from "../../../assets/user.png";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";
import Select from "components/Select";
import classes from "./index.module.css";

// reactstrap components
import { Input, InputGroup, Button } from "reactstrap";

class AddNewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        id: "",
        fullName: "",
        phoneNumber: "",
        position: "",
        department: "",
        roleID: "",
        userName: "",
        email: "",
        passwordHash: "",
        companyID: "",
        passwordConfirm: "",
        avatarFile: "",
      },
      activeSubmit: false,
      uploadImg: false,
    };
  }

  componentWillMount() {
    let { data } = this.state;
    this.handleCheckValidation();
  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev["name"]] = ev["value"];
    this.setState({ data });

    // Check Validation
    this.handleCheckValidation();
  };

  handleSelect = (value, name) => {
    let { data } = this.state;

    if (value === null) value = "";
    data[name] = value;

    this.setState({ data });

    // Check Validation
    this.handleCheckValidation();
  };

  handleCheckValidation = () => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { data } = this.state;

    if (
      data.fullName.length > 0 &&
      data.phoneNumber.length > 0 &&
      data.email.length > 0 &&
      data.roleID.length > 0 &&
      data.userName.length > 0 &&
      data.passwordHash.length > 0 &&
      data.passwordConfirm.length > 0 &&
      data.passwordHash === data.passwordConfirm &&
      data.position < 255 &&
      data.department < 255
    ) {
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
  };

  handleUploadFile = (event) => {
    const { data } = this.state;
    let output = event.target.files[0];

    document.getElementById("blah").src = window.URL.createObjectURL(
      event.target.files[0]
    );
    data["avatarFile"] = output;

    this.setState({ uploadImg: true, data });
    // Check Validation
    this.handleCheckValidation();
  };

  render() {
    const { data, errorInsert } = this.props;
    // console.log(data);
    return (
      <div className={classes.formControl}>
        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">
            Họ và tên&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={data.fullName}
                required
                autoFocus={true}
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["fullName"] || ""}
            </p>
          </div>
        </div>

        {/* <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">Điện thoại&nbsp;</label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="phoneNumber"
                placeholder="Điện thoại"
                value={data.phoneNumber}
                required
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["phoneNumber"] || ""}
            </p>
          </div>
        </div> */}

        {/* <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">Email&nbsp;</label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={data.email}
                required
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["email"] || ""}
            </p>
          </div>
        </div> */}

        {/* <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">Chức vụ</label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="position"
                value={data.position}
                placeholder="Chức vụ"
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["position"] || ""}
            </p>
          </div>
        </div>

        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">Phòng ban</label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="department"
                placeholder="Phòng ban"
                value={data.department}
                required
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["department"] || ""}
            </p>
          </div>
        </div> */}

        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">
            Nhóm quyền&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={`${classes.inputArea} `}>
            <Select
              className="css-select-border"
              name="roleID"
              title="Chọn nhóm quyền"
              data={data}
              labelName="name"
              val="id"
              isHideSelectAll={true}
              isMulti={true}
              handleChange={this.handleSelect}
            />

            <div
              style={{
                width: "100%",
              }}
            >
              <p className="form-error-message margin-bottom-0">
                {errorInsert["roleID"] || ""}
              </p>
            </div>
          </div>
        </div>

        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">
            Tên đăng nhập&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="text"
                name="userName"
                placeholder="Tên đăng nhập"
                value={data.userName}
                required
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>
            <p className="form-error-message margin-bottom-0">
              {errorInsert["userName"] || ""}
            </p>
          </div>
        </div>

        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">
            Mật khẩu&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="password"
                name="passwordHash"
                placeholder="Mật khẩu"
                required
                value={data.passwordHash}
                onKeyUp={(event) => this.handleChange(event)}
                autoComplete="new-password"
              />
            </InputGroup>

            <p className="form-error-message margin-bottom-0">
              {errorInsert["passwordHash"] || ""}
            </p>
          </div>
        </div>

        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label">
            Nhắc lại&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={classes.inputArea}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                type="password"
                name="passwordConfirm"
                placeholder="Nhắc lại mật khẩu"
                value={data.passwordConfirm}
                required
                onKeyUp={(event) => this.handleChange(event)}
              />
            </InputGroup>

            <p className="form-error-message margin-bottom-0">
              {errorInsert["passwordConfirm"] || ""}
            </p>
          </div>
        </div>

        {/* <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="form-control-label" style={{ height: 30 }}>
            Hình đại diện
          </label>
          <div className={classes.inputArea}>
            <div className={classes.inputArea}>
              <img
                id="blah"
                src={Noimg}
                alt="Ảnh đại diện"
                width="100"
                height="100"
                className={classes.ava}
              />
            </div>
            <div className="upload-btn-wrapper">
              <Button
                type="button"
                size="lg"
                className={`btn-primary-cs ${classes.buttonUpload}`}
              >
                Cập nhật hình ảnh
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => this.handleUploadFile(event)}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default AddNewModal;
