import React, { Component } from 'react';
import {connect} from 'react-redux';
import {isEmpty, flatten} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import {withRouter} from 'react-router-dom';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';

class PayReceipt extends Component {
    constructor(props) {
        super(props);
        this.orderDetails = applyFilters({
            path: 'orders__details',
            key: 'Filter',
            params: {
                order: props.order
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                }
            }
        })
    }
    reprint = (receipt)=>{
        const { setAll} = this.props
        
        const receipts = applyFilters({
            key: 'calculateReceipts',
            path: 'orders__receipt',
        }, this.orderDetails, undefined, { combine: true, seatsNum: receipt.seats, receipt: receipt.id })
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: { type: "Receipt", receipts: receipts } } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: { } } },
        ])
    }
    reprintAll = (list)=>{
        const { setAll} = this.props
        
        const receipts = flatten(list.map(receipt=>(applyFilters({
                key: 'calculateReceipts',
                path: 'orders__receipt',
            }, this.orderDetails, undefined, { combine: true, seatsNum: receipt.seats, receipt: receipt.id }))))
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: { type: "Receipt", receipts: receipts } } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: { } } },
        ])
    }
    renderButtons() {
        const list= applyFilters({
            key: 'List',
            path: "orders__receipt",
            select: {
                order: 'orders__main.active',
                invoice:null,
                _type:'F'
            }
        })
        this.list = list;
        if(!isEmpty(list)){
            return <>
                {list.map((d, i)=>(
                    <button key={i} onClick={this.reprint.bind(this, d)}>Seat {d.seats.join(', ') || 'All'}</button>
                ))}
            </>
        }
        return <></>
    }
    cancel = () => {
      const { setMain } = this.props
      setMain('popup', { popup: {} })
    }
    render() {
        return <>
            <div className={classes.btnsContanier}>
                {this.renderButtons()}
            </div>
            {this.list && <div className={classes.saveBtns}>
              <button onClick={this.reprintAll.bind(this, this.list)}>Reprint All</button>
            </div>}
        </>
    }
}
const mapStateToProps = (state)=>({
    order: state.orders__main.active
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PayReceipt));
