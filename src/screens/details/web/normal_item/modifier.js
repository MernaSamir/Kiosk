import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Form from 'helpers/wrap/form.js'
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters'
import { get, map, sumBy, max, reject, filter } from 'lodash'
import classes from './style.less'

class Modifier extends Component {

  

    getFilteredGroup = (price) => {
        const { modifiers_formik, single_modifiers_formik } = this.props
        const activedModifier = applyFilters({
            key: 'Filter',
            path: "items__assign_modifier_items",
            params: {
                active: true,
                item: price
            }
        })
        const main_modifiers_items = applyFilters({
            key: 'picking',
            reduxName: 'items__modifier_items',
            select: 'modifier_items',
        }, activedModifier);

        const main_modifiers = applyFilters({
            key: 'picking',
            reduxName: 'items__modifier_group',
            select: 'modifier_group',
        }, main_modifiers_items);

        const modifiers = map(modifiers_formik, d => {
            return {
                ...d,
                group: get(d, 'modifier_group', null),
                free_point: get(d, 'free_point', 0),
                // group: d.modifier_group,
                // free_point: d.free_point || 0,
            };
        });
        // console.log('mod ', modifiers)
        return map(main_modifiers, (d) => {
            const assigned_modifier_items = applyFilters({
                key: 'ListInside',
                compare: 'id',
                select: 'modifier_group',
                selectors: {
                    items__modifier_items: 'modifier_items',
                },
            }, activedModifier, undefined, { data: d });
            const items =
                applyFilters({ key: 'Filter', params: { group: d.id, parent:price } }, modifiers);
            return {
                ...d,
                _max: applyFilters({
                    key: 'pickMax',
                    select: '_max',
                }, assigned_modifier_items) || 0,
                _min: applyFilters({
                    key: 'pickMax',
                    select: '_min',
                }, assigned_modifier_items) || 0,
                max_point: applyFilters({
                    key: 'pickMax',
                    select: 'max_free_point',
                }, assigned_modifier_items) || 0,
                ordered: sumBy(items, 'quantity'),
                get reminder() {
                    return max([this._min - this.ordered, 0]);
                },
                get reject() {
                    return this.ordered < this._min;
                },
                max_ordered_points: sumBy(items, d => (d.free_point)),
                get add() {
                    return (this._max > this.ordered || this._max == 0);
                },
            }
        })
    }

    checkPrices = (prices) => {
        const { activePrice } = this.props
        // if (prices.length == 1) {
        //     return prices[0].id
        // }
        // else {
        //     return activePrice
        // }
        return activePrice
    }

    renderModifers = () => {
        const { priceList } = this.props
        const modifiers = this.getFilteredGroup(this.checkPrices(priceList))
        return [
            this.renderSingle(modifiers),
            this.renderMulti(modifiers)
        ]
    }
  

    renderSingle = (modifiers) => {
        const { details, parent, activePrice } = this.props
        // const singleItem = reject(modifiers, m => m._max == 0)
        const singleItem = filter(modifiers, m => m._max == 1)
        return map(singleItem, (s) => (
            Render([{
                type: 'SelectOne',
                t: s.name,
                title: `Select ${s.name}`,
                name: 'modifiers',
                options: this.getModifiers(s),
                redux: 'orders__details',
                elment: `single_modifiers_formik_${s.name}`,
                className: classes.options,
                details: details,
                // parent: parent,
                parent:activePrice
            }])
        ))
    }

    renderMulti = (modifiers) => {
        const { activePrice, details, parent } = this.props
        const multiItem = reject(modifiers, m => m._max == 1)
        return Render([{
            type: 'SelectMulti',
            name: 'modifiers',
            modifiers: multiItem,
            activePrice,
            getModifiers: this.getModifiers,
            details: details,
            // parent: parent,
            parent:activePrice

        }])
    }

    getModifiers = (group) => {
        const { activePrice } = this.props;
        const filter = {
            key: 'Filter',
            path: 'items__assign_modifier_items',
            params: {
                active: true,
                item: activePrice,
            },
            then: {
                key: 'ListInside',
                compare: 'id',
                select: 'modifier_group',
                selectors: {
                    items__modifier_items: 'modifier_items',
                },
            },
        }
        return applyFilters(filter, undefined, undefined, { data: group })
    }

    render() {
        return (
            this.renderModifers()
        )
    }
}

const mapStateToProps = (state) => ({
    style: { height: 'fit-content', width: '100%' },

})

export default connect(mapStateToProps, null)(Modifier)