import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionStampProvideList } from "../../../actions/StampProvideActions";
import { STAMPPROVIDE_LIST_HEADER } from "../../../helpers/constant";
import { setAlertContext, openAlertContext, handleCurrencyFormat } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import moment from 'moment';
import MenuButton from "../../../assets/img/buttons/menu.png";
import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
import UnComfirmIcon from "../../../assets/img/buttons/unconfirm.png";
import Pagination from "components/Pagination";
import HeaderTableCustom from "components/HeaderTableCustom";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Select from "components/Select";
import UpdateModal from "./UpdateModal";
import CreateNewPopup from "../../../components/CreateNewPopup";
import WarningPopup from "../../../components/WarningPopup";
import WarningPopupPlus from "../../../components/WarningPopupPlus";
import WarningPopupDel from "../../../components/WarningPopupDel";
import classes from './index.module.css';
import PopupMessage from "../../../components/PopupMessage";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import SearchModal from "./SearchModal";
import InputPrintModal from "./InputPrintModal";
import UpdatePopup from "../../../components/UpdatePopup";
import UpdatePopup2 from "../../../components/UpdatePopup2";
import UpdatePopup3 from "../../../components/UpdatePopup3";
import QRCode from 'qrcode.react';
import PrintPopup from "components/PrintPopup";
import PrintFormStampQR from "../../../components/PrintFormStampQR";
import PopupDetail from "./PopupDetail";
import UpdateModal2 from "./UpdateModal2";
import UpdateModal3 from "./UpdateModal3";
import ReactDatetime from "react-datetime";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import './StampProvide.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip
} from "reactstrap";

