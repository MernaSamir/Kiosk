import React, { Component } from 'react'
import classes from './style.less'

export default class Header extends Component {
  render() {
    return (
      <div className={classes.header}>
        <p>Delivery Person</p>
      </div>
    )
  }
}
