import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { round} from 'lodash'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'


class Quantity extends Component {
  render() {
    const {orderItem} = this.props
    return (
        <td className={`${classes.leftPadding}`}>
            <button className={classes.orderBtn} type='button'>{round(orderItem.quantity, 10)}</button>
        </td>
    )
  }
}

export default connect (null,mapDispatchToProps)(withRouter(Quantity))
