import {
    DOMAIN,
    API,
    AREA,
    USER,
    ROLE,
    PRICE,
    ZONE,
    LOCATION,
    LOG,
    COMPANY,
    FIELD,
    INFORMATION,
    ACCESS,
    ZONE_ROLE,
    PERMISSION,
    REGISTEREDFEE,
    STAMPFEE,
    BLOG,
    MENU,
    NEWS,
    STAMP,
    STAMPPROVIDE,
    PLANTINGTYPE,
    DASHBOARD,
    CONFIG,
    MATERIAL_GROUP,
    TYPE_ZONE_PROPERTY,
    COMPANY_REPORT,
    GROWTH_STAMP_REPORT,
    SALE_REGISTER_REPORT,
    SALE_STAMP_REPORT,
    PLANTING_ZONE,
    CONFIG_WEBSITE,
    PRODUCT_GROUP,
    PRODUCT_REPORT,
    UNIT,
    STAMPTEMPLATE,
    TRACE,
    PRODUCTS,
    PARTNER,
    TRANSPORTATION,
    FIELD_TYPE,
    REPORTSP,
    REPORTSP_MANGER,
    REPORTADMINV2
} from "../services/Common";

// FIELD TYPE API
export const FIELD_TYPE_LIST = DOMAIN + API + FIELD_TYPE + 'getall';

// USER API
export const USER_LOGIN = DOMAIN + API + USER + 'login';
export const USER_LOGOUT = DOMAIN + API + USER + 'logout';
export const USER_LIST_ACCOUNT_LIST = DOMAIN + API + USER + 'getall';
export const USER_GET_INFO = DOMAIN + API + USER + 'get/';
export const USER_UPDATE_INFO = DOMAIN + API + USER + 'update';
export const USER_CREATE_INFO = DOMAIN + API + USER + 'create';
export const USER_CREATE_INFO_PRINTER = DOMAIN + API + USER + 'CreatePrinter';
export const USER_DELETE_INFO = DOMAIN + API + USER + 'delete/';
export const USER_SEND_FORGOT_PASSWORD = DOMAIN + API + USER + 'sendforgotpassword';
export const USER_CHECK_FORGOT_PASSWORD = DOMAIN + API + USER + 'checkforgotpassword';
export const USER_CHANGE_PASS_FORGOEt_PASSWORD = DOMAIN + API + USER + 'changepassforforgotpassword';
export const USER_UPDATE_ME = DOMAIN + API + USER + 'updateme';
export const USER_CHANGE_PASSWORD = DOMAIN + API + USER + 'changepassword';

// ROLE API
export const ROLE_LIST = DOMAIN + API + ROLE + 'getall';
export const ROLE_LIST_BY_ID = DOMAIN + API + ROLE + 'get/';
export const ROLE_CREATE_NEW = DOMAIN + API + ROLE + 'create';
export const ROLE_UPDATE_INFO = DOMAIN + API + ROLE + 'update';
export const ROLE_DELETE = DOMAIN + API + ROLE + 'delete/';

// PRICES API
export const PRICE_LIST = DOMAIN + API + PRICE + 'getall';
export const PRICE_GET_INFO = DOMAIN + API + PRICE + 'get/';
export const PRICE_CREATE_NEW = DOMAIN + API + PRICE + 'create';
export const PRICE_UPDATE_INFO = DOMAIN + API + PRICE + 'update';
export const PRICE_DELETE = DOMAIN + API + PRICE + 'delete/';

// ZONE API
export const ZONE_LIST = DOMAIN + API + ZONE + 'getall';
export const ZONE_LIST_BY_ID = DOMAIN + API + ZONE + 'get/';
export const CREATE_ZONE = DOMAIN + API + ZONE + 'create';
export const UPDATE_ZONE = DOMAIN + API + ZONE + 'update';
export const DELETE_ZONE = DOMAIN + API + ZONE + 'delete/';

// ZONE ROLE API
export const ZONE_ROLE_LIST = DOMAIN + API + ZONE_ROLE + 'getall';

// LOCATION API
export const GET_ALL_PROVINCE = DOMAIN + API + LOCATION + 'getprovince';
export const GET_DISTRICT_BY_ROLE = DOMAIN + API + LOCATION + 'getdistrictsbyrole';
export const GET_WARD = DOMAIN + API + LOCATION + 'getwardsbyrole?districtId=';

//LOG API
export const LOG_LIST = DOMAIN + API + LOG + 'getallbydate';

