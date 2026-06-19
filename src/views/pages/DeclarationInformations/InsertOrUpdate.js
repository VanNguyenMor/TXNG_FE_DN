import React, { Component } from "react";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import { Col, InputGroup, Row } from "reactstrap";

// Kiểu dữ liệu "Văn bản" mới cho phép chọn Danh sách tham chiếu (giống mobile)
const DATA_TYPE_TEXT = 1;

class InsertOrUpdate extends Component {
  constructor(props) {
    super(props);

    const init = props.initialData || {};
    this.state = {
      id: init.id != null ? init.id : null,
      processAccessId: init.processAccessId != null ? init.processAccessId : null,
      setManifestName: init.setManifestName || "",
      sortOrder: init.sortOrder != null ? init.sortOrder : "",
      variable: init.variable != null ? Number(init.variable) : null,
      refference: init.refference != null ? init.refference : null,
      informSelectValues: init.informSelectValues || [],
      isGenerated: init.isGenerated,
    };
  }

  componentDidMount() {
    this.report();
  }

  report = () => {
    if (this.props.onHandleChangeValue) this.props.onHandleChangeValue(this.state);
  };

  onChangeSelect = (name) => (value) => {
    this.setState({ [name]: value }, this.report);
  };

  onChangeVariable = (value) => {
    const variable = value === null || value === "" ? null : Number(value);
    // Đổi kiểu dữ liệu khác "Văn bản" -> bỏ danh sách tham chiếu
    const refference = variable === DATA_TYPE_TEXT ? this.state.refference : null;
    this.setState({ variable, refference }, this.report);
  };

  onChangeRefference = (value) => {
    this.setState(
      { refference: value === null || value === "" ? null : Number(value) },
      this.report
    );
  };

  onChangeValue = (name) => (e) => {
    this.setState({ [name]: e.target.value }, this.report);
  };

  // Định nghĩa nội dung hiển thị cho kiểu Có/Không (condition '1' = Có, '0' = Không)
  onChangeCustom = (condition) => (e) => {
    const value = e.target.value;
    const informSelectValues = (this.state.informSelectValues || []).map((x) => ({ ...x }));
    const found = informSelectValues.find((p) => String(p.condition) === condition);
    if (found) found.value = value;
    else informSelectValues.push({ condition, value });
    this.setState({ informSelectValues }, this.report);
  };

  getCustomValue = (condition) => {
    const found = (this.state.informSelectValues || []).find(
      (p) => String(p.condition) === condition
    );
    return found ? found.value : "";
  };

  render() {
    const { processAccessId, setManifestName, sortOrder, variable, refference } = this.state;
    const {
      errors = {},
      isReadOnly,
      PROCESS_ACCESS_OPTIONS = [],
      VARIABLE_OPTIONS = [],
      REFERENCE_OPTIONS = [],
    } = this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <Row className="mb-3">
          <Col md="12">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">
                Truy xuất&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <Select
                  value={processAccessId}
                  name="processAccessId"
                  title="Chọn truy xuất"
                  data={PROCESS_ACCESS_OPTIONS}
                  labelName="title"
                  val="id"
                  handleChange={this.onChangeSelect("processAccessId")}
                />
                <p className="form-error-message">{errors.processAccessId || ""}</p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="9">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">
                Tên kê khai&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={setManifestName}
                    onChange={this.onChangeValue("setManifestName")}
                    type="text"
                    maxLength={255}
                    disabled={isReadOnly}
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
                <p className="form-error-message">{errors.setManifestName || ""}</p>
              </div>
            </div>
          </Col>
          <Col md="3">
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">Sắp xếp</label>
              <div className="wrap-insert-or-update-zone-item-box">
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={sortOrder === null || sortOrder === undefined ? "" : sortOrder}
                    onChange={this.onChangeValue("sortOrder")}
                    type="number"
                    min={1}
                    max={100}
                    disabled={isReadOnly}
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={variable === DATA_TYPE_TEXT ? "6" : "12"}>
            <div className={`${classes.rowItem} mr-b-0 `}>
              <label className="wrap-insert-or-update-zone-item-label">
                Kiểu dữ liệu&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                <Select
                  value={variable}
                  name="variable"
                  title="Chọn kiểu dữ liệu"
                  data={VARIABLE_OPTIONS}
                  labelName="label"
                  val="value"
                  handleChange={this.onChangeVariable}
                />
                <p className="form-error-message">{errors.variable || ""}</p>
              </div>
            </div>
          </Col>

          {variable === DATA_TYPE_TEXT ? (
            <Col md="6">
              <div className={`${classes.rowItem} mr-b-0 `}>
                <label className="wrap-insert-or-update-zone-item-label">
                  Danh sách tham chiếu
                </label>
                <div className="wrap-insert-or-update-zone-item-box">
                  <Select
                    value={refference}
                    name="refference"
                    title="Chọn danh sách tham chiếu"
                    data={REFERENCE_OPTIONS}
                    labelName="label"
                    val="value"
                    handleChange={this.onChangeRefference}
                  />
                </div>
              </div>
            </Col>
          ) : null}
        </Row>

        {/* Kiểu Có/Không: định nghĩa nội dung hiển thị */}
        {variable === 6 ? (
          <Row className="mb-3">
            <Col md="12">
              <label className="wrap-insert-or-update-zone-item-label">
                Định nghĩa nội dung hiển thị cho kiểu dữ liệu có/không
              </label>
            </Col>
            <Col md="6">
              <div className={`${classes.rowItem} mr-b-0 `}>
                <label className="wrap-insert-or-update-zone-item-label">Trường hợp có</label>
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={this.getCustomValue("1")}
                    onChange={this.onChangeCustom("1")}
                    type="text"
                    maxLength={255}
                    disabled={isReadOnly}
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
              </div>
            </Col>
            <Col md="6">
              <div className={`${classes.rowItem} mr-b-0 `}>
                <label className="wrap-insert-or-update-zone-item-label">Trường hợp không</label>
                <InputGroup className="input-group-alternative css-border-input">
                  <input
                    value={this.getCustomValue("0")}
                    onChange={this.onChangeCustom("0")}
                    type="text"
                    maxLength={255}
                    disabled={isReadOnly}
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}

export default InsertOrUpdate;
