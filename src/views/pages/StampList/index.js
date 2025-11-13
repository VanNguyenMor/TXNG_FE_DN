import React, { Component } from "react";
import moment from 'moment';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionSTAMPList } from "../../../actions/StampListActions";
import compose from 'recompose/compose';
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { STAMP_LIST_HEADER } from "../../../helpers/constant";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import DeleteIcon from "../../../assets/img/buttons/delete.png";
import Pagination from "components/Pagination";
import HeaderTable from "components/HeaderTable";
import HeadTitleTable from "components/HeadTitleTable";
import AddNewModal from "./AddNewModal";
import WarningPopup from "../../../components/WarningPopup";
import classes from './index.module.css';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import SearchModal from "./SearchModal";

import {
	Card,
	Table,
	Container,
	Row,
	Spinner,
	Input,
	ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { data } from "jquery";

class StampList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			detail: null,
			update: null,
			create: null,
			delete: null,
			deleteS: null,
			isLoaded: null,
			status: null,
			open: false,
			openDEL: false,
			message: '',
			history: [],
			searchData: [],
			filterList: [],
			checkAtive: [{}],
			fetchingDelete: false,
			fetching: false,
			headerTitle: STAMP_LIST_HEADER,
			limit: LIMIT_ITEM_IN_PAGE,
			beginItem: 0,
			endItem: LIMIT_ITEM_IN_PAGE,
			totalElement: 0,
			listLength: 0,
			currentPage: 0,
			dataDefault: null,
			filter: {
				"startDate": this.fromDate(new Date()),
				"endDate": this.toDate(new Date()),
				"search": "",
				"filter": "",
				"orderBy": "",
				"page": null,
				"limit": null
			},
			warningPopupModal: false,
			activeCreateSubmit: false,
			newData: [],
			startDate: new Date(),
			endDate: new Date(),
		}
	}

	componentWillReceiveProps(nextProp) {
		const { fetching, fetchingDelete } = this.state;
		let { data } = nextProp.stamp;
		const { limit } = this.state;
		if (data !== this.state.data) {
			if (typeof (data) !== 'undefined') {
				if (typeof (data.stamp) !== 'undefined') {
					if (data.stamp !== null) {
						if (typeof (data.stamp.stamps) !== 'undefined') {
							data.stamp.stamps.map((item, key) => {
								item['index'] = key + 1;
								item['collapse'] = false;
								item['createdDate'] = moment(item.createdDate).format('DD/MM/YYYY');
								item['quantity'] = item.quantity.toLocaleString('de-DE');
								item['remaining'] = item.remaining.toLocaleString('de-DE');
								item['provided'] = item.provided.toLocaleString('de-DE');

							});
							this.setState({
								data: data.stamp.stamps,
								history: data.stamp.stamps,
								listLength: data.stamp.total,
								totalPage: Math.ceil(data.stamp.stamps.length / limit),
								isLoaded: data.isLoading,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message),
							});
						} else {
							this.setState({
								data: data.stamp.stamps,
								history: data.stamp.stamps,
								isLoaded: data.isLoading,
								status: data.status,
								message: PLEASE_CHECK_CONNECT(data.message)
							});
						}
					}
				}
			}
		}

		if (typeof (data.create) !== 'undefined') {
			if (data.create !== null) {
				if (data.status) {
					/* Fetch Summary */
					this.setState({ data: [] });
				}
				this.setState({ create: data.create, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
				// Fetching 
				if (fetching) {
					this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
					this.setState({ fetching: false });
				}
			}
		}

		// if (typeof (data.delete) !== 'undefined') {
		// 	if (data.status && !fetchingDelete) {
		// 		setTimeout(() => {
		// 			/* Fetch Summary */
		// 			this.setState({ data: [] });
		// 			this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
		// 			this.setState({ fetchingDelete: true });
		// 		}, 1000);
		// 	}

		// 	this.setState({ delete: data.delete, isLoaded: false, status: data.status, message: PLEASE_CHECK_CONNECT(data.message) });
		// }
	}

	clearDay = () => {
		this.setState({ data: [] })
	}

	toggle = (el, val) => {
		let { data } = this.state;

		data.filter(item => item.id === val)
			.map(item => item.collapse = !item.collapse);

		this.setState({ data });
	}

	componentDidMount() {
		/* Fetch Summary */
		this.fetchSummary(JSON.stringify({
			"startDate": "",
			"endDate": "",
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
		const { requestSTAMPList } = this.props;

		requestSTAMPList(data);
	}

	closeStatusModal = () => {
		const { status, fetching } = this.state;

		if ((status || !status) && !fetching) {
			setTimeout(() => {
				this.setState({ status: null, isLoaded: false });
			}, LOADING_TIME);
		}
	}

	getId = (value) => {
		if (typeof (value.id) !== 'undefined') {
			this.fetchSummaryDelete(
				value.id,
			)
		}
		//window.location.reload(true);
	}

	fetchSummaryDelete = (id) => {
		const { requestDeleteSTAMP } = this.props;

		requestDeleteSTAMP(id);
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

	fromDate = (val) => {
		let date = moment(val).format('YYYY-MM-DD');
		return date;
	}

	toDate = (val) => {
		let date = moment(val).format('YYYY-MM-DD');
		return date;
	}

	handleChangeFilter = (event) => {
		let { filter } = this.state;
		const ev = event.target;

		filter[ev['name']] = ev['value'];

		this.setState({ filter });
	}

	handleSubmitSearchForm = () => {
		let { filter } = this.state;
		const { requestSTAMPList } = this.props;

		requestSTAMPList(JSON.stringify(filter));
	}

	handleChangeStartDate = (e) => {
		let { filter } = this.state;

		filter['startDate'] = new Date(e);
		this.setState({ filter, startDate: new Date(e) });
	}

	handleChangeEndDate = (e) => {
		let { filter } = this.state;

		filter['endDate'] = new Date(e);
		this.setState({ filter, endDate: new Date(e) });
	}

	renderCreateModal = () => {
		return (
			<AddNewModal
				handleCheckValidation={this.handleCheckValidation}
				handleNewData={this.handleNewData}
			/>
		);
	}

	handleCheckValidation = (status) => {
		this.setState({ activeCreateSubmit: status });
	}

	handleNewData = (data) => {
		this.setState({ newData: data });
	}

	handleCreateInfoData = (value) => {
		const { requestCreateSTAMP } = this.props;
		this.setState({ fetching: true, isLoaded: true, status: null });
		requestCreateSTAMP(Number(value.quantity))
	}

	toggleModal = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	}

	handleDeleteRow = () => {
		const { requestDeleteSTAMP } = this.props;
		let { deleteItem } = this.state;

		requestDeleteSTAMP(deleteItem).then(res => {
			if (res.status == true) {
				this.fetchSummary(JSON.stringify({ "search": "", "filter": "", "orderBy": "", "page": null, "limit": null }));
			}
		})

	}

	render() {
		// const { classes } = this.props;
		const {
			isLoaded,
			status,
			message,
			data,
			beginItem,
			endItem,
			listLength,
			totalPage,
			totalElement,
			headerTitle,
			filter,
			dataDefault,
			startDate,
			endDate,
			activeCreateSubmit,
			newData,
			warningPopupModal
		} = this.state;
		const statusPopup = { status: status, message: message };

		let isDisableAdd = true;
		let isDisableDelete = true;
		let ACCOUNT_CLAIM_FF = [];
		if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
			isDisableAdd = false;
			isDisableDelete = false;
		} else {
			ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

			ACCOUNT_CLAIM_FF.filter(x => x == "StampDetails.Add").map(y => isDisableAdd = false)
			ACCOUNT_CLAIM_FF.filter(x => x == "StampDetails.Delete").map(y => isDisableDelete = false)
		}
		return (
			<>
				{
					<div id="stamp-list" className={classes.wrapper}>
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
														"startDate": "",
														"endDate": "",
														"search": "",
														"filter": "",
														"orderBy": "",
														"page": null,
														"limit": null
													})
												)}
												hideCreate={isDisableAdd == false ? false : true}
												searchForm={
													<SearchModal
														filter={filter}
														dataDefault={dataDefault}
														handleChangeStartDate={this.handleChangeStartDate}
														handleChangeEndDate={this.handleChangeEndDate}
														handleChangeFilter={this.handleChangeFilter}
														handleSelect={this.handleSelect}
														startDate={startDate}
														endDate={endDate}
													/>
												}
												moduleTitle='Tạo dải tem'
												moduleBody={this.renderCreateModal()}
												activeSubmit={activeCreateSubmit}
												newData={newData}
												handleCreateInfoData={this.handleCreateInfoData}
												handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
											/>

											{/* Table */}
											<Card className="shadow">
												<Table className="align-items-center tablecs" responsive>
													<HeadTitleTable headerTitle={headerTitle} />

													<tbody>
														{
															Array.isArray(data) && (
																data
																	.filter((item, key) => key >= beginItem && key < endItem)
																	.map((item, key) => (
																		<tr key={key}>
																			<td>{item.index}</td>
																			<td style={{ textAlign: 'center' }}>{item.code}</td>
																			<td style={{ textAlign: 'right' }}>{item.quantity}</td>
																			<td style={{ textAlign: 'right' }}>{item.remaining}</td>
																			<td style={{ textAlign: 'right' }}>{item.provided}</td>
																			<td style={{ textAlign: 'center' }}>{item.createdDate}</td>
																			<td style={{ textAlign: 'left' }}>{item.createdBy}</td>
																			<td>
																				{item.provided == 0 ? (
																					<div>
																						{isDisableDelete == false ? (
																							<ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.id)}>
																								<DropdownToggle>
																									<img src={MenuButton} />
																								</DropdownToggle>
																								<DropdownMenu>

																									<DropdownItem
																										onClick={() => {
																											this.toggleModal('warningPopupModal');
																											this.setState({ deleteItem: item.id });
																										}}
																									>
																										Xoá
																									</DropdownItem>
																								</DropdownMenu>
																							</ButtonDropdown>
																						) : null}
																					</div>
																				) : null}
																			</td>
																		</tr>
																	)
																	)
															)
														}
													</tbody>
												</Table>
											</Card>

											{/* Pagination */}
											{
												// Page of Table
												Array.isArray(data) && (
													<Pagination data={data} listLength={listLength} totalPage={totalPage} totalElement={totalElement} handlePageClick={this.handlePageClick} />
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

							<WarningPopup
								moduleTitle='Thông báo'
								moduleBody={<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Bạn đồng ý xoá thông tin này?</p>}
								warningPopupModal={warningPopupModal}
								toggleModal={this.toggleModal}
								handleWarning={this.handleDeleteRow}
							/>
						</Container>
					</div>
				}
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		stamp: state.StampListStore
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionSTAMPList, dispatch)
	}
}

export default compose(
	// withStyles(useStyles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(StampList);