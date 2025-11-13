import {
    GET_STAMPFEE_LIST_SUCCESS_TYPE,
    GET_STAMPFEE_LIST_FAIL_TYPE,
    GET_STAMPFEE_COMFIRM_SUCCESS_TYPE,
    GET_STAMPFEE_COMFIRM_FAIL_TYPE
  } from "../services/Common";
  
  const initialState = { data: [], isLoading: false, status: null, message: '' };
  
  export const StampFeeListReducer = (state, action) => {
      state = state || initialState;
    
      if (action.type === GET_STAMPFEE_LIST_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_STAMPFEE_LIST_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
      if (action.type === GET_STAMPFEE_COMFIRM_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_STAMPFEE_COMFIRM_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
  
      return state;
  };