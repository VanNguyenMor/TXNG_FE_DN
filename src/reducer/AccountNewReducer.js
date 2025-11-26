import {
  GET_ACCOUNT_LIST_NEW_TYPE,
  GET_ACCOUNT_LIST_NEW_FAIL_TYPE,
  GET_ACCOUNT_LIST_NEW_SUCCESS_TYPE,
} from "../actions/AccountNewActions";

const initialState = {
  roles: [],
  isLoading: false,
  status: null,
  message: null,
};

export const accountNewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_LIST_NEW_TYPE:
      return {
        ...state,
        ...action.data,
        isLoading: true,
      };
    case GET_ACCOUNT_LIST_NEW_SUCCESS_TYPE:
    case GET_ACCOUNT_LIST_NEW_FAIL_TYPE:
      return {
        ...state,
        ...action.data,
        isLoading: false,
      };
    default:
      return state;
  }
};
