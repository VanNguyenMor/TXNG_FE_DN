import React, { Component } from "react";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { setAlertContext, openAlertContext } from "../../../helpers/common.js";
import classes from './index.module.css';
import '../../../assets/css/global/index.css';
import '../../../assets/css/page/user.css';
import HeaderTable from "components/HeaderTable";
import SearchImg from "../../../assets/img/buttons/searchig.svg";
import SearchModal from "./SearchModal";
import HeadTitleTable from "components/HeadTitleTable";
import { generateStyleTableCol } from '../../../bases/controls/helper';
import { LIMIT_ITEM_IN_PAGE, LOADING_TIME } from "../../../helpers/constant";
import Pagination from "components/Pagination";
import UpdateModal from "./UpdateModal.js";
import UpdatePopupSizeXL from "../../../components/UpdatePopupSizeXL";
import { actionReportSPMananger } from "../../../actions/ReportSPManangerActions";
import { bindActionCreators } from "redux";
import { PLEASE_CHECK_CONNECT, ACCOUNT_CLAIM_FF, ACCOUNT_ID, IS_ADMIN } from "../../../services/Common";

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
  Button,
  InputGroup,

} from "reactstrap";
import Select from "components/Select";

// import Icons from assets
import MenuButton from "../../../assets/img/buttons/menu.png";
import { RRMananger } from "../../../helpers/constant";

