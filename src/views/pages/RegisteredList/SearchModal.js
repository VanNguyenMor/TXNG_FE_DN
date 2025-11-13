import React, { Component } from "react";
import classes from './index.module.css';
import Select from "components/Select";
import ReactDatetime from "react-datetime";
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";

// reactstrap components
import {
  Input,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText
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
    const { filter, field, handleChangeFilter, handleStatus, handleSelectCS, handleSelectWard, province, district, ward, startDate, endDate, handleChangeStartDate, handleChangeEndDate } = this.props;

    return (
      <div className={classes.searchArea}>
        {/* <div className={classes.searchRowBet}> */}
        <div className="row">
          <div className={`${classes.checkBoxItem} row`} style={{alignItems:'center', marginRight:50}}>
            <input
              name="status"
              type="checkbox"
              value={1}
              checked={filter.status === "1" ? true : false}
              className="checkbox-status"
              onClick={(event) => handleStatus(event)}
            />
            <label className={classes.activeStt} style={{textAlign:'center'}}>Đã thu</label>
          </div>

          <div className={`${classes.checkBoxItem} row`} style={{alignItems:'center'}}>
            <input
              name="status"
              type="checkbox"
              value={0}
              checked={filter.status === "0" ? true : false}
              className="checkbox-status"
              onClick={(event) => handleStatus(event)}
            />
            <label className={classes.noActiveStt} style={{textAlign:'center'}}>Chưa thu</label>
          </div>
        </div>
        
        <div className={classes.searchRow}>
          <div className={`${classes.searchRowItem} ${classes.searchRowBetItem}`}>
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
                      placeholder: "Từ ngày"
                    }}
                    name='startDate'
                    value={filter.startDate}
                    timeFormat={false}
                    onChange={(e) => handleChangeStartDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
            
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
                      placeholder: "Đến ngày"
                    }}
                    name='endDate'
                    value={filter.endDate}
                    timeFormat={false}
                    onChange={(e) => handleChangeEndDate(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
        </div>

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
                handleChange={handleSelectCS}
              />
            </div>
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Tên doanh nghiệp</label>
            <Input
              name="companyName"
              placeholder="Tên doanh nghiệp"
              value={filter.companyName}
              onChange={(event) => handleChangeFilter(event)}
              type="text"
            />
          </div>
        </div>

        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label>Mã số thuế</label>
            <Input
              placeholder="Mã số thuế" 
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
                    placeholder="Điện thoại" 
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

        <div className={classes.searchRow}>
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
                defaultValue={filter.provinceID}
                title='Chọn tỉnh thành'
                data={this.handleFormatProvince(province, 'provinceName')}
                labelName='provinceName'
                val='id'
                handleChange={handleSelectCS}
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
        {filter.districtID == '' ? null :
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
                  handleChange={handleSelectCS}
                />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
};

export default SearchModal;
