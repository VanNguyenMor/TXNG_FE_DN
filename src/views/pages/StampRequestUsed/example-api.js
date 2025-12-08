const LOCATIONS = {
  getProvinces: 'location/getAllProvince',
};

const ACCOUNTS = {
  signIn: 'user/login',
  getListAccount: 'user/getall',
  addAccount: 'user/create',
  getListRoleComboBox: 'role/getall',
  getDetailAccount: 'user/get/{id}',
  editAccount: 'user/update',
  deleteAccount: 'user/delete/{id}',
  extendAccount: 'company/extend',
  uploadFileAccount: 'company/uploadagain',
  changePassword: 'user/changepassword',
  signInIdentity: '/connect/token',
  signInInfo: 'user/login?device={0}',
  sendLinkForgotPassword: 'user/sendlinkforgotpassword',
  checkLinkForgotPassword:
    'user/checkLinkForgotPassword?username={0}&shortLinkId={1}',
  changePasswordForForgotPassword: 'user/changePasswordForForgotPassword',
  getExpiredDate: 'user/getexpireddate',
  getInfoAccount: 'user/getinfoaccount',
  getCurrentCompany: 'company/getcurrent',
  getAboutPaymentInformation:'aboutus/get',
  registerAccount:'company/register',
};

const ROLES = {
  getListRole: 'role/getall',
  addRole: 'role/create',
  getDetailRole: 'role/get/{id}',
  editRole: 'role/update',
  deleteRole: 'role/delete/{id}',
};

const MATERIALS = {
  getListMaterial: 'material/getall',
  addMaterial: 'material/create',
  getListUnitComboBox: 'unit/getall',
  getDetailMaterial: 'material/get?id={id}',
  editMaterial: 'material/update',
  deleteMaterial: 'material/delete/{id}',
  getListMaterialGroupComboBox: 'materialgroupnext/getall',
  getListPartnerComboBox: 'partner/getall',
  getListNationComboBox: 'location/nation',
  getListReportdMaterialInventory:
    'report/materialwarehouse?id={id}&page={page}&limit={limit}',
  getListReportMaterialInventoryDetail:
    'report/materialstamp?id={id}&page={page}&limit={limit}',
  updateLock: 'material/lock?id={id}',
  getListMaterialComboBox: 'material/getListComboBox',
};

const MATERIAL_GROUP = {
  getAll: 'materialgroupnext/getall',
  get: 'materialgroupnext/get?id={id}',
  create: 'materialgroupnext/create',
  update: 'materialgroupnext/update',
  lock: 'materialgroupnext/lock?id={id}',
  delete: 'materialgroupnext/delete?id={id}',
};

const GOOD_DELIVERY = {
  checkQRCodeForAddGoodDelivery:
    'qrcode/checkQRCodeForAddGoodDelivery?qrCode={0}',
  getListGoodDelivery: 'goodsdeliverynote/getall',
  addGoodDelivery: 'goodsdeliverynote/create',
  getDetailGoodDelivery: 'goodsdeliverynote/get?id={id}',
  getListPartnerComboBox: 'partner/getall',
  getListMaterialComboBox: 'material/getlistboth?page={0}&limit={1}&search={2}',
  getListProductComboBox: 'product/getalllock',
  getListMaterialInventoryComboBox:
    'material/getlistbothinventory?page={0}&limit={1}&search={2}',
  getListProductInventoryComboBox: 'product/getlistlockinventory',
  getDetailMaterial: 'material/get?id={id}',
  deleteGoodDelivery: 'goodsdeliverynote/delete/{id}',
  editGoodDelivery: 'goodsdeliverynote/update',
  getListPlantingZoneComboBox: 'plantingzone/getall',
  getDetailProduct: 'product/get?id={id}',
  getListUserComboBox: 'user/getall',
  updateLock: 'goodsdeliverynote/lock/{id}',
  scanQRCodeUnit: 'goodsdeliverynote/getbyqr?refQRCode={qrCode}',
  getListWareHouseComboBox: 'warehouse/getall',
  getListByMaterial: 'unit/GetListByMaterial?id={id}',
  getListByProduct: 'unit/GetListByProduct?id={id}',
  companyConfig: 'companyconfig/get',
  requestConfirm: 'goodsdeliverynote/requestconfirm/{id}',
  requestUnConfirm:
    'goodsdeliverynote/requestunconfirm/{id}?reason={reason}&content1={content1}',
  requireConfirm: 'goodsdeliverynote/requireconfirm/{id}',
  inventory:
    'inventory/getconvertinventorytounit?unitIdTarget={unitIdTarget}&valueTarget={valueTarget}&productMaterialId={productMaterialId}&wareHouseId={wareHouseId}',
  getListBatchForAddGoodDelivery: 'batch/getlistforaddgooddelivery',
  createTransportTicket: 'goodsdeliverynote/createtransportticket',
  getListProductForAddGoodDeliveryComboBox: 'product/getforgooddelivery',
  getDetailBatchForAddGoodDelivery:
    'batch/getDetailBatchForAddGoodDelivery?batchCode={0}',
};

