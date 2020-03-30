import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';


class Actions extends Component {

    cancelAdd = () => {
        const { history, setMain } = this.props
        history.goBack()
        setMain('popup', { popup: {} })
    }

    CancelReservation = () => {
        const { setMain } = this.props
        const popup = {
            type: 'CancelCustomer', visable: true, width: "50%",
            childProps: {
                Title: 'Cancel New Event',
                first_msg: 'Are you sure you want to Cancel?',
                second_msg: 'All unsaved data will be lost',
                pressYes: this.cancelAdd
            }
        }
        setMain('popup', { popup })
    }

    cancel = () => {
        this.CancelReservation()
    }


    render() {
        const { t } = this.props
        return (
            <div className={classes.button}>
                <button type="button" onClick={() => this.cancel()}>{t("Cancel")}</button>
                <button type="submit" >{t("Save")}</button>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    list: state.parties__reservation.data,
    item: state.item

})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Actions)))
