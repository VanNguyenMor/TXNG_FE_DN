import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import SelectParent from "components/SelectParent";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { DATA_TYPE_LIST, PARAM_OF_ASSCESS_LIST, DATA_SORTODER_LIST } from "../../../helpers/constant";
import { rules, validations, checkFieldName, checkFieldNameBool } from "../../../helpers/validation";
import compose from 'recompose/compose';
import { actionInformation } from "../../../actions/InformationActions";
import { actionField } from "../../../actions/FieldActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { handleGenTree } from "../../../helpers/trees";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";

// reactstrap components
import {
  Input,
  InputGroup
} from "reactstrap";

class AddNewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newData: {
        "id": "",
        "fieldID": "",
        "informID": "",
        "name": "",
        // "materialGroupID": null,
        "dataType": null,
        "reference": null,
        "isRequired": true,
        // "isHarvest": false
      },
      activeSubmit: false,
      checkFieldName: '',
      dataTypeList: [
        { dataType: '1', name: "Văn bản" },
        { dataType: '2', name: "Số" },
        { dataType: '3', name: "Thời gian" },
        { dataType: '4', name: "Hình ảnh" },
        { dataType: '5', name: "Định vị" },
        { dataType: '6', name: "Có/Không" },
    ],
      paramAccess: PARAM_OF_ASSCESS_LIST,
      dataSortOder: DATA_SORTODER_LIST,
      dataInPopup: [],
      field: [],
      dataAllFromUpdate: [],
      fields: [],
      fieldName: '',
      isDisNum:false
    }
    this.redSelect = null;
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.information;
    let newData = [];
    let newData1 = [];
    let { dataAllFromUpdate, dataTypeList } = this.state;
    let collapseList = [];
    if (data !== this.state.dataInPopup) {
      if (data.informationPopup !== null) {
        if (typeof (data) !== 'undefined') {
          if (typeof (data.informationPopup) !== 'undefined') {
            if (data.informationPopup !== null) {
              if (typeof (data.informationPopup.accesses) !== 'undefined') {
                newData = data.informationPopup.accesses;
                dataAllFromUpdate = data.informationPopup.accesses

                newData1 = newData.filter(x => x.dataType == null)

                newData.map(item => (
                  collapseList.push({ id: item.id, collapse: false })
                ));
                newData.map((item, key) => {
                  item['parentID'] = item.informID === null ? '' : item.informID
                });

                newData = handleGenTree(newData1, 'name');
                newData.map((item, key) => {
                  item['index'] = key + 1
                });

                
                if (newData.length > 0 && this.state.newData) {
                  let isDisNum = false;
                  let dataCheckIsHavert = newData.filter(x => x.id.trim().toUpperCase() == this.state.newData.informID.trim().toUpperCase());
                  if (dataCheckIsHavert.length > 0) {
                    if (dataCheckIsHavert[0].isHarvest == true || dataCheckIsHavert[0].isHarvest2 == true) {
                      isDisNum=true;
                      
                      this.setState({isDisNum})
                    }else{
                      this.setState({isDisNum})
                    }
                  }
                }

                this.setState({ dataAllFromUpdate: [] });
                this.setState({
                  dataInPopup: newData,
                  collapseList: collapseList,
                  dataAllFromUpdate: data.informationPopup.accesses,
                  listLength: newData.length,
                  isLoaded: false,
                  status: data.status,
                  message: PLEASE_CHECK_CONNECT(data.message)
                });



              } else {
                this.setState({
                  dataInPopup: [],
                  isLoaded: data.isLoading,
                  status: data.status,
                  message: PLEASE_CHECK_CONNECT(data.message)
                });
              }
            }
          }
        }
      }
    }
    this.handleCheckValidation(dataAllFromUpdate);
  }

  componentWillMount() {
    const { field, currentFilter } = this.props;
    this.setState({ field, currentFilter, dataTypeList: [
      { dataType: '1', name: "Văn bản" },
      { dataType: '2', name: "Số" },
      { dataType: '3', name: "Thời gian" },
      { dataType: '4', name: "Hình ảnh" },
      { dataType: '5', name: "Định vị" },
      { dataType: '6', name: "Có/Không" },
  ] });
    const { newData, dataInPopup, dataTypeList } = this.state;
    const { requestInformationPopupStore } = this.props;
    requestInformationPopupStore(JSON.stringify({
      "search": "",
      "filter": currentFilter == "" ? 0 : currentFilter,
      "orderBy": "",
      "page": null,
      "limit": null
    }))


  }

  componentDidMount() {
    const { data } = this.props;
    let { newData, dataTypeList } = this.state;

    newData = {
      "id": data.id,
      "fieldID": data.fieldID,
      "informID": data.informID,
      "infoname": data.name,
      // "materialGroupID": data.materialGroupID,
      "sortOrder": data.sortOrder === null ? null : data.sortOrder,
      "dataType": data.dataType === null ? 1 : data.dataType,
      "reference": data.reference,
      "isRequired": data.isRequired === null ? false : data.isRequired,
      // "isHarvest": data.isHarvest === null ? false : data.isHarvest
    }

    this.setState({ newData });
    this.handleCheckValidation();
    this.getFieldHaveAccessStore(data.fieldID);




  }

  getFieldHaveAccessStore = (fieldId) => {
    this.props.requestFieldHaveAccessStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      const fields = (res.data || {}).fields || [];

      let fieldName = this.state.fieldName;

      if (fieldId) {
        const field = fields.find(p => p.id == fieldId);

        if (field) {
          fieldName = field.fieldName;
        }
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

  handleChange = (event) => {
    let { newData, } = this.state;
    let { field } = this.props;

    const ev = event.target;
    newData[ev['name']] = ev['value'];
    this.setState({ newData });

    // Check Validation 
    this.handleCheckValidation();
  }

  handleSelect = (value, name) => {
    let { newData, dataTypeList, dataInPopup } = this.state;

    //if (value === null) value = "";
    if (name == 'fieldID') {
      this.setState({ currentFilter: value })
    }
    if (name == 'fieldID') {
      this.setState({ dataAllFromUpdate: [] })
      if (value == "") { value = null }
      const { requestInformationPopupStore } = this.props;
      requestInformationPopupStore(JSON.stringify({
        "search": "",
        "filter": value == "" ? 0 : value,
        "orderBy": "",
        "page": null,
        "limit": null
      }))
    }

    if (name == 'informID') {
      let isDisNum = false;
      let dataCheckIsHavert = dataInPopup.filter(x => x.id.trim().toUpperCase() == value.trim().toUpperCase());

      if (dataCheckIsHavert[0].isHarvest == true || dataCheckIsHavert[0].isHarvest2 == true) {
        isDisNum = true;
        
      }else{
        isDisNum=false
      }
      this.setState({ isDisNum })
    }

    if (name === 'dataType') {
      if (newData.reference) {
        this.redSelect.resetValue();
        newData['reference'] = "";
      }
      let valdataType = value;
      if (valdataType == null) {
        this.setState({ dataTypeChange: null })
      }
    }
    if (name === 'reference') {
      let valreference = value;
      if (valreference == null) {
        this.setState({ datareferenceChange: null })
      }
    }

    if (name === 'sortOrder') {
      let valsortOrder = value;
      if (valsortOrder == null) {
        this.setState({ sortOrderChange: null })
      }
    }
    newData[name] = value;
    this.setState({ newData });
    // Check Validation 
    this.handleCheckValidation();
  }

  handleStatus = (event) => {
    let { newData } = this.state;
    const ev = event.target;

    // newData[ev['name']] = ev['checked'] =='false' ? false : true;
    newData[ev['name']] = ev['checked'];
    this.setState({ newData });
    //console.log(newData)
    this.handleCheckValidation();
  }

  handleCheckValidation = (dataVl = null) => {
    // handleCheckValidation = () => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { newData, dataAllFromUpdate } = this.state;
    let { field } = this.props;
    if (dataVl !== null) {

      dataAllFromUpdate = dataVl
    };

    // Check Validation 
    handleCheckValidation(true);

    // Handle New Data
    handleNewData(newData, dataAllFromUpdate);

  }

  onChangeSelect = name => value => {
    const field = this.state.fields.find(p => p.id == value);

    if (field) {
      this.setState(previousState => {
        return {
          ...previousState,
          fieldName: field.fieldName,
          newData: {
            ...previousState.newData,
            [name]: value
          }
        }
      }, () => {
        this.props.requestInformationPopupStore(JSON.stringify({
          "search": "",
          "filter": value,
          "orderBy": "",
          "page": null,
          "limit": null
        }))
      });
    }
  }

  render() {
    const {
      informData,
      handleOpenSelectTree,
      errorUpdate,
      datamaterialGroup,
      fieldAll
    } = this.props;
    const {
      field,
      newData,
      dataTypeList,
      paramAccess,
      dataTypeChange,
      datareferenceChange,
      sortOrderChange,
      dataSortOder,
      dataInPopup,
      currentFilter,
      fieldName: _fieldName,
      fields,
      isDisNum
    } = this.state;

    let _dataTypeList    
    let _dataTypeListName
    let _paramAccessName
    let _paramAccess
    let _dataSortOder
    let _dataSortOderName

    console.log(newData.dataType);

    if (newData.dataType != null) {
      _dataTypeList = dataTypeList.filter(x => newData.dataType == x.dataType)
      if (dataTypeChange === null) {
        _dataTypeListName = null
      } else {
        if (_dataTypeList.length > 0) {
          _dataTypeListName = _dataTypeList[0].name
        }
      }
    }

    if (newData.reference != null) {
      _paramAccess = paramAccess.filter(x => newData.reference == x.reference)
      if (datareferenceChange === null) {
        _paramAccessName = null
      } else {
        if (_paramAccess.length > 0) {
          _paramAccessName = _paramAccess[0].name
        }

      }
    }

    if (newData.sortOrder != null) {
      _dataSortOder = dataSortOder.filter(x => newData.sortOrder == x.number)
      if (sortOrderChange === null) {
        _dataSortOderName = null
      } else {
        _dataSortOderName = _dataSortOder[0].number
      }
    }

    let fieldName = _fieldName;
    let dataMapth = [...dataInPopup];

    // if (currentFilter) {
    // 	fieldName = fieldAll.filter(item => item.id == currentFilter)
    // }

    // if (currentFilter) {
    // 	dataMapth = dataInPopup.filter((item) =>
    // 		(item.fieldName.trim().toUpperCase() == fieldName[0].fieldName.trim().toUpperCase()))
    // }

    console.log(dataTypeList);

    return (
      <div className={classes.formControl}>
        <div className={classes.rowItem}>
          <label
            className="form-control-label"
          >
            Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
          <div className={classes.inputArea}>
            <Select
              name="fieldID"
              title='Chọn ngành nghề'
              data={fields}
              labelMark={fieldName}
              selected={newData.fieldID}
              labelName='fieldName'
              fieldName='fieldName'
              val='id'
              // handleChange={this.handleSelect}
              handleChange={this.onChangeSelect('fieldID')}
            // handleOpenSelectTree={handleOpenSelectTree}
            />
            <p className='form-error-message margin-bottom-0'>{errorUpdate['fieldID'] || ''}</p>
          </div>
        </div>

        <div className={classes.rowItem}>
          <label
            className="form-control-label"
          >
            Thuộc truy xuất&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
          <div className={classes.inputArea}>
            <SelectTree
              name="informID"
              title='Chọn truy xuất'
              data={dataMapth}
              selected={newData.informID}
              labelName='name'
              fieldName='name'
              val='id'
              handleChange={this.handleSelect}
              handleOpenSelectTree={handleOpenSelectTree}
            />
            <p className='form-error-message margin-bottom-0'>{errorUpdate['informID'] || ''}</p>
          </div>
        </div>

        <div className={`${classes.rowItem}`} style={{ marginBottom: 10 }}>
          <label
            className="form-control-label"
          >
            Tên kê khai&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>

          <Validate
            validations={validations}
            rules={rules}
          >
            {({ validate, errorMessages }) => (
              <div className={classes.inputArea}>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="textarea"
                    name='infoname'
                    defaultValue={newData.infoname}
                    placeholder='Tên truy xuất'
                    required
                    onChange={validate}
                    onKeyUp={(event) => this.handleChange(event)}
                  />
                </InputGroup>
                <p className='form-error-message margin-bottom-0'>{errorUpdate['infoname'] || ''}</p>
              </div>
            )}
          </Validate>
        </div>

        <div className={`${classes.rowItem} `}>
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
              defaultValue={newData.sortOrder}
              labelMark={_dataSortOderName}
              val='number'
              title='Chọn'
              handleChange={this.handleSelect}
            />
            {/* <p className='form-error-message margin-bottom-0'>{errorInsert['sortOrder'] || ''}</p> */}
          </div>
        </div>

        <div className={classes.rowItem}>
          <label
            className="form-control-label"
          >
            Kiểu dữ liệu&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
          <div className={classes.inputArea}>
            <Select
              name='dataType'
              labelName='name'
              defaultValue={newData.dataType}
              isDisNo2={isDisNum == true ? true : false}
              labelMark={_dataTypeListName}
              data={dataTypeList}
              val='dataType'
              title='Chọn kiểu dữ liệu'
              handleChange={this.handleSelect}
            />
            <p className='form-error-message margin-bottom-0'>{errorUpdate['dataType'] || ''}</p>
          </div>
        </div>
        {newData.dataType == 1 && (
          <div className={`${classes.rowItem} select-css-infor`}>
            <label
              className="form-control-label"
            >
              Danh sách tham chiếu
            </label>
            <div className={classes.inputArea}>
              <Select
                ref={ref => this.redSelect = ref}
                name='reference'
                labelName='name'
                defaultValue={newData.reference}
                labelMark={_paramAccessName}
                data={paramAccess}
                val='reference'
                title='Danh sách tham chiếu'
                handleChange={this.handleSelect}
              />
            </div>
          </div>
        )}

        {/* {newData.reference == 40 ? (
          <div className={classes.rowItem}>
            <label
              className="form-control-label"
            >
              Danh sách nguyên vật liệu&nbsp;<b style={{ color: 'red' }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <SelectParent
                name='materialGroupID'
                labelName='name'
                defaultValue={newData.materialGroupID}
                data={datamaterialGroup}
                val='id'
                parentId='fieldID'
                parentName='fieldName'
                title='Chọn danh sách nguyên vật liệu'
                handleChange={this.handleSelect}
              />
              <p className='form-error-message margin-bottom-0'>{errorUpdate['materialGroupID'] || ''}</p>
            </div>
          </div>
        ) : null} */}
        <div className={`${classes.rowItem} ${classes.checkboxItem} update-css-check`}>
          <label
            className="form-control-label"
            style={{ width: "26%" }}
          ></label>
          <input
            name="isRequired"
            type="checkbox"
            checked={newData.isRequired}
            className="checkbox-status"
            onClick={(event) => this.handleStatus(event)}
          />
          <label>Bắt buộc</label>



          {/* <input
						name="isHarvest"
						type="checkbox"
						defaultChecked={data.isHarvest}
						className="checkbox-status"
						onClick={(event) => this.handleStatus(event)}
					/>
					<label>Kiểm tra thời hạn cách ly</label> */}
        </div>
      </div>
    );
  }
};

// export default AddNewModal;
const mapStateToProps = (state) => {
  return {
    information: state.InformationStore,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionInformation, dispatch),
    // ...bindActionCreators(actionAccess, dispatch),
    ...bindActionCreators(actionField, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewModal);
