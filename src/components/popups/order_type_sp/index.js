import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import { get, map, find } from 'lodash';
import classes from './style.less';

class OrderTypeSP extends Component {

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
                onClick={this.choose.bind(this, d.key, d.id)}>
                <p>{d.name}</p>
            </button>
        ))
    }

    choose = (key, sub_mode) => {
        const { setMain, chain, startOrder, getFilter } = this.props
        let childProps = {}
        if (key == 'delivery') {
            getFilter('address')
            childProps = {
                filter: 'address',
                startDOrder: startOrder
            }
        }

        else {
            getFilter('pick_location')
            childProps = {
                path: 'licensing__location',
                params: {
                    chain: chain,
                },
                sub_mode,
                filter: 'pick_location'
            }
        }
        setMain('settings__sub_mode', { active: sub_mode })
        setMain('popup', {
            popup: {
                type: 'ChooseSP', visable: true, width: "50%",
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

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    order: state.orders__main.active,
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    customer_address: get(find(state.parties__address.data,
        { customer: state.parties__customer.active }), 'id', ''),
    customer: state.parties__customer.active,
    chain: state.licensing__chain.active,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderTypeSP))