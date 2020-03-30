import React, { Component } from 'react'
import classes from './../style.less'

import DayStart from './day_start'
import OpenTables from './open_tables'
import ClosedOrder from './closed_order'
import EmployeeClockedIn from './employee_clocked'
import Revenue from './revenue'

export default class SubHeader extends Component {
  render() {

    return (

          <div className={classes.details_div}>
            {/* <DayStart />
            <OpenTables />
            <ClosedOrder />
            <EmployeeClockedIn />
            <Revenue /> */}
          </div>

    )
  }
}

