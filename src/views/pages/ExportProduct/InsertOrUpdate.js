import React, { Component } from "react";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";
import { IMPORT_EXPORT_PRODUCT_TYPE } from "helpers/constant";
import { parseMoney } from "utils/formatMoney";
import { formatMoney } from "utils/formatMoney";
import { IMPORT_PRODUCT_TYPE } from "helpers/constant";
import { EXPORT_PRODUCT_TYPE } from "helpers/constant";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importTypeId: null,
      ingredientId: null,
      supplierId: null,
      productId: null,
      warehouseId: null,
      SUPPLIER_LIST: [
        { id: 1, name: "Khách hàng A" },
        { id: 2, name: "Khách hàng B" },
      ],
      INGREDIENT_LIST: [
        {
          id: 1,
          name: "Lô hàng A",
          unit: 1,
          quantity: 20,
          warehouseId: 1,
        },
        {
          id: 2,
          name: "Lô hàng B",
          unit: 1,
          quantity: 1,
          warehouseId: 2,
        },
      ],
      PRODUCT_LIST: [
        { id: 1, name: "Sản phẩm A" },
        { id: 2, name: "Sản phẩm B" },
      ],
      WAREHOUSE_LIST: [
        { id: 1, name: "Kho hàng A" },
        { id: 2, name: "Kho hàng B" },
      ],
      UNIT_LIST: [
        { id: 1, name: "Cái" },
        { id: 2, name: "Chiếc" },
      ],
      id: null,
      receiptNumber: "",
      creationDate: "",
      importer: "",
      note: "",
      file: "",
      unit: "",
      quantity: 0,
      vat: 0,
      price: 0,
      status: 0,
      inventory: 0,
      qrCode: "",
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
                productId: null,
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
        console.log(
          "new state.warehouseId:",
          this.state.warehouseId,
          typeof this.state.warehouseId
        );
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

  render() {
    const {
      importTypeId,
      errMessage,
      popupMessage,
      INGREDIENT_LIST,
      PRODUCT_LIST,
      SUPPLIER_LIST,
      WAREHOUSE_LIST,
      UNIT_LIST,
      ingredientId,
      productId,
      receiptNumber,
      creationDate,
      supplierId,
      importer,
      note,
      warehouseId,
      quantity,
      vat,
      price,
      unit,
      status,
      inventory,
    } = this.state;
    const { errors, STATUS_OPTIONS } = this.props;
    const isIngredient = Number(importTypeId) === 1;
    const isProduct = Number(importTypeId) === 2;
    const isScanQR = Number(importTypeId) === 3;

    return (
      <div className="wrap-insert-or-update-zone">
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Loại phiếu&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={importTypeId}
              defaultValue={importTypeId}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="importTypeId"
              title="Chọn loại phiếu"
              data={EXPORT_PRODUCT_TYPE}
              labelName="name"
              val="id"
              handleChange={this.onChangeSelect("importTypeId")}
            />
            <p className="form-error-message">{errors.importTypeId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Số phiếu&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("receiptNumber")}
                type="text"
                value={receiptNumber}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.receiptNumber || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày lập phiếu &nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <input
              type="date"
              className="wrap-insert-or-update-zone-item-input form-control"
              name="creationDate"
              value={creationDate}
              onChange={this.onChangeValue("creationDate")}
            />
            <p className="form-error-message">
              {this.props.errors.creationDate || ""}
            </p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Khách hàng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={supplierId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="supplierId"
              title="Chọn nhà cung cấp"
              data={SUPPLIER_LIST}
              labelName="name"
              val="id"
              handleChange={this.onChangeSelect("supplierId")}
            />

            <p className="form-error-message">{errors.supplierId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Trạng thái
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={status}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="status"
              title="Chọn trạng thái"
              data={STATUS_OPTIONS}
              labelName="name"
              val="id"
              handleChange={this.onChangeSelect("status")}
            />

            <p className="form-error-message">{errors.status || ""}</p>
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
            Người nhập&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={importer}
                onChange={this.onChangeValue("importer")}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
                style={{ pointerEvents: "none" }}
              />
            </InputGroup>

            <p className="form-error-message">{errors.importer || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ghi chú
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={note}
                onChange={this.onChangeValue("note")}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.note || ""}</p>
          </div>
        </div>
        <hr style={{ paddingTop: 5, marginBottom: 0, paddingBottom: 5 }} />
        <div className={`${classes.rowItem} mr-b-0 `}>
          <label className="wrap-insert-or-update-zone-item-label">
            Chứng từ liên quan
          </label>

          <div className={`${classes.inputArea} `}>
            <input
              type="file"
              className="form-control-file"
              name="relatedDocuments"
              multiple={true}
              onChange={(e) => this.handleFileChange(e.target.files)}
            />
          </div>
        </div>
        <hr style={{ paddingTop: 5, marginBottom: 0, paddingBottom: 5 }} />
        {importTypeId !== null && (
          <div>
            <h3>Chi tiết phiếu nhập</h3>

            {isIngredient && ( // Loại 1: Lô hàng
              <div className="wrap-insert-or-update-zone-item">
                <label className="wrap-insert-or-update-zone-item-label">
                  Chọn lô hàng&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className="wrap-insert-or-update-zone-item-box">
                  <Select
                    key={ingredientId}
                    value={ingredientId}
                    defaultValue={null}
                    labelMark={null}
                    className="wrap-insert-or-update-zone-item-select"
                    name="ingredientId"
                    title="Chọn lô hàng"
                    data={INGREDIENT_LIST}
                    labelName="name"
                    val="id"
                    handleChange={this.onChangeSelect("ingredientId")}
                  />
                  <p className="form-error-message">
                    {errors.ingredientId || ""}
                  </p>
                </div>
              </div>
            )}

            {isProduct && ( // Loại 2: Sản phẩm
              <div className="wrap-insert-or-update-zone-item">
                <label className="wrap-insert-or-update-zone-item-label">
                  Chọn sản phẩm&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className="wrap-insert-or-update-zone-item-box">
                  <Select
                    key={importTypeId}
                    value={productId}
                    defaultValue={null}
                    labelMark={null}
                    className="wrap-insert-or-update-zone-item-select"
                    name="productId"
                    title="Chọn sản phẩm"
                    data={PRODUCT_LIST}
                    labelName="name"
                    val="id"
                    handleChange={this.onChangeSelect("productId")}
                  />
                  <p className="form-error-message">{errors.productId || ""}</p>
                </div>
              </div>
            )}

            {isScanQR && (
              <div className="wrap-insert-or-update-zone-item">
                <label className="wrap-insert-or-update-zone-item-label">
                  Mã QR&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <button
                  onClick={this.handleScanQR}
                  type="button"
                  className="wrap-insert-or-update-zone-item-input btn btn-block btn-info"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "42px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <i className="fa fa-camera mr-2"></i> quét Mã QR
                </button>
              </div>
            )}

            <div
              className="wrap-insert-or-update-zone-item"
              style={{
                pointerEvents: isIngredient ? "none" : "auto",
                opacity: isIngredient ? ".5" : "1",
              }}
            >
              <label className="wrap-insert-or-update-zone-item-label">
                Chọn kho hàng&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <Select
                  key={ingredientId}
                  value={warehouseId}
                  labelMark={null}
                  className="wrap-insert-or-update-zone-item-select"
                  name="warehouseId"
                  title="Chọn kho hàng"
                  data={WAREHOUSE_LIST}
                  labelName="name"
                  val="id"
                  handleChange={this.onChangeSelect("warehouseId")}
                />
                <p className="form-error-message">{errors.warehouseId || ""}</p>
              </div>
            </div>

            <div
              className="wrap-insert-or-update-zone-item"
              style={{
                pointerEvents: isIngredient ? "none" : "auto",
                opacity: isIngredient ? ".5" : "1",
              }}
            >
              <label className="wrap-insert-or-update-zone-item-label">
                Số lượng&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    key={importTypeId}
                    value={quantity}
                    onChange={this.onChangeValue("quantity")}
                    type="number"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
                <p className="form-error-message">{errors.quantity || ""}</p>
              </div>
            </div>

            <div
              className="wrap-insert-or-update-zone-item"
              style={{
                pointerEvents: isIngredient ? "none" : "auto",
                opacity: isIngredient ? ".5" : "1",
              }}
            >
              <label className="wrap-insert-or-update-zone-item-label">
                Đơn vị tính&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <Select
                  key={ingredientId}
                  value={unit}
                  labelMark={null}
                  className="wrap-insert-or-update-zone-item-select"
                  name="unit"
                  title="Chọn đơn vị tính"
                  data={UNIT_LIST}
                  labelName="name"
                  val="id"
                  handleChange={this.onChangeSelect("unit")}
                />
                <p className="form-error-message">{errors.unit || ""}</p>
              </div>
            </div>

            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Giá&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    key={importTypeId}
                    value={formatMoney(price)}
                    onChange={(e) => {
                      const parsed = parseMoney(e.target.value);
                      this.setState({ price: parsed });
                    }}
                    type="text"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
                <p className="form-error-message">{errors.price || ""}</p>
              </div>
            </div>

            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                VAT (%)&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={vat}
                    onChange={this.onChangeValue("vat")}
                    type="number"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
                <p className="form-error-message">{errors.vat || ""}</p>
              </div>
            </div>

            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Thành tiền
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    readOnly
                    key={importTypeId}
                    value={this.calculateTotalAmount(quantity, price, vat)}
                    type="text"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
              </div>
            </div>

            {isIngredient ? null : (
              <div className="wrap-insert-or-update-zone-item">
                <label className="wrap-insert-or-update-zone-item-label">
                  Tồn kho
                </label>
                <div className="wrap-insert-or-update-zone-item-box">
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      key={importTypeId}
                      value={inventory}
                      onChange={this.onChangeValue("inventory")}
                      type="number"
                      className="wrap-insert-or-update-zone-item-input"
                    />
                  </InputGroup>
                </div>
              </div>
            )}
          </div>
        )}

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
