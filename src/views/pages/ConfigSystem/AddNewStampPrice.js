import React, { Component } from "react";
import SelectTree from "components/SelectTree";
import Select from "components/Select";
import classes from './index.module.css';
import { Guid } from 'guid-typescript';
import Validate from "react-validate-form";
import { rules, validations, checkPasswordConfirm } from "../../../helpers/validation";
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { configSystemAction } from '../../../actions/ConfigSystemAction'
import { connect } from "react-redux";
import ReactDatetime from "react-datetime";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import IconAdd from '../../../assets/img/buttons/add.png';
import IconDelete from '../../../assets/img/buttons/delete.png';

// reactstrap components
import {
  Input,
  InputGroup,
  Button,
  FormGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { event } from "jquery";
import moment from "moment";

class AddNewStampPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSubmit: false,
      fileView: null,
      file: null,
      id: null,
      name: '',
      executedDate: null,
      stampPriceDetail: [],
    }
    this.refFileImage = null;
  }
  componentWillUnmount() {
    this.setState(previousState => {
      return {
        ...previousState,
        stampPriceDetail: [],
        id: null,
        executedDate: '',
        name: '',
        id: null
      }
    })
  }
  async componentDidMount() {

    const { id, onHandleChangeValue, getAllStampPrice, getDetailStampPrice } = this.props;

    getAllStampPrice(JSON.stringify({
      "search": "",
      "filter": "",
      "orderBy": "",
      "page": null,
      "limit": null
    }))


    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

    if (id) {
      const result = await getDetailStampPrice(id)

      const data = ((result || {}).data || {}).data || null;

      if (!data) {
        alert('Không tìm thấy bảng giá tem này');
      }
      const stampPrice = data.stampPriceDetail || '[]'

      const stampPriceDetail = (stampPrice || [])
        .map(item => {
          return {
            id: Guid.create().toString(),
            quantityFrom: item.quantityFrom,
            stampPriceID: '',
            quantityTo: item.quantityTo,
            amount: item.amount
          }
        })

      this.setState(previousState => {
        return {
          ...previousState,
          id: data.id,
          name: data.name,
          executedDate: data.executedDate,
          stampPriceDetail
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      })
    }
  }

  onAddArea = () => {
    // console.log(priceStamp);
    const stampPriceDetail = [...this.state.stampPriceDetail];
    let { error } = this.state;
    let n = stampPriceDetail.length
    let quantityFrom;

    if (stampPriceDetail.length >= 1) {
      for (let i = 0; i < n; i++) {
        quantityFrom = Number(stampPriceDetail[i].quantityTo) + 1;

      }
    }
    stampPriceDetail.push({
      id: Guid.create().toString(),
      quantityFrom: quantityFrom || 0,
      stampPriceID: '',
      quantityTo: 0,
      amount: 0
    });

    this.setState(previousState => {
      return {
        ...previousState,
        stampPriceDetail
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  onDeleteArea = id => () => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    const priceStamps = stampPriceDetail.find(p => p.id == id)

    if (priceStamps) {
      const priceNew = stampPriceDetail.filter(p => p.id !== id)
      this.setState(previousState => {
        return {
          ...previousState,
          stampPriceDetail: priceNew
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    } else {
      alert('Không tìm thấy dữ liệu này');
    }
  }

  onChangeQuantityFrom = id => e => {
    const stampPriceDetail = [...this.state.stampPriceDetail]
    const value = e.target.value;
    const priceStamps = stampPriceDetail.find(p => p.id === id)
    if (priceStamps) {
      priceStamps.quantityFrom = value;
      this.setState(previousState => {
        return {
          ...previousState,
          stampPriceDetail
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  onChangeQuantityTo = id => e => {
    const stampPriceDetail = [...this.state.stampPriceDetail]
    const value = e.target.value;
    let error = {};
    const priceStamps = stampPriceDetail.find(p => p.id === id)

    if (priceStamps) {
      priceStamps.quantityTo = value;
      this.setState(previousState => {
        return {
          ...previousState,
          stampPriceDetail
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  onChangeAmount = id => e => {
    const stampPriceDetail = [...this.state.stampPriceDetail]
    const value = e.target.value;
    const priceStamps = stampPriceDetail.find(p => p.id === id)
    if (priceStamps) {
      priceStamps.amount = value;
      this.setState(previousState => {
        return {
          ...previousState,
          stampPriceDetail
        }
      }, () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      });
    }
  }

  onChangeValue = name => e => {
    const value = e.target.value;

    this.setState(previousState => {
      return {
        ...previousState,
        [name]: value
      }
    }, () => {
      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(this.state);
      }
    });
  }

  handleChangeFromDate = (event) => {

    let _executedDate = event ? new Date(event) : ''
    this.setState({
      executedDate: new Date(_executedDate)
    }, () => {
      this.props.onHandleChangeValue(this.state);
    });
  }

  render() {
    const { errorInsert, id } = this.props;
    const { stampPriceDetail, name, executedDate, error } = this.state;
    const numberWithCommas = (value, coma) => {
      value = value || '';
      coma = coma || '.';

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
    };

    let dateConvert = executedDate && moment(executedDate).format('DD-MM-YYYY')
    return (
      <>
        <div className={`${classes.formControl} css-system-stamp`} style={{ height: 360 }}>
          <div className={classes.rowItem}>
            <label
              className="form-control-label"
            >
              Tên bảng giá&nbsp;<b style={{ color: 'red' }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  placeholder="Tên bảng giá"
                  type="text"
                  name='name'
                  value={name}
                  defaultValue={name}
                  onChange={this.onChangeValue('name')}
                />
              </InputGroup>
              <p className='form-error-message margin-bottom-0'>{errorInsert.name || ''}</p>
            </div>
          </div>
          <div className={classes.rowItem}>
            {/* <div className="" style={{ display: 'flex' }} > */}
            <label className="form-control-label">Ngày hiệu lực&nbsp;<b style={{ color: 'red' }}>*</b></label>
            <div className={classes.inputArea}>
              <FormGroup >
                <InputGroup className="input-group-alternative css-border-input ">
                  <InputGroupAddon addonType="prepend" style={{ height: 32 }}>
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>

                  <ReactDatetime
                    inputProps={{
                      placeholder: "Ngày có hiệu lực"
                    }}
                    value={dateConvert}
                    timeFormat={false}
                    dateFormat="DD-MM-YYYY"
                    onChange={(e) => this.handleChangeFromDate(e)}
                  />
                </InputGroup>
                <p className='form-error-message margin-bottom-0'>{errorInsert.executedDate || ''}</p>
              </FormGroup>
              {/* </div> */}

            </div>
          </div>

          <div className={classes.formControl} style={{ display: 'block' }}>
            <label
              className="form-control-label"
            >
              Chi tiết bảng giá&nbsp;<b style={{ color: 'red' }}>*</b>
            </label>
            <div style={{ alignItems: 'end' }}>
              <p className='form-error-message margin-bottom-0'>{errorInsert.stampPriceDetail || ''}</p>
              <p className='form-error-message margin-bottom-0'>{(error || {}).stampPriceDetail || ''}</p>
              <div className='wrap-insert-or-update-type-zone-property-table' style={{ marginTop: 5 }}>
                <table className='wrap-insert-or-update-type-zone-property-list'>
                  <thead className='wrap-insert-or-update-type-zone-property-list-header'>
                    <tr className='wrap-insert-or-update-type-zone-property-list-header-row'>
                      <th className='wrap-insert-or-update-type-zone-property-list-header-row-col-1'>STT</th>
                      <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>TỪ</th>
                      <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>ĐẾN</th>
                      <th className='wrap-insert-or-update-type-zone-property-list-header-row-col'>GIÁ</th>
                      <th className="wrap-insert-or-update-type-zone-property-list-header-row-col wrap-insert-or-update-type-zone-property-list-header-row-4"></th>
                      {/* <th className='wrap-insert-or-update-type-zone-property-list-header-row-col wrap-insert-or-update-type-zone-property-list-header-row-4'></th> */}
                    </tr>
                  </thead>
                  {(stampPriceDetail || []).sort().map((item, key) => {
                    return (
                      <tr key={item.id} >
                        <td style={{ textAlign: 'center' }} className="border-select-stamp">{key + 1}</td>
                        <td className='border-select-stamp'>
                          <input
                            style={{ textAlign: 'right' }}
                            onChange={this.onChangeQuantityFrom(item.id)}
                            placeholder='0' type='number'
                            value={item.quantityFrom}
                            className='wrap-insert-or-update-type-zone-property-list-body-row-col-input' />
                        </td>
                        <td className='border-select-stamp'>
                          <input
                            style={{ textAlign: 'right' }}
                            onChange={this.onChangeQuantityTo(item.id)}
                            placeholder='0'
                            type='number'
                            value={item.quantityTo}
                            className='wrap-insert-or-update-type-zone-property-list-body-row-col-input' />
                        </td>
                        <td className='border-select-stamp'>
                          <input
                            style={{ textAlign: 'right' }}
                            onChange={this.onChangeAmount(item.id)}
                            placeholder='0'
                            type='number'
                            value={item.amount}
                            className='wrap-insert-or-update-type-zone-property-list-body-row-col-input' />
                        </td>
                        <td style={{ textAlign: 'center' }} className='border-select-stamp'>
                          {(key == stampPriceDetail.length - 1) && (
                            <button
                              onClick={this.onDeleteArea(item.id)}
                              className='wrap-insert-or-update-type-zone-property-list-body-row-col-delete'>
                              <img className='wrap-insert-or-update-type-zone-property-list-body-row-col-delete-icon' src={IconDelete} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </table>
                <p className='form-error-message margin-bottom-0'>{(error || {}).quantityTo || ''}</p>
              </div>
              <div className='wrap-insert-or-update-type-zone-property-add' >
                <button onClick={this.onAddArea} className='wrap-insert-or-update-type-zone-property-add-button' style={{ width: 25, height: 25 }}>
                  <img className='wrap-insert-or-update-type-zone-property-add-button-icon' style={{ width: 20, height: 20 }} src={IconAdd} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </>
    );
  }
};

const mapStateToProps = state => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
    stampTemplate: state.StampPlateStore
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
    ...bindActionCreators(actionStampPlate, dispatch),
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddNewStampPrice);
