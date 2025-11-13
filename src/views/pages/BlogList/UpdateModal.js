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
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import axios from "axios";
import PopupMessage from "../../../components/PopupMessage";
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";
import { get } from "services/Dataservice";

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: {
                Id: '',
                Title: '',
                MenuID: 0,
                Description: '',
                Thumbnail: '',
                Content: '',
                ThumbnailFile: '',
                IsHot: false,
                IsShow: false,
            },
            activeSubmit: false,
            file: null,
            fileView: null,
            fetching: false,

        }
        // this.handleChangeIMG = this.handleChangeIMG.bind(this)
        this.refFileImage = null;
        this.refEditor = null;
    }
    componentDidMount() {
        const { data } = this.props;
        let { newData, fetching } = this.state;

        if (!fetching) {
            if (data !== null) {
                newData.Id = typeof (data.id) ? data.id : newData.Id;
                newData.Title = typeof (data.title) ? data.title : newData.Title;
                newData.Description = typeof (data.description) ? data.description : newData.Description;
                newData.Content = typeof (data.content) ? data.content : newData.Content;
                newData.IsShow = data.isShow ? true : false;
                newData.IsHot = typeof (data.isHot) ? data.isHot : newData.IsHot;
                newData.MenuID = typeof (data.menuID) ? parseInt(data.menuID) : parseInt(newData.MenuID);
                newData.Thumbnail = typeof (data.thumbnail) ? (data.thumbnail == null ? data.thumbnail = "" : data.thumbnail) : newData.Thumbnail;
            }
            this.setState({ newData })
            this.setState({ fetching: true });
        }
        this.handleCheckValidation()
    }
    handleChangeIMG = event => {

        this.setState({
            fileView: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0],
        })
        let { newData } = this.state;
        const ev = event.target.files[0];
        newData.ThumbnailFile = ev;
        this.setState({ newData });
        this.handleCheckValidation();
    }
    handleChange = (event) => {
        let { newData } = this.state;
        const ev = event.target;
        let content = ''
        newData[ev['name']] = ev['value'];
        // console.log(this.refEditor.getContent())
        // if (this.refEditor) {
        //     content = this.refEditor.getContent();
        // }
        // newData.Content = content;
        this.setState({ newData });
        // Check Validation 
        this.handleCheckValidation();
    }

    handleChangeCheckBox = (event) => {
        let { newData } = this.state;
        const ev = event.target;

        newData[ev['name']] = ev['checked'];
        this.setState({ newData });
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    onDeleImg = () => {
        let { newData } = this.state;
        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         newData: {
        //             Thumbnail: null
        //         },
        //         fileView: null
        //     }
        // }
        // )
        newData.Thumbnail = "";
        this.setState({ newData, fileView: null });

        this.handleCheckValidation();
    }

    handleCheckValidation = (content = this.state.newData.Content) => {
        const { handleCheckValidation, handleNewData } = this.props;

        let { newData } = this.state;
        //console.log(newData)
        // if (newData.Title.length > 0 && newData.MenuID != "" &&
        //     newData.Description.length > 0 && newData.Content.length > 0) {
        this.setState({ activeSubmit: true });

        // Check Validation 
        handleCheckValidation(true);

        // Handle New Data
        handleNewData(newData, content);
        // } else {
        //     this.setState({ activeSubmit: false });
        //     handleCheckValidation(false);

        //     // Handle New Data
        //     handleNewData(newData);
        // }

    }
    handleSelect = (value, name) => {
        let { newData } = this.state;
        if (value === null) value = "";
        newData[name] = value;

        this.setState({ newData });

        // Check Validation 
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

    render() {
        const { data, handleCreateInfoData, errorUpdate, menu, handleOpenSelectTree } = this.props;
        const { newData, popupMessage, messageErr } = this.state;

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
                                        defaultValue={newData.Title}
                                        required
                                        onChange={validate}
                                        autoFocus={true}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    />
                                </InputGroup>
                                <p className='form-error-message margin-bottom-0'>{errorUpdate['Title'] || ''}</p>
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
                                <InputGroup className="input-group-alternative css-select-border">
                                    {/* <Select
                                        name="MenuID"
                                        //defaultValue={menu.fieldID}
                                        title='Chọn menu'
                                        data={menu}
                                        labelName='menuName'
                                        defaultValue={data.menuID}
                                        val='id'
                                        onChange={validate}
                                        handleChange={this.handleSelect}
                                    /> */}
                                    <SelectTree
                                        name="MenuID"
                                        selected={newData.MenuID}
                                        title='Chọn menu'
                                        data={menu}
                                        labelName='menuName'
                                        val='id'
                                        fieldName='menuName'
                                        handleChange={this.handleSelect}
                                        handleOpenSelectTree={handleOpenSelectTree}
                                    />
                                </InputGroup>

                                <p className='form-error-message margin-bottom-0'>{errorUpdate['MenuID'] || ''}</p>
                            </div>
                        )}
                    </Validate>
                </div>
                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label
                        className="form-control-label"
                    >
                        Mô tả&nbsp;<b style={{ color: 'red' }}>*</b>
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
                                    <Input
                                        type="textarea"
                                        name='Description'
                                        defaultValue={newData.Description}
                                        required
                                        onChange={validate}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    />
                                </InputGroup>

                                <p className='form-error-message margin-bottom-0'>{errorUpdate['Description'] || ''}</p>
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
                                    {/* <Input
                                        type="text"
                                        name='Content'
                                        defaultValue={newData.Content}
                                        onChange={validate}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    /> */}
                                    <Editor
                                        // onKeyUp={(event) => this.handleChange(event)}
                                        name='content'
                                        onEditorChange={this.handleCheckValidation}
                                        onInit={(_, editor) => {
                                            this.refEditor = editor;
                                        }}
                                        initialValue={newData.Content}
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

                                <p className='form-error-message margin-bottom-0'>{errorUpdate['Content'] || ''}</p>
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
                                // ref={ref => this.refInputFile = ref}
                                type="file"
                                name='ThumbnailFile'
                                //value={data.ThumbnailFile}
                                required
                                style={{ display: 'none' }}
                                onChange={this.handleChangeIMG}
                                accept="image/*"
                            //onKeyUp={(event) => this.handleChangeIMG(event)}
                            />
                            {/* {
                                this.state.fileView === null ? (
                                    <img
                                        src={data.thumbnail}
                                        style={{ width: '50%', height: '50%' }} />
                                ) : (
                                    <img
                                        src={this.state.fileView}
                                        style={{ width: '50%', height: '50%' }} />
                                )
                            } */}
                            {
                                this.state.fileView === null ? (
                                    <img
                                        src={newData.Thumbnail ? newData.Thumbnail : NoImg}
                                        style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 400 }} />
                                ) : (
                                    <img
                                        src={this.state.fileView ? this.state.fileView : NoImg}
                                        style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 400 }} />
                                )
                            }
                            <div className="row" style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }}>
                                <Button type="button" size="lg" className='btn-primary-cs'
                                    onClick={this.onUpdateFileImage}>
                                    <img src={PlusImg} alt='Thêm mới' />
                                    <span>Chọn hình</span>
                                </Button>
                                {newData.Thumbnail ? (
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
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['Thumbnail'] || ''}</p>
                    </div>

                </div>
                <div className={classes.rowItem} style={{ paddingLeft: '1.5rem' }}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative blogList-css-check">
                            <Input
                                type="checkbox"
                                name='IsShow'
                                checked={newData.IsShow}
                                onClick={(event) => this.handleChangeCheckBox(event)}
                            />
                        </InputGroup><span style={{ marginLeft: '10px', lineHeight: '25px' }}>Ẩn</span>

                        <p className='form-error-message margin-bottom-0'>{errorUpdate['IsShow'] || ''}</p>
                    </div>
                </div>
                <div className={classes.rowItem} style={{ paddingLeft: '1.5rem' }}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative blogList-css-check">
                            <Input
                                type="checkbox"
                                name='IsHot'
                                checked={newData.IsHot}
                                onClick={(event) => this.handleChangeCheckBox(event)}
                            />
                        </InputGroup><span style={{ marginLeft: '10px', lineHeight: '25px' }}>Tin nổi bật</span>

                        <p className='form-error-message margin-bottom-0'>{errorUpdate['IsHot'] || ''}</p>
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

export default UpdateModal;
