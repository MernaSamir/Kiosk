import React, { Component } from 'react'
import { map, get, filter, toArray } from 'lodash'
import DropDown from 'helpers/functions/drop_down'
import Calculation from 'helpers/functions/calculation'
import Edit from 'components/edit_action'
import Delete from 'components/recycle_bin'
import Note from 'components/note'
import CheckIn from './components/check_in'
import classes from './styles.less';
import moment from 'moment';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { isEqual } from 'lodash'
import { withTranslation } from 'react-i18next';
import { multiRequest } from 'helpers';

var Table = (row = {}, setMain) => (
    [
        { head: 'Event Name', view: 'event_name', class: classes.name },
        { head: 'Customer Name', view: 'customer_name', class: classes.name },
        { head: 'Phone', view: 'mobile', class: classes.phone },
        {
            head: 'Space', Component: <DropDown appName="dinin__zones"
                show='name' type="dropDown" filter={row.zones} filterKey='id' />, class: classes.date
        },
        { head: 'Guest', view: 'guest', class: classes.date },
        { head: 'Hour', Component: <span> {`${moment(row.from_hour).format('HH')} - ${moment(row.to).format("HH")}`} </span>, class: classes.hour },
        {
            head: 'Deposit',
            Component: <Calculation appName="parties__event_deposit" filter={row.id} function='sum' field='amount' />,
            class: classes.note
        },
        { head: 'Check In', Component: <CheckIn reservation={row} />, class: classes.note },
        { head: 'Notes', Component: <Note reservation={row} />, class: classes.note },
        { head: 'Edit', Component: <Edit onClick="EditEvent" item={row} />, class: classes.note },
        {
            head: 'Delete', Component: <Delete reduxName='parties__reservation'
                item={row} onClick="Delete" title='Delete Reservation' singleitem='Reservation' />,
            class: classes.note
        },

    ])
class EventList extends Component {
    pagingList = []
    componentDidMount() {
        const { afterFetch = () => { } } = this.props
        multiRequest({
            parties__reservation_notes: {},
            parties__event_deposit:{},
            dropdowns__currencies:{},
            parties__event_checkin:{},
            orders__main:{},
            orders__details:{},
        })
        afterFetch(toArray(this.pagingList))
    }
    renderHeaders = () => {
        const { t } = this.props
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
    updateList = () => {
        const { data, params } = this.props
        const compDate = moment(params.date__date);
        const list = filter(data, (d) => (!moment(moment(d.date).format('YYYY-MM-DD')).diff(compDate, 'days')
        ))
        if (!isEqual(this.pagingList, list)) {
            this.pagingList = list
            this.props.afterFetch(list)
        }

    }

    render() {
        const { page } = this.props;
        this.updateList()
        return (
            <>
                <table className={classes.reserv_list}>
                    <thead>
                        <tr  >{this.renderHeaders()}</tr>
                    </thead>
                    <tbody>
                        {map(this.pagingList, (d, key) => (
                            <tr className={classes.trs} key={key}>{this.renderRowData(d)}</tr>
                        )).slice(10 * (page - 1), 10 * page)}
                    </tbody>
                </table>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    item: state.item,
    params: { date__date: (state.parties__reservation.selectedDate || moment()).format("YYYY-MM-DD") },

    data: filter(state.parties__reservation.data, { _type: 'ev' }),

    get filters() { return this.params },
    Notes: state.parties__reservation_notes

})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EventList))
