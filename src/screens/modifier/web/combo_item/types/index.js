import React, { Component } from 'react'
import { connect } from 'react-redux'

 class Combo extends Component {
    getList = () => {
        const { activePrice } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: `items__combo`,
            params: {
                combo_size: activePrice.id
            }
        })
        return list
    }

    renderComponents = () => {
        const {setActive} = this.props
        const list = this.getList()
        console.log(list,"lliiiiii")
        return map(list, (l, key) => {
            // const selected = get(comboInitials, l.id)||l
            // const selector  = selected.item?'item':'alter_item'
            const item = applyFilters({
                key: 'chain',
                selectors: {
                    'items__prices': 'item',
                    'items__sales_items': 'sales_item'
                },
            }, l)
            const size = applyFilters({
                key: 'chain',
                selectors: {
                    'items__prices': 'item',
                    'dropdowns__units_of_measure': 'sales_unit'
                },
            }, l)
            return <button className={`${classes.title} ${active == l.id && classes.active}`} type='button' key={key}
                onClick={()=>setActive(l.id)}>
                <p>{item.name}</p>
                <p>{`-${size.name}`}</p>
                <p>{`Q: ${l.quantity}`}</p>
            </button>
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),

    details: get(state.form_actions, 'details', {}),

})

export default connect(mapStateToProps, null)(Combo)
