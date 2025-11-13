import {
    GET_PERMISSION_LIST_BY_ID,
    UPDATE_PERMISSION
} from "../apis";
import {
    get, post
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_PERMISSION_LIST_BY_ID_TYPE,
    GET_PERMISSION_LIST_BY_ID_SUCCESS_TYPE,
    GET_PERMISSION_LIST_BY_ID_FAIL_TYPE,
    UPDATE_PERMISSION_TYPE,
    UPDATE_PERMISSION_SUCCESS_TYPE,
    UPDATE_PERMISSION_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionPermissionList = {
    requestPermissionListByID: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_PERMISSION_LIST_BY_ID_TYPE, data: initialState
            });

            await get(GET_PERMISSION_LIST_BY_ID + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_PERMISSION_LIST_BY_ID_SUCCESS_TYPE, data: { data: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_PERMISSION_LIST_BY_ID_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_PERMISSION_LIST_BY_ID_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },

    updatePermission: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: UPDATE_PERMISSION_TYPE, data: initialState
            });

            await post(UPDATE_PERMISSION, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        // dispatch({
                        //     type: UPDATE_PERMISSION_SUCCESS_TYPE, data: { update: res.data, isLoading: false, status: true, message: res.message }
                        // });
                    } else {
                        // dispatch({
                        //     type: UPDATE_PERMISSION_FAIL_TYPE, data: { update: [], isLoading: false, status: false, message: res.message }
                        // });
                    }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    // dispatch({ type: UPDATE_PERMISSION_FAIL_TYPE, data: { update: [], isLoading: false, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    }
}