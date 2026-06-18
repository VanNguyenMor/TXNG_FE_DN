import React, { Component } from "react";
import classes from "./index.module.css";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { connect } from "react-redux";

// reactstrap components
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";
import moment from "moment";
import ReactDatetime from "react-datetime";
import ModalTable from "components/ModalTable/ModalTable";
import { fetchData } from "helpers/fetchData";

// Loại lịch sử dải tem (khớp STAMP_REQUEST_HISTORY_TYPES trên app mobile)
const HISTORY_TYPES = {
  batch: 0,
  cancel: 1,
};

class AddNewQRListHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Mặc định lọc theo hôm nay - giống app mobile
      dateFrom: moment(),
      dateTo: moment(),
      historyData: [],
      totalCount: 0,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const { id } = this.props;
    if (id) {
      await this.fetchHistory();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id && this.props.id) {
      await this.fetchHistory();
    }
  }

  formatDate = (value) => {
    if (!value) return "";
    const m = moment.isMoment(value) ? value : moment(value, "DD-MM-YYYY");
    return m.isValid() ? m.format("YYYY-MM-DD") : "";
  };

  fetchHistory = async () => {
    const { id } = this.props;
    const { dateFrom, dateTo } = this.state;

    if (!id) return;

    this.setState({ isLoading: true });
    try {
      const result = await fetchData.qrCodeManagement.getQRHistory(
        id,
        this.formatDate(dateFrom),
        this.formatDate(dateTo)
      );

      const historyData = Array.isArray(result?.qrCodes)
        ? result.qrCodes
        : Array.isArray(result?.histories)
        ? result.histories
        : Array.isArray(result)
        ? result
        : [];

      this.setState({
        historyData,
        totalCount: result?.totalCount || historyData.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Fetch QR History error:", error);
      this.setState({ historyData: [], isLoading: false });
    }
  };

  onChangeDate = (name) => (value) => {
    this.setState({ [name]: value }, () => {
      this.fetchHistory();
    });
  };

  parseMetaData = (item) => {
    if (!item || !item.metaData) return {};
    try {
      return JSON.parse(item.metaData) || {};
    } catch (e) {
      return {};
    }
  };

  renderTitle = (item) => {
    const metaData = this.parseMetaData(item);
    if (item.type === HISTORY_TYPES.batch) {
      return `Lô hàng: ${metaData.BatchNum || ""}`;
    }
    if (item.type === HISTORY_TYPES.cancel) {
      return "Hủy tem";
    }
    return "";
  };

  columnsConfig = [
    {
      header: "STT",
      className: "text-center",
      style: { width: "50px" },
      render: (row, index) => index + 1,
    },
    {
      header: "Nội dung",
      className: "font-weight-bold",
      render: (row) => this.renderTitle(row),
    },
    {
      header: "Số lượng",
      className: "text-center",
      render: (row) => row.quantity || 0,
    },
    {
      header: "Lý do hủy",
      render: (row) =>
        row.type === HISTORY_TYPES.cancel
          ? this.parseMetaData(row).ReasonCancel || ""
          : "",
    },
    {
      header: "Dải tem",
      render: (row) => `${row.startRange || ""} - ${row.endRange || ""}`,
    },
    {
      header: "Thời gian",
      render: (row) =>
        row.createdDate
          ? moment(row.createdDate).format("DD/MM/YYYY HH:mm")
          : "",
    },
  ];

  render() {
    const { stampInfo } = this.props;
    const { dateFrom, dateTo, historyData, isLoading } = this.state;

    // Thông tin dải tem lấy từ dòng được chọn (giống header trên mobile)
    const registeredDate =
      stampInfo?.approvalDate ||
      stampInfo?.confirmedDate ||
      stampInfo?.createdDate ||
      "";
    const quantity = stampInfo?.quantity || "";
    const temList =
      stampInfo?.temList ||
      (stampInfo?.startNum && stampInfo?.endNum
        ? `${stampInfo.startNum} - ${stampInfo.endNum}`
        : "");

    const dateConvert = registeredDate
      ? moment(registeredDate, [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          moment.ISO_8601,
        ]).format("DD-MM-YYYY")
      : "";

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
                  value={quantity}
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
                  value={temList}
                />
              </InputGroup>
            </div>
          </div>

          <h3>Danh sách nhật ký</h3>

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
                    onChange={this.onChangeDate("dateFrom")}
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
                    onChange={this.onChangeDate("dateTo")}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-3">
              <Spinner color="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className={classes.rowItem}>
              {historyData.length > 0 ? (
                <ModalTable
                  data={historyData}
                  columns={this.columnsConfig}
                  classes={classes}
                />
              ) : (
                <p className="text-center text-muted mt-3">
                  Không có dữ liệu lịch sử
                </p>
              )}
            </div>
          )}
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
