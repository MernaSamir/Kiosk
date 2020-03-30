import React, { Component } from 'react'
import { map } from 'lodash';
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters';

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
        const { setMain } = this.props;
        setMain("items__custom_menu", { active })
        setMain("items__base_sales_cat", { active: '' })
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
        let tmp = newData[newData.indexOf(first)]
        newData[newData.indexOf(first)] = newData[newData.indexOf(second)]
        newData[newData.indexOf(second)] = tmp
    }

    renderList() {
        const { active, activeAction } = this.props;
        return map(this.list, (d, key) => (
            <button
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
                {d.name}
                {active == d.id ? <div className={classes.active}></div> : undefined}
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
    // pos_settings: state.pos_settings,
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemClass);
