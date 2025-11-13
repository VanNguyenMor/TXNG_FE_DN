import React, { Component } from "react";
import classes from './index.module.css';
import SelectTree from "components/SelectTree";

// reactstrap components
import {
	Input
} from "reactstrap";

class SearchModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
  
  render() {
    const { filter, handleChangeFilter, field, handleChangeSelectFilter } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Ngành nghề</label>
            
            <SelectTree 
              name="filter"
              title='Chọn ngành nghề' 
              data={field}
              selected={filter.filter}
              labelName='fieldName'
              fieldName='fieldName' 
              val='id'
              handleChange={handleChangeSelectFilter} 
            />
          </div>

          <div className={classes.searchRowItem}>
            <label>Tên truy xuất</label>
            <Input 
              name="search"
              value={filter.search}
              placeholder="Tên truy xuất" 
              type="text" 
              onChange={(event) => handleChangeFilter(event)} 
            />
          </div>
        </div>
      </div>
    );
  }
};

export default SearchModal;
