import React, { Component } from 'react'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less';
import applyFilters from 'helpers/functions/filters'
import {pos_settings} from 'config/defaults'
class MenuItemClass extends Component {
    getCats(){
        const {filter} = this.props;
        this.cats = applyFilters({
            key: "Filter",
            path: 'items__base_sales_cat',
            params: filter
        })
        return this.cats.slice(0, 4);
    }
    selectType(active) {
        const { setAll } = this.props;
        setAll([
            { type: 'set_main', app: "items__base_sales_cat", data: {active}},
            { type: 'set_main', app: "items__sales_items", data: {active}},
        ])

    }
    renderCats = () => {
        const { active } = this.props
        const cats = this.getCats();
        return map(cats, (d, key) => (
            <button
                key={key}
                type="button"
                className={active == d.id ? classes.sub_active : classes.sub}
                onClick={this.selectType.bind(this, d.id)}>
                {
                    d.name.length > 12 ?
                        d.name.substring(0, 9) + '...'
                        : d.name
                }
            </button>
        ))
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
    get filter() {
        return this.pos_setting.menuShow == "true" ?
            { active: true, custom_menu: state.items__custom_menu.active }
            : { active: true }
    }
}), mapDispatchToProps
)(MenuItemClass);

