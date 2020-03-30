import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters';
import { map, get } from 'lodash';
import classes from './style.less'

class MenuItemClass extends Component {

    state = {
        first: '',
        second: ''
    }

    constructor(props) {
        super(props);
        const filter = {
            key: 'Filter',
            // path: 'items__custom_menu',
            params: {
                active: true
            }
        }
        this.list = applyFilter(filter, props.list)
    }

    selectType(active) {
        const { setAll } = this.props;
        setAll([
            {type: 'set_main_items__custom_menu', data: {active}},
            {type: 'set_main_items__sales_items', data: {active: ''}},
            {type: 'set_main_items__base_sales_cat', data: {active: ''}},
        ])
    }

    takeItem = (index) => {
        const { first } = this.state
        if (first === '') {
            this.setState({
                first: index
            })
        }
        else {
            this.setState({
                second: index
            }, () => {
                this.replaceMenu(this.state.first, this.state.second)
            })
        }
    }

    replaceMenu = (first, second) => {
        let newData = this.list;
        // let temp = Object.keys(newData)[first]
        // Object.keys(newData)[first] = Object.keys(newData)[second]
        // Object.keys(newData)[second] = temp
        let tmp = newData[newData.indexOf(first)]
        newData[newData.indexOf(first)] = newData[newData.indexOf(second)]
        newData[newData.indexOf(second)] = tmp
    }

    renderList() {
        const { active, activeAction, lang } = this.props;
        return map(this.list, (d, key) => (
            <button
                // style={{ fontSize: d.name.length > 14 && '0.8rem' }}
                key={key}
                type="button"
                className={(active == d.id) ? classes.cat_btn_active : classes.cat_btn}
                id={key == 0 ? classes.first
                    : key == 4 ? classes.fifth
                        : undefined
                }
                onClick={activeAction == 'move' ?
                    this.takeItem.bind(this, d.id)
                    : this.selectType.bind(this, d.id)
                }>

                <div className={classes.name}>
                    {get(d, lang.show)}
                </div>

                {active == d.id && <div className={classes.active}></div>}
            </button>
        ))
    }

    render() {
        return this.renderList()
    }
}

const mapStateToProps = (state, props) => ({
    list: props.list || state.items__custom_menu.data,
    active: state.items__custom_menu.active,
    activeAction: state.actions.activeAction,
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active,  {show: 'name'})
    // pos_settings: state.pos_settings,
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemClass);