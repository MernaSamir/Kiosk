import React from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from '../style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment'
const controls = {
    row1: [
        {
            name: 'basic.birthday', label: "Birthday", type: 'ButtonPopup', popupType: 'DataSelector',
            show: 'date', className: classes.buttonpop, ftype: "date",
                 initValue: moment('01-01-2001')

        },
        {
            name: 'basic.anniversary', label: "Anniversary",
            type: 'ButtonPopup', popupType: 'DataSelector', show: 'date', 
            className: classes.buttonpop, ftype: "date",  initValue: moment()
        },
        {
            name: 'basic.occasion_cat', label: "Occasion", type: 'TreeSelect',
            mode: 'multiple',
            fetchApi: ['dropdowns__occasions'],
            tree: {
                reduxName: 'dropdowns__occasions',
            }
        },
    ],
    row2:
        [

            {
                name: 'family', label: "", type: 'RowForm', fields: [
                    { name: 'name', label: "Name", type: 'TextBox' },

                    {
                        name: 'birthday', label: "Birthday", type: 'ButtonPopup', popupType: 'DataSelector', show: 'date',
                        className: classes.buttonpop, ftype: "date", initValue: moment()
                    },
                    {
                        name: 'relationship', label: "Relationship", type: 'SelectA', className: classes.Select,
                        app: {
                            name: "parties__relationships",
                        }
                    }
                ]
            }
        ],

}

const ExtraInfoContent = (props) => {
    return (
        <div className={classes.fields}>
            <p className={classes.p}> Occasions</p>

            <div className={classes.form}>
                {Render(controls.row1)}
            </div>

            <p className={classes.p}>Family Members</p>
            <div className={classes.form}>
                {Render(controls.row2)}
            </div>
        </div>
    )
}
export default connect(null, mapDispatchToProps)(ExtraInfoContent)
