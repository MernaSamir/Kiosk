import React, { Component } from 'react'
import Header from './header';
import Table from './table';
import classes from './style.less'

export default class DeliveryBoyOrders extends Component {
  render() {
    return (
      <div className={classes.container}>
        <Header />
        <Table />
      </div>
    )
  }
}
