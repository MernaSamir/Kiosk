import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { get } from 'lodash'
import classes from './style.less'
import RefundIcon from 'assets/images/refund.svg'

class BillHeader extends Component {


    render() {
        const { order, mode, user, customer, receipt, table, t } = this.props
        return (
            <div className={classes.header}>
                <p >{t('Start')}: {moment(order.start_time).format('DD-MM-YYYY hh:mm a')} - {t('End')}: {moment(order.end_time).format('DD-MM-YYYY hh:mm a')}</p>
                <div className={classes.cashier_details}>

                    <div className={classes.chashier}>
                        <p> {mode.name} # {order.num} {mode.key == 'DI' ? table ? `T:${table.name}` : 'Bar' : ''}</p>
                        <p>{t('Receipt')}: #{receipt.number}  {receipt._type == 'R' && <img src={RefundIcon} />}</p>
                        <div className={classes.flex}>
                            <p >{user && `${t('Cashier')}: ${get(user, 'first_name', '')} ${get(user, 'last_name', '')}`}</p>
                            <p >{customer && `${t('Customer')}: ${get(customer, 'name', '')}`}</p>
                            {mode.key == 'DI'&&<p>#Seats: {receipt.seats.length}</p>}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {

    return {
        order: get(state.orders__main.data, state.orders__main.active, {}),
        get mode() { return get(state.settings__mode.data, this.order.mode, {}) },
        get user() { return get(state.auths__user.data, this.order.serve, undefined) },
        receipt: get(state.orders__receipt.data, state.orders__receipt.active, ''),
        get table() { return get(state.dinin__tables.data, this.order.table, false) },
        get customer() { return get(state.parties__customer, `data.${this.order.customer}`, false) }
    }
}

export default connect(mapStateToProps)(BillHeader)
