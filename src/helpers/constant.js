import { getCurrentDatetimeStringForFile } from "./common";

export const USER_ACCOUNT_HEADER = [
    'Stt',
    // 'Trạng thái',
    // 'Hình đại diện',
    'Nhóm quyền',
    'Họ và tên',
    'Tên đăng nhập',
];

export const USER_ACCOUNT_HEADER_SEARCH = 'Tìm kiếm họ và tên';

export const ROLE_ACCOUNT_HEADER = [
    'Stt',
    'Nhóm quyền',
    // 'Diễn giải'
];

export const ROLE_ACCOUNT_HEADER_SEARCH = 'Tìm kiếm nhóm quyền';


export const ZONE_ROLE_ACCOUNT_HEADER = [
    'Stt',
    'Nhóm quyền',
    // 'Vùng quản lý'
];

export const ZONE_ROLE_ACCOUNT_HEADER_SEARCH = 'Tìm kiếm';

export const PRICES_HEADER_SEARCH = 'Tìm kiếm bảng giá';

export const PRICES_HEADER = [
    'Stt',
    'Số năm',
    'Số tiền'
];

export const ZONE_HEADER_SEARCH = 'Tìm kiếm vùng dữ liệu';

export const ZONE_HEADER = [
    'Stt',
    'Tên vùng',
    // 'Khu vực'
];

export const TYPE_ZONE_PROPERTY_HEADER = [
    'Stt',
    'Biểu tượng',
    'Tên loại & thuộc tính',
    'Loại sản phẩm'
]

export const HISTORY_HEADER_SEARCH = 'Tìm kiếm lịch sử';

export const HISTORY_HEADER = [
    'Stt',
    'Thời gian',
    // 'Giờ',
    'Người dùng',
    'Nội dung'
];
export const COMPANY_REG_HEADER_SEARCH = 'Tìm kiếm danh sách';

export const COMPANY_REG_HEADER = [
    'Stt',
    'Tên doanh nghiệp/ Họ và tên',
    'Mã số thuế/ Số CMND(CCCD)',
    'Điện thoại',
    'Email'
];
export const COMPANY_AWAIT_HEADER_SEARCH = 'Tìm kiếm danh sách chờ';

export const COMPANY_AWAIT_HEADER = [
    'Stt',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    //'Địa chỉ'
];
export const REPORT_ZONING_PRODUCT = [
    'Stt',
    'Vùng',
    'Quận/Huyện',
    'Phường/Xã',
    'Loại SP',
    'SL Doanh nghiệp',
    'Thuộc quy hoạch',
    'Không thuộc quy hoạch'
];

export const REPORT_ZONING_PLANTING_ZONE = [
    'Stt',
    'Vùng',
    'SL Doanh nghiệp',
    'Thuộc quy hoạch',
    'Không thuộc quy hoạch'
];
export const REPORT_QUANTITY_PRODUCT = [ 
    'Stt',
    'Vùng',
    'Loại SP',
    'DVT',
    'Mã SP',
    'Tên SP',
    'Quận/Huyện',
    'Phường/Xã',
    'Sản lượng'
];
export const REPORT_QUANTITY_PRODUCT_BY_ZONE = [ 
    'Stt',
    'Vùng',
    'Loại SP',
    'DVT',
    'Quận/Huyện',
    'Phường/Xã',
    'Sản lượng'
];
export const REPORT_PRODUCT_BY_PROVICE = [ 
    'Stt',
    'Mã hàng',
    'Tên hàng hoá',
    'Loại sản phẩm',
    'ĐVT',
    'Đơn vị sở hữu',
    'Quận/Huyện',
    'Phường/Xã',
    'Ngày đăng ký'
];
export const REPORT_ZONING_COMPANY = [
    'Stt',
    'Vùng',
    'MST/CCCD',
    'Doanh nghiệp/Cá nhân',
    'Địa chỉ',
    'Quận/Huyện',
    'Phường/Xã',
    'Thuộc quy hoạch'
];
export const REPORT_LIST_COMPANY = [
    'Stt',
    'MST',
    'Tên đầy đủ',
    'Địa chỉ',
    'Quận/Huyện',
    'Phường/Xã',
    'Ngày đăng kí',
    'Số lượng mặt hàng'
];
export const FILE_UPLOAD = [
    'Stt',
    'Thời gian',
    'File'
];

