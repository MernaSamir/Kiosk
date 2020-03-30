import React, { Component } from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import classes from './style.less'
import {get, filter, map} from 'lodash'
import applyFilter from 'helpers/permissions'
import applyFilters from 'helpers/functions/filters';

class FooterButton extends Component {

    buttons= {
        refund_item:{
            title:'Refund Items',
            type:'button',
            className:classes.btn,
            onClick:'refundItem',
            authorize: ['admin_refund'],
            // authorize: [],
            permissions:{
                receipt:{
                    check:'id',
                    match_val:{key:'_type',val:'F'},
                    refundedQty:'id'
                },
                item:{
                    check_not:'receiptItem'
                }
            }
        },
        done:{
            title: 'Done',
            className: classes.done,
            authorize: ['admin_refund'],
            onClick:'handleSubmit',
            type:'button',
            permissions:{
                receipt:{
                    check:'id',
                    

                },
                item:{
                    check:'receiptItem'
                }
            }
        },
        refund_order:{
            title: 'Refund Order',
            type:'button',
            onClick:'openPopup',
            className:classes.btn,
            authorize: ['admin_refund'],
            permissions:{
                receipt:{
                    check:'id',
                    match_val:{key:'_type',val:'F'},
                    refundedQty:'id'
                }
            }
        },
        reprint: {
            title: 'Reprint',
            type:'button',
            onClick:'reprint',
            className:classes.btn,
            authorize: ['reprint'],
            permissions:{
                receipt:{
                    check:'id',
                    match_val:{key:'_type', val:'F'}
                }
            }
        },
    }
    reprint = ()=>{
        const {setMain, receipt} = this.props;
        setMain('Printing', {
            print: {
                active: 'Receipt',
                receipts: [receipt.id]
            }
        })
    }
    
    handleSubmit=()=>{
        const {handleSubmit} =  this.props
        handleSubmit()
    }
    openPopup = () => {
        const { setMain } = this.props
        const popup = {
            type: 'RefundOrder', visable: true, width: "50%",
            
        }
        setMain('popup', { popup })
        
    }
    refundItem = () => {
        const { setMain } = this.props
        setMain("orders__receipt_items",{item:{receiptItem:true}})
    }
    renderButtons =()=>{
        const {receipt, receiptItem} = this.props
        const refunded = applyFilters({
            key: 'Filter',
            path: "orders__receipt",
            params: {
                parent: receipt.id,
            },
        })

        const refundedItems = applyFilters({
            key: 'Includes',
            path: "orders__receipt_items",
            select: 'receipt',
        }, undefined, undefined, {data: map(refunded, d=>d.id)})
        

        const receiptItems = applyFilters({
            key: 'List',
            path: "orders__receipt_items",
            select: {
                receipt: 'orders__receipt.active',
            },
        })
       
        return filter(this.buttons, applyFilter(receipt,'permissions.receipt',{receiptItems, refundedItems})).filter(
            applyFilter(receiptItem,'permissions.item')).map((d, i)=>{
                return <button disabled={!applyFilters({key: 'authorize', compare: d.authorize})} key={i} className= {d.className}type={d.type} onClick={this.applyFunction.bind(this, d)}>{d.title}</button>
            })

    }
    applyFunction=(action)=>{
        get(this, action.onClick, () => { })()
    }

    render() {
        return (
            <div className={classes.buttonsDiv}>
                {this.renderButtons()}
                </div> 
            
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
        receiptItem: get(state.orders__receipt_items,'item',{}),
        receipt: get( state.orders__receipt.data, state.orders__receipt.active, {} )

})

export default connect(mapStateToProps, mapDispatchToProps)(FooterButton)
