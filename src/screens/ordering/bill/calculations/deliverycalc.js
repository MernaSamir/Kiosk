import React, { Component } from 'react'
import EndOrder from 'helpers/components/actions/end_order'
import { round } from 'lodash'
import classes from './style.less'

export default class DeliveryCalc extends Component {

    renderLeftDetails = (calc) => {
        return <div className={classes.left_details}>
            <p>{`Subtotal : \xa0 ${round(calc.sub_total, 2)}`}</p>
            <p>{`Discounts : \xa0  ${round(calc.discount, 2)}`}</p>
            <p>{`Charges : \xa0 ${round(calc.service, 2)}`}</p>
            <p>{`Tax : \xa0 ${round(calc.tax, 2)}`}</p>
        </div>
    }

    renderRightDetails = (calc) => {
        return <div className={classes.right_details}>
            <p id={classes.total}>{`Total : \xa0 ${round(calc.net_total, 2)}`}</p>
            <p id={classes.balance}>{`Balance due : \xa0 ${round(calc.balance_due, 2)}`}</p>

        </div>
    }

    render() {
        const { calc = {} } = this.props
        return (
            <EndOrder calc={calc}>
                <div className={classes.container}>
                    {this.renderLeftDetails(calc)}
                    {this.renderRightDetails(calc)}
                </div>
            </EndOrder>
        )
    }
}
