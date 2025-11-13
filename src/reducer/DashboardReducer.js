import {
  GET_DASHBOARD_SUCCESS_TYPE,
  GET_DASHBOARD_FAIL_TYPE,
  DASHBOARD_GET_ALERTS_SUCCESS_TYPE,
  DASHBOARD_GET_ALERTS_FAIL_TYPE,
  DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE,
  DASHBOARD_GET_TOTAL_ALERTS_FAIL_TYPE,
  DASHBOARD_READ_SUCCESS_TYPE,
  DASHBOARD_READ_FAIL_TYPE,
  DASHBOARD_READ_ALL_SUCCESS_TYPE,
  DASHBOARD_READ_ALL_FAIL_TYPE,
  DASHBOARD_GET_INFO_SUCCESS_TYPE,
  DASHBOARD_GET_INFO_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const dashboardReducer = (state, action) => {
  state = state || initialState;

  if (action.type === GET_DASHBOARD_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_DASHBOARD_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_ALERTS_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_ALERTS_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_TOTAL_ALERTS_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_ALL_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_ALL_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_ALL_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_READ_ALL_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_INFO_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === DASHBOARD_GET_INFO_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};