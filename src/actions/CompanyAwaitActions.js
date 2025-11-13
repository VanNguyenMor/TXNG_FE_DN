import {
    COMPANY_AWAIT,
    COMPANY_COMFIRM,
    COMPANY_UNCOMFIRM
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_AWAIT_LIST_TYPE,
    GET_COMPANY_AWAIT_LIST_SUCCESS_TYPE,
    GET_COMPANY_AWAIT_LIST_FAIL_TYPE,
    GET_COMPANY_COMFIRM_TYPE,
    GET_COMPANY_COMFIRM_SUCCESS_TYPE,
    GET_COMPANY_COMFIRM_FAIL_TYPE,
    GET_COMPANY_UNCOMFIRM_TYPE,
    GET_COMPANY_UNCOMFIRM_SUCCESS_TYPE,
    GET_COMPANY_UNCOMFIRM_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionGetListCompanyAwait = {
    requestCompanyAwaitListStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_AWAIT_LIST_TYPE, data: initialState
        });

        await post(COMPANY_AWAIT, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_AWAIT_LIST_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_AWAIT_LIST_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_AWAIT_LIST_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCompanyComfirmStore: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_COMFIRM_TYPE, data: initialState
        });

        return await get(COMPANY_COMFIRM + id);
        // .then(res => {
        //     if (res.status === SUCCESS_CODE) {
        //         dispatch({
        //             type: GET_COMPANY_COMFIRM_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
        //         });
        //     } else {
        //         dispatch({
        //             type: GET_COMPANY_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
        //         });
        //     }
        // })
        // .catch(err => {
        //     dispatch({ type: GET_COMPANY_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
        // })
    },
    requestCompanyUnComfirmStore: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_COMPANY_UNCOMFIRM_TYPE, data: initialState
            });

            await post(COMPANY_UNCOMFIRM, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_COMPANY_UNCOMFIRM_SUCCESS_TYPE, data: { uncomfirm: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_COMPANY_COMFIRM_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: res.message }
                        });
                        resolve({
                            status: true,
                            data: res
                        });
                    }
                })
                .catch(err => {
                    dispatch({ type: GET_COMPANY_UNCOMFIRM_FAIL_TYPE, data: { uncomfirm: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    }
}