import React, { Component } from "react";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import GoogleAutoCompleteInput from "../../../components/GoogleAutoCompleteInput";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import { UNITS } from "helpers/constant";
import { ICON_COMMONS } from "../../../assets/img";
import GoogleMapReact from "google-map-react";
import { LOCATION_DEFAULT, ZOOM_DEFAULT } from "../../../services/Common";
import locationIcon from "../../../assets/img/locationIcon/location.png";
import { MAP_KEY } from "../../../services/Common";
import { currentPosition } from "utils/geo";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import Imgbt from "../../../assets/img/buttons/chonhinh.svg";
import IconAdd from "../../../assets/img/buttons/add.svg";
import IconDelete from "../../../assets/img/buttons/delete.png";
import { Guid } from "guid-typescript";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { validExtensionFileImage } from "bases/helper";
import { validSize } from "bases/helper";
import { MAX_FILE_IMAGE_SIZE } from "bases/helper";
import { EXTENSION_FILE_IMAGE } from "bases/helper";

import { Button, InputGroup } from "reactstrap";
import { fetchData } from "helpers/fetchData";

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  background: isDragging ? "lightgreen" : "#11C7EF",

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "100%",
});
const AnyReactComponent = ({ text }) => (
  <div>
    <img width={25} src={locationIcon} />
  </div>
);

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // state use
      provinces: null,
      districts: null,
      wards: null,
      plantingTypes: null,
      gpsNew: [],
      detailData: null,

      plantingTypeName: null,
      plantingZoneName: null,
      unitRoundName: null,
      unitBadName: null,
      name: "",
      gps: "",
      round: "",
      bad: "",
      isShowArea: true,
      plantingZoneId: null,

      unitIdBad: null,
      unitIdRound: null,
      icon: null,
      iconFile: null,
      position: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng,
      },
      positionChange: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng,
      },
      items: getItems(10),
      pathImageDefaul: "",
      mfileImg: "",
      ArrayFileAdd: "",
      fileImage: "",
      color: "#000000",

      // form data
      provinceId: null,
      wardId: null,
      districtId: null,
      plantingTypeId: null,
      area: 0,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.redSelect = null;
    this.refInputName = null;
    this.refFileImage = null;
    this.refFileImages = null;
  }
  async loadDetailData(id) {
    if (!id) return;

    try {
      const res = await fetchData.plantingZone.detail(id);
      if (res && res.plantingZone) {
        const plantingZone = res.plantingZone;
        const gpsList =
          res.plantingZoneGPSs?.map((item) => ({
            id: item.id,
            content: item.gps,
          })) || [];

        const parsedAttributes = (() => {
          try {
            return JSON.parse(plantingZone.attributes) || {};
          } catch {
            return {};
          }
        })();

        const newDataInsert = {
          id: plantingZone.id || null,
          name: plantingZone.name || "",
          plantingTypeId: plantingZone.plantingTypeID || "",
          provinceId: plantingZone.provinceID || "",
          districtId: plantingZone.districtID || "",
          wardId: plantingZone.wardID || "",
          gps: plantingZone.gps || {},
          gpsNew: gpsList,
          plantingTypeAttribute: parsedAttributes,
          plantingZoneId: plantingZone.id || null,
          fileView: plantingZone.images || plantingZone.icon || "",
        };

        this.setState({
          detailData: plantingZone,
          dataInsert: newDataInsert,
          name: newDataInsert.name,
          plantingTypeId: newDataInsert.plantingTypeId,
          provinceId: newDataInsert.provinceId,
          districtId: newDataInsert.districtId,
          wardId: newDataInsert.wardId,
          gps: newDataInsert.gps,
          gpsNew: newDataInsert.gpsNew,
          area: this.calculateArea(newDataInsert.gpsNew),
          plantingTypeAttribute: newDataInsert.plantingTypeAttribute,
          plantingZoneId: newDataInsert.plantingZoneId,
          fileView: newDataInsert.fileView,
        });

        if (this.props.onLoadDetailData) {
          this.props.onLoadDetailData(newDataInsert);
        }
      }
    } catch (error) {
      console.error("Lỗi khi load detailData:", error);
    }
  }

  async handleGetData() {
    try {
      const [provinces, plantingTypes] = await Promise.all([
        fetchData.province.getAll(),
        fetchData.plantingType.getAll(),
      ]);

      this.setState((prevState) => ({
        ...prevState,
        provinces,
        plantingTypes: plantingTypes.plantingTypes || [],
      }));
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    }
  }

  async handleGetDistrictData() {
    this.setState({
      districts: await fetchData.district.getByProvinceId(
        this.state.provinceId
      ),
    });
  }
  async handleGetWardData() {
    this.setState({
      wards: await fetchData.ward.getByDistrictId(this.state.provinceId),
    });
  }

  componentWillMount() {
    this.handleGetData();

    if (this.props.id !== null && this.props.id !== undefined) {
      this.loadDetailData(this.props.id);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.loadDetailData(this.props.id);
    }
  }

  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        id: null,
        plantingTypeName: null,
        plantingZoneName: null,
        unitRoundName: null,
        unitBadName: null,
        name: "",
        gps: "",
        round: "",
        bad: "",
        plantingTypeId: null,
        plantingZoneId: null,
        wardId: null,
        districtId: null,
      };
    });
  }

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();

        clearTimeout(timeOut);
      }, 100);
    }
  };

  onChangeSelect = (name) => (value) => {
    if (name === "plantingTypeId") {
      this.setState({ [name]: value, plantingTypeAttribute: {} }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    } else {
      this.setState({ [name]: value }, () => {
        if (name === "provinceId") {
          this.handleGetDistrictData();
        }
        if (name === "districtId") {
          this.handleGetWardData();
        }
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  };

  onChangeValue = (name) => (e) => {
    const value = e.target.value;

    this.setState(
      (prev) => ({
        ...prev,
        dataInsert: {
          ...prev.dataInsert,
          [name]: value,
        },
        [name]: value,
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state.dataInsert);
        }
      }
    );
  };

  onChangeValueGPS = (name) => (e) => {
    const value = e.target.value.replace(/[^0-9., ]/gi, "");
    this.setState({ [name]: value });
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

  handleZoomMap = (gps) => {
    if (gps.length === 0) return ZOOM_DEFAULT;
    else {
      const location = gps.split(",");

      if (typeof location[2] !== "undefined") {
        const zoom = Number(location[2].replace("z", ""));

        return zoom;
      } else return ZOOM_DEFAULT;
    }
  };

  onCloseMapViewLocation = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowMapViewLocation: false,
      };
    });
  };

  onOpenMaps = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        isShowMapViewLocation: true,
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

  onConfirmLocation = () => {
    let { gps, position } = this.state;
    const locationChange = this.state.locationChange;
    gps = `${position.latitude},${position.longitude}`;
    if (locationChange) {
      this.setState((previousState) => {
        return {
          ...previousState,
          // location: locationChange,
          gps,
          locationChange: null,
          isShowMapViewLocation: false,
        };
      });
    }
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

  handleChangeIMG = (event) => {
    let { icon, iconFile } = this.state;
    if (event.target.files[0] != undefined) {
      this.setState({
        fileView: URL.createObjectURL(event.target.files[0]),
        file: event.target.files[0],
      });
    } else {
      this.setState({
        fileView: null,
        file: null,
      });
    }

    const ev = event.target.files[0];

    iconFile = ev;
    this.setState({ iconFile }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });

    //console.log(event.target.files[0])
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        //errMessage:null
      });
    }
  };

  onUpdateFileImage = () => {
    this.refFileImage.click();
  };
  onUpdateFileImages = () => {
    this.refFileImages.click();
  };

  onDeleImg = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        file: null,
        fileView: null,
      };
    });
  };

  onAddArea = () => {
    const { gps, gpsNew } = this.state;
    const { onHandleChangeValue } = this.props;

    if (!gps) {
      this.setState({ errMessage: "Bạn vui lòng chọn GPS" });
      return;
    }

    if (
      gpsNew.find(
        (p) => p.content.trim().toUpperCase() === gps.trim().toUpperCase()
      )
    ) {
      this.setState({ errMessage: "Bạn đã chọn GPS này" });
      return;
    }

    const newGps = [...gpsNew, { id: Guid.create().toString(), content: gps }];
    this.setState(
      {
        gpsNew: newGps,
        gps: "",
        errMessage: "",
        area: this.calculateArea(newGps),
      },
      () => {
        if (onHandleChangeValue) onHandleChangeValue(this.state);
      }
    );
  };

  onChangeGPSItem = (id) => (e) => {
    const value = e.target.value;
    this.setState(
      (prevState) => {
        const gpsNew = prevState.gpsNew.map((p) =>
          p.id === id ? { ...p, content: value } : p
        );
        return { gpsNew, area: this.calculateArea(gpsNew) };
      },
      () => {
        if (this.props.onHandleChangeValue)
          this.props.onHandleChangeValue(this.state);
      }
    );
  };

  latLngToXY = (lat, lng) => {
    const R = 6371000;
    const x = R * ((lng * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180);
    const y = R * ((lat * Math.PI) / 180);
    return { x, y };
  };

  calculateArea = (gpsNewInput) => {
    const gpsNew = gpsNewInput || this.state.gpsNew;
    if (gpsNew.length < 3) return 0;
    const points = gpsNew.map((p) => {
      const [lat, lng] = p.content.split(",").map(Number);
      return this.latLngToXY(lat, lng);
    });
    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  onDeleteArea = (id) => () => {
    const gpsNew = this.state.gpsNew.filter((p) => p.id !== id);
    this.setState({ gpsNew, area: this.calculateArea(gpsNew) }, () => {
      if (this.props.onHandleChangeValue)
        this.props.onHandleChangeValue(this.state);
    });
  };

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const gpsNew = reorder(
      this.state.gpsNew,
      result.source.index,
      result.destination.index
    );

    this.setState(
      {
        gpsNew,
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  }

  handleChangeComplete = (color) => {
    const { onHandleChangeValue } = this.props;
    this.setState({ color: color.hex }, () => {
      if (onHandleChangeValue) {
        onHandleChangeValue(this.state);
      }
    });
  };

  onChangeFileImage = (e) => {
    const { id, pathImageDefaul } = this.state;
    const { onHandleChangeValue } = this.props;
    const files = e.target.files || [];
    if (files.length > 0) {
      const file = files || null;
      if (file) {
        const errorsInfoConfig = {};

        this.setState((previousState) => {
          return {
            ...previousState,
            errorsInfoConfig,
          };
        });
        for (let i = 0; i < file.length; i++) {
          if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
            errorsInfoConfig.banner =
              "Kích thước ảnh phải nhỏ hơn hoặc bằng " +
              MAX_FILE_IMAGE_SIZE +
              " mb";
          }
          if (!validExtensionFileImage(file[i].name)) {
            errorsInfoConfig.banner =
              "File hình ảnh sai định dạng " + EXTENSION_FILE_IMAGE.join(", ");
          }
        }
        this.setState((previousState) => {
          return {
            ...previousState,
            errorsInfoConfig,
          };
        });

        if (Object.keys(errorsInfoConfig).length > 0) {
          return;
        }
        if (this.state.mfileImg != "") {
          let _mfileImg = [...this.state.mfileImg];
          for (let i = 0; i < files.length; i++) {
            _mfileImg.push(
              new File([files[i]], files[i].name, { type: files[i].type })
            );
          }
          this.setState(
            (previousState) => {
              return {
                ...previousState,
                mfileImg: _mfileImg,
              };
            },
            () => {
              if (onHandleChangeValue) {
                onHandleChangeValue(this.state);
              }
            }
          );
        } else {
          this.setState({ mfileImg: files }, () => {
            if (onHandleChangeValue) {
              onHandleChangeValue(this.state);
            }
          });
        }
        const pathImage = Array.from(files).map((ee) =>
          URL.createObjectURL(ee)
        );
        if (this.state.ArrayFileAdd != "") {
          let _ArrayFileAdd = this.state.ArrayFileAdd;
          for (let i = 0; i < files.length; i++) {
            _ArrayFileAdd.push(pathImage[i]);
          }
        } else {
          this.setState({ ArrayFileAdd: pathImage });
        }
        // if (id) {
        if (pathImageDefaul) {
          this.setState((previousState) => {
            return {
              ...previousState,
              pathImageDefaul: this.state.pathImageDefaul.concat(pathImage),
            };
          });
        } else {
          this.setState((previousState) => {
            return {
              ...previousState,
              pathImageDefaul: pathImage,
            };
          });
        }
      }
    }
  };

  onDeleteFileImage = (e) => {
    const { pathImageDefaul, fileImage, ArrayFileAdd } = this.state;
    const { onHandleChangeValue } = this.props;
    var array = [...pathImageDefaul];
    var index = array.indexOf(e);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({
        pathImageDefaul: array,
      });
    }

    let flah = false;
    if (fileImage) {
      const spl = fileImage.split(";");
      Array.from(spl)
        .filter((x) => x === e)
        .map((item) => {
          flah = true;
        });

      if (flah == true) {
        spl.splice(spl.indexOf(e), 1);
        var fileImageSend = spl.join(";");
        this.setState(
          (previousState) => {
            return {
              ...previousState,
              fileImage: fileImageSend,
            };
          },
          () => {
            if (onHandleChangeValue) {
              onHandleChangeValue(this.state);
            }
          }
        );
      }
    }

    let flag = false;
    if (ArrayFileAdd) {
      Array.from(ArrayFileAdd)
        .filter((x) => x === e)
        .map((item) => {
          flag = true;
        });

      if (flag == true) {
        ArrayFileAdd.splice(ArrayFileAdd.indexOf(e), 1);
        let _ArrayFileAdd = [];
        for (let i = 0; i < ArrayFileAdd.length; i++) {
          fetch(ArrayFileAdd[i])
            .then((res) => res.blob())
            .then((blob) => {
              _ArrayFileAdd.push(
                new File(
                  [blob],
                  `${ArrayFileAdd[i].replace(
                    "blob:http://localhost:5000/"
                  )}.jpeg`,
                  { lastModified: new Date().getTime(), type: "image/jpeg" }
                )
              );
            });
        }

        this.setState((previousState) => {
          return {
            ...previousState,
            mfileImg: _ArrayFileAdd,
          };
        });
      }
    }
  };

  render() {
    const {
      // state use
      provinces,
      districts,
      wards,
      plantingTypes,

      positionChange,
      position,
      gps,
      plantingZoneId,
      plantingTypeName,
      name,
      isShowMapViewLocation,

      dataWard,
      dataDistrict,
      gpsNew,
      errMessage,
      popupMessage,

      // form data
      provinceId,
      wardId,
      districtId,
      provinceName,
      districtName,
      wardName,
      plantingTypeId,
      area,
    } = this.state;
    const { errors, id } = this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Tên vùng sản xuất&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={name}
                onChange={this.onChangeValue("name")}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>

            <p className="form-error-message">{errors.name || ""}</p>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Loại vùng sản xuất&nbsp;<b style={{ color: "red" }}>*</b>
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={plantingTypeId}
              labelMark={
                Array.isArray(plantingTypes)
                  ? plantingTypes.find((pt) => pt.id === plantingTypeId)
                      ?.name || null
                  : null
              }
              className="wrap-insert-or-update-zone-item-select"
              name="plantingTypeId"
              title="Chọn loại vùng sản xuất"
              data={plantingTypes || []}
              labelName="name"
              val="id"
              handleChange={this.onChangeSelect("plantingTypeId")}
            />
            <p className="form-error-message">{errors.plantingTypeId || ""}</p>
          </div>
        </div>

        {plantingTypeId &&
          plantingTypes &&
          plantingTypes.length > 0 &&
          (() => {
            const selectedType = plantingTypes.find(
              (pt) => pt.id === plantingTypeId
            );
            if (!selectedType) return null;

            let attributes = [];
            try {
              attributes = JSON.parse(selectedType.attributes);
            } catch (error) {
              console.error("Lỗi parse attributes:", error);
            }

            return attributes.map((attr, index) => (
              <div key={index} className="wrap-insert-or-update-zone-item">
                <label className="wrap-insert-or-update-zone-item-label">
                  {attr.name}
                </label>
                <div className="wrap-insert-or-update-zone-item-box">
                  <InputGroup className="input-group-alternative css-border-input">
                    <input
                      type={attr.dataType === 2 ? "number" : "text"}
                      className="wrap-insert-or-update-zone-item-input"
                      value={
                        this.state.plantingTypeAttribute?.[attr.name] || ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        this.setState(
                          (prev) => ({
                            plantingTypeAttribute: {
                              ...prev.plantingTypeAttribute,
                              [attr.name]: value,
                            },
                          }),
                          () => {
                            if (this.props.onHandleChangeValue) {
                              this.props.onHandleChangeValue(this.state);
                            }
                          }
                        );
                      }}
                    />
                  </InputGroup>
                </div>
              </div>
            ));
          })()}

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Tỉnh/thành
            {plantingZoneId ? null : (
              <>
                &nbsp;<b style={{ color: "red" }}>*</b>
              </>
            )}
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={provinceId}
              labelMark={
                provinces?.find((p) => p.id === provinceId)?.provinceName ||
                null
              }
              className="wrap-insert-or-update-zone-item-select"
              name="provinceId"
              title="Chọn Tỉnh/thành"
              data={provinces || []}
              labelName="provinceName"
              val="id"
              handleChange={this.onChangeSelect("provinceId")}
            />

            <p className="form-error-message">{errors.provinceId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Quận/Huyện
            {plantingZoneId ? null : (
              <>
                &nbsp;<b style={{ color: "red" }}>*</b>
              </>
            )}
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={districtId || null}
              labelMark={
                districts?.find((d) => d.id === districtId)?.districtName ||
                null
              }
              className="wrap-insert-or-update-zone-item-select"
              name="districtId"
              title="Chọn Quận/Huyện"
              data={districts || []}
              isDisable={!provinceId}
              labelName="districtName"
              val="id"
              handleChange={this.onChangeSelect("districtId")}
            />

            <p className="form-error-message">{errors.districtId || ""}</p>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Phường/Xã
            {plantingZoneId ? null : (
              <>
                &nbsp;<b style={{ color: "red" }}>*</b>
              </>
            )}
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <Select
              value={wardId || null}
              labelMark={
                wards?.find((w) => w.id === wardId)?.nameSearch || null
              }
              className="wrap-insert-or-update-zone-item-select"
              name="wardId"
              title="Chọn Phường/Xã"
              data={wards || []}
              isDisable={!districtId}
              labelName="nameSearch"
              val="id"
              handleChange={this.onChangeSelect("wardId")}
            />
            <p className="form-error-message">{errors.wardId || ""}</p>
          </div>
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <b>KHAI BÁO GPS</b>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            GPS
            {plantingZoneId ? null : (
              <>
                &nbsp;<b style={{ color: "red" }}>*</b>
              </>
            )}
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                value={gps}
                onChange={this.onChangeValueGPS("gps")}
                type="text"
                className="wrap-insert-or-update-zone-item-input"
                disabled={plantingZoneId ? true : false}
              />
            </InputGroup>

            <p className="form-error-message">{errors.gps || ""}</p>
            {errMessage != "" ? (
              <p className="form-error-message">{errMessage}</p>
            ) : null}
          </div>
          <button className="wrap-insert-or-update-zone-item-location">
            <img
              className="wrap-insert-or-update-zone-item-location-icon"
              style={{
                cursor: `${plantingZoneId ? "not-allowed" : "pointer"}`,
              }}
              src={ICON_COMMONS.Location}
              onClick={plantingZoneId ? null : this.onOpenMaps}
            />
          </button>
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

        <div className="wrap-insert-or-update-zone-add">
          <button
            type="button"
            onClick={this.onAddArea}
            className="wrap-insert-or-update-zone-add-button"
          >
            <img
              className="wrap-insert-or-update-zone-add-button-icon"
              src={IconAdd}
            />
            Thêm
          </button>
        </div>
        <div className="wrap-insert-or-update-zone-area">
          <label className="wrap-insert-or-update-zone-item-label">
            GPS được chọn
          </label>
          <p className="form-error-message">{errors.zone || ""}</p>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {gpsNew.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="wrap-css-planting-zone"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <input
                            type="text"
                            value={item.content}
                            onChange={this.onChangeGPSItem(item.id)}
                            style={{ width: "80%" }}
                          />
                          <button onClick={this.onDeleteArea(item.id)}>
                            Xóa
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
          <div className="wrap-insert-or-update-zone-item">
            <label className="wrap-insert-or-update-zone-item-label">
              Diện tích (m²)
            </label>
            <InputGroup className="input-group-alternative css-border-input">
              <input
                type="text"
                readOnly
                value={area.toFixed(2)}
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
          {/* <button
            type="button"
            onClick={() => alert()}
            className="wrap-insert-or-update-zone-add-button"
          >
            Kiểm tra
          </button> */}
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0, paddingBottom: 10 }} />
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Biểu tượng
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <div style={{ width: 82, height: 82 }} className="css-position-x">
              <input
                type="file"
                name="files"
                style={{ display: "none" }}
                required
                ref={(ref) => (this.refFileImage = ref)}
                onChange={this.handleChangeIMG}
                accept="image/*"
              />
              <img
                src={this.state.fileView ? this.state.fileView : NoImg}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 100,
                  maxHeight: 100,
                }}
              />
              {this.state.file != null ? (
                <div
                  style={{ position: "absolute", top: "-10px", right: "-8px" }}
                >
                  <Button
                    color="default"
                    data-dismiss="modal"
                    type="button"
                    className={`css-icon-button-type-Zone-planting`}
                    onClick={this.onDeleImg}
                  >
                    <span>x</span>
                  </Button>
                </div>
              ) : null}
            </div>
            <div
              className="row"
              style={{
                marginLeft: 0,
                marginRight: 0,
                marginTop: 5,
                alignSelf: "start",
              }}
            >
              <Button
                type="button"
                size="lg"
                className="btn-primary-cs"
                onClick={this.onUpdateFileImage}
              >
                <img src={Imgbt} alt="Thêm mới" />
                <span>Chọn hình</span>
              </Button>
            </div>
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
