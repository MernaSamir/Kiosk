import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import Types from './types'
import classes from './style.less'
import Alters from './alters'
import Form from 'helpers/wrap/form.js'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from "helpers/actions/main";
import uuid from 'uuid/v4'
import {getInfo} from 'helpers/functions/get_item_info'
import Cart from 'screens/global_cart'

class Combo extends Component {
    static onSubmit() {

    }
    state = {
        active: {},
        alter: {}
    }
    renderTitle = () => {
        const { item } = this.props
        return < div className={classes.title} >
            <p>{`Select your ${item.name} Alternative`}</p>
        </div >
    }
    getContent = () => {
        const { onClick, activeDetail } = this.props
        const { active, alter } = this.state
        const selected = !isEmpty(active) ? active : this.list[0]
        console.log(alter, "alteeeeer")

        return <Alters active={selected} getInfo={getInfo} activeAlter={this.activeAlter} alter={alter.id} />



    }
    getList = () => {
        const { activePrice } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: `items__combo`,
            params: {
                combo_size: activePrice,
                has_alter:true
            }
        })
        return list
    }
    setActive = item => {
        this.setState({
            active: item,
            // alter: item
        })
    }
    activeAlter = active => {

        this.setState({
            alter: active
        })
    }
    // getInfo = (l, selector) => {

    //     const item = applyFilters({
    //         key: 'chain',
    //         selectors: {
    //             'items__prices': selector,
    //             'items__sales_items': 'sales_item'
    //         },
    //     }, l)
    //     const size = applyFilters({
    //         key: 'chain',
    //         selectors: {
    //             'items__prices': selector,
    //             'dropdowns__units_of_measure': 'sales_unit'
    //         },
    //     }, l)
    //     return { name: item.name, size: size.name }
    // }
    next = () => {
        const { history, setMain, appendPath, activeDetail , activePrice, setAll} = this.props
        const {alter}= this.state
        const {quantity, size,name, price_variance, }= alter

        let price = applyFilters({path:`items__prices.data.${get(alter,'item',alter.alter_item)}`})
        setAll([
            { type: "set_main", app:'items__prices', data: {active:price.id}},
            { type: "set_main", app: 'form_actions', data: { CartStatus: false } }
          ])
        // setMain('items__prices',{active:price.id})

        const id = uuid()
        // if(alter.has_alter)
        const values = {
            ...alter,
            id,
            price:price.price,
            parent: activeDetail,
            name,
            size,
            quantity,
            price_id: price.id,
            // parent_check:true

        }
        setMain('form_actions', { item: id })
        appendPath('form_actions', `details.${[id]}`, { ...values })
    if(price.has_modifiers)
     history.push('/modifier')
     else
      history.push('/quantity')
    }
    render() {

        this.list = this.getList()
        return (
            <div className={classes.modDiv}>
                <div className={classes.cat}>
                    <Types setActive={this.setActive} active={this.state.active} getInfo={getInfo} list={this.list} />
                    {this.getContent()}

                    <Cart />
                </div>

                <div className={classes.btnContainer}>
                    <button className={classes.back} onClick={() => this.props.history.goBack()}> Back</button>
                    <button type='button' className={classes.next} onClick={this.next}>Next - Extras</button>


                </div>
            </div>
            // <div>
            //     <Types setActive={this.setActive} active={this.state.active} />
            //     {this.renderTitle()}
            // </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePrice: get(state.items__prices, 'active', ''),
    activeDetail: get(state.form_actions, 'active', ''),

    details: get(state.form_actions, 'details', {}),
    combo_item: get(state.form_actions, 'combo_item',),


})

export default connect(mapStateToProps, mapDispatchToProps)(Form(Combo))
