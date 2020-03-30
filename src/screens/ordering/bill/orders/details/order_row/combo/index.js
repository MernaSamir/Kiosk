import React, { Component } from 'react'
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, round } from 'lodash';
import classes from './style.less'
import Modifier from '../modifier'
import MenuButton from '../menu_button'

class Combo extends Component {

    renderCombo=()=>{
        const {orderItem,setMain, active, permitted, activeCourse, modeKey, course} = this.props
        const comboItems = applyFilters({
            key :'Filter',
            path: 'orders__details',
            params:{
                parent:orderItem.id
            }
        })
        const prices = applyFilters({
            key:'picking',
            reduxName:'items__prices',
            select:  'item'
        },comboItems)
        const salesItems = applyFilters({
            key:'picking',
            reduxName:'items__sales_items',
            select:  'sales_item'
        },prices)
        const sizes = applyFilters({
            key:'picking',
            reduxName:'dropdowns__units_of_measure',
            select:  'sales_unit'
        },prices)

        return map(comboItems, (d, idx)=>{
            const price = get(prices, d.item, '')
            const item = get(salesItems, price.sales_item, '')
            const size = get(sizes, price.sales_unit, '')
            return <><tr key={idx} className={active == d.id?classes.clickedRow:d.is_alter?classes.alter:classes.combo}>
                <td >(C)</td>
                <td>{item.name}</td>
                <td>{size.name}</td>
                <td>{modeKey=='TW'&&round(d.price, 2)}</td>
                <td>{round(d.price, 2) * d.quantity}</td>
                <MenuButton orderItem={d} active={active}
                 setMain={setMain} permitted={permitted} activeCourse={activeCourse}
                course={course} modeKey={modeKey}/>
            </tr>
            <Modifier orderItem={d} key={d.id+idx} />
            </>
        })
    }

    render() {

        return (
            this.renderCombo()
        )
    }
}

const mapStateToProps = (state, props) => ({
    active: state.orders__details.active,
    activeCourse: state.dropdowns__courses.active,
    modeKey: get(get(state.settings__mode.data, state.settings__mode.active, ''), 'key', ''),
    course: get(state.dropdowns__courses.data, props.orderItem.course, ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(Combo)