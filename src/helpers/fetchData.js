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
  STAMP_REQUEST,
  GOOD_RECEIVED,
  GOOD_DELIVERY,
  TRANSPORT,
  VEHICLE,
  COMPANY_CONFIG,
  PARTNER,
  WAREHOUSE_MANAGEMENT,
  REPORT,
  NATIONAL_PORTAL_INTEGRATION,
} from "./endpoint";
import { USER_LIST_ACCOUNT_LIST } from "../apis/index";

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

const normalizeNationalPortalAddressItems = (items = []) =>
  (items || [])
    .map((item) => ({
      id: String(item?.id ?? item?.Id ?? "").trim(),
      name: String(item?.name ?? item?.Name ?? "").trim(),
      idRoot: String(item?.idRoot ?? item?.IdRoot ?? "").trim(),
    }))
    .filter((item) => item.id && item.name);

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
    getByProvinceId: async (provinceId) => {
      const result = await callApi(
        "get",
        `${WARD.getListWardByProvinceId.replace("{id}", provinceId)}`
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

  zoneRole: {
    getAll: async () => {
      try {
        const result = await callApi("post", "rolezone/getall", PAYLOAD.defaultPayLoad);
        return result?.data?.zonerole || result?.data || [];
      } catch (error) {
        console.error("Loi khi lay danh sach nhom quyen:", error);
        return [];
      }
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
          `plantingzone/Get?id=${id}`
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
        return result || null;
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
        return result || null;
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
        return result || null;
      } catch (error) {
        console.error("Lỗi khi xóa Planting Zone:", error);
        return null;
      }
    },
    getListRoleByPlantingZone: async (id) => {
      try {
        const result = await callApi(
          "get",
          PLANTING_ZONE.getListRoleByPlantingZone.replace("{id}", id)
        );
        return result?.data?.plantingZoneRoles || [];
      } catch (error) {
        console.error("Lỗi khi lấy nhóm quyền của vùng sản xuất:", error);
        return [];
      }
    },
    getListRolePlantingZone: async () => {
      try {
        const result = await callApi(
          "get",
          PLANTING_ZONE.getListRolePlantingZone
        );
        return result?.data?.roles || [];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm quyền:", error);
        return [];
      }
    },
    updatePermission: async (payload) => {
      try {
        const result = await callApi(
          "put",
          PLANTING_ZONE.updatePermission,
          payload
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi phân quyền vùng sản xuất:", error);
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
        return result || null;
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
    getFieldByCompanyHaveAccess: async (payload = {}) => {
      try {
        const result = await callApi("post", "field/getallbycompanyhaveaccess", payload);
        return result?.data || [];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách field by company:", error);
        return [];
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
    getListWardByProvinceId: async (id) => {
      try {
        const result = await callApi(
          "get",
          `${INFO_COMPANY.getListWardByProvinceId.replace("{id}", id)}`,
          {}
        );

        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin getListWardByProvinceId:", error);
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
          payload,
          true
        );
        return result || null;
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
          payload,
          true
        );
        return result || null;
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
          true
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi tạo nguyên vật liệu:", error);
        return { status: false, message: error?.message || "Có lỗi xảy ra, vui lòng thử lại!" };
      }
    },
    update: async (payload) => {
      try {
        const result = await callApi(
          "post",
          MATERIAL_MANAGEMENT.editMaterial,
          payload,
          true
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi cập nhật nguyên vật liệu:", error);
        return { status: false, message: error?.message || "Có lỗi xảy ra, vui lòng thử lại!" };
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
        // Trả về cả result (data + status + message) để nơi gọi kiểm tra status
        return await callApi("post", QR_MANAGEMENT.addBadStamp, payload, true);
      } catch (error) {
        console.error("Lỗi khi tạo yêu cầu hủy tem:", error);
        return null;
      }
    },
    getQRHistory: async (
      stampRequestId,
      fromDate = "",
      toDate = "",
      page = 0,
      limit = 200
    ) => {
      try {
        const url = QR_MANAGEMENT.getQRHistory
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", stampRequestId)
          .replace("{3}", fromDate || "")
          .replace("{4}", toDate || "");
        const result = await callApi("get", url);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử QR:", error);
        return null;
      }
    },
    // Danh sách yêu cầu hủy tem của một dải tem (Xử lý tem)
    getListManageQRBad: async (
      stampRequestId,
      fromDate = "",
      toDate = "",
      page = 0,
      limit = 200
    ) => {
      try {
        const url = QR_MANAGEMENT.getListManageQRBad
          .replace("{0}", page)
          .replace("{1}", limit)
          .replace("{2}", stampRequestId)
          .replace("{3}", fromDate || "")
          .replace("{4}", toDate || "");
        const result = await callApi("get", url);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu hủy tem:", error);
        return null;
      }
    },
    getDetailBadStamp: async (id) => {
      try {
        const url = QR_MANAGEMENT.getDetailBadStamp.replace("{0}", id);
        const result = await callApi("get", url);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết yêu cầu hủy tem:", error);
        return null;
      }
    },
    deleteManageQRBad: async (id) => {
      try {
        const url = QR_MANAGEMENT.deleteManageQRBad.replace("{0}", id);
        return await callApi("delete", url);
      } catch (error) {
        console.error("Lỗi khi xóa yêu cầu hủy tem:", error);
        return null;
      }
    },
    confirmBadStamp: async (id) => {
      try {
        const url = QR_MANAGEMENT.confirmBadStamp.replace("{0}", id);
        return await callApi("put", url);
      } catch (error) {
        console.error("Lỗi khi duyệt hủy tem:", error);
        return null;
      }
    },
    unConfirmBadStamp: async (id) => {
      try {
        const url = QR_MANAGEMENT.unConfirmBadStamp.replace("{0}", id);
        return await callApi("put", url);
      } catch (error) {
        console.error("Lỗi khi không duyệt hủy tem:", error);
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
        if(result && result.status === 200){
          return result
        }
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi thêm lô hàng:", error);
        return null;
      }
    },

    editConsignment: async (data) => {
      try {
        const result = await callApi("post", CONSIGNMENTS.editConsignment, data);
        if(result && result.status === 200){
          return result
        }
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
        // BE trả về { data: { wareHouses: [...] } }
        return result?.data?.wareHouses || result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kho hàng:", error);
        return null;
      }
    },

    // Khoá lô hàng (gán vào kho) - PUT batch/lock?id={0}&warehouseId={1}
    updateLock: async (id, warehouseId) => {
      try {
        const endpoint = CONSIGNMENTS.updateLock
          .replace("{0}", id)
          .replace("{1}", warehouseId);
        const result = await callApi("put", endpoint, { id, warehouseId });
        return result || null;
      } catch (error) {
        console.error("Lỗi khi khoá lô hàng:", error);
        return null;
      }
    },

    getListDiaryComboBox: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListDiaryComboBox);
        return result?.data?.traces || result?.data || null;
      } catch (error) {
        return null;
      }
    },

    // Danh sách tỉnh/thành (giống mobile: location/getallprovince)
    getListProvinceComboBox: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListProvinceComboBox);
        return result?.data?.provinces || result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
        return null;
      }
    },

    // Danh sách nước (giống mobile: location/nation)
    getListNationComboBox: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListNationComboBox);
        return result?.data?.nations || result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nước:", error);
        return null;
      }
    },

    getListTraceHarvestForAddConsignmentComboBox: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListTraceHarvestForAddConsignmentComboBox);
        return result?.data?.traces || result?.data || null;
      } catch (error) {
        return null;
      }
    },

    getListClassifyComboBox: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListClassifyComboBox);
        return result?.data?.batchCategories || result?.data || null;
      } catch (error) {
        return null;
      }
    },

    getListStampTemplate: async () => {
      try {
        const result = await callApi("get", CONSIGNMENTS.getListStampTemplate);
        return result?.data?.stampTemplates || result?.data?.stamps || result?.data || null;
      } catch (error) {
        return null;
      }
    },
  },

  stampRequest: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", STAMP_REQUEST.getListStampRequest, payload);
        return result?.data || null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = STAMP_REQUEST.getDetailStampRequest.replace("{id}", id);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        return null;
      }
    },

    add: async (payload) => {
      try {
        const result = await callApi("post", STAMP_REQUEST.addStampRequest, payload);
        return result;
      } catch (error) {
        throw error;
      }
    },

    addFormData: async (formData) => {
      try {
        const result = await callApi("post", STAMP_REQUEST.addStampRequest, formData, true);
        return result;
      } catch (error) {
        throw error;
      }
    },

    edit: async (payload) => {
      try {
        const result = await callApi("post", STAMP_REQUEST.editStampRequest, payload);
        return result;
      } catch (error) {
        throw error;
      }
    },

    editFormData: async (formData) => {
      try {
        const result = await callApi("post", STAMP_REQUEST.editStampRequest, formData, true);
        return result;
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = STAMP_REQUEST.deleteStampRequest.replace("{id}", id);
        const result = await callApi("delete", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },

    getListProduct: async () => {
      try {
        const result = await callApi("get", STAMP_REQUEST.getListProductComboBox);
        return result?.data || null;
      } catch (error) {
        return null;
      }
    },

    getListStampTemplate: async () => {
      try {
        const result = await callApi("post", STAMP_REQUEST.getListStampTemplate, {});
        
        const data = result?.data || null;
        
        return data;
      } catch (error) {
        console.error("❌ Error in getListStampTemplate:", error);
        return null;
      }
    },
  },

  goodReceived: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", GOOD_RECEIVED.getListGoodReceived, payload);
        return result || null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = GOOD_RECEIVED.getDetailGoodReceived.replace("{id}", id);
        const result = await callApi("get", endpoint);
        // Handle nested data structure: res.data.data.goodsReceipt
        if (result?.data?.data?.goodsReceipt) {
          return result.data.data;
        } else if (result?.data?.goodsReceipt) {
          return result.data;
        } else if (result?.goodsReceipt) {
          return result;
        }
        return result?.data || null;
      } catch (error) {
        console.error("❌ Error fetching good received detail:", error);
        return null;
      }
    },

    add: async (payload) => {
      try {
        const result = await callApi("post", GOOD_RECEIVED.addGoodReceived, payload, true);
        return result;
      } catch (error) {
        throw error;
      }
    },

    edit: async (payload) => {
      try {
        const result = await callApi("post", GOOD_RECEIVED.editGoodReceived, payload, true);
        return result;
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = GOOD_RECEIVED.deleteGoodReceived.replace("{id}", id);
        const result = await callApi("delete", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },

    lock: async (id) => {
      try {
        const endpoint = GOOD_RECEIVED.lockGoodReceived.replace("{id}", id);
        const result = await callApi("put", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },

    requireConfirm: async (id) => {
      try {
        const endpoint = GOOD_RECEIVED.requireConfirmGoodReceived.replace(
          "{id}",
          id
        );
        const result = await callApi("put", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },

    requestConfirm: async (id) => {
      try {
        const endpoint = GOOD_RECEIVED.requestConfirmGoodReceived.replace(
          "{id}",
          id
        );
        const result = await callApi("put", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },

    requestUnConfirm: async (id, reason, content1) => {
      try {
        const endpoint = GOOD_RECEIVED.requestUnConfirmGoodReceived
          .replace("{id}", id)
          .replace("{reason}", encodeURIComponent(reason || ""))
          .replace("{content1}", encodeURIComponent(content1 || ""));
        const result = await callApi("put", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },
  },

  goodDelivery: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", GOOD_DELIVERY.getListGoodDelivery, payload);
        return result || null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = GOOD_DELIVERY.getDetailGoodDelivery.replace("{id}", id);
        const result = await callApi("get", endpoint);
        // Handle nested data structure: res.data.data.goodsDelivery
        if (result?.data?.data?.goodsDelivery) {
          return result.data.data;
        } else if (result?.data?.goodsDelivery) {
          return result.data;
        } else if (result?.goodsDelivery) {
          return result;
        }
        return result?.data || null;
      } catch (error) {
        console.error("❌ Error fetching good delivery detail:", error);
        return null;
      }
    },

    add: async (payload) => {
      try {
        return await callApi("post", GOOD_DELIVERY.addGoodDelivery, payload, true);
      } catch (error) {
        throw error;
      }
    },

    edit: async (payload) => {
      try {
        return await callApi("post", GOOD_DELIVERY.editGoodDelivery, payload, true);
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = GOOD_DELIVERY.deleteGoodDelivery.replace("{id}", id);
        return await callApi("delete", endpoint);
      } catch (error) {
        throw error;
      }
    },

    lock: async (id) => {
      try {
        const endpoint = GOOD_DELIVERY.lockGoodDelivery.replace("{id}", id);
        return await callApi("put", endpoint);
      } catch (error) {
        throw error;
      }
    },

    requireConfirm: async (id) => {
      try {
        const endpoint = GOOD_DELIVERY.requireConfirmGoodDelivery.replace("{id}", id);
        return await callApi("put", endpoint);
      } catch (error) {
        throw error;
      }
    },

    requestConfirm: async (id) => {
      try {
        const endpoint = GOOD_DELIVERY.requestConfirmGoodDelivery.replace("{id}", id);
        return await callApi("put", endpoint);
      } catch (error) {
        throw error;
      }
    },

    requestUnConfirm: async (id, reason, content1) => {
      try {
        const endpoint = GOOD_DELIVERY.requestUnConfirmGoodDelivery
          .replace("{id}", id)
          .replace("{reason}", encodeURIComponent(reason || ""))
          .replace("{content1}", encodeURIComponent(content1 || ""));
        return await callApi("put", endpoint);
      } catch (error) {
        throw error;
      }
    },

    // Tạo vận đơn từ phiếu xuất đã duyệt (multipart/form-data)
    createTransportTicket: async (payload) => {
      try {
        return await callApi("post", GOOD_DELIVERY.createTransportTicket, payload, true);
      } catch (error) {
        throw error;
      }
    },

    getListBatch: async (payload = {}) => {
      try {
        const result = await callApi(
          "post",
          GOOD_DELIVERY.getListBatchForAddGoodDelivery,
          payload
        );
        return result?.data || result || null;
      } catch (error) {
        return null;
      }
    },
  },

  transport: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", TRANSPORT.getListTransport, payload);
        return result || null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = TRANSPORT.getDetailTransport.replace("{id}", id);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("❌ Error fetching transport detail:", error);
        return null;
      }
    },

    lock: async (id) => {
      try {
        const endpoint = TRANSPORT.lockTransport.replace("{id}", id);
        return await callApi("get", endpoint);
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = TRANSPORT.deleteTransport.replace("{id}", id);
        return await callApi("delete", endpoint);
      } catch (error) {
        throw error;
      }
    },
  },

  vehicle: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", VEHICLE.getListVehicle, payload);
        return result || null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = VEHICLE.getDetailVehicle.replace("{id}", id);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("❌ Error fetching vehicle detail:", error);
        return null;
      }
    },

    add: async (payload) => {
      try {
        return await callApi("post", VEHICLE.addVehicle, payload, true);
      } catch (error) {
        throw error;
      }
    },

    edit: async (payload) => {
      try {
        return await callApi("post", VEHICLE.editVehicle, payload, true);
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = VEHICLE.deleteVehicle.replace("{id}", id);
        return await callApi("delete", endpoint);
      } catch (error) {
        throw error;
      }
    },

    getListVehicleType: async (payload = {}) => {
      try {
        const result = await callApi("post", VEHICLE.getListVehicleType, payload);
        return result?.data || result || null;
      } catch (error) {
        return null;
      }
    },
  },

  companyConfig: {
    get: async () => {
      try {
        const result = await callApi("get", COMPANY_CONFIG.get);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy cấu hình công ty:", error);
        return null;
      }
    },
  },

  partner: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", PARTNER.getListPartner, payload);
        if (result && result.data && result.data.partners) {
          return result.data.partners;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },

    getDetail: async (id) => {
      try {
        const endpoint = PARTNER.getDetailPartner.replace("{id}", id);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        return null;
      }
    },

    add: async (payload) => {
      try {
        const result = await callApi("post", PARTNER.addPartner, payload);
        return result;
      } catch (error) {
        throw error;
      }
    },

    edit: async (payload) => {
      try {
        const result = await callApi("post", PARTNER.editPartner, payload);
        return result;
      } catch (error) {
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const endpoint = PARTNER.deletePartner.replace("{id}", id);
        const result = await callApi("delete", endpoint);
        return result;
      } catch (error) {
        throw error;
      }
    },
  },

  user: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", USER_LIST_ACCOUNT_LIST, payload);
        if (result && result.data && result.data.users) {
          return result.data.users;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  },

  material: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", MATERIAL_MANAGEMENT.getMaterialGroupList, payload);
        if (result && result.data && result.data.materialGroups) {
          return result.data.materialGroups;
        }
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    getListComboBox: async (payload = {}) => {
      try {
        const result = await callApi("get", MATERIAL_MANAGEMENT.getListComboBox, payload);
        if (result && result.data && result.data.materials) {
          return result.data.materials;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  },

  product: {
    getListComboBox: async (payload = {}) => {
      try {
        const result = await callApi("get", PRODUCT_MANAGEMENT.getListComboBox, payload);
        if (result && result.data && result.data.products) {
          return result.data.products;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    getAllLock: async (payload = {}) => {
      try {
        const result = await callApi("post", PRODUCT_MANAGEMENT.getAllLock, payload);

        // Prefer explicit structure: { status, message, data: { products: [...] } }
        if (result && result.data && result.data.data && Array.isArray(result.data.data.products)) {
          return result.data.data.products;
        }
        // Sometimes API may be { data: { products: [...] } } directly
        if (result && result.data && Array.isArray(result.data.products)) {
          return result.data.products;
        }
        // Or API may return array directly in data
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        }
        // Or full result is already an array
        if (Array.isArray(result)) {
          return result;
        }
        return [];
      } catch (error) {
        console.error("Error fetching products with lock:", error);
        return [];
      }
    },
  },

  warehouse: {
    getList: async (payload = {}) => {
      try {
        const result = await callApi("post", WAREHOUSE_MANAGEMENT.getListComboBox, payload);
        if (result && result.data && result.data.wareHouses) {
          return result.data.wareHouses;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    getListComboBox: async (payload = {}) => {
      try {
        const result = await callApi("post", WAREHOUSE_MANAGEMENT.getListComboBox, payload);
        if (result && result.data && result.data.wareHouses) {
          return result.data.wareHouses;
        }
        if (result && Array.isArray(result)) {
          return result;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  },

  report: {
    getListReportInventoryWarehouseProductV2: async (payload) => {
      try {
        const result = await callApi("get", REPORT.getListReportInventoryWarehouseProductV2, payload);
        return result || null;
      } catch (error) {
        console.error("❌ Error in getListReportInventoryWarehouseProductV2:", error);
        return null;
      }
    },
    getListReportInventoryWarehouseMaterialV2: async (payload) => {
      try {
        const result = await callApi("get", REPORT.getListReportInventoryWarehouseMaterialV2, payload);
        return result || null;
      } catch (error) {
        console.error("❌ Error in getListReportInventoryWarehouseMaterialV2:", error);
        return null;
      }
    },
    getListReportInventoryAdjustWarehouseV2: async (payload) => {
      try {
        const result = await callApi(
          "get",
          REPORT.getListReportInventoryAdjustWarehouseV2,
          payload
        );
        return result || null;
      } catch (error) {
        console.error(
          "❌ Error in getListReportInventoryAdjustWarehouseV2:",
          error
        );
        return null;
      }
    },
    getListReportInventoryTransferWarehouseV2: async (payload) => {
      try {
        const result = await callApi(
          "get",
          REPORT.getListReportInventoryTransferWarehouseV2,
          payload
        );
        return result || null;
      } catch (error) {
        console.error(
          "❌ Error in getListReportInventoryTransferWarehouseV2:",
          error
        );
        return null;
      }
    },
  },

  nationalPortalIntegration: {
    normalizeAddressItems: normalizeNationalPortalAddressItems,
    save: async (payload) => {
      try {
        const result = await callApi(
          "post",
          NATIONAL_PORTAL_INTEGRATION.save,
          payload
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi lưu cấu hình TXNG:", error);
        return null;
      }
    },
    saveCongViecMappings: async (payload) => {
      try {
        const result = await callApi(
          "post",
          NATIONAL_PORTAL_INTEGRATION.saveCongViecMappings,
          payload
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi lưu map công việc:", error);
        return null;
      }
    },
    syncPreview: async (payload) => {
      try {
        const result = await callApi(
          "post",
          NATIONAL_PORTAL_INTEGRATION.syncPreview,
          payload
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi đồng bộ thông tin cổng:", error);
        return null;
      }
    },
    getConfig: async ({ companyId, productId, fieldId }) => {
      if (!companyId || !productId) {
        return null;
      }

      try {
        let endpoint = NATIONAL_PORTAL_INTEGRATION.integrationConfig
          .replace("{companyId}", encodeURIComponent(String(companyId)))
          .replace("{productId}", encodeURIComponent(String(productId)));

        if (fieldId) {
          endpoint += `&fieldId=${encodeURIComponent(String(fieldId))}`;
        }

        const result = await callApi("get", endpoint);
        return result || null;
      } catch (error) {
        console.error("Lỗi khi lấy cấu hình đấu nối:", error);
        return null;
      }
    },
    getProvinces: async () => {
      try {
        const result = await callApi("get", NATIONAL_PORTAL_INTEGRATION.provinces);
        return normalizeNationalPortalAddressItems(result?.data);
      } catch (error) {
        console.error("Lỗi khi lấy tỉnh/thành cổng:", error);
        return [];
      }
    },
    getWards: async (provinceIdRoot) => {
      if (!provinceIdRoot) {
        return [];
      }

      try {
        const endpoint = NATIONAL_PORTAL_INTEGRATION.wards.replace(
          "{provinceIdRoot}",
          encodeURIComponent(String(provinceIdRoot))
        );
        const result = await callApi("get", endpoint);
        return normalizeNationalPortalAddressItems(result?.data);
      } catch (error) {
        console.error("Lỗi khi lấy phường/xã cổng:", error);
        return [];
      }
    },
    createLocation: async (payload) => {
      try {
        const result = await callApi(
          "post",
          NATIONAL_PORTAL_INTEGRATION.createLocation,
          payload
        );
        return result || null;
      } catch (error) {
        console.error("Lỗi khi tạo vùng trồng trên cổng:", error);
        return null;
      }
    },
    getLocationByGln: async ({ glnCode, idToChuc }) => {
      if (!glnCode) {
        return null;
      }

      try {
        const endpoint = NATIONAL_PORTAL_INTEGRATION.locationByGln
          .replace("{glnCode}", encodeURIComponent(String(glnCode)))
          .replace("{idToChuc}", encodeURIComponent(String(idToChuc || "")));
        const result = await callApi("get", endpoint);
        return result || null;
      } catch (error) {
        console.error("Lỗi khi lấy vùng trồng theo GLN:", error);
        return null;
      }
    },
    getInformSelects: async (fieldId, productId) => {
      try {
        const endpoint = NATIONAL_PORTAL_INTEGRATION.getInformSelects
          .replace("{fieldId}", fieldId)
          .replace("{productId}", productId);
        const result = await callApi("get", endpoint);
        return result?.data || null;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kê khai:", error);
        return null;
      }
    },
  },
};
