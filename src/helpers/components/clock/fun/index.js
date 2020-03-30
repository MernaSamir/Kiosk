import * as funs from './main'
import { get } from 'lodash';
import moment from 'moment'
export default (params={}, props)=>{
    const {format="LLL"} = props
    return get(funs, params.key, (params, props)=> moment(get(props, 'select', props.time)).format(format))(params, props)
}