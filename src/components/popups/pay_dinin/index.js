import React, { Component } from 'react';
import {connect} from 'react-redux';
import { isEmpty, head, map, get, xor} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import {withRouter} from 'react-router-dom';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import {message} from 'antd';

class PayReceipt extends Component {
    calculateBill=(receipt)=>{
        const orderDetails = applyFilters({
            key:'Filter',
            path:'orders__details',
            params:{
              order: receipt.order  
            }
        })
        const calc = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, orderDetails, undefined, { receipt: receipt.id, seatsNum:receipt.seats, combine: true })
        const items = applyFilters({
            key: 'Filter',
            path: 'orders__receipt_items',
            params: {
              receipt: receipt.id
            }
          })
      
          const one = map(items, d=>(d.id))
          const two = map(head(calc).items, d=>d.id)
          const diff = xor(one, two)
          return head(calc).net_total == receipt.net_total && !diff.length
    }


    pay = (d)=>{
        const {setMain, history} = this.props;
        const pay = this.calculateBill(d)
        if(pay){

            setMain("orders__receipt", {active: d.id});
            this.props.onCancel()
            history.push('/Home/payment');
        }
        else{
            message.warning('You Have To Reprint')
        }

    }
    getName=(receipt)=>{
        const list = map(receipt.seats, d=>{
            const seat = applyFilters({
                key:"Find",
                      path:'orders__order_seats',
                      params:{
                          order:receipt.order,
                          seat_num: d
                      }
              })
            if(seat)
              return seat.note
            else
              return d
        })
        return `Seat ${list.join(',')}`
    }
    renderButtons() {
        const {order} = this.props
        const list= applyFilters({
            key: 'Filter',
            path: "orders__receipt",
            params: {
                order:order,
                invoice:null,
                _type:'F'
            }
        })
        if(!isEmpty(list))
        return list.map((d, i)=>(
            <button key={i} onClick={this.pay.bind(this, d)}>{this.getName(d)} </button>
        ))
        else
        return <div className={classes.noActive}>No Active Receipt to Pay</div>
    }

    render() {
        return (
            <div className={classes.btnsContanier}>
                {this.renderButtons()}
            </div>
        );
    }
}
const mapStateToProps = (state)=>({
    order: get(state.orders__main, 'active', ''),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PayReceipt));
