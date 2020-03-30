import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'
import { withRouter } from 'react-router';
import {connect} from 'react-redux';
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'

class DayAndShift extends Component {
    constructor(props) {
        super(props)
        this.SetDayShift(props.shift);
    }
    SetDayShift = (shift=this.props.shift) => {
        const { history, user } = this.props
        if (!shift) {
            return history.push(user.is_admin ? '/admin/day_shift':'/lock')
        }
        return null
    }
    render() {
        const { business_day, shift,chain, location } = this.props
        return (
            <div className={classes.info}>
            <p>  {[chain.name,location.name].filter(d=>!isEmpty(d)).join(' / ')}</p>
                <p>-</p>
                <p >{business_day.business_day} / {shift.shift_num} </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: get(state.main, 'main.current', {}),
    shift: get(state.orders__shifts.data, state.orders__shifts.active, {}),
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    chain: get(state.licensing__chain.data, state.licensing__chain.active, ''),
    location: get(state.licensing__location.data, state.licensing__location.active, '')
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DayAndShift))
