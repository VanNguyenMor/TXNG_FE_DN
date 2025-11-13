import {
    COMPANY_GET_LIST_REQUEST_EXTEND,
    COMPANY_UNCOMFIRM_REQUEST_EXTEND, 
    COMPANY_COMFIRM_REQUEST_EXTEND
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_LIST_REQUEST_EXTEND_TYPE,
    GET_COMPANY_LIST_REQUEST_EXTEND_SUCCESS_TYPE,
    GET_COMPANY_LIST_REQUEST_EXTEND_FAIL_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_EXTEND_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_EXTEND_SUCCESS_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_EXTEND_FAIL_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_SUCCESS_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionListRequestExtend = {
    requestListRequestExtend: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_LIST_REQUEST_EXTEND_TYPE, data: initialState
        });
    
        await post(COMPANY_GET_LIST_REQUEST_EXTEND, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_LIST_REQUEST_EXTEND_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_LIST_REQUEST_EXTEND_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_LIST_REQUEST_EXTEND_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestComfirmRequestExtend: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_COMFIRM_REQUEST_EXTEND_TYPE, data: initialState
        });
    
        await post(COMPANY_COMFIRM_REQUEST_EXTEND, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_COMFIRM_REQUEST_EXTEND_SUCCESS_TYPE, data: { extend: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_COMFIRM_REQUEST_EXTEND_FAIL_TYPE, data: { extend: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_COMFIRM_REQUEST_EXTEND_FAIL_TYPE, data: { extend: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestUnComfirmRequestExtend: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_TYPE, data: initialState
        });
    
        await post(COMPANY_UNCOMFIRM_REQUEST_EXTEND, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_SUCCESS_TYPE, data: { uncomfirm: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_UNCOMFIRM_REQUEST_EXTEND_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: err.message } });
            })
    }
}