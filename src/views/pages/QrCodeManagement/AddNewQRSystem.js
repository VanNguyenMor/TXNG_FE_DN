import React, { Component } from "react";
import classes from "./index.module.css";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";

// reactstrap components
import { Input, InputGroup } from "reactstrap";
import { fetchData } from "helpers/fetchData";

class AddNewQRSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSubmit: false,
      fileView: null,
      file: null,
      id: null,
      name: "",
      productName: "",
      plantingZoneName: "",
      qrCodeValue: "",
      executedDate: null,
      stampPriceDetail: [],
    };
    this.refFileImage = null;
  }
  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        stampPriceDetail: [],
        id: null,
        executedDate: "",
        name: "",
        id: null,
      };
    });
  }
  componentDidMount() {
    this.initializeFromProp();
  }

  initializeFromProp = () => {
    const { data } = this.props;
    const res = fetchData.scanQR.scanQRCodePrivate(data.qrCode);

    let productName = data.productName || "";
    let plantingZoneName = data.plantingZoneName || "";
    let qrCodeValue = data.qrCode || "";

    if (data.id) {
        this.setState({
            id: data.id || null,
            productName: productName || "",
            plantingZoneName: plantingZoneName || "",
            qrCodeValue: qrCodeValue || "",
        }, () => {
             if (this.props.onHandleChangeValue) {
                 this.props.onHandleChangeValue(this.state);
             }
        });
    }
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

  render() {
    const { errorInsert = {}, id } = this.props;
    const { productName, plantingZoneName, qrCodeValue } = this.state;
    return (
      <>
        <div
          className={`${classes.formControl} css-system-stamp`}
          style={{ height: 360 }}
        >
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Tên sản phẩm&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  readOnly
                  placeholder="Tên sản phẩm"
                  type="text"
                  name="productName"
                  value={productName}
                  defaultValue={productName}
                  onChange={this.onChangeValue("productName")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert.productName || ""}
              </p>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Vùng sản xuất&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  readOnly
                  placeholder="Vùng sản xuất"
                  type="text"
                  name="plantingZoneName"
                  value={plantingZoneName}
                  defaultValue={plantingZoneName}
                  onChange={this.onChangeValue("plantingZoneName")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert.plantingZoneName || ""}
              </p>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Ảnh QR&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              {qrCodeValue ? (
                <img
                  style={{ width: 250, height: 250 }}
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    qrCodeValue
                  )}`}
                  alt="QR Code"
                />
              ) : (
                <img
                  style={{ width: 250, height: 250 }}
                  src={NoImg}
                  alt="..."
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AddNewQRSystem;
