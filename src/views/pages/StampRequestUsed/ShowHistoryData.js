import React, { Component } from "react";
import PopupMessage from "../../../components/PopupMessage";
import "../../../assets/css/page/insert_or_update_planting_zone.css";
import classes from "./index.module.css";
import { Col, Row, Label, Input, InputGroup, Modal, ModalHeader, ModalBody } from "reactstrap";
import { fetchData } from "helpers/fetchData";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import moment from "moment";
import { toast } from "react-toastify";
import { loadDetail } from "./services";
import { splitFileNames, formatNumber } from "./utils";

class ShowHistoryData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      detail: null,
      stampTemplateList: [],
      previewImage: null,
      isLoaded: false,
      errMessage: "",
      popupMessage: false,
      STATUS_OPTIONS: [
        { id: 0, title: "Mới tạo" },
        { id: 1, title: "Chờ duyệt" },
        { id: 2, title: "Đã duyệt" },
        { id: 3, title: "Không duyệt" },
        { id: 4, title: "Đã duyệt yêu cầu" },
      ],
      EFFECT_OPTIONS: [
        { id: 0, title: "Chưa hiệu lực" },
        { id: 1, title: "Chờ cấp phép" },
        { id: 2, title: "Có hiệu lực" },
        { id: 3, title: "Không cấp phép" },
      ],
    };
  }

  async componentDidMount() {
    await this.loadStampTemplateList();
    const { id } = this.props;
    if (id) {
      await this.loadDetail(id);
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      await this.loadDetail(this.props.id);
    }
  }

  loadStampTemplateList = async () => {
    try {
      const templates = await fetchData.stampRequest.getListStampTemplate();
      let stampTemplateList = [];
      if (Array.isArray(templates)) {
        stampTemplateList = templates;
      } else if (templates && typeof templates === "object") {
        stampTemplateList =
          templates.stampTemplates ||
          templates.stamps ||
          templates.stampRanges ||
          templates.data ||
          [];
      }
      this.setState({ stampTemplateList });
    } catch (error) {
      this.setState({ stampTemplateList: [] });
    }
  };

  loadDetail = async (id) => {
    this.setState({ isLoaded: true });
    const res = await loadDetail(id);
    if (res.ok) {
      this.setState({ detail: res.detail, isLoaded: false });
    } else {
      toast.error(res.message);
      this.setState({ isLoaded: false });
    }
  };

  getStatusTitle = (id) => {
    const { STATUS_OPTIONS } = this.state;
    const found = STATUS_OPTIONS.find((s) => s.id === id);
    return found ? found.title : "";
  };

  getEffectTitle = (id) => {
    const { EFFECT_OPTIONS } = this.state;
    const found = EFFECT_OPTIONS.find((s) => s.id === id);
    return found ? found.title : "";
  };

  getStampTemplate = (stampTemplateId) => {
    const { stampTemplateList } = this.state;
    if (!Array.isArray(stampTemplateList)) return null;
    return stampTemplateList.find(
      (t) => String(t.id || t.ID) === String(stampTemplateId)
    );
  };

  toggleModal = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  openPreview = (image) => () => {
    this.setState({ previewImage: image || NoImg });
  };

  closePreview = () => {
    this.setState({ previewImage: null });
  };

  formatNumber = formatNumber;

  renderFiles = (value) => {
    const names = splitFileNames(value);
    if (names.length === 0) return <p className="text-muted mb-0">Chưa có tệp.</p>;
    return (
      <ul className="mb-0 pl-3">
        {names.map((name, index) => (
          <li key={`${name}-${index}`}>
            {name.startsWith("http") ? (
              <a href={name} target="_blank" rel="noopener noreferrer">
                {name.split("/").pop()}
              </a>
            ) : (
              name
            )}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { detail, isLoaded, errMessage, popupMessage } = this.state;
    const { config = {} } = this.props;

    if (isLoaded) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      );
    }

    if (!detail) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <span>Không có dữ liệu</span>
        </div>
      );
    }

    const requestedDate =
      detail.requestedDate || detail.RequestedDate
        ? moment(detail.requestedDate || detail.RequestedDate).format(
            "DD/MM/YYYY HH:mm"
          )
        : "";
    const deliveryDate =
      detail.deliveryDate || detail.DeliveryDate
        ? moment(detail.deliveryDate || detail.DeliveryDate).format("DD/MM/YYYY")
        : "";

    const quantity = detail.quantity || detail.Quantity || 0;
    const size = detail.size || detail.Size || "";
    const isPrint = detail.isPrint === true || detail.IsPrint === true;
    const printMethod = isPrint ? "Tự in" : "Yêu cầu in";
    const note = detail.note || detail.Note || "";
    const fileUpload = detail.fileUpload || "";
    const fileUploadUsed = detail.fileUploadUsed || "";
    const status =
      detail.status !== undefined
        ? detail.status
        : detail.Status !== undefined
        ? detail.Status
        : null;
    const effect =
      detail.requestedUsedStatus !== undefined
        ? detail.requestedUsedStatus
        : detail.RequestedUsedStatus !== undefined
        ? detail.RequestedUsedStatus
        : null;
    const amount = detail.amount || detail.Amount || 0;
    const partnerName = detail.partnerName || detail.PartnerName || "";
    const reason = detail.reason || detail.Reason || "";
    const requestedUsedReason =
      detail.requestedUsedReason || detail.RequestedUsedReason || "";
    const stampTemplateId =
      detail.stampTemplateID || detail.StampTemplateID || "";
    const stampTemplate = this.getStampTemplate(stampTemplateId);
    const stampTemplateImage =
      (stampTemplate && (stampTemplate.template || stampTemplate.Template)) || "";
    const amountPerStamp = quantity > 0 ? amount / quantity : 0;
    const showDelivery = Boolean(deliveryDate);
    const showPartner = !isPrint && Boolean(partnerName) && status !== 1 && status !== 3;

    return (
      <div className="wrap-insert-or-update-zone">
        {/* Mẫu in tem - hình ảnh */}
        <Row className="mb-2">
          <Col md="12">
            <div className="form-group" style={{ textAlign: "center" }}>
              <Label className="form-control-label d-block">Mẫu in tem</Label>
              <div
                className={`${classes.stampTemplateItem} ${classes.stampTemplateItemActive}`}
                style={{ display: "inline-block", cursor: "pointer" }}
                onDoubleClick={this.openPreview(stampTemplateImage)}
                title="Nhấp đúp để xem ảnh lớn"
              >
                <img
                  src={stampTemplateImage || NoImg}
                  alt="Mẫu in tem"
                  className={classes.stampTemplateImage}
                  onError={(e) => {
                    e.target.src = NoImg;
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Số lượng tem xin cấp</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input type="text" value={quantity} disabled readOnly />
              </InputGroup>
            </div>
          </Col>
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Kích thước tem</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input type="text" value={size || ""} disabled readOnly />
              </InputGroup>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Ngày yêu cầu</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input type="text" value={requestedDate} disabled readOnly />
              </InputGroup>
            </div>
          </Col>
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Hình thức in</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input type="text" value={printMethod} disabled readOnly />
              </InputGroup>
            </div>
          </Col>
        </Row>

        {showDelivery || showPartner ? (
          <Row className="mb-2">
            {showDelivery ? (
              <Col md="6">
                <div className="form-group">
                  <Label className="form-control-label">Ngày trả tem</Label>
                  <InputGroup className="input-group-alternative css-border-input">
                    <Input type="text" value={deliveryDate} disabled readOnly />
                  </InputGroup>
                </div>
              </Col>
            ) : null}
            {showPartner ? (
              <Col md="6">
                <div className="form-group">
                  <Label className="form-control-label">Đơn vị in tem</Label>
                  <InputGroup className="input-group-alternative css-border-input">
                    <Input type="text" value={partnerName} disabled readOnly />
                  </InputGroup>
                </div>
              </Col>
            ) : null}
          </Row>
        ) : null}

        {!isPrint ? (
          <Row className="mb-2">
            <Col md="6">
              <div className="form-group">
                <Label className="form-control-label">Số tiền mỗi con tem</Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="text"
                    value={`${this.formatNumber(amountPerStamp)} đ`}
                    disabled
                    readOnly
                  />
                </InputGroup>
              </div>
            </Col>
            <Col md="6">
              <div className="form-group">
                <Label className="form-control-label">Số tiền phải thanh toán</Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="text"
                    value={`${this.formatNumber(amount)} đ`}
                    disabled
                    readOnly
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
        ) : null}

        <Row className="mb-2">
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Trạng thái duyệt</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  type="text"
                  value={status !== null ? this.getStatusTitle(status) : ""}
                  disabled
                  readOnly
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="6">
            <div className="form-group">
              <Label className="form-control-label">Trạng thái cấp phép</Label>
              <InputGroup className="input-group-alternative css-border-input">
                <Input
                  type="text"
                  value={effect !== null ? this.getEffectTitle(effect) : ""}
                  disabled
                  readOnly
                />
              </InputGroup>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md="12">
            <div className="form-group">
              <Label className="form-control-label">Hồ sơ đính kèm yêu cầu cấp tem</Label>
              <div
                className="text-muted"
                dangerouslySetInnerHTML={{ __html: config.attachmentStamps || "" }}
              />
              <Label className="form-control-label">Tệp đính kèm yêu cầu cấp tem</Label>
              {this.renderFiles(fileUpload)}
            </div>
          </Col>
        </Row>

        {effect ? (
          <Row className="mb-2">
            <Col md="12">
              <div className="form-group">
                <Label className="form-control-label">
                  Hồ sơ đính kèm yêu cầu cấp phép sử dụng tem
                </Label>
                <div
                  className="text-muted"
                  dangerouslySetInnerHTML={{ __html: config.attachmentUsed || "" }}
                />
                <Label className="form-control-label">
                  Tệp đính kèm yêu cầu cấp phép sử dụng tem
                </Label>
                {this.renderFiles(fileUploadUsed)}
              </div>
            </Col>
          </Row>
        ) : null}

        {note ? (
          <Row className="mb-2">
            <Col md="12">
              <div className="form-group">
                <Label className="form-control-label">Ghi chú</Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input type="textarea" value={note} disabled readOnly rows="3" />
                </InputGroup>
              </div>
            </Col>
          </Row>
        ) : null}

        {status === 3 && reason ? (
          <Row className="mb-2">
            <Col md="12">
              <div className="form-group">
                <Label className="form-control-label">
                  Lý do không duyệt yêu cầu cấp tem
                </Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input type="textarea" value={reason} disabled readOnly rows="2" />
                </InputGroup>
              </div>
            </Col>
          </Row>
        ) : null}

        {effect === 3 && requestedUsedReason ? (
          <Row className="mb-2">
            <Col md="12">
              <div className="form-group">
                <Label className="form-control-label">
                  Lý do không duyệt yêu cầu cấp phép sử dụng tem
                </Label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="textarea"
                    value={requestedUsedReason}
                    disabled
                    readOnly
                    rows="2"
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
        ) : null}

        <Modal
          isOpen={!!this.state.previewImage}
          toggle={this.closePreview}
          centered
          size="lg"
        >
          <ModalHeader toggle={this.closePreview}>Mẫu in tem</ModalHeader>
          <ModalBody className="text-center">
            <img
              src={this.state.previewImage || NoImg}
              alt="Mẫu in tem"
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = NoImg;
              }}
            />
          </ModalBody>
        </Modal>

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