export const PERMISSION_HEADER_SEARCH = 'Tìm kiếm nhóm quyền';

export const PERMISSION_AWAIT_HEADER = [
    '',
    '',
    'Xem',
    'Thêm',
    'Sửa',
    'Xoá',
    'Duyệt',
    'Không duyệt',
    'Khoá',
];

export const COMPANY_NOT_COMFIRM_HEADER_SEARCH = 'Tìm kiếm danh sách không duyệt';

export const COMPANY_NOT_COMFIRM_HEADER = [
    'Stt',
    'Lý do không duyệt',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    //'Địa chỉ',
    'Ngày xử lý',
    'Người xử lý'
];
export const COMPANY_LIST_REGISTER_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_REGISTER_HEADER = [
    'Stt',
    // 'Trạng thái',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    'Ngày đăng ký',

];

export const COMPANY_LIST_CERTIFIED_HEADER = [
    'Stt',
    // 'Trạng thái',
    'Ngành nghề',
    'Tên doanh nghiệp/ Cá nhân',
    'Mã số thuế',
    'Điện thoại',
    'Ngày đăng ký',
    'Ngày xác nhận'
];

export const COMPANY_LIST_AWAIT_EXPIRED_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_AWAIT_EXPIRED_HEADER = [
    'Stt',
    'Ngày đăng ký',
    'Còn lại',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    //'Địa chỉ',
];
export const COMPANY_LIST_EXPIRING_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_EXPIRING_HEADER = [
    'Stt',
    'Ngày đăng ký',
    'Ngày hết hạn',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    //'Địa chỉ',
];
export const COMPANY_LIST_LOCK_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_LOCK_HEADER = [
    'Stt',
    'Ngày khóa',
    'Người khóa',
    'Ngành nghề',
    'Tên doanh nghiệp/ Địa chỉ',
    'Mã số thuế',
    'Điện thoại',
    //'Địa chỉ',
];

export const COMPANY_REPORTS_PLANNING = [
    'Stt',
    'Doanh nghiệp/Cá nhân',
    'Mã số thuế',
    'Điện thoại',
];

export const FIELD_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách';

export const FIELD_LIST_HEADER = [
    'Stt',
    'Mã ngành',
    'Ngành nghề'
];

export const INFORMATION_LIST_HEADER_SEARCH = 'Tìm kiếm tên truy xuất/ kê khai';

export const INFORMATION_LIST_HEADER = [
    'Stt',
    'Tên truy xuất/ kê khai',
    'Sắp xếp',
    'Kiểu dữ liệu',
    'Bắt buộc'
];


export const ACCESS_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách';

export const ACCESS_LIST_HEADER = [
    'Stt',
    'Hình ảnh',
    'Tên truy xuất',
    'Sắp xếp',
    'Bắt buộc',
    'Kiểm tra cách ly',
    'Nhập kho',
    'Chuyển giao',
    'Đánh giá'
];

export const TABLE_REPORT = [
    'Stt',
    'Cột 1',
    'Cột 2',
]

export const REGISTERED_FEE_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách';

export const REGISTERED_FEE_LIST_HEADER = [
    'Stt',
    'Trạng thái',
    'Số tiền',
    'Ngày đăng ký',
    'Ngày hết hạn',
    'Tên doanh nghiệp',
    'Ngành nghề',
    'Ngày thu',
    'Người thu'
];

