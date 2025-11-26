/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/pages/Profile";
import Maps from "views/pages/Maps";
import Register from "views/pages/Register";
import Login from "views/pages/Login";
import ResetPassword from "views/pages/ResetPassword";
import Tables from "views/pages/Tables";
import Icons from "views/pages/Icons";
import UserAccount from "views/pages/UserAccount";
import RoleList from "views/pages/RoleList";
import Zone from "views/pages/Zone";
import RoleZoneList from "views/pages/RoleZoneList";
import Permission from "views/pages/Permission";
import Prices from "views/pages/Prices";
import History from "views/pages/History";
import CompanyAwait from "views/pages/CompanyAwait";
// import CompanyNotComfirm from "views/pages/CompanyNotComfirm";
// import CompanyListRequestUnlock from "views/pages/CompanyListRequestUnlock";
// import NewRegBus from "views/pages/NewRegBus";
// import CompanyListRegistered from "views/pages/CompanyListRegistered";
// import CompanyListCertified from "views/pages/CompanyListCertified";
// import CompanyListExpiring from "views/pages/CompanyListExpiring";
// import CompanyListAwaitExpired from "views/pages/CompanyListAwaitExpired";
// import CompanyListRequestExtend from "views/pages/CompanyListRequestExtend";
// import CompanyListLock from "views/pages/CompanyListLock";
import StampFeeList from "views/pages/StampFeeList";
import RegisteredList from "views/pages/RegisteredList";
import StampList from "views/pages/StampList";
import StampProvide from "views/pages/StampProvide";
import FieldList from "views/pages/FieldList";
import Information from "views/pages/Information";
import Access from "views/pages/Access";
import BlogList from "views/pages/BlogList";
import NewsList from "views/pages/NewsList";
import InsertOrUpdateCompany from "views/pages/NewRegBus/InsertOrUpdate";
import MenuList from "views/pages/MenuList/";
import WebConfig from "views/pages/WebConfig/";
import TypeZoneProperty from "views/pages/TypeZoneProperty";
import CompanyReports from "views/pages/CompanyReports";
import GrowthStampReports from "views/pages/GrowthStampReports";
import SaleStampReports from "views/pages/SaleStampReports";
import SaleRegisterReports from "views/pages/SaleRegisterReports";
import PlantingZone from "views/pages/PlantingZone";
import ConfigSystem from "views/pages/ConfigSystem";
import ImportProduct from "views/pages/ImportProduct";
import ProductManagement from "views/pages/ProductManagement";
import MaterialManagement from "views/pages/MaterialManagement";
import SummaryReport from "views/pages/SummaryReport";
import ExportProduct from "views/pages/ExportProduct";
import InventoryManagement from "views/pages/InventoryManagement";
import AdjustmentManagement from "views/pages/AdjustmentManagement";
import ExportManagement from "views/pages/ExportManagement";
import ImportManagement from "views/pages/ImportManagement";
import QrCodeManagement from "views/pages/QrCodeManagement";
import BusinessInformation from "views/pages/BusinessInformation";
import StampRequestUsed from "views/pages/StampRequestUsed";
import CompanyListAwaitActivity from "views/pages/CompanyListAwaitActivity";
import MaterialGroup from "views/pages/MaterialGroup";
import ProductsGroups from "views/pages/ProductsGroups";
import CompanyAreaReports from "views/pages/CompanyAreaReports";
import ProductReports from "views/pages/ProductReports";
import Unit from "views/pages/Unit";
import Trace from "views/pages/Trace";
import Products from "views/pages/Products";
import Partner from "views/pages/Partner";
import ProductsVerify from "views/pages/ProductsVerify";
import PartnerVerify from "views/pages/PartnerVerify";
import PartnerManufactVerify from "views/pages/PartnerManufactVerify";
import PartnerTranformVerify from "views/pages/PartnerTranformVerify";
import CompanyVerify from "views/pages/CompanyVerify";
import PartnerPrint from "views/pages/PartnerPrint";
import ReportMananger from "views/pages/ReportMananger";
import ReportView from "views/pages/ReportView";
import ReportZoningProduct from "views/pages/ReportZoningProduct";
import ReportZoningCompany from "views/pages/ReportZoningCompany";
import ReportZoningPlantingZone from "views/pages/ReportZoningPlantingZone";
import ReportQuantityProduct from "views/pages/ReportQuantityProduct";
import ReportQuantityProductByZone from "views/pages/ReportQuantityProductByZone";
import ReportProductByProvice from "views/pages/ReportProductByProvice";
import ReportListCompany from "views/pages/ReportListCompany";
import LoggingInformation from "views/pages/LoggingInformation";
import DeclarationInformations from "views/pages/DeclarationInformations";
import RetrieveInformation from "views/pages/RetrieveInformation";

