import React, { Component } from 'react'
import { get, filter, omit, find, isArray, head, isEqual, map } from 'lodash';
import applyFilters from 'helpers/functions/filters'
import { message } from 'antd';

export default class Actions extends Component {

    editModifiers = () => {
        const { history, setMain } = this.props
        setMain("orders__details", { orderPopup: '' })
        history.push('/Home/modifires')
    }

    editCombo = () => {
        const { history, setAll, orderDetail } = this.props
        const dis = [{ type: 'set_main', app: 'orders__details', data: { orderPopup: '' } },
        { type: 'set_main', app: 'items__prices', data: { active: orderDetail.item } }
        ]
        setAll(dis)
        history.push('/Home/combo')
    }

    calculateBill = (receipt) => {
        const { orderDetails } = this.datas
        const calc = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, orderDetails, undefined, { receipt: receipt.id, seatsNum: receipt.seats, combine: true })
        const items = applyFilters({
            key: 'Filter',
            path: 'orders__receipt_items',
            params: {
                receipt: receipt.id
            }
        })
        const one = map(items, d => (d.id))
        const two = map(head(calc).items, d => (d.id))
        return head(calc).net_total == receipt.net_total && isEqual(one, two)
    }
    paySeat = () => {
        const { history, setMain, activeSeat } = this.props
        const { receipts } = this.datas
        const receipt = find(receipts, (d) => (d.seats.includes(activeSeat))) || {}
        const pay = this.calculateBill(receipt)
        if (pay) {

            setMain("orders__receipt", { active: receipt.id })
            this.closePopup()
            history.push('/Home/payment')
        }
        else {
            message.warning('You Have To Reprint')
        }
    }

    closePopup = () => {
        const { setMain } = this.props
        setMain("orders__details", { orderPopup: '' })
    }

    discount = (params) => {
        const { history, setMain, orderDetail, order, activeSeat, setAll } = this.props
        setAll([
            {type:'set_main', app:'orders__details', data:{orderPopup: ''}},
            {type:'set_main', app: 'orders__orders_discount', data:{
                item: {
                    detail: orderDetail.id,
                    order: order.id,
                    get seat_num() { return this.detail ? 0 : activeSeat }
                }
            }},
            {type:'set_main', app: 'orders__orders_discount', data:{type:params.type}}
        ])
        // setMain("orders__details", { orderPopup: '' })
        // setMain('orders__orders_discount', {
        //     item: {
        //         detail: orderDetail.id,
        //         order: order.id,
        //         get seat_num() { return this.detail ? 0 : activeSeat }
        //     }
        // })
        history.push('/Home/discount')
    }

    deleteItem = () => {
        const { setMain, orderDetail } = this.props
        setMain('orders__details',
            { item: { id: orderDetail.id, deleted: true, action: 'update' } })


    }

    printKitchen = (item) => {
        const { order } = this.props;
        let out = [{
            type: 'set_main_orders__details',
            data: {
                item: {
                    seat_num: this.active_seat
                }
            }
        }]
        if (!window.cordova) {
            out.push({
                type: 'set_main_Printing', data: { print: { active: 'Kitchen', order: order.id, items: isArray(item) ? item.map(d => d.id) : [item.id] } }
            })
        }
        return out
    }

    fire = () => {
        const { setMain, orderDetail } = this.props;
        const { orderDetails } = this.datas
        const printing = Boolean(window.crodova);
        setMain("orders__details", {
            item: {
                data: [{
                    id: orderDetail.id,
                    printing,
                    fired_time: new Date()
                }, ...filter(orderDetails, { parent: orderDetail.id }).map(d => ({
                    id: d.id,
                    fired_time: new Date(),
                    printing
                }))],
                action: 'bulkEdit',
                onSuccess: this.printKitchen
            },
            orderPopup: ''
        })
    }

    openPopup = (params) => {
        const { setAll } = this.props
        const popup = {
            type: params.type, visable: true, width: params.width || "50%",
            childProps: {
                onClick: get(this, params.onClick, ''),
                ...params.childProps
            }
        }
        setAll([
            { type: 'set_main', app: 'popup', data: { popup } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: '' } },
        ])
    }

    updateVoid = (quantity) => {
        const { orderDetail, setMain } = this.props
        quantity = quantity || orderDetail.quantity

        const sales_item = applyFilters({
            key: 'chainMulti',
            selectors: {
                items__prices: 'item',
                items__sales_items: 'sales_item',
            }
        }, orderDetail)

        const name = sales_item.items__sales_items.name
        const data = {
            ...omit(orderDetail, orderDetail.id),
            quantity,
            fired_time: new Date(),
            void: orderDetail.id,
            action: 'add',
            onSuccess: this.printKitchen
        }
        const popup = {
            type: 'AddNote', visable: true, width: "50%",

            childProps: {
                onClick: this.addReason.bind(this, data),
                reason: get(orderDetail, 'reason', ''),
                title: name,
                select: true,
                app: 'dropdowns__reasons',
                params: {
                    _type: 'vo'
                },
                fieldName: 'reason',
                sub: 'Reason',
                validations: { required: true }

            }
            // first_msg: `Are you sure you want to Void ${name} ?`,
            // pressYes: () => {
            //     setMain('orders__details', {
            //         item: {
            //             ...omit(orderDetail, orderDetail.id),
            //             quantity,
            //             fired_time: new Date(),
            //             void: orderDetail.id,
            //             action: 'add',
            //             onSuccess: this.printKitchen
            //         },
            //     })
            // }

        }
        setMain('popup', { popup })
        // setAll([
        //     {
        //         type: 'set_main',
        //         app: 'orders__details',
        //         data: {
        //             item: {
        //                 ...omit(orderDetail, orderDetail.id),
        //                 quantity,
        //                 fired_time: new Date(),
        //                 void: orderDetail.id,
        //                 action: 'add',
        //                 onSuccess: this.printKitchen
        //             },
        //         }
        //     },
        //     { type: 'set_main', app: 'popup', data: { popup: {} } }
        // ])
    }

    voidItem = () => {
        const { orderDetail } = this.props
        if (orderDetail.quantity == 1) {
            this.updateVoid();
        }
        else {
            this.openPopup({ type: 'Void', onClick: 'updateVoid' })
        }

    }
    showCustomers = () => {
        const { history, setMain } = this.props
        setMain('orders__details', { assign_customer: this.assignCustomer })
        history.push('/list/customer')
    }
    assignCustomer = (customerId) => {
        const { setMain, order, activeSeat, history } = this.props
        const seat = applyFilters({
            key: 'Find',
            path: 'orders__order_seats',
            params: {
                order: order.id,
                seat_num: activeSeat
            }
        })
        setMain('orders__order_seats', seat ? {
            item: {
                id: seat.id, customer: customerId, action: 'update', onSuccess() {
                    history.push('/home')
                    return [{type:'set_main_orders__details', data:{assign_customer:null }}]

                }
            }
        } :
            {
                item: {
                    customer: customerId, seat_num: activeSeat, order: order.id, action: 'add', onSuccess() {
                        history.push('/home')
                        return [{type:'set_main_orders__details', data:{assign_customer:null}}]
                    }
                }
            })

    }

    changeCourse = (course) => {
        const { setAll, orderDetail } = this.props;
        setAll([
            { type: 'set_main', app: 'orders__details', data: { item: { id: orderDetail.id, course: course.id, action: 'update' } } },
            { type: 'set_main', app: 'popup', data: { popup: {} } }
        ])
    }

    addNote = (note) => {
        const { setAll, orderDetail } = this.props;
        setAll([
            { type: 'set_main', app: "orders__details", data: { item: { id: orderDetail.id, notes: note, action: 'update' } } },
            { type: 'set_main', app: "popup", data: { popup: {} } },
        ])
    }
    addReason = (data, reason) => {
        const { setAll, orderDetail } = this.props;
        setAll([
            { type: 'set_main', app: "orders__details", data: { item: { ...data, reason } } },
            { type: 'set_main', app: "popup", data: { popup: {} } },
        ])
    }
    seatNote = (note) => {
        const { setMain, activeSeat, order } = this.props;
        const seat = applyFilters({
            key: "Find",
            path: 'orders__order_seats',
            params: {
                order: order.id,
                seat_num: activeSeat
            }
        })
        if (seat) {
            setMain('orders__order_seats', { item: { id: seat.id, note, action: 'update' } })
        }
        else {
            setMain('orders__order_seats', { item: { order: order.id, seat_num: activeSeat, note, action: 'add' } })
        }
    }

    printReceipt = (seatsNum = [this.props.activeSeat], merge = true, receipt = {}) => {
        const { setAll } = this.props
        const { orderDetails } = this.datas

        const receipts = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, orderDetails, undefined, { combine: merge, seatsNum, receipt: receipt.id })
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: { type: "Receipt", receipts: receipts } } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: {} } },
        ])
    }

    reprintReceipt = () => {
        const { activeSeat } = this.props;
        const { receipts } = this.datas
        const receipt = find(receipts, d => (d.seats.includes(activeSeat)))
        this.printReceipt(receipt.seats, undefined, receipt)
        this.closePopup()
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div>

            </div>
        )
    }
}