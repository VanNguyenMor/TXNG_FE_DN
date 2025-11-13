import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGetBlogList } from "../../../actions/BlogListActions";
import { actionMenuList } from "../../../actions/MenuListAcrions";
import { BLOG_LIST_HEADER, BLOG_LIST_HEADER_SEARCH } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
// import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { DOMAIN_IMG } from "../../../services/Common";
import moment from 'moment';
import './blogList.css'
// import AddBlog from './AddBlog.js'
// import Delete from "./Delete";
// import UpdateBlog from "./UpdateBlog";
// import axios from 'axios';
// import THEM from "../../../assets/images/buttons/THEM.png";
import ComfirmIcon from "../../../assets/img/buttons/confirm.png";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import ViewIcon from "../../../assets/img/buttons/XEM.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeaderTableBN from "components/HeaderTableBN";
import HeadTitleTable from "components/HeadTitleTable";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import AddNewModal from "./AddNewModal";
import UpdatePopup from "../../../components/UpdatePopup";
import UpdatePopupSizeXL from "../../../components/UpdatePopupSizeXL";

//import { addDays } from "../../../helpers/common";
import MenuButton from "../../../assets/img/buttons/menu.png";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import SearchModal from "./SearchModal";
import WarningPopup from "../../../components/WarningPopup";
import UpdateModal from "./UpdateModal";
import { handleGenTree } from "../../../helpers/trees";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import CreateNewPopupBN from "../../../components/CreateNewPopupBN";

