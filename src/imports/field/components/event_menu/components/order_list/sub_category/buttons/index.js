import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main';
import { map, get, find } from 'lodash'
// import { get_object_index } from 'helpers/functions/array_to_object';
// import Calculator from 'components/down_calculator';
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import Performance from 'helpers/components/performance'
import { pos_settings } from 'config/defaults'
class ButtonsComponent extends Component {

    state = {
        loaded: false
    }

    renderFunctions = (active, item, index, prices, ev) => {
        return this.selectType(active,item ,index, ev)
    }

    getPrices(item) {
        return applyFilters({
            key: "Filter",
            path: 'items__prices',
            params: { sales_item: item.id, active: true }
        })
    }

    selectType(active,item ,index, ev) {
        const { setAll, app, onSelect  } = this.props;
       
        setAll([
            { type: "set_main", app, data: { active } },
            { type: "set_main", app: 'popup', data: { active: '' } }
        ])
        if (onSelect) {
            onSelect(index, ev)
        }
    }


    renderStyle = (d) => {
        const { itemsColor = {} } = this.props;
        const item = find(itemsColor, { item: d.id }) || {}
        return item.color
    }

    renderFillIcon = (d, key) => {
        const { option } = this.props;
        if (option) {
            return <FontAwesomeIcon icon="fill" className={classes.icon}
                style={{ color: this.renderStyle(d) }}
                onClick={this.renderFunctions.bind(this, d.id, d, key)} />
        }
        return <></>
    }
    getList() {
        const { app, filter } = this.props;
        this.list = applyFilters({
            key: 'Filter',
            path: app,
            params: filter,
        })
        return this.list;
    }

    render() {
        const { className, activeItem, pageNum = 1, prices } = this.props;
        const list = this.getList();
        return (
            <>
                <div className={classes.subcat}>
                    {map(list, (d, key) => {
                        let priceList = [true];
                        if (prices) {
                            priceList = this.getPrices(d);
                        }
                        return priceList.length > 0 && <button type="button" className={`${classes.subcat_btn}
                            ${activeItem && get(classes, className)}`}
                            style={{
                                border: `1.5px solid ${this.renderStyle(d)}`
                            }}
                            key={key}
                            onClick={this.renderFunctions.bind(this, d.id, d, key, priceList)}>
                            <p >{d.name}</p>
                        </button>
                    }).slice((pageNum - 1) * 20, pageNum * 20)}
                </div>
            </>
        )
    }
}

const PerButton = Performance(ButtonsComponent, ['pageNum', 'pos_settings', 'custom_menu', 'filter', 'activeAction', 'itemsColor'])
export const Category = connect((state, props) => ({
    app: 'items__base_sales_cat',
    custom_menu: get(state.items__custom_menu.data, state.items__custom_menu.active, {}),
    pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    get settings() {
        return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {})
    },
    get filter() {
        return this.pos_settings.menuShow == "true" || !(this.pos_settings.menuShow) ?
            { active: true, custom_menu: state.items__custom_menu.active }
            : { active: true }
    },
}), mapDispatchToProps)(PerButton)

export const Items = connect(state => ({
    app: 'items__sales_items',
    prices: true,
    pos_settings: get(state.main, 'pos_settings', {}),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    get settings() {
        return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {})
    },
    filter: { ...state.items__sales_items.filter, base_sales_cat: state.items__base_sales_cat.active },
    base_sales_cat: get(state.items__base_sales_cat.data, state.items__base_sales_cat.active, {}),
    activeAction: state.actions.active,
    pageNum: state.page.active,
    itemsColor: state.items__item_color.data
}), mapDispatchToProps)(PerButton)

export default PerButton;
