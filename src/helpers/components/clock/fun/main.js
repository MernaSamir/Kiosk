import moment from 'moment'
import {get} from 'lodash';

export const diff = (params, props)=>{
    const time = moment(get(props, params.select, props.time))
    const c_time = get(props, params.compare)
    return `${time.diff(c_time, 'minutes')}${ params.label ? `m`:''}`
}