import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Input,
  InputGroup,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import ConversionManagerTable from "components/ConversionManagerTable/ConversionManagerTable";
import Select from "components/Select";
import ImageUploader from "components/ImageUploader/ImageUploader";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { CONFIG_UPDATE_IMG } from "apis";
import ImageGalleryUploader from "components/ImageGalleryUploader/ImageGalleryUploader";
import { fetchData } from "helpers/fetchData";
import { PRODUCT_TYPE_DATES } from "helpers/constant";
import { PRODUCT_EXPIRED_TYPE } from "helpers/constant";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // state for tab 1
      productImageFile: null,
      avatar: Noimg,
      productCodeVal: "",
      barcode: "",
      productName: "",
      selectedFields: [],
      productGroupId: null,
      productCateId: null,
      manufactID: null,
      origin: null,
      unitID: null,
      usageTimeVal: "",
      accordId: null,
      expiredType: null,
      qualityNum: "",
      introduce: "",
      ingredient: "",
      storage: "",
      usage: "",
      usageWarningVal: "",
      packing: "",

      productionProcess: "",
      unitVal: "",
      unitName: "",

      // state 3
      images: [Noimg],
      accreditation: [Noimg],
      certification: [Noimg],

      productConversionUnits: [],

      id: null,
      collapseBaseInfo: true,
      expandedInformation: false,
      tabImage: false,
      // permission modal
      permissionModalOpen: false,
      permissionGroups: [],
      selectedPermissionGroups: [],
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

  componentDidMount() {
    if (this.props.id) {
      this.loadDetailData(this.props.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id && prevProps.id !== this.props.id) {
      this.loadDetailData(this.props.id);
    }
  }

  initStateFromProps(detailData) {
    if (!detailData || !detailData.product) {
      return {};
    }

    const { product, productsUnits, productFields } = detailData;

    // Filter to only include non-main units (isMain === false)
    const filteredUnits = productsUnits
      ? productsUnits.filter((unit) => unit.isMain === false)
      : [];

    const conversionUnits = filteredUnits
      ? filteredUnits.map((unit) => ({
          ...unit,
          value: unit.value ? parseFloat(unit.value) : 0,
        }))
      : [];

    const parseImages = (imgData) => {
      if (!imgData) return [];
      if (Array.isArray(imgData)) return imgData;
      if (typeof imgData === "string") {
        return imgData.split(";").filter((url) => url && url.trim() !== "");
      }
      return [];
    };

    return {
      id: product.id,
      productCodeVal: product.productCode || "",
      barcode: product.barcode || "",
      productName: product.productName || "",

      productGroupId: product.productGroupID || null,
      materialGroupFromApi: product.materialGroupID || null,
      productGroupsId: product.materialGroupID || null,
      productGroupsName:
        product.materialGroupName || product.materialGroup?.name || "",
      manufactID: product.manufactID || null,
      origin: product.origin || null,
      unitID: product.unitID || "",
      typeUsageTimeId: product.typeUsageTimeId || null,
      unitName: product.unitName || "",
      qualityNum: product.qualityNum || "",
      productionProcess: product.productionProcess || "",

      weightVal: product.weight || "",
      expiredNum: product.expiredNum || null,
      expiredUnit: typeof product.expiredUnit !== 'undefined' && product.expiredUnit !== null
        ? Number(product.expiredUnit)
        : null,
      packing: product.packing || "",
      introduce: product.introduce || "",
      ingredient: product.ingredient || "",
      storage: product.storage || "",
      usage: product.usage || "",
      avatar: product.avatar || Noimg,
      productImageFile: null,
      images: parseImages(product.images),
      accreditation: parseImages(product.accreditation),
      certification: parseImages(product.certification),
      isLocked: product.isLocked,
      productConversionUnits: conversionUnits,
      selectedPermissionGroups:
        (product.permissionGroups &&
          product.permissionGroups.map((g) => (g && g.id ? g.id : g))) ||
        product.permissionGroupIds ||
        product.permissions ||
        [],
      selectedFields:
        (productFields && productFields.map((f) => (f && f.id ? f.id : f))) ||
        [],
      // Convert expiredType to number for proper Select matching (PRODUCT_EXPIRED_TYPE has numeric values)
      expiredType:
        typeof product.expiredType !== "undefined" &&
        product.expiredType !== null
          ? Number(product.expiredType)
          : null,
      loading: false,
    };
  }

  async loadDetailData(id) {
    if (!id) return;

    this.setState({ loading: true });
    const response = await fetchData.productManagement.getDetail(id);
    if (response == null) {
      this.setState({ loading: false });
      console.error("Lỗi khi tải dữ liệu chi tiết:", response);
      return;
    }

    // Normalize different possible response shapes from API
    // Possible shapes:
    // 1) { product: {...}, productsUnits: [...], productFields: [...] }
    // 2) { data: { product: {...}, productsUnits: [...], productFields: [...] } }
    // 3) product object directly
    const productFromRes =
      response.product || response.data?.product || response;
    const productsUnits =
      response.productsUnits ||
      response.data?.productsUnits ||
      response.productsUnits ||
      [];
    const productFields =
      response.productFields || response.data?.productFields || [];

    const normalizedDetail = {
      product: productFromRes,
      productsUnits,
      productFields,
    };

    const newState = this.initStateFromProps(normalizedDetail);

    this.setState(newState, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(newState);
      }
      // Mirror mobile: when opening detail, load product types filtered by the product's group
      if (
        this.props.getListProductTypeAddComboBox &&
        newState.productGroupsId
      ) {
        try {
          this.props.getListProductTypeAddComboBox(
            0,
            true,
            newState.productGroupsId
          );
        } catch (err) {
          console.error(
            "Lỗi khi tải loại sản phẩm cho nhóm khi mở chi tiết:",
            err
          );
        }
      }
    });
  }

  handleGalleryImagesChange = (imagesList) => {
    this.setState(
      {
        images: imagesList,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleInspectionInformationChange = (imagesList) => {
    this.setState(
      {
        accreditation: imagesList,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleCertificationInformationChange = (imagesList) => {
    this.setState(
      {
        certification: imagesList,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleEditorChange = (content, editor) => {
    this.setState(
      {
        introduce: content,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleImageUploadSuccess = (file, previewUrl) => {
    // Immediately upload the file and store the returned URL as avatar.
    // This keeps the create/update payload using a URL (not raw binary) like mobile expects.
    if (!file) {
      this.setState({ avatar: previewUrl }, () => {
        this.props.onHandleChangeValue &&
          this.props.onHandleChangeValue(this.state);
      });
      return;
    }

    (async () => {
      try {
        const form = new FormData();
        form.append("files", file, file.name);

        // reuse the upload helper used elsewhere (infoCompany.uploadFile)
        const res = await fetchData.infoCompany.uploadFile(form);

        // Backend returns the full URL directly in res (already unwrapped by fetchData)
        // E.g: "https://txng-cloud-v1.isopro.vn/upload/company/TGI02.C.d1cca030-dfe0-4fd3-8204-7d6adb00cfdf/imgs/TGI02.2025-12-04-11-24-46-754.jpeg"
        const uploadedUrl = res || previewUrl;

        console.log(
          "DEBUG: handleImageUploadSuccess uploadedUrl =",
          uploadedUrl
        );

        this.setState({ productImageFile: null, avatar: uploadedUrl }, () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        });
      } catch (err) {
        // fallback to previewUrl if upload fails
        console.error("Lỗi upload avatar:", err);
        this.setState({ productImageFile: file, avatar: previewUrl }, () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        });
      }
    })();
  };

  toggleModal() {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  }

  togglePermissionModal = async () => {
    const willOpen = !this.state.permissionModalOpen;
    if (
      willOpen &&
      (!this.state.permissionGroups || this.state.permissionGroups.length === 0)
    ) {
      // load groups lazily
      try {
        const groups = await fetchData.material.getGroupList();
        this.setState({ permissionGroups: groups || [] });
      } catch (err) {
        console.error("Lỗi khi tải danh sách nhóm quyền:", err);
      }
    }

    this.setState({ permissionModalOpen: willOpen });
  };

  handlePermissionChange = (value) => {
    // value may be array of ids for multi select
    this.setState({ selectedPermissionGroups: value || [] }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue({
          permissionGroups: this.state.selectedPermissionGroups,
        });
      }
    });
  };

  handleSavePermissionModal = () => {
    // propagate selected permissions to parent and close
    if (this.props.onHandleChangeValue) {
      this.props.onHandleChangeValue({
        permissionGroups: this.state.selectedPermissionGroups,
      });
    }
    this.setState({ permissionModalOpen: false });
  };

  handleFormChange = (newValues) => {
    this.setState((prevState) => ({
      ...prevState,
      ...newValues,
    }));
  };

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();

        clearTimeout(timeOut);
      }, 100);
    }
  };

  onChangeSelect = (name) => (value) => {
    this.setState(
      (prevState) => {
        let newState = {
          ...prevState,
          [name]: value,
        };

        // When product group changes, reset product type/category
        if (name === "productGroupId") {
          newState.productCateId = null;
          // Also keep mobile-compatible keys: productGroupsId and productGroupsName
          const groups = this.props.PRODUCT_GROUP_DATA || [];
          const selectedGroup = groups.find(
            (g) =>
              (g && (g.id || g.materialGroupID || g.materialGroupId)) == value
          );

          newState.productGroupsId = selectedGroup
            ? selectedGroup.id ||
              selectedGroup.materialGroupID ||
              selectedGroup.materialGroupId
            : value;

          newState.productGroupsName = selectedGroup
            ? selectedGroup.name ||
              selectedGroup.materialGroupName ||
              selectedGroup.title ||
              ""
            : "";

          // If the selected group provides a default unit, set unitID/unitName too (mobile does this)
          const units = this.props.UNITS_DATA || [];
          const groupUnitId =
            selectedGroup &&
            (selectedGroup.unitID ||
              selectedGroup.unitId ||
              selectedGroup.defaultUnitID);
          if (groupUnitId) {
            const unit = units.find(
              (u) => (u && (u.id || u.unitID)) == groupUnitId
            );
            if (unit) {
              newState.unitID = unit.id || unit.unitID || unit.unitId;
              newState.unitName = unit.unitName || unit.name || "";
            }
          }
        }

        return newState;
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }

        // After updating selected group, ask parent to reload product types filtered by that group (mobile logic)
        if (
          name === "productGroupId" &&
          this.props.getListProductTypeAddComboBox
        ) {
          const groupId =
            this.state.productGroupsId || this.state.productGroupId || value;
          this.props.getListProductTypeAddComboBox(0, true, groupId);
        }
      }
    );
  };
  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: value,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onChangeSelectType = () => {
    this.resetFieldValue();
  };

  resetFieldValue = () => {
    alert();
  };

  handleFileChange = (files) => {
    this.setState({ file: files[0]?.name || "" });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  calculateTotalAmount = (quantity, price, vatRate) => {
    const subtotal = Number(quantity) * Number(price);
    const vatFactor = 1 + Number(vatRate) / 100;

    const totalAmount = subtotal * vatFactor;

    return Math.round(totalAmount);
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = {
        ...prevState,
        [name]: checked,
      };

      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(newState);
      }

      return newState;
    });
  };

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  };

  onConversionChange = (newUnits) => {
    this.setState({ productConversionUnits: newUnits }, () => {
      this.props.onHandleChangeValue &&
        this.props.onHandleChangeValue(this.state);
    });
  };

  handleSelectedFieldsChange = (value) => {
    // Select component multi-select returns comma-separated string like "1,2,3"
    // Convert to array of IDs for proper handling
    let fieldsArray = [];
    if (value) {
      if (typeof value === "string") {
        fieldsArray = value.split(",").filter((v) => v.trim());
      } else if (Array.isArray(value)) {
        fieldsArray = value;
      }
    }

    this.setState({ selectedFields: fieldsArray }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  };

  render() {
    const {
      errMessage,
      popupMessage,
      collapseBaseInfo,
      productCodeVal,
      barcode,
      productName,
      usageTimeVal,
      qualityNum,
      introduce,
      avatar,
      expandedInformation,
      ingredient,
      unitVal,
      unitID,
      unitName,
      storage,
      usage,
      usageWarningVal,
      packing,
      tabImage,
      images,
      accreditation,
      certification,
      productConversionUnits,
      expiredNum,
      expiredUnit,
      productionProcess,
      selectedFields,
      manufactID,
      expiredType,
      origin,
      productGroupId,
      productCateId,
    } = this.state;
    const {
      errors,
      UNITS_DATA,
      PRODUCT_GROUP_DATA,
      PRODUCT_TYPE_DATA,
      isShowForDetail,
      islocked,
      FIELD_DATA,
      PRODUCT_PARTNER_DATA,
      NATION_DATA,
    } = this.props;

    // Filter product types/categories based on selected group
    // API returns productTypes with materialGroupID that should match productGroupId
    // Prefer the types set by parent via getListProductTypeAddComboBox
    const filteredProductTypes = productGroupId
      ? (PRODUCT_TYPE_DATA || []).filter(
          (ptype) => ptype.materialGroupID === productGroupId
        )
      : PRODUCT_TYPE_DATA || [];

    return (
      <div id="detailLoggingAccordion">
        {isShowForDetail ? (
          <strong
            className="mb-2"
            style={{
              textAlign: "center",
              display: "block",
              backgroundColor: "#db0d0d",
              color: "#fff",
              padding: "8px 12px",
              width: "fit-content",
              fontSize: "14px",
              margin: "0 auto",
            }}
          >
            Thông tin chưa được kiểm chứng và xác thực
          </strong>
        ) : null}
        <Card className="mb-3">
          <CardHeader id="headingBaseInfo" className="p-0 bg-white">
            <Button
              block
              color="link"
              className="text-left d-flex justify-content-between align-items-center"
              onClick={() => this.toggle("collapseBaseInfo")}
              aria-expanded={collapseBaseInfo}
            >
              <span className="text-info">Thông tin chung</span>
              <i
                className={`fas ${
                  collapseBaseInfo ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </Button>
          </CardHeader>

          <Collapse isOpen={collapseBaseInfo}>
            <CardBody className="p-3">
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} mr-b-0 `}>
                    <label className="form-control-label">Hình đại diện</label>
                    <ImageUploader
                      initialImageUrl={avatar || Noimg}
                      onFileSelected={this.handleImageUploadSuccess}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">Mã sản phẩm</Label>

                    <div className={classes.inputArea}>
                      <InputGroup
                        className="input-group-alternative css-border-input"
                        readOnly
                      >
                        <Input
                          type="text"
                          name="productCodeVal"
                          placeholder="Mã sản phẩm"
                          value={productCodeVal}
                          required
                          readOnly
                          onChange={this.onChangeValue("productCodeVal")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col md="6">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">Mã vạch</Label>

                    <div className={classes.inputArea}>
                      <InputGroup
                        className="input-group-alternative css-border-input"
                        readOnly
                      >
                        <Input
                          type="text"
                          name="barcode"
                          placeholder="Mã vạch"
                          value={barcode}
                          onChange={this.onChangeValue("barcode")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.barcode || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Tên sản phẩm<b style={{ color: "red" }}>*</b>
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup
                        className="input-group-alternative css-border-input"
                        readOnly
                      >
                        <Input
                          type="text"
                          readOnly={isShowForDetail}
                          name="productName"
                          placeholder="Tên sản phẩm"
                          value={productName}
                          required
                          onChange={this.onChangeValue("productName")}
                        />
                        {console.log(this.state.productName)}
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productName || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="12">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Ngành nghề<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      isMulti
                      name="selectedFields"
                      isDisable={isShowForDetail}
                      title="Chọn ngành nghề"
                      data={FIELD_DATA}
                      labelName="fieldName"
                      val="id"
                      defaultValue={selectedFields}
                      handleChange={this.handleSelectedFieldsChange}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.selectedFields}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Nhóm sản phẩm<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      isDisable={isShowForDetail}
                      name="productGroupId"
                      title="Chọn nhóm sản phẩm"
                      data={PRODUCT_GROUP_DATA}
                      labelName="name"
                      val="id"
                      handleChange={this.onChangeSelect("productGroupId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.productGroupId}
                  </p>
                </Col>

                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Loại sản phẩm<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="productCateId"
                      isDisable={isShowForDetail || !productGroupId}
                      title="Chọn loại sản phẩm"
                      data={filteredProductTypes}
                      labelName="name"
                      val="id"
                      defaultValue={productCateId}
                      handleChange={this.onChangeSelect("productCateId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.productCateId}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="12">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Nhà sản xuất<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="manufactID"
                      title="Chọn nhà sản xuất"
                      data={PRODUCT_PARTNER_DATA}
                      labelName="partnerName"
                      val="id"
                      defaultValue={manufactID}
                      handleChange={this.onChangeSelect("manufactID")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.manufactID}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Nơi xuất xứ<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="origin"
                      title="Chọn nơi xuất xứ"
                      data={NATION_DATA}
                      labelName="nationName"
                      val="id"
                      defaultValue={origin}
                      handleChange={this.onChangeSelect("origin")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.origin}
                  </p>
                </Col>
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Đơn vị tính nhập/xuất<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="unitID"
                      title="Chọn đơn vị"
                      isDisable={isShowForDetail}
                      data={UNITS_DATA}
                      labelName="unitName"
                      val="id"
                      defaultValue={unitID}
                      handleChange={this.onChangeSelect("unitID")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.unitID}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="6">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Thời hạn sử dụng<b style={{ color: "red" }}>*</b>
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup
                        className="input-group-alternative css-border-input"
                        readOnly
                      >
                        <Input
                          type="number"
                          name="expiredNum"
                          placeholder="Thời hạn sử dụng"
                          readOnly={isShowForDetail}
                          value={expiredNum}
                          required
                          onChange={this.onChangeValue("expiredNum")}
                        />
                      </InputGroup>
                    </div>
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.expiredNum}
                  </p>
                </Col>
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Theo<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="expiredUnit"
                      title="Chọn loại thời hạn"
                      data={PRODUCT_TYPE_DATES}
                      isDisable={isShowForDetail}
                      labelName="label"
                      val="value"
                      defaultValue={expiredUnit}
                      handleChange={this.onChangeSelect("expiredUnit")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.expiredUnit}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Loại thời hạn sử dụng<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="expiredType"
                      title="Chọn loại thời hạn sử dụng"
                      data={PRODUCT_EXPIRED_TYPE}
                      isDisable={isShowForDetail}
                      labelName="label"
                      defaultValue={expiredType}
                      val="value"
                      handleChange={this.onChangeSelect("expiredType")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.expiredType}
                  </p>
                </Col>
                <Col md="6">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Số công bố chất lượng
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup
                        className="input-group-alternative css-border-input"
                        readOnly
                      >
                        <Input
                          type="text"
                          name="qualityNum"
                          placeholder="Số công bố chất lượng"
                          value={qualityNum}
                          required
                          onChange={this.onChangeValue("qualityNum")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.qualityNum || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <hr className="css-hr" />
              <ConversionManagerTable
                isDisable={islocked}
                allAvailableUnits={UNITS_DATA || []}
                initialSelectedUnits={productConversionUnits}
                onChange={this.onConversionChange}
                defaultUnitId={unitID}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card className="mb-3">
          <CardHeader id="headingBaseInfo" className="p-0 bg-white">
            <Button
              block
              color="link"
              className="text-left d-flex justify-content-between align-items-center"
              onClick={() => this.toggle("expandedInformation")}
              aria-expanded={expandedInformation}
            >
              <span className="text-info">Thông tin mở rộng</span>
              <i
                className={`fas ${
                  expandedInformation ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </Button>
          </CardHeader>

          <Collapse isOpen={expandedInformation}>
            <CardBody className="p-3">
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">Giới thiệu</Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("introduce")}
                          initialValue={introduce}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Quy trình sản xuất
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue(
                            "productionProcess"
                          )}
                          initialValue={productionProcess}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">Thành phần</Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("ingredient")}
                          initialValue={ingredient}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Hướng dẫn bảo quản
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("storage")}
                          initialValue={storage}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Hướng dẫn sử dụng
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("usage")}
                          initialValue={usage}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Cảnh báo sử dụng
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("usageWarningVal")}
                          initialValue={usageWarningVal}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className={`${classes.rowItem} ${classes.alignTop}`}>
                    <Label className="form-control-label">
                      Quy cách đóng gói
                    </Label>

                    <div className={classes.inputArea}>
                      <InputGroup className="input-group-alternative css-border-input">
                        <Editor
                          onInit={(_, editor) => {
                            this.refcontentEmailSendToPrinter = editor;
                          }}
                          onEditorChange={this.onChangeValue("packing")}
                          initialValue={packing}
                          init={{
                            width: "100%",
                            height: 300,
                            menubar: false,
                            readonly: false,
                            toolbar:
                              "undo redo | formatselect | image | link | code | " +
                              "bold italic forecolor backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            selector: "textarea#file-picker",
                            plugins: "image code link",
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: "image",
                            file_picker_callback: (cb, value, meta) => {
                              let _this = this;

                              var input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute("accept", "image/*");
                              input.onchange = async function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                  var id = "blobid" + new Date().getTime();
                                  var blobCache =
                                    window.tinymce.activeEditor.editorUpload
                                      .blobCache;
                                  var base64 = reader.result.split(",")[1];
                                  var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                  );
                                  blobCache.add(blobInfo);
                                  cb(blobInfo.blobUri(), { title: file.name });
                                };
                                let data = null;
                                let imageFile = new FormData();
                                let fileLink = null;
                                imageFile.append("files", file);

                                try {
                                  data = await axios({
                                    method: "post",
                                    url: CONFIG_UPDATE_IMG,
                                    headers: {
                                      authorization:
                                        localStorage.getItem("TOKEN"),
                                    },
                                    data: imageFile,
                                  });
                                  if (data.data.status == 200) {
                                    fileLink = data.data.data;
                                    cb(fileLink);
                                  } else {
                                    _this.setState({
                                      messageErr: "Lỗi hệ thống",
                                    });
                                    _this.toggleModal("popupMessage");
                                    return;
                                  }
                                } catch (error) {
                                  _this.setState({
                                    messageErr: "Lỗi hệ thống",
                                  });
                                  _this.toggleModal("popupMessage");
                                  return;
                                }
                              };

                              input.click();
                            },
                          }}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productCodeVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Collapse>
        </Card>

        <Card className="mb-3">
          <CardHeader id="headingBaseInfo" className="p-0 bg-white">
            <Button
              block
              color="link"
              className="text-left d-flex justify-content-between align-items-center"
              onClick={() => this.toggle("tabImage")}
              aria-expanded={tabImage}
            >
              <span className="text-info">Hình ảnh</span>
              <i
                className={`fas ${
                  tabImage ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </Button>
          </CardHeader>

          <Collapse isOpen={tabImage}>
            <CardBody className="p-3">
              <ImageGalleryUploader
                key={`gallery-${images.length}-${this.state.id}`}
                title="Hình ảnh sản phẩm"
                initialImages={images}
                noMutil={true}
                onImagesChange={this.handleGalleryImagesChange}
              />

              <ImageGalleryUploader
                key={`accreditation-${accreditation.length}-${this.state.id}`}
                title="Thông tin kiểm định"
                initialImages={accreditation}
                noMutil={true}
                onImagesChange={this.handleInspectionInformationChange}
              />

              <ImageGalleryUploader
                key={`certification-${certification.length}-${this.state.id}`}
                title="Thông tin chứng nhận"
                noMutil={true}
                initialImages={certification}
                onImagesChange={this.handleCertificationInformationChange}
              />
            </CardBody>
          </Collapse>
        </Card>

        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={errMessage}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default ShowEditData;
