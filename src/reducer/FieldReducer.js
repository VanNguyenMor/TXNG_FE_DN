import {
  GET_FIELD_SUCCESS_TYPE,
  GET_FIELD_FAIL_TYPE,
  GET_CREATE_FIELD_SUCCESS_TYPE,
  GET_CREATE_FIELD_FAIL_TYPE,
  GET_UPDATE_FIELD_SUCCESS_TYPE,
  GET_UPDATE_FIELD_FAIL_TYPE,
  GET_DELETE_FIELD_SUCCESS_TYPE,
  GET_DELETE_FIELD_FAIL_TYPE,
  GET_FIELD_CHILDREN_END_SUCCESS_TYPE,
  GET_FIELD_BY_PRODUCTS_SUCCESS_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const fieldReducer = (state, action) => {
    state = state || initialState;

    if (action.type == GET_FIELD_CHILDREN_END_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type == GET_FIELD_BY_PRODUCTS_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    
    if (action.type === GET_FIELD_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_FIELD_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_CREATE_FIELD_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_CREATE_FIELD_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_UPDATE_FIELD_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_UPDATE_FIELD_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === GET_DELETE_FIELD_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_DELETE_FIELD_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    return state;
};