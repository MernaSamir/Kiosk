import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import MenuCategory from './MenuCategory'
// import './main-cat.css'

class OrderList extends Component {
  constructor(props) {
    super(props);
    const activeItem = applyFilters({
      key: 'mapSelect', select: {
        menu: 'items__sales_items.active'
      }
    })
    if (activeItem) {
      props.setMain("items__sales_items", { active: '' })
    }
  }
  render() {
    const { match } = this.props
    return <MenuCategory match={match} />
  }
}

export default connect(null, mapDispatchToProps)(OrderList)

