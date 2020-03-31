import React, { Component } from "react";
import Image from "assets/images/logo.png";
import ButtonData from "./json";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'


class Setting extends Component {
  handelstart = () => {
    const { history } = this.props;
    history.push("/home");
  };
  setMode=(name)=>{
      const {setMain,history}=this.props
      history.push('/home')
      const mode = applyFilters({
        key: 'Find',
        path: 'settings__mode.data',
        params: {
          name: name
        }
    })
    if(mode){
        
        setMain('settings__mode',{'active':mode.id})
    }
  }
  renderButon = () => {
    return ButtonData.map((d, v) => {
      return (
        <button key={v} className={classes.btn} onClick={()=>this.setMode(d.mode)}>
          <div className={classes.title}>{d.title}</div>
          <img src={d.icon} className={classes.pic} />
        </button>
      );
    });
  };

  render() {
    return (
      <div className={classes.body}>
        <div className={classes.flexContainer}>
            <div className={classes.space}></div>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
        <p className={classes.Text}>Select Language</p>
        <div className={classes.buttonContainer}>
          <button className={classes.button}>English</button>
          <button className={classes.button}>العربية</button>
        </div>
      </div>
    );
  }
}
export default connect(null,mapDispatchToProps)(Setting);
