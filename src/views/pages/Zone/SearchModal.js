import React, { Component } from "react";
import classes from './index.module.css';

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
    const { filter, handleChangeFilter } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên vùng</label>
            <Input
              className="css-search-input"
              name="zoneName"
              value={filter.zoneName}
              placeholder="Tên vùng"
              type="text"
              autoFocus={true}
              onChange={(event) => handleChangeFilter(event)}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default SearchModal;
