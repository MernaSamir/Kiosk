import React, { Component } from 'react';
import { map } from 'lodash'
import classes from './style.less';
import applyFilters from 'helpers/functions/filters'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'

class DiscountTypes extends Component {

    constructor(props) {
        super(props);
        this.item = applyFilters({
            path: 'orders__orders_discount.item'
        })
        this.list = applyFilters({
            path: 'discount__main',
            key: 'Filter',
            params: {
                active: true
            }
        })
    }

    handelDiscoutTypeChange = (active) => {
        const { setAll, order } = this.props
        setAll([
            { type: 'set_main', app: 'discount__main', data: { active } },
            {
                type: 'set_main', app: 'orders__orders_discount', data: {
                    item: {
                        order: order,
                        discount: active,
                        ...this.item,
                        action: 'add',
                    }
                }
            }
        ])
    }

    componentWillUnmount() {
        const { setMain } = this.props;
        setMain('orders__orders_discount', { item: {} })
    }

    renderDiscounts = () => {
        const { active } = this.props;

        return map(this.list, (d, i) => (
            <button className={d.id == active ? classes.active : ''}
                onClick={this.handelDiscoutTypeChange.bind(this, d.id)}
                key={i}>
                {d.name} ( {d.value}{d.is_percent && '%'} )
                </button>
        ))
    }
    render() {
        return (
            <div className={classes.discounts}>
                {this.renderDiscounts()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    active: state.discount__main.active,
    order: state.orders__main.active,
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountTypes);
