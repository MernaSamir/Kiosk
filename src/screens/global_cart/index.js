import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, get, isEqual } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';
import Content from './content'
import mapDispatchToProps from 'helpers/actions/main'

class GlobalCart extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    const su = !isEqual(this.props.CartStatus, nextProps.CartStatus);

    return su
  }
  goBack = () => {
    const { history, setMain } = this.props;

  }
  openCart = () => {

    const { CartStatus, setMain } = this.props
    console.log("wlaaaaa honaaa", CartStatus)

    setMain('form_actions', { CartStatus: !CartStatus })

  }

  checkOut = () => {
    console.log('daaaas')
  }
  render() {
    const { element, t, mode, CartStatus , details} = this.props
    console.log(CartStatus, "carcarcaaat")
    const collapseStyle = CartStatus == false ? classes.closed : classes.open

    return (
      <div className={`${classes.header} ${collapseStyle}`} >
        <div onClick={this.openCart}>
        <p >{t(mode)}</p>
        <FontAwesomeIcon className={classes.icon} icon='shopping-cart' />
        </div>
        {CartStatus == true ?
          <>
            <Content  details={details}/>
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
  details: get(state.form_actions,'details',{})
})


const wrapper = connect(mapStateToProps, mapDispatchToProps, null)(withTranslation()(GlobalCart))
export default withRouter(wrapper)
