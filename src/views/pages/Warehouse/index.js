import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  ButtonDropdown,
  Card,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import MenuButton from "../../../assets/img/buttons/menu.png";
import { fetchData } from "helpers/fetchData";
import { getErrorMessageServer } from "utils/errorMessageServer.js";

const emptyForm = {
  id: "",
  name: "",
  address: "",
  gps: "",
  temperature: "",
  humidity: "",
};

const LIMIT = 20;

class Warehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
      totalCount: 0,
      page: 0,
      keyword: "",
      collapseId: null,
      formModal: false,
      deleteModal: false,
      deleteId: null,
      isEdit: false,
      form: { ...emptyForm },
      errors: {},
      canAdd: false,
      canEdit: false,
      canDelete: false,
    };
  }

  componentDidMount() {
    const claims = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN") || "false");
    this.setState({
      canAdd: isAdmin || claims.includes("WareHouse.Add"),
      canEdit: isAdmin || claims.includes("WareHouse.Edit"),
      canDelete: isAdmin || claims.includes("WareHouse.Delete"),
    });
    this.fetchList(0);
  }

  fetchList = async (page = 0) => {
    this.setState({ isLoaded: true, page, collapseId: null });
    const result = await fetchData.warehouse.getPage({
      search: "",
      filter: "",
      orderBy: "Name",
      page,
      limit: LIMIT,
    });
    const list = (result.list || []).map((item, index) => ({
      id: item.id || item.ID,
      name: item.name || item.Name || "",
      address: item.address || item.Address || "",
      gps: item.gps || item.GPS || "",
      temperature: item.temperature || item.Temperature || "",
      humidity: item.humidity || item.Humidity || "",
      index: page * LIMIT + index + 1,
    }));
    this.setState({
      data: list,
      totalCount: result.totalCount || list.length,
      isLoaded: false,
    });
  };

  filteredData = () => {
    const keyword = (this.state.keyword || "").trim().toLowerCase();
    if (!keyword) return this.state.data;
    return this.state.data.filter((item) =>
      (item.name || "").toLowerCase().includes(keyword)
    );
  };

  onChangeField = (name) => (event) => {
    const value = event.target.value;
    this.setState((prev) => ({ form: { ...prev.form, [name]: value } }));
  };

  onOpenCreate = () => {
    this.setState({
      formModal: true,
      isEdit: false,
      errors: {},
      form: { ...emptyForm },
    });
  };

  onOpenEdit = (id) => async () => {
    this.setState({ isLoaded: true, collapseId: null });
    const detail = await fetchData.warehouse.getDetail(id);
    this.setState({ isLoaded: false });
    if (!detail) {
      toast.error("Lấy thông tin kho hàng thất bại");
      return;
    }
    this.setState({
      formModal: true,
      isEdit: true,
      errors: {},
      form: {
        id: detail.id || detail.ID || id,
        name: detail.name || detail.Name || "",
        address: detail.address || detail.Address || "",
        gps: detail.gps || detail.GPS || "",
        temperature: detail.temperature || detail.Temperature || "",
        humidity: detail.humidity || detail.Humidity || "",
      },
    });
  };

  validate = () => {
    const errors = {};
    if (!(this.state.form.name || "").trim()) {
      errors.name = "Chưa nhập tên kho hàng";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = async () => {
    if (!this.validate()) return;
    const { form, isEdit, page } = this.state;
    const payload = {
      id: form.id || "",
      name: form.name.trim(),
      address: form.address || "",
      gps: form.gps || "",
      temperature: form.temperature || "",
      humidity: form.humidity || "",
    };
    const result = isEdit
      ? await fetchData.warehouse.update(payload)
      : await fetchData.warehouse.create(payload);
    if (result && result.status === 200) {
      toast.success(isEdit ? "Sửa kho hàng thành công" : "Tạo kho hàng thành công");
      this.setState({ formModal: false });
      this.fetchList(isEdit ? page : 0);
      return;
    }
    toast.error(getErrorMessageServer(result) || result?.message || "Lưu kho hàng thất bại");
  };

  onAskDelete = (id) => () => {
    this.setState({ deleteModal: true, deleteId: id, collapseId: null });
  };

  handleDelete = async () => {
    const { deleteId, page } = this.state;
    this.setState({ deleteModal: false });
    const result = await fetchData.warehouse.remove(deleteId);
    if (result && result.status === 200) {
      toast.success("Xóa kho hàng thành công");
      this.fetchList(page);
      return;
    }
    toast.error(getErrorMessageServer(result) || result?.message || "Xóa kho hàng thất bại");
  };

  render() {
    const {
      isLoaded,
      totalCount,
      page,
      keyword,
      collapseId,
      formModal,
      deleteModal,
      isEdit,
      form,
      errors,
      canAdd,
      canEdit,
      canDelete,
    } = this.state;
    const rows = this.filteredData();
    const totalPage = Math.max(1, Math.ceil((totalCount || 0) / LIMIT));

    return (
      <>
        <div>
          <Container fluid>
            {isLoaded ? (
              <div style={{ display: "table", margin: "40px auto" }}>
                <Spinner style={{ width: "3rem", height: "3rem" }} />
              </div>
            ) : (
              <Row>
                <div className="col">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Input
                      style={{ maxWidth: 280 }}
                      placeholder="Tìm theo tên kho"
                      value={keyword}
                      onChange={(e) => this.setState({ keyword: e.target.value })}
                    />
                    {canAdd && (
                      <Button color="primary" onClick={this.onOpenCreate}>
                        Thêm kho
                      </Button>
                    )}
                  </div>
                  <Card className="shadow">
                    <Table className="align-items-center" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th>STT</th>
                          <th>Tên kho</th>
                          <th>Địa chỉ</th>
                          <th>Toạ độ</th>
                          <th>Nhiệt độ</th>
                          <th>Độ ẩm</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              Chưa có kho hàng
                            </td>
                          </tr>
                        ) : (
                          rows.map((item) => (
                            <tr key={item.id}>
                              <td>{item.index}</td>
                              <td>{item.name}</td>
                              <td>{item.address}</td>
                              <td>{item.gps}</td>
                              <td>{item.temperature}</td>
                              <td>{item.humidity}</td>
                              <td>
                                {(canEdit || canDelete) && (
                                  <ButtonDropdown
                                    isOpen={collapseId === item.id}
                                    toggle={() =>
                                      this.setState({
                                        collapseId: collapseId === item.id ? null : item.id,
                                      })
                                    }
                                  >
                                    <DropdownToggle>
                                      <img src={MenuButton} alt="menu" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      {canEdit && (
                                        <DropdownItem onClick={this.onOpenEdit(item.id)}>
                                          Sửa
                                        </DropdownItem>
                                      )}
                                      {canEdit && canDelete && <DropdownItem divider />}
                                      {canDelete && (
                                        <DropdownItem onClick={this.onAskDelete(item.id)}>
                                          Xóa
                                        </DropdownItem>
                                      )}
                                    </DropdownMenu>
                                  </ButtonDropdown>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </Card>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>Tổng {totalCount} kho</span>
                    <div>
                      <Button
                        size="sm"
                        disabled={page <= 0}
                        onClick={() => this.fetchList(page - 1)}
                      >
                        Trước
                      </Button>
                      <span className="mx-2">
                        {page + 1} / {totalPage}
                      </span>
                      <Button
                        size="sm"
                        disabled={page + 1 >= totalPage}
                        onClick={() => this.fetchList(page + 1)}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                </div>
              </Row>
            )}
          </Container>
        </div>

        <Modal isOpen={formModal} toggle={() => this.setState({ formModal: false })} centered>
          <ModalHeader toggle={() => this.setState({ formModal: false })}>
            {isEdit ? "Sửa kho hàng" : "Thêm kho hàng"}
          </ModalHeader>
          <ModalBody>
            <label className="form-control-label">
              Tên kho <span style={{ color: "red" }}>*</span>
            </label>
            <Input value={form.name} onChange={this.onChangeField("name")} />
            {errors.name && <p className="text-danger mb-2">{errors.name}</p>}

            <label className="form-control-label mt-3">Địa chỉ</label>
            <Input value={form.address} onChange={this.onChangeField("address")} />

            <label className="form-control-label mt-3">Toạ độ (GPS)</label>
            <Input value={form.gps} onChange={this.onChangeField("gps")} placeholder="vĩ độ, kinh độ" />

            <div className="d-flex mt-3">
              <div className="flex-fill mr-2">
                <label className="form-control-label">Nhiệt độ</label>
                <Input value={form.temperature} onChange={this.onChangeField("temperature")} />
              </div>
              <div className="flex-fill ml-2">
                <label className="form-control-label">Độ ẩm</label>
                <Input value={form.humidity} onChange={this.onChangeField("humidity")} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSave}>
              Lưu
            </Button>
            <Button color="secondary" onClick={() => this.setState({ formModal: false })}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={deleteModal} toggle={() => this.setState({ deleteModal: false })} centered>
          <ModalHeader toggle={() => this.setState({ deleteModal: false })}>
            Xóa kho hàng
          </ModalHeader>
          <ModalBody>Bạn có chắc muốn xóa kho hàng này?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDelete}>
              Xóa
            </Button>
            <Button color="secondary" onClick={() => this.setState({ deleteModal: false })}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>

        <ToastContainer position="top-center" autoClose={3000} />
      </>
    );
  }
}

export default Warehouse;
