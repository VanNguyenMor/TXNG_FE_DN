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
  PRODUCT_HISTORIES,
  SCANS,
} from "./endpoint";

// Helper to extract product/material groups from API response
// Response can have different structures: .productGroups, .materialGroups, or nested .data.productGroups
const extractGroupsData = (response) => {
  if (!response) return [];
  // Try multiple paths for compatibility
  return (
    response.productGroups ||
    response.materialGroups ||
    response.data?.productGroups ||
    response.data?.materialGroups ||
    []
  );
};

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

  productHistories: {
    getListProductHistory: async (id, page, limit) => {
      const result = await callApi(
        "get",
        `${PRODUCT_HISTORIES.getListProductHistory
          .replace("{0}", id)
          .replace("{1}", page)
          .replace("{2}", limit)}`
      );
      return result?.data || [];
    },
  },

  productManagement: {
    create: async (payload) => {
      try {
        const result = await callApi(
          "post",
          PRODUCT_MANAGEMENT.createProduct,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        return null;
      }
    },
    update: async (payload) => {
      try {
        const result = await callApi(
          "post",
          PRODUCT_MANAGEMENT.editProduct,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        return null;
      }
    },
    delete: async (id) => {
      try {
        const result = await callApi(
          "delete",
          `${PRODUCT_MANAGEMENT.deleteProduct.replace("{id}", id)}`
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        return null;
      }
    },
    getAll: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListProductManagement,
        PAYLOAD.defaultPayLoad
      );
      return result?.data || [];
    },
    getListProductType: async (payload = PAYLOAD.defaultPayLoad) => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListProductType,
        payload
      );
      const groupsData = result?.data || result;
      return extractGroupsData(groupsData);
    },
    getListMaterialGroup: async () => {
      const result = await callApi(
        "post",
        PRODUCT_MANAGEMENT.getListMaterialGroup,
        PAYLOAD.defaultPayLoad
      );
      const groupsData = result?.data || result;
      return extractGroupsData(groupsData);
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
    updateLock: async (id) => {
      const result = await callApi(
        "get",
        `${PRODUCT_MANAGEMENT.updateLock.replace("{id}", id)}`
      );
      return result?.data || [];
    },
  },

  materialHistories: {
    getListMaterialHistory: async (id, page, limit) => {
      const result = await callApi(
        "get",
        `${MATERIAL_HISTORIES.getListMaterialHistory
          .replace("{0}", id)
          .replace("{1}", page)
          .replace("{2}", limit)}`
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
          MATERIAL_MANAGEMENT.editMaterial,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật nguyên vật liệu:", error);
        return null;
      }
    },

    delete: async (id) => {
      try {
        const result = await callApi(
          "delete",
          `${MATERIAL_MANAGEMENT.deleteMaterial.replace("{id}", id)}`
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi xóa nguyên vật liệu:", error);
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

  qrCodeManagement: {
    getListManageQRSystem: async (payload) => {
      try {
        const result = await callApi(
          "post",
          QR_MANAGEMENT.getListManageQRSystem,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quản lý QR System:", error);
        return null;
      }
    },
    getListManageQRUsed: async (payload) => {
      try {
        const result = await callApi(
          "post",
          QR_MANAGEMENT.getListManageQRUsed,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quản lý QR Used:", error);
        return null;
      }
    },
    getListManageQRIncurred: async (payload) => {
      try {
        const result = await callApi(
          "post",
          QR_MANAGEMENT.getListManageQRIncurred,
          payload
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quản lý QR Incurred:", error);
        return null;
      }
    },
    getListManageQRRequest: async (page = 0, limit = 10) => {
      try {
        const url = QR_MANAGEMENT.getListManageQRRequest
          .replace("{0}", page)
          .replace("{1}", limit);
        const result = await callApi("get", url);
        return result?.data || result || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quản lý QR Request:", error);
        return null;
      }
    },
  },

  scanQR: {
    scanQRCodePrivate: async (qrCode) => {
      const result = await callApi(
        "get",
        `${SCANS.scanQRCodePrivate.replace("{0}", qrCode)}`
      );
      return result?.data || [];
    },

  },
};
