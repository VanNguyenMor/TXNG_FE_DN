import React, { Component } from "react";
import classes from './index.module.css';
import Select from "components/Select";
import ReactDatetime from "react-datetime";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

// reactstrap components
import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

class SearchModal extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    const {
      filter, statusPrint, statusList, handleSelectCS,
      fromDate, toDate, handleChangeDate
    } = this.props;
  }

  render() {
    const {
      filter, statusPrint, statusList, handleSelectCS,
      fromDate, toDate, handleChangeDate
    } = this.props;
    let lbStatus = '';
    let lbPrintStatus = '';

    if (filter) {
      if (filter.status) {
        lbStatus = (statusList.filter(st => st.status == filter.status))[0].name
      }
      if (filter.printStatus) {
        lbPrintStatus = (statusPrint.filter(st => st.printStatus == filter.printStatus))[0].name
      }
    }

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={`${classes.searchRowItem} ${classes.searchRowBetItem}`}>
            <div className={classes.item}>
              <label>Từ ngày</label>
              <FormGroup>
                <InputGroup className="input-group-alternative css-border-input">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Từ ngày"
                    }}
                    name='fromDate'
                    value={fromDate}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    onChange={(e) => handleChangeDate(e, 'fromDate')}
                  />
                </InputGroup>
              </FormGroup>
            </div>

            <div className={classes.item}>
              <label>Đến ngày</label>
              <FormGroup>
                <InputGroup className="input-group-alternative css-border-input">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Đến ngày"
                    }}
                    name='toDate'
                    value={toDate}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    onChange={(e) => handleChangeDate(e, 'toDate')}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>

            <label>
              Trạng thái duyệt
            </label>
            <Select
              name="status"
              title='Chọn trạng thái'
              data={statusList}
              labelName='name'
              labelMark={lbStatus}
              defaultValue={filter && filter.status}
              val='status'
              handleChange={handleSelectCS}
            />
          </div>
        </div>
        {filter.status == 2 &&
          <div className={classes.searchRow}>
            <div className={classes.searchRowItem}>
              <label>
                Trạng thái in
              </label>
              <Select
                name="printStatus"
                title='Chọn trạng thái'
                data={statusPrint}
                labelName='name'
                labelMark={lbPrintStatus}
                defaultValue={filter && filter.printStatus}
                val='printStatus'
                handleChange={handleSelectCS}
              />
            </div>
          </div>
        }

      </div>
    );
  }
};

export default SearchModal;
