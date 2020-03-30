import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import courseimg from 'assets/images/pinkCourse@3x.png'
import whiteImg from 'assets/images/white Course@3x.png'
import globalClasses from '../style.less'
import $ from "jquery"
import { withRouter } from 'react-router-dom'
import billClasses from '../../../style.less'
class MenuButton extends Component {
    constructor(props){
        super(props);
        this.activeItemClick = this.activeItem.bind(this, props.orderItem.id)
    }
    
  activeItem = (selected) => {
    const { setMain, active, permitted, modeKey, history, activeCourse } = this.props;
    if (permitted) {
        if (activeCourse) {
            setMain('orders__details', { active: selected, item: { id: selected, course: activeCourse, action: "update" } })
        }
        else {
            if (selected == active) {
                setMain('orders__details', { active: '', orderPopup: '' })
            }
            else {
                let p = $("#pop" + selected).offset();
                let tablePostion = $(`.${globalClasses.tableDiv}`).offset()
                let diff = (p.top - tablePostion.top) - 105
                if (modeKey == 'DI') {
                    let collapseDiv2 = $(`.${billClasses.bill}`).offset()
                    diff = collapseDiv2.top + 20
                }
                let orderPopup
                if (history.location.pathname == '/home') {
                    orderPopup = { show: 'show', top: diff }
                }
                else {
                    orderPopup = {}
                }
                setMain('orders__details', { orderPopup: orderPopup, active: selected })

            }
        }
    }

}
  render() {
    const { orderItem, active, course = {}, activeCourse, popup_course } = this.props;
    return (

      <td className={` ${classes.popup}`}
                onClick={this.activeItemClick}
                id={"pop" + orderItem.id}>
                {activeCourse&&!popup_course ? <img src={active == orderItem.id || course.id == activeCourse ? whiteImg : courseimg} /> :
                    <FontAwesomeIcon icon="bars" className={classes.tableIcon} />
                    }

            </td>
    )
  }
}

export default withRouter( MenuButton )