import { NAVBAR_ITEM } from "./helpers/constant";

var routes = [
  // Admin Example
  {
    path: "/dashboard",
    // name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/trang_chu",
    key: null,
  },
  // Admin System
  {
    path: "/tai_khoan_nguoi_dung",
    name: NAVBAR_ITEM.USER_ACCOUNT,
    icon: "ni ni-single-02 text-blue",
    component: UserAccount,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/nhom_quyen",
    name: NAVBAR_ITEM.ROLE_GROUP,
    icon: "ni ni-single-02 text-blue",
    component: RoleList,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/vung_du_lieu",
    name: NAVBAR_ITEM.DATA_ZONE,
    icon: "ni ni-chart-pie-35 text-primary",
    component: Zone,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/phan_quyen_chuc_nang",
    name: NAVBAR_ITEM.FUNCTION_ROLE,
    icon: "ni ni-chart-pie-35 text-primary",
    component: Permission,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/phan_vung_du_lieu",
    name: NAVBAR_ITEM.DATA_ROLE,
    icon: "ni ni-chart-pie-35 text-primary",
    component: RoleZoneList,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/bang_gia",
    name: NAVBAR_ITEM.PRICES,
    icon: "ni ni-single-copy-04",
    component: Prices,
    layout: "/trang_chu",
    key: 0,
  },
  {
    path: "/nhat_ky_he_thong",
    name: NAVBAR_ITEM.HISTORY,
    icon: "ni ni-calendar-grid-58",
    component: History,
    layout: "/trang_chu",
    key: 0,
  },
  // Admin List
  // {
  // 	path: "/danh_sach_moi_dang_ky",
  // 	name: NAVBAR_ITEM.NEWREGBUS,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: NewRegBus,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/them_danh_sach_moi_dang_ky/:company",
  // 	name: NAVBAR_ITEM.NEWREGBUS,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: InsertOrUpdateCompany,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/cap_nhat_danh_sach_moi_dang_ky/:id",
  // 	name: NAVBAR_ITEM.NEWREGBUS,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: InsertOrUpdateCompany,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  {
    path: "/danh_sach_dang_cho_duyet",
    name: NAVBAR_ITEM.COMPANY_AWAIT,
    icon: "ni ni-bullet-list-67 text-red",
    component: CompanyAwait,
    layout: "/trang_chu",
    key: 1,
  },
  // {
  // 	path: "/danh_sach_khong_duoc_duyet",
  // 	name: NAVBAR_ITEM.COMPANY_NOT_COMFIRM,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyNotComfirm,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_da_dang_ky",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_REGISTER,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListRegistered,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/doanh_nghiep_tieu_bieu",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_CERTIFIED,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListCertified,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_da_xac_thuc",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_ACTIVITIED,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListAwaitActivity,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_sap_het_han",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_AWAIT_EXPIRED,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListExpiring,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_cho_gia_han",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_EXPIRING,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListAwaitExpired,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_yeu_cau_mo_khoa",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_REQUEST_UNLOCK,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListRequestUnlock,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_yeu_cau_gia_han",
  // 	name: NAVBAR_ITEM.COMPANY_LIST_REQUEST_EXTEND,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListRequestExtend,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // {
  // 	path: "/danh_sach_bi_khoa",
  // 	name: NAVBAR_ITEM.COPANY_LIST_LOCK,
  // 	icon: "ni ni-bullet-list-67 text-red",
  // 	component: CompanyListLock,
  // 	layout: "/trang_chu",
  // 	key: 1,
  // },
  // Admin Categories
  {
    path: "/danh_muc_nganh_nghe",
    name: NAVBAR_ITEM.FIELD_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: FieldList,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/loai_vung_trong_va_thuoc_tinh",
    name: NAVBAR_ITEM.PLANTINGTYPE_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: TypeZoneProperty,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/vung_trong",
    name: NAVBAR_ITEM.PLANGTINGZONE_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: PlantingZone,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/quan_ly_nguyen_vat_lieu",
    name: NAVBAR_ITEM.MATERIAL_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: MaterialManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/bao_cao_tong_hop",
    name: NAVBAR_ITEM.SUMMARY_REPORTS,
    icon: "ni ni-bullet-list-67 text-blue",
    component: SummaryReport,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/quan_ly_hang_hoa",
    name: NAVBAR_ITEM.PRODUCT_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ProductManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/nhap_hang_hoa",
    name: NAVBAR_ITEM.IMPORT_PRODUCT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ImportProduct,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/xuat_hang_hoa",
    name: NAVBAR_ITEM.EXPORT_PRODUCT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ExportProduct,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/nhom_nguyen_vat_lieu",
    name: NAVBAR_ITEM.MATERIALGROUP,
    icon: "ni ni-bullet-list-67 text-blue",
    component: MaterialGroup,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/nhom_san_pham",
    name: NAVBAR_ITEM.PRODUCTGROUP,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ProductsGroups,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/don_vi_tinh",
    name: NAVBAR_ITEM.UNIT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: Unit,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/danh_muc_truy_xuat",
    name: NAVBAR_ITEM.ACCESS_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: Access,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/danh_muc_ke_khai",
    name: NAVBAR_ITEM.INFORMATION_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: Information,
    layout: "/trang_chu",
    key: 2,
  },

  {
    path: "/nhat_ky_san_pham",
    name: NAVBAR_ITEM.TRACE,
    icon: "ni ni-bullet-list-67 text-blue",
    component: Trace,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/san_pham",
    name: NAVBAR_ITEM.PRODUCTS,
    icon: "ni ni-bullet-list-67 text-blue",
    component: Products,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/ton_kho",
    name: NAVBAR_ITEM.INVENTORY_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: InventoryManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/phieu_dieu_chinh",
    name: NAVBAR_ITEM.ADJUSTMENT_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: AdjustmentManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/xuat_chuyen",
    name: NAVBAR_ITEM.EXPORT_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ExportManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/nhap_chuyen",
    name: NAVBAR_ITEM.IMPORT_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: ImportManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/xin_cap_tem",
    name: NAVBAR_ITEM.QRCODE_USED,
    icon: "ni ni-bullet-list-67 text-blue",
    component: StampRequestUsed,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/quan_ly_qr",
    name: NAVBAR_ITEM.QRCODE_MANAGEMENT,
    icon: "ni ni-bullet-list-67 text-blue",
    component: QrCodeManagement,
    layout: "/trang_chu",
    key: 2,
  },
  {
    path: "/quan_ly_thong_tin_dn",
    name: NAVBAR_ITEM.BUSINESS_INFORMATION,
    icon: "ni ni-bullet-list-67 text-blue",
    component: BusinessInformation,
    layout: "/trang_chu",
    key: 2,
  },

  // Admin Fee
  {
    path: "/thu_tien_dang_ky_su_dung",
    name: NAVBAR_ITEM.REGISTERED_FEE_LIST,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: RegisteredList,
    layout: "/trang_chu",
    key: 3,
  },
  {
    path: "/thu_tien_tem",
    name: NAVBAR_ITEM.STAMP_FEE_LIST,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: StampFeeList,
    layout: "/trang_chu",
    key: 3,
  },
  // Admin Stamp
  {
    path: "/quan_ly_dai_tem",
    name: NAVBAR_ITEM.STAMP_LIST,
    icon: "ni ni-bullet-list-67 text-blue",
    component: StampList,
    layout: "/trang_chu",
    key: 4,
  },
  {
    path: "/quan_ly_cap_phat_tem",
    name: NAVBAR_ITEM.STAMP_PROVIDE,
    icon: "ni ni-bullet-list-67 text-blue",
    component: StampProvide,
    layout: "/trang_chu",
    key: 4,
  },
  // Admin Website
  {
    path: "/web_config",
    name: NAVBAR_ITEM.CONTENT_WEBSITE,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: WebConfig,
    layout: "/trang_chu",
    key: 5,
  },
  {
    path: "/menu",
    name: NAVBAR_ITEM.MENU_LIST,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: MenuList,
    layout: "/trang_chu",
    key: 5,
  },
  {
    path: "/bai_viet",
    name: NAVBAR_ITEM.BLOG_LIST,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: BlogList,
    layout: "/trang_chu",
    key: 5,
  },
  {
    path: "/tin_tuc",
    name: NAVBAR_ITEM.NEWS_LIST,
    icon: "ni ni-calendar-grid-58 text-blue",
    component: NewsList,
    layout: "/trang_chu",
    key: 5,
  },

  // Admin Report
  {
    path: "/bao_cao_tang_truong_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_COMPANY_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: CompanyReports,
    layout: "/trang_chu",
    key: 6,
  },
  {
    path: "/bao_cao_tang_truong_tem",
    name: NAVBAR_ITEM.REPORT_STAPM_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: null,
    layout: "/trang_chu",
    key: 6,
  },

  {
    path: "/bao_cao_quy_hoach_theo_san_pham",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningProduct,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_quy_hoach_vung_theo_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_quy_hoach_vung_theo_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_quy_hoach_vung_san_xuat",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningPlantingZone,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/bao_cao_chi_tiet_san_luong_theo_san_pham",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/bao_cao_san_luong_theo_vung",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_mat_hang_theo_tinh",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_danh_sach_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_tang_truong_tien_dang_ky",
    name: NAVBAR_ITEM.REPORT_REGISTER_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: null,
    layout: "/trang_chu",
    key: 6,
  },
  {
    path: "/bao_cao_hang_hoa",
    name: NAVBAR_ITEM.REPORT_PRODUCT_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: null,
    layout: "/trang_chu",
    key: 6,
  },
  // Admin Setting System
  {
    path: "/thiet_lap_bao_cao",
    name: NAVBAR_ITEM.REPORT_MANANGER,
    icon: "ni ni-settings-gear-65",
    component: null,
    layout: "/trang_chu",
    key: 7,
  },
  {
    path: "/xem_bao_cao",
    name: NAVBAR_ITEM.REPORT_VIEW,
    icon: "ni ni-settings-gear-65",
    component: null,
    layout: "/trang_chu",
    key: 7,
  },
  {
    path: "/nhat_ky",
    name: NAVBAR_ITEM.LOGGING_INFORMATION,
    icon: "ni ni-settings-gear-65",
    component: LoggingInformation,
    layout: "/trang_chu",
    key: 12,
  },
  {
    path: "/truy_xuat_thong_tin",
    name: NAVBAR_ITEM.RETRIEVE_INFORMATION,
    icon: "ni ni-settings-gear-65",
    component: RetrieveInformation,
    layout: "/trang_chu",
    key: 12,
  },
  {
    path: "/ke_khai_thong_tin",
    name: NAVBAR_ITEM.DECLARE_INFORMATION,
    icon: "ni ni-settings-gear-65",
    component: DeclarationInformations,
    layout: "/trang_chu",
    key: 12,
  },
  // Report
  // Auth
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/nguoi_dung",
    key: null,
  },
  {
    path: "/quen_mat_khau",
    name: "ResetPassword",
    icon: "ni ni-circle-08 text-pink",
    component: ResetPassword,
    layout: "/nguoi_dung",
    key: null,
  },

  {
    path: "/bao_cao_quy_hoach_vung_theo_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_quy_hoach_vung_san_xuat",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningPlantingZone,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/bao_cao_chi_tiet_san_luong_theo_san_pham",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },
  {
    path: "/bao_cao_san_luong_theo_vung",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_mat_hang_theo_tinh",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_danh_sach_doanh_nghiep",
    name: NAVBAR_ITEM.REPORT_ZONING_PRODUCT,
    icon: "ni ni-circle-08 text-pink",
    component: ReportZoningCompany,
    layout: "/trang_chu",
    key: null,
  },

  {
    path: "/bao_cao_tang_truong_tien_dang_ky",
    name: NAVBAR_ITEM.REPORT_REGISTER_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: null,
    layout: "/trang_chu",
    key: 6,
  },
  {
    path: "/bao_cao_hang_hoa",
    name: NAVBAR_ITEM.REPORT_PRODUCT_CHART,
    icon: "ni ni-chart-bar-32 text-blue",
    component: null,
    layout: "/trang_chu",
    key: 6,
  },
  // Admin Setting System
  {
    path: "/thiet_lap_bao_cao",
    name: NAVBAR_ITEM.REPORT_MANANGER,
    icon: "ni ni-settings-gear-65",
    component: null,
    layout: "/trang_chu",
    key: 7,
  },
  {
    path: "/xem_bao_cao",
    name: NAVBAR_ITEM.REPORT_VIEW,
    icon: "ni ni-settings-gear-65",
    component: null,
    layout: "/trang_chu",
    key: 7,
  },
  // Report
  // Auth
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/nguoi_dung",
    key: null,
  },
  {
    path: "/quen_mat_khau",
    name: "ResetPassword",
    icon: "ni ni-circle-08 text-pink",
    component: ResetPassword,
    layout: "/nguoi_dung",
    key: null,
  },
];

