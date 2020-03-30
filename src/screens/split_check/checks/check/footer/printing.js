import React, { Component } from 'react'
import classes from './style.less'
import applyFilter from 'helpers/permissions'
import {filter, get, head, map, isEqual} from 'lodash'
import applyFilters from 'helpers/functions/filters'

class Printing extends Component {
    actions = {
        print:{
            title:'print',
            action: 'print',
            authorize: ['print'],
            permissions:{
                seat: {
                    check_list: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },
                    not_included: { key: 'seat_num', list: "receipts" },
                    check_not_voided: { key: 'seat_num', list: "orderDetails" },
                    check:'seat_num'
                }
            }
        },
        reprint:{
            title: 'reprint',
            authorize: ['reprint'],
            action: 'reprintReceipt',
            permissions: {
                seat: {
                    check_receipt_seat: { key: 'seat_num', list: "receipts" },
                    // check_Fired: { key: 'seat_num', compare: 'fired_time', list: "orderDetails" },
                    not_included_list: { key: 'seat_num', list: "receipts" },
                    check:'seat_num'
                }
            }

        }
    }
    print = (seatsNum=[this.props.seat_num],receipt={}) => {
        const {setAll, order} = this.props
        const orderDetails = applyFilters({
            key:'Filter',
            path:'orders__details',
            params:{
                order:order.id,
            },
            then:{
                key:'Reject',
                params:{
                    deleted: true
                }
            }
        })
        const receipts = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, orderDetails, undefined, { combine: true, seatsNum, receipt:receipt.id })
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: { type: "Receipt", receipts: receipts } } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: { } } },
        ])
    }
    reprintReceipt = () => {
        const { receipt } = this.props
        this.print(receipt.seats, receipt)
    }
    // eslint-disable-next-line consistent-return
    calculateBill=()=>{
        const {order, receipt} = this.props
        
        const orderDetails = applyFilters({
            key:'Filter',
            path:'orders__details',
            params:{
                order:order.id,
            }
        })
        if(receipt){
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
              const one = map(items, d=>(d.id)).sort()
              const two = map(head(calc).items,d=> (d.id)).sort()
            if(  !( head(calc).net_total == receipt.net_total &&  isEqual(one, two)  ) ){
                return <span>You Have Made Changes To The Receipt You Should Reprint</span>
            }
        }
    }
    
    takeAction = (action, ev) => {
        get(this, action.action, () => { })()
    }
    renderBtns=()=>{
        const {seat_num, order} = this.props
        const receipts = applyFilters({
            key:'Filter',
            path:'orders__receipt',
            params:{
                order:order.id
            }
        })
        const orderDetails = applyFilters({
            key:'Filter',
            path:'orders__details',
            params:{
                order:order.id,
                seat_num,
                parent:null
            },
            then:{
                key:'Reject',
                params:{
                    deleted: true
                }
            }
        })
      
        return filter(this.actions, applyFilter({seat_num }, 'permissions.seat', { receipts, orderDetails })).map((action, index) => (
            <button key={index} disabled={!applyFilters({key:'authorize', compare: action.authorize})} 
             onClick={this.takeAction.bind(this, action)}>
                {action.title}
            </button>
        ))
    }
    render() {
        return (
            <div className={classes.pay}>
                {this.calculateBill()}
                {this.renderBtns()}
            </div>
        )
    }
}
export default Printing

