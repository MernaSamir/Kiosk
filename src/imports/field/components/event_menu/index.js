import React, { Component } from 'react'
import { map, get, find } from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import uuid from 'uuid/v4';
import OrderList from './components/order_list'
import Bill from './components/bill'
import Popups from './components/Popups'
import Quantity from './components/Quntity'

import Combo from 'screens/combo'
import Modifier from 'screens/Modifiers'

const components = {
    orderList: { Component: OrderList },
    quantity: { Component: Quantity },
    combo: { Component: Combo },
    modifier:{Component:Modifier},
}
class setMenu extends Component {
    goBack(){
        const { setMain, field} = this.props
    
        setMain('form_actions', { [field.name]: { select: '' } })
     }
     
    handleChange = (d, c) => {
        const { field: { value, onChange, name } } = this.props
        let newVal = { ...d, id: d.id ? d.id : uuid(), ...c }
        if(d.data){
            if(d.all){
                onChange({ target: { name, value: d.data } })
            }else{
                onChange({ target: { name, value: { ...(value || {}), ...d.data } } })
            }
            return d.data
        }else{
            onChange({ target: { name, value: { ...(value || {}), [newVal.id]: newVal } } })
        }
        return newVal
    }



    render() {
        const { field, select,active } = this.props
        const Component = get(components, select, components.orderList)
        return (
            <>
                <Popups handleChange={this.handleChange} field={field} />
                <Bill handleChange={this.handleChange} list={field.value || {}} field={field} />
                <Component.Component 
                handleChange={this.handleChange}
                 list={field.value || {}} 
                 field={field} 
                 back={this.goBack.bind(this)}
                 detail={get(field.value,active)}
                 />
            </>

        )
    }
}
const mapStateToProps = (state, props) => ({
    select: get(state.form_actions, `${props.field.name}.select`),
    active: get(state.form_actions, `${props.field.name}.active`),


})

export default connect(mapStateToProps, mapDispatchToProps)(setMenu)
