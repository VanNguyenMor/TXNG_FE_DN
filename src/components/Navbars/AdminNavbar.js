/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
//import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, IS_ADMIN, ACCOUNT_NAME, ACCOUNT_AVA, ACCOUNT_ID } from "../../services/Common";
import { deleteCookie } from "../../helpers/cookie";
import { actionCreators } from "../../actions/UserListActions.js";
import { actionStampProvideList } from "../../actions/StampProvideActions";
import { actionProducts } from "../../actions/ProductsActions";
import { MenuContext } from '../../helpers/common'
import { connect } from "react-redux";
import compose from 'recompose/compose';
import ChangeAvatar from "./ChangeAvatar";
import ChangePass from "./ChangePass";
import UpdatePopup from "../../components/UpdatePopup";
import UpdatePopup2 from "../../components/UpdatePopup2";
import UpdatePopup3 from "../../components/UpdatePopup3";
import PopupMessage from "../../components/PopupMessage";
import { actionDashboardCreators } from "../../actions/DashboardActions.js";
import moment from 'moment';
import PopupDetail from "./PopupDetail";
import PopupDetailUsed from "./PopupDetailUsed";
import WarningPopup from "../../components/WarningPopup";
import WarningPopupPlus from "../../components/WarningPopupPlus";
import ViewPopup from "../../components/ViewPopup";
import ViewModal from "./ViewModal";
import UnconfirmModal from "./UnconfirmModal"
import Kduyet from "assets/img/buttons/KhongDuyet.svg";
import Duyet from "assets/img/buttons/Duyet.svg";
import './Navbar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Button
} from "reactstrap";
import classes from './index.module.css';
import NoImg from "assets/img/NoImg/NoImg.jpg"
import { VARIABLES } from "../../helpers/constant";

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      details: null,
      notChang: false,
      fileView: null,
      alertAll: [],
      errorUpdate: {},
      statusChangePass: false,
      dataChangePass: null,
      errorPrint: {},
      dataProductsUnits: [],
      productFields: [],
      dataProducts: {},
      errorUpdateProduct: {},
      typePrint: 0,
    }
    this.refFileImage = null;
    this.isFetchingAlert = false;
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.dashboard;
    if (data) {
      if (data.getTotalAlert) {
        this.setState({ totalAlert: data.getTotalAlert || 0 })
      }
    }
  }

  componentDidMount() {
    const { getTotalAlerts } = this.props;

    getTotalAlerts().then(res => {
      if (res.status == 200) {
        this.setState({ totalAlert: res.data || 0 })
      }
    })
  }

  handleCloseApp = () => {
    const { userLogout } = this.props;
    userLogout()
      .then(res => (
        res.status === 200 && ((
          deleteCookie('AUTHEN_INFO'),
          window.location.href = '/'
        ))
      ));
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
      details: null,
      errorUpdate: {},
      errorPrint: {},
      errorUpdateProduct: {}
    });
  };

  handleNewDataUpdate = (data) => {
    this.setState({ file: data.ThumbnailFile, fileView: data.fileView })
  }

  handleNewDataChangePass = (data) => {
    this.setState({ dataChangePass: data })
  }

  handleOpenEdit = () => {
    const { getUserInfo } = this.props;
    // getUserInfo(ACCOUNT_ID).then(res => {
    getUserInfo(localStorage.getItem('ACCOUNT_ID')).then(res => {
      if (res.data.status == 200) {
        this.setState({ details: res.data.data });
      }
    })
  }

  handleChangePass = (val) => {
    const { changPassword } = this.props;
    const { dataChangePass } = this.state;
    const errorUpdate = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    let _dataChangePass = {
      passwordOld: '',
      passwordNew: '',
      repeatPassword: ''
    }

    _dataChangePass = {
      passwordOld: (dataChangePass || {}).passwordOld ? (dataChangePass || {}).passwordOld : '',
      passwordNew: (dataChangePass || {}).passwordNew ? (dataChangePass || {}).passwordNew : '',
      repeatPassword: (dataChangePass || {}).repeatPassword ? (dataChangePass || {}).repeatPassword : ''
    }

    if (!_dataChangePass.passwordOld) {
      errorUpdate['passwordOld'] = 'Mật khẩu cũ không được bỏ trống';
    }
    if (!_dataChangePass.passwordNew) {
      errorUpdate['passwordNew'] = 'Mật khẩu mới không được bỏ trống';
    }
    if (!_dataChangePass.repeatPassword) {
      errorUpdate['repeatPassword'] = 'Nhắc lại không được bỏ trống';
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
        errorUpdate: {},
      }
    });

    changPassword(JSON.stringify(_dataChangePass)).then((res) => {
      if (res.data.status == 200) {
        this.toggleModal('updateModal2');
        this.setState({ messageNoti: res.data.message, statusChangePass: true })
        this.toggleModal('popupMessage');
      } else {
        this.setState({ messageNoti: res.data.message || 'Thay đổi mật khẩu thất bại!', statusChangePass: false })
        this.toggleModal('popupMessage');
      }
    })

  }

  handleUpdateData = (val) => {
    const { file, details } = this.state;
    const { updateMe } = this.props;
    const formData = new FormData();
    // formData.append('ID', ACCOUNT_ID);
    formData.append('ID', localStorage.getItem('ACCOUNT_ID'));
    formData.append('FullName', details.FullName);
    formData.append('PhoneNumber', details.PhoneNumber);
    formData.append('Position', details.Position);
    formData.append('Department', details.Department);
    formData.append('RoleID', details.RoleID);
    formData.append('UserName', details.UserName);
    formData.append('Email', details.Email);
    formData.append('PasswordHash', details.PasswordHash);
    formData.append('PasswordConfirm', "");
    formData.append('AvatarFile', file);
    // formData.append('Avatar', "");
    updateMe(formData).then(res => {
      if (res.data.status == 200) {
        this.setState({ notChang: true });
        //window.location.reload();
        this.toggleModal('updateModal')
      }
    })
  }

  onUpdateFileImage = () => {
    this.refFileImage.click();
  }

  click = () => {
    const { getAlerts, getTotalAlerts } = this.props;
    getAlerts({
      page: 0,
      limit: 100
    }).then((res) => {
      if (res.status == 200) {
        this.setState({ alertAll: res.data })
      }
    })
    getTotalAlerts().then(res => {
      if (res.status == 200) {
        this.setState({ totalAlert: res.data })
      }
    })
  }

  Dadoc = () => {
    const { getReadAll } = this.props;
    getReadAll().then((res) => {
      if (res.status == 200) {
        this.click();
      }
    });
  }

  read = (id) => {
    const { getRead } = this.props;

    if (id != "") {
      getRead(id).then((res) => {
        if (res.status == 200) {
          this.click();
        }
      })
    }
  }

  onOpenPopupDetail = (id) => {
    const { detail } = this.props;
    detail(id).then(res => {
      const data = ((res.data || {}).data || {}).stamp || null;

      if (!data) {
        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: 'Tem này không tồn tại',
            message: 'Tem này không tồn tại',
            popupMessage: true
          }
        });

        return;
      }

      this.setState(previousState => {
        return {
          ...previousState,
          isPopupDetail: id,
          idHasPrinred: id,
          dataPopupDetail: data
        }
      });
    });
  }

  onOpenPopupDetailUsed = (id) => {
    const { detail } = this.props;
    detail(id).then(res => {
      const data = ((res.data || {}).data || {}).stamp || null;

      if (!data) {
        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: 'Tem này không tồn tại',
            message: 'Tem này không tồn tại',
            popupMessage: true
          }
        });

        return;
      }

      this.setState(previousState => {
        return {
          ...previousState,
          isPopupDetailUsed: id,
          dataPopupDetailUsed: data
        }
      });
    });
  }

  onChangeReason = e => {
    const value = e.target.value || '';

    this.setState(previousState => {
      return {
        ...previousState,
        reasonUnConfirm: value
      }
    });
  }

  onChangeReasonUsed = e => {
    const value = e.target.value || '';

    this.setState(previousState => {
      return {
        ...previousState,
        reasonUnConfirmUsed: value
      }
    });
  }

  onClosePopupDetail = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetail: false,

      }
    });
  }

  onClosePopupDetailUsed = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetailUsed: false,

      }
    });
  }

  onConfirmPopupDetail = () => {
    const { isPopupDetail, partnerId, dataPopupDetail, reasonUnConfirm } = this.state;
    const { requestComfirmStampProvide, requestStampProvideList } = this.props;
    const { requestSendMail } = this.props;
    const { idHasPrinred, typePrint } = this.state;
    

    const errorPrint = {}
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint
      }
    })

    if (!isPopupDetail) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng chọn tem muốn duyệt',
          message: 'Bạn vui lòng chọn tem muốn duyệt',
          popupMessage: true
        }
      });
      return;
    }
    if (dataPopupDetail.IsPrint == false) {
      if (!partnerId) {
        errorPrint.err = "Đơn vị in tem không được bỏ trống"
      }
    }
    // if (!reasonUnConfirm) {
    //   errorPrint.Reason = "Lý do không duyệt không được bỏ trống"
    // }

    if (Object.keys(errorPrint).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorPrint
        }
      })
      return;
    }
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint: {}
      }
    })

    requestComfirmStampProvide("id=" + isPopupDetail + "&partnerId=" + partnerId).then(res => {
      const status = (res.data || {}).status;

      if (status == 404) {
        const message = (res.data || {}).message;

        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: message,
            popupMessage: true,
            message
          }
        });
      } else {
        this.setState(previousState => {
          return {
            ...previousState,
            isPopupDetail: false,
            fetching: false,
            data: [],
            dataPopupDetail: null
          }
        }, () => {
          //this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC", "page": null, "limit": null }));
          toast.success('Duyệt cấp phát tem thành công!')
          this.setState({ isLoaded: true });
          // this.toggleModal('updateModal3')
          requestSendMail(idHasPrinred + '&type=' + typePrint).then(res => {
            
            if (res.data.status == 200) {
              
              this.setState({ isLoaded: false });
              requestStampProvideList(JSON.stringify({
                "search": "",
                "filter": "",
                "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
                "page": null,
                "limit": null
              }));

              toast.success('Gửi mẫu tem cho nhà in thành công!')
            } else {
              this.setState({ isLoaded: false });
              this.setState({ message: res.data.message })
              this.toggleModal('popupMessage');
            }

          })
        });

      }
    });

  }

  onChangePrinter = (value) => {
    console.log(value);
    this.setState({ typePrint: Number(value || 0) });
  }

  onConfirmPopupDetailUsed = () => {
    const { isPopupDetailUsed } = this.state;
    const { requestComfirmStampRequestUsed } = this.props;
    const errorPrint = {}
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint
      }
    })

    if (!isPopupDetailUsed) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng chọn tem muốn duyệt',
          message: 'Bạn vui lòng chọn tem muốn duyệt',
          popupMessage: true
        }
      });
      return;
    }

    if (Object.keys(errorPrint).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorPrint
        }
      })
      return;
    }
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint: {}
      }
    })

    requestComfirmStampRequestUsed("id=" + isPopupDetailUsed).then(res => {
      const status = (res.data || {}).status;

      if (status == 404) {
        const message = (res.data || {}).message;

        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: message,
            popupMessage: true,
            message
          }
        });
      } else {
        this.setState(previousState => {
          return {
            ...previousState,
            isPopupDetailUsed: false,
            fetching: false,
            data: [],
            dataPopupDetailUsed: null
          }
        });
      }
    });

  }

  handleChangePartner = (event) => {

    this.setState({ partnerId: event });
  }

  handleConfirmStamp = () => {
    const { confirmItem } = this.state;

    if (typeof (confirmItem) !== 'undefined') {
      this.fetchSummaryComfirm(confirmItem);
    }
  }

  fetchSummaryComfirm = (id) => {
    const { requestComfirmStampProvide } = this.props;

    requestComfirmStampProvide("id=" + id + "&partnerId=" + id).then(res => {
      if (res.data.status == 404) {
        this.toggleModal('popupMessage')
        this.setState({
          messageNoti: res.data.message
        })
      }
    })
    this.setState({ fetching: true, isLoaded: true, status: null });
  }

  onUnConfirmPopupDetail = () => {
    const { isPopupDetail, reasonUnConfirm, dataPopupDetail } = this.state;
    const { requestUncomfirmStampProvide } = this.props;

    if (!isPopupDetail) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng chọn tem muốn không duyệt',
          message: 'Bạn vui lòng chọn tem muốn không duyệt',
          popupMessage: true
        }
      });

      return;
    }

    if (!reasonUnConfirm) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng nhập lý do không duyệt',
          message: 'Bạn vui lòng nhập lý do không duyệt',
          popupMessage: true,
          dataPopupDetail: null
        }
      });

      return;
    }

    const data = JSON.stringify({
      id: isPopupDetail,
      reason: reasonUnConfirm
    });

    requestUncomfirmStampProvide(data).then(res => {
      const status = ((res || {}).data || {}).status;

      if (status == 404) {
        const message = (res.data || {}).message;

        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: message,
            message,
            popupMessage: true
          }
        });
      } else {
        this.setState(previousState => {
          return {
            ...previousState,
            isPopupDetail: false,
            fetching: false,
            data: []
          }
        });
      }
    })

    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetail: false
      }
    });
  }

  onUnConfirmPopupDetailUsed = () => {
    const { isPopupDetailUsed, reasonUnConfirmUsed } = this.state;
    const { requestUncomfirmStampRequestUsed } = this.props;

    if (!isPopupDetailUsed) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng chọn tem muốn không duyệt',
          message: 'Bạn vui lòng chọn tem muốn không duyệt',
          popupMessage: true
        }
      });

      return;
    }

    if (!reasonUnConfirmUsed) {
      this.setState(previousState => {
        return {
          ...previousState,
          errMesageFail: 'Bạn vui lòng nhập lý do không duyệt',
          message: 'Bạn vui lòng nhập lý do không duyệt',
          popupMessage: true,
          dataPopupDetailUsed: null
        }
      });

      return;
    }

    const data = JSON.stringify({
      id: isPopupDetailUsed,
      reason: reasonUnConfirmUsed
    });

    requestUncomfirmStampRequestUsed(data).then(res => {
      const status = ((res || {}).data || {}).status;

      if (status == 404) {
        const message = (res.data || {}).message;

        this.setState(previousState => {
          return {
            ...previousState,
            errMesageFail: message,
            message,
            popupMessage: true
          }
        });
      } else {
        this.setState(previousState => {
          return {
            ...previousState,
            isPopupDetailUsed: false,
            fetching: false,
            data: []
          }
        });
      }
    })

    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetailUsed: false
      }
    });
  }

  onOpenPopupView = (id) => {
    const { requestGetProducts, requestListProductsAlert } = this.props;
    let dataCurentPop;
    requestListProductsAlert().then(res => {
      if (res.data.status == 200) {
        let productTH = res.data.data.products;
        dataCurentPop = productTH.filter(p => p.id == id);

        this.setState({ dataCurentPop: dataCurentPop[0] }, () => {
          this.toggleModal('viewModal');
          requestGetProducts(id).then(res => {

            const data = res.data || {};

            let dataProducts = (data || {}).product || {};
            let dataProductsUnits = (data || {}).productsUnits || [];
            let productFields = (data || {}).productFields || [];

            this.setState(previousState => {
              return {
                ...previousState,
                idCurRow: id,
                dataProducts,
                dataProductsUnits,
                productFields
              }
            });
          });
        })
      }
    })
  }

  handleConfirmProducts = () => {
    const { idCurRow } = this.state;
    const { requestConfirmProducts } = this.props;
    if (idCurRow) {
      requestConfirmProducts(idCurRow).then(res => {
        if (res.status == 200) {
          this.toggleModal('viewModal');
        } else {
          this.setState({
            messageNoti: res.message
          })
          this.toggleModal('popupMessage');
        }
      })

    }
  }

  handleNewDataUncomfirm = (data) => {
    this.setState({ newDataUnCon: data });
  }

  handleUnConfirmProducts = (value) => {
    const { newDataUnCon, idCurRow } = this.state;
    const { requestUnConfirmProducts } = this.props;
    const errorUpdateProduct = {};

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdateProduct
      }
    });

    if (!(newDataUnCon || {}).reason) {
      errorUpdateProduct['reason'] = 'Lý do không được bỏ trống';
    }

    if (Object.keys(errorUpdateProduct).length > 0) {
      this.setState(previousState => {
        return {
          ...previousState,
          errorUpdateProduct,
        }
      });

      return;
    }

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdateProduct: {},
      }
    });

    requestUnConfirmProducts(idCurRow + '&reason=' + newDataUnCon.reason).then(res => {
      if (res.status == 200) {
        this.toggleModal('viewModal');
        this.toggleModal('updateModal3');
      } else {
        this.setState({ errMesageFail: res.message });
        this.toggleModal('popupMessage')
      }
    })
  }

  render() {
    const {
      newData,
      updateModal,
      details,
      activeCreateSubmit,
      notChang,
      fileView,
      alertAll,
      updateModal2,
      popupMessage,
      messageNoti,
      statusChangePass,
      totalAlert,
      isPopupDetail,
      errorPrint,
      dataPopupDetail,
      reasonUnConfirm,
      warningPopupModal,
      viewModal,
      productFields,
      dataCurentPop,
      dataProductsUnits,
      dataProducts,
      warningPopupModalPlus,
      updateModal3,
      errorUpdateProduct,
      dataPopupDetailUsed,
      isPopupDetailUsed,
      reasonUnConfirmUsed
    } = this.state;

    let isDisableConfirm = true;
    let isDisableUnconfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    // if (IS_ADMIN) {
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
      isDisableUnconfirm = false;

    } else {
      // ACCOUNT_CLAIM_FF.filter(x => x == "Products.Confirm").map(y => isDisableConfirm = false)
      // ACCOUNT_CLAIM_FF.filter(x => x == "Products.Unconfirm").map(y => isDisableUnconfirm = false)
      
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");
      ACCOUNT_CLAIM_FF.filter(x => x == "Products.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Products.Unconfirm").map(y => isDisableUnconfirm = false)

    }

    return (
      <>
        {
          <Navbar className={`navbar-top navbar-dark bg-gradient-info ${classes.headerNavbar}`} expand="md" id="navbar-main">
            <Container fluid>
              <div className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
                <MenuContext.Consumer>
                  {value => (
                    <>
                      {value.data}
                    </>
                  )}
                </MenuContext.Consumer>
              </div>
              {/* <Link
                className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                to="/"
              >
                {props.brandText}
              </Link> */}

              <Nav className="align-items-center d-none d-md-flex" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle nav className="nav-link-icon" style={{ position: 'relative' }}
                    onClick={() => this.click()}
                  >
                    <i className="ni ni-bell-55" style={{ fontSize: 24 }} />
                    {(totalAlert > 0) && (

                      <div style={{
                        border: "1px solid red",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        background: "red",
                        color: "#fff",
                        position: "absolute",
                        right: "11px",
                        top: "-3px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "10px"
                      }}>
                        {totalAlert}
                      </div>
                    )}
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-default_dropdown_1"
                    className="dropdown-menu-arrow"
                    right
                  >
                    <div style={{
                      padding: "0 10px",
                      borderBottom: "1px solid gray",
                      textAlign: 'right',
                      margin: 0,
                    }}>
                      <a
                        style={{
                          fontWeight: "bold",
                          color: "#000",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          this.Dadoc();
                        }}
                      >
                        Đọc tất cả
                      </a>
                    </div>
                    <div style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      height: 450,
                      width: 400,
                      cursor: 'pointer'
                    }}
                      className={classes.hoverNoti}
                    >
                      {alertAll.map((item, key) => {
                        return (
                          <div
                            key={key}
                            style={{
                              padding: "0 10px",
                              borderBottom: "1px solid gray",
                            }}
                            onClick={() => {
                              this.read(item.status == 1 ? '' : item.id);
                              if (item.alertTypeID == 1) {
                                this.onOpenPopupDetail(item.refID);
                              }
                              if (item.alertTypeID == 3) {
                                this.onOpenPopupView(item.refID)
                              }
                              if (item.alertTypeID == 18) {
                                this.onOpenPopupDetailUsed(item.refID)
                              }
                            }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                color: item.status == 0 ? "#000" : '#65676B'
                              }}>
                              Bởi: <i style={{ fontWeight: 'bold' }}>{item.sentBy}</i>
                            </p>
                            <div style={{ display: "flex", marginRight: 0, marginLeft: 0 }}>
                              <div style={{
                                fontSize: 14,
                                margin: 0,
                                color: item.status == 0 ? "#000" : '#65676B',
                                flex: 1
                              }}>
                                {item.content}
                              </div>
                              {item.status == 0 && (
                                <div
                                  style={{
                                    backgroundColor: '#09b2fd',
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    verticalAlign: "middle",
                                    alignSelf: "center"
                                  }}>
                                </div>
                              )}

                            </div>
                            <p style={{
                              margin: 0,
                              fontSize: 12,
                              color: item.status == 0 ? "#000" : '#65676B',
                              textAlign: 'right',
                              fontWeight: item.status == 0 ? 'bold' : 'normal',
                            }}>
                              {moment(item.sentDate).format('HH:mm DD/MM/YYYY')}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <Media className="align-items-center">
                      <div className="avatar avatar-sm rounded-circle">
                        {
                          // (ACCOUNT_AVA !== null && fileView !== null) ||
                          //   (ACCOUNT_AVA == null && fileView !== null) ||
                          //   (ACCOUNT_AVA !== null && fileView == null) ? (
                          //   <div id='avatar' className={`${classes.avatar} ${classes.avatarBck}`}
                          //     style={{
                          //       background: `url(${notChang == true ? (fileView == null ? NoImg : fileView) : ACCOUNT_AVA})`
                          //     }} />
                          (localStorage.getItem('ACCOUNT_AVA') && localStorage.getItem('ACCOUNT_AVA') !== 'null' && fileView !== null) ||
                            (!localStorage.getItem('ACCOUNT_AVA') && localStorage.getItem('ACCOUNT_AVA') !== 'null' && fileView !== null) ||
                            (localStorage.getItem('ACCOUNT_AVA') && localStorage.getItem('ACCOUNT_AVA') !== 'null' && fileView == null) ? (
                            <div id='avatar' className={`${classes.avatar} ${classes.avatarBck}`}
                              style={{
                                background: `url(${notChang == true ? (fileView == null ? NoImg : fileView) : localStorage.getItem('ACCOUNT_AVA')})`
                              }} />
                          ) : (
                            // <i className={`ni ni-circle-08 ${classes.avatar}`} />
                            <div id='avatar'
                              className={`${classes.avatar} ${classes.avatarBck}`}
                              style={{
                                background: `url(${NoImg})`
                              }} />
                          )
                        }
                      </div>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {/* {ACCOUNT_NAME} */}
                          {localStorage.getItem('ACCOUNT_NAME')}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>

                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem onClick={() => {
                      this.toggleModal('updateModal2');
                    }}>
                      <i className="ni ni-single-02" />
                      <span>Đổi mật khẩu</span>
                    </DropdownItem>
                    {/* {ACCOUNT_NAME == "Administrator" ? null : ( */}
                    {localStorage.getItem('ACCOUNT_NAME') == "Administrator" ? null : (
                      <DropdownItem onClick={() => {
                        this.toggleModal('updateModal');
                        this.handleOpenEdit();
                      }}>
                        <div className={classes.updateAvaArea}>
                          <div className="upload-btn-wrapper">
                            <div>
                              <i className={`ni ni-circle-08 ${classes.updateAva}`} />
                              <span>Đổi hình đại diện</span>
                            </div>

                          </div>
                        </div>
                      </DropdownItem>
                    )}
                    <DropdownItem divider />
                    <DropdownItem onClick={() => this.handleCloseApp()}>
                      <i className="ni ni-user-run" />
                      <span>Đăng xuất</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

              </Nav>

            </Container>
          </Navbar>

        }
        {
          details ?
            <UpdatePopup
              moduleTitle='Đổi hình đại diện'
              moduleBody={
                <ChangeAvatar
                  data={details}
                  handleNewData={this.handleNewDataUpdate}
                  handleCheckValidation={this.handleCheckValidation}
                  //imgAvatarView={ACCOUNT_AVA} 
                  imgAvatarView={localStorage.getItem('ACCOUNT_AVA')}
                />}
              newData={newData}
              updateModal={updateModal}
              toggleModal={this.toggleModal}
              activeSubmit={activeCreateSubmit}
              handleUpdateInfoData={this.handleUpdateData}
            />
            : null
        }

        <WarningPopup
          moduleTitle='Thông báo'
          moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý duyệt thông tin này?</p>}
          warningPopupModal={warningPopupModal}
          toggleModal={this.toggleModal}
          handleWarning={this.handleConfirmStamp}
        />

        <WarningPopupPlus
          moduleTitle="Thông báo"
          warningPopupModalPlus={warningPopupModalPlus}
          toggleModal={this.toggleModal}
          moduleBody={
            <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý duyệt thông tin này?</p>
          }
          handleWarning={this.handleConfirmProducts}
        />

        <UpdatePopup2
          moduleTitle='Đổi mật khẩu'
          moduleBody={
            <ChangePass
              handleNewData={this.handleNewDataChangePass}
              handleCheckValidation={this.handleCheckValidation}
              errorUpdate={this.state.errorUpdate}
            />}
          newData={newData}
          updateModal2={updateModal2}
          resize={'md'}
          toggleModal={this.toggleModal}
          activeSubmit={activeCreateSubmit}
          handleUpdateInfoData={this.handleChangePass}
        />

        <UpdatePopup3
          moduleTitle='Thông báo'
          moduleBody={
            <UnconfirmModal
              errorUpdate={errorUpdateProduct}
              handleCheckValidation={this.handleCheckValidation}
              handleNewData={this.handleNewDataUncomfirm}
            />}
          newData={newData}
          updateModal3={updateModal3}
          toggleModal={this.toggleModal}
          activeSubmit={activeCreateSubmit}
          handleUpdateInfoData={this.handleUnConfirmProducts}
        />

        {(isPopupDetail && dataPopupDetail) &&
          <PopupDetail
            errorPrint={errorPrint}
            data={dataPopupDetail}
            isShow={isPopupDetail}
            reason={reasonUnConfirm}
            onChangeReason={this.onChangeReason}
            onClose={this.onClosePopupDetail}
            onConfirm={this.onConfirmPopupDetail}
            onUnConfirm={this.onUnConfirmPopupDetail}
            handleChangePartner={this.handleChangePartner}
            onChangePrinter={this.onChangePrinter}
          />
        }

        {(isPopupDetailUsed && dataPopupDetailUsed) &&
          <PopupDetailUsed
            errorPrint={errorPrint}
            data={dataPopupDetailUsed}
            isShow={isPopupDetailUsed}
            reason={reasonUnConfirmUsed}
            onChangeReason={this.onChangeReasonUsed}
            onClose={this.onClosePopupDetailUsed}
            onConfirm={this.onConfirmPopupDetailUsed}
            onUnConfirm={this.onUnConfirmPopupDetailUsed}

          />
        }

        <ViewPopup
          classNameModalBody='product-view-popup-modal-body'
          moduleTitle='Thông tin sản phẩm'
          moduleBody={
            <ViewModal
              dataProducts={dataProducts && dataProducts}
              dataProductsUnits={dataProductsUnits && dataProductsUnits}
              dataCurentPop={dataCurentPop && dataCurentPop}
              productFields={productFields && productFields}
            />}
          viewModal={viewModal}
          toggleModal={this.toggleModal}
          activeSubmit={activeCreateSubmit}
        // componentFooter={
        //   <>
        //     {dataCurentPop && (
        //       <div>
        //         {dataCurentPop.confirmedStatus == 0
        //           || dataCurentPop.confirmedStatus == 3
        //           || isDisableConfirm == true && isDisableUnconfirm == true ? (
        //           <div className="modal-footer" style={{ marginRight: '-20px' }}>
        //             {isDisableConfirm == false ? (
        //               <div>
        //                 <Button
        //                   color="success"
        //                   type="button"
        //                   className={`btn-success-cs`}
        //                   style={{ marginRight: '26px !important', }}
        //                   onClick={() => {
        //                     this.toggleModal('warningPopupModalPlus');
        //                   }}
        //                 >
        //                   <img src={Duyet} alt='Duyệt' />
        //                   <span>Duyệt</span>
        //                 </Button>
        //               </div>
        //             ) : null}
        //             {isDisableUnconfirm == false ? (
        //               <div>
        //                 <Button
        //                   color="default"
        //                   type="button"
        //                   style={{ backgroundColor: '#FF3333' }}
        //                   className={`btn-danger-cs css-button-no-yes-product`}
        //                   onClick={() => {
        //                     this.toggleModal('updateModal3');
        //                   }}
        //                 >
        //                   <img src={Kduyet} alt='Không duyệt' />
        //                   <span>Không duyệt</span>
        //                 </Button>
        //               </div>
        //             ) : null}
        //           </div>
        //         ) : null}
        //       </div>
        //     )}
        //   </>
        // }
        />

        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={'Thông báo'}
          logout={statusChangePass ? true : false}
          moduleBody={statusChangePass ? (
            <>
              <div>{messageNoti}</div>
              <div>Vui lòng đăng nhập lại.</div>
            </>
          ) : (messageNoti)}
          toggleModal={this.toggleModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.UserListStore,
    dashboard: state.DashboardStore,
    stampprovide: state.StampProvideStore,
    products: state.ProductsStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionCreators, dispatch),
    ...bindActionCreators(actionDashboardCreators, dispatch),
    ...bindActionCreators(actionStampProvideList, dispatch),
    ...bindActionCreators(actionProducts, dispatch),
  }
}

export default
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(AdminNavbar);
