import {
    STAMPFEE_FEE_LIST,
    STAMPFEE_FEE_COMFIRM
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_STAMPFEE_COMFIRM_TYPE,
    GET_STAMPFEE_COMFIRM_SUCCESS_TYPE,
    GET_STAMPFEE_COMFIRM_FAIL_TYPE,
    GET_STAMPFEE_LIST_TYPE,
    GET_STAMPFEE_LIST_SUCCESS_TYPE,
    GET_STAMPFEE_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionStampFee = {
    requestStampFee: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_STAMPFEE_LIST_TYPE, data: initialState
        });

        await post(STAMPFEE_FEE_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_STAMPFEE_LIST_SUCCESS_TYPE, data: { stamp: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_STAMPFEE_LIST_FAIL_TYPE, data: { stamp: [], isLoading: true, status: false, message: res.message } });
                }

            })
            .catch(err => {
                dispatch({ type: GET_STAMPFEE_LIST_FAIL_TYPE, data: { stamp: [], isLoading: true, status: false, message: err.message } });

            })
    },

    requestComfirm: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: GET_STAMPFEE_COMFIRM_TYPE, data: initialState });

            return await get(STAMPFEE_FEE_COMFIRM + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_STAMPFEE_COMFIRM_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_STAMPFEE_COMFIRM_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_STAMPFEE_COMFIRM_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}