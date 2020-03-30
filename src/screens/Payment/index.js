import React, { Component } from 'react'
import { get, filter, reject } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { connect } from 'react-redux';
import RightPart from './right_part';
import classes from './style.less'
class Payment extends Component {
    getFilters() {
        const { order, receipt } = this.props;
        return {
            "TW": {
                "key": "calculateOrderReceipt",
                extra: { seatsNum: [0] },
                "filter": { order: order.id }
            },
            "DI": {
                key: "calculateReceiptReceipt",
                extra: { seatsNum: receipt.seats, type: 'receipt', receipt: receipt.id },
                filter: { receipt: receipt.id }
            },
            "CC": {
                "key": "calculateOrderReceipt",
                extra: { seatsNum: [0] },
                "filter": { order: order.id }
            },
            "DL": {
                "key": "calculateOrderReceipt",
                extra: { seatsNum: [0] },
                "filter": { order: order.id }
            },
            "EV": {
                "key": "calculateOrderReceipt",
                extra: { seatsNum: [0] },
                "filter": { order: order.id }
            },
        }
    }

    calculateBill() {
        const { details, mode } = this.props;
        if (mode.key) {
            const type = get(this.getFilters(), mode.key);

            this.calc = applyFilters({
                key: type.key,
            }, reject(filter(details, type.filter), { deleted: true }), undefined, type.extra)
            return this.calc;
        }
        return 0
    }

    render() {
        const { mode } = this.props;
        const calc = this.calculateBill();
        return (
            <div className={classes.root}>
                {mode.key && <RightPart calc={calc} />}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    get details() { return this.mode.key == "DI" ? state.orders__receipt_items.data : state.orders__details.data },
    payments: state.orders__payment.data,
    receipt: get(state.orders__receipt.data, state.orders__receipt.active, {}),
    order: get(state.orders__main.data, state.orders__main.active, {}),
})
export default connect(mapStateToProps)(Payment)
