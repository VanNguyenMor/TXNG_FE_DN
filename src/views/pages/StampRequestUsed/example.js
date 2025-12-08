import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import RNQRGenerator from 'rn-qr-generator';
import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import _Toast from '../../bases/controls/toast';

import NumberFromTo from '../../components/numberFromTo';

import BoxMainContainer from '../../containers/components/boxMain';

import {checkOneClaim} from '../../utils/user';

import {ICONS} from '../../../assets/imgs';

import style from './style';

import {DEFAULTS, KEY_NAVIGATIONS, PAGINATIONS} from '../../constants/config';

import {manageItemConstant} from '../../states/manageItem';

import {
  CLAIMS,
  STAMP_STATUSES_BROWSE,
  STAMP_STATUSES_LICENSE,
  STAMP_STATUSES,
} from '../../constants/data';

import DatePicker from '../../bases/controls/datePicker';

import FormQuestion from '../../components/formQuestion';

import ModalComponent from '../../components/modal';

import {COLORS} from '../../constants/theme';
import {AuthenticateView} from '../../utils/auth';
import FormDelete from '../../components/formDelete';
import {getErrorMessageServer} from '../../utils/errorMessageServer';
import {numberWithCommas} from '../../bases/helper';

class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isQR: false,
    };
  }
  componentDidMount() {}
  onUpdate = () => {
    const {isQR} = this.state;
    this.setState(previousState => {
      return {
        ...previousState,
        isQR: !isQR,
      };
    });
  };

  onSubmit = () => {
    const {isQR} = this.state;
    if (isQR) {
      this.props.onPrintListQR();
    } else {
      this.props.onPrintListStamp();
    }
  };

  render() {
    const {isQR, size, number} = this.state;
    const CustomCheckbox = ({title, isList}) => {
      let styleTrue = {
        backgroundColor: isQR ? COLORS.primary : COLORS.white,
      };
      let styleFalse = {
        backgroundColor: isQR ? COLORS.white : COLORS.primary,
      };
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={style.checkbox}
          onPress={this.onUpdate}>
          <View style={style.outCheckbox}>
            <View style={[style.inCheckbox, isList ? styleFalse : styleTrue]} />
          </View>
          <Text>{title}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={style.print}>
        <View style={style.printFlex}>
          <View style={style.checkbox}>
            <CustomCheckbox title="Danh sách mã tem" isList={true} />
            <CustomCheckbox title="Danh sách mã QR" isList={false} />
          </View>
        </View>
        <TouchableOpacity
          onPress={this.onSubmit}
          activeOpacity={0.8}
          style={style.confirmFunctionItem}>
          <Text style={style.confirmFunctionItemText}>ĐỒNG Ý</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ProductItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationTranslateX: new Animated.Value(0),
      claim: true,
    };

    this.pageXStart = 0;
    this.pageXEnd = 0;
    this.pageYStart = 0;
    this.pageYEnd = 0;
    this.increase = 0;
    this.isDelete = false;
    this.isRequestConfirm = false;
    this.isRequestManageItem = false;
    this.isPrint = false;
  }

  async componentDidMount() {
    let claim = await checkOneClaim([CLAIMS.manageItem.delete]);
    this.setState(previousState => {
      return {
        ...previousState,
        claim,
      };
    });
  }

  onTouchStart = e => {
    this.pageXStart = e.nativeEvent.pageX;
    this.pageXEnd = 0;
    this.pageYStart = e.nativeEvent.pageY;
    this.pageYEnd = 0;
    this.increase = 0;
    this.isDelete = false;
    this.isRequestConfirm = false;
    this.isRequestManageItem = false;
    this.isPrint = false;
  };

  onTouchMove = e => {
    const pageXEndOld = this.pageXEnd;

    if (pageXEndOld != 0 && Math.abs(pageXEndOld - e.nativeEvent.pageX) <= 2) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (Math.abs(this.pageXStart - this.pageXEnd) > DEFAULTS.offSetMinSwipe) {
      const listProductRef = this.props.listProductRef;

      if (listProductRef) {
        listProductRef.setNativeProps({scrollEnabled: false});
      }

      if (pageXEndOld > this.pageXEnd) {
        this.increase -= DEFAULTS.offSetIncreaseSwipe;
      } else {
        this.increase += DEFAULTS.offSetIncreaseSwipe;
      }

      Animated.timing(this.state.animationTranslateX, {
        toValue: this.increase,
        duration: 5,
        delay: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      if (this.increase < -66 || this.increase > 0) {
        Animated.timing(this.state.animationTranslateX, {
          toValue: this.increase < -66 ? -66 : 0,
          duration: 5,
          delay: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  onTouchEnd = id => e => {
    if (
      this.isDelete ||
      this.isRequestConfirm ||
      this.isRequestManageItem ||
      this.isPrint
    ) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (
      Math.abs(this.pageXStart - this.pageXEnd) <=
        DEFAULTS.offSetMinSwipeEdit &&
      Math.abs(this.pageYStart - this.pageYEnd) <= DEFAULTS.offSetMinSwipeEdit
    ) {
      this.props.onEdit(id);

      this.increase = 0;
      this.pageXStart = 0;
      this.pageYStart = 0;
      this.pageYEnd = 0;
      this.pageXEnd = 0;
      this.isDelete = false;
      this.isRequestConfirm = false;
      this.isRequestManageItem = false;
      this.isPrint = false;
      return;
    }

    if (this.increase <= DEFAULTS.offSetMinSwipeExpand) {
      this.increase = -66;
    } else {
      this.increase = 0;
    }

    Animated.timing(this.state.animationTranslateX, {
      toValue: this.increase,
      duration: 5,
      delay: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      const listProductRef = this.props.listProductRef;
      if (listProductRef) {
        listProductRef.setNativeProps({scrollEnabled: true});
      }
    });

    this.increase = 0;
    this.pageXStart = 0;
    this.pageYStart = 0;
    this.pageYEnd = 0;
    this.pageXEnd = 0;
    this.isDelete = false;
    this.isRequestConfirm = false;
    this.isRequestManageItem = false;
    this.isPrint = false;
  };

  onDelete = id => () => {
    this.isDelete = true;
    this.props.onDelete(id).then(() => {
      this.isDelete = false;
    });
  };
  onRequestConfirm = item => () => {
    this.isRequestConfirm = true;
    this.props.onRequestConfirm(item).then(() => {
      this.isRequestConfirm = false;
    });
  };
  onRequestManageItem = (id, status, requestedUsedStatus, isUsed) => () => {
    this.isRequestManageItem = true;
    this.props.onRequestManageItem(id, status, requestedUsedStatus, isUsed)();
  };

  onPaymentManageItem = id => () => {
    this.isRequestManageItem = true;
    this.props.onPaymentManageItem(id)();
  };

  onPrintQRCode = item => () => {
    this.isPrint = true;
    // this.props.onPrintQRCode(item).then(() => {
    //   this.isPrint = false;
    // });
    this.props.onPrintQRCode(item);
    setTimeout(() => {
      this.isPrint = false;
    }, 0);
  };

  onPrintListStamp2 = item => () => {
    this.isPrint = true;
    this.props.onPrintListStamp2(item);
    setTimeout(() => {
      this.isPrint = false;
    }, 0);
  };

  render() {
    const {item, isConfirm} = this.props;
    const {claim} = this.state;
    const {status, requestedUsedStatus, isPrint} = item;

    let titleBrowse = STAMP_STATUSES[status || 0].titleBrowse;
    let titleLicense = STAMP_STATUSES[requestedUsedStatus || 0].titleLicense;

    let colorBrowse = STAMP_STATUSES[status || 0].color;
    let styleBrowse = {color: colorBrowse, borderColor: colorBrowse};
    let colorLicense = STAMP_STATUSES[requestedUsedStatus || 0].color;
    let styleLicense = {color: colorLicense, borderColor: colorLicense};

    let showDeliveryDate = status == 2 && requestedUsedStatus != 3;
    let showRequestBrowse = status == 0 && requestedUsedStatus == 0;
    let showRequestBrowseFile = status == 3 && requestedUsedStatus == 0;
    let showRequestLicense =
      (status == 2 && requestedUsedStatus == 0) ||
      (status == 2 && requestedUsedStatus == 3);
    let showDelete =
      (status == 0 && requestedUsedStatus == 0) ||
      (status == 3 && requestedUsedStatus == 0);
    let showPrint = status == 2 && requestedUsedStatus == 2 && isPrint;

    let showPaymentButton = status == 4 && isPrint == false;
    return (
      <>
        {isConfirm ? (
          <View
            onTouchEnd={this.onTouchEnd(item.id)}
            onTouchMove={claim && showDelete ? this.onTouchMove : null}
            onTouchStart={this.onTouchStart}
            style={style.bodyItem}>
            <Animated.View
              style={[
                style.bodyItemInfo,
                {
                  transform: [
                    {
                      translateX: this.state.animationTranslateX,
                    },
                  ],
                },
              ]}>
              <View style={style.bodyItemInfoWrap}>
                <Text style={style.bodyItemInfoName}>
                  Ngày yêu cầu:{' '}
                  {moment(item.requestedDate).format('DD/MM/YYYY')}
                </Text>
                <Text style={style.bodyItemInfoDescription}>
                  SL yêu cầu:{' '}
                  {item.quantity ? numberWithCommas(item.quantity, '.') : 0}
                </Text>
                <Text style={style.bodyItemInfoDescription}>
                  Dải tem từ: {item.startNum} - {item.endNum}
                </Text>
                {/* {item.requestedDate && (
              <Text style={style.bodyItemInfoDescription}>
                Ngày yêu cầu: {moment().format('DD/MM/YYYY')}
              </Text>
            )} */}
                <Text style={style.bodyItemInfoDescription}>
                  Hình thức: {isPrint ? 'Tự in' : 'Yêu cầu in'}
                </Text>
                {showDeliveryDate && item.deliveryDate && (
                  <Text style={style.bodyItemInfoDescription}>
                    Ngày trả tem:{' '}
                    {moment(item.deliveryDate).format('DD/MM/YYYY')}
                  </Text>
                )}
                {/* <Text style={style.bodyItemInfoDescription}>
              Người xử lý: {item.confirmedBy}
            </Text> */}
                {status == 3 && item.reason && (
                  <Text style={style.bodyItemInfoDescription}>
                    Lý do không duyệt: {item.reason}
                  </Text>
                )}
                {requestedUsedStatus == 3 && item.requestedUsedReason && (
                  <Text style={style.bodyItemInfoDescription}>
                    Lý do không cấp phép: {item.requestedUsedReason}
                  </Text>
                )}
                <View style={style.wrap}>
                  <Text style={[style.bodyItemInfoStatus, {...styleBrowse}]}>
                    {titleBrowse}
                  </Text>
                  <Text
                    style={[
                      style.bodyItemInfoStatus,
                      style.marginFilter,
                      {...styleLicense},
                    ]}>
                    {titleLicense}
                  </Text>
                </View>
              </View>
              {/* {showRequestBrowse && (
                <TouchableOpacity
                  onPress={this.onRequestConfirm(item)}
                  activeOpacity={0.8}
                  style={style.bodyItemLock}>
                  <ICONS.requestConfirm width={24} height={24} />
                </TouchableOpacity>
              )} */}
              {showRequestBrowseFile && (
                <TouchableOpacity
                  onPress={this.onRequestManageItem(
                    item.id,
                    status,
                    requestedUsedStatus,
                    false,
                  )}
                  activeOpacity={0.8}
                  style={style.bodyItemLock}>
                  <ICONS.requestConfirm width={24} height={24} />
                </TouchableOpacity>
              )}
              {isPrint && showRequestLicense && (
                <TouchableOpacity
                  onPress={this.onRequestManageItem(
                    item.id,
                    status,
                    requestedUsedStatus,
                    true,
                  )}
                  activeOpacity={0.8}
                  style={style.bodyItemLock}>
                  <ICONS.requestConfirm2 width={24} height={24} />
                </TouchableOpacity>
              )}
              {showPrint && (
                <TouchableOpacity
                  onPress={this.onPrintQRCode(item)}
                  activeOpacity={0.8}
                  style={[style.bodyItemLock, style.marginRightQRCode]}>
                  <ICONS.qrCodeBlue
                    color={COLORS.primary}
                    width={24}
                    height={24}
                  />
                </TouchableOpacity>
              )}
              {showPaymentButton && (
                <TouchableOpacity
                  onPress={this.onPaymentManageItem(item.id)}
                  activeOpacity={0.8}
                  style={style.bodyItemLock}>
                  <ICONS.requestConfirm width={24} height={24} />
                </TouchableOpacity>
              )}
            </Animated.View>
            <View style={style.bodyItemFunction}>
              <AuthenticateView
                claims={[CLAIMS.manageItem.delete]}
                checkType={0}>
                <TouchableOpacity
                  onPress={this.onDelete(item.id)}
                  activeOpacity={0.8}
                  style={style.bodyItemDelete}>
                  <ICONS.trashWhite width={24} height={24} />
                </TouchableOpacity>
              </AuthenticateView>
            </View>
          </View>
        ) : (
          <View
            onTouchEnd={this.onTouchEnd(item.id)}
            onTouchMove={claim && status != 2 ? this.onTouchMove : null}
            onTouchStart={this.onTouchStart}
            style={style.bodyItem}>
            <Animated.View
              style={[
                style.bodyItemInfo,
                {
                  transform: [
                    {
                      translateX: this.state.animationTranslateX,
                    },
                  ],
                },
              ]}>
              <View style={style.bodyItemInfoWrap}>
                <Text style={style.bodyItemInfoName}>
                  Ngày yêu cầu:{' '}
                  {moment(item.requestedDate).format('DD/MM/YYYY')}
                </Text>
                <Text style={style.bodyItemInfoDescription}>
                  SL yêu cầu:{' '}
                  {item.quantity ? numberWithCommas(item.quantity, '.') : 0}
                </Text>
              </View>
              <TouchableOpacity
                onPress={this.onPrintQRCode(item)}
                activeOpacity={0.8}
                style={[style.bodyItemLock, style.marginRightQRCode]}>
                <ICONS.qrCodeBlue
                  color={COLORS.primary}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
            </Animated.View>
            <View style={style.bodyItemFunction}>
              <AuthenticateView
                claims={[CLAIMS.manageItem.delete]}
                checkType={0}>
                <TouchableOpacity
                  onPress={this.onDelete(item.id)}
                  activeOpacity={0.8}
                  style={style.bodyItemDelete}>
                  <ICONS.trashWhite width={24} height={24} />
                </TouchableOpacity>
              </AuthenticateView>
            </View>
          </View>
        )}
      </>
    );
  }
}

class ManageItem extends Component {
  constructor(props) {
    super(props);

    // const currentDateTime = new Date();

    // const startDateTime = currentDateTime;

    // startDateTime.setDate(1);

    // const endDateTime = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0);

    const currentDateTime = new Date();

    const previousDateTime = new Date().setDate(currentDateTime.getDate() - 30);

    this.state = {
      isVisible: false,
      statusBrowse: '',
      statusLicense: null,
      dateStart: previousDateTime,
      dateEnd: currentDateTime,
      page: 0,
      limit: PAGINATIONS.manageItem,
      isConfirm: false,
    };

    this.listFactoryRef = null;
    this.isLoadingManageItem = false;
    this.scrollYManageItem = 0;
    this.refDatePicker = null;
    this.refNumberFromTo = null;
    this.refFormDelete = null;
    this.refToast = null;
    this.refFormQuestion = null;
    this.refModalComponentRef = null;
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: true,
        };
      });
      const {ManageItemOperations} = this.props;
      ManageItemOperations.getConfig(async config => {
        let dataConfig = config?.data || {};

        let isConfirm = dataConfig?.isConfirm || false;

        this.isLoadingManageItem = false;

        const res = await this.getListManageItem(0, true);

        if (res.status != 200) {
          _Toast.error('Thông báo', 'Lấy danh sách tem thất bại');
        }

        this.setState(previousState => {
          return {
            ...previousState,
            isVisible: false,
            isConfirm,
          };
        });
      });
    });
  }

  numberFromToSetRef = ref => {
    this.refNumberFromTo = ref;
  };

  formQuestionSetRef = ref => {
    this.refFormQuestion = ref;
  };

  datePickerSetRef = ref => {
    this.refDatePicker = ref;
  };

  modalSetRef = ref => {
    this.refModalComponentRef = ref;
  };

  getListManageItem = (page, init = true) => {
    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });
    return new Promise(resolve => {
      if (this.isLoadingManageItem) {
        return resolve({
          status: 200,
        });
      }
      this.isLoadingManageItem = true;

      const {limit, statusLicense} = this.state;
      const {ManageItemOperations} = this.props;
      ManageItemOperations.getListManageItem(
        {
          search: '',
          filter: this.state.statusBrowse.toString(),
          orderBy: '',
          page,
          limit,
          init,
          requestedUsedStatus: statusLicense,
        },
        res => {
          const manageItems = ((res.data || {}).data || {}).stamps || [];
          if (manageItems.length > 0) {
            this.setState(
              previousState => {
                return {
                  ...previousState,
                  page,
                };
              },
              () => {
                this.isLoadingManageItem = false;
              },
            );
          } else {
            this.isLoadingManageItem = false;
          }
          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: false,
            };
          });

          resolve(res);
        },
      );
    });
  };

  onAdd = () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addManageItem);
  };

  onEdit = id => () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addManageItem, {id});
  };

  onRequestManageItem = (id, status, requestedUsedStatus, isUsed) => () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.requestManageItem, {
      id,
      status,
      requestedUsedStatus,
      isUsed,
    });
  };

  onPaymentManageItem = id => () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.paymentManageItem, {
      id,
    });
  };

  onChangeStatusBrowse = value => {
    this.setState(
      previousState => {
        return {
          ...previousState,
          statusBrowse: value,
        };
      },
      () => {
        this.getListManageItem(0, true);
      },
    );
  };

  onChangeStatusLicense = value => {
    this.setState(
      previousState => {
        return {
          ...previousState,
          statusLicense: value,
        };
      },
      () => {
        this.getListManageItem(0, true);
      },
    );
  };

  // printQRCode = async data => {
  //   data = data || {};
  //   this.setState(previousState => {
  //     return {
  //       ...previousState,
  //       isVisible: true,
  //     };
  //   });

  //   const from = data.from - 1;
  //   const to = data.to;

  //   const stampsSplit = data.stamps.slice(from, to);

  //   let qrCodeImageStrings = '';
  //   let generateQRCode = null;

  //   let newPage = 0;

  //   for (let i = 0; i < stampsSplit.length; i++) {
  //     generateQRCode = await RNQRGenerator.generate({
  //       value: stampsSplit[i].qrCode,
  //       height: 250,
  //       width: 250,
  //       base64: true,
  //       backgroundColor: 'white',
  //       color: 'black',
  //       correctionLevel: 'L',
  //       padding: {
  //         top: 5,
  //         bottom: 5,
  //         left: 5,
  //         right: 5,
  //       },
  //     });

  //     if (generateQRCode && (generateQRCode || {}).base64) {
  //       if (newPage == 0) {
  //         qrCodeImageStrings += `<div class="page"><div class="page-item">
  //       <img class="page-item-image" src="data:image/png;base64, ${generateQRCode.base64}" />
  //       <p class="page-item-title">${stampsSplit[i].stampID}</p>
  //   </div>`;

  //         newPage++;
  //       } else if (newPage == 9 || i == stampsSplit.length - 1) {
  //         qrCodeImageStrings += `<div class="page-item">
  //       <img class="page-item-image" src="data:image/png;base64, ${generateQRCode.base64}" />
  //       <p class="page-item-title">${stampsSplit[i].stampID}</p>
  //   </div></div>`;

  //         newPage = 0;
  //       } else {
  //         qrCodeImageStrings += `<div class="page-item">
  //           <img class="page-item-image" src="data:image/png;base64, ${generateQRCode.base64}" />
  //           <p class="page-item-title">${stampsSplit[i].stampID}</p>
  //       </div>`;

  //         newPage++;
  //       }
  //     }
  //   }

  //   if (qrCodeImageStrings) {
  //     const currentDateTime = moment();

  //     const fileName =
  //       'Danh_Sach_QRCode_' + currentDateTime.format('DD_MM_YYYY_HH_mm_ss');

  //     const printHTML = await RNHTMLtoPDF.convert({
  //       html: `<html>
  //                       <head>
  //                           <style>
  //                               * {
  //                                   padding: 0px;
  //                                   margin: 0px;
  //                                   box-sizing: border-box;
  //                               }
  //                               .page {
  //                                   width: 100%;
  //                                   height: 100vh;
  //                                   display: flex;
  //                                   justify-content: center;
  //                                   text-align: center;
  //                                   flex-direction: row;
  //                                   flex-wrap: wrap;
  //                               }
  //                               .page-item {
  //                                   width: calc(100% / 3);
  //                                   height: calc(100% / 3);
  //                                   padding: 2.5px;
  //                               }
  //                               .page-item-image {
  //                                   width: 100%;
  //                                   height: 70%;
  //                               }
  //                               .page-item-title {
  //                                   font-size: 16px;
  //                                   color: #000000;
  //                                   margin-top: 2.5px;
  //                                   text-align: center;
  //                                   word-break: break-all;
  //                                   width: 100%;
  //                               }
  //                           </style>
  //                       </head>
  //                       <body>
  //                           <div>
  //                               ${qrCodeImageStrings}
  //                           </div>
  //                       </body>`,
  //       fileName,
  //       base64: false,
  //     });

  //     if (printHTML && (printHTML || {}).filePath) {
  //       await RNPrint.print({filePath: printHTML.filePath, jobName: fileName});
  //     }

  //     // await RNPrint.print({
  //     //     html: `<html>
  //     //     <head>
  //     //         <style>
  //     //             * {
  //     //                 padding: 0;
  //     //                 margin: 0;
  //     //                 box-sizing: border-box;
  //     //             }

  //     //             .wrap {
  //     //                 display: flex;
  //     //                 justify-content: center;
  //     //                 align-items: center;
  //     //                 text-align: center;
  //     //                 flex-direction: row;
  //     //                 flex-wrap: wrap;
  //     //             }

  //     //             .item {
  //     //                 width: calc(100% / 3);
  //     //                 aspect-ratio: 1;
  //     //                 padding: 5px;
  //     //             }

  //     //             .item-image {
  //     //                 width: 100%;
  //     //                 height: 80%;
  //     //             }

  //     //             .item-title {
  //     //                 font-size: 30px;
  //     //                 color: #000000;
  //     //                 margin-top: 10px;
  //     //                 text-align: center;
  //     //                 word-break: break-all;
  //     //                 width: 100%;
  //     //             }
  //     //         </style>
  //     //     </head>
  //     //     <body>
  //     //         <div class="wrap">
  //     //             ${qrCodeImageStrings}
  //     //         </div>
  //     //     </body>`
  //     // });
  //   } else {
  //     _Toast.error(
  //       'Thông báo',
  //       'Có chút trục trặc trong quá trình xuất PDF. Xin vui lòng thử lại',
  //     );
  //   }

  //   this.setState(previousState => {
  //     return {
  //       ...previousState,
  //       isVisible: false,
  //     };
  //   });
  // };

  // onPrintQRCode = item => () => {
  //   if (!item) {
  //     _Toast.error(
  //       'Thông báo',
  //       'Hệ thống hiện không tìm thấy cấp phát tem này',
  //     );
  //     return;
  //   }

  //   if (!item.id) {
  //     _Toast.error(
  //       'Thông báo',
  //       'Hệ thống hiện không tìm thấy cấp phát tem này',
  //     );
  //     return;
  //   }

  //   this.setState(previousState => {
  //     return {
  //       ...previousState,
  //       isVisible: true,
  //     };
  //   });

  //   this.props.ManageItemOperations.getListQRCodeStamp(
  //     {
  //       requestId: item.id,
  //       page: null,
  //       limit: null,
  //     },
  //     async res => {
  //       const status = (res || {}).status;

  //       if (status != 200) {
  //         _Toast.error('Thông báo', 'Lấy danh sách QR Code thất bại');

  //         this.setState(previousState => {
  //           return {
  //             ...previousState,
  //             isVisible: false,
  //           };
  //         });

  //         return;
  //       }

  //       this.setState(previousState => {
  //         return {
  //           ...previousState,
  //           isVisible: false,
  //         };
  //       });

  //       const stamps = (res.data || {}).stamps || [];

  //       if (stamps.length <= 0) {
  //         _Toast.error('Thông báo', 'Không có QRCode để in');

  //         return;
  //       }

  //       const lengthStamp = item.requested || 0;

  //       if (stamps.length == 1) {
  //         this.printQRCode({
  //           from: 1,
  //           to: 1,
  //           stamps,
  //         });
  //       } else {
  //         NumberFromTo.open(
  //           async data => {
  //             this.printQRCode({
  //               ...data,
  //               stamps,
  //             });
  //           },
  //           null,
  //           1,
  //           lengthStamp,
  //           1,
  //           lengthStamp,
  //           '',
  //           '',
  //           'IN TEM',
  //           this.refNumberFromTo,
  //         );
  //       }
  //     },
  //   );
  // };
  //

  //Block

  printListStamp = async data => {
    const {isConfirm} = this.state;

    let temp = (data?.listStamp || '').split(';');
    let listStamp = temp.join('<br/>');

    let template = '';

    if (isConfirm) {
      template = `<p class="item-title" >Mẫu tem</p><img class="item-image"  src="${data.template}" />`;
    }

    await RNPrint.print({
      html: `<html>
          <head>
              <style>
                  * {
                      padding: 0;
                      margin: 0;
                      box-sizing: border-box;
                  }
                  .wrap {
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      display: flex;
                  }
                  .item-image {
                      width: 100%;
                      height: 80%;
                      margin-bottom: 20px;
                  }
                  .item-title {
                      font-size: 40px;
                      color: #e67e22;
                      margin-top: 10px;
                      word-break: break-all;
                      width: 100%;
                      margin-bottom: 20px;
                  }
                  .item-link {
                    font-size: 25px;
                    color: #000000;
                    margin-top: 10px;
                    word-break: break-all;
                    width: 100%;
                    margin-bottom: 15px;
                }
              </style>
          </head>
          <body>
              <div class="wrap">
                  ${template}
                  <p class="item-title" >Danh sách mẫu tem. Số lượng: ${data.quantity}</p>
                  <p class="item-link" >${listStamp}</p>
              </div>
          </body>`,
    });
  };

  printListQR = async data => {
    const {isConfirm} = this.state;

    let template = '';

    if (isConfirm) {
      template = `<p class="item-title" >Mẫu tem</p><img class="item-image"  src="${data.template}" />`;
    }

    let temp = (data?.listStamp || '').split(';');
    let listQR = temp.filter(item => item != '');
    // let listQR = tempSelect.map(item => {
    //   let qrCode = item;
    //   const key = 'qr=';
    //   let check = item.includes(key);
    //   if (check) {
    //     let index = item.indexOf(key);
    //     qrCode = item.slice(index + 3);
    //   }
    //   return qrCode;
    // });
    let qrCodeImageStrings = '';
    let generateQRCode = null;
    let newPage = 0;

    let widthItem = 16;
    let heightItem = 16;

    let rowCount = 10;

    let indexRowCount = 0;

    let stylePageItemTitle = '';

    for (let i = 0; i < listQR.length; i++) {
      generateQRCode = await RNQRGenerator.generate({
        value: listQR[i],
        height: 250,
        width: 250,
        base64: true,
        backgroundColor: 'white',
        color: 'black',
        correctionLevel: 'H',
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });

      let index = listQR[i].indexOf('/?qr=');
      let result = listQR[i].slice(index + 5);

      if (generateQRCode && (generateQRCode || {}).base64) {
        if (indexRowCount == 0) {
          qrCodeImageStrings += '<div class="page-break">';
        }

        indexRowCount++;

        qrCodeImageStrings += `<div class="page-item">
        <img class="page-item-image" src="data:image/png;base64, ${generateQRCode.base64}" />
        <p class="page-item-title">${result}</p>
        </div>`;

        if (indexRowCount == rowCount) {
          qrCodeImageStrings += '</div>';

          indexRowCount = 0;
        }
      }
    }

    if (qrCodeImageStrings) {
      const currentDateTime = moment();

      const fileName =
        'Danh_Sach_QRCode_' + currentDateTime.format('DD_MM_YYYY_HH_mm_ss');

      if (Platform.OS != 'ios') {
        stylePageItemTitle = 'margin-top: 1mm;';
      }

      const printHTML = await RNHTMLtoPDF.convert({
        html: `<html>
                        <head>
                            <style>
                                * {
                                    padding: 0px;
                                    margin: 0px;
                                    box-sizing: border-box;
                                }
                                .page {
                                    width: 100%;
                                }
                                .page-break {
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                    flex-direction: row;
                                    flex-wrap: wrap;
                                }
                                .page-item {
                                    width: ${widthItem}mm;
                                    height: auto;
                                    margin: 2mm;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    flex-direction: column;
                                    text-align: center;
                                }
                                .page-item-image {
                                    width: ${widthItem}mm;
                                    height: ${heightItem}mm;
                                }
                                .page-item-title {
                                    font-size: 1.5mm;
                                    color: #000000;
                                    text-align: center;
                                    word-break: break-all;
                                    ${stylePageItemTitle};
                                }
                                .item-image {
                                    width: 100%;
                                    margin-bottom: 20px;
                                }
                                .item-title {
                                    font-size: 40px;
                                    color: #e67e22;
                                    word-break: break-all;
                                    width: 100%;
                                    margin-bottom: 10px;
                                    margin-top: 10px;
                                    margin-left: 20px;
                                }
                                </style>
                        </head>
                        <body>
                            <div>
                                ${template}
                                <p class="item-title" >Danh sách mẫu tem. Số lượng: ${data.quantity}</p>
                                <div class="page">
                                    ${qrCodeImageStrings}
                                </div>
                            </div>
                        </body>`,
        fileName,
        base64: false,
      });

      if (printHTML && (printHTML || {}).filePath) {
        console.log('printHTML.filePath', printHTML.filePath);
        console.log('fileName', fileName);

        await RNPrint.print({filePath: printHTML.filePath, jobName: fileName});
      }
    } else {
      _Toast.error(
        'Thông báo',
        'Có chút trục trặc trong quá trình xuất PDF. Xin vui lòng thử lại',
      );
    }
  };

  onPrintListStamp = item => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });

    this.props.ManageItemOperations.printStamp(item.id, res => {
      const data = res.data || {};

      console.log(res);

      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: false,
        };
      });

      this.printListStamp(data);
    });
  };

  onPrintListStamp2 = item => {
    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });

    this.props.ManageItemOperations.printStamp(item.id, res => {
      const data = res.data || {};

      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: false,
        };
      });

      this.printListStamp(data);
    });
  };

  onPrintListQR = item => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });

    this.props.ManageItemOperations.printStamp(item.id, res => {
      console.log(res);

      const data = res.data || {};

      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: false,
        };
      });

      this.printListQR(data);
    });
  };

  onPrintQRCode = item => {
    ModalComponent.open(
      <Print
        onPrintListStamp={this.onPrintListStamp(item)}
        onPrintListQR={this.onPrintListQR(item)}
      />,
      'Chọn hình thức in tem',
      this.refModalComponentRef,
      () => {},
    );
  };

  onInfinitingManageItem = event => {
    if (this.isLoadingManageItem) {
      return;
    }

    const height = Math.ceil(
      event.nativeEvent.contentSize.height -
        event.nativeEvent.layoutMeasurement.height,
    );
    this.scrollYManageItem = Math.ceil(event.nativeEvent.contentOffset.y);

    if (height - this.scrollYManageItem <= DEFAULTS.offSetScrollInfinite) {
      this.isLoadingManageItem = false;
      this.getListManageItem(this.state.page + 1, false);
    }
  };
  onDelete = id => {
    return new Promise(_resolve => {
      if (!id) {
        _Toast.error('Thông báo', 'Cấp phát tem không tồn tại');
        return;
      }

      FormDelete.open(result => {
        if (result.result) {
          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: true,
            };
          });
          this.props.ManageItemOperations.deleteManageItem({id}, res => {
            if (res.status == 200) {
              _Toast.success('Thông báo', 'Xóa cấp phát tem thành công');
              this.isLoadingManageItem = false;
              this.getListManageItem(0, true);
              this.setState(previousState => {
                return {
                  ...previousState,
                  isVisible: false,
                };
              });
            } else {
              const message = getErrorMessageServer(res);

              _Toast.error('Thông báo', message || 'Xóa cấp phát tem thất bại');

              this.setState(previousState => {
                return {
                  ...previousState,
                  isVisible: false,
                };
              });
            }
          });
        }
      }, this.refFormDelete);
    });
  };

  onRequestConfirm = item => {
    return new Promise(resolve => {
      if (!item) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy tem này');

        return resolve(false);
      }

      if (!item.id) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy tem này');

        return resolve(false);
      }

      FormQuestion.open(
        result => {
          if (result.result) {
            this.props.ManageItemOperations.requestManageItem(
              {id: item.id},
              res => {
                const status = (res || {}).status;

                if (status == 200) {
                  this.isLoadingManageItem = false;

                  this.getListManageItem(0, true);

                  return resolve(true);
                } else {
                  const message = getErrorMessageServer(res);
                  _Toast.error(
                    'Thông báo',
                    message || 'Yêu cầu duyệt thất bại',
                  );
                  return resolve(false);
                }
              },
            );
          } else {
            return resolve(false);
          }
        },
        'THÔNG BÁO',
        'Bạn có chắc chắn muốn yêu cầu duyệt thông tin này ?',
        this.refFormQuestion,
      );
    });
  };

  onEdit = id => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addManageItem, {id});
  };

  formDeleteSetRef = ref => {
    this.refFormDelete = ref;
  };

  render() {
    const {ManageItemReducer} = this.props;
    const {statusBrowse, statusLicense, isVisible, isConfirm} = this.state;

    let manageItems = [];

    if (ManageItemReducer.get(manageItemConstant.KEYS.manageItems).toJS) {
      manageItems = ManageItemReducer.get(
        manageItemConstant.KEYS.manageItems,
      ).toJS();
    }

    // console.log('manageItems', manageItems);

    return (
      <BoxMainContainer
        formDeleteSetRef={this.formDeleteSetRef}
        formQuestionSetRef={this.formQuestionSetRef}
        modalSetRef={this.modalSetRef}
        isVisibleLoadingCenter={isVisible}
        isShowBackHeader={true}
        isScrollEnabled={false}
        styleBody={style.boxMainBody}
        isShowInfo={true}
        isShowQRCodeButton={true}
        isShowHeader={true}
        isShowVersion={true}
        isShowVersionName={true}>
        <View style={style.header}>
          <Text style={style.title}>YÊU CẦU CẤP TEM</Text>
          {/* <TouchableOpacity activeOpacity={0.8} style={style.searchButton}>
            <ICONS.search width={24} height={24} />
          </TouchableOpacity> */}
          <AuthenticateView claims={[CLAIMS.manageItem.add]} checkType={0}>
            <TouchableOpacity
              onPress={this.onAdd}
              activeOpacity={0.8}
              style={style.addButton}>
              <ICONS.add width={24} height={24} />
            </TouchableOpacity>
          </AuthenticateView>
        </View>
        {isConfirm && (
          <View style={style.rowFilter}>
            <View style={style.filter}>
              <Text style={style.filterStatusLabel}>Trạng thái duyệt</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: 'Chọn trạng thái',
                  inputLabel: 'Chọn trạng thái',
                  value: null,
                  ...style.filterItemSelectPlaceHolder,
                }}
                value={statusBrowse}
                style={{
                  inputIOSContainer: style.filterItemSelectContainerIOS,
                  inputAndroidContainer: style.filterItemSelectContainerAndroid,
                  inputAndroid: style.filterItemSelectInputAndroid,
                  inputIOS: style.filterItemSelectInputIOS,
                  iconContainer: style.filterItemSelectIcon,
                }}
                onValueChange={this.onChangeStatusBrowse}
                items={STAMP_STATUSES_BROWSE}
                Icon={() => <ICONS.caretDown2 width={16} height={16} />}
              />
            </View>
            <View style={[style.filter, style.marginFilter]}>
              <Text style={style.filterStatusLabel}>Trạng thái cấp phép</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: 'Chọn trạng thái',
                  inputLabel: 'Chọn trạng thái',
                  value: null,
                  ...style.filterItemSelectPlaceHolder,
                }}
                value={statusLicense}
                style={{
                  inputIOSContainer: style.filterItemSelectContainerIOS,
                  inputAndroidContainer: style.filterItemSelectContainerAndroid,
                  inputAndroid: style.filterItemSelectInputAndroid,
                  inputIOS: style.filterItemSelectInputIOS,
                  iconContainer: style.filterItemSelectIcon,
                }}
                onValueChange={this.onChangeStatusLicense}
                items={STAMP_STATUSES_LICENSE}
                Icon={() => <ICONS.caretDown2 width={16} height={16} />}
              />
            </View>
          </View>
        )}
        <View style={style.body}>
          <ScrollView
            style={style.filter}
            onScroll={this.onInfinitingManageItem}
            ref={ref => (this.listProductRef = ref)}
            showsVerticalScrollIndicator={false}>
            <View style={style.bodyWrap}>
              {manageItems.map((item, index) => {
                return (
                  <ProductItem
                    key={index}
                    item={item}
                    listProductRef={this.listProductRef}
                    onEdit={this.onEdit}
                    onPrintQRCode={this.onPrintQRCode}
                    onDelete={this.onDelete}
                    onRequestConfirm={this.onRequestConfirm}
                    onRequestManageItem={this.onRequestManageItem}
                    isConfirm={isConfirm}
                    onPrintListStamp2={this.onPrintListStamp2}
                    onPaymentManageItem={this.onPaymentManageItem}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </BoxMainContainer>
    );
  }
}

export default ManageItem;
