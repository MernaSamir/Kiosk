import React, { Component } from 'react'
import EndOrder from 'helpers/components/actions/end_order'
import { round } from 'lodash'
import classes from './style.less'

export default class DeliveryCalc extends Component {

    renderLeftDetails = (calc) => {
        const { t } = this.props
        return <div className={classes.details}>
            <div >
                <p>{`${t('Subtotal')} : \xa0 ${round(calc.sub_total, 2)}`}</p>
                <p>{`${t('Discounts')} : \xa0  ${round(calc.discount, 2)}`}</p>
            </div>
            <div>
                <p>{`${t('Charges')} : \xa0 ${round(calc.service, 2)}`}</p>
                <p>{`${t('Tax')} : \xa0 ${round(calc.tax, 2)}`}</p>
            </div>
        </div>
    }
   
    renderRightDetails = (calc) => {
        const {t} = this.props
        return < div className={classes.total} >
            <p id={classes.total}>{`${t('Total')} : \xa0 ${round(calc.net_total, 2)}`}</p>
            <p id={classes.balance}>{`${t('Balance Due')} : \xa0 ${round(calc.balance_due, 2)}`}</p>

        </div >
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
