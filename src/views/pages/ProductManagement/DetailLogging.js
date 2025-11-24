import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";
import Validate from "react-validate-form";

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
} from "reactstrap";
import ConversionManagerTable from "components/ConversionManagerTable/ConversionManagerTable";
import Select from "components/Select";
import ImageUploader from "components/ImageUploader/ImageUploader";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { CONFIG_UPDATE_IMG } from "apis";
import ImageGalleryUploader from "components/ImageGalleryUploader/ImageGalleryUploader";

class DetailLogging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // state for tab 1
      productImageFile: null,
      productImageUrlVal: Noimg,
      productCodeVal: "",
      barcodeVal: "",
      productNameVal: "",
      professionId: null,
      productGroupId: null,
      productCateId: null,
      manufacturerId: null,
      originId: null,
      unitId: null,
      usageTimeVal: "",
      accordId: null,
      typeUsageTimeId: null,
      qualityNumberVal: "",
      introduceVal: "",
      productionProcessVal: "",
      ingredientVal: "",
      storageInstructionsVal: "",
      instructionsForUseVal: "",
      usageWarningVal: "",
      packingSpecificationVal: "",

      // state 3
      productGalleryImages: [Noimg],
      inspectionInformationImages: [Noimg],
      certificationInformation: [Noimg],

      productConversionUnits: [
        { id: 2, unitName: "Đôi", conversionRate: 50, isPrimary: true },
        { id: 5, unitName: "Bộ", conversionRate: 5, isPrimary: false },
      ],

      id: null,
      collapseBaseInfo: true,
      expandedInformation: false,
      tabImage: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

  handleGalleryImagesChange = (imagesList) => {
    this.setState(
      {
        productGalleryImages: imagesList,
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
        inspectionInformationImages: imagesList,
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
        certificationInformation: imagesList,
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
        introduceVal: content,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleImageUploadSuccess = (file, previewUrl) => {
    this.setState(
      {
        productImageFile: file,
        productImageUrlVal: previewUrl,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  toggleModal() {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  }

  handleFormChange = (newValues) => {
    this.setState((prevState) => ({
      ...prevState,
      ...newValues,
    }));
  };

  async componentDidMount() {
    const { onHandleChangeValue } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }
    this.setState(
      (previousState) => {
        return {
          ...previousState,
        };
      },
      () => {
        if (onHandleChangeValue) {
          onHandleChangeValue(this.state);
        }
      }
    );

    this.focusInput();
  }

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
          ...(name === "importTypeId"
            ? {
                ingredientId: null,
                jobId: null,
                warehouseId: null,
                quantity: 0,
                vat: 0,
                price: 0,
                unit: "",
                inventory: 0,
              }
            : {}),
        };

        if (name === "ingredientId") {
          const selected = prevState.INGREDIENT_LIST.find((i) => i.id == value);

          if (selected) {
            newState = {
              ...newState,
              quantity: selected.quantity,
              unit: selected.unit !== null ? selected.unit : "",
              warehouseId:
                selected.warehouseId !== null ? selected.warehouseId : null,
            };
          }
        }

        return newState;
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
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

  render() {
    const {
      errMessage,
      popupMessage,
      collapseBaseInfo,
      productCodeVal,
      barcodeVal,
      productNameVal,
      usageTimeVal,
      qualityNumberVal,
      introduceVal,
      productImageUrlVal,
      expandedInformation,
      productionProcessVal,
      ingredientVal,
      storageInstructionsVal,
      instructionsForUseVal,
      usageWarningVal,
      packingSpecificationVal,
      tabImage,
      productGalleryImages,
      inspectionInformationImages,
      certificationInformation,
    } = this.state;
    const {
      errors,
      UNITS_DATA,
      JOB_DATA,
      PRODUCT_GROUP_DATA,
      PRODUCT_CATE_DATA,
      MANUFACTURER_DATA,
      ORIGIN_DATA,
      UNIT_DATA,
      DATE_DATA,
      USAGE_TIME_TYPE_DATA,
      isShowForDetail,
    } = this.props;

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
                      initialImageUrl={productImageUrlVal || Noimg}
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
                          name="barcodeVal"
                          placeholder="Mã vạch"
                          value={barcodeVal}
                          onChange={this.onChangeValue("barcodeVal")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.barcodeVal || ""}
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
                          name="productNameVal"
                          placeholder="Tên sản phẩm"
                          value={productNameVal}
                          required
                          onChange={this.onChangeValue("productNameVal")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.productNameVal || ""}
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
                      name="professionId"
                      isDisable={isShowForDetail}
                      title="Chọn ngành nghề"
                      data={JOB_DATA}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeValue("professionId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.professionId}
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
                      labelName="title"
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
                      isDisable={isShowForDetail}
                      title="Chọn loại sản phẩm"
                      data={PRODUCT_CATE_DATA}
                      labelName="title"
                      val="id"
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
                      name="manufacturerId"
                      title="Chọn nhà sản xuất"
                      data={MANUFACTURER_DATA}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect("manufacturerId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.manufacturerId}
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
                      name="originId"
                      title="Chọn nơi xuất xứ"
                      data={ORIGIN_DATA}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect("originId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.originId}
                  </p>
                </Col>
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Đơn vị tính nhập/xuất<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="unitId"
                      title="Chọn đơn vị"
                      isDisable={isShowForDetail}
                      data={UNIT_DATA}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect("unitId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.unitId}
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
                          type="text"
                          name="usageTimeVal"
                          placeholder="Thời hạn sử dụng"
                          readOnly={isShowForDetail}
                          value={usageTimeVal}
                          required
                          onChange={this.onChangeValue("usageTimeVal")}
                        />
                      </InputGroup>
                    </div>
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.usageTimeVal}
                  </p>
                </Col>
                <Col md="6">
                  <div className={classes.rowItem}>
                    <label className="form-control-label">
                      Theo<b style={{ color: "red" }}>*</b>
                    </label>
                    <Select
                      className="wrap-insert-or-update-zone-item-select"
                      name="accordId"
                      title="Chọn loại thời hạn"
                      data={DATE_DATA}
                      isDisable={isShowForDetail}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect("accordId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.accordId}
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
                      name="typeUsageTimeId"
                      title="Chọn loại thời hạn sử dụng"
                      data={USAGE_TIME_TYPE_DATA}
                      isDisable={isShowForDetail}
                      labelName="title"
                      val="id"
                      handleChange={this.onChangeSelect("typeUsageTimeId")}
                    />
                  </div>
                  <p className="form-error-message margin-bottom-0">
                    {errors.typeUsageTimeId}
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
                          name="qualityNumberVal"
                          placeholder="Số công bố chất lượng"
                          value={qualityNumberVal}
                          required
                          onChange={this.onChangeValue("qualityNumberVal")}
                        />
                      </InputGroup>
                      <p className="form-error-message margin-bottom-0">
                        {errors.qualityNumberVal || ""}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <hr className="css-hr" />
              <ConversionManagerTable
                isDisable={isShowForDetail}
                allAvailableUnits={UNITS_DATA}
                initialSelectedUnits={this.state.productConversionUnits}
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
                          onEditorChange={this.onChangeValue("introduceVal")}
                          initialValue={introduceVal}
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
                            "productionProcessVal"
                          )}
                          initialValue={productionProcessVal}
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
                          onEditorChange={this.onChangeValue("ingredientVal")}
                          initialValue={ingredientVal}
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
                          onEditorChange={this.onChangeValue(
                            "storageInstructionsVal"
                          )}
                          initialValue={storageInstructionsVal}
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
                          onEditorChange={this.onChangeValue(
                            "instructionsForUseVal"
                          )}
                          initialValue={instructionsForUseVal}
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
                          onEditorChange={this.onChangeValue(
                            "packingSpecificationVal"
                          )}
                          initialValue={packingSpecificationVal}
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
                title="Hình ảnh sản phẩm"
                initialImages={productGalleryImages}
                onImagesChange={this.handleGalleryImagesChange}
              />

              <ImageGalleryUploader
                title="Thông tin kiểm định"
                initialImages={inspectionInformationImages}
                onImagesChange={this.handleInspectionInformationChange}
              />

              <ImageGalleryUploader
                title="Thông tin kiểm định"
                initialImages={certificationInformation}
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

export default DetailLogging;
