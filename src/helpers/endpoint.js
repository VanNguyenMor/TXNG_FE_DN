export const PLANTING_ZONE = {
  getListPlantingZone: "plantingzone/getall",
  detailPlantingZone: "plantingzone/get?id={id}",
  createPlantingZone: "plantingzone/create",
  updatePlantingZone: "plantingzone/update",
  deletePlantingZone: "plantingzone/delete?id={id}",
  updatePermission: "plantingzone/updatepermission",
  getListRoleByPlantingZone: "plantingzone/getlistrolebyplantingzone?id={id}",
  getListRolePlantingZone: "plantingzone/getlistroleplantingzone",
};

export const PLANTING_TYPE = {
  getListPlantingType: "plantingtype/getall",
};

export const PROVINCE = {
  getListProvince: "location/getAllProvince",
};

export const DISTRICT = {
  getListDistrictByProvinceId: "location/getdistrict?provinceID={id}",
};

export const WARD = {
  getListWardByDistrictId: "location/getward?districtID={id}",
  getListWardByProvinceId: "location/getward?provinceID={id}",
};
export const ACCOUNT = {
  getCurrentCompany: "company/getcurrent",
};
export const INFO_COMPANY = {
  detailInfoCompany: "company/get?id={id}",
  getFieldComboBox: "field/getalllevel4",
  getListProvinceComboBox: "location/getprovince",
  getListProvinceAll: "location/getallprovince",
  getListDistrictByProvinceId: "location/getdistrict?provinceID={id}",
  getListWardByDistrictId: "location/getward?districtID={id}",
  getListWardByProvinceId: "location/getward?provinceID={id}",
  updateInfoCompany: "company/update",
  uploadFile: "company/upload",
};
export const FIELD_COMPANY = {
  detailInfoCompany: "field/getallbycompanyhaveaccess",
};

export const MATERIAL_MANAGEMENT = {
  getListMaterialManagement: "material/getall",
  getMaterialGroupList: "materialgroupnext/getall",
  getDetailMaterial: "material/get?id={id}",
  getNationGroupList: "location/nation",
  editMaterial: "material/update",
  addMaterial: "material/create",
  updateLock: "material/lock?id={id}",
  deleteMaterial: "material/delete/{id}",
  getUnitAll: "unit/getall",
  getListComboBox: "material/getListComboBox",
};

export const MATERIAL_HISTORIES = {
  getListMaterialHistory:
    "materialhistory/getlisthistory?materialId={0}&page={1}&limit={2}",
};

export const PRODUCT_MANAGEMENT = {
  getListProductManagement: "product/getall",
  getListUnitComboBox: "unit/getall",
  createProduct: "product/create",
  editProduct: "product/update",
  getDetailProduct: "product/getforlist?id={id}",
  getListFieldComboBox: "field/getallbycompanylevel4",
  getListPartnerComboBox: "partner/getall",
  getListNationComboBox: "location/nation",
  getListMaterialGroup: "materialgroup/getall",
  getListProductType: "productgroup/getall",
  updateLock: "product/lock/{id}",
  deleteProduct: "product/delete/{id}",
  getListComboBox: "product/getlistcombobox",
  getAllLock: "product/getalllock",
};

export const PRODUCT_HISTORIES = {
  getListProductHistory:
    "producthistory/getlisthistory?productid={0}&page={1}&limit={2}",
};

export const QR_MANAGEMENT = {
  getListManageQRSystem: "qrmanager/getallqrcodessystem",
  getListManageQRRequest: "manageqr/getlist?page={0}&limit={1}",
  getListManageQRIncurred: "qrmanager/getallqrcodesincurred",
  getListStampRequestComboBox: "manageqr/getliststamprequestcombobox",
  addBadStamp: "badstamp/create",
  getQRHistory:
    "manageqr/getlisthistory?page={0}&limit={1}&stampRequestId={2}&fromDate={3}&toDate={4}",
  // Xử lý tem (yêu cầu hủy tem) - khớp với app mobile
  getListManageQRBad:
    "badstamp/getlist?page={0}&limit={1}&stampRequestId={2}&fromDate={3}&toDate={4}",
  getDetailBadStamp: "badstamp/get?id={0}",
  deleteManageQRBad: "badstamp/delete?id={0}",
  confirmBadStamp: "badstamp/confirm?id={0}",
  unConfirmBadStamp: "badstamp/unconfirm?id={0}",
};

export const SCANS = {
  scanQRCodePrivate: "qrcode/privatescanqr?qrCode={0}",
};

export const SUMMARY_REPORT = {
  getListReportUsedStampV2:
    "report/getListReportUsedStampV2?page={0}&limit={1}&startdate={2}&enddate={3}&productId={4}",
  getListProductComboBox: "product/getalllock",
  getListReportBatchV2:
    "report/getListReportBatchV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}",
  getListReportQuantityProductV2:
    "report/getListReportQuantityProductV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}",
  getListReportQuantityProductByPlantingZoneV2:
    "report/getListReportQuantityProductByPlantingZoneV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}&plantingZoneId={5}",
  getListReportSellV2:
    "report/getListReportSellV2?page={0}&limit={1}&fromDate={2}&toDate={3}&productId={4}&partnerId={5}",
  getListPlantingZoneComboBox: "plantingzone/getall",
  getListPartnerComboBox: "partner/getall",
};

