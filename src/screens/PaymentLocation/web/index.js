
import React, { Component } from "react";
import classes from "./style.less";
import ButtonData from "./buttons";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import applyFilters from "helpers/functions/filters";
import uuid from 'uuid/v4'
import { get, range } from 'lodash'
class Payment extends Component {
  setLocation = (location) => {
  };
  goBack = () => {
    const { history } = this.props;
    history.push("/cart");
  };
  renderButon = () => {
    console.log("hnaaaaaaaaaaaaaaa")
    return ButtonData.map((d, v) => {
      console.log("ooooooo", d)
      return (
        <button
          key={v}
          className={classes.btn}
          onClick={() => this.setLocation(d.PaymentLocation)}
        >
          <p className={classes.title}>{d.title}</p>
          <img src={d.icon} className={classes.pic} />
        </button>
      );
    });
  };
  render() {
    return (
      <div className={classes.contAll}>
        {/* <p className={classes.Text}>Please Select Payment Method</p> */}
        <div className={classes.flexbox}>
          <div>{this.renderButon()}</div>
            <button className={classes.counter}><p>Pay at Counter</p></button>
          </div>
          <div className={classes.buttonContainer}>
            <button className={classes.button} onClick={() => this.goBack()}>
              Back
          </button>
            <button className={classes.button} onClick={this.handelClick}>Pay</button>
          </div>
        </div>
    );
  }
}
const mapStateToProps=state=>({
          orderData: get(state.orders__main, state.orders__main.active, {}),

})
export default connect(mapStateToProps,mapDispatchToProps)(Payment);
