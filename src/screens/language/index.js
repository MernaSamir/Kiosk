import React, { Component } from "react";
import Image from "assets/images/logo.png";
import classes from "./style.less";
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import SettingWrap from "helpers/wrap/screens_wraps/details"


class Setting extends Component {
  state = {
    active :'EN'
  }
  setLanguage=(lang)=>{
    
    const {setMain,history}= this.props

     this.setState({
       active: lang
     })
     history.push('./welcome')

     setMain("dropdowns__lang",{active: lang||'EN'})
  }

  render() {
    const {active}= this.state
    const {lang, renderButon}= this.props


    return (
      <div className={classes.body}>
        <p className={classes.Text}>Select Language</p>
        <div className={classes.buttonContainer}>
          <button id = 'EN' className={`${classes.button} ${active == 'EN' && classes.active}` } 
           onClick={()=>this.setLanguage('EN')}>English</button>
          <button className={`${classes.button} ${active == 'AR' && classes.active}` } 
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
