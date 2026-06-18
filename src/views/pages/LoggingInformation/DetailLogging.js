import React, { Component } from "react";
import moment from "moment";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

// Chi tiết nhật ký (read-only) — đối chiếu mobile Laco/src/screens/detailDiary
const E_RESULT_TEXT = {
  0: "Đang chờ",
  1: "Đạt",
  2: "Không đạt",
  3: "Đã thực hiện lại",
};
const E_RESULT_STYLE = {
  0: classes.waiting,
  1: classes.active,
  2: classes.disable,
  3: classes.remake,
};

class DetailLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traceInforms: [],
      isLoaded: false,
      popupMessage: false,
      errMessage: "",
    };
  }

  componentDidMount() {
    const { onHandleChangeValue, item, requestGetHistoryTrace } = this.props;

    if (onHandleChangeValue) onHandleChangeValue(this.state);

    if (item && requestGetHistoryTrace) {
      const traceID = item.id || item.ID;
      const companyID = item.CompanyID || item.companyId;
      this.setState({ isLoaded: true });
      requestGetHistoryTrace({ companyID, traceID, page: 0, limit: 200 }).then((res) => {
        const data = ((res.data || {}).data || {});
        this.setState({ traceInforms: data.traceInforms || [], isLoaded: false });
      });
    }
  }

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  renderContents = (raw) => {
    let contents = [];
    try {
      contents = JSON.parse(raw || "[]");
    } catch (e) {
      contents = [];
    }
    if (!contents.length) return null;
    return (
      <div className="mt-2">
        {contents.map((c, i) => (
          <div key={i} className="d-flex mb-1">
            <div className="text-muted" style={{ marginRight: 8 }}>
              {c.ColumnName}:
            </div>
            <div className="fw-bold">{c.DisplayValue || c.Value || ""}</div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { errMessage, popupMessage, traceInforms, isLoaded } = this.state;
    const { item } = this.props;

    const displayTitle = item ? (item.title || item.ProductName || "") : "";
    const displayCode = item ? (item.code || item.NameCode || "") : "";
    const displayZone = item ? (item.plantingZoneName || item.PlantingZone || "") : "";

    return (
      <div className="wrap-insert-or-update-zone">
        {/* Thông tin trace (read-only) */}
        <div className="wrap-insert-or-update-zone-item" style={{ pointerEvents: "none", opacity: ".6" }}>
          <label className="wrap-insert-or-update-zone-item-label">Tiêu đề</label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input type="text" value={displayTitle} readOnly className="wrap-insert-or-update-zone-item-input" />
            </InputGroup>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item" style={{ pointerEvents: "none", opacity: ".6" }}>
          <label className="wrap-insert-or-update-zone-item-label">Code</label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input type="text" value={displayCode} readOnly className="wrap-insert-or-update-zone-item-input" />
            </InputGroup>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item" style={{ pointerEvents: "none", opacity: ".6" }}>
          <label className="wrap-insert-or-update-zone-item-label">Vị trí</label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input type="text" value={displayZone} readOnly className="wrap-insert-or-update-zone-item-input" />
            </InputGroup>
          </div>
        </div>

        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <h3>Danh sách nhật ký</h3>

        <div className="list">
          {isLoaded ? (
            <p style={{ textAlign: "center", color: "#999" }}>Đang tải...</p>
          ) : traceInforms && traceInforms.length > 0 ? (
            traceInforms.map((inform, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header bg-white p-0">
                  <h5 className="mb-0 p-2">
                    <span className="text-info">{inform.infoName || "Ghi nhật ký"}</span>
                  </h5>
                </div>
                <div className="card-body p-3">
                  <div className="d-flex mb-1">
                    <div className="text-muted" style={{ marginRight: 8 }}>Ngày thực hiện: </div>
                    <div className="fw-bold">
                      {inform.createdDate
                        ? moment(inform.createdDate).format("DD/MM/YYYY HH:mm")
                        : ""}
                    </div>
                  </div>
                  <div className="d-flex mb-1">
                    <div className="text-muted" style={{ marginRight: 8 }}>Người thực hiện: </div>
                    <div className="fw-bold">{inform.fullName || ""}</div>
                  </div>
                  <div className="d-flex mb-1">
                    <div className="text-muted" style={{ marginRight: 8 }}>Kết quả: </div>
                    <div className={E_RESULT_STYLE[inform.eResult] || ""}>
                      {E_RESULT_TEXT[inform.eResult] || ""}
                    </div>
                  </div>
                  {(inform.eResult === 2 || inform.eResult === 3) && inform.reason ? (
                    <div className="d-flex mb-1">
                      <div className="text-muted" style={{ marginRight: 8 }}>
                        {inform.eResult === 2 ? "Lý do: " : "Nội dung đã thực hiện lại: "}
                      </div>
                      <div className="fw-bold">{inform.reason}</div>
                    </div>
                  ) : null}
                  {this.renderContents(inform.contents)}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>Chưa có dữ liệu</p>
          )}
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />

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

export default DetailLogging;
