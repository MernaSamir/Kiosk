import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main';
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters';
import EditAction from 'components/edit_action'
import { get, find } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less'

class SummeryHeader extends Component {

    back = () => {
        const { history } = this.props
        history.goBack()
    }

    // startOrder = () => {
    //     const { order, history, setMain, business_day, customer_address } = this.props
    //     if (order) {
    //         message.warning('Please Close Order First')
    //     }
    //     else {
    //         if (moment().diff(moment(business_day.created_at), 'day') == 0) {
    //             const data = applyFilters({
    //                 key: 'mapSelect',
    //                 select: {
    //                     serve: 'main.current.id',
    //                     mode: 'settings__mode.active',
    //                     shift: 'orders__shifts.active',
    //                     station: 'licensing__station.active',
    //                     customer: 'parties__customer.active',
    //                     // sub_mode: 'settings__sub_mode.active',
    //                     sub_mode: 'e8fff7f9-2243-4c9b-97cc-c7f1a5f9ec2e',
    //                 }
    //             })
    //             setMain('orders__main', {
    //                 item: {
    //                     ...data, action: 'add', start_time: new Date(), address: customer_address,
    //                     onSuccess() {
    //                         history.push('/home')
    //                         return []
    //                     }
    //                 }
    //             })
    //         }
    //         else {
    //             message.warning('You Cannot Order in this business day please end Day First')
    //         }
    //     }
    // }

    orderType = () => {
        const { setMain, mode } = this.props
        const sub_modes = applyFilters({
            key: 'Filter',
            path: 'settings__sub_mode',
            params: {
                mode: mode.id
            }
        })
        if (sub_modes.length > 0) {
            setMain('popup', {
                popup: {
                    type: 'OrderType', visable: true, width: "50%"
                }
            })
        }
    }

    render() {
        const { customer,mode } = this.props
        return (
            <div className={classes.sum_header}>
                <button type="button" className={classes.button} onClick={this.back}>
                    <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
                    <p>Back</p>
                </button>
                <p> {customer ? customer.name : undefined}</p>
               {mode.key=='CC'&&<button className={classes.startOrd} onClick={this.orderType.bind()}>Start Order</button>}
                <EditAction onClick="EditCustomer" customer={customer} classStyle={classes.editBtn} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    order: state.orders__main.active,
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    customer_address: get(find(state.parties__address.data, { customer: state.parties__customer.active }), 'id', ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SummeryHeader))