import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, filter } from 'lodash'
import SubGroup from './sub_group'
import classes from './style.less'
import Items from './items'
import Form from 'helpers/wrap/form.js'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from "helpers/actions/main";
import uuid from 'uuid/v4'
import { getInfo } from 'helpers/functions/get_item_info'
import Cart from 'screens/global_cart'

class Combo extends Component {
    static onSubmit() {

    }
    state = {
        active: {},
        ssb_item: {}
    }
    renderTitle = () => {
        const { item } = this.props
        return < div className={classes.title} >
            <p>{`You can select any of these Sandwiches with 0 price change.`}</p>
        </div >
    }
    getContent = () => {
        const { onClick } = this.props
        const { active, ssb_item } = this.state
        const selected = !isEmpty(active) ? active : this.list[0]
        console.log(ssb_item, "alteeeeer")

        return <Items active={selected} getInfo={getInfo} activeSsbItems={this.activeSsbItems} ssb_item={ssb_item.id} />



    }
    getList = () => {
        const { ssb_group } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: `items__ssb_subgroup`,
            params: {
                ssb_group

            }
        })
        return list
    }
    setActive = item => {
        this.setState({
            active: item,
            // ssb_item: item
        })
    }
    activeSsbItems = active => {

        this.setState({
            ssb_item: active
        })
    }
    next = () => {
        const { history, setMain, appendPath, activeDetail, activePrice } = this.props
        const { ssb_item } = this.state
        const { quantity, size, name, price_variance,details, subgroup } = ssb_item

        let price = applyFilters({ path: `items__prices.data.${get(ssb_item, 'item')}` })
        let sub_group = applyFilters({ path: `items__ssb_subgroup.data.${subgroup}` })
        const modif = filter(details, m => m.parent == activeDetail.id)

        if (modif.length==sub_group.price_variance_qty){
          let  totalAfter= activeDetail.price+sub_group.price_variance
            appendPath("form_actions", `details.${[activeDetail.id]}`, {price:totalAfter});

        }
            setMain('items__prices', { active: price.id })

        const id = uuid()
        // if(alter.has_alter)
        const values = {
            ...ssb_item,
            id,
            price: price.price,
            parent: activeDetail,
            name,
            size,
            quantity,
            price_id: price.id,
            // parent_check: true

        }
        setMain('form_actions', { item: id })
        appendPath('form_actions', `details.${[id]}`, { ...values })
        if (price.has_modifiers)
            history.push('/modifier')
        else
            history.push('/quantity')
    }
    render() {
        const { ssb_group } = this.props

        this.list = this.getList()
        return (
            <div className={classes.modDiv}>
                <div className={classes.cat}>
                    <SubGroup setActive={this.setActive} active={this.state.active}
                        getInfo={getInfo}
                        list={this.list}
                        ssb_group={ssb_group} />
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
    ssb_group: get(state.items__ssb_group, 'active', ''),

    activeDetail: get(state.form_actions, state.form_actions.active, ''),

    details: get(state.form_actions, 'details', {}),
    combo_item: get(state.form_actions, 'combo_item',),


})

export default connect(mapStateToProps, mapDispatchToProps)(Form(Combo))
