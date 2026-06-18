import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

const DATA_INSERT_FIELDS = ["reference_select", "case_yes", "case_no"];

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      retrieveId: null,
      name: "",
      order: null,
      dataTypeId: null,
      dataInsert: {},
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
        let newState = { ...prevState };

        if (name === "dataTypeId") {
          newState[name] = value;
          newState.dataInsert = {}; 
        } else if (DATA_INSERT_FIELDS.includes(name)) {
          newState.dataInsert = {
            ...prevState.dataInsert,
            [name]: value,
          };
        } else {
          newState[name] = value;
        }

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
        if (DATA_INSERT_FIELDS.includes(name)) {
          return {
            ...previousState,
            dataInsert: {
              ...previousState.dataInsert,
              [name]: value,
            },
          };
        } else {
          return {
            ...previousState,
            [name]: value,
          };
        }
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
    // Reset dynamic field values when type changes
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
    const {
      errMessage,
      popupMessage,
      jobId,
      productId,
      retrieveId,
      name,
      dataTypeId,
      order,
      dataInsert,
    } = this.state;
    const {
      errors,
      PRODUCT_OPTIONS,
      JOB_OPTIONS,
      RETRIEVE_OPTIONS,
      LOGGING_DATA_TYPES,
      REFERENCE_LIST,
    } = this.props;

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
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Truy xuất
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={retrieveId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="retrieveId"
              title="Chọn truy xuất"
              data={RETRIEVE_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("retrieveId")}
            />

            <p className="form-error-message">{errors.retrieveId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Tên kê khai&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={name}
                onChange={this.onChangeValue("name")}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.name || ""}</p>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Kiểu dữ liệu
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={dataTypeId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="dataTypeId"
              title="Chọn kiểu dữ liệu"
              data={LOGGING_DATA_TYPES}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("dataTypeId")}
            />

            <p className="form-error-message">{errors.dataTypeId || ""}</p>
          </div>
        </div>

        {(() => {
          const selectedDataType = (LOGGING_DATA_TYPES || []).find(
            (item) => item.id === dataTypeId
          );

          if (selectedDataType && selectedDataType.childInputs.length > 0) {
            return selectedDataType.childInputs.map((inputDef) => (
              <div
                key={inputDef.name}
                className="wrap-insert-or-update-zone-item"
              >
                <label className="wrap-insert-or-update-zone-item-label">
                  {inputDef.label}&nbsp;
                  {inputDef.required && <b style={{ color: "red" }}>*</b>}
                </label>

                <div className="wrap-insert-or-update-zone-item-box">
                  {inputDef.type === "select_input" ? (
                    <Select
                      value={dataInsert[inputDef.name]}
                      name={inputDef.name}
                      title={inputDef.placeholder}
                      data={this.props[inputDef.dataSource] || []}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect(inputDef.name)}
                    />
                  ) : (
                    <InputGroup className="input-group-alternative css-border-input">
                      <input
                        value={dataInsert[inputDef.name] || ""}
                        onChange={this.onChangeValue(inputDef.name)}
                        type={inputDef.type}
                        className="wrap-insert-or-update-zone-item-input"
                      />
                    </InputGroup>
                  )}

                  <p className="form-error-message">
                    {errors[inputDef.name] || ""}
                  </p>
                </div>
              </div>
            ));
          }
          return null;
        })()}

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Sắp xếp&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={order === null || order === undefined ? "" : order}
                onChange={this.onChangeValue("order")}
                type="number"
                min={1}
                max={100}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.order || ""}</p>
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
