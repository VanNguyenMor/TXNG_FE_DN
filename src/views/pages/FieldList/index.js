// import React, { Component } from "react";
// import compose from 'recompose/compose';
// import { setAlertContext, openAlertContext, removeDuplicates } from "../../../helpers/common.js";
// import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";
// import { FIELD_LIST_HEADER } from "../../../helpers/constant";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { actionField } from "../../../actions/FieldActions";
// import { actionFieldType } from "actions/FieldTypeAction.js";
// import { handleGenTree } from "../../../helpers/trees";
// import Validate from "react-validate-form";
// import { rules, validations } from "../../../helpers/validation";
// import EditIcon from "../../../assets/img/buttons/edit.svg";
// import DeleteIcon from "../../../assets/img/buttons/delete.png";
// import MenuButton from "../../../assets/img/buttons/menu.png";
// import HeaderChild from "components/Headers/HeaderChild.js";
// import Pagination from "components/Pagination";
// import HeaderTable from "components/HeaderTable";
// import HeadTitleTable from "components/HeadTitleTable";
// import SearchModal from "./SearchModal";
// import AddNewModal from "./AddNewModal";
// import UpdateModal from "./UpdateModal";
// import UpdatePopup from "../../../components/UpdatePopup";
// import WarningPopup from "../../../components/WarningPopup";
// import PopupMessage from "../../../components/PopupMessage";
// import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
// import classes from './index.module.css';
// import './custom.css';
// import CreateNewPopup from "../../../components/CreateNewPopup";
// import WarningPopupDel from "../../../components/WarningPopupDel";

// // reactstrap components
// import {
// 	Card,
// 	Table,
// 	Container,
// 	Row,
// 	Spinner,
// 	ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from "reactstrap";

// class FieldList extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			data: [],
// 			dataAll: [],
// 			currentRow: [],
// 			detail: null,
// 			newDetail: null,
// 			update: null,
// 			create: null,
// 			delete: null,
// 			isLoaded: null,
// 			status: null,
// 			statusCreate: null,
// 			open: false,
// 			openAddNew: false,
// 			message: '',
// 			delmessage: '',
// 			errorMessage: '',
// 			history: [],
// 			headerTitle: FIELD_LIST_HEADER,
// 			limit: LIMIT_ITEM_IN_PAGE,
// 			beginItem: 0,
// 			endItem: LIMIT_ITEM_IN_PAGE,
// 			totalElement: 0,
// 			listLength: 0,
// 			currentPage: 0,
// 			selected: [],
// 			fetching: false,
// 			fetchingUpdate: false,
// 			fetchingDelete: false,
// 			activeCreateSubmit: false,
// 			newData: [],
// 			deleteItem: null,
// 			updateModal: false,
// 			warningPopupModal: false,
// 			treeLevel: [],
// 			collapseList: [],
// 			popupMessage: null,
// 			errorInsert: {},
// 			errorUpdate: {},
// 			filter: {
// 				"search": "",
// 				"filter": "",
// 				"fieldName": "",
// 				"orderBy": "",
// 				"page": null,
// 				"limit": null
// 			},
// 			lockItem: '',
// 			warningPopupDelModal: false
// 		};
// 	}

// 	componentWillReceiveProps(nextProp) {
// 		const { fetching, fetchingUpdate, fetchingDelete, limit } = this.state;
// 		let { treeLevel } = this.state;
// 		let { data } = nextProp.field;
// 		let newData = [];
// 		let collapseList = [];
// 		let haveRoot = false;

// 		if (data !== this.state.data) {
// 			if (typeof (data) !== 'undefined') {
// 				if (typeof (data.field) !== 'undefined') {
// 					if (data.field !== null) {
// 						if (typeof (data.field.fields) !== 'undefined') {

// 							data.field.fields.map(item => {
// 								collapseList.push({ id: item.id, collapse: false, isLocked: item.islocked, fieldCode: item.fieldCode })
// 								if (item.islocked == true) {
// 									item['status'] = "Đã khóa"
// 								} else {
// 									item['status'] = "Chưa khóa"
// 								}
// 							});

// 							data.field.fields
// 								.filter(item => item.parentID === null)
// 								.map(item => haveRoot = true);

// 							if (haveRoot) {
// 								newData = handleGenTree(data.field.fields, 'fieldName');
// 								// debugger
// 								newData.map((item, key) => (
// 									item['index'] = key + 1
// 								));

// 								const cb = (e, key, array) => {
// 									treeLevel.push(e.nodelv);
// 									e.children && e.children.forEach(cb);
// 								}

// 								newData.forEach(cb);
// 								treeLevel = [...new Set(treeLevel)];
// 							} else {
// 								// Search Element in tree
// 								// data.field.fields.map((item, key, array) => (
// 								//   key === 0 && (item.parentID = null)
// 								// ));