export const STAMP_FEE_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const STAMP_FEE_LIST_HEADER = [
    'Stt',
    'Trạng thái',
    'Số tiền',
    'Đã thu',
    'Còn lại',
    'Số lượng',
    'Tên doanh nghiệp',
    // 'Ngành nghề',
    'Ngày thu',
    'Người thu'
];
export const COMPANY_LIST_REQUEST_EXTEND_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_REQUEST_EXTEND_HEADER = [
    'Stt',
    'Ngày hết hạn',
    'Ngày yêu cầu',
    'Ngành nghề',
    'Tên doanh nghiệp',
    'Mã số thuế',
    'Điện thoại'
];

export const STAMPTEMPLATE = [
    'Stt',
    'Mẫu',
    'Tên',

];

export const ALERT = [
    'Stt',
    'Nhóm quyền',
    'Thông báo',
];

export const MATERIAL_GROUP = [
    'Stt',
    // 'Ngành nghề',
    'Hình ảnh',
    // 'Loại',
    'Nhóm SẢN PHẨM',

];
export const PRODUCT_GROUP = [
    'Stt',
    'Hình ảnh',
    'Loại sản phẩm',
];

export const PRODUCTS_VERIFY = [
    'Stt',
    'Trạng thái',
    'Hình ảnh',
    'Sản phẩm',
    'Ngành nghề',
    'Đơn vị xác thực',
    'Ngày xác thực'
];

export const COMPANY_VERIFY = [
    'Stt',
    'Trạng thái',
    'Hình ảnh',
    'Doanh nghiệp/Hợp tác xã/Cá nhân',
    'Đơn vị xác thực',
    'Ngày xác thực'
];

export const PARTNER_VERIFY = [
    'Stt',
    'Trạng thái',
    'Hình ảnh',
    'Tên nhà cung cấp',
    'Đơn vị xác thực',
    'Ngày xác thực'
];

export const PARTNER_MANUFACT_VERIFY = [
    'Stt',
    'Trạng thái',
    'Hình ảnh',
    'Tên nhà sản xuất',
    'Đơn vị xác thực',
    'Ngày xác thực'
];

export const PARTNER_TRANFORM_VERIFY = [
    'Stt',
    'Trạng thái',
    'Hình ảnh',
    'Tên nhà vận chuyển',
    'Đơn vị xác thực',
    'Ngày xác thực'
];

export const UNIT = [
    'Stt',
    'Đơn vị tính',
];

export const PARTNER = [
    'Stt',
    'Hình ảnh',
    'Đơn vị xác thực',
    // 'Tên đơn vị',
    // 'Mã số thuế',
    // 'Điện thoại'
];

export const RRMananger = [
    'Stt',
    'Tên báo cáo',
    'Chú thích',
    'Trạng thái'
];

export const AddingReport = [
    'Stt',
    'Hiển thị tên',
    'Hiện'
];

export const HeaderParams = [
    'STT',
    'Tên biến',
    'Tên hiển thị',
    'Giá trị mặc định',
    'Trạng thái hiển thị'
];

export const PARTNER_PRINTER = [
    'Stt',
    'Hình ảnh',
    'Đơn vị in tem',
];

export const TRACE = [
    'Stt',
    '',
    'Sản phẩm',
    'Nhà sản xuất',
    'Mã nhật ký'
];

export const COMPANY_LIST_REQUEST_UNLOCK_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const COMPANY_LIST_REQUEST_UNLOCK_HEADER = [
    'Stt',
    'Ngày khóa',
    'Ngày yêu cầu',
    'Ngành nghề',
    'Tên doanh nghiệp',
    'Mã số thuế',
    'Điện thoại'
];
export const BLOG_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const BLOG_LIST_HEADER = [
    'Stt',
    'Hình ảnh',
    'Tiêu đề',
    'Nổi bật',
    'Ẩn',
    'Lần xem',
    'Ngày tạo'
];
export const NEWS_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const NEWS_LIST_HEADER = [
    'Stt',
    'Tiêu đề',
    'Menu',
    'Hình ảnh',
    'Lần xem',
    'Thời gian'
];
export const MENU_LIST_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const MENU_LIST_HEADER = [
    'Stt',
    'Tên menu'
];
export const STAMP_LIST_HEADER_SEARCH = 'Tìm kiếm dải tem ';

