import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import { get, map, find, } from 'lodash';
import { message } from 'antd';
import classes from './style.less';

class OrderType extends Component {

    constructor(props) {
        super(props)
        this.tabs = applyFilters({
            key: 'Filter',
            path: "settings__sub_mode",
            params: {
                mode: props.mode.id,
            }
        })
    }

    renderOptions = () => {
        return map(this.tabs, (d, key) => (
            <button key={key} className={classes.options_btn}
                // disabled={this.disable(d)}
                onClick={this.choose.bind(this, d.key, d.id)}>
                <p>{d.name}</p>
            </button>
        ))
    }


    disable = (elment) => {
        const { customer_address } = this.props
        if (customer_address == "" && elment.key == "delivery") {
            return true
        }
        return false
    }

    choose = (key, sub_mode) => {
        const { setMain, customer, chain, customer_address, values, orderDetails, prices, change, currentOrder } = this.props
        let childProps = {}
        if (key == 'delivery') {
            if (customer_address == "") {
                message.warning('You Have To Insert Address first')
                return
            }
            childProps = {
                path: 'parties__address',
                params: {
                    customer: customer
                },
                sub_mode, filter: 'address', customer, values, orderDetails, prices,
                change, currentOrder
            }
        }

        else {
            childProps = {
                path: 'licensing__location',
                params: {
                    // chain: chain,
                    // _type: 'sb'
                },
                sub_mode, filter: 'pick_location', customer, values, orderDetails, prices,
                change, currentOrder
            }
        }
        if (!change) {
            setMain('settings__sub_mode', { active: sub_mode })
        }
        setMain('popup', {
            popup: {
                type: 'Choose', visable: true, width: "50%",
                childProps
            }
        })
    }

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    order: state.orders__main.active,
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    customer: state.parties__customer.active || props.customer,
    get customer_address() {
        return get(find(state.parties__address.data,
            { customer: this.customer }), 'id', '')
    },
    chain: state.licensing__chain.active,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderType))