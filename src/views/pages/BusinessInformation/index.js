import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { actionCompanyListRegistered } from "../../../actions/CompanyListRegisteredActions";
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import "../../../assets/css/page/config_system.css";
import { replaceCommaDot } from "bases/helper";
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import "./select-search.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";
import axios from "axios";
import { CONFIG_UPDATE_IMG } from "../../../apis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleMapReact from "google-map-react";
import { currentPosition } from "utils/geo";
import { Button, InputGroup } from "reactstrap";
import { MAP_KEY } from "../../../services/Common";
import { ICON_COMMONS } from "assets/img";
import { LOCATION_DEFAULT, ZOOM_DEFAULT } from "../../../services/Common";
import locationIcon from "../../../assets/img/locationIcon/location.png";
import GoogleAutoCompleteInput from "../../../components/GoogleAutoCompleteInput";
import ImageUploader from "components/ImageUploader/ImageUploader";
import ImageGalleryUploader from "components/ImageGalleryUploader/ImageGalleryUploader";

const AnyReactComponent = ({ text }) => (
  <div>
    <img width={25} src={locationIcon} />
  </div>
);
class BusinessInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0,
      configSetting: {
        businessImageFile: null,
        businessImageUrlVal: Noimg,
        businessAvatar: "",
        businessName: "",
        taxCode: "",
        industryId: null,
        introduce: "",
        isShowMapViewLocation: false,
        address: "",
        provinceId: null,
        districtId: null,
        wardId: null,
        phoneNumber: "",
        faxText: "",
        email: "",
        website: "",
        contactPersonName: "",
        contactPersonPhone: "",
        contactPersonEmail: "",
        isCheckPlanning: false,
        location: "",
        businessLicenseImages: [Noimg],
        registrationPaperImages: [Noimg],
        workImages: [Noimg],
      },
      gps: "",
      errorsInfoCompany: {},
      errorsConfigSystem: {},
      isOpen: false,
      valueDr: null,
      options: [],
      isShowForEdit: false,
      position: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng,
      },
      positionChange: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng,
      },
    };

    this.refEditorContentSendEmailRegisterUsage = null;
    this.refEditorContentSendEmailChangePassword = null;
    this.refInputFileCompanyLogo = null;
    this.refcontentEmailSendToPrinter = null;
    this.refcontentEmailRegister = null;
    this.refAttachmentUsed = null;
    this.refAttachments = null;
    this.refAttachmentStamps = null;
    this.redSelect = null;
  }

  onChooseTab = (tab) => () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        currentTab: tab,
        errorsConfigSystem: {},
        errorsInfoCompany: {},
      };
    });
  };

  onChangeValue = (name) => (e) => {
    let value;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else {
      value = e.target.value;

      if (name === "price") {
        value = replaceCommaDot(value, "");
      }
    }

    this.setState((previousState) => {
      return {
        ...previousState,
        configSetting: {
          ...previousState.configSetting,
          [name]: value,
        },
      };
    });
  };
  handleMapLocation = (gps) => {
    if (gps.length === 0) return LOCATION_DEFAULT;
    else {
      const location = gps.split(",");
      const mapLocation = {
        lat: parseFloat(location[0]),
        lng: parseFloat(location[1]),
      };

      return mapLocation;
    }
  };
  onSaveConfigSystem = () => {
    const { configSetting } = this.state;
    console.log(configSetting);
    // const errorsConfigSystem = this.checkValidateFormConfigSystem();

    // this.setState((previousState) => {
    //   return {
    //     ...previousState,
    //     errorsConfigSystem,
    //   };
    // });

    // if (Object.keys(errorsConfigSystem).length > 0) {
    //   return;
    // }

    // const { configSetting } = this.state;

    // const contentEmailChangePassword =
    //   this.refEditorContentSendEmailChangePassword.getContent();
    // const contentEmailSendToPrinter =
    //   this.refcontentEmailSendToPrinter.getContent();
    // const attachmentUsed = this.refAttachmentUsed.getContent();
    // const attachmentStamps = this.refAttachmentStamps.getContent();
    // const attachments = this.refAttachments.getContent();
    // const contentEmailRegister = this.refcontentEmailRegister.getContent();
    // const formData = new FormData();

    // formData.append("Email", configSetting.email ? configSetting.email : "");
    // formData.append(
    //   "EmailMask",
    //   configSetting.emailMask ? configSetting.emailMask : ""
    // );
    // formData.append(
    //   "PassEmail",
    //   configSetting.passEmail ? configSetting.passEmail : ""
    // );
    // formData.append(
    //   "PhoneNumber",
    //   configSetting.phoneNumber ? configSetting.phoneNumber : ""
    // );
    // formData.append("Attachments", attachments ? attachments : "");
    // formData.append(
    //   "AttachmentStamps",
    //   attachmentStamps ? attachmentStamps : ""
    // );
    // formData.append("AttachmentUsed", attachmentUsed ? attachmentUsed : "");

    // formData.append("Templates[0].id", "1");
    // formData.append("Templates[0].description", contentEmailRegister);

    // formData.append("Templates[1].id", "2");
    // formData.append("Templates[1].description", contentEmailChangePassword);

    // formData.append("Templates[2].id", "3");
    // formData.append("Templates[2].description", contentEmailChangePassword);

    // formData.append("Templates[3].id", "4");
    // formData.append("Templates[3].description", contentEmailChangePassword);

    // formData.append("Templates[4].id", "5");
    // formData.append("Templates[4].description", contentEmailChangePassword);

    // formData.append("Templates[5].id", "6");
    // formData.append("Templates[5].description", contentEmailChangePassword);

    // formData.append("Templates[6].id", "7");
    // formData.append("Templates[6].description", contentEmailSendToPrinter);

    // Loading.show();

    // this.props.updateConfigSystem(formData).then((res) => {
    //   Loading.close();

    //   const data = res.data || {};

    //   if (data.status == 200) {
    //     toast.success("Lưu thông tin thành công!");
    //   } else {
    //     const message = getErrorMessageServer(res);
    //     this.setState({ messageErr: message });
    //     this.toggleModal("popupMessage");
    //   }
    // });
  };

  onOpenMaps = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowMapViewLocation: true,
      };
    });
  };

  onConfirmLocation = () => {
    let { gps, position } = this.state;
    const locationChange = this.state.locationChange;
    gps = `${position.latitude},${position.longitude}`;
    if (locationChange) {
      this.setState((previousState) => {
        return {
          ...previousState,
          gps,
          locationChange: null,
          isShowMapViewLocation: false,
          configSetting: {
            ...previousState.configSetting,
            location: gps,
          },
        };
      });
    }
  };
  onClickMap = (e) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        locationChange: {
          lat: e.lat,
          lng: e.lng,
        },
        position: {
          latitude: e.lat,
          longitude: e.lng,
        },
      };
    });
  };
  onChangeLocation = (location) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        locationChange: {
          lat: location.center.lat,
          lng: location.center.lng,
        },
        positionChange: {
          latitude: location.center.lat,
          longitude: location.center.lng,
        },
      };
    });
  };
  onCurrentPosition = () => {
    currentPosition().then((res) => {
      if (res.status) {
        this.setState((previousState) => {
          return {
            ...previousState,
            position: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            positionChange: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
          };
        });
      }
    });
  };
  onSelectPosition = ({ latitude, longitude }) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        position: {
          latitude: latitude,
          longitude: longitude,
        },
        positionChange: {
          latitude: latitude,
          longitude: longitude,
        },
      };
    });
  };
  onCloseMapViewLocation = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowMapViewLocation: false,
      };
    });
  };
  handleImageUploadSuccess = (file, previewUrl) => {
    this.setState(
      (previousState) => ({
        configSetting: {
          ...previousState.configSetting,
          businessImageFile: file,
          businessImageUrlVal: previewUrl,
        },
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleBusinessLicenseImagesChange = (imagesList) => {
    this.setState(
      (previousState) => ({
        configSetting: {
          ...previousState.configSetting,
          businessLicenseImages: imagesList,
        },
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };
  handleRegistrationPaperImagesImagesChange = (imagesList) => {
    this.setState(
      (previousState) => ({
        configSetting: {
          ...previousState.configSetting,
          registrationPaperImages: imagesList,
        },
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };
  handleWorkImagesImagesChange = (imagesList) => {
    this.setState(
      (previousState) => ({
        configSetting: {
          ...previousState.configSetting,
          workImages: imagesList,
        },
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };
  render() {
    const {
      configSetting,
      errorsConfigSystem,
      currentTab,
      options,
      isShowMapViewLocation,
      position,
      positionChange,
    } = this.state;

    options.map((option) => {
      option.name = option.companyName;
      option.value = option.id;
    });

    return (
      <div className="config-system">
        <div className="config-system-tab">
          <div
            onClick={this.onChooseTab(0)}
            className={`config-system-tab-item config-system-tab-item-button ${
              currentTab == 0 ? "active" : ""
            }`}
          >
            THÔNG TIN CHUNG
          </div>
          <div
            onClick={this.onChooseTab(1)}
            className={`config-system-tab-item config-system-tab-item-button ${
              currentTab == 1 ? "active" : ""
            }`}
          >
            THÔNG TIN MỞ RỘNG
          </div>
        </div>
        <div className="config-system-content">
          {currentTab == 0 ? (
            <div className="config-system-content-config-system">
              <h2>Thông tin chưa được kiểm chứng và xác thực</h2>
              <div>
                <label className="form-control-label">Hình đại diện</label>
                <ImageUploader
                  initialImageUrl={Noimg}
                  onFileSelected={this.handleImageUploadSuccess}
                />
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Tên doanh nghiệp &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("businessName")}
                      value={configSetting.businessName}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.businessName}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Mã số thuế &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("taxCode")}
                      value={configSetting.taxCode}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.taxCode}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Ngành nghề &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <select
                      onChange={this.onChangeValue("industryId")}
                      value={configSetting.industryId}
                      className="config-system-content-config-system-item-input"
                    >
                      <option value="">Chọn ngành nghề</option>
                      <option value="1">Công nghệ thông tin</option>
                      <option value="2">Kinh doanh</option>
                      <option value="3">Marketing</option>
                    </select>
                    <p className="form-error-message">
                      {errorsConfigSystem.industryId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-item ml-2 mr-2">
                <label className="config-system-content-config-system-item-label">
                  Giới thiệu
                </label>
                <div className="config-system-content-config-system-item-box">
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor
                      onInit={(_, editor) => {
                        this.refcontentEmailRegister = editor;
                      }}
                      initialValue={configSetting.introduce}
                      init={{
                        width: "100%",
                        height: 300,
                        menubar: false,
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
                              var blobInfo = blobCache.create(id, file, base64);
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
                                  authorization: localStorage.getItem("TOKEN"),
                                },
                                data: imageFile,
                              });
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: "Lỗi hệ thống" });
                                _this.toggleModal("popupMessage");
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: "Lỗi hệ thống" });
                              _this.toggleModal("popupMessage");
                              return;
                            }
                          };

                          input.click();
                        },
                      }}
                    />
                  </InputGroup>

                  <p className="form-error-message">
                    {errorsConfigSystem.introduce}
                  </p>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Địa chỉ &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("address")}
                      value={configSetting.address}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Tỉnh/Thành &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <select
                      onChange={this.onChangeValue("provinceId")}
                      value={configSetting.provinceId}
                      className="config-system-content-config-system-item-input"
                    >
                      <option value="">Chọn Tỉnh/Thành</option>
                      <option value="1">Công nghệ thông tin</option>
                      <option value="2">Kinh doanh</option>
                      <option value="3">Marketing</option>
                    </select>
                    <p className="form-error-message">
                      {errorsConfigSystem.provinceId}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Quận/Huyện &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <select
                      onChange={this.onChangeValue("districtId")}
                      value={configSetting.districtId}
                      className="config-system-content-config-system-item-input"
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      <option value="1">Công nghệ thông tin</option>
                      <option value="2">Kinh doanh</option>
                      <option value="3">Marketing</option>
                    </select>
                    <p className="form-error-message">
                      {errorsConfigSystem.districtId}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Phường/Xã &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <select
                      onChange={this.onChangeValue("wardId")}
                      value={configSetting.wardId}
                      className="config-system-content-config-system-item-input"
                    >
                      <option value="">Chọn Phường/Xã</option>
                      <option value="1">Công nghệ thông tin</option>
                      <option value="2">Kinh doanh</option>
                      <option value="3">Marketing</option>
                    </select>
                    <p className="form-error-message">
                      {errorsConfigSystem.wardId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Điện thoại &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("phoneNumber")}
                      value={configSetting.phoneNumber}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Fax
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("faxText")}
                      value={configSetting.faxText}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.faxText}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Email
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("email")}
                      value={configSetting.email}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.email}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Website
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("website")}
                      value={configSetting.website}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.website}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Tên người liên hệ &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("contactPersonName")}
                      value={configSetting.contactPersonName}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactPersonName}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Điện thoại người liên hệ &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("contactPersonPhone")}
                      value={configSetting.contactPersonPhone}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactPersonPhone}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Email người liên hệ &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <input
                      onChange={this.onChangeValue("contactPersonEmail")}
                      value={configSetting.contactPersonEmail}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactPersonEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-multi">
                <div
                  className="config-system-content-config-system-multi-item ml-2 mr-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    userSelect: "none",
                  }}
                >
                  <label
                    htmlFor="is-check-planning-input"
                    style={{ margin: "0" }}
                    className="config-system-content-config-system-item-label"
                  >
                    Kiểm tra quy hoạch vùng sản xuất
                  </label>
                  <input
                    id="is-check-planning-input"
                    onChange={this.onChangeValue("isCheckPlanning")}
                    checked={configSetting.isCheckPlanning}
                    type="checkbox"
                    className="config-system-content-config-system-item-input"
                    style={{ width: "fit-content", marginLeft: "5px" }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {currentTab == 1 ? (
            <div className="config-system-content-config-system">
              <div className="config-system-content-config-system-item-function">
                <div
                  className="config-system-content-config-system-multi"
                  style={{ width: " 100%" }}
                >
                  <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                    <label className="config-system-content-config-system-item-label">
                      Vị trí &nbsp;
                      <b style={{ color: "red" }}>*</b>
                    </label>
                    <div
                      style={{ position: "relative", display: "flex" }}
                      className="config-system-content-config-system-item-box"
                    >
                      <input
                        onChange={this.onChangeValue("location")}
                        value={configSetting.location}
                        type="text"
                        readOnly
                        className="config-system-content-config-system-item-input"
                      />
                      <button
                        style={{ position: "absolute", right: "10px" }}
                        className="wrap-insert-or-update-zone-item-location"
                      >
                        <img
                          className="wrap-insert-or-update-zone-item-location-icon"
                          style={{ cursor: "pointer" }}
                          src={ICON_COMMONS.Location}
                          onClick={this.onOpenMaps}
                        />
                      </button>
                      <p className="form-error-message">
                        {errorsConfigSystem.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-item-function">
                <div
                  className="config-system-content-config-system-multi"
                  style={{ width: " 100%" }}
                >
                  <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                    <ImageGalleryUploader
                      mdVal={3}
                      title="Giấy phép kinh doanh"
                      // initialImages={businessLicenseImages}
                      onImagesChange={this.handleBusinessLicenseImagesChange}
                    />
                  </div>
                </div>
              </div>

              <div className="config-system-content-config-system-item-function">
                <div
                  className="config-system-content-config-system-multi"
                  style={{ width: " 100%" }}
                >
                  <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                    <ImageGalleryUploader
                      mdVal={3}
                      title="Giấy đăng ký/ chứng nhận có liên quan"
                      onImagesChange={
                        this.handleRegistrationPaperImagesImagesChange
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="config-system-content-config-system-item-function">
                <div
                  className="config-system-content-config-system-multi"
                  style={{ width: " 100%" }}
                >
                  <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                    <ImageGalleryUploader
                      mdVal={3}
                      title="Một số hình ảnh hoạt động"
                      onImagesChange={this.handleWorkImagesImagesChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {isShowMapViewLocation && (
          <div className="wrap-manage-company-location">
            <GoogleMapReact
              animation={window.google.maps.Animation.DROP}
              bootstrapURLKeys={{ key: MAP_KEY }}
              defaultZoom={15}
              yesIWantToUseGoogleMapApiInternals
              defaultCenter={{
                lat: positionChange.latitude,
                lng: positionChange.longitude,
              }}
              center={{
                lat: positionChange.latitude,
                lng: positionChange.longitude,
              }}
              onClick={this.onClickMap}
              onChange={this.onChangeLocation}
            >
              <AnyReactComponent
                lat={position.latitude}
                lng={position.longitude}
                text="My Marker"
              />
            </GoogleMapReact>
            <GoogleAutoCompleteInput
              onSelect={this.onSelectPosition}
              placeholder="Tìm kiếm địa chỉ..."
              className="wrap-manage-company-location-search-input"
              classNameContainer="wrap-manage-company-location-search"
            />
            <div className="wrap-manage-company-location-function">
              <button
                onClick={this.onCloseMapViewLocation}
                className="wrap-manage-company-location-function-button wrap-manage-company-location-function-button-close"
              >
                ĐÓNG
              </button>
              <button
                onClick={this.onConfirmLocation}
                className="wrap-manage-company-location-function-button wrap-manage-company-location-function-button-confirm"
              >
                CHỌN VỊ TRÍ NÀY
              </button>
            </div>
            <button
              onClick={this.onCurrentPosition}
              className="wrap-manage-company-location-current"
            >
              <img
                className="wrap-manage-company-location-current-icon"
                src="/cores/imgs/ics/current_position.png"
                alt="Current position"
              />
            </button>
          </div>
        )}
        <Button
          color="default"
          type="button"
          className={`btn-success-cs`}
          style={{ margin: "inherit" }}
          onClick={this.onSaveConfigSystem}
        >
          <img src={SaveIcon1} alt="Lưu lại" />
          <span>Lưu lại</span>
        </Button>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
    dataCompany: state.CompanyListRegisteredStore,
    stampTemplate: state.StampPlateStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
    ...bindActionCreators(actionCompanyListRegistered, dispatch),
    ...bindActionCreators(actionStampPlate, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  BusinessInformation
);
