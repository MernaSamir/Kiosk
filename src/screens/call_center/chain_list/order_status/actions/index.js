import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles.less'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import actions from './actions'
import { get, map, isNull } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { message } from 'antd';
import uuid from 'uuid/v4'
import classes from './style.less'

class ViewComponent extends Component {

  takeAction = (action) => {
    const { order } = this.props
    if (isNull(order.delivery_person)) {
      get(this, action.action, () => { })(action)
    }
    else {
      message.warning('This Order With A Delivery Person')
    }
  }

  View = () => {
    const { history, order = {}, setMain } = this.props
    setMain("orders__main", { active: order.id })
    history.push('/home')
  }

  CancelOrder = () => {
    const { setMain, order } = this.props
    console.log("Order ", order)
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: "Deleting Order",
        first_msg: `Are you sure you want to Delete the ${order.number}?`,
        pressYes: () => {
          setMain('orders__main', {
            item: {
              id: order.id,
              end_time: new Date(), action: 'update',
              onSuccess() {
                return [{
                  type: 'set_main_orders__main',
                  data: { active: '' }
                }]
              }
            }
          })
        }
      }
    }
    setMain('popup', { popup })
  }

  Print = () => {
    const { order, setMain } = this.props;
    const receipt = applyFilters({
      path: 'orders__receipt',
      key: 'Find',
      params: {
        order: order.id
      }
    }) || { id: uuid() }
    const details = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        order: order.id
      },
      then: {
        key: "Reject",
        params: {
          deleted: true
        }
      }
    })
    const receipts = applyFilters({
      key: 'calculateOrderReceipt',
      path: 'orders__receipt',
    }, details, undefined, { combine: true, order: order.id, receipt: receipt.id })
    setMain('popup', { popup: { type: "Receipt", receipts: [{ id: receipt.id, ...receipts }] } });
  }

  Pay = () => {
    const { history, order = {}, setAll } = this.props
    // console.log("Order ", order)
    const receipt = applyFilters({
      path: 'orders__receipt',
      key: 'Find',
      params: {
        order: order.id
      }
    })
    if (!receipt) {
      return message.error('please print receipt first')
    }
    setAll([{
      type: 'set_main_orders__main', data: { active: order.id }
    }, {
      type: 'set_main_orders__receipt', data: { active: receipt.id }
    }])
    history.push('/Home/payment')
  }

  Transfer = () => {
    const { setMain, order } = this.props
    const popup = {
      type: 'ChooseOne', visable: true, width: "50%",
      childProps: {
        order: order
      }
    }
    setMain('popup', { popup })
  }

  ChangeAddress_Location = () => {
    const { setMain, order } = this.props
    setMain('popup', {
      popup: {
        type: 'OrderType', visable: true, width: "50%",
        childProps: {
          change: true, currentOrder: order, customer: order.customer
        }
      }
    })
  }

  render() {
    return <div className={classes.actions}>
      {map(actions, (d, key) => (
        <button type="button" key={key} className={styles.actions} onClick={this.takeAction.bind(this, d)} >
          <FontAwesomeIcon icon={d.icon} /></button>
      ))}
    </div>
  }
}

export default connect(null, mapDispatchToProps)(withRouter(ViewComponent))