const GOOD_RECEIVED = {
  getListGoodReceived: 'goodsreceivednote/getall',
  addGoodReceived: 'goodsreceivednote/create',
  getDetailGoodReceived: 'goodsreceivednote/get?id={id}',
  getListPartnerComboBox: 'partner/getall',
  getListMaterialComboBox: 'material/getlistboth?page={0}&limit={1}&search={2}',
  getListProductComboBox: 'product/getalllock',
  getDetailMaterial: 'material/get?id={id}',
  deleteGoodReceived: 'goodsreceivednote/delete/{id}',
  editGoodReceived: 'goodsreceivednote/update',
  getListPlantingZoneComboBox: 'plantingzone/getall',
  getDetailProduct: 'product/get?id={id}',
  getListUserComboBox: 'user/getall',
  updateLock: 'goodsreceivednote/lock/{id}',
  getListWareHouseComboBox: 'warehouse/getall',
  getListByMaterial: 'unit/GetListByMaterial?id={id}',
  getListByProduct: 'unit/GetListByProduct?id={id}',
  companyConfig: 'companyconfig/get',
  requestConfirm: 'goodsreceivednote/requestconfirm/{id}',
  requestUnConfirm:
    'goodsreceivednote/requestunconfirm/{id}?reason={reason}&content1={content1}',
  requireConfirm: 'goodsreceivednote/requireconfirm/{id}',
  checkBatchByStamp: 'qrcode/checkbatchbystamp?stampId={0}',
  getListBatchCompany: 'goodsreceivednote/getlistbatchcompany',
  updateGoodReceivedFromGoodDelivery:
    'goodsreceivednote/updategoodreceivedfromgooddelivery',
};

const PERMISSIONS = {
  getListRoleComboBox: 'role/getall',
  getListPermission: 'roleperminssion/getgridview/{id}',
  checkPermission: 'roleperminssion/checkfunc',
};

const PARTNERS = {
  getListPartner: 'partner/getall',
  addPartner: 'partner/create',
  getDetailPartner: 'partner/get?id={id}',
  editPartner: 'partner/update',
  deletePartner: 'partner/delete/{id}',
  getListNationComboBox: 'location/nation',
  getListPartnerLACO:
    'partner/getlistpartnerlaco?name={name}&code={code}&companyId={companyId}',
  getListPartnerComboBox: 'partner/getListComboBox',
};

const INFOCOMPANYS = {
  getDetailInfoCompany: 'company/get?id={id}',
  getListProvinceComboBox: 'location/getprovince',
  getListDistrictComboBox: 'location/getdistrict?provinceID={id}',
  getListWardComboBox: 'location/getward?districtID={id}',
  getFieldComboBox: 'field/getalllevel4',
  updateInfoCompany: 'company/update',
  uploadFile: 'company/upload',
  getAllListProvinceComboBox: 'location/getallprovince',
};

const GROUPFIELDS = {
  getGroupListField: 'fieldType/getall',
}

const PRODUCTS = {
  getListProduct: 'product/getall',
  getListUnitComboBox: 'unit/getall',
  getDetailProduct: 'product/getforlist?id={id}',
  addProduct: 'product/create',
  editProduct: 'product/update',
  deleteProduct: 'product/delete/{id}',
  // getListFieldComboBox: 'field/getallbycompanylevel5',
  getListFieldComboBox: 'field/getallbycompanylevel4',
  getListNationComboBox: 'location/nation',
  uploadFile: 'product/upload',
  getListReportProduct: 'product/getall',
  getListReportProductInventory:
    'report/productwarehouse?id={id}&page={page}&limit={limit}',
  getListReportProductInventoryDetail:
    'report/productstamp?id={id}&page={page}&limit={limit}',
  getListProductTypeAddComboBox: 'productgroup/getall',
  updateLock: 'product/lock/{id}',
  getListPartnerComboBox: 'partner/getall',
  updateConfirmStatus: 'product/requestconfirm?id={id}',
  getListMaterialGroupComboBox: 'materialgroup/getall',
  getListProductComboBox: 'product/getlistcombobox',
  getListWithMaterialComboBox: 'product/getListWithMaterialComboBox',
  getListWithMaterialInventoryByWarehouseComboBox: 'product/getListWithMaterialInventoryByWarehouseComboBox?warehouseId={0}'
};

