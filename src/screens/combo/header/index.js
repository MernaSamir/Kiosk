import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom'
class Combo extends Component {

  back = () => {

    const { setMain, history, back } = this.props
    if (back) {
      back()
    }
    else {
      setMain('items__prices', { active: "" })
      setMain('items__combo', { active: "" })
      history.goBack()
    }
  }
  combo = () => {
    const { price } = this.props

    const salesItem = applyFilters({
      key: 'Find',
      path: 'items__sales_items',
      params: {
        id: price.sales_item
      }

    })
    const size = applyFilters({
      key: 'Find',
      path: 'dropdowns__units_of_measure',
      params: {
        id: price.sales_unit
      }

    })
    return `${get(salesItem, 'name', '')} ${get(size, 'name', '')}`
  }
  render() {
    return (
      <div className={classes.header}>
        <button type="button" className={classes.back} onClick={this.back.bind(this)}>
          <FontAwesomeIcon className={classes.icon} icon='arrow-left' /> back
        </button>
        <p>Sales Set: {this.combo()}</p>
      </div>
    )
  }
}




const mapStateToProps = (state) => ({
  price: get(state.items__prices.data, state.items__prices.active, '')



})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Combo))
