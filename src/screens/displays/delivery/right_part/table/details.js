import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, map, pickBy } from 'lodash'

class Details extends Component {

    renderDetails = () => {
        const { details, id } = this.props
        return map(pickBy(details, { order: id, parent: null, deleted: false }), d => (
            this.renderTr(d)
        ))
    }

    renderTr = (element) => {
        return <tr>
            <td></td>
            {this.renderItemDetails(element)}
            <td colSpan="3">{element.notes}</td>
            {this.renderSizeQuantity(element)}
        </tr>
    }

    renderItemDetails = (element) => {
        const { prices, items, details } = this.props
        const price = get(prices, element.item, {})
        const item = get(items, price.sales_item)
        const modifiersList = pickBy(details, { parent: element.id })
        return <td>{`${item.name} ${this.renderModifiers(modifiersList)}`}</td>
    }

    renderModifiers = (list) => {
        if (Object.keys(list).length >= 1) {
            return `( ${this.renderModifierDetails(list)} )`
        }
        return ``
    }

    renderModifierDetails = (list) => {
        const { prices, items } = this.props
        return map(list, d => {
            const price = get(prices, d.item, {})
            const item = get(items, price.sales_item)
            return ` ${item.name} `
        })
    }

    renderSizeQuantity = (element) => {
        return <td>{`${this.renderItemSize(element)} ${'\xa0 \xa0 \xa0'} ${element.quantity}`}</td>
    }

    renderItemSize = (element) => {
        const { prices, units } = this.props
        const price = get(prices, element.item, {})
        const size = get(units, price.sales_unit)
        return size.name
    }

    render() {
        return (
            this.renderDetails()
        )
    }
}

const mapStateToProps = (state) => ({
    details: get(state.orders__details, 'data', {}),
    prices: get(state.items__prices, 'data', {}),
    units: get(state.dropdowns__units_of_measure, 'data', {}),
    items: get(state.items__sales_items, 'data', {}),
})

export default connect(mapStateToProps)(Details)