import React, { Component } from 'react'
import classes from './style.less'
import Courses from '../course/courses'
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
    fireCourse=(course)=>{
        const {order={}} = this.props;
        this.afterPrint({fired_time__isnull: true, deleted: false, course: course.id, order: order.id})
    }
   
    chooseCourse=(course)=>{
        const {setAll} = this.props
        const popup = {type: 'FireTime', visable:true,width:"50%",
        childProps:{
            course:course
        }}
            setAll([
                {type: 'set_main', app: 'popup', data: {popup}}
            ])
       
    }

    render() {
        return (
            <>
                <Courses onClick={this.chooseCourse}/>
                <div className={classes.fireFlex}>
                    <button className={classes.fireAllButton} onClick={this.chooseCourse.bind(this, 'all')}>All</button>
                </div>
            </>
        )
    }
}
const mapStateToProps =(state)=>({
    order:get(state.orders__main,`data.${state.orders__main.active}`,{}),
    fire_time:get(state.orders__details,'fire_time','')
    
})
export default connect(mapStateToProps,mapDispatchToProps)(FireCourse)
