import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import { get, find } from 'lodash'
import BuyInv from './tabs/buy_inventory'
import Tips from './tabs/tips'
import Other from './tabs/other'

export default class PayIn extends Component {
  state = {
    activeTab: "Buy Inventory"
  }
  tabs = [
    { name: "Buy Inventory", Component: BuyInv },
    { name: "Non Cash Tips", Component: Tips },
    { name: "Other", Component: Other },

  ]
  renderTabs = () => {
    const {t} = this.props
    return Render([{
      name: "sub_type",
      type: 'selectButtons',
      selectFirst: true,
      className: classes.inputButton,
    
      validates: {
        required: true
    },
      options: [
        { id: 'BI', name: 'Buy Inventory' },
        { id: 'NC', name: 'Non Cash Tips' },
        { id: 'Other', name: 'Other' },
      ],
      onClick: this.setActive

    }])
  }
  setActive = (d) => {
    this.setState({ activeTab: d.name }, () => {
    })
  }

  render() {
    const {selectInput, resetForm  ,values} = this.props

    const Component = find(this.tabs, { name: this.state.activeTab })

    return (
      <div className={classes.allPayIn}>
        {this.renderTabs()}
        {get(this.state, 'activeTab', false) && Component.Component &&
         <Component.Component selectInput={selectInput} resetForm={resetForm} values={values}/>}

      </div>
    )
  }
}
