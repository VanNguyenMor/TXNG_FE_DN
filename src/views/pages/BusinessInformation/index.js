import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../../assets/css/page/config_system.css";
import { replaceCommaDot } from "bases/helper";
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import "./select-search.css";
import Noimg from "../../../assets/img/NoImg/NoImg.jpg";
import axios from "axios";
import { CONFIG_UPDATE_IMG } from "../../../apis";
import { toast, ToastContainer } from "react-toastify";
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
import { fetchData } from "helpers/fetchData";
import Select from "components/Select";
import { parseImageUrls } from "utils/parseImageUrls";
import formatFieldsForSelect from "utils/formatFieldsForSelect";

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
      listFields: null,
      provinces: null,
      districts: null,
      wards: null,

      configSetting: {
        verifiedImage: null,
        businessImageFile: null,
        businessImageUrlVal: Noimg,
        businessAvatar: "",
        companyName: "",
        companyCode: "",
        industryId: null,
        introduce: "",
        isShowMapViewLocation: false,
        address: "",
        provinceID: null,
        pRovinceName: "",
        districtID: null,
        districtName: "",
        wardID: null,
        logo: null,
        wardName: "",
        phoneNumber: "",
        fax: "",
        email: "",
        website: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        isCheckZone: false,
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

  componentDidUpdate(prevProps) {
    if (prevProps.initialImageUrl !== this.props.initialImageUrl) {
      this.setState({
        previewImageUrl:
          this.props.initialImageUrl || "URL_TO_DEFAULT_NOIMG_IMAGE",
      });
    }
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

  onChangeValue = (name) => (eOrValue) => {
    let value;

    if (eOrValue && eOrValue.target) {
      if (eOrValue.target.type === "checkbox") {
        value = eOrValue.target.checked;
      } else {
        value = eOrValue.target.value;

        if (name === "price") {
          value = replaceCommaDot(value, "");
        }
      }
    } else {
      value = eOrValue;
    }

    this.setState((previousState) => ({
      ...previousState,
      configSetting: {
        ...previousState.configSetting,
        [name]: value,
      },
    }));
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
  async loadData() {
    try {
      // Lấy danh sách ngành nghề
      const resFieldCompany = await fetchData.infoCompany.getField();

      if (resFieldCompany) {
        this.setState((prevState) => ({
          ...prevState,
          listFields: resFieldCompany,
        }));
      }

      // Lấy ra tất cả tỉnh thành
      const resProvinceAll = await fetchData.infoCompany.getProvinceAll();

      if (resProvinceAll) {
        this.setState((prevState) => ({
          ...prevState,
          provinces: resProvinceAll,
        }));
      }

      // Lấy thông tin công ty theo account id
      const resCurrentCompany = await fetchData.account.getCurrentCompany();

      const id = resCurrentCompany?.company?.id;
      if (!id) {
        console.warn("Không lấy được companyId");
        return;
      }
      await this.loadDetailData(id);
    } catch (error) {
      console.error("Lỗi khi load detailData:", error);
    }
  }
  async loadDetailData(id) {
    if (!id) return;

    try {
      const res = await fetchData.infoCompany.detail(id);

      const {
        companyName,
        companyCode,
        id: companyId,
        fieldID,
        fieldName,
        address,
        provinceID,
        pRovinceName,
        districtID,
        districtName,
        wardID,
        wardName,
        logo,
        phoneNumber,
        email,
        fax,
        website,
        contactName,
        contactPhone,
        contactEmail,
        isCheckZone,
        location,
        certifications,
        businessLicenses,
        images,
        verifiedImage,
        verifiedStatus,
      } = res;
      const listFieldsData = formatFieldsForSelect(fieldID, fieldName);
      this.setState(
        (prevState) => {
          const selectedIndustry = listFieldsData.filter((f) =>
            fieldID?.split(",").includes(f.id)
          );

          return {
            ...prevState,
            configSetting: {
              ...prevState.configSetting,
              companyName,
              companyCode,
              id: companyId,
              address,
              provinceID,
              pRovinceName,
              districtID,
              districtName,
              wardID,
              wardName,
              logo,
              phoneNumber,
              fax,
              email,
              website,
              contactName,
              verifiedStatus,
              contactPhone,
              contactEmail,
              isCheckZone,
              verifiedImage,
              location,
              businessLicenseImages: parseImageUrls(businessLicenses, Noimg),
              registrationPaperImages: parseImageUrls(certifications, Noimg),
              workImages: parseImageUrls(images, Noimg),
              industryId: selectedIndustry,
            },
          };
        },
        () => {
          this.onLoadListDistrictByProvinceId(provinceID);
          this.onLoadListWardByDistrictId(districtID);
        }
      );
    } catch (error) {
      console.error("Lỗi khi load detailData:", error);
    }
  }

  async onLoadListDistrictByProvinceId(provinceID) {
    try {
      const resDistrictCompanyBox =
        await fetchData.infoCompany.getListDistrictByProvinceId(provinceID);
      this.setState({ districts: resDistrictCompanyBox });
    } catch (error) {
      console.error(error);
    }
  }

  async onLoadListWardByDistrictId(districtID) {
    try {
      const resWardCompanyBox =
        await fetchData.infoCompany.getListWardByDistrictId(districtID);
      this.setState({ wards: resWardCompanyBox });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    // this.loadDetailData(companyId);
    this.loadData();
  }

  async uploadSingleFile(file, type = "verifiedImage") {
    if (!file) return null;

    const uploadFormData = new FormData();

    switch (type) {
      case "verifiedImage":
        uploadFormData.append("VerifiedImageFile", file, file.name);
        break;
      case "businessLicense":
        uploadFormData.append("BusinessLicensesFile", file, file.name);
        break;
      case "registrationPaper":
        uploadFormData.append("RegistrationPapersFile", file, file.name);
        break;
      case "workImages":
        uploadFormData.append("WorkImagesFile", file, file.name);
        break;
      default:
        uploadFormData.append("file", file, file.name);
    }

    try {
      const res = await fetchData.infoCompany.uploadFile(uploadFormData);

      if (res && res.data && res.data.uploadKey) {
        return res.data.uploadKey;
      }
      return null;
    } catch (error) {
      console.error("Error during file upload:", error);
      return null;
    }
  }

  async uploadAndFormatImages(imagesList) {
    if (!imagesList?.length) return "";

    const processedImages = await Promise.all(
      imagesList.map(async (img) => {
        if (typeof img === "string" && img !== Noimg) {
          return img;
        }

        if (img?.file) {
          return await this.uploadSingleFile(img.file);
        }

        return "";
      })
    );

    return processedImages.filter((name) => name).join(";");
  }

  onSaveConfigSystem = async () => {
    const { configSetting } = this.state;

    try {
      const formData = new FormData();

      formData.append("ID", configSetting.id || "");
      formData.append("WardID", configSetting.wardID || "");
      formData.append("Address", configSetting.address || "");
      formData.append("TaxCode", configSetting.companyCode || "");
      formData.append("DistrictID", configSetting.districtID || "");
      formData.append("Logo", configSetting.logo || "");
      formData.append("ProvinceID", configSetting.provinceID || "");
      formData.append("CompanyName", configSetting.companyName || "");
      formData.append("IsCheckZone", configSetting.isCheckZone || "");
      formData.append("PhoneNumber", configSetting.phoneNumber || "");
      formData.append("Fax", configSetting.fax || "");
      const industryData = configSetting.industryId;
      let selectedIDs = [];
      if (industryData) {
        if (Array.isArray(industryData)) {
          selectedIDs = industryData
            .map((item) => (item && item.id ? item.id : null))
            .filter((id) => id !== null);
        } else if (typeof industryData === "object" && industryData.id) {
          selectedIDs = [industryData.id];
        }
      }
      selectedIDs.forEach((id) => {
        formData.append("fieldIDs", id);
      });

      formData.append("Introduce", configSetting.introduce || "");
      formData.append("Email", configSetting.email || "");
      formData.append("Website", configSetting.website || "");
      formData.append("ContactName", configSetting.contactName || "");
      formData.append("ContactPhone", configSetting.contactPhone || "");
      formData.append("ContactEmail", configSetting.contactEmail || "");
      formData.append("Location", configSetting.location || "");

      if (configSetting.verifiedImage) {
        formData.append(
          "VerifiedImage",
          Array.isArray(configSetting.verifiedImage)
            ? configSetting.verifiedImage[0] || ""
            : configSetting.verifiedImage || ""
        );
      }

      const formatImageUrls = (imageArray) => {
        if (!Array.isArray(imageArray) || imageArray.length === 0) {
          return "";
        }
        const cleanUrls = imageArray.filter(
          (url) => url && url.startsWith("http")
        );
        return cleanUrls.join(";");
      };

      const businessLicenseStr = formatImageUrls(
        configSetting.businessLicenseImages
      );
      formData.append("BusinessLicenses", businessLicenseStr);

      const registrationPaperStr = formatImageUrls(
        configSetting.registrationPaperImages
      );
      formData.append("Certifications", registrationPaperStr);

      const workImagesStr = formatImageUrls(configSetting.workImages);
      formData.append("Images", workImagesStr);

      const response = await fetchData.infoCompany.update(formData);

      try {
        toast.success("Cập nhật thành công!");
        await this.loadDetailData(configSetting.id);
      } catch {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu dữ liệu");
    }
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

  handleLogoUpload = async (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetchData.infoCompany.uploadFile(formData);
      if (response) {
        const newLogoUrl = Array.isArray(response) ? response : response;

        this.setState(
          (prevState) => ({
            configSetting: {
              ...prevState.configSetting,
              logo: newLogoUrl,
            },
          }),
          () => {
            if (this.props.onHandleChangeValue) {
              this.props.onHandleChangeValue(this.state);
            }
            toast.success("Cập nhật Hình đại diện thành công!");
          }
        );
      } else {
        toast.error("Lỗi: Không nhận được URL sau khi upload.");
      }
    } catch (error) {
      console.error("Lỗi upload Hình đại diện:", error);
      toast.error("Lỗi: Upload Hình đại diện thất bại.");
    }
  };

  handleImageUploadSuccess = async (file, previewUrl) => {
    if (file) {
      const uploadKey = await this.uploadSingleFile(file, "verifiedImage");

      if (!uploadKey) return;

      this.setState(
        (prev) => ({
          configSetting: {
            ...prev.configSetting,
            verifiedImage: uploadKey,
          },
        }),
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    } else if (!previewUrl) {
      this.setState((prev) => ({
        configSetting: {
          ...prev.configSetting,
          verifiedImage: null,
        },
      }));
    }
  };

  handleBusinessLicenseImagesChange = (imagesList) => {
    console.log(imagesList);
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
      // state list
      provinces,
      districts,

      configSetting,
      errorsConfigSystem,
      currentTab,
      options,
      isShowMapViewLocation,
      position,
      positionChange,
      listFields,
      industryId,
      verifiedStatus,
    } = this.state;

    const { businessLicenseImages, registrationPaperImages, workImages } =
      configSetting;

    options.map((option) => {
      option.name = option.companyName;
      option.value = option.id;
    });

    const allFields =
      listFields && listFields.fields
        ? listFields.fields
        : Array.isArray(listFields)
        ? listFields
        : [];
    const industryDefaultValue =
      configSetting.industryId &&
      Array.isArray(configSetting.industryId) &&
      configSetting.industryId.length
        ? configSetting.industryId.map((f) => f.id).join(",")
        : null;

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
              <h2
                style={{
                  color: verifiedStatus === 0 ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {verifiedStatus === 0
                  ? "Thông tin chưa được kiểm chứng và xác thực"
                  : "Thông tin đã được kiểm chứng và xác thực"}
              </h2>
              <div>
                <label className="form-control-label">Hình đại diện</label>
                <ImageUploader
                  key={configSetting.logo}
                  initialImageUrl={configSetting.logo || Noimg}
                  onFileSelected={this.handleLogoUpload}
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
                      onChange={this.onChangeValue("companyName")}
                      value={configSetting.companyName}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.companyName}
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
                      onChange={this.onChangeValue("companyCode")}
                      value={configSetting.companyCode}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.companyCode}
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
                    <Select
                      labelMark={
                        configSetting.industryId
                          ? configSetting.industryId.map(
                              (f) => f.fieldName || f.label || f.name
                            )
                          : null
                      }
                      name="listFields"
                      title="Chọn ngành nghề"
                      data={listFields?.fields || []}
                      labelName="fieldName"
                      defaultValue={
                        configSetting.industryId
                          ? configSetting.industryId.map((f) => f.id).join(",")
                          : null
                      }
                      isMulti={true}
                      val="id"
                      handleChange={(value) => {
                        if (!value) {
                          this.onChangeValue("industryId")([]);
                          return;
                        }
                        const ids = value
                          .toString()
                          .split(",")
                          .filter((v) => v);
                        const selected = (listFields?.fields || []).filter(
                          (f) => ids.includes(String(f.id))
                        );
                        this.onChangeValue("industryId")(selected);
                      }}
                    />

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
                    <Select
                      labelMark={configSetting?.pRovinceName}
                      name="provinceID"
                      title="Chọn tỉnh/thành"
                      data={provinces}
                      labelName="provinceName"
                      defaultValue={configSetting?.provinceID}
                      val="id"
                      handleChange={this.onChangeValue("provinceID")}
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.provinceID}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Quận/Huyện &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <Select
                      labelMark={configSetting?.districtName}
                      name="districtID"
                      title="Chọn Quận/Huyện"
                      data={districts}
                      labelName="districtName"
                      defaultValue={configSetting?.districtID}
                      val="id"
                      handleChange={this.onChangeValue("districtID")}
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.districtID}
                    </p>
                  </div>
                </div>
                <div className="config-system-content-config-system-multi-item ml-2 mr-2">
                  <label className="config-system-content-config-system-item-label">
                    Phường/Xã &nbsp;
                    <b style={{ color: "red" }}>*</b>
                  </label>
                  <div className="config-system-content-config-system-item-box">
                    <Select
                      labelMark={configSetting?.wardName}
                      name="wardID"
                      title="Chọn Phường/Xã"
                      data={districts}
                      labelName="wardName"
                      defaultValue={configSetting?.wardID}
                      val="id"
                      handleChange={this.onChangeValue("wardID")}
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.wardID}
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
                      onChange={this.onChangeValue("fax")}
                      value={configSetting.fax}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.fax}
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
                      onChange={this.onChangeValue("contactName")}
                      value={configSetting.contactName}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactName}
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
                      onChange={this.onChangeValue("contactPhone")}
                      value={configSetting.contactPhone}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactPhone}
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
                      onChange={this.onChangeValue("contactEmail")}
                      value={configSetting.contactEmail}
                      type="text"
                      className="config-system-content-config-system-item-input"
                      autoComplete="new-password"
                    />
                    <p className="form-error-message">
                      {errorsConfigSystem.contactEmail}
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
                    onChange={this.onChangeValue("isCheckZone")}
                    checked={configSetting.isCheckZone}
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
                      initialImages={businessLicenseImages}
                      uploadKey="files"
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
                      initialImages={registrationPaperImages}
                      uploadKey="files"
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
                      initialImages={workImages}
                      uploadKey="files"
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

export default BusinessInformation;
