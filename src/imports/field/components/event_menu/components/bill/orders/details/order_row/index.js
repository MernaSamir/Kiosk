import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters';
import { get, round } from 'lodash'
import Modifier from './modifier'
import classes from './style.less'
import { applyPermissions } from 'helpers/permissions'
import Quantity from './quantity_button'
import MenuButton from './menu_button'
import mapDispatchToProps from 'helpers/actions/main'
import Combo from './combo'
class OrderRow extends Component {
    // eslint-disable-next-line class-methods-use-this
    getWithPath(path, show){
        return applyFilters({
            key: 'GetDataSelector',
            path,
            show
        })
    }
    getDatas(){
        const { orderItem } = this.props;
        const size = this.getWithPath('items__prices', orderItem.item);
        this.datas = {
            size: this.getWithPath("dropdowns__units_of_measure", size.sales_unit),
            price: size,
            item: this.getWithPath("items__sales_items", size.sales_item),
            course: this.getWithPath("dropdowns__courses", orderItem.course)
        }
        return this.datas;
    }
    getPermission=()=>{
        return true
    }
    activeCourse = ()=>{
        const {setMain, activeCourse ,orderItem} = this.props
        if(activeCourse)
            setMain('orders__details', { active: orderItem.id, item: { id: orderItem.id, course: activeCourse, action: "update" } })
    }
    renderClass =()=>{
        const {active, orderItem, activeCourse} = this.props;
        const {course} = this.datas;
        if ((active === orderItem.id || (activeCourse && course.id === activeCourse))) {
            return classes.clickedRow
        } else {
           return classes.row;
        }
    }
    renderRow = () => {
        const { orderItem, setMain, modeKey, activeCourse, active, field , handleChange} = this.props;
        const {course = {}, size, item} = this.datas;
        const permitted = this.getPermission()
        return <tr key={orderItem.id} id={orderItem.item} className={this.renderClass()} onClick={this.activeCourse}>
            <Quantity setMain={setMain} orderItem={orderItem} field={field} />
            <td >{ item.name} </td>
            <td >{size.name}</td>
            <td  >{modeKey == 'DI' ? course.name : round(orderItem.price, 2)}
            </td>
            <td >{round(orderItem.price * orderItem.quantity, 2)}</td>
            <MenuButton orderItem={orderItem} 
            active={active} setMain={setMain}
             permitted={permitted} activeCourse={activeCourse}
             course={course} modeKey={modeKey}  field={field} 
             handleChange={handleChange}/>
        </tr>
    }
    renderRows = () => {
        const { orderItem, field ,handleChange } = this.props;
        const permitted = this.getPermission()
        if(orderItem.deleted){
            return <></>
        }
        return <>
            {this.renderRow()}
            {orderItem.is_combo && <Combo field={field} key={orderItem.id+'3'} orderItem={orderItem} permitted = {permitted}
                   handleChange={handleChange}/>}
            {orderItem.notes && <tr key={orderItem.id+'2'} className={classes.notes}>{orderItem.notes}</tr>}
            {!orderItem.is_combo &&<Modifier field={field} orderItem={orderItem} key={orderItem.id+'1'}handleChange={handleChange}></Modifier>}
        </>
        

    }
    render() {
        this.getDatas()
        return (
            this.renderRows()
        )
    }
}

const wrapper = connect((state, props)=>({
    orderItem: props.orderItem || get(state.orders__details.data, props.detail),
    activeCourse: state.dropdowns__courses.active,
    active: state.orders__details.active
}), mapDispatchToProps)(OrderRow)
export default wrapper;
