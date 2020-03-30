import React, { Component } from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { get, map, pick } from 'lodash';
import { get_object_index } from 'helpers/functions/array_to_object';
import classes from './style.less'

class Favorites extends Component {

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        const { fetchAll, user, setMain, active_action } = this.props;
        fetchAll([{
            app: 'items__favorite',
            api: 'items/favorite/',
            params: { user }
        }], this.afterFetch
        )
        setMain('actions', { active: active_action })
    }

    afterFetch = (data) => {
        const { setMain } = this.props;
        setMain('items__favorite', { active: get(data, `[0][0].id`) })
    }

    onSelect = (index, ev) => {
        const { setMain } = this.props;
        const ele = ev.target.getBoundingClientRect()
        setMain('popup', { position: { left: ele.x || ele.right, top: ele.y || ele.bottom }, index })
    }

    addToBill = (active, ev) => {
        const { setMain, list } = this.props;
        setMain('items__sales_items', { active })
        if (this.onSelect) {
            const index = get_object_index(list, active)
            this.onSelect(index, ev)
        }
    }

    renderFavoriteItems = () => {
        const { list, lang } = this.props
        return map(list, (d, key) => (
            <button type="button" className={classes.subcat_btn}
                onClick={this.addToBill.bind(this, d.id)}>
                {get(d, lang.show)}
            </button>
        ))
    }
    render() {
        return (
            <div className={classes.subcat}>
                {this.renderFavoriteItems()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    data: get(state.items__favorite.data, state.items__favorite.active, {}),
    get list() { return pick(state.items__sales_items.data, this.data.sales_item) },
    user: get(state, 'main.current.id', ''),
    active_action: state.actions.active,
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active,  {show: 'name'})
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)