import React, { Component } from 'react'
import moment from 'moment'
import classes from './style.less'


export default class Header extends Component {
    
    render() {
        const {order, seat} = this.props
        return (
            <div className={classes.header}>
                    <p>{ moment(order.start_time).format('DD/MM/YYYY, hh:mm A')} </p>
                    <p>{seat==0?'Shared Order':`Order ${order.num}, Seat #${seat}/ ${order.guests_num}`} </p> 
            </div>
        )
    }
}

