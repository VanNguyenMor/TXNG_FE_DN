import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { actionCompanyListRegistered } from "../../../actions/CompanyListRegisteredActions";
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import Select1 from "components/Select";
import '../../../assets/css/page/config_system.css';
import ButtonSave from "../../../assets/img/buttons/btnLuuLocBui.png";
import ButtomAdd from "../../../assets/img/buttons/btnThemMoiLocBui.png";
import ButtonEdit from "../../../assets/img/buttons/edit.svg";
import ButtonDelete from "../../../assets/img/buttons/delete.png";
import InsertOrUpdate from './InsertOrUpdate';
import Loading from '../../../components/loading';
import { getErrorMessageServer } from 'utils/errorMessageServer';
import Message, { TYPES } from '../../../components/message';
import { validEmail } from 'bases/helper';
import { validPhone } from 'bases/helper';
import { numberWithCommas, replaceCommaDot } from 'bases/helper';
import { validExtensionFileImage } from 'bases/helper';
import { validSize } from 'bases/helper';
import { MAX_FILE_IMAGE_SIZE } from 'bases/helper';
import { EXTENSION_FILE_IMAGE } from 'bases/helper';
import classes from './index.module.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import moment from 'moment';
import PlusImg from "../../../assets/img/buttons/plus.svg";
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import Select from 'react-select';
import { defaultTheme } from 'react-select';
import SelectSearch, { fuzzySearch } from "react-select-search";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import './select-search.css';
import { STAMPTEMPLATE, ALERT, STAMP_PRICE_HEADER } from "../../../helpers/constant";
import HeadTitleTable from "components/HeadTitleTable";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import Pagination from "components/Pagination";
import UpdatePopup from "../../../components/UpdatePopup";
import UpdateModal from "./UpdateModal";
import HeaderTable from "components/HeaderTable";
import AddNewStampPrice from './AddNewStampPrice';
import CreateNewPopup from "../../../components/CreateNewPopup";
import AddNewModal from "./AddNewModal";
import InsertOrUpdateAlert from "./InsertOrUpdateAlert";
import WarningPopup from "../../../components/WarningPopup";
import WarningPopupDel from "../../../components/WarningPopupDel";
import observable from "../../../components/Toastify";
import axios from "axios";
import { CONFIG_UPDATE_IMG } from "../../../apis";
import PopupMessage from "../../../components/PopupMessage";
import eye from "../../../assets/img/icons/common/eye.png";
import eyeOff from "../../../assets/img/icons/common/eye-off.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup
} from "reactstrap";

const { colors } = defaultTheme;

