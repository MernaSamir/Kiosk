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
    renderRow = () => {
        const { orderItem, setMain, modeKey, activeCourse, active, field , onChange} = this.props;
        const {course = {}, size, item} = this.datas;
        const permitted = this.getPermission()
        return <tr key={orderItem.id} id={orderItem.item} >
            {/* <Quantity setMain={setMain} orderItem={orderItem} field={field} /> */}
            <td   style={{width: '19%'}}>{round(orderItem.quantity, 10)}</td>
            <td  style={{width:'46%', textAlign:'left'}}>{ item.name} </td>
            {/* <td >{size.name}</td> */}
            {/* <td  >{modeKey == 'DI' ? course.name : round(orderItem.price, 2)}</td> */}
            <td  style={{width:'13%'}}>{round(orderItem.price * orderItem.quantity, 2)}</td>
            <MenuButton orderItem={orderItem} 
            active={active} setMain={setMain}
             permitted={permitted} activeCourse={activeCourse}
             course={course} modeKey={modeKey}  field={field} 
             onChange={onChange}/>
        </tr>
    }
    renderRows = () => {
        const { orderItem, field  } = this.props;
        const permitted = this.getPermission()
        return <>
            {this.renderRow()}
            {orderItem.is_combo && <Combo field={field} key={orderItem.id+'3'} orderItem={orderItem} permitted = {permitted}/>}
            {orderItem.notes && <tr key={orderItem.id+'2'} className={classes.notes}>{orderItem.notes}</tr>}
            {!orderItem.is_combo &&<Modifier field={field} orderItem={orderItem} key={orderItem.id+'1'}></Modifier>}
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
