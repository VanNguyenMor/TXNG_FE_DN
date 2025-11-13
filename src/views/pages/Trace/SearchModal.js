import React, { Component } from "react";
import classes from './index.module.css';
import ReactDatetime from "react-datetime";
import Select from "components/Select";
import "react-datetime/css/react-datetime.css";
import SelectSearch, { fuzzySearch } from "react-select-search";
import SelectTree from "components/SelectTree";
import SelectParent from "components/SelectParent";

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

  onSelectChange = (value, name) => {
    let { filter } = this.state;

    if (value === null) value = "";
    filter[name] = value;

    this.setState({ filter });

  }

  render() {
    const { filter, product, handleChangeFilter, dataDefault, handleSelect, handleChangeFromDate,
      handleChangeToDate, currentFilter, field, fieldAll, options, onSelectChange, data, fromDate, toDate } = this.props;


    return (
      <div className={classes.searchArea}>
        <div className={classes.searchRow}>
          <div className="row">
            <div className={classes.searchRowItem}
              style={{
                width: "50%",
                paddingLeft: 20,
                paddingRight: 10
              }}
            >
              <label className="form-control-label">Từ ngày</label>
              <FormGroup >
                <InputGroup className="input-group-alternative css-border-input">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Từ ngày"
                    }}
                    name='fromDate'
                    value={fromDate}
                    timeFormat={false}
                    onChange={(e) => onSelectChange(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>

            <div className={classes.searchRowItem}
              style={{
                width: "50%",
                paddingLeft: 10,
                paddingRight: 20
              }}
            >
              <label className="form-control-label">Đến ngày</label>
              <FormGroup>
                <InputGroup className="input-group-alternative css-border-input">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "Đến ngày"
                    }}
                    name='toDate'
                    value={toDate}
                    timeFormat={false}
                    onChange={(e) => onSelectChange(e)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label className="form-control-label">Doanh nghiệp/Người sản xuất</label>
            <div>
              <SelectSearch
                options={options}
                value={options.id}
                name='companyID'
                //className={`${classes.selectSearchBox} select-search-box`}
                onChange={(value) => onSelectChange(value, 'companyID')}
                search
                filterOptions={fuzzySearch}
                placeholder="Tìm kiếm..."
              />
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label className="form-control-label">Ngành nghề</label>
            <div>
              <SelectTree
                //hidenTitle={true}
                title='Chọn ngành nghề'
                data={field}
                dataAll={fieldAll}
                name='field'
                // disableParent={true}
                selected={currentFilter}
                labelName='fieldName'
                fieldName='fieldName'
                val='id'
                handleChange={onSelectChange}
              />
            </div>
          </div>
        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchRowItem}>
            <label className="form-control-label">Sản phẩm</label>
            <div>
              <SelectParent
                labelName='name'
                data={product}
                val='id'
                name='product'
                parentId='materialGroupID'
                parentName='materialGroupName'
                title='Chọn sản phẩm'
                handleChange={onSelectChange}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
};

export default SearchModal;
