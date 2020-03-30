import React, {Component} from 'react'
import { map, get,filter } from 'lodash'
import RenderdropDown from 'helpers/functions/drop_down/index'
import classes from '../styles.less';
import moment from 'moment';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';

var Table = (row = {}) => ([
    { head: 'Name', view: 'name', class: classes.name },
    { head: 'Guest', view: 'guest', class: classes.date },
    { head: 'Hour', view: 'hour', class: classes.hour },
    { head: 'Table', Component: <RenderdropDown appName="dinin__tables" show="name"
    filter={[row.table]} filterKey='id' type='dropDown'/>,class: classes.table  },


])

class List extends Component {
    renderRowData = (row) => {
        return map(Table(row), (d, index) => {
            return <td key={index} className={d.class}>{get(row, d.view, d.Component)}</td>
        })
    }
    active= (d) =>{
        const{setMain, active} = this.props
        if(active == d.id)
            setMain('parties__reservation',{active:''})
        else
            setMain('parties__reservation',{active:d.id})
    }
    
    render() {
        const { reservationList, params, active} = this.props
        const compDate = moment(params.date);
        const begin = moment(params.Time||compDate)
        const end = params.Time ? moment(begin).add(1, 'hours'):moment(begin).set({hour: '23', minute: '59', second: '59'})
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
        return (
            <div className={classes.listDiv}>
            <table className={classes.reserv_list}>
                <thead>
                </thead>
                <tbody>
                    {map(filteredList, (d, key) => (
                        <tr onClick={this.active.bind(this, d)} className={active==d.id?classes.selected:classes.trs} key={key}>{this.renderRowData(d)}</tr>
                    ))}
                </tbody>
            </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    item:state.item,
    params: { 
        date: (state.parties__reservation.selectedDate || moment()).format("YYYY-MM-DD"),
        get Time() {return (state.parties__reservation.selectedTime)}  
    },
    active: get(state.parties__reservation,'active', ''),
    activeReservation: get(state.parties__reservation.data, state.parties__reservation.active,{}),
    reservationList: filter(state.parties__reservation.data, { _type: "t" }),
    get filters() {return this.params},
    tables: state.dinin__tables,

})
export default connect( mapStateToProps,mapDispatchToProps )( List)