export const CONSIGNMENTS = {
  getListConsignment: "batch/getlist",
  addConsignment: "batch/create",
  getDetailConsignment: "batch/get/{id}",
  editConsignment: "batch/update",
  deleteConsignment: "batch/delete/{id}",
  getListFieldComboBox: "batch/getfields",
  getListProductComboBox: "product/getall",
  getListDiaryComboBox: "batch/gettraces",
  getListClassifyComboBox: "batch/getbatchcategories",
  getListStampTemplate: "stampranges/getstamprange",
  getListWarehouseForUpdate: "warehouse/getall",
  getListProvinceComboBox: "location/getallprovince",
  getListNationComboBox: "location/nation",
  getListTraceHarvestForAddConsignmentComboBox: 'trace/getlistharvest',
  updateLock: "batch/lock?id={0}&warehouseId={1}",
  requireConfirm: "batch/requireconfirm?id={id}",
  confirm: "batch/requestconfirm?id={id}&warehouseId={warehouseId}",
  unConfirm:
    "batch/requestunconfirm?id={id}&reason={reason}&content1={content1}&type={type}",
};

export const STAMP_REQUEST = {
  getListStampRequest: "requestprovidestamp/getall",
  getDetailStampRequest: "requestprovidestamp/get/{id}",
  addStampRequest: "requestprovidestamp/create",
  editStampRequest: "requestprovidestamp/update",
  deleteStampRequest: "requestprovidestamp/delete/{id}",
  getListProductComboBox: "product/getall",
  getListStampTemplate: "requestprovidestamp/getliststemptemplate",
  getPriceStamp: "requestprovidestamp/getprice?quantity={quantity}",
  requestProvideStamp: "requestprovidestamp/requestprovincestamp?id={id}",
};

export const PARTNER = {
  getListPartner: "partner/getall",
  getDetailPartner: "partner/get?id={id}",
  addPartner: "partner/create",
  editPartner: "partner/update",
  deletePartner: "partner/delete/{id}",
};

export const GOOD_RECEIVED = {
  getListGoodReceived: "goodsreceivednote/getall",
  getDetailGoodReceived: "goodsreceivednote/get?id={id}",
  addGoodReceived: "goodsreceivednote/create",
  editGoodReceived: "goodsreceivednote/update",
  deleteGoodReceived: "goodsreceivednote/delete/{id}",
  lockGoodReceived: "goodsreceivednote/lock/{id}",
  requireConfirmGoodReceived: "goodsreceivednote/requireconfirm/{id}",
  requestConfirmGoodReceived: "goodsreceivednote/requestconfirm/{id}",
  requestUnConfirmGoodReceived:
    "goodsreceivednote/requestunconfirm/{id}?reason={reason}&content1={content1}",
};

export const GOOD_DELIVERY = {
  getListGoodDelivery: "goodsdeliverynote/getall",
  getDetailGoodDelivery: "goodsdeliverynote/get?id={id}",
  addGoodDelivery: "goodsdeliverynote/create",
  editGoodDelivery: "goodsdeliverynote/update",
  deleteGoodDelivery: "goodsdeliverynote/delete/{id}",
  lockGoodDelivery: "goodsdeliverynote/lock/{id}",
  requireConfirmGoodDelivery: "goodsdeliverynote/requireconfirm/{id}",
  requestConfirmGoodDelivery: "goodsdeliverynote/requestconfirm/{id}",
  requestUnConfirmGoodDelivery:
    "goodsdeliverynote/requestunconfirm/{id}?reason={reason}&content1={content1}",
  createTransportTicket: "goodsdeliverynote/createtransportticket",
  getListBatchForAddGoodDelivery: "batch/getlistforaddgooddelivery",
};

export const TRANSPORT = {
  getListTransport: "transport/getall",
  getDetailTransport: "transport/get?id={id}",
  lockTransport: "transport/lock?id={id}",
  deleteTransport: "transport/delete/{id}",
};

export const VEHICLE = {
  getListVehicle: "vehicle/getall",
  getDetailVehicle: "vehicle/get?id={id}",
  addVehicle: "vehicle/create",
  editVehicle: "vehicle/update",
  deleteVehicle: "vehicle/delete/{id}",
  getListVehicleType: "vehicle/getlistvehicletype",
};

export const COMPANY_CONFIG = {
  get: "companyconfig/get",
};

export const WAREHOUSE_MANAGEMENT = {
  getListComboBox: "warehouse/getall",
};

export const REPORT = {
  getListReportInventoryWarehouseProductV2: "report/getListReportInventoryWarehouseProductV2",
  getListReportInventoryWarehouseMaterialV2: "report/getListReportInventoryWarehouseMaterialV2",
  getListReportInventoryAdjustWarehouseV2: "report/getListReportInventoryAdjustWarehouseV2",
  getListReportInventoryTransferWarehouseV2: "report/getListReportInventoryTransferWarehouseV2",
};

export const PAYLOAD = {
  defaultPayLoad: {
    search: "",
    filter: "",
    orderBy: "",
    page: null,
    limit: null,
  },
};

export const NATIONAL_PORTAL_INTEGRATION = {
  integrationConfig:
    "NationalPortalIntegration/IntegrationConfig?companyId={companyId}&productId={productId}",
  save: "NationalPortalIntegration/Save",
  saveCongViecMappings: "NationalPortalIntegration/SaveCongViecMappings",
  syncPreview: "NationalPortalIntegration/SyncPreview",
  provinces: "NationalPortalIntegration/Provinces",
  wards: "NationalPortalIntegration/Wards?provinceIdRoot={provinceIdRoot}",
  createLocation: "NationalPortalIntegration/CreateLocation",
  locationByGln:
    "NationalPortalIntegration/LocationByGln?glnCode={glnCode}&idToChuc={idToChuc}",
  getInformSelects: "informationaccess/getgridviewv2?fieldId={fieldId}&productId={productId}",
};
