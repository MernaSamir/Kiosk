import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, get } from 'lodash'
import { withTranslation } from 'react-i18next'
import mapDispatchToProps from 'helpers/actions/main'
import Nested from './nested_collapse/collapse'
import applyFilters from 'helpers/functions/filters'
import uuid from 'uuid/v4'

class Content extends Component {
  // getCalculations = () => {

  //   const { history, setMain, station, shift, mode, details } = this.props;
  //   const order_id = uuid()
  //   this.handelDetails(order_id)
  //   const sub_mod = applyFilters({
  //     key: 'Find',
  //     path: 'settings__sub_mode',
  //     params: {
  //       mode: mode
  //     }
  //   })
  //   // const calc = applyFilters({
  //   //   key: 'calculateOrderReceipt',
  //   //   order: {
  //   //     id: order_id,
  //   //     station: station,
  //   //     shift: shift,
  //   //     mode: mode,
  //   //     sub_mode: sub_mod.id,
  //   //     _type: "loc",
  //   //     start_time: new Date(),
  //   //   }
  //   // }, details)
  //   // console.log(calc)

  //   // setMain('total_order', { data: calc })
  //   return <div className={classes.calcu}>
  //     <p>{`Sub-total  ${0}`}</p>
  //     <p>Service Charges</p>
  //     <p>VAT</p>
  //     <p>Grand Total {' '}</p>
  //   </div>
  // }
  handelDetails = (order) => {
    const { details, appendPath } = this.props;
    map(details, (d, v) => {
      appendPath("form_actions", `details.${[d.id]}`, { order });

    })
  }
  // getCalculations = () => {
  //   const { details , station, location,mode} = this.props;

  //   const new_order={
  //     id:uuid(),
  //     station , 
  //     location,
  //     mode

  //   }
  //   const calc = applyFilters({
  //     key: 'calculateReceipts',
  //     path: 'orders__receipt',
  //   }, details, {order:new_order})
  //   console.log(calc,"ccccchhjgjhhk")
  //   let sum_all = 0
  //   map(details, (d) => {
  //     if (!d.removal)
  //       sum_all += (parseInt(d.quantity) * parseInt(d.price))
  //   })
  //   return <div className={classes.calcu}>
  //     <p>{`Sub-total  ${sum_all}`}</p>
  //     <p>Service Charges</p>
  //     <p>VAT</p>
  //     <p>Grand Total {' '}</p>

  //   </div>
  // }
  pay = () => {
    const { history } = this.props
    history.push('./payment')
  }
  renderOrders = () => {
    const { history, activeDetail , mode} = this.props;
    return (
      <div className={classes.allcon}>
        <div className={classes.above}>
          {/* <button onClick={history.goBack.bind(this)}>
            <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
          </button> */}
          <p className={classes.header}></p>
        </div>
        <div className={classes.itemTo}>
          <p >{mode}</p>
          <p>Each</p>
          <p>Total</p>
        </div>
        <Nested cart={true} />
        {/* {this.getCalculations()} */}
        <div className={classes.btnCont}>
          <button type='button' onClick={history.goBack.bind(this)}>Back</button>
          <button type='button' onClick={this.pay}>Pay</button>

        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderOrders()}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  // mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions, 'details', {}),
  data: state.form_actions,
  activeDetail: get(state.form_actions.details, state.form_actions.active),
  station: get(state.licensing__station, 'active'),
  mode: get(state, 'form_actions.mode', {}),
  location: get(state.licensing__location, 'active'),
  shift: get(state.orders__shifts, "active", undefined),



})
const wrapper = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Content))

export default withRouter(wrapper)
