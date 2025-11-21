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
import { Input, InputGroup } from "reactstrap";
import moment from "moment";
import Select from "components/Select";

class AddNewQRList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      reasonVal: "",
      executedDate: null,
      temListId: null,
      fromVal: "",
      fielVal: "",
      toVal: "",
    };
    this.refFileImage = null;
  }

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

  handleFileChange = (files) => {
    this.setState({ file: files[0]?.name || "" });
  };

  render() {
    const { errorInsert, id, TEMLIST_OPTIONS } = this.props;
    const { reasonVal, executedDate, temListId, fromVal, toVal } = this.state;

    let dateConvert = executedDate && moment(executedDate).format("DD-MM-YYYY");
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
                  type="text"
                  name="reasonVal"
                  value={reasonVal}
                  defaultValue={reasonVal}
                  onChange={this.onChangeValue("reasonVal")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert.name || ""}
              </p>
            </div>
          </div>

          <div className={classes.rowItem}>
            <label className="form-control-label">
              Chọn dải tem&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <Select
                value={temListId}
                defaultValue={null}
                labelMark={null}
                className="wrap-insert-or-update-zone-item-select"
                name="temListId"
                title="Chọn chọn dải tem"
                data={TEMLIST_OPTIONS}
                labelName="title"
                val="id"
                handleChange={this.onChangeSelect("temListId")}
              />

              <p className="form-error-message">
                {errorInsert.temListId || ""}
              </p>
            </div>
          </div>

          {temListId && (
            <>
              <div className={classes.rowItem}>
                <label className="form-control-label">
                  Dải tem từ&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className={classes.rowItem}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      onChange={this.onChangeValue("fromVal")}
                      type="number"
                      value={fromVal}
                      className="wrap-insert-or-update-zone-item-input"
                    />
                  </InputGroup>

                  <p className="form-error-message">
                    {errorInsert.fromVal || ""}
                  </p>
                </div>
              </div>
              <div className={classes.rowItem}>
                <label className="form-control-label">
                  Dải tem đến&nbsp;<b style={{ color: "red" }}>*</b>
                </label>
                <div className={classes.rowItem}>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      onChange={this.onChangeValue("toVal")}
                      type="number"
                      value={toVal}
                      className="wrap-insert-or-update-zone-item-input"
                    />
                  </InputGroup>

                  <p className="form-error-message">
                    {errorInsert.toVal || ""}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className={classes.cardCustomQrList}>
            <div class="card-header p-3 d-flex justify-content-between align-items-center bg-info text-white">
              <h5 class="mb-0">Danh sách mã QR</h5>
              <button
                class="btn btn-warning btn-sm btn-icon-only ml-auto"
                id="add-qr-btn"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <div class="card-body p-3">
              <div class="d-flex flex-wrap qr-list-container">
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000282
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000283
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000284
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000285
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000286
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000287
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000288
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000289
                </span>
                <span class="qr-item badge badge-primary m-1">
                  TGI0200158000000290
                </span>
              </div>
            </div>
          </div>
          <div className={`${classes.rowItem} mr-b-0 `}>
            <label className="wrap-insert-or-update-zone-item-label">
              Chứng từ liên quan
            </label>

            <div className={`${classes.inputArea} `}>
              <input
                type="file"
                className="form-control-file"
                name="fielVal"
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
