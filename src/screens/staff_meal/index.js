import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters';
import classes from './style.less'
import { map, get } from 'lodash'
import { message } from 'antd';
import moment from 'moment'
import Header from 'components/header_back'


class StaffMeal extends Component {
    clicked = (employee) => {
        const { activeShift } = this.props
        const has_order = applyFilters({
            key: 'Find',
            path: 'orders__main',
            params: {
                shift: activeShift,
                staff: employee.id
            }
        })

        if (!has_order) {

            const { setMain, business_day } = this.props
            if (moment().diff(moment(business_day.created_at), 'day') == 0) {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active',

                    }
                })
                const order = {
                    ...data,
                    start_time: new Date(),
                    staff: employee.id
                }
                setMain('orders__main', { item: { ...order, action: 'add', onSuccess: this.openOrder } })
            }
            else {
                message.warning('You Cannot Order in this business day please end Day First')
            }
        }
        else {
            this.activeOrder(has_order)
        }


    }
    openOrder = (order) => {
        const { history, setMain } = this.props
        history.push('/home')
        setMain('orders__main', { active: order.id })

    }
    activeOrder = (order) => {
        const { history, setMain } = this.props
        history.push('/home')
        setMain('orders__main', { active: order.id })
    }
    renderStaff = () => {
        const staff = applyFilters({
            key: 'Filter',
            path: 'auths__user',
            params: {
                is_staff: true
            }
        })
        return map(staff, (d, i) => {
            return <div className={classes.tab} onClick={this.clicked.bind(this, d)}>
                <p>{d.name}</p>
                </div>
        })
    }
    render() {

        return (
            <div className={classes.alls}>
                <div className={classes.header}>
                    <Header name='Staff'/>
                    </div>
                <div className={classes.contall}>
                    {this.renderStaff()}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    activeShift: state.orders__shifts.active,
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, '')



})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StaffMeal))

