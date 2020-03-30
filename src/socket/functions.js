import store from 'store';
import {find} from 'lodash';
export const dispatch=(data, state=store.getState())=>{
    const apis = state.apps.apis;
    data = data.filter(d=>(find(apis, (v, k)=>(d.type.includes(k))))).filter(d=>(!d.type.includes('set_main')))
    store.dispatch(data)
}