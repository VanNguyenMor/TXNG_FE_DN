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
} from "reactstrap";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import { formatMoney } from "utils/formatMoney";
import moment from "moment";

class SummaryReportSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropdowns: {},
    };
  }

  toggleDropdown = (itemId) => {
    this.setState((prevState) => ({
      openDropdowns: {
        ...prevState.openDropdowns,
        [itemId]: !prevState.openDropdowns[itemId],
      },
    }));
  };

  handleChangeSelectProduct = (value) => {
    this.props.onChangeFilter("productIdSell")(value);
  };

  handleChangeSelectPartner = (value) => {
    this.props.onChangeFilter("partnerIdSell")(value);
  };

  render() {
    const {
      data = [],
      beginItem = 0,
      endItem = 10,
      listLength = 0,
      totalPage = 1,
      totalElementItem = 0,
      handlePageClick,
      currentPage = 0,
      fromDate = "",
      toDate = "",
      productId = "",
      partnerId = "",
      products = [],
      partners = [],
      isLoading = false,
      onChangeFilter,
      onSearch,
      dataReload,
    } = this.props;

    const header = [
      "STT",
      "Khách hàng",
      "Sản phẩm",
      "Đơn vị",
      "Sản lượng",
      "Đơn giá",
      "VAT (%)",
      "Tổng tiền",
      "Người thực hiện",
      "Thao tác",
    ];

    return (
      <div className="config-system-content-config-qr-system">
        <HeaderTable
          hideSearch={true}
          hideCreate={true}
          isReadOnly={true}
          styleCustom={"justifyContentStart"}
          isShowForEdit={false}
          moduleTitle="Báo cáo bán hàng"
          dataReload={dataReload}
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
                        onChangeFilter("fromDateSell")(value)
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
                        onChangeFilter("toDateSell")(value)
                      }
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div style={{ minWidth: "200px" }}>
                    <Select
                      key={productId || "empty"}
                      name="productIdSell"
                      title="Chọn sản phẩm"
                      data={products || []}
                      labelName="productName"
                      val="id"
                      defaultValue={productId || null}
                      handleChange={this.handleChangeSelectProduct}
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Khách hàng</label>
                  <div style={{ minWidth: "200px" }}>
                    <Select
                      key={partnerId || "empty"}
                      name="partnerIdSell"
                      title="Chọn khách hàng"
                      data={partners || []}
                      labelName="partnerName"
                      val="id"
                      defaultValue={partnerId || null}
                      handleChange={this.handleChangeSelectPartner}
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
                    onClick={onSearch}
                    disabled={isLoading}
                  >
                    <img src={SearchImg} alt="Tìm kiếm" />
                    <span>Tìm kiếm</span>
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
              {Array.isArray(data) &&
                data
                  .filter((item, key) => key >= beginItem && key < endItem)
                  .map((item, key) => (
                    <tr key={key}>
                      <td className="table-scale-col table-user-col-1">
                        {key + beginItem + 1}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.partnerName || item.customer || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.productName || item.product || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.unitName || item.unit || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.quantity || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {formatMoney(item.unitPrice || 0)}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.vat || item.perVAT || 0}%
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {formatMoney(item.amount || item.totalAmount || 0)}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.fullName || item.executor || "-"}
                        </span>
                      </td>
                      <td>
                        <ButtonDropdown
                          isOpen={this.state.openDropdowns[item.id] || false}
                          toggle={() => this.toggleDropdown(item.id)}
                        >
                          <DropdownToggle>
                            <img src={MenuButton} alt="Menu" />
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => {}}>
                              Xem phiếu xuất
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

export default SummaryReportSell;
