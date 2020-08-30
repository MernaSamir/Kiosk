import React, { Component } from "react";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'


class BeforeLogin extends Component {
yes=()=>{
  history.push
}
 
  renderButon = () => {
    return <>
        <button className={classes.btn} onClick={this.yes}>
          <p className={classes.title}>Yes</p>
        </button>
        <button  className={classes.btn} onClick>
          <p className={classes.title}>NO</p>
        </button>
        </>
      
  }

  render() {
    return (
        <div className={classes.flexContainer}>
          <p className={classes.p}>Would you like to earn points on this order?</p>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
    )
  }
}

export default BeforeLogin;
