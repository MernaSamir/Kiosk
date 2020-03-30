import {filter, get, find, groupBy, toArray, mapValues, some} from 'lodash'
import { array_to_obj } from '../array_to_object';
import Gun from 'gun'
require('gun/lib/path.js');
import {activeModes} from 'config'
export const settings__mode = (station, modes)=>{
    const active_modes = filter(modes, d=>(station.modes.includes(d.id)))
    const active = get(active_modes, "[0].id")
    if(activeModes.includes(get(station, '_type', 'pos'))){
        return [{type: 'set_main_settings__mode', data: {active}}]
    }
    return []
}

export const orders__business_days = (s, data, all_d)=>{
    const active = find(data, {end_time: null}) || {}
    const shift = find(all_d.orders__shifts, {end_time: null, date: active.id}) || {}
    return [
        {type: 'set_main_orders__business_days', data: {active: active.id}},
        {type: 'set_main_orders__shifts', data: {active: shift.id}},
    ]
}

export const licensing__store = (s, data, all_d)=>{
    const active = find(data, {main_loc: s.location, main: true}) || {}
    return [
        {type: 'set_main_licensing__store', data: {active: s.store || active.id}},
        {type: 'set_main_licensing__location', data: {active: s.location}},
    ]
}
export const licensing__location = (s, data, all_d)=>{
    const loc = find(data, {id: s.location}) || {}
    const hq = find(data, {hq: true}) || {}
    let hqGun = null
    let locGun = null
    if(hq.sync){
        hqGun = Gun(hq.sync+'/gun')
    }
    if(loc.sync){
        locGun = Gun(loc.sync+'/gun')
    }
    return [
        {type: 'set_main_licensing__location', data: {active: loc.id, hq: hq.id}},
        {type: 'set_main_licensing__chain', data: {active: loc.chain, loc: locGun}},
        {type: 'set_main_guns', data: {hq: hqGun, loc: locGun}}
    ]
}
export const dropdowns__currencies = (s, data, all_d)=>{
    const active = find(data, {is_base_currency: true, active: true}) || {}
    return [{
        type: 'set_main_dropdowns__currencies', data: {active: active.id},
    }]
}


const reset_pirces = (data, s)=>{
    const l_prices = array_to_obj(data.items__price_by_location, 'item')
    const s_prices = array_to_obj(data.items__price_by_station, 'item')
    data.items__prices = mapValues(data.items__prices, (d)=>{
        const p = get(l_prices, d.id, {active: false, price: d.price});

        // console.log(p.active, d.active, get(data.items__sales_items, `${d.sales_item}.name`), p)
        return {...d, price: p.price, active: d.active && p.active && get(s_prices, `${d.id}.active` , true)}
    })
}
const activateItems = (data)=>{
    const items = groupBy(toArray(data.items__prices), 'sales_item');
    data.items__sales_items = mapValues(data.items__sales_items, (d)=>{
        const item_sizes = get(items, d.id)
        return {...d, active: some(item_sizes, "active")}
    })
    const cats = groupBy(toArray(data.items__sales_items), 'base_sales_cat');
    data.items__base_sales_cat = mapValues(data.items__base_sales_cat, (d)=>{
        const cat_items = get(cats, d.id)
        return {...d, active: d.active && some(cat_items, "active")}
    })
    const menus = groupBy(toArray(data.items__base_sales_cat), 'custom_menu');
    data.items__custom_menu = mapValues(data.items__custom_menu, (d)=>{
        const menu_cats = get(menus, d.id)
        return {...d, active: d.active && some(menu_cats, "active")}
    })
}
export const parties__customer_orders = (s, data, all_d, res_d)=>{
    return [{
        type: 'set_main',
        data: array_to_obj(data, 'customer')
    }]
}
export const items__sales_items = (s, data, all_d,  res_d)=>{
    if(all_d.items__price_by_location.length){
        reset_pirces(res_d, s);
    }
    activateItems(res_d)
    return []
}

export const dropdowns__lang = (s, data, all_d, res_d)=>{
    let active = s.lang
    if(!active){
        const default_lang = find(data, {default: true}) || {}
        active = default_lang.id
    }
    return [
        {type: 'set_main_dropdowns__lang', data: {active: active}}
    ]
}