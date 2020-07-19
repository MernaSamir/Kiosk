import React, { Component } from "react";
import Image from "assets/images/logo.png";
import ButtonData from "../json";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import SettingWrap from "helpers/wrap/screens_wraps/setting"


class Setting extends Component {

  // handelstart = () => {
  //   const { history } = this.props;
  //   history.push("/home");
  // };

  // setMode=(name)=>{
  //     const {setMain,history}=this.props
  //     history.push('/home')
  //     const mode = applyFilters({
  //       key: 'Find',
  //       path: 'settings__mode.data',
  //       params: {
  //         name: name
  //       }
  //   })
  //   if(mode){
        
  //       setMain('settings__mode',{'active':mode.id})
  //   }
  // }
  // setLanguage=(lang)=>{
  //   const {setMain}= this.props
  //    this.setState({
  //      active: lang
  //    })

  //    setMain("dropdowns__lang",{active: lang||'EN'})
  // }
  renderButon = () => {
    const {setMode}= this.props
    return ButtonData.map((d, v) => {
      return (
        <button key={v} className={classes.btn} onClick={()=>setMode(d.mode)}>
          <div className={classes.title}>{d.title}</div>
          <img src={d.icon} className={classes.pic} />
        </button>
      );
    });
  };

  render() {
    const { renderButon}= this.props


    return (
        <div className={classes.flexContainer}>
          <p>Select Service Type</p>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
    )
  }
}

export default SettingWrap(Setting);