export const STAMP_LIST_HEADER = [
    'Stt',
    'Dải tem',
    'Số lượng',
    'Chưa cấp',
    'Đã cấp',
    'Ngày tạo',
    'Người tạo'
];
export const STAMPPROVIDE_LIST_HEADER_SEARCH = 'Tìm kiếm dải tem ';

export const STAMPPROVIDE_LIST_HEADER = [
    'Stt',
    'Trạng thái',
    
    'Tên doanh nghiệp',
    // 'Sản phẩm',
    'SL yêu cầu',
    'Yêu cầu in',
    // 'Xử lý',
    // 'Người xử lý',
    // 'Lý do không duyệt'
];
export const PLANTINGTYPE_LIST_HEADER_SEARCH = 'Tìm kiếm vùng sản xuất ';

export const PLANTINGTYPE_LIST_HEADER = [
    'Stt',
    'Thể loại',
];
export const NAVBAR_PARENT_ITEM = {
    SYSTEM: 'Hệ thống',
    COMPANY: 'Quản lý doanh nghiệp',
    CATEGORY: 'Quản lý danh mục',
    STAMP: 'Quản lý dải tem',
    FEE: 'Quản lý thu',
    WEBSITE: 'Quản lý website',
    REPORT: 'Báo cáo',
    SETTING: 'Cài đặt hệ thống'
};

export const NAVBAR_PARENT_ITEM_LIST = [
    'Hệ thống',
    'Quản lý doanh nghiệp',
    'Quản lý danh mục',
    'Quản lý thu',
    'Quản lý dải tem',
    'Quản lý website',
    'Báo cáo',
    'Cài đặt hệ thống'
];

export const DEBT_COLLECT_OF_REGISTRASTION_OF_USE_HEADER = [
    'Stt',
    'Số tiền',
    'Tên doanh nghiệp'
];

export const LIABILITIES_STAPM_HEADER = [
    'Stt',
    'Số tiền',
    'Tên doanh nghiệp'
];

export const STAMP_PRICE_HEADER_SEARCH = 'Tìm kiếm danh sách ';

export const STAMP_PRICE_HEADER = [
    'Stt',
    'Bảng giá'
];

export const QR_SYSTEM_HEADER = [
    'Stt',
    'Thông tin',
];
export const QR_SYSTEM_LIST = [
    'Stt',
    'Thông tin',
    'Đã sử dụng',
    'Còn lại',
    'Bị hư',
];
export const QR_SYSTEM_ARISES= [
    'Stt',
    'Hình ảnh',
    'Thông tin',
    'Trạng thái',
];

export const SUMMARY_REPORT_TEM_USE = [
    'Stt',
    'Ngày',
    'SP',
    'Thuộc dải tem',
    'Dùng',
    'Dải tem dùng'
]

export const SUMMARY_REPORT_SHIPMENT = [
    'Stt',
    'Ngày',
    'Mã lô',
    'SL tem',
]

export const SUMMARY_REPORT_PRODUCT_OUTPUT = [
    'Stt',
    'Sản phẩm',
    'ĐVT',
    'Sản lượng',
]

export const SUMMARY_REPORT_PRODUCT_REGION = [
    'Stt',
    'Vùng',
    'Sản phẩm',
    'ĐVT',
    'Sản lượng',
]

export const SUMMARY_REPORT_PRODUCT_SELL = [
    'Stt',
    'Khách hàng',
    'Sản phẩm',
    'ĐVT',
    'SL',
    'ĐG',
    'VAT(%)',
    'TT',
    'Người thực hiện',
]

