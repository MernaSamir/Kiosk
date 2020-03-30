import React, { Component } from 'react'
import { map, get } from 'lodash';
import classes from './../../styles.less';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilter from 'helpers/functions/filters';

class Items extends Component {

    state = {
        active: ''
    }

    addModifier(d) {
        const { detail, appendPath, modifierItems, group, onClick, setMain } = this.props;
        const modifier_items = get(modifierItems, d.modifier_items, {})
        const free = ((group.max_point == 0) || (modifier_items.free_point <= (group.max_point - group.max_ordered_points)));

        if (group.add && free) {
            this.setState({
                active: d.id
            })
            if (onClick) {
                onClick({
                    item: modifier_items.item,
                    price: d.price,
                })
                return
            }
            const item = {
                parent: detail.id,
                item: modifier_items.item,
                price: d.price,
                quantity: 1,
                add: true
            }
            appendPath("orders__details", 'item', item)

        }
        else {
            setMain('popup',
                {
                    popup: { type: 'ModifiersAlert', visable: true, width: '40vw', border: '1.5px solid #d73f7c' }
                })
        }
    }

    getModifiers() {
        const { detail } = this.props;
        const filter = {
            key: 'Filter',
            path: 'items__assign_modifier_items',
            params: {
                active: true,
                item: detail.item
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

            return <span style={{ marginTop: '14%' }}> {data.name}</span>
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
                onClick={this.addModifier.bind(this, d)} >
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
