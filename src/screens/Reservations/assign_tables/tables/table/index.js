import React, { Component } from 'react'
import Shape from './shape'
import {connect} from 'react-redux'
import { get, filter, find} from 'lodash';
import mapDispatchToProp from 'helpers/actions/main'
import moment from 'moment';

class Table extends Component {

  getReservations = () => {
    const {date, reservation_list, table} =  this.props
    const reservations = filter(reservation_list, d => moment(d.date).isSame( date,'day'))
    return find(reservations,{table:table.id})
  }
  assignTable =()=>{
    const {setMain, active, table} = this.props
    const reservation = this.getReservations()
    if(!reservation){
      setMain('parties__reservation',{item:{id:active, action:'update',table:table.id, onSuccess(){
          return [
            {type: 'set_path_parties__reservation', path: `data.${active}.table`, data: table.id}
          ]
      }}})
    }
  }
  render() {
    const { table, unit } = this.props
         return (
          <Shape {...{table ,unit}} reservation={this.getReservations()} onClick={this.assignTable}/>
      )

  }
}
const mapStateToProps =(state)=>({
  reservation_list: get(state.parties__reservation, 'data', {}),
  date:get(state.parties__reservation, 'selectedDate',''),
  active: get(state.parties__reservation,'active','')
})
export default connect (mapStateToProps, mapDispatchToProp)(Table)

