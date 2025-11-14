import React, { Component } from "react";
import classes from "./index.module.css";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

// reactstrap components
import { Input, InputGroup } from "reactstrap";

class AddNewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      newData: null,
      checkConfirmPass: "",
      activeSubmit: false,
    };
  }

  componentDidMount() {
    const { data } = this.props;

    this.setState({ data, newData: data });
    this.handleCheckValidation();
  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev["name"]] = ev["value"];
    this.setState({ data });

    // Check Validation
    this.handleCheckValidation(ev["name"], ev["value"]);
  };

  handleSelect = (value, name) => {
    let { data } = this.state;

    if (value === null) value = "";
    // data[name] = value;

    // this.setState({ data });

    // Check Validation
    this.handleCheckValidation([name], value);
  };

  handleCheckValidation = (name = null, value = null) => {
    const { handleCheckValidation, handleNewDetail } = this.props;
    let { data } = this.state;

    if (data !== null) {
      if (data.name.length > 0 && data.name.length < 255) {
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
  };

  render() {
    const { data } = this.state;

    const { errorUpdate } = this.props;
    return (
      data !== null && (
        <div className={classes.formControl}>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Nhóm quyền&nbsp;<b style={{ color: "red" }}>*</b>
            </label>

            <Validate validations={validations} rules={rules}>
              {({ validate, errorMessages }) => (
                <div className={classes.inputArea}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <Input
                      type="text"
                      name="name"
                      placeholder="Nhập tiêu đề nhóm quyền"
                      defaultValue={data.name}
                      required
                      onChange={validate}
                      autoFocus={true}
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                  </InputGroup>
                  {/* <p className={classes.error}>{errorMessages.name}</p> */}
                  <p className="form-error-message margin-bottom-0">
                    {errorUpdate["name"] || ""}
                  </p>
                </div>
              )}
            </Validate>
          </div>

          <div className={`${classes.rowItem} ${classes.alignTop}`}>
            <label className="form-control-label">Mô tả</label>

            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  type="textarea"
                  name="description"
                  placeholder="Nhập mô tả nhóm quyền"
                  defaultValue={data !== null && data.description}
                  required
                  onChange={(event) => this.handleChange(event)}
                />
              </InputGroup>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default AddNewModal;
