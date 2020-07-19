import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form.js'
import Render from 'helpers/functions/field_mapper/renderfields'
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters'
import ShowImage from 'components/show/image'
import Modifier from './modifier'
import Footer from './footer'
import { get, map, isEmpty, sumBy, max, reject, pick, filter } from 'lodash'
import classes from './style.less'
import uuid from 'uuid/v4'

class NormalItem extends Component {

    renderItemPhoto = () => {
        const { item } = this.props
        return  <ShowImage src={item.photo_path} />

        // <div className={classes.img}>
        // </div>
    }

    renderDesc = () => {
        const { item } = this.props
        // return <div className={classes.desc}>
        return <p>{item.desc||"hnaaaaaaaaa aho aho aho "}</p>
        // </div>
    }
    emptyModifiers = () => {
        const { handleChange } = this.props
        handleChange({
            target: {
                name: 'modifiers',
                values: []
            }
        })
    }
    getPrices = () => {
        const { item } = this.props
        const prices = applyFilters({
            key: "Filter",
            path: 'items__prices',
            params: { sales_item: item.id, active: true }
        })
        return prices
    }

    renderSize = () => {
        const priceList = this.getPrices()
        console.log(priceList, "jjhgjhg")
        return <div className={classes.selects}>
            {
                Render([{
                    type: 'SelectOne',
                    t: 'Size',
                    title: 'Select Size',
                    name: 'size',
                    options: priceList,
                    className: classes.options,
                    redux: 'items__prices',
                    onClick: this.emptyModifiers
                }])
            }
            {/* <SelectOne title='Size' options={priceList} redux='items__prices' /> */}
        </div>
    }

    renderDoneness = () => {
        const { item, doneness } = this.props
        if (item.has_doneness) {
            return <div className={classes.selects}>
                {
                    Render([{
                        type: 'SelectOne',
                        t: 'Doneness',
                        title: 'Select Doneness',
                        name: 'doneness',
                        options: doneness,
                        className: classes.options,
                        redux: 'dropdowns__doneness'
                    }])
                }
                {/* <SelectOne title='Doneness' options={doneness} redux='dropdowns__doneness' /> */}
            </div>
        }
        return <></>
    }

    static onSubmit(props, values) {
        if (values) {

            const { modifiers_formik, single_modifiers_formik, formValues, setMain } = props
            const detail = { ...values, modifiers: filter(values.modifiers, { parent: values.size }) }
            setMain('form_actions', { details: { ...formValues, [detail.id]: detail } })
        }
    }

    checkPrices = (prices) => {
        const { activePrice } = this.props
        if (prices.length == 1) {
            return prices[0].id
        }
        else {
            return activePrice
        }
    }

    getFilteredGroup = (price) => {
        const { modifiers_formik } = this.props
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
                applyFilters({ key: 'Filter', params: { group: d.id } }, modifiers);
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

    renderModifers = () => {
        const { priceList, activePrice } = this.props
        const modifiers = this.getFilteredGroup(this.checkPrices(priceList))
        return [
            this.renderSingle(modifiers),
            this.renderMulti(modifiers)
        ]
    }

    renderSingle = (modifiers) => {
        const singleItem = reject(modifiers, m => m._max == 0)
        return map(singleItem, (s) => (
            Render([{
                type: 'SelectOne',
                title: s.name,
                name: 'modifiers',
                options: this.getModifiers(s),
                redux: 'orders__details',
                elment: `single_modifiers_formik_${s.name}`,
                className: classes.options,
            }])
        ))
    }

    renderMulti = (modifiers) => {
        const { activePrice } = this.props
        const multiItem = reject(modifiers, m => m._max == 1)
        return Render([{
            type: 'SelectMulti',
            name: 'modifiers',
            modifiers: multiItem,
            activePrice,
            getModifiers: this.getModifiers
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
        const { itemPrice, priceList, values, single_modifiers_formik, handleChange } = this.props
        const modifiers = this.getFilteredGroup(this.checkPrices(priceList))
        const singleItem = reject(modifiers, m => m._max == 0)

        return (
            <div className={classes.card}>
                <div>
                    {this.renderItemPhoto()}
                    {this.renderDesc()}
                </div>
                {this.renderSize()}
                {this.renderDoneness()}
                {/* {!isEmpty(activePrice) && this.renderModifers()} */}
                {get(itemPrice, 'has_modifiers', false) && <Modifier {...this.props} />}
                <Footer {...this.props} singleItem={singleItem} {...{ ...pick(this.props, ['handleChange', 'handleSubmit', 'values']) }} />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    order: get(state.orders__main, 'active', null),
    location: get(state.licensing__location, 'active', null),
    mode: get(state.settings__mode, 'active', null),
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    priceList: get(state.items__prices, 'priceList', {}),
    activePrice: get(state.items__prices, 'active', null),
    activeDoneness: get(state.dropdowns__doneness, 'active', null),
    itemPrice: get(state.items__prices.data, state.items__prices.active, {}),
    doneness: get(state.dropdowns__doneness, 'data', {}),
    style: { height: '100%', width: '100%' },
    modifiers_formik: get(state.orders__details, 'modifiers_formik', []),
    single_modifiers_formik: get(state.orders__details, 'single_modifiers_formik', []),
    // single_modifiers_formik: state.orders__details.single_modifiers_formik,
    units: state.dropdowns__units_of_measure.data,
    details: get(state.orders__details, 'details', []),
    edit: get(state.orders__details, 'edit', false),
    parent: get(state.orders__details, 'parent', false),
    comboItem: get(state.items__combo, 'active', ''),
    formValues: get(state.form_actions, 'details', {}),

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form(NormalItem)))