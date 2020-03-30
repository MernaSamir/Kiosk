import React, { Component } from "react";
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from "helpers/functions/filters";
import { withTranslation } from 'react-i18next';
import Calculations from './calc';
import FastCash from './fast_cash';
// import Feedback from './buttons/feedback'
import Campaign from './buttons/campaign'
import BillFooter from '../footer';
import { range, get } from "lodash";
import classes from './style.less'

class BillCalculations extends Component {

  constructor(props) {
    super(props)
    this.selectReceipt()
  }

  componentWillUnmount() {
    const { setMain } = this.props;
    setMain('orders__receipt', { active: '' })
  }

  selectReceipt = (data) => {
    const { order, setMain } = this.props;
    const rec = applyFilters({
      key: 'Find',
      path: 'orders__receipts',
      params: {
        order
      }
    })
    if (rec) {
      setMain("orders__receipt", { active: rec.id })
    }
  }

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
      seatsNum: range(0, (orderData.guests_num + 1))
    })
    return this.calc;
  }

  renderCampaign =(calc)=>{
    const {order} = this.props
    const details = applyFilters({
      key:'Filter', 
      path:'orders__details',
      params:{
        order,
        gift: true
      }
    })
    if(details.length - calc.gifts.length){

      return <Campaign calc={calc} />
    }
  }
  
  render() {
    const calc = this.calculateBill();
  
    const { mode, order, t, currency, } = this.props;
    
    return (
      <>
        <div className={classes.calculations}>
          <FastCash calc={calc} t={t} />
          <div className={classes.icons}>
          {/* <Feedback/> */}
          {this.renderCampaign(calc)}
          </div>
          <Calculations calc={calc} mode={mode} order={order} t={t} currency={currency} />
        </div>
        <BillFooter calc={calc} t={t} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  mode: get(state.settings__mode.data, state.settings__mode.active, {}),
  order: state.orders__main.active,
  payments: state.orders__payment.data,
  active_receipt: state.orders__receipt.item,
  discounts: state.orders__orders_discount.data,
  orderData: get(state.orders__main.data, state.orders__main.active, {}),
  details: state.orders__details.data,
  // currency: get(state.dropdowns__currencies.data, state.dropdowns__currencies.active, ''),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BillCalculations));
