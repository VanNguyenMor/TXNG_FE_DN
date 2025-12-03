import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import HistoryListTable from "components/HistoryListTable/HistoryListTable";
import { fetchData } from "helpers/fetchData.js";
import { getErrorMessageServer } from "../../../utils/errorMessageServer";
import { toast } from "react-toastify";

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
      newData: {},
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

  // ----------------- Fetch data -----------------
  getHistoryData = async (page = 0, limit = 100) => {
    const { id } = this.state;
    if (!id) return;

    this.setState({ isLoading: true });
    console.log("materialId đang gửi:", id);

    try {
      const res = await fetchData.materialHistories.getListMaterialHistory(
        id,
        page,
        limit
      );
      console.log("API response:", res);

      if (res && res.materialHistories) {
        const materialHistories = res.materialHistories;
        this.setState({ historyData: materialHistories });
      } else {
        const message = getErrorMessageServer(res);
        toast.error(message || "Lấy lịch sử thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy lịch sử nguyên vật liệu");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // ----------------- Handle input changes -----------------
  onChangeSelect = (name) => (value) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        [name]: value,
      }),
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
      (prevState) => ({ ...prevState, [name]: value }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState(
      (prevState) => ({ ...prevState, [name]: checked }),
      () => {
        if (this.props.onHandleChangeValue) {
          this.props.onHandleChangeValue(this.state);
        }
      }
    );
  };

  handleSelect = (value, name) => {
    let { newData } = this.state;
    if (value === null) value = "";
    newData[name] = value;
    this.setState({ newData });
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  // ----------------- Render -----------------
  render() {
    const { errMessage, popupMessage, historyData, isLoading } = this.state;
    const { tableTitle } = this.props;

    return (
      <div className="wrap-insert-or-update-zone">
        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <HistoryListTable historyData={historyData} tableTitle={tableTitle} />
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
