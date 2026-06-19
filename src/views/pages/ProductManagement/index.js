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
import formatFieldsForSelect from "utils/formatFieldsForSelect.js";

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
      warningPopupModal: false,
      deleteId: null,
      STATUS_OPTIONS: [
        { id: 0, title: "Chưa khóa" },
        { id: 1, title: "Đã khóa" },
      ],
      AUTHENTIC_OPTIONS: [
        { id: 0, title: "Chưa xác thực" },
        { id: 1, title: "Đã xác thực" },
      ],
      HISTORY_DATA: [],
      FIELD_DATA: [],
      UNITS_DATA: [],
      PRODUCT_GROUP_DATA: [],
      PRODUCT_TYPE_DATA: [],
      NATION_DATA: [],
      COMPANY_TYPE_LABEL: "",
    };
  }

  componentDidMount() {
    this.fetchSummary();
    this.onFetchDataUnit();
    this.onFetchDataField();
    this.onFetchDataProductGroup();
    this.onFetchDataProductType();
    this.onFetchDataPartner();
    this.onFetchDataNation();
    this.onFetchCompanyType();
  }

  // Mirror mobile: hiển thị dòng "<loại hình DN> tự chịu trách nhiệm..."
  onFetchCompanyType = async () => {
    try {
      const resCurrent = await fetchData.account.getCurrentCompany();
      const companyId = resCurrent?.company?.id;
      if (!companyId) return;

      const detail = await fetchData.infoCompany.detail(companyId);
      const labelMap = { 0: "Doanh nghiệp", 1: "Cá nhân", 2: "Hợp tác xã" };
      this.setState({ COMPANY_TYPE_LABEL: labelMap[detail?.isCompany] || "" });
    } catch (err) {
      console.error("Lỗi khi lấy loại hình công ty:", err);
    }
  };

  onFetchDataUnit = async () => {
    const result = await fetchData.productManagement.getListUnitComboBox();
    const units = result?.units || [];

    this.setState({ UNITS_DATA: units });
  };

  onFetchDataField = async () => {
    const result = await fetchData.productManagement.getListFieldComboBox();
    const fields = result?.fields || [];

    this.setState({ FIELD_DATA: fields });
  };

  onFetchDataProductGroup = async () => {
    const productGroups =
      await fetchData.productManagement.getListMaterialGroup();
    console.log(
      "DEBUG: onFetchDataProductGroup productGroups =",
      productGroups
    );
    this.setState({ PRODUCT_GROUP_DATA: productGroups });
  };

  onFetchDataProductType = async () => {
    const productTypes = await fetchData.productManagement.getListProductType();
    console.log("DEBUG: onFetchDataProductType productTypes =", productTypes);
    this.setState({ PRODUCT_TYPE_DATA: productTypes });
  };

  getListProductTypeAddComboBox = async (
    page = 0,
    init = true,
    filter = ""
  ) => {
    try {
      const payload = {
        search: "",
        filter: filter || "",
        orderBy: "",
        page,
        limit: null,
      };

      const newProductTypes =
        await fetchData.productManagement.getListProductType(payload);
      console.log(
        "DEBUG: getListProductTypeAddComboBox newProductTypes =",
        newProductTypes,
        "filter =",
        filter
      );

      let productTypes = Array.isArray(this.state.PRODUCT_TYPE_DATA)
        ? [...this.state.PRODUCT_TYPE_DATA]
        : [];

      if (newProductTypes.length > 0) {
        productTypes = init
          ? [...newProductTypes]
          : productTypes.concat(newProductTypes);
      } else if (init) {
        productTypes = [];
      }

      this.setState({ PRODUCT_TYPE_DATA: productTypes });

      return productTypes;
    } catch (error) {
      console.error("Lỗi khi lấy loại sản phẩm theo nhóm:", error);
      return [];
    }
  };

  onFetchDataNation = async () => {
    const result = await fetchData.productManagement.getListNationComboBox();
    this.setState({ NATION_DATA: result });
  };

  onFetchDataPartner = async () => {
    const result = await fetchData.productManagement.getListPartnerComboBox();
    // API returns array directly or object with partners property
    const partners = Array.isArray(result)
      ? result
      : result?.partners || result || [];

    this.setState({ PRODUCT_PARTNER_DATA: partners });
  };

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
        totalElement: Math.min(limit, newData.length),
        // Reset phân trang về trang đầu mỗi lần nạp lại để không rơi vào trang trống
        beginItem: 0,
        endItem: limit,
        currentPage: 0,
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

  handleLoadDetailData = (dataInsertFromChild) => {
    this.setState({ dataInsert: dataInsertFromChild });
  };

  onHandleChangeValue = (data) => {
    this.setState((prevState) => ({
      dataInsert: {
        ...prevState.dataInsert,
        ...data,
      },
    }));
  };

  onConfirm = async (toggleModal) => {
    const { dataInsert } = this.state;
    console.log(dataInsert);
    try {
      const uploadSingleFile = async (file, type = "file") => {
        if (!file) return null;
        const uploadFormData = new FormData();
        uploadFormData.append("files", file, file.name);
        try {
          const res = await fetchData.infoCompany.uploadFile(uploadFormData);
          if (res && res.data && res.data.uploadKey) return res.data.uploadKey;
          if (res && res.uploadKey) return res.uploadKey;
          if (typeof res === "string") return res;
          return null;
        } catch (err) {
          console.error("Upload file error:", err);
          return null;
        }
      };

      const uploadAndFormatImages = async (imagesList) => {
        if (
          !imagesList ||
          !Array.isArray(imagesList) ||
          imagesList.length === 0
        ) {
          return "";
        }

        const processed = await Promise.all(
          imagesList.map(async (img) => {
            if (!img) return "";

            if (typeof img === "string") {
              return img.trim();
            }

            if (img instanceof File) {
              return await uploadSingleFile(img);
            }

            if (
              typeof img === "object" &&
              img.file &&
              img.file instanceof File
            ) {
              return await uploadSingleFile(img.file);
            }

            return "";
          })
        );

        return processed.filter((p) => p && p.trim()).join(";");
      };

      const formData = new FormData();
      if (dataInsert.id) formData.append("Id", dataInsert.id);
      formData.append("ProductCode", dataInsert.productCodeVal || "");
      formData.append("ProductName", dataInsert.productName || "");
      formData.append("Barcode", dataInsert.barcode || "");

      const selectedFields = Array.isArray(dataInsert.selectedFields)
        ? dataInsert.selectedFields
        : [];
      console.log(
        "DEBUG: selectedFields =",
        selectedFields,
        "length =",
        selectedFields.length
      );

      selectedFields.forEach((fieldId, index) => {
        const actualFieldId =
          typeof fieldId === "object" && fieldId.id ? fieldId.id : fieldId;
        console.log(`DEBUG: fields[${index}] = ${actualFieldId}`);
        formData.append(`fields[${index}]`, actualFieldId);
      });

      formData.append("UnitID", dataInsert.unitID || dataInsert.unitId || "");
      formData.append("MaterialGroupID", dataInsert.materialGroupId || "");
      formData.append("ProductGroupID", dataInsert.productCateId || "");
      formData.append(
        "ManufactID",
        dataInsert.manufactID || dataInsert.manufactID || ""
      );
      formData.append("Origin", dataInsert.origin || "");
      formData.append("QualityNum", dataInsert.qualityNum || "");
      if (dataInsert.weightVal) {
        formData.append("Weight", String(dataInsert.weightVal));
      }
      if (
        typeof dataInsert.expiredNum !== "undefined" &&
        dataInsert.expiredNum !== null &&
        dataInsert.expiredNum !== ""
      ) {
        formData.append("ExpiredNum", String(dataInsert.expiredNum));
      }
      if (
        typeof dataInsert.expiredUnit !== "undefined" &&
        dataInsert.expiredUnit !== null &&
        dataInsert.expiredUnit !== ""
      ) {
        formData.append("ExpiredUnit", String(dataInsert.expiredUnit));
      }
      if (
        typeof dataInsert.expiredType !== "undefined" &&
        dataInsert.expiredType !== null &&
        dataInsert.expiredType !== ""
      ) {
        formData.append("ExpiredType", String(dataInsert.expiredType));
      }
      formData.append("Introduce", dataInsert.introduce || "");
      formData.append("ProductionProcess", dataInsert.productionProcess || "");
      formData.append("Ingredient", dataInsert.ingredient || "");
      formData.append("Storage", dataInsert.storage || "");
      formData.append("Usage", dataInsert.usage || "");
      formData.append("WarningUsage", dataInsert.usageWarningVal || "");
      formData.append("Packing", dataInsert.packing || "");

      // Avatar handling: upload File when present, otherwise only send avatar if it's a remote URL
      console.log(
        "DEBUG: avatar before submit =",
        dataInsert.avatar,
        "productImageFile =",
        dataInsert.productImageFile
      );
      if (
        dataInsert.productImageFile &&
        dataInsert.productImageFile instanceof File
      ) {
        const avatarKey = await uploadSingleFile(dataInsert.productImageFile);
        if (avatarKey) formData.append("Avatar", avatarKey);
      } else if (dataInsert.avatar && typeof dataInsert.avatar === "string") {
        const avatarStr = dataInsert.avatar.trim();
        if (
          avatarStr.startsWith("http://") ||
          avatarStr.startsWith("https://")
        ) {
          formData.append("Avatar", avatarStr);
        } else {
          console.log(
            "DEBUG: skipping Avatar append because value is not a remote URL:",
            avatarStr
          );
        }
      }

      const imagesStr = await uploadAndFormatImages(dataInsert.images || []);
      if (imagesStr) formData.append("Images", imagesStr);

      const accreditationStr = await uploadAndFormatImages(
        dataInsert.accreditation || []
      );
      if (accreditationStr) formData.append("Accreditation", accreditationStr);

      const certificationStr = await uploadAndFormatImages(
        dataInsert.certification || []
      );
      if (certificationStr) formData.append("Certification", certificationStr);

      const productUnits = Array.isArray(dataInsert.productConversionUnits)
        ? dataInsert.productConversionUnits
        : [];
      (productUnits || []).forEach((unit, index) => {
        const unitId = unit.id || "";
        const name = unit.unitName || unit.title || "";
        const value = unit.conversionRate
          ? String(unit.conversionRate).replace(".", ",")
          : "1";
        const isReport = unit.isReport ? true : false;

        formData.append(`productUnits[${index}][unitId]`, unitId);
        formData.append(`productUnits[${index}][name]`, name);
        formData.append(`productUnits[${index}][value]`, value);
        formData.append(`productUnits[${index}][isReport]`, isReport);

        formData.append(`materialUnits[${index}][unitId]`, unitId);
        formData.append(`materialUnits[${index}][name]`, name);
        formData.append(`materialUnits[${index}][value]`, value);
        formData.append(`materialUnits[${index}][isReport]`, isReport);
      });

      const result = dataInsert.id
        ? await fetchData.productManagement.update(formData)
        : await fetchData.productManagement.create(formData);

      const isSuccess =
        result &&
        (result.status === 200 ||
          result.status === 201 ||
          result.status === true ||
          result.status === "true");

      if (isSuccess) {
        const defaultMsg = dataInsert.id
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm mới sản phẩm thành công!";
        toast.success(result.message || defaultMsg, { autoClose: 3000 });
        toggleModal && toggleModal();
        this.fetchSummary();
      } else {
        const errorMsg =
          (result && (result.message || result.data?.message)) ||
          "Có lỗi xảy ra";
        toast.error(errorMsg, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu sản phẩm:", error);
      toast.error("Lỗi gửi dữ liệu sản phẩm", { autoClose: 3000 });
      openAlertContext("Lỗi gửi dữ liệu sản phẩm");
    }
  };

  onShowHistoryModal = (item) => {
    console.log(item, "====================")
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
      console.log("DEBUG: Locking product id =", item.id);
      const result = await fetchData.productManagement.updateLock(item.id);
      console.log("DEBUG toggleLock result =", result);

      if (result) {
        this.setState((prevState) => ({
          data: prevState.data.map((product) =>
            product.id === item.id ? { ...product, islocked: true } : product
          ),
        }));

        toast.success("Khóa sản phẩm thành công!", { autoClose: 3000 });

        setTimeout(() => {
          this.fetchSummary();
        }, 500);
      } else {
        toast.error("Khóa sản phẩm thất bại", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Lỗi khóa sản phẩm:", error);
      toast.error("Lỗi hệ thống, vui lòng thử lại!", { autoClose: 3000 });
    }
  };

  deleteProduct = async (id = this.state.deleteId) => {
    if (!id) return;

    try {
      const result = await fetchData.productManagement.delete(id);
      console.log("DEBUG deleteProduct result =", result);

      if (result && result.status === 200) {
        toast.success("Xoá sản phẩm thành công!");
        this.toggleModalPopupDelete();

        setTimeout(() => {
          this.fetchSummary();
        }, 500);
      } else {
        const errorMessage = result?.message || "Xóa sản phẩm thất bại";
        toast.error(errorMessage);
        this.toggleModalPopupDelete();
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      toast.error("Lỗi xóa sản phẩm, vui lòng thử lại!", { autoClose: 3000 });
      this.toggleModalPopupDelete();
    }
  };

  onDeleteProduct = (id) => () => {
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
                src={e.avatar || NoImg}
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
                      {e.islocked == true ? null : (
                        <DropdownItem onClick={() => this.toggleLock(e)}>
                          Khóa sản phẩm
                        </DropdownItem>
                      )}
                      {e.islocked == true ? null : (
                        <DropdownItem onClick={this.onDeleteProduct(e.id)}>
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
      currentPage,
      isShowForDetail,
      isShowForHistoryList,
      editId,
      errorInserts,
      HISTORY_DATA,
      islocked,
      UNITS_DATA,
      FIELD_DATA,
      PRODUCT_GROUP_DATA,
      PRODUCT_TYPE_DATA,
      PRODUCT_PARTNER_DATA,
      NATION_DATA,
      warningPopupModal,
      message,
      COMPANY_TYPE_LABEL,
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
                dataReload={this.fetchSummary}
                onConfirm={this.onConfirm}
                hideReload={false}
                isShowForEdit={isShowForDetail || isShowForHistoryList}
                isReadOnly={isShowForHistoryList}
                closeForm={this.onCloseModal}
                moduleBody={
                  <div>
                    {isShowForDetail ? (
                      <ShowEditData
                        id={editId}
                        errors={errorInserts}
                        UNITS_DATA={UNITS_DATA}
                        FIELD_DATA={FIELD_DATA}
                        islocked={islocked}
                        PRODUCT_GROUP_DATA={PRODUCT_GROUP_DATA}
                        PRODUCT_TYPE_DATA={PRODUCT_TYPE_DATA}
                        PRODUCT_PARTNER_DATA={PRODUCT_PARTNER_DATA}
                        NATION_DATA={NATION_DATA}
                        onHandleChangeValue={this.onHandleChangeValue}
                        getListProductTypeAddComboBox={
                          this.getListProductTypeAddComboBox
                        }
                        onLoadDetailData={this.handleLoadDetailData}
                        companyTypeLabel={COMPANY_TYPE_LABEL}
                        isShowForDetail={true}
                      />
                    ) : isShowForHistoryList ? (
                      <ShowHistoryData id={editId} historyData={HISTORY_DATA} />
                    ) : (
                      <ShowEditData
                        errors={errorInserts}
                        UNITS_DATA={UNITS_DATA}
                        FIELD_DATA={FIELD_DATA}
                        PRODUCT_GROUP_DATA={PRODUCT_GROUP_DATA}
                        PRODUCT_TYPE_DATA={PRODUCT_TYPE_DATA}
                        PRODUCT_PARTNER_DATA={PRODUCT_PARTNER_DATA}
                        NATION_DATA={NATION_DATA}
                        onHandleChangeValue={this.onHandleChangeValue}
                        getListProductTypeAddComboBox={
                          this.getListProductTypeAddComboBox
                        }
                        isShowForDetail={false}
                      />
                    )}
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
                currentPage={currentPage > 0 ? currentPage - 1 : 0}
                handlePageClick={this.handlePageClick}
              />
            </div>
          </Row>
        )}
        <WarningPopup
          moduleTitle="Thông báo"
          moduleBody={
            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
              Bạn đồng ý xóa sản phẩm này?
            </p>
          }
          warningPopupModal={warningPopupModal}
          toggleModal={this.toggleModalPopupDelete}
          handleWarning={this.deleteProduct}
        />
        <ToastContainer position="top-center" autoClose={3000} />
      </Container>
    );
  }
}

export default ProductManagement;
