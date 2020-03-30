import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import whiteCourse from 'assets/images/white Course@3x.png'
import course from 'assets/images/Icon Course (1).svg'
import classes from './style.less'
class Course extends Component {

    openPopup = () => {
        const { setMain, active } = this.props
        if (active.id) {
            setMain('dropdowns__courses', { active: '' })
        }
        else {
            const popup = { type: 'CoursePopup', visable: true, width: "50%",childProps:{
                onClick:this.active
            } }
            setMain('popup', { popup })
        }


    }
    active=(course)=>{
        const {setAll} = this.props
        setAll([
            {type: 'set_main', app: 'dropdowns__courses', data: {active:course.id}},
            {type: 'set_main', app: 'popup', data: {popup:{}}},
        ])
    }
    renderButton() {
        const { active, t, popup } = this.props
        return <button className={active.id&&!popup ? `${classes.btn} ${classes.active}` : classes.btn}
            onClick={this.openPopup}>
            <img src={active.id&&!popup ? whiteCourse : course} />
            <span>{t('Course')} {active.id&&!popup && ` - ${active.name}`}</span>
        </button>
    }
    render() {
        return (
            <>
                {this.renderButton()}

            </>
        )
    }
}

const mapStateToProps = (state) => ({
    active: get(state.dropdowns__courses, `data.${state.dropdowns__courses.active}`, {}),
    popup: get(state.popup ,'popup.type', undefined )
})

export default connect(mapStateToProps, mapDispatchToProps)(Course)
