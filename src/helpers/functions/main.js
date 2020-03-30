import {transform, isArray, isObject, get, isEqual} from 'lodash'
import Connect from './connect';
import store from 'store';
import Loading from 'helpers/components/loading';
import {multiRequest} from 'helpers';
export const getChainedApis = (data={}, state=store.getState())=>{
    let out = [];
    if(data.reduxName){
        const api = get(state, `apps.apis.${data.reduxName}`, {name: data.reduxName});
        out = [api];
        if(data.child){
            out = [api, ...getChainedApis(data.child, state)]
        }
    }
    return out;

}
export const getAppFromApi = (apps, state=store.getState())=>{
    return apps.map(d=>(get(state, `apps.apis.${d}`)));
}

export const ConnectApps = (apps, state=store.getState())=>{
    apps.filter(d=>d).map(app=>({
        name: app.name,
        settings: {
            url: app.api
        }
    })).map(d=>(Connect(null, d, Loading)))
}

export const ConnectAllApps = (data, apps=[], state=store.getState(), props={})=>{
    let allApps = [...getChainedApis(data, state), ...getAppFromApi(apps, state), ...getChainedApis(props.extra, state)];
    // console.log(allApps)
    allApps = allApps.filter(d=> d && (!get(state, `${d.name}.data`)))
    ConnectApps(allApps, state);
    return multiRequest(allApps)
}

export const getChildFilter = (data, state=store.getState(), props={})=>{
    // const api = get(state, `apps.api.${data.reduxName}`, {name: data.reduxName});
    if(data.child){
        return getChildFilter(data.child, state, {
            mainData: props.mainData || data,
            get select(){
                return {
                    [get(data, 'reduxName', this.mainData.reduxName)]: data.child.match,
                    ...props.select
                } 
            } 
        })
    }
    return {
        key: 'ListInside',
        path: data.reduxName,
        compare: 'id',
        select: 'id',
        selectors: {
            // [data.reduxName]: data.match,
            ...props.select
        }
    }
}




const changes = (object, base, reject) => {
    let arrayIndexCounter = 0;
    return transform(object, function (result, value, key) {
        if (!isEqual(value, base[key]) || reject.includes(key)) {
            let resultKey = isArray(base) ? arrayIndexCounter++ : key;
            result[resultKey] = (isObject(value) && isObject(base[key])) ? changes(value, base[key], reject) : value;
            // console.log("Result: " + JSON.stringify(result));
        }
    });
}
export const difference = (object, base, reject=['id'])=> {
    return changes(object, base, reject);
}

export const Translate = (text, lang, state=store.getState())=>{
    return get(state, `lang.trans.${lang}.${text}`, text);
}