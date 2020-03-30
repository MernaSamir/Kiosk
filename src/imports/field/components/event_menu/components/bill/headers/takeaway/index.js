import React, {Component} from 'react'
import Clock from 'react-live-clock';
import { withRouter } from 'react-router-dom'
import { get, isEqual } from 'lodash'
import {connect} from 'react-redux';
import Details from './details'
import classes from './style.less';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import {message} from 'antd';
import moment from 'moment'
class TakeawayBillHeader extends Component {
    params = { end_time__isnull: 1 }

    time(order) {
        return <div className={classes.time_details}>
            <p> <Clock format={'DD/MM/YYYY , HH:mm A'} ticking={true} /></p>
        </div>
    }

    details(currentOrder) {
        const { user, history, active } = this.props
        return <Details {...{ history, user, currentOrder, show: active }} />
    }
    getOrder(){
        const {active} = this.props;
        this.order = applyFilters({
            key: 'GetDataSelector',
            path: 'orders__main',
            show: active
        })
        return this.order;
    }

    render() {
        const order = this.getOrder();
        return (
            <div className="">
                {this.time(order)}
                {this.details(order)}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    active: state.orders__main.active,
    salesItem: get(state.items__sales_items, 'active', "")
})
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        TakeawayBillHeader
    )
)
