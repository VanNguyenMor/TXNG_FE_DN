import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";

import { Col, Input, InputGroup, Label, Row } from "reactstrap";
import Select from "components/Select";
import ImageUploader from "components/ImageUploader/ImageUploader";
import ConversionManagerTable from "components/ConversionManagerTable/ConversionManagerTable";
import { fetchData } from "helpers/fetchData";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // state for tab 1
      materialCodeVal: "",
      materialNameVal: "",
      tradeNameVal: "",
      materialTypeId: 1,
      materialGroupTypeId: null,
      unitVal: "",
      recommendedVal: "",
      originId: null,

      productConversionUnits: [
        { id: 2, unitName: "Đôi", conversionRate: 50, isPrimary: true },
        { id: 5, unitName: "Bộ", conversionRate: 5, isPrimary: false },
      ],

      id: null,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

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
    const { MATERIAL_GROUP_DATA } = this.props;

    if (name === "materialGroupTypeId") {
      const valueAsNumber = Number(value);

      if (!MATERIAL_GROUP_DATA || !Array.isArray(MATERIAL_GROUP_DATA)) {
        console.error(
          "MATERIAL_GROUP_DATA is missing or not an array in props."
        );
        return;
      }

      const selectedGroup = MATERIAL_GROUP_DATA.find(
        (item) => item.id === valueAsNumber
      );

      const newUnitVal = selectedGroup ? selectedGroup.unit : "";

      this.setState({
        materialGroupTypeId: value,
        unitVal: newUnitVal,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
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

  async loadDetailData(id) {
    if (!id) return;

    try {
      const res = await fetchData.materialManagement.getDetail(id);
      console.log(res);
      if (res && res.material) {
        const material = res.material;
        const materialUnits = res.materialUnits;

        const newDataInsert = {
          id: material.id || null,
          name: material.name || "",
          plantingTypeId: material.plantingTypeID || "",
          provinceId: material.provinceID || "",
          districtId: material.districtID || "",
          wardId: material.wardID || "",
          gps: material.gps || {},
          gpsNew: gpsList,
          plantingTypeAttribute: parsedAttributes,
          plantingZoneId: material.id || null,
          fileView: material.images || material.icon || "",
        };

        this.setState({
          detailData: material,
          dataInsert: newDataInsert,
          name: newDataInsert.name,
          plantingTypeId: newDataInsert.plantingTypeId,
          provinceId: newDataInsert.provinceId,
          districtId: newDataInsert.districtId,
          wardId: newDataInsert.wardId,
          gps: newDataInsert.gps,
          gpsNew: newDataInsert.gpsNew,
          area: this.calculateArea(newDataInsert.gpsNew),
          plantingTypeAttribute: newDataInsert.plantingTypeAttribute,
          plantingZoneId: newDataInsert.plantingZoneId,
          fileView: newDataInsert.fileView,
        });

        if (this.props.onLoadDetailData) {
          this.props.onLoadDetailData(newDataInsert);
        }
      }
    } catch (error) {
      console.error("Lỗi khi load detailData:", error);
    }
  }

  componentWillMount() {
    if (this.props.id !== null && this.props.id !== undefined) {
      this.loadDetailData(this.props.id);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.loadDetailData(this.props.id);
    }
  }

  render() {
    const {
      errMessage,
      popupMessage,
      productImageUrlVal,
      materialCodeVal,
      materialNameVal,
      tradeNameVal,
      unitVal,
      recommendedVal,
      productConversionUnits,
      materialTypeId,
    } = this.state;
    const {
      errors,
      isShowForDetail,
      materialGroup,
      ORIGIN_DATA,
      UNITS_DATA,
      MATERIAL_TYPE_DATA,
      nations,
    } = this.props;

    return (
      <div id="detailLoggingAccordion">
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
        <Row className="mt-3">
          <Col md="6">
            <div className={classes.rowItem}>
              <label className="form-control-label">Mã nguyên vật liệu</label>
              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="text"
                    name="materialCodeVal"
                    placeholder="Mã nguyên vật liệu"
                    value={materialCodeVal}
                    required
                    readOnly
                    onChange={this.onChangeValue("materialCodeVal")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.materialCodeVal || ""}
                </p>
              </div>
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Loại nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                className="wrap-insert-or-update-zone-item-select"
                isDisable={isShowForDetail}
                name="materialTypeId"
                title="Chọn loại"
                data={MATERIAL_TYPE_DATA}
                labelName="title"
                val="id"
                defaultValue={materialTypeId}
                handleChange={this.onChangeSelect("materialTypeId")}
              />
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.materialTypeId}
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Tên nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="text"
                    name="materialNameVal"
                    readOnly={isShowForDetail}
                    placeholder="Tên nguyên vật liệu"
                    value={materialNameVal}
                    required
                    onChange={this.onChangeValue("materialNameVal")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.materialNameVal || ""}
                </p>
              </div>
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">Tên thương phẩm</Label>
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="text"
                    name="tradeNameVal"
                    readOnly={isShowForDetail}
                    placeholder="Tên thương phẩm"
                    value={tradeNameVal}
                    onChange={this.onChangeValue("tradeNameVal")}
                  />
                </InputGroup>
                <p className="form-error-message margin-bottom-0">
                  {errors.tradeNameVal || ""}
                </p>
              </div>
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Nhóm nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                className="wrap-insert-or-update-zone-item-select"
                name="materialGroupTypeId"
                isDisable={isShowForDetail}
                title="Chọn nhóm"
                data={materialGroup}
                labelName="name"
                val="id"
                handleChange={this.onChangeValue("materialGroupTypeId")}
              />
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                ĐVT mặc định<b style={{ color: "red" }}>*</b>
              </Label>
              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="text"
                    name="unitVal"
                    value={unitVal}
                    readOnly={isShowForDetail}
                    required
                    onChange={null}
                  />
                </InputGroup>
              </div>
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Xuất xứ<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                className="wrap-insert-or-update-zone-item-select"
                name="originId"
                title="Chọn xuất xứ"
                data={nations}
                labelName="nationName"
                val="id"
                handleChange={this.onChangeValue("originId")}
              />
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.manufacturerId}
            </p>
          </Col>
        </Row>
        <hr className="css-hr" />
        <ConversionManagerTable
          isDisable={isShowForDetail}
          allAvailableUnits={UNITS_DATA}
          initialSelectedUnits={productConversionUnits}
        />
        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">Khuyến cáo</Label>
              <div className={classes.inputArea}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  readOnly
                >
                  <Input
                    type="text"
                    name="recommendedVal"
                    value={recommendedVal}
                    required
                    onChange={null}
                  />
                </InputGroup>
              </div>
            </div>
            <p className="form-error-message margin-bottom-0">
              {errors.recommendedVal}
            </p>
          </Col>
        </Row>

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
