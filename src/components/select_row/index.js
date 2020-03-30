import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import { withRouter } from 'react-router'
import { message } from 'antd';
import { get, find, filter, isNull } from 'lodash';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

class SelectRow extends Component {
    tackAction = () => {
        const { onClick, onAction ,row, authorize=true} = this.props
        if(authorize){
            console.log('here in action')
            if (onAction) {
                onAction(row.id)
            }
            else {
                get(this, onClick, () => { })()
            }
        }
    }
    activeOrder = () => {
        const { history, row = {}, setMain, t } = this.props
        if (isNull(row.delivery_person)) {
            setMain("orders__main", { active: row.id })
            history.push('/home')
        }
        else {
            message.warning(t('This Order With A Delivery Person'))
        }

    }

    SetActiveCustomer = () => {
        const { history, row = {}, setMain, order, active_mode, t } = this.props
        if (order) {
            if (active_mode.key == 'TW') {
                console.log('iaaam here in set')
                setMain("orders__main", {
                    item: {
                        id: order, customer: row.id, action: 'update', onSuccess() {
                            history.push('/home')
                            return []
                        }
                    }
                })
            } else if (!order.customer) {
                const address = applyFilters({
                    path: 'parties__address',
                    key: 'Find',
                    params: {
                        customer: row.id,
                    }
                }) || {}
                setMain("orders__main", {
                    item: {
                        id: order,
                        customer: row.id,
                        address: address.id,
                        action: 'update', onSuccess() {
                            history.push('/home')
                            return []
                        }
                    }
                })
            }
            else
                message.warning(t('Please Close Order First'))

        }
        else {
            if (active_mode.key == 'CT') {
                setMain('parties__customer', { active: row.id })
                history.push('/new_cat')
            }

            else {
                this.orderType()
            }
        }
    }

    orderType = () => {
        const { row = {}, setMain } = this.props
        setMain('parties__customer', { active: row.id })
        setMain('popup', {
            popup: {
                type: 'OrderType', visable: true, width: "50%"
            }
        })
    }

    startOrder = () => {
        const { history, setMain, business_day, order, sub_mode, alt_sub_mode, row, t } = this.props
        const filter = this.getFilter()
        const address = this.getAddress()
        const subMode = sub_mode || alt_sub_mode.id
        if (order) {
            if (order.customer) {
                message.warning(t('Please Close Order First'))
            } else {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        customer: 'parties__customer.active',

                    }
                })
                setMain('orders__main', {
                    item: {
                        ...data,
                        action: 'update',
                        start_time: new Date(),
                        onSuccess() {
                            history.push('/home')
                            return [{
                                type: "set_main_popup",
                                data: { popup: {} }
                            }]
                        }
                    }
                })
            }
        }
        else {
            if (moment().diff(moment(business_day.created_at), 'day') == 0) {
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active',
                    }
                })
                setMain('orders__main', {
                    item: {
                        ...data, sub_mode: subMode, [filter]: address, customer: row.id,
                        action: 'add',
                        start_time: new Date(),
                        onSuccess() {
                            history.push('/home')
                            return [{
                                type: "set_main_popup",
                                data: { popup: {} }
                            }]
                        }
                    }
                })
            }
            else {
                message.warning(t('You Cannot Order in this business day please end Day First'))
            }
        }
    }

    getFilter = () => {
        const { sub_mode, alt_sub_mode } = this.props
        const subMode = sub_mode || alt_sub_mode.id
        const filtername = applyFilters({
            path: `settings__sub_mode.data.${subMode}`
        })
        if (filtername.key == 'delivery') {
            return 'address'
        }
        return 'pick_location'
    }


    getAddress = () => {
        const { sub_mode, alt_sub_mode, customer_address, pickup } = this.props
        const subMode = sub_mode || alt_sub_mode.id
        const filtername = applyFilters({
            path: `settings__sub_mode.data.${subMode}`
        })
        if (filtername.key == 'delivery') {
            return customer_address
        }
        return pickup
    }

    render() {
        return (
            <div  onClick={this.tackAction} style={{ paddingLeft: '1vw', color: '#d73f7c' }}>
                <FontAwesomeIcon icon='chevron-right' />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    item: state.item,
    order: state.orders__main.active,
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    customer_address: get(find(filter(state.parties__address.data,
        { customer: state.parties__customer.active || props.row.id }), { is_active: true }), 'id', ''),
    mode: get(state.settings__mode, 'active', {}),
    get active_mode() { return get(state.settings__mode.data, this.mode, {}) },
    get alt_sub_mode() { return find(state.settings__sub_mode.data, { mode: this.mode }) },
    sub_mode: get(state.settings__sub_mode, 'active', ''),
    pickup: get(state.licensing__location, 'pickup', ''),
    address: find(state.parties__address, { is_active: true })
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SelectRow)))