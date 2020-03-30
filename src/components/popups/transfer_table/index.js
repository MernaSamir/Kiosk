import React, {Component} from 'react'
import classes from './style.less'
import { get, map, keys } from 'lodash';
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import Paging from 'components/paging'

class ViewTables extends Component {
    state={
      page:1
    }
    constructor(props){
      super(props);
      this.tables = this.getTables();
    }
    getTables(){
      const {table} = this.props;
      return applyFilters({
        key: "Filter",
        path: "dinin__tables",
        params: {
          active: null,
        },
        then: {
          key: "Reject",
          params: {
            closed: true
          },
          then: {
            key: 'Reject',
            params: {
              id: table.id
            }
          }
        },
      })
    }

    updateTables = (order)=>{
        const {table} = this.props
        return [
          {type: 'set_path_dinin__tables', path: `data.${order.table}.active`, data: order.id},
          {type: 'set_path_dinin__tables', path: `data.${table.id}.active`, data: null},
          {type: 'set_main_popup', data: {popup:''}}
        ]
    }
    transfer = (table) =>{
        const {order, setMain} = this.props
        setMain('orders__main', {
            item:{
                id:order.id,
                table:table.id,
                action:'update',
                onSuccess: this.updateTables
            }
        })
    }
    handelPageClick = (op) => {
      const { page } = this.state
      let pageMax = Math.ceil((keys(this.tables) || []).length / 8)
      if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
          this.setState({ page: page + op })
      }
    }
  renderTables(){
    const {page} = this.state
    return map((this.tables), (table,key) =>(
      <button key={key} onClick={this.transfer.bind(this,table)}>{table.name}</button>
    )).slice(8 * (page - 1), 8 * page) 

  }
  render() {
    const {page}=  this.state
    let pageMax = Math.ceil((keys(this.tables) || []).length / 8)
    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.seatTitle}>Transfer Table</p>
        <div className={classes.header}>
            <span >To:</span>
            <Paging {...{page, pageMax}} handelPageClick={this.handelPageClick}/>
        </div>
        <div className={classes.btnsContainer}>
            {this.renderTables()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) =>({
    table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
    get order() { return get(state.orders__main.data, this.table.active) },
})


export default connect(mapStateToProps, mapDispatchToProps)(ViewTables)
