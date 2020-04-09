import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual,map } from "lodash";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";

class Cart extends Component {

  renderOrders =() =>{
    const { carts } = this.props;
    if(isEmpty(carts)){
      return(
        <div className={classes.empty}>
         Your cart is empty
       </div>
      )
     }
    else {
      return map(carts,(d,v)=>{
        return (
        <div>
         {d.qtn} {d.name} -{d.unit} EGP{d.qtn*d.price}
        </div>
        )
      })
    }
  }
  handelCheckOut=()=>{
    const {history}=this.props;
    console.log(this.props )
    history.push("/cart");
  }
  render() {
    const { carts, currentMode } = this.props;
    console.log("current mode", currentMode);
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          My cart - {isEqual(currentMode, "Dine In") ? "Eat in" : currentMode}
        </div>
        <div>
          {this.renderOrders()}
        </div>
        {!isEmpty(carts)&&<div>
          <button onClick={this.handelCheckOut}>Checkout</button>
          <button>Cancel</button>
        </div>}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  carts: get(state.cart, "data", {}),
  currentMode: get(
    state.settings__mode.data,
    get(state, "settings__mode.active", ""),
    ""
  ).name
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
