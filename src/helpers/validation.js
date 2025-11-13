function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function telephoneCheck(str) {
  var isphone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(str);
  return isphone;
}

export const checkPasswordConfirm = (password, passwordConfirm) => {
  if (password === passwordConfirm) {
    return '';
  }
  else {
    return 'Mật khẩu không khớp';
  }
}

export const checkFieldName = (name, list) => {
  let flag = false;
  list.filter(item => item.fieldName === name.trim())
    .map(item => flag = true);

  if (flag) return "Tên ngành nghề này đã có";
  else return "";
}

export const checkFieldNameBool = (name, list) => {
  let flag = false;

  list.filter(item => item.fieldName === name.trim())
    .map(item => flag = true);

  return flag;
}
export const checkMenuName = (name, list) => {
  let flag = false;
  
  list.filter(item => item.menuName === name.trim())
    .map(item => flag = true);

  if (flag) return "Tên menu này đã có";
  else return "";
}
export const checkMenuNameBool = (name, list) => {
  let flag = false;

  list.filter(item => item.menuName === name.trim())
    .map(item => flag = true);

  return flag;
}

export const rules = {
  required: {
    message: (field) => <p>Không được bỏ trống</p>,
  },

  requiredUsername: {
    test: (val) => val.length > 0,
    message: (field) => `Tên đăng nhập không được bỏ trống`,
  },

  requiredUsernameLength: {
    test: (val) => val.length < 255,
    message: (field) => `Tên đăng nhập nhập tối đa 255 ký tự`,
  },

  requiredFullName: {
    test: (val) => val.length > 0,
    message: (field) => `Họ và tên không được bỏ trống`,
  },
  
  requiredFullNameLength: {
    test: (val) => val.length < 255,
    message: (field) => `Họ và tên nhập tối đa 255 ký tự`,
  },

  requiredPass: {
    test: (val) => val.length > 0,
    message: (field) => `Mật khẩu không được bỏ trống`,
  },

  requiredNumberPhoneIsNull: {
    test: (val) => val.length > 0,
    message: (field) => `Điện thoại không được bỏ trống`,
  },

  requiredNumberPhone: {
    test: (val) => telephoneCheck(val) === true,
    message: (field, val) => val.length > 1 && val.length < 254 && `Điện thoại không đúng định dạng`,
  },

  requiredNumberPhoneLength: {
    test: (val) => val.length < 255,
    message: (field, val) => `Điện thoại không được nhập quá 255 ký tự`,
  },

  requiredEmailIsNull: {
    test: (val) => val.length > 0,
    message: (field) => `Email không được bỏ trống`,
  },

  requiredValidateEmail: {
    test: (val) => validateEmail(val),
    message: (field, val) =>  val.length > 1 && val.length < 254 && `Email không đúng định dạng`,
  },

  requiredEmailLength: {
    test: (val) => val.length < 255,
    message: (field) => `Email không được nhập quá 255 ký tự`,
  },

  maxLength: {
    test: (val) => val.length < 255,
    message: (field) => `Không được nhập quá 255 ký tự`,
  },

  maxLengthPosition: {
    test: (val) => val.length < 255,
    message: (field) => `Chức vụ nhập tối đa 255 ký tự`,
  },

  maxLengthDepartment: {
    test: (val) => val.length < 255,
    message: (field) => `Phòng ban nhập tối đa 255 ký tự`,
  },

  requiredRoleName: {
    test: (val) => val.length > 0,
    message: (field) => `Nhóm quyền không được bỏ trống`,
  },
  
  requiredRoleNameLength: {
    test: (val) => val.length < 255,
    message: (field) => `Nhập tối đa 255 ký tự`,
  },

  requiredYear: {
    test: val => val.length > 0,
    message: (field) => <p>Số năm không được bỏ trống</p>
  },

  requiredYearType: {
    test: val => val > 0,
    message: (field) => <p>Số năm không được nhỏ hơn không</p>
  },
  
  requiredAmount: {
    test: val => val.length > 0,
    message: (field) => <p>Số tiền không được bỏ trống</p>
  },

  requiredAmountType: {
    test: val => val > 0,
    message: (field) => <p>Số tiền không được nhỏ hơn không</p>
  },

  requiredFieldName: {
    test: val => val.length > 0,
    message: (field) => <p>Tên ngành nghề không được bỏ trống</p>
  },

  requiredFieldNameType: {
    test: val => val.length < 255,
    message: (field) => <p>Nhập tối đa 225 ký tự</p>
  },

  requiredNumberLength: {
    test: val => val.length > 0,
    message: (field) =>  <p>Só lượng không được bỏ trống</p>
  },

  requiredNumber: {
    test: val => val > 0,
    message: (field) =>  <p>Só lượng lớn hơn không</p>
  },

  requiredAccessName: {
    test: (val) => val.length > 0,
    message: (field) => <p>Tên truy xuất không được bỏ trống</p>,
  },
  
  requiredAccessNameLength: {
    test: (val) => val.length < 255,
    message: (field) => <p>Nhập tối đa 255 ký tự</p>,
  },

  requiredInformationName: {
    test: (val) => val.length > 0,
    message: (field) => <p>Tên kê khai không được bỏ trống</p>,
  },
  
  requiredInformationNameLength: {
    test: (val) => val.length < 255,
    message: (field) => <p>Nhập tối đa 255 ký tự</p>,
  },
};
  

export const validations = {
  Name: ["requiredAccessName", "requiredAccessNameLength"],
  name: ["requiredAccessName", "requiredAccessNameLength"],
  infoname: ["requiredInformationName", "requiredInformationNameLength"],
  username: ["requiredUsername", "requiredUsernameLength"],
  userName: ["requiredUsername", "requiredUsernameLength"],
  UserName: ["requiredUsername", "requiredUsernameLength"],
  fullName: ["requiredFullName", "requiredFullNameLength"],
  FullName: ["requiredFullName", "requiredFullNameLength"],
  email: ["requiredValidateEmail", "requiredEmailIsNull", "requiredEmailLength"],
  Email: ["requiredValidateEmail", "requiredEmailIsNull", "requiredEmailLength"],
  password: ["requiredPass"],
  passwordHash: ["requiredPass"],
  PasswordHash: ["requiredPass"],
  passwordConfirm: ["requiredPass"],
  phone: ["requiredNumberPhone", "requiredNumberPhoneIsNull", "requiredNumberPhoneLength"],
  phoneNumber: ["requiredNumberPhone", "requiredNumberPhoneIsNull", "requiredNumberPhoneLength"],
  PhoneNumber: ["requiredNumberPhone", "requiredNumberPhoneIsNull", "requiredNumberPhoneLength"],
  position: ["maxLengthPosition"],
  department: ["maxLengthDepartment"],
  Position: ["maxLengthPosition"],
  Department: ["maxLengthDepartment"],
  roleName: ["requiredRoleName", "requiredRoleNameLength"],
  amount: ["requiredAmount", "requiredAmountType"],
  year: ["requiredYear", "requiredYearType"],
  fieldName: ["requiredFieldName", "requiredFieldNameType"],
  quantity: ["requiredNumberLength", "requiredNumber"]
};