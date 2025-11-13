import {
    PRODUCT_GROUP_LIST_SUCCESS_TYPE,
    PRODUCT_GROUP_LIST_FAIL_TYPE,
    PRODUCT_GROUP_GET_SUCCESS_TYPE,
    PRODUCT_GROUP_GET_FAIL_TYPE,
    PRODUCT_GROUP_CREATE_SUCCESS_TYPE,
    PRODUCT_GROUP_CREATE_FAIL_TYPE,
    PRODUCT_GROUP_UPDATE_SUCCESS_TYPE,
    PRODUCT_GROUP_UPDATE_FAIL_TYPE,
    PRODUCT_GROUP_DELETE_SUCCESS_TYPE,
    PRODUCT_GROUP_DELETE_FAIL_TYPE,
    PRODUCT_GROUP_LOCK_SUCCESS_TYPE,
    PRODUCT_GROUP_LOCK_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const ProductGroupReducer = (state, action) => {
    state = state || initialState;

    if (action.type === PRODUCT_GROUP_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === PRODUCT_GROUP_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_GET_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_GET_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_GET_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_GET_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_CREATE_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_CREATE_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_UPDATE_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_UPDATE_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_DELETE_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_DELETE_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_LOCK_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }

    if (action.type === PRODUCT_GROUP_LOCK_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    return state;
};