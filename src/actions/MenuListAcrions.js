import {
    MENU_LIST,
    MENU_LIST_CREATE,
    MENU_LIST_DELETE,
    MENU_LIST_UPDATE,
    MENU_LIST_GET
} from "../apis";
import {
    post, del, get
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_MENU_GET_TYPE,
    GET_MENU_GET_SUCCESS_TYPE,
    GET_MENU_GET_FAIL_TYPE,
    GET_MENU_LIST_TYPE,
    GET_MENU_LIST_SUCCESS_TYPE,
    GET_MENU_LIST_FAIL_TYPE,
    GET_CREATE_MENU_LIST_TYPE,
    GET_CREATE_MENU_LIST_SUCCESS_TYPE,
    GET_CREATE_MENU_LIST_FAIL_TYPE,
    GET_DELETE_MENU_LIST_TYPE,
    GET_DELETE_MENU_LIST_SUCCESS_TYPE,
    GET_DELETE_MENU_LIST_FAIL_TYPE,
    GET_UPDATE_MENU_LIST_TYPE,
    GET_UPDATE_MENU_LIST_SUCCESS_TYPE,
    GET_UPDATE_MENU_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionMenuList = {
    requestMenuList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_MENU_LIST_TYPE, data: initialState
        });

        await post(MENU_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_MENU_LIST_SUCCESS_TYPE, data: { menu: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_MENU_LIST_FAIL_TYPE, data: { menu: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_MENU_LIST_FAIL_TYPE, data: { menu: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCreateMenu: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_MENU_LIST_TYPE, data: initialState
            });

            await post(MENU_LIST_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_CREATE_MENU_LIST_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_CREATE_MENU_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_MENU_LIST_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteMenu: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_DELETE_MENU_LIST_TYPE, data: initialState
            });

            return await del(MENU_LIST_DELETE + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_DELETE_MENU_LIST_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_DELETE_MENU_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_DELETE_MENU_LIST_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUpdateMenu: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_UPDATE_MENU_LIST_TYPE, data: initialState
        });

        await post(MENU_LIST_UPDATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_UPDATE_MENU_LIST_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_UPDATE_MENU_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_UPDATE_MENU_LIST_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestGetMenu: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_MENU_GET_TYPE, data: initialState
            });
            await get(MENU_LIST_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_MENU_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_MENU_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_MENU_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}