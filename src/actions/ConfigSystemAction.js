import {
  CONFIG_GET_CONFIG_SYSTEM,
  CONFIG_GET_INFO_COMPANY,
  CONFIG_GET_LIST_CONFIG_SERVER,
  CONFIG_GET_LIST_PROVINCE_FOR_INFO_COMPANY,
  CONFIG_GET_LIST_DISTRICT_FOR_INFO_COMPANY,
  CONFIG_GET_LIST_WARD_FOR_INFO_COMPANY,
  CONFIG_UPDATE_INFO_COMPANY,
  CONFIG_UPDATE_CONFIG_SYSTEM,
  CONFIG_CREATE_FTP,
  CONFIG_UPDATE_FTP,
  CONFIG_DELETE_FTP,
  CONFIG_GET_FTP,
  CONFIG_GET_LIST_ALERT_ROLES,
  CONFIG_CREATE_ALERT_ROLES,
  CONFIG_DELETE_ALERT_ROLES,
  CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT,
  CONFIG_GET_LIST_ROLES_BY_SELECT,
  CONFIG_GET_LIST_STAMP_PRICE,
  CONFIG_CREATE_STAMP_PRICE,
  CONFIG_UPDATE_STAMP_PRICE,
  CONFIG_DELETE_STAMP_PRICE,
  CONFIG_DETAIL_STAMP_PRICE
} from "../apis";
import {
  get, post, del, postFormData
} from "../services/Dataservice";
import {
  CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
  CONFIG_FETCH_LIST_CONFIG_SERVER_SUCCESS,
  CONFIG_FETCH_INFO_COMPANY_SUCCESS,
  CONFIG_FETCH_LIST_PROVINCE_FOR_INFO_COMPANY_SUCCESS,
  CONFIG_FETCH_LIST_DISTRICT_FOR_INFO_COMPANY_SUCCESS,
  CONFIG_FETCH_LIST_WARD_FOR_INFO_COMPANY_SUCCESS,
  CONFIG_CREATE_FTP_SUCCESS,
  CONFIG_UPDATE_FTP_SUCCESS,
  CONFIG_DELETE_FTP_SUCCESS,
  CONFIG_GET_FTP_SUCCESS,
  CONFIG_GET_LIST_ALERT_ROLES_TYPE,
  CONFIG_GET_LIST_ALERT_SUCCESS_TYPE,
  CONFIG_GET_LIST_ALERT_ROLES_FAIL_TYPE,
  CONFIG_CREATE_ALERT_ROLES_TYPE,
  CONFIG_CREATE_ALERT_ROLES_SUCCESS_TYPE,
  CONFIG_CREATE_ALERT_ROLES_FAIL_TYPE,
  CONFIG_DELETE_ALERT_ROLES_TYPE,
  CONFIG_DELETE_ALERT_ROLES_SUCCESS_TYPE,
  CONFIG_DELETE_ALERT_ROLES_FAIL_TYPE,
  CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_TYPE,
  CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_SUCCESS_TYPE,
  CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_FAIL_TYPE,
  CONFIG_GET_LIST_ROLES_BY_SELECT_TYPE,
  CONFIG_GET_LIST_ROLES_BY_SELECT_FAIL_TYPE,
  CONFIG_GET_LIST_ROLES_BY_SELECT_SUCCESS_TYPE,
  CONFIG_GET_LIST_STAMP_PRICE_FAIL_TYPE,
  CONFIG_GET_LIST_STAMP_PRICE_SUCCESS_TYPE,
  CONFIG_GET_LIST_STAMP_PRICE_TYPE,
  CONFIG_CREATE_STAMP_PRICE_FAIL_TYPE,
  CONFIG_CREATE_STAMP_PRICE_SUCCESS_TYPE,
  CONFIG_CREATE_STAMP_PRICE_TYPE,
  CONFIG_DELETE_STAMP_PRICE_FAIL_TYPE,
  CONFIG_DELETE_STAMP_PRICE_SUCCESS_TYPE,
  CONFIG_DELETE_STAMP_PRICE_TYPE,
  CONFIG_UPDATE_STAMP_PRICE_FAIL_TYPE,
  CONFIG_UPDATE_STAMP_PRICE_SUCCESS_TYPE,
  CONFIG_UPDATE_STAMP_PRICE_TYPE,
  CONFIG_DETAIL_STAMP_PRICE_FAIL_TYPE,
  CONFIG_DETAIL_STAMP_PRICE_SUCCESS_TYPE,
  CONFIG_DETAIL_STAMP_PRICE_TYPE
} from "../services/Common";

