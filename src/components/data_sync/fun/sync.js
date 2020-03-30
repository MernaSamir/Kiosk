import axios from "axios";
import {map} from 'lodash'
export const get_syncs = (props)=>{
    return axios.post(`${props.hq_location.url}/api/v1/multi_query/`, {
        sync__sync: {
            exclude: {
                syncs__location: props.main_location.id
            }
        }
    })
}

export const get_files = (props, syncs)=>{
    return Promise.all(map(syncs, (d=>{
        return axios.get(`${props.hq_location.url}${d.file_path}/data.json`)
        .then(({data})=>(
            {
                key: d.id,
                sync: d,
                data
            }
        ))
    })))
}