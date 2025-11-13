import {
    SALE_REGISTER_MONTH_REPORT,
    SALE_REGISTER_QUARTER_REPORT,
    SALE_REGISTER_YEAR_REPORT
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    SALE_REGISTER_QUARTER_REPORT_TYPE,
    SALE_REGISTER_QUARTER_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_QUARTER_REPORT_FAIL_TYPE,
    SALE_REGISTER_MONTH_REPORT_TYPE,
    SALE_REGISTER_MONTH_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_MONTH_REPORT_FAIL_TYPE,
    SALE_REGISTER_YEAR_REPORT_TYPE,
    SALE_REGISTER_YEAR_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_YEAR_REPORT_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionSaleRegisterReports = {

    requestMonthReport: (id) => async (dispatch, getState) => {
        dispatch({ type: SALE_REGISTER_MONTH_REPORT_TYPE, data: initialState });

        await get(SALE_REGISTER_MONTH_REPORT + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: SALE_REGISTER_MONTH_REPORT_SUCCESS_TYPE, data: { month: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: SALE_REGISTER_MONTH_REPORT_FAIL_TYPE, data: { month: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: SALE_REGISTER_MONTH_REPORT_FAIL_TYPE, data: { month: [], isLoading: true, status: false, message: err.message } });
            });
    },
    requestQuarterReport: (id) => async (dispatch, getState) => {
        dispatch({ type: SALE_REGISTER_QUARTER_REPORT_TYPE, data: initialState });

        await get(SALE_REGISTER_QUARTER_REPORT + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: SALE_REGISTER_QUARTER_REPORT_SUCCESS_TYPE, data: { quarter: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: SALE_REGISTER_QUARTER_REPORT_FAIL_TYPE, data: { quarter: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: SALE_REGISTER_QUARTER_REPORT_FAIL_TYPE, data: { quarter: [], isLoading: true, status: false, message: err.message } });
            });
    },
    requestYearReport: (fromYear, toYear) => async (dispatch, getState) => {
        dispatch({ type: SALE_REGISTER_YEAR_REPORT_TYPE, data: initialState });

        await get(SALE_REGISTER_YEAR_REPORT + 'fromYear=' + fromYear + '&' + 'toYear=' + toYear)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: SALE_REGISTER_YEAR_REPORT_SUCCESS_TYPE, data: { year: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: SALE_REGISTER_YEAR_REPORT_FAIL_TYPE, data: { year: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: SALE_REGISTER_YEAR_REPORT_FAIL_TYPE, data: { year: [], isLoading: true, status: false, message: err.message } });
            });
    },
}