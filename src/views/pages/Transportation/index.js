import React, { Component } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionTransportation } from "../../../actions/TransportationActions";
import { TRANSPORTATION } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import WarningPopupDel from "../../../components/WarningPopupDel";
import UpdateModal from "./UpdateModal";
import UpdatePopup from "../../../components/UpdatePopup";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import AddNewModal from "./AddNewModal";
import PopupMessage from "../../../components/PopupMessage";
import CreateNewPopup from "../../../components/CreateNewPopup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Card,
    Table,
    Container,
    Row,
    Spinner,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class Transportation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            detail: null,
            update: null,
            create: null,
            delete: null,
            isLoaded: null,
            status: null,
            open: false,
            message: '',
            headerTitle: TRANSPORTATION,
            limit: LIMIT_ITEM_IN_PAGE,
            beginItem: 0,
            endItem: LIMIT_ITEM_IN_PAGE,
            totalElement: 0,
            listLength: 0,
            currentPage: 0,
            totalPage: 0,
            filter: {
                "transportName": "",
                "orderBy": "",
                "page": null,
                "limit": null
            },
            deleteItem: null,
            warningPopupDelModal: false,
            activeCreateSubmit: false,
            newData: [],
            errorInsert: {},
            errorUpdate: {},
            currentRow: null,
            updateModal: false,
            createNewModal: false,
            popupMessage: false,
            errNoti: '',
            editId: null,
        }
    }

    componentWillReceiveProps(nextProp) {
        let { data } = nextProp.transportation;
        const { limit } = this.state;
        if (data !== this.state.data) {
            if (typeof (data) !== 'undefined') {
                if (typeof (data.list) !== 'undefined') {
                    if (data.list !== null) {
                        if (typeof (data.list.transportations) !== 'undefined') {
                            data.list.transportations.map((item, key) => {
                                item['index'] = key + 1;
                                item['collapse'] = false;
                            });

                            this.setState({
                                data: data.list.transportations,
                                listLength: data.list.total,
                                totalPage: Math.ceil(data.list.total / limit),
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        } else if (Array.isArray(data.list)) {
                            data.list.map((item, key) => {
                                item['index'] = key + 1;
                                item['collapse'] = false;
                            });

                            this.setState({
                                data: data.list,
                                listLength: data.list.length,
                                totalPage: Math.ceil(data.list.length / limit),
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        } else {
                            this.setState({
                                isLoaded: data.isLoading,
                                status: data.status,
                                message: PLEASE_CHECK_CONNECT(data.message)
                            });
                        }
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

    componentWillMount() {
        this.fetchSummary(JSON.stringify({
            "transportName": "",
            "orderBy": "",
            "page": null,
            "limit": null
        }));
    }

    componentDidUpdate() {
        this.closeStatusModal();
    }

    fetchSummary = (data) => {
        const { requestListTransportation } = this.props;
        requestListTransportation(data);
    }

    closeStatusModal = () => {
        const { status } = this.state;

        if (status || !status) {
            setTimeout(() => {
                this.setState({ status: null, isLoaded: false });
            }, LOADING_TIME);
        }
    }

    handleNewDataUpdate = (data) => {
        this.setState({ newDataUpdate: data });
    }

    handleNewData = (data) => {
        this.setState({ newData: data });
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
                currentRow: null,
            });
        }
    };

    handleCheckValidation = (status) => {
        this.setState({ activeCreateSubmit: status });
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

    handleDeleteRow = () => {
        const { requestDeleteTransportation } = this.props;
        let { deleteItem } = this.state;

        requestDeleteTransportation(deleteItem)
            .then(res => {
                if (res.data.status === 200) {
                    this.fetchSummary(JSON.stringify({
                        "transportName": "",
                        "orderBy": "",
                        "page": null,
                        "limit": null
                    }));
                    toast.success("Xoá vận chuyển thành công!");
                } else {
                    this.setState({ errNoti: res.data.message });
                    this.toggleModal('popupMessage');
                }
            })
    }

    renderCreateModal = () => {
        return (
            <AddNewModal
                handleCheckValidation={this.handleCheckValidation}
                handleNewData={this.handleNewData}
                errorInsert={this.state.errorInsert}
            />
        );
    }

    handleCreateInfoData = (value, closeForm, closePopup) => {
        const { requestCreateTransportation } = this.props;
        const { data } = this.state;
        const errorInsert = {};
        this.setState(previousState => {
            return {
                ...previousState,
                errorInsert
            }
        });

        if (!value.TransportName) {
            errorInsert['TransportName'] = 'Tên vận chuyển không được bỏ trống';
        }

        if ((value.TransportName || '').length > 255) {
            errorInsert['TransportName'] = 'Tên vận chuyển nhập tối đa 255 ký tự';
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

        const bodyFormData = new FormData();
        Object.keys(value).forEach((key) => {
            bodyFormData.append(key, value[key]);
        });

        requestCreateTransportation(bodyFormData).then(res => {
            if (res.data.status == 200) {
                if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }

                toast.success("Thêm vận chuyển thành công!");
                this.fetchSummary(JSON.stringify({
                    "transportName": "",
                    "orderBy": "",
                    "page": null,
                    "limit": null
                }));
            } else {
                this.setState({ errNoti: res.data.message });
                this.toggleModal('popupMessage');
            }
        });
    }

    handleUpdateInfoData = (value) => {
        const { requestUpdateTransportation } = this.props;
        const { newDataUpdate } = this.state;
        const errorUpdate = {};
        let _newDataUpdate = {
            ID: newDataUpdate.ID,
            TransportName: newDataUpdate.TransportName,
            TransportType: newDataUpdate.TransportType ? newDataUpdate.TransportType : '',
            PhoneNumber: newDataUpdate.PhoneNumber ? newDataUpdate.PhoneNumber : '',
            Email: newDataUpdate.Email ? newDataUpdate.Email : '',
            Address: newDataUpdate.Address ? newDataUpdate.Address : '',
            Note: newDataUpdate.Note ? newDataUpdate.Note : '',
        };

        this.setState(previousState => {
            return {
                ...previousState,
                errorUpdate
            }
        });

        if (!_newDataUpdate.TransportName) {
            errorUpdate['TransportName'] = 'Tên vận chuyển không được bỏ trống';
        }

        if ((_newDataUpdate.TransportName || '').length > 255) {
            errorUpdate['TransportName'] = 'Tên vận chuyển nhập tối đa 255 ký tự';
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
                updateModal: false
            }
        });

        const bodyFormData = new FormData();
        Object.keys(_newDataUpdate).forEach((key) => {
            bodyFormData.append(key, _newDataUpdate[key]);
        });

        requestUpdateTransportation(bodyFormData).then(res => {
            if (res.data.status == 200) {
                toast.success("Cập nhật vận chuyển thành công!");
                this.fetchSummary(JSON.stringify({
                    "transportName": "",
                    "orderBy": "",
                    "page": null,
                    "limit": null
                }));
            } else {
                this.setState({ errNoti: res.data.message });
                this.toggleModal('popupMessage');
            }
        });
    }

    handleOpenEdit = (id) => {
        this.toggleModal('updateModal');
        this.setState(previousState => {
            return {
                ...previousState,
                editId: id
            }
        });
    }

    render() {
        const { hideSearch, hookClass, hookSpacing, hideTitle } = this.props;
        const {
            isLoaded,
            status,
            message,
            data,
            detail,
            headerTitle,
            beginItem,
            endItem,
            listLength,
            totalPage,
            totalElement,
            warningPopupDelModal,
            activeCreateSubmit,
            newData,
            updateModal,
            popupMessage,
            errNoti,
            createNewModal
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

            ACCOUNT_CLAIM_FF.filter(x => x == "Transportations.Add").map(y => isDisableAdd = false);
            ACCOUNT_CLAIM_FF.filter(x => x == "Transportations.Edit").map(y => isDisableEdit = false);
            ACCOUNT_CLAIM_FF.filter(x => x == "Transportations.Delete").map(y => isDisableDelete = false);
        }

        return (
            <>
                {
                    <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
                        <Container fluid className={typeof (hookSpacing) !== 'undefined' ? hookSpacing : ''}>
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
                                                        "transportName": "",
                                                        "orderBy": "",
                                                        "page": null,
                                                        "limit": null
                                                    }))}
                                                hideCreate={isDisableAdd == false ? false : true}
                                                hideTitle={typeof (hideTitle) !== 'undefined' && hideTitle}
                                                hideSearch={
                                                    typeof (hideSearch) !== 'undefined' && (
                                                        hideSearch && true
                                                    )
                                                }
                                                handleSubmitSearchForm={() => { }}
                                                moduleTitle='Thêm vận chuyển'
                                                moduleBody={this.renderCreateModal()}
                                                activeSubmit={activeCreateSubmit}
                                                newData={newData}
                                                handleCreateInfoData={this.handleCreateInfoData}
                                            />

                                            {/* Table */}
                                            <Card className="shadow">
                                                <Table className="align-items-center tablecs" responsive>
                                                    <HeadTitleTable headerTitle={headerTitle}
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
                                                                            <td style={{ textAlign: 'left' }}>{item.transportName}</td>
                                                                            <td style={{ textAlign: 'left' }}>{item.transportType}</td>
                                                                            <td style={{ textAlign: 'left' }}>{item.phoneNumber}</td>
                                                                            <td style={{ textAlign: 'left' }}>{item.email}</td>
                                                                            <td style={{ textAlign: 'left' }}>{item.address}</td>
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
                                                                                                        this.setState({ currentRow: item });
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
                                                                                                        this.toggleModal('warningPopupDelModal');
                                                                                                        this.setState({ deleteItem: item.id });
                                                                                                    }}
                                                                                                >
                                                                                                    Xóa
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
                                            {
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

                            <PopupMessage
                                popupMessage={popupMessage}
                                moduleTitle={'Thông báo'}
                                moduleBody={errNoti}
                                toggleModal={this.toggleModal}
                            />

                            <WarningPopupDel
                                moduleTitle='Thông báo'
                                moduleBody={
                                    <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                                        Bạn đồng ý xóa thông tin này?
                                    </p>}
                                warningPopupDelModal={warningPopupDelModal}
                                toggleModal={this.toggleModal}
                                handleWarning={this.handleDeleteRow}
                            />

                            {
                                <UpdatePopup
                                    moduleTitle='Sửa vận chuyển'
                                    moduleBody={
                                        <UpdateModal
                                            data={detail}
                                            id={this.state.editId}
                                            handleCheckValidation={this.handleCheckValidation}
                                            handleNewData={this.handleNewDataUpdate}
                                            errorUpdate={this.state.errorUpdate}
                                        />}
                                    newData={this.state.newDataUpdate}
                                    updateModal={updateModal}
                                    toggleModal={this.toggleModal}
                                    activeSubmit={activeCreateSubmit}
                                    handleUpdateInfoData={this.handleUpdateInfoData}
                                />
                            }

                            <CreateNewPopup
                                newData={newData}
                                createNewModal={createNewModal}
                                moduleTitle='Thêm mới'
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

                            <ToastContainer
                                position="top-center"
                                autoClose={3000}
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
        transportation: state.TransportationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionTransportation, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Transportation);
