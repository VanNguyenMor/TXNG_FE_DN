import React, { Component, useState } from "react";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import classes from './index.module.css';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import {
  Card,
  Table,
  Container,
  Row,
  Spinner,
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
import SelectSearch, { fuzzySearch } from "react-select-search";
import Select from "components/Select";
import { PLEASE_CHECK_CONNECT } from "../../../services/Common";
import { handleGenTree } from "../../../helpers/trees";
import { DATA_TYPE_LIST } from "../../../helpers/constant";
import MenuButton from "../../../assets/img/buttons/menu.png";
import HeadTitleTable from "components/HeadTitleTable";
import { TABLE_REPORT } from "../../../helpers/constant";

class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [{
        value: '',
        name: 'Tìm kiếm...'
      }],
      fields: [],
      fieldName: '',
      currentFilter: null,
      headerTitle: TABLE_REPORT,
      data: [],
    }
  }

  // TODO: Select options in the fields
  onChangeSelect = name => value => {
    if (name == 'fieldID') {
      if (value != null) {
        let fieldName = '';

        const field = this.state.fields.find(p => p.id == value);

        if (field) {
          fieldName = field.fieldName;
        }

        this.setState(previousState => {
          return {
            ...previousState,
            currentFilter: value,
            fieldName
          }
        });

        this.fetchSummary(JSON.stringify({
          "search": "",
          "filter": value == "" ? "" : value,
          "orderBy": "",
          "page": null,
          "limit": null
        }));
      }
    }
  }

  // TODO: Do something in the table
  componentWillReceiveProps(nextProp) {
    const { fetching, fetchingUpdate, fetchingDelete, limit, currentFilter } = this.state;
    let { data } = nextProp.access;
    let newData = [];
    let collapseList = [];
    let fieldData = nextProp.field.data;
    let fieldDataParent = [];
    let haveRoot = false;

    if (fieldData !== this.state.field) {
      if (typeof (fieldData) !== 'undefined') {
        if (fieldData.field !== null) {
          if (typeof (fieldData.field) !== 'undefined') {
            fieldData.field.fields
              .filter(item => item.parentID === null)
              .map(item => haveRoot = true);

            if (haveRoot) {
              fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

              fieldDataParent.map((item, key) => {
                item['index'] = key + 1
              });
            } else {
              // Search Element in tree
              fieldData.field.fields.map((item, key, array) => (
                key === 0 && (item.parentID = null)
              ));

              fieldDataParent = handleGenTree(fieldData.field.fields, 'fieldName');

              fieldDataParent.map((item, key) => {
                item['index'] = key + 1
              });
            }

            this.setState({
              //fieldAll: fieldData.field.fields,
              field: fieldDataParent,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });

          } else {
            this.setState({
              field: fieldDataParent,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }
      }
    }

    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.access) !== 'undefined') {
          if (data.access !== null) {
            if (typeof (data.access.informations) !== 'undefined') {
              newData = data.access.informations;

              newData.map(item => (
                collapseList.push({ id: item.id, collapse: false })
              ));

              newData.map((item, key) => {
                item['parentID'] = item.informID === null ? '' : item.informID
              });

              newData = handleGenTree(data.access.informations, 'name');
              newData.map((item, key) => {
                item['index'] = key + 1
              });

              this.setState({ data: [] });
              this.setState({
                data: newData,
                history: newData,
                dataAll: data.access.informations,
                selected: data.access.informations,
                collapseList: collapseList,
                listLength: newData.length,
                totalPage: Math.ceil(newData.length / limit),
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: [],
                history: [],
                dataAll: data.access.accesses,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.newinfo) !== 'undefined') {
          if (data.newinfo !== null) {
            if (data.status) {
              newData = this.state.history;
              newData = newData.filter(item => item.id === data.newinfo.id);

              this.setState({
                data: newData,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: [],
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.detail) !== 'undefined') {
          if (data.detail !== null) {
            if (data.status) {
              this.setState({ detail: null });
              this.setState({
                detail: data.detail,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                detail: null,
                isLoaded: false,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }

        if (typeof (data.accessPopup) !== 'undefined') {
          if (data.accessPopup !== null) {
            this.setState({
              dataInPopup: data.accessPopup,
              isLoaded: false,
              status: data.status,
              message: PLEASE_CHECK_CONNECT(data.message)
            });
          }
        }

        // if (typeof (data.create) !== 'undefined') {
        //   if (data.create !== null) {
        //     if (data.status && !fetching) {
        //       /* Fetch Summary */
        //       this.setState({ data: [] });
        //       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
        //       this.setState({ fetching: true });
        //     }

        //     this.setState({
        //       create: data.create,
        //       isLoaded: false,
        //       status: data.status,
        //       message: PLEASE_CHECK_CONNECT(data.message)
        //     });
        //   }
        // }

        // if (typeof (data.update) !== 'undefined') {


        //   if (data.status && !fetchingUpdate) {
        //     setTimeout(() => {
        //       /* Fetch Summary */
        //       this.setState({ data: [] });
        //       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
        //       this.setState({ fetchingUpdate: true });
        //     }, 1000);
        //   }

        //   this.setState({
        //     update: data.update,
        //     isLoaded: false,
        //     status: data.status,
        //     message: PLEASE_CHECK_CONNECT(data.message)
        //   });

        // }

        // if (typeof (data.delete) !== 'undefined') {
        //   if (data.status == true && !fetchingDelete) {
        //     setTimeout(() => {
        //       /* Fetch Summary */
        //       this.setState({ data: [] });
        //       this.fetchSummary(JSON.stringify({ "search": "", "filter": currentFilter, "orderBy": "", "page": null, "limit": null }));
        //       this.setState({ fetchingDelete: true });
        //     }, 1000);
        //   }
        //   if (data.status != true) {
        //     this.setState({ delmessage: PLEASE_CHECK_CONNECT(data.message) })
        //     this.toggleModal('popupMessage');
        //   }
        //   this.setState({
        //     update: data.update,
        //     isLoaded: false,
        //     status: data.status,
        //     message: PLEASE_CHECK_CONNECT(data.message)
        //   });
        // }
      }
    }
  }

  render() {
    const { hookClass, hookSpacing } = this.props;
    const {
      isLoaded,
      status,
      message,
      options,
      currentCompanyID,
      fields,
      fieldName,
      currentFilter,
      headerTitle,
      data
    } = this.state;
    const statusPopup = { status: status, message: message };

    return (
      <>
        {
          <div className={`${classes.wrapper} ${typeof (hookClass) !== 'undefined' && hookClass}`}>
            <Container fluid className={typeof (hookSpacing) !== 'undefined' && hookSpacing}>
              {
                isLoaded ? (
                  <div style={{ display: 'table', margin: 'auto' }}>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                  </div>
                ) : (
                  <Row>
                    <div className="col">
                      {/* Content fields */}
                      <div className={classes.content_main}>
                        {/* Menu list */}
                        <div className={classes.content_menu_list}>
                          <label className="form-control-label">Danh sách báo cáo</label>

                          {/* List rp */}
                          <div className={classes.form_menu_list}>
                            {/* Rp components */}
                            <div className={classes.rp_components}>
                              {/* Title fields */}
                              <div className={classes.list_of_title}>
                                Báo cáo số 1
                              </div>
                              {/* End title */}

                              {/* Checkbox fields */}
                              <div className={classes.list_of_checkbox}>
                                <input type="checkbox" />
                              </div>
                              {/* End checkbox */}
                            </div>
                            {/* End RP */}

                            {/* Rp components */}
                            <div className={classes.rp_components}>
                              {/* Title fields */}
                              <div className={classes.list_of_title}>
                                Báo cáo số 2
                              </div>
                              {/* End title */}

                              {/* Checkbox fields */}
                              <div className={classes.list_of_checkbox}>
                                <input type="checkbox" />
                              </div>
                              {/* End checkbox */}
                            </div>
                            {/* End RP */}

                            {/* Rp components */}
                            <div className={classes.rp_components}>
                              {/* Title fields */}
                              <div className={classes.list_of_title}>
                                Báo cáo số 3
                              </div>
                              {/* End title */}

                              {/* Checkbox fields */}
                              <div className={classes.list_of_checkbox}>
                                <input type="checkbox" />
                              </div>
                              {/* End checkbox */}
                            </div>
                            {/* End RP */}
                          </div>
                          {/* End list */}
                        </div>
                        {/* End menu */}

                        {/* Table fields */}
                        <div className={classes.content_table_views}>
                          <label className="form-control-label">Tên báo cáo</label>

                          {/* Report fields */}
                          <div className={classes.report_table_views}>
                            <p>Tham số</p>

                            {/* Fields options */}
                            <div className={classes.options_fields}>
                              {/* Name fields */}
                              <div className={classes.options_name_fields}>

                                <Input
                                  className="css-search-input"
                                  name="name"
                                  //  value={filter.name}
                                  placeholder="Nhóm quyền"
                                  type="text"
                                  autoFocus={true}
                                  onChange={(event) => this.handleChangeFilter(event)}
                                />
                              </div>
                              {/* End name fields */}

                              {/* Button fields */}
                              <div className={classes.options_button_fields}>
                                {/* Clear */}
                                {/* <button className={classes.elements_in_options}>
                                  Tải lại
                                </button> */}
                                <Button
                                  // style={{ margin: 0 }}
                                  className='btn-warning-cs'
                                  color="default" type="button" size="md"
                                  onClick={() => {
                                    this.handleSubmitSearchForm();
                                    // this.onComfirmSearch()
                                  }
                                  }
                                >
                                  <span>Tìm kiếm</span>
                                </Button>
                                {/* End clear */}

                                {/* View */}
                                <Button
                                  className='btn-success-cs'
                                  color="default" type="button" size="md"
                                  onClick={() => {
                                    this.handleSubmitSearchForm();
                                    // this.onComfirmSearch()
                                  }
                                  }
                                >
                                  <span>Tải lại</span>
                                </Button>
                                {/* End View */}

                                {/* Select type of file list */}
                                {/* <select className={classes.select_options}>
                                  <option>Excel</option>
                                  <option>PDF</option>
                                </select> */}
                                <Select
                                  //hidenTitle={true}
                                  name='name'
                                  labelName='name'
                                  val='id'
                                  title='Chọn tệp tin'
                                  //lableMark={crrRolesName}
                                  handleChange={this.handleSelect}
                                />
                                {/* End select */}
                              </div>
                              {/* End button fields */}
                            </div>
                            {/* End fields */}

                            {/* Fields table */}
                            <div className={classes.table_fields}>
                              <Card className="shadow">
                                <Table className="align-items-center tablecs table-css-access" responsive>
                                  <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                                    0: 'table-scale-col table-user-col-1'
                                  }} />

                                  <tbody>
                                  </tbody>
                                </Table>
                              </Card>
                            </div>
                            {/* End table */}
                          </div>
                          {/* End fields */}
                        </div>
                        {/* End table */}
                      </div>
                      {/* End content */}
                    </div>
                  </Row>
                )
              }


              {
                //Set Alert Context
                setAlertContext(statusPopup)
              }

              {
                //Open Alert Context
                openAlertContext(statusPopup)
              }
            </Container>
          </div>
        }
      </>

    )
  }

}
const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ReportView);
