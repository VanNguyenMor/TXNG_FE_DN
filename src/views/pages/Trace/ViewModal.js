import React, { Component } from "react";
import classes from './index.module.css';
import moment from 'moment';
import { handleCurrencyFormat } from "../../../helpers/common";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"
import { DATA_TYPES } from "../../../helpers/constant"
//import Fancybox from "../../../components/FancyBox";

// reactstrap components
import {
  Input,
  InputGroup,

} from "reactstrap";

class DiaryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { item, contents } = this.props;
    let result = '';
    let styles = {};
    if (item.eResult == 0) {
      result = 'Đang chờ';
      styles = classes.bodyItemInfoRowValueWaiting;
    } else if (item.eResult == 1) {
      result = 'Đạt';
      styles = classes.bodyItemInfoRowValueActive;
    } else if (item.eResult == 2) {
      result = 'Không đạt';
      styles = classes.bodyItemInfoRowValueDisable;
    } else if (item.eResult == 3) {
      result = 'Đã thực hiện lại';
      styles = classes.bodyItemInfoRowValueRemake;
    }
    return (
      <>

        <div className={classes.itemBodyView}>
          <div>
            <div className={classes.titleItemView}>{item.infoName}</div>
            {item.isTraceItem ? <div>Cá thể: {item.itemName}</div> : null}
          </div>
          <div>
            {contents.map(item => {
              let value = '';
              let location = null;

              if (item.DataType == 4) {
                value = (item.Value || '').split(';').filter(p => p) || [];

                if (value.length <= 0) {
                  return null;
                }
              } else if (item.DataType == DATA_TYPES.banDo) {
                value = item.DisplayValue;

                if (item.Value) {
                  const splitValue = item.Value.split(',');

                  if (splitValue[0] && splitValue[1]) {
                    location = {
                      latitude: parseFloat(splitValue[0]),
                      longitude: parseFloat(splitValue[1]),
                      latitudeDelta: 10,
                      longitudeDelta: 10
                    }
                  }
                }
              } else if (item.DataType == DATA_TYPES.trueFalse) {
                value = item.Value;
              } else {
                value = item.DisplayValue;
              }

              let unitName = '';
              let quantity = 0;

              if (item.Reference == 40 && item.Material) {
                unitName = item.Material.UnitName;

                quantity = item.Material.Quantity || 0;
              }

              if (!value) {
                return null;
              }

              return (
                <div>
                  <div className="row">
                    <div className="col-4" >{item.ColumnName}</div>
                    {item.DataType == DATA_TYPES.hinhanh ?
                      <div className={`col-8 `}>
                        {value.map(item2 => {
                          return (
                            <>
                              <a href={value} target='_blank'>
                                <img className='modal-body-item-file-item-image' src={value} /></a>
                            </>
                          )
                        })}
                      </div> :
                      <div className="col-8" >
                        {item.DataType == DATA_TYPES.trueFalse ? <div >
                          <div>
                            <div>

                            </div>
                          </div>
                        </div> :
                          <div className={classes.itemValueView}>{value}</div>}
                        {(item.DataType == DATA_TYPES.banDo && location) ?
                          //  <TouchableOpacity activeOpacity={0.8} onPress={this.onPreviewMap(location)}>
                          //   <_MapView rotateEnabled={false} pitchEnabled={false} scrollEnabled={false} region={location} style={style.bodyItemInfoBodyItemValueMap} zoomEnabled={false} zoomTapEnabled={false}>
                          //     <Marker coordinate={location}></Marker>
                          //   </_MapView>
                          // </TouchableOpacity> 
                          <iframe
                            src={'https://maps.google.com/maps?q=' +
                              location +
                              '&hl=es;z=14' +
                              '&output=embed'}
                            width="150px"
                            height="150px"
                            style={{
                              border: 0
                            }}
                            allowfullscreen=""
                            loading="lazy">
                          </iframe>
                          : null}

                      </div>}
                  </div>
                  {unitName ?
                    <div>
                      {quantity > 0 ?
                        <div className="row">
                          <div className="col-4">Số lượng</div>
                          <div className="col-8">
                            <div className={classes.itemValueView}>{quantity}</div>
                          </div>
                        </div> : null}
                      <div className="row">
                        <div className="col-4">Đơn vị tính</div>
                        <div className="col-8">
                          <div className={classes.itemValueView}>{unitName}</div>
                        </div>
                      </div>

                    </div> : null}
                </div>
              )
            })}
          </div>
          <div>
            <div className="row" style={{ marginTop: 10 }}>
              <div className="col-4" >Người thực hiện</div>
              <div className={`col-8 ${classes.itemValueView}`} >{item.fullName}</div>
            </div>
          </div>
          <div>
            <div className="row">
              <div className="col-4" >Kết quả</div>
              <div className={`col-8 ${styles} ${classes.itemValueView}`} >{result}</div>
            </div>
          </div>
          {item.eResult == 2 ?
            <div>
              <div className="row">
                <div className="col-4">Lý do</div>
                <div className={`col-8 ${classes.itemValueView}`}>{item.reason}</div>
              </div>
              <div className="row">
                <div className="col-4">Hình ảnh</div>
                <div className={`col-8 ${classes.itemValueView}`}>
                  {/* <ReactFancyBox
                    thumbnail={item.eFile}
                    image={item.eFile}
                  /> */}
                  <a href={item.eFile} target='_blank'><img className='modal-body-item-file-item-image' src={item.eFile} /></a>
                </div>
              </div>
            </div> : null}
          {item.eResult == 0 ? null :
            <div>
              <div className="row">
                <div className="col-4">Người đánh giá</div>
                <div className={`col-8 ${classes.itemValueView}`}>{item.evaluatedBy}</div>
              </div>
              <div className="row">
                <div className="col-4">Ngày đánh giá</div>
                <div className={`col-8 ${classes.itemValueView}`}>{item.eDate ? moment(item.eDate).format('HH:mm DD/MM/YYYY') : ''}</div>
              </div></div>}
        </div>
      </>
    )
  }
}

