import React, { Component } from 'react'
import classes from './style.less'
import { map, filter, pick, get } from 'lodash'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslation } from 'react-i18next'
import receipt from 'assets/images/Admin/receipt@2x.png'
import {connect} from 'react-redux'
import Header from 'components/header_back'
import applyFilter from 'helpers/permissions'

class Floorplan extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            closed: {
                img: receipt,
                authorize: ['admin_orders', 'admin_refund'],
                title: 'Closed',
                url: 'admin_orders',
            },
            ToConfirm: {
                icon: 'check',
                title: 'To Confirm',
                url: 'confirm',
                permissions: {
                    mode: {
                      listInclude: {key: 'key', list: "modes"}
                    }
                },
            },
           

        };
    }



    goTo = (d) => {
        const { history } = this.props;
        history.push(d.url)
    }

    renderOptions = () => {
        const { t, station } = this.props
        let modes = applyFilters({path:'settings__mode.data'})
        modes = pick(modes, station.modes)
        const list = filter((this.buttons), applyFilter({key:'CC'}, "permissions.mode", {modes}))
        return map(list, (d, key) => (
            <button key={key} disabled={!applyFilters({ key: 'authorize', compare: d.authorize })} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
                {d.img ? <img src={d.img} /> :
                    <FontAwesomeIcon icon={d.icon} size="4x" className={classes.icon}
                        style={{ color: "#0b2a5d" }}></FontAwesomeIcon>}
                <p>{t(d.title)}</p>
            </button>
        ))

    }

    render() {
        const { t } = this.props
        return (
            <div className={classes.container}>
               <div className={classes.inner}>
               <div className={classes.title}>
               <Header name={t("Orders")} />
                {/* <Back/>
                <p>Orders</p> */}
                </div>
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
               </div>
            </div>
        )
    }
}
const mapStateToProps =(state)=>({
    station: get(state.licensing__station.data, state.licensing__station.active),
})
export default withTranslation() (connect(mapStateToProps) ( withRouter(Floorplan) ))
