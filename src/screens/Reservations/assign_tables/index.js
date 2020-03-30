import React, { Component } from 'react'
import classes from './style.less'
import List from './reservation_list'
import TablesList from './tables'
export default class AssignTables extends Component {
  render() {
    return (
      <div className={classes.assignTablesContanier}>
        <div className={classes.list}> <List/> </div>
        <div className={classes.tablesList}><TablesList/></div>
      </div>
    )
  }
}
