import React, { Component } from "react";
import classes from './index.module.css';
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionProducts } from "../../../actions/ProductsActions";
import { actionPartner } from "../../../actions/PartnerActions";
import Select from "components/Select";
import fileIcon from "../../../assets/img/buttons/Browse.svg";
import checkIcon from "../../../assets/img/buttons/DauCheck.svg";
import deleteIcon from "../../../assets/img/buttons/Remove.svg";
import {
  MAX_FILE_IMAGE_SIZE, EXTENSION_FILE_IMAGE, validSize,
  validExtensionFileImage, validExtensionFileUpload, EXTENSION_FILE_UPLOAD
} from 'bases/helper';
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
// reactstrap components
import {
  Button
} from "reactstrap";

class UpdateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPartner: {},
      dataPartners: [],
      activeSubmit: false,
      pathImageDefaul: [],
      mfileImg: [],
      ArrayFileAdd: [],
      data: {
        "ID": "",
        "VerifyID": "",
      },
    }
    this.refFileImage = null;
  }

  async componentWillMount() {
    const { requestGetPartner, requestListPartner, id } = this.props;
    let { data } = this.state;

    if (id) {
      await requestGetPartner(id).then(
        res => {
          const data = (res || {}).data || {};

          let dataPartner = (data || {}).data || {};


          if (dataPartner.verifiedImage) {
            const pIm = dataPartner.verifiedImage;
            const spl = pIm.split(';');
            this.setState(previousState => {
              return {
                ...previousState,
                pathImageDefaul: spl
              }
            });
          }

          data.ID = dataPartner.id;
          data.VerifyID = dataPartner.verifyID;

          this.setState(previousState => {
            return {
              ...previousState,
              dataPartner,

              id,
              data,
              fileImage: dataPartner.verifiedImage
            }
          }, () => { this.handleCheckValidation(this.state) });
        }
      )
    }

    await requestListPartner(JSON.stringify({
      "companyName": "",
      "phone": "",
      "email": "",
      "taxCode": "",
      "orderBy": "",
      "page": null,
      "limit": null
    })).then(res => {

      const data = ((res.data) || {}).data || {};
      let dataPartners = (data || {}).partners || [];

      this.setState(previousState => {
        return {
          ...previousState,
          dataPartners
        }
      });
    });

    this.handleCheckValidation(this.state);
  }

  handleSelect = (value, name) => {
    let { data } = this.state;

    if (name === 'VerifyID') {
      let valsortOrder = value;
      if (valsortOrder == null) {
        this.setState({ verifyIDChange: null })
      }
    }

    if (value === null) value = "";
    data[name] = value;

    this.setState({ data });

    // Check Validation 
    this.handleCheckValidation();
  }

  handleCheckValidation = (state) => {
    const { handleCheckValidation, handleNewData } = this.props;
    let { data, mfileImg, fileImage } = this.state;
    this.setState({ activeSubmit: true });
    // Check Validation 
    handleCheckValidation(true);
    // Handle New Data
    handleNewData(data, mfileImg, fileImage);
  }

  onUpdateFileImage = () => {
    this.refFileImage.click();
  }

  onChangeFileImage = e => {
    const { id, pathImageDefaul } = this.state;
    const files = e.target.files || [];

    if (files.length > 0) {
      const file = files || null;
      if (file) {
        const errors = {};

        this.setState(previousState => {
          return {
            ...previousState,
            errors
          }
        });
        for (let i = 0; i < file.length; i++) {
          if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
            errors.fileImage = 'Kích thước file phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
          }
          if (!validExtensionFileUpload(file[i].name)) {
            errors.fileImage = 'File sai định dạng jpeg, jpg, png, bmp, webp, gif, xls, xlsx, docx, doc, pdf';
          }
        }
        this.setState(previousState => {
          return {
            ...previousState,
            errors
          }
        });

        if (Object.keys(errors).length > 0) {
          return;
        }
        if (this.state.mfileImg.length > 0) {
          let _mfileImg = [...this.state.mfileImg];
          for (let i = 0; i < files.length; i++) {
            _mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
          }

          this.setState(previousState => {
            return {
              ...previousState,
              mfileImg: _mfileImg
            }
          }, () => { this.handleCheckValidation(this.state) })
        } else {
          this.setState({ mfileImg: files }, () => { this.handleCheckValidation(this.state) })
        }
        const pathImage = Array.from(files).map((ee) => URL.createObjectURL(ee));
        if (this.state.ArrayFileAdd) {

          let _ArrayFileAdd = this.state.ArrayFileAdd;
          for (let i = 0; i < files.length; i++) {
            _ArrayFileAdd.push(pathImage[i]);
          }

        } else {
          this.setState({ ArrayFileAdd: pathImage })
        }

        if (id) {
          if (pathImageDefaul) {
            this.setState(previousState => {
              return {
                ...previousState,
                pathImageDefaul: this.state.pathImageDefaul.concat(pathImage)

              }
            });
          } else {
            this.setState(previousState => {
              return {
                ...previousState,
                pathImageDefaul: pathImage

              }
            });
          }
        } else {
          if (pathImageDefaul) {
            pathImageDefaul.push(pathImage)
            this.setState(previousState => {
              return {
                ...previousState,
                pathImageDefaul: pathImageDefaul
              }
            });
          } else {
            this.setState(previousState => {
              return {
                ...previousState,
                pathImageDefaul: pathImage

              }
            });
          }
        }

      }

    }

  }

  onDeleteFileImage = (e) => {
    const { pathImageDefaul, fileImage, ArrayFileAdd } = this.state;
    var array = [...pathImageDefaul]
    var index = array.indexOf(e);

    if (index !== -1) {
      array.splice(index, 1);
      this.setState({
        pathImageDefaul: array,
      });
    }

    let flah = false;
    if (fileImage) {
      const spl = fileImage.split(';')
      Array.from(spl).filter(x => x === e).map(
        item => { flah = true }
      )

      if (flah == true) {
        spl.splice(spl.indexOf(e), 1);
        var fileImageSend = spl.join(';')

        this.setState(previousState => {
          return {
            ...previousState,
            fileImage: fileImageSend
          }
        }, () => { this.handleCheckValidation(this.state) })
      }

    }

    let flag = false;
    if (ArrayFileAdd) {
      Array.from(ArrayFileAdd).filter(x => x === e).map(
        item => {
          flag = true
        }
      )

      if (flag == true) {
        ArrayFileAdd.splice(ArrayFileAdd.indexOf(e), 1);

        let _ArrayFileAdd = [];
        for (let i = 0; i < ArrayFileAdd.length; i++) {

          fetch(ArrayFileAdd[i]).then(res => res.blob()).then(blob => {
            _ArrayFileAdd.push(new File([blob], `${ArrayFileAdd[i].replace('blob:http://localhost:5000/')}.jpeg`,
              { lastModified: new Date().getTime(), type: 'image/jpeg' }));
          });
        }

        this.setState(previousState => {
          return {
            ...previousState,
            mfileImg: _ArrayFileAdd
          }
        }, () => { this.handleCheckValidation(this.state) })
      }

    }

  }

  render() {
    const { dataPartners, pathImageDefaul, dataPartner, verifyIDChange, errors } = this.state;
    const { errorUpdate } = this.props;

    let _dataPartners
    let _dataPartnersName

    if (dataPartner.verifyID != null) {
      _dataPartners = dataPartners.filter(x => dataPartner.verifyID == x.id)
      if (verifyIDChange === null) {
        _dataPartnersName = null
      } else {
        if (_dataPartners[0]) {
          _dataPartnersName = _dataPartners[0].partnerName
        }
      }
    }

   

    return (
      <div className={classes.formControl}>
        <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
          <label
            className="form-control-label"
          >
            Tập tin đính kèm&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
        </div>

        <div className={classes.rowItem} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <input onChange={this.onChangeFileImage}
            style={{ display: 'none' }} ref={ref => this.refFileImage = ref}
            multiple type='file' className='hidden' />
          <div style={{ marginLeft: 0, marginRight: 0, width: '100%' }}>
            {pathImageDefaul &&
              <div className={classes.inputArea} style={{ padding: '5px 15px' }}>
                {Array.isArray(pathImageDefaul) && (
                  pathImageDefaul.map((item, key) => {

                    let listViewAttachmentsImg = [];
                    let listViewAttachmentsFile = [];

                    if (EXTENSION_FILE_IMAGE.find(p => p == item.split('.').pop())) {
                      listViewAttachmentsImg.push(item);
                    } else {
                      listViewAttachmentsFile.push(item);
                    }

                    return <div key={key}>
                      <div style={{ textAlign: 'left' }} className='table-scale-col'>
                        {listViewAttachmentsImg ?
                          (
                            Array.isArray(listViewAttachmentsImg) && (
                              listViewAttachmentsImg.map((lst, key) => {
                                return (
                                  <>
                                    {lst ? (
                                      <>
                                        <div className="row">
                                          <img src={checkIcon} width={21} height={21} />
                                          {/* <div id='productVerify' style={{ marginBottom: 5, cursor: 'pointer' }}>
                                            <ReactFancyBox
                                              image={lst}
                                              thumbnail={lst}
                                            />
                                          </div> */}
                                          <a key={key} target='_blank' href={lst}
                                            style={{
                                              marginRight: '3px',
                                              maxWidth: '350px',
                                              display: 'block',
                                              whiteSpace: 'nowrap',
                                              textOverflow: 'ellipsis',
                                              overflow: 'hidden',
                                              marginBottom: 5
                                            }}>
                                            &ensp;{lst.split("/").pop()}
                                          </a>&ensp;
                                          <div
                                            style={{
                                              backgroundColor: 'red', padding: 2, width: 21,
                                              height: 21, display: 'flex', alignItems: 'center',
                                              justifyContent: 'center', cursor: "pointer"
                                            }}
                                            onClick={() => this.onDeleteFileImage(item)}>
                                            <img onClick={() => this.onDeleteFileImage(item)}
                                              src={deleteIcon} width={15} height={15}
                                            />
                                          </div>
                                        </div>
                                      </>) : <img width={50} height={50} src={NoImg} />}
                                  </>
                                )
                              }
                              )
                            )
                          )
                          : null
                        }

                        {listViewAttachmentsFile ?
                          (
                            Array.isArray(listViewAttachmentsFile) && (
                              listViewAttachmentsFile.map((lst, key) => (
                                <>
                                  <div className="row">
                                    <img src={checkIcon} width={21} height={21} />
                                    <a key={key} target='_blank' href={lst}
                                      style={{
                                        marginRight: '3px',
                                        maxWidth: '350px',
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        marginBottom: 5
                                      }}>
                                      &ensp;{lst.split("/").pop()}
                                    </a>&ensp;
                                    <div
                                      style={{
                                        backgroundColor: 'red', padding: 2, width: 21,
                                        height: 21, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: "pointer"
                                      }}
                                      onClick={() => this.onDeleteFileImage(item)}
                                    >
                                      <img
                                        src={deleteIcon} width={15} height={15}
                                      />
                                    </div>
                                  </div>
                                </>
                              ))
                            )
                          )
                          : null
                        }
                      </div>
                    </div>

                  })
                )}
              </div>
            }
          </div>

        </div>
        <div style={{ width: '100%', justifyContent: 'flex-start' }}>
          {/* <p className='form-error-message margin-bottom-0'>{(errors || {}).fileImage || ''}</p>
          <p className='form-error-message margin-bottom-0'>{(errorUpdate || {}).file || ''}</p> */}
          <p className='form-error-message margin-bottom-0'>{(errors || {}).fileImage ? (errors || {}).fileImage : ((errorUpdate || {}).file || '')}</p>
        </div>
        <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
          <label
            className="form-control-label"
          >
            <Button
              color={"default"}
              type="button"
              className={`btn-primary-cs`}
              style={{ margin: 0 }}
              onClick={this.onUpdateFileImage}
            >
              <img src={fileIcon} alt='Chọn file' />
              <span>Chọn file</span>
            </Button>
          </label>
        </div>

        <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
          <label
            className="form-control-label"
            style={{ minWidth: 500 }}
          >
            Đơn vị xác thực&nbsp;<b style={{ color: 'red' }}>*</b>
          </label>
        </div>

        <div className={classes.rowItem} style={{ justifyContent: 'flex-start' }}>
          <Select
            name='VerifyID'
            labelName='partnerName'
            data={dataPartners}
            defaultValue={dataPartner.verifyID}
            labelMark={_dataPartnersName}
            val='id'
            title='Chọn đơn vị xác thực'
            handleChange={this.handleSelect}
          />
        </div>
        <p className='form-error-message margin-bottom-0' style={{ alignSelf: "start" }}>{(errorUpdate || {}).VerifyID || ''}</p>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    products: state.ProductsStore,
    partner: state.PartnerStore
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(actionProducts, dispatch),
    ...bindActionCreators(actionPartner, dispatch),
  }
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UpdateModal);
