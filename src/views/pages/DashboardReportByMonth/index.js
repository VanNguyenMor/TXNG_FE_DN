import React, { Component } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  Row,
  Spinner
} from "reactstrap";
import { handleCurrencyFormat } from"../../../helpers/common";
import classes from "./index.module.css";

class DashboardHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render () {
		const { data, isLoaded } = this.props;

    return (
			<Card className={`shadow ${classes.cardArea}`}>
				<CardHeader className={`bg-primary ${classes.boxHeader}`}>
					<Row className="align-items-center">
						<div className="col">
							<p className={`mb-0 text-white ${classes.title}`}>Thống kê trong tháng</p>
						</div>
					</Row>
				</CardHeader>
				{
					isLoaded ? (
						<div style={{ display: 'table', margin: 'auto' }}>
							<Spinner style={{ width: '2rem', height: '2rem' }} />
						</div>
					) : (
						<div className={classes.flexArea}>
							<div className={classes.flexRow}>
								<div className={classes.item}>
									<p>Doanh nghiệp đăng ký mới: <span className={`text-danger ${classes.stronger}`}>0</span></p>
								</div>
								<div className={classes.item}>
									<p>Số tem đã cấp: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.StampProvided === null ? 0 : handleCurrencyFormat(data.StampProvided)
									)}</span></p>
								</div>
							</div>
							<div className={classes.flexRow}>
								<div className={classes.item}>
									<p>Doanh nghiệp ngưng sử dụng: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.CompanyStop === null ? 0 : handleCurrencyFormat(data.CompanyStop))}</span></p>
								</div>
								<div className={classes.item}>
									<p>Số tem đã sử dụng: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.StampUsed === null ? 0 : handleCurrencyFormat(data.StampUsed)
									)}</span></p>
								</div>
							</div>
							<div className={classes.flexRow}>
								<div className={classes.item}>
									<p>Doanh nghiệp đang sử dụng: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.CompanyUsing === null ? 0 : handleCurrencyFormat(data.CompanyUsing)
									)}</span></p>
								</div>
								<div className={classes.item}>
									<p>Số tem chưa sử dụng: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.StampRemaining === null ? 0 : handleCurrencyFormat(data.StampRemaining)
									)}</span></p>
								</div>
							</div>
							<div className={classes.flexRow}>
								<div className={classes.item}>
									<p>Doanh thu tiền tem: <span className={`text-danger ${classes.stronger}`}>0</span></p>
								</div>
								<div className={classes.item}>
									<p>Doanh thu tiền đăng ký: <span className={`text-danger ${classes.stronger}`}>{data !== null && (
										data.ReceiptRegister === null ? 0 : handleCurrencyFormat(data.ReceiptRegister)
									)}</span></p>
								</div>
							</div>
						</div>
					)
				}
			</Card>
    );
  }
};

export default DashboardHistory;
