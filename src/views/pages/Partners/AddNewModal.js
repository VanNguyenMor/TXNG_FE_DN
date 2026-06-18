import React, { Component } from "react";
import { Button } from "reactstrap";
import PartnerFormFields from "./PartnerFormFields";
import LacoSearchModal from "./LacoSearchModal";
import { NATION_ID_VIETNAM, PARTNER_PERSONAL_ID } from "../../../helpers/constant";

/**
 * Form THÊM đối tác. Giữ state form và đẩy dữ liệu lên parent qua handleNewData,
 * theo đúng luồng modal của các trang khác (parent build FormData & validate khi submit).
 *
 * Props:
 *  - partnerType: nhóm đang chọn (tab hiện tại)
 *  - nations: [{id, nationName}]
 *  - companyId
 *  - requestListPartnerLACO
 *  - handleCheckValidation(status), handleNewData(data)
 *  - errorInsert
 */
class AddNewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(props.partnerType),
      logoView: null,
      lacoOpen: false,
    };
  }

  getInitData = (partnerType) => ({
    PartnerType: typeof partnerType === "undefined" ? 0 : partnerType,
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

  componentDidMount() {
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

  toggleLaco = () => this.setState((prev) => ({ lacoOpen: !prev.lacoOpen }));

  onChooseLaco = (item) => {
    this.setState(
      (prev) => ({
        data: {
          ...prev.data,
          PartnerName: item.companyName || "",
          Address: item.address || "",
          TaxCode: item.taxCode || "",
          Logo: item.logo || "",
          LogoFile: "",
          NationID: NATION_ID_VIETNAM || prev.data.NationID,
          IsLaco: true,
          LacoId: item.id || "",
        },
        logoView: null,
        lacoOpen: false,
      }),
      this.propagate
    );
  };

  render() {
    const { nations, errorInsert, companyId, requestListPartnerLACO } = this.props;
    const { data, logoView, lacoOpen } = this.state;
    const isPersonal = Number(data.PartnerType) === PARTNER_PERSONAL_ID;

    return (
      <div>
        {!isPersonal && (
          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <Button color="info" size="sm" onClick={this.toggleLaco}>
              <i className="fas fa-search" />&nbsp;Tìm kiếm đối tác từ LACO
            </Button>
          </div>
        )}

        <PartnerFormFields
          data={data}
          errors={errorInsert}
          nations={nations}
          logoView={logoView}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onChangeLogo={this.handleChangeLogo}
          onDeleteLogo={this.handleDeleteLogo}
          onGalleryChange={this.handleGalleryChange}
        />

        <LacoSearchModal
          isOpen={lacoOpen}
          toggle={this.toggleLaco}
          companyId={companyId}
          requestListPartnerLACO={requestListPartnerLACO}
          onChoose={this.onChooseLaco}
        />
      </div>
    );
  }
}

export default AddNewModal;
