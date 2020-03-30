import { get, map, isString, isEmpty, isEqual, mapValues } from 'lodash'
import store from 'store';
import applyFilters from 'helpers/functions/filters';
import { pushToRedux } from 'helpers/app/sagas/gen/mapping/requests_func'
import { post } from 'axios'
import { API_URL } from 'config'
import uuid from 'uuid/v4';


const getGun = (path, state=store.getState())=>{
    return get(state.guns, path, null)
}
//names of sets to be synced from gun
//db prop for adding to db as well as redux (when its is not there it only adds to redux)
//add prop for adding a prop to the data before adding it to redux
//excludes for  special case apps for add its data some in db & some in redux 
//execludes_props name: app_key in gun ,
//               compare: key links the app_key & compared table
//               compare_with  compared table that the compare depends on
const gun_sync = {
    "tr": { db: true },
    "global": { db: true },
    "st": {},
    "cc": {
        add: { sync_gun: true },
        excludes: [
            "orders__main",
            "orders__details",
            "orders__receipt",
            "orders__receipt_items",
            "orders__payment",
        ],
        execludes_props: {
            name: "orders__main",
            compare: 'shift',
            compare_with: "orders__shifts",
            check: "end_time",
            next: {
                name: "orders__details",
                compare: "order",
                compare_with: "orders__main",
                check: "end_order",
                next: {
                    name: "orders__discount",
                    compare: "order",
                    compare_with: "orders__main",
                    check: "end_order",
                    next: {
                        name: "orders__receipt",
                        compare: "order",
                        compare_with: "orders__main",
                        check: "end_order",
                        next: {
                            name: "orders__receipt_items",
                            compare: "receipt",
                            compare_with: "orders__receipt",
                            check: "end_order",
                            next: {
                                name: "orders__payment",
                                compare: "order",
                                compare_with: "orders__main",
                                // check: "end_order",
                            }
                        }
                    }
                }
            }
           
        }
    }
}

//params: tables_data => contains all data of each table ,
//        ids_array => object that contains tables names with wanted ids(to be added to db)
//        app => contains object that defines current table name, compare_key and compare table
const gunGets = (tables_data, ids_array = {}, app, add) => {
    const gunDB = getGun('hq')
    let new_tables_data = tables_data
    let rec_data = {};
    let app_name = app.name
    let app_gun = gunDB.get(app_name)
    // syncying table from gun (app_name)
    app_name && app_gun.on(data => {
        //initializing table object in final tables_data
        new_tables_data[app_name] = { db: [], redux: [], remove_redux: [] }
        //wanted ids of that table to be added to db
        let ids = map(data, (single_data, nodes, r) => {
            if (isString(single_data)) {
                let row = JSON.parse(single_data)
                
                let id = get(row, "id")
                // if (app.check && get(row, app.check)) {
                //     id && app_gun.put({ [id]: null })
                // }
                //checking this apps's compare with the wanted ids from ids_array 
                //based on this app's compare with
                if (get(ids_array, app.compare_with, []).includes(get(row, app.compare, ''))) {
                    if (app.check && get(row, app.check)) {
                        id && app_gun.put({ [id]: null })
                        new_tables_data[app_name].remove_redux.push(id)
                        return id
                    } else {
                        new_tables_data[app_name].db.push({ ...row })
                        return id
                    }


                } else {
                    new_tables_data[app_name].redux.push({ ...row, ...add })
                }
            }
        }).filter(l => l)
        let { next } = app
        //if app contains next then we call the function again with the next app
        if (next) {
            //adding this app's ids too the object of wanted ids
            let new_ids = { ...ids_array, [app_name]: ids }
            rec_data = { ...rec_data, ...gunGets(new_tables_data, new_ids, app.next) }
        }
    })
    return { ...new_tables_data, ...rec_data };

}
const checkShifts = (app, UpdateBulkApp) => {
    let store_arr = []
    // this applyFilters for get shifts of current location through business days 
    const shifts = applyFilters({
        key: "ListInside",
        path: 'orders__shifts',
        selectors: {
            "orders__business_days": "date"
        },
        select: "location",
        compare: "licensing__location.active"
    })

    const shifts_ids = map(shifts, v => v.id)
    let main_table = get(app, 'execludes_props.name')

    if (main_table) {
        // obj contains app name : wanted ids 
        let all_ids = {
            orders__shifts: shifts_ids
        }

        // return obj contains { app_name: db => represents data to be added to db , 
        //                                 redux=> represents data to be added to redux only}
        let tables_data = gunGets({}, all_ids, get(app, 'execludes_props'), get(app, 'add'))
        // console.log(tables_data)
        const add_to_db = mapValues(tables_data, (v, app_name) => {
            const { db = [], redux, remove_redux } = v
            !isEmpty(redux) && store_arr.push({ type: `set_data_${app_name}`, data: redux })
            !isEmpty(remove_redux) && store_arr.push({ type: `remove_data_${app_name}`, data: remove_redux })
            return db
        })

        reduxAndDBInsert(store_arr, add_to_db)
    }

}


