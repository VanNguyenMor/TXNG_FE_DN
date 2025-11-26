import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { Col, Input, InputGroup, Label, Row } from "reactstrap";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      numberStampVal: 0,
      numberStampLength: 0,
      printMethod: null,
      priceVal: 0,
      printDesign: null,
      noteVal: "",
      PRICE_PER_STAMP: 500,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

  updatePrice = () => {
    this.setState(
      (prevState) => {
        const { numberStampVal, printMethod, PRICE_PER_STAMP } = prevState;
        let newPriceVal = 0;

        if (printMethod === 1) {
          const quantity = Number(numberStampVal) || 0;
          newPriceVal = quantity * PRICE_PER_STAMP;
        }

        const formattedPrice = newPriceVal.toLocaleString("vi-VN");

        return {
          priceVal: formattedPrice,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  toggleModal() {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  }

  handleFormChange = (newValues) => {
    this.setState((prevState) => ({
      ...prevState,
      ...newValues,
    }));
  };

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
        this.updatePrice();
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
    let value = e && e.target ? e.target.value : e;

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: name === "numberStampVal" ? Number(value) : value,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
        if (name === "numberStampVal") {
          this.updatePrice();
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

  handleRadioChange = (event) => {
    const { name, value } = event.target;

    this.setState(
      (prevState) => {
        const newState = { ...prevState, [name]: Number(value) };
        if (name === "printMethod") {
          newState.priceVal = 0;
        }

        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(newState);
        }

        return newState;
      },
      () => {
        if (name === "printMethod" || name === "numberStampVal") {
          this.updatePrice();
        }
      }
    );
  };

  render() {
    const {
      errMessage,
      popupMessage,
      numberStampVal,
      numberStampLength,
      printMethod,
      printDesign,
      noteVal,
      priceVal,
      PRICE_PER_STAMP,
    } = this.state;
    const { errors, isShowForDetail } = this.props;
    const isPrintRequest = printMethod === 1;

    return (
      <div id="detailLoggingAccordion">
        <Row className="mb-2">
          <Col md="6">
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">Số lượng tem</Label>

              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="number"
                    name="numberStampVal"
                    placeholder="Số lượng tem"
                    value={numberStampVal}
                    onChange={this.onChangeValue("numberStampVal")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.numberStampVal || ""}
                </p>
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">Kích thước tem</Label>

              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="number"
                    name="numberStampLength"
                    placeholder="Kích thước tem"
                    value={numberStampLength}
                    required
                    onChange={this.onChangeValue("numberStampLength")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.numberStampLength || ""}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="d-flex flex-column">
            <Label className="form-control-label">Trạng thái xử lý</Label>
            <div className="d-flex justify-content-start flex-wrap">
              <div className="custom-control custom-radio mr-4">
                <input
                  className="custom-control-input"
                  id="typeId1"
                  type="radio"
                  name="printMethod"
                  value={1}
                  checked={printMethod === 1}
                  onChange={this.handleRadioChange}
                />

                <label className="custom-control-label" htmlFor="typeId1">
                  Yêu cầu in
                </label>
              </div>
              <div className="custom-control custom-radio mr-4">
                <input
                  className="custom-control-input"
                  id="typeId2"
                  type="radio"
                  name="printMethod"
                  value={2}
                  checked={printMethod === 2}
                  onChange={this.handleRadioChange}
                />

                <label className="custom-control-label" htmlFor="typeId2">
                  Tự in
                </label>
              </div>
            </div>
          </Col>
        </Row>
        {isPrintRequest && (
          <Row className="mt-2">
            <Col md="6">
              <div className={`${classes.rowItem} ${classes.alignTop}`}>
                <Label className="form-control-label">
                  Số tiền phải thanh toán
                </Label>

                <div className={classes.inputArea}>
                  <InputGroup
                    className="input-group-alternative css-border-input"
                    readOnly
                  >
                    <Input
                      type="text"
                      name="priceVal"
                      placeholder="Số tiền phải thanh toán"
                      value={priceVal + " VNĐ"}
                      readOnly
                    />
                  </InputGroup>
                  <p className="form-error-message margin-bottom-0">
                    {errors.priceVal || ""}
                  </p>
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className={`${classes.rowItem} ${classes.alignTop}`}>
                <Label className="form-control-label">
                  Số tiền mỗi con tem
                </Label>

                <div className={classes.inputArea}>
                  <InputGroup
                    className="input-group-alternative css-border-input"
                    readOnly
                  >
                    <Input
                      type="text"
                      name="PRICE_PER_STAMP"
                      placeholder="Số tiền mỗi con tem"
                      value={PRICE_PER_STAMP + " VNĐ"}
                      readOnly
                    />
                  </InputGroup>
                  <p className="form-error-message margin-bottom-0">
                    {errors.PRICE_PER_STAMP || ""}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        )}
        <Row className="mt-2">
          <Col md="12" className="d-flex flex-column">
            <Label className="form-control-label"> Chọn Mẫu In Tem</Label>
            <div className="d-flex justify-content-start flex-wrap">
              <div className="custom-control custom-radio mr-4 mb-2">
                <input
                  className="custom-control-input"
                  id="printDesign1"
                  type="radio"
                  name="printDesign"
                  value={1}
                  checked={printDesign === 1}
                  onChange={this.handleRadioChange}
                />
                <label className="custom-control-label" htmlFor="printDesign1">
                  Mẫu 1 (TRACE CENTER)
                </label>
              </div>

              <div className="custom-control custom-radio mr-4 mb-2">
                <input
                  className="custom-control-input"
                  id="printDesign2"
                  type="radio"
                  name="printDesign"
                  value={2}
                  checked={printDesign === 2}
                  onChange={this.handleRadioChange}
                />
                <label className="custom-control-label" htmlFor="printDesign2">
                  Mẫu 2 (TỈNH PHÚ YÊN)
                </label>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">Ghi chú</Label>

              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="text"
                    name="noteVal"
                    placeholder="Số lượng tem"
                    value={noteVal}
                    required
                    onChange={this.onChangeValue("noteVal")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.noteVal || ""}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-2 mb-2">
          <Col md="12">
            <Label className="form-control-label">Chứng từ liên quan</Label>
            <div className={`${classes.inputArea} `}>
              <input
                type="file"
                className="form-control-file"
                name="relatedDocuments"
                multiple={true}
                onChange={(e) => this.handleFileChange(e.target.files)}
              />
            </div>
          </Col>
        </Row>
        <h5>
          * Đối với doanh nghiệp/Hợp tác xã <br></br> - Đơn xin cấp tem có ký
          tên, đóng đấu của giám đốc <br></br>- Biên lai nộp tiền/lệnh chuyển
          khoản tiền mua tem
        </h5>
        <h5>* Đối với cá nhân <br></br>- Đơn xin cấp tem <br></br>- Biên lại nộp tiền mua tem</h5>
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
