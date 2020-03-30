import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import { withRouter } from 'react-router-dom';
import { pos_settings } from 'config/defaults'
import * as PopUpsComponents from './types';
import ClickOutSide from 'helpers/components/click'
import { map, get, isEqual, pick, max } from 'lodash'

class Popups extends Component {

    Size = (props) => {
        this.list = this.getPrices(props);
        if (this.list.length == 1) {
            return this.addPrice(this.list[0])
        } else {
            const { setMain } = props;
            return setMain('popup', { active: 'Size' })
        }
    }

    Color = (props) => {
        const { setMain } = props
        return setMain('popup', { active: 'Color' })
    }

    // eslint-disable-next-line class-methods-use-this
    getPrices(props) {
        const { activeItem } = props;
        return applyFilters({
            key: 'Filter',
            path: 'items__prices',
            params: {
                sales_item: activeItem.id,
                active: true
            }
        })
    }

    addPrice = (price) => {
        const { history, setAll, setMain } = this.props
        this.item = applyFilters({ path: `items__sales_items.data.${price.sales_item}` })
        let dis = [];
        let data = { item: price.id, price: price.price, quantity: 1 };
        let active = this.item.has_doneness ? 'Doneness' : '';
        const onSuccess = this.goModifires.bind(this, price)
        dis.push({
            type: 'set_main', app: 'popup', data: {
                price, active, isCombo: this.item._type == 'ss' ? true : false, customMix:this.item._type == 'cm' ? true : false
            }
        })

        if (!this.item.has_doneness && this.item._type == 'ss') {
            setMain('items__prices', { active: price.id })
            history.push('/home/combo')
            
        }
        else if(!this.item.has_doneness && this.item._type == 'cm'){
            setMain('items__prices', { active: price.id })
            history.push('/home/custom_mix')
        }

        else {
            dis.push({
                type: 'append_path', path: 'item', app: 'orders__details',
                data: { ...data, add: !active, onSuccess }
            })
            setAll(dis);
        }
    }

    getFilteredGroup(price) {
        const activedModifier = applyFilters({
            key: 'Filter',
            path: "items__assign_modifier_items",
            params: {
                active: true,
                item: price.id
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
            return {
                ...d,
                _min: applyFilters({
                    key: 'pickMax',
                    select: '_min'
                }, assigned_modifier_items),
            }
        })
    }

    goModifires = (price) => {
        const { history, pos_settings } = this.props
        // let active = item.has_doneness ? 'Doneness' : '';
        this.data = this.getFilteredGroup(price)
        let min = max(map(this.data, d => d._min))
        if (price.has_modifiers && history.location.pathname == '/home') {
            (eval(pos_settings.modifiers) || min > 0) && history.push('/Home/modifires')
        }
        return []
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { activeItem, option } = nextProps
        const compare = ['activeItem', "activePopup", "position", "index"]
        const su = !isEqual(activeItem.id, this.props.activeItem.id)
        if (su || (activeItem.id && !this.props.activePopup)) {
            const active = activeItem.id && option ? 'Color' : activeItem.id ? 'Size' : ''
            // SetMain({ active })
            get(this, active, (d => d))(nextProps)
        }
        return !isEqual(pick(nextProps, compare), pick(this.props, compare));
    }

    renderPopup = () => {
        const { activeItem, position, index, pos_settings, activePopup } = this.props;
        const Component = get(PopUpsComponents, activePopup, false);
        const reset = [{
            type: 'reset_all_popup',
            data: {}
        }]
        return Component && <ClickOutSide reset={reset}>
            <Component list={this.list} {...this.props}
                addPrice={this.addPrice}
                item={activeItem} position={position}
                index={index} pos_settings={pos_settings} />
        </ClickOutSide>
    }

    render() {
        return this.renderPopup()
    }
}

const mapStateToProps = (state) => ({
    activeItem: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePopup: state.popup.active,
    position: state.popup.position,
    index: state.popup.index,
    pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popups))