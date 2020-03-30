import React, { Component } from 'react'
import  moment from "moment"
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'

const controls = [
  {
      name: 'category', label: "Category", type: 'SelectA',
      app: {
          name: 'pay__category',
          api: 'pay/category/'
      }, 
    // validates: { required: true },
      className: classes.div
  },
  {
      name: 'item', label: "Item", type: 'SelectA',
      app: {
          name: 'pay__item',
          api: "pay/item/"
      }, className: classes.div
  },

  {
      name: 'quantity', label: "Quantity", type: 'NumberField',
      no_keyboard: true,
      // validates: { required: true },
      className: classes.div,
  },
  {
    name: 'amount', label: "Pay Out", type: 'NumberField',
    no_keyboard: true,
    // validates: { required: true },
    className: classes.div,
},
]
export default class Inventory extends Component {
  constructor(props) {
    super(props);
    const {resetForm, values} = this.props
    resetForm({...values,quantity:"", amount:""});
 
  }
  render() {
    const {selectInput} = this.props
    return (
      <div className={classes.tabDiv}>
        <p className={classes.time} >{moment().format('MMM-DD-YYYY hh:mm')}</p>
        {Render(controls, {onClick: selectInput })}
      </div>
    )
  }
}
