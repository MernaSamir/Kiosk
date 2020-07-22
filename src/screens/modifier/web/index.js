import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from '../style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
// import Summary from '../details/summary';
import Body from './groups'
import applyFilters from 'helpers/functions/filters';
import { get, map, max, sumBy, find } from 'lodash';
import Types from './types'
import Removals from './removals';
import Form from 'helpers/wrap/form.js';
import Cart from 'screens/global_cart'

class modifier extends Component {
    static onSubmit(props,values) {
   console.log(values,"vaaaaaaa")
    }
    state = {
        active: 'Extra'
    }
    setActive = () => {
        // const { setMain, history } = this.props

        this.setState({
            active: 'Extra'
        })
        //  setMain("dropdowns__lang",{active: lang||'EN'})
    }

    nextClick = () => {
        const { history } = this.props;
        history.push('/details/qtn')
    }
    goBack = () => {
        const { history } = this.props;
        history.goBack()

    }

    getFilteredGroup() {
        const { activeDetail } = this.props;
        console.log(activeDetail, "detaaaolllll")
        const activedModifier = applyFilters({
            key: 'Filter',
            path: "items__assign_modifier_items",
            params: {
                active: true,
                item: activeDetail.price_id
            }
        })
        const main_modifiers_items = applyFilters({
            key: 'picking',
            reduxName: "items__modifier_items",
            select: 'modifier_items'
        }, activedModifier)
        const main_modifiers = applyFilters({
            key: 'picking',
            reduxName: "items__modifier_group",
            select: 'modifier_group'
        }, main_modifiers_items)

        const modifiers = applyFilters({
            key: 'Filter',
            path: "orders__details",
            params: {
                parent: activeDetail.price_id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        }).map(d => {
            const item = find(main_modifiers_items, { item: d.item });
            return {
                ...d,
                free_point: get(item, 'free_point', '') || 0
            }
        })
        return map(main_modifiers, (d) => {
            const assigned_modifier_items = applyFilters({
                key: 'ListInside',
                compare: 'id',
                select: 'modifier_group',
                selectors: {
                    items__modifier_items: 'modifier_items'
                },
            }, activedModifier, undefined, { data: d })
            const modifier_items = applyFilters({
                key: 'picking',
                reduxName: "items__modifier_items",
                select: 'modifier_items',
            }, assigned_modifier_items)
            const details_items = applyFilters({
                key: 'Includes',
                pick: 'item',
                select: 'item',
            }, modifiers, undefined, { data: modifier_items })

            return {
                ...d,
                _max: applyFilters({
                    key: 'pickMax',
                    select: '_max'
                }, assigned_modifier_items) || 0,
                _min: applyFilters({
                    key: 'pickMax',
                    select: '_min'
                }, assigned_modifier_items) || 0,
                max_point: applyFilters({
                    key: 'pickMax',
                    select: 'max_free_point'
                }, assigned_modifier_items) || 0,
                ordered: sumBy(details_items, 'quantity'),
                get reminder() {
                    return max([this._min - this.ordered, 0])
                },
                get reject() {
                    return this.ordered < this._min
                },
                max_ordered_points: sumBy(details_items, d => (d.quantity * d.free_point)),
                get add() {
                    return (this._max > this.ordered || this._max == 0)
                }

            }
        })
    }
    getContent = () => {
        const { onClick, activeDetail } = this.props

        if (this.state.active == 'Extra')
            return <Body list={this.list} onClick={onClick} detail={activeDetail} />
        else
            return <Removals list={this.list} onClick={onClick} detail={activeDetail} />



    }
    nextNo = () => {
        this.setState({
            active: 'No'
        })
    }
    getNextButton = () => {
        if (this.state.active == 'Extra')
            return <button type='button'className={classes.next} onClick={() => this.nextNo()}>Next - NO</button>
        else
            return <button type='submit' className={classes.next}>Next - Quantity</button>


    }
    render() {
        this.list = this.getFilteredGroup()
        console.log(this.list, "liiiistttthh")
        const { setMain, onClick, activeDetail, back, itemName } = this.props

        return (
            <div className={classes.modDiv}>
                <div className={classes.cat}>
                    <Types setActive={this.setActive} active={this.state.active} />
                    {this.getContent()}
                    <Cart/>
                </div>


                {/* <Summary /> */}

                <div className={classes.btnContainer}>
                    <button className={classes.back} onClick={this.goBack}> Back</button>
                    {this.getNextButton()}
                    {/* // <button className={classes.next} onClick={() => this.nextClick()}>Next - Quantity</button> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    // activeAction: state.actions.active,
    // activeOrder: state.orders__details.active,
    activeDetail: get(state.form_actions.details, state.form_actions.active),
    // detail: get(state.form_actions, 'detail', {}),
    get priceItem() { return get(state.items__prices.data, this.activeDetail.size, '') },
    get itemName() { return get(get(state.items__sales_items.data, this.priceItem.sales_item), 'name', '') },
    get Item() { return get(state.items__sales_items.data, this.priceItem.sales_item, {}) },
    item: get(state.orders__details, 'item.action'),
    activeModifier: get(state.items__modifier_group, `data.${get(state.items__modifier_group, 'active', {})}`, {}),
    price: get(state.items__prices, 'active', false),
})

export default connect(mapStateToProps, mapDispatchToProps)(Form(modifier));

