import React, { Component } from 'react'
import { map,  get } from 'lodash'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import applyFilters from 'helpers/functions/filters'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'

class DiscountOrder extends Component {
    cancelDiscount = (discount) => {
        const { setMain } = this.props
        setMain('orders__orders_discount', {
            item: {
                action: 'delete',
                id: discount.id
            }
        })
    }

    renderOrderDiscounts = () => {
        const {discounts, order } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: 'orders__orders_discount.data',
            params: {
                order
            }
        })
        // console.log(list)
        return map(list, (d, key) => {
            let discount = get(discounts, d.discount, {})
            return <button key={key} > {discount.name} ({discount.value} {discount.is_percent && '%'})
                    <FontAwesomeIcon icon="times" className={classes.icon} onClick={this.cancelDiscount.bind(this,d)} />
                </button>
            }
        )


    }
    render() {
        return (
            <div className={classes.discountOredr}>
                {this.renderOrderDiscounts()}
            </div>
        )
    }
}

const mapStateToProps = (state) =>({
    discounts: state.discount__main.data,
    orderDisount: state.orders__orders_discount.data,
    order: state.orders__main.active

})
export default connect(mapStateToProps, mapDispatchToProps)(DiscountOrder)