// 								newData = handleGenTree(data.field.fields, 'fieldName');
// 								// debugger
// 								newData.map((item, key) => (
// 									item['index'] = key + 1
// 								));

// 								const cb = (e, key, array) => {
// 									treeLevel.push(e.nodelv);
// 									e.children && e.children.forEach(cb);
// 								}

// 								newData.forEach(cb);
// 								treeLevel = [...new Set(treeLevel)];
// 							}

// 							this.setState({ data: [] });
// 							this.setState({
// 								data: newData,
// 								dataAll: data.field.fields,
// 								collapseList: collapseList,
// 								selected: data.field.fields,
// 								treeLevel: treeLevel,
// 								listLength: newData.length,
// 								totalPage: Math.ceil(newData.length / limit),
// 								isLoaded: data.isLoading,
// 								status: data.status,
// 								message: PLEASE_CHECK_CONNECT(data.message)

// 							});
// 						} else {
// 							if (data.status != true) {
// 								this.setState({ errorMessage: PLEASE_CHECK_CONNECT(data.message) })
// 							}
// 							this.setState({
// 								data: [],
// 								dataAll: data.field.fields,
// 								isLoaded: data.isLoading,
// 								status: data.status,
// 								message: PLEASE_CHECK_CONNECT(data.message),
// 							});
// 						}
// 					}
// 				}

// 				if (typeof (data.create) !== 'undefined') {
// 					if (data.create !== null) {
// 						if (data.status && !fetching) {
// 							/* Fetch Summary */
// 							this.setState({ data: [] });
// 							this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
// 							this.setState({ fetching: true });
// 						} else {
// 							this.setState({
// 								create: data.create,
// 								isLoaded: data.isLoading,
// 								statusCreate: data.status,
// 								status: data.status,
// 								message: PLEASE_CHECK_CONNECT(data.message)
// 							});
// 						}
// 						// else this.toggleModal('popupMessage');

// 						this.setState({
// 							create: data.create,
// 							isLoaded: false,
// 							//statusCreate: data.status,
// 							status: data.status,
// 							message: PLEASE_CHECK_CONNECT(data.message)
// 						});

// 					}
// 				}

// 				if (typeof (data.update) !== 'undefined') {
// 					if (data.update !== null) {
// 						if (data.status && !fetchingUpdate) {
// 							// this.toggleModal('popupMessage');

// 							setTimeout(() => {
// 								/* Fetch Summary */
// 								this.setState({ data: [], fetchingUpdate: true });
// 								this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
// 							}, 500);
// 						}
// 						// else this.toggleModal('popupMessage');

// 						this.setState({
// 							update: data.update,
// 							isLoaded: false,
// 							status: data.status,
// 							message: PLEASE_CHECK_CONNECT(data.message)
// 						});
// 					}
// 				}

// 				if (typeof (data.delete) !== 'undefined') {
// 					if (data.status && !fetchingDelete) {
// 						setTimeout(() => {
// 							// this.toggleModal('popupMessage');

// 							/* Fetch Summary */
// 							this.setState({ data: [] });
// 							this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
// 							this.setState({ fetchingDelete: true });
// 						}, 1000);
// 					}
// 					// else this.toggleModal('popupMessage');
// 					if (data.status != true) {
// 						this.setState({ delmessage: PLEASE_CHECK_CONNECT(data.message) })
// 						this.toggleModal('popupMessage');
// 					}
// 					this.setState({
// 						delete: data.delete,
// 						isLoaded: false,
// 						status: data.status,
// 						message: PLEASE_CHECK_CONNECT(data.message)
// 					});
// 				}
// 			}
// 		}
// 	}

// 	componentWillMount() {
// 		/* Fetch Summary */
// 		this.fetchSummary(JSON.stringify({
// 			"search": "",
// 			"filter": "",
// 			"orderBy": "",
// 			"page": null,
// 			"limit": null
// 		}));

// 		this.props.requestFieldTypeStore({});
// 	}

// 	handleStyleStatus = (status) => {
// 		if (status === true) {
// 			return classes.lockStt;
// 		} else {
// 			return classes.noLockStt;
// 		}
// 	}

// 	componentDidUpdate() {
// 		// This method is called when the route parameters change
// 		this.closeStatusModal();
// 	}

// 	fetchSummary = (data) => {
// 		const { requestFieldStore } = this.props;

// 		requestFieldStore(data);
// 	}

// 	closeStatusModal = () => {
// 		const { status } = this.state;

// 		if (status || !status) {
// 			setTimeout(() => {
// 				this.setState({ status: null, isLoaded: false });
// 			}, LOADING_TIME);
// 		}
// 	}

// 	handlePageClick = (data) => {
// 		let { limit, beginItem, endItem } = this.state;
// 		let selected = data.selected;
// 		let offset = Math.ceil(selected * limit);
// 		let total = 0;

