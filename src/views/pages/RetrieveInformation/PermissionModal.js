import React, { Component } from "react";
import { Modal, Button } from "reactstrap";

/**
 * Modal phân quyền cho 1 mục truy xuất (giống màn Permission trên mobile setAccess).
 * - Tab "Người thực hiện" (isExecuted = true)
 * - Tab "Người đánh giá" (isExecuted = false)
 * - "Áp dụng cho tất cả truy xuất còn lại" (isApproveAll)
 *
 * Props:
 *  - isOpen, toggle
 *  - item: mục truy xuất đang phân quyền (cần id, name)
 *  - roleComboBoxs: danh sách tất cả nhóm quyền [{ id, roleName }]
 *  - traceRoles: phân quyền hiện tại [{ roleID, roleName, isExecuted }]
 *  - onConfirm(payload): payload = { role1s, role2s, isApproveAll }
 */
class PermissionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 1, // 1: Người thực hiện, 0: Người đánh giá
      role1Ids: [],
      role2Ids: [],
      isApproveAll: false,
    };
  }

  componentDidUpdate(prevProps) {
    // Khởi tạo lại khi mở modal cho mục mới
    if (
      this.props.isOpen &&
      (!prevProps.isOpen || prevProps.item !== this.props.item)
    ) {
      const traceRoles = this.props.traceRoles || [];

      this.setState({
        currentTab: 1,
        isApproveAll: false,
        role1Ids: traceRoles
          .filter((p) => p.isExecuted)
          .map((p) => p.roleID),
        role2Ids: traceRoles
          .filter((p) => !p.isExecuted)
          .map((p) => p.roleID),
      });
    }
  }

  toggleRole = (roleId) => {
    const key = this.state.currentTab === 1 ? "role1Ids" : "role2Ids";

    this.setState((prev) => {
      const list = prev[key];
      const exists = list.includes(roleId);
      return {
        [key]: exists
          ? list.filter((id) => id !== roleId)
          : [...list, roleId],
      };
    });
  };

  onConfirm = () => {
    const { item } = this.props;
    const { role1Ids, role2Ids, isApproveAll } = this.state;

    this.props.onConfirm({
      role1s: {
        informSelectID: item.id,
        roles: role1Ids,
        isExecuted: true,
      },
      role2s: {
        informSelectID: item.id,
        roles: role2Ids,
        isExecuted: false,
      },
      isApproveAll,
    });
  };

  renderRoleList = () => {
    const { roleComboBoxs } = this.props;
    const { currentTab, role1Ids, role2Ids } = this.state;
    const selected = currentTab === 1 ? role1Ids : role2Ids;

    if (!roleComboBoxs || roleComboBoxs.length === 0) {
      return (
        <p style={{ textAlign: "center", color: "#888" }}>
          Không có nhóm quyền
        </p>
      );
    }

    return roleComboBoxs.map((role) => (
      <div
        key={role.id}
        className="custom-control custom-checkbox"
        style={{ marginBottom: "8px" }}
      >
        <input
          className="custom-control-input"
          type="checkbox"
          id={`role-${currentTab}-${role.id}`}
          checked={selected.includes(role.id)}
          onChange={() => this.toggleRole(role.id)}
        />
        <label
          className="custom-control-label"
          htmlFor={`role-${currentTab}-${role.id}`}
        >
          {role.roleName || role.name}
        </label>
      </div>
    ));
  };

  render() {
    const { isOpen, toggle, item } = this.props;
    const { currentTab, isApproveAll } = this.state;

    const tabBtnStyle = (active) => ({
      flex: 1,
      padding: "8px 0",
      cursor: "pointer",
      textAlign: "center",
      fontWeight: 600,
      borderBottom: active ? "2px solid #5e72e4" : "2px solid transparent",
      color: active ? "#5e72e4" : "#525f7f",
    });

    return (
      <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title">Phân quyền — {(item || {}).name}</h5>
          <button type="button" className="close" onClick={toggle}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", marginBottom: "15px" }}>
            <div
              style={tabBtnStyle(currentTab === 1)}
              onClick={() => this.setState({ currentTab: 1 })}
            >
              Người thực hiện
            </div>
            <div
              style={tabBtnStyle(currentTab === 0)}
              onClick={() => this.setState({ currentTab: 0 })}
            >
              Người đánh giá
            </div>
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {this.renderRoleList()}
          </div>

          <div
            className="custom-control custom-checkbox"
            style={{ marginTop: "15px" }}
          >
            <input
              className="custom-control-input"
              type="checkbox"
              id="isApproveAll"
              checked={isApproveAll}
              onChange={() =>
                this.setState((prev) => ({ isApproveAll: !prev.isApproveAll }))
              }
            />
            <label className="custom-control-label" htmlFor="isApproveAll">
              Áp dụng cho tất cả truy xuất còn lại
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="secondary" type="button" onClick={toggle}>
            Đóng
          </Button>
          <Button
            className="btn-success-cs"
            color="default"
            type="button"
            onClick={this.onConfirm}
          >
            ĐỒNG Ý
          </Button>
        </div>
      </Modal>
    );
  }
}

export default PermissionModal;
