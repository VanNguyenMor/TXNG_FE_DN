import React, { Component } from "react";
import classes from "./index.module.css";
import Select from "components/Select";
import ImageGalleryUploader from "components/ImageGalleryUploader/ImageGalleryUploader";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import {
  PARTNER_TYPES,
  PARTNER_AREA_UNITS,
  PARTNER_PERSONAL_ID,
} from "../../../helpers/constant";
import { Input, InputGroup, Button } from "reactstrap";

/**
 * Bộ field dùng chung cho form Thêm/Sửa đối tác (PartnerType 0-4).
 * Bám theo màn "Đối tác" trên app mobile: Thông tin cơ bản + Thông tin mở rộng.
 *
 * Props:
 *  - data: object state form (key PascalCase, xem AddNewModal/UpdateModal)
 *  - errors: object lỗi theo field
 *  - nations: [{ id, nationName }]
 *  - logoView: url preview logo (file mới) hoặc null
 *  - onChange(event), onSelect(value, name)
 *  - onChangeLogo(event), onDeleteLogo()
 *  - onGalleryChange(name, urls)
 */
class PartnerFormFields extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 0 }; // 0: cơ bản, 1: mở rộng
    this.refLogo = null;
  }

  setTab = (tab) => () => this.setState({ tab });

  renderInput = (name, label, opts = {}) => {
    const { data, errors, onChange } = this.props;
    const { required, type, placeholder } = opts;
    return (
      <div className={classes.rowItem}>
        <label className="form-control-label">
          {label}
          {required ? <b style={{ color: "red" }}>&nbsp;*</b> : null}
        </label>
        <div className={classes.inputArea}>
          <InputGroup className="input-group-alternative css-border-input">
            <Input
              name={name}
              type={type || "text"}
              placeholder={placeholder || label}
              value={data[name] || ""}
              onChange={(e) => onChange(e)}
            />
          </InputGroup>
          <p className="form-error-message margin-bottom-0">
            {(errors && errors[name]) || ""}
          </p>
        </div>
      </div>
    );
  };

  render() {
    const {
      data,
      errors,
      nations,
      logoView,
      onSelect,
      onChange,
      onChangeLogo,
      onDeleteLogo,
      onGalleryChange,
    } = this.props;
    const { tab } = this.state;

    const partnerType = Number(data.PartnerType);
    const isPersonal = partnerType === PARTNER_PERSONAL_ID;
    const isCompany = !isPersonal && partnerType !== 2; // không phải Cá nhân, không phải Vận chuyển

    const nameLabel = isPersonal ? "Tên người vận chuyển" : "Tên doanh nghiệp";
    const taxLabel = isPersonal ? "CMND/CCCD" : "Mã số thuế";

    return (
      <div className={classes.formControl}>
        {/* Tab điều hướng */}
        <div className={classes.partnerTabBar}>
          <div
            className={`${classes.partnerTabItem} ${
              tab === 0 ? classes.partnerTabActive : ""
            }`}
            onClick={this.setTab(0)}
          >
            Thông tin cơ bản
          </div>
          <div
            className={`${classes.partnerTabItem} ${
              tab === 1 ? classes.partnerTabActive : ""
            }`}
            onClick={this.setTab(1)}
          >
            Thông tin mở rộng
          </div>
        </div>

        {/* ================= THÔNG TIN CƠ BẢN ================= */}
        <div style={{ display: tab === 0 ? "block" : "none" }}>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Nhóm&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <Select
                name="PartnerType"
                labelName="name"
                val="id"
                data={PARTNER_TYPES}
                title="Chọn nhóm"
                value={data.PartnerType}
                handleChange={onSelect}
              />
              <p className="form-error-message margin-bottom-0">
                {(errors && errors["PartnerType"]) || ""}
              </p>
            </div>
          </div>

          {this.renderInput("PartnerName", nameLabel, { required: true })}
          {this.renderInput("TaxCode", taxLabel)}

          <div className={classes.rowItem}>
            <label className="form-control-label">
              Quốc gia&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <Select
                name="NationID"
                labelName="nationName"
                val="id"
                data={nations || []}
                title="Chọn quốc gia"
                value={data.NationID}
                handleChange={onSelect}
              />
              <p className="form-error-message margin-bottom-0">
                {(errors && errors["NationID"]) || ""}
              </p>
            </div>
          </div>

          {this.renderInput("Address", "Địa chỉ")}
          {this.renderInput("PhoneNumber", "Điện thoại")}
          {this.renderInput("Fax", "Fax")}
          {this.renderInput("Email", "Email")}
          {!isPersonal && this.renderInput("Website", "Website")}

          {!isPersonal && (
            <>
              {this.renderInput("ContactName", "Tên người liên hệ")}
              {this.renderInput("ContactPhone", "Điện thoại người liên hệ")}
              {this.renderInput("ContactEmail", "Email người liên hệ")}
            </>
          )}

          {/* Logo / Hình đại diện */}
          <div
            className={classes.rowItem}
            style={{ width: "100%", justifyContent: "left" }}
          >
            <label className="form-control-label">
              {isPersonal ? "Hình đại diện" : "Logo"}
            </label>
            <div className={classes.inputArea}>
              <div style={{ position: "relative" }}>
                <InputGroup
                  className="input-group-alternative css-border-input"
                  style={{ width: 82 }}
                >
                  <input
                    ref={(ref) => (this.refLogo = ref)}
                    type="file"
                    name="LogoFile"
                    style={{ display: "none" }}
                    onChange={onChangeLogo}
                    accept="image/*"
                  />
                  <img
                    src={logoView ? logoView : data.Logo ? data.Logo : NoImg}
                    style={{ width: 82, height: 82, maxWidth: 320, maxHeight: 320 }}
                    alt="logo"
                  />
                </InputGroup>
                <div className="css-button-partner">
                  <Button
                    type="button"
                    size="lg"
                    className="btn-primary-cs"
                    onClick={() => this.refLogo && this.refLogo.click()}
                  >
                    <img src={PlusImg} alt="Chọn hình" />
                    <span>Chọn hình</span>
                  </Button>
                  {logoView ? (
                    <div style={{ position: "absolute", top: "-12px", left: 72 }}>
                      <Button
                        color="default"
                        type="button"
                        className="css-icon-button-partner"
                        onClick={onDeleteLogo}
                      >
                        <span>X</span>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= THÔNG TIN MỞ RỘNG ================= */}
        <div style={{ display: tab === 1 ? "block" : "none" }}>
          {isCompany && (
            <>
              {this.renderInput("PlantingZoneName", "Vùng sản xuất")}
              {this.renderInput("Area", "Diện tích", { type: "number" })}
              <div className={classes.rowItem}>
                <label className="form-control-label">Đơn vị diện tích</label>
                <div className={classes.inputArea}>
                  <Select
                    name="AreaUnit"
                    labelName="name"
                    val="id"
                    data={PARTNER_AREA_UNITS}
                    title="Chọn đơn vị"
                    value={data.AreaUnit}
                    handleChange={onSelect}
                  />
                  <p className="form-error-message margin-bottom-0">
                    {(errors && errors["AreaUnit"]) || ""}
                  </p>
                </div>
              </div>

              <div className={classes.rowItem}>
                <label className="form-control-label">Thuộc vùng quy hoạch</label>
                <div className={classes.inputArea}>
                  <Input
                    type="checkbox"
                    name="IsBelongTo"
                    checked={!!data.IsBelongTo}
                    onChange={onChange}
                    style={{ position: "static", marginLeft: 0 }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Vị trí (lat,lng) - lưu chuỗi "lat,lng" giống mobile */}
          <div className={classes.rowItem}>
            <label className="form-control-label">Vị trí (Vĩ độ, Kinh độ)</label>
            <div className={classes.inputArea} style={{ display: "flex", gap: 8 }}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  name="Lat"
                  type="number"
                  placeholder="Vĩ độ (latitude)"
                  value={data.Lat || ""}
                  onChange={onChange}
                />
              </InputGroup>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  name="Lng"
                  type="number"
                  placeholder="Kinh độ (longitude)"
                  value={data.Lng || ""}
                  onChange={onChange}
                />
              </InputGroup>
            </div>
          </div>

          {isPersonal ? (
            <>
              <ImageGalleryUploader
                title="Giấy phép lái xe"
                uploadKey="files"
                mdVal={6}
                initialImages={data.License}
                onImagesChange={(urls) => onGalleryChange("License", urls)}
              />
              <ImageGalleryUploader
                title="CMND/CCCD (mặt trước & mặt sau)"
                uploadKey="files"
                mdVal={6}
                initialImages={data.Images}
                onImagesChange={(urls) => onGalleryChange("Images", urls)}
              />
            </>
          ) : (
            <>
              <ImageGalleryUploader
                title="Giấy phép kinh doanh"
                uploadKey="files"
                mdVal={6}
                initialImages={data.BusinessLicenses}
                onImagesChange={(urls) => onGalleryChange("BusinessLicenses", urls)}
              />
              <ImageGalleryUploader
                title="Giấy đăng ký / chứng nhận liên quan"
                uploadKey="files"
                mdVal={6}
                initialImages={data.Certification}
                onImagesChange={(urls) => onGalleryChange("Certification", urls)}
              />
              <ImageGalleryUploader
                title="Một số hình ảnh hoạt động"
                uploadKey="files"
                mdVal={6}
                initialImages={data.Images}
                onImagesChange={(urls) => onGalleryChange("Images", urls)}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default PartnerFormFields;
