import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { TYPE_ZONE_PROPERTY_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import { typeZonePropertyAction } from "../../../actions/TypeZonePropertyAction";
import classes from './index.module.css';
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from '../../../components/WarningPopup';
import CreateNewPopup from "../../../components/CreateNewPopup";
import PopupMessage from "../../../components/PopupMessage";
import NoImg from '../../../assets/img/NoImg/NoImg.jpg';
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TypeZoneProperty.css'

import {
  Card,
  Table,
  Container,
  Row,
  Input,
  Spinner,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import Message, { TYPES } from '../../../components/message';

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class TypeZoneProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      detail: [],
      update: [],
      create: [],
      delete: [],
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: '',
      history: [],
      roles: [],
      zones: [],
      editStatus: true,
      district: [],
      districtList: [],
      province: [],
      ward: [],
      provinceIDCurrent: null,
      headerTitle: TYPE_ZONE_PROPERTY_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "search": "",
        "name": "",
        "attributes": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      dataInsert: {},
      errorInserts: {},
      isShowForEdit: false,
      editId: null,
      warningPopupModal: false,
      deleteId: null
    };
  }
  componentWillReceiveProps(nextProp) {
    const { typeZoneProperties } = nextProp.typeZone
    const { limit, refetch } = this.state
    let dataType = null
    const data = typeZoneProperties
    if (typeZoneProperties !== this.state.typeZoneProperties)
      if (typeof (typeZoneProperties) !== 'undefined') {
        if (typeof (typeZoneProperties.data) !== 'undefined') {
          dataType = typeZoneProperties.data
          // console.log(dataType)
          if (typeof (dataType) !== 'undefined') {
            if (typeof (dataType.plantingTypes) !== 'undefined') {
              if (dataType.plantingTypes.length > 0) {
                dataType.plantingTypes.map((item, key) => {
                  item['index'] = key + 1;
                  item['collapse'] = false
                });
              }
            }
            let totalElement = 0;

            if (dataType.plantingTypes.length > limit) {
              totalElement = limit;
            } else {
              totalElement = dataType.plantingTypes.length
            }
            if (refetch) {
              this.setState({
                totalElement,
                data: dataType.plantingTypes,
                dataAll: dataType.plantingTypes,
                history: dataType.plantingTypes,
                listLength: dataType.total,
                totalPage: Math.ceil(dataType.plantingTypes.length / limit),
                status: dataType.plantingTypes.status,
                refetch: false,
                // message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                totalElement,
                data: dataType.plantingTypes,
                dataAll: dataType.plantingTypes,
                history: dataType.plantingTypes,
                listLength: dataType.total,
                totalPage: Math.ceil(dataType.plantingTypes.length / limit),
                status: dataType.plantingTypes.status,
                refetch: false,
                // message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
  }

  componentWillMount() {
    this.fetchSummary(JSON.stringify({
      "search": "",
      "name": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }

  componentDidUpdate() {
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { getListTypeZoneProperty } = this.props;

    getListTypeZoneProperty(data)
    // 	.then(res => {
    // 	this.setState(previousState => {
    // 		return {
    // 			...previousState,
    // 			data: ((res.data || {}).data || {}).plantingTypes || [],
    // 			listLength: ((res.data || {}).data || {}).total,
    // 			totalPage: Math.ceil((((res.data || {}).data || {}).plantingTypes || {}).length / limit),
    // 			isLoaded: ((res.data || {}).data || {}).isLoaded
    // 		}
    // 	});
    // });
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    // console.log(data);
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
    let { filter } = this.state;
    const { getListTypeZoneProperty } = this.props;

    filter.search = filter.name;
    getListTypeZoneProperty(JSON.stringify(filter))


  }

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
    } else {
      openModal();
    }

    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: false,
        editId: null
      }
    });
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  checkDataInsert = isCheck => {
    if (!isCheck) {
      return {};
    }

    const { dataInsert } = this.state;

    const name = dataInsert.name;
    const zones = dataInsert.zones || [];
    const productTypeId = dataInsert.productTypeId;

    const errorInserts = {};

    if (!name) {
      errorInserts.name = 'Tên loại vùng sản xuất không được bỏ trống';
    }

    if (productTypeId == '') {
      errorInserts.productTypeId = 'Chưa chọn loại sản phẩm'
    }

    if (name && (name || '').length > 255) {
      errorInserts.name = 'Tên loại vùng sản xuất nhập tối đa 255 ký tự';
    }

    if (zones.length <= 0) {
      errorInserts.zone = 'Thuộc tính không được bỏ trống';
    }

    const checkName = zones.filter(p => !p.name).length > 0;

    if (checkName) {
      errorInserts.zone = 'Chưa nhập thuộc tính loại vùng sản xuất';
    }

    const checkLengthName = zones.filter(p => p.name && (p || '').length > 255).length > 0;

    if (checkLengthName) {
      errorInserts.zone = 'Thuộc tính nhập tối đa 255 ký tự';
    }

    const checkExistName = zones.filter(p => zones.filter(m => m.name == p.name && m.id != p.id).length > 0).length > 0;

    if (checkExistName) {
      errorInserts.zone = 'Tên thuộc tính không được trùng nhau';
    }

    const checkValueName = zones.filter(m => m.name == "").length > 0;
    if (checkValueName) {
      errorInserts.zone = 'Bạn chưa nhập thuộc tính';
    }

    const checkProperty = zones.filter(p => ![1, 2, 3, 4].includes(p.dataType)).length > 0;

    if (checkProperty) {
      errorInserts.zone = 'Kiểu dữ liệu không được bỏ trống';
    }

    return errorInserts;
  }

  onConfirm = (toggleModal, closePopup) => {
    const { dataInsert } = this.state;
    const formData = new FormData();
    const id = dataInsert.id;
    const name = dataInsert.name;
    const zones = dataInsert.zones || [];
    const color = dataInsert.color;
    const imagesFile = dataInsert.mfileImg;
    const images = dataInsert.fileImage;
    const icon = dataInsert.icon;
    const iconFile = dataInsert.iconFile;
    const fieldID = dataInsert.fieldID ? dataInsert.fieldID : '';

    let productTypeIdV = dataInsert.productTypeId || '';

    let productTypeId = [];
    let productTypeIdVM = [];

    productTypeIdV = productTypeIdV.split(',');
    productTypeIdVM = productTypeIdV.filter(x => x != '');

    productTypeIdVM.map(x => {
      productTypeId.push(x);
    });

    productTypeId = productTypeIdVM.filter(function (elem, pos) {
      return productTypeIdVM.indexOf(elem) == pos;
    });

    const errorInserts = this.checkDataInsert(true);

    this.setState(previousState => {
      return {
        ...previousState,
        errorInserts
      }
    });

    if (Object.keys(errorInserts).length > 0) {
      return;
    }
    let _zones = []
    let __zones = {};
    zones.map(item => {
      __zones = {
        name: item.name,
        dataType: item.dataType,
        value: item.value
      }
      _zones.push(__zones);
    })

    let _fieldId = []
    _fieldId = fieldID.split(',');


    formData.append('ID', id);
    formData.append('Name', name);
    formData.append('PlantingAttributes', JSON.stringify(_zones));

    if (_fieldId.length > 0) {
      for (let index = 0; index < _fieldId.length; index++) {
        formData.append('FieldID', _fieldId[index]);
      }
    }

    if (productTypeId) {
      for (let index = 0; index < productTypeId.length; index++) {
        formData.append('ProductTypeId', productTypeId[index]);
      }
    }

    formData.append('Color', color ? color : '');
    formData.append('Images', images ? images : '');

    // if (zones) {
    //   for (let i = 0; i < zones.length; i++) {
    //     formData.append(`PlantingAttributes`, zones ? (JSON.stringify(zones[i])) : null)
    //   }
    // }
    if (imagesFile) {
      for (let i = 0; i < imagesFile.length; i++) {
        formData.append(`ImagesFile`, imagesFile ? imagesFile[i] : null)
      }
    }
    if (iconFile) {
      formData.append('IconFile', iconFile);
    } else {
      formData.append('Icon', icon ? icon : '');
    }

    if (id) {
      this.props.editTypeZoneProperty(formData).then(res => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));

          if (toggleModal) {
            toggleModal();
          }

          this.setState(previousState => {
            return {
              ...previousState,
              isShowForEdit: false,
              editId: null
            }
          });

          //Message.show(TYPES.SUCCESS, 'Thông báo', 'Sửa loại vùng sản xuất thành công');
        } else {
          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message });
          this.toggleModal('popupMessage')
          //Message.show(TYPES.ERROR, 'Thông báo', message || 'Sửa loại vùng sản xuất thất bại');
        }
      });
    } else {
      this.props.addTypeZoneProperty(formData).then(res => {
        const data = (res || {}).data || {};

        if (data.status == 200) {
          this.fetchSummary(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));

          if (toggleModal) {
            toggleModal();
          }
          if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
          //Message.show(TYPES.SUCCESS, 'Thông báo', 'Thêm loại vùng sản xuất thành công');
        } else {
          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message });
          this.toggleModal('popupMessage')
          //Message.show(TYPES.ERROR, 'Thông báo', message || 'Thêm loại vùng sản xuất thất bại');
        }
      });
    }
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        errorInserts: {}
      });
    }
  };

  onHandleChangeValue = data => {

    this.setState(previousState => {
      return {
        ...previousState,
        dataInsert: data
      }
    }, () => {
      const errorInserts = this.checkDataInsert();

      this.setState(previousState => {
        return {
          ...previousState,
          errorInserts
        }
      });
    });
  }

  onEditZone = id => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: true,
        editId: id
      }
    });
  }

  onDeleteZone = id => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        warningPopupModal: true,
        deleteId: id
      }
    });
  }

  toggleModalPopupDelete = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        warningPopupModal: false
      }
    });
  }

  handleDeleteRow = () => {
    this.props.deleteTypeZoneProperty({ id: this.state.deleteId }).then(res => {
      this.setState(previousState => {
        return {
          ...previousState,
          warningPopupModal: false
        }
      });

      const data = res.data;

      if (data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }));
        toast.success("Xoá loại vùng trồng thành công!")
        //Message.show(TYPES.SUCCESS, 'Thông báo', 'Xóa loại vùng sản xuất và thuộc tính thành công');
      } else {
        const message = getErrorMessageServer(res);
        this.setState({ messageErr: message });
        this.toggleModal('popupMessage')
        //Message.show(TYPES.ERROR, 'Thông báo', message || 'Xóa loại vùng sản xuất và thuộc tính thất bại');
      }
    });
  }

  render() {
    const {
      warningPopupModal,
      editId,
      isShowForEdit,
      errorInserts,
      status,
      headerTitle,
      data,
      message,
      isLoaded,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      filter,
      createNewModal,
      activeCreateSubmit,
      popupMessage,
      messageErr,
      currentPage
    } = this.state;
    const statusPopup = { status: status, message: message };
    const { fieldType } = this.props;
    // console.log(data, 1111);
    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "PlantingTypes.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "PlantingTypes.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "PlantingTypes.Delete").map(y => isDisableDelete = false)
    }

    return (
      <>
        {
          <div className={classes.wrapper}>
            <Container fluid>
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
                            "name": "",
                            "attributes": "",
                            "filter": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null
                          })
                        )}
                        hideSearch={true}
                        hideCreate={isDisableAdd == false ? false : true}
                        typeSearch={
                          <>
                            <div className="w_input">
                              <label className="form-control-label">Tên vùng</label>
                              <div>
                                <Input
                                  className="css-search-input"
                                  name="name"
                                  value={filter.name}
                                  placeholder="Tên vùng"
                                  type="text"
                                  autoFocus={true}
                                  onChange={(event) => this.handleChangeFilter(event)}
                                />
                              </div>
                            </div>
                            <div className="mg-btn">
                              <label
                                className="form-control-label"
                              >&nbsp;</label>
                              <Button
                                style={{ margin: 0 }}
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
                        moduleTitle={isShowForEdit ? 'Sửa loại vùng sản xuất' : 'Thêm loại vùng sản xuất'}
                        moduleBody={
                          <InsertOrUpdate
                            id={editId}
                            errors={errorInserts}
                            onHandleChangeValue={this.onHandleChangeValue}
                            fieldType={fieldType} />

                        }
                        isShowForEdit={isShowForEdit}
                        handleModal={this.handleModal}
                        onConfirm={this.onConfirm}
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-typeZoneProperty" responsive>
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key} className="table-hover-css">
                                      <td className="table-scale-col table-user-col-1">{(key + 1) + ((currentPage - 1) * 10)}</td>
                                      <td className='table-scale-col' style={{ textAlign: 'center' }} >
                                        {item.icon !== null ? (<>
                                          <img className="css-icon-type-zone-property" src={item.icon} />
                                        </>) : (<>
                                          <img className="css-icon-type-zone-property" src={NoImg} />
                                        </>)
                                        }
                                      </td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                        <span><strong style={item.color ? { color: item.color } : { color: '#000' }}>{item.name}</strong></span><br />
                                        {JSON.parse(item.attributes).map((item1, key1) => (
                                          <span key={key1}>{(key1 + 1) + '. ' + item1.name}<br /></span>
                                        ))}

                                      </td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.productTypeName}</td>
                                      <td>
                                        {isDisableEdit == true && isDisableDelete == true ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              {isDisableEdit == false ? (
                                                <DropdownItem
                                                  onClick={this.onEditZone(item.id)}
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
                                                  onClick={this.onDeleteZone(item.id)}
                                                >
                                                  Xoá
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
                          </tbody>
                        </Table>
                      </Card>

                      {/* Pagination */}
                      {
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
                      }
                    </div>
                  </Row>
                )
              }

              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>
            <WarningPopup
              moduleTitle='Thông báo'
              moduleBody={
                <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  Bạn đồng ý xóa thông tin này?
                </p>}
              warningPopupModal={warningPopupModal}
              toggleModal={this.toggleModalPopupDelete}
              handleWarning={this.handleDeleteRow}
            />
            <CreateNewPopup
              createNewModal={createNewModal}
              moduleTitle='Thêm loại vùng sản xuất'
              type100={true}
              moduleBody={
                <InsertOrUpdate
                  id={editId}
                  errors={errorInserts}
                  onHandleChangeValue={this.onHandleChangeValue}
                />}
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              onConfirm={(data, close) => {
                this.onConfirm(data, close);
              }}
            />
            <PopupMessage
              popupMessage={popupMessage}
              moduleTitle={'Thông báo'}
              moduleBody={messageErr}
              toggleModal={this.toggleModal}
            />
            <ToastContainer
              position="top-center"
              autoClose={3000}
            />
          </div>
        }
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    zone: state.ZoneStore,
    location: state.LocationStore,
    typeZone: state.TypeZonePropertyStore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionZoneCreators, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch),
    ...bindActionCreators(areaDataAction, dispatch),
    ...bindActionCreators(typeZonePropertyAction, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(TypeZoneProperty);
