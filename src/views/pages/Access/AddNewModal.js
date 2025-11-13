import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import classes from './index.module.css';
import Validate from "react-validate-form";
import PlusImg from "../../../assets/img/buttons/plus.svg";
import Imgbt from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/DONG.png";
import delImg from "../../../assets/img/buttons/xoahinh.svg";
import { rules, validations, checkFieldName, checkFieldNameBool } from "../../../helpers/validation";
import { DATA_SORTODER_LIST } from "../../../helpers/constant";
import Select from "components/Select";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import ImageModal from '../../../components/ImageModal/ImageModal';


import compose from 'recompose/compose';
import { actionAccess } from "../../../actions/AccessActions";
import { actionField } from "../../../actions/FieldActions.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { handleGenTree } from "../../../helpers/trees";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";

// reactstrap components
import {
  Input,
  Button,
  InputGroup,
  Textarea
} from "reactstrap";

class AddNewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newData: {
        "ID": "",
        "FieldID": "",
        "InformID": "",
        "Name": "",
        "sortOrder": "",
        "files": "",
        "isEvaluated": false,
        "isRequired": true,
        "isQuarantine": false,
        "isHarvest": false,
        "isHarvest2": false
      },
      activeSubmit: false,
      checkFieldName: '',
      file: null,
      fileView: null,
      dataSortOder: DATA_SORTODER_LIST,
      dataInPopup: [],
      field: [],
      dataAllFromAddNew: [],
      fieldTypes: [],
      fieldTypeName: '',
      fieldName: '',
      fields: []
    }
    // this.handleChangeIMG = this.handleChangeIMG.bind(this);
    this.refEditor = null;
    this.refFileImage = null;
    this.refSelect = null;
  }

  componentWillReceiveProps(nextProp) {

    let { data } = nextProp.access;
    // console.log(data);
    let newData = [];
    let collapseList = [];

    if (data !== this.state.dataInPopup) {
      if (data.accessPopup !== null) {
        if (typeof (data) !== 'undefined') {
          if (typeof (data.accessPopup) !== 'undefined') {
            if (data.accessPopup !== null) {
              if (typeof (data.accessPopup.informations) !== 'undefined') {
                newData = data.accessPopup.informations;

                newData.map(item => (
                  collapseList.push({ id: item.id, collapse: false })
                ));
                newData.map((item, key) => {
                  item['parentID'] = item.informID === null ? '' : item.informID
                });

                newData = handleGenTree(data.accessPopup.informations, 'name');
                newData.map((item, key) => {
                  item['index'] = key + 1
                });



                this.setState({ data: [] });
                this.setState(previousState => {
                  return {
                    ...previousState,
                    dataAllFromAddNew: data.accessPopup.informations,
                  }
                })

                this.setState({
                  dataInPopup: newData,
                  collapseList: collapseList,
                  listLength: newData.length,
                  isLoaded: false,
                  status: data.status,
                  message: PLEASE_CHECK_CONNECT(data.message),

                });
              } else {
                this.setState({
                  dataInPopup: [],
                  isLoaded: data.isLoading,
                  status: data.status,
                  message: PLEASE_CHECK_CONNECT(data.message),

                });
              }
            }
          }
        }
      }
    }
  }

  handleChange = (event) => {
    let { newData } = this.state;
    let { field } = this.props;
    const ev = event.target;

    newData[ev['name']] = ev['value'];
    this.setState({ newData });

    // Check Validation 
    this.handleCheckValidation();
  }

  componentWillMount() {
    const { field, currentFilter, localData, fieldTypesCurrent, requestFieldChildrenEndStore } = this.props;

    const fieldTypes = (((this.props.fieldType || {}).data || {}).fieldTypes || {}).fieldTypes || [];

    let _currentFilter = currentFilter;

    let fieldTypeName = ((fieldTypes.filter(fT => fT.id == fieldTypesCurrent))[0] || {}).name;
    let fieldName;
    let { newData } = this.state;
    this.setState({ field, fieldTypes, fieldTypeName })
    const { requestAccessPopupStore } = this.props;
    requestAccessPopupStore(JSON.stringify({
      "search": "",
      "filter": currentFilter == "" ? '' : currentFilter,
      "orderBy": "",
      "page": null,
      "limit": null
    }))
    if (currentFilter) {
      requestFieldChildrenEndStore(JSON.stringify({
        "search": "",
        "filter": !fieldTypesCurrent ? '' : fieldTypesCurrent.toString(),
        "orderBy": "",
        "page": null,
        "limit": null
      })).then(res => {
        const fields = ((res.data || {}).data || {}).fields || [];
        if (fields) {
          fieldName = fields.filter(f => f.id == currentFilter)[0].name
        }
        this.setState(previousState => {
          return {
            ...previousState,
            fields,
            fieldName
          }
        });
      });
    }

    newData.FieldID = currentFilter
    newData.InformID = ""

    if (localData) {
      newData.FieldID = localData.FieldID || localData.fieldID;
      newData.InformID = localData.InformID;

      _currentFilter = newData.FieldID;
    }

    this.setState({ newData, currentFilter: _currentFilter }, () => {
      this.handleCheckValidation();
    });

  }

  handleSelect = (value, name) => {
    const { handleSelect } = this.props;
    let { newData } = this.state;
    if (name == 'FieldID') {
      this.setState({ currentFilter: value })
    }
    if (name == 'FieldID') {
      const { requestAccessPopupStore } = this.props;

      requestAccessPopupStore(JSON.stringify({
        "search": "",
        "filter": value == "" ? 0 : value,
        "orderBy": "",
        "page": null,
        "limit": null
      }))
    }

    if (value === null) value = "";

    newData[name] = value;

    this.setState({ newData });

    // Check Validation 
    this.handleCheckValidation();

    // handleSelect(value, name);
  }

  handleStatus = (event) => {
    let { newData } = this.state;
    const ev = event.target;

    newData[ev['name']] = ev['checked'];
    this.setState({ newData });
  }

  handleChangeIMG = event => {
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
    let { newData } = this.state;
    const ev = event.target.files[0];

    newData.files = ev;
    this.setState({ newData });

    //console.log(event.target.files[0])
    this.handleCheckValidation();
  }

  onUpdateFileImage = () => {
    this.refFileImage.click();
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
  handleCheckValidation = () => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { newData, dataAllFromAddNew } = this.state;

    let { field } = this.props;

    if (newData.Name.length > 0) {
      this.setState({ activeSubmit: true });

      // Check Validation 
      handleCheckValidation(true);

      // Handle New Data
      handleNewData(newData, dataAllFromAddNew);
    } else {
      this.setState({ activeSubmit: false });
      handleCheckValidation(false);

      // Handle New Data
      handleNewData(newData, dataAllFromAddNew);
    }
  }

  onChangeSelect = name => value => {
    const { requestAccessPopupStore } = this.props;
    if (name == 'FieldTypeID') {
      this.refSelect.resetValue();
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
    } else if (name == 'FieldID') {
      const field = this.state.fields.find(p => p.id == value);

      if (field) {
        this.setState(previousState => {
          return {
            ...previousState,
            fieldName: field.name,
            newData: {
              ...previousState.newData,
              [name]: value
            }
          }
        }, () => {
          this.handleCheckValidation();
        });
      }

      requestAccessPopupStore(JSON.stringify({
        "search": "",
        "filter": value == "" ? 0 : value,
        "orderBy": "",
        "page": null,
        "limit": null
      })).then(res => {
        const accessPop = ((res.data || {}).data || {}).informations || [];
        this.setState(previousState => {
          return {
            ...previousState,
            dataAllFromAddNew: accessPop
          }
        }, () => {
          this.handleCheckValidation();
        })
      })
    }
    this.handleCheckValidation();
  }

  render() {
    const { data, handleOpenSelectTree, fieldAll, errorInsert, handleSelect, fieldTypesCurrent } = this.props;
    const { fields, fieldName, fieldTypeName,
      newData, dataSortOder, dataInPopup, field, currentFilter, fieldTypes
    } = this.state;


    // let fieldName = _fieldName;
    // let dataMapth = [];

    // if (currentFilter) {
    // 	fieldName = fieldAll.filter(item => item.id == currentFilter)
    // }

    // if (currentFilter) {
    //   dataMapth = dataInPopup.filter((item) =>
    //     (item.fieldName.trim().toUpperCase() == (fieldName || (fieldName[0] || {}).fieldName || '').trim().toUpperCase()))
    // }
    let fieldNames = [...fields]
    
    // fieldNames = fields.map(item => (
    //   fieldNames = [...fields],
    //   fieldNames.fName = item.fieldCode + '-' + item.fieldName
    // ))
    
    return (
      <div className={classes.formControl}>
        <div className={`${classes.rowItem} Access_margin`}>
          <label
            className="form-control-label"
          >
            Nhóm ngành&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
          <div className={classes.inputArea}>
            <Select
              //labelMark={fieldTypeName}
              name="FieldTypeID"
              title='Chọn nhóm ngành'
              data={fieldTypes}
              labelName='name'
              defaultValue={fieldTypesCurrent && fieldTypesCurrent}
              val='id'
              handleChange={this.onChangeSelect('FieldTypeID')}
            />
            <p className='form-error-message margin-bottom-0'>{errorInsert['FieldTypeID'] || ''}</p>
          </div>
        </div>
        <div className={`${classes.rowItem} Access_margin`}>
          <label
            className="form-control-label"
          >
            Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
          <div className={classes.inputArea}>
            {/* <SelectTree
							name="FieldID"
							title='Chọn ngành nghề'
							data={field}
							//selected={newData.FieldID}
							selected={currentFilter}
							labelName='fieldName'
							fieldName='fieldName'
							val='id'
							handleChange={this.handleSelect}
							handleOpenSelectTree={handleOpenSelectTree}
						/> */}
            {currentFilter ?
              (
                <Select
                  labelMark={fieldName}
                  ref={ref => this.refSelect = ref}
                  name="FieldID"
                  title='Chọn ngành nghề'
                  data={fields}
                  labelName={'fieldName'}
                  val='id'
                  defaultValue={currentFilter && currentFilter}
                  handleChange={this.onChangeSelect('FieldID')}
                />
              ) : (
                <Select
                  //labelMark={fieldName}
                  ref={ref => this.refSelect = ref}
                  name="FieldID"
                  title='Chọn ngành nghề'
                  data={fields}
                  labelName={'fieldName'}
                  val='id'
                  // defaultValue={currentFilter && currentFilter}
                  handleChange={this.onChangeSelect('FieldID')}
                />)
            }
            {/* {fields.length > 0 &&
              <Select
                // labelMark={fieldName}
                ref={ref => this.refSelect = ref}
                name="FieldID"
                title='Chọn ngành nghề'
                data={fields}
                labelName='name'
                val='id'
                defaultValue={currentFilter && currentFilter}
                handleChange={this.onChangeSelect('FieldID')}
              />
            } */}
            <p className='form-error-message margin-bottom-0'>{errorInsert['FieldID'] || ''}</p>
          </div>
        </div>
        {/* <div className={classes.rowItem}>
					<label
						className="form-control-label"
					>
						Thuộc truy xuất
					</label>
					<div className={classes.inputArea}>
						<SelectTree
							name="InformID"
							title='Chọn truy xuất'
							data={dataMapth}
							selected={newData.InformID}
							labelName='name'
							fieldName='name'
							val='id'
							handleChange={this.handleSelect}
							handleOpenSelectTree={handleOpenSelectTree}
						/>
					</div>
				</div> */}

        <div className={`${classes.rowItem} Access_margin`}>
          <label
            className="form-control-label"
          >
            Tên truy xuất&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>

          <Validate
            validations={validations}
            rules={rules}
          >
            {({ validate, errorMessages }) => (
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="text"
                    name='Name'
                    defaultValue={data.Name}
                    placeholder='Tên truy xuất'
                    required
                    onChange={validate}
                    onKeyUp={(event) => this.handleChange(event)}
                  />
                </InputGroup>
                <p className='form-error-message margin-bottom-0'>{errorInsert['Name'] || ''}</p>
              </div>
            )}
          </Validate>
        </div>

        <div className={`${classes.rowItem} Access_margin`}>
          <label
            className="form-control-label"
          >
            Sắp xếp
          </label>
          <div className={classes.inputArea}>
            <Select
              name='sortOrder'
              labelName='number'
              data={dataSortOder}
              val='number'
              title='Chọn'
              handleChange={this.handleSelect}
            />
            <p className='form-error-message margin-bottom-0'>{errorInsert['materialGroupID'] || ''}</p>
          </div>
        </div>

        <div className={`${classes.rowItem} Access_margin`}>
          <label
            className="form-control-label"
          >
            Hình ảnh
          </label>
          <div className={classes.inputArea}>
            <div style={{ position: 'relative' }}>
              <InputGroup className="input-group-alternative css-border-input" style={{ width: 82, }}>
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
                  style={{ width: '82px', height: '82px', maxWidth: 320, maxHeight: 320 }} />

              </InputGroup>
              <div className="css-button-access">
                <Button type="button" size="lg" className='btn-primary-cs'
                  onClick={this.onUpdateFileImage}>
                  <img src={Imgbt} alt='Thêm mới' />
                  <span>Chọn hình</span>
                </Button>
                {this.state.file != null ? (
                  <div style={{ position: 'absolute', top: "-12px", left: 72 }}>
                    <Button
                      color="default"
                      data-dismiss="modal"
                      type="button"
                      className={`css-icon-button-access`}
                      onClick={this.onDeleImg}
                    >
                      {/* <img src={delImg} alt='Thoát ra' /> */}
                      <span>X</span>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className={`${classes.rowItem} ${classes.checkboxItem} row`} style={{ marginTop: 10, marginLeft: 130, justifyContent: 'flex-start' }}>
          <div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <input
              name="isRequired"
              type="checkbox"
              checked={newData.isRequired}
              className="checkbox-status"
              onChange={(event) => this.handleStatus(event)}
            />
            <label style={{ width: 'auto' }}>Bắt buộc</label>
          </div>
          <div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <input
              name="isQuarantine"
              type="checkbox"
              defaultChecked={newData.isHarvest}
              className="checkbox-status"
              onClick={(event) => this.handleStatus(event)}
            />
            <label style={{ width: 'auto' }}>Kiểm tra cách ly</label>
          </div>
          <div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <input
              name="isHarvest"
              type="checkbox"
              defaultChecked={newData.isHarvest}
              className="checkbox-status"
              disabled={newData.isEvaluated || newData.isHarvest2 ? true : false}
              onClick={(event) => this.handleStatus(event)}
            />
            <label style={{ width: 'auto' }}>Nhập kho</label>
          </div>
          <div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <input
              name="isEvaluated"
              type="checkbox"
              defaultChecked={newData.isEvaluated}
              className="checkbox-status"
              disabled={newData.isHarvest || newData.isHarvest2 ? true : false}
              onClick={(event) => this.handleStatus(event)}
            />
            <label style={{ width: 'auto' }}>Đánh giá</label>
          </div>
          <div className="row access-css-checkbox col-6" style={{ alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <input
              name="isHarvest2"
              type="checkbox"
              defaultChecked={newData.isHarvest2}
              className="checkbox-status"
              disabled={newData.isEvaluated || newData.isHarvest ? true : false}
              onClick={(event) => this.handleStatus(event)}
            />
            <label style={{ width: 'auto' }}>Chuyển giao</label>
          </div>
        </div>
      </div>
    );
  }
};

// export default AddNewModal;
const mapStateToProps = (state) => {
  return {
    access: state.AccessStore,
    field: state.FieldStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionAccess, dispatch),
    ...bindActionCreators(actionField, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewModal);
