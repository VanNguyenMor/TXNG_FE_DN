import {
  
  CONFIG_WEBSITE_GET_SUCCESS_TYPE,
  CONFIG_WEBSITE_GET_FAIL_TYPE,
  
  CONFIG_WEBSITE_UPDATE_SUCCESS_TYPE,
  CONFIG_WEBSITE_UPDATE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const configWebsiteReducer = (state, action) => {
  state = state || initialState;

  if (action.type === CONFIG_WEBSITE_GET_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === CONFIG_WEBSITE_GET_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === CONFIG_WEBSITE_UPDATE_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === CONFIG_WEBSITE_UPDATE_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};