const FEEDBACKS = {
  getListFeedBack: 'feedback/getall',
  hideFeedBack: 'feedback/hide/{id}',
  showFeedBack: 'feedback/show/{id}',
  getAllProductFeedbacks: 'product/getallproductfeedbacks',
};

const CONSIGNMENTS = {
  getListConsignment: 'batch/getlist',
  addConsignment: 'batch/create',
  getDetailConsignment: 'batch/get/{id}',
  editConsignment: 'batch/update',
  deleteConsignment: 'batch/delete/{id}',
  getListFieldComboBox: 'batch/getfields',
  getListProductComboBox: 'product/getall',
  getListPlantingZoneComboBox:
    'plantingzone/getlistplantingzonebytraceinform?traceInformId={0}',
  getListUnitComboBox: 'product/getunits?productID={0}',
  updateLock: 'batch/lock?id={0}&warehouseId={1}',
  getListReportConsignmentDetail: 'batch/get/{id}',
  getListReportConsignment: 'batch/getlist',
  getListDiaryComboBox: 'batch/gettraces',
  getListWarehouseForUpdate: 'warehouse/getall',
  getListTraceHarvestForAddConsignment: 'trace/getlistharvest',
  getItemNameByTraceInform: 'item/getitemnamebytraceinform?traceInformId={0}',
  getUnitNameByTraceInform: 'unit/getunitnamebytraceinform?traceInformId={0}',
  checkStampIDValid: 'stamplist/checkstampidvalid?stampid={0}&productid={1}',
  getStampRange: 'stampranges/getstamprange',
  requireConfirm: 'batch/requireconfirm?id={id}',
  confirm: 'batch/requestconfirm?id={id}&warehouseId={warehouseId}',
  checkValidIdStamp: 'qrcode/checkvalididstamp',
  unConfirm:
    'batch/requestunconfirm?id={id}&reason={reason}&content1={content1}&type={type}',
  getBatchCategories: 'batch/getbatchcategories',
  updateConsignment: 'batch/update',
  getListNationComboBox: 'location/nation',
  getListProvinceComboBox: 'location/getallprovince'
};

const MANAGEITEMS = {
  getListManageItem: 'requestprovidestamp/getall',
  addManageItem: 'requestprovidestamp/create',
  getDetailManageItem: 'requestprovidestamp/get/{id}',
  editManageItem: 'requestprovidestamp/update',
  deleteManageItem: 'requestprovidestamp/delete/{id}',
  getListProductComboBox: 'product/getall',
  getListQRCodeStamp: 'requestprovidestamp/qrcodestampid?requestID={0}',
  getListReportManageItem: 'requestprovidestamp/getall',
  getListStampTemplate: 'requestprovidestamp/getliststemptemplate',
  getPriceStamp: 'requestprovidestamp/getprice?quantity={quantity}',
  requestManageItem: 'requestprovidestamp/requestprovincestamp?id={id}',
  requestPermissionProvinceStamp:
    'requestprovidestamp/requestpermissionprovincestamp',
  printStamp: 'requestprovidestamp/printstamp?id={id}',
  updateFilesAgain: 'requestprovidestamp/updatefilesagain',
  requestProvideStamp: 'requestprovidestamp/createforprovincenotregister',
  createAfterPayment: 'requestprovidestamp/createafterpayment',
};

const REGION_DECLARATIONS = {
  getListRegionDeclaration: 'plantingzone/getall',
  getListRegionComboBox: 'plantingzone/getall',
  getListRegionTypeComboBox: 'plantingtype/getall',
  addRegionDeclaration: 'plantingzone/create',
  editRegionDeclaration: 'plantingzone/update',
  deleteRegionDeclaration: 'plantingzone/delete?id={0}',
  getDetailRegionDeclaration: 'plantingzone/get?id={0}',
  uploadFileRegionDeclaration: 'plantingzone/upload',
  checkIsBelongTo: 'plantingzone/checkisbelongto?location={0}',
  getListDistrictComboBox: 'location/getdistrict?provinceID={id}',
  getListWardComboBox: 'location/getward?districtID={id}',
  getDetailPlantingType: 'plantingtype/get?id={0}',
  getListProvinceComboBox: 'location/getallprovince',
  updatePermission: 'plantingzone/updatepermission',
  getListRoleByPlantingZone: 'plantingzone/getlistrolebyplantingzone?id={0}',
  getListRolePlantingZone: 'plantingzone/getlistroleplantingzone',
};

