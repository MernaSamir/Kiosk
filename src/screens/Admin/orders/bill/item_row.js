import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import { get, round, isEqual, pick } from 'lodash';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'

class ItemRow extends Component {
  
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ["orderDetail","receiptItem",'receipt']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
      }
    refundQuantity=(value)=>{
        const {setMain, detail, handleChange} = this.props
        handleChange({
            target: {
                name: `${detail.id}.quantity`,
                value
            }
        })
        setMain('popup',{popoup:{}})
    }
    checkQty =() =>{
        const { detail, setMain, handleChange} = this.props
        if(detail.quantity - get(detail, 'refQty',0) > 1){
            setMain('orders__receipt_items',{active:detail.id})
            const popup = {
                type: 'QtyRefund', visable: true, width: "50%",
                childProps:{
                    onClick:this.refundQuantity,
                    validateQty:detail.quantity - get(detail, 'refQty',0)
                }
                
            }

            setMain('popup', { popup })
        }
        else{
            handleChange({
                target: {
                    name: `${detail.id}.quantity`,
                    value:1
                }
            })
        }
    }
    quantity = ()=>{
        const{detail, orderDetail, receipt} = this.props
        
        if(get(detail,'details', false)){
            if(receipt._type=='R')
                    return `${detail.quantity*-1}/${orderDetail.quantity}`
            
            else{
                if(get(detail,'refQty',false))
                    return <><span style={{textDecoration:'line-through', color:'#959aa9'}}>{detail.quantity}  </span>
                    {get(detail,'refQty','')}</>
                else
                    return detail.quantity
            }
             
        }
        else 
            return orderDetail.quantity
    }
    renderForm = ()=>{
        const { detail, receiptItem} = this.props
        if(receiptItem){
            return <td>
                {Render([{
                    name: `${detail.id}.check`,
                    type: 'CheckBoxHighlight',
                    onClick:this.checkQty,
                    className: classes.checkBox,
                    disabled: detail.quantity == get(detail, 'refQty', 0) ?true:false
                    
                    
                }])}
            </td>
        }
        return <></>
    }
    

    renderRow = () => {
        const { orderDetail, price, salesItem, salesUnit ,key} = this.props
            return <tr key={key}>
                        {this.renderForm()}
                        <td >{this.quantity()}</td >
                        <td className={classes.bigCell} >{get(salesItem,'name','')} </td>
                        <td >{get(salesUnit,'name','')}</td>
                        <td  >{round(price.price, 2)}</td>
                        <td >{round(orderDetail.quantity * price.price, 2)}</td>
                    </tr>


    }
    render() {
        return (

            this.renderRow()
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        get orderDetail() { return get(state, `orders__details.data.${ownProps.detail.details}`, ownProps.detail) },
        get price() { return get(state, `items__prices.data.${this.orderDetail.item}`, {}) },
        get salesItem() { return get(state, `items__sales_items.data.${this.price.sales_item}`, {}) },
        get salesUnit() { return get(state, `dropdowns__units_of_measure.data.${this.price.sales_unit}`, {}) },
        receiptItem: get(state.orders__receipt_items.item, 'receiptItem',false),
        receipt: get (state.orders__receipt.data, state.orders__receipt.active, {})
    }
}


const wrapper = connect(mapStateToProps, mapDispatchToProps)(ItemRow)
export default withRouter(wrapper);
