import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { round} from 'lodash'

import classes from './style.less'

class Quantity extends Component {
    renderChangeQunatity = () => {
        const {orderItem} = this.props
        if (!orderItem.fired_time && !orderItem.void) {
            const { history, setMain } = this.props
            setMain("orders__details", { active: orderItem.id ,orderPopup:''})
            history.push('/home/quantity')
        }
    }
  render() {
    const {orderItem} = this.props


    return (
        <td className={`${classes.leftPadding}`} onClick={this.renderChangeQunatity}>
            <button className={classes.orderBtn}>{round(orderItem.quantity, 10)}</button>
        </td>
    )
  }
}

export default withRouter(Quantity)
