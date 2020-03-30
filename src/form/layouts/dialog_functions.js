import {keys, map, concat, get,isEmpty, mapValues, values, flattenDeep} from 'lodash'
import applyFilter from 'helpers/functions/filters';
import {difference} from 'helpers/functions'
import uuid from 'uuid/v4';
import { ConnectAllApps } from 'helpers/functions/index';
export function getPrs(values, params) {
    const {path, select} = params

    const prs = keys(values);
    
    const list = applyFilter({
        key: 'Includes',
        path,
        select,
    }, undefined, undefined, {data: concat([], prs)})
    return list || []
}

export function getStores(values, params) {
    const {store_key} = params
    const stores = keys(values);
    let list = stores.map( v => ({id:v,[store_key]: v}))
   return list || []
}

function getLast(item_variant){
    const item = applyFilter({
        key: 'Filter',
        path:"stock__vendor_invoices_detail",
        params: {item_variant},
        then : {
            key:'GetLast',
        }
    })

    return get(item, "price_recieved" ,0) || 0
}
export function generatePO() {
    const { initialValues,UpdateBulkApp, fullForm, layout:{extraSubmitButton={}, total_reduxName}, submitFullForm} = this.props
    const {reduxName, child, use_store} = extraSubmitButton
    ConnectAllApps(extraSubmitButton);
    let vals={}
    let newValues = difference({...this.props.values}, initialValues);
    const transaction = uuid();
    console.log(total_reduxName, fullForm)
    let totals = get(fullForm, `${total_reduxName}.total`, {})
    if(use_store) {
        mapValues(newValues, (v,k) => {
            mapValues(v, (s, sk) => {
                if(get(s, 'allocated')) {
                    vals[k] = vals[k] || {}
                    vals[k][sk] = { ...s , 
                        approved:get(this.props.values,`${k}.${sk}.approved`),
                        price: get(totals,`${sk}.price.val`),
                        last_price: get(totals,`${sk}.last_price.val`),
                        item_variant:sk, to_store: k, transaction}
                }
            })
        })

    } else {
        map(newValues, (v,k) => {
            let pr = applyFilter({ path:`stock__product_requisition.data.${k}`})
            const to_store = get(pr, 'to_store')
            
            map(v, (item,key) => {
               
                if(get(item,'allocated')) {
                    const sumapproved = get(vals, `${to_store}.${key}.approved`) || 0
                    const sumallocated = get(vals, `${to_store}.${key}.allocated`) || 0
                    
                    vals[to_store] = vals[to_store] || {}
                    vals[to_store][key] = {
                        item_variant:key,
                        to_store,
                        transaction,
                        approved: sumapproved + get(this.props.values,`${k}.${key}.approved`),
                        allocated: sumallocated + get(item,'allocated'),
                        price: get(totals,`${key}.price.val`),
                        last_price: get(totals,`${key}.last_price.val`),
                    }
                }
                
            })
            
        })
    }
    if(!isEmpty(vals)) {
        let insert = flattenDeep(values(mapValues(vals, v => values(v))))
        const vendor = applyFilter({path: 'form.stock__consolidations.values.vendor'})
        const onSuccess = () => UpdateBulkApp(insert, () => submitFullForm(), undefined, get(child,'reduxName'))
        UpdateBulkApp([{
            id: transaction,
            stores:keys(vals),
            vendor, 
            is_draft: false}], onSuccess, undefined, reduxName)
        
    }
    
}