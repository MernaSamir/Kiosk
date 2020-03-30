import applyFilters from 'helpers/functions/filters';
import {isEqual, get, map} from 'lodash'
import {getGun} from './name';

export function filterDetails(data, {app_name, key}){
    let ids = []
    const gunDB = getGun('hq')
    if(gunDB){
        const gun_app = gunDB.get(app_name)
        gun_app.on(data => {
            ids = map(data,(val,k) => val && k ).filter(l=>l)
        })
        return data[key] && ids.includes(data[key])
    }
}

export function filterOrders(data){
    const call_in = applyFilters({
        key:"Find",
        path: "settings__mode",
        params:{
            key:"CC"
        }
    })
    return isEqual(get(call_in, "id"), get(data,'mode'))
}
