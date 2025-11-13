import {
    GET_COMPANY_REG_LIST_SUCCESS_TYPE,
    GET_COMPANY_REG_LIST_FAIL_TYPE,
    CREATE_COMPANY_SUCCESS_TYPE,
    CREATE_COMPANY_FAIL_TYPE
  } from "../services/Common";
  
  const initialState = { data: [], isLoading: false, status: null, message: '' };
  
  export const newRegBusReducer = (state, action) => {
      state = state || initialState;
    
      if (action.type === GET_COMPANY_REG_LIST_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_COMPANY_REG_LIST_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
      
      if (action.type === CREATE_COMPANY_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === CREATE_COMPANY_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }

      return state;
  };