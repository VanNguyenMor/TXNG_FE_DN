import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  Button,
  Spinner,
} from "reactstrap";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";

/**
 * Modal tra cứu đối tác từ hệ thống LACO (giống nút "Tìm kiếm đối tác" trên mobile).
 * Props:
 *  - isOpen: boolean
 *  - toggle(): đóng modal
 *  - companyId: id công ty hiện tại
 *  - requestListPartnerLACO({name, code, companyId}, ...): action
 *  - onChoose(item): callback khi chọn 1 đối tác từ LACO
 */
class LacoSearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      searchCode: "",
      partners: [],
      loading: false,
      searched: false,
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSearch = () => {
    const { searchName, searchCode } = this.state;
    const { requestListPartnerLACO, companyId } = this.props;

    if (!searchName && !searchCode) return;

    this.setState({ loading: true, searched: true });

    requestListPartnerLACO({
      name: searchName,
      code: searchCode,
      companyId: companyId || "",
    }).then((res) => {
      // get() trả về { data: res.data.data } => data = { companies: [...] }
      const companies =
        (((res || {}).data || {}).data || {}).companies || [];
      this.setState({ partners: companies, loading: false });
    });
  };

  onChoose = (item) => () => {
    if (!item || !item.id) {
      alert("Công ty này không hợp lệ");
      return;
    }
    this.props.onChoose(item);
  };

  render() {
    const { isOpen, toggle } = this.props;
    const { searchName, searchCode, partners, loading, searched } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Tìm kiếm đối tác từ LACO</ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="searchName"
                placeholder="Tên doanh nghiệp"
                value={searchName}
                onChange={this.onChange}
              />
            </InputGroup>
            <InputGroup className="input-group-alternative css-border-input">
              <Input
                name="searchCode"
                placeholder="Mã số thuế"
                value={searchCode}
                onChange={this.onChange}
              />
            </InputGroup>
            <Button color="primary" onClick={this.onSearch}>
              Tìm
            </Button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Spinner />
            </div>
          ) : (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {partners.length === 0 ? (
                <p style={{ textAlign: "center", color: "#8898aa" }}>
                  {searched
                    ? "Không tìm thấy đối tác phù hợp"
                    : "Nhập tên doanh nghiệp hoặc mã số thuế để tìm kiếm"}
                </p>
              ) : (
                partners.map((item, key) => (
                  <div
                    key={item.id || key}
                    onClick={this.onChoose(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 10,
                      borderBottom: "1px solid #e9ecef",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={item.logo ? item.logo : NoImg}
                      alt="logo"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        marginRight: 12,
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <strong>{item.companyName}</strong>
                      <br />
                      <span>{item.address}</span>
                      <br />
                      <span>MST: {item.taxCode}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
    );
  }
}

export default LacoSearchModal;
