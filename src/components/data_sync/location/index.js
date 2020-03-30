import React from 'react';
import {connect} from 'react-redux'
import Connections from './fun'
import SyncData from './sync_data';
// import Gun from 'gun'
import {SocketConfig} from 'config'
import io from 'socket.io-client';
class Sync extends React.Component {
    connectToSync(props){
        const {main_location} = props;
        if(main_location.sync) {
            // main_location.sync = 'http://localhost:3000/gun';
            this.socket = io.connect(`${main_location.sync}/location`, {path: '/socket', ...SocketConfig});
            Connections(this.socket, props)
            // this.gun = Gun(main_location.sync).get('location/sync/inner');
            // Connections(this.gun, props)
        }
    }

    constructor(props) {
        super(props);
        this.connectToSync(props);
    }

    render() {
        return (
            <>
                <SyncData socket={this.socket} gun={this.gun} {...this.props}></SyncData>
            </>
        );
    }
}

export default connect()(Sync)