class ReportMananger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerTitle: RRMananger,
      data: null,
      limit: LIMIT_ITEM_IN_PAGE,
      beginItem: 0,
      endItem: LIMIT_ITEM_IN_PAGE,
      totalElement: 0,
      listLength: 0,
      currentPage: 0,
      status: null,
    }
  }

  componentWillReceiveProps(nextProp) {
    let { data } = nextProp.reportSPMananger;
    const { limit } = this.state;
    if (data !== this.state.data) {
      if (typeof (data) !== 'undefined') {
        if (typeof (data.list) !== 'undefined') {
          if (data.list !== null) {
            if (typeof (data.list.listReportSp) !== 'undefined') {
              data.list.listReportSp.map((item, key) => {
                item['index'] = key + 1;
                item['collapse'] = false;
              });

              this.setState({
                data: data.list.listReportSp,
                listLength: data.list.total,
                totalPage: Math.ceil(data.list.listReportSp.length / limit),
                isLoaded: data.isLoading, status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            } else {
              this.setState({
                data: data.list.listReportSp,
                isLoaded: data.isLoading,
                status: data.status,
                message: PLEASE_CHECK_CONNECT(data.message)
              });
            }
          }
        }
      }
    }
  }

  componentDidMount() {
    let { data, limit } = this.state;

    this.setState({

      listLength: data.length,
      totalPage: Math.ceil(data.length / limit),
      isLoaded: data.isLoading,
      status: data.status

    });
  }

  componentDidMount() {
    const { limit } = this.state;
    /* Fetch Summary */
    this.fetchSummary(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }));
  }

  componentDidUpdate() {
    // This method is called when the route parameters change
    this.closeStatusModal();
  }

  fetchSummary = (data) => {
    const { requestReportSPMananger } = this.props;
    requestReportSPMananger(data);
  }

  closeStatusModal = () => {
    const { status } = this.state;

    if (status || !status) {
      setTimeout(() => {
        this.setState({ status: null, isLoaded: false });
      }, LOADING_TIME);
    }
  }

  handlePageClick = (data) => {
    let { limit, beginItem, endItem } = this.state;
    let selected = data.selected;
    let offset = Math.ceil(selected * limit);
    let total = 0;

    beginItem = offset;
    endItem = offset + limit;
    this.state.data.map((item, key) => (
      key >= beginItem && key < endItem && total++
    ));

    if (selected > 0) {
      total = (selected * limit) + total;
    } else total = total;

    this.setState({ beginItem: beginItem, endItem: endItem, currentPage: selected + 1, totalElement: total });
  };

  toggle = (el, val) => {
    let { data } = this.state;

    data.filter(item => item.ID === val)
      .map(item => item.collapse = !item.collapse);

    this.setState({ data });
  }

  // TODO: Open modal
  toggleModal = (state, type) => {
    if (this.state[state] && type == 1) {
      return;
    } else {
      this.setState({
        [state]: !this.state[state],
        detail: null,
        errorUpdate: {},
        errorInsert: {},
        currentRow: null,
      });
    }
  };

  // TODO: Update redux type when open the modal
  handleOpenEdit = (id) => {
    this.toggleModal('updateModal')
  }

  renderCreateModal = () => {
    const { roles } = this.state;

    return (
      <UpdateModal
        data={roles}
        handleCheckValidation={this.handleCheckValidation}
        handleNewData={this.handleNewData}
        errorInsert={this.state.errorInsert}
      />
    );
  }

  render() {
    const { hookClass, hookSpacing } = this.props;
    const {
      isLoaded,
      status,
      message,
      activeCreateSubmit,
      headerTitle,
      data,
      beginItem,
      endItem,
      listLength,
      totalElement,
      totalPage,
      updateModal
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
                    <HeaderTable
                      dataReload={() => this.fetchSummary(
                        JSON.stringify({
                          "search": "",
                          "filter": "",
                          "orderBy": "",
                          "page": null,
                          "limit": null
                        })
                      )}
                      screen='menu'
                      //hideCreate={isDisableAdd == false ? false : true}
                      hideSearch={true}
                      typeSearch={
                        <>
                          <div className="w_input">
                            <label className="form-control-label">Thiết lập báo cáo</label>
                            <div>
                              <InputGroup className="input-group-alternative css-border-input">
                                <Input
                                  name="menuName"
                                  //value={filter.menuName}
                                  placeholder="Tên menu..."
                                  type="text"
                                  autoFocus={true}
                                  onChange={(event) => this.handleChangeFilter(event)}
                                />
                              </InputGroup>
                            </div>
                          </div>
                          <div className="mg-btn">
                            <label
                              className="form-control-label"
                            >&nbsp;</label>
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
                              <img src={SearchImg} alt='Tìm kiếm' />
                              <span>Tìm kiếm</span>
                            </Button>
                          </div>
                        </>
                      }
                      searchForm={
                        <SearchModal
                          //filter={filter}
                          handleChangeFilter={this.handleChangeFilter}
                        />
                      }
                      handleSubmitSearchForm={() => this.handleSubmitSearchForm()}
                      moduleTitle='Thêm menu'
                      moduleBody={this.renderCreateModal()}
                      activeSubmit={activeCreateSubmit}
                      //newData={newData}
                      handleCreateInfoData={this.handleCreateInfoData}
                      isPreventForm={true}
                      closeForm={this.closeForm}
                    />

                    <Card className="shadow">
                      <Table className="align-items-center tablecs" responsive>
                        <HeadTitleTable headerTitle={headerTitle} classHeaderColumns={{
                          0: 'table-scale-col table-user-col-1'
                        }} />

                        <tbody ref={ref => this.tableBody = ref}>
                          {
                            Array.isArray(data) && (
                              data
                                .filter((item, key) => key >= beginItem && key < endItem)
                                .map((item, key) => (

                                  <tr key={key} style={{ ...generateStyleTableCol(this.tableBody, (data || []).length) }} className="table-hover-css">
                                    <td className='table-scale-col table-user-col-1'>{key + 1}</td>

                                    <td style={{ textAlign: 'center' }} className='table-scale-col css-img-partner'>{item.spNameDisplay}</td>
                                    <td style={{ textAlign: 'center' }} className='table-scale-col'>{item.Description}</td>
                                    <td style={{ textAlign: 'center' }} className='table-scale-col'>
                                      <input
                                        type="checkbox"
                                      />
                                    </td>
                                    <td>

                                      <ButtonDropdown isOpen={item.collapse} toggle={() => this.toggle(key, item.ID)}>
                                        <DropdownToggle>
                                          <img src={MenuButton} />
                                        </DropdownToggle>
                                        <DropdownMenu>

                                          <DropdownItem
                                            onClick={() => {
                                              this.toggleModal('updateModal');
                                              this.handleOpenEdit(item.id);
                                              this.setState({ currentRow: item })
                                            }}
                                          >
                                            Sửa
                                          </DropdownItem>
                                          <DropdownItem divider />

                                          <DropdownItem
                                            onClick={() => {
                                              this.toggleModal('warningPopupDelModal');
                                              this.setState({ deleteItem: item.id });
                                            }}
                                          >
                                            Xóa
                                          </DropdownItem>

                                        </DropdownMenu>
                                      </ButtonDropdown>

                                    </td>
                                  </tr>
                                ))
                            )
                          }
                        </tbody>
                      </Table>
                    </Card>
                    {
                      // Page of Table
                      Array.isArray(data) && (
                        data.length > 0 && (
                          <Pagination
                            data={data}
                            listLength={listLength}
                            totalPage={totalPage}
                            totalElement={totalElement}
                            handlePageClick={this.handlePageClick}
                          />))
                    }
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

              <UpdatePopupSizeXL
                moduleTitle='Chi tiết báo cáo'
                moduleBody={
                  <UpdateModal
                    //dataMaterial={dataMaterial}
                    //data={detail}
                    id={this.state.editId}
                    handleCheckValidation={this.handleCheckValidation}
                    handleNewData={this.handleNewDataUpdate}
                    errorUpdate={this.state.errorUpdate}
                  />}
                //newData={newData}
                updateModal={updateModal}
                toggleModal={this.toggleModal}
                activeSubmit={activeCreateSubmit}
                handleUpdateInfoData={this.handleUpdateInfoData}
              />
            </Container>
          </div>
        }
      </>

    )
  }

}
const mapStateToProps = (state) => {
  return {
    reportSPMananger: state.ReportSPManangerStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionReportSPMananger, dispatch)
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ReportMananger);
