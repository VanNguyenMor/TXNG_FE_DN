import React, { Component } from "react";
import classes from './index.module.css';
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import "./custom.css";
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
    const { filter, handleChangeFilter, handleChangeStartDate, handleChangeEndDate, dataDefault, handleSelect, data, startDate, endDate } = this.props;
    
    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <div className={classes.item}>
              <label>Đến ngày</label>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Từ ngày"
                    }}
                    name='startDate'
                    value={startDate}
                    timeFormat={false}
                    onChange={(e) => handleChangeStartDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
            
            <div className={classes.item}>
              <label>Từ ngày</label>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Đến ngày"
                    }}
                    name='endDate'
                    value={endDate}
                    timeFormat={false}
                    onChange={(e) => handleChangeEndDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>

          <div className={classes.searchRow}>
            <div className={classes.searchRowItem}>
              <label>Dải tem</label>
            </div>

            <Input 
              placeholder="Dải tem" 
              name="filter" 
              value={filter.filter} 
              onChange={(event) => handleChangeFilter(event)} 
              type="text" 
            />
          </div>
        </div>
      </div>
    );
  }
};

export default SearchModal;
