import {
    GET_STAMP_LIST_SUCCESS_TYPE,
    GET_STAMP_LIST_FAIL_TYPE,
    GET_CREATE_STAMP_LIST_SUCCESS_TYPE,
    GET_CREATE_STAMP_LIST_FAIL_TYPE,
    GET_DELETE_STAMP_LIST_SUCCESS_TYPE,
    GET_DELETE_STAMP_LIST_FAIL_TYPE,
    
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const STAMPReducer = (state, action) => {
    state = state || initialState;
    
    if (action.type === GET_STAMP_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_STAMP_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    if (action.type === GET_CREATE_STAMP_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_CREATE_STAMP_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    if (action.type === GET_DELETE_STAMP_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_DELETE_STAMP_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    
    return state;
};