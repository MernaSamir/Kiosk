import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { get, map } from 'lodash';
import station1 from 'assets/images/Stations-Modes/station 1@2x.png'
import station2 from 'assets/images/Stations-Modes/station 2@2x.png'
import station3 from 'assets/images/Stations-Modes/station 3@2x.png'

class Body extends Component {

    renderStations = () => {
        const { stations } = this.props
        const station_1 = <img src={station1} />
        const station_2 = <img src={station2} />
        const station_3 = <img src={station3} />
        return map(stations, (d, index) => (<button type="button" className={classes.station_btn}
            onClick={this.renderModes.bind(this, d)}>
            {index == 1 ? station_1 : index == 2 ? station_2 : station_3}
            <p>{d.name}</p>
        </button>
        ))
    }

    renderModes = (station) => {
        const { history, setAll } = this.props
        setAll([
            { type: 'set_main', app: 'settings__filter', data: { item: { station: station.id } } },
            { type: 'set_main', app: 'settings__filter', data: { update: { station: station.id } } },
        ])
        history.push('/admin/pos_settings/modes')
    }

    render() {
        return (
            <div className={classes.body_container}>
                <div className={classes.stations_div}>
                    {this.renderStations()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stations: get(state.licensing__station, 'data', {}),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Body));