import React, { Component } from 'react'
import {connect} from 'react-redux'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import {get, map, sumBy, toArray} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
class RefundItems extends Component {
  componentDidMount=()=>{
  }
  static onSubmit(props, values) {
    const {setMain, list} = props
    setMain('popup',{popup:{type:'RefundOrder',visable:true,
    childProps:{
      listItems:list,
      payments:values
    }
  }})
}
  renderItems=()=>{
    const {list} = this.props
    

    const details = applyFilters({
      key: 'picking',
      reduxName: "orders__details",
      select: 'details',
      }, list)

      const prices = applyFilters({
        key: 'picking',
        reduxName: "items__prices",
        select: 'item',
        }, details)

      const items = applyFilters({
        key: 'picking',
        reduxName: "items__sales_items",
        select: 'sales_item',
        }, prices)

      return map(list,(d, i)=>{
        const detail = get(details,d.details,{})
        const price =get(prices,detail.item,{})
        const item = get(items,price.sales_item,{})
        return <tr key={i}>
          <td>{d.quantity}</td>
          <td>{item.name}</td>
          <td>{d.price}</td>
        </tr>
      })
  }
  getTotal=()=>{
    const {list} = this.props
  
     const details = applyFilters({
      key: 'picking',
      reduxName: "orders__details",
      select: 'details',
      }, list)
      return sumBy(toArray(details), 'price')
  }
 
  paymentTypes = () =>{
      const { receipt } = this.props
      const payments = applyFilters({
          key: 'Filter',
          path: "orders__payment",
          params: {
              receipt: receipt,
          },
      })
      
      const paymentTypes = applyFilters({
          path: 'payment__types',
      })
      return payments.map((d,idx)=>(
          <span key={idx}>{get(paymentTypes,d.payment_type,'').name} : {d.value} </span> 
         
      ))

  }
  paymentMethods =()=>{
    const { receipt } = this.props
      const payments = applyFilters({
          key: 'Filter',
          path: "orders__payment",
          params: {
              receipt: receipt,
          },
      })
      if(payments.length >1){

        const paymentTypes = applyFilters({
            path: 'payment__types',
        })
        return payments.map((d,idx)=>(
          Render([{
              type: "TextBox",
              label: get(paymentTypes,d.payment_type,'').name,
              name: get(paymentTypes,d.payment_type,'').id,
              className: classes.inputField,
              validates: { maxNumber: d.value}
          }])
      ))
      }
      
  }
  onCancel=()=>{
    const {onCancel, setMain, resetForm} = this.props
    setMain ('orders__receipt_items',{item:{receiptItem:false}})
    resetForm({})
    onCancel()
  }
  render() {
    return (
      <div className={classes.container}>
        <p>Refund Items</p>
         <div className={classes.table}>
          <table>
              {this.renderItems()}
          </table>
          <p>Total Refund Value: {this.getTotal()}</p>
        </div>
        <div className={classes.payment}>
          <p>payment Method:</p>
          <div className = {classes.first_div}>
            {this.paymentTypes()}
          </div>
          <div className={classes.methods}>
            {this.paymentMethods()}
          </div>
        </div>

        <div className={classes.saveBtns}>
          <button onClick={this.onCancel}>Cancel</button>
          <button type='submit'>Next</button>
        </div>
      </div> 
    )
  }
}
const mapStateToProps =(state)=>({
  receipt : get(state.orders__receipt, 'active', '')
})
export default connect(mapStateToProps, mapDispatchToProps)(Form(RefundItems))