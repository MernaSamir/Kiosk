import React, { Component } from "react";
import Image from "assets/images/logo.png";
import classes from "./style.less";

class Final extends Component {
  render() {
    return (
      <div>
        <div className={classes.textContainer}>
          <div className={classes.Text}>Thank You</div>
          <div className={classes.Text}>Take your turn</div>
        </div>
        <div className={classes.turnContainer}>
          <div className={classes.Turn}>1539</div>
          <div className={classes.Pink}></div>
          <div className={classes.Purple}></div>
        </div>
        <div className={classes.bonAppetit}> Bon Appetit</div>
      </div>
    );
  }
}
export default Final;
