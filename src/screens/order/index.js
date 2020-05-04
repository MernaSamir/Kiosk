import React, { Component } from "react";
import classes from "./style.less";
import Cart from "./cart";
import Category from "./category";
import Body from "./body";
class Order extends Component {
  //    hna hnadi 3la 3 component
  //    #1 left side
  //    #2 body
  //    #3 cart
  render() {
    const { history } = this.props;
    return (
        <div className={classes.contAll}>
          <div className={classes.cat}>
            <Category />
            {/* <div className={classes.item}> */}
            <Body history={history} />
          {/* </div> */}
          </div>
        {/* </div> */}
        <Cart history={history} />
      </div>
    );
  }
}
export default Order;
