import React, { Component } from 'react';
import compose from 'recompose/compose';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { actionProducts } from "../../../../../actions/ProductsActions";
import { actionCompanyListRegistered } from "../../../../../actions/CompanyListRegisteredActions";
import { actionField } from "../../../../../actions/FieldActions.js";
import { Container, Row, Spinner, Col } from 'reactstrap';
import { handleGenTree } from "../../../../../helpers/trees";
import { PLEASE_CHECK_CONNECT, } from "../../../../../services/Common";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../../../helpers/constant";
import NoImg from "../../../../../assets/img/NoImg/NoImg.jpg";
import { NavLink } from 'react-router-dom';
import '../DashboardList.css'

class ListBoxProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            limit: 10,
            isLoaded: null,
            fetching: false,
        }
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
                                if (item.confirmedStatus == 0) {
                                    item['statusName'] = 'Mới tạo'
                                }
                                else if (item.confirmedStatus == 1) {
                                    item['statusName'] = 'Đã duyệt'
                                } else if (item.confirmedStatus == 2) {
                                    item['statusName'] = 'Không duyệt'
                                } else if (item.confirmedStatus == 3) {
                                    item['statusName'] = 'Yêu cầu duyệt'
                                };
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
                            field: fieldData.field.fields,
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
    componentDidMount() {
        /* Fetch Summary */
        const { requestCompanyAll, requestFieldStore, requestListProducts, } = this.props;

        // const dataCompany = {
        //     "fieldID": "",
        //     "comapanyName": "",
        //     "taxCode": "",
        //     "phone": "",
        //     "email": "",
        //     "provinceID": "",
        //     "districtID": "",
        //     "wardID": "",
        //     "orderBy": "",
        //     "page": null,
        //     "limit": null
        // }
        // requestCompanyAll(dataCompany).then(res => {
        //     if (res.status == true) {
        //         const data = (res.data || {}).data || [];
        //         let oppss = [{
        //             address: "",
        //             companyName: "--- Chọn Doanh nghiệp/Người sản xuất ---",
        //             fieldName: "",
        //             id: "",
        //             //isCertified: false,
        //             phoneNumber: "",
        //             registeredDate: "",
        //             taxCode: "",
        //         }]
        //         let ccopps = oppss.concat(data.companies)
        //         if (data) {
        //             this.setState(previousState => {
        //                 return {
        //                     ...previousState,
        //                     dataCompany: data.companies,
        //                     //valueDr: data.companies,
        //                     options: ccopps,
        //                 }
        //             });
        //         }
        //     }
        // })

        requestFieldStore(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
        })).then(res => {
            this.fetchSummary(JSON.stringify({
                "fieldID": "",
                "productCode": "",
                "productName": "",
                "companyID": "",
                "confirmedStatus": null,
                "orderBy": "",
                "page": null,
                "limit": null
            }));
        });

        this.fetchSummary(JSON.stringify({
            "fieldID": "",
            "productCode": "",
            "productName": "",
            "companyID": "",
            "confirmedStatus": null,
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
        const { requestListProducts } = this.props;

        requestListProducts(data);
    }

    handleClose = (value) => {
        const { open } = this.state;

        this.setState({ open: value });
    }
    closeStatusModal = () => {
        const { status, fetching } = this.state;

        if (status || !status && fetching) {
            setTimeout(() => {
                this.setState({ status: null, isLoaded: false });
            }, LOADING_TIME);
        }
    }

    render() {
        const { isLoaded, data, } = this.state;
        return (
            <>
                {isLoaded ? (<>
                    <div style={{ display: 'table', margin: 'auto' }}>
                        <Spinner style={{ width: '2rem', height: '2rem' }} />
                    </div>
                </>) : (<>
                    <div className='body-box-list'>
                        <table className='table-box-list-product'>
                            <thead>
                                <tr className='table-tr-box-list-product'>
                                    <th>Hình ảnh</th>
                                    <th>Sản phẩm</th>
                                    {/* <th>Dải tem</th> */}
                                    <th>Doanh nghiệp</th>
                                </tr>
                                {/* <hr className='hr-table' /> */}
                            </thead>
                            <tbody>
                                {/* {
                                    Array.isArray(data) && (
                                        data.map((item, key) => ( */}
                                <tr className="table-hover-css">
                                    <td text-algin-img>
                                        <img style={{ width: 60, hieght: 60 }} src={NoImg} />

                                    </td>
                                    <td className='text-td text-algin-text'>
                                        <strong>Bầu hữu cơ</strong><br />
                                        <i>Mã sản phầm:&nbsp;</i><br />
                                        <i>Xuất xứ:&nbsp;</i>
                                        {/* Số lượng mã QR:&nbsp;{item.requested}<br />
                                        Số lượng mỗi mã QR:&nbsp;{item.quantity}<br />
                                        Ngày yêu cầu:&nbsp;{item.requestedDate} */}
                                    </td>
                                    {/* <td className='text-td'>{item.requested}</td> */}
                                    <td className='text-td text-algin-text'>
                                        <span style={{ fontSize: 15, fontWeight: 'bold' }}>Nông trại tâm an</span><br />
                                        <i>Địa chỉ:&nbsp;</i>
                                        {/* <span className={`${this.andleStyleStatus(item.status)} text-center-status`}>
                                            {item.statusName}
                                        </span> */}
                                    </td>
                                </tr>
                                {/* ))
                                    )
                                } */}

                            </tbody>
                        </table>
                    </div>
                </>)
                }
                <div className='footer-box-list'>
                    <NavLink to='/trang_chu/san_pham'>Xem thêm</NavLink>
                </div>
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
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ListBoxProduct)