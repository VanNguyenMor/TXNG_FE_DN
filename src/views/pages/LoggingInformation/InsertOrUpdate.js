import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

class InsertOrUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      zoneId: null,
      popupMessage: false,
      errMessage: "",
    };
  }

  async componentDidMount() {
    const { onHandleChangeValue } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

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

  // Bug #36/37 fix: onChangeSelect properly updates state and notifies parent
  onChangeSelect = (name) => (value) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: value,
      }),
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
      (previousState) => ({
        ...previousState,
        [name]: value,
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  render() {
    const { errMessage, popupMessage, jobId, productId, zoneId } = this.state;
    const { errors, PRODUCT_OPTIONS, JOB_OPTIONS, PLANTINGZONE_OPTIONS } =
      this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        {/* Bug #36 fix: dropdown now uses JOB_OPTIONS from props (fetched from API) */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngành nghề&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={jobId}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="jobId"
              title="Chọn ngành nghề"
              data={JOB_OPTIONS || []}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("jobId")}
            />
            <p className="form-error-message">{(errors && errors.jobId) || ""}</p>
          </div>
        </div>

        {/* Bug #36 fix: dropdown uses PRODUCT_OPTIONS from props (fetched from API) */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Sản phẩm
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={productId}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="productId"
              title="Chọn sản phẩm"
              data={PRODUCT_OPTIONS || []}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("productId")}
            />
            <p className="form-error-message">{(errors && errors.productId) || ""}</p>
          </div>
        </div>

        {/* Bug #36 fix: dropdown uses PLANTINGZONE_OPTIONS from props (fetched from API) */}
        <div className={`${classes.rowItem} mr-b-0`}>
          <label className="wrap-insert-or-update-zone-item-label">
            Vị trí&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className={`${classes.inputArea}`}>
            <Select
              value={zoneId}
              className="css-select-border"
              name="zoneId"
              title="Chọn vị trí"
              data={PLANTINGZONE_OPTIONS || []}
              labelName="title"
              val="id"
              isHideSelectAll={true}
              isMulti={true}
              handleChange={this.onChangeSelect("zoneId")}
            />
          </div>
        </div>

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

export default InsertOrUpdate;
