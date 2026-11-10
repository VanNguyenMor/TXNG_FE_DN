import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Guid } from 'guid-typescript';

import { areaDataAction } from "../../../actions/AreaDataAction";
import PopupMessage from "../../../components/PopupMessage";
import Select from "components/Select";

import '../../../assets/css/page/insert_or_update_area_data.css';

import IconAdd from '../../../assets/img/buttons/add.svg';
import IconDelete from '../../../assets/img/buttons/delete.png';
import {
    Input,
    InputGroup,
    Button
} from "reactstrap";

class InsertOrUpadte extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errMessage: '',
            typeManage: 1,
            provinceId: null,
            provinceName: '',
            wardId: null,
            zones: [],
            isDisableSelectWard: true,
            isShowArea: false,
            id: null
        }

        this.refInputName = null;
        this.redSelect1 = null;
    }

    componentWillUnmount() {
        this.setState(previousState => {
            return {
                ...previousState,
                typeManage: 1,
                provinceId: null,
                provinceName: '',
                wardId: null,
                zones: [],
                isDisableSelectWard: true,
                isShowArea: false,
                id: null
            }
        });
    }

    async componentDidMount() {
        const { getDetailArea, getListProvince, getListWardByProvince, onHandleChangeValue, id } = this.props;

        if (onHandleChangeValue) {
            onHandleChangeValue(this.state);
        }

        if (id) {
            const result = await getDetailArea({ id });

            const data = ((result || {}).data || {}).data || null;

            if (!data) {


                this.setState({
                    errMessage: 'Không tìm thấy vùng dữ liệu này'
                })
                this.toggleModal('popupMessage')
                return;
            }

            const zones = ((data || {}).zonesDetail || []).map(item => {
                return {
                    id: Guid.create().toString(),
                    wardId: item.wardID,
                    wardName: '',
                    districtName: '',
                    provinceName: '',
                    nameAddress: item.name,
                    districtId: item.districtID,
                    provinceId: item.provinceID,
                }
            });
            if (data.zone.level == 2) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isDisableSelectWard: false,
                    }
                })
            } else if (data.zone.level == 1) {
                this.setState(previousState => {
                    return {
                        ...previousState,
                        isDisableSelectWard: true,
                    }
                })
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    id: data.zone.id,
                    name: data.zone.zoneName,
                    typeManage: data.zone.level,
                    provinceId: data.zone.provinceID,
                    isShowArea: true,
                    zones
                }
            }, () => {
                if (onHandleChangeValue) {
                    onHandleChangeValue(this.state);
                }
            });
        }

        getListProvince({}).then(res => {
            const data = res.data;
            if (data.status == 200) {
                const list = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);

                // Chỉ tự điền khi tài khoản gắn đúng 1 tỉnh. Nếu truy cập được
                // nhiều tỉnh (Administrator) thì để trống cho người dùng tự chọn.
                if (list.length === 1 && list[0] && list[0].id) {
                    const province = list[0];

                    this.setState(previousState => {
                        return {
                            ...previousState,
                            provinceId: province.id,
                            provinceName: province.provinceName
                        }
                    }, () => {
                        if (this.props.onHandleChangeValue) {
                            this.props.onHandleChangeValue(this.state);
                        }
                    });
                }
            }
        });

        getListWardByProvince({});

        this.focusInput();
    }

    focusInput = () => {
        if (this.refInputName) {
            const timeOut = setTimeout(() => {
                this.refInputName.focus();

                clearTimeout(timeOut);
            }, 100);
        }
    }

    // Lấy provinceID của 1 phường/xã (xử lý cả 2 kiểu đặt tên field).
    getWardProvinceId = (w) => {
        if (!w) return null;
        return w.provinceID != null ? w.provinceID : (w.provinceId != null ? w.provinceId : null);
    }

    // Danh sách tỉnh để chọn: ưu tiên kết quả getprovince; nếu rỗng
    // (vd tài khoản Administrator) thì suy ra từ danh sách phường/xã đã load.
    getProvinceOptions = () => {
        const { provinces, wards } = this.props;

        if (Array.isArray(provinces) && provinces.length > 0) {
            return provinces;
        }

        const map = {};
        (wards || []).forEach(w => {
            const pid = this.getWardProvinceId(w);
            if (pid != null && !map[pid]) {
                map[pid] = { id: pid, provinceName: w.provinceName || ('Tỉnh ' + pid) };
            }
        });

        return Object.values(map).sort((a, b) => (a.provinceName > b.provinceName ? 1 : -1));
    }

    onChangeTypeManage = type => () => {
        if (this.redSelect1) {
            this.redSelect1.resetValue();
        }

        let isDisableSelectWard = true;

        if (type == 1) {
            isDisableSelectWard = true;
        } else if (type == 2) {
            isDisableSelectWard = false;
        }
        this.setState(previousState => {
            return {
                ...previousState,
                typeManage: type,
                isDisableSelectWard,
                wardId: null,
                zones: [],
                isShowArea: type == 1 ? false : true,
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
    }

    onChangeSelect = name => value => {
        this.setState({ errMessageQH: '', errMessagePX: '' })

        if (name === 'provinceId') {
            // Đổi tỉnh => reset phường/xã đã chọn và danh sách khu vực,
            // đồng thời cập nhật tên tỉnh hiển thị.
            const province = this.getProvinceOptions().find(p => p.id == value);

            if (this.redSelect1) {
                this.redSelect1.resetValue();
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    provinceId: value,
                    provinceName: (province || {}).provinceName || '',
                    wardId: null,
                    zones: []
                }
            }, () => {
                if (this.props.onHandleChangeValue) {
                    this.props.onHandleChangeValue(this.state);
                }
            });

            return;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
    }
    toggleModal = (state, type) => {
        if (this.state[state] && type == 1) {
            return;
        } else {
            this.setState({
                [state]: !this.state[state],
                detail: null,
                //errMessage:null
            });
        }
    };
    onAddArea = () => {
        const { provinceId, wardId, typeManage } = this.state;
        const { wards } = this.props;

        if (typeManage == 1) {

            this.setState({
                errMessage: 'Cấp quản lý Tỉnh/Thành không được chọn khu vực'
            })
            this.toggleModal('popupMessage')
            return;
        }

        const zones = [...this.state.zones];

        if (!provinceId) {

            this.setState({
                errMessage: 'Chưa chọn Tỉnh/Thành'
            })
            this.toggleModal('popupMessage')
            return;
        }

        if (!wardId && typeManage == 2) {

            this.setState({
                errMessagePX: 'Chưa chọn Phường/Xã'
            })
            return;
        }

        if (wardId && typeManage == 2) {
            const checkWard = zones.filter(p => p.wardId == wardId).length > 0 ? false : true;

            if (!checkWard) {
                this.setState({
                    errMessage: 'Khu vực này đã có'
                })
                this.toggleModal('popupMessage')
                return;
            }
        }

        const province = this.getProvinceOptions().find(p => p.id == provinceId);
        if (!province) {

            this.setState({
                errMessage: 'Không tìm thấy Tỉnh/Thành này'
            })
            this.toggleModal('popupMessage')
            return;
        }

        const ward = wards.find(p => p.id == wardId);

        if (!ward && typeManage == 2) {
            this.setState({
                errMessage: 'Không tìm thấy Phường/Xã này'
            })
            this.toggleModal('popupMessage')
            return;
        }

        zones.push({
            id: Guid.create().toString(),
            wardId: (ward || {}).id || '',
            districtId: '',
            provinceId: (province || {}).id || '',
            wardName: (ward || {}).wardName || '',
            districtName: '',
            provinceName: province.provinceName
        });

        this.setState(previousState => {
            return {
                ...previousState,
                zones,
                wardId: null,
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });

    }

    onDeleteArea = id => () => {
        const zones = [...this.state.zones];

        const zone = zones.find(p => p.id == id);

        if (zone) {
            const zoneNews = zones.filter(p => p.id != id);

            this.setState(previousState => {
                return {
                    ...previousState,
                    zones: zoneNews
                }
            }, () => {
                if (this.props.onHandleChangeValue) {
                    this.props.onHandleChangeValue(this.state);
                }
            });
        } else {
            this.setState({
                errMessage: 'Không tìm thấy khu vực này'
            })
            this.toggleModal('popupMessage')
            return;
        }
    }

    onChangeValue = name => e => {
        const value = e.target.value;

        this.setState(previousState => {
            return {
                ...previousState,
                [name]: value
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
    }

    render() {
        const { isShowArea, name, provinceId, provinceName, isDisableSelectWard, typeManage, zones, popupMessage, errMessage } = this.state;
        const { errors, wards } = this.props;
        const provinceOptions = this.getProvinceOptions();
        const wardFilters = zones.map(p => p.wardId);

        const _wards = wards.filter(p => {
            if (wardFilters.filter(m => m == p.id).length !== 0) return false;
            // Lọc phường/xã theo tỉnh đang chọn (nếu dữ liệu phường/xã có provinceID).
            const pid = this.getWardProvinceId(p);
            return !provinceId || pid == null || pid == provinceId;
        });
        const _wardssort = _wards.sort((a, b) => a.wardName > b.wardName ? 1 : -1)
        //console.log(zones)
        return (
            <div className='wrap-insert-or-update-zone'>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Tên vùng &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-box '>
                        <InputGroup className='input-group-alternative css-border-input'>
                            <Input ref={ref => this.refInputName = ref} autoFocus={true} value={name} onChange={this.onChangeValue('name')} type='text' />
                        </InputGroup>
                        {/* <input ref={ref => this.refInputName = ref} autoFocus={true} value={name} onChange={this.onChangeValue('name')} type='text' className='wrap-insert-or-update-zone-item-input Select_select__3PGnh' /> */}
                        <p className='form-error-message'>{errors.name || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Cấp quản lý &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-check' style={{ width: '100%' }}>
                        <div className='wrap-insert-or-update-zone-item-box-check' style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div onClick={this.onChangeTypeManage(1)} className='wrap-insert-or-update-zone-item-check-item'>
                                <input checked={typeManage == 1 ? true : false} className='wrap-insert-or-update-zone-item-check-item-radio' type='radio' name='typeManage' />
                                <label className='wrap-insert-or-update-zone-item-check-item-label'>Tỉnh/thành</label>
                            </div>
                            <div onClick={this.onChangeTypeManage(2)} className='wrap-insert-or-update-zone-item-check-item'>
                                <input checked={typeManage == 2 ? true : false} className='wrap-insert-or-update-zone-item-check-item-radio' type='radio' name='typeManage' />
                                <label className='wrap-insert-or-update-zone-item-check-item-label'>Phường/xã</label>
                            </div>
                        </div>
                        <p className='form-error-message'>{errors.manage || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Tỉnh/Thành</label>
                    <div className='wrap-insert-or-update-zone-item-box'>
                        <Select
                            labelMark={provinceName}
                            isDisable={false}
                            className='css-select-border'
                            name="provinceId"
                            title='Chọn Tỉnh/Thành'
                            data={provinceOptions}
                            labelName='provinceName'
                            val='id'
                            handleChange={this.onChangeSelect('provinceId')}
                        />
                        <p className='form-error-message'>{errors.provinceId || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Phường/Xã &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-box'>
                        <Select
                            ref={ref => this.redSelect1 = ref}
                            isDisable={isDisableSelectWard}
                            className='css-select-border '
                            name="wardId"
                            title='Chọn Phường/Xã'
                            data={_wardssort}
                            defaultValue={wardFilters[0]}
                            labelName='wardName'
                            val='id'
                            handleChange={this.onChangeSelect('wardId')}
                        />
                        <p className='form-error-message'>{errors.wardId || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-add'>
                    {typeManage != 1 ? (
                        <button onClick={this.onAddArea} className='wrap-insert-or-update-zone-add-button'>
                            <img className='wrap-insert-or-update-zone-add-button-icon' src={IconAdd} />
                            Thêm
                        </button>
                    ) : null
                    }
                </div>{typeManage != 1 ? (
                    <div className='wrap-insert-or-update-zone-area'>
                        <label className='wrap-insert-or-update-zone-item-label'>Khu vực được chọn</label>
                        <p className='form-error-message'>{errors.zone || ''}</p>
                        <div className='wrap-insert-or-update-zone-area-list'>
                            {isShowArea ? <React.Fragment>
                                {zones.map(item => {
                                    return (
                                        <div key={item.id} className='wrap-insert-or-update-zone-area-list-item'>
                                            <p className='wrap-insert-or-update-zone-area-list-item-label'>
                                                {item.nameAddress} {item.wardName ? (item.wardName + ' -') : null} {item.provinceName}</p>
                                            <button onClick={this.onDeleteArea(item.id)} className='wrap-insert-or-update-zone-area-list-item-delete'>
                                                <img className='wrap-insert-or-update-zone-area-list-item-delete-icon' src={IconDelete} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </React.Fragment> : null}
                        </div>
                    </div>)
                    : null
                }
                <PopupMessage
                    popupMessage={popupMessage}
                    moduleTitle={'Thông báo'}
                    moduleBody={errMessage}
                    toggleModal={this.toggleModal}
                />
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.AreaDataStore }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(areaDataAction, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InsertOrUpadte);