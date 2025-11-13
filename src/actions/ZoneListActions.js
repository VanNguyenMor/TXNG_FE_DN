import { 
  ZONE_LIST,
  ZONE_LIST_BY_ID,
  CREATE_ZONE,
  UPDATE_ZONE,
  DELETE_ZONE
} from "../apis";

import { 
  post, get, del 
} from "../services/Dataservice";

import { 
  SUCCESS_CODE, 
  GET_ZONE_LIST_TYPE, 
  GET_ZONE_LIST_SUCCESS_TYPE, 
  GET_ZONE_LIST_FAIL_TYPE,
  GET_ZONE_DETAIL_TYPE, 
  GET_ZONE_DETAIL_SUCCESS_TYPE, 
  GET_ZONE_DETAIL_FAIL_TYPE,
  CREATE_ZONE_TYPE,
  CREATE_ZONE_SUCCESS_TYPE,
  CREATE_ZONE_FAIL_TYPE,
  UPDATE_ZONE_TYPE,
  UPDATE_ZONE_SUCCESS_TYPE,
  UPDATE_ZONE_FAIL_TYPE,
  DELETE_ZONE_TYPE,
  DELETE_ZONE_SUCCESS_TYPE,
  DELETE_ZONE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionZoneCreators = {

  getAllZoneList: (data) => async (dispatch, getState) => {
    dispatch({ type: GET_ZONE_LIST_TYPE, data: initialState });

    await post(ZONE_LIST, data)
      .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_ZONE_LIST_SUCCESS_TYPE, data: { zone: res.data, isLoading: true, status: true, message: res.message }});
          } else {
            dispatch({ type: GET_ZONE_LIST_FAIL_TYPE, data: { zone: [], isLoading: true, status: false, message: res.message }});
          }
      })
      .catch(err => {
        dispatch({ type: GET_ZONE_LIST_FAIL_TYPE, data: { zone: [], isLoading: true, status: false, message: err.message }});
      });
  },

  getZoneDetail: (id) => async (dispatch, getState) => {
    dispatch({ type: GET_ZONE_DETAIL_TYPE, data: initialState });

    await get(ZONE_LIST_BY_ID + id)
      .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_ZONE_DETAIL_SUCCESS_TYPE, data: { detail: res.data, isLoading: true, status: true, message: res.message }});
          } else {
            dispatch({ type: GET_ZONE_DETAIL_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: res.message }});
          }
      })
      .catch(err => {
        dispatch({ type: GET_ZONE_DETAIL_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: err.message }});
      });
  },

  createZone: (data) => async (dispatch, getState) => {
    dispatch({ type: CREATE_ZONE_TYPE, data: initialState });

    await post(CREATE_ZONE, data)
      .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: CREATE_ZONE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }});
          } else {
            dispatch({ type: CREATE_ZONE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }});
          }
      })
      .catch(err => {
        dispatch({ type: CREATE_ZONE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message }});
      });
  },

  deleteZone: (id) => async (dispatch, getState) => {
    dispatch({ type: DELETE_ZONE_TYPE, data: initialState });

    await del(DELETE_ZONE + id)
      .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: DELETE_ZONE_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message }});
          } else {
            dispatch({ type: DELETE_ZONE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message }});
          }
      })
      .catch(err => {
        dispatch({ type: DELETE_ZONE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message }});
      });
  },
};