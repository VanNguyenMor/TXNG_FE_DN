import React, { Component } from "react";
import Select from "components/Select";
import classes from './index.module.css';
import Validate from "react-validate-form";
import { rules, validations } from "../../../helpers/validation";
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import { DOMAIN_IMG } from "../../../services/Common";
import 'react-slideshow-image/dist/styles.css'
import { Zoom } from 'react-slideshow-image';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import ImageModalWidth from '../../../components/ImageModalWidth/ImageModalWidth';
import ImageModalHeight from "../../../components/ImageModalHeight/ImageModalHeight";
import ImageModal from '../../../components/ImageModal/ImageModal';

// reactstrap components
import {
  Input,
  InputGroup,

} from "reactstrap";

class ViewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      newData: {
        "id": '',
        "year": '',
      },
      activeSubmit: false,
      selectRow: 0,
      year: null,
      price: null,
      cutLocation: null,
      pathImageDefaul: null,
    }

  }

  componentDidMount() {
    const { data, price } = this.props;

    if (data.images) {
      const pIm = data.images;
      const spl = pIm.split(';')
      this.setState(previousState => {
        return {
          ...previousState,
          pathImageDefaul: spl
        }
      })
    }
    if (data.businessLicenses) {
      const pIm = data.businessLicenses;
      const spl = pIm.split(';')
      this.setState(previousState => {
        return {
          ...previousState,
          pathImageDefaulbusinessLicenses: spl
        }
      })
    }
    if (data.certifications) {
      const pIm = data.certifications;
      const spl = pIm.split(';')
      this.setState(previousState => {
        return {
          ...previousState,
          pathImageDefaulcertifications: spl
        }
      })
    }
    this.setState({ data, price, cutLocation: data.location });
    this.handleCheckValidation();

  }

  handleChange = (event) => {
    let { data, } = this.state;
    const ev = event.target;

    if (ev['name'].indexOf('passwordConfirm') > -1) {
      this.setState({ [ev['name']]: ev['value'] });
    }
    else data[ev['name']] = ev['value'];

    this.setState({ data });

    // Check Validation 
    this.handleCheckValidation();
  }

  handleSelect = (value, name) => {
    let { data, price } = this.state;

    if (value === null) value = "";

    data[name] = value;

    this.setState({ data });

    // Check Validation 
    this.handleCheckValidation();
  }
  handleSelectPrice = (value, name) => {
    const { price, data } = this.state;
    let current = null;

    if (value === null) value = "";


    this.handleCheckValidation(value);
  }

  handleCheckValidation = (newData = null) => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { data } = this.state;
    let current = null;
    if (data === null) {
      this.setState({ activeSubmit: false });
      //handleCheckValidation(false);
    }
    else {

      if (newData !== null) {
        this.setState({ activeSubmit: true });

        // Check Validation 
        handleCheckValidation(true);

        // Handle New Data
        this.setState({ selectRow: current.amount })

        handleNewData(current);
      } else {

        handleCheckValidation(false);
      }
    }
  }

  handleClear = () => {
    this.setState({
      data: null,
      activeSubmit: false,

    })
  }

  render() {
    const { data, selectRow, cutLocation, pathImageDefaul, pathImageDefaulbusinessLicenses, pathImageDefaulcertifications } = this.state;

    let img = pathImageDefaulbusinessLicenses || "";
    let imgs = pathImageDefaulcertifications || "";
    let pathImg = pathImageDefaul || "";

    return (
      data !== null && (
        <div className={classes.formControl}>
          <div className={'row'}>
            <div className={'col-3'}>
              <img src={data.logo ? data.logo : NoImg}
                style={{ width: 170, height: 170 }} />
            </div>
            <div className={'col-9'}>
              <div className={`${classes.rowItem}`} >
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Mã doanh nghiệp
                  </label>

                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.companyCode}</span>
                </div>
                {/* <div style={{ width: '100%' }}>
                  <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.companyCode}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div>
                </div> */}
                <div>
                  {
                    data.isCompany === 0 || data.isCompany === 2 ? (<>
                      <label className="form-control-label col">Mã số thuế</label>
                    </>) : ''
                  }
                  {
                    data.isCompany === 1 ? (<>
                      <label className="form-control-label col">CMND/CCCD</label>
                    </>) : ''
                  }
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.taxCode}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.taxCode}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>

              {/* <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã doanh nghiệp
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.companyCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                    </div> */}
              <div className={classes.rowItem}>
                <div>
                  {
                    data.isCompany === 0 ? (<>
                      <label className="form-control-label col">Tên doanh nghiệp</label>
                    </>) : ''
                  }
                  {
                    data.isCompany === 2 ? (<>
                      <label className="form-control-label col">HTX</label>
                    </>) : ''
                  }
                  {
                    data.isCompany === 1 ? (<>
                      <label className="form-control-label col"> Cá nhân</label>
                    </>) : ''
                  }

                  {/* <label className="form-control-label col">Tên doanh nghiệp</label> */}
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.companyName}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.companyName}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>
              <div className={classes.rowItem}>
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Địa chỉ
                  </label>
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.address + ', ' + data.wardName + ', ' + data.districtName + ', ' + data.pRovinceName}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={
                        data.address + ', ' + data.wardName + ', ' + data.districtName + ', ' + data.pRovinceName
                      }
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>
              {/* <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Mã số thuế
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                               
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.taxCode}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                    </div> */}
              {/* <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Ngành nghề
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.fieldName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col" style={{ padding: '10px 15px 0px 15px' }}
                            >
                                Giới thiệu chung
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} style={{ padding: '10px 12px' }}>
                                
                                <div dangerouslySetInnerHTML={{ __html: data.introduce }} />
                            </div>
                        </div>
                    </div> */}

              <div className={classes.rowItem}>
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Điện thoại
                  </label>
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.phoneNumber}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.phoneNumber}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    /</InputGroup>
                  </div> */}
                </div>
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Fax
                  </label>
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.fax}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.fax}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>
              <div className={classes.rowItem}>
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Email
                  </label>
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.email}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.email}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>
              <div className={classes.rowItem}>
                <div>
                  <label
                    className="form-control-label col"
                  >
                    Website
                  </label>
                </div>
                <div style={{ width: '100%' }}>
                  <span className="css-margin-span-company-verify">{data.website}</span>
                  {/* <div className={classes.inputArea} >
                    <InputGroup className="input-group-alternative">
                    <Input
                      style={{

                        background: 'transparent',
                        borderWidth: 0,
                        color: '#000'
                      }}
                      type="text"
                      defaultValue={data.website}
                      readOnly
                      onKeyUp={(event) => this.handleChange(event)}
                    />
                    </InputGroup>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Người liên hệ
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactName}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                    </div> */}
          {/* <div className={classes.rowItem}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Điện thoại
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactPhone}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Email
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                
                                <Input
                                    style={{
                                        fontWeight: 'bold',
                                        background: 'transparent',
                                        borderWidth: 0,
                                        color: '#000'
                                    }}
                                    type="text"
                                    defaultValue={data.contactEmail}
                                    readOnly
                                    onKeyUp={(event) => this.handleChange(event)}
                                />
                                
                            </div>
                        </div>
                    </div> */}
          {/* <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Vị trí
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            {cutLocation ? (
                                <iframe
                                    src={'https://maps.google.com/maps?q=' +
                                        data.location +
                                        '&hl=es;z=14' +
                                        '&output=embed'}
                                    width="100%"
                                    height="200px"
                                    style={{
                                        border: 0
                                    }}
                                    allowfullscreen=""
                                    loading="lazy">
                                </iframe>
                            ) : null}
                        </div>
                    </div>
                    <div className={classes.rowItem} style={{ alignItems: 'flex-start' }}>
                        <div>
                            <label
                                className="form-control-label col"
                            >
                                Logo
                            </label>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className={classes.inputArea} >
                                <img src={data.logo ? data.logo : NoImg}
                                    style={{ width: 200, height: 200 }} />
                            </div>
                        </div>
                    </div> */}
          <div className={classes.rowItem} style={{ alignItems: 'center' }}>
            <div className={'col-6'} style={{ height: 521 }}>
              <label
                className="form-control-label col"
                style={{ width: '100%' }}
              >
                GIẤY PHÉP KINH DOANH
              </label>
              <div className={classes.rowItem} style={{ alignItems: 'center', width: '100%' }}>
                <div style={{ width: '100%' }}>
                  {
                    (img.length < 1 || img === null) ? (
                      <div className={`${classes.inputArea} with-img-329`} >
                        <img src={NoImg} style={{ width: 329, height: 468, maxHeight: 500 }} />
                      </div>
                    ) : null
                  }
                  {img.length > 1 ? (
                    <>
                      <div className={`${classes.inputArea} with-img-329`} >
                        <ImageModalHeight
                          src={img} alt="..." ratio={`1:2`} />
                      </div>
                    </>
                  ) : null
                  }
                  {
                    img.length === 1 ? (
                      <div className={`${classes.inputArea} with-img-329`} >
                        <ImageModal alt='...' ratio={`2:1`} src={img} />
                        {/* <img src={img} style={{ width: 329, height: 468, maxHeight: 500 }} /> */}
                      </div>

                    ) : null
                  }

                </div>
              </div>
            </div>
            <div className={'col-6 '} style={{ height: 521 }}>
              <label
                className="form-control-label col"
                style={{ width: '100%' }}
              >
                CÁC LOẠI GIẤY ĐĂNG KÝ/CHỨNG NHẬN
              </label>
              <div className={classes.rowItem} style={{ alignItems: 'center', width: '100%' }}>
                <div style={{ width: '100%' }}>

                  {imgs.length > 1 ? (
                    <>
                      <div className={`${classes.inputArea}`} >
                        <ImageModalHeight
                          style={{ width: 329, height: 468, maxHeight: 500 }}
                          alt="..." ratio={`1:2`} src={imgs} />
                      </div>
                    </>
                  ) : null
                  }
                  {imgs.length === 1 ? (
                    <>
                      <div className={`${classes.inputArea}`} >
                        <ImageModal
                          alt="..." ratio={`1:2`} src={imgs}
                        // style={{ width: 329, height: 468, maxHeight: 500 }} 

                        />
                      </div>
                    </>
                  ) : null
                  }
                  {(imgs.length < 1 || imgs === null) ? (
                    <>
                      <div className={`${classes.inputArea}`} >
                        <img
                          src={NoImg}
                          style={{ width: 329, height: 468, maxHeight: 500 }} />
                      </div>
                    </>
                  ) : null
                  }

                </div>
              </div>
            </div>
          </div>
          <div className={classes.rowItem} style={{ alignItems: 'center', marginTop: 10 }}>
            <div>
              <label
                className="form-control-label col"
                style={{ width: '100%' }}
              >
                HÌNH ẢNH LIÊN QUAN
              </label>
            </div>
          </div>
          <div className={classes.rowItem} style={{ alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%' }}>
              {pathImg.length > 1 ? (
                <div className={`${classes.inputArea}`} >
                  <ImageModalWidth
                    style={{ maxHeight: 300 }}
                    src={pathImg}
                    ratio={'1:1'}
                    alt='...'
                  />
                </div>
              ) : null
              }
              {pathImg.length === 1 ? (
                <div className={classes.inputArea} >
                  <ImageModal
                    alt='...' ratio={`2:1`} src={pathImg} />
                </div>
              ) : null
              }
              {(pathImg.length < 1) ? (
                <div className={classes.inputArea} >
                  <img style={{ width: '100%', height: '100%', maxHeight: 300 }} src={NoImg} />
                </div>
              ) : null
              }
            </div>
          </div>

          <div className={classes.rowItem} style={{ alignItems: 'center', width: '100%' }}>

            <div style={{ width: '100%' }}>
              {cutLocation ? (
                <iframe
                  src={'https://maps.google.com/maps?q=' +
                    data.location +
                    '&hl=es;z=14' +
                    '&output=embed'}
                  width="100%"
                  height="200px"
                  style={{
                    border: 0
                  }}
                  allowfullscreen=""
                  loading="lazy">
                </iframe>
              ) : null}
            </div>
          </div>
        </div>
      )
    );
  }
};

export default ViewModal;
