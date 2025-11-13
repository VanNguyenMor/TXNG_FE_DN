import {
    REPORTSP_LIST_COLUMN,
    REPORTSP_REPORT,
    REPORTSP_LIST_TABLE

} from "../apis";
import {
    post, del, get
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    REPORTSP_LIST_COLUMN_FAIL_TYPE,
    REPORTSP_LIST_COLUMN_SUCCESS_TYPE,
    REPORTSP_LIST_COLUMN_TYPE,
    REPORTSP_REPORT_FAIL_TYPE,
    REPORTSP_REPORT_SUCCESS_TYPE,
    REPORTSP_REPORT_TYPE,
    REPORTSP_LIST_TABLE_SUCCESS_TYPE,
    REPORTSP_LIST_TABLE_FAIL_TYPE,
    REPORTSP_LIST_TABLE_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionReportSP = {
    requestTableList: (data) => async (dispatch, getState) => {
        dispatch({
            type: REPORTSP_LIST_TABLE_TYPE, data: initialState
        });

        await get(REPORTSP_LIST_TABLE)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: REPORTSP_LIST_TABLE_SUCCESS_TYPE, data: { tableList: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: REPORTSP_LIST_TABLE_FAIL_TYPE, data: { tableList: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: REPORTSP_LIST_TABLE_FAIL_TYPE, data: { tableList: [], isLoading: true, status: false, message: err.message } });
            })
    },
    
    requestColumnList: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: REPORTSP_LIST_COLUMN_TYPE, data: initialState
            });

            await get(REPORTSP_LIST_COLUMN + data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: REPORTSP_LIST_COLUMN_SUCCESS_TYPE, data: { columnList: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: REPORTSP_LIST_COLUMN_FAIL_TYPE, data: { columnList: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: REPORTSP_LIST_COLUMN_FAIL_TYPE, data: { columnList: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    requestGetReport: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: REPORTSP_REPORT_TYPE, data: initialState
            });

            await get(REPORTSP_REPORT + data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: REPORTSP_REPORT_SUCCESS_TYPE, data: { report: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: REPORTSP_REPORT_FAIL_TYPE, data: { report: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: REPORTSP_REPORT_FAIL_TYPE, data: { report: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}