import React, { Component } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Button, Input } from "reactstrap";
import classes from "./index.module.css";
import { DATA_TYPES } from "../../../helpers/constant";

const E_RESULT = {
  waiting: 0, // Đang chờ
  pass: 1, // Đạt
  fail: 2, // Không đạt
  remade: 3, // Đã thực hiện lại
};

function resultMeta(eResult) {
  switch (eResult) {
    case E_RESULT.waiting:
      return { text: "Đang chờ", style: classes.waiting };
    case E_RESULT.pass:
      return { text: "Đạt", style: classes.active };
    case E_RESULT.fail:
      return { text: "Không đạt", style: classes.disable };
    case E_RESULT.remade:
      return { text: "Đã thực hiện lại", style: classes.remake };
    default:
      return { text: "", style: "" };
  }
}

// Một bản ghi nhật ký (traceInform) kèm thao tác: đánh giá / làm lại / xóa
class DiaryRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEvaluate: false,
      typePass: true, // true = Đạt, false = Không đạt
      reason: "",
      file: null,
      submitting: false,
    };
  }

  getId = () => {
    const { item } = this.props;
    return item.id || item.ID || item.Id || item.traceInformId || item.TraceInformId;
  };

  toggleEvaluate = () => {
    this.setState((s) => ({ showEvaluate: !s.showEvaluate, typePass: true, reason: "", file: null }));
  };

  onSubmitEvaluate = () => {
    const { requestEvaluateDiary, onRefresh } = this.props;
    const { typePass, reason, file } = this.state;
    const id = this.getId();

    if (!id) {
      toast.error("Bản ghi không hợp lệ");
      return;
    }
    if (!typePass && !reason.trim()) {
      toast.error("Bạn vui lòng nhập lý do không đạt");
      return;
    }

    this.setState({ submitting: true });

    requestEvaluateDiary({
      id,
      eResult: typePass ? E_RESULT.pass : E_RESULT.fail,
      reason: reason,
      files: file ? [file] : null,
    }).then((res) => {
      this.setState({ submitting: false });
      const data = res.data || {};
      if (data.status === 200) {
        toast.success("Đánh giá thành công!");
        this.setState({ showEvaluate: false, reason: "", file: null });
        if (onRefresh) onRefresh();
      } else {
        toast.error(data.message || "Đánh giá thất bại");
      }
    });
  };

  onMadeAgain = () => {
    const { requestMadeAgainDiary, onRefresh } = this.props;
    const id = this.getId();
    if (!id) return;

    if (!window.confirm("Bạn xác nhận làm lại bản ghi này?")) return;

    requestMadeAgainDiary(id).then((res) => {
      const data = res.data || {};
      if (data.status === 200) {
        toast.success("Xác nhận làm lại thành công!");
        if (onRefresh) onRefresh();
      } else {
        toast.error(data.message || "Xác nhận làm lại thất bại");
      }
    });
  };

  onDelete = () => {
    const { requestDeleteWriteTrace, onRefresh } = this.props;
    const id = this.getId();
    if (!id) return;

    if (!window.confirm("Bạn xác nhận xóa bản ghi nhật ký này?")) return;

    requestDeleteWriteTrace(id).then((res) => {
      const data = res.data || {};
      if (data.status === 200) {
        toast.success("Xóa bản ghi thành công!");
        if (onRefresh) onRefresh();
      } else {
        toast.error(data.message || "Xóa bản ghi thất bại");
      }
    });
  };

  renderContentValue = (content, index) => {
    const displayValue = content.DisplayValue || content.Value;

    if (content.DataType === DATA_TYPES.hinhanh) {
      return (
        <div key={index} className="row mb-2">
          <div className="col-4 font-weight-bold">{content.ColumnName}:</div>
          <div className="col-8">
            {content.Value ? (
              content.Value.split(/[,;]/).map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt="Evidence"
                    style={{ width: "100px", marginRight: "5px" }}
                  />
                ) : null
              )
            ) : (
              <span>Không có hình ảnh</span>
            )}
          </div>
        </div>
      );
    }

    if (content.DataType === DATA_TYPES.banDo) {
      return (
        <div key={index} className="row mb-2">
          <div className="col-4 font-weight-bold">{content.ColumnName}:</div>
          <div className="col-8">
            <a
              href={`https://maps.google.com/?q=${content.Value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem bản đồ ({content.Value})
            </a>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="row mb-2">
        <div className="col-4 font-weight-bold">{content.ColumnName}:</div>
        <div className={`col-8 ${classes.itemValueView}`}>{displayValue}</div>
      </div>
    );
  };

  render() {
    const { item, contents, canEvaluate } = this.props;
    const { showEvaluate, typePass, reason, submitting } = this.state;
    const meta = resultMeta(item.eResult);

    return (
      <div className={classes.itemBodyView}>
        <div className={classes.titleItemView}>{item.infoName}</div>

        {contents.map((content, index) => this.renderContentValue(content, index))}

        <div className="row mt-3 pt-2 border-top">
          <div className="col-4 font-weight-bold">Kết quả:</div>
          <div className={`col-8 ${meta.style}`}>{meta.text}</div>
        </div>

        {item.reason ? (
          <div className="row mt-1">
            <div className="col-4 font-weight-bold">Lý do:</div>
            <div className="col-8">{item.reason}</div>
          </div>
        ) : null}

        {/* Thanh thao tác */}
        <div className="row mt-2" style={{ gap: 6, paddingLeft: 15 }}>
          {canEvaluate && item.eResult === E_RESULT.waiting ? (
            <Button size="sm" color="info" type="button" onClick={this.toggleEvaluate}>
              Đánh giá
            </Button>
          ) : null}
          {item.eResult === E_RESULT.fail ? (
            <Button size="sm" color="warning" type="button" onClick={this.onMadeAgain}>
              Làm lại
            </Button>
          ) : null}
          <Button size="sm" color="danger" type="button" onClick={this.onDelete}>
            Xóa
          </Button>
        </div>

        {/* Form đánh giá */}
        {showEvaluate ? (
          <div className="mt-2 p-2" style={{ border: "1px solid #eee", borderRadius: 6 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={typePass === true}
                  onChange={() => this.setState({ typePass: true })}
                />{" "}
                Đạt
              </label>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={typePass === false}
                  onChange={() => this.setState({ typePass: false })}
                />{" "}
                Không đạt
              </label>
            </div>
            {!typePass ? (
              <Input
                type="textarea"
                placeholder="Lý do không đạt"
                value={reason}
                onChange={(e) => this.setState({ reason: e.target.value })}
                style={{ marginBottom: 8 }}
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                this.setState({ file: e.target.files && e.target.files[0] })
              }
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                size="sm"
                color="success"
                type="button"
                disabled={submitting}
                onClick={this.onSubmitEvaluate}
              >
                Gửi đánh giá
              </Button>
              <Button size="sm" color="secondary" type="button" onClick={this.toggleEvaluate}>
                Hủy
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

class ViewModal extends Component {
  render() {
    const {
      dataTrace,
      dataTraceInforms,
      canEvaluate,
      requestEvaluateDiary,
      requestMadeAgainDiary,
      requestDeleteWriteTrace,
      onRefresh,
    } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.headerView}>
          <p>
            <strong>Sản phẩm:</strong> {dataTrace?.productName}
          </p>
          <p>
            <strong>Doanh nghiệp:</strong> {dataTrace?.companyName}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {dataTrace?.createdDate
              ? moment(dataTrace.createdDate).format("DD/MM/YYYY")
              : ""}
          </p>
        </div>
        {dataTraceInforms &&
          dataTraceInforms.map((item, key) => {
            let contents = [];
            try {
              contents = JSON.parse(item.contents || "[]");
            } catch (e) {
              contents = [];
            }
            return (
              <div key={key} className={classes.timelineRow}>
                <div className="col-2 time-column">
                  <strong>
                    {moment(item.createdDate).format("HH:mm DD/MM/YYYY")}
                  </strong>
                </div>
                <div className="col-10">
                  <DiaryRecord
                    item={item}
                    contents={contents}
                    canEvaluate={canEvaluate}
                    requestEvaluateDiary={requestEvaluateDiary}
                    requestMadeAgainDiary={requestMadeAgainDiary}
                    requestDeleteWriteTrace={requestDeleteWriteTrace}
                    onRefresh={onRefresh}
                  />
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default ViewModal;
