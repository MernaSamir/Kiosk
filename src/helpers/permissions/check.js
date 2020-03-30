import {get, find, filter,pick , sumBy, range, every, flatten, includes, map, some} from 'lodash'

import { caluclateRefundQty } from 'helpers/index'
export const check =(item,key)=>{
    return Boolean(get(item,key, false))
}
export const check_list = (item,key,list)=>{
    const myList = filter(get(list, key.list, {}), key.params)
    const filtered =filter(myList, d=>( d.seats.includes(get(item,key.key,'') ) ||  (get(d, key.key, 'a') == get(item,key.key,'b'))  ))
    
    return filtered.length && every(filtered,key.compare)
}

export const check_Fired = (item,key,list)=>{
    const myList = get(list, key.list, {})
    const filtered =filter(myList, d=>( d.seats.includes(get(item,key.key,'') ) ||  (get(d, key.key, 'a') == get(item,key.key,'b'))  ))
    return every(filtered,key.compare)
   
}
export const listInclude=(item, key,list)=>{
    const myList = get(list, key.list, {})
    some(myList, d=> get(d, key.key, '') == get(item, key, '') )
    return some(myList, d=> get(d, key.key, '') == get(item, key.key, '') )

}
export const check_fired =(item={},key,list)=>{
    const newList = get(list, key.list, {})
    return filter(newList,d=>d.fired_time).length  && list.calc.balance_due==0
}

export const check_not_voided=(item,key,list)=>{
    const newList = filter(get(list,key.list,{}), d=>(d.seat_num == item.seat_num||d.seats.includes(item.seat_num)))
    const voidedList =flatten(newList.map(d=>filter(get(list,key.list,{}),v=>v.void == d.id ) ))
    const qty = sumBy(newList.filter(d=>!d.void),'quantity') - sumBy(voidedList,'quantity')
    return qty > 0
}
export const check_not_fired =(item,key,list)=>{
    const newList = get(list, key.list, {})
    return !filter(newList,d=>d.fired_time).length
}

export const check_not =(item,key)=>{
    return !get(item,key, false)
}
export const check_not_props=(item, keys) =>{
    return!find(pick(item,keys), Boolean)
}
export const check_not_string =(item, key)=>{
    return eval(get(item, key,''))
}
export const check_length =(item,key)=>{
    if(key.op =='eq')
        return get(item, key.key, {}).length == key.value
    else if(key.op =='gt')
   
        return get(item, key.key, {}).length || get(item, key.key, {}) > key.value
    return false
}
export const match =(item,key) =>{
    return item == key
}
export const match_val = (item, param)=>{
    return get(item, param.key) == param.val
}
export const not_match_val = (item, param)=>{
    return get(item, param.key) != param.val
}
export const checkVoid = (item, key, list) =>{
    let qty = item.quantity - sumBy( filter(get(list,key.list,{}), {void : item.id}) ,'quantity' )
    return qty > 0

}
export const check_equal =(item , key) =>{
    return get(item,key.key) == key.value

}
 export const check_print = (item={} ,key, list) =>{
     return range(1,item.guests_num+1).filter(v =>!find(get(list,key.list,{}), r=>r.seats.includes(v))).map(i=>i).length


 }
 export const check_reprint = (item={} ,key, list) =>{
    return ! range(1,item.guests_num+1).filter(v =>!find(get(list,key.list,{}), r=>r.seats.includes(v))).map(i=>i).length

}
export const check_receipt_seat = (item = {} , key, list) =>{
    return Boolean( find(get(list, key.list,{}), r=>r.seats.includes(get(item, key.key,1))) )

}
export const check_not_receipt_seat = (item={} ,key, list) =>{

    return find(get(list, key.list,{}), r=>r.seats.includes(get(item, key.key,1)))
}
export const check_not_shared = (item, key, list) =>{
    return !filter(get(list, key.list, {}), d=>d.seats.includes(item.seat_num)).length
}
export const refundedQty = (item, key, list) =>{
    const receiptItems = get(list,'receiptItems',{})
    const refundedItems = get(list, 'refundedItems',{})
    return caluclateRefundQty (receiptItems, refundedItems).quantity
}

const getVoided = (item, details) =>{
    let qty = item.quantity - sumBy( filter(details, {void : item.id}) ,'quantity' )
    return qty == 0

}
export const void_order =(item, key, list)=>{
    const details =  filter(list.orderDetails,d=> !includes(map(list.receipt_items, i=>(i.details)),d.id ))
    
  
     return details.length && every(filter(details, d=>!d.void),i=>getVoided(i, details) ) && every(list.receipts, d=>d.invoice)


}