// 		beginItem = offset;
// 		endItem = offset + limit;

// 		this.state.data.map((item, key) => (
// 			key >= beginItem && key < endItem && total++
// 		));

// 		if (selected > 0) {
// 			total = (selected * limit) + total;
// 		} else total = total;

// 		this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
// 	};

// 	clearDay = () => {
// 		this.setState({ data: [] })
// 	}

// 	renderTreeLine = (nodelv) => {
// 		let line = '';

// 		for (let i = 0; i < nodelv; i++) {
// 			line += '-';
// 		}

// 		return line;
// 	}

// 	renderTable = (data, isDisableEdit, isDisableDelete, isDisableLock) => {
// 		let { beginItem, endItem, collapseList } = this.state;

// 		let list = [];
// 		let parentid = [];
// 		let autoIndex = 0;

// 		data.filter((item, key) => key >= beginItem && key < endItem);

// 		let index = 0;
// 		const cb = (e, key, array) => {
// 			index++;

// 			const renderClass = e.parentID.length === 0 ? (
// 				`${classes.treeParent}`
// 			) : (
// 				`${classes.treeChild}${parentid.includes(e.parentID) ? ` ${classes.childs}` : ` ${classes.childsItem}`}`
// 			);

// 			list.push(
// 				<tr
// 					key={autoIndex}
// 					parentid={e.parentID}
// 					currentid={e.id}
// 					index={autoIndex}
// 					className={`table-hover-css ${e.nodelv > 1 && 'nodelv'}`}
// 					nodelv={e.nodelv}
// 				>
// 					{/* <td className={renderClass}>{e.index}</td> */}
// 					<td className={`table-scale-col table-user-col-1 ${renderClass}`}>{index}</td>
// 					{/* <td style={{ textAlign: 'center', whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
// 						<span className={this.handleStyleStatus(e.islocked)}>{e.status}</span>
// 					</td> */}
// 					<td style={{ textAlign: "left", whiteSpace: 'normal' }} className={`table-scale-col cursor-unset`}>
// 						{e.fieldCode}
// 					</td>
// 					<td style={{ textAlign: 'left' }} className={renderClass}>
// 						<div>
// 							<span>
// 								{`${e.nodelv > 1 ? this.renderTreeLine(e.nodelv) : ''}`}
// 							</span>
// 							<span style={{ color: (e.parentID == null || e.parentID == "") ? '#000' : (e.islocked == true ? 'black' : 'red') }}>
// 								{` ${e.fieldName}`}</span>
// 						</div>
// 					</td>
// 					<td>
// 						{
// 							collapseList.filter(item => item.id === e.id)
// 								.map(ele => (
// 									<div>
// 										{e.parentID == null ||
// 											e.parentID == "" ||
// 											(ele.isLocked == true || (isDisableEdit == true && isDisableDelete == true)) ? null : (
// 											<ButtonDropdown isOpen={ele.collapse} toggle={() => this.toggle(key, e.id)}>
// 												<DropdownToggle>
// 													<img src={MenuButton} />
// 												</DropdownToggle>
// 												<DropdownMenu>
// 													{(!ele.isLocked && !isDisableLock) ? (
// 														<DropdownItem
// 															onClick={() => {
// 																this.toggleModal('warningPopupDelModal');
// 																this.setState({ lockItem: ele.id });
// 															}}
// 														>
// 															Khóa
// 														</DropdownItem>
// 													) : null}
// 													{(ele.isLocked == true || isDisableLock == true) ? null : (
// 														<DropdownItem divider />
// 													)}
// 													{((ele.fieldCode || '').length <= 5 || isDisableEdit == true) ? null : (
// 														<DropdownItem
// 															onClick={() => {
// 																this.toggleModal('updateModal');
// 																this.setState({ currentRow: e })
// 																this.handleOpenEdit(e);
// 															}}
// 														>
// 															Sửa
// 														</DropdownItem>
// 													)}
// 													{(ele.fieldCode || '').length <= 5 || isDisableEdit == true || isDisableDelete == true ? null : (
// 														<DropdownItem divider />
// 													)}
// 													{isDisableDelete == true ? null : (
// 														<DropdownItem
// 															onClick={() => {
// 																this.toggleModal('warningPopupModal');
// 																this.setState({ deleteItem: e.id });
// 															}}
// 														>
// 															Xoá
// 														</DropdownItem>
// 													)}
// 												</DropdownMenu>
// 											</ButtonDropdown>
// 										)}
// 									</div>
// 								))
// 						}


// 						{/* <div className={classes.editArea}>
// 						<div
// 							className={classes.item}
// 							onClick={() => {
// 							this.toggleModal('updateModal');
// 							this.setState({ currentRow: e })
// 							this.handleOpenEdit(e);
// 							}}
// 						>
// 							<img src={EditIcon} alt="Sửa" title="Sửa" />
// 						</div>

