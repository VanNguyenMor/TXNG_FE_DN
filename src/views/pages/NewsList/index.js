import React, { Component, useState } from "react";
//import { useStyles } from "./styles.js";
import { bindActionCreators } from "redux";
//import { withStyles } from "@material-ui/core/styles";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGetNEWSList } from "../../../actions/NewsListActions";
import { actionMenuList } from "../../../actions/MenuListAcrions";
import { NEWS_LIST_HEADER } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
// import Loader from "../../../components/Loader/Loader";
// import Table from "../../../components/Table/Table";
// import Button from '@material-ui/core/Button';
// import Select from "../../../components/Select";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { DOMAIN_IMG } from "../../../services/Common";
import moment from 'moment';
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
import MenuButton from "../../../assets/img/buttons/menu.png";
//import { addDays } from "../../../helpers/common";

import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import SearchModal from "./SearchModal";
import WarningPopup from "../../../components/WarningPopup";
import UpdateModal from "./UpdateModal";

import {
    Card,
    Table,
    Container,
    Row,
    Spinner,
    Input,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class NewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            news: [],
            menu: [],
            dataUpdate: [],
            detail: [],
            newData: [],
            newDataUpdate: [],
            newDataFile: [],
            fromDate: new Date(),
            toDate: new Date(),
            dataDefault: null,
            update: null,
            create: null,
            delete: null,
            deleteM: null,
            openDEL: false,
            deleteNews: null,
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
            headerTitle: NEWS_LIST_HEADER,
            limit: LIMIT_ITEM_IN_PAGE,
            beginItem: 0,
            endItem: LIMIT_ITEM_IN_PAGE,
            totalElement: 0,
            listLength: 0,
            currentPage: 0,
            filter: {
                "startDate": this.fromDate(new Date()),
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
        let { data } = nextProp.news;
        let menuData = nextProp.menu.data;
        let newData = [];
        let getIdData = nextProp.news.data;
        const { limit } = this.state;


        if (data !== this.state.data) {
            if (typeof (data) !== 'undefined') {
                if (typeof (data.news) !== 'undefined') {
                    if (data.company !== null) {
                        if (typeof (data.news.newses) !== 'undefined') {
                            data.news.newses.map((item, key) => {
                                item['index'] = key + 1;
                                item['collapse'] = false;
                                // item['modifiedDate'] = moment(item.modifiedDate).format('HH:mm') + '\n' + moment(item.modifiedDate).format('DD/MM/YYYY');
                                item['date'] = moment(item.modifiedDate).format('DD/MM/YYYY');
                                item['hours'] = moment(item.modifiedDate).format('HH:mm');
                                item['thumbnail'] = <img src={item.thumbnail} style={{ width: 450, height: 300 }} />
                            });
                            //this.setState({ data: data.blog.blogs, history: data.blog.blogs, isLoaded: data.isLoading, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
                            this.setState({ data: [] });
                            this.setState({
                                data: data.news.newses,
                                selected: data.news.newses,
                                listLength: data.news.total,
                                totalPage: Math.ceil(data.news.newses.length / limit),
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        } else {
                            this.setState({
                                data: data.news.newses,
                                history: data.news.newses,
                                isLoaded: data.isLoading,
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

        if (menuData !== this.state.menu) {
            if (typeof (menuData) !== 'undefined') {
                if (typeof (menuData.menu) !== 'undefined') {
                    if (menuData.menu !== null) {
                        this.setState({
                            menu: menuData.menu.menus,
                            isLoaded: false,
                            status: data.status,
                            message: PLEASE_CHECK_CONNECT(data.message)
                        });
                    } else {
                        this.setState({
                            menu: [],
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
            "startDate": this.fromDate(fromDate),
            "endDate": this.toDate(toDate),
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
        }));


    }
    fromDate = (val) => {
        let date = moment(val).format('YYYY-MM-DD');

        return date;
    }

    toDate = (val) => {
        let date = moment(val).format('YYYY-MM-DD');

        return date;
    }
    fetchSummaryGetUpdate = (id) => {
        const { requestGetIdNEWS } = this.props;
        requestGetIdNEWS(id);
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
        const { requestNEWSList } = this.props;

        requestNEWSList(data);
    }
    getId = (value) => {
        if (typeof (value.id) !== 'undefined') {
            this.fetchSummaryDelete(
                value.id,
            )
        }

    }
    fetchSummaryDelete = (id) => {
        const { requestDeleteNEWS } = this.props;

        requestDeleteNEWS(id);
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
    componentCreate = (value, closeForm) => {
        let { data } = this.state;

        const { requestCreateNEWS } = this.props;


        const createData = {
            Title: value.Title,
            MenuID: value.MenuID,
            Description: value.Description,
            Content: value.Content,
            ThumbnailFile: value.ThumbnailFile,
        };
        const errorInsert = {};

        this.setState(previousState => {
            return {
                ...previousState,
                errorInsert
            }
        });
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

        // A

        this.handleopen(true);
        requestCreateNEWS(formData);
    }
    handleCloseDEL = (value) => {
        const { openDEL } = this.state;
        this.setState({ deleteM: value });
        this.setState({ openDEL: value });
    }
    handleDeleteRow = (id) => {
        const { requestDeleteNEWS } = this.props;
        let { selected, data } = this.state;
        //this.handleCloseDEL(true);
        this.setState({ fetchingDelete: false });
        requestDeleteNEWS(id);

    }
    handleDeleteRow = () => {
        const { requestDeleteNEWS, requestNEWSList } = this.props;
        let { data, deleteItem, fromDate, toDate } = this.state;
        let newData = data.filter(item => item.id === deleteItem).map((item, key) => {
            item.status = 0
        });

        requestDeleteNEWS(deleteItem)
            .then(res => (
                res.status === 200 ? (
                    requestNEWSList(JSON.stringify({
                        "startDate": this.fromDate(fromDate),
                        "endDate": this.toDate(toDate),
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
    handleUpdateNews = (value) => {
        let { newDataUpdate, idRow, fromDate, toDate } = this.state;
        const { requestUpdateNEWS, requestNEWSList } = this.props;
        const updateNews = {
            ID: newDataUpdate.Id,
            Title: newDataUpdate.Title,
            MenuID: newDataUpdate.MenuID,
            Description: newDataUpdate.Description,
            Content: newDataUpdate.Content,
            ThumbnailFile: newDataUpdate.ThumbnailFile,
        };
        const errorUpdate = {};
        this.setState(previousState => {
            return {
                ...previousState,
                errorUpdate
            }
        });
        if (!updateNews.Title) {
            errorUpdate['Title'] = 'Tiêu đề không được bỏ trống';
        }
        if ((!updateNews.Title).length > 1000) {
            errorUpdate['Title'] = 'Nhập tối đa 1000 ký tự';
        }
        if (!updateNews.MenuID) {
            errorUpdate['MenuID'] = 'Chưa chọn menu';
        }
        if (!updateNews.Description) {
            errorUpdate['Description'] = 'Mô tả không được bỏ trống';
        }
        if (!updateNews.Content) {
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
        const dataCC = updateNews;

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
        requestUpdateNEWS(formDataUpdate).then(res => (
            requestNEWSList(JSON.stringify({
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
        const { requestGetIdNEWS } = this.props;
        //let {idRow} = this.state;
        this.setState({ idRow: id })
        requestGetIdNEWS(id);

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
        const { requestNEWSList } = this.props;
        filter.startDate = fromDate
        filter.endDate = toDate
        this.setState({ filter })
        requestNEWSList(JSON.stringify(filter));
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
                handleNewData={this.handleNewData}
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
    handleNewDataUpdate = (data) => {

        this.setState({ newDataUpdate: data });
        //console.log(this.state.newDataUpdate)
    }
    toggle = (el, val) => {
        let { data } = this.state;

        data.filter(item => item.id === val)
            .map(item => item.collapse = !item.collapse);

        this.setState({ data });
    }
    closeForm = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                errorInsert: {}
            }
        });
    }
    toggleModal = (state) => {
        this.setState({
            [state]: !this.state[state],
            detail: null,
            newDataUpdate: null,
            dataUpdate: null,
            errorUpdate: {}
        });
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
            errorUpdate
        } = this.state;
        const statusPopup = { status: status, message: message };

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
                                                screen='news'
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
                                                                            <td style={{ textAlign: 'left' }} className='table-scale-col' >{item.title} </td>
                                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.menuName}</td>
                                                                            <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.thumbnail}</td>
                                                                            <td style={{ textAlign: 'right' }} className='table-scale-col'>{item.views}</td>
                                                                            <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                                                                {/* {item.modifiedDate} */}
                                                                                <span>{item.hours}</span><br />
                                                                                <span>{item.date}</span>
                                                                            </td>

                                                                            {/* <td>
                                                                                <div className={classes.editArea}>
                                                                                    

                                                                                    <div className={classes.item}
                                                                                        onClick={() => {
                                                                                            this.toggleModal('updateModal');
                                                                                            this.handleOpenEdit(item.id);
                                                                                        }}
                                                                                    >
                                                                                        <img src={EditIcon} alt="Sửa" title="Sửa" />
                                                                                    </div>
                                                                                    <div className={classes.item}
                                                                                        onClick={() => {
                                                                                            this.toggleModal('warningPopupModal');
                                                                                            this.setState({ deleteItem: item.id });
                                                                                        }}
                                                                                    >
                                                                                        <img src={DeleteIcon} alt="Xóa" title="Xóa" />
                                                                                    </div>

                                                                                </div>
                                                                            </td> */}
                                                                            <td>
                                                                                <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
                                                                                    <DropdownToggle>
                                                                                        <img src={MenuButton} />
                                                                                    </DropdownToggle>
                                                                                    <DropdownMenu>
                                                                                        <DropdownItem
                                                                                            onClick={() => {
                                                                                                this.toggleModal('updateModal');
                                                                                                this.handleOpenEdit(item.id);
                                                                                            }}
                                                                                        >
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
                                                                    ))
                                                            )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Card>

                                            {/* Pagination */}
                                            {
                                                // Page of Table
                                                Array.isArray(data) > 0 && (
                                                    <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
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
                                        handleUpdateInfoData={this.handleUpdateNews}
                                    />
                                )
                            }
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
        news: state.NewsListStore,
        menu: state.MenuListStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionGetNEWSList, dispatch),
        ...bindActionCreators(actionMenuList, dispatch)
    }
}
export default compose(
    // withStyles(useStyles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(NewsList);