const SET_ACCESSES = {
  getListSetAccess: 'processaccess/getgridview',
  getListFieldComboBox: 'field/getallbycompanyhaveaccess',
  getListProductComboBox: 'product/getalllock',
  checkRequired: 'processaccess/checkrequired',
  checkShow: 'processaccess/checkshow',
  getListRoleComboBox: 'role/getall',
  provideRole: 'processaccess/providerole',
  getListMaterialGroup: 'materialgroup/getallhaveproduct',
  getListProductGroup: 'productgroup/getallhaveproduct',
  getListTraceRole: 'processaccess/getlisttraceroles?informSelectID={0}',
  getListSetAccessV2: 'processaccess/getgridviewv2?fieldId={0}&productId={1}',
  updateV2: 'processaccess/updatev2',
  updateNumber: 'processaccess/updateNumber',
  addSetAccess: 'processaccess/create',
  editSetAccess: 'processaccess/update',
  deleteSetAccess: 'processaccess/delete?id={id}',
  getDetailSetAccess: 'processaccess/get?id={id}',
  getDetailSetAccessForAdd: 'processaccess/getDetailSetAccess?id={id}',
};

const SET_MANIFESTS = {
  getListSetManifest: 'informationaccess/getgridview',
  getListFieldComboBox: 'field/getallbycompanyhaveaccess',
  getListProductComboBox: 'product/getalllock',
  checkRequired: 'informationaccess/checkrequired',
  checkShow: 'informationaccess/checkshow',
  getListMaterialGroup: 'materialgroup/getallhaveproduct',
  getListProductGroup: 'productgroup/getallhaveproduct',
  getListSetManifestV2:
    'informationaccess/getgridviewv2?fieldId={0}&productId={1}',
  updateV2: 'informationaccess/updatev2',
  addSetManifest: 'informationaccess/create',
  editSetManifest: 'informationaccess/update',
  editSetManifestValue: 'informationaccess/updateinformselectvalue',
  deleteSetManifest: 'informationaccess/delete?id={id}',
  getDetailSetManifest: 'informationaccess/get?id={id}',
  getDetailSetManifestForAdd: 'informationaccess/getDetailSetManifest?id={id}',
  getListProcessAccessComboBoxForAdd:
    'informationaccess/getListProcessAccessForAdd?fieldId={0}&productId={1}',
};

const DIARYS = {
  getInventoryByMaterial:
    'inventory/getconvertinventorytoUnitwithoutwarehouse?unitIdTarget={0}&productMaterialId={1}',
  getListDiary: 'trace/getall',
  getListFieldComboBox: 'trace/getfields',
  getListFieldComboBoxForAddDiary: 'field/getallbycompanyhaveaccesstrace',
  getListProductComboBox: 'product/getbytrace?FieldId={0}',
  getListProductComboBoxForAddDiary: 'product/getalllock',
  getListPlantingZoneComboBox: 'plantingzone/getall',
  getListPlantingZoneComboBoxForAddDiary: 'plantingzone/getall',
  addDiary: 'trace/tracecreate',
  getDiary: 'trace/gethistory',
  getInformSelect: 'trace/get?id={0}',
  getPlanZoneHistory: 'trace/getplanzonehistory',
  getAttribute: 'trace/getattribute?informSelectId={0}',
  uploadFile: 'trace/upload',
  writeDinary: 'trace/writetrace',
  scanQRCodeIndividual: 'trace/checkitemvalid?qrCode={0}',
  getListCustomerForRecordDiary: 'partner/getlistcustomerforwritetrace',
  getListProviderForRecordDiary: 'partner/getlistproviderforwritetrace',
  getListPartnerForRecordDiary: 'partner/getall',
  getListEmployeeForRecordDiary: 'employee/getempimplementation',
  getListMaterialForRecordDiary: 'material/getlistforwritetrace',
  getListUnitByMaterialForRecordDiary:
    'material/getlistunitforwritetrace?id={0}',
  getListPlantingZoneForRecordDiaryComboBox: 'trace/getplanzone?traceId={0}',
  syncWriteDiary: 'trace/syncwritetrace',
  getListIndividualForDiary:
    'trace/getitem?traceID={0}&planZoneID={1}&page={2}&limit={3}&search={4}',
  deleteWriteDiary: 'trace/deletewritetrace?traceInfoId={0}',
  deleteDiary: 'trace/delete?id={0}',
  verifyDiaryItem: 'trace/evaluate',
  deleteDiaryItem: 'trace/deletewritetrace?traceInfoId={0}',
  listDetailPreviewDiary: 'trace/getlistevaluate?traceInfoID={0}',
  endDiary: 'trace/completed?id={0}',
  madeAgainDiary: 'trace/madeagain',
  getListPermissionDiary: 'trace/gettracerole?traceID={0}',
  getMaterialByQRCodeDiary:
    'material/getbyqr?materialGroupId={0}&refQRCode={1}',
  getListWareHouseForRecordDiary: 'warehouse/getall',
  getListPartnerMovementForRecordDiary: 'trace/getpartnermovement',
  getListVehicleForRecordDiary: 'vehicle/getall',
  getListFactoryForRecordDiary: 'factory/getlistforwritetrace',
  getListToolForRecordDiary: 'factory/getlisttoolforwritetrace',
  getListGoodReceivedForRecordDiary: 'trace/getgoodreceipt?traceId={0}',
  getDetailGoodReceivedForRecordDiary: 'trace/getdetailgoodreceipt?grId={0}',
  checkInventoryMultiForRecordDiary: 'inventory/checkinventorymulti',
  getListUnitByMaterialForHarvest: 'material/getlistunitforwritetrace?id={0}',
  getListPlantingZoneByTrace:
    'plantingzone/getlistplantingzonebytrace?traceId={0}',
  updateTraceInformGPS: 'trace/updatetraceinformgps',
  getDetailDiary: 'trace/getdetail?id={0}',
  getListGoodIssueTrace: 'trace/getlistgoodissue?traceId={0}',
  getPartnerTrace: 'lacopartner/getpartnertracescan?partnerid={0}',
  getTransportTrace: 'lacotransport/gettransporttracescan?transportid={0}',
  getDetailTraceInform: 'trace/getdetailtraceinform?traceInformId={0}',
  getTraceByQRCode: 'trace/getTraceByQRCode?qrCode={0}',
  getDetailDiaryPartnerByBatch: 'trace/getdetailpartnerbybatch?id={0}',
  getListGoodIssueTracePartner: 'trace/getlistgoodissuepartner?traceId={0}',
  getDiaryPartner: 'trace/gethistorypartner',
  getListPlantingZoneByTracePartner:
    'plantingzone/getlistplantingzonebytracepartner?traceId={0}',
};

