
import React, { Component } from 'react'
import {connect} from 'react-redux';
import {get} from 'lodash' 
import i18next from "i18next";
import translateWrap from './wrap'
class Translate extends Component {
  render() {
    if(this.props.translate){
      i18next.addResourceBundle('en', "translation", this.props.translate, true, true)
      i18next.changeLanguage('en')
    }
    return (
      <>
        
      </>
    )
  }
}
export default translateWrap(connect((state)=>({
  translate: get(state, 'lang.translate', '')
}))(Translate))