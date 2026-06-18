import React, { Component } from "react";
import moment from "moment";
import ReactDatetime from "react-datetime";
import Select from "../../../components/Select";
import { fetchData } from "helpers/fetchData";
import { getErrorMessageServer } from "utils/errorMessageServer.js";
import { toast } from "react-toastify";
import { Modal, Button, Input, InputGroup } from "reactstrap";

// Hằng số nghiệp vụ — đồng bộ 1:1 với mobile (screens/waybill).
// Mobile chỉ có 2 hình thức: "Thuê ngoài" (isOut=true) và "Tự vận chuyển" (isOut=false).
const FORMALITY = [
  { id: "outsource", name: "Thuê ngoài" },
  { id: "self", name: "Tự vận chuyển" },
];
// Đối tượng chỉ hiển thị khi "Thuê ngoài". Mặc định "Cá nhân" (giống mobile).
const ORGANIZATION = [
  { id: "individual", name: "Cá nhân" },
  { id: "company", name: "Công ty" },
];
// Mobile lấy partner theo type: Cá nhân -> 3, Công ty -> 2.
const PARTNER_TYPE = { individual: 3, company: 2 };

const labelStyle = { width: 170, marginBottom: 0, flexShrink: 0 };
const rowStyle = { display: "flex", alignItems: "center", marginBottom: 12 };
const colStyle = { width: "100%" };
const errStyle = { color: "red", fontSize: 12, margin: "4px 0 0" };
const sectionStyle = { fontWeight: 700, color: "#1f3bb3", margin: "10px 0" };

class CreateTransportTicketModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      formality: "outsource",
      organization: "individual",
      partnerId: "",
      refCode: "",
      transportedBy: "",
      addressFrom: "",
      addressTo: "",
      provinceFrom: "",
      districtFrom: "",
      wardFrom: "",
      provinceTo: "",
      districtTo: "",
      wardTo: "",
      transportDate: new Date(),
      note: "",
      files: [],
      images: [],
      // combobox data
      partners: [],
      provinces: [],
      districtsFrom: [],
      wardsFrom: [],
      districtsTo: [],
      wardsTo: [],
      errors: {},
    };
    this.refFileInput = React.createRef();
    this.refImageInput = React.createRef();
  }

  componentDidMount() {
    this.loadProvinces();
    this.loadPartners(PARTNER_TYPE[this.state.organization]);
    this.loadCompanyAddress();
  }

  loadProvinces = async () => {
    const provinces = await fetchData.province.getAll();
    this.setState({ provinces: Array.isArray(provinces) ? provinces : [] });
  };

  // Mobile gọi partner/getall với partnerType tương ứng (Cá nhân/Công ty)
  loadPartners = async (partnerType) => {
    const partners = await fetchData.partner.getList({
      partnerType,
      companyName: "",
      phone: "",
      companyID: "",
      verifiedStatus: 0,
      taxCode: "",
      email: "",
      orderBy: "",
      page: null,
      limit: null,
    });
    this.setState({ partners: Array.isArray(partners) ? partners : [] });
  };

  // Mobile tự điền "Nơi gửi" bằng địa chỉ đăng ký của công ty
  loadCompanyAddress = async () => {
    try {
      const resCompany = await fetchData.account.getCurrentCompany();
      const id = resCompany && resCompany.company ? resCompany.company.id : null;
      if (!id) return;
      const info = await fetchData.infoCompany.detail(id);
      if (!info) return;

      this.setState({
        addressFrom: info.address || "",
        provinceFrom: info.provinceID || "",
        districtFrom: info.districtID || "",
        wardFrom: info.wardID || "",
      });
      if (info.provinceID) {
        const districts = await fetchData.district.getByProvinceId(info.provinceID);
        this.setState({ districtsFrom: Array.isArray(districts) ? districts : [] });
      }
      if (info.districtID) {
        const wards = await fetchData.ward.getByDistrictId(info.districtID);
        this.setState({ wardsFrom: Array.isArray(wards) ? wards : [] });
      }
    } catch (e) {
      // không chặn luồng tạo vận đơn nếu lấy thông tin công ty lỗi
    }
  };

  onSelect = (name) => (value) => this.setState({ [name]: value });

  // Đổi hình thức -> reset thông tin người/đơn vị vận chuyển (giống mobile)
  onChangeFormality = (value) => {
    this.setState(
      { formality: value, partnerId: "", transportedBy: "", refCode: "", errors: {} },
      () => {
        if (value === "outsource") this.loadPartners(PARTNER_TYPE[this.state.organization]);
      }
    );
  };

  // Đổi đối tượng -> reset partner + nạp lại danh sách theo partnerType
  onChangeOrganization = (value) => {
    this.setState(
      { organization: value, partnerId: "", transportedBy: "", refCode: "", errors: {} },
      () => this.loadPartners(PARTNER_TYPE[value])
    );
  };

  // Cá nhân (Thuê ngoài): chọn tài xế từ danh sách partner -> set cả partnerId & transportedBy
  onSelectDriverPartner = (value) => {
    const p = this.state.partners.find((x) => x.id === value);
    this.setState({ partnerId: value, transportedBy: p ? p.partnerName : "" });
  };

  onChangeProvince = (which) => async (value) => {
    if (which === "from") {
      this.setState({ provinceFrom: value, districtFrom: "", wardFrom: "", districtsFrom: [], wardsFrom: [] });
      const districts = await fetchData.district.getByProvinceId(value);
      this.setState({ districtsFrom: Array.isArray(districts) ? districts : [] });
    } else {
      this.setState({ provinceTo: value, districtTo: "", wardTo: "", districtsTo: [], wardsTo: [] });
      const districts = await fetchData.district.getByProvinceId(value);
      this.setState({ districtsTo: Array.isArray(districts) ? districts : [] });
    }
  };

  onChangeDistrict = (which) => async (value) => {
    if (which === "from") {
      this.setState({ districtFrom: value, wardFrom: "", wardsFrom: [] });
      const wards = await fetchData.ward.getByDistrictId(value);
      this.setState({ wardsFrom: Array.isArray(wards) ? wards : [] });
    } else {
      this.setState({ districtTo: value, wardTo: "", wardsTo: [] });
      const wards = await fetchData.ward.getByDistrictId(value);
      this.setState({ wardsTo: Array.isArray(wards) ? wards : [] });
    }
  };

  onPickFiles = (key, ref) => () => ref.current && ref.current.click();

  onFilesSelected = (key) => (e) => {
    const list = Array.from(e.target.files || []);
    this.setState((prev) => ({ [key]: [...prev[key], ...list] }));
    e.target.value = null;
  };

  removeFile = (key, idx) => () => {
    this.setState((prev) => ({ [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  validate = () => {
    const { formality, organization, partnerId, transportedBy, addressFrom, addressTo, images } =
      this.state;
    const isOut = formality === "outsource";
    const isCompany = isOut && organization === "company";
    const errors = {};

    // Mobile: Thuê ngoài -> bắt buộc chọn tài xế/đơn vị (partnerId)
    if (isOut && !partnerId)
      errors.partnerId = isCompany
        ? "Vui lòng chọn đơn vị vận chuyển"
        : "Vui lòng chọn tài xế";
    // Mobile: Tự vận chuyển -> bắt buộc nhập tài xế
    if (!isOut && !transportedBy) errors.transportedBy = "Vui lòng nhập tài xế";
    // Mobile: Thuê ngoài + Công ty -> bắt buộc nhập tài xế
    if (isCompany && !transportedBy) errors.transportedBy = "Vui lòng nhập tài xế";

    if (!addressFrom) errors.addressFrom = "Vui lòng nhập nơi đi";
    if (!addressTo) errors.addressTo = "Vui lòng nhập nơi đến";
    if (!images || images.length <= 0) errors.images = "Vui lòng chọn ảnh phương tiện vận chuyển";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = () => {
    if (!this.validate()) return;
    const { goodDelivery } = this.props;
    const {
      formality, organization, partnerId, refCode, transportedBy,
      addressFrom, addressTo, provinceFrom, districtFrom, wardFrom,
      provinceTo, districtTo, wardTo, transportDate, note, files, images,
    } = this.state;

    const isOut = formality === "outsource";
    const isCompany = isOut && organization === "company";

    // Payload giống mobile (waybill -> goodsdeliverynote/createtransportticket)
    const fd = new FormData();
    fd.append("partnerId", partnerId || "");
    fd.append("giid", goodDelivery.id);
    fd.append("transportDate", moment(transportDate).format("YYYY-MM-DD HH:mm:ss"));
    fd.append("addressFrom", addressFrom || "");
    fd.append("addressTo", addressTo || "");
    fd.append("provinceID", provinceFrom || "");
    fd.append("districtID", districtFrom || "");
    fd.append("wardID", wardFrom || "");
    fd.append("provinceID2", provinceTo || "");
    fd.append("districtID2", districtTo || "");
    fd.append("wardID2", wardTo || "");
    fd.append("refCode", refCode || "");
    fd.append("transportedBy", transportedBy || "");
    fd.append("note", note || "");
    fd.append("isCompany", isCompany);
    fd.append("isOut", isOut);
    fd.append("goodIssuesID", goodDelivery.id);
    files.forEach((f) => fd.append("filesFiles", f));
    fd.append("files", "");
    images.forEach((f) => fd.append("imagesFiles", f));

    this.setState({ submitting: true });
    fetchData.goodDelivery
      .createTransportTicket(fd)
      .then((res) => {
        this.setState({ submitting: false });
        if (res && res.status === 200) {
          toast.success("Tạo vận đơn thành công!");
          this.props.onSuccess && this.props.onSuccess();
          this.props.onClose && this.props.onClose();
        } else {
          toast.error(getErrorMessageServer(res) || "Tạo vận đơn thất bại");
        }
      })
      .catch((err) => {
        this.setState({ submitting: false });
        toast.error(getErrorMessageServer(err) || "Tạo vận đơn thất bại");
      });
  };

  renderRow = (label, node, error) => (
    <div style={rowStyle}>
      <label className="form-control-label" style={labelStyle}>{label}</label>
      <div style={colStyle}>
        {node}
        {error ? <p style={errStyle}>{error}</p> : null}
      </div>
    </div>
  );

  renderFileList = (key) => (
    <div>
      {this.state[key].map((f, i) => (
        <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>{f.name}</span>
          <span style={{ cursor: "pointer", color: "red" }} onClick={this.removeFile(key, i)}>×</span>
        </div>
      ))}
    </div>
  );

  render() {
    const { isOpen, onClose, goodDelivery } = this.props;
    const {
      submitting, formality, organization, partnerId, refCode, transportedBy,
      addressFrom, addressTo, provinceFrom, districtFrom, wardFrom, provinceTo, districtTo, wardTo,
      transportDate, note, partners, provinces, districtsFrom, wardsFrom, districtsTo, wardsTo,
      errors,
    } = this.state;

    const isOut = formality === "outsource";
    const isCompany = isOut && organization === "company";
    const isIndividual = isOut && organization === "individual";

    return (
      <Modal isOpen={isOpen} toggle={onClose} size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Tạo vận đơn — Phiếu xuất {goodDelivery ? goodDelivery.receiptNumber : ""}</h5>
          <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
        </div>
        <div className="modal-body">
          {this.renderRow("Hình thức",
            <Select name="formality" title="Chọn hình thức" value={formality}
              data={FORMALITY} labelName="name" val="id" handleChange={this.onChangeFormality} />)}

          {isOut && this.renderRow("Đối tượng",
            <Select name="organization" title="Chọn đối tượng" value={organization}
              data={ORGANIZATION} labelName="name" val="id" handleChange={this.onChangeOrganization} />)}

          {/* Thuê ngoài + Cá nhân: chọn tài xế từ danh sách partner (type 3) */}
          {isIndividual && this.renderRow("Tài xế",
            <Select name="partnerId" title="Chọn tài xế" value={partnerId}
              data={partners} labelName="partnerName" val="id" handleChange={this.onSelectDriverPartner} />,
            errors.partnerId)}

          {/* Thuê ngoài + Công ty: chọn đơn vị vận chuyển (type 2) */}
          {isCompany && this.renderRow("Đơn vị vận chuyển",
            <Select name="partnerId" title="Chọn đơn vị vận chuyển" value={partnerId}
              data={partners} labelName="partnerName" val="id" handleChange={this.onSelect("partnerId")} />,
            errors.partnerId)}

          {isCompany && this.renderRow("Mã vận đơn tham chiếu",
            <InputGroup className="input-group-alternative css-border-input">
              <Input value={refCode} placeholder="Mã vận đơn tham chiếu"
                onChange={(e) => this.setState({ refCode: e.target.value })} />
            </InputGroup>)}

          {/* Tài xế (nhập tay): Thuê ngoài + Công ty, hoặc Tự vận chuyển */}
          {(isCompany || !isOut) && this.renderRow("Tài xế",
            <InputGroup className="input-group-alternative css-border-input">
              <Input value={transportedBy} placeholder="Tên tài xế"
                onChange={(e) => this.setState({ transportedBy: e.target.value })} />
            </InputGroup>, errors.transportedBy)}

          <div style={sectionStyle}>Nơi đi</div>
          {this.renderRow("Tỉnh/Thành",
            <Select name="provinceFrom" title="Chọn tỉnh/thành" value={provinceFrom}
              data={provinces} labelName="name" val="id" handleChange={this.onChangeProvince("from")} />)}
          {this.renderRow("Quận/Huyện",
            <Select name="districtFrom" title="Chọn quận/huyện" value={districtFrom}
              data={districtsFrom} labelName="name" val="id" handleChange={this.onChangeDistrict("from")} />)}
          {this.renderRow("Phường/Xã",
            <Select name="wardFrom" title="Chọn phường/xã" value={wardFrom}
              data={wardsFrom} labelName="name" val="id" handleChange={this.onSelect("wardFrom")} />)}
          {this.renderRow("Địa chỉ đi",
            <InputGroup className="input-group-alternative css-border-input">
              <Input value={addressFrom} placeholder="Địa chỉ chi tiết nơi đi"
                onChange={(e) => this.setState({ addressFrom: e.target.value })} />
            </InputGroup>, errors.addressFrom)}

          <div style={sectionStyle}>Nơi đến</div>
          {this.renderRow("Tỉnh/Thành",
            <Select name="provinceTo" title="Chọn tỉnh/thành" value={provinceTo}
              data={provinces} labelName="name" val="id" handleChange={this.onChangeProvince("to")} />)}
          {this.renderRow("Quận/Huyện",
            <Select name="districtTo" title="Chọn quận/huyện" value={districtTo}
              data={districtsTo} labelName="name" val="id" handleChange={this.onChangeDistrict("to")} />)}
          {this.renderRow("Phường/Xã",
            <Select name="wardTo" title="Chọn phường/xã" value={wardTo}
              data={wardsTo} labelName="name" val="id" handleChange={this.onSelect("wardTo")} />)}
          {this.renderRow("Địa chỉ đến",
            <InputGroup className="input-group-alternative css-border-input">
              <Input value={addressTo} placeholder="Địa chỉ chi tiết nơi đến"
                onChange={(e) => this.setState({ addressTo: e.target.value })} />
            </InputGroup>, errors.addressTo)}

          {this.renderRow("Ngày vận chuyển",
            <ReactDatetime inputProps={{ placeholder: "dd/mm/yyyy HH:mm" }} value={transportDate}
              dateFormat="DD-MM-YYYY" timeFormat="HH:mm"
              onChange={(v) => this.setState({ transportDate: v && v.toDate ? v.toDate() : v })} />)}

          {this.renderRow("Ghi chú",
            <InputGroup className="input-group-alternative css-border-input">
              <Input type="textarea" value={note} placeholder="Ghi chú"
                onChange={(e) => this.setState({ note: e.target.value })} />
            </InputGroup>)}

          {this.renderRow("Ảnh phương tiện",
            <>
              <Button size="sm" className="btn-primary-cs" onClick={this.onPickFiles("images", this.refImageInput)}>
                Chọn ảnh
              </Button>
              <input type="file" accept="image/*" multiple ref={this.refImageInput}
                style={{ display: "none" }} onChange={this.onFilesSelected("images")} />
              {this.renderFileList("images")}
            </>, errors.images)}

          {this.renderRow("Chứng từ liên quan",
            <>
              <Button size="sm" className="btn-primary-cs" onClick={this.onPickFiles("files", this.refFileInput)}>
                Chọn tệp
              </Button>
              <input type="file" multiple ref={this.refFileInput}
                style={{ display: "none" }} onChange={this.onFilesSelected("files")} />
              {this.renderFileList("files")}
            </>)}
        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={onClose} disabled={submitting}>Đóng</Button>
          <Button className="btn-primary-cs" color="default" onClick={this.handleSubmit} disabled={submitting}>
            {submitting ? "Đang lưu..." : "Tạo vận đơn"}
          </Button>
        </div>
      </Modal>
    );
  }
}

export default CreateTransportTicketModal;
