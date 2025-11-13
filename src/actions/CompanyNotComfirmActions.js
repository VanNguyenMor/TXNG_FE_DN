import {
    COMPANY_NOT_COMFIRM,
    COMPANY_COMFIRM,
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_COMPANY_NOT_COMFIRM_TYPE,
    GET_COMPANY_NOT_COMFIRM_SUCCESS_TYPE,
    GET_COMPANY_NOT_COMFIRM_FAIL_TYPE,
    GET_COMPANY_COMFIRM_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyNotComfirm = {
    requestCompanyNotComfrim: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_NOT_COMFIRM_TYPE, data: initialState
        });

        await post(COMPANY_NOT_COMFIRM, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_COMPANY_NOT_COMFIRM_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_COMPANY_NOT_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_COMPANY_NOT_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
            })
    },

    requestCompanyComfirmStore: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_COMPANY_COMFIRM_TYPE, data: initialState
        });

        return await get(COMPANY_COMFIRM + id);
        // .then(res => {
        //     if (res.status === SUCCESS_CODE) {
        //         dispatch({
        //             type: GET_COMPANY_COMFIRM_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message }
        //         });
        //     } else {
        //         dispatch({
        //             type: GET_COMPANY_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message }
        //         });
        //     }
        // })
        // .catch(err => {
        //     dispatch({ type: GET_COMPANY_COMFIRM_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
        // })
    },
}