import {
    ACCESS_LIST,
    ACCESS_LIST_BY_ID,
    ACCESS_CREATE,
    ACCESS_UPDATE,
    ACCESS_DELETE
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_ACCESS_TYPE,
    GET_ACCESS_SUCCESS_TYPE,
    GET_ACCESS_FAIL_TYPE,
    GET_ACCESS_TYPE1,
    GET_ACCESS_SUCCESS_TYPE1,
    GET_ACCESS_FAIL_TYPE1,
    GET_CREATE_ACCESS_TYPE,
    GET_CREATE_ACCESS_SUCCESS_TYPE,
    GET_CREATE_ACCESS_FAIL_TYPE,
    GET_UPDATE_ACCESS_TYPE,
    GET_UPDATE_ACCESS_SUCCESS_TYPE,
    GET_UPDATE_ACCESS_FAIL_TYPE,
    GET_DELETE_ACCESS_TYPE,
    GET_DELETE_ACCESS_SUCCESS_TYPE,
    GET_DELETE_ACCESS_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionAccess = {
    requestAccessStore: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_ACCESS_TYPE, data: initialState
            });

            await post(ACCESS_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_ACCESS_SUCCESS_TYPE, data: { access: res.data, isLoading: true, status: true, message: res.message }
                        });

                    } else {
                        dispatch({
                            type: GET_ACCESS_FAIL_TYPE, data: { access: [], isLoading: true, status: false, message: res.message }
                        });

                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_ACCESS_FAIL_TYPE, data: { access: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },

    requestAccessPopupStore: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_ACCESS_TYPE1, data: initialState
            });

            await post(ACCESS_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_ACCESS_SUCCESS_TYPE1, data: { accessPopup: res.data, isLoading: true, status: true, message: res.message }
                        });

                    } else {
                        dispatch({
                            type: GET_ACCESS_FAIL_TYPE1, data: { accessPopup: [], isLoading: true, status: false, message: res.message }
                        });

                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_ACCESS_FAIL_TYPE1, data: { accessPopup: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },

    requestAccessByID: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_ACCESS_TYPE, data: initialState
        });

        await get(ACCESS_LIST_BY_ID + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_ACCESS_SUCCESS_TYPE, data: { newinfo: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_ACCESS_FAIL_TYPE, data: { newinfo: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_ACCESS_FAIL_TYPE, data: { newinfo: [], isLoading: true, status: false, message: err.message } });
            })
    },

    detailAccessByID: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_ACCESS_TYPE, data: initialState
        });

        await get(ACCESS_LIST_BY_ID + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_ACCESS_SUCCESS_TYPE, data: { detail: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_ACCESS_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_ACCESS_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: err.message } });
            })
    },

    createAccess: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_ACCESS_TYPE, data: initialState
            });

            await postFormData(ACCESS_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_CREATE_ACCESS_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_CREATE_ACCESS_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_ACCESS_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    updateAccess: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_UPDATE_ACCESS_TYPE, data: initialState
            });

            await postFormData(ACCESS_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_UPDATE_ACCESS_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_UPDATE_ACCESS_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }

                    resolve(res);
                })
                .catch(err => {
                    dispatch({ type: GET_UPDATE_ACCESS_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });

                    resolve(err);
                })
        });
    },

    deleteAccess: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
        dispatch({
            type: GET_DELETE_ACCESS_TYPE, data: initialState
        });

        await del(ACCESS_DELETE + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_DELETE_ACCESS_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_DELETE_ACCESS_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message }
                    });
                    
                }
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: GET_DELETE_ACCESS_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                resolve(err);
            })
        })
    }
}