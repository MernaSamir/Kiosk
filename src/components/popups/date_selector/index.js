import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form'
import classes from './style.less';
import moment from 'moment'
import { withTranslation } from 'react-i18next';

class DateSelector extends Component {
    static onSubmit = (props, values) => {
       props.onClick(values.val);
       this.date = moment()
    }
    render() {
        const {t} = this.props
        return (
            <>
                {Render([{
                    name: "val",
                    type: 'TextBox',
                    label: 'Date Selector',
                    className : classes.date,
                    no_keyboard: true,
                    ftype: 'date',
                    show:'date',
                    initValue: this.date
                    
                }])}
                
                {Render([{
                    type: 'Calendar',
                    target: 'val',
                    className : classes.cal

                }])}
            <div className={classes.saveBtns}>
                    <button type='button' onClick={this.props.onCancel}>{t("Cancel")}</button>
                    <button type='submit'>{t("Ok")}</button>
                </div>
            </>
        )
    }
}
export default(withTranslation() (Form(DateSelector)))
