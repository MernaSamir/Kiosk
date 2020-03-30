import axios from 'axios'
import { API_URL } from 'config';
export const createApp = (dispatch) => {
    return async function (app, data, onSuccess=()=>{}) {
        const res = await axios.post(API_URL + app.url, data);
        dispatch({ type: `appendMain_${app.name}`, path: 'data', data: [res.data] })
        onSuccess(res.data)
    }
}
export const updateApp = (dispatch) => {
    return async function (app, data, onSuccess=()=>{}) {
        const res = await axios.path(`${API_URL}/${app.url}/${data.id}/`, data);
        dispatch({type: `appendMain_${app.name}`, path: 'data', data: [res.data]})
        onSuccess(res.data)
    }
}
export const createOrUpdateApp = (dispatch) => {
    return async function (app, data, onSuccess=()=>{}) {
        if(data.id){
            return updateApp(dispatch)(app, data, onSuccess)
        }
        return createApp(dispatch)(app, data, onSuccess)

    }
}
