import React, { Component } from "react";
import classes from "./index.module.css";
import { Input, InputGroup } from "reactstrap";

class SearchModal extends Component {
  render() {
    const { filter, handleChangeFilter } = this.props;

    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên</label>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="companyName"
                value={filter.companyName}
                placeholder="Tên đối tác cần tìm"
                onChange={(event) => handleChangeFilter(event)}
                type="text"
              />
            </InputGroup>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Mã số thuế</label>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="taxCode"
                value={filter.taxCode}
                placeholder="Mã số thuế"
                onChange={(event) => handleChangeFilter(event)}
                type="text"
              />
            </InputGroup>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Điện thoại</label>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="phone"
                value={filter.phone}
                placeholder="Điện thoại"
                onChange={(event) => handleChangeFilter(event)}
                type="text"
              />
            </InputGroup>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Email</label>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="email"
                value={filter.email}
                placeholder="Email"
                onChange={(event) => handleChangeFilter(event)}
                type="text"
              />
            </InputGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchModal;
