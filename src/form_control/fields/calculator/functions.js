import applyFilter from 'helpers/functions/filters';
import {difference} from 'helpers/functions'
import {get, concat, reduce, isEqual, isEmpty, keys, round, has,
     map, dropRight, isNumber, sumBy } from 'lodash'

const float_digits = 2
export const adding = (params={}, { form={}, fullForm, allValues}, main_data={}, field) => {
    const {filter_field_name, fullFormMatch} = params
    const fromVals = fullFormMatch ? fullForm : get(form, 'values', {}) 
    const data = get(fromVals, `${filter_field_name}`, []);        
    return getSum(params, data, main_data)
}

//same as custom label but i need the value in the form so i applied it here
export const normalFilterCustomLabel = (params={}, { allValues={}}, main_data={}, field) =>{
    return applyFilter(params.fun,undefined, undefined, {data: main_data})
}
export const addFromForm = (params={}, { allValues={}}, main_data={}, field) => { 
    const {pick} = params
    const item_var = get(field.name.split('.'), '1')
    
    let total = reduce(allValues, (o,v) => {
        return o + (get(v, `${item_var}.${pick}`, 0) || 0)
    }, 0)

    return total || 0
}
export const costSum = (params,data, main_data, field={}) =>{
    const items__recipe = applyFilter({
        key:'Filter',
        path:'items__recipe',
        params:{
            sales_item: get(field, "name", "").split(".")[0]
        }
    })   
    const items__recipe_weight = applyFilter({
        key:'Includes',
        path: 'stock__item_weight_price',
        pick: 'stock_item',
        select: 'item'
    },  undefined, undefined, {data: items__recipe})
    return sumBy(map(items__recipe_weight, s=>(s)), d=>d.price*d.qty) 
}

const getSum = (params,data, main_data) => {
    
    const {path, select, where} = params

    const list = applyFilter({
        key: 'Includes',
        path,
        select,
    }, undefined, undefined, {data: concat([], data)})

    let sum = 0;
    list.map(l => {
        if(get(l, where,"") == get(main_data, "id")) {
            sum += parseFloat(get(l, get(params, 'pick'), 0))
        }
    })
    return sum || 0
}

export const getBalance =(params={}, {fullForm}, main_data={}, field={}) => {
    const {fullFormMatch} =  params 
    let store = fullFormMatch ? get(fullForm, fullFormMatch) : get(field, "name", "").split(".")[0]
    return findBalance(main_data, params.path, store)
    
}
export const getBalanceOfParent =(params={}, {fullForm}, main_data={}, field={}) => {
    const {fullFormMatch, parent_path} =  params 
    let child_store = fullFormMatch ? get(fullForm, fullFormMatch) : get(field, "name", "").split(".")[0]
    const item = applyFilter({path: `${parent_path}.data.${child_store}`}) || {}
    const store = get(item, 'parent') || item.id
    return findBalance(main_data, params.path, store) || 0
    
}

export const findBalance = (main_data,path, store) => {
    let item_variant = get(main_data, "id")
    const balance = applyFilter({
        key:'Find',
        path,
        params:{
            item_variant, store
        }
    })

    return get(balance, `quantity`, 0) || ""
}

export const calcBalance = (params={}, {fullForm}, main_data={}, field={}) => {
    const { match_path,match,path} = params; 
    const {name=""} = field;
    const pr = applyFilter({
        path: `${match_path}.data.${name.split(".")[0]}`
    })

    return round(findBalance(main_data, path, get(pr, `${match}`)), 4)
}

export const getBalanceValue = (params={}, {fullForm}, main_data={}, field={}) => {
    const {match_with, match_path,match, fullFormMatch} = params;
    const {name=""} = field;
    
    const list = applyFilter({
        key: 'Includes',
        path:match_path,
        select: match_with,
    }, undefined, undefined, {data: fullFormMatch ? concat([],get(fullForm, fullFormMatch, [])) : name.split(".")})
    
    
    const data = get(list, `0.${match}`, [])
    return getSum(params, data, main_data)
}


export const Cost = (params={}, {fullForm}, main_data={}, field={}) => {
    const stock_item = applyFilter({path: `stock__items.data.${main_data.stock_item}`})
    if(stock_item){
        return Number(main_data.unit_qty) * stock_item.unit_cost
    }
    return null
}
export const getLast = (func_params = params={}, {fullForm}, main_data={}, field={}) => {
    const {path,item_key, pick} = func_params
    let params = {};
    params[item_key] = get (main_data, "id")

    const item = applyFilter({
        key: 'Filter',
        path,
        params,
        then : {
            key:'GetLast',
        }
    })

    return get(item, pick ,0) || 0
}

