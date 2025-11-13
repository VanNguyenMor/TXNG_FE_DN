import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { CONFIRM_STATUS_PRODUCTS, DOMAIN_IMG, EMPTY_DATA } from "../../../services/Common";
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import QRCode from 'qrcode.react';
import ReactStars from "react-rating-stars-component";


// reactstrap components
import {
    Input,
    InputGroup,

} from "reactstrap";

class ViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            pathImageDefaul: null,
            dataRating: 0
        }
    }

    componentWillMount() {
    }

    handleChange = (event) => {

    }

    handleSelect = (value, name) => {

    }
    handleSelectPrice = (value, name) => {

    }

    handleCheckValidation = (newData = null) => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;
        let current = null;
        if (data === null) {
            this.setState({ activeSubmit: false });
            //handleCheckValidation(false);
        }
        else {

            if (newData !== null) {
                this.setState({ activeSubmit: true });

                // Check Validation 
                handleCheckValidation(true);

                // Handle New Data
                this.setState({ selectRow: current.amount })

                handleNewData(current);
            } else {

                handleCheckValidation(false);
            }
        }
    }

    onChooseTab = tab => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                currentTab: tab
            }
        });
    }

    handleExpiredTab = (name, value) => {

        if (name == 'expiredType') {
            if (value == 0) {
                return 'từ ngày mở bao bì'
            } else if (value == 1) {
                return 'từ ngày sản xuất'
            }
        }
        if (name == 'expiredUnit') {
            if (value == 0) {
                return 'tháng'
            } else if (value == 1) {
                return 'năm'
            } else if (value == 2) {
                return 'ngày'
            }
        }
    }

    render() {
        const {
            currentTab,
        } = this.state;
        const {
            dataProducts, dataProductsUnits, dataCurentPop, productFields
        } = this.props;

        let pathImageDefaul = [];
        let pathImageDefaulAcc = [];
        let pathImageDefaulCer = [];
        let fieldName = '';

        if (dataProducts.images) {
            pathImageDefaul = dataProducts.images.split(';')
        }

        if (dataProducts.accreditation) {
            pathImageDefaulAcc = dataProducts.accreditation.split(';');
        }

        if (dataProducts.certification) {
            pathImageDefaulCer = dataProducts.certification.split(';');
        }

        fieldName = productFields.map(p => p.fieldName).join(',');

        return (
            <>
                <div className={`${classes.headView} css-position-tab`}>
                    <div className='config-system-tab justify-tabs' style={{ padding: 0 }}>
                        <div onClick={this.onChooseTab(0)} className={`config-system-tab-item tabs-item-products ${currentTab == 0 ? 'active' : ''}`}>THÔNG TIN CƠ BẢN</div>
                        <div onClick={this.onChooseTab(1)} className={`config-system-tab-item tabs-item-products ${currentTab == 1 ? 'active' : ''}`}>THÔNG TIN MỞ RỘNG</div>
                        <div onClick={this.onChooseTab(2)} className={`config-system-tab-item tabs-item-products ${currentTab == 2 ? 'active' : ''}`}>HÌNH ẢNH</div>
                    </div>
                </div>
                {/* <hr className="css-hr" /> */}
                <div className={`${classes.formControl} modal-body-no-padding`} >
                    {currentTab == 0 ? (
                        <div className='row style-margin-css    ' >
                            <div className='col-7' >

                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products "
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Mã sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.productCode || <i>${EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Mã vạch:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.barcode || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Tên sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.productName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Ngành nghề:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {fieldName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Loại sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.productTypeName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Nhà sản xuất:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.companyName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                {/* <div className={classes.rowItem}>
                                <div>
                                    <label
                                        className="form-control-label col width-label-view-products"
                                    >
                                        Nhà cung cấp:
                                    </label>
                                </div>
                                <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                    {dataProducts.productCode}
                                </div>
                            </div> */}
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Xuất xứ:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.nationName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Đơn vị tính nhập/xuất:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {/* {!dataProducts.weight && !dataProducts.unitName ? <i>{EMPTY_DATA}</i> : <>{dataProducts.weight || <i>{EMPTY_DATA}</i>} ({dataProducts.unitName || <i>{EMPTY_DATA}</i>})</>} */}
                                        {dataProducts.unitName || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Thời hạn sử dụng:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {(dataProducts.expiredNum != null && dataProducts.expiredUnit != null && dataProducts.expiredType != null) ?
                                            (dataProducts.expiredNum + ' ' + this.handleExpiredTab('expiredUnit', dataProducts.expiredUnit)
                                                + ' ' + this.handleExpiredTab('expiredType', dataProducts.expiredType)) : <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                            style={{ fontSize: 16, width: 215 }}
                                        >
                                            Số công bố chất lượng:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.qualityNum || <i>{EMPTY_DATA}</i>}
                                    </div>
                                </div>
                                {dataProducts.confirmedStatus == CONFIRM_STATUS_PRODUCTS.khongDuyet && <>
                                    <div className={classes.rowItem}>
                                        <div>
                                            <label
                                                className="form-control-label col width-label-view-products"
                                                style={{ fontSize: 16 }}
                                            >
                                                Lý do không duyệt
                                            </label>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                            {dataProducts.confirmedReason || <i>{EMPTY_DATA}</i>}
                                        </div>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div>
                                            <label
                                                className="form-control-label col width-label-view-products"
                                                style={{ fontSize: 16 }}
                                            >
                                                Người xử lý
                                            </label>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                            {dataProducts.confirmedByName || <i>{EMPTY_DATA}</i>}
                                        </div>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div>
                                            <label
                                                className="form-control-label col width-label-view-products"
                                                style={{ fontSize: 16 }}
                                            >
                                                Ngày xử lý
                                            </label>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                            {dataProducts.confirmedDate ? moment(dataProducts.confirmedDate).format('HH:mm DD/MM/YYYY') : <i>{EMPTY_DATA}</i>}
                                        </div>
                                    </div>
                                </>}
                            </div>
                            <div className='col-5' style={{ alignSelf: 'center' }}>
                                <img src={dataProducts.avatar ? dataProducts.avatar : NoImg} style={{ width: '100%', minWidth: '281.25px' }} />
                                {
                                    dataCurentPop.ratingFil ? (<>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ width: 'fit-content' }}>
                                                <ReactStars
                                                    size={35}
                                                    value={dataCurentPop.ratingFil ? dataCurentPop.ratingFil : 0}
                                                    edit={false}
                                                    isHalf={true} />
                                            </div>
                                        </div>
                                    </>) : null
                                }

                            </div>
                        </div>
                    ) : null}
                    {currentTab == 1 ? (
                        <div className="style-margin-css" style={{ margin: '1.5rem', textAlign: 'left', width: '100%' }}>
                            {
                                dataProducts.introduce ? (<>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <label
                                            className="form-control-label"
                                            style={{ fontSize: 16 }}
                                        >
                                            Giới thiệu
                                        </label>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div dangerouslySetInnerHTML={{ __html: dataProducts.introduce || `<i>${EMPTY_DATA}</i>` }} />
                                    </div>
                                </>) : null
                            }

                            {
                                dataProducts.productionProcess ? (<>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <label
                                            className="form-control-label"
                                            style={{ fontSize: 16, width: 210 }}
                                        >
                                            Quy trình sản xuất
                                        </label>
                                    </div>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <div dangerouslySetInnerHTML={{ __html: dataProducts.productionProcess || `<i>${EMPTY_DATA}</i>` }} />
                                    </div>
                                </>) : null
                            }

                            {
                                dataProducts.storage ? (<>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <label
                                            className="form-control-label"
                                            style={{ fontSize: 16, width: 210 }}
                                        >
                                            Hướng dẫn bảo quản
                                        </label>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div dangerouslySetInnerHTML={{ __html: dataProducts.storage || `<i>${EMPTY_DATA}</i>` }} />
                                    </div>
                                </>) : null
                            }

                            {
                                dataProducts.usage ? (<>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <label
                                            className="form-control-label"
                                            style={{ fontSize: 16, width: 210 }}
                                        >
                                            Hướng dẫn sử dụng
                                        </label>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div dangerouslySetInnerHTML={{ __html: dataProducts.usage || `<i>${EMPTY_DATA}</i>` }} />
                                    </div>
                                </>) : null
                            }
                            {
                                dataProducts.packing ? (<>
                                    <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                        <label
                                            className="form-control-label"
                                            style={{ fontSize: 16, width: 210 }}
                                        >
                                            Quy cách đóng gói
                                        </label>
                                    </div>
                                    <div className={classes.rowItem}>
                                        <div dangerouslySetInnerHTML={{ __html: dataProducts.packing || `<i>${EMPTY_DATA}</i>` }} />
                                    </div>
                                </>) : null
                            }

                        </div>
                    ) : null}
                    {currentTab == 2 ? (
                        <div className="style-margin-css" style={{ margin: '1.5rem', width: '100%' }}>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                    style={{ fontSize: 16, width: 210 }}
                                >
                                    Hình ảnh sản phẩm
                                </label>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaul.length > 1 ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaul.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : null
                                }
                                {pathImageDefaul.length === 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 500, height: 300 }} src={pathImageDefaul} />
                                    </div>
                                ) : null
                                }
                                {pathImageDefaul.length < 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 400, height: 300 }} src={NoImg} />
                                    </div>
                                ) : null
                                }

                            </div>

                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                    style={{ fontSize: 16, width: 210 }}
                                >
                                    Thông tin kiểm định
                                </label>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaulAcc.length > 1 ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaulAcc.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : null
                                }
                                {pathImageDefaulAcc.length === 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 500, height: 300 }} src={pathImageDefaulAcc} />
                                    </div>
                                ) : null
                                }
                                {pathImageDefaulAcc.length < 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 400, height: 300 }} src={NoImg} />
                                    </div>
                                ) : null
                                }
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                    style={{ fontSize: 16, width: 210 }}
                                >
                                    Thông tin chứng nhận
                                </label>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaulCer.length > 1 ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaulCer.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : null
                                }
                                {pathImageDefaulCer.length === 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 500, height: 300 }} src={pathImageDefaulCer} />
                                    </div>
                                ) : null
                                }
                                {pathImageDefaulCer.length < 1 ? (
                                    <div className={classes.inputArea} >
                                        <img style={{ width: 400, height: 300 }} src={NoImg} />
                                    </div>
                                ) : null
                                }
                            </div>

                        </div>
                    ) : null}
                </div>
            </>
        );
    }
};

export default ViewModal;
