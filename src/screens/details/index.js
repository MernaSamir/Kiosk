import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, min } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../assets/images/2924_27020938.png";
import classes from "./style.less";

class Details extends Component {
  renderPrices(item) {
    const list = applyFilters({
      key: "List",
      path: "items__prices",
      select: {
        sales_item: item.id
      },
      then: {
        key: "Reject",
        params: {
          active: false
        }
      }
    });

    return list.map(d => {
      let unit = applyFilters({
        key: "Find",
        path: "dropdowns__units_of_measure",
        params: {
          id: d.sales_unit
        }
      });
      return (
        <div className={classes.priceContainer}>
          <div className={classes.size}>{unit.name}</div>
          <div className={classes.price}>EGP {d.price}</div>
        </div>
      );
    });
  }
  render() {
    const { item } = this.props;

    return item ? (
      <div>
        <div className={classes.container}>
          <div className={classes.title}>{item.name}</div>
          <img src={Table} className={classes.image} />
          <div className={classes.description}>
            Item description from data base
          </div>
          <div className={classes.select}>Select Size</div>
          <div className={classes.prices}>{this.renderPrices(item)}</div>
        </div>
        <div className={classes.btnContainer}>
          <button className={classes.back}>Back</button>
          <button className={classes.next}>Next - Extras</button>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = state => ({
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