// 						<div
// 							className={classes.item}
// 							onClick={() => {
// 							this.toggleModal('warningPopupModal');

// 							this.setState({ deleteItem: e.id });
// 							}}
// 						>
// 							<img src={DeleteIcon} alt="Xoá" title="Xoá" />
// 						</div>
// 						</div>
// 						<span className={classes.lines}></span> */}
// 					</td>
// 				</tr>
// 			);

// 			autoIndex++;
// 			e.children && e.children.forEach(cb);
// 		}

// 		data.forEach(cb);

// 		return list;
// 	}

// 	handleChangeFilter = (event) => {
// 		let { filter } = this.state;

// 		const ev = event.target;

// 		filter[ev['name']] = ev['value'];

// 		this.setState({ filter });
// 	}

// 	handleSubmitSearchForm = () => {
// 		let { filter, dataAll } = this.state;
// 		const { requestFieldStore } = this.props;

// 		filter.search = filter.fieldName

// 		requestFieldStore(JSON.stringify(filter))

// 	}
// 	// clearFilter = () => {
// 	// 	const { filter } = this.state;
// 	// 	let clearFilter = {
// 	// 		"search": "",
// 	// 		"filter": "",
// 	// 		"orderBy": "",
// 	// 		"page": null,
// 	// 		"limit": null
// 	// 	}
// 	// 	this.setState({ filter: clearFilter })
// 	// }

// 	renderCreateModal = () => {
// 		const { data, errorInsert, errorMessage } = this.state;

// 		return (
// 			<AddNewModal
// 				field={data}
// 				handleCheckValidation={this.handleCheckValidation}
// 				handleNewData={this.handleNewDataIn}
// 				errorInsert={errorInsert}

// 			/>
// 		);
// 	}

// 	handleCheckValidation = (status) => {
// 		this.setState({ activeCreateSubmit: status });
// 	}

// 	handleNewData = (data) => {
// 		this.setState({ newData: data });
// 	}

// 	handleNewDataIn = (data) => {
// 		this.setState({ newDataIn: data });
// 	}

// 	closeForm = () => {
// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				errorInsert: {},
// 				newData: []
// 				//errorUpdate: {},
// 			}
// 		});

// 		this.setState({ newData: [] });
// 	}

// 	handleNewDetail = (name, data) => {
// 		const { detail } = this.state;
// 		let newDetail = {
// 			id: detail.id,
// 			fieldName: detail.fieldName,
// 			parentID: detail.parentID,
// 			fieldCode: detail.fieldCode,
// 		};

// 		if (name !== null) {
// 			newDetail[name] = data;
// 			this.setState({ newDetail });
// 		}
// 	}

// 	handleCreateInfoData = (value, closeForm, closePopup) => {
// 		const { createField } = this.props;
// 		const { dataAll, statusCreate, newDataIn } = this.state;
// 		const errorInsert = {};
// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				errorInsert
// 			}
// 		});

// 		let insertData = {}

// 		if (newDataIn) {
// 			insertData = {
// 				// fieldCode: newDataIn.fieldCode,
// 				fieldName: newDataIn.fieldName,
// 				parentID: newDataIn.parentID,
// 				fieldTypeId: newDataIn.fieldTypeId
// 			}
// 		}

// 		// if (!insertData.fieldCode) {
// 		// 	errorInsert['fieldCode'] = 'Mã ngành nghề không được bỏ trống';
// 		// }

// 		if (!insertData.fieldName) {
// 			errorInsert['fieldName'] = 'Tên ngành nghề không được bỏ trống';
// 		}

// 		if (!insertData.fieldTypeId) {
// 			errorInsert['fieldTypeId'] = 'Chưa chọn nhóm ngành nghề';
// 		}

// 		if (!insertData.parentID) {
// 			errorInsert['parentID'] = 'Chưa chọn thuộc ngành nghề';
// 		}

// 		let dataFilter = []
// 		let dataFilterChild = []
// 		if (insertData.parentID) {
// 			dataAll.filter(x => x.id == insertData.parentID).map(
// 				item => {
// 					dataFilter.push(item)
// 				}
// 			)
// 			if (dataFilter != []) {
// 				if (dataFilter[0].parentID == "") {
// 					dataAll.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
// 						item => {
// 							dataFilter.push(item);
// 							dataFilterChild.push(item);
// 						}
// 					)
// 					if (dataFilterChild != []) {
// 						for (let i = 0; i < dataFilterChild.length; i++) {
// 							dataAll.filter(x => x.parentID == dataFilterChild[i].id || x.id == dataFilterChild[i].parentID).map(
// 								item => {
// 									dataFilter.push(item);
// 								}
// 							)
// 						}
// 					}
// 				} else {
// 					dataAll.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
// 						item => {
// 							dataFilter.push(item)
// 						}
// 					)
// 				}
// 			}
// 		}

