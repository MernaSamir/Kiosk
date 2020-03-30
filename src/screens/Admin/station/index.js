import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import loadApps from 'routes/apps';
import { multiRequest } from 'helpers'
import initFun from 'helpers/functions/init'
import { get, map, find } from 'lodash';
import classes from './style.less'

class Station extends Component {

  renderStations = () => {
    const { stations } = this.props
    return map(stations, s => (
      <div className={classes.station_btn} onClick={this.activeStation.bind(this, s)}>
        <p>{s.name}</p>
      </div>
    ))
  }
  initActives = (...props) => {
    return initFun(...props)
  }
  activeStation = (elment) => {
    const { stations } = this.props
    return multiRequest(loadApps(elment), this.initActives.bind(this, elment, stations))

  }

  render() {
    return (
      <div className={classes.container}>
        {this.renderStations()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  location: get(state.licensing__location, 'active', ''),
  get stations() { return find(get(state.licensing__station, 'data', {}), { location: this.location }) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Station)