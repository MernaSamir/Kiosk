import React, { Component } from 'react'
import ActionComponent from './action_component'
import MainComponent from './main';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import { get } from 'lodash'

const renderHeader = (mode) => {
  return <thead>
    <tr className={classes.borderBottom} >
      <th className={classes.leftPadding}>Qty</th>
      <th >Item</th>
      <th >Size</th>
      <th >{mode == 'TW' ? 'Each' : 'Course'}</th>
      <th >Total</th>
      <th ></th>
    </tr>
  </thead>
}
class TakeAwayClass extends Component {

  render() {
    const { handleChange, list ,field } = this.props
    return (
      <div className={classes.tableDiv}>
        <table >
          {renderHeader('TW')}
          <MainComponent handleChange={handleChange} list={list} field={field}/>
        </table>
      </div>
    )
  }
}

export const TakeAway = ActionComponent(connect(null, mapDispatchToProps)(TakeAwayClass))
