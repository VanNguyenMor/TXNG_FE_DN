import React, { Component } from "react";
import HeadTitleTable from "components/HeadTitleTable";
import { handleCurrencyFormat } from "../../../helpers/common";
import { generateStyleTableCol } from '../../../bases/helper';
import ActiIcon from "../../../assets/img/buttons/XACTHUC.png";
import { DEBT_COLLECT_OF_REGISTRASTION_OF_USE_HEADER } from "../../../helpers/constant";
import classes from "./index.module.css";

// reactstrap components
import {
  Card,
  CardHeader,
  Row,
  Spinner,
	Table
} from "reactstrap";

class DashboardRegisterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
			headerTitle: DEBT_COLLECT_OF_REGISTRASTION_OF_USE_HEADER,
    };
  }

  render () {
		const { headerTitle } = this.state;
		const { data, isLoaded } = this.props;
		// console.log(data);
    return (
			<Card className={`shadow ${classes.cardArea}`}>
				<CardHeader className={`bg-primary ${classes.boxHeader}`}>
					<Row className="align-items-center">
						<div className="col">
							<p className={`mb-0 text-white ${classes.title}`}>Công nợ thu tiền đăng ký sử dụng</p>
						</div>
					</Row>
				</CardHeader>
				{
					isLoaded ? (
						<div style={{ display: 'table', margin: 'auto' }}>
							<Spinner style={{ width: '2rem', height: '2rem' }} />
						</div>
					) : (
						<div className={classes.views_spacing}>
							<Table className="align-items-center" responsive>
								<HeadTitleTable headerTitle={headerTitle}
									classHeaderColumns={{
										0: 'table-scale-col table-user-col-1'
									}}
								/>

								<tbody ref={ref => this.tableBody = ref}>
									{
										Array.isArray(data) && (
											data
												.map((item, key) => (
													<tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }}>
														<td className='table-scale-col table-user-col-1'>{key + 1}</td>
														<td style={{ textAlign: 'right' }} className='table-scale-col color-black'>{handleCurrencyFormat(item.Amount)}</td>
														<td style={{ textAlign: 'left' }} className='table-scale-col color-black'>{item.CompanyName}</td>
														<td style={{ textAlign: 'center' }} className='table-scale-col color-black'>
															<img src={ActiIcon} alt="Xác thực" title="Xác thực" />
														</td>
													</tr>
												))
										)
									}
									</tbody>
							</Table>
						</div>
					)
				}
			</Card>
    );
  }
};

export default DashboardRegisterList;
