import {
    GET_LOCATION_PROVINCE_SUCCESS_TYPE,
    GET_LOCATION_PROVINCE_FAIL_TYPE,
    GET_LOCATION_DISTRICT_SUCCESS_TYPE,
    GET_LOCATION_DISTRICT_FAIL_TYPE,
    GET_LOCATION_WARD_SUCCESS_TYPE,
    GET_LOCATION_WARD_FAIL_TYPE
  } from "../services/Common";
  
  const initialState = { data: [], isLoading: false, status: null, message: '' };
  
  export const locationReducer = (state, action) => {
      state = state || initialState;
    
      if (action.type === GET_LOCATION_PROVINCE_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_LOCATION_PROVINCE_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
      
      if (action.type === GET_LOCATION_DISTRICT_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_LOCATION_DISTRICT_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
      if (action.type === GET_LOCATION_WARD_SUCCESS_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }
    
      if (action.type === GET_LOCATION_WARD_FAIL_TYPE) {
        return {
          data: action.data,
          isLoading: action.isLoading,
          status: action.status,
          message: action.message,
        };
      }

      return state;
  };