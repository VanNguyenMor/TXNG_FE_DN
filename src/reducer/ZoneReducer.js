import {
  GET_ZONE_LIST_SUCCESS_TYPE,
  GET_ZONE_LIST_FAIL_TYPE,
  GET_ZONE_DETAIL_SUCCESS_TYPE,
  GET_ZONE_DETAIL_FAIL_TYPE,
  CREATE_ZONE_FAIL_TYPE,
  CREATE_ZONE_SUCCESS_TYPE,
  DELETE_ZONE_SUCCESS_TYPE,
  DELETE_ZONE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const zoneReducer = (state, action) => {
    state = state || initialState;
  
    if (action.type === GET_ZONE_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_ZONE_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_ZONE_DETAIL_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_ZONE_DETAIL_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === CREATE_ZONE_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === CREATE_ZONE_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === DELETE_ZONE_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === DELETE_ZONE_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    return state;
};