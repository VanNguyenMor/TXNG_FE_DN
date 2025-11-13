import { validExtensionFileImage, EXTENSION_FILE_IMAGE, EXTENSION_FILE_PDF, EXTENSION_FILE_WORD, EXTENSION_FILE_EXCEL, EXTENSION_FILE_TXT } from 'bases/helper';
import React, { Component } from 'react';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg";
import Select from 'components/Select';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import moment from "moment"
import { actionPartner } from "../../../actions/PartnerActions";
import { configSystemAction } from "../../../actions/ConfigSystemAction";
import { bindActionCreators } from "redux";
import {
  Button,
  Modal,
  Input,
  InputGroup
} from "reactstrap";

import '../../../assets/css/page/popup_detail_stamp_provide.css';
import SaveIcon from '../../../assets/img/buttons/apply.svg';
import CloseIcon from "../../../assets/img/buttons/DONG.png";
import UnConfirm from '../../../assets/img/buttons/KhongDuyet.svg';


class PopupDetail extends Component {
  constructor(props) {
    super(props);
    // const { dataConfig } = props;
    // const handleAttachment = dataConfig.attachmentStamps.split("\r\n").join('<br/>')
    // const newConfig = { ...dataConfig, attachmentStamps: handleAttachment }


    this.state = {
      // dataConfig: newConfig,
      dataPartnerPrint: []
    }
  }

  componentWillMount() {
    const { requestListPartner, getConfigSetting } = this.props;
    requestListPartner(
      JSON.stringify({
        "companyName": "",
        "phone": "",
        "email": "",
        "taxCode": "",
        "partnerType": 6,
        "orderBy": "",
        "page": null,
        "limit": null
      })).then(res => {
        if (res.data.status == 200) {
          this.setState({
            dataPartnerPrint: res.data.data.partners
          })
        }
      });
    getConfigSetting().then(res => {
      if (res.data.status == 200) {
        this.setState({ dataConfig: res.data.data })
      }
    })
  }
  // componentDidMount() {
  //   const { data, dataConfig } = this.props
  //   console.log(dataConfig);
  //   // let dataAtt = dataConfig.attachmentStamps || ''
  //   const handleAttachment = dataConfig.attachmentStamps.split("\r\n").join('<br/>')
  //   const newConfig = { ...dataConfig, attachmentStamps: handleAttachment }

  //   this.setState(previousState => {
  //     return {
  //       ...previousState,
  //       dataConfig: newConfig
  //     }
  //   })
  // }

  hanldeSelect = (value, name) => {
    let { data } = this.state;
    if (value === null) value = "";
    data[name] = value;

    this.setState({ data });
    this.handleCheckValidation();

  }
  handleCheckValidation = () => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { data } = this.state;

    if (Number(data.quantity) > 0) {
      this.setState({ activeSubmit: true });

      // Check Validation 
      handleCheckValidation(true);


      // Handle New Data
      handleNewData(data);
    } else {
      this.setState({ activeSubmit: false });
      handleCheckValidation(false);

      // Handle New Data
      handleNewData(data);
    }
  }

  renderIconFile = fileName => {
    let icon = '';

    const extension = (fileName || '').split('.').pop();

    if (EXTENSION_FILE_IMAGE.find(p => p == extension) ? true : false) {
      icon = null;
    } else if (EXTENSION_FILE_PDF.find(p => p == extension) ? true : false) {
      icon = '/cores/imgs/ics/pdf.png';
    } else if (EXTENSION_FILE_WORD.find(p => p == extension) ? true : false) {
      icon = '/cores/imgs/ics/word.png';
    } else if (EXTENSION_FILE_EXCEL.find(p => p == extension) ? true : false) {
      icon = '/cores/imgs/ics/excel.png';
    } else if (EXTENSION_FILE_TXT.find(p => p == extension) ? true : false) {
      icon = '/cores/imgs/ics/txt.png';
    } else {
      icon = '/cores/imgs/ics/file.png';
    }

    if (!icon) {
      return null;
    }

    return <img className='modal-body-item-file-item-icon' src={icon} />;
  }

  render() {
    const { data, onConfirm, onUnConfirm, isShow, onClose, onChangeReason, errorPrint } = this.props;
    const { dataPartnerPrint, dataConfig } = this.state;
    if (!isShow) {
      return null;
    }
    let partnerMark = [];
    let partnerNane = '';
    if (dataPartnerPrint && data) {

      partnerMark = dataPartnerPrint.filter(
        p => p.id == data.PartnerID || p.id == data.partnerID)
      if (partnerMark) {
        partnerNane = partnerMark[0] && (partnerMark[0] || {}).partnerName
      }
    }
    // let isDisable = false
    // if (data.status === 0) {

    // }
    const numberWithCommas = (value, coma) => {
      value = value || '';
      coma = coma || '.';

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma) || 0;
    };

    const fileUpload = data.FileUploadUsed || '';
    const fileUploads = (fileUpload.split(';') || []).filter(p => p);

    return (
      <Modal
        className="modal-dialog-centered"
        isOpen={isShow ? true : false}
        autoFocus={false}
      >
        <div className='modal-header CreateNewPopup_moduleHeaderArea__dcIuH' style={{ background: '#09b2fd' }}>
          <h5 className="modal-title text-default-custom" id="warningPopupModalLabel" style={{ color: '#fff', margin: 'auto', fontSize: "1rem" }}>
            YÊU CẦU CẤP PHÉP SỬ DỤNG TEM
          </h5>
        </div>
        <div className="modal-body text-default-custom">
          <div style={{
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {data.IsPrint === false ?
              <i>Doanh nghiệp/Hợp tác xã yêu cầu in tem</i> :
              <i>Doanh nghiệp/Hợp tác xã yêu cầu được tự in tem</i>}</div>
          <br />
          <div className='modal-body-item'>
            <label className='css-label-stamp-provide'>Đơn vị yêu cầu</label>
            <p className='css-p-stamp-provide'>{data.CompanyName}</p>
          </div>
          {/* <div className='modal-body-item'>
            <label className='css-label-stamp-provide'>Sản phẩm</label>
            <p className='css-p-stamp-provide'>{data.ProductName}</p>
          </div> */}
          {/* <div className='modal-body-item'>
            <label className='css-label-stamp-provide'>Số lượng mã QR</label>
            <p className='css-p-stamp-provide'>{data.Requested}</p>
          </div> */}
          <div className='modal-body-item'>
            <label className='css-label-stamp-provide'>Số lượng tem</label>
            <p className='css-p-stamp-provide'>{numberWithCommas(data.Quantity)}</p>
          </div>
          <div className='modal-body-item-2'>
            <label className='css-label-stamp-provide'>Mẫu in tem</label>
            {/* <img className='modal-body-item-image' src={data.StampTemplateLink} /> */}
            <div className='modal-body-item-image'>
              {/* {data.StampTemplateLink ? (
                <ReactFancyBox
                  thumbnail={data.StampTemplateLink}
                  image={data.StampTemplateLink}
                />
              ) : (
                <img className='modal-body-item-image' src={NoImg} />
              )}
            </div> */}
              {data.StampTemplateLink ?
                (
                  <a href={data.StampTemplateLink} target="_blank"><img className='modal-body-item-image' src={data.StampTemplateLink} /></a>
                ) : (
                  <img className='modal-body-item-image' src={NoImg} />
                )
              }
            </div>
            <div className='modal-body-item-2'>
              <label className='css-label-stamp-provide'>Hồ sơ đính kèm</label>
              {/* <label className='modal-body-item-label'>- Hóa đơn thanh toán</label>
            <label className='modal-body-item-label'>- Phiếu yêu cầu cấp phát tem có chữ ký của giám đốc (nếu là doanh nghiệp), hoặc chữ ký cá nhân</label> */}
              {
                dataConfig && dataConfig.attachmentUsed ? (
                  <>
                    {/* <div className='css-p-attach' dangerouslySetInnerHTML={{ __html: dataConfig.attachmentUsed.split('\r\n').join('<br/>') || '' }}></div> */}
                    <div className='css-p-attach' dangerouslySetInnerHTML={{ __html: dataConfig.attachmentUsed || '' }}></div>
                  </>
                ) : null
              }

              <div className='modal-body-item-file'>
                {fileUploads.map((item, index) => {
                  return validExtensionFileImage(item) ?
                    <div key={`f-${index}`} className='modal-body-item-file-item'>
                      {/* <img className='modal-body-item-file-item-image' src={item} /> */}
                      {/* <ReactFancyBox
                      thumbnail={item}
                      image={item}
                    /> */}
                      <a href={item} target='_blank'><img className='modal-body-item-file-item-image' src={item} /></a>
                      {/* <p className='modal-body-item-file-item-text'>{item}</p> */}
                    </div> : <div key={`f-${index}`} className='modal-body-item-file-item' style={{ alignItems: 'end' }}>
                      {this.renderIconFile(item)}
                      <a href={item} target='_blank' className='modal-body-item-file-item-text'>{item.split("/").pop()}</a>
                    </div>
                })}
              </div>
            </div>
            {(data.RequestedUsedStatus == 1 || data.RequestedUsedStatus == 3) ?
              <div className='modal-body-item-2'>
                <label className='css-label-stamp-provide'>Lý do không duyệt&nbsp;<b style={{ color: 'red' }}>*</b></label>
                <InputGroup className="input-group-alternative css-border-input">
                  <Input
                    type="textarea"
                    className='modal-body-item-textarea'
                    onChange={onChangeReason}
                    value={data.RequestedUsedReason}
                    //defaultValue={data.Reason}
                    readOnly={data.RequestedUsedStatus == 1 ? false : true}
                  />
                </InputGroup>
              </div> : null}
            <p className='form-error-message margin-bottom-0'>{errorPrint.RequestedUsedReason || ''}</p>
            <div className='modal-body-item'>
              {data.DeliveryDate ? (<>
                <label className='css-label-stamp-provide'>Ngày trả tem</label>
                <p className='css-p-stamp-provide'>{moment(data.DeliveryDate).format('DD/MM/YYYY')}</p>
              </>) : null
              }
            </div>
          </div>
        </div>
        <div className='modal-footer CreateNewPopup_modalButtonArea__3_n_q' style={{ margin: 'auto' }}>
          {data.RequestedUsedStatus == 1 ?
            <>
              <Button
                color="default"
                className='btn-success-cs '
                type="button"
                onClick={onConfirm}
              >
                <img src={SaveIcon} alt='Lưu & Thêm' />
                <span>Duyệt</span>
              </Button>
              <Button
                color="default"
                className='btn-danger-cs modal-css-footer-unconfirm'
                type="button"
                onClick={onUnConfirm}
              >
                <img src={UnConfirm} alt='Không duyệt' />
                <span style={{ color: "#000" }}>Không duyệt</span>
              </Button>
            </> : null}
          <Button
            // style={{ margin: 'auto' }}
            color="default"
            className='btn-danger-cs'
            type="button"
            onClick={onClose}
          >
            <img src={CloseIcon} alt='Không duyệt   ' />
            <span>Đóng</span>
          </Button>
        </div>
      </Modal>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    partner: state.PartnerStore,
    ConfigSystemStore: state.ConfigSystemStore,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionPartner, dispatch),
    ...bindActionCreators(configSystemAction, dispatch),
  }
}
export default compose(
  //withStyles(useStyles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PopupDetail);