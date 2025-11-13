import {
    AREA_GET,
    AREA_GET_LIST_COMPANY_PLANNING_AREA,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    AREA_GET_TYPE,
    AREA_GET_FAIL_TYPE,
    AREA_GET_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_TYPE,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_FAIL_TYPE,
    AREA_GET_LIST_COMPANY_PLANNING_AREA_TYPE,
    AREA_GET_LIST_COMPANY_PLANNING_AREA_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_PLANNING_AREA_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyAreaReports = {
    requestGetArea: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: AREA_GET_TYPE, data: initialState });
            if (!id) { id = '' }
            await get(AREA_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: AREA_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: AREA_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: AREA_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    requestListGetAreaOuterPlanning: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_TYPE, data: initialState });
            if (!id) { id = '' }
            await get(AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_SUCCESS_TYPE, data: { outer: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_FAIL_TYPE, data: { outer: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_FAIL_TYPE, data: { outer: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    requestListGetAreaPlanning: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: AREA_GET_LIST_COMPANY_PLANNING_AREA_TYPE, data: initialState });
            if (!id) { id = '' }
            await get(AREA_GET_LIST_COMPANY_PLANNING_AREA + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: AREA_GET_LIST_COMPANY_PLANNING_AREA_SUCCESS_TYPE, data: { inter: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: AREA_GET_LIST_COMPANY_PLANNING_AREA_FAIL_TYPE, data: { inter: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: AREA_GET_LIST_COMPANY_PLANNING_AREA_FAIL_TYPE, data: { inter: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
}