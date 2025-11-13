import {
    GET_REGISTEREDFEE_LIST_SUCCESS_TYPE,
    GET_REGISTEREDFEE_LIST_FAIL_TYPE,
    GET_REGISTEREDFEE_COMFIRM_SUCCESS_TYPE,
    GET_REGISTEREDFEE_COMFIRM_FAIL_TYPE
  } from "../services/Common";
  
  const initialState = { data: [], isLoading: false, status: null, message: '' };
  
  export const RegisteredListReducer = (state, action) => {
      state = state || initialState;
    
      if (action.type === GET_REGISTEREDFEE_LIST_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_REGISTEREDFEE_LIST_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
      if (action.type === GET_REGISTEREDFEE_COMFIRM_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_REGISTEREDFEE_COMFIRM_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
  
      return state;
  };