/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main';
import { pos_settings } from 'config/defaults'
import { applyPermissions } from 'helpers/permissions'
import { pick, range, get, omit, isEqual, defaults, find } from 'lodash'
import { message } from 'antd'
import applyFilters from 'helpers/functions/filters';
export default function WrapComponent(WrappedComponent) {
    class ActionComponent extends Component {
        constructor(props) {
            super(props);
            this.getData(props)
            props.setMain("orders__details", { afterAction: this.afterAction.bind(this) })

        }
        getDetails(order, path) {
            return applyFilters({
                key: 'Filter',
                path,
                params: { order },
                then: {
                    key: 'Reject',
                    params: { deleted: true }
                }
            })
        }

        getListsData(order) {
            
            this.datas = {
                list: this.getDetails(order, 'orders__details'),
                receipts: this.getDetails(order, 'orders__receipt'),
            }
            return this.datas;
        }
        getData = (props) => {
            const { order } = props;
            if (order) {
                this.afterFetch()
            }
        }
        datas = {};
        afterFetch = (data) => {
            const { item = {}, order } = this.props;
            if (item.add) {
                this.checkItem(this.props)
            }
            this.getListsData(order);
        }
        componentWillUnmount() {
            const { setMain } = this.props;
            setMain('orders__details', { orderPopup: '' })
        }
        shouldComponentUpdate(nextProps, nextState) {
            const compare = ['item.add', 'payments'];
            const su = !isEqual(pick(nextProps, compare), pick(this.props, compare));
            if (su) {
                const { item = {}, order } = nextProps;
                this.getListsData(order)
                if (order && item.add && !get(this.props.item, 'add', false)) {
                    this.checkItem(nextProps)
                }
                if (!isEqual(nextProps.order, this.props.order)) {
                    this.getData(nextProps);
                }
            }
            return su;
        }

        afterAction = (data) => {
            let d_main = data[0] || data;
            const d = {
                active: d_main.parent || d_main.id,
                item: {
                    seat_num: d_main.seat_num
                },
                orderPopup: ''
            }
            return [
                { type: 'set_main_items__sales_items', data: { active: '' } },
                { type: 'set_main_orders__details', data: d },
            ]
        }
        checkItem = (props) => {
            const { item, order, setMain, setAll } = props;

            const newItem = { ...item, price: item.price }
            const datas = this.datas;
            const { receipts, list } = datas;
            const avail = applyPermissions({ seat_num: newItem.seat_num }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts })
            if (avail) {
                const filters = defaults(pick(newItem, ['item', 'parent', 'doneness', 'parent']),
                    { void: null, seat_num: 0, parent: '', doneness: null, fired_time: null })
                // // const ids = map(list, (d) => d.parent).filter(d => d);
                const mainDetail = find(list, filters) || {}
                // if (!mainDetail.id) {
                // const duplicate = find(list, omit(filters, ['fired_time'])) || {}
                setMain('orders__details', {
                    item: {
                        action: mainDetail.id ? "update" : "add",
                        id: mainDetail.id,
                        ...omit(newItem, ['add']),
                        onSuccess: (data) => {
                            let out = [
                                {
                                    type: 'set_main_orders__details',
                                    data: {
                                        item: { seat_num: newItem.seat_num }
                                    }
                                }
                            ]
                            if (newItem.onSuccess) {
                                out = [...out, ...newItem.onSuccess(data)]
                            }
                            if (!data.parent) {
                                out = [...out, ...this.chechcourse(), ...this.shareItem(data)]
                            }
                            return out
                        }, order, quantity: get(mainDetail, 'quantity', 0) + 1
                    }
                })
                // } else {
                //     setMain('orders__details', {
                //         item: {
                //             onSuccess: item.onSuccess,
                //             action: "update", ...omit(item, ['add']),
                //             id: mainDetail.id, quantity: mainDetail.quantity + item.quantity
                //         }
                //     })
                // }

            }
            else {
                message.error("You Can Not Add Items To Paid Seat")
                setAll([
                    { type: 'set_main', app: 'items__sales_items', data: { active: '' } },
                    { type: 'set_main', app: 'orders__details', data: { item: { seat_num: item.seat_num } } }
                ])

            }

        }

        chechcourse = () => {
            const { pos_settings, modeKey } = this.props
            if (eval(pos_settings.course) && modeKey == 'DI') {
                return [{
                    type: 'set_main_popup',
                    data: {
                        popup: {
                            type: 'CoursePopup', visable: true, width: "50%",

                        }
                    }
                }]
            }
            return []
        }

        shareItem = (item) => {
            const { activeOrder, modeKey } = this.props
            const { receipts } = this.datas;
            if (item.seat_num == 0 && modeKey == 'DI') {
                return [{
                    type: 'set_main_orders__item_seats',
                    data: {
                        item: {
                            data: range(1, activeOrder.guests_num + 1).filter(i =>
                                applyPermissions({ seat_num: i }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts })
                            ).map(i => ({ seat_num: i, details: item.id })),
                            action: 'bulkAdd',
                            onSuccess: (data) => {
                                const list = data.map(i => i.seat_num)
                                return [
                                    { type: 'set_path_orders__details', path: `data.${item.id}.seats`, data: list }
                                ]
                            }
                        }
                    }
                }]
            }
            return []
        }
        render() {
           
            const { receipts } = this.datas
            return (
                <WrappedComponent receipts={receipts} />
            )
        }
    }
    const ActionWrapedComponent = connect((state) => ({
        item: state.orders__details.item,
        order: state.orders__main.active,
        activeOrder: get(state.orders__main.data, state.orders__main.active, {}),
        modeKey: get(state.settings__mode.data, `${state.settings__mode.active}.key`),
        get active_station_data() { return get(state.licensing__station.data, this.active_station, {}) },
        pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
        payments:state.orders__payment.item,
        
    }), mapDispatchToProps)(ActionComponent)
    return ActionWrapedComponent
}