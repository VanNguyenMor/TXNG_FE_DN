import {
  MATERIAL_GROUP_LIST_SUCCESS_TYPE,
  MATERIAL_GROUP_LIST_FAIL_TYPE,
  MATERIAL_GROUP_LOG_LIST_SUCCESS_TYPE,
  MATERIAL_GROUP_LOG_LIST_FAIL_TYPE,
  MATERIAL_GROUP_GET_SUCCESS_TYPE,
  MATERIAL_GROUP_GET_FAIL_TYPE,
  MATERIAL_GROUP_CREATE_SUCCESS_TYPE,
  MATERIAL_GROUP_CREATE_FAIL_TYPE,
  MATERIAL_GROUP_UPDATE_SUCCESS_TYPE,
  MATERIAL_GROUP_UPDATE_FAIL_TYPE,
  MATERIAL_GROUP_DELETE_SUCCESS_TYPE,
  MATERIAL_GROUP_DELETE_FAIL_TYPE,
  MATERIAL_GROUP_LOCK_SUCCESS_TYPE,
  MATERIAL_GROUP_LOCK_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const materialGroupReducer = (state, action) => {
  state = state || initialState;

  if (action.type === MATERIAL_GROUP_LOG_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_LOG_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_GET_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_CREATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_CREATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_UPDATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_UPDATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_DELETE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_DELETE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_LOCK_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === MATERIAL_GROUP_LOCK_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  return state;
};