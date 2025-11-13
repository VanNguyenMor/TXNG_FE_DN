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
    const { filter, field, handleChangeFilter, handleStatus, handleSelect,handleSelectWard, province, district,ward } = this.props;
    
    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Ngành nghề</label>
            <div>
              <Select
                name="fieldID"
                defaultValue={filter.fieldID}
                title='Chọn ngành nghề'
                data={field}
                labelName='fieldName'
                val='id'
                handleChange={handleSelect}
              />
            </div>
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên doanh nghiệp</label>
            <Input
              name="comapanyName"
              value={filter.comapanyName}
              onChange={(event) => handleChangeFilter(event)}
              type="text"
            />
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Mã số thuế</label>
            <Input
              //placeholder="Họ và tên" 
              type="number"
              name="taxCode"
              value={filter.taxCode}
              onChange={(event) => handleChangeFilter(event)}
            />
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Điện thoại</label>
            <Validate
              validations={validations}
              rules={rules}
            >
              {({ validate, errorMessages }) => (
                <div>
                  <Input
                    name="phone"
                    //placeholder="Điện thoại" 
                    defaultValue={filter.phone}
                    type="tel"
                    onChange={validate}
                    onKeyUp={(event) => handleChangeFilter(event)}
                  />
                  <p className={classes.error}>{errorMessages.phone}</p>
                </div>
              )}
            </Validate>
          </div>
        </div>

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
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tỉnh Thành</label>
            <div>
              <Select
                name="provinceID"
                //defaultValue={province.id}
                //defaultValue={filter.provinceID}
                title='Chọn tỉnh thành'
                data={this.handleFormatProvince(province, 'provinceName')}
                labelName='provinceName'
                val='id'
                handleChange={handleSelect}
              />
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Quận Huyện</label>
            <div>
              <Select
                name="districtID"
                defaultValue={filter.districtID}
                title='Chọn quận huyện'
                data={district}
                labelName='districtName'
                val='id'
                handleChange={handleSelectWard}
              />
            </div>
          </div>
        </div>
        {filter.districtID==''?null:
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Phường Xã</label>
            <div>
              <Select
                name="wardID"
                defaultValue={filter.wardID}
                title='Chọn phường xã'
                data={ward}
                labelName='nameSearch'
                val='id'
                handleChange={handleSelect}
              />
            </div>
          </div>
        </div> 
        }*/}
      </div>
    );
  }
};

export default SearchModal;
