import React, { Component } from 'react'
import moment from "moment"
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
const cont1=[
  {
    name: 'customer', label: "Customer", type: 'SelectA',
    app: {
        name: 'parties__customer',
        api: "parties/customer/"
    }, 
    className: classes.div
},
]
const cont2 = [
  {
    name: 'amount', label: "Pay In", type: 'NumberField',
    no_keyboard: true,
    // validates: { required: true },
    className: classes.tipsPayO,
},
]
export default class ledger extends Component {
  constructor(props) {
    super(props);
    const {resetForm, values} = this.props
    resetForm({...values,amount:""});
 
  }
  render() {
    const {selectInput} = this.props
    return (
      <div className={classes.tabDiv}>
        <p className={classes.time} >{moment().format('MMM-DD-YYYY hh:mm')}</p>
        {Render(cont1, { onClick: selectInput })}
        {/* <p className={classes.time}>Balance: 500.000</p> */}
        {Render(cont2, { onClick: selectInput })}
      </div>
    )
  }
}
