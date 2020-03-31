import React, { Component } from "react";
import Image from "assets/images/logo.png";
import Cart from "../cart";
class Order extends Component {
  //    hna hnadi 3la 3 component
  //    #1 left side
  //    #2 body
  //    #3 cart
  render() {
    return (
      <div>
        order
        <Cart />
      </div>
    );
  }
}
export default Order;
