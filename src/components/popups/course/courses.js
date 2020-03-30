import React, { Component } from 'react'
import classes from './style.less'
import { map, get } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import applyFilters from 'helpers/functions/filters'

class Courses extends Component {

    handleClick = (course) => {
        const { onClick, setAll, orderDetails } = this.props
        if (onClick) {
            onClick(course)
        }
        else {
            setAll([
                {
                    type: 'set_main', app: 'orders__details', data: {
                        item: {
                            id: orderDetails,
                            course: course.id,
                            action: 'update'
                        }
                    }
                },
                { type: 'set_main', app: 'popup', data: { popup: {} } }
            ])
            // setAll([
            //     {type: 'set_main', app: 'dropdowns__courses', data: {active:course.id}},
            //     {type: 'set_main', app: 'popup', data: {popup:{}}},
            // ])
        }


    }
    renderCourses = () => {
        return map(this.list, (course, key) => (
            <button key={key} onClick={this.handleClick.bind(this, course)}>{course.name}</button>
        ))
    }

    render() {
        this.list = applyFilters({ key: 'Filter', path: 'dropdowns__courses', params: { active: true } })
        return (
            <div className={classes.courseBtns}>
                {this.renderCourses()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    orderDetails: get(state.orders__details, 'active', '')
})
export default connect(mapStateToProps, mapDispatchToProps)(Courses)
