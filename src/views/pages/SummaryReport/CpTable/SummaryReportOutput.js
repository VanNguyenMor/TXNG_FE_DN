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
} from "reactstrap";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import moment from "moment";

class SummaryReportOutput extends Component {
  handleChangeSelectProduct = (value) => {
    this.props.onChangeFilter("productIdOutput")(value);
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
      isLoading,
      onChangeFilter,
      onSearch,
      dataReload,
    } = this.props;

    return (
      <div className="config-system-content-config-qr-system">
        <HeaderTable
          hideSearch={true}
          hideCreate={true}
          isReadOnly={true}
          styleCustom={"justifyContentStart"}
          isShowForEdit={false}
          moduleTitle="Báo cáo sản lượng hàng hóa"
          dataReload={dataReload}
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
                        placeholder: "DD/MM/YYYY",
                      }}
                      value={fromDate ? moment(fromDate) : ""}
                      timeFormat={false}
                      dateFormat="DD/MM/YYYY"
                      onChange={(value) =>
                        onChangeFilter("fromDateOutput")(value)
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Đến ngày</label>
                  <div>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "DD/MM/YYYY",
                      }}
                      value={toDate ? moment(toDate) : ""}
                      timeFormat={false}
                      dateFormat="DD/MM/YYYY"
                      onChange={(value) =>
                        onChangeFilter("toDateOutput")(value)
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div style={{ minWidth: "200px" }}>
                    <Select
                      key={productId || "empty"}
                      name="productIdOutput"
                      title="Chọn sản phẩm"
                      data={products || []}
                      labelName="productName"
                      val="id"
                      defaultValue={productId || null}
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
                    onClick={() => onSearch && onSearch()}
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
                        {key + beginItem + 1}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>{item.productName}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>{item.unitName}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>{item.quantity}</span>
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
                                this.props.history.push(
                                  "/trang_chu/quan_ly_hang_hoa"
                                )
                              }
                            >
                              Xem sản phẩm
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                this.props.history.push("/trang_chu/vung_trong")
                              }
                            >
                              Xem vùng
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

export default withRouter(SummaryReportOutput);
