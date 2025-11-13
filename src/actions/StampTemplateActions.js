import {
  STAMPTEMPLATE_LIST,
  STAMPTEMPLATE_CREATE,
  STAMPTEMPLATE_GET,
  STAMPTEMPLATE_UPDATE,
  STAMPTEMPLATE_DELETE

} from "../apis";
import {
  get, post, del, put
} from "../services/Dataservice";
import {
  SUCCESS_CODE,
  STAMPTEMPLATE_LIST_TYPE,
  STAMPTEMPLATE_LIST_SUCCESS_TYPE,
  STAMPTEMPLATE_LIST_FAIL_TYPE,
  STAMPTEMPLATE_GET_TYPE,
  STAMPTEMPLATE_GET_SUCCESS_TYPE,
  STAMPTEMPLATE_GET_FAIL_TYPE,
  STAMPTEMPLATE_CREATE_TYPE,
  STAMPTEMPLATE_CREATE_SUCCESS_TYPE,
  STAMPTEMPLATE_CREATE_FAIL_TYPE,
  STAMPTEMPLATE_UPDATE_TYPE,
  STAMPTEMPLATE_UPDATE_SUCCESS_TYPE,
  STAMPTEMPLATE_UPDATE_FAIL_TYPE,
  STAMPTEMPLATE_DELETE_TYPE,
  STAMPTEMPLATE_DELETE_SUCCESS_TYPE,
  STAMPTEMPLATE_DELETE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionStampPlate = {
  requestListStampPlate: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: STAMPTEMPLATE_LIST_TYPE, data: initialState });

      await post(STAMPTEMPLATE_LIST, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: STAMPTEMPLATE_LIST_SUCCESS_TYPE, data: { getAll: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: STAMPTEMPLATE_LIST_FAIL_TYPE, data: { getAll: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: STAMPTEMPLATE_LIST_FAIL_TYPE, data: { getAll: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  requestGetStampPlate: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: STAMPTEMPLATE_GET_TYPE, data: initialState });
      await get(STAMPTEMPLATE_GET + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: STAMPTEMPLATE_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: STAMPTEMPLATE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: STAMPTEMPLATE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  requestListCreatePlate: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: STAMPTEMPLATE_CREATE_TYPE, data: initialState });

      await post(STAMPTEMPLATE_CREATE, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: STAMPTEMPLATE_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: STAMPTEMPLATE_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: STAMPTEMPLATE_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  requestListUpdatePlate: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: STAMPTEMPLATE_UPDATE_TYPE, data: initialState });

      await put(STAMPTEMPLATE_UPDATE, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: STAMPTEMPLATE_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: STAMPTEMPLATE_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: STAMPTEMPLATE_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  requestDeletetStampPlate: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: STAMPTEMPLATE_DELETE_TYPE, data: initialState });
      await del(STAMPTEMPLATE_DELETE + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: STAMPTEMPLATE_DELETE_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: STAMPTEMPLATE_DELETE_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: STAMPTEMPLATE_DELETE_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },
}