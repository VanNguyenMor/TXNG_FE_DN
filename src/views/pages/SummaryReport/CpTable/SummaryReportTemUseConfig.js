import HeaderTable from "components/HeaderTable";
import React, { Component } from "react";
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
      PRODUCT_OPTIONS,
    } = this.props;
    const summaryData = {
      totalStamps: 4390,
      usedStamps: 278,
      remainingStamps: 4112,
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
                        placeholder: "dd/mm/yyyy",
                        to: "fromDate",
                      }}
                      value={fromDate || ""}
                      timeFormat={false}
                      dateFormat="DD-MM-YYYY"
                      onChange={(value) =>
                        this.setState({
                          fromDate: value ? value.format("DD-MM-YYYY") : "",
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Đến ngày</label>
                  <div>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "dd/mm/yyyy",
                        name: "toDate",
                      }}
                      value={toDate || ""}
                      timeFormat={false}
                      dateFormat="DD-MM-YYYY"
                      onChange={(value) =>
                        this.setState({
                          toDate: value ? value.format("DD-MM-YYYY") : "",
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div>
                    <Select
                      name="filter"
                      title="Lọc theo trạng thái"
                      data={PRODUCT_OPTIONS}
                      labelName="title"
                      val="id"
                      handleChange={this.handleChangeSelectFilter}
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
                      this.handleSubmitSearchForm();
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
                  {summaryData.totalStamps}
                </span>
              </div>
            </div>

            <div className="text-right m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Đã dùng:{" "}
                <span style={{ fontWeight: "bold", color: "#ffb300" }}>
                  {summaryData.usedStamps}
                </span>
              </div>
            </div>
          </Row>

          <Row>
            <div className="text-left m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Còn lại:{" "}
                <span style={{ fontWeight: "bold", color: "#007bff" }}>
                  {summaryData.remainingStamps}
                </span>
              </div>
            </div>

            <div className="text-right m-2">
              <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                Bị hư:{" "}
                <span style={{ fontWeight: "bold", color: "#dc3545" }}>
                  {summaryData.damagedStamps}
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
                          {item.date}
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
                          {item.temRangeOriginal}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.quantityUsed}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {item.temRangeUsed}
                        </span>
                      </td>
                      <td>
                        <ButtonDropdown
                          isOpen={item.collapse}
                          toggle={() => toggle(key, item.id)}
                        >
                          <DropdownToggle>
                            <img src={MenuButton} alt="Menu" />
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() =>
                                alert("Chuyển sang trang quản lý lô hàng")
                              }
                            >
                              Xem lô hàng
                            </DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
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

export default SummaryReportTemUseConfig;
