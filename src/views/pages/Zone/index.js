import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT,  } from "../../../services/Common";
import { ZONE_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionZoneCreators } from "../../../actions/ZoneListActions";
import { actionLocationCreators } from "../../../actions/LocationListAction";
import { areaDataAction } from "../../../actions/AreaDataAction";
import classes from './index.module.css';
import './zone.css'
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import SearchModal from "./SearchModal";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import WarningPopup from '../../../components/WarningPopup';
import CreateNewPopup from "../../../components/CreateNewPopup";
import PopupMessage from "../../../components/PopupMessage";


// reactstrap components
import {
	Card,
	Table,
	Container,
	Row,
	Spinner,
	ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import InsertOrUpdate from "./InsertOrUpdate.js";

import Message, { TYPES } from '../../../components/message';

import { getErrorMessageServer } from "utils/errorMessageServer.js";

class Zone extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			detail: [],
			update: [],
			create: [],
			delete: [],
			currentRow: [],
			isLoaded: null,
			status: null,
			open: false,
			openAddNew: false,
			message: '',
			errMessage: '',
			history: [],
			roles: [],
			zones: [],
			editStatus: true,
			district: [],
			districtList: [],
			province: [],
			ward: [],
			provinceIDCurrent: null,
			headerTitle: ZONE_HEADER,
			limit: LIMIT_ITEM_IN_PAGE,
			beginItem: 0,
			endItem: LIMIT_ITEM_IN_PAGE,
			totalElement: 0,
			listLength: 0,
			currentPage: 0,
			filter: {
				"search": "",
				"filter": "",
				"orderBy": "",
				"page": null,
				"limit": null
			},
			dataInsert: {},
			errorInserts: {},
			isShowForEdit: false,
			editId: null,
			warningPopupModal: false,
			deleteId: null
		};
	}

	componentWillReceiveProps(nextProp, nextState) {
		const { getWardList } = this.props;
		const { limit } = this.state;
		const { zone, location } = nextProp;
		let { province, deleteItemCurrent } = this.state;
		let zoneData = null;
		let provinceData = null;
		let loactionData = null;

		let provinces = [];
		let districts = [];
		let wards = [];


		//Get Province
		if (location !== this.state.province) {
			if (typeof (location) !== 'undefined') {
				if (typeof (location.data) !== 'undefined') {
					provinceData = location.data;

					provinces = provinceData ? [provinceData] : [];

					if (typeof (provinceData) !== 'undefined') {
						if (typeof (provinceData.province) !== 'undefined') {
							province.push(provinceData.province);
							province = [...new Set(province)];

							this.setState({ province, isLoaded: provinceData.isLoading, status: provinceData.status, message: PLEASE_CHECK_CONNECT(provinceData.message) });
						}
					}
				}
			}
		}

		// Get District
		if (location !== this.state.district) {
			if (typeof (location) !== 'undefined') {
				if (typeof (location.data) !== 'undefined') {
					loactionData = location.data;

					districts = loactionData || [];

					if (typeof (loactionData) !== 'undefined') {
						if (typeof (loactionData.district) !== 'undefined') {
							if (Array.isArray(loactionData.district)) {
								loactionData.district.map(item => {
									item['show'] = true
								});
							}
							this.setState({ district: loactionData.district, districtList: loactionData.district, isLoaded: loactionData.isLoading, status: loactionData.status, message: PLEASE_CHECK_CONNECT(loactionData.message) });
						}
					}
				}
			}
		}

		//Get Ward
		if (location !== this.state.ward) {
			if (typeof (location) !== 'undefined') {
				if (typeof (location.data) !== 'undefined') {
					loactionData = location.data;

					wards = loactionData || [];

					if (typeof (loactionData) !== 'undefined') {
						if (typeof (loactionData.ward) !== 'undefined') {
							if (Array.isArray(loactionData.ward)) {
								loactionData.ward.map(item => {
									item['show'] = true
								});
							}
							this.setState({ ward: loactionData.ward, isLoaded: loactionData.isLoading, status: loactionData.status, message: PLEASE_CHECK_CONNECT(loactionData.message) });
						}
					}
				}
			}
		}

		if (zone !== this.state.zone) {
			if (typeof (zone) !== 'undefined') {
				if (typeof (zone.data) !== 'undefined') {
					zoneData = zone.data;
					if (typeof (zoneData) !== 'undefined') {
						if (typeof (zoneData.zone) !== 'undefined') {
							if (typeof (zoneData.zone.zones) !== 'undefined') {
								if (zoneData.zone.zones.length > 0) {
									zoneData.zone.zones.map((item, key) => (
										item['index'] = key + 1,
										item['collapse'] = false,
										item['zoneDetailName'] = []
										// Get Ward
										// item.zoneDetails.map(el => {

										// 	//getWardList(el.districtID)
										// })
									));
								}
							}

							this.setState({ data: zoneData.zone.zones, listLength: zoneData.zone.total, totalPage: Math.ceil(zoneData.zone.zones.length / limit), isLoaded: zoneData.isLoading, status: zoneData.status, message: PLEASE_CHECK_CONNECT(zoneData.message) });
						}

						if (typeof (zoneData.detail) !== 'undefined') {
							this.setState({ detail: zoneData.detail, isLoaded: zoneData.isLoading, status: zoneData.status, message: PLEASE_CHECK_CONNECT(zoneData.message) });
						}

						if (typeof (zoneData.create) !== 'undefined') {
							// Fetch Data
							if (zoneData.status) {
								this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
							}

							this.setState({ create: zoneData.create, isLoaded: zoneData.isLoading, status: zoneData.status, message: PLEASE_CHECK_CONNECT(zoneData.message) });
						}

						if (typeof (zoneData.delete) !== 'undefined') {
							// Fetch Data
							if (zoneData.status) {
								this.handleFetchDataDel(deleteItemCurrent);
							}

							this.setState({ delete: zoneData.delete, isLoaded: zoneData.isLoading, status: zoneData.status, message: PLEASE_CHECK_CONNECT(zoneData.message) });
						}
					}
				}
			}
		}
	}

	componentWillMount() {
		const { getProvinceList, getDistrictList, createZone } = this.props;

		// Get Province
		getProvinceList();

		// Get District
		getDistrictList();

		/* Fetch Summary */
		this.fetchSummary(JSON.stringify({
			"search": "",
			"filter": "",
			"orderBy": "",
			"page": null,
			"limit": null
		}));
	}

	componentDidUpdate() {
		// This method is called when the route parameters change
		this.closeStatusModal();
	}

	fetchSummary = (data) => {
		const { getAllZoneList } = this.props;

		getAllZoneList(data);
	}

	closeStatusModal = () => {
		const { status } = this.state;

		if (status || !status) {
			setTimeout(() => {
				this.setState({ status: null, isLoaded: false });
			}, LOADING_TIME);
		}
	}

	handlePageClick = (data) => {
		let { limit, beginItem, endItem } = this.state;
		let selected = data.selected;
		let offset = Math.ceil(selected * limit);
		let total = 0;

		beginItem = offset;
		endItem = offset + limit;

		this.state.data.map((item, key) => (
			key >= beginItem && key < endItem && total++
		));

		if (selected > 0) {
			total = (selected * limit) + total;
		} else total = total;

		this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
	};

	handleChangeFilter = (event) => {
		let { filter } = this.state;
		const ev = event.target;

		filter[ev['name']] = ev['value'];
		this.setState({ filter });
	}

	handleSubmitSearchForm = () => {
		let { filter } = this.state;
		const { getAllZoneList } = this.props;

		filter.search = filter.zoneName;
		getAllZoneList(JSON.stringify(filter));
	}

	handleModal = (stutus, openModal, closeModal) => {
		if (stutus || this.state.isShowForEdit) {
			closeModal();
		} else {
			openModal();
		}

		this.setState(previousState => {
			return {
				...previousState,
				isShowForEdit: false,
				editId: null
			}
		});
	}

	checkDataInsert = isCheck => {
		let { data } = this.state;
		if (!isCheck) {
			return {};
		}

		const { dataInsert, currentRow } = this.state;

		const name = dataInsert.name;
		const typeManage = dataInsert.typeManage;
		const zones = dataInsert.zones || [];
		const provinceId = dataInsert.provinceId;
		const districtId = dataInsert.districtId;
		const wardId = dataInsert.wardId

		const errorInserts = {};

		if (!name) {
			errorInserts.name = 'Tên vùng không được bỏ trống';
		}
		if (dataInsert.id) {
			if (name) {
				let flag = false;
				if (name.trim().indexOf(currentRow.zoneName.trim()) === -1) {
					data.filter(item => item.zoneName === name.trim())
						.map(item => flag = true);
				} else {
					flag = false;
				}
				if (flag == true) {
					errorInserts.name = 'Tên vùng này đã có';
				}
			}
		} else {
			if (name) {
				let flag = false;
				data.filter(item => item.zoneName === name.trim())
					.map(item => flag = true);
				if (flag == true) {
					errorInserts.name = 'Tên vùng này đã có';

				}
			}
		}
		if (name && (name || '').length > 255) {
			errorInserts.name = 'Nhập tối đa 255 ký tự';
		}

		if (![1, 2, 3].includes(typeManage)) {
			errorInserts.manage = 'Chưa chọn cấp quản lý';
		}

		if (!provinceId) {
			errorInserts.provinceId = 'Chưa chọn chọn tỉnh/thành';
		}

		if (zones.length <= 0 && typeManage != 1) {
			errorInserts.zone = 'Danh sách khu vực không được bỏ trống';
		}
		if (!districtId && (typeManage === 2 || typeManage === 3)) {
			errorInserts.districtId = "Quận huyện không được bỏ trống"
		}
		if (!wardId && typeManage === 3) {
			errorInserts.wardId = "Phường/xã không được bỏ trống"
		}

		return errorInserts;
	}
	toggleModal = (state, type) => {
		if (this.state[state] && type == 1) {
			return;
		} else {
			this.setState({
				[state]: !this.state[state],
				detail: null,
				errorUpdate: {}
			});
		}
	};
	onConfirm = (toggleModal, closePopup) => {
		const { dataInsert, data, currentRow } = this.state;

		const name = dataInsert.name;
		const typeManage = dataInsert.typeManage;
		const zones = dataInsert.zones || [];
		const provinceId = dataInsert.provinceId;
		const id = dataInsert.id;

		const errorInserts = this.checkDataInsert(true);

		this.setState(previousState => {
			return {
				...previousState,
				errorInserts
			}
		});

		if (Object.keys(errorInserts).length > 0) {
			return;
		}

		let zoneDetails = [];

		if (typeManage == 1) {

		} else {
			zoneDetails = zones.map(item => {
				return {
					zoneID: null,
					provinceID: item.provinceId,
					districtID: item.districtId,
					wardID: item.wardId,
				}
			});
		}

		if (id) {

			this.props.editArea({ id, zoneName: name.trim(), level: typeManage, provinceID: provinceId, description: '', zonesDetails: zoneDetails }).then(res => {
				const data = (res || {}).data || {};

				if (data.status == 200) {
					this.fetchSummary(JSON.stringify({
						"search": "",
						"filter": "",
						"orderBy": "",
						"page": null,
						"limit": null
					}));

					if (toggleModal) {
						toggleModal();
					}

					this.setState(previousState => {
						return {
							...previousState,
							isShowForEdit: false,
							editId: null
						}
					});

					//Message.show(TYPES.SUCCESS, 'Thông báo', 'Sửa vùng dữ liệu thành công');
				} else {
					const message = getErrorMessageServer(res);
					this.setState({ errMessage: message });
					this.toggleModal('popupMessage')
					//Message.show(TYPES.ERROR, 'Thông báo', message || 'Sửa vùng dữ liệu thất bại');
				}
			});
		} else {

			this.props.addArea({ zoneName: name.trim(), level: typeManage, provinceID: provinceId, description: '', zonesDetails: zoneDetails }).then(res => {
				const data = (res || {}).data || {};

				if (data.status == 200) {
					this.fetchSummary(JSON.stringify({
						"search": "",
						"filter": "",
						"orderBy": "",
						"page": null,
						"limit": null
					}));

					if (toggleModal) {
						toggleModal();
					}

					if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }

					// Message.show(TYPES.SUCCESS, 'Thông báo', 'Thêm vùng dữ liệu thành công');
				} else {
					const message = getErrorMessageServer(res);
					// this.setState({
					// 	errMessage: message
					// })

					this.setState({ errMessage: message });
					this.toggleModal('popupMessage')
					//Message.show(TYPES.ERROR, 'Thông báo', message || 'Thêm vùng dữ liệu thất bại');
				}
			});
		}
	}

	onHandleChangeValue = data => {
		this.setState(previousState => {
			return {
				...previousState,
				dataInsert: data
			}
		}, () => {
			const errorInserts = this.checkDataInsert();

			this.setState(previousState => {
				return {
					...previousState,
					errorInserts
				}
			});
		});
	}

	onEditZone = (id, item) => () => {
		this.setState(previousState => {
			return {
				...previousState,
				isShowForEdit: true,
				editId: id,
				currentRow: item
			}
		});
	}

	onDeleteZone = id => () => {
		this.setState(previousState => {
			return {
				...previousState,
				warningPopupModal: true,
				deleteId: id
			}
		});
	}

	toggleModalPopupDelete = () => {
		this.setState(previousState => {
			return {
				...previousState,
				warningPopupModal: false
			}
		});
	}
	toggle = (el, val) => {
		let { data } = this.state;

		data.filter(item => item.id === val)
			.map(item => item.collapse = !item.collapse);

		this.setState({ data });
	}
	handleDeleteRow = () => {
		this.props.deleteArea({ id: this.state.deleteId }).then(res => {
			this.setState(previousState => {
				return {
					...previousState,
					warningPopupModal: false
				}
			});

			const data = res.data;

			if (data.status == 200) {
				this.fetchSummary(JSON.stringify({
					"search": "",
					"filter": "",
					"orderBy": "",
					"page": null,
					"limit": null
				}));

				// Message.show(TYPES.SUCCESS, 'Thông báo', 'Xóa vùng dữ liệu thành công');
			} else {
				const message = getErrorMessageServer(res);
				this.setState({ errMessage: message });
				this.toggleModal('popupMessage')
				// Message.show(TYPES.ERROR, 'Thông báo', message || 'Xóa vùng dữ liệu thất bại');
			}
		});
	}

	render() {
		const {
			warningPopupModal,
			editId,
			isShowForEdit,
			errorInserts,
			status,
			headerTitle,
			data,
			message,
			isLoaded,
			beginItem,
			endItem,
			listLength,
			totalPage,
			totalElement,
			filter,
			popupMessage,
			errMessage,
			activeCreateSubmit,
			createNewModal
		} = this.state;
		const statusPopup = { status: status, message: message };
		let isDisableAdd = true;
		let isDisableEdit = true;
		let isDisableDelete = true;
		let ACCOUNT_CLAIM_FF = [];
		if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
			isDisableAdd = false;
			isDisableEdit = false;
			isDisableDelete = false;
		} else {
			ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

			ACCOUNT_CLAIM_FF.filter(x => x == "Zones.Add").map(y => isDisableAdd = false)
			ACCOUNT_CLAIM_FF.filter(x => x == "Zones.Edit").map(y => isDisableEdit = false)
			ACCOUNT_CLAIM_FF.filter(x => x == "Zones.Delete").map(y => isDisableDelete = false)
		}

		// console.log(data);

		return (
			<>
				{
					<div className={classes.wrapper}>
						<Container fluid>
							{
								isLoaded ? (
									<div style={{ display: 'table', margin: 'auto' }}>
										<Spinner style={{ width: '3rem', height: '3rem' }} />
									</div>
								) : (
									<Row>
										<div className="col">
											{/* Header */}
											<HeaderTable
												dataReload={() => this.fetchSummary(
													JSON.stringify({
														"search": "",
														"filter": "",
														"orderBy": "",
														"page": null,
														"limit": null
													}))}
												hideCreate={isDisableAdd == false ? false : true}
												searchForm={
													<SearchModal
														filter={filter}
														handleChangeFilter={this.handleChangeFilter}
													/>
												}
												moduleTitle={isShowForEdit ? 'Sửa vùng quản lý' : 'Thêm vùng quản lý'}
												moduleBody={
													<InsertOrUpdate
														id={editId}
														errors={errorInserts}
														onHandleChangeValue={this.onHandleChangeValue}
													/>}
												isShowForEdit={isShowForEdit}
												handleModal={this.handleModal}
												onConfirm={this.onConfirm}
												handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
											/>

											{/* Table */}
											<Card className="shadow">
												<Table className="align-items-center tablecs table-css-zone" responsive>
													<HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
														0: 'table-scale-col table-user-col-1'
													}} />

													<tbody>
														{
															Array.isArray(data) && (
																data
																	.filter((item, key) => key >= beginItem && key < endItem)
																	.map((item, key) => (
																		<tr key={key} className="table-hover-css">
																			<td className='table-scale-col table-user-col-1'>{item.index}</td>
																			<td style={{ textAlign: 'left' }} className='table-scale-col'>
																				<strong>{item.zoneName}</strong><br></br>
																				{item.description.split(',').map((item1, key) => (
																					<i>{item1}<br /></i>
																				))}
																			</td>
																			{/* <td style={{ textAlign: 'left' }} className='table-scale-col'> */}
																			{/* {item.description} */}
																			{/* {item.description.split(',').map((item1, key) => ( */}
																			{/* <span>{item1}<br /></span> */}
																			{/* ))} */}
																			{/* </td> */}
																			<td>
																				{isDisableEdit == true && isDisableDelete == true ? null : (
																					<ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
																						<DropdownToggle>
																							<img src={MenuButton} />
																						</DropdownToggle>
																						<DropdownMenu>
																							{isDisableEdit == false ? (
																								<DropdownItem
																									onClick={
																										this.onEditZone(item.id, item)
																									}
																								>
																									Sửa
																								</DropdownItem>
																							) : null}
																							{isDisableEdit == true || isDisableDelete == true ? null : (
																								<DropdownItem divider />
																							)
																							}
																							{isDisableDelete == false ? (
																								<DropdownItem
																									onClick={this.onDeleteZone(item.id)}
																								>
																									Xoá
																								</DropdownItem>
																							) : null}
																						</DropdownMenu>
																					</ButtonDropdown>
																				)}
																			</td>
																		</tr>
																	))
															)
														}
													</tbody>
												</Table>
											</Card>

											{/* Pagination */}
											{
												// Page of Table
												Array.isArray(data) && (
													<Pagination
														data={data}
														listLength={listLength}
														totalPage={totalPage}
														totalElement={totalElement}
														handlePageClick={this.handlePageClick} />
												)
											}
										</div>
									</Row>
								)
							}

							{
								//Set Alert Context
								setAlertContext(statusPopup)
							}

							{
								//Open Alert Context
								openAlertContext(statusPopup)
							}
						</Container>
						<WarningPopup
							moduleTitle='Thông báo'
							moduleBody={
								<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
									Bạn đồng ý xóa thông tin này?
								</p>}
							warningPopupModal={warningPopupModal}
							toggleModal={this.toggleModalPopupDelete}
							handleWarning={this.handleDeleteRow}
						/>

						<CreateNewPopup
							createNewModal={createNewModal}
							moduleTitle='Thêm vùng quản lý'
							type100={true}
							moduleBody={
								<InsertOrUpdate
									id={editId}
									errors={errorInserts}
									onHandleChangeValue={this.onHandleChangeValue}
								/>}
							toggleModal={this.toggleModal}
							activeSubmit={activeCreateSubmit}
							onConfirm={(data, close) => {
								this.onConfirm(data, close);
							}}
						/>

						<PopupMessage
							popupMessage={popupMessage}
							moduleTitle={'Thông báo'}
							moduleBody={errMessage}
							toggleModal={this.toggleModal}
						/>

					</div>
				}
			</>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		zone: state.ZoneStore,
		location: state.LocationStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionZoneCreators, dispatch),
		...bindActionCreators(actionLocationCreators, dispatch),
		...bindActionCreators(areaDataAction, dispatch)
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(Zone);
