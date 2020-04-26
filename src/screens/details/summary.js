import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get,map,isEmpty} from 'lodash'
import applyFilters from "helpers/functions/filters";
import Edit from "../../assets/images/edit.png";

class Summary extends Component {
 
 getSummary =()=>{
       
     const { cart } = this.props;
        return (
           !isEmpty(cart)&&<div className={classes.summary}>
              <button className={classes.miniBtn}>
                <img src={Edit} className={classes.editImg} />
                 </button>
               <p> {cart.name} - {cart.unit}</p>
               <p> {cart.price}</p>
               {!isEmpty(cart.item)&&<div className={classes.summary}>
                <button onClick={this.removeModifiers} className={classes.miniBtn}>
                  x
                 </button>
                 <button className={classes.miniBtn}>
                   {cart.item.base_qtn}
                 </button>
               <p> {cart.item.name} </p>
               <p> {cart.item.price}</p>

                 </div>}
            </div>
        )
   
}
removeModifiers =()=>{
  const {setMain,cart} =this.props
  setMain ('cart',{item:{...cart,item:{}}})
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

