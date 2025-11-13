import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { Editor } from '@tinymce/tinymce-react';

// reactstrap components
import {
    Input,
    InputGroup
} from "reactstrap";
import { get } from "services/Dataservice";
import axios from "axios";

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: {
                Id: '',
                Title: '',
                MenuID: '',
                Description: '',
                Content: '',
                ThumbnailFile: '',
            },
            activeSubmit: false,
            file: null,
            fileView: null,
            fetching: false,

        }
        this.handleChangeIMG = this.handleChangeIMG.bind(this)
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
                newData.MenuID = typeof (data.menuID) ? data.menuID : newData.MenuID;
            }
            this.setState({ newData })
            this.setState({ fetching: true });
        }

        this.handleCheckValidation()
    }
    handleChangeIMG(event) {

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

        if (this.refEditor) {
            content = this.refEditor.getContent();
        }
        newData.Content = content;
        this.setState({ newData });
        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { newData } = this.state;
        // if (newData.Title.length > 0 && newData.MenuID != "" &&
        //     newData.Description.length > 0 && newData.Content.length > 0) {
        this.setState({ activeSubmit: true });

        // Check Validation 
        handleCheckValidation(true);

        // Handle New Data
        handleNewData(newData);
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

    render() {
        const { data, handleCreateInfoData, errorUpdate, menu } = this.props;
        const { newData } = this.state;

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
                                <InputGroup className="input-group-alternative">
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
                                <InputGroup className="input-group-alternative">
                                    <Select
                                        name="MenuID"
                                        //defaultValue={menu.fieldID}
                                        title='Chọn menu'
                                        data={menu}
                                        labelName='menuName'
                                        defaultValue={data.menuID}
                                        val='id'
                                        onChange={validate}
                                        handleChange={this.handleSelect}
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
                                <InputGroup className="input-group-alternative">
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
                                <InputGroup className="input-group-alternative">
                                    {/* <Input
                                        type="text"
                                        name='Content'
                                        defaultValue={newData.Content}
                                        onChange={validate}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    /> */}
                                    <Editor
                                        onKeyUp={(event) => this.handleChange(event)}
                                        onInit={(_, editor) => {
                                            this.refEditor = editor;
                                        }}
                                        initialValue={newData.Content}
                                        init={{
                                            width: '100%',
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
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
                        Thumbnail
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <input
                                // ref={ref => this.refInputFile = ref}
                                type="file"
                                name='ThumbnailFile'
                                //value={data.ThumbnailFile}
                                required
                                onChange={this.handleChangeIMG}
                                accept="image/*"
                            //onKeyUp={(event) => this.handleChangeIMG(event)}
                            />
                            {
                                this.state.fileView === null ? (
                                    <img
                                        src={data.thumbnail}
                                        style={{ width: '50%', height: '50%' }} />
                                ) : (
                                    <img
                                        src={this.state.fileView}
                                        style={{ width: '50%', height: '50%' }} />
                                )}
                        </InputGroup>

                    </div>

                </div>
            </div>
        );
    }
};

export default UpdateModal;
