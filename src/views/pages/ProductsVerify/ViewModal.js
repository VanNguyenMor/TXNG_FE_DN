import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { DOMAIN_IMG } from "../../../services/Common";
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
            dataProducts, dataProductsUnits, dataCurentPop
        } = this.props;

        // console.log(dataProducts);
        let pathImageDefaul = [];
        let pathImageDefaulAcc = [];
        let pathImageDefaulCer = [];

        if (dataProducts.images) {
            pathImageDefaul = dataProducts.images.split(';')
        }

        if (dataProducts.accreditation) {
            pathImageDefaulAcc = dataProducts.accreditation.split(';');
        }

        if (dataProducts.certification) {
            pathImageDefaulCer = dataProducts.accreditation.split(';');
        }

        return (
            <>
                <div className={classes.headView}>
                    <div className='config-system-tab'>
                        <div onClick={this.onChooseTab(0)} className={`config-system-tab-item ${currentTab == 0 ? 'active' : ''}`}>THÔNG TIN CƠ BẢN</div>
                        <div onClick={this.onChooseTab(1)} className={`config-system-tab-item ${currentTab == 1 ? 'active' : ''}`}>THÔNG TIN MỞ RỘNG</div>
                        <div onClick={this.onChooseTab(2)} className={`config-system-tab-item ${currentTab == 2 ? 'active' : ''}`}>HÌNH ẢNH</div>
                    </div>
                </div>
                <div className={classes.formControl}>
                    {currentTab == 0 ? (
                        <div className='row'>
                            <div className='col-7'>

                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Mã sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.productCode}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Mã vạch:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.barcode}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Tên sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.productName}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Ngành nghề:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.fieldName}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Loại sản phẩm:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.productTypeName}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Nhà sản xuất:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.companyName}
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
                                        >
                                            Xuất xứ:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataCurentPop.nationName}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Trọng lượng/Số lượng:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.weight}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Thời hạn sử dụng:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.expiredNum + ' ' + this.handleExpiredTab('expiredUnit', dataProducts.expiredUnit) + ' ' + this.handleExpiredTab('expiredType', dataProducts.expiredType)}
                                    </div>
                                </div>
                                <div className={classes.rowItem}>
                                    <div>
                                        <label
                                            className="form-control-label col width-label-view-products"
                                        >
                                            Số công bố chất lượng:
                                        </label>
                                    </div>
                                    <div style={{ width: '100%', height: '43px', display: 'flex', alignItems: 'center' }}>
                                        {dataProducts.qualityNum}
                                    </div>

                                </div>


                            </div>
                            <div className='col-5' style={{ alignSelf: 'center' }}>
                                <img src={dataProducts.avatar ? dataProducts.avatar : NoImg} style={{ width: '100%', minWidth: '281.25px' }} />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: 'fit-content' }}>
                                        <ReactStars
                                            size={35}
                                            value={dataCurentPop.ratingFil ? dataCurentPop.ratingFil : 0}
                                            edit={false}
                                            isHalf={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {currentTab == 1 ? (
                        <>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Giới thiệu
                                </label>
                            </div>
                            <div className={classes.rowItem}>
                                <div dangerouslySetInnerHTML={{ __html: dataProducts.introduce }} />
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Quy trình sản xuất
                                </label>
                            </div>
                            <div className={classes.rowItem}>
                                <div dangerouslySetInnerHTML={{ __html: dataProducts.productionProcess }} />
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Hướng dẫn bảo quản
                                </label>
                            </div>
                            <div className={classes.rowItem}>
                                <div dangerouslySetInnerHTML={{ __html: dataProducts.storage }} />
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Hướng dẫn sử dụng
                                </label>
                            </div>
                            <div className={classes.rowItem}>
                                <div dangerouslySetInnerHTML={{ __html: dataProducts.usage }} />
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Quy cách đóng gói
                                </label>
                            </div>
                            <div className={classes.rowItem}>
                                <div dangerouslySetInnerHTML={{ __html: dataProducts.packing }} />
                            </div>
                        </>
                    ) : null}
                    {currentTab == 2 ? (
                        <>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Hình ảnh sản phẩm
                                </label>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaul ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaul.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : <img src={NoImg}
                                    style={{ width: 500, height: 300 }} />
                                }
                            </div>

                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Thông tin kiểm định
                                </label>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaulAcc ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaulAcc.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : <img src={NoImg}
                                    style={{ width: 500, height: 300 }} />
                                }
                            </div>
                            <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                                <label
                                    className="form-control-label"
                                >
                                    Thông tin chứng nhận
                                </label>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {pathImageDefaulCer ? (
                                    <div className={classes.inputArea} >
                                        <Zoom scale={0.4} style={{ width: 500, height: 300 }}>
                                            {
                                                pathImageDefaulCer.map((each, index) => <img key={index} style={{ width: 500, height: 300 }} src={each} />)
                                            }
                                        </Zoom>
                                    </div>
                                ) : <img src={NoImg}
                                    style={{ width: 500, height: 300 }} />
                                }
                            </div>

                        </>
                    ) : null}
                </div>
            </>
        );
    }
};

export default ViewModal;
