import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import classes from './style.less'
import Header from './header';
import Body from './body';
import {withTranslation} from 'react-i18next'
class Station extends Component {

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
        const { stations, t } = this.props
        const { page } = this.state
        const maxLen = Object.keys(stations).length
        return <Header maxLen={maxLen} page={page} handelClick={this.handelClick} t={t}/>
    }

    renderBody = () => {
        const { stations } = this.props
        return <Body stations={stations} />
    }

    render() {
        const {t} = this.props
        return (
            <div className={classes.station_container}>
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stations: get(state.licensing__station, 'data', {}),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Station)));