export const DATA_TYPES = {
    hinhanh: 4,
    banDo: 5,
    trueFalse: 6
}

export const PARAM_OF_ASSCESS_LIST = [
    { name: 'Khách hàng', reference: 10 },
    { name: 'Nhà cung cấp', reference: 20 },
    // { name: 'Nhân viên', reference: 30 },
    { name: 'Sản phẩm/Nguyên vật liệu', reference: 40 },
    // { name: 'Kho hàng', reference: 50 },
    { name: 'Đơn vị tính', reference: 60 },
    // { name: 'Đơn vị vận chuyển', reference: 70 },
    // { name: 'Phương tiện vận chuyển', reference: 80 },
    // { name: 'Phiếu xuất', reference: 92 },
    // { name: 'Phiếu nhập', reference: 90 },
    { name: 'Nhà máy', reference: 91 },
    { name: 'Thiết bị', reference: 93 },
    { name: 'Vận chuyển', reference: 94 }
];

export const DATA_TYPE_FIELD_LIST = [
    { fieldType: '1', name: "SẢN XUẤT" },
    { fieldType: '2', name: "THƯƠNG MẠI" },
    { fieldType: '3', name: "CHĂN NUÔI" },
    { fieldType: '4', name: "TRỒNG TRỌT" },
    { fieldType: '5', name: "ĐÁNH BẮT" },
];

export const DATA_TYPE_LIST = [
    { dataType: '1', name: "Văn bản" },
    { dataType: '2', name: "Số" },
    { dataType: '3', name: "Thời gian" },
    { dataType: '4', name: "Hình ảnh" },
    { dataType: '5', name: "Định vị" },
    { dataType: '6', name: "Có/Không" },
];

export const DATA_SORTODER_LIST = [
    { number: '1' },
    { number: '2' },
    { number: '3' },
    { number: '4' },
    { number: '5' },
    { number: '6' },
    { number: '7' },
    { number: '8' },
    { number: '9' },
    { number: '10' },

    { number: '11' },
    { number: '12' },
    { number: '13' },
    { number: '14' },
    { number: '15' },
    { number: '16' },
    { number: '17' },
    { number: '18' },
    { number: '19' },
    { number: '20' },

    { number: '21' },
    { number: '22' },
    { number: '23' },
    { number: '24' },
    { number: '25' },
    { number: '26' },
    { number: '27' },
    { number: '28' },
    { number: '29' },
    { number: '30' },
    { number: '31' },

    { number: '32' },
    { number: '33' },
    { number: '34' },
    { number: '35' },
    { number: '36' },
    { number: '37' },
    { number: '38' },
    { number: '39' },
    { number: '40' },

    { number: '41' },
    { number: '42' },
    { number: '43' },
    { number: '44' },
    { number: '45' },
    { number: '46' },
    { number: '47' },
    { number: '48' },
    { number: '49' },
    { number: '50' },

    { number: '51' },
    { number: '52' },
    { number: '53' },
    { number: '54' },
    { number: '55' },
    { number: '56' },
    { number: '57' },
    { number: '58' },
    { number: '59' },
    { number: '60' },

    { number: '61' },
    { number: '62' },
    { number: '63' },
    { number: '64' },
    { number: '65' },
    { number: '66' },
    { number: '67' },
    { number: '68' },
    { number: '69' },
    { number: '70' },

    { number: '71' },
    { number: '72' },
    { number: '73' },
    { number: '74' },
    { number: '75' },
    { number: '76' },
    { number: '77' },
    { number: '78' },
    { number: '79' },
    { number: '80' },

    { number: '81' },
    { number: '82' },
    { number: '83' },
    { number: '84' },
    { number: '85' },
    { number: '86' },
    { number: '87' },
    { number: '88' },
    { number: '89' },
    { number: '90' },

    { number: '91' },
    { number: '92' },
    { number: '93' },
    { number: '94' },
    { number: '95' },
    { number: '96' },
    { number: '97' },
    { number: '98' },
    { number: '99' },
    { number: '100' },
];

