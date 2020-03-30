import React, { Component } from 'react'
import { get, map, keys} from 'lodash'
import { connect } from 'react-redux'
import classes from './style.less'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import Paging from 'components/paging'
import {withTranslation} from 'react-i18next'

class ViewTables extends Component {
  state={
    page: 1
  }
  constructor(props){
    super(props);
    this.tables = this.getTables()
  }
  combineEmpty=(selectedTable)=>{
    const {table, setMain} = this.props

    setMain('dinin__tables', {
      item: {
        id:selectedTable.id, 
        combined: table.id, 
        action:'update', 
        onSuccess(){
          return [{
              type: 'set_main_popup', data: {popup:{}}
          }]
        }} 
    })
  }
  combineTables = (selectedTable) => {
    const { table, setMain } = this.props
    if (selectedTable.active == null) {
      this.combineEmpty(selectedTable)
    }
    else {
      const combined = applyFilters({
        key: 'Find',
        path: 'orders__main',
        params: {
          id: selectedTable.active
        }
      })
      const details = applyFilters({
        key: 'Filter',
        path: 'orders__details',
        params: {
          order: table.active
        }
      })

      const sharedItems = applyFilters({
        key: 'Includes',
        path: 'orders__item_seats',
        pick: 'id',
        select: 'details',
      }, undefined, undefined, { data: details })

      const tableDetails = map(details, (d) => (
        { id: d.id, seat_num: (d.seat_num == 0) ? 0 : (d.seat_num + combined.guests_num), order: combined.id }
      ));
      const shared = sharedItems.map(d => ({ id: d.id, seat_num: d.seat_num + combined.guests_num }))
      setMain('orders__details', { item: { data: tableDetails, action: 'bulkEdit',
       onSuccess: this.combine.bind(this, shared, selectedTable) } })
    }
  }



  combine = (shared, selectedTable) => {
    const { table } = this.props

    const combined = applyFilters({
      key: 'Find',
      path: 'orders__main',
      params: {
        id: selectedTable.active
      }
    })
    const order = applyFilters({
      key: 'Find',
      path: 'orders__main',
      params: {
        id: table.active
      }
    })
    return [{
      type: 'set_main_orders__main',
      data: {
        item: {
          data: [{
            id: order.id,
            combined: combined.id,
            end_time: new Date(),
          }, {
            id: combined.id,
            guests_num: combined.guests_num + order.guests_num
          }],
          action: 'bulkEdit',
          onSuccess: this.moveReceipts.bind(this, shared, selectedTable, order, combined)
          // onSuccess: this.openOrder.bind(this, shared, selectedTable)
        }
      }
    }]
  }
  moveReceipts=(shared, selectedTable, oldOrder, newOrder)=>{
    console.log('nfhhgjdhjhggh')
      const receipts = applyFilters({
        key:'Filter',
        path:'orders__receipt',
        params:{
          order: oldOrder.id
        }
      })
      
      const data = map(receipts, d=>({id:d.id, order:selectedTable.active, seats:map(d.seats, s=>(s+newOrder.guests_num))}))
      // const afterMove = this.openOrder.bind(this, shared, selectedTable)
   
      return [{
        type:'set_main_orders__receipt', data: {item:{data, action:'bulkEdit', onSuccess:this.movePayments.bind(this, shared, selectedTable, oldOrder, newOrder) } }}]
      
     
  }
  movePayments=(shared, selectedTable, oldOrder, newOrder)=>{
    const payments = applyFilters({
      key:'Filter',
      path:'orders__payment',
      params:{
        order: oldOrder.id
      }
    })
    console.log('iaaam here', payments)
    const afterMove = this.openOrder.bind(this, shared, selectedTable)
    const data = map(payments, d=>({id:d.id, order:newOrder.id}))
    return [{
      type:'set_main_orders__payment', data: {item:{data, action:'bulkEdit', onSuccess:afterMove } }}]
  }
  openOrder = (shared, selectedTable) => {
    const { history, table } = this.props
    const dis = [
      { type: 'set_path_dinin__tables', path: `data.${table.id}.active`, data: null },
      { type: 'set_main_popup', data: { popup: {} } },
      { type: 'set_main_orders__main', data: { active: selectedTable.active } },
    ]
    if (shared.length) {
      dis.push({ type: 'set_main_orders__item_seats', data: { item: { data: shared, action: 'bulkEdit', onSuccess:this.updateshare } } })
    }
    history.push("/home");
    return dis;
  }
  updateshare=(data)=>{
    return [{type:'set_path_orders__details', path: `data.${data[0].details}.seats`, data:  map(data,d=>(d.seat_num))  }]
  }
  getTables=()=>{
    const { table ,type} = this.props
    if(type=='order'){
      return applyFilters({
        key: 'Filter',
        path: 'dinin__tables',
        params: {
          zone: table.zone
        },
        then:{
          key: 'Reject',
          params:{
            id: table.id
          },
          then:{
            key: 'Reject',
            params:{
              active: null
            }
          }
        }
      })

    }
    else{
      return applyFilters({
        key: 'Filter',
        path: 'dinin__tables',
        params: {
          zone: table.zone,
          active: null
        },
        then: {
          key: "Reject",
          params: {
            id: table.id,
          },
          then:{
            key: 'Reject',
            params:{
              closed: true
            }
          }
        },
      })

    }
  }
  renderTables() {
    const {page} = this.state
    
    
    return map((this.tables), (table, key) => (
      <button key={key} onClick={this.combineTables.bind(this, table)}>{table.name}</button>
    )).slice(8 * (page - 1), 8 * page) 

  }
  handelPageClick = (op) => {
    const { page } = this.state
    let pageMax = Math.ceil((keys(this.tables) || []).length / 8)
    if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
        this.setState({ page: page + op })
    }
  }
  render() {
    const {page}=  this.state
    const {t} = this.props
    let pageMax = Math.ceil((keys(this.tables) || []).length / 8)
    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.seatTitle}>{t("combine Table")}</p>
        <div className={classes.header}>
            <span >{t("With")}:</span>
            <Paging {...{page, pageMax}} handelPageClick={this.handelPageClick}/>
        </div>
        <div className={classes.btnsContainer}>
          {this.renderTables()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
})


export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(ViewTables)))
