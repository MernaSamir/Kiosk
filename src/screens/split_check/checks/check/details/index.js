/* eslint-disable consistent-return */
import React, { Component } from 'react'
import classes from './style.less'
import { get, map, every, range, find,some } from "lodash"
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { applyPermissions } from 'helpers/permissions'

class Details extends Component {
  receipts = applyFilters({
    key: 'List',
    path: "orders__receipt",
    select: {
      order: 'orders__main.active',
    }
  })
  valid=(detail)=>{
    const { order } = this.props
    const receipts = applyFilters({
      key: 'Filter',
      path: 'orders__receipt',
      params:{
        order: order.id
      },
      then:{
        key:'Reject',
        params:{
          invoice: null
        }
      }
    })
    const items = applyFilters({
      key: 'Includes',
      path: 'orders__receipt_items',
      select:'receipt',
      pick: 'id'
    }, undefined, undefined,{data : receipts})
   
    return !some(items, d=>d.details == detail.id)
  }
  moveItem = (detail) => {
    const { setMain, move, active } = this.props
    const valid= this.valid(detail)
    if (active.id == detail.id) {
      setMain('orders__details', { active: '' })
    }
    else if (move&&valid) {
      setMain('orders__details', { active: detail.id })
    }

  }
  move = (seat_num) => {
    const { active, setMain } = this.props
    const modifiers = applyFilters({
      key: 'Filter',
      path: "orders__details",
      params: {
        parent: active.id,
      }
    })
    const voids = applyFilters({
      key: 'Filter',
      path: "orders__details",
      params: {
        void: active.id,
      }
    })
    let data = [...voids, ...modifiers].map(d => ({ id: d.id, seat_num }))
    data.push({ id: active.id, seat_num })
    setMain('orders__details', { item: { data, action: 'bulkEdit', onSuccess: this.afterMove } })

  }
  shareItem = (detail) => {
    const { order } = this.props
    const seats = range(1, order.guests_num + 1).filter(d => (
      applyPermissions({ seat_num: d }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts: this.receipts }))
    ).map(i => i)
    const data = seats.map(i => ({ details: detail.id, seat_num: i }))
        return [{
          type: 'set_main_orders__item_seats',
          data: {
            item: {
              action: 'bulkAdd',
              data,
              onSuccess() {
                return [
                  { type: 'set_main_orders__details', data: { active: '' } },
                  { type: 'set_main_orders__details', data: { move: '' } },
                  { type: 'set_path_orders__details', path: `data.${detail.id}.seat_num`, data: 0 },
                  { type: 'set_path_orders__details', path: `data.${detail.id}.seats`, data: seats }
                ]
              }
            }
          }
        }]
       

  }
deleteReceiptItem = (detail, fun)=>{
    return [{
      type: 'set_main_orders__receipt_items',
      data: {
        item:{
          filter:{details:detail.id},
          action:"manyDelete",
          onSuccess: fun,
        }
      }
    }]
  }
  afterMove = (data) => {
    const detail = find(data, d => !d.parent)
    let func = detail.seat_num == 0 ? this.shareItem : this.afterDelete
    if (get(detail, 'seats.length',0 )) {
      return [{
        type: 'set_main_orders__item_seats',
        data: {
          item: {
            filter: { details: detail.id },
            action: "manyDelete",
            onSuccess: this.deleteReceiptItem.bind(this, detail,func.bind(this, detail) ) 
          }
        }
      }]
    }
    else if (detail.seat_num == 0) {

      return this.deleteReceiptItem(detail, this.shareItem.bind(this, detail) )
      
    }
    else{
      return this.deleteReceiptItem(detail,()=>{
        
        return[{
          type: 'set_main_orders__details',
          data:{
            move:'',
          }
        }]
      })
    }

  }

  afterDelete = (detail) => {
    const {order} = this.props
    let list = range(1,order.guests_num+1).filter(d=>( d!=detail.seat_num &&
      applyPermissions({seat_num:d}, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts: this.receipts }))
      ).map(i=>({id: i, name: `seat ${i}`}))
      const obj = list.length?{ type: 'set_main_popup', data: { popup: { type: "ShareItem", visable: true } } }
      :{ type:'set_path_orders__details', path: `data.${detail.id}.seats`, data: []}

    return [
      { type: 'set_main_orders__details', data: { active: detail.id } },
      { type: 'set_path_orders__details', path: `data.${detail.id}.seat_num`, data: detail.seat_num },
      obj
      
    ]
  }
  renderItems() {
    const { order, move, active, seat } = this.props
    const details = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        order: order.id,
        seat_num: seat,
        parent:null,
        void:null
      },
      then: {
        key: 'Reject',
        params: {
          deleted: true
        }
      }
    })
    const prices = applyFilters({
      key: 'picking',
      reduxName: "items__prices",
      select: 'item',
    }, details)

    const items = applyFilters({
      key: 'picking',
      reduxName: "items__sales_items",
      select: 'sales_item',
    }, prices)

    return map(details, (detail, key) => {
      const price = get(prices, detail.item, {})
      const item = get(items, price.sales_item, {})
      const valid = this.valid(detail)
      return <><tr key={key} onClick={this.moveItem.bind(this, detail)} className={active.id == detail.id ?
       classes.active : move&& valid ? classes.border : ''}>
        <td >{detail.quantity}</td>
        <td >{item.name}</td>
        <td >{detail.quantity * detail.price}</td>
      </tr>
      {this.renderChilds(detail)}
      {this.shares(detail)}
      </>

    })
  }
  getDetail(detail) {
    return applyFilters({
        key: 'chainMulti',
        selectors: {
            items__prices: 'item',
            items__sales_items: 'sales_item',
        }
    }, detail)
}
  shares =(detail)=>{
    if(detail.seats.length){
      return<tr className={classes.shared}>
        shared with seats {detail.seats.sort().join(',')}
      </tr>
    }
  }
  renderChilds=(detail)=>{
    const details = applyFilters({
      key:'Filter',
      path:'orders__details',
      params:{
        parent:detail.id
      }
    })
    return map(details, (d,key)=>{
      const { items__sales_items: item } = this.getDetail(d)
      return<tr key={key} className={classes.mod}>
        <td >{detail.quantity}x{d.quantity}</td>
        <td >{item.name}</td>
        <td >{d.quantity * d.price}</td>
      </tr>
    })
  }

  moveHere=()=>{
    const { seat, move, active, receipt={} } = this.props
    const checks = {
      active: active.seat_num != seat,
      move,
      id: active.id,
    }
    if(every(checks, Boolean) &&!receipt.invoice ){
      return <tr className={classes.moveHere}
              onClick={this.move.bind(this, seat)}>
              <p> Move Item Here</p></tr>
    }
    else if(every(checks, Boolean) &&receipt.invoice){
      return <tr className={classes.note}>
      <p> This Seat Is Paid</p></tr>
    }
  }
  render() {
   
    return (
      <div className={classes.table_div}>
        <table >
          <thead>
            <tr>
              <th>Qty</th>
              <th>Item</th>
              <th >Total</th>
            </tr>

          </thead>
          <tbody>
           {this.moveHere()}
            {this.renderItems()}
          </tbody>
        </table>
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => ({
  order: get(state.orders__main.data, state.orders__main.active),
  move: get(state, 'orders__details.move', false),
  active: get(state.orders__details.data, state.orders__details.active, {})

})
export default connect(mapStateToProps, mapDispatchToProps)(Details)