import {get, find, concat, reduce} from 'lodash'
import applyFilters from 'helpers/functions/filters';
export function getBalanceSum(props){
    const {field={}, func_params={}, main_data} = props
    const {nameIndex=0, } = func_params

    const store = get(field,'name','').split('.')[nameIndex]
    
    const item_variants = applyFilters({
        key:'Filter',
        path:'stock__item_variants',
        params:{item: get(main_data, 'id') }
    })

    const total = reduce(item_variants, (o,v) => {
        let item_variant = get(v, "id")
        
        let found = applyFilters({
            key:'Filter',
            path:'stock__balance',
            params: { store, item_variant }
        })

        const quantity = get(found || {}, "0.quantity",0)
        const recipe_unit = get(v, 'recipe_unit', 0)
        const recipe_unit_ratio = get(v, 'recipe_unit_ratio',0)
        const uom = applyFilters({
            path:`dropdowns__units_of_measure.data.${recipe_unit}`,
        })

        if(get(uom,'is_base', false) || !get(uom,'is_universal', true)) {
            return o + (quantity * recipe_unit_ratio)
            
        } else {
            const ratios = applyFilters({
                key: 'Filter',
                path:`dropdowns__ratio`,
                params:{
                    'uom': recipe_unit
                }
            })
            
            return o + (quantity * (recipe_unit_ratio / get(ratios, '0.ratio', 1)))            
        }
    }, 0)
    
    
    return total || 0
}

export function getValue(props) {
    const {field, func, main_data, fullForm} = props

    const {name=""} = field;
    const {path, select, where, pick, fullFormMatch} = func
    
    const list = applyFilters({
        key: 'Includes',
        path,
        select,
    }, undefined, undefined, 
        {data: fullFormMatch ? concat([], get(fullForm, fullFormMatch,[])) : name.split(".")})
    let item = find(list , l => get(l, where,"") == get(main_data, "id"));
    
    return get(item,pick,0)
}

export const getBalance =(props) => {
    const {field={}, func_params={}, main_data, fullForm} = props;
    const {reduxMatch,fullFormMatch, path} =  func_params;
    let store = 0
    if(reduxMatch){
        store = applyFilters({
            path: reduxMatch
        })
    } else {
        store = fullFormMatch ? get(fullForm, fullFormMatch) : get(field, "name", "").split(".")[0]
    }
    
    return findBalance(main_data, path, store)
    
}

export const findBalance = (main_data,path, store) => {
    let item_variant = get(main_data, "id")
    const balance = applyFilters({
        key:'Find',
        path,
        params:{
            item_variant, store
        }
    })

    return get(balance, `quantity`, 0) || ""
}

export function getReqValue(props) {
    const {field, main_data, func_params={}} = props
    const {path, field_key, item_key, pick} = func_params

    let params = {};
    params[field_key] = get(field, "name", "").split(".")[0]
    params[item_key] = get (main_data, "id")
    
    const pr = applyFilters({
        key:'Find',
        path,
        params
    })
    return get(pr, `${pick}`,0) || ""
    
}

export function getUom(props){
    const {main_data={}, func_params={}} = props;
    const {path, field_key, pick}= func_params;
    let key = get(main_data, field_key);

    const uom = applyFilters({
        path:`${path}.data.${key}`
    })

    return get(uom, `${pick}`,"none") || "none"
}
export function gePercentSum(props){
    const {func_params={}} = props;
    const {path, field_key, desired_sum}= func_params;

    // const desired_sum_ = isNumber(desired_sum) ? desired_sum : 100
    const data = applyFilters({path})
    const sum = reduce(data, (o,v) => {
        return o + get(v, field_key,0)
    }, 0)

    return sum
}

export function getLast(props) {
    const {main_data, func_params={}} = props
    const {path,item_key, pick} = func_params

    let params = {};
    params[item_key] = get (main_data, "id")
    
    const item = applyFilters({
        key: 'Filter',
        path,
        params,
        then : {
            key:'GetLast',
        }
    })
    return get(item, `${pick}`,0) || 0
    
}