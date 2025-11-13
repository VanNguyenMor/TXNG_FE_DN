import {
    BLOG_LIST, BLOG_LIST_CREATE, BLOG_LIST_DELETE, BLOG_LIST_UPDATE, BLOG_LIST_GETID
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_BLOG_LIST_TYPE,
    GET_BLOG_LIST_SUCCESS_TYPE,
    GET_BLOG_LIST_FAIL_TYPE,
    GET_CREATE_BLOG_LIST_TYPE,
    GET_CREATE_BLOG_LIST_SUCCESS_TYPE,
    GET_CREATE_BLOG_LIST_FAIL_TYPE,
    GET_DELETE_BLOG_LIST_TYPE,
    GET_DELETE_BLOG_LIST_SUCCESS_TYPE,
    GET_DELETE_BLOG_LIST_FAIL_TYPE,
    GET_UPDATE_BLOG_LIST_TYPE,
    GET_UPDATE_BLOG_LIST_FAIL_TYPE,
    GET_UPDATE_BLOG_LIST_SUCCESS_TYPE,
    GET_GETID_BLOG_LIST_TYPE,
    GET_GETID_BLOG_LIST_SUCCESS_TYPE,
    GET_GETID_BLOG_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionGetBlogList = {
    requestBLogList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_BLOG_LIST_TYPE, data: initialState
        });

        await post(BLOG_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_BLOG_LIST_SUCCESS_TYPE, data: { blog: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_BLOG_LIST_FAIL_TYPE, data: { blog: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_BLOG_LIST_FAIL_TYPE, data: { blog: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCreateBLog: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_BLOG_LIST_TYPE, data: initialState
            });

            await postFormData(BLOG_LIST_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_CREATE_BLOG_LIST_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_CREATE_BLOG_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_BLOG_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteBLog: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_DELETE_BLOG_LIST_TYPE, data: initialState
        });

        return await get(BLOG_LIST_DELETE + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_DELETE_BLOG_LIST_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_DELETE_BLOG_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_DELETE_BLOG_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestUpdateBLog: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_UPDATE_BLOG_LIST_TYPE, data: initialState
        });

        await postFormData(BLOG_LIST_UPDATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_UPDATE_BLOG_LIST_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_UPDATE_BLOG_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_UPDATE_BLOG_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestGetIdBLog: (id) => async (dispatch, getState) => {
        return new Promise(async (resolve, reject)=> {
            dispatch({
                type: GET_GETID_BLOG_LIST_TYPE, data: initialState
            });
    
            return await get(BLOG_LIST_GETID + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_GETID_BLOG_LIST_SUCCESS_TYPE, data: { getid: res.data, isLoading: true, status: true, message: res.message }
                        });

                        resolve(res);
                    } else {
                        dispatch({
                            type: GET_GETID_BLOG_LIST_FAIL_TYPE, data: { getid: [], isLoading: true, status: false, message: res.message }
                        });

                        reject(res);
                    }
                })
                .catch(err => {
                    dispatch({ type: GET_GETID_BLOG_LIST_FAIL_TYPE, data: { getid: [], isLoading: true, status: false, message: err.message } });

                    reject(err);
                })
        });
    },
}