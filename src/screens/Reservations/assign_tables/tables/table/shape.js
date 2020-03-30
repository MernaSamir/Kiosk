import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, find, filter, isEqual, pick} from 'lodash'
import classes from './style.less'
import { getSize } from 'helpers/index';
import moment from 'moment';


class TableRectancle extends Component {
  
    renderGuests = ()=>{
      const {reservation= false} = this.props
        if(reservation)
          return <span  >G: {reservation.guest}</span>
    }
    
    getReservations = () => {
      const {date, reservation_list, table} =  this.props
      const reservations = filter(reservation_list, d => moment(d.date).isSame( date,'day'))
      return get( find(reservations,{table:table.id}), 'hour', '')
  }
  shouldComponentUpdate(nextProps, nextState) {
    const compare = ["reservation",'activeReservation']
    return !isEqual(pick(this.props, compare), pick(nextProps, compare))
  }
  renderClass =()=>{
      const {reservation, activeReservation, table}= this.props
      if(!reservation && activeReservation) 
        return ` ${get(classes, table.shape,{})} ${classes.selected}`
      return get(classes, table.shape,{})
  }


  render() {

    const { table, unit, reservation, onClick} = this.props
    const size = getSize(table.shape, table.size, unit)
    
    return (
      <div
        onClick={onClick.bind(this)}  
        className={this.renderClass()}
        style={{ width: `${size.width}vw`, height: `${size.height}vw` }}>

        <div className={classes.start}>
          <div className={classes.tableTitle} >{table.name}</div>
          {this.renderGuests()}
        </div>

        <div className={classes.status}>
          <span>{get(reservation, 'hour', '')}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: get(state.orders__main.data, ownProps.table.active, {}),
  reservation_list: get(state.parties__reservation, 'data', {}),
  date:get(state.parties__reservation, 'selectedDate',''),
  activeReservation: get(state.parties__reservation, 'active', false)
})

const wrapper = connect(mapStateToProps)(TableRectancle)

export default withRouter(wrapper)
