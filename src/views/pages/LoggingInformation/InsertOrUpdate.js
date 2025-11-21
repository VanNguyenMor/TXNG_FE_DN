import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      zoneId: null,
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

  handleSelect = (value, name) => {
    const { handleSelect } = this.props;
    let { newData } = this.state;
    if (name == "FieldID") {
      this.setState({ currentFilter: value });
    }
    if (name == "FieldID") {
      const { requestAccessPopupStore } = this.props;

      requestAccessPopupStore(
        JSON.stringify({
          search: "",
          filter: value == "" ? 0 : value,
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    }

    if (value === null) value = "";

    newData[name] = value;

    this.setState({ newData });

    this.handleCheckValidation();
  };

  render() {
    const { errMessage, popupMessage, jobId, productId } =
      this.state;
    const { errors, PRODUCT_OPTIONS, JOB_OPTIONS, PLANTINGZONE_OPTIONS } =
      this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngành nghề&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={jobId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="jobId"
              title="Chọn ngành nghề"
              data={JOB_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("jobId")}
            />

            <p className="form-error-message">{errors.supplierId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Sản phẩm
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={productId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="productId"
              title="Chọn sản phẩm"
              data={PRODUCT_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("productId")}
            />

            <p className="form-error-message">{errors.productId || ""}</p>
          </div>
        </div>
        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="wrap-insert-or-update-zone-item-label">
            Vị trí&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className={`${classes.inputArea} `}>
            <Select
              className="css-select-border"
              name="zoneId"
              title="Chọn vị trí"
              data={PLANTINGZONE_OPTIONS}
              labelName="title"
              val="id"
              isHideSelectAll={true}
              isMulti={true}
              handleChange={this.onChangeSelect("zoneId")}
            />
          </div>
        </div>

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

export default InsertOrUpadte;
