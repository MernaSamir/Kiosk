import React, {Component} from 'react'
import {get, keys} from 'lodash'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Paging from 'components/paging'

class MoveSeat extends Component {

  state={
    page: 1
  }
  static onSubmit (props, values){
    if(values){
      const table = applyFilters({path:`dinin__tables.data.${values.table}`})
      this.moveSeat(props,table)
    }
  }

  
  
  static updateSeat=(props,newOrder, newTable,seat)=>{
    return[{
      type:"set_main_orders__order_seats",
      data:{item:{id:seat.id, order: newOrder.id, seat_num: newOrder.guests_num +1 , action: 'update',
      onSuccess: this.updateOrder.bind(this, props, newOrder, newTable)
      }}
      }]
    
  }
  static moveSeat (props, newTable){
    const {setMain, order, activeSeat} = props
    const newOrder = applyFilters({path:`orders__main.data.${newTable.active}`})
    const seat = applyFilters({
      key: 'Find',
      path: 'orders__order_seats',
      params:{
        order: order.id,
        seat_num: activeSeat
      }
    })
    let func = this.updateOrder
    if(seat){
      func = this.updateSeat
    }
    setMain("orders__details", {
      item:{
        filter :{
          order: order.id,
          seat_num: activeSeat
        },
        data: {order: newTable.active || '', seat_num: newOrder.guests_num + 1 },
        action:'manyEdit',
        onSuccess: func.bind(this,props, newOrder, newTable,seat)
      }
    })
  } 
  static updateOrder (props, newOrder, newTable){
   
    return [{
      type: 'set_main_orders__main',
      data: {
        item:{
            id:newOrder.id,
            guests_num: newOrder.guests_num + 1,
            action: 'update',
            onSuccess: this.finishOrder.bind(this, props, newOrder, newTable)
        }
      }
    }]
  }
  static finishOrder  (props, newOrder, newTable){
    props.onCancel()
    return [
      {type: 'set_main_orders__main', data: {active: newOrder.id}},
      {type: 'set_main_dinin__tables', data: {active: newTable.id}},

    ]
  }
  getData(){
    const {table} = this.props
    this.datas = {
      tables: applyFilters({
        key: 'Reject', 
        path: 'dinin__tables', 
        params: {
          active: null
        },
        then: {
          key: 'Reject',
          params: {
            id: table.id
          }
        }
      })
    }
  }

  buttonField() {
   
    const {tables} = this.datas
    const{page} = this.state
    return Render([{
        name: "table",
        type: 'selectButtons',
        className: classes.btnsContainer,
        options: tables.slice(8 * (page - 1), 8 * page) 
    }])
  }
  handelPageClick = (op) => {
    const {tables} = this.datas

    const { page } = this.state
    let pageMax = Math.ceil((keys(tables) || []).length / 8)
    if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
        this.setState({ page: page + op })
    }
  }
  render() {
    this.getData()
    const {page}=  this.state
    const {tables} = this.datas
    let pageMax = Math.ceil((keys(tables) || []).length / 8)
    return (
      <div className={classes.moveSeatContiner}>
         <p className={classes.title}>Move Seat</p>
       <div className={classes.header}>
          <p  className={classes.title}>To Table:</p>
          <Paging  {...{page, pageMax}} handelPageClick={this.handelPageClick} style={classes.pagDiv}/>
        </div>
        <div className={classes.btnsContainer}>
            {this.buttonField()}
        </div>
        <div className={classes.saveBtns}>
          <button onClick={this.props.onCancel.bind(this)}>cancel</button>
          <button type='submit'>Ok</button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) =>({
    table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
    order: get(state.orders__main.data, state.orders__main.active, {}),
    activeSeat: get(state.orders__details,'item.seat_num')
})

export default connect(mapStateToProps, mapDispatchToProps)(Form(MoveSeat))