//COMPANY API
export const COMPANY_GET_ALL_COMPANY = DOMAIN + API + COMPANY + 'GetAllCompaniesForProvince';
export const COMPANY_GET_DETAILS = DOMAIN + API + COMPANY + 'get?id=';
export const COMPANY_GET_FILEUPDATE = DOMAIN + API + COMPANY + 'getfileupdate?companyId=';
export const COMPANY_LIST = DOMAIN + API + COMPANY + 'getlistnewlysignup';
export const COMPANY_GET_LIST_CERTIFIED = DOMAIN + API + COMPANY + 'getlistcertified';
export const CREATE_COMPANY = DOMAIN + API + COMPANY + 'create';
export const DELETE_COMPANY = DOMAIN + API + COMPANY + 'delete?id=';
export const COMPANY_AWAIT = DOMAIN + API + COMPANY + 'getlistawaitcomfirm';
export const COMPANY_COMFIRM = DOMAIN + API + COMPANY + 'comfirm?id=';
export const COMPANY_UNCOMFIRM = DOMAIN + API + COMPANY + 'uncomfirm';
export const COMPANY_NOT_COMFIRM = DOMAIN + API + COMPANY + 'getlistuncomfirm';
export const COMPANY_LIST_REGISTERED = DOMAIN + API + COMPANY + 'getlistregistered';
export const COMPANY_VERIFY = DOMAIN + API + COMPANY + 'verify?id=';
export const COMPANY_GET_LIST_AWAIT_EXPIRED = DOMAIN + API + COMPANY + 'getlistexpiring';
export const COMPANY_GET_LIST_EXPIRING = DOMAIN + API + COMPANY + 'getlistawaitextend';
export const COMPANY_GET_LIST_LOCK = DOMAIN + API + COMPANY + 'getlistlock';
export const COMPANY_EXTEND = DOMAIN + API + COMPANY + 'extend';
export const COMPANY_LOCK = DOMAIN + API + COMPANY + 'lock?id=';
export const COMPANY_UNLOCK = DOMAIN + API + COMPANY + 'unlock?id=';
export const COMPANY_GET_LIST_REQUEST_EXTEND = DOMAIN + API + COMPANY + 'getlistrequestextend';
export const COMPANY_COMFIRM_REQUEST_EXTEND = DOMAIN + API + COMPANY + 'comfirmrequestextend';
export const COMPANY_UNCOMFIRM_REQUEST_EXTEND = DOMAIN + API + COMPANY + 'uncomfirmrequestextend';
export const COMPANY_GET_LIST_REQUEST_UNLOCK = DOMAIN + API + COMPANY + 'getlistrequestunlock';
export const COMPANY_COMFIRM_REQUEST_UNLOCK = DOMAIN + API + COMPANY + 'comfirmrequestunlock?id=';
export const COMPANY_UNCOMFIRM_REQUEST_UNLOCK = DOMAIN + API + COMPANY + 'uncomfirmrequestunlock';

export const COMPANY_LIST_VERIFY = DOMAIN + API + COMPANY + 'getallverify';
export const COMPANY_VERIFY_IMAGE = DOMAIN + API + COMPANY + 'verifyimage?id=';
export const COMPANY_UPLOAD_VERIFY = DOMAIN + API + COMPANY + 'uploadverifiedfiles';
export const COMPANY_DELETE_UPLOAD_VERIFY = DOMAIN + API + COMPANY + 'deleteverifiedfiles?id=';

// FIELD API
export const FIELD_LIST = DOMAIN + API + FIELD + 'getall';
export const FIELD_CREATE = DOMAIN + API + FIELD + 'create';
export const FIELD_UPDATE = DOMAIN + API + FIELD + 'update';
export const FIELD_DELETE = DOMAIN + API + FIELD + 'delete?id=';
export const FIELD_LOCK = DOMAIN + API + FIELD + 'lock?id=';
export const FIELD_CHILDREN_END_LIST = DOMAIN + API + FIELD + 'getallchildrenend';
export const FIELD_HAVE_ACCESS_LIST = DOMAIN + API + FIELD + 'getallhaveaccess';
export const FIELD_BY_COMPANY_FIELD_LIST = DOMAIN + API + FIELD + 'getallbycompanyfield';
export const FIELD_MIN_LEVEL_LIST = DOMAIN + API + FIELD + 'getallminlevel';
export const FIELD_BY_PRODUCTS_LIST = DOMAIN + API + FIELD + 'GetAllByProducts';

// INFORMATION API
export const INFORMATION_LIST = DOMAIN + API + INFORMATION + 'getall';
export const INFORMATION_LIST_BY_ID = DOMAIN + API + INFORMATION + 'get/';
export const INFORMATION_CREATE = DOMAIN + API + INFORMATION + 'create';
export const INFORMATION_UPDATE = DOMAIN + API + INFORMATION + 'update';
export const INFORMATION_DELETE = DOMAIN + API + INFORMATION + 'delete/';

// ACCESS API
export const ACCESS_LIST = DOMAIN + API + ACCESS + 'getall';
export const ACCESS_LIST_BY_ID = DOMAIN + API + ACCESS + 'get/';
export const ACCESS_CREATE = DOMAIN + API + ACCESS + 'create';
export const ACCESS_UPDATE = DOMAIN + API + ACCESS + 'update';
export const ACCESS_DELETE = DOMAIN + API + ACCESS + 'delete/';

// PERMISSION
export const GET_PERMISSION_LIST_BY_ID = DOMAIN + API + PERMISSION + 'getgridview/';
export const UPDATE_PERMISSION = DOMAIN + API + PERMISSION + 'checkfunc';

