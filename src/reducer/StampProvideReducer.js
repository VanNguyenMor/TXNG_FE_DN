import {

  GET_STAMPPROVIDE_LIST_SUCCESS_TYPE,
  GET_STAMPPROVIDE_LIST_FAIL_TYPE,

  GET_COMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE,
  GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE,

  GET_UNCOMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE,
  GET_UNCOMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE,

  GET_QRCODE_STAMPID_SUCCESS_TYPE,
  GET_QRCODE_STAMPID_FAIL_TYPE,

  GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_FAIL_TYPE,
  GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_SUCCESS_TYPE,

  STAMPPROVIDE_PRINT_SUCCESS_TYPE,
  STAMPPROVIDE_PRINT_FAIL_TYPE,

  STAMPPROVIDE_HAS_PRINTED_SUCCESS_TYPE,
  STAMPPROVIDE_HAS_PRINTED_FAIL_TYPE,

  STAMPPROVIDE_HAS_DELIVERED_SUCCESS_TYPE,
  STAMPPROVIDE_HAS_DELIVERED_FAIL_TYPE,

  //STAMPREQUESTUSED

  STAMPREQUESTUSED_LIST_COMFIRM_SUCCESS_TYPE,
  STAMPREQUESTUSED_LIST_COMFIRM_FAIL_TYPE,

  STAMPREQUESTUSED_LIST_SUCCESS_TYPE,
  STAMPREQUESTUSED_LIST_FAIL_TYPE,

  STAMPREQUESTUSED_LIST_UNCOMFIRM_SUCCESS_TYPE,
  STAMPREQUESTUSED_LIST_UNCOMFIRM_FAIL_TYPE,

  STAMPPROVIDE_SENDMAIL_SUCCESS_TYPE,
  STAMPPROVIDE_SENDMAIL_FAIL_TYPE,

  STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_FAIL_TYPE,
  STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_SUCCESS_TYPE


} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const StampProvideReducer = (state, action) => {
  state = state || initialState;

  if (action.type === STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_STAMPPROVIDE_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_STAMPPROVIDE_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_COMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }
  if (action.type === GET_UNCOMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_UNCOMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_QRCODE_STAMPID_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_QRCODE_STAMPID_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_PRINT_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_PRINT_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_HAS_PRINTED_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_HAS_PRINTED_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_HAS_DELIVERED_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_HAS_DELIVERED_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  //STAMPREQUESTUSED
  if (action.type === STAMPREQUESTUSED_LIST_COMFIRM_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPREQUESTUSED_LIST_COMFIRM_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPREQUESTUSED_LIST_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPREQUESTUSED_LIST_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPREQUESTUSED_LIST_UNCOMFIRM_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPREQUESTUSED_LIST_UNCOMFIRM_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_SENDMAIL_SUCCESS_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  if (action.type === STAMPPROVIDE_SENDMAIL_FAIL_TYPE) {
    return {
      data: action.data,
      isLoading: action.isLoading,
      status: action.status,
      message: action.message,
    };
  }

  return state;
};