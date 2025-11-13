import React, { Component } from "react";
import classes from './index.module.css';
import InputCurrency from '../../../components/InputCurrency';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import Select from "components/Select";
import { actionPartner } from "../../../actions/PartnerActions";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import HeadTitleTable from "components/HeadTitleTable";
import { AddingReport, HeaderParams } from "../../../helpers/constant";
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import MenuButton from "../../../assets/img/buttons/menu.png";

// reactstrap components
import {
	Input,
	InputGroup,
	Button,
	Table,
	ButtonGroup,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,

	// Create the tabs
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Row,
	Col,

	// Create the cards
	Card,
	CardTitle,
	CardText
} from "reactstrap";

const dataTest = [
	{ ID: '1', Name: 'BC1', Status: true },
	{ ID: '2', Name: 'BC2', Status: false }
]

class UpdateModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: dataTest,
			activeSubmit: false,
			fileView: null,
			file: null,
			activeCheckbox: false,
			beginItem: 0,
			headerTitle: AddingReport,
			headerParams: HeaderParams,
			endItem: LIMIT_ITEM_IN_PAGE,
			currentTab: 0,
		}
		this.refFileImage = null;
	}

	// TODO: Copy begin item
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

	// TODO: Active checkbox in modal
	handleActivate = () => {
		this.setState({
			activeCheckbox: !this.state.activeCheckbox
		})
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
		data.LogoFile = ev;
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

	// TODO: about tabs
	onChooseTab = tab => () => {

		this.setState(previousState => {
			return {
				...previousState,
				currentTab: tab,
				errorsConfigSystem: {},
				errorsInfoCompany: {}
			}
		}, () => {
			if (tab == 0) {

			} else if (tab == 1) {
			}
		});
	}

	render() {
		const {
			data,
			headerTitle,
			beginItem,
			endItem,
			currentTab,
			headerParams,
		} = this.state;
		const { errorUpdate } = this.props;

		return (
			<div className={classes.formControl}>

				{/* Name of report */}
				<div className={classes.rowItem}>
					{/* Title name */}
					<label
						className="form-control-label"
					>
						Tên báo cáo&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					{/* End title */}

					{/* Field name */}
					<div className={classes.inputArea}>
						<InputGroup className="input-group-alternative css-border-input">
							<Input
								name='PartnerName'
								type='text'

								onKeyUp={(event) => this.handleChange(event)}
							/>
						</InputGroup>
						{/* End fields */}

						<p className='form-error-message margin-bottom-0'>{errorUpdate['PartnerName'] || ''}</p>
					</div>
				</div>
				{/* End name */}

				{/* Activate of report */}
				<div className={classes.rowItem}>
					{/* Title acitvate */}
					<label
						className="form-control-label"
						style={{ alignItems: "center" }}
					>
						Hoạt động&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					{/* End title */}

					{/* Field of activate */}
					<div className={classes.inputArea}>
						<ButtonGroup className="input-group-alternative css-border-input">
							<Input
								name='PartnerName'
								type="checkbox"
								onClick={this.handleActivate}
								active={this.state.activeCheckbox}
							/>
						</ButtonGroup>

						<p className='form-error-message margin-bottom-0'>{errorUpdate['PartnerName'] || ''}</p>
					</div>
					{/* End field */}
				</div>
				{/* End activate */}

				{/* Type of report */}
				<div className={classes.rowItem}>
					{/* Title type */}
					<label
						className="form-control-label"
					>
						Loại báo cáo&nbsp;<b style={{ color: 'red' }}>*</b>
					</label>
					{/* End title */}

					{/* Field of type */}
					<div className={classes.inputArea}>
						<Select
							name="filter"
							title='Chọn loại báo cáo'
							// data={dataTypeZone}
							labelName='name'
							val='id'
							handleChange={this.handleChangeSelectFilter}
						/>

						<p className='form-error-message margin-bottom-0'>{errorUpdate['PartnerName'] || ''}</p>
					</div>
					{/* End field */}
				</div>
				{/* End type */}

				{/* Tabs fields */}
				<div>
					{/* Tabs button */}
					<div className='config-system-tab'>
						<div onClick={this.onChooseTab(0)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 0 ? 'active' : ''}`}>THÔNG TIN VỀ BÁO CÁO</div>
						<div onClick={this.onChooseTab(1)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 1 ? 'active' : ''}`}>GIÁ TRỊ</div>
					</div>
					{/* End button */}

					{/* Tabs content */}
					{/* THONG TIN VE BAO CAO */}
					<div className='config-system-content'>
						{currentTab == 0 ? (
							<div className='config-system-content-info-company'>
								<div className='config-system-content-info-company-item'>
									{/* <label className='config-system-content-info-company-item-label'>Tên tổ chức&nbsp;<b style={{ color: 'red' }}>*</b></label> */}
									<div className='config-system-content-info-company-item-box'>
										{/* <InputGroup className="input-group-alternative css-border-input">
											<input autoFocus={true} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
										</InputGroup> */}

										{/* Table fields */}
										<Table className="align-items-center tablecs" responsive>
											<HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
												0: 'table-scale-col table-user-col-1'
											}} />

											<tbody ref={ref => this.tableBody = ref}>
												{
													Array.isArray(data) && (
														data
															.filter((item, key) => key >= beginItem && key < endItem)
															.map((item, key) => (

																<tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
																	<td className='table-scale-col table-user-col-1'>{key + 1}</td>

																	<td style={{ textAlign: 'center' }} className='table-scale-col css-img-partner'>{item.Name}</td>
																	<td style={{ textAlign: 'center' }} className='table-scale-col'>
																		<input type="checkbox" />
																	</td>
																	<td style={{ textAlign: 'left' }} className='table-scale-col'>

																	</td>
																</tr>
															)
															)
													)
												}
											</tbody>
										</Table>
										{/* End table */}

										<p className='form-error-message'></p>
									</div>
								</div>
							</div>
						) : null}
						{/* END THONG TIN */}

						{/* PARAMS */}
						{currentTab == 1 ? (
							<div className='config-system-content-info-company'>
								<div className='config-system-content-info-company-item'>

									<div className='config-system-content-info-company-item-box'>
										{/* <InputGroup className="input-group-alternative css-border-input">
											<input autoFocus={true} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
										</InputGroup> */}

										{/* Params fields */}
										<Table className="align-items-center tablecs" responsive>
											<HeadTitleTable headerTitle={headerParams} classHeaderColumns={{
												0: 'table-scale-col table-user-col-1'
											}} />

											<tbody ref={ref => this.tableBody = ref}>
												{
													Array.isArray(data) && (
														data
															.filter((item, key) => key >= beginItem && key < endItem)
															.map((item, key) => (

																<tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
																	<td className='table-scale-col table-user-col-1'>{key + 1}</td>
																	<td className='table-scale-col table-user-col-1'>Tên biến {key + 1}</td>

																	<td style={{ textAlign: 'center' }} className='table-scale-col css-img-partner'>
																		<InputGroup className="input-group-alternative css-border-input">
																			<Input
																				name="menuName"
																				//value={filter.menuName}
																				placeholder="Tên biến"
																				value={`tên hiển thị ${key + 1}`}
																				type="text"
																				autoFocus={true}
																				onChange={(event) => this.handleChangeFilter(event)}
																			/>
																		</InputGroup>
																	</td>

																	<td style={{ textAlign: 'left' }} className='table-scale-col'>
																		<InputGroup className="input-group-alternative css-border-input">
																			<Input
																				name="menuName"
																				//value={filter.menuName}
																				placeholder="Tên biến"
																				value={`Mặc định của biến ${key + 1}`}
																				type="text"
																				autoFocus={true}
																				onChange={(event) => this.handleChangeFilter(event)}
																			/>
																		</InputGroup>
																	</td>

																	<td style={{ textAlign: 'center' }} className='table-scale-col'>
																		<input type="checkbox" />
																	</td>

																	<td style={{ textAlign: 'left' }} className='table-scale-col'>

																	</td>
																</tr>
															)
															)
													)
												}
											</tbody>
										</Table>
										{/* End params */}
										<p className='form-error-message'></p>
									</div>
								</div>
							</div>
						) : null}
					</div>
					{/* END PARAMS */}
					{/* End content */}
				</div>
				{/* End tabs */}
			</div>
		);
	}
};

export default UpdateModal;