export const IMPORT_EXPORT_PRODUCT_STATUS = {
    ACTIVE: 'Đã duyệt',
    DEACTIVE: 'Chưa duyệt'
}

export const IMPORT_PRODUCT_TYPE = [
  {
    name: "Nguyên vật liệu",
    description: "Nhập nguyên vật liệu để sử dụng cho sản xuất",
    id: "1",
    val: "1",
  },
  {
    name: "Sản phẩm",
    description: "Nhập sản phẩm để bán",
    id: "2",
    val: "2",
  },
  {
    name: "Từ phiếu xuất",
    description:
      "Nhập từ phiếu xuất hàng của công ty cùng hệ thống Trace Center",
    id: null,
    val: null,
  },
];

export const EXPORT_PRODUCT_TYPE = [
  {
    name: "Lô hàng",
    description: "Lô hàng",
    id: "1",
    val: "1",
  },
  {
    name: "Sản phẩm",
    description: "Sản phẩm",
    id: "2",
    val: "2",
  },
  {
    name: "Quét QR",
    description: "Quét QR",
    id: "3",
    val: "3",
  },
];

export const NAVBAR_ITEM = {
    USER_ACCOUNT: 'Tài khoản người dùng',
    ROLE_GROUP: 'Nhóm quyền',
    DATA_ZONE: 'Vùng quản lý',
    FUNCTION_ROLE: 'Phân quyền chức năng',
    DATA_ROLE: 'Phân quyền vùng quản lý',
    PRICES: 'Bảng giá',
    HISTORY: 'Nhật ký hệ thống',
    NEWREGBUS: 'Danh sách mới đăng ký',
    COMPANY_AWAIT: 'Danh sách đang chờ duyệt',
    COMPANY_NOT_COMFIRM: 'Danh sách không được duyệt',
    COMPANY_LIST_REGISTER: 'Danh sách chờ xác thực',
    COMPANY_LIST_CERTIFIED: 'Danh sách doanh nghiệp tiêu biểu',
    COMPANY_LIST_ACTIVITIED: 'Danh sách đã xác thực',
    COMPANY_LIST_AWAIT_EXPIRED: 'Danh sách sắp hết hạn',
    COMPANY_LIST_EXPIRING: 'Danh sách chờ gia hạn',
    COPANY_LIST_LOCK: 'Danh sách bị khóa',
    FIELD_LIST: 'Danh mục ngành nghề',
    INFORMATION_LIST: 'Danh mục dữ liệu kê khai',
    ACCESS_LIST: 'Danh mục dữ liệu truy xuất',
    REGISTERED_FEE_LIST: 'Danh sách thu tiền đăng ký sử dụng',
    STAMP_FEE_LIST: 'Danh sách thu tiền tem',
    COMPANY_LIST_REQUEST_EXTEND: 'Danh sách yêu cầu gia hạn',
    COMPANY_LIST_REQUEST_UNLOCK: 'Danh sách yêu cầu mở khóa',
    BLOG_LIST: 'Bài viết',
    NEWS_LIST: 'Tin tức',
    MENU_LIST: 'Menu',
    LOGGING_INFORMATION: 'Nhật ký truy xuất',
    DECLARE_INFORMATION: 'Kê khai thông tin',
    RETRIEVE_INFORMATION: 'Truy xuất thông tin',
    CONTENT_WEBSITE: 'Cấu hình',
    STAMP_LIST: 'Quản lý dải tem',
    STAMP_PROVIDE: 'Quản lý cấp phát tem',
    PLANTINGTYPE_LIST: 'Loại vùng sản xuất',
    PLANGTINGZONE_LIST: 'vùng sản xuất',
    PRODUCT_MANAGEMENT: 'Quản lý hàng hóa',
    MATERIAL_MANAGEMENT: 'Quản lý nguyên vật liệu',
    SUMMARY_REPORTS: 'Báo cáo tổng hợp',
    IMPORT_PRODUCT: 'Nhập hàng hóa',
    EXPORT_PRODUCT: 'Xuất hàng hóa',
    MATERIALGROUP: 'Nhóm sản phẩm',
    PRODUCTGROUP: 'Danh sách loại sản phẩm',
    REPORT_COMPANY_CHART: 'Tăng trưởng doanh nghiệp',
    REPORT_STAPM_CHART: 'Tăng trưởng tem',
    REPORT_REGISTER_CHART: 'Tăng trưởng tiền đăng ký',
    REPORT_PRODUCT_CHART: 'Báo cáo hàng hoá',
    REPORT_MANANGER:'Thiết lập báo cáo',
    REPORT_VIEW:'Xem báo cáo',
    REPORT_ZONING_PRODUCT:'Báo cáo quy hoạch',
    SETTING: 'Cài đặt hệ thống',
    PLANNiNG_INTER: 'Danh sách doanh nghiệp/Cá nhân thuộc quy hoạch',
    UNIT: 'Danh sách đơn vị tính',
    PLANNiNG_OUTER: 'Danh sách doanh nghiệp/Cá nhân ngoài quy hoạch',
    PRODUCT_REPORTS: 'Thống kê sản phẩm theo nhóm',
    TRACE: 'Nhật ký sản phẩm',
    PRODUCTS: 'Sản phẩm',
    INVENTORY_MANAGEMENT: 'Quản lý tồn kho',
    ADJUSTMENT_MANAGEMENT: 'Quản lý tồn kho - Phiếu điều chỉnh',
    EXPORT_MANAGEMENT: 'Quản lý tồn kho - Xuất chuyển',
    IMPORT_MANAGEMENT: 'Quản lý tồn kho - Nhập chuyển',
    QRCODE_USED: 'Xin cấp tem, in tem',
    PRODUCTS_VERIFY: 'Danh sách sản phẩm chờ xác thực',
    PARTNER_VERIFY: 'Danh sách nhà cung cấp chờ xác thực',
    PARTNER_MANUFACT_VERIFY: 'Danh sách nhà sản xuất chờ xác thực',
    PARTNER_TRANFORM_VERIFY: 'Danh sách nhà vận chuyển chờ xác thực',
    COMPANY_VERIFY: 'Danh sách doanh nghiệp/HTX/cá nhân chờ xác thực',
    PARTNER: 'Đơn vị xác thực',
    PARTNER_PRINTER: 'Đơn vị in tem',
    QRCODE_MANAGEMENT: 'Quản lí mã QR',
    STAMPREQUESTUSED: 'Danh sách yêu cầu cấp phép sử dụng tem'
};


