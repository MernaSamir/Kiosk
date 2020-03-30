import React, { Component } from 'react'
import { map, get, filter, toArray, isEqual } from 'lodash'
import RenderdropDown from 'helpers/functions/drop_down'
import Edit from 'components/edit_action'
import Delete from 'components/recycle_bin'
import Note from 'components/note'
import classes from './styles.less';
import moment from 'moment';
import Header from './components/header';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';
import { multiRequest } from 'helpers';

var Table = (row = {}, setMain) => (
    [
        { head: 'Customer Name', view: 'name', class: classes.name },
        { head: 'Phone', view: 'mobile', class: classes.phone },
        {
            head: 'Table', Component: <RenderdropDown appName="dinin__tables" show="name"
                filter={[row.table]} filterKey='id' type='dropDown' />, class: classes.table
        },
        { head: '# Guests', view: 'guest', class: classes.date },
        { head: 'Time', Component: <span> {`${moment(row.from_hour).format('HH')} - ${moment(row.to).format("HH")}`} </span>, class: classes.table },
        { head: 'Deposit', view: 'deposite', class: classes.date },
        { head: 'Notes', Component: <Note reservation={row} />, class: classes.note },
        { head: 'Edit', Component: <Edit onClick="EditReservation" item={row} />, class: classes.note },
        {
            head: 'Delete', Component: <Delete item={row} onClick="Delete"
                reduxName='parties__reservation' title='Delete Reservation' singleitem='Reservation' />,
            class: classes.note
        },

    ])
class Reservation extends Component {
    pagingList = []
    state = {
        page: 1
    }
    afterFetch = (pagingList) => {
        this.setState({
            page: 1,
        })
    }
    handelPagination = (delta) => {
        const { page } = this.state
        this.setState({ page: page + delta })
    }
    componentDidMount() {
        const {afterFetch = () => { } } = this.props
        multiRequest({
               parties__reservation_notes:{},
             parties__reservation:{},
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


    render() {
        const { page } = this.state
        const { reservationList, reset, params, search } = this.props
        const compDate = moment(params.date);
        const begin = moment(params.Time || compDate)
        const end = params.Time ? moment(begin).add(1, 'hours') : moment(begin).set({ hour: '23', minute: '59', second: '59' })
        const filteredList = applyFilters({
            key: 'sameDate',
            date: compDate,
            format: 'YYYY-MM-DD',
            select: 'date',
            then: {
                key: 'oring',
                funs: [{
                    key: 'dateRanged',
                    start: begin,
                    end,
                    select: 'from_hour',
                    format: 'HH:mm'
                }, {
                    key: 'dateRanged',
                    start: end,
                    end,
                    select: 'from_hour',
                    format: 'HH:mm'
                }, {
                    key: 'dateBetween',
                    from: 'from_hour',
                    to: 'to',
                    date: begin,
                    format: 'HH:mm'
                }, {
                    key: 'dateBetween',
                    from: 'from_hour',
                    to: 'to',
                    date: end,
                    format: 'HH:mm'
                }]
            }
        }, reservationList)
        const maxlength = Math.ceil(filteredList.length /11)
        
        if (!isEqual(this.pagingList, filteredList)) {
            this.pagingList =  filteredList
            this.afterFetch(filteredList)
        }
        const list = search?applyFilters({
            key:'Search',
            data:this.pagingList,
            params:{
                name:search,
                mobile:search
            }
        }):this.pagingList
        return (
            <>
                <div >
                    <Header setMain={reset} page={page}
                        maxlength={maxlength}
                        handelPagination={this.handelPagination} />
                </div>
                <table className={classes.reserv_list}>
                    <thead>
                        <tr  >{this.renderHeaders()}</tr>
                    </thead>
                    <tbody>
                        {map(list, (d, key) => (
                            <tr className={classes.trs} key={key}>{this.renderRowData(d)}</tr>
                        )).slice(9 * (page - 1), 9 * page)}
                    </tbody>
                </table>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    item: state.item,
    params: {
        date: (state.parties__reservation.selectedDate || moment()).format("YYYY-MM-DD"),
        get Time() { return (state.parties__reservation.selectedTime) }
    },
    reservationList: filter(state.parties__reservation.data, { _type: "t" }),
    get filters() { return this.params },
    tables: state.dinin__tables,
    Notes: state.parties__reservation_notes,
    search: get(state.main, 'search', undefined)

})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Reservation))
