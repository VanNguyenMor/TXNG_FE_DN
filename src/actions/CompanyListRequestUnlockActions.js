import {
    COMPANY_GET_LIST_REQUEST_UNLOCK,
    COMPANY_UNCOMFIRM_REQUEST_UNLOCK,
    COMPANY_COMFIRM_REQUEST_UNLOCK
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_LIST_REQUEST_UNLOCK_TYPE,
    GET_COMPANY_LIST_REQUEST_UNLOCK_SUCCESS_TYPE,
    GET_COMPANY_LIST_REQUEST_UNLOCK_FAIL_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_UNLOCK_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_UNLOCK_SUCCESS_TYPE,
    GET_COMPANY_COMFIRM_REQUEST_UNLOCK_FAIL_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_SUCCESS_TYPE,
    GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionListRequestUnlock = {
    requestListRequestUnlock: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_LIST_REQUEST_UNLOCK_TYPE, data: initialState
        });

        await post(COMPANY_GET_LIST_REQUEST_UNLOCK, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_LIST_REQUEST_UNLOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_LIST_REQUEST_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_LIST_REQUEST_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestComfirmRequestUnlock: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_COMFIRM_REQUEST_UNLOCK_TYPE, data: initialState
        });

        return await get(COMPANY_COMFIRM_REQUEST_UNLOCK + id)
            // .then(res => {
            //     if (res.status === SUCCESS_CODE) {
            //         dispatch({
            //             type: GET_COMPANY_COMFIRM_REQUEST_UNLOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
            //         });
            //     } else {
            //         dispatch({
            //             type: GET_COMPANY_COMFIRM_REQUEST_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
            //         });
            //     }
            // })
            // .catch(err => {
            //     dispatch({ type: GET_COMPANY_COMFIRM_REQUEST_UNLOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            // })
    },
    requestUnComfirmRequestUnlock: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_TYPE, data: initialState
        });

        await post(COMPANY_UNCOMFIRM_REQUEST_UNLOCK, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_SUCCESS_TYPE, data: { uncomfirm: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_UNCOMFIRM_REQUEST_UNLOCK_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: err.message } });
            })
    }
}