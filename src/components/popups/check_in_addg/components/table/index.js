import React, { Component } from 'react'
import Edit from 'components/edit_action'
import Delete from 'components/recycle_bin'
import classes from './style.less';
import mapDispatchToProps from 'helpers/actions/main'
import { map, get} from 'lodash'
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';

var Table = (row = {}, setMain) => (
    [
        { head: 'Guest #', view: 'guest_num', class: classes.name },
        { head: 'Name', view: 'name', class: classes.name },
        { head: 'Phone', view: 'mobile', class: classes.name },
        { head: 'Edit', Component: <Edit onClick="EditCheckin" item={row} />, class: classes.note },
        { head: 'Delete', Component: <Delete item={row} reduxName='parties__event_checkin' 
        title='Delete Reservation' singleitem='Reservation' onClick='delete' />, class: classes.note },
    ])
class table extends Component {
    renderHeaders = () => {
        const {t} = this.props
        return map(Table(), (d, index) => {
            return <th key={index} className={d.class}>{t(d.head)}</th>
        })
    }
    renderRowData = (row) => {
        const { setMain } = this.props
        return map(Table(row, setMain), (d, index) => {
            return <td key={index} className={d.class}>{get(row, d.view, d.Component)}</td>
        })
    }
    render() {
        const { reservation } = this.props
        const filtered_list = applyFilters({
            key: 'Filter',
            path: 'parties__event_checkin',
            params: {
                reservation: reservation
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                }
            }
        })
        return (
            <table className={classes.table}>
                <thead>
                    <tr  >{this.renderHeaders()}</tr>
                </thead>
                <tbody>
                    {map(filtered_list, (d, key) => (
                        <tr className={classes.trs} key={key}>{this.renderRowData(d)}</tr>
                    ))}
                </tbody>
            </table>
        )
    }
}
const mapStateToProps = (state, props) => ({
    reservation: get(state.parties__reservation, 'active', {}),
    active: get(state.parties__event_checkin.data, state.parties__event_checkin.active, {}),
    data: state.parties__event_checkin.data

})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(table))