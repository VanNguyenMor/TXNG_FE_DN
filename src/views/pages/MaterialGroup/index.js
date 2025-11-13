import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionMaterialGroup } from "../../../actions/MaterialGroupActions";
import { actionUnit } from "../../../actions/UnitActions";
import { actionField } from "../../../actions/FieldActions.js";
import { MATERIAL_GROUP } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, } from "../../../services/Common";
import moment from 'moment';
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import WarningPopup from "../../../components/WarningPopup";
import UpdateModal from "./UpdateModal";
import UpdatePopup from "../../../components/UpdatePopup";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import AddNewModal from "./AddNewModal";
import PopupMessage from "../../../components/PopupMessage";
import WarningPopupDel from "../../../components/WarningPopupDel";
import { handleGenTree } from "../../../helpers/trees";
import CreateNewPopup from "../../../components/CreateNewPopup";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './materialGroup.css'


import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  InputGroup,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

const results = (data) => {
  return Object.keys(data).reduce((result, key) => {
    (!result.find(p => p.id == data[key].fieldID)) &&
      result.push({
        id: data[key].fieldID,
        name: data[key].fieldName
      });
    return result
  }, [])
}

class MaterialGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      province: [],
      district: [],
      ward: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openCOM: false,
      openXEM: false,
      comfirm: null,
      xem: null,
      company: null,
      message: '',
      history: [],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      company: [],
      typeAlign: [{ type: 'number', position: [3, 4] }],
      headerTitle: MATERIAL_GROUP,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      deleteItem: null,
      dropdownOpen: false,
      warningPopupModal: false,
      activeCreateSubmit: false,
      newData: [],
      fetchingUnComfirm: false,
      errorInsert: {},
      errorUpdate: {},
      currentRow: null
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.materialGroup;
    const { limit } = this.state;
    let fieldData = nextProp.field.data;
    let fieldDataParent = [];
    let haveRoot = false;
    let fieldParent = [];
    let _fieldParent = [];
    let _data = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.list) !== 'undefined') {
          if (data.list !== null) {
            if (typeof (data.list.materialGroups) !== 'undefined') {
              data.list.materialGroups.map((item, key) => {
                item['index'] = key + 1
                item['collapse'] = false
                if (item.isLocked == true) {
                  item['status'] = "Đã khóa"
                } else {
                  item['status'] = "Chưa khóa"
                }
              });

              _data = data.list.materialGroups;
              fieldParent = results(_data)

              _fieldParent = fieldParent.sort((a, b) => {
                return new Date(b.name).getTime() -
                  new Date(a.name).getTime()
              }).reverse();

              this.setState({
                data: data.list.materialGroups,
                listLength: data.list.total,
                dataFieldParent: _fieldParent,
                totalPage: Math.ceil(data.list.materialGroups.length / limit),
                isLoaded: data.isLoading, status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.list.materialGroups,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

      }
    }
    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {
            fieldData.field.fields
              .filter(item => item.parentID === null)
              .map(item => haveRoot = true);

            if (haveRoot) {
              fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

              fieldDataParent.map((item, key) => {
                item['index'] = key + 1
              });
            } else {
              // Search Element in tree
              fieldData.field.fields.map((item, key, array) => (
                key === 0 && (item.parentID = null)
              ));

              fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

              fieldDataParent.map((item, key) => {
                item['index'] = key + 1
              });
            }

            this.setState({
              fieldAll: fieldData.field.fields,
              field: fieldDataParent,
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });

          } else {
            this.setState({
              field: fieldDataParent,
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }
  }

  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  handleStyleStatus = (status) => {
    if (status === true) {
      return classes.lockStt;
    } else {
      return classes.noLockStt;
    }
  }

  componentWillMount() {
    const { requestListUnit, requestFieldStore } = this.props;
    requestListUnit(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then((res) => {
      if (res.data.status == 200) {
        this.setState({ dataUnit: res.data.data.units });
      }
    })

    requestFieldStore(JSON.stringify(
      {
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }));

    this.fetchSummary(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));

  }


  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestListMaterialGroup } = this.props;
    requestListMaterialGroup(data)
  }

  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }

  searchTable = (event) => {
    let { data, history } = this.state;
    let value = event.target.value.trim();

    if (value.length === 0) {
      data = data.filter(item => item['companyName'] !== null);
    }
    else {
      data = data.filter(item =>
        item['companyName'] !== null && item['companyName'].toLowerCase().includes(value)
      );
    }

    this.setState({ searchData: data });
  }

  handleDeleteRow = () => {
    const { requestDeleteMaterialGroup, requestListMaterialGroup } = this.props;
    let { data, deleteItem } = this.state;
    let newData = data.filter(item => item.id === deleteItem).map((item, key) => {
      item.status = 0
    });

    requestDeleteMaterialGroup(deleteItem)
      .then(res => {
        if (res.status === 200) {
          requestListMaterialGroup(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));
          toast.success('Xoá nhóm sảm phẩm thành công!')
        } else {
          this.setState({
            errNoti: res.message,
          })
          this.toggleModal('popupMessage')
        }
      }
      )

  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev['name']] = ev['value'];
    //console.log(data);
    this.setState({ data });
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }


  handleNewData = (data) => {
    this.setState({ newData: data, errorInsert: {} });
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        errorInsert: {},
        currentRow: null
      });
    }
    if (state == 'createNewModal') {
      this.setState({
        [state]: true,
        detail: null,
        errorUpdate: {},
        errorInsert: {},
        newData: {},
      });
      if (type == 100) {
        this.setState({
          [state]: !this.state[state],
          detail: null,
          errorUpdate: {},
          errorInsert: {},
          newData: {},
        });
      }
    }
    // this.setState({
    //   [state]: !this.state[state],
    //   errorInsert: {}
    // })
  };

  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }
    this.setState({ filter: clearFilter })
  }

  handleStatus = (event) => {
    for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
      document.getElementsByClassName('checkbox-status')[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;
    this.state.data.map((item, key) => (
      key >= beginItem && key < endItem && total++
    ));

    if (selected > 0) {
      total = (selected * limit) + total;
    } else total = total;

    this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
  };

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.clearFilter();
    this.fetchSummary(JSON.stringify(filter));
  }

  renderCreateModal = () => {
    const { dataUnit, field, errorInsert } = this.state;
    return (
      <AddNewModal
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
        errorInsert={errorInsert}
        dataUnit={dataUnit}
        fieldData={field}
      />
    );
  }
  closeForm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {},
        // newData: [],
        // errorUpdate: {},
      }
    });

    // this.setState({ newData: [] });
  }

  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { requestCreateMaterialGroup } = this.props;
    const { data } = this.state;
    const bodyFormData = new FormData();
    const errorInsert = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });

    // if (!value.fieldID) {
    //   errorInsert['fieldID'] = 'Chưa chọn ngành nghề';
    // }

    // if (!value.isProduct) {
    //   errorInsert['isProduct'] = 'Chưa chọn nhóm';
    // }

    if (!value.name) {
      errorInsert.name = 'Tên nhóm NVL không được bỏ trống';
    }

    if (!value.unitID) {
      errorInsert['unitID'] = 'Chưa chọn đơn vị tính';
    }

    if ((value.name || '').length > 255) {
      errorInsert['name'] = 'Tên nhóm NVL nhập tối đa 255 ký tự';
    }

    if (value.name) {
      let flag = false;
      data.filter(item => item.name.toUpperCase().trim() === value.name.toUpperCase().trim())
        .map(item => flag = true);
      if (flag == true) {
        errorInsert['name'] = 'Tên nhóm NVL đã có';
      }
    }

    if (Object.keys(errorInsert).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorInsert
        }
      });
      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {}
      }
    });
    if (closeForm) {
      closeForm();
    }
    Object.keys(value).forEach((key) => {
      bodyFormData.append(key, value[key])
    });
    this.setState({ fetching: true, isLoaded: true, status: null })
    requestCreateMaterialGroup(bodyFormData).then(res => {
      if (res.data.status == 200) {

        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }));
        if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
      } else {
        this.setState({ errNoti: res.data.message })
        this.toggleModal('popupMessage')
      }
    })
  }

  handleUpdateInfoData = (value, closeForm) => {
    const { requestUpdateMaterialGroup } = this.props;
    const { data, newData, currentRow } = this.state;
    const errorUpdate = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    const bodyFormData = new FormData();

    let newDataUpdate = {
      id: newData.ID,
      name: newData.name,
      note: newData.note ? (newData.note == 'null' ? '' : newData.note) : '',
      // fieldID: newData.fieldID,
      fieldID: '',
      unitID: newData.unitID,
      image: newData.image ? (newData.image == 'null' ? '' : newData.image) : '',
      files: newData.files,
      isProduct: true
    };



    // if (!newDataUpdate.fieldID) {
    //   errorUpdate['fieldID'] = 'Chưa chọn ngành nghề';
    // }
    // if (!newDataUpdate.isProduct) {
    //   errorUpdate['isProduct'] = 'Chưa chọn nhóm';
    // }

    if (!newDataUpdate.name) {
      errorUpdate['name'] = 'Tên nhóm NVL không được bỏ trống';
    }

    if ((newData.name || '').length > 255) {
      errorUpdate['name'] = 'Tên nhóm NVL nhập tối đa 255 ký tự';
    }

    let flag = false;
    if (newDataUpdate.name) {
      if (newDataUpdate.name.trim().toUpperCase().indexOf(currentRow.name.trim().toUpperCase()) === -1) {
        data.filter(item => item.name.trim().toUpperCase() === newDataUpdate.name.trim().toUpperCase())
          .map(item => flag = true);
      } else {
        flag = false;
      }
      if (flag == true) {
        errorUpdate['name'] = 'Tên nhóm NVL đã có';
      }
    }

    if (Object.keys(errorUpdate).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorUpdate
        }
      });
      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate: {}
      }
    });
    this.toggleModal('updateModal')
    Object.keys(newDataUpdate).forEach((key) => {
      bodyFormData.append(key, newDataUpdate[key])
    });

    requestUpdateMaterialGroup(bodyFormData).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }));
      } else {
        this.setState({ errNoti: res.data.message })
        this.toggleModal('popupMessage')
      }
    })
  }

  handleOpenEdit = (id) => {
    this.toggleModal('updateModal')
    this.setState(previousState => {
      return {
        ...previousState,
        // isShowForEdit: true,
        editId: id,

      }
    });
  }

  handleLockRow = () => {
    const { requestLockMaterialGroup, requestListMaterialGroup } = this.props;
    let { lockItem } = this.state;

    requestLockMaterialGroup(lockItem).then((res) => {
      if (res.data.status === 200) {
        requestListMaterialGroup(JSON.stringify({
          "search": "",
          "filter": this.state.currentFilter,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
        toast.success('Khoá nhóm sảm phẩm thành công!')
      } else {
        this.setState({
          errNoti: res.data.message,
        })
        this.toggleModal('popupMessage')
      }
    })
  }

  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      detail,
      errorInsert,
      headerTitle,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      warningPopupModal,
      activeCreateSubmit,
      newData,
      updateModal,
      errNoti,
      popupMessage,
      warningPopupDelModal,
      field,
      dataUnit,
      dataFieldParent,
      createNewModal
    } = this.state;
    const statusPopup = { status: status, message: message };
    // console.log(data);
    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    let isDisableLock = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
      isDisableLock = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "MaterialGroups.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "MaterialGroups.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "MaterialGroups.Delete").map(y => isDisableDelete = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "MaterialGroups.Lock").map(y => isDisableLock = false)
    }

    return (
      <>
        {
          <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
            <Container fluid className={typeof (hookSpacing) !== 'undefined' ? hookSpacing : ''}>
              {
                isLoaded ? (
                  <div style={{ display: 'table', margin: 'auto' }}>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                  </div>
                ) : (
                  <Row>
                    <div className="col">
                      {/* Header */}
                      <HeaderTable
                        dataReload={() => this.fetchSummary(
                          JSON.stringify({
                            "search": "",
                            "filter": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null
                          }))}
                        hideCreate={isDisableAdd == false ? false : true}
                        hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
                        hideSearch={true
                          // typeof (hideSearch) !== 'undefined' && (
                          //   hideSearch && true
                          // )
                        }
                        typeSearch={
                          <>
                            <div className="w_input">
                              <label className="form-control-label">Tên nhóm</label>
                              <div>
                                <InputGroup className="input-group-alternative css-border-input">
                                  <Input
                                    name="search"
                                    value={filter.comapanyName}
                                    placeholder="Nhập tên nhóm sản phẩm cần tìm"
                                    onChange={(event) => this.handleChangeFilter(event)}
                                    type="text"
                                  />
                                </InputGroup>
                              </div>
                            </div>
                            <div className="mg-btn">
                              <label
                                className="form-control-label"
                              >&nbsp;</label>
                              <Button
                                // style={{ margin: 0 }}
                                className='btn-warning-cs'
                                color="default" type="button" size="md"
                                onClick={() => {
                                  this.handleSubmitSearchForm();
                                  // this.onComfirmSearch()
                                }
                                }
                              >
                                <img src={SearchImg} alt='Tìm kiếm' />
                                <span>Tìm kiếm</span>
                              </Button>
                            </div>
                          </>
                        }
                        searchForm={
                          <SearchModal
                            filter={filter}
                            handleChangeFilter={this.handleChangeFilter}
                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        moduleTitle='Thêm nhóm sản phẩm'
                        moduleBody={this.renderCreateModal()}
                        activeSubmit={activeCreateSubmit}
                        newData={newData}
                        handleCreateInfoData={this.handleCreateInfoData}
                      />

                      {/* Table */}
                      <div className="row" style={{ display: 'flex', margin: 0, alignItems: 'center' }}>
                        <div style={{
                          width: 15,
                          height: 15,
                          background: 'red',
                        }}>
                        </div>&nbsp;
                        <span style={{ color: 'red', }}>Chưa khóa</span>
                        <div style={{
                          width: 15,
                          height: 15,
                          background: '#000',
                          marginLeft: 15
                        }}>
                        </div>&nbsp;
                        <span style={{ color: '#000', }}>Đã khóa</span>
                      </div>
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-materialGroup" responsive>
                          <HeadTitleTable headerTitle={headerTitle} reSize={300} reSizeName={'Trạng thái'}
                            classHeaderColumns={{
                              0: 'table-scale-col table-user-col-1'
                            }}
                          />
                          {/* data.filter((item, key) => key >= beginItem && key < endItem) */}
                          {/* <td style={{ textAlign: 'left' }} className='table-scale-col'>
                          <span><strong>{item.name}</strong></span><br />
                          <span style={{ fontStyle: 'italic' }}>{item.note}</span>
                        </td> */}
                          {/* <tbody ref={ref => this.tableBody = ref}>
                            {
                              Array.isArray(dataFieldParent) && (
                                dataFieldParent.map((itPa, key1) => (
                                  <>
                                    <tr key={key1}>
                                      <td></td>
                                      <td></td>
                                      <td style={{ textAlign: 'left', fontWeight: 'bold' }} className='table-scale-col'>
                                        {'---' + itPa.name}
                                      </td>
                                      <td></td>
                                    </tr>
                                    {
                                      Array.isArray(data) && (
                                        data.filter((item) => item.fieldID == itPa.id)
                                          .map((item, key) => (
                                            <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
                                              <td className='table-scale-col table-user-col-1'>{key + 1}</td>

                                              <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                                <span className={this.handleStyleStatus(item.isLocked)}>{item.status}</span>
                                              </td>

                                              <td style={{
                                                textAlign: 'left',
                                                color: item.isLocked == true ? 'red' : '#09b2fd'
                                              }}
                                                className='table-scale-col'>
                                                {'------' + item.name}
                                              </td>
                                              <td>
                                                {(isDisableEdit == true && isDisableDelete == true) || item.isLocked == true ? null : (
                                                  <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                                    <DropdownToggle>
                                                      <img src={MenuButton} />
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                      {isDisableLock == false ? (
                                                        <DropdownItem
                                                          onClick={() => {
                                                            this.toggleModal('warningPopupDelModal');
                                                            this.setState({ lockItem: item.id });
                                                          }}
                                                        >
                                                          Khóa
                                                        </DropdownItem>
                                                      ) : null}
                                                      {isDisableEdit == true && isDisableDelete == true ? null : (
                                                        <DropdownItem divider />
                                                      )}
                                                      {isDisableEdit == false ? (
                                                        <DropdownItem
                                                          onClick={() => {
                                                            this.toggleModal('updateModal');
                                                            this.handleOpenEdit(item.id);
                                                            this.setState({ currentRow: item })
                                                          }}
                                                        >
                                                          Sửa
                                                        </DropdownItem>
                                                      ) : null}
                                                      {isDisableEdit == true || isDisableDelete == true ? null : (
                                                        <DropdownItem divider />
                                                      )
                                                      }
                                                      {isDisableDelete == false ? (
                                                        <DropdownItem

                                                          onClick={() => {
                                                            this.toggleModal('warningPopupModal');
                                                            this.setState({ deleteItem: item.id });
                                                          }}
                                                        >
                                                          Xóa
                                                        </DropdownItem>
                                                      ) : null}
                                                    </DropdownMenu>
                                                  </ButtonDropdown>
                                                )}
                                              </td>
                                            </tr>
                                          ))
                                      )
                                    }
                                  </>
                                )))
                            }
                          </tbody> */}
                          <tbody ref={ref => this.tableBody = ref}>
                            {
                              Array.isArray(data) && (
                                data.map((item, key) => {
                                  return (
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css" >
                                      <td className='table-scale-col table-user-col-1'>{key + 1}</td>

                                      {/* <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                        <span className={this.handleStyleStatus(item.isLocked)}>{item.status}</span>
                                      </td> */}
                                      <td>
                                        <img style={{
                                          width: 82,
                                          height: 82,
                                          objectFit: 'cover'
                                        }} src={item.image ? item.image : NoImg} />
                                      </td>
                                      {/* <td>{item.isProduct ? 'Sản phẩm' : 'Nguyên vật liệu'}</td> */}
                                      <td style={{
                                        textAlign: 'left',
                                        color: item.isLocked == true ? '#000' : 'red'
                                      }}
                                        className='table-scale-col'>
                                        <strong>{item.name}</strong> <br />
                                        {/* <span>Thuộc nhóm:&nbsp;<i>{item.isProduct ? 'Sản phẩm' : 'Nguyên vật liệu'}</i></span><br /> */}
                                        <span>ĐVT:&nbsp;{item.unitName}</span>

                                      </td>
                                      <td>
                                        {(isDisableEdit == true && isDisableDelete == true) || item.isLocked == true ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              {isDisableLock == false ? (
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal('warningPopupDelModal');
                                                    this.setState({ lockItem: item.id });
                                                  }}
                                                >
                                                  Khóa
                                                </DropdownItem>
                                              ) : null}
                                              {isDisableEdit == true && isDisableDelete == true ? null : (
                                                <DropdownItem divider />
                                              )}
                                              {isDisableEdit == false ? (
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.toggleModal('updateModal');
                                                    this.handleOpenEdit(item.id);
                                                    this.setState({ currentRow: item })
                                                  }}
                                                >
                                                  Sửa
                                                </DropdownItem>
                                              ) : null}
                                              {isDisableEdit == true || isDisableDelete == true ? null : (
                                                <DropdownItem divider />
                                              )
                                              }
                                              {isDisableDelete == false ? (
                                                <DropdownItem

                                                  onClick={() => {
                                                    this.toggleModal('warningPopupModal');
                                                    this.setState({ deleteItem: item.id });
                                                  }}
                                                >
                                                  Xóa
                                                </DropdownItem>
                                              ) : null}
                                            </DropdownMenu>
                                          </ButtonDropdown>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })
                              )
                            }
                          </tbody>
                        </Table>
                      </Card>
                      {/* {
                        // Page of Table
                        Array.isArray(data) && (
                          data.length > 0 && (
                            <Pagination
                              data={data}
                              listLength={listLength}
                              totalPage={totalPage}
                              totalElement={totalElement}
                              handlePageClick={this.handlePageClick}
                            />
                          )
                        )
                      } */}
                    </div>
                  </Row>
                )
              }

              <CreateNewPopup
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle='Thêm nhóm sản phẩm'
                type100={true}
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleCreateInfoData={(data, beta, close) => {
                  this.handleCreateInfoData(data, () => {
                    this.setState({
                      createNewModal: false
                    });
                  }, close);
                }}
              />

              <WarningPopupDel
                moduleTitle='Thông báo'
                moduleBody={
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    Bạn đồng ý khóa thông tin này?
                  </p>}
                warningPopupDelModal={warningPopupDelModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleLockRow}
              />
              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    Bạn đồng ý xóa thông tin này?
                  </p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
              />
              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={errNoti}
                toggleModal={this.toggleModal}
              />
              {

                <UpdatePopup
                  moduleTitle='Sửa nhóm sản phẩm'
                  moduleBody={
                    <UpdateModal
                      data={detail}
                      id={this.state.editId}
                      handleCheckValidation={this.handleCheckValidation}
                      handleNewData={this.handleNewData}
                      errorUpdate={this.state.errorUpdate}
                      dataUnit={dataUnit}
                      fieldData={field}
                    />}
                  newData={newData}
                  updateModal={updateModal}
                  toggleModal={this.toggleModal}
                  activeSubmit={activeCreateSubmit}
                  handleUpdateInfoData={this.handleUpdateInfoData}
                />

              }
              <ToastContainer
                position="top-center"
                autoClose={3000}
              />
              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>
          </div>
        }
      </>

    )
  }

}
const mapStateToProps = (state) => {
  return {
    materialGroup: state.MaterialGroupStore,
    unit: state.UnitStore,
    field: state.FieldStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionMaterialGroup, dispatch),
    ...bindActionCreators(actionUnit, dispatch),
    ...bindActionCreators(actionField, dispatch)
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MaterialGroup);
