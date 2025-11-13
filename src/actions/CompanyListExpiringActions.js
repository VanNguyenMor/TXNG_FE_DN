import {
    COMPANY_GET_LIST_EXPIRING,
    COMPANY_LOCK,
    COMPANY_EXTEND
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_LIST_EXPIRING_TYPE,
    GET_COMPANY_LIST_EXPIRING_SUCCESS_TYPE,
    GET_COMPANY_LIST_EXPIRING_FAIL_TYPE,
    GET_COMPANY_LIST_LOCK_TYPE,
    GET_COMPANY_LOCK_SUCCESS_TYPE,
    GET_COMPANY_LOCK_FAIL_TYPE,
    GET_COMPANY_EXTEND_TYPE,
    GET_COMPANY_EXTEND_SUCCESS_TYPE,
    GET_COMPANY_EXTEND_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyListExpiring = {
    requestCompanyListExpiring: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_LIST_EXPIRING_TYPE, data: initialState
        });

        await post(COMPANY_GET_LIST_EXPIRING, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_COMPANY_LIST_EXPIRING_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_COMPANY_LIST_EXPIRING_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_LIST_EXPIRING_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCompanyLock: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_LIST_LOCK_TYPE, data: initialState
        });

        return await get(COMPANY_LOCK + id)
            // .then(res => {
            //     if (res.status === SUCCESS_CODE) {
            //         dispatch({ type: GET_COMPANY_LOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
            //     } else {
            //         dispatch({ type: GET_COMPANY_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
            //     }
            // })
            // .catch(err => {
            //     dispatch({ type: GET_COMPANY_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            // })
    },
    requestCompanyExtend: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_EXTEND_TYPE, data: initialState
        });

        await post(COMPANY_EXTEND, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_EXTEND_SUCCESS_TYPE, data: { extend: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_EXTEND_FAIL_TYPE, data: { extend: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_EXTEND_FAIL_TYPE, data: { extend: [], isLoading: true, status: false, message: err.message } });
            })
    }
}