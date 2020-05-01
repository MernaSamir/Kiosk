import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, min,map } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../../assets/images/eatIn.png";
import classes from "./style.less";

class MainItems extends Component {
  
  selectItem = item => {
     const {history,setMain}=this.props;
     setMain("items__sales_items", { active: item.id });
     history.push("/details");
  };

  renderItems = () => {
    const { category } = this.props;
    const items = applyFilters({
      key: "Filter",
      path: "items__sales_items",
      params: {
        base_sales_cat: category
      },
      then: {
        key: "Reject",
        params: {
          active: false
        }
      }
    });

    return items.map((d, v) => {
      return (
        <button className={classes.item} onClick={() => this.selectItem(d)}>
          <img src={Table} className={classes.image} />
          <div className={classes.title}>{d.name}</div>
          <div className={classes.price}>from EGP {this.getPrice(d.id)}</div>
        </button>
      );
    });
  };

  getPrice(item) {
    const list = applyFilters({
      key: "List",
      path: "items__prices",
      select: {
        sales_item: item
      },
      then: {
        key: "Reject",
        params: {
          active: false
        }
    }
    });

    const price = [];
    list.map(d => price.push(d.price));

    return min(price);
  }

  render() {
    return this.props.category ? (
      <div className={classes.container}>{this.renderItems()}</div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = state => ({
  category: get(state.items__base_sales_cat, "active", undefined),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainItems);
