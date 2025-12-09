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

import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { IMPORT_EXPORT_PRODUCT_TYPE } from "helpers/constant";
import { parseMoney } from "utils/formatMoney";
import { formatMoney } from "utils/formatMoney";
import { IMPORT_PRODUCT_TYPE } from "helpers/constant";
import ReactDatetime from "react-datetime";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    const defaultState = {
      id: null,
      receiptNumber: "",
      creationDate: "",
      supplier: "",
      importer: "",
      note: "",
      status: 0,
      importTypeId: null,
      ingredientId: null,
      supplierId: null,
      productId: null,
      warehouseId: null,
      file: "",
      unit: "",
      quantity: 0,
      vat: 0,
      price: 0,
      // Details list
      grDetails: [],
      isAddingDetail: false,
    };

    this.state = props.dataInsert ? { ...defaultState, ...props.dataInsert } : defaultState;
  }

  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        id: null,
        importTypeId: null,
      };
    });
  }

  async componentDidMount() {
    const { onHandleChangeValue, id } = this.props;

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

  componentDidUpdate(prevProps) {
    const { onHandleChangeValue, dataInsert, SUPPLIER_LIST } = this.props;

    // When dataInsert prop changes (from parent edit data), update form state directly
    if (dataInsert && JSON.stringify(prevProps.dataInsert) !== JSON.stringify(dataInsert)) {
      this.setState((prevState) => {
        const newState = { ...prevState, ...dataInsert };
        
        // Log the matched supplier if found
        if (SUPPLIER_LIST && SUPPLIER_LIST.length > 0 && dataInsert.supplierId) {
          const matchedSupplier = SUPPLIER_LIST.find(
            s => s.id === dataInsert.supplierId || String(s.id) === String(dataInsert.supplierId)
          );
        }
        
        return newState;
      });
    }
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
      (prevState) => ({
        ...prevState,
        [name]: value,
        ...(name === "importTypeId"
          ? {
              ingredientId: null,
              productId: null,
              warehouseId: null,
              quantity: "",
              vat: "",
              price: "",
              unit: "",
              grDetails: [], // Reset detail list when changing type
            }
          : {}),
      }),
      () => {
        // Fetch unit when ingredient or product is selected
        if (name === "ingredientId" || name === "productId") {
          this.fetchUnitForItem(name, value);
        }
      }
    );
  };

  fetchUnitForItem = async (fieldName, itemId) => {
    if (!itemId) {
      this.setState({ unit: "" });
      return;
    }

    try {
      let unitName = "";
      
      if (fieldName === "ingredientId") {
        // Fetch unit for ingredient/material
        const { INGREDIENT_LIST } = this.props;
        if (INGREDIENT_LIST && Array.isArray(INGREDIENT_LIST)) {
          const ingredient = INGREDIENT_LIST.find(item => String(item.id) === String(itemId));
          if (ingredient && ingredient.unit) {
            unitName = ingredient.unit;
          }
        }
      } else if (fieldName === "productId") {
        // Fetch unit for product
        const { PRODUCT_LIST } = this.props;
        if (PRODUCT_LIST && Array.isArray(PRODUCT_LIST)) {
          const product = PRODUCT_LIST.find(item => String(item.id) === String(itemId));
          if (product && product.unit) {
            unitName = product.unit;
          }
        }
      }

      this.setState({ unit: unitName });
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };

  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: value,
        };
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

  // Handle adding detail to list
  onAddDetail = () => {
    const { ingredientId, productId, warehouseId, quantity, price, vat, unit } = this.state;
    
    // Validation
    if (!ingredientId && !productId) {
      alert("Vui lòng chọn nguyên liệu hoặc sản phẩm");
      return;
    }
    
    if (!warehouseId) {
      alert("Vui lòng chọn kho hàng");
      return;
    }
    
    if (!quantity || Number(quantity) <= 0) {
      alert("Vui lòng nhập số lượng > 0");
      return;
    }
    
    if (!unit) {
      alert("Vui lòng chọn nguyên liệu/sản phẩm để tự động lấy đơn vị tính");
      return;
    }

    // Create detail item
    const detailItem = {
      id: `detail_${Date.now()}`,
      ingredientId,
      productId,
      warehouseId,
      quantity: Number(quantity),
      price: Number(price),
      vat: Number(vat),
      unit,
      amount: this.calculateTotalAmount(quantity, price, vat),
      // Store names for display
      ingredientName: this.getItemName("ingredient", ingredientId),
      productName: this.getItemName("product", productId),
      warehouseName: this.getWarehouseName(warehouseId),
    };

    // Add to list
    this.setState((prevState) => ({
      grDetails: [...prevState.grDetails, detailItem],
      // Reset form fields
      ingredientId: null,
      productId: null,
      warehouseId: null,
      quantity: 0,
      price: 0,
      vat: 0,
      unit: "",
    }));
  };

  // Helper method to get item name from ID
  getItemName = (type, itemId) => {
    if (!itemId) return "";
    
    if (type === "ingredient") {
      const { INGREDIENT_LIST } = this.props;
      if (INGREDIENT_LIST && Array.isArray(INGREDIENT_LIST)) {
        const item = INGREDIENT_LIST.find(i => String(i.id) === String(itemId));
        return item ? item.name : itemId;
      }
    } else if (type === "product") {
      const { PRODUCT_LIST } = this.props;
      if (PRODUCT_LIST && Array.isArray(PRODUCT_LIST)) {
        const item = PRODUCT_LIST.find(i => String(i.id) === String(itemId));
        return item ? item.name : itemId;
      }
    }
    return itemId;
  };

  // Helper method to get warehouse name from ID
  getWarehouseName = (warehouseId) => {
    if (!warehouseId) return "";
    
    const { WAREHOUSE_LIST } = this.props;
    if (WAREHOUSE_LIST && Array.isArray(WAREHOUSE_LIST)) {
      const warehouse = WAREHOUSE_LIST.find(w => String(w.id) === String(warehouseId));
      return warehouse ? warehouse.name : warehouseId;
    }
    return warehouseId;
  };

  // Handle delete detail from list
  onDeleteDetail = (detailId) => {
    this.setState((prevState) => ({
      grDetails: prevState.grDetails.filter(item => item.id !== detailId),
    }));
  };

  render() {
    const {
      importTypeId,
      errMessage,
      popupMessage,
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
    } = this.state;
    const {
      errors,
      STATUS_OPTIONS,
      SUPPLIER_LIST,
      INGREDIENT_LIST,
      PRODUCT_LIST,
      WAREHOUSE_LIST,
      UNIT_LIST,
      id,
    } = this.props;
    const isIngredient = Number(importTypeId) === 1;

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
              data={IMPORT_PRODUCT_TYPE}
              isDisable={id ? true : false}
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
            
              <Input className="input-group-alternative css-border-input"
                onChange={this.onChangeValue("receiptNumber")}
                type="text"
                value={receiptNumber}
                readOnly={id}
              />
            
            </InputGroup>

            <p className="form-error-message">{errors.receiptNumber || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày lập phiếu
            {!this.props.plantingZoneId && (
              <>
                &nbsp;<b style={{ color: "red" }}>*</b>
              </>
            )}
          </label>

          <div className="wrap-insert-or-update-zone-item-box">
            <FormGroup>
              <InputGroup className="input-group-alternative css-border-input ">
                <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                  <InputGroupText>
                    <i className="ni ni-calendar-grid-58" />
                  </InputGroupText>
                </InputGroupAddon>

                <ReactDatetime
                  inputProps={{
                    placeholder: "Ngày lập phiếu",
                    name: "creationDate",
                  }}
                  value={creationDate}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={this.onChangeValue("creationDate")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errors.creationDate || ""}
              </p>
            </FormGroup>

            <p className="form-error-message">{errors.creationDate || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Nhà cung cấp&nbsp;<b style={{ color: "red" }}>*</b>
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

            <p className="form-error-message">{errors.name || ""}</p>
          </div>
        </div>

        <div
          className="wrap-insert-or-update-zone-item"
        
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Người nhập&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <Input 
                value={importer}
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
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
              <Input 
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
        {importTypeId !== null && !id && (
          <div>
            <h3>Chi tiết phiếu nhập</h3>
            {isIngredient ? (
              <>
                <div className="wrap-insert-or-update-zone-item">
                  <label className="wrap-insert-or-update-zone-item-label">
                    Chọn nguyên liệu&nbsp;<b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="wrap-insert-or-update-zone-item-box">
                    <Select
                      value={ingredientId}
                      defaultValue={null}
                      labelMark={null}
                      className="wrap-insert-or-update-zone-item-select"
                      name="ingredientId"
                      title="Chọn nguyên liệu"
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
              </>
            ) : (
              <>
                <>
                  <div className="wrap-insert-or-update-zone-item">
                    <label className="wrap-insert-or-update-zone-item-label">
                      Chọn sản phẩm&nbsp;<b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="wrap-insert-or-update-zone-item-box">
                      <Select
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
                      <p className="form-error-message">
                        {errors.productId || ""}
                      </p>
                    </div>
                  </div>
                </>
              </>
            )}

            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Chọn kho hàng&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <Select
                  value={warehouseId}
                  defaultValue={null}
                  labelMark={null}
                  className="wrap-insert-or-update-zone-item-select"
                  name="warehouseId"
                  title="Chọn kho hàng"
                  data={WAREHOUSE_LIST}
                  labelName="name"
                  val="id"
                  handleChange={this.onChangeSelect("warehouseId")}
                />

                <p className="form-error-message">{errors.name || ""}</p>
              </div>
            </div>
            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Số lượng&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={quantity}
                    onChange={this.onChangeValue("quantity")}
                    type="number"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>

                <p className="form-error-message">{errors.name || ""}</p>
              </div>
            </div>
            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Đơn vị tính&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <Input 
                    value={unit}
                    readOnly={true}
                    type="text"
                    className="wrap-insert-or-update-zone-item-input"
                    placeholder="Tự động lấy từ nguyên liệu/sản phẩm"
                  />
                </InputGroup>

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
                    value={formatMoney(price)}
                    onChange={(e) => {
                      const parsed = parseMoney(e.target.value);
                      this.setState({ price: parsed });
                    }}
                    type="text"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>

                <p className="form-error-message">{errors.name || ""}</p>
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

                <p className="form-error-message">{errors.name || ""}</p>
              </div>
            </div>
            <div className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                Thành tiền&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    readOnly
                    value={this.calculateTotalAmount(quantity, price, vat)}
                    onChange={(e) => {
                      const parsed = parseMoney(e.target.value);
                      this.setState({ price: parsed });
                    }}
                    type="text"
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>

                <p className="form-error-message">{errors.name || ""}</p>
              </div>
            </div>
            {/* Add button below form */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                type="button"
                onClick={this.onAddDetail}
                className="btn btn-primary"
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                + Thêm phiếu nhập
              </button>
            </div>
          </div>
        )}

        {/* Display details list */}
        {this.state.grDetails && this.state.grDetails.length > 0 && (
          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <h4>Danh sách chi tiết phiếu nhập</h4>
            <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "4px" }}>
              <table className="table table-bordered table-hover" style={{ fontSize: "13px", marginBottom: "0" }}>
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: "25%" }}>Tên hàng</th>
                    <th style={{ width: "12%" }}>Kho</th>
                    <th style={{ width: "10%" }}>Số lượng</th>
                    <th style={{ width: "10%" }}>Đơn vị</th>
                    <th style={{ width: "15%" }}>Giá</th>
                    <th style={{ width: "10%" }}>VAT %</th>
                    <th style={{ width: "12%" }}>Thành tiền</th>
                    <th style={{ width: "6%" }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.grDetails.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.ingredientName || item.productName}</td>
                      <td>{item.warehouseName}</td>
                      <td style={{ textAlign: "right" }}>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td style={{ textAlign: "right" }}>{formatMoney(item.price)}</td>
                      <td style={{ textAlign: "right" }}>{item.vat}</td>
                      <td style={{ textAlign: "right" }}>{formatMoney(item.amount)}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => this.onDeleteDetail(item.id)}
                          className="btn btn-sm btn-danger"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
