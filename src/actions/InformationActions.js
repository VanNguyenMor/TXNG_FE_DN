import {
    INFORMATION_LIST,
    INFORMATION_LIST_BY_ID,
    INFORMATION_CREATE,
    INFORMATION_UPDATE,
    INFORMATION_DELETE
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_INFORMATION_TYPE,
    GET_INFORMATION_SUCCESS_TYPE,
    GET_INFORMATION_FAIL_TYPE,
    GET_CREATE_INFORMATION_TYPE,
    GET_CREATE_INFORMATION_SUCCESS_TYPE,
    GET_CREATE_INFORMATION_FAIL_TYPE,
    GET_UPDATE_INFORMATION_TYPE,
    GET_UPDATE_INFORMATION_SUCCESS_TYPE,
    GET_UPDATE_INFORMATION_FAIL_TYPE,
    GET_DELETE_INFORMATION_TYPE,
    GET_DELETE_INFORMATION_SUCCESS_TYPE,
    GET_DELETE_INFORMATION_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionInformation = {
    requestInformationStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_INFORMATION_TYPE, data: initialState
        });

        await post(INFORMATION_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_INFORMATION_SUCCESS_TYPE, data: { information: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_INFORMATION_FAIL_TYPE, data: { information: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_INFORMATION_FAIL_TYPE, data: { information: [], isLoading: true, status: false, message: err.message } });
            })
    },

    requestInformationPopupStore: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_INFORMATION_TYPE, data: initialState
            });

            await post(INFORMATION_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_INFORMATION_SUCCESS_TYPE, data: { informationPopup: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_INFORMATION_FAIL_TYPE, data: { informationPopup: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_INFORMATION_FAIL_TYPE, data: { informationPopup: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },

    requestInformationByID: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_UPDATE_INFORMATION_TYPE, data: initialState
        });

        await get(INFORMATION_LIST_BY_ID + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_INFORMATION_SUCCESS_TYPE, data: { newinfo: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_INFORMATION_FAIL_TYPE, data: { newinfo: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_INFORMATION_FAIL_TYPE, data: { newinfo: [], isLoading: true, status: false, message: err.message } });
            })
    },

    detailInformationByID: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_INFORMATION_TYPE, data: initialState
        });

        await get(INFORMATION_LIST_BY_ID + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_INFORMATION_SUCCESS_TYPE, data: { detail: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_INFORMATION_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_INFORMATION_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: err.message } });
            })
    },

    createInformation: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_INFORMATION_TYPE, data: initialState
            });

            await post(INFORMATION_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_CREATE_INFORMATION_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_CREATE_INFORMATION_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_INFORMATION_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    updateInformation: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_UPDATE_INFORMATION_TYPE, data: initialState
        });

        await post(INFORMATION_UPDATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_UPDATE_INFORMATION_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_UPDATE_INFORMATION_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_UPDATE_INFORMATION_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },

    deleteInformation: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_DELETE_INFORMATION_TYPE, data: initialState
            });

            await del(INFORMATION_DELETE + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_DELETE_INFORMATION_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_DELETE_INFORMATION_SUCCESS_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_DELETE_INFORMATION_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    }
}