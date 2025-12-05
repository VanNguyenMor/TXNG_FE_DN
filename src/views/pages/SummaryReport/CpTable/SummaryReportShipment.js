import React, { Component } from "react";
import HeaderTable from "components/HeaderTable";
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
} from "reactstrap";
import AddNewQRSystem from "../AddNewQRSystem";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import moment from "moment";

class SummaryReportShipment extends Component {
  // Xử lý khi chọn sản phẩm từ Dropdown
  handleChangeSelectProduct = (value) => {
    // Truyền giá trị về index.js thông qua props onChangeFilter
    this.props.onChangeFilter("productIdShipment")(value);
  };

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
      listLength,
      totalPage,
      totalElementItem,
      handlePageClick,
      currentPage,
      fromDate,
      toDate,
      products, 
      productId, 
      isLoading, 
      handleSubmitSearchFormShipment,
      onChangeFilter,
    } = this.props;

    return (
      <div className="config-system-content-config-qr-system">
        <HeaderTable
          hideSearch={true}
          hideCreate={true}
          isReadOnly={true}
          styleCustom={"justifyContentStart"}
          isShowForEdit={false}
          moduleTitle={"Báo cáo lô hàng"}
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
                style={{ marginBottom: "10px", flexWrap: "wrap" }}
              >
                <div className="mg-div-search">
                  <label className="form-control-label">Từ ngày</label>
                  <div>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "YYYY-MM-DD",
                      }}
                      value={fromDate ? moment(fromDate) : ""}
                      timeFormat={false}
                      dateFormat="YYYY-MM-DD"
                      onChange={(value) =>
                        onChangeFilter("fromDateShipment")(value)
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
                      }}
                      value={toDate ? moment(toDate) : ""}
                      timeFormat={false}
                      dateFormat="YYYY-MM-DD"
                      onChange={(value) =>
                        onChangeFilter("toDateShipment")(value)
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div style={{ minWidth: "200px" }}>
                    <Select
                      name="productIdShipment"
                      title="Chọn sản phẩm"
                      data={products || []}
                      labelName="title"
                      val="id"
                      value={productId}
                      handleChange={this.handleChangeSelectProduct}
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
                    onClick={handleSubmitSearchFormShipment}
                    disabled={isLoading}
                  >
                    <img src={SearchImg} alt="Tìm kiếm" />
                    <span>{isLoading ? "Đang tải..." : "Tìm kiếm"}</span>
                  </Button>
                </div>
              </div>
            </>
          }
        />

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
              {isLoading ? (
                <tr>
                  <td colSpan={header.length + 1} className="text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length > 0 ? (
                data
                .filter((item, key) => key >= beginItem && key < endItem)
                .map((item, key) => (
                  <tr key={key}>
                    <td className="table-scale-col table-user-col-1">
                      {item.stt}
                    </td>

                    <td style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 14 }}>{item.date}</span>
                    </td>

                    <td style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 14 }}>{item.shipmentCode}</span>
                    </td>

                    <td style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 14 }}>{item.stampQuantity}</span>
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
                              alert(`Xem chi tiết lô: ${item.shipmentCode}`)
                            }
                          >
                            Xem lô hàng
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={header.length + 1} className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
        
        {/* Pagination */}
        {!isLoading && Array.isArray(data) && listLength > 0 && (
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

export default SummaryReportShipment;