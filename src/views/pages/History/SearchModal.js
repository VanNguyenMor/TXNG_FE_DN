import React, { Component } from "react";
import classes from './index.module.css';
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import "react-datetime/css/react-datetime.css";

// reactstrap components
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup
} from "reactstrap";

class SearchModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const { filter, handleChangeFilter, dataDefault, handleSelect, handleChangeFromDate,
      handleChangeToDate, data, fromDate, toDate } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className="row">
            <div className={classes.searchRowItem}
              style={{
                width: "50%",
                paddingLeft: 20,
                paddingRight: 10
              }}>
              <label>Từ ngày</label>
              <FormGroup >
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
                    timeFormat={false}
                    onChange={(e) => handleChangeFromDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>

            <div className={classes.searchRowItem} style={{
              width: "50%",
              paddingLeft: 10,
              paddingRight: 20
            }}>
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
                    timeFormat={false}
                    onChange={(e) => handleChangeToDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <div className={classes.searchRow}>
            <div className={classes.searchRowItem}>
              <label>Người dùng</label>
              <div>
                <Select
                  name="filter"
                  title='Chọn người dùng'
                  defaultValue={dataDefault}
                  data={data}
                  labelName='username'
                  val='id'
                  handleChange={handleSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SearchModal;
