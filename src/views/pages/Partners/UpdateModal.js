import React, { Component } from "react";
import PartnerFormFields from "./PartnerFormFields";

/**
 * Form SỬA đối tác. Load chi tiết qua requestGetPartner(id), map vào state và
 * đẩy lên parent qua handleNewData (parent build FormData & validate khi submit).
 *
 * Props:
 *  - id, requestGetPartner
 *  - nations
 *  - handleCheckValidation(status), handleNewData(data)
 *  - errorUpdate
 */
class UpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getEmptyData(),
      logoView: null,
    };
  }

  getEmptyData = () => ({
    ID: "",
    PartnerType: 0,
    PartnerName: "",
    TaxCode: "",
    NationID: "",
    Address: "",
    PhoneNumber: "",
    Fax: "",
    Email: "",
    Website: "",
    ContactName: "",
    ContactPhone: "",
    ContactEmail: "",
    Logo: "",
    LogoFile: "",
    PlantingZoneName: "",
    Area: "",
    AreaUnit: "",
    Lat: "",
    Lng: "",
    Location: "",
    IsBelongTo: false,
    BusinessLicenses: "",
    Certification: "",
    Images: "",
    License: "",
    IsLaco: false,
    LacoId: "",
  });

  async UNSAFE_componentWillMount() {
    const { requestGetPartner, id } = this.props;
    if (id) {
      await requestGetPartner(id).then((res) => {
        const d = ((res || {}).data || {}).data || {};
        const location = d.location || "";
        const loc = location.split(",");
        this.setState({
          data: {
            ID: id,
            PartnerType:
              typeof d.partnerType !== "undefined" && d.partnerType !== null
                ? d.partnerType
                : 0,
            PartnerName: d.partnerName || "",
            TaxCode: d.taxCode || "",
            NationID: d.nationID || d.nationId || "",
            Address: d.address || "",
            PhoneNumber: d.phoneNumber || "",
            Fax: d.fax || "",
            Email: d.email || "",
            Website: d.website || "",
            ContactName: d.contactName || "",
            ContactPhone: d.contactPhone || "",
            ContactEmail: d.contactEmail || "",
            Logo: d.logo || "",
            LogoFile: "",
            PlantingZoneName: d.plantingZoneName || "",
            Area: d.area || "",
            AreaUnit:
              typeof d.areaUnit !== "undefined" && d.areaUnit !== null
                ? d.areaUnit
                : "",
            Lat: loc[0] || "",
            Lng: loc[1] || "",
            Location: location,
            IsBelongTo: !!d.isBelongTo,
            BusinessLicenses: d.businessLicenses || "",
            Certification: d.certification || "",
            Images: d.images || "",
            License: d.license || "",
            IsLaco: !!d.isLaco,
            LacoId: d.lacoId || "",
          },
        });
      });
    }
    this.propagate();
  }

  propagate = () => {
    this.props.handleNewData(this.state.data);
    this.props.handleCheckValidation(true);
  };

  handleChange = (event) => {
    const ev = event.target;
    const value = ev.type === "checkbox" ? ev.checked : ev.value;
    this.setState(
      (prev) => {
        const data = { ...prev.data, [ev.name]: value };
        if (ev.name === "Lat" || ev.name === "Lng") {
          data.Location =
            data.Lat || data.Lng ? `${data.Lat || ""},${data.Lng || ""}` : "";
        }
        return { data };
      },
      this.propagate
    );
  };

  handleSelect = (value, name) => {
    if (value === null) value = "";
    this.setState(
      (prev) => ({ data: { ...prev.data, [name]: value } }),
      this.propagate
    );
  };

  handleChangeLogo = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState(
        (prev) => ({
          data: { ...prev.data, LogoFile: file, Logo: "" },
          logoView: URL.createObjectURL(file),
        }),
        this.propagate
      );
    }
  };

  handleDeleteLogo = () => {
    this.setState(
      (prev) => ({
        data: { ...prev.data, LogoFile: "", Logo: "" },
        logoView: null,
      }),
      this.propagate
    );
  };

  handleGalleryChange = (name, urls) => {
    this.setState(
      (prev) => ({
        data: { ...prev.data, [name]: (urls || []).filter(Boolean).join(";") },
      }),
      this.propagate
    );
  };

  render() {
    const { nations, errorUpdate } = this.props;
    const { data, logoView } = this.state;

    return (
      <PartnerFormFields
        data={data}
        errors={errorUpdate}
        nations={nations}
        logoView={logoView}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onChangeLogo={this.handleChangeLogo}
        onDeleteLogo={this.handleDeleteLogo}
        onGalleryChange={this.handleGalleryChange}
      />
    );
  }
}

export default UpdateModal;
