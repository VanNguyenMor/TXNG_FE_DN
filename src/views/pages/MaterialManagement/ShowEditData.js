import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";

import {
  Col,
  Input,
  InputGroup,
  Label,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import Select from "components/Select";
import ConversionManagerTable from "components/ConversionManagerTable/ConversionManagerTable";
import { fetchData } from "helpers/fetchData";

class ShowEditData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      materialCodeVal: "",
      materialNameVal: "",
      tradeNameVal: "",
      materialType: "1",
      materialGroupTypeId: null,
      materialGroupName: "",
      unitVal: "",
      unitName: "",
      islocked: null,
      recommendedVal: "",
      quarantine: null,
      origin: null,
      nationName: "",
      productConversionUnits: [],
      fileView: null,
      file: null,
      errors: {},
      errMessage: "",
      popupMessage: "",
      id: null,
      materialGroupIDFromApi: null,
    };

    this.refFileImage = null;
  }

  componentDidMount() {
    this.initStateFromProps();
    if (this.props.id) {
      this.loadDetailData(this.props.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.id !== this.props.id ||
      prevProps.initialData !== this.props.initialData
    ) {
      this.initStateFromProps();
      if (this.props.id) {
        this.loadDetailData(this.props.id);
      }
    }

    if (prevProps.materialGroup !== this.props.materialGroup) {
      const { materialGroupTypeId, materialGroupIDFromApi } = this.state;
      const groupKey = materialGroupTypeId || materialGroupIDFromApi;
      if (groupKey) {
        const selected = this.props.materialGroup?.find(
          (g) => String(g.id || g.Id) === String(groupKey)
        );
        if (selected) {
          const unitVal = selected.unitID || selected.unitId || "";
          const unitName = selected.unitName || selected.UnitName || "";
          const materialGroupName = selected.name || selected.Name || "";
          if (
            materialGroupName !== this.state.materialGroupName ||
            unitVal !== this.state.unitVal ||
            unitName !== this.state.unitName ||
            String(selected.id || selected.Id) !==
              String(this.state.materialGroupTypeId)
          ) {
            this.setState(
              {
                materialGroupTypeId: String(selected.id || selected.Id),
                materialGroupName,
                unitVal,
                unitName,
              },
              () => {
                this.props.onHandleChangeValue &&
                  this.props.onHandleChangeValue({
                    ...this.state,
                    materialTypeId: this.state.materialType,
                  });
              }
            );
          }
        }
      }
    }
  }

  initStateFromProps = () => {
    const { initialData } = this.props;
    if (initialData) {
      this.setState(
        (prevState) => ({
          ...prevState,
          ...{
            materialCodeVal: initialData.materialCodeVal || "",
            materialNameVal: initialData.materialNameVal || "",
            tradeNameVal: initialData.tradeNameVal || "",
            materialType: initialData.materialType
              ? String(initialData.materialType)
              : "1",
            materialGroupTypeId: initialData.materialGroupTypeId
              ? String(initialData.materialGroupTypeId)
              : null,
            materialGroupName: initialData.materialGroupName || "",
            unitVal: initialData.unitVal || "",
            islocked: initialData.islocked,
            unitName: initialData.unitName || "",
            recommendedVal: initialData.recommendedVal || "",
            origin: initialData.origin
              ? String(initialData.origin)
              : null,
            nationName: initialData.nationName || "",
            productConversionUnits: initialData.productConversionUnits || [],
            file: initialData.file || null,
            fileView: initialData.fileView || null,
            quarantine: initialData.quarantine || null,
            id: initialData.id || null,
          },
        }),
        () => {
          this.props.onHandleChangeValue &&
            this.props.onHandleChangeValue(this.state);
        }
      );
    }
  };

  loadDetailData = async (id) => {
    if (!id) return;

    this.setState({ loading: true });

    try {
      const res = await fetchData.materialManagement.getDetail(id);
      const material = res.material || {};
      const materialUnits = res.materialUnits || [];
      const materialGroupID = material.materialGroupID || null;

      const selectedGroup = this.props.materialGroup?.find(
        (g) => String(g.id || g.Id) === String(materialGroupID)
      );

      const newData = {
        id: id,
        materialCodeVal: material.code || "",
        materialNameVal: material.materialName || "",
        tradeNameVal: material.tradeName || "",
        materialType: material.materialType
          ? String(material.materialType)
          : "1",
        materialGroupTypeId: materialGroupID ? String(materialGroupID) : null,
        materialGroupIDFromApi: materialGroupID
          ? String(materialGroupID)
          : null,
        materialGroupName: selectedGroup
          ? selectedGroup.name || selectedGroup.Name
          : material.materialGroupName || "",
        unitVal: selectedGroup
          ? selectedGroup.unitID || selectedGroup.unitId
          : material.unitID || "",
        unitName: selectedGroup
          ? selectedGroup.unitName || selectedGroup.UnitName
          : material.unitName || "",
        recommendedVal: material.recommended || "",
        islocked: material.islocked || false,
        origin: material.nation ? String(material.nation) : null,
        fileView: material.images || null,
        quarantine: material.quarantine || null,
        productConversionUnits: materialUnits
          .filter((u) => !u.isMain)
          .map((u) => ({
            id: u.unitID,
            unitName: u.unitName,
            conversionRate: u.value || 1,
            isPrimary: u.isReport || false,
          })),
      };

      this.setState({ ...newData, loading: false }, () => {
        this.props.onLoadDetailData && this.props.onLoadDetailData(newData);
        this.props.onHandleChangeValue &&
          this.props.onHandleChangeValue(this.state);
      });
    } catch (error) {
      console.error("Fetch detail material error:", error);
      this.setState({
        loading: false,
        errMessage: "Lỗi tải dữ liệu chi tiết.",
      });
    }
  };

  onChangeSelect = (name) => (value) => {
    const selectValue =
      value !== null && value !== undefined ? String(value) : null;

    if (name === "materialType") {
      this.setState({ materialType: selectValue }, () => {
        this.props.onHandleChangeValue &&
          this.props.onHandleChangeValue(this.state);
      });
      return;
    }

    if (name === "producerId") {
      const selected = this.props.partners?.find(
        (p) => String(p.id) === selectValue
      );
      this.setState(
        { producerId: selectValue, producerName: selected?.partnerName || "" },
        () => {
          this.props.onHandleChangeValue &&
            this.props.onHandleChangeValue(this.state);
        }
      );
      return;
    }

    if (name === "materialGroupTypeId") {
      const selected = this.props.materialGroup?.find(
        (g) => String(g.id || g.Id) === selectValue
      );
      this.setState(
        {
          materialGroupTypeId: selectValue,
          materialGroupName: selected?.name || "",
          unitVal: selected?.unitID || selected?.unitId || "",
          unitName: selected?.unitName || selected?.UnitName || "",
        },
        () => {
          this.props.onHandleChangeValue &&
            this.props.onHandleChangeValue(this.state);
        }
      );
      return;
    }

    if (name === "origin") {
      const selected = this.props.nations?.find(
        (n) => String(n.id) === selectValue
      );

      this.setState(
        {
          origin: selectValue,
          nationName: selected?.nationName || "",
        },
        () => {
          this.props.onHandleChangeValue &&
            this.props.onHandleChangeValue(this.state);
        }
      );
      return;
    }
  };

  onChangeValue = (name) => (e) => {
    const value = e && e.target ? e.target.value : e;
    this.setState({ [name]: value }, () => {
      this.props.onHandleChangeValue &&
        this.props.onHandleChangeValue(this.state);
    });
  };

  handleChangeIMG = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.setState({ fileView: URL.createObjectURL(file), file }, () => {
        this.props.onHandleChangeValue &&
          this.props.onHandleChangeValue(this.state);
      });
    } else {
      this.setState({ fileView: null, file: null }, () => {
        this.props.onHandleChangeValue &&
          this.props.onHandleChangeValue(this.state);
      });
    }
  };

  onUpdateFileImage = () => {
    if (this.refFileImage) this.refFileImage.click();
  };

  onDeleImg = () => {
    this.setState({ file: null, fileView: null }, () => {
      this.props.onHandleChangeValue &&
        this.props.onHandleChangeValue(this.state);
    });
  };

  onConversionChange = (newUnits) => {
    this.setState({ productConversionUnits: newUnits }, () => {
      this.props.onHandleChangeValue &&
        this.props.onHandleChangeValue(this.state);
    });
  };

  render() {
    const { materialGroup, nations, UNITS_DATA } = this.props;
    const {
      loading,
      materialCodeVal,
      materialNameVal,
      tradeNameVal,
      materialGroupTypeId,
      materialType,
      unitVal,
      unitName,
      recommendedVal,
      origin,
      productConversionUnits,
      fileView,
      errMessage,
      popupMessage,
      islocked,
    } = this.state;

    const errors = this.props.errors || {};

    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spinner color="primary" />
        </div>
      );
    }

    return (
      <div id="detailLoggingAccordion">
        <Row className="mb-3">
          <Col md="12">
            <div className={`${classes.rowItem} mr-b-0`}>
              <label className="form-control-label">Hình đại diện</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 100, height: 100 }}>
                  <input
                    type="file"
                    ref={(r) => (this.refFileImage = r)}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={this.handleChangeIMG}
                  />
                  <img
                    src={fileView || Noimg}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <Button disabled={islocked} onClick={this.onUpdateFileImage}>
                    Chọn hình
                  </Button>{" "}
                  {fileView && (
                    <Button
                      disabled={islocked}
                      color="danger"
                      onClick={this.onDeleImg}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md="6">
            <div className={classes.rowItem}>
              <label className="form-control-label">Mã nguyên vật liệu</label>
              <InputGroup
                className="input-group-alternative css-border-input"
                readOnly
              >
                <Input type="text" value={materialCodeVal} readOnly />
              </InputGroup>
              <p className="form-error-message">
                {errors.materialCodeVal || ""}
              </p>
            </div>
          </Col>

          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Tên nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  type="text"
                  readOnly={islocked}
                  value={materialNameVal}
                  onChange={this.onChangeValue("materialNameVal")}
                />
              </InputGroup>
              <p className="form-error-message">
                {errors.materialNameVal || ""}
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Loại nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                className="wrap-insert-or-update-zone-item-select"
                name="materialType"
                isDisable={islocked}
                title="Chọn loại"
                data={[
                  { id: "1", name: "Loại thông thường" },
                  { id: "2", name: "Loại đặc biệt" },
                ]}
                labelName="name"
                val="id"
                handleChange={this.onChangeSelect("materialType")}
                defaultValue={materialType}
              />
              <p className="form-error-message">{errors.materialType}</p>
            </div>
          </Col>
        </Row>
        {materialType !== "1" && (
          <Row className="mt-3">
            <Col md="12">
              <div className={classes.rowItem}>
                <Label className="form-control-label">Số ngày cách ly</Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="number"
                    readOnly={islocked}
                    value={this.state.quarantine || ""}
                    onChange={this.onChangeValue("quarantine")}
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
        )}

        <Row className="mt-3">
          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Nhóm nguyên vật liệu<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                name="materialGroupTypeId"
                title="Chọn nhóm"
                data={materialGroup || []}
                isDisable={islocked}
                labelName="name"
                val="id"
                handleChange={this.onChangeSelect("materialGroupTypeId")}
                defaultValue={materialGroupTypeId || null}
              />
              <p className="form-error-message">{errors.materialGroupTypeId}</p>
            </div>
          </Col>

          <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                ĐVT mặc định<b style={{ color: "red" }}>*</b>
              </Label>
              <InputGroup
                className="input-group-alternative css-border-input"
                readOnly
              >
                <Input type="text" value={unitName || unitVal} readOnly />
              </InputGroup>
              <p className="form-error-message">{errors.unitVal}</p>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          {/* <Col md="6">
            <div className={classes.rowItem}>
              <Label className="form-control-label">Nhà cung cấp</Label>
              <Select
                name="producerId"
                title="Chọn nhà cung cấp"
                data={this.props.partners || []}
                isDisable={islocked}
                labelName="partnerName"
                val="id"
                handleChange={this.onChangeSelect("producerId")}
                defaultValue={this.state.producerId || null}
              />
            </div>
          </Col> */}
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">
                Xuất xứ<b style={{ color: "red" }}>*</b>
              </Label>
              <Select
                name="origin"
                title="Chọn xuất xứ"
                data={nations || []}
                isDisable={islocked}
                labelName="nationName"
                val="id"
                handleChange={this.onChangeSelect("origin")}
                defaultValue={origin || null}
              />
              <p className="form-error-message">{errors.origin}</p>
            </div>
          </Col>
        </Row>

        <hr className="css-hr" />

        <ConversionManagerTable
          isDisable={islocked}
          allAvailableUnits={UNITS_DATA || []}
          initialSelectedUnits={productConversionUnits}
          onChange={this.onConversionChange}
          defaultUnitId={unitVal || unitName}
        />

        <Row className="mt-3">
          <Col md="12">
            <div className={classes.rowItem}>
              <Label className="form-control-label">Khuyến cáo</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  type="text"
                  readOnly={islocked}
                  value={recommendedVal}
                  onChange={this.onChangeValue("recommendedVal")}
                />
              </InputGroup>
              <p className="form-error-message">{errors.recommendedVal}</p>
            </div>
          </Col>
        </Row>

        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={errMessage}
          toggleModal={() =>
            this.setState({ popupMessage: "", errMessage: "" })
          }
        />
      </div>
    );
  }
}

export default ShowEditData;
