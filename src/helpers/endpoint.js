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

<<<<<<< HEAD
export const CONSIGNMENTS = {
  getListConsignment: "batch/getlist",
  addConsignment: "batch/create",
  getDetailConsignment: "batch/get/{id}",
  editConsignment: "batch/update",
  deleteConsignment: "batch/delete/{id}",
  getListFieldComboBox: "batch/getfields",
  getListProductComboBox: "product/getall",
  getListPlantingZoneComboBox: "plantingzone/getall",
  getListUnitComboBox: "unit/getall",
  updateLock: "batch/lock?id={0}&warehouseId={1}",
  getListReportConsignmentDetail: "batch/get/{id}",
  getListReportConsignment: "batch/getlist",
  getListDiaryComboBox: "batch/gettraces",
  getListWarehouseForUpdate: "warehouse/getall",
  getListTraceHarvestForAddConsignment: "trace/getlistharvest",
  getItemNameByTraceInform: "item/getitemnamebytraceinform?traceInformId={0}",
  getUnitNameByTraceInform: "unit/getunitnamebytraceinform?traceInformId={0}",
  checkStampIDValid: "stamplist/checkstampidvalid?stampid={0}&productid={1}",
  getStampRange: "stampranges/getstamprange",
  requireConfirm: "batch/requireconfirm?id={id}",
  confirm: "batch/requestconfirm?id={id}&warehouseId={warehouseId}",
  checkValidIdStamp: "qrcode/checkvalididstamp",
  unConfirm: "batch/requestunconfirm?id={id}&reason={reason}&content1={content1}&type={type}",
  getBatchCategories: "batch/getbatchcategories",
  updateConsignment: "batch/update",
  getListNationComboBox: "location/nation",
  getListProvinceComboBox: "location/getallprovince",
=======
export const BATCH = {
  getListConsignment: "batch/getlist",
  getListTraceComboBox: "batch/gettraces",
  getBatchCategories: "batch/getbatchcategories",
  getStampRange: "stampranges/getstamprange",
  getListWarehouseForUpdate: "warehouse/getall",
  getProvinceComboBox: "location/getallprovince",
  getNationComboBox: "location/nation",
  createBatch: "batch/create",
  updateBatch: "batch/update",
  deleteBatch: "batch/delete/{id}",
  lockBatch: "batch/lock",
>>>>>>> d7d300a (init)
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
