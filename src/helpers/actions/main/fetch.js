import axios from 'axios'
import { API_URL } from 'config';
import {get, omit, map} from 'lodash';
export const fetchAll = (dispatch) => {
    return async (apps, onSuccess=()=>{}) => {
        let promises = []
        let dis = []
        apps.forEach(app => {
            promises.push(axios.get(API_URL + (app.api || app.url), { params: app.params }).then(({ data }) => {
                dis.push({ type: `set_data_${app.app}` , data: data.results })
                return data.results;
            }))
        })
        const data = await Promise.all(promises)
        dispatch(dis)
        onSuccess(data)
    }
}
export const dispatchMulti = (dispatch) => {
    return (apps) => {
        const dispatches = map(apps, (d,v)=>({
            type: d.app ? `${d.type}_${d.app}`:d.type,
            ...omit(d, ['type', 'name'])
        }))
        dispatch(dispatches);
    }
}

export const getFromStore = (dispatch, props, getState) => (app, id) =>{
    const store = getState()
    return get(store, `${app.name}.data.${id}`, {})
}


