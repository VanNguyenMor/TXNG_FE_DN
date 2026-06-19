import React, { Component } from "react";
import compose from "recompose/compose";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLANTING_ZONE } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import classes from "./index.module.css";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { handleGenTree } from "../../../helpers/trees";
import Select from "../../../components/Select";
import $ from "jquery";
import "./PlantingZone.css";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { fetchData } from "helpers/fetchData.js";

class PlantingZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: "",
      history: [],
      roles: [],
      zones: [],
      editStatus: true,
      provinceIDCurrent: null,
      headerTitle: PLANTING_ZONE,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      },
      rawZones: [],
      searchName: "",
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
      zoneRoleModal: false,
      zoneRoleRow: null,
      allRoles: [],
      assignedRoles: [],
      zoneRoleLoading: false,
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    this.fetchSummary(
      JSON.stringify({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      })
    );

    getListTypeZoneProperty({
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    }).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          dataTypeZone: ((res.data || {}).data || {}).plantingTypes || [],
        };
      });
    });
  }

  // Dựng cây cha-con từ danh sách phẳng các vùng sản xuất.
  // Clone từng item để không làm hỏng parentID của dữ liệu gốc khi lọc nhiều lần.
  buildTreeData = (zones) => {
    const cloned = (zones || []).map((z) => ({ ...z }));

    cloned.forEach((item) => {
      item.parentID = item.parentID === null ? "" : item.parentID;
    });

    // Nâng các item "mồ côi" (cha không nằm trong tập hiện tại) lên thành node gốc
    // để chúng vẫn hiển thị thay vì bị handleGenTree loại bỏ.
    const idSet = new Set(cloned.map((item) => item.id));
    cloned.forEach((item) => {
      if (item.parentID && !idSet.has(item.parentID)) {
        item.parentID = "";
      }
    });

    const tree = handleGenTree(cloned, "name");

    tree.forEach((item, key) => {
      item["index"] = key + 1;
    });

    return tree;
  };

  fetchSummary = (data) => {
    const { getListPlantingZone } = this.props;

    this.setState({ isLoaded: true });

    getListPlantingZone(data).then((res) => {
      const { limit } = this.state;
      const resData = (res.data || {}).data || {};
      const _plantingZones = resData.plantingZones || [];

      const collapseList = _plantingZones.map((item) => ({
        id: item.id,
        collapse: false,
      }));

      const tree = this.buildTreeData(_plantingZones);

      this.setState({
        rawZones: _plantingZones,
        searchName: "",
        data: tree,
        listLength: tree.length,
        totalPage: Math.ceil(tree.length / limit),
        totalElement: Math.min(limit, tree.length),
        isLoaded: false,
        collapseList: collapseList,
        beginItem: 0,
        endItem: limit,
        currentPage: 0,
      });
    });
  };

  // Lọc theo tên vùng trên dữ liệu đã tải sẵn (client-side, không gọi API).
  handleSearchName = (event) => {
    const searchName = event.target.value;
    const { rawZones } = this.state;
    const keyword = (searchName || "").toLowerCase().trim();

    const filtered = keyword
      ? (rawZones || []).filter((z) =>
          (z.name || "").toLowerCase().includes(keyword)
        )
      : rawZones || [];

    this.setState({
      searchName,
      data: this.buildTreeData(filtered),
    });
  };

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  };

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;

    this.state.data.map(
      (item, key) => key >= beginItem && key < endItem && total++
    );

    if (selected > 0) {
      total = selected * limit + total;
    } else total = total;

    this.setState({
      beginItem: beginItem,
      endItem: endItem,
      currentPage: selected + 1,
      totalElement: total,
    });
  };

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev["name"]] = ev["value"];
    this.setState({ filter });
  };

  clearFilter = () => {
    let clearFilter = {
      search: "",
      filter: "",
      orderBy: "",
      page: null,
      limit: null,
    };
    this.setState({ filter: clearFilter });
  };

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  };

  handleSubmitSearchForm = () => {
    let { filter } = this.state;
    this.fetchSummary(JSON.stringify(filter));
  };

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
    } else {
      openModal();
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: false,
        editId: null,
      };
    });
  };
  toggle = (el, val) => {
    let { collapseList } = this.state;

    collapseList
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));

    this.setState({ collapseList });
  };
  checkDataInsert = (isCheck) => {
    if (!isCheck) {
      return {};
    }

    const { dataInsert, data, editId, currentRow } = this.state;
    const name = dataInsert.name;
    const plantingTypeId = dataInsert.plantingTypeId;
    const plantingZoneId = dataInsert.plantingZoneId;
    const gps = dataInsert.gps;
    const provinceId = dataInsert.provinceId;
    const gpsNew = dataInsert.gpsNew;

    const errorInserts = {};

    if (!name) {
      errorInserts.name = "Tên vùng sản xuất không được bỏ trống";
    }

    if (plantingZoneId) {
    } else {
      if (!provinceId) {
        errorInserts.provinceId = "Tỉnh/thành không được bỏ trống";
      }
    }

    if (gpsNew?.length < 3) {
      errorInserts.gps = "Nhập tối thiểu 3 GPS";
    }

    if (editId) {
      let flag = false;
      if (name) {
        if (
          name
            .toUpperCase()
            .trim()
            .indexOf(currentRow.name.toUpperCase().trim()) === -1
        ) {
          data
            .filter(
              (item) =>
                item.name.toUpperCase().trim() === name.toUpperCase().trim()
            )
            .map((item) => (flag = true));
        } else {
          flag = false;
        }
        if (flag == true) {
          errorInserts.name = "Tên vùng sản xuất này đã có";
        }
      }
    } else {
      if (name) {
        let flag = false;
        data
          .filter(
            (item) =>
              item.name.toUpperCase().trim() === name.toUpperCase().trim()
          )
          .map((item) => (flag = true));
        if (flag == true) {
          errorInserts.name = "Tên vùng sản xuất này đã có";
        }
      }
    }
    if (name && (name || "").length > 255) {
      errorInserts.name = "Tên vùng sản xuất nhập tối đa 255 ký tự";
    }

    if (!plantingTypeId) {
      errorInserts.plantingTypeId = "Loại vùng sản xuất không được bỏ trống";
    }

    return errorInserts;
  };

  handleLoadDetailData = (dataInsertFromChild) => {
    this.setState({ dataInsert: dataInsertFromChild });
  };

  onConfirm = (toggleModal, closePopup) => {
    const { dataInsert, editId } = this.state;
    const {
      name,
      plantingTypeId,
      plantingTypeAttribute,
      provinceId,
      wardId,
      gps,
      plantingZoneId,
      gpsNew,
      fileView,
      id,
    } = dataInsert;

    const errorInserts = this.checkDataInsert(true);
    const gpsNewArray = (gpsNew || [])
      .map((p) =>
        p.lat !== undefined && p.long !== undefined
          ? `${p.lat},${p.long}`
          : p.content
      )
      .filter(Boolean);

    const gpsString = gps?.lat && gps?.long ? `${gps.lat},${gps.long}` : "";
    const payload = {
      ID: editId || id,
      Name: name,
      FileView: "",
      PlantingTypeId: plantingTypeId,
      Attributes: JSON.stringify(plantingTypeAttribute),
      ProvinceId: provinceId || "",
      WardId: wardId || "",
      GpsNew: gpsNewArray,
      Gps: gpsString,
      PlantingZoneId: plantingZoneId,
    };

    this.setState((previousState) => {
      return {
        ...previousState,
        errorInserts,
      };
    });

    if (Object.keys(errorInserts).length > 0) {
      return;
    }
    if (editId) {
      this.updateZone(payload, toggleModal);
    } else {
      this.createZone(payload, toggleModal);
    }
  };
  updateZone = async (payload, toggleModal) => {
    const result = await fetchData.plantingZone.update(payload);

    if (result && result.status === 200) {
      toast.success("Cập nhật vùng sản xuất thành công!");
      this.setState({ isShowForEdit: false, editId: null });
      if (toggleModal) toggleModal();
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    } else {
      const errorMsg = (result && result.message) || "Cập nhật vùng sản xuất thất bại";
      toast.error(errorMsg);
    }
  };
  createZone = async (payload, toggleModal) => {
    const result = await fetchData.plantingZone.create(payload);

    if (result && result.status === 200) {
      toast.success("Tạo vùng sản xuất thành công!");
      if (toggleModal) toggleModal();
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    } else {
      const errorMsg = (result && result.message) || "Tạo vùng sản xuất thất bại";
      toast.error(errorMsg);
    }
  };

  deleteZone = async (id = this.state.deleteId) => {
    if (!id) return;

    const result = await fetchData.plantingZone.delete(id);

    this.toggleModalPopupDelete();

    if (result && (result.status === 200 || result.status === "200")) {
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
      toast.success("Xoá vùng sản xuất thành công!");
    } else {
      const errorMessage = (result && result.message) || "Xóa vùng sản xuất thất bại";
      toast.error(errorMessage);
    }
  };

  onHandleChangeValue = (data) => {
    this.setState(
      (previousState) => {
        return {
          ...previousState,
          dataInsert: data,
        };
      },
      () => {
        const errorInserts = this.checkDataInsert();

        this.setState((previousState) => {
          return {
            ...previousState,
            errorInserts,
          };
        });
      }
    );
  };

  onEditZone = (id) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowForEdit: true,
        editId: id.id,
        currentRow: id,
      };
    });
  };

  onDeleteZone = (id) => () => {
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

  onOpenZoneRole = (row) => async () => {
    this.setState({
      zoneRoleModal: true,
      zoneRoleRow: row,
      assignedRoles: [],
      allRoles: [],
      zoneRoleLoading: true,
    });

    const [assigned, all] = await Promise.all([
      fetchData.plantingZone.getListRoleByPlantingZone(row.id),
      fetchData.plantingZone.getListRolePlantingZone(),
    ]);

    this.setState({
      assignedRoles: Array.isArray(assigned) ? assigned : [],
      allRoles: Array.isArray(all) ? all : [],
      zoneRoleLoading: false,
    });
  };

  toggleZoneRoleModal = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        zoneRoleModal: false,
      };
    });
  };

  handleAddZoneRole = (value) => {
    if (!value) return;

    const { allRoles, assignedRoles } = this.state;

    if (assignedRoles.find((a) => a.roleid === value)) return;

    const role = allRoles.find((r) => r.id === value);
    if (!role) return;

    this.setState({
      assignedRoles: [
        ...assignedRoles,
        { id: `tmp-${value}`, roleid: role.id, rolename: role.name },
      ],
    });
  };

  removeZoneRole = (roleid) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        assignedRoles: previousState.assignedRoles.filter(
          (a) => a.roleid !== roleid
        ),
      };
    });
  };

  saveZoneRole = async () => {
    const { zoneRoleRow, assignedRoles } = this.state;
    if (!zoneRoleRow) return;

    const roles = assignedRoles.map((a) => ({
      id: a.roleid,
      name: a.rolename,
    }));

    const result = await fetchData.plantingZone.updatePermission({
      id: zoneRoleRow.id,
      roles,
    });

    if (result && result.status === 200) {
      toast.success("Phân quyền cho vùng sản xuất thành công!");
      this.fetchSummary(
        JSON.stringify({
          search: "",
          filter: "",
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    } else {
      const errorMsg =
        (result && result.message) || "Phân quyền cho vùng sản xuất thất bại";
      toast.error(errorMsg);
    }
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
      });
    }
  };

  renderTreeLine = (nodelv) => {
    let line = "";

    for (let i = 0; i < nodelv; i++) {
      line += "-";
    }

    return line;
  };

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, collapseList } = this.state;
    let list = [];
    let parentid = [];
    let autoIndex = beginItem;
    const pageData = data.filter((item, key) => key >= beginItem && key < endItem);

    data.forEach((e) => parentid.push(e.id));

    const cb = (e, key, array) => {
      const renderClass =
        e.parentID.length === 0
          ? `${classes.treeParent}`
          : `${classes.treeChild}${
              parentid.includes(e.parentID)
                ? ` ${classes.childs}`
                : ` ${classes.childsItem}`
            }`;
      list.push(
        <tr
          key={autoIndex}
          parentid={e.parentID}
          currentid={e.id}
          index={autoIndex}
          className="table-hover-css"
        >
          <td
            className={`className='table-scale-col table-user-col-1' ${renderClass}`}
          >
            {autoIndex + 1}
          </td>
          <td className="table-scale-col">
            <img
              style={{ width: 82, height: 82 }}
              src={e.icon ? e.icon : NoImg}
              alt="..."
            />
          </td>
          <td style={{ textAlign: "left" }} className={renderClass}>
            <span>{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}</span>
            <span style={{ color: `${e.color}` }}>
              <strong>{e.name}</strong>
            </span>
            <br />
            <span>
              Địa điểm:&nbsp;<i>{e.gpsAddress}</i>
            </span>
          </td>
          <td>
            {collapseList
              .filter((item) => item.id === e.id)
              .map((ele, key) => (
                <div key={key}>
                  {isDisableEdit == true && isDisableDelete == true ? null : (
                    <ButtonDropdown
                      isOpen={ele.collapse}
                      toggle={() => this.toggle(key, e.id)}
                    >
                      <DropdownToggle>
                        <img src={MenuButton} />
                      </DropdownToggle>
                      <DropdownMenu>
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onEditZone(e)}>
                            Xem chi tiết
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ? null : (
                          <DropdownItem onClick={this.onOpenZoneRole(e)}>
                            Chọn nhóm quyền
                          </DropdownItem>
                        )}
                        {isDisableEdit == true ||
                        isDisableDelete == true ? null : (
                          <DropdownItem divider />
                        )}
                        {isDisableDelete == true ? null : (
                          <DropdownItem onClick={this.onDeleteZone(e.id)}>
                            Xoá
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </ButtonDropdown>
                  )}
                </div>
              ))}
          </td>
        </tr>
      );
      autoIndex++;
      e.children && e.children.forEach(cb);
    };

    pageData.forEach(cb);
    return list;
  };

  render() {
    const {
      warningPopupModal,
      editId,
      isShowForEdit,
      errorInserts,
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      filter,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      dataTypeZone,
      provinces,
      searchName,
      zoneRoleModal,
      allRoles,
      assignedRoles,
      zoneRoleLoading,
      listLength,
      totalPage,
      totalElement,
      currentPage,
    } = this.state;

    const availableRoles = (allRoles || []).filter(
      (r) => !(assignedRoles || []).find((a) => a.roleid === r.id)
    );

    const statusPopup = { status: status, message: message };
    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage
        .getItem("ACCOUNT_CLAIM_FF")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Add").map(
        (y) => (isDisableAdd = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Edit").map(
        (y) => (isDisableEdit = false)
      );
      ACCOUNT_CLAIM_FF.filter((x) => x == "PlantingZones.Delete").map(
        (y) => (isDisableDelete = false)
      );
    }

    return (
      <>
        {
          <div className={classes.wrapper}>
            <Container fluid>
              {isLoaded ? (
                <div style={{ display: "table", margin: "auto" }}>
                  <Spinner style={{ width: "3rem", height: "3rem" }} />
                </div>
              ) : (
                <Row>
                  <div className="col">
                    {/* Header */}
                    <HeaderTable
                      dataReload={() =>
                        this.fetchSummary(
                          JSON.stringify({
                            search: "",
                            filter: "",
                            orderBy: "",
                            page: null,
                            limit: null,
                          })
                        )
                      }
                      hideSearch={true}
                      hideCreate={isDisableAdd == false ? false : true}
                      searchForm={
                        <SearchModal
                          filter={filter}
                          dataTypeZone={dataTypeZone}
                          handleChangeFilter={this.handleChangeFilter}
                          handleChangeSelectFilter={
                            this.handleChangeSelectFilter
                          }
                        />
                      }
                      moduleTitle={
                        isShowForEdit
                          ? "Sửa vùng sản xuất"
                          : "Thêm vùng sản xuất"
                      }
                      moduleBody={
                        <InsertOrUpdate
                          id={editId}
                          errors={errorInserts}
                          onHandleChangeValue={this.onHandleChangeValue}
                          provinces={provinces}
                          onLoadDetailData={this.handleLoadDetailData}
                        />
                      }
                      isShowForEdit={isShowForEdit}
                      handleModal={this.handleModal}
                      onConfirm={this.onConfirm}
                      handleSubmitSearchForm={() =>
                        this.handleSubmitSearchForm()
                      }
                      typeSearch={
                        <>
                          <div className="div_flex">
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Tên vùng
                              </label>
                              <div>
                                <Input
                                  name="searchName"
                                  className="css-search-input"
                                  placeholder="Tên vùng"
                                  type="text"
                                  value={searchName}
                                  autoFocus={true}
                                  onChange={(event) =>
                                    this.handleSearchName(event)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      }
                    />

                    {/* Table */}
                    <Card className="shadow">
                      <Table
                        className="align-items-center tablecs table-css-planting-zone"
                        responsive
                      >
                        <HeadTitleTable
                          headerTitle={headerTitle}
                          classHeaderColumns={{
                            0: "table-scale-col table-user-col-1",
                          }}
                        />
                        <tbody>
                          {Array.isArray(data) &&
                            this.renderTable(
                              data,
                              isDisableEdit,
                              isDisableDelete
                            )}
                        </tbody>
                      </Table>
                    </Card>

                    {/* Pagination */}
                    {Array.isArray(data) && data.length > 0 && (
                      <Pagination
                        data={data}
                        listLength={listLength}
                        totalPage={totalPage}
                        totalElement={totalElement}
                        handlePageClick={this.handlePageClick}
                        currentPage={currentPage > 0 ? currentPage - 1 : 0}
                      />
                    )}
                  </div>
                </Row>
              )}

              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>
            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý xóa thông tin này?
                </p>
              }
              warningPopupModal={warningPopupModal}
              toggleModal={this.toggleModalPopupDelete}
              handleWarning={this.deleteZone}
            />

            <WarningPopup
              moduleTitle="Phân quyền cho vùng sản xuất"
              moduleBody={
                <div style={{ minHeight: 220 }}>
                  {zoneRoleLoading ? (
                    <div style={{ display: "table", margin: "auto" }}>
                      <Spinner style={{ width: "2rem", height: "2rem" }} />
                    </div>
                  ) : (
                    <>
                      <label className="form-control-label">Nhóm quyền</label>
                      <Select
                        value=""
                        labelMark={null}
                        name="zoneRoleId"
                        title="Chọn nhóm quyền"
                        data={availableRoles}
                        labelName="name"
                        val="id"
                        handleChange={this.handleAddZoneRole}
                      />
                      <div style={{ marginTop: 12 }}>
                        {(assignedRoles || []).length === 0 ? (
                          <p style={{ textAlign: "center", color: "#8898aa" }}>
                            Chưa có nhóm quyền nào
                          </p>
                        ) : (
                          assignedRoles.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 12px",
                                marginBottom: 6,
                                background: "#f6f9fc",
                                borderRadius: 4,
                              }}
                            >
                              <span>{item.rolename}</span>
                              <Button
                                color="danger"
                                size="sm"
                                type="button"
                                style={{ margin: 0 }}
                                onClick={this.removeZoneRole(item.roleid)}
                              >
                                Xoá
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              }
              warningPopupModal={zoneRoleModal}
              toggleModal={this.toggleZoneRoleModal}
              handleWarning={this.saveZoneRole}
            />

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={message}
              toggleModal={this.toggleModal}
            />
            <ToastContainer position="top-center" autoClose={3000} />
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    zone: state.ZoneStore,
    PlantingZoneStore: state.PlantingZoneStore,
    TypeZoneProperty: state.TypeZonePropertyStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionZoneCreators, dispatch),
    ...bindActionCreators(typeZonePropertyAction, dispatch),
    ...bindActionCreators(areaDataAction, dispatch),
    ...bindActionCreators(platingZoneAction, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PlantingZone
);
