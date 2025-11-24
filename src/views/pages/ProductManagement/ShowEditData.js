import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      productId: null,
      zoneId: null,
      typeWrite: null,
      inputFields: [
        { label: "Input 1", value: "Input 1", errorKey: "input1" },
        { label: "Input 2", value: "Input 2", errorKey: "input2" },
        { label: "Input 3", value: "Input 3", errorKey: "input3" },
      ],
    };
  }

  async componentDidMount() {
    const { onHandleChangeValue } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }
    this.setState(
      (previousState) => {
        return {
          ...previousState,
        };
      },
      () => {
        if (onHandleChangeValue) {
          onHandleChangeValue(this.state);
        }
      }
    );

    this.focusInput();
  }

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();

        clearTimeout(timeOut);
      }, 100);
    }
  };

  onChangeSelect = (name) => (value) => {
    this.setState(
      (prevState) => {
        let newState = {
          ...prevState,
          [name]: value,
        };
        return newState;
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onChangeValue = (name) => (e) => {
    const value = e.target.value;
    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: value,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onChangeSelectType = () => {
    this.resetFieldValue();
  };

  resetFieldValue = () => {
    alert();
  };

  handleFileChange = (files) => {
    this.setState({ file: files[0]?.name || "" });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  calculateTotalAmount = (quantity, price, vatRate) => {
    const subtotal = Number(quantity) * Number(price);
    const vatFactor = 1 + Number(vatRate) / 100;

    const totalAmount = subtotal * vatFactor;

    return Math.round(totalAmount);
  };

  handleScanQR = () => {
    console.log("Đã nhấn nút Yêu cầu mở Camera.");
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = {
        ...prevState,
        [name]: checked,
      };

      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(newState);
      }

      return newState;
    });
  };

  render() {
    const { errMessage, popupMessage, zoneId, inputFields, typeWrite } =
      this.state;
    const { errors } = this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Tiêu đề&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="text"
                value="Dép lê"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.title || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">Code</label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value="ASDASDAS2173817391HASDA"
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.code || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Người thực hiện
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value="Anh Lan"
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.code || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày thực hiện
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value="2025/11/02"
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.code || ""}</p>
          </div>
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <h3>Thể loại nhật ký</h3>

        <div className="list">
          {typeWrite != null
            ? inputFields.map((field, index) => (
                <div key={index} className="wrap-insert-or-update-zone-item">
                  <label className="wrap-insert-or-update-zone-item-label">
                    {field.label}&nbsp;<b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="wrap-insert-or-update-zone-item-box">
                    <InputGroup className="input-group-alternative css-border-input">
                      <input
                        value={field.value}
                        type="text"
                        className="wrap-insert-or-update-zone-item-input"
                      />
                    </InputGroup>

                    <p className="form-error-message">
                      {errors[field.errorKey] || ""}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />

        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={errMessage}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default ShowEditData;
