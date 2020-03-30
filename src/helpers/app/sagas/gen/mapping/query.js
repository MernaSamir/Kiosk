import {get} from 'lodash';
export const query = (data, fun)=>{
    data = get(data, fun.index, []).map(d=>get(d, fun.select));
    return {[fun.key]: data}
}