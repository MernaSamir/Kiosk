import React from 'react';
import {connect} from 'react-redux';
import applyFilters from 'helpers/functions/filters';
import {isEmpty, map, isEqual, pick, omit, keys, get, isArray, concat, mergeWith, merge, sortBy} from 'lodash';
import {multiRequest} from 'helpers';
import uuid from 'uuid/v4';
import loadApps from 'routes/apps';
import initFun from 'helpers/functions/init'
import mapDispatchToProps from 'helpers/actions/main';
import { get_files } from './fun/sync';
import { pushToRedux } from 'helpers/app/sagas/gen/mapping/requests_func'
import { post } from 'axios'
import { API_URL } from 'config'


class sync_data extends React.Component {
    constructor(props){
        super(props);
        if(props.station.sync){
            this.checkSync(props)
        }
    }
    mergingFun = (o, src)=>{
        if(isArray(src)){
            return concat(o, src)
        }
        return o
    }
    sync_data = async(data = JSON.parse(localStorage.getItem('syncs') || '{}')) => {
        const {setData, location} = this.props
        const mainData = {
            ...mergeWith(...map(sortBy(data, 'sync.created_at'), d=>(get(d, 'data'))), this.mergingFun)
        }
        // console.log(mainData);
        let req_id = uuid()
        return setData('req_line', {
            [req_id]: pushToRedux({
                req_id, update_models:true,
                action: {
                    onSuccess(){
                        localStorage.removeItem('syncs')
                        return [{
                            type: 'set_main_sync__synced_location',
                            data: {
                                item: {
                                    action: 'bulkEdit',
                                    data: map(data, (d, key)=>({
                                        sync: key,
                                        location,
                                        applied: new Date()
                                    }))
                                }
                            }
                        }]
                    }
                }
            }, post, `${API_URL}update_models/`, {data: mainData, reset: true}),
            
        } )
    }
    syncing_data = async(syncs)=> {
        const data = JSON.parse(localStorage.getItem('syncs') || '{}');
        const new_sync = omit(syncs, keys(data))
        const files_data = await get_files(this.props, new_sync)
        const new_data = merge(data, applyFilters({
            key: 'keys',
            levels: ['key']
        }, files_data))
        localStorage.setItem('syncs', JSON.stringify(new_data))
        this.sync_data(new_data)
    }
    checkSync = (props) =>{
        const {syncing, location} = props;
        const data = applyFilters({
            key: 'ListFind',
            fun: {
                key: 'not',
                fun: {
                    key: 'FindOne',
                    path: 'sync__synced_location',
                    select: {
                        sync: "id",
                        location
                    },
                }
            },
            then: {
                key: 'keys',
                levels: ['id']
            }
        }, syncing)
        if(!isEmpty(data)){
            this.syncing_data(data)
        }
    }
    initActives = (...props)=>{
        return initFun(...props)
    }
    getData = async(props) => {
        const stations = applyFilters({
            key: 'ToArray',
            path: "licensing__station",
            params: {}
        })
        const {station} = this.props
        await multiRequest(loadApps(station), this.initActives.bind(this, station, stations))

    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.station.sync){
            if(!isEqual(keys(nextProps.syncing).length, keys(this.props.syncing).length)){
                this.checkSync(nextProps)
            }
        }
        let loc = ['sync_locations'];
        if(!isEqual(pick(nextProps, loc), pick(this.props, loc))){
            this.getData(nextProps)
        }
        return !isEqual(nextProps, this.props);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default connect((state)=>({
    syncing: state.sync__sync.data,
    sync_locations: state.sync__synced_location.data,
    location: state.licensing__location.active,
    station: get(state.licensing__station.data, state.licensing__station.active, ''),
    hq_location: get(state.licensing__location.data, state.licensing__location.hq, '')
}), mapDispatchToProps)(sync_data)
