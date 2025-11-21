import React, { Component } from "react";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import { Card, Table } from "reactstrap";
import { InputGroup } from "reactstrap";
import classes from "./index.module.css";
import ModalTable from "components/ModalTable/ModalTable";

class InsertOrUpadte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      batchId: null,
    };
  }

  componentWillUnmount() {
    this.setState((previousState) => {
      return {
        ...previousState,
        id: null,
      };
    });
  }

  async componentDidMount() {
    const { onHandleChangeValue } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }
    this.setState(
      (previousState) => {
        return {
          ...previousState,
        };
      },
      () => {
        if (onHandleChangeValue) {
          onHandleChangeValue(this.state);
        }
      }
    );

    this.focusInput();
  }

  focusInput = () => {
    if (this.refInputName) {
      const timeOut = setTimeout(() => {
        this.refInputName.focus();

        clearTimeout(timeOut);
      }, 100);
    }
  };

  onChangeSelect = (name) => (value) => {
    const numericValue = Number(value);
    const selectedOption = this.props.DIARY_OPTIONS?.find(
      (item) => item.id === numericValue
    );

    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: value,
        ...(name === "diaryId" && {
          placeVal: selectedOption?.location || "",
          productVal: selectedOption?.product || "",
          unitVal: selectedOption?.unit || "",
        }),
      }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  onChangeValue = (name) => (e) => {
    let value = e.target.value;

    if (name === "marketId" || name === "quantity") {
      value = Number(value);
    }

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

  onChangeSelectType = () => {
    this.resetFieldValue();
  };

  resetFieldValue = () => {
    alert();
  };

  handleFileChange = (files) => {
    this.setState({ file: files[0]?.name || "" });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  calculateTotalAmount = (quantity, price, vatRate) => {
    const subtotal = Number(quantity) * Number(price);
    const vatFactor = 1 + Number(vatRate) / 100;

    const totalAmount = subtotal * vatFactor;

    return Math.round(totalAmount);
  };

  loggingColumnsConfig = [
    {
      header: "STT",
      className: "text-center",
      style: { width: "50px" },
      render: (item, index) => item.stt || index + 1,
    },
    {
      header: "Thời gian",
      accessor: "thoiGian",
    },
    {
      header: "Loại",
      accessor: "loai",
    },
    {
      header: "Số lượng",
      accessor: "soLuong",
    },
    {
      header: "ĐVT",
      accessor: "dvt",
    },
    {
      header: "Người thực hiện",
      accessor: "nguoiThucHien",
    },
  ];

  render() {
    const { batchId } = this.state;

    const { errors, LOGGING_DATA } = this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Nguyên vật liệu:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Đơn vị tính:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>

        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Kho hàng:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Đầu kỳ:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Trong kỳ:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Cuối kỳ:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Từ ngày:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>
        <div className="wrap-insert-or-update-zone-item">
          <label className="wrap-insert-or-update-zone-item-label">
            Đến ngày:
          </label>
          <div className="wrap-insert-or-update-zone-item-box">
            <InputGroup className="input-group-alternative css-border-input">
              <input
                readOnly
                type="text"
                className="wrap-insert-or-update-zone-item-input"
              />
            </InputGroup>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="mt-4 mb-3">Danh sách Nhật ký hoạt động</h3>
        <ModalTable
          data={LOGGING_DATA || []}
          columns={this.loggingColumnsConfig}
          classes={classes}
        />
      </div>
    );
  }
}

export default InsertOrUpadte;
