import {
  COMPANY_GET_LIST_CERTIFIED_SUCCESS_TYPE,
  COMPANY_GET_LIST_CERTIFIED_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const companyListCertifiedReducer = (state, action) => {
    state = state || initialState;

    if (action.type === COMPANY_GET_LIST_CERTIFIED_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === COMPANY_GET_LIST_CERTIFIED_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    return state;
};