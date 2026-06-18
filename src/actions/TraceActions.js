import {
    TRACE_LIST,
    TRACE_GET,
    TRACE_GET_HISTORY,
    TRACE_GET_FIELDS,
    TRACE_GET_PRODUCT_BY_TRACE,
    TRACE_DELETE,
    TRACE_COMPLETED,
    TRACE_CREATE,
    TRACE_GET_FIELD_FOR_ADD,
    PRODUCTS_LIST_LOCK,
    PLANTING_ZONE_GET_LIST,
    TRACE_GET_INFORM_SELECT,
    TRACE_GET_ATTRIBUTE,
    TRACE_WRITE,
    TRACE_GET_PLANZONE,
    RD_CUSTOMER_LIST,
    RD_PROVIDER_LIST,
    RD_EMPLOYEE_LIST,
    RD_MATERIAL_LIST,
    RD_MATERIAL_UNIT_LIST,
    RD_WAREHOUSE_LIST,
    RD_VEHICLE_LIST,
    RD_FACTORY_LIST,
    RD_TOOL_LIST,
    RD_TRANSPORT_UNIT_LIST,
    TRACE_EVALUATE,
    TRACE_MADE_AGAIN,
    TRACE_DELETE_WRITE,
    TRACE_GET_DETAIL_INFORM,
    TRACE_PLANZONE_HISTORY,
    TRACE_LIST_EVALUATE,
    TRACE_GET_TRACEROLE,
    TRACE_GET_GOODRECEIPT,
    TRACE_GET_DETAIL_GOODRECEIPT,
    TRACE_CHECK_INVENTORY_MULTI,
    TRACE_GET_INVENTORY_BY_MATERIAL,
    TRACE_UPLOAD,
    TRACE_GET_ITEM,
    TRACE_CHECK_ITEM_VALID,
    TRACE_MATERIAL_BY_QR,
    TRACE_UPDATE_GPS
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    TRACE_LIST_FAIL_TYPE,
    TRACE_LIST_SUCCESS_TYPE,
    TRACE_LIST_TYPE,
    TRACE_GET_TYPE,
    TRACE_GET_SUCCESS_TYPE,
    TRACE_GET_FAIL_TYPE,
    TRACE_GET_HISTORY_TYPE,
    TRACE_GET_HISTORY_SUCCESS_TYPE,
    TRACE_GET_HISTORY_FAIL_TYPE,
    TRACE_GET_FIELDS_TYPE,
    TRACE_GET_FIELDS_SUCCESS_TYPE,
    TRACE_GET_FIELDS_FAIL_TYPE,
    TRACE_GET_PRODUCT_BY_TRACE_TYPE,
    TRACE_GET_PRODUCT_BY_TRACE_SUCCESS_TYPE,
    TRACE_GET_PRODUCT_BY_TRACE_FAIL_TYPE,
    TRACE_DELETE_TYPE,
    TRACE_DELETE_SUCCESS_TYPE,
    TRACE_DELETE_FAIL_TYPE,
    TRACE_COMPLETED_TYPE,
    TRACE_COMPLETED_SUCCESS_TYPE,
    TRACE_COMPLETED_FAIL_TYPE,
    TRACE_CREATE_TYPE,
    TRACE_CREATE_SUCCESS_TYPE,
    TRACE_CREATE_FAIL_TYPE,
    TRACE_GET_FIELD_FOR_ADD_TYPE,
    TRACE_GET_FIELD_FOR_ADD_SUCCESS_TYPE,
    TRACE_GET_FIELD_FOR_ADD_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionTrace = {
    requestListTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_LIST_TYPE, data: initialState
            });

            await post(TRACE_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetTrace: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_TYPE, data: initialState
            });

            return await get(TRACE_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    },
    requestGetHistoryTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_HISTORY_TYPE, data: initialState
            });

            await post(TRACE_GET_HISTORY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_HISTORY_SUCCESS_TYPE, data: { getHistory: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_HISTORY_FAIL_TYPE, data: { getHistory: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_HISTORY_FAIL_TYPE, data: { getHistory: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetListFieldComboBox: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_FIELDS_TYPE, data: initialState
            });

            await get(TRACE_GET_FIELDS, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_FIELDS_SUCCESS_TYPE, data: { fields: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_FIELDS_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_FIELDS_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetListProductComboBox: (fieldId) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_PRODUCT_BY_TRACE_TYPE, data: initialState
            });

            await get(TRACE_GET_PRODUCT_BY_TRACE + fieldId)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_PRODUCT_BY_TRACE_SUCCESS_TYPE, data: { products: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_PRODUCT_BY_TRACE_FAIL_TYPE, data: { products: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_PRODUCT_BY_TRACE_FAIL_TYPE, data: { products: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteTrace: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_DELETE_TYPE, data: initialState
            });
            const url = TRACE_DELETE + id;
            await del(url, {})
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_DELETE_SUCCESS_TYPE, data: { isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_DELETE_FAIL_TYPE, data: { isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_DELETE_FAIL_TYPE, data: { isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestCompletedTrace: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_COMPLETED_TYPE, data: initialState
            });
            const url = TRACE_COMPLETED + id;
            await get(url, {})
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_COMPLETED_SUCCESS_TYPE, data: { isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_COMPLETED_FAIL_TYPE, data: { isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_COMPLETED_FAIL_TYPE, data: { isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestCreateTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_CREATE_TYPE, data: initialState
            });

            await post(TRACE_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_CREATE_SUCCESS_TYPE, data: { isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_CREATE_FAIL_TYPE, data: { isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_CREATE_FAIL_TYPE, data: { isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetListFieldForAddComboBox: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: TRACE_GET_FIELD_FOR_ADD_TYPE, data: initialState
            });

            // Endpoint getallbycompanyhaveaccesstrace yêu cầu POST (đối chiếu app mobile),
            // dùng GET sẽ trả rỗng khiến dropdown "Ngành nghề" trong form thêm mới trống.
            await post(TRACE_GET_FIELD_FOR_ADD, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: TRACE_GET_FIELD_FOR_ADD_SUCCESS_TYPE, data: { fields: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: TRACE_GET_FIELD_FOR_ADD_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: TRACE_GET_FIELD_FOR_ADD_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetListProductForAddComboBox: () => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await post(PRODUCTS_LIST_LOCK, JSON.stringify({ search: "", filter: "", orderBy: "", page: null, limit: null }))
                .then(res => {
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetListPlantingZoneForAddComboBox: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await post(PLANTING_ZONE_GET_LIST, data)
                .then(res => {
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    /* ===== Ghi nhật ký truy cập (record diary) — đối chiếu app mobile ===== */

    // trace/get?id= trả về { trace, informSelects } (danh sách loại nhật ký hợp lệ)
    requestGetInformSelect: (traceId) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await get(TRACE_GET_INFORM_SELECT + traceId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // trace/getattribute?informSelectId= trả về { informs, informSelects }; attributes = informs.isData>0
    requestGetAttribute: (informSelectId) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await get(TRACE_GET_ATTRIBUTE + informSelectId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // POST trace/writetrace với payload { traceID, informID, plantingZoneID, contents, itemID, createdBy, createdDate }
    requestWriteTrace: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await post(TRACE_WRITE, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // trace/getplanzone?traceId= danh sách vị trí (planting zone) của trace
    requestGetPlanZoneByTrace: (traceId) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            await get(TRACE_GET_PLANZONE + traceId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // ----- reference lookups -----
    requestRDCustomerList: (data) => async () => {
        return new Promise(async resolve => {
            await get(RD_CUSTOMER_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDProviderList: (data) => async () => {
        return new Promise(async resolve => {
            await get(RD_PROVIDER_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDEmployeeList: (data) => async () => {
        return new Promise(async resolve => {
            await post(RD_EMPLOYEE_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDMaterialList: (data) => async () => {
        return new Promise(async resolve => {
            await post(RD_MATERIAL_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDMaterialUnitList: (materialId) => async () => {
        return new Promise(async resolve => {
            await get(RD_MATERIAL_UNIT_LIST + materialId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDWarehouseList: (data) => async () => {
        return new Promise(async resolve => {
            await post(RD_WAREHOUSE_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDVehicleList: (data) => async () => {
        return new Promise(async resolve => {
            await post(RD_VEHICLE_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDFactoryList: (data) => async () => {
        return new Promise(async resolve => {
            await get(RD_FACTORY_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDToolList: (data) => async () => {
        return new Promise(async resolve => {
            await get(RD_TOOL_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
    requestRDTransportUnitList: (data) => async () => {
        return new Promise(async resolve => {
            await get(RD_TRANSPORT_UNIT_LIST, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    /* ===== Quản lý bản ghi nhật ký ===== */

    // POST multipart trace/evaluate { id, eResult(1|2), reason, files? }
    requestEvaluateDiary: ({ id, eResult, reason, files }) => async () => {
        return new Promise(async resolve => {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("eResult", eResult);
            formData.append("reason", reason || "");
            if (files && files.length > 0) {
                files.forEach((f) => formData.append("files", f));
            }
            await postFormData(TRACE_EVALUATE, formData)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // POST multipart trace/madeagain { id }
    requestMadeAgainDiary: (id) => async () => {
        return new Promise(async resolve => {
            const formData = new FormData();
            formData.append("id", id);
            await postFormData(TRACE_MADE_AGAIN, formData)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // DELETE trace/deletewritetrace?traceInfoId=
    requestDeleteWriteTrace: (traceInfoId) => async () => {
        return new Promise(async resolve => {
            await del(TRACE_DELETE_WRITE + traceInfoId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/getdetailtraceinform?traceInformId=
    requestGetDetailTraceInform: (traceInformId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_GET_DETAIL_INFORM + traceInformId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // POST trace/getplanzonehistory
    requestGetPlanzoneHistory: (data) => async () => {
        return new Promise(async resolve => {
            await post(TRACE_PLANZONE_HISTORY, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/getlistevaluate?traceInfoID=
    requestGetListEvaluate: (traceInfoId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_LIST_EVALUATE + traceInfoId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/gettracerole?traceID= (phân quyền theo trace)
    requestGetTraceRole: (traceId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_GET_TRACEROLE + traceId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    /* ===== Tồn kho + phiếu nhập ===== */

    // GET trace/getgoodreceipt?traceId=
    requestGetGoodReceipt: (traceId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_GET_GOODRECEIPT + traceId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/getdetailgoodreceipt?grId=
    requestGetDetailGoodReceipt: (grId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_GET_DETAIL_GOODRECEIPT + grId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // POST inventory/checkinventorymulti
    requestCheckInventoryMulti: (data) => async () => {
        return new Promise(async resolve => {
            await post(TRACE_CHECK_INVENTORY_MULTI, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET inventory tồn kho theo material + unit
    requestGetInventoryByMaterial: (unitIdTarget, productMaterialId) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_GET_INVENTORY_BY_MATERIAL + unitIdTarget + "&productMaterialId=" + productMaterialId)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    /* ===== Ảnh + cá thể + QR ===== */

    // POST multipart trace/upload — trả về url ảnh
    requestUploadTraceFile: (formData) => async () => {
        return new Promise(async resolve => {
            await postFormData(TRACE_UPLOAD, formData)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/getitem?traceID=&planZoneID=&page=&limit=&search=
    requestGetItemForDiary: ({ traceId, planZoneId, page, limit, search }) => async () => {
        return new Promise(async resolve => {
            const url = TRACE_GET_ITEM +
                "?traceID=" + (traceId || "") +
                "&planZoneID=" + (planZoneId || "") +
                "&page=" + (page || 0) +
                "&limit=" + (limit || 50) +
                "&search=" + (search || "");
            await get(url)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET trace/checkitemvalid?qrCode= (quét QR cá thể)
    requestCheckItemValid: (qrCode) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_CHECK_ITEM_VALID + encodeURIComponent(qrCode))
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // GET material/getbyqr?materialGroupId=&refQRCode= (quét QR NVL)
    requestGetMaterialByQR: (materialGroupId, refQRCode) => async () => {
        return new Promise(async resolve => {
            await get(TRACE_MATERIAL_BY_QR + (materialGroupId || "") + "&refQRCode=" + encodeURIComponent(refQRCode || ""))
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },

    // POST trace/updatetraceinformgps
    requestUpdateTraceInformGPS: (data) => async () => {
        return new Promise(async resolve => {
            await post(TRACE_UPDATE_GPS, data)
                .then(res => resolve({ status: true, data: res }))
                .catch(err => resolve({ status: false, error: err }));
        });
    },
}