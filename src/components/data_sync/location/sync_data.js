import React from 'react';
import {connect} from 'react-redux';
import {isEmpty, isEqual, pick} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
// import uuid from 'uuid/v4'
// import {get} from 'lodash'
class sync_data extends React.Component {
    sync_data = async(props) => {
        const {sync, setMain, station, status} = props
        if(status != "offline"){
            const data = sync.data.filter(d=>((!d.type.includes('set_main')) || (!station.printing && d.type.includes("Printing"))));
            // const actions = JSON.stringify(data)
            props.socket.emit('syncLocal', data);
            // props.gun.get('actions').put({actions});
            setMain('syncing', {local: {}})
        }else{
            props.socket.emit('getLocalData', sync.data);
            setMain('syncing', {local: {}, location_status: "online"})
        }
        return null;
    }
    checkSync = (props) =>{
        const {sync={}} = props;
        if(!isEmpty(sync)){
            this.sync_data(props)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['sync']
        if(!isEqual(pick(nextProps, compare), pick(this.props, compare))){
            this.checkSync(nextProps)
        }
        return !isEqual(nextProps, this.props);
    }

    render() {
        return (
            <></>
        );
    }
}

export default connect((state)=>({
    orders: state.orders__main.data,
    sync: state.syncing.local,
    status: state.syncing.location_status
    // station: get(state.licensing__station.data, state.licensing__station.active, {})
}), mapDispatchToProps)(sync_data)