export const configSystemAction = {
  getInfoCompany: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_INFO_COMPANY_SUCCESS,
        data: {}
      });

      get(CONFIG_GET_INFO_COMPANY, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_INFO_COMPANY_SUCCESS,
              data: res.data || {}
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getConfigSystem: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
        data: {}
      });

      get(CONFIG_GET_INFO_COMPANY, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
              data: res.data || {}
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getConfigServer: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_LIST_CONFIG_SERVER_SUCCESS,
        data: {}
      });
      const url = CONFIG_GET_LIST_CONFIG_SERVER.replace('{0}', data.companyId);
      get(url, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_LIST_CONFIG_SERVER_SUCCESS,
              data: res.data || []
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getListProvinceForInfoCompany: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_LIST_PROVINCE_FOR_INFO_COMPANY_SUCCESS,
        data: []
      });

      get(CONFIG_GET_LIST_PROVINCE_FOR_INFO_COMPANY, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_LIST_PROVINCE_FOR_INFO_COMPANY_SUCCESS,
              data: res.data ? [res.data] : []
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getListDistrictForInfoCompany: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_LIST_DISTRICT_FOR_INFO_COMPANY_SUCCESS,
        data: []
      });

      get(CONFIG_GET_LIST_DISTRICT_FOR_INFO_COMPANY, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_LIST_DISTRICT_FOR_INFO_COMPANY_SUCCESS,
              data: res.data || []
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getListWardForInfoCompany: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_LIST_WARD_FOR_INFO_COMPANY_SUCCESS,
        data: []
      });

      const url = CONFIG_GET_LIST_WARD_FOR_INFO_COMPANY.replace('{0}', data.districtId);

      get(url, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_LIST_WARD_FOR_INFO_COMPANY_SUCCESS,
              data: res.data || []
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  updateInfoCompany: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      postFormData(CONFIG_UPDATE_INFO_COMPANY, data)
        .then(res => {
          if (res.status == 200) {
            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getConfigSetting: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
        data: {}
      });

      get(CONFIG_GET_CONFIG_SYSTEM, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
              data: res.data || {}
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  updateConfigSystem: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      postFormData(CONFIG_UPDATE_CONFIG_SYSTEM, data)
        .then(res => {
          if (res.status == 200) {
            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getFtp: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_GET_FTP_SUCCESS,
        data: []
      });
      const url = CONFIG_GET_FTP.replace('{0}', data.id);
      get(url, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_GET_FTP_SUCCESS,
              data: res.data || []
            });

            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  createFtp: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      post(CONFIG_CREATE_FTP, data)
        .then(res => {
          if (res.status == 200) {
            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  updateFtp: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      post(CONFIG_UPDATE_FTP, data)
        .then(res => {
          if (res.status == 200) {
            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  deleteFtp: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      postFormData(CONFIG_DELETE_FTP, data)
        .then(res => {
          if (res.status == 200) {
            resolve({
              status: true,
              data: res
            });

            return;
          }

          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getListAlertRoles: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_GET_LIST_ALERT_ROLES_TYPE,
        data: []
      });
      post(CONFIG_GET_LIST_ALERT_ROLES, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_GET_LIST_ALERT_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  createAlertRoles: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_CREATE_ALERT_ROLES_TYPE,
        data: []
      });
      post(CONFIG_CREATE_ALERT_ROLES, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_CREATE_ALERT_ROLES_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  deleteAlertRoles: (data) => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_DELETE_ALERT_ROLES_TYPE,
        data: []
      });
      del(CONFIG_DELETE_ALERT_ROLES + data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_DELETE_ALERT_ROLES_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getAllAlertBySelect: () => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_TYPE,
        data: []
      });
      get(CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getAllRolesBySelect: () => async (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch({
        type: CONFIG_GET_LIST_ROLES_BY_SELECT_TYPE,
        data: []
      });
      get(CONFIG_GET_LIST_ROLES_BY_SELECT)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_GET_LIST_ROLES_BY_SELECT_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },

  getAllStampPrice: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: CONFIG_GET_LIST_STAMP_PRICE_TYPE,
        data: []
      });
      await post(CONFIG_GET_LIST_STAMP_PRICE, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_GET_LIST_STAMP_PRICE_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },


  createStampPrice: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: CONFIG_CREATE_STAMP_PRICE_TYPE,
        data: []
      });
      await post(CONFIG_CREATE_STAMP_PRICE, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_CREATE_STAMP_PRICE_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
  getDetailStampPrice: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: CONFIG_DETAIL_STAMP_PRICE_TYPE,
        data: []
      });
      await get(CONFIG_DETAIL_STAMP_PRICE + id)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_DETAIL_STAMP_PRICE_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  },

  updateStampPrice: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: CONFIG_UPDATE_STAMP_PRICE_TYPE,
        data: []
      });
      await post(CONFIG_UPDATE_STAMP_PRICE, data)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_UPDATE_STAMP_PRICE_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });

  },

  deleteStampPrice: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: CONFIG_DELETE_STAMP_PRICE_TYPE,
        data: []
      });
      await del(CONFIG_DELETE_STAMP_PRICE + id)
        .then(res => {
          if (res.status == 200) {
            dispatch({
              type: CONFIG_DELETE_STAMP_PRICE_SUCCESS_TYPE,
              data: res.data || []
            });
            resolve({
              status: true,
              data: res
            });
            return;
          }
          resolve({
            status: false,
            data: res
          });
        })
        .catch(err => {
          resolve({
            status: false,
            error: err
          });
        })
    });
  }
}