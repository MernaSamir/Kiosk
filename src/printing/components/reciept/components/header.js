import React, { Component } from 'react'
import { connect } from 'react-redux';
import { get } from 'lodash'
import applyFilters from 'helpers/functions/filters'
import moment from 'moment'
import classes from '../style.less'
import Image from 'components/img'
class ReceiptHeader extends Component {

    getSeat = () => {
        const { receipt, seat_num } = this.props
        if (get(receipt.seats, 'length', 0) == 1) {

            const seat = applyFilters({
                key: 'Find',
                path: "orders__order_seats",
                params: {
                    seat_num: receipt.seats[0],
                    order: receipt.order
                }
            })
            if (seat){
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
                return receipt.seats[0]
            }
        }
        else {
         
            if(receipt.id== seat_num.receipt){

                return seat_num.seat_num
            }
        }
    }
    
    render() {
        const { station, mode, user, order, receipt, table, translate, receipt_settings={} } = this.props
        
        return (
            <div className={classes.headerCon}>
                <div className={classes.logo}>
                    <Image src={`${localStorage.getItem('ip_address')}${receipt_settings.logo}`}  />
                </div>
                <div></div>
                <div className={classes.location}><p >{station.full_name}</p></div>
                <div className={classes.details}>

                    <div className={classes.part}>
                        <div><p >{moment(receipt.created_at).format('DD-MM-YYYY')}</p></div>
                        <div><p >{translate("Order")} {order.num}</p></div>
                        <div><p >{translate("Receipt")} {receipt.invoice || translate('For Review')}</p></div>
                        <div><p >{translate("Print #")} {receipt.printing_count || 1}</p></div>
                        {mode.key == "DI" && <div><p >{translate("Table")} {table.name} </p></div>}
                    </div>
                    <div className={classes.part} >
                        <div><p >{translate(mode.name)}</p></div>
                        <div><p >{translate("Opened")} {moment(receipt.created_at).format('hh:mm')}</p></div>
                        <div><p >{translate("Paid")} {receipt.paid_time ? moment(receipt.paid_time).format('hh:mm') : translate('Not Yet')}</p></div>
                        <div><p >{translate("Server")} {user.first_name}</p></div>
                        {mode.key == "DI" && <div><p >{translate("Guests")} {receipt.seats.length || 0.9}</p></div>}
                        {mode.key == "DI"&&<div><p >{translate("Seat")}:{this.getSeat()}</p></div> }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    order: get(state.orders__main.data, props.receipt.order, {}),
    get table() { return get(state.dinin__tables.data, this.order.table, {}) },
    get mode() { return get(state.settings__mode.data, this.order.mode, {}) },
    station: get(state.licensing__station.data, state.licensing__station.active),
    user: get(state.main, 'current', {}) || {},
    seat_num: get(state.orders__receipt, 'seat_num', ''),
})

export default connect(mapStateToProps, null)(ReceiptHeader)