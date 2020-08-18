import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters'
import uuid from 'uuid/v4'
import { map, get, isEmpty,round } from 'lodash'
import classes from './style.less'
import { getInfo } from 'helpers/functions/get_item_info'
import { withRouter } from 'react-router-dom'

class Footer extends Component {

    state = {
        quantity: !isEmpty(this.props.parent) ? this.props.parent.quantity : 1
    }

    renderPriceQuantity = () => {
        return <div className={classes.total_price}>
            <p>{`£${this.checkTotalPrice()}`}</p>
            {this.renderQuantity()}
        </div>
    }

    checkTotalPrice = () => {
        const { activePrice, parent, handleChange } = this.props
        const { quantity } = this.state
        if (!isEmpty(activePrice.id)) {
            return round((activePrice.price * quantity), 2)
        }
        else {
            return ''
        }
    }
    renderQuantity = () => {
        const { quantity } = this.state
        return <div className={classes.quantity}>
            <button type='button' onClick={this.minus.bind()}>-</button>
            <p>{quantity}</p>
            <button type='button' onClick={this.add.bind()}>+</button>
        </div>
    }

    add = () => {
        const { quantity } = this.state
        this.setState({
            quantity: quantity + 1
        })
    }

    minus = () => {
        const { quantity } = this.state
        if (quantity > 1) {
            this.setState({
                quantity: quantity - 1
            })

        }
    }
    // gotoCart = () => {
    //     const { appendPath, history, activeDetail, items } = this.props
    //     const { quantity } = this.state
    //     appendPath('form_actions', `details.${[activeDetail]}`, { add: true, quantity })
    //     map(items, d => {
    //         let price = applyFilters({ path: `items__prices.data.${d.item}` })
    //         const info = getInfo(d, 'item')
    //         const { name, size } = info
    //         const id = uuid()
    //         // if(alter.has_alter)
    //         const values = {
    //             id,
    //             ...d,
    //             price: price.price,
    //             parent: activeDetail,
    //             name,
    //             size,
    //             price_id: price.id,
    //             // parent_check: true

    //         }
    //         appendPath('form_actions', `details.${[id]}`, { ...values })

    //     })

    //     history.push('/cart')
    // }
    render() {
        const { activePrice, goBack, item } = this.props
        return (
            <div className={classes.footer}>
                {this.renderPriceQuantity()}
                <div className={classes.btnCont}>
                    <button onClick={() => this.props.history.goBack()}>Back</button>
                    {/* <button type='submit' disabled={isEmpty(activePrice)}>Next - Extras</button> */}
                    <button disabled={isEmpty(activePrice)} onClick={()=>this.props.history.push('/ssb-items')}>Next</button>
                </div>
            </div>
        )
        //}
    }
}

export default withRouter( Footer)