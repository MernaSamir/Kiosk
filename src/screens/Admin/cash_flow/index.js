import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import group from 'assets/images/Admin/Group 957@2x.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslation } from 'react-i18next'
import Back from 'components/Back_Button'
import cashier from 'assets/images/Admin/cashier@2x.png'
import safedrop from 'assets/images/Admin/Group 2643@2x.png'

class Floorplan extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            CashierSettlement: {
                img: cashier,
                authorize: ['admin_cash_settlement'],
                title: 'Cashier Settlement',
                url: 'cashier_settlement',
            },
            SafeDrop: {
                img: safedrop,
                title: 'Safe Drop',
                url: 'safe_drop',
            },
        };
    }



    goTo = (d) => {
        const { history } = this.props;
        history.push(d.url)
    }

    renderOptions = () => {
        const { t } = this.props

        return map(this.buttons, (d, key) => (
            <button key={key} disabled={!applyFilters({ key: 'authorize', compare: d.authorize })} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
                {d.img ? <img src={d.img} /> :
                    <FontAwesomeIcon icon={d.icon} size="4x" className={classes.icon}
                        style={{ color: "#0b2a5d" }}></FontAwesomeIcon>}
                <p>{t(d.title)}</p>
            </button>
        ))

    }

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.inner}>
                <div className={classes.title}>
                <Back/>
                <p>Cashier Flow</p>
                </div>
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
                </div>
            </div>
        )
    }
}

export default withTranslation() (withRouter(Floorplan))
