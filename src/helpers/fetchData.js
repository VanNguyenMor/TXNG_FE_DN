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
  SUMMARY_REPORT,
  CONSIGNMENTS,
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
    getListStampRequestComboBox: async () => {
      try {
        const result = await callApi(
          "get",
          QR_MANAGEMENT.getListStampRequestComboBox
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách stamp request:", error);
        return null;
      }
    },
    addBadStamp: async (payload) => {
      try {
        const result = await callApi(
          "post",
          QR_MANAGEMENT.addBadStamp,
          payload,
          true
        );
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi tạo yêu cầu hủy tem:", error);
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

  summaryReport: {
    getListReportUsedStampV2: async (page, limit, startDate, endDate, productId) => {
      try {
        const endpoint = SUMMARY_REPORT.getListReportUsedStampV2
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", startDate)
          .replace("{3}", endDate)
          .replace("{4}", productId || "");
        
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo tem sử dụng:", error);
        return null;
      }
    },

    getListReportBatchV2: async (page, limit, startDate, endDate, productId) => {
      try {
        const endpoint = SUMMARY_REPORT.getListReportBatchV2
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", startDate)
          .replace("{3}", endDate)
          .replace("{4}", productId || "");
        
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo lô hàng:", error);
        return null;
      }
    },

    getListReportQuantityProductV2: async (page, limit, startDate, endDate, productId) => {
      try {
        const endpoint = SUMMARY_REPORT.getListReportQuantityProductV2
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", startDate)
          .replace("{3}", endDate)
          .replace("{4}", productId || "");
        
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo sản lượng hàng hóa:", error);
        return null;
      }
    },

    getListReportQuantityProductByPlantingZoneV2: async (page, limit, startDate, endDate, productId, plantingZoneId) => {
      try {
        const endpoint = SUMMARY_REPORT.getListReportQuantityProductByPlantingZoneV2
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", startDate)
          .replace("{3}", endDate)
          .replace("{4}", productId || "")
          .replace("{5}", plantingZoneId || "");
        
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo sản lượng theo vùng:", error);
        return null;
      }
    },

    getListReportSellV2: async (page, limit, startDate, endDate, productId, partnerId) => {
      try {
        const endpoint = SUMMARY_REPORT.getListReportSellV2
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", startDate)
          .replace("{3}", endDate)
          .replace("{4}", productId || "")
          .replace("{5}", partnerId || "");
        
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo bán hàng:", error);
        return null;
      }
    },

    getListProductComboBox: async () => {
      try {
        const result = await callApi("post", SUMMARY_REPORT.getListProductComboBox, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return null;
      }
    },

    getListPlantingZoneComboBox: async () => {
      try {
        const result = await callApi("post", SUMMARY_REPORT.getListPlantingZoneComboBox, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vùng trồng:", error);
        return null;
      }
    },

    getListPartnerComboBox: async () => {
      try {
        const result = await callApi("post", SUMMARY_REPORT.getListPartnerComboBox, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đối tác:", error);
        return null;
      }
    },
  },

  consignments: {
    getListConsignment: async (params) => {
      try {
        const result = await callApi("post", CONSIGNMENTS.getListConsignment, params);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lô hàng:", error);
        return null;
      }
    },

    getDetailConsignment: async (id) => {
      try {
        const endpoint = CONSIGNMENTS.getDetailConsignment.replace("{id}", id);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lô hàng:", error);
        return null;
      }
    },

    addConsignment: async (data) => {
      try {
        const result = await callApi("post", CONSIGNMENTS.addConsignment, data);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi thêm lô hàng:", error);
        return null;
      }
    },

    editConsignment: async (data) => {
      try {
        const result = await callApi("post", CONSIGNMENTS.editConsignment, data);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật lô hàng:", error);
        return null;
      }
    },

    deleteConsignment: async (params) => {
      try {
        const endpoint = CONSIGNMENTS.deleteConsignment.replace("{id}", params.id);
        const result = await callApi("delete", endpoint);
        return result || null;
      } catch (error) {
        console.error("Lỗi khi xóa lô hàng:", error);
        return null;
      }
    },

    getListProductComboBox: async () => {
      try {
        const result = await callApi("post", CONSIGNMENTS.getListProductComboBox, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return null;
      }
    },

    getListWarehouseForUpdate: async () => {
      try {
        const result = await callApi("post", CONSIGNMENTS.getListWarehouseForUpdate, {});
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kho hàng:", error);
        return null;
      }
    },

    getListDiaryComboBox: async () => {
      try {
        console.log("🌐 Calling API: batch/gettraces");
        const result = await callApi("get", CONSIGNMENTS.getListDiaryComboBox);
        console.log("✅ API batch/gettraces response:", result);
        // API might return nested data, try to extract array
        return result?.data?.traces || result?.data || null;
      } catch (error) {
        console.error("❌ API batch/gettraces error:", error);
        return null;
      }
    },

    getListClassifyComboBox: async () => {
      try {
        console.log("🌐 Calling API: batch/getbatchcategories");
        const result = await callApi("get", CONSIGNMENTS.getListClassifyComboBox);
        console.log("✅ API batch/getbatchcategories response:", result);
        // API returns { data: { batchCategories: [...] } }
        return result?.data?.batchCategories || result?.data || null;
      } catch (error) {
        console.error("❌ API batch/getbatchcategories error:", error);
        return null;
      }
    },

    getListStampTemplate: async () => {
      try {
        console.log("🌐 Calling API: stamptemplate/getall");
        const result = await callApi("get", CONSIGNMENTS.getListStampTemplate);
        console.log("✅ API stamptemplate/getall response:", result);
        // API might return nested data in various formats
        return result?.data?.stampTemplates || result?.data?.stamps || result?.data || null;
      } catch (error) {
        console.error("❌ API stamptemplate/getall error:", error);
        return null;
      }
    },
  },
};

