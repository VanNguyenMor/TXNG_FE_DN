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
import WarningPopup from "../../../components/WarningPopup";
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
      deleteId: null,
      deleteTitle: null,
      warningPopupModal: false,
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

      UNITS_DATA: [],
    };
  }

  componentDidMount() {
    this.fetchSummary();
    this.onFetchMaterialGroup();
    this.onFetchNationGroup();
    this.onFetchUnits();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      this.openDetailById(id);
    }
  }

  onFetchUnits = async () => {
    try {
      const result = await fetchData.materialManagement.getUnitAll();
      if (result) {
        console.log(result);
        const units = result.units.map((u) => ({
          id: u.id,
          title: u.unitName,
          isLocked: u.isLocked,
        }));
        this.setState({ UNITS_DATA: units });
      } else {
        this.setState({ UNITS_DATA: [] });
      }
    } catch (error) {
      console.error("Fetch units error:", error);
      this.setState({ UNITS_DATA: [] });
    }
  };

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

    if (!dataInsert.materialNameVal && !dataInsert.title)
      errorInserts.title = "Tên vật liệu không được bỏ trống";

    if (!dataInsert.materialGroupTypeId && !dataInsert.materialGroupID)
      errorInserts.materialGroupTypeId = "Bạn vui lòng chọn nhóm nguyên liệu";

    if (!dataInsert.unitVal && !dataInsert.unit)
      errorInserts.unitVal = "Bạn vui lòng chọn đơn vị tính mặc định";

    if (!dataInsert.originId && !dataInsert.originId)
      errorInserts.originId = "Bạn vui lòng chọn xuất xứ";

    const unitVal = dataInsert.unitVal || dataInsert.unit;
    const conv = dataInsert.productConversionUnits || [];
    if (conv.some((u) => String(u.id) === String(unitVal))) {
      errorInserts.productConversionUnits =
        "Đơn vị quy đổi không được trùng với đơn vị chính";
    }

    if ((conv.filter((u) => u.isReport).length || 0) > 1) {
      errorInserts.productConversionUnits = "Chỉ chọn 1 đơn vị làm báo cáo";
    }

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
    console.log(dataInsert, "dataInsert");
    try {
      const formData = new FormData();
      console.log(dataInsert);
      if (dataInsert.id) formData.append("Id", dataInsert.id);
      formData.append("MaterialCode", dataInsert.materialCodeVal || "");
      formData.append("MaterialName", dataInsert.materialNameVal || "");
      formData.append("TradeName", dataInsert.tradeNameVal || "");
      formData.append("MaterialType", dataInsert.materialType || "");
      formData.append("MaterialGroupID", dataInsert.materialGroupTypeId || "");
      formData.append("UnitID", dataInsert.unitVal || "");
      formData.append("UnitName", dataInsert.unitName || "");
      formData.append("Producer", dataInsert.producerId || "");
      formData.append("Quarantine", dataInsert.quarantine ?? "");

      formData.append("Recommended", dataInsert.recommendedVal || "");
      if (dataInsert.producerId)
        formData.append("ProducerID", dataInsert.producerId);

      formData.append("Origin", dataInsert.origin);

      if (dataInsert.file && dataInsert.file instanceof File) {
        formData.append("Images", dataInsert.file);
      }

      (dataInsert.productConversionUnits || []).forEach((unit, index) => {
        formData.append(`materialUnits[${index}][unitId]`, unit.id || "");
        formData.append(`materialUnits[${index}][name]`, unit.unitName || "");
        formData.append(
          `materialUnits[${index}][value]`,
          unit.conversionRate
            ? unit.conversionRate.toString().replace(".", ",")
            : "1"
        );
        formData.append(
          `materialUnits[${index}][isReport]`,
          unit.isReport ? true : false
        );
      });

      const result = dataInsert.id
        ? await fetchData.materialManagement.update(formData)
        : await fetchData.materialManagement.create(formData);

      if (result && result.status === 200) {
        const successMsg = dataInsert.id
          ? "Cập nhật thành công!"
          : "Thêm mới thành công!";
        toast.success(successMsg);
        toggleModal && toggleModal();
        this.fetchSummary();
      } else {
        const errorMessage = result?.message
          || (dataInsert.id
            ? "Cập nhật thất bại! Vui lòng thử lại."
            : "Thêm mới thất bại! Vui lòng thử lại.");
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      const errorMsg = error?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMsg);
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

  deleteMaterial = async (id = this.state.deleteId) => {
    if (!id) return;
    try {
      const result = await fetchData.materialManagement.delete(id);
      console.log("DEBUG deleteMaterial result =", result);

      if (result && result.status === 200) {
        toast.success("Xoá nguyên vật liệu thành công!");
        this.toggleModalPopupDelete();

        setTimeout(() => {
          this.fetchSummary();
        }, 500);
      } else {
        const errorMessage = result?.message || "Xóa nguyên vật liệu thất bại";
        toast.error(errorMessage);
        this.toggleModalPopupDelete();
      }
    } catch (error) {
      console.error("Lỗi xóa nguyên vật liệu:", error);
      toast.error("Lỗi xóa nguyên vật liệu, vui lòng thử lại!", {
        autoClose: 3000,
      });
      this.toggleModalPopupDelete();
    }
  };

  onDeleteMaterial = (id) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupModal: true,
        deleteId: id,
      };
    });
  };

  toggleModalPopupDelete = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        warningPopupModal: false,
      };
    });
  };

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
                      <DropdownItem onClick={() => this.toggleLock(e)}>
                        Khóa vật liệu
                      </DropdownItem>
                    )}
                    {e.islocked == true ? null : (
                      <DropdownItem onClick={this.onDeleteMaterial(e.id)}>
                        Xoá
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

      if (result) {
        toast.success("Khóa nguyên vật liệu thành công");
        await this.fetchSummary();
        this.setState({});
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
      UNITS_DATA,
      warningPopupModal,
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
                dataReload={this.fetchSummary}
                hideSearch={true}
                isShowForEdit={
                  isShowForDetail || isShowForHistoryList || isModalOpen
                }
                isReadOnly={
                  this.state.dataInsert?.islocked === true ||
                  isShowForHistoryList
                }
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
                        UNITS_DATA={UNITS_DATA}
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

        <WarningPopup
          moduleTitle="Thông báo"
          moduleBody={
            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
              Bạn đồng ý xóa sản phẩm này?
            </p>
          }
          warningPopupModal={warningPopupModal}
          toggleModal={this.toggleModalPopupDelete}
          handleWarning={this.deleteMaterial}
        />
      </Container>
    );
  }
}

export default MaterialManagement;
