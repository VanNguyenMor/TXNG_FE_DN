import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionProducts } from "../../../actions/ProductsActions";
import { PRODUCTS } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT, } from "../../../services/Common";
import MenuButton from "../../../assets/img/buttons/menu.png";
import ViewModal from "./ViewModal";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Select from "components/Select";
import UnconfirmModal from "./UnconfirmModal";
import WarningPopup from "../../../components/WarningPopup";
import classes from './index.module.css';
import PopupMessage from "../../../components/PopupMessage";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import UpdatePopup from "../../../components/UpdatePopup";
import SelectSearch, { fuzzySearch } from "react-select-search";
// import ReactSearchBox from "react-search-box";
import SelectTree from "components/SelectTree";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import { actionCompanyListRegistered } from "../../../actions/CompanyListRegisteredActions";
import { actionField } from "../../../actions/FieldActions.js";
import { handleGenTree } from "../../../helpers/trees";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import ViewPopup from "../../../components/ViewPopup"
import Kduyet from "assets/img/buttons/KhongDuyet.svg";
import Duyet from "assets/img/buttons/Duyet.svg";
import ReactStars from "react-rating-stars-component";
import "./select-search.css"

import '../../../assets/css/page/product.css';

import {
  Card,
  Input,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import SearchModal from "./SearchModal";

const firstExample = {

};

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      field: [],
      options: [{
        value: '',
        name: 'Tìm kiếm...'
      }],
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
      forCus: false,

      filter: {
        "fieldID": "",
        "productCode": "",
        "productName": "",
        "companyID": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      headerTitle: PRODUCTS,
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
      dataProductsUnits: [],
      productFields: [],
      dataProducts: {},
      errorUpdate: {},
      fieldName: ''
    }
    this.redSelect = null;
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.products;
    const { limit, fetching } = this.state;
    let fieldData = nextProp.field.data;
    let haveRoot = false;
    let fieldDataParent = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.list) !== 'undefined') {
          if (data.list !== null) {
            if (typeof (data.list.products) !== 'undefined') {
              if (data.list.products == '') {
                data.list.products = []
              }
              data.list.products.map((item, key) => {
                item['thumbnail'] = <img src={item.avatar ? item.avatar : NoImg} style={{ width: 60, height: 60 }} />

                item['index'] = key + 1;
                item['collapse'] = false;

                if (item.rating) {
                  if (item.rating.toString().split('.')[1] != '0') {
                    if (parseInt(item.rating.toString().split('.')[1]) >= 1 && parseInt(item.rating.toString().split('.')[1]) <= 4) {
                      item['ratingFil'] = parseFloat(item.rating.toString().split('.')[0] + '.5')
                    } else if (parseInt(item.rating.toString().split('.')[1]) >= 6 && parseInt(item.rating.toString().split('.')[1]) <= 9) {
                      item['ratingFil'] = parseFloat(item.rating.toString().split('.')[0] + '.0') + 1
                    } else {
                      item['ratingFil'] = item.rating
                    }
                  } else {
                    item['ratingFil'] = item.rating
                  }
                }

              });

              this.setState({
                data: data.list.products,
                history: data.list.products,
                listLength: data.list.products.length,
                totalPage: Math.ceil(data.list.products.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                totalElement: data.list.products.length > limit ? limit : data.list.products.length,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                history: data.list.products,
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
        if (fieldData.fieldCom !== null) {
          if (typeof (fieldData.fieldCom) !== 'undefined') {
            if (typeof (fieldData.fieldCom.fields) !== 'undefined') {
              fieldData.fieldCom.fields
                .filter(item => item.parentID === null)
                .map(item => haveRoot = true);

              if (haveRoot) {
                fieldDataParent = handleGenTree(fieldData.fieldCom.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1;

                });
              } else {
                // Search Element in tree
                fieldData.fieldCom.fields.map(
                  (item, key, array) => (
                    key === 0 && (item.parentID = null)
                  ));

                fieldDataParent = handleGenTree(fieldData.fieldCom.fields, 'fieldName');

                fieldDataParent.map((item, key) => {
                  item['index'] = key + 1
                });
              }
            }

            this.setState({
              field: fieldData.fieldCom.fields,
              fieldAll: fieldData.fieldCom.fields,
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
    const { requestFieldStore, requestListProducts, } = this.props;

    const dataCompany = {
      "fieldID": "",
      "comapanyName": "",
      "taxCode": "",
      "phone": "",
      "email": "",
      "provinceID": "",
      "districtID": "",
      "wardID": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }


    // requestFieldStore(JSON.stringify({
    //   "search": "",
    //   "filter": "",
    //   "orderBy": "",
    //   "page": null,
    //   "limit": null
    // })).then(res => {
    //   this.fetchSummary(JSON.stringify({
    //     "fieldID": "",
    //     "productCode": "",
    //     "productName": "",
    //     "companyID": "",
    //     
    //     "orderBy": "",
    //     "page": null,
    //     "limit": null
    //   }));
    // });

    // this.fetchSummary(JSON.stringify({
    //   "fieldID": "",
    //   "productCode": "",
    //   "productName": "",
    //   "companyID": "",
    //   
    //   "orderBy": "",
    //   "page": null,
    //   "limit": null
    // }));
  }
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestListProducts } = this.props;

    requestListProducts(data);
  }

  handleClose = (value) => {
    const { open } = this.state;

    this.setState({ open: value });
  }

  handleChange = (event) => {
    let { data } = this.state;
    const ev = event.target;

    data[ev['name']] = ev['value'];
    // console.log(data);
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
    if (status == 3) {
      return classes.yeucauduyet;
    };
  }

  handleSelect = (value, name) => {

    if (value) {
      this.fetchSummary(JSON.stringify({
        "fieldID": "",
        "productCode": "",
        "productName": "",
        "companyID": "",

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

  onOpenPopupView = (id, dataCurent) => () => {
    const { requestGetProducts } = this.props;
    let dataCurentPop = dataCurent;
    this.setState({ dataCurentPop })
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
  }

  handleConfirmProducts = () => {
    const { idCurRow, filter } = this.state;
    const { requestConfirmProducts } = this.props;

    if (typeof (idCurRow) !== 'undefined') {
      requestConfirmProducts(idCurRow).then(res => {
        if (res.status == 200) {
          this.fetchSummary(filter);
          this.toggleModal('viewModal');
        } else {
          this.setState({
            errMesageFail: res.message
          })
          this.toggleModal('popupMessage');
        }
      })

    }
  }

  handleUnConfirmProducts = (value) => {
    const { newData, idCurRow, filter } = this.state;
    const { requestUnConfirmProducts } = this.props;
    const errorUpdate = {};

    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });

    if (!(newData || {}).reason) {
      errorUpdate['reason'] = 'Lý do không được bỏ trống';
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

    requestUnConfirmProducts(idCurRow + '&reason=' + newData.reason).then(res => {
      if (res.status == 200) {
        this.fetchSummary(filter);
        this.toggleModal('viewModal');
        this.toggleModal('updateModal');
      } else {
        this.setState({ errMesageFail: res.message });
        this.toggleModal('popupMessage')
      }
    })
  }

  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  clearFilter = () => {
    this.setState({
      filter: {
        "fieldID": "",
        "productCode": "",
        "productName": "",
        "companyID": "",

        "orderBy": "",
        "page": null,
        "limit": null
      },
    })
  }
  handleFocus = (status) => {
    this.setState({ forCus: status });

  }
  handleNewDataUncomfirm = (data) => {
    this.setState({ newData: data });
  }

  onComfirmSearch = () => {
    const { filter } = this.state;
    if (filter.companyID) {
      this.fetchSummary(JSON.stringify(filter));
    }
    // this.fetchSummary(JSON.stringify(filter));
  }


  onSelectChange = (value, name) => {
    let { filter } = this.state;

    if (value === null) value = "";

    filter[name] = value;

    if (name == 'companyID') {

      this.redSelect.resetValue();
      if (!value) {
        filter.fieldID = ''

      } else {
        this.setState({ currentCompanyID: value })
        this.props.requestFieldByCompanyFieldStore(JSON.stringify({
          "search": "",
          "filter": value,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
      }

    }

    if (name == 'fieldID') {
      if (value) {
        this.setState({ currentFieldID: value })
      }
    }

    this.setState({ filter });
  }

  getOptions = (ev) => {
    const { requestCompanyAll } = this.props;
    if (ev && ev.length >= 3) {
      const dataCompany = {
        "fieldID": "",
        "comapanyName": ev,
        "taxCode": "",
        "phone": "",
        "email": "",
        "provinceID": "",
        "districtID": "",
        "wardID": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }

      return new Promise((resolve, reject) => {
        requestCompanyAll(dataCompany)
          .then((res) => {
            if (res.data.status == 200) {
              resolve(
                res.data.data.companies.map((item) => ({
                  value: item.id,
                  name: item.companyName
                }))
              )

            } else {
              reject()
            }
          })
          .catch(reject)
      })

    }
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
      dataProducts,
      dataProductsUnits,
      productFields,
      dataCurentPop,
      updateModal,
      newData,
      fieldName,
      errorUpdate,
      currentCompanyID
    } = this.state;
    const statusPopup = { status: status, message: message };

    let isDisableConfirm = true;
    let isDisableUnconfirm = true;
    let ACCOUNT_CLAIM_FF = [];
    if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
      isDisableConfirm = false;
      isDisableUnconfirm = false;

    } else {
      ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

      ACCOUNT_CLAIM_FF.filter(x => x == "Products.Confirm").map(y => isDisableConfirm = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Products.Unconfirm").map(y => isDisableUnconfirm = false)
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
                        dataReload={() => {

                          this.clearFilter();

                          if (this.redSelect) {
                            this.redSelect.resetValue();
                          }

                          this.setState({
                            currentCompanyID: '',
                            currentFieldID: '',
                            field: []
                          });

                          this.fetchSummary(
                            JSON.stringify({
                              "fieldID": "",
                              "productCode": "",
                              "productName": "",
                              "companyID": "",
                              "verifiedStatus": null,
                              "orderBy": "",
                              "page": null,
                              "limit": null
                            })
                          )
                        }
                        }
                        hideCreate={true}
                        hideSearch={true}
                        typeSearch={
                          <>
                            <div className="div_flex w_div_100 ">
                              <div className="mg-div-search w_input">
                                <label className="form-control-label info-box-text" style={{ width: '100%' }}>Doanh nghiệp/Người sản xuất</label>
                                <div style={{ width: '100%', borderRadius: "0.375rem" }} className="css-border-input">

                                  <SelectSearch
                                    options={options}
                                    name='companyID'
                                    value={currentCompanyID && currentCompanyID}
                                    // filterOptions={fuzzySearch}
                                    getOptions={query => this.getOptions(query)}
                                    search
                                    placeholder="Tìm kiếm..."
                                    onChange={(value) => this.onSelectChange(value, 'companyID')}
                                  />
                                </div>
                              </div>
                              <div className="mg-div-search w_input">
                                <label
                                  className="form-control-label"
                                >
                                  Ngành nghề
                                </label>
                                <div>
                                  <Select
                                    //hidenTitle={true}
                                    className="css-padding-input-product"
                                    ref={ref => this.redSelect = ref}
                                    title='Chọn ngành nghề'
                                    data={field}
                                    dataAll={fieldAll}
                                    labelMark={fieldName}
                                    name='fieldID'
                                    // disableParent={true}
                                    isDisable={currentCompanyID ? false : true}
                                    labelName='fieldName'
                                    fieldName='fieldName'
                                    val='id'
                                    handleChange={value => this.onSelectChange(value, 'fieldID')}
                                  />
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

                      </div>
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-products" responsive >
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

                                      <td style={{ textAlign: 'center' }} className='table-scale-col img-products'>{item.thumbnail}</td>
                                      <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.fieldName}</td>
                                      <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>
                                        <span style={{ color: '#09b2fd' }}><b>{item.productName}</b></span><br />
                                        <span>Mã sản phẩm: <b>{item.productCode}</b></span><br />
                                        {/* <span>Đơn vị tính: <b>{item.unitName}</b></span><br /> */}
                                        <span>Xuất xứ: <b>{item.nationName}</b></span>
                                        <ReactStars
                                          size={25}
                                          value={item.ratingFil}
                                          edit={false}
                                          isHalf={true} />
                                      </td>

                                      <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>
                                        {item.companyName}<br />
                                        <i>{item.address}</i>
                                      </td>
                                      <td style={{ whiteSpace: 'normal' }}>
                                        {(isDisableConfirm == true && isDisableUnconfirm == true) ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              <DropdownItem
                                                onClick={this.onOpenPopupView(item.id, item)}
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
                handleWarning={this.handleConfirmProducts}
              />

              <ViewPopup
                classNameModalBody='product-view-popup-modal-body'
                moduleTitle='Thông tin sản phẩm'
                moduleBody={
                  <ViewModal
                    dataProducts={dataProducts}
                    dataProductsUnits={dataProductsUnits}
                    dataCurentPop={dataCurentPop}
                    productFields={productFields}
                  />}
                viewModal={viewModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
              // componentFooter={
              //   <>
              //     {dataCurentPop && (
              //       <div>
              //         {isDisableConfirm == true && isDisableUnconfirm == true ? (
              //           <div className="modal-footer" style={{ marginRight: '-20px' }}>
              //             {isDisableConfirm == false ? (
              //               <div>
              //                 <Button
              //                   color="success"
              //                   type="button"
              //                   className={`btn-success-cs`}
              //                   style={{ marginRight: '26px !important', }}
              //                   onClick={() => {
              //                     this.toggleModal('warningPopupModal');
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
              //                     this.toggleModal('updateModal');
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

              <UpdatePopup
                moduleTitle='Thông báo'
                moduleBody={
                  <UnconfirmModal
                    errorUpdate={errorUpdate}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataUncomfirm}
                  />}
                newData={newData}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleUnConfirmProducts}
              />

              {errMesageFail != '' ?
                <PopupMessage
                  popupMessage={popupMessage}
                  moduleTitle={'Thông báo'}
                  moduleBody={message}
                  toggleModal={this.toggleModal}
                /> : null
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
    products: state.ProductsStore,
    dataCompany: state.CompanyListRegisteredStore,
    field: state.FieldStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionProducts, dispatch),
    ...bindActionCreators(actionCompanyListRegistered, dispatch),
    ...bindActionCreators(actionField, dispatch),
  }
}
export default compose(
  //withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Products);