// 		// if (insertData.fieldName) {
// 		// 	let flag = false;

// 		// 	dataFilter.filter(item => item.fieldName.trim().toUpperCase() === insertData.fieldName.trim().toUpperCase())
// 		// 		.map(item => flag = true);

// 		// 	if (flag == true) {
// 		// 		errorInsert['fieldName'] = 'Tên ngành nghề này đã có';
// 		// 	}
// 		// }

// 		// let dataFilterCode = []
// 		// let dataFilterChildCode = []
// 		// if (insertData.parentID) {
// 		//   dataAll.filter(x => x.id == insertData.parentID).map(
// 		//     item => {
// 		//       dataFilterCode.push(item)
// 		//     }
// 		//   )
// 		//   if (dataFilterCode != []) {
// 		//     if (dataFilterCode[0].parentID == "") {
// 		//       dataAll.filter(x => x.parentID == dataFilterCode[0].id || x.id == dataFilterCode[0].parentID).map(
// 		//         item => {
// 		//           dataFilterCode.push(item);
// 		//           dataFilterChildCode.push(item);
// 		//         }
// 		//       )
// 		//       if (dataFilterChildCode != []) {
// 		//         for (let i = 0; i < dataFilterChildCode.length; i++) {
// 		//           dataAll.filter(x => x.parentID == dataFilterChildCode[i].id || x.id == dataFilterChildCode[i].parentID).map(
// 		//             item => {
// 		//               dataFilterCode.push(item);
// 		//             }
// 		//           )
// 		//         }
// 		//       }
// 		//     } else {
// 		//       dataAll.filter(
// 		//         x => x.parentID == dataFilterCode[0].id ||
// 		//           x.parentID == dataFilterCode[0].parentID ||
// 		//           x.id == dataFilterCode[0].parentID).map(
// 		//             item => {
// 		//               dataFilterCode.push(item)
// 		//             }
// 		//           )
// 		//     }
// 		//   }
// 		// }

// 		// if (insertData.fieldCode) {
// 		//   let flag = false;

// 		//   dataFilterCode.filter(item => {
// 		//     if (item.fieldCode) {
// 		//       return item.fieldCode.trim().toUpperCase() === insertData.fieldCode.trim().toUpperCase()
// 		//     }
// 		//   }
// 		//   )
// 		//     .map(item => flag = true);

// 		//   if (flag == true) {
// 		//     errorInsert['fieldCode'] = 'Mã ngành nghề này đã có';
// 		//   }
// 		// }


// 		if (insertData.fieldCode) {
// 			let flag = false;

// 			dataAll.filter(item => {
// 				if (item.fieldCode) {
// 					return item.fieldCode.trim().toUpperCase() === insertData.fieldCode.trim().toUpperCase()
// 				}
// 			}
// 			)
// 				.map(item => flag = true);

// 			if (flag == true) {
// 				errorInsert['fieldCode'] = 'Mã ngành nghề này đã có';
// 			}
// 		}

// 		if ((insertData.fieldName || '').length > 255) {
// 			errorInsert['fieldName'] = 'Nhập tối đa 255 ký tự';
// 		}
// 		// console.log(statusCreate)
// 		if (Object.keys(errorInsert).length > 0) {
// 			this.setState(previousState => {
// 				return {
// 					...previousState,
// 					errorInsert
// 				}
// 			});

// 			return;
// 		}

// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				errorInsert: {}
// 			}
// 		});

// 		if (closeForm) {
// 			closeForm();
// 		}

// 		createField(JSON.stringify(insertData)).then(res => {
// 			if (res.data.status == 200) {
// 				if (closePopup != 'closePopup') { this.toggleModal('createNewModal'); }
// 			}
// 		})
// 		this.setState({ fetching: false });
// 	}

// 	handleDeleteRow = () => {
// 		const { deleteField } = this.props;
// 		const { deleteItem } = this.state;

// 		this.setState({ fetchingDelete: false });
// 		deleteField(deleteItem);
// 	}

// 	// toggleModal = (state) => {
// 	//   this.setState({
// 	//     [state]: !this.state[state],
// 	//     detail: null
// 	//   });
// 	// };
// 	toggleModal = (state, type) => {
// 		if (this.state[state] && type == 1) {
// 			return;
// 		} else {
// 			this.setState({
// 				[state]: !this.state[state],
// 				detail: null,
// 				newDataIn: null,
// 				errorInsert: {},
// 				errorUpdate: {}
// 			});
// 		}
// 	};

