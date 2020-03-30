import React, { Component } from 'react'
import classes from './style.less'
import { get } from 'lodash';
export default class componentName extends Component {
  render() {
    const {shape, label, className, onClick} = this.props
    return (
      <div className={classes.flexCol} onClick={onClick.bind(this,shape)}>
       <div >
       <div className= {` ${get(classes,shape)} ${className}`}></div>
       </div>
        <label>{label}</label>
      </div>
    )
  }
}
