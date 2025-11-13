import {
    GET_LOGIN_SUCCESS_TYPE,
    GET_LOGIN_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const authenReducer = (state, action) => {
    state = state || initialState;

    if (action.type === GET_LOGIN_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_LOGIN_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    return state;
};