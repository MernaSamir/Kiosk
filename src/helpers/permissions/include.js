import { find, get, includes } from 'lodash'
export const not_included_list = (item, key={}, list) => {
    const myList = get(list,key.list, {})
    return !find( myList,d=> includes(d.seats, get(item,key.key, {}) ) && d.invoice )
}
export const not_included_list_no_invoice = (item, key={}, list) => {
    const myList = get(list,key.list, {})
    return !find( myList,d=> includes(d.seats, get(item,key.key, {}) ))
}
export const not_included= (item, key={}, list) => {
    const myList = get(list,key.list, {})
    return !find(myList, d => includes( d.seats, get(item,key.key, {}) ))
}
export const included = (item, key={}, list) => {
    return Boolean(find(get(list, key.list, {}), { [key.key]:  get(item, key.compare) }))
}
export const include = (item, key) => {
    return Boolean(get(item, key, null) != null)
}

export const has_not = (item, key) => {
    return !get(item, key, false)
}

export const not_shared_over_paid_seat=(item, key, list)=>{
    const data = get(list, key.list, {})
    const res = item.seats.filter(d=>
        find(data, v=> (v.seats.includes(d)&&v.invoice) )
    )
    return !res.length
}

