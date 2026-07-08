import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import ReactDatetime from "react-datetime";
import { toast } from "react-toastify";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";

import { InputGroup } from "reactstrap";

// Đối chiếu app mobile: Laco/src/constants/data.js
const REFERENCE_DIARYS = {
  khachHang: 10,
  nhaCungCap: 20,
  nhanVien: 30,
  nguyenVatLieu: 40,
  khoHang: 50,
  donViTinh: 60,
  donViVanChuyen: 70,
  phuongTienVanChuyen: 80,
  phieuNhap: 90,
  nhaMay: 91,
  thietBi: 93,
};

const DATA_TYPES = {
  text: 1,
  number: 2,
  date: 3,
  image: 4,
  banDo: 5, // định vị GPS
  trueFalse: 6,
};

// reference -> cấu hình lookup: action prop + key mảng kết quả + cặp value/label
const REFERENCE_CONFIG = {
  [REFERENCE_DIARYS.khachHang]: { action: "requestRDCustomerList", arg: {}, listKey: "partners", value: "id", label: "partnerName", placeholder: "Chọn khách hàng" },
  [REFERENCE_DIARYS.nhaCungCap]: { action: "requestRDProviderList", arg: {}, listKey: "partners", value: "id", label: "partnerName", placeholder: "Chọn nhà cung cấp" },
  [REFERENCE_DIARYS.nhanVien]: { action: "requestRDEmployeeList", arg: {}, listKey: "employees", value: "id", label: "employeeName", placeholder: "Chọn nhân viên" },
  [REFERENCE_DIARYS.khoHang]: { action: "requestRDWarehouseList", arg: { search: "", filter: "", orderBy: "", page: 0, limit: 1000 }, listKey: "wareHouses", value: "id", label: "name", placeholder: "Chọn kho hàng" },
  [REFERENCE_DIARYS.donViVanChuyen]: { action: "requestRDTransportUnitList", arg: {}, listKey: "partners", value: "id", label: "partnerName", placeholder: "Chọn đơn vị vận chuyển" },
  [REFERENCE_DIARYS.phuongTienVanChuyen]: { action: "requestRDVehicleList", arg: { search: "", filter: "", orderBy: "", page: 0, limit: 1000 }, listKey: "vehicles", value: "id", label: "name", placeholder: "Chọn phương tiện vận chuyển" },
  [REFERENCE_DIARYS.nhaMay]: { action: "requestRDFactoryList", arg: { search: "", filter: "", orderBy: "", page: 0, limit: 1000 }, listKey: "factories", value: "id", label: "name", placeholder: "Chọn nhà máy" },
  [REFERENCE_DIARYS.thietBi]: { action: "requestRDToolList", arg: { search: "", filter: "", orderBy: "", page: 0, limit: 1000 }, listKey: "factories", value: "id", label: "name", placeholder: "Chọn thiết bị" },
  [REFERENCE_DIARYS.nguyenVatLieu]: { action: "requestRDMaterialList", arg: {}, listKey: "materials", value: "ID", label: "Name", placeholder: "Chọn nguyên liệu" },
};

// Các reference chưa hỗ trợ đầy đủ trên web (cần luồng phụ phức tạp)
const UNSUPPORTED_REFERENCES = {
  [REFERENCE_DIARYS.donViTinh]: "Đơn vị tính (đang phát triển)",
};

const getResponseData = (res) => {
  const data = res && res.data;

  return (data && data.data) || data || {};
};

const getInformSelectId = (item) =>
  item && (
    item.ID ||
    item.id ||
    item.InformSelectID ||
    item.informSelectID ||
    item.informSelectId
  );

const getInformSelectName = (item) =>
  item && (
    item.Name ||
    item.name ||
    item.InfoName ||
    item.infoName ||
    item.InformName ||
    item.informName ||
    item.InformSelectName ||
    item.informSelectName ||
    item.ColumnName ||
    item.columnName ||
    item.title
  );

const getInformId = (item) =>
  item && (
    item.InformID ||
    item.informID ||
    item.InformId ||
    item.informId
  );

const getInformSelectsFromData = (data) => {
  const direct =
    data.informSelects ||
    data.InformSelects ||
    data.informSelect ||
    data.InformSelect ||
    (data.trace && (
      data.trace.informSelects ||
      data.trace.InformSelects ||
      data.trace.informSelect ||
      data.trace.InformSelect
    ));

  if (Array.isArray(direct)) {
    return direct;
  }

  const visited = new Set();
  const queue = [data];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (Array.isArray(current)) {
      const looksLikeInformSelect = current.some(
        (item) =>
          item &&
          typeof item === "object" &&
          getInformSelectId(item) &&
          (getInformSelectName(item) || getInformId(item))
      );

      if (looksLikeInformSelect) {
        return current;
      }

      current.forEach((item) => queue.push(item));
    } else {
      Object.keys(current).forEach((key) => queue.push(current[key]));
    }
  }

  return [];
};

