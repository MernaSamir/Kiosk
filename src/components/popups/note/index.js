import React, { Component } from 'react'
import classes from './styles.less'
import { withRouter } from 'react-router'
import { map } from 'lodash'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form';
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next';

class CancelCustomer extends Component {
    static onSubmit() {

    }
    onbtnClick=(value)=> {
        const { setMain, reservation } = this.props
        const item = {
            reservation: reservation.id,
            note: value
        }

        setMain('parties__reservation_notes', { item: { ...item, action: 'add' } })

    }
    saved(item) {
        return[]
    }
    renderNotes = () => {
        const { Notes , t} = this.props
        return map(Notes, (d, key) => (
            <p className={classes.first}>{t(d.note)}</p>
        ))
    }
    addNew = () => {
        return Render([{
            type: "ButtonPopup",
            name: 'note',
            className: classes.button,
            popupType: "AddNote",
            ftype: "note",
            onbtn: "Add New Note",
            onbtnClick: this.onbtnClick


        }])
    }
    render() {
        const { Title , t} = this.props
        return (
            <div className={classes.all}>
                <p className={classes.title}>{t(Title)}</p>
                <div className={classes.msg}>
                    {this.renderNotes()}
                </div>
                {this.addNew()}

            </div>
        )
    }
}
export default withRouter(withTranslation()(connect(null, mapDispatchToProps)(Form(CancelCustomer))))
