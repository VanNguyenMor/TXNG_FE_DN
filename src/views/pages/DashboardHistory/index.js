import React, { Component } from "react";
import moment from 'moment';
import compose from 'recompose/compose';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionGetListDate } from "../../../actions/SearchDateHistoryAction";

// reactstrap components
import {
  Card,
  CardHeader,
  Row,
  Spinner
} from "reactstrap";
import { handleCurrencyFormat } from"../../../helpers/common";
import { removeDuplicates } from "../../../helpers/common";
import { LOADING_TIME } from "../../../helpers/constant";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import classes from "./index.module.css";

class DashboardReportByMonth extends Component {
  constructor(props) {
    super(props);

    this.state = {
			data: [],
			isLoaded: null,
      status: null,
			open: false,
			message: '',
    };
  }

	componentWillReceiveProps(nextProp) {
    let { data } = nextProp.log;
    let { limit, user } = this.state;

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.log) !== 'undefined') {
          if (data.log !== null) {
            if (typeof (data.log.logs) !== 'undefined') {
              data.log.logs.map((item, key) => (
                item['index'] = key + 1,
                item['date'] = moment(item.logTime).format('DD-MM-YYYY'),
                item['hours'] = moment(item.logTime).format('HH:mm')
              ));
							
              this.setState({ data: [] });
              this.setState({
                data: data.log.logs,
                isLoaded: data.isLoading, 
								status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });

            } else {
              this.setState({
                data: data.log.logs,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }
  }

	componentWillMount() {
    const { fromDate, toDate } = this.state;

    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "startDate": this.fromDate(fromDate),
      "endDate": this.toDate(toDate),
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
    const { requestLogListStore } = this.props;

    requestLogListStore(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

	fromDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }

  toDate = (val) => {
    let date = moment(val).format('YYYY-MM-DD');
    //console.log(date);
    return date;
  }

  render () {
		const { isLoaded, data } = this.state;

    return (
			<Card className={`shadow ${classes.cardArea}`}>
				<CardHeader className={`bg-primary ${classes.boxHeader}`}>
					<Row className="align-items-center">
						<div className="col">
							<p className={`mb-0 text-white ${classes.title}`}>Nhật ký hệ thống</p>
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
							{
                typeof(data) !== 'undefined' && (
                  data.map((item, key) => (
                    <div key={key} className={classes.flexRow}>
                      <div className={classes.item}>
                        <p>
                          <span className={classes.stronger}>{item.hours} {item.date}</span> :
                          <span> {item.userName}</span>
                          <span> {item.actions}</span>
                        </p>
                      </div>
                    </div>
                  ))
                )
							}
						</div>
					)
				}
			</Card>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    log: state.SearchDateHistory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionGetListDate, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DashboardReportByMonth);
