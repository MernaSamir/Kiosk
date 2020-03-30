import React from 'react';
import {connect} from 'react-redux'
import {get} from 'lodash';
import Sync from './sync'
import applyFilters from 'helpers/functions/filters'
import SyncLocation from './location';

class DataSync extends React.Component {

  render() {
    const {station, main_location={}} = this.props
    const hq_location = applyFilters({
      key: 'Find',
      path: 'licensing__location',
      params: {
        hq: true
      }
    })
    if(station){
        return (
          <>
            {hq_location && <Sync hq_location={hq_location} {...this.props}></Sync>}
            {main_location.sync && <SyncLocation {...this.props}></SyncLocation>}
          </>
        );
    }
    return <></>
  }
}

export default connect((state)=>({
    station: get(state.licensing__station.data, state.licensing__station.active),
    get main_location(){return get(state.licensing__location.data, this.station.location)}
}))(DataSync)