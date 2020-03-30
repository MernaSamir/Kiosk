import React, { Component } from 'react'
import classes from './style.less';
import { isEmpty } from 'lodash';
class Error extends Component {
  render() {
    const {touched, error} = this.props;
    if(isEmpty(error)){
      return <></>
    }
    return (
      <p className={classes.error}>
        {touched && error}
      </p>
    )
  }
}
export default  Error