export const USER_INFO_DROPDOWN = [
    { label: 'Thông tin', url: '/', name: 'infoaccount' },
    { label: 'Đổi mật khẩu', url: '/', name: 'changepass' },
    { label: 'Thoát', url: '/', name: 'logout' }
];

export const PLANTING_ZONE = [
    'Stt',
    'Biểu tượng',
    'Vùng sản xuất',
    // 'Loại vùng sản xuất',
    // 'Địa điểm'
    // 'GPS'
]

export const INVENTORY_MANAGEMENT = [
    'Stt',
    'Kho',
    'Tên hàng hóa',
    'ĐVT',
    'Đầu kỳ',
    'Trong kỳ',
    'Cuối kỳ',
]
export const ADJUSTMENT_MANAGEMENT = [
    'Stt',
    'Thời gian',
    'Kho hàng',
    'Ghi chú',
    'Người thực hiện',
    'Người duyệt',
    'Ngày duyệt',
]
export const EXPORT_MANAGEMENT = [
    'Stt',
    'Thời gian',
    'Từ kho',
    'Đến kho',
    'Ghi chú',
    'Người thực hiện',
    'Người duyệt',
    'Trạng thái',
    'Ngày duyệt',
]
export const IMPORT_MANAGEMENT = [
    'Stt',
    'Thời gian',
    'Từ kho',
    'Đến kho',
    'Ghi chú',
    'Người thực hiện',
    'Người duyệt',
    'Trạng thái',
    'Ngày duyệt',
]

