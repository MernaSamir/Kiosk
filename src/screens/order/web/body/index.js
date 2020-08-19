import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, min, map , isNull } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../../../assets/images/eatIn.png";
import classes from "./style.less";
import ShowImage from 'components/show/image'

class MainItems extends Component {

  // selectItem = item => {
  //    const {history,setMain}=this.props;
  //    setMain("items__sales_items", { active: item.id });
  //    history.push("/details");
  // };
  renderItems = () => {
    const { items, selectItem, getPrice } = this.props;
    console.log(items, "gwaaaaAAAAAAAAAAAAAAA")
    // const items = applyFilters({
    //   key: "Filter",
    //   path: "items__sales_items",
    //   params: {
    //     base_sales_cat: category
    //   },
    //   then: {
    //     key: "Reject",
    //     params: {
    //       active: false
    //     }
    //   }
    // });

    return map(items, (d, v) => {
      console.log(d,"sssddd")
      return (
        <button className={classes.item} onClick={() => selectItem(d)}>
          { d.photo_path&& <ShowImage src={d.photo_path} />}
          <div className={classes.title}>{d.name}</div>
          <div className={classes.price}>from EGP {getPrice(d.id)}</div>
        </button>
      );
    });
  };

  // getPrice(item) {
  //   const list = applyFilters({
  //     key: "List",
  //     path: "items__prices",
  //     select: {

  //       sales_item: item
  //     },
  //     then: {
  //       key: "Reject",
  //       params: {
  //         active: false
  //       }
  //   }
  //   });

  //   const price = [];
  //   list.map(d => price.push(d.price));

  //   return min(price);
  // }

  render() {
    return this.props.category ? (
      <div className={classes.container}>{this.renderItems()}</div>) : (
        <></>
      );
  }
}
// const mapStateToProps = state => ({
//   category: get(state.items__base_sales_cat, "active", undefined),
// });

export default connect(null, mapDispatchToProps)(MainItems);