const selectStyles = {
  control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

class ConfigSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0,
      isInsertOrUpdate: false,
      updateId: null,
      dataServer: null,
      dataCompany: null,
      companyId: null,
      headerTitle: STAMPTEMPLATE,
      headerTitleAlert: ALERT,
      headerStampPrice: STAMP_PRICE_HEADER,
      limit: 3,
      beginItem: 0,
      endItem: 3,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      stampPriceDetail: [],
      limitAlert: 10,
      limitStampPrice: 10,
      beginItemAlert: 0,
      beginItemStampPrice: 0,
      endItemAlert: 10,
      endItemStampPrice: 10,
      totalElementAlert: 0,
      totalElementStampPrice: 0,
      listLengthAlert: 0,
      listLengthStampPrice: 0,
      currentPageAlert: 0,
      currentPageStampPrice: 0,
      insertStampPrice: {},
      idStampPrice: null,
      infoCompany: {
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        provinceId1: '',
        districtId: '',
        wardId: '',
        taxCode: '',
        logoFile: '',
        provinceName: '',
        districtName: '',
        wardName: '',
        logo: ''
      },
      dataProvider: {},
      dataDistrict: {},
      dataWard: {},
      errorUpdate: {},
      errorInsert: {},
      errorInserts: {},
      dataStamp: [],
      dataStampPrice: [],
      configSetting: {
        price: 0,
        email: '',
        phoneNumber: '',
        contentEmailRegister: '',
        contentEmailChangePassword: '',
        contentSMSRegister: '',
        contentSMSChangePassword: '',
        attachments: '',
        attachmentStamps: '',
      },
      errorsInfoCompany: {},
      errorsConfigSystem: {},
      isOpen: false,
      valueDr: null,
      options: [],
      isShowForEdit: false,

    }

    this.refEditorContentSendEmailRegisterUsage = null;
    this.refEditorContentSendEmailChangePassword = null;
    this.refInputFileCompanyLogo = null;
    this.refcontentEmailSendToPrinter = null;
    this.refcontentEmailRegister = null;
    this.refAttachmentUsed = null;
    this.refAttachments = null;
    this.refAttachmentStamps = null;
    this.redSelect = null;
  }

  componentDidMount() {
    this.getInfoCompany();
  }

  onChooseTab = tab => () => {

    this.setState(previousState => {
      return {
        ...previousState,
        currentTab: tab,
        errorsConfigSystem: {},
        errorsInfoCompany: {}
      }
    }, () => {
      if (tab == 0) {
        this.getInfoCompany();
      } else if (tab == 1) {
        this.getConfigSystem().then(res => {

        });
      } else if (tab == 2) {
        this.getListConfigServer();
      } else if (tab == 3) {
        this.getListStampTemplate();
      } else if (tab == 4) {
        this.getListAlert();
      } else if (tab === 5) {
        this.getAllStampPrice();
      }
    });
  }

  getListAlert = () => {
    const { getListAlertRoles } = this.props;
    const { limitAlert } = this.state;
    getListAlertRoles(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (res.data.status == 200) {
        res.data.data.listAlertRoles.map((item, key) => {
          item['collapse'] = false;
          item['index'] = key + 1;
        })
        let totalElementAlert = 0;
        if (res.data.data.listAlertRoles.length > limitAlert) {
          totalElementAlert = limitAlert;
        } else {
          totalElementAlert = res.data.data.listAlertRoles.length;
        }
        this.setState({
          totalElementAlert,
          dataAlert: res.data.data.listAlertRoles,
          listLengthAlert: res.data.data.listAlertRoles.length,
          totalPageAlert: Math.ceil(res.data.data.listAlertRoles.length / this.state.limitAlert),
        })
      }
    })
  }

  getListStampTemplate = () => {
    const { requestListStampPlate } = this.props;
    const { limit } = this.state;
    requestListStampPlate(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      if (res.data.status == 200) {
        res.data.data.stamps.map((item, key) => {
          item['collapse'] = false;
          item['index'] = key + 1;
        })
        let totalElement = 0;
        if (res.data.data.stamps.length > limit) {
          totalElement = limit;
        } else {
          totalElement = res.data.data.stamps.length;
        }
        this.setState({
          totalElement,
          dataStampAll: res.data.data.stamps,
          dataStamp: res.data.data.stamps,
          listLength: res.data.data.stamps.length,
          totalPage: Math.ceil(res.data.data.stamps.length / this.state.limit),
        })
      }
    })
  }

  getAllStampPrice = () => {
    const { getAllStampPrice } = this.props;
    const { limitStampPrice } = this.state;
    getAllStampPrice(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {
      // console.log(res);
      if (res.data.status === 200) {
        res.data.data.stampPrice.map((item, key) => {
          item['collapse'] = false;
          item['index'] = key + 1;
        })
        let totalElementStampPrice = 0;
        if (res.data.data.stampPrice.length > limitStampPrice) {
          totalElementStampPrice = limitStampPrice;
        } else {
          totalElementStampPrice = res.data.data.stampPrice.length;
        }
        this.setState({
          totalElementStampPrice,
          dataStampPrice: res.data.data.stampPrice,
          listLengthStampPrice: res.data.data.stampPrice.length,
          totalPageStampPrice: Math.ceil(res.data.data.stampPrice.length / limitStampPrice)
        })
      }
    })
  }

  renderCreateModal = () => {
    const { errorInsert, currentFilter, dataInPopup } = this.state;

    return (
      <AddNewModal
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewDataAddNew}
        errorInsert={errorInsert}
      />
    );
  }

  handleOpenEdit = (id) => {

    this.setState({ idRow: id })
  }

  handleOpenEditAlert = (id) => {
    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: true,
        editId: id
      }
    });
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleCheckValidationAlert = (status) => {
    this.setState({ activeCreateSubmitAlert: status });
  }

  handleNewData = (data, file) => {
    this.setState({ newData: data, file: file });
  }

  handleNewDataAddNew = (data) => {
    this.setState({ newDataIn: data })
  }

  componentInsert = (value, closeForm, closePopup) => {
    let { newDataIn, dataStampAll, limit } = this.state;
    const { requestListCreatePlate, requestListStampPlate } = this.props;
    const errorInsert = {};
    const formData = new FormData();

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });

    let insertData = {}

    if (newDataIn) {
      insertData = {
        ID: newDataIn.ID,
        Name: newDataIn.Name,
        file: newDataIn.file
      }
    }

    if (!insertData.Name) {
      errorInsert['Name'] = 'Tên mẫu tem không được bỏ trống';
    }

    if (!insertData.file) {
      errorInsert['Template'] = 'Hình ảnh không được bỏ trống';
    }


    if (insertData.Name) {
      let flag = false;
      dataStampAll.filter(item => item.name === insertData.Name.trim())
        .map(item => flag = true);
      if (flag == true) {
        errorInsert['Name'] = 'Tên mẫu tem này đã có';
      }
    }

    if (Object.keys(errorInsert).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorInsert,
        }
      });

      return;
    }
    formData.append('ID', insertData.ID);
    formData.append('Name', insertData.Name);
    formData.append('file', insertData.file ? insertData.file : '');

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {},
      }
    });
    if (closeForm) {
      closeForm();
    }

    //this.handleCloseUN(true);
    requestListCreatePlate(formData).then(res => {
      if (res.data.status == 200) {
        requestListStampPlate(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        })).then(res => {
          if (res.data.status == 200) {
            res.data.data.stamps.map((item, key) => {
              item['collapse'] = false;
              item['index'] = key + 1;
            })
            let totalElement = 0;
            if (res.data.data.stamps.length > limit) {
              totalElement = limit;
            } else {
              totalElement = res.data.data.stamps.length;
            }
            this.setState({
              totalElement,
              dataStampAll: res.data.data.stamps,
              dataStamp: res.data.data.stamps,
              listLength: res.data.data.stamps.length,
              totalPage: Math.ceil(res.data.data.stamps.length / this.state.limit),
            })

          }
        })
        if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
      } else {
        this.setState({ messageErr: res.data.message })
        this.toggleModal('popupMessage')
      }
    })
  }

  onConfirmAlert = (toggleModal, closePopup) => {
    let { newDataInAlert, limitAlert, totalElementAlert } = this.state;
    const { createAlertRoles, getListAlertRoles } = this.props;
    const errorInsertAlert = {};
    let id = "";
    let roleID = "";
    let alertTypeIDs = [];
    if (newDataInAlert || newDataInAlert != {}) {
      id = (newDataInAlert || {}).id;
      roleID = (newDataInAlert || {}).roleID;
      alertTypeIDs = newDataInAlert ? (newDataInAlert.alertTypeIDs.length > 0 ? (newDataInAlert.alertTypeIDs).split(',').filter(p => (p != "")) : []) : [];
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsertAlert
      }
    });

    if (!roleID) {
      errorInsertAlert['roleID'] = 'Chưa chọn nhóm người dùng';
    }

    if (alertTypeIDs.length <= 0) {
      errorInsertAlert['alertTypeIDs'] = 'Chưa chọn loại thông báo';
    }

    if (Object.keys(errorInsertAlert).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorInsertAlert,
        }
      });

      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsertAlert: {},
      }
    });
    if (id) {
      createAlertRoles(JSON.stringify({
        id: id,
        roleID: roleID,
        alertTypeIDs: alertTypeIDs
      })).then(res => {
        if (res.data.status == 200) {
          this.setState({
            newDataInAlert: {
              id: '',
              roleID: '',
              alertTypeIDs: []
            }
          })
          getListAlertRoles(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })).then(res => {
            if (res.data.status == 200) {
              let totalElementAlert = 0;
              if (res.data.data.listAlertRoles.length > limitAlert) {
                totalElementAlert = limitAlert;
              } else {
                totalElementAlert = res.data.data.listAlertRoles.length;
              }
              this.setState({
                totalElementAlert,
                dataAlert: res.data.data.listAlertRoles,
                listLengthAlert: res.data.data.listAlertRoles.length,
                totalPageAlert: Math.ceil(res.data.data.listAlertRoles.length / this.state.limitAlert),
              })
            }
          })
          if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
        } else {
          this.setState({ messageErr: res.data.message })
          this.toggleModal('popupMessage')
        }
      })
    } else {
      createAlertRoles(JSON.stringify({
        roleID: roleID,
        alertTypeIDs: alertTypeIDs
      })).then(res => {
        if (res.data.status == 200) {
          this.setState({
            newDataInAlert: {}
          })
          getListAlertRoles(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }))
            .then(res => {
              if (res.data.status == 200) {
                let totalElementAlert = 0;
                if (res.data.data.listAlertRoles.length > limitAlert) {
                  totalElementAlert = limitAlert;
                } else {
                  totalElementAlert = res.data.data.listAlertRoles.length;
                }
                this.setState({
                  totalElementAlert,
                  dataAlert: res.data.data.listAlertRoles,
                  listLengthAlert: res.data.data.listAlertRoles.length,
                  totalPageAlert: Math.ceil(res.data.data.listAlertRoles.length / this.state.limitAlert),
                })
              }
            })
          if (toggleModal) {
            toggleModal();
          }
          if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
        } else {
          this.setState({ messageErr: res.data.message })
          this.toggleModal('popupMessage')
        }
      })
    }
  }

  componentUpdate = (value) => {

    let { newData, currentRow, dataStampAll, limit } = this.state;
    const { requestListUpdatePlate, requestListStampPlate } = this.props;
    const errorUpdate = {};
    const formData = new FormData();

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    const updateData = {
      ID: newData.ID,
      Name: newData.Name,
      Template: newData.Template,
      file: newData.file
    }

    if (!updateData.Name) {
      errorUpdate['Name'] = 'Tên mẫu tem không được bỏ trống';
    }

    if (!updateData.Template && !updateData.file) {
      errorUpdate['Template'] = 'Hình ảnh không được bỏ trống';
    }

    let flag = false;
    if (updateData.Name) {

      if (updateData.Name.trim().toUpperCase().indexOf(currentRow.name.trim().toUpperCase()) === -1) {
        dataStampAll.filter(item => item.name.trim().toUpperCase() === updateData.Name.trim().toUpperCase())
          .map(item => flag = true);
      } else {
        flag = false;
      }
      if (flag == true) {
        errorUpdate['Name'] = 'Tên mẫu tem này đã có';
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
    formData.append('ID', updateData.ID);
    formData.append('Name', updateData.Name);
    formData.append('Template', updateData.file ? '' : updateData.Template);
    formData.append('file', updateData.file ? updateData.file : '');

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate: {},
      }
    });


    //this.handleCloseUN(true);
    requestListUpdatePlate(formData).then(res => {
      if (res.data.status == 200) {
        this.toggleModal('updateModal');
        requestListStampPlate(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        })).then(res => {
          if (res.data.status == 200) {
            res.data.data.stamps.map((item, key) => {
              item['collapse'] = false;
            })
            let totalElement = 0;
            if (res.data.data.stamps.length > limit) {
              totalElement = limit;
            } else {
              totalElement = res.data.data.stamps.length;
            }
            this.setState({
              totalElement,
              dataStampAll: res.data.data.stamps,
              dataStamp: res.data.data.stamps,
              listLength: res.data.data.stamps.length,
              totalPage: Math.ceil(res.data.data.stamps.length / this.state.limit),
            })
          }
        })
      }
    })
  }

  handleDeleteRow = () => {
    const { requestDeletetStampPlate, requestListStampPlate } = this.props;
    let { deleteItem, limit } = this.state;
    requestDeletetStampPlate(deleteItem)
      .then(res => {
        if (res.data.status == 200) {
          requestListStampPlate(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })).then(res => {
            if (res.data.status == 200) {
              res.data.data.stamps.map((item, key) => {
                item['collapse'] = false;
              })
              let totalElement = 0;
              if (res.data.data.stamps.length > limit) {
                totalElement = limit;
              } else {
                totalElement = res.data.data.stamps.length;
              }
              this.setState({
                totalElement,
                dataStampAll: res.data.data.stamps,
                dataStamp: res.data.data.stamps,
                listLength: res.data.data.stamps.length,
                totalPage: Math.ceil(res.data.data.stamps.length / this.state.limit),
              });
              toast.success("Xoá mẫu tem thành công!");
            }
          })
        }
      }
      )

  }
  toggleModalPopupDelete = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        warningPopupDelStamp: false
      }
    });
  }
  handleDeleteStampPrice = () => {
    const { deleteStampPrice, getAllStampPrice } = this.props;
    let { deleteItemStampPrice, limitStampPrice } = this.state;
    console.log(deleteItemStampPrice);
    deleteStampPrice(deleteItemStampPrice)
      .then(res => {
        this.setState(previousState => {
          return {
            ...previousState,
            warningPopupDelStamp: false
          }
        })
        if (res.data.status == 200) {
          getAllStampPrice(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }))
            .then(res => {

              if (res.data.status === 200) {
                res.data.data.stampPrice.map((item, key) => {
                  item['collapse'] = false;
                  item['index'] = key + 1;
                })
                let totalElementStampPrice = 0;
                if (res.data.data.stampPrice.length > limitStampPrice) {
                  totalElementStampPrice = limitStampPrice;
                } else {
                  totalElementStampPrice = res.data.data.stampPrice.length;
                }
                this.setState({
                  totalElementStampPrice,
                  dataStampPrice: res.data.data.stampPrice,
                  listLengthStampPrice: res.data.data.stampPrice.length,
                  totalPageStampPrice: Math.ceil(res.data.data.stampPrice.length / limitStampPrice)
                });
                toast.success("Xoá bảng giá tem thành công!");
              }
            })
        }
        else {
          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message });
          this.toggleModal('popupMessage')
        }
      }
      )

  }


  handleDeleteRowAlert = () => {
    const { deleteAlertRoles, getListAlertRoles } = this.props;
    let { deleteItemAlert, limitAlert } = this.state;

    deleteAlertRoles(deleteItemAlert)
      .then(res => {
        if (res.data.status == 200) {
          getListAlertRoles(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })).then(res => {
            if (res.data.status == 200) {
              let totalElementAlert = 0;
              if (res.data.data.listAlertRoles.length > limitAlert) {
                totalElementAlert = limitAlert;
              } else {
                totalElementAlert = res.data.data.listAlertRoles.length;
              }
              this.setState({
                totalElementAlert,
                dataAlert: res.data.data.listAlertRoles,
                listLengthAlert: res.data.data.listAlertRoles.length,
                totalPageAlert: Math.ceil(res.data.data.listAlertRoles.length / this.state.limitAlert),
              });
              toast.success("Xoá quyền thông báo thành công!");
            }
          })
        }
        else {
          this.setState({ messageErr: res.data.message || 'Không thàng công' })
          this.toggleModal('popupMessage')
        }
      }
      )

  }

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;

    this.state.dataStamp.map((item, key) => (
      key >= beginItem && key < endItem && total++
    ));

    if (selected > 0) {
      total = (selected * limit) + total;
    } else total = total;

    this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
  };

  handlePageClickAlert = (data) => {
    let { limitAlert, beginItemAlert, endItemAlert } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitAlert);
    let total = 0;

    beginItemAlert = offset;
    endItemAlert = offset + limitAlert;

    this.state.dataAlert.map((item, key) => (
      key >= beginItemAlert && key < endItemAlert && total++
    ));

    if (selected > 0) {
      total = (selected * limitAlert) + total;
    } else total = total;

    this.setState({ beginItemAlert: beginItemAlert, endItemAlert: endItemAlert, currentPageAlert: selected + 1, totalElementAlert: total });
  };

  handlePageClickStampPrice = (data) => {
    let { limitStampPrice, beginItemStampPrice, endItemStampPrice } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limitStampPrice);
    let total = 0;

    beginItemStampPrice = offset;
    endItemStampPrice = offset + limitStampPrice;

    this.state.dataStampPrice.map((item, key) => (
      key >= beginItemStampPrice && key < endItemStampPrice && total++
    ));

    if (selected > 0) {
      total = (selected * limitStampPrice) + total;
    } else total = total;

    this.setState({ beginItemStampPrice: beginItemStampPrice, endItemStampPrice: endItemStampPrice, currentPageStampPrice: selected + 1, totalElementStampPrice: total });
  };

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        newDataIn: null,
        newData: null,
        errorInsert: {},
        errorUpdate: {},
      });
    }
  };

  // 3
  getListConfigServer = () => {
  }
  // 3

  // 2
  checkValidateFormConfigSystem = () => {
    const { configSetting } = this.state;

    const errorsConfigSystem = {};
    const contentEmailRegister = this.refcontentEmailRegister.getContent();
    const contentEmailChangePassword = this.refEditorContentSendEmailChangePassword.getContent();
    const attachmentStamps = this.refAttachmentStamps.getContent();
    const attachmentUsed = this.refAttachmentUsed.getContent();
    const attachments = this.refAttachments.getContent();
    const contentEmailSendToPrinter = this.refcontentEmailSendToPrinter.getContent();

    // if (!configSetting.price) {
    //   errorsConfigSystem.price = 'Giá tiền 1 con tem không được bỏ trống';
    // }

    // if (configSetting.price && configSetting.price <= 0) {
    //   errorsConfigSystem.price = 'Giá tiền 1 con tem không được nhỏ hơn hoặc bằng 0';
    // }
    // if (isNaN(configSetting.price)) {
    //   errorsConfigSystem.price = 'Giá tiền 1 con tem chỉ là số';
    // }

    if (!configSetting.email) {
      errorsConfigSystem.email = 'Email gửi thư không được bỏ trống';
    }

    if (!configSetting.passEmail) {
      errorsConfigSystem.passEmail = 'Mật khẩu email gửi thư quên mật khẩu/gửi mẫu tem cho nhà in không được bỏ trống';
    }

    if (!configSetting.emailMask) {
      errorsConfigSystem.emailMask = 'Tên khi gửi email quên mật khẩu/gửi mẫu tem cho nhà in không được bỏ trống';
    }

    if (configSetting.email && (configSetting.email || '').length > 255) {
      errorsConfigSystem.email = 'Email gửi thư nhập tối đa 255 kí tự';
    }

    if (configSetting.email && !validEmail(configSetting.email)) {
      errorsConfigSystem.email = 'Email gửi thư không đúng định dạng';
    }

    // if (!configSetting.phoneNumber) {
    //     errorsConfigSystem.phoneNumber = 'Điện thoại không được bỏ trống';
    // }

    if (!attachments) {
      errorsConfigSystem.attachments = 'Hồ sơ đính kèm không được bỏ trống';
    }

    if (!attachmentStamps) {
      errorsConfigSystem.attachmentStamps = 'Hồ sơ đính kèm không được bỏ trống';
    }

    // if (configSetting.phoneNumber && (configSetting.phoneNumber || '').length > 255) {
    //     errorsConfigSystem.phoneNumber = 'Điện thoại nhập tối đa 255 kí tự';
    // }

    // if (configSetting.phoneNumber && !validPhone(configSetting.phoneNumber)) {
    //     errorsConfigSystem.phoneNumber = 'Điện thoại không đúng định dạng';
    // }

    //const contentEmailRegister = this.refEditorContentSendEmailRegisterUsage.getContent();


    if (!contentEmailRegister) {
      errorsConfigSystem.contentEmailRegister = 'Nội dung gửi email xác nhận đăng ký sử dụng không được bỏ trống';
    }

    if (!contentEmailChangePassword) {
      errorsConfigSystem.contentEmailChangePassword = 'Nội dung gửi email thay đổi mật khẩu không được bỏ trống';
    }

    if (!configSetting.contentSMSRegister) {
      errorsConfigSystem.contentSMSRegister = 'Nội dung gửi SMS xác nhận đăng ký sử dụng không được bỏ trống';
    }

    if (!configSetting.contentSMSChangePassword) {
      errorsConfigSystem.contentSMSChangePassword = 'Nội dung gửi SMS thay đổi mật khẩu không được bỏ trống';
    }

    if (!contentEmailSendToPrinter) {
      errorsConfigSystem.contentEmailSendToPrinter = 'Nội dung gửi email mẫu tem gửi nhà in không được bỏ trống';
    }

    if (!attachmentUsed) {
      errorsConfigSystem.attachmentUsed = 'Hồ sơ đính kèm khi doanh nghiệp/cá nhân yêu cầu cấp phép sử dụng tem không được bỏ trống';
    }

    return errorsConfigSystem;
  }

  getConfigSystem = async () => {
    const { getConfigSetting } = this.props;

    const configSetting = await getConfigSetting();

    const data = (configSetting.data || {}).data || {};

    const templates = data.templates || [];

    const contentEmailRegister = templates.find(p => p.contentType == 'registerCompany' && p.note == 'Email');
    const contentSMSRegister = templates.find(p => p.contentType == 'registerCompany' && p.note == 'SMS');
    const contentEmailChangePassword = templates.find(p => p.contentType == 'changPass' && p.note == 'Email');
    const contentSMSChangePassword = templates.find(p => p.contentType == 'changPass' && p.note == 'SMS');
    const contentEmailSendToPrinter = templates.find(p => p.contentType == 'StampTemplate' && p.note == 'Email');

    this.setState(previousState => {
      return {
        ...previousState,
        configSetting: {
          ...previousState.configSetting,
          email: data.email,
          passEmail: data.passEmail,
          emailMask: data.emailMask,
          phoneNumber: data.phoneNumber,
          price: data.stamp,
          attachments: data.attachments,
          attachmentStamps: data.attachmentStamps,
          attachmentUsed: data.attachmentUsed,
          contentEmailRegister: contentEmailRegister ? contentEmailRegister.description : '',
          contentEmailChangePassword: contentEmailChangePassword ? contentEmailChangePassword.description : '',
          contentSMSRegister: contentSMSRegister ? contentSMSRegister.description : '',
          contentSMSChangePassword: contentSMSChangePassword ? contentSMSChangePassword.description : '',
          contentEmailSendToPrinter: contentEmailSendToPrinter ? contentEmailSendToPrinter.description : ''
        }
      }
    });
  }

  onInsert = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isInsertOrUpdate: true
      }
    });
  }

  onUpdate = id => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isInsertOrUpdate: true,
        updateId: id
      }
    });
  }

  onClose = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isInsertOrUpdate: false,
        updateId: null
      }
    });
  }

  onConfirm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isInsertOrUpdate: false,
        updateId: null
      }
    });
  }

  onChangeValueConfigSystem = name => e => {
    let value = e.target.value;

    if (name === 'price') {
      value = replaceCommaDot(value, '');
    }

    this.setState(previousState => {
      return {
        ...previousState,
        configSetting: {
          ...previousState.configSetting,
          [name]: value
        }
      }
    });
  }

  onSaveConfigSystem = () => {
    const errorsConfigSystem = this.checkValidateFormConfigSystem();

    this.setState(previousState => {
      return {
        ...previousState,
        errorsConfigSystem
      }
    });

    if (Object.keys(errorsConfigSystem).length > 0) {

      return;
    }

    const { configSetting } = this.state;

    // const contentEmailRegister = this.refEditorContentSendEmailRegisterUsage.getContent();
    const contentEmailChangePassword = this.refEditorContentSendEmailChangePassword.getContent();
    const contentEmailSendToPrinter = this.refcontentEmailSendToPrinter.getContent();
    const attachmentUsed = this.refAttachmentUsed.getContent();
    const attachmentStamps = this.refAttachmentStamps.getContent();
    const attachments = this.refAttachments.getContent();
    const contentEmailRegister = this.refcontentEmailRegister.getContent()
      ; const formData = new FormData();

    // formData.append('Stamp', configSetting.price);
    formData.append('Email', configSetting.email ? configSetting.email : '');
    formData.append('EmailMask', configSetting.emailMask ? configSetting.emailMask : '');
    formData.append('PassEmail', configSetting.passEmail ? configSetting.passEmail : '');
    formData.append('PhoneNumber', configSetting.phoneNumber ? configSetting.phoneNumber : '');
    formData.append('Attachments', attachments ? attachments : '');
    formData.append('AttachmentStamps', attachmentStamps ? attachmentStamps : '');
    formData.append('AttachmentUsed', attachmentUsed ? attachmentUsed : '');

    // formData.append('Templates[0]', JSON.stringify({
    //     contentType: "registerCompany",
    //     description: contentEmailRegister,
    //     note: "Email"
    // }));

    // formData.append('Templates[1]', JSON.stringify({
    //     contentType: "changPass",
    //     description: contentEmailChangePassword,
    //     note: "Email"
    // }));

    formData.append('Templates[0].id', "1")
    formData.append('Templates[0].description', contentEmailRegister)

    formData.append('Templates[1].id', "2")
    formData.append('Templates[1].description', contentEmailChangePassword)

    formData.append('Templates[2].id', "3")
    formData.append('Templates[2].description', contentEmailChangePassword)

    formData.append('Templates[3].id', "4")
    formData.append('Templates[3].description', contentEmailChangePassword)

    formData.append('Templates[4].id', "5")
    formData.append('Templates[4].description', contentEmailChangePassword)

    formData.append('Templates[5].id', "6")
    formData.append('Templates[5].description', contentEmailChangePassword)

    formData.append('Templates[6].id', "7")
    formData.append('Templates[6].description', contentEmailSendToPrinter)


    // formData.append('Templates[2]', JSON.stringify({
    //     contentType: "registerCompany",
    //     description: configSetting.contentSMSRegister,
    //     note: "SMS"
    // }));

    // formData.append('Templates[3]', JSON.stringify({
    //     contentType: "changPass",
    //     description: configSetting.contentSMSChangePassword,
    //     note: "SMS"
    // }));

    Loading.show();

    this.props.updateConfigSystem(formData).then(res => {
      Loading.close();

      const data = (res.data || {});

      if (data.status == 200) {
        //Message.show(TYPES.SUCCESS, 'Cập nhật cấu hình hệ thống thành công');
        toast.success("Lưu thông tin thành công!");
      } else {
        const message = getErrorMessageServer(res);
        this.setState({ messageErr: message });
        this.toggleModal('popupMessage')
        //Message.show(TYPES.ERROR, 'Thông báo', message || 'Hệ thống trục trặc');
      }
    });
  }
  // 2

  // 1
  getInfoCompany = async () => {
    const { getInfoCompany, getListDistrictForInfoCompany, getListProvinceForInfoCompany, requestCompanyAll } = this.props;

    const infoCompany = await getInfoCompany();

    const data = (infoCompany.data || {}).data || {};
    let districtName = '';
    let wardName = '';
    let districtId = '';
    let wardId = '';
    let companyId = this.state.companyId;


    this.setState(previousState => {
      districtId = data.districtID;
      wardId = data.wardID;

      return {
        ...previousState,

        infoCompany: {
          name: data.orgName,
          phoneNumber: data.orgPhone,
          email: data.orgEmail,
          address: data.orgAddress,
          provinceId1: data.provinceID1,
          districtId: data.districtID,
          wardId: data.wardID,
          taxCode: data.orgTaxCode,
          logo: data.orgLogo
        },

      }
    });

    getListProvinceForInfoCompany().then(res => {
      const data = (res.data || {}).data || null;
      if (data) {
        this.setState(previousState => {
          return {
            ...previousState,
            dataProvider: data
          }
        });
      }

    });

    getListDistrictForInfoCompany().then(res => {
      const data = (res.data || {}).data || [];

      if (data.length > 0 && districtId) {
        const district = data.find(p => p.id == districtId);

        if (district) {
          districtName = district.name;

          this.setState(previousState => {
            return {
              ...previousState,

              //districtName,
              //districtId
              dataDistrict: data
              //21/10/10 BUG, can't set data
            }
          });
        }
      }
    });
    const dataCompany = {
      "fieldID": "",
      "comapanyName": "",
      "taxCode": "",
      "phone": "",
      "email": "",
      "provinceID1": "",
      "districtID": "",
      "wardID": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }
    requestCompanyAll(dataCompany).then(res => {
      if (res.status == true) {
        const data = (res.data || {}).data || [];
        let oppss = [{
          address: "",
          companyName: "--- CHỌN CÔNG TY ---",
          fieldName: "",
          id: "",
          //isCertified: false,
          phoneNumber: "",
          registeredDate: "",
          taxCode: "",
        }]
        let ccopps = oppss.concat(data.companies)
        if (data) {
          this.setState(previousState => {
            return {
              ...previousState,
              dataCompany: data.companies,
              //valueDr: data.companies,
              options: ccopps,
            }
          });
        }
      }
    })

    if (districtId) {
      this.props.getListWardForInfoCompany({ districtId }).then(res => {
        const data = (res.data || {}).data || [];
        if (data.length > 0 && wardId) {
          const ward = data.find(p => p.id == wardId);

          if (ward) {
            wardName = ward.name;

            this.setState(previousState => {
              return {
                ...previousState,
                //wardName,
                //wardId
                dataWard: data
              }
            });
          }
        }
      });
    }
  }

  checkValidateFormInfoCompany = () => {
    const { infoCompany } = this.state;

    const errorsInfoCompany = {};

    if (!infoCompany.name) {
      errorsInfoCompany.name = 'Tên tổ chức không được bỏ trống';
    }

    if (infoCompany.name && (infoCompany.name || '').length > 255) {
      errorsInfoCompany.name = 'Tên tổ chức nhập tối đa 255';
    }

    // if (infoCompany.phoneNumber && !validPhone(infoCompany.phoneNumber)) {
    //     errorsInfoCompany.phoneNumber = 'Số điện thoại không đúng định dạng';
    // }

    // if (infoCompany.email && !validEmail(infoCompany.email)) {
    //     errorsInfoCompany.email = 'Email không đúng định dạng';
    // }

    if (!infoCompany.address) {
      errorsInfoCompany.address = 'Địa chỉ không được bỏ trống';
    }

    // if (!infoCompany.provinceId1) {
    //     errorsInfoCompany.provinceId1 = 'Tỉnh thành không được bỏ trống';
    // }

    // if (!infoCompany.districtId) {
    //     errorsInfoCompany.districtId = 'Quận huyện không được bỏ trống';
    // }

    // if (!infoCompany.wardId) {
    //     errorsInfoCompany.wardId = 'Phường xã không được bỏ trống';
    // }

    // if (infoCompany.taxCode && (infoCompany.taxCode || '').length > 255) {
    //     errorsInfoCompany.taxCode = 'Mã số thuế nhập tối đa 255';
    // }

    // if (infoCompany.logoFile && !validSize(infoCompany.logoFile.size, MAX_FILE_IMAGE_SIZE)) {
    //     errorsInfoCompany.logo = 'Logo không được quá ' + MAX_FILE_IMAGE_SIZE + 'MB';
    // }
    // console.log(infoCompany.logoFile)
    // if (infoCompany.logoFile && !validExtensionFileImage(infoCompany.logoFile.fileName)) {
    //     errorsInfoCompany.logo = 'Logo không đúng định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
    // }

    return errorsInfoCompany;
  }

  checkDataInsert = isCheck => {
    const { dataStampPrice } = this.state;
    if (!isCheck) {
      return {};
    }
    const { insertStampPrice } = this.state;
    const dateNow = new Date()
    const name = insertStampPrice.name;
    const executedDate = insertStampPrice.executedDate;
    const stampPriceDetail = insertStampPrice.stampPriceDetail || [];
    const errorInserts = {}
    if (!name) {
      errorInserts.name = "Tên bảng giá không được bỏ trống"
    }
    if (!executedDate) {
      errorInserts.executedDate = "Ngày hiệu lực không được bỏ trống"
    }
    if (stampPriceDetail.length === 0) {
      errorInserts.stampPriceDetail = "Chi tiết bảng giá không được bỏ trống"
    }
    if (dataStampPrice.length > 0) {
      if (executedDate < dateNow) {
        errorInserts.executedDate = "Ngày hiệu lực phải lớn hơn ngày hiện tại"
      }
    }

    for (let i = 0; i < stampPriceDetail.length; i++) {

      // const checkQuantityFrom = stampPriceDetail.map(p => p.quantityFrom);
      // const checkQuantityTo = stampPriceDetail.map(p => p.quantityTo);
      // const checkAmout = stampPriceDetail.map(p => p.amount)

      const checkQuantityFrom = stampPriceDetail[i].quantityFrom;
      const checkQuantityTo = stampPriceDetail[i].quantityTo;
      const checkAmout = stampPriceDetail[i].amount;

      if (Number(checkAmout) === 0) {
        errorInserts.stampPriceDetail = "Giá tiền phải lớn hơn 0"
      }

      if (Number(checkQuantityFrom) === 0 || Number(checkQuantityTo) === 0) {
        errorInserts.stampPriceDetail = "Số lượng tem phải lớn hơn 0"
      }

      if (Number(checkQuantityFrom) >= Number(checkQuantityTo)) {
        errorInserts.stampPriceDetail = 'Số lượng tem bắt đầu nhỏ hơn số lượng tem kết thúc'
      }
    }

    if (errorInserts)

      return errorInserts;
  }

  onConfimStampPrice = async (toggleModal, closePopup) => {
    const { getAllStampPrice, createStampPrice, updateStampPrice } = this.props
    let { insertStampPrice, limitStampPrice, totalElementStampPrice } = this.state;

    const id = insertStampPrice.id || "";
    const name = insertStampPrice.name;
    const executedDate = insertStampPrice.executedDate ? moment(insertStampPrice.executedDate).format('YYYY-MM-DD') : '';
    const stampPriceDetail = insertStampPrice.stampPriceDetail || [];

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
    let _stampPriceDetail = [];
    let __stampPriceDetail = {};
    stampPriceDetail.map(item => {
      __stampPriceDetail = {
        id: '',
        quantityFrom: item.quantityFrom,
        stampPriceID: '',
        quantityTo: item.quantityTo,
        amount: item.amount
      }
      _stampPriceDetail.push(__stampPriceDetail);
    })
    if (id) {
      await updateStampPrice(JSON.stringify({
        id: id,
        name: name,
        executedDate: executedDate,
        stampPriceDetail: stampPriceDetail
      })).then(res => {
        // console.log(res);
        const data = (res || {}).data || {};
        if (data.status === 200) {
          getAllStampPrice(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          })).then(res => {
            if (res.data.status === 200) {
              res.data.data.stampPrice.map((item, key) => {
                item['collapse'] = false;
                item['index'] = key + 1;
              })
              let totalElementStampPrice = 0;
              if (res.data.data.stampPrice.length > limitStampPrice) {
                totalElementStampPrice = limitStampPrice;
              } else {
                totalElementStampPrice = res.data.data.stampPrice.length;
              }
              this.setState({
                totalElementStampPrice,
                dataStampPrice: res.data.data.stampPrice,
                listLengthStampPrice: res.data.data.stampPrice.length,
                totalPageStampPrice: Math.ceil(res.data.data.stampPrice.length / this.state.limitStampPrice)
              })
            }
          });;
          if (toggleModal) {
            toggleModal()
          }
          this.setState(previousState => {
            return {
              ...previousState,
              isShowForEdit: false,
              idStampPrice: null
            }
          })
        } else {

          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message || 'Cập nhật dữ liệu không thành công' });
          this.toggleModal('popupMessage')

        }
      })
    } else {
      createStampPrice(JSON.stringify({
        name: name,
        executedDate: executedDate,
        stampPriceDetail: stampPriceDetail
      })).then(res => {

        const data = (res || {}).data || {};
        if (data.status === 200) {

          getAllStampPrice(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }))
            .then(res => {
              if (res.data.status === 200) {
                res.data.data.stampPrice.map((item, key) => {
                  item['collapse'] = false;
                  item['index'] = key + 1;
                })
                let totalElementStampPrice = 0;
                if (res.data.data.stampPrice.length > limitStampPrice) {
                  totalElementStampPrice = limitStampPrice;
                } else {
                  totalElementStampPrice = res.data.data.stampPrice.length;
                }
                this.setState({
                  totalElementStampPrice,
                  dataStampPrice: res.data.data.stampPrice,
                  listLengthStampPrice: res.data.data.stampPrice.length,
                  totalPageStampPrice: Math.ceil(res.data.data.stampPrice.length / limitStampPrice)
                })
              }
            });
          if (toggleModal) {
            toggleModal()
          }
          if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
        } else {

          const message = getErrorMessageServer(res);
          this.setState({ messageErr: message });
          this.toggleModal('popupMessage')

        }
      })
    }
  }
  onEditStampPrice = id => () => {

    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: true,
        idStampPrice: id
      }
    });
  }
  fetchSummary = (data) => {
    const { getAllStampPrice } = this.props
    getAllStampPrice(data)
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
  onChooseLogoInfoCompany = () => {
    if (this.refInputFileCompanyLogo) {
      this.refInputFileCompanyLogo.click();
    }
  }

  onChangeValueInfoCompany = name => e => {
    const value = e.target.value;

    this.setState(previousState => {
      return {
        ...previousState,
        infoCompany: {
          ...previousState.infoCompany,
          [name]: value
        }
      }
    });
  }
  onChangeSelectCompanyId = name => value => {
    let companyId = this.state.companyId;

    if (name == 'companyId') {
      companyId = value;
    }
    this.setState({
      companyId: companyId
    })

    if (name == 'companyId') {
      if (value != null) {
        this.props.getConfigServer({ companyId: value }).then(res => {
          const data = (res.data || {}).data || [];
          if (data) {
            data.map((item, key) => {
              item['index'] = key + 1
              item['collapse'] = false
              if (item.createdDate != null) {
                item['createdDate'] = moment(item.createdDate).format('DD-MM-YYYY')
              }
            });
            this.setState(previousState => {
              return {
                ...previousState,
                dataServer: data,
              }
            });
          }
        })
      }
    }
  }
  onChangeSelectInfoCompany = name => value => {
    let provinceName = this.state.infoCompany.provinceName;
    let districtName = this.state.infoCompany.districtName;
    let wardName = this.state.infoCompany.wardName;
    let wardId = this.state.infoCompany.wardId;


    if (name == 'provinceId1') {
      provinceName = '';
    }

    if (name == 'districtId') {
      districtName = '';
      wardId = null;
      wardName = '';
    }

    if (name == 'wardId') {
      wardName = '';
    }

    this.setState(previousState => {
      return {
        ...previousState,
        infoCompany: {
          ...previousState.infoCompany,
          wardId,
          [name]: value,
          provinceName,
          districtName,
          wardName
        }
      }
    }, () => {
      if (name === 'districtId') {
        if (this.redSelect) {
          this.redSelect.resetValue();
        }
        if (value) {
          this.props.getListWardForInfoCompany({ districtId: value }).then((res) => {
            if (res.data.status == 200) {
              this.setState({ dataWard: res.data.data })
            }
          })
        }
      }
    });
  }

  onChangeLogoInfoCompany = e => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorsInfoCompany: {
          ...previousState.errorsInfoCompany,
          logo: null
        }
      }
    });

    const files = e.target.files || [];

    if (files.length > 0) {
      const file = files[0];

      if (file) {
        if (!validExtensionFileImage(file.name)) {
          this.refInputFileCompanyLogo.files = null;

          this.setState(previousState => {
            return {
              ...previousState,
              errorsInfoCompany: {
                ...previousState.errorsInfoCompany,
                logo: 'Logo không đúng định dạng ' + EXTENSION_FILE_IMAGE.join(', ')
              }
            }
          });

          return;
        }

        if (!validSize(file.size, MAX_FILE_IMAGE_SIZE)) {
          this.refInputFileCompanyLogo.files = null;

          this.setState(previousState => {
            return {
              ...previousState,
              errorsInfoCompany: {
                ...previousState.errorsInfoCompany,
                logo: 'Logo không được quá ' + MAX_FILE_IMAGE_SIZE + 'MB'
              }
            }
          });

          return;
        }

        const logo = URL.createObjectURL(file);

        this.setState(previousState => {
          return {
            ...previousState,
            infoCompany: {
              ...previousState.infoCompany,
              logo,
              logoFile: file
            }
          }
        });
      }
    }
  }

  handleModal = (stutus, openModal, closeModal) => {
    if (stutus || this.state.isShowForEdit) {
      closeModal();
      // this.setState({ errorInsertAlert: {} })
    } else {
      openModal();
    }

    this.setState(previousState => {
      return {
        ...previousState,
        isShowForEdit: false,
        editId: null,
        idStampPrice: null,
        errorInsertAlert: {},
        errorInserts: {}
      }
    });
  }

  onSaveInfoCompany = () => {
    const errorsInfoCompany = this.checkValidateFormInfoCompany();

    this.setState(previousState => {
      return {
        ...previousState,
        errorsInfoCompany
      }
    });

    if (Object.keys(errorsInfoCompany).length > 0) {
      return;
    }

    const { infoCompany } = this.state;

    const formData = new FormData();

    formData.append('OrgName', infoCompany.name ? infoCompany.name : '');
    formData.append('OrgPhone', infoCompany.phoneNumber ? infoCompany.phoneNumber : '');
    formData.append('OrgEmail', infoCompany.email ? infoCompany.email : '');
    formData.append('OrgAddress', infoCompany.address ? infoCompany.address : '');
    formData.append('OrgTaxCode', infoCompany.taxCode ? infoCompany.taxCode : '');
    formData.append('ProvinceID1', infoCompany.provinceId1 ? infoCompany.provinceId1 : '');
    formData.append('DistrictID', infoCompany.districtId ? infoCompany.districtId : '');
    formData.append('WardID', infoCompany.wardId ? infoCompany.wardId : '');




    if ((this.refInputFileCompanyLogo && this.refInputFileCompanyLogo.files.length > 0)) {
      formData.append('OrgLogoFile', infoCompany.logoFile);
    } else {
      formData.append('OrgLogo', infoCompany.logo ? infoCompany.logo : '');
    }

    Loading.show();

    this.props.updateInfoCompany(formData).then(res => {
      Loading.close();

      const data = (res.data || {});

      if (data.status == 200) {
        //Message.show(TYPES.SUCCESS, 'Cập nhật thông tin thành công');
        toast.success("Lưu thông tin thành công!");
      } else {
        const message = getErrorMessageServer(res);

        this.setState({ messageErr: message });
        this.toggleModal('popupMessage')
        //Message.show(TYPES.ERROR, 'Thông báo', message || 'Hệ thống trục trặc');
      }
    });
  }

  onDeleteLogoInfoCompany = () => {
    if (this.refInputFileCompanyLogo) {
      this.refInputFileCompanyLogo.files = null;

      this.setState(previousState => {
        return {
          ...previousState,
          infoCompany: {
            ...previousState.infoCompany,
            logo: '',
            logoFile: ''
          }
        }
      });
    }
  }
  // 1

  toggle = (el, val) => {
    let { dataServer } = this.state;

    dataServer.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ dataServer });
  }

  toggleStamp = (el, val) => {
    let { dataStamp } = this.state;

    dataStamp.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ dataStamp });
  }

  toggleAlert = (el, val) => {
    let { dataAlert } = this.state;

    dataAlert.filter(item => item.roleID === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ dataAlert });
  }

  toggleStampPrice = (el, val) => {
    let { dataStampPrice } = this.state;


    dataStampPrice.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ dataStampPrice, errorInserts: {} });
  }
  dataHandele = data => {
    const { companyId, valueDr } = this.state;
    if (data == 200) {

      this.props.getConfigServer({ companyId: valueDr }).then(res => {
        const data = (res.data || {}).data || [];
        if (data) {
          data.map((item, key) => {
            item['index'] = key + 1
            item['collapse'] = false
            if (item.createdDate != null) {
              item['createdDate'] = moment(item.createdDate).format('DD-MM-YYYY')
            }
          });
          this.setState(previousState => {
            return {
              ...previousState,
              dataServer: data,
            }
          });
        }
      })

    }
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

  toggleOpen = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };
  onSelectChange = valueDr => {
    this.toggleOpen();
    const idValueDr = valueDr;
    this.setState({ valueDr: valueDr })
    // if (idValueDr != null) {
    this.props.getConfigServer({ companyId: idValueDr }).then(res => {
      const data = (res.data || {}).data || [];
      if (data) {
        data.map((item, key) => {
          item['index'] = key + 1
          item['collapse'] = false
          if (item.createdDate != null) {
            item['createdDate'] = moment(item.createdDate).format('DD-MM-YYYY')
          }
        });
        this.setState(previousState => {
          return {
            ...previousState,
            dataServer: data,
          }
        });
      }
    })
    // }

  };


  onHandleChangeValue = data => {
    this.setState(previousState => {
      return {
        ...previousState,
        newDataInAlert: data.newData,
        // insertStampPrice: data
      }
    })
  }

  onHandleChangeValueStamp = data => {

    this.setState(previousState => {
      return {
        ...previousState,
        insertStampPrice: data,
        errorInserts: {}
      }
    })
  }

  onClickShowPass = () => {
    let { showPass } = this.state;
    this.setState({ showPass: !showPass })
  }

  render() {
    const { ConfigSystemStore } = this.props;
    const {
      configSetting,
      errorsConfigSystem,
      errorsInfoCompany,
      currentTab,
      isInsertOrUpdate,
      infoCompany,
      dataCompany,
      dataServer,
      dataStampPrice,
      updateId,
      companyId,
      dataProvider,
      dataDistrict,
      dataWard,
      isOpen,
      options,
      dataStamp,
      headerTitle,
      headerTitleAlert,
      headerStampPrice,
      beginItem,
      endItem,
      totalElement,
      listLength,
      totalPage,
      updateModal,
      activeCreateSubmit,
      idRow,
      errorUpdate,
      createNewModal,
      warningPopupModal,
      warningPopupDelStamp,
      popupMessage,
      messageErr,
      dataAlert,
      editId,
      errorInsertAlert,
      errorInserts,
      isShowForEdit,
      warningPopupDelModal,
      listLengthAlert,
      listLengthStampPrice,
      totalPageAlert,
      totalPageStampPrice,
      totalElementAlert,
      totalElementStampPrice,
      endItemAlert,
      beginItemAlert,
      beginItemStampPrice,
      endItemStampPrice,
      idStampPrice,
      currentRowAlert,
      showPass
    } = this.state;
    // console.log(dataStampPrice);
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

      ACCOUNT_CLAIM_FF.filter(x => x == "Configs.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Configs.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Configs.Delete").map(y => isDisableDelete = false)
    }

    options.map(option => {
      option.name = option.companyName;
      option.value = option.id;
    })
    // options.concat({
    //     address: "",
    //     companyName: "",
    //     fieldName: "",
    //     id: "",
    //     isCertified: false,
    //     name: "Chọn công ty ",
    //     phoneNumber: "",
    //     registeredDate: "",
    //     taxCode: "",
    //     value: "",
    // })


    return (
      <div className='config-system'>
        <div className='config-system-tab'>
          <div onClick={this.onChooseTab(0)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 0 ? 'active' : ''}`}>THÔNG TIN PHIẾU THU</div>
          <div onClick={this.onChooseTab(1)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 1 ? 'active' : ''}`}>CÀI ĐẶT HỆ THỐNG</div>
          {/* <div onClick={this.onChooseTab(2)} className={`config-system-tab-item ${currentTab == 2 ? 'active' : ''}`}>CÀI ĐẶT MÁY CHỦ</div> */}
          <div onClick={this.onChooseTab(3)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 3 ? 'active' : ''}`}>MẪU IN TEM QR</div>
          <div onClick={this.onChooseTab(4)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 4 ? 'active' : ''}`}>CÀI ĐẶT THÔNG BÁO</div>
          <div onClick={this.onChooseTab(5)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 5 ? 'active' : ''}`}>BẢNG GIÁ TEM</div>
        </div>
        <div className='config-system-content'>
          {currentTab == 0 ? (
            <div className='config-system-content-info-company'>
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Tên tổ chức&nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-info-company-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input autoFocus={true} onChange={this.onChangeValueInfoCompany('name')} value={infoCompany.name} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
                  </InputGroup>

                  <p className='form-error-message'>{errorsInfoCompany.name}</p>
                </div>
              </div>
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Điện thoại</label>
                <div className='config-system-content-info-company-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input onChange={this.onChangeValueInfoCompany('phoneNumber')} value={infoCompany.phoneNumber} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
                  </InputGroup>

                  <p className='form-error-message'>{errorsInfoCompany.phoneNumber}</p>
                </div>
              </div>
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Email</label>
                <div className='config-system-content-info-company-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input onChange={this.onChangeValueInfoCompany('email')} value={infoCompany.email} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
                  </InputGroup>

                  <p className='form-error-message'>{errorsInfoCompany.email}</p>
                </div>
              </div>
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Địa chỉ &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-info-company-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input onChange={this.onChangeValueInfoCompany('address')} value={infoCompany.address} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
                  </InputGroup>

                  <p className='form-error-message'>{errorsInfoCompany.address}</p>
                </div>
              </div>
              {/* <div className='config-system-content-info-company-item'>
                                <label className='config-system-content-info-company-item-label'></label>
                                <div className='config-system-content-info-company-item-group'>
                                    <div className='config-system-content-info-company-item-group-item'>
                                        {dataProvider.length > 0 ? (
                                            <Select1
                                                // isDisable={dataProvider.length > 1 ? false : true}
                                                labelMark={infoCompany.provinceName}
                                                defaultValue={infoCompany.provinceId1}
                                                className='config-system-content-info-company-item-group-item-select'
                                                name="provinceId1"
                                                title='Chọn Tỉnh/Thành'
                                                //data={ConfigSystemStore.provincesForInfoCompany}
                                                data={dataProvider}
                                                labelName='provinceName'
                                                val='id'
                                                handleChange={this.onChangeSelectInfoCompany('provinceId1')}
                                            />
                                        ) : null}
                                        <p className='form-error-message'>{errorsInfoCompany.provinceId1}</p>
                                    </div>
                                    <div className='config-system-content-info-company-item-group-item'>
                                        {dataDistrict.length > 0 ? (
                                            <Select1
                                                labelMark={infoCompany.districtName}
                                                defaultValue={infoCompany.districtId}
                                                className='config-system-content-info-company-item-group-item-select'
                                                name="districtId"
                                                title='Chọn Quận/Huyện'
                                                //data={ConfigSystemStore.districtsForInfoCompany}
                                                data={dataDistrict}
                                                labelName='districtName'
                                                val='id'
                                                handleChange={this.onChangeSelectInfoCompany('districtId')}
                                            />
                                        ) : null}
                                        <p className='form-error-message'>{errorsInfoCompany.districtId}</p>
                                    </div>
                                    <div className='config-system-content-info-company-item-group-item'>
                                        {dataWard.length > 0 ? (
                                            <Select1
                                                ref={ref => this.redSelect = ref}
                                                labelMark={infoCompany.wardName}
                                                defaultValue={infoCompany.wardId}
                                                className='config-system-content-info-company-item-group-item-select'
                                                name="wardId"
                                                title='Chọn Phường/Xã'
                                                //data={ConfigSystemStore.wardsForInfoCompany}
                                                data={dataWard}
                                                labelName='wardName'
                                                val='id'
                                                handleChange={this.onChangeSelectInfoCompany('wardId')}
                                            />
                                        ) : null}
                                        <p className='form-error-message'>{errorsInfoCompany.wardId}</p>
                                    </div>
                                </div>
                            </div> */}
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Mã số thuế</label>
                <div className='config-system-content-info-company-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input onChange={this.onChangeValueInfoCompany('taxCode')} value={infoCompany.taxCode} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
                  </InputGroup>

                  <p className='form-error-message'>{errorsInfoCompany.taxCode}</p>
                </div>
              </div>
              <div className='config-system-content-info-company-item'>
                <label className='config-system-content-info-company-item-label'>Logo</label>
                <div className='config-system-content-info-company-item-box'>
                  <input onChange={this.onChangeLogoInfoCompany} ref={ref => this.refInputFileCompanyLogo = ref} type='file' style={{ display: 'none' }} className='hidden' />
                  <img onClick={this.onChooseLogoInfoCompany} className='config-system-content-info-company-item-logo' src={infoCompany.logo} />
                  <div className='config-system-content-info-company-item-delete-logo'>
                    <button onClick={this.onDeleteLogoInfoCompany} className='config-system-content-info-company-item-delete-logo-button'>Xóa</button>
                  </div>
                  <p className='form-error-message'>{errorsInfoCompany.logo}</p>
                </div>
              </div>
              <div className='config-system-content-info-company-function'>
                {/* <button onClick={this.onSaveInfoCompany} className='config-system-content-info-company-function-button'>
                                    <img className='config-system-content-info-company-function-button-icon' src={ButtonSave} />
                                </button> */}
                {isDisableAdd == true ? null : (
                  <Button
                    color="default"
                    type="button"
                    className={`btn-success-cs`}
                    style={{ margin: "inherit" }}
                    onClick={this.onSaveInfoCompany}
                  >
                    <img src={SaveIcon1} alt='Lưu lại' />
                    <span>Lưu lại</span>
                  </Button>

                )}

              </div>
            </div>
          ) : null}
          {currentTab == 1 ? (
            <div className='config-system-content-config-system'>
              {/* <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Giá tiền 1 con tem &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input">
                    <input onChange={this.onChangeValueConfigSystem('price')} value={numberWithCommas(configSetting.price)} type='text' className='config-system-content-config-system-item-input css-border-webConfig' />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.price}</p>
                </div>
              </div> */}
              <div className='config-system-content-config-system-multi'>
                <div className='config-system-content-config-system-multi-item'>
                  <label className='config-system-content-config-system-item-label'>Email gửi thư quên mật khẩu/gửi mẫu tem cho nhà in &nbsp;<b style={{ color: 'red' }}>*</b></label>
                  <div className='config-system-content-config-system-item-box'>
                    <input onChange={this.onChangeValueConfigSystem('email')} value={configSetting.email} type='text' className='config-system-content-config-system-item-input' autoComplete="new-password" />
                    <p className='form-error-message'>{errorsConfigSystem.email}</p>
                  </div>
                </div>
                {/* <div className='config-system-content-config-system-multi-item'>
                  <label className='config-system-content-config-system-item-label'>Điện thoại gửi SMS &nbsp;<b style={{ color: 'red' }}>*</b></label>
                  <div className='config-system-content-config-system-item-box'>
                    <input onChange={this.onChangeValueConfigSystem('phoneNumber')} value={configSetting.phoneNumber} type='text' className='config-system-content-config-system-item-input' />
                    <p className='form-error-message'>{errorsConfigSystem.phoneNumber}</p>
                  </div>
                </div> */}
              </div>
              <div className='config-system-content-config-system-multi'>
                <div className='config-system-content-config-system-multi-item'>
                  <label className='config-system-content-config-system-item-label'>Mật khẩu email gửi thư quên mật khẩu/gửi mẫu tem cho nhà in &nbsp;<b style={{ color: 'red' }}>*</b></label>
                  <div className='config-system-content-config-system-item-box row' style={{ margin: 0 }}>
                    <div className='config-system-content-config-system-item-input' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <input style={{ border: 'none' }} onChange={this.onChangeValueConfigSystem('passEmail')} value={configSetting.passEmail} type={showPass ? "text" : "password"} className='config-system-content-config-system-item-input' autoComplete="new-password" />
                      <img
                        src={showPass ? eyeOff : eye}
                        width={25}
                        height={25}
                        style={{
                          cursor: 'pointer',
                          alignSelf: 'center',
                          marginLeft: 5
                        }}
                        onClick={this.onClickShowPass} />
                    </div>
                    <p className='form-error-message'>{errorsConfigSystem.passEmail}</p>
                  </div>

                </div>
              </div>
              <div className='config-system-content-config-system-multi'>
                <div className='config-system-content-config-system-multi-item'>
                  <label className='config-system-content-config-system-item-label'>Tên khi gửi email quên mật khẩu/gửi mẫu tem cho nhà in &nbsp;<b style={{ color: 'red' }}>*</b></label>
                  <div className='config-system-content-config-system-item-box'>
                    <input onChange={this.onChangeValueConfigSystem('emailMask')} value={configSetting.emailMask} type='text' className='config-system-content-config-system-item-input' autoComplete="new-password" />
                    <p className='form-error-message'>{errorsConfigSystem.emailMask}</p>
                  </div>
                </div>
              </div>
              {/* <div className='config-system-content-config-system-item'>
                                <label className='config-system-content-config-system-item-label'>Nội dung gửi email xác nhận đăng kí sử dụng &nbsp;<b style={{ color: 'red' }}>*</b></label>
                                <div className='config-system-content-config-system-item-box'>
                                    <Editor onInit={(_, editor) => {
                                        this.refEditorContentSendEmailRegisterUsage = editor;
                                    }}
                                        initialValue={configSetting.contentEmailRegister}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }} />
                                    <p className='form-error-message'>{errorsConfigSystem.contentEmailRegister}</p>
                                </div>
                            </div> */}
              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Nội dung gửi email thay đổi mật khẩu/quên mật khẩu &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refEditorContentSendEmailChangePassword = editor;
                    }}
                      initialValue={configSetting.contentEmailChangePassword}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.contentEmailChangePassword}</p>
                </div>
              </div>

              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Nội dung gửi email mẫu tem gửi nhà in &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refcontentEmailSendToPrinter = editor;
                    }}
                      initialValue={configSetting.contentEmailSendToPrinter}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.contentEmailSendToPrinter}</p>
                </div>
              </div>

              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Nội dung gửi email xác nhận đăng ký sử dụng &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refcontentEmailRegister = editor;
                    }}
                      initialValue={configSetting.contentEmailRegister}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.contentEmailRegister}</p>
                </div>
              </div>

              {/* <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Hồ sơ đính kèm khi doanh nghiệp/HTX/cá nhân đăng kí sử dụng &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input ">
                    <textarea onChange={this.onChangeValueConfigSystem('attachments')} value={numberWithCommas(configSetting.attachments)} rows="8" type='text' className='config-system-content-config-system-item-input css-border-webConfig' />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.attachments}</p>
                </div>
              </div> */}

              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Hồ sơ đính kèm khi doanh nghiệp/HTX/cá nhân đăng kí sử dụng Trace Center&nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refAttachments = editor;
                    }}
                      initialValue={configSetting.attachments}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.attachments}</p>
                </div>
              </div>

              {/* <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Hồ sơ đính kèm khi doanh nghiệp/HTX/cá nhân yêu cầu cấp phát tem &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input ">
                    <textarea onChange={this.onChangeValueConfigSystem('attachmentStamps')} value={numberWithCommas(configSetting.attachmentStamps)} rows="8" type='text' className='config-system-content-config-system-item-input css-border-webConfig' />
                  </InputGroup>
                  <p className='form-error-message'>{errorsConfigSystem.attachmentStamps}</p>
                </div>
              </div> */}

              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Hồ sơ đính kèm khi doanh nghiệp/HTX/cá nhân yêu cầu cấp phát tem &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refAttachmentStamps = editor;
                    }}
                      initialValue={configSetting.attachmentStamps}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.attachmentStamps}</p>
                </div>
              </div>

              <div className='config-system-content-config-system-item'>
                <label className='config-system-content-config-system-item-label'>Hồ sơ đính kèm khi doanh nghiệp/cá nhân yêu cầu cấp phép sử dụng tem &nbsp;<b style={{ color: 'red' }}>*</b></label>
                <div className='config-system-content-config-system-item-box'>
                  <InputGroup className="input-group-alternative css-border-input css-border-webConfig">
                    <Editor onInit={(_, editor) => {
                      this.refAttachmentUsed = editor;
                    }}
                      initialValue={configSetting.attachmentUsed}
                      init={{
                        width: '100%',
                        height: 300,
                        menubar: false,
                        toolbar: 'undo redo | formatselect | image | link | code | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        selector: 'textarea#file-picker',
                        plugins: 'image code link',
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          let _this = this;

                          var input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          input.onchange = async function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = 'blobid' + (new Date()).getTime();
                              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              var base64 = reader.result.split(',')[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            let data = null;
                            let imageFile = new FormData();
                            let fileLink = null;
                            imageFile.append('files', file);

                            try {
                              data = await axios({
                                method: 'post',
                                url: CONFIG_UPDATE_IMG,
                                headers: {
                                  authorization: localStorage.getItem('TOKEN')
                                },
                                data: imageFile
                              })
                              if (data.data.status == 200) {
                                fileLink = data.data.data;
                                cb(fileLink);
                              } else {
                                _this.setState({ messageErr: 'Lỗi hệ thống' })
                                _this.toggleModal('popupMessage')
                                return;
                              }
                            } catch (error) {
                              _this.setState({ messageErr: 'Lỗi hệ thống' })
                              _this.toggleModal('popupMessage')
                              return;
                            }

                            //reader.readAsDataURL(file);
                          };

                          input.click();

                        },
                      }} />
                  </InputGroup>

                  <p className='form-error-message'>{errorsConfigSystem.attachmentUsed}</p>
                </div>
              </div>

              {/* <div className='config-system-content-config-system-item'>
                                <label className='config-system-content-config-system-item-label'>Nội dung gửi SMS xác nhận đăng kí sử dụng &nbsp;<b style={{ color: 'red' }}>*</b></label>
                                <div className='config-system-content-config-system-item-box'>
                                    <textarea onChange={this.onChangeValueConfigSystem('contentSMSRegister')} value={configSetting.contentSMSRegister} rows="3" type='text' className='config-system-content-config-system-item-textarea'></textarea>
                                    <p className='form-error-message'>{errorsConfigSystem.contentSMSRegister}</p>
                                </div>
                            </div>
                            <div className='config-system-content-config-system-item'>
                                <label className='config-system-content-config-system-item-label'>Nội dung gửi SMS thay đổi mật khẩu &nbsp;<b style={{ color: 'red' }}>*</b></label>
                                <div className='config-system-content-config-system-item-box'>
                                    <textarea onChange={this.onChangeValueConfigSystem('contentSMSChangePassword')} value={configSetting.contentSMSChangePassword} rows="3" type='text' className='config-system-content-config-system-item-textarea'></textarea>
                                    <p className='form-error-message'>{errorsConfigSystem.contentSMSChangePassword}</p>
                                </div>
                            </div> */}
              <div className='config-system-content-config-system-item-function'>
                {/* <button onClick={this.onSaveConfigSystem} className='config-system-content-config-system-item-function-button'>
                                    <img className='config-system-content-config-system-item-function-button-icon' src={ButtonSave} />
                                </button> */}
                {isDisableAdd == true ? null : (
                  <Button
                    color="default"
                    type="button"
                    className={`btn-success-cs`}
                    style={{ margin: "inherit" }}
                    onClick={this.onSaveConfigSystem}
                  >
                    <img src={SaveIcon1} alt='Lưu lại' />
                    <span>Lưu lại</span>
                  </Button>
                )}
              </div>
            </div>
          ) : null}
          {currentTab == 2 ? (
            <div className='config-system-content-config-server'>
              <div className='config-system-content-config-server-filter'>
                <label className='config-system-content-config-server-filter-label' style={{ width: 200 }}>Doanh nghiệp/Cá nhân</label>
                <SelectSearch
                  options={options}
                  value={options.id}
                  onChange={this.onSelectChange}
                  search
                  filterOptions={fuzzySearch}
                  placeholder="Tìm kiếm..."
                />

              </div>
              <div className='config-system-content-config-server-function'>
                {/* <button onClick={this.onInsert} className='config-system-content-config-server-function-add'>
                                    <img
                                        className='config-system-content-config-server-function-add-icon'
                                        src={ButtomAdd} alt='Thêm mới'
                                    />
                                </button> */}
                {isDisableAdd == true ? null : (
                  <Button type="button" size="lg" className='btn-primary-cs' onClick={this.onInsert} style={{ margin: 0 }}>
                    <img src={PlusImg} alt='Thêm mới' />
                    <span>Thêm mới</span>
                  </Button>
                )}
              </div>
              <div className='config-system-content-config-server-list'>
                <table className='config-system-content-config-server-list-table tablecs'>
                  <thead className='config-system-content-config-server-list-table-header'>
                    <tr className='config-system-content-config-server-list-table-header-row'>
                      <th className='config-system-content-config-server-list-table-header-row-col'>STT</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>TRẠNG THÁI</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>SERVER</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>FTP</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>TỐI ĐA (MB)</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>ĐÃ DÙNG</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>CÒN LẠI</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>NGƯỜI CẤP</th>
                      <th className='config-system-content-config-server-list-table-header-row-col'>NGÀY CẤP</th>
                      <th className='config-system-content-config-server-list-table-header-row-col config-system-content-config-server-list-table-header-row-col-function'></th>
                    </tr>
                  </thead>
                  <tbody className='config-system-content-config-server-list-table-body'>
                    {
                      Array.isArray(dataServer) && (
                        dataServer
                          // .filter((item, key) => key >= beginItem && key < endItem)
                          .map((item, key) => (
                            <tr key={key} className='config-system-content-config-server-list-table-body-row'>
                              <td style={{ textAlign: 'center' }} className='config-system-content-config-server-list-table-body-row-col'>{item.index}</td>
                              <td style={{ textAlign: 'center' }} className='config-system-content-config-server-list-table-body-row-col'>
                                <span className={`${item.isUsed === false || item.isUsed === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}
                                  {item.isUsed == true ? 'Đang sử dụng' : 'Không sử dụng'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }} className='config-system-content-config-server-list-table-body-row-col'>{item.serverInfo}</td>
                              <td style={{ textAlign: 'left' }} className='config-system-content-config-server-list-table-body-row-col'>{item.ftp}</td>
                              <td style={{ textAlign: 'right' }} className='config-system-content-config-server-list-table-body-row-col'>{item.limitedStore}</td>
                              <td style={{ textAlign: 'right' }} className='config-system-content-config-server-list-table-body-row-col'>{item.usedStore}</td>
                              <td style={{ textAlign: 'right' }} className='config-system-content-config-server-list-table-body-row-col'>{item.limitedStore - item.usedStore}</td>
                              <td style={{ textAlign: 'left' }} className='config-system-content-config-server-list-table-body-row-col'>{item.createdBy}</td>
                              <td style={{ textAlign: 'center' }} className='config-system-content-config-server-list-table-body-row-col'>{item.createdDate}</td>
                              <td className='config-system-content-config-server-list-table-body-row-col config-system-content-config-server-list-table-body-row-col-function'>
                                {item.isUsed == false ? (
                                  <div>
                                    {isDisableEdit == true && isDisableDelete == true ? null : (
                                      <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                        <DropdownToggle>
                                          <img src={MenuButton} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          {isDisableEdit == false ? (
                                            <DropdownItem
                                              // onClick={() => {
                                              //     this.toggleModal('updateModal');
                                              //     this.handleOpenEdit(item.id);
                                              // }}
                                              onClick={
                                                this.onUpdate(item.id)
                                              }
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
                                            // onClick={() => {
                                            //     this.toggleModal('warningPopupModal');
                                            //     this.setState({ deleteItem: item.id });
                                            // }}
                                            >
                                              Xoá
                                            </DropdownItem>
                                          ) : null}
                                        </DropdownMenu>
                                      </ButtonDropdown>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          )
                          )
                      )
                    }

                  </tbody>
                </table>
              </div>
              {isInsertOrUpdate ?
                <InsertOrUpdate
                  id={updateId}
                  companyIdValue={companyId}
                  options={options}
                  onClose={this.onClose}
                  dataCompany={dataCompany}
                  onConfirm={this.onConfirm}
                  dataHandele={this.dataHandele}
                /> : null}
            </div>
          ) : null}
          {currentTab == 3 ? (
            <div className='config-system-content-config-server'>
              {/* <div className='config-system-content-config-server-function'>
                                <Button type="button" size="lg" className='btn-primary-cs' onClick={this.onInsert} style={{ margin: 0 }}>
                                    <img src={PlusImg} alt='Thêm mới' />
                                    <span>Thêm mới</span>
                                </Button>
                            </div> */}
              <HeaderTable
                hideSearch={true}
                hideReload={true}
                styleCustom={'justifyContentStart'}
                moduleTitle='Thêm mẫu tem'
                moduleBody={this.renderCreateModal()}
                activeSubmit={activeCreateSubmit}
                // newData={newData}
                handleCreateInfoData={this.componentInsert}

              />
              <Card className="shadow">
                <Table className="align-items-center tablecs " responsive>
                  <HeadTitleTable
                    headerTitle={headerTitle}
                    classHeaderColumns={{
                      0: 'table-scale-col table-user-col-1'
                    }}
                  />
                  <tbody ref={ref => this.tableBody = ref}>
                    {
                      Array.isArray(dataStamp) && (
                        dataStamp
                          .filter((item, key) => key >= beginItem && key < endItem)
                          .map((item, key) => (
                            <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (dataStamp || []).length) }}>
                              <td className='table-scale-col table-user-col-1'>{key + 1}</td>
                              <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                {item.template ?
                                  <img src={item.template} width={400} height={200} /> :
                                  <img src={NoImg} width={400} height={200} />}
                              </td>
                              <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.name}</td>
                              <td>

                                <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggleStamp(key, item.id)}>
                                  <DropdownToggle>
                                    <img src={MenuButton} />
                                  </DropdownToggle>
                                  <DropdownMenu>

                                    <DropdownItem
                                      onClick={() => {
                                        this.toggleModal('updateModal');
                                        this.handleOpenEdit(item.id);
                                        this.setState({ currentRow: item })
                                      }}>
                                      Sửa
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem
                                      onClick={() => {
                                        this.toggleModal('warningPopupModal');
                                        this.setState({ deleteItem: item.id });
                                      }}
                                    >
                                      Xoá
                                    </DropdownItem>

                                  </DropdownMenu>
                                </ButtonDropdown>

                              </td>
                            </tr>
                          )
                          )
                      )
                    }
                  </tbody>
                </Table>
              </Card>
              {
                // Page of Table
                Array.isArray(dataStamp) && (
                  dataStamp.length > 0 && (
                    <Pagination
                      data={dataStamp}
                      listLength={listLength}
                      totalPage={totalPage}
                      totalElement={totalElement}
                      handlePageClick={this.handlePageClick}
                    />
                  )
                )
              }

              <UpdatePopup
                moduleTitle='Sửa mẫu tem'
                moduleBody={
                  <UpdateModal
                    errorUpdate={errorUpdate}
                    id={idRow}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewData}
                  />}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.componentUpdate}
              />

              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={messageErr}
                toggleModal={this.toggleModal}
              />

              <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle='Thêm mẫu tem'
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                type100={true}
                handleCreateInfoData={(data, beta, close) => {
                  this.componentInsert(data, () => {
                    this.setState({
                      createNewModal: false
                    });
                  }, close);
                }}
              />

              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
              />
            </div>
          ) : null}
          {currentTab == 4 ? (
            <div className='config-system-content-config-server'>
              <HeaderTable
                hideSearch={true}
                hideReload={true}
                styleCustom={'justifyContentStart'}
                moduleTitle={isShowForEdit ? 'Chỉnh sửa' : 'Thêm mới'}
                isShowForEdit={isShowForEdit}
                moduleBody={
                  <InsertOrUpdateAlert
                    id={editId}
                    currentRowAlert={currentRowAlert}
                    errors={errorInsertAlert}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />
                }
                handleModal={this.handleModal}
                onConfirm={this.onConfirmAlert}
              />
              <Card className="shadow">
                <Table className="align-items-center tablecs table-css-config-system" responsive>
                  <HeadTitleTable
                    headerTitle={headerTitleAlert}
                    classHeaderColumns={{
                      0: 'table-scale-col table-user-col-1'
                    }}
                  />
                  <tbody ref={ref => this.tableBody = ref}>
                    {
                      Array.isArray(dataAlert) && (
                        dataAlert
                          .filter((item, key) => key >= beginItemAlert && key < endItemAlert)
                          .map((item, key) => (
                            <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (dataAlert || []).length) }}>
                              <td className='table-scale-col table-user-col-1'>{key + 1}</td>
                              <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.roleName}</td>
                              <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                {item.alertTypeName.split(',').map((item1, key1) => (
                                  <><span>{item1}</span><br /></>
                                ))}
                              </td>
                              <td>

                                <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggleAlert(key, item.roleID)}>
                                  <DropdownToggle>
                                    <img src={MenuButton} />
                                  </DropdownToggle>
                                  <DropdownMenu>

                                    {/* <DropdownItem
                                      onClick={() => {
                                        // this.toggleModal('updateModal');
                                        this.handleOpenEditAlert(item.roleID);
                                        this.setState({ currentRowAlert: item })
                                      }}>
                                      Sửa
                                    </DropdownItem>
                                    <DropdownItem divider /> */}
                                    <DropdownItem
                                      onClick={() => {
                                        this.toggleModal('warningPopupDelModal');
                                        this.setState({ deleteItemAlert: item.roleID });
                                      }}
                                    >
                                      Xoá
                                    </DropdownItem>

                                  </DropdownMenu>
                                </ButtonDropdown>

                              </td>
                            </tr>
                          )
                          )
                      )
                    }
                  </tbody>
                </Table>
              </Card>
              {
                // Page of Table
                Array.isArray(dataAlert) && (
                  dataAlert.length > 0 && (
                    <Pagination
                      data={dataAlert}
                      listLength={listLengthAlert}
                      totalPage={totalPageAlert}
                      totalElement={totalElementAlert}
                      handlePageClick={this.handlePageClickAlert}
                    />
                  )
                )
              }

              <UpdatePopup
                moduleTitle='Sửa mẫu tem'
                moduleBody={
                  <UpdateModal
                    errorUpdate={errorUpdate}
                    id={idRow}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewData}
                  />}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.componentUpdate}
              />

              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={messageErr}
                toggleModal={this.toggleModal}
              />

              {/* <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle='Thêm mẫu tem'
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                type100={true}
                handleCreateInfoData={(data, beta, close) => {
                  this.componentInsert(data, () => {
                    this.setState({
                      createNewModal: false
                    });
                  }, close);
                }}
              /> */}

              <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle='Thêm mới'
                type100={true}
                moduleBody={
                  <InsertOrUpdateAlert
                    errors={errorInsertAlert}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                onConfirm={(data, close) => {
                  this.onConfirmAlert(data, close);
                }}
              />

              <WarningPopupDel
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupDelModal={warningPopupDelModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRowAlert}
              />
            </div>
          ) : null}
          {currentTab === 5 ? (<>
            <div className='config-system-content-config-stamp-price'>
              <HeaderTable
                hideSearch={true}
                dataReload={() => this.getAllStampPrice(
                  JSON.stringify({
                    "search": "",
                    "filter": "",
                    "orderBy": "",
                    "page": null,
                    "limit": null
                  })
                )}
                styleCustom={'justifyContentStart'}
                isShowForEdit={isShowForEdit}
                moduleTitle={isShowForEdit ? "Chỉnh sửa" : 'Thêm mới'}
                moduleBody={
                  <AddNewStampPrice
                    id={idStampPrice}
                    onHandleChangeValue={this.onHandleChangeValueStamp}
                    errorInsert={errorInserts}
                  />
                }
                handleModal={this.handleModal}
                onConfirm={this.onConfimStampPrice}
              />
              <Card className="shadow">
                <Table className="align-items-center tablecs " responsive>
                  <HeadTitleTable
                    headerTitle={headerStampPrice}
                    classHeaderColumns={{
                      0: 'table-scale-col table-user-col-1'
                    }}
                  />
                  <tbody ref={ref => this.tableBody = ref} className='config-system-content-config-server-list-table-body'>
                    {
                      Array.isArray(dataStampPrice) && (
                        dataStampPrice
                          .filter((item, key) => key >= beginItemStampPrice && key < endItemStampPrice)
                          .map((item, key) => (

                            <tr key={key} >
                              <td className='table-scale-col table-user-col-1'>{item.index}</td>
                              <td style={{ textAlign: 'left' }}>
                                <span style={{ color: '#1ec6e8', fontWeight: 'bold', fontSize: 14 }}>{item.name}</span><br />
                                <span>Ngày hiệu lực:&nbsp;{moment(item.executedDate).format('DD/MM/YYYY')}</span>
                                {/* <span>Ngày hết hiệu lực:&nbsp;{moment(item.toDate).format('DD/MM/YYYY')}</span> */}
                              </td>
                              <td>
                                <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggleStampPrice(key, item.id)}>
                                  <DropdownToggle>
                                    <img src={MenuButton} />
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={this.onEditStampPrice(item.id)}>
                                      Sửa
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem
                                      onClick={() => {
                                        this.toggleModal('warningPopupDelStamp');
                                        this.setState({ deleteItemStampPrice: item.id });
                                      }}
                                    >
                                      Xoá
                                    </DropdownItem>
                                  </DropdownMenu>

                                </ButtonDropdown>
                              </td>
                            </tr>
                          ))
                      )
                    }
                  </tbody>
                </Table>
              </Card>
              {
                Array.isArray(dataStampPrice) && (
                  dataStampPrice.length > 0 && (
                    <Pagination
                      data={dataStampPrice}
                      listLength={listLengthStampPrice}
                      totalPage={totalPageStampPrice}
                      totalElement={totalElementStampPrice}
                      handlePageClick={this.handlePageClickStampPrice}
                    />
                  )
                )
              }
              <CreateNewPopup
                createNewModal={createNewModal}
                moduleTitle='Thêm mới'
                type100={true}
                moduleBody={
                  <AddNewStampPrice
                    id={idStampPrice}
                    errorInsert={errorInsertAlert}
                    onHandleChangeValue={this.onHandleChangeValue}
                  />}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                onConfirm={(data, close) => {
                  this.onConfimStampPrice(data, close);
                }}
              />
              <PopupMessage
                popupMessage={popupMessage}
                moduleTitle={'Thông báo'}
                moduleBody={messageErr}
                toggleModal={this.toggleModal}
              />

              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupModal={warningPopupDelStamp}
                toggleModal={this.toggleModalPopupDelete}
                handleWarning={this.handleDeleteStampPrice}
              />


              {/* Same as */}

            </div>
          </>) : null
          }
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
        />
      </div>

    )
  }
}

const Menu = props => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: 'absolute',
        zIndex: 2,
      }}
      {...props}
    />
  );
};
const Blanket = props => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div css={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);
const Svg = p => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...p}
  />
);
const DropdownIndicator = () => (
  <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>)

const mapStateToProps = state => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
    dataCompany: state.CompanyListRegisteredStore,
    stampTemplate: state.StampPlateStore
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
    ...bindActionCreators(actionCompanyListRegistered, dispatch),
    ...bindActionCreators(actionStampPlate, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ConfigSystem);