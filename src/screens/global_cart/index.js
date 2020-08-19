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

class GlobalCart extends Component {
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
  }
  onClose=()=>{
    const { CartStatus, setMain } = this.props
    setMain('form_actions', { CartStatus: false })

  }
  render() {
    const { element, t, mode, CartStatus , details, setMain, setAll} = this.props
    const collapseStyle = CartStatus == false ? classes.closed : classes.open

    return (
      <div className={`${classes.header} ${collapseStyle}`}>
        <div className={classes.above}>
          <div  onClick={this.openCart}>
        <p className={classes.mode} >{t(mode)}</p>
        <FontAwesomeIcon className={classes.icon} icon='shopping-cart' />
        </div>
        {CartStatus == true &&<button className={classes.icon} type='button' onClick={this.onClose}>X</button>}
        </div>
        
        {CartStatus == true ?
          <>
            <Collapse  details={details} />
            <div className={classes.btnContainer}>
              <button type='button' >Back</button>
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
  mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions,'details',{}),
  data : state.form_actions
})


const wrapper = connect(mapStateToProps, mapDispatchToProps, null)(withTranslation()(GlobalCart))
export default withRouter(wrapper)
