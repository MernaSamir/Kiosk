import React, { Component } from "react";
import classes from "./style.less";
import ButtonData from "./json";
import { connect } from "react-redux";

class Payment extends Component {
  setLocation = location => {
    console.log("payment location", location);
    //set payment location in redux
  };
  renderButon = () => {
    return ButtonData.map((d, v) => {
      return (
        <button
          key={v}
          className={classes.btn}
          onClick={() => this.setLocation(d.PaymentLocation)}
        >
          <div className={classes.title}>{d.title}</div>
          <img src={d.icon} className={classes.pic} />
        </button>
      );
    });
  };

  renderCharges = () => {
    return (
      <div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Sub-total</div>
          <div className={classes.subCharges}>EGP Sub</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Service Charges</div>
          <div className={classes.subCharges}>EGP Service</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Taxes</div>
          <div className={classes.subCharges}>EGP Taxes</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.totalHeader}>Grand Total</div>
          <div className={classes.totalCharge}>EGP Total</div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div>
        <p className={classes.Text}>Please Select Payment Method</p>
        <div>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
        {this.renderCharges()}
        <div className={classes.buttonContainer}>
          <button className={classes.button}>Back</button>
          <button className={classes.button}>Payment</button>
        </div>
      </div>
    );
  }
}
export default Payment;