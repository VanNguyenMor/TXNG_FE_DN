export const PLANTING_ZONE = {
  getListPlantingZone: "plantingzone/getall",
  detailPlantingZone: "plantingzone/get?id={id}",
  createPlantingZone: "plantingzone/create",
  updatePlantingZone: "plantingzone/update",
  deletePlantingZone: "plantingzone/delete?id={id}",
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
};

export const WAREHOUSE_MANAGEMENT = {
  getListComboBox: "warehouse/getall",
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
