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
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
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
import Fancybox from "../../../components/FancyBox";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
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
      district: [],
      districtList: [],
      province: [],
      ward: [],
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
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null,
      popupMessage: null,
    };
  }

  componentWillMount() {
    const { getListTypeZoneProperty } = this.props;
    /* Fetch Summary */
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

  // componentDidUpdate() {
  // 	// This method is called when the route parameters change
  // 	this.closeStatusModal();
  // }

  fetchSummary = (data) => {
    const { getListPlantingZone } = this.props;

    this.setState({ isLoaded: true });

    getListPlantingZone(data).then((res) => {
      const { limit } = this.state;
      let collapseList = [];
      const data = (res.data || {}).data || {};
      const _plantingZones = data.plantingZones || [];

      let newData = _plantingZones;

      newData.map((item) =>
        collapseList.push({ id: item.id, collapse: false })
      );

      newData.map((item, key) => {
        item["parentID"] = item.parentID === null ? "" : item.parentID;
      });

      newData = handleGenTree(_plantingZones, "name");

      newData.map((item, key) => {
        item["index"] = key + 1;
      });

      const total = data.total || 0;
      const length = newData.length;

      this.setState({
        data: newData,
        listLength: total,
        totalPage: Math.ceil(length / limit),
        isLoaded: false,
        collapseList: collapseList,
      });
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
    this.clearFilter();
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
    const districtId = dataInsert.districtId;
    const wardId = dataInsert.wardId;
    const gpsNew = dataInsert.gpsNew;

    const errorInserts = {};

    if (!name) {
      errorInserts.name = "Tên vùng sản xuất không được bỏ trống";
    }

    if (plantingZoneId) {
    } else {
      if (!districtId) {
        errorInserts.districtId = "Quận/Huyện không được bỏ trống";
      }
      if (!wardId) {
        errorInserts.wardId = "Phường/Xã không được bỏ trống";
      }
      // if (!gps) {
      //   errorInserts.gps = 'GPS không được bỏ trống';
      // }
    }

    if (gpsNew.length < 3) {
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

    // if (!gps && !plantingZoneId) {
    // 	errorInserts.gps = 'GPS không được bỏ trống';
    // }

    // if (!round) {
    //   errorInserts.round = 'Phạm vi (Bán kính) không được bỏ trống';
    // }

    // if (!unitIdRound) {
    //   errorInserts.unitIdRound = 'Đơn vị đo Bán kính không được bỏ trống';
    // }

    // if (!bad) {
    //   errorInserts.bad = 'Dung sai không được bỏ trống';
    // }

    // if (!unitIdBad) {
    //   console.log(this.state);
    //   errorInserts.unitIdBad = 'Đơn vị Dung sai không được bỏ trống';
    // }

    return errorInserts;
  };

  onConfirm = (toggleModal, closePopup) => {
    const { dataInsert } = this.state;
    const formData = new FormData();
    const name = dataInsert.name;
    const plantingTypeId = dataInsert.plantingTypeId;
    const plantingZoneId = dataInsert.plantingZoneId;
    const gps = dataInsert.gps;
    const round = dataInsert.round;
    const districtId = dataInsert.districtId;
    const wardId = dataInsert.wardId;
    const bad = dataInsert.bad;
    const unitIdRound = dataInsert.unitIdRound;
    const unitIdBad = dataInsert.unitIdBad;
    const id = dataInsert.id;
    const gpsNew = dataInsert.gpsNew;
    const icon = dataInsert.icon;
    const iconFile = dataInsert.iconFile;
    const errorInserts = this.checkDataInsert(true);
    const color = dataInsert.color;
    const imagesFile = dataInsert.mfileImg;
    const images = dataInsert.fileImage;

    formData.append("ID", id);
    formData.append("Name", name);
    formData.append("PlantingTypeID", plantingTypeId);
    formData.append("DistrictID", districtId);
    formData.append("WardID", wardId);
    formData.append("Color", color ? color : "");
    formData.append("Images", images ? images : "");
    if (imagesFile) {
      for (let i = 0; i < imagesFile.length; i++) {
        formData.append(`ImagesFile`, imagesFile ? imagesFile[i] : null);
      }
    }
    if (iconFile) {
      formData.append("IconFile", iconFile);
    } else {
      formData.append("Icon", icon ? icon : "");
    }
    if (gpsNew) {
      for (let i = 0; i < gpsNew.length; i++) {
        formData.append(`GPSNew`, gpsNew[i].content);
      }
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        errorInserts,
      };
    });

    if (Object.keys(errorInserts).length > 0) {
      return;
    }

    if (id) {
      this.props.editPlantingZone(formData).then((res) => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(
            JSON.stringify({
              search: "",
              filter: "",
              orderBy: "",
              page: null,
              limit: null,
            })
          );

          if (toggleModal) {
            toggleModal();
          }

          this.setState((previousState) => {
            return {
              ...previousState,
              isShowForEdit: false,
              editId: null,
              message: "Sửa vùng sản xuất thành công",
            };
          });
        } else {
          const message = getErrorMessageServer(res);

          this.setState({ message: message || "Sửa vùng sản xuất thất bại" });

          this.toggleModal("popupMessage");
        }
      });
    } else {
      this.props.addPlantingZone(formData).then((res) => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(
            JSON.stringify({
              search: "",
              filter: "",
              orderBy: "",
              page: null,
              limit: null,
            })
          );

          if (toggleModal) {
            toggleModal();
          }
          if (closePopup != "closePopup") {
            this.toggleModal("createNewModal");
          }
          this.setState({ message: "Thêm vùng sản xuất thành công" });
          // Message.show(TYPES.SUCCESS, 'Thông báo', 'Thêm vùng sản xuất thành công');
          // this.toggleModal('popupMessage');
        } else {
          const message = getErrorMessageServer(res);

          // Message.show(TYPES.ERROR, 'Thông báo', message || 'Thêm vùng sản xuất thất bại');
          this.setState({ message: message || "Thêm vùng sản xuất thất bại" });
          this.toggleModal("popupMessage");
        }
      });
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

  handleDeleteRow = () => {
    this.props.deletePlantingZone({ id: this.state.deleteId }).then((res) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          warningPopupModal: false,
        };
      });

      const data = res.data;

      if (data.status == 200) {
        this.fetchSummary(
          JSON.stringify({
            search: "",
            filter: "",
            orderBy: "",
            page: null,
            limit: null,
          })
        );

        this.setState({ message: "Xóa vùng sản xuất thành công" });
        toast.success("Xoá vùng sản xuất thành công!");
      } else {
        const message = getErrorMessageServer(res);

        this.setState({ message: message || "Xóa vùng sản xuất thất bại" });
        this.toggleModal("popupMessage");
      }
    });
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
    let autoIndex = 0;

    data.filter((item, key) => key >= beginItem && key < endItem);
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
          {/* <td><span>{e.plantingTypeName}</span> </td> */}
          {/* <td>
            <Fancybox>
              <p>
                <a
                  href={'https://maps.google.com/maps?q=' +
                    e.gps +
                    '&hl=es;z=14' +
                    '&output=embed'}
                  data-fancybox
                  data-type="iframe"
                  data-preload="false"
                  data-width="640"
                  data-height="480"
                  arrows="false"
                >
                  <span>{e.gps}</span>
                </a>
              </p>
            </Fancybox>
          </td> */}
          {/* <td>{e.gpsAddress}</td> */}
          {/* <td>
            {e.gpSs && e.gpSs.split(';').filter(p => p != '').map((x, key) =>
              <>
                <span><b>{key + 1}</b>{') ' + x}</span><br />
                <Fancybox>
                  <p>
                    <a
                      href={'https://maps.google.com/maps?q=' +
                        x +
                        '&hl=es;z=14' +
                        '&output=embed'}
                      data-fancybox
                      data-type="iframe"
                      data-preload="false"
                      data-width="640"
                      data-height="480"
                      arrows="false"
                    >
                      <span><b>{key + 1}</b>{') ' + x}</span>
                    </a>
                  </p>
                </Fancybox>
              </>
            )}
          </td> */}
          {/* <td>{e.gpSs}</td> */}
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
                            Sửa
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

    data.forEach(cb);
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
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      createNewModal,
      popupMessage,
      activeCreateSubmit,
      dataTypeZone,
    } = this.state;

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
                                Loại vùng sản xuất
                              </label>
                              <div>
                                <Select
                                  name="filter"
                                  title="Chọn loại vùng sản xuất"
                                  data={dataTypeZone}
                                  labelName="name"
                                  val="id"
                                  handleChange={this.handleChangeSelectFilter}
                                />
                              </div>
                            </div>
                            <div className="mg-div-search">
                              <label className="form-control-label">
                                Tên vùng
                              </label>
                              <div>
                                <Input
                                  name="search"
                                  className="css-search-input"
                                  placeholder="Tên vùng"
                                  type="text"
                                  autoFocus={true}
                                  onChange={(event) =>
                                    this.handleChangeFilter(event)
                                  }
                                />
                              </div>
                            </div>
                            <div className="mg-btn">
                              <label className="form-control-label">
                                &nbsp;
                              </label>
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
                          {
                            Array.isArray(data) &&
                              this.renderTable(
                                data,
                                isDisableEdit,
                                isDisableDelete
                              )
                            // data
                            // 	.filter((item, key) => key >= beginItem && key < endItem)
                            // 	.map((item, key) => (
                            // 		<tr key={key}>
                            // 			<td>{item.index}</td>
                            // 			<td style={{ textAlign: 'left' }}>{item.name}</td>
                            // 			<td>
                            // 				{isDisableEdit == true && isDisableDelete == true ? null : (
                            // 					<ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                            // 						<DropdownToggle>
                            // 							<img src={MenuButton} />
                            // 						</DropdownToggle>

                            // 						<DropdownMenu>
                            // 							{isDisableEdit == false ? (
                            // 								<DropdownItem
                            // 									onClick={this.onEditZone(item)}
                            // 								>
                            // 									Sửa
                            // 								</DropdownItem>
                            // 							) : null}
                            // 							{isDisableEdit == true || isDisableDelete == true ? null : (
                            // 								<DropdownItem divider />
                            // 							)
                            // 							}
                            // 							{isDisableDelete == false ? (
                            // 								<DropdownItem
                            // 									onClick={this.onDeleteZone(item.id)}
                            // 								>
                            // 									Xoá
                            // 								</DropdownItem>
                            // 							) : null}
                            // 						</DropdownMenu>
                            // 					</ButtonDropdown>
                            // 				)}
                            // 			</td>
                            // 		</tr>
                            // 	))
                          }
                        </tbody>
                      </Table>
                    </Card>

                    {/* Pagination */}
                    {/* {
												// Page of Table
												Array.isArray(data) > 0 && (
													<Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
												)
											} */}
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
              handleWarning={this.handleDeleteRow}
            />

            <CreateNewPopup
              createNewModal={createNewModal}
              moduleTitle="Thêm vùng sản xuất"
              type100={true}
              moduleBody={
                <InsertOrUpdate
                  id={editId}
                  errors={errorInserts}
                  onHandleChangeValue={this.onHandleChangeValue}
                />
              }
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              onConfirm={(data, close) => {
                this.onConfirm(data, close);
              }}
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
