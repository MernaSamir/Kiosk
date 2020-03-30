import React, { Component } from 'react'
import Clock from 'react-live-clock';
import { withRouter } from 'react-router-dom'
import { get, find } from 'lodash'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import Note from 'components/order_note'
import { withTranslation } from 'react-i18next';
import Dropdown from 'components/dropdown'

class Details extends Component {

    openNote = () => {
        const { order, setMain } = this.props
        const popup = {
            type: 'AddNote',
            width: '70%',
            childProps: {
                note: get(order, 'note', ''),
                title: "Order Note",
                type: 'Order Note',
                mode: true,
                onClick: this.addNote,
            }
        }
        setMain('popup', { popup })
    }

    addNote = (note) => {
        const { setMain, order } = this.props
        setMain('orders__main', { item: { id: order.id, note, action: 'update' } })
    }

    customerHandle = () => {
        const { history } = this.props
        history.push('/list/customer');
    }

    getCustomer = () => {
        const { order, t } = this.props
        const cust = applyFilters({ path: `parties__customer.data.${order.customer}` })
        return get(cust, `name`, t("Customer Name"))
    }

    renderCurrency = () => {
        const { currency, t } = this.props
        const currencies = applyFilters({
            path: 'dropdowns__currencies',
            key: 'Filter',
            params: {
                active: true
            }
        })
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

    renderTime = () => {
        const { zone, t } = this.props;
        const minCharge = applyFilters({
            key: 'Find',
            path: 'financials__minimum_charge',
            params: {
                zone: zone.id,
                sub_mode: zone.sub_mode
            }
        })

        return <div className={classes.time_details}>
            <p>
                <Clock format={"DD/MM/YYYY , HH:mm A"} ticking={true} />
            </p>
            {minCharge && <p>{t('Minimum charge')}: {minCharge.value}</p>}
        </div>
    }

    renderDetails = () => {
        const { table = {}, order = {}, waiter, t } = this.props;
        return <div className={classes.t_details}>
            <p>{t("DineIn")} #{order.num}</p>
            <div className={classes.flex}>
                <span>{t('T')}: {table.name}</span>
                <span>{t('G')}: {order.guests_num}</span>
                <span>{t('Server')}: {waiter.name}</span>
            </div>
        </div>
    }

    render() {
        const { order = {} } = this.props;
        return (

            <div className={classes.dineIn_details}>
                <div className={classes.info}>
                    {this.renderTime()}
                    {this.renderDetails()}
                </div>
                <div className={classes.actions}>
                    <div className={classes.btns}>
                        <button className={classes.customerName_btn} onClick={this.customerHandle}>
                            {this.getCustomer()}
                        </button>
                        <Note order={order}></Note>
                    </div>
                    {this.renderCurrency()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
    order: get(state.orders__main.data, state.orders__main.active, {}),
    get waiter() { return get(state.auths__user.data, this.order.serve, {}) },
    zone: get(state.dinin__zones.data, state.dinin__zones.active, {}),
    currency: state.dropdowns__currencies.active || ''
    // subMode: get(state.settings__sub_mode, 'active', ''),
    // get minCharge() {return find(state.financials__minimum_charge.data,{zone:this.zone.id, sub_mode:this.zone.subMode})}
});

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Details)))