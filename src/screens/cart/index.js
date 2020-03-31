import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual } from "lodash";
import { connect } from "react-redux";

class Cart extends Component {
  renderOrders() {
    const { carts } = this.props;
    if (isEmpty(carts)) return <div></div>;
    return map(carts, (key, value) => {
      //edit and cancel icons
      //number of ordered item
      //ordered item
      //show-detail icon
      //price
    });
  }
  render() {
    const { carts, currentMode } = this.props;
    console.log("current mode", currentMode);
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          My cart - {isEqual(currentMode, "Dine In") ? "Eat in" : currentMode}
        </div>
        <div className={classes.empty}>
          {isEmpty(carts) ? "Your cart is empty" : ""}
        </div>
        {this.renderOrders()}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  cart: get(state, "cart", {}),
  currentMode: get(
    state.settings__mode.data,
    get(state, "settings__mode.active", ""),
    ""
  ).name
});
export default connect(mapStateToProps)(Cart);
