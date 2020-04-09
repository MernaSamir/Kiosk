import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual } from "lodash";
import { connect } from "react-redux";

class Cart extends Component {
  goPay() {
    const { history } = this.props;
    history.push("/payment");
  }

  renderOrders() {
    const { cart } = this.props;
    console.log(cart)
    return (
      <div>
        <div className={classes.chargesHeader}>
          <div className={classes.chargesEach}>
            <div>Each</div>
            <div>EGP</div>
          </div>
          <div className={classes.chargesTotal}>
            <div>Total</div>
            <div>EGP</div>
          </div>
        </div>
        {/* {map(carts, (key, value) => {
          //edit and delete icons
          //number of ordered item
          //ordered item
          //show-detail icon
          //price for each
          //price for total
          //Each having: order details
        })} */}
        {this.renderCharges()}
      </div>
    );
  }

  renderCharges() {
    return (
      <div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Sub-total</div>
          <div className={classes.subCharges}>EGP Sub</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Service Charges</div>
          <div className={classes.subCharges}>EGP Service</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Taxes</div>
          <div className={classes.subCharges}>EGP Taxes</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.totalHeader}>Grand Total</div>
          <div className={classes.totalCharge}>EGP Total</div>
        </div>
      </div>
    );
  }
  renderButtons() {
    return (
      <div className={classes.btnContainer}>
        <button className={classes.back}>Back</button>
        <button className={classes.next} onClick={() => this.goPay()}>
          Payment
        </button>
      </div>
    );
  }
  render() {
    const { cart } = this.props;
    console.log(cart)
    return (
      <div>
        <div className={classes.header}>My cart</div>
        {/* <div className={classes.empty}>
          {isEmpty(cart) && "Your cart is empty"}
        </div> */}
        {this.renderOrders()}
        {this.renderButtons()}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: get(state.cart, "data", {}),
});
export default connect(mapStateToProps)(Cart);
