import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash';
import applyFilters from "helpers/functions/filters";

class Quantity extends Component {

    handelClick =(action)=>{
        const {setMain,cart}=this.props
        
        if(action==='-'){
            setMain('cart',{data:{...cart,qtn:cart.qtn-1}})
        }
        else{
            setMain('cart',{data:{...cart,qtn:cart.qtn+1}})

        }
      console.log("dsdkj")
   }
    render() {
        const {cart,item}=this.props;
        const{qtn,price}=cart
        const unit = applyFilters({
            key: "Find",
            path: "dropdowns__units_of_measure",
            params: {
                id: cart.sales_unit
            }
        });
        
       
        return (
           unit?<div>
               <div>
                   {item.name} {unit.name}
               </div>

               <div>
                   {qtn} x {item.name} {unit.name}
               </div>
                <div>
                    Each EGP {price}
                </div>
                <div>
                    Total EGP {price*qtn}
                </div>
                <div>
                    Item total ({qtn}) {price*qtn} 
                </div>
               <button onClick={()=>this.handelClick('-')}>-</button>
               {cart.qtn}
               <button onClick={()=>this.handelClick('+')}>+</button>
           </div>
           :<></>
        )
    }
}
const mapStateToProps = state => ({
    cart:get(state.cart,'data',{}),
    item: get(
        state.items__sales_items.data,
        get(state.items__sales_items, "active", undefined),
        undefined
      ),
 

  });
export default connect(mapStateToProps,mapDispatchToProps)(Quantity);

