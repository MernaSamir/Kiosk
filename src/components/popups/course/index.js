import React, { Component } from 'react'
import classes from './style.less'
import Courses from './courses'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
import { get } from 'lodash';

class CoursePopUp extends Component {
    setCourse=(course)=>{
        const{setMain, order = {}} = this.props
        setMain("orders__details", {
            item: {
                filter: { course__isnull: true, order: order.id || '' },
                exclude: {
                    deleted: true
                },
                data: { course: course.id }, action: 'manyEdit',
                onSuccess:()=>{
                    return [{
                        type: 'set_main_popup',
                        data: {popup:''}
                    }]
                }
            }
        })
    }
    render() {
        return (
            <>
                <div className={classes.coursesPopup}>
                    <label className={classes.popupHeader}>Course</label>
                </div>
                <Courses onClick={this.props.onClick} />
            </>
        )
    }
}
const mapStateToProps=(state,ownProps)=>({
    order:get(state.orders__main.data, state.orders__main.active, {})
})
export default connect(mapStateToProps,mapDispatchToProps)(CoursePopUp)

