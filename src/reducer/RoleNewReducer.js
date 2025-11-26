import {
  GET_ROLE_LIST_NEW_TYPE,
  GET_ROLE_LIST_NEW_FAIL_TYPE,
  GET_ROLE_LIST_NEW_SUCCESS_TYPE,
} from "../actions/RoleNewActions";

const initialState = {
  roles: [],
  isLoading: false,
  status: null,
  message: null,
};

export const roleNewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLE_LIST_NEW_TYPE:
      return {
        ...state,
        ...action.data,
        isLoading: true,
      };
    case GET_ROLE_LIST_NEW_SUCCESS_TYPE:
    case GET_ROLE_LIST_NEW_FAIL_TYPE:
      return {
        ...state,
        ...action.data,
        isLoading: false,
      };
    default:
      return state;
  }
};
