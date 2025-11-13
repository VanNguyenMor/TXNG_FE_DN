import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Guid } from 'guid-typescript';

import { areaDataAction } from "../../../actions/AreaDataAction";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";

import '../../../assets/css/page/insert_or_update_type_zone_property.css';

import IconAdd from '../../../assets/img/buttons/add.png';
import IconDelete from '../../../assets/img/buttons/delete.png';
import { SketchPicker } from 'react-color';
import { validExtensionFileImage } from 'bases/helper';
import { validSize } from 'bases/helper';
import { MAX_FILE_IMAGE_SIZE } from 'bases/helper';
import { EXTENSION_FILE_IMAGE } from 'bases/helper';
import Select from "components/Select";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import delImg from "../../../assets/img/buttons/xoahinh.svg";
import Imgbt from "../../../assets/img/buttons/chonhinh.svg";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg"
import { actionProductGroup } from "../../../actions/ProductGroupActions";
import { actionFieldType } from "../../../actions/FieldTypeAction";
import { actionField } from "../../../actions/FieldActions.js";
import SelectParent from "components/SelectParent";
import {
  Input,
  InputGroup,
  Button
} from "reactstrap";


class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeManage: 1,
      districtId: null,
      provinceId: null,
      provinceName: '',
      wardId: null,
      zones: [],
      isDisableSelectDistrict: true,
      isDisableSelectWard: true,
      isShowArea: false,
      id: null,
      productTypeId: '',
      productTypeId2: '',
      pathImageDefaul: '',
      mfileImg: '',
      ArrayFileAdd: '',
      fileImage: '',
      color: '#000000',
      fieldTypeName: '',
      fieldTypes: [],
    }
    this.refFileImage = null;
    this.refFileImages = null;
    this.refInputName = null;
  }

  componentWillUnmount() {
    this.setState(previousState => {
      return {
        ...previousState,
        typeManage: 1,
        districtId: null,
        provinceId: null,
        provinceName: '',
        wardId: null,
        zones: [],
        productTypeId: '',
        isDisableSelectDistrict: true,
        isDisableSelectWard: true,
        isShowArea: false,
        id: null
      }
    });
  }

  async componentDidMount() {
    const { getDetailTypeZoneProperty,
      onHandleChangeValue,
      id,
      requestListProductGroup,
      requestFieldTypeStore,
      fieldType,
      detail
    } = this.props;

    requestFieldTypeStore({}).then(res => {
      if (res.data.status == 200) {
        const fieldTypes = ((res.data || {}).data || {}).fieldTypes || [];
        if (fieldTypes.length > 0) {
          this.setState(previousState => {
            return {
              ...previousState,
              fieldTypes
            }
          })
        }
      }
    });

    //const _fieldType = detail.fieldType || detail.FieldType;

    // const fieldTypes = ((fieldType.data || {}).fieldTypes || {}).fieldTypes || [];

    // //const fieldTypeSelect = fieldTypes.find(p => p.id == _fieldType);
    // if (fieldTypes.length > 0) {
    //   this.setState(previousState => {
    //     return {
    //       ...previousState,
    //       fieldTypes
    //     }
    //   })
    // }

    requestListProductGroup(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (res.data.status == 200) {
        this.setState({ dataProduct: res.data.data.productGroups })
      }
    })

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

    if (id) {
      const result = await getDetailTypeZoneProperty({ id });

      const data = ((result || {}).data || {}).data || null;

      if (!data) {
        alert('Không tìm thấy loại vùng sản xuất và thuộc tính này');

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

      const attributes = JSON.parse(data.attributes || '[]');
      const zones = (attributes || []).map(item => {
        return {
          id: Guid.create().toString(),
          name: item.name,
          dataType: item.dataType,
          value: item.value
        }
      });

      const { requestFieldChildrenEndStore } = this.props;

      requestFieldChildrenEndStore(JSON.stringify({
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      })).then(res => {
        const fields = ((res.data || {}).data || {}).fields || [];

        this.setState(previousState => {
          return {
            ...previousState,
            fields
          }
        });
      });


      this.setState(previousState => {
        return {
          ...previousState,
          id: data.id,
          name: data.name,
          zones,
          productTypeId: data.productTypeName,
          color: data.color ? data.color : '',
          icon: data.icon,
          fileView: data.icon,
          fileImage: data.images,
          fieldID: data.fieldID ? data.fieldID : '',
        }
      }, () => {
        if (onHandleChangeValue) {
          onHandleChangeValue(this.state);
        }
      });
    }

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

  onAddArea = () => {
    const zones = [...this.state.zones];

    zones.push({
      id: Guid.create().toString(),
      name: '',
      dataType: 1,
      value: ''
    }
    );
    this.setState(previousState => {
      return {
        ...previousState,
        zones
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  onDeleteArea = id => () => {
    const zones = [...this.state.zones];

    const zone = zones.find(p => p.id == id);

    if (zone) {
      const zoneNews = zones.filter(p => p.id != id);

      this.setState(previousState => {
        return {
          ...previousState,
          zones: zoneNews
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    } else {
      alert('Không tìm thấy dữ liệu này');
    }
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

  handleSelect = (value) => {
    let productTypeId = [...this.state.productTypeId];

    productTypeId = value;

    this.setState(previousState => {
      return {
        ...previousState,
        productTypeId
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  onChangeNameProperty = id => e => {
    const zones = [...this.state.zones];

    const value = e.target.value;

    const zone = zones.find(p => p.id == id);

    if (zone) {
      zone.name = value;

      this.setState(previousState => {
        return {
          ...previousState,
          zones
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  onChangeValueProperty = id => e => {
    const zones = [...this.state.zones];

    const value = e.target.value;

    const zone = zones.find(p => p.id == id);

    if (zone) {
      zone.value = value;

      this.setState(previousState => {
        return {
          ...previousState,
          zones
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  onChangeTypeProperty = id => e => {
    const zones = [...this.state.zones];

    const value = e.target.value;

    const zone = zones.find(p => p.id == id);

    if (zone) {
      zone.dataType = parseInt(value);

      this.setState(previousState => {
        return {
          ...previousState,
          zones
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  handleChangeComplete = (color) => {
    const { onHandleChangeValue } = this.props;
    this.setState({ color: color.hex }, () => {
      if (onHandleChangeValue) {
        onHandleChangeValue(this.state);
      }
    });
  };

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

  onUpdateFileImage = () => {
    this.refFileImage.click();
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
  }

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

  onChangeSelect = name => value => {
    if (name == 'fieldTypeID') {
      const fieldType = this.state.fieldTypes.find(p => p.id == value);

      if (fieldType) {
        const { requestFieldChildrenEndStore } = this.props;

        requestFieldChildrenEndStore(JSON.stringify({
          "search": "",
          "filter": fieldType.id,
          "orderBy": "",
          "page": null,
          "limit": null
        })).then(res => {
          const fields = ((res.data || {}).data || {}).fields || [];

          this.setState(previousState => {
            return {
              ...previousState,
              fields
            }
          });
        });

        this.setState(previousState => {
          return {
            ...previousState,
            fieldTypeName: fieldType.name
          }
        });
      }
    } else if (name == 'fieldID') {
      //const field = this.state.fields.find(p => p.id == value);

      if (value) {
        this.setState(previousState => {
          return {
            ...previousState,
            //fieldName: field.fieldName,
            [name]: value

          }
        }, () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        });
      }
    }
  }

  onUpdateFileImages = () => {
    this.refFileImages.click();
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
    const { name, zones, dataProduct, productTypeId, pathImageDefaul, fieldTypes, fields, fieldTypeName, fieldID } = this.state;
    const { errors, id } = this.props;
    return (
      <div className='wrap-insert-or-update-type-zone-property'>
        <div className='wrap-insert-or-update-type-zone-property-item'>
          <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>Nhóm ngành &nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-type-zone-property-item-box'>
            {/* {fieldTypes  && ( */}
            <Select
              labelMark={fieldTypeName}
              name="fieldTypeID"
              title='Chọn nhóm ngành'
              data={fieldTypes}
              labelName='name'
              val='id'
              handleChange={this.onChangeSelect('fieldTypeID')}
            />
            {/* )} */}
          </div>
        </div>
        <div className='wrap-insert-or-update-type-zone-property-item'>
          <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>Ngành nghề &nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-type-zone-property-item-box'>
            {/* <Select
              //labelMark={fieldName}
              name="fieldID"
              title='Chọn ngành nghề'
              data={fields}
              labelName='name'
              val='id'
              handleChange={this.onChangeSelect('fieldID')}
            /> */}

            {/* <Select
              name="fieldID"
              title='Chọn ngành nghề'
              data={fields ? fields : []}
              defaultValue={fieldID ? fieldID : ''}
              labelName='fieldName'
              val='id'
              isHideSelectAll={true}
              isMulti={true}
              handleChange={this.onChangeSelect('fieldID')}
            /> */}
            <Select
              name="fieldID"
              title='Chọn ngành nghề'
              data={fields}
              labelName='fieldName'
              val='id'
              isHideSelectAll={true}
              isMulti={true}
              handleChange={this.onChangeSelect('fieldID')}
            />
          </div>
        </div>
        <div className='wrap-insert-or-update-type-zone-property-item'>
          <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>Tên loại &nbsp;<b style={{ color: 'red' }}>*</b></label>
          <div className='wrap-insert-or-update-type-zone-property-item-box'>
            <InputGroup className='input-group-alternative css-border-input'>
              <Input
                ref={ref => this.refInputName = ref}
                placeholder="Tên loại"
                autoFocus={true} value={name}
                onChange={this.onChangeValue('name')}
                type='text' />
            </InputGroup>
            {/* <input ref={ref => this.refInputName = ref} autoFocus={true} value={name} onChange={this.onChangeValue('name')} type='text' className='wrap-insert-or-update-type-zone-property-item-input css-search-input' /> */}
            <p className='form-error-message'>{errors.name || ''}</p>
          </div>
        </div>

        {id ? (
          <div>
            {dataProduct ? (
              <div className='wrap-insert-or-update-type-zone-property-item ' style={{ marginBottom: 10 }}>
                <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>Loại sản phẩm&nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='wrap-insert-or-update-type-zone-property-item-box'>
                  {/* <Select
                                        name="productTypeId"
                                        title='Chọn loại sản phẩm'
                                        data={dataProduct}
                                        defaultValue={productTypeId}
                                        labelName='name'
                                        val='id'
                                        isHideSelectAll={true}
                                        isMulti={true}
                                        handleChange={this.handleSelect}
                                    /> */}
                  {dataProduct &&
                    <SelectParent
                      name="productTypeId"
                      title='Chọn loại sản phẩm'
                      defaultValue={productTypeId}
                      data={dataProduct}
                      labelName='name'
                      isMulti={true}
                      noneParent={true}
                      parentId='materialGroupID'
                      parentName='materialGroupName'
                      val='id'
                      isHideSelectAll={true}
                      handleChange={this.handleSelect}
                    />}
                  <p className='form-error-message'>{errors.productTypeId || ''}</p>
                </div>
              </div>) : null}
          </div>) :
          <div className='wrap-insert-or-update-type-zone-property-item' style={{ marginBottom: 10 }} >
            <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>Loại sản phẩm&nbsp;<b style={{ color: 'red' }}>*</b></label>
            <div className='wrap-insert-or-update-type-zone-property-item-box'>
              {/* <Select
                                name="productTypeId"
                                title='Chọn loại sản phẩm'
                                data={dataProduct}
                                labelName='name'
                                val='id'
                                isHideSelectAll={true}
                                isMulti={true}
                                handleChange={this.handleSelect}
                            /> */}
              {dataProduct &&
                <SelectParent
                  name="productTypeId"
                  title='Chọn loại sản phẩm'
                  data={dataProduct}
                  labelName='name'
                  isMulti={true}
                  noneParent={true}
                  parentId='materialGroupID'
                  parentName='materialGroupName'
                  val='id'
                  isHideSelectAll={true}
                  handleChange={this.handleSelect}
                />
              }
              <p className='form-error-message'>{errors.productTypeId || ''}</p>
            </div>
          </div>
        }

        <div className='wrap-insert-or-update-zone-item' style={{ marginBottom: 10 }}>
          <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>
            Màu sắc</label>
          <div className='wrap-insert-or-update-zone-item-box'>
            <SketchPicker
              color={this.state.color}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </div>

        <div className='wrap-insert-or-update-zone-item'>
          <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>
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
                    className={`css-icon-button-type-Zone-property`}
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

            <label className='wrap-insert-or-update-type-zone-property-item-label css-width-label'>
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
                              style={{ width: '100%', height: '100%', maxWidth: 100, maxHeight: 100, padding: 5 }}
                            />
                          </div>

                          <div style={{ padding: 5, position: "absolute", top: '-10px', right: '-8px' }}>
                            <Button
                              color="default"
                              data-dismiss="modal"
                              type="button"
                              className={`css-icon-button-type-Zone-property`}
                              onClick={() => this.onDeleteFileImage(e)}
                            ><span>x</span>
                              {/* <img src={CloseIcon} alt='Thoát ra' /> */}
                              {/* <span>Xóa hình</span> */}
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


        <div className='wrap-insert-or-update-type-zone-property-table' style={{ marginTop: 5 }}>
          <p className='form-error-message'>{errors.zone || ''}</p>
          <table className='wrap-insert-or-update-type-zone-property-list'>
            <thead className='wrap-insert-or-update-type-zone-property-list-header'>
              <tr className='wrap-insert-or-update-type-zone-property-list-header-row'>
                <th className='wrap-insert-or-update-type-zone-property-list-header-row-col-1'>STT</th>
                <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>TÊN THUỘC TÍNH</th>
                <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>KIỂU DỮ LIỆU</th>
                <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>GIÁ TRỊ</th>
                <th className='wrap-insert-or-update-type-zone-property-list-header-row-col wrap-insert-or-update-type-zone-property-list-header-row-4'></th>
              </tr>
            </thead>
            <tbody className='wrap-insert-or-update-type-zone-property-list-body'>
              {(zones || []).map((item, index) => {
                return (
                  <tr key={item.id} className='wrap-insert-or-update-type-zone-property-list-body-row'>
                    <td className='wrap-insert-or-update-type-zone-property-list-body-row-col-1'>{index + 1}</td>
                    <td className='wrap-insert-or-update-type-zone-property-list-body-row-col'>
                      <input onChange={this.onChangeNameProperty(item.id)} placeholder='Nhập tên thuộc tính' type='text' value={item.name} className='wrap-insert-or-update-type-zone-property-list-body-row-col-input' />
                    </td>
                    <td className='wrap-insert-or-update-type-zone-property-list-body-row-col'>
                      <select onChange={this.onChangeTypeProperty(item.id)} value={item.dataType} className='wrap-insert-or-update-type-zone-property-list-body-row-col-select'>
                        <option selected={item.dataType == 1} value='1'>Text</option>
                        <option selected={item.dataType == 2} value='2'>Number</option>
                        {/* <option selected={item.dataType == 3} value='3'>Date</option>
                                                <option selected={item.dataType == 4} value='4'>Image</option> */}
                      </select>
                    </td>
                    <td className='wrap-insert-or-update-type-zone-property-list-body-row-col'>
                      <input onChange={this.onChangeValueProperty(item.id)} placeholder='Giá trị' type='text' value={item.value} className='wrap-insert-or-update-type-zone-property-list-body-row-col-input' />
                    </td>
                    <td className='wrap-insert-or-update-type-zone-property-list-body-row-col wrap-insert-or-update-type-zone-property-list-body-row-col-4'>
                      <button onClick={this.onDeleteArea(item.id)} className='wrap-insert-or-update-type-zone-property-list-body-row-col-delete'>
                        <img className='wrap-insert-or-update-type-zone-property-list-body-row-col-delete-icon' src={IconDelete} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='wrap-insert-or-update-type-zone-property-add'>
          <button onClick={this.onAddArea} className='wrap-insert-or-update-type-zone-property-add-button' style={{ width: 25, height: 25 }}>
            <img className='wrap-insert-or-update-type-zone-property-add-button-icon' style={{ width: 20, height: 20 }} src={IconAdd} />
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.AreaDataStore,
    productGroup: state.ProductGroupStore,
    fieldType: state.FieldTypeStore,
    field: state.FieldStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(areaDataAction, dispatch),
    ...bindActionCreators(typeZonePropertyAction, dispatch),
    ...bindActionCreators(actionProductGroup, dispatch),
    ...bindActionCreators(actionFieldType, dispatch),
    ...bindActionCreators(actionField, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InsertOrUpadte);