// 	handleUpdateInfoData = (value) => {
// 		const { newDetail, detail, dataAll, currentRow } = this.state;
// 		const { updateField } = this.props;
// 		const errorUpdate = {};
// 		const updateData = { ...newDetail };
// 		console.log(updateData?.fieldTypeId);
// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				errorUpdate
// 			}
// 		});

// 		// if (!updateData.fieldCode) {
// 		// 	errorUpdate['fieldCode'] = 'Mã ngành nghề không được bỏ trống';
// 		// }

// 		if (!updateData.fieldName) {
// 			errorUpdate['fieldName'] = 'Tên ngành nghề không được bỏ trống';
// 		}

// 		// if (!updateData.fieldTypeId) {
// 		// 	errorUpdate['fieldTypeId'] = 'Chưa chọn nhóm ngành nghề';
// 		// }

// 		if (!updateData.parentID) {
// 			errorUpdate['parentID'] = 'Chưa chọn thuộc ngành nghề';
// 		}
// 		let dataFilter = []
// 		let dataFilterChild = []
// 		if (updateData.parentID) {
// 			dataAll.filter(x => x.id == updateData.parentID).map(
// 				item => {
// 					dataFilter.push(item)
// 				}
// 			)
// 			if (dataFilter != []) {
// 				if (dataFilter[0].parentID == "") {
// 					dataAll.filter(x => x.parentID == dataFilter[0].id || x.id == dataFilter[0].parentID).map(
// 						item => {
// 							dataFilter.push(item);
// 							dataFilterChild.push(item);
// 						}
// 					)
// 					if (dataFilterChild != []) {
// 						for (let i = 0; i < dataFilterChild.length; i++) {
// 							dataAll.filter(x => x.parentID == dataFilterChild[i].id || x.id == dataFilterChild[i].parentID).map(
// 								item => {
// 									dataFilter.push(item);
// 								}
// 							)
// 						}
// 					}
// 				} else {
// 					dataAll.filter(x => x.parentID == dataFilter[0].id || x.parentID == dataFilter[0].parentID || x.id == dataFilter[0].parentID).map(
// 						item => {
// 							dataFilter.push(item)
// 						}
// 					)
// 				}
// 			}
// 		}
// 		let flag = false;
// 		// if (updateData.fieldName) {
// 		// 	if (updateData.fieldName.trim().toUpperCase().indexOf(currentRow.fieldName.trim().toUpperCase()) === -1) {
// 		// 		dataFilter.filter(item => item.fieldName.trim().toUpperCase() === updateData.fieldName.trim().toUpperCase())
// 		// 			.map(item => flag = true);
// 		// 	} else {
// 		// 		flag = false;
// 		// 	}
// 		// 	if (flag == true) {
// 		// 		errorUpdate['fieldName'] = 'Tên ngành nghề này đã có';
// 		// 	}
// 		// }

// 		// if (updateData.parentID) {
// 		//   dataAll.filter(x => x.id == updateData.parentID).map(
// 		//     item => {
// 		//       dataFilterCode.push(item)
// 		//     }
// 		//   )
// 		//   if (dataFilterCode != []) {
// 		//     if (dataFilterCode[0].parentID == "") {
// 		//       dataAll.filter(x => x.parentID == dataFilterCode[0].id || x.id == dataFilterCode[0].parentID).map(
// 		//         item => {
// 		//           dataFilterCode.push(item);
// 		//           dataFilterCodeChildCode.push(item);
// 		//         }
// 		//       )
// 		//       if (dataFilterCodeChildCode != []) {
// 		//         for (let i = 0; i < dataFilterCodeChildCode.length; i++) {
// 		//           dataAll.filter(x => x.parentID == dataFilterCodeChildCode[i].id || x.id == dataFilterCodeChildCode[i].parentID).map(
// 		//             item => {
// 		//               dataFilterCode.push(item);
// 		//             }
// 		//           )
// 		//         }
// 		//       }
// 		//     } else {
// 		//       dataAll.filter(x => x.parentID == dataFilterCode[0].id || x.parentID == dataFilterCode[0].parentID || x.id == dataFilterCode[0].parentID).map(
// 		//         item => {
// 		//           dataFilterCode.push(item)
// 		//         }
// 		//       )
// 		//     }
// 		//   }
// 		// }
// 		// let flagCode = false;
// 		// if (updateData.fieldCode) {

// 		//   if (updateData.fieldCode.trim().toUpperCase().indexOf(currentRow.fieldCode.trim().toUpperCase()) === -1) {
// 		//     dataFilterCode.filter(item => item.fieldCode.trim().toUpperCase() === updateData.fieldCode.trim().toUpperCase())
// 		//       .map(item => flagCode = true);
// 		//   } else {
// 		//     flagCode = false;
// 		//   }
// 		//   if (flagCode == true) {
// 		//     errorUpdate['fieldCode'] = 'Mã ngành nghề này đã có';
// 		//   }
// 		// }

