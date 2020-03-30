import React, { Component } from 'react'
import { map, get, isEqual, pick, max } from 'lodash'
import { withRouter } from 'react-router'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'

class SizeClass extends Component {

    constructor(props) {
        super(props);
        this.list = this.getPrices(props);
        if (this.list.length == 1) {
            this.addPrice(this.list[0])
        }
    }

    shouldComponentUpdate(nextProps) {
        const compare = ['item', 'activePopup'];
        const su = isEqual(pick(nextProps, compare), pick(this.props, compare));
        if (su) {
            this.list = this.getPrices(nextProps);
            if (this.list.length == 1) {
                this.addPrice(this.list[0])
            }
        }
        return su;
    }

    getFilteredGroup() {
        const activedModifier = applyFilters({
            key: 'Filter',
            path: "items__assign_modifier_items",
            params: {
                active: true,
                item: this.list[0].id
            }
        })
        return map(applyFilters({
            key: 'picking',
            reduxName: "items__modifier_items",
            select: 'modifier_items',
            then: {
                key: 'picking',
                reduxName: "items__modifier_group",
                select: 'modifier_group'
            }
        }, activedModifier), d => {
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
            return {
                ...d,
                _max: applyFilters({
                    key: 'pickMax',
                    select: '_max'
                }, assigned_modifier_items),
                _min: applyFilters({
                    key: 'pickMax',
                    select: '_min'
                }, assigned_modifier_items),
                ordered: applyFilters({
                    key: 'Includes',
                    select: 'item'
                }, undefined, { data: map(modifier_items, d => d.item) }).length,
            }
        })
    }

    // eslint-disable-next-line class-methods-use-this
    getPrices(props) {
        const { item } = props;
        return applyFilters({
            key: 'Filter',
            path: 'items__prices',
            params: {
                sales_item: item.id,
                active: true
            }
        })
    }

    addPrice = (price) => {
        const { activeItem, item, setAll, setMain, field } = this.props
        if (activeItem._type == 'ss') {
            setMain('items__prices', { active: price.id })
            setMain('form_actions', { [field.name]: { select: 'combo' } })
            setMain("popup", { active: "" })


        }
        else if(activeItem._type == 'cm'){
            setMain('items__prices', { active: price.id })
            // setMain('form_actions', { [field.name]: { select: 'combo' } })
            setMain("popup", { active: "" })
        }
        else {
            let dis = [];
            let data = { item: price.id, price: price.price, quantity: 1 };
            let active = false/*item.has_doneness ? 'Doneness' : ''*/;
            const onSuccess = this.goModifires.bind(this, price)
            dis.push({ type: 'set_main', app: 'popup', data: { active } })
            dis.push({
                type: 'append_path', path: 'item', app: 'orders__details',
                data: { ...data, add: !active, onSuccess }
            })
            setAll(dis);
        }
    }

    goModifires = (price) => {
        const { item, field, setMain, pos_settings } = this.props
        let active =false /*item.has_doneness ? 'Doneness' : ''*/;
        this.data = this.getFilteredGroup()
        let min = max(map(this.data, d => d._min))
        if (!active && price.has_modifiers) {
            setMain('form_actions', { [field.name]: { select: 'modifier' } })

        }
        return []
    }

    renderSizes = () => {
        const { units } = this.props
        return map(this.list, (d, key) => (
            <button
                type="button"
                onClick={this.addPrice.bind(this, d)}
                key={key}
                className={classes.size_btn}>
                <span> {get(units, d.sales_unit, {}).name} </span>
            </button>
        ))
    }

    renderTopPostion = (position) => {
        const { index } = this.props
        if (index < 15) {
            return position.top + 72
        }
        return position.top - 10
    }

    renderLeftPostion = (position) => {
        const { index } = this.props
        if ((index >= 3) && (index % 5 == 3 || index % 5 == 4)) {
            return position.left - 138
        }
        return position.left
    }

    render() {
        const { item = {}, style, position } = this.props
        return ((this.list.length > 1) && <div className={classes.cat_popuptext}
            style={{
                ...style, ...position, top: this.renderTopPostion(position),
                left: this.renderLeftPostion(position)
            }}
            id="cat-Popup" >
            <p> {"Size: "} {item.name} </p>
            <div className={classes.sizes}>
                <div className={classes.holder}>
                    {this.renderSizes()}
                </div>
            </div>
        </div>
        )
    }
}

export const Size = connect((state) => ({
    units: state.dropdowns__units_of_measure.data,
}), mapDispatchToProps)(withRouter(SizeClass));