import React, { Component } from 'react'
import { round} from 'lodash'
import Printing from './printing'
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'
import classes from './style.less'

class Footer extends Component {
   
    calculateBill() {
        const {seat, order, receipt={} } = this.props;
        
        const calc = applyFilters({
            key: 'Filter',
            path:'orders__details',
            params:{
                order: order.id
            },
            then:{

                key: 'Reject',
                params:{
                    deleted:true
                },
                then:{
                    key: 'calculateReceipts',
                }
            }
        },undefined, undefined, { seatsNum: [seat], type: 'receipt', receipt} )
        return calc[0]
    }

    calculations=()=>{
        const calc = this.calculateBill();
        const {t} = this.props
        return <div className={classes.calculations}>
                    <div className={classes.calc_details}>
                        <div><p>{t('Sub Total')}: {round(calc.sub_total, 2)}</p>
                            <p>{t('Discounts')} : {round(calc._discount, 2)}</p>
                        </div>

                        <div> <p>{t('Charges')}: {round(calc.service, 2)}</p>
                            <p>{t('Tax')}: {round(calc.tax, 2)}</p></div>
                        </div>
                    <div className={classes.total}>
                        <p >
                            {t('Total')} : <span>{round(calc.net_total, 2)}</span>
                        </p>
                        <p >
                            {t('Balane Due')} : <span>{round(calc.balance_due, 2)}</span>
                        </p>
                    </div>
                </div>
    }
    render() {
        const {seat, order, setAll, receipt} = this.props
        
        return (
            <div className={classes.footer}>
            {this.calculations()}
            <Printing seat_num= {seat} order={order} setAll={setAll} receipt={receipt}/>
            </div>
        )
    }
}

const mapStateToProps =(state)=>({
    details: state.orders__details.data,
    recepts: state.orders__receipt_items.data
})

export default withTranslation()(connect(mapStateToProps)(Footer) )