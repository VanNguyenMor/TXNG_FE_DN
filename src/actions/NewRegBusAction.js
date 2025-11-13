import {
    COMPANY_LIST,
    CREATE_COMPANY,
    DELETE_COMPANY
} from "../apis";
import {
    del,
    get, post, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_REG_LIST_TYPE,
    GET_COMPANY_REG_LIST_SUCCESS_TYPE,
    GET_COMPANY_REG_LIST_FAIL_TYPE,
    CREATE_COMPANY_TYPE,
    CREATE_COMPANY_SUCCESS_TYPE,
    CREATE_COMPANY_FAIL_TYPE,
    DELETE_COMPANY_TYPE,
    DELETE_COMPANY_SUCCESS_TYPE,
    DELETE_COMPANY_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionGetListNewly = {
    requestCompanyRegListStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_REG_LIST_TYPE, data: initialState
        });

        await post(COMPANY_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_COMPANY_REG_LIST_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_COMPANY_REG_LIST_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_REG_LIST_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },

    createNewCompanyRegStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: CREATE_COMPANY_TYPE, data: initialState
        });

        await postFormData(CREATE_COMPANY, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: CREATE_COMPANY_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: CREATE_COMPANY_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: CREATE_COMPANY_SUCCESS_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });
            })
    },
    deleteNewCompanyRegStore: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: DELETE_COMPANY_TYPE, data: initialState
            });

            return await del(DELETE_COMPANY + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: DELETE_COMPANY_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: DELETE_COMPANY_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: DELETE_COMPANY_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    }
}