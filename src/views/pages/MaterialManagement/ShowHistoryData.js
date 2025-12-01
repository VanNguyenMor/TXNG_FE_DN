import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import HistoryListTable from "components/HistoryListTable/HistoryListTable";

class ShowHistoryData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobId: null,
      productId: null,
      zoneId: null,
    };
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
    const { errMessage, popupMessage, jobId, productId } = this.state;
    const { errors, historyData, tableTitle } = this.props;
    console.log(tableTitle);
    return (
      <div className="wrap-insert-or-update-zone">
        <HistoryListTable historyData={historyData} tableTitle={tableTitle} />

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
