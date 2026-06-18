import {
    TRANSPORTATION_LIST,
    TRANSPORTATION_CREATE,
    TRANSPORTATION_DELETE,
    TRANSPORTATION_UPDATE,
    TRANSPORTATION_GET,
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    TRANSPORTATION_LIST_TYPE,
    TRANSPORTATION_LIST_SUCCESS_TYPE,
    TRANSPORTATION_LIST_FAIL_TYPE,
    TRANSPORTATION_CREATE_TYPE,
    TRANSPORTATION_CREATE_SUCCESS_TYPE,
    TRANSPORTATION_CREATE_FAIL_TYPE,
    TRANSPORTATION_GET_TYPE,
    TRANSPORTATION_GET_SUCCESS_TYPE,
    TRANSPORTATION_GET_FAIL_TYPE,
    TRANSPORTATION_UPDATE_TYPE,
    TRANSPORTATION_UPDATE_SUCCESS_TYPE,
    TRANSPORTATION_UPDATE_FAIL_TYPE,
    TRANSPORTATION_DELETE_TYPE,
    TRANSPORTATION_DELETE_SUCCESS_TYPE,
    TRANSPORTATION_DELETE_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionTransportation = {
    requestListTransportation: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRANSPORTATION_LIST_TYPE, data: initialState
            });

            await post(TRANSPORTATION_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRANSPORTATION_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRANSPORTATION_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRANSPORTATION_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetTransportation: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRANSPORTATION_GET_TYPE, data: initialState
            });

            return await get(TRANSPORTATION_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRANSPORTATION_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRANSPORTATION_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRANSPORTATION_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    },
    requestCreateTransportation: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRANSPORTATION_CREATE_TYPE, data: initialState
            });

            await post(TRANSPORTATION_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: TRANSPORTATION_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: TRANSPORTATION_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRANSPORTATION_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUpdateTransportation: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRANSPORTATION_UPDATE_TYPE, data: initialState
            });

            await post(TRANSPORTATION_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: TRANSPORTATION_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: TRANSPORTATION_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRANSPORTATION_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteTransportation: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRANSPORTATION_DELETE_TYPE, data: initialState
            });

            return await del(TRANSPORTATION_DELETE + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRANSPORTATION_DELETE_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRANSPORTATION_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRANSPORTATION_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}
