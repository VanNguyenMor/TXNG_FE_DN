import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { Col, InputGroup, Row } from "reactstrap";
import ImageUploader from "components/ImageUploader/ImageUploader";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      imgUrlVal: "",
      jobId: null,
      productId: null,
      retrieveId: null,
      name: "",
      order: null,
      dataInsert: {},
      isIsolationTest: false,
      typeId: null,
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
        newState[name] = value;
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

  handleRadioChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => {
      const newState = {
        ...prevState,
        [name]: Number(value),
      };

      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(newState);
      }

      return newState;
    });
  };

  render() {
    const {
      errMessage,
      popupMessage,
      jobId,
      productId,
      name,
      order,
      imgUrlVal,
      isIsolationTest,
      typeId,
    } = this.state;
    const { errors, PRODUCT_OPTIONS, JOB_OPTIONS, RETRIEVE_OPTIONS } =
      this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <Row className="mb-3">
          <Col md="6">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="form-control-label">Hình ảnh</label>
              <ImageUploader
                initialImageUrl={imgUrlVal || Noimg}
                onFileSelected={this.handleImageUploadSuccess}
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6">
            <div className={`${classes.rowItem} mr-b-0 `}>
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
          </Col>
          <Col md="6">
            <div className={`${classes.rowItem} mr-b-0 `}>
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
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="9">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">
                Tên truy xuất&nbsp;<b style={{ color: "red" }}>*</b>
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
          </Col>
          <Col md="3">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">
                Sắp xếp&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={order}
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
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="12" className="d-flex align-items-center">
            <div className="custom-control custom-checkbox">
              <input
                className="custom-control-input"
                id="isIsolationTest"
                type="checkbox"
                name="isIsolationTest"
                checked={isIsolationTest}
                onChange={this.handleCheckboxChange}
              />

              <label className="custom-control-label" htmlFor="isIsolationTest">
                Kiểm tra cách ly
              </label>
            </div>
          </Col>

          <Col md="12" className="d-flex flex-column">
            <label className="wrap-insert-or-update-zone-item-label">
              Trạng thái xử lý:
            </label>

            <div className="d-flex justify-content-start flex-wrap">
              <div className="custom-control custom-radio mr-4">
                <input
                  className="custom-control-input"
                  id="typeId1"
                  type="radio"
                  name="typeId"
                  value={1}
                  checked={typeId === 1}
                  onChange={this.handleRadioChange}
                />

                <label className="custom-control-label" htmlFor="typeId1">
                  Nhập kho
                </label>
              </div>
              <div className="custom-control custom-radio mr-4">
                <input
                  className="custom-control-input"
                  id="typeId2"
                  type="radio"
                  name="typeId"
                  value={2}
                  checked={typeId === 2}
                  onChange={this.handleRadioChange}
                />

                <label className="custom-control-label" htmlFor="typeId2">
                  Đánh giá
                </label>
              </div>
              <div className="custom-control custom-radio">
                <input
                  className="custom-control-input"
                  id="typeId3"
                  type="radio"
                  name="typeId"
                  value={3}
                  checked={typeId === 3}
                  onChange={this.handleRadioChange}
                />

                <label className="custom-control-label" htmlFor="typeId3">
                  Chuyển giao
                </label>
              </div>
            </div>
          </Col>
        </Row>

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
