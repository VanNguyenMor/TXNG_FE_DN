import React, { Component } from "react";
import { Table, Button, Input, InputGroup } from "reactstrap";
import classes from "./ConversionManagerTable.module.css";

class ConversionManagerTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUnits: props.initialSelectedUnits || [],
      currentUnitId: "",
      currentUnitRate: 1,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialSelectedUnits !== this.props.initialSelectedUnits) {
      this.setState({ selectedUnits: this.props.initialSelectedUnits || [] });
    }
  }

  triggerOnChange = (newUnits) => {
    if (this.props.onChange) {
      this.props.onChange(newUnits);
    }
  };

  handleUnitSelect = (e) => {
    this.setState({ currentUnitId: e.target.value });
  };

  handleRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || value > 0) {
      this.setState({ currentUnitRate: value });
    }
  };

  handleAddUnit = () => {
    const { currentUnitId, currentUnitRate, selectedUnits } = this.state;
    const { allAvailableUnits, defaultUnitId } = this.props;

    if (!currentUnitId) {
      alert("Vui lòng chọn đơn vị.");
      return;
    }

    if (String(currentUnitId) === String(this.props.defaultUnitId || "")) {
      alert("Đơn vị quy đổi không được trùng với đơn vị chính.");
      return;
    }

    const selectedUnitObj = allAvailableUnits.find(
      (u) => String(u.id) === String(currentUnitId)
    );
    if (!selectedUnitObj) {
      alert("Đơn vị không hợp lệ.");
      return;
    }

    if (selectedUnits.some((u) => String(u.id) === String(currentUnitId))) {
      alert("Đơn vị này đã tồn tại trong danh sách.");
      return;
    }
    const rate = Number(currentUnitRate) || 1;
    if (rate <= 0) {
      alert("Tỷ lệ phải lớn hơn 0.");
      return;
    }
    const newUnit = {
      id: currentUnitId,
      unitName: selectedUnitObj.title,
      conversionRate: rate,
      isPrimary: selectedUnits.length === 0,
    };

    this.setState((prevState) => {
      const newUnits = [...prevState.selectedUnits, newUnit];
      this.triggerOnChange(newUnits);
      return {
        selectedUnits: newUnits,
        currentUnitId: "",
        currentUnitRate: 1,
      };
    });
  };

  handlePrimaryChange = (unitId) => {
    this.setState((prevState) => {
      const newUnits = prevState.selectedUnits.map((unit) => ({
        ...unit,
        isPrimary: unit.id === unitId,
      }));
      this.triggerOnChange(newUnits);
      return { selectedUnits: newUnits };
    });
  };

  handleDeleteUnit = (unitId) => {
    const unitToDelete = this.state.selectedUnits.find((u) => u.id === unitId);

    if (unitToDelete.isPrimary) {
      alert("Không thể xóa đơn vị đang được chọn làm 'Hiện báo cáo'.");
      return;
    }

    this.setState((prevState) => {
      const newUnits = prevState.selectedUnits.filter(
        (unit) => unit.id !== unitId
      );
      this.triggerOnChange(newUnits);
      return { selectedUnits: newUnits };
    });
  };

  renderInputControls() {
    const { currentUnitId, currentUnitRate, selectedUnits } = this.state;
    const { allAvailableUnits } = this.props;

    const availableUnits = allAvailableUnits.filter(
      (u) => !selectedUnits.some((s) => s.id === u.id)
    );

    const isAddDisabled =
      !currentUnitId || !currentUnitRate || currentUnitRate <= 0;

    return (
      <div
        className=" mb-3 p-3 flex-grow-1"
        style={{ border: "1px solid #ccc", borderRadius: "5px" }}
      >
        <span className="me-3 font-weight-bold" style={{ display: "block" }}>
          Thêm đơn vị quy đổi:
        </span>
        <div className="d-flex align-items-center">
          <Input
            type="select"
            name="currentUnitId"
            value={currentUnitId}
            onChange={this.handleUnitSelect}
            className="me-2"
          >
            <option value="">Chọn đơn vị</option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.title && unit.title.toLowerCase()}
              </option>
            ))}
          </Input>

          <InputGroup style={{ width: "150px" }} className="me-2">
            <Input
              type="number"
              name="currentUnitRate"
              style={{ width: "30px", marginLeft: "10px" }}
              placeholder="Tỷ lệ"
              value={currentUnitRate}
              onChange={this.handleRateChange}
              min="1"
            />
          </InputGroup>
        </div>
        <Button
          color="primary"
          onClick={this.handleAddUnit}
          disabled={isAddDisabled}
          className="flex-grow-1 p-2 mt-2"
          style={{ width: "100%", cursor: "pointer" }}
        >
          <i className="fas fa-plus"></i> Thêm
        </Button>
      </div>
    );
  }

  render() {
    const { selectedUnits } = this.state;
    const { isDisable } = this.props;

    return (
      <div className="conversion-manager-wrap">
        {this.renderInputControls()}

        <div className="d-flex align-items-center text-white mb-2">
          <h4 className="mb-0">Danh sách đơn vị quy đổi</h4>
        </div>

        <Table
          bordered
          className={`mb-0 ${classes.scrollTable}`}
          style={{ borderTop: "none" }}
          responsive
        >
          <thead style={{ backgroundColor: "#09b2fd" }}>
            <tr>
              <th style={{ width: "5%" }}>Stt</th>
              <th style={{ width: "30%" }}>Đơn vị tính</th>
              <th style={{ width: "25%" }}>Quy đổi</th>
              <th style={{ width: "30%" }}>Hiện báo cáo</th>
              <th style={{ width: "10%" }}></th>
            </tr>
          </thead>
          <tbody>
            {selectedUnits.map((unit, index) => (
              <tr key={unit.id}>
                <td>{index + 1}</td>
                <td>{unit.unitName && unit.unitName.toLowerCase()}</td>
                <td>{unit.conversionRate}</td>
                <td className="text-center">
                  <Input
                    type="checkbox"
                    checked={unit.isPrimary}
                    onChange={() =>
                      !isDisable && this.handlePrimaryChange(unit.id)
                    }
                  />
                </td>
                <td className="text-center">
                  <Button
                    color="link"
                    onClick={() => this.handleDeleteUnit(unit.id)}
                    disabled={unit.isPrimary || isDisable}
                    className="text-danger p-0"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </td>
              </tr>
            ))}
            {selectedUnits.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Chưa có đơn vị quy đổi nào được thêm.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ConversionManagerTable;