// 		let dataFilterCode = []
// 		let flagCode = false;

// 		if (updateData.parentID) {
// 			dataAll.filter(item =>
// 				item.fieldCode.trim().toUpperCase() !== currentRow.fieldCode.trim().toUpperCase()
// 			).map(it => {
// 				dataFilterCode.push(it)
// 			})

// 			dataFilterCode.filter(item => item.fieldCode.trim().toUpperCase() === updateData.fieldCode.trim().toUpperCase())
// 				.map(item => flagCode = true);
// 		}

// 		// if (flagCode == true) {
// 		// 	errorUpdate['fieldCode'] = 'Mã ngành nghề này đã có';
// 		// }

// 		if ((updateData.fieldName || '').length > 255) {
// 			errorUpdate['fieldName'] = 'Nhập tối đa 255 ký tự';
// 		}

// 		if (Object.keys(errorUpdate).length > 0) {
// 			this.setState(previousState => {
// 				return {
// 					...previousState,
// 					errorUpdate,
// 				}
// 			});

// 			return;
// 		}
// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				errorUpdate: {},
// 				detail: null,
// 				updateModal: false
// 			}
// 		});
// 		// Call update
// 		this.setState({ fetchingUpdate: false });
// 		updateField(JSON.stringify(updateData)).then(res => {
// 			console.log(res, 111);
// 		})
// 	}

// 	handleOpenEdit = (value) => {
// 		const { data } = this.state;

// 		this.setState({ detail: value, newDetail: value });
// 	}

// 	toggle = (el, val) => {
// 		let { collapseList } = this.state;

// 		collapseList.filter(item => item.id === val)
// 			.map(item => item.collapse = !item.collapse);

// 		this.setState({ collapseList });
// 	}

// 	handleLockRow = () => {
// 		const { requestLockField } = this.props;
// 		const { lockItem } = this.state;

// 		requestLockField(lockItem).then((res) => {
// 			if ((res.data || {}).status === 200) {
// 				this.fetchSummary(JSON.stringify({
// 					"search": "",
// 					"filter": "",
// 					"orderBy": "",
// 					"page": null,
// 					"limit": null
// 				}));
// 				this.setState(previousState => {
// 					return {
// 						...previousState,
// 						lockItem: ''
// 					}
// 				});
// 				// this.toggleModal('warningPopupDelModal');
// 			} else {
// 				this.setState(previousState => {
// 					return {
// 						...previousState,
// 						errNoti: (res.data || {}).message,
// 						lockItem: ''
// 					}
// 				});

// 				this.toggleModal('warningPopupDelModal');
// 			}
// 		}).catch(err => {
// 			this.setState({
// 				lockItem: '',
// 				message: PLEASE_CHECK_CONNECT(err.message)
// 			})
// 		})
// 	}

// 	toggleModalLock = () => {
// 		this.setState(previousState => {
// 			return {
// 				...previousState,
// 				warningPopupDelModal: false,
// 				lockItem: ''
// 			}
// 		});
// 	}

// 	render() {
// 		const {
// 			status,
// 			headerTitle,
// 			data,
// 			message,
// 			isLoaded,
// 			detail,
// 			beginItem,
// 			endItem,
// 			listLength,
// 			totalPage,
// 			totalElement,
// 			filter,
// 			newData,
// 			errorUpdate,
// 			activeCreateSubmit,
// 			warningPopupModal,
// 			updateModal,
// 			popupMessage,
// 			delmessage,
// 			createNewModal,
// 			warningPopupDelModal
// 		} = this.state;
// 		// console.log(detail);
// 		const statusPopup = { status: status, message: message };
// 		let isDisableAdd = true;
// 		let isDisableEdit = true;
// 		let isDisableDelete = true;
// 		let isDisableLock = true;

// 		if (IS_ADMIN) {
// 			isDisableAdd = false;
// 			isDisableEdit = false;
// 			isDisableDelete = false;
// 			isDisableLock = false;
// 		} else {
// 			ACCOUNT_CLAIM_FF.filter(x => x == "Fields.Add").map(y => isDisableAdd = false)
// 			ACCOUNT_CLAIM_FF.filter(x => x == "Fields.Edit").map(y => isDisableEdit = false)
// 			ACCOUNT_CLAIM_FF.filter(x => x == "Fields.Delete").map(y => isDisableDelete = false)
// 			ACCOUNT_CLAIM_FF.filter(x => x == "Fields.Lock").map(y => isDisableLock = false)
// 		}