class StampProvide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: false,
      status: null,
      open: false,
      comfirm: null,
      stampprovide: null,
      fetching: false,
      message: '',
      errMesageFail: '',
      history: [],
      newData: [],
      statusList: [
        { name: 'Chờ duyệt', status: 1 },
        { name: 'Đã duyệt', status: 2 },
        { name: 'Không duyệt', status: 3 }
      ],
      statusPrint: [
        { name: 'Chưa gửi mẫu tem', printStatus: 0 },
        { name: 'Đã gửi mẫu tem ', printStatus: 1 },
        { name: 'Đã hẹn ngày trả tem', printStatus: 2 },
        { name: 'Đã giao tem', printStatus: 3 }
      ],

      typePrint: 0,

      stampprovide: [],
      formatItemPosition: [
        {
          position: [1],
          styleSS: this.handleStatusOfStamp
        }
      ],
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      filter: {
        "status": null,
        "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
        "toDate": new Date(),
        "companyName": "",
        "taxCode": "",
        "search": "",
        "printStatus": null,
        "filter": "",
        "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
        "page": null,
        "limit": null
      },
      headerTitle: STAMPPROVIDE_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      confirmItem: null,
      warningPopupModal: false,
      warningPopupUnConfirmModal: false,
      activeCreateSubmit: false,
      createNewModal: false,
      isPopupDetail: false,
      reasonUnConfirm: '',
      dataPopupDetail: null,
      errorPrint: {},
      warningPopupModalPlus: false,
      warningPopupDelModal: false,


    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.stampprovide;
    const { limit, fetching } = this.state;

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.stampprovide) !== 'undefined') {
          if (data.stampprovide !== null) {
            if (typeof (data.stampprovide.stamps) !== 'undefined') {
              data.stampprovide.stamps.map((item, key) => {

                if (item.statusReceipts == 0) {
                  item['statusReceiptsName'] = 'Chưa thu tiền'
                } else if (item.statusReceipts == 1) {
                  item['statusReceiptsName'] = 'Đã thu hết'
                } else if (item.statusReceipts == 2) {
                  item['statusReceiptsName'] = 'Thu chưa hết'
                };

                if (item.status == 0) {
                  item['statusName'] = 'Chờ duyệt yêu cầu'
                }
                else if (item.status == 1) {
                  item['statusName'] = 'Chờ duyệt để in'
                } else if (item.status == 2) {
                  item['statusName'] = 'Đã duyệt'
                } else if (item.status == 3) {
                  item['statusName'] = 'Không duyệt'
                };

                item['index'] = key + 1;
                item['collapse'] = false;
                item['requestedDate'] = item.requestedDate ? moment(item.requestedDate).format('DD/MM/YYYY') : '';
                item['confirmedDate'] = item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYY') : '';

              });
              this.setState({
                data: data.stampprovide.stamps,
                history: data.stampprovide.stamps,
                listLength: data.stampprovide.total,
                totalPage: Math.ceil(data.stampprovide.stamps.length / limit),
                isLoaded: false,
                totalElement: data.stampprovide.total > limit ? limit : data.stampprovide.total,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                history: data.stampprovide.stamps,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        // if (typeof (data.confirm) !== 'undefined') {
        //   if (fetching) {
        //     this.setState({ data: [] });
        //     this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC", "page": null, "limit": null }));
        //     this.setState({ fetching: false });
        //   }

        //   setTimeout(() => {
        //     this.setState({
        //       isLoaded: false,
        //       status: data.status,
        //       message: PLEASE_CHECK_CONNECT(data.message)
        //     });
        //   }, 500);
        // }

        if (typeof (data.unconfirm) !== 'undefined') {
          if (fetching) {
            this.setState({ data: [] });
            this.fetchSummary(JSON.stringify({
              "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
              "toDate": new Date(),
              "search": "",
              "filter": "",
              "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
              "page": null,
              "limit": null
            }));
            this.setState({ fetching: false });
          }

          setTimeout(() => {
            this.setState({
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }, 30000);
        }
      }
    }

  }


  handleStatusOfStamp = (ele) => {

    if (ele.status.indexOf('Chưa duyệt') > -1) return 'not-yet-confirm-style';
    if (ele.status.indexOf('Đã duyệt') > -1) return 'confirm-style';
    if (ele.status.indexOf('Không duyệt') > -1) return 'not-confirm-style';
    else return '';
  }

  handleConfirmStamp = () => {
    const { confirmItem } = this.state;

    if (typeof (confirmItem) !== 'undefined') {
      this.fetchSummaryComfirm(confirmItem);
    }
  }

  handleConfirmPrintedStamp = () => {

  }

  handleConfirmDeliveredStamp = () => {
    const { hasDeliveredStamp } = this.props;
    const { idHasDelevered } = this.state;

    hasDeliveredStamp(idHasDelevered).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
          "toDate": new Date(),
          "search": "",
          "filter": "",
          "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
          "page": null,
          "limit": null
        }));
        toast.success('Thông báo đã giao tem thành công!');
      } else {
        this.setState({ message: res.data.message })
        this.toggleModal('popupMessage');
      }
    })
  }

  onConfirmPopupDetail = () => {
    const { isPopupDetail, partnerId, dataPopupDetail, reasonUnConfirm } = this.state;
    const { requestComfirmRequestPrintStampProvide } = this.props;
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
    // if (dataPopupDetail.IsPrint == false) {
    //   if (!partnerId) {
    //     errorPrint.err = "Đơn vị in tem không được bỏ trống"
    //   }
    // }
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

    requestComfirmRequestPrintStampProvide(isPopupDetail).then(res => {
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

          toast.success('Duyệt cấp phát tem thành công!')
          this.fetchSummary(JSON.stringify({
            "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
            "toDate": new Date(),
            "search": "",
            "filter": "",
            "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
            "page": null,
            "limit": null
          }));
          //this.setState({ isLoaded: true });
          // this.toggleModal('updateModal3')
          // requestSendMail(idHasPrinred + '&type=' + typePrint).then(res => {

          //   if (res.data.status == 200) {
          //     this.setState({ isLoaded: false });
          //     this.fetchSummary(JSON.stringify({
          //       "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
          //       "toDate": new Date(),
          //       "search": "",
          //       "filter": "",
          //       "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
          //       "page": null,
          //       "limit": null
          //     }));

          //     toast.success('Gửi mẫu tem cho nhà in thành công!')
          //   } else {
          //     this.setState({ isLoaded: false });
          //     this.setState({ message: res.data.message })
          //     this.toggleModal('popupMessage');
          //   }

          // })
        });

      }
    });

  }

  onConfirmPopupDetailUsed = () => {
    const { isPopupDetail, partnerId, dataPopupDetail, reasonUnConfirm } = this.state;
    const { requestComfirmStampProvide } = this.props;
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
    // if (dataPopupDetail.IsPrint == false) {
    //   if (!partnerId) {
    //     errorPrint.err = "Đơn vị in tem không được bỏ trống"
    //   }
    // }
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
          // this.setState({ isLoaded: true });
          // this.toggleModal('updateModal3');

          // requestSendMail(idHasPrinred + '&type=' + typePrint).then(res => {
          //   if (res.data.status == 200) {
          //     this.setState({ isLoaded: false });
          //     this.fetchSummary(JSON.stringify({
          //       "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
          //       "toDate": new Date(),
          //       "search": "",
          //       "filter": "",
          //       "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
          //       "page": null,
          //       "limit": null
          //     }));

          //     toast.success('Gửi mẫu tem cho nhà in thành công!')
          //   } else {
          //     this.setState({ isLoaded: false });
          //     this.setState({ message: res.data.message })
          //     this.toggleModal('popupMessage');
          //   }

          // })
        });

      }
    });

  }

  onUnConfirmPopupDetail = () => {
    const { isPopupDetail, reasonUnConfirm, dataPopupDetail } = this.state;
    const { requestUncomfirmStampProvide } = this.props;
    const errorPrint = {}
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint
      }
    })

    if (!reasonUnConfirm) {
      errorPrint.Reason = "Bạn vui lòng nhập lý do không duyệt"
    }

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
    // if (!reasonUnConfirm) {
    //   this.setState(previousState => {
    //     return {
    //       ...previousState,
    //       errMesageFail: 'Bạn vui lòng nhập lý do không duyệt',
    //       message: 'Bạn vui lòng nhập lý do không duyệt',
    //       popupMessage: true,
    //       dataPopupDetail: null
    //     }
    //   });

    //   return;
    // }

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
        }, () => {
          this.fetchSummary(JSON.stringify({
            "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
            "toDate": new Date(),
            "search": "",
            "filter": "",
            "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
            "page": null,
            "limit": null
          }));
        });
        toast.success('Không duyệt cấp phát tem!')
      }
    })

    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetail: false
      }
    });
  }

  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  componentUnComfirmMount = (value) => {
    let { data } = this.state;

    const { requestUncomfirmStampProvide } = this.props;
    const createData = JSON.stringify({
      id: value.id,
      reason: value.reason
    })

    this.handleClose(true);
    this.setState({ fetching: false });
    requestUncomfirmStampProvide(createData);
  }

  componentDidMount() {
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
      "toDate": new Date(),
      "search": "",
      "filter": "",
      "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
      "page": null,
      "limit": null
    }));
  }

  // componentDidUpdate() {
  //   // This method is called when the route parameters change
  //   this.closeStatusModal();
  // }

  fetchSummary = (data) => {
    const { requestStampProvideList } = this.props;

    requestStampProvideList(data);
  }

  fetchSummaryComfirm = (id) => {
    const { requestComfirmStampProvide } = this.props;

    requestComfirmStampProvide("id=" + id + "&partnerId=" + id).then(res => {
      if (res.data.status == 404) {
        this.toggleModal('popupMessage')
        this.setState({
          errMesageFail: res.data.message
        })
      }
    })
    this.setState({ fetching: true, isLoaded: true, status: null });
  }

  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev['name']] = ev['value'];

    this.setState({ data });
  }

  closeStatusModal = () => {
    const { status, fetching } = this.state;

    if (status || !status) {
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

  handleStyleStatus = (status) => {
    if (status === 0) {
      return classes.awaitPrintStt;
    }
    if (status === 1) {
      return classes.notyetStt;
    }
    if (status == 2) {
      return classes.activeStt;
    }
    if (status == 3) {
      return classes.noActiveStt;
    };
  }

  handleStyleStatusReceipts = (status) => {
    if (status === 0) {
      return classes.noactiveStt01;
    }
    if (status === 1) {
      return classes.activeStt;
    }
    if (status === 2) {
      return classes.activeStt01;
    };
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
      detail: null,
      errorUpdate: {},
      errorPrint: {}

    });
  };

  onClosePopupDetail = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isPopupDetail: false,

      }
    });
  }

  onOpenPopupDetail = (id, isPrintState) => () => {
    const { detail } = this.props;

    this.setState({
      isPrintState: isPrintState
    })

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

  // checkDateStamp = () => {
  //   const {detail }= this.props
  //   const errorUpdateDate = {}

  // }

  onOpenUpdateDelivery = id => () => {
    const { detail } = this.props;

    detail(id).then(res => {
      const data = ((res.data || {}).data || {}).stamp || null;
      // console.log(data);
      // if (!data.deliveryDate) {
      //   this.state(previousState => {
      //     return {
      //       ...previousState,
      //       de
      //     }
      //   })
      // }
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
          deliveryId: id,
          dataPopupDetail: data
        }
      });
      this.toggleModal('updateModal');
    });
  }

  handleUpdateInfoData = (value) => {
    const { newData } = this.state;
    const { requestUncomfirmStampProvide } = this.props;
    const updateData = JSON.stringify({
      id: newData.id,
      reason: newData.reason
    });

    requestUncomfirmStampProvide(updateData);
    this.setState({ createNewModal: false, fetching: true, isLoaded: true, status: null });
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleNewDetail = (name, data) => {
    const { detail } = this.state;
    const newData = {
      ...detail
    };

    if (name !== null) {
      newData[name] = data;
      this.setState({ newData });
    }
  }

  handleSelectCS = (value, name) => {
    let { filter } = this.state;
    // if (value === null) value = "";
    filter[name] = value;
    this.setState({ filter });
  }

  handleSubmitSearchForm = () => {
    const { filter } = this.state;

    this.fetchSummary(JSON.stringify(filter));

  }

  clearFilter = () => {
    this.setState({
      filter: {
        "status": null,
        "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
        "toDate": new Date(),
        "companyName": "",
        "taxCode": "",
        "search": "",
        "printStatus": null,
        "filter": "",
        "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
        "page": null,
        "limit": null
      },
    })
  }

  handleChangeDate = (val, name) => {
    let { filter } = this.state;

    filter[name] = moment(new Date(val)).format('YYYY-MM-DD')
    if (name == 'fromDate') {
      this.setState({ fromDate: val })
    }
    if (name == 'toDate') {
      this.setState({ toDate: val })
    }
    this.setState({ filter });
  }

  componentPrint = (value) => {
    let { newDataPrint, reqId } = this.state;
    const { detail } = this.props;
    detail(value.id).then(res => {
      if (res.data.status) {
        this.setState({
          detailPrint: res.data.data.stamp
        })
      }
    })

    this.setState({ idPrinQR: value })

  }

  componentUpdateDeivery = () => {
    const { requestUpdateDeliveryStampProvide } = this.props;
    const { deliveryId, newDataUpdateDelivery } = this.state;
    const errorUpdate = {};
    let currentDate = new Date();
    let dateInput = new Date(newDataUpdateDelivery.deliveryDate)
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });
    if (newDataUpdateDelivery) {
      if (!newDataUpdateDelivery.deliveryDate) {
        errorUpdate['deliveryDate'] = 'Ngày trả tem không được bỏ trống';
      }

      if (dateInput < currentDate) {
        errorUpdate['deliveryDate'] = 'Ngày trả tem không hợp lệ'
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

    if (deliveryId) {
      requestUpdateDeliveryStampProvide(JSON.stringify({
        id: deliveryId,
        deliveryDate: (newDataUpdateDelivery.deliveryDate && moment(newDataUpdateDelivery.deliveryDate).format('YYYY-MM-DD')) || ''
      })).then(res => {

        if (((res || {}).data || {}).status == 200) {
          this.fetchSummary(JSON.stringify({
            "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
            "toDate": new Date(),
            "search": "",
            "filter": "",
            "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
            "page": null,
            "limit": null
          }));
          this.toggleModal('updateModal');
          toast.success('Thông báo ngày trả tem thành công!');
        } else {
          this.setState({ errMesageFail: res.data.message })
          this.toggleModal('popupMessage')
        }
      })
    }
  }

  handleNewDetailUpdateDelivery = (data) => {
    this.setState({ newDataUpdateDelivery: data });
    this.setState({ errorUpdate: {} })
  }
  handleNewDetailSendMail = (data) => {
    this.setState({ typePrint: Number((data || {}).type || 0) })
  }

  handleNewData = (data) => {
    this.setState({ newDataPrint: data });
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

  onChangePrinter = (value) => {
    console.log(value);
    this.setState({ typePrint: Number(value || 0) });
  }

  handleChangePartner = (event) => {

    this.setState({ partnerId: event ? event : '' });
  }

  render() {
    const { screen } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      detail,
      statusList,
      statusPrint,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      warningPopupModal,
      createNewModal,
      activeSubmit,
      popupMessage,
      errMesageFail,
      filter,
      updateModal,
      updateModal2,
      activeCreateSubmit,
      newData,
      printModal,
      printInfo,
      dataQRPrint,
      isPopupDetail,
      reasonUnConfirm,
      dataPopupDetail,
      detailPrint,
      fromDate,
      toDate,
      errorUpdate,
      idPrinQR,
      errorPrint,
      warningPopupModalPlus,
      warningPopupDelModal,
      updateModal3

    } = this.state;
    const statusPopup = { status: status, message: message };
    // console.log(data);
    let isDisableConfirm = true;
    let isDisableUnconfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
      isDisableUnconfirm = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");
      ACCOUNT_CLAIM_FF.filter(x => x == "StampRequests.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "StampRequests.Unconfirm").map(y => isDisableUnconfirm = false)
    }
    const numberWithCommas = (value, coma) => {
      value = value || '';
      coma = coma || '.';

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
    };
    //console.log(isLoaded);
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
                        dataReload={() => {
                          this.fetchSummary(
                            JSON.stringify({
                              "status": null,
                              "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
                              "toDate": new Date(),
                              "companyName": "",
                              "taxCode": "",
                              "search": "",
                              "printStatus": null,
                              "filter": "",
                              "orderBy": "Status ASC, PrintStatus ASC, RequestedDate DESC",
                              "page": null,
                              "limit": null
                            }));
                          this.clearFilter();
                        }
                        }
                        // hideSearch={true}
                        hideCreate={true}
                        searchForm={
                          <SearchModal
                            statusList={statusList}
                            statusPrint={statusPrint}
                            fromDate={fromDate}
                            toDate={toDate}
                            filter={filter}
                            handleSelectCS={this.handleSelectCS}
                            handleChangeDate={this.handleChangeDate}

                          />
                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      // typeSearch={
                      //   <>
                      //     <div className="col-3">
                      //       <label className="form-control-label">Từ ngày</label>
                      //       <div>
                      //         <FormGroup>
                      //           <InputGroup className="input-group-alternative css-border-input">
                      //             <InputGroupAddon addonType="prepend">
                      //               <InputGroupText>
                      //                 <i className="ni ni-calendar-grid-58" />
                      //               </InputGroupText>
                      //             </InputGroupAddon>
                      //             <ReactDatetime
                      //               inputProps={{
                      //                 placeholder: "Từ ngày"
                      //               }}
                      //               name='startDate'
                      //               value={fromDate}
                      //               timeFormat={false}
                      //               onChange={(e) => this.handleChangeStartDate(e)}
                      //             />
                      //           </InputGroup>
                      //         </FormGroup>
                      //       </div>
                      //     </div>
                      //     <div className="col-3">
                      //       <label className="form-control-label">Đến ngày</label>
                      //       <div>
                      //         <FormGroup>
                      //           <InputGroup className="input-group-alternative css-border-input">
                      //             <InputGroupAddon addonType="prepend">
                      //               <InputGroupText>
                      //                 <i className="ni ni-calendar-grid-58" />
                      //               </InputGroupText>
                      //             </InputGroupAddon>
                      //             <ReactDatetime
                      //               inputProps={{
                      //                 placeholder: "Đến ngày"
                      //               }}
                      //               name='endDate'
                      //               value={toDate}
                      //               timeFormat={false}
                      //               onChange={(e) => this.handleChangeEndDate(e)}
                      //             />
                      //           </InputGroup>
                      //         </FormGroup>
                      //       </div>
                      //     </div>
                      //     <div className="col-3">
                      //       <label className="form-control-label">
                      //         Trạng thái
                      //       </label>
                      //       <div>
                      //         <Select
                      //           name="status"
                      //           title='Chọn trạng thái'
                      //           data={statusList}
                      //           labelName='name'
                      //           val='status'
                      //           handleChange={this.handleSelect}
                      //         />
                      //       </div>
                      //     </div>
                      //     <div className="col-3">
                      //       <label
                      //         className="form-control-label"
                      //       >&nbsp;</label>
                      //       <Button
                      //         style={{ margin: 0 }}
                      //         className='btn-warning-cs'
                      //         color="default" type="button" size="md"
                      //         onClick={() => {
                      //           this.handleSubmitSearchForm();
                      //           // this.onComfirmSearch()
                      //         }
                      //         }
                      //       >
                      //         <img src={SearchImg} alt='Tìm kiếm' />
                      //         <span>Tìm kiếm</span>
                      //       </Button>
                      //     </div>
                      //   </>
                      // }
                      // customComponent={
                      //   <div className={classes.filterArea}
                      //     style={{
                      //       width: 310,
                      //       padding: 3,

                      //     }}
                      //   >
                      //     <label
                      //       className="form-control-label"
                      //       style={{
                      //         marginRight: 5,
                      //         width: 100
                      //       }}
                      //     >
                      //       Trạng thái
                      //     </label>

                      //     <Select
                      //       name="status"
                      //       title='Chọn trạng thái'
                      //       data={statusList}
                      //       labelName='name'
                      //       val='status'
                      //       handleChange={this.handleSelect}
                      //     />
                      //   </div>
                      // }
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-stampProvide" responsive >
                          <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                            0: 'table-scale-col table-user-col-1'
                          }} />

                          <tbody>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key} className="table-hover-css stamp-provide-css-check">
                                      <td style={{ whiteSpace: 'normal' }} className="table-scale-col table-user-col-1">{item.index}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                        <div style={{ display: 'flex' }}>
                                          <span className={`${this.handleStyleStatus(item.status)}`}>{item.statusName}</span>
                                          {/* {item.isPrint == false && item.status === 2 ?
                                            <>
                                              {item.printStatus === 0 ? (<>
                                                <span className={`${classes.noActiveStt} css-text-button-print`} style={{ marginTop: 5 }}>
                                                  Chưa gửi mẫu tem
                                                </span>

                                              </>) : null}
                                              {item.printStatus === 1 ? (<>
                                                <span className={`${classes.notyetStt} css-text-button-print `} style={{ marginTop: 5 }}>Đã hẹn ngày trả tem</span>
                                              </>) : null}
                                              {item.printStatus === 2 ? (<>
                                                <span className={`${classes.activeStt} css-text-button-print`} style={{ marginTop: 5 }}>Đã giao tem</span>
                                              </>) : null}
                                              {item.printStatus === 3 ? (<>
                                                <span className={`${classes.activeStt01} css-text-button-print`} style={{ marginTop: 5 }}>Đã gửi mẫu tem</span>
                                              </>) : null}
                                            </> : null} */}

                                          {item.statusReceipts != null && (
                                            <>
                                              <span className={`${this.handleStyleStatusReceipts(item.statusReceipts)}`}>{item.statusReceiptsName}</span>
                                            </>
                                          )}
                                        </div>

                                        {/* <td style={{ textAlign: 'center' }} className={this.handleStyleStatus(item.status)}>{item.statusName}</td> */}
                                      </td>


                                      <td style={{ textAlign: 'left' }}>
                                        {item.companyName}

                                      </td>

                                      <td style={{ textAlign: 'right', whiteSpace: 'normal' }}>{numberWithCommas(item.quantity)}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                                        <input type="checkbox" disabled checked={!item.isPrint} />
                                      </td>
                                      {/* <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>

                                        <span>Ngày yêu cầu:&nbsp;<i>{item.requestedDate}</i></span><br />
                                        {
                                          item.confirmedDate ? (<>
                                            <span>Ngày xử lý:&nbsp;<i>{item.confirmedDate}</i>&nbsp;</span>
                                          </>) : ''
                                        }
                                        {
                                          item.confirmedBy ? (<>
                                            |<span>&nbsp;Người xử lý:&nbsp;<i>{item.confirmedBy}</i></span>
                                          </>) : ''
                                        }<br />

                                        {
                                          item.reason ? (
                                            <>
                                              <span>Lý do không duyệt:&nbsp;<i>{item.reason}</i></span>
                                            </>
                                          ) : ''
                                        }
                                      </td> */}
                                      {/* <td style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                                                                            </td> */}
                                      {/* <td style={{ textAlign: 'left', whiteSpace: 'normal' }}> </td> */}
                                      {/* <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.reason}</td> */}

                                      <td style={{ whiteSpace: 'normal' }}>
                                        {(isDisableConfirm == true && isDisableUnconfirm == true) ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              <DropdownItem
                                                onClick={
                                                  this.onOpenPopupDetail(item.id, item.isPrint)

                                                }

                                              >
                                                Xem
                                              </DropdownItem>

                                              {item.status == 1 ||
                                                isDisableConfirm == true ||
                                                item.status == 3 ||
                                                isDisableUnconfirm == true ||
                                                item.isPrint == 0 ||
                                                item.isPrint == 1
                                                ? null : (
                                                  <DropdownItem divider />
                                                )}
                                              {/* {(item.status === 2) && item.isPrint == 0 ? (
                                                <>
                                                  <DropdownItem

                                                    className="css-text-button"
                                                    onClick={() => {
                                                      this.setState({ reqId: item.id });
                                                      this.toggleModal('updateModal2');
                                                      this.componentPrint(item);
                                                    }}
                                                  >
                                                    In
                                                  </DropdownItem>
                                                </>
                                              ) : null} */}
                                              {/* {(item.status === 2 && (item.printStatus === 2 || item.printStatus === 0)) && item.isPrint == 0 ||
                                                item.status == 1 || (item.status && item.isPrint == 1) || (item.status === 3) && item.isPrint == 0 ? null : (
                                                <DropdownItem divider />
                                              )}
                                              {(item.status === 2 && item.printStatus === 3) && item.isPrint == 0 ? (
                                                <>
                                                  <DropdownItem
                                                    className="tooltip-box"
                                                    onClick={
                                                      this.onOpenUpdateDelivery(item.id)
                                                    }
                                                  >
                                                    Thông Báo...
                                                    <span className="tooltip-text">Thông Báo Ngày Trả Tem</span>
                                                  </DropdownItem>

                                                </>
                                              ) : null} */}

                                              {/* {(item.status === 1) && item.isPrint == 0 ||
                                                item.isPrint == 1 ||
                                                item.status === 2 && item.printStatus === 1 ||
                                                item.status === 2 && item.printStatus === 2 ||
                                                item.status === 2 && item.printStatus === 3 ||
                                                item.status === 3
                                                ? null : (
                                                  <DropdownItem divider />
                                                )} */}
                                              {/* {item.status === 2 && item.printStatus === 0 && item.isPrint == 0 ? (
                                                <>
                                                  <DropdownItem
                                                    className="tooltip-box "
                                                    onClick={() => {
                                                      this.toggleModal('updateModal3');
                                                      this.setState({ idHasPrinred: item.id })
                                                    }}
                                                  >
                                                    Gửi mẫu tem...
                                                    <span className="tooltip-text">Gửi mẫu tem cho nhà in</span>
                                                  </DropdownItem>
                                                  

                                                </>
                                              ) : null} */}
                                              {/* {
                                                (item.status === 2) && item.isPrint == 0 || item.isPrint == 1 || item.status == 1 ||
                                                  (item.status === 3) && item.isPrint == 0
                                                  ? null : (
                                                    <DropdownItem divider />
                                                  )} */}
                                              {item.status === 2 && item.printStatus === 3 && item.isPrint == 0 ? (
                                                <>
                                                  <DropdownItem divider />
                                                  <DropdownItem
                                                    className="tooltip-box "
                                                    onClick={() => {
                                                      this.toggleModal('warningPopupDelModal');
                                                      this.setState({ idHasDelevered: item.id })
                                                    }}
                                                  >
                                                    Thông Báo...
                                                    <span className="tooltip-text">Thông Báo Đã Giao</span>
                                                  </DropdownItem>
                                                </>
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
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}><b>Khi bạn chọn đồng ý, một email bao gồm mẫu tem và danh sách mã tem sẽ được gửi đến nhà in</b></p>
                }
                handleWarning={this.handleConfirmPrintedStamp}
              />

              <WarningPopupDel
                moduleTitle="Thông báo"
                warningPopupDelModal={warningPopupDelModal}
                toggleModal={this.toggleModal}
                moduleBody={
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn muốn cập nhật trạng thái đã giao?</p>
                }
                handleWarning={this.handleConfirmDeliveredStamp}
              />

              {(isPopupDetail && dataPopupDetail) &&
                <PopupDetail
                  errorPrint={errorPrint}
                  data={dataPopupDetail}
                  isShow={isPopupDetail}
                  reason={reasonUnConfirm}
                  onChangeReason={this.onChangeReason}
                  onClose={this.onClosePopupDetail}
                  onConfirmPrint={this.state.isPrintState ? this.onConfirmPopupDetailUsed : this.onConfirmPopupDetail}
                  onConfirmUsed={this.onConfirmPopupDetailUsed}
                  onUnConfirm={this.onUnConfirmPopupDetail}
                  handleChangePartner={this.handleChangePartner}
                  onChangePrinter={this.onChangePrinter}
                />
              }

              {
                printInfo !== null && (
                  <UpdatePopup2
                    moduleTitle='Danh sách mã tem'
                    updateModal2={updateModal2}
                    hiddenBtnSave={true}
                    moduleBody={
                      <PrintFormStampQR
                        // data={printInfo}
                        idPrinQR={idPrinQR}
                        detailPrint={detailPrint} />
                    }
                    toggleModal={this.toggleModal}
                    newData={newData}
                    handleUpdateInfoData={this.componentPrint}
                    activeSubmit={activeCreateSubmit}
                  />
                )
              }

              <UpdatePopup
                moduleTitle='Ngày trả tem'
                updateModal={updateModal}
                moduleBody={
                  <UpdateModal2
                    errorUpdate={errorUpdate}
                    dataPopupDetail={dataPopupDetail}
                    handleNewDetail={this.handleNewDetailUpdateDelivery}
                    handleCheckValidation={this.handleCheckValidation}
                  />
                }
                toggleModal={this.toggleModal}
                newData={newData}
                handleUpdateInfoData={this.componentUpdateDeivery}
                activeSubmit={activeCreateSubmit}
              />

              <UpdatePopup3
                moduleTitle='Thông báo'
                updateModal3={updateModal3}
                hiddenBtnSave={true}
                moduleBody={
                  <UpdateModal3
                    handleNewDetail={this.handleNewDetailSendMail}
                    handleCheckValidation={this.handleCheckValidation}
                  />
                }
                toggleModal={this.toggleModal}
                newData={newData}
                handleUpdateInfoData={this.handleConfirmPrintedStamp}
                activeSubmit={activeCreateSubmit}
              />

              {/* {

                      <UpdatePopup
                          moduleTitle='Nhập tem theo thứ tự'
                          moduleBody={
                              <InputPrintModal
                                  handleCheckValidation={this.handleCheckValidation}
                                  handleNewData={this.handleNewData}
                              />}
                          newData={newData}
                          updateModal={updateModal}
                          toggleModal={this.toggleModal}
                          activeSubmit={activeCreateSubmit}
                          handleUpdateInfoData={this.componentPrint}
                      />

                            } */}

              {/* Create New */}
              <CreateNewPopup
                screen={screen}
                moduleTitle={"Thông báo"}
                moduleBody={
                  <UpdateModal
                    data={detail}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewDetail={this.handleNewDetail}
                  />
                }
                createNewModal={createNewModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeSubmit}
                handleCreateInfoData={this.handleUpdateInfoData}
              />
              {errMesageFail != '' || message != '' ?
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={message || errMesageFail}
                  toggleModal={this.toggleModal}
                /> : null
              }
              <ToastContainer
                position="top-center"
                autoClose={3000}
              />
            </Container>
          </div >
        }
      </>
    )
  }

}
const mapStateToProps = (state) => {
  return {
    stampprovide: state.StampProvideStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionStampProvideList, dispatch),


  }
}
export default compose(
  //withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StampProvide);