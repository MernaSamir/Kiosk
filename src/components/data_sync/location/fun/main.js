// import store from 'store';
// // import {multiRequest} from 'helpers'
// let first = true
// export const syncLocation = (gun, props)=>{
//     // setTimeout(()=>{
//         // gun.get('actions').get('61da0f54-890b-4c4f-8e0e-456bec13c8a2').put(null)
//     gun.get('actions').on((data)=>{
//         // const dis = data.map(d=>d)
//         // debugger
//         // console.log(data)
//         if(!first){
//             store.dispatch([...JSON.parse(data.actions)])
//         }else{
//             first = false
//         }
//     }, true)
//     // }, 1000)
// }

import store from 'store';
import {flatten, map} from 'lodash'
// import moment from 'moment'
// import {multiRequest} from 'helpers'
export const syncLocation = (io, props)=>{
    io.on('syncLocalData', (data)=>{
        if(data.date){
            store.dispatch([...data.data, {type: "set_main_syncing", data: {location_status: "online", last_date: data.date}}])
        }
    })
}

export const connect = (io, props)=>{
    io.on('connect', (data)=>{
        const state = store.getState();
        const date = state.syncing.last_date
        // io.emit('getLocalData', {date})
        if(state.syncing.last_date){
            store.dispatch({type: "set_main_syncing", data: {local: {data: {date: date}}, location_status: "offline"}})
        }
        if(state.syncing.location_status == 'offline'){
            // data = state.syncing.data;
            const data = flatten(map(state.syncing.data, d=>d.data))
            store.dispatch({type: 'set_main_syncing', data: {location_status: "online", data: {}}})
            io.emit('syncLocal', data)
        }
    })
}

export const disconnect = (io, props)=>{
    io.on('disconnect', (data)=>{
        const state = store.getState();
        store.dispatch({type: 'set_main_syncing', data: {location_status: "offline", last_date: state.syncing.last_date || new Date()}})

    })
}