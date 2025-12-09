import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import { Col, Input, InputGroup, Label, Row } from "reactstrap";
import { fetchData } from "helpers/fetchData";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      quantity: 0,
      stampRange: "",
      printMethod: 0,
      notes: "",
      productList: [],
      stampTemplateList: [],
      errMessage: "",
      popupMessage: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  async componentDidMount() {
    await this.loadProductList();
    await this.loadStampTemplateList();

    if (this.props.dataInsert) {
      this.setState(this.props.dataInsert);
    }

    if (this.props.onHandleChangeValue) {
      this.props.onHandleChangeValue(this.state);
    }

    this.focusInput();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.dataInsert &&
      JSON.stringify(prevProps.dataInsert) !==
        JSON.stringify(this.props.dataInsert)
    ) {
      this.setState(this.props.dataInsert, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  loadProductList = async () => {
    try {
      const products = await fetchData.stampRequest.getListProduct();
      const productList = Array.isArray(products)
        ? products
        : products?.data || [];

      this.setState({ productList });
    } catch (error) {
    }
  };

  loadStampTemplateList = async () => {
    try {
      const templates = await fetchData.stampRequest.getListStampTemplate();
      
      // Handle different response formats
      let stampTemplateList = [];
      if (Array.isArray(templates)) {
        stampTemplateList = templates;
      } else if (templates && typeof templates === 'object') {
        // If it's an object, check for common array properties
        stampTemplateList = templates.data || templates.stamps || templates.stampTemplates || [];
      }
      
      this.setState({ stampTemplateList });
    } catch (error) {
      console.error("❌ Error loading stamp templates:", error);
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

  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: name === "quantity" ? Number(value) : value,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
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

  handleRadioChange = (event) => {
    const { name, value } = event.target;

    this.setState(
      (prevState) => {
        const newState = { ...prevState, [name]: Number(value) };

        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(newState);
        }

        return newState;
      }
    );
  };

  render() {
    const {
      quantity,
      stampRange,
      printMethod,
      notes,
      stampTemplateList,
    } = this.state;
    const { errors } = this.props;

    return (
      <div id="detailLoggingAccordion">
        <Row className="mb-2">
          <Col md="6">
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">Số lượng tem xin cấp</Label>

              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="Số lượng"
                    value={quantity}
                    onChange={this.onChangeValue("quantity")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors?.quantity || ""}
                </p>
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className={`${classes.rowItem} ${classes.alignTop}`}>
              <Label className="form-control-label">Mẫu in tem</Label>

              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="select"
                    name="stampRange"
                    value={stampRange || ""}
                    onChange={this.onChangeValue("stampRange")}
                  >
                    <option value="">-- Chọn mẫu in tem --</option>
                    {Array.isArray(stampTemplateList) && stampTemplateList.length > 0 ? (
                      stampTemplateList.map((item) => (
                        <option
                          key={item.id || item.ID}
                          value={item.id || item.ID}
                        >
                          {item.name || item.Name || item.stampRangeName || item.StampRangeName}
                        </option>
                      ))
                    ) : (
                      <option value="">-- Không có mẫu in tem --</option>
                    )}
                  </Input>
                </InputGroup>
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
              <Label className="form-control-label">Phương thức in</Label>

              <div className="d-flex justify-content-start flex-wrap mt-2">
                <div className="custom-control custom-radio mr-4">
                  <input
                    className="custom-control-input"
                    id="printMethod0"
                    type="radio"
                    name="printMethod"
                    value={0}
                    checked={printMethod === 0}
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
                    value={1}
                    checked={printMethod === 1}
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
                    value={notes}
                    onChange={this.onChangeValue("notes")}
                    rows="3"
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors?.notes || ""}
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

        <PopupMessage
          popupMessage={this.state.popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={this.state.errMessage}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default ShowEditData;
