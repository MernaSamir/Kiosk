import React, { Component } from "react";
import classes from "./style.less";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get } from "lodash";
import applyFilters from "helpers/functions/filters";

class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dis: false,
    };
  }
  handelClick = (action) => {
    const { setMain, cart } = this.props;

    if (action === "-") {
      setMain("cart", { item: { ...cart, qtn: cart.qtn - 1 } });
    } else {
      setMain("cart", { item: { ...cart, qtn: cart.qtn + 1 } });
    }
  };
  setButton = (qtn) => {
    if (qtn === 1) {
      return true;
    }
    return false;
  };
  add_cart = (data) => {
    const { appendPath, setMain, history } = this.props;
    appendPath("cart", `data.${[data.id]}`, data);
    setMain("cart", { item: {} });
    history.push("/order");
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
        <div className={classes.flex}>
          <div className={classes.itemInfo}>
            {qtn} x {item.name} {unit.name}
          </div>
          <div className={classes.each}>{price}</div>
          <div className={classes.total}> {price * qtn}</div>
        </div>
        <div className={classes.flexTotal}>
          <div className={classes.itemTotalInfo}>Item total ({qtn})</div>
          <div className={classes.each}>{price}</div>
          <div className={classes.total}> {price * qtn}</div>
        </div>
        <div className={classes.incrementer}>
          <button
            disabled={this.setButton(qtn)}
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
        <div className={classes.btnContainer}>
          <button className={classes.back}>Back</button>
          <button className={classes.next} onClick={() => this.add_cart(cart)}>
            Add to cart
          </button>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: get(state.cart, "item", {}),
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  ),
});
export default connect(mapStateToProps, mapDispatchToProps)(Quantity);
