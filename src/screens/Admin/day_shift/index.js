import React, { Component } from 'react'
import classes from './style.less'
import ActionButton from './business_day/action';
import { connect } from 'react-redux'
import moment from 'moment'
import { get } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main'
import Header from './header';
import BusinessDay from './business_day';
import Shift from './shifts';
import ShiftActionButton from './shifts/action';
import {withTranslation} from 'react-i18next'

class DayShift extends Component {
    constructor(props) {
        super(props);
        this.orders = applyFilters({
            path: 'orders__main',
            key: 'Filter',
            params: {
                end_time: null
            }
        })
    }

    renderTime = (date) => {
        return moment(date).format('HH:mm:ss')
    }
    renderBtns = (b_d) => {
        const { activeShifts, business_days ,t} = this.props
        return <div className={classes.btns_div}>
            <ActionButton app="orders__business_days" disabled={activeShifts.id || this.orders.length} text="Day" item={b_d} t={t}/>
            <ShiftActionButton app="orders__shifts" disabled={!get(business_days, 'id')} text="Shift" item={activeShifts} extra={{ date: b_d.id }} t={t}/>
        </div>
    }

    render() {
        const { business_days: b_d, prevBD = {}, prevShift = {}, activeShifts , t } = this.props
        return (
            <div className={classes.business_container}>
                <div className={classes.card}>
                    <Header orders={this.orders} t={t} />
                    <div className={classes.day_shift_div}>
                        {!b_d.id ?
                            <BusinessDay prevBD={prevBD} 
                            activeShifts={activeShifts} 
                            orders={this.orders} renderBtns={this.renderBtns} b_d={b_d}
                                renderTime={this.renderTime} t={t} />
                            : b_d.id &&
                            <Shift activeShifts={activeShifts} prevShift={prevShift} b_d={b_d}
                                renderBtns={this.renderBtns} renderTime={this.renderTime} t={t} />
                        }
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    business_days: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    activeShifts: get(state.orders__shifts.data, state.orders__shifts.active, {}),
    user: get(state, 'main.current.id', ''),
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DayShift))
export default wrapper
