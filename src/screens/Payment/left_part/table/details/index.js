import React, { Component } from 'react'
import { connect } from 'react-redux'
import classes from './../../style.less';
import { map, get, pick } from 'lodash';

class Details extends Component {

    renderDoneness = (doneness) => {
        return <tr>
            <td className={classes.small}>(D)</td>
            <td className={classes.big}>{doneness}</td>
        </tr>
    }

    renderNote = (notes) => {
        return <tr>
            <td className={classes.small}>(N)</td>
            <td className={classes.big}>{notes}</td>
        </tr>
    }

    renderModifiers = (modifiers) => {
        const { prices, items } = this.props

        return < tr >
            <td className={classes.small}>(M)</td>
            <td className={classes.big}>
                {
                    map(modifiers, d => {
                        let price = get(prices, d.item, {})
                        let item = get(items, price.sales_item, {})
                        return `${item.name} , `
                    })
                }
            </td>

        </tr >
    }

    render() {
        const { orderItem, modifiers } = this.props
        return (
            <>
                {orderItem.doneness && this.renderDoneness(orderItem.doneness)}
                {orderItem.notes && this.renderNote(orderItem.notes)}
                {modifiers.length > 0 && this.renderModifiers(modifiers)}
                <div className={classes.border}></div>
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    prices: pick(state.items__prices.data, map(ownProps.modifiers, d => d.item)),
    get items() { return pick(state.items__sales_items.data, map(this.prices, d => d.sales_item)) },
})

export default connect(mapStateToProps)(Details)