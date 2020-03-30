import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main';
import { message } from 'antd';
import { get, map, find, filter, pick } from 'lodash';
import moment from 'moment'
import classes from './style.less';
import uuid from 'uuid/v4';

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

    renderChoose = () => {
        const list = this.getList()
        return map(list, d => (
            <button type='button' onClick={this.check.bind(this, d)}>
                {d.name}
            </button>
        ))
    }

    check = (elment) => {
        const { change } = this.props
        if (change) {
            this.changeOrder(elment.id)
        }
        else {
            this.startOrder(elment)
        }
    }

    changeOrder = (elment) => {
        const { filter, currentOrder, sub_mode, setMain } = this.props
        var item
        if (filter == 'pick_location') {
            item = {
                id: currentOrder.id,
                address: null,
                [filter]: elment,
                sub_mode: sub_mode,
                served_location: elment,
                action: 'update',
                onSuccess: this.save.bind()
            }
        }
        else {
            item = {
                id: currentOrder.id,
                pick_location: null,
                [filter]: elment,
                sub_mode: sub_mode,
                action: 'update',
                onSuccess: this.save.bind()
            }
        }
        setMain('orders__main', {
            item: item
        })
    }

    save = () => {
        // const popup = {
        //     type: 'Save', visable: true, width: "50%",
        //     childProps: {
        //         msg: "The Order is Transfered Successfully",

        //     }
        // }
        return [
            {
                type: 'set_main_popup',
                data: { popup: {} }
            },
            {
                type: 'set_main_orders__main',
                data: { active: '' }
            }
        ]
    }


    startOrder = (address) => {
        const { order, setMain, business_day, sub_mode, filter } = this.props
        // console.log(sub_mode)
        if (order) {
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
                    id: order.id,
                    start_time: new Date(),
                    sub_mode: sub_mode,
                    [filter]: address.id,
                    onSuccess: this.onSuccess
                }
            })

        }
        else {
            if (moment().diff(moment(business_day.created_at), 'day') == 0) {
                const served_location = applyFilters({
                    key: 'chain',
                    selectors: {
                        "geographies__street": "street",
                        "geographies__area": 'area',
                        "licensing__location": 'location',
                    },
                }, address)

                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active',
                        customer: 'parties__customer.active',
                    }
                })
                setMain('orders__main', {
                    item: {
                        ...data, sub_mode: sub_mode, [filter]: address.id,
                        served_location: served_location.id, action: 'add',
                        start_time: new Date(), onSuccess: this.onSuccess

                    }
                })
            }
            else {
                message.warning('You Cannot Order in this business day please end Day First')
            }
        }
    }

    onSuccess = (order) => {
        return this.addDetails(order)

        // {
        //     type: "set_main_popup",
        //     data: { popup: {} }
        // }
    }

    addDetails = (order) => {
        const { orderDetails, prices, history, values, } = this.props
        const selected = map(filter(values, { check: true }), (d, i) => i)
        const details = map(pick(orderDetails, selected), (d, i) => ({
            id: uuid(),
            quantity: 1,
            order: order.id,
            item: d.item,
            main_id: d.id,
            price: get(prices, `${d.item}.price`)
        }))
        const modifiers = map(filter(orderDetails, (d) => (selected.includes(d.parent))), d => ({
            id: uuid(),
            item: d.item,
            quantity: d.quantity,
            price: get(prices, `${d.item}.price`),
            parent: find(details, { main_id: d.parent }).id
        }));
        return [{
            type: 'set_main_orders__details',
            data: {
                item: {
                    data: [...details, ...modifiers],
                    action: 'bulkEdit',
                    onSuccess: this.aonSuccess

                }
            }
        }]
    }

    aonSuccess = () => {
        const { history } = this.props
        history.push("/home")
        return [{

            type: "set_main_popup",
            data: { popup: {} }
        }
        ]

    }
    render() {
        return (
            <div className={classes.container}>
                {this.renderChoose()}
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