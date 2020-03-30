import React, { Component } from 'react'
import Form from './form'
import classes from './style.less'
class CustomMix extends Component {
  
  render() {
    return (
      <div className={classes.form}>
        <Form />
      </div>
    
    )
  }
}


export default CustomMix