import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../style.less'
import { find } from 'lodash'
import moment from 'moment'

export class DayStart extends Component {

  componentDidMount() {
    const { fetchAll, business_days } = this.props
    fetchAll([
        {
            app: "orders__business_days",
            api: 'orders/business_days/',
            params: {
                limit: 2,
                order_by: '-created_at'
                // end_time__isnull: 0
            }
        },
        {
            app: "orders__shifts",
            api: 'orders/shifts/',
            params: {
                limit: 2,
                order_by: '-created_at',
                date: business_days.id,
            }
        }
    ])
}

  renderTime = (date) => {
    return moment(date).format('HH:mm A')
  }

  render() {
    const { shifts } = this.props
    return (
      <div className={classes.col}>
        {
          shifts && <><p className={classes.title}>Day Start</p>
            <p className={classes.value}>{this.renderTime(shifts.start_time)}</p>
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  business_days: find(state.orders__business_days.data, { end_time: null }) || {},
  get shifts() { return find(state.orders__shifts.data, { end_time: null, date: this.business_days.id }) },
})



export default connect(mapStateToProps, mapDispatchToProps)(DayStart)