const SERVERS = {
  getListServer: 'server/getalldto',
  getDetailServer: 'server/get/{0}',
  getListCompany: 'server/getallcompany'
};

const INDIVIDUALS = {
  getListIndividual: 'item/getall',
  addIndividual: 'item/create',
  getDetailIndividual: 'item/get?id={id}',
  deleteIndividual: 'item/delete?id={id}',
  getListPlantingZoneRefresh: 'item/changeplanzone?itemID={0}',
  updatePlantingZoneRefresh: 'item/changeplanzone',
  updateDead: 'item/checkdead?id={0}',
  getListIndividualMasterComboBox: 'item/getlistitemmaster?search={0}',
  getListIndividualQRCode: 'item/getlistqrcode',
  getListIndividualComboBoxForInsertOrUpdateConsignment:
    'batch/getitem?fieldId={0}&productId={1}&planZoneID={2}&page={3}&limit={4}',
  checkTraceDead: 'item/checktracedead?id={0}',
};

const MANAGEQRS = {
  getListManageQRStamp:
    'requestprovidestamp/qrcodestampunused?page={0}&limit={1}&productID={2}',
  // getListManageQRSystem: 'qrcode/getsystemqrcode',
  getListManageQRSystem: 'qrmanager/getallqrcodessystem',
  getListManageQRUsed:
    'requestprovidestamp/getstampused?page={0}&limit={1}&productId={2}',
  getListProductComboBox: 'product/getalllock',
  getListManageQRIncurred: 'qrmanager/getallqrcodesincurred',
  getListManageQRRequest: 'manageqr/getlist?page={0}&limit={1}',
  getListManageQRBad:
    'badstamp/getlist?page={0}&limit={1}&stampRequestId={2}&fromDate={3}&toDate={4}',
  addBadStamp: 'badstamp/create',
  getListStampRequestComboBox: 'manageqr/getliststamprequestcombobox',
  deleteManageQRBad: 'badstamp/delete?id={0}',
  getListManageQRHistory:
    'manageqr/getlisthistory?page={0}&limit={1}&stampRequestId={2}&fromDate={3}&toDate={4}',
  getDetailBadStamp: 'badstamp/get?id={0}',
  confirmBadStamp: 'badstamp/confirm?id={0}',
  unConfirmBadStamp: 'badstamp/unconfirm?id={0}',
};

const SCANS = {
  scanQRCodePrivate: 'qrcode/privatescanqr?qrCode={0}',
};

const PLANTINGZOMES = {
  getListPlantingZoneRefresh: 'item/changeplanzone?itemID={0}',
  updatePlantingZoneRefresh: 'item/changeplanzone',
  getListPlantingZoneComboBox: 'plantingZone/getListComboBox',
};

const SETTINGS = {
  getSetting: 'companysetting/getall',
  updateSetting: 'companysetting/toggle?id={0}&value={1}',
  companyConfig: 'companyconfig/get',
  updateCompanyConfig: 'companyconfig/update',
};

