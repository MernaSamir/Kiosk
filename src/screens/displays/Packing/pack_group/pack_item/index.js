import React, { Component } from 'react'
import classes from './style.less'
import { get, round, map } from 'lodash'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import applyFilters from 'helpers/functions/filters'
class PackItem extends Component {

    state = {
        bool: false,
    }

    buttonFunction = () => {
        this.setState({
            bool: true
        })
    }

    serve = () => {
        const { orderDetail, setMain } = this.props
        setMain('orders__details', {
            item: {
                action: "update", id: orderDetail.id, status: 'served', serve_time: new Date(),
                onSuccess: this.cancel
            }
        })
    }

    cancel = () => {
        this.setState({
            bool: false
        })
        return [];
    }

    renderItemStatus = (item) => {
        const cls = applyFilters({key: 'packItemStatus', time: this.props.time, to: item.fired_time, late: 10, voided: this.voided}, item, undefined);
        return get(classes, cls)
    }

    renderModifiersList = (modifierslist) => {
        const { prices, items } = this.props
        return map(modifierslist, (d) => {
            const price = get(prices, d.item, {})
            const item = get(items, price.sales_item, {})
            return item.name
        }).join(', ')
    }

    renderItemContent = () => {
        const { orderDetail, doneness } = this.props
        const modifierslist = applyFilters({
            key: 'Filter', 
            path: "orders__details", 
            params: {
                parent: orderDetail.id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        })
        let str = ''
        if (modifierslist.length > 0) {
            str += `(${this.renderModifiersList(modifierslist)})`
        }
        if (doneness) {
            str += ` (${doneness.name})`
        }
        return str
    }

    render() {
        const { quantity, _item, _unit, orderDetail } = this.props
        const { bool } = this.state
        this.voided = applyFilters({
            path: 'orders__details',
            key: 'Filter',
            params:{
                void: orderDetail.id
            },
            then: {
                key: 'SumBy',
                col: "quantity"
            }
        })
        return (bool ?
            <div className={classes.serveItem}>
                <div className={classes.serve} onClick={this.serve.bind()}>Serve</div>
                <div className={classes.cancel} onClick={this.cancel.bind()}>
                    <FontAwesomeIcon className={classes.icon} icon="times" /></div>
            </div>

            : <div className={`${classes.packItem}  ${this.renderItemStatus(orderDetail)}`}
                // onClick={(pack.status == "ready") && this.buttonFunction.bind()}>
                onClick={this.buttonFunction.bind()}>

                <div className={classes.qty}>{`${round(quantity, 1)}${this.voided ? `(V${this.voided})`:''}`}</div>
                <div className={classes.item}>
                    {`${get(_item, 'name')} (${get(_unit, 'name')}) ${this.renderItemContent()}`}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    prices: state.items__prices.data,
    items: state.items__sales_items.data,
    _price: get(state.items__prices.data, props.orderDetail.item),
    doneness: get(state.dropdowns__doneness.data, props.orderDetail.doneness),
    get _item() { return get(state.items__sales_items.data, this._price.sales_item) },
    get _unit() { return get(state.dropdowns__units_of_measure.data, this._price.sales_unit) },
    time: state.main.time
});

export default connect(mapStateToProps)(PackItem)