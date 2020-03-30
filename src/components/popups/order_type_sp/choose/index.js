import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main';
import { message } from 'antd';
import { get, map, find } from 'lodash';
import moment from 'moment'
import classes from './style.less';

class OrderType extends Component {

    getList = () => {
        const { path, params } = this.props
        const tabs = applyFilters({
            key: 'Filter',
            path,
            params
        })
        return tabs
    }

    renderPopup = () => {
        const { filter, startDOrder } = this.props
        if (filter == 'address')
            return <button type="button" onClick={startDOrder.bind(this, false)}>Select Customer</button>
        else {
            return this.renderChoose()
        }
    }

    renderChoose = () => {
        const list = this.getList()
        return map(list, d => (
            <button type='button' onClick={this.startOrder.bind(this, d.id)}>
                {d.name}
            </button>
        ))
    }

    startOrder = (address) => {
        const { order, history, setMain, business_day, sub_mode, filter } = this.props
        if (order) {
            if (order.customer) {
                message.warning('Please Close Order First')
            }
            else {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        customer: 'parties__customer.active',

                    }
                })
                setMain('orders__main', {
                    item: {
                        ...data,
                        action: 'update',
                        start_time: new Date(),
                        onSuccess() {
                            history.push('/home')
                            return [{
                                type: "set_main_popup",
                                data: { popup: {} }
                            }]
                        }
                    }
                })
            }
        }
        else {
            if (moment().diff(moment(business_day.created_at), 'day') == 0) {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active',
                        // customer: 'parties__customer.active',

                    }
                })
                setMain('orders__main', {
                    item: {
                        ...data, sub_mode: sub_mode, [filter]: address, action: 'add',
                        start_time: new Date(),
                        onSuccess() {
                            history.push('/home')
                            return [{
                                type: "set_main_popup",
                                data: { popup: {} }
                            }]
                        }
                    }
                })
            }
            else {
                message.warning('You Cannot Order in this business day please end Day First')
            }
        }
    }

    render() {
        return (
            <div className={classes.container}>
                {this.renderPopup()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    order: get(state.orders__main.data, state.orders__main.active),
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    customer_address: get(find(state.parties__address.data, { customer: state.parties__customer.active }), 'id', ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderType))