import { callApi } from "utils/fetchAllData";
import {
  DISTRICT,
  PAYLOAD,
  PLANTING_TYPE,
  PROVINCE,
  WARD,
  PLANTING_ZONE,
  INFO_COMPANY,
  ACCOUNT,
  MATERIAL_MANAGEMENT,
  PRODUCT_MANAGEMENT,
  QR_MANAGEMENT,
  MATERIAL_HISTORIES,
} from "./endpoint";

export const fetchData = {
  province: {
    getAll: async () => {
      const result = await callApi("get", PROVINCE.getListProvince);
      return result?.data || [];
    },
  },

  district: {
    getByProvinceId: async (provinceId) => {
      const result = await callApi(
        "get",
        `${DISTRICT.getListDistrictByProvinceId.replace("{id}", provinceId)}`
      );
      return result?.data || [];
    },
  },

  ward: {
    getByDistrictId: async (districtId) => {
      const result = await callApi(
        "get",
        `${WARD.getListWardByDistrictId.replace("{id}", districtId)}`
      );
      return result?.data || [];
    },
  },

  plantingType: {
    getAll: async () => {
      const result = await callApi(
        "post",
        PLANTING_TYPE.getListPlantingType,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
  },

  plantingZone: {
    getAll: async () => {
      const result = await callApi(
        "post",
        PLANTING_ZONE.getListPlantingZone,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    detail: async (id) => {
      try {
        const result = await callApi(
          "get",
          `${PLANTING_ZONE.detailPlantingZone.replace("{id}", id)}`
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin Planting Zone:", error);
        return null;
      }
    },
    create: async (data) => {
      try {
        const result = await callApi(
          "post",
          PLANTING_ZONE.createPlantingZone,
          data,
          false
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi tạo Planting Zone:", error);
        return null;
      }
    },
    update: async (payload) => {
      try {
        const result = await callApi(
          "post",
          PLANTING_ZONE.updatePlantingZone,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật Planting Zone:", error);
        return null;
      }
    },
    delete: async (id) => {
      try {
        const result = await callApi(
          "delete",
          `${PLANTING_ZONE.deletePlantingZone.replace("{id}", id)}`
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi xóa Planting Zone:", error);
        return null;
      }
    },
  },

  account: {
    getCurrentCompany: async () => {
      try {
        const result = await callApi("get", ACCOUNT.getCurrentCompany);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty hiện tại:", error);
        return null;
      }
    },
  },

  infoCompany: {
    update: async (payload) => {
      try {
        const result = await callApi(
          "post",
          INFO_COMPANY.updateInfoCompany,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật InfoCompany:", error);
        return null;
      }
    },
    uploadFile: async (payload) => {
      try {
        const result = await callApi(
          "post",
          INFO_COMPANY.uploadFile,
          payload,
          true
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật uploadFile:", error);
        return null;
      }
    },
    detail: async (id) => {
      try {
        const result = await callApi(
          "get",
          `${INFO_COMPANY.detailInfoCompany.replace("{id}", id)}`
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        return null;
      }
    },
    getField: async () => {
      try {
        const result = await callApi("post", INFO_COMPANY.getFieldComboBox, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        return null;
      }
    },
    getProvinceComboBox: async () => {
      try {
        const result = await callApi(
          "get",
          INFO_COMPANY.getListProvinceComboBox
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin getProvinceComboBox:", error);
        return null;
      }
    },
    getProvinceAll: async () => {
      try {
        const result = await callApi("get", INFO_COMPANY.getListProvinceAll);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin getListProvinceAll:", error);
        return null;
      }
    },
    getListDistrictByProvinceId: async (id) => {
      try {
        const result = await callApi(
          "get",
          `${INFO_COMPANY.getListDistrictByProvinceId.replace("{id}", id)}`,
          {}
        );

        return result?.data || null;
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin getListDistrictByProvinceId:",
          error
        );
        return null;
      }
    },
    getListWardByDistrictId: async (id) => {
      try {
        const result = await callApi(
          "get",
          `${INFO_COMPANY.getListWardByDistrictId.replace("{id}", id)}`,
          {}
        );

        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin getListWardByDistrictId:", error);
        return null;
      }
    },
  },

  productManagement: {
    getAll: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListProductManagement,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListProductTypeAddComboBox: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListProductTypeAddComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListMaterialGroupComboBox: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListMaterialGroupComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListPartnerComboBox: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListPartnerComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListNationComboBox: async () => {
      const result = await callApi(
        "get",
        PRODUCT_MANAGEMENT.getListNationComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListUnitComboBox: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListUnitComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getDetail: async (id) => {
      const result = await callApi(
        "get",
        `${PRODUCT_MANAGEMENT.getDetailProduct.replace("{id}", id)}`
      );
      return result?.data || [];
    },
    getListFieldComboBox: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListFieldComboBox,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
  },

  materialManagement: {
    getAll: async () => {
      const result = await callApi(
        "post",
        MATERIAL_MANAGEMENT.getListMaterialManagement,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },

    getUnitAll: async () => {
      const result = await callApi("post", MATERIAL_MANAGEMENT.getUnitAll, {});
      return result?.data || [];
    },

    create: async (payload) => {
      try {
        const result = await callApi(
          "post",
          MATERIAL_MANAGEMENT.addMaterial,
          payload,
          false
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi tạo nguyên vật liệu:", error);
        return null;
      }
    },
    update: async (payload) => {
      try {
        const result = await callApi(
          "post",
          MATERIAL_MANAGEMENT.editMaterial, // Dùng endpoint của MATERIAL_MANAGEMENT
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật nguyên vật liệu:", error);
        return null;
      }
    },

    updateLock: async (id) => {
      const result = await callApi(
        "get",
        `${MATERIAL_MANAGEMENT.updateLock.replace("{id}", id)}`
      );
      return result?.data || [];
    },

    getDetail: async (id) => {
      const result = await callApi(
        "get",
        `${MATERIAL_MANAGEMENT.getDetailMaterial.replace("{id}", id)}`
      );
      return result?.data || [];
    },
    getGroupList: async () => {
      const result = await callApi(
        "post",
        MATERIAL_MANAGEMENT.getMaterialGroupList
      );
      return result?.data || [];
    },
    getNationList: async () => {
      const result = await callApi(
        "get",
        MATERIAL_MANAGEMENT.getNationGroupList
      );
      return result?.data || [];
    },
  },
};
