import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, round } from 'lodash'
import Details from './../details';
import classes from './../../style.less';

class Row extends Component {

    hasDetails = (orderItem, modifiers) => {
        return <Details orderItem={orderItem} modifiers={modifiers} />
    }

    render() {
        const { orderItem, modifiers, price = {}, size, item } = this.props;

        return (
            <>
                <tr >
                    <td className={classes.small}>{round(orderItem.quantity, 10)}</td>
                    <td className={classes.big}>{item.name} </td>
                    <td className={classes.small}>{size.name}</td>
                    <td className={classes.small}>{price.price}</td>
                    <td className={classes.midum}>{price.price * round(orderItem.quantity, 10)}</td>
                </tr>
                {this.hasDetails(orderItem, modifiers)}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    price: get(state, `items__prices.data.${ownProps.orderItem.item}`, {}),
    get size() { return get(state, `units.data.${this.price.sales_unit}`, {}) },
    get item() { return get(state, `items__sales_items.data.${this.price.sales_item}`, {}) },
})

export default connect(mapStateToProps)(Row)