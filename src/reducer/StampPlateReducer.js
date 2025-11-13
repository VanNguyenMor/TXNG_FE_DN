import {
  STAMPTEMPLATE_LIST_SUCCESS_TYPE,
  STAMPTEMPLATE_LIST_FAIL_TYPE,
  STAMPTEMPLATE_GET_SUCCESS_TYPE,
  STAMPTEMPLATE_GET_FAIL_TYPE,
  STAMPTEMPLATE_CREATE_SUCCESS_TYPE,
  STAMPTEMPLATE_CREATE_FAIL_TYPE,
  STAMPTEMPLATE_UPDATE_SUCCESS_TYPE,
  STAMPTEMPLATE_UPDATE_FAIL_TYPE,
  STAMPTEMPLATE_DELETE_SUCCESS_TYPE,
  STAMPTEMPLATE_DELETE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const stampPlateReducer = (state, action) => {
  state = state || initialState;

  if (action.type === STAMPTEMPLATE_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === STAMPTEMPLATE_GET_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === STAMPTEMPLATE_CREATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_CREATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === STAMPTEMPLATE_UPDATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_UPDATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_DELETE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPTEMPLATE_DELETE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};