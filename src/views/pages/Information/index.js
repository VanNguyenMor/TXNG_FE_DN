import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { INFORMATION_LIST_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionInformation } from "../../../actions/InformationActions";
import { actionMaterialGroup } from "../../../actions/MaterialGroupActions";
import { actionField } from "../../../actions/FieldActions.js";
import classes from './index.module.css';
import { handleGenTree } from "../../../helpers/trees";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import MenuButton from "../../../assets/img/buttons/menu.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTableBN from "components/HeaderTableBN";
import SelectTree from "components/SelectTree";
import HeadTitleTable from "components/HeadTitleTable";
import UpdatePopupSizeXL from "../../../components/UpdatePopupSizeXL";
import WarningPopup from "../../../components/WarningPopup";
import CreateNewPopupBN from "../../../components/CreateNewPopupBN";
import SearchModal from "./SearchModal";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";
import './information.css';
import { DATA_TYPE_LIST } from "../../../helpers/constant";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// reactstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      field: [],
      materialGroup: [],
      fieldAll: [],
      dataAll: [],
      currentRow: [],
      errorInsert: {},
      errorUpdate: {},
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      openAddNew: false,
      message: '',
      history: [],
      headerTitle: INFORMATION_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      selected: [],
      newData: [],
      fetching: false,
      fetchingUpdate: false,
      fetchingDelete: false,
      activeCreateSubmit: false,
      deleteItem: null,
      updateModal: false,
      warningPopupModal: false,
      currentFilter: null,
      collapseList: [],
      delmessage: '',
      filter: {
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      fields: [],
      fieldName: ''
    };

    this.localData = null;
  }

  componentWillReceiveProps(nextProp) {
    const { fetching, fetchingUpdate, fetchingDelete, limit, currentFilter } = this.state;
    let { data } = nextProp.information;
    let datamaterialGroup = nextProp.materialGroup.data;
    let newData = [];
    let fieldData = nextProp.field.data;
    let fieldDataParent = [];
    let collapseList = [];
    let haveRoot = false;
    let haveDataRoot = false;

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

    if (datamaterialGroup !== this.state.materialGroup) {
      if (typeof (datamaterialGroup.list) !== 'undefined') {
        if (datamaterialGroup.list !== null) {
          this.setState({
            materialGroup: datamaterialGroup.list.materialGroups,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          })
        } else {
          this.setState({
            materialGroup: [],
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          })
        }
      }
      // if (typeof (datamaterialGroup) !== 'undefined') {
      //   if (datamaterialGroup.field !== null) {
      //     if (typeof (datamaterialGroup.field) !== 'undefined') {

      //     }
      //   }
      // }
    }

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.information) !== 'undefined') {
          if (data.information !== null) {
            if (typeof (data.information.accesses) !== 'undefined') {

              newData = data.information.accesses;

              newData.map(item => (
                collapseList.push({ id: item.id, collapse: false })
              ));

              newData.map((item, key) => {
                item['parentID'] = item.informID === null ? '' : item.informID;

              });

              newData = handleGenTree(data.information.accesses, 'name');
              newData.map((item, key) => {
                item['index'] = key + 1;
              });

              this.setState({ data: [] });
              this.setState({
                data: newData,
                history: newData,
                dataAll: data.information.accesses,
                selected: data.information.accesses,
                collapseList: collapseList,
                listLength: newData.length,
                totalPage: Math.ceil(newData.length / limit),
                totalElement: Math.min(limit, newData.length),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: newData,
                history: newData,
                dataAll: data.information.accesses,
                selected: data.information.accesses,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.newinfo) !== 'undefined') {
          if (data.newinfo !== null) {
            if (data.status) {
              newData = this.state.history;
              newData = newData.filter(item => item.id === data.newinfo.id);

              this.setState({
                data: newData,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: [],
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
          // else {
          //   this.setState({
          //     data: [],
          //     isLoaded: false,
          //     status: data.status,
          //     message: PLEASE_CHECK_CONNECT(data.message)
          //   });
          // }
        }

        if (typeof (data.detail) !== 'undefined') {
          if (data.detail !== null) {
            if (data.status) {
              this.setState({
                detail: data.detail,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                detail: [],
                isLoaded: false,
                status: data.status, message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.create) !== 'undefined') {
          if (data.create !== null) {
            if (!fetching) {
              /* Fetch Summary */
              this.setState({ data: [] });
              this.fetchSummary(JSON.stringify({
                "search": "",
                "filter": this.state.newData.fieldID ? this.state.newData.fieldID : currentFilter,
                "orderBy": "",
                "page": null,
                "limit": null
              }));
              this.setState({ fetching: true });
            }

            this.setState({
              create: data.create,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }

        if (typeof (data.update) !== 'undefined') {

          if (!fetching) {
            setTimeout(() => {
              /* Fetch Summary */
              this.setState({ data: [] });
              this.fetchSummary(JSON.stringify({
                "search": "",
                "filter": this.state.newData.fieldID ? this.state.newData.fieldID : currentFilter,
                "orderBy": "",
                "page": null,
                "limit": null
              }));
              this.setState({ fetching: true });
            }, 1000);
          }

          this.setState({
            update: data.update,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });

        }

        if (typeof (data.delete) !== 'undefined') {
          if (!fetching && data.status == true) {
            setTimeout(() => {
              /* Fetch Summary */
              this.setState({ data: [] });
              this.fetchSummary(JSON.stringify({
                "search": "",
                "filter": currentFilter,
                "orderBy": "",
                "page": null,
                "limit": null
              }));
              this.setState({ fetching: true });
            }, 1000);
          }

          if (data.status != true) {
            this.setState({ delmessage: PLEASE_CHECK_CONNECT(data.message) })
            this.toggleModal('popupMessage');
          }
          this.setState({
            delete: data.delete,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        }
      }
    }
  }

  componentDidMount() {
    const { requestFieldStore } = this.props;
    const { requestListLogMaterialGroup } = this.props;


    /* Fetch Summary */
    requestListLogMaterialGroup(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));

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
    });

    this.getFieldHaveAccessStore();
  }

  componentDidUpdate() {

    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestInformationStore } = this.props;

    requestInformationStore(data);
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

  closeStatusModal = () => {
    const { status, fetching } = this.state;

    if (status || !status && fetching) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
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

  clearDay = () => {
    this.setState({ data: [] })
  }

  renderTreeLine = (nodelv) => {
    let line = '';

    for (let i = 0; i < nodelv; i++) {
      line += '-';
    }

    return line;
  }

  renderTable = (data, isDisableEdit, isDisableDelete) => {
    const { beginItem, endItem, field, collapseList, currentFilter, fieldAll } = this.state;
    let list = [];
    let parentid = [];
    let autoIndex = 0;
    let childLine = '-';
    let dataMapth = [];
    let fieldName = fieldAll.filter(item => item.id == currentFilter)

    data.filter((item, key) => key >= beginItem && key < endItem);
    data.forEach(e => parentid.push(e.id));
    if (currentFilter) {
      dataMapth = data.filter((item) => (item.fieldName.trim().toUpperCase() == fieldName[0].fieldName.trim().toUpperCase()))
    }

    const cb = (e, key, array, isParent) => {

      DATA_TYPE_LIST.filter(x => x.dataType.toString() == e.dataType).map(x => e.dataType = x.name)

      const renderClass = !e.dataType ? (
        `${classes.treeParent} background-color-treeParent `
      ) : (
        `${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
      );

      list.push(
        // <tr
        //   key={autoIndex}
        //   className="table-hover-css"
        // >
        //   <td className={`table-scale-col table-user-col-1 ${renderClass}`}></td>
        //   <td style={{ textAlign: 'left' }} className={renderClass}>{e.name}</td>
        //   <td></td>
        //   <td></td>
        //   <td></td>
        //   <td></td>
        // </tr>
        <tr
          key={autoIndex}
          parentid={e.informID}
          currentid={e.id}
          index={autoIndex}
          className="table-hover-css"
        >
          <td className={`table-scale-col table-user-col-1 ${renderClass}`}>{isParent ? '' : (key + 1)}</td>
          <td style={{ textAlign: 'left' }} className={renderClass}>
            <span>{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}</span>
            <span>{e.name}</span>
          </td>
          <td className={`${renderClass} color-text-infor`}>{e.sortOrder}</td>
          <td className={`${renderClass} color-text-infor`}>{e.dataType}</td>
          <td className={`${renderClass} color-text-infor`}>
            {e.dataType == '' ||
              e.dataType == null ? null : (
              <input type="checkbox" disabled checked={e.isRequired} />
            )}
          </td>
          <td className={`${renderClass} color-text-infor`}>

            {
              collapseList.filter(item => item.id === e.id)
                .map(ele => (
                  <div>
                    {e.dataType == '' ||
                      e.dataType == null ||
                      (isDisableEdit == true && isDisableDelete == true)
                      ? null : (
                        <ButtonDropdown isOpen={ele.collapse} toggle={() => this.toggle(key, e.id)}>
                          <DropdownToggle>
                            <img src={MenuButton} />
                          </DropdownToggle>

                          <DropdownMenu>
                            {isDisableEdit == true ? null : (
                              <DropdownItem
                                onClick={() => {
                                  this.toggleModal('updateModal');
                                  this.setState({ currentRow: e })
                                  this.handleOpenEdit(e);
                                }}
                              >
                                Sửa
                              </DropdownItem>
                            )}
                            {isDisableEdit == true || isDisableDelete == true ? null : (
                              <DropdownItem divider />
                            )}
                            {isDisableDelete == true ? null : (
                              <DropdownItem
                                onClick={() => {
                                  this.toggleModal('warningPopupModal');
                                  this.setState({ deleteItem: e.id });
                                }}
                              >
                                Xoá
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </ButtonDropdown>
                      )}
                  </div>

                )
                )
            }

          </td>

        </tr>
      );
      // this.setState(previousState => {
      //   return {
      //     ...previousState,
      //     autoIndex
      //   }
      // })
      autoIndex++;
      e.children && e.children.forEach((e, key, array) => cb(e, key, array, false));

    }

    dataMapth.forEach((e, key, array) => cb(e, key, array, true));
    return list;
  }

  handleSelect = (value, name) => {
    this.setState({ currentFilter: value });

    this.fetchSummary(JSON.stringify({
      "search": "",
      "filter": value == "" ? "" : value,
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }

  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  handleChangeSelectFilter = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  }

  handleSubmitSearchForm = () => {
    let { filter } = this.state;

    this.fetchSummary(JSON.stringify(filter));
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleNewDataAddNew = (data, dataAllFromAddNew) => {
    if (data) {
      this.setState({
        newData: {
          data
        }
      })
    }

    this.setState({ newData: data, dataAllFromAddNew });
  }
  handleNewDataUpdate = (data, dataAllFromUpdate) => {


    this.setState({ newData: data, dataAllFromUpdate });
  }


  renderCreateModal = () => {
    const { data, field, errorInsert, materialGroup, currentFilter, fieldAll, newDataN } = this.state;

    return (
      <AddNewModal
        newDataN={newDataN ? newDataN : null}
        field={field}
        fieldAll={fieldAll}
        data={data}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewDataAddNew}
        errorInsert={errorInsert}
        currentFilter={currentFilter}
        datamaterialGroup={materialGroup}
        localData={this.localData}
      />
    );
  }

  handleCreateInfoData = (value, closeForm, closePopup) => {
    this.localData = null;

    if (closePopup != 'closePopup') {
      this.localData = { ...value };
    }

    const { createInformation } = this.props;
    let { dataAll, dataAllFromAddNew, newData } = this.state;

    const errorInsert = {};
    let newDataN = {
      dataType: parseInt(value.dataType),
      fieldID: value.fieldID,
      id: value.id,
      //materialGroupID: newData.materialGroupID,
      name: value.infoname,
      informID: value.informID,
      isRequired: value.isRequired,
      reference: parseInt(value.reference),
      isHarvest: value.isHarvest,
      sortOrder: value.sortOrder
    };

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });

    // let selectData = {
    //   dataType: value.dataType ? value.dataType :
    // }

    if (!newDataN.fieldID) {
      errorInsert['fieldID'] = 'Chưa chọn ngành nghề';
    }

    if (!newDataN.dataType) {
      errorInsert['dataType'] = 'Chưa chọn kiểu dữ liệu';
    }

    // if (newDataN.reference == 40) {
    //   if (!newDataN.materialGroupID) {
    //     errorInsert['materialGroupID'] = 'Chưa chọn danh sách nguyên vật liệu ';
    //   }
    // }

    if (!newDataN.name) {
      errorInsert['infoname'] = 'Tên kê khai không được bỏ trống';
    }

    if ((newDataN.name || '').length > 255) {
      errorInsert['infoname'] = 'Nhập tối đa 255 ký tự';
    }
    if (!newDataN.informID) {
      errorInsert['informID'] = 'Chưa chọn thuộc truy xuất';
    }
    let dataFilter = []
    if (newDataN.informID) {
      dataAllFromAddNew.filter(x => x.id == newDataN.informID).map(
        item => {
          dataFilter.push(item)
        }
      )
      if (dataFilter != []) {
        if (dataFilter[0].parentID == "") {
          dataAllFromAddNew.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        } else {
          dataAllFromAddNew.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        }
      }
    } else {
      dataAllFromAddNew.filter(x => x.fieldParentID == x.fieldParentID && x.parentID == "").map(
        item => {
          dataFilter.push(item)
        }
      )
    }

    if (newDataN.name) {
      let flag = false;
      if (dataFilter) {
        dataFilter.filter(item => item.name.trim().toUpperCase() === newDataN.name.trim().toUpperCase())
          .map(item => flag = true);
      }
      if (flag == true) {
        errorInsert['infoname'] = 'Tên dữ liệu kê khai này đã có';
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
    //newData['reference'] = "";

    // Add new Information
    createInformation(JSON.stringify(newDataN)).then(response => {
      if (response.data.status == 200) {
        // newData.dataType = "";
        // newData.fieldID = "";
        // newData.id = "";
        // newData.materialGroupID = null;
        // newData.infoname = "";
        // newData.informID = "";
        // newData.isRequired = true;
        // newData.reference = null;
        // newData.isHarvest = "";
        // newData.sortOrder = "";
        // this.setState({ newData })

        if (closePopup != 'closePopup') {
          this.setState(previousState => {
            return {
              ...previousState,
              newDataN
            }
          });
          this.toggleModal('createNewModal');
        }

      } else {
        this.setState({ cremessage: PLEASE_CHECK_CONNECT(response.data.message) })
        this.toggleModal('popupMessage');
      }
    })
    // Fetching
    this.setState({ fetching: false, status: null, isLoaded: true });
  }
  toggleModal = (state, type) => {

    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        newData: {},
        newDataN: null
      });

    }
    if (state == 'createNewModal') {
      this.setState({
        [state]: true,
        detail: null,
        errorUpdate: {},
        newData: {},
        newDataN: null
      });
      if (type == 100) {
        this.setState({
          [state]: !this.state[state],
          detail: null,
          errorUpdate: {},
          newData: {},
          newDataN: null
        });
      }
    }
  };

  // handleOpenEdit = (id) => {
  //   const { detailInformationByID } = this.props;
  //   console.log(id)
  //   detailInformationByID(id);
  // }

  handleUpdateInfoData = (value) => {

    const { dataAll, currentRow, dataAllFromUpdate } = this.state;
    const { updateInformation } = this.props;
    let newData = {
      dataType: parseInt(value.dataType),
      fieldID: value.fieldID,
      id: value.id,
      // materialGroupID: value.materialGroupID,
      name: value.infoname,
      informID: value.informID,
      isRequired: value.isRequired,
      reference: parseInt(value.reference),
      isHarvest: value.isHarvest,
      sortOrder: value.sortOrder
    };

    const errorUpdate = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });


    let dataFilter = []

    if (newData.informID) {
      dataAllFromUpdate.filter(x => x.id == newData.informID).map(
        item => {
          dataFilter.push(item)
        }
      )
      if (dataFilter != []) {
        if (dataFilter[0].parentID == "") {
          dataAllFromUpdate.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        } else {
          dataAllFromUpdate.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
            item => {
              dataFilter.push(item)
            }
          )
        }
      }
    } else {
      dataAllFromUpdate.filter(x => x.fieldParentID == x.fieldParentID && x.parentID == "").map(
        item => {
          dataFilter.push(item)
        }
      )

    }

    if (!newData.informID) {
      errorUpdate['informID'] = 'Chưa chọn thuộc truy xuất';
    }

    if (!newData.fieldID) {
      errorUpdate['fieldID'] = 'Chưa chọn ngành nghề';
    }

    // if (newData.reference == 40) {
    //   if (!newData.materialGroupID) {
    //     errorUpdate['materialGroupID'] = 'Chưa chọn danh sách nguyên vật liệu ';
    //   }
    // }

    if (!newData.dataType) {
      errorUpdate['dataType'] = 'Chưa chọn kiểu dữ liệu';
    }

    if (!newData.name) {
      errorUpdate['infoname'] = 'Tên kê khai không được bỏ trống';
    }

    if ((newData.name || '').length > 255) {
      errorUpdate['infoname'] = 'Nhập tối đa 255 ký tự';
    }

    let flag = false;
    if (newData.name) {
      if (newData.name.trim().toUpperCase().indexOf(currentRow.name.trim().toUpperCase()) === -1) {
        dataFilter.filter(item => item.name.trim().toUpperCase() === newData.name.trim().toUpperCase())
          .map(item => flag = true);
      } else {
        flag = false;
      }
      if (flag == true) {
        errorUpdate['infoname'] = 'Tên dữ liệu kê khai này đã có';
      }
    }

    if (Object.keys(errorUpdate).length > 0) {

      this.setState(previousState => {
        return {
          ...previousState,
          errorUpdate,
        }
      });

      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate: {},
        detail: null,
        updateModal: false
      }
    });

    updateInformation(JSON.stringify(newData));
    this.setState({ fetching: false, status: null, isLoaded: false });
  }

  handleDeleteRow = () => {
    const { deleteInformation } = this.props;
    let { deleteItem } = this.state;

    this.setState({ fetching: false, status: null, isLoaded: false });
    deleteInformation(deleteItem).then(res => {
      if (res.data.status == 200) {
        toast.success("Xoá kê khai thành công!")
      }
    });
  }

  closeForm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {},
        newData: []
        //errorUpdate: {},
      }
    });

    this.setState({ newData: [] });
  }

  handleOpenEdit = (value) => {
    const { data, detail } = this.state;
    const { detailInformationByID } = this.props;
    detailInformationByID(value.id);
    this.setState({ detail: detail, newDetail: value });
  }

  toggle = (el, val) => {
    let { collapseList } = this.state;

    collapseList.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ collapseList });
  }

  onChangeSelect = name => value => {
    if (name == 'fieldID') {
      if (value != null) {
        let fieldName = '';

        const field = this.state.fields.find(p => p.id == value);

        if (field) {
          fieldName = field.fieldName;
        }

        this.setState(previousState => {
          return {
            ...previousState,
            currentFilter: value,
            fieldName
          }
        });

        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": value == "" ? "" : value,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
      }
    }
  }

  render() {
    const {
      status,
      headerTitle,
      data,
      detail,
      field,
      filter,
      message,
      isLoaded,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      currentFilter,
      activeCreateSubmit,
      errorUpdate,
      materialGroup,
      newData,
      fieldAll,
      updateModal,
      delmessage,
      popupMessage,
      warningPopupModal,
      createNewModal,
      cremessage,
      fields,
      fieldName,
      autoIndex
    } = this.state;
    const statusPopup = { status: status, message: message };
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

      ACCOUNT_CLAIM_FF.filter(x => x == "Informations.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Informations.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Informations.Delete").map(y => isDisableDelete = false)
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
                      <HeaderTableBN
                        dataReload={() => {
                          this.fetchSummary(
                            JSON.stringify({
                              "search": "",
                              "filter": currentFilter,
                              "orderBy": "",
                              "page": null,
                              "limit": null
                            })
                          )
                        }
                        }
                        hideSearch={true}
                        hideCreate={isDisableAdd == false ? false : true}
                        searchForm={
                          <SearchModal
                            field={field}
                            filter={filter}
                            handleChangeFilter={this.handleChangeFilter}
                            handleChangeSelectFilter={this.handleChangeSelectFilter}
                          />
                        }
                        typeSearch={
                          <>
                            <div className="w_input">
                              <label className="form-control-label">
                                Ngành nghề
                              </label>
                              <div>
                                <Select
                                  //hidenTitle={true}
                                  name="parentID"
                                  title='Chọn ngành nghề'
                                  data={fields}
                                  // dataAll={fields}
                                  // disableParent={true}
                                  labelMark={fieldName}
                                  selected={currentFilter}
                                  labelName='fieldName'
                                  fieldName='fieldName'
                                  val='id'
                                  // handleChange={this.handleSelect}
                                  handleChange={this.onChangeSelect('fieldID')}
                                />
                              </div>
                            </div>
                          </>
                        }
                        // customComponent={
                        //   <div className={classes.filterArea}>
                        //     <label className="form-control-label">
                        //       Ngành nghề
                        //     </label>
                        //     <SelectTree

                        //       //hidenTitle={true}
                        //       name="parentID"
                        //       title='Chọn ngành nghề'
                        //       data={fields}
                        //       // dataAll={fields}
                        //       // disableParent={true}
                        //       labelMark={fieldName}
                        //       selected={currentFilter}
                        //       labelName='fieldName'
                        //       fieldName='fieldName'
                        //       val='id'
                        //       // handleChange={this.handleSelect}
                        //       handleChange={this.onChangeSelect('fieldID')}
                        //     />
                        //   </div>
                        // }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        moduleTitle='Thêm kê khai'
                        moduleBody={this.renderCreateModal()}
                        activeSubmit={activeCreateSubmit}
                        newData={newData}
                        handleCreateInfoData={this.handleCreateInfoData}
                        isPreventForm={true}
                        closeForm={this.closeForm}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-information" responsive>
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                this.renderTable(data, isDisableEdit, isDisableDelete)
                              )
                            }
                          </tbody>
                        </Table>
                      </Card>

                      {/* Pagination */}
                      {
                        // Page of Table
                        // data.length > 0 && (
                        //     <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick}/>
                        //   )
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

              <CreateNewPopupBN
                // dataSortOrder={data}
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle='Thêm kê khai'
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

              {
                detail !== null && (
                  <UpdatePopupSizeXL
                    moduleTitle='Cập nhật kê khai'
                    moduleBody={
                      <UpdateModal
                        field={field}
                        datamaterialGroup={materialGroup}
                        data={detail}
                        currentFilter={currentFilter}
                        fieldAll={fieldAll}
                        informData={data}
                        errorUpdate={errorUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewDataUpdate}
                        handleNewDetail={this.handleNewDetail}
                      />}
                    newData={newData}
                    updateModal={updateModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.handleUpdateInfoData}
                  />
                )
              }

              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
              />

              {delmessage ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={delmessage}
                  toggleModal={this.toggleModal}
                />
              ) : null}
              {cremessage ? (
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={cremessage}
                  toggleModal={this.toggleModal}
                />
              ) : null}
              <ToastContainer
                position="top-center"
                autoClose={3000}
              />
            </Container>
          </div>
        }
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    information: state.InformationStore,
    field: state.FieldStore,
    materialGroup: state.MaterialGroupStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionInformation, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionMaterialGroup, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Information);
