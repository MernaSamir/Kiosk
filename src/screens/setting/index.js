import React, { Component } from "react";
import Image from "assets/images/logo.png";
import ButtonData from "./json";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'


class Setting extends Component {
  state = {
    active :'EN'
  }
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
  setLanguage=(lang)=>{
    const {setMain}= this.props
     this.setState({
       active: lang
     })

     setMain("dropdowns__lang",{active: lang||'EN'})
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
    const {active}= this.state
    const {lang}= this.props


    return (
      <div className={classes.body}>
        <div className={classes.flexContainer}>
            <div className={classes.space}></div>
          <div className={classes.flexbox}>{this.renderButon()}</div>
        </div>
        <p className={classes.Text}>Select Language</p>
        <div className={classes.buttonContainer}>
          <button id = 'EN'
           className={`${classes.button} ${lang == 'EN' && classes.active}` } 
           onClick={()=>this.setLanguage('EN')}>English</button>
          <button className={`${classes.button} ${lang == 'AR' && classes.active}` } 
          onClick={()=>this.setLanguage('AR')}>العربية</button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => ({
  lang: state.dropdowns__lang.active,

})
export default connect(mapStateToProps,mapDispatchToProps)(Setting);
