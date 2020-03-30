import moment from 'moment';
import { get } from 'lodash';
export const date = (val, params)=>val?(moment(val).format('DD-MM-YYYY')): params.non_default? "" : moment().format('DD-MM-YYYY')
export const select = (val, params, state)=>{
    return get(state, `${params.reduxName}.data.${val}.${params.show}`)
}

export const label = (val, field) => {
    return field.msg
};
export const hour = (val,params)=>val?(moment(val).format('HH:mm')):params.non_default? "" : moment().format('HH:mm')
