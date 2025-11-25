import React, { Component } from "react";
import classes from "./index.module.css";
import { Guid } from "guid-typescript";
import { bindActionCreators } from "redux";
import compose from "recompose/compose";
import { actionStampPlate } from "../../../actions/StampTemplateActions";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { connect } from "react-redux";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";

// reactstrap components
import { Input, InputGroup } from "reactstrap";
import moment from "moment";

class AddNewQRSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSubmit: false,
      fileView: null,
      file: null,
      id: null,
      name: "",
      executedDate: null,
      stampPriceDetail: [],
    };
    this.refFileImage = null;
  }
  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        stampPriceDetail: [],
        id: null,
        executedDate: "",
        name: "",
        id: null,
      };
    });
  }
  async componentDidMount() {
    const { id, onHandleChangeValue, getAllStampPrice, getDetailStampPrice } =
      this.props;

    getAllStampPrice(
      JSON.stringify({
        search: "",
        filter: "",
        orderBy: "",
        page: null,
        limit: null,
      })
    );

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

    // if (id) {
    //   const result = await getDetailStampPrice(id)

    //   const data = ((result || {}).data || {}).data || null;

    //   if (!data) {
    //     alert('Không tìm thấy bảng giá tem này');
    //   }
    //   const stampPrice = data.stampPriceDetail || '[]'

    //   const stampPriceDetail = (stampPrice || [])
    //     .map(item => {
    //       return {
    //         id: Guid.create().toString(),
    //         quantityFrom: item.quantityFrom,
    //         stampPriceID: '',
    //         quantityTo: item.quantityTo,
    //         amount: item.amount
    //       }
    //     })

    //   this.setState(previousState => {
    //     return {
    //       ...previousState,
    //       id: data.id,
    //       name: data.name,
    //       executedDate: data.executedDate,
    //       stampPriceDetail
    //     }
    //   }, () => {
    //     if (this.props.onHandleChangeValue) {
    //       this.props.onHandleChangeValue(this.state);
    //     }
    //   })
    // }
  }

  onAddArea = () => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    let { error } = this.state;
    let n = stampPriceDetail.length;
    let quantityFrom;

    if (stampPriceDetail.length >= 1) {
      for (let i = 0; i < n; i++) {
        quantityFrom = Number(stampPriceDetail[i].quantityTo) + 1;
      }
    }
    stampPriceDetail.push({
      id: Guid.create().toString(),
      quantityFrom: quantityFrom || 0,
      stampPriceID: "",
      quantityTo: 0,
      amount: 0,
    });

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          stampPriceDetail,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onDeleteArea = (id) => () => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    const priceStamps = stampPriceDetail.find((p) => p.id == id);

    if (priceStamps) {
      const priceNew = stampPriceDetail.filter((p) => p.id !== id);
      this.setState(
        (previousState) => {
          return {
            ...previousState,
            stampPriceDetail: priceNew,
          };
        },
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    } else {
      alert("Không tìm thấy dữ liệu này");
    }
  };

  onChangeQuantityFrom = (id) => (e) => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    const value = e.target.value;
    const priceStamps = stampPriceDetail.find((p) => p.id === id);
    if (priceStamps) {
      priceStamps.quantityFrom = value;
      this.setState(
        (previousState) => {
          return {
            ...previousState,
            stampPriceDetail,
          };
        },
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    }
  };

  onChangeQuantityTo = (id) => (e) => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    const value = e.target.value;
    let error = {};
    const priceStamps = stampPriceDetail.find((p) => p.id === id);

    if (priceStamps) {
      priceStamps.quantityTo = value;
      this.setState(
        (previousState) => {
          return {
            ...previousState,
            stampPriceDetail,
          };
        },
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    }
  };

  onChangeAmount = (id) => (e) => {
    const stampPriceDetail = [...this.state.stampPriceDetail];
    const value = e.target.value;
    const priceStamps = stampPriceDetail.find((p) => p.id === id);
    if (priceStamps) {
      priceStamps.amount = value;
      this.setState(
        (previousState) => {
          return {
            ...previousState,
            stampPriceDetail,
          };
        },
        () => {
          if (this.props.onHandleChangeValue) {
            this.props.onHandleChangeValue(this.state);
          }
        }
      );
    }
  };

  onChangeValue = (name) => (e) => {
    const value = e.target.value;

    this.setState(
      (previousState) => {
        return {
          ...previousState,
          [name]: value,
        };
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleChangeFromDate = (event) => {
    let _executedDate = event ? new Date(event) : "";
    this.setState(
      {
        executedDate: new Date(_executedDate),
      },
      () => {
        this.props.onHandleChangeValue(this.state);
      }
    );
  };

  render() {
    const { errorInsert, id } = this.props;
    const { stampPriceDetail, name, executedDate, error } = this.state;
    const numberWithCommas = (value, coma) => {
      value = value || "";
      coma = coma || ".";

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
    };

    let dateConvert = executedDate && moment(executedDate).format("DD-MM-YYYY");
    return (
      <>
        <div
          className={`${classes.formControl} css-system-stamp`}
          style={{ height: 360 }}
        >
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Tên sản phẩm&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  readOnly
                  placeholder="Tên sản phẩm"
                  type="text"
                  name="name"
                  value={name}
                  defaultValue={name}
                  onChange={this.onChangeValue("name")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert.name || ""}
              </p>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Vùng sản xuất&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  readOnly
                  placeholder="Vùng sản xuất"
                  type="text"
                  name="name"
                  value={name}
                  defaultValue={name}
                  onChange={this.onChangeValue("name")}
                />
              </InputGroup>
              <p className="form-error-message margin-bottom-0">
                {errorInsert.name || ""}
              </p>
            </div>
          </div>
          <div className={classes.rowItem}>
            <label className="form-control-label">
              Ảnh QR&nbsp;<b style={{ color: "red" }}>*</b>
            </label>
            <div className={classes.inputArea}>
              <img style={{ width: 250, height: 250 }} src={NoImg} alt="..." />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ConfigSystemStore: state.ConfigSystemStore,
    stampTemplate: state.StampPlateStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(configSystemAction, dispatch),
    ...bindActionCreators(actionStampPlate, dispatch),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AddNewQRSystem
);
