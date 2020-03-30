import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import {get, isArray} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'


class FireItem extends Component {
    fire = () => {
        const { setMain, order, orderDetail } = this.props;
        const details = applyFilters({
            key:'Filter',
            path: 'orders__details',
            params:{
                order: order.id,
                parent: orderDetail.id
            }
        })
        const printing = Boolean(window.crodova);
        setMain("orders__details", {
            item: {
                data: [{
                    id: orderDetail.id,
                    printing,
                    fired_time: new Date()
                }, ...details.map(d => ({
                    id: d.id,
                    fired_time: new Date(),
                    printing
                }))],
               
                action: 'bulkEdit',
                onSuccess: this.printKitchen
            },
            orderPopup: ''
        })
    }
    printKitchen = (item) => {
        const { order, active_seat } = this.props;
        let out = [{
            type: 'set_main_orders__details',
            data: {
                item: {
                    seat_num: active_seat
                }
            }
        },
        {
            type:'set_main_popup', data:{popup:''}
        } 
]
        if (!window.cordova) {
            out.push({
                type: 'set_main_Printing', data: { print: { active: 'Kitchen', order: order.id, items: isArray(item) ? item.map(d => d.id) : [item.id] } }
            })
        }
        return out
    }
    openPopup=()=>{
        const {setMain, orderDetail} = this.props
        const popup = {type: 'FireAt', visable:true,width:"50%",childProps:{
            type:'item', orderDetail
        }}
        setMain('popup',{popup})
    }
    

    render() {
        return (
            <>
                <div className={classes.fireFlex}>
                    <label className={classes.popupHeader}>Fire Item</label>
                </div>
                <div className={classes.btns}>
                    <button onClick={this.fire}>Fire Now</button>
                    <button onClick={this.openPopup}> Fire At</button>
                </div>
                
               
            </>
        )
    }
}
const mapStateToProps =(state)=>({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    orderDetail: get(state.orders__details, `data.${state.orders__details.active}`, {}),
    activeSeat: get(state.orders__details, 'item.seat_num', {}),
    
})
export default connect(mapStateToProps,mapDispatchToProps)(FireItem)




