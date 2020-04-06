import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get,map,isEmpty} from 'lodash'
import applyFilters from "helpers/functions/filters";

class Summary extends Component {
 
 getSummary =()=>{
       
     const { cart,name } = this.props;
console.log(cart,name)
        const unit = applyFilters({
            key: "Find",
            path: "dropdowns__units_of_measure",
            params: {
              id: cart.sales_unit
            }
          });
          console.log(unit)
        return (
           unit&&<div className={classes.summary}>
               <p> {name} - {unit.name}</p>
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
    cart:get(state.cart,'data',{})
  
  
  });
export default connect(mapStateToProps,mapDispatchToProps)(Summary);

