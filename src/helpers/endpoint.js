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
};

export const FIELD_COMPANY = {
  detailInfoCompany: "field/getallbycompanyhaveaccess",
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
