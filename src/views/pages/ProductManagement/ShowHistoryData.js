import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import HistoryListTable from "components/HistoryListTable/HistoryListTable";
import { fetchData } from "helpers/fetchData";
import { toast } from "react-toastify";
import { getErrorMessageServer } from "utils/errorMessageServer";

class ShowHistoryData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      zoneId: null,
      historyData: [],
      isLoading: false,
      popupMessage: "",
      errMessage: "",
    };
  }

  async componentDidMount() {
    const { onHandleChangeValue, id } = this.props;

    if (onHandleChangeValue) {
      onHandleChangeValue(this.state);
    }

    if (id) {
      this.setState({ id }, () => this.getHistoryData());
    }

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

  getHistoryData = async (page = 0, limit = 100) => {
    const { id } = this.state;
    if (!id) return;

    this.setState({ isLoading: true });
    console.log("productId đang gửi:", id);

    try {
      const res = await fetchData.productHistories.getListProductHistory(
        id,
        page,
        limit
      );
      console.log("API response:", res);

      // Support multiple possible response shapes. Prefer productHistories.
      const histories =
        (res && (res.productHistories || res.productHistory || res.histories)) ||
        res?.data ||
        [];

      if (histories && histories.length >= 0) {
        this.setState({ historyData: histories });
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Lấy lịch sử thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy lịch sử sản phẩm");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onChangeSelect = (name) => (value) => {
    this.setState(
      (prevState) => {
        let newState = {
          ...prevState,
          [name]: value,
        };

        return newState;
      },
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
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

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = {
        ...prevState,
        [name]: checked,
      };

      if (this.props.onHandleChangeValue) {
        this.props.onHandleChangeValue(newState);
      }

      return newState;
    });
  };

  handleSelect = (value, name) => {
    const { handleSelect } = this.props;
    let { newData } = this.state;
    if (name == "FieldID") {
      this.setState({ currentFilter: value });
    }
    if (name == "FieldID") {
      const { requestAccessPopupStore } = this.props;

      requestAccessPopupStore(
        JSON.stringify({
          search: "",
          filter: value == "" ? 0 : value,
          orderBy: "",
          page: null,
          limit: null,
        })
      );
    }

    if (value === null) value = "";

    newData[name] = value;

    this.setState({ newData });

    this.handleCheckValidation();
  };

  render() {
    const { errMessage, popupMessage, isLoading, historyData: stateHistory } = this.state;
    const { errors, historyData: propHistoryData, productName } = this.props;

    const finalHistory = Array.isArray(propHistoryData) && propHistoryData.length > 0
      ? propHistoryData
      : stateHistory || [];

    return (
      <div className="wrap-insert-or-update-zone">
        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <HistoryListTable historyData={finalHistory} productName={productName} />
        )}

        <PopupMessage
          popupMessage={popupMessage}
          moduleTitle={"Thông báo"}
          moduleBody={errMessage}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default ShowHistoryData;
