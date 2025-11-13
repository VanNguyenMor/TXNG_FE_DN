import React, { Component } from "react";
import classes from './index.module.css';
import Select from "components/Select";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

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

  handleFormatProvince = (list, label) => {
    if (typeof (list[label]) !== 'undefined') {
      return [list];
    } else return list;
  }

  render() {
    const { filter, handleChangeFilter } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên nhóm</label>
            <Input
              name="search"
              value={filter.comapanyName}
              placeholder="Nhập tên nhóm sản phẩm cần tìm"
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
