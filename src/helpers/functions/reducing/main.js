import {reduce, get, round} from 'lodash';
import applyFilter from 'helpers/functions/filters';


export const Reduce = (f, index, list, values, props)=>{
    return reduce(list, (o, v)=>{
        const val = get(values, props.getFieldName(v, f, index), '')
        if (o != undefined) {
            return o == val ? o : ''
        }
        return val
    }, undefined)
}

export const Sum = (f, index, list, values, props)=>{
    const total = reduce(list, (o, v)=>{
        const val = get(values, props.getFieldName(v, f, index), 0)
        return o+val
    }, 0)
    return total || ''
}

export const Val = (f, index, list, values, props)=>{
    const total = get(values, props.getFieldName(props.data, f, index), get(values, props.getFieldName({}, f, index), 0))
    return total || ''
}

export const VarSum = (f, index, list, values, props)=>{

    const total = reduce(list, (o, v) => {
        const val = get(values, props.getFieldName(v, f, index), 0)
        const item = applyFilter({
            path: `stock__items.data.${v.item}`
        })
        const recipe_unit = get(item, 'recipe_unit_default', 0)
        const recipe_unit_ratio = get(v, 'recipe_unit_ratio',0)
        const uom = applyFilter({
            path:`dropdowns__units_of_measure.data.${recipe_unit}`,
        })

        if(get(uom,'is_base', false) || !get(uom,'is_universal', true)) {
            return o + (val * recipe_unit_ratio)
            
        } else {
            const ratios = applyFilter({
                key: 'Filter',
                path:`dropdowns__ratio`,
                params:{
                    'uom': recipe_unit
                }
            })
            return o + (val * (recipe_unit_ratio / get(ratios, '0.ratio', 1)))            
        }
        
    }, 0)
    return total ? round(total, 2):""
}