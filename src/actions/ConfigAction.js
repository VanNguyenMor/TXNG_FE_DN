import {
    CONFIG_MENU
} from "../apis";
import { get } from "../services/Dataservice";
import {
    FETCH_LIST_MENU_SUCCESS,
    FETCH_LIST_MENU_FAILURE
} from "../services/Common";

export const actionMenuCreators = {
    getMenu: () => async (dispatch, _) => {
        
        return new Promise(resolve => {
            dispatch({ type: FETCH_LIST_MENU_SUCCESS, data: [] });

            get(CONFIG_MENU).then(res => {
                if (res.status == 200) {
                    dispatch({ type: FETCH_LIST_MENU_SUCCESS, data: res.data });


                    resolve({
                        ok: true,
                        data: res
                    });
                } else {
                    dispatch({ type: FETCH_LIST_MENU_FAILURE, data: [] });

                    resolve({
                        ok: false,
                        error: res
                    });
                }
            })
            .catch(err => {
                dispatch({ type: FETCH_LIST_MENU_FAILURE, data: [] });

                resolve({
                    ok: false,
                    error: err
                });
            });
        });
    }
};