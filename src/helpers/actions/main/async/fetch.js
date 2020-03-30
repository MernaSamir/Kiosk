import axios from 'axios'
import { API_URL } from 'config';

export const fetchAll = (dispatch) => {
    return (apps) => {
        apps.forEach(app => {
            axios.get(API_URL + app.api, { params: app.params }).then(({ data }) => {
                dispatch({ type: `set_data_${app.name}`, data, path: 'data' })
            })
        })
    }
}