//REGISTEREDFEE
export const REGISTERED_FEE_LIST = DOMAIN + API + REGISTEREDFEE + 'getall';
export const REGISTERED_FEE_COMFIRM = DOMAIN + API + REGISTEREDFEE + 'confirm/';

//STAMPFEE
export const STAMPFEE_FEE_LIST = DOMAIN + API + STAMPFEE + 'getall';
export const STAMPFEE_FEE_COMFIRM = DOMAIN + API + STAMPFEE + 'confirm?id=';

//BLOG
export const BLOG_LIST = DOMAIN + API + BLOG + 'getall';
export const BLOG_LIST_GETID = DOMAIN + API + BLOG + 'get?id=';
export const BLOG_LIST_CREATE = DOMAIN + API + BLOG + 'create';
export const BLOG_LIST_DELETE = DOMAIN + API + BLOG + 'delete?id=';
export const BLOG_LIST_UPDATE = DOMAIN + API + BLOG + 'update';
export const BLOG_UPDATE_IMG = DOMAIN + API + BLOG + 'upcontentimg';

//NEWS
export const NEWS_LIST = DOMAIN + API + NEWS + 'getall';
export const NEWS_LIST_GETID = DOMAIN + API + NEWS + 'get?id=';
export const NEWS_LIST_CREATE = DOMAIN + API + NEWS + 'create';
export const NEWS_LIST_DELETE = DOMAIN + API + NEWS + 'delete/';
export const NEWS_LIST_UPDATE = DOMAIN + API + NEWS + 'update';

//MENU
export const MENU_LIST = DOMAIN + API + MENU + 'getall';
export const MENU_LIST_GET = DOMAIN + API + MENU + 'get?id=';
export const MENU_LIST_CREATE = DOMAIN + API + MENU + 'create';
export const MENU_LIST_DELETE = DOMAIN + API + MENU + 'delete?id=';
export const MENU_LIST_UPDATE = DOMAIN + API + MENU + 'update';

//STAMP
export const STAMP_LIST = DOMAIN + API + STAMP + 'getall';
export const STAMP_LIST_CREATE = DOMAIN + API + STAMP + 'create';
export const STAMP_LIST_DELETE = DOMAIN + API + STAMP + 'delete/';
export const STAMP_LIST_LOCK = DOMAIN + API + STAMP + 'lock?id=';

//STAMPPROVIDE
export const STAMPPROVIDE_LIST = DOMAIN + API + STAMPPROVIDE + 'getall';
export const STAMPPROVIDE_LIST_COMFIRM = DOMAIN + API + STAMPPROVIDE + 'confirmed?';
export const STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT = DOMAIN + API + STAMPPROVIDE + 'confirmrequestprint?id=';
export const STAMPPROVIDE_LIST_UNCOMFIRM = DOMAIN + API + STAMPPROVIDE + 'unconfirm';
export const QRCODE_STAMPID = DOMAIN + API + STAMPPROVIDE + 'qrcodestampid?';
export const STAMPPROVIDE_DETAIL = DOMAIN + API + STAMPPROVIDE + 'detail?id={0}';
export const STAMPPROVIDE_UPDATEDELIVERY = DOMAIN + API + STAMPPROVIDE + 'updatedeliverydate';
export const STAMPPROVIDE_PRINT = DOMAIN + API + STAMPPROVIDE + 'print?';
export const STAMPPROVIDE_HAS_PRINTED = DOMAIN + API + STAMPPROVIDE + 'hasprinted?id=';
export const STAMPPROVIDE_HAS_DELIVERED = DOMAIN + API + STAMPPROVIDE + 'hasdelivered?id=';
export const STAMPPROVIDE_SENDMAIL = DOMAIN + API + STAMPPROVIDE + 'sendmailtoprinter?id=';

//STAMPREQUESTUSED
export const STAMPREQUESTUSED_LIST = DOMAIN + API + STAMPPROVIDE + 'getallpermissionstamp';
export const STAMPREQUESTUSED_LIST_COMFIRM = DOMAIN + API + STAMPPROVIDE + 'confirmedpermissionstamp?';
export const STAMPREQUESTUSED_LIST_UNCOMFIRM = DOMAIN + API + STAMPPROVIDE + 'unconfirmpermissionstamp';

//PLANTINGTYPE
export const PLANTINGTYPE_LIST = DOMAIN + API + PLANTINGTYPE + 'getall';
export const PLANTINGTYPE_LIST_CREATE = DOMAIN + API + PLANTINGTYPE + 'create';
export const PLANTINGTYPE_LIST_DELETE = DOMAIN + API + PLANTINGTYPE + 'delete?id=';

