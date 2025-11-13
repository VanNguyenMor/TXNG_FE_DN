import React, { Component } from "react";
import classes from './index.module.css';
import moment from 'moment';
import { handleCurrencyFormat } from "../../helpers/common";
import QRCode from 'qrcode.react';
import './custom.css';
import HeadTitleTable from "components/HeadTitleTable";
import Pagination from "components/Pagination";
import PrintIcon from "assets/img/buttons/printIcon.svg";
import ViewOneStamp from "../../components/PrintFormStampQR/ViewOneStamp";
import PrintPopup from "../../components/PrintPopup";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionStampProvideList } from "../../actions/StampProvideActions";
import PopupMessage from "../../components/PopupMessage";

import {
	Card,
	Table,
	Container,
	Row,
	Spinner,
	ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button
} from "reactstrap";

const HEADER = [
	'Stt',
	'DẢI TEM',
	'MÃ TEM',
	'TRẠNG THÁI'
	// 'SỐ LƯỢNG ĐÃ IN'

];

class DefaultForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			beginItem: 0,
			endItem: 10,
			headerTitle: HEADER,
			totalElement: 0,
			listLength: 0,
			currentPage: 0,
			limit: 10,
			checkAll: false
		};
	}

	componentWillMount() {
		const { printQR, idPrinQR } = this.props;
		let { limit } = this.state;
		let data = [];

		printQR("requestID=" + idPrinQR.id + "&page=" + 1 + "&limit=" + idPrinQR.requested).then(res => {
			if (res.data.status == 200) {
				data = res.data.data.stamps;

				data.map((item, key) => {
					item['index'] = key + 1
				})

				this.setState({
					totalPage: Math.ceil(data.length / limit),
					listLength: data.length,
					totalElement: data.length > limit ? limit : data.length,
					data
				})
				// 
			} else {
				this.setState({ errMesageFail: res.data.message })
				this.toggleModal('popupMessage')
			}
		})
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
		} else {
			total = total;
		}
		this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
	};

	toggleModal = (state) => {
		this.setState({
			[state]: !this.state[state],

		});
	};

	handlePrint = (type) => {
		let { dataSend, data, limit } = this.state;
		const { printQR, idPrinQR, printStamp } = this.props;

		if (dataSend) {
			if (type == false) {
				printStamp("id=" + dataSend.stampID + "&type=" + type).then(res => {
					if (res.data.status == 200) {
						printQR("requestID=" + idPrinQR.id + "&page=" + 1 + "&limit=" + idPrinQR.requested).then(res => {
							if (res.data.status == 200) {
								data = res.data.data.stamps;

								data.map((item, key) => {
									item['index'] = key + 1
								})

								this.setState({
									totalPage: Math.ceil(data.length / limit),
									listLength: data.length,
									data
								})
								// 
							} else {
								this.setState({ errMesageFail: res.data.message })
								this.toggleModal('popupMessage')
							}
						})
					}
				})
			} else {
				printStamp("id=" + data[0].stampCode + "&type=" + type).then(res => {
					if (res.data.status == 200) {
						printQR("requestID=" + idPrinQR.id + "&page=" + 1 + "&limit=" + idPrinQR.requested).then(res => {
							if (res.data.status == 200) {
								data = res.data.data.stamps;

								data.map((item, key) => {
									item['index'] = key + 1
								})

								this.setState({
									totalPage: Math.ceil(data.length / limit),
									listLength: data.length,
									data
								})
								// 
							} else {
								this.setState({ errMesageFail: res.data.message })
								this.toggleModal('popupMessage')
							}
						})
					}
				})
			}
		}
	}

	render() {
		const { detailPrint } = this.props;
		const {
			headerTitle,
			beginItem,
			endItem,
			listLength,
			totalPage,
			totalElement,
			printModal,
			data,
			checkAll,
			errMesageFail,
			popupMessage
		} = this.state
		return (
			<>
				<Card className="shadow">
					<Table className="align-items-center tablecs" responsive >
						<HeadTitleTable headerTitle={headerTitle} />
						<tbody>
							<>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<div
											style={{
												width: '20px',
												height: '20px',
												cursor: 'pointer'
											}}
											onClick={() => {
												this.setState({ checkAll: true })
												this.toggleModal('printModal');
											}}
										>
											<img src={PrintIcon} alt="In tất cả" />
										</div>
									</td>
								</tr>
								{
									Array.isArray(data)
									&& (
										data.filter((item, key) => key >= beginItem && key < endItem)
											.map(
												(item, key) => (
													<tr key={key}>
														<td style={{ whiteSpace: 'normal' }}>{item.index}</td>
														<td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.stampCode}</td>
														<td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{item.stampID}</td>
														<td style={{ textAlign: 'left', whiteSpace: 'normal' }}>
															{item.printStatus === 0 ? (
																<>
																	<span style={{ color: 'red' }}>Chưa in</span>
																</>
															) : null}
															{item.printStatus === 1 ? (
																<>
																	<span style={{ color: 'green' }}>Đã in</span>
																</>
															) : null}
														</td>
														<td style={{ whiteSpace: 'normal', }}>
															<div style={{ width: '20px', height: '20px', cursor: 'pointer' }}
																onClick={() => {
																	this.setState({ dataSend: item, checkAll: false })
																	this.toggleModal('printModal');
																}}
															>
																<img src={PrintIcon} alt="In" />
															</div>
														</td>
													</tr>
												)
											)
									)
								}
							</>
						</tbody>
					</Table>
				</Card>

				{
					// Page of Table
					Array.isArray(data) && (
						<Pagination
							data={data}
							listLength={listLength}
							totalPage={totalPage}
							totalElement={totalElement}
							handlePageClick={this.handlePageClick}
						/>
					)
				}
				{
					(this.state.dataSend || data) && (
						<PrintPopup
							moduleTitle="In tem"
							printModal={printModal}
							lableBtnSave="In"
							moduleBody={
								<div>
									<ViewOneStamp
										detailPrint={detailPrint}
										data={this.state.dataSend}
										dataAll={data}
										printInfo={data}
										checkAll={checkAll}
										handlePrint={this.handlePrint}
									/>
								</div>
							}

							id='printarea'
							toggleModal={this.toggleModal}
						/>
					)
				}
				{errMesageFail != '' ?
					<PopupMessage
						popupMessage={popupMessage}
						moduleTitle={'Thông báo'}
						moduleBody={errMesageFail}
						toggleModal={this.toggleModal}
					/> : null
				}
			</>
			// <div className={`${classes.printarea} row`}
			// 	style={{ border: 'none' }}
			// >
			// 	{
			// 		Array.isArray(data) && (
			// 			data.map(
			// 				(item, key) => (
			// 					<div
			// 						className='item'
			// 						style={{
			// 							margin: '0 23px',
			// 							textAlign: 'center'
			// 						}}
			// 					>
			// 						<div className="imageP">
			// 							< QRCode
			// 								id='qrcode'
			// 								value={item.qrCode}
			// 								size={190}
			// 								renderAs='svg'
			// 								level={'H'}
			// 								includeMargin={true}
			// 							/>
			// 						</div>
			// 						<div
			// 							className="labelP"
			// 							style={{
			// 								color: '#000',
			// 								fontSize: 12,
			// 								textAlign: 'center'
			// 							}}>
			// 							{item.stampID}
			// 						</div>
			// 					</div>
			// 				)
			// 			)
			// 		)
			// 	}
			// </div>

		);
	}
};

const mapStateToProps = (state) => {
	return {
		stampprovide: state.StampProvideStore,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(actionStampProvideList, dispatch),
	}
}
export default compose(
	//withStyles(useStyles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(DefaultForm);
