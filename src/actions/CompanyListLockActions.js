import {
    COMPANY_GET_LIST_LOCK,
    COMPANY_UNLOCK,
    COMPANY_EXTEND
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_LIST_LOCK_TYPE,
    GET_COMPANY_LIST_LOCK_SUCCESS_TYPE,
    GET_COMPANY_LIST_LOCK_FAIL_TYPE,
    GET_COMPANY_UNLOCK_SUCCESS_TYPE,
    GET_COMPANY_UNLOCK_TYPE,
    GET_COMPANY_UNLOCK_FAIL_TYPE,
    GET_COMPANY_EXTEND_TYPE,
    GET_COMPANY_EXTEND_SUCCESS_TYPE,
    GET_COMPANY_EXTEND_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyListLock = {
    requestCompanyListLock: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_LIST_LOCK_TYPE, data: initialState
        });

        await post(COMPANY_GET_LIST_LOCK, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_COMPANY_LIST_LOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_COMPANY_LIST_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_LIST_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCompanyUnLock: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_UNLOCK_TYPE, data: initialState
        });

        return await get(COMPANY_UNLOCK + id)
        // .then(res => {
        //     if (res.status === SUCCESS_CODE) {
        //         dispatch({ type: GET_COMPANY_UNLOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
        //     } else {
        //         dispatch({ type: GET_COMPANY_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
        //     }
        // })
        // .catch(err => {
        //     dispatch({ type: GET_COMPANY_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
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