export default routes;

const LAYOUT_HOME = "/trang_chu";
const LAYOUT_USER = "/nguoi_dung";

const routeComponents = [
  {
    layout: LAYOUT_HOME,
    url: "/dashboard",
    key: "Dashboard",
    component: Index,
  },
  { layout: LAYOUT_HOME, url: "/user-profile", key: "", component: Profile },
  { layout: LAYOUT_HOME, url: "/maps", key: "", component: Maps },
  { layout: LAYOUT_USER, url: "/register", key: "", component: Register },
  { layout: LAYOUT_USER, url: "/login", key: "", component: Login },
  { layout: LAYOUT_HOME, url: "/tables", key: "", component: Tables },
  { layout: LAYOUT_HOME, url: "/icons", key: "", component: Icons },
  { layout: LAYOUT_HOME, key: "Users", component: UserAccount },
  { layout: LAYOUT_HOME, key: "Roles", component: RoleList },
  { layout: LAYOUT_HOME, key: "Zones", component: Zone },
  { layout: LAYOUT_HOME, key: "MaterialGroups", component: MaterialGroup },
  { layout: LAYOUT_HOME, key: "ProductsGroups", component: ProductsGroups },
  { layout: LAYOUT_HOME, key: "RoleZones", component: RoleZoneList },
  { layout: LAYOUT_HOME, key: "Permissions", component: Permission },
  { layout: LAYOUT_HOME, key: "Prices", component: Prices },
  { layout: LAYOUT_HOME, key: "Logs", component: History },
  { layout: LAYOUT_HOME, key: "ConfirmingCompanies", component: CompanyAwait },
  // { layout: LAYOUT_HOME, key: 'UnconfirmedCompanies', component: CompanyNotComfirm },
  // { layout: LAYOUT_HOME, key: 'RequestUnlockCompanies', component: CompanyListRequestUnlock },
  // { layout: LAYOUT_HOME, key: 'FreshCompanies', component: NewRegBus },
  // { layout: LAYOUT_HOME, key: 'ConfirmedCompanies', component: CompanyListRegistered },
  // { layout: LAYOUT_HOME, key: 'ShowCompanies', component: CompanyListCertified },
  // { layout: LAYOUT_HOME, key: 'ConfirmedCompanies1', component: CompanyListAwaitActivity },
  // { layout: LAYOUT_HOME, key: 'ExpiringCompanies', component: CompanyListExpiring },
  // { layout: LAYOUT_HOME, key: 'ExtensionCompanies', component: CompanyListAwaitExpired },
  // { layout: LAYOUT_HOME, key: 'RequestExtendCompanies', component: CompanyListRequestExtend },
  // { layout: LAYOUT_HOME, key: 'LockingCompanies', component: CompanyListLock },
  { layout: LAYOUT_HOME, key: "StampFees", component: StampFeeList },
  { layout: LAYOUT_HOME, key: "RegisteredFees", component: RegisteredList },
  { layout: LAYOUT_HOME, key: "StampDetails", component: StampList },
  { layout: LAYOUT_HOME, key: "StampRequests", component: StampProvide },
  { layout: LAYOUT_HOME, key: "Fields", component: FieldList },
  { layout: LAYOUT_HOME, key: "Access", component: Access },
  { layout: LAYOUT_HOME, key: "Informations", component: Information },
  { layout: LAYOUT_HOME, key: "WebConfig", component: WebConfig },
  { layout: LAYOUT_HOME, key: "Blogs", component: BlogList },
  { layout: LAYOUT_HOME, key: "News", component: NewsList },
  {
    layout: LAYOUT_HOME,
    url: "/them_danh_sach_moi_dang_ky/:company",
    key: "",
    component: InsertOrUpdateCompany,
  },
  { layout: LAYOUT_HOME, key: "Menus", component: MenuList },
  { layout: LAYOUT_HOME, key: "PlantingTypes", component: TypeZoneProperty },
  {
    layout: LAYOUT_HOME,
    url: "/cap_nhat_danh_sach_moi_dang_ky/:id",
    key: "",
    component: InsertOrUpdateCompany,
  },
  { layout: LAYOUT_HOME, key: "Report1", component: CompanyReports },
  { layout: LAYOUT_HOME, key: "Report2", component: GrowthStampReports },
  { layout: LAYOUT_HOME, key: "Report3", component: SaleStampReports },
  { layout: LAYOUT_HOME, key: "Report4", component: SaleRegisterReports },
  { layout: LAYOUT_HOME, key: "PlantingZones", component: PlantingZone },
  { layout: LAYOUT_HOME, key: "Configs", component: ConfigSystem },
  { layout: LAYOUT_HOME, key: "Report8", component: CompanyAreaReports },
  { layout: LAYOUT_HOME, key: "Report9", component: ProductReports },
  { layout: LAYOUT_HOME, key: "Units", component: Unit },
  { layout: LAYOUT_HOME, key: "ProductTrace", component: Trace },
  { layout: LAYOUT_HOME, key: "Products", component: Products },
  { layout: LAYOUT_HOME, key: "VerifiedCompany", component: Partner },
  { layout: LAYOUT_HOME, key: "ProductVerified", component: ProductsVerify },
  { layout: LAYOUT_HOME, key: "SupplierVerified", component: PartnerVerify },
  {
    layout: LAYOUT_HOME,
    key: "ManufactVerified",
    component: PartnerManufactVerify,
  },
  {
    layout: LAYOUT_HOME,
    key: "TransportVerified",
    component: PartnerTranformVerify,
  },
  { layout: LAYOUT_HOME, key: "CompanyVerify", component: CompanyVerify },
  { layout: LAYOUT_HOME, key: "Printer", component: PartnerPrint },
  { layout: LAYOUT_HOME, key: "ReportMananger", component: ReportMananger },
  { layout: LAYOUT_HOME, key: "ReportView", component: ReportView },
  {
    layout: LAYOUT_HOME,
    key: "ReportZoningProduct",
    component: ReportZoningProduct,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportZoningCompany",
    component: ReportZoningCompany,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportZoningPlantingZone",
    component: ReportZoningPlantingZone,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportQuantityProduct",
    component: ReportQuantityProduct,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportQuantityProductByZone",
    component: ReportQuantityProductByZone,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportProductByProvice",
    component: ReportProductByProvice,
  },
  {
    layout: LAYOUT_HOME,
    key: "ReportListCompany",
    component: ReportListCompany,
  },
  {
    layout: LAYOUT_HOME,
    key: "LoggingInformations",
    component: LoggingInformation,
  },
  {
    layout: LAYOUT_HOME,
    key: "RetrieveInformations",
    component: RetrieveInformation,
  },
  {
    layout: LAYOUT_HOME,
    key: "DeclarationInformations",
    component: DeclarationInformations,
  },
  {
    layout: LAYOUT_HOME,
    key: "SummaryReports",
    component: SummaryReport,
  },
  {
    layout: LAYOUT_HOME,
    key: "MaterialManagements",
    component: MaterialManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "ProductManagements",
    component: ProductManagement,
  },
  { layout: LAYOUT_HOME, key: "ImportProducts", component: ImportProduct },
  { layout: LAYOUT_HOME, key: "ExportProducts", component: ExportProduct },
  {
    layout: LAYOUT_HOME,
    key: "InventoryManagements",
    component: InventoryManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "AdjustmentManagements",
    component: AdjustmentManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "ExportManagements",
    component: ExportManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "ImportManagements",
    component: ImportManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "BusinessInformations",
    component: BusinessInformation,
  },
  {
    layout: LAYOUT_HOME,
    key: "QrCodeManagements",
    component: QrCodeManagement,
  },
  {
    layout: LAYOUT_HOME,
    key: "StampRequestUseds",
    component: StampRequestUsed,
  },
];

export { routeComponents };