export const findButcher = (params = {}, {form}, main_data={}, field={}) => {
    const {pick,child_key,parent_key,...filter} = params
    const field_name = get(field, "name", "").split(".")
    let filter_params ={
        [parent_key] : field_name[0],
        [child_key]: field_name[1]
    }

    const item = applyFilter({ params: filter_params, ...filter})    
    console.log(round(get(item,pick,0), float_digits) || 0)
    return  round(get(item,pick,0), float_digits) || 0
}

export const getFromId= (params = {}, {form}, main_data={}, field={}) => { 
    const {path, pick, id_path, wanted_id_path} = params

    const data = applyFilter({
        key:"Find",
        path: `stock__transaction_tr`,
        params:{
            id: "stock__transaction_tr.active"
        }
    })
    const wanted_store = applyFilter({
        path:`licensing__store.data.${get(data, "from_store","")}`
    }) 

    
    return get(wanted_store, "name", "")

}


export const calculateWeight = ( params = {}, {form={}}, main_data={}, field={}) => {
    const {percent_key, parent_value} = params; const {values} = form
    const field_name = get(field, "name", "").split(".")
    const parent_item = applyFilter({ path: parent_value})
    const weights = applyFilter({ path:`form.totals.weights.${parent_item}`})
    let weight = get(weights,`${field_name[1]}`)

    if(!weight) {
        weight = get(weights,`${field_name[0]}`)
        const percent = get(values, `${field_name[0]}.${field_name[1]}.${percent_key}`) || 0  
        return round(weight * (percent / 100), float_digits) || 0
    } 

    return has(values, field_name[1]) ? 0 : weight
    
}

function addWeights({chosen_item, total_weight, saved_weights, percentages}, appendPath) {
    const weights = reduce (percentages, (o,value) => {
        const item_weight = total_weight *(get(value, "percent_of_output",0)/100) || 0
        const item = get(value, "stock_item_variant")
        return ({...o, [chosen_item] : {...get(o,chosen_item,{}), [item]: item_weight}})
    }, {})
    let diff = difference (weights,saved_weights)
    
    if(!isEmpty(diff) ) {
        appendPath('form', `totals.weights.${chosen_item}`,{  
            ...get(saved_weights, chosen_item, {}), 
            ...get(diff, chosen_item,{}),
        });
    }
}

//calculating base value for all parents  which equals : 
//  ( total_price / ∑ (child_actual_weight * child_price_ratio))
function addBasePrice (actual_weights, appendPath, id) {
    let in_items = applyFilter({
        path: "form.stock__butcher_orders_in_detail.depth_values"
    })
    let saved_base = applyFilter({path: `form.totals.base`})
    const chosen_item = get(in_items, id,{})
    const total_price = get(chosen_item,'totalcost',0)
    let children_base ={};
    let sum = reduce(get(actual_weights,id), (o,val,key) => {
        const ratio = get(val, `market_price_ratio`, 0) / 100
        //if the item also have extra input
        const extra_in_weight =  get(in_items,`${key}.weight`,0)  || 0
        const extra_in_price =  get(in_items,`${key}.totalcost`,0)  || 0

        let weights = get(val, 'actual_weight',0) - extra_in_weight
        let children_weights = get(actual_weights, key)
        
        if(children_weights) {
            let child_sum = 0
            //if the item is a child and also a parent then calculate sum of its children weights to get its actual weight
            let children_total_weights = reduce(children_weights, (ch_o,ch_val) => {
                // gettin sum of childrens weight * price ratio to calculate that items base
                child_sum += (get(ch_val, "actual_weight",0) * (get(ch_val,"market_price_ratio",0 ) / 100))
                return ch_o + get(ch_val, "actual_weight",0)
            }, 0)
            children_base = {...children_base, [key] : {price: (ratio * children_total_weights) + extra_in_price , sum: child_sum}} 
            
            //note that when adding childrens weights to calculate the base 
            //we dont add weight of the item itself if there is an output of the itemitself
            //but we add it when calculating the total weight of the item
            //but this wont work well if there is an extra input of the item and also an output of the item
            //because we add the in price anywho
            weights += children_total_weights
        }
        return o + (ratio * weights)
    }, 0)

    let base = sum ? (total_price / sum) : 0
    if(base) {
        const saved_base_parent = get(saved_base, id)
        if(!saved_base_parent || !isEqual(base,saved_base_parent) ) {
            appendPath('form', "totals.base", {[id]: base})
        }
    }

    if(!isEmpty(children_base)) {
        map(children_base, (v,k) => {
            let child_base = (v.price * base) / v.sum
            let saved_base_child = get(saved_base, k)
            if(child_base && (!saved_base_child || !isEqual(child_base,saved_base_child)) ) {
                appendPath('form', "totals.base", {[k]: child_base})
            }
        })
    }
}

