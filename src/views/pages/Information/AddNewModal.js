import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import SelectParent from "components/SelectParent";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { DATA_TYPE_LIST, PARAM_OF_ASSCESS_LIST, DATA_SORTODER_LIST, DATA_TYPES } from "../../../helpers/constant";
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
        "infoname": "",
        "dataType": "",
        "materialGroupID": null,
        "reference": null,
        "isRequired": true,
      },
      activeSubmit: false,
      checkFieldName: '',
      dataTypeList: DATA_TYPE_LIST,
      paramAccess: PARAM_OF_ASSCESS_LIST,
      dataSortOder: DATA_SORTODER_LIST,
      dataInPopup: [],
      field: [],
      dataAllFromAddNew: [],
      setSelected: [],
      fields: [],
      fieldName: '',
      isCheckHavert: false,
      isDisNum:false
    }
    this.redSelect = null;
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.information;
    let newData = [];
    let newData1 = [];
    let collapseList = [];
    if (data !== this.state.dataInPopup) {
      if (data.informationPopup !== null) {
        if (typeof (data) !== 'undefined') {
          if (typeof (data.informationPopup) !== 'undefined') {
            if (data.informationPopup !== null) {
              if (typeof (data.informationPopup.accesses) !== 'undefined') {
                newData = data.informationPopup.accesses;

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


                this.setState({ data: [] });

                this.setState({

                  dataInPopup: newData,
                  collapseList: collapseList,
                  dataAllFromAddNew: data.informationPopup.accesses,
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
  }

  componentWillMount() {
    const { field, currentFilter, localData } = this.props;

    let _currentFilter = currentFilter;

    const { newData } = this.state;
    this.setState({ field, })
    // const { requestInformationPopupStore } = this.props;
    // requestInformationPopupStore(JSON.stringify({
    // 	"search": "",
    // 	"filter": currentFilter == "" ? 0 : currentFilter,
    // 	"orderBy": "",
    // 	"page": null,
    // 	"limit": null
    // }));

    newData.fieldID = currentFilter;
    newData.informID = "";

    if (localData) {
      newData.fieldID = localData.fieldID;
      newData.informID = localData.informID;

      _currentFilter = localData.fieldID;
    }

    this.setState({ newData, currentFilter: _currentFilter });
    this.handleCheckValidation();
    this.getFieldHaveAccessStore();
  }

  getFieldHaveAccessStore = () => {
    this.props.requestFieldHaveAccessStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      const fields = (res.data || {}).fields || [];

      this.setState(previousState => {
        return {
          ...previousState,
          fields
        }
      });
    });
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

  handleSelect = (value, name) => {
    const SELECT_VALUE_KEY = "MySelectValue";
    let { newData, setSelected, dataInPopup, dataTypeList } = this.state;
    if (name == 'fieldID') {
      this.setState({ currentFilter: value });
    }
    if (name == 'fieldID') {
      this.setState({ dataAllFromAddNew: [] })
      const { requestInformationPopupStore } = this.props;
      requestInformationPopupStore(JSON.stringify({
        "search": "",
        "filter": value == "" ? 0 : value,
        "orderBy": "",
        "page": null,
        "limit": null
      }))
    }
    if (name == 'dataType') {
      if (newData.reference) {
        this.redSelect.resetValue();
        newData['reference'] = "";
      }
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
    // if (value === null) value = "";
    newData[name] = value;

    this.setState({
      newData
    });
    // Check Validation 
    this.handleCheckValidation();
  }

  handleStatus = (event) => {
    let { newData } = this.state;
    const ev = event.target;

    newData[ev['name']] = ev['checked'];
    this.setState({ newData });
  }

  handleCheckValidation = () => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { newData, dataAllFromAddNew } = this.state;
    let { field } = this.props;
    handleCheckValidation(true);

    handleNewData(newData, dataAllFromAddNew);

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
    const { data, handleOpenSelectTree, errorInsert, fieldAll, datamaterialGroup, dataSortOrder } = this.props;
    const { fieldName: _fieldName, fields, newData, dataTypeList, paramAccess, dataSortOder, field, dataInPopup, currentFilter, setSelected, isDisNum } = this.state;
    let fieldName = _fieldName;
    let dataMapth = [...dataInPopup];


    // if (currentFilter) {
    // 	fieldName = fieldAll.filter(item => item.id == currentFilter)
    // }

    // if (currentFilter) {
    // 	dataMapth = dataInPopup.filter((item) =>
    // 		(item.fieldName.trim().toUpperCase() == (fieldName || (fieldName[0] || {}).fieldName || '').trim().toUpperCase()))
    // }

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
              // className=
              name="fieldID"
              title='Chọn ngành nghề'
              data={fields}
              labelMark={fieldName}
              labelName='fieldName'
              fieldName='fieldName'
              val='id'
              handleChange={this.onChangeSelect('fieldID')}
            />
            <p className='form-error-message margin-bottom-0'>{errorInsert['fieldID'] || ''}</p>

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
            <p className='form-error-message margin-bottom-0'>{errorInsert['informID'] || ''}</p>
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
                    defaultValue={newData.name}
                    placeholder='Tên kê khai'
                    required
                    onChange={validate}
                    onKeyUp={(event) => this.handleChange(event)}
                  />
                </InputGroup>
                <p className='form-error-message margin-bottom-0'>{errorInsert['infoname'] || ''}</p>
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
              val='number'
              title='Chọn'
              valueDefault={dataSortOrder}
              handleChange={this.handleSelect}
            />
            {/* <p className='form-error-message margin-bottom-0'>{errorInsert['materialGroupID'] || ''}</p> */}
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
              data={dataTypeList}
              isDisNo2={isDisNum == true ? true : false}
              val='dataType'
              title='Chọn kiểu dữ liệu'
              handleChange={this.handleSelect}
            />
            <p className='form-error-message margin-bottom-0'>{errorInsert['dataType'] || ''}</p>
          </div>
        </div>
        {newData.dataType == 1 && (
          <div className={classes.rowItem}>
            <label
              className="form-control-label"
            >
              Danh sách tham chiếu
            </label>
            <div className={`${classes.inputArea} select-css-infor`}>
              <Select
                ref={ref => this.redSelect = ref}
                name='reference'
                labelName='name'
                //defaultValue={newData.reference}
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
                //defaultValue={newData.materialGroupID}
                data={datamaterialGroup}
                val='id'
                parentId='fieldID'
                parentName='fieldName'
                title='Chọn danh sách nguyên vật liệu'
                handleChange={this.handleSelect}
              />
              <p className='form-error-message margin-bottom-0'>{errorInsert['materialGroupID'] || ''}</p>
            </div>
          </div>
        ) : null} */}
        <div className={`${classes.rowItem} ${classes.checkboxItem} infor-css-check`} >
          <label
            className="form-control-label"
            style={{ width: "26%" }}
          ></label>
          <input
            name="isRequired"
            type="checkbox"
            checked={newData.isRequired}
            className="checkbox-status"
            onChange={(event) => this.handleStatus(event)}
          />
          <label >Bắt buộc</label>
          {/* <input
						name="isHarvest"
						type="checkbox"
						checked={newData.isHarvest}
						className="checkbox-status"
						onChange={(event) => this.handleStatus(event)}
					/>
					<label>Kiểm tra thời hạn cách ly</label> */}
        </div>
        <div className={`${classes.rowItem} ${classes.checkboxItem}`}>

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
    ...bindActionCreators(actionField, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewModal);
