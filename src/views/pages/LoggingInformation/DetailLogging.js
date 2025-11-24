import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

class DetailLogging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      zoneId: null,
      isShowList: false,
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
          ...(name === "importTypeId"
            ? {
                ingredientId: null,
                jobId: null,
                warehouseId: null,
                quantity: 0,
                vat: 0,
                price: 0,
                unit: "",
                inventory: 0,
              }
            : {}),
        };

        if (name === "ingredientId") {
          const selected = prevState.INGREDIENT_LIST.find((i) => i.id == value);

          if (selected) {
            newState = {
              ...newState,
              quantity: selected.quantity,
              unit: selected.unit !== null ? selected.unit : "",
              warehouseId:
                selected.warehouseId !== null ? selected.warehouseId : null,
            };
          }
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
    const { errMessage, popupMessage, jobId, productId, zoneId, isShowList } =
      this.state;
    const { errors, PRODUCT_OPTIONS, JOB_OPTIONS, PLANTINGZONE_OPTIONS } =
      this.props;

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
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Vị trí&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={jobId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="jobId"
              title="Chọn vị trí"
              data={PLANTINGZONE_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("jobId")}
            />

            <p className="form-error-message">{errors.supplierId || ""}</p>
          </div>
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <h3>Danh sách</h3>
        <div className="list">
          <div class="card mb-3">
            <div class="card-header bg-white p-0" id="headingNote">
              <h5 class="mb-0">
                <button
                  class="btn btn-block text-left d-flex justify-content-between align-items-center"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseNote"
                  aria-expanded="true"
                  aria-controls="collapseNote"
                >
                  <span class="text-info">Ghi Chú</span>
                  <i class="fas fa-chevron-up"></i>
                </button>
              </h5>
            </div>

            <div
              id="collapseNote"
              class="collapse show"
              aria-labelledby="headingNote"
              data-bs-parent="#accordionExample"
            >
              <div class="card-body p-3">
                <div class="d-flex mb-1">
                  <div class="text-muted">Ngày thực hiện: </div>
                  <div class="fw-bold">18/11/2025 13:04</div>
                </div>

                <div class="d-flex mb-1">
                  <div class="text-muted">Người thực hiện: </div>
                  <div class="fw-bold">Công ty Việt Mỹ</div>
                </div>

                <div class="d-flex mb-1">
                  <div class="text-muted">Kết quả: </div>
                  <div class="text-warning">Đang chờ</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mb-3">
            <div class="card-header bg-white p-0" id="headingNote">
              <h5 class="mb-0">
                <button
                  class="btn btn-block text-left d-flex justify-content-between align-items-center"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseNote"
                  aria-expanded="true"
                  aria-controls="collapseNote"
                >
                  <span class="text-info">Ghi Chú</span>
                  <i class="fas fa-chevron-up"></i>
                </button>
              </h5>
            </div>

            <div
              id="collapseNote"
              class="collapse show"
              aria-labelledby="headingNote"
              data-bs-parent="#accordionExample"
            >
              <div class="card-body p-3">
                <div class="d-flex mb-1">
                  <div class="text-muted">Ngày thực hiện: </div>
                  <div class="fw-bold">18/11/2025 13:04</div>
                </div>

                <div class="d-flex mb-1">
                  <div class="text-muted">Người thực hiện: </div>
                  <div class="fw-bold">Công ty Việt Mỹ</div>
                </div>

                <div class="d-flex mb-1">
                  <div class="text-muted">Kết quả: </div>
                  <div class="text-warning">Đang chờ</div>
                </div>
              </div>
            </div>
          </div>
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

export default DetailLogging;
