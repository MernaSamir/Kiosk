import React, { Component } from 'react'
import classes from '../style.less'
import { map } from 'lodash'
import moment from 'moment';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get, first, last } from 'lodash';
import applyFilters from 'helpers/functions/filters'

class Header extends Component {

    renderTime = (date) => {
        return moment(date).format('lll')
    }

    renderTrs = () => {
        const { businessDay = [], data, station } = this.props
        const station_name = applyFilters({ path: `licensing__station.data.${station}` })
        const currency = applyFilters(
            {
                key: 'Find', path: 'dropdowns__currencies', params: { is_base_currency: true }
            })
        const ranges = [0, businessDay.length - 1]
        const businessDays = businessDay.filter((d, i) => (ranges.includes(i)))
        const f_bd = first(businessDays) || {};
        const l_bd = last(businessDays) || {};

        const trs = {
            Location: {
                key: "Location",
                value: get(station_name, 'full_name', 'All Stations')
            },
            BusinessDay: {
                key: "Business Day",
                value: `${businessDays.map(d => d.business_day).join(' / ')}`
            },
            Started: {
                key: "",
                value: `Started @ ${this.renderTime(f_bd.start_time)}`
            },
            Ended: {
                key: "",
                value: l_bd.end_time && `Ended @ ${this.renderTime(l_bd.end_time)}`
            },
            FirstOrder: {
                key: "First Order",
                value: get(data, 'totals.orders.first') && this.renderTime(get(data, 'totals.orders.first'))
            },
            LastOrder: {
                key: "Last Order",
                value: get(data, 'totals.orders.last') && this.renderTime(get(data, 'totals.orders.last'))
            },
            Orders: {
                key: "Orders",
                value: get(data, 'totals.lengths.orders', '')
            },
            Receipts: {
                key: "Receipts",
                value: get(data, 'totals.lengths.receipts', '')
            },
            Guests: {
                key: "Guests",
                value: get(data, 'totals.lengths.guests', '')
            },
            Currency: {
                key: "Currency",
                value: get(currency, 'symbol', "EGP")
            }
        }
        return map(trs, (d, key) => (
            <tr>
                <td className={classes.key}>{d.key}</td>
                <td className={classes.value}>{d.value}</td>
            </tr>
        ))
    }
    render() {
        return (
            <>

                <div className={classes.Header}>
                    <table>
                        <tbody >

                            {this.renderTrs()}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => ({
    data: get(state.report, 'data', {}),
    station: get(state.report, 'filters.station', '')
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
