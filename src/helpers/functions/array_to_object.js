import { reduce, get, isNumber, keys, pick } from 'lodash'
export const array_to_obj = (data, id = 'id') => (reduce(data, (o, k) => ({ ...o, [get(k, id, '')]: k }), 0))
export const select_n_objects = (data, n, first = 0, offset = 0) => {
    const oKeys = keys(data);
    return pick(data, oKeys.slice((isNumber(first) ? first : oKeys.indexOf(first)) - offset, n))
}

export const select_by_index = (data, index = 0) => {
    const oKeys = keys(data);
    return get(data, get(oKeys, index))
}

export const get_object_index = (data, key) => {
    const oKeys = keys(data);
    return oKeys.indexOf(key)
}

export const getLengthOfObject = (data) => {
    let length = Math.ceil(keys(data).length)
    return length
} 