// 		return (
// 			<>
// 				{
// 					<div id='field-area' className={classes.wrapper}>
// 						<Container fluid>
// 							{
// 								isLoaded ? (
// 									<div style={{ display: 'table', margin: 'auto' }}>
// 										<Spinner style={{ width: '3rem', height: '3rem' }} />
// 									</div>
// 								) : (
// 									<Row>
// 										<div className="col">
// 											{/* Header */}
// 											<HeaderTable
// 												dataReload={() => this.fetchSummary(
// 													JSON.stringify({
// 														"search": "",
// 														"filter": "",
// 														"orderBy": "",
// 														"page": null,
// 														"limit": null
// 													})
// 												)}
// 												hideCreate={isDisableAdd == false ? false : true}
// 												searchForm={
// 													<SearchModal
// 														filter={filter}
// 														handleChangeFilter={this.handleChangeFilter}
// 													/>
// 												}

// 												handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
// 												moduleTitle='Thêm ngành nghề'
// 												moduleBody={this.renderCreateModal()}
// 												activeSubmit={activeCreateSubmit}
// 												newData={newData}
// 												handleCreateInfoData={this.handleCreateInfoData}
// 												isPreventForm={true}
// 												closeForm={this.closeForm}
// 											/>

// 											{/* Table */}
// 											<div className="row" style={{ display: 'flex', margin: 0, alignItems: 'center' }}>
// 												<div style={{
// 													width: 15,
// 													height: 15,
// 													background: 'red',
// 												}}>
// 												</div>&nbsp;
// 												<div style={{ color: 'red', }}>Chưa khóa</div>
// 											</div>
// 											<Card className="shadow">
// 												<Table className="align-items-center tablecs table-css-fieldList" responsive>
// 													<HeadTitleTable headerTitle={headerTitle} reSize={300} classHeaderColumns={{
// 														0: 'table-scale-col table-user-col-1'
// 													}} reSizeName={'Mã ngành'} />

// 													<tbody>
// 														{
// 															Array.isArray(data) && (
// 																this.renderTable(data, isDisableEdit, isDisableDelete, isDisableLock)
// 															)
// 														}
// 													</tbody>
// 												</Table>
// 											</Card>

// 											{/* Pagination */}
// 											{
// 												// Page of Table
// 												// data.length > 0 && (
// 												//     <Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick}/>
// 												//   )
// 											}
// 										</div>
// 									</Row>
// 								)
// 							}
// 							<WarningPopupDel
// 								moduleTitle='Thông báo'
// 								moduleBody={
// 									<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
// 										Bạn đồng ý khóa thông tin này?
// 									</p>}
// 								warningPopupDelModal={warningPopupDelModal}
// 								toggleModal={this.toggleModalLock}
// 								handleWarning={this.handleLockRow}
// 							/>
// 							{
// 								detail !== null && (
// 									<UpdatePopup
// 										moduleTitle='Cập nhật ngành nghề'
// 										moduleBody={
// 											<UpdateModal
// 												field={data}
// 												data={detail}
// 												errorUpdate={errorUpdate}
// 												handleCheckValidation={this.handleCheckValidation}
// 												handleNewData={this.handleNewData}
// 												handleNewDetail={this.handleNewDetail}
// 											/>}
// 										newData={newData}
// 										updateModal={updateModal}
// 										toggleModal={this.toggleModal}
// 										activeSubmit={activeCreateSubmit}
// 										handleUpdateInfoData={this.handleUpdateInfoData}
// 									/>
// 								)
// 							}
// 							<CreateNewPopup
// 								newData={newData}
// 								createNewModal={createNewModal}
// 								moduleTitle='Thêm ngành nghề'
// 								type100={true}
// 								moduleBody={this.renderCreateModal()}
// 								toggleModal={this.toggleModal}
// 								activeSubmit={activeCreateSubmit}
// 								handleCreateInfoData={(data, beta, close) => {
// 									this.handleCreateInfoData(data, () => {
// 										this.setState({
// 											createNewModal: false
// 										});
// 									}, close);
// 								}}
// 							/>

// 							<WarningPopup
// 								moduleTitle='Thông báo'
// 								moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
// 								warningPopupModal={warningPopupModal}
// 								toggleModal={this.toggleModal}
// 								handleWarning={this.handleDeleteRow}
// 							/>
// 							{delmessage != '' ? (
// 								<PopupMessage
// 									popupMessage={popupMessage}
// 									moduleTitle={'Thông báo'}
// 									moduleBody={message}
// 									toggleModal={this.toggleModal}
// 								/>
// 							) : null}
// 						</Container>
// 					</div>
// 				}
// 			</>
// 		);
// 	}
// };

// const mapStateToProps = (state) => {
// 	return {
// 		field: state.FieldStore
// 	}
// }

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		...bindActionCreators(actionField, dispatch),
// 		...bindActionCreators(actionFieldType, dispatch)
// 	}
// }

// export default compose(
// 	connect(
// 		mapStateToProps,
// 		mapDispatchToProps
// 	)
// )(FieldList);
