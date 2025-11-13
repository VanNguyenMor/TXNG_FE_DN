import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { DOMAIN_IMG } from "../../../services/Common";
import 'react-slideshow-image/dist/styles.css'
import { EXTENSION_FILE_IMAGE } from "../../../bases/helper";
import { Zoom } from 'react-slideshow-image';
import HeadTitleTable from "components/HeadTitleTable";
import { FILE_UPLOAD } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"

// reactstrap components
import {
    Input,
    InputGroup,
    Table
} from "reactstrap";

class ViewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            newData: {
                "id": '',
                "year": '',
            },
            activeSubmit: false,
            selectRow: 0,
            year: null,
            price: null,
            cutLocation: null,
            pathImageDefaul: null,
            fileUpdate: [],
            headerTitle: FILE_UPLOAD,
        }
    }

    componentDidMount() {
        const { data, price, fileUpdate } = this.props;
        if (data.images) {
            const pIm = data.images;
            const spl = pIm.split(';')
            this.setState(previousState => {
                return {
                    ...previousState,
                    pathImageDefaul: spl
                }
            })
        }
        if (fileUpdate) {
            this.setState({ fileUpdate })
        }
        this.setState({ data, price, cutLocation: data.location, });
        this.handleCheckValidation();
    }

    handleChange = (event) => {
        let { data, } = this.state;
        const ev = event.target;

        if (ev['name'].indexOf('passwordConfirm') > -1) {
            this.setState({ [ev['name']]: ev['value'] });
        }
        else data[ev['name']] = ev['value'];

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleSelect = (value, name) => {
        let { data, price } = this.state;

        if (value === null) value = "";

        data[name] = value;

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }
    handleSelectPrice = (value, name) => {
        const { price, data } = this.state;
        let current = null;

        if (value === null) value = "";


        this.handleCheckValidation(value);
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

    handleClear = () => {
        this.setState({
            data: null,
            activeSubmit: false,

        })
    }

    render() {
        const { data, selectRow, cutLocation, pathImageDefaul, fileUpdate, headerTitle } = this.state;

        // let listAttachments = [];
        // let listViewAttachmentsImg = [];
        // let listViewAttachmentsFile = [];

        // if (fileUpdate) {
        //     fileUpdate.map(item => (
        //         listAttachments = listAttachments.concat(item.attachments.split(';'))
        //     ))
        // }
        // console.log(listAttachments)

        // if (listAttachments) {
        //     listAttachments.map(item => (

        //     ))
        // }

        // if (listAttachments) {
        //     EXTENSION_FILE_IMAGE.filter(x => {
        //         listAttachments.filter(y =>
        //             y.split('.').pop().trim() == x
        //         ).map(it => {
        //             if (it) {
        //                 listAttachments.push(it + '.img');
        //             }
        //             var index = listAttachments.indexOf(it);
        //             if (index > -1) {
        //                 listAttachments.splice(index, 1);
        //             }
        //         })
        //     })
        // }


        // fileUpdate.map(item => (
        //     item.lAtt = listAttachments
        // ))

        // fileUpdate.map(item => {
        //     if (item.lAtt) {
        //         item.lAtt.filter(x =>
        //             x.split('.').pop().trim() == "img"
        //         ).map(thImg => {
        //             listViewAttachmentsImg.push(thImg.replace('.img', ''))
        //         })
        //     }
        // })

        // fileUpdate.map(item => {
        //     if (item.lAtt) {
        //         item.lAtt.filter(x =>
        //             x.split('.').pop().trim() != "img"
        //         ).map(thImg => {
        //             listViewAttachmentsFile.push(thImg.replace('.img', ''))
        //         })
        //     }
        // })

        // if (fileUpdate) {
        //     console.log(fileUpdate[0].lAtt[0].split('.').pop().trim())
        //     fileUpdate
        //     listViewAttachmentsImg = fileUpdate.filter(x=>{
        //         EXTENSION_FILE_IMAGE.filter()
        //     })
        // }


        return (
            data !== null && (
                <div className={classes.formControl}>

                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã doanh nghiệp
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.companyCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Tên doanh nghiệp
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.companyName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã số thuế
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.taxCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Ngành nghề
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.fieldName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col" style={{ padding: '10px 15px 0px 15px' }}
                            >
                                Giới thiệu chung
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} style={{ padding: '10px 12px' }}>
                                {/* <InputGroup className="input-group-alternative"> */}
                                {/* <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.introduce}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                /> */}
                                {/* </InputGroup> */}
                                {/* {data.introduce} */}
                                <div dangerouslySetInnerHTML={{ __html: data.introduce }} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Địa chỉ
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={
                                        data.address + ', ' + data.wardName + ', ' + data.districtName + ', ' + data.pRovinceName
                                    }
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Điện thoại
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.phoneNumber}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Fax
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.fax}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Email
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.email}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Website
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.website}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Người liên hệ
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Điện thoại
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactPhone}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Email
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                {/* <InputGroup className="input-group-alternative"> */}
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactEmail}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                {/* </InputGroup> */}
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Vị trí
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            {cutLocation ? (
                                <iframe
                                    src={'https://maps.google.com/maps?q=' +
                                        data.location +
                                        '&hl=es;z=14' +
                                        '&output=embed'}
                                    width="100%"
                                    height="200px"
                                    style={{
                                        border: 0
                                    }}
                                    allowfullscreen=""
                                    loading="lazy">
                                </iframe>
                            ) : null}
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Logo
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                <img src={data.logo ? data.logo : NoImg}
                                    style={{ width: 150, height: 150 }} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Hình ảnh công ty
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
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

                    </div>
                    {fileUpdate ? (
                        <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                            <label className="form-control-label col">
                                File Upload
                            </label>
                            <div style={{ width: '100%' }}>
                                <Table className="align-items-center tablecs" responsive style={{}}>
                                    <HeadTitleTable headerTitle={headerTitle}
                                        classHeaderColumns={{
                                            0: 'table-scale-col table-user-col-1'
                                        }}
                                        hideEdit
                                    />
                                    <tbody ref={ref => this.tableBody = ref}>
                                        {
                                            Array.isArray(fileUpdate) && (
                                                fileUpdate.map((item, key) => {
                                                    let listAttachments = (item.attachments || '').split(';').filter(p => p);
                                                    let listViewAttachmentsImg = [];
                                                    let listViewAttachmentsFile = [];

                                                    listAttachments.map(item => {
                                                        if (EXTENSION_FILE_IMAGE.find(p => p == item.split('.').pop())) {
                                                            listViewAttachmentsImg.push(item);
                                                        } else {
                                                            listViewAttachmentsFile.push(item);
                                                        }
                                                    });
                                                    return <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (fileUpdate || []).length), height: 'auto' }}>
                                                        <td className='table-scale-col table-user-col-1'>{key + 1}</td>
                                                        <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                                            <span>{item.uploadDate ? moment(item.uploadDate).format('HH:mm') : moment(item.registeredDate).format('HH:mm')}</span><br />
                                                            <span>{item.uploadDate ? moment(item.uploadDate).format('DD/MM/YYYY') : moment(item.registeredDate).format('DD/MM/YYYY')}</span>
                                                        </td>
                                                        <td style={{ textAlign: 'left' }} className='table-scale-col'>
                                                            {listViewAttachmentsImg ?
                                                                (
                                                                    Array.isArray(listViewAttachmentsImg) && (
                                                                        listViewAttachmentsImg.map((lst, key) => (
                                                                            <a href={lst} target='_blank'><img key={key} width={70} height={70} src={lst} style={{ marginRight: '3px' }} /></a>
                                                                        ))
                                                                    )
                                                                )
                                                                : null
                                                            }
                                                            {listViewAttachmentsFile ?
                                                                (
                                                                    Array.isArray(listViewAttachmentsFile) && (
                                                                        listViewAttachmentsFile.map((lst, key) => (
                                                                            <a key={key} target='_blank' href={lst}
                                                                                style={{
                                                                                    marginRight: '3px',
                                                                                    width: '500px',
                                                                                    display: 'block',
                                                                                    whiteSpace: 'nowrap',
                                                                                    textOverflow: 'ellipsis',
                                                                                    overflow: 'hidden'
                                                                                }}>{lst}</a>
                                                                        ))
                                                                    )
                                                                )
                                                                : null
                                                            }
                                                        </td>
                                                    </tr>
                                                })
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    ) : null
                    }
                </div>
            )
        );
    }
};

export default ViewModal;
