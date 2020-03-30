import {get, filter, map} from 'lodash'
import store from 'store';
import * as PerFunctions from './main'
export const authorize = (params, data, state=store.getState(), props={})=>{
    const user = get(state, get(props, 'user', 'main.current'), {})
    if(user.id){
        const mainRules = filter(state.auths__pos_functions.data, d=>(d.active && user.role.includes(d.role)));
        const roles = map(mainRules, d=>d.key)
        // console.log('rooles', roles)
        if(params.compare){
            const permitted = params.compare.filter(d=>(roles.includes(d))).filter(d=>(get(PerFunctions, d, ()=>(false))({}, state, props)));
            if(permitted.length){
                return true
            }
        }else{
            return true
        }
        return user.is_admin;
    }
    return false;
}