//DASHBOARD
export const DASHBOARD_DETAIL = DOMAIN + API + DASHBOARD;
export const DASHBOARD_DEBT_COLLECT_OF_REGISTRASTION_OF_USE = DOMAIN + API + DASHBOARD + '/debtcollectofregistrastionofuse';
export const DASHBOARD_LIABILITIES_STAPM = DOMAIN + API + DASHBOARD + '/liabilitiesstamp';
export const DASHBOARD_GET_INFO = DOMAIN + API + DASHBOARD + '/get';
export const DASHBOARD_GET_ALERTS = DOMAIN + API + DASHBOARD + '/getalerts';
export const DASHBOARD_GET_TOTAL_ALERTS = DOMAIN + API + DASHBOARD + '/gettotalalerts';
export const DASHBOARD_READ = DOMAIN + API + DASHBOARD + '/read?alertId=';
export const DASHBOARD_READ_ALL = DOMAIN + API + DASHBOARD + '/readall';

// CONFIG
export const CONFIG_MENU = DOMAIN + API + CONFIG + 'getmenu';

// LOCATION
export const LOCATION_PROVINCE = DOMAIN + API + LOCATION + 'getprovince';
export const LOCATION_DISTRICT_BY_PROVINCE = DOMAIN + API + LOCATION + 'getdistrictsbyrole';
export const LOCATION_WARD_BY_DISTRICT = DOMAIN + API + LOCATION + 'getwardsbyrole?districtId={0}';

// COMPANY
export const COMPANY_ADD = DOMAIN + API + COMPANY + 'create';
export const COMPANY_UPDATE = DOMAIN + API + COMPANY + 'update';
export const COMPANY_DETAIL = DOMAIN + API + COMPANY + 'get?id={0}';

// AREA CODE
export const AREA_CODE_PROVINCE = DOMAIN + API + LOCATION + 'getprovince';
export const AREA_CODE_DISTRICT_BY_PROVINCE = DOMAIN + API + LOCATION + 'getdistrictsbyrole';
export const AREA_CODE_WARD_BY_DISTRICT = DOMAIN + API + LOCATION + 'getwardsbyrole?districtId={0}';
export const AREA_CODE_ADD = DOMAIN + API + ZONE + 'create';
export const AREA_CODE_EDIT = DOMAIN + API + ZONE + 'update';
export const AREA_CODE_DELETE = DOMAIN + API + ZONE + 'delete/{0}';
export const AREA_CODE_DETAIL = DOMAIN + API + ZONE + 'get/{0}'

// AREA ROLE
export const AREA_ROLE_ROLE = DOMAIN + API + ROLE + 'getallnozone';
export const AREA_ROLE_AREA = DOMAIN + API + ZONE + 'GetAllByLevel';
export const AREA_ROLE_ADD = DOMAIN + API + ZONE_ROLE + 'create';
export const AREA_ROLE_EDIT = DOMAIN + API + ZONE_ROLE + 'update';
export const AREA_ROLE_DELETE = DOMAIN + API + ZONE_ROLE + 'delete/{0}';
export const AREA_ROLE_DETAIL = DOMAIN + API + ZONE_ROLE + 'get/{0}'
export const AREA_ROLE_ROLE_ALL = DOMAIN + API + ROLE + 'getall';
export const AREA_ROLE_ROLE_ALL_EXCLUDE = DOMAIN + API + ZONE_ROLE + 'getlistrolecreate';

// FIELD
export const FIELD_GET_ALL = DOMAIN + API + FIELD + 'getall';

// TYPE ZONE PROPERTY
export const TYPE_ZONE_PROPERTY_LIST = DOMAIN + API + TYPE_ZONE_PROPERTY + 'getall';
export const TYPE_ZONE_PROPERTY_ADD = DOMAIN + API + TYPE_ZONE_PROPERTY + 'create';
export const TYPE_ZONE_PROPERTY_EDIT = DOMAIN + API + TYPE_ZONE_PROPERTY + 'update';
export const TYPE_ZONE_PROPERTY_DELETE = DOMAIN + API + TYPE_ZONE_PROPERTY + 'delete?id={0}';
export const TYPE_ZONE_PROPERTY_DETAIL = DOMAIN + API + TYPE_ZONE_PROPERTY + 'get?id={0}'

//COMPANY REPORT
export const COMPANY_MONTH_REPORT = DOMAIN + API + COMPANY_REPORT + 'getmonthreport?year=';
export const COMPANY_QUARTER_REPORT = DOMAIN + API + COMPANY_REPORT + 'getquarterreport?year=';
export const COMPANY_YEAR_REPORT = DOMAIN + API + COMPANY_REPORT + 'getyearreport?';

//GROWTH STAMP REPORT
export const GROWTH_STAMP_MONTH_REPORT = DOMAIN + API + GROWTH_STAMP_REPORT + 'getmonthreport?year=';
export const GROWTH_STAMP_QUARTER_REPORT = DOMAIN + API + GROWTH_STAMP_REPORT + 'getquarterreport?year=';
export const GROWTH_STAMP_YEAR_REPORT = DOMAIN + API + GROWTH_STAMP_REPORT + 'getyearreport?';

