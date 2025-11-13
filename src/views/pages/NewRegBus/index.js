import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGetListNewly } from "../../../actions/NewRegBusAction";
import { actionField } from "../../../actions/FieldActions.js";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { COMPANY_REG_HEADER, COMPANY_REG_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { handleGenTree } from "../../../helpers/trees";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";
// import AddIcon from "../../../../assets/images/buttons/THEM.png";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import NewCompanyPopup from "components/NewCompanyPopup";
import HeadTitleTable from "components/HeadTitleTable";
import classes from './index.module.css';
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from "../../../components/WarningPopup";
import InsertOrUpdate from './InsertOrUpdate';

import {
  Card,
  Table,
  Container,
  Button,
  Row,
  Spinner,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

class NewRegBus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      province: [],
      district: [],
      ward: [],
      field: [],
      detail: null,
      update: null,
      create: null,
      delete: null,
      isLoaded: null,
      status: null,
      open: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'companyName', 'phoneNumber', 'taxCode', 'email'
      ],
      searchData: [],
      filterList: [],
      editStatus: true,
      checkAtive: [{}],
      openAddNew: false,
      headerTitle: COMPANY_REG_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
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
        "limit": null,

      },
      moduleBodyInsert: null
    }
  }
  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.company;
    let locationData = nextProp.location.data;
    let fieldData = nextProp.field.data;
    const { limit } = this.state;
    let fieldDataParent = [];

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.company) !== 'undefined') {
          if (data.company !== null) {
            if (typeof (data.company.companies) !== 'undefined') {
              data.company.companies.map((item, key) => {
                item['index'] = key + 1
              });
              this.setState({
                data: data.company.companies,
                listLength: data.company.companies.length,
                totalPage: Math.ceil(data.company.companies.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({ data: data.company.companies, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
            }
          }
        }
      }
    }
    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {

            fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

            fieldDataParent.map((item, key) => {
              item['index'] = key + 1
            });

            this.setState({
              field: fieldDataParent,
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              field: fieldData.field,
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (locationData !== this.state.province) {
      if (typeof (locationData) !== 'undefined') {
        if (typeof (locationData.province) !== 'undefined') {

          if (locationData.province !== null) {
            //console.log(locationData.province.data)
            this.setState({
              province: locationData.province,
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          } else {
            this.setState({
              province: [],
              isLoaded: data.isLoading,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    //console.log(this.state.province)

    if (locationData !== this.state.district) {
      if (typeof (locationData) !== 'undefined') {
        if (typeof (locationData.district) !== 'undefined') {
          if (locationData.district !== null) {
            this.setState({ district: locationData.district, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          } else {
            this.setState({ district: [], isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
          }
        }
      }
    }

    // if (locationData !== this.state.ward) {
    //   if (typeof (locationData) !== 'undefined') {
    //     if (typeof (locationData.ward) !== 'undefined') {
    //       if (locationData.ward !== null) {
    //         this.setState({ ward: locationData.ward, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //       } else {
    //         this.setState({ ward: [], isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
    //       }
    //     }
    //   }
    // }



  }
  componentDidMount() {
    // This method is called when the component is first added to the document
    this.filterMapKey();

    /* Fetch Summary */
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
  componentWillMount() {
    const { getProvinceList } = this.props;
    const { getDistrictList } = this.props;
    const { requestFieldStore } = this.props;
    //const { getWardList } = this.props;
    getProvinceList();
    getDistrictList();
    requestFieldStore(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
    //getWardList();
  }

  fetchSummary = (data) => {
    const { requestCompanyRegListStore } = this.props;

    requestCompanyRegListStore(data);
  }

  filterMapKey = () => {
    let { dataMaping, filterList } = this.state;
    let newFilterMap = [];

    dataMaping.filter((item, key) => {
      typeof (filterList[key]) !== 'undefined' && (
        newFilterMap.push({ index: key, value: filterList[key] })
      )
    });

    filterList = [];
    this.setState({ filterList: newFilterMap });
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

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handleOpenAddNew = (value) => {
    this.setState({ openAddNew: value });
  }

  handleCreateInfoData = (val) => {
    const { createNewCompanyRegStore } = this.props;
    const bodyFormData = new FormData();
    const newData = val;

    val.IsCompany = Number(val.IsCompany);

    Object.keys(newData).forEach((key) => {
      bodyFormData.append(key, newData[key])
    });

    //console.log(val);
    createNewCompanyRegStore(bodyFormData);
  }
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }
  handleStatus = (event) => {
    for (let i = 0; i < document.getElementsByClassName('checkbox-status').length; i++) {
      document.getElementsByClassName('checkbox-status')[i].checked = false;
    }

    event.target.checked = true;
    this.handleChangeFilter(event);
  }
  handleSelect = (value, name) => {
    let { filter } = this.state;

    filter[name] = value;
    this.setState({ filter });
  }
  handleSubmitSearchForm = () => {
    const { filter } = this.state;
    this.clearFilter();
    this.fetchSummary(JSON.stringify(filter));
  }
  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
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
      "limit": null,
    }
    this.setState({ filter: clearFilter })
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

  onHandleModal = () => {
    // this.props.history.push('/trang_chu/them_danh_sach_moi_dang_ky');
    this.toggleModal("newCompanyModal")
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        messageDel: '',
        newData: [],
        errorUpdate: {}
      });
    }
  };

  handleDeleteRow = () => {
    const { deleteNewCompanyRegStore } = this.props;
    let { deleteItem } = this.state;

    deleteNewCompanyRegStore(deleteItem)
      .then(res => (
        res.data.status == 200 ? (
          this.setState({ delete: res.data, isLoading: true, isLoaded: true, status: true, message: PLEASE_CHECK_CONNECT(res.message) }),
          this.fetchSummary(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }))
        ) : this.setState({ delete: [], isLoading: true, status: false, message: PLEASE_CHECK_CONNECT(res.message) })
      ))
      .catch(err => (
        this.setState({ delete: [], isLoading: true, status: false, message: PLEASE_CHECK_CONNECT(err.message) })
      ));
  }

  render() {
    // const { classes } = this.props;
    const { isLoaded,
      status,
      message,
      data,
      searchData,
      filterList,
      dataMaping,
      checkAtive,
      editStatus,
      openAddNew,
      province,
      district,
      ward,
      filter,
      field,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      moduleBodyInsert,
      newCompanyModal,
      warningPopupModal
    } = this.state;
    const statusPopup = { status: status, message: message };

    let isDisableAdd = true;
    let isDisableEdit = true;
    let isDisableDelete = true;
    if (IS_ADMIN) {
      isDisableAdd = false;
      isDisableEdit = false;
      isDisableDelete = false;
    } else {
      ACCOUNT_CLAIM_FF.filter(x => x == "FreshCompanies.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "FreshCompanies.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "FreshCompanies.Delete").map(y => isDisableDelete = false)
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
                            "filter": "",
                            "orderBy": "",
                            "page": null,
                            "limit": null
                          }))}
                        doanhNghiep={this.state.doanhNghiep}
                        moduleBody={<InsertOrUpdate />}
                        screen='manageCompany'
                        hideCreate={isDisableAdd == false ? false : true}
                        searchForm={
                          <SearchModal
                            filter={filter}
                            field={field}
                            province={province}
                            handleChangeFilter={this.handleChangeFilter}
                            handleStatus={this.handleStatus}
                            handleSelect={this.handleSelect}
                          />
                        }
                        moduleTitle='THÊM MỚI KHÁCH HÀNG'
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        isPreventForm={true}
                        handleModal={this.onHandleModal}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs" responsive>
                          <HeadTitleTable
                            headerTitle={headerTitle}

                            classHeaderColumns={{
                              0: 'table-scale-col table-user-col-1'
                            }}
                          />

                          <tbody ref={ref => this.tableBody = ref}>
                            {
                              Array.isArray(data) && (
                                data
                                  .filter((item, key) => key >= beginItem && key < endItem)
                                  .map((item, key) => (
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
                                      <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                      {/* <td className={`${item.status === 0 || item.status === null ? classes.noActiveStt : classes.activeStt}`}>{item.strStatus}</td> */}

                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.companyName}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.taxCode}</td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.phoneNumber}</td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.email}</td>
                                      <td>
                                        {isDisableEdit == true && isDisableDelete == true ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              {isDisableEdit == false ? (
                                                <DropdownItem
                                                >
                                                  <Link
                                                    className={classes.colorLink}
                                                    to={`/trang_chu/cap_nhat_danh_sach_moi_dang_ky/${item.id}`}>
                                                    Sửa
                                                  </Link>
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
                        (data || []).length > 0 && (
                          <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
                        )
                      }
                    </div>
                  </Row>
                )
              }
              <NewCompanyPopup
                moduleTitle='THÊM MỚI KHÁCH HÀNG'
                moduleBody={
                  <div>
                    <p style={{ textAlign: 'center' }}>Loại khách hàng</p>
                    <div className="row" style={{ justifyContent: 'center' }}>
                      <Button
                        color={"default"}
                        type="button"
                        className={`btn-success-cs`}
                        style={{ margin: 0 }}
                        onClick={() => {
                          // this.setState({ doanhNghiep: 'company' });
                          this.props.history.push(`/trang_chu/them_danh_sach_moi_dang_ky/doanh_nghiep`);
                        }}
                      >
                        {/* <img src={SaveIcon1} alt='Doanh nghiệp' /> */}
                        <span>Doanh nghiệp</span>
                      </Button>

                      <Button
                        color="danger"
                        data-dismiss="modal"
                        type="button"
                        className={`btn-danger-cs`}
                        onClick={() => {
                          this.props.history.push(`/trang_chu/them_danh_sach_moi_dang_ky/ca_nhan`)
                        }}
                      >
                        {/* <img src={CloseIcon} alt='Doanh nghiệp' /> */}
                        <span>Cá nhân</span>
                      </Button>
                    </div>
                  </div>
                }
                newCompanyModal={newCompanyModal}
                toggleModal={this.toggleModal}
              />
              <WarningPopup
                moduleTitle='Thông báo'
                moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
                warningPopupModal={warningPopupModal}
                toggleModal={this.toggleModal}
                handleWarning={this.handleDeleteRow}
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
    company: state.NewRegBusStore,
    location: state.LocationStore,
    field: state.FieldStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionGetListNewly, dispatch),
    ...bindActionCreators(actionLocationCreators, dispatch),
    ...bindActionCreators(actionField, dispatch),
  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(NewRegBus);