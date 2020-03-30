import React, { Component } from 'react'
import classes from './style.less'
import Informations from './main_layout'
import { withRouter } from 'react-router'
import { map } from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Actions from './actions';
import Form from 'helpers/wrap/form'
import { get } from 'lodash';
import applyFilters from 'helpers/functions/filters'
import { withTranslation } from 'react-i18next';

let flag = false

class Reservation extends Component {
    state = {
        active: 0
    }
    tabs = [{
        name: "Basic Info"
    },
    {
        name: "Notes"
    },
    ]
    activeHeader = (active) => {
        this.setState({
            active
        })
    }
    static onSubmit(props, values, formikProps) {

        const { setMain } = props;
        if (!flag) {
            flag = true
            const action = values.id ? 'update' : 'add'

            setMain('parties__reservation', {
                item: {
                    ...values, action, onSuccess:
                        this.editNote.bind(this, { ...props, ...formikProps }, values)
                }
            })

        }

    }
    static editNote(props, values, reservation) {
        return [{
            type: 'set_main_parties__reservation_notes', data: {
                item: {
                    data: map(values.notes, d => ({ ...d, reservation: reservation.id })),
                    action: 'bulkEdit',
                    onSuccess: this.saveReservation.bind(this, props, values, reservation)
                }
            }
        }
        ]
    }
    static saveReservation(props, values, item) {
        const { tables, history } = props;
        const table = get(tables, values.table, {})
        let msg
        const action = values.id ? 'update' : 'add'
        action == "add" ? msg = 'Reservation Created' : msg = "Reservation Edited"
        const popup = {
            type: 'Save', visable: true, width: "50%",
            childProps: {
                msg: msg,
            }
        }
        flag = false
        history.goBack()
        props.resetForm({});
        return [
            { type: 'set_path_dinin__tables', path: `data.${table.id}.reservation`, data: item.id },
            { type: 'set_main_popup', data: { popup } }
        ]

    }
    renderTabs() {
        const { active } = this.state;
        const { t } = this.props;
        return map(this.tabs, (d, index) =>
            (<div className={`${classes.navHeader} ${index == active && classes.active}`}
                onClick={this.activeHeader.bind(this, index)}>
                <span>{t(d.name)}</span>
            </div>))
    }
    render() {
        const { active } = this.state
        return (
            <div className={classes.contaier}>
                <div className={classes.header}>
                    <div className={classes.tabs}>
                        {this.renderTabs()}
                    </div>
                    <Actions />
                </div>

                <Informations
                    active={active}>
                </Informations>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    // initialValues: props.initialValues,
    tables: get(state.dinin__tables, "data", {}),
    initialValues: props.initialValues || { _type: 't' }

})
export const ReservationAdd = withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(Reservation))))
export class ReservationEdit extends Component {
    constructor(props) {
        super(props);
        const reservation = applyFilters({
            key: 'GetDataSelector',
            path: 'parties__reservation',
            show: props.match.params.id
        });
        const params = { reservation: reservation.id }
        const notes = applyFilters({
            key: 'Filter',
            path: 'parties__reservation_notes',
            params
        });
        this.initialValues = {
            ...reservation,
            _type: 't',
            notes

        }
    }
    render() {
        return <ReservationAdd initialValues={this.initialValues} />
    }
}
export default ReservationAdd;