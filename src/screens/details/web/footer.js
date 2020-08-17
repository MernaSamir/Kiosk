import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters'
// import Shopping from '../../../../../../assets/images/shopping-cart@2x.png'
import { Badge } from 'antd'
import uuid from 'uuid/v4'
import { map, get, isEmpty, sumBy, round, reject, find, filter, omitBy } from 'lodash'
import classes from './style.less'

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
        const modArr = []
        if (!isEmpty(activePrice.id)) {
            // handleChange({
            //     target: {
            //         name: 'price',
            //         value: activePrice.price

            //     }
            // })            
            // let mod_price = sumBy(list, 'total')
            return round((activePrice.price * quantity), 2)
        }
        else {
            return ''
        }
    }
    renderQuantity = () => {
        const { quantity } = this.state
        const { details, parent, values } = this.props
        // const list = reject(details, d => d.parent)
        // const item = find(list, { id: parent.id })
        return <div className={classes.quantity}>
            <button type='button' onClick={this.minus.bind()}>-</button>
            <p>{quantity}</p>
            <button type='button' onClick={this.add.bind()}>+</button>
        </div>
    }

    add = () => {
        const { quantity } = this.state
        const { handleChange, values } = this.props
        this.setState({
            quantity: quantity + 1
        })

        handleChange({
            target: {
                name: 'quantity',
                value: values.quantity + 1
            }
        })
    }

    minus = () => {
        const { quantity } = this.state
        const { handleChange, values } = this.props
        if (values.quantity > 1) {
            this.setState({
                quantity: quantity - 1
            })
            handleChange({
                target: {
                    name: 'quantity',
                    value: values.quantity - 1
                }
            })

        }
    }
    render() {
        const { activePrice, goBack, item } = this.props
        if(activePrice&&( get(activePrice, 'has_modifiers')||item._type=='ss'||item._type=='ssb'))
        return (
            <div className={classes.footer}>
                {this.renderPriceQuantity()}
                <div className={classes.btnCont}>
                    <button type='button' onClick={goBack}>Back</button>
                        <button type='submit' disabled={isEmpty(activePrice)}>Next - Extras</button>
                {/* <button type='submit' disabled={isEmpty(activePrice)}>Add to Cart</button> */}
                </div>
            </div>
        )
        else{
        return (
            <div className={classes.footer}>
                {this.renderPriceQuantity()}
                <div className={classes.btnCont}>
                    <button type='button' onClick={goBack}>Back</button>
                        {/* <button type='submit' disabled={isEmpty(activePrice)}>Next - Extras</button> */}
                <button type='submit' disabled={isEmpty(activePrice)}>Add to Cart</button>
                </div>
            </div>
        )}
    }
}

export default Footer