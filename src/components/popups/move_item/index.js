import React, {Component} from 'react'
import {connect } from 'react-redux'
import {get, range, find} from 'lodash'
import classes from './style.less'
import {convert} from 'helpers/index'
import mapDispatchToProps from 'helpers/actions/main'
import { applyPermissions } from 'helpers/permissions'
import applyFilters from 'helpers/functions/filters'
import {seat} from 'components/seat_name'

class MoveItem extends Component {
  receipts = applyFilters({
    key: 'List',
    path: "orders__receipt",
    select: {
        order: 'orders__main.active',
    }
})
  moveItem = (seat) => {
    const { setMain,detail } = this.props;
    const modifiers = applyFilters({
      key: 'Filter',
      path: "orders__details",
      params: {
          parent: detail.id,
      }
    })
    let data = modifiers.map(d=>({...d,seat_num:seat}))
    data.push({...detail,seat_num:seat})
    setMain( 'orders__details',{ item: {data, action: 'bulkEdit',onSuccess:this.afterMove } })
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
  afterMove = (data) =>{
    const { onCancel } = this.props;
    const detail = find(data, d=>(!d.parent))
    if(detail.seats.length) {
      
      return [{
        type: 'set_main_orders__item_seats',
        data: {
          item:{
            filter:{details: detail.id},
            action:"manyDelete",
            onSuccess:this.deleteReceiptItem.bind(this, detail, this.afterDelete.bind(this,detail )),
          }
        }
      }]
    }
     else{
       return this.deleteReceiptItem(detail, ()=>{
        onCancel()
        return []
       })
     }
  }
  afterDelete = (detail)=>{
    return [
    {type: 'set_main_orders__details', data: {active: detail.id}},
    {type: 'set_path_orders__details', path: `data.${detail.id}.seats`, data: []},
    {type: 'set_main_popup', data: {popup: {type: "ShareItem", visable:true}}}
    ]
  }
  getName=(seat_num)=>{
    
    const { order } = this.props
    return seat(seat_num, order.id, 'S')
  }
  renderSeat(){
    const {order, detail} = this.props
   
    return range(1,order.guests_num+1).filter( i=>(i!=detail.seat_num &&
       applyPermissions({seat_num:i}, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts:this.receipts }) )).map(i=>(
      <button key={i} onClick={this.moveItem.bind(this,i)}>
      {this.getName(i)}</button>
    ))

  }
  checkSharing = () =>{
    const {detail} = this.props
    if(get(detail, 'seats.length', 0)){
      return <p className = {classes.note}>This item was shared between seats {detail.seats.sort().map((i, idx )=> <> {i} {idx!=detail.seats.length -1 && ','}  </>)}. you have to reshare it</p>
    }
  }
  // eslint-disable-next-line react/display-name
  renderBody=( )=>{
    if( this.renderSeat().length){
      return <>
      {this.checkSharing()}
      <p className={classes.seatTitle}>To Seat</p>
      {this.renderSeat()}
      </>
    }
    return  <p className={classes.title}>No Available Seat To Move To</p>
  }
  render() {

    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.title}>Move Item</p>
        {this.renderBody()}
        
        
      </div>
    )
  }
}

const mapStateToProps = (state) =>({
  order: get(state.orders__main, `data.${state.orders__main.active}`),
  detail: get(state.orders__details.data, state.orders__details.active, {}),
  item: state.item,

})
export default connect(mapStateToProps, mapDispatchToProps) (MoveItem)
