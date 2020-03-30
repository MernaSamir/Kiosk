import React, { Component } from 'react'
import classes from './style.less'
import {connect} from 'react-redux'
import { get , map} from 'lodash';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main'

class Void extends Component {
    static onSubmit(props, values) {
  
     const {course, type, setMain, orderDetail, order} = props
     if(type == 'course'){
         if(course.id){
            this.fireCourse(values.time, props)
         }
         else{
             this.fireAll(values.time, props)
         }
     }
     else{
        
        const details = applyFilters({
            key:'Filter',
            path: 'orders__details',
            params:{
                order: order.id,
                parent: orderDetail.id
            }
        })
        setMain('orders__details', {item:{
                data: [{
                    id: orderDetail.id,
                    fired_time: values.time
                }, ...details.map(d => ({
                    id: d.id,
                    fired_time: values.time
                }))]
            , action:'bulkEdit', 
        onSuccess(){
            return [{type:'set_main_popup', data:{popup:''}}]
        }}})
     }
    }
    
    static fireAll(time, props){
        
        const {order={}, setMain} = props;
        setMain("orders__details", {
            item: {
                filter: {fired_time__isnull: true, deleted: false, parent__isnull: true, order: order.id},
                exclude: {
                    deleted: true
                },
                data: {
                    fired_time: time
                },
                action: 'manyEdit',
                onSuccess(){
                    return [{type:'set_main_popup', data:{popup:''}}] 
                }
            }
        })
    }
    afterPrint = (filters,time)=>{
        const {setMain} = this.props;
        setMain("orders__details", {
            item: {
                filter: filters,
                exclude: {
                    deleted: true
                },
                data: {
                    fired_time: time
                },
                action: 'manyEdit',
            }
        })
    }
    printKitchen = (items)=>{
        const {order} = this.props;
        // console.log(items)
        this.props.onCancel()
        let out = [{
            type: 'set_main_orders__details', 
            data: {
                item: {
                    seat_num: this.active_seat
                }
            }
        }, {
            type: 'set_main_Printing', 
            data: {
                print: {
                    active: 'Kitchen',
                    order: order.id,
                    items: map(items, d=>d.id),
                }
            }
        }]
        return out
    }
    static fireCourse(time, props){
        const {order={},course, setMain} = props;
        setMain("orders__details", {
            item: {
                filter: {fired_time__isnull: true, deleted: false, course: course.id, order: order.id},
                exclude: {
                    deleted: true
                },
                data: {
                    fired_time: time
                },
                action: 'manyEdit',
                onSuccess(){
                    return [{type:'set_main_popup', data:{popup:''}}] 
                }
            }
        })
    }
    
   
    renderPad = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: "time",
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            className:classes.numPad,

        }])
    }
    
    renderField =()=>{
        
        return Render([{
            name: 'time',
            label: "Time",
            type: 'TimePicker',
            validates: { required: true}
         }])

        // return Render([{
        //     type: "TextBox",
        //     name: 'time',
        //     // validates: { required: true},
        //     no_keyboard :true,
        //     placholder:'mm'
        // }])
    }
    renderButtons=()=>{
        const{onCancel} = this.props
        return <div className={classes.saveBtns}>
                    <button onClick={onCancel}>cancel</button>
                    <button type='submit'>ok</button>
                </div>
    }
  render() {
    const {course, type} =  this.props
    const name = type=='course'? get(course,'name', 'All Courses') :'Item'

    return (
        <div className={classes.tablePopupDiv} >
       <div className={classes.popupTitle}>
            <span >Fire {name} At:</span>
        </div>
        <div className={classes.quantity}>
           
            {this.renderField()}
        </div>
              <div className={classes.popupCalculator} >
             {/* {this.renderPad()} */}
        </div>
        {this.renderButtons()}
    </div>
    )
  }
}
const mapStateToProps = (state) =>({
    order:get(state.orders__main,`data.${state.orders__main.active}`,{}),
})

export default connect (mapStateToProps, mapDispatchToProps)(Form(Void))
