import React, { Component } from "react";
import classes from "./index.module.css";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { connect } from "react-redux";
import IconAdd from "../../../assets/img/buttons/add.png";
import IconDelete from "../../../assets/img/buttons/delete.png";

// reactstrap components
import { Input, InputGroup, Button, Card, CardBody, CardHeader } from "reactstrap";
import moment from "moment";
import Select from "components/Select";
import { fetchData } from "helpers/fetchData";

class AddNewQRList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      reasonVal: "",
      executedDate: null,
      stampRequestId: null,
      stampRequestName: "",
      fromVal: "",
      toVal: "",
      badStamps: [],
      files: [],
      minStamp: 0,
      maxStamp: 0,
      companyCode: "",
      stampRequests: [],
    };
    this.refFileImage = null;
  }

  componentDidMount() {
    // Fetch stamp requests and company code
    this.fetchStampRequests();
    this.fetchCompanyCode();
  }

  fetchCompanyCode = async () => {
    try {
      // Get from Redux store or local storage
      const configSystemStore = this.props.ConfigSystemStore || {};
      const companyCode = configSystemStore.company_code || "";
      
      if (companyCode) {
        this.setState({ companyCode });
      }
    } catch (error) {
      console.error("Fetch company code error:", error);
    }
  };

  fetchStampRequests = async () => {
    try {
      const result = await fetchData.qrCodeManagement.getListStampRequestComboBox();
      if (result && Array.isArray(result.stampRequests)) {
        const stampRequests = result.stampRequests.map((item) => ({
          id: item.id,
          title: `${item.startNum} - ${item.endNum} (SL: ${item.quantity} | Ngày ĐK: ${moment(item.confirmedDate).format("DD/MM/YYYY")})`,
          startNum: item.startNum,
          endNum: item.endNum,
          confirmedDate: item.confirmedDate,
          quantity: item.quantity,
        }));
        this.setState({ stampRequests });
      }
    } catch (error) {
      console.error("Fetch stamp requests error:", error);
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

  onChangeSelect = (name) => (value) => {
    if (name === "stampRequestId") {
      const selectedRequest = this.state.stampRequests.find(
        (r) => r.id === value
      );
      if (selectedRequest) {
        this.setState(
          {
            stampRequestId: value,
            stampRequestName: selectedRequest.title,
            minStamp: parseInt(selectedRequest.startNum),
            maxStamp: parseInt(selectedRequest.endNum),
            fromVal: "",
            toVal: "",
            badStamps: [],
          },
          () => {
            if (this.props.onHandleChangeValue) {
              this.props.onHandleChangeValue(this.state);
            }
          }
        );
      }
    }
  };

  onAddQRRange = () => {
    const { stampRequestId, fromVal, toVal, minStamp, maxStamp, companyCode } = this.state;

    const startNum = parseInt(fromVal || 0);
    const endNum = parseInt(toVal || 0);

    // Validations
    if (!stampRequestId) {
      alert("Vui lòng chọn dải tem");
      return;
    }

    if (!startNum) {
      alert("Vui lòng nhập số tem bắt đầu");
      return;
    }

    if (!endNum) {
      alert("Vui lòng nhập số tem kết thúc");
      return;
    }

    if (startNum > endNum) {
      alert("Số tem bắt đầu không được lớn hơn số tem kết thúc");
      return;
    }

    if (startNum < minStamp || startNum > maxStamp) {
      alert(
        `Số tem bắt đầu phải nằm trong khoảng từ ${minStamp} đến ${maxStamp}`
      );
      return;
    }

    if (endNum < minStamp || endNum > maxStamp) {
      alert(
        `Số tem kết thúc phải nằm trong khoảng từ ${minStamp} đến ${maxStamp}`
      );
      return;
    }

    // Generate QR codes
    let badStamps = [];
    for (let i = startNum; i <= endNum; i++) {
      const qrCode = `${companyCode}${i.toString().padStart(10, "0")}`;
      badStamps.push({
        id: `${i}_${Date.now()}`,
        qrCode,
        number: i,
      });
    }

    this.setState(
      {
        badStamps,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onRemoveQR = (id) => {
    this.setState(
      {
        badStamps: this.state.badStamps.filter((item) => item.id !== id),
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleFileChange = (files) => {
    const fileList = Array.from(files);
    this.setState(
      {
        files: fileList,
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
    const {
      reasonVal,
      stampRequestId,
      stampRequestName,
      fromVal,
      toVal,
      badStamps,
      stampRequests,
      minStamp,
      maxStamp,
    } = this.state;

    return (
      <>
        <div className={`${classes.formControl} css-system-stamp`}>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Lý do hủy&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  placeholder="Lý do hủy"
                  type="textarea"
                  name="reasonVal"
                  value={reasonVal}
                  onChange={this.onChangeValue("reasonVal")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert?.reasonVal || ""}
              </p>
            </div>
          </div>

          <div className={classes.rowItem}>
            <label className="form-control-label">
              Chọn dải tem&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <Select
                value={stampRequestId}
                labelMark={null}
                className="wrap-insert-or-update-zone-item-select"
                name="stampRequestId"
                title="Chọn dải tem"
                data={stampRequests}
                labelName="title"
                val="id"
                handleChange={this.onChangeSelect("stampRequestId")}
              />

              <p className="form-error-message">
                {errorInsert?.stampRequestId || ""}
              </p>
            </div>
          </div>

          {stampRequestId && (
            <>
              <div className={classes.rowItem}>
                <label className="form-control-label">
                  Số tem từ&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className={classes.rowItem}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      onChange={this.onChangeValue("fromVal")}
                      type="number"
                      value={fromVal}
                      placeholder={`Từ ${minStamp} đến ${maxStamp}`}
                      className="wrap-insert-or-update-zone-item-input"
                    />
                  </InputGroup>

                  <p className="form-error-message">
                    {errorInsert?.fromVal || ""}
                  </p>
                </div>
              </div>

              <div className={classes.rowItem}>
                <label className="form-control-label">
                  Số tem đến&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className={classes.rowItem}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      onChange={this.onChangeValue("toVal")}
                      type="number"
                      value={toVal}
                      placeholder={`Từ ${minStamp} đến ${maxStamp}`}
                      className="wrap-insert-or-update-zone-item-input"
                    />
                  </InputGroup>

                  <p className="form-error-message">
                    {errorInsert?.toVal || ""}
                  </p>
                </div>
              </div>

              <div className={classes.rowItem}>
                <label className="form-control-label">&nbsp;</label>
                <Button
                  color="primary"
                  size="md"
                  onClick={this.onAddQRRange}
                  className="btn-primary-cs"
                  style={{
                    width: "auto",
                    minWidth: "160px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <img src={IconAdd} alt="Thêm" style={{ marginRight: "5px" }} />
                  <span>Thêm dải mã QR</span>
                </Button>
              </div>
            </>
          )}

          {badStamps.length > 0 && (
            <Card className={`${classes.cardCustomQrList} shadow`}>
              <CardHeader className="bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách mã QR ({badStamps.length})</h5>
              </CardHeader>
              <CardBody>
                <div
                  className="d-flex flex-wrap"
                  style={{ gap: "8px", maxHeight: "300px", overflowY: "auto" }}
                >
                  {badStamps.map((item) => (
                    <div
                      key={item.id}
                      className="badge badge-primary p-2 d-flex align-items-center"
                      style={{ fontSize: "12px" }}
                    >
                      <span>{item.qrCode}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-link ml-2 p-0"
                        onClick={() => this.onRemoveQR(item.id)}
                        style={{
                          color: "white",
                          textDecoration: "none",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          <div className={`${classes.rowItem}`}>
            <label className="form-control-label">
              Chứng từ liên quan
            </label>

            <div className={`${classes.inputArea}`}>
              <input
                type="file"
                className="form-control-file"
                name="files"
                multiple={true}
                onChange={(e) => this.handleFileChange(e.target.files)}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
    stampTemplate: state.StampPlateStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
    ...bindActionCreators(actionStampPlate, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AddNewQRList
);
