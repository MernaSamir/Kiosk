/* eslint-disable no-console */
import React, {Component} from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { get, map, pickBy, filter } from 'lodash'
import ItemRow from './item_row'
import Table_Header from './table_header'
import Bill_Header from './bill_header'
import Bill_Footer from './bill_footer'
import style from './style.less'
import FooterButton from './footer_button'
import Form from 'helpers/wrap/form'
import applyFilters from 'helpers/functions/filters';
import {totalRefundedQty}  from 'helpers'
import { multiRequest } from 'helpers';

class AdminBill extends Component {

    getData = () => {
        multiRequest({
             users:{},
             orders__receipt_items:{},

        })
    }

    componentDidMount() {
        this.getData()
    }
    static onSubmit(props, values, formProps) {
        const {setMain} = props
        let items = applyFilters({
            key: 'picking',
            reduxName: "orders__receipt_items",
           
        }, map( pickBy(values,{check:true}) ,(d,i)=>(i)) )

        console.log('receipt-items', items)
        const details = applyFilters({
            key: 'picking',
            reduxName: 'orders__details',
            select: 'details'
        },items)

        const childs = applyFilters({
            key: 'Includes',
            path: 'orders__details',
            pick: 'id',
            select: 'parent',
            
        }, undefined, undefined, {data: details})
        let receiptItems = applyFilters({
            key: 'Includes',
            path: 'orders__receipt_items',
            pick: 'id',
            select: 'details',
            
        }, undefined, undefined, {data: childs})
        receiptItems= receiptItems.reduce((o, d) => ({ ...o, [d.id]: d }), {})

        items = {...items, ...receiptItems}
        const list = map(items,(d, i)=>{
            return {...d,quantity:get( get(values,i,{}), 'quantity',d.quantity) }
        })
        if(list.length){
            setMain('popup',{popup:{type:'RefundItem',visable:true,
            childProps:{
                list,
                resetForm:formProps.resetForm
            }}})
        }
        else{
             setMain('orders__receipt_items',{item:{receiptItem:false}})
        }
        
    }


    renderRows = () => {
        const { handleChange, field} = this.props
        const details = applyFilters({
            key: 'List',
            path: "orders__details",
            select: {
                order: 'orders__main.active',
            },
            then:{
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        })
        const receipts = applyFilters({
            key: 'List',
            path: "orders__receipt",
            select: {
                order: 'orders__main.active',
            },
        })
   
        if (receipts.length) {
            const refunded = applyFilters({
                key: 'List',
                path: "orders__receipt",
                select: {
                    parent: 'orders__receipt.active',
                },
            })
    
    
            const refundedItems = applyFilters({
                key: 'Includes',
                path: "orders__receipt_items",
                select: 'receipt',
            }, undefined, undefined, {data: refunded.map(d=>d.id)})
            
    
            let receiptItems = applyFilters({
                key: 'List',
                path: "orders__receipt_items",
                select: {
                    receipt: 'orders__receipt.active',
                },
            })
            const details = applyFilters({
                key:'picking',
                reduxName:'orders__details',
                select:'details'
            }, receiptItems)
          
            
            const items = totalRefundedQty(receiptItems, refundedItems)
           
            return map(filter(items,d=>d.price), (r, i) => {
                return <ItemRow key = {i} detail={r} index={i} handleChange={handleChange} field={field} details={details}/>
            })
        }
        else {
            return map(filter(details,d=>d.price), (r, i) => {
                return <ItemRow key={i} detail={r} index={i}/>
            })
        }

    }



    render() {
        const { receiptItem, handleSubmit, activeReciept, t } = this.props
        return (

                <div className={style.payment_bill} >

                    <Bill_Header t={t} />
                    <div className={style.table_div}>

                        <table >
                            <Table_Header  receiptItem={receiptItem} t={t}/>
                            <tbody>
                                {this.renderRows()}
                            </tbody>
                        </table>

                        {activeReciept&& <Bill_Footer t={t} />}
                    </div>
                    
                    <FooterButton handleSubmit={handleSubmit} />
                </div>

        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        order: get(state.orders__main.data, state.orders__main.active, {}),
        get user() { return get(state.users.data, this.order.serve ,{}) },
        get activeReciept() { return get(state, `orders__receipt.data.${state.orders__receipt.active}`, false) },
        receiptItem:get(state.orders__receipt_items.item, 'receiptItem',false),
        item:state.item
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form(AdminBill))