class WriteLogging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      productId: null,
      zoneId: null,
      informId: null,
      informSelectId: null,
      informSelects: [],
      attributes: [],
      traceZoneOptions: null,
      haveItem: false,
      itemId: null,
      itemQrInput: "",
      isLoaded: false,
      popupMessage: false,
      errMessage: "",
    };
  }

  componentDidMount() {
    this.initFromProps(this.props);
  }

  componentDidUpdate(prevProps) {
    const prevTraceId = this.getTraceId(prevProps);
    const traceId = this.getTraceId(this.props);

    if (String(prevTraceId || "") !== String(traceId || "")) {
      this.initFromProps(this.props);
    }
  }

  getTraceId = (props = this.props) => {
    const { item, id, traceId } = props;

    return item
      ? (item.id || item.ID || item.traceId || item.TraceID || item.traceID || id || traceId || null)
      : (id || traceId || null);
  };

  initFromProps = (props) => {
    const { item, copyItem } = props;
    const traceId = this.getTraceId(props);

    // Ghi nhớ bản ghi cần sao chép để prefill sau khi tải xong loại nhật ký + thuộc tính
    this.pendingCopyItem = copyItem || null;

    this.setState(
      {
        id: traceId,
        zoneId: item ? (item.plantingZoneId || item.PlantingZoneID || item.PlantingZone || null) : null,
        productId: item ? (item.productId || item.ProductId || null) : null,
      },
      () => {
        if (traceId) {
          const companyId = item ? (item.CompanyID || item.companyId || "") : "";
          this.loadInformSelects(traceId, companyId);
        }
      }
    );
  };
  // Lấy danh sách "loại nhật ký" hợp lệ của trace (trace/get?id=&companyId=)
  loadInformSelects = (traceId, companyId) => {
    const { requestGetInformSelect } = this.props;
    if (!requestGetInformSelect) return;

    this.setState({ isLoaded: true });

    // web trace/get yêu cầu companyId (giống requestGetTrace ở trang cha)
    const arg = companyId ? `${traceId}&companyId=${companyId}` : `${traceId}`;

    requestGetInformSelect(arg).then((res) => {
      const data = getResponseData(res);
      const informSelects = getInformSelectsFromData(data);
      const trace = data.trace || {};
      this.setState(
        (prev) => ({
          informSelects,
          haveItem: trace.haveItem || data.haveItem || false,
          // Vị trí: ưu tiên id thật từ trace detail (bảng list chỉ trả tên nên không khớp option)
          zoneId: trace.plantingZoneID || trace.PlantingZoneID || prev.zoneId || null,
          isLoaded: false,
        }),
        () => {
          // Nếu đang ở luồng sao chép -> chọn sẵn loại nhật ký tương ứng
          if (this.pendingCopyItem) {
            this.applyCopyItem(this.pendingCopyItem);
          }
        }
      );
    });

    // Nạp danh sách vị trí theo trace (đối chiếu mobile getplanzone) để Vị trí hiển thị đúng nhãn
    const { requestGetPlanZoneByTrace } = this.props;
    if (requestGetPlanZoneByTrace) {
      requestGetPlanZoneByTrace(traceId).then((res) => {
        const data = getResponseData(res);
        const zones = data.plantingZones || data.planZones || data.plantingZone || [];
        if (Array.isArray(zones) && zones.length > 0) {
          const mapped = zones.map((z) => ({
            id: z.id || z.ID,
            title: z.name || z.Name || z.plantingZoneName || z.title,
          }));
          this.setState({ traceZoneOptions: mapped });
        }
      });
    }
  };

  // Khi chọn loại nhật ký -> lấy thuộc tính động (trace/getattribute?informSelectId=)
  onChangeInformSelect = (value) => {
    const { informSelects } = this.state;
    const selected = (informSelects || []).find(
      (p) => String(getInformSelectId(p)) === String(value)
    );

    if (!selected) {
      this.setState({ informSelectId: value, informId: null, attributes: [] });
      return;
    }

    const informSelectId = getInformSelectId(selected);
    const informId = getInformId(selected);

    this.setState({ informSelectId, informId, isLoaded: true });

    const { requestGetAttribute } = this.props;
    if (!requestGetAttribute) {
      this.setState({ isLoaded: false });
      return;
    }

    requestGetAttribute(informSelectId).then((res) => {
      const data = getResponseData(res);
      const informs = data.informs || data.Informs || [];

      // attributes là các inform có isData > 0
      const attributes = informs
        .filter((p) => (p.isData || p.IsData || 0) > 0)
        .map((p) => ({
          id: p.id || p.ID,
          informID: p.informID || p.InformID,
          name: p.name || p.ColumnName || p.Name,
          dataType: p.dataType || p.DataType,
          reference: p.reference || p.Reference,
          isRequired: p.isRequired || p.IsRequired || false,
          // giá trị người dùng nhập
          _value: "",
          _display: "",
          _value2: "",
          _display2: "",
          _valueUnit: "",
          _displayUnit: "",
          _quantity: "",
          _values: [],
          _options: [],
          _unitOptions: [],
        }));

      this.setState({ attributes, isLoaded: false }, () => {
        // tải sẵn danh sách cho các thuộc tính dạng reference
        attributes.forEach((attr) => this.loadReferenceOptions(attr));
        // Luồng sao chép: prefill giá trị từ bản ghi được chép (không tự lấy GPS)
        if (this.pendingCopyItem) {
          this.prefillFromCopy(this.pendingCopyItem);
          this.pendingCopyItem = null;
          return;
        }
        // tự động lấy GPS cho thuộc tính định vị (giống mobile)
        const hasGps = attributes.some((a) => a.dataType === DATA_TYPES.banDo);
        if (hasGps && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            this.setState((prev) => ({
              attributes: prev.attributes.map((a) =>
                a.dataType === DATA_TYPES.banDo ? { ...a, _value: `${latitude},${longitude}` } : a
              ),
            }));
          });
        }
      });
    });
  };

  // ----- Luồng sao chép nhật ký (đối chiếu app mobile - copyItem) -----
  // Chọn sẵn loại nhật ký khớp với bản ghi được chép, đồng thời set vị trí.
  applyCopyItem = (copyItem) => {
    const targetId =
      copyItem.informSelectID ||
      copyItem.InformSelectID ||
      copyItem.informSelectId;

    const match = (this.state.informSelects || []).find(
      (s) => String(getInformSelectId(s)) === String(targetId)
    );

    // Vị trí lấy theo bản ghi được chép nếu có
    const zoneId =
      copyItem.plantingZoneID ||
      copyItem.PlantingZoneID ||
      copyItem.plantingZoneId;
    if (zoneId) {
      this.setState({ zoneId });
    }

    if (!match) {
      // Không tìm được loại nhật ký tương ứng -> huỷ luồng copy
      this.pendingCopyItem = null;
      return;
    }

    // Chọn loại nhật ký -> load thuộc tính, prefill sẽ chạy trong callback
    this.onChangeInformSelect(getInformSelectId(match));
  };

  // Điền giá trị các thuộc tính từ contents của bản ghi được chép.
  prefillFromCopy = (copyItem) => {
    let contents = [];
    try {
      contents = JSON.parse(copyItem.contents || copyItem.Contents || "[]");
    } catch (e) {
      contents = [];
    }
    if (!Array.isArray(contents) || contents.length === 0) return;

    const findContent = (attr) =>
      contents.find((c) => {
        const cid = c.InformID || c.informID;
        return cid && attr.informID && String(cid) === String(attr.informID);
      });

    this.setState(
      (prev) => {
        const attributes = prev.attributes.map((attr) => {
          const c = findContent(attr);
          if (!c) return attr;

          const value = c.Value != null ? c.Value : c.value;
          const displayValue =
            c.DisplayValue != null ? c.DisplayValue : c.displayValue;
          const ref = attr.reference;

          if (ref === REFERENCE_DIARYS.nguyenVatLieu) {
            let material = c.Material || c.material || {};
            if (typeof material === "string") {
              try {
                material = JSON.parse(material || "{}") || {};
              } catch (e) {
                material = {};
              }
            }
            const materialId =
              material.materialID || material.MaterialID || value || "";
            return {
              ...attr,
              _value: materialId,
              _value2: materialId,
              _display: displayValue || "",
              _display2: displayValue || "",
              _valueUnit: material.unitID || material.UnitID || "",
              _displayUnit: material.unitName || material.UnitName || "",
              _quantity: (material.quantity || material.Quantity || "").toString(),
            };
          }

          if (ref === REFERENCE_DIARYS.phieuNhap) {
            return {
              ...attr,
              _value: value || "",
              _displayGoodReceipt: displayValue || "",
            };
          }

          if (REFERENCE_CONFIG[ref]) {
            return { ...attr, _value: value || "", _display: displayValue || "" };
          }

          if (attr.dataType === DATA_TYPES.trueFalse) {
            return { ...attr, _value: value === "1" || value === true ? "1" : "0" };
          }

          if (attr.dataType === DATA_TYPES.image) {
            return { ...attr, _value: (value || "").toString() };
          }

          if (attr.dataType === DATA_TYPES.date) {
            return { ...attr, _value: value || null };
          }

          // text / number / banDo
          return { ...attr, _value: value != null ? value : "" };
        });

        return { attributes };
      },
      () => {
        // Với nguyên vật liệu: tải danh sách đơn vị để dropdown hiển thị đúng nhãn
        this.state.attributes.forEach((attr) => {
          if (attr.reference === REFERENCE_DIARYS.nguyenVatLieu && attr._value) {
            this.loadMaterialUnits(attr, attr._value2 || attr._value);
          }
        });
      }
    );
  };

  loadReferenceOptions = (attr) => {
    // Phiếu nhập: lấy danh sách theo trace
    if (attr.reference === REFERENCE_DIARYS.phieuNhap) {
      const { requestGetGoodReceipt } = this.props;
      if (!requestGetGoodReceipt || !this.state.id) return;
      requestGetGoodReceipt(this.state.id).then((res) => {
        const data = ((res.data || {}).data || {});
        const list = data.goodReceipts || [];
        const options = list.map((it) => ({
          id: it.ID || it.id,
          title: it.Name || it.name,
        }));
        this.updateAttribute(attr.id, { _options: options });
      });
      return;
    }

    const cfg = REFERENCE_CONFIG[attr.reference];
    if (!cfg) return;

    const actionFn = this.props[cfg.action];
    if (!actionFn) return;

    actionFn(cfg.arg).then((res) => {
      const data = ((res.data || {}).data || {});
      const list = data[cfg.listKey] || [];
      const options = list.map((it) => ({
        id: it[cfg.value],
        title: it[cfg.label],
      }));
      this.updateAttribute(attr.id, { _options: options });
    });
  };

  // Tải danh sách đơn vị theo nguyên vật liệu đã chọn
  loadMaterialUnits = (attr, materialId) => {
    const { requestRDMaterialUnitList } = this.props;
    if (!requestRDMaterialUnitList || !materialId) return;

    requestRDMaterialUnitList(materialId).then((res) => {
      const data = ((res.data || {}).data || {});
      const units = data.materialUnits || [];
      const unitOptions = units.map((u) => ({
        id: u.ID || u.id,
        title: u.UnitName || u.unitName,
      }));
      this.updateAttribute(attr.id, { _unitOptions: unitOptions });
    });
  };

  updateAttribute = (attrId, patch) => {
    this.setState((prev) => {
      const attributes = prev.attributes.map((a) =>
        a.id === attrId ? { ...a, ...patch } : a
      );
      return { attributes };
    });
  };

  // ----- handlers cho từng thuộc tính -----
  onChangeAttrText = (attrId) => (e) => {
    this.updateAttribute(attrId, { _value: e.target.value });
  };

  onChangeAttrDate = (attrId) => (value) => {
    this.updateAttribute(attrId, { _value: value || null });
  };

  onChangeAttrBool = (attrId) => (value) => {
    this.updateAttribute(attrId, { _value: value });
  };

  onChangeAttrReference = (attrId) => (value) => {
    const attr = this.state.attributes.find((a) => a.id === attrId);
    const opt = attr && (attr._options || []).find((o) => String(o.id) === String(value));
    const display = opt ? opt.title : "";

    if (attr && attr.reference === REFERENCE_DIARYS.nguyenVatLieu) {
      // material: lưu cả _value và _value2, reset đơn vị + tải đơn vị theo material
      this.updateAttribute(attrId, {
        _value: value,
        _value2: value,
        _display: display,
        _display2: display,
        _valueUnit: "",
        _displayUnit: "",
        metaData: null,
      });
      this.loadMaterialUnits(attr, value);
    } else if (attr && attr.reference === REFERENCE_DIARYS.phieuNhap) {
      // phiếu nhập: lấy chi tiết để có số lượng / đơn vị / đối tác
      this.updateAttribute(attrId, { _value: value, _displayGoodReceipt: display });
      const { requestGetDetailGoodReceipt } = this.props;
      if (requestGetDetailGoodReceipt && value) {
        requestGetDetailGoodReceipt(value).then((res) => {
          const gr = ((res.data || {}).data || {}).goodReceipt || {};
          this.updateAttribute(attrId, {
            _valueGoodReceipt: gr.id || gr.ID || value,
            _quantity: (gr.quantity || gr.Quantity || "").toString(),
            _displayUnit: gr.unitName || gr.UnitName || "",
            _partnerId: gr.partnerId || gr.PartnerID,
            _partnerName: gr.partnerName || gr.PartnerName,
            _traceId: gr.traceId || gr.TraceID,
            _batchId: gr.batchId || gr.BatchID,
            _grTime: gr.grTime || gr.GRTime,
            _productName: gr.productName || gr.ProductName,
          });
        });
      }
    } else {
      this.updateAttribute(attrId, { _value: value, _display: display });
    }
  };

  onChangeAttrUnit = (attrId) => (value) => {
    const attr = this.state.attributes.find((a) => a.id === attrId);
    const opt = attr && (attr._unitOptions || []).find((o) => String(o.id) === String(value));
    this.updateAttribute(attrId, {
      _valueUnit: value,
      _displayUnit: opt ? opt.title : "",
    });

    // lấy tồn kho theo NVL + đơn vị để hiển thị
    const { requestGetInventoryByMaterial } = this.props;
    const materialId = attr ? (attr._value2 || attr._value) : null;
    if (requestGetInventoryByMaterial && materialId && value) {
      requestGetInventoryByMaterial(value, materialId).then((res) => {
        const inv = ((res.data || {}).data || {});
        this.updateAttribute(attrId, { metaData: inv });
      });
    }
  };

  onChangeAttrQuantity = (attrId) => (e) => {
    this.updateAttribute(attrId, { _quantity: e.target.value });
  };

  onUploadImage = (attrId) => (e) => {
    const { requestUploadTraceFile } = this.props;
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!requestUploadTraceFile) {
      toast.error("Chức năng tải ảnh chưa sẵn sàng");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    requestUploadTraceFile(formData).then((res) => {
      const data = ((res.data || {}).data || {});
      // backend có thể trả url theo nhiều dạng
      const url =
        data.url ||
        (Array.isArray(data.urls) ? data.urls.join(";") : data.urls) ||
        (Array.isArray(data.files) ? data.files.join(";") : data.files) ||
        (res.data || {}).result ||
        "";
      if (url) {
        const prev = this.state.attributes.find((a) => a.id === attrId);
        const existing = prev && prev._value ? prev._value + ";" : "";
        this.updateAttribute(attrId, { _value: existing + url });
        toast.success("Tải ảnh thành công");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    });
  };

  onCheckItemQr = () => {
    const { requestCheckItemValid } = this.props;
    const qr = (this.state.itemQrInput || "").trim();
    if (!qr) {
      toast.error("Bạn vui lòng nhập mã QR cá thể");
      return;
    }
    if (!requestCheckItemValid) return;

    requestCheckItemValid(qr).then((res) => {
      const data = res.data || {};
      if (data.status === 200) {
        const item = (data.data || {}).item || (data.data || {});
        const itemId = item.id || item.ID || item.ItemID || null;
        if (itemId) {
          this.setState({ itemId });
          toast.success("Mã cá thể hợp lệ");
        } else {
          toast.error("Không tìm thấy cá thể");
        }
      } else {
        toast.error(data.message || "Mã cá thể không hợp lệ");
      }
    });
  };

  onGetLocation = (attrId) => () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.updateAttribute(attrId, { _value: `${latitude},${longitude}` });
      },
      () => toast.error("Lấy vị trí thất bại")
    );
  };

  // Tương đương handleValueAttribute trên mobile
  buildContentEntry = (attr) => {
    const ref = attr.reference;

    if (ref === REFERENCE_DIARYS.phieuNhap) {
      return {
        informID: attr.informID,
        columnName: attr.name,
        value: attr._value,
        displayValue: attr._displayGoodReceipt,
        material: null,
        goodReceipt: {
          id: attr._valueGoodReceipt,
          quantity: parseFloat((attr._quantity || "0").toString().replace(/,/g, "")) || 0,
          unitName: attr._displayUnit,
          partnerId: attr._partnerId,
          traceId: attr._traceId,
          batchId: attr._batchId,
          partnerName: attr._partnerName,
          grTime: attr._grTime,
          productName: attr._productName,
          reference: REFERENCE_DIARYS.phieuNhap.toString(),
        },
        dataType: attr.dataType,
      };
    }

    if (REFERENCE_CONFIG[ref] || UNSUPPORTED_REFERENCES[ref]) {
      const extraData1 =
        ref === REFERENCE_DIARYS.nguyenVatLieu
          ? {
              id: attr._value,
              materialID: attr._value2 || attr._value,
              quantity: parseFloat((attr._quantity || "0").toString().replace(/,/g, "")) || 0,
              unitID: attr._valueUnit,
              unitName: attr._displayUnit,
              reference: (ref || "").toString(),
            }
          : null;

      return {
        informID: attr.informID,
        columnName: attr.name,
        value: attr._value2 || attr._value || attr._valueUnit,
        displayValue: attr._display2 || attr._display || attr._displayUnit,
        material: extraData1,
        goodReceipt: null,
        dataType: attr.dataType,
      };
    }

    if (attr.dataType === DATA_TYPES.date) {
      let value = attr._value || null;
      let displayValue = "";
      if (value && typeof value.toISOString === "function") {
        value = value.toISOString();
        displayValue = value;
      } else if (value && typeof value.toDate === "function") {
        value = value.toDate().toISOString();
        displayValue = value;
      } else if (value) {
        value = new Date(value).toISOString();
        displayValue = value;
      }
      return { informID: attr.informID, columnName: attr.name, value, displayValue, material: null, goodReceipt: null, dataType: attr.dataType };
    }

    if (attr.dataType === DATA_TYPES.image) {
      const value = (attr._value || "").trim();
      return { informID: attr.informID, columnName: attr.name, value, displayValue: value, material: null, goodReceipt: null, dataType: attr.dataType };
    }

    if (attr.dataType === DATA_TYPES.trueFalse) {
      const value = attr._value === "1" || attr._value === true ? "1" : "0";
      return { informID: attr.informID, columnName: attr.name, value, displayValue: value === "1" ? "Có" : "Không", material: null, goodReceipt: null, dataType: attr.dataType };
    }

    // text / number / banDo
    return {
      informID: attr.informID,
      columnName: attr.name,
      value: attr._value,
      displayValue: attr._value,
      material: null,
      goodReceipt: null,
      dataType: attr.dataType,
    };
  };

  // Kiểm tra tồn kho cho các NVL trước khi ghi (đối chiếu checkInventoryMulti mobile)
  checkInventory = async (materialAttrs) => {
    const { requestCheckInventoryMulti } = this.props;
    if (!requestCheckInventoryMulti || materialAttrs.length === 0) return true;

    const data = materialAttrs.map((attr) => ({
      quantity: parseFloat((attr._quantity || "0").toString().replace(/,/g, "")) || 0,
      unitIdTarget: attr._valueUnit,
      productMaterialId: attr._value2 || attr._value,
      productMaterialName: attr._display2 || attr._display,
    }));

    const res = await requestCheckInventoryMulti(JSON.stringify(data));
    const resData = ((res.data || {}).data || {});
    const inventorys = resData.inventorys || [];

    for (let i = 0; i < data.length; i++) {
      const inv = inventorys.find(
        (p) => p.productMaterialId == data[i].productMaterialId && p.unitIdTarget == data[i].unitIdTarget
      );
      if (!inv || !inv.convert) {
        toast.error(`Không có NVL ${data[i].productMaterialName} trong kho`);
        return false;
      }
      if ((inv.convert || {}).value < data[i].quantity) {
        toast.error(`Không đủ số lượng NVL ${data[i].productMaterialName} để xuất`);
        return false;
      }
    }

    if (resData.isCheck === false) {
      toast.error("Số lượng nguyên vật liệu không được vượt quá tồn kho");
      return false;
    }

    return true;
  };

  // Được parent gọi qua ref khi bấm "Lưu"
  handleSubmit = async (toggleModal) => {
    const { id, informId, zoneId, attributes } = this.state;
    const { requestWriteTrace, onWriteSuccess } = this.props;

    if (!informId) {
      toast.error("Bạn vui lòng chọn loại nhật ký");
      return;
    }

    if (!zoneId) {
      toast.error("Bạn vui lòng chọn vị trí");
      return;
    }

    // Validate riêng cho nguyên vật liệu (đơn vị + số lượng)
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.reference === REFERENCE_DIARYS.nguyenVatLieu) {
        if (!attr._value) {
          toast.error("Bạn vui lòng chọn " + attr.name);
          return;
        }
        if (!attr._valueUnit) {
          toast.error("Bạn vui lòng chọn đơn vị cho " + attr.name);
          return;
        }
        const q = parseFloat((attr._quantity || "0").toString().replace(/,/g, "")) || 0;
        if (q <= 0) {
          toast.error("Bạn vui lòng nhập số lượng cho " + attr.name);
          return;
        }
      }
    }

    // Kiểm tra tồn kho NVL
    const materialAttrs = attributes.filter((a) => a.reference === REFERENCE_DIARYS.nguyenVatLieu);
    const inventoryOk = await this.checkInventory(materialAttrs);
    if (!inventoryOk) return;

    const contents = attributes.map((attr) => this.buildContentEntry(attr));

    // Backend yêu cầu CreatedBy — lấy id tài khoản đang đăng nhập (cookie.js lưu ở ACCOUNT_ID)
    let createdBy = null;
    try {
      createdBy =
        localStorage.getItem("ACCOUNT_ID") ||
        localStorage.getItem("USER_ID") ||
        localStorage.getItem("ID") ||
        null;
    } catch (e) {
      createdBy = null;
    }

    const payload = {
      traceID: id,
      informID: informId,
      plantingZoneID: zoneId,
      contents,
      itemID: this.state.itemId || null,
      createdBy,
      createdDate: null,
    };

    if (!requestWriteTrace) {
      toast.error("Chức năng ghi nhật ký chưa sẵn sàng");
      return;
    }

    requestWriteTrace(JSON.stringify(payload)).then((res) => {
      const data = (res.data || {});

      if (data.status === 200) {
        toast.success("Thêm nhật ký thành công!");
        if (onWriteSuccess) onWriteSuccess();
        if (toggleModal) toggleModal();
      } else {
        const inner = data.data || {};
        if (inner.isQuarantine) {
          const q = inner.data || {};
          toast.error(
            `Không thể ghi nhật ký vì vẫn còn thời hạn cách ly. Số ngày còn lại: ${q.totalDay || ""}`
          );
        } else {
          toast.error(data.message || "Thêm nhật ký thất bại");
        }
      }
    });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  renderAttribute = (attr) => {
    const ref = attr.reference;

    // reference chưa hỗ trợ
    if (UNSUPPORTED_REFERENCES[ref]) {
      return (
        <p className="form-error-message" style={{ fontStyle: "italic" }}>
          {UNSUPPORTED_REFERENCES[ref]}
        </p>
      );
    }

    // nguyên vật liệu: chọn NVL + đơn vị + số lượng
    if (ref === REFERENCE_DIARYS.nguyenVatLieu) {
      return (
        <>
          <Select
            value={attr._value}
            name={`attr-${attr.id}`}
            title={attr.name || "Chọn nguyên liệu"}
            data={attr._options || []}
            labelName="title"
            val="id"
            handleChange={this.onChangeAttrReference(attr.id)}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <div style={{ flex: 1 }}>
              <Select
                value={attr._valueUnit}
                name={`attr-unit-${attr.id}`}
                title="Đơn vị"
                data={attr._unitOptions || []}
                labelName="title"
                val="id"
                handleChange={this.onChangeAttrUnit(attr.id)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <InputGroup className="input-group-alternative css-border-input">
                <input
                  type="number"
                  value={attr._quantity}
                  placeholder="Số lượng"
                  onChange={this.onChangeAttrQuantity(attr.id)}
                  className="wrap-insert-or-update-zone-item-input"
                />
              </InputGroup>
            </div>
          </div>
          {attr.metaData && (attr.metaData.convert || attr.metaData.remain != null) ? (
            <small style={{ color: "#888" }}>
              Tồn kho: {((attr.metaData.convert || {}).value != null
                ? (attr.metaData.convert || {}).value
                : (attr.metaData.remain != null ? attr.metaData.remain : ""))}{" "}
              {attr._displayUnit}
            </small>
          ) : null}
        </>
      );
    }

    // phiếu nhập: chọn phiếu + hiển thị SL/ĐVT lấy từ chi tiết
    if (ref === REFERENCE_DIARYS.phieuNhap) {
      return (
        <>
          <Select
            value={attr._value}
            name={`attr-${attr.id}`}
            title={attr.name || "Chọn phiếu nhập"}
            data={attr._options || []}
            labelName="title"
            val="id"
            handleChange={this.onChangeAttrReference(attr.id)}
          />
          {attr._valueGoodReceipt ? (
            <small style={{ color: "#888" }}>
              Số lượng: {attr._quantity} {attr._displayUnit}
              {attr._partnerName ? ` — ĐT: ${attr._partnerName}` : ""}
            </small>
          ) : null}
        </>
      );
    }

    // reference dạng chọn 1 (khách hàng, nhà cung cấp, nhân viên, kho, ...)
    if (REFERENCE_CONFIG[ref]) {
      return (
        <Select
          value={attr._value}
          name={`attr-${attr.id}`}
          title={attr.name || REFERENCE_CONFIG[ref].placeholder}
          data={attr._options || []}
          labelName="title"
          val="id"
          handleChange={this.onChangeAttrReference(attr.id)}
        />
      );
    }

    // theo dataType
    if (attr.dataType === DATA_TYPES.date) {
      return (
        <ReactDatetime
          inputProps={{ placeholder: "dd/mm/yyyy" }}
          value={attr._value || ""}
          timeFormat={false}
          dateFormat="DD-MM-YYYY"
          onChange={this.onChangeAttrDate(attr.id)}
        />
      );
    }

    if (attr.dataType === DATA_TYPES.trueFalse) {
      return (
        <Select
          value={attr._value}
          name={`attr-${attr.id}`}
          title="Chọn"
          data={[{ id: "1", title: "Có" }, { id: "0", title: "Không" }]}
          labelName="title"
          val="id"
          handleChange={this.onChangeAttrBool(attr.id)}
        />
      );
    }

    if (attr.dataType === DATA_TYPES.banDo) {
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <InputGroup className="input-group-alternative css-border-input" style={{ flex: 1 }}>
            <input
              type="text"
              value={attr._value}
              placeholder="vĩ độ,kinh độ"
              onChange={this.onChangeAttrText(attr.id)}
              className="wrap-insert-or-update-zone-item-input"
            />
          </InputGroup>
          <button
            type="button"
            className="btn btn-sm btn-info"
            onClick={this.onGetLocation(attr.id)}
          >
            Lấy vị trí
          </button>
        </div>
      );
    }

    if (attr.dataType === DATA_TYPES.image) {
      const urls = (attr._value || "").split(/[;,]/).filter(Boolean);
      return (
        <div>
          <input type="file" accept="image/*" onChange={this.onUploadImage(attr.id)} />
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            {urls.map((u, i) => (
              <img key={i} src={u} alt="" style={{ width: 70, height: 70, objectFit: "cover" }} />
            ))}
          </div>
        </div>
      );
    }

    // text(1) / number(2) / mặc định
    return (
      <InputGroup className="input-group-alternative css-border-input">
        <input
          type={attr.dataType === DATA_TYPES.number ? "number" : "text"}
          value={attr._value}
          onChange={this.onChangeAttrText(attr.id)}
          className="wrap-insert-or-update-zone-item-input"
        />
      </InputGroup>
    );
  };

  render() {
    const {
      errMessage,
      popupMessage,
      zoneId,
      informSelectId,
      informSelects,
      attributes,
      isLoaded,
    } = this.state;
    const { errors, PLANTINGZONE_OPTIONS, item } = this.props;

    const displayTitle = item ? (item.title || item.ProductName || "") : "";
    const displayCode = item ? (item.code || item.NameCode || "") : "";

    const informOptions = (informSelects || [])
      .map((it) => ({
        id: getInformSelectId(it),
        title: getInformSelectName(it) || getInformSelectId(it),
      }))
      .filter((it) => it.id);

    return (
      <div className="wrap-insert-or-update-zone">
        <div
          className="wrap-insert-or-update-zone-item"
          style={{ pointerEvents: "none", opacity: ".5" }}
        >
          <label className="wrap-insert-or-update-zone-item-label">
            Tiêu đề&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="text"
                value={displayTitle}
                readOnly
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>

        <div
          className="wrap-insert-or-update-zone-item"
          style={{ pointerEvents: "none", opacity: ".5" }}
        >
          <label className="wrap-insert-or-update-zone-item-label">Code</label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={displayCode}
                type="text"
                readOnly
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Vị trí&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={zoneId}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="zoneId"
              title="Chọn vị trí"
              data={this.state.traceZoneOptions || PLANTINGZONE_OPTIONS || []}
              labelName="title"
              val="id"
              handleChange={(value) => this.setState({ zoneId: value })}
            />
            <p className="form-error-message">{(errors && errors.zoneId) || ""}</p>
          </div>
        </div>

        {this.state.haveItem ? (
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Mã cá thể (QR)
            </label>
            <div className="wrap-insert-or-update-zone-item-box">
              <div style={{ display: "flex", gap: 8 }}>
                <InputGroup className="input-group-alternative css-border-input" style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={this.state.itemQrInput}
                    placeholder="Nhập/quét mã QR cá thể"
                    onChange={(e) => this.setState({ itemQrInput: e.target.value })}
                    className="wrap-insert-or-update-zone-item-input"
                  />
                </InputGroup>
                <button type="button" className="btn btn-sm btn-info" onClick={this.onCheckItemQr}>
                  Kiểm tra
                </button>
              </div>
              {this.state.itemId ? (
                <small style={{ color: "#00B050" }}>Đã xác thực cá thể</small>
              ) : null}
            </div>
          </div>
        ) : null}

        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <h3>Thể loại nhật ký</h3>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Loại nhật ký&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={informSelectId}
              labelMark={null}
              className="wrap-insert-or-update-zone-item-select"
              name="informSelectId"
              title="Chọn loại nhật ký"
              data={informOptions}
              labelName="title"
              val="id"
              handleChange={this.onChangeInformSelect}
            />
            <p className="form-error-message">{(errors && errors.typeWrite) || ""}</p>
          </div>
        </div>

        {isLoaded ? (
          <p style={{ fontStyle: "italic" }}>Đang tải...</p>
        ) : null}

        <div className="list">
          {attributes.map((attr) => (
            <div key={attr.id} className="wrap-insert-or-update-zone-item">
              <label className="wrap-insert-or-update-zone-item-label">
                {attr.name}
                {attr.isRequired ? (
                  <>&nbsp;<b style={{ color: "red" }}>*</b></>
                ) : null}
              </label>
              <div className="wrap-insert-or-update-zone-item-box">
                {this.renderAttribute(attr)}
              </div>
            </div>
          ))}
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />

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

export default WriteLogging;
