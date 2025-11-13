import {
  GET_COMPANY_GET_DETAILS_SUCCESS_TYPE,
  GET_COMPANY_GET_DETAILS_FAIL_TYPE,
  GET_COMPANY_GET_FILEUPDATE_FAIL_TYPE,
  GET_COMPANY_GET_FILEUPDATE_SUCCESS_TYPE,

  COMPANY_LIST_VERIFY_SUCCESS_TYPE,
  COMPANY_LIST_VERIFY_FAIL_TYPE,

  COMPANY_VERIFY_IMAGE_SUCCESS_TYPE,
  COMPANY_VERIFY_IMAGE_FAIL_TYPE,

  COMPANY_UPLOAD_VERIFY_SUCCESS_TYPE,
  COMPANY_UPLOAD_VERIFY_FAIL_TYPE,

  COMPANY_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE,
  COMPANY_DELETE_UPLOAD_VERIFY_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const companyGetDetailsReducer = (state, action) => {
  state = state || initialState;

  if (action.type === GET_COMPANY_GET_DETAILS_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_COMPANY_GET_DETAILS_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_COMPANY_GET_FILEUPDATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_COMPANY_GET_FILEUPDATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_LIST_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_LIST_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_VERIFY_IMAGE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_VERIFY_IMAGE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_UPLOAD_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_UPLOAD_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === COMPANY_DELETE_UPLOAD_VERIFY_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};