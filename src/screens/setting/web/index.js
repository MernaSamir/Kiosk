import React, { Component } from "react";
import Image from "assets/images/logo.png";
import ButtonData from "../json";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import SettingWrap from "helpers/wrap/screens_wraps/setting"

import Loading from "helpers/components/loading";

class Setting extends Component {
  constructor(props) {
    super(props);
    console.log(props.mode,"mooooooooo")
     this.sub_modes = applyFilters({
      key: 'Filter',
      path: 'settings__sub_mode',
      params: {
          mode:props.mode
      }
  })
  console.log(this.sub_modes)
}
  renderButon = () => {
    const {setMode,mode, sub_modes}= this.props


    return sub_modes.map((d, v) => {
      return (
        <button key={v} className={classes.btn} onClick={()=>setMode(d)}>
          <p className={classes.title}>{d.name}</p>
          <img src={ButtonData[v].icon} className={classes.pic} />
        </button>
      );
    });
  };

  render() {
    const { mode}= this.props
    return (
    mode?   <div className={classes.flexContainer}>
          <p>Select Service Type</p>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>: <Loading />

    )
  }
}

export default SettingWrap(Setting);
