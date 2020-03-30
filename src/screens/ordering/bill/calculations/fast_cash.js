import React, {Component} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from 'lodash'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters';
import {withRouter} from 'react-router-dom'
class FastCash extends Component {
    constructor(props){
        super(props);
        this.send = false;
        this.payment_type = get(this.getPaymentType(), 'id', '')
    }
    getPaymentType(){
        return applyFilters({
            key: "Find",
            path: "payment__types",
            params: { name: "Cash" }
        })
    }
    handelFastCash = () => {
        const { calc, order } = this.props;
        if(!this.send){
            this.send = true
            applyFilters({
                key: 'SavingReceipt',
                payment: {
                    order,
                    payment_type: this.payment_type,
                    paid: calc.balance_due
                }
            }, calc, undefined, { finish: this.afterPrint, paid_time: new Date(), print: true})
        }
    }

    closeOrder = (data) => {
    }
    afterPrint = ()=>{
        this.send = false
        // const { setMain } = this.props;
        // setMain("orders__main", { active: '' })
    }
    resetOrder = () => {
    }
    render() {
        const { mode, show , t} = this.props;
        const authorize = applyFilters({key: 'authorize', compare: ['fast_cash']})
        const ms = ['EV','DI','CT']
        if (show && !ms.includes(mode.key)){
            return (
                mode.key != 'DI' &&<button disabled={!authorize} className={classes.fastcash_btn} onClick={this.handelFastCash}>
                    <FontAwesomeIcon icon="bolt" className={classes.bolt_icon} />
                    <span>{t('Fast Cash')}</span>
                </button>
            )
        }
        return <div></div>
    }
}

const mapStateToProps = (state, props) => ({
    order: state.orders__main.active,
    receipt: state.orders__receipt.active,
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    show: !props.history.location.pathname.includes('payment')
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(FastCash));
