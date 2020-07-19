import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';

class Content extends Component {
  goBack = () => {
    const { history, setMain } = this.props;
    
}
openCart = () => {

  const {CartStatus, setMain} = this.props
  console.log("wlaaaaa honaaa", CartStatus)

    setMain('form_actions', {CartStatus: !CartStatus})
  
}

checkOut =()=>{
  console.log('daaaas')
}
  render() {
    const { element, t,mode ,CartStatus} = this.props
    console.log(CartStatus,"carcarcaaat")
    const collapseStyle =  CartStatus==false ? classes.closed : classes.open
    
    return (
      <div className={`${classes.header} ${collapseStyle}` } onClick={this.openCart}>
               <p >{t(mode)}</p>
          <FontAwesomeIcon className={classes.icon} icon='shopping-cart' />
       {CartStatus==true?
       <div className={classes.btnContainer}>
       <button type='button' >Back</button>
       <button type='button' onClick={this.checkOut} >Checkout</button></div>:<></>}
      </div>
    )
  }
}


const wrapper = withTranslation()(Content)
export default withRouter(wrapper)
