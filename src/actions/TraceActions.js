import {
    TRACE_LIST,
    TRACE_GET, 
    TRACE_GET_HISTORY
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    TRACE_LIST_FAIL_TYPE,
    TRACE_LIST_SUCCESS_TYPE,
    TRACE_LIST_TYPE,
    TRACE_GET_TYPE,
    TRACE_GET_SUCCESS_TYPE,
    TRACE_GET_FAIL_TYPE,
    TRACE_GET_HISTORY_TYPE,
    TRACE_GET_HISTORY_SUCCESS_TYPE,
    TRACE_GET_HISTORY_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionTrace = {
    requestListTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_LIST_TYPE, data: initialState
            });

            await post(TRACE_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetTrace: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_TYPE, data: initialState
            });

            return await get(TRACE_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    },
    requestGetHistoryTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_HISTORY_TYPE, data: initialState
            });

            await post(TRACE_GET_HISTORY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_HISTORY_SUCCESS_TYPE, data: { getHistory: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_HISTORY_FAIL_TYPE, data: { getHistory: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_HISTORY_FAIL_TYPE, data: { getHistory: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}