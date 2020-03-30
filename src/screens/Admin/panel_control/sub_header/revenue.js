import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../style.less'
import { round, get, reject, sumBy, filter, map } from 'lodash'

export class Revenue extends Component {

  render() {
    const { orders } = this.props
    return (
      <div className={classes.col}>
        <p className={classes.title}>Revenue</p>
        <p className={classes.value}>{round(sumBy(orders, 'gross_sales'),2)}</p>
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  shifts: map(filter(state.orders__shifts.data, {date: state.orders__business_days.active}), d=>d.id),
  get orders() {return filter(reject(get(state.orders__main, 'data', ''), { end_time: null }, {}), d=>(this.shifts.includes(d.shifts)))},
})



export default connect(mapStateToProps, mapDispatchToProps)(Revenue)
