import React, { Component } from "react";
import classes from "./index.module.css";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { DECLARATION_INFORMATION, LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import HeaderTable from "components/HeaderTable";
import Pagination from "components/Pagination";
import Select from "../../../components/Select";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import MenuButton from "../../../assets/img/buttons/menu.png";
import { generateStyleTableCol } from "../../../bases/controls/helper";

import InsertOrUpdate from "./InsertOrUpdate.js";
import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { fetchData } from "helpers/fetchData";
import { callApi } from "utils/fetchAllData";

// Kiểu dữ liệu kê khai — đồng bộ mobile (constants/data: LIST_DATA_TYPE / DATA_TYPES)
const DATA_TYPES = { text: 1, number: 2, date: 3, image: 4, banDo: 5, trueFalse: 6 };
const VARIABLE_OPTIONS = [
  { value: 1, label: "Văn bản" },
  { value: 2, label: "Số" },
  { value: 3, label: "Thời gian" },
  { value: 4, label: "Hình ảnh" },
  { value: 5, label: "Định vị" },
  { value: 6, label: "Có/không" },
];
const REFERENCE_OPTIONS = [
  { value: 10, label: "Khách hàng" },
  { value: 20, label: "Nhà cung cấp" },
  { value: 40, label: "Sản phẩm/nguyên vật liệu" },
  { value: 60, label: "Đơn vị tính" },
  { value: 91, label: "Nhà máy" },
  { value: 93, label: "Thiết bị" },
  { value: 94, label: "Vận chuyển" },
];

class DeclarationInformations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], // flat: mỗi dòng = 1 kê khai (con) kèm tên Truy xuất (cha)
      informations: [],
      informSelects: [],
      informSelectParents: [],
      isLoaded: null,
      status: null,
      message: "",
      headerTitle: DECLARATION_INFORMATION,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      totalPage: 0,
      collapseList: [],
      filter: { filter: "", product: "" }, // filter = fieldId, product = productId
      JOB_OPTIONS: [],
      PRODUCT_OPTIONS: [],
      PROCESS_ACCESS_OPTIONS: [],
      VARIABLE_OPTIONS,
      REFERENCE_OPTIONS,
      // Modal thêm/sửa (qua HeaderTable)
      dataInsert: {},
      errorInserts: {},
      editId: null,
      editData: null,
      isShowForEdit: false,
      isShowForDetail: false,
    };
  }

  componentWillMount() {
    fetchData.infoCompany
      .getFieldByCompanyHaveAccess({})
      .then((res) => {
        let arr = [];
        if (Array.isArray(res)) arr = res;
        else if (res && Array.isArray(res.data)) arr = res.data;
        else if (res && Array.isArray(res.fields)) arr = res.fields;
        else if (res && res.data && Array.isArray(res.data.fields)) arr = res.data.fields;

        const options = (arr || []).map((item) => ({
          id: item.id != null ? item.id : item.ID,
          title: item.name || item.title || item.fieldName || item.FieldName,
        }));
        this.setState({ JOB_OPTIONS: options });

        if (options.length === 1 && options[0].id != null) {
          const fieldId = options[0].id;
          this.setState(
            (prev) => ({ filter: { ...prev.filter, filter: fieldId, product: "" } }),
            () => this.fetchProductsByField(fieldId)
          );
        }
      })
      .catch((e) => console.error("Lỗi lấy ngành nghề:", e));
  }

  componentDidUpdate() {
    const { status } = this.state;
    if (status || !status) {
      setTimeout(() => this.setState({ status: null }), LOADING_TIME);
    }
  }

  // Dựng list phẳng: mỗi kê khai (con) + tên Truy xuất (cha) — giữ field gốc để xử lý nghiệp vụ
  buildData = (informSelects, informSelectParents) => {
    const parentName = (parentID) => {
      const p = (informSelectParents || []).find((x) => x.informID === parentID);
      return p ? p.name : "";
    };
    return (informSelects || []).map((item, key) => ({
      ...item,
      index: key + 1,
      retrieve: parentName(item.parentID), // TRUY XUẤT (cha)
      manifestName: item.name, // TÊN KÊ KHAI (con)
      loggingStatus: item.isChecked ? 1 : 0,
      qrStatus: item.isShow ? 1 : 0,
    }));
  };

  fetchSummary = () => {
    const { filter, limit } = this.state;
    const fieldId = filter.filter || "";
    const productId = filter.product || "";

    if (!fieldId || !productId) {
      this.setState({
        data: [],
        informations: [],
        informSelects: [],
        informSelectParents: [],
        listLength: 0,
        totalPage: 0,
      });
      return;
    }

    this.setState({ isLoaded: true });

    callApi("get", `informationaccess/getgridviewv2?fieldId=${fieldId}&productId=${productId}`)
      .then((res) => {
        const data = (res && res.data) || {};
        const informations = data.informations || [];
        const informSelects = data.informSelects || [];
        const informSelectParents = data.informSelectParents || [];

        const newData = this.buildData(informSelects, informSelectParents);
        const collapseList = newData.map((item) => ({ id: item.id, collapse: false }));

        this.setState({
          informations,
          informSelects,
          informSelectParents,
          data: newData,
          collapseList,
          listLength: newData.length,
          totalPage: Math.ceil(newData.length / limit),
          beginItem: 0,
          endItem: limit,
          currentPage: 0,
          totalElement: Math.min(limit, newData.length),
          isLoaded: false,
        });
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách kê khai:", error);
        this.setState({ isLoaded: false });
      });
  };

  fetchProductsByField = async (fieldID) => {
    if (!fieldID) {
      this.setState({ PRODUCT_OPTIONS: [] });
      return;
    }
    try {
      const res = await fetchData.product.getAllLock({
        fieldID,
        productCode: "",
        productName: "",
        orderBy: "",
        page: 0,
        limit: 1000,
      });
      let arr = [];
      if (Array.isArray(res)) arr = res;
      else if (res && Array.isArray(res.data)) arr = res.data;
      else if (res && Array.isArray(res.products)) arr = res.products;
      else if (res && res.data && Array.isArray(res.data.products)) arr = res.data.products;

      const options = (arr || []).map((item) => ({
        id: item.id,
        productName: item.productName || item.name || item.title,
      }));
      this.setState({ PRODUCT_OPTIONS: options });
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  handleChangeSelectFilter = async (value, name) => {
    if (name !== "filter") {
      this.setState((prev) => ({ filter: { ...prev.filter, product: value } }));
      return;
    }
    this.setState((prev) => ({
      filter: { ...prev.filter, filter: value, product: "" },
      PRODUCT_OPTIONS: [],
      data: [],
      informSelects: [],
      informSelectParents: [],
    }));
    if (value) await this.fetchProductsByField(value);
  };

  handleSubmitSearchForm = () => this.fetchSummary();

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    const selected = data.selected;
    const offset = Math.ceil(selected * limit);
    let total = 0;
    beginItem = offset;
    endItem = offset + limit;
    this.state.data.map((item, key) => key >= beginItem && key < endItem && total++);
    if (selected > 0) total = selected * limit + total;
    this.setState({ beginItem, endItem, currentPage: selected + 1, totalElement: total });
  };

  requireFieldProduct = () => {
    const { filter } = this.state;
    if (!filter.filter) {
      toast.error("Bạn vui lòng chọn ngành nghề");
      return false;
    }
    if (!filter.product) {
      toast.error("Bạn vui lòng chọn sản phẩm");
      return false;
    }
    return true;
  };

  // NHẬT KÝ (isChecked): toggle; tắt isShow. Không cho bỏ tick mục bắt buộc.
  onToggleDiary = (row) => {
    if (!this.requireFieldProduct()) return;
    const informSelects = this.state.informSelects.map((x) => ({ ...x }));
    const item = informSelects.find((p) => p.id === row.id);
    if (!item) return;

    if (!item.isGenerated) {
      const information = this.state.informations.find((p) => p.id === item.informID);
      if (information && information.isRequired && item.isChecked) return;
    } else if (item.isRequired && item.isChecked) {
      return;
    }

    item.isChecked = !item.isChecked;
    item.isShow = false;
    this.setState({ informSelects, data: this.buildData(informSelects, this.state.informSelectParents) });
  };

  // QUÉT MÃ (isShow): toggle; khi bật thì ép bật Nhật ký.
  onToggleQRCode = (row) => {
    if (!this.requireFieldProduct()) return;
    const informSelects = this.state.informSelects.map((x) => ({ ...x }));
    const item = informSelects.find((p) => p.id === row.id);
    if (!item) return;

    if (!item.isGenerated) {
      const information = this.state.informations.find((p) => p.id === item.informID);
      if (information && information.isRequired && item.isShow) return;
    } else if (item.isRequired && item.isShow) {
      return;
    }

    item.isShow = !item.isShow;
    if (item.isShow) item.isChecked = true;
    this.setState({ informSelects, data: this.buildData(informSelects, this.state.informSelectParents) });
  };

  // Lưu thay đổi (CẬP NHẬT) -> informationaccess/updatev2
  onUpdate = () => {
    if (!this.requireFieldProduct()) return;
    const { filter, informSelects } = this.state;

    const notRequired = informSelects.filter((p) => !p.isRequired || p.isEvaluated);
    if (notRequired.length <= 0) {
      toast.error("Không có kê khai để cập nhật");
      return;
    }

    const items = informSelects
      .filter((p) => notRequired.find((t) => t.informID === p.informID) || p.isGenerated)
      .map((p) => ({ id: p.id, isChecked: !!p.isChecked, isShow: !!p.isShow }));

    this.setState({ isLoaded: true });
    callApi("post", "informationaccess/updatev2", {
      fieldId: filter.filter,
      productId: filter.product,
      items,
    })
      .then((res) => {
        if (res && (res.status === 200 || (res.data && res.data.status === 200))) {
          toast.success("Cập nhật kê khai thành công");
          this.fetchSummary();
        } else {
          toast.error(getErrorMessageServer(res) || "Cập nhật kê khai thất bại");
          this.setState({ isLoaded: false });
        }
      })
      .catch((error) => {
        console.error("Lỗi cập nhật kê khai:", error);
        toast.error("Cập nhật kê khai thất bại");
        this.setState({ isLoaded: false });
      });
  };

  loadProcessAccessForAdd = () => {
    const { filter } = this.state;
    const fieldId = filter.filter || "";
    const productId = filter.product || "";
    if (!fieldId || !productId) return;

    callApi("get", `informationaccess/getListProcessAccessForAdd?fieldId=${fieldId}&productId=${productId}`)
      .then((res) => {
        const arr =
          (res.data && res.data.informSelects) ||
          (res.data && res.data.data) ||
          res.data ||
          [];
        const options = (Array.isArray(arr) ? arr : []).map((item) => ({
          id: item.informID != null ? item.informID : item.id, // value = informID (giống mobile)
          title: item.name || item.title,
        }));
        this.setState({ PROCESS_ACCESS_OPTIONS: options });
      })
      .catch((error) => console.error("Lỗi lấy danh sách truy xuất:", error));
  };

  handleModal = (status, openModal, closeModal) => {
    if (status || this.state.isShowForEdit || this.state.isShowForDetail) {
      closeModal && closeModal();
    } else {
      if (!this.requireFieldProduct()) return;
      this.loadProcessAccessForAdd();
      openModal && openModal();
    }
    this.setState({
      isShowForEdit: false,
      isShowForDetail: false,
      editId: null,
      editData: null,
      dataInsert: {},
    });
  };

  onHandleChangeValue = (data) => this.setState({ dataInsert: data });

  onConfirm = (toggleModal) => {
    const { dataInsert, filter, editId } = this.state;

    const fieldId = filter.filter || "";
    const productId = filter.product || "";
    const processAccessId = dataInsert.processAccessId || "";
    const name = (dataInsert.setManifestName || "").trim();
    const variable = dataInsert.variable;

    if (!fieldId) return toast.error("Bạn vui lòng chọn ngành nghề");
    if (!productId) return toast.error("Bạn vui lòng chọn sản phẩm");
    if (!processAccessId) return toast.error("Bạn vui lòng chọn truy xuất");
    if (!name) return toast.error("Bạn vui lòng nhập tên kê khai");
    if (!variable) return toast.error("Bạn vui lòng chọn kiểu dữ liệu");

    const payload = {
      id: editId || undefined,
      setManifestName: name,
      fieldID: fieldId,
      productID: productId,
      processAccessID: processAccessId,
      sortOrder: Number(dataInsert.sortOrder) || 0,
      refference:
        variable === DATA_TYPES.text && dataInsert.refference != null ? dataInsert.refference : null,
      variable,
      informSelectValues: dataInsert.informSelectValues || [],
    };

    const isEdit = !!editId;
    const endpoint = isEdit ? "informationaccess/update" : "informationaccess/create";

    callApi("post", endpoint, payload)
      .then((res) => {
        if (res && (res.status === 200 || (res.data && res.data.status === 200))) {
          toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
          this.fetchSummary();
          if (toggleModal) toggleModal();
        } else {
          toast.error(
            getErrorMessageServer(res) || (isEdit ? "Cập nhật thất bại" : "Thêm mới thất bại")
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi lưu kê khai:", error);
        toast.error(getErrorMessageServer(error) || "Lưu kê khai thất bại");
      });
  };

  onEditData = (row) => () => {
    callApi("get", `informationaccess/getDetailSetManifest?id=${row.id}`)
      .then((res) => {
        const data = (res && res.data) || {};
        const informSelect = data.informSelect || {};
        this.loadProcessAccessForAdd();
        this.setState({
          editId: row.id,
          isShowForEdit: true,
          editData: {
            id: row.id,
            processAccessId: informSelect.parentID,
            setManifestName: informSelect.name,
            sortOrder: informSelect.sortOrder,
            variable: informSelect.columnType,
            refference: informSelect.reference,
            informSelectValues: data.informSelectValues || [],
            isGenerated: informSelect.isGenerated,
          },
        });
      })
      .catch((error) => {
        console.error("Lỗi lấy chi tiết kê khai:", error);
        toast.error("Lấy thông tin kê khai thất bại");
      });
  };

  onDeleteData = (row) => () => {
    callApi("delete", `informationaccess/delete?id=${row.id}`)
      .then((res) => {
        if (res && (res.status === 200 || (res.data && res.data.status === 200))) {
          toast.success("Xoá kê khai thành công");
          this.fetchSummary();
        } else {
          toast.error(getErrorMessageServer(res) || "Xoá kê khai thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi xoá kê khai:", error);
        toast.error("Xoá kê khai thất bại");
      });
  };

  // Mục kê khai được phép sửa/xoá (giống mobile: tự tạo & không bắt buộc, hoặc kiểu Có/Không)
  canEditChild = (row) =>
    (row.isGenerated && !row.isRequired) || row.columnType === DATA_TYPES.trueFalse;

  toggle = (val) => {
    let { collapseList } = this.state;
    collapseList.filter((item) => item.id === val).map((item) => (item.collapse = !item.collapse));
    this.setState({ collapseList });
  };

  renderTable = (isDisableEdit, isDisableDelete) => {
    const { data, beginItem, endItem, collapseList } = this.state;
    let autoIndex = beginItem;
    const pageData = data.filter((item, key) => key >= beginItem && key < endItem);

    return pageData.map((e) => {
      const information = !e.isGenerated
        ? this.state.informations.find((p) => p.id === e.informID)
        : null;
      const requiredChecked =
        (information && information.isRequired) || (e.isGenerated && e.isRequired);
      const row = (
        <tr
          key={e.id}
          style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}
          className="table-hover-css"
        >
          <td className="table-scale-col table-user-col-1">{autoIndex + 1}</td>
          <td style={{ textAlign: "left" }}>{e.retrieve}</td>
          <td style={{ textAlign: "left" }}>{e.manifestName}</td>
          <td style={{ textAlign: "center", cursor: "pointer" }} onClick={() => this.onToggleDiary(e)}>
            <input
              type="checkbox"
              readOnly
              checked={!!e.loggingStatus}
              disabled={requiredChecked && e.loggingStatus}
              style={{ cursor: "pointer", width: 18, height: 18 }}
            />
          </td>
          <td style={{ textAlign: "center", cursor: "pointer" }} onClick={() => this.onToggleQRCode(e)}>
            <input
              type="checkbox"
              readOnly
              checked={!!e.qrStatus}
              disabled={requiredChecked && e.qrStatus}
              style={{ cursor: "pointer", width: 18, height: 18 }}
            />
          </td>
          <td>
            {this.canEditChild(e) && (isDisableEdit === false || isDisableDelete === false)
              ? collapseList
                  .filter((c) => c.id === e.id)
                  .map((ele, k) => (
                    <ButtonDropdown key={k} isOpen={ele.collapse} toggle={() => this.toggle(e.id)}>
                      <DropdownToggle>
                        <img src={MenuButton} alt="menu" />
                      </DropdownToggle>
                      <DropdownMenu>
                        {isDisableEdit === false ? (
                          <DropdownItem onClick={this.onEditData(e)}>Sửa</DropdownItem>
                        ) : null}
                        {isDisableDelete === false && e.isGenerated ? (
                          <>
                            <DropdownItem divider />
                            <DropdownItem onClick={this.onDeleteData(e)}>Xoá</DropdownItem>
                          </>
                        ) : null}
                      </DropdownMenu>
                    </ButtonDropdown>
                  ))
              : null}
          </td>
        </tr>
      );
      autoIndex++;
      return row;
    });
  };

  render() {
    const {
      isLoaded,
      status,
      message,
      filter,
      data,
      headerTitle,
      listLength,
      totalPage,
      totalElement,
      JOB_OPTIONS,
      PRODUCT_OPTIONS,
      PROCESS_ACCESS_OPTIONS,
      VARIABLE_OPTIONS: variableOpts,
      REFERENCE_OPTIONS: referenceOpts,
      informSelects,
      errorInserts,
      editId,
      isShowForEdit,
      isShowForDetail,
    } = this.state;

    const statusPopup = { status, message };

    let isDisableAdd = false;
    let isDisableEdit = false;
    let isDisableDelete = false;
    if (!JSON.parse(localStorage.getItem("IS_ADMIN"))) {
      const claims = (localStorage.getItem("ACCOUNT_CLAIM_FF") || "").split(",").filter((x) => x != "");
      if (claims.length > 0 && !claims.find((x) => x === "DeclarationInformations.Add")) isDisableAdd = true;
      if (claims.length > 0 && !claims.find((x) => x === "DeclarationInformations.Edit")) isDisableEdit = true;
      if (claims.length > 0 && !claims.find((x) => x === "DeclarationInformations.Delete")) isDisableDelete = true;
    }

    const canUpdate =
      isDisableEdit === false &&
      Array.isArray(informSelects) &&
      informSelects.length > 0 &&
      informSelects.filter((p) => !p.isRequired || p.isGenerated).length > 0;

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
                    hideCreate={isDisableAdd}
                    moduleTitle={
                      isShowForDetail
                        ? "Chi tiết kê khai"
                        : isShowForEdit
                        ? "Cập nhật kê khai"
                        : "Thêm kê khai"
                    }
                    moduleBody={
                      <InsertOrUpdate
                        id={editId}
                        initialData={this.state.editData}
                        isReadOnly={isShowForDetail}
                        errors={errorInserts}
                        onHandleChangeValue={this.onHandleChangeValue}
                        PROCESS_ACCESS_OPTIONS={PROCESS_ACCESS_OPTIONS}
                        VARIABLE_OPTIONS={variableOpts}
                        REFERENCE_OPTIONS={referenceOpts}
                      />
                    }
                    isShowForEdit={isShowForEdit || isShowForDetail}
                    handleModal={this.handleModal}
                    isReadOnly={isShowForDetail}
                    onConfirm={this.onConfirm}
                    handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                    typeSearch={
                      <div className="div_flex" style={{ marginBottom: "10px", flexWrap: "wrap" }}>
                        <div className="mg-div-search">
                          <label className="form-control-label">Ngành nghề</label>
                          <div>
                            <Select
                              name="filter"
                              title="Ngành nghề"
                              value={filter.filter || null}
                              data={JOB_OPTIONS}
                              labelName="title"
                              val="id"
                              handleChange={this.handleChangeSelectFilter}
                            />
                          </div>
                        </div>
                        <div className="mg-div-search">
                          <label className="form-control-label">Sản phẩm</label>
                          <div>
                            <Select
                              name="product"
                              title="Sản phẩm"
                              value={filter.product || null}
                              data={PRODUCT_OPTIONS}
                              labelName="productName"
                              val="id"
                              handleChange={this.handleChangeSelectFilter}
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
                            onClick={() => this.handleSubmitSearchForm()}
                          >
                            <img src={SearchImg} alt="Tìm kiếm" />
                            <span>Tìm kiếm</span>
                          </Button>
                        </div>
                      </div>
                    }
                  />

                  {/* Tiêu đề mô tả — đồng bộ mobile setManifest + giống trang Truy xuất */}
                  <div style={{ margin: "4px 0 12px" }}>
                    <div style={{ fontWeight: 700, color: "#1f3bb3", fontSize: 16 }}>DỮ LIỆU KÊ KHAI</div>
                    <div style={{ color: "#6c757d", fontSize: 13 }}>
                      Chọn dữ liệu kê khai hiển thị ứng với doanh nghiệp của bạn
                    </div>
                  </div>

                  <Card className="shadow">
                    <Table className="align-items-center tablecs" responsive>
                      <thead className="thead-dark">
                        <tr>
                          {headerTitle.map((item, key) => (
                            <th
                              scope="col"
                              key={key}
                              style={{ whiteSpace: "normal", textAlign: key >= 3 ? "center" : "left" }}
                              className={`${key === 0 ? "table-scale-col table-user-col-1" : ""} font-bold font-size-15px`}
                            >
                              {item}
                            </th>
                          ))}
                          <th scope="col" className="font-bold font-size-15px"></th>
                        </tr>
                      </thead>
                      <tbody ref={(ref) => (this.tableBody = ref)}>
                        {Array.isArray(data) && this.renderTable(isDisableEdit, isDisableDelete)}
                      </tbody>
                    </Table>
                  </Card>

                  {canUpdate ? (
                    <div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
                      <Button className="btn-success-cs" color="default" type="button" size="md" onClick={this.onUpdate}>
                        <span>CẬP NHẬT</span>
                      </Button>
                    </div>
                  ) : null}

                  {Array.isArray(data) && data.length > 0 && (
                    <Pagination
                      data={data}
                      listLength={listLength}
                      totalPage={totalPage}
                      totalElement={totalElement}
                      currentPage={this.state.currentPage > 0 ? this.state.currentPage - 1 : 0}
                      handlePageClick={this.handlePageClick}
                    />
                  )}
                </div>
              </Row>
            )}

            {setAlertContext(statusPopup)}
            {openAlertContext(statusPopup)}
          </Container>

          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </>
    );
  }
}

export default DeclarationInformations;
