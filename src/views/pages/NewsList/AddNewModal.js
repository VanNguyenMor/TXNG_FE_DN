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
            },
            activeSubmit: false,
            file: null,
            fileView: null,
            
        }
        this.handleChangeIMG = this.handleChangeIMG.bind(this);
        this.refEditor = null;
    }
    handleChangeIMG(event) {

        this.setState({
            fileView: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0],
        })

        let { data } = this.state;
        const ev = event.target.files[0];

        data.ThumbnailFile = ev;
        this.setState({ data });


        //console.log(event.target.files[0])
        this.handleCheckValidation();
    }
    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;

        data[ev['name']] = ev['value'];
        let content =''
        if (this.refEditor) {
            content = this.refEditor.getContent();
        }
        data.Content =content;
        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
        //console.log(this.refEditor)
        // Check Confirm Password
        
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data, file } = this.state;

        if (data.Title.length > 0 && data.MenuID != "" &&
            data.Description.length > 0 && data.Content !="") {
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
    onUpdate = () => {
        let introduce = '';

        if (this.refEditor) {
            introduce = this.refEditor.getContent();
        }
        const formData = new FormData();
        formData.append('Introduce', introduce);
    }
    render() {
        const { data, handleCreateInfoData, errorInsert } = this.props;
        const { introduce } = this.state;
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
                                        //value={data.Title}
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
                                <InputGroup className="input-group-alternative">
                                    <Select
                                        name="MenuID"
                                        //defaultValue={menu.fieldID}
                                        title='Chọn menu'
                                        data={data}
                                        labelName='menuName'
                                        val='id'
                                        onChange={validate}
                                        handleChange={this.handleSelect}
                                    />
                                </InputGroup>
                                <p className={classes.error}>{errorMessages.MenuID}</p>
                                <p className='form-error-message margin-bottom-0'>{errorInsert['MenuID'] || ''}</p>
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
                                <InputGroup className="input-group-alternative">
                                    {/* <Input
                                        type="text"
                                        name='Content'
                                        //value={data.Content}
                                        onChange={validate}
                                        onKeyUp={(event) => this.handleChange(event)}
                                    /> */}
                                    <Editor
                                        //name = "Content"
                                        onKeyUp={(event) => this.handleChange(event)}
                                        onInit={(_, editor) => {
                                            this.refEditor = editor;
                                        }}
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
                        Thumbnail
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
                            <input
                                type="file"
                                name='ThumbnailFile'
                                //value={data.ThumbnailFile}
                                required
                                onChange={this.handleChangeIMG}
                                accept="image/*"
                            //onKeyUp={(event) => this.handleChangeIMG(event)}
                            />
                            <img
                                src={this.state.fileView}
                                style={{ width: '50%', height: '50%' }} />
                        </InputGroup>

                    </div>

                </div>
            </div>
        );
    }
};

export default AddNewModal;
