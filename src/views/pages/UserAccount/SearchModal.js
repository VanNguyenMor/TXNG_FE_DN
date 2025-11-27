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

  render() {
    const { filter, roles, handleChangeFilter, handleStatus, handleSelect } = this.props;

    return (
      <div className={classes.searchArea}>
        {/* <div className={classes.searchRow}>
          <div className={classes.checkBoxItem}>
            <input 
              name="status" 
              type="checkbox" 
              value={1}
              checked={filter.status === "1" ? true : false}
              className="checkbox-status"
              onClick={(event) => handleStatus(event)}
            />
            <label className={classes.activeStt}>Đang sử dụng</label>
          </div>

          <div className={classes.checkBoxItem}>
            <input 
              name="status" 
              type="checkbox" 
              value={0}
              checked={filter.status === "0" ? true : false}
              className="checkbox-status"
              onClick={(event) => handleStatus(event)}
            />
            <label className={classes.noActiveStt}>Ngưng sử dụng</label>
          </div>
        </div> */}

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Nhóm quyền</label>
            <div>
              <Select
                name="roleIDs"
                defaultValue={filter.roleIDs}
                title='Chọn nhóm quyền'
                data={roles}
                labelName='name'
                val='id'
                handleChange={handleSelect}
              />
            </div>
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={`${classes.searchRowItem}`}>
            <label>Tên đăng nhập</label>
            <Input
              className="css-search-input"
              placeholder="Tên đăng nhập"
              name="userName"
              value={filter.userName}
              onChange={(event) => handleChangeFilter(event)}
              type="text"
            />
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Họ và tên</label>
            <Input
              className="css-search-input"
              placeholder="Họ và tên"
              type="text"
              name="fullName"
              value={filter.fullName}
              onChange={(event) => handleChangeFilter(event)}
            />
          </div>
        </div>

        {/* <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Điện thoại</label>
            <Validate
              validations={validations}
              rules={rules}
            >
              {({ validate, errorMessages }) => (
                <div>
                  <Input
                    className="css-search-input"
                    name="phone"
                    placeholder="Điện thoại"
                    defaultValue={filter.phone}
                    type="number"
                    onChange={validate}
                    onKeyUp={(event) => handleChangeFilter(event)}
                  />
                  <p className={classes.error}>{errorMessages.phone}</p>
                </div>
              )}
            </Validate>
          </div>
        </div> */}

        {/* <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Email</label>
            <Validate
              validations={validations}
              rules={rules}
            >
              {({ validate, errorMessages }) => (
                <div>
                  <Input
                    name="email"
                    placeholder="Email"
                    type="email"
                    defaultValue={filter.email}
                    onChange={validate}
                    onKeyUp={(event) => handleChangeFilter(event)}
                  />
                  <p className={classes.error}>{errorMessages.email}</p>
                </div>
              )}
            </Validate>
          </div>
        </div> */}
      </div>
    );
  }
};

export default SearchModal;
