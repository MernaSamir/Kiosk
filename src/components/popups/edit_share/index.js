import React, {Component} from 'react'
import {get, range} from 'lodash'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import {flatten, filter} from 'lodash'
import { message } from 'antd'
import { applyPermissions } from 'helpers/permissions'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next'
import {seat} from 'components/seat_name'

class EditShare extends Component {

  static onSubmit (props, values){
      const { setMain, detail, order , t} = props;
      const receipts = applyFilters({key: 'Filter', path: 'orders__receipt', params: {order: order.id}})
        let disabled = flatten(filter(receipts,d=>d.invoice).map(r=>r.seats)).filter(s=>detail.seats.includes(s))
        let intial = detail.seats.filter(d=>(d!=detail.seat_num))
        if(disabled.length){
          if(values.seats.length == intial.length){
            setMain('orders__item_seats', {item:{
              filter:{details:detail.id},
              action:"manyDelete",
              onSuccess: this.afterDelete.bind(this, values, props)
            }})
          }
          else{
            message.error(t("you have to share with the same seats number you shared with before"))
          }
        }
        else{
          setMain('orders__item_seats', {item:{
            filter:{details:detail.id},
            action:"manyDelete",
            onSuccess: this.afterDelete.bind(this, values, props)
          }})
        }



  }

  static afterDelete(values, props){
    const {detail } = props
    if(get(values, 'seats.length', 0)){
      let guests
      if(detail.seat_num == 0){
         guests = [...values.seats].map(i=>({seat_num:i,details:detail.id}))
      }
      else{
        guests = [...values.seats, detail.seat_num].map(i=>({seat_num:i,details:detail.id}))
      }
      return [{
        type: 'set_main_orders__item_seats',
        data: {
            item:{
            data:guests,
            action:"bulkAdd",
            onSuccess:this.added.bind(this, props, values)
          }
        }
      }]
    }
    else{
      props.onCancel()
      return [{
        type: 'set_path_orders__details',
        path: `data.${detail.id}.seats`,
        data: []
      }]

    }

  }
  static added(props, values){
    const {detail} = props;
    props.onCancel()
    if(detail.seat_num == 0){
      return [{
        type: 'set_path_orders__details',
        path: `data.${detail.id}.seats`,
        data: [...values.seats]
      }]
    }
    else{
      return [{
        type: 'set_path_orders__details',
        path: `data.${detail.id}.seats`,
        data: [...values.seats, detail.seat_num]
      }]
    }
  }
  getName=(seat_num)=>{
    
    const { order } = this.props
    return seat(seat_num, order.id, 'S')
  }

    buttonField() {
        const {order, detail, receipts} = this.props

        let seats = flatten(filter(receipts,d=>d.invoice).map(r=>r.seats))
        return Render([{
            name: "seats",
          type: 'MultiSelect',
            className: classes.btnsContanier,
            options: range(1,order.guests_num+1).filter(d=>(d!=detail.seat_num && 
              applyPermissions({seat_num:d}, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts }) ) 
            ).map(i=>({id: i, name: this.getName(i)})),
            disabled:seats

        }])
    }
    renderSeat(){
        const {order ={}} = this.props
        return range(1,order.guests_num+1).map(i=>(
          i
        ))

      }
      render() {
        const {t} = this.props
        return (
          <div className={classes.moveSeatContiner}>
            <p className={classes.title}>{t("Share item")}</p>
            <p className={classes.seatTitle}>{t("over Seats")}:</p>
            {/* <div className = {classes.btnsContanier}> */}
                {this.buttonField()}
            {/* </div> */}
            <button type='submit'>{t("Ok")}</button>
          </div>
        )
      }
    }
const mapStateToProps = (state) =>({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    detail: get(state.orders__details.data, state.orders__details.active, {}),
    receipts: get(state, "orders__receipt", {}),
    get initialValues () {return {seats: this.detail.seats.filter(d=>(d!= this.detail.seat_num))}},

})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(EditShare)))