//SALE REGISTER REPORT
export const SALE_REGISTER_MONTH_REPORT = DOMAIN + API + SALE_REGISTER_REPORT + 'getmonthreport?year=';
export const SALE_REGISTER_QUARTER_REPORT = DOMAIN + API + SALE_REGISTER_REPORT + 'getquarterreport?year=';
export const SALE_REGISTER_YEAR_REPORT = DOMAIN + API + SALE_REGISTER_REPORT + 'getyearreport?';

//SALE STAMP REPORT
export const SALE_STAMP_MONTH_REPORT = DOMAIN + API + SALE_STAMP_REPORT + 'getmonthreport?year=';
export const SALE_STAMP_QUARTER_REPORT = DOMAIN + API + SALE_STAMP_REPORT + 'getquarterreport?year=';
export const SALE_STAMP_YEAR_REPORT = DOMAIN + API + SALE_STAMP_REPORT + 'getyearreport?';

// PLATING ZONE
export const PLANTING_ZONE_GET_LIST = DOMAIN + API + PLANTING_ZONE + 'getall';
export const PLANTING_ZONE_GET_LIST_PLANTING_TYPE = DOMAIN + API + PLANTINGTYPE + 'getall';
export const PLANTING_ZONE_CREATE = DOMAIN + API + PLANTING_ZONE + 'create';
export const PLANTING_ZONE_UPDATE = DOMAIN + API + PLANTING_ZONE + 'update';
export const PLANTING_ZONE_DELETE = DOMAIN + API + PLANTING_ZONE + 'delete?id={0}';
export const PLANTING_ZONE_DETAIL = DOMAIN + API + PLANTING_ZONE + 'get?id={0}';

// CONFIG SYSTEM
export const CONFIG_GET_INFO_COMPANY = DOMAIN + API + CONFIG + 'getsysteminfo';
export const CONFIG_GET_CONFIG_SYSTEM = DOMAIN + API + CONFIG + 'getsystemsetting';
export const CONFIG_GET_LIST_CONFIG_SERVER = DOMAIN + API + CONFIG + 'getserversetting?companyId={0}';
export const CONFIG_GET_LIST_PROVINCE_FOR_INFO_COMPANY = DOMAIN + API + LOCATION + 'getprovince';
export const CONFIG_GET_LIST_DISTRICT_FOR_INFO_COMPANY = DOMAIN + API + LOCATION + 'getdistrictsbyrole';
export const CONFIG_GET_LIST_WARD_FOR_INFO_COMPANY = DOMAIN + API + LOCATION + 'getwardsbyrole?districtId={0}';
export const CONFIG_UPDATE_INFO_COMPANY = DOMAIN + API + CONFIG + 'updatesysteminfo';
export const CONFIG_UPDATE_CONFIG_SYSTEM = DOMAIN + API + CONFIG + 'updatesystemsetting';
export const CONFIG_GET_FTP = DOMAIN + API + CONFIG + 'getftp?id={0}';
export const CONFIG_CREATE_FTP = DOMAIN + API + CONFIG + 'createftp';
export const CONFIG_UPDATE_FTP = DOMAIN + API + CONFIG + 'updateftp';
export const CONFIG_DELETE_FTP = DOMAIN + API + CONFIG + 'deleteftp';
export const CONFIG_UPDATE_IMG = DOMAIN + API + CONFIG + 'upcontentimg';
export const CONFIG_GET_LIST_ALERT_ROLES = DOMAIN + API + CONFIG + 'getallalertroles';
export const CONFIG_CREATE_ALERT_ROLES = DOMAIN + API + CONFIG + 'createalertroles';
export const CONFIG_DELETE_ALERT_ROLES = DOMAIN + API + CONFIG + 'deletealertroles?roleId=';
export const CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT = DOMAIN + API + CONFIG + 'getallalertrolesbyselect';
export const CONFIG_GET_LIST_ROLES_BY_SELECT = DOMAIN + API + CONFIG + 'getallrolesbyselect';
export const CONFIG_GET_LIST_STAMP_PRICE = DOMAIN + API + CONFIG + 'getallstampprices';
export const CONFIG_CREATE_STAMP_PRICE = DOMAIN + API + CONFIG + 'createstampprices';
export const CONFIG_UPDATE_STAMP_PRICE = DOMAIN + API + CONFIG + 'updatestampprices';
export const CONFIG_DETAIL_STAMP_PRICE = DOMAIN + API + CONFIG + 'getdetailsstampprices?id=';
export const CONFIG_DELETE_STAMP_PRICE = DOMAIN + API + CONFIG + 'deletestampprices?Id=';