export const syncTransactions = (UpdateBulkApp) => {
    const gunDB = getGun('hq')
    if(gunDB){
        map(gun_sync, (val, gun_set) => {
            let store_dispatch = []
            let db_data = {}
            gunDB.get(gun_set).on(app => {
                map(app, function (value, app_key, result) {
                    if (value) {
                        if (get(val, 'excludes', []).includes(app_key)) {
                            if (isEqual(app_key, get(val, 'excludes.0'))) {
                                checkShifts(val, UpdateBulkApp)
                            }
                        }
                        else {
                            gunDB.get(app_key).once((app_data) => {
                                let data = map(app_data, function (v, nodes, r) {
                                    if (isString(v)) {
                                        return { ...JSON.parse(v), ...get(val, 'add', {}) }
                                    }
                                }).filter(l => l)
                                store_dispatch.push({ type: `set_data_${app_key}`, data })
                                if (get(val, 'db') && !isEmpty(data)) {
                                    db_data[app_key] = data
                                }
                            })
                            reduxAndDBInsert(store_dispatch, db_data)
                        }
                    }
                });
    
            })
        })
    }
}

export const syncNotifications = () => {
    const gunDB = getGun('hq')
    const current_location = applyFilters({path:"licensing__location.active"})
    const current_user = applyFilters({path:"main.current.id"})
    const allNotifications = applyFilters({path: "settings__notifications.data"})
    if(gunDB){
        gunDB.get('notifications').on((key) => {
            map(key, (value, app_key) => {
                const app_data_key = get(value, '#')
                if (app_data_key && app_key) {
                    let all_data = []
                    gunDB.get(app_data_key).on((single_table_data) => {
                        const data = map(single_table_data, (data_value, data_id) => {
                            if (isString(data_value)) {
                                let single_data = JSON.parse(data_value)
                                const new_notifi_data = get(allNotifications, get(single_data,'notifi_data.id'),{})
                                single_data = {...single_data, notifi_data:{...single_data.notifi_data,...new_notifi_data}}
                                const {notifi_data:{locations=[],users=[],field}, ...app_data} = single_data
                                let location_condition = locations.includes(current_location) || (field && get(app_data, field,[]).includes( current_location))
                                if(location_condition){
                                    return single_data
                                }
                                if(!location_condition && (users.includes(current_user) || (field && get(app_data, field,[]).includes(current_user)))) {
                                    return single_data
                                }
                            }
                        }).filter((l)=>l)
                        all_data= [...all_data, ...data]
                    })
                    reduxAndDBInsert([{ type: `set_data_redux_notifications`, data: all_data }])
                }
            })
        })
    }
}

export const reduxAndDBInsert = (redux_data, db_data) => {
    let req_id = uuid()
    db_data && store.dispatch([{type: 'set_data_req_line', data: {
        [req_id]: pushToRedux({req_id, update_models:{}}, post, `${API_URL}update_models/`, {data: db_data}) 
    } }])
    redux_data && store.dispatch(redux_data)
}