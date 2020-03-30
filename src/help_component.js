import React, { Component } from 'react'
import Printing from './printing/';
import SubscribeApps from './subscribers/'
import Translate from './translate'
import DataSync from 'components/data_sync'
import {connect} from 'react-redux'
import {get} from 'lodash';
import Drawers from 'components/drawer'
import ReqestsComp from 'helpers/components/requests' 
// import GunSync from 'helpers/functions/gun_sync'

class HelpComponent extends Component {
    render() {
        const {station} = this.props;
        if(station){
            return (
                <>
                    <DataSync />
                    {station.printing && <Printing {...this.props} />}
                    <SubscribeApps />
                    <Drawers />
                    <Translate />
                    <ReqestsComp/>
                </>
            )
        }
        return <></>
    }
}

export default connect((state)=>({
    station: get(state.licensing__station.data, state.licensing__station.active)
}))(HelpComponent)
