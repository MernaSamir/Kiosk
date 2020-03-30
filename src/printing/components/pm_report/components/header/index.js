import React, { Component } from 'react'
import classes from '../style.less'
import { map} from 'lodash'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get, first, last} from 'lodash';
class Header extends Component {
    constructor(props) {
        super(props)
    }


    renderTrs = () => {
        const { businessDay=[], data, station, renderTime } = this.props
        const ranges = [0, businessDay.length-1]
        const businessDays = businessDay.filter((d,i)=>(ranges.includes(i)))
        const f_bd = first(businessDays)||{};
        const l_bd = last(businessDays)||{};

        const trs = {
            Location: {
                key: "Location",
                value: station.full_name
            },
            BusinessDay: {
                key: "Business Day",
                value: `${businessDays.map(d=>d.business_day).join(' / ')}`
            },
            Started: {
                key: "",
                value: `Started @ ${renderTime(f_bd.start_time)}`
            },
            Ended: {
                key: "",
                value: l_bd.end_time && `Ended @ ${renderTime(l_bd.end_time )}`
            },
            FirstOrder: {
                key: "First Order",
                value: data.first_order && renderTime(data.first_order.created_at)
            },
            LastOrder: {
                key: "Last Order",
                value: data.last_order && renderTime(data.last_order.created_at)
            },
            Receipts: {
                key: "Receipts",
                value: data.receipt
            },
            Guests: {
                key: "Guests",
                value: data.guests
            },
            Currency: {
                key: "Currency",
                value: "EGP"
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

                <div className={classes.details}>
                    <table>
                        <tbody className={classes.tbody_details}>

                            {this.renderTrs()}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state)=>({
    station: get(state.licensing__station.data, state.licensing__station.active, {})
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
