import {
    STAMP_LIST,
    STAMP_LIST_CREATE,
    STAMP_LIST_DELETE
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_STAMP_LIST_TYPE,
    GET_STAMP_LIST_SUCCESS_TYPE,
    GET_STAMP_LIST_FAIL_TYPE,
    GET_CREATE_STAMP_LIST_TYPE,
    GET_CREATE_STAMP_LIST_SUCCESS_TYPE,
    GET_CREATE_STAMP_LIST_FAIL_TYPE,
    GET_DELETE_STAMP_LIST_TYPE,
    GET_DELETE_STAMP_LIST_SUCCESS_TYPE,
    GET_DELETE_STAMP_LIST_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionSTAMPList = {
    requestSTAMPList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_STAMP_LIST_TYPE, data: initialState
        });

        await post(STAMP_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_STAMP_LIST_SUCCESS_TYPE, data: { stamp: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_STAMP_LIST_FAIL_TYPE, data: { stamp: [], isLoading: true, status: false, message: res.message }
                    });
                }
                
            })
            .catch(err => {
                dispatch({ type: GET_STAMP_LIST_FAIL_TYPE, data: { stamp: [], isLoading: true, status: false, message: err.message } });
                
            })
    },
    requestCreateSTAMP: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_STAMP_LIST_TYPE, data: initialState
            });

            await post(STAMP_LIST_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_CREATE_STAMP_LIST_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_CREATE_STAMP_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_STAMP_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteSTAMP: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
        dispatch({
            type: GET_DELETE_STAMP_LIST_TYPE, data: initialState
        });

        return await del(STAMP_LIST_DELETE + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_DELETE_STAMP_LIST_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_DELETE_STAMP_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                }
                resolve({
                    status: true,
                    data: res
                });
            })
            .catch(err => {
                dispatch({ type: GET_DELETE_STAMP_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                resolve({
                    status: false,
                    error: err
                });
            })
        })
    },
}