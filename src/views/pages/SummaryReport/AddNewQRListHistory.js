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
import {
  Card,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table,
} from "reactstrap";
import moment from "moment";
import ReactDatetime from "react-datetime";
import ModalTable from "components/ModalTable/ModalTable";

class AddNewQRListHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      dateFrom: "",
      dateTo: "",
    };
  }

  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

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

  columnsConfig = [
    {
      header: "STT",
      className: "text-center",
      style: { width: "50px" },
      render: (row, index) => index + 1,
    },
    {
      header: "Hành động",
      className: "font-weight-bold",
      accessor: "actionName",
    },
    {
      header: "Mô tả",
      accessor: "description",
    },
    {
      header: "Người thực hiện",
      accessor: "performedBy",
    },
    {
      header: "Thời gian",
      accessor: "performedDate",
    },
    {
      header: "Trạng thái",
      className: "text-center",
      render: (row) => (
        <span
          className={`badge ${
            row.status === "Thành công"
              ? "badge-success"
              : row.status === "Thất bại"
              ? "badge-danger"
              : "badge-warning"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  render() {
    const { data } = this.props;
    const { executedDate, dateFrom, dateTo } = this.state;

    let dateConvert = executedDate && moment(executedDate).format("DD-MM-YYYY");
    let historyData = data?.historyData || [];

    return (
      <>
        <div className={`${classes.formControl} css-system-stamp`}>
          <h3>Thông tin lịch sử dải tem</h3>
          <div className={classes.rowItem}>
            <label className="form-control-label">Ngày đăng ký</label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  placeholder="Ngày đăng ký"
                  type="text"
                  readOnly
                  name="executedDate"
                  value={dateConvert}
                  defaultValue={dateConvert}
                  onChange={this.onChangeValue("executedDate")}
                />
              </InputGroup>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">Số lượng</label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  placeholder="Số lượng"
                  type="text"
                  readOnly
                  name="quantity"
                  value="1000"
                  onChange={this.onChangeValue("quantity")}
                />
              </InputGroup>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">Dải tem</label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  placeholder="Dải tem"
                  type="text"
                  readOnly
                  name="temList"
                  value="TGI0200158000000282 - TGI0200158000001281"
                  onChange={this.onChangeValue("temList")}
                />
              </InputGroup>
            </div>
          </div>
          <h3>Danh sách dải tem</h3>

          <div className={classes.rowItem}>
            <div className="wrap-insert-or-update-zone-item-box">
              <FormGroup
                style={{
                  display: "flex",
                  gap: "15px",
                  width: "100%",
                  marginBottom: 0,
                }}
              >
                <InputGroup
                  className="input-group-alternative css-border-input"
                  style={{ flex: 1 }}
                >
                  <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{ placeholder: "Từ ngày", name: "dateFrom" }}
                    value={dateFrom}
                    timeFormat={false}
                    dateFormat="DD-MM-YYYY"
                    onChange={this.onChangeValue("dateFrom")}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <div className={classes.rowItem}>
            <div className="wrap-insert-or-update-zone-item-box">
              <FormGroup
                style={{
                  display: "flex",
                  gap: "15px",
                  width: "100%",
                  marginBottom: 0,
                }}
              >
                <InputGroup
                  className="input-group-alternative css-border-input"
                  style={{ flex: 1 }}
                >
                  <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    className="rdt-align-right"
                    inputProps={{ placeholder: "Đến ngày", name: "dateTo" }}
                    value={dateTo}
                    timeFormat={false}
                    dateFormat="DD-MM-YYYY"
                    onChange={this.onChangeValue("dateTo")}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <div className={classes.rowItem}>
            <ModalTable
              data={historyData}
              columns={this.columnsConfig}
              classes={classes}
            />
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
  AddNewQRListHistory
);
