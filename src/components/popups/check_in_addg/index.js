import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less';
import Form from 'helpers/wrap/form.js';
import Table from './components/table'
import Actions from './components/actions'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash'
import { withTranslation } from 'react-i18next';


const controls = [
    {
        name: 'first_name', label: "First Name", type: 'TextBox',
        validates: { required: true, noSpecialChar: '', maxLength: '20' }
    },
    {
        name: 'middle_name', label: "Middle Name", type: 'TextBox',
    },
    {
        name: 'last_name', label: "Last Name", type: 'TextBox',
        validates: { required: true, noSpecialChar: '', maxLength: '20' }
    },
    {
        name: 'mobile', label: "Phone", type: 'TextBox',
        validates: { required: true, maxLength: '11', number: "" }
    },

]
 class CheckIn extends Component {
    
    static onSubmit(props, values,formProps ) {
        const action = values.id ? 'update' : 'add'
        const { setMain , reservation , } = props;
        setMain('parties__event_checkin', { 
            item: { 
                ...values, 
                reservation, 
                action:action, 
                onSuccess(){
                    formProps.resetForm({first_name:"",middle_name:"",last_name:"", mobile:""     });
                    return [{
                        type: 'set_main_parties__event_checkin',
                        data: {active: ''}
                    }]
                }
            }
        })

    }
    render() {
        const {onCancel, reservation, t} = this.props
        return (
            <>
            <div className={classes.DepositeDiv}>
                <p className={classes.p}>{t("Check In Add Guests")}</p>
                <div className={classes.form}>
                    {Render(controls, { onClick: this.props.selectInput })}
                </div>
                <button type="submit" className={classes.depoBtn} onClick={this.addCheckIn}>{t("Check In")}</button>
                <button type="button" className={classes.depoBtn}>{t("Add to CRM")}</button>
            </div>
            <Table/>
            <div className={classes.footer}>
                <p>{t("Total Guests")}:</p>
                <p>{t("Entry Fee")}:</p>
                <Actions onCancel= {onCancel} activeReservation={reservation}/>
            </div>
            
        </>
        )
    }
}
const mapStateToProps = (state) => ({
        reservation: get(state.parties__reservation,'active',''),
        CheckInList: state.parties__event_checkin.data,
        active:  get(state.parties__event_checkin.data, state.parties__event_checkin.active, {}),
        get initialValues(){return this.active}
    })
export default  withRouter(connect(mapStateToProps,mapDispatchToProps)(withTranslation()(Form(CheckIn))))
