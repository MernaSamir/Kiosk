import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { get, isEqual, find, filter } from 'lodash'
import { connect } from 'react-redux';
import Details from './details'
import classes from './style.less';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import Dropdown from 'components/dropdown'
import { message } from 'antd';
import moment from 'moment'
import Clock from "helpers/components/clock"
class TakeawayBillHeader extends Component {
    params = { end_time__isnull: 1 }
    constructor(props) {
        super(props);
        let dis = []
        if (!props.active) {
            const active = get(applyFilters({
                key: 'FindOne',
                path: 'orders__main',
                select: {
                    station: 'licensing__station.active',
                    mode: 'settings__mode.active',
                    end_time: null, hold_time: null, canceled_time: null
                }
            }), "id")
            dis.push({ type: 'set_main', app: 'orders__main', data: { active } })
            dis.push({ type: 'set_main', app: 'dinin__tables', data: { active: '' } })
            if (active) {
                const receipt = get(applyFilters({
                    key: 'FindOne',
                    path: 'orders__receipt',
                    select: {
                        order: active
                    }
                }), "id")
                dis.push({ type: 'set_main', app: 'orders__receipt', data: { active: receipt } })
            }
            props.setAll(dis);
        }
        this.currencies = applyFilters({
            path: 'dropdowns__currencies',
            key: 'Filter',
            params: {
                active: true
            }
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.checkOrder(nextProps);
        return !isEqual(nextProps, this.props);
    }

    checkOrder(nextProps) {
        if (!isEqual(this.props.salesItem, nextProps.salesItem) && nextProps.salesItem && !nextProps.active) {
            const { setMain } = this.props
            if (moment().diff(moment(nextProps.business_day.created_at), 'day') == 0) {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active'
                    }
                })
                setMain('orders__main', { item: { ...data, action: 'add', start_time: new Date() } })
            } else {
                message.warning('You Cannot Order in this business day please end Day First')
            }
        }
    }

    time(order) {
        return <div className={classes.time_details}>
            <p> <Clock format={'DD/MM/YYYY , HH:mm A'} /></p>
            {this.renderCurrency()}
        </div>
    }

    renderCurrency = () => {
        const { currency, t } = this.props
        const currencies = this.currencies
        // console.log(currencies)
        if (currencies.length < 2) {
            return <></>
        }
        let alter = find(currencies, { is_base_currency: true })
        return alter && <div className={classes.currency}>
            <Dropdown data={currencies}
                btnClass={classes.header_btn}
                clickedclass={classes.header_btn}
                onChange={this.setCurrentCurrency}
                value={currency || alter.id}>
                {t('Currency')} :
         </Dropdown>
        </div>
    }

    setCurrentCurrency = (active, currency) => {
        const { setAll } = this.props;
        let dis = [
            { type: 'set_main', app: 'dropdowns__currencies', data: { active } },
        ]
        setAll(dis)
    }

    details(currentOrder) {
        const { user, history, active, t } = this.props
        return <Details {...{ history, user, currentOrder, show: active, t }} />
    }
    getOrder() {
        const { active } = this.props;
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
            <div className={classes.container}>
                {this.time(order)}
                {this.details(order)}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    active: state.orders__main.active,
    salesItem: get(state.items__sales_items, 'active', ""),
    // currencies: filter(state.dropdowns__currencies.data, { active: true }),
    currency: state.dropdowns__currencies.active || ''
})
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        TakeawayBillHeader
    )
)
