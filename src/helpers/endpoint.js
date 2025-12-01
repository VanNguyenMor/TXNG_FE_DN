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
