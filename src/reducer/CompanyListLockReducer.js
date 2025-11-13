
import {
    GET_COMPANY_LIST_LOCK_SUCCESS_TYPE,
    GET_COMPANY_LIST_LOCK_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const companyListLockReducer = (state, action) => {
    state = state || initialState;

    if (action.type === GET_COMPANY_LIST_LOCK_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_COMPANY_LIST_LOCK_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    return state;
};