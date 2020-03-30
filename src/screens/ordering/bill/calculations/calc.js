import React, { Component } from "react";
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import { withRouter } from 'react-router-dom';
import applyFilters from "helpers/functions/filters";
import EndOrder from 'helpers/components/actions/end_order';
import { round, get, isEmpty, isNaN } from "lodash";
import classes from './style.less'

class BillCalculations extends Component {

    renderNewPrice = (price) => {
        const { currency = {} } = this.props
        // console.log(currency)
        const ratio = applyFilters({
            key: 'Find',
            path: 'dropdowns__currencies_conversions',
            params: {
                _from: get(currency, 'id', {})
            }
        })
        return round((price / get(ratio, 'ratio', 1)), 2)
    }

    checkCurrency = () => {
        const { currency, t } = this.props
        if (!isEmpty(currency)) {
            return t(currency.symbol)
        }
        return t('EG£')
    }

    renderDefault = () => {
        const { currency = {}, calc = {}, t } = this.props
        const base = applyFilters({
            key: 'Find',
            path: 'dropdowns__currencies',
            params: {
                is_base_currency: true
            }
        }) || {}
        if (currency.id != base.id) {
            return <p>{`${t('Default')}:`} {`${calc.balance_due} ${base.symbol}`}</p>
        }
    }

    checkMinChar = (min_charge) => {
        const { t } = this.props
        if (!isNaN(min_charge)) {
            return <p>{`${t('Min. Charge')}:`} {this.renderNewPrice(round(min_charge, 2))}</p>
        }
        return <></>
    }

    render() {
        const { calc = {}, t } = this.props;
        return (
            <EndOrder calc={calc}>
                <div className={classes.calc_details}>
                    <div><p>{`${t('Sub Total')}:`} {this.renderNewPrice(round(calc.sub_total, 2))}</p>
                        <p>{`${t('Discounts')} :`} {this.renderNewPrice(round(calc.discount, 2))}</p>
                    </div>

                    <div>
                        {this.checkMinChar(calc.min_charge)}
                        <p>{`${t('Charges')}:`} {this.renderNewPrice(round(calc.service, 2))}</p>
                        <p>{`${t('VAT')} : `}{this.renderNewPrice(round(calc.tax, 2))} </p></div>
                </div>
                <div className={classes.total}>
                    <p >
                        {`${t('Total')} :`} <span>{`${this.renderNewPrice(round(calc.net_total, 2))} ${this.checkCurrency()}`}</span>
                    </p>
                    <p>{`${t('Balance Due')} :`} {`${this.renderNewPrice(round(calc.balance_due, 2))} ${this.checkCurrency()}`}</p>
                    {this.renderDefault()}
                </div>
            </EndOrder>
        );
    }
}

const mapStateToProps = (state, props) => ({
    currency: get(state.dropdowns__currencies.data, state.dropdowns__currencies.active, ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BillCalculations))