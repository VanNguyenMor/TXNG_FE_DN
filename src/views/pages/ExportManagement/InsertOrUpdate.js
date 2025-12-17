import React, { Component } from "react";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import {
  Card,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Table,
} from "reactstrap";
import { InputGroup } from "reactstrap";
import classes from "./index.module.css";
import Select from "components/Select";
import ReactDatetime from "react-datetime";
import { fetchData } from "helpers/fetchData";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      wareId: null,
      adjustmentDateVal: "",
      warehouseTranferId: null,
      warehouseImportId: null,
      noteVal: "",
      refuseVal: "",
      PRODUCTS_OPTIONS: [],
      adjustedItems: [
        {
          stt: 1,
          productId: null,
          unitId: null,
          quantity: 0,
        },
      ],
    };
  }

  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        id: null,
      };
    });
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
    const numericValue = Number(value);
    const selectedOption = this.props.DIARY_OPTIONS?.find(
      (item) => item.id === numericValue
    );

    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: value,
        ...(name === "diaryId" && {
          placeVal: selectedOption?.location || "",
          productVal: selectedOption?.product || "",
          unitVal: selectedOption?.unit || "",
        }),
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
        
        // Khi warehouseTranferId thay đổi, gọi API để lấy danh sách sản phẩm
        if (name === "warehouseTranferId" && value) {
          this.fetchProductsByWarehouse(value);
        } else if (name === "warehouseTranferId" && !value) {
          // Nếu không chọn kho, reset danh sách sản phẩm
          this.setState({ PRODUCTS_OPTIONS: [] });
        }
      }
    );
  };

  fetchProductsByWarehouse = (warehouseId) => {
    if (!warehouseId) {
      this.setState({ PRODUCTS_OPTIONS: [] });
      return;
    }

    fetchData.product
      .getListWithMaterialInventoryByWarehouseComboBox(warehouseId)
      .then((res) => {
        const products = res || [];
        const options = products.map((item) => ({
          id: item.id,
          title: item.name || item.title || item.productName || "",
        }));
        this.setState({ PRODUCTS_OPTIONS: options });
      })
      .catch((error) => {
        console.error("Error fetching products by warehouse:", error);
        this.setState({ PRODUCTS_OPTIONS: [] });
      });
  };

  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

    if (name === "marketId" || name === "quantity") {
      value = Number(value);
    }

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

  handleAddItem = () => {
    this.setState(
      (prevState) => {
        const newStt = prevState.adjustedItems.length + 1;
        const newItem = {
          stt: newStt,
          productId: null,
          unitId: null,
          quantity: 0,
        };
        return {
          adjustedItems: [...prevState.adjustedItems, newItem],
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleDeleteItem = (indexToDelete) => () => {
    this.setState(
      (prevState) => {
        const updatedItems = prevState.adjustedItems.filter(
          (_, index) => index !== indexToDelete
        );
        const reindexedItems = updatedItems.map((item, index) => ({
          ...item,
          stt: index + 1,
        }));
        return {
          adjustedItems: reindexedItems,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleItemValueChange = (index, name) => (e) => {
    let value = e.target.value;

    this.setState(
      (prevState) => {
        const updatedItems = [...prevState.adjustedItems];
        updatedItems[index][name] = value;
        return { adjustedItems: updatedItems };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  renderAdjustmentTable = () => {
    const { adjustedItems, PRODUCTS_OPTIONS } = this.state;
    const { errors, UNIT_OPTIONS } = this.props;

    return (
      <Card className="shadow mt-4">
        <Table
          className={`align-items-center table-flush ${classes.detailTable}`}
          responsive
        >
          <thead className="thead-light" style={{ backgroundColor: "#09b2fd" }}>
            <tr className={classes.detailTableHead}>
              <th className="header-cell">STT</th>
              <th className="header-cell">Sản phẩm</th>
              <th className="header-cell">ĐVT</th>
              <th className="header-cell">Số lượng (+/-)</th>
              <th className="header-cell"></th>
            </tr>
          </thead>
          <tbody>
            {adjustedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.stt}</td>
                <td>
                  <Select
                    value={item.productId}
                    name="productId"
                    data={PRODUCTS_OPTIONS}
                    labelName="title"
                    title="Chọn sản phẩm"
                    val="id"
                    handleChange={(value) =>
                      this.handleItemValueChange(
                        index,
                        "productId"
                      )({ target: { value } })
                    }
                    className="wrap-insert-or-update-zone-item-select"
                  />
                </td>
                <td>
                  <Select
                    value={item.unitId}
                    name="unitId"
                    data={UNIT_OPTIONS}
                    labelName="title"
                    title="Chọn đơn vị"
                    val="id"
                    handleChange={(value) =>
                      this.handleItemValueChange(
                        index,
                        "unitId"
                      )({ target: { value } })
                    }
                    className="wrap-insert-or-update-zone-item-select"
                  />
                </td>
                <td>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={this.handleItemValueChange(index, "quantity")}
                      className="wrap-insert-or-update-zone-item-input"
                      placeholder="Số lượng (+/-)"
                    />
                  </InputGroup>
                </td>
                <td className={classes.deleteCell}>
                  <span
                    onClick={this.handleDeleteItem(index)}
                    style={{ cursor: "pointer", color: "red" }}
                    role="img"
                    aria-label="delete"
                  >
                    Xóa
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  };

  render() {
    const {
      wareId,
      adjustmentDateVal,
      noteVal,
      refuseVal,
      warehouseImportId,
      warehouseTranferId,
    } = this.state;

    const { errors, WAREHOUSE_OPTIONS, isShowForEdit, STATUS_OPTIONS } =
      this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày điều chỉnh&nbsp;<b style={{ color: "red" }}>*</b>
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
                    placeholder: "Ngày điều chỉnh",
                    name: "adjustmentDateVal",
                  }}
                  value={adjustmentDateVal}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={this.onChangeValue("adjustmentDateVal")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errors.adjustmentDateVal || ""}
              </p>
            </FormGroup>

            <p className="form-error-message">
              {errors.adjustmentDateVal || ""}
            </p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Kho chuyển
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={warehouseTranferId}
              defaultValue={null}
              labelMark={null}
              isDisable={isShowForEdit}
              className="wrap-insert-or-update-zone-item-select"
              name="warehouseTranferId"
              title="Chọn kho chuyển"
              data={WAREHOUSE_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("warehouseTranferId")}
            />

            <p className="form-error-message">
              {errors.warehouseTranferId || ""}
            </p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Kho nhập
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={warehouseImportId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="warehouseImportId"
              isDisable={isShowForEdit}
              title="Chọn kho nhập"
              data={WAREHOUSE_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("warehouseImportId")}
            />

            <p className="form-error-message">
              {errors.warehouseImportId || ""}
            </p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ghi chú
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={noteVal}
                onChange={this.onChangeValue("noteVal")}
                readOnly={isShowForEdit}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.noteVal || ""}</p>
          </div>
        </div>

        <hr className="my-4" />
        <div className={classes.tableHeaderWithButton}>
          <h3>Danh sách sản phẩm xuất chuyển</h3>
          {isShowForEdit ? null : (
            <span
              onClick={this.handleAddItem}
              style={{
                backgroundColor: "#FFC107",
                color: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              +
            </span>
          )}
        </div>
        {this.renderAdjustmentTable()}
        <hr className="my-4" />
      </div>
    );
  }
}

export default InsertOrUpadte;
