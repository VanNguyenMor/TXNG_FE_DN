import HeaderTable from "components/HeaderTable";
import React, { Component } from "react";
import MenuButton from "../../../../assets/img/buttons/menu.png";
import classes from "../index.module.css";
import { withRouter } from "react-router-dom";

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
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import moment from "moment";

class SummaryReportRegion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropdowns: {}, // Track which dropdowns are open
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

  handleChangeSelectPlantingZone = (value) => {
    this.props.onChangeFilter("plantingZoneIdRegion")(value);
  };

  handleChangeSelectProduct = (value) => {
    this.props.onChangeFilter("productIdRegion")(value);
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
      plantingZoneId = "",
      products = [],
      plantingZones = [],
      isLoading = false,
      onChangeFilter,
      onSearch,
      dataReload,
      header,
    } = this.props;

    return (
      <div className="config-system-content-config-qr-system">
        <HeaderTable
          hideSearch={true}
          hideCreate={true}
          isReadOnly={true}
          styleCustom={"justifyContentStart"}
          isShowForEdit={false}
          moduleTitle="Báo cáo sản lượng hàng hóa theo vùng trồng"
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
                        placeholder: "DD/MM/YYYY",
                      }}
                      value={fromDate ? moment(fromDate) : ""}
                      timeFormat={false}
                      dateFormat="DD/MM/YYYY"
                      onChange={onChangeFilter("fromDateRegion")}
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
                      onChange={onChangeFilter("toDateRegion")}
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Vùng trồng</label>
                  <div>
                    <Select
                      key={plantingZoneId || "empty"}
                      name="plantingZoneIdRegion"
                      title="Chọn vùng trồng"
                      data={plantingZones || []}
                      labelName="name"
                      val="id"
                      defaultValue={plantingZoneId || null}
                      handleChange={this.handleChangeSelectPlantingZone}
                    />
                  </div>
                </div>

                <div className="mg-div-search">
                  <label className="form-control-label">Sản phẩm</label>
                  <div>
                    <Select
                      key={productId || "empty"}
                      name="productIdRegion"
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
          dataReload={dataReload}
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
                          {item.plantingZoneName || item.region || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.productName || item.product || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.unitName || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 14 }}>
                          {item.quantity || 0}
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

export default withRouter(SummaryReportRegion);
