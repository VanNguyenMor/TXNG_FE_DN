import React, { Component } from "react";
import compose from 'recompose/compose';
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { ACCESS_LIST_HEADER } from "../../../helpers/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionField } from "../../../actions/FieldActions.js";
import { actionAccess } from "../../../actions/AccessActions";
import classes from './index.module.css';
import { handleGenTree } from "../../../helpers/trees";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import EditIcon from "../../../assets/img/buttons/edit.svg";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import MenuButton from "../../../assets/img/buttons/menu.png";
import HeaderChild from "components/Headers/HeaderChild.js";
import Pagination from "components/Pagination";
import HeaderTableBN from "components/HeaderTableBN";
import HeadTitleTable from "components/HeadTitleTable";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import SearchModal from "./SearchModal";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import UpdatePopupSizeXL from "../../../components/UpdatePopupSizeXL";
import WarningPopup from "../../../components/WarningPopup";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import PopupMessage from "../../../components/PopupMessage";
import CreateNewPopupBN from "../../../components/CreateNewPopupBN";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import { actionFieldType } from "../../../actions/FieldTypeAction";
import './Access.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// reactstrap components
import {
	Card,
	Table,
	Container,
	Row,
	Spinner,
	ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

class Access extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			dataInPopup: [],
			newData: [],
			newDataSelectAddNew: [],
			dataAll: [],
			dataAllFromAddNew: [],
			currentRow: [],
			errorInsert: {},
			errorUpdate: {},
			field: [],
			fieldAll: [],
			detail: null,
			newDetail: null,
			update: null,
			create: null,
			delete: null,
			isLoaded: null,
			status: null,
			open: false,
			openAddNew: false,
			message: '',
			history: [],
			headerTitle: ACCESS_LIST_HEADER,
			limit: LIMIT_ITEM_IN_PAGE,
			beginItem: 0,
			endItem: LIMIT_ITEM_IN_PAGE,
			totalElement: 0,
			listLength: 0,
			currentPage: 0,
			selected: [],
			fetching: false,
			fetchingUpdate: false,
			fetchingDelete: false,
			currentFilter: null,
			activeCreateSubmit: false,
			deleteItem: null,
			updateModal: false,
			warningPopupModal: false,
			collapseList: [],
			delmessage: '',
			filter: {
				"search": "",
				"filter": "",
				"orderBy": "",
				"page": null,
				"limit": null
			},
			fields: []
		};

		this.localData = null;
	}

	componentWillReceiveProps(nextProp) {
		const { fetching, fetchingUpdate, fetchingDelete, limit, currentFilter } = this.state;
		let { data } = nextProp.access;
		let newData = [];
		let collapseList = [];
		let fieldData = nextProp.field.data;
		let fieldDataParent = [];
		let haveRoot = false;

		if (fieldData !== this.state.field) {
			if (typeof (fieldData) !== 'undefined') {
				if (fieldData.field !== null) {
					if (typeof (fieldData.field) !== 'undefined') {
						fieldData.field.fields
							.filter(item => item.parentID === null)
							.map(item => haveRoot = true);

						if (haveRoot) {
							fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

							fieldDataParent.map((item, key) => {
								item['index'] = key + 1
							});
						} else {
							// Search Element in tree
							fieldData.field.fields.map((item, key, array) => (
								key === 0 && (item.parentID = null)
							));

							fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

							fieldDataParent.map((item, key) => {
								item['index'] = key + 1
							});
						}

						this.setState({
							//fieldAll: fieldData.field.fields,
							field: fieldDataParent,
							isLoaded: false,
							status: data.status,
							message: PLEASE_CHECK_CONNECT(data.message)
						});

					} else {
						this.setState({
							field: fieldDataParent,
							isLoaded: false,
							status: data.status,
							message: PLEASE_CHECK_CONNECT(data.message)
						});
					}
				}
			}
		}

		if (data !== this.state.data) {
			if (typeof (data) !== 'undefined') {
				if (typeof (data.access) !== 'undefined') {
					if (data.access !== null) {
						if (typeof (data.access.informations) !== 'undefined') {
							newData = data.access.informations;

							newData.map(item => (
								collapseList.push({ id: item.id, collapse: false })
							));

							newData.map((item, key) => {
								item['parentID'] = item.informID === null ? '' : item.informID
							});

							newData = handleGenTree(data.access.informations, 'name');
							newData.map((item, key) => {
								item['index'] = key + 1
							});

							this.setState({ data: [] });
							this.setState({
								data: newData,
								history: newData,
								dataAll: data.access.informations,
								selected: data.access.informations,
								collapseList: collapseList,
								listLength: newData.length,
								totalPage: Math.ceil(newData.length / limit),
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						} else {
							this.setState({
								data: [],
								history: [],
								dataAll: data.access.accesses,
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						}
					}
				}

				if (typeof (data.newinfo) !== 'undefined') {
					if (data.newinfo !== null) {
						if (data.status) {
							newData = this.state.history;
							newData = newData.filter(item => item.id === data.newinfo.id);

							this.setState({
								data: newData,
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						} else {
							this.setState({
								data: [],
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						}
					}
				}

				if (typeof (data.detail) !== 'undefined') {
					if (data.detail !== null) {
						if (data.status) {
							this.setState({ detail: null });
							this.setState({
								detail: data.detail,
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						} else {
							this.setState({
								detail: null,
								isLoaded: false,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						}
					}
				}

				if (typeof (data.accessPopup) !== 'undefined') {
					if (data.accessPopup !== null) {
						this.setState({
							dataInPopup: data.accessPopup,
							isLoaded: false,
							status: data.status,
							message: PLEASE_CHECK_CONNECT(data.message)
						});
					}
				}

				// if (typeof (data.create) !== 'undefined') {
				//   if (data.create !== null) {
				//     if (data.status && !fetching) {
				//       /* Fetch Summary */
				//       this.setState({ data: [] });
				//       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
				//       this.setState({ fetching: true });
				//     }

				//     this.setState({
				//       create: data.create,
				//       isLoaded: false,
				//       status: data.status,
				//       message: PLEASE_CHECK_CONNECT(data.message)
				//     });
				//   }
				// }

				// if (typeof (data.update) !== 'undefined') {


				//   if (data.status && !fetchingUpdate) {
				//     setTimeout(() => {
				//       /* Fetch Summary */
				//       this.setState({ data: [] });
				//       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
				//       this.setState({ fetchingUpdate: true });
				//     }, 1000);
				//   }

				//   this.setState({
				//     update: data.update,
				//     isLoaded: false,
				//     status: data.status,
				//     message: PLEASE_CHECK_CONNECT(data.message)
				//   });

				// }

				// if (typeof (data.delete) !== 'undefined') {
				//   if (data.status == true && !fetchingDelete) {
				//     setTimeout(() => {
				//       /* Fetch Summary */
				//       this.setState({ data: [] });
				//       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
				//       this.setState({ fetchingDelete: true });
				//     }, 1000);
				//   }
				//   if (data.status != true) {
				//     this.setState({ delmessage: PLEASE_CHECK_CONNECT(data.message) })
				//     this.toggleModal('popupMessage');
				//   }
				//   this.setState({
				//     update: data.update,
				//     isLoaded: false,
				//     status: data.status,
				//     message: PLEASE_CHECK_CONNECT(data.message)
				//   });
				// }
			}
		}
	}


	// componentWillMount() {
	//   const { requestFieldStore } = this.props;

	//   const { field, currentFilter } = this.state;

	//   /* Fetch Summary */
	//   // this.fetchSummary(JSON.stringify({

	//   //   "search": "",
	//   //   "filter": currentFilter,
	//   //   "orderBy": "",
	//   //   "page": null,
	//   //   "limit": null
	//   // }));

	//   // requestFieldStore(JSON.stringify({
	//   //   "search": "",
	//   //   "filter": "",
	//   //   "orderBy": "",
	//   //   "page": null,
	//   //   "limit": null
	//   // }));
	// }

	componentDidMount() {
		const { field, currentFilter } = this.state;
		// console.log(currentFilter)
		const { requestFieldStore, requestFieldTypeStore, requestFieldHaveAccessStore, requestFieldAll } = this.props;
		const data = {
			"search": "",
			"filter": "",
			"orderBy": "",
			"page": null,
			"limit": null

		}

		// requestFieldStore(JSON.stringify({ data })).then(res => {
		//   //console.log(res.data.data.fields[0].id)
		//   //this.setState({ currentFilter: res.data.data.fields[0].id })
		//   this.fetchSummary(JSON.stringify({
		//     "search": "",
		//     // "filter": res.data.data.fields[0].id,
		//     "filter": "",
		//     "orderBy": "",
		//     "page": null,
		//     "limit": null
		//   }));
		// }
		// )

		// this.fetchSummary(JSON.stringify({
		//   "search": "",
		//   "filter": currentFilter,
		//   "orderBy": "",
		//   "page": null,
		//   "limit": null
		// }));

		this.getFieldHaveAccessStore();

		requestFieldTypeStore({});
	}

	componentDidUpdate() {
		// This method is called when the route parameters change
		this.closeStatusModal();
	}

	fetchSummary = (data) => {
		const { requestAccessStore } = this.props;

		requestAccessStore(data);
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

	clearDay = () => {
		this.setState({ data: [] })
	}

	renderTreeLine = (nodelv) => {
		let line = '';

		for (let i = 0; i < nodelv; i++) {
			line += '-';
		}

		return line;
	}

	// toggleModal = (state) => {
	//   this.setState({
	//     [state]: !this.state[state],
	//     detail: null
	//   });
	// };
	toggleModal = (state, type) => {
		if (this.state[state] && type == 1) {
			return;
		} else {

			this.setState({
				[state]: !this.state[state],
				detail: null,
				errorUpdate: {},
				errorInsert: {},
				newData: {},
				dataAllFromAddNew: []
			});
		}
		// if (state == 'createNewModal') {
		//   this.setState({
		//     [state]: true,
		//     detail: null,
		//     errorUpdate: {},
		//     errorInsert: {},
		//     newData: {},
		//     dataAllFromAddNew:[]
		//   });
		//   if (type == 100) {
		//     this.setState({
		//       [state]: !this.state[state],
		//       detail: null,
		//       errorUpdate: {},
		//       errorInsert: {},
		//       newData: {},
		//       dataAllFromAddNew:[]
		//     });
		//   }
		// }
	};

	renderTable = (data, isDisableEdit, isDisableDelete) => {
		const { beginItem, endItem, collapseList, currentFilter, fieldAll } = this.state;
		let list = [];
		let parentid = [];
		let autoIndex = 0;
		let childLine = '-';
		let dataMapth = [];
		let fieldName = [];

		data.filter((item, key) => key >= beginItem && key < endItem);
		data.forEach(e => parentid.push(e.id));
		if (currentFilter) {
			fieldName = fieldAll.filter(item => item.id == currentFilter);

			dataMapth = data.filter((item) =>
				(item.fieldName.trim().toUpperCase() == ((fieldName[0] || {}).fieldName || '').trim().toUpperCase()))
		}

		const cb = (e, key, array) => {
			const renderClass = e.parentID.length === 0 ? (
				`${classes.treeParent}`
			) : (
				`${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
			);

			list.push(
				<tr
					key={autoIndex}
					parentid={e.parentID}
					currentid={e.id}
					index={autoIndex}
					className="table-hover-css"
				>
					<td className={`table-scale-col table-user-col-1 ${renderClass}`}>{autoIndex + 1}</td>
					<td><img src={e.image ? e.image : NoImg} style={{ width: 82, height: 82 }} /></td>
					<td style={{ textAlign: 'left' }} className={renderClass}>
						<span>{e.nodelv > 1 && this.renderTreeLine(e.nodelv)}</span>
						<span>{e.name}</span>
					</td>
					<td>{e.sortOrder}</td>
					<td><input type="checkbox" disabled checked={e.isRequired} /></td>
					<td><input type="checkbox" disabled checked={e.isQuarantine} /></td>
					<td><input type="checkbox" disabled checked={e.isHarvest} /></td>
					<td><input type="checkbox" disabled checked={e.isHarvest2} /></td>
					<td><input type="checkbox" disabled checked={e.isEvaluated} /></td>
					<td>
						{
							collapseList.filter(item => item.id === e.id)
								.map(ele => (
									<div>
										{isDisableEdit == true && isDisableDelete == true ? null : (
											<ButtonDropdown isOpen={ele.collapse} toggle={() => this.toggle(key, e.id)}>
												<DropdownToggle>
													<img src={MenuButton} />
												</DropdownToggle>
												<DropdownMenu>
													{isDisableEdit == true ? null : (
														<DropdownItem
															onClick={() => {
																this.toggleModal('updateModal');
																this.setState({ currentRow: e })
																this.handleOpenEdit(e.id);
															}}
														>
															Sửa
														</DropdownItem>
													)}
													{isDisableEdit == true || isDisableDelete == true ? null : (
														<DropdownItem divider />
													)}
													{isDisableDelete == true ? null : (
														<DropdownItem
															onClick={() => {
																this.toggleModal('warningPopupModal');
																this.setState({ deleteItem: e.id });
															}}
														>
															Xoá
														</DropdownItem>
													)}
												</DropdownMenu>
											</ButtonDropdown>
										)}
									</div>
								))
						}
						{/* <div className={classes.editArea}>
              <div
                className={classes.item}
                onClick={() => {
                  this.toggleModal('updateModal');
                  this.setState({ currentRow: e })
                  this.handleEditRow(e.id);
                }}
              >
                <img src={EditIcon} alt="Sửa" title="Sửa" />
              </div>
              <div
                className={classes.item}
                onClick={() => {
                  this.toggleModal('warningPopupModal');
                  this.setState({ deleteItem: e.id });
                }}
              >
                <img src={DeleteIcon} alt="Xoá" title="Xoá" />
              </div>
            </div> */}
					</td>
				</tr>
			);

			autoIndex++;
			e.children && e.children.forEach(cb);
		}

		dataMapth.forEach(cb);
		return list;
	}

	handleSelect = (value, name) => {
		// this.setState({dataInPopup:[]})
		const { requestAccessPopupStore } = this.props;
		requestAccessPopupStore(JSON.stringify({
			"search": "",
			"filter": value == "" ? "" : value,
			"orderBy": "",
			"page": null,
			"limit": null
		}))
		// .then(res => {
		//   if (res.data.status == 200) {
		//     this.setState({
		//       dataInPopup: res.data.data.informations,
		//       isLoaded: false
		//     })
		//   }
		// })
	}

	handleSelectIndex = (value, name) => {
		//let { currentFilter, field} = this.state;
		let { fields } = this.state;
		let fieldTypesCurrent;

		if (value) {
			this.fetchSummary(JSON.stringify({
				"search": "",
				"filter": value == "" ? "" : value,
				"orderBy": "",
				"page": null,
				"limit": null
			}));
			if (fields) {
				fieldTypesCurrent = (fields.filter(f => f.id == value))[0].fieldType
				this.setState({ currentFilter: value, fieldTypesCurrent });
			}
		} else {
			this.setState({ data: [], currentFilter: "", fieldTypesCurrent: "" })
		}

	}

	handleChangeFilter = (event) => {
		let { filter } = this.state;
		const ev = event.target;

		filter[ev['name']] = ev['value'];

		this.setState({ filter });
	}

	handleChangeSelectFilter = (value, name) => {
		let { filter } = this.state;

		filter[name] = value;
		this.setState({ filter });
	}

	handleSubmitSearchForm = () => {
		let { filter } = this.state;

		this.fetchSummary(JSON.stringify(filter));
	}

	handleCheckValidation = (status) => {
		this.setState({ activeCreateSubmit: status });
	}

	handleNewDataAddNew = (data, dataAllFromAddNew) => {

		this.setState({ newDataAddNew: data, dataAllFromAddNew });
		this.setState({ errorInsert: {} })
	}
	handleNewDataUpdate = (data, dataAllFromUpdate) => {
		this.setState({ newData: data, dataAllFromUpdate });
	}


	renderCreateModal = () => {
		const { data, field, errorInsert, currentFilter, dataInPopup, fieldAll, fieldTypesCurrent } = this.state;
		const { fieldType } = this.props;

		return (
			<AddNewModal
				field={field}
				fieldTypesCurrent={fieldTypesCurrent}
				fieldAll={fieldAll}
				data={dataInPopup}
				currentFilter={currentFilter}
				handleCheckValidation={this.handleCheckValidation}
				handleNewData={this.handleNewDataAddNew}
				handleSelect={this.handleSelect}
				errorInsert={errorInsert}
				localData={this.localData}
				fieldType={fieldType}
			/>
		);
	}

	getFieldHaveAccessStore = () => {
		this.props.requestFieldHaveAccessStore(JSON.stringify({
			"search": "",
			"filter": "",
			"orderBy": "",
			"page": null,
			"limit": null
		})).then(res => {
			const fields = (res.data || {}).fields || [];

			this.setState(previousState => {
				return {
					...previousState,
					fields,
					fieldAll: fields
				}
			});
		});
	}

	handleCreateInfoData = (value, closeForm, closePopup) => {
		this.localData = null;

		const { createAccess } = this.props;
		const bodyFormData = new FormData();
		const { newDataAddNew, dataAllFromAddNew } = this.state;
		const errorInsert = {};

		if (closePopup != 'closePopup') {
			this.localData = { ...newDataAddNew };
		}

		let dataCreate;
		if (newDataAddNew) {
			dataCreate = {
				FieldID: newDataAddNew.FieldID,
				InformID: newDataAddNew.InformID,
				Name: newDataAddNew.Name,
				sortOrder: newDataAddNew.sortOrder,
				files: newDataAddNew.files,
				isRequired: newDataAddNew.isRequired,
				isQuarantine: newDataAddNew.isQuarantine,
				isHarvest: newDataAddNew.isHarvest,
				isHarvest2: newDataAddNew.isHarvest2,
				isEvaluated: newDataAddNew.isEvaluated,
			}
		}

		if (!dataCreate.FieldID) {
			errorInsert['FieldID'] = 'Chưa chọn ngành nghề';
		}
		if (!dataCreate.Name) {
			errorInsert['Name'] = 'Tên truy xuất không được bỏ trống';
		}
		if ((dataCreate.Name || '').length > 255) {
			errorInsert['Name'] = 'Nhập tối đa 255 ký tự';
		}


		let dataFilter = []

		if (dataCreate.InformID) {

			dataAllFromAddNew.filter(x => x.id.trim() == dataCreate.InformID.trim()).map(
				item => {
					dataFilter.push(item)
				}
			)

			if (dataFilter != []) {
				if (dataFilter[0].parentID == "") {
					dataAllFromAddNew.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
						item => {
							dataFilter.push(item)
						}
					)
				} else {
					dataAllFromAddNew.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
						item => {
							dataFilter.push(item)
						}
					)
				}
			}
		} else {
			dataAllFromAddNew.filter(x => x.fieldParentID == x.fieldParentID && x.parentID == "").map(
				item => {
					dataFilter.push(item)
				}
			)

		}

		if (dataCreate.Name) {
			let flag = false;
			dataFilter.filter(item => item.name.trim().toUpperCase() === dataCreate.Name.trim().toUpperCase())
				.map(item => flag = true);
			if (flag == true) {
				errorInsert['Name'] = 'Tên truy xuất này đã có';
			}
		}
		this.setState(previousState => {
			return {
				...previousState,
				errorInsert
			}
		});
		if (Object.keys(errorInsert).length > 0) {
			this.setState(previousState => {
				return {
					...previousState,
					errorInsert
				}
			});

			return;
		}

		this.setState(previousState => {
			return {
				...previousState,
				errorInsert: {}
			}
		});

		if (closeForm) {
			closeForm();
		}

		Object.keys(dataCreate).forEach((key) => {
			bodyFormData.append(key, dataCreate[key])
		});
		// Add new Information

		createAccess(bodyFormData).then(response => {
			if (response.data.status == 200) {
				if (closePopup != 'closePopup') {
					this.toggleModal('createNewModal');
				}

				this.getFieldHaveAccessStore();

				if (this.state.currentFilter) {
					this.fetchSummary(JSON.stringify({
						"search": "",
						"filter": this.state.currentFilter,
						"orderBy": "",
						"page": null,
						"limit": null
					}));
				}
			} else {

				this.setState({ cremessage: PLEASE_CHECK_CONNECT(response.data.message) })
				this.toggleModal('popupMessage');
			}
		}
		);

		// Fetching
		this.setState({ fetching: false });
	}

	handleEditRow = (id) => {
		const { detailAccessByID } = this.props;

		detailAccessByID(id);
	}

	handleUpdateInfoData = (value) => {
		const { updateAccess } = this.props;
		const { newData, dataAll, currentRow, dataAllFromUpdate } = this.state;
		const bodyFormData = new FormData();
		const errorUpdate = {};

		this.setState(previousState => {
			return {
				...previousState,
				errorUpdate
			}
		});


		if (!newData.FieldID) {
			errorUpdate['FieldID'] = 'Chưa chọn ngành nghề';
		}
		if (!newData.Name) {
			errorUpdate['Name'] = 'Tên truy xuất không được bỏ trống';
		}
		if ((newData.Name || '').length > 255) {
			errorUpdate['Name'] = 'Nhập tối đa 255 ký tự';
		}
		let dataFilter = []

		if (value.InformID) {
			dataAllFromUpdate.filter(x => x.id.trim() == value.InformID.trim()).map(
				item => {
					dataFilter.push(item)
				}
			)
			if (dataFilter != []) {
				if (dataFilter[0].parentID == "") {
					dataAllFromUpdate.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
						item => {
							dataFilter.push(item)
						}
					)
				} else {
					dataAllFromUpdate.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
						item => {
							dataFilter.push(item)
						}
					)
				}
			}
		} else {
			dataAllFromUpdate.filter(x => x.fieldParentID == x.fieldParentID && x.parentID == "").map(
				item => {
					dataFilter.push(item)
				}
			)

		}

		let flag = false;
		if (newData.Name) {
			if (newData.Name.trim().toUpperCase().indexOf(currentRow.name.trim().toUpperCase()) === -1) {
				dataFilter.filter(item => item.name.trim().toUpperCase() === newData.Name.trim().toUpperCase())
					.map(item => flag = true);
			} else {
				flag = false;
			}
			if (flag == true) {
				errorUpdate['Name'] = 'Tên truy xuất này đã có';
			}
		}

		if (Object.keys(errorUpdate).length > 0) {

			this.setState(previousState => {
				return {
					...previousState,
					errorUpdate,
				}
			});

			return;
		}

		this.setState(previousState => {
			return {
				...previousState,
				errorUpdate: {},
				detail: null,
				updateModal: false
			}
		});

		Object.keys(newData).forEach((key) => {
			if (key == 'Image') {
				bodyFormData.append(key, newData[key] || '');
			} else {
				bodyFormData.append(key, newData[key]);
			}
		});

		updateAccess(bodyFormData).then(res => {
			if (res.status == 200) {
				this.getFieldHaveAccessStore();

				if (this.state.currentFilter) {
					this.fetchSummary(JSON.stringify({
						"search": "",
						"filter": this.state.currentFilter,
						"orderBy": "",
						"page": null,
						"limit": null
					}));
				}
			} else {
				this.setState({ cremessage: PLEASE_CHECK_CONNECT((res || {}).message) })
				this.toggleModal('popupMessage');
			}
		});
		this.setState({ fetchingUpdate: false });
	}

	handleDeleteRow = () => {
		const { deleteAccess } = this.props;
		let { deleteItem } = this.state;

		this.setState({ fetchingDelete: false });
		deleteAccess(deleteItem).then(res => {
			if (res.status == 200) {
				this.getFieldHaveAccessStore();

				if (this.state.currentFilter) {
					this.fetchSummary(JSON.stringify({
						"search": "",
						"filter": this.state.currentFilter,
						"orderBy": "",
						"page": null,
						"limit": null
					}));
				}
				toast.success("Xoá truy xuất thành công!");
			} else {
				this.setState({ cremessage: PLEASE_CHECK_CONNECT((res || {}).message) })
				this.toggleModal('popupMessage');
			}
		});
	}

	handleOpenEdit = (value) => {
		const { data, detail } = this.state;
		const { detailAccessByID } = this.props;

		detailAccessByID(value);
		// this.setState({ detail: value, newDetail: value });
		this.setState({ detail: detail, newDetail: value });
	}

	toggle = (el, val) => {
		let { collapseList } = this.state;

		collapseList.filter(item => item.id === val)
			.map(item => item.collapse = !item.collapse);

		this.setState({ collapseList });
	}

	render() {
		const {
			status,
			headerTitle,
			data,
			detail,
			field,
			fieldAll,
			message,
			isLoaded,
			beginItem,
			endItem,
			listLength,
			totalPage,
			totalElement,
			errorUpdate,
			currentFilter,
			activeCreateSubmit,
			newData,
			filter,
			updateModal,
			dataInPopup,
			warningPopupModal,
			delmessage,
			popupMessage,
			createNewModal,
			cremessage,
			fields
		} = this.state;
		const statusPopup = { status: status, message: message };
		const { fieldType } = this.props;

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
			ACCOUNT_CLAIM_FF.filter(x => x == "Access.Add").map(y => isDisableAdd = false)
			ACCOUNT_CLAIM_FF.filter(x => x == "Access.Edit").map(y => isDisableEdit = false)
			ACCOUNT_CLAIM_FF.filter(x => x == "Access.Delete").map(y => isDisableDelete = false)
		}

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
											<HeaderTableBN
												dataReload={() => {
													this.fetchSummary(
														JSON.stringify({
															"search": "",
															// "filter": res.data.data.fields[0].id,
															"filter": "",
															"orderBy": "",
															"page": null,
															"limit": null
														})
													);
													this.setState({ currentFilter: null })
												}}
												hideCreate={isDisableAdd == false ? false : true}
												hideSearch={true}
												searchForm={
													<SearchModal
														field={field}
														filter={filter}
														handleChangeFilter={this.handleChangeFilter}
														handleChangeSelectFilter={this.handleChangeSelectFilter}
													/>
												}
												typeSearch={
													<>
														<div className="w_input">
															<label className="form-control-label">
																Ngành nghề
															</label>
															<div>
																{/* <SelectTree
                                  //hidenTitle={true}
                                  name="fieldName"
                                  title='Chọn ngành nghề'
                                  data={fields}
                                  dataAll={fields}
                                  // disableParent={true}
                                  selected={currentFilter && currentFilter}
                                  labelName='fieldName'
                                  fieldName='fieldName'
                                  val='id'
                                  handleChange={this.handleSelectIndex}
                                /> */}
																<Select
																	name="fieldName"
																	title='Chọn ngành nghề'
																	labelName='fieldName'
																	// defaultValue={currentFilter}
																	data={fields}
																	val='id'
																	handleChange={this.handleSelectIndex}
																/>
															</div>
														</div>
													</>
												}
												// customComponent={
												//   <div className={classes.filterArea}>
												//     <label
												//       className="form-control-label"
												//     >
												//       Ngành nghề
												//     </label>

												//     <SelectTree
												//       //hidenTitle={true}
												//       name="fieldName"
												//       title='Chọn ngành nghề'
												//       data={fields}
												//       dataAll={fields}
												//       // disableParent={true}
												//       selected={currentFilter}
												//       labelName='fieldName'
												//       fieldName='fieldName'
												//       val='id'
												//       handleChange={this.handleSelectIndex}
												//     />
												//   </div>
												// }
												handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
												moduleTitle='Thêm truy xuất'
												moduleBody={this.renderCreateModal()}
												activeSubmit={activeCreateSubmit}
												newData={newData}
												handleCreateInfoData={this.handleCreateInfoData}
											/>

											{/* Table */}
											<Card className="shadow">
												<Table className="align-items-center tablecs table-css-access" responsive>
													<HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
														0: 'table-scale-col table-user-col-1'
													}} />

													<tbody>
														{
															Array.isArray(data) && (
																this.renderTable(data, isDisableEdit, isDisableDelete)
															)
														}
													</tbody>
												</Table>
											</Card>

											{/* Pagination */}
											{
												// Page of Table
												// data.length > 0 && (
												//     <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick}/>
												//   )
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


							<CreateNewPopupBN
								newData={newData}
								createNewModal={createNewModal}
								moduleTitle='Thêm truy xuất'
								type100={true}
								moduleBody={this.renderCreateModal()}
								toggleModal={this.toggleModal}
								activeSubmit={activeCreateSubmit}
								handleCreateInfoData={(data, beta, close) => {
									this.handleCreateInfoData(data, () => {
										this.setState({
											createNewModal: false
										});
									}, close);
								}}
							/>

							{
								detail !== null && (
									<UpdatePopupSizeXL
										moduleTitle='Cập nhật truy xuất'
										moduleBody={
											<UpdateModal
												currentFilter={currentFilter}
												detail={detail}
												field={field}
												fieldType={fieldType}
												fieldAll={fieldAll}
												informData={dataInPopup}
												errorUpdate={errorUpdate}
												handleCheckValidation={this.handleCheckValidation}
												handleNewData={this.handleNewDataUpdate}
												handleNewDetail={this.handleNewDetail}
												handleSelect={this.handleSelect}
											/>}
										newData={newData}

										updateModal={updateModal}
										toggleModal={this.toggleModal}
										activeSubmit={activeCreateSubmit}
										handleUpdateInfoData={this.handleUpdateInfoData}
									/>
								)
							}

							<WarningPopup
								moduleTitle='Thông báo'
								moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
								warningPopupModal={warningPopupModal}
								toggleModal={this.toggleModal}
								handleWarning={this.handleDeleteRow}
							/>
							{delmessage ? (
								<PopupMessage
									popupMessage={popupMessage}
									moduleTitle={'Thông báo'}
									moduleBody={message}
									toggleModal={this.toggleModal}
								/>
							) : null}
							{cremessage ? (
								<PopupMessage
									popupMessage={popupMessage}
									moduleTitle={'Thông báo'}
									moduleBody={cremessage}
									toggleModal={this.toggleModal}
								/>
							) : null}
							<ToastContainer
								position="top-center"
								autoClose={3000}
							/>
						</Container>
					</div>
				}
			</>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		access: state.AccessStore,
		field: state.FieldStore,
		fieldType: state.FieldTypeStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionAccess, dispatch),
		...bindActionCreators(actionField, dispatch),
		...bindActionCreators(actionFieldType, dispatch)
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(Access);
