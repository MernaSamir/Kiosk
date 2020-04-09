import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, map } from "lodash";
import { connect } from "react-redux";
import Edit from "../../assets/images/edit.png";

class Cart extends Component {
  goPay() {
    const { history } = this.props;
    history.push("/payment");
  }

  renderOrders() {
    const { cart } = this.props;
    console.log(cart);
    return (
      <div>
        <div className={classes.chargesHeader}>
          <div className={classes.chargesTotal}>
            <div>Total</div>
            <div>EGP</div>
          </div>
          <div className={classes.chargesEach}>
            <div>Each</div>
            <div>EGP</div>
          </div>
        </div>
        {map(cart, (d, v) => {
          return (
            <div className={classes.cart}>
              <button className={classes.miniBtn}>
                <img src={Edit} className={classes.editImg} />
              </button>
              <button className={classes.miniBtn}>X</button>
              <button className={classes.qtn}>{d.qtn}</button>
              {d.name} - {d.unit}
              <button className={classes.showMore}>V</button>
              <div className={classes.each}>{d.price}</div>
              <div className={classes.total}>{d.qtn * d.price}</div>
            </div>
          );
        })}
        {this.renderCharges()}
      </div>
    );
  }

  renderCharges() {
    return (
      <div className={classes.footer}>
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
    console.log(cart);
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
