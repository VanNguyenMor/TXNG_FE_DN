import React, { Component } from "react";
import classes from './index.module.css';
import PrintIcon from "../../assets/img/buttons/printig.svg";
import CloseIcon from "../../assets/img/buttons/DONG.png";
import imgIcon from "../../assets/img/brand/apple-icon.png";
import { Printd } from 'printd';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import compose from 'recompose/compose';
import QRCode from 'qrcode.react';
import { LIMIT_ITEM_IN_PAGE } from '../../helpers/constant'
import TemplateStamp from "../../assets/img/TemplateStamp/TemplateStamp.jpg";
import { actionStampPlate } from "../../actions/StampTemplateActions";
import Select from "../Select";
import {
    Button
} from "reactstrap";

// reactstrap components
import {
    Modal,
} from "reactstrap";


class ViewOneStamp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sl: "",
            currenStamp: {},
            // totalElement: 0,
            // limit: LIMIT_ITEM_IN_PAGE,
        }
        this.refFile = null;


    }

    componentDidMount() {
        const { requestListStampPlate } = this.props;
        requestListStampPlate(JSON.stringify({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
        })).then(res => {
            if (res.data.status == 200) {
                res.data.data.stamps.map((item, key) => {
                    item['collapse'] = false;
                })
                this.setState({
                    dataStampAll: res.data.data.stamps,
                    dataStamp: res.data.data.stamps,
                    listLength: res.data.data.stamps.length,
                    totalPage: Math.ceil(res.data.data.stamps.length / this.state.limit),
                    // totalElement: res.data.data.stamps.length > this.state.limit ? this.state.limit : res.data.data.stamps.length
                })
            }
        })
    }

    handleChange = (event) => {
        let { sl } = this.state;
        const ev = event.target.value;
        sl = ev;
        this.setState({ sl });
    }

    handleSelect = (value) => {
        const { dataStampAll } = this.state;
        let currenStamp = {};
        if (value != null) {
            currenStamp = dataStampAll.filter(x => x.id == value)
            if (currenStamp) {

                this.setState({ currenStampImg: currenStamp[0].template })
            }
        }
    }

    renderListQRCode = () => {
        const { dataAll } = this.props;

        const data = dataAll || [];

        const page = Math.ceil((data || []).length / 9);

        const elements = [];

        let qrCodes = [];

        for (let i = 0; i < page; i++) {
            qrCodes = [];

            for (let j = 0; j < [...data].slice(i * 9, (i * 9) + 9).length; j++) {
                qrCodes.push(<div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 'calc(100% / 3)',
                    minHeight: 'calc(100% / 3)',
                    maxWidth: 'calc(100% / 3)',
                    maxHeight: 'calc(100% / 3)'
                }}>
                    <div style={{
                        padding: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <QRCode
                            key={`${data[j].stampID}-${j}`}
                            id='qrcode'
                            value={data[j].qrCode}
                            renderAs='svg'
                            level={'H'}
                            includeMargin={true}
                            style={{
                                minWidth: 100,
                                minHeight: 100
                            }}
                        />
                        <p style={{ fontSize: 12, margin: 0, padding: 0 }}>{data[j].stampID}</p>
                    </div>
                </div>);
            }

            elements.push(<div key={`page-qrcode-${i}`} style={{
                minWidth: '100%',
                minHeight: i == 0 ? 'calc(100vh - 200px)' : '100vh',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row'
            }}>
                {qrCodes}
            </div>);
        }

        return elements;
    }
    componentWillMount() {
        const { checkAll, handlePrint } = this.props;
        let { typePrint } = this.state;
        typePrint = checkAll;
        this.setState({ typePrint: checkAll }, () => {
            if (handlePrint) {
                handlePrint(typePrint)
            }
        })
    }

    render() {
        const { data, detailPrint, printInfo, dataAll, checkAll, handlePrint } = this.props;
        const { dataStamp, currenStampImg } = this.state;

        return (
            <>
                <div>
                    {/* <div className="row" style={{ marginLeft: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ fontWeight: 'bold', marginBottom: 0 }}>Nhập số lượng: </label>
                        </div>
                        <input type="number" name="sl" onKeyUp={(event) => this.handleChange(event)} />
                        <div style={{ width: 200, marginLeft: 30 }}>
                            <Select
                                title='Chọn mẫu tem'
                                data={dataStamp}
                                labelName='name'
                                val='id'
                                handleChange={(event) => this.handleSelect(event)}
                            />
                        </div>
                    </div> */}

                    <div id="printarea">
                        <div style={{ marginLeft: 30, }} className="row">
                            <label style={{ marginRight: 10 }}>Mẫu tem: </label>
                            {detailPrint ? (
                                <img
                                    ref={ref => this.refFile = ref}
                                    src={detailPrint.StampTemplateLink}
                                    style={{ width: 190, height: 140 }} />
                            ) : null}
                        </div>
                        <div style={{ border: '1px solid black', height: 1, width: 'auto', padding: 0, backgroundColor: 'black' }}></div>
                        {checkAll == true && dataAll ? (
                            <div>
                                <div style={{ marginLeft: 45 }} >
                                    <label>Mã tem: </label>
                                </div>
                                {/* <div style={{ marginLeft: 30, justifyContent: 'center' }} className='row'>
                                    {
                                        Array.isArray(dataAll)
                                        && (
                                            dataAll.map(
                                                (item, key) => (
                                                    <div style={{ marginLeft: 10, marginRight: 10 }}>
                                                        < QRCode
                                                            id='qrcode'
                                                            value={item.qrCode}
                                                            size={150}
                                                            renderAs='svg'
                                                            level={'H'}
                                                            includeMargin={true}
                                                        />
                                                        <p style={{ fontSize: 13 }}>{item.stampID}</p>
                                                    </div>
                                                )))
                                    }
                                </div> */}
                                {this.renderListQRCode()}
                            </div>
                        ) : (
                            <div className="row" >
                                <div style={{ marginLeft: 45 }} >
                                    <label>Mã tem: </label>
                                </div>
                                <div style={{ marginLeft: 30 }} >
                                    < QRCode
                                        id='qrcode'
                                        value={data.qrCode}
                                        size={190}
                                        renderAs='svg'
                                        level={'H'}
                                        includeMargin={true}
                                    />
                                    <p style={{ fontSize: 13 }}>{data.stampID}</p>
                                </div>
                            </div>
                        )}
                        <div style={{ border: '1px solid black', height: 1, width: 'auto', padding: 0, backgroundColor: 'black' }}></div>
                        <div style={{ marginLeft: 30 }} className="row">
                            <label>Số lượng tem mỗi mã QR:&nbsp;</label>
                            <div>{detailPrint.Quantity}</div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
};

const mapStateToProps = state => {
    return {
        stampTemplate: state.StampPlateStore
    }
}

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(actionStampPlate, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ViewOneStamp);
