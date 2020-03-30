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
            name: 'basic.event_name', label: "Event Name", type: 'TextBox', className: classes.eventTBOX,
            validates: { required: true, noSpecialChar: '', maxLength: '20' }
        },
        {
            name: 'basic.customer_name', label: "Customer Name", type: 'TextBox', className: classes.eventTBOX,
            validates: { required: true, noSpecialChar: '', maxLength: '20' }

        },

        {
            name: 'basic.mobile', label: "Mobile Phone", type: 'NumberField',
            validates: { required: true, number: "", minLength: '11', maxLength: '11' }
        },
    ],
    row2: [
        {
            name: 'basic.date', label: "Date", type: 'ButtonPopup', popupType:'DataSelector',
            validates: { required: true, before_today: true}, className: classes.buttonpop , ftype:'date',
            initValue: moment()
        },
        { name: 'basic.from_hour', label: "Hour", type: 'TimePicker', className: classes.timepick,
        validates: { required: true}, },
        {
            name: "basic.duration", label: "Duration", type: 'NumberField', className: classes.duration,
            validates: { required: true, minLength: '1', number: "" }
        },
        {
            name: "basic.guest", label: "Guest", type: 'NumberField',className: classes.duration
        },
        {
            name:'basic.zones',
            label: "Floor / Zone",
            type: 'TreeSelect',
            value: "name",
            mode: 'multiple',
            fetchApi: ['dinin__zones'],
            tree: {
                reduxName: 'dinin__floors',
                child: {
                    reduxName: 'dinin__zones',
                    match: 'floor_id',
                }
            },
        },
    ],

}
class Basic extends Component {
    render() {
        const {t} = this.props
        return (

            <div className={classes.basicDiv}>
                <div style={{height:"80vh"}}>
                    <p className={classes.p}>{t("Event Reservation Details")}</p>
                    <div className={classes.form}>
                        {Render(controls.row1)}
                    </div >
                    <div className={classes.form}>
                        {Render(controls.row2 )}
                    </div>

                </div>

            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(withTranslation()( Basic))
