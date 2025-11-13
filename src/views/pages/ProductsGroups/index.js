import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionProductGroup } from "../../../actions/ProductGroupActions";
import { actionMaterialGroup } from "../../../actions/MaterialGroupActions";
import { PRODUCT_GROUP } from "../../../helpers/constant";
import { setAlertContext, openAlertContext, getUnique } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import moment from 'moment';
import './ProductsGroups.css';
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import SearchModal from "./SearchModal";
import NoImg from '../../../assets/img/NoImg/NoImg.jpg'
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import WarningPopup from "../../../components/WarningPopup";
import WarningPopupDel from "../../../components/WarningPopupDel";
import UpdateModal from "./UpdateModal";
import UpdatePopup from "../../../components/UpdatePopup";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import AddNewModal from "./AddNewModal";
import PopupMessage from "../../../components/PopupMessage";
import SelectTree from "components/SelectTree";
import { actionField } from "../../../actions/FieldActions.js";
import { handleGenTree } from "../../../helpers/trees";
import CreateNewPopup from "../../../components/CreateNewPopup";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { filter, forEach, isBuffer } from "lodash";

const results = (data) => {
  return Object.keys(data).reduce((result, key) => {
    (!result.find(p => p.id == data[key].materialGroupID)) &&
      result.push({
        id: data[key].materialGroupID,
        name: data[key].materialGroupName
      });
    return result
  }, [])
}

class ProductsGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataMaterial: [],
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
      dataInsert: {},
      company: null,
      message: '',
      history: [],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      company: [],
      typeAlign: [{ type: 'number', position: [3, 4] }],
      headerTitle: PRODUCT_GROUP,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      // currentPage: 0,
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
    const { limit } = this.state;
    let { data } = nextProp.productGroup;
    let materialParent = [];
    let _materialParent = [];
    let _data = [];
    let fieldData = nextProp.field.data;
    let haveRoot = false;
    let fieldDataParent = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.list) !== 'undefined') {
          if (data.list !== null) {
            if (typeof (data.list.productGroups) !== 'undefined') {
              data.list.productGroups.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                if (item.isLocked == true) {
                  item['status'] = "Đã khóa"
                } else {
                  item['status'] = "Chưa khóa"
                }
              });

              _data = data.list.productGroups;
              materialParent = results(_data)

              _materialParent = materialParent.sort((a, b) => {
                return new Date(b.name).getTime() -
                  new Date(a.name).getTime()
              }).reverse();

              this.setState({
                data: data.list.productGroups,
                dataMaterialParent: _materialParent,
                listLength: data.list.total,
                totalPage: Math.ceil(data.list.productGroups.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.list.productGroups,
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
            if (typeof (fieldData.field.fields) !== 'undefined') {
              fieldData.field.fields
                .filter(item => item.parentID === null)
                .map(item => haveRoot = true);

              if (haveRoot) {
                fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1;

                });
              } else {
                // Search Element in tree
                fieldData.field.fields.map(
                  (item, key, array) => (
                    key === 0 && (item.parentID = null)
                  ));

                fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1
                });
              }
            }

            this.setState({
              field: fieldDataParent,
              fieldAll: fieldData.field.fields,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              field: [],
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    // if (dataMaterial !== this.state.dataMaterial) {
    //   if (typeof (dataMaterial) !== 'undefined') {
    //     if (dataMaterial.list !== null) {
    //       if (dataMaterial.list.materialGroups) {
    //         if (typeof (dataMaterial.list.materialGroups) !== 'undefined') {
    //           this.setState({ dataMaterial: dataMaterial.list.materialGroups, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //         } else {
    //           this.setState({ dataMaterial: dataMaterial.list.materialGroups, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //         }
    //       }
    //     }
    //   }
    // }
  }

  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  componentWillMount() {
    const { requestListLogMaterialGroupProduct, requestFieldStore } = this.props;
    requestListLogMaterialGroupProduct(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (res.data.status == 200) {
        this.setState({
          dataMaterial: res.data.data.materialGroups,
          isLoaded: false,
          status: res.data.status,
          message: PLEASE_CHECK_CONNECT(res.data.message)
        });
      }
    })

    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      // this.setState({ currentFilter: res.data.data.fields[16].id })
      //this.setState({ currentFilter: res.data.data.fields[16].id })
      this.fetchSummary(JSON.stringify({
        "search": "",
        // "filter": res.data.data.fields[16].id,
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }));
    })

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
    const { requestListProductGroup } = this.props;
    requestListProductGroup(data);
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
    const { requestDeleteProductGroup, requestListProductGroup } = this.props;
    let { data, deleteItem } = this.state;
    let newData = data.filter(item => item.id === deleteItem).map((item, key) => {
      item.status = 0
    });

    requestDeleteProductGroup(deleteItem).then((res) => {
      if (res.data.status === 200) {
        requestListProductGroup(JSON.stringify({
          "search": "",
          "filter": this.state.currentFilter,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
        toast.success("Xoá loại sản phẩm thành công!")
      } else {
        this.setState({
          errNoti: res.data.message,
        })
        this.toggleModal('popupMessage')
      }
    })
  }

  handleLockRow = () => {
    const { requestLockProductGroup, requestListProductGroup } = this.props;
    let { lockItem } = this.state;

    requestLockProductGroup(lockItem).then((res) => {
      if (res.data.status === 200) {
        requestListProductGroup(JSON.stringify({
          "search": "",
          "filter": this.state.currentFilter,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
        toast.success("Khoá loại sản phẩm thành công!")
      } else {
        this.setState({
          errNoti: res.data.message,
        })
        this.toggleModal('popupMessage')
      }
    })
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
    this.setState({ newData: data, errorInsert: {}, errorUpdate: {} });
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
        currentRow: null,
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

  handleStyleStatus = (status) => {
    if (status === true) {
      return classes.lockStt;
    } else {
      return classes.noLockStt;
    }
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
    let { dataMaterial } = this.state;
    return (
      <AddNewModal
        dataMaterial={dataMaterial}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
        errorInsert={this.state.errorInsert}
      />
    );
  }
  closeForm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {},
        // data: []
      }
    });
    // this.setState({ newData: [] });
  }
  onHandleChangeValue = data => {
    this.setState(previousState => {
      return {
        ...previousState,
        dataInsert: data
      }
    }, () => {

      this.setState(previousState => {
        const errorInsert = this.checkDataInsert();
        return {
          ...previousState,
          errorInsert
        }
      });
    });
  }


  handleCreateInfoData = (value, closeForm, closePopup) => {
    const { requestCreateProductGroup } = this.props;
    const { data } = this.state;

    const bodyFormData = new FormData();
    const errorInsert = {};
    // const errorInsert = this.checkDataInsert(true)

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });

    if (!value.materialGroupID) {
      errorInsert['materialGroupID'] = 'Chưa chọn nhóm sản phẩm';
    }

    if (!value.name) {
      errorInsert['name'] = 'Tên loại sản phẩm không được bỏ trống';
    }
    if ((value.name || '').length > 255) {
      errorInsert['name'] = 'Tên loại sản phẩm nhập tối đa 255 ký tự';
    }
    if (value.name) {
      let flag = false;
      data.filter(item => item.name.toUpperCase().trim() === value.name.toUpperCase().trim())
        .map(item => flag = true);
      if (flag === true) {
        errorInsert['name'] = 'Tên loại sản phẩm này đã có';
      }
    }

    if (Object.keys(errorInsert).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorInsert
        }
      })
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

    requestCreateProductGroup(bodyFormData).then(res => {
      if (res.data.status == 200) {

        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": this.state.currentFilter,
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
    const { requestUpdateProductGroup } = this.props;
    const { data, newData, currentRow } = this.state;
    const errorUpdate = {};
    const bodyFormData = new FormData();
    let newDataUpdate = {
      id: newData.id,
      materialGroupID: newData.materialGroupID,
      name: newData.name,
      note: newData.note ? (newData.note == 'null' ? '' : newData.note) : '',
      image: newData.image ? (newData.image == 'null' ? '' : newData.image) : '',
      files: newData.files,
    };
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    if (!newDataUpdate.name) {
      errorUpdate['name'] = 'Tên loại sản phẩm không được bỏ trống';
    }

    if ((newDataUpdate.name || '').length > 255) {
      errorUpdate['name'] = 'Tên loại sản phẩm nhập tối đa 255 ký tự';
    }

    if (!newDataUpdate.materialGroupID) {
      errorUpdate['materialGroupID'] = 'Chưa chọn nhóm sản phẩm';
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
        errorUpdate['name'] = 'Tên loại sản phẩm này đã có';
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
    requestUpdateProductGroup(bodyFormData).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": this.state.currentFilter,
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
        editId: id
      }
    });
  }

  handleSelect = (value, name) => {

    this.setState({ currentFilter: value });

    this.fetchSummary(JSON.stringify({
      "search": "",
      "filter": value,
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }
  render() {
    const { hideSearch, hookClass, hookSpacing, hookPagination, hideTitle } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      detail,
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
      dataMaterial,
      popupMessage,
      errNoti,
      dataMaterialParent,
      field,
      fieldAll,
      currentFilter,
      warningPopupDelModal,
      createNewModal
    } = this.state;
    const statusPopup = { status: status, message: message };

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

      ACCOUNT_CLAIM_FF.filter(x => x == "ProductsGroups.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "ProductsGroups.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "ProductsGroups.Delete").map(y => isDisableDelete = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "ProductsGroups.Lock").map(y => isDisableLock = false)
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
                              <label className="form-control-label">Loại sản phẩm</label>
                              <InputGroup className="input-group-alternative css-border-input">
                                <Input
                                  name="search"
                                  value={filter.comapanyName}
                                  placeholder="Nhập tên loại sản phẩm cần tìm"
                                  onChange={(event) => this.handleChangeFilter(event)}
                                  type="text"
                                />
                              </InputGroup>
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
                        //customComponent={

                        // <div className={classes.filterArea}>
                        //   <label
                        //     className="form-control-label"
                        //   >
                        //     Ngành nghề
                        //   </label>
                        //   <SelectTree
                        //     //hidenTitle={true}
                        //     name="parentID"
                        //     title='Chọn ngành nghề'
                        //     data={field}
                        //     dataAll={fieldAll}
                        //     // disableParent={true}
                        //     selected={currentFilter}
                        //     labelName='fieldName'
                        //     fieldName='fieldName'
                        //     val='id'
                        //     handleChange={this.handleSelect}
                        //   />
                        // </div>
                        //}

                        searchForm={
                          <SearchModal
                            filter={filter}
                            handleChangeFilter={this.handleChangeFilter}
                          />
                        }
                        onHandleChangeValue={this.onHandleChangeValue}
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        moduleTitle='Thêm loại sản phẩm'
                        moduleBody={this.renderCreateModal()}
                        activeSubmit={activeCreateSubmit}
                        newData={newData}
                        handleCreateInfoData={this.handleCreateInfoData}
                        closeForm={this.closeForm}
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
                        <Table className="align-items-center tablecs table-css-productsGroup" responsive>
                          <HeadTitleTable headerTitle={headerTitle} reSize={300} reSizeName={'Trạng thái'}
                            classHeaderColumns={{
                              0: 'table-scale-col table-user-col-1'
                            }}
                          />
                          <tbody ref={ref => this.tableBody = ref}>
                            {
                              // Array.isArray(data) && (
                              //   data.filter((item, key) => key >= beginItem && key < endItem)
                              //     .map((item, key) => (
                              Array.isArray(dataMaterialParent) && (
                                dataMaterialParent.map((itPa, key1) => (
                                  <>
                                    <tr key={key1} className="table-hover-css" style={{ background: '#d1d1d1' }}>
                                      <td></td>
                                      <td></td>
                                      <td style={{ textAlign: 'left', fontWeight: 'bold' }} className='table-scale-col'>
                                        {itPa.name}
                                      </td>
                                      <td></td>
                                    </tr>
                                    {
                                      Array.isArray(data) && (
                                        //data.filter((item, key) => key >= beginItem && key < endItem)
                                        data.filter((item) => item.materialGroupID == itPa.id)
                                          .map((item, key) => (
                                            <tr key={key} className="table-hover-css">
                                              <td className="table-scale-col table-user-col-1">{key + 1}</td>
                                              <td className="table-scale-col"><img style={{ width: 82, height: 82 }} src={item.image ? item.image : NoImg} /></td>
                                              {/* <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                                <span className={this.handleStyleStatus(item.isLocked)}>{item.status}</span>
                                              </td> */}
                                              <td style={{
                                                textAlign: 'left',
                                                color: item.isLocked == true ? '#000' : 'red'
                                              }}
                                                className='table-scale-col'>
                                                {item.name}
                                              </td>
                                              <td>
                                                {(isDisableEdit == true && isDisableDelete == true && isDisableLock == true) || item.isLocked == true ? null : (
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
                                          )))
                                    }
                                  </>
                                )))
                              // )))
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
              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={errNoti}
                toggleModal={this.toggleModal}
              />

              <CreateNewPopup
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle='Thêm loại sản phẩm'
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
              {

                <UpdatePopup
                  moduleTitle='Sửa loại sản phẩm'
                  moduleBody={
                    <UpdateModal
                      dataMaterial={dataMaterial}
                      data={detail}
                      id={this.state.editId}
                      handleCheckValidation={this.handleCheckValidation}
                      handleNewData={this.handleNewData}
                      errorUpdate={this.state.errorUpdate}
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
    productGroup: state.ProductGroupStore,
    materialGroup: state.MaterialGroupStore,
    field: state.FieldStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionProductGroup, dispatch),
    ...bindActionCreators(actionMaterialGroup, dispatch),
    ...bindActionCreators(actionField, dispatch),
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProductsGroups);