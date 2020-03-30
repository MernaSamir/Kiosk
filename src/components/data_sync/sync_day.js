import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main'
import {map, isEqual, isEmpty} from 'lodash';

class sync_data extends React.Component {
    constructor(props) {
        super(props);
        this.url = '/api/v1/sync/location-sync/'
        props.socket.on('syncLocation', this.getSyncOrder)
        this.checkSync(props)
        // this.state = {};
    }
    getSyncOrder = (location)=>{
        const {main_location={}} = this.props;
        if(main_location.id == location.id){
            // debugger
            this.sync_data(this.props)
        }
    }
    sync_data = (props) => {
        const {main_location, setMain} = props
        return setMain('sync__location_sync', {
            item: {
                action: 'add',
                location: main_location.id,
                onSuccess: (item)=>{
                    this.applySync(props, item)
                    return []
                }
            },
        })
    }
    applySync = (props, item)=>{
        const {hq_location, setMain} = props;
        const syncs = [item, ...applyFilters({
            key: 'Filter',
            path: 'sync__location_sync',
            params: {
                send: null
            }
        })].filter(d=>d)
        return Promise.all(map(syncs, (d=>{
            return axios.get(`${d.file_path}/data.json`)
            .then(({data})=>(
                {
                    key: d.id,
                    sync: {...d, send: new Date()},
                    data
                }
            ))
        }))).then(data=>{
            return axios.post(`${hq_location.url}${this.url}bulk/`, {data}).then(({data})=>{
                setMain('sync__location_sync', {
                    item: {
                        action: 'bulkEdit',
                        data
                    },
                })
            })
        })

    }
    checkSync = (props) =>{
        const {days} = props;
        const open_days = applyFilters({
            key: 'Filter',
            params: {
                end_time: null
            }
        }, days)
        if(!open_days.length && !isEmpty(days)){
            this.sync_data(props)
        }else{
            this.applySync(props)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(!isEqual(nextProps.days, this.props.days)){
            this.checkSync(nextProps)
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
    days: state.orders__business_days.data || {}
}), mapDispatchToProps)(sync_data)