export const getPercentages = ( params = {}, {form={}}, main_data={}, field={}, appendPath) => {
    const weights = applyFilter({
        key:"getWeights",
        params
    }) || {}

    addWeights(weights, appendPath)

    const actual_weights = get(weights, "base_weights")
    addBasePrice(actual_weights, appendPath, weights.chosen_item)
    
}
export const getAllPercentages = ( params = {}, {form={}}, main_data={}, field={}, appendPath) => {
    const {actual_weights_path,in_item_key, in_weight_key,
        saved_weights_path, ...filter} = params
    const weights = applyFilter({path: actual_weights_path})
    const bo = applyFilter({ ...filter })
    const saved_weights = applyFilter({path:saved_weights_path }) || {}
    bo.map(val => {
        const total_weight =  get(val, in_weight_key)
        if(total_weight) {
            const chosen_item = get(val, in_item_key)
            const percentages = applyFilter({
                key:"Filter",
                path:"stock__butcher",
                params:{
                    parent_stock_item_variant: chosen_item
                }
            })
            addWeights({chosen_item, total_weight, saved_weights, percentages}, appendPath)
            addBasePrice(weights, appendPath, chosen_item)
        }
    
    })

    
}
export const caclculateAllocatedPrice =  (params = {}, {form}, main_data={}, field={}) => {
    const {path, out_path} = params
    const field_name = get(field,'name',"").split(".")
    const base = applyFilter({path:`${path}.${field_name[0]}`}) || 0
    //i am supposed to get the percent from form values but it doesnt get updated so gotta take it from redux
    const percent = applyFilter({path:`${out_path}.${field_name[0]}.${field_name[1]}.market_price_ratio`})
    // const percent = get(values, `${field_name[0]}.${field_name[1]}.market_price_ratio`) || 0
    return round( base * (percent / 100) , float_digits) || 0
}


export const caclculatePL =  (params = {}, {form}, main_data={}, field={}) => {
    const{path, price_field, allocated_price_field} = params
    const field_name = dropRight(get(field,'name',"").split(".")).join(".")
    const first_value = applyFilter({path: `${path}.${field_name}.${price_field}`}) || 0
    const second_value = applyFilter({path: `${path}.${field_name}.${allocated_price_field}`}) || 0
    return second_value? (first_value - second_value) : 0
}



export const getProcessingCost = ( params = {}, {form={}, allValues={}}, main_data={}, field={}, appendPath) => {
    const {path, sum_field_name, sum_path}= params;
    const {id} = main_data
    const total_processing_cost = applyFilter({path})
    const sum_data = applyFilter({path:sum_path})
    
    const current_weight = get(sum_data, `${id}.${sum_field_name}`, 0)
    const sum = reduce(sum_data, (o,v) => {
        return o + get(v, sum_field_name, 0)
    }, 0)
    
    const percent = current_weight / sum
    return round(percent * total_processing_cost , float_digits) || 0

}

export const calculateRatio = ( params = {}, {form={}, allValues={}}, main_data={}, field={}, appendPath) => {
    const {field_key, path} = params
    const data = applyFilter({path})
    console.log(data)
    const sum = reduce(data, (o,val) => {
        return o + (get(val,field_key,0) || 0)
    }, 0)

    const item_val = get(data, `${get(main_data, 'id')}.${field_key}`)
    return item_val ? round((item_val / sum) * 100, float_digits) : 0
}

