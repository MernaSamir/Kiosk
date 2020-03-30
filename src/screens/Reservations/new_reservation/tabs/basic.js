import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less';
import {connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment'
import { withTranslation } from 'react-i18next';

const controls = {
    row1: [
        {
            name: 'first_name', label: "First Name", type: 'TextBox', 
            validates: { required: true,string:"", noSpecialChar: '', maxLength: '20' }
        },
        {
            name: 'middle_name', label: "Middle Name", type: 'TextBox',
        },
        {
            name: 'last_name', label: "Last Name", type: 'TextBox',
            validates: { required: true,string:"", noSpecialChar: '', maxLength: '20' }
        },
        {
            name: 'mobile', label: "Mobile Phone", type: 'NumberField',
            validates: { required: true, number: "", minLength: '11', maxLength: '11' }
        },
        {
            name: "guest", label: "# Guests", type: 'NumberField',className: classes.duration,
            validates: { required: true, number: "", maxLength: '2' }

        },
    ],
    row2: [
        {
            name: 'date', label: "Date", type: 'ButtonPopup', popupType:'DataSelector',
            validates: { required: true, before_today: true}, className: classes.buttonpop , ftype:'date',
            initValue: moment()

        },
        { name: 'from_hour', label: "Time", type: 'TimePicker', className: classes.timepick,
        validates: { required: true}, },
        {
            name: "duration", label: "Duration", type: 'NumberField', className: classes.duration,
            validates: { required: true, number: "" , maxLength: '1'}
        },
        {
            name: 'table', label: "Table", type: 'ButtonPopup', popupType:'AssignReservation',ftype:"select",
             className: classes.buttonpop, reduxName: "dinin__tables", show: 'name'

        },
    ],

}
class Basic extends Component {
    render() {
        const {t} = this.props

        return (

            <div className={classes.basicDiv}>
                <div>
                    <p className={classes.p}> {t("Reservation Details")}</p>
                    <div className={classes.form}>
                        {Render(controls.row1 , {onClick: this.props.selectInput})}
                    </div >
                    <div className={classes.form}>
                        {Render(controls.row2 , {onClick: this.props.selectInput})}
                    </div>

                </div>

            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)( withTranslation()( Basic))
