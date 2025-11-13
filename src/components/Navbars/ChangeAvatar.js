import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../helpers/validation";
import { Editor } from '@tinymce/tinymce-react';
import PlusImg from "../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../assets/img/buttons/xoahinh.svg";
import SelectTree from "components/SelectTree";
import NoImg from "../../assets/img/NoImg/NoImg.jpg"
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class ChangeAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ThumbnailFile: "",
                fileView: ""
            },
            fileView: ""
        }
        this.refFileImage = null;
    }

    componentDidMount() {
        const { imgAvatarView } = this.props;
        const { data } = this.state;
        data.fileView = imgAvatarView;
        this.setState({ data })
    }

    handleChangeIMG = event => {
        let { data } = this.state;
        data.fileView = URL.createObjectURL(event.target.files[0])
        this.setState({
            data,
            file: event.target.files[0],
        })

        const ev = event.target.files[0];
        data.ThumbnailFile = ev;
        this.setState({ data });
        this.handleCheckValidation();
    }

    onDeleImg = () => {
        let { data } = this.state;
        data.ThumbnailFile = "";
        data.fileView = null;
        this.setState({ data });
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;
        // Check Validation 
        handleCheckValidation(true);
        // Handle New Data
        handleNewData(data);
    }

    render() {
        return (
            <div className={classes.formControl}>
                <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
                    <label
                        className="form-control-label"
                    >
                        Hình đại diện
                    </label>
                </div>
                <div className={classes.rowItem}>
                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative">
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
                                src={this.state.data.fileView ? this.state.data.fileView : NoImg}
                                style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 400 }} />
                            <div className="row" style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }}>
                                <Button type="button" size="lg" className='btn-primary-cs'
                                    onClick={this.onUpdateFileImage}>
                                    <img src={PlusImg} alt='Thêm mới' />
                                    <span>Chọn hình</span>
                                </Button>
                                {this.state.data.fileView != null ? (
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
                    </div>

                </div>
            </div>
        );
    }
};

export default ChangeAvatar;
