import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../../style.less';
import applyFilters from 'helpers/functions/filters';
import { round, filter, get } from 'lodash'
import { withTranslation } from 'react-i18next';

class Calculation extends Component {

    renderCalculations = () => {
        const { orderDetails, order } = this.props;
        this.calc = applyFilters({
            key: 'calculateOrderReceipt',
        }, filter(orderDetails, { order: order.id }))
        return this.calc;
    }

    renderLeftDetails = () => {
        const {t}= this.props
        const calc = this.renderCalculations();
        return <div className={classes.calc_details}>
            <div>
                <p>{t("Discounts")} : {round(calc._discount, 2)}</p>
                <p>{t("Sub Charges")}: {round(calc.service, 2)}</p>
                <p>{t("Tax")}:{round(calc.tax, 2)} </p>
            </div>
        </div>
    }

    renderBalanceDue = () => {
        const calc = this.renderCalculations();
        const { num_guest , t} = this.props
        if (num_guest > 0) {
            return `Balance Due / ${num_guest} : ${round(calc.balance_due, 2) / num_guest}`
        }
        return `${t("Balance Due")} : ${round(calc.balance_due, 2)}`
    }

    renderRightDetails = () => {
        const{t} = this.props
        const calc = this.renderCalculations();
        return <div className={classes.total}>
            <p >{t("Total")} : <span>{round(calc.net_total, 2)}</span></p>
            <p >{this.renderBalanceDue()}</p>
        </div>
    }

    render() {
        return (
            <div className={classes.calc_container}>
                {this.renderLeftDetails()}
                {this.renderRightDetails()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    // payments: state.orders__payment.data,
    get orderItem() { return this.order.item },
    orderDetails: get(state.orders__details, 'data', {})
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Calculation)))
