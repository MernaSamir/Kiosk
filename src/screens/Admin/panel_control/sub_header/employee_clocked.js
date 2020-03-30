import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../style.less'

export class EmployeeClockedIn extends Component {


  render() {
    return (
        <div className={classes.col}>
        <p className={classes.title}>Employees Cloked In</p>
        <p className={classes.value}>20</p>
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  
})



export default connect(mapStateToProps, mapDispatchToProps)(EmployeeClockedIn)