import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      blog: [],
      menu: [],
      dataUpdate: [],
      detail: [],
      newData: [],
      newDataUpdate: [],
      newDataFile: [],
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toDate: new Date(),
      dataDefault: null,
      update: null,
      create: null,
      delete: null,
      deleteM: null,
      openDEL: false,
      deleteBlog: null,
      isLoaded: null,
      status: null,
      open: false,
      openUpdate: false,
      openDE: false,
      message: '',
      history: [],
      dataMaping: [
        'index', 'title', 'menuName', 'thumbnail', 'views', 'modifiedDate'
      ],
      searchData: [],
      filterList: [],
      checkAtive: [{}],
      fetching: false,
      selected: [],
      fetchingUpdate: false,
      fetchingDelete: false,
      typeAlign: [
        {
          type: 'number', position: [4]
        },
        {
          type: 'date', position: [3, 5]
        },
        {
          type: 'hours', position: []
        }
      ],
      headerTitle: BLOG_LIST_HEADER,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      filter: {
        "startDate": this.fromDate(moment().startOf('month').format('YYYY-MM-DD')),
        "endDate": this.toDate(new Date()),
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      },
      errorInsert: {},
      errorUpdate: {},
      activeCreateSubmit: false,
      warningPopupModal: false,
      deleteItem: null,
      updateModal: false,
      idRow: null
    }


  }

  componentWillReceiveProps(nextProp) {
    const { fetching, fetchingUpdate, fetchingDelete, fromDate, toDate } = this.state;
    let { data } = nextProp.blog;
    let menuData = nextProp.menu.data;
    let newData = [];
    let getIdData = nextProp.blog.data;
    let menuDataParent = [];
    let haveRoot = false;
    let int = true;
    const { limit } = this.state;


    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.blog) !== 'undefined') {
          if (data.company !== null) {
            if (typeof (data.blog.blogs) !== 'undefined') {
              data.blog.blogs.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
                item['date'] = item.modifiedDate ? moment(item.modifiedDate).format('DD/MM/YYYY') : '';
                item['hours'] = item.modifiedDate ? moment(item.modifiedDate).format('HH:mm') : '';
                item['thumbnail'] = <img src={item.thumbnail ? item.thumbnail : NoImg} style={{ width: 450, height: 300 }} />
              });
              this.setState({ data: [] });

              let totalElement = 0;

              if (data.blog.blogs.length > limit) {
                totalElement = limit;
              } else {
                totalElement = data.blog.blogs.length;
              }

              this.setState({
                totalElement,
                data: data.blog.blogs,
                selected: data.blog.blogs,
                listLength: data.blog.total,
                totalPage: Math.ceil(data.blog.blogs.length / limit),
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.blog.blogs,
                history: data.blog.blogs,
                isLoaded: data.isLoading,
                totalPage: Math.ceil(data.blog.blogs.length / limit),
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }

    if (typeof (data.getid) !== 'undefined') {
      if (data.getid !== null) {
        if (data.status) {

          this.setState({
            dataUpdate: null
          });
          this.setState({
            dataUpdate: data.getid,
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        } else {
          this.setState({
            dataUpdate: [],
            isLoaded: false,
            status: data.status,
            message: PLEASE_CHECK_CONNECT(data.message)
          });
        }
      }
    }

    // if (menuData !== this.state.menu) {
    //     if (typeof (menuData) !== 'undefined') {
    //         if (typeof (menuData.menu) !== 'undefined') {
    //             if (menuData.menu !== null) {
    //                 this.setState({
    //                     menu: menuData.menu.menus,
    //                     isLoaded: false,
    //                     status: data.status,
    //                     message: PLEASE_CHECK_CONNECT(data.message)
    //                 });
    //             } else {
    //                 this.setState({
    //                     menu: [],
    //                     isLoaded: false,
    //                     status: data.status,
    //                     message: PLEASE_CHECK_CONNECT(data.message)
    //                 });
    //             }
    //         }
    //     }
    // }

    if (menuData !== this.state.menu) {
      if (typeof (menuData) !== 'undefined') {
        if (menuData.menu !== null) {
          if (typeof (menuData.menu) !== 'undefined') {
            menuData.menu.menus
              .filter(item => item.parentID === 0)
              .map(item => haveRoot = true);

            if (haveRoot) {

              menuDataParent = handleGenTree(menuData.menu.menus, 'menuName', int);

              menuDataParent.map((item, key) => {
                item['index'] = key + 1
              });

            } else {
              // Search Element in tree

              menuData.menu.menus.map((item, key, array) => (
                key === 0 && (item.parentID = 0)
              ));

              menuDataParent = handleGenTree(menuData.menu.menus, 'menuName', int);

              menuDataParent.map((item, key) => {
                item['index'] = key + 1
              });
            }




            this.setState({
              menuAll: menuData.menu.menus,
              menu: menuDataParent,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });

          } else {
            this.setState({
              menu: menuDataParent,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (typeof (data.create) !== 'undefined') {
      if (data.create !== null) {
        if (data.status && !fetching) {
          /* Fetch Summary */
          this.setState({ data: [] });
          this.fetchSummary(JSON.stringify({
            // "startDate": this.toDate(fromDate),
            // "endDate": this.toDate(toDate),
            "startDate": null,
            "endDate": null,
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));
          this.setState({ fetching: true });
        }

        this.setState({
          create: data.create,
          isLoaded: data.isLoading,
          status: data.status,
          message: PLEASE_CHECK_CONNECT(data.message)
        });
      }
    }

    if (typeof (data.delete) !== 'undefined') {
      if (data.status && !fetchingDelete) {
        setTimeout(() => {
          /* Fetch Summary */
          this.setState({ data: [] });
          this.fetchSummary(JSON.stringify({
            "startDate": null,
            "endDate": null,
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }));
          this.setState({ fetchingDelete: true });
        }, 1000);
      }

      this.setState({
        delete: data.delete,
        isLoaded: data.isLoading,
        status: data.status,
        message: PLEASE_CHECK_CONNECT(data.message)
      });
    }
  }
  componentWillMount() {
    const { requestMenuList } = this.props;
    //moment().startOf('month').format('YYYY-MM-DD')
    requestMenuList(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }
  componentDidMount() {
    // This method is called when the component is first added to the document
    const { fromDate, toDate } = this.state;
    this.filterMapKey();
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "startDate": null,
      "endDate": null,
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));


  }
  fromDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }

  toDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }
  fetchSummaryGetUpdate = (id) => {
    const { requestGetIdBLog } = this.props;
    requestGetIdBLog(id);
  }
  getIdUpdate = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryGetUpdate(
        value.id,
      )
    }
  }
  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestBLogList } = this.props;

    requestBLogList(data);
  }
  getId = (value) => {
    if (typeof (value.id) !== 'undefined') {
      this.fetchSummaryDelete(
        value.id,
      )
    }

  }
  fetchSummaryDelete = (id) => {
    const { requestDeleteBLog } = this.props;

    requestDeleteBLog(id);
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
  componentCreate = (value, closeForm, closePopup) => {
    let { data, newDataIn } = this.state;

    const { requestCreateBLog } = this.props;

    let createData = {};
    if (newDataIn) {
      createData = {
        Title: newDataIn.Title,
        MenuID: newDataIn.MenuID,
        Description: newDataIn.Description,
        Content: newDataIn.Content,
        ThumbnailFile: newDataIn.ThumbnailFile,
        //IsShow: value.IsShow,
        IsHot: newDataIn.IsHot,
      };
    }
    const errorInsert = {};

    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert
      }
    });
    if (!createData.ThumbnailFile) {
      errorInsert['ThumbnailFile'] = 'Hình đại diện không được bỏ trống';
    }

    if (!createData.Title) {
      errorInsert['Title'] = 'Tiêu đề không được bỏ trống';
    }
    if ((!createData.Title).length > 1000) {
      errorInsert['Title'] = 'Nhập tối đa 1000 ký tự';
    }
    if (!createData.MenuID) {
      errorInsert['MenuID'] = 'Chưa chọn menu';
    }
    if (!createData.Description) {
      errorInsert['Description'] = 'Mô tả không được bỏ trống';
    }
    if (!createData.Content) {
      errorInsert['Content'] = 'Nội dung không được bỏ trống';
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
    // A
    const dataCC = createData;

    const formData = new FormData();

    const keys = Object.keys(dataCC);

    for (let i = 0; i < keys.length; i++) {
      if (Array.isArray(dataCC[keys[i]])) {
        const array = dataCC[keys[i]];

        for (let j = 0; j < array.length; j++) {
          const keyArrays = Object.keys(array[j]);

          for (let k = 0; k < keyArrays.length; k++) {
            formData.append(`${keys[i]}[${j}].${keyArrays[k]}`, array[j][keyArrays[k]]);
          }
        }
      } else if ((dataCC[keys[i]] || {}).size) {
        formData.append(keys[i], dataCC[keys[i]]);
      } else if (typeof dataCC[keys[i]] === 'object') {
        formData.append(keys[i], JSON.stringify(dataCC[keys[i]]));
      } else {
        formData.append(keys[i], dataCC[keys[i]]);
      }
    }

    //console.log([...formData]);

    // A

    this.handleopen(true);
    requestCreateBLog(formData).then(res => {
      if (res.data.status) {
        if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
      }
    })
  }
  handleCloseDEL = (value) => {
    const { openDEL } = this.state;
    this.setState({ deleteM: value });
    this.setState({ openDEL: value });
  }
  handleDeleteRow = (id) => {
    const { requestDeleteBLog } = this.props;
    let { selected, data } = this.state;
    //this.handleCloseDEL(true);
    this.setState({ fetchingDelete: false });
    requestDeleteBLog(id);

  }
  handleDeleteRow = () => {
    const { requestDeleteBLog, requestBLogList } = this.props;
    let { data, deleteItem, fromDate, toDate } = this.state;
    let newData = data.filter(item => item.id === deleteItem).map((item, key) => {
      item.status = 0
    });

    requestDeleteBLog(deleteItem)
      .then(res => (
        res.status === 200 ? (
          this.setState({
            deleteItem: [],
            isLoading: true,
            status: true,
            message: PLEASE_CHECK_CONNECT(res.message)
          }),
          requestBLogList(JSON.stringify({
            "startDate": null,
            "endDate": null,
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
          }))
        ) : this.setState({
          deleteItem: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(res.message)
        })
      ))
      .catch(err => (
        this.setState({
          deleteItem: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message)
        })
      ));
  }
  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.id === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }
  handleUpdateBlog = (value) => {
    let { newDataUpdate, idRow, fromDate, toDate, contentFromUpdate } = this.state;
    const { requestUpdateBLog, requestBLogList } = this.props;

    const updateBlog = {
      ID: newDataUpdate.Id,
      Title: newDataUpdate.Title,
      MenuID: newDataUpdate.MenuID,
      Description: newDataUpdate.Description,
      Content: contentFromUpdate,
      Thumbnail: newDataUpdate.Thumbnail,
      ThumbnailFile: newDataUpdate.ThumbnailFile,
      IsShow: newDataUpdate.IsShow ? true : false,
      IsHot: newDataUpdate.IsHot,
    };

    const errorUpdate = {};
    this.setState(previousState => {
      return {
        ...previousState,
        errorUpdate
      }
    });

    if ((!updateBlog.Thumbnail) && (!updateBlog.ThumbnailFile)) {
      errorUpdate['Thumbnail'] = 'Hình đại diện không được bỏ trống';
    }

    if (!updateBlog.Title) {
      errorUpdate['Title'] = 'Tiêu đề không được bỏ trống';
    }
    if ((!updateBlog.Title).length > 1000) {
      errorUpdate['Title'] = 'Nhập tối đa 1000 ký tự';
    }
    if (!updateBlog.MenuID) {
      errorUpdate['MenuID'] = 'Chưa chọn menu';
    }
    if (!updateBlog.Description) {
      errorUpdate['Description'] = 'Mô tả không được bỏ trống';
    }
    if (!updateBlog.Content) {
      errorUpdate['Content'] = 'Nội dung không được bỏ trống';
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

    // A
    const dataCC = updateBlog;

    const formDataUpdate = new FormData();

    const keys = Object.keys(dataCC);

    for (let i = 0; i < keys.length; i++) {
      if (Array.isArray(dataCC[keys[i]])) {
        const array = dataCC[keys[i]];

        for (let j = 0; j < array.length; j++) {
          const keyArrays = Object.keys(array[j]);

          for (let k = 0; k < keyArrays.length; k++) {
            formDataUpdate.append(`${keys[i]}[${j}].${keyArrays[k]}`, array[j][keyArrays[k]]);
          }
        }
      } else if ((dataCC[keys[i]] || {}).size) {
        formDataUpdate.append(keys[i], dataCC[keys[i]]);
      } else if (typeof dataCC[keys[i]] === 'object') {
        formDataUpdate.append(keys[i], JSON.stringify(dataCC[keys[i]]));
      } else {
        formDataUpdate.append(keys[i], dataCC[keys[i]]);
      }
    }

    //console.log([...formDataUpdate]);

    // A

    //requestUpdateBLog(JSON.stringify(formDataUpdate));
    requestUpdateBLog(formDataUpdate).then(res => (
      requestBLogList(JSON.stringify({
        "startDate": this.fromDate(fromDate),
        "endDate": this.toDate(toDate),
        "search": "",
        "filter": "",
        "orderBy": "",
        "page": null,
        "limit": null
      }))

    ))
      .catch(err => (
        this.setState({
          update: [],
          isLoading: true,
          status: false,
          message: PLEASE_CHECK_CONNECT(err.message)
        })
      ));

    this.setState({ fetchingUpdate: false });
  }
  handleEditRow = (id) => {
    let { selected } = this.state;
    let current = null;

    for (let i = 0; i < selected.length; i++) {
      if (selected[i].id === id) current = selected[i];
    }

    this.setState({ detail: current });

    this.handleCloseUpdate(true);
  }
  handleOpenEdit = (id) => {
    const { requestGetIdBLog } = this.props;
    //let {idRow} = this.state;
    this.setState({ idRow: id })
    requestGetIdBLog(id).then(() => {
      this.toggleModal('updateModal');
    });
  }
  handleCloseUpdate = (value) => {
    const { openUpdate } = this.state;

    this.setState({ openUpdate: value });
  }

  handleopen = (value) => {
    const { open } = this.state;
    this.setState({ open: value });
  }
  handleClose = (value) => {
    const { openDE } = this.state;

    this.setState({ openDE: value });
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
  handleChangeFromDate = (event) => {
    this.setState({
      fromDate: new Date(event)
    });
  }
  handleChangeToDate = (event) => {

    this.setState({
      toDate: new Date(event)
    });
  }
  handleChangeFilter = (event) => {
    let { filter } = this.state;
    const ev = event.target;

    filter[ev['name']] = ev['value'];

    this.setState({ filter });
  }
  handleSubmitSearchForm = () => {
    let { filter, fromDate, toDate } = this.state;
    const { requestBLogList } = this.props;
    filter.startDate = fromDate
    filter.endDate = toDate
    this.setState({ filter })
    requestBLogList(JSON.stringify(filter));
    this.clearFilter();

  }
  handleSelect = (value, name) => {
    let { filter, dataDefault } = this.state;

    filter[name] = value;

    this.setState({ filter, dataDefault: value });
  }
  clearFilter = () => {
    const { filter } = this.state;
    let clearFilter = {
      "startDate": moment(new Date()).format('YYYY-MM-DD'),
      "endDate": moment(new Date()).format('YYYY-MM-DD'),
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }
    //console.log(clearFilter)
    this.setState({ filter: clearFilter })

  }

  renderCreateModal = () => {
    const { menu } = this.state;
    return (
      <AddNewModal
        data={menu}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewDataInSert}
        errorInsert={this.state.errorInsert}
      />
    );
  }
  handleCheckValidation = (status) => {
    this.setState({ activeCreateSubmit: status });
  }

  handleNewData = (data, file) => {

    this.setState({ newData: data });
    this.setState({ newDataFile: file });
  }

  handleNewDataInSert = (data, file) => {

    this.setState({ newDataIn: data });
    this.setState({ newDataFileIn: file });
  }

  handleNewDataUpdate = (data, contentFromUpdate) => {

    this.setState({ newDataUpdate: data, contentFromUpdate: contentFromUpdate });

  }
  closeForm = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        errorInsert: {}
      }
    });
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
        newDataIn: null,
        newData: null
      });
    }
  };
  render() {
    // const { classes } = this.props;
    const {
      isLoaded,
      status,
      message,
      data,
      searchData,
      selected,
      filterList,
      dataMaping,
      dataUpdate,
      checkAtive,
      open,
      openDE,
      menu,
      detail,
      openDEL,
      deleteM,
      openUpdate,
      typeAlign,
      beginItem,
      endItem,
      listLength,
      totalPage,
      totalElement,
      headerTitle,
      limit,
      fromDate,
      toDate,
      filter,
      dataDefault,
      activeCreateSubmit,
      newData,
      warningPopupModal,
      updateModal,
      errorUpdate,
      createNewModal
    } = this.state;
    // console.log(data);
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
      ACCOUNT_CLAIM_FF.filter(x => x == "Blogs.Add").map(y => isDisableAdd = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Blogs.Edit").map(y => isDisableEdit = false)
      ACCOUNT_CLAIM_FF.filter(x => x == "Blogs.Delete").map(y => isDisableDelete = false)
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
                        dataReload={() => this.fetchSummary(JSON.stringify({
                          "startDate": null,
                          "endDate": null,
                          "search": "",
                          "filter": "",
                          "orderBy": "",
                          "page": null,
                          "limit": null
                        }))}
                        hideCreate={isDisableAdd == false ? false : true}
                        screen='blog'
                        searchForm={
                          <SearchModal
                            filter={filter}
                            data={data}
                            menu={menu}
                            dataDefault={dataDefault}
                            handleChangeFromDate={this.handleChangeFromDate}
                            handleChangeToDate={this.handleChangeToDate}
                            handleChangeFilter={this.handleChangeFilter}
                            handleSelect={this.handleSelect}
                            fromDate={fromDate}
                            toDate={toDate}
                          />

                        }
                        handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                        moduleTitle='Thêm bài viết'
                        moduleBody={this.renderCreateModal()}
                        activeSubmit={activeCreateSubmit}
                        newData={newData}
                        menu={menu}
                        handleCreateInfoData={this.componentCreate}
                        isPreventForm={true}
                        closeForm={this.closeForm}
                      />

                      {/* Table */}
                      <Card className="shadow">
                        <Table className="align-items-center tablecs table-css-blogList" responsive>
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
                                    <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
                                      <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                        <img style={{ width: "82px", height: "82px" }} src={item?.thumbnail?.props?.src?.props?.src ? item?.thumbnail?.props?.src.props?.src : item?.thumbnail?.props?.src} alt="..." />
                                        {/* {item.thumbnail} */}
                                      </td>
                                      <td style={{ textAlign: 'left' }} className='table-scale-col' >
                                        {item.title} <br />
                                        <span>Menu:&nbsp;<i>{item.menuName}</i></span>
                                      </td>
                                      {/* <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.menuName}</td> */}

                                      <td><input id='isDis' type="checkbox" disabled checked={item.isHot} />
                                        <span className={classes.cbDis}></span></td>
                                      <td><input id='isDis' type="checkbox" disabled checked={item.isShow === true ? true : false} />
                                        <span className={classes.cbDis}></span></td>
                                      <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.views}</td>
                                      <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                        <span>{item.hours}</span><br />
                                        <span>{item.date}</span>
                                      </td>

                                      <td>
                                        {isDisableEdit == true && isDisableDelete == true ? null : (
                                          <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                            <DropdownToggle>
                                              <img src={MenuButton} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                              {isDisableEdit == false ? (
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.handleOpenEdit(item.id);
                                                  }}
                                                >
                                                  Sửa
                                                </DropdownItem>
                                              ) : null}
                                              {isDisableEdit == true || isDisableDelete == true ? null : (
                                                <DropdownItem divider />
                                              )}
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
                dataUpdate !== null && (
                  <UpdatePopupSizeXL
                    moduleTitle='Cập nhật thông tin'
                    moduleBody={
                      <UpdateModal
                        data={dataUpdate}
                        errorUpdate={errorUpdate}
                        handleCheckValidation={this.handleCheckValidation}
                        handleNewData={this.handleNewDataUpdate}
                        menu={menu}
                      />}
                    newData={newData}
                    updateModal={updateModal}
                    toggleModal={this.toggleModal}
                    activeSubmit={activeCreateSubmit}
                    handleUpdateInfoData={this.handleUpdateBlog}
                  />
                )
              }

              <CreateNewPopupBN
                newData={newData}
                createNewModal={createNewModal}
                moduleTitle='Thêm bài viết'
                type100={true}
                moduleBody={this.renderCreateModal()}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleCreateInfoData={(data, beta, close) => {
                  this.componentCreate(data, () => {
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
    blog: state.BlogListStore,
    menu: state.MenuListStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionGetBlogList, dispatch),
    ...bindActionCreators(actionMenuList, dispatch)
  }
}
export default compose(
  // withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BlogList);