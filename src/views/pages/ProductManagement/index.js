import React, { Component } from "react";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PRODUCT_MANAGEMENT } from "../../../helpers/constant";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import MenuButton from "../../../assets/img/buttons/menu.png";
import ShowHistoryData from "./ShowHistoryData.js";
import ShowEditData from "./ShowEditData.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { fetchData } from "helpers/fetchData.js";
import { handleGenTree } from "../../../helpers/trees";

class ProductManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: null,
      limit: 10,
      beginItem: 0,
      endItem: 10,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      collapseList: [],
      dataInsert: {},
      errorInserts: {},
      isShowForHistoryList: false,
      isShowForDetail: false,
      editId: null,
      warningBlockProductModal: false,
      blockProductId: null,
      blockProductTitle: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Chưa khóa" },
        { id: 1, title: "Đã khóa" },
      ],
      AUTHENTIC_OPTIONS: [
        { id: 0, title: "Chưa xác thực" },
        { id: 1, title: "Đã xác thực" },
      ],
      HISTORY_DATA: [],
      UNITS_DATA: [
        { id: 1, title: "Cái" },
        { id: 2, title: "Đôi" },
        { id: 3, title: "Thùng" },
        { id: 4, title: "Hộp" },
        { id: 5, title: "Bộ" },
      ],
    };
  }

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    this.setState({ isLoaded: true });
    try {
      const result = await fetchData.productManagement.getAll();
      const dataFromApi = result.products || [];
      const mappedData = dataFromApi.map((item) => ({
        ...item,
        title: item.productName,
        unit: item.unitName,
        islocked: item.islocked,
        authentic: item.isProduct ? 1 : 0,
        parentID: item.parentID || "",
      }));

      const collapseList = mappedData.map((item) => ({
        id: item.id,
        collapse: false,
      }));

      const newData = handleGenTree(mappedData, "title");
      newData.forEach((item, key) => {
        item.index = key + 1;
      });

      const { limit } = this.state;
      this.setState({
        data: newData,
        listLength: newData.length,
        totalPage: Math.ceil(newData.length / limit),
        collapseList,
        isLoaded: false,
      });
    } catch (error) {
      console.error("Fetch ProductManagement error:", error);
      this.setState({ isLoaded: false });
      openAlertContext("Lỗi khi lấy dữ liệu sản phẩm");
    }
  };

  handlePageClick = (data) => {
    const { limit } = this.state;
    const selected = data.selected;
    const beginItem = selected * limit;
    const endItem = beginItem + limit;
    const totalElement = Math.min(endItem, this.state.data.length);
    this.setState({
      beginItem,
      endItem,
      currentPage: selected + 1,
      totalElement,
    });
  };

  toggle = (el, val) => {
    const { collapseList } = this.state;
    collapseList
      .filter((item) => item.id === val)
      .forEach((item) => (item.collapse = !item.collapse));
    this.setState({ collapseList });
  };

  onShowDetail = (item) => {
    this.setState({
      editId: item.id,
      isShowForDetail: true,
      isShowForHistoryList: false,
      dataInsert: { ...item },
    });
  };

  onShowHistoryModal = (item) => {
    this.setState({
      editId: item.id,
      isShowForHistoryList: true,
      isShowForDetail: false,
      HISTORY_DATA: item.history || [],
    });
  };

  onCloseModal = () => {
    this.setState({
      isShowForDetail: false,
      isShowForHistoryList: false,
      editId: null,
      dataInsert: {},
    });
  };

  showTitleWithAuthentic = (id) => {
    const { AUTHENTIC_OPTIONS } = this.state;
    const item = AUTHENTIC_OPTIONS.find((x) => x.id === Number(id));
    return item ? item.title : "";
  };
  showLockButton = (item) => {
    const isLocked = item.islocked === true;
    const btnClass = isLocked
      ? "btn btn-danger btn-sm"
      : "btn btn-success btn-sm";
    const btnText = isLocked ? "Đã khóa" : "Chưa khóa";

    return (
      <button className={btnClass} onClick={() => this.toggleLock(item)}>
        {btnText}
      </button>
    );
  };

  toggleLock = async (item) => {
    if (item.islocked) {
      openAlertContext("Sản phẩm đã khóa, không thể chỉnh sửa");
      return;
    }

    const confirmLock = window.confirm(
      `Bạn có chắc muốn khóa sản phẩm "${item.title}" không?`
    );
    if (!confirmLock) return;

    try {
      const result = await fetchData.productManagement.updateLock(item.id);
      if (result.success) {
        setAlertContext("Khóa sản phẩm thành công");
        this.fetchSummary();
      } else {
        openAlertContext(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      openAlertContext("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  renderTable = (data) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let sttBase = beginItem;

    data
      .filter((_, key) => key >= beginItem && key < endItem)
      .forEach((e) => {
        const renderClass =
          e.parentID.length === 0
            ? `${classes.treeParent}`
            : `${classes.treeChild}`;
        list.push(
          <tr key={e.id}>
            <td className={renderClass}>{sttBase + 1}</td>
            <td className="table-scale-col">
              <img
                src={e.icon || NoImg}
                style={{ width: 82, height: 82 }}
                alt="..."
              />
            </td>
            <td style={{ textAlign: "left" }}>
              <span style={{ fontSize: 14 }}>Tên: {e.title}</span>
              <br />
              <span style={{ fontSize: 14 }}>Đơn vị: {e.unit}</span>
            </td>
            <td>{this.showLockButton(e)}</td>
            <td>{this.showTitleWithAuthentic(e.authentic)}</td>
            <td>
              {collapseList
                .filter((item) => item.id === e.id)
                .map((ele, key) => (
                  <ButtonDropdown
                    key={key}
                    isOpen={ele.collapse}
                    toggle={() => this.toggle(key, e.id)}
                  >
                    <DropdownToggle>
                      <img src={MenuButton} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => this.onShowDetail(e)}>
                        Xem chi tiết
                      </DropdownItem>
                      <DropdownItem onClick={() => this.onShowHistoryModal(e)}>
                        Xem lịch sử
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                ))}
            </td>
          </tr>
        );
        sttBase++;
      });

    return list;
  };

  render() {
    const {
      data,
      isLoaded,
      listLength,
      totalPage,
      totalElement,
      isShowForDetail,
      isShowForHistoryList,
      editId,
      errorInserts,
      HISTORY_DATA,
    } = this.state;

    return (
      <Container fluid className={classes.wrapper}>
        {isLoaded ? (
          <Spinner
            style={{
              width: "3rem",
              height: "3rem",
              display: "block",
              margin: "auto",
            }}
          />
        ) : (
          <Row>
            <div className="col">
              <HeaderTable
                moduleTitle={
                  isShowForDetail
                    ? "Chi tiết sản phẩm"
                    : isShowForHistoryList
                    ? "Lịch sử sản phẩm"
                    : "Danh sách sản phẩm"
                }
                hideSearch={true}
                isShowForEdit={isShowForDetail || isShowForHistoryList}
                closeForm={this.onCloseModal}
                moduleBody={
                  <div>
                    {isShowForDetail ? (
                      <ShowEditData
                        id={editId}
                        errors={errorInserts}
                        onHandleChangeValue={() => {}}
                      />
                    ) : isShowForHistoryList ? (
                      <ShowHistoryData id={editId} historyData={HISTORY_DATA} />
                    ) : null}
                  </div>
                }
              />

              <Card className="shadow">
                <Table
                  responsive
                  className="align-items-center tablecs table-css-planting-zone"
                >
                  <HeadTitleTable headerTitle={PRODUCT_MANAGEMENT} />
                  <tbody>{this.renderTable(data)}</tbody>
                </Table>
              </Card>

              <Pagination
                data={data}
                listLength={listLength}
                totalPage={totalPage}
                totalElement={totalElement}
                handlePageClick={this.handlePageClick}
              />
            </div>
          </Row>
        )}
        <ToastContainer position="top-center" autoClose={3000} />
      </Container>
    );
  }
}

export default ProductManagement;
