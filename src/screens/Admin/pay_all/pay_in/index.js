import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import { get, find } from 'lodash'
import Ledger from './tabs/ledger_sett'
import Fund from './tabs/fund_drawer'

export default class PayIn extends Component {
  state = {
    activeTab: "Ledger Settlement"
  }
  tabs = [
    { name: "Ledger Settlement", Component: Ledger },
    { name: "Fund Drawer", Component: Fund },
  ]
  renderTabs = () => {
    return Render([{
      name: "sub_type",
      type: 'selectButtons',
      selectFirst: true,
      validates: {
        required: true},
      className: classes.inputButton,
      options: [
        { id: 'LS', name: 'Ledger Settlement' },
        { id: 'FD', name: 'Fund Drawer' },
      ],
      onClick: this.setActive

    }])
  }
  setActive = (d) => {
    this.setState({ activeTab: d.name }, () => {
    })
  }

  render() {
    const Component = find(this.tabs, { name: this.state.activeTab })
    const {selectInput, resetForm , values} = this.props

    return (
      <div className={classes.allPayIn}>
        {this.renderTabs()}
        {get(this.state, 'activeTab', false) && Component.Component &&
         <Component.Component selectInput={selectInput} resetForm={resetForm} values={values}/>}

      </div>
    )
  }
}
