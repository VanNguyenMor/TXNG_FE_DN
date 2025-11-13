import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import { platingZoneAction } from "../../../actions/PlantingZoneAction";
import GoogleAutoCompleteInput from '../../../components/GoogleAutoCompleteInput';
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import '../../../assets/css/page/insert_or_update_planting_zone.css';
import classes from './index.module.css';
import { UNITS } from 'helpers/constant';
import { ICON_COMMONS } from '../../../assets/img';
import GoogleMapReact from 'google-map-react';
import { LOCATION_DEFAULT, ZOOM_DEFAULT } from '../../../services/Common'
import locationIcon from '../../../assets/img/locationIcon/location.png';
import { MAP_KEY } from '../../../services/Common';
import { currentPosition } from 'utils/geo';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import delImg from "../../../assets/img/buttons/xoahinh.svg";
import Imgbt from "../../../assets/img/buttons/chonhinh.svg";
import IconAdd from '../../../assets/img/buttons/add.svg';
import IconDelete from '../../../assets/img/buttons/delete.png';
import { Guid } from 'guid-typescript';
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SketchPicker } from 'react-color';
import { validExtensionFileImage } from 'bases/helper';
import { validSize } from 'bases/helper';
import { MAX_FILE_IMAGE_SIZE } from 'bases/helper';
import { EXTENSION_FILE_IMAGE } from 'bases/helper';

