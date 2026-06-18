import React, { Component } from "react";
import classes from "./index.module.css";
import { fetchData } from "helpers/fetchData";
import { VEHICLE as VEHICLE_HEADER, LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { getErrorMessageServer } from "utils/errorMessageServer.js";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import Select from "../../../components/Select";
import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import MenuButton from "../../../assets/img/buttons/menu.png";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import WarningPopup from "../../../components/WarningPopup";
import PopupMessage from "../../../components/PopupMessage";
import { generateStyleTableCol } from "../../../bases/controls/helper";
import "../../../assets/css/global/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  InputGroup,
  Button,
  Modal,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const VEHICLE_TYPE_OPTIONS = [
  { id: 0, name: "Đường bộ" },
  { id: 1, name: "Đường thủy" },
  { id: 2, name: "Hàng không" },
];

const emptyForm = {
  id: null,
  name: "",
  color: "",
  licensePlate: "",
  weight: "",
  type: 0,
  vehicleTypeId: "",
  image: "", // url ảnh hiện tại (khi sửa)
};

class Vehicle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: null,
      status: null,
      message: "",
      headerTitle: VEHICLE_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      totalPage: 0,
      collapseList: [],
      vehicleTypes: [],
      // Modal thêm/sửa
      formModal: false,
      isEdit: false,
      form: { ...emptyForm },
      fileToUpload: null,
      errors: {},
      // Xóa
      warningPopupModal: false,
      deleteId: null,
      popupMessage: false,
      errNoti: "",
    };
  }

  componentWillMount() {
    this.fetchSummary();
    this.fetchVehicleTypes();
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  fetchVehicleTypes = () => {
    // Payload giống mobile (getListVehicleTypeComboBox)
    fetchData.vehicle
      .getListVehicleType({ search: "", filter: "", orderBy: "", page: 0, limit: 1000 })
      .then((res) => {
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (res && Array.isArray(res.vehicleTypes)) list = res.vehicleTypes;
        else if (res && Array.isArray(res.data)) list = res.data;
        this.setState({ vehicleTypes: list });
      });
  };

  fetchSummary = () => {
    const { limit } = this.state;
    this.setState({ isLoaded: true });

    fetchData.vehicle
      .getList({ init: true, search: "", filter: "", orderBy: "", page: 0, limit: 1000 })
      .then((res) => {
        const vehicles = ((res || {}).data || {}).vehicles || ((res || {}).data || []) || [];
        const list = Array.isArray(vehicles) ? vehicles : [];
        const total = ((res || {}).data || {}).total || list.length;

        const collapseList = [];
        list.forEach((item, key) => {
          item["index"] = key + 1;
          collapseList.push({ id: item.id, collapse: false });
        });

        this.setState({
          data: list,
          listLength: total,
          totalPage: Math.ceil(list.length / limit),
          isLoaded: false,
          collapseList,
          status: (res || {}).status,
          message: PLEASE_CHECK_CONNECT((res || {}).message),
        });
      });
  };

  closeStatusModal = () => {
    const { status } = this.state;
    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null });
      }, LOADING_TIME);
    }
  };

  toggle = (val) => {
    let { collapseList } = this.state;
    collapseList
      .filter((item) => item.id === val)
      .map((item) => (item.collapse = !item.collapse));
    this.setState({ collapseList });
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
    if (selected > 0) total = selected * limit + total;

    this.setState({ beginItem, endItem, currentPage: selected + 1, totalElement: total });
  };

  // ===== Thêm / Sửa =====
  onOpenCreate = () => {
    this.setState({
      formModal: true,
      isEdit: false,
      form: { ...emptyForm },
      fileToUpload: null,
      errors: {},
    });
  };

  onOpenEdit = (id) => async () => {
    this.setState({ isLoaded: true });
    const detail = await fetchData.vehicle.getDetail(id);
    this.setState({ isLoaded: false });

    if (!detail) {
      this.setState({ errNoti: "Lấy thông tin phương tiện thất bại!" });
      this.toggleModal("popupMessage");
      return;
    }

    this.setState({
      formModal: true,
      isEdit: true,
      fileToUpload: null,
      errors: {},
      form: {
        id: detail.id || id,
        name: detail.name || "",
        color: detail.color || "",
        licensePlate: detail.licensePlate || "",
        weight: detail.weight != null ? String(detail.weight) : "",
        type: detail.type != null ? detail.type : 0,
        vehicleTypeId: detail.vehicleTypeID || detail.vehicleTypeId || "",
        image: detail.image || "",
      },
    });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  onChangeField = (name) => (event) => {
    const value = event.target.value;
    this.setState((prev) => ({ form: { ...prev.form, [name]: value } }));
  };

  onChangeSelect = (name) => (value) => {
    this.setState((prev) => ({ form: { ...prev.form, [name]: value } }));
  };

  onFileSelected = (file) => {
    this.setState({ fileToUpload: file });
  };

  validate = () => {
    const { form } = this.state;
    const errors = {};
    if (!form.name) errors.name = "Tên phương tiện không được bỏ trống";
    if ((form.name || "").length > 255) errors.name = "Tên phương tiện tối đa 255 ký tự";
    if (form.vehicleTypeId === "" || form.vehicleTypeId == null)
      errors.vehicleTypeId = "Vui lòng chọn loại phương tiện";
    if ([0, 1, 2, "0", "1", "2"].indexOf(form.type) === -1)
      errors.type = "Loại vận chuyển không hợp lệ";
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = () => {
    if (!this.validate()) return;
    const { form, isEdit, fileToUpload } = this.state;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("color", form.color || "");
    fd.append("licensePlate", form.licensePlate || "");
    fd.append("weight", parseFloat(form.weight || 0));
    fd.append("type", form.type);
    fd.append("vehicleTypeId", form.vehicleTypeId);
    fd.append("image", form.image || "");
    if (fileToUpload) fd.append("files", fileToUpload);
    if (isEdit) fd.append("id", form.id);

    const action = isEdit ? fetchData.vehicle.edit(fd) : fetchData.vehicle.add(fd);

    action
      .then((res) => {
        if (res && res.status === 200) {
          toast.success(isEdit ? "Cập nhật phương tiện thành công!" : "Thêm phương tiện thành công!");
          this.setState({ formModal: false });
          this.fetchSummary();
        } else {
          this.setState({ errNoti: getErrorMessageServer(res) || "Lưu phương tiện thất bại" });
          this.toggleModal("popupMessage");
        }
      })
      .catch((err) => {
        this.setState({ errNoti: getErrorMessageServer(err) || "Lưu phương tiện thất bại" });
        this.toggleModal("popupMessage");
      });
  };

  // ===== Xóa =====
  onAskDelete = (id) => () => {
    this.setState({ deleteId: id, warningPopupModal: true });
  };

  handleDeleteRow = () => {
    const { deleteId } = this.state;
    this.setState({ warningPopupModal: false });

    fetchData.vehicle
      .delete(deleteId)
      .then((res) => {
        if (res && res.status === 200) {
          toast.success("Xóa phương tiện thành công!");
          this.fetchSummary();
        } else {
          this.setState({ errNoti: getErrorMessageServer(res) || "Xóa phương tiện thất bại" });
          this.toggleModal("popupMessage");
        }
      })
      .catch((err) => {
        this.setState({ errNoti: getErrorMessageServer(err) || "Xóa phương tiện thất bại" });
        this.toggleModal("popupMessage");
      });
  };

  renderTypeName = (type) => {
    const t = VEHICLE_TYPE_OPTIONS.find((x) => x.id == type);
    return t ? t.name : "";
  };

  renderFormModal = () => {
    const { formModal, isEdit, form, errors, vehicleTypes } = this.state;
    return (
      <Modal isOpen={formModal} toggle={() => this.toggleModal("formModal")}>
        <div className="modal-header">
          <h5 className="modal-title">{isEdit ? "Sửa phương tiện" : "Thêm phương tiện"}</h5>
          <button type="button" className="close" onClick={() => this.toggleModal("formModal")}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className={classes.formControl}>
            <ImageUploader
              initialImageUrl={form.image || NoImg}
              onFileSelected={this.onFileSelected}
            />

            <div className={classes.rowItem}>
              <label className="form-control-label">
                Tên phương tiện&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    placeholder="Tên phương tiện"
                    value={form.name}
                    onChange={this.onChangeField("name")}
                  />
                </InputGroup>
                <p className={classes.error}>{errors.name || ""}</p>
              </div>
            </div>

            <div className={classes.rowItem}>
              <label className="form-control-label">Biển số</label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    placeholder="Biển số"
                    value={form.licensePlate}
                    onChange={this.onChangeField("licensePlate")}
                  />
                </InputGroup>
              </div>
            </div>

            <div className={classes.rowItem}>
              <label className="form-control-label">
                Loại vận chuyển&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className={classes.inputArea}>
                <Select
                  name="type"
                  title="Chọn loại vận chuyển"
                  value={form.type}
                  data={VEHICLE_TYPE_OPTIONS}
                  labelName="name"
                  val="id"
                  handleChange={this.onChangeSelect("type")}
                />
                <p className={classes.error}>{errors.type || ""}</p>
              </div>
            </div>

            <div className={classes.rowItem}>
              <label className="form-control-label">
                Loại phương tiện&nbsp;<b style={{ color: "red" }}>*</b>
              </label>
              <div className={classes.inputArea}>
                <Select
                  name="vehicleTypeId"
                  title="Chọn loại phương tiện"
                  value={form.vehicleTypeId}
                  data={vehicleTypes}
                  labelName="name"
                  val="id"
                  handleChange={this.onChangeSelect("vehicleTypeId")}
                />
                <p className={classes.error}>{errors.vehicleTypeId || ""}</p>
              </div>
            </div>

            <div className={classes.rowItem}>
              <label className="form-control-label">Trọng lượng</label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="number"
                    placeholder="Trọng lượng"
                    value={form.weight}
                    onChange={this.onChangeField("weight")}
                  />
                </InputGroup>
              </div>
            </div>

            <div className={classes.rowItem}>
              <label className="form-control-label">Màu sắc</label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    placeholder="Màu sắc"
                    value={form.color}
                    onChange={this.onChangeField("color")}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => this.toggleModal("formModal")}>
            Đóng
          </Button>
          <Button className="btn-primary-cs" color="default" onClick={this.handleSave}>
            Lưu
          </Button>
        </div>
      </Modal>
    );
  };

  render() {
    const {
      isLoaded,
      status,
      message,
      data,
      headerTitle,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      collapseList,
      warningPopupModal,
      popupMessage,
      errNoti,
    } = this.state;
    const statusPopup = { status, message };

    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    if (JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      const ACCOUNT_CLAIM_FF = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "")
        .split(",")
        .filter((x) => x != "");
      ACCOUNT_CLAIM_FF.filter((x) => x == "Vehicles.Add").map(() => (isDisableAdd = false));
      ACCOUNT_CLAIM_FF.filter((x) => x == "Vehicles.Edit").map(() => (isDisableEdit = false));
      ACCOUNT_CLAIM_FF.filter((x) => x == "Vehicles.Delete").map(() => (isDisableDelete = false));
    }

    return (
      <>
        <div className={classes.wrapper}>
          <Container fluid>
            {isLoaded ? (
              <div style={{ display: "table", margin: "auto" }}>
                <Spinner style={{ width: "3rem", height: "3rem" }} />
              </div>
            ) : (
              <Row>
                <div className="col">
                  <HeaderTable
                    dataReload={() => this.fetchSummary()}
                    hideSearch={true}
                    hideCreate={true}
                    handleSubmitSearchForm={() => this.fetchSummary()}
                    customComponent={
                      isDisableAdd ? null : (
                        <Button
                          type="button"
                          size="lg"
                          className="btn-primary-cs"
                          onClick={this.onOpenCreate}
                        >
                          <span>Thêm phương tiện</span>
                        </Button>
                      )
                    }
                  />

                  <Card className="shadow">
                    <Table className="align-items-center tablecs" responsive>
                      <HeadTitleTable
                        headerTitle={headerTitle}
                        classHeaderColumns={{ 0: "table-scale-col table-user-col-1" }}
                      />
                      <tbody ref={(ref) => (this.tableBody = ref)}>
                        {Array.isArray(data) &&
                          data
                            .filter((item, key) => key >= beginItem && key < endItem)
                            .map((item, key) => (
                              <tr
                                key={key}
                                style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}
                                className="table-hover-css"
                              >
                                <td className="table-scale-col table-user-col-1">{item.index}</td>
                                <td style={{ textAlign: "center" }}>
                                  <img className={classes.logo} src={item.image || NoImg} alt="img" />
                                </td>
                                <td style={{ textAlign: "left" }}>{item.name}</td>
                                <td style={{ textAlign: "left" }}>{item.licensePlate}</td>
                                <td style={{ textAlign: "left" }}>{this.renderTypeName(item.type)}</td>
                                <td style={{ textAlign: "left" }}>{item.weight}</td>
                                <td style={{ textAlign: "left" }}>{item.color}</td>
                                <td>
                                  {collapseList
                                    .filter((c) => c.id === item.id)
                                    .map((ele, k) =>
                                      isDisableEdit && isDisableDelete ? null : (
                                        <ButtonDropdown
                                          key={k}
                                          isOpen={ele.collapse}
                                          toggle={() => this.toggle(item.id)}
                                        >
                                          <DropdownToggle>
                                            <img src={MenuButton} alt="menu" />
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            {isDisableEdit == false && (
                                              <DropdownItem onClick={this.onOpenEdit(item.id)}>
                                                Sửa
                                              </DropdownItem>
                                            )}
                                            {isDisableEdit == false && isDisableDelete == false && (
                                              <DropdownItem divider />
                                            )}
                                            {isDisableDelete == false && (
                                              <DropdownItem onClick={this.onAskDelete(item.id)}>
                                                Xóa
                                              </DropdownItem>
                                            )}
                                          </DropdownMenu>
                                        </ButtonDropdown>
                                      )
                                    )}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </Table>
                  </Card>

                  {Array.isArray(data) && data.length > 0 && (
                    <Pagination
                      data={data}
                      listLength={listLength}
                      totalPage={totalPage}
                      totalElement={totalElement}
                      handlePageClick={this.handlePageClick}
                    />
                  )}
                </div>
              </Row>
            )}

            {this.renderFormModal()}

            <WarningPopup
              moduleTitle="Thông báo"
              moduleBody={
                <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Bạn đồng ý xóa thông tin này?
                </p>
              }
              warningPopupModal={warningPopupModal}
              toggleModal={() => this.setState({ warningPopupModal: false })}
              handleWarning={this.handleDeleteRow}
            />

            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={"Thông báo"}
              moduleBody={errNoti}
              toggleModal={() => this.toggleModal("popupMessage")}
            />

            <ToastContainer position="top-center" autoClose={3000} />

            {setAlertContext(statusPopup)}
            {openAlertContext(statusPopup)}
          </Container>
        </div>
      </>
    );
  }
}

export default Vehicle;
