import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less';
import applyFilters from 'helpers/functions/filters'
import { pos_settings } from 'config/defaults'

class MenuItemClass extends Component {

    getCats() {
        const { filter, activeAction } = this.props;
        this.cats = applyFilters({
            key: "Filter",
            path: 'items__base_sales_cat',
            params: filter
        })
        if (activeAction == 'move') {
            return this.moveAction(this.cats.slice(0, 4), 'sort_sub_cat')
        }
        else if (activeAction != 'move') {
            return this.default(this.cats.slice(0, 4), 'sort_sub_cat')
        }
        // return this.cats.slice(0, 4);
    }

    moveAction = (list, sort) => {
        const { settings__filter } = this.props
        const contains = map(list, l => {
            let index = get(applyFilters({
                key: 'Find', path: 'items__sorting',
                params: {
                    [sort]: l.id,
                    station: get(settings__filter, 'station', ''),
                    mode: get(settings__filter, 'mode', ''),
                }
            }), 'index', 0)
            return { ...l, index: index }
        })
        return sortBy(contains, 'index');
    }

    default = (list, sort) => {
        const { active_station, active_mode } = this.props
        const contains = map(list, l => {
            let index = get(applyFilters({
                key: 'Find', path: 'items__sorting',
                params: {
                    [sort]: l.id,
                    station: active_station,
                    mode: active_mode
                }
            }), 'index', 0)
            return { ...l, index: index }
        })
        return sortBy(contains, 'index');
    }

    selectType(active) {
        const { setAll } = this.props;
        setAll([
            { type: 'set_main', app: "items__base_sales_cat", data: { active } },
            { type: 'set_main', app: "items__sales_items", data: { active } },
        ])

    }
    renderCats = () => {
        const { active, lang } = this.props
        const cats = this.getCats();
        return map(cats, (d, key) => {
            const name = get(d, lang.show) || ''
            return (
                <button
                    key={key}
                    type="button"
                    className={active == d.id ? classes.sub_active : classes.sub}
                    onClick={this.selectType.bind(this, d.id)}>
                    {
                        name.length > 12 ?
                            name.substring(0, 9) + '...'
                            : name
                    }
                </button>
            )

        })
    }

    renderBack = () => {
        return (<button
            className={classes.sub}
            onClick={this.selectType.bind(this, '')}>
            <FontAwesomeIcon icon="bars" className={classes.icon} />
        </button>)
    }

    render() {
        return (
            <div className={classes.subcat_row}>
                {this.renderCats()}
                {this.renderBack()}
            </div>
        )
    }
}

export default connect((state) => ({
    pos_setting: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
    activeMenu: state.items__custom_menu.active,
    active: state.items__base_sales_cat.active,
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active, { show: 'name' }),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    settings__filter: get(state.settings__filter, 'item', {}),
    get filter() {
        return this.pos_setting.menuShow == "true" ?
            { active: true, custom_menu: state.items__custom_menu.active }
            : { active: true }
    }
}), mapDispatchToProps
)(MenuItemClass);

