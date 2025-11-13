import { 
  PRICE_LIST,
  PRICE_GET_INFO,
  PRICE_CREATE_NEW,
  PRICE_UPDATE_INFO,
  PRICE_DELETE
} from "../apis";

import { 
  post, get, del 
} from "../services/Dataservice";

import { 
  SUCCESS_CODE, 
  GET_PRICE_LIST_TYPE, 
  GET_PRICE_LIST_SUCCESS_TYPE, 
  GET_PRICE_LIST_FAIL_TYPE,
  GET_PRICE_INFO_TYPE,
  UPDATE_PRICE_INFO_TYPE,
  UPDATE_PRICE_INFO_FAIL_TYPE,
  UPDATE_PRICE_INFO_SUCCESS_TYPE,
  CREATE_PRICE_LIST_TYPE,
  DELETE_PRICE_INFO_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionPriceCreators = {

  getAllPriceList: (data) => async (dispatch, getState) => {
    dispatch({ type: GET_PRICE_LIST_TYPE, data: initialState });

    await post(PRICE_LIST, data)
      .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_PRICE_LIST_SUCCESS_TYPE, data: { prices: res.data, isLoading: true, status: true, message: res.message }});
          } else {
            dispatch({ type: GET_PRICE_LIST_FAIL_TYPE, data: { prices: [], isLoading: true, status: false, message: res.message }});
          }
      })
      .catch(err => {
        dispatch({ type: GET_PRICE_LIST_FAIL_TYPE, data: { prices: [], isLoading: true, status: false, message: err.message }});
      });
  },

  getPriceByID: (id) => async (dispatch, getState) => {
    dispatch({ type: GET_PRICE_INFO_TYPE, data: initialState });

    return await get(PRICE_GET_INFO + id);
  },

  updatePriceInfo: (data) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_PRICE_INFO_TYPE, data: initialState });

    return await post(PRICE_UPDATE_INFO, data);
  },

  createNewPrice: (data) => async (dispatch, getState) => {
    dispatch({ type: CREATE_PRICE_LIST_TYPE, data: initialState });

    return await post(PRICE_CREATE_NEW, data);
  },

  deletePriceInfo: (id) => async (dispatch, getState) => {
    dispatch({ type: DELETE_PRICE_INFO_TYPE, data: initialState });

    return await del(PRICE_DELETE + id);
  },
};

