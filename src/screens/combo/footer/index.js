import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, find, map, filter, reject, range } from 'lodash'
import uuid from 'uuid/v4';
import applyFilters from 'helpers/functions/filters';
import { withRouter } from 'react-router-dom'
import { applyPermissions } from 'helpers/permissions'

class Footer extends Component {

  editCombo = () => {
    const { setMain, list, history, detail } = this.props
    const details = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        parent: detail.id
      }
    })
    const data = filter(list, d => d.id != d.old)
    if (data.length) {
      const updated = data.map(d => {
        let price = 0, is_alter = false
        if (d.main != d.id) {
          price = d.price
          is_alter = true
        }
        return { id: find(details, { item: d.old }).id, price: price, item: d.id, is_alter }
      })
      setMain('orders__details', {
        item: {
          data: updated, action: 'bulkEdit', onSuccess() {
            history.push('/home')
            return [
              { type: 'set_main_items__prices', data: { active: "" } },
              { type: 'set_main_items__combo', data: { active: "" } }
            ]
          }
        }
      })
    }
    else {
      history.push('/home')
    }
  }

  add = () => {
    const { price, order, seat_num, list, detail, handleChange, back } = this.props
    if (detail && detail.is_combo) {
      this.editCombo()
    }
    else {
      const combo = {
        id: uuid(), order, seat_num, item: price.id, quantity: 1,
        price: price.price, is_combo: true
      }
      const data = map(list, d => {
        let price = 0, quantity, is_alter = false
        if (d.main != d.id) {
          price = d.price
          quantity = applyFilters({
            key: 'Find',
            path: 'items__combo',
            params: {
              item: d.main
            }
          }).quantity

          is_alter = true
        }
        else {
          quantity = applyFilters({
            key: 'Find',
            path: 'items__combo',
            params: {
              item: d.id
            }
          }).quantity
        }
        return { id: uuid(), parent: combo.id, price: price, order, seat_num, quantity, item: d.id, is_alter }
      })
      if (handleChange) {
        handleChange({ data: [combo, ...data].reduce((o, v) => ({ ...o, [v.id]: v }), {}) })
        back()
      }
      else
        this.save([combo, ...data])
    }
  }

  save = (data) => {
    const { setMain } = this.props
    setMain('orders__details', {
      item: {
        data, action: 'bulkEdit',
        // onSuccess: this.afterAdd.bind(this, data)
        onSuccess: this.shareItem
      }
    })
  }

  afterAdd = (data, shares) => {
    const { history } = this.props
    let d = this.renderComboItemsHasModifiers(data)
    if (d.length >= 1) {
      const activeDetail = find(data, { item: d[0].id })
     
      let list = [
        { type: 'set_main_orders__details', data: { active: activeDetail.id } },
        { type: 'set_main_items__prices', data: { active: d[0].id } },
       
      ]
      if(shares){
        list.push(shares)
      }
      history.push('/home/modifires')
      return list
    }
    else {
      history.push('/home')
      let list = [
        { type: 'set_main_items__prices', data: { active: '' } },
        { type: 'set_main_items__combo', data: { active: '' } },
        { type: 'set_main_orders__details', data: { active: '' } },
      ]
      if(shares){
        list.push(shares)
      }
      return list
    }
  }

  
  shareItem = (data) => {
    const item = find(data,d=>!d.parent)
    const { activeOrder, modeKey } = this.props
    const receipts = applyFilters({
      key: 'Filter',
      path:'orders__receipt',
      params:{
        order : activeOrder.id
      }
    })
    if (item.seat_num == 0 && modeKey == 'DI') {
        return [{
            type: 'set_main_orders__item_seats',
            data: {
                item: {
                    data: range(1, activeOrder.guests_num + 1).filter(i =>
                        applyPermissions({ seat_num: i }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts })
                    ).map(i => ({ seat_num: i, details: item.id })),
                    action: 'bulkAdd',
                    onSuccess: this.afterShare.bind(this, item, data)
                }
            }
        }]
    }
    return this.afterAdd(data)
}
afterShare=(item, data, seats)=>{
  const list = seats.map(i => i.seat_num)
  const shares = { type: 'set_path_orders__details', path: `data.${item.id}.seats`, data: list }
  return this.afterAdd(data,shares)
 
}

  goModifier = (elment) => {
    const { history } = this.props
    history.push('/home/modifires')
    return [
      { type: 'set_main_items__prices', data: { active: elment.id } }
    ]

  }

  renderComboItemsHasModifiers = (data) => {
    const prices = applyFilters({
      key: 'picking',
      reduxName: 'items__prices',
      select: 'item'
    }, reject(data, d => (!d.parent)))
    const priceswithmodifiers = filter(prices, { has_modifiers: true })
    return priceswithmodifiers
  }

  render() {
    return (
      <div className={classes.footer}>
        <button type="button" onClick={this.add}>Done</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  price: get(state.items__prices.data, state.items__prices.active, ''),
  order: get(state.orders__main, 'active', ''),
  activeOrder: get(state.orders__main, `data.${state.orders__main.active}`, ''),
  seat_num: get(state.orders__details, 'item.seat_num', 0),
  item: state.item,
  detail: get(state.orders__details.data, state.orders__details.active, false),
  active_station: get(state.licensing__station, 'active', ''),
  modeKey: get(state.settings__mode.data, `${state.settings__mode.active}.key`),

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Footer))