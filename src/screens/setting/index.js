import React, { Component } from "react";
import Image from "assets/images/logo.png";
import ButtonData from "./json";
import classes from "./style.less";

class Start extends Component {
  handelstart = () => {
    const { history } = this.props;
    history.push("/home");
  };
  renderButon = () => {
    return ButtonData.map((d, v) => {
      return (
        <button className={classes.settingButton}>
          <div>{d.title}</div>
          <img src={d.icon} className={classes.icon} />
        </button>
      );
    });
  };

  render() {
    return (
      <div className={classes.body}>
        <div className={classes.flexContainer}>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
        <p className={classes.selectLanguage}>Select Language</p>
        <div className={classes.selectFlexbox}>
          <button className={classes.english}>English</button>
          <button className={classes.arabic}>العربية</button>
        </div>
      </div>
    );
  }
}
export default Start;