class Diary extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
    const { dataTraceInforms, dataTrace } = this.props;
    let value = '';
    let location = null;
    let unitName = '';
    let quantity = 0;
    let contents = [];
    return (
      <>
        <div className={classes.headerView}>
          <div className="row">
            <div className="col-6" style={{ display: 'flex' }}>
              <p>Sản phẩm:</p>&ensp;
              <p className={classes.textHeader}>{(dataTrace || {}).productName}</p></div>
            {(dataTrace || {}).pzName ? (
              <div className="col-6" style={{ display: 'flex' }}>
                <p>Vị trí:</p>&ensp;
                <p className={classes.textHeader}>{(dataTrace || {}).pzName}</p>
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex' }}>
            <p>Doanh nghiệp/Người sản xuất:</p>&ensp;
            <p className={classes.textHeader}>{(dataTrace || {}).companyName}</p>
          </div>
          <div style={{ display: 'flex' }}>
            <p>Ngày bắt đầu:</p>&ensp;
            <p className={classes.textHeader}>{moment((dataTrace || {}).createdDate).format('DD/MM/YYYY')}</p>
          </div>
        </div>
        {Array.isArray(dataTraceInforms) && (
          dataTraceInforms
            .map((item, key) => (
              contents = JSON.parse(item.contents || '[]') || [],
              <div className={`row ${classes.bodyView}`}>
                <div className='col-2' style={{ alignSelf: 'center' }}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
                    {moment(item.createdDate).format('HH:mm')}</div>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
                    {moment(item.createdDate).format('DD/MM/YYYY')}</div>
                </div>
                <div className='col-10'>
                  <DiaryItem contents={contents} item={item} />
                </div>
              </div>

            )))
        }

      </>
    );
  }
};

export default Diary;
