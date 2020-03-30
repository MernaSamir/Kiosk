import React, { Component } from 'react';
import {watchRequest} from 'helpers';


export class watcher extends Component {

    constructor(props) {
        super(props);
        const {watch={}} = this.props;
        if(!watch.reject){
            // this.interval = window.setInterval(this.fetchingData, interval);
        }
    }
    getWatcher = ()=>{
    }
    fetchingData = ()=>{
        const watch = this.getWatcher();
        if(!watch.rejectAll){
            watchRequest(watch);
        }
    }
    componentWillUnmount() {
        if(this.interval){
            window.clearInterval(this.interval);
        }
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}
export default watcher;
