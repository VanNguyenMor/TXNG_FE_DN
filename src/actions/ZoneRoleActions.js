import { 
    ZONE_ROLE_LIST
  } from "../apis";
  
  import { 
    post, get 
  } from "../services/Dataservice";
  
  import { 
    SUCCESS_CODE, 
    GET_ZONE_ROLE_LIST_TYPE,
    GET_ZONE_ROLE_LIST_SUCCESS_TYPE,
    GET_ZONE_ROLE_LIST_FAIL_TYPE
  } from "../services/Common";
  
  const initialState = { data: [], isLoading: false, status: false, message: '' };
  
  export const actionZoneRoleCreators = {
  
    getAllZoneRoleList: (data) => async (dispatch, getState) => {
      dispatch({ type: GET_ZONE_ROLE_LIST_TYPE, data: initialState });
  
      await post(ZONE_ROLE_LIST, data)
        .then(res => {
            if (res.status === SUCCESS_CODE) {
              dispatch({ type: GET_ZONE_ROLE_LIST_SUCCESS_TYPE, data: { zonerole: res.data, isLoading: true, status: true, message: res.message }});
            } else {
              dispatch({ type: GET_ZONE_ROLE_LIST_FAIL_TYPE, data: { zonerole: [], isLoading: true, status: false, message: res.message }});
            }
        })
        .catch(err => {
          dispatch({ type: GET_ZONE_ROLE_LIST_FAIL_TYPE, data: { zonerole: [], isLoading: true, status: false, message: err.message }});
        });
    },
  };