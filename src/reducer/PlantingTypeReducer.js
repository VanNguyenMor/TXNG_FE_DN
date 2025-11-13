import {
    GET_PLANTINGTYPE_LIST_SUCCESS_TYPE,
    GET_PLANTINGTYPE_LIST_FAIL_TYPE,
    GET_CREATE_PLANTINGTYPE_LIST_SUCCESS_TYPE,
    GET_CREATE_PLANTINGTYPE_LIST_FAIL_TYPE,
    GET_DELETE_PLANTINGTYPE_LIST_SUCCESS_TYPE,
    GET_DELETE_PLANTINGTYPE_LIST_FAIL_TYPE,
    
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const PLANTINGTYPEReducer = (state, action) => {
    state = state || initialState;
    
    if (action.type === GET_PLANTINGTYPE_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_PLANTINGTYPE_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    if (action.type === GET_CREATE_PLANTINGTYPE_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_CREATE_PLANTINGTYPE_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    if (action.type === GET_DELETE_PLANTINGTYPE_LIST_SUCCESS_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
  
    if (action.type === GET_DELETE_PLANTINGTYPE_LIST_FAIL_TYPE) {
      return {
        data: action.data,
        isLoading: action.isLoading,
        status: action.status,
        message: action.message,
      };
    }
    
    return state;
};