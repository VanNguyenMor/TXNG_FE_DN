import {
  DASHBOARD_DETAIL,
  DASHBOARD_DEBT_COLLECT_OF_REGISTRASTION_OF_USE,
  DASHBOARD_LIABILITIES_STAPM,
  DASHBOARD_GET_ALERTS,
  DASHBOARD_GET_TOTAL_ALERTS,
  DASHBOARD_READ,
  DASHBOARD_READ_ALL,
  DASHBOARD_GET_INFO
} from "../apis";
import { getMulti, getElementMulti, put } from "../services/Dataservice";
import {
  post, del, get
} from "../services/Dataservice";
import {
  SUCCESS_CODE,
  GET_DASHBOARD_TYPE,
  GET_DASHBOARD_SUCCESS_TYPE,
  GET_DASHBOARD_FAIL_TYPE,
  DASHBOARD_GET_ALERTS_TYPE,
  DASHBOARD_GET_ALERTS_SUCCESS_TYPE,
  DASHBOARD_GET_ALERTS_FAIL_TYPE,
  DASHBOARD_GET_TOTAL_ALERTS_TYPE,
  DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE,
  DASHBOARD_GET_TOTAL_ALERTS_FAIL_TYPE,
  DASHBOARD_READ_TYPE,
  DASHBOARD_READ_SUCCESS_TYPE,
  DASHBOARD_READ_FAIL_TYPE,
  DASHBOARD_READ_ALL_TYPE,
  DASHBOARD_READ_ALL_SUCCESS_TYPE,
  DASHBOARD_READ_ALL_FAIL_TYPE,
  DASHBOARD_GET_INFO_TYPE,
  DASHBOARD_GET_INFO_SUCCESS_TYPE,
  DASHBOARD_GET_INFO_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const actionDashboardCreators = {
  getDashboardDetail: () => async (dispatch, getState) => {
    dispatch({ type: GET_DASHBOARD_TYPE, data: initialState });

    await getMulti(
      [
        getElementMulti(DASHBOARD_DETAIL),
        getElementMulti(DASHBOARD_DEBT_COLLECT_OF_REGISTRASTION_OF_USE),
        getElementMulti(DASHBOARD_LIABILITIES_STAPM)
      ])
      .then(res => {
        if (res.status) {
          dispatch({ type: GET_DASHBOARD_SUCCESS_TYPE, data: { data: res.data, isLoading: true, status: true, message: res.message } });
        } else {
          dispatch({ type: GET_DASHBOARD_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: res.message } });
        }
      })
      .catch(err => {
        dispatch({ type: GET_DASHBOARD_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: err.message } });
      });
  },

  getInfoDashboard: () => async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: DASHBOARD_GET_INFO_TYPE, data: initialState
      });

      await get(DASHBOARD_GET_INFO)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({
              type: DASHBOARD_GET_INFO_SUCCESS_TYPE, data: { infoDashboard: res.data, isLoading: true, status: true, message: res.message }
            });
          } else {
            dispatch({
              type: DASHBOARD_GET_INFO_FAIL_TYPE, data: { infoDashboard: [], isLoading: true, status: false, message: res.message }
            });
          }
          resolve(res);
        })
        .catch(err => {
          dispatch({ type: DASHBOARD_GET_INFO_FAIL_TYPE, data: { infoDashboard: [], isLoading: true, status: false, message: err.message } });
          reject(err);
        })
    })
  },

  getAlerts: (data) => async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: DASHBOARD_GET_ALERTS_TYPE, data: initialState
      });

      await get(DASHBOARD_GET_ALERTS + '?page=' + data.page + '&limit=' + data.limit)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({
              type: DASHBOARD_GET_ALERTS_SUCCESS_TYPE, data: { getAlert: res.data, isLoading: true, status: true, message: res.message }
            });
          } else {
            dispatch({
              type: DASHBOARD_GET_ALERTS_FAIL_TYPE, data: { getAlert: [], isLoading: true, status: false, message: res.message }
            });
          }
          resolve(res);
        })
        .catch(err => {
          dispatch({ type: DASHBOARD_GET_ALERTS_FAIL_TYPE, data: { getAlert: [], isLoading: true, status: false, message: err.message } });
          reject(err);
        })
    })
  },

  getTotalAlerts: () => async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: DASHBOARD_GET_TOTAL_ALERTS_TYPE, data: initialState
      });

      await get(DASHBOARD_GET_TOTAL_ALERTS)
        .then(res => {
          if ((res || {}).status === SUCCESS_CODE) {
            dispatch({
              type: DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE, data: { getTotalAlert: res.data || 0, isLoading: true, status: true, message: (res || {}).message }
            });
          } else {
            dispatch({
              type: DASHBOARD_GET_TOTAL_ALERTS_FAIL_TYPE, data: { getTotalAlert: 0, isLoading: true, status: false, message: (res || {}).message }
            });
          }

          resolve(res);
        })
        .catch(err => {
          dispatch({ type: DASHBOARD_GET_TOTAL_ALERTS_FAIL_TYPE, data: { getTotalAlert: [], isLoading: true, status: false, message: err.message } });

          reject(err);
        })
    })
  },

  getRead: (id) => async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: DASHBOARD_READ_TYPE, data: initialState
      });

      await put(DASHBOARD_READ + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({
              type: DASHBOARD_READ_SUCCESS_TYPE, data: { getRead: res.data, isLoading: true, status: true, message: res.message }
            });
          } else {
            dispatch({
              type: DASHBOARD_READ_FAIL_TYPE, data: { getRead: [], isLoading: true, status: false, message: res.message }
            });
          }
          resolve(res);
        })
        .catch(err => {
          dispatch({ type: DASHBOARD_READ_FAIL_TYPE, data: { getRead: [], isLoading: true, status: false, message: err.message } });
          reject(err);
        })
    })
  },

  getReadAll: () => async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      dispatch({
        type: DASHBOARD_READ_ALL_TYPE, data: initialState
      });

      await put(DASHBOARD_READ_ALL)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({
              type: DASHBOARD_READ_ALL_SUCCESS_TYPE, data: { getReadAll: res.data, isLoading: true, status: true, message: res.message }
            });
          } else {
            dispatch({
              type: DASHBOARD_READ_ALL_FAIL_TYPE, data: { getReadAll: [], isLoading: true, status: false, message: res.message }
            });
          }
          resolve(res);
        })
        .catch(err => {
          dispatch({ type: DASHBOARD_READ_ALL_FAIL_TYPE, data: { getReadAll: [], isLoading: true, status: false, message: err.message } });
          reject(err);
        })
    })
  },

};