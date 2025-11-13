import {
    REPORTV2_GET_REPORT_LIST_COMPANY_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_COMPANY_API,
    REPORTV2_GET_REPORT_LIST_PRODUCT_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_PRODUCT_API,
    REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API,
    REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_API,
    REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_API,
    REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API,
    REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API
} from "../apis";
import {
    get, getHeader
} from "../services/Dataservice";
import {

} from "../services/Common";
import axios from "axios";

export const reportV2Action = {
    getReportListCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_COMPANY_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.taxCode)
                .replace('{5}', data.companyName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_COMPANY_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.taxCode)
                .replace('{5}', data.companyName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getReportListProduct: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_PRODUCT_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.productName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListProduct: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_PRODUCT_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.productName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getReportListQuantityProductByPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.page)
                .replace('{6}', data.limit);

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListQuantityProductByPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_BY_PLANTINGZONE_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.page)
                .replace('{6}', data.limit);

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getReportListQuantityProduct: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_QUANTITY_PRODUCT_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.productName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListQuantityProduct: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_QUANTITY_PRODUCT_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.productGroupId)
                .replace('{5}', data.productName)
                .replace('{6}', data.page)
                .replace('{7}', data.limit);

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getReportListZoningPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.plantingZoneId)

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListZoningPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.plantingZoneId)

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getReportListZoningPlantingZoneByCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_GET_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.plantingZoneId)
                .replace('{5}', data.taxCode)
                .replace('{6}', data.companyName)
                .replace('{7}', data.page)
                .replace('{8}', data.limit)

            get(url).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    printExcelReportListZoningPlantingZoneByCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = REPORTV2_PRINT_EXCEL_REPORT_LIST_ZONING_PLANTINGZONE_BY_COMPANY_API
                .replace('{0}', data.fromDate)
                .replace('{1}', data.toDate)
                .replace('{2}', data.districtId)
                .replace('{3}', data.wardId)
                .replace('{4}', data.plantingZoneId)
                .replace('{5}', data.taxCode)
                .replace('{6}', data.companyName)
                .replace('{7}', data.page)
                .replace('{8}', data.limit)

            axios({
                method: 'POST',
                url,
                responseType: 'blob',
                headers: getHeader()
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));

                resolve({
                    ok: true,
                    data: url
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    }
}