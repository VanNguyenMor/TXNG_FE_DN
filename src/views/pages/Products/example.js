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
  Alert,
  ToastAndroid,
} from 'react-native';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import {ICONS} from '../../../assets/imgs';

import style from './style';

import {KEY_NAVIGATIONS, DEFAULTS, PAGINATIONS} from '../../constants/config';

import {consignmentConstant} from '../../states/consignment';

import {getErrorMessageServer} from '../../utils/errorMessageServer';

import FormQuestion from '../../components/formQuestion';

import FormDelete from '../../components/formDelete';

import DatePicker from '../../bases/controls/datePicker';

import {
  BATCH_LIST_STATUSES,
  BATCH_STATUSES,
  BATCH_STATUS_COLORS,
  BATCH_STATUS_TEXTS,
  STATUS_IMPORT_EXPORT,
} from '../../constants/data';

import ModalComponent from '../../components/modal';

class ChooseWarehouse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warehouses: [],
      warehouseId: null,
      batchId: null,
    };
  }

  componentDidMount() {
    const warehouses = [...this.props.warehouses];
    const batchId = this.props.batchId;

    this.setState(previousState => {
      return {
        ...previousState,
        warehouses,
        batchId,
      };
    });
  }

  onAccept = () => {
    const {warehouseId, batchId} = this.state;

    if (!warehouseId) {
      if (Platform.OS == 'ios') {
        Alert.alert('Thông báo', 'Bạn vui lòng chọn kho hàng');
      } else {
        ToastAndroid.show('Bạn vui lòng chọn kho hàng', ToastAndroid.SHORT);
      }

      return;
    }

    this.props.onAccept(batchId, warehouseId);
  };

  onClose = () => {
    this.props.onClose();
  };

  onChangeWarehouse = value => {
    this.setState(previousState => {
      return {
        ...previousState,
        warehouseId: value,
      };
    });
  };

  render() {
    const {warehouses, warehouseId} = this.state;

    return (
      <View style={style.chooseWareHouse}>
        <View style={style.chooseWareHouseBody}>
          <Text style={style.chooseWareHouseLabel}>Chọn kho hàng để nhập</Text>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            placeholder={{
              label: 'Chọn kho hàng',
              inputLabel: '',
              value: null,
              ...style.filterItemSelectPlaceHolder,
            }}
            style={{
              inputIOSContainer: style.filterItemSelectContainerIOS,
              inputAndroidContainer: style.filterItemSelectContainerAndroid,
              inputAndroid: style.filterItemSelectInputAndroid,
              inputIOS: style.filterItemSelectInputIOS,
              iconContainer: style.filterItemSelectIcon,
            }}
            value={warehouseId}
            onValueChange={this.onChangeWarehouse}
            items={warehouses}
            Icon={() => <ICONS.caretDown2 width={16} height={16} />}
          />
        </View>
        <View style={style.chooseWareHouseFooter}>
          <TouchableOpacity
            delayPressIn={0}
            activeOpacity={0.8}
            onPress={this.onAccept}
            style={style.chooseWareHouseFooterAccept}>
            <Text style={style.chooseWareHouseFooterAcceptText}>Đồng ý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            delayPressIn={0}
            activeOpacity={0.8}
            onPress={this.onClose}
            style={style.chooseWareHouseFooterClose}>
            <Text style={style.chooseWareHouseFooterCloseText}>Thoát ra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ConsignmentItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationTranslateX: new Animated.Value(0),
    };

    this.pageXStart = 0;
    this.pageXEnd = 0;
    this.pageYStart = 0;
    this.pageYEnd = 0;
    this.increase = 0;
    this.isLock = false;
    this.isDelete = false;
    this.isRequest = false;
  }

  // handleShowAction = item => {
  //   const {confirmBatch} = this.props;

  //   let isShowDelete = false;
  //   let isShowLocked = false;

  //   if (confirmBatch) {
  //     if (
  //       item.Status == BATCH_STATUSES.moiTao ||
  //       item.Status == BATCH_STATUSES.khongDuyet
  //     ) {
  //       isShowDelete = true;
  //     }
  //   } else {
  //     if (item.Status == BATCH_STATUSES.moiTao) {
  //       isShowDelete = true;
  //       isShowLocked = true;
  //     }
  //   }

  //   return {
  //     isShowDelete,
  //     isShowLocked,
  //   };
  // };

  onTouchStart = e => {
    this.pageXStart = e.nativeEvent.pageX;
    this.pageXEnd = 0;
    this.pageYStart = e.nativeEvent.pageY;
    this.pageYEnd = 0;
    this.increase = 0;
    this.isDelete = false;
    this.isLock = false;
    this.isRequest = false;
  };

  onTouchMove = e => {
    const pageXEndOld = this.pageXEnd;

    if (pageXEndOld != 0 && Math.abs(pageXEndOld - e.nativeEvent.pageX) <= 2) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (Math.abs(this.pageXStart - this.pageXEnd) > DEFAULTS.offSetMinSwipe) {
      const listConsignmentRef = this.props.listConsignmentRef;

      if (listConsignmentRef) {
        listConsignmentRef.setNativeProps({scrollEnabled: false});
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

  onTouchEnd = (id, plantingZoneName) => e => {
    if (this.isDelete || this.isLock || this.isRequest) {
      return;
    }

    this.pageXEnd = e.nativeEvent.pageX;
    this.pageYEnd = e.nativeEvent.pageY;

    if (
      Math.abs(this.pageXStart - this.pageXEnd) <=
        DEFAULTS.offSetMinSwipeEdit &&
      Math.abs(this.pageYStart - this.pageYEnd) <= DEFAULTS.offSetMinSwipeEdit
    ) {
      this.props.onEdit(id, plantingZoneName);

      this.increase = 0;
      this.pageXStart = 0;
      this.pageYStart = 0;
      this.pageYEnd = 0;
      this.pageXEnd = 0;
      this.isDelete = false;
      this.isLock = false;
      this.isRequest = false;

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
      const listConsignmentRef = this.props.listConsignmentRef;

      if (listConsignmentRef) {
        listConsignmentRef.setNativeProps({scrollEnabled: true});
      }
    });

    this.increase = 0;
    this.pageXStart = 0;
    this.pageYStart = 0;
    this.pageYEnd = 0;
    this.pageXEnd = 0;
    this.isDelete = false;
    this.isLock = false;
    this.isRequest = false;
  };

  onDelete = id => () => {
    this.isDelete = true;

    this.props.onDelete(id).then(() => {
      this.isDelete = false;
    });
  };

  onLock = item => () => {
    this.isLock = true;

    this.props.onLock(item).then(() => {
      this.isLock = false;
    });
  };

  onRequest = item => () => {
    this.isRequest = true;
    this.props.onRequest(item).then(() => {
      this.isRequest = false;
    });
  };

  render() {
    const {item, confirmBatch} = this.props;

    // const {isShowDelete, isShowLocked} = this.handleShowAction(item);

    let titleButton = STATUS_IMPORT_EXPORT[item?.Status || 0].title;
    let colorButton = STATUS_IMPORT_EXPORT[item?.Status || 0].color;
    let styleColor = {color: colorButton};
    let borderColor = {borderColor: colorButton};

    let isShowRequest = confirmBatch && item?.Status == 0;
    let isShowDelete = item?.Status == 0 || (confirmBatch && item?.Status == 3);
    let isShowLocked = !confirmBatch && item?.Status == 0;

    return (
      <View
        onTouchEnd={this.onTouchEnd(item.ID, item.PlantingZoneName)}
        onTouchMove={isShowDelete ? this.onTouchMove : null}
        onTouchStart={this.onTouchStart}
        key={item.ID}
        style={style.bodyItem}>
        <Animated.View
          style={[
            style.bodyItemAnimate,
            {
              transform: [
                {
                  translateX: this.state.animationTranslateX,
                },
              ],
            },
          ]}>
          <View style={style.bodyItemContent}>
            <View style={style.bodyItemImageWrap}>
              {item.Avatar ? (
                <Image
                  resizeMode="stretch"
                  style={style.bodyItemImage}
                  source={{uri: item.Avatar}}
                />
              ) : (
                <Image
                  resizeMode="stretch"
                  style={style.bodyItemImage}
                  source={ICONS.noImage}
                />
              )}
            </View>
            <View style={style.bodyItemInfoWrap}>
              <View style={style.bodyItemInfoWrapContent}>
                <View style={style.bodyItemInfo}>
                  <Text style={style.bodyItemInfoName}>
                    Số lô: {item.BatchNum}
                  </Text>
                  <Text style={style.bodyItemInfoProductName}>
                    {item.ProductName}
                  </Text>
                  <View style={style.bodyItemDescription}>
                    <Text
                      numberOfLines={1}
                      style={style.bodyItemInfoDescription}></Text>
                    <Text
                      numberOfLines={1}
                      style={style.bodyItemInfoDescription}>
                      {item.Quantity || 0} {item.UnitName}
                      {item.PlantingZoneName
                        ? ` - ${item.PlantingZoneName}`
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={style.bodyItemInfoWrapStatus}>
                <View style={[style.borderButton, {...borderColor}]}>
                  <Text style={[style.titleButton, {...styleColor}]}>
                    {titleButton}
                  </Text>
                </View>
                {isShowLocked && (
                  <TouchableOpacity
                    onPress={this.onLock(item)}
                    activeOpacity={0.8}
                    style={style.bodyItemFunction}>
                    {item.Status == BATCH_STATUSES.duyet ? (
                      <ICONS.lockClose width={24} height={24} />
                    ) : (
                      <ICONS.lockOpen width={24} height={24} />
                    )}
                  </TouchableOpacity>
                )}
                {isShowRequest && (
                  <TouchableOpacity
                    onPress={this.onRequest(item)}
                    style={style.bodyItemFunction}
                    activeOpacity={0.8}>
                    <ICONS.requestConfirm width={24} height={24} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={style.bodyItemConfirm}>
            {item.RequestedDate ? (
              <View style={style.bodyItemConfirmItem}>
                <Text style={style.bodyItemConfirmItemLabel}>
                  Ngày yêu cầu:
                </Text>
                <Text style={style.bodyItemConfirmItemValue}>
                  {item.RequestedDate
                    ? moment(item.RequestedDate).format('HH:mm DD/MM/YYYY')
                    : ''}
                </Text>
              </View>
            ) : null}
            {item.Status == BATCH_STATUSES.khongDuyet ? (
              <View style={style.bodyItemConfirmItem}>
                <Text style={style.bodyItemConfirmItemLabel}>Lý do:</Text>
                <Text style={style.bodyItemConfirmItemValue}>
                  {item.ConfirmedReason}
                </Text>
              </View>
            ) : null}
            {!confirmBatch && item.Status == BATCH_STATUSES.duyet ? null : (
              <>
                {item.Status == BATCH_STATUSES.duyet ||
                item.Status == BATCH_STATUSES.khongDuyet ? (
                  <>
                    <View style={style.bodyItemConfirmItem}>
                      <Text style={style.bodyItemConfirmItemLabel}>
                        Người kiểm duyệt:
                      </Text>
                      <Text style={style.bodyItemConfirmItemValue}>
                        {item.ConfirmedBy}
                      </Text>
                    </View>
                    <View style={style.bodyItemConfirmItem}>
                      <Text style={style.bodyItemConfirmItemLabel}>
                        Ngày kiểm duyệt:
                      </Text>
                      <Text style={style.bodyItemConfirmItemValue}>
                        {item.ConfirmedDate
                          ? moment(item.RequestedDate).format(
                              'HH:mm DD/MM/YYYY',
                            )
                          : ''}
                      </Text>
                    </View>
                  </>
                ) : null}
              </>
            )}
          </View>
        </Animated.View>
        {isShowDelete ? (
          <View style={style.bodyItemDeleteWrap}>
            <TouchableOpacity
              onPress={this.onDelete(item.ID)}
              activeOpacity={0.8}
              style={style.bodyItemDelete}>
              <ICONS.trashWhite width={24} height={24} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

class Consignment extends Component {
  constructor(props) {
    super(props);

    const currentDateTime = new Date();

    const previousDateTime = new Date().setDate(currentDateTime.getDate() - 30);

    this.state = {
      isVisible: false,
      page: 0,
      limit: PAGINATIONS.consignment,
      dateStart: previousDateTime,
      dateEnd: currentDateTime,
      statusId: null,
      confirmBatch: false,
    };

    this.formQuestionRef = null;
    this.listConsignmentRef = null;
    this.scrollYConsignment = 0;
    this.isLoadingConsignment = false;
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: true,
        };
      });

      this.props.SettingOperations.companyConfig(res => {
        this.setState(previousState => {
          return {
            ...previousState,
            isVisible: false,
          };
        });

        const confirmBatch =
          ((res.data || {}).data || {}).confirmBatch || false;

        this.setState(
          previousState => {
            return {
              ...previousState,
              confirmBatch,
            };
          },
          async () => {
            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: true,
              };
            });

            const res = await this.getListConsignment(0, true);

            if (res.status != 200) {
              _Toast.error('Thông báo', 'Lấy danh sách lô hàng thất bại');
            }

            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });
          },
        );
      });
    });
  }

  modalSetRef = ref => {
    this.refModalComponentRef = ref;
  };

  datePickerSetRef = ref => {
    this.refDatePicker = ref;
  };

  formQuestionSetRef = ref => {
    this.formQuestionRef = ref;
  };

  getListConsignment = (page, init = true) => {
    return new Promise(resolve => {
      if (this.isLoadingConsignment) {
        return resolve({
          status: 200,
        });
      }
      this.isLoadingConsignment = true;

      const {limit, dateStart, dateEnd, statusId} = this.state;
      const {ConsignmentOperations} = this.props;

      let _dateStart = null;
      let _dateEnd = null;

      if (dateStart && dateEnd) {
        _dateStart = moment(dateStart).format('YYYY-MM-DD');
        _dateEnd = moment(dateEnd).format('YYYY-MM-DD');
      }

      ConsignmentOperations.getListConsignment(
        {
          startDate: _dateStart,
          endDate: _dateEnd,
          search: '',
          filter: '',
          orderBy: '',
          page,
          limit,
          init,
          status: statusId,
        },
        res => {
          const consignments = ((res.data || {}).data || {}).batchs || [];

          if (consignments.length > 0) {
            this.setState(
              previousState => {
                return {
                  ...previousState,
                  page,
                };
              },
              () => {
                this.isLoadingConsignment = false;
              },
            );
          } else {
            this.isLoadingConsignment = false;
          }

          resolve(res);
        },
      );
    });
  };

  onAdd = () => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment);
  };

  onEdit = (id, plantingZoneName) => {
    this.props.navigation.navigate(KEY_NAVIGATIONS.addConsignment, {
      id,
      plantingZoneName,
    });
  };

  onLock = item => {
    return new Promise(resolve => {
      if (!item) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        resolve(false);

        return;
      }

      if (!item.ID) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        resolve(false);

        return;
      }

      if (item.Status == BATCH_STATUSES.duyet) {
        _Toast.error(
          'Thông báo',
          'Lô hàng này đã khóa/đã duyệt. Không thể mở khóa',
        );

        resolve(false);

        return;
      }

      this.props.ConsignmentOperations.getListWarehouseForUpdate({}, res => {
        const warehouses = ((res.data || {}).data || {}).wareHouses || [];

        const _warehouses = warehouses.map(p => {
          return {
            value: p.id,
            label: p.name,
          };
        });

        ModalComponent.open(
          <ChooseWarehouse
            warehouses={_warehouses}
            batchId={item.ID}
            onClose={this.onCloseLocked}
            onAccept={this.onAcceptLocked}
          />,
          'Thông báo',
          this.refModalComponentRef,
          () => {},
        );
      });

      // FormQuestion.open(result => {
      //     if (result.result) {
      //         this.setState(previousState => {
      //             return {
      //                 ...previousState,
      //                 isVisible: true
      //             }
      //         });

      //         this.props.ConsignmentOperations.updateLock({ id: item.id }, res => {
      //             if (res.status == 200) {
      //                 _Toast.success('Thông báo', 'Cập nhật trạng thái khóa thành công');

      //                 this.getListConsignment();

      //                 this.setState(previousState => {
      //                     return {
      //                         ...previousState,
      //                         isVisible: false
      //                     }
      //                 });

      //                 resolve(true);
      //             } else {
      //                 const message = getErrorMessageServer(res);

      //                 _Toast.error('Thông báo', message || 'Cập nhật trạng thái khóa thất bại');

      //                 this.setState(previousState => {
      //                     return {
      //                         ...previousState,
      //                         isVisible: false
      //                     }
      //                 });

      //                 resolve(false);
      //             }
      //         });
      //     } else {
      //         resolve(false);
      //     }
      // }, 'THÔNG BÁO', 'Bạn có chắc chắn muốn khóa thông tin này ?', this.formQuestionRef);
    });
  };

  onCloseLocked = () => {
    ModalComponent.close();
  };

  onAcceptLocked = (batchId, warehouseId) => {
    console.log('batchId', batchId, warehouseId);
    ModalComponent.close();

    return new Promise(resolve => {
      if (!batchId) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      if (!warehouseId) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy kho hàng này');

        return resolve(false);
      }
      this.props.ConsignmentOperations.updateLock(
        {id: batchId, warehouseId},
        res => {
          if (res.status == 200) {
            this.getListConsignment(0, true);

            return resolve(true);
          } else {
            const message = getErrorMessageServer(res);

            _Toast.error(
              'Thông báo',
              message || 'Cập nhật trạng thái khóa thất bại',
            );

            return resolve(false);
          }
        },
      );
      // FormQuestion.open(
      //   result => {
      //     if (result.result) {
      //       this.props.ConsignmentOperations.updateLock(
      //         {id: batchId, warehouseId},
      //         res => {
      //           if (res.status == 200) {
      //             this.getListConsignment(0, true);

      //             return resolve(true);
      //           } else {
      //             const message = getErrorMessageServer(res);

      //             _Toast.error(
      //               'Thông báo',
      //               message || 'Cập nhật trạng thái khóa thất bại',
      //             );

      //             return resolve(false);
      //           }
      //         },
      //       );
      //     } else {
      //       return resolve(false);
      //     }
      //   },
      //   'THÔNG BÁO',
      //   'Bạn có chắc chắn muốn khóa thông tin này ?',
      //   this.refFormQuestion,
      // );
    });
  };

  onDelete = id => {
    return new Promise(resolve => {
      if (!id) {
        _Toast.error('Thông báo', 'Lô hàng không tồn tại');

        resolve(false);

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

          this.props.ConsignmentOperations.deleteConsignment({id}, res => {
            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });

            if (res.status == 200) {
              _Toast.success('Thông báo', 'Xóa lô hàng thành công');

              this.getListConsignment(0, true);

              resolve(true);
            } else {
              const message = getErrorMessageServer(res);

              _Toast.error('Thông báo', message || 'Xóa lô hàng thất bại');

              this.setState(previousState => {
                return {
                  ...previousState,
                  isVisible: false,
                };
              });

              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  };
  onRequest = item => {
    console.log('item', item);
    return new Promise(resolve => {
      if (!item) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      if (!item.ID) {
        _Toast.error('Thông báo', 'Hệ thống không tìm thấy lô hàng này');

        return resolve(false);
      }

      FormQuestion.open(
        result => {
          if (result.result) {
            this.props.ConsignmentOperations.requireConfirm(
              {id: item.ID},
              res => {
                const status = (res || {}).status;

                if (status == 200) {
                  this.isLoadingConsignment = false;

                  this.getListConsignment(0, true);

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
        'Bạn có chắc chắn muốn yêu cầu duyệt lô hàng này ?',
        this.refFormQuestion,
      );
    });
  };

  onInfinitingConsignment = event => {
    if (this.isLoadingConsignment) {
      return;
    }

    const height = Math.ceil(
      event.nativeEvent.contentSize.height -
        event.nativeEvent.layoutMeasurement.height,
    );
    this.scrollYConsignment = Math.ceil(event.nativeEvent.contentOffset.y);

    if (height - this.scrollYConsignment <= DEFAULTS.offSetScrollInfinite) {
      this.isLoadingConsignment = false;

      this.getListConsignment(this.state.page + 1, false);
    }
  };

  onPopupDateStart = () => {
    DatePicker.open(
      this.state.dateStart,
      this.onChangeDateStart,
      this.refDatePicker,
    );
  };

  onChangeDateStart = (result, year, month, day) => {
    if (result) {
      const newDate = new Date(year, month, day);

      this.setState(
        previousState => {
          return {
            ...previousState,
            dateStart: newDate,
            page: 0,
          };
        },
        async () => {
          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: true,
            };
          });

          const res = await this.getListConsignment(0, true);

          if (res.status != 200) {
            _Toast.error('Thông báo', 'Lây danh sách lô hàng thất bại');
          }

          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: false,
            };
          });
        },
      );
    }
  };

  onPopupDateEnd = () => {
    DatePicker.open(
      this.state.dateEnd,
      this.onChangeDateEnd,
      this.refDatePicker,
    );
  };

  onChangeDateEnd = (result, year, month, day) => {
    if (result) {
      const newDate = new Date(year, month, day);

      this.setState(
        previousState => {
          return {
            ...previousState,
            dateEnd: newDate,
            page: 0,
          };
        },
        async () => {
          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: true,
            };
          });

          const res = await this.getListConsignment(0, true);

          if (res.status != 200) {
            _Toast.error('Thông báo', 'Lây danh sách lô hàng thất bại');
          }

          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: false,
            };
          });
        },
      );
    }
  };

  onChangeStatus = value => {
    this.setState(
      previousState => {
        return {
          ...previousState,
          statusId: value,
        };
      },
      () => {
        this.getListConsignment(0, true);
      },
    );
  };

  render() {
    const {ConsignmentReducer} = this.props;
    const {isVisible, dateStart, dateEnd, statusId, confirmBatch} = this.state;

    let consignments = [];

    if (ConsignmentReducer.get(consignmentConstant.KEYS.consignments).toJS) {
      consignments = ConsignmentReducer.get(
        consignmentConstant.KEYS.consignments,
      ).toJS();
    }

    // console.log('consignments', consignments);
    return (
      <BoxMainContainer
        modalSetRef={this.modalSetRef}
        datePickerSetRef={this.datePickerSetRef}
        formQuestionSetRef={this.formQuestionSetRef}
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
          <Text style={style.title}>QUẢN LÝ LÔ HÀNG</Text>
          {/* <TouchableOpacity activeOpacity={0.8} style={style.searchButton}>
                        <ICONS.search width={24} height={24} />
                    </TouchableOpacity> */}
          <TouchableOpacity
            onPress={this.onAdd}
            activeOpacity={0.8}
            style={style.addButton}>
            <ICONS.add width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View style={style.filter}>
          <View style={style.filterDate}>
            <View style={[style.filterDateItem]}>
              <Text style={style.filterDateItemLabel}>Từ ngày</Text>
              <TouchableOpacity
                onPress={this.onPopupDateStart}
                activeOpacity={0.8}
                style={style.filterDateItemSelect}>
                <Text style={style.filterDateItemSelectLabel}>
                  {dateStart ? moment(dateStart).format('DD/MM/YYYY') : ''}
                </Text>
                <ICONS.calendar width={16} height={16} />
              </TouchableOpacity>
            </View>
            <View style={style.block} />
            <View style={style.filterDateItem}>
              <Text style={style.filterDateItemLabel}>Đến ngày</Text>
              <TouchableOpacity
                onPress={this.onPopupDateEnd}
                activeOpacity={0.8}
                style={style.filterDateItemSelect}>
                <Text style={style.filterDateItemSelectLabel}>
                  {dateEnd ? moment(dateEnd).format('DD/MM/YYYY') : ''}
                </Text>
                <ICONS.calendar width={16} height={16} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.filterData}>
            <View style={[style.filterDataItem]}>
              <Text style={style.filterDataItemLabel}>Trạng thái</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: 'Chọn trạng thái',
                  inputLabel: '',
                  value: null,
                  ...style.filterItemSelectPlaceHolder,
                }}
                style={{
                  inputIOSContainer: style.filterItemSelectContainerIOS,
                  inputAndroidContainer: style.filterItemSelectContainerAndroid,
                  inputAndroid: style.filterItemSelectInputAndroid,
                  inputIOS: style.filterItemSelectInputIOS,
                  iconContainer: style.filterItemSelectIcon,
                }}
                value={statusId}
                onValueChange={this.onChangeStatus}
                items={BATCH_LIST_STATUSES}
                Icon={() => <ICONS.caretDown2 width={16} height={16} />}
              />
            </View>
          </View>
        </View>
        <View style={style.line}></View>
        <View style={style.body}>
          <ScrollView
            onScroll={this.onInfinitingConsignment}
            ref={ref => (this.listConsignmentRef = ref)}
            showsVerticalScrollIndicator={false}>
            <View style={style.bodyWrap}>
              {consignments.map((item, index) => {
                return (
                  <ConsignmentItem
                    confirmBatch={confirmBatch}
                    listConsignmentRef={this.listConsignmentRef}
                    key={index}
                    onEdit={this.onEdit}
                    onLock={this.onLock}
                    onDelete={this.onDelete}
                    onRequest={this.onRequest}
                    item={item}
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

export default Consignment;
