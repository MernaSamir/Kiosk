import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Shape from './shape'
import applyFilters from 'helpers/functions/filters'
import {get} from 'lodash'
import {withTranslation} from 'react-i18next'

class Table extends Component {
  constructor(props){
    super(props)
    this.user = applyFilters({
      path: 'main.current'
    })
  }
  editTable = () =>{
    const {setAll, table} = this.props;
    if(table.active){
      setAll([
        {type: 'set_main', app: 'dinin__tables', data: {active: table.id}},
        {
          type: 'set_main', 
          app: 'popup', 
          data: {
            popup: {
              type: 'EditTable',
              width: "50%",
              childProps:{
                onClick: {combine:"", transfer:""}
              }
            }
          }
        }
      ])
    }
  }
  openModal = (e)=>{
    const {table, setAll} = this.props
    const user = this.user
    let dis = [
      {type: 'set_main', app: 'dinin__tables', data: {active: table.id}}
    ];
    const order = applyFilters({
      path: `orders__main.data.${table.active}`
    })
    
    if(user.is_waiter && table.active){
      if(user.id != order.serve){
        return
      }
      
    }
    if (table.active && e.type === 'click'&&!table.combined){
      this.openOrder()
    }else if(!table.combined){
      this.openPopup()
    }
    else{
      dis.push(
        {
          type: 'set_main', 
          app: 'popup', 
          data: {
            popup: {
              type: 'SeperateTable', 
              width: "30%",
              border:'2px solid #306ab2',
              childProps:{table}
            }
          }
        }
      )
    }
    setAll(dis);
  }
  activeSeat = () => {
    const {table} = this.props
    const order = applyFilters({
      path: `orders__main.data.${table.active}`
    })
    if(order.guests_num ==1)
      return {type: 'set_main', app: 'orders__details', data: {item: {seat_num:1}}}
    else{
      return {type: 'set_main', app: 'orders__details', data: {item: {seat_num:0}}}
    }
  }
  openPopup(){
    const {setAll} = this.props;
    setAll([
      {type: 'set_main', app: 'orders__details', data: {item: {seat_num:0}}},
      {type: 'set_main', app: 'popup', data: {popup: {type: 'TablePopup', width: "50%"}}}
    ])
  }
  openOrder(){
    const {setAll, table, history} = this.props;
    setAll([
      {type: 'set_main', app: "orders__main", data: {active :table.active}},
      this.activeSeat()
    ])
    history.push('/home')
  }

  render() {
    const { table, unit, t } = this.props
         return (
          <Shape {...{table ,unit}} editTable={this.editTable} openModal={this.openModal} t={t} />
      )

  }
}

const wrapper = connect((state, props)=>({
  table: get(state.dinin__tables.data, props.table_id)
}))(Table)
export default withRouter(withTranslation()(wrapper))