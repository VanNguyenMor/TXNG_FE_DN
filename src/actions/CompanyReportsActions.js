import {
    COMPANY_MONTH_REPORT,
    COMPANY_QUARTER_REPORT,
    COMPANY_YEAR_REPORT
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    COMPANY_MONTH_REPORT_TYPE,
    COMPANY_MONTH_REPORT_SUCCESS_TYPE,
    COMPANY_MONTH_REPORT_FAIL_TYPE,
    COMPANY_QUARTER_REPORT_TYPE,
    COMPANY_QUARTER_REPORT_SUCCESS_TYPE,
    COMPANY_QUARTER_REPORT_FAIL_TYPE,
    COMPANY_YEAR_REPORT_TYPE,
    COMPANY_YEAR_REPORT_SUCCESS_TYPE,
    COMPANY_YEAR_REPORT_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyReports = {

    requestMonthReport: (id) => async (dispatch, getState) => {
        dispatch({ type: COMPANY_MONTH_REPORT_TYPE, data: initialState });

        await get(COMPANY_MONTH_REPORT + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: COMPANY_MONTH_REPORT_SUCCESS_TYPE, data: { month: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: COMPANY_MONTH_REPORT_FAIL_TYPE, data: { month: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: COMPANY_MONTH_REPORT_FAIL_TYPE, data: { month: [], isLoading: true, status: false, message: err.message } });
            });
    },
    requestQuarterReport: (id) => async (dispatch, getState) => {
        dispatch({ type: COMPANY_QUARTER_REPORT_TYPE, data: initialState });

        await get(COMPANY_QUARTER_REPORT + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: COMPANY_QUARTER_REPORT_SUCCESS_TYPE, data: { quarter: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: COMPANY_QUARTER_REPORT_FAIL_TYPE, data: { quarter: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: COMPANY_QUARTER_REPORT_FAIL_TYPE, data: { quarter: [], isLoading: true, status: false, message: err.message } });
            });
    },
    requestYearReport: (fromYear, toYear) => async (dispatch, getState) => {
        dispatch({ type: COMPANY_YEAR_REPORT_TYPE, data: initialState });

        await get(COMPANY_YEAR_REPORT + 'fromYear=' + fromYear + '&' + 'toYear=' + toYear)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: COMPANY_YEAR_REPORT_SUCCESS_TYPE, data: { year: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: COMPANY_YEAR_REPORT_FAIL_TYPE, data: { year: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: COMPANY_YEAR_REPORT_FAIL_TYPE, data: { year: [], isLoading: true, status: false, message: err.message } });
            });
    },
}