//MATERIAL GROUP
// List + CRUD dùng controller "materialgroupnext" để đồng bộ với app mobile
// (controller "materialgroup" cũ chỉ có getall/getallhaveproduct, không có get/create/update/lock/delete)
const MATERIAL_GROUP_NEXT = 'materialgroupnext/';
export const MATERIAL_GROUP_GET = DOMAIN + API + MATERIAL_GROUP_NEXT + 'get?id=';
export const MATERIAL_GROUP_LIST = DOMAIN + API + MATERIAL_GROUP_NEXT + 'getall';
export const MATERIAL_GROUP_LOG_LIST = DOMAIN + API + MATERIAL_GROUP + 'getalllock';
export const MATERIAL_GROUP_CREATE = DOMAIN + API + MATERIAL_GROUP_NEXT + 'create';
export const MATERIAL_GROUP_LOCK = DOMAIN + API + MATERIAL_GROUP_NEXT + 'lock?id=';
export const MATERIAL_GROUP_UPDATE = DOMAIN + API + MATERIAL_GROUP_NEXT + 'update';
export const MATERIAL_GROUP_DELETE = DOMAIN + API + MATERIAL_GROUP_NEXT + 'delete?id=';
export const MATERIAL_GROUP_LOG_PRODUCT_LIST = DOMAIN + API + MATERIAL_GROUP + 'getalllockproduct';

//CONFIG WEBSITE
export const CONFIG_WEBSITE_GET = DOMAIN + API + CONFIG_WEBSITE + 'get';
export const CONFIG_WEBSITE_UPDATE = DOMAIN + API + CONFIG_WEBSITE + 'update';
export const CONFIG_WEBSITE_UPDATE_IMG = DOMAIN + API + CONFIG_WEBSITE + 'upcontentimg';

//PRODUCT GROUP
export const PRODUCT_GROUP_GET = DOMAIN + API + PRODUCT_GROUP + 'get?id=';
export const PRODUCT_GROUP_LIST = DOMAIN + API + PRODUCT_GROUP + 'getall';
export const PRODUCT_GROUP_CREATE = DOMAIN + API + PRODUCT_GROUP + 'create';
export const PRODUCT_GROUP_LOCK = DOMAIN + API + PRODUCT_GROUP + 'lock?id=';
export const PRODUCT_GROUP_UPDATE = DOMAIN + API + PRODUCT_GROUP + 'update';
export const PRODUCT_GROUP_DELETE = DOMAIN + API + PRODUCT_GROUP + 'delete?id=';

//AREA
export const AREA_GET = DOMAIN + API + AREA + 'get';
export const AREA_GET_LIST_COMPANY_PLANNING_AREA = DOMAIN + API + AREA + 'getlistcompanyplanningarea';
export const AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA = DOMAIN + API + AREA + 'getlistcompanyouterplanningarea';

//PRODUCT REPORT
export const PRODUCT_REPORT_GET = DOMAIN + API + PRODUCT_REPORT;
export const PRODUCT_REPORT_GET_BY_GROUP = DOMAIN + API + PRODUCT_REPORT + 'getbygroup';
export const PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX = DOMAIN + API + FIELD + 'getall';
// export const PRODUCT_REPORT_GET_PRODUCT_REPORT_COMBOBOX = DOMAIN + API + PRODUCT_REPORT + 'getbygroup?materialGroupId={materialGroupId}&districtId={districtId}&wardId={wardId}&page={page}&limit={limit}&reportFilterType={reportFilterType}&year={year}&month={month}';
export const PRODUCT_REPORT_GET_PRODUCT_REPORT = DOMAIN + API + PRODUCT_REPORT;
export const PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_GROUP = DOMAIN + API + PRODUCT_REPORT + 'getbygroup';
export const PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_TYPE = DOMAIN + API + PRODUCT_REPORT + 'getbytype';

//UNIT
export const UNIT_GET = DOMAIN + API + UNIT + 'get?id=';
export const UNIT_LIST = DOMAIN + API + UNIT + 'getall';
export const UNIT_CREATE = DOMAIN + API + UNIT + 'create';
export const UNIT_UPDATE = DOMAIN + API + UNIT + 'update';
export const UNIT_DELETE = DOMAIN + API + UNIT + 'delete/';

//STAMPTEMPLATE
export const STAMPTEMPLATE_LIST = DOMAIN + API + STAMPTEMPLATE + 'getall';
export const STAMPTEMPLATE_GET = DOMAIN + API + STAMPTEMPLATE;
export const STAMPTEMPLATE_CREATE = DOMAIN + API + STAMPTEMPLATE;
export const STAMPTEMPLATE_UPDATE = DOMAIN + API + STAMPTEMPLATE;
export const STAMPTEMPLATE_DELETE = DOMAIN + API + STAMPTEMPLATE;

//TRACE
export const TRACE_LIST = DOMAIN + API + TRACE + 'getall';
export const TRACE_GET = DOMAIN + API + TRACE + 'get?id=';
export const TRACE_GET_HISTORY = DOMAIN + API + TRACE + 'gethistory';
export const TRACE_GET_FIELDS = DOMAIN + API + TRACE + 'getfields';
export const TRACE_GET_PRODUCT_BY_TRACE = DOMAIN + API + PRODUCTS + 'getbytrace?FieldId=';
export const TRACE_DELETE = DOMAIN + API + TRACE + 'delete?id=';
export const TRACE_COMPLETED = DOMAIN + API + TRACE + 'completed?id=';
export const TRACE_CREATE = DOMAIN + API + TRACE + 'tracecreate';
export const TRACE_GET_FIELD_FOR_ADD = DOMAIN + API + FIELD + 'getallbycompanyhaveaccesstrace';

