export const PLANTING_ZONE = {
  getListPlantingZone: "plantingzone/getall",
  detailPlantingZone: "plantingzone/get?id={id}",
  createPlantingZone: "plantingzone/create",
  updatePlantingZone: "plantingzone/update",
  deletePlantingZone: "plantingzone/delete?id={id}",
};

export const PLANTING_TYPE = {
  getListPlantingType: "plantingtype/getall",
  detailPlantingType: "plantingtype/get?id={id}",
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

export const MATERIAL_MANAGEMENT = {
  getListMaterialManagement: "material/getall",
  getMaterialGroupList: "materialgroupnext/getall",
  getDetailMaterial: "material/get?id={id}",
  getNationGroupList: "location/nation",
  editMaterial: "material/update",
  addMaterial: "material/create",
  updateLock: "material/lock?id={id}",
};

export const MATERIAL_HISTORIES = {
  getListMaterialHistory:
    "materialhistory/getlisthistory?materialId={0}&page={1}&limit={2}",
};

export const PRODUCT_MANAGEMENT = {
  getListProductManagement: "product/getall",
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
