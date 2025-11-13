import {
  GET_INFORMATION_SUCCESS_TYPE,
  GET_INFORMATION_FAIL_TYPE,
  GET_CREATE_INFORMATION_SUCCESS_TYPE,
  GET_CREATE_INFORMATION_FAIL_TYPE,
  GET_UPDATE_INFORMATION_SUCCESS_TYPE,
  GET_UPDATE_INFORMATION_FAIL_TYPE,
  GET_DELETE_INFORMATION_SUCCESS_TYPE,
  GET_DELETE_INFORMATION_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const informationReducer = (state, action) => {
    state = state || initialState;
    
    if (action.type === GET_INFORMATION_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_INFORMATION_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_CREATE_INFORMATION_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_CREATE_INFORMATION_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_UPDATE_INFORMATION_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_UPDATE_INFORMATION_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_DELETE_INFORMATION_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_DELETE_INFORMATION_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    return state;
};