/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, range, find, filter } from 'lodash'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import { applyFilterToData } from 'helpers/permissions'
import applyFilters from 'helpers/functions/filters'
import { message } from 'antd';
import {withTranslation} from 'react-i18next'
let datas = {};
class PrintOrder extends Component {

  static datas = {}
  constructor(props) {
    super(props);
    datas = this.getOrderData();
    this.seats = this.getList().map(d => (d.seat_num))
    props.handleChange({
      target: {
        name: 'seats',
        value: this.seats
      }
    })
  }
  getOrderData() {
    const { order } = this.props;
    return {
      receipts: applyFilters({
        key: 'Filter',
        path: 'orders__receipt',
        params: {
          order: order.id
        }
      }),
      details: applyFilters({
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
    }
  }
  static onSubmit(props, values) {
    const seats = filter(values.seats, d => Number(d));
    if (seats.length) {
      this.printReceipt(props, seats, values.merge)
    } else {
      message.warning("Please Select Seat")
    }
  }
  cancel = () => {
    const { setMain } = this.props
    setMain('popup', { popup: {} })
  }
  static printReceipt(props, seatsNum, merge) {
    const { setMain } = props;
    const { details } = datas;
    const receipts = applyFilters({
      key: 'calculateReceipts',
      path: 'orders__receipt',

    }, details, undefined, { combine: merge, seatsNum })
    setMain('popup', { popup: { type: "Receipt", receipts: receipts } });

  }
  getName=(seat_num)=>{
    
    const { order } = this.props

    const seat = applyFilters({
      key:"Find",
            path:'orders__order_seats',
            params:{
                order:order.id,
                seat_num
            }
    })
    if(seat){
      if(seat.note){
        return `S${seat.seat_num} ${seat.note}`
      }
      else{
        const customer = applyFilters({
                path:`parties__customer.data.${seat.customer}`
        })
        return `S${seat.seat_num} ${customer.name}`
      }
    }
    else{
      return`seat ${seat_num}`
    }
  }
  getList = () => {
    const { order } = this.props
    const { receipts, details } = datas;
    const orderDetails = filter(details, { parent: null })
    return range(1, order.guests_num + 1)
      .map(i => ({ id: i, seat_num: i, name: this.getName(i) }))
      .filter(v => !find(receipts, r => r.seats.includes(v.id)))
      .filter(applyFilterToData({ check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" } }, { orderDetails }))
      .filter(applyFilterToData({ check_not_voided: { key: 'seat_num', list: "orderDetails" } }, { orderDetails }))
  }
  buttonField(seats) {
    return Render([{
      name: "seats",
      type: 'MultiSelect',
      className: classes.btnsContanier,
      options: seats,


    }])
  }
  selectAll = () => {
    const { handleChange, resetForm, values } = this.props

    if (this.seats.length == get(values, 'seats.length')) {
      resetForm({
        seats: []
      })

    }
    else {
      handleChange({
        target: {
          name: 'seats',
          value: this.seats
        }
      })

    }

  }
  renderBody = () => {
    const seats = this.getList()
    const { values, t } = this.props
    const all = this.seats.length == get(values, 'seats.length')
    if (seats.length) {
      return <> <div className={classes.btnsContanier}>
        <button type='button' className={all ? classes.all : classes.none} onClick={this.selectAll}>{t('All')}</button>
        {this.buttonField(seats)}
      </div>
        <div >
          {this.seats.length > 1&&Render([{
            type: 'CheckBoxHighlight',
            initValue: true,
            name: 'merge',
            labeling: t("Print Combined Receipt")
          }])
          }
        </div>
        <div className={classes.saveBtns}>
          <button onClick={this.cancel}>{t('Cancel')}</button>
          <button type='submit'>{t('Ok')}</button>
        </div>
      </>
    }
    else {
      return <p className={classes.title}> {t("No Avaialable Seats To Print")}</p>
    }

  }
  render() {
    const {t} = this.props
    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.title}>{t('Table Print')}</p>
        {this.renderBody()}
      </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  order: get(state.orders__main, `data.${state.orders__main.active}`) || props.order,
  //   get initialValues() {
  //     return {
  //         seats: range(1,this.order.guests_num+1)
  //     }
  // }
})

export default withTranslation() ( connect(mapStateToProps, mapDispatchToProps)(Form(PrintOrder)) )
