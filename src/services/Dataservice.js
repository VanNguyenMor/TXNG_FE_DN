import axios from "axios";
import { MESSAGE_CHECK_NET_WORK } from "../services/Common";
import { deleteCookie } from "../helpers/cookie";
import { getRefreshToken } from "../views/pages/Login"
import { VARIABLES } from "../helpers/constant";
import { actionCreators } from "../actions/AuthenActions";

/**
 * getHeader: Get Header
 * @param formData: true -> is use form data
 */
export function getHeader(formData = false) {

  var header = localStorage.getItem('TOKEN') !== null ? {
    Accept: "application/json",
    "Content-Type": formData ? "multipart/form-data" : "application/json; charset=utf-8 ",
    'Authorization': localStorage.getItem('TOKEN')
  } : {
    Accept: "application/json",
    "Content-Type": formData ? "multipart/form-data" : "application/json; charset=utf-8 ",
  };

  return header;
}

function _getHeader() {
  const header = localStorage.getItem('TOKEN') !== null ? {
    'Authorization': localStorage.getItem('TOKEN')
  } : {};

  return header;
}

export const get = async (url, params = {}) => {
  return await axios.get(url, {
    headers: getHeader(),
    params: params,
    crossDomain: true
  })
    .then(res => {
      if (res.status === 200) {
        return { data: res.data.data, status: res.data.status, message: res.data.message, result: (res.data || {}).result };
      }
      // else if (res.status == 401) {
      //     deleteCookie('AUTHEN_INFO');
      //     window.location.href = '/';
      // } 
      else {
        return { data: null, status: res.data.status, message: res.data.message };
      }
    })
    .catch(err => {

      if ((err.response || {}).status == 401) {
        VARIABLES.isFechingAlert = false;

        getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
          VARIABLES.isFechingAlert = true;

          if (result) {
            return await get(url);
          } else {
            deleteCookie('AUTHEN_INFO');
            window.location.href = '/';
          }
        }
        );
        if (url.search('roleperminssion/getgridview/') > -1) {
          window.location.reload();
        }

      } else {
        if (typeof (err.response) !== 'undefined') {
          return { data: null, status: err.response.status, message: err.message };
        } else {
          return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
        }
      }
    });
}

export const post = async (url, data) => {

  return await axios({
    method: 'post',
    url: url,
    headers: getHeader(),
    data: data
  }).then(res => {
    if (res.status === 200) {
      return { data: res.data.data, status: res.data.status, message: res.data.message };
    }
    // else if (res.status == 401) {
    //     deleteCookie('AUTHEN_INFO');
    //     window.location.href = '/';
    // } 
    else {
      return { data: null, status: res.data.status, message: res.data.message };
    }
  }).catch(err => {
    if ((err.response || {}).status == 401) {

      VARIABLES.isFechingAlert = false;

      getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
        VARIABLES.isFechingAlert = true;

        if (result) {
          return await post(url, data);
        } else {
          deleteCookie('AUTHEN_INFO');
          window.location.href = '/';
        }
      });
    } else {
      if (typeof (err.response) !== 'undefined') {
        return { data: null, status: err.response.status, message: err.response.data.message };
      } else {
        return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
      }
    }
  });
}

export const put = async (url, data) => {
  return await axios({
    method: 'put',
    url: url,
    headers: getHeader(),
    data: data
  }).then(res => {
    if (res.status === 200) {
      return { data: res.data.data, status: res.data.status, message: res.data.message };
    }
    // else if (res.status == 401) {
    //     deleteCookie('AUTHEN_INFO');
    //     window.location.href = '/';
    // } 
    else {
      return { data: null, status: res.data.status, message: res.data.message };
    }
  }).catch(err => {
    if ((err.response || {}).status == 401) {

      VARIABLES.isFechingAlert = false;

      getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
        VARIABLES.isFechingAlert = true;

        if (result) {
          return await put(url, data);
        } else {
          deleteCookie('AUTHEN_INFO');
          window.location.href = '/';
        }
      });
    } else {
      if (typeof (err.response) !== 'undefined') {
        return { data: null, status: err.response.status, message: err.response.data.message };
      } else {
        return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
      }
    }
  });
}

export const postFormData = async (url, data) => {
  return await axios({
    method: 'post',
    url: url,
    headers: getHeader(true),
    data: data
  }).then(res => {
    if (res.status === 200) {
      return { data: res.data.data, status: res.data.status, message: res.data.message };
    }
    // else if (res.status == 401) {
    //     deleteCookie('AUTHEN_INFO');
    //     window.location.href = '/';
    // } 
    else {
      return { data: null, status: res.data.status, message: res.data.message };
    }
  }).catch(err => {
    if ((err.response || {}).status == 401) {

      VARIABLES.isFechingAlert = false;

      getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
        VARIABLES.isFechingAlert = true;

        if (result) {
          return await postFormData(url, data);
        } else {
          deleteCookie('AUTHEN_INFO');
          window.location.href = '/';
        }
      });
    } else {
      if (typeof (err.response) !== 'undefined') {
        return { data: null, status: err.response.status, message: err.response.data.message };
      } else {
        return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
      }
    }
  });
}

export const putFormData = async (url, data) => {
  return await axios({
    method: 'put',
    url: url,
    headers: getHeader(true),
    data: data
  }).then(res => {
    if (res.status === 200) {
      return { data: res.data.data, status: res.data.status, message: res.data.message };
    }
    else {
      return { data: null, status: res.data.status, message: res.data.message };
    }
  }).catch(err => {
    if ((err.response || {}).status == 401) {

      VARIABLES.isFechingAlert = false;

      getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
        VARIABLES.isFechingAlert = true;

        if (result) {
          return await putFormData(url, data);
        } else {
          deleteCookie('AUTHEN_INFO');
          window.location.href = '/';
        }
      });
    } else {
      if (typeof (err.response) !== 'undefined') {
        return { data: null, status: err.response.status, message: err.response.data.message };
      } else {
        return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
      }
    }
  });
}

export const del = async (url) => {
  return await axios.delete(url, {
    headers: getHeader(),
    crossDomain: true
  })
    .then(res => {
      if (res.status === 200) {
        return { data: res.data.data, status: res.data.status, message: res.data.message };
      }
      // else if (res.status == 401) {
      //     deleteCookie('AUTHEN_INFO');
      //     window.location.href = '/';
      // } 
      else {
        return { data: null, status: res.data.status, message: res.data.message };
      }
    })
    .catch(err => {
      if (err.response.status == 401) {

        VARIABLES.isFechingAlert = false;

        getRefreshToken(actionCreators.userLogin, actionCreators.loginSuccess).then(async result => {
          VARIABLES.isFechingAlert = true;

          if (result) {
            return await del(url);
          } else {
            deleteCookie('AUTHEN_INFO');
            window.location.href = '/';
          }

          VARIABLES.isFechingAlert = true;
        });
      } else {
        if (typeof (err.response) !== 'undefined') {
          return { data: null, status: err.response.status, message: err.response.data?.message || err.message };
        } else {
          return { data: null, status: false, message: MESSAGE_CHECK_NET_WORK };
        }
      }
    });
}

/* Multi */
export const getElementMulti = async (url) => {
  return await axios.get(url, {
    headers: getHeader(),
    crossDomain: true
  });
}

export const getMulti = async (url) => {
  return await axios.all(url, {
    headers: getHeader(),
    crossDomain: true
  })
    .then(res => {
      return { data: res, status: true, message: 'Lấy thông tin thành công' };
    })
    .catch(err => {
      return { data: null, status: false, message: 'Lấy thông tin không thành công' };
    });
}