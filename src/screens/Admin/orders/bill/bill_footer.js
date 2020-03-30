import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux'
import { get, round } from 'lodash';
import applyFilters from 'helpers/functions/filters';

class BillFooter extends Component {
    getPayments = () =>{
        const { receipt } = this.props
        const payments = applyFilters({
            key: 'Filter',
            path: "orders__payment",
            params: {
                receipt: receipt.id,
            },
        })
        const paymentTypes = applyFilters({
            path: 'payment__types',
        })

        return payments.map((d,idx)=>(
            <span key={idx}>{get(paymentTypes,d.payment_type,'').name} : {d.value} <>  </></span> 
           
        ))

    }
    render() {
        const { receipt, t } = this.props
        return (
            <div className={classes.calculations}>
                <div className={classes.calc_details}>
                    <div><p>{t('Sub Total')}: {round(get(receipt,'sub_total'), 2)}</p>
                        <p>{t('Discounts')} : {round(get(receipt,'_discount'), 2)}</p>
                    </div>

                    <div> <p>{t('Charges')}: {round(get(receipt,'service'),2)}</p>
                        <p>{t('Tax')}:{round(get(receipt,'tax'),2)} </p></div>
                    </div>
                <div className={classes.total}>
                    <p >
                        {t('Total')} : <span>{round(get(receipt,'net_total'), 2)}</span>
                    </p>
                    <p >
                          {this.getPayments()}
                    </p>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>({
    receipt: get(state.orders__receipt.data,state.orders__receipt.active, {})
})
export default connect (mapStateToProps)(BillFooter)