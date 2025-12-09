import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import RenderHtml from 'react-native-render-html';
import {ICONS} from '../../../assets/imgs';

import FormDelete from '../../components/formDelete';

import _Toast from '../../bases/controls/toast';

import BoxMainContainer from '../../containers/components/boxMain';

import {getErrorMessageServer} from '../../utils/errorMessageServer';

import DatePicker from '../../bases/controls/datePicker';

import style from './style';

import {CLAIMS, STATUS_STAMP_REQUESTS} from '../../constants/data';

import {manageItemConstant} from '../../states/manageItem';

import {ModalSelect} from '../../bases/controls/select';

import {
  DELAYS,
  EXTENSION_FILE_WORD,
  EXTENSION_FILE_EXCEL,
  EXTENSION_FILE_PDF,
  EXTENSION_FILE_IMAGE,
} from '../../constants/config';

import {
  numberWithCommas,
  validExtensionFileImage,
  getFileName,
  replaceHtml,
} from '../../bases/helper';

import {Guid} from 'guid-typescript';

import _Image from '../../bases/controls/image';
import {COLORS} from '../../constants/theme';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import FileUpload from '../../components/fileUpload';
import {AuthenticateView} from '../../utils/auth';

class AddConsignment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      id: '',
      dateRequest: new Date(),
      deliveryDate: '',
      quantity: '',
      status: -1,
      productName: '',
      avatar: '',
      productId: null,
      // quantityPerQR: '',
      stampTemplates: [],
      stampTemplateChoose: null,
      files: [],
      checkbox: null,
      priceStamp: 0,
      amount: 0,
      fileUpload: '',
      partnerName: '',
      isPrint: false,
      requestedUsedStatus: 0,
      reason: '',
      requestedUsedReason: '',
      fileUploadUsed: '',
      filesUpload: [],
      dataConfig: {},
      isConfirm: false,
      note: '',
      size: '',
    };
    this.stampTemplate = null;
    this.inputQuantity = null;
    this.inputQuantityPerQR = null;
    this.refFormDelete = null;
    this.refDatePicker = null;
    this.refModalSelect = null;
    this.timeout = 0;
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: true,
        };
      });
      // this.props.ManageItemOperations.getListProductComboBox(
      //   {
      //     fieldID: '',
      //     productCode: '',
      //     productName: '',
      //     orderBy: '',
      //     filter: '',
      //     page: null,
      //     limit: null,
      //     // status: '1',
      //     isLocked: 1,
      //   },
      //   res => {
      this.props.ManageItemOperations.getConfig(config => {
        let dataConfig = config?.data || {};
        let isConfirm = dataConfig?.isConfirm || false;
        this.props.ManageItemOperations.getListStampTemplate({}, res => {
          const stampTemplates = (res.data || {}).data || [];
          this.setState(previousState => {
            return {
              ...previousState,
              stampTemplates,
              dataConfig,
              isConfirm,
              isVisible: false,
            };
          });
          const {route} = this.props;
          if (route.params) {
            if (route.params.id) {
              // const products = (res.data || {}).products || [];
              this.getDetailManageItem(route.params.id);
            }
          }
        });
      });
      //   },
      // );
    });
  }

  modalSelectSetRef = ref => {
    this.refModalSelect = ref;
  };

  datePickerSetRef = ref => {
    this.refDatePicker = ref;
  };

  formDeleteSetRef = ref => {
    this.refFormDelete = ref;
  };

  onNextQuantityPerQR = () => {
    if (this.inputQuantityPerQR) {
      this.inputQuantityPerQR.focus();
    }
  };

  getDetailManageItem = id => {
    const {ManageItemOperations} = this.props;

    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });

    ManageItemOperations.getDetailManageItem({id}, res => {
      this.setState(previousState => {
        return {
          ...previousState,
          isVisible: false,
        };
      });

      const data = res.data;

      console.log('data', data);

      if (!data) {
        _Toast.success('Thông báo', 'Lấy thông tin cấp phát tem thất bại');

        const timeOut = setTimeout(() => {
          this.props.navigation.goBack();

          clearTimeout(timeOut);
        }, DELAYS.navigationInsertOrUpdateToScreen);

        return;
      }

      const fileUpload = (data.fileUpload || '').split(';').filter(p => p);
      const fileUploadUsed = (data.fileUploadUsed || '')
        .split(';')
        .filter(p => p);

      if (!data) {
        _Toast.success('Thông báo', 'Lấy thông tin cấp phát tem thất bại');

        return;
      }

      const files = fileUpload.map(p => {
        return {
          id: Guid.create().toString(),
          name: p,
          uri: p,
        };
      });

      const filesUpload = fileUploadUsed.map(p => {
        return {
          id: Guid.create().toString(),
          name: p,
          uri: p,
        };
      });

      // const product = products.find(p => p.id == data.productID);

      this.setState(previousState => {
        return {
          ...previousState,
          quantity: (data.quantity || '').toString(),
          id: data.id,
          status: data.status,
          // productId: data.productID,
          // productName: data.productName,
          // quantityPerQR: (data.quantity || '').toString(),
          stampTemplateChoose: {
            id: data.stampTemplateID,
          },
          files,
          checkbox: data.isPrint ? 'notRequest' : 'request',
          amount: data.amount,
          fileUpload: data.fileUpload,
          dateRequest: data.requestedDate,
          deliveryDate: data.deliveryDate,
          reason: data.reason,
          requestedUsedReason: data.requestedUsedReason,
          partnerName: data.partnerName,
          isPrint: data.isPrint,
          requestedUsedStatus: data.requestedUsedStatus,
          fileUploadUsed: data.fileUploadUsed,
          filesUpload,
          avatar: data.avatar,
          note: data.note,
          size: data.size,
        };
      });
    });
  };

  onAdd = () => {
    const {ManageItemOperations} = this.props;
    const {
      id,
      quantity,
      productId,
      stampTemplateChoose,
      // quantityPerQR,
      files,
      checkbox,
      priceStamp,
      fileUpload,
      reason,
      isConfirm,
      note,
      size,
    } = this.state;

    Keyboard.dismiss();

    const _quantity = parseInt(quantity);
    // const _quantityPerQR = parseInt(quantityPerQR);
    const _priceStamp = parseInt(priceStamp);
    const stampTemplateId = (stampTemplateChoose || {}).id;

    if (!_quantity) {
      _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng');

      return;
    }

    if (_quantity <= 0) {
      _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng lớn hơn 0');

      return;
    }

    if (_quantity > 100000) {
      _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng nhỏ hơn 100000');

      return;
    }

    // if (!productId) {
    //   _Toast.error('Thông báo', 'Bạn vui lòng chọn sản phẩm');

    //   return;
    // }

    // if (!_quantityPerQR) {
    //   _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng tem mỗi mã QR');

    //   return;
    // }

    // if (_quantityPerQR <= 0) {
    //   _Toast.error('Thông báo', 'Bạn vui lòng nhập số lượng tem mỗi mã QR');

    //   return;

    // }
    if (!checkbox && isConfirm) {
      _Toast.error('Thông báo', 'Bạn muốn tự in hay yêu cầu in?');

      return;
    }

    if (!stampTemplateId && isConfirm) {
      _Toast.error('Thông báo', 'Bạn vui lòng chọn mẫu tem');

      return;
    }

    const stringFiles = files
      .filter(p => p.name)
      .map(p => p.name)
      .join(',');

    const _files = files.filter(p => p.name && p.uri && p.type);

    // if (_files.length <= 0 && fileUpload == '' && isConfirm) {
    //   _Toast.error('Thông báo', 'Bạn vui lòng chọn hồ sơ đính kèm');
    //   return;
    // }

    let amount = 0;
    let temp = _priceStamp * _quantity || 0;

    if (checkbox == 'request') {
      amount = temp;
    }
    this.setState(previousState => {
      return {
        ...previousState,
        isVisible: true,
      };
    });

    console.log('data', {
      quantity: quantity,
      stampTemplateID: stampTemplateId,
      fileUpload: stringFiles,
      files: _files,
      isPrint: checkbox ? (checkbox == 'notRequest' ? true : false) : false,
      amount,
      note,
    });

    if (id) {
      ManageItemOperations.editManageItem(
        {
          id,
          // requested: quantity,
          // productID: productId,
          quantity: quantity,
          stampTemplateID: stampTemplateId,
          fileUpload: _files.length <= 0 ? fileUpload : stringFiles,
          files: _files,
          isPrint: checkbox ? (checkbox == 'notRequest' ? true : false) : false,
          amount: parseInt(amount),
          note,
        },
        res => {
          this.setState(previousState => {
            return {
              ...previousState,
              isVisible: false,
            };
          });

          if (res.status && res.status == 200) {
            _Toast.success('Thông báo', 'Sửa cấp phát tem thành công');

            const timeOut = setTimeout(() => {
              this.props.navigation.goBack();

              clearTimeout(timeOut);
            }, DELAYS.navigationInsertOrUpdateToScreen);
          } else {
            const message = getErrorMessageServer(res);
            _Toast.error('Thông báo', message || 'Sửa cấp phát tem thất bại');
          }
        },
      );
    } else {
      if (isConfirm) {
        ManageItemOperations.addManageItem(
          {
            // requested: quantity,
            // productID: productId,
            quantity: quantity,
            stampTemplateID: stampTemplateId,
            fileUpload: stringFiles,
            files: _files,
            isPrint: checkbox
              ? checkbox == 'notRequest'
                ? true
                : false
              : false,
            amount,
            note,
            size,
          },
          res => {
            console.log('res', res);

            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });

            if (res.status && res.status == 200) {
              _Toast.success('Thông báo', 'Thêm cấp phát tem thành công');

              const timeOut = setTimeout(() => {
                this.props.navigation.goBack();

                clearTimeout(timeOut);
              }, DELAYS.navigationInsertOrUpdateToScreen);
            } else {
              const message = getErrorMessageServer(res);

              _Toast.error(
                'Thông báo',
                message || 'Thêm cấp phát tem thất bại',
              );
            }
          },
        );
      } else {
        ManageItemOperations.requestProvideStamp(
          {
            quantity: quantity,
          },
          res => {
            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });

            if (res.status && res.status == 200) {
              _Toast.success('Thông báo', 'Thêm cấp phát tem thành công');

              const timeOut = setTimeout(() => {
                this.props.navigation.goBack();

                clearTimeout(timeOut);
              }, DELAYS.navigationInsertOrUpdateToScreen);
            } else {
              const message = getErrorMessageServer(res);

              _Toast.error(
                'Thông báo',
                message || 'Thêm cấp phát tem thất bại',
              );
            }
          },
        );
      }
    }
  };

  onChangeValue = name => value => {
    this.setState(previousState => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  onChangeQuantity = () => value => {
    this.setState(previousState => {
      return {
        ...previousState,
        quantity: value,
      };
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let priceStamp = 0;
      this.props.ManageItemOperations.getPriceStamp(value, res => {
        priceStamp = res?.data || 0;
        this.setState(previousState => {
          return {
            ...previousState,
            priceStamp,
          };
        });
      });
    }, 300);
  };

  onDelete = () => {
    const {id} = this.state;

    if (!id) {
      _Toast.error('Thông báo', 'Cấp phát tem không tồn tại');

      const timeOut = setTimeout(() => {
        this.props.navigation.goBack();

        clearTimeout(timeOut);
      }, DELAYS.navigationInsertOrUpdateToScreen);

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

            this.setState(previousState => {
              return {
                ...previousState,
                isVisible: false,
              };
            });

            const timeOut = setTimeout(() => {
              this.props.navigation.goBack();

              clearTimeout(timeOut);
            }, DELAYS.navigationInsertOrUpdateToScreen);
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
  };

  onPopupProduct = () => {
    let products = [];

    if (
      (
        this.props.ManageItemReducer.get(
          manageItemConstant.KEYS.productComboBoxs,
        ) || {}
      ).toJS
    ) {
      products = this.props.ManageItemReducer.get(
        manageItemConstant.KEYS.productComboBoxs,
      ).toJS();
    }

    ModalSelect.open(
      this.onChangeProduct,
      products,
      this.state.productId,
      {label: 'productName', value: 'id'},
      'Chọn sản phẩm',
      'Tìm kiếm',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.refModalSelect,
      false,
    );
  };

  onChangeProduct = item => {
    this.setState(previousState => {
      return {
        ...previousState,
        productName: item.productName,
        productId: item.id,
      };
    });
  };

  onChooseStampTemplate = item => () => {
    this.setState(previousState => {
      return {
        ...previousState,
        stampTemplateChoose: item,
      };
    });
  };

  onRemoveFile = id => () => {
    let files = [...this.state.files];

    files = files.filter(p => p.id != id);

    this.setState(previousState => {
      return {
        ...previousState,
        files,
      };
    });
  };
  checkFile = (All_DATA, name) => {
    const fileName = getFileName(name);
    return All_DATA.includes(fileName);
  };
  onShowFile = url => () => {
    let check = url.startsWith('http');
    if (check) {
      let extension = url.split(/[#?]/)[0].split('.').pop().trim();
      const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;
      const options = {
        fromUrl: url,
        toFile: localFile,
      };
      RNFS.downloadFile(options)
        .promise.then(() => FileViewer.open(localFile))
        .then(() => {
          // console.log('Success');
        })
        .catch(error => {
          // console.log('Error');
        });
    } else {
      FileViewer.open(url);
    }
  };
  onChooseFile = () => {
    DocumentPicker.pickMultiple({
      allowMultiSelection: true,
      type: DocumentPicker.types.allFiles,
      presentationStyle: 'fullScreen',
      mode: 'open',
    })
      .then(res => {
        const data = res || [];

        if (data.length > 0) {
          const files = [...this.state.files];

          for (let i = 0; i < data.length; i++) {
            files.push({
              id: Guid.create().toString(),
              uri: data[i].uri,
              type: data[i].type,
              name: data[i].name,
            });
          }

          this.setState(previousState => {
            return {
              ...previousState,
              files,
            };
          });
        }
      })
      .catch(err => {
        if (DocumentPicker.isCancel(err)) {
        }
      });
  };
  onCheckboxRequest = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        checkbox: 'request',
      };
    });
  };
  onCheckboxNotRequest = () => {
    this.setState(previousState => {
      return {
        ...previousState,
        checkbox: 'notRequest',
      };
    });
  };
  setFiles = value => {
    this.setState(previousState => {
      return {
        ...previousState,
        files: value,
      };
    });
  };
  setFilesUpload = value => {
    this.setState(previousState => {
      return {
        ...previousState,
        filesUpload: value,
      };
    });
  };
  onGetAmount = () => {
    const {quantity, quantityPerQR, priceStamp, amount} = this.state;
    const _amount = parseInt(amount);
    const _quantity = parseInt(quantity);
    const _quantityPerQR = parseInt(quantityPerQR);
    const _priceStamp = parseInt(priceStamp);
    let currentAmount = _quantity * _quantityPerQR * _priceStamp;
    if (_amount != currentAmount) {
      return numberWithCommas(currentAmount);
    } else {
      return numberWithCommas(_amount);
    }
  };

  render() {
    const {
      productName,
      status,
      id,
      isVisible,
      quantity,
      stampTemplates,
      stampTemplateChoose,
      quantityPerQR,
      files,
      checkbox,
      priceStamp,
      amount,
      dateRequest,
      deliveryDate,
      reason,
      requestedUsedReason,
      partnerName,
      isPrint,
      requestedUsedStatus,
      filesUpload,
      avatar,
      dataConfig,
      isConfirm,
      note,
      size,
    } = this.state;

    let disable = status == 2;

    let isUpdate =
      !id ||
      (status == 0 && requestedUsedStatus == 0) ||
      (status == 3 && requestedUsedStatus == 0);

    let stamp = stampTemplates.find(e => e.id == stampTemplateChoose?.id);

    const CustomText = ({title, content}) => {
      return (
        <View style={style.customText}>
          <ICONS.check_stamp width={24} height={24} stroke={COLORS.primary} />
          <Text style={style.txtNormal}>
            {title}: {}
            <Text style={style.txtBold}>{content}</Text>
          </Text>
        </View>
      );
    };
    const {width} = Dimensions.get('window').width;

    return (
      <BoxMainContainer
        modalSelectSetRef={this.modalSelectSetRef}
        datePickerSetRef={this.datePickerSetRef}
        formDeleteSetRef={this.formDeleteSetRef}
        isVisibleLoadingCenter={isVisible}
        isShowBackHeader={true}
        isScrollEnabled={false}
        styleBody={style.boxMainBody}
        isShowInfo={true}
        isShowQRCodeButton={false}
        isShowHeader={true}
        isShowVersion={false}
        isShowVersionName={false}>
        <Text style={style.title}>QUẢN LÝ TEM</Text>
        {isUpdate ? (
          <>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              style={style.form}>
              {/* <View style={style.formItem}>
                <Text style={style.formItemLabel}>Sản phẩm</Text>
                <TouchableOpacity
                  disabled={disable}
                  onPress={this.onPopupProduct}
                  activeOpacity={0.8}
                  style={[
                    style.formItemSelect,
                    disable ? style.disableBackgroundColor : null,
                  ]}>
                  <Text style={style.formItemSelectText}>{productName}</Text>
                  {disable ? null : (
                    <View style={style.formItemSelectIcon}>
                      <ICONS.caretDown2 width={16} height={16} />
                    </View>
                  )}
                </TouchableOpacity>
              </View> */}
              {isConfirm ? (
                <>
                  <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Số lượng tem
                    </Text>
                    <TextInput
                      editable={!disable}
                      value={quantity}
                      onChangeText={this.onChangeQuantity()}
                      keyboardType="number-pad"
                      onSubmitEditing={this.onNextQuantityPerQR}
                      maxLength={255}
                      ref={input => (this.inputQuantity = input)}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      returnKeyLabel="Xong"
                      style={[
                        style.formItemInput,
                        disable ? style.disableBackgroundColor : null,
                      ]}
                    />
                  </View>
                  <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Kích thước tem
                    </Text>
                    <TextInput
                      editable={!disable}
                      value={size}
                      onChangeText={this.onChangeValue('size')}
                      maxLength={255}
                      ref={input => (this.inputQuantityPerQR = input)}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      returnKeyLabel="Xong"
                      style={[
                        style.formItemInput,
                        disable ? style.disableBackgroundColor : null,
                      ]}
                    />
                  </View>
                  <View style={style.checkbox}>
                    <TouchableOpacity
                      disabled={disable}
                      style={style.wrapCheckbox}
                      onPress={this.onCheckboxRequest}>
                      <View
                        style={[
                          style.checkboxSelect,
                          {
                            backgroundColor:
                              checkbox == 'request'
                                ? COLORS.primary
                                : COLORS.white,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    <Text
                      style={style.formItemLabel}
                      onPress={disable ? null : this.onCheckboxRequest}>
                      Yêu cầu in
                    </Text>
                    <View style={style.block} />
                    <TouchableOpacity
                      disabled={disable}
                      style={style.wrapCheckbox}
                      onPress={this.onCheckboxNotRequest}>
                      <View
                        style={[
                          style.checkboxSelect,
                          {
                            backgroundColor:
                              checkbox == 'notRequest'
                                ? COLORS.primary
                                : COLORS.white,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    <Text
                      onPress={disable ? null : this.onCheckboxNotRequest}
                      style={style.formItemLabel}>
                      Tự in
                    </Text>
                  </View>
                  {checkbox == 'request' && (
                    <View style={style.formItem}>
                      <Text style={style.formItemLabel}>
                        Số tiền phải thanh toán
                      </Text>
                      <View style={style.priceStamp}>
                        <Text style={style.txtPriceStamp}>
                          {amount
                            ? numberWithCommas(amount)
                            : numberWithCommas(quantity * priceStamp)}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Mẫu in tem
                    </Text>
                    <View style={style.formItemStampTemplate}>
                      {stampTemplates.map((item, index) => {
                        return (
                          <TouchableOpacity
                            disabled={disable}
                            delayPressIn={0}
                            activeOpacity={0.8}
                            onPress={this.onChooseStampTemplate(item)}
                            key={`stamp-template-${index}`}
                            style={{
                              ...style.formItemStampTemplateItem,
                              ...((stampTemplateChoose || {}).id == item.id
                                ? style.formItemStampTemplateItemActive
                                : {}),
                            }}>
                            <Image
                              resizeMode="cover"
                              style={style.formItemStampTemplateItemImage}
                              source={{uri: item.template || ''}}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  {/* <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Hồ sơ đính kèm
                    </Text>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: replaceHtml(
                          dataConfig?.attachmentStamps,
                          '<p>',
                          '<p style="margin-bottom:0px;color:#707070">',
                        ),
                      }}
                    />
                    <FileUpload
                      files={files}
                      setFiles={this.setFiles}
                      onChooseFile={this.onChooseFile}
                      onRemoveFile={this.onRemoveFile}
                    />
                    {status == 3 && (
                      <Text style={[style.txtNormal, style.txtMargin]}>
                        Lý do không duyệt: {}
                        <Text style={style.txtBold}>{reason}</Text>
                      </Text>
                    )}
                  </View> */}

                  <View style={style.formItem}>
                    <Text style={style.formItemLabel}>Ghi chú</Text>
                    <TextInput
                      editable={!disable}
                      value={note}
                      onChangeText={this.onChangeValue('note')}
                      maxLength={255}
                      style={[
                        style.formItemInputNote,
                        disable ? style.disableBackgroundColor : null,
                      ]}
                      multiline={true}
                    />
                  </View>
                  <View style={style.formItem}>
                    <Text style={style.formItemLabelNote}>
                      Nếu quý khách có yêu cầu in thêm số lượng tem mỗi mã QR
                      thì nhập thông tin như sau vào ghi chú : Số lượng tem mỗi
                      mã QR là : .... con
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Số lượng tem
                    </Text>
                    <TextInput
                      editable={!disable}
                      value={quantity}
                      onChangeText={this.onChangeQuantity()}
                      keyboardType="number-pad"
                      onSubmitEditing={this.onNextQuantityPerQR}
                      maxLength={255}
                      ref={input => (this.inputQuantityPerQR = input)}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      returnKeyLabel="Xong"
                      style={[
                        style.formItemInput,
                        disable ? style.disableBackgroundColor : null,
                      ]}
                    />
                  </View>
                  {/* <View style={style.formItem}>
                    <Text
                      style={[
                        style.formItemLabel,
                        style.formItemLabelRequired,
                      ]}>
                      Kích thước tem
                    </Text>
                    <TextInput
                      editable={!disable}
                      value={size}
                      onChangeText={this.onChangeValue('size')}
                      keyboardType="number-pad"
                      maxLength={255}
                      ref={input => (this.inputQuantity = input)}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      returnKeyLabel="Xong"
                      style={[
                        style.formItemInput,
                        disable ? style.disableBackgroundColor : null,
                      ]}
                    />
                  </View> */}
                </>
              )}
            </KeyboardAwareScrollView>
            {id ? (
              <AuthenticateView claims={[CLAIMS.manageItem.edit]} checkType={0}>
                <View style={style.function}>
                  <TouchableOpacity
                    onPress={this.onAdd}
                    activeOpacity={0.8}
                    style={style.functionUpdate}>
                    <ICONS.save width={18} height={18} />
                    <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                  </TouchableOpacity>
                </View>
              </AuthenticateView>
            ) : (
              <AuthenticateView claims={[CLAIMS.manageItem.add]} checkType={0}>
                <View style={style.function}>
                  <TouchableOpacity
                    onPress={this.onAdd}
                    activeOpacity={0.8}
                    style={style.functionUpdate}>
                    <ICONS.save width={18} height={18} />
                    <Text style={style.functionUpdateText}>CẬP NHẬT</Text>
                  </TouchableOpacity>
                </View>
              </AuthenticateView>
            )}
          </>
        ) : (
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={style.form}>
            {isConfirm ? (
              <>
                {/* <View style={style.wrapImage}>
              <View>
                <Image
                  source={avatar ? {uri: avatar} : ICONS.noImage}
                  style={style.imgProduct}
                  resizeMode="contain"
                />
                <Text style={style.txtProduct}>{productName}</Text>
              </View>
              <Image
                resizeMode="center"
                style={style.imgStamp}
                source={{uri: stamp.template || ''}}
              />
            </View> */}
                <Image
                  resizeMode="center"
                  style={style.imgStamp}
                  source={{uri: stamp.template || ''}}
                />
                <CustomText
                  title="Số lượng mã QR"
                  content={numberWithCommas(quantity, '.')}
                />
                <CustomText
                  title="Ngày yêu cầu"
                  content={moment(dateRequest).format('DD/MM/YYYY')}
                />
                {deliveryDate && (
                  <CustomText
                    title="Ngày trả tem"
                    content={moment(deliveryDate).format('DD/MM/YYYY')}
                  />
                )}
                <CustomText
                  title="Hình thức"
                  content={checkbox == 'request' ? 'Yêu cầu in' : 'Tự in'}
                />
                {isPrint ? null : (
                  <>
                    {status == 1 || status == 3 ? null : partnerName ? (
                      <CustomText
                        title="Đơn vị in tem"
                        content={partnerName || ''}
                      />
                    ) : null}
                    <CustomText
                      title="Số tiền mỗi con tem"
                      content={numberWithCommas(amount / quantity) + ' đ'}
                    />
                    <CustomText
                      title="Số tiền phải thanh toán"
                      content={numberWithCommas(amount) + ' đ'}
                    />
                  </>
                )}
                <CustomText title="Hồ sơ đính kèm yêu cầu cấp tem" content="" />
                <View style={style.childrenCustomText}>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: replaceHtml(
                        dataConfig?.attachmentStamps,
                        '<p>',
                        '<p style="margin-bottom:0px;color:#707070">',
                      ),
                    }}
                  />
                </View>
                <CustomText title="Tệp đính kèm yêu cầu cấp tem" content="" />
                <FileUpload
                  files={files}
                  setFiles={this.setFiles}
                  onChooseFile={this.onChooseFile}
                  onRemoveFile={this.onRemoveFile}
                  isHide={true}
                />
                <CustomText title="Ghi chú" content={note} />
                {requestedUsedStatus ? (
                  <>
                    <CustomText
                      title="Hồ sơ đính kèm yêu cấp phép sử dụng tem"
                      content=""
                    />
                    <View style={style.childrenCustomText}>
                      <RenderHtml
                        contentWidth={width}
                        source={{
                          html: replaceHtml(
                            dataConfig?.attachmentUsed,
                            '<p>',
                            '<p style="margin-bottom:0px;color:#707070">',
                          ),
                        }}
                      />
                    </View>
                    <CustomText
                      title="Tệp đính kèm yêu cầu cấp phép sử dụng tem"
                      content=""
                    />
                    <FileUpload
                      files={filesUpload}
                      setFiles={this.setFilesUpload}
                      onChooseFile={this.onChooseFile}
                      onRemoveFile={this.onRemoveFile}
                      isHide={true}
                    />
                  </>
                ) : null}
                {status == 3 && (
                  <CustomText
                    title="Lý do không duyệt yêu cầu cấp tem"
                    content={reason}
                  />
                )}
                {requestedUsedStatus == 3 && (
                  <CustomText
                    title="Lý do không duyệt yêu cầu cấp phép sử dụng tem"
                    content={requestedUsedReason}
                  />
                )}
              </>
            ) : (
              <View style={style.formItem}>
                <Text style={style.formItemLabel}>Số lượng tem</Text>
                <TextInput
                  editable={!disable}
                  value={quantity}
                  onChangeText={this.onChangeQuantity()}
                  keyboardType="number-pad"
                  onSubmitEditing={this.onNextQuantityPerQR}
                  maxLength={255}
                  ref={input => (this.inputQuantity = input)}
                  blurOnSubmit={false}
                  returnKeyType="done"
                  returnKeyLabel="Xong"
                  style={[
                    style.formItemInput,
                    disable ? style.disableBackgroundColor : null,
                  ]}
                />
              </View>
            )}
          </KeyboardAwareScrollView>
        )}
      </BoxMainContainer>
    );
  }
}

export default AddConsignment;
