import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Guid } from 'guid-typescript';

import { areaRoleAction } from "../../../actions/AreaRoleAction";

import Select from "components/Select";
import PopupMessage from "../../../components/PopupMessage";
import '../../../assets/css/page/insert_or_update_role_zone.css';

import IconAdd from '../../../assets/img/buttons/add.svg';
import IconDelete from '../../../assets/img/buttons/delete.png';

class InsertOrUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            typeManage: -1,
            zoneId: null,
            zones: [],
            isShowArea: true,
            id: null,
            zoneName: null,
            roleName: null,
            errMessage: ''
        }

        this.redSelect = null;
    }

    componentWillUnmount() {
        // this.fetchSummary(JSON.stringify({
        //     "search": "",
        //     "filter": "",
        //     "orderBy": "",
        //     "page": null,
        //     "limit": null
        // }));
        // const { getListRole } = this.props;

        // getListRole({
        //     "search": "",
        //     "filter": "",
        //     "orderBy": "",
        //     "page": null,
        //     "limit": null
        // }).then(res => {
        //     console.log(res, 111);
        // })

        // this.setState(previousState => {
        //     return {
        //         ...previousState,
        //         typeManage: -1,
        //         zoneId: null,
        //         zones: [],
        //         isShowArea: true,
        //         id: null,
        //         zoneName: null,
        //         roleName: null,
        //     }
        // });

    }

    async componentDidMount() {
        const { getDetailArea, getListRole, getListZone, onHandleChangeValue, id, data } = this.props;

        if (onHandleChangeValue) {
            onHandleChangeValue(this.state);
        }

        if (id) {
            const result = await getDetailArea({ id });

            const data = ((result || {}).data || {}).data || null;


            if (!data) {


                this.setState({
                    errMessage: 'Không tìm thấy phân quyền dữ liệu này'
                })

                return;
            }

            const zones = ((data || {}).zones || []).map(item => {

                return {
                    id: item.id,
                    zoneId: item.id,
                    zoneName: item.zoneName
                }
            });

            if ([1, 2, 3].includes(data.level)) {
                this.onChangeTypeManage(data.level)(zones);
            }

            this.setState(previousState => {
                return {
                    ...previousState,
                    id: data.id,
                    roleId: data.roleID,
                    typeManage: data.level,
                    roleName: data.roleName,
                    zones,
                    zoneId: data.zoneIDs
                }
            }, () => {
                if (onHandleChangeValue) {
                    onHandleChangeValue(this.state);
                }
            });
        }

        getListRole({
            "search": "",
            "filter": "",
            "orderBy": "",
            "page": null,
            "limit": null
        }).then(res => {

            // if (res.data.status === 200) {
            //     // console.log(res.data);
            // }
        });
    }

    onChangeTypeManage = type => async () => {
        if (this.redSelect) {
            this.redSelect.resetValue();
        }

        this.setState({ zones: [] })
        const result = await this.props.getListZone(JSON.stringify(type));

        const data = ((result.data || {}).data || {}).zones || [];

        let zoneId = null;
        let zoneName = null;

        if (data.length <= 0) {
            // alert('Cấp quản lý này chưa có vùng dữ liệu');
            this.setState({
                errMessage: 'Cấp quản lý này chưa có vùng dữ liệu'
            })
            //this.toggleModal('popupMessage')

        } else {
            const zone = null;

            if (zone) {
                zoneId = zone.id;
                zoneName = zone.zoneName;
            }
            this.setState(previousState => {
                return {
                    ...previousState,
                    errMessage: '',
                }
            }
            )
        }

        this.setState(previousState => {
            return {
                ...previousState,
                //errMessage: '',
                typeManage: type,
                //zones: data || [],
                zoneName,
                zoneId
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
        //console.log(this.state.zoneName)
    }

    onChangeSelect = name => value => {
        let roleName = this.state.roleName;
        let zoneName = this.state.zoneName;

        if (name == 'roleId') {
            roleName = null;
        } else if (name == 'zoneId') {
            zoneName = null;
        }

        this.setState(previousState => {
            return {
                ...previousState,
                errMessage: '',
                [name]: value,
                roleName,
                zoneName
            }
        }, () => {
            if (this.props.onHandleChangeValue) {
                this.props.onHandleChangeValue(this.state);
            }
        });
    }

    onAddArea = () => {
        const { zoneId, zones: zoneDetails } = this.state;
        const { areas: _zones, onHandleChangeValue } = this.props;

        const zones = [...this.state.zones];

        if (!zoneId) {
            // alert('Bạn vui lòng chọn vùng');

            this.setState({
                errMessage: 'Bạn vui lòng chọn vùng'
            })
            //this.toggleModal('popupMessage')
            return;
        }

        const zoneDetail = zoneDetails.find(p => p.zoneId == zoneId);

        if (zoneDetail) {
            // alert('Bạn đã chọn vùng này');

            this.setState({
                errMessage: 'Bạn đã chọn vùng này'
            })
            //this.toggleModal('popupMessage')
            return;
        }

        const zone = _zones.find(p => p.id == zoneId);

        if (!zone) {
            // alert('Không tìm thấy vùng này');

            this.setState({
                errMessage: 'Không tìm thấy vùng này'
            })
            //this.toggleModal('popupMessage')
            return;
        }

        zones.push({
            id: Guid.create().toString(),
            zoneId: (zone || {}).id || '',
            zoneName: (zone || {}).zoneName || ''
        });

        this.setState(previousState => {
            return {
                ...previousState,
                errMessage: '',
                zones
            }
        }, () => {
            if (onHandleChangeValue) {
                onHandleChangeValue(this.state);
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
            // alert('Không tìm thấy vùng này');
            this.setState({
                errMessage: 'Không tìm thấy vùng này'
            })
            //this.toggleModal('popupMessage')
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

    render() {
        const { roleName, zoneName, isShowArea, typeManage, zones, popupMessage, errMessage, data } = this.state;
        const { errors, roles, areas } = this.props;

        const zoneFilters = zones.map(p => p.zoneId);
        const _zones = (areas || []).filter(p => zoneFilters.filter(m => m == p.id).length === 0);


        roles.sort((a, b) => {
            return new Date(b.name).getTime() -
                new Date(a.name).getTime()
        }).reverse();

        //console.log(errMessage)
        return (
            <div className='wrap-insert-or-update-zone'>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Nhóm quyền &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-box'>
                        <Select
                            labelMark={roleName}
                            className='wrap-insert-or-update-zone-item-select'
                            name="roleId"
                            title='Chọn nhóm quyền'
                            data={roles}
                            labelName='name'
                            val='id'
                            handleChange={this.onChangeSelect('roleId')}
                        />
                        <p className='form-error-message'>{errors.roleId || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Cấp quản lý &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-check' style={{ display: 'block', width: '100%', height: '100%' }}>
                        <div className='wrap-insert-or-update-zone-item-box-check' style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div onClick={this.onChangeTypeManage(1)} className='wrap-insert-or-update-zone-item-check-item'>
                                <input checked={typeManage == 1 ? true : false} className='wrap-insert-or-update-zone-item-check-item-radio' type='radio' name='typeManage' />
                                <label className='wrap-insert-or-update-zone-item-check-item-label'>Tỉnh/thành</label>
                            </div>
                            <div onClick={this.onChangeTypeManage(2)} className='wrap-insert-or-update-zone-item-check-item'>
                                <input checked={typeManage == 2 ? true : false} className='wrap-insert-or-update-zone-item-check-item-radio' type='radio' name='typeManage' />
                                <label className='wrap-insert-or-update-zone-item-check-item-label'>Quận/huyện</label>
                            </div>
                            {/* <div onClick={this.onChangeTypeManage(3)} className='wrap-insert-or-update-zone-item-check-item'>
                                <input checked={typeManage == 3 ? true : false} className='wrap-insert-or-update-zone-item-check-item-radio' type='radio' name='typeManage' />
                                <label className='wrap-insert-or-update-zone-item-check-item-label'>Phường/xã</label>
                            </div> */}
                        </div>
                        <p className='form-error-message'>{errors.manage || ''}</p>
                        {errMessage != '' ? (
                            <p className='form-error-message'>{errMessage}</p>
                        ) : null
                        }
                    </div>
                </div>
                <div>

                </div>
                <div className='wrap-insert-or-update-zone-item'>
                    <label className='wrap-insert-or-update-zone-item-label'>Vùng quản lý &nbsp;<b style={{ color: 'red' }}>*</b></label>
                    <div className='wrap-insert-or-update-zone-item-box'>
                        <Select
                            ref={ref => this.redSelect = ref}
                            //labelMark={zoneName}
                            className='wrap-insert-or-update-zone-item-select'
                            name="zoneId"
                            title='Chọn vùng'
                            data={_zones}
                            labelName='zoneName'
                            val='id'
                            handleChange={this.onChangeSelect('zoneId')}
                        />
                        <p className='form-error-message'>{errors.zoneId || ''}</p>
                    </div>
                </div>
                <div className='wrap-insert-or-update-zone-add'>
                    <button type='button' onClick={this.onAddArea} className='wrap-insert-or-update-zone-add-button'>
                        <img className='wrap-insert-or-update-zone-add-button-icon' src={IconAdd} />
                        Thêm
                    </button>
                </div>
                <div className='wrap-insert-or-update-zone-area'>
                    <label className='wrap-insert-or-update-zone-item-label'>Vùng được chọn</label>
                    <p className='form-error-message'>{errors.zone || ''}</p>
                    <div className='wrap-insert-or-update-zone-area-list'>
                        {isShowArea ? <React.Fragment>
                            {zones.map(item => {
                                return (
                                    <div key={item.id} className='wrap-insert-or-update-zone-area-list-item'>
                                        <p className='wrap-insert-or-update-zone-area-list-item-label'>{item.zoneName}</p>
                                        <button onClick={this.onDeleteArea(item.id)} className='wrap-insert-or-update-zone-area-list-item-delete'>
                                            <img className='wrap-insert-or-update-zone-area-list-item-delete-icon' src={IconDelete} />
                                        </button>
                                    </div>
                                )
                            })}
                        </React.Fragment> : null}
                    </div>
                </div>
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
    return { ...state.AreaRoleStore }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(areaRoleAction, dispatch),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InsertOrUpdate);