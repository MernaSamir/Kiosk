import React, { Component } from 'react'
import { connect } from 'react-redux';
import { get } from 'lodash';
import classes from './style.less'
import Header from './header';
import Body from './body';
import {withTranslation} from 'react-i18next'

class Mode extends Component {

    state = {
        page: 1
    }

    handelClick = (value) => {
        const { stations } = this.props
        const { page } = this.state
        const maxLen = Object.keys(stations).length
        if (!(page <= 1 && value == -1) && !(page >= maxLen && value == 1)) {
            this.setState({
                page: page + value
            })
        }
    }

    renderHeader = () => {
        const { station, stations, t } = this.props
        const rec = get(stations, station, {})
        const { page } = this.state
        const maxLen = Object.keys(stations).length
        return <Header maxLen={maxLen} page={page} handelClick={this.handelClick} title={rec.mac_address} t={t}/>
    }

    renderBody = () => {
        const { station, stations } = this.props
        const rec = get(stations, station, {})
        return <Body stations={stations} modes={rec.modes} />
    }

    render() {
        const {t} = this.props
               return (
            <div className={classes.mode_container}>
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    station: get(state.settings__filter, 'item.station', {}),
    stations: get(state.licensing__station, 'data', {}),
})

export default connect(mapStateToProps)(withTranslation()(Mode))