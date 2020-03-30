import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { round} from 'lodash'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'


class Quantity extends Component {
    renderChangeQunatity = () => {
            const {  field ,orderItem ,appendPath} = this.props
            appendPath('form_actions', `${[field.name]}`, {select: 'quantity', active: orderItem.id} )
        }

  render() {
    const {orderItem} = this.props
    return (
        <td className={`${classes.leftPadding}`} onClick={this.renderChangeQunatity}>
            <button className={classes.orderBtn} type='button'>{round(orderItem.quantity, 10)}</button>
        </td>
    )
  }
}

export default connect (null,mapDispatchToProps)(withRouter(Quantity))
