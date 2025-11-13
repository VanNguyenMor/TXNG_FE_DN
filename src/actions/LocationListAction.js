import {
  GET_ALL_PROVINCE,
  GET_DISTRICT_BY_ROLE,
  GET_WARD,
} from "../apis";

import {
  get
} from "../services/Dataservice";

import {
  SUCCESS_CODE,
  GET_LOCATION_PROVINCE_TYPE,
  GET_LOCATION_PROVINCE_SUCCESS_TYPE,
  GET_LOCATION_PROVINCE_FAIL_TYPE,
  GET_LOCATION_DISTRICT_TYPE,
  GET_LOCATION_DISTRICT_SUCCESS_TYPE,
  GET_LOCATION_DISTRICT_FAIL_TYPE,
  GET_LOCATION_WARD_TYPE,
  GET_LOCATION_WARD_SUCCESS_TYPE,
  GET_LOCATION_WARD_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionLocationCreators = {

  getProvinceList: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_LOCATION_PROVINCE_TYPE, data: initialState });

      await get(GET_ALL_PROVINCE)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_LOCATION_PROVINCE_SUCCESS_TYPE, data: { province: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_LOCATION_PROVINCE_FAIL_TYPE, data: { province: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_LOCATION_PROVINCE_FAIL_TYPE, data: { province: [], isLoading: true, status: false, message: err.message } });
        });
    });
  },

  getDistrictList: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_LOCATION_DISTRICT_TYPE, data: initialState });

      await get(GET_DISTRICT_BY_ROLE)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_LOCATION_DISTRICT_SUCCESS_TYPE, data: { district: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_LOCATION_DISTRICT_FAIL_TYPE, data: { district: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_LOCATION_DISTRICT_FAIL_TYPE, data: { district: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  getWardList: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_LOCATION_WARD_TYPE, data: initialState });

      await get(GET_WARD + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_LOCATION_WARD_SUCCESS_TYPE, data: { ward: res.data, isLoading: true, status: true, message: res.message } });
            //dispatch({ type: GET_LOCATION_WARD_SUCCESS_TYPE, data: { ward: res.data,  status: true, message: res.message }});
          } else {
            dispatch({ type: GET_LOCATION_WARD_FAIL_TYPE, data: { ward: [], isLoading: true, status: false, message: res.message } });
            //dispatch({ type: GET_LOCATION_WARD_FAIL_TYPE, data: { ward: [],  status: false, message: res.message }});
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_LOCATION_WARD_FAIL_TYPE, data: { ward: [], isLoading: true, status: false, message: err.message } });
          //dispatch({ type: GET_LOCATION_WARD_FAIL_TYPE, data: { ward: [],  status: false, message: err.message }});
          resolve({
            status: false,
            error: err
          });
        });
    });
  },
};