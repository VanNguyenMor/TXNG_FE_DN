import {
    NEWS_LIST, NEWS_LIST_CREATE, NEWS_LIST_DELETE, NEWS_LIST_UPDATE, NEWS_LIST_GETID
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_NEWS_LIST_TYPE,
    GET_NEWS_LIST_SUCCESS_TYPE,
    GET_NEWS_LIST_FAIL_TYPE,
    GET_CREATE_NEWS_LIST_TYPE,
    GET_CREATE_NEWS_LIST_SUCCESS_TYPE,
    GET_CREATE_NEWS_LIST_FAIL_TYPE,
    GET_DELETE_NEWS_LIST_TYPE,
    GET_DELETE_NEWS_LIST_SUCCESS_TYPE,
    GET_DELETE_NEWS_LIST_FAIL_TYPE,
    GET_UPDATE_NEWS_LIST_TYPE,
    GET_UPDATE_NEWS_LIST_SUCCESS_TYPE,
    GET_UPDATE_NEWS_LIST_FAIL_TYPE,
    GET_GETID_NEWS_LIST_TYPE,
    GET_GETID_NEWS_LIST_SUCCESS_TYPE,
    GET_GETID_NEWS_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionGetNEWSList = {
    requestNEWSList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_NEWS_LIST_TYPE, data: initialState
        });

        await post(NEWS_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_NEWS_LIST_SUCCESS_TYPE, data: { news: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_NEWS_LIST_FAIL_TYPE, data: { news: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_NEWS_LIST_FAIL_TYPE, data: { news: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCreateNEWS: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_CREATE_NEWS_LIST_TYPE, data: initialState
        });

        await postFormData(NEWS_LIST_CREATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_CREATE_NEWS_LIST_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_CREATE_NEWS_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_CREATE_NEWS_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestDeleteNEWS: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_DELETE_NEWS_LIST_TYPE, data: initialState
        });

        return await get(NEWS_LIST_DELETE + id)
        // .then(res => {
        //     if (res.status === SUCCESS_CODE) {
        //         dispatch({ type: GET_DELETE_NEWS_LIST_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
        //     } else {
        //         dispatch({ type: GET_DELETE_NEWS_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
        //     }
        // })
        // .catch(err => {
        //     dispatch({ type: GET_DELETE_NEWS_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
        // })
    },
    requestUpdateNEWS: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_UPDATE_NEWS_LIST_TYPE, data: initialState
        });

        await postFormData(NEWS_LIST_UPDATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_UPDATE_NEWS_LIST_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_UPDATE_NEWS_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_UPDATE_NEWS_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestGetIdNEWS: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_GETID_NEWS_LIST_TYPE, data: initialState
        });

        return await get(NEWS_LIST_GETID + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_GETID_NEWS_LIST_SUCCESS_TYPE, data: { getid: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_GETID_NEWS_LIST_FAIL_TYPE, data: { getid: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_GETID_NEWS_LIST_FAIL_TYPE, data: { getid: [], isLoading: true, status: false, message: err.message } });
            })
    },
}