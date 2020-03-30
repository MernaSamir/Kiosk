import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment'
import { withTranslation } from 'react-i18next';

const controls = {
    // row1: [
    //     {
    //         name: 'event_name', label: "Deposit Value", type: 'TextBox',
    //         validates: { required: true, noSpecialChar: '', maxLength: '20' }
    //     },
    //     {
    //         name: 'name', label: "Max. Payment Date", type: 'TextBox',
    //         validates: { required: true, noSpecialChar: '', maxLength: '20' }

    //     },

    //     {
    //         name: 'other', label: "Other Info", type: 'TextBox',
    //         validates: { required: true, noSpecialChar: '', maxLength: '100' }
    //     },
    // ],
    row2: [
        {
            name: 'deposit.deposite', label: "", type: 'Table_Add',
            btn: {
                name: 'Add Deposite',
                style: classes.depoBtn
            },
            fields: [
                {
                    name: 'currency', label: "Currency", type: 'SelectA', className: classes.Select,
                    app: {
                        name: 'dropdowns__currencies',
                    },
                },
                {
                    name: 'amount', label: "Amount", type: 'NumberField',
                    validates: { required: true, number: "", minLength: '2' },
                },
                {
                    name: "depositer", label: "Depositer", type: 'TextBox',
                    validates: { required: true, noSpecialChar: '', maxLength: '20' }
                },
                {
                    name: 'date', label: "Date", type: 'ButtonPopup', popupType: 'DataSelector',
                    validates: { required: true }, className: classes.buttonpop, ftype: 'date',
                    initValue: moment()

                },
            ]
        }
    ],

}
class Menu extends Component {
 
    render() {
        const {t} = this.props
        return (

            <div className={classes.DepositeDiv}>
                <div>
                    <p className={classes.p}>{t("Deposite Details")}</p>
                    <div className={classes.form}>
                        {Render(controls.row2)}
                    </div >

                </div>

            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(withTranslation()(Menu))
