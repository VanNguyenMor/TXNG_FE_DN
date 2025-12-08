import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import ReactDatetime from "react-datetime";
import { fetchData } from "../../../helpers/fetchData";

import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      batchId: "",
      diaryId: null,
      classifyId: null,
      temId: null,
      batchNumber: "",
      placeVal: "",
      productVal: "",
      noteVal: "",
      unitVal: "",
      quantity: 1,
      fromVal: "",
      toVal: "",
      marketId: null,
      provinceId: null,
      countryId: null,
      warehouseId: null,
      fileVal: "",
      file: null,
      loading: false,
      errMessage: "",
      popupMessage: false,
    };
  }

  componentDidMount() {
    this.initStateFromProps();
    const { id } = this.props;
    if (id) {
      this.loadDetailData(id);
    }
  }

  componentDidUpdate(prevProps) {
    // If id changes and it's for edit, reload detail
    if (prevProps.id !== this.props.id && this.props.id) {
      this.loadDetailData(this.props.id);
    }
  }

  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        id: null,
      };
    });
  }

  // Initialize state from props (for edit mode)
  initStateFromProps = () => {
    const { initialData } = this.props;
    if (initialData) {
      this.setState(
        (prevState) => ({
          ...prevState,
          ...{
            id: initialData.id || null,
            batchId: initialData.batchId || initialData.BatchID || "",
            diaryId: initialData.diaryId || initialData.DiaryID || null,
            classifyId: initialData.classifyId || initialData.ClassifyID || null,
            temId: initialData.temId || initialData.TemID || null,
            batchNumber: initialData.batchNumber || initialData.BatchNum || "",
            placeVal: initialData.placeVal || initialData.Location || "",
            productVal: initialData.productVal || initialData.ProductName || "",
            noteVal: initialData.noteVal || initialData.Notes || "",
            unitVal: initialData.unitVal || initialData.UnitName || "",
            quantity: initialData.quantity || initialData.Quantity || 1,
            fromVal: initialData.fromVal || initialData.FromValue || "",
            toVal: initialData.toVal || initialData.ToValue || "",
            marketId: initialData.marketId || initialData.MarketID || null,
            provinceId: initialData.provinceId || initialData.ProvinceID || null,
            countryId: initialData.countryId || initialData.CountryID || null,
            warehouseId: initialData.warehouseId || initialData.WarehouseID || null,
          },
        }),
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    } else {
      // Initialize empty form
      const emptyState = {
        id: null,
        batchId: "",
        diaryId: null,
        classifyId: null,
        temId: null,
        batchNumber: "",
        placeVal: "",
        productVal: "",
        noteVal: "",
        unitVal: "",
        quantity: 1,
        fromVal: "",
        toVal: "",
        marketId: null,
        provinceId: null,
        countryId: null,
        warehouseId: null,
        fileVal: "",
      };
      this.setState(emptyState, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  };

  // Load detail data from API
  loadDetailData = async (id) => {
    if (!id) return;

    this.setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetchData.consignments.getDetailConsignment(id);
      if (!res) {
        this.setState({
          loading: false,
          errMessage: "Không tìm thấy dữ liệu chi tiết",
          popupMessage: true,
        });
        return;
      }

      const batch = res.batch || res;
      const newData = {
        id: id,
        batchId: batch.batchID || batch.BatchID || "",
        diaryId: batch.diaryID || batch.DiaryID || null,
        classifyId: batch.classifyID || batch.ClassifyID || null,
        temId: batch.temID || batch.TemID || null,
        batchNumber: batch.batchNumber || batch.BatchNum || "",
        placeVal: batch.location || batch.Location || "",
        productVal: batch.productName || batch.ProductName || "",
        noteVal: batch.notes || batch.Notes || "",
        unitVal: batch.unitID || batch.UnitID || batch.unitName || batch.UnitName || "",
        quantity: batch.quantity || batch.Quantity || 1,
        fromVal: batch.fromValue || batch.FromValue || "",
        toVal: batch.toValue || batch.ToValue || "",
        marketId: batch.marketID || batch.MarketID || null,
        provinceId: batch.provinceID || batch.ProvinceID || null,
        countryId: batch.countryID || batch.CountryID || null,
        warehouseId: batch.warehouseID || batch.WarehouseID || null,
      };

      this.setState({ ...newData, loading: false }, () => {
        if (this.props.onLoadDetailData) {
          this.props.onLoadDetailData(newData);
        }
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    } catch (error) {
      console.error("Lỗi load chi tiết lô hàng:", error);
      this.setState({
        loading: false,
        errMessage: "Lỗi tải dữ liệu chi tiết",
        popupMessage: true,
      });
    }
  };

  // Handle select change - special handling for diaryId
  onChangeSelect = (name) => (value) => {
    const selectValue = value !== null && value !== undefined ? String(value) : null;

    if (name === "diaryId") {
      const numericValue = Number(selectValue);
      const selectedOption = this.props.DIARY_OPTIONS?.find(
        (item) => item.id === numericValue
      );

      this.setState(
        (prevState) => ({
          ...prevState,
          diaryId: selectValue,
          placeVal: selectedOption?.location || "",
          productVal: selectedOption?.product || "",
          unitVal: selectedOption?.unit || "",
        }),
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
      return;
    }

    // Generic select handler for other fields
    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: selectValue,
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  // Handle value input changes
  onChangeValue = (name) => (e) => {
    let value = e && e.target ? e.target.value : e;

    // Convert specific fields to numbers
    if (name === "marketId" || name === "quantity" || name === "fromVal" || name === "toVal") {
      value = value !== "" ? Number(value) : (name === "quantity" ? 1 : "");
    }

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

  // Handle file changes
  handleFileChange = (files) => {
    if (files && files[0]) {
      this.setState({ 
        file: files[0],
        fileVal: files[0].name 
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  };

  // Toggle modal/popup
  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  render() {
    const {
      batchId,
      batchNumber,
      errMessage,
      popupMessage,
      diaryId,
      temId,
      classifyId,
      placeVal,
      productVal,
      noteVal,
      unitVal,
      quantity,
      fromVal,
      toVal,
      marketId,
      provinceId,
      countryId,
      warehouseId,
      fileVal,
      loading,
    } = this.state;

    const {
      errors,
      isShowForEdit,
      STATUS_OPTIONS,
      INGREDIENT_LIST,
      DIARY_OPTIONS,
      CLASSIFY_OPTIONS,
      TEM_OPTIONS,
      COUNTRY_OPTIONS,
      PROVINCE_OPTIONS,
      WAREHOUSE_OPTIONS,
    } = this.props;

    // Show loading spinner while loading detail data
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spinner color="primary" />
        </div>
      );
    }

    return (
      <div className="wrap-insert-or-update-zone">
        {isShowForEdit ? (
          <a class="btn btn-primary btn-sm" href="#" role="button">
            Xem nhật ký
          </a>
        ) : null}
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Mã lô hàng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly={isShowForEdit}
                onChange={this.onChangeValue("batchId")}
                type="text"
                value={batchId}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.batchId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Số lô hàng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("batchNumber")}
                readOnly={isShowForEdit}
                type="text"
                value={batchNumber}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.batchNumber || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ngày tạo&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <FormGroup>
              <InputGroup className="input-group-alternative css-border-input ">
                <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                  <InputGroupText>
                    <i className="ni ni-calendar-grid-58" />
                  </InputGroupText>
                </InputGroupAddon>

                <ReactDatetime
                  inputProps={{
                    placeholder: "Ngày tạo",
                    name: "batchNumber",
                  }}
                  value={batchNumber}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  onChange={this.onChangeValue("batchNumber")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errors.batchNumber || ""}
              </p>
            </FormGroup>

            <p className="form-error-message">{errors.batchNumber || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Từ nhật ký&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={diaryId}
              className="wrap-insert-or-update-zone-item-select"
              name="diaryId"
              title="Chọn nhật ký"
              isDisable={isShowForEdit}
              data={DIARY_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("diaryId")}
            />
            <p className="form-error-message">{errors.diaryId || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Vị trí&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("placeVal")}
                readOnly={isShowForEdit}
                type="text"
                value={placeVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.placeVal || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Sản phẩm&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("productVal")}
                readOnly={isShowForEdit}
                type="text"
                value={productVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.productVal || ""}</p>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{
            pointerEvents: "none",
            opacity: ".5",
          }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Đơn vị tính&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("unitVal")}
                readOnly={isShowForEdit}
                type="text"
                value={unitVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.unitVal || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Số lượng&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("quantity")}
                readOnly={isShowForEdit}
                type="number"
                value={quantity}
                min={1}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.quantity || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Phân loại&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={classifyId}
              className="wrap-insert-or-update-zone-item-select"
              name="classifyId"
              isDisable={isShowForEdit}
              title="Chọn phân loại"
              data={CLASSIFY_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("classifyId")}
            />
            <p className="form-error-message">{errors.classifyId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Ghi chú&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("noteVal")}
                type="text"
                readOnly={isShowForEdit}
                value={noteVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.noteVal || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Chọn dải tem&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={temId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="temId"
              isDisable={isShowForEdit}
              title="Chọn dải tem"
              data={TEM_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("temId")}
            />
            <p className="form-error-message">{errors.temId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Dải tem từ&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("fromVal")}
                type="number"
                readOnly={isShowForEdit}
                value={fromVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.fromVal || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Dải tem đến&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                onChange={this.onChangeValue("toVal")}
                type="number"
                readOnly={isShowForEdit}
                value={toVal}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.toVal || ""}</p>
          </div>
        </div>
        <div class="card card-custom-qr-list">
          <div class="card-header p-3 d-flex justify-content-between align-items-center bg-info text-white">
            <h5 class="mb-0">Danh sách mã QR</h5>
            <button
              class="btn btn-warning btn-sm btn-icon-only ml-auto"
              id="add-qr-btn"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <div class="card-body p-3">
            <div class="d-flex flex-wrap qr-list-container">
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000282
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000283
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000284
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000285
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000286
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000287
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000288
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000289
              </span>
              <span class="qr-item badge badge-primary m-1">
                TGI0200158000000290
              </span>
            </div>
          </div>
        </div>
        <div
          className="wrap-insert-or-update-zone-item"
          style={{ display: "flex", alignItems: "center" }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Thị trường&nbsp;<b style={{ color: "red" }}>*</b>
          </label>

          <div className="wrap-insert-or-update-zone-item-box">
            <div className="d-flex align-items-center">
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="market-domestic"
                  name="marketType"
                  className="custom-control-input"
                  disabled={isShowForEdit}
                  value="1"
                  checked={marketId === 1}
                  onChange={this.onChangeValue("marketId")}
                />
                <label
                  className="custom-control-label"
                  htmlFor="market-domestic"
                >
                  Trong nước
                </label>
              </div>

              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="market-international"
                  name="marketType"
                  className="custom-control-input"
                  disabled={isShowForEdit}
                  value="2"
                  checked={marketId === 2}
                  onChange={this.onChangeValue("marketId")}
                />
                <label
                  className="custom-control-label"
                  htmlFor="market-international"
                >
                  Nước ngoài
                </label>
              </div>
            </div>
            <p className="form-error-message">{errors.marketId || ""}</p>
          </div>
        </div>
        {marketId === 1 && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Danh sách tỉnh/thành&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <Select
                value={provinceId}
                defaultValue={null}
                labelMark={null}
                className="wrap-insert-or-update-zone-item-select"
                name="provinceId"
                title="Chọn danh tỉnh/thành"
                isDisable={isShowForEdit}
                data={PROVINCE_OPTIONS}
                labelName="title"
                val="id"
                handleChange={this.onChangeSelect("provinceId")}
              />
              <p className="form-error-message">{errors.provinceId || ""}</p>
            </div>
          </div>
        )}

        {marketId === 2 && (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Danh sách nước&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <Select
                value={countryId}
                defaultValue={null}
                labelMark={null}
                className="wrap-insert-or-update-zone-item-select"
                isDisable={isShowForEdit}
                name="countryId"
                title="Chọn danh sách nước"
                data={COUNTRY_OPTIONS}
                labelName="title"
                val="id"
                handleChange={this.onChangeSelect("countryId")}
              />
              <p className="form-error-message">{errors.countryId || ""}</p>
            </div>
          </div>
        )}
        <div className="wrap-insert-or-update-zone-item mr-b-0">
          <label className="wrap-insert-or-update-zone-item-label">
            Chứng từ liên quan
          </label>

          <div className="wrap-insert-or-update-zone-item-box">
            <input
              type="file"
              className="form-control-file"
              disabled={isShowForEdit}
              name="fileVal"
              multiple={true}
              onChange={(e) => this.handleFileChange(e.target.files)}
            />
          </div>
        </div>
        <hr className="my-4" />

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Chọn kho nhập hàng
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={warehouseId}
              defaultValue={null}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="warehouseId"
              title="Chọn kho để nhập hàng"
              data={WAREHOUSE_OPTIONS}
              labelName="title"
              val="id"
              handleChange={this.onChangeSelect("warehouseId")}
            />
            <p className="form-error-message">{errors.warehouseId || ""}</p>
          </div>
        </div>
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

export default InsertOrUpadte;