// Ghi nhật ký truy cập (record diary) — đối chiếu app mobile (Laco/src/screens/listDiary)
export const TRACE_GET_INFORM_SELECT = DOMAIN + API + TRACE + 'get?id='; // trả {trace, informSelects}
export const TRACE_GET_ATTRIBUTE = DOMAIN + API + TRACE + 'getattribute?informSelectId=';
export const TRACE_WRITE = DOMAIN + API + TRACE + 'writetrace';
export const TRACE_GET_PLANZONE = DOMAIN + API + TRACE + 'getplanzone?traceId=';
// reference lookups cho thuộc tính động khi ghi nhật ký
export const RD_CUSTOMER_LIST = DOMAIN + API + PARTNER + 'getlistcustomerforwritetrace';
export const RD_PROVIDER_LIST = DOMAIN + API + PARTNER + 'getlistproviderforwritetrace';
export const RD_EMPLOYEE_LIST = DOMAIN + API + 'employee/getempimplementation';
export const RD_MATERIAL_LIST = DOMAIN + API + 'material/getlistforwritetrace';
export const RD_MATERIAL_UNIT_LIST = DOMAIN + API + 'material/getlistunitforwritetrace?id=';
export const RD_WAREHOUSE_LIST = DOMAIN + API + 'warehouse/getall';
export const RD_VEHICLE_LIST = DOMAIN + API + 'vehicle/getall';
export const RD_FACTORY_LIST = DOMAIN + API + 'factory/getlistforwritetrace';
export const RD_TOOL_LIST = DOMAIN + API + 'factory/getlisttoolforwritetrace';
export const RD_TRANSPORT_UNIT_LIST = DOMAIN + API + TRACE + 'getpartnermovement';

// Quản lý bản ghi nhật ký (đánh giá / làm lại / xóa / chi tiết / lịch sử / phân quyền)
export const TRACE_EVALUATE = DOMAIN + API + TRACE + 'evaluate';
export const TRACE_MADE_AGAIN = DOMAIN + API + TRACE + 'madeagain';
export const TRACE_DELETE_WRITE = DOMAIN + API + TRACE + 'deletewritetrace?traceInfoId=';
export const TRACE_GET_DETAIL_INFORM = DOMAIN + API + TRACE + 'getdetailtraceinform?traceInformId=';
export const TRACE_PLANZONE_HISTORY = DOMAIN + API + TRACE + 'getplanzonehistory';
export const TRACE_LIST_EVALUATE = DOMAIN + API + TRACE + 'getlistevaluate?traceInfoID=';
export const TRACE_GET_TRACEROLE = DOMAIN + API + TRACE + 'gettracerole?traceID=';
// Tồn kho + phiếu nhập cho ghi nhật ký nguyên vật liệu
export const TRACE_GET_GOODRECEIPT = DOMAIN + API + TRACE + 'getgoodreceipt?traceId=';
export const TRACE_GET_DETAIL_GOODRECEIPT = DOMAIN + API + TRACE + 'getdetailgoodreceipt?grId=';
export const TRACE_CHECK_INVENTORY_MULTI = DOMAIN + API + 'inventory/checkinventorymulti';
export const TRACE_GET_INVENTORY_BY_MATERIAL = DOMAIN + API + 'inventory/getconvertinventorytoUnitwithoutwarehouse?unitIdTarget=';
// Upload ảnh + cá thể (item) + QR
export const TRACE_UPLOAD = DOMAIN + API + TRACE + 'upload';
export const TRACE_GET_ITEM = DOMAIN + API + TRACE + 'getitem';
export const TRACE_CHECK_ITEM_VALID = DOMAIN + API + TRACE + 'checkitemvalid?qrCode=';
export const TRACE_MATERIAL_BY_QR = DOMAIN + API + 'material/getbyqr?materialGroupId=';
export const TRACE_UPDATE_GPS = DOMAIN + API + TRACE + 'updatetraceinformgps';

//PRODUCTS
export const PRODUCTS_LIST = DOMAIN + API + PRODUCTS + 'getall';
export const PRODUCTS_LIST_IN_ALERT = DOMAIN + API + PRODUCTS + 'getallproductinalerts';
export const PRODUCTS_LIST_VERIFY = DOMAIN + API + PRODUCTS + 'getallverify';
export const PRODUCTS_VERIFY = DOMAIN + API + PRODUCTS + 'verify?id=';
export const PRODUCTS_UPLOAD_VERIFY = DOMAIN + API + PRODUCTS + 'uploadverifiedfiles';
export const PRODUCTS_DELETE_UPLOAD_VERIFY = DOMAIN + API + PRODUCTS + 'deleteverifiedfiles?id=';
export const PRODUCTS_GET = DOMAIN + API + PRODUCTS + 'get?id=';
export const PRODUCTS_LIST_LOCK = DOMAIN + API + PRODUCTS + 'getalllock';
export const PRODUCTS_CONFIRM = DOMAIN + API + PRODUCTS + 'confirm?id=';
export const PRODUCTS_UNCONFIRM = DOMAIN + API + PRODUCTS + 'unconfirm?id=';

