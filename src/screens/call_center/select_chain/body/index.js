import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map } from 'lodash';
import station1 from 'assets/images/Stations-Modes/station 1@2x.png'
import station2 from 'assets/images/Stations-Modes/station 2@2x.png'
import station3 from 'assets/images/Stations-Modes/station 3@2x.png'
import classes from './style.less'
import { withTranslation } from 'react-i18next';

class Body extends Component {

    renderChains = () => {
        const { chains , t} = this.props
        const station_1 = <img src={station1} />
        const station_2 = <img src={station2} />
        const station_3 = <img src={station3} />

        return map(chains, (d) => (
            <button type="button"
                onClick={this.renderChainDetails.bind(this, d)}>
                {d.alter_name == "1" ? station_1 : d.alter_name == "2" ? station_2 : station_3}
                <p>{t(d.name)}</p>
            </button>
        ))
    }

    renderChainDetails = (element) => {
        const { history, setMain } = this.props
        setMain('licensing__chain', { active: element.id })
        history.push(`/call_center/${element.name}`)
    }

    render() {
        const {t} = this.props
        return (
            <div className={classes.body}>

                <div className={classes.msg}>
                    <p>{t("Choose a Chain")}</p>
                </div>

                <div className={classes.chains}>
                    {this.renderChains()}
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    chains: get(state.licensing__chain, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(Body)))