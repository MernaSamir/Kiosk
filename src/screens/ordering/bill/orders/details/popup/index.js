import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapDispatchToProps from 'helpers/actions/main'
import { pos_settings } from 'config/defaults'
import applyFilter from 'helpers/permissions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, filter } from 'lodash';
import course from 'assets/images/pinkCourse@3x.png'
import fireImg from 'assets/images/fire@3x.png'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import Actions from './actions'
import ClickOutSide from 'helpers/components/click'
import { withTranslation } from 'react-i18next'
class Popup extends Actions {

    constructor(props) {
        super(props);
        this.active_seat = applyFilters({ path: 'orders__details.item.seat_num' })
    }

    getActios = () => {
        const { orderDetail, activeSeat, order, item } = this.props
        const seat = applyFilters({
            key: 'Find',
            path: 'orders__order_seats',
            params: {
                order: order.id,
                seat_num: activeSeat,

            }
        })
        this.actions = {

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
                    order: {
                        check_length: { key: 'guests_num', value: 1, op: 'gt' }
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
                icon: 'edit',
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

            notes: {
                title: 'Notes',
                icon: ['far', 'sticky-note'],
                click: 'openPopup',
                params: {
                    type: 'AddNote',
                    onClick: 'addNote',
                    app: 'dropdowns__special_requests',
                    width: '50%',
                    childProps: {
                        note: get(orderDetail, 'notes', ''),
                        title: get(item, 'name', ''),
                        select: true,
                        fieldName: 'note',
                        sub: 'note',
                        type: 'Item Note'

                    }
                },
                class: '',
                permissions: {
                    details: {
                        check_not_props: ['void', 'fired_time', 'parent'],
                        include: 'seat_num',
                        checkVoid: { key: 'id', list: "orderDetails" },
                    }
                }
            },

            discount: {
                title: 'Discount Item',
                icon: 'percent',
                authorize: ['discount_item'],
                class: '',
                click: 'discount',
                params:{
                    type:'item'
                },
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                permissions: {
                    details: {
                        check_not_props: ['void', 'parent'],
                        include: 'seat_num',
                        checkVoid: { key: 'id', list: "orderDetails" },

                    }
                }
            },

            delete: {
                title: 'Cancel Item',
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
                title: 'Void Item',
                icon: 'trash-alt',
                click: 'voidItem',
                authorize: ['void_any_item', 'void_any_item_after_print'],
                class: '',
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                permissions: {
                    details: {
                        check: 'fired_time',
                        check_not_props: ['void', 'parent'],
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
                title: 'Move Item',
                icon: 'arrows-alt',
                click: 'openPopup',
                authorize: ['move_item'],
                params: {
                    type: "MoveItem",

                },
                class: '',
                permissions: {
                    details: {
                        check_not_props: ['void', 'parent'],
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
                        check_not_props: ['fired_time', 'void', 'parent'],
                        include: 'seat_num',
                        checkVoid: { key: 'id', list: "orderDetails" },
                    },
                    mode: {
                        match: 'DI'
                    },
                    pos_settings: {
                        // check_not_string: 'course'
                    }
                }
            },

            fire: {
                title: 'Fire Item',
                item_component: <img className={classes.btn_img} src={fireImg} />,
                class: '',
                click: 'openPopup',
                params: {
                    type: 'FireItem',
                },
                permissions: {
                    details: {
                        check_not_props: ['fired_time', 'void', 'parent'],
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
                    onClick: 'moveSeat',
                },
                class: '',
                permissions: {
                    seat: {
                        has_not: 'id',
                        check_not_shared: { key: "seat_num", list: "orderDetails" },
                        included: { key: 'seat_num', compare: 'seat_num', list: "orderDetails" },
                        not_included_list_no_invoice: { key: 'seat_num', list: "receipts" },
                        check_not_voided: { key: 'seat_num', list: "orderDetails" }
                    }
                }
            },

            discountSeat: {
                title: `Discount Seat`,
                icon: 'percent',
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                authorize: ['discount_seat'],
                class: '',
                click: 'discount',
                params:{
                    type:'seat'
                },
                permissions: {
                    seat: {
                        has_not: 'id',
                        not_included_list: { key: 'seat_num', list: "receipts" },
                        check_not_voided: { key: 'seat_num', list: "orderDetails" }


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
                        check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails", params: { parent: null } },
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
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                class: '',
                permissions: {
                    seat: {
                        check_receipt_seat: { key: 'seat_num', list: "receipts" },
                        check_Fired: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },
                        has_not: 'id',
                        not_included_list: { key: 'seat_num', list: "receipts" },
                        // check_not_voided: { key: 'seat_num', list: "orderDetails" }
                    }
                }
            },

            pay: {
                title: 'Pay Seat',
                icon: 'dollar-sign',
                click: 'paySeat',
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                class: '',
                authorize: ['pay'],
                permissions: {
                    seat: {
                        check_receipt_seat: { key: 'seat_num', list: "receipts" },
                        has_not: 'id',
                        not_included_list: { key: 'seat_num', list: "receipts" },
                        check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails", params: { parent: null } },

                    }
                }
            },

            seatNote: {
                title: 'Notes',
                icon: ['far', 'sticky-note'],
                click: 'openPopup',
                params: {
                    type: 'AddNote',
                    onClick: 'seatNote',
                    width: '70%',
                    childProps: {
                        note: get(seat, 'note', ''),
                        title: `Seat ${activeSeat}`
                    }
                },
                class: '',
                permissions: {
                    seat: {
                        has_not: 'id'
                    }
                }
            },
            assignCustomer: {
                title: 'Assign Customer',
                icon: ['far', 'user'],
                click: 'showCustomers',
                // params: {
                //     type: 'AssignCustomer',
                //     onClick: 'assignCustomer',
                // },
                permissions: {
                    seat: {
                        has_not: 'id',
                        not_included_list: { key: 'seat_num', list: "receipts" },
                    }
                }
            }
        }
    }

    getData = () => {
        const { order } = this.props
        const receipts = applyFilters({
            key: 'Filter',
            path: 'orders__receipt',
            params: {
                order: order.id
            }
        })
        const orderDetails = applyFilters({
            key: 'Filter',
            path: 'orders__details',
            params: {
                order: order.id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        })
        return {
            receipts,
            orderDetails
        }
    }

    takeAction = (action, ev) => {
        const { orderDetail } = this.props;
        get(this, action.click, () => { })(action.params, orderDetail)
    }

    returnOptions = () => {
        const { orderDetail, item, mode = {}, activeSeat, price, pos_settings, t, order } = this.props
        const { receipts, orderDetails } = this.datas
        return filter((this.actions), applyFilter(orderDetail, "permissions.details", { receipts, orderDetails })).filter(d => applyFilters(d.show || { key: 'true' }, {})).filter(
            applyFilter(item, "permissions.items")).filter(applyFilter(mode.key, 'permissions.mode')).filter(
                applyFilter(price, 'permissions.prices')
            ).filter(applyFilter(pos_settings, 'permissions.pos_settings')
            ).filter(applyFilter(order, 'permissions.order')).filter(
                // console.log(applyFilter({ id: orderDetail.id, seat_num: activeSeat }, 'permissions.seat', { receipts, orderDetails })) ||
                applyFilter({ id: orderDetail.id, seat_num: activeSeat }, 'permissions.seat', { receipts, orderDetails })).map((action, index) => (
                    <button key={index} disabled={!applyFilters({
                        key: 'authorize', compare: action.authorize
                    })} className={classes.popuptext_btn} onClick={this.takeAction.bind(this, action, item)}>
                        {action.item_component || <FontAwesomeIcon className={classes.popup_icon} icon={action.icon} />}
                        <span>{t(action.title)}</span>
                    </button>
                ))
    }

    render() {
        const { orderPopup = {}, t } = this.props
        if (!orderPopup) {
            return <></>
        }
        this.getActios()
        this.datas = this.getData()
        const filterdActions = this.returnOptions();
        const reset = [{
            type: 'set_path_orders__details',
            path: 'orderPopup',
            data: {}
        }]
        return (
            Boolean(filterdActions.length) && <ClickOutSide reset={reset}>
                <div className={`${classes.popuptext}  ${get(classes, orderPopup.show)}`}
                    style={{ top: orderPopup.top }}
                    id={"myPopup"} >
                    <span className="popuptext-span">{t('Item Options')}</span>
                    {filterdActions}
                </div>
            </ClickOutSide>
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
    pos_settings: get(state.main.pos_settings,
        `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Popup)))
