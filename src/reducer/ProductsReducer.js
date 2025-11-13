import {
  PRODUCTS_LIST_SUCCESS_TYPE,
  PRODUCTS_LIST_FAIL_TYPE,
  PRODUCTS_GET_SUCCESS_TYPE,
  PRODUCTS_GET_FAIL_TYPE,
  PRODUCTS_LIST_LOCK_SUCCESS_TYPE,
  PRODUCTS_LIST_LOCK_FAIL_TYPE,
  PRODUCTS_CONFIRM_SUCCESS_TYPE,
  PRODUCTS_CONFIRM_FAIL_TYPE,
  PRODUCTS_UNCONFIRM_SUCCESS_TYPE,
  PRODUCTS_UNCONFIRM_FAIL_TYPE,
  PRODUCTS_DELETE_UPLOAD_VERIFY_FAIL_TYPE,
  PRODUCTS_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE,
  PRODUCTS_UPLOAD_VERIFY_SUCCESS_TYPE,
  PRODUCTS_UPLOAD_VERIFY_FAIL_TYPE,
  PRODUCTS_LIST_VERIFY_SUCCESS_TYPE,
  PRODUCTS_LIST_VERIFY_FAIL_TYPE,
  PRODUCTS_VERIFY_IMAGE_SUCCESS_TYPE,
  PRODUCTS_VERIFY_IMAGE_FAIL_TYPE,
  PRODUCTS_LIST_IN_ALERT_SUCCESS_TYPE,
  PRODUCTS_LIST_IN_ALERT_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const productsReducer = (state, action) => {
  state = state || initialState;

  if (action.type === PRODUCTS_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_IN_ALERT_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_IN_ALERT_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_GET_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_LOCK_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_LOCK_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_CONFIRM_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_CONFIRM_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_UNCONFIRM_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_UNCONFIRM_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_DELETE_UPLOAD_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_UPLOAD_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_UPLOAD_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_LIST_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_VERIFY_IMAGE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === PRODUCTS_VERIFY_IMAGE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};