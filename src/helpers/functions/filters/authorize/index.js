import {get, pick, map, reduce} from 'lodash'
import store from 'store';
import * as PerFunctions from './main'
export const authorize = (params, data, state=store.getState(), props={})=>{
  const user = get(state, get(props, 'user', 'main.current'), {})
  // if(user.is_admin){
  //     return true
  // }
  if (user.id) {
    // if(user.is_admin){
    //     return true
    // }
    const mainRules = reduce(pick(get(state, `auths__pos_functions.groups.role`, {}), user.role), (o, v)=> ({...o, ...v}), {})
    const roles = map(mainRules, (d)=>d.key)
    if (params.compare) {
      const permitted = params.compare.filter((d)=>(roles.includes(d))).filter((d)=>(get(PerFunctions, d, ()=>(true))(data, state, props)));
      if (permitted.length) {
        return true
      }
    } else {
      return true
    }
    return user.is_admin;
  }
  return false;
}
