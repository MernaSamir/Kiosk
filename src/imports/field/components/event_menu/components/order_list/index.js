import React, { Component } from 'react'
import { get, isEqual, pick } from 'lodash';
import { connect } from 'react-redux';
import Menu from './menu';
import mapDispatchToProps from 'helpers/actions/main';
import SubCategory from './sub_category';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters'
class RenderList extends Component {
    constructor(props) {
        super(props);
        this.types = this.getTypes();
    }
    getTypes() {
        this.types = applyFilters({
            key: "Filter",
            path: 'items__custom_menu',
            params: {
                active: true
            }
        })
        return this.types;
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['menu', 'option', 'pos_settings']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }

    resetSelect = (name, data = { active: '' }) => {
        const { setMain } = this.props;
        setMain(name, data)
    }

    getComponent(props) {
        const { menu, option, settings } = this.props;
        if (menu) {
            return <SubCategory menu={menu} types={this.types} {...props} option={option}
             />

        }
        else {
            return <Menu {...props} option={option} />
        }

    }


    rendering = () => {
        const ListComponent = this.getComponent({ reset: this.resetSelect })
        return ListComponent
    }

    onClick = () => {
        const { setMain } = this.props
        setMain('popup', { popup: {}, active: '' })
    }

    render() {
        return <section className={classes.main_cat_container}>
            <div className={classes.main_cat}>
                {this.rendering()}
            </div>
        </section>
    }
}

const mapStateToProps = (state, ownProps) => ({
    menu: state.items__custom_menu.active,
    pos_settings: get(state.main, 'pos_settings', {}),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    get settings() { return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(RenderList)
