import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import {get, map} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'


class FireCourse extends Component {
    constructor(props) {
      super(props);
        this.active_seat = applyFilters({
            path: 'orders__details.item.seat_num'
        })
      this.state = {};
    }
    fireAll=()=>{
        const {order={}} = this.props
        this.afterPrint({fired_time__isnull: true, deleted: false, parent__isnull: true, order: order.id});
    }
    afterPrint = (filters)=>{
        const {setMain} = this.props;
        setMain("orders__details", {
            item: {
                filter: filters,
                exclude: {
                    deleted: true
                },
                data: {
                    fired_time: new Date()
                },
                action: 'manyEdit',
                onSuccess: this.printKitchen
            }
        })
    }
    printKitchen = (items)=>{
        const {order} = this.props;
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
        },
        {
            type: 'set_main_dropdowns__courses', 
            data: {active:''}
        }]
        return out
    }
    fireCourse=(course)=>{
        const {order={}} = this.props;
        this.afterPrint({fired_time__isnull: true, deleted: false, course: course.id, order: order.id})
    }
    fireTime=(key)=>{
        const {course, setMain} = this.props
        if(key=='now'){
            if(course.id){
                this.fireCourse(course)
            }
            else{
                this.fireAll()
            }
        }
        if(key =='at'){
            const popup = {type: 'FireAt', visable:true,width:"50%",childProps:{
                type:'course', course
            }}
            setMain('popup',{popup})
        }
    }

    render() {
        const {course} =  this.props
        const name = course.id?course.name:'All Courses'
        return (
            <>
                <div className={classes.fireFlex}>
                    <label className={classes.popupHeader}>Fire: {name}</label>
                </div>
                <div className={classes.btns}>
                    <button onClick={this.fireTime.bind(this,'now')}>Fire Now</button>
                    <button onClick={this.fireTime.bind(this,'at')}>Fire At</button>
                </div>
                
               
            </>
        )
    }
}
const mapStateToProps =(state)=>({
    active:get(state.dropdowns__courses.data,state.dropdowns__courses.active,{}),
    order:get(state.orders__main,`data.${state.orders__main.active}`,{}),
    
})
export default connect(mapStateToProps,mapDispatchToProps)(FireCourse)




