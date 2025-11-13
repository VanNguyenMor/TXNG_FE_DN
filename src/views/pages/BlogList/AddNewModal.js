import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { Editor } from '@tinymce/tinymce-react';
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import SelectTree from "components/SelectTree";
import { BLOG_UPDATE_IMG } from "../../../apis";
import axios from "axios";
import PopupMessage from "../../../components/PopupMessage";
import Message, { TYPES } from '../../../components/message';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class AddNewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                "ID": '',
                "Title": '',
                "MenuID": '',
                "Description": '',
                "Content": '',
                "ThumbnailFile": '',
                "IsHot": false,
                //"IsShow": false,
            },
            activeSubmit: false,
            file: null,
            fileView: null,

        }
        this.refEditor = null;
        this.refFileImage = null;
    }
    handleChangeIMG = event => {

        this.setState({
            fileView: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0],
        })

        let { data } = this.state;
        const ev = event.target.files[0];

        data.ThumbnailFile = ev;
        this.setState({ data });
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    onDeleImg = () => {
        let { data } = this.state;
        data.ThumbnailFile = "";
        this.setState({ data, fileView: null });

        this.handleCheckValidation();
    }

    toggleModal = (state, type) => {
        if (this.state[state] && type == 1) {
            return;
        } else {
            this.setState({
                [state]: !this.state[state],
            });
        }
    };

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;

        data[ev['name']] = ev['value'];
        let content = ''
        if (this.refEditor) {
            content = this.refEditor.getContent();
        }
        data.Content = content;
        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data, file } = this.state;

        if (data.Title.length > 0 && data.MenuID != "" &&
            data.Description.length > 0 && data.Content != "") {
            this.setState({ activeSubmit: true });

            // Check Validation 
            handleCheckValidation(true);

            // Handle New Data
            handleNewData(data);
        } else {
            this.setState({ activeSubmit: false });
            handleCheckValidation(false);

            // Handle New Data
            handleNewData(data);
        }

    }
    handleSelect = (value, name) => {
        let { data } = this.state;
        if (value === null) value = "";
        data[name] = value;

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleChangeCheckBox = (event) => {
        let { data } = this.state;
        const ev = event.target;

        data[ev['name']] = ev['checked'];
        this.setState({ data });
        this.handleCheckValidation();
    }
    onUpdate = () => {
        let introduce = '';

        if (this.refEditor) {
            introduce = this.refEditor.getContent();
        }
        const formData = new FormData();
        formData.append('Introduce', introduce);
    }
    handleResponseError() {

    }
    render() {
        const { data, handleCreateInfoData, errorInsert, handleOpenSelectTree } = this.props;
        const { introduce, messageErr, popupMessage } = this.state;

        return (
            <div className={classes.formControl}>

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Tiêu đề&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <Validate
                        validations={validations}
                        rules={rules}
                    >
                        {({ validate, errorMessages }) => (
                            <div className={classes.inputArea}>
                                <InputGroup className="input-group-alternative css-border-input">
                                    <Input
                                        type="text"
                                        name='Title'
                                        //value={data.Title}
                                        placeholder="Tiêu đề"
                                        required
                                        onChange={validate}
                                        autoFocus={true}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    />
                                </InputGroup>
                                <p className={classes.error}>{errorMessages.Title}</p>
                                <p className='form-error-message margin-bottom-0'>{errorInsert['Title'] || ''}</p>
                            </div>
                        )}
                    </Validate>
                </div>

                <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Thuộc menu&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <Validate
                        validations={validations}
                        rules={rules}
                    >
                        {({ validate, errorMessages }) => (
                            <div style={{ width: '100%' }}>
                                <InputGroup className="input-group-alternative css-select-border" >
                                    <SelectTree
                                        name="MenuID"
                                        //selected={data.fieldID}
                                        //defaultValue={menu.fieldID}
                                        title='Chọn menu'
                                        data={data}
                                        labelName='menuName'
                                        val='id'
                                        fieldName='menuName'
                                        onChange={validate}
                                        handleChange={this.handleSelect}
                                        handleOpenSelectTree={handleOpenSelectTree}
                                    />
                                </InputGroup>
                                <p className={classes.error}>{errorMessages.MenuID}</p>
                                <p className='form-error-message margin-bottom-0'>{errorInsert['MenuID'] || ''}</p>
                            </div>
                        )}
                    </Validate>
                </div>
                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label className="form-control-label">
                        Mô tả&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>


                    <Validate
                        validations={validations}
                        rules={rules}
                    >
                        {({ validate, errorMessages }) => (
                            <div className={classes.inputArea}>
                                <InputGroup className="input-group-alternative css-border-input">
                                    <Input
                                        type="textarea"
                                        name='Description'
                                        // placeholder="Mô tả"
                                        //value={data.Description}
                                        required
                                        onChange={validate}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    />
                                </InputGroup>
                                <p className={classes.error}>{errorMessages.Description}</p>
                                <p className='form-error-message margin-bottom-0'>{errorInsert['Description'] || ''}</p>
                            </div>
                        )}
                    </Validate>
                </div>

                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label
                        className="form-control-label"
                    >
                        Nội dung&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <Validate
                        validations={validations}
                        rules={rules}
                    >
                        {({ validate, errorMessages }) => (
                            <div className={classes.inputArea}>
                                <InputGroup className="input-group-alternative css-border-input">

                                    <Editor
                                        //name = "Content"
                                        onKeyUp={(event) => this.handleChange(event)}
                                        onInit={(_, editor) => {
                                            this.refEditor = editor;
                                        }}
                                        init={{
                                            width: '100%',
                                            height: 500,
                                            menubar: false,
                                            toolbar: 'undo redo | formatselect | image | link | code | ' +
                                                'bold italic forecolor backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            selector: 'textarea#file-picker',
                                            plugins: 'image code link',
                                            image_title: true,

                                            automatic_uploads: true,
                                            file_picker_types: 'image',
                                            file_picker_callback: (cb, value, meta) => {
                                                let _this = this;

                                                var input = document.createElement('input');
                                                input.setAttribute('type', 'file');
                                                input.setAttribute('accept', 'image/*');
                                                input.onchange = async function () {
                                                    var file = this.files[0];
                                                    var reader = new FileReader();
                                                    reader.onload = function () {
                                                        var id = 'blobid' + (new Date()).getTime();
                                                        var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                                                        var base64 = reader.result.split(',')[1];
                                                        var blobInfo = blobCache.create(id, file, base64);
                                                        blobCache.add(blobInfo);
                                                        cb(blobInfo.blobUri(), { title: file.name });
                                                    };
                                                    let data = null;
                                                    let imageFile = new FormData();
                                                    let fileLink = null;
                                                    imageFile.append('files', file);

                                                    try {
                                                        data = await axios({
                                                            method: 'post',
                                                            url: BLOG_UPDATE_IMG,
                                                            headers: {
                                                                authorization: localStorage.getItem('TOKEN')
                                                            },
                                                            data: imageFile
                                                        })
                                                        if (data.data.status == 200) {
                                                            fileLink = data.data.data;
                                                            cb(fileLink);
                                                        } else {
                                                            _this.setState({ messageErr: 'Lỗi hệ thống' })
                                                            _this.toggleModal('popupMessage')
                                                            return;
                                                        }
                                                    } catch (error) {
                                                        _this.setState({ messageErr: 'Lỗi hệ thống' })
                                                        _this.toggleModal('popupMessage')
                                                        return;
                                                    }

                                                    //reader.readAsDataURL(file);
                                                };

                                                input.click();

                                            },
                                        }}
                                    />
                                </InputGroup>
                                <p className={classes.error}>{errorMessages.Content}</p>
                                <p className='form-error-message margin-bottom-0'>{errorInsert['Content'] || ''}</p>
                            </div>
                        )}
                    </Validate>
                </div>

                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label
                        className="form-control-label"
                    >
                        Thumbnail&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <input
                                ref={ref => this.refFileImage = ref}
                                type="file"
                                name='ThumbnailFile'
                                //value={data.ThumbnailFile}
                                required
                                style={{ display: 'none' }}
                                onChange={this.handleChangeIMG}
                                accept="image/*"
                            //onKeyUp={(event) => this.handleChangeIMG(event)}
                            />
                            <img
                                src={this.state.fileView ? this.state.fileView : NoImg}
                                style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 400 }} />
                            <div className="row" style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }}>
                                <Button type="button" size="lg" className='btn-primary-cs'
                                    onClick={this.onUpdateFileImage}>
                                    <img src={PlusImg} alt='Thêm mới' />
                                    <span>Chọn hình</span>
                                </Button>
                                {this.state.file != null ? (
                                    <Button
                                        color="default"
                                        data-dismiss="modal"
                                        type="button"
                                        className={`btn-danger-cs`}
                                        onClick={this.onDeleImg}
                                    >
                                        <img src={CloseIcon} alt='Thoát ra' />
                                        <span>Xóa hình</span>
                                    </Button>
                                ) : null}
                            </div>

                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['ThumbnailFile'] || ''}</p>
                    </div>

                </div>

                {/* <div className={classes.rowItem} style={{ paddingLeft: '1.5rem' }}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <Input
                                type="checkbox"
                                name='IsShow'

                                onClick={(event) => this.handleChangeCheckBox(event)}
                            />
                        </InputGroup>Ẩn

                        <p className='form-error-message margin-bottom-0'>{errorInsert['IsShow'] || ''}</p>
                    </div>
                </div> */}
                <div className={classes.rowItem} style={{ paddingLeft: '1.5rem' }}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative blogList-css-check">
                            <Input
                                type="checkbox"
                                name='IsHot'
                                onClick={(event) => this.handleChangeCheckBox(event)}
                            />

                        </InputGroup>
                        <span style={{ marginLeft: '10px', lineHeight: '25px' }}>Tin nổi bật</span>
                        <p className='form-error-message margin-bottom-0'>{errorInsert['IsHot'] || ''}</p>
                    </div>
                </div>

                <PopupMessage
                    popupMessage={popupMessage}
                    moduleTitle={'Thông báo'}
                    moduleBody={messageErr}
                    toggleModal={this.toggleModal}
                />
            </div>

        );
    }
};

export default AddNewModal;
