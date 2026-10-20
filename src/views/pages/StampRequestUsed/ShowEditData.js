import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import { Col, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import { fetchData } from "helpers/fetchData";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import { PRINT_METHOD, formatNumber } from "./utils";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stampTemplateList: [],
      errMessage: "",
      popupMessage: false,
      previewImage: null,
    };
  }

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  openPreview = (image) => () => {
    this.setState({ previewImage: image || NoImg });
  };

  closePreview = () => {
    this.setState({ previewImage: null });
  };

  async componentDidMount() {
    await this.loadStampTemplateList();
    this.focusInput();
  }

  loadStampTemplateList = async () => {
    try {
      const templates = await fetchData.stampRequest.getListStampTemplate();

      // Handle different response formats
      // fetchData.stampRequest.getListStampTemplate returns result?.data
      // so templates could be: array, { stampTemplates: [...] }, { stamps: [...] }, { data: [...] }
      let stampTemplateList = [];
      if (Array.isArray(templates)) {
        stampTemplateList = templates;
      } else if (templates && typeof templates === 'object') {
        stampTemplateList =
          templates.stampTemplates ||
          templates.stamps ||
          templates.stampRanges ||
          templates.data ||
          [];
      }

      this.setState({ stampTemplateList });
    } catch (error) {
      console.error("Error loading stamp templates:", error);
      this.setState({ stampTemplateList: [] });
    }
  };

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();
        clearTimeout(timeOut);
      }, 100);
    }
  };

  change = (name, value) => {
    const { dataInsert, onHandleChangeValue } = this.props;
    if (onHandleChangeValue) {
      onHandleChangeValue({ ...dataInsert, [name]: value }, name);
    }
  };

  onChangeValue = (name) => (e) => {
    const value = e && e.target ? e.target.value : e;
    this.change(name, name === "quantity" ? (value === "" ? "" : Number(value)) : value);
  };

  onChangeSelect = (name) => (value) => {
    this.change(name, value);
  };

  handleRadioChange = (event) => {
    const { name, value } = event.target;
    this.change(name, Number(value));
  };

  renderAmount() {
    const { dataInsert, priceStamp, priceLoading } = this.props;
    const quantity = Number(dataInsert.quantity) || 0;

    let text = "";
    if (priceLoading) {
      text = "Đang tính...";
    } else if (typeof priceStamp === "number") {
      text = `${formatNumber(quantity * priceStamp)} đ`;
    }

    return (
      <Row className="mb-2">
        <Col md="12">
          <div className={`${classes.rowItem} ${classes.alignTop}`}>
            <Label className="form-control-label">Số tiền phải thanh toán</Label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input type="text" value={text} disabled readOnly />
              </InputGroup>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const { stampTemplateList } = this.state;
    const { errors, dataInsert = {}, isConfirm = true } = this.props;
    const { quantity, stampRange, printMethod, notes, size } = dataInsert;

    return (
      <div id="detailLoggingAccordion">
        <Row className="mb-2">
          <Col md={isConfirm ? "6" : "12"}>
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">{isConfirm ? "Số lượng tem xin cấp" : "Số lượng tem"}&nbsp;<b style={{ color: 'red' }}>*</b></Label>

              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="Số lượng"
                    value={quantity === undefined || quantity === null ? "" : quantity}
                    onChange={this.onChangeValue("quantity")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors?.quantity || ""}
                </p>
              </div>
            </div>
          </Col>
          {isConfirm ? (
            <Col md="6">
              <div className={`${classes.rowItem} ${classes.alignTop}`}>
                <Label className="form-control-label">Kích thước tem&nbsp;<b style={{ color: 'red' }}>*</b></Label>

                <div className={classes.inputArea}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <Input
                      type="text"
                      name="size"
                      placeholder="Kích thước tem"
                      value={size || ""}
                      onChange={this.onChangeValue("size")}
                    />
                  </InputGroup>
                  <p className="form-error-message margin-bottom-0">
                    {errors?.size || ""}
                  </p>
                </div>
              </div>
            </Col>
          ) : null}
        </Row>

        {isConfirm ? (
          <>
            <Row className="mb-2">
              <Col md="12">
                <div className={`${classes.rowItem} ${classes.alignTop}`}>
                  <Label className="form-control-label">Phương thức in&nbsp;<b style={{ color: 'red' }}>*</b></Label>

                  <div className="d-flex justify-content-start flex-wrap mt-2">
                    <div className="custom-control custom-radio mr-4">
                      <input
                        className="custom-control-input"
                        id="printMethod0"
                        type="radio"
                        name="printMethod"
                        value={PRINT_METHOD.REQUEST}
                        checked={printMethod === PRINT_METHOD.REQUEST}
                        onChange={this.handleRadioChange}
                      />
                      <label className="custom-control-label" htmlFor="printMethod0">
                        Yêu cầu in
                      </label>
                    </div>
                    <div className="custom-control custom-radio mr-4">
                      <input
                        className="custom-control-input"
                        id="printMethod1"
                        type="radio"
                        name="printMethod"
                        value={PRINT_METHOD.SELF}
                        checked={printMethod === PRINT_METHOD.SELF}
                        onChange={this.handleRadioChange}
                      />
                      <label className="custom-control-label" htmlFor="printMethod1">
                        Tự in
                      </label>
                    </div>
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors?.printMethod || ""}
                  </p>
                </div>
              </Col>
            </Row>

            {printMethod === PRINT_METHOD.REQUEST ? this.renderAmount() : null}

            <Row className="mb-2">
              <Col md="12">
                <div className={`${classes.rowItem} ${classes.alignTop}`}>
                  <Label className="form-control-label">Mẫu in tem&nbsp;<b style={{ color: 'red' }}>*</b></Label>

                  <div className={classes.inputArea}>
                    {Array.isArray(stampTemplateList) && stampTemplateList.length > 0 ? (
                      <div className={classes.stampTemplateGrid}>
                        {stampTemplateList.map((item) => {
                          const itemId = item.id || item.ID;
                          const isActive = String(stampRange || "") === String(itemId);
                          const itemName =
                            item.name ||
                            item.Name ||
                            item.stampRangeName ||
                            item.StampRangeName ||
                            item.stampTemplateName ||
                            item.StampTemplateName ||
                            "";

                          return (
                            <div
                              key={itemId}
                              className={`${classes.stampTemplateItem} ${
                                isActive ? classes.stampTemplateItemActive : ""
                              }`}
                              onClick={() => this.onChangeSelect("stampRange")(itemId)}
                              onDoubleClick={this.openPreview(item.template || item.Template)}
                              title={`${itemName}${itemName ? " — " : ""}Nhấp đúp để xem ảnh lớn`}
                            >
                              <img
                                src={item.template || item.Template || NoImg}
                                alt={itemName}
                                className={classes.stampTemplateImage}
                                onError={(e) => {
                                  e.target.src = NoImg;
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="margin-bottom-0">-- Không có mẫu in tem --</p>
                    )}
                    <p className="form-error-message margin-bottom-0">
                      {errors?.stampRange || ""}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md="12">
                <div className={`${classes.rowItem} ${classes.alignTop}`}>
                  <Label className="form-control-label">Ghi chú</Label>

                  <div className={classes.inputArea}>
                    <InputGroup className="input-group-alternative css-border-input">
                      <Input
                        type="textarea"
                        name="notes"
                        placeholder="Ghi chú thêm (không bắt buộc)"
                        value={notes || ""}
                        maxLength={255}
                        onChange={this.onChangeValue("notes")}
                        rows="3"
                      />
                    </InputGroup>
                    <p className="form-error-message margin-bottom-0">
                      {errors?.notes || ""}
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Nếu quý khách có yêu cầu in thêm số lượng tem mỗi mã QR thì nhập thông tin như
                      sau vào ghi chú : Số lượng tem mỗi mã QR là : .... con
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="font-weight-bold">Yêu cầu tài liệu đính kèm:</h6>
              <p className="mb-2">
                <strong>Đối với Doanh nghiệp/Hợp tác xã:</strong>
                <br />
                - Đơn xin cấp tem có ký tên, đóng đấu của giám đốc
                <br />
                - Biên lai nộp tiền/lệnh chuyển khoản tiền mua tem
              </p>
              <p className="mb-0">
                <strong>Đối với Cá nhân:</strong>
                <br />
                - Đơn xin cấp tem
                <br />
                - Biên lai nộp tiền mua tem
              </p>
            </div>
          </>
        ) : null}

        <PopupMessage
          popupMessage={this.state.popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={this.state.errMessage}
          toggleModal={this.toggleModal}
        />

        <Modal
          isOpen={!!this.state.previewImage}
          toggle={this.closePreview}
          centered
          size="lg"
        >
          <ModalHeader toggle={this.closePreview}>Mẫu in tem</ModalHeader>
          <ModalBody className="text-center">
            <img
              src={this.state.previewImage || NoImg}
              alt="Mẫu in tem"
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = NoImg;
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ShowEditData;
