import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../style.less'
import { get, reject } from 'lodash'

export class ClosedOrder extends Component {

  componentDidMount() {
    const { fetchAll } = this.props
    fetchAll([
      {
        app: 'main',
        api: 'orders/main/',
        params: {}
      },
    ])
  }
  render() {
    const {orders} = this.props
    return (
        <div className={classes.col}>
              <p className={classes.title}>Closed Orders</p>
              <p className={classes.value}>{Object.keys(orders).length}</p>
            </div>
    )
  }
}

const mapStateToProps = (state) => ({
  orders: reject(get(state.main, 'data', ''), { end_time: null }, {}),
})



export default connect(mapStateToProps, mapDispatchToProps)(ClosedOrder)
