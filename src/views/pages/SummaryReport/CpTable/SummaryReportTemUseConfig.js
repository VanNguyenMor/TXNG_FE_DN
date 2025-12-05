import HeaderTable from "components/HeaderTable";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MenuButton from "../../../../assets/img/buttons/menu.png";
import classes from "../index.module.css";
import SearchImg from "../../../../assets/img/buttons/searchig.svg";
import {
  Card,
  Table,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Row,
  Col,
} from "reactstrap";
import AddNewQRSystem from "../AddNewQRSystem";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import ReactDatetime from "react-datetime";
import Select from "components/Select";

class SummaryReportTemUseConfig extends Component {
  render() {
    const {
      id,
      onHandleChangeValue,
      errorInserts,
      insert,
      handleModal,
      onConfirm,
      header,
      data,
      beginItem,
      endItem,
      toggle,
      onEdit,
      listLength,
      totalPage,
      totalElementItem,
      handlePageClick,
      currentPage,
      fromDate,
      toDate,
      setState,
      toggleModal,
      productId,
      products,
      summaryInfo,
      isLoading,
      onChangeFilter,
      onSearch,
    } = this.props;
    const summaryData = summaryInfo || {
      totalStamps: 0,
      usedStamps: 0,
      remainingStamps: 0,
      damagedStamps: 0,
    };
    return (
      <div className="config-system-content-config-qr-system">
        <HeaderTable
          hideSearch={true}
          hideCreate={true}
          isReadOnly={true}
          styleCustom={"justifyContentStart"}
          isShowForEdit={false}
          moduleTitle={false ? "Xem QR hệ thống" : "Thêm mới QR hệ thống"}
          moduleBody={
            <AddNewQRSystem
              id={id}
              onHandleChangeValue={onHandleChangeValue}
              errorInsert={errorInserts}
              data={insert}
            />
          }
          handleModal={handleModal}
          onConfirm={onConfirm}
          typeSearch={
            <>
              <div
                className="div_flex"
                style={{ marginBottom: "10px", flex: "wrap" }}
              >
                <div className="mg-div-search">
                  <label className="form-control-label">Từ ngày</label>
                  <div>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "YYYY-MM-DD",
                        name: "fromDate",
                      }}
                      value={fromDate || ""}
                      timeFormat={false}
                      dateFormat="YYYY-MM-DD"
                      onChange={(value) =>
                        onChangeFilter("fromDateSummaryReportTemUse")(
                          value ? value.format("YYYY-MM-DD") : ""
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Đến ngày</label>
                  <div>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "YYYY-MM-DD",
                        name: "toDate",
                      }}
                      value={toDate || ""}
                      timeFormat={false}
                      dateFormat="YYYY-MM-DD"
                      onChange={(value) =>
                        onChangeFilter("toDateSummaryReportTemUse")(
                          value ? value.format("YYYY-MM-DD") : ""
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div>
                    <Select
                      name="filter"
                      title="Lọc theo sản phẩm"
                      data={products || []}
                      labelName="title"
                      val="id"
                      handleChange={onChangeFilter("productIdTemUse")}
                    />
                  </div>
                </div>

                <div className="mg-btn">
                  <label className="form-control-label">&nbsp;</label>
                  <Button
                    className="btn-warning-cs"
                    color="default"
                    type="button"
                    size="md"
                    onClick={() => {
                      onSearch();
                    }}
                  >
                    <img src={SearchImg} alt="Tìm kiếm" />
                    <span>Tìm kiếm</span>
                  </Button>
                </div>
              </div>
            </>
          }
        />
        <div className=" p-3">
          <Row>
            <div className="text-left m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Tổng tem:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {summaryData.totalCount || 0}
                </span>
              </div>
            </div>

            <div className="text-right m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Đã dùng:{" "}
                <span style={{ fontWeight: "bold", color: "#ffb300" }}>
                  {summaryData.usedCount || 0}
                </span>
              </div>
            </div>
          </Row>

          <Row>
            <div className="text-left m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Còn lại:{" "}
                <span style={{ fontWeight: "bold", color: "#007bff" }}>
                  {summaryData.remainCount || 0}
                </span>
              </div>
            </div>

            <div className="text-right m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Bị hư:{" "}
                <span style={{ fontWeight: "bold", color: "#dc3545" }}>
                  {summaryData.badCount || 0}
                </span>
              </div>
            </div>
          </Row>
        </div>
        <Card className="shadow">
          <Table
            className={`align-items-center tablecs ${classes.scrollTable}`}
            responsive
          >
            <HeadTitleTable
              headerTitle={header}
              classHeaderColumns={{
                0: "table-scale-col table-user-col-1",
              }}
            />
            <tbody className="config-system-content-config-server-list-table-body">
              {Array.isArray(data) &&
                data
                  .filter((item, key) => key >= beginItem && key < endItem)
                  .map((item, key) => (
                    <tr key={key}>
                      <td className="table-scale-col table-user-col-1">
                        {key + beginItem + 1}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.createdDate}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.productName}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.startNum} - {item.endNum}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.usedCount}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.usedStartNum} - {item.usedEndNum}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          className="btn-sm"
                          color="info"
                          onClick={() =>
                            this.props.history.push("/trang_chu/quan_ly_lo_hang")
                          }
                        >
                          Xem lô hàng
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </Card>
        {Array.isArray(data) && listLength > 0 && (
          <Pagination
            data={data}
            listLength={listLength}
            totalPage={totalPage}
            totalElement={totalElementItem}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SummaryReportTemUseConfig);
