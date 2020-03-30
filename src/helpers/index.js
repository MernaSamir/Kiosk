import { get, mapValues, sumBy, filter, pickBy, map, pick, isArray } from 'lodash'
import store from 'store';
import converter from 'number-to-words';
export * from './best_match_filter'
import axios from 'axios'
import { array_to_obj } from './functions';

export const replace = (array, first, second) => {
    let tmp = array[first]
    array[first] = array[second]
    array[second] = tmp
}

export const applyOperationOnTotal = (total, percentage) => {
    let value = (total * percentage) / 100
    return total += value

}

export const convert = (num) => {
    return converter.toWords(num).charAt(0).toUpperCase() + converter.toWords(num).slice(1)
}

export const getReceiptQty = (item, details) => {
    return (item.quantity - sumBy(filter(details, { void: item.id }), 'quantity'))
}


export const getReceiptItems = (items) => {
    return map(filter(items, { void: null }), d => ({
        ...pick(d, ['quantity', 'price']),
        details: d.id,
        quantity: getReceiptQty(d, items)
    }))
}
export const voidQty = (item, details) => {
    return item.quantity - sumBy(filter(details, { void: item.id }), 'quantity')
}
export const voidedQty = (item, details) => {
    return sumBy(filter(details, { void: item.id }), 'quantity')
}




export const getSize = (shape, size, unit) => {

    let width, height;
    if (shape == "Circle") {

        height = (unit * size);
        width = (unit * size);
    }
    if (shape == 'Square') {
        height = (unit * size);
        width = (unit * size);
    }
    if (shape == 'Rectangle') {
        height = unit * size * 2
        width = unit * size
    }
    return { width, height }

}
export const getPos = (table)=>{
    let width = (table.pos_x + table.size)
    let height = table.pos_y + table.size
    if (table.shape == 'Rectangle')
        height = table.pos_y +( table.size * 2)
    return {width,height}
}
export const getShape = (x, y, size, shape, grid) => {
    const width =( x + size)
    let height = (y + size)
    let myShape = []
    if (shape == 'Rectangle') {
        height = (y + (size * 2))
    }
    if(width > grid.width || height > grid.height){
        return -1
    }
    for (let i = x; i < width; i++) {
        for (let j = y; j < height; j++) {
            myShape.push({pos_x:i, pos_y:j})
        }
    }
    return myShape
}

export const watchRequest = async (watcher) => {
    let dispatches = []
    return Promise.all(watcher.apps.filter(d => (!d.reject)).map(app => {
        return axios.post(`/api/v1/${app.url}get_all/`, app.filter).then(({ data }) => {
            dispatches.push({ type: `set_data_${get(app, 'app', app.name)}`, data })
            return data
        })
    }
    )).then(data=>{
       store.dispatch(dispatches)
       return data;
    })
}

export const multiRequest = async (apps, afterFetch = ()=>([])) => {
    if(isArray(apps)){
        apps = apps.reduce((o, v)=>({...o, [v.name||v.app]: {}}), {})
    }
    return axios.post("/api/v1/multi_query/", apps).then(({ data }) => {
        const res_data = mapValues(data, d=>(array_to_obj(d)));
        const dis_after = afterFetch(data, res_data)
        const dispatched = map(pickBy(res_data, d=>d), (d, name)=>{
            // console.log(d)
            return {
                type: `set_data_${name}`,
                data: d
            }
        })
        store.dispatch([...dispatched, ...dis_after])
        return data
    }).catch(d=>{
        return d
    })
}

export const uploadBulk = async (data) => {
    return axios.post("/api/v1/upload_model/", {data}).then(({ data }) => {
        const res_data = mapValues(data, d=>(array_to_obj(d)));
        const dispatched = map(res_data, (d, name)=>{
            // console.log(d)
            return {
                type: `set_data_${name}`,
                data: d
            }
        })
        store.dispatch([...dispatched])
        return data
    })
}




export const getWatchRequest = async (watcher) => {
    return Promise.all(watcher.apps.filter(d => (!d.reject)).map(app => {
        return axios.get(`/api/v1/${app.url}`, {params: app.filter}).then(({ data }) => {
            store.dispatch({ type: `set_data_${get(app, 'app', app.name)}`, data })
            return data
        })
    }
    ))
}

export const getAppsStatisctics = async (apps) => {
    return Promise.all(apps.filter(d => (!d.reject)).map(app => {
        return axios.post(`/api/v1/${app.url}post_statistics/`, app.request).then(({ data }) => {
            return array_to_obj(data.data, app.request.groupby)
        })
    }
    ))
}

export const caluclateRefundQty = (receiptItems, refundedItems) =>{
    let items = map(receiptItems,d=>{
        let refunded = filter(refundedItems,v=>v.details == d.details)
        if( refunded ){
            return{...d, quantity:d.quantity + sumBy(refunded,'quantity') }
        }
        else{
            return d
        }

    })
    return {quantity: sumBy(items,'quantity'), list: items}
}

export const totalRefundedQty = (receiptItems, refundedItems) =>{
    let items = map(receiptItems,d=>{
        let refunded = filter(refundedItems,v=>v.details == d.details).map(s=>({...s,quantity:s.quantity * -1}))
        if( refunded.length ){
            return {...d, refQty:sumBy(refunded,'quantity')}
        }
        else{
            return d
        }

    })
    return items
}