const UNITS = {
  getListUnit: 'unit/getall',
  addUnit: 'unit/create',
  getDetailUnit: 'unit/get?id={id}',
  editUnit: 'unit/update',
  deleteUnit: 'unit/delete/{id}',
};

const ALERTS = {
  getListAlert: 'dashboard/getlistalert?page={0}&limit={1}',
  getTotalAlertNotRead: 'dashboard/gettotalalertnotread',
  readAllAlert: 'dashboard/readallalert',
  readAlert: 'dashboard/readalert?alertId={0}',
  getDoneConfirmStampByAlert: 'alert/getDoneConfirmStampByAlert?refId={0}',
  getNotConfirmStampByAlert: 'alert/getNotConfirmStampByAlert?refId={0}',
  getDonePrintStampByAlert: 'alert/getDonePrintStampByAlert?refId={0}',
  getDoneDeliveryStampByAlert: 'alert/getDoneDeliveryStampByAlert?refId={0}',
  getDateReturnStampByAlert: 'alert/getDateReturnStampByAlert?refId={0}',
  getDoneConfirmProductByAlert: 'alert/getDoneConfirmProductByAlert?refId={0}',
  getConfirmRegisterUseByAlert: 'alert/getConfirmRegisterUseByAlert?refId={0}',
  getConfirmExtendUseByAlert: 'alert/getConfirmExtendUseByAlert?refId={0}',
  getNotConfirmProductByAlert: 'alert/getNotConfirmProductByAlert?refId={0}',
  getConfirmUseStampByAlert: 'alert/getConfirmUseStampByAlert?refId={0}',
  getNotConfirmUseStampByAlert: 'alert/getNotConfirmUseStampByAlert?refId={0}',
  getVerifiedBatch: 'alert/getverifiedbatch?refId={0}',
  getNotVerifiedBatch: 'alert/getnotverifiedbatch?refId={0}',
  getRequestVerifiedBatch: 'alert/getrequestverifiedbatch?refId={0}',
  getRequestRegainVerifiedBatch:
    'alert/getrequestregainverifiedbatch?refId={0}',
  getVerifiedGoodIssue: 'alert/getverifiedgoodissue?refId={0}',
  getNotVerifiedGoodIssue: 'alert/getnotverifiedgoodissue?refId={0}',
  getRequestVerifiedGoodIssue: 'alert/getrequestverifiedgoodissue?refId={0}',
  getRequestRegainVerifiedGoodIssue:
    'alert/getrequestregainverifiedgoodissue?refId={0}',
  getVerifiedGoodReceipt: 'alert/getverifiedgoodreceipt?refId={0}',
  getNotVerifiedGoodReceipt: 'alert/getnotverifiedgoodreceipt?refId={0}',
  getRequestVerifiedGoodReceipt:
    'alert/getrequestverifiedgoodreceipt?refId={0}',
  getRequestRegainVerifiedGoodReceipt:
    'alert/getrequestregainverifiedgoodreceipt?refId={0}',
};

const FUNCTIONS = {
  getListFunction: 'roleperminssion/getlistfunction',
};

const PRICES = {
  getListPrice: 'price/getall',
};

const VEHICLES = {
  getListVehicle: 'vehicle/getall',
  addVehicle: 'vehicle/create',
  getDetailVehicle: 'vehicle/get?id={id}',
  editVehicle: 'vehicle/update',
  deleteVehicle: 'vehicle/delete/{id}',
  getListVehicleTypeComboBox: 'vehicle/getlistvehicletype',
};

const TRANSPORTS = {
  getListTransport: 'transport/getall',
  updateLock: 'transport/lock?id={id}',
  deleteTransport: 'transport/delete/{id}',
  getDetailTransport: 'transport/get?id={id}',
};

const WAREHOUSES = {
  getListWareHouse: 'wareHouse/getall',
  addWareHouse: 'wareHouse/create',
  getDetailWareHouse: 'wareHouse/get?id={id}',
  editWareHouse: 'wareHouse/update',
  deleteWareHouse: 'wareHouse/delete/{id}',
  getAllInventory:
    'inventory/getall?page={page}&limit={limit}&wareHouseId={wareHouseId}&productType={productType}',
  getListWarehouseComboBox: 'wareHouse/getListComboBox'
};

const FACTORIES = {
  getListFactory: 'factory/getall',
  addFactory: 'factory/create',
  getDetailFactory: 'factory/get?id={id}',
  editFactory: 'factory/update',
  deleteFactory: 'factory/delete/{id}',
};

const PLANTINGZOMEGPSS = {
  getListPlantingZoneGPSBelongTo:
    'plantingzonegps/getallbelongto?plantingTypeId={0}&excludePlantingZoneId={1}&provinceId={2}',
};

