import {
    FIELD_LIST,
    FIELD_CREATE,
    FIELD_UPDATE,
    FIELD_DELETE,
    FIELD_LOCK,
    FIELD_CHILDREN_END_LIST,
    FIELD_HAVE_ACCESS_LIST,
    FIELD_BY_COMPANY_FIELD_LIST,
    FIELD_MIN_LEVEL_LIST,
    FIELD_BY_PRODUCTS_LIST
} from "../apis";
import {
    post, del, get
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_FIELD_TYPE,
    GET_FIELD_SUCCESS_TYPE,
    GET_FIELD_FAIL_TYPE,
    GET_CREATE_FIELD_TYPE,
    GET_CREATE_FIELD_SUCCESS_TYPE,
    GET_CREATE_FIELD_FAIL_TYPE,
    GET_UPDATE_FIELD_TYPE,
    GET_UPDATE_FIELD_SUCCESS_TYPE,
    GET_UPDATE_FIELD_FAIL_TYPE,
    GET_DELETE_FIELD_TYPE,
    GET_DELETE_FIELD_SUCCESS_TYPE,
    GET_DELETE_FIELD_FAIL_TYPE,
    FIELD_LOCK_TYPE,
    FIELD_LOCK_SUCCESS_TYPE,
    FIELD_LOCK_FAIL_TYPE,
    GET_FIELD_CHILDREN_END_SUCCESS_TYPE,
    GET_FIELD_CHILDREN_END_FAIL_TYPE,
    GET_FIELD_CHILDREN_END_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionField = {
    requestLockField: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: FIELD_LOCK_TYPE, data: initialState
            });

            return await get(FIELD_LOCK + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: FIELD_LOCK_SUCCESS_TYPE, data: { lock: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: FIELD_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: res.message } });
                    }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: FIELD_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestFieldHaveAccessStore: (data) => async (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            await post(FIELD_HAVE_ACCESS_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    },

    requestFieldByProducts: (data) => async (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            await post(FIELD_BY_PRODUCTS_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    },

    requestFieldChildrenEndStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_FIELD_CHILDREN_END_TYPE, data: initialState
        });

        return new Promise(async resolve => {
            dispatch({
                type: GET_FIELD_CHILDREN_END_TYPE, data: initialState
            });
            await post(FIELD_CHILDREN_END_LIST, data)
                .then(res => {

                    if (res.status === SUCCESS_CODE) {
                        // dispatch({
                        //     type: GET_FIELD_CHILDREN_END_SUCCESS_TYPE, data: { field: res.data, isLoading: false, status: true, message: res.message }
                        // });
                    } else {
                        // dispatch({
                        //     type: GET_FIELD_CHILDREN_END_FAIL_TYPE, data: { field: [], isLoading: false, status: false, message: res.message }
                        // });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    //dispatch({ type: GET_FIELD_CHILDREN_END_FAIL_TYPE, data: { field: [], isLoading: false, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestFieldByCompanyFieldStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_FIELD_TYPE, data: initialState
        });

        return new Promise(async resolve => {
            dispatch({
                type: GET_FIELD_TYPE, data: initialState
            });
            await post(FIELD_BY_COMPANY_FIELD_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_FIELD_SUCCESS_TYPE, data: { fieldCom: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_FIELD_FAIL_TYPE, data: { fieldCom: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_FIELD_FAIL_TYPE, data: { fieldCom: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestFieldStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_FIELD_TYPE, data: initialState
        });

        return new Promise(async resolve => {
            dispatch({
                type: GET_FIELD_TYPE, data: initialState
            });
            await post(FIELD_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_FIELD_SUCCESS_TYPE,
                            data: { field: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_FIELD_FAIL_TYPE,
                            data: { field: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_FIELD_FAIL_TYPE, data: { field: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    createField: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_CREATE_FIELD_TYPE, data: initialState
            });

            await post(FIELD_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_CREATE_FIELD_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_CREATE_FIELD_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_CREATE_FIELD_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    updateField: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_UPDATE_FIELD_TYPE, data: initialState
            });

            await post(FIELD_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_UPDATE_FIELD_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_UPDATE_FIELD_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    })
                })
                .catch(err => {
                    dispatch({ type: GET_UPDATE_FIELD_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    })
                })
        });
    },

    deleteField: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_DELETE_FIELD_TYPE, data: initialState
        });

        await del(FIELD_DELETE + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_DELETE_FIELD_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_DELETE_FIELD_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_DELETE_FIELD_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestFieldMinLevelStore: (data) => async (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            await post(FIELD_MIN_LEVEL_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    
}