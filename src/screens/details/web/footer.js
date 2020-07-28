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
        //  const modArr = this.renderModifiersList()
        const modArr = []
        // let list = this.getList()

        // list = !isEmpty(parent) ? list.length > 0 ? [...list, ...modArr] : [...modArr] : list
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

    renderModifiersList = () => {
        const { quantity } = this.state
        const { details, parent } = this.props
        const arr = reject(details, d => !d.parent)
        const modArr = filter(arr, a => (a.parent == parent.id))
        return map(modArr, m => {
            if ((m.total_quantity / m.quantity) != quantity) {
                return {
                    ...m, total: m.price * quantity * m.quantity,
                    total_quantity: m.quantity * quantity
                }
            }
            return { ...m }
        })
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

    // renderAddToCart = () => {
    //     const { activePrice } = this.props
    //     return <div className={classes.cart}>
    //         {/* <div className={classes.inner}>
    //             <Badge count={this.renderCartCount()} style={{ backgroundColor: '#306ab2' }}> */}
    //                 {/* <img className={classes.shopping} src={Shopping} /> */}
    //             {/* </Badge> */}
    //             {/* <p>{this.renderCartCount()}</p>
    //             <img className={classes.shopping} src={Shopping} /> */}
    //         {/* </div> */}
    //         <button type='submit' disabled={isEmpty(activePrice)}
    //         // onClick={this.addOrder.bind()}
    //         >Add to Cart</button>
    //     </div>
    // }

    renderCartCount = () => {
        const { details } = this.props
        const count = sumBy(reject(details, d => d.parent), 'quantity')
        if (count > 0) {
            return count
        }
        return
    }

    addOrder = () => {
        const { setMain, singleItem, history, order } = this.props
        // const { setMain, price, history, order } = this.props
        // const modifiers = this.getFilteredGroup(price)
        // const singleItem = reject(modifiers, m => m._max == 0)
        let details = this.addDetalisList()
        // this.openOrder(details)
        setMain('items__prices', { active: '' })
        setMain('dropdowns__doneness', { active: '' })
        setMain('orders__details', { modifiers_formik: {} })
        setMain('orders__details', { single_modifiers_formik: {} })
        setMain('orders__details', { parent: {} })
        setMain('orders__details', { edit: false })

        // single_modifiers_formik
        // map(singleItem, s => (
        //     setMain('orders__details', { [`single_modifiers_formik_${s.name}`]: {} })
        // ))
        history.goBack()
    }
    // addDetalisList = () => {
    //     const { details, setMain, setAll, handleSubmit, values } = this.props
    //     const list = this.editOrNot()
    //     let final = [...list].reduce((o, d) => ({ ...o, [d.id]: d }), {})
    //     let new_details = details

    //     if (!isEmpty(details)) {
    //         const found = find(details, d => d.id == values.id)
    //         if (found) {
    //             new_details = omitBy(details, d => (d.parent == values.id|| d.id==values.id))
    //         }
    //         final = Object.assign(new_details, final)
    //         // final = Object.assign(details, final)
    //     }
    //     handleSubmit()
    //     // setMain('orders__details', { details: final })
    //     setAll([
    //         { type: 'set_main', app: 'orders__details', data: { details: final } },
    //         { type: 'set_main', app: 'form_actions', data: { active: "" } }
    //     ])
    //     return final
    // }

    // editOrNot = () => {
    //     const { activePrice, activeDoneness, details, parent, edit, values } = this.props
    //     const { quantity } = this.state
    //     const modifiers_formik = this.getList()
    //     let list = map(modifiers_formik, m => (
    //         { ...m, id: uuid(), total_quantity: m.quantity * quantity }
    //     ))
    //     if (edit) {
    //         let found = find(details, { id: parent.id })
    //         found = { ...found, quantity }
    //         list = map(list, m => ({ ...m, parent: found.id }))
    //         list = [...list, found]
    //     }
    //     else {
    //         const id = values.id
    //         const found = find(details, d => (d.id == id))
    //         if (found) {
    //             list = reject(list, d => (d.id == id))
    //             // console.log('found in details', list)
    //         }
    //         // let parent = {
    //         //     id, item: activePrice.id, quantity: quantity, price: activePrice.price, doneness: activeDoneness ? activeDoneness : null
    //         // }
    //         let parent = {
    //             id, item: values.size, quantity: values.quantity, price: activePrice.price,
    //             doneness: values.doneness
    //         }
    //         list = map(list, m => ({ ...m, parent: id }))
    //         list = [...list, parent]
    //     }
    //     return list
    // 

    render() {
        const { activePrice, goBack, item } = this.props
        if(activePrice&&( get(activePrice, 'has_modifiers')||item._type=='ss'))
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