//PARTNER
export const PARTNER_LIST = DOMAIN + API + PARTNER + 'getall';
export const PARTNER_GET = DOMAIN + API + PARTNER + 'get?id=';
export const PARTNER_CREATE = DOMAIN + API + PARTNER + 'create';
export const PARTNER_UPDATE = DOMAIN + API + PARTNER + 'update';
export const PARTNER_DELETE = DOMAIN + API + PARTNER + 'delete/';
export const PARTNER_LIST_VERIFY = DOMAIN + API + PARTNER + 'getallverify';
export const PARTNER_LIST_MANIFEST_VERIFY = DOMAIN + API + PARTNER + 'getallmanifestverify';
export const PARTNER_LIST_TRANSPORTS_VERIFY = DOMAIN + API + PARTNER + 'getalltransportverify';
export const PARTNER_VERIFY = DOMAIN + API + PARTNER + 'verify?id=';
export const PARTNER_UPLOAD_VERIFY = DOMAIN + API + PARTNER + 'uploadverifiedfiles';
export const PARTNER_DELETE_UPLOAD_VERIFY = DOMAIN + API + PARTNER + 'deleteverifiedfiles?id=';
export const PARTNER_LACO = DOMAIN + API + PARTNER + 'getlistpartnerlaco';

//REPORTSP
export const REPORTSP_LIST_TABLE = DOMAIN + API + REPORTSP + 'getlisttable';
export const REPORTSP_LIST_COLUMN = DOMAIN + API + REPORTSP + 'getlistcolumn?table=';
export const REPORTSP_REPORT = DOMAIN + API + REPORTSP + 'getreport?id=';

//REPORTSPMANGER 
export const REPORTSP_MANGER_LIST = DOMAIN + API + REPORTSP_MANGER + 'getallsp';

// REPORTV2
export const REPORTV2_GET_REPORT_LIST_COMPANY_API = DOMAIN + API + REPORTADMINV2 + 'getReportListCompany?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&taxCode={4}&companyName={5}&page={6}&limit={7}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_COMPANY_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListCompany?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&taxCode={4}&companyName={5}&page={6}&limit={7}';
export const REPORTV2_GET_REPORT_LIST_PRODUCT_API = DOMAIN + API + REPORTADMINV2 + 'getReportListProduct?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&productName={5}&page={6}&limit={7}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_PRODUCT_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListProduct?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&productName={5}&page={6}&limit={7}';
export const REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API = DOMAIN + API + REPORTADMINV2 + 'getReportListQuantityProductByPlantingZone?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&page={5}&limit={6}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListQuantityProductByPlantingZone?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&page={5}&limit={6}';
export const REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_API = DOMAIN + API + REPORTADMINV2 + 'getReportListQuantityProduct?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&productName={5}&page={6}&limit={7}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListQuantityProduct?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&productGroupId={4}&productName={5}&page={6}&limit={7}';
export const REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_API = DOMAIN + API + REPORTADMINV2 + 'getReportListZoningPlantingZone?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&plantingZoneId={4}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListZoningPlantingZone?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&plantingZoneId={4}';

export const REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API = DOMAIN + API + REPORTADMINV2 + 'getReportListZoningPlantingZoneByCompany?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&plantingZoneId={4}&taxCode={5}&conpanyName={6}&page={7}&limit={8}';
export const REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API = DOMAIN + API + REPORTADMINV2 + 'printExcelReportListZoningPlantingZoneByCompany?fromDate={0}&toDate={1}&districtId={2}&wardId={3}&plantingZoneId={4}&taxCode={5}&conpanyName={6}&page={7}&limit={8}';

// GOOD DELIVERY NOTE API
export const GOOD_DELIVERY_GET_LIST = DOMAIN + API + 'goodsdeliverynote/getall';
export const REPORT_GET_LIST_INVENTORY_TRANSFER_WAREHOUSE_V2 = DOMAIN + API + 'report/getListReportInventoryTransferWarehouseV2?page={0}&limit={1}&fromDate={2}&toDate={3}';

//TRANSPORTATION
export const TRANSPORTATION_LIST = DOMAIN + API + TRANSPORTATION + 'getall';
export const TRANSPORTATION_GET = DOMAIN + API + TRANSPORTATION + 'get?id=';
export const TRANSPORTATION_CREATE = DOMAIN + API + TRANSPORTATION + 'create';
export const TRANSPORTATION_UPDATE = DOMAIN + API + TRANSPORTATION + 'update';
export const TRANSPORTATION_DELETE = DOMAIN + API + TRANSPORTATION + 'delete/';