const ALERTTYPES = {
  getListAlertType: 'alerttype/getall',
};

const ALERTROLES = {
  getListAlertRole: 'alertrole/getall',
  addAlertRole: 'alertrole/create',
  deleteAlertRole: 'alertrole/delete?roleId={0}',
  getListAlertRoleComboBox: 'alertrole/getallrole',
};

const CONFIG_WEBSITE = {
  getconfig: 'configwebsite/getconfig',
  get: 'configwebsite/get',
};

const REPORTS = {
  getReportStampCompany: 'report/getreportstampcompany',
  getListQuantityMaterialGroupMonth:
    'report/quantitymaterialgroupmonth?month={0}&year={1}',
  getListQuantityMaterialGroupPrecious:
    'report/quantitymaterialgroupquarter?quarter={0}&year={1}',
  getListQuantityMaterialGroupYear: 'report/quantitymaterialgroupyear?year={0}',
  getListQuantityProductByMaterialGroupMonth:
    'report/quantityproductbymaterialgroupmonth?materialGroup={0}&month={1}&year={2}',
  getListQuantityProductByMaterialGroupPrecious:
    'report/quantityproductbymaterialgroupquarter?materialGroup={0}&quarter={1}&year={2}',
  getListQuantityProductByMaterialGroupYear:
    'report/quantityproductbymaterialgroupyear?materialGroup={0}&year={1}',
  getListQuantityBatchByProductMaterialGroupMonth:
    'report/quantitybatchbyproductmaterialgroupyear?productId={0}&month={1}&year={2}',
  getListQuantityBatchByProductMaterialGroupPrecious:
    'report/quantitybatchbyproductmaterialgroupyear?productId={0}&quarter={1}&year={2}',
  getListQuantityBatchByProductMaterialGroupYear:
    'report/quantitybatchbyproductmaterialgroupyear?productId={0}&year={1}',
  getListQuantityPlantingZoneMonth:
    'report/quantityplantingzonemonth?month={0}&year={1}',
  getListQuantityPlantingZonePrecious:
    'report/quantityplantingzonequarter?quarter={0}&year={1}',
  getListQuantityPlantingZoneYear: 'report/quantityplantingzoneyear?year={0}',
  getListQuantityProductByPlantingZoneMonth:
    'report/quantityproductbyplantingzonemonth?plantingZoneId={0}&month={1}&year={2}',
  getListQuantityProductByPlantingZonePrecious:
    'report/quantityproductbyplantingzonequarter?plantingZoneId={0}&quarter={1}&year={2}',
  getListQuantityProductByPlantingZoneYear:
    'report/quantityproductbyplantingzoneyear?plantingZoneId={0}&year={1}',
  getListQuantityBatchByProductPlantingZoneMonth:
    'report/quantitybatchbyproductplantingzoneyear?productId={0}&month={1}&year={2}',
  getListQuantityBatchByProductPlantingZonePrecious:
    'report/quantitybatchbyproductplantingzoneyear?productId={0}&quarter={1}&year={2}',
  getListQuantityBatchByProductPlantingZoneYear:
    'report/quantitybatchbyproductplantingzoneyear?productId={0}&year={1}',
  getListMaterialUsePopularMonth:
    'report/getlistmaterialusepopularmonth?month={0}&year={1}',
  getListMaterialUsePopularPrecious:
    'report/getlistmaterialusepopularquarter?quarter={0}&year={1}',
  getListMaterialUsePopularYear:
    'report/getlistmaterialusepopularyear?year={0}',
  getListGoodIssueByMaterialUsePopularMonth:
    'report/getlistgoodissuebymaterialusepopularyear?materialId={0}&month={1}&year={2}',
  getListGoodIssueByMaterialUsePopularPrecious:
    'report/getlistgoodissuebymaterialusepopularquarter?materialId={0}&quarter={1}&year={2}',
  getListGoodIssueByMaterialUsePopularYear:
    'report/getlistgoodissuebymaterialusepopularyear?materialId={0}&year={1}',
  getListReportUsedStampV2: 'report/getListReportUsedStampV2?page={0}&limit={1}&startdate={2}&enddate={3}&productId={4}',
  getListReportBatchV2: 'report/getListReportBatchV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}',
  getListReportQuantityProductV2: 'report/getListReportQuantityProductV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}',
  getListReportQuantityProductByPlantingZoneV2: 'report/getListReportQuantityProductByPlantingZoneV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}&plantingZoneId={5}',
  getListReportSellV2: 'report/getListReportSellV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}&partnerId={5}',
  getListReportGoodIssueMaterialV2: 'report/getListReportGoodIssueMaterialV2?page={0}&limit={1}&fromDate={2}&toDate={3}&materialId={4}',
  getListReportGoodReceiptMaterialV2: 'report/getListReportGoodReceiptMaterialV2?page={0}&limit={1}&fromDate={2}&toDate={3}&materialId={4}',
  getInfoReportInventoryV2: 'report/getInfoReportInventoryV2',
  getListReportInventoryWarehouseProductV2: 'report/getListReportInventoryWarehouseProductV2?page={0}&limit={1}&fromDate={2}&toDate={3}&warehouseId={4}&productId={5}',
  getListReportInventoryWarehouseMaterialV2: 'report/getListReportInventoryWarehouseMaterialV2?page={0}&limit={1}&fromDate={2}&toDate={3}&warehouseId={4}&materialId={5}',
  getListReportInventoryWarehouseProductDetailV2: 'report/getListReportInventoryWarehouseProductDetailV2?page={0}&limit={1}&fromDate={2}&toDate={3}&warehouseId={4}&productId={5}',
  getListReportInventoryWarehouseMaterialDetailV2: 'report/getListReportInventoryWarehouseMaterialDetailV2?page={0}&limit={1}&fromDate={2}&toDate={3}&warehouseId={4}&materialId={5}',
  getListReportInventoryAdjustWarehouseV2: 'report/getListReportInventoryAdjustWarehouseV2?page={0}&limit={1}&fromDate={2}&toDate={3}&warehouseId={4}',
  addReportInventoryAdjustWarehouseV2: 'report/createReportInventoryAdjustWarehouseV2',
  deleteReportInventoryAdjustWarehouseV2: 'report/deleteReportInventoryAdjustWarehouseV2?id={0}',
  confirmReportInventoryAdjustWarehouseV2: 'report/confirmReportInventoryAdjustWarehouseV2?id={0}',
  unConfirmReportInventoryAdjustWarehouseV2: 'report/unConfirmReportInventoryAdjustWarehouseV2',
  getReportInventoryAdjustWarehouseV2: 'report/getReportInventoryAdjustWarehouseV2?id={0}',
  getListReportInventoryTransferWarehouseV2: 'report/getListReportInventoryTransferWarehouseV2?page={0}&limit={1}&fromDate={2}&toDate={3}',
  addReportInventoryTransferWarehouseV2: 'report/createReportInventoryTransferWarehouseV2',
  deleteReportInventoryTransferWarehouseV2: 'report/deleteReportInventoryTransferWarehouseV2?id={0}',
  confirmReportInventoryTransferWarehouseV2: 'report/confirmReportInventoryTransferWarehouseV2?id={0}',
  unConfirmReportInventoryTransferWarehouseV2: 'report/unConfirmReportInventoryTransferWarehouseV2',
  getReportInventoryTransferWarehouseV2: 'report/getReportInventoryTransferWarehouseV2?id={0}',
  confirmReportInventoryImportWarehouseV2: 'report/confirmReportInventoryImportWarehouseV2?id={0}'
};

