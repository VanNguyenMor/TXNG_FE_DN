import {
  GET_PERMISSION_LIST_BY_ID_SUCCESS_TYPE,
  GET_PERMISSION_LIST_BY_ID_FAIL_TYPE,
  UPDATE_PERMISSION_SUCCESS_TYPE,
  UPDATE_PERMISSION_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const permissionReducer = (state, action) => {
    state = state || initialState;

    if (action.type === GET_PERMISSION_LIST_BY_ID_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_PERMISSION_LIST_BY_ID_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    
    if (action.type === UPDATE_PERMISSION_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === UPDATE_PERMISSION_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    return state;
};