import React, { Component } from 'react'
import moment from "moment"
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
const controls = [
  {
    name: 'amount', label: "Pay In", type: 'NumberField',
    no_keyboard: true,
    // validates: { required: true },
    className: classes.tipsPayO,
  },
]
export default class Station extends Component {
  constructor(props) {
    super(props);
    const {resetForm , values} = this.props
    resetForm({...values,amount:""});
 
  }
  render() {
    const {selectInput} = this.props

    return (
      <div className={classes.tabDiv}>
        <p className={classes.time} >{moment().format('MMM-DD-YYYY hh:mm')}</p>

        {Render(controls,{onClick: selectInput })}
      </div>
    )
  }
}
