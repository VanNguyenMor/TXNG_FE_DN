import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import ReactDatetime from "react-datetime";
import moment from "moment";

import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import { fetchData } from "helpers/fetchData";


class InsertOrUpdate extends Component {
  constructor(props) {
    super(props);

    const today = moment().format("DD/MM/YYYY");

    this.state = {
      id: null,
      batchNum: "",
      traceId: null,
      traceName: "",
      traceInformId: null,
      productId: null,
      productName: "",
      quantity: "",
      quantityRemain: 0,
      unitId: null,
      unitName: "",
      plantingZoneId: null,
      plantingZoneName: "",
      batchCategoryId: null,
      batchCategoryDescription: "",
      dateStart: today,
      dateExpire: "",
      note: "",
      files: [],
      qrCodeList: [],
      stampRangeId: null,
      numberFrom: "",
      numberTo: "",
      warehouseId: null,
      wareHouseName: "",
      exportType: 0, // 0: Trong nước, 1: Nước ngoài
      provinceId: null,
      countryId: null,
      status: 0,
      confirmedReason: "",
      confirmedByName: "",
      confirmedDate: "",
      isReused: false,
      content1: "",
      content2: "",
      
      // Dropdown data
      traces: [],
      products: [],
      units: [],
      plantingZones: [],
      batchCategories: [],
      stampRanges: [],
      warehouses: [],
      nations: [],
      provinces: [],
      
      // UI states
      errors: {},
      isLoading: false,
      isShowPlantingZone: false,
      showConfirmModal: false,
      showUnConfirmModal: false,
    };
  }

  componentDidMount() {
    this.loadInitialData();
    const { batchId } = this.props;
    if (batchId) {
      this.loadBatchDetail(batchId);
    }
  }

