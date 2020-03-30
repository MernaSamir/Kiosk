import React, { Component } from 'react'
import { connect } from 'react-redux'
import Clock from 'react-live-clock';
import classes from './style.less'
import { get, isEmpty } from 'lodash';
import DropDown from 'components/dropdown'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom';
import Note from 'components/order_note'
import { withTranslation } from 'react-i18next';

class DeliveryBillHeader extends Component {
    constructor(props) {
        super(props);
        const { order } = this.props;
        this.state = {
            chosen: order.address

        }
    }
    renderTime = () => {
        return <div className={classes.time_details}>
            <p> <Clock format={'DD/MM/YYYY , HH:mm A'} ticking={true} /></p>
        </div>
    }

    renderMinPurchase = () => {
        return <></>
        // return <p id={classes.purchase}>{`Minimum Purchase \xa0 \xa0 \xa0 0.00`}</p>
    }

    renderOrderDetails = () => {
        return <div className={classes.details}>
            {this.renderModeBranch()}
            {this.renderCustomerAgentFees()}
        </div>
    }

    renderModeBranch = () => {
        const { order, mode, agent, sub_mode, t } = this.props
        return <div className={classes.mode_branch}>
            {mode.key == 'CC' ? <p>{`${t(sub_mode.name)} #${order.num}`}</p> :
                <p >{`${t(mode.name)} #${order.num}`}</p>}
            <p>{t('Agent')}: {agent.name}</p>

            {mode.key != 'Ev' && <p>Branch: {this.renderBranch(mode.key)} </p>}
        </div>
    }

    setChoice = (id) => {
        const { order, setMain } = this.props
        this.setState({
            chosen: id
        })
        setMain('orders__main', {
            item: {
                id: order.id,
                address: id,
                action: 'update',
            }
        })
        // setPath('orders__main', `data.${order.id}.address`, id)
    }

    renderDropDown = (customer) => {
        const { order = {} } = this.props
        const list = applyFilters({
            key: 'Filter',
            path: `parties__address`,
            params: {
                customer: customer.id
            }
        })
        const order_address = applyFilters({ path: `parties__address.data.${order.address}` })
        if (!isEmpty(list)) {
            if (list.length == 1) {
                return <p>{get(order_address, 'address', "")}</p>
            }
            else {
                return <DropDown
                    data={list}
                    btnClass={classes.header_btn}
                    clickedclass={classes.header_btn_active}
                    onChange={this.setChoice}
                    value={order.address}
                    show="address"
                    fontSize='0.8rem'
                    only="true"
                // active={order.address}
                >
                </DropDown>
            }
        }
        else
            return <></>

    }
    customerHandle = () => {
        const { history } = this.props
        history.push('/list/customer');
    }
    renderCustomerAgentFees = () => {

        const { customer, mode, order, event, SP, t } = this.props
        const lead_time = applyFilters({
            key: 'chain',
            selectors: {
                "parties__address": "address",
                "geographies__street": "street",
                "geographies__area": 'area',
            },
            display: "time"
        }, order)

        return <div className={classes.leftContainer}>
            <div className={classes.customer_agent_fees}>
                {this.renderSP()}

                <div className={classes.row}>
                    {(mode.key == 'CC' && lead_time) && <p>{lead_time} {t('minutes')}</p>}
                    {!isEmpty(order.customer) ? <p>{customer.name || event.event_name}</p> : <p> {SP.service}</p>}
                    {/* // <button className={classes.customerName_btn} onClick={this.customerHandle} >Customer Name</button>} */}
                </div>
                {mode.key == 'CC' && this.renderDropDown(customer)}

            </div>
            <Note order={order}></Note>
        </div>


    }

    renderSP = () => {
        const { order } = this.props
        const sp = applyFilters({
            key: 'Find',
            path: `delivery_service`,
            params: {
                id: order.sp
            }
        })
        return <p>{get(sp, 'name', '')}</p>
    }


    renderBranch = () => {
        const { order } = this.props
        const pick = applyFilters({
            key: 'Find',
            path: 'licensing__location',
            params: {
                id: get(order, 'pick_location', false) || get(order, 'served_location', false)
            }
        })
        return get(pick, 'full_name', '')

    }

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.time_purchase}>
                    {this.renderTime()}
                    {this.renderMinPurchase()}
                </div>
                {this.renderOrderDetails()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    order: get(state.orders__main.data, state.orders__main.active, {}),
    get customer() {
        return get(state.parties__customer.data, this.order.customer, '')
    },
    get SP() {
        return get(state.delivery_service.data, this.order.SP, '')
    },
    get event() {
        return get(state.parties__reservation.data, this.order.event, '')
    },
    get agent() { return get(state.auths__user.data, this.order.serve, {}) },
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    get sub_mode() { return get(state.settings__sub_mode.data, this.order.sub_mode || state.settings__sub_mode.active, {}) },

    // location: get(state.licensing__location.data, state.licensing__location.pickup, {}) ||
    //     get(state.licensing__location.data, state.licensing__chain.active, {}),
    get location() {
        return get(state.licensing__location.data, this.order.served_location, {})
    },
    get chain() { return get(state.licensing__chain.data, this.location.chain, {}) },
})

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(DeliveryBillHeader)))