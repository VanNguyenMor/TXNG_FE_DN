import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { COMPANY_VERIFY } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import MenuButton from "../../../assets/img/buttons/menu.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Select from "components/Select";
import WarningPopup from "../../../components/WarningPopup";
import classes from './index.module.css';
import PopupMessage from "../../../components/PopupMessage";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import UpdatePopup from "../../../components/UpdatePopup";
import UpdatePopup2 from "../../../components/UpdatePopup2";
import SelectSearch, { fuzzySearch } from "react-select-search";
import SelectTree from "components/SelectTree";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { actionCompanyGetDetails } from "../../../actions/CompanyGetDetailsActions";
import { actionField } from "../../../actions/FieldActions.js";
import { actionPartner } from "../../../actions/PartnerActions";
import { handleGenTree } from "../../../helpers/trees";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import ViewPopup from "../../../components/ViewPopup"
import Kduyet from "assets/img/buttons/KoDuyet.svg";
import HuyHS from "assets/img/buttons/HuyHS.svg";
import Duyet from "assets/img/buttons/Duyet.svg";
import ReactStars from "react-rating-stars-component";
import UpdateModal from "./UpdateModal";
import UpdateModal2 from "./UpdateModal2";
import ViewModal from "./ViewModal";
import './CompanyVerify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import moment from "moment";

const firstExample = {

};

class CompanyVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      options: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      comfirm: null,
      message: '',
      errMesageFail: '',
      newData: null,
      statusList: [
        { name: 'Chưa xác thực', verifiedStatus: 0 },
        { name: 'Chờ xác thực', verifiedStatus: 1 },
        { name: 'Đã xác thực', verifiedStatus: 2 },

      ],
      filter: {
        "fieldID": "",
        "comapanyName": "",
        "taxCode": "",
        "phone": "",
        "email": "",
        "provinceID": "",
        "verifiedStatus": null,
        "districtID": "",
        "wardID": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      headerTitle: COMPANY_VERIFY,
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

      errorUpdate: {}
    }

  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    const { limit, fetching, detailsData } = this.state;
    let fieldData = nextProp.field.data;
    let haveRoot = false;
    let fieldDataParent = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.listVerify) !== 'undefined') {
          if (data.listVerify !== null) {
            if (typeof (data.listVerify.companies) !== 'undefined') {
              data.listVerify.companies.map((item, key) => {
                item['thumbnail'] = <img src={item.logo ? item.logo : NoImg} style={{ width: 60, height: 60 }} />
                if (item.verifiedStatus == 0) {
                  item['statusName'] = 'Chưa xác thực'
                }
                else if (item.verifiedStatus == 1) {
                  item['statusName'] = 'Chờ xác thực'
                } else if (item.verifiedStatus == 2) {
                  item['statusName'] = 'Đã xác thực'
                };
                item['index'] = key + 1;
                item['collapse'] = false;

              });
              this.setState({
                data: data.listVerify.companies,
                history: data.listVerify.companies,
                listLength: data.listVerify.total,
                totalPage: Math.ceil(data.listVerify.companies.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message),
                totalElement: data.listVerify.total > limit ? limit : data.listVerify.total
              });
            } else {
              this.setState({
                history: data.listVerify.companies,
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
  }



  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  componentDidMount() {
    /* Fetch Summary */
    const { requestFieldStore, } = this.props;

    // requestFieldStore(JSON.stringify({
    //   "search": "",
    //   "filter": "",
    //   "orderBy": "",
    //   "page": null,
    //   "limit": null
    // })).then(res => {
    //   this.fetchSummary(JSON.stringify({
    //     "fieldID": "",
    //     "comapanyName": "",
    //     "taxCode": "",
    //     "phone": "",
    //     "email": "",
    //     "provinceID": "",
    //     "verifiedStatus": null,
    //     "districtID": "",
    //     "wardID": "",
    //     "orderBy": "",
    //     "page": null,
    //     "limit": null
    //   }));
    // })

    this.fetchSummary(JSON.stringify({
      "fieldID": "",
      "comapanyName": "",
      "taxCode": "",
      "phone": "",
      "email": "",
      "provinceID": "",
      "verifiedStatus": null,
      "districtID": "",
      "wardID": "",
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
    const { requestListCompanyVerify } = this.props;

    requestListCompanyVerify(data);
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

  handleStyleStatus = (status) => {
    if (status === 0) {
      return classes.moitao;
    }
    if (status === 1) {
      return classes.daduyet;
    }
    if (status == 2) {
      return classes.khongduyet;
    }

  }

  handleSelect = (value, name) => {

    if (value) {
      this.fetchSummary(JSON.stringify({
        "fieldID": "",
        "comapanyName": "",
        "taxCode": "",
        "phone": "",
        "email": "",
        "provinceID": "",
        "verifiedStatus": null,
        "districtID": "",
        "wardID": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }));
    }

  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        newData: null,
        detailView: null,
        errorUpdate: {},
      });
    }
    if (state == 'createNewModal') {
      this.setState({
        [state]: true,
        errorUpdate: {},
        newData: null,
      });
      if (type == 100) {
        this.setState({
          [state]: !this.state[state],
          errorUpdate: {},
          newData: null,
        });
      }
    }
  };

  onOpenPopupUpload = (id, dataCurent) => () => {

    let dataCurentPop = dataCurent;
    this.setState({ dataCurentPop })
    this.toggleModal('updateModal');


    this.setState(previousState => {
      return {
        ...previousState,
        idCurRow: id,

      }
    });
    // });
  }

  onOpenPopupVerify = (id, dataCurent) => () => {

    let dataCurentPop = dataCurent;
    this.setState({ dataCurentPop })
    this.toggleModal('updateModal2');

    this.setState(previousState => {
      return {
        ...previousState,
        idCurRowVerify: id,
      }
    });
    // });
  }

  handleUploadProducts = () => {
    const { newData, idCurRow, filter, mfileImg, fileImage } = this.state;
    const { requestUploadFileCompany } = this.props;
    const errorUpdate = {};
    const formData = new FormData();

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });

    if (((mfileImg || []).length <= 0 || mfileImg == null) && ((fileImage || []).length <= 0 || fileImage == null)) {
      errorUpdate.file = 'Hồ sơ không được bỏ trống'
    }
    if (!newData.VerifyID) {
      errorUpdate.VerifyID = 'Chưa chọn đơn vị xác thực'
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
      }
    });

    formData.append('ID', newData.ID);
    formData.append('VerifyID', newData.VerifyID ? newData.VerifyID : '');
    formData.append('VerifiedImage', fileImage ? fileImage : '');
    if (mfileImg) {
      for (let i = 0; i < mfileImg.length; i++) {
        formData.append(`VerifiedImageFiles`, mfileImg[i])
      }
    }

    requestUploadFileCompany(formData).then(res => {
      if (res.data.status == 200) {
        this.fetchSummary({
          "fieldID": "",
          "comapanyName": "",
          "taxCode": "",
          "phone": "",
          "email": "",
          "provinceID": "",
          "verifiedStatus": null,
          "districtID": "",
          "wardID": "",
          "orderBy": "",
          "page": null,
          "limit": null
        });
        // this.toggleModal('viewModal');
        this.toggleModal('updateModal');
        toast.success('Upload hồ sơ doanh nghiệp thành công!')
      } else {
        this.setState({ errMesageFail: res.message });
        this.toggleModal('popupMessage')
      }
    })
  }

  handleDeleteUploadProducts = () => {
    const { idCurRow } = this.state;

    const { requestDeleteFileCompany } = this.props;
    if (idCurRow) {
      requestDeleteFileCompany(idCurRow).then((res) => {
        if (res.data.status == 200) {
          this.toggleModal('updateModal');

          this.fetchSummary({
            "fieldID": "",
            "comapanyName": "",
            "taxCode": "",
            "phone": "",
            "email": "",
            "provinceID": "",
            "verifiedStatus": null,
            "districtID": "",
            "wardID": "",
            "orderBy": "",
            "page": null,
            "limit": null
          });
          toast.success('Huỷ hồ sơ doanh nghiệp thành công!')
        } else {
          this.setState({ errMesageFail: res.message });
          this.toggleModal('popupMessage')
        }
      })
    }
  }

  handleVerifyProducts = () => {
    const { idCurRowVerify } = this.state;
    const { requestVerifyCompany } = this.props;
    if (idCurRowVerify) {
      requestVerifyCompany(idCurRowVerify).then(res => {
        if (res.status == 200) {
          this.fetchSummary({
            "fieldID": "",
            "comapanyName": "",
            "taxCode": "",
            "phone": "",
            "email": "",
            "provinceID": "",
            "verifiedStatus": null,
            "districtID": "",
            "wardID": "",
            "orderBy": "",
            "page": null,
            "limit": null
          });
          this.toggleModal('updateModal2');
          toast.success('Xác thực doanh nghiệp thành công!')
        } else {
          this.setState({ errMesageFail: res.message });
          this.toggleModal('popupMessage')
        }
      })
    }
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  clearFilter = () => {
    this.setState({
      filter: {
        "fieldID": "",
        "comapanyName": "",
        "taxCode": "",
        "phone": "",
        "email": "",
        "provinceID": "",
        "verifiedStatus": null,
        "districtID": "",
        "wardID": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
    })
  }

  handleNewDataUpload = (data, mfileImg, fileImage) => {
    this.setState({ newData: data, mfileImg: mfileImg, fileImage: fileImage });
  }

  onComfirmSearch = () => {
    const { filter } = this.state;
    this.fetchSummary(JSON.stringify(filter));
  }

  onSelectChange = (value, name) => {
    let { filter } = this.state;

    if (value === null) value = "";
    if (name == 'verifiedStatus') { value = parseInt(value); }
    filter[name] = value;
    this.setState({ filter });

  }

  handleOpenEdit = (id) => {
    const { requestCompanyGetDetails } = this.props;
    requestCompanyGetDetails(id).then(res => {
      if (res.data.status == 200) {
        this.setState({ detailView: res.data.data })
      }
    })
  }

  render() {
    const { screen } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      statusList,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      warningPopupModal,
      popupMessage,
      errMesageFail,
      filter,
      activeCreateSubmit,
      viewModal,
      options,
      fieldAll,
      field,
      detailView,
      dataCurentPop,
      updateModal,
      newData,
      errorUpdate,
      updateModal2,
      detail
    } = this.state;
    const statusPopup = { status: status, message: message };
    // console.log(data);
    let isDisableVerify = true;
    let isDisableUpload = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableVerify = false;
      isDisableUpload = false;
    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "CompanyVerify.Verify").map(y => isDisableVerify = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "CompanyVerify.Upload").map(y => isDisableUpload = false)
    }

    options.map(option => {
      option.name = option.companyName;
      option.value = option.id;
    })

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
                            JSON.stringify(filter)
                          )
                        }
                        }
                        hideCreate={true}
                        hideSearch={true}
                        typeSearch={
                          <>
                            <div className="div_flex w_div_100 flex-div_search">
                              <div className="mg-div-search w_input">
                                {/* <label className="form-control-label" >Doanh nghiệp/Người sản xuất</label>
                          <div style={{ width: '100%', }}>
                            <SelectSearch

                              options={options}
                              value={options.id}
                              name='companyID'
                              //className={`${classes.selectSearchBox} select-search-box`}
                              onChange={(value) => this.onSelectChange(value, 'companyID')}
                              search
                              filterOptions={fuzzySearch}
                              placeholder="Tìm kiếm..."
                            />
                          </div> */}
                                <label
                                  className="form-control-label"
                                >
                                  Trạng thái
                                </label>
                                <div>
                                  <Select
                                    name='verifiedStatus'
                                    labelName='name'
                                    data={statusList}
                                    val='verifiedStatus'
                                    title='Chọn trạng thái'
                                    handleChange={this.onSelectChange}
                                  />

                                </div>
                              </div>
                              <div className="mg-btn">
                                <label
                                  className="form-control-label"
                                >&nbsp;</label>
                                <Button

                                  className='btn-warning-cs'
                                  color="default" type="button" size="md"
                                  onClick={() => this.onComfirmSearch()
                                  }
                                >
                                  <img src={SearchImg} alt='Tìm kiếm' />
                                  <span>Tìm kiếm</span>
                                </Button>
                              </div>
                            </div>
                          </>
                        }
                      />
                      {/* Table */}
                      <div className="row" style={{ marginBottom: 15 }}>

                        {/* <div className="col-3">
                          <label
                            className="form-control-label"
                          >
                            Ngành nghề
                          </label>
                          <div>
                            <SelectTree
                              //hidenTitle={true}

                              title='Chọn ngành nghề'
                              data={field}
                              dataAll={fieldAll}
                              name='fieldID'
                              // disableParent={true}

                              labelName='fieldName'
                              fieldName='fieldName'
                              val='id'
                              handleChange={this.onSelectChange}
                            />
                          </div>
                        </div>
                        <div className="col-3">

                        </div> */}

                      </div>
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-companyVerify" responsive >
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
                                      <td className="table-scale-col table-user-col-1" style={{ whiteSpace: 'normal' }}>{item.index}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
                                        <span className={this.handleStyleStatus(item.verifiedStatus)}>{item.statusName}</span>
                                      </td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col companyVerify-img'>{item.thumbnail}</td>
                                      <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>
                                        <span style={{ color: '#09b2fd' }}><b>{item.companyName}</b></span><br />
                                        <span><i>{item.address}</i></span>
                                      </td>
                                      <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.verifiedName}</td>
                                      <td style={{ textAlign: 'center', whiteSpace: 'normal' }}>{item.verifiedDate ? moment(item.verifiedDate).format('DD/MM/YYYY') : null}</td>
                                      <td style={{ whiteSpace: 'normal' }}>

                                        <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                          <DropdownToggle>
                                            <img src={MenuButton} />
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem
                                              onClick={() => {
                                                this.handleOpenEdit(item.id);
                                                this.toggleModal('viewModal');
                                              }}
                                            >
                                              Xem
                                            </DropdownItem>
                                            {(isDisableVerify == true && isDisableUpload == true) || (item.verifiedStatus == 2) ? null : (
                                              <>
                                                <DropdownItem divider />
                                                {isDisableUpload == false ? (

                                                  <DropdownItem
                                                    onClick={this.onOpenPopupUpload(item.id, item)}
                                                  >
                                                    Upload hồ sơ
                                                  </DropdownItem>

                                                ) : null}
                                                {(isDisableUpload == true && isDisableVerify == true)
                                                  || (item.verifiedStatus != 1) ? null : (
                                                  <DropdownItem divider />
                                                )}
                                                {isDisableVerify == false ? (
                                                  <div>
                                                    {item.verifiedStatus == 1 ? (
                                                      <DropdownItem
                                                        onClick={this.onOpenPopupVerify(item.id, item)}
                                                      >
                                                        Xác thực
                                                      </DropdownItem>) : null}
                                                  </div>
                                                ) : null}
                                              </>
                                            )}
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
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý hủy hồ sơ này?</p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteUploadProducts}
              />

              <UpdatePopup2
                moduleTitle='Xác thực'
                resize="md"
                renameBtn={'Xác thực'}
                reiconBtn={Duyet}
                moduleBody={
                  <UpdateModal2
                    errorUpdate={errorUpdate}
                    id={this.state.idCurRowVerify}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataVerify}
                  />}
                newData={newData}
                updateModal2={updateModal2}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleVerifyProducts} />

              <UpdatePopup
                moduleTitle='Upload hồ sơ'
                moduleBody={
                  <UpdateModal
                    errorUpdate={errorUpdate}
                    id={this.state.idCurRow}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataUpload}
                  />}
                newData={newData}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleUploadProducts}
                componentFooter={
                  <>
                    {dataCurentPop && dataCurentPop.verifiedStatus == 1 ? (
                      <Button
                        color="success"
                        type="button"
                        className={`btn-warning-cs`}

                        onClick={() => {
                          this.toggleModal('warningPopupModal');
                        }}
                      >
                        <img src={HuyHS} alt='Hủy hồ sơ' />
                        <span>Hủy hồ sơ</span>
                      </Button>
                    ) : null}
                  </>
                }
              />

              {
                detailView && (
                  <ViewPopup
                    moduleTitle='Xem thông tin'
                    moduleBody={
                      <ViewModal
                        data={detailView}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewData}
                      />}
                    newData={newData}
                    viewModal={viewModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.componentExtend}
                  />
                )
              }

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

    company: state.CompanyGetDetailsStore,
    field: state.FieldStore,
    partner: state.PartnerStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {

    ...bindActionCreators(actionCompanyGetDetails, dispatch),
    ...bindActionCreators(actionField, dispatch),
    ...bindActionCreators(actionPartner, dispatch),
  }
}
export default compose(
  //withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CompanyVerify);