  loadInitialData = async () => {
    try {
      this.setState({ isLoading: true });
      
      // Load traces (diary/harvest data)
      const tracesData = await fetchData.consignments.getListTraceComboBox();
      
      // Load batch categories
      const batchCategoriesData = await fetchData.consignments.getBatchCategories();
      
      // Load stamp ranges
      const stampRangesData = await fetchData.consignments.getStampRange();
      
      // Load warehouses
      const warehousesData = await fetchData.consignments.getListWarehouseForUpdate();
      
      // Load nations
      const nationsData = await fetchData.consignments.getNationComboBox();
      
      // Load provinces
      const provincesData = await fetchData.consignments.getProvinceComboBox();
      
      this.setState({
        traces: tracesData || [],
        batchCategories: batchCategoriesData || [],
        stampRanges: stampRangesData || [],
        warehouses: warehousesData || [],
        nations: nationsData || [],
        provinces: provincesData || [],
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu ban đầu:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadBatchDetail = async (batchId) => {
    try {
      this.setState({ isLoading: true });
      const batchData = await fetchData.consignments.getDetailConsignment(batchId);
      
      if (batchData) {
        // Parse data and populate form
        this.setState((prevState) => {
          const trace = prevState.traces.find(t => t.id === batchData.traceId);
          const traceInformId = trace?.traceInformId;
          
          return {
            id: batchData.id,
            batchNum: batchData.batchNumber || "",
            traceId: batchData.traceId,
            traceName: batchData.traceName || "",
            traceInformId: traceInformId,
            productId: batchData.productId,
            productName: batchData.productName || "",
            quantity: (batchData.quantity || "").toString(),
            quantityRemain: batchData.quantityRemain || 0,
            unitId: batchData.unitId,
            unitName: batchData.unitName || "",
            plantingZoneId: batchData.plantingZoneId,
            plantingZoneName: batchData.plantingZoneName || "",
            batchCategoryId: batchData.batchCategoryId,
            dateStart: batchData.requestedDate || "",
            dateExpire: batchData.expiredDate || "",
            note: batchData.note || "",
            status: batchData.status || 0,
            confirmedReason: batchData.confirmedReason || "",
            confirmedByName: batchData.confirmedByName || "",
            confirmedDate: batchData.confirmedDate || "",
          };
        }, () => {
          // After setting trace, load related dropdown data
          if (this.state.traceInformId) {
            this.loadPlantingZones(this.state.traceInformId);
            this.loadUnitsByProduct(this.state.productId);
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết batch:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadPlantingZones = async (traceInformId) => {
    try {
      const zones = await fetchData.consignments.getListPlantingZoneByTraceInform(traceInformId);
      this.setState({
        plantingZones: zones || [],
        isShowPlantingZone: zones && zones.length > 0,
      });
    } catch (error) {
      console.error("Lỗi khi tải vùng trồng:", error);
    }
  };

  loadUnitsByProduct = async (productId) => {
    try {
      const units = await fetchData.consignments.getListUnitByProduct(productId);
      this.setState({ units: units || [] });
    } catch (error) {
      console.error("Lỗi khi tải đơn vị:", error);
    }
  };

  handleTraceChange = (traceId) => {
    const { traces } = this.state;
    const selectedTrace = traces.find(t => t.id === traceId || t.ID === traceId);
    
    if (selectedTrace) {
      const traceInformId = selectedTrace.traceInformId || selectedTrace.TraceInformID;
      const productId = selectedTrace.productId || selectedTrace.ProductID;
      
      this.setState(
        {
          traceId: traceId || selectedTrace.id || selectedTrace.ID,
          traceName: selectedTrace.name || selectedTrace.Name || "",
          traceInformId: traceInformId,
          productId: productId,
          productName: selectedTrace.productName || selectedTrace.ProductName || "",
          quantityRemain: selectedTrace.quantityRemain || selectedTrace.QuantityRemain || 0,
          quantity: (selectedTrace.quantityRemain || selectedTrace.QuantityRemain || "").toString(),
          plantingZoneId: null,
          plantingZoneName: "",
          unitId: null,
          unitName: "",
        },
        () => {
          if (traceInformId) {
            this.loadPlantingZones(traceInformId);
          }
          if (productId) {
            this.loadUnitsByProduct(productId);
          }
        }
      );
    }
  };

  handleDateChange = (name) => (date) => {
    let formattedDate = "";
    if (date && moment.isMoment(date)) {
      formattedDate = date.format("DD/MM/YYYY");
    } else if (typeof date === "string") {
      formattedDate = date;
    }
    this.setState({ [name]: formattedDate });
  };

  handleInputChange = (name) => (e) => {
    let value = e.target.value;
    
    if (name === "quantity" && value) {
      value = Number(value);
    }
    
    this.setState({ [name]: value });
  };

  handleSelectChange = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleAddFile = (e) => {
    const newFiles = Array.from(e.target.files);
    this.setState((prevState) => ({
      files: [...prevState.files, ...newFiles],
    }));
  };

  handleRemoveFile = (index) => {
    this.setState((prevState) => ({
      files: prevState.files.filter((_, i) => i !== index),
    }));
  };

  handleAddQRCode = () => {
    const { numberFrom, numberTo, qrCodeList } = this.state;
    
    if (!numberFrom || !numberTo) {
      alert("Vui lòng nhập dải tem từ - đến");
      return;
    }
    
    const from = parseInt(numberFrom);
    const to = parseInt(numberTo);
    
    if (from > to) {
      alert("Số từ không được lớn hơn số đến");
      return;
    }
    
    const newCodes = [];
    for (let i = from; i <= to; i++) {
      newCodes.push(i.toString());
    }
    
    this.setState({
      qrCodeList: [...qrCodeList, ...newCodes],
      numberFrom: "",
      numberTo: "",
    });
  };

  handleRemoveQRCode = (index) => {
    this.setState((prevState) => ({
      qrCodeList: prevState.qrCodeList.filter((_, i) => i !== index),
    }));
  };

  validateForm = () => {
    const errors = {};
    const {
      batchNum,
      traceId,
      productId,
      quantity,
      unitId,
      dateStart,
      dateExpire,
      batchCategoryId,
    } = this.state;

    if (!batchNum) errors.batchNum = "Vui lòng nhập số lô hàng";
    if (!traceId) errors.traceId = "Vui lòng chọn nhật ký";
    if (!productId) errors.productId = "Vui lòng chọn sản phẩm";
    if (!quantity || quantity <= 0) errors.quantity = "Vui lòng nhập số lượng hợp lệ";
    if (!unitId) errors.unitId = "Vui lòng chọn đơn vị";
    if (!dateStart) errors.dateStart = "Vui lòng chọn ngày tạo";
    if (!dateExpire) errors.dateExpire = "Vui lòng chọn ngày hết hạn";
    if (!batchCategoryId) errors.batchCategoryId = "Vui lòng chọn phân loại";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSaveBatch = async () => {
    if (!this.validateForm()) {
      return;
    }

    try {
      this.setState({ isLoading: true });

      const {
        id,
        batchNum,
        traceId,
        traceInformId,
        productId,
        quantity,
        unitId,
        plantingZoneId,
        dateStart,
        dateExpire,
        note,
        batchCategoryId,
        numberFrom,
        numberTo,
        exportType,
        provinceId,
        countryId,
      } = this.state;

      // Convert dates to YYYY-MM-DD format for API
      const fromDate = dateStart ? moment(dateStart, "DD/MM/YYYY").format("YYYY-MM-DD") : "";
      const toDate = dateExpire ? moment(dateExpire, "DD/MM/YYYY").format("YYYY-MM-DD") : "";

      const batchData = {
        batchNum,
        traceId,
        traceInformId,
        productId,
        quantity: parseInt(quantity),
        unitId,
        plantingZoneId: plantingZoneId || null,
        requestedDate: fromDate,
        expiredDate: toDate,
        note,
        categoryId: batchCategoryId,
        startNum: numberFrom ? parseInt(numberFrom) : null,
        endNum: numberTo ? parseInt(numberTo) : null,
        exportType,
        provinceId: exportType === 0 ? provinceId : null,
        countryId: exportType === 1 ? countryId : null,
      };

      let result;
      if (id) {
        // Update existing batch
        batchData.id = id;
        result = await fetchData.consignments.editConsignment(batchData);
      } else {
        // Create new batch
        result = await fetchData.consignments.addConsignment(batchData);
      }

      if (result) {
        alert("Lưu lô hàng thành công!");
        if (this.props.onSaveSuccess) {
          this.props.onSaveSuccess();
        }
      } else {
        alert("Lỗi khi lưu lô hàng");
      }
    } catch (error) {
      console.error("Lỗi khi lưu batch:", error);
      alert("Lỗi: " + (error.message || "Không thể lưu lô hàng"));
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  render() {
    const {
      batchNum,
      traceId,
      traceName,
      productId,
      productName,
      quantity,
      quantityRemain,
      unitId,
      unitName,
      plantingZoneId,
      plantingZoneName,
      batchCategoryId,
      dateStart,
      dateExpire,
      note,
      qrCodeList,
      numberFrom,
      numberTo,
      exportType,
      provinceId,
      countryId,
      files,
      isShowPlantingZone,
      isLoading,
      errors,
      traces,
      plantingZones,
      units,
      batchCategories,
      stampRanges,
      provinces,
      nations,
    } = this.state;

    const isEditMode = this.props.batchId;

    // Format traces for display
    const tracesOptions = (traces || []).map((trace) => ({
      id: trace.id || trace.ID,
      value: trace.id || trace.ID,
      label: `${trace.name || trace.Name} - SL: ${trace.quantityRemain || trace.QuantityRemain || 0}`,
      name: trace.name || trace.Name,
      traceInformId: trace.traceInformId || trace.TraceInformID,
      productId: trace.productId || trace.ProductID,
      productName: trace.productName || trace.ProductName,
      quantityRemain: trace.quantityRemain || trace.QuantityRemain,
    }));

    // Format planting zones for display
    const plantingZonesOptions = (plantingZones || []).map((zone) => ({
      id: zone.id || zone.ID,
      value: zone.id || zone.ID,
      label: zone.name || zone.Name,
    }));

    // Format units for display
    const unitsOptions = (units || []).map((unit) => ({
      id: unit.id || unit.ID,
      value: unit.id || unit.ID,
      label: unit.name || unit.Name,
    }));

    // Format batch categories for display
    const batchCategoriesOptions = (batchCategories || []).map((cat) => ({
      id: cat.id || cat.ID,
      value: cat.id || cat.ID,
      label: cat.description || cat.Description,
    }));

    // Format provinces for display
    const provincesOptions = (provinces || []).map((province) => ({
      id: province.id || province.ID,
      value: province.id || province.ID,
      label: province.name || province.Name,
    }));

    // Format nations for display
    const nationsOptions = (nations || []).map((nation) => ({
      id: nation.id || nation.ID,
      value: nation.id || nation.ID,
      label: nation.name || nation.Name,
    }));

    return (
      <div className="wrap-insert-or-update-zone">
        {isLoading && (
          <div className="alert alert-info">
            <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
        )}

        {/* Batch Number */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Số lô hàng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="text"
                placeholder="Nhập số lô hàng"
                value={batchNum}
                onChange={this.handleInputChange("batchNum")}
                className="wrap-insert-or-update-zone-item-input"
                readOnly={isEditMode}
              />
            </InputGroup>
            <p className="form-error-message">{errors.batchNum || ""}</p>
          </div>
        </div>

        {/* Trace/Diary Selection */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Chọn nhật ký&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={traceId}
              className="wrap-insert-or-update-zone-item-select"
              name="traceId"
              title="Chọn nhật ký"
              data={tracesOptions}
              labelName="label"
              val="value"
              handleChange={this.handleTraceChange}
              isDisable={isEditMode}
            />
            <p className="form-error-message">{errors.traceId || ""}</p>
          </div>
        </div>

        {/* Product Name (Read-only, auto-populated) */}
        <div
          className="wrap-insert-or-update-zone-item"
          style={{ pointerEvents: "none", opacity: 0.6 }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Sản phẩm
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="text"
                value={productName}
                className="wrap-insert-or-update-zone-item-input"
                readOnly
              />
            </InputGroup>
          </div>
        </div>

        {/* Unit Selection */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Đơn vị tính&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={unitId}
              className="wrap-insert-or-update-zone-item-select"
              name="unitId"
              title="Chọn đơn vị"
              data={unitsOptions}
              labelName="label"
              val="value"
              handleChange={this.handleSelectChange("unitId")}
              isDisable={isEditMode}
            />
            <p className="form-error-message">{errors.unitId || ""}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Số lượng&nbsp;<b style={{ color: "red" }}>*</b>
            {quantityRemain > 0 && (
              <span style={{ fontSize: "12px", color: "#666" }}>
                {" "}
                (Còn: {quantityRemain})
              </span>
            )}
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="number"
                placeholder="Nhập số lượng"
                value={quantity}
                onChange={this.handleInputChange("quantity")}
                className="wrap-insert-or-update-zone-item-input"
                min="1"
                readOnly={isEditMode}
              />
            </InputGroup>
            <p className="form-error-message">{errors.quantity || ""}</p>
          </div>
        </div>

        {/* Planting Zone (Conditional) */}
        {isShowPlantingZone && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Vùng trồng&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <Select
                value={plantingZoneId}
                className="wrap-insert-or-update-zone-item-select"
                name="plantingZoneId"
                title="Chọn vùng trồng"
                data={plantingZonesOptions}
                labelName="label"
                val="value"
                handleChange={this.handleSelectChange("plantingZoneId")}
              />
            </div>
          </div>
        )}

        {/* Batch Category */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Phân loại lô hàng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={batchCategoryId}
              className="wrap-insert-or-update-zone-item-select"
              name="batchCategoryId"
              title="Chọn phân loại"
              data={batchCategoriesOptions}
              labelName="label"
              val="value"
              handleChange={this.handleSelectChange("batchCategoryId")}
            />
            <p className="form-error-message">{errors.batchCategoryId || ""}</p>
          </div>
        </div>

        {/* Date Start */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày tạo&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <FormGroup>
              <InputGroup className="input-group-alternative css-border-input">
                <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                  <InputGroupText>
                    <i className="ni ni-calendar-grid-58" />
                  </InputGroupText>
                </InputGroupAddon>
                <ReactDatetime
                  inputProps={{ placeholder: "DD/MM/YYYY" }}
                  value={dateStart}
                  timeFormat={false}
                  dateFormat="DD/MM/YYYY"
                  onChange={this.handleDateChange("dateStart")}
                  closeOnSelect={true}
                  readOnly={isEditMode}
                />
              </InputGroup>
              <p className="form-error-message">{errors.dateStart || ""}</p>
            </FormGroup>
          </div>
        </div>

        {/* Date Expire */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày hết hạn&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <FormGroup>
              <InputGroup className="input-group-alternative css-border-input">
                <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                  <InputGroupText>
                    <i className="ni ni-calendar-grid-58" />
                  </InputGroupText>
                </InputGroupAddon>
                <ReactDatetime
                  inputProps={{ placeholder: "DD/MM/YYYY" }}
                  value={dateExpire}
                  timeFormat={false}
                  dateFormat="DD/MM/YYYY"
                  onChange={this.handleDateChange("dateExpire")}
                  closeOnSelect={true}
                />
              </InputGroup>
              <p className="form-error-message">{errors.dateExpire || ""}</p>
            </FormGroup>
          </div>
        </div>

        {/* Note */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ghi chú
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <textarea
                placeholder="Nhập ghi chú (tùy chọn)"
                value={note}
                onChange={this.handleInputChange("note")}
                className="wrap-insert-or-update-zone-item-input"
                rows="3"
                style={{ resize: "vertical" }}
              ></textarea>
            </InputGroup>
          </div>
        </div>

        {/* Stamp Range */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Dải tem
          </label>
          <div className="row">
            <div className="col-md-6">
              <label style={{ fontSize: "12px" }}>Từ</label>
              <InputGroup className="input-group-alternative css-border-input">
                <input
                  type="number"
                  placeholder="Số bắt đầu"
                  value={numberFrom}
                  onChange={this.handleInputChange("numberFrom")}
                  className="wrap-insert-or-update-zone-item-input"
                />
              </InputGroup>
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: "12px" }}>Đến</label>
              <InputGroup className="input-group-alternative css-border-input">
                <input
                  type="number"
                  placeholder="Số kết thúc"
                  value={numberTo}
                  onChange={this.handleInputChange("numberTo")}
                  className="wrap-insert-or-update-zone-item-input"
                />
              </InputGroup>
            </div>
          </div>
          <Button
            color="info"
            size="sm"
            onClick={this.handleAddQRCode}
            className="mt-2"
          >
            <i className="fas fa-plus"></i> Thêm dải tem
          </Button>
        </div>

        {/* QR Code List */}
        {qrCodeList.length > 0 && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Danh sách mã QR ({qrCodeList.length})
            </label>
            <div className="d-flex flex-wrap">
              {qrCodeList.map((code, index) => (
                <span key={index} className="badge badge-info m-1">
                  {code}
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                    onClick={() => this.handleRemoveQRCode(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Tài liệu đính kèm
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <input
              type="file"
              multiple
              onChange={this.handleAddFile}
              className="form-control-file"
            />
            {files.length > 0 && (
              <div className="mt-2">
                <h6>Tệp đã chọn:</h6>
                <ul className="list-unstyled">
                  {files.map((file, index) => (
                    <li key={index} className="d-flex justify-content-between">
                      <span>{file.name}</span>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.handleRemoveFile(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Export Type */}
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Loại xuất khẩu
          </label>
          <div className="d-flex">
            <div className="custom-control custom-radio mr-3">
              <input
                type="radio"
                id="domestic"
                name="exportType"
                className="custom-control-input"
                value="0"
                checked={exportType === 0}
                onChange={() => this.setState({ exportType: 0 })}
              />
              <label className="custom-control-label" htmlFor="domestic">
                Trong nước
              </label>
            </div>
            <div className="custom-control custom-radio">
              <input
                type="radio"
                id="international"
                name="exportType"
                className="custom-control-input"
                value="1"
                checked={exportType === 1}
                onChange={() => this.setState({ exportType: 1 })}
              />
              <label className="custom-control-label" htmlFor="international">
                Nước ngoài
              </label>
            </div>
          </div>
        </div>

        {/* Province Selection (for domestic) */}
        {exportType === 0 && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Tỉnh/Thành phố
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <Select
                value={provinceId}
                className="wrap-insert-or-update-zone-item-select"
                name="provinceId"
                title="Chọn tỉnh/thành"
                data={provincesOptions}
                labelName="label"
                val="value"
                handleChange={this.handleSelectChange("provinceId")}
              />
            </div>
          </div>
        )}

        {/* Country Selection (for international) */}
        {exportType === 1 && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Quốc gia
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <Select
                value={countryId}
                className="wrap-insert-or-update-zone-item-select"
                name="countryId"
                title="Chọn quốc gia"
                data={nationsOptions}
                labelName="label"
                val="value"
                handleChange={this.handleSelectChange("countryId")}
              />
            </div>
          </div>
        )}

        <hr className="my-4" />

        {/* Action Buttons */}
        <div className="wrap-insert-or-update-zone-item d-flex justify-content-end gap-2">
          <Button
            color="secondary"
            onClick={this.handleCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            onClick={this.handleSaveBatch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Lưu
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
}

export default InsertOrUpdate;
