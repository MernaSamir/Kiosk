import {get_syncs, get_files} from './sync';
import store from 'store';
import {isEmpty} from 'lodash';

const syncing = async (props, state=store.getState()) => {
    if(isEmpty(state.syncing.data || {})){
        const {data: syncs} = await get_syncs(props);
        const old_data = JSON.parse(localStorage.getItem('syncs')||'{}')
        const syncs_data = await get_files(props, syncs.sync__sync);
        const json_data = syncs_data.reduce((o, v)=>({...o, [v.key]: v}), {})
        const new_data = {...old_data, ...json_data};
        localStorage.setItem('syncs', JSON.stringify(new_data))
        store.dispatch({type: 'set_main_syncing', data: {data: new_data}})
        return new_data
    }
}

// import {multiRequest} from 'helpers'
export const sync_hq = (io, props)=>{
    io.on('syncHq', async (data)=>{
        // console.log(data)
        // debugger
        await syncing(props);
    })
}


export const connect = (io, props)=>{
    console.log("start connect")
    io.on('connect', async (data)=>{
        // debugger
        console.log('connecting')
        await syncing(props);
    })
}