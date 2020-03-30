import {filter, every, range, get, find} from 'lodash'

export const check_half_list = (key, list) =>{
    return Boolean( filter(list,d=>get(d,key,false)).length )
}
export const check_all_list = (key, list) =>{
    return every(list,key)
}
export const checkHalfPrinted=(item, list)=>{
    return range(1,item.guests_num+1).filter(v=>find(list,d=>d.seats.includes(v))).length

}
export const checkAllPrinted=(item, list)=>{
    return !range(1,item.guests_num+1).filter(v=>!find(list,d=>d.seats.includes(v))).length

}
export const check =(item,key)=>{
    return Boolean(get(item,key, false))
}