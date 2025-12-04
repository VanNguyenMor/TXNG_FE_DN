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
};

export const QR_MANAGEMENT = {
  getListManageQRStamp:
    "requestprovidestamp/qrcodestampunused?page={0}&limit={1}&productID={2}",
  getListManageQRSystem: "qrmanager/getallqrcodessystem",
  getListManageQRUsed:
    "requestprovidestamp/getstampused?page={0}&limit={1}&productId={2}",
  getListManageQRIncurred: "qrmanager/getallqrcodesincurred",
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
