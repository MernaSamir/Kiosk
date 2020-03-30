import store from 'store';
import {mapValues, get, reduce} from 'lodash';
const dispatchFrom = (type, path, data)=>{
    store.dispatch({
        type: `${type}_form`,
        path,
        data
    })
}
export const setFormValues = (params, row)=>{
    dispatchFrom('set_data', null, 
        {
            [params.reduxName]: mapValues(params, d=>(get(row, d, '')))
        }
    );
    
}
export const appendForm = (params, row)=>{
    dispatchFrom('append_path', `${params.reduxName}.${get(params, 'path', 'data')}`, 
        mapValues(params.val, d=>(get(row, d, '')))
    );
}
export const mapKeysForm = (params, row)=>{
    dispatchFrom('append_path', `${params.reduxName}.${get(params, 'path', 'data')}`, 
        reduce(params.key, (o, d, index)=>({
            ...o, 
            [get(row, d, '')]: { 
                ...mapValues(params.val, d=>(get(row, d, '')))
            }
        }), {})
    );
}

export const generateQR = ()=>{
    this.upload.click()
}
