import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get,map,isEmpty} from 'lodash'
import applyFilters from "helpers/functions/filters";

class Summary extends Component {
 
 getSummary =()=>{
       
     const { cart } = this.props;
        return (
           !isEmpty(cart)&&<div className={classes.summary}>
               <p> {cart.name} - {cart.unit}</p>
               <p> {cart.price}</p>
            </div>
        )
   
}

    render() {
        const {cart}=this.props
        return (
            <div>
                <div className={classes.devContainer}>
                <div className={classes.head}>
                  summary
                  {cart&&<p>EGP</p>}
                </div>
                  {this.getSummary()}
                </div>
             </div>
        )
    }
}
const mapStateToProps = state => ({
    cart:get(state.cart,'item',{})
  
  
  });
export default connect(mapStateToProps,mapDispatchToProps)(Summary);
