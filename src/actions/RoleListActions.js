import {
  ROLE_LIST,
  ROLE_LIST_BY_ID,
  ROLE_CREATE_NEW,
  ROLE_UPDATE_INFO,
  ROLE_DELETE
} from "../apis";

import {
  post, get, del
} from "../services/Dataservice";

import {
  SUCCESS_CODE,
  GET_ROLE_LIST_TYPE,
  GET_ROLE_LIST_SUCCESS_TYPE,
  GET_ROLE_LIST_FAIL_TYPE,
  CREATE_ROLE_TYPE,
  CREATE_ROLE_SUCCESS_TYPE,
  CREATE_ROLE_FAIL_TYPE,
  UPDATE_ROLE_TYPE,
  UPDATE_ROLE_SUCCESS_TYPE,
  UPDATE_ROLE_FAIL_TYPE,
  DELETE_ROLE_TYPE,
  DELETE_ROLE_SUCCESS_TYPE,
  DELETE_ROLE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionRoleCreators = {

  getAllRoleList: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_ROLE_LIST_TYPE, data: initialState });

      await post(ROLE_LIST, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_ROLE_LIST_SUCCESS_TYPE, data: { roles: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_ROLE_LIST_FAIL_TYPE, data: { roles: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_ROLE_LIST_FAIL_TYPE, data: { roles: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    })
  },

  getAllRoleListByID: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_ROLE_LIST_TYPE, data: initialState });

      await get(ROLE_LIST_BY_ID + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_ROLE_LIST_SUCCESS_TYPE, data: { detail: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_ROLE_LIST_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_ROLE_LIST_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },

  createNewRole: (data) => async (dispatch, getState) => {
    dispatch({ type: CREATE_ROLE_TYPE, data: initialState });

    return await post(ROLE_CREATE_NEW, data);
  },

  updateRoleInfo: (data) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_ROLE_TYPE, data: initialState });

    return await post(ROLE_UPDATE_INFO, data);
  },

  deleteRoleInfo: (id) => async (dispatch, getState) => {
    dispatch({ type: DELETE_ROLE_TYPE, data: initialState });

    return await del(ROLE_DELETE + id);
  },
};