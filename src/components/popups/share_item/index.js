import React, { Component } from 'react'
import { get, range } from 'lodash'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import mapDispatchToProps from 'helpers/actions/main'
import Render from 'helpers/functions/field_mapper/renderfields'
import { applyPermissions } from 'helpers/permissions'
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next'
import {seat} from 'components/seat_name'

class ShareItem extends Component {
  receipts = applyFilters({
    key: 'List',
    path: "orders__receipt",
    select: {
      order: 'orders__main.active',
    }
  })
  getName = (seat_num) => {
    const { order } = this.props
    return seat(seat_num, order.id, 'S')

   
  }
  static onSubmit(props, values) {
    const { setMain, detail, setPath } = props;
    if (values.seats) {
      const guests = [...values.seats, detail.seat_num].map(i => ({ seat_num: i, details: detail.id }))
      setMain('orders__item_seats', {
        item: {
          data: guests,
          action: "bulkAdd",
          onSuccess: this.added.bind(this, props, values)
        }
      })
    }
    else {
      setMain('orders__details', { active: '', move: '' })
      setPath('orders__details', `data.${detail.id}.seats`, [])
      props.onCancel()
    }

  }
  static added(props, values) {
    const { detail } = props;
    props.onCancel()
    return [
      { type: 'set_path_orders__details', path: `data.${detail.id}.seats`, data: [...values.seats, detail.seat_num] },
      { type: 'set_main_orders__details', data: { active: '' } },
      { type: 'set_main_orders__details', data: { move: '' } }
    ]
  }

  buttonField() {
    const { order, detail } = this.props
    return Render([{
      name: "seats",
      type: 'MultiSelect',
      className: classes.btnsContanier,
      options: range(1, order.guests_num + 1).filter(d => (d != detail.seat_num &&
        applyPermissions({ seat_num: d }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts: this.receipts })
      )
      ).map(i => ({ id: i, name: this.getName(i) }))

    }])
  }
  renderSeat() {
    const { order = {} } = this.props
    return range(1, order.guests_num + 1).map(i => (
      i
    ))

  }
  renderBody = () => {
    const { order, detail, t } = this.props
    let list = range(1, order.guests_num + 1).filter(d => (d != detail.seat_num &&
      applyPermissions({ seat_num: d }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts: this.receipts }))
    ).map(i => ({ id: i, name: `seat ${i}` }))

    if (list.length) {
      return <>
        <p className={classes.seatTitle}>{t('With Seats')}</p>
        {this.buttonField()}
        <button type='submit'>{t('Ok')}</button>
      </>
    }
    else {
      return <p className={classes.title}>{t('No Available Seats To Share With')}</p>

    }

  }
  render() {
    const { t } = this.props
    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.title}>{t('Share item')}</p>
        {this.renderBody()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  order: get(state.orders__main, `data.${state.orders__main.active}`),
  detail: get(state.orders__details.data, state.orders__details.active, {}),
  item: state.item,
})

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Form(ShareItem)))