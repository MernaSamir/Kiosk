import React, { Component } from 'react'
import Collapse from 'screens/ordering/bill/orders/collapse'
import Orders from 'screens/ordering/bill/orders'
import {connect} from 'react-redux'
import {get} from 'lodash'
class Seats extends Component {
    renderSeats = () => {
        const {order} = this.props
        let listOfSeats = [];
        for (let i = 0; i <= order.guests_num; i++) {
            // table.seats.push({ seatNum: i, seatOrders: this.filterBill(i) })
            listOfSeats.push(< Collapse seat_num={i} name={`seat ${i}`}  id={`seat${i}`} >
               <Orders seat_num={i}>
                </Orders>
            </Collapse >)
        }
        return listOfSeats
    }

  render() {
    return (
    this.renderSeats()

    )
  }
}
const mapStateToProps = (state) =>({
    order: get(state.orders__main, `data.${state.orders__main.active}`,{})

})
export default connect(mapStateToProps)(Seats)