export const getWeight = ( params = {}, {form={}, allValues={}}, main_data={}, field={}, appendPath) => {
    const {path, percent_field} = params ; const {values={}}= form
    const weights = applyFilter({path})
    const field_name = get(field, "name", "").split(".")
    
    let weight = 0;
    let added_weight = get(weights, `${field_name[0]}.${field_name[1]}`,0) || 0
    map(weights, (v,k) => {
        const saved_weight = get(v, field_name[0])
        if(saved_weight) {
            if(isEqual(field_name[0], field_name[1])){
                weight = keys(get(values, field_name[0])).length > 1 ? 0 : saved_weight
            } else {
                const item = applyFilter({
                    key:'Find',
                    path: "stock__butcher",
                    params:{
                        stock_item_variant: field_name[1],
                        parent_stock_item_variant: field_name[0],
                    }
                })
                const percent = get(item, `${percent_field}`, 0) || 0
                weight = saved_weight * (percent/100)
            }
        }
    })
    return round(weight + added_weight , float_digits) || 0
}

export const getFromCPR = ( params = {}, {form={}, allValues={}}, main_data={}, field={}) => { 
    const {pick,item_key, ...filter} = params
    const {id} = main_data
    const data = applyFilter({...filter})
    let sum = reduce(data, (o,v) => {
        const val = get(v,item_key) == id ? get(v, pick, 0) : 0
        return o + val
    },0);

    return sum || null ;
}

export function getItemButcher(params = {}, {form={}, allValues={}}, main_data={}, field={}, appendPath) {
    const {...filter} = params
    const saved_item = applyFilter({path: 'form.stock__butcher_orders.values.item'})
    const item = get(applyFilter({...filter}), `0.item`)
    if(saved_item != item) {
        appendPath( 'form', 'stock__butcher_orders.values',{item})
    }
}

export function getFirstItemVariant(params = {}, {form, allValues}, main_data={}, field={}){
    const {path} = params
    let item_variants = applyFilter({path}) || {}
    return get(keys(item_variants), '0') || null
}

export function gePercentSum (params = {}, {form, allValues}, main_data={}, field={}){
    const {path, field_key, desired_sum, depth}= params;

    const desired_sum_ = isNumber(desired_sum) ? desired_sum : 100
    const data = applyFilter({path})
    const sum = reduce(data, (o,v) => {
        return o + (get(v, field_key, !depth ? 0: reduce(v, (mo,mv) => {
            return mo + (get(mv, field_key,0) || 0)
        }, 0)) || 0)
    }, 0)

    return sum
}

export function getAvWeight (params = {}, {form, allValues}, main_data={}, field={}){
    const {path, total_field, portions_field} = params
    const field_name = dropRight(get(field, "name", "").split(".")).join(".")
    const total = applyFilter({path: `${path}.${field_name}.${total_field}`}) || 0
    const portions = applyFilter({path: `${path}.${field_name}.${portions_field}`}) || 1
    return (total / portions) || 0
}


export function calcItemBalance(params = {}, {form, allValues}, main_data={}, field={}){
    const item = get(main_data,"id")
    const recipe_unit = get(main_data, 'recipe_unit_default', 0)
    const store = get(field, "name","").split(".")[0]
    
    const balances = applyFilter({
        path:"stock__balance",
        key: 'ListInside',
        selectors: {
            'stock__item_variants': "item_variant"
        },
        select: "item",
        compare: item
    }).filter(v => v.store == store)
    
    const total = reduce(balances, (o, v) => {
       
        const recipe_unit_ratio = applyFilter({
            path:`stock__item_variants.data.${v.item_variant}.recipe_unit_ratio`
        })
        const uom = applyFilter({
            path:`dropdowns__units_of_measure.data.${recipe_unit}`,
        })

        if(get(uom,'is_base', false) || !get(uom,'is_universal', true)) {
            return o + (v.quantity * recipe_unit_ratio)
            
        } else {
            const ratios = applyFilter({
                key: 'Filter',
                path:`dropdowns__ratio`,
                params:{
                    'uom': recipe_unit
                }
            })
            return o + (v.quantity * (recipe_unit_ratio / get(ratios, '0.ratio', 1)))            
        }
        
    }, 0)
    const field_name = dropRight(get(field, "name", "").split(".")).join(".")
    let status_value = getStatusValue(get(form, `values.${field_name}`,{}), total)
    form.setFieldValue(`${field_name}.status`,status_value)
    return total ? round(total, 2) : 0

}


function getStatusValue(values, balance){
    const {maximum, minimum} = values
    if(balance > maximum) {
        return "Over Max"
    } else if (balance < minimum) {
        return "Below Min"
    }
    return "Good"
}

