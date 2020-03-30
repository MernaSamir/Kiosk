const axios = require('axios');
import { map } from 'lodash'
import { array_to_obj } from 'helpers/functions/array_to_object';
import {convertApiPath} from './../functions/convrters'
export const apps_apis = ()=>{
    return axios.get('/api/v1/')
    .then(function (response) {
        let keys = Object.keys(response.data)
        let data = map(keys, api => {
            let name = convertApiPath(api);
            return { 'name': name, app: name, 'api': api+'/' }
        })
        
        return array_to_obj(data, "name")
    })
}



