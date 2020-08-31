import React, { Component } from "react";
import classes from "./style.less";
import Cart from "screens/global_cart";
import Category from "./category";
import Body from "./body";
import HomeWrap from "helpers/wrap/screens_wraps/order"

class Order extends Component {
  //    hna hnadi 3la 3 component
  //    #1 left side
  //    #2 body
  //    #3 cart
  render() {
    const { history , selectItem, items, getPrice, category, sub_cat, selectItemC } = this.props;
    console.log()
    return (
        <div className={classes.contAll}>
            <Category  category = {category} sub_cat={sub_cat} selectItemC={selectItemC}/>
            <Body history={history} selectItem={selectItem}
             items={items} getPrice={getPrice}
             category = {category}
             />

        <Cart history={history} />
      </div>
    );
  }
}
export default HomeWrap(Order);
