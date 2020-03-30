import {filter, every, range, get, find} from 'lodash'

export const check_half_list = (item, key, list) =>{
    const data = get(list, key.list, {})
    return Boolean( filter(data,d=>get(d,key.key,false)).length )
}
export const check_all_list = (item,key, list) =>{
   
    return every(get(list, key.list, {}),key.key) && get(list, key.list,{}).length
}
export const checkHalfPrinted=(item,key, list)=>{
   
    return range(1,get(item, 'guests_num','')+1).filter(v=>find(get(list,key.list,{}),d=>d.seats.includes(v))).length

}
export const checkAllPrinted=(item,key, list)=>{
    return !range(1,get(item, 'guests_num','')+1).filter(v=>(!find(get(list,key.list,{}),d=>d.seats.includes(v)))).length

}
export const check_not_length =(item,key,list)=>{
    return !get(list,key.list,{}).length
}

export const check_length_list =(item,key,list)=>{
    return get(list,key.list,[]).length
}