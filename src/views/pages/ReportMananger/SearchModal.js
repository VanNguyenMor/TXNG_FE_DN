import React, { Component } from "react";
import classes from './index.module.css';

// reactstrap components
import {
  Input,
  InputGroup
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
            <label>Tên menu</label>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="menuName"
                value={filter.menuName}
                //placeholder="Tên ngành nghề" 
                type="text"
                autoFocus={true}
                onChange={(event) => handleChangeFilter(event)}
              />
            </InputGroup>

          </div>
        </div>
      </div>
    );
  }
};

export default SearchModal;
