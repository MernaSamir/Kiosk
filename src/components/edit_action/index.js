import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router'
import styles from './styles.less'
import { get } from 'lodash';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';

class EditAction_ extends Component {

  tackAction = () => {
    const { onClick, onAction } = this.props
    if (onAction) {
      onAction()
    }
    else {
      get(this, onClick, () => { })()
    }
  }
  EditCustomer = () => {
    const { history, customer , setMain} = this.props
    setMain("parties__customer",{active: customer.id})
    history.push('/edit/' + customer.id)
  }
  EditReservation = () => {

    const { history, item } = this.props
    history.push('/edit_rese/' + item.id)
  }
  EditEvent = () => {
    console.log("edit eve")
    const { history, item , setMain} = this.props
    const order = applyFilters({
      key: 'Find',
      path: 'orders__main',
      params: {
        event: item.id
      }
    }) || {}
    setMain("orders__main",{active: order.id})
    history.push('/edit_event/' + item.id)
  }
  EditCatring = () => {
    const { history, item , setMain} = this.props
    const order = applyFilters({
      key: 'Find',
      path: 'orders__main',
      params: {
        event: item.id
      }
    }) || {}
    setMain("orders__main",{active: order.id})
    history.push('/edit_catring/' + item.id)
  }
  EditCheckin = () => {
    const { item, setMain } = this.props
    setMain("parties__event_checkin", { active: item.id })

  }

  render() {
    const { classStyle = styles.actions, authorize=true } = this.props
    return (
      <button   type="button" className={classStyle} onClick={this.tackAction}>

        <FontAwesomeIcon icon={['far', 'edit']} />
      </button>
    )
  }
}

export default withRouter(connect(null, mapDispatchToProps)(EditAction_))