const PRODUCTHISTORIES = {
  getListProductHistory:
    'producthistory/getlisthistory?productid={0}&page={1}&limit={2}',
};

const MATERIALHISTORIES = {
  getListMaterialHistory:
    'materialhistory/getlisthistory?materialid={0}&page={1}&limit={2}',
};

const USERPUSHNOTIFICATIONS = {
  insertPushNotification:
    'userPushNotification/insertPushNotification?pushNotificationKey={0}',
  removePushNotification:
    'userPushNotification/removePushNotification?pushNotificationKey={0}',
};

export {
  USERPUSHNOTIFICATIONS,
  MATERIALHISTORIES,
  PRODUCTHISTORIES,
  REPORTS,
  ALERTROLES,
  ALERTTYPES,
  PLANTINGZOMEGPSS,
  FACTORIES,
  WAREHOUSES,
  TRANSPORTS,
  VEHICLES,
  PRICES,
  FUNCTIONS,
  ALERTS,
  GROUPFIELDS,
  UNITS,
  SETTINGS,
  PLANTINGZOMES,
  SCANS,
  MANAGEQRS,
  SERVERS,
  DIARYS,
  LOCATIONS,
  ACCOUNTS,
  ROLES,
  MATERIALS,
  GOOD_DELIVERY,
  GOOD_RECEIVED,
  PERMISSIONS,
  PARTNERS,
  INFOCOMPANYS,
  PRODUCTS,
  FEEDBACKS,
  CONSIGNMENTS,
  MANAGEITEMS,
  REGION_DECLARATIONS,
  SET_ACCESSES,
  SET_MANIFESTS,
  INDIVIDUALS,
  CONFIG_WEBSITE,
  MATERIAL_GROUP,
};
