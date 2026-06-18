import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import Select from "components/Select";
import SelectTree from "components/SelectTree";
import { actionMaterialGroup } from "../../../actions/MaterialGroupActions";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg"
// reactstrap components
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class UpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                'ID': '',
                'name': '',
                'note': '',
                'unitID': '',
                'fieldID': '',
                'files': '',
                'image': '',
                'isProduct': false
            },
            file: null,
            fileView: null,
            activeSubmit: false
        }
        this.refFileImage = null;
    }

    async componentWillMount() {
        const { requestGetMaterialGroup, id } = this.props;
        if (id) {
            await requestGetMaterialGroup(id).then(
                res => {
                    // controller "materialgroupnext/get" trả về key dạng PascalCase (ID, Name, UnitID...),
                    // hỗ trợ luôn camelCase để an toàn
                    const d = res.data || {};
                    this.setState(previousState => {
                        return {
                            ...previousState,
                            data: {
                                'ID': d.ID || d.id,
                                'name': d.Name || d.name,
                                'note': d.Note || d.note,
                                'unitID': d.UnitID || d.unitID,
                                'fieldID': d.FieldID || d.fieldID,
                                'files': '',
                                'image': d.Image || d.image,
                                'isProduct': d.IsProduct || d.isProduct
                            }
                        }
                    }, () => this.handleCheckValidation());
                    this.setState({ file: d.Image || d.image })
                }
            )

        }

    }

    handleChange = (event) => {
        let { data } = this.state;
        const ev = event.target;
        data[ev['name']] = ev['value'];
        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleSelect = (value, name) => {
        let { data } = this.state;

        if (value === null) value = "";


        if (name === 'unitID') {
            let valsortOrder = value;
            if (valsortOrder == null) {
                this.setState({ sortOrderChange: null })
            }
        }

        data[name] = value;

        this.setState({ data });

        // Check Validation 
        this.handleCheckValidation();
    }

    handleCheckValidation = () => {
        const { handleCheckValidation, handleNewData } = this.props;
        let { data } = this.state;
        this.setState({ activeSubmit: true });
        // Check Validation 
        handleCheckValidation(true);
        // Handle New Data
        handleNewData(data);

    }

    handleChangeIMG = event => {

        if (event.target.files[0] != undefined) {
            this.setState({
                fileView: URL.createObjectURL(event.target.files[0]),
                file: event.target.files[0],
            })
        } else {
            this.setState({
                fileView: null,
                file: null,
            })
        }
        let { data } = this.state;
        const ev = event.target.files[0];
        data.files = ev;
        this.setState({ data });
        this.handleCheckValidation();
    }

    onUpdateFileImage = () => {
        this.refFileImage.click();
    }

    onDeleImg = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                file: null,
                fileView: null
            }
        }
        )
    }

    onChangeIsProduct = value => () => {
        this.setState(previousState => {
            return {
                ...previousState,
                data: {
                    ...previousState.data,
                    isProduct: value
                }
            }
        }, () => this.handleCheckValidation());
    }

    render() {
        const { data } = this.state;
        const { errorUpdate, sortOrderChange, dataUnit, fieldData, handleOpenSelectTree } = this.props;

        let _dataUnit
        let _dataUnitName

        if (data.unitID) {
            _dataUnit = dataUnit.filter(x => data.unitID == x.id)
            if (sortOrderChange === null) {
                _dataUnitName = null
            } else {
                _dataUnitName = _dataUnit[0].unitName
            }
        }

        return (
            <div className={classes.formControl}>
                {/* <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                        Ngành nghề&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <SelectTree
                            name="fieldID"
                            title='Chọn ngành nghề'
                            data={fieldData}
                            selected={data.fieldID}
                            labelName='fieldName'
                            fieldName='fieldName'
                            val='id'
                            handleChange={this.handleSelect}
                            handleOpenSelectTree={handleOpenSelectTree}
                        />
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['fieldID'] || ''}</p>
                    </div>
                </div> */}
                {/* <div className={classes.rowItem}>
                    <label
                        className="form-control-label"
                    >
                    </label>
                    <div className={classes.inputArea}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            // width: '100%',
                            // paddingLeft: '117px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1
                            }}>
                                <input onClick={this.onChangeIsProduct(true)} checked={data.isProduct ? true : false} id="isProductTrue" name='isProduct' type="radio" />
                                <label htmlFor="isProductTrue" style={{
                                    width: 'auto',
                                    marginLeft: 5,
                                    fontSize: '0.8rem'
                                }}>Nhóm sản phẩm</label>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1
                            }}>
                                <input onClick={this.onChangeIsProduct(false)} checked={data.isProduct ? false : true} id="isProductFalse" name='isProduct' type="radio" />
                                <label htmlFor="isProductFalse" style={{
                                    width: 'auto',
                                    marginLeft: 5,
                                    fontSize: '0.8rem'
                                }}>Nhóm nguyên vật liệu</label>
                            </div>
                        </div>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['isProduct'] || ''}</p>
                    </div>
                </div> */}

                {/* {data.name ? ( */}
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label width-add-label-material-group"
                    >
                        Tên nhóm&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>

                    <div className={classes.inputArea}>
                        <InputGroup className="input-group-alternative css-border-input">
                            <Input
                                name='name'
                                required
                                autoFocus={true}
                                defaultValue={data.name}
                                onKeyUp={(event) => this.handleChange(event)}
                            />
                        </InputGroup>
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['name'] || ''}</p>
                    </div>
                </div>
                {/* ) : null} */}
                <div className={classes.rowItem}>
                    <label
                        className="form-control-label width-add-label-material-group"
                    >
                        ĐVT&nbsp;<b style={{ color: 'red' }}>*</b>
                    </label>
                    <div className={classes.inputArea}>
                        <Select
                            name='unitID'
                            labelName='unitName'
                            data={dataUnit}
                            defaultValue={data.unitID}
                            labelMark={_dataUnitName}
                            val='id'
                            title='Chọn ĐVT'
                            handleChange={this.handleSelect}
                        />
                        <p className='form-error-message margin-bottom-0'>{errorUpdate['unitID'] || ''}</p>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        materialGroup: state.MaterialGroupStore,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(actionMaterialGroup, dispatch),
    }
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UpdateModal);
