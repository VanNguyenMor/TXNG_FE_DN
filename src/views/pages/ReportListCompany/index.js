import React, { Component, useState } from "react";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionGrowthStampReports } from "../../../actions/GrowthStampReportsActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { setAlertContext, openAlertContext, getCurrentDatetimeStringForFile, fakeDownloadLinkFile } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import moment from 'moment';
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import classes from './index.module.css';
import { FILE_NAMES, LIMITS, LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import { Bar } from 'react-chartjs-2';
import Select from "components/Select";
import ReactDatetime from 'react-datetime'
import { REPORT_LIST_COMPANY } from "../../../helpers/constant";
import PopupMessage from "../../../components/PopupMessage";

import {
    Card,
    Table,
    Container,
    Row,
    Spinner,
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormGroup,
} from "reactstrap";
import { reportV2Action } from "../../../actions/ReportV2Actions";

class ReportListCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            district: null,
            ward: null,
            headerTitle: REPORT_LIST_COMPANY,
            fromDate: '',
            toDate: '',
            districtId: '',
            wardId: '',
            taxCode: '',
            companyName: '',
            page: 0,
            limit: LIMITS.reportV2ListCompany,
            data: [],
            isShowPopupMessage: '',
            message: ''
        }
        this.redSelectWard = null;
        this.redSelectDis = null;
    }

    componentWillReceiveProps(nextProp) {

    }
    componentWillMount() {
        const { getDistrictList } = this.props;
        getDistrictList().then(res => {

            if (((res || {}).data || {}).status == 200) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        district: (((res || {}).data || {}).data || []),
                    }
                })
            }
        })
    }

    componentDidUpdate() {
        this.closeStatusModal();
    }

    closeStatusModal = () => {
        const { status } = this.state;

        if (status || !status) {
            setTimeout(() => {
                this.setState({ status: null, isLoaded: false });
            }, LOADING_TIME);
        }
    }

    handleSelectDis = (value) => {
        if (this.redSelectWard) {
            this.redSelectWard.resetValue();
        }
        const { getWardList } = this.props;
        let { yearM, yearQ, isChecked, dataYear } = this.state;
        if (value == null) { value = '' }
        if (value) {
            getWardList(value).then(res => {

                if (((res || {}).data || {}).status == 200) {
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            ward: (((res || {}).data || {}).data || []),
                        }
                    })
                }
            })
        }
        this.setState({ districtId: value })
        // if (isChecked == 1) {
        //   this.fetchSummary(yearM + '&districtId=' + value);
        // } else if (isChecked == 2) {
        //   this.fetchSummaryQuarter(yearQ + '&districtId=' + value)
        // } else if (isChecked == 3) {
        //   this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY + '&districtId=' + value)
        // }
    }

    handleSelectWar = value => {
        const { getWardList } = this.props;
        let { yearM, yearQ, isChecked, dataYear } = this.state;
        if (value == null) { value = '' }

        this.setState({ wardId: value })
        // if (isChecked == 1) {
        //   this.fetchSummary(yearM + '&districtId=' + value);
        // } else if (isChecked == 2) {
        //   this.fetchSummaryQuarter(yearQ + '&districtId=' + value)
        // } else if (isChecked == 3) {
        //   this.fetchSummaryYear(dataYear.yearfromY, dataYear.yeartoY + '&districtId=' + value)
        // }
    }

    handleChangeDate = (name, value) => {
        if (value) {
            this.setState(previousState => {
                return {
                    ...previousState,
                    [name]: value
                }
            })
        }
    }

    onFilter = () => {
        const { fromDate, toDate, taxCode, companyName, districtId, wardId, page, limit } = this.state;
        const { getReportListCompany } = this.props;

        const body = {
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : '',
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : '',
            taxCode,
            companyName,
            districtId,
            wardId,
            page,
            limit
        }

        getReportListCompany(body).then(res => {
            const data = (res.data || {}).data || [];

            this.setState(previousState => {
                return {
                    ...previousState,
                    data
                }
            });
        });
    }

    onChangeValue = event => {
        const name = event.target.name;
        const value = event.target.value;

        console.log(name);
        console.log(value);

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        });
    }

    onExcel = () => {
        const { fromDate, toDate, taxCode, companyName, districtId, wardId, page, limit } = this.state;
        const { printExcelReportListCompany } = this.props;

        const body = {
            fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : '',
            toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : '',
            taxCode,
            companyName,
            districtId,
            wardId,
            page,
            limit
        }

        printExcelReportListCompany(body).then(res => {
            const ok = res.ok;

            if (ok) {
                const data = res.data;

                if (data) {
                    fakeDownloadLinkFile(data, FILE_NAMES.reportV2ListCompany());

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            isShowPopupMessage: true,
                            message: 'Xuất tệp tin Excel thành công'
                        }
                    });
                }
            }
        });
    }

    togglePopupMessage = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isShowPopupMessage: !previousState.isShowPopupMessage
            }
        });
    }

    render() {
        const { } = this.props;
        const {
            district,
            ward,
            fromDate,
            toDate,
            beginItem,
            endItem,
            listLength,
            totalPage,
            totalElement,
            data,
            headerTitle,
            taxCode,
            companyName,
            isShowPopupMessage,
            message
        } = this.state;

        // const statusPopup = { status: status, message: message };

        console.log('dada', data);

        return (
            <>
                {
                    <div className={classes.wrapper}>
                        <Container fluid>
                            <Row responsive={1}>
                                <div className="col-11" >
                                    <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label className="form-control-label" >Từ ngày</label>
                                            <div >
                                                <FormGroup >
                                                    <InputGroup className="input-group-alternative css-border-input">
                                                        <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            inputProps={{
                                                                placeholder: "Từ ngày"
                                                            }}
                                                            name='fromDate'
                                                            value={fromDate}
                                                            timeFormat={false}
                                                            onChange={(e) => this.handleChangeDate('fromDate', e)}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-control-label">Đến ngày</label>
                                            <div>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative css-border-input">
                                                        <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <ReactDatetime
                                                            inputProps={{
                                                                placeholder: "Đến ngày"
                                                            }}
                                                            name='toDate'
                                                            value={toDate}
                                                            timeFormat={false}
                                                            onChange={(e) => this.handleChangeDate('toDate', e)}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        {/* <div>Chọn quận huyện</div> */}
                                        <div>
                                            <label className="form-control-label">Quận/Huyện</label>
                                            <Select
                                                //name="status"
                                                title='Chọn quận huyện'
                                                ref={ref => this.redSelectDis = ref}
                                                data={district}
                                                labelName='districtName'
                                                val='id'
                                                handleChange={this.handleSelectDis}
                                            />
                                        </div>
                                        {/* <div>Chọn phường xã</div> */}
                                        <div>
                                            <label className="form-control-label">Phường/Xã</label>
                                            <Select
                                                //name="status"
                                                title='Chọn phường xã'
                                                isDisable={this.state.districtId ? false : true}
                                                ref={ref => this.redSelect = ref}
                                                data={ward}
                                                labelName='wardName'
                                                val='id'
                                                handleChange={this.handleSelectWar}
                                            />
                                        </div>

                                    </div>
                                    <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label className="form-control-label">MST/CCCD</label>
                                            <Input
                                                className="css-search-input"
                                                placeholder="MST/CCCD"
                                                name="taxCode"
                                                value={taxCode}
                                                onChange={this.onChangeValue}
                                                type="text"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-control-label">Tên</label>
                                            <Input
                                                className="css-search-input"
                                                placeholder="Tên"
                                                name="companyName"
                                                value={companyName}
                                                onChange={this.onChangeValue}
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1"
                                    style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                                    <Button onClick={this.onFilter} style={{ margin: '1px 0px', color: '#fff', backgroundColor: 'rgba(2, 131, 15, 1)' }}>XEM</Button>
                                    <Button style={{ margin: '1px 0px', color: '#fff', backgroundColor: '#ed4f2c' }}>IN</Button>
                                    <Button onClick={this.onExcel} style={{ margin: '1px 0px', color: '#fff', backgroundColor: '#11C7EF' }}>EXCEL</Button>
                                </div>
                            </Row>
                            <hr style={{ borderColor: '#000' }} />
                            <h3 className={`${classes.text} ${classes.textLable}`}> BÁO CÁO DANH SÁCH DOANH NGHIỆP</h3>
                            <div className="row" style={{ justifyContent: 'center' }}>
                                {(fromDate && toDate) ? <>
                                    <p className={`${classes.text} ${classes.textDate}`}>Từ ngày {fromDate ? moment(fromDate).format("DD/MM/YYYY") : ''}</p>&nbsp; <p className={`${classes.text} ${classes.textDate}`}>Đến ngày {toDate ? moment(toDate).format("DD/MM/YYYY") : ''}</p>&nbsp;
                                </> : null}
                            </div>

                            <Card className="shadow">

                                <Table className="align-items-center tablecs table-css-CompanyAwait" responsive style={{ height: 300 }}>
                                    <HeadTitleTable headerTitle={headerTitle}
                                        classHeaderColumns={{
                                            0: 'table-scale-col table-user-col-1'
                                        }}
                                        hideEdit={true}
                                    />

                                    <tbody ref={ref => this.tableBody = ref}>
                                        {
                                            Array.isArray(data) && (
                                                data
                                                    // .filter((item, key) => key >= beginItem && key < endItem)
                                                    .map((item, key) => (
                                                        <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
                                                            <td className='table-scale-col table-user-col-1'>{item.index}</td>
                                                            <td className='table-scale-col' style={{ textAlign: 'left' }}>{item.taxCode}</td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.companyName}</td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                                                {item.address}
                                                            </td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.districtName}</td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.wardName}</td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.registeredDate ? moment(item.registeredDate).format('DD/MM/YYYY HH:mm') : ''}</td>
                                                            <td style={{ textAlign: 'left' }} className='table-scale-col'>{item.quantity || '0'}</td>
                                                        </tr>
                                                    ))
                                            )
                                        }
                                    </tbody>
                                </Table>

                            </Card>
                            {isShowPopupMessage ? (
                                <PopupMessage
                                    popupMessage={isShowPopupMessage}
                                    moduleTitle={'Thông báo'}
                                    moduleBody={message}
                                    toggleModal={this.togglePopupMessage}
                                />
                            ) : null}
                        </Container>
                    </div>
                }
            </>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        location: state.LocationStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionLocationCreators, dispatch),
        ...bindActionCreators(reportV2Action, dispatch)
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ReportListCompany);