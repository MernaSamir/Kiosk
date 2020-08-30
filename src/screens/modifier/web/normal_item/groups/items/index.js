import React, { Component } from 'react'
import { map, get } from 'lodash';
import classes from '../style.less';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilter from 'helpers/functions/filters';
import { message } from 'antd';
import uuid from 'uuid/v4'

class Items extends Component {

    state = {
        active: ''
    }
    addToOrder = (qtn, modifier_item, modifier_name) => {
        const { group, cart, setMain, formValues, active_parent } = this.props
        const values = {
            id: uuid(),
            quantity: qtn,
            price: modifier_item.price,
            parent: active_parent,
            name:modifier_name
        }

        const detail = { ...values }
        // const old_details = formValues ? { ...formValues } : {}
        setMain('form_actions', { details: { ...formValues, [detail.id]: detail } })

    }
    addItToOrder = (d, mod_name) => {
        const { active_parent , appendPath, setMain, formValues} = this.props
        const id = uuid()
        const values = {
            id,
            quantity: 1,
            price: d.price,
            parent: active_parent,
            name:mod_name
        }

        const detail = { ...values }
        const old_details = formValues ? { ...formValues } : {}
        setMain('form_actions', { details: { ...formValues, [detail.id]: detail } })
        // appendPath('form_actions', `details.${[id]}`, {detail })
        setMain('popup',
        {
            popup: { type: 'ModifiersAlert', visable: true, width: '40%', border: '1.5px solid #d73f7c',
        
            childProps: {
                only:true,
                msg: 'Modifier added successfully'
            }
        }
        })


    }
    addModifier(d, data) {
        console.log(d, "did dsds",)
        const { detail, appendPath, modifierItems, group, onClick, setMain, cart } = this.props;
        const modifier_items = get(modifierItems, d.modifier_items, {})
        const free = ((group.max_point == 0) || (modifier_items.free_point <= (group.max_point - group.max_ordered_points)));
        if (group.add && free) {
            this.setState({
                active: d.id
            })
            // if (onClick) {
            //     onClick({
            //         item: modifier_items.item,
            //         price: d.price,
            //     })
            //     return
            // }
            if(group._max!=1){
            const popup = {
                type: 'ModifQuantity', visable: true, width: "50%",
                childProps: {
                    max: group._max,
                    Title: '',
                    first_msg: `${data.name}`,
                    pressYes: this.addToOrder,
                    modifier_item: d,


                }
            }
            setMain('popup', { popup })
       }
        else{
            this.addItToOrder(d, data.name)
        }

        }
        else {
            setMain('popup',
                {
                    popup: { type: 'ModifiersAlert', visable: true, width: '40vw', border: '1.5px solid #d73f7c' }
                })
        }
    }

    getModifiers() {
        const {  web, price } = this.props;

        const filter = {
            key: 'Filter',
            path: 'items__assign_modifier_items',
            params: {
                active: true,
                item: price
            },
            then: {
                key: 'ListInside',
                compare: 'items__modifier_group.active',
                select: 'modifier_group',
                selectors: {
                    items__modifier_items: 'modifier_items'
                }
            }

        }
        return applyFilter(filter);
    }

    renderSpanStyle = (data) => {
        if ((data.name).includes(" ")) {

            return <span style={{ padding: '7%' }} >  {data.name}</span>
        }
        return <span> {data.name}</span>
    }

    renderPriceStyle = (price) => {
        if (price.price > 0) {
            return <div className={classes.Mod_price}>
                <span>+{price.price}.00</span>
            </div>
        }
    }

    renderItems = () => {
        const { show, page } = this.props
        const list = this.getModifiers();
        const { active } = this.state
        return map(list, (d, key) => {
            const data = applyFilter(show, d);
            return <div key={key} className={classes.Mod_itemsBtn}
                style={{ border: d.id == active && '1.5px solid #d73f7c' }}
                onClick={this.addModifier.bind(this, d, data)} >
                {this.renderSpanStyle(data)}
                {this.renderPriceStyle(d)}
            </div>
        }).slice(15 * (page - 1), 15 * page)
    }

    render() {
        return (
            <div className={classes.Mod_itemsBox}>
                {this.renderItems()}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        modifierItems: state.items__modifier_items.data,
        show: {
            key: 'chain',
            selectors: {
                items__modifier_items: 'modifier_items',
                items__prices: 'item',
                items__sales_items: 'sales_item',
            }
        },
        activeDetail: get(state.form_actions, 'active', ''),
        formValues: get(state.form_actions, 'details', {}),
        active_parent :get(state.form_actions, 'item', state.form_actions.active)


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