export const IMPORT_PRODUCT = [
    'Stt',
    'Số phiếu',
    'Thời gian',
    'Nhà cung cấp',
    'Trạng thái',
]

export const EXPORT_PRODUCT = [
    'Stt',
    'Số phiếu',
    'Thời gian',
    'Khách hàng',
    'Trạng thái',
]

export const PRODUCTS = [
    'Stt',
    'Số lô',
    'Sản phẩm',
    'Số lượng',
    'Ngày yêu cầu',
    'Trạng thái',
]

export const LIMIT_ITEM_IN_PAGE = 10;
export const LOADING_TIME = 1000;

export const MATERIAL_MANAGEMENT = [
    'Stt',
    'Hình ảnh',
    'Thông tin',
    'Trạng thái',
    'Xác thực',
    'Loại vật liệu',
]


export const PRODUCT_MANAGEMENT = [
    'Stt',
    'Hình ảnh',
    'Thông tin',
    'Trạng thái',
    'Xác thực',
]

export const QRCODE_USED = [
    'Stt',
    'Ngày yêu cầu',
    'SL yêu cầu',
    'Dải tem',
    'Hình thức',
    'Trạng thái',
    'Hiệu lực',
]


export const LOGGING_INFORMATION = [
    'Stt',
    'Hình ảnh',
    'Tiêu đề',
    'Code',
    'Vị trí',
    'Trạng thái',
]

export const DECLARATION_INFORMATION = [
    'Stt',
    'Truy xuất',
    'Tên kê khai',
    'Nhật ký',
    'Quét mã',
]

export const RETRIEVE_INFORMATION = [
    'Stt',
    'Tên truy xuất',
    'Nhật ký',
    'Quét mã',
    'HT đánh giá',
]

export const UNITS = [
    {
        value: 1,
        label: 'km'
    },
    {
        value: 2,
        label: 'm'
    },
    {
        value: 3,
        label: 'hải lý'
    }
]

export const VARIABLES = {
    isFechingAlert: true
}

export const LIMITS = {
    reportV2ListCompany: 1000,
    reportV2ListProduct: 1000,
    reportV2ListQuantityProductByPlantingZone: 1000,
    reportV2ListQuantityProduct: 1000,
    reportV2ListZoningPlantingZone: 1000,
    reportV2ListZoningPlantingZoneByCompany: 1000
}

export const FILE_NAMES = {
    reportV2ListCompany: () => `danh_sach_cong_ty_trong_tinh_${getCurrentDatetimeStringForFile()}.xls`,
    reportV2ListProduct: () => `danh_sach_mat_hang_trong_tinh_${getCurrentDatetimeStringForFile()}.xls`,
    reportV2ListQuantityProductByPlantingZone: () => `san_luong_hang_hoa_theo_vung_${getCurrentDatetimeStringForFile()}.xls`,
    reportV2ListQuantityProduct: () => `san_luong_hang_hoa_chi_tiet_${getCurrentDatetimeStringForFile()}.xls`,
    reportV2ListZoningPlantingZone: () => `bao_cao_quy_hoach_vung_san_xuat_${getCurrentDatetimeStringForFile()}.xls`,
    reportV2ListZoningPlantingZoneByCompany: () => `bao_cao_quy_hoach_vung_san_xuat_theo_doanh_nghiep_${getCurrentDatetimeStringForFile()}.xls`
}