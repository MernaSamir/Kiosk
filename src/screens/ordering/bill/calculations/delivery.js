import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from "helpers/functions/filters";
import { get, range } from 'lodash'
import BillFooter from '../footer';
import Delivery from './deliverycalc'
import Performance from 'helpers/components/performance'
import { withTranslation } from 'react-i18next'

class DeliveryCalc extends Component {

    calculateBill() {
        const { order, orderData } = this.props;
        this.calc = applyFilters({
            key: "Filter",
            path: 'orders__details',
            params: {
                order
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                },
                then: {
                    key: 'calculateOrderReceipt',
                }
            }
        }, undefined, undefined, {
            seatsNum: range(0, (get(orderData, 'guests_num', 0) + 1))
        })
        return this.calc;
    }

    render() {
        const { t } = this.props
        const calc = this.calculateBill()
        return (
            <>
                <Delivery calc={this.calculateBill()} />
                <BillFooter calc={calc} t={t} />
            </>
        )
    }
}

const mapStateToProps = state => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    discounts: state.orders__orders_discount.data,
    order: state.orders__main.active,
    payments: state.orders__payment.data,
    orderData: get(state.orders__main.data, state.orders__main.active, {}),
    details: state.orders__details.data
});

export default connect(mapStateToProps, mapDispatchToProps)(Performance(withTranslation()(DeliveryCalc), ['details', 'payments']));