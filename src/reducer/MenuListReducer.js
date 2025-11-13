import {
  GET_MENU_LIST_SUCCESS_TYPE,
  GET_MENU_LIST_FAIL_TYPE,
  GET_CREATE_MENU_LIST_SUCCESS_TYPE,
  GET_CREATE_MENU_LIST_FAIL_TYPE,
  GET_DELETE_MENU_LIST_SUCCESS_TYPE,
  GET_DELETE_MENU_LIST_FAIL_TYPE,
  GET_UPDATE_MENU_LIST_SUCCESS_TYPE,
  GET_UPDATE_MENU_LIST_FAIL_TYPE,
  GET_GETID_NEWS_LIST_SUCCESS_TYPE,
  GET_GETID_NEWS_LIST_FAIL_TYPE,
  GET_MENU_GET_SUCCESS_TYPE,
  GET_MENU_GET_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const menuReducer = (state, action) => {
  state = state || initialState;

  if (action.type === GET_MENU_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_MENU_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === GET_CREATE_MENU_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_CREATE_MENU_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === GET_DELETE_MENU_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_DELETE_MENU_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === GET_UPDATE_MENU_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_UPDATE_MENU_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === GET_MENU_GET_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_MENU_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};