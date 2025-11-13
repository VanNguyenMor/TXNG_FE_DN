import React, { Component } from "react";
import classes from './index.module.css';
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { DocTienBangChu } from "../../../helpers/docTien";
import './custom.css';

class DefaultForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {
		const { data, infoCompany } = this.props;
		let currentDate = moment()
		// let address = infoCompany.orgAddress || "";

		return (
			<>

				<div className={classes.printarea} style={{ height: 450 }}>
					{/* <p>{ 'LACO GRPOUP' }</p>
				<p>{ data.code }</p>
				<p>{ data.companyName }</p>
				<p>{ 'Address' }</p>
				<p>{ data.reason }</p>
				<p>{ 'Prices' }</p>
				<p>{ data.confirmedDate }</p> */}

					<div>
						<div className='rowItem'>
							<div className='text-bold'>{(infoCompany.orgName).toUpperCase()}</div>
						</div>
						<div className='rowItem'>
							<div><span className='text-bold'>Địa chỉ : </span>{infoCompany.orgAddress}</div>
							<div>Mẫu số 02 - TT</div>
						</div>
						<div className='rowItem'>
							<div><span className='text-bold'>Điện thoại : </span>{infoCompany.orgPhone}</div>
							<div>Nợ : .................................</div>
						</div>
						<div className='rowItem'>
							<div><span className='text-bold'>Email : </span>{infoCompany.orgEmail}</div>
							<div>Có : ................................</div>
						</div>
					</div>

					<div className='title-area'>
						<h1 className='title'>PHIẾU THU</h1>
						<div className='num'>
							{
								data.code !== null ? (
									<div className='text'>Số :  <span className='border-dot'>{data.code}</span></div>
								) : <div>Số : .................................</div>
							}
						</div>
					</div>

					<div>
						<div className='rowItem'>
							{
								data.companyName !== null ?
									<div className='text'>
										Họ và tên người nộp tiền : ....................................................................................................................................
										<span className='value'>{data.companyName}</span>
									</div>
									: <div className='text'>
										Họ và tên người nộp tiền : ....................................................................................................................................
									</div>
							}
						</div>
						<div className='rowItem'>
							{
								data.companyName !== null ?
									(<div className='text'>
										Địa chỉ : .................................................................................................................................................................
										<span className='value'>{data.address}</span>
									</div>) :
									(<div className='text'>
										Địa chỉ : .................................................................................................................................................................
									</div>)
							}
						</div>
						<div className='rowItem'>
							{
								data.reason !== null ?
									<div className='text'>
										Lý do nộp : ............................................................................................................................................................
										<br /><span>...............................................................................................................................................................................</span>
										<span className='value' style={{ left: '11%' }}>{data.reason}</span>
									</div>
									: <div className='text'>
										Lý do nộp : ............................................................................................................................................................
										<br /><span>...............................................................................................................................................................................</span>
									</div>
							}
						</div>
						<div className='rowItem'>
							{
								data.amount !== null ? (
									<div className='text'>Số tiền : <span className='value' style={{ left: '9%' }}>..{handleCurrencyFormat(data.amount)}</span>.......................................(Viết bằng chữ) :..............................................................................................
										<br /><span className='value' style={{ left: '11%', marginLeft: 250 }}>{DocTienBangChu(data.amount)}</span></div>
								) : <div className='text'>Số tiền : .......................................(Viết bằng chữ) : ..............................................................................................</div>
							}
						</div>
						<div className='rowItem'>
							{
								<div className='text'>Kèm theo : ....................................... chứng từ gốc</div>
							}
						</div>
						<div className='rowItem end italic-text'>
							{
								data.confirmedDate !== null ? (
									<div className='text'>Ngày  <span className='date'>{`${moment(data.confirmedDate).format('DD')}`}</span>tháng  <span className='month'>{`${moment(data.confirmedDate).format('MM')}`}</span>  năm <span className='year'>{`${moment(data.confirmedDate).format('YYYY')}`}</span></div>
								) : <div className='text'>Ngày
									<span className='date'>{currentDate.format('DD')}</span>
									tháng
									<span className='month'>{currentDate.format('MM')}</span>
									năm
									<span className="year">{currentDate.format('YYYY')}</span>
								</div>
							}
						</div>
						<div className='rowItem'>
							<div style={{ textAlign: 'center' }}>
								<div className='text-bold' style={{ marginBottom: 0 }}>Giám đốc</div>
								<div className='text italic-text'>(Ký, họ tên, đóng dấu)</div>
							</div>

							<div style={{ textAlign: 'center' }}>
								<div className='text-bold'>Kế toán trưởng</div>
								<div className='text italic-text'>(Ký, họ tên)</div>
							</div>

							<div style={{ textAlign: 'center' }}>
								<div className='text-bold'>Người nộp tiền</div>
								<div className='text italic-text'>(Ký, họ tên)</div>
							</div>

							<div style={{ textAlign: 'center' }}>
								<div className='text-bold'>Người lập phiếu</div>
								<div className='text italic-text'>(Ký, họ tên)</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
};

export default DefaultForm;
