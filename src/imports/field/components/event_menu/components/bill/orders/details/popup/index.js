import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/permissions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, filter, omit, pickBy, map, pick, find, flatten, isArray } from 'lodash';
import course from 'assets/images/pinkCourse@3x.png'
import fireImg from 'assets/images/fire@3x.png'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'

class Popup extends Component {
    actions = {

        shareItem: {
            title: 'Share Item',
            icon: 'share',
            class: '',
            click: 'openPopup',
            params: {
                type: 'ShareItem',
            },
            permissions: {
                details: {
                    include: 'seat_num',
                    check_not_props: ['void', 'parent'],
                    check: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                    check_length: { key: 'seats', value: 0, op: 'eq' }
                },
                mode: {
                    match: 'DI'
                },
               
            }
        },

        EditShare: {
            title: 'Edit Share',
            icon: 'share',
            class: '',
            click: 'openPopup',
            params: {
                type: 'EditShare',
            },
            permissions: {
                details: {
                    include: 'seat_num',
                    check: 'seat_num',
                    check_not_props: ['void', 'parent'],
                    checkVoid: { key: 'id', list: "orderDetails" },
                    check_length: { key: 'seats', value: 0, op: 'gt' }
                },
                mode: {
                    match: 'DI'
                },
               
            }
        },

        add_modifier: {
            title: 'Edit Modifier',
            icon: 'plus',
            class: '',
            click: 'editModifiers',
            permissions: {
                prices: {
                    check: 'has_modifiers'
                },
                details: {
                    check_not_props: ['void', 'fired_time'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                }
            }
        },
        edit_combo: {
            title: 'Edit Combo',
            icon: 'plus',
            class: '',
            click: 'editCombo',
            permissions: {
                details: {
                    check_not_props: ['void', 'fired_time'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                    check: 'is_combo'
                }
            }
        },
        Notes: {
            title: 'Notes',
            icon: ['far', 'sticky-note'],
            click: 'openPopup',
            params: {
                type: 'AddNote',
                onClick: 'addNote',
                width: '70%'
            },
            class: '',
            permissions: {
                details: {
                    check_not_props: ['void', 'fired_time','parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                }
            }
        },

        discount: {
            title: 'Discount item',
            icon: 'percent',
            authorize: ['discount_item'],
            class: '',
            click: 'discount',
            permissions: {
                details: {
                    check_not_props: ['void','parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },

                }
            }
        },

        delete: {
            title: 'cancel item',
            authorize: ['cancel_any_item'],
            icon: 'trash-alt',
            class: '',
            click: 'deleteItem',
            permissions: {
                details: {
                    check_not_props: ['fired_time', 'void', 'parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                    not_included_list: { key: 'seat_num', list: "receipts" }
                }
            }

        },

        void: {
            title: 'void item',
            icon: 'trash-alt',
            click: 'voidItem',
            authorize: ['void_any_item', 'void_any_item_after_print'],
            class: '',
            permissions: {
                details: {
                    check: 'fired_time',
                    check_not_props: ['void','parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                    not_included_list: { key: 'seat_num', list: "receipts" }
                },
                mode: {
                    match: 'DI'
                }
            }
        },

        moveItem: {
            title: 'Move',
            icon: 'arrows-alt',
            click: 'openPopup',
            authorize: ['move_item'],
            params: {
                type: "MoveItem",

            },
            class: '',
            permissions: {
                details: {
                    check_not_props: ['void','parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                    not_included_list: { key: 'seat_num', list: "receipts" }
                },
                mode: {
                    match: 'DI'
                }
            }
        },

        course: {
            title: 'Change Course',
            item_component: <img className={classes.btn_img} src={course} />,
            class: '',
            click: "openPopup",
            params: {
                type: 'CoursePopup',
                onClick: 'changeCourse',
            },
            permissions: {
                details: {
                    check_not_props: ['fired_time', 'void','parent'],
                    include: 'seat_num',
                    checkVoid: { key: 'id', list: "orderDetails" },
                },
                mode: {
                    match: 'DI'
                }
            }
        },

        fire: {
            title: 'Fire Item',
            item_component: <img className={classes.btn_img} src={fireImg} />,
            class: '',
            click: 'fire',
            permissions: {
                details: {
                    check_not_props: ['fired_time', 'void','parent'],
                    include: 'seat_num',
                    checkVoid: 'id'
                },
                mode: {
                    match: 'DI'
                }
            }
        },

        moveSeat: {
            title: 'Move Seat',
            icon: 'arrows-alt',
            click: 'openPopup',
            params: {
                type: 'MoveSeat',
                onClick: 'moveSeat'
            },
            class: '',
            permissions: {
                seat: {
                    has_not: 'id',
                    check_not_shared: { key: "seat_num", list: "orderDetails" },
                    included: { key: 'seat_num', compare: 'seat_num', list: "orderDetails" },
                    not_included_list: { key: 'seat_num', list: "receipts" }
                }
            }
        },

        print: {
            title: 'Print',
            icon: 'print',
            click: 'printReceipt',
            authorize: ['print'],
            class: '',
            permissions: {
                seat: {
                    has_not: 'id',
                    check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },
                    not_included: { key: 'seat_num', list: "receipts" },
                    check_not_voided: { key: 'seat_num', list: "orderDetails" }
                }
            }
        },

        rePrint: {
            title: 'Reprint',
            icon: 'print',
            authorize: ['reprint'],
            click: 'reprintReceipt',
            class: '',
            permissions: {
                seat: {
                    check_receipt_seat: { key: 'seat_num', list: "receipts" },
                    check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },
                    has_not: 'id',
                    not_included_list: { key: 'seat_num', list: "receipts" },
                    check_not_voided: { key: 'seat_num', list: "orderDetails" }
                }
            }
        },

        pay: {
            title: 'Pay Seat',
            icon: 'dollar-sign',
            click: 'paySeat',
            class: '',
            authorize: ['pay'],
            permissions: {
                seat: {
                    check_receipt_seat: { key: 'seat_num', list: "receipts" },
                    has_not: 'id',
                    not_included_list: { key: 'seat_num', list: "receipts" },
                    check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },

                }
            }
        },

        // seatNote: {
        //     title: 'Notes',
        //     icon: ['far', 'sticky-note'],
        //     click: 'openPopup',
        //     params: {
        //         type: 'AddNote',
        //         onClick: 'seatNote',
        //         width: '70%'
        //     },
        //     class: '',
        //     permissions: {
        //         seat: {
        //             has_not: 'id'
        //         }
        //     }
        // },

    }
    takeAction = (action, ev) => {
        const {orderDetail} = this.props;
        get(this, action.click, () => { })(action.params, orderDetail)
    }

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
    paySeat = () => {
        const { history, receipts, setMain, activeSeat } = this.props
        const receipt = find(receipts, (d) => (d.seats.includes(activeSeat))) || {}
        setMain("orders__receipt", { active: receipt.id })
        this.closePopup()
        history.push('/Home/payment')
    }
    closePopup = () => {
        const { setMain } = this.props
        setMain("orders__details", { orderPopup: '' })
    }
    discount = () => {
        const { history, setMain, orderDetail, order, activeSeat } = this.props
        setMain("orders__details", { orderPopup: '', discountItem: true })
        setMain('orders__orders_discount', {
            item: {
                detail: orderDetail.id,
                order: order.id,
                get seat_num() { return this.detail ? 0 : activeSeat }
            }
        })
        history.push('/Home/discount')
    }
    deleteItem = () => {
        const { setMain ,orderDetail} = this.props;
        setMain("orders__details", { item: { id: orderDetail.id, deleted: true, action: 'update' }, orderPopup: '' })
    }
    printKitchen = (item) => {
        const { order } = this.props;
        if (!window.cordova) {
            return [{
                type: 'set_main_Printing', data: { print: { active: 'Kitchen', order: order.id, items: isArray(item) ? item.map(d=>d.id):[item.id] } }
            }]
        }
        return []
    }
    fire = () => {
        const { setMain, orderDetail, orderDetails } = this.props;
        const printing = Boolean(window.crodova);
        setMain("orders__details", {
            item: {
                data: [{
                    id: orderDetail.id,
                    printing,
                    fired_time: new Date()
                }, ...filter(orderDetails, {parent: orderDetail.id}).map(d=>({
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
        const { setMain } = this.props
        const popup = {
            type: params.type, visable: true, width: params.width || "50%",
            childProps: {
                onClick: get(this, params.onClick, '')

            }
        }
        setMain('popup', { popup })
        setMain("orders__details", { orderPopup: '' })
    }
    updateVoid = (quantity) => {
        const { setMain, orderDetail } = this.props
        quantity = quantity || orderDetail.quantity
        setMain("orders__details", {
            item: {
                ...omit(orderDetail, orderDetail.id),
                quantity,
                fired_time: new Date(),
                void: orderDetail.id,
                action: 'add',
                onSuccess: this.printKitchen
            },
        })
        setMain('popup', { popup: {} })
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
    changeCourse = (course) => {
        const { setMain, orderDetail } = this.props;
        setMain("orders__details", { item: { id: orderDetail.id, course: course.id, action: 'update' } })
        setMain('popup', { popup: {} })
    }

    addNote = (note) => {
        const { setAll, orderDetail } = this.props;
        setAll([
            {type: 'set_main', app: "orders__details", data: { item: {id:orderDetail.id, notes: note, action: 'update' } }},
            {type: 'set_main', app: "popup", data: { popup: {} }},
        ])
    }
    seatNote = (note) => {
        const { setMain } = this.props;
        //adding notes to seat
        setMain('popup', { popup: {} })
    }
    printReceipt = (seatsNum = [this.props.activeSeat], merge = true, receipt={}) => {
        const {orderDetails, setAll} = this.props
        const receipts = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, orderDetails, undefined, { combine: merge, seatsNum, receipt: receipt.id })
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: { type: "Receipt", receipts: receipts } } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: { } } },
        ])
    }

    reprintReceipt = () => {
        const { receipts, activeSeat } = this.props;
        const receipt = find(receipts, d => (d.seats.includes(activeSeat)))
        this.printReceipt(receipt.seats, undefined, receipt)
        this.closePopup()
    }

    returnOptions = () => {
        const { orderDetail, item, mode = {}, activeSeat, receipts, orderDetails, price } = this.props
        return filter((this.actions), applyFilter(orderDetail, "permissions.details", { receipts, orderDetails })).filter(
            applyFilter(item, "permissions.items")).filter(applyFilter(mode.key, 'permissions.mode')).filter(
            applyFilter(price,'permissions.prices')
            ).filter(
                applyFilter({ id: orderDetail.id, seat_num: activeSeat }, 'permissions.seat', { receipts, orderDetails })).map((action, index) => (
                    <button key={index}  disabled={!applyFilters({
                        key:'authorize', compare: action.authorize
                        })} className={classes.popuptext_btn} onClick={this.takeAction.bind(this, action, item)}>
                        {action.item_component || <FontAwesomeIcon className={classes.popup_icon} icon={action.icon} />}
                        <span>{action.title}</span>
                    </button>
                ))
    }
    render() {
        const { orderPopup = {} } = this.props
        const filterdActions = this.returnOptions();
        return (


            Boolean(filterdActions.length) && <div className={`${classes.popuptext}  ${get(classes, orderPopup.show)}`}
                style={{ top: orderPopup.top }}
                id={"myPopup"} >
                <span className="popuptext-span">Item Options</span>
                {filterdActions}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    orderPopup: get(state.orders__details, 'orderPopup', ''),
    orderDetail: get(state.orders__details, `data.${state.orders__details.active}`, {}),
    get price() { return get(state.items__prices.data, this.orderDetail.item, {}) },
    get item() { return get(state.items__sales_items.data, this.price.sales_item, {}) },
    mode: get(state.settings__mode, `data.${state.settings__mode.active}`, {}),
    activeSeat: get(state.orders__details, 'item.seat_num', {}),
    get orderDetails() { return pickBy(state.orders__details.data, { deleted: null, order: this.order.id }) },
    orders: state.orders__main,
    get receipts() { return pickBy(state.orders__receipt.data, { order: this.order.id }) },
    get receiptsItems() { return pick(state.orders__receipt_items.data, flatten(map(this.receipts, d => d.receiptitems_set))) },
    orders__item_seats: get(state.orders__item_seats, 'data', {})
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Popup))
