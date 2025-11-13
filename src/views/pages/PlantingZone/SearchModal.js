import React, { Component } from "react";
import classes from './index.module.css';
import Select from '../../../components/Select';

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

  handleSelect = (e) => {
    let { filter } = this.state;
    //const { getWardList } = this.props;


    this.setState({ filter });
    //getWardList(filter.districtID)

  }

  render() {
    const { filter, handleChangeFilter, dataTypeZone, handleChangeSelectFilter } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Loại vùng sản xuất</label>
            <div>
              <Select
                name="filter"
                title='Chọn loại vùng sản xuất'
                data={dataTypeZone}
                labelName='name'
                val='id'
                handleChange={handleChangeSelectFilter}
              />
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên vùng</label>
            <Input
              name="search"
              className="css-search-input"
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
