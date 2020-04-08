import React, { Component } from "react";
import Image from "assets/images/logo.png";
import classes from "./style.less";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get } from "lodash";
import applyFilters from "helpers/functions/filters";

class Quantity extends Component {
  handelClick = (action) => {
    const { setMain, cart } = this.props;

    if (action === "-") {
      setMain("cart", { data: { ...cart, qtn: cart.qtn - 1 } });
    } else {
      setMain("cart", { data: { ...cart, qtn: cart.qtn + 1 } });
    }
    console.log("dsdkj");
  };
  render() {
    const { cart, item } = this.props;
    const { qtn, price } = cart;
    const unit = applyFilters({
      key: "Find",
      path: "dropdowns__units_of_measure",
      params: {
        id: cart.sales_unit,
      },
    });

    return unit ? (
      <div className={classes.container}>
        <div className={classes.item}>
          {item.name} - {unit.name}
        </div>

        <div className={classes.priceHeader}>
          <div className={classes.header}>Each</div>
          <div className={classes.header}> Total</div>
          <div className={classes.header}>EGP</div>
          <div className={classes.header}> EGP</div>
          <div className={classes.header}>{price}</div>
          <div className={classes.header}> {price * qtn}</div>
        </div>
        <div className={classes.left}>
          {qtn} x {item.name} {unit.name}
        </div>
        <div className={classes.itemTotal}>
          Item total ({qtn})
          <div className={classes.totalPrice}>{price * qtn}</div>
        </div>
        <div className={classes.incrementer}>
          <button
            className={classes.minus}
            onClick={() => this.handelClick("-")}
          >
            -
          </button>
          <div className={classes.qantity}>{cart.qtn}</div>
          <button
            className={classes.plus}
            onClick={() => this.handelClick("+")}
          >
            +
          </button>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: get(state.cart, "data", {}),
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  ),
});
export default connect(mapStateToProps, mapDispatchToProps)(Quantity);
