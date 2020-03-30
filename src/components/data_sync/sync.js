import React from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux'
import Connections from './fun'
import SyncData from './sync_data';
// import SyncDay from './sync_day';
import {SocketConfig} from 'config'
import {syncTransactions, syncNotifications} from './fun/sync_redux'
import mapDispatchToProps from 'helpers/actions/main'

class Sync extends React.Component {
    connectToSync(props){
        const {station, hq_location, setMain,UpdateBulkApp } = props;
        setMain("hq_location",hq_location)

        // console.log("hereeeee", station.sync, hq_location.sync)
        if(station.sync && hq_location.sync){
            this.socket = io.connect(`${hq_location.sync}/sync_hq`, {path: '/socket', ...SocketConfig})
            Connections(this.socket, props)
            syncTransactions(UpdateBulkApp);
            syncNotifications();
        }

    }


    constructor(props) {
        super(props);
        this.connectToSync(props);
    }

    render() {
        if(!this.socket){
            return <></>
        }
        return (
            <>
                <SyncData socket={this.socket} {...this.props}></SyncData>
                {/* <SyncDay socket={this.socket} {...this.props}></SyncDay> */}
            </>
        );
    }
}

export default connect(null,mapDispatchToProps)(Sync)
