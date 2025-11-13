import {
  COMPANY_LIST_REGISTERED,
  COMPANY_VERIFY,
  COMPANY_GET_ALL_COMPANY
} from "../apis";
import {
  get, post, del
} from "../services/Dataservice";
import {
  SUCCESS_CODE,
  GET_COMPANY_LIST_REGISTERED_TYPE,
  GET_COMPANY_LIST_REGISTERED_SUCCESS_TYPE,
  GET_COMPANY_LIST_REGISTERED_FAIL_TYPE,
  GET_VERFY_COMPANY_TYPE,
  GET_VERFY_COMPANY_SUCCESS_TYPE,
  GET_VERFY_COMPANY_FAIL_TYPE,
  COMPANY_GET_ALL_COMPANY_TYPE,
  COMPANY_GET_ALL_COMPANY_SUCCESS_TYPE,
  COMPANY_GET_ALL_COMPANY_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyListRegistered = {
  requestCompanyListRegistered: (data) => (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: GET_COMPANY_LIST_REGISTERED_TYPE, data: initialState
      });

      await post(COMPANY_LIST_REGISTERED, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_COMPANY_LIST_REGISTERED_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_COMPANY_LIST_REGISTERED_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_COMPANY_LIST_REGISTERED_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    });
  },

  requestCompanyAll: (data) => (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: COMPANY_GET_ALL_COMPANY_TYPE, data: initialState
      });

      await post(COMPANY_GET_ALL_COMPANY, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: COMPANY_GET_ALL_COMPANY_SUCCESS_TYPE, data: { companyAll: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: COMPANY_GET_ALL_COMPANY_FAIL_TYPE, data: { companyAll: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: COMPANY_GET_ALL_COMPANY_FAIL_TYPE, data: { companyAll: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    });
  },

  requestCompanyListRegisteredCmm: (data) => (dispatch, getState) => {
    return new Promise(async resolve => {
      await post(COMPANY_LIST_REGISTERED, data)
        .then(res => {
          resolve({
            status: true,
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

  requestVerfyCompany: (id) => async (dispatch, getState) => {
    dispatch({
      type: GET_VERFY_COMPANY_TYPE, data: initialState
    });

    return await get(COMPANY_VERIFY + id);
    // .then(res => {
    //     if (res.status === SUCCESS_CODE) {
    //         dispatch({ type: GET_VERFY_COMPANY_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
    //     } else {
    //         dispatch({ type: GET_COMPANY_LIST_REGISTERED_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
    //     }
    // })
    // .catch(err => {
    //     dispatch({ type: GET_VERFY_COMPANY_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
    // })
  }
}