// const AnyReactComponent = ({ text }) => <div>{text}</div>
import {
  Input,
  Button,
  InputGroup,
  Textarea
} from "reactstrap";

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#11C7EF",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: '100%'
});
const AnyReactComponent = ({ text }) => <div><img width={25} src={locationIcon} /></div>

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataWard: null,
      dataDistrict: null,
      id: null,
      plantingTypeName: null,
      plantingZoneName: null,
      unitRoundName: null,
      unitBadName: null,
      name: '',
      gps: '',
      // sortOrder: null,
      round: '',
      bad: '',
      gpsNew: [],
      isShowArea: true,
      plantingTypeId: null,
      plantingZoneId: null,
      wardId: null,
      districtId: null,
      unitIdBad: null,
      unitIdRound: null,
      icon: null,
      iconFile: null,
      position: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng
      },
      positionChange: {
        latitude: LOCATION_DEFAULT.lat,
        longitude: LOCATION_DEFAULT.lng
      },
      items: getItems(10),
      pathImageDefaul: '',
      mfileImg: '',
      ArrayFileAdd: '',
      fileImage: '',
      color: '#000000',
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.redSelect = null;
    this.refInputName = null;
    this.refFileImage = null;
    this.refFileImages = null;
  }

  componentWillUnmount() {
    this.setState(previousState => {
      return {
        ...previousState,
        id: null,
        plantingTypeName: null,
        plantingZoneName: null,
        unitRoundName: null,
        unitBadName: null,
        name: '',
        gps: '',
        round: '',
        bad: '',
        plantingTypeId: null,
        plantingZoneId: null,
        wardId: null,
        districtId: null,
      }
    });
  }

  async componentDidMount() {
    const { getDetailPlantingZone, getListPlantingType, onHandleChangeValue,
      id, getListPlantingZoneForComboBox, getDistrictList, getWardList
    } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

    let plantingTypeId = null;
    let plantingZoneId = null;
    let wardId = null;
    let districtId = null;
    let dataGPSSub = null;
    let dataGPSSubConvert = [];
    let chilGPSSubConvert = {};
    let dataGPS = null;
    let dataLat = null;
    let dataLng = null;
    let wardtListData = {};
    let dataWard = null;

    const districtListData = await getDistrictList();
    const dataDistrict = ((districtListData || {}).data || {}).data || null;

    if (id) {
      const result = await getDetailPlantingZone({ id });

      const data = ((result || {}).data || {}).data || null;

      if (!data) {
        alert('Không tìm thấy vùng sản xuất này');
        return;
      }

      if (data.images) {
        const pIm = data.images;
        const spl = pIm.split(';')
        this.setState(previousState => {
          return {
            ...previousState,
            pathImageDefaul: spl
          }
        })
      }

      plantingTypeId = data.plantingTypeID;
      plantingZoneId = data.parentID;
      districtId = data.districtID;
      wardId = data.wardID;
      dataGPSSub = data.gpsNew.split(';')
      dataGPSSub.map(x => {
        chilGPSSubConvert = {
          id: Guid.create().toString(),
          content: x
        }
        dataGPSSubConvert.push(chilGPSSubConvert)
      })

      dataGPS = dataGPSSub[0].split(',');
      dataLat = parseInt(dataGPS[0]);
      dataLng = parseInt(dataGPS[1]);

      wardtListData = await getWardList(districtId);
      dataWard = ((wardtListData || {}).data || {}).data || null;

      this.setState({
        position: {
          latitude: dataLat,
          longitude: dataLng
        },
        positionChange: {
          latitude: dataLat,
          longitude: dataLng
        },
      })

      let districtName = '';
      let wardName = '';
      if (districtId) {
        districtName = (dataDistrict.find(p => p.id == districtId) || {}).districtName;

      }

      if (wardId) {
        wardName = (dataWard.find(p => p.id == wardId) || {}).wardName;
      }

      this.setState(previousState => {
        return {
          ...previousState,
          districtName,
          wardName,
          dataWard,
          gpsNew: dataGPSSubConvert,
          dataLat,
          dataLng,
          id: data.id,
          name: data.name,
          plantingTypeId,
          districtId,
          wardId,
          fileImage: data.images,
          plantingZoneId,
          gps: data.gps,
          color: data.color ? data.color : '',
          round: data.radius,
          icon: data.icon,
          fileView: data.icon,
          bad: data.tolerance,
          unitIdBad: data.toleranceUnit,
          unitIdRound: data.unit,
          unitBadName: (UNITS.find(p => p.value == data.toleranceUnit) || {}).label || '',
          unitRoundName: (UNITS.find(p => p.value == data.unit) || {}).label || ''
        }
      }, () => {
        if (onHandleChangeValue) {
          onHandleChangeValue(this.state);
        }
      });
    }

    this.setState(previousState => {
      return {
        ...previousState,
        dataDistrict,
      }
    }, () => {
      if (onHandleChangeValue) {
        onHandleChangeValue(this.state);
      }
    });

    getListPlantingType({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }).then(res => {
      const data = res.data;

      if (data.status == 200) {
        const plantingTypes = (data.data || {}).plantingTypes || [];

        if (plantingTypes.length > 0) {
          const plantingType = plantingTypes[0];

          let plantingTypeName = '';

          if (plantingTypeId) {
            plantingTypeName = (plantingTypes.find(p => p.id == plantingTypeId) || {}).name;
          } else {
            plantingTypeName = plantingType.name;
          }

          if (plantingType) {
            this.setState(previousState => {
              return {
                ...previousState,
                plantingTypeId: plantingTypeId || null,
                plantingTypeName
              }
            }, () => {
              if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
              }
            });
          }
        }
      }
    });

    getListPlantingZoneForComboBox({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }).then(res => {
      const data = res.data;

      if (data.status == 200) {
        const plantingZones = (data.data || {}).plantingZones || [];
        let plantingZoneName = '';
        if (plantingZones.length > 0) {
          if (id) {
            plantingZoneName = (plantingZones.find(p => p.id == plantingZoneId) || {}).name;
          } else {
            const plantingZone = plantingZones[0];
            if (plantingZone) {
              plantingZoneId = plantingZone.id;
              plantingZoneName = plantingZone.name;
            }
          }
          this.setState(previousState => {
            return {
              ...previousState,
              // plantingZoneId,
              plantingZoneName
            }
          }, () => {
            if (this.props.onHandleChangeValue) {
              this.props.onHandleChangeValue(this.state);
            }
          });

        }
      }
    });

    this.focusInput();
  }

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();

        clearTimeout(timeOut);
      }, 100);
    }
  }

  onChangeSelect = name => value => {
    const { getWardList, onHandleChangeValue, PlantingZoneStore } = this.props

    let districtName = this.state.districtName;
    let wardName = this.state.wardName;
    if (name === 'districtId') {
      this.redSelect.resetValue();
      districtName = '';
      wardName = '';
      getWardList(value).then(res => {
        if (res.data.status == 200) {
          this.setState(previousState => {
            return {
              ...previousState,
              dataWard: res.data.data,
            }
          }, () => {
            if (onHandleChangeValue) {
              onHandleChangeValue(this.state);
            }
          });
        }
      })
    }

    if (name === 'plantingTypeId') {

      const plantingTypes = PlantingZoneStore.platingTypes || [];

      let _color = plantingTypes.filter(p => p.id == value)

      if (_color) {
        this.setState({
          color: ((_color[0] || {}).color) || '',
          icon: ((_color[0] || {}).icon) || '',
          fileView: ((_color[0] || {}).icon) || '',
        }, () => {
          if (onHandleChangeValue) {
            onHandleChangeValue(this.state);
          }
        })
      }
    }

    if (name === 'wardId') {
      wardName = '';
    }
    let plantingTypeName = this.state.plantingTypeName;

    let plantingZoneName = this.state.plantingZoneName;

    if (name === 'plantingZoneId') {
      plantingZoneName = '';
    }

    let unitBadName = this.state.unitBadName;

    if (name === 'unitIdBad') {
      unitBadName = '';
    }

    let unitRoundName = this.state.unitRoundName;

    if (name === 'unitIdRound') {
      unitRoundName = '';
    }

    if (name === 'plantingTypeId') {
      plantingTypeName = '';
    }

    this.setState(previousState => {
      return {
        ...previousState,
        [name]: value,
        plantingTypeName,
        plantingZoneName,
        unitBadName,
        unitRoundName,
        districtName,
        wardName
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  onChangeValue = name => e => {
    const value = e.target.value;

    this.setState(previousState => {
      return {
        ...previousState,
        [name]: value
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  onChangeValueGPS = name => e => {
    const value = e.target.value.replace(/[^0-9., ]/ig, "");

    this.setState(previousState => {
      return {
        ...previousState,
        [name]: value
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  // onChangeRadio = event => {
  //   this.state[event.target.name] = Number(event.target.value);
  //   this.setState({ [event.target.name]: Number(event.target.value) });

  //   if (this.props.onHandleChangeValue) {
  //     this.props.onHandleChangeValue(this.state);
  //   }
  // }

  handleMapLocation = (gps) => {
    if (gps.length === 0) return LOCATION_DEFAULT;
    else {
      const location = gps.split(",");
      const mapLocation = {
        lat: parseFloat(location[0]),
        lng: parseFloat(location[1])
      };

      return mapLocation;
    }
  }

  handleZoomMap = (gps) => {
    if (gps.length === 0) return ZOOM_DEFAULT;
    else {
      const location = gps.split(",");

      if (typeof (location[2]) !== 'undefined') {
        const zoom = Number(location[2].replace('z', ''));

        return zoom;
      } else return ZOOM_DEFAULT;
    }
  }

  handleApiLoaded = (map, maps) => {
    // use map and maps objects
  };

  onCloseMapViewLocation = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isShowMapViewLocation: false
      }
    });
  }

  onOpenMaps = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isShowMapViewLocation: true
      }
    });
  }

  onChangeLocation = location => {
    this.setState(previousState => {
      return {
        ...previousState,
        locationChange: {
          lat: location.center.lat,
          lng: location.center.lng
        },
        positionChange: {
          latitude: location.center.lat,
          longitude: location.center.lng,
        }
      }
    });
  }

  onClickMap = e => {
    this.setState(previousState => {
      return {
        ...previousState,
        locationChange: {
          lat: e.lat,
          lng: e.lng
        },
        position: {
          latitude: e.lat,
          longitude: e.lng,
        }
      }
    });
  }

  onConfirmLocation = () => {
    let { gps, position } = this.state;
    const locationChange = this.state.locationChange;
    gps = `${position.latitude},${position.longitude}`
    if (locationChange) {
      this.setState(previousState => {
        return {
          ...previousState,
          // location: locationChange,
          gps,
          locationChange: null,
          isShowMapViewLocation: false
        }
      });
    }
  }

  onCurrentPosition = () => {
    currentPosition().then(res => {
      if (res.status) {
        this.setState(previousState => {
          return {
            ...previousState,
            position: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            positionChange: {
              latitude: res.latitude,
              longitude: res.longitude
            }
          }
        });
      }
    });
  }

  onSelectPosition = ({ latitude, longitude }) => {
    this.setState(previousState => {
      return {
        ...previousState,
        position: {
          latitude: latitude,
          longitude: longitude
        },
        positionChange: {
          latitude: latitude,
          longitude: longitude
        }
      }
    });
  }

  handleChangeIMG = event => {
    let { icon, iconFile } = this.state;
    if (event.target.files[0] != undefined) {
      this.setState({
        fileView: URL.createObjectURL(event.target.files[0]),
        file: event.target.files[0],
      })
    } else {
      this.setState({
        fileView: null,
        file: null,
      })
    }

    const ev = event.target.files[0];

    iconFile = ev;
    this.setState({ iconFile }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });

    //console.log(event.target.files[0])

  }

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
  }
  onUpdateFileImages = () => {
    this.refFileImages.click();
  }

  onDeleImg = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        file: null,
        fileView: null
      }
    }
    )
  }

  onAddArea = () => {
    const { gps, gpsNew: gpsDetails } = this.state;
    const { onHandleChangeValue } = this.props;

    const gpsNew = [...this.state.gpsNew];

    if (!gps) {
      // alert('Bạn vui lòng chọn vùng');

      this.setState({
        errMessage: 'Bạn vui lòng chọn GPS'
      })
      //this.toggleModal('popupMessage')
      return;
    }

    // if (!sortOrder) {
    //   // alert('Bạn vui lòng chọn vùng');

    //   this.setState({
    //     errMessage: 'Bạn vui lòng nhập thứ tự'
    //   })
    //   //this.toggleModal('popupMessage')
    //   return;
    // }

    const gpsDetail = gpsDetails.find(p => p.content.trim().toUpperCase() == gps.trim().toUpperCase());

    if (gpsDetail) {
      // alert('Bạn đã chọn vùng này');

      this.setState({
        errMessage: 'Bạn đã chọn GPS này'
      })
      //this.toggleModal('popupMessage')
      return;
    }

    gpsDetails.map(gps => {

    })

    // const sortDetail = gpsDetails.find(p => parseInt(p.sortOrder) == parseInt(sortOrder));
    // if (sortDetail) {
    //   // alert('Bạn đã chọn vùng này');

    //   this.setState({
    //     errMessage: 'Bạn đã chọn thứ tự này'
    //   })
    //   //this.toggleModal('popupMessage')
    //   return;
    // }

    gpsNew.push({
      id: Guid.create().toString(),
      content: gps || '',
      // sortOrder: sortOrder || null
    });

    this.setState(previousState => {
      return {
        ...previousState,
        errMessage: '',
        gpsNew
      }
    }, () => {
      if (onHandleChangeValue) {
        onHandleChangeValue(this.state);
      }
    });

    this.setState(previousState => {
      return {
        ...previousState,
        gps: ''
      }
    })
  }

  onDeleteArea = id => () => {
    const gpsNew = [...this.state.gpsNew];

    const zone = gpsNew.find(p => p.id == id);

    if (zone) {
      const zoneNews = gpsNew.filter(p => p.id != id);

      this.setState(previousState => {
        return {
          ...previousState,
          gpsNew: zoneNews
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    } else {
      // alert('Không tìm thấy vùng này');
      this.setState({
        errMessage: 'Không tìm thấy vùng này'
      })
      //this.toggleModal('popupMessage')
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }


    const gpsNew = reorder(
      this.state.gpsNew,
      result.source.index,
      result.destination.index
    );


    this.setState({
      gpsNew
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });


  }

  handleChangeComplete = (color) => {
    const { onHandleChangeValue } = this.props;
    this.setState({ color: color.hex }, () => {
      if (onHandleChangeValue) {
        onHandleChangeValue(this.state);
      }
    });
  };

  onChangeFileImage = e => {
    const { id, pathImageDefaul } = this.state;
    const { onHandleChangeValue } = this.props;
    const files = e.target.files || [];
    if (files.length > 0) {
      const file = files || null;
      if (file) {
        const errorsInfoConfig = {};

        this.setState(previousState => {
          return {
            ...previousState,
            errorsInfoConfig
          }
        });
        for (let i = 0; i < file.length; i++) {
          if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
            errorsInfoConfig.banner = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
          }
          if (!validExtensionFileImage(file[i].name)) {
            errorsInfoConfig.banner = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
          }
        }
        this.setState(previousState => {
          return {
            ...previousState,
            errorsInfoConfig
          }
        });

        if (Object.keys(errorsInfoConfig).length > 0) {
          return;
        }
        if (this.state.mfileImg != '') {
          let _mfileImg = [...this.state.mfileImg];
          for (let i = 0; i < files.length; i++) {
            _mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
          }
          this.setState(previousState => {
            return {
              ...previousState,
              mfileImg: _mfileImg
            }
          }, () => {
            if (onHandleChangeValue) {
              onHandleChangeValue(this.state);
            }
          })
        } else {
          this.setState({ mfileImg: files }, () => {
            if (onHandleChangeValue) {
              onHandleChangeValue(this.state);
            }
          })
        }
        const pathImage = Array.from(files).map((ee) => URL.createObjectURL(ee));
        if (this.state.ArrayFileAdd != '') {
          let _ArrayFileAdd = this.state.ArrayFileAdd;
          for (let i = 0; i < files.length; i++) {
            _ArrayFileAdd.push(pathImage[i]);
          }
        } else {
          this.setState({ ArrayFileAdd: pathImage })
        }
        // if (id) {
        if (pathImageDefaul) {
          this.setState(previousState => {
            return {
              ...previousState,
              pathImageDefaul: this.state.pathImageDefaul.concat(pathImage)
            }
          });
        } else {
          this.setState(previousState => {
            return {
              ...previousState,
              pathImageDefaul: pathImage
            }
          });
        }
        // } else {
        //     this.setState(previousState => {
        //         return {
        //             ...previousState,
        //             pathImageDefaul: pathImage
        //         }
        //     });
        // }

      }
    }
  }

  onDeleteFileImage = (e) => {
    const { pathImageDefaul, fileImage, ArrayFileAdd } = this.state;
    const { onHandleChangeValue } = this.props;
    var array = [...pathImageDefaul]
    var index = array.indexOf(e);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({
        pathImageDefaul: array,
      });
    }

    let flah = false;
    if (fileImage) {
      const spl = fileImage.split(';')
      Array.from(spl).filter(x => x === e).map(
        item => { flah = true }
      )

      if (flah == true) {
        spl.splice(spl.indexOf(e), 1);
        var fileImageSend = spl.join(';')
        this.setState(previousState => {
          return {
            ...previousState,
            fileImage: fileImageSend
          }
        }, () => {
          if (onHandleChangeValue) {
            onHandleChangeValue(this.state);
          }
        })
      }
    }

    let flag = false;
    if (ArrayFileAdd) {
      Array.from(ArrayFileAdd).filter(x => x === e).map(
        item => {
          flag = true
        }
      )

      if (flag == true) {
        ArrayFileAdd.splice(ArrayFileAdd.indexOf(e), 1);
        let _ArrayFileAdd = [];
        for (let i = 0; i < ArrayFileAdd.length; i++) {
          fetch(ArrayFileAdd[i]).then(res => res.blob()).then(blob => {
            _ArrayFileAdd.push(new File([blob], `${ArrayFileAdd[i].replace('blob:http://localhost:5000/')}.jpeg`,
              { lastModified: new Date().getTime(), type: 'image/jpeg' }));
          });
        }

        this.setState(previousState => {
          return {
            ...previousState,
            mfileImg: _ArrayFileAdd
          }
        })
      }

    }
  }

  render() {
    const {
      positionChange, position, unitIdRound, unitIdBad,
      gps, round, bad, plantingZoneId, plantingTypeId,
      unitBadName, unitRoundName, plantingZoneName,
      plantingTypeName, name, isShowMapViewLocation, locationChange,
      dataLat, dataLng, districtName, wardName, dataWard, dataDistrict,
      districtId, wardId, isShowArea, gpsNew, errMessage,
      popupMessage, items, pathImageDefaul,
    } = this.state;
    const { errors, PlantingZoneStore, id, message } = this.props;

    const plantingTypes = PlantingZoneStore.platingTypes || [];

    let plantingZoneForComboBoxs
    let _plantingZoneForComboBoxs
    if (id) {
      _plantingZoneForComboBoxs = PlantingZoneStore.plantingZoneForComboBoxs || [];
      plantingZoneForComboBoxs = _plantingZoneForComboBoxs.filter(x => x.id != id)
    } else {
      plantingZoneForComboBoxs = PlantingZoneStore.plantingZoneForComboBoxs || [];
    }

    return (
      <div className='wrap-insert-or-update-zone'>
        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>Loại vùng sản xuất&nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <Select
              value={id ? plantingTypeId : null}
              defaultValue={id ? plantingTypeId : null}
              labelMark={id ? plantingTypeName : null}
              className='wrap-insert-or-update-zone-item-select'
              name="plantingTypeId"
              title='Chọn loại vùng sản xuất'
              data={plantingTypes}
              labelName='name'
              val='id'
              handleChange={this.onChangeSelect('plantingTypeId')}
            />
            <p className='form-error-message'>{errors.plantingTypeId || ''}</p>
          </div>
        </div>

        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>Tên vùng sản xuất&nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <InputGroup className="input-group-alternative css-border-input">
              <input value={name} onChange={this.onChangeValue('name')} type='text' className='wrap-insert-or-update-zone-item-input' />
            </InputGroup>

            <p className='form-error-message'>{errors.name || ''}</p>
          </div>
        </div>
        {/* <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>
                        Thuộc vùng sản xuất{districtId ? null : <>&nbsp;<b style={{ color: 'red' }}>*</b></>}</label>
                    <div className='wrap-insert-or-update-zone-item-box'>
                        <Select
                            value={id ? plantingZoneId : null}
                            defaultValue={id ? plantingZoneId : null}
                            labelMark={id ? plantingZoneName : null}
                            className='wrap-insert-or-update-zone-item-select'
                            name="plantingZoneId"
                            title='Chọn vùng sản xuất'
                            data={plantingZoneForComboBoxs}
                            isDisable={districtId ? true : false}
                            labelName='name'
                            val='id'
                            handleChange={this.onChangeSelect('plantingZoneId')}
                        />
                        <p className='form-error-message'>{errors.plantingZoneId || ''}</p>
                    </div>
                </div> */}
        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>
            Quận/Huyện{plantingZoneId ? null : <>&nbsp;<b style={{ color: 'red' }}>*</b></>}</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <Select
              value={id ? districtId : null}
              defaultValue={id ? districtId : null}
              labelMark={id ? districtName : null}
              className='wrap-insert-or-update-zone-item-select'
              name="districtId"
              title='Chọn Quận/Huyện'
              data={dataDistrict}
              //isDisable={plantingZoneId ? true : false}
              labelName='districtName'
              val='id'
              handleChange={this.onChangeSelect('districtId')}
            />
            <p className='form-error-message'>{errors.districtId || ''}</p>
          </div>
        </div>
        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>
            Phường/Xã{plantingZoneId ? null : <>&nbsp;<b style={{ color: 'red' }}>*</b></>}</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <Select
              ref={ref => this.redSelect = ref}
              value={id ? wardId : null}
              defaultValue={id ? wardId : null}
              labelMark={id ? wardName : null}
              className='wrap-insert-or-update-zone-item-select'
              name="wardId"
              title='Chọn Phường/Xã'
              data={dataWard}
              isDisable={(districtId) ? false : true}
              labelName='wardName'
              val='id'
              handleChange={this.onChangeSelect('wardId')}
            />
            <p className='form-error-message'>{errors.wardId || ''}</p>
          </div>
        </div>
        <div className='wrap-insert-or-update-zone-item' style={{ marginBottom: 10 }}>
          <label className='wrap-insert-or-update-zone-item-label'>
            Màu sắc{plantingZoneId ? null : <>&nbsp;<b style={{ color: 'red' }}>*</b></>}</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <SketchPicker
              color={this.state.color}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </div>
        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>
            Biểu tượng
          </label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <div style={{ width: 82, height: 82 }} className='css-position-x'>
              <input
                type="file"
                name='files'
                style={{ display: 'none' }}
                //value={data.ThumbnailFile}
                required
                ref={ref => this.refFileImage = ref}
                onChange={this.handleChangeIMG}
                accept="image/*"
              //onKeyUp={(event) => this.handleChangeIMG(event)}
              />
              <img
                src={this.state.fileView ? this.state.fileView : NoImg}
                style={{ width: '100%', height: '100%', maxWidth: 100, maxHeight: 100 }} />
              {this.state.file != null ? (
                <div style={{ position: 'absolute', top: "-10px", right: "-8px" }}>
                  <Button
                    color="default"
                    data-dismiss="modal"
                    type="button"
                    className={`css-icon-button-type-Zone-planting`}
                    onClick={this.onDeleImg}
                  >
                    {/* <img src={delImg} alt='Thoát ra' /> */}
                    <span>x</span>
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="row" style={{ marginLeft: 0, marginRight: 0, marginTop: 5, alignSelf: 'start' }}>
              <Button type="button" size="lg" className='btn-primary-cs'
                onClick={this.onUpdateFileImage}>
                <img src={Imgbt} alt='Thêm mới' />
                <span>Chọn hình</span>
              </Button>

            </div>

          </div>
        </div>

        <div className='wrap-insert-or-update-zone-item'>
          <div className='wrap-manage-company-body-item'>
            <input onChange={this.onChangeFileImage}
              multiple ref={ref => this.refFileImages = ref}
              id='image'
              type='file'
              className='hidden'
              style={{
                display: 'none'
              }} />

            <label className='wrap-insert-or-update-zone-item-label'>
              Hình ảnh giới thiệu
            </label>
            <div className='wrap-manage-company-body-item-box'>

              <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                {pathImageDefaul != '' ? (
                  pathImageDefaul.map((e) => (
                    e != "" ?
                      (
                        <div style={{ position: "relative", margin: 10 }}>
                          <div style={{ width: 82, height: 82 }}>
                            <img
                              src={e ? e : NoImg}
                              style={{ width: '90px', height: '100px', maxWidth: 100, maxHeight: 100, padding: 5 }} />
                          </div>

                          <div style={{ padding: 5, position: "absolute", top: '-10px', right: '-15px' }}>
                            <Button
                              color="default"
                              data-dismiss="modal"
                              type="button"
                              className={`css-icon-button-type-Zone-planting`}
                              onClick={() => this.onDeleteFileImage(e)}
                            >
                              {/* <img src={CloseIcon} alt='Thoát ra' /> */}
                              <span>x</span>
                            </Button>
                          </div>
                        </div>
                      )
                      : null
                  ))
                ) : (
                  <img
                    src={NoImg}
                    style={{ width: '100%', height: '100%', maxWidth: 100, maxHeight: 100, padding: 5 }} />
                )
                }
              </div>
              <div className='wrap-manage-company-body-item-box-function'
                style={{ justifyContent: 'flex-start', padding: 5 }}>
                <Button
                  type="button"
                  size="lg"
                  style={{ margin: 0 }}
                  className='btn-primary-cs'
                  onClick={this.onUpdateFileImages}>
                  <img src={PlusImg} alt='Thêm mới' />
                  <span>Chọn hình</span>
                </Button>
                {/* <p className="form-error-message" style={{ marginLeft: 5 }}>{errorsInfoConfig.banner || ''}</p> */}
              </div>
            </div>
          </div>
        </div>
        <hr style={{ marginTop: 10, marginBottom: 0 }} />
        <b>KHAI BÁO GPS</b>
        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>
            GPS{plantingZoneId ? null : <>&nbsp;<b style={{ color: 'red' }}>*</b></>}</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <InputGroup className="input-group-alternative css-border-input">
              <input value={gps} onChange={this.onChangeValueGPS('gps')} type='text'
                className='wrap-insert-or-update-zone-item-input'
                disabled={plantingZoneId ? true : false}
              // pattern='[0-9]'
              />
            </InputGroup>

            <p className='form-error-message'>{errors.gps || ''}</p>
            {errMessage != '' ? (
              <p className='form-error-message'>{errMessage}</p>
            ) : null}
          </div>
          <button className='wrap-insert-or-update-zone-item-location'>
            <img className='wrap-insert-or-update-zone-item-location-icon'
              style={{ cursor: `${plantingZoneId ? 'not-allowed' : 'pointer'}` }}
              src={ICON_COMMONS.Location} onClick={plantingZoneId ? null : this.onOpenMaps} />
          </button>

        </div>
        {/* <div className='wrap-insert-or-update-zone-item map-area'>
                    {
                        gps.length > 0 && (
                            <GoogleMapReact 
                                bootstrapURLKeys={{ key: 'AIzaSyAz1kbpa6CB_NQh5vQNJHfqTCSH_xGZFIU' }}
                                center={this.handleMapLocation(gps)}
                                defaultZoom={this.handleZoomMap(gps)} 
                                onGoogleApiLoaded={({ map, maps }) => {
                                    const marker = new maps.Marker({
                                        position: this.handleMapLocation(gps),
                                        map
                                    });

                                    const circle = new maps.Circle({
                                        map: map,
                                        radius: round * 1000,    // 1000 = 1km
                                        fillColor: '#09b2fd',
                                        strokeColor: '#09b2fd'
                                    });

                                    circle.bindTo('center', marker, 'position');
                                }}
                            >
                            </GoogleMapReact>
                        )
                    }
                </div> */}
        {isShowMapViewLocation &&
          <div className='wrap-manage-company-location'>
            <GoogleMapReact
              animation={window.google.maps.Animation.DROP}
              bootstrapURLKeys={{ key: MAP_KEY }}
              defaultZoom={15}
              yesIWantToUseGoogleMapApiInternals
              defaultCenter={{
                lat: positionChange.latitude,
                lng: positionChange.longitude
              }}
              center={{
                lat: positionChange.latitude,
                lng: positionChange.longitude
              }}
              onClick={this.onClickMap}
              onChange={this.onChangeLocation}>
              <AnyReactComponent
                lat={position.latitude}
                lng={position.longitude}
                text="My Marker"
              />
            </GoogleMapReact>
            <GoogleAutoCompleteInput onSelect={this.onSelectPosition} placeholder='Tìm kiếm địa chỉ...' className='wrap-manage-company-location-search-input' classNameContainer='wrap-manage-company-location-search' />
            <div className='wrap-manage-company-location-function'>
              <button onClick={this.onCloseMapViewLocation} className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-close'>ĐÓNG</button>
              <button onClick={this.onConfirmLocation} className='wrap-manage-company-location-function-button wrap-manage-company-location-function-button-confirm'>CHỌN VỊ TRÍ NÀY</button>
            </div>
            <button onClick={this.onCurrentPosition} className='wrap-manage-company-location-current'>
              <img className='wrap-manage-company-location-current-icon' src='/cores/imgs/ics/current_position.png' alt='Current position' />
            </button>
          </div>
        }

        {/* <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>Thứ tự</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <input value={sortOrder} onChange={this.onChangeValue('sortOrder')} type='text' className='wrap-insert-or-update-zone-item-input' />
            <p className='form-error-message'>{errors.sortOrder || ''}</p>
            {errMessage != '' ? (
              <p className='form-error-message'>{errMessage}</p>
            ) : null
            }
          </div>
        </div> */}
        <div className='wrap-insert-or-update-zone-add'>
          <button type='button' onClick={this.onAddArea} className='wrap-insert-or-update-zone-add-button'>
            <img className='wrap-insert-or-update-zone-add-button-icon' src={IconAdd} />
            Thêm
          </button>
        </div>
        <div className='wrap-insert-or-update-zone-area'>
          <label className='wrap-insert-or-update-zone-item-label'>GPS được chọn</label>
          <p className='form-error-message'>{errors.zone || ''}</p>
          {/* <div className='wrap-insert-or-update-zone-area-list'>
            {isShowArea ?
              <React.Fragment>
                {gpsNew
                  // .sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1)
                  .map(item => {
                    return (
                      <div key={item.id} className='wrap-insert-or-update-zone-area-list-item' style={{ width: 'fit-content' }}>
                        <p className='wrap-insert-or-update-zone-area-list-item-label'>{item.content}</p>
                        <button onClick={this.onDeleteArea(item.id)} className='wrap-insert-or-update-zone-area-list-item-delete'>
                          <img className='wrap-insert-or-update-zone-area-list-item-delete-icon' src={IconDelete} />
                        </button>
                      </div>
                    )
                  })}
              </React.Fragment> : null}
          </div> */}

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {gpsNew.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <>
                          <div className='wrap-css-planting-zone'>
                            <div className='wrap-width-plating-zone'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {item.content}
                            </div>
                            <button onClick={this.onDeleteArea(item.id)} className='wrap-insert-or-update-zone-area-list-item-delete margin-left-button-planting-zone'>
                              <img className='wrap-insert-or-update-zone-area-list-item-delete-icon' src={IconDelete} />
                            </button>
                          </div>
                        </>

                      )}

                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        </div>

        {/* {isShowMapViewLocation &&
                    <div className='wrap-manage-company-location'>
                        <Map
                            google={this.props.google}
                            center={{ lat: 13.104140180993811, lng: 109.31284359689911 }}
                            height='300px'
                            zoom={15}
                        />
                    </div>
                } */}

        {/* <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>Phạm vi (Bán kính)&nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <input value={round} onChange={this.onChangeValue('round')} type='text' className='wrap-insert-or-update-zone-item-input' />
          </div>
          <div className='wrap-insert-or-update-zone-item-box-2'>
            <div className={classes.radioBox}>
              {
                UNITS.map((item, key) => (
                  <div key={key}>
                    <input
                      checked={unitIdRound === item.value ? true : false}
                      type="radio"
                      name="unitIdRound"
                      id={`unitround-${key}`}
                      value={item.value}
                      onChange={(event) => this.onChangeRadio(event)}
                    />
                    <label htmlFor={`unitround-${key}`}>{item.label}</label>
                  </div>
                ))
              }
            </div>

            {/* <Select
                            value={unitIdRound}
                            defaultValue={unitIdRound}
                            labelMark={unitRoundName}
                            className='wrap-insert-or-update-zone-item-select'
                            name="unitIdRound"
                            title='Chọn đơn vị'
                            data={UNITS}
                            labelName='label'
                            val='value'
                            handleChange={this.onChangeSelect('unitIdRound')}
                        /> */}
        {/* </div> */}
        {/* </div>  */}

        {/* <div className={classes.defaultLeftSpacing}>
          <p className='form-error-message'>{errors.round || ''}</p>
          <p className='form-error-message'>{errors.unitIdRound || ''}</p>
        </div> */}

        {/* <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-zone-item-label'>Dung sai&nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <input value={bad} onChange={this.onChangeValue('bad')} type='text' className='wrap-insert-or-update-zone-item-input' />
          </div>
          <div className='wrap-insert-or-update-zone-item-box-2'>
            <div className={classes.radioBox}>
              {
                UNITS.map((item, key) => (
                  <div key={key}>
                    <input
                      checked={unitIdBad === item.value ? true : false}
                      type="radio"
                      name="unitIdBad"
                      id={`unitbad-${key}`}
                      value={item.value}
                      onChange={(event) => this.onChangeRadio(event)}
                    />
                    <label htmlFor={`unitbad-${key}`}>{item.label}</label>
                  </div>
                ))
              }
            </div>

            {/* <Select
                            value={unitIdBad}
                            defaultValue={unitIdBad}
                            labelMark={unitBadName}
                            className='wrap-insert-or-update-zone-item-select'
                            name="unitIdBad"
                            title='Chọn đơn vị'
                            data={UNITS}
                            labelName='label'
                            val='value'
                            handleChange={this.onChangeSelect('unitIdBad')}
                        /> */}
        {/* <p className='form-error-message'>{errors.unitIdBad || ''}</p> */}
        {/* </div> */}
        {/* </div> */}

        {/* <div className={classes.defaultLeftSpacing}>
          <p className='form-error-message'>{errors.bad || ''}</p>
          <p className='form-error-message'>{errors.unitIdBad || ''}</p>
        </div> */}
        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={'Thông báo'}
          moduleBody={errMessage}
          toggleModal={this.toggleModal}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    PlantingZoneStore: state.PlantingZoneStore,
    location: state.LocationStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(areaDataAction, dispatch),
    ...bindActionCreators(platingZoneAction, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InsertOrUpadte);