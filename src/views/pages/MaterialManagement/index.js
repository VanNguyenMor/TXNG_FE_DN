import React, { Component } from "react";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { MATERIAL_MANAGEMENT } from "../../../helpers/constant";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import { LIMIT_ITEM_IN_PAGE } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import ShowHistoryData from "./ShowHistoryData.js";
import ShowEditData from "./ShowEditData.js";
import { toast, ToastContainer } from "react-toastify";
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

class MaterialManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // state list
      data: [],
      materialGroup: [],
      nations: [],

      // state use
      isLoaded: null,
      open: false,
      editId: null,
      isShowForHistoryList: false,
      isShowForDetail: false,
      isModalOpen: false,
      dataInsert: {},
      errorInserts: {},
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      collapseList: [],
      HISTORY_DATA: [],
      STATUS_OPTIONS: [
        { id: 0, title: "Chưa khóa" },
        { id: 1, title: "Đã khóa" },
      ],
      AUTHENTIC_OPTIONS: [
        { id: 0, title: "Chưa xác thực" },
        { id: 1, title: "Đã xác thực" },
      ],
      MATERIAL_TYPE_DATA: [
        { id: 1, title: "Loại thông thường" },
        { id: 2, title: "Loại đặc biệt" },
      ],

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
    this.onFetchMaterialGroup();
    this.onFetchNationGroup();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      this.openDetailById(id);
    }
  }

  openDetailById = async (id) => {
    try {
      this.setState({ isLoaded: true });
      const allMaterials = await fetchData.materialManagement.getAll();
      const material = allMaterials.materials.find((m) => m.id === id);

      if (material) {
        this.setState({
          editId: material.id,
          isShowForDetail: true,
          isShowForHistoryList: false,
          dataInsert: {
            ...material,
            title: material.materialName,
            unit: material.unitName,
            islocked: material.islocked ? true : false,
            authentic: material.isProduct ? 1 : 0,
            typeId: material.materialType,
            parentID: material.parentID || "",
          },
          isModalOpen: true,
          isLoaded: false,
        });
      } else {
        openAlertContext("Nguyên vật liệu không tồn tại");
        this.setState({ isLoaded: false });
      }
    } catch (error) {
      console.error(error);
      openAlertContext("Lỗi khi lấy dữ liệu chi tiết");
      this.setState({ isLoaded: false });
    }
  };

  onFetchMaterialGroup = async () => {
    const result = await fetchData.materialManagement.getGroupList();
    const dataFromApi = result.materialGroups;
    this.setState((prevState) => ({
      ...prevState,
      materialGroup: dataFromApi,
    }));
  };

  onFetchNationGroup = async () => {
    const result = await fetchData.materialManagement.getNationList();
    const dataFromApi = result;
    this.setState((prevState) => ({
      ...prevState,
      nations: dataFromApi,
    }));
  };

  fetchSummary = async () => {
    this.setState({ isLoaded: true });
    try {
      const result = await fetchData.materialManagement.getAll();
      const dataFromApi = result.materials || [];
      console.log(dataFromApi, "data real");
      const mappedData = dataFromApi.map((item) => ({
        ...item,
        title: item.materialName,
        unit: item.unitName,
        islocked: item.islocked ? true : false,
        authentic: item.isProduct ? 1 : 0,
        typeId: item.materialType,
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
      console.error("Fetch MaterialManagement error:", error);
      this.setState({ isLoaded: false });
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

  checkDataInsert = () => {
    const { dataInsert } = this.state;
    const errorInserts = {};
    if (!dataInsert.title)
      errorInserts.title = "Tên vật liệu không được bỏ trống";
    return errorInserts;
  };

  onHandleChangeValue = (data) => {
    this.setState(
      (prevState) => ({
        dataInsert: {
          ...prevState.dataInsert,
          ...data,
        },
      }),
      () => {
        const errorInserts = this.checkDataInsert();
        this.setState({ errorInserts });
      }
    );
  };

  onConfirm = async (toggleModal) => {
    const { dataInsert } = this.state;
    console.log("Data insert trước khi gửi:", dataInsert);

    if (!dataInsert.materialNameVal) {
      openAlertContext("Tên vật liệu không được để trống");
      return;
    }
    if (!dataInsert.materialTypeId) {
      openAlertContext("Loại vật liệu không được để trống");
      return;
    }
    if (!dataInsert.materialGroupTypeId) {
      openAlertContext("Nhóm vật liệu không được để trống");
      return;
    }

    try {
      const formData = new FormData();

      if (dataInsert.id) {
        formData.append("Id", dataInsert.id);
      }

      formData.append("MaterialCode", dataInsert.materialCodeVal || "");
      formData.append("MaterialName", dataInsert.materialNameVal || "");
      formData.append("TradeName", dataInsert.tradeNameVal || "");

      formData.append("MaterialType", dataInsert.materialTypeId);

      formData.append("MaterialGroupID", dataInsert.materialGroupTypeId || "");

      if (dataInsert.originId) {
        formData.append("OriginID", dataInsert.originId);
      }

      formData.append("UnitID", dataInsert.unitVal || "");
      formData.append("UnitName", dataInsert.unitName || "");
      formData.append("Recommended", dataInsert.recommendedVal || "");

      if (dataInsert.file && dataInsert.file instanceof File) {
        formData.append("Images", dataInsert.file);
      }

      if (
        dataInsert.productConversionUnits &&
        dataInsert.productConversionUnits.length > 0
      ) {
        dataInsert.productConversionUnits.forEach((unit, index) => {
          formData.append(
            `ProductConversionUnits[${index}][Id]`,
            unit.id || unit.unitID || ""
          );
          formData.append(
            `ProductConversionUnits[${index}][UnitName]`,
            unit.unitName || ""
          );
          formData.append(
            `ProductConversionUnits[${index}][Value]`,
            unit.conversionRate || 0
          );
          formData.append(
            `ProductConversionUnits[${index}][IsMain]`,
            unit.isPrimary || false
          );
        });
      }

      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      let result;
      if (dataInsert.id) {
        if (dataInsert.islocked) {
          toast.error("Nguyên vật liệu đã khóa");
        } else {
          result = await fetchData.materialManagement.update(formData);
        }
      } else {
        result = await fetchData.materialManagement.create(formData);
      }

      if (result.success) {
        setAlertContext("Thao tác thành công");
        this.fetchSummary();
        toggleModal && toggleModal();
        this.onCloseModal();
      } else {
        let msg = result.message || "Có lỗi xảy ra";
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          if (firstErrorKey) msg = result.errors[firstErrorKey][0];
        }
        openAlertContext(msg);
      }
    } catch (error) {
      console.error(error);
      openAlertContext("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  toggle = (el, val) => {
    const { collapseList } = this.state;
    collapseList
      .filter((item) => item.id === val)
      .forEach((item) => (item.collapse = !item.collapse));
    this.setState({ collapseList });
  };

  onShowDetail(item) {
    this.setState({
      editId: item.id,
      isShowForDetail: true,
      isShowForHistoryList: false,
      dataInsert: { ...item },
      isModalOpen: true,
    });
  }

  handleLoadDetailData = (dataInsertFromChild) => {
    this.setState({ dataInsert: dataInsertFromChild });
  };
  onShowHistoryModal(item) {
    this.setState({
      editId: item.id,
      isShowForHistoryList: true,
      isShowForDetail: false,
      HISTORY_DATA: item.history || [],
      isModalOpen: true,
    });
  }
  onCloseModal = () => {
    this.setState({
      isShowForDetail: false,
      isShowForHistoryList: false,
      isModalOpen: false,
      editId: null,
      dataInsert: {},
    });
  };

  onShowBlockProductModal(item) {
    this.setState({
      warningBlockProductModal: true,
      blockProductId: item.id,
      blockProductTitle: item.title,
    });
  }

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];

    let sttBase = beginItem;

    const cb = (e) => {
      const renderClass =
        e.parentID.length === 0
          ? `${classes.treeParent}`
          : `${classes.treeChild}`;

      list.push(
        <tr
          key={e.id}
          parentid={e.parentID}
          currentid={e.id}
          className="table-hover-css"
        >
          <td className={renderClass}>{sttBase + 1}</td>
          <td className="table-scale-col">
            <img
              src={e.images || NoImg}
              style={{ width: 82, height: 82 }}
              alt="..."
            />
          </td>
          <td className="table-scale-col" style={{ textAlign: "left" }}>
            <span style={{ fontSize: "14px" }}>Tên: {e.title}</span>
            <br />
            <span style={{ fontSize: "14px" }}>
              Thuộc nhóm: {e.materialGroupName}
            </span>
            <br />
            <span style={{ fontSize: "14px" }}>Đơn vị: {e.unit}</span>
          </td>
          <td>{this.showLockButton(e)}</td>
          <td>{this.showTitleWithAuthentic(e.authentic)}</td>
          <td>{this.showTitleWithType(e.typeId)}</td>
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
                    {isDisableEdit ? null : (
                      <DropdownItem onClick={() => this.onShowDetail(e)}>
                        Xem chi tiết
                      </DropdownItem>
                    )}
                    {isDisableEdit ? null : (
                      <DropdownItem onClick={() => this.onShowHistoryModal(e)}>
                        Xem lịch sử
                      </DropdownItem>
                    )}
                    {e.islocked ? null : (
                      <DropdownItem
                        onClick={() => this.showLockButton(e)}
                      >
                        Khóa vật liệu
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </ButtonDropdown>
              ))}
          </td>
        </tr>
      );
      sttBase++;
      e.children && e.children.forEach(cb);
    };

    data.filter((_, key) => key >= beginItem && key < endItem).forEach(cb);
    return list;
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
      openAlertContext("Nguyên vật liệu đã khóa, không thể chỉnh sửa");
      return;
    }

    const confirmLock = window.confirm(
      `Bạn có chắc muốn khóa nguyên vật liệu "${item.title}" không?`
    );
    if (!confirmLock) return;

    try {
      const result = await fetchData.materialManagement.updateLock(item.id);

      if (result.success) {
        setAlertContext("Khóa nguyên vật liệu thành công");
        this.fetchSummary();
      } else {
        openAlertContext(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      openAlertContext("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  showTitleWithAuthentic = (id) => {
    const { AUTHENTIC_OPTIONS } = this.state;
    const item = AUTHENTIC_OPTIONS.find((x) => x.id === Number(id));
    return item ? item.title : "";
  };

  showTitleWithType = (id) => {
    const { MATERIAL_TYPE_DATA } = this.state;
    const item = MATERIAL_TYPE_DATA.find((x) => x.id === Number(id));
    return item ? item.title : "";
  };

  render() {
    const {
      isLoaded,
      data,
      errorInserts,
      editId,
      isShowForDetail,
      isShowForHistoryList,
      isModalOpen,
      materialGroup,
      nations,
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
                    ? "Chi tiết nguyên vật liệu"
                    : isShowForHistoryList
                    ? "Lịch sử nguyên vật liệu"
                    : "Thêm mới nguyên vật liệu"
                }
                hideSearch={true}
                isShowForEdit={
                  isShowForDetail || isShowForHistoryList || isModalOpen
                }
                isReadOnly={this.state.dataInsert?.islocked === true || isShowForHistoryList}
                closeForm={this.onCloseModal}
                moduleBody={
                  <div>
                    {isShowForDetail ? (
                      <ShowEditData
                        id={editId}
                        errors={errorInserts}
                        onHandleChangeValue={this.onHandleChangeValue}
                        isShowForDetail={isShowForDetail}
                        materialGroup={materialGroup}
                        nations={nations}
                        UNITS_DATA={this.state.UNITS_DATA}
                        MATERIAL_TYPE_DATA={this.state.MATERIAL_TYPE_DATA}
                        onLoadDetailData={this.handleLoadDetailData}
                      />
                    ) : isShowForHistoryList ? (
                      <ShowHistoryData
                        id={editId}
                        errors={errorInserts}
                        onHandleChangeValue={this.onHandleChangeValue}
                        historyData={this.state.HISTORY_DATA}
                      />
                    ) : (
                      <ShowEditData
                        errors={errorInserts}
                        onHandleChangeValue={this.onHandleChangeValue}
                        materialGroup={materialGroup}
                        nations={nations}
                        UNITS_DATA={this.state.UNITS_DATA}
                        MATERIAL_TYPE_DATA={this.state.MATERIAL_TYPE_DATA}
                      />
                    )}
                  </div>
                }
                onConfirm={this.onConfirm}
              />

              <Card className="shadow">
                <Table
                  responsive
                  className="align-items-center tablecs table-css-planting-zone"
                >
                  <HeadTitleTable headerTitle={MATERIAL_MANAGEMENT} />
                  <tbody>{this.renderTable(data, false, false)}</tbody>
                </Table>
              </Card>

              <Pagination
                data={data}
                listLength={this.state.listLength}
                totalPage={this.state.totalPage}
                totalElement={this.state.totalElement}
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

export default MaterialManagement;
