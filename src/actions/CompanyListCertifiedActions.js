import {
    COMPANY_GET_LIST_CERTIFIED,
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    COMPANY_GET_LIST_CERTIFIED_TYPE,
    COMPANY_GET_LIST_CERTIFIED_SUCCESS_TYPE,
    COMPANY_GET_LIST_CERTIFIED_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyListCertified = {
    requestCompanyListCertified: (data) => (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: COMPANY_GET_LIST_CERTIFIED_TYPE, data: initialState
            });

            await post(COMPANY_GET_LIST_CERTIFIED, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: COMPANY_GET_LIST_CERTIFIED_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: COMPANY_GET_LIST_CERTIFIED_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: COMPANY_GET_LIST_CERTIFIED_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },
}