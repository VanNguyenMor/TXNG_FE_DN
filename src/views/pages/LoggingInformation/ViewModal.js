import React, { Component } from "react";
import moment from "moment";
import classes from "./index.module.css";
import { DATA_TYPES } from "../../../helpers/constant";

class DiaryItem extends Component {
    render() {
        const { item, contents } = this.props;

        let resultText = "";
        let resultStyle = "";
        switch (item.eResult) {
            case 0:
                resultText = "Đang chờ";
                resultStyle = classes.waiting;
                break;
            case 1:
                resultText = "Đạt";
                resultStyle = classes.active;
                break;
            case 2:
                resultText = "Không đạt";
                resultStyle = classes.disable;
                break;
            case 3:
                resultText = "Đã thực hiện lại";
                resultStyle = classes.remake;
                break;
            default:
                break;
        }

        return (
            <div className={classes.itemBodyView}>
                <div className={classes.titleItemView}>{item.infoName}</div>

                {contents.map((content, index) => {
                    let displayValue = content.DisplayValue || content.Value;

                    if (content.DataType === DATA_TYPES.hinhanh) {
                        return (
                            <div key={index} className="row mb-2">
                                <div className="col-4 font-weight-bold">{content.ColumnName}:</div>
                                {/* Assuming content.Value is a comma separated string of image URLs or similar */}
                                <div className="col-8">
                                    {content.Value ? (
                                        content.Value.split(",").map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="Evidence"
                                                style={{ width: "100px", marginRight: "5px" }}
                                            />
                                        ))
                                    ) : (
                                        <span>Không có hình ảnh</span>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    if (content.DataType === DATA_TYPES.banDo) {
                        // Very basic map placeholder if no actual map implementation provided
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
                })}
                <div className="row mt-3 pt-2 border-top">
                    <div className="col-4 font-weight-bold">Kết quả:</div>
                    <div className={`col-8 ${resultStyle}`}>{resultText}</div>
                </div>
            </div>
        );
    }
}

class ViewModal extends Component {
    render() {
        const { dataTrace, dataTraceInforms } = this.props;
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
                        const contents = JSON.parse(item.contents || "[]");
                        return (
                            <div key={key} className={classes.timelineRow}>
                                <div className="col-2 time-column">
                                    <strong>
                                        {moment(item.createdDate).format("HH:mm DD/MM/YYYY")}
                                    </strong>
                                </div>
                                <div className="col-10">
                                    <DiaryItem item={item} contents={contents} />
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

export default ViewModal;
