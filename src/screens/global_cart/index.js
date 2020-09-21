import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, get, isEqual, pick } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';
import Collapse from './nested_collapse/collapse'
import mapDispatchToProps from 'helpers/actions/main'
import uuid from 'uuid/v4'

class GlobalCart extends Component {
  getCalculations = () => {

    const { history, setMain, station, shift, mode, details } = this.props;
    const order_id = uuid()
    // this.handelDetails(order_id)
    const sub_mod = applyFilters({
      key: 'Find',
      path: 'settings__sub_mode',
      params: {
        mode: mode
      }
    })
    const calc = applyFilters({
      key: 'calculateOrderReceipt',
      order: {
        id: order_id,
        station: station,
        shift: shift,
        mode: mode,
        sub_mode: sub_mod.id,
        _type: "loc",
        start_time: new Date(),
      }
    }, details)
    // console.log(calc, 'cccccccccccc')

    // setMain('total_order', { data: calc })
    return <>
      <p>{`Sub-total   ${calc.sub_total}`}</p>
      <p>{`Service Charges   ${calc.service}`}</p>
      <p>{`VAT   ${calc.tax}`}</p>
      <p>{`Grand Total   ${calc.total}`}</p>
    </>
  }
    // shouldComponentUpdate(nextProps, nextState) {
    //     const compare = ['CartStatus']
    //     const su = !isEqual(pick(n0extProps, compare), pick(this.props, compare))
 
    //     return !isEqual({ state: nextState, props: nextProps }, { state: this.state, props: this.props })
    // }
  goBack = () => {
    const { history, setMain } = this.props;

  }
  openCart = () => {
    const { CartStatus, setMain } = this.props
    setMain('form_actions', { CartStatus: true })

  }

  checkOut = () => {
    const {details, appendPath, history}= this.props
    map(details,detail=>{
      appendPath('form_actions', `details.${[detail.id]}`, {add:true})

     })
     history.push('./cart')
  }
  onClose=()=>{
    const { CartStatus, setMain } = this.props
    setMain('form_actions', { CartStatus: false })

  }
  render() {
    const { element, t, sub_mode, CartStatus , details, setMain, setAll} = this.props
    const collapseStyle = CartStatus == false ? classes.closed : classes.open

    return (
      <div className={`${classes.header} ${collapseStyle}`}>
        <div className={classes.above}>
          <div  onClick={this.openCart}>
        <p className={classes.mode} >{t(sub_mode)}</p>
        <FontAwesomeIcon className={classes.icon} icon='shopping-cart' />
        </div>
        {CartStatus == true &&<button className={classes.icon} type='button' onClick={this.onClose}>
        <FontAwesomeIcon icon="times" />
          </button>}
        </div>
        
        {CartStatus == true ?
          <>
            <Collapse  details={details} />
            <div className={classes.between}>{this.getCalculations()}</div>
            <div className={classes.btnContainer}>
              <button type='button' >Cancel</button>
              <button type='button' onClick={this.checkOut} >Checkout</button></div>
          </>
          : <></>}
      </div>
    )
  }
}
// showContent = () => {
//   const {mode, CartStatus, setMain} = this.props

//     return <Content mode={mode} CartStatus={CartStatus} setMain={setMain}/>

// }


// render() {
//   const {homeApp, CartStatus, t} = this.props


//   return (

//         this.showContent()

//   )
// }
//}


const mapStateToProps = (state) => ({
  sub_mode: get(state, 'form_actions.mode', {}),
  mode:state.settings__mode.active,
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions,'details',{}),
  data : state.form_actions
})


const wrapper = connect(mapStateToProps, mapDispatchToProps, null)(withTranslation()(GlobalCart))
export default withRouter(wrapper)
