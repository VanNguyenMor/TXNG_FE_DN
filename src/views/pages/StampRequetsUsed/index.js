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
import QRCode from 'qrcode.react';
import PrintPopup from "components/PrintPopup";
import PrintFormStampQR from "../../../components/PrintFormStampQR";
import PopupDetail from "./PopupDetail";
import UpdateModal2 from "./UpdateModal2";
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
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class StampRequetsUsed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
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
        { name: 'Chờ cấp phép', requestedUsedStatus: 1 },
        { name: 'Có hiệu lực', requestedUsedStatus: 2 },
        { name: 'Không cấp phép', requestedUsedStatus: 3 }
      ],
      statusPrint: [
        { name: 'Chưa in', printStatus: 0 },
        { name: 'Đã in', printStatus: 1 },
        { name: 'Đã giao', printStatus: 2 }
      ],
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
        "requestedUsedStatus": null,
        "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
        "toDate": new Date(),
        "companyName": "",
        "taxCode": "",
        "search": "",
        "printStatus": null,
        "filter": "",
        "orderBy": "",
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
        if (typeof (data.stamprequestused) !== 'undefined') {
          if (data.stamprequestused !== null) {
            if (typeof (data.stamprequestused.stamps) !== 'undefined') {
              data.stamprequestused.stamps.map((item, key) => {
                if (item.requestedUsedStatus == 1) {
                  item['statusName'] = 'Chờ cấp phép'
                } else if (item.requestedUsedStatus == 2) {
                  item['statusName'] = 'Có hiệu lực'
                } else if (item.requestedUsedStatus == 3) {
                  item['statusName'] = 'Không cấp phép'
                };
                item['index'] = key + 1;
                item['collapse'] = false;
                item['requestedDate'] = item.requestedDate ? moment(item.requestedDate).format('DD/MM/YYYY') : '';
                item['confirmedDate'] = item.confirmedDate ? moment(item.confirmedDate).format('DD/MM/YYYY') : '';

              });
              this.setState({
                data: data.stamprequestused.stamps,
                history: data.stamprequestused.stamps,
                listLength: data.stamprequestused.total,
                totalPage: Math.ceil(data.stamprequestused.stamps.length / limit),
                isLoaded: data.isLoading,
                totalElement: data.stamprequestused.total > limit ? limit : data.stamprequestused.total,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                history: data.stamprequestused.stamps,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.confirm) !== 'undefined') {
          if (fetching) {
            this.setState({ data: [] });
            this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
            this.setState({ fetching: false });
          }

          setTimeout(() => {
            this.setState({
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }, 500);
        }

        if (typeof (data.unconfirm) !== 'undefined') {
          if (fetching) {
            this.setState({ data: [] });
            this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
            this.setState({ fetching: false });
          }

          setTimeout(() => {
            this.setState({
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }, 500);
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
    const { hasPrintStamp } = this.props;
    const { idHasPrinred } = this.state;

    hasPrintStamp(idHasPrinred).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }))
      } else {
        this.setState({ message: res.data.message })
        this.toggleModal('popupMessage');
      }
    })
  }

  handleConfirmDeliveredStamp = () => {
    const { hasDeliveredStamp } = this.props;
    const { idHasDelevered } = this.state;

    hasDeliveredStamp(idHasDelevered).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": "",
          "orderBy": "",
          "page": null,
          "limit": null
        }))
      } else {
        this.setState({ message: res.data.message })
        this.toggleModal('popupMessage');
      }
    })
  }

  onConfirmPopupDetail = () => {
    const { isPopupDetail, partnerId, dataPopupDetail } = this.state;
    const { requestComfirmStampRequestUsed } = this.props;

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

    requestComfirmStampRequestUsed("id=" + isPopupDetail + "&partnerId=" + partnerId).then(res => {
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
          this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
        });
        toast.success("Duyệt yêu cầu cấp phép sử dụng tem thành công!")
      }
    });

  }

  onUnConfirmPopupDetail = () => {
    const { isPopupDetail, reasonUnConfirm, dataPopupDetail } = this.state;
    const { requestUncomfirmStampRequestUsed } = this.props;
    const errorPrint = {}
    this.setState(previousState => {
      return {
        ...previousState,
        errorPrint
      }
    })

    if (!reasonUnConfirm) {
      errorPrint.RequestedUsedReason = "Bạn vui lòng nhập lý do không duyệt"
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
            isPopupDetail: false,
            fetching: false,
            data: []
          }
        }, () => {
          this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
        });
        toast.success("Không duyệt yêu cầu cấp phép sử dụng tem!")
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

    const { requestUncomfirmStampRequestUsed } = this.props;
    const createData = JSON.stringify({
      id: value.id,
      reason: value.reason
    })

    this.handleClose(true);
    this.setState({ fetching: false });
    requestUncomfirmStampRequestUsed(createData);
  }

  componentDidMount() {
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
      "toDate": new Date(),
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
    const { requestStampRequestUsedList } = this.props;

    requestStampRequestUsedList(data);
  }

  fetchSummaryComfirm = (id) => {
    const { requestComfirmStampRequestUsed } = this.props;

    requestComfirmStampRequestUsed("id=" + id + "&partnerId=" + id).then(res => {
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

  onOpenPopupDetail = id => () => {
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
    const { requestUncomfirmStampRequestUsed } = this.props;
    const updateData = JSON.stringify({
      id: newData.id,
      reason: newData.reason
    });

    requestUncomfirmStampRequestUsed(updateData);
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
        "requestedUsedStatus": null,
        "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
        "toDate": new Date(),
        "companyName": "",
        "taxCode": "",
        "search": "",
        "printStatus": null,
        "filter": "",
        "orderBy": "",
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
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));
          this.toggleModal('updateModal');
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

  handleChangePartner = (event) => {

    this.setState({ partnerId: event });
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
      warningPopupDelModal

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
                              "requestedUsedStatus": null,
                              "fromDate": moment().startOf('month').format('YYYY-MM-DD'),
                              "toDate": new Date(),
                              "companyName": "",
                              "taxCode": "",
                              "search": "",
                              "printStatus": null,
                              "filter": "",
                              "orderBy": "",
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
                                    <tr key={key} className="table-hover-css tamp-provide-use-css-check">
                                      <td style={{ whiteSpace: 'normal' }} className="table-scale-col table-user-col-1">{item.index}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                        <div style={{ display: 'flex' }}>
                                          <span className={this.handleStyleStatus(item.requestedUsedStatus)}>{item.statusName}</span>
                                          {/* {item.isPrint == false && item.status === 2 ?
                                            <>
                                              {item.printStatus === 0 ? (<>
                                                <span className={classes.noActiveStt}>Chưa in</span>
                                              </>) : null}
                                              {item.printStatus === 1 ? (<>
                                                <span className={classes.notyetStt}>Đã in</span>
                                              </>) : null}
                                              {item.printStatus === 2 ? (<>
                                                <span className={classes.activeStt}>Đã giao</span>
                                              </>) : null}
                                            </> : null} */}
                                        </div>

                                        {/* <td style={{ textAlign: 'center' }} className={this.handleStyleStatus(item.status)}>{item.statusName}</td> */}
                                      </td>
                                      <td style={{ textAlign: 'left' }}>
                                        {item.companyName}

                                      </td>
                                      {/* <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.productName}</td> */}
                                      <td style={{ textAlign: 'right', whiteSpace: 'normal' }}>{numberWithCommas(item.quantity)}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }}><input type="checkbox" disabled checked={!item.isPrint} /></td>


                                      <td style={{ whiteSpace: 'normal' }}>
                                        {(isDisableConfirm == true && isDisableUnconfirm == true) ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              <DropdownItem
                                                onClick={this.onOpenPopupDetail(item.id)}
                                              >
                                                Xem
                                              </DropdownItem>
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
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn muốn cập nhật trạng thái đã in?</p>
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
                  onConfirm={this.onConfirmPopupDetail}
                  onUnConfirm={this.onUnConfirmPopupDetail}
                  handleChangePartner={this.handleChangePartner}
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
              {errMesageFail != '' ?
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={message}
                  toggleModal={this.toggleModal}
                /> : null
              }
              <ToastContainer
                position="top-center"
                autoClose={3000}
              />
            </Container>
          </div>
